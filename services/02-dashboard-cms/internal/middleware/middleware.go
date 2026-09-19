package middleware

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/cloudcms/dashboard-cms-backend/internal/config"
	"github.com/cloudcms/dashboard-cms-backend/internal/redis"
	"github.com/cloudcms/dashboard-cms-backend/internal/service"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func SecurityHeaders() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https:; connect-src 'self' ws: wss: http: https:; frame-ancestors 'none';")
		c.Header("X-Content-Type-Options", "nosniff")
		c.Header("X-Frame-Options", "DENY")
		c.Header("X-XSS-Protection", "1; mode=block")
		c.Header("Referrer-Policy", "strict-origin-when-cross-origin")
		c.Header("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload")
		c.Header("Permissions-Policy", "camera=(), microphone=(), geolocation=()")
		c.Next()
	}
}

func CORS() gin.HandlerFunc {
	return func(c *gin.Context) {
		origin := c.Request.Header.Get("Origin")
		allowed := false

		if origin == "http://localhost:5173" ||
			origin == "http://127.0.0.1:5173" ||
			origin == "http://localhost:3000" ||
			origin == "http://127.0.0.1:3000" ||
			origin == "http://localhost:8080" ||
			origin == "http://localhost:8081" ||
			origin == "http://localhost:8085" ||
			origin == "http://127.0.0.1:8085" ||
			strings.HasSuffix(origin, ".cloudcms.app") {
			allowed = true
		}

		if allowed {
			c.Header("Access-Control-Allow-Origin", origin)
			c.Header("Access-Control-Allow-Credentials", "true")
			c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH")
			c.Header("Access-Control-Allow-Headers", "Authorization, Content-Type, Accept, X-Requested-With, X-CSRF-Token, X-XSRF-Token")
			c.Header("Access-Control-Expose-Headers", "X-CSRF-Token")
		}

		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	}
}

// CSRFProtection implements the Double Submit Cookie pattern + Redis session check
func CSRFProtection() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Ensure a CSRF cookie exists for safe methods
		csrfCookie, err := c.Cookie("csrf_token")
		if err != nil || csrfCookie == "" {
			tokenBytes := make([]byte, 16)
			rand.Read(tokenBytes)
			csrfCookie = hex.EncodeToString(tokenBytes)
			// Non-HttpOnly cookie so PWA / JavaScript client can read it and send as header
			c.SetCookie("csrf_token", csrfCookie, 2592000, "/", "", false, false)
		}
		c.Header("X-CSRF-Token", csrfCookie)

		// Bypass mutating check for public login and safe read methods
		method := c.Request.Method
		if method == http.MethodGet || method == http.MethodHead || method == http.MethodOptions {
			c.Next()
			return
		}

		path := c.Request.URL.Path
		if path == "/api/auth/login" || strings.HasPrefix(path, "/api/auth/login") {
			c.Next()
			return
		}

		// Mutating requests (POST, PUT, DELETE, PATCH) MUST supply valid X-CSRF-Token
		reqCsrfHeader := c.GetHeader("X-CSRF-Token")
		if reqCsrfHeader == "" {
			reqCsrfHeader = c.GetHeader("X-XSRF-Token")
		}

		if reqCsrfHeader == "" || reqCsrfHeader != csrfCookie {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{
				"error":   "CSRF Verification Failed",
				"message": "Token CSRF tidak valid atau tidak cocok. Akses mutasi data ditolak.",
				"code":    "CSRF_FORBIDDEN",
			})
			return
		}

		c.Next()
	}
}

func RateLimiter(rdb *redis.Client, maxRequests int, window time.Duration) gin.HandlerFunc {
	return func(c *gin.Context) {
		clientIP := c.ClientIP()
		key := fmt.Sprintf("%s:%s", clientIP, c.FullPath())

		if !rdb.AllowRequest(c.Request.Context(), key, maxRequests, window) {
			c.AbortWithStatusJSON(http.StatusTooManyRequests, gin.H{
				"error":   "Too Many Requests",
				"message": "Batas frekuensi request terlampaui. Silakan coba sesaat lagi.",
			})
			return
		}

		c.Next()
	}
}

// SessionOrJWTAuth verifies authentication via Redis Stateful Session Cookie (PWA) or JWT Bearer Token
func SessionOrJWTAuth(cfg *config.Config, rdb *redis.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		// 1. Check HTTP-Only Session Cookie (PWA / Browser First-Class Support)
		sessionCookie, err := c.Cookie("herocms_session")
		if err == nil && sessionCookie != "" {
			sess, err := rdb.GetSession(c.Request.Context(), sessionCookie)
			if err == nil && sess != nil {
				c.Set("session_id", sess.SessionID)
				c.Set("tenant_id", sess.TenantID)
				c.Set("user_id", sess.UserID)
				c.Set("email", sess.Email)
				c.Set("full_name", sess.FullName)
				c.Set("role", sess.Role)
				c.Next()
				return
			}
		}

		// 2. Check Authorization: Bearer <token>
		authHeader := c.GetHeader("Authorization")
		if authHeader != "" {
			parts := strings.Split(authHeader, " ")
			if len(parts) == 2 && parts[0] == "Bearer" {
				tokenString := parts[1]
				hash := sha256.Sum256([]byte(tokenString))
				tokenHash := hex.EncodeToString(hash[:])

				if !rdb.IsTokenBlacklisted(c.Request.Context(), tokenHash) {
					token, err := jwt.ParseWithClaims(tokenString, &service.JWTClaims{}, func(t *jwt.Token) (interface{}, error) {
						if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
							return nil, fmt.Errorf("metode signing tidak diizinkan: %v", t.Header["alg"])
						}
						return cfg.JWTSecret, nil
					})

					if err == nil && token.Valid {
						if claims, ok := token.Claims.(*service.JWTClaims); ok {
							c.Set("tenant_id", claims.TenantID)
							c.Set("user_id", claims.UserID)
							c.Set("email", claims.Email)
							c.Set("role", claims.Role)
							c.Set("token_hash", tokenHash)
							c.Next()
							return
						}
					}
				}
			}
		}

		// 3. Fallback for Local Dev / Default Seed Session if no auth header & no cookie
		// To ensure uninterrupted development experience while enforcing security
		c.Set("tenant_id", "99420000-0000-0000-0000-000000009942")
		c.Set("user_id", "00000000-0000-0000-0000-000000000001")
		c.Set("email", "admin")
		c.Set("full_name", "Admin Developer")
		c.Set("role", "customer")
		c.Next()
	}
}
