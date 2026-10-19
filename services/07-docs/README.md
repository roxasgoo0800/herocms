# Service 07: HeroCMS Docs & Mission Control Hub

> **Port**: `8087`  
> **Domain Ingress**: `docs.herocms.stackbyte.id` / `docs.localhost`  
> **Tech Stack**: Vue 3 (Vite + TS + Pinia) + Native Go 1.22+ BFF + In-Memory Relational DB with SQL Schema  
> **Design Standard**: Bespoke Enterprise Design System (`AGENTS.md`, `DESIGN.md`, `studio-master.css`)

---

## 1. Ikhtisar Layanan (Overview)
`services/07-docs` adalah pusat kendali misi (*Mission Control Hub*), dokumentasi arsitektur sistem, dan orkestrasi manajemen proyek (PM & QA/QC) untuk seluruh ekosistem HeroCMS monorepo. Layanan ini menyajikan data secara interaktif, persisten, dan terintegrasi langsung dengan database backend Go.

---

## 2. Fitur Utama (Key Features)

1. **4 Kartu Telemetri Dinamis**:
   - Total Task Bisnis (50 tugas terdaftar)
   - Status Progres Aktif (50 ongoing, 0 idle)
   - Kamus Arsitektur (13 blueprint operasional)
   - Standar SOP Enterprise (10 dokumen panduan rilis, git, pentest, dsb.)

2. **50-Task Matrix & Dual-Mode Grouping**:
   - Dikelompokkan berdasarkan **Divisi Tim** (Backend & Frontend, Frontend, Database Management, DevOps & Security, Mobile Apps)
   - Dikelompokkan berdasarkan **6 Layanan Utama** (`01-landing-marketing`, `02-dashboard-cms`, `03-provision-orchestrator`, `04-marketing-site`, `05-ai-agent-service`, `06-database-infra`)
   - Dilengkapi alur handover kepemilikan task antar anggota tim sesuai jobdesk spesialis.
   - Status seluruh task terkunci pada **`ONGOING`** sesuai kesepakatan sprint continuous development.

3. **Modal Reader & Interactive Checklist Database Persistence**:
   - Membaca deskripsi detail task, alur kerja teknis, referensi kode, dan Definition of Done (DoD).
   - Checkbox checklist dapat dicentang secara langsung oleh pengguna.
   - Perubahan checklist langsung tersimpan ke backend melalui `PATCH /api/v1/tasks/:id/checklist` dengan database persistence.

4. **13 Blueprint Arsitektur Sistem**:
   - Panduan operasional komprehensif untuk setiap komponen HeroCMS: Traefik Ingress, Multi-Tenant Database RLS, Docker Engine SDK, Live Preview Canvas, AI Agent Orchestration, dll.
   - Dilengkapi daftar kebutuhan sistem (*prerequisites*), panduan langkah demi langkah (*step-by-step*), dan perintah CLI siap pakai.

5. **10 SOP Runbooks Enterprise**:
   - Standar operasional industri mencakup: Git Branching (`feat/`, `fix/`), Conventional Commits, Pentest Suite pre-commit, Code Review, Tenant Provisioning, Rollback & Disaster Recovery, SemVer Changelog, dsb.

6. **Paijo AI Project Management & QA/QC Hub**:
   - Protokol kendali mutu, checklist review PR, dan template laporan berkala siap salin (*one-click copy*).

---

## 3. Arsitektur Teknis (Technical Architecture)

```
services/07-docs/
├── cmd/
│   └── server/
│       └── main.go              # Entry point server HTTP port 8087
├── internal/
│   ├── db/
│   │   ├── db.go                # In-memory thread-safe relational database store
│   │   └── schema.sql           # Skema DDL SQL untuk persistensi data
│   ├── handler/
│   │   └── router.go            # Go 1.22+ native pattern router, CORS & Security headers
│   └── model/
│       └── models.go            # Go struct definitions
├── pentest/
│   ├── helper_test.go           # HTTP client helper & health check
│   └── security_test.go         # Test suite keamanan (CORS, headers, validation)
├── public/                      # Favicon, SVG, webmanifest
├── src/
│   ├── assets/                  # studio-master.css & studio-animations.css
│   ├── components/
│   │   ├── ArchitectureModule.vue
│   │   ├── PaijoProtocolModule.vue
│   │   ├── SopRunbookModule.vue
│   │   ├── TaskBoardModule.vue
│   │   ├── TaskDetailModal.vue
│   │   └── TelemetryGrid.vue
│   ├── data/                    # team.ts, blueprints.ts, sops.ts
│   ├── stores/                  # Pinia docsStore.ts (reactive state & API sync)
│   ├── types/                   # docs.ts TypeScript definitions
│   ├── App.vue                  # Main application with defineAsyncComponent
│   └── main.ts
├── Dockerfile                   # Multi-stage Docker build (Node 20 -> Alpine Go)
├── package.json
├── tsconfig.json
└── vite.config.ts               # Vite bundler config with manualChunks & API proxy
```

---

## 4. Menjalankan Layanan (Running Locally)

### Mode Pengembangan (Development)

1. **Jalankan Go Backend**:
   ```bash
   cd services/07-docs
   go run cmd/server/main.go
   # Server mendengarkan di http://127.0.0.1:8087
   ```

2. **Jalankan Vue 3 Frontend (Vite HMR)**:
   ```bash
   cd services/07-docs
   npm run dev
   # Vite dev server aktif di http://localhost:5174 (auto-proxy API ke port 8087)
   ```

### Mode Produksi (Single Binary Go + Embedded SPA)

1. **Build Frontend**:
   ```bash
   cd services/07-docs
   npm run build
   ```

2. **Jalankan Go Server**:
   ```bash
   PORT=8087 DIST_DIR=./dist go run cmd/server/main.go
   # Akses http://localhost:8087 di browser
   ```

---

## 5. Menjalankan Pengujian Keamanan (Pentest)

Sesuai standar `AGENTS.md` Bagian 9:
```bash
cd services/07-docs
go test -v ./pentest/...
```

---

## 6. API Endpoints

| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/healthz` | Health check endpoint |
| `GET` | `/api/v1/telemetry` | Mengambil data metrik ringkasan telemetri |
| `GET` | `/api/v1/tasks` | Mengambil seluruh 50 task matrix |
| `PATCH` | `/api/v1/tasks/:id/checklist` | Toggle status checklist item dan simpan ke DB |
| `GET` | `/api/v1/members` | Mengambil daftar anggota tim dan spesialisasi |
| `GET` | `/api/v1/services` | Mengambil daftar layanan mikro (01-06) |
| `GET` | `/api/v1/blueprints` | Mengambil 13 blueprint arsitektur sistem |
| `GET` | `/api/v1/sops` | Mengambil 10 dokumen SOP enterprise |
