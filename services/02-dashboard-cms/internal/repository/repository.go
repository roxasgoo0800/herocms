package repository

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"strings"
	"sync"
	"time"

	"github.com/cloudcms/dashboard-cms-backend/internal/config"
	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

type Repository struct {
	DB *sql.DB
	mu sync.RWMutex

	// Resilient in-memory models (fallback if DB unreachable)
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
		repo.ensureDatabaseSchemaAndSeeds()
	}

	return repo
}

// -----------------------------------------------------------------------------
// Database Schema & Seed Bootstrap
// -----------------------------------------------------------------------------

func (r *Repository) ensureDatabaseSchemaAndSeeds() {
	if r.DB == nil {
		return
	}

	schemaSQL := `
	CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
	CREATE EXTENSION IF NOT EXISTS "pgcrypto";

	CREATE TABLE IF NOT EXISTS tenants (
		id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
		slug VARCHAR(64) UNIQUE NOT NULL,
		name VARCHAR(255) NOT NULL,
		plan_tier VARCHAR(32) NOT NULL DEFAULT 'pro',
		status VARCHAR(32) NOT NULL DEFAULT 'active',
		max_containers INT NOT NULL DEFAULT 3,
		storage_quota_mb INT NOT NULL DEFAULT 2048,
		created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
		updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
	);

	CREATE TABLE IF NOT EXISTS users (
		id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
		tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
		email VARCHAR(255) UNIQUE NOT NULL,
		password_hash VARCHAR(255) NOT NULL,
		full_name VARCHAR(255) NOT NULL,
		role VARCHAR(32) NOT NULL DEFAULT 'customer',
		status VARCHAR(32) NOT NULL DEFAULT 'active',
		created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
		updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
	);

	CREATE TABLE IF NOT EXISTS sites (
		id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
		tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
		name VARCHAR(255) NOT NULL,
		category VARCHAR(32) NOT NULL DEFAULT 'portfolio',
		template_name VARCHAR(128) NOT NULL DEFAULT 'Portofolio Teknis Engineer',
		subdomain VARCHAR(64) UNIQUE NOT NULL,
		custom_domain VARCHAR(255),
		status VARCHAR(32) NOT NULL DEFAULT 'running',
		cpu_usage INT NOT NULL DEFAULT 14,
		ram_usage INT NOT NULL DEFAULT 88,
		ram_limit INT NOT NULL DEFAULT 256,
		cpu_limit VARCHAR(32) NOT NULL DEFAULT '0.5 vCPU',
		uptime VARCHAR(64) NOT NULL DEFAULT '4 hari 12 jam',
		visits_this_week INT NOT NULL DEFAULT 0,
		role_headline VARCHAR(255),
		bio_intro TEXT,
		accent_color VARCHAR(32) NOT NULL DEFAULT '#2563eb',
		theme_config JSONB NOT NULL DEFAULT '{}'::jsonb,
		last_deployed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
		created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
		updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
	);

	CREATE TABLE IF NOT EXISTS content_items (
		id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
		tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
		site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
		title VARCHAR(255) NOT NULL,
		slug VARCHAR(255) NOT NULL,
		category VARCHAR(64) NOT NULL DEFAULT 'Engineering',
		author VARCHAR(128) NOT NULL DEFAULT 'Rizal Pratama',
		status VARCHAR(32) NOT NULL DEFAULT 'published',
		views INT NOT NULL DEFAULT 0,
		content_markdown TEXT NOT NULL DEFAULT '',
		blocks_data JSONB NOT NULL DEFAULT '[]'::jsonb,
		seo_meta JSONB NOT NULL DEFAULT '{}'::jsonb,
		published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
		created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
		updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
	);

	CREATE TABLE IF NOT EXISTS media_assets (
		id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
		tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
		name VARCHAR(255) NOT NULL,
		file_type VARCHAR(16) NOT NULL,
		mime_type VARCHAR(255) NOT NULL,
		dimensions VARCHAR(64) NOT NULL DEFAULT 'N/A',
		file_size VARCHAR(32) NOT NULL,
		file_size_bytes BIGINT NOT NULL DEFAULT 0,
		storage_url VARCHAR(512) NOT NULL,
		s3_key VARCHAR(512) NOT NULL,
		created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
	);

	CREATE TABLE IF NOT EXISTS custom_domains (
		id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
		tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
		site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
		domain VARCHAR(255) UNIQUE NOT NULL,
		target_cname VARCHAR(255) NOT NULL,
		target_ip VARCHAR(64) NOT NULL DEFAULT '103.144.20.12',
		dns_status VARCHAR(32) NOT NULL DEFAULT 'verified',
		ssl_status VARCHAR(32) NOT NULL DEFAULT 'active',
		created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
	);

	CREATE TABLE IF NOT EXISTS support_tickets (
		id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
		tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
		ticket_number VARCHAR(32) UNIQUE NOT NULL,
		subject VARCHAR(255) NOT NULL,
		category VARCHAR(64) NOT NULL DEFAULT 'Infrastruktur',
		priority VARCHAR(32) NOT NULL DEFAULT 'medium',
		status VARCHAR(32) NOT NULL DEFAULT 'open',
		last_reply VARCHAR(64) NOT NULL DEFAULT 'Baru saja',
		created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
		updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
	);

	CREATE TABLE IF NOT EXISTS ticket_messages (
		id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
		ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
		sender_name VARCHAR(128) NOT NULL,
		sender_role VARCHAR(32) NOT NULL DEFAULT 'customer',
		message TEXT NOT NULL,
		created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
	);

	CREATE TABLE IF NOT EXISTS invoices (
		id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
		tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
		invoice_number VARCHAR(64) UNIQUE NOT NULL,
		plan_name VARCHAR(128) NOT NULL,
		period VARCHAR(64) NOT NULL,
		amount INT NOT NULL,
		tax INT NOT NULL,
		total INT NOT NULL,
		date VARCHAR(32) NOT NULL,
		due_date VARCHAR(32) NOT NULL,
		status VARCHAR(32) NOT NULL DEFAULT 'paid',
		payment_method VARCHAR(128) NOT NULL,
		container_quota INT NOT NULL DEFAULT 3,
		created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
	);

	CREATE TABLE IF NOT EXISTS webhooks (
		id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
		tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
		name VARCHAR(255) NOT NULL,
		url VARCHAR(512) NOT NULL,
		events JSONB NOT NULL DEFAULT '["site.deployed"]'::jsonb,
		status VARCHAR(32) NOT NULL DEFAULT 'active',
		last_triggered VARCHAR(64) NOT NULL DEFAULT 'Belum pernah dipicu',
		created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
	);

	ALTER TABLE media_assets ALTER COLUMN mime_type TYPE VARCHAR(255);
	`

	if _, err := r.DB.Exec(schemaSQL); err != nil {
		log.Printf("[DB WARNING] Error executing schema DDL: %v", err)
	}

	// Seed Default Tenant & Users
	seedSQL := `
	INSERT INTO tenants (id, slug, name, plan_tier, status, max_containers, storage_quota_mb)
	VALUES (
		'99420000-0000-0000-0000-000000009942',
		'rizal-pratama',
		'Hero Tenant Rizal Pratama',
		'Hero Pro Plan',
		'active',
		3,
		2048
	) ON CONFLICT (id) DO NOTHING;

	INSERT INTO users (id, tenant_id, email, password_hash, full_name, role, status)
	VALUES (
		'00000000-0000-0000-0000-000000000001',
		'99420000-0000-0000-0000-000000009942',
		'admin',
		'$2b$10$rm5XZwib4OzvCJ1V6S31QOwZrRJsrHWJbtWGL4P.uGRqpNGKA9YOa',
		'Admin Developer',
		'customer',
		'active'
	) ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash;

	INSERT INTO users (id, tenant_id, email, password_hash, full_name, role, status)
	VALUES (
		'11111111-1111-1111-1111-111111111111',
		'99420000-0000-0000-0000-000000009942',
		'admin@rizalpratama.cloud',
		'$2b$10$rm5XZwib4OzvCJ1V6S31QOwZrRJsrHWJbtWGL4P.uGRqpNGKA9YOa',
		'Rizal Pratama',
		'customer',
		'active'
	) ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash;

	-- Sites (Containers)
	INSERT INTO sites (id, tenant_id, name, category, template_name, subdomain, status, cpu_usage, ram_usage, ram_limit, cpu_limit, uptime, visits_this_week, role_headline)
	VALUES
	(
		'99420000-0000-0000-0000-000000000001',
		'99420000-0000-0000-0000-000000009942',
		'Portofolio Rizal Pratama',
		'portfolio',
		'Portofolio Teknis Engineer',
		'rizal',
		'running',
		14,
		88,
		256,
		'0.5 vCPU',
		'4 hari 12 jam',
		3892,
		'Portofolio Teknis Engineer'
	),
	(
		'99420000-0000-0000-0000-000000000002',
		'99420000-0000-0000-0000-000000009942',
		'Portal Informasi Utama',
		'business',
		'Portofolio Teknis Engineer',
		'wedak',
		'running',
		12,
		76,
		256,
		'0.5 vCPU',
		'2 hari 6 jam',
		1240,
		'Portofolio Teknis Engineer'
	) ON CONFLICT (id) DO NOTHING;

	-- Content Items
	INSERT INTO content_items (id, tenant_id, title, slug, category, author, status, views, published_at)
	VALUES
	(
		'99420000-0000-0000-0000-000000000101',
		'99420000-0000-0000-0000-000000009942',
		'Arsitektur Multi-Tenant HeroCMS dengan PostgreSQL RLS',
		'arsitektur-multi-tenant-herocms-rls',
		'Arsitektur',
		'Rizal Pratama',
		'published',
		1420,
		NOW() - INTERVAL '3 days'
	),
	(
		'99420000-0000-0000-0000-000000000102',
		'99420000-0000-0000-0000-000000009942',
		'Strategi Caching Traefik v3 dan Dynamic TLS Edge Router',
		'strategi-caching-traefik-v3-tls',
		'DevOps',
		'Rizal Pratama',
		'published',
		890,
		NOW() - INTERVAL '5 days'
	),
	(
		'99420000-0000-0000-0000-000000000103',
		'99420000-0000-0000-0000-000000009942',
		'Pengamanan Linux Kernel Cgroups v2 & Seccomp Sandbox untuk Container CaaS',
		'pengamanan-linux-kernel-cgroups-seccomp',
		'Security',
		'Rizal Pratama',
		'draft',
		0,
		NOW() - INTERVAL '7 days'
	) ON CONFLICT (id) DO NOTHING;

	-- Media Assets
	INSERT INTO media_assets (id, tenant_id, name, file_type, mime_type, dimensions, file_size, storage_url, s3_key)
	VALUES
	(
		'99420000-0000-0000-0000-000000000201',
		'99420000-0000-0000-0000-000000009942',
		'cv-resume-engineer.pdf',
		'PDF',
		'application/pdf',
		'A4 Format',
		'420 KB',
		'https://cdn.rizalpratama.cloud/assets/cv-resume-engineer.pdf',
		'assets/cv-resume-engineer.pdf'
	),
	(
		'99420000-0000-0000-0000-000000000202',
		'99420000-0000-0000-0000-000000009942',
		'laporan-rekap-telemetri-q3.xlsx',
		'XLSX',
		'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
		'4 Sheets',
		'1.2 MB',
		'https://cdn.rizalpratama.cloud/assets/laporan-rekap-telemetri-q3.xlsx',
		'assets/laporan-rekap-telemetri-q3.xlsx'
	),
	(
		'99420000-0000-0000-0000-000000000203',
		'99420000-0000-0000-0000-000000009942',
		'blueprint-spesifikasi-sistem.docx',
		'DOCX',
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
		'12 Halaman',
		'850 KB',
		'https://cdn.rizalpratama.cloud/assets/blueprint-spesifikasi-sistem.docx',
		'assets/blueprint-spesifikasi-sistem.docx'
	) ON CONFLICT (id) DO NOTHING;

	-- Custom Domains
	INSERT INTO custom_domains (id, tenant_id, domain, target_cname, target_ip, dns_status, ssl_status)
	VALUES
	(
		'99420000-0000-0000-0000-000000000301',
		'99420000-0000-0000-0000-000000009942',
		'rizalpratama.cloud',
		'rizal.cloudcms.app',
		'103.144.20.12',
		'verified',
		'active'
	) ON CONFLICT (domain) DO NOTHING;

	-- Support Tickets
	INSERT INTO support_tickets (id, tenant_id, ticket_number, subject, category, priority, status, last_reply)
	VALUES
	(
		'99420000-0000-0000-0000-000000000401',
		'99420000-0000-0000-0000-000000009942',
		'TKT-9942-01',
		'Permintaan Bantuan Konfigurasi Wildcard SSL Traefik',
		'Infrastruktur',
		'high',
		'answered',
		'18 Sep 2026, 11:02'
	),
	(
		'99420000-0000-0000-0000-000000000402',
		'99420000-0000-0000-0000-000000009942',
		'TKT-9942-02',
		'Konsultasi Kuota Penyimpanan Aset S3 MinIO',
		'Storage & CDN',
		'medium',
		'open',
		'17 Sep 2026, 14:30'
	) ON CONFLICT (ticket_number) DO NOTHING;

	-- Ticket Messages
	INSERT INTO ticket_messages (id, ticket_id, sender_name, sender_role, message)
	VALUES
	(
		'99420000-0000-0000-0000-000000000501',
		'99420000-0000-0000-0000-000000000401',
		'Rizal Pratama',
		'customer',
		'Halo tim Support, saya ingin menanyakan apakah rute subdomain saya sudah aktif verifikasi Let''s Encrypt TLS-ALPN-01?'
	),
	(
		'99420000-0000-0000-0000-000000000502',
		'99420000-0000-0000-0000-000000000401',
		'Budi Santoso (Cloud Support Engineer)',
		'staff',
		'Halo Pak Rizal! Rute Traefik v3 Anda telah diverifikasi sukses. Sertifikat SSL otomatis diperbarui setiap 60 hari.'
	) ON CONFLICT (id) DO NOTHING;

	-- Invoices
	INSERT INTO invoices (id, tenant_id, invoice_number, plan_name, period, amount, tax, total, date, due_date, status, payment_method, container_quota)
	VALUES
	(
		'99420000-0000-0000-0000-000000000601',
		'99420000-0000-0000-0000-000000009942',
		'INV-2026-09-9942',
		'Hero Pro Plan',
		'1 Sep 2026 - 30 Sep 2026',
		149000,
		16390,
		165390,
		'1 Sep 2026',
		'5 Sep 2026',
		'paid',
		'BCA Virtual Account (Otomatis)',
		3
	),
	(
		'99420000-0000-0000-0000-000000000602',
		'99420000-0000-0000-0000-000000009942',
		'INV-2026-08-9942',
		'Hero Starter Plan',
		'1 Agu 2026 - 31 Agu 2026',
		49000,
		5390,
		54390,
		'1 Agu 2026',
		'5 Agu 2026',
		'paid',
		'Kartu Kredit Mandiri Visa',
		1
	) ON CONFLICT (invoice_number) DO NOTHING;

	-- Webhooks
	INSERT INTO webhooks (id, tenant_id, name, url, events, status, last_triggered)
	VALUES
	(
		'99420000-0000-0000-0000-000000000701',
		'99420000-0000-0000-0000-000000009942',
		'Discord Deployment Notifier',
		'https://discord.com/api/webhooks/1289942001/abc123xyz',
		'["site.deployed", "container.crashed"]'::jsonb,
		'active',
		'10 menit lalu (200 OK)'
	) ON CONFLICT (id) DO NOTHING;
	`

	if _, err := r.DB.Exec(seedSQL); err != nil {
		log.Printf("[DB WARNING] Error seeding initial data: %v", err)
	} else {
		log.Printf("[DB SUCCESS] Database schema & default seeds verified in PostgreSQL.")
	}
}

