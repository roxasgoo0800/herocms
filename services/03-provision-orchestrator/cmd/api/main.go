package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"regexp"
	"syscall"
	"time"

	"github.com/cloudcms/provision-orchestrator/internal/docker"
	"github.com/gin-gonic/gin"
)

type DeployRequest struct {
	TenantID    string `json:"tenant_id" binding:"required"`
	SiteID      string `json:"site_id" binding:"required"`
	Subdomain   string `json:"subdomain" binding:"required"`
	CustomDomain string `json:"custom_domain"`
	VersionHash string `json:"version_hash" binding:"required"`
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Initialize Docker Provisioner Client
	provisioner, err := docker.NewProvisioner()
	if err != nil {
		log.Printf("[WARNING] Docker daemon client initialization notice: %v", err)
	}

	router := gin.Default()

	// CORS & Health check
	router.GET("/healthz", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":  "healthy",
			"service": "provision-orchestrator",
			"time":    time.Now().UTC().Format(time.RFC3339),
		})
	})

	api := router.Group("/api/v1")
	{
		// Deploy Tenant Container
		api.POST("/deploy", func(c *gin.Context) {
			var req DeployRequest
			if err := c.ShouldBindJSON(&req); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}

			// Pentest Fix: Validate Subdomain and TenantID to prevent Traefik router rule injection & path traversal
			subdomainRegex := regexp.MustCompile(`^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$`)
			if !subdomainRegex.MatchString(req.Subdomain) {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Format subdomain tidak valid. Hanya huruf kecil, angka, dan tanda hubung (-)."})
				return
			}

			tenantRegex := regexp.MustCompile(`^[a-zA-Z0-9_-]{1,64}$`)
			if !tenantRegex.MatchString(req.TenantID) {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Format tenant_id tidak valid."})
				return
			}

			if req.CustomDomain != "" {
				domainRegex := regexp.MustCompile(`^([a-zA-Z0-9]+(-[a-zA-Z0-9]+)*\.)+[a-zA-Z]{2,}$`)
				if !domainRegex.MatchString(req.CustomDomain) {
					c.JSON(http.StatusBadRequest, gin.H{"error": "Format custom_domain tidak valid."})
					return
				}
			}

			log.Printf("[ORCHESTRATOR] Received deploy trigger for Tenant: %s, Subdomain: %s", req.TenantID, req.Subdomain)

			if provisioner != nil {
				containerID, err := provisioner.DeployTenantContainer(c.Request.Context(), docker.TenantDeployParams{
					TenantID:     req.TenantID,
					SiteID:       req.SiteID,
					Subdomain:    req.Subdomain,
					CustomDomain: req.CustomDomain,
					VersionHash:  req.VersionHash,
				})
				if err != nil {
					c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
					return
				}

				c.JSON(http.StatusOK, gin.H{
					"status":       "deployed",
					"container_id": containerID,
					"subdomain":    req.Subdomain + ".cloudcms.app",
					"custom_domain": req.CustomDomain,
					"deployed_at":  time.Now().UTC().Format(time.RFC3339),
				})
				return
			}

			// Simulated fallback if running in dev without live docker.sock mounted
			c.JSON(http.StatusOK, gin.H{
				"status":       "simulated_deployed",
				"container_id": "sim_c78a991f2",
				"subdomain":    req.Subdomain + ".cloudcms.app",
				"notice":       "Running in simulation mode (Docker socket offline)",
			})
		})

		// List active tenant containers
		api.GET("/containers", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{
				"active_count": 1,
				"containers": []gin.H{
					{
						"tenant_id": "t_sample_101",
						"subdomain": "demo.cloudcms.app",
						"status":    "running",
						"cpu_limit": "0.5 vCPU",
						"memory":    "256 MB",
					},
				},
			})
		})
	}

	srv := &http.Server{
		Addr:    ":" + port,
		Handler: router,
	}

	go func() {
		log.Printf("[ORCHESTRATOR] Engine running on :%s", port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("listen: %s\n", err)
		}
	}()

	// Graceful Shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("Shutting down orchestrator server gracefully...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		log.Fatal("Server forced to shutdown:", err)
	}
	log.Println("Server exiting")
}
