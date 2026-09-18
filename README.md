# Platform Cloud CMS Multi-Tenant & Orkestrasi Kontainer Otonom

Platform Cloud CMS multi-tenant berkinerja tinggi dengan kemampuan otomatisasi pembuatan kontainer Docker mandiri untuk setiap website pelanggan, dilengkapi asisten kecerdasan buatan (AI Copilot), dan analitik pengunjung *real-time*.

---

## 📚 Dokumentasi Teknis Lengkap (`docs/`)

Seluruh dokumen spesifikasi teknis, kebutuhan produk (PRD), pemodelan arsitektur, dan panduan keamanan telah disusun dalam **Bahasa Indonesia** di folder `docs/`:

1. **[docs/PRD.md](file:///home/rizal/dockerfile/docker-cms/docs/PRD.md)**
   - Dokumen Kebutuhan Produk (PRD) Master: latar belakang masalah, target vertikal (Portofolio, Blog Publikasi, Website Edukasi, & Showcase Produk Bisnis), kebutuhan non-fungsional (NFR: SLA 99.9%, deploy < 4.5 detik), peta perjalanan pengguna, dan roadmap pengembangan.
2. **[docs/ARCHITECTURE_AND_TECH_SPEC.md](file:///home/rizal/dockerfile/docker-cms/docs/ARCHITECTURE_AND_TECH_SPEC.md)**
   - Tolok ukur industri (Ghost Pro, Vercel, Shopify, Coolify).
   - Arsitektur sistem menyeluruh, siklus hidup kontainer via Go Docker SDK, injeksi label dinamis Traefik v3, dan isolasi database PostgreSQL Row-Level Security (RLS).
3. **[docs/SECURITY_AND_SANDBOXING.md](file:///home/rizal/dockerfile/docker-cms/docs/SECURITY_AND_SANDBOXING.md)**
   - Matriks pengerasan kontainer: user non-root (`UID 10001`), filesystem read-only, pencabutan hak akses (`CAP_DROP: ALL`), batasan cgroups Linux (0.5 vCPU, 256MB RAM).
   - Mitigasi OWASP Top 10, pencegahan XSS via DOMPurify, proxy anti-SSRF untuk webhook, dan otomatisasi SSL Let's Encrypt.
4. **[docs/AI_AGENT_SERVICE.md](file:///home/rizal/dockerfile/docker-cms/docs/AI_AGENT_SERVICE.md)**
   - Arsitektur hybrid Golang Engine + n8n, generator tema berbasis JSON Schema LLM, dan penampung telemetri Top-Views (< 1ms).
5. **[docs/DEV_ENVIRONMENT_AND_RUNBOOK.md](file:///home/rizal/dockerfile/docker-cms/docs/DEV_ENVIRONMENT_AND_RUNBOOK.md)**
   - Struktur direktori monorepo, variabel lingkungan (`.env.example`), panduan menjalankan service, dan pipeline CI/CD produksi.
6. **[docs/PANDUAN_PRESENTASI_INFRA.md](file:///home/rizal/dockerfile/docker-cms/docs/PANDUAN_PRESENTASI_INFRA.md)**
   - **Diagram Alur Visual & Panduan Presentasi**: Berisi infografis arsitektur lengkap beserta skrip/poin presentasi langkah-demi-langkah untuk dipresentasikan ke tim/kolega.
7. **[docs/QC_AND_PENTEST_REPORT.md](file:///home/rizal/dockerfile/docker-cms/docs/QC_AND_PENTEST_REPORT.md)**
   - **Laporan QC & Penetration Testing Lokal**: Hasil audit keamanan, mitigasi OWASP Top 10, pencegahan Traefik rule injection, dan verifikasi sandboxing kontainer.

---

## 🏗️ 5 Program Utama dalam Platform

| # | Nama Program | Stack Teknologi | Fungsi Utama |
| :- | :--- | :--- | :--- |
| **1** | **Admin Console** | **Laravel 11 + Filament (PHP 8.3)** | Panel SuperAdmin internal: kelola tenant, pengawasan utilisasi server/kontainer, kuota resource, dan billing. |
| **2** | **Dashboard CMS** | **Vue 3 + Vite + Pinia + Tailwind** | Panel studio pelanggan: editor konten visual modular (Tiptap), penyesuai tema, manajemen media S3, dan panel asisten AI. |
| **3** | **Orkestrator Provisioning** | **Golang 1.23+ (Gin/Fiber + Docker SDK)** | Pabrik kontainer otonom: deploy website tenant ke kontainer Docker terisolasi, injeksi routing Traefik, dan zero-downtime rolling update. |
| **4** | **Website Promosi** | **React 19 + TypeScript + Tailwind** | Halaman publik pemasaran berkonversi tinggi, playground demo interaktif, galeri tema, dan artikel blog SEO. |
| **5** | **Layanan AI Agent** | **Golang 1.23+ + n8n + LLM Engine** | Generator tema dari prompt teks, asisten penulisan & SEO, agregasi metrik Top-Views, serta otomatisasi webhook media sosial via n8n. |

---

## 🚀 Panduan Memulai Cepat (Quickstart)

Untuk menjalankan seluruh infrastruktur penunjang lokal (Traefik, PostgreSQL, Redis, Redpanda/Kafka, MinIO, n8n):

```bash
docker compose -f deploy/docker-compose.infra.yml up -d
```

Akses layanan lokal melalui browser:
- **Traefik Dashboard:** [http://localhost:8080](http://localhost:8080)
- **MinIO Object Console:** [http://localhost:9001](http://localhost:9001) *(User: `minioadmin` / Password: `minioadminpassword`)*
- **n8n Automation Console:** [http://localhost:5678](http://localhost:5678) *(User: `admin` / Password: `adminpassword`)*
- **PostgreSQL:** `localhost:5432` (`cloudcms_user` / `secret_postgres_password`)
- **Redis:** `localhost:6379` (`secret_redis_password`)
- **Redpanda (Kafka API):** `localhost:19092`
