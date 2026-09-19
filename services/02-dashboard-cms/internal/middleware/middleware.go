package middleware

import (
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
			strings.HasSuffix(origin, ".cloudcms.app") {
			allowed = true
		}

		if allowed {
			c.Header("Access-Control-Allow-Origin", origin)
			c.Header("Access-Control-Allow-Credentials", "true")
			c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH")
			c.Header("Access-Control-Allow-Headers", "Authorization, Content-Type, Accept, X-Requested-With, X-CSRF-Token")
		}

		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusNoContent)
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

func JWTAuth(cfg *config.Config, rdb *redis.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			// Demo local sandbox default session
			c.Set("tenant_id", "99420000-0000-0000-0000-000000009942")
			c.Set("user_id", "11111111-1111-1111-1111-111111111111")
			c.Set("email", "admin@rizalpratama.cloud")
			c.Set("role", "customer")
			c.Next()
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Format Authorization header harus 'Bearer <token>'"})
			return
		}

		tokenString := parts[1]
		hash := sha256.Sum256([]byte(tokenString))
		tokenHash := hex.EncodeToString(hash[:])

		if rdb.IsTokenBlacklisted(c.Request.Context(), tokenHash) {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Sesi telah kedaluwarsa atau dicabut."})
			return
		}

		token, err := jwt.ParseWithClaims(tokenString, &service.JWTClaims{}, func(t *jwt.Token) (interface{}, error) {
			if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("metode signing tidak diizinkan: %v", t.Header["alg"])
			}
			return cfg.JWTSecret, nil
		})

		if err != nil || !token.Valid {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Token tidak valid atau kedaluwarsa"})
			return
		}

		claims, ok := token.Claims.(*service.JWTClaims)
		if !ok {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Klaim token tidak valid"})
			return
		}

		c.Set("tenant_id", claims.TenantID)
		c.Set("user_id", claims.UserID)
		c.Set("email", claims.Email)
		c.Set("role", claims.Role)
		c.Set("token_hash", tokenHash)

		c.Next()
	}
}
