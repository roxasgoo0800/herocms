-- =============================================================================
-- HEROCMS MULTI-TENANT DATABASE INITIALIZATION & ROW-LEVEL SECURITY (RLS)
-- Sesuai Spesifikasi PRD v1.0 & Arsitektur Teknis (PostgreSQL 16)
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- 1. Tabel Tenants (Organisasi / Akun Pelanggan CaaS)
-- -----------------------------------------------------------------------------
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

-- -----------------------------------------------------------------------------
-- 2. Tabel Users (Akun Pengguna Multi-Tenant)
-- -----------------------------------------------------------------------------
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

-- -----------------------------------------------------------------------------
-- 3. Tabel Sites (Kontainer Docker & Website Tenant)
-- -----------------------------------------------------------------------------
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

-- -----------------------------------------------------------------------------
-- 4. Tabel Content Items (Artikel Editorial & Halaman CMS)
-- -----------------------------------------------------------------------------
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

-- -----------------------------------------------------------------------------
-- 5. Tabel Media Assets (Penyimpanan MinIO S3)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS media_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    file_type VARCHAR(16) NOT NULL,
    mime_type VARCHAR(64) NOT NULL,
    dimensions VARCHAR(64) NOT NULL DEFAULT 'N/A',
    file_size VARCHAR(32) NOT NULL,
    file_size_bytes BIGINT NOT NULL DEFAULT 0,
    storage_url VARCHAR(512) NOT NULL,
    s3_key VARCHAR(512) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 6. Tabel Custom Domains (DNS Ingress Traefik v3)
-- -----------------------------------------------------------------------------
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

-- -----------------------------------------------------------------------------
-- 7. Tabel Support Tickets & Messages
-- -----------------------------------------------------------------------------
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

-- -----------------------------------------------------------------------------
-- 8. Tabel Invoices & Billing
-- -----------------------------------------------------------------------------
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

-- -----------------------------------------------------------------------------
-- 9. Tabel Webhooks & Integrations
-- -----------------------------------------------------------------------------
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

-- -----------------------------------------------------------------------------
-- 10. Tabel API Keys (Headless Integrations)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    key_prefix VARCHAR(32) NOT NULL,
    key_hash VARCHAR(255) NOT NULL,
    last_used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- KEBIJAKAN ROW-LEVEL SECURITY (RLS) POSTGRESQL MULTI-TENANT
-- Setiap akses data dibatasi hanya pada tenant_id yang aktif di sesi database
-- =============================================================================

ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Kebijakan Isolasi Row-Level Security
DROP POLICY IF EXISTS tenant_sites_isolation ON sites;
CREATE POLICY tenant_sites_isolation ON sites
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

DROP POLICY IF EXISTS tenant_content_isolation ON content_items;
CREATE POLICY tenant_content_isolation ON content_items
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

DROP POLICY IF EXISTS tenant_assets_isolation ON media_assets;
CREATE POLICY tenant_assets_isolation ON media_assets
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

DROP POLICY IF EXISTS tenant_domains_isolation ON custom_domains;
CREATE POLICY tenant_domains_isolation ON custom_domains
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

DROP POLICY IF EXISTS tenant_tickets_isolation ON support_tickets;
CREATE POLICY tenant_tickets_isolation ON support_tickets
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

DROP POLICY IF EXISTS tenant_invoices_isolation ON invoices;
CREATE POLICY tenant_invoices_isolation ON invoices
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

DROP POLICY IF EXISTS tenant_webhooks_isolation ON webhooks;
CREATE POLICY tenant_webhooks_isolation ON webhooks
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

DROP POLICY IF EXISTS tenant_api_keys_isolation ON api_keys;
CREATE POLICY tenant_api_keys_isolation ON api_keys
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

-- =============================================================================
-- SEED DATA AWAL (DEFAULT TENANT & CUSTOMER DEMO)
-- =============================================================================
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

-- Password hash untuk password default: 'Password123!'
INSERT INTO users (id, tenant_id, email, password_hash, full_name, role, status)
VALUES (
    '11111111-1111-1111-1111-111111111111',
    '99420000-0000-0000-0000-000000009942',
    'admin@rizalpratama.cloud',
    '$2a$12$e6x9Yj1j5N6R8iN1qTz5gOz7n2JqM6tQ1Xw2vK8sF4aE0uY7pC.Wa',
    'Rizal Pratama',
    'customer',
    'active'
) ON CONFLICT (email) DO NOTHING;

-- User admin (Password: 'admin') khusus development & testing lokal
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

