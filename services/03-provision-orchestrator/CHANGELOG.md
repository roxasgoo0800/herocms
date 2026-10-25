# HeroCMS Provision Orchestrator (Service 03) - Changelog & System Log

Dokumen ini memuat catatan riwayat perubahan versi (*Changelog*) dan buku catatan audit operasional sistem (*System Log & Operational Audit Trail*) untuk **Service 03: Provision Orchestrator**.

---

## 📑 1. Daftar Riwayat Rilis (Release Ledger)

### [03-orchestrator-v1.2.0] - 25 Oktober 2026
**Tipe Rilis**: Minor / Feature Release (Dynamic Multi-Theme Template Seeding & Live Storage HTML Sync)  
**Status**: Production Ready & Stable  
**PIC Tim**: Rizal (Security & DevOps Lead), Andalusia (Full Stack Lead), Paijo (QA/QC Lead)

#### 🌟 Ringkasan Rilis
1. **Dynamic Website Generator (`GenerateWebsiteHTML`)**:
   - Menghadirkan engine generator HTML (`internal/storage/generator.go`) yang mampu menghasilkan struktur web lengkap, interaktif, dan responsif sesuai kategori tema yang dipilih pengguna:
     - **Toko Online / Retail / E-Commerce**: Navigasi store, banner hero, statistik pesanan & respon CS, katalog produk dengan harga rupiah & diskon, jaminan garansi/COD/QRIS, serta tombol order WhatsApp instan.
     - **Portofolio Teknis & Insinyur**: Monogram avatar, status ketersediaan kerja, headline spesialisasi, chips tech-stack (Go, Docker, Traefik, dsb.), dan kartu showcase proyek dengan metrik performa.
     - **Media Editorial & Blog**: Masthead berita, artikel unggulan mingguan dengan estimasi waktu baca, grid tulisan teknis, dan formulir pendaftaran buletin (newsletter).
     - **Pusat Edukasi & LMS**: Header akademi, kurikulum bertingkat (pemula, menengah, lanjutan), statistik modul/alumni, dan kartu kursus dengan review bintang serta silabus.
2. **Template Seeding Otomatis pada Deploy Kontainer**:
   - Menambahkan field `site_name`, `template_name`, `category`, `role_headline`, `bio_intro`, `accent_color`, dan `custom_html` pada `DeployRequest` (`internal/api/router.go`) dan `TenantDeployParams` (`internal/docker/provisioner.go`).
   - Secara otomatis menyemai file `public/index.html` dan `public/index.html.live` di direktori storage kontainer tenant saat pembuatan awal pod baru.
3. **Endpoint Sinkronisasi HTML Kontainer (`PUT /api/v1/containers/:id/html`)**:
   - Menyediakan endpoint langsung untuk memperbarui konten HTML situs tenant di storage persistensinya secara instan tanpa perlu mematikan atau me-restart kontainer.
4. **Verifikasi Keamanan & Black-Box Pentest**:
   - 100% lulus suite pengujian penetrasi keamanan (`go test -v ./pentest/...`), memastikan isolasi traversal direktori (`SanitizeTenantID`), sanitasi injeksi router Traefik, dan penjagaan token secret internal (`InternalSecretGuard`).

---

### [03-orchestrator-v1.1.1] - 25 Oktober 2026
**Tipe Rilis**: Patch / Feature Hardening (Container Public Storage Web Mounting & Instant Maintenance Page Ingress)  
**Status**: Production Ready & Stable  
**PIC Tim**: Rizal (Security & DevOps Lead), Andalusia (Full Stack Lead), Paijo (QA/QC Lead)

#### 🌟 Ringkasan Rilis
1. **Dynamic Public Storage Web Mounting (`/usr/share/nginx/html:ro`)**:
   - Memetakan mount bind direktori publik tenant (`publicPath`) langsung ke root document Nginx kontainer (`/usr/share/nginx/html:ro`) di `internal/docker/sandbox.go`.
   - Mengizinkan pembaruan konten web langsung dari sisi host tanpa perlu me-reload Nginx, me-restart kontainer, ataupun membatalkan batasan `ReadonlyRootfs: true`.
