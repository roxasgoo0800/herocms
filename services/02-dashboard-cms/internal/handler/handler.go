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
	csrfCookieName := h.Services.Config.CSRFCookieName
	if csrfCookieName == "" {
		csrfCookieName = "csrf_token"
	}
	c.SetCookie(csrfCookieName, csrfToken, 2592000, "/", h.Services.Config.CSRFCookieDomain, h.Services.Config.CSRFCookieSecure, false)

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

	csrfCookieName := h.Services.Config.CSRFCookieName
	if csrfCookieName == "" {
		csrfCookieName = "csrf_token"
	}
	c.SetCookie("herocms_session", sessionID, 2592000, "/", "", false, true)
	c.SetCookie(csrfCookieName, csrfToken, 2592000, "/", h.Services.Config.CSRFCookieDomain, h.Services.Config.CSRFCookieSecure, false)
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

	// Clear all session & tracking cookies
	csrfCookieName := h.Services.Config.CSRFCookieName
	if csrfCookieName == "" {
		csrfCookieName = "csrf_token"
	}
	c.SetCookie("herocms_session", "", -1, "/", "", false, true)
	c.SetCookie(csrfCookieName, "", -1, "/", h.Services.Config.CSRFCookieDomain, h.Services.Config.CSRFCookieSecure, false)
	c.SetCookie("herocms_active_menu", "", -1, "/", "", false, false)
	c.SetCookie("herocms_active_container_id", "", -1, "/", "", false, false)

	c.JSON(http.StatusOK, gin.H{"message": "Logout berhasil, sesi dan cookie telah dibersihkan."})
}

// -----------------------------------------------------------------------------
// Helper to extract Tenant ID
// -----------------------------------------------------------------------------

func getTenantID(c *gin.Context) string {
	if val, exists := c.Get("tenant_id"); exists {
		if tID, ok := val.(string); ok && tID != "" {
			return tID
		}
	}
	return "99420000-0000-0000-0000-000000009942"
}

// -----------------------------------------------------------------------------
// Containers
// -----------------------------------------------------------------------------

func (h *Handler) ListContainers(c *gin.Context) {
	data, err := h.Services.GetContainers(c.Request.Context(), getTenantID(c))
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

	created, err := h.Services.CreateContainer(c.Request.Context(), getTenantID(c), service.CreateContainerInput{
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
	ok, err := h.Services.StartContainer(c.Request.Context(), getTenantID(c), id)
	if !ok || err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "running", "id": id})
}

func (h *Handler) StopContainer(c *gin.Context) {
	id := c.Param("id")
	ok, err := h.Services.StopContainer(c.Request.Context(), getTenantID(c), id)
	if !ok || err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "stopped", "id": id})
}

func (h *Handler) DeleteContainer(c *gin.Context) {
	id := c.Param("id")
	ok, err := h.Services.DeleteContainer(c.Request.Context(), getTenantID(c), id)
	if !ok || err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "deleted", "id": id})
}

func (h *Handler) SaveSiteDesign(c *gin.Context) {
	id := c.Param("id")
	var payload gin.H
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Payload konfigurasi desain tidak valid"})
		return
	}

	err := h.Services.SaveSiteDesign(c.Request.Context(), getTenantID(c), id, payload)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menyimpan konfigurasi situs ke database: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Konfigurasi desain situs berhasil disimpan & disinkronkan ke runtime!",
		"id":      id,
	})
}

func (h *Handler) GetEditorDraft(c *gin.Context) {
	id := c.Param("id")
	draft, err := h.Services.GetEditorDraft(c.Request.Context(), getTenantID(c), id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.Header("X-Draft-Source", "Redis-Engine")
	c.JSON(http.StatusOK, gin.H{
		"draft":  draft,
		"source": "redis",
		"id":     id,
	})
}

func (h *Handler) SaveEditorDraft(c *gin.Context) {
	id := c.Param("id")
	var draft gin.H
	if err := c.ShouldBindJSON(&draft); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Payload draf tidak valid"})
		return
	}

	err := h.Services.SaveEditorDraft(c.Request.Context(), getTenantID(c), id, draft)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menyimpan draf ke Redis: " + err.Error()})
		return
	}

	c.Header("X-Draft-Saved", "Redis-Persistent")
	c.JSON(http.StatusOK, gin.H{
		"message": "Draf posisi edit berhasil disimpan ke Redis!",
		"id":      id,
		"savedAt": time.Now().UTC().Format(time.RFC3339),
	})
}

