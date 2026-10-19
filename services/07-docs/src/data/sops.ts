import type { EnterpriseSop } from '../types/docs';

export const enterpriseSops: EnterpriseSop[] = [
  {
    id: "SOP-GIT-01",
    title: "Standar Industri Git Branching, Conventional Commits & Push Remote",
    category: "Alur Kerja & Git",
    pic: "Rizal & Seluruh Tim",
    badge: "Mandatori",
    steps: [
      "Tarik perubahan terbaru dari branch utama sebelum mulai koding: git checkout main && git pull origin main.",
      "Buat branch fitur baru dengan format baku: git checkout -b feat/<task-id>-<slug-fitur> (contoh: git checkout -b feat/TSK-CNT-01-container-grid). Untuk perbaikan bug gunakan fix/..., performa perf/..., keamanan sec/....",
      "Terapkan format Conventional Commits: git commit -m '<type>(<scope>): <pesan aksi imperative> (<versi-semver>)'. Contoh: git commit -m 'feat(studio): add container pod telemetry card (v1.14.26)'.",
      "Kirim branch ke remote repository: git push -u origin feat/<task-id>-<slug-fitur>.",
      "Buka Pull Request (PR) ke main dan lampirkan bukti checklist pengujian pentest pada deskripsi PR."
    ]
  },
  {
    id: "SOP-FLOW-01",
    title: "Siklus Pengerjaan Tugas End-to-End dari Awal Sampai Akhir",
    category: "Alur Kerja & Git",
    pic: "Paijo (PM) & Seluruh Tim",
    badge: "Mandatori",
    steps: [
      "Langkah 1 (Ambil Checklist): Buka TASK_CHECKLIST.md atau portal index.html, pilih task status ONGOING sesuai divisi keahlian Anda.",
      "Langkah 2 (Klaim Tugas): Laporkan klaim tugas ke Paijo: 'Lapor Paijo: Klaim Task TSK-XXX-YY'.",
      "Langkah 3 (Koding & Pembenahan): Buat branch lokal (SOP-GIT-01). Terapkan prinsip Zero-CSS Duplication dan Clean Resource Separation.",
      "Langkah 4 (Uji Keamanan Pentest): Jalankan pentest mandatori: cd services/<service> && go test -v ./pentest/... pastikan status PASS.",
      "Langkah 5 (Catat SemVer): Update dataset services/02-dashboard-cms/src/data/changelog.ts dengan menaikkan nomor versi rilis baru.",
      "Langkah 6 (Review & DoD Gate): Lakukan git push, buka PR, dan Paijo (QA/QC) akan memvalidasi Definition of Done sebelum merge."
    ]
  },
  {
    id: "SOP-CHK-01",
    title: "Tata Cara Mengambil, Menandai & Mengelola Checklist Tugas",
    category: "Alur Kerja & Git",
    pic: "Paijo (PM) & Seluruh Tim",
    badge: "Mandatori",
    steps: [
      "Status Seluruh Task Mutlak ONGOING: Semua task berstatus ongoing karena proses real backend/orchestrator produksi terus disempurnakan. Dilarang mengubah status task menjadi DONE.",
      "Arti Penandaan Checklist: Item [x] berarti rancangan UI/skema/SOP sudah selesai. Item [ ] berarti integrasi proses real backend/DB/runtime kontainer masih berjalan.",
      "Cara Menandai Progres: Setiap menyelesaikan satu butir pekerjaan, ubah tanda [ ] menjadi [x] pada TASK_CHECKLIST.md dan perbarui database via portal.",
      "Format Laporan ke Paijo: Sertakan ID Task, nama pelaksana, status ongoing, item yang selesai dicentang, dan tautan commit bukti teknis."
    ]
  },
  {
    id: "SOP-SVC-01",
    title: "Posisi 6 Microservices: Aturan Wajib & Hal yang Harus Dipatuhi",
    category: "Kepatuhan Service",
    pic: "Seluruh Tim & Paijo (QA)",
    badge: "Arsitektur Kunci",
    steps: [
      "01-admin-console: Wajib validasi SHA512 signature Midtrans webhook, auth Filament guard ketat; Dilarang menyimpan plaintext token pembayaran.",
      "02-dashboard-cms: Wajib single-binary port 8085 (embed.FS), Zero-CSS Duplication (studio-master.css), lazy loading defineAsyncComponent, pisahkan data statis ke src/data/*.ts; Dilarang CSS duplikat di scoped style.",
      "03-provision-orchestrator: Wajib batas cgroups v2 256MB RAM / 0.5 CPU, non-root UID 10001, read-only rootfs, sanitasi regex domain Traefik ^[a-z0-9-]+$; Dilarang flag --privileged.",
      "04-marketing-site: Wajib performa kilat LCP < 1.2s, CLS = 0, sanitasi cegah directory traversal (/../../etc/passwd), Tailwind CSS; Dilarang library berat yang memblokir rendering hero.",
      "05-ai-agent-service: Wajib rate-limit prompt per tenant, streaming SSE TTFT < 800ms, sanitasi output teks/JSON; Dilarang eksekusi prompt mentah ke shell server.",
      "06-mobile-companion: Wajib fokus monitoring telemetri live, push alert FCM, emergency reboot FaceID, offline caching; Dilarang membebani mobile dengan visual block page builder."
    ]
  },
  {
    id: "SOP-FE-01",
    title: "Standar UI Studio, Master CSS & Zero-CSS Duplication",
    category: "Engineering Teknis",
    pic: "Irgi (Frontend Specialist)",
    badge: "Mandatori",
    steps: [
      "Cek studio-master.css sebelum membuat styling baru. Manfaatkan .btn-top-create, .telemetry-card, .search-box, dll.",
      "Dilarang menduplikasi styling tombol, kartu, tabel, dan modal di tag <style scoped>.",
      "Gunakan defineAsyncComponent(() => import(...)) untuk lazy-loading modul menu di DashboardView.vue.",
      "Pemisahan bersih: File data mock/array statis wajib di src/data/*.ts; Folder src/assets/ khusus visual CSS, font, gambar.",
      "Gunakan DOMPurify untuk seluruh input teks HTML dinamis sebelum ditampilkan di canvas editor."
    ]
  },
  {
    id: "SOP-BE-01",
    title: "Standar Penulisan API Contract & Endpoint Go BFF",
    category: "Engineering Teknis",
    pic: "Andalusia (Full Stack Lead)",
    badge: "Mandatori",
    steps: [
      "Definisikan skema Request & Response di OpenAPI 3.0 / Swagger sebelum koding backend dimulai.",
      "Format respon JSON konsisten: { 'success': boolean, 'data': any, 'message': string, 'error': string | null }.",
      "Wajib sanitasi input dan validasi batas payload maksimal 10MB.",
      "Bagikan spesifikasi kontrak endpoint ke Irgi (Web) dan Tyno (Mobile) sebelum merging ke branch main."
    ]
  },
  {
    id: "SOP-DB-01",
    title: "Standar Skema Basis Data Multi-Tenant & Row-Level Security",
    category: "Engineering Teknis",
    pic: "Risqi (Database Specialist)",
    badge: "Mandatori",
    steps: [
      "Setiap tabel data tenant wajib memiliki kolom: tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE.",
      "Aktifkan RLS secara eksplisit: ALTER TABLE <nama_tabel> ENABLE ROW LEVEL SECURITY;",
      "Buat policy isolasi menggunakan current_setting('app.current_tenant_id', true).",
      "Setiap skrip migrasi database wajib menyertakan skrip rollback (Down Migration) yang teruji.",
      "Konfigurasi backup otomatis pg_dump terkompresi gzip setiap 6 jam dengan rotasi 30 hari."
    ]
  },
  {
    id: "SOP-OPS-01",
    title: "Standar Pengerasan Kontainer Linux & Ingress Traefik",
    category: "DevOps & Security",
    pic: "Rizal (DevOps & Security)",
    badge: "Mandatori",
    steps: [
      "Setiap kontainer website tenant wajib dikunci dengan non-root UID 10001:10001.",
      "Aktifkan ReadonlyRootfs = true dan jatuhkan seluruh capabilities: CapDrop: ['ALL'].",
      "Batasi memori maksimal 256MB dan CPU 0.5 vCPU pada HostConfig Docker Engine SDK.",
      "Sanitasi nama subdomain dengan regex ^[a-z0-9-]+$ untuk mencegah serangan Traefik Router Rule Injection (CWE-20/93)."
    ]
  },
  {
    id: "SOP-SEC-01",
    title: "Mandatory Pre-Commit & Pre-PR Pentest Runner",
    category: "DevOps & Security",
    pic: "Rizal & Paijo (QA/QC)",
    badge: "Security Gate",
    steps: [
      "Sebelum git commit atau push, jalankan: cd services/<service_name> && go test -v ./pentest/...",
      "Hasil pengujian wajib berstatus PASS (atau SKIP jika servis belum dinyalakan).",
      "Jika ada pengujian yang menghasilkan status FAIL, proses commit dilarang keras dan bug harus segera ditambal.",
      "Sertakan hasil verifikasi pentest pada body Pull Request sebelum merge ke main."
    ]
  },
  {
    id: "SOP-QA-01",
    title: "Standar Quality Gate, Definition of Done & E2E Validation",
    category: "Quality Gate & Security",
    pic: "Paijo (PM & QA/QC)",
    badge: "Quality Gate",
    steps: [
      "Verifikasi kriteria Definition of Done (DoD) pada setiap PR: Zero generic slop, pentest passed, responsive verified, SemVer logged.",
      "Jalankan uji regresi E2E Playwright browser headless pada alur registrasi dan visual block editor.",
      "Audit konsistensi kontrak API antar microservices guna mencegah schema drift atau breaking changes.",
      "Ukur benchmark Core Web Vitals (LCP < 1.2s, CLS = 0) pada Marketing Site dan Studio.",
      "Perbarui checklist tugas pada TASK_CHECKLIST.md dan index.html secara sinkron dan transparan."
    ]
  }
];
