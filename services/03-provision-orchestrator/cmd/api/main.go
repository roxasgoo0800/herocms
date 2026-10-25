package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/cloudcms/provision-orchestrator/config"
	"github.com/cloudcms/provision-orchestrator/internal/api"
	"github.com/cloudcms/provision-orchestrator/internal/docker"
	"github.com/cloudcms/provision-orchestrator/internal/messaging/kafka"
	"github.com/cloudcms/provision-orchestrator/internal/messaging/redis"
	"github.com/cloudcms/provision-orchestrator/internal/storage"
)

func main() {
	log.Println("================================================================")
	log.Println("   HeroCMS Headless Provision Orchestrator Daemon (Service 03)  ")
	log.Println("   Autonomous Docker • cgroups v2 • Traefik • Redis • Kafka     ")
	log.Println("================================================================")

	// 1. Load Configurations
	cfg := config.LoadConfig()

	// 2. Initialize Persistent Storage Manager
	storageMgr, err := storage.NewManager(cfg.TenantStorageBase)
	if err != nil {
		log.Fatalf("[FATAL] Failed to initialize storage manager: %v", err)
	}
	log.Printf("[INIT] Storage manager active at base path: %s", storageMgr.GetBaseDir())

	// 3. Initialize Redis State & Mutex Manager
	redisMgr := redis.NewManager(cfg.RedisAddr, cfg.RedisPassword, cfg.RedisDB)

	// 4. Initialize Kafka Event Producer
	kafkaProducer := kafka.NewProducer(cfg.KafkaBrokers)

	// 5. Initialize Docker Engine SDK Provisioner
	provisioner, err := docker.NewProvisioner(
		cfg.DockerEdgeNetwork,
		cfg.TenantRuntimeImage,
		storageMgr,
		redisMgr,
		kafkaProducer,
	)
	if err != nil {
		log.Printf("[WARNING] Docker daemon client notice: %v", err)
	}

	// 6. Setup Gin Internal Router
	router := api.SetupRouter(cfg, provisioner, storageMgr, redisMgr, kafkaProducer)

	srv := &http.Server{
		Addr:         ":" + cfg.Port,
		Handler:      router,
		ReadTimeout:  30 * time.Second,
		WriteTimeout: 30 * time.Second,
		IdleTimeout:  120 * time.Second,
	}

	// 7. Start HTTP Daemon in Background Goroutine
	go func() {
		log.Printf("[ORCHESTRATOR DAEMON] Engine running on :%s (Internal Local-Only)", cfg.Port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("[FATAL] Server listen error: %v", err)
		}
	}()

	// 8. Graceful Shutdown Listener
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("\n[SHUTDOWN] Intercepted termination signal. Shutting down gracefully...")

	// Clean resources
	if provisioner != nil {
		_ = provisioner.Close()
	}
	if redisMgr != nil {
		_ = redisMgr.Close()
	}

	shutdownCtx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := srv.Shutdown(shutdownCtx); err != nil {
		log.Fatalf("[FATAL] Forced shutdown failed: %v", err)
	}

	log.Println("[SHUTDOWN] Orchestrator daemon exited cleanly.")
}
