# 📋 HeroCMS Enterprise: Master Roadmap, Granular Task Matrix & Service Architecture
> **Project Manager**: Paijo AI Agent (Lead Technical PM & System Architect)  
> **Status**: Living Production Blueprint (Tersinkronisasi dengan 5 Services + Mobile + Root Infra)  
> **Dokumen Pusat**: `docs/project-management/TASK_CHECKLIST.md`  
> **Prinsip Mutlak**: Zero Generic Slop, 100% Service-Mapped, Business-Driven SaaS, Strict Security First.

---

## 💼 Model Bisnis & Value Proposition HeroCMS

HeroCMS adalah **Platform Cloud CMS Multi-Tenant SaaS** yang menjual hosting kontainer mandiri otonom + Visual Block Studio + AI Copilot + Custom Domains.

### 4 Vertikal Bisnis Blueprint Utama (Tercermin di `ContainersModule.vue`):
1. **Toko Online & Retail UMKM (`business`)**: Etalase katalog produk, diskon flash-sale, checkout direct via WhatsApp, perhitungan ongkir ringkas.
2. **Portofolio Teknis & Agensi (`portfolio`)**: Showcase studi kasus, integrasi GitHub API, live cloud telemetry, CV interaktif.
3. **Blog Editorial & Media Digital (`blog`)**: Publikasi berita/artikel, sistem kategori & tag, mode fokus pembaca, monetisasi newsletter.
4. **Pusat Edukasi & Kursus LMS (`education`)**: Silabus kurikulum terstruktur, modul materi bacaan/video, registrasi murid.

### Skema Monetisasi Paket Langganan (`BillingPlanModule.vue`):
* **Starter / Free (Rp 0)**: 1 Kontainer, 0.25 vCPU, 128MB RAM, 1GB S3 Storage, Subdomain `*.herocms.id`.
* **Pro (Rp 149.000/bln)**: 3 Kontainer, 0.5 vCPU, 256MB RAM, 5GB S3 Storage, Custom Domain SSL, AI Copilot 500 prompts/bln.
* **Agency / Enterprise (Rp 499.000/bln)**: 10 Kontainer, 1.0 vCPU, 512MB RAM, 20GB S3 Storage, Whitelabel, Priority Support 24/7, Unlimited Webhooks.

---

## 🗺️ Matriks Pekerjaan Granular Berbasis Service & Menu

---

### MODUL 1: SITUS & KONTAINER DOCKER
*Komponen Frontend*: `services/02-dashboard-cms/src/components/dashboard/ContainersModule.vue` & `PodDetailAnalyticsView.vue`  
*Service Backend*: `services/03-provision-orchestrator` & `services/02-dashboard-cms/internal/`

| Task ID | Nama Pekerjaan & Spesifikasi Teknis | PIC | Service / Lokasi Kode | API Contract & Kriteria Selesai (DoD) | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TSK-CNT-01** | **UI Kontainer & Modal Pembuatan Situs**: Tampilan grid kartu pod, status badge (running/stopped/provisioning), modal blueprint selection, dan verifikasi ketersediaan subdomain. | **Irgi** | `02-dashboard-cms/.../ContainersModule.vue` | UI terhubung ke backend, form validasi subdomain reaktif, modal reset state. | `DONE` |
| **TSK-CNT-02** | **Go Docker SDK Container Lifecycle**: Pembuatan kontainer Docker mandiri tenant dengan parameter non-root UID 10001, cgroups memory 256MB, CPU 0.5. | **Andalusia** | `03-provision-orchestrator/internal/docker/` | `POST /api/v1/containers/provision`<br>Response `{ success: true, container_id, ip }`. Spawn < 4.5 detik. | `DONE` |
| **TSK-CNT-03** | **Skema Database `sites` & RLS Isolation**: Tabel sites dengan foreign key `tenant_id`, subdomain unik, status kontainer, dan RLS policy. | **Risqi** | `deploy/sql/01_schema_and_rls.sql` | `ALTER TABLE sites ENABLE ROW LEVEL SECURITY;`<br>Kueri antar-tenant 100% terisolasi. | `DONE` |
| **TSK-CNT-04** | **Traefik Dynamic Routing Injection**: Injeksi router rule `Host({subdomain}.herocms.id)` dan middleware TLS otomatis saat kontainer di-spawn. | **Rizal** | `03-provision-orchestrator/internal/traefik/` | Routing aktif instan tanpa restart Traefik. Sanitasi regex domain anti-injection. | `IN PROGRESS` |
| **TSK-CNT-05** | **Live Terminal Log Streaming**: Terminal interaktif untuk melihat log kontainer (stdout/stderr) dengan filter level (traffic, traefik, engine, docker, system). | **Andalusia** & **Irgi** | `02-dashboard-cms/cmd/server/` & `ContainersModule.vue` | `GET /api/v1/containers/:id/logs?tail=100`<br>WebSocket / SSE streaming logs. | `DONE` |
| **TSK-CNT-06** | **Container Emergency Controls (Restart & Maintenance)**: Tombol restart pod dengan drainage SIGTERM aman, serta saklar mode pemeliharaan. | **Andalusia** | `02-dashboard-cms/internal/handler/` | `POST /api/v1/containers/:id/restart`<br>`POST /api/v1/containers/:id/maintenance` | `DONE` |
| **TSK-CNT-07** | **Mobile Container Status & Quick Reboot**: Tampilan status kontainer di HP dan tombol reboot darurat. | **Tyno** | Mobile Companion App | Mengonsumsi endpoint restart dengan konfirmasi biometrik FaceID. | `TODO` |