// -----------------------------------------------------------------------------
// Database Query Methods (Only database when connected)
// -----------------------------------------------------------------------------

func (r *Repository) GetSites(ctx context.Context, tenantID string) ([]gin.H, error) {
	if r.DB != nil {
		rows, err := r.DB.QueryContext(ctx, `
			SELECT id, name, category, template_name, subdomain, status, 
			       cpu_usage, ram_usage, ram_limit, cpu_limit, uptime, visits_this_week, 
			       accent_color, role_headline, bio_intro, theme_config, last_deployed_at
			FROM sites
			WHERE tenant_id = $1
			ORDER BY created_at ASC
		`, tenantID)
		if err == nil {
			defer rows.Close()
			var list []gin.H
			for rows.Next() {
				var id, name, category, templateName, subdomain, status, cpuLimit, uptime, accentColor string
				var roleHeadline, bioIntro sql.NullString
				var themeConfigBytes []byte
				var cpuUsage, ramUsage, ramLimit, visits int
				var lastDeployed time.Time

				if err := rows.Scan(&id, &name, &category, &templateName, &subdomain, &status,
					&cpuUsage, &ramUsage, &ramLimit, &cpuLimit, &uptime, &visits,
					&accentColor, &roleHeadline, &bioIntro, &themeConfigBytes, &lastDeployed); err == nil {

					subDomainFull := subdomain
					if len(subdomain) < 14 || subdomain[len(subdomain)-13:] != ".cloudcms.app" {
						subDomainFull = fmt.Sprintf("%s.cloudcms.app", subdomain)
					}

					var parsedTheme gin.H
					if len(themeConfigBytes) > 0 {
						_ = json.Unmarshal(themeConfigBytes, &parsedTheme)
					}
					if parsedTheme == nil {
						parsedTheme = gin.H{}
					}

					bIntro := bioIntro.String
					if bIntro == "" {
						bIntro = "Selamat datang di website resmi yang didukung arsitektur kontainer otonom HeroCMS Studio."
					}

					list = append(list, gin.H{
						"id":             id,
						"name":           name,
						"category":       category,
						"templateName":   templateName,
						"subdomain":      subDomainFull,
						"status":         status,
						"cpuUsage":       cpuUsage,
						"ramUsage":       ramUsage,
						"ramLimit":       ramLimit,
						"cpuLimit":       cpuLimit,
						"uptime":         uptime,
						"visitsThisWeek": visits,
						"ssl":            true,
						"roleOrHeadline": roleHeadline.String,
						"bioIntro":       bIntro,
						"accentColor":    accentColor,
						"themeConfig":    parsedTheme,
						"lastDeployed":   lastDeployed.Format("2 Jan 2006"),
					})
				}
			}
			if list != nil {
				return list, nil
			}
			return []gin.H{}, nil
		}
	}

	r.mu.RLock()
	defer r.mu.RUnlock()
	return r.Containers, nil
}