2. **Bespoke HTTP 503 Maintenance Page Generator**:
   - Mengimplementasikan `SetMaintenanceHTML` di `internal/storage/manager.go` yang menghasilkan halaman pemeliharaan visual berstandar HeroCMS Enterprise (`<meta name="robots" content="noindex, nofollow">`, auto-refresh setiap 60 detik, estimasi durasi ETA kustom, dan badge radar Amber 503).
   - Menghadirkan backup otomatis `index.html.live` untuk pemulihan instan ke halaman live website seketika saat mode pemeliharaan dinonaktifkan tanpa downtime.
3. **Endpoint API `/api/v1/containers/:id/maintenance`**:
   - Menghadirkan endpoint API yang menerima `tenant_id`, `subdomain`, `enabled`, `message`, dan `estimated_end_time`.
   - Menghubungkan resolusi kontainer berbasis label `herocms.site.id` dan `herocms.subdomain`, menerbitkan event siklus hidup Kafka (`herocms.orchestrator.lifecycle`), serta mencatat log audit ke Redis secara real-time.

---

### [03-orchestrator-v1.1.0] - 25 Oktober 2026
**Tipe Rilis**: Minor / Feature Release (Autonomous Local Image Builder & Traefik Dynamic File Sync)  
**Status**: Production Ready & Stable  
**PIC Tim**: Andalusia (Full Stack Lead), Rizal (Security & DevOps Lead), Paijo (QA/QC Lead)

#### 🌟 Ringkasan Rilis
1. **Autonomous Local Image Builder (Zero Registry Push)**:
   - Sebelum kontainer tenant dibuat, Service 03 secara otomatis memeriksa ketersediaan image `roxas0800/tenant-runtime:alpine-v1` di cache lokal Docker via `ensureRuntimeImage`.
   - Apabila belum tersedia, orchestrator mengkompilasi/membangun image lokal langsung dari Dockerfile template (`templates/vue-alpine-runtime`) secara otomatis tanpa perlu melakukan push ke Docker Hub.
2. **Sinkronisasi File Konfigurasi Dinamis Traefik (`tenants.yml`)**:
   - Menghadirkan `internal/traefik/sync.go` yang menulis aturan perutean rute dinamis tenant (`Host(<subdomain>.stacbyte.id)`) dan service upstream target kontainer ke `deploy/traefik/dynamic/tenants.yml`.
   - Traefik v3 yang berjalan di `docker-compose.yml` (`providers.file.directory=/etc/traefik/dynamic`, `watch=true`) seketika mendeteksi rute baru dan menghubungkan trafik secara instan (< 100ms) dengan dukungan ganda (Docker labels + Dynamic File Provider).
3. **Standarisasi Namespace Image `roxas0800`**:
   - Mengganti seluruh referensi image `cloudcms` menjadi standar organisasi `roxas0800` pada `docker-compose.yml`, `config/config.go`, dan `internal/docker/provisioner.go`.

---

### [03-orchestrator-v1.0.2] - 25 Oktober 2026
**Tipe Rilis**: Patch / Alignment & Integration Release  
**Status**: Production Ready & Stable  
**PIC Tim**: Rizal (Security & DevOps Lead), Paijo (QA/QC Lead)

#### 🌟 Ringkasan Rilis
1. **Fallback Default Sandi Redis**: Menambahkan default fallback kata sandi Redis (`secret_redis_password`) pada `config/config.go` sehingga Service 03 langsung terhubung ke kontainer Docker `herocms_redis` tanpa kendala `NOAUTH Authentication required`.
2. **Penyelarasan Host Router Domain stacbyte.id**: Memperbarui aturan Traefik router rules pada `internal/docker/sandbox.go` dan output API `internal/api/router.go` menjadi `Host(<subdomain>.stacbyte.id)` secara konsisten dengan ekosistem platform.

