package handler

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/cloudcms/dashboard-cms-backend/internal/config"
	"github.com/cloudcms/dashboard-cms-backend/internal/redis"
	"github.com/cloudcms/dashboard-cms-backend/internal/repository"
	"github.com/cloudcms/dashboard-cms-backend/internal/service"
	"github.com/cloudcms/dashboard-cms-backend/internal/storage"
	"github.com/gin-gonic/gin"
)

func setupTestHandler() (*Handler, *gin.Engine) {
	gin.SetMode(gin.TestMode)
	cfg := &config.Config{
		JWTSecret:          []byte("secure_random_jwt_secret_for_testing!"),
		AllowDevAuthBypass: true,
	}
	repo := repository.NewInMemoryRepository()
	rdb := redis.NewInMemoryClient()
	s3Client := &storage.S3Client{PublicURL: "http://localhost:9000", Available: false}
	services := service.NewServices(cfg, repo, rdb, s3Client)
	h := NewHandler(services)

	router := gin.New()
	router.Use(gin.Recovery())

	// Public Auth routes
	router.POST("/api/auth/login", h.Login)
	router.POST("/api/auth/register", h.Register)

	// Protected routes (simulating injected session context)
	protected := router.Group("/api")
	protected.Use(func(c *gin.Context) {
		c.Set("tenant_id", "99420000-0000-0000-0000-000000009942")
		c.Set("user_id", "00000000-0000-0000-0000-000000000001")
		c.Set("email", "admin@herocms.local")
		c.Set("full_name", "Admin Developer")
		c.Set("role", "customer")
		c.Next()
	})
	{
		protected.GET("/auth/me", h.Me)
		protected.POST("/auth/logout", h.Logout)
		protected.GET("/user/state", h.GetUserState)
		protected.PUT("/user/state", h.SaveUserState)

		protected.GET("/containers", h.ListContainers)
		protected.POST("/containers", h.CreateContainer)
		protected.PUT("/containers/:id/design", h.SaveSiteDesign)
		protected.GET("/containers/:id/draft", h.GetEditorDraft)
		protected.PUT("/containers/:id/draft", h.SaveEditorDraft)
		protected.POST("/containers/:id/start", h.StartContainer)
		protected.POST("/containers/:id/stop", h.StopContainer)
		protected.PUT("/containers/:id/maintenance", h.ToggleMaintenance)
		protected.DELETE("/containers/:id", h.DeleteContainer)

		protected.GET("/articles", h.ListArticles)
		protected.GET("/assets", h.ListAssets)
		protected.DELETE("/assets/:id", h.DeleteAsset)

		protected.GET("/domains", h.ListDomains)

		protected.GET("/tickets", h.ListTickets)
		protected.POST("/tickets", h.CreateTicket)
		protected.GET("/tickets/:id/messages", h.GetTicketMessages)
		protected.POST("/tickets/:id/messages", h.AddTicketMessage)
		protected.PUT("/tickets/:id/resolve", h.ResolveTicket)

		protected.GET("/invoices", h.ListInvoices)
		protected.GET("/billing/quota", h.GetBillingQuota)
		protected.POST("/billing/checkout", h.CheckoutPlan)

		protected.GET("/webhooks", h.ListWebhooks)

		protected.GET("/analytics/top-views", h.GetTopViews)
		protected.POST("/analytics/hit", h.RecordHit)

		protected.POST("/cache/warm", h.WarmCache)
	}

	return h, router
}

