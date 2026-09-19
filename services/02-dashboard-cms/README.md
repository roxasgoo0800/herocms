# Program 2: HeroCMS Studio & Unified Backend Service (Vue 3 + Golang 1.23)

HeroCMS Studio adalah panel studio visual interaktif khusus **Pelanggan (Customer / Tenant)** untuk mengelola website portofolio/blog, mengatur konten editorial, mengunggah aset media, memantau utilisasi kontainer Docker mandiri, dan melihat analitik pengunjung *real-time*.

Aplikasi ini mengadopsi pola **Single-Binary Host Architecture** standar industri: Backend API Golang berkinerja tinggi sekaligus bertindak sebagai HTTP server statis yang menyajikan antarmuka Vue 3 SPA dalam satu executable tunggal.

---

## 🏛️ Arsitektur Bersih & Struktur Direktori (Go Standard Project Layout)

```
services/02-dashboard-cms/
├── cmd/
│   └── server/
│       └── main.go              # Entrypoint utama server Golang & Vue 3 static host
├── internal/
│   ├── config/                  # Manajemen konfigurasi & crypto/rand JWT secret
│   ├── handler/                 # HTTP Gin request handlers (REST API)
│   ├── middleware/              # Security Headers, CORS, JWT Auth, Rate Limiter
│   ├── redis/                   # Redis 7 client, Top-Views ZSET, & Session Blacklist
│   ├── repository/              # PostgreSQL 16 client dengan Row-Level Security (RLS)
│   └── service/                 # Core domain business logic
├── src/                         # Antarmuka Vue 3 + TypeScript + Tailwind CSS
│   ├── components/dashboard/    # 13 Modul Dashboard Pelanggan (Teleport & RLS-ready)
│   ├── composables/             # State management & reactive dashboard data
│   └── services/apiClient.ts    # Axios HTTP Client dengan JWT auth interceptor
├── deploy/sql/
│   └── 01_schema_and_rls.sql    # Skrip inisialisasi tabel & kebijakan RLS multi-tenant
├── dist/                        # Hasil kompilasi bundel produksi frontend Vue 3
├── Dockerfile                   # Multi-stage build (Node 20 builder -> Go alpine)
└── vite.config.ts               # Konfigurasi Vite & proxy development /api ke :8085
```

---

## 🛡️ Pengerasan Keamanan (Security Hardening Implemented)

Aplikasi telah dilengkapi dengan perlindungan keamanan enterprise berlapis:

1. **PostgreSQL 16 Row-Level Security (RLS)**:
   - Kebijakan isolasi ketat pada seluruh tabel tenant (`sites`, `content_items`, `media_assets`, `custom_domains`, `support_tickets`, `invoices`, `webhooks`, `api_keys`).
   - Setiap transaksi query mengeksekusi `SET LOCAL app.current_tenant_id = $1` sehingga data antar-pelanggan terisolasi secara kriptografis dan matematis di level kernel basis data.
2. **Perlindungan Brute-Force & Rate Limiting (Redis 7)**:
   - `/api/auth/login`: Dibatasi maksimal **15 request per menit per IP** dengan algoritma Sliding-Window Counter untuk menangkal serangan brute-force kredensial.
   - API Terproteksi: Dibatasi maksimal **120 request per menit per IP**.
3. **Enterprise HTTP Security Headers**:
   - `Content-Security-Policy (CSP)`: Mencegah injeksi XSS eksternal.
   - `X-Frame-Options: DENY`: Perlindungan mutlak terhadap serangan Clickjacking.
   - `X-Content-Type-Options: nosniff`: Mencegah MIME-type sniffing.
   - `Strict-Transport-Security (HSTS)`: Menegakkan enkripsi HTTPS (`max-age=31536000; includeSubDomains; preload`).
   - `Referrer-Policy: strict-origin-when-cross-origin`.
   - `Permissions-Policy`: Menonaktifkan akses sensor perangkat keras (`camera=(), microphone=(), geolocation=()`).