---

### [03-orchestrator-v1.0.1] - 25 Oktober 2026
**Tipe Rilis**: Patch / Security Hardening Release  
**Status**: Production Ready & Stable  
**PIC Tim**: Rizal (Security & DevOps Lead), Paijo (QA/QC Lead)

#### 🌟 Ringkasan Rilis
Pengerasan keamanan berstandar 21 Matriks Keamanan Web, Backend & Sandboxing Kontainer:
1. **Pencegahan Serangan Timing (Timing Attack Resistance)**: Pemutakhiran verifikasi token `X-HeroCMS-Internal-Secret` menggunakan `subtle.ConstantTimeCompare` pada `internal/api/middleware.go`.
2. **Penanganan Status Container Not Found (HTTP 404)**: Respons yang konsisten dengan kode status 404 saat target kontainer tidak ditemukan pada operasi Start dan Stop.
3. **Audit Kepatuhan Matriks 21 Keamanan**: Penegakan 100% parameter pengerasan cgroups v2 (`256 MB RAM`, `0.5 vCPU`, `PidsLimit 50`, `UID 10001`, `ReadonlyRootfs`, `CapDrop ALL`, `tmpfs noexec`) dan isolasi direktori penyimpanan tenant.

---

### [03-orchestrator-v1.0.0] - 25 Oktober 2026
**Tipe Rilis**: Milestone / Major Architectural Release  
**Status**: Production Ready & Stable  
**PIC Tim**: Andalusia (Full Stack Lead), Rizal (Security & DevOps Lead), Paijo (QA/QC Lead)

#### 🌟 Ringkasan Rilis
Rilis perdana Master Control Plane otonom berbasis **Golang murni (headless daemon)** tanpa antarmuka grafis (dashboard) yang bertugas penuh mengendalikan siklus hidup kontainer Docker, isolasi direktori penyimpanan persisten, label routing dinamis Traefik v3, sinkronisasi state via Redis distributed mutex, dan penyiaran event via Kafka.

#### 📦 Rincian Fitur & Modul:
1. **Pure Headless Daemon (`cmd/api/main.go`, `config/config.go`)**:
   - Engine Golang berkecepatan tinggi dengan footprint RAM idle < 30 MB.
   - Penanganan sinyal OS (`SIGINT`, `SIGTERM`) untuk graceful shutdown dan pembersihan socket.
2. **Strict Local-Only Perimeter**:
   - Terisolasi di dalam `herocms_internal_net` tanpa rute Traefik publik luar dan tanpa port forwarding publik.
   - Dilindungi middleware `InternalSecretGuard` (`X-HeroCMS-Internal-Secret: <TOKEN>`) yang menolak panggilan tanpa otorisasi dengan HTTP 403 Forbidden.
3. **Autonomous Docker Engine SDK & Linux cgroups v2 (`internal/docker/`)**:
   - Sandboxing ketat per-tenant: Hard limit RAM **256 MB** (swap disabled), CPU quota **0.5 vCPU**, **PidsLimit: 50** (anti-fork bomb).
   - Eksekusi non-root UID/GID `10001:10001` (`cmsrunner`).
   - `ReadonlyRootfs: true` dengan `/tmp` dan `/run` bertipe `tmpfs` (`noexec,nosuid,nodev`).
   - Drop all kernel capabilities (`CapDrop: ALL`) dan pembatasan `no-new-privileges: true`.
   - Injeksi label dinamis Traefik v3 untuk pemetaan instan subdomain (`*.herocms.stackbyte.id`) dan custom domain tanpa reload.
   - Manajemen siklus hidup: `Deploy`, `Start`, `Stop`, `Restart`, `Destroy`, `Logs`, dan `Stats`.
4. **Persistent Storage Sandboxing (`internal/storage/manager.go`)**:
   - Alokasi otomatis direktori penyimpanan terisolasi per-tenant (`/data`, `/uploads`, `/public`).
   - Penegakan izin akses non-root dan inspeksi kuota ukuran disk.
   - Pembersihan direktori total (`PurgeTenantStorage`) saat kontainer dihancurkan.
