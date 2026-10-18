package middleware

import (
	"context"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/cloudcms/dashboard-cms-backend/internal/config"
	"github.com/cloudcms/dashboard-cms-backend/internal/redis"
	"github.com/cloudcms/dashboard-cms-backend/internal/service"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func newTestRedis() *redis.Client {
	return redis.NewInMemoryClient()
}

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

func TestCORS(t *testing.T) {
	gin.SetMode(gin.TestMode)
	cfg := &config.Config{
		CORSAllowedOrigins:   []string{"http://localhost:5173", "https://studio.herocms.com"},
		CORSAllowCredentials: true,
	}

	router := gin.New()
	router.Use(CORS(cfg))
	router.GET("/api/ping", func(c *gin.Context) {
		c.String(http.StatusOK, "pong")
	})

	// 1. Allowed Origin
	req, _ := http.NewRequest(http.MethodGet, "/api/ping", nil)
	req.Header.Set("Origin", "http://localhost:5173")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Header().Get("Access-Control-Allow-Origin") != "http://localhost:5173" {
		t.Errorf("expected allowed origin header, got %q", w.Header().Get("Access-Control-Allow-Origin"))
	}
	if w.Header().Get("Access-Control-Allow-Credentials") != "true" {
		t.Errorf("expected Allow-Credentials true")
	}

	// 2. Options Preflight
	reqPreflight, _ := http.NewRequest(http.MethodOptions, "/api/ping", nil)
	reqPreflight.Header.Set("Origin", "https://studio.herocms.com")
	wPreflight := httptest.NewRecorder()
	router.ServeHTTP(wPreflight, reqPreflight)

	if wPreflight.Code != http.StatusNoContent {
		t.Errorf("expected 204 No Content for OPTIONS preflight, got %d", wPreflight.Code)
	}

	// 3. Disallowed Origin
	reqBad, _ := http.NewRequest(http.MethodGet, "/api/ping", nil)
	reqBad.Header.Set("Origin", "http://malicious.site.com")
	wBad := httptest.NewRecorder()
	router.ServeHTTP(wBad, reqBad)

	if wBad.Header().Get("Access-Control-Allow-Origin") != "" {
		t.Errorf("disallowed origin should not have Access-Control-Allow-Origin header")
	}
}

func TestCSRFProtection(t *testing.T) {
	gin.SetMode(gin.TestMode)
	cfg := &config.Config{
		CSRFEnabled:        true,
		CSRFCookieName:     "csrf_token",
		CSRFCookieDomain:   "",
		CSRFCookieSecure:   false,
		AllowDevAuthBypass: true,
	}

	router := gin.New()
	router.Use(CSRFProtection(cfg))
	router.GET("/api/safe", func(c *gin.Context) {
		c.String(http.StatusOK, "safe get")
	})
	router.POST("/api/auth/login", func(c *gin.Context) {
		c.String(http.StatusOK, "logged in")
	})
	router.POST("/api/mutate", func(c *gin.Context) {
		c.String(http.StatusOK, "mutated")
	})

	// 1. Safe GET generates CSRF token
	reqGet, _ := http.NewRequest(http.MethodGet, "/api/safe", nil)
	wGet := httptest.NewRecorder()
	router.ServeHTTP(wGet, reqGet)

	if wGet.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", wGet.Code)
	}
	csrfTokenHeader := wGet.Header().Get("X-CSRF-Token")
	if csrfTokenHeader == "" {
		t.Fatalf("expected X-CSRF-Token response header")
	}

	// 2. Mutating POST without CSRF token must be rejected 403
	reqPostNoToken, _ := http.NewRequest(http.MethodPost, "/api/mutate", nil)
	// Cookie sent, but no header
	reqPostNoToken.AddCookie(&http.Cookie{Name: "csrf_token", Value: csrfTokenHeader})
	wPostNoToken := httptest.NewRecorder()
	router.ServeHTTP(wPostNoToken, reqPostNoToken)

	if wPostNoToken.Code != http.StatusForbidden {
		t.Errorf("expected 403 Forbidden for missing CSRF header, got %d", wPostNoToken.Code)
	}

	// 3. Mutating POST with matching header and cookie must pass 200
	reqPostValid, _ := http.NewRequest(http.MethodPost, "/api/mutate", nil)
	reqPostValid.AddCookie(&http.Cookie{Name: "csrf_token", Value: csrfTokenHeader})
	reqPostValid.Header.Set("X-CSRF-Token", csrfTokenHeader)
	wPostValid := httptest.NewRecorder()
	router.ServeHTTP(wPostValid, reqPostValid)

	if wPostValid.Code != http.StatusOK {
		t.Errorf("expected 200 OK for valid CSRF token, got %d", wPostValid.Code)
	}

	// 4. Public auth login bypasses CSRF mutation check
	reqLogin, _ := http.NewRequest(http.MethodPost, "/api/auth/login", nil)
	wLogin := httptest.NewRecorder()
	router.ServeHTTP(wLogin, reqLogin)

	if wLogin.Code != http.StatusOK {
		t.Errorf("expected 200 OK for login bypass, got %d", wLogin.Code)
	}
}