4. **JWT Authentication (HS256) & Token Revocation**:
   - Token ditandatangani menggunakan secret acak berkekuatan tinggi (`crypto/rand`).
   - Fitur logout instan dengan menyimpan hash SHA-256 token pada Redis Blacklist.
5. **Strict CORS Allowlist**:
   - Hanya mengizinkan domain lokal terpercaya (`localhost:5173`, `localhost:3000`, `localhost:8085`) dan domain internal `*.cloudcms.app` dengan dukungan kredensial (tanpa wildcard `*`).
6. **Customer-First UX Isolation**:
   - Seluruh modul disesuaikan untuk peran **Customer** (tidak ada kontrol platform SuperAdmin yang terekspos). Seluruh dialog modal (`Teleport to="body"`, `z-index: 99999`) terisolasi dari overflow layout.

---

## ⚡ Fitur Utama Backend & Integrasi Data

- **Multi-Site & Kontainer Status**: Mengelola siklus hidup kontainer Docker via integrasi Go Orchestrator (`/api/containers`).
- **Editorial Publishing Studio**: Manajemen artikel, draft, status publikasi, dan pembacaan konten.
- **MinIO S3 Asset Management**: Pelacakan kuota penyimpanan media dan URL file aman.
- **Custom Domains Ingress**: Manajemen domain kustom dengan status verifikasi DNS CNAME.
- **Support Ticketing Hub**: Percakapan tiket bantuan teknis terenkripsi.
- **Billing & Invoice History**: Pelacakan pembayaran, invoice PDF snapshot, dan alokasi kuota resource.
- **Top-Views Real-Time Analytics**: Pelacakan halaman populer dengan latensi sub-milidetik menggunakan **Redis Sorted Set (`ZSET`)**.
- **Resilient Fallback Mode**: Apabila daemon PostgreSQL atau Redis lokal sedang dalam proses booting/offline, server secara otomatis beralih ke *in-memory repository thread-safe* tanpa menyebabkan aplikasi crash.

---

## 🚀 Panduan Menjalankan Layanan

### Mode 1: Menjalankan Single-Binary (Produksi / Standalone)

Seluruh frontend Vue 3 dan backend API Golang dijalankan bersamaan dalam 1 port:

```bash
cd services/02-dashboard-cms

# 1. Build frontend ke folder ./dist
npm install
npm run build

# 2. Build dan jalankan binary Golang
go build -o dashboard-cms-server ./cmd/server
PORT=8085 ./dashboard-cms-server
```

Akses aplikasi di browser: **[http://localhost:8085](http://localhost:8085)**

---

### Mode 2: Mode Pengembangan Aktif (Hot-Reload)

Gunakan mode ini untuk pengembangan frontend dengan Vite HMR:

**Terminal 1 (Backend Golang API di Port 8085):**
```bash
cd services/02-dashboard-cms
PORT=8085 go run ./cmd/server/main.go
```

**Terminal 2 (Frontend Vue 3 Vite Dev Server di Port 5173):**
```bash
cd services/02-dashboard-cms
npm run dev
```

Vite secara otomatis mem-proxy seluruh panggilan `/api/*` ke backend Golang di `http://127.0.0.1:8085`.  
Buka browser di: **[http://localhost:5173](http://localhost:5173)**

---

## 🗄️ Migrasi Basis Data PostgreSQL

Untuk menerapkan skema tabel dan kebijakan Row-Level Security ke database PostgreSQL:

```bash
psql -h localhost -U cloudcms_user -d cloudcms_db -f deploy/sql/01_schema_and_rls.sql
```

Default demo tenant:
- **Tenant ID**: `99420000-0000-0000-0000-000000009942` (Hero Tenant Rizal Pratama)
- **User Email**: `admin@rizalpratama.cloud`
- **Role**: `customer`
