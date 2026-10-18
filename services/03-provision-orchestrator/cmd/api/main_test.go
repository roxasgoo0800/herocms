package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestHealthCheck(t *testing.T) {
	router := setupRouter(nil)

	req, _ := http.NewRequest(http.MethodGet, "/healthz", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d", w.Code)
	}

	var resp map[string]interface{}
	if err := json.Unmarshal(w.Body.Bytes(), &resp); err != nil {
		t.Fatalf("failed to parse JSON response: %v", err)
	}

	if resp["status"] != "healthy" {
		t.Errorf("expected status 'healthy', got %v", resp["status"])
	}
}

func TestListContainers(t *testing.T) {
	router := setupRouter(nil)

	req, _ := http.NewRequest(http.MethodGet, "/api/v1/containers", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d", w.Code)
	}

	var resp map[string]interface{}
	if err := json.Unmarshal(w.Body.Bytes(), &resp); err != nil {
		t.Fatalf("failed to parse JSON: %v", err)
	}

	if _, ok := resp["containers"]; !ok {
		t.Errorf("expected 'containers' array in response")
	}
}

func TestDeployValidation_InvalidSubdomain(t *testing.T) {
	router := setupRouter(nil)

	payload := DeployRequest{
		TenantID:    "tenant_123",
		SiteID:      "site_456",
		Subdomain:   "INVALID_SUBDOMAIN_UPPERCASE!",
		VersionHash: "12345678",
	}
	body, _ := json.Marshal(payload)

	req, _ := http.NewRequest(http.MethodPost, "/api/v1/deploy", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusBadRequest {
		t.Errorf("expected status 400 Bad Request for invalid subdomain, got %d", w.Code)
	}
}

func TestDeployValidation_MissingRequiredFields(t *testing.T) {
	router := setupRouter(nil)

	// Missing version_hash and tenant_id
	payload := map[string]string{
		"subdomain": "validsub",
	}
	body, _ := json.Marshal(payload)

	req, _ := http.NewRequest(http.MethodPost, "/api/v1/deploy", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusBadRequest {
		t.Errorf("expected status 400 for missing fields, got %d", w.Code)
	}
}

func TestDeploy_SimulationSuccess(t *testing.T) {
	router := setupRouter(nil)

	payload := DeployRequest{
		TenantID:    "t-valid-9942",
		SiteID:      "site-abc",
		Subdomain:   "my-portfolio",
		CustomDomain: "portfolio.example.com",
		VersionHash: "feedbeef1234",
	}
	body, _ := json.Marshal(payload)

	req, _ := http.NewRequest(http.MethodPost, "/api/v1/deploy", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d (body: %s)", w.Code, w.Body.Bytes())
	}

	var resp map[string]interface{}
	_ = json.Unmarshal(w.Body.Bytes(), &resp)

	if resp["status"] != "simulated_deployed" {
		t.Errorf("expected status 'simulated_deployed', got %v", resp["status"])
	}
}

func TestContainerLifecycleEndpoints(t *testing.T) {
	router := setupRouter(nil)

	// 1. Stop
	reqStop, _ := http.NewRequest(http.MethodPost, "/api/v1/containers/test-pod-01/stop", nil)
	wStop := httptest.NewRecorder()
	router.ServeHTTP(wStop, reqStop)
	if wStop.Code != http.StatusOK {
		t.Errorf("expected 200 for stop, got %d", wStop.Code)
	}

	// 2. Start
	reqStart, _ := http.NewRequest(http.MethodPost, "/api/v1/containers/test-pod-01/start", nil)
	wStart := httptest.NewRecorder()
	router.ServeHTTP(wStart, reqStart)
	if wStart.Code != http.StatusOK {
		t.Errorf("expected 200 for start, got %d", wStart.Code)
	}

	// 3. Delete
	reqDel, _ := http.NewRequest(http.MethodDelete, "/api/v1/containers/test-pod-01", nil)
	wDel := httptest.NewRecorder()
	router.ServeHTTP(wDel, reqDel)
	if wDel.Code != http.StatusOK {
		t.Errorf("expected 200 for delete, got %d", wDel.Code)
	}
}