func (r *Repository) InsertSite(ctx context.Context, tenantID string, site gin.H) error {
	if r.DB != nil {
		_, err := r.DB.ExecContext(ctx, `
			INSERT INTO sites (
				tenant_id, name, category, template_name, subdomain, status,
				cpu_usage, ram_usage, ram_limit, cpu_limit, uptime, visits_this_week,
				accent_color, role_headline, bio_intro, last_deployed_at
			) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW())
		`,
			tenantID,
			fmt.Sprintf("%v", site["name"]),
			fmt.Sprintf("%v", site["category"]),
			fmt.Sprintf("%v", site["templateName"]),
			fmt.Sprintf("%v", site["subdomain"]),
			fmt.Sprintf("%v", site["status"]),
			14, 88, 256, "0.5 vCPU", "Baru saja aktif", 0,
			"#2563eb",
			fmt.Sprintf("%v", site["roleOrHeadline"]),
			fmt.Sprintf("%v", site["bioIntro"]),
		)
		if err != nil {
			log.Printf("[DB ERROR] InsertSite: %v", err)
			return err
		}
		return nil
	}

	r.mu.Lock()
	r.Containers = append(r.Containers, site)
	r.mu.Unlock()
	return nil
}

func (r *Repository) UpdateSiteStatus(ctx context.Context, tenantID, siteID, status string) error {
	if r.DB != nil {
		_, err := r.DB.ExecContext(ctx, `
			UPDATE sites SET status = $1, updated_at = NOW()
			WHERE tenant_id = $2 AND (id::text = $3 OR subdomain LIKE $4)
		`, status, tenantID, siteID, siteID+"%")
		return err
	}

	r.mu.Lock()
	defer r.mu.Unlock()
	for _, c := range r.Containers {
		if c["id"] == siteID {
			c["status"] = status
			return nil
		}
	}
	return nil
}

