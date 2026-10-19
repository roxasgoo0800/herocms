# 📚 Buku Panduan Induk, Kamus Arsitektur & SOP Pengerjaan HeroCMS
> **Dokumen Resmi Platform HeroCMS Enterprise**  
> **Project Management & System Architecture**: Paijo AI Agent  
> **Target Audience**: Seluruh Anggota Tim (Andalusia, Irgi, Risqi, Rizal, Tyno) dan AI Agent  
> **Lokasi File**: `docs/KAMUS_DAN_SOP_HEROCMS.md`

---

## 1. 📖 Kamus Istilah & Glosarium Arsitektur (Platform Dictionary)

Dokumen ini menjadi "kamus bersama" agar seluruh anggota tim berbicara dalam istilah teknis yang seragam:

### A - D
* **Autonomous Container Provisioning**: Proses di mana sistem (`services/03-provision-orchestrator`) secara otomatis membuat kontainer Docker baru dalam hitungan detik saat pelanggan mendaftar, tanpa perlu admin manual mengetik perintah `docker run`.
* **Backend-For-Frontend (BFF)**: Pola perancangan backend di mana API (`services/02-dashboard-cms` server Go) dioptimalkan khusus untuk memenuhi kebutuhan rendering antarmuka frontend (Vue 3 dan Mobile App).
* **Bespoke Enterprise Design System**: Sistem desain antarmuka HeroCMS berbasis token warna Deep Slate (`#0f172a`), Royal Blue (`#2563eb`), Inter font, dan Master CSS (`studio-master.css`) dengan prinsip *Zero-CSS Duplication*.
* **cgroups v2 (Control Groups)**: Fitur kernel Linux untuk membatasi pemakaian CPU (0.5 vCPU) dan RAM (256MB) setiap kontainer website tenant agar tidak menghabiskan kapasitas server host.

### E - P
* **Edge Ingress Proxy**: Pintu gerbang utama (Traefik v3) yang menerima seluruh lalu lintas dari internet, menangani sertifikat SSL/TLS otomatis, dan meneruskan request ke kontainer tenant yang tepat.
* **Idempotent Webhook**: Desain endpoint webhook yang aman dieksekusi berulang kali tanpa menyebabkan data ganda atau duplikasi aksi.
* **Multi-Network Docker Isolation**: Topologi jaringan di mana kontainer dibagi ke dalam jaringan terpisah: `edge-network` (terbuka ke publik), `infra-network` (database & redis), dan `tenant-isolated-network` (tertutup dari luar).
* **Point-In-Time Recovery (PITR)**: Kemampuan memulihkan basis data PostgreSQL ke titik detik tertentu sebelum terjadi bencana atau kesalahan fatal.

### R - Z
* **Row-Level Security (RLS)**: Fitur keamanan di level basis data PostgreSQL yang mengisolasi data tabel berdasarkan `app.current_tenant_id` sehingga penyewa A tidak akan pernah bisa membaca atau mengubah data penyewa B.
* **Single-Binary Mode**: Model deployment di mana file statis antarmuka Vue 3 dikompilasi langsung ke dalam executable binary Go menggunakan Go `embed.FS`, sehingga cukup menjalankan satu binary mandiri di port 8085.
* **Traefik Dynamic Labels**: Mekanisme pembacaan label Docker secara real-time oleh Traefik untuk mendaftarkan rute domain baru tanpa perlu me-restart reverse proxy.
* **Top-Views Sorted Sets (ZSET)**: Struktur data Redis yang menyimpan peringkat artikel atau website terpopuler dengan operasi penambahan dan pembacaan waktu cepat (< 1ms).

---

## 2. 👥 Matriks Tanggung Jawab Anggota Tim

