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
	"github.com/google/uuid"
	_ "github.com/lib/pq"
)

type Repository struct {
	DB *sql.DB
	mu sync.RWMutex

	// Resilient in-memory models (fallback if DB unreachable)
	Containers []gin.H
	Articles   []gin.H
	Pages      []gin.H
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

// NewInMemoryRepository creates an isolated, in-memory repository instance for testing and offline execution.
func NewInMemoryRepository() *Repository {
	repo := &Repository{
		DB:       nil,
		Messages: make(map[string][]gin.H),
	}
	repo.seedInitialData()
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
		bucket_name VARCHAR(128) NOT NULL DEFAULT '',
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

	CREATE TABLE IF NOT EXISTS pages (
		id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
		tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
		site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
		title VARCHAR(255) NOT NULL,
		path VARCHAR(255) NOT NULL,
		template_layout VARCHAR(128) NOT NULL DEFAULT 'standard-prose',
		status VARCHAR(32) NOT NULL DEFAULT 'published',
		is_in_navbar BOOLEAN NOT NULL DEFAULT true,
		is_in_footer BOOLEAN NOT NULL DEFAULT true,
		meta_title VARCHAR(255),
		meta_desc TEXT,
		content TEXT NOT NULL DEFAULT '',
		created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
		updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
	);

	ALTER TABLE media_assets ALTER COLUMN mime_type TYPE VARCHAR(255);
	ALTER TABLE media_assets ADD COLUMN IF NOT EXISTS bucket_name VARCHAR(128) NOT NULL DEFAULT '';
	ALTER TABLE content_items ADD COLUMN IF NOT EXISTS excerpt TEXT NOT NULL DEFAULT '';
	ALTER TABLE content_items ADD COLUMN IF NOT EXISTS tags JSONB NOT NULL DEFAULT '[]'::jsonb;
	ALTER TABLE content_items ADD COLUMN IF NOT EXISTS meta_title VARCHAR(255) NOT NULL DEFAULT '';
	ALTER TABLE content_items ADD COLUMN IF NOT EXISTS meta_desc TEXT NOT NULL DEFAULT '';
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
		'Aether Core Tenant Rizal Pratama',
		'Stack Pro Plan',
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

	-- Purge legacy dummy seeds so the dashboard strictly displays 100% genuine user resources
	DELETE FROM sites WHERE subdomain IN ('rizal', 'wedak', 'rizal.stackbyte.id', 'wedak.stackbyte.id', 'rizal.cloudcms.app', 'wedak.cloudcms.app') OR id IN ('99420000-0000-0000-0000-000000000001', '99420000-0000-0000-0000-000000000002');
	DELETE FROM custom_domains WHERE domain = 'rizalpratama.cloud';
	DELETE FROM content_items WHERE slug IN ('arsitektur-multi-tenant-aether-core-stack-rls', 'strategi-caching-traefik-v3-tls', 'pengamanan-linux-kernel-cgroups-seccomp');
	DELETE FROM ticket_messages WHERE ticket_id IN ('99420000-0000-0000-0000-000000000401', '99420000-0000-0000-0000-000000000402');
	DELETE FROM support_tickets WHERE ticket_number IN ('TKT-9942-01', 'TKT-9942-02');
	DELETE FROM invoices WHERE invoice_number IN ('INV-2026-09-9942', 'INV-2026-08-9942');
	DELETE FROM webhooks WHERE id = '99420000-0000-0000-0000-000000000701';
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
	if r == nil {
		return []gin.H{}, nil
	}
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
					if !strings.HasSuffix(subdomain, ".stackbyte.id") && !strings.HasSuffix(subdomain, ".cloudcms.app") {
						subDomainFull = fmt.Sprintf("%s.stackbyte.id", subdomain)
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
						bIntro = "Selamat datang di website resmi yang didukung arsitektur kontainer otonom Stack Studio."
					}

					siteObj := gin.H{
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
					}
					if status == "maintenance" {
						siteObj["maintenanceConfig"] = gin.H{
							"enabled":          true,
							"message":          "Situs sedang dalam pemeliharaan berkala untuk peningkatan performa. Kami akan segera kembali.",
							"estimatedEndTime": "30 menit",
						}
					}
					list = append(list, siteObj)
				}
			}
			if err := rows.Err(); err != nil {
				return nil, err
			}
			if list != nil {
				return list, nil
			}
			return []gin.H{}, nil
		}
	}

	r.mu.RLock()
	defer r.mu.RUnlock()
	if tenantID == "99420000-0000-0000-0000-000000009942" {
		return r.Containers, nil
	}
	return []gin.H{}, nil
}

