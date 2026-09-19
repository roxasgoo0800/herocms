package handler

import (
	"net/http"
	"time"

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
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

func (h *Handler) Login(c *gin.Context) {
	var req LoginPayload
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email dan password wajib diisi"})
		return
	}

	result, err := h.Services.AuthenticateUser(req.Email, req.Password)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, result)
}

func (h *Handler) Me(c *gin.Context) {
	tenantID, _ := c.Get("tenant_id")
	email, _ := c.Get("email")
	role, _ := c.Get("role")

	c.JSON(http.StatusOK, gin.H{
		"user": gin.H{
			"tenant_id": tenantID,
			"email":     email,
			"role":      role,
			"full_name": "Rizal Pratama",
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
	tokenHash, exists := c.Get("token_hash")
	if exists {
		h.Services.RevokeSession(c.Request.Context(), tokenHash.(string))
	}
	c.JSON(http.StatusOK, gin.H{"message": "Logout berhasil, sesi telah dicabut."})
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
