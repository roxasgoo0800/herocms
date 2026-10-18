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