---

### MODUL 2: VISUAL STUDIO BLOCK EDITOR
*Komponen Frontend*: `services/02-dashboard-cms/src/components/dashboard/VisualEditorModule.vue` & `TemplateLiveRenderer.vue`  
*Service Backend*: `services/02-dashboard-cms/internal/` & `services/05-ai-agent-service`

| Task ID | Nama Pekerjaan & Spesifikasi Teknis | PIC | Service / Lokasi Kode | API Contract & Kriteria Selesai (DoD) | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TSK-EDT-01** | **Drag-and-Drop Visual Block Builder**: Editor blok (Navbar, Hero, Features, Showcase, Pricing, CTA, Footer) dengan reorderable canvas dan live inspector. | **Irgi** | `02-dashboard-cms/.../VisualEditorModule.vue` | State blok tersimpan di Pinia store, drag and drop mulus 60 FPS. | `DONE` |
| **TSK-EDT-02** | **XSS Sanitization & DOMPurify**: Sanitasi konten HTML, script injection, dan payload berbahaya sebelum disimpan atau dirender ke preview. | **Rizal** & **Irgi** | `02-dashboard-cms/src/utils/sanitize.ts` | Zero script alert/XSS injection lolos uji pentest. | `DONE` |
| **TSK-EDT-03** | **Skema Basis Data `site_blocks` & Preset Storage**: Tabel penyimpanan susunan JSON blok website per tenant dan per halaman. | **Risqi** | `deploy/sql/01_schema_and_rls.sql` | Kolom `blocks_json JSONB`, foreign key `site_id`, indeks GIN untuk pencarian konten JSON. | `DONE` |
| **TSK-EDT-04** | **API Simpan & Publikasi Konfigurasi Blok**: Endpoint untuk menyimpan draft layout dan mempublikasikan versi live ke kontainer tenant. | **Andalusia** | `02-dashboard-cms/internal/handler/editor.go` | `PUT /api/v1/sites/:id/blocks` (Save Draft)<br>`POST /api/v1/sites/:id/publish` (Push to Container) | `IN PROGRESS` |
| **TSK-EDT-05** | **AI Block Content Generator (Copilot)**: Integrasi tombol "Bantu Tulis Konten AI" untuk headline hero, deskripsi produk, dan FAQ otomatis dari prompt teks. | **Andalusia** | `05-ai-agent-service/internal/llm/` | `POST /api/v1/ai/generate-block`<br>Stream SSE teks hasil generate dengan latensi TTFT < 800ms. | `TODO` |

---

### MODUL 3: MANAJEMEN ARTIKEL, HALAMAN & KONTEN CMS
*Komponen Frontend*: `services/02-dashboard-cms/src/components/dashboard/ContentArticlesModule.vue`  
*Service Backend*: `services/02-dashboard-cms/internal/`

