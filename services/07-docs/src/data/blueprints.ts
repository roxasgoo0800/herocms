import type { ArchitectureBlueprint } from '../types/docs';

export const architectureBlueprints: ArchitectureBlueprint[] = [
  {
    id: "BP-PROV-01",
    term: "Pembuatan Situs Otomatis (Autonomous Container Provisioning)",
    category: "Arsitektur Inti & Container",
    service: "03-provision-orchestrator",
    serviceName: "Service 03: Container Provision Orchestrator & Infra",
    icon: "⚡",
    definition: "Mekanisme pembuatan kamar website mandiri (kontainer Docker isolated) secara otomatis saat pelanggan klik 'Buat Situs'. Menggunakan Go Docker Engine SDK tanpa campur tangan manual sysadmin.",
    requirements: ["Docker Engine API v1.45", "Go Docker Engine SDK", "Linux cgroups v2", "Port internal 80"],
    fileReference: "services/03-provision-orchestrator/internal/docker/provisioner.go",
    cliCommand: "docker ps --filter 'label=herocms.tenant=true' --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'",
    guideSteps: [
      "BFF Go menerima payload pembuatan situs (subdomain & vertikal blueprint).",
      "Orchestrator memanggil client.ContainerCreate dengan hard limit 256MB RAM / 0.5 CPU.",
      "Label dynamic Traefik Host(`{subdomain}.herocms.id`) disematkan pada kontainer.",
      "Kontainer dijalankan (ContainerStart) dan status berubah menjadi active dalam < 4.5 detik."
    ],
    doAndDont: "WAJIB non-root UID 10001 dan read-only rootfs; DILARANG memakai flag --privileged.",
    flowchart: [
      "User klik 'Buat Situs Baru' di Dashboard Studio (02)",
      "BFF Go meneruskan request ke Provision Orchestrator (03)",
      "Orchestrator validasi regex domain & sanitasi subdomain",
      "Docker Engine SDK membuat container (cgroups 256MB / 0.5 CPU)",
      "Traefik membaca event socket & mendaftarkan router SSL",
      "Container aktif dalam <4.5s & webhook status terkirim"
    ],
    inDepthExplanation: "HeroCMS mengadopsi model multi-tenant container-per-tenant, di mana setiap penyewa (tenant) memiliki pod kontainer Docker terisolasi penuh. Arsitektur ini mencegah masalah noisy-neighbor dan cross-tenant data leak yang umum terjadi pada CMS tradisional. Mesin orchestrator ditulis dalam bahasa Golang dengan Docker Engine SDK resmi, memungkinkan spawning, scaling, graceful restart, dan penghapusan kontainer secara instan tanpa restart server utama.",
    golangImplementation: {
      file: "services/03-provision-orchestrator/internal/docker/provisioner.go",
      explanation: "Fungsi SpawnTenantContainer menggunakan Docker Engine SDK resmi untuk membuat kontainer dengan batasan memori 256MB, CPU 0.5 vCPU, rootfs read-only, dan label Traefik v3.",
      codeSnippet: `package docker

import (
    "context"
    "fmt"
    "github.com/docker/docker/api/types/container"
    "github.com/docker/docker/client"
)

func SpawnTenantContainer(ctx context.Context, cli *client.Client, subdomain, tenantID string) (string, error) {
    labels := map[string]string{
        "traefik.enable": "true",
        "traefik.docker.network": "traefik_network",
        "traefik.http.routers." + subdomain + ".rule": fmt.Sprintf("Host(\`%s.herocms.stackbyte.id\`)", subdomain),
        "herocms.tenant": "true",
        "herocms.tenant_id": tenantID,
    }

    config := &container.Config{
        Image:  "nginx:alpine",
        User:   "10001:10001",
        Labels: labels,
    }

    hostConfig := &container.HostConfig{
        Resources: container.Resources{
            Memory:   256 * 1024 * 1024, // 256MB
            NanoCPUs: 500000000,         // 0.5 CPU
        },
        ReadonlyRootfs: true,
        CapDrop:        []string{"ALL"},
    }

    resp, err := cli.ContainerCreate(ctx, config, hostConfig, nil, nil, "pod-"+subdomain)
    if err != nil {
        return "", err
    }

    return resp.ID, cli.ContainerStart(ctx, resp.ID, container.StartOptions{})
}`
    },
    apiEndpoint: {
      title: "API Spawning Kontainer Tenant Baru",
      method: "POST",
      path: "/api/v1/provision/container",
      port: 8086,
      description: "Endpoint internal yang dipanggil oleh Dashboard BFF saat pelanggan menekan tombol 'Buat Situs Baru'.",
      requestBody: `{
  "subdomain": "kedai-kopi-aroma",
  "tenantId": "ten_9948271a",
  "template": "business"
}`,
      curlCommand: `curl -s -X POST http://127.0.0.1:8086/api/v1/provision/container \\
  -H "Content-Type: application/json" \\
  -d '{"subdomain":"kedai-kopi-aroma","tenantId":"ten_9948271a","template":"business"}'`,
      responseSample: `{
  "success": true,
  "containerId": "d8e7f6a5b4c3",
  "subdomain": "kedai-kopi-aroma.herocms.stackbyte.id",
  "status": "running",
  "provisionTimeMs": 2840
}`,
      howToTest: [
        "Pastikan service 03-provision-orchestrator aktif di port 8086.",
        "Jalankan cURL di atas dari terminal.",
        "Periksa apakah kontainer baru muncul dengan: docker ps | grep kedai-kopi-aroma",
        "Buka domain di browser: http://kedai-kopi-aroma.herocms.stackbyte.id"
      ]
    },
    dos: [
      "Wajib memverifikasi izin subdomain dengan regex ^[a-z0-9-]+$ sebelum memanggil Docker SDK.",
      "Wajib membatasi memori pada 256MB dan CPU pada 0.5 vCPU pada HostConfig.",
      "Wajib menyematkan label jaringan Traefik traefik.docker.network=traefik_network.",
      "Wajib menggunakan context.WithTimeout (maksimal 10 detik) saat memanggil ContainerStart."
    ],
    donts: [
      "Dilarang menggunakan flag Privileged: true.",
      "Dilarang mengekspos port kontainer langsung ke 0.0.0.0 host tanpa melalui Traefik.",
      "Dilarang menjalankan kontainer dengan user root (UID 0)."
    ]
  },
  {
    id: "BP-RLS-01",
    term: "Kamar Data Terisolasi Tenant (PostgreSQL Row-Level Security / RLS)",
    category: "Basis Data & Isolasi",
    service: "02-dashboard-cms",
    serviceName: "Service 02: Dashboard Studio & Go BFF",
    icon: "🗄️",
    definition: "Sistem sekat kamar hotel digital di PostgreSQL 16. Setiap pelanggan memiliki kunci kamar sendiri (tenant_id), sehingga artikel, foto, dan invoice antar pelanggan 100% aman dan mustahil saling intip.",
    requirements: ["PostgreSQL 16", "Port 5432", "UUID Extension", "Session app.current_tenant_id"],
    fileReference: "deploy/sql/01_schema_and_rls.sql",
    cliCommand: "psql -U herocms -d herocms_db -c \"SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname='public';\"",
    guideSteps: [
      "Setiap tabel data tenant wajib menyertakan kolom: tenant_id UUID NOT NULL.",
      "Aktifkan RLS: ALTER TABLE <nama_tabel> ENABLE ROW LEVEL SECURITY;",
      "Buat policy isolasi: USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);",
      "Sebelum query dieksekusi di backend, set session: SET LOCAL app.current_tenant_id = 'xxx';"
    ],
    doAndDont: "WAJIB gunakan transaksi SET LOCAL per request; DILARANG login aplikasi web menggunakan superuser PostgreSQL.",
    flowchart: [
      "Request HTTP masuk membawa JWT auth token",
      "Middleware BFF mengekstrak claims tenant_id",
      "BFF membuka transaksi database (BeginTx)",
      "Eksekusi 'SET LOCAL app.current_tenant_id = tenant_id'",
      "Kueri SELECT/UPDATE dieksekusi di kernel PostgreSQL",
      "Kernel otomatis memblokir baris data milik tenant lain",
      "Transaksi di-commit & hasil dikembalikan ke user"
    ],
    inDepthExplanation: "Row-Level Security (RLS) di PostgreSQL 16 adalah fondasi isolasi multi-tenancy di HeroCMS. Alih-alih mengandalkan filter 'WHERE tenant_id = ?' manual pada setiap kueri aplikasi yang rentan kelupaan oleh developer (berakibat kebocoran data fatal), PostgreSQL menegakkan aturan isolasi secara otomatis di tingkat mesin basis data. Jika sesi transaksi tidak mengatur variabel app.current_tenant_id, maka 0 baris data yang akan dikembalikan.",
    golangImplementation: {
      file: "services/02-dashboard-cms/internal/db/postgres.go",
      explanation: "Implementasi fungsi helper Go untuk membungkus transaksi dengan session setting app.current_tenant_id sebelum kueri dijalankan.",
      codeSnippet: `package db

import (
    "context"
    "database/sql"
)

func WithTenantTx(ctx context.Context, db *sql.DB, tenantID string, fn func(tx *sql.Tx) error) error {
    tx, err := db.BeginTx(ctx, nil)
    if err != nil {
        return err
    }
    defer tx.Rollback()

    // Mengunci session tenant di kernel PostgreSQL
    _, err = tx.ExecContext(ctx, "SET LOCAL app.current_tenant_id = $1", tenantID)
    if err != nil {
        return err
    }

    if err := fn(tx); err != nil {
        return err
    }

    return tx.Commit()
}`
    },
    apiEndpoint: {
      title: "Query Data Artikel dengan Isolasi RLS Otomatis",
      method: "GET",
      path: "/api/v1/posts",
      port: 8085,
      description: "Mengambil daftar artikel tenant yang sedang login. Database PostgreSQL hanya mengembalikan artikel milik tenant ini.",
      curlCommand: `curl -s http://127.0.0.1:8085/api/v1/posts \\
  -H "Authorization: Bearer <JWT_TENANT_TOKEN>"`,
      responseSample: `{
  "success": true,
  "data": [
    {
      "id": "post_1001",
      "title": "Panduan Meracik Kopi Espresso Sempurna",
      "published": true
    }
  ]
}`,
      howToTest: [
        "Login sebagai Tenant A, catat token JWT.",
        "Login sebagai Tenant B pada jendela browser lain, catat token JWT B.",
        "Jalankan cURL dengan token A, verifikasi data artikel A muncul.",
        "Jalankan cURL dengan token B, verifikasi data artikel A TIDAK PERNAH muncul."
      ]
    },
    dos: [
      "Wajib menyertakan kolom tenant_id UUID NOT NULL pada setiap tabel data tenant.",
      "Wajib mengaktifkan RLS: ALTER TABLE <table> ENABLE ROW LEVEL SECURITY;",
      "Wajib membungkus kueri di dalam transaksi dengan SET LOCAL app.current_tenant_id.",
      "Wajib menguji isolasi data menggunakan unit test multi-tenant."
    ],
    donts: [
      "Dilarang menjalankan aplikasi menggunakan superuser 'postgres' (karena superuser membypass RLS).",
      "Dilarang menaruh nilai tenant_id secara hardcoded di kode kueri.",
      "Dilarang mengekspos UUID tenant lain ke payload response pengguna."
    ]
  },
  {
    id: "BP-TRAEFIK-01",
    term: "Pintu Gerbang & Satpam SSL Otomatis (Traefik Ingress)",
    category: "Infrastruktur & Ingress Proxy",
    service: "03-provision-orchestrator",
    serviceName: "Service 03: Container Provision Orchestrator & Infra",
    icon: "🛡️",
    definition: "Pintu gerbang utama penerima lalu lintas web. Otomatis mengenali alamat domain pelanggan (subdomain *.herocms.id maupun custom domain) dan langsung memasang sertifikat SSL gembok hijau HTTPS tanpa restart server.",
    requirements: ["Traefik v3", "Port 80/443", "Let's Encrypt ACME", "Docker Socket Provider"],
    fileReference: "deploy/docker-compose.infra.yml",
    cliCommand: "curl -k -I https://127.0.0.1:8085/healthz",
    guideSteps: [
      "Traefik membaca event streaming Docker socket saat kontainer tenant baru menyala.",
      "Router HTTP otomatis dipetakan ke layanan internal kontainer port 80.",
      "Tantangan ACME HTTP-01 diproses otomatis di latar belakang untuk menerbitkan sertifikat Let's Encrypt.",
      "Lalu lintas dialihkan paksa ke HTTPS (port 443) dengan proteksi TLS 1.3."
    ],
    doAndDont: "WAJIB sanitasi nama domain dengan regex ^[a-z0-9-]+$; DILARANG mengizinkan karakter newline/backtick (CWE-20/93).",
    flowchart: [
      "Lalu lintas HTTP/HTTPS masuk dari internet (Port 80/443)",
      "Traefik v3 memeriksa Host header pada request",
      "Mencocokkan router rule dari dynamic Docker labels",
      "Menerapkan middleware security-headers & gzip-compress",
      "Meneruskan request ke container target port 80/8085/8087",
      "Kembalikan response ke pengunjung dengan TLS 1.3"
    ],
    inDepthExplanation: "Traefik v3 bertindak sebagai Edge Reverse Proxy dan API Gateway cloud-native untuk monorepo HeroCMS. Tidak seperti Nginx statis yang membutuhkan 'nginx -s reload' (yang dapat memutuskan koneksi aktif saat reload file konfigurasi), Traefik membaca event stream dari Docker daemon (/var/run/docker.sock) secara real-time. Begitu kontainer tenant baru dibuat dengan label Docker, Traefik langsung membuka rute dalam hitungan milidetik tanpa interupsi.",
    golangImplementation: {
      file: "services/03-provision-orchestrator/internal/ingress/traefik_rule.go",
      explanation: "Validator nama host dan pembuat label Traefik yang aman dari ancaman Router Rule Injection (CWE-20 & CWE-93).",
      codeSnippet: `package ingress

import (
    "fmt"
    "regexp"
)

var validSubdomain = regexp.MustCompile("^[a-z0-9-]+$")

func GenerateTraefikRouterRule(subdomain string) (string, error) {
    if !validSubdomain.MatchString(subdomain) {
        return "", fmt.Errorf("subdomain tidak valid: hanya huruf kecil, angka, dan strip")
    }
    // Menghasilkan router rule aman tanpa celah CRLF / backtick injection
    return fmt.Sprintf("Host(\`%s.herocms.stackbyte.id\`) || Host(\`%s.localhost\`)", subdomain, subdomain), nil
}`
    },
    apiEndpoint: {
      title: "Healthcheck Routing Ingress Gateway",
      method: "GET",
      path: "/ping",
      port: 8080,
      description: "Memeriksa status hidup Traefik Ingress Controller di port API internal 8080.",
      curlCommand: "curl -s http://127.0.0.1:8080/ping",
      responseSample: "OK",
      howToTest: [
        "Jalankan perintah curl di atas pada server host.",
        "Periksa apakah response mengembalikan teks 'OK'.",
        "Kunjungi dashboard Traefik di http://127.0.0.1:8080/dashboard/ untuk memantau active routers."
      ]
    },
    dos: [
      "Wajib memvalidasi nama domain/subdomain dengan regex ^[a-z0-9-]+$.",
      "Wajib menyematkan middleware security-headers (HSTS, nosniff, frame-deny).",
      "Wajib mengarahkan entrypoint web (port 80) ke websecure (port 443)."
    ],
    donts: [
      "Dilarang mengekspos Traefik API/dashboard port 8080 ke internet tanpa basic auth.",
      "Dilarang memasukkan input mentah pengguna ke dalam string label router rule."
    ]
  },
  {
    id: "BP-CGROUP-01",
    term: "Pembatas Kuota Server (Linux cgroups v2 Sandboxing)",
    category: "Keamanan & Server Host",
    service: "03-provision-orchestrator",
    serviceName: "Service 03: Container Provision Orchestrator & Infra",
    icon: "⚖️",
    definition: "Pemberi jatah kuota server agar adil. Tiap website dibatasi maksimal RAM 256MB dan CPU 0.5 vCPU. Jika ada satu website pelanggan viral mendadak atau diserang hacker, website pelanggan lain tetap lancar.",
    requirements: ["Linux Kernel 5.8+", "cgroups v2 hierarchy", "Memory Limit 256MB", "CPU Quota 50000"],
    fileReference: "services/03-provision-orchestrator/internal/docker/",
    cliCommand: "docker stats --no-stream --format 'table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}'",
    guideSteps: [
      "Tentukan HostConfig.Memory = 268435456 (256 * 1024 * 1024 bytes) saat spawning.",
      "Tentukan HostConfig.NanoCPUs = 500000000 (0.5 vCPU).",
      "Jatuhkan seluruh hak akses istimewa: CapDrop = ['ALL'].",
      "Pasang volume tmpfs untuk direktori cache sementara (/tmp) agar write memory terkontrol."
    ],
    doAndDont: "WAJIB monitor peringatan OOM killer; DILARANG membiarkan kontainer tenant jalan tanpa batas memori.",
    flowchart: [
      "Pelanggan memicu beban tinggi di website (misal: traffic spike)",
      "Kernel Linux memantau cgroups v2 resource tree kontainer",
      "CPU dibatasi pada 50% core (NanoCPUs = 500000000)",
      "Penggunaan RAM diatur ketat dengan hard limit 256MB",
      "Jika tembus 256MB, OOM killer menghentikan proses kontainer",
      "Kontainer di-restart otomatis oleh daemon tanpa mengganggu kontainer lain"
    ],
    inDepthExplanation: "cgroups v2 (Control Groups) adalah fitur kernel Linux modern yang memungkinkan pembatasan, prioritisasi, dan isolasi konsumsi sumber daya sistem (CPU, Memori, I/O disk) antar kelompok proses. Di HeroCMS, cgroups v2 menjadi tameng utama yang mencegah Denial of Service (DoS) dan fork bomb dari satu website tenant merembet ke seluruh server produksi.",
    golangImplementation: {
      file: "services/03-provision-orchestrator/internal/docker/cgroups.go",
      explanation: "Konfigurasi spesifik cgroups v2 pada HostConfig Docker Engine SDK Golang.",
      codeSnippet: `package docker

import "github.com/docker/docker/api/types/container"

func BuildHardenedHostConfig() *container.HostConfig {
    return &container.HostConfig{
        Resources: container.Resources{
            Memory:     256 * 1024 * 1024, // 256 MB Hard limit
            MemorySwap: 256 * 1024 * 1024, // Disable swap to prevent disk thrashing
            NanoCPUs:   500000000,         // 0.5 CPU core
            PidsLimit:  &[]int64{100}[0],   // Anti fork-bomb
        },
        CapDrop:        []string{"ALL"},
        ReadonlyRootfs: true,
        AutoRemove:     false,
    }
}`
    },
    apiEndpoint: {
      title: "Telemetri Resource Quota Kontainer Tenant",
      method: "GET",
      path: "/api/v1/containers/:id/stats",
      port: 8086,
      description: "Membaca data live konsumsi RAM dan CPU kontainer tenant langsung dari cgroups v2 kernel.",
      curlCommand: "curl -s http://127.0.0.1:8086/api/v1/containers/pod-kedai-kopi/stats",
      responseSample: `{
  "container": "pod-kedai-kopi",
  "memoryUsageMB": 42.8,
  "memoryLimitMB": 256.0,
  "memoryPercentage": "16.7%",
  "cpuPercentage": "1.2%",
  "pidsCount": 8,
  "status": "healthy"
}`,
      howToTest: [
        "Jalankan kueri stats di atas dengan container ID atau nama pod.",
        "Bandingkan dengan hasil terminal: docker stats --no-stream pod-kedai-kopi.",
        "Verifikasi memory limit tepat 256MB."
      ]
    },
    dos: [
      "Wajib mematikan alokasi swap tambahan (MemorySwap = Memory) agar tidak menghabiskan IOPS SSD.",
      "Wajib mengatur PidsLimit maksimal 100 per kontainer untuk menangkal serangan fork bomb.",
      "Wajib memantau event OOM (Out Of Memory) melalui log monitor."
    ],
    donts: [
      "Dilarang menjalankan kontainer tenant tanpa alokasi batasan RAM.",
      "Dilarang mengizinkan kontainer tenant mengakses cgroup filesystem host (/sys/fs/cgroup)."
    ]
  },
  {
    id: "BP-BIN-01",
    term: "Mode Satu Berkas Ringkas (Single-Binary Gin + Vue BFF)",
    category: "Backend & Deployment",
    service: "02-dashboard-cms",
    serviceName: "Service 02: Dashboard Studio & Go BFF",
    icon: "📦",
    definition: "Seluruh aset antarmuka Vue 3 dikompilasi dan dibungkus langsung ke dalam satu file binary executable Go menggunakan fitur embed.FS. Server produksi tidak membutuhkan Node.js dan langsung menyala di port 8085.",
    requirements: ["Go 1.22+", "Gin Web Framework", "Vite Production Build", "Port 8085"],
    fileReference: "services/02-dashboard-cms/cmd/server/main.go",
    cliCommand: "cd services/02-dashboard-cms && go run cmd/server/main.go",
    guideSteps: [
      "Jalankan vite build pada folder frontend sehingga aset statis ter-hash masuk ke dist/.",
      "Gunakan direktif Go: //go:embed dist/* var staticFS embed.FS di main.go.",
      "Gin menyajikan rute /assets/* dengan header Cache-Control: public, max-age=31536000, immutable.",
      "Semua rute antarmuka SPA di-fallback ke index.html."
    ],
    doAndDont: "WAJIB code-split vendor di vite.config.ts; DILARANG memasang runtime Node.js di server produksi kontainer.",
    flowchart: [
      "Vite mengompilasi Vue 3 SPA menjadi HTML, CSS, JS di folder dist/",
      "Kompiler Go membaca folder dist/ via direktif //go:embed dist/*",
      "Kompilasi Go menghasilkan satu berkas binary tunggal (dashboard-server)",
      "Binary disalin ke base image Alpine kosong (tanpa Node.js / Nginx)",
      "Server menyala dalam hitungan 15 milidetik di port 8085",
      "Aset statis disajikan dari memory cache RAM dengan latensi instan"
    ],
    inDepthExplanation: "Arsitektur Single-Binary menyatukan Frontend SPA Vue 3 dan Backend Go Gin ke dalam satu file executable yang berdiri sendiri (self-contained). Hal ini memangkas kerumitan orkestrasi: tidak perlu mengelola dua kontainer terpisah (Nginx + Backend) untuk satu dashboard, mengeliminasi overhead koneksi reverse proxy lokal, dan memangkas ukuran image Docker menjadi di bawah 30MB.",
    golangImplementation: {
      file: "services/02-dashboard-cms/cmd/server/main.go",
      explanation: "Pola penyajian embed.FS statis dengan fallback Single Page Application (SPA) pada Gin Web Framework.",
      codeSnippet: `package main

import (
    "embed"
    "io/fs"
    "net/http"
    "github.com/gin-gonic/gin"
)

//go:embed dist/*
var staticFS embed.FS

func setupRouter() *gin.Engine {
    r := gin.New()
    r.Use(gin.Recovery())

    // Sub-filesystem mengarah langsung ke dalam folder dist
    distSub, _ := fs.Sub(staticFS, "dist")
    assetsSub, _ := fs.Sub(distSub, "assets")

    // Sajikan aset ter-hash dengan header caching jangka panjang
    r.StaticFS("/assets", http.FS(assetsSub))

    // Fallback semua rute antarmuka SPA ke index.html
    r.NoRoute(func(c *gin.Context) {
        indexHTML, _ := distSub.Open("index.html")
        http.ServeContent(c.Writer, c.Request, "index.html", time.Now(), indexHTML.(io.ReadSeeker))
    })

    return r
}`
    },
    apiEndpoint: {
      title: "Verifikasi Binary Healthcheck & Info Versi",
      method: "GET",
      path: "/healthz",
      port: 8085,
      description: "Memeriksa bahwa binary Go BFF menyala dan menyajikan static FS dengan benar.",
      curlCommand: "curl -s -I http://127.0.0.1:8085/healthz",
      responseSample: `HTTP/1.1 200 OK
Content-Type: application/json
Date: Mon, 19 Oct 2026 09:50:00 GMT

{"status":"healthy","service":"dashboard-cms","version":"v1.14.27"}`,
      howToTest: [
        "Jalankan go run cmd/server/main.go pada folder services/02-dashboard-cms.",
        "Buka browser di http://127.0.0.1:8085/ dan verifikasi antarmuka Vue 3 termuat.",
        "Periksa bahwa endpoint API /api/v1/* dan file statis /assets/* berjalan dari proses yang sama."
      ]
    },
    dos: [
      "Wajib menyematkan header Cache-Control: immutable pada seluruh file di /assets/*.",
      "Wajib melakukan fallback rute yang tidak dikenal (NoRoute) ke file index.html.",
      "Wajib menonaktifkan runtime Node.js pada image produksi (Stage multi-stage Docker)."
    ],
    donts: [
      "Dilarang memasang Nginx di depan Go BFF jika Go sudah mampu menyajikan static file secara native.",
      "Dilarang mengubah struktur folder dist setelah build selesai."
    ]
  },
  {
    id: "BP-REDIS-01",
    term: "Pencatat Pengunjung Kilat (Redis 7 Sorted Sets / ZSET)",
    category: "Memori Kilat & Cache",
    service: "02-dashboard-cms",
    serviceName: "Service 02: Dashboard Studio & Go BFF",
    icon: "⚡",
    definition: "Buku tamu digital super kencang di memori RAM. Setiap kali artikel dibaca, Redis mencatat dalam waktu kurang dari 1 milidetik (<1ms), sehingga database PostgreSQL tidak kelelahan saat website ramai.",
    requirements: ["Redis 7.2", "Port 6379", "In-Memory Store", "Latensi < 1ms"],
    fileReference: "services/02-dashboard-cms/internal/redis/telemetry.go",
    cliCommand: "redis-cli PING && redis-cli INFO stats",
    guideSteps: [
      "Hit masuk diterima oleh Gin tracker middleware secara non-blocking.",
      "IP pengunjung di-hash dengan SHA256 + salt harian (aman GDPR).",
      "Jalankan command atomik: ZINCRBY tenant:{id}:top_views 1 {article_id}.",
      "Ambil 5 artikel teratas instan: ZREVRANGE tenant:{id}:top_views 0 4 WITHSCORES."
    ],
    doAndDont: "WAJIB gunakan ZSET untuk counter berkecepatan tinggi; DILARANG kueri SELECT COUNT(*) ke PostgreSQL pada setiap page hit.",
    flowchart: [
      "Pengunjung membuka artikel di website tenant",
      "Gin tracker middleware menangkap request secara asinkron",
      "Hitung skor hit menggunakan ZINCRBY di Redis 7 (<1ms)",
      "Data tersimpan di struktur Sorted Set: tenant:{id}:top_articles",
      "Dashboard admin meminta 5 artikel terpopuler",
      "ZREVRANGE membaca skor langsung dari RAM tanpa sentuh PostgreSQL"
    ],
    inDepthExplanation: "Operasi hitung pengunjung (page views) jika dieksekusi menggunakan perintah SQL UPDATE di database relasional PostgreSQL akan menimbulkan lock contention dan kelelahan I/O saat traffic memuncak. Redis Sorted Sets (ZSET) menyimpan data dalam struktur data skip-list di memori RAM dengan kompleksitas waktu O(log(N)), memungkinkan jutaan update counter per detik dengan latensi sub-milidetik.",
    golangImplementation: {
      file: "services/02-dashboard-cms/internal/redis/telemetry.go",
      explanation: "Implementasi fungsi Go untuk mencatat view dan mengambil daftar artikel terpopuler menggunakan go-redis.",
      codeSnippet: `package redis

import (
    "context"
    "fmt"
    "github.com/redis/go-redis/v9"
)

func RecordArticleView(ctx context.Context, rdb *redis.Client, tenantID, articleID string) error {
    key := fmt.Sprintf("tenant:%s:top_views", tenantID)
    return rdb.ZIncrBy(ctx, key, 1, articleID).Err()
}

func GetTopArticles(ctx context.Context, rdb *redis.Client, tenantID string, limit int64) ([]redis.Z, error) {
    key := fmt.Sprintf("tenant:%s:top_views", tenantID)
    return rdb.ZRevRangeWithScores(ctx, key, 0, limit-1).Result()
}`
    },
    apiEndpoint: {
      title: "API Top Articles Telemetry",
      method: "GET",
      path: "/api/v1/analytics/top-articles",
      port: 8085,
      description: "Mengambil 5 artikel paling populer berdasarkan penghitungan Sorted Set Redis.",
      curlCommand: "curl -s -H 'Authorization: Bearer <TOKEN>' http://127.0.0.1:8085/api/v1/analytics/top-articles",
      responseSample: `{
  "success": true,
  "data": [
    { "articleId": "art_991", "views": 1420 },
    { "articleId": "art_884", "views": 980 }
  ],
  "latencyMs": 0.45
}`,
      howToTest: [
        "Kirim hit buatan dengan: redis-cli ZINCRBY tenant:ten_123:top_views 5 art_991.",
        "Panggil endpoint cURL di atas.",
        "Verifikasi respons mengembalikan art_991 di urutan nomor satu dengan 5 views."
      ]
    },
    dos: [
      "Wajib menyertakan namespace tenant:{id}: pada semua key Redis untuk isolasi multi-tenant.",
      "Wajib mengatur TTL (Time-To-Live) pada cache sementara untuk mencegah kebocoran RAM.",
      "Wajib menggunakan ZINCRBY untuk penambahan counter yang atomik dan thread-safe."
    ],
    donts: [
      "Dilarang menjalankan perintah KEYS * di Redis produksi (gunakan SCAN jika diperlukan).",
      "Dilarang menyimpan data relasi invoice atau data permanen tanpa replikasi PostgreSQL."
    ]
  },
  {
    id: "BP-MINIO-01",
    term: "Penyimpanan Brankas File (MinIO S3 Object Storage)",
    category: "Penyimpanan File & Aset",
    service: "02-dashboard-cms",
    serviceName: "Service 02: Dashboard Studio & Go BFF",
    icon: "🗃️",
    definition: "Brankas penyimpanan foto produk, dokumen, dan logo. Gambar tidak disimpan di database agar server tidak berat, melainkan diunggah langsung ke storage MinIO S3 dengan batas kuota otomatis paket langganan.",
    requirements: ["MinIO S3", "Port 9000 (API) & 9001 (UI)", "Presigned PUT URLs", "Magic Bytes Validator"],
    fileReference: "services/02-dashboard-cms/internal/storage/minio.go",
    cliCommand: "curl -I http://127.0.0.1:9000/minio/health/live",
    guideSteps: [
      "Browser meminta Presigned URL ke Go BFF POST /api/v1/media/presign-upload.",
      "BFF memeriksa apakah agregat pemakaian file tenant masih di bawah kuota paket.",
      "Jika aman, BFF mengembalikan Presigned PUT URL berbatas waktu 15 menit.",
      "Browser mengunggah file langsung ke MinIO; Webhook memverifikasi magic bytes gambar."
    ],
    doAndDont: "WAJIB simpan file di prefix terisolasi tenants/{tenant_id}/; DILARANG izinkan upload file executable (.php, .sh, .exe).",
    flowchart: [
      "Pengguna memilih file gambar di MediaLibraryModule.vue",
      "Browser request Presigned URL ke Go BFF (/api/v1/media/presign-upload)",
      "BFF memvalidasi kuota penyimpanan paket langganan tenant",
      "BFF menghasilkan Presigned PUT URL MinIO (expired 15 menit)",
      "Browser mengunggah file biner langsung ke MinIO S3 (Port 9000)",
      "Server BFF tidak terbebani I/O stream file besar"
    ],
    inDepthExplanation: "Penyimpanan objek media menggunakan MinIO S3 yang kompatibel dengan standar AWS S3. Dengan arsitektur Presigned URL, browser pengguna mengunggah file langsung ke storage cluster tanpa harus melewati server aplikasi Go BFF. Hal ini mencegah memory spiking pada server API saat ribuan tenant mengunggah foto banner beresolusi tinggi secara bersamaan.",
    golangImplementation: {
      file: "services/02-dashboard-cms/internal/storage/minio.go",
      explanation: "Pembuat Presigned PUT URL menggunakan minio-go SDK resmi dengan isolasi path prefix per-tenant.",
      codeSnippet: `package storage

import (
    "context"
    "fmt"
    "net/url"
    "time"
    "github.com/minio/minio-go/v7"
)

func GeneratePresignedUploadURL(ctx context.Context, client *minio.Client, bucket, tenantID, fileName string) (*url.URL, error) {
    // Isolasi ketat: file disimpan di dalam folder tenants/<tenant_id>/
    objectPath := fmt.Sprintf("tenants/%s/%s", tenantID, fileName)
    expires := time.Minute * 15

    return client.PresignedPutObject(ctx, bucket, objectPath, expires)
}`
    },
    apiEndpoint: {
      title: "Permintaan Presigned Upload URL",
      method: "POST",
      path: "/api/v1/media/presign-upload",
      port: 8085,
      description: "Membuat URL unggah sementara yang aman untuk mengunggah file langsung ke MinIO S3.",
      requestBody: `{
  "fileName": "banner-hero.webp",
  "fileSize": 245000,
  "contentType": "image/webp"
}`,
      curlCommand: `curl -s -X POST http://127.0.0.1:8085/api/v1/media/presign-upload \\
  -H "Authorization: Bearer <TOKEN>" \\
  -H "Content-Type: application/json" \\
  -d '{"fileName":"banner-hero.webp","fileSize":245000,"contentType":"image/webp"}'`,
      responseSample: `{
  "success": true,
  "uploadUrl": "http://minio.stackbyte.id/herocms-media/tenants/ten_123/banner-hero.webp?X-Amz-Algorithm=...",
  "publicUrl": "http://minio.stackbyte.id/herocms-media/tenants/ten_123/banner-hero.webp",
  "expiresIn": 900
}`,
      howToTest: [
        "Kirim request cURL di atas.",
        "Gunakan curl -X PUT --upload-file banner-hero.webp '<uploadUrl>'.",
        "Buka publicUrl di browser untuk memastikan gambar dapat diakses."
      ]
    },
    dos: [
      "Wajib memverifikasi magic bytes (file signature) untuk memastikan file benar-benar gambar.",
      "Wajib memisahkan bucket atau prefix tenants/{tenant_id}/ untuk setiap pelanggan.",
      "Wajib menyetel masa kedaluwarsa presigned URL maksimal 15 menit."
    ],
    donts: [
      "Dilarang mengizinkan upload file dengan ekstensi berbahaya (.php, .sh, .py, .exe, .html).",
      "Dilarang mengekspos MinIO ROOT Access Key dan Secret Key ke browser klien."
    ]
  },
  {
    id: "BP-BILL-01",
    term: "Kasir Pembayaran Otomatis (Midtrans / Xendit Payment Gateway)",
    category: "Monetisasi & Billing SaaS",
    service: "01-admin-console",
    serviceName: "Service 01: Admin Console & Billing Platform",
    icon: "💳",
    definition: "Sistem kasir online terintegrasi QRIS, Virtual Account, dan Kartu Kredit. Saat pelanggan transfer dan lunas, sistem kasir langsung menaikkan kuota dan paket akun secara otomatis detik itu juga.",
    requirements: ["Laravel 11", "Filament v3", "PHP 8.3", "Midtrans Snap SDK", "HMAC SHA512"],
    fileReference: "services/01-admin-console/app/Http/Controllers/Billing/",
    cliCommand: "cd services/01-admin-console && php artisan route:list | grep billing",
    guideSteps: [
      "Pengguna memilih paket (Pro Rp 149rb / Agency Rp 499rb) di BillingPlanModule.vue.",
      "Admin Console membuat transaksi ke Midtrans dan menghasilkan Snap Token.",
      "Popup kasir Midtrans Snap terbuka di layar pengguna untuk pembayaran.",
      "Webhook notifikasi Midtrans diterima, diverifikasi SHA512 signature, dan kuota paket diaktifkan otomatis."
    ],
    doAndDont: "WAJIB verifikasi signature SHA512 di webhook; DILARANG meng-upgrade paket hanya berdasarkan callback URL client browser.",
    flowchart: [
      "Pelanggan memilih paket Pro/Agency di Studio (02)",
      "Permintaan diteruskan ke Service 01 Admin Console",
      "Admin Console menghubungi Midtrans API menghasilkan Snap Token",
      "Popup pembayaran Midtrans muncul di layar (QRIS / VA / CC)",
      "Pelanggan menyelesaikan pembayaran di aplikasi m-banking",
      "Webhook notifikasi masuk dari Midtrans ke Service 01",
      "Service 01 verifikasi tanda tangan HMAC SHA512",
      "Kuota paket akun tenant dinaikkan otomatis"
    ],
    inDepthExplanation: "Sistem billing HeroCMS terpusat pada Service 01 (Admin Console & Billing). Untuk keamanan finansial mutlak, aktivasi kuota tidak pernah dilakukan berdasarkan callback di sisi client browser (karena rawan manipulasi URL). Sebagai gantinya, aktivasi akun hanya dipicu oleh HTTP webhook server-to-server yang divalidasi dengan tanda tangan cryptographic hash SHA512 (order_id + status_code + gross_amount + server_key).",
    golangImplementation: {
      file: "services/01-admin-console/app/Http/Controllers/Billing/WebhookController.php",
      explanation: "Verifikasi tanda tangan kriptografis webhook Midtrans pada backend PHP/Laravel.",
      codeSnippet: `<?php
namespace App\\Http\\Controllers\\Billing;

use Illuminate\\Http\\Request;
use App\\Models\\Subscription;

class WebhookController {
    public function handle(Request $request) {
        $payload = $request->all();
        $serverKey = config('services.midtrans.server_key');
        
        // Buat signature pembanding
        $inputSignature = $payload['signature_key'] ?? '';
        $calcSignature = hash('sha512', $payload['order_id'] . $payload['status_code'] . $payload['gross_amount'] . $serverKey);
        
        if ($inputSignature !== $calcSignature) {
            return response()->json(['error' => 'Invalid signature'], 403);
        }
        
        if ($payload['transaction_status'] === 'settlement') {
            Subscription::activateTenantPlan($payload['order_id']);
        }
        
        return response()->json(['status' => 'success']);
    }
}`
    },
    apiEndpoint: {
      title: "Webhook Receiver Notifikasi Pembayaran",
      method: "POST",
      path: "/api/v1/billing/webhook/midtrans",
      port: 8081,
      description: "Menerima notifikasi status transaksi lunas dari gateway Midtrans secara server-to-server.",
      requestBody: `{
  "order_id": "INV-2026-9921",
  "status_code": "200",
  "gross_amount": "149000.00",
  "signature_key": "a1b2c3d4e5f6...",
  "transaction_status": "settlement"
}`,
      curlCommand: `curl -s -X POST http://127.0.0.1:8081/api/v1/billing/webhook/midtrans \\
  -H "Content-Type: application/json" \\
  -d '{"order_id":"INV-2026-9921","status_code":"200","gross_amount":"149000.00","signature_key":"hash","transaction_status":"settlement"}'`,
      responseSample: `{"status":"success","message":"Langganan berhasil diaktifkan"}`,
      howToTest: [
        "Jalankan simulator Midtrans Payment Sandbox.",
        "Kirim mock webhook pelunasan ke endpoint lokal.",
        "Periksa di tabel subscriptions bahwa plan_tier berubah menjadi 'pro'."
      ]
    },
    dos: [
      "Wajib memverifikasi tanda tangan SHA512 pada setiap notifikasi webhook masuk.",
      "Wajib menerapkan sifat idempoten (idempotency key) agar webhook berulang tidak memicu duplikasi langganan.",
      "Wajib mencatat audit log pembayaran lengkap dengan transaction_id resmi."
    ],
    donts: [
      "Dilarang mengaktifkan fitur premium hanya dari response frontend tanpa validasi webhook backend.",
      "Dilarang menyimpan nomor kartu kredit pelanggan di basis data lokal."
    ]
  },
  {
    id: "BP-SSRF-01",
    term: "Satpam Anti-Penyusupan Jaringan (Anti-SSRF Webhook Dispatcher)",
    category: "Keamanan Jaringan & Integrasi",
    service: "02-dashboard-cms",
    serviceName: "Service 02: Dashboard Studio & Go BFF",
    icon: "🛡️",
    definition: "Penyaring sinyal keluar. Memastikan webhook sistem hanya mengirim data ke alamat publik resmi (seperti Telegram, Instagram, n8n), dan memblokir upaya tembak ke alamat rahasia internal server (127.0.0.1).",
    requirements: ["Go Custom HTTP Client", "DialContext Validator", "Timeout 5 detik", "Private IP Blacklist"],
    fileReference: "services/02-dashboard-cms/internal/service/webhook.go",
    cliCommand: "cd services/02-dashboard-cms && go test -v ./pentest/...",
    guideSteps: [
      "Event post.published atau container.alert memicu pengiriman webhook.",
      "DialContext menyelesaikan kueri DNS dan memeriksa alamat IP hasil resolve.",
      "Jika IP masuk ke range 127.0.0.0/8, 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, koneksi langsung diputus.",
      "Jika aman, request HTTP POST dikirim dengan payload terenkripsi HMAC signature."
    ],
    doAndDont: "WAJIB periksa IP hasil resolve DNS tepat saat koneksi dibuka (anti-DNS rebinding); DILARANG izinkan kirim ke localhost.",
    flowchart: [
      "Aplikasi memicu event webhook (misal: order.created)",
      "Custom HTTP Client memanggil DialContext untuk DNS resolve",
      "Pemeriksaan IP target: Apakah tergolong private/loopback?",
      "Jika private (127.0.0.1, 10.0.0.0/8, 169.254.169.254): KONEKSI DIBLOKIR (Anti-SSRF)",
      "Jika IP publik valid: Buka koneksi TLS & kirim payload biner",
      "Catat log pengiriman webhook ke tabel audit"
    ],
    inDepthExplanation: "Server-Side Request Forgery (SSRF) adalah celah keamanan di mana penyerang memanfaatkan server aplikasi untuk mengirim request HTTP berbahaya ke port internal server, metadata AWS/GCP (169.254.169.254), atau database lokal. HeroCMS menerapkan Custom DialContext pada Go HTTP Client yang memeriksa alamat IP hasil resolusi DNS secara langsung saat handshake soket TCP dibuka, menangkal serangan DNS Rebinding secara mutlak.",
    golangImplementation: {
      file: "services/02-dashboard-cms/internal/service/webhook_client.go",
      explanation: "Implementasi Custom Go HTTP Transport yang memblokir alamat IP privat dan loopback.",
      codeSnippet: `package service

import (
    "context"
    "fmt"
    "net"
    "net/http"
    "time"
)

func NewSafeHTTPClient() *http.Client {
    dialer := &net.Dialer{Timeout: 5 * time.Second}
    
    transport := &http.Transport{
        DialContext: func(ctx context.Context, network, addr string) (net.Conn, error) {
            host, port, _ := net.SplitHostPort(addr)
            ips, err := net.LookupIP(host)
            if err != nil { return nil, err }
            
            for _, ip := range ips {
                if ip.IsLoopback() || ip.IsPrivate() || ip.IsLinkLocalUnicast() {
                    return nil, fmt.Errorf("SSRF Protection: koneksi ke IP privat %s diblokir", ip.String())
                }
            }
            return dialer.DialContext(ctx, network, net.JoinHostPort(ips[0].String(), port))
        },
    }
    return &http.Client{Transport: transport, Timeout: 10 * time.Second}
}`
    },
    apiEndpoint: {
      title: "Uji Webhook Dispatcher Anti-SSRF",
      method: "POST",
      path: "/api/v1/webhooks/test",
      port: 8085,
      description: "Menguji pengiriman webhook ke URL target yang ditentukan pengguna dengan perlindungan anti-SSRF.",
      requestBody: `{
  "targetUrl": "http://127.0.0.1:5432"
}`,
      curlCommand: `curl -s -X POST http://127.0.0.1:8085/api/v1/webhooks/test \\
  -H "Authorization: Bearer <TOKEN>" \\
  -H "Content-Type: application/json" \\
  -d '{"targetUrl":"http://127.0.0.1:5432"}'`,
      responseSample: `{
  "success": false,
  "error": "SSRF Protection: koneksi ke IP privat 127.0.0.1 diblokir",
  "blocked": true
}`,
      howToTest: [
        "Kirim targetUrl berisi 'http://127.0.0.1:5432' atau 'http://169.254.169.254'.",
        "Pastikan response mengembalikan error SSRF Protection blocked.",
        "Kirim targetUrl berisi domain publik 'https://webhook.site/...' dan pastikan lolos."
      ]
    },
    dos: [
      "Wajib memeriksa alamat IP tepat saat soket TCP dibuka di dalam DialContext.",
      "Wajib membatasi durasi timeout pengiriman maksimal 5 detik.",
      "Wajib menyertakan HMAC-SHA256 signature pada header X-HeroCMS-Signature."
    ],
    donts: [
      "Dilarang menggunakan http.DefaultClient untuk memanggil URL yang dimasukkan oleh pengguna.",
      "Dilarang mengizinkan pengalihan (redirect) HTTP menuju IP privat."
    ]
  },
  {
    id: "BP-MOB-01",
    term: "Aplikasi Pendamping di HP (HeroCMS Mobile Companion)",
    category: "Aplikasi Mobile Smartphone",
    service: "06-mobile-companion",
    serviceName: "Service 06: Mobile Companion Platform",
    icon: "📱",
    definition: "Aplikasi praktis di smartphone Android & iOS yang dirancang Tyno. Pemilik web bisa memantau pengunjung live hari ini, terima notifikasi lead pesan baru, dan menekan tombol darurat restart situs lewat FaceID.",
    requirements: ["Flutter 3.x / React Native", "Firebase Cloud Messaging (FCM)", "Biometrics Auth", "Offline Cache"],
    fileReference: "mobile-companion/",
    cliCommand: "cd mobile-companion && ls -la",
    guideSteps: [
      "Aplikasi HP melakukan registrasi device FCM token ke Go BFF saat pertama kali login.",
      "Backend mengirimkan push notification saat ada formulir leads baru atau invoice terbit.",
      "Layar utama menampilkan kartu ringkasan telemetri pengunjung live dan status kontainer.",
      "Fitur Emergency Reboot meminta konfirmasi sidik jari atau FaceID sebelum mengirim payload restart."
    ],
    doAndDont: "WAJIB sediakan offline-first caching metrik; DILARANG membebani mobile app dengan kanvas visual block editor.",
    flowchart: [
      "Pengguna membuka aplikasi HeroCMS di smartphone iOS/Android",
      "Autentikasi biometrik FaceID / Fingerprint lokal",
      "Koneksi sinkronisasi data telemetri ke Go BFF (Port 8085)",
      "Server mengirimkan live telemetry: total visitor & container health",
      "Firebase Cloud Messaging (FCM) mengirim push alert bila ada lead/pesan baru",
      "Tombol darurat 'Restart Pod' memicu eksekusi reboot aman"
    ],
    inDepthExplanation: "Aplikasi mobile companion dirancang khusus untuk mobilitas pemilik situs web. Alih-alih memaksakan kanvas block page builder yang berat ke layar kecil smartphone, aplikasi ini difokuskan pada tiga pilar fungsional utama: pemantauan analitik pengunjung waktu-nyata, penerimaan instan notifikasi leads formulir kontak, dan aksi pemeliharaan darurat (emergency reboot).",
    golangImplementation: {
      file: "services/02-dashboard-cms/internal/mobile/fcm.go",
      explanation: "Handler Go BFF untuk mendaftarkan token perangkat FCM dan mengirimkan push alert ke smartphone.",
      codeSnippet: `package mobile

import (
    "context"
    "firebase.google.com/go/v4/messaging"
)

func SendLeadAlertPush(ctx context.Context, fcmClient *messaging.Client, deviceToken, visitorName, phone string) error {
    message := &messaging.Message{
        Token: deviceToken,
        Notification: &messaging.Notification{
            Title: "🎉 Calon Pembeli Baru!",
            Body:  visitorName + " baru saja mengirim formulir kontak (" + phone + ")",
        },
        Data: map[string]string{
            "type": "lead_submission",
        },
    }
    _, err := fcmClient.Send(ctx, message)
    return err
}`
    },
    apiEndpoint: {
      title: "Registrasi Token FCM Mobile Device",
      method: "POST",
      path: "/api/v1/mobile/devices/register",
      port: 8085,
      description: "Mendaftarkan FCM Token perangkat smartphone ke database tenant.",
      requestBody: `{
  "fcmToken": "fcm_device_token_xyz_8819",
  "deviceModel": "iPhone 15 Pro",
  "os": "iOS 18.0"
}`,
      curlCommand: `curl -s -X POST http://127.0.0.1:8085/api/v1/mobile/devices/register \\
  -H "Authorization: Bearer <TOKEN>" \\
  -H "Content-Type: application/json" \\
  -d '{"fcmToken":"fcm_xyz","deviceModel":"iPhone 15 Pro","os":"iOS"}'`,
      responseSample: `{"success":true,"message":"Perangkat berhasil didaftarkan"}`,
      howToTest: [
        "Kirim payload pendaftaran device di atas.",
        "Verifikasi token tersimpan di basis data pada tabel mobile_devices.",
        "Kirim pesan tes dari backend untuk memverifikasi notifikasi muncul di ponsel."
      ]
    },
    dos: [
      "Wajib memverifikasi autentikasi biometrik sebelum mengeksekusi operasi restart kontainer.",
      "Wajib mengimplementasikan offline-first caching agar data telemetri tetap bisa dibaca saat sinyal lemah.",
      "Wajib memperbarui token FCM saat token mengalami refresh di ponsel."
    ],
    donts: [
      "Dilarang memasukkan canvas visual editor drag-and-drop ke dalam aplikasi mobile.",
      "Dilarang menyimpan secret token master di storage aplikasi tanpa enkripsi Keystore/Keychain."
    ]
  },
  {
    id: "BP-AI-01",
    term: "Asisten Cerdas Penulis Konten (HeroCMS AI Copilot)",
    category: "Kecerdasan Buatan & Otomasi",
    service: "05-ai-agent-service",
    serviceName: "Service 05: AI Agent Service & Workflows",
    icon: "🤖",
    definition: "Robot asisten di editor visual. Pemilik web cukup ketik 'Toko Kopi Kekinian', maka AI langsung membuatkan susunan teks judul hero, deskripsi produk, tombol ajakan, dan template blok siap pakai.",
    requirements: ["Google Gemini API / Claude LLM", "Python / Go Service", "n8n Automation", "Streaming SSE"],
    fileReference: "services/05-ai-agent-service/",
    cliCommand: "curl -I http://127.0.0.1:8090/healthz",
    guideSteps: [
      "Pengguna mengklik tombol Copilot 'Bantu Tulis Konten AI' di VisualEditorModule.vue.",
      "Prompt instruksi bisnis diteruskan ke microservice AI dengan batasan token ketat.",
      "Keluaran teks di-stream menggunakan Server-Sent Events (SSE) dengan Time-To-First-Token < 800ms.",
      "Hasil teks disanitasi dan dimasukkan langsung ke komponen blok yang sedang aktif."
    ],
    doAndDont: "WAJIB sanitasi output JSON/teks dari LLM sebelum preview; DILARANG menjalankan perintah sistem host dari prompt AI.",
    flowchart: [
      "Pengguna mengetik prompt ide bisnis di Visual Editor (02)",
      "Request diteruskan ke Service 05 AI Agent Service",
      "AI Service memeriksa sisa kuota prompt bulanan tenant",
      "Model LLM (Gemini 1.5 Pro) memproses teks dengan streaming SSE",
      "Karakter pertama muncul di layar (TTFT < 800ms)",
      "DOMPurify membersihkan tag HTML berbahaya",
      "Blok teks masuk ke editor visual secara instan"
    ],
    inDepthExplanation: "Microservice 05 (AI Agent Service) menyediakan kapabilitas generative copilot untuk pembuatan halaman web. Dengan mengadopsi protokol Server-Sent Events (SSE), respon teks ditampilkan secara live streaming per-kata (seperti efek mengetik mesin tik) sehingga pengguna tidak mengalami persepsi waktu tunggu yang lama. Time-To-First-Token (TTFT) dijaga di bawah 800ms.",
    golangImplementation: {
      file: "services/05-ai-agent-service/internal/handler/stream.go",
      explanation: "Handler Go untuk mengalirkan teks streaming dari LLM ke browser menggunakan Server-Sent Events (SSE).",
      codeSnippet: `package handler

import (
    "fmt"
    "io"
    "net/http"
    "github.com/gin-gonic/gin"
)

func StreamAICopilotHandler(c *gin.Context) {
    c.Writer.Header().Set("Content-Type", "text/event-stream")
    c.Writer.Header().Set("Cache-Control", "no-cache")
    c.Writer.Header().Set("Connection", "keep-alive")

    prompt := c.Query("prompt")
    stream := aiService.GenerateStream(c.Request.Context(), prompt)

    c.Stream(func(w io.Writer) bool {
        token, ok := stream.NextToken()
        if !ok {
            fmt.Fprintf(w, "event: done\\ndata: [DONE]\\n\\n")
            return false
        }
        fmt.Fprintf(w, "event: message\\ndata: %s\\n\\n", token)
        return true
    })
}`
    },
    apiEndpoint: {
      title: "Streaming AI Copywriting Generator",
      method: "GET",
      path: "/api/v1/ai/generate-copy",
      port: 8090,
      description: "Endpoint streaming SSE untuk menghasilkan copywriting judul dan deskripsi situs web.",
      curlCommand: "curl -N -s 'http://127.0.0.1:8090/api/v1/ai/generate-copy?prompt=Kedai+Kopi+Specialty'",
      responseSample: `event: message
data: Nikmati sensasi seduhan kopi terbaik Nusantara.

event: done
data: [DONE]`,
      howToTest: [
        "Jalankan cURL dengan opsi -N (no-buffer) untuk mengamati aliran teks real-time.",
        "Verifikasi event message diterima bertahap hingga event done.",
        "Periksa di editor visual bahwa teks disanitasi dari karakter XSS."
      ]
    },
    dos: [
      "Wajib membatasi kuota token prompt per-tenant untuk menjaga biaya operasional.",
      "Wajib menyaring input prompt dari upaya jailbreak atau prompt injection.",
      "Wajib membersihkan output teks menggunakan DOMPurify sebelum dirender ke HTML."
    ],
    donts: [
      "Dilarang mengeksekusi hasil teks AI langsung ke baris perintah server.",
      "Dilarang mengizinkan request streaming tanpa batas timeout (maksimal 30 detik)."
    ]
  },
  {
    id: "BP-PENTEST-01",
    term: "Uji Keamanan Otomatis Sebelum Simpan (Pre-Commit Pentest Runner)",
    category: "Jaminan Kualitas & Keamanan",
    service: "02-dashboard-cms",
    serviceName: "Seluruh 7 Microservices HeroCMS",
    icon: "🛡️",
    definition: "Pintu audit keamanan otomatis yang dirancang Rizal. Setiap kali ada kode baru yang mau di-commit, robot penguji keamanan otomatis mengecek celah hacker. Jika ada celah terbuka, kode langsung ditolak sampai diperbaiki.",
    requirements: ["Go Test Runner", "HTTP Black-Box Suite", "OWASP Top 10 Checks", "AGENTS.md Compliance"],
    fileReference: ".agents/skills/herocms-pentest-runner/SKILL.md",
    cliCommand: "cd services/02-dashboard-cms && go test -v ./pentest/...",
    guideSteps: [
      "Developer menyelesaikan pengeditan kode pada salah satu microservice.",
      "Buka terminal dan jalankan pengujian pentest: cd services/<service> && go test -v ./pentest/...",
      "Pentest suite menguji proteksi brute force, manipulasi JWT, header keamanan, dan injection.",
      "Jika hasil PASS atau SKIP, developer diizinkan melakukan git commit dan git push."
    ],
    doAndDont: "WAJIB eksekusi pentest runner sebelum git commit; DILARANG commit jika ada status pengujian FAIL.",
    flowchart: [
      "Developer selesai mengubah kode backend atau routing",
      "Eksekusi perintah: go test -v ./pentest/...",
      "Suite menjalankan pengujian black-box HTTP simulasi serangan",
      "Pengecekan: Rate limiting login, JWT tampering, Header X-Frame-Options",
      "Evaluasi hasil: Apakah ada status FAIL?",
      "Jika PASS: Izin commit diberikan; Jika FAIL: Proses commit dibatalkan"
    ],
    inDepthExplanation: "Pre-Commit Pentest Runner adalah gerbang keamanan otomatis yang ditanamkan di setiap folder service HeroCMS. Pengujian dilakukan dengan pendekatan black-box HTTP testing menggunakan package standar testing Golang. Test suite mensimulasikan teknik serangan nyata seperti brute-force password login, pemalsuan token JWT tanpa signature, dan injeksi karakter path traversal (/../../etc/passwd).",
    golangImplementation: {
      file: "services/02-dashboard-cms/pentest/security_test.go",
      explanation: "Contoh implementasi pengujian header keamanan dan endpoint proteksi di Golang.",
      codeSnippet: `package pentest

import (
    "net/http"
    "testing"
)

func TestDashboard_SecurityHeaders(t *testing.T) {
    baseURL := GetTargetBaseURL(t)
    resp, err := http.Get(baseURL + "/healthz")
    if err != nil {
        t.Skipf("Service tidak aktif: %v", err)
    }
    defer resp.Body.Close()

    // Verifikasi header proteksi clickjacking dan MIME sniffing
    if resp.Header.Get("X-Content-Type-Options") != "nosniff" {
        t.Errorf("Header X-Content-Type-Options wajib nosniff")
    }
}`
    },
    apiEndpoint: {
      title: "Eksekusi Pentest Suite Per-Service",
      method: "GET",
      path: "/pentest/...",
      port: 8085,
      description: "Pengujian penetrasi otomatis yang dijalankan melalui Go test runner.",
      curlCommand: "cd services/02-dashboard-cms && go test -v ./pentest/...",
      responseSample: `=== RUN   TestDashboard_Health
--- PASS: TestDashboard_Health (0.01s)
=== RUN   TestDashboard_SecurityHeaders
--- PASS: TestDashboard_SecurityHeaders (0.01s)
PASS
ok  	github.com/cloudcms/dashboard-cms-backend/pentest	0.024s`,
      howToTest: [
        "Arahkan terminal ke folder service terkait: cd services/02-dashboard-cms.",
        "Jalankan go test -v ./pentest/... di terminal.",
        "Pastikan output menampilkan status PASS pada seluruh suite pengujian."
      ]
    },
    dos: [
      "Wajib menjalankan pengujian sebelum setiap git commit.",
      "Wajib menambahkan test case baru bila menambahkan endpoint publik baru.",
      "Wajib melaporkan log PASS pada keterangan pull request."
    ],
    donts: [
      "Dilarang commit atau push kode jika ada tes yang berstatus FAIL.",
      "Dilarang mematikan pengujian dengan cara me-return nil secara palsu."
    ]
  },
  {
    id: "BP-E2E-01",
    term: "Pengujian Regresi Browser Otomatis (Playwright E2E Regression)",
    category: "Jaminan Kualitas & QA",
    service: "02-dashboard-cms",
    serviceName: "Service 02 & 04 (Frontend Studio & Marketing Site)",
    icon: "🔍",
    definition: "Robot pemeriksa antarmuka otomatis yang dikelola Paijo (QA & QC). Menguji simulasi alur klik pengguna di browser headless Chromium, memastikan 12 modul Studio tidak rusak dan tampilan responsive mobile tetap presisi.",
    requirements: ["Node.js", "@playwright/test", "Headless Chromium/WebKit", "Viewport Matrix"],
    fileReference: "docs/project-management/qa-e2e/playwright.config.ts",
    cliCommand: "npx playwright test --project=chromium",
    guideSteps: [
      "CI Test Runner menyalakan headless Chromium dalam mode headless.",
      "Robot membuka halaman Studio Dashboard dan menguji navigasi 12 modul menu.",
      "Mengambil tangkapan layar (screenshot) dan membandingkan visual diff terhadap baseline.",
      "Memverifikasi tidak ada error di browser console log dan response time rendering < 300ms."
    ],
    doAndDont: "WAJIB uji di resolusi desktop (1440px) dan mobile (375px); DILARANG meloloskan PR yang memiliki regresi visual.",
    flowchart: [
      "Paijo (QA/QC) memicu runner Playwright di CI/CD",
      "Playwright membuka browser headless Chromium & Mobile Safari",
      "Simulasi alur pengguna: Login -> Pilih Modul -> Buat Kontainer -> Edit Blok",
      "Pemeriksaan error console: Memastikan tidak ada uncaught exception",
      "Visual snapshot comparison: Memeriksa layout shift (CLS = 0)",
      "Penerbitan laporan uji kualitas HTML report"
    ],
    inDepthExplanation: "Playwright E2E Regression menguji antarmuka pengguna secara menyeluruh persis seperti yang dialami oleh pengguna manusia di dunia nyata. Pengujian ini memastikan tidak ada CSS visual regresi, tombol tidak rusak, alur pengisian form berjalan lancar, dan peralihan menu 12 modul Studio berlangsung mulus tanpa memory leak.",
    golangImplementation: {
      file: "docs/project-management/qa-e2e/tests/dashboard.spec.ts",
      explanation: "Spesifikasi pengujian otomatis browser Playwright untuk validasi navigasi dan modul Studio.",
      codeSnippet: `import { test, expect } from '@playwright/test';

test('verifikasi navigasi 12 modul studio dan reader view', async ({ page }) => {
    await page.goto('http://127.0.0.1:8085');
    
    // Periksa judul dan status telemetri
    await expect(page.locator('.brand-title')).toContainText('HeroCMS');
    
    // Klik tombol menu Changelog
    await page.click('button:has-text("Changelog")');
    await expect(page.locator('.page-title')).toContainText('Riwayat Rilis');
    
    // Pastikan tidak ada pesan error di antarmuka
    const alertBox = page.locator('.error-toast');
    await expect(alertBox).toHaveCount(0);
});`
    },
    apiEndpoint: {
      title: "Playwright Headless Test Runner Suite",
      method: "GET",
      path: "/playwright/report",
      port: 9323,
      description: "Menjalankan seluruh skenario browser test otomatis dan menyajikan visual report.",
      curlCommand: "npx playwright test",
      responseSample: `Running 12 tests using 4 workers
  12 passed (8.4s)

To open last HTML report run:
  npx playwright show-report`,
      howToTest: [
        "Nyalakan server Studio di port 8085.",
        "Jalankan npx playwright test di terminal.",
        "Buka HTML report untuk melihat screenshot dan trace perekaman klik."
      ]
    },
    dos: [
      "Wajib menguji pada dua ukuran viewport standar: Desktop (1440x900) dan Mobile (375x667).",
      "Wajib memverifikasi bahwa waktu interaksi pengguna (INP) di bawah 200 milidetik.",
      "Wajib melampirkan laporan pengujian pada audit sprint mingguan."
    ],
    donts: [
      "Dilarang meloloskan Pull Request jika ada assertion error pada pengujian browser.",
      "Dilarang menggunakan timeout statis (sleep) yang lama; gunakan waitForSelector."
    ]
  }
];