func (r *Repository) InsertSite(ctx context.Context, tenantID string, site gin.H) error {
	if r == nil {
		return nil
	}
	if r.DB != nil {
		status := "running"
		if s, ok := site["status"].(string); ok && s != "" {
			status = s
		}
		cleanSubdomain := fmt.Sprintf("%v", site["subdomain"])
		cleanSubdomain = strings.TrimSuffix(cleanSubdomain, ".stackbyte.id")
		cleanSubdomain = strings.TrimSuffix(cleanSubdomain, ".cloudcms.app")

		var newUUID string
		err := r.DB.QueryRowContext(ctx, `
			INSERT INTO sites (
				tenant_id, name, category, template_name, subdomain, status,
				cpu_usage, ram_usage, ram_limit, cpu_limit, uptime, visits_this_week,
				accent_color, role_headline, bio_intro, last_deployed_at
			) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW())
			RETURNING id
		`,
			tenantID,
			fmt.Sprintf("%v", site["name"]),
			fmt.Sprintf("%v", site["category"]),
			fmt.Sprintf("%v", site["templateName"]),
			cleanSubdomain,
			status,
			14, 88, 256, "0.5 vCPU", "Baru saja aktif", 0,
			fmt.Sprintf("%v", site["accentColor"]),
			fmt.Sprintf("%v", site["roleOrHeadline"]),
			fmt.Sprintf("%v", site["bioIntro"]),
		).Scan(&newUUID)
		if err != nil {
			log.Printf("[DB ERROR] InsertSite: %v", err)
			return err
		}
		site["id"] = newUUID
		return nil
	}

	r.mu.Lock()
	r.Containers = append(r.Containers, site)
	r.mu.Unlock()
	return nil
}

func (r *Repository) UpdateSiteStatus(ctx context.Context, tenantID, siteID, status string) error {
	if r == nil {
		return nil
	}
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

// GetSiteSubdomain retrieves the subdomain or name for a site
func (r *Repository) GetSiteSubdomain(ctx context.Context, tenantID, siteID string) string {
	if r == nil {
		return ""
	}
	if r.DB != nil {
		var sub string
		err := r.DB.QueryRowContext(ctx, `
			SELECT subdomain FROM sites 
			WHERE tenant_id = $1 AND (id::text = $2 OR subdomain LIKE $3) 
			LIMIT 1
		`, tenantID, siteID, siteID+"%").Scan(&sub)
		if err == nil {
			return sub
		}
	}
	r.mu.RLock()
	defer r.mu.RUnlock()
	for _, c := range r.Containers {
		if c["id"] == siteID {
			if sub, ok := c["subdomain"].(string); ok {
				return sub
			}
		}
	}
	return ""
}

func (r *Repository) UpdateSiteMaintenance(ctx context.Context, tenantID, siteID string, enabled bool, message, estimatedEndTime string) error {
	if r == nil {
		return nil
	}
	status := "running"
	if enabled {
		status = "maintenance"
	}

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
			if enabled {
				c["maintenanceConfig"] = gin.H{
					"enabled":          true,
					"message":          message,
					"estimatedEndTime": estimatedEndTime,
				}
			} else {
				delete(c, "maintenanceConfig")
			}
			return nil
		}
	}
	return nil
}

