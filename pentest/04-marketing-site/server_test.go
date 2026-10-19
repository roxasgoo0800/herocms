package main

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"testing"
)

func setupTestServer() http.Handler {
	tmpDist := filepath.Join(os.TempDir(), "marketing-test-dist")
	_ = os.MkdirAll(filepath.Join(tmpDist, "assets"), 0755)
	_ = os.WriteFile(filepath.Join(tmpDist, "index.html"), []byte("<html><body>HeroCMS Marketing</body></html>"), 0644)
	_ = os.WriteFile(filepath.Join(tmpDist, "assets", "bundle.js"), []byte("console.log('test')"), 0644)

	os.Setenv("DIST_DIR", tmpDist)
	return SetupMarketingMux(tmpDist)
}

func TestMarketingHealthCheck(t *testing.T) {
	handler := setupTestServer()

	req, _ := http.NewRequest(http.MethodGet, "/healthz", nil)
	w := httptest.NewRecorder()
	handler.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", w.Code)
	}

	var resp map[string]interface{}
	if err := json.Unmarshal(w.Body.Bytes(), &resp); err != nil {
		t.Fatalf("failed to parse json: %v", err)
	}

	if resp["service"] != "marketing-site" || resp["status"] != "healthy" {
		t.Errorf("unexpected healthz response: %v", resp)
	}
}

func TestMarketingSecurityHeaders(t *testing.T) {
	handler := setupTestServer()

	req, _ := http.NewRequest(http.MethodGet, "/", nil)
	w := httptest.NewRecorder()
	handler.ServeHTTP(w, req)

	if w.Header().Get("X-Content-Type-Options") != "nosniff" {
		t.Errorf("expected nosniff, got %q", w.Header().Get("X-Content-Type-Options"))
	}

	if w.Header().Get("X-Frame-Options") != "SAMEORIGIN" {
		t.Errorf("expected SAMEORIGIN, got %q", w.Header().Get("X-Frame-Options"))
	}
}

func TestMarketingStaticHashedAssetCache(t *testing.T) {
	handler := setupTestServer()

	req, _ := http.NewRequest(http.MethodGet, "/assets/bundle.js", nil)
	w := httptest.NewRecorder()
	handler.ServeHTTP(w, req)

	cc := w.Header().Get("Cache-Control")
	if cc != "public, max-age=31536000, immutable" {
		t.Errorf("expected immutable long-term cache for hashed static asset, got %q", cc)
	}
}

func TestMarketingSPAFallback(t *testing.T) {
	handler := setupTestServer()

	req, _ := http.NewRequest(http.MethodGet, "/pricing", nil)
	w := httptest.NewRecorder()
	handler.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200 for SPA route, got %d", w.Code)
	}

	body := w.Body.String()
	if body != "<html><body>HeroCMS Marketing</body></html>" {
		t.Errorf("expected index.html content for SPA route, got %q", body)
	}

	if w.Header().Get("Cache-Control") != "no-cache, no-store, must-revalidate, max-age=0" {
		t.Errorf("expected anti-cache headers for index.html, got %q", w.Header().Get("Cache-Control"))
	}
}
