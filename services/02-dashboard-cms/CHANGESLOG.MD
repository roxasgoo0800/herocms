# CHANGESLOG - Service 02: Dashboard CMS & Go BFF

Dokumen riwayat log sistem teknis, audit perubahan berkas, dan verifikasi integrasi untuk **Service 02: Dashboard CMS Studio**.

---

## [v1.27.0] - 25 Oktober 2026

### 📌 Ringkasan Rilis
Transisi Penuh 100% Real Data Lintas Seluruh Menu Dashboard & Eliminasi Total Data Statis / Dummy Seeds. Menjamin seluruh angka, metrik, daftar kontainer, artikel, aset media, tiket, dan tagihan invoice disajikan murni dari PostgreSQL 16, Redis 7, MinIO S3, dan Service 03 Orchestrator (Linux cgroups v2).

---

### 🛠️ Detail Perubahan Teknis

#### 1. Eliminasi Static Seeds & Clean State Inisialisasi (`src/composables/useDashboardData.ts`)
- Menghapus import array mock/seed statis (`initialContainers`, `initialArticles`, `initialInvoices`, `initialCustomDomains`, `initialMediaAssets`, `initialSupportTickets`, `initialWebhooks`).
- Seluruh state reaktif (`containers`, `articles`, `customDomains`, `mediaAssets`, `invoices`, `supportTickets`, `webhooks`) diinisialisasi murni sebagai array kosong `ref([])`.
- Mengimplementasikan sanitasi dan auto-purge untuk menghapus cache browser lama (`localStorage`) yang menyimpan data mock `v1.26.0` ke bawah.
- Eksekusi instan `syncWithBackend({ forceWarmRedis: true })` pada saat aplikasi dibuka untuk menghidrasi state dengan 100% data real dari database.
- Fungsi `resetDashboardState()` mereset ke array kosong murni tanpa mengembalikan data dummy.

#### 2. Eliminasi Data Sintetis Pod Analytics (`src/data/pod-analytics.ts` & `PodDetailAnalyticsView.vue`)
- Menghapus 250+ baris data sintetis (100 log pengunjung buatan bersumber IP Telkomsel/Indosat, perutean palsu, dan metrik acak).
- Jika pod belum mencatat kunjungan di Redis, `dailyHits` bernilai `[]` dan antarmuka menampilkan Empty State studio resmi: *"Belum Ada Rekaman Lalu Lintas Pengunjung"*.
- Metrik mendalam sumber daya (CPU CFS quota, memcg memory, network rate, IOPS) diikat langsung ke data real-time cgroups v2 dari Service 03 (`liveStats`).
- Menghapus proses palsu; hanya menampilkan proses sistem nyata kontainer aktif (`init` & `herocms-pod-engine`).

#### 3. Real Fleet APM Telemetry & Threat Metrics (`src/data/fleet-telemetry.ts` & `AnalyticsTelemetryModule.vue`)
- Metrik SLA, HTTP Status breakdown, dan rasio cache dihitung 100% secara dinamis dari array kontainer real dan hit counter Redis (`analytics:views`).
- Menghapus daftar ancaman siber buatan (Rusia, Tiongkok, Belanda); jika tidak ada insiden aktif, menampilkan status keamanan bersih: *"0 Ancaman Siber Terdeteksi • Semua Kontainer Aman dan Terisolasi via Linux cgroups v2"*.
- Audit log Kafka diselaraskan dengan event riil siklus hidup pod, status router Traefik v3 TLS 1.3, dan kebijakan PostgreSQL Row-Level Security (RLS).
- Top pages diekstrak langsung dari artikel aktual yang ada di database PostgreSQL (`content_items`).

#### 4. Studio Empty State System (`WebhooksApiModule.vue` & `ContainersModule.vue`)
- Menerapkan empty state informatif pada tab Webhook Endpoint dan Delivery Logs jika tenant belum mendaftarkan webhook.
- Menghapus sparkline random modulo di `ContainersModule.vue`; kontainer dengan 0 kunjungan menampilkan baseline datar realistis.

---

## [v1.26.0] - 25 Oktober 2026

### 📌 Ringkasan Rilis
Integrasi penuh Service 02 (Dashboard Studio & Go BFF) ke Service 03 (Container Provision Orchestrator) untuk manajemen otonom siklus hidup kontainer tenant, alokasi penyimpanan persisten, perutean dinamis Traefik v3, telemetri real-time kernel Linux cgroups v2, dan terminal streaming runtime log.

---

### 🛠️ Detail Perubahan Teknis