| Nama Petugas | Posisi | Fokus Service | Tugas Utama |
| :--- | :--- | :--- | :--- |
| **Andalusia** | **Full Stack Lead** | `01-admin-console`, `02-dashboard-cms`, `03-provision-orchestrator` | Integrasi Go Docker SDK, arsitektur API BFF, sistem billing Laravel 11, dan penyusunan kontrak OpenAPI untuk tim Web & Mobile. |
| **Irgi** | **Frontend Web Specialist** | `02-dashboard-cms`, `04-marketing-site` | Implementasi antarmuka Studio Vue 3, Visual Drag-and-Drop Builder, penegakan `studio-master.css`, dan optimasi Core Web Vitals (LCP < 1.2s). |
| **Risqi** | **Database Management** | PostgreSQL 16, Redis 7, MinIO S3 | Desain skema multi-tenant, penegakan RLS, skrip migrasi up/down, connection pooling PgBouncer, dan disaster recovery PITR. |
| **Rizal** | **DevOps & Security Lead** | Traefik v3, Docker Host, CI/CD, Pentest | Pengerasan kontainer (cgroups v2, non-root UID 10001), isolasi jaringan, pipeline CI/CD GitHub Actions, dan eksekusi pentest runner sebelum PR. |
| **Tyno** | **Mobile Frontend Specialist** | HeroCMS Companion App (iOS/Android) | Pembangunan aplikasi pendamping mobile: analitik kunjungan real-time, push notification leads/kuota, dan tombol darurat kendali situs. |
| **Paijo AI Agent** | **Project Manager & Architect** | Repository Governance & Quality Gate | Pemantauan checklist task, audit kelayakan kode/arsitektur, pengawalan SemVer changelog, dan sinkronisasi antartim. |

---

## 3. 🛠️ Standar Operasional Prosedur (SOP) Teknis

### [SOP-01] Standar Penulisan & Integrasi API (PIC: Andalusia)
1. Setiap endpoint baru harus dirancang dengan pendekatan *Contract-First*: buat spesifikasi OpenAPI/Swagger terlebih dahulu.
2. Endpoint harus mengembalikan struktur JSON terstandarisasi:
   ```json
   {
     "success": true,
     "data": { ... },
     "message": "Data berhasil dimuat",
     "error": null
   }
   ```
3. Seluruh parameter dinamis wajib divalidasi dan disanitasi sebelum diproses ke database.

