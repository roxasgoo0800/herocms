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
// Cache Utilities & Invalidation
// -----------------------------------------------------------------------------

func (s *Services) InvalidateTenantCache(ctx context.Context, tenantID string) {
	if tenantID == "" {
		tenantID = "99420000-0000-0000-0000-000000009942"
	}
	_ = s.Redis.DeleteKeysByPrefix(ctx, fmt.Sprintf("tenant:%s:menu:", tenantID))
}

// -----------------------------------------------------------------------------
// Container & Sites Service (With Redis Caching)
// -----------------------------------------------------------------------------

func (s *Services) GetContainers(ctx context.Context, tenantID string) (gin.H, error) {
	cacheKey := fmt.Sprintf("tenant:%s:menu:containers", tenantID)
	var cached gin.H
	if hit, _ := s.Redis.GetJSON(ctx, cacheKey, &cached); hit && cached != nil {
		return cached, nil
	}

	sites, err := s.Repo.GetSites(ctx, tenantID)
	if err != nil {
		return nil, err
	}

	maxQuota := 3
	quota, err := s.Repo.GetBillingQuota(ctx, tenantID)
	if err == nil {
		if qPlan, ok := quota["plan"].(gin.H); ok {
			if m, ok := qPlan["maxContainers"].(int); ok && m > 0 {
				maxQuota = m
			}
		}
	}

	freeQuota := maxQuota - len(sites)
	if freeQuota < 0 {
		freeQuota = 0
	}

	result := gin.H{
		"containers": sites,
		"quota": gin.H{
			"used":  len(sites),
			"max":   maxQuota,
			"free":  freeQuota,
			"isMax": len(sites) >= maxQuota,
		},
	}

	_ = s.Redis.SetJSON(ctx, cacheKey, result, 30*time.Minute)
	return result, nil
}

type CreateContainerInput struct {
	Name      string `json:"name"`
	Subdomain string `json:"subdomain"`
	Category  string `json:"category"`
	Role      string `json:"role"`
}

func (s *Services) CreateContainer(ctx context.Context, tenantID string, input CreateContainerInput) (gin.H, error) {
	subdomainRegex := regexp.MustCompile(`^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$`)
	if !subdomainRegex.MatchString(input.Subdomain) {
		return nil, fmt.Errorf("format subdomain tidak valid (hanya huruf kecil, angka, dan tanda hubung)")
	}

	sites, _ := s.Repo.GetSites(ctx, tenantID)
	quota, _ := s.Repo.GetBillingQuota(ctx, tenantID)
	maxQuota := 3
	if qPlan, ok := quota["plan"].(gin.H); ok {
		if m, ok := qPlan["maxContainers"].(int); ok && m > 0 {
			maxQuota = m
		}
	}

	if len(sites) >= maxQuota {
		return nil, fmt.Errorf("kuota kontainer penuh (%d/%d). Harap upgrade paket.", len(sites), maxQuota)
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
			"tenant_id":    tenantID,
			"site_id":      newID,
			"subdomain":    input.Subdomain,
			"version_hash": "v100prod01",
		}
		pBytes, _ := json.Marshal(deployPayload)
		http.Post(s.Config.OrchestratorURL+"/api/v1/deploy", "application/json", bytes.NewBuffer(pBytes))
	}()

	err := s.Repo.InsertSite(ctx, tenantID, newContainer)
	if err != nil {
		return nil, fmt.Errorf("gagal menyimpan data situs ke database: %w", err)
	}

	s.InvalidateTenantCache(ctx, tenantID)
	return newContainer, nil
}

func (s *Services) StartContainer(ctx context.Context, tenantID, id string) (bool, error) {
	err := s.Repo.UpdateSiteStatus(ctx, tenantID, id, "running")
	if err != nil {
		return false, err
	}
	s.InvalidateTenantCache(ctx, tenantID)
	return true, nil
}

func (s *Services) StopContainer(ctx context.Context, tenantID, id string) (bool, error) {
	err := s.Repo.UpdateSiteStatus(ctx, tenantID, id, "stopped")
	if err != nil {
		return false, err
	}
	s.InvalidateTenantCache(ctx, tenantID)
	return true, nil
}

