---
name: herocms-team-governance-and-sop
description: Buku panduan tata kelola tim enterprise HeroCMS, kamus istilah arsitektur sistem, matriks penugasan anggota tim (Andalusia, Irgi, Risqi, Rizal, Tyno, Paijo AI), SOP pengerjaan teknis per-divisi, dan protokol pelaporan ke Project Management. Gunakan saat membagi tugas, memeriksa SOP, merujuk kamus arsitektur, atau mengelola pelaporan progres proyek.
---

# HeroCMS Team Governance, Dictionary & SOP Skill (`herocms-team-governance-and-sop`)

Skill ini merupakan **Buku Panduan Induk (Master Bible), Kamus Istilah Arsitektur, dan Standar Operasional Prosedur (SOP)** pengerjaan proyek HeroCMS untuk seluruh anggota tim dan AI Agent.

---

## 1. Matriks Organisasi & Tanggung Jawab Anggota Tim

| Nama Petugas | Posisi / Spesialisasi | Cakupan Service & Tugas Utama | SOP Wajib yang Harus Dirujuk |
| :--- | :--- | :--- | :--- |
| **Andalusia** | **Full Stack Lead** | Go Orchestrator (`03`), BFF Go (`02`), Laravel Admin (`01`), Core Integration | SOP-BE-01, SOP-BE-02, SOP-FE-01 |
| **Irgi** | **Frontend Web Specialist** | Dashboard Studio Vue 3 (`02`), Marketing Site React 19 (`04`), Design System | SOP-FE-01, SOP-FE-02, SOP-FE-03 |
| **Risqi** | **Database Management** | PostgreSQL 16 (RLS multi-tenant), Redis 7 (ZSET), MinIO S3, Backup & PITR | SOP-DB-01, SOP-DB-02, SOP-DB-03 |
| **Rizal** | **DevOps & Security Lead** | Traefik v3 Ingress, cgroups Linux sandboxing, CI/CD Actions, Pentest Suite | SOP-OPS-01, SOP-OPS-02, SOP-SEC-01 |
| **Tyno** | **Mobile Frontend Specialist** | HeroCMS Companion App (iOS & Android): Telemetri, Push Notif, Quick Controls | SOP-MOB-01, SOP-MOB-02 |
| **Paijo AI Agent** | **Project Manager & Architect** | Task Checklist, Quality & Security Audit, SemVer Changelog, Sprint Coordination | SOP-PM-01, SOP-PM-02 |

---

## 2. Kamus Istilah Arsitektur HeroCMS (Platform Dictionary)

Setiap pengembang wajib memahami konsep-konsep inti berikut sebelum memodifikasi kode:

1. **Autonomous Container Provisioning**: Mekanisme pembuatan kontainer Docker mandiri secara otomatis untuk setiap website tenant baru via Docker Engine SDK tanpa memerlukan intervensi manual sysadmin.
2. **Row-Level Security (RLS)**: Fitur keamanan setingkat kernel pada PostgreSQL yang membatasi baris data yang dapat dibaca/ditulis hanya untuk tenant yang aktif (`app.current_tenant_id`). Mencegah kebocoran data antar-tenant (*data leakage*).
3. **Traefik Dynamic Labels Ingress**: Mekanisme reverse proxy edge yang membaca label Docker kontainer secara real-time untuk membuat rute HTTPS otomatis tanpa perlu me-reload atau me-restart Traefik.
4. **cgroups v2 Sandboxing**: Pembatasan batas keras (*hard limit*) memori (256MB), CPU (0.5 vCPU), dan read-only rootfs pada kontainer tenant agar satu website yang diretas atau mengalami lonjakan traffic tidak melumpuhkan node server host.
5. **Top-Views Sorted Sets (ZSET)**: Struktur data Redis 7 berbasis kunci berurutan yang digunakan untuk menghitung kunjungan artikel dan website dengan waktu agregasi kurang dari 1 milidetik (< 1ms).
6. **Single-Binary Mode (Gin + Vue)**: Pola kompilasi di mana aset frontend Vue 3 di-*embed* ke dalam binary Go executable menggunakan fitur `embed.FS` sehingga Dashboard CMS dapat berjalan dalam satu port tunggal (port 8085) tanpa ketergantungan NodeJS di server produksi.
7. **Anti-SSRF Webhook Proxy**: Mekanisme filter proteksi pada request keluar (*outbound HTTP*) dari webhook agar sistem tidak bisa dimanfaatkan penyerang untuk menembak alamat IP privat internal (`127.0.0.1`, `10.0.0.0/8`, atau cloud metadata API).
8. **Bespoke Enterprise Design System**: Standar visual HeroCMS Studio berbasis token Slate (`#0f172a`), Royal Blue (`#2563eb`), Inter font, dan Master CSS (`studio-master.css`) dengan mandat *Zero-CSS Duplication*.

