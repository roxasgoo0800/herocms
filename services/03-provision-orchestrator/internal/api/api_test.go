package api

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"testing"

	"github.com/cloudcms/provision-orchestrator/config"
	"github.com/cloudcms/provision-orchestrator/internal/docker"
	"github.com/cloudcms/provision-orchestrator/internal/messaging/kafka"
	"github.com/cloudcms/provision-orchestrator/internal/messaging/redis"
	"github.com/cloudcms/provision-orchestrator/internal/storage"
	"github.com/gin-gonic/gin"
)

func setupTestServer(t *testing.T) (*gin.Engine, *config.Config) {
	tempBase := filepath.Join(os.TempDir(), "herocms_api_test")
	_ = os.RemoveAll(tempBase)

	cfg := &config.Config{
		Port:                "8080",
		DockerEdgeNetwork:   "herocms_edge_net",
		TenantRuntimeImage:  "cloudcms-tenant-runtime:alpine-v1",
		TenantStorageBase:   tempBase,
		InternalSecretToken: "test_secret_token_123",
		RequireInternalAuth: true,
	}

	sm, err := storage.NewManager(tempBase)
	if err != nil {
		t.Fatalf("failed to init storage manager: %v", err)
	}

	rm := redis.NewManager("localhost:6379", "", 0)
	kp := kafka.NewProducer("localhost:9092")
	prov, err := docker.NewProvisioner(cfg.DockerEdgeNetwork, cfg.TenantRuntimeImage, sm, rm, kp)
	if err != nil {
		t.Fatalf("failed to init provisioner: %v", err)
	}

	router := SetupRouter(cfg, prov, sm, rm, kp)
	return router, cfg
}

func TestAPI_HealthAndReady(t *testing.T) {
	router, _ := setupTestServer(t)

	// Healthz (no auth required)
	req, _ := http.NewRequest(http.MethodGet, "/healthz", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("expected 200 OK for /healthz, got %d", w.Code)
	}

	// Readyz (no auth required)
	reqReady, _ := http.NewRequest(http.MethodGet, "/readyz", nil)
	wReady := httptest.NewRecorder()
	router.ServeHTTP(wReady, reqReady)

	if wReady.Code != http.StatusOK {
		t.Errorf("expected 200 OK for /readyz, got %d", wReady.Code)
	}
}

func TestAPI_InternalSecretGuard(t *testing.T) {
	router, cfg := setupTestServer(t)

	// 1. Request to protected endpoint without token must return 403 Forbidden
	reqNoAuth, _ := http.NewRequest(http.MethodGet, "/api/v1/containers", nil)
	wNoAuth := httptest.NewRecorder()
	router.ServeHTTP(wNoAuth, reqNoAuth)

	if wNoAuth.Code != http.StatusForbidden {
		t.Errorf("[SECURITY ALERT] expected 403 Forbidden for missing internal secret, got %d", wNoAuth.Code)
	}

	// 2. Request with valid token must succeed
	reqAuth, _ := http.NewRequest(http.MethodGet, "/api/v1/containers", nil)
	reqAuth.Header.Set("X-HeroCMS-Internal-Secret", cfg.InternalSecretToken)
	wAuth := httptest.NewRecorder()
	router.ServeHTTP(wAuth, reqAuth)

	if wAuth.Code != http.StatusOK {
		t.Errorf("expected 200 OK with valid internal secret, got %d", wAuth.Code)
	}
}

func TestAPI_DeployAndLifecycle(t *testing.T) {
	router, cfg := setupTestServer(t)

	payload := DeployRequest{
		TenantID:     "t_demo_site",
		SiteID:       "s_site_01",
		Subdomain:    "demo-store",
		CustomDomain: "demostore.com",
		VersionHash:  "commit77491",
	}
	body, _ := json.Marshal(payload)

	req, _ := http.NewRequest(http.MethodPost, "/api/v1/containers/provision", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-HeroCMS-Internal-Secret", cfg.InternalSecretToken)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200 OK for deploy, got %d, body: %s", w.Code, w.Body.String())
	}

	var resp map[string]interface{}
	_ = json.Unmarshal(w.Body.Bytes(), &resp)

	containerID, ok := resp["container_id"].(string)
	if !ok || containerID == "" {
		t.Fatalf("expected valid container_id in response")
	}

	// Inspect container
	reqInspect, _ := http.NewRequest(http.MethodGet, "/api/v1/containers/"+containerID, nil)
	reqInspect.Header.Set("X-HeroCMS-Internal-Secret", cfg.InternalSecretToken)
	wInspect := httptest.NewRecorder()
	router.ServeHTTP(wInspect, reqInspect)
	if wInspect.Code != http.StatusOK {
		t.Errorf("expected 200 OK inspecting container, got %d", wInspect.Code)
	}

	// Stats endpoint
	reqStats, _ := http.NewRequest(http.MethodGet, "/api/v1/containers/"+containerID+"/stats", nil)
	reqStats.Header.Set("X-HeroCMS-Internal-Secret", cfg.InternalSecretToken)
	wStats := httptest.NewRecorder()
	router.ServeHTTP(wStats, reqStats)
	if wStats.Code != http.StatusOK {
		t.Errorf("expected 200 OK fetching stats, got %d", wStats.Code)
	}

	// Restart container
	reqRestart, _ := http.NewRequest(http.MethodPost, "/api/v1/containers/"+containerID+"/restart", nil)
	reqRestart.Header.Set("X-HeroCMS-Internal-Secret", cfg.InternalSecretToken)
	wRestart := httptest.NewRecorder()
	router.ServeHTTP(wRestart, reqRestart)
	if wRestart.Code != http.StatusOK {
		t.Errorf("expected 200 OK restarting container, got %d", wRestart.Code)
	}

	// Check audit events
	reqEvents, _ := http.NewRequest(http.MethodGet, "/api/v1/events", nil)
	reqEvents.Header.Set("X-HeroCMS-Internal-Secret", cfg.InternalSecretToken)
	wEvents := httptest.NewRecorder()
	router.ServeHTTP(wEvents, reqEvents)
	if wEvents.Code != http.StatusOK {
		t.Errorf("expected 200 OK fetching events, got %d", wEvents.Code)
	}

	// Destroy container with purge_storage=true
	reqDestroy, _ := http.NewRequest(http.MethodDelete, "/api/v1/containers/"+containerID+"?purge_storage=true", nil)
	reqDestroy.Header.Set("X-HeroCMS-Internal-Secret", cfg.InternalSecretToken)
	wDestroy := httptest.NewRecorder()
	router.ServeHTTP(wDestroy, reqDestroy)
	if wDestroy.Code != http.StatusOK {
		t.Errorf("expected 200 OK destroying container, got %d", wDestroy.Code)
	}
}