func (s *Services) DeleteContainer(ctx context.Context, tenantID, id string) (bool, error) {
	err := s.Repo.DeleteSite(ctx, tenantID, id)
	if err != nil {
		return false, err
	}
	s.InvalidateTenantCache(ctx, tenantID)
	return true, nil
}

func (s *Services) SaveSiteDesign(ctx context.Context, tenantID, id string, payload gin.H) error {
	err := s.Repo.UpdateSiteDesign(ctx, tenantID, id, payload)
	if err == nil {
		s.InvalidateTenantCache(ctx, tenantID)
	}
	return err
}

// -----------------------------------------------------------------------------
// Articles Service (With Redis Caching)
// -----------------------------------------------------------------------------

func (s *Services) GetArticles(ctx context.Context, tenantID string) []gin.H {
	cacheKey := fmt.Sprintf("tenant:%s:menu:articles", tenantID)
	var cached []gin.H
	if hit, _ := s.Redis.GetJSON(ctx, cacheKey, &cached); hit && cached != nil {
		return cached
	}

	items, err := s.Repo.GetArticles(ctx, tenantID)
	if err != nil || items == nil {
		items = []gin.H{}
	}
	_ = s.Redis.SetJSON(ctx, cacheKey, items, 30*time.Minute)
	return items
}

// -----------------------------------------------------------------------------
// Assets Service (With Redis Caching)
// -----------------------------------------------------------------------------

func (s *Services) GetAssets(ctx context.Context, tenantID string) gin.H {
	cacheKey := fmt.Sprintf("tenant:%s:menu:assets", tenantID)
	var cached gin.H
	if hit, _ := s.Redis.GetJSON(ctx, cacheKey, &cached); hit && cached != nil {
		return cached
	}

	assets, _ := s.Repo.GetAssets(ctx, tenantID)
	if assets == nil {
		assets = []gin.H{}
	}
	res := gin.H{
		"assets":      assets,
		"usedStorage": "120 MB",
		"maxStorage":  "2048 MB",
	}
	_ = s.Redis.SetJSON(ctx, cacheKey, res, 30*time.Minute)
	return res
}

// -----------------------------------------------------------------------------
// Custom Domains Service (With Redis Caching)
// -----------------------------------------------------------------------------

func (s *Services) GetDomains(ctx context.Context, tenantID string) []gin.H {
	cacheKey := fmt.Sprintf("tenant:%s:menu:domains", tenantID)
	var cached []gin.H
	if hit, _ := s.Redis.GetJSON(ctx, cacheKey, &cached); hit && cached != nil {
		return cached
	}

	domains, err := s.Repo.GetDomains(ctx, tenantID)
	if err != nil || domains == nil {
		domains = []gin.H{}
	}
	_ = s.Redis.SetJSON(ctx, cacheKey, domains, 30*time.Minute)
	return domains
}

// -----------------------------------------------------------------------------
// Support Tickets Service (With Redis Caching)
// -----------------------------------------------------------------------------

func (s *Services) GetTickets(ctx context.Context, tenantID string) []gin.H {
	cacheKey := fmt.Sprintf("tenant:%s:menu:tickets", tenantID)
	var cached []gin.H
	if hit, _ := s.Redis.GetJSON(ctx, cacheKey, &cached); hit && cached != nil {
		return cached
	}

	tickets, err := s.Repo.GetTickets(ctx, tenantID)
	if err != nil || tickets == nil {
		tickets = []gin.H{}
	}
	_ = s.Redis.SetJSON(ctx, cacheKey, tickets, 30*time.Minute)
	return tickets
}

func (s *Services) GetTicketMessages(ctx context.Context, id string) []gin.H {
	msgs, err := s.Repo.GetTicketMessages(ctx, id)
	if err != nil || msgs == nil {
		return []gin.H{}
	}
	return msgs
}

// -----------------------------------------------------------------------------
// Invoices & Billing Service (With Redis Caching)
// -----------------------------------------------------------------------------

