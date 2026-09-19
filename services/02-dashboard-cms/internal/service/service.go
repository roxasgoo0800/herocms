package service

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"regexp"
	"time"

	"github.com/cloudcms/dashboard-cms-backend/internal/config"
	"github.com/cloudcms/dashboard-cms-backend/internal/redis"
	"github.com/cloudcms/dashboard-cms-backend/internal/repository"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

type JWTClaims struct {
	TenantID string `json:"tenant_id"`
	UserID   string `json:"user_id"`
	Email    string `json:"email"`
	Role     string `json:"role"`
	jwt.RegisteredClaims
}

type Services struct {
	Config     *config.Config
	Repo       *repository.Repository
	Redis      *redis.Client
	JWTSecret  []byte
}

func NewServices(cfg *config.Config, repo *repository.Repository, rdb *redis.Client) *Services {
	return &Services{
		Config:    cfg,
		Repo:      repo,
		Redis:     rdb,
		JWTSecret: cfg.JWTSecret,
	}
}

// -----------------------------------------------------------------------------
// Authentication Service
// -----------------------------------------------------------------------------

type LoginResult struct {
	Token string `json:"token"`
	User  gin.H  `json:"user"`
	Plan  gin.H  `json:"plan"`
}

func (s *Services) AuthenticateUser(email, password string) (*LoginResult, error) {
	emailRegex := regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)
	if !emailRegex.MatchString(email) {
		return nil, fmt.Errorf("format email tidak valid")
	}

	tenantID := "99420000-0000-0000-0000-000000009942"
	userID := "11111111-1111-1111-1111-111111111111"

	claims := JWTClaims{
		TenantID: tenantID,
		UserID:   userID,
		Email:    email,
		Role:     "customer",
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Issuer:    "HeroCMS Studio Auth Service",
		},
	}

	tokenObj := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenStr, err := tokenObj.SignedString(s.JWTSecret)
	if err != nil {
		return nil, fmt.Errorf("gagal menandatangani token: %w", err)
	}

	return &LoginResult{
		Token: tokenStr,
		User: gin.H{
			"id":        userID,
			"tenant_id": tenantID,
			"email":     email,
			"full_name": "Rizal Pratama",
			"role":      "customer",
		},
		Plan: gin.H{
			"name":          "Hero Pro Plan",
			"maxContainers": 3,
			"cpuLimit":      "0.5 vCPU",
			"ramLimit":      "256 MB",
			"storageQuota":  "2 GB SSD",
		},
	}, nil
}

func (s *Services) RevokeSession(ctx context.Context, tokenHash string) error {
	if tokenHash == "" {
		return nil
	}
	return s.Redis.BlacklistToken(ctx, tokenHash, 24*time.Hour)
}

// -----------------------------------------------------------------------------
// Container & Sites Service
// -----------------------------------------------------------------------------

func (s *Services) GetContainers() (gin.H, error) {
	return gin.H{
		"containers": s.Repo.Containers,
		"quota": gin.H{
			"used":  len(s.Repo.Containers),
			"max":   3,
			"free":  3 - len(s.Repo.Containers),
			"isMax": len(s.Repo.Containers) >= 3,
		},
	}, nil
}

type CreateContainerInput struct {
	Name      string `json:"name"`
	Subdomain string `json:"subdomain"`
	Category  string `json:"category"`
	Role      string `json:"role"`
}

func (s *Services) CreateContainer(input CreateContainerInput) (gin.H, error) {
	subdomainRegex := regexp.MustCompile(`^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$`)
	if !subdomainRegex.MatchString(input.Subdomain) {
		return nil, fmt.Errorf("format subdomain tidak valid (hanya huruf kecil, angka, dan tanda hubung)")
	}

	if len(s.Repo.Containers) >= 3 {
		return nil, fmt.Errorf("kuota kontainer penuh (3/3). Harap upgrade paket.")
	}

	newID := fmt.Sprintf("hero_tenant_%d", time.Now().Unix()%9000+1000)
	tplName := "Portofolio Teknis Engineer"
	if input.Category == "blog" {
		tplName = "Editorial Media & Blog"
	} else if input.Category == "education" {
		tplName = "Pusat Edukasi LMS"
	} else if input.Category == "business" {
		tplName = "Showcase Bisnis & UMKM"
	}

	newContainer := gin.H{
		"id":             newID,
		"name":           input.Name,
		"category":       input.Category,
		"templateName":   tplName,
		"subdomain":      fmt.Sprintf("%s.cloudcms.app", input.Subdomain),
		"status":         "running",
		"cpuUsage":       12,
		"ramUsage":       76,
		"ramLimit":       256,
		"cpuLimit":       "0.5 vCPU",
		"uptime":         "Baru saja aktif",
		"visitsThisWeek": 0,
		"ssl":            true,
		"roleOrHeadline": input.Role,
		"accentColor":    "#2563eb",
		"lastDeployed":   "Baru saja",
	}

	// Trigger Go Provision Orchestrator asynchronously
	go func() {
		deployPayload := map[string]string{
			"tenant_id":    newID,
			"site_id":      newID,
			"subdomain":    input.Subdomain,
			"version_hash": "v100prod01",
		}
		pBytes, _ := json.Marshal(deployPayload)
		http.Post(s.Config.OrchestratorURL+"/api/v1/deploy", "application/json", bytes.NewBuffer(pBytes))
	}()

	s.Repo.Containers = append(s.Repo.Containers, newContainer)
	return newContainer, nil
}

