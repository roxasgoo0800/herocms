package main

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/cloudcms/dashboard-cms-backend/internal/config"
	"github.com/cloudcms/dashboard-cms-backend/internal/handler"
	"github.com/cloudcms/dashboard-cms-backend/internal/redis"
	"github.com/cloudcms/dashboard-cms-backend/internal/repository"
	"github.com/cloudcms/dashboard-cms-backend/internal/service"
	"github.com/cloudcms/dashboard-cms-backend/internal/storage"
	"github.com/gin-gonic/gin"
)

func TestSetupRouter_HealthAndRouting(t *testing.T) {
	gin.SetMode(gin.TestMode)

	cfg := &config.Config{
		Port:               "8080",
		AllowDevAuthBypass: true,
		JWTSecret:          []byte("test-32-byte-secret-key-herocms!"),
	}
	repo := repository.NewInMemoryRepository()
	rdb := redis.NewInMemoryClient()
	s3Client := &storage.S3Client{PublicURL: "http://localhost:9000", Available: true}
	services := service.NewServices(cfg, repo, rdb, s3Client)
	h := handler.NewHandler(services)

	router := SetupRouter(cfg, repo, rdb, s3Client, h)

	// 1. Root /healthz
	reqHealth, _ := http.NewRequest(http.MethodGet, "/healthz", nil)
	wHealth := httptest.NewRecorder()
	router.ServeHTTP(wHealth, reqHealth)

	if wHealth.Code != http.StatusOK {
		t.Fatalf("expected 200 for /healthz, got %d", wHealth.Code)
	}

	var healthRes map[string]interface{}
	if err := json.Unmarshal(wHealth.Body.Bytes(), &healthRes); err != nil {
		t.Fatalf("failed to parse /healthz body: %v", err)
	}
	if healthRes["status"] != "healthy" {
		t.Errorf("expected status healthy, got %v", healthRes["status"])
	}

	// 2. /api/healthz
	reqAPIHealth, _ := http.NewRequest(http.MethodGet, "/api/healthz", nil)
	wAPIHealth := httptest.NewRecorder()
	router.ServeHTTP(wAPIHealth, reqAPIHealth)

	if wAPIHealth.Code != http.StatusOK {
		t.Errorf("expected 200 for /api/healthz, got %d", wAPIHealth.Code)
	}

	// 3. API 404 Route
	req404, _ := http.NewRequest(http.MethodGet, "/api/nonexistent-endpoint", nil)
	w404 := httptest.NewRecorder()
	router.ServeHTTP(w404, req404)

	if w404.Code != http.StatusNotFound {
		t.Errorf("expected 404 for unknown api endpoint, got %d", w404.Code)
	}
}

func TestFindDistDir(t *testing.T) {
	// Preferred invalid path
	res := findDistDir("/invalid/nonexistent/path")
	// If dist exists in relative paths it might be found or return empty
	t.Logf("findDistDir returned: %q", res)

	// Empty preferred path
	resEmpty := findDistDir("")
	t.Logf("findDistDir(\"\") returned: %q", resEmpty)
}