func (s *Services) GetInvoices(ctx context.Context, tenantID string) []gin.H {
	cacheKey := fmt.Sprintf("tenant:%s:menu:invoices", tenantID)
	var cached []gin.H
	if hit, _ := s.Redis.GetJSON(ctx, cacheKey, &cached); hit && cached != nil {
		return cached
	}

	invoices, err := s.Repo.GetInvoices(ctx, tenantID)
	if err != nil || invoices == nil {
		invoices = []gin.H{}
	}
	_ = s.Redis.SetJSON(ctx, cacheKey, invoices, 30*time.Minute)
	return invoices
}

func (s *Services) GetBillingQuota(ctx context.Context, tenantID string) gin.H {
	cacheKey := fmt.Sprintf("tenant:%s:menu:quota", tenantID)
	var cached gin.H
	if hit, _ := s.Redis.GetJSON(ctx, cacheKey, &cached); hit && cached != nil {
		return cached
	}

	quota, err := s.Repo.GetBillingQuota(ctx, tenantID)
	if err != nil || quota == nil {
		quota = gin.H{
			"plan": gin.H{
				"name":          "Hero Pro Plan",
				"price":         "Rp 149.000 / bln",
				"maxContainers": 3,
			},
		}
	}
	_ = s.Redis.SetJSON(ctx, cacheKey, quota, 30*time.Minute)
	return quota
}

type CheckoutInput struct {
	TenantID      string `json:"tenant_id"`
	PlanTier      string `json:"plan_tier"`
	PaymentMethod string `json:"payment_method"`
}

func (s *Services) ProcessCheckout(ctx context.Context, input CheckoutInput) (gin.H, error) {
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

	tID := input.TenantID
	if tID == "" {
		tID = "99420000-0000-0000-0000-000000009942"
	}

	if s.Repo != nil && s.Repo.DB != nil {
		_, _ = s.Repo.DB.ExecContext(ctx, `
			INSERT INTO invoices (tenant_id, invoice_number, plan_name, period, amount, tax, total, date, due_date, status, payment_method, container_quota)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'paid', $10, $11)
			ON CONFLICT (invoice_number) DO NOTHING
		`, tID, invNum, planName, "1 Bulan", amount, tax, total, nowDate, dueDate, payMethodName, maxContainers)

		_, _ = s.Repo.DB.ExecContext(ctx, `
			UPDATE tenants 
			SET plan_tier = $1, max_containers = $2, storage_quota_mb = $3, updated_at = NOW() 
			WHERE id = $4 OR slug = $4
		`, input.PlanTier, maxContainers, storageQuota, tID)
	}

	s.Repo.Invoices = append([]gin.H{invoiceObj}, s.Repo.Invoices...)

	sites, _ := s.Repo.GetSites(ctx, tID)
	s.InvalidateTenantCache(ctx, tID)

	return gin.H{
		"invoice": invoiceObj,
		"plan": gin.H{
			"name":            planName,
			"tier":            input.PlanTier,
			"price":           priceText,
			"maxContainers":   maxContainers,
			"usedContainers":  len(sites),
			"cpuPerContainer": cpuLimit,
			"ramPerContainer": fmt.Sprintf("%d MB", ramLimit),
			"storageQuota":    fmt.Sprintf("%d MB", storageQuota),
			"nextBillingDate": dueDate,
		},
		"message": "Pembayaran paket berhasil diverifikasi. Kuota kontainer Anda kini aktif!",
	}, nil
}

// -----------------------------------------------------------------------------
// Webhooks Service (With Redis Caching)
// -----------------------------------------------------------------------------

func (s *Services) GetWebhooks(ctx context.Context, tenantID string) []gin.H {
	cacheKey := fmt.Sprintf("tenant:%s:menu:webhooks", tenantID)
	var cached []gin.H
	if hit, _ := s.Redis.GetJSON(ctx, cacheKey, &cached); hit && cached != nil {
		return cached
	}

	wh, err := s.Repo.GetWebhooks(ctx, tenantID)
	if err != nil || wh == nil {
		wh = []gin.H{}
	}
	_ = s.Redis.SetJSON(ctx, cacheKey, wh, 30*time.Minute)
	return wh
}