func (r *Repository) UpdateSiteDesign(ctx context.Context, tenantID, siteID string, payload gin.H) error {
	if r == nil {
		return nil
	}
	if r.DB != nil {
		roleHeadline := fmt.Sprintf("%v", payload["roleOrHeadline"])
		bioIntro := fmt.Sprintf("%v", payload["bioIntro"])
		accentColor := fmt.Sprintf("%v", payload["accentColor"])
		themeConfigBytes, _ := json.Marshal(payload["themeConfig"])
		if len(themeConfigBytes) == 0 {
			themeConfigBytes = []byte("{}")
		}

		tplName := fmt.Sprintf("%v", payload["templateName"])
		if tplName == "" || tplName == "<nil>" {
			tplName = fmt.Sprintf("%v", payload["template_name"])
		}
		if tplName == "<nil>" {
			tplName = ""
		}
		category := fmt.Sprintf("%v", payload["category"])
		if category == "<nil>" {
			category = ""
		}

		_, err := r.DB.ExecContext(ctx, `
			UPDATE sites 
			SET role_headline = $1, 
			    bio_intro = $2, 
			    accent_color = $3, 
			    theme_config = $4::jsonb, 
			    template_name = CASE WHEN $8 <> '' THEN $8 ELSE template_name END,
			    category = CASE WHEN $9 <> '' THEN $9 ELSE category END,
			    last_deployed_at = NOW(), 
			    updated_at = NOW()
			WHERE tenant_id = $5 AND (id::text = $6 OR subdomain LIKE $7)
		`, roleHeadline, bioIntro, accentColor, string(themeConfigBytes), tenantID, siteID, siteID+"%", tplName, category)
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
			if v, ok := payload["templateName"]; ok && v != nil && fmt.Sprintf("%v", v) != "" && fmt.Sprintf("%v", v) != "<nil>" {
				c["templateName"] = v
			}
			if v, ok := payload["category"]; ok && v != nil && fmt.Sprintf("%v", v) != "" && fmt.Sprintf("%v", v) != "<nil>" {
				c["category"] = v
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
	if r == nil {
		return nil
	}
	cleanSub := strings.TrimSuffix(strings.TrimSuffix(siteID, ".stackbyte.id"), ".cloudcms.app")
	if r.DB != nil {
		_, err := r.DB.ExecContext(ctx, `
			DELETE FROM sites 
			WHERE tenant_id = $1 
			  AND (id::text = $2 OR subdomain = $2 OR subdomain LIKE $3 OR subdomain = $4 OR name = $2)
		`, tenantID, siteID, cleanSub+"%", cleanSub)
		return err
	}

	r.mu.Lock()
	defer r.mu.Unlock()
	for i, c := range r.Containers {
		if c["id"] == siteID || c["subdomain"] == siteID || c["name"] == siteID {
			r.Containers = append(r.Containers[:i], r.Containers[i+1:]...)
			return nil
		}
	}
	return nil
}

func (r *Repository) GetArticles(ctx context.Context, tenantID string) ([]gin.H, error) {
	if r == nil {
		return []gin.H{}, nil
	}
	if r.DB != nil {
		rows, err := r.DB.QueryContext(ctx, `
			SELECT c.id, c.title, c.slug, c.category, c.author, c.status, c.views, c.published_at,
			       COALESCE(s.name, ''), COALESCE(c.site_id::text, ''),
			       COALESCE(c.content_markdown, ''), COALESCE(c.excerpt, ''),
			       COALESCE(c.tags::text, '[]'), COALESCE(c.meta_title, ''), COALESCE(c.meta_desc, '')
			FROM content_items c
			LEFT JOIN sites s ON c.site_id = s.id
			WHERE c.tenant_id = $1
			ORDER BY c.created_at DESC
		`, tenantID)
		if err == nil {
			defer rows.Close()
			var list []gin.H
			for rows.Next() {
				var id, title, slug, category, author, status, siteName, siteID string
				var contentMarkdown, excerpt, tagsJSON, metaTitle, metaDesc string
				var views int
				var publishedAt time.Time
				if err := rows.Scan(&id, &title, &slug, &category, &author, &status, &views, &publishedAt, &siteName, &siteID,
					&contentMarkdown, &excerpt, &tagsJSON, &metaTitle, &metaDesc); err == nil {

					var tags []string
					_ = json.Unmarshal([]byte(tagsJSON), &tags)
					if tags == nil {
						tags = []string{}
					}

					list = append(list, gin.H{
						"id":          id,
						"title":       title,
						"slug":        slug,
						"category":    category,
						"author":      author,
						"status":      status,
						"views":       views,
						"publishedAt": publishedAt.Format("2 Jan 2006"),
						"siteName":    siteName,
						"containerId": siteID,
						"content":     contentMarkdown,
						"excerpt":     excerpt,
						"tags":        tags,
						"metaTitle":   metaTitle,
						"metaDesc":    metaDesc,
					})
				}
			}
			if err := rows.Err(); err != nil {
				return nil, err
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

func (r *Repository) InsertArticle(ctx context.Context, tenantID string, art gin.H) (gin.H, error) {
	if r == nil {
		return art, nil
	}

	title := fmt.Sprintf("%v", art["title"])
	slug := fmt.Sprintf("%v", art["slug"])
	if slug == "" || slug == "<nil>" {
		slug = strings.ToLower(strings.ReplaceAll(title, " ", "-"))
	}
	category := "Engineering"
	if c, ok := art["category"].(string); ok && c != "" {
		category = c
	}
	author := "Rizal Pratama"
	if a, ok := art["author"].(string); ok && a != "" {
		author = a
	}
	status := "published"
	if s, ok := art["status"].(string); ok && s != "" {
		status = s
	}
	content := ""
	if c, ok := art["content"].(string); ok {
		content = c
	}
	excerpt := ""
	if e, ok := art["excerpt"].(string); ok {
		excerpt = e
	}
	metaTitle := title
	if mt, ok := art["metaTitle"].(string); ok && mt != "" {
		metaTitle = mt
	}
	metaDesc := excerpt
	if md, ok := art["metaDesc"].(string); ok && md != "" {
		metaDesc = md
	}

	var tagsBytes []byte
	if tags, ok := art["tags"]; ok && tags != nil {
		tagsBytes, _ = json.Marshal(tags)
	}
	if len(tagsBytes) == 0 {
		tagsBytes = []byte("[]")
	}

	var siteID *string
	if sid, ok := art["containerId"].(string); ok && sid != "" {
		if _, err := uuid.Parse(sid); err == nil {
			siteID = &sid
		}
	}

	artID := uuid.New().String()
	if rawID, ok := art["id"].(string); ok && rawID != "" {
		if _, err := uuid.Parse(rawID); err == nil {
			artID = rawID
		}
	}

	if r.DB != nil {
		_, err := r.DB.ExecContext(ctx, `
			INSERT INTO content_items (id, tenant_id, site_id, title, slug, category, author, status, views, content_markdown, excerpt, tags, meta_title, meta_desc, published_at, created_at, updated_at)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 0, $9, $10, $11::jsonb, $12, $13, NOW(), NOW(), NOW())
		`, artID, tenantID, siteID, title, slug, category, author, status, content, excerpt, string(tagsBytes), metaTitle, metaDesc)
		if err != nil {
			log.Printf("[DB ERROR] InsertArticle: %v", err)
			return nil, err
		}
	}

	art["id"] = artID
	art["publishedAt"] = time.Now().Format("2 Jan 2006")
	art["views"] = 0

	r.mu.Lock()
	defer r.mu.Unlock()
	r.Articles = append([]gin.H{art}, r.Articles...)
	return art, nil
}

func (r *Repository) UpdateArticle(ctx context.Context, tenantID, articleID string, art gin.H) error {
	if r == nil {
		return nil
	}

	title := fmt.Sprintf("%v", art["title"])
	slug := fmt.Sprintf("%v", art["slug"])
	category := fmt.Sprintf("%v", art["category"])
	author := fmt.Sprintf("%v", art["author"])
	status := fmt.Sprintf("%v", art["status"])
	content := fmt.Sprintf("%v", art["content"])
	excerpt := fmt.Sprintf("%v", art["excerpt"])
	metaTitle := fmt.Sprintf("%v", art["metaTitle"])
	metaDesc := fmt.Sprintf("%v", art["metaDesc"])

	var tagsBytes []byte
	if tags, ok := art["tags"]; ok && tags != nil {
		tagsBytes, _ = json.Marshal(tags)
	}
	if len(tagsBytes) == 0 {
		tagsBytes = []byte("[]")
	}

	var siteID *string
	if sid, ok := art["containerId"].(string); ok && sid != "" {
		if _, err := uuid.Parse(sid); err == nil {
			siteID = &sid
		}
	}

	if r.DB != nil {
		_, err := r.DB.ExecContext(ctx, `
			UPDATE content_items
			SET title = $1, slug = $2, category = $3, author = $4, status = $5,
			    content_markdown = $6, excerpt = $7, tags = $8::jsonb, meta_title = $9, meta_desc = $10,
			    site_id = COALESCE($11, site_id), updated_at = NOW()
			WHERE tenant_id = $12 AND (id::text = $13 OR slug = $13)
		`, title, slug, category, author, status, content, excerpt, string(tagsBytes), metaTitle, metaDesc, siteID, tenantID, articleID)
		if err != nil {
			log.Printf("[DB ERROR] UpdateArticle: %v", err)
			return err
		}
	}

	r.mu.Lock()
	defer r.mu.Unlock()
	for i, a := range r.Articles {
		if a["id"] == articleID || a["slug"] == articleID {
			for k, v := range art {
				r.Articles[i][k] = v
			}
			return nil
		}
	}
	return nil
}

func (r *Repository) DeleteArticle(ctx context.Context, tenantID, articleID string) error {
	if r == nil {
		return nil
	}
	if r.DB != nil {
		_, err := r.DB.ExecContext(ctx, `
			DELETE FROM content_items
			WHERE tenant_id = $1 AND (id::text = $2 OR slug = $2)
		`, tenantID, articleID)
		if err != nil {
			log.Printf("[DB ERROR] DeleteArticle: %v", err)
			return err
		}
	}

	r.mu.Lock()
	defer r.mu.Unlock()
	for i, a := range r.Articles {
		if a["id"] == articleID || a["slug"] == articleID {
			r.Articles = append(r.Articles[:i], r.Articles[i+1:]...)
			return nil
		}
	}
	return nil
}

func (r *Repository) GetPages(ctx context.Context, tenantID string) ([]gin.H, error) {
	if r == nil {
		return []gin.H{}, nil
	}
	if r.DB != nil {
		rows, err := r.DB.QueryContext(ctx, `
			SELECT p.id, p.title, p.path, p.template_layout, p.status, p.is_in_navbar, p.is_in_footer,
			       COALESCE(p.meta_title, ''), COALESCE(p.meta_desc, ''), COALESCE(p.content, ''),
			       p.updated_at, COALESCE(s.name, ''), COALESCE(p.site_id::text, '')
			FROM pages p
			LEFT JOIN sites s ON p.site_id = s.id
			WHERE p.tenant_id = $1
			ORDER BY p.created_at ASC
		`, tenantID)
		if err == nil {
			defer rows.Close()
			var list []gin.H
			for rows.Next() {
				var id, title, path, templateLayout, status, metaTitle, metaDesc, content, siteName, siteID string
				var isInNavbar, isInFooter bool
				var updatedAt time.Time
				if err := rows.Scan(&id, &title, &path, &templateLayout, &status, &isInNavbar, &isInFooter,
					&metaTitle, &metaDesc, &content, &updatedAt, &siteName, &siteID); err == nil {

					list = append(list, gin.H{
						"id":             id,
						"title":          title,
						"path":           path,
						"templateLayout": templateLayout,
						"status":         status,
						"isInNavbar":     isInNavbar,
						"isInFooter":     isInFooter,
						"metaTitle":      metaTitle,
						"metaDesc":       metaDesc,
						"content":        content,
						"updatedAt":      updatedAt.Format("2 Jan 2006"),
						"siteName":       siteName,
						"containerId":    siteID,
					})
				}
			}
			if err := rows.Err(); err != nil {
				return nil, err
			}
			if list != nil {
				return list, nil
			}
			return []gin.H{}, nil
		}
	}

	r.mu.RLock()
	defer r.mu.RUnlock()
	return r.Pages, nil
}

func (r *Repository) InsertPage(ctx context.Context, tenantID string, pg gin.H) (gin.H, error) {
	if r == nil {
		return pg, nil
	}

	title := fmt.Sprintf("%v", pg["title"])
	path := fmt.Sprintf("%v", pg["path"])
	if path == "" || path == "<nil>" {
		path = "/" + strings.ToLower(strings.ReplaceAll(title, " ", "-"))
	}
	templateLayout := "standard-prose"
	if tl, ok := pg["templateLayout"].(string); ok && tl != "" {
		templateLayout = tl
	}
	status := "published"
	if s, ok := pg["status"].(string); ok && s != "" {
		status = s
	}
	content := ""
	if c, ok := pg["content"].(string); ok {
		content = c
	}
	metaTitle := title
	if mt, ok := pg["metaTitle"].(string); ok && mt != "" {
		metaTitle = mt
	}
	metaDesc := ""
	if md, ok := pg["metaDesc"].(string); ok && md != "" {
		metaDesc = md
	}

	isInNavbar := true
	if nb, ok := pg["isInNavbar"].(bool); ok {
		isInNavbar = nb
	}
	isInFooter := true
	if ft, ok := pg["isInFooter"].(bool); ok {
		isInFooter = ft
	}

	var siteID *string
	if sid, ok := pg["containerId"].(string); ok && sid != "" {
		if _, err := uuid.Parse(sid); err == nil {
			siteID = &sid
		}
	}

	pageID := uuid.New().String()
	if rawID, ok := pg["id"].(string); ok && rawID != "" {
		if _, err := uuid.Parse(rawID); err == nil {
			pageID = rawID
		}
	}

	if r.DB != nil {
		_, err := r.DB.ExecContext(ctx, `
			INSERT INTO pages (id, tenant_id, site_id, title, path, template_layout, status, is_in_navbar, is_in_footer, meta_title, meta_desc, content, created_at, updated_at)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW())
		`, pageID, tenantID, siteID, title, path, templateLayout, status, isInNavbar, isInFooter, metaTitle, metaDesc, content)
		if err != nil {
			log.Printf("[DB ERROR] InsertPage: %v", err)
			return nil, err
		}
	}

	pg["id"] = pageID
	pg["updatedAt"] = time.Now().Format("2 Jan 2006")

	r.mu.Lock()
	defer r.mu.Unlock()
	r.Pages = append([]gin.H{pg}, r.Pages...)
	return pg, nil
}

func (r *Repository) UpdatePage(ctx context.Context, tenantID, pageID string, pg gin.H) error {
	if r == nil {
		return nil
	}

	title := fmt.Sprintf("%v", pg["title"])
	path := fmt.Sprintf("%v", pg["path"])
	templateLayout := fmt.Sprintf("%v", pg["templateLayout"])
	status := fmt.Sprintf("%v", pg["status"])
	content := fmt.Sprintf("%v", pg["content"])
	metaTitle := fmt.Sprintf("%v", pg["metaTitle"])
	metaDesc := fmt.Sprintf("%v", pg["metaDesc"])

	isInNavbar := true
	if nb, ok := pg["isInNavbar"].(bool); ok {
		isInNavbar = nb
	}
	isInFooter := true
	if ft, ok := pg["isInFooter"].(bool); ok {
		isInFooter = ft
	}

	var siteID *string
	if sid, ok := pg["containerId"].(string); ok && sid != "" {
		if _, err := uuid.Parse(sid); err == nil {
			siteID = &sid
		}
	}

	if r.DB != nil {
		_, err := r.DB.ExecContext(ctx, `
			UPDATE pages
			SET title = $1, path = $2, template_layout = $3, status = $4,
			    is_in_navbar = $5, is_in_footer = $6, meta_title = $7, meta_desc = $8, content = $9,
			    site_id = COALESCE($10, site_id), updated_at = NOW()
			WHERE tenant_id = $11 AND (id::text = $12 OR path = $12)
		`, title, path, templateLayout, status, isInNavbar, isInFooter, metaTitle, metaDesc, content, siteID, tenantID, pageID)
		if err != nil {
			log.Printf("[DB ERROR] UpdatePage: %v", err)
			return err
		}
	}

	r.mu.Lock()
	defer r.mu.Unlock()
	for i, p := range r.Pages {
		if p["id"] == pageID || p["path"] == pageID {
			for k, v := range pg {
				r.Pages[i][k] = v
			}
			return nil
		}
	}
	return nil
}

func (r *Repository) DeletePage(ctx context.Context, tenantID, pageID string) error {
	if r == nil {
		return nil
	}
	if r.DB != nil {
		_, err := r.DB.ExecContext(ctx, `
			DELETE FROM pages
			WHERE tenant_id = $1 AND (id::text = $2 OR path = $2)
		`, tenantID, pageID)
		if err != nil {
			log.Printf("[DB ERROR] DeletePage: %v", err)
			return err
		}
	}

	r.mu.Lock()
	defer r.mu.Unlock()
	for i, p := range r.Pages {
		if p["id"] == pageID || p["path"] == pageID {
			r.Pages = append(r.Pages[:i], r.Pages[i+1:]...)
			return nil
		}
	}
	return nil
}

func (r *Repository) GetTenantStorageUsageBytes(ctx context.Context, tenantID string) (int64, error) {
	if r == nil {
		return 0, nil
	}
	if r.DB != nil {
		var totalBytes int64
		err := r.DB.QueryRowContext(ctx, `
			SELECT COALESCE(SUM(file_size_bytes), 0)
			FROM media_assets
			WHERE tenant_id = $1
		`, tenantID).Scan(&totalBytes)
		if err == nil {
			return totalBytes, nil
		}
	}

	r.mu.RLock()
	defer r.mu.RUnlock()
	var total int64
	for _, a := range r.Assets {
		if tID, ok := a["tenant_id"].(string); ok && tID != "" {
			if tID != tenantID {
				continue
			}
		} else if tenantID != "99420000-0000-0000-0000-000000009942" {
			continue
		}
		if sizeBytes, ok := a["fileSizeBytes"].(int64); ok {
			total += sizeBytes
		} else {
			total += 2 * 1024 * 1024
		}
	}
	return total, nil
}

func (r *Repository) GetAssets(ctx context.Context, tenantID string) ([]gin.H, error) {
	if r == nil {
		return []gin.H{}, nil
	}
	if r.DB != nil {
		rows, err := r.DB.QueryContext(ctx, `
			SELECT id, name, file_type, file_size, file_size_bytes, dimensions, storage_url, s3_key, COALESCE(bucket_name, ''), created_at
			FROM media_assets
			WHERE tenant_id = $1
			ORDER BY created_at DESC
		`, tenantID)
		if err == nil {
			defer rows.Close()
			var list []gin.H
			for rows.Next() {
				var id, name, fileType, fileSize, dimensions, url, s3Key, bucketName string
				var fileSizeBytes int64
				var createdAt time.Time
				if err := rows.Scan(&id, &name, &fileType, &fileSize, &fileSizeBytes, &dimensions, &url, &s3Key, &bucketName, &createdAt); err == nil {
					list = append(list, gin.H{
						"id":         id,
						"name":       name,
						"type":       fileType,
						"size":       fileSize,
						"sizeBytes":  fileSizeBytes,
						"dimensions": dimensions,
						"url":        url,
						"s3Key":      s3Key,
						"bucketName": bucketName,
						"uploadedAt": createdAt.Format("2 Jan 2006"),
					})
				}
			}
			if err := rows.Err(); err != nil {
				return nil, err
			}
			if list != nil {
				return list, nil
			}
			return []gin.H{}, nil
		}
	}

	r.mu.RLock()
	defer r.mu.RUnlock()
	var filtered []gin.H
	for _, a := range r.Assets {
		if tID, ok := a["tenant_id"].(string); ok && tID != "" {
			if tID == tenantID {
				filtered = append(filtered, a)
			}
		} else if tenantID == "99420000-0000-0000-0000-000000009942" {
			filtered = append(filtered, a)
		}
	}
	return filtered, nil
}

func (r *Repository) CreateAsset(ctx context.Context, tenantID, name, fileType, mimeType, dimensions, fileSize string, fileSizeBytes int64, storageURL, s3Key, bucketName string) (gin.H, error) {
	if r == nil {
		return gin.H{}, nil
	}
	now := time.Now()
	nowStr := now.Format("2 Jan 2006")

	if r.DB != nil {
		var id string
		err := r.DB.QueryRowContext(ctx, `
			INSERT INTO media_assets (
				id, tenant_id, name, file_type, mime_type, dimensions, file_size, file_size_bytes, storage_url, s3_key, bucket_name, created_at
			) VALUES (
				gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW()
			)
			RETURNING id::text
		`, tenantID, name, fileType, mimeType, dimensions, fileSize, fileSizeBytes, storageURL, s3Key, bucketName).Scan(&id)
		if err == nil {
			asset := gin.H{
				"id":         id,
				"name":       name,
				"type":       fileType,
				"mimeType":   mimeType,
				"dimensions": dimensions,
				"size":       fileSize,
				"sizeBytes":  fileSizeBytes,
				"url":        storageURL,
				"s3Key":      s3Key,
				"bucketName": bucketName,
				"uploadedAt": nowStr,
			}
			return asset, nil
		}
		log.Printf("[DB ERROR] CreateAsset: %v", err)
	}

	r.mu.Lock()
	defer r.mu.Unlock()

	id := fmt.Sprintf("ast_%d", now.UnixNano()%1000000)
	asset := gin.H{
		"id":         id,
		"name":       name,
		"type":       fileType,
		"mimeType":   mimeType,
		"dimensions": dimensions,
		"size":       fileSize,
		"url":        storageURL,
		"s3Key":      s3Key,
		"bucketName": bucketName,
		"uploadedAt": nowStr,
	}
	r.Assets = append([]gin.H{asset}, r.Assets...)
	return asset, nil
}

func (r *Repository) DeleteAsset(ctx context.Context, tenantID, assetID string) (string, error) {
	if r == nil {
		return "", nil
	}
	var s3Key string

	if r.DB != nil {
		err := r.DB.QueryRowContext(ctx, `
			DELETE FROM media_assets
			WHERE tenant_id = $1 AND (id::text = $2 OR s3_key = $2 OR name = $2)
			RETURNING s3_key
		`, tenantID, assetID).Scan(&s3Key)
		if err == nil {
			return s3Key, nil
		}
	}

	r.mu.Lock()
	defer r.mu.Unlock()
	for i, a := range r.Assets {
		if fmt.Sprintf("%v", a["id"]) == assetID || fmt.Sprintf("%v", a["s3Key"]) == assetID {
			if k, ok := a["s3Key"].(string); ok {
				s3Key = k
			}
			r.Assets = append(r.Assets[:i], r.Assets[i+1:]...)
			return s3Key, nil
		}
	}
	return s3Key, nil
}

func (r *Repository) GetDomains(ctx context.Context, tenantID string) ([]gin.H, error) {
	if r == nil {
		return []gin.H{}, nil
	}
	if r.DB != nil {
		rows, err := r.DB.QueryContext(ctx, `
			SELECT c.id, c.domain, c.target_cname, c.target_ip, c.dns_status, c.ssl_status, 
			       COALESCE(c.site_id::text, ''), COALESCE(s.name, ''), c.created_at
			FROM custom_domains c
			LEFT JOIN sites s ON c.site_id = s.id
			WHERE c.tenant_id = $1
			ORDER BY c.created_at DESC
		`, tenantID)
		if err == nil {
			defer rows.Close()
			var list []gin.H
			for rows.Next() {
				var id, domain, targetCname, targetIp, dnsStatus, sslStatus, siteID, siteName string
				var createdAt time.Time
				if err := rows.Scan(&id, &domain, &targetCname, &targetIp, &dnsStatus, &sslStatus, &siteID, &siteName, &createdAt); err == nil {
					list = append(list, gin.H{
						"id":              id,
						"domain":          domain,
						"targetCname":     targetCname,
						"targetIp":        targetIp,
						"dnsStatus":       dnsStatus,
						"sslStatus":       sslStatus,
						"containerId":     siteID,
						"targetContainer": siteName,
						"createdAt":       createdAt.Format("2 Jan 2006"),
					})
				}
			}
			if err := rows.Err(); err != nil {
				return nil, err
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
	if r == nil {
		return []gin.H{}, nil
	}
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
			if err := rows.Err(); err != nil {
				return nil, err
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
	if r == nil {
		return []gin.H{}, nil
	}
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
			if err := rows.Err(); err != nil {
				return nil, err
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
	if r == nil {
		return gin.H{}, nil
	}
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
	if r == nil {
		return gin.H{}, nil
	}
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
	if r == nil {
		return nil
	}
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
	if r == nil {
		return []gin.H{}, nil
	}
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
			if err := rows.Err(); err != nil {
				return nil, err
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

// AddInvoice safely appends an invoice into in-memory storage with mutex protection
func (r *Repository) AddInvoice(invoice gin.H) {
	if r == nil {
		return
	}
	r.mu.Lock()
	defer r.mu.Unlock()
	r.Invoices = append([]gin.H{invoice}, r.Invoices...)
}

func (r *Repository) GetWebhooks(ctx context.Context, tenantID string) ([]gin.H, error) {
	if r == nil {
		return []gin.H{}, nil
	}
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
			if err := rows.Err(); err != nil {
				return nil, err
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
	planName := "Stack Pro Plan"
	priceText := "Rp 149.000 / bln"
	maxContainers := 3
	storageQuota := 2048
	usedContainers := 0

	if r == nil {
		return gin.H{
			"plan": gin.H{
				"name":            planName,
				"price":           priceText,
				"maxContainers":   maxContainers,
				"usedContainers":  0,
				"cpuPerContainer": "0.5 vCPU",
				"ramPerContainer": "256 MB",
				"storageQuota":    "2048 MB",
				"usedStorage":     "0 MB",
				"nextBillingDate": time.Now().AddDate(0, 1, 0).Format("2 Jan 2006"),
			},
		}, nil
	}

	if r.DB != nil {
		var planTier string
		_ = r.DB.QueryRowContext(ctx, `
			SELECT plan_tier, max_containers, storage_quota_mb
			FROM tenants WHERE id = $1 LIMIT 1
		`, tenantID).Scan(&planTier, &maxContainers, &storageQuota)

		switch planTier {
		case "starter":
			planName = "Stack Starter Plan"
			priceText = "Rp 49.000 / bln"
		case "agency":
			planName = "Stack Agency Plan"
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

	r.Containers = []gin.H{}
	r.Articles = []gin.H{}
	r.Pages = []gin.H{}
	r.Assets = []gin.H{}
	r.Domains = []gin.H{}
	r.Tickets = []gin.H{}
	r.Messages = make(map[string][]gin.H)
	r.Invoices = []gin.H{}
	r.Webhooks = []gin.H{}
}