#### 1. Internal Orchestrator Client Package (`internal/orchestrator/client.go`)
- Membangun package `orchestrator.Client` dengan proteksi token rahasia internal `X-HeroCMS-Internal-Secret`.
- Mendukung metode komunikasi aman:
  - `DeployContainer(ctx, payload)` -> `POST /api/v1/containers/provision`
  - `ListContainers(ctx)` -> `GET /api/v1/containers`
  - `InspectContainer(ctx, id)` -> `GET /api/v1/containers/:id`
  - `StartContainer(ctx, id)` -> `POST /api/v1/containers/:id/start`
  - `StopContainer(ctx, id)` -> `POST /api/v1/containers/:id/stop`
  - `RestartContainer(ctx, id)` -> `POST /api/v1/containers/:id/restart`
  - `DestroyContainer(ctx, id, purgeStorage)` -> `DELETE /api/v1/containers/:id?purge_storage=true`
  - `GetStats(ctx, id)` -> `GET /api/v1/containers/:id/stats`
  - `GetLogs(ctx, id, tail)` -> `GET /api/v1/containers/:id/logs?tail=...`
  - `GetStatus(ctx)` -> `GET /readyz`

#### 2. Service Layer & Database Integrity (`internal/service/service.go` & `internal/repository/repository.go`)
- Menyematkan `Orchestrator *orchestrator.Client` ke dalam struct `service.Services`.
- Provisi kontainer baru secara sinkron memanggil Service 03 dan mencatat metadata kontainer ke PostgreSQL 16.
- Menghubungkan mutasi kontainer (Start, Stop, Restart, Delete) langsung ke daemon kontainer otonom.
- Memperbaiki bug SQL parameter mismatch pada `InsertSite` (sebelumnya 14 parameter dikirim ke statement 15 parameter) dengan menyertakan kolom `status`.
- **Sinkronisasi Real Data Antar-Menu**: `GetContainers` secara otomatis merekonsiliasi daftar situs dari database dengan kontainer yang aktif di Service 03 (`ListContainers` & `GetStats`), mengisi status kontainer riil, uptime nyata, serta persentase CPU dan RAM live dari kernel cgroups v2.

#### 3. Handler & Routing Endpoints (`internal/handler/handler.go` & `cmd/server/main.go`)
- Menambahkan rute baru pada grup `/api` (dengan autentikasi sesi/JWT & rate-limiting):
  - `POST /api/containers/:id/restart` (Emergency Reboot Pod)
  - `GET /api/containers/:id/stats` (Live cgroups v2 Telemetry)
  - `GET /api/containers/:id/logs` (Container Runtime Console Logs)

#### 4. Frontend Studio & Telemetri Real-Time (`src/services/apiClient.ts`, `src/composables/useDashboardData.ts`, `src/components/dashboard/PodDetailAnalyticsView.vue`, `src/views/DashboardView.vue`)
- Menambahkan `restartContainer`, `getContainerStats`, dan `getContainerLogs` pada `studioApi`.
- Menghubungkan tombol reboot terminal dan aksi kartu kontainer ke endpoint restart.
- **Pembaruan Telemetri Real Data**: Kartu metrik 'Edge Routing Traefik', 'Trafik Pengunjung', dan 'Keamanan TLS/SSL' pada `ContainersModule.vue` kini menghitung agregat riil berdasarkan kontainer aktif yang terdaftar di sistem.
- **Binding Telemetri cgroups v2 di `PodDetailAnalyticsView.vue`**: Metrik mendalam CPU CFS Quota, memcg Linux memory, dan Throughput Jaringan kini terikat langsung ke data sensor `liveStats` dari Service 03 dengan lencana *Live cgroups v2*.
- Menghubungkan konsol log terminal macOS pada `DashboardView.vue` ke live logs dari kontainer Docker.

---

### 🛡️ Audit Keamanan & Hasil Pengujian
- **Pengujian Integrasi Live 9-Langkah**:
  - `Step 1`: Autentikasi Admin & CSRF token exchange (`PASS`)
  - `Step 2`: Provisi kontainer via Service 02 -> Service 03 (`PASS`)
  - `Step 3`: Verifikasi pendaftaran kontainer di Service 03 (`PASS`)
  - `Step 4`: Pengambilan metrik cgroups v2 stats via Service 02 (`PASS`)
  - `Step 5`: Pengambilan stream log kontainer via Service 02 (`PASS`)
  - `Step 6`: Emergency restart kontainer via Service 02 (`PASS`)
  - `Step 7`: Penghentian (stop) kontainer via Service 02 (`PASS`)
  - `Step 8`: Menjalankan kembali (start) kontainer via Service 02 (`PASS`)
  - `Step 9`: Penghapusan kontainer & alokasi storage via Service 02 (`PASS`)
- **Hasil**: 9/9 Integrasi `PASS` 100%.
- **Pengujian Pentest**:
  - `services/02-dashboard-cms`: `PASS`
  - `services/03-provision-orchestrator`: `PASS`
- **Build Frontend**: `npm run build` sukses 100% tanpa error TypeScript.
