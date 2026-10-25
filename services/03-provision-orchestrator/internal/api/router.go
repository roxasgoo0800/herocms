package api

import (
	"io"
	"net/http"
	"regexp"
	"strconv"
	"time"

	"github.com/cloudcms/provision-orchestrator/config"
	"github.com/cloudcms/provision-orchestrator/internal/docker"
	"github.com/cloudcms/provision-orchestrator/internal/messaging/kafka"
	"github.com/cloudcms/provision-orchestrator/internal/messaging/redis"
	"github.com/cloudcms/provision-orchestrator/internal/storage"
	"github.com/gin-gonic/gin"
)

// DeployRequest defines payload for deploying a tenant container
type DeployRequest struct {
	TenantID     string `json:"tenant_id" binding:"required"`
	SiteID       string `json:"site_id" binding:"required"`
	Subdomain    string `json:"subdomain" binding:"required"`
	CustomDomain string `json:"custom_domain,omitempty"`
	VersionHash  string `json:"version_hash" binding:"required"`
}

// StorageProvisionRequest defines payload for storage creation
type StorageProvisionRequest struct {
	TenantID string `json:"tenant_id" binding:"required"`
	QuotaMB  int    `json:"quota_mb,omitempty"`
}

// SetupRouter initializes Gin engine with security middleware and RESTful routes
func SetupRouter(
	cfg *config.Config,
	prov *docker.Provisioner,
	sm *storage.Manager,
	rm *redis.Manager,
	kp *kafka.Producer,
) *gin.Engine {
	gin.SetMode(gin.ReleaseMode)
	router := gin.New()

	router.Use(JSONRecovery())
	router.Use(RequestLogger())
	router.Use(InternalSecretGuard(cfg.InternalSecretToken, cfg.RequireInternalAuth))

	// Liveness Probe
	router.GET("/healthz", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":   "healthy",
			"service":  "provision-orchestrator",
			"mode":     "headless-daemon",
			"time_utc": time.Now().UTC().Format(time.RFC3339),
		})
	})

	// Readiness Probe (checks storage, docker, and redis status)
	router.GET("/readyz", func(c *gin.Context) {
		dockerOk := prov.IsDockerLive(c.Request.Context())
		redisOk := rm.IsLive()

		c.JSON(http.StatusOK, gin.H{
			"status":          "ready",
			"docker_live":     dockerOk,
			"redis_live":      redisOk,
			"storage_ready":   sm != nil,
			"edge_network":    cfg.DockerEdgeNetwork,
			"storage_root":    sm.GetBaseDir(),
			"simulation_mode": !dockerOk,
		})
	})

	api := router.Group("/api/v1")
	{
		// Deploy / Provision Tenant Container Handler
		deployHandler := func(c *gin.Context) {
			var req DeployRequest
			if err := c.ShouldBindJSON(&req); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "code": "ERR_INVALID_PAYLOAD"})
				return
			}

			// Pentest Security Validations: Subdomain, TenantID, and CustomDomain
			subdomainRegex := regexp.MustCompile(`^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$`)
			if !subdomainRegex.MatchString(req.Subdomain) {
				c.JSON(http.StatusBadRequest, gin.H{
					"error": "Format subdomain tidak valid. Hanya huruf kecil, angka, dan tanda hubung (-).",
					"code":  "ERR_INVALID_SUBDOMAIN",
				})
				return
			}

			tenantRegex := regexp.MustCompile(`^[a-zA-Z0-9_-]{1,64}$`)
			if !tenantRegex.MatchString(req.TenantID) {
				c.JSON(http.StatusBadRequest, gin.H{
					"error": "Format tenant_id tidak valid. Hanya alphanumeric, underscore, dan hyphen.",
					"code":  "ERR_INVALID_TENANT_ID",
				})
				return
			}

			if req.CustomDomain != "" {
				domainRegex := regexp.MustCompile(`^([a-zA-Z0-9]+(-[a-zA-Z0-9]+)*\.)+[a-zA-Z]{2,}$`)
				if !domainRegex.MatchString(req.CustomDomain) {
					c.JSON(http.StatusBadRequest, gin.H{
						"error": "Format custom_domain tidak valid.",
						"code":  "ERR_INVALID_CUSTOM_DOMAIN",
					})
					return
				}
			}

			containerID, err := prov.DeployTenantContainer(c.Request.Context(), docker.TenantDeployParams{
				TenantID:     req.TenantID,
				SiteID:       req.SiteID,
				Subdomain:    req.Subdomain,
				CustomDomain: req.CustomDomain,
				VersionHash:  req.VersionHash,
			})
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{
					"error": err.Error(),
					"code":  "ERR_DEPLOY_FAILED",
				})
				return
			}

			c.JSON(http.StatusOK, gin.H{
				"status":        "deployed",
				"container_id":  containerID,
				"subdomain":     req.Subdomain + ".herocms.stackbyte.id",
				"custom_domain": req.CustomDomain,
				"deployed_at":   time.Now().UTC().Format(time.RFC3339),
			})
		}

		// Support both endpoints for backwards compatibility
		api.POST("/deploy", deployHandler)
		api.POST("/containers/provision", deployHandler)

		// List Containers
		api.GET("/containers", func(c *gin.Context) {
			list, err := prov.ListTenantContainers(c.Request.Context())
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			c.JSON(http.StatusOK, gin.H{
				"count":      len(list),
				"containers": list,
			})
		})

		// Inspect Container
		api.GET("/containers/:id", func(c *gin.Context) {
			id := c.Param("id")
			info, err := prov.InspectTenantContainer(c.Request.Context(), id)
			if err != nil {
				c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
				return
			}
			c.JSON(http.StatusOK, info)
		})

		// Start Container
		api.POST("/containers/:id/start", func(c *gin.Context) {
			id := c.Param("id")
			if err := prov.StartContainer(c.Request.Context(), id); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			c.JSON(http.StatusOK, gin.H{"status": "running", "container_id": id})
		})

		// Stop Container
		api.POST("/containers/:id/stop", func(c *gin.Context) {
			id := c.Param("id")
			if err := prov.StopContainer(c.Request.Context(), id); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			c.JSON(http.StatusOK, gin.H{"status": "stopped", "container_id": id})
		})

		// Emergency Restart Container
		api.POST("/containers/:id/restart", func(c *gin.Context) {
			id := c.Param("id")
			if err := prov.EmergencyRestart(c.Request.Context(), id); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			c.JSON(http.StatusOK, gin.H{"status": "restarted", "container_id": id})
		})

		// Destroy Container
		api.DELETE("/containers/:id", func(c *gin.Context) {
			id := c.Param("id")
			purgeStorage := c.Query("purge_storage") == "true"

			if err := prov.DestroyContainer(c.Request.Context(), id, purgeStorage); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			c.JSON(http.StatusOK, gin.H{
				"status":         "destroyed",
				"container_id":   id,
				"storage_purged": purgeStorage,
			})
		})

		// Container Resource Stats
		api.GET("/containers/:id/stats", func(c *gin.Context) {
			id := c.Param("id")
			stats, err := prov.GetContainerStats(c.Request.Context(), id)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			c.JSON(http.StatusOK, stats)
		})

		// Container Logs
		api.GET("/containers/:id/logs", func(c *gin.Context) {
			id := c.Param("id")
			tail := c.DefaultQuery("tail", "100")

			logsReader, err := prov.GetContainerLogs(c.Request.Context(), id, tail)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			defer logsReader.Close()

			c.Header("Content-Type", "text/plain; charset=utf-8")
			_, _ = io.Copy(c.Writer, logsReader)
		})

		// Storage Management Endpoints
		api.POST("/storage/provision", func(c *gin.Context) {
			var req StorageProvisionRequest
			if err := c.ShouldBindJSON(&req); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}

			info, err := sm.ProvisionTenantStorage(req.TenantID)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			c.JSON(http.StatusOK, info)
		})

		api.GET("/storage/:tenant_id", func(c *gin.Context) {
			tenantID := c.Param("tenant_id")
			info, err := sm.InspectTenantStorage(tenantID)
			if err != nil {
				c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
				return
			}
			c.JSON(http.StatusOK, info)
		})

		api.DELETE("/storage/:tenant_id", func(c *gin.Context) {
			tenantID := c.Param("tenant_id")
			if err := sm.PurgeTenantStorage(tenantID); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			c.JSON(http.StatusOK, gin.H{"status": "purged", "tenant_id": tenantID})
		})

		// Event Bus Audit Trail
		api.GET("/events", func(c *gin.Context) {
			limitStr := c.DefaultQuery("limit", "20")
			limit, _ := strconv.Atoi(limitStr)
			events := kp.GetRecentEvents(limit)
			c.JSON(http.StatusOK, gin.H{
				"count":  len(events),
				"events": events,
			})
		})

		// Cached State from Redis
		api.GET("/state/:tenant_id", func(c *gin.Context) {
			tenantID := c.Param("tenant_id")
			state, err := rm.GetContainerState(c.Request.Context(), tenantID)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			if state == nil {
				c.JSON(http.StatusNotFound, gin.H{"error": "state not found in redis cache"})
				return
			}
			c.JSON(http.StatusOK, state)
		})
	}

	return router
}
