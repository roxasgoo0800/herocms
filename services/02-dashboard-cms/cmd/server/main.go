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
	"github.com/cloudcms/dashboard-cms-backend/internal/storage"
	"github.com/gin-gonic/gin"
)

func main() {
	// 1. Load System Configuration & Secrets
	cfg := config.LoadConfig()

	// 2. Initialize Redis 7 Client (Cache, Rate-Limit, Top-Views ZSET)
	rdb := redis.NewClient(cfg)

	// 3. Initialize PostgreSQL 16 Repository (Row-Level Security)
	repo := repository.NewRepository(cfg)

	// 4. Initialize MinIO S3 Object Storage Client
	s3Client := storage.NewS3Client(cfg)

	// 5. Initialize Core Business Logic Services
	services := service.NewServices(cfg, repo, rdb, s3Client)

	// 6. Initialize HTTP Handlers
	h := handler.NewHandler(services)

	// 7. Setup Router
	router := SetupRouter(cfg, repo, rdb, s3Client, h)

	// 8. Launch Server with Graceful Shutdown
	srv := &http.Server{
		Addr:    ":" + cfg.Port,
		Handler: router,
	}

	go func() {
		log.Printf("[AETHER CORE STACK STUDIO] Golang Backend & Vue Host listening on http://127.0.0.1:%s", cfg.Port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Server error: %v\n", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("Shutting down Stack Studio (Aether Core) server gracefully...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		log.Fatalf("Server forced to shutdown: %v", err)
	}
	log.Println("Server exiting cleanly")
}

// SetupRouter builds and configures the Gin router with all middleware and routes
func SetupRouter(cfg *config.Config, repo *repository.Repository, rdb *redis.Client, s3Client *storage.S3Client, h *handler.Handler) *gin.Engine {
	gin.SetMode(gin.ReleaseMode)
	router := gin.New()
	router.Use(gin.Recovery())

	// Enterprise Security Headers, Strict CORS, & CSRF Protection
	router.Use(middleware.SecurityHeaders())
	router.Use(middleware.CORS(cfg))
	router.Use(middleware.CSRFProtection(cfg))

	// Health Check
	router.GET("/healthz", func(c *gin.Context) {
		dbConnected := false
		if repo != nil && repo.DB != nil {
			dbConnected = true
		}
		redisConnected := false
		if rdb != nil && rdb.Rdb != nil {
			redisConnected = true
		}
		s3Available := false
		if s3Client != nil && s3Client.Available {
			s3Available = true
		}

		c.JSON(http.StatusOK, gin.H{
			"service":  "Stack Studio Backend & Static Host (Aether Core)",
			"status":   "healthy",
			"database": dbConnected,
			"redis":    redisConnected,
			"s3":       s3Available,
			"time":     time.Now().UTC().Format(time.RFC3339),
		})
	})

	// API Routing Layer
	api := router.Group("/api")
	api.Use(middleware.NoCache())
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
			// Session & State Persistence (Redis)
			protected.GET("/auth/me", h.Me)
			protected.POST("/auth/logout", h.Logout)
			protected.GET("/user/state", h.GetUserState)
			protected.PUT("/user/state", h.SaveUserState)

			// Containers & Multi-Site Hub
			protected.GET("/containers", h.ListContainers)
			protected.POST("/containers", h.CreateContainer)
			protected.GET("/containers/:id/stats", h.GetContainerStats)
			protected.GET("/containers/:id/logs", h.GetContainerLogs)
			protected.PUT("/containers/:id/design", h.SaveSiteDesign)
			protected.GET("/containers/:id/draft", h.GetEditorDraft)
			protected.PUT("/containers/:id/draft", h.SaveEditorDraft)
			protected.POST("/containers/:id/start", h.StartContainer)
			protected.POST("/containers/:id/stop", h.StopContainer)
			protected.POST("/containers/:id/restart", h.RestartContainer)
			protected.PUT("/containers/:id/maintenance", h.ToggleMaintenance)
			protected.DELETE("/containers/:id", h.DeleteContainer)

			// Publishing Engine (Articles & Content)
			protected.GET("/articles", h.ListArticles)
			protected.POST("/articles", h.CreateArticle)
			protected.PUT("/articles/:id", h.UpdateArticle)
			protected.DELETE("/articles/:id", h.DeleteArticle)

			// Web Pages Engine (CMS Pages)
			protected.GET("/pages", h.ListPages)
			protected.POST("/pages", h.CreatePage)
			protected.PUT("/pages/:id", h.UpdatePage)
			protected.DELETE("/pages/:id", h.DeletePage)

			// Asset Storage (MinIO S3)
			protected.GET("/assets", h.ListAssets)
			protected.POST("/assets/upload", h.UploadAsset)
			protected.DELETE("/assets/:id", h.DeleteAsset)

			// Custom Domain & DNS Ingress
			protected.GET("/domains", h.ListDomains)

			// Support Tickets & Threads
			protected.GET("/tickets", h.ListTickets)
			protected.POST("/tickets", h.CreateTicket)
			protected.GET("/tickets/:id/messages", h.GetTicketMessages)
			protected.POST("/tickets/:id/messages", h.AddTicketMessage)
			protected.PUT("/tickets/:id/resolve", h.ResolveTicket)

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

	// Single-Binary Static Vue 3 SPA Host & HTML5 Fallback
	distDir := findDistDir(cfg.DistDir)
	if distDir != "" {
		assetsDir := filepath.Join(distDir, "assets")
		if _, err := os.Stat(assetsDir); err == nil {
			// Immutable long-term caching for hashed static assets (JS, CSS, icons)
			router.Use(func(c *gin.Context) {
				if strings.HasPrefix(c.Request.URL.Path, "/assets/") {
					c.Header("Cache-Control", "public, max-age=31536000, immutable")
				}
				c.Next()
			})
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
				if filepath.Base(targetFile) == "index.html" || filepath.Base(targetFile) == "sw.js" {
					c.Header("Cache-Control", "no-cache, no-store, must-revalidate, max-age=0")
					c.Header("Pragma", "no-cache")
					c.Header("Expires", "0")
				}
				c.File(targetFile)
				return
			}

			// SPA Fallback: Serve index.html with strict anti-cache headers
			c.Header("Cache-Control", "no-cache, no-store, must-revalidate, max-age=0")
			c.Header("Pragma", "no-cache")
			c.Header("Expires", "0")
			c.File(filepath.Join(distDir, "index.html"))
		})

		log.Printf("[STATIC HOST] Serving compiled Vue 3 SPA from %s with HTML5 fallback", distDir)
	} else {
		log.Println("[STATIC NOTICE] No dist directory found. Running in API-only mode.")
	}

	return router
}

// findDistDir resolves the dist directory location across different execution paths
func findDistDir(preferred string) string {
	candidates := []string{
		preferred,
		"./dist",
		"../../dist",
		"../dist",
	}

	for _, cand := range candidates {
		if cand == "" {
			continue
		}
		idx := filepath.Join(cand, "index.html")
		if _, err := os.Stat(idx); err == nil {
			return cand
		}
	}
	return ""
}
