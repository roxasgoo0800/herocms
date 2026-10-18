package middleware

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/cloudcms/dashboard-cms-backend/internal/config"
	"github.com/gin-gonic/gin"
)

func TestSecurityHeaders(t *testing.T) {
	gin.SetMode(gin.TestMode)
	router := gin.New()
	router.Use(SecurityHeaders())
	router.GET("/test", func(c *gin.Context) {
		c.String(http.StatusOK, "ok")
	})

	req, _ := http.NewRequest(http.MethodGet, "/test", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", w.Code)
	}

	// Verify Enterprise Headers
	if w.Header().Get("X-Frame-Options") != "DENY" {
		t.Errorf("expected X-Frame-Options DENY, got %q", w.Header().Get("X-Frame-Options"))
	}
	if w.Header().Get("X-Content-Type-Options") != "nosniff" {
		t.Errorf("expected X-Content-Type-Options nosniff, got %q", w.Header().Get("X-Content-Type-Options"))
	}
	if w.Header().Get("Content-Security-Policy") == "" {
		t.Errorf("expected Content-Security-Policy header to be set")
	}
}

func TestNoCache(t *testing.T) {
	gin.SetMode(gin.TestMode)
	router := gin.New()
	router.Use(NoCache())
	router.GET("/dynamic", func(c *gin.Context) {
		c.String(http.StatusOK, "dynamic data")
	})

	req, _ := http.NewRequest(http.MethodGet, "/dynamic", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	cc := w.Header().Get("Cache-Control")
	if cc == "" || cc != "no-store, no-cache, must-revalidate, max-age=0" {
		t.Errorf("expected strict anti-cache header, got %q", cc)
	}
}

func TestSessionOrJWTAuth_ProductionRejection(t *testing.T) {
	gin.SetMode(gin.TestMode)

	// Simulate production config where dev bypass is disabled
	cfg := &config.Config{
		Environment:        "production",
		AllowDevAuthBypass: false,
	}

	router := gin.New()
	router.Use(SessionOrJWTAuth(cfg, nil))
	router.GET("/protected/data", func(c *gin.Context) {
		c.String(http.StatusOK, "secret data")
	})

	// Unauthenticated request without token and without cookie
	req, _ := http.NewRequest(http.MethodGet, "/protected/data", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	// In production, unauthenticated request MUST be rejected with 401 Unauthorized
	if w.Code != http.StatusUnauthorized {
		t.Errorf("CRITICAL SECURITY: Expected 401 Unauthorized for unauthenticated access in production, got %d (body: %s)", w.Code, w.Body.Bytes())
	}
}