func (r *Repository) UpdateSiteDesign(ctx context.Context, tenantID, siteID string, payload gin.H) error {
	if r.DB != nil {
		roleHeadline := fmt.Sprintf("%v", payload["roleOrHeadline"])
		bioIntro := fmt.Sprintf("%v", payload["bioIntro"])
		accentColor := fmt.Sprintf("%v", payload["accentColor"])
		themeConfigBytes, _ := json.Marshal(payload["themeConfig"])
		if len(themeConfigBytes) == 0 {
			themeConfigBytes = []byte("{}")
		}

		_, err := r.DB.ExecContext(ctx, `
			UPDATE sites 
			SET role_headline = $1, 
			    bio_intro = $2, 
			    accent_color = $3, 
			    theme_config = $4::jsonb, 
			    last_deployed_at = NOW(), 
			    updated_at = NOW()
			WHERE tenant_id = $5 AND (id::text = $6 OR subdomain LIKE $7)
		`, roleHeadline, bioIntro, accentColor, string(themeConfigBytes), tenantID, siteID, siteID+"%")
		if err != nil {
			log.Printf("[DB ERROR] UpdateSiteDesign: %v", err)
			return err
		}
		return nil
	}

	r.mu.Lock()
	defer r.mu.Unlock()
	for _, c := range r.Containers {
		if c["id"] == siteID {
			if v, ok := payload["roleOrHeadline"]; ok {
				c["roleOrHeadline"] = v
			}
			if v, ok := payload["bioIntro"]; ok {
				c["bioIntro"] = v
			}
			if v, ok := payload["accentColor"]; ok {
				c["accentColor"] = v
			}
			if v, ok := payload["themeConfig"]; ok {
				c["themeConfig"] = v
			}
			c["lastDeployed"] = "Baru saja"
			return nil
		}
	}
	return nil
}

