package handler

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"net/http"
	"time"

	"github.com/cloudcms/dashboard-cms-backend/internal/redis"
	"github.com/cloudcms/dashboard-cms-backend/internal/service"
	"github.com/gin-gonic/gin"
)

type Handler struct {
	Services *service.Services
}

func NewHandler(services *service.Services) *Handler {
	return &Handler{Services: services}
}

// -----------------------------------------------------------------------------
// Auth
// -----------------------------------------------------------------------------

type LoginPayload struct {
	Email      string `json:"email"`
	Username   string `json:"username"`
	Identifier string `json:"identifier"`
	Password   string `json:"password" binding:"required"`
}

func (h *Handler) Login(c *gin.Context) {
	var req LoginPayload
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Username/email dan password wajib diisi"})
		return
	}

	userKey := req.Email
	if userKey == "" {
		userKey = req.Username
	}
	if userKey == "" {
		userKey = req.Identifier
	}

	if userKey == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Username atau email wajib diisi"})
		return
	}

	result, err := h.Services.AuthenticateUser(userKey, req.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	// Generate Stateful Session & CSRF Token for PWA Cookie Architecture
	sessionBytes := make([]byte, 24)
	rand.Read(sessionBytes)
	sessionID := "sess_" + hex.EncodeToString(sessionBytes)

	csrfBytes := make([]byte, 16)
	rand.Read(csrfBytes)
	csrfToken := hex.EncodeToString(csrfBytes)

	// Save session in Redis
	sess := &redis.SessionData{
		SessionID: sessionID,
		UserID:    fmt.Sprintf("%v", result.User["id"]),
		TenantID:  fmt.Sprintf("%v", result.User["tenant_id"]),
		Email:     fmt.Sprintf("%v", result.User["email"]),
		FullName:  fmt.Sprintf("%v", result.User["full_name"]),
		Role:      fmt.Sprintf("%v", result.User["role"]),
		CSRFToken: csrfToken,
		IP:        c.ClientIP(),
		UserAgent: c.Request.UserAgent(),
		CreatedAt: time.Now(),
		ExpiresAt: time.Now().Add(30 * 24 * time.Hour),
	}
	h.Services.Redis.SaveSession(c.Request.Context(), sess, 30*24*time.Hour)

	// 1. Set HttpOnly Cookie for PWA / Browser Session (30 days)
	c.SetCookie("herocms_session", sessionID, 2592000, "/", "", false, true)

	// 2. Set readable Cookie for CSRF Token (Double Submit Pattern)
	c.SetCookie("csrf_token", csrfToken, 2592000, "/", "", false, false)

	// 3. Set response headers & return payload
	c.Header("X-CSRF-Token", csrfToken)

	c.JSON(http.StatusOK, gin.H{
		"token":      result.Token,
		"session_id": sessionID,
		"csrf_token": csrfToken,
		"user":       result.User,
		"plan":       result.Plan,
	})
}

type RegisterPayload struct {
	FullName string `json:"full_name" binding:"required"`
	Email    string `json:"email"`
	Username string `json:"username"`
	Password string `json:"password" binding:"required"`
}

func (h *Handler) Register(c *gin.Context) {
	var req RegisterPayload
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Nama lengkap dan kata sandi wajib diisi"})
		return
	}

	userKey := req.Email
	if userKey == "" {
		userKey = req.Username
	}
	if userKey == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Username atau email wajib diisi"})
		return
	}

	result, err := h.Services.RegisterUser(req.FullName, userKey, req.Password)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	sessionBytes := make([]byte, 24)
	rand.Read(sessionBytes)
	sessionID := "sess_" + hex.EncodeToString(sessionBytes)

	csrfBytes := make([]byte, 16)
	rand.Read(csrfBytes)
	csrfToken := hex.EncodeToString(csrfBytes)

	sess := &redis.SessionData{
		SessionID: sessionID,
		UserID:    fmt.Sprintf("%v", result.User["id"]),
		TenantID:  fmt.Sprintf("%v", result.User["tenant_id"]),
		Email:     fmt.Sprintf("%v", result.User["email"]),
		FullName:  fmt.Sprintf("%v", result.User["full_name"]),
		Role:      fmt.Sprintf("%v", result.User["role"]),
		CSRFToken: csrfToken,
		IP:        c.ClientIP(),
		UserAgent: c.Request.UserAgent(),
		CreatedAt: time.Now(),
		ExpiresAt: time.Now().Add(30 * 24 * time.Hour),
	}
	h.Services.Redis.SaveSession(c.Request.Context(), sess, 30*24*time.Hour)

	c.SetCookie("herocms_session", sessionID, 2592000, "/", "", false, true)
	c.SetCookie("csrf_token", csrfToken, 2592000, "/", "", false, false)
	c.Header("X-CSRF-Token", csrfToken)

	c.JSON(http.StatusCreated, gin.H{
		"token":      result.Token,
		"session_id": sessionID,
		"csrf_token": csrfToken,
		"user":       result.User,
		"plan":       result.Plan,
		"message":    "Akun berhasil dibuat! Silakan lanjutkan pemilihan paket kuota Anda.",
	})
}

