# 📋 HeroCMS Enterprise Roadmap & Team Task Checklist
> **Project Manager**: Paijo AI Agent (Lead Technical PM & System Architect)  
> **Status**: Living Document (Updated via Git on every team report)  
> **Repository Single Source of Truth**: `docs/project-management/TASK_CHECKLIST.md`  
> **Prinsip Utama**: Zero Slop, Strict Security First, Microservice Resiliency, Measurable Business ROI.

---

## 👥 Roster Tim HeroCMS & Matriks Penugasan

| Nama Anggota | Posisi / Spesialisasi | Fokus Service & Tanggung Jawab Utama | Rekan Kolaborasi Utama |
| :--- | :--- | :--- | :--- |
| **Andalusia** | **Full Stack Engineer** | Go Orchestrator (`03`), BFF Go (`02`), Laravel Admin (`01`), Core Integration | Irgi (Frontend), Risqi (DB), Tyno (API contract) |
| **Irgi** | **Frontend Web Specialist** | Dashboard Studio Vue 3 (`02`), Marketing Site React 19 (`04`), UI/UX & Design System | Andalusia (BFF), Rizal (Web Vitals/Build) |
| **Risqi** | **Database Management** | PostgreSQL 16 (RLS multi-tenancy), Redis 7 (Sorted Sets), MinIO S3, Migrasi & Backup | Andalusia (Query/Schema), Rizal (DB Infra) |
| **Rizal** | **DevOps & Security Specialist** | Traefik v3, cgroups Sandboxing, Network Isolation, CI/CD, Pentest Automated Suite | Seluruh Tim (Deployment & Security Gate) |
| **Tyno** | **Mobile Frontend Specialist** | HeroCMS Companion App (iOS/Android): Telemetri, Push Notif, Quick Draft, Emergency Control | Andalusia (API Endpoint / Webhook) |
| **Paijo AI Agent** | **Project Manager & Architect** | Task Checklist, Quality & Security Audit, SemVer Changelog, Sprint Coordination | Seluruh Tim |

---

## 1. ⚙️ Divisi Backend & Fullstack (PIC: Andalusia)
**Fokus**: Orkestrasi kontainer mandiri via Go Docker SDK, arsitektur API BFF, sistem billing langganan, dan pembuatan kontrak API untuk Web & Mobile.

- [x] **Core Provisioning Engine**: Integrasi Go Docker Engine SDK untuk deploy kontainer tenant mandiri (`services/03-provision-orchestrator`).
- [ ] **Dynamic Traefik Rule Generator**: Generator konfigurasi label Traefik v3 otomatis saat kontainer di-spawn tanpa restart proxy. *(Kolaborasi: Rizal)*
- [ ] **Contract-First API Specs**: Pembuatan skema OpenAPI 3.0 / Swagger endpoint BFF untuk konsumsi Irgi (Web) dan Tyno (Mobile).
- [ ] **Admin Console Billing & Tenant Lifecycle**: Modul subscription, paket kuota (Free, Pro, Enterprise), dan webhook payment gateway di Laravel 11 (`services/01-admin-console`).
- [ ] **Idempotent Webhook Dispatcher**: Antrean pesan asinkron via Redpanda/Redis untuk webhook media sosial dan n8n automation.
- [ ] **Graceful Degradation & Health Circuit Breaker**: Mekanisme auto-restart dan eviksi otomatis jika kontainer tenant mengalami status *unhealthy*.

---

## 2. 🎨 Divisi Frontend Web (PIC: Irgi | Support: Andalusia)
**Fokus**: Antarmuka Dashboard Studio Vue 3, Visual Block Editor, landing page marketing React 19, dan penegakan Design System (`DESIGN.md` & `studio-master.css`).

- [x] **Bespoke Enterprise Design System**: Arsitektur token warna Slate/Royal Blue di `studio-master.css` (`services/02-dashboard-cms`).
- [x] **Modular Lazy-Loading**: Penerapan `defineAsyncComponent` untuk pemisahan bundle menu dashboard.
- [ ] **Interactive Visual Block Editor**: Drag-and-drop live preview builder dengan sanitasi HTML (DOMPurify).
- [ ] **Reader View & Distraction-Free Mode**: Header navigasi tunggal dan auto-collapse sidebar saat mengedit artikel panjang.
- [ ] **Marketing Site High-Conversion Funnel**: Playground interaktif, katalog tema, pricing calculator di React 19 (`services/04-marketing-site`).
- [ ] **Web Performance Tuning**: Optimasi LCP < 1.2 detik, CLS 0, dan vendor splitting manual chunks di Vite. *(Kolaborasi: Rizal)*

---

## 3. 🗄️ Divisi Database Management (PIC: Risqi)
**Fokus**: Isolasi data multi-tenant (RLS), performa agregasi telemetry < 1ms, disaster recovery, dan integrasi storage S3/MinIO.