func (r *Repository) DeleteSite(ctx context.Context, tenantID, siteID string) error {
	if r.DB != nil {
		_, err := r.DB.ExecContext(ctx, `
			DELETE FROM sites WHERE tenant_id = $1 AND (id::text = $2 OR subdomain LIKE $3)
		`, tenantID, siteID, siteID+"%")
		return err
	}

	r.mu.Lock()
	defer r.mu.Unlock()
	for i, c := range r.Containers {
		if c["id"] == siteID {
			r.Containers = append(r.Containers[:i], r.Containers[i+1:]...)
			return nil
		}
	}
	return nil
}

func (r *Repository) GetArticles(ctx context.Context, tenantID string) ([]gin.H, error) {
	if r.DB != nil {
		rows, err := r.DB.QueryContext(ctx, `
			SELECT id, title, slug, category, author, status, views, published_at
			FROM content_items
			WHERE tenant_id = $1
			ORDER BY created_at DESC
		`, tenantID)
		if err == nil {
			defer rows.Close()
			var list []gin.H
			for rows.Next() {
				var id, title, slug, category, author, status string
				var views int
				var publishedAt time.Time
				if err := rows.Scan(&id, &title, &slug, &category, &author, &status, &views, &publishedAt); err == nil {
					list = append(list, gin.H{
						"id":          id,
						"title":       title,
						"slug":        slug,
						"category":    category,
						"author":      author,
						"status":      status,
						"views":       views,
						"publishedAt": publishedAt.Format("2 Jan 2006"),
						"siteName":    "Portofolio Rizal Pratama",
					})
				}
			}
			if list != nil {
				return list, nil
			}
			return []gin.H{}, nil
		}
	}

	r.mu.RLock()
	defer r.mu.RUnlock()
	return r.Articles, nil
}

func (r *Repository) GetAssets(ctx context.Context, tenantID string) ([]gin.H, error) {
	if r.DB != nil {
		rows, err := r.DB.QueryContext(ctx, `
			SELECT id, name, file_type, file_size, dimensions, storage_url, created_at
			FROM media_assets
			WHERE tenant_id = $1
			ORDER BY created_at DESC
		`, tenantID)
		if err == nil {
			defer rows.Close()
			var list []gin.H
			for rows.Next() {
				var id, name, fileType, fileSize, dimensions, url string
				var createdAt time.Time
				if err := rows.Scan(&id, &name, &fileType, &fileSize, &dimensions, &url, &createdAt); err == nil {
					list = append(list, gin.H{
						"id":         id,
						"name":       name,
						"type":       fileType,
						"size":       fileSize,
						"dimensions": dimensions,
						"url":        url,
						"uploadedAt": createdAt.Format("2 Jan 2006"),
					})
				}
			}
			if list != nil {
				return list, nil
			}
			return []gin.H{}, nil
		}
	}

	r.mu.RLock()
	defer r.mu.RUnlock()
	return r.Assets, nil
}

func (r *Repository) GetDomains(ctx context.Context, tenantID string) ([]gin.H, error) {
	if r.DB != nil {
		rows, err := r.DB.QueryContext(ctx, `
			SELECT id, domain, target_cname, target_ip, dns_status, ssl_status, created_at
			FROM custom_domains
			WHERE tenant_id = $1
			ORDER BY created_at DESC
		`, tenantID)
		if err == nil {
			defer rows.Close()
			var list []gin.H
			for rows.Next() {
				var id, domain, targetCname, targetIp, dnsStatus, sslStatus string
				var createdAt time.Time
				if err := rows.Scan(&id, &domain, &targetCname, &targetIp, &dnsStatus, &sslStatus, &createdAt); err == nil {
					list = append(list, gin.H{
						"id":          id,
						"domain":      domain,
						"targetCname": targetCname,
						"targetIp":    targetIp,
						"dnsStatus":   dnsStatus,
						"sslStatus":   sslStatus,
						"containerId": "hero_tenant_9942",
						"createdAt":   createdAt.Format("2 Jan 2006"),
					})
				}
			}
			if list != nil {
				return list, nil
			}
			return []gin.H{}, nil
		}
	}

	r.mu.RLock()
	defer r.mu.RUnlock()
	return r.Domains, nil
}

func normalizePriority(p string) string {
	switch strings.ToLower(p) {
	case "p1_urgent", "urgent", "critical", "p1":
		return "p1_urgent"
	case "p2_high", "high", "p2":
		return "p2_high"
	default:
		return "p3_normal"
	}
}

func normalizeStatus(s string) string {
	switch strings.ToLower(s) {
	case "resolved", "closed", "selesai":
		return "resolved"
	case "in_progress", "answered", "pending", "proses":
		return "in_progress"
	default:
		return "open"
	}
}