| Task ID | Nama Pekerjaan & Spesifikasi Teknis | PIC | Service / Lokasi Kode | API Contract & Kriteria Selesai (DoD) | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TSK-CNT-01** | **Tabel Ledger Artikel & Halaman**: Daftar postingan, filter kategori, status (Published/Draft/Scheduled), badge views, dan pencarian instan. | **Irgi** | `02-dashboard-cms/.../ContentArticlesModule.vue` | Tampilan 2 baris standar UX `AGENTS.md`, filter reaktif, pagination. | `DONE` |
| **TSK-CNT-02** | **Mode Fokus Pembaca (Reader View)**: Antarmuka membaca konten bersih tanpa gangguan (*distraction-free*) dengan tombol kembali tunggal dan auto-collapse sidebar. | **Irgi** | `02-dashboard-cms/.../ContentArticlesModule.vue` | Sidebar navigasi otomatis kolaps, layout membaca lapang dan nyaman. | `DONE` |
| **TSK-CNT-03** | **Skema Database `posts` & `pages` Multi-Tenant**: Tabel artikel dengan slug unik per tenant, relasi kategori, status publikasi, dan SEO meta fields. | **Risqi** | `deploy/sql/01_schema_and_rls.sql` | RLS aktif: `tenant_id` mandatory, constraint unique `(tenant_id, slug)`. | `DONE` |
| **TSK-CNT-04** | **BFF CRUD API Artikel**: Endpoint pembuatan, edit draft, publikasi, dan penghapusan artikel dengan validasi slug otomatis. | **Andalusia** | `02-dashboard-cms/internal/handler/posts.go` | `GET /api/v1/posts`, `POST /api/v1/posts`, `PUT /api/v1/posts/:id`, `DELETE /api/v1/posts/:id`. | `IN PROGRESS` |
| **TSK-CNT-05** | **Mobile Quick Article Publisher**: Fitur menulis berita kilat atau pengumuman darurat langsung dari smartphone. | **Tyno** | Mobile Companion App | `POST /api/v1/mobile/quick-post` dengan offline queue saat sinyal lemah. | `TODO` |

---

### MODUL 4: PENYIMPANAN ASSET MEDIA S3 / MINIO
*Komponen Frontend*: `services/02-dashboard-cms/src/components/dashboard/MediaAssetsModule.vue`  
*Service Backend*: `services/02-dashboard-cms/internal/storage/` & MinIO

| Task ID | Nama Pekerjaan & Spesifikasi Teknis | PIC | Service / Lokasi Kode | API Contract & Kriteria Selesai (DoD) | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TSK-MED-01** | **Galeri Aset Media & Meteran Kuota**: Grid foto/dokumen, info ukuran file, status kuota S3 (misal: 1.2GB/5.0GB), dan preview modal. | **Irgi** | `02-dashboard-cms/.../MediaAssetsModule.vue` | Drag-and-drop uploader UI, copy URL instan, filter tipe file (image/doc/video). | `DONE` |
| **TSK-MED-02** | **Presigned URL Upload Engine & Sandboxing**: Pembuatan upload token presigned S3 agar file diunggah langsung ke MinIO tanpa membebani RAM backend. | **Andalusia** | `02-dashboard-cms/internal/storage/minio.go` | `POST /api/v1/media/presign-upload`<br>Isolasi folder: `bucket/tenants/{tenant_id}/assets/`. | `IN PROGRESS` |
| **TSK-MED-03** | **Skema Database `media_assets` & Quota Enforcement**: Tabel metadata aset (file size, mime type, s3 key) dan kalkulasi batas kuota plan. | **Risqi** | `deploy/sql/01_schema_and_rls.sql` | Trigger database atau kueri agregat `SUM(file_size)` untuk memblokir upload saat kuota habis. | `IN PROGRESS` |
| **TSK-MED-04** | **Mobile Direct Camera Upload**: Upload foto dokumentasi produk langsung dari kamera ponsel ke galeri media website. | **Tyno** | Mobile Companion App | Integrasi Image Picker + upload langsung via Presigned S3 URL. | `TODO` |
| **TSK-MED-05** | **Security Anti-Malware File Validation**: Validasi Magic Bytes (bukan hanya ekstensi file) untuk mencegah upload shell PHP/webshell berbahaya. | **Rizal** | `02-dashboard-cms/internal/storage/validator.go` | Blokir eksekusi file di S3 dengan header `Content-Disposition: attachment` & non-executable MIME. | `DONE` |