func TestHandler_Login_And_Register_And_Logout(t *testing.T) {
	_, router := setupTestHandler()

	// 1. Empty body -> 400 Bad Request
	req, _ := http.NewRequest(http.MethodPost, "/api/auth/login", bytes.NewReader([]byte("{}")))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusBadRequest {
		t.Errorf("expected 400 for empty login body, got %d", w.Code)
	}

	// 2. Valid credentials -> 200 OK
	validBody, _ := json.Marshal(LoginPayload{
		Email:    "admin",
		Password: "admin",
	})
	reqValid, _ := http.NewRequest(http.MethodPost, "/api/auth/login", bytes.NewReader(validBody))
	reqValid.Header.Set("Content-Type", "application/json")
	wValid := httptest.NewRecorder()
	router.ServeHTTP(wValid, reqValid)

	if wValid.Code != http.StatusOK {
		t.Fatalf("expected 200 for valid login, got %d (body: %s)", wValid.Code, wValid.Body.Bytes())
	}

	// 3. Register user -> 201 Created
	regBody, _ := json.Marshal(RegisterPayload{
		FullName: "Jane Doe",
		Email:    "jane@herocms.com",
		Password: "strongPassword123!",
	})
	reqReg, _ := http.NewRequest(http.MethodPost, "/api/auth/register", bytes.NewReader(regBody))
	reqReg.Header.Set("Content-Type", "application/json")
	wReg := httptest.NewRecorder()
	router.ServeHTTP(wReg, reqReg)

	if wReg.Code != http.StatusCreated {
		t.Fatalf("expected 201 for register, got %d (body: %s)", wReg.Code, wReg.Body.Bytes())
	}

	// 4. Logout -> 200 OK
	reqLogout, _ := http.NewRequest(http.MethodPost, "/api/auth/logout", nil)
	wLogout := httptest.NewRecorder()
	router.ServeHTTP(wLogout, reqLogout)

	if wLogout.Code != http.StatusOK {
		t.Errorf("expected 200 for logout, got %d", wLogout.Code)
	}
}

func TestHandler_MeEndpoint(t *testing.T) {
	_, router := setupTestHandler()

	req, _ := http.NewRequest(http.MethodGet, "/api/auth/me", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", w.Code)
	}
}

func TestHandler_Containers(t *testing.T) {
	_, router := setupTestHandler()

	// 1. List
	reqList, _ := http.NewRequest(http.MethodGet, "/api/containers", nil)
	wList := httptest.NewRecorder()
	router.ServeHTTP(wList, reqList)
	if wList.Code != http.StatusOK {
		t.Fatalf("ListContainers failed: %d", wList.Code)
	}

	// 2. Create
	createBody, _ := json.Marshal(CreateContainerPayload{
		Name:      "New Blog Site",
		Subdomain: "newblogsite",
		Category:  "blog",
	})
	reqCreate, _ := http.NewRequest(http.MethodPost, "/api/containers", bytes.NewReader(createBody))
	reqCreate.Header.Set("Content-Type", "application/json")
	wCreate := httptest.NewRecorder()
	router.ServeHTTP(wCreate, reqCreate)
	if wCreate.Code != http.StatusCreated {
		t.Fatalf("CreateContainer failed: %d (body: %s)", wCreate.Code, wCreate.Body.Bytes())
	}

	var created map[string]interface{}
	_ = json.Unmarshal(wCreate.Body.Bytes(), &created)
	cID := created["id"].(string)

	// 3. Stop & Start
	reqStop, _ := http.NewRequest(http.MethodPost, "/api/containers/"+cID+"/stop", nil)
	wStop := httptest.NewRecorder()
	router.ServeHTTP(wStop, reqStop)
	if wStop.Code != http.StatusOK {
		t.Errorf("StopContainer failed: %d", wStop.Code)
	}

	reqStart, _ := http.NewRequest(http.MethodPost, "/api/containers/"+cID+"/start", nil)
	wStart := httptest.NewRecorder()
	router.ServeHTTP(wStart, reqStart)
	if wStart.Code != http.StatusOK {
		t.Errorf("StartContainer failed: %d", wStart.Code)
	}

	// 3b. Maintenance Mode Toggle On & Off
	mBodyOn, _ := json.Marshal(gin.H{
		"enabled":            true,
		"message":            "Situs sedang dalam pemeliharaan berkala",
		"estimated_end_time": "15 menit",
	})
	reqMOn, _ := http.NewRequest(http.MethodPut, "/api/containers/"+cID+"/maintenance", bytes.NewReader(mBodyOn))
	reqMOn.Header.Set("Content-Type", "application/json")
	wMOn := httptest.NewRecorder()
	router.ServeHTTP(wMOn, reqMOn)
	if wMOn.Code != http.StatusOK {
		t.Errorf("ToggleMaintenance on failed: %d", wMOn.Code)
	}

	mBodyOff, _ := json.Marshal(gin.H{"enabled": false})
	reqMOff, _ := http.NewRequest(http.MethodPut, "/api/containers/"+cID+"/maintenance", bytes.NewReader(mBodyOff))
	reqMOff.Header.Set("Content-Type", "application/json")
	wMOff := httptest.NewRecorder()
	router.ServeHTTP(wMOff, reqMOff)
	if wMOff.Code != http.StatusOK {
		t.Errorf("ToggleMaintenance off failed: %d", wMOff.Code)
	}

	// 4. Save Site Design
	designBody, _ := json.Marshal(gin.H{
		"roleOrHeadline": "Lead Technical Author",
		"accentColor":    "#2563eb",
	})
	reqDesign, _ := http.NewRequest(http.MethodPut, "/api/containers/"+cID+"/design", bytes.NewReader(designBody))
	reqDesign.Header.Set("Content-Type", "application/json")
	wDesign := httptest.NewRecorder()
	router.ServeHTTP(wDesign, reqDesign)
	if wDesign.Code != http.StatusOK {
		t.Errorf("SaveSiteDesign failed: %d", wDesign.Code)
	}

	// 5. Delete Container
	reqDel, _ := http.NewRequest(http.MethodDelete, "/api/containers/"+cID, nil)
	wDel := httptest.NewRecorder()
	router.ServeHTTP(wDel, reqDel)
	if wDel.Code != http.StatusOK {
		t.Errorf("DeleteContainer failed: %d", wDel.Code)
	}
}

