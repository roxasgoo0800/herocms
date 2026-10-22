package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/cloudcms/herocms-docs/internal/db"
	"github.com/cloudcms/herocms-docs/internal/handler"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8087"
	}

	dataDir := os.Getenv("DATA_DIR")
	if dataDir == "" {
		dataDir = "./data"
	}

	distDir := os.Getenv("DIST_DIR")
	if distDir == "" {
		distDir = "./dist"
	}

	log.Printf("==================================================================")
	log.Printf("Aether Core Service 07: Docs & Mission Control Hub (v1.5.1)")
	log.Printf("Port: %s | DataDir: %s | DistDir: %s", port, dataDir, distDir)
	log.Printf("==================================================================")

	// Initialize Database
	database, err := db.NewDatabase(dataDir)
	if err != nil {
		log.Fatalf("FATAL: Failed to initialize database: %v", err)
	}

	stats := database.GetTelemetry()
	log.Printf("Database loaded: %d Tasks, %d Blueprints, %d SOPs, %d Members",
		stats.TotalTasks, stats.TotalBlueprints, stats.TotalSOPs, stats.TotalMembers)

	// Initialize HTTP Router
	router := handler.NewRouter(database, distDir)

	server := &http.Server{
		Addr:         ":" + port,
		Handler:      router,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	// Channel for graceful shutdown
	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt, syscall.SIGTERM)

	go func() {
		log.Printf("Docs Service running at http://127.0.0.1:%s", port)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Server ListenAndServe error: %v", err)
		}
	}()

	<-stop
	log.Printf("Gracefully shutting down Docs server...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		log.Printf("Server shutdown error: %v", err)
	}

	fmt.Println("Docs Service stopped safely.")
}