### [SOP-02] Standar Pengembangan Antarmuka Frontend (PIC: Irgi)
1. **Mandat Zero-CSS Duplication**: Sebelum menulis class CSS baru, wajib mengecek [studio-master.css](file:///Users/rizalfahmi/Documents/React/herocms/services/02-dashboard-cms/src/assets/studio-master.css). Gunakan class yang sudah ada (`.btn-top-create`, `.search-box`, `.telemetry-card`, dll).
2. **Pemisahan File Data Statis**: Data array statis dilarang ditaruh di dalam berkas `.vue`, wajib diimpor dari folder `src/data/*.ts`.
3. **Lazy Loading**: Setiap menu utama di `DashboardView.vue` wajib dimuat secara modular menggunakan `defineAsyncComponent`.

### [SOP-03] Standar Pengelolaan Basis Data & RLS (PIC: Risqi)
1. Setiap tabel yang menampung data milik pengguna/tenant wajib memiliki kolom:
   `tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE`
2. Wajib mengaktifkan RLS (`ALTER TABLE <nama_tabel> ENABLE ROW LEVEL SECURITY;`).
3. Dilarang menjalankan skrip migrasi di server produksi tanpa melakukan uji *rollback* (*down migration*) di lingkungan staging terlebih dahulu.
4. Setiap snapshot backup harian harus diverifikasi integritasnya ke MinIO/S3 cold storage.

### [SOP-04] Standar Pengerasan Kontainer & Edge Proxy (PIC: Rizal)
1. Setiap kontainer tenant yang di-spawn oleh orchestrator wajib mengunci parameter:
   - User non-root: `UID 10001:10001`
   - Filesystem: `ReadonlyRootfs = true` (kecuali folder `/tmp` dan volume upload terisolasi)
   - Batas RAM: `256MB`
   - Batas CPU: `0.5 vCPU`
2. Nama subdomain tenant wajib divalidasi dengan regex ketat `^[a-z0-9-]+$` untuk mencegah *Traefik Router Rule Injection*.

### [SOP-05] Standar Uji Penetrasi Mandatori Pre-Commit (PIC: Rizal)
1. Sebelum melakukan `git commit` atau `git push`, wajib mengeksekusi rangkaian pengujian penetrasi:
   `cd services/<service_name> && go test -v ./pentest/...`
2. Seluruh tes wajib berstatus `PASS` (atau `SKIP` jika servis lokal belum berjalan).
3. PR tidak boleh di-merge jika terdapat celah keamanan yang belum terselesaikan.

### [SOP-06] Standar Aplikasi Mobile Companion (PIC: Tyno)
1. Tyno berfokus pada aplikasi pendamping *real-time* yang cepat, bukan editor layout visual yang berat.
2. Manfaatkan penyimpanan lokal (*offline-first*) untuk menyimpan snapshot analitik terakhir pengguna.
3. Gunakan integrasi Push Notification Firebase (FCM) untuk peringatan mendesak.

### [SOP-07] Standar Pelaporan ke Paijo AI Agent
1. Setiap progress atau kendala dilaporkan menggunakan format:
   ```markdown
   Lapor Paijo:
   - PIC: [Andalusia / Irgi / Risqi / Rizal / Tyno]
   - Modul/Task: [Nama Fitur]
   - Status: [Done / In Progress / Blocked]
   - Bukti: [Path file / commit hash / hasil test]
   - Kendala: [Jika ada]
   ```
2. Paijo AI Agent akan memverifikasi hasil kerja, memperbarui checklist di Git, dan menaikkan nomor versi SemVer di `changelog.ts`.

---

## 4. 📊 LOG Hasil Pengerjaan & Pemetaan 12 Modul Studio ke Microservices

Berikut adalah log status pengerjaan saat ini serta dependensi integrasi antar-service untuk mewujudkan fungsionalitas bisnis:

| # | Nama Modul Studio | Komponen Frontend (`02-dashboard-cms`) | Backend & Service Pendukung | Status Frontend | Status Backend / DB | Langkah Integrasi Berikutnya |
| :- | :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | **Situs & Kontainer** | `ContainersModule.vue` & `PodDetailAnalyticsView.vue` | `03-provision-orchestrator` (Go Docker SDK) | `DONE` (Full UI & logs terminal) | `DONE` (Core spawn ready) | Finalisasi dynamic Traefik rule injection saat spawn (`TSK-CNT-04`). |
| **2** | **Editor Studio Visual**| `VisualEditorModule.vue` & `TemplateLiveRenderer.vue` | `02-dashboard-cms` (Go BFF) & `05-ai-agent-service` | `DONE` (Drag-drop blocks & preview) | `IN PROGRESS` (Save blocks API) | Wiring endpoint `PUT /api/v1/sites/:id/blocks` & AI Copilot prompt generator (`TSK-EDT-04`). |
| **3** | **Artikel & Halaman** | `ContentArticlesModule.vue` | `02-dashboard-cms` (Go BFF) & PostgreSQL 16 | `DONE` (Ledger table & Reader view) | `IN PROGRESS` (CRUD handlers) | Sambungkan fetch API artikel ke Go BFF repository (`TSK-ART-04`). |
| **4** | **Media Assets (S3)** | `MediaAssetsModule.vue` | `02-dashboard-cms` (Go storage) & MinIO | `DONE` (Grid view & meteran kuota) | `IN PROGRESS` (Presigned URLs) | Uji coba upload file langsung via S3 presigned PUT URL (`TSK-MED-02`). |
| **5** | **Katalog Template** | `TemplatesCatalogModule.vue` | `05-ai-agent-service` (LLM Engine) | `DONE` (Blueprint selector & preview) | `IN PROGRESS` (AI theme generator) | Sinkronisasi template blueprints JSON schema ke kontainer tenant (`TSK-TPL-02`). |
| **6** | **Custom Domain & DNS**| `CustomDomainsModule.vue` | Traefik v3 Edge Ingress | `DONE` (Tabel status & CNAME guide) | `IN PROGRESS` (DNS worker) | Worker pengecekan propagasi DNS CNAME otomatis (`TSK-DOM-02`). |
| **7** | **Analitik & Telemetri**| `AnalyticsTelemetryModule.vue`| Redis 7 (`ZSET`) & Go Middleware | `DONE` (Grafik chart & top views) | `DONE` (ZSET latency < 1ms) | Integrasi middleware tracker ke rute publik website tenant (`TSK-ANL-03`). |
| **8** | **Webhooks & API** | `WebhooksApiModule.vue` | `05-ai-agent-service` & n8n engine | `DONE` (Webhook list & token generator) | `IN PROGRESS` (Anti-SSRF dispatcher) | Uji coba anti-SSRF guard pada outbound HTTP request (`TSK-WBH-02`). |
| **9** | **Kapasitas & Paket** | `BillingPlanModule.vue` | `01-admin-console` (Laravel 11) | `DONE` (Plan comparison & quota gauge) | `IN PROGRESS` (Midtrans gateway) | Integrasi Snap Token Midtrans/Xendit untuk auto-upgrade (`TSK-BIL-02`). |
| **10**| **Faktur & Invoice** | `InvoicesHistoryModule.vue` | `01-admin-console` (Laravel 11) | `DONE` (Tabel invoice & download UI) | `DONE` (Skema database siap) | Endpoint generate PDF invoice otomatis (`TSK-BIL-03`). |
| **11**| **Tiket Support** | `SupportTicketingModule.vue` | `01-admin-console` (Filament Admin) | `DONE` (Tiket submission & SLA badge) | `IN PROGRESS` (Filament resource) | Modul balasan tiket dari SuperAdmin Filament (`TSK-SUP-02`). |
| **12**| **Changelog & Rilis** | `ChangelogModule.vue` | `src/data/changelog.ts` & SemVer Engine | `DONE` (Interactive timeline & search) | `DONE` (SemVer script aktif) | Pemeliharaan berkala catatan rilis via Paijo AI Agent (`TSK-CHG-01`). |

---

## 5. 🔌 Katalog Spesifikasi Kontrak API Inti (BFF & Microservices)

Seluruh komunikasi antarmuka (Web Studio & Mobile Companion) mengacu pada kontrak API berikut:

### A. Autentikasi & Profil Tenant (`/api/v1/auth`)
* `POST /api/v1/auth/login`: Menerima `{ email, password }`. Mengembalikan `{ token, refreshToken, tenant: { id, name, plan } }`.
* `POST /api/v1/auth/refresh`: Refresh token session dengan proteksi rotasi token.

### B. Manajemen Kontainer (`/api/v1/containers`)
* `GET /api/v1/containers`: Mengambil daftar kontainer milik tenant aktif (disaring oleh RLS).
* `POST /api/v1/containers/provision`: Menerima `{ subdomain, category, templateId }`. Men-trigger orchestrator Go Docker SDK.
* `POST /api/v1/containers/:id/restart`: Restart kontainer pod dengan drainage sinyal SIGTERM.
* `GET /api/v1/containers/:id/logs`: Mengambil log container real-time (query: `tail`, `level`).

### C. Editor & Blok Konten (`/api/v1/sites/:id/blocks`)
* `GET /api/v1/sites/:id/blocks`: Mengambil susunan blok aktif untuk live preview.
* `PUT /api/v1/sites/:id/blocks`: Menyimpan draft blok (`{ blocks: VisualBlock[] }`).
* `POST /api/v1/sites/:id/publish`: Mempublikasikan blok ke kontainer web tenant dan membersihkan cache.

### D. Aset Media S3 (`/api/v1/media`)
* `POST /api/v1/media/presign-upload`: Menerima `{ fileName, fileSize, mimeType }`. Mengembalikan presigned PUT URL dari MinIO/S3.
* `GET /api/v1/media`: Mengambil daftar aset media dan kalkulasi kuota pemakaian.

### E. Telemetri Real-Time (`/api/v1/telemetry`)
* `GET /api/v1/telemetry/overview`: Mengambil ringkasan kunjungan 7 hari terakhir, total hits, dan bandwidth.
* `GET /api/v1/telemetry/top-views`: Membaca Redis ZSET ranking artikel terpopuler (< 1ms).

