package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestAIWorkerHealthCheck(t *testing.T) {
	router := setupRouter(nil)

	req, _ := http.NewRequest(http.MethodGet, "/healthz", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", w.Code)
	}

	var resp map[string]interface{}
	if err := json.Unmarshal(w.Body.Bytes(), &resp); err != nil {
		t.Fatalf("failed to parse JSON: %v", err)
	}

	if resp["service"] != "ai-agent-service" {
		t.Errorf("expected service 'ai-agent-service', got %v", resp["service"])
	}
}

func TestAITemplateGenerate(t *testing.T) {
	router := setupRouter(nil)

	payload := ThemeGenerateRequest{
		Prompt:   "Buat tema modern clean tech portfolio",
		Vertical: "portfolio",
	}
	body, _ := json.Marshal(payload)

	req, _ := http.NewRequest(http.MethodPost, "/api/v1/ai/template/generate", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", w.Code)
	}

	var resp map[string]interface{}
	_ = json.Unmarshal(w.Body.Bytes(), &resp)

	palette, ok := resp["palette"].(map[string]interface{})
	if !ok || palette["primary"] == "" {
		t.Errorf("expected valid palette in AI response, got %v", resp["palette"])
	}
}

func TestTelemetryHit_Validation(t *testing.T) {
	router := setupRouter(nil)

	// Invalid Path without leading slash
	payload := TelemetryHitRequest{
		TenantID:  "valid-tenant",
		ContentID: "c-1",
		Path:      "invalid-path-no-slash",
	}
	body, _ := json.Marshal(payload)

	req, _ := http.NewRequest(http.MethodPost, "/api/v1/telemetry/hit", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusBadRequest {
		t.Errorf("expected status 400 for path without leading slash, got %d", w.Code)
	}
}

func TestAITemplateGenerate_InvalidPayload(t *testing.T) {
	router := setupRouter(nil)

	// Missing prompt
	body := []byte(`{"vertical":"ecommerce"}`)
	req, _ := http.NewRequest(http.MethodPost, "/api/v1/ai/template/generate", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusBadRequest {
		t.Fatalf("expected 400 for missing prompt, got %d", w.Code)
	}
}

func TestTelemetryHit_ValidRequest(t *testing.T) {
	router := setupRouter(nil)

	payload := TelemetryHitRequest{
		TenantID:  "acme-corp",
		ContentID: "post-100",
		Path:      "/blog/release-v1",
	}
	body, _ := json.Marshal(payload)

	req, _ := http.NewRequest(http.MethodPost, "/api/v1/telemetry/hit", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200 for valid hit, got %d", w.Code)
	}

	var resp map[string]interface{}
	_ = json.Unmarshal(w.Body.Bytes(), &resp)
	if resp["status"] != "recorded" {
		t.Errorf("expected status 'recorded', got %v", resp["status"])
	}
}

func TestTelemetryHit_InvalidTenantID(t *testing.T) {
	router := setupRouter(nil)

	// Invalid characters in tenant_id
	payload := TelemetryHitRequest{
		TenantID:  "acme;DROP TABLE users;--",
		ContentID: "post-100",
		Path:      "/blog/post",
	}
	body, _ := json.Marshal(payload)

	req, _ := http.NewRequest(http.MethodPost, "/api/v1/telemetry/hit", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusBadRequest {
		t.Fatalf("expected 400 for SQL injection attempt in tenant_id, got %d", w.Code)
	}
}

func TestAnalyticsTopViews(t *testing.T) {
	router := setupRouter(nil)

	// 1. Default tenant
	req, _ := http.NewRequest(http.MethodGet, "/api/v1/analytics/top-views", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", w.Code)
	}

	// 2. Custom valid tenant
	req2, _ := http.NewRequest(http.MethodGet, "/api/v1/analytics/top-views?tenant_id=tenant-pro", nil)
	w2 := httptest.NewRecorder()
	router.ServeHTTP(w2, req2)

	if w2.Code != http.StatusOK {
		t.Fatalf("expected 200 for valid custom tenant, got %d", w2.Code)
	}

	// 3. Invalid tenant format
	req3, _ := http.NewRequest(http.MethodGet, "/api/v1/analytics/top-views?tenant_id=invalid!name", nil)
	w3 := httptest.NewRecorder()
	router.ServeHTTP(w3, req3)

	if w3.Code != http.StatusBadRequest {
		t.Fatalf("expected 400 for invalid tenant format, got %d", w3.Code)
	}
}

func TestAIServiceSecurityHeaders(t *testing.T) {
	router := setupRouter(nil)

	req, _ := http.NewRequest(http.MethodGet, "/healthz", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Header().Get("X-Content-Type-Options") != "nosniff" {
		t.Errorf("expected nosniff, got %q", w.Header().Get("X-Content-Type-Options"))
	}
	if w.Header().Get("X-Frame-Options") != "DENY" {
		t.Errorf("expected DENY, got %q", w.Header().Get("X-Frame-Options"))
	}
	if w.Header().Get("X-XSS-Protection") != "1; mode=block" {
		t.Errorf("expected XSS protection header, got %q", w.Header().Get("X-XSS-Protection"))
	}
}