---

### MODUL 5: KATALOG TEMPLATE & BLUEPRINTS
*Komponen Frontend*: `services/02-dashboard-cms/src/components/dashboard/TemplatesCatalogModule.vue`  
*Service Backend*: `services/05-ai-agent-service`

| Task ID | Nama Pekerjaan & Spesifikasi Teknis | PIC | Service / Lokasi Kode | API Contract & Kriteria Selesai (DoD) | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TSK-TPL-01** | **UI Katalog Blueprint Template**: Galeri template (Retail Store, Tech Portfolio, Editorial, LMS), filter kategori, dan tombol instant clone ke kontainer. | **Irgi** | `02-dashboard-cms/.../TemplatesCatalogModule.vue` | Modal preview interaktif, badge kategori, tombol "Terapkan ke Situs". | `DONE` |
| **TSK-TPL-02** | **AI Theme & Template Generator**: Generator tema dari instruksi prompt teks menjadi struktur JSON blocks yang kompatibel dengan Visual Editor. | **Andalusia** | `05-ai-agent-service/internal/generator/` | `POST /api/v1/ai/generate-theme`<br>Payload JSON Schema tervalidasi 100%. | `IN PROGRESS` |
| **TSK-TPL-03** | **Template Seeding & Versioning**: Skema penyimpanan template global di PostgreSQL yang bisa dipakai bersama oleh semua tenant. | **Risqi** | `deploy/sql/01_schema_and_rls.sql` | Tabel `templates` (global read-only untuk tenant reguler, CRUD untuk superadmin). | `DONE` |

---

### MODUL 6: CUSTOM DOMAIN & OTOMASI DNS SSL
*Komponen Frontend*: `services/02-dashboard-cms/src/components/dashboard/CustomDomainsModule.vue`  
*Service Backend*: Traefik v3 & `services/02-dashboard-cms/internal/`

| Task ID | Nama Pekerjaan & Spesifikasi Teknis | PIC | Service / Lokasi Kode | API Contract & Kriteria Selesai (DoD) | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TSK-DOM-01** | **UI Manajemen Domain & Panduan DNS**: Tampilan tabel custom domain, status verifikasi (Pending/Verified/SSL Active), dan kartu instruksi CNAME/A record. | **Irgi** | `02-dashboard-cms/.../CustomDomainsModule.vue` | Form input domain, copy CNAME value, status polling live. | `DONE` |
| **TSK-DOM-02** | **DNS Verification Worker**: Background worker yang mengecek DNS propagation (kueri CNAME ke `edge.herocms.id`) sebelum mendaftarkan ke SSL. | **Andalusia** | `02-dashboard-cms/internal/service/dns.go` | `POST /api/v1/domains/verify`<br>Mengembalikan status propagasi IP/CNAME. | `IN PROGRESS` |
| **TSK-DOM-03** | **Traefik Dynamic Custom Domain Mapping**: Mendaftarkan custom domain tenant ke Traefik Ingress dengan automasi sertifikat Let's Encrypt TLS-ALPN-01/HTTP-01. | **Rizal** | Traefik Dynamic Config / Orchestrator | Sertifikat SSL otomatis terbit dalam < 10 detik setelah DNS verified. | `IN PROGRESS` |
| **TSK-DOM-04** | **Traefik Host Rule Injection Pentest**: Audit keamanan untuk memastikan input domain tidak bisa disusupi karakter *breakout* Traefik (CWE-20/93). | **Rizal** | `02-dashboard-cms/pentest/` | Regex validasi domain ketat: `^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$`. | `DONE` |

---

### MODUL 7: ANALITIK & TELEMETRI TRAFFIC REAL-TIME
*Komponen Frontend*: `services/02-dashboard-cms/src/components/dashboard/AnalyticsTelemetryModule.vue`  
*Service Backend*: `services/02-dashboard-cms/internal/redis/` & Redis 7