func TestHandler_DraftsAndUserState(t *testing.T) {
	_, router := setupTestHandler()

	// 1. Save Editor Draft
	draftBody, _ := json.Marshal(gin.H{"blocks": []string{"hero", "cta"}})
	reqSaveDraft, _ := http.NewRequest(http.MethodPut, "/api/containers/cont_test/draft", bytes.NewReader(draftBody))
	reqSaveDraft.Header.Set("Content-Type", "application/json")
	wSaveDraft := httptest.NewRecorder()
	router.ServeHTTP(wSaveDraft, reqSaveDraft)
	if wSaveDraft.Code != http.StatusOK {
		t.Errorf("SaveEditorDraft failed: %d", wSaveDraft.Code)
	}

	// 2. Get Editor Draft
	reqGetDraft, _ := http.NewRequest(http.MethodGet, "/api/containers/cont_test/draft", nil)
	wGetDraft := httptest.NewRecorder()
	router.ServeHTTP(wGetDraft, reqGetDraft)
	if wGetDraft.Code != http.StatusOK {
		t.Errorf("GetEditorDraft failed: %d", wGetDraft.Code)
	}

	// 3. User State
	stateBody, _ := json.Marshal(gin.H{"theme": "dark"})
	reqSaveState, _ := http.NewRequest(http.MethodPut, "/api/user/state", bytes.NewReader(stateBody))
	reqSaveState.Header.Set("Content-Type", "application/json")
	wSaveState := httptest.NewRecorder()
	router.ServeHTTP(wSaveState, reqSaveState)
	if wSaveState.Code != http.StatusOK {
		t.Errorf("SaveUserState failed: %d", wSaveState.Code)
	}

	reqGetState, _ := http.NewRequest(http.MethodGet, "/api/user/state", nil)
	wGetState := httptest.NewRecorder()
	router.ServeHTTP(wGetState, reqGetState)
	if wGetState.Code != http.StatusOK {
		t.Errorf("GetUserState failed: %d", wGetState.Code)
	}
}