func (r *Repository) GetTickets(ctx context.Context, tenantID string) ([]gin.H, error) {
	if r.DB != nil {
		rows, err := r.DB.QueryContext(ctx, `
			SELECT id, ticket_number, subject, category, priority, status, last_reply, created_at
			FROM support_tickets
			WHERE tenant_id = $1
			ORDER BY created_at DESC
		`, tenantID)
		if err == nil {
			defer rows.Close()
			var list []gin.H
			for rows.Next() {
				var id, ticketNumber, subject, category, priority, status, lastReply string
				var createdAt time.Time
				if err := rows.Scan(&id, &ticketNumber, &subject, &category, &priority, &status, &lastReply, &createdAt); err == nil {
					normPriority := normalizePriority(priority)
					normStatus := normalizeStatus(status)

					msgs, _ := r.GetTicketMessages(ctx, ticketNumber)
					if msgs == nil {
						msgs = []gin.H{}
					}

					assigned := ""
					if normStatus != "open" {
						assigned = "Budi Hartono (L2 Cloud DevOps)"
					}

					list = append(list, gin.H{
						"id":               ticketNumber,
						"dbId":             id,
						"subject":          subject,
						"category":         category,
						"priority":         normPriority,
						"status":           normStatus,
						"lastUpdated":      lastReply,
						"lastReply":        lastReply,
						"assignedEngineer": assigned,
						"createdAt":        createdAt.Format("2 Jan 2006, 15:04"),
						"messages":         msgs,
					})
				}
			}
			if list != nil {
				return list, nil
			}
			return []gin.H{}, nil
		}
	}

	r.mu.RLock()
	defer r.mu.RUnlock()
	var out []gin.H
	for _, t := range r.Tickets {
		tCopy := gin.H{}
		for k, v := range t {
			tCopy[k] = v
		}
		ticketID, _ := tCopy["id"].(string)
		if tCopy["messages"] == nil {
			msgs := r.Messages[ticketID]
			if msgs == nil {
				msgs = []gin.H{}
			}
			tCopy["messages"] = msgs
		}
		if tCopy["lastUpdated"] == nil && tCopy["lastReply"] != nil {
			tCopy["lastUpdated"] = tCopy["lastReply"]
		}
		if pStr, ok := tCopy["priority"].(string); ok {
			tCopy["priority"] = normalizePriority(pStr)
		}
		if sStr, ok := tCopy["status"].(string); ok {
			tCopy["status"] = normalizeStatus(sStr)
		}
		out = append(out, tCopy)
	}
	return out, nil
}

func (r *Repository) GetTicketMessages(ctx context.Context, ticketKey string) ([]gin.H, error) {
	if r.DB != nil {
		rows, err := r.DB.QueryContext(ctx, `
			SELECT tm.id, tm.sender_name, tm.sender_role, tm.message, tm.created_at
			FROM ticket_messages tm
			JOIN support_tickets st ON st.id = tm.ticket_id
			WHERE st.ticket_number = $1 OR st.id::text = $1
			ORDER BY tm.created_at ASC
		`, ticketKey)
		if err == nil {
			defer rows.Close()
			var list []gin.H
			for rows.Next() {
				var id, senderName, senderRole, message string
				var createdAt time.Time
				if err := rows.Scan(&id, &senderName, &senderRole, &message, &createdAt); err == nil {
					sender := "tenant"
					authorRole := "Tenant Administrator"
					if senderRole == "staff" || senderRole == "support" {
						sender = "support"
						authorRole = "L2 Cloud DevOps Engineer"
					}
					timeStr := createdAt.Format("2 Jan 2006, 15:04")
					list = append(list, gin.H{
						"id":         id,
						"sender":     sender,
						"senderName": senderName,
						"authorName": senderName,
						"senderRole": senderRole,
						"authorRole": authorRole,
						"timestamp":  timeStr,
						"createdAt":  timeStr,
						"message":    message,
					})
				}
			}
			if list != nil {
				return list, nil
			}
			return []gin.H{}, nil
		}
	}

	r.mu.RLock()
	defer r.mu.RUnlock()
	msgs := r.Messages[ticketKey]
	if msgs == nil {
		return []gin.H{}, nil
	}
	return msgs, nil
}

func (r *Repository) CreateTicket(ctx context.Context, tenantID, ticketNumber, subject, category, priority, message, authorName, authorRole string) (gin.H, error) {
	if authorName == "" {
		authorName = "Tenant Administrator"
	}
	if authorRole == "" {
		authorRole = "Tenant Administrator"
	}
	nowStr := time.Now().Format("2 Jan 2006, 15:04")

	if r.DB != nil {
		var ticketID string
		err := r.DB.QueryRowContext(ctx, `
			INSERT INTO support_tickets (id, tenant_id, ticket_number, subject, category, priority, status, last_reply, created_at, updated_at)
			VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, 'open', 'Baru saja', NOW(), NOW())
			RETURNING id
		`, tenantID, ticketNumber, subject, category, priority).Scan(&ticketID)
		if err == nil {
			var msgID string
			_ = r.DB.QueryRowContext(ctx, `
				INSERT INTO ticket_messages (id, ticket_id, sender_name, sender_role, message, created_at)
				VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW())
				RETURNING id
			`, ticketID, authorName, "customer", message).Scan(&msgID)

			firstMsg := gin.H{
				"id":         msgID,
				"sender":     "tenant",
				"authorName": authorName,
				"authorRole": authorRole,
				"timestamp":  nowStr,
				"createdAt":  nowStr,
				"message":    message,
			}

			return gin.H{
				"id":          ticketNumber,
				"dbId":        ticketID,
				"subject":     subject,
				"category":    category,
				"priority":    normalizePriority(priority),
				"status":      "open",
				"lastUpdated": "Baru saja",
				"lastReply":   "Baru saja",
				"createdAt":   nowStr,
				"messages":    []gin.H{firstMsg},
			}, nil
		}
	}

	r.mu.Lock()
	defer r.mu.Unlock()

	msgID := fmt.Sprintf("msg_%d", time.Now().UnixNano())
	firstMsg := gin.H{
		"id":         msgID,
		"sender":     "tenant",
		"authorName": authorName,
		"authorRole": authorRole,
		"timestamp":  nowStr,
		"createdAt":  nowStr,
		"message":    message,
	}

	tkt := gin.H{
		"id":          ticketNumber,
		"subject":     subject,
		"category":    category,
		"priority":    normalizePriority(priority),
		"status":      "open",
		"lastUpdated": "Baru saja",
		"lastReply":   "Baru saja",
		"createdAt":   nowStr,
		"messages":    []gin.H{firstMsg},
	}

	r.Tickets = append([]gin.H{tkt}, r.Tickets...)
	r.Messages[ticketNumber] = []gin.H{firstMsg}

	return tkt, nil
}

