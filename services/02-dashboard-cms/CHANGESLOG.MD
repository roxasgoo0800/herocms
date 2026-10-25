# CHANGESLOG - Service 02: Dashboard CMS & Go BFF

Dokumen riwayat log sistem teknis, audit perubahan berkas, dan verifikasi integrasi untuk **Service 02: Dashboard CMS Studio**.

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

#### 3. Handler & Routing Endpoints (`internal/handler/handler.go` & `cmd/server/main.go`)
- Menambahkan rute baru pada grup `/api` (dengan autentikasi sesi/JWT & rate-limiting):
  - `POST /api/containers/:id/restart` (Emergency Reboot Pod)
  - `GET /api/containers/:id/stats` (Live cgroups v2 Telemetry)
  - `GET /api/containers/:id/logs` (Container Runtime Console Logs)

#### 4. Frontend Studio & Telemetri Real-Time (`src/services/apiClient.ts`, `src/composables/useDashboardData.ts`, `src/components/dashboard/PodDetailAnalyticsView.vue`, `src/views/DashboardView.vue`)
- Menambahkan `restartContainer`, `getContainerStats`, dan `getContainerLogs` pada `studioApi`.
- Menghubungkan tombol reboot terminal dan aksi kartu kontainer ke endpoint restart.
- Polling otomatis live cgroups v2 resource usage (CPU CFS quota, memcg RSS/cache, pids) pada kartu analitik pod detail.
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
