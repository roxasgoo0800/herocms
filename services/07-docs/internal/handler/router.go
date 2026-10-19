package handler

import (
	"encoding/json"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/cloudcms/herocms-docs/internal/db"
	"github.com/cloudcms/herocms-docs/internal/model"
)

type Router struct {
	db      *db.Database
	mux     *http.ServeMux
	distDir string
}

func NewRouter(database *db.Database, distDir string) *Router {
	r := &Router{
		db:      database,
		mux:     http.NewServeMux(),
		distDir: distDir,
	}
	r.registerRoutes()
	return r
}

func (r *Router) ServeHTTP(w http.ResponseWriter, req *http.Request) {
	// 1. Security Headers
	w.Header().Set("X-Content-Type-Options", "nosniff")
	w.Header().Set("X-Frame-Options", "DENY")
	w.Header().Set("X-XSS-Protection", "1; mode=block")
	w.Header().Set("Referrer-Policy", "strict-origin-when-cross-origin")

	// 2. CORS Handling
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

	if req.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	r.mux.ServeHTTP(w, req)
}

func (r *Router) registerRoutes() {
	// Health Checks
	r.mux.HandleFunc("GET /healthz", r.handleHealth)
	r.mux.HandleFunc("GET /api/v1/health", r.handleHealth)

	// API Telemetry
	r.mux.HandleFunc("GET /api/v1/telemetry", r.handleTelemetry)

	// API Tasks
	r.mux.HandleFunc("GET /api/v1/tasks", r.handleGetTasks)
	r.mux.HandleFunc("GET /api/v1/tasks/{id}", r.handleGetTaskByID)
	r.mux.HandleFunc("PATCH /api/v1/tasks/{id}/checklist", r.handleUpdateChecklist)

	// Static Reference APIs
	r.mux.HandleFunc("GET /api/v1/blueprints", r.handleGetBlueprints)
	r.mux.HandleFunc("GET /api/v1/sops", r.handleGetSOPs)
	r.mux.HandleFunc("GET /api/v1/members", r.handleGetMembers)
	r.mux.HandleFunc("GET /api/v1/services", r.handleGetServices)

	// Static Assets / SPA Serving
	if r.distDir != "" {
		fs := http.FileServer(http.Dir(r.distDir))
		r.mux.HandleFunc("/", func(w http.ResponseWriter, req *http.Request) {
			// Don't intercept API routes
			if strings.HasPrefix(req.URL.Path, "/api/") {
				http.NotFound(w, req)
				return
			}

			// Check if file physically exists in distDir
			path := filepath.Join(r.distDir, filepath.Clean(req.URL.Path))
			if info, err := os.Stat(path); err == nil && !info.IsDir() {
				// Long term caching for hashed static assets
				if strings.HasPrefix(req.URL.Path, "/assets/") {
					w.Header().Set("Cache-Control", "public, max-age=31536000, immutable")
				}
				fs.ServeHTTP(w, req)
				return
			}

			// SPA Fallback: serve index.html
			indexPath := filepath.Join(r.distDir, "index.html")
			w.Header().Set("Cache-Control", "no-cache")
			http.ServeFile(w, req, indexPath)
		})
	}
}

func (r *Router) handleHealth(w http.ResponseWriter, req *http.Request) {
	writeJSON(w, http.StatusOK, map[string]interface{}{
		"status":  "healthy",
		"service": "07-docs",
		"version": "v1.2.0",
	})
}

func (r *Router) handleTelemetry(w http.ResponseWriter, req *http.Request) {
	stats := r.db.GetTelemetry()
	writeJSON(w, http.StatusOK, stats)
}

func (r *Router) handleGetTasks(w http.ResponseWriter, req *http.Request) {
	div := req.URL.Query().Get("division")
	svc := req.URL.Query().Get("serviceGroup")
	q := req.URL.Query().Get("q")

	tasks := r.db.GetTasks(div, svc, q)
	writeJSON(w, http.StatusOK, tasks)
}

func (r *Router) handleGetTaskByID(w http.ResponseWriter, req *http.Request) {
	id := req.PathValue("id")
	task, found := r.db.GetTaskByID(id)
	if !found {
		writeJSON(w, http.StatusNotFound, map[string]string{"error": "Task not found"})
		return
	}
	writeJSON(w, http.StatusOK, task)
}

func (r *Router) handleUpdateChecklist(w http.ResponseWriter, req *http.Request) {
	id := req.PathValue("id")

	var payload model.ChecklistUpdateRequest
	if err := json.NewDecoder(req.Body).Decode(&payload); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "Invalid JSON payload"})
		return
	}

	updatedTask, err := r.db.UpdateChecklist(id, payload.Index, payload.Done)
	if err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}

	writeJSON(w, http.StatusOK, map[string]interface{}{
		"success": true,
		"task":    updatedTask,
	})
}

func (r *Router) handleGetBlueprints(w http.ResponseWriter, req *http.Request) {
	writeJSON(w, http.StatusOK, r.db.GetBlueprints())
}

func (r *Router) handleGetSOPs(w http.ResponseWriter, req *http.Request) {
	writeJSON(w, http.StatusOK, r.db.GetSOPs())
}

func (r *Router) handleGetMembers(w http.ResponseWriter, req *http.Request) {
	writeJSON(w, http.StatusOK, r.db.GetMembers())
}

func (r *Router) handleGetServices(w http.ResponseWriter, req *http.Request) {
	writeJSON(w, http.StatusOK, r.db.GetServices())
}

func writeJSON(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(data)
}