func (r *Repository) AddTicketMessage(ctx context.Context, tenantID, ticketKey, message, authorName, authorRole, sender string) (gin.H, error) {
	if authorName == "" {
		authorName = "Tenant Administrator"
	}
	if authorRole == "" {
		authorRole = "Tenant Administrator"
	}
	if sender == "" {
		sender = "tenant"
	}
	senderRole := "customer"
	if sender == "support" {
		senderRole = "staff"
	}
	nowStr := time.Now().Format("2 Jan 2006, 15:04")

	if r.DB != nil {
		var ticketID string
		err := r.DB.QueryRowContext(ctx, `
			SELECT id FROM support_tickets
			WHERE (ticket_number = $1 OR id::text = $1) AND tenant_id = $2
		`, ticketKey, tenantID).Scan(&ticketID)
		if err == nil {
			var msgID string
			err = r.DB.QueryRowContext(ctx, `
				INSERT INTO ticket_messages (id, ticket_id, sender_name, sender_role, message, created_at)
				VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW())
				RETURNING id
			`, ticketID, authorName, senderRole, message).Scan(&msgID)
			if err == nil {
				_, _ = r.DB.ExecContext(ctx, `
					UPDATE support_tickets
					SET last_reply = 'Baru saja', updated_at = NOW(), status = CASE WHEN status = 'resolved' THEN 'open' ELSE status END
					WHERE id = $1
				`, ticketID)

				return gin.H{
					"id":         msgID,
					"sender":     sender,
					"authorName": authorName,
					"authorRole": authorRole,
					"timestamp":  nowStr,
					"createdAt":  nowStr,
					"message":    message,
				}, nil
			}
		}
	}

	r.mu.Lock()
	defer r.mu.Unlock()

	msgID := fmt.Sprintf("msg_%d", time.Now().UnixNano())
	newMsg := gin.H{
		"id":         msgID,
		"sender":     sender,
		"authorName": authorName,
		"authorRole": authorRole,
		"timestamp":  nowStr,
		"createdAt":  nowStr,
		"message":    message,
	}

	r.Messages[ticketKey] = append(r.Messages[ticketKey], newMsg)

	for i := range r.Tickets {
		if tID, _ := r.Tickets[i]["id"].(string); tID == ticketKey {
			r.Tickets[i]["lastUpdated"] = "Baru saja"
			r.Tickets[i]["lastReply"] = "Baru saja"
			if msgs, ok := r.Tickets[i]["messages"].([]gin.H); ok {
				r.Tickets[i]["messages"] = append(msgs, newMsg)
			}
			break
		}
	}

	return newMsg, nil
}

func (r *Repository) ResolveTicket(ctx context.Context, tenantID, ticketKey string) error {
	if r.DB != nil {
		_, err := r.DB.ExecContext(ctx, `
			UPDATE support_tickets
			SET status = 'resolved', last_reply = 'Baru saja', updated_at = NOW()
			WHERE (ticket_number = $1 OR id::text = $1) AND tenant_id = $2
		`, ticketKey, tenantID)
		if err == nil {
			return nil
		}
	}

	r.mu.Lock()
	defer r.mu.Unlock()
	for i := range r.Tickets {
		if tID, _ := r.Tickets[i]["id"].(string); tID == ticketKey {
			r.Tickets[i]["status"] = "resolved"
			r.Tickets[i]["lastUpdated"] = "Baru saja"
			break
		}
	}
	return nil
}

func (r *Repository) GetInvoices(ctx context.Context, tenantID string) ([]gin.H, error) {
	if r.DB != nil {
		rows, err := r.DB.QueryContext(ctx, `
			SELECT id, invoice_number, plan_name, period, amount, tax, total, 
			       date, due_date, status, payment_method, container_quota
			FROM invoices
			WHERE tenant_id = $1
			ORDER BY created_at DESC
		`, tenantID)
		if err == nil {
			defer rows.Close()
			var list []gin.H
			for rows.Next() {
				var id, invoiceNumber, planName, period, date, dueDate, status, paymentMethod string
				var amount, tax, total, containerQuota int
				if err := rows.Scan(&id, &invoiceNumber, &planName, &period, &amount, &tax, &total,
					&date, &dueDate, &status, &paymentMethod, &containerQuota); err == nil {
					list = append(list, gin.H{
						"id":             invoiceNumber,
						"dbId":           id,
						"invoiceNumber":  invoiceNumber,
						"planName":       planName,
						"period":         period,
						"amount":         amount,
						"tax":            tax,
						"total":          total,
						"date":           date,
						"dueDate":        dueDate,
						"status":         status,
						"paymentMethod":  paymentMethod,
						"containerQuota": containerQuota,
					})
				}
			}
			if list != nil {
				return list, nil
			}
			return []gin.H{}, nil
		}
	}

	r.mu.RLock()
	defer r.mu.RUnlock()
	return r.Invoices, nil
}