- [x] **PostgreSQL Row-Level Security (RLS)**: Isolasi tabel `sites`, `posts`, `assets` berdasarkan `app.current_tenant_id`.
- [x] **Telemetry Top-Views Cache**: Agregasi traffic real-time menggunakan Redis 7 Sorted Sets (ZSET) latensi < 1ms.
- [ ] **Zero-Downtime Migration Pipeline**: Standar skrip migrasi SQL maju/mundur (Up & Down migrations).
- [ ] **Automated Backup & PITR**: Snapshot otomatis basis data harian + Point-In-Time Recovery ke MinIO/S3 cold storage. *(Kolaborasi: Rizal)*
- [ ] **Database Connection Pooling**: Konfigurasi PgBouncer untuk menangani 1.000+ koneksi simultan dari microservice.
- [ ] **Tenant Asset S3 Lifecycle Policies**: Pengaturan kuota storage, presigned URLs, dan auto-cleanup file orphaned pada MinIO.

---

## 4. 🚀 Divisi DevOps & Cloud Infrastructure (PIC: Rizal)
**Fokus**: Edge Ingress Traefik v3, sandboxing kontainer Linux cgroups v2, multi-network isolation, dan pipeline CI/CD otomatis.

- [x] **Multi-Network Docker Topology**: Pemisahan `edge-network`, `infra-network`, dan `tenant-isolated-network`.
- [x] **Traefik v3 Edge Ingress**: Otomatisasi sertifikat TLS Let's Encrypt dan dynamic wildcard routing `*.herocms.id`.
- [ ] **Linux cgroups v2 Hard-Limit Enforcer**: Pembatasan ketat 0.5 vCPU, 256MB RAM, dan read-only rootfs per kontainer tenant.
- [ ] **Production CI/CD Gate**: Pipeline GitHub Actions untuk linting, build multi-arch, dan audit pentest wajib sebelum merge ke `main`.
- [ ] **Observability Stack**: Setup Prometheus, Grafana, dan Loki untuk monitoring utilisasi CPU/RAM cluster server secara real-time.
- [ ] **Disaster Failover Runbook**: SOP pemulihan otomatis saat node host mati atau kapasitas disk storage > 85%.

---

## 5. 🛡️ Divisi Security & Pentesting (PIC: Rizal)
**Fokus**: Pengerasan sistem (*hardening*), mitigasi OWASP Top 10, Traefik Rule Injection, dan sertifikasi kelayakan rilis.

- [x] **Automated Go Pentest Suite**: Pengujian keamanan black-box HTTP per-service di `services/*/pentest/...`.
- [x] **Traefik Rule Injection Guard (CWE-20/93)**: Sanitasi regex karakter domain sebelum disuntikkan ke router label.
- [ ] **JWT Key Rotation & Secure Session**: Implementasi asymmetric signing (ED25519) dengan fingerprint refresh token. *(Kolaborasi: Andalusia)*
- [ ] **Anti-SSRF Webhook Proxy**: Proteksi request keluar dari kontainer tenant agar tidak bisa membidik IP internal (`127.0.0.1`, `10.0.0.0/8`, metadata cloud).
- [ ] **Strict Content Security Policy (CSP)**: Header CSP level 3 untuk mencegah injeksi skrip berbahaya pada custom domain tenant.
- [ ] **Pre-Release Penetration Testing**: Audit kepatuhan berkala sebelum rilis versi Major/Minor ke publik.

---

## 6. 📱 Divisi Mobile Frontend Engineering (PIC: Tyno)
**Fokus**: Membangun **HeroCMS Companion App** (iOS & Android) untuk telemetri bisnis, notifikasi kritis, dan aksi cepat pemilik website.
> *Catatan Kritis Paijo AI*: Tyno fokus 100% pada mobile companion, bukan membuat drag-and-drop page builder di HP. Tyno berhak meminta spesifikasi API OpenAPI yang rapi dari Andalusia!

- [ ] **Authentication & Tenant Switcher**: Login biometrik (FaceID/Fingerprint), multi-site switcher, dan refresh token offline.
- [ ] **Real-time Telemetry Dashboard**: Grafik kunjungan hari ini, top articles, bounce rate, dan status uptime kontainer via WebSocket/SSE.
- [ ] **Push Notification Engine**: Notifikasi instan saat: formulir kontak/leads masuk, kuota bandwidth mendekati 90%, atau kontainer crash.
- [ ] **Quick Content Publisher**: Editor tulisan cepat (Markdown/Rich text sederhana), upload foto langsung dari kamera HP ke S3.
- [ ] **Emergency Site Controls**: Tombol *Maintenance Mode Toggle*, *Purge Cache*, dan *Restart Container* langsung dari genggaman.

---

## 🔄 Format Pelaporan Tim ke Paijo AI Agent

Kapan pun ada update pekerjaan, laporkan ke Paijo dengan format:
```markdown
Lapor Paijo:
- PIC: [Andalusia / Irgi / Risqi / Rizal / Tyno]
- Modul/Task: [Contoh: Contract-First API Specs]
- Status: [Done / In Progress / Blocked]
- Bukti/Output: [File link, PR/commit, hasil go test / npm build]
- Blocker/Catatan: [Masalah integrasi atau dependensi tim lain]
```
Paijo akan memverifikasi hasil kerja secara kritis, mengupdate checkbox `[x]`, dan mengawal rilis versi di Git.
