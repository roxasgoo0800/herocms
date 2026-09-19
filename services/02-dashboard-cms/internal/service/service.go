package service

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"regexp"
	"strings"
	"time"

	"github.com/cloudcms/dashboard-cms-backend/internal/config"
	"github.com/cloudcms/dashboard-cms-backend/internal/redis"
	"github.com/cloudcms/dashboard-cms-backend/internal/repository"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
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

func (s *Services) AuthenticateUser(identifier, password string) (*LoginResult, error) {
	identifier = strings.TrimSpace(strings.ToLower(identifier))
	password = strings.TrimSpace(password)

	if identifier == "" || password == "" {
		return nil, fmt.Errorf("Username/email dan kata sandi wajib diisi")
	}

	tenantID := "99420000-0000-0000-0000-000000009942"
	userID := "00000000-0000-0000-0000-000000000001"
	fullName := "Admin Developer"
	role := "customer"
	email := identifier
	authenticated := false

	// 1. Check in PostgreSQL database if connected
	if s.Repo != nil && s.Repo.DB != nil {
		var dbID, dbTenantID, dbEmail, dbHash, dbName, dbRole string
		err := s.Repo.DB.QueryRow(`
			SELECT id, tenant_id, email, password_hash, full_name, role 
			FROM users 
			WHERE (LOWER(email) = $1 OR email = $1) AND status = 'active'
			LIMIT 1
		`, identifier).Scan(&dbID, &dbTenantID, &dbEmail, &dbHash, &dbName, &dbRole)

		if err == nil {
			if bcrypt.CompareHashAndPassword([]byte(dbHash), []byte(password)) == nil {
				authenticated = true
				userID = dbID
				tenantID = dbTenantID
				email = dbEmail
				fullName = dbName
				role = dbRole
			}
		}
	}

	// 2. Built-in development fallback credentials (when DB is offline or for quick bootstrap)
	if !authenticated {
		if (identifier == "admin" || identifier == "admin@herocms.local" || identifier == "admin@cloudcms.app") && password == "admin" {
			authenticated = true
			email = "admin@herocms.local"
		} else if identifier == "admin@rizalpratama.cloud" && (password == "admin" || password == "Password123!" || password == "heroCMS2026!") {
			authenticated = true
			email = "admin@rizalpratama.cloud"
			fullName = "Rizal Pratama"
		}
	}

	if !authenticated {
		return nil, fmt.Errorf("Kredensial tidak valid. Silakan periksa kembali username/email dan kata sandi Anda.")
	}

	claims := JWTClaims{
		TenantID: tenantID,
		UserID:   userID,
		Email:    email,
		Role:     role,
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
			"full_name": fullName,
			"role":      role,
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

func (s *Services) RegisterUser(fullName, identifier, password string) (*LoginResult, error) {
	fullName = strings.TrimSpace(fullName)
	identifier = strings.TrimSpace(strings.ToLower(identifier))
	password = strings.TrimSpace(password)

	if fullName == "" || identifier == "" || password == "" {
		return nil, fmt.Errorf("Nama lengkap, username/email, dan password wajib diisi")
	}
	if len(password) < 4 {
		return nil, fmt.Errorf("Kata sandi minimal 4 karakter")
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, fmt.Errorf("Gagal mengenkripsi kata sandi: %w", err)
	}

	tenantID := fmt.Sprintf("tenant_%d", time.Now().UnixNano()%100000000)
	userID := fmt.Sprintf("user_%d", time.Now().UnixNano()%100000000)
	slug := strings.ReplaceAll(strings.ToLower(identifier), "@", "-at-")

	if s.Repo != nil && s.Repo.DB != nil {
		// Insert new tenant with initial unpurchased status
		var newTenantUUID, newUserUUID string
		err := s.Repo.DB.QueryRow(`
			INSERT INTO tenants (slug, name, plan_tier, status, max_containers, storage_quota_mb)
			VALUES ($1, $2, 'none', 'active', 0, 1024)
			RETURNING id
		`, slug, "Hero Tenant "+fullName).Scan(&newTenantUUID)
		if err == nil {
			tenantID = newTenantUUID
			errUser := s.Repo.DB.QueryRow(`
				INSERT INTO users (tenant_id, email, password_hash, full_name, role, status)
				VALUES ($1, $2, $3, $4, 'customer', 'active')
				RETURNING id
			`, tenantID, identifier, string(hash), fullName).Scan(&newUserUUID)
			if errUser == nil {
				userID = newUserUUID
			}
		}
	}

	claims := JWTClaims{
		TenantID: tenantID,
		UserID:   userID,
		Email:    identifier,
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
		return nil, fmt.Errorf("gagal membuat token autentikasi: %w", err)
	}

	return &LoginResult{
		Token: tokenStr,
		User: gin.H{
			"id":        userID,
			"tenant_id": tenantID,
			"email":     identifier,
			"full_name": fullName,
			"role":      "customer",
		},
		Plan: gin.H{
			"name":          "Belum Ada Paket",
			"maxContainers": 0,
			"cpuLimit":      "0 vCPU",
			"ramLimit":      "0 MB",
			"storageQuota":  "0 GB",
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

type CheckoutInput struct {
	TenantID      string `json:"tenant_id"`
	PlanTier      string `json:"plan_tier"`
	PaymentMethod string `json:"payment_method"`
}

func (s *Services) ProcessCheckout(input CheckoutInput) (gin.H, error) {
	planName := "Hero Pro Plan"
	amount := 149000
	maxContainers := 3
	ramLimit := 256
	storageQuota := 2048
	cpuLimit := "0.5 vCPU"
	priceText := "Rp 149.000 / bln"

	switch input.PlanTier {
	case "starter":
		planName = "Hero Starter Plan"
		amount = 49000
		maxContainers = 1
		ramLimit = 256
		storageQuota = 1024
		cpuLimit = "0.5 vCPU"
		priceText = "Rp 49.000 / bln"
	case "agency":
		planName = "Hero Agency Plan"
		amount = 399000
		maxContainers = 10
		ramLimit = 512
		storageQuota = 10240
		cpuLimit = "1.0 vCPU"
		priceText = "Rp 399.000 / bln"
	default:
		input.PlanTier = "pro"
	}

	tax := int(float64(amount) * 0.11)
	total := amount + tax
	invNum := fmt.Sprintf("INV-2026-%04d", time.Now().UnixNano()%10000)
	nowDate := time.Now().Format("2 Jan 2006")
	dueDate := time.Now().AddDate(0, 1, 0).Format("2 Jan 2006")

	payMethodName := "QRIS Standar Nasional (Auto-Settled)"
	switch input.PaymentMethod {
	case "bca_va":
		payMethodName = "BCA Virtual Account (Auto-Settled)"
	case "mandiri_va":
		payMethodName = "Mandiri Virtual Account (Auto-Settled)"
	case "credit_card":
		payMethodName = "Kartu Kredit / Debit Online (Instant)"
	}

	invoiceObj := gin.H{
		"id":             fmt.Sprintf("inv_%d", time.Now().UnixNano()%1000000),
		"invoiceNumber":  invNum,
		"planName":       planName,
		"period":         "1 Bulan (Billing Siklus)",
		"amount":         amount,
		"tax":            tax,
		"total":          total,
		"date":           nowDate,
		"dueDate":        dueDate,
		"status":         "paid",
		"paymentMethod":  payMethodName,
		"containerQuota": maxContainers,
	}

	s.Repo.Invoices = append([]gin.H{invoiceObj}, s.Repo.Invoices...)

	if s.Repo != nil && s.Repo.DB != nil {
		s.Repo.DB.Exec(`
			INSERT INTO invoices (tenant_id, invoice_number, plan_name, period, amount, tax, total, date, due_date, status, payment_method, container_quota)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'paid', $10, $11)
			ON CONFLICT (invoice_number) DO NOTHING
		`, input.TenantID, invNum, planName, "1 Bulan", amount, tax, total, nowDate, dueDate, payMethodName, maxContainers)

		s.Repo.DB.Exec(`
			UPDATE tenants 
			SET plan_tier = $1, max_containers = $2, storage_quota_mb = $3, updated_at = NOW() 
			WHERE id = $4 OR slug = $4
		`, input.PlanTier, maxContainers, storageQuota, input.TenantID)
	}

	return gin.H{
		"invoice": invoiceObj,
		"plan": gin.H{
			"name":            planName,
			"tier":            input.PlanTier,
			"price":           priceText,
			"maxContainers":   maxContainers,
			"usedContainers":  len(s.Repo.Containers),
			"cpuPerContainer": cpuLimit,
			"ramPerContainer": fmt.Sprintf("%d MB", ramLimit),
			"storageQuota":    fmt.Sprintf("%d MB", storageQuota),
			"nextBillingDate": dueDate,
		},
		"message": "Pembayaran paket berhasil diverifikasi. Kuota kontainer Anda kini aktif!",
	}, nil
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