| Task ID | Nama Pekerjaan & Spesifikasi Teknis | PIC | Service / Lokasi Kode | API Contract & Kriteria Selesai (DoD) | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TSK-ANL-01** | **Dashboard Grafik Kunjungan & Top-Views**: Grafik kunjungan 7 hari, top 5 artikel terpopuler, live visitor counter, dan bandwidth tracker. | **Irgi** | `02-dashboard-cms/.../AnalyticsTelemetryModule.vue` | Komponen visual telemetri responsif, filter rentang tanggal. | `DONE` |
| **TSK-ANL-02** | **Redis Sorted Sets (ZSET) Counter (<1ms)**: Mesin perekam pageview real-time tanpa membebani disk PostgreSQL menggunakan `ZINCRBY`. | **Risqi** & **Andalusia** | `02-dashboard-cms/internal/redis/telemetry.go` | Latensi kueri < 1ms pada 10.000 req/detik. Kunci: `tenant:{id}:top_views`. | `DONE` |
| **TSK-ANL-03** | **Telemetry Ingestion Middleware**: Middleware pencatat hit anonim yang mengekstrak User-Agent, referer, dan IP hash tanpa melanggar privasi pengguna (GDPR-safe). | **Andalusia** | `02-dashboard-cms/internal/middleware/tracker.go` | Async push ke Redis queue tanpa menambah latency respon website. | `DONE` |
| **TSK-ANL-04** | **Mobile Real-time Telemetry Screen**: Layar telemetri di aplikasi HP pemilik website untuk melihat lonjakan pengunjung secara langsung. | **Tyno** | Mobile Companion App | Mengonsumsi endpoint ringkasan analitik harian via websocket/polling. | `TODO` |

---

### MODUL 8: WEBHOOKS, API TOKENS & SOCIAL MEDIA AUTOMATION
*Komponen Frontend*: `services/02-dashboard-cms/src/components/dashboard/WebhooksApiModule.vue`  
*Service Backend*: `services/05-ai-agent-service` & n8n

| Task ID | Nama Pekerjaan & Spesifikasi Teknis | PIC | Service / Lokasi Kode | API Contract & Kriteria Selesai (DoD) | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TSK-WBH-01** | **UI Manajemen Webhook & API Key**: Form penambahan endpoint webhook, pilihan event (`post.published`, `contact.received`, `container.alert`), dan generator API Token. | **Irgi** | `02-dashboard-cms/.../WebhooksApiModule.vue` | Copy secret key, trigger webhook test ping, riwayat log pengiriman. | `DONE` |
| **TSK-WBH-02** | **Anti-SSRF Safe Webhook Dispatcher**: Mesin pengirim HTTP POST webhook dengan validasi DNS dan pemblokiran IP internal (127.0.0.1, 10.0.0.0/8, 169.254.169.254). | **Rizal** & **Andalusia** | `02-dashboard-cms/internal/service/webhook.go` | Pencegahan SSRF 100% tervalidasi di suite pentest. Timeout 3 detik. | `IN PROGRESS` |
| **TSK-WBH-03** | **n8n Social Media Auto-Poster Workflow**: Otomatisasi publikasi rangkuman artikel baru ke Instagram, Facebook, dan Telegram menggunakan workflow n8n. | **Andalusia** | `services/05-ai-agent-service/workflows/` | Webhook diterima -> generate caption AI -> publish ke media sosial otomatis. | `IN PROGRESS` |

---

### MODUL 9 & 10: KAPASITAS PAKET (BILLING) & INVOICES
*Komponen Frontend*: `services/02-dashboard-cms/src/components/dashboard/BillingPlanModule.vue` & `InvoicesHistoryModule.vue`  
*Service Backend*: `services/01-admin-console` (Laravel 11 Filament) & Midtrans/Xendit