5. **Sinkronisasi Event & Mutex (Redis & Kafka)**:
   - **Redis (`internal/messaging/redis/client.go`)**: Distributed mutex lock (`herocms:lock:deploy:{tenant_id}`) untuk mencegah *race condition* deploy bersamaan, serta cache status kontainer berkecepatan tinggi dengan fallback in-memory aman.
   - **Kafka (`internal/messaging/kafka/producer.go`)**: Penyiaran lifecycle event (`tenant.provision.started`, `tenant.provision.completed`, `tenant.provision.failed`, `tenant.container.stopped`, dll) dengan in-memory audit ring buffer.

---

## 📜 2. Buku Catatan Operasional Sistem (System Log & Audit Trail)

Berikut adalah standarisasi dan format rekaman log sistem (*System Log Specification*) yang dihasilkan oleh daemon orkestrator saat beroperasi:

### A. System Boot & Initialization Sequence (Log Awal Boot)
```text
[INIT / BOOT] ================================================================
[INIT / BOOT]    HeroCMS Headless Provision Orchestrator Daemon (Service 03)  
[INIT / BOOT]    Autonomous Docker • cgroups v2 • Traefik • Redis • Kafka     
[INIT / BOOT] ================================================================
[INIT / CONFIG] Port: 8080 | EdgeNet: herocms_edge_net | Mode: headless-daemon
[INIT / STORAGE] Storage manager active at base path: /var/lib/herocms/tenants
[INIT / REDIS] Connected to Redis cluster at localhost:6379 (Mutex Locking Enabled)
[INIT / KAFKA] Kafka Event Producer initialized with brokers: localhost:9092
[INIT / DOCKER] Docker Engine API v1.45 connected via /var/run/docker.sock
[INIT / SERVER] Orchestrator daemon listening on :8080 (Strict Local-Only)
```

