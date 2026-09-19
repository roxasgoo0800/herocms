package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"path/filepath"
	"strings"
	"syscall"
	"time"

	"github.com/cloudcms/dashboard-cms-backend/internal/config"
	"github.com/cloudcms/dashboard-cms-backend/internal/handler"
	"github.com/cloudcms/dashboard-cms-backend/internal/middleware"
	"github.com/cloudcms/dashboard-cms-backend/internal/redis"
	"github.com/cloudcms/dashboard-cms-backend/internal/repository"
	"github.com/cloudcms/dashboard-cms-backend/internal/service"
	"github.com/gin-gonic/gin"
)

func main() {
	// 1. Load System Configuration & Secrets
	cfg := config.LoadConfig()

	// 2. Initialize Redis 7 Client (Cache, Rate-Limit, Top-Views ZSET)
	rdb := redis.NewClient(cfg)

	// 3. Initialize PostgreSQL 16 Repository (Row-Level Security)
	repo := repository.NewRepository(cfg)

	// 4. Initialize Core Business Logic Services
	services := service.NewServices(cfg, repo, rdb)

	// 5. Initialize HTTP Handlers
	h := handler.NewHandler(services)

	// 6. Setup Gin Router
	gin.SetMode(gin.ReleaseMode)
	router := gin.New()
	router.Use(gin.Recovery())

	// Enterprise Security Headers, Strict CORS, & CSRF Protection
	router.Use(middleware.SecurityHeaders())
	router.Use(middleware.CORS())
	router.Use(middleware.CSRFProtection())

	// Health Check
	router.GET("/healthz", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"service":  "HeroCMS Studio Backend & Static Host",
			"status":   "healthy",
			"database": repo.DB != nil,
			"redis":    rdb.Rdb != nil,
			"time":     time.Now().UTC().Format(time.RFC3339),
		})
	})

	// 7. API Routing Layer
	api := router.Group("/api")
	{
		api.GET("/healthz", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"status": "ok", "service": "api"})
		})

		// Public Auth Endpoints (Protected with 15 req/min brute-force limiter)
		auth := api.Group("/auth")
		auth.Use(middleware.RateLimiter(rdb, 15, time.Minute))
		{
			auth.POST("/login", h.Login)
			auth.POST("/register", h.Register)
		}

		// Authenticated Routes (Protected with Session/JWT & standard 120 req/min limiter)
		protected := api.Group("")
		protected.Use(middleware.RateLimiter(rdb, 120, time.Minute))
		protected.Use(middleware.SessionOrJWTAuth(cfg, rdb))
		{
			// Session
			protected.GET("/auth/me", h.Me)
			protected.POST("/auth/logout", h.Logout)

			// Containers & Multi-Site Hub
			protected.GET("/containers", h.ListContainers)
			protected.POST("/containers", h.CreateContainer)
			protected.PUT("/containers/:id/design", h.SaveSiteDesign)
			protected.POST("/containers/:id/start", h.StartContainer)
			protected.POST("/containers/:id/stop", h.StopContainer)
			protected.DELETE("/containers/:id", h.DeleteContainer)

			// Publishing Engine (Articles & Content)
			protected.GET("/articles", h.ListArticles)

			// Asset Storage (MinIO S3)
			protected.GET("/assets", h.ListAssets)

			// Custom Domain & DNS Ingress
			protected.GET("/domains", h.ListDomains)

			// Support Tickets & Threads
			protected.GET("/tickets", h.ListTickets)
			protected.GET("/tickets/:id/messages", h.GetTicketMessages)

			// Billing & Invoices
			protected.GET("/invoices", h.ListInvoices)
			protected.GET("/billing/quota", h.GetBillingQuota)
			protected.POST("/billing/checkout", h.CheckoutPlan)

			// Webhooks & API Keys
			protected.GET("/webhooks", h.ListWebhooks)

			// Real-Time Analytics & Top-Views (Redis ZSET)
			protected.GET("/analytics/top-views", h.GetTopViews)
			protected.POST("/analytics/hit", h.RecordHit)

			// Redis Cache Warming & Pre-fetch
			protected.POST("/cache/warm", h.WarmCache)
			protected.GET("/cache/warm", h.WarmCache)
		}
	}

	// 8. Single-Binary Static Vue 3 SPA Host & HTML5 Fallback
	distDir := findDistDir(cfg.DistDir)
	if distDir != "" {
		assetsDir := filepath.Join(distDir, "assets")
		if _, err := os.Stat(assetsDir); err == nil {
			router.Static("/assets", assetsDir)
		}

		// Fallback for HTML5 history mode (SPA)
		router.NoRoute(func(c *gin.Context) {
			path := c.Request.URL.Path
			if strings.HasPrefix(path, "/api") {
				c.JSON(http.StatusNotFound, gin.H{"error": "Endpoint tidak ditemukan"})
				return
			}

			targetFile := filepath.Join(distDir, filepath.Clean(path))
			if fi, err := os.Stat(targetFile); err == nil && !fi.IsDir() {
				c.File(targetFile)
				return
			}

			// SPA Fallback: Serve index.html
			c.Header("Cache-Control", "no-cache, no-store, must-revalidate")
			c.File(filepath.Join(distDir, "index.html"))
		})

		log.Printf("[STATIC HOST] Serving compiled Vue 3 SPA from %s with HTML5 fallback", distDir)
	} else {
		log.Println("[STATIC NOTICE] No dist directory found. Running in API-only mode.")
	}

	// 9. Launch Server with Graceful Shutdown
	srv := &http.Server{
		Addr:    ":" + cfg.Port,
		Handler: router,
	}

	go func() {
		log.Printf("[HEROCMS STUDIO] Golang Backend & Vue Host listening on http://127.0.0.1:%s", cfg.Port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Server error: %v\n", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("Shutting down HeroCMS Studio server gracefully...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		log.Fatalf("Server forced to shutdown: %v", err)
	}
	log.Println("Server exiting cleanly")
}

// findDistDir resolves the dist directory location across different execution paths
func findDistDir(preferred string) string {
	candidates := []string{
		preferred,
		"./dist",
		"../../dist",
		"../dist",
		"/home/rizal/dockerfile/docker-cms/services/02-dashboard-cms/dist",
	}

	for _, cand := range candidates {
		idx := filepath.Join(cand, "index.html")
		if _, err := os.Stat(idx); err == nil {
			return cand
		}
	}
	return ""
}