| Task ID | Nama Pekerjaan & Spesifikasi Teknis | PIC | Service / Lokasi Kode | API Contract & Kriteria Selesai (DoD) | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TSK-BIL-01** | **UI Paket Langganan & Riwayat Faktur**: Tabel perbandingan fitur paket (Starter, Pro, Enterprise), gauge pemakaian kuota kontainer, dan tabel riwayat invoice PDF. | **Irgi** | `02-dashboard-cms/.../BillingPlanModule.vue` | Tampilan status lunas/pending, tombol upgrade plan, download invoice. | `DONE` |
| **TSK-BIL-02** | **Payment Gateway Integration (Midtrans/Xendit)**: Pembuatan Snap Token transaksi, webhook notifikasi pembayaran lunas, dan auto-upgrade kuota tenant. | **Andalusia** | `01-admin-console/app/Http/Controllers/Billing/` | `POST /api/v1/billing/checkout`<br>Webhook `POST /api/v1/billing/notification` tervalidasi signature. | `IN PROGRESS` |
| **TSK-BIL-03** | **Skema Database `subscriptions` & `invoices`**: Tabel pencatatan periode aktif langganan, tanggal jatuh tempo, dan riwayat tagihan. | **Risqi** | `deploy/sql/01_schema_and_rls.sql` | Relasi tenant ke plan, trigger masa kadaluarsa (auto suspend container jika telat bayar 7 hari). | `DONE` |
| **TSK-BIL-04** | **Push Notification Tagihan & Kuota Mendekati Limit**: Notifikasi otomatis ke aplikasi mobile pemilik web saat kuota kontainer tersisa 10% atau invoice terbit. | **Tyno** | Mobile Companion App | Integrasi Firebase Cloud Messaging (FCM) dengan deep link ke menu bayar. | `TODO` |

---

### MODUL 11 & 12: TIKET SUPPORT & CHANGELOG SISTEM
*Komponen Frontend*: `services/02-dashboard-cms/src/components/dashboard/SupportTicketingModule.vue` & `ChangelogModule.vue`

| Task ID | Nama Pekerjaan & Spesifikasi Teknis | PIC | Service / Lokasi Kode | API Contract & Kriteria Selesai (DoD) | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TSK-SUP-01** | **UI Tiket Bantuan & Pelacakan SLA**: Form pengajuan keluhan, pilihan tingkat urgensi (Normal, High, Urgent), riwayat percakapan dengan tim support. | **Irgi** | `02-dashboard-cms/.../SupportTicketingModule.vue` | Badge status tiket (Open, In Progress, Resolved), lampiran tangkapan layar. | `DONE` |
| **TSK-SUP-02** | **Admin Helpdesk Resolver (Laravel Filament)**: Dashboard internal untuk tim admin membalas tiket support dan melihat status kontainer pelapor. | **Andalusia** | `services/01-admin-console` | Notifikasi email/webhook ke pelanggan saat tiket dijawab. | `IN PROGRESS` |
| **TSK-CHG-01** | **Changelog Modul & SemVer Governance**: Halaman catatan rilis publik dengan filter tipe perubahan (Feature, Fix, Improvement, Security) dan shortcut keyboard CMD+K. | **Irgi** & **Paijo AI** | `02-dashboard-cms/.../ChangelogModule.vue` & `changelog.ts` | Tersinkronisasi otomatis dengan aturan SemVer `AGENTS.md`. | `DONE` |

---

### MODUL 13 & 14: WEBSITE PEMASARAN & PENTEST OTOMASI CI/CD
*Service*: `services/04-marketing-site` & `.github/workflows/`

| Task ID | Nama Pekerjaan & Spesifikasi Teknis | PIC | Service / Lokasi Kode | API Contract & Kriteria Selesai (DoD) | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TSK-MKT-01** | **Landing Page Berkonversi Tinggi (React 19)**: Hero headline memikat, demo playground interaktif, kalkulator harga, dan form pendaftaran instan. | **Irgi** | `services/04-marketing-site/src/` | LCP < 1.2 detik, SEO meta tags, responsif sempurna di perangkat mobile. | `DONE` |
| **TSK-OPS-03** | **Pre-Commit Pentest Runner & CI/CD Gate**: Otomasi eksekusi pentest per-service pada GitHub Actions sebelum pull request diizinkan merge ke main. | **Rizal** | `.github/workflows/docker-image.yml` | 100% PASS pada suite `services/*/pentest/...`. Build multi-arch image otomatis. | `IN PROGRESS` |

---

## 🔄 Standar Log Pelaporan Tim ke Paijo AI Agent

Setiap kali melaporkan progres atau hasil pengerjaan, gunakan nomor Task ID dari tabel di atas:

```markdown
Lapor Paijo:
- Task ID: [Contoh: TSK-CNT-04]
- PIC: [Nama Anda / Anggota Tim]
- Status: [Done / In Progress / Blocked]
- Service: [02-dashboard-cms / 03-provision-orchestrator / dll]
- Bukti Teknis: [Commit hash, file link, output pengujian]
- Catatan Integrasi: [Dependensi API ke anggota lain jika ada]
```