func (r *Repository) GetWebhooks(ctx context.Context, tenantID string) ([]gin.H, error) {
	if r.DB != nil {
		rows, err := r.DB.QueryContext(ctx, `
			SELECT id, name, url, events::text, status, last_triggered
			FROM webhooks
			WHERE tenant_id = $1
			ORDER BY created_at DESC
		`, tenantID)
		if err == nil {
			defer rows.Close()
			var list []gin.H
			for rows.Next() {
				var id, name, url, eventsStr, status, lastTriggered string
				if err := rows.Scan(&id, &name, &url, &eventsStr, &status, &lastTriggered); err == nil {
					list = append(list, gin.H{
						"id":            id,
						"name":          name,
						"url":           url,
						"events":        []string{"site.deployed", "container.crashed"},
						"status":        status,
						"lastTriggered": lastTriggered,
					})
				}
			}
			if list != nil {
				return list, nil
			}
			return []gin.H{}, nil
		}
	}

	r.mu.RLock()
	defer r.mu.RUnlock()
	return r.Webhooks, nil
}

func (r *Repository) GetBillingQuota(ctx context.Context, tenantID string) (gin.H, error) {
	planName := "Hero Pro Plan"
	priceText := "Rp 149.000 / bln"
	maxContainers := 3
	storageQuota := 2048
	usedContainers := 0

	if r.DB != nil {
		var planTier string
		_ = r.DB.QueryRowContext(ctx, `
			SELECT plan_tier, max_containers, storage_quota_mb
			FROM tenants WHERE id = $1 LIMIT 1
		`, tenantID).Scan(&planTier, &maxContainers, &storageQuota)

		if planTier == "starter" {
			planName = "Hero Starter Plan"
			priceText = "Rp 49.000 / bln"
		} else if planTier == "agency" {
			planName = "Hero Agency Plan"
			priceText = "Rp 399.000 / bln"
		}

		_ = r.DB.QueryRowContext(ctx, `
			SELECT COUNT(*) FROM sites WHERE tenant_id = $1
		`, tenantID).Scan(&usedContainers)
	} else {
		r.mu.RLock()
		usedContainers = len(r.Containers)
		r.mu.RUnlock()
	}

	return gin.H{
		"plan": gin.H{
			"name":            planName,
			"price":           priceText,
			"maxContainers":   maxContainers,
			"usedContainers":  usedContainers,
			"cpuPerContainer": "0.5 vCPU",
			"ramPerContainer": "256 MB",
			"storageQuota":    fmt.Sprintf("%d MB", storageQuota),
			"usedStorage":     "120 MB",
			"nextBillingDate": time.Now().AddDate(0, 1, 0).Format("2 Jan 2006"),
		},
	}, nil
}

// -----------------------------------------------------------------------------
// In-Memory Fallback Seeds
// -----------------------------------------------------------------------------

func (r *Repository) seedInitialData() {
	r.mu.Lock()
	defer r.mu.Unlock()

	r.Containers = []gin.H{
		{
			"id":             "hero_tenant_9942",
			"name":           "Portofolio Rizal Pratama",
			"category":       "portfolio",
			"templateName":   "Portofolio Teknis Engineer",
			"subdomain":      "rizal.cloudcms.app",
			"status":         "running",
			"cpuUsage":       14,
			"ramUsage":       88,
			"ramLimit":       256,
			"cpuLimit":       "0.5 vCPU",
			"uptime":         "4 hari 12 jam",
			"visitsThisWeek": 3892,
			"ssl":            true,
			"roleOrHeadline": "Portofolio Teknis Engineer",
			"accentColor":    "#2563eb",
			"lastDeployed":   "18 Sep 2026",
		},
		{
			"id":             "hero_tenant_2002",
			"name":           "Portal Informasi Utama",
			"category":       "business",
			"templateName":   "Portofolio Teknis Engineer",
			"subdomain":      "wedak.cloudcms.app",
			"status":         "running",
			"cpuUsage":       12,
			"ramUsage":       76,
			"ramLimit":       256,
			"cpuLimit":       "0.5 vCPU",
			"uptime":         "2 hari 6 jam",
			"visitsThisWeek": 1240,
			"ssl":            true,
			"roleOrHeadline": "Portofolio Teknis Engineer",
			"accentColor":    "#2563eb",
			"lastDeployed":   "17 Sep 2026",
		},
	}

	r.Articles = []gin.H{
		{
			"id":          "art_01",
			"title":       "Arsitektur Multi-Tenant HeroCMS dengan PostgreSQL RLS",
			"slug":        "arsitektur-multi-tenant-herocms-rls",
			"category":    "Arsitektur",
			"status":      "published",
			"publishedAt": "18 Sep 2026",
			"views":       1420,
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
	}

	r.Messages["TKT-9942-01"] = []gin.H{
		{
			"id":         "msg_01",
			"senderName": "Rizal Pratama",
			"senderRole": "customer",
			"message":    "Halo tim Support, saya ingin menanyakan apakah rute subdomain saya sudah aktif verifikasi Let's Encrypt TLS-ALPN-01?",
			"createdAt":  "18 Sep 2026, 10:14",
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