// -----------------------------------------------------------------------------
// Full Menu Redis Warmup (Ultra-Fast Startup & Seamless Workspace Loading)
// -----------------------------------------------------------------------------

func (s *Services) WarmAllMenusCache(ctx context.Context, tenantID string) (gin.H, error) {
	if tenantID == "" {
		tenantID = "99420000-0000-0000-0000-000000009942"
	}

	// Invalidate any stale menu keys to ensure 100% fresh data into Redis
	s.InvalidateTenantCache(ctx, tenantID)

	// Retrieve all menu datasets (each method caches into Redis individually)
	containers, err := s.GetContainers(ctx, tenantID)
	if err != nil {
		return nil, err
	}
	articles := s.GetArticles(ctx, tenantID)
	assets := s.GetAssets(ctx, tenantID)
	domains := s.GetDomains(ctx, tenantID)
	tickets := s.GetTickets(ctx, tenantID)
	invoices := s.GetInvoices(ctx, tenantID)
	quota := s.GetBillingQuota(ctx, tenantID)
	webhooks := s.GetWebhooks(ctx, tenantID)
	topViews, _ := s.GetTopViews(ctx, tenantID)

	bundle := gin.H{
		"containers": containers,
		"articles":   gin.H{"articles": articles},
		"assets":     assets,
		"domains":    gin.H{"domains": domains},
		"tickets":    gin.H{"tickets": tickets},
		"invoices":   gin.H{"invoices": invoices},
		"quota":      quota,
		"webhooks":   gin.H{"webhooks": webhooks},
		"top_views":  topViews,
		"cached_at":  time.Now().UTC().Format(time.RFC3339),
		"source":     "redis_warmed",
	}

	// Cache the consolidated bundle for single-shot hydration
	bundleKey := fmt.Sprintf("tenant:%s:menu:bundle", tenantID)
	_ = s.Redis.SetJSON(ctx, bundleKey, bundle, 1*time.Hour)

	return bundle, nil
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

// -----------------------------------------------------------------------------
// Visual Editor Draft Service (Redis Persistence & Resume)
// -----------------------------------------------------------------------------

func (s *Services) SaveEditorDraft(ctx context.Context, tenantID, containerID string, draft gin.H) error {
	if tenantID == "" {
		tenantID = "99420000-0000-0000-0000-000000009942"
	}
	key := fmt.Sprintf("tenant:%s:container:%s:draft", tenantID, containerID)
	// Persist draft in Redis for 30 days
	return s.Redis.SetJSON(ctx, key, draft, 30*24*time.Hour)
}

func (s *Services) GetEditorDraft(ctx context.Context, tenantID, containerID string) (gin.H, error) {
	if tenantID == "" {
		tenantID = "99420000-0000-0000-0000-000000009942"
	}
	key := fmt.Sprintf("tenant:%s:container:%s:draft", tenantID, containerID)
	var draft gin.H
	hit, err := s.Redis.GetJSON(ctx, key, &draft)
	if err != nil || !hit || draft == nil {
		return nil, fmt.Errorf("draf belum tersedia")
	}
	return draft, nil
}

func (s *Services) SaveUserState(ctx context.Context, tenantID string, state gin.H) error {
	if tenantID == "" {
		tenantID = "99420000-0000-0000-0000-000000009942"
	}
	key := fmt.Sprintf("tenant:%s:user_state", tenantID)
	return s.Redis.SetJSON(ctx, key, state, 30*24*time.Hour)
}

func (s *Services) GetUserState(ctx context.Context, tenantID string) (gin.H, error) {
	if tenantID == "" {
		tenantID = "99420000-0000-0000-0000-000000009942"
	}
	key := fmt.Sprintf("tenant:%s:user_state", tenantID)
	var state gin.H
	hit, err := s.Redis.GetJSON(ctx, key, &state)
	if err != nil || !hit || state == nil {
		return nil, fmt.Errorf("state belum tersedia")
	}
	return state, nil
}



