package repository

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"sync"
	"time"

	"github.com/cloudcms/dashboard-cms-backend/internal/config"
	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

type Repository struct {
	DB *sql.DB
	mu sync.RWMutex

	// Resilient in-memory models
	Containers []gin.H
	Articles   []gin.H
	Assets     []gin.H
	Domains    []gin.H
	Tickets    []gin.H
	Messages   map[string][]gin.H
	Invoices   []gin.H
	Webhooks   []gin.H
}

func NewRepository(cfg *config.Config) *Repository {
	connStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable connect_timeout=3",
		cfg.DBHost, cfg.DBPort, cfg.DBUser, cfg.DBPass, cfg.DBName)

	db, err := sql.Open("postgres", connStr)
	repo := &Repository{
		DB:       db,
		Messages: make(map[string][]gin.H),
	}

	repo.seedInitialData()

	if err != nil {
		log.Printf("[DB WARNING] Failed to initialize PostgreSQL driver: %v", err)
		repo.DB = nil
		return repo
	}

	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(5)
	db.SetConnMaxLifetime(5 * time.Minute)

	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	if err := db.PingContext(ctx); err != nil {
		log.Printf("[DB NOTICE] PostgreSQL at %s:%s is unreachable: %v. Using resilient in-memory repository.", cfg.DBHost, cfg.DBPort, err)
		repo.DB = nil
	} else {
		log.Printf("[DB SUCCESS] Connected to PostgreSQL at %s:%s/%s with Row-Level Security (RLS)", cfg.DBHost, cfg.DBPort, cfg.DBName)
	}

	return repo
}

func (r *Repository) ExecWithRLS(ctx context.Context, tenantID string, query string, args ...interface{}) (sql.Result, error) {
	if r.DB == nil {
		return nil, fmt.Errorf("database offline (fallback mode active)")
	}

	tx, err := r.DB.BeginTx(ctx, nil)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	if _, err := tx.ExecContext(ctx, "SET LOCAL app.current_tenant_id = $1", tenantID); err != nil {
		return nil, fmt.Errorf("failed to set RLS tenant context: %w", err)
	}

	res, err := tx.ExecContext(ctx, query, args...)
	if err != nil {
		return nil, err
	}

	return res, tx.Commit()
}

