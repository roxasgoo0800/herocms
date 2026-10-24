package api

import (
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

// InternalSecretGuard enforces perimeter security for internal service-to-service communication
func InternalSecretGuard(expectedToken string, enabled bool) gin.HandlerFunc {
	return func(c *gin.Context) {
		path := c.Request.URL.Path

		// Health & Readiness probes are public within the internal network for container orchestrators
		if path == "/healthz" || path == "/readyz" {
			c.Next()
			return
		}

		if !enabled {
			c.Next()
			return
		}

		token := c.GetHeader("X-HeroCMS-Internal-Secret")
		if token == "" {
			// Also check Authorization: Bearer <secret>
			authHeader := c.GetHeader("Authorization")
			if strings.HasPrefix(authHeader, "Bearer ") {
				token = strings.TrimPrefix(authHeader, "Bearer ")
			}
		}

		if token != expectedToken {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{
				"error":     "Akses ditolak: X-HeroCMS-Internal-Secret tidak valid atau tidak disertakan.",
				"code":      "ERR_INTERNAL_SECRET_INVALID",
				"timestamp": time.Now().UTC().Format(time.RFC3339),
			})
			return
		}

		c.Next()
	}
}

// RequestLogger logs incoming internal requests with duration and client IP
func RequestLogger() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		c.Next()
		latency := time.Since(start)

		status := c.Writer.Status()
		log.Printf("[ORCHESTRATOR API] %d | %12v | %s | %s %s",
			status,
			latency,
			c.ClientIP(),
			c.Request.Method,
			c.Request.URL.Path,
		)
	}
}

// JSONRecovery recovers from panics and renders structured error response
func JSONRecovery() gin.HandlerFunc {
	return func(c *gin.Context) {
		defer func() {
			if err := recover(); err != nil {
				log.Printf("[PANIC RECOVERED] %v", err)
				c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
					"error":     "Internal server error occurred within orchestrator engine",
					"code":      "ERR_PANIC_RECOVERED",
					"timestamp": time.Now().UTC().Format(time.RFC3339),
				})
			}
		}()
		c.Next()
	}
}
