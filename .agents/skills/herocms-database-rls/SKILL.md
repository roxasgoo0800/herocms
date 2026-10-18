---
name: herocms-database-rls
description: Standar perancangan basis data PostgreSQL Multi-Tenant dengan Row-Level Security (RLS) dan pola caching Redis untuk HeroCMS. Gunakan saat membuat migrasi SQL, menulis kueri database, atau mengelola isolasi data tenant.
---

# HeroCMS Database & Multi-Tenant RLS Skill (`herocms-database-rls`)

Skill ini memandu AI Agent dalam mendesain skema database, menulis migrasi SQL, dan memastikan isolasi data multi-tenant di PostgreSQL 16 serta Redis 7.

---

## 1. Prinsip Mutlak: Isolasi Multi-Tenant via RLS

Di HeroCMS, seluruh tenant berbagi satu klaster PostgreSQL terpusat dengan isolasi tingkat kernel database menggunakan **PostgreSQL Row-Level Security (RLS)**.

### Setiap Tabel Multi-Tenant WAJIB Memiliki:
1. Kolom `tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE`.
2. Indeks gabungan atau b-tree pada `tenant_id` untuk kecepatan kueri.
3. RLS diaktifkan (`ENABLE ROW LEVEL SECURITY`).
4. Policy yang membaca variabel session runtime `app.current_tenant_id`.

---

## 2. Pola Penulisan Skema & Migrasi SQL

Contoh template pembuatan tabel tenant-isolated:

```sql
-- 1. Buat Tabel dengan tenant_id
CREATE TABLE IF NOT EXISTS articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    content_html TEXT,
    status VARCHAR(50) DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Buat Index untuk performa kueri per-tenant
CREATE INDEX IF NOT EXISTS idx_articles_tenant_slug ON articles (tenant_id, slug);

-- 3. Aktifkan Row-Level Security
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- 4. Pasang Policy Isolasi Ketat
CREATE POLICY tenant_isolation_articles ON articles
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID);
```

---

## 3. Eksekusi Kueri dari Backend (Go / Node / PHP)

Sebelum menjalankan kueri SQL apapun untuk tenant tertentu, backend **wajib** menyetel session variable dalam satu transaksi database:

```sql
BEGIN;
SET LOCAL app.current_tenant_id = 'c0a80101-0000-0000-0000-000000000001';

-- Seluruh kueri di bawah ini otomatis terisolasi oleh engine Postgres:
SELECT * FROM articles WHERE status = 'published';
COMMIT;
```

> **Keamanan**: Jika ada *SQL Injection* sekalipun, attacker tidak akan bisa melihat data tenant lain karena Postgres RLS memblokir baris yang `tenant_id`-nya tidak cocok di level engine.

---

## 4. Pola Caching Redis

- **Namespacing Key**: Selalu gunakan prefix format `herocms:<tenant_id>:<entity>:<id>`
  * Contoh: `herocms:tenant_abc123:article:slug-panduan-cms`
  * Jangan gunakan generic key seperti `article:1` tanpa tenant id.
- **TTL Wajib**: Seluruh key cache wajib memiliki batas kadaluarsa (TTL) wajar (misal: 300 detik – 3600 detik).
- **Cache Invalidation**: Saat data artikel atau setting diubah, lakukan `DEL` pada key spesifik atau publish event invalidation ke Redis Pub/Sub.