func (h *Handler) GetUserState(c *gin.Context) {
	state, err := h.Services.GetUserState(c.Request.Context(), getTenantID(c))
	if err != nil {
		c.JSON(http.StatusOK, gin.H{"state": nil})
		return
	}
	c.JSON(http.StatusOK, gin.H{"state": state})
}

func (h *Handler) SaveUserState(c *gin.Context) {
	var state gin.H
	if err := c.ShouldBindJSON(&state); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Payload state tidak valid"})
		return
	}
	_ = h.Services.SaveUserState(c.Request.Context(), getTenantID(c), state)
	c.JSON(http.StatusOK, gin.H{"success": true})
}

// -----------------------------------------------------------------------------
// Articles
// -----------------------------------------------------------------------------

func (h *Handler) ListArticles(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"articles": h.Services.GetArticles(c.Request.Context(), getTenantID(c))})
}

// -----------------------------------------------------------------------------
// Assets
// -----------------------------------------------------------------------------

func (h *Handler) ListAssets(c *gin.Context) {
	c.JSON(http.StatusOK, h.Services.GetAssets(c.Request.Context(), getTenantID(c)))
}

// -----------------------------------------------------------------------------
// Domains
// -----------------------------------------------------------------------------

func (h *Handler) ListDomains(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"domains": h.Services.GetDomains(c.Request.Context(), getTenantID(c))})
}

// -----------------------------------------------------------------------------
// Tickets
// -----------------------------------------------------------------------------

func (h *Handler) ListTickets(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"tickets": h.Services.GetTickets(c.Request.Context(), getTenantID(c))})
}

func (h *Handler) CreateTicket(c *gin.Context) {
	var input service.CreateTicketInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Subject dan Message wajib diisi"})
		return
	}
	tkt, err := h.Services.CreateTicket(c.Request.Context(), getTenantID(c), input)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal membuat tiket: " + err.Error()})
		return
	}
	c.JSON(http.StatusCreated, tkt)
}

func (h *Handler) GetTicketMessages(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, gin.H{"messages": h.Services.GetTicketMessages(c.Request.Context(), id)})
}

func (h *Handler) AddTicketMessage(c *gin.Context) {
	id := c.Param("id")
	var input service.TicketReplyInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Pesan balasan wajib diisi"})
		return
	}
	msg, err := h.Services.AddTicketMessage(c.Request.Context(), getTenantID(c), id, input)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengirim balasan: " + err.Error()})
		return
	}
	c.JSON(http.StatusOK, msg)
}

func (h *Handler) ResolveTicket(c *gin.Context) {
	id := c.Param("id")
	if err := h.Services.ResolveTicket(c.Request.Context(), getTenantID(c), id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menyelesaikan tiket: " + err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "resolved", "id": id})
}

// -----------------------------------------------------------------------------
// Billing & Invoices
// -----------------------------------------------------------------------------

func (h *Handler) ListInvoices(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"invoices": h.Services.GetInvoices(c.Request.Context(), getTenantID(c))})
}

func (h *Handler) GetBillingQuota(c *gin.Context) {
	c.JSON(http.StatusOK, h.Services.GetBillingQuota(c.Request.Context(), getTenantID(c)))
}

func (h *Handler) CheckoutPlan(c *gin.Context) {
	var req service.CheckoutInput
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Format data checkout tidak valid"})
		return
	}
	if req.TenantID == "" {
		req.TenantID = getTenantID(c)
	}
	res, err := h.Services.ProcessCheckout(c.Request.Context(), req)
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
	c.JSON(http.StatusOK, gin.H{"webhooks": h.Services.GetWebhooks(c.Request.Context(), getTenantID(c))})
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

// -----------------------------------------------------------------------------
// Cache Warmer Endpoint
// -----------------------------------------------------------------------------

func (h *Handler) WarmCache(c *gin.Context) {
	tenantID := getTenantID(c)
	bundle, err := h.Services.WarmAllMenusCache(c.Request.Context(), tenantID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal memanaskan cache Redis: " + err.Error()})
		return
	}

	c.Header("X-Cache-Engine", "Redis-7")
	c.Header("X-Cache-Status", "WARMED")
	c.JSON(http.StatusOK, gin.H{
		"status":  "warmed",
		"message": "Seluruh cache data menu studio berhasil dipanaskan ke Redis!",
		"bundle":  bundle,
	})
}