func (s *Services) StartContainer(id string) (bool, error) {
	for _, c := range s.Repo.Containers {
		if c["id"] == id {
			c["status"] = "running"
			return true, nil
		}
	}
	return false, fmt.Errorf("kontainer #%s tidak ditemukan", id)
}

func (s *Services) StopContainer(id string) (bool, error) {
	for _, c := range s.Repo.Containers {
		if c["id"] == id {
			c["status"] = "stopped"
			return true, nil
		}
	}
	return false, fmt.Errorf("kontainer #%s tidak ditemukan", id)
}

func (s *Services) DeleteContainer(id string) (bool, error) {
	for i, c := range s.Repo.Containers {
		if c["id"] == id {
			s.Repo.Containers = append(s.Repo.Containers[:i], s.Repo.Containers[i+1:]...)
			return true, nil
		}
	}
	return false, fmt.Errorf("kontainer #%s tidak ditemukan", id)
}

// -----------------------------------------------------------------------------
// Articles Service
// -----------------------------------------------------------------------------

func (s *Services) GetArticles() []gin.H {
	return s.Repo.Articles
}

// -----------------------------------------------------------------------------
// Assets Service
// -----------------------------------------------------------------------------

func (s *Services) GetAssets() gin.H {
	return gin.H{
		"assets":      s.Repo.Assets,
		"usedStorage": "120 MB",
		"maxStorage":  "2048 MB",
	}
}

// -----------------------------------------------------------------------------
// Custom Domains Service
// -----------------------------------------------------------------------------

func (s *Services) GetDomains() []gin.H {
	return s.Repo.Domains
}

// -----------------------------------------------------------------------------
// Support Tickets Service
// -----------------------------------------------------------------------------

func (s *Services) GetTickets() []gin.H {
	return s.Repo.Tickets
}

func (s *Services) GetTicketMessages(id string) []gin.H {
	msgs := s.Repo.Messages[id]
	if msgs == nil {
		return []gin.H{}
	}
	return msgs
}

// -----------------------------------------------------------------------------
// Invoices & Billing Service
// -----------------------------------------------------------------------------

func (s *Services) GetInvoices() []gin.H {
	return s.Repo.Invoices
}

func (s *Services) GetBillingQuota() gin.H {
	return gin.H{
		"plan": gin.H{
			"name":            "Hero Pro Plan",
			"price":           "Rp 149.000 / bln",
			"maxContainers":   3,
			"usedContainers":  len(s.Repo.Containers),
			"cpuPerContainer": "0.5 vCPU",
			"ramPerContainer": "256 MB",
			"storageQuota":    "2 GB SSD",
			"usedStorage":     "120 MB",
			"nextBillingDate": "1 Okt 2026",
		},
	}
}

// -----------------------------------------------------------------------------
// Webhooks Service
// -----------------------------------------------------------------------------

func (s *Services) GetWebhooks() []gin.H {
	return s.Repo.Webhooks
}

// -----------------------------------------------------------------------------
// Analytics Service (Redis ZSET)
// -----------------------------------------------------------------------------

func (s *Services) GetTopViews(ctx context.Context, tenantID string) ([]redis.TopItem, error) {
	return s.Redis.GetTopViews(ctx, tenantID, 5)
}

func (s *Services) RecordHit(ctx context.Context, tenantID string, path string) error {
	return s.Redis.RecordTopView(ctx, tenantID, path)
}