func TestHandler_Tickets_Lifecycle(t *testing.T) {
	_, router := setupTestHandler()

	// 1. List
	reqList, _ := http.NewRequest(http.MethodGet, "/api/tickets", nil)
	wList := httptest.NewRecorder()
	router.ServeHTTP(wList, reqList)
	if wList.Code != http.StatusOK {
		t.Fatalf("ListTickets failed: %d", wList.Code)
	}

	// 2. Create Ticket
	tktBody, _ := json.Marshal(gin.H{
		"subject": "Traefik SSL Issue",
		"message": "SSL certificate failed renewal",
	})
	reqCreate, _ := http.NewRequest(http.MethodPost, "/api/tickets", bytes.NewReader(tktBody))
	reqCreate.Header.Set("Content-Type", "application/json")
	wCreate := httptest.NewRecorder()
	router.ServeHTTP(wCreate, reqCreate)
	if wCreate.Code != http.StatusCreated {
		t.Fatalf("CreateTicket failed: %d", wCreate.Code)
	}

	var tkt map[string]interface{}
	_ = json.Unmarshal(wCreate.Body.Bytes(), &tkt)
	ticketID := tkt["id"].(string)

	// 3. Add Reply
	replyBody, _ := json.Marshal(gin.H{"message": "We have renewed it."})
	reqReply, _ := http.NewRequest(http.MethodPost, "/api/tickets/"+ticketID+"/messages", bytes.NewReader(replyBody))
	reqReply.Header.Set("Content-Type", "application/json")
	wReply := httptest.NewRecorder()
	router.ServeHTTP(wReply, reqReply)
	if wReply.Code != http.StatusOK {
		t.Errorf("AddTicketMessage failed: %d", wReply.Code)
	}

	// 4. Resolve
	reqResolve, _ := http.NewRequest(http.MethodPut, "/api/tickets/"+ticketID+"/resolve", nil)
	wResolve := httptest.NewRecorder()
	router.ServeHTTP(wResolve, reqResolve)
	if wResolve.Code != http.StatusOK {
		t.Errorf("ResolveTicket failed: %d", wResolve.Code)
	}
}

func TestHandler_BillingAndWarmupAndAnalytics(t *testing.T) {
	_, router := setupTestHandler()

	// Invoices & Quota
	reqInv, _ := http.NewRequest(http.MethodGet, "/api/invoices", nil)
	wInv := httptest.NewRecorder()
	router.ServeHTTP(wInv, reqInv)
	if wInv.Code != http.StatusOK {
		t.Errorf("ListInvoices failed: %d", wInv.Code)
	}

	reqQuota, _ := http.NewRequest(http.MethodGet, "/api/billing/quota", nil)
	wQuota := httptest.NewRecorder()
	router.ServeHTTP(wQuota, reqQuota)
	if wQuota.Code != http.StatusOK {
		t.Errorf("GetBillingQuota failed: %d", wQuota.Code)
	}

	// Checkout
	checkoutBody, _ := json.Marshal(gin.H{
		"plan_tier":      "pro",
		"payment_method": "bca_va",
	})
	reqCheckout, _ := http.NewRequest(http.MethodPost, "/api/billing/checkout", bytes.NewReader(checkoutBody))
	reqCheckout.Header.Set("Content-Type", "application/json")
	wCheckout := httptest.NewRecorder()
	router.ServeHTTP(wCheckout, reqCheckout)
	if wCheckout.Code != http.StatusOK {
		t.Errorf("CheckoutPlan failed: %d", wCheckout.Code)
	}

	// Analytics
	hitBody, _ := json.Marshal(gin.H{"path": "/blog/traefik-guide"})
	reqHit, _ := http.NewRequest(http.MethodPost, "/api/analytics/hit", bytes.NewReader(hitBody))
	reqHit.Header.Set("Content-Type", "application/json")
	wHit := httptest.NewRecorder()
	router.ServeHTTP(wHit, reqHit)
	if wHit.Code != http.StatusOK {
		t.Errorf("RecordHit failed: %d", wHit.Code)
	}

	reqTop, _ := http.NewRequest(http.MethodGet, "/api/analytics/top-views", nil)
	wTop := httptest.NewRecorder()
	router.ServeHTTP(wTop, reqTop)
	if wTop.Code != http.StatusOK {
		t.Errorf("GetTopViews failed: %d", wTop.Code)
	}

	// Warmup Cache
	reqWarm, _ := http.NewRequest(http.MethodPost, "/api/cache/warm", nil)
	wWarm := httptest.NewRecorder()
	router.ServeHTTP(wWarm, reqWarm)
	if wWarm.Code != http.StatusOK {
		t.Errorf("WarmCache failed: %d", wWarm.Code)
	}
}