func (h *Handler) Me(c *gin.Context) {
	tenantID, _ := c.Get("tenant_id")
	email, _ := c.Get("email")
	role, _ := c.Get("role")
	fullName, _ := c.Get("full_name")
	if fullName == nil || fullName == "" {
		fullName = "Admin Developer"
	}

	c.JSON(http.StatusOK, gin.H{
		"user": gin.H{
			"tenant_id": tenantID,
			"email":     email,
			"role":      role,
			"full_name": fullName,
		},
		"plan": gin.H{
			"name":          "Hero Pro Plan",
			"price":         "Rp 149.000 / bln",
			"maxContainers": 3,
			"cpuLimit":      "0.5 vCPU",
			"ramLimit":      "256 MB",
			"storageQuota":  "2 GB SSD",
		},
	})
}

func (h *Handler) Logout(c *gin.Context) {
	// Revoke Redis session
	sessionCookie, _ := c.Cookie("herocms_session")
	if sessionCookie != "" {
		h.Services.Redis.DeleteSession(c.Request.Context(), sessionCookie)
	}

	// Revoke JWT token blacklist if present
	tokenHash, exists := c.Get("token_hash")
	if exists {
		h.Services.RevokeSession(c.Request.Context(), tokenHash.(string))
	}

	// Clear cookies
	c.SetCookie("herocms_session", "", -1, "/", "", false, true)
	c.SetCookie("csrf_token", "", -1, "/", "", false, false)

	c.JSON(http.StatusOK, gin.H{"message": "Logout berhasil, sesi dan cookie telah dibersihkan."})
}

// -----------------------------------------------------------------------------
// Containers
// -----------------------------------------------------------------------------

func (h *Handler) ListContainers(c *gin.Context) {
	data, err := h.Services.GetContainers()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, data)
}

type CreateContainerPayload struct {
	Name      string `json:"name" binding:"required"`
	Subdomain string `json:"subdomain" binding:"required"`
	Category  string `json:"category"`
	Role      string `json:"role"`
}

func (h *Handler) CreateContainer(c *gin.Context) {
	var req CreateContainerPayload
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Nama situs dan subdomain wajib diisi"})
		return
	}

	created, err := h.Services.CreateContainer(service.CreateContainerInput{
		Name:      req.Name,
		Subdomain: req.Subdomain,
		Category:  req.Category,
		Role:      req.Role,
	})
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, created)
}

func (h *Handler) StartContainer(c *gin.Context) {
	id := c.Param("id")
	ok, err := h.Services.StartContainer(id)
	if !ok || err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "running", "id": id})
}

func (h *Handler) StopContainer(c *gin.Context) {
	id := c.Param("id")
	ok, err := h.Services.StopContainer(id)
	if !ok || err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "stopped", "id": id})
}

func (h *Handler) DeleteContainer(c *gin.Context) {
	id := c.Param("id")
	ok, err := h.Services.DeleteContainer(id)
	if !ok || err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "deleted", "id": id})
}

// -----------------------------------------------------------------------------
// Articles
// -----------------------------------------------------------------------------

func (h *Handler) ListArticles(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"articles": h.Services.GetArticles()})
}

// -----------------------------------------------------------------------------
// Assets
// -----------------------------------------------------------------------------

func (h *Handler) ListAssets(c *gin.Context) {
	c.JSON(http.StatusOK, h.Services.GetAssets())
}

// -----------------------------------------------------------------------------
// Domains
// -----------------------------------------------------------------------------

func (h *Handler) ListDomains(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"domains": h.Services.GetDomains()})
}

// -----------------------------------------------------------------------------
// Tickets
// -----------------------------------------------------------------------------

func (h *Handler) ListTickets(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"tickets": h.Services.GetTickets()})
}

func (h *Handler) GetTicketMessages(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, gin.H{"messages": h.Services.GetTicketMessages(id)})
}

// -----------------------------------------------------------------------------
// Billing & Invoices
// -----------------------------------------------------------------------------

func (h *Handler) ListInvoices(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"invoices": h.Services.GetInvoices()})
}

func (h *Handler) GetBillingQuota(c *gin.Context) {
	c.JSON(http.StatusOK, h.Services.GetBillingQuota())
}

func (h *Handler) CheckoutPlan(c *gin.Context) {
	var req service.CheckoutInput
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Format data checkout tidak valid"})
		return
	}
	res, err := h.Services.ProcessCheckout(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, res)
}

// -----------------------------------------------------------------------------
// Webhooks
// -----------------------------------------------------------------------------

func (h *Handler) ListWebhooks(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"webhooks": h.Services.GetWebhooks()})
}

// -----------------------------------------------------------------------------
// Analytics
// -----------------------------------------------------------------------------

func (h *Handler) GetTopViews(c *gin.Context) {
	tenantID, _ := c.Get("tenant_id")
	tIDStr := "99420000-0000-0000-0000-000000009942"
	if tenantID != nil {
		tIDStr = tenantID.(string)
	}

	items, err := h.Services.GetTopViews(c.Request.Context(), tIDStr)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data dari Redis"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"top_items": items,
		"source":    "redis_zset_live",
		"time":      time.Now().UTC().Format(time.RFC3339),
	})
}

type HitPayload struct {
	Path string `json:"path" binding:"required"`
}

func (h *Handler) RecordHit(c *gin.Context) {
	var req HitPayload
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Path wajib diisi"})
		return
	}

	tenantID, _ := c.Get("tenant_id")
	tIDStr := "99420000-0000-0000-0000-000000009942"
	if tenantID != nil {
		tIDStr = tenantID.(string)
	}

	h.Services.RecordHit(c.Request.Context(), tIDStr, req.Path)
	c.JSON(http.StatusOK, gin.H{"status": "recorded", "path": req.Path})
}