### B. Security & Access Control Log (Log Pengamanan Jaringan)
```text
[SECURITY / GUARD] PASS | Client: 172.20.0.12 | Method: POST /api/v1/containers/provision | Secret Validated
[SECURITY / GUARD] REJECT | 403 Forbidden | Client: 172.20.0.45 | Missing X-HeroCMS-Internal-Secret | Path: /api/v1/containers
[SECURITY / WAF] REJECT | 400 Bad Request | Tenant: t-hacker | Subdomain: hacker.com`) || Host(`admin | Code: ERR_INVALID_SUBDOMAIN
```

### C. Container Spawning & Storage Provisioning Log (Log Pembuatan Kontainer)
```text
[MUTEX / REDIS] Lock acquired for tenant: tenant_alpha_882 (TTL: 30s)
[KAFKA / EVENT] Topic: herocms.orchestrator.lifecycle | Type: tenant.provision.started | Tenant: tenant_alpha_882
[STORAGE / PROVISION] Allocated isolated directories:
  ├── /var/lib/herocms/tenants/tenant_alpha_882/data (rw)
  ├── /var/lib/herocms/tenants/tenant_alpha_882/uploads (rw)
  └── /var/lib/herocms/tenants/tenant_alpha_882/public (ro)
  └── Permissions enforced: UID 10001:10001 (cmsrunner)
[CGROUPS / ENFORCE] Memory Limit: 256MB | MemorySwap: 256MB | CPU: 0.5 vCPU | PIDs: 50 | ReadonlyRootfs: true
[TRAEFIK / LABELS] Injected Dynamic Labels:
  ├── traefik.enable: true
  ├── traefik.docker.network: herocms_edge_net
  ├── traefik.http.routers.tenant-alpha.rule: Host(`alpha.herocms.stackbyte.id`)
  └── traefik.http.services.tenant-alpha.loadbalancer.server.port: 80
[DOCKER / LIVE] Spawning container: tenant_alpha_882_commit77 (Image: cloudcms-tenant-runtime:alpine-v1)
[DOCKER / LIVE] Container successfully started with ID: 48f9a12c8b7e
[REDIS / STATE] Saved container state: tenant_alpha_882 -> status: running, IP: 172.20.0.88
[MUTEX / REDIS] Lock released for tenant: tenant_alpha_882
[KAFKA / EVENT] Topic: herocms.orchestrator.lifecycle | Type: tenant.provision.completed | Duration: 182ms
```

### D. Health Monitoring, Stats & Telemetry Log (Log Kesehatan & Metrik)
```text
[TELEMETRY / STATS] Container: 48f9a12c8b7e | CPU: 1.8% | RAM: 48.2 MB / 256 MB (18.8%) | NetRx: 1.2 MB | NetTx: 4.8 MB
[TELEMETRY / OOM] Memory compliance: NORMAL (Risk: Safe, Headroom: 207.8 MB)
[API / ROUTE] 200 OK | Latency: 1.2ms | GET /api/v1/containers/48f9a12c8b7e/stats
```

### E. Emergency Drainage, Restart & Destroy Log (Log Pemulihan & Penghancuran)
```text
[LIFECYCLE / RESTART] Intercepted emergency restart signal for container: 48f9a12c8b7e
[DOCKER / RESTART] Sending SIGTERM (Drainage timeout: 10s)... Stopped cleanly -> Starting new instance
[LIFECYCLE / RESTART] Container 48f9a12c8b7e is healthy and online (Uptime reset: 0s)
[LIFECYCLE / DESTROY] Termination request with purge_storage=true for container: 48f9a12c8b7e
[DOCKER / REMOVE] Container removed and network disassociated: 48f9a12c8b7e
[STORAGE / PURGE] Directory /var/lib/herocms/tenants/tenant_alpha_882 purged cleanly (0 bytes remaining)
[KAFKA / EVENT] Topic: herocms.orchestrator.lifecycle | Type: tenant.container.destroyed | Tenant: tenant_alpha_882
```

### F. Graceful Termination Log (Log Penutupan Daemon)
```text
[SHUTDOWN] Intercepted termination signal: SIGTERM. Shutting down orchestrator gracefully...
[SHUTDOWN] Active worker routines drained (0 pending operations)
[SHUTDOWN] Disconnected Docker socket client connection
[SHUTDOWN] Flushed Redis mutex connection pool
[SHUTDOWN] HTTP server closed cleanly. Daemon exited with code 0.
```

---

## 🛡️ 3. Matriks Kepatuhan Keamanan & Pentest Gate

| Standar Keamanan | Implementasi di Service 03 | Status Verifikasi |
| :--- | :--- | :--- |
| **CWE-20 / CWE-93** | Sanitasi regex ketat pada parameter `subdomain`, `tenant_id`, dan `custom_domain` mencegah injeksi router Traefik | **PASS (100% Ditangkal)** |
| **CWE-22** | Sanitasi `SanitizeTenantID` mencegah *Directory Traversal* (`../../etc/passwd`) pada pembuatan volume storage | **PASS (100% Ditangkal)** |
| **CWE-400 / CWE-770** | Hard limit Linux cgroups v2: RAM 256MB, CPU 0.5 vCPU, PidsLimit 50 mematikan risiko *DoS* dan *fork bomb* | **PASS (Enforced di Kernel)** |
| **CWE-250** | Eksekusi strictly non-root UID `10001:10001`, `ReadonlyRootfs`, `CapDrop: ALL`, dan `no-new-privileges: true` | **PASS (Enforced di Sandbox)** |
| **CWE-306** | Pengamanan perimeter internal dengan middleware `InternalSecretGuard` (`X-HeroCMS-Internal-Secret`) | **PASS (HTTP 403 Forbidden)** |
| **CWE-362** | Pencegahan *Race Condition* deploy serentak dengan Redis Distributed Mutex Locking | **PASS (Atomic SetNX)** |