func (r *Repository) seedInitialData() {
	r.Containers = []gin.H{
		{
			"id":             "hero_tenant_9942",
			"name":           "Portofolio Rizal Pratama",
			"category":       "portfolio",
			"templateName":   "Portofolio Teknis Engineer",
			"subdomain":      "rizal.cloudcms.app",
			"customDomain":   "rizalpratama.cloud",
			"status":         "running",
			"cpuUsage":       14,
			"ramUsage":       88,
			"ramLimit":       256,
			"cpuLimit":       "0.5 vCPU",
			"uptime":         "4 hari 12 jam",
			"visitsThisWeek": 3892,
			"ssl":            true,
			"roleOrHeadline": "Senior Cloud & Distributed Systems Engineer",
			"bioIntro":       "Membangun arsitektur microservices terdistribusi, orkestrasi kontainer Docker otonom, dan pipeline telemetri real-time dengan latensi rendah.",
			"accentColor":    "#2563eb",
			"lastDeployed":   "10 menit lalu",
		},
	}

	r.Articles = []gin.H{
		{
			"id":          "art_01",
			"title":       "Arsitektur Microservices Multi-Tenant dengan Isolasi Kontainer Mandiri",
			"slug":        "arsitektur-microservices-multi-tenant",
			"category":    "Distributed Systems",
			"status":      "published",
			"publishedAt": "18 Sep 2026",
			"views":       1420,
			"author":      "Rizal Pratama",
			"siteName":    "Portofolio Rizal Pratama",
		},
		{
			"id":          "art_02",
			"title":       "Strategi Caching Traefik v3 dan Dynamic TLS Edge Router",
			"slug":        "strategi-caching-traefik-v3-tls",
			"category":    "DevOps",
			"status":      "published",
			"publishedAt": "15 Sep 2026",
			"views":       890,
			"author":      "Rizal Pratama",
			"siteName":    "Portofolio Rizal Pratama",
		},
		{
			"id":          "art_03",
			"title":       "Pengamanan Linux Kernel Cgroups v2 & Seccomp Sandbox untuk Container CaaS",
			"slug":        "pengamanan-linux-kernel-cgroups-seccomp",
			"category":    "Security",
			"status":      "draft",
			"publishedAt": "Draft (WIP)",
			"views":       0,
			"author":      "Rizal Pratama",
			"siteName":    "Portofolio Rizal Pratama",
		},
	}

	r.Assets = []gin.H{
		{
			"id":         "ast_01",
			"name":       "cv-resume-engineer.pdf",
			"type":       "PDF",
			"size":       "420 KB",
			"dimensions": "A4 Format",
			"uploadedAt": "18 Sep 2026",
			"url":        "https://cdn.rizalpratama.cloud/assets/cv-resume-engineer.pdf",
		},
		{
			"id":         "ast_02",
			"name":       "laporan-rekap-telemetri-q3.xlsx",
			"type":       "XLSX",
			"size":       "1.2 MB",
			"dimensions": "4 Sheets",
			"uploadedAt": "16 Sep 2026",
			"url":        "https://cdn.rizalpratama.cloud/assets/laporan-rekap-telemetri-q3.xlsx",
		},
		{
			"id":         "ast_03",
			"name":       "blueprint-spesifikasi-sistem.docx",
			"type":       "DOCX",
			"size":       "850 KB",
			"dimensions": "12 Halaman",
			"uploadedAt": "14 Sep 2026",
			"url":        "https://cdn.rizalpratama.cloud/assets/blueprint-spesifikasi-sistem.docx",
		},
	}

	r.Domains = []gin.H{
		{
			"id":          "dom_9942",
			"domain":      "rizalpratama.cloud",
			"targetCname": "rizal.cloudcms.app",
			"targetIp":    "103.144.20.12",
			"dnsStatus":   "verified",
			"sslStatus":   "active",
			"containerId": "hero_tenant_9942",
			"createdAt":   "12 Sep 2026",
		},
	}

	r.Tickets = []gin.H{
		{
			"id":        "TKT-9942-01",
			"subject":   "Permintaan Bantuan Konfigurasi Wildcard SSL Traefik",
			"category":  "Infrastruktur",
			"priority":  "high",
			"status":    "answered",
			"createdAt": "18 Sep 2026, 10:14",
			"lastReply": "18 Sep 2026, 11:02",
		},
		{
			"id":        "TKT-9942-02",
			"subject":   "Konsultasi Kuota Penyimpanan Aset S3 MinIO",
			"category":  "Storage & CDN",
			"priority":  "medium",
			"status":    "open",
			"createdAt": "17 Sep 2026, 14:30",
			"lastReply": "17 Sep 2026, 14:30",
		},
	}

	r.Messages["TKT-9942-01"] = []gin.H{
		{
			"id":         "msg_01",
			"senderName": "Rizal Pratama",
			"senderRole": "customer",
			"message":    "Halo tim Support, saya ingin menanyakan apakah rute subdomain saya sudah aktif verifikasi Let's Encrypt TLS-ALPN-01?",
			"createdAt":  "18 Sep 2026, 10:14",
		},
		{
			"id":         "msg_02",
			"senderName": "Budi Santoso (Cloud Support Engineer)",
			"senderRole": "staff",
			"message":    "Halo Pak Rizal! Rute Traefik v3 Anda telah diverifikasi sukses. Sertifikat SSL otomatis diperbarui setiap 60 hari.",
			"createdAt":  "18 Sep 2026, 11:02",
		},
	}

	r.Invoices = []gin.H{
		{
			"id":             "INV-2026-09-9942",
			"planName":       "Hero Pro Plan",
			"period":         "1 Sep 2026 - 30 Sep 2026",
			"amount":         149000,
			"tax":            16390,
			"total":          165390,
			"date":           "1 Sep 2026",
			"dueDate":        "5 Sep 2026",
			"status":         "paid",
			"paymentMethod":  "BCA Virtual Account (Otomatis)",
			"containerQuota": 3,
		},
		{
			"id":             "INV-2026-08-9942",
			"planName":       "Hero Starter Plan",
			"period":         "1 Agu 2026 - 31 Agu 2026",
			"amount":         49000,
			"tax":            5390,
			"total":          54390,
			"date":           "1 Agu 2026",
			"dueDate":        "5 Agu 2026",
			"status":         "paid",
			"paymentMethod":  "Kartu Kredit Mandiri Visa",
			"containerQuota": 1,
		},
	}

	r.Webhooks = []gin.H{
		{
			"id":            "wh_01",
			"name":          "Discord Deployment Notifier",
			"url":           "https://discord.com/api/webhooks/1289942001/abc123xyz",
			"events":        []string{"site.deployed", "container.crashed"},
			"status":        "active",
			"lastTriggered": "10 menit lalu (200 OK)",
		},
	}
}