---

## 3. Standar Operasional Prosedur (SOP) Pengerjaan Teknis

### [SOP-BE-01] Backend: Kontrak API & Endpoint BFF (Andalusia)
1. Setiap endpoint baru pada Go BFF (`02-dashboard-cms`) wajib didefinisikan skema *request* dan *response*-nya dalam format OpenAPI 3.0 / Swagger sebelum koding dimulai.
2. Endpoint harus mengembalikan struktur JSON konsisten: `{ "success": boolean, "data": any, "message": string, "error": string | null }`.
3. Validasi input wajib menggunakan validator ketat (tidak boleh menerima string kosong atau payload berukuran lebih dari 10MB).
4. Bagikan dokumentasi endpoint kepada Irgi (Frontend Web) dan Tyno (Mobile) sebelum merging.

### [SOP-FE-01] Frontend: Penulisan UI & Zero-CSS Duplication (Irgi)
1. Cek [studio-master.css](file:///Users/rizalfahmi/Documents/React/herocms/services/02-dashboard-cms/src/assets/studio-master.css) sebelum membuat styling baru. Gunakan utility classes yang sudah tersedia (`.btn-top-create`, `.telemetry-card`, `.search-box`, dll).
2. Dilarang menduplikasi styling grid, kartu, form, dan modal di tag `<style scoped>`.
3. Komponen menu baru pada view induk (`DashboardView.vue`) wajib dibungkus dengan `defineAsyncComponent(() => import(...))` untuk *lazy-loading*.
4. Pastikan teks dan input form bersih dari risiko XSS dengan DOMPurify.

### [SOP-DB-01] Database: Migrasi Skema & Penegakan RLS (Risqi)
1. Setiap pembuatan tabel baru yang menyimpan data tenant wajib menyertakan kolom: `tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE`.
2. Aktifkan RLS secara eksplisit: `ALTER TABLE <nama_tabel> ENABLE ROW LEVEL SECURITY;`.
3. Buat policy isolasi:
   ```sql
   CREATE POLICY tenant_isolation_policy ON <nama_tabel>
   FOR ALL USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);
   ```
4. Semua skrip migrasi wajib memiliki file rollback (*Down Migration*) yang teruji.

### [SOP-OPS-01] DevOps & Infra: Pengerasan Kontainer & Edge Proxy (Rizal)
1. Setiap kontainer website tenant wajib dideploy dengan konfigurasi keamanan:
   - `User: 10001:10001` (Non-Root)
   - `ReadonlyRootfs: true`
   - `CapDrop: ["ALL"]`
   - `Memory: 268435456` (256MB)
   - `NanoCPUs: 500000000` (0.5 CPU)
2. Label Traefik wajib disanitasi menggunakan ekspresi reguler `^[a-z0-9-]+$` untuk mencegah *Traefik Rule Injection (CWE-20/93)*.

### [SOP-SEC-01] Security: Mandatory Pre-Commit Pentest Runner (Rizal)
1. Sebelum melakukan `git commit`, `git push`, atau membuka Pull Request (PR), jalankan uji penetrasi per-service:
   `cd services/<service_name> && go test -v ./pentest/...`
2. Status hasil uji wajib `PASS` (atau `SKIP` jika servis lokal tidak berjalan).
3. Jika ditemukan status `FAIL`, commit dilarang dan bug keamanan harus segera diperbaiki.

### [SOP-MOB-01] Mobile: Companion App Architecture (Tyno)
1. Fokus aplikasi mobile adalah **HeroCMS Companion**: Monitoring analitik kunjungan real-time, notifikasi pesan prospek masuk, dan tombol kendali darurat (restart kontainer/maintenance mode).
2. Tyno tidak boleh dibebani membuat page-builder drag-and-drop di ponsel.
3. Gunakan state management yang mendukung *offline-first caching* agar metrik terakhir tetap terlihat saat koneksi seluler terputus.

### [SOP-PM-01] Pelaporan Progres ke Paijo AI Agent
1. Setiap anggota tim melaporkan progres menggunakan format standar:
   ```markdown
   Lapor Paijo:
   - PIC: [Nama Anggota]
   - Modul/Task: [Nama Fitur/Fix]
   - Status: [Done / In Progress / Blocked]
   - Bukti/Output: [File link / Commit / Test pass]
   - Kendala: [Jika ada]
   ```
2. Paijo AI Agent akan memverifikasi hasil kerja, memperbarui checkbox di [TASK_CHECKLIST.md](file:///Users/rizalfahmi/Documents/React/herocms/docs/project-management/TASK_CHECKLIST.md) dan portal interaktif `index.html`.
