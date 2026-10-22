import type { EnterpriseSop } from '../types/docs';

export const enterpriseSops: EnterpriseSop[] = [
  {
    id: "SOP-GIT-01",
    title: "Standar Industri Git Branching, Conventional Commits & Push Remote",
    category: "Alur Kerja & Git",
    pic: "Rizal & Seluruh Tim",
    badge: "Mandatori",
    purpose: "Menjamin riwayat git branch tetap rapi, linear, terlacak terhadap nomor tiket tugas (Task ID), serta mencegah konflik kode (merge conflicts) pada repositori monorepo HeroCMS.",
    flowchart: [
      "Tarik branch main terbaru (git pull origin main)",
      "Buat branch fitur (feat/fix/perf/sec/<task-id>-<slug>)",
      "Koding dengan mematuhi Zero-CSS & Clean Separation",
      "Format pesan Conventional Commit berserta SemVer",
      "Eksekusi pentest runner lokal sebelum git push",
      "Buka Pull Request (PR) ke main dengan bukti checklist"
    ],
    steps: [
      "Tarik perubahan terbaru dari branch utama sebelum mulai koding: git checkout main && git pull origin main.",
      "Buat branch fitur baru dengan format baku: git checkout -b feat/<task-id>-<slug-fitur> (contoh: git checkout -b feat/TSK-CNT-01-container-grid). Untuk perbaikan bug gunakan fix/..., performa perf/..., keamanan sec/....",
      "Terapkan format Conventional Commits: git commit -m '<type>(<scope>): <pesan aksi imperative> (<versi-semver>)'. Contoh: git commit -m 'feat(studio): add container pod telemetry card (v1.14.27)'.",
      "Kirim branch ke remote repository: git push -u origin feat/<task-id>-<slug-fitur>.",
      "Buka Pull Request (PR) ke main dan lampirkan bukti checklist pengujian pentest pada deskripsi PR."
    ],
    dos: [
      "Wajib pull branch main terbaru sebelum membuat branch kerja baru.",
      "Wajib menyertakan ID Task (misal: TSK-CNT-01) pada nama branch dan scope commit.",
      "Wajib menjalankan 'go test -v ./pentest/...' dengan status PASS sebelum git commit.",
      "Wajib menyertakan deskripsi teknis perubahan dan bukti screenshot pada PR."
    ],
    donts: [
      "Dilarang commit langsung ke branch 'main' tanpa melalui Pull Request.",
      "Dilarang menggunakan pesan commit ambigu seperti 'update', 'fix bug', atau 'wip'.",
      "Dilarang melakukan git push --force ke branch bersama atau main.",
      "Dilarang memasukkan file rahasia .env, private keys, atau credential database ke staging git."
    ],
    commands: [
      "git checkout main && git pull origin main",
      "git checkout -b feat/TSK-CNT-01-container-orchestration",
      "git status",
      "git commit -m \"feat(studio): add container pod telemetry card (v1.14.27)\"",
      "git push -u origin feat/TSK-CNT-01-container-orchestration"
    ],
    apiExample: {
      title: "Verifikasi Healthcheck Git & Build Status di Backend Go",
      service: "02-dashboard-cms",
      endpoint: "/healthz",
      method: "GET",
      description: "Memastikan service Go BFF menyala dan siap menerima integrasi commit baru.",
      curl: "curl -s -i http://127.0.0.1:8085/healthz",
      goHandlerSnippet: `// Healthz handler pada services/02-dashboard-cms/cmd/server/main.go
r.GET("/healthz", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{
        "status":  "healthy",
        "service": "herocms-dashboard-bff",
        "version": "v1.14.27",
        "time":    time.Now().UTC(),
    })
})`,
      responseSample: `HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "status": "healthy",
  "service": "herocms-dashboard-bff",
  "version": "v1.14.27",
  "time": "2026-10-19T09:45:00Z"
}`
    },
    verificationCriteria: [
      "Branch terhubung dengan tepat 1 Task ID aktif di backlog.",
      "Commit log mematuhi standar Conventional Commits.",
      "Pentest pre-commit suite sukses tanpa FAIL.",
      "Paijo (QA/QC) memvalidasi review PR sebelum merger."
    ]
  },
  {
    id: "SOP-FLOW-01",
    title: "Siklus Pengerjaan Tugas End-to-End dari Awal Sampai Akhir",
    category: "Alur Kerja & Git",
    pic: "Paijo (PM) & Seluruh Tim",
    badge: "Mandatori",
    purpose: "Menstandarisasi perjalanan hidup setiap tugas dari fase pemilihan backlog, pelaporan klaim, implementasi teknis, verifikasi keamanan, pencatatan SemVer, hingga penutupan tiket.",
    flowchart: [
      "Ambil tugas ongoing dari matriks divisi",
      "Klaim penugasan secara terbuka ke Paijo (PM)",
      "Pengerjaan kode (Zero-CSS & Clean Separation)",
      "Uji pentest black-box per-service",
      "Catat changelog & SemVer rilis baru",
      "Paijo (QA) memvalidasi kriteria Definition of Done"
    ],
    steps: [
      "Langkah 1 (Ambil Checklist): Buka TASK_CHECKLIST.md atau portal index.html, pilih task status ONGOING sesuai divisi keahlian Anda.",
      "Langkah 2 (Klaim Tugas): Laporkan klaim tugas ke Paijo: 'Lapor Paijo: Klaim Task TSK-XXX-YY'.",
      "Langkah 3 (Koding & Pembenahan): Buat branch lokal (SOP-GIT-01). Terapkan prinsip Zero-CSS Duplication dan Clean Resource Separation.",
      "Langkah 4 (Uji Keamanan Pentest): Jalankan pentest mandatori: cd services/<service> && go test -v ./pentest/... pastikan status PASS.",
      "Langkah 5 (Catat SemVer): Update dataset services/02-dashboard-cms/src/data/changelog.ts dengan menaikkan nomor versi rilis baru.",
      "Langkah 6 (Review & DoD Gate): Lakukan git push, buka PR, dan Paijo (QA/QC) akan memvalidasi Definition of Done sebelum merge."
    ],
    dos: [
      "Wajib melapor ke Paijo saat mengawali dan menyelesaikan pengerjaan tugas.",
      "Wajib memverifikasi bahwa kode tidak melanggar batasan cgroups atau arsitektur microservice.",
      "Wajib mencatat entri changelog di src/data/changelog.ts sesuai aturan Semantic Versioning.",
      "Wajib memastikan seluruh checklist teknis tersimpan ke database via PATCH endpoint."
    ],
    donts: [
      "Dilarang mengubah status task menjadi DONE secara sembarangan karena seluruh sistem masih dalam tahap continuous enhancement.",
      "Dilarang mengambil tugas di luar domain divisi tanpa koordinasi handover dengan PIC terkait.",
      "Dilarang mengabaikan kegagalan pentest saat pengerjaan tugas.",
      "Dilarang menumpuk kode statis di file Single File Component .vue."
    ],
    commands: [
      "grep -n 'TSK-' services/07-docs/src/data/tasks.ts | head -n 5",
      "cd services/02-dashboard-cms && go test -v ./pentest/...",
      "npm --prefix services/07-docs run build"
    ],
    apiExample: {
      title: "Sinkronisasi Checklist Tugas ke Database BFF Docs",
      service: "07-docs",
      endpoint: "/api/v1/tasks/:id/checklist",
      method: "PATCH",
      description: "Memperbarui status centang checklist tugas langsung ke database SQLite/WAL.",
      curl: "curl -X PATCH http://127.0.0.1:8087/api/v1/tasks/TSK-CNT-01/checklist -H 'Content-Type: application/json' -d '{\"index\": 0, \"done\": true}'",
      goHandlerSnippet: `// Endpoint PATCH checklist di services/07-docs/cmd/server/main.go
r.PATCH("/api/v1/tasks/:id/checklist", func(c *gin.Context) {
    taskId := c.Param("id")
    var req struct { Index int \`json:"index"\`; Done bool \`json:"done"\` }
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Payload tidak valid"})
        return
    }
    // Update checklist pada database SQLite / memory store
    c.JSON(http.StatusOK, gin.H{"success": true, "taskId": taskId, "index": req.Index, "done": req.Done})
})`,
      responseSample: `{
  "success": true,
  "taskId": "TSK-CNT-01",
  "index": 0,
  "done": true
}`
    },
    verificationCriteria: [
      "Checklist tugas tercentang di UI dan tersimpan di database backend.",
      "Dataset changelog.ts terupdate dengan nomor versi baru.",
      "Paijo (PM & QA/QC) memverifikasi bahwa DoD terpenuhi 100%."
    ]
  },
  {
    id: "SOP-CHK-01",
    title: "Tata Cara Mengambil, Menandai & Mengelola Checklist Tugas",
    category: "Alur Kerja & Git",
    pic: "Paijo (PM) & Seluruh Tim",
    badge: "Mandatori",
    purpose: "Memberikan panduan tata cara pengelolaan centang checklist (50 tasks), arti perbedaan centang [x] versus [ ], serta protokol persistensi ke database produksi.",
    flowchart: [
      "Pilih item checklist dari kartu atau artikel tugas",
      "Verifikasi bukti teknis (kode / skema / runbook)",
      "Klik checklist interaktif di reader view",
      "Request PATCH terkirim otomatis ke backend",
      "Status tersimpan di SQLite / memory state",
      "Paijo (QA) menginspeksi log perubahan checklist"
    ],
    steps: [
      "Status Seluruh Task Mutlak ONGOING: Semua task berstatus ongoing karena proses real backend/orchestrator produksi terus disempurnakan. Dilarang mengubah status task menjadi DONE.",
      "Arti Penandaan Checklist: Item [x] berarti rancangan UI/skema/SOP sudah selesai. Item [ ] berarti integrasi proses real backend/DB/runtime kontainer masih berjalan.",
      "Cara Menandai Progres: Setiap menyelesaikan satu butir pekerjaan, ubah tanda [ ] menjadi [x] pada TASK_CHECKLIST.md dan perbarui database via portal.",
      "Format Laporan ke Paijo: Sertakan ID Task, nama pelaksana, status ongoing, item yang selesai dicentang, dan tautan commit bukti teknis."
    ],
    dos: [
      "Wajib memverifikasi bahwa kode implementasi benar-benar ada sebelum menandai [x].",
      "Wajib menjaga status task utama tetap ONGOING sampai evaluasi sprint rilis penuh.",
      "Wajib memastikan koneksi ke BFF aktif saat mencentang checklist agar tersimpan ke database.",
      "Wajib menuliskan catatan teknis pada kolom hand-over bila dialihkan ke rekan lain."
    ],
    donts: [
      "Dilarang mencentang checklist jika file kontrak atau implementasi belum di-commit.",
      "Dilarang mengubah struktur format JSON checklist di luar format baku { done: boolean, text: string }.",
      "Dilarang mematikan fitur auto-sync PATCH pada komponen TaskArticleReader."
    ],
    commands: [
      "curl -s http://127.0.0.1:8087/api/v1/tasks | jq '.[0].checklist'",
      "sqlite3 /tmp/herocms_docs.db \"SELECT id, title, status FROM tasks LIMIT 5;\""
    ],
    apiExample: {
      title: "Query Daftar Tugas & Status Checklist",
      service: "07-docs",
      endpoint: "/api/v1/tasks",
      method: "GET",
      description: "Mengambil daftar 50 tugas beserta array checklist interaktif dari database backend.",
      curl: "curl -s http://127.0.0.1:8087/api/v1/tasks",
      goHandlerSnippet: `r.GET("/api/v1/tasks", func(c *gin.Context) {
    tasks := store.GetAllTasks()
    c.JSON(http.StatusOK, tasks)
})`,
      responseSample: `[
  {
    "id": "TSK-CNT-01",
    "title": "Autonomous Container Spawning",
    "status": "ONGOING",
    "checklist": [
      { "text": "Desain UI telemetri container pod selesai", "done": true },
      { "text": "Integrasi Docker Engine SDK socket", "done": false }
    ]
  }
]`
    },
    verificationCriteria: [
      "Status checklist tersimpan persisten bahkan setelah browser di-refresh.",
      "Tidak ada error 500 pada log Gin BFF saat request PATCH berlangsung.",
      "Progres persentase pada meter kartu tugas naik secara real-time."
    ]
  },
  {
    id: "SOP-SVC-01",
    title: "Posisi 7 Microservices: Aturan Wajib & Hal yang Harus Dipatuhi",
    category: "Kepatuhan Service",
    pic: "Seluruh Tim & Paijo (QA)",
    badge: "Arsitektur Kunci",
    purpose: "Menjaga batas-batas arsitektur (architectural boundaries) antara 7 microservices HeroCMS, menegakkan isolasi dependensi, dan mencegah kebocoran keamanan antar-layanan.",
    flowchart: [
      "Kenali target microservice pengerjaan (01-07)",
      "Tinjau aturan mutlak (Mandates) service tersebut",
      "Hindari hal yang dilarang keras (Forbidden rules)",
      "Verifikasi nomor port & protokol ingress Traefik",
      "Jalankan pentest spesifik folder service",
      "Paijo (QC) memverifikasi compliance checklist"
    ],
    steps: [
      "01-admin-console: Wajib validasi SHA512 signature Midtrans webhook, auth Filament guard ketat; Dilarang menyimpan plaintext token pembayaran.",
      "02-dashboard-cms: Wajib single-binary port 8085 (embed.FS), Zero-CSS Duplication (studio-master.css), lazy loading defineAsyncComponent, pisahkan data statis ke src/data/*.ts; Dilarang CSS duplikat di scoped style.",
      "03-provision-orchestrator: Wajib batas cgroups v2 256MB RAM / 0.5 CPU, non-root UID 10001, read-only rootfs, sanitasi regex domain Traefik ^[a-z0-9-]+$; Dilarang flag --privileged.",
      "04-marketing-site: Wajib performa kilat LCP < 1.2s, CLS = 0, sanitasi cegah directory traversal (/../../etc/passwd), Tailwind CSS; Dilarang library berat yang memblokir rendering hero.",
      "05-ai-agent-service: Wajib rate-limit prompt per tenant, streaming SSE TTFT < 800ms, sanitasi output teks/JSON; Dilarang eksekusi prompt mentah ke shell server.",
      "06-mobile-companion: Wajib fokus monitoring telemetri live, push alert FCM, emergency reboot FaceID, offline caching; Dilarang membebani mobile dengan visual block page builder.",
      "07-docs: Wajib port 8087, Zero-CSS Duplication, mode baca artikel in-page, database SQLite WAL, pemisahan dataset statis ke src/data/*.ts; Dilarang popup modal berat untuk membaca artikel."
    ],
    dos: [
      "Wajib mematuhi nomor port resmi yang telah dialokasikan (80, 8085, 8087, 9000, 5432, 6379).",
      "Wajib memisahkan nomor versi tiap service (Semantic Versioning mandiri).",
      "Wajib menyertakan unit test & pentest suite di setiap folder service.",
      "Wajib menggunakan Traefik sebagai satu-satunya ingress gateway menuju container tenant."
    ],
    donts: [
      "Dilarang menyatukan versi seluruh service menjadi satu versi monolitik di dashboard.",
      "Dilarang membuka port container tenant secara langsung ke public interface host.",
      "Dilarang menjalankan proses di dalam container menggunakan user root (UID 0).",
      "Dilarang melakukan cross-database import antar service tanpa melewati REST API BFF."
    ],
    commands: [
      "docker compose ps",
      "curl -s http://127.0.0.1:8085/healthz",
      "curl -s http://127.0.0.1:8087/healthz"
    ],
    apiExample: {
      title: "Verifikasi Routing Traefik Ingress Multi-Service",
      service: "03-provision-orchestrator",
      endpoint: "http://docs.herocms.stackbyte.id/healthz",
      method: "GET",
      description: "Memverifikasi Traefik v3 merutekan traffic publik ke port 8087 container docs secara tepat.",
      curl: "curl -H 'Host: docs.herocms.stackbyte.id' http://127.0.0.1:80/healthz",
      goHandlerSnippet: `// Traefik labels pada docker-compose.yml
labels:
  - "traefik.enable=true"
  - "traefik.http.routers.herocms-docs.rule=Host(\`docs.herocms.stackbyte.id\`)"
  - "traefik.http.services.herocms-docs-svc.loadbalancer.server.port=8087"`,
      responseSample: `HTTP/1.1 200 OK
Content-Type: application/json

{"status": "healthy", "service": "herocms-docs-hub", "port": 8087}`
    },
    verificationCriteria: [
      "7 Service berjalan di port masing-masing tanpa konflik.",
      "Versi aplikasi di package.json dan changelog terisolasi rapi.",
      "Audit pentest per-service menghasilkan status PASS."
    ]
  },
  {
    id: "SOP-FE-01",
    title: "Standar UI Studio, Master CSS & Zero-CSS Duplication",
    category: "Engineering Teknis",
    pic: "Irgi (Frontend Specialist)",
    badge: "Mandatori",
    purpose: "Mempertahankan integritas desain visual HeroCMS Studio, mencegah ledakan ukuran file CSS (CSS bloat), dan memastikan pengalaman antarmuka 60fps tanpa lag.",
    flowchart: [
      "Periksa class di src/assets/studio-master.css",
      "Manfaatkan komponen bersama (.btn-top-create, .search-box, dll.)",
      "Gunakan tag <style scoped> hanya untuk visual unik",
      "Pindahkan array data besar ke src/data/*.ts",
      "Terapkan lazy-loading via defineAsyncComponent",
      "Audit Core Web Vitals (LCP < 1.2s, CLS = 0)"
    ],
    steps: [
      "Cek studio-master.css sebelum membuat styling baru. Manfaatkan .btn-top-create, .telemetry-card, .search-box, dll.",
      "Dilarang menduplikasi styling tombol, kartu, tabel, dan modal di tag <style scoped>.",
      "Gunakan defineAsyncComponent(() => import(...)) untuk lazy-loading modul menu di DashboardView.vue.",
      "Pemisahan bersih: File data mock/array statis wajib di src/data/*.ts; Folder src/assets/ khusus visual CSS, font, gambar.",
      "Gunakan DOMPurify untuk seluruh input teks HTML dinamis sebelum ditampilkan di canvas editor."
    ],
    dos: [
      "Wajib memakai class baku dari studio-master.css untuk tombol, tabel, dan badge.",
      "Wajib menggunakan defineAsyncComponent untuk setiap modul menu antarmuka.",
      "Wajib memisahkan file data TypeScript ke src/data/*.ts (maksimal file .vue < 500 baris).",
      "Wajib mengaktifkan font Plus Jakarta Sans dan font smoothing -webkit-font-smoothing: antialiased."
    ],
    donts: [
      "Dilarang menuliskan ulang deklarasi CSS tombol dan kartu di setiap file .vue.",
      "Dilarang menaruh ratusan baris data array statis di dalam file Single File Component.",
      "Dilarang menggunakan inline style sembarangan jika sudah ada utility class master.",
      "Dilarang mengimpor library icon eksternal besar yang membebani bundle size."
    ],
    commands: [
      "npx --prefix services/02-dashboard-cms vue-tsc -p services/02-dashboard-cms/tsconfig.json --noEmit",
      "npx --prefix services/07-docs vue-tsc -p services/07-docs/tsconfig.json --noEmit"
    ],
    apiExample: {
      title: "Pemeriksaan Bundle Splitting Vite di Console",
      service: "02-dashboard-cms",
      endpoint: "/assets/vue-vendor-*.js",
      method: "GET",
      description: "Memastikan vendor chunks terpisah dan disajikan dengan header HTTP long-term caching.",
      curl: "curl -I http://127.0.0.1:8085/assets/studio-master.css",
      goHandlerSnippet: `// Header Caching di services/02-dashboard-cms/cmd/server/main.go
r.Use(func(c *gin.Context) {
    if strings.HasPrefix(c.Request.URL.Path, "/assets/") {
        c.Header("Cache-Control", "public, max-age=31536000, immutable")
    }
    c.Next()
})`,
      responseSample: `HTTP/1.1 200 OK
Cache-Control: public, max-age=31536000, immutable
Content-Type: text/css; charset=utf-8`
    },
    verificationCriteria: [
      "vue-tsc menghasilkan 0 errors pada build validasi.",
      "Ukuran file master stylesheet tetap optimal dan konsisten.",
      "Seluruh modul menu termuat secara on-demand (lazy chunking)."
    ]
  },
  {
    id: "SOP-BE-01",
    title: "Standar Penulisan API Contract & Endpoint Go BFF",
    category: "Engineering Teknis",
    pic: "Andalusia (Full Stack Lead)",
    badge: "Mandatori",
    purpose: "Menjamin seluruh komunikasi antara frontend SPA dan backend Go BFF memiliki kontrak data yang terdefinisi dengan jelas, aman dari injeksi, dan mudah diintegrasikan.",
    flowchart: [
      "Rancang skema Request/Response di OpenAPI 3.0",
      "Tentukan struct Go dengan binding validasi tag",
      "Gunakan format respon standar JSON { success, data, message, error }",
      "Terapkan middleware sanitasi & rate limiting",
      "Tulis unit test & pentest HTTP mock",
      "Bagikan curl snippet ke tim Frontend (Irgi) & Mobile (Tyno)"
    ],
    steps: [
      "Definisikan skema Request & Response di OpenAPI 3.0 / Swagger sebelum koding backend dimulai.",
      "Format respon JSON konsisten: { 'success': boolean, 'data': any, 'message': string, 'error': string | null }.",
      "Wajib sanitasi input dan validasi batas payload maksimal 10MB.",
      "Bagikan spesifikasi kontrak endpoint ke Irgi (Web) dan Tyno (Mobile) sebelum merging ke branch main."
    ],
    dos: [
      "Wajib menyertakan context.Context pada setiap fungsi database atau network call di Go.",
      "Wajib menggunakan struct tag binding:\"required\" untuk validasi payload masuk.",
      "Wajib mengembalikan kode status HTTP yang semantik (200, 201, 400, 401, 403, 404, 500).",
      "Wajib menyertakan header keamanan (X-Content-Type-Options: nosniff, CORS)."
    ],
    donts: [
      "Dilarang mengembalikan pesan error internal SQL mentah ke response body pengguna.",
      "Dilarang memakai binding manual tanpa sanitasi payload JSON.",
      "Dilarang membuat endpoint tanpa dokumentasi kontrak cURL dan tipe response."
    ],
    commands: [
      "cd services/02-dashboard-cms && go test -v ./...",
      "curl -s -X POST http://127.0.0.1:8085/api/v1/auth/login -H 'Content-Type: application/json' -d '{\"email\":\"admin@herocms.id\",\"password\":\"password\"}'"
    ],
    apiExample: {
      title: "Standar Format API Response HeroCMS BFF",
      service: "02-dashboard-cms",
      endpoint: "/api/v1/sites",
      method: "GET",
      description: "Contoh implementasi standar response JSON pada handler Gin Golang.",
      curl: "curl -s -H 'Authorization: Bearer <TOKEN>' http://127.0.0.1:8085/api/v1/sites",
      goHandlerSnippet: `type StandardResponse struct {
    Success bool        \`json:"success"\`
    Data    interface{} \`json:"data,omitempty"\`
    Message string      \`json:"message"\`
    Error   *string     \`json:"error,omitempty"\`
}

func GetSitesHandler(c *gin.Context) {
    tenantId := c.GetString("tenant_id")
    sites, err := service.FetchTenantSites(c.Request.Context(), tenantId)
    if err != nil {
        errStr := "Gagal memuat situs"
        c.JSON(http.StatusInternalServerError, StandardResponse{
            Success: false,
            Message: "Terjadi kesalahan internal",
            Error:   &errStr,
        })
        return
    }
    c.JSON(http.StatusOK, StandardResponse{
        Success: true,
        Data:    sites,
        Message: "Berhasil memuat daftar situs",
    })
}`,
      responseSample: `{
  "success": true,
  "data": [
    {
      "id": "site_987123",
      "subdomain": "kedaikopi.herocms.id",
      "status": "running"
    }
  ],
  "message": "Berhasil memuat daftar situs"
}`
    },
    verificationCriteria: [
      "Response payload selalu memiliki field success, data, message.",
      "Penanganan error tidak mengekspos credential database.",
      "Semua handler melewati go test dengan status PASS."
    ]
  },
  {
    id: "SOP-DB-01",
    title: "Standar Skema Basis Data Multi-Tenant & Row-Level Security",
    category: "Engineering Teknis",
    pic: "Risqi (Database Specialist)",
    badge: "Mandatori",
    purpose: "Menegakkan isolasi data multi-tenant di tingkat kernel database PostgreSQL 16 menggunakan Row-Level Security (RLS) sehingga data antar-pelanggan terpisah 100%.",
    flowchart: [
      "Rancang skema tabel baru dengan kolom tenant_id UUID",
      "Aktifkan RLS secara eksplisit (ENABLE ROW LEVEL SECURITY)",
      "Buat policy isolasi berbasis current_setting('app.current_tenant_id')",
      "Tuliskan skrip migrasi UP dan DOWN (rollback)",
      "Uji kueri isolasi multi-tenant dengan user non-superuser",
      "Verifikasi integritas backup harian terkompresi"
    ],
    steps: [
      "Setiap tabel data tenant wajib memiliki kolom: tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE.",
      "Aktifkan RLS secara eksplisit: ALTER TABLE <nama_tabel> ENABLE ROW LEVEL SECURITY;",
      "Buat policy isolasi menggunakan current_setting('app.current_tenant_id', true).",
      "Setiap skrip migrasi database wajib menyertakan skrip rollback (Down Migration) yang teruji.",
      "Konfigurasi backup otomatis pg_dump terkompresi gzip setiap 6 jam dengan rotasi 30 hari."
    ],
    dos: [
      "Wajib menambahkan indeks pada kolom tenant_id di setiap tabel tenant.",
      "Wajib mengeksekusi SET LOCAL app.current_tenant_id = 'xxx' di dalam transaksi Go sebelum kueri data.",
      "Wajib menguji bahwa tenant A tidak dapat melihat baris milik tenant B meskipun kueri SELECT tanpa WHERE.",
      "Wajib menjalankan skrip rollback sebelum mengajukan migrasi ke produksi."
    ],
    donts: [
      "Dilarang membuat tabel data tenant tanpa kolom tenant_id.",
      "Dilarang menyambungkan aplikasi frontend atau Go BFF menggunakan superuser 'postgres'.",
      "Dilarang menonaktifkan RLS (DISABLE ROW LEVEL SECURITY) di database produksi.",
      "Dilarang menyimpan data sensitif seperti password dalam plaintext (wajib bcrypt cost 12+)."
    ],
    commands: [
      "psql -U cloudcms_user -d cloudcms_db -c \"SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';\"",
      "psql -U cloudcms_user -d cloudcms_db -c \"SET LOCAL app.current_tenant_id = '00000000-0000-0000-0000-000000000001'; SELECT * FROM posts;\""
    ],
    apiExample: {
      title: "Query Transaksi Go dengan RLS Session Setting",
      service: "02-dashboard-cms",
      endpoint: "PostgreSQL Database Layer",
      method: "POST",
      description: "Pola eksekusi transaksi database Go dengan penguncian isolasi Row-Level Security.",
      curl: "N/A (Database Driver Level: github.com/jackc/pgx/v5)",
      goHandlerSnippet: `// Pola transaksi RLS pada Go repository
tx, err := db.BeginTx(ctx, nil)
if err != nil { return err }
defer tx.Rollback()

// Set session tenant ID lokal untuk transaksi ini saja
_, err = tx.ExecContext(ctx, "SET LOCAL app.current_tenant_id = $1", tenantID)
if err != nil { return err }

// Kueri sekarang otomatis dibatasi hanya untuk tenantID ini oleh kernel PostgreSQL
rows, err := tx.QueryContext(ctx, "SELECT id, title, content FROM posts")
if err != nil { return err }
// ... proses rows ...

return tx.Commit()`,
      responseSample: `// Hasil query terisolasi: hanya baris milik tenantID yang dikembalikan kernel PostgreSQL`
    },
    verificationCriteria: [
      "Rowsecurity bernilai true pada seluruh tabel publik tenant di pg_tables.",
      "Simulasi pergantian tenant_id mengembalikan dataset yang berbeda secara absolut.",
      "Skrip down migration berjalan lancar tanpa data corruption."
    ]
  },
  {
    id: "SOP-OPS-01",
    title: "Standar Pengerasan Kontainer Linux & Ingress Traefik",
    category: "DevOps & Security",
    pic: "Rizal (DevOps & Security)",
    badge: "Mandatori",
    purpose: "Mengamankan runtime kontainer tenant dari potensi serangan breakout, mengisolasi resource CPU dan RAM dengan cgroups v2, serta menyaring lalu lintas ingress Traefik.",
    flowchart: [
      "Konfigurasi Docker Engine SDK HostConfig",
      "Kunci batas RAM (256MB) & CPU (0.5 vCPU)",
      "Set non-root UID 10001 dan ReadonlyRootfs",
      "Jatuhkan seluruh capabilities (CapDrop: ALL)",
      "Pasang label dynamic ingress Traefik Host(`{subdomain}`)",
      "Uji keamanan isolasi dengan pentest runner"
    ],
    steps: [
      "Setiap kontainer website tenant wajib dikunci dengan non-root UID 10001:10001.",
      "Aktifkan ReadonlyRootfs = true dan jatuhkan seluruh capabilities: CapDrop: ['ALL'].",
      "Batasi memori maksimal 256MB dan CPU 0.5 vCPU pada HostConfig Docker Engine SDK.",
      "Sanitasi nama subdomain dengan regex ^[a-z0-9-]+$ untuk mencegah serangan Traefik Router Rule Injection (CWE-20/93)."
    ],
    dos: [
      "Wajib memastikan kontainer tenant tidak memiliki akses ke Docker socket (/var/run/docker.sock).",
      "Wajib membatasi memori pada 256MB dan CPU pada 500000000 nanos.",
      "Wajib memasang header keamanan pada router Traefik (HSTS, Content-Type, FrameOptions).",
      "Wajib memverifikasi izin file rootfs kontainer read-only dengan mount tmpfs khusus di /tmp."
    ],
    donts: [
      "Dilarang keras memakai flag --privileged pada kontainer tenant.",
      "Dilarang memasang port binding 0.0.0.0 langsung ke host tanpa melewati Ingress Traefik.",
      "Dilarang mengizinkan karakter kutip satu, backtick, atau newline pada nama subdomain.",
      "Dilarang membiarkan log kontainer membesar tanpa konfigurasi max-size: 10m."
    ],
    commands: [
      "docker stats --no-stream --format 'table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}'",
      "docker inspect <container_id> --format '{{.HostConfig.Memory}} {{.HostConfig.NanoCPUs}} {{.HostConfig.ReadonlyRootfs}}'"
    ],
    apiExample: {
      title: "Pembuatan Kontainer Terisolasi via Provision Orchestrator",
      service: "03-provision-orchestrator",
      endpoint: "/api/v1/provision",
      method: "POST",
      description: "Memanggil mesin orkestrasi Go untuk membuat kamar kontainer baru dengan cgroups sandboxing.",
      curl: "curl -X POST http://127.0.0.1:8086/api/v1/provision -H 'Content-Type: application/json' -d '{\"tenantId\":\"ten_123\",\"subdomain\":\"warungkopi\",\"template\":\"business\"}'",
      goHandlerSnippet: `// Pembuatan kontainer di services/03-provision-orchestrator/internal/docker/provisioner.go
hostConfig := &container.HostConfig{
    Resources: container.Resources{
        Memory:    256 * 1024 * 1024, // 256 MB Hard limit
        NanoCPUs:  500000000,         // 0.5 vCPU
    },
    ReadonlyRootfs: true,
    CapDrop:        []string{"ALL"},
    Tmpfs: map[string]string{
        "/tmp": "rw,noexec,nosuid,size=32m",
    },
}`,
      responseSample: `{
  "success": true,
  "containerId": "a7b8c9d0e1f2",
  "subdomain": "warungkopi.herocms.stackbyte.id",
  "status": "running",
  "cgroups": {
    "memoryLimit": "256MB",
    "cpuQuota": "0.5 vCPU"
  }
}`
    },
    verificationCriteria: [
      "Kontainer berjalan dengan UID 10001 dan rootfs bersifat read-only.",
      "Penggunaan memori terbatasi 256MB di bawah kendali cgroups v2.",
      "Subdomain terverifikasi lolos regex ^[a-z0-9-]+$."
    ]
  },
  {
    id: "SOP-SEC-01",
    title: "Mandatory Pre-Commit & Pre-PR Pentest Runner",
    category: "DevOps & Security",
    pic: "Rizal & Paijo (QA/QC)",
    badge: "Security Gate",
    purpose: "Menjamin tidak ada celah keamanan baru yang lolos ke repositori git dengan menjalankan audit black-box otomatis pada endpoint autentikasi, CORS, JWT, dan injeksi parameter.",
    flowchart: [
      "Selesaikan modifikasi kode pada service terkait",
      "Arahkan terminal ke folder service (services/<name>)",
      "Jalankan pentest suite (go test -v ./pentest/...)",
      "Periksa status hasil (Wajib PASS atau SKIP)",
      "Jika ada FAIL, perbaiki vulnerability segera",
      "Cantumkan log hasil pentest pada deskripsi Pull Request"
    ],
    steps: [
      "Sebelum git commit atau push, jalankan: cd services/<service_name> && go test -v ./pentest/...",
      "Hasil pengujian wajib berstatus PASS (atau SKIP jika servis belum dinyalakan).",
      "Jika ada pengujian yang menghasilkan status FAIL, proses commit dilarang keras dan bug harus segera ditambal.",
      "Sertakan hasil verifikasi pentest pada body Pull Request sebelum merge ke main."
    ],
    dos: [
      "Wajib menjalankan pentest runner pada setiap service yang kodenya diubah.",
      "Wajib memverifikasi bahwa endpoint publik memiliki proteksi brute force rate limiting.",
      "Wajib menguji mitigasi OWASP Top 10 (Injection, Broken Auth, Security Headers).",
      "Wajib melaporkan temuan vulnerability baru ke kanal keamanan DevOps."
    ],
    donts: [
      "Dilarang commit atau push kode jika terdapat status FAIL pada hasil pengujian.",
      "Dilarang memodifikasi file helper_test.go hanya untuk meloloskan pengujian yang gagal.",
      "Dilarang menonaktifkan verifikasi SSL atau CORS di lingkungan pengujian."
    ],
    commands: [
      "cd services/02-dashboard-cms && go test -v ./pentest/...",
      "cd services/07-docs && go test -v ./pentest/..."
    ],
    apiExample: {
      title: "Pengujian Brute Force & Rate Limit Otomatis",
      service: "02-dashboard-cms",
      endpoint: "/api/v1/auth/login",
      method: "POST",
      description: "Suite pentest mengirim 20 request login salah berturut-turut untuk memastikan proteksi 429 Too Many Requests aktif.",
      curl: "for i in {1..10}; do curl -s -o /dev/null -w \"%{http_code}\\n\" -X POST http://127.0.0.1:8085/api/v1/auth/login -d '{\"email\":\"bad@hacker.com\"}'; done",
      goHandlerSnippet: `// Pengujian di services/02-dashboard-cms/pentest/auth_test.go
func TestDashboard_AuthBruteForce(t *testing.T) {
    // Mengirim 10 request login salah
    // Memastikan status 429 Too Many Requests diterima setelah batas maksimal terlampaui
}`,
      responseSample: `=== RUN   TestDashboard_AuthBruteForce
    auth_test.go:42: Request 1-5: HTTP 401 Unauthorized
    auth_test.go:48: Request 6+: HTTP 429 Too Many Requests (Rate limit enforced)
--- PASS: TestDashboard_AuthBruteForce (0.04s)
PASS`
    },
    verificationCriteria: [
      "Seluruh pengujian pentest menghasilkan PASS tanpa ada satupun FAIL.",
      "Security headers (X-Frame-Options, X-Content-Type-Options) hadir pada response header.",
      "Paijo (QA/QC) memverifikasi bukti log sebelum menyetujui Pull Request."
    ]
  },
  {
    id: "SOP-QA-01",
    title: "Standar Quality Gate, Definition of Done & E2E Validation",
    category: "Quality Gate & Security",
    pic: "Paijo (PM & QA/QC)",
    badge: "Quality Gate",
    purpose: "Menjadi gerbang kualitas terakhir (final quality gate) yang memastikan seluruh deliverables bebas dari generic slop, responsif di berbagai resolusi, dan memenuhi Definition of Done (DoD).",
    flowchart: [
      "Periksa kode dari keberadaan generic AI-slop comments",
      "Jalankan validasi Playwright E2E pada browser headless",
      "Audit Core Web Vitals (LCP < 1.2s, CLS = 0)",
      "Verifikasi konsistensi nomor versi di changelog.ts",
      "Uji tampilan responsive pada viewport mobile (375px)",
      "Beri tanda centang sign-off Definition of Done"
    ],
    steps: [
      "Verifikasi kriteria Definition of Done (DoD) pada setiap PR: Zero generic slop, pentest passed, responsive verified, SemVer logged.",
      "Jalankan uji regresi E2E Playwright browser headless pada alur registrasi dan visual block editor.",
      "Audit konsistensi kontrak API antar microservices guna mencegah schema drift atau breaking changes.",
      "Ukur benchmark Core Web Vitals (LCP < 1.2s, CLS = 0) pada Marketing Site dan Studio.",
      "Perbarui checklist tugas pada TASK_CHECKLIST.md dan index.html secara sinkron dan transparan."
    ],
    dos: [
      "Wajib memverifikasi bahwa kriteria Definition of Done (DoD) terpenuhi 100%.",
      "Wajib menguji antarmuka pada viewport mobile 375px dan desktop 1440px.",
      "Wajib memeriksa bahwa tidak ada teks atau komentar AI generic yang tidak relevan.",
      "Wajib memastikan bahwa nomor versi SemVer telah dinaikkan dan tercatat di changelog.ts."
    ],
    donts: [
      "Dilarang meloloskan PR yang memiliki regresi tampilan atau horizontal overflow pada mobile.",
      "Dilarang mengabaikan waktu muat halaman jika skor LCP melebihi 1.2 detik.",
      "Dilarang menandatangani sign-off DoD jika pengujian unit test atau pentest gagal."
    ],
    commands: [
      "npx playwright test --project=chromium",
      "node -e \"console.log('Validasi DoD Gatekeeper Selesai')\""
    ],
    apiExample: {
      title: "Audit Metrik Telemetri Platform Selesai Uji",
      service: "07-docs",
      endpoint: "/api/v1/telemetry",
      method: "GET",
      description: "Memeriksa rekapitulasi status 50 tugas, 13 blueprint, dan 10 SOP di dashboard mission control.",
      curl: "curl -s http://127.0.0.1:8087/api/v1/telemetry",
      goHandlerSnippet: `r.GET("/api/v1/telemetry", func(c *gin.Context) {
    stats := store.GetTelemetryStats()
    c.JSON(http.StatusOK, stats)
})`,
      responseSample: `{
  "totalTasks": 50,
  "ongoingTasks": 50,
  "totalServices": 7,
  "totalBlueprints": 14,
  "totalSops": 11,
  "qaQualityScore": "100%"
}`
    },
    verificationCriteria: [
      "Kriteria Definition of Done (DoD) terverifikasi lengkap.",
      "Pengujian browser otomatis bebas error konsol JavaScript.",
      "Paijo (PM & QA/QC) menerbitkan sign-off persetujuan rilis."
    ]
  },
  {
    id: "SOP-CICD-01",
    title: "Standar Selective Quality Gate CI/CD & Automated Incident Triage GitHub Actions",
    category: "CI/CD & Keamanan",
    pic: "Paijo (PM & QA) & Rizal",
    badge: "Mandatori",
    purpose: "Menjamin seluruh microservice diuji secara ketat (pentest, go vet, TypeScript type-check, dan Vite build) hanya pada service yang bergerak sebelum rilis, serta menerbitkan laporan insiden otomatis ke GitHub Issues jika terjadi kegagalan.",
    flowchart: [
      "Developer melakukan commit & push ke feature branch",
      "GitHub Actions memicu ci-internal-tests.yml",
      "Tahap 1: Deteksi path per-service dengan dorny/paths-filter",
      "Tahap 2: Menjalankan matriks Quality Gate pada service yang berubah",
      "Jika GAGAL: Terbitkan issue otomatis dengan stack trace & runbook",
      "Jika LOLOS: CI hijau, siap untuk merge PR ke main",
      "Setelah merge ke main: Publikasikan Tag Rilis untuk memicu docker-release.yml"
    ],
    steps: [
      "Jalankan skrip validasi lokal sebelum push: ./scripts/test-changed.sh untuk memastikan 0 error dan pentest PASS.",
      "Push commit ke branch fitur feat/<task-id>-<slug> dan buka Pull Request ke branch main.",
      "Workflow .github/workflows/ci-internal-tests.yml akan mengevaluasi path-filter monorepo.",
      "Hanya microservice yang mengalami perubahan kode atau bump version yang akan diuji dalam matriks parallel runner.",
      "Jika ditemukan kegagalan kompilasi atau regresi pentest, GitHub Actions otomatis menerbitkan tiket insiden teknis di GitHub Issues.",
      "Gunakan perintah pada bagian Runbook di GitHub Issue untuk mereproduksi kegagalan di komputer lokal.",
      "Setelah seluruh Quality Gate berstatus Success (Hijau), gabungkan PR ke branch main.",
      "Buat Tag Rilis GitHub Release (format: <service>-vX.Y.Z) untuk memicu pembuatan dan pengunggahan Docker image resmi."
    ],
    dos: [
      "Wajib menjalankan ./scripts/test-changed.sh sebelum git push.",
      "Wajib memeriksa tiket GitHub Issues jika pipeline CI berstatus merah.",
      "Wajib menyelesaikan kriteria DoD di tiket insiden sebelum menutup issue.",
      "Wajib menggunakan format tag resmi saat rilis: 02-dashboard-vX.Y.Z, 07-docs-vX.Y.Z, dll."
    ],
    donts: [
      "Dilarang memicu build Docker image langsung dari branch kerja (feat/*).",
      "Dilarang mengabaikan pengujian pentest lokal maupun CI.",
      "Dilarang melakukan merge PR jika status Quality Gate belum berstatus hijau (Success).",
      "Dilarang menutup tiket insiden CI tanpa menyertakan bukti perbaikan (fix commit)."
    ],
    commands: [
      "./scripts/test-changed.sh",
      "./scripts/test-changed.sh 02",
      "git push origin feat/dashboard-cms",
      "gh workflow run ci-internal-tests.yml"
    ],
    apiExample: {
      title: "Pengecekan Status Healthz & Versi Binary Pasca Uji Kualitas",
      service: "02-dashboard-cms",
      endpoint: "/healthz",
      method: "GET",
      description: "Memastikan service Go BFF sehat dan siap dideploy setelah lolos quality gate.",
      curl: "curl -s http://127.0.0.1:8085/healthz",
      goHandlerSnippet: `// Endpoint health check terverifikasi bebas celah keamanan
router.GET("/healthz", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{
        "service": "Stack Studio Backend & Static Host (Aether Core)",
        "status":  "healthy",
        "time":    time.Now().UTC().Format(time.RFC3339),
    })
})`,
      responseSample: `{
  "service": "Stack Studio Backend & Static Host (Aether Core)",
  "status": "healthy",
  "database": true,
  "redis": true,
  "s3": true
}`
    },
    verificationCriteria: [
      "Pipeline CI ci-internal-tests.yml berstatus hijau (Success) di GitHub Actions.",
      "Semua pentest suite (pentest/...) bernilai PASS tanpa assertion error.",
      "Tidak ada tiket insiden baru yang diterbitkan di GitHub Issues."
    ]
  }
];