func TestRateLimiter(t *testing.T) {
	gin.SetMode(gin.TestMode)
	rdb := newTestRedis()

	router := gin.New()
	router.Use(RateLimiter(rdb, 2, time.Minute))
	router.GET("/limited", func(c *gin.Context) {
		c.String(http.StatusOK, "ok")
	})

	// Request 1: ok
	req1, _ := http.NewRequest(http.MethodGet, "/limited", nil)
	w1 := httptest.NewRecorder()
	router.ServeHTTP(w1, req1)
	if w1.Code != http.StatusOK {
		t.Fatalf("request 1 should be 200, got %d", w1.Code)
	}

	// Request 2: ok
	req2, _ := http.NewRequest(http.MethodGet, "/limited", nil)
	w2 := httptest.NewRecorder()
	router.ServeHTTP(w2, req2)
	if w2.Code != http.StatusOK {
		t.Fatalf("request 2 should be 200, got %d", w2.Code)
	}

	// Request 3: 429 Too Many Requests
	req3, _ := http.NewRequest(http.MethodGet, "/limited", nil)
	w3 := httptest.NewRecorder()
	router.ServeHTTP(w3, req3)
	if w3.Code != http.StatusTooManyRequests {
		t.Errorf("request 3 should be 429, got %d", w3.Code)
	}
}

func TestSessionOrJWTAuth_Flows(t *testing.T) {
	gin.SetMode(gin.TestMode)
	jwtSecret := []byte("super-secret-key-32-bytes-long!!")
	rdb := newTestRedis()

	cfgProd := &config.Config{
		JWTSecret:          jwtSecret,
		AllowDevAuthBypass: false,
	}

	router := gin.New()
	router.Use(SessionOrJWTAuth(cfgProd, rdb))
	router.GET("/user/profile", func(c *gin.Context) {
		email, _ := c.Get("email")
		c.JSON(http.StatusOK, gin.H{"email": email})
	})

	// 1. Unauthenticated in production -> 401
	reqUnauth, _ := http.NewRequest(http.MethodGet, "/user/profile", nil)
	wUnauth := httptest.NewRecorder()
	router.ServeHTTP(wUnauth, reqUnauth)
	if wUnauth.Code != http.StatusUnauthorized {
		t.Errorf("expected 401 for unauthenticated request, got %d", wUnauth.Code)
	}

	// 2. Valid JWT Bearer Token -> 200
	claims := service.JWTClaims{
		TenantID: "tenant-jwt-99",
		UserID:   "user-jwt-1",
		Email:    "jwt-user@herocms.com",
		Role:     "customer",
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour)),
		},
	}
	tokenObj := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenStr, _ := tokenObj.SignedString(jwtSecret)

	reqJWT, _ := http.NewRequest(http.MethodGet, "/user/profile", nil)
	reqJWT.Header.Set("Authorization", "Bearer "+tokenStr)
	wJWT := httptest.NewRecorder()
	router.ServeHTTP(wJWT, reqJWT)

	if wJWT.Code != http.StatusOK {
		t.Fatalf("expected 200 for valid JWT, got %d (body: %s)", wJWT.Code, wJWT.Body.Bytes())
	}
	if !strings.Contains(wJWT.Body.String(), "jwt-user@herocms.com") {
		t.Errorf("expected email in response: %s", wJWT.Body.String())
	}

	// 3. Valid Session Cookie -> 200
	sess := &redis.SessionData{
		SessionID: "sess_cookie_123",
		TenantID:  "tenant-sess-88",
		UserID:    "user-sess-2",
		Email:     "session-user@herocms.com",
		FullName:  "Session User",
		Role:      "customer",
	}
	_ = rdb.SaveSession(context.Background(), sess, time.Hour)

	reqCookie, _ := http.NewRequest(http.MethodGet, "/user/profile", nil)
	reqCookie.AddCookie(&http.Cookie{Name: "herocms_session", Value: "sess_cookie_123"})
	wCookie := httptest.NewRecorder()
	router.ServeHTTP(wCookie, reqCookie)

	if wCookie.Code != http.StatusOK {
		t.Fatalf("expected 200 for valid session cookie, got %d (body: %s)", wCookie.Code, wCookie.Body.Bytes())
	}
	if !strings.Contains(wCookie.Body.String(), "session-user@herocms.com") {
		t.Errorf("expected session email in response: %s", wCookie.Body.String())
	}

	// 4. Dev Auth Fallback in development mode
	cfgDev := &config.Config{
		AllowDevAuthBypass: true,
	}
	routerDev := gin.New()
	routerDev.Use(SessionOrJWTAuth(cfgDev, rdb))
	routerDev.GET("/dev/test", func(c *gin.Context) {
		email, _ := c.Get("email")
		c.JSON(http.StatusOK, gin.H{"email": email})
	})

	reqDev, _ := http.NewRequest(http.MethodGet, "/dev/test", nil)
	wDev := httptest.NewRecorder()
	routerDev.ServeHTTP(wDev, reqDev)

	if wDev.Code != http.StatusOK {
		t.Fatalf("expected 200 for dev bypass, got %d", wDev.Code)
	}
}
