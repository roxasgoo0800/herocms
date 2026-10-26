import type { MicroservicePrd } from '../types/docs';

export const microservicePrds: MicroservicePrd[] = [
  {
    id: 'PRD-01',
    serviceId: '01-admin-console',
    title: 'Platform Admin Console (SuperAdmin Hub)',
    serviceName: '01-admin-console',
    badge: 'Internal SuperAdmin',
    version: 'v1.0.0-PROD',
    targetAudience: [
      'Platform SuperAdmin',
      'Site Reliability Engineer (SRE) & DevOps',
      'Customer Support & Helpdesk Specialists',
      'Finance & Billing Operations'
    ],
    techStack: {
      framework: 'Laravel 11.x + FilamentPHP v3',
      language: 'PHP 8.3',
      runtime: 'PHP-FPM + Nginx Alpine',
      databases: ['PostgreSQL 16 (Admin Bypass RLS)', 'Redis 7 (Session & Rate Limit)'],
      keyLibraries: [
        'Filament Shield (RBAC)',
        'Laravel Horizon',
        'Spatie Activitylog',
        'Laravel Impersonate'
      ]
    },
    summary: 'Panel administrasi internal platform terpusat untuk mengelola siklus hidup tenant, paket langganan, pengawasan kuota resource hardware node, penegakan batasan biaya token AI, audit logging aktivitas staf, serta mitigasi insiden operasional secara real-time.',
    coreModules: [
      {
        name: 'Manajemen Siklus Hidup Tenant & Langganan',
        desc: 'Kontrol penuh terhadap seluruh tenant terdaftar di platform Aether Core (Stack CMS).',
        capabilities: [
          'Pencarian, pemfilteran, dan inspeksi profil tenant multi-parameter (nama, email, slug, tier).',
          'Tindakan suspend, unsuspend, dan penghapusan instance tenant dengan perlindungan konfirmasi ganda.',
          'Penyesuaian batas kuota on-demand (jumlah kontainer, storage S3, kuota kunjungan per bulan).',
          'Penugasan paket langganan (Free, Pro, Business, Enterprise) dengan sinkronisasi ke PostgreSQL.'
        ]
      },
      {
        name: 'Telemetri Node Server & Monitoring Kontainer Docker',
        desc: 'Dashboard pengawasan armada server worker dan kesehatan Docker socket.',
        capabilities: [
          'Visualisasi inventaris kontainer Docker aktif di seluruh worker node secara real-time.',
          'Grafik beban CPU, konsumsi RAM, disk IOPS, dan latensi socket Moby Docker Engine.',
          'Peringatan otomatis saat node worker mencapai utilisasi 80% RAM atau CPU.',
          'Daftar kontainer berstatus Degraded atau CrashLoopBackOff dengan tombol force restart.'
        ]
      },
      {
        name: 'Pengawasan Kuota & Anggaran Biaya LLM AI',
        desc: 'Kendali konsumsi token model bahasa besar (LLM) di seluruh tenant.',
        capabilities: [
          'Lacak konsumsi token prompt & response per tenant untuk OpenAI, Anthropic, dan Llama 3.',
          'Estimasi biaya komputasi AI per tenant vs nilai langganan (margin profitabilitas).',
          'Hard rate-limiting per menit/jam untuk mencegah penyalahgunaan skrip otomatis tenant.',
          'Failover toggle otomatis ke model lokal Ollama saat kuota API eksternal menipis.'
        ]
      },
      {
        name: 'Audit Trail, Impersonation & Keamanan Hak Akses',
        desc: 'Pencatatan kepatuhan hukum dan proteksi akses administratif.',
        capabilities: [
          'Audit log permanen tanpa opsi delete untuk setiap perubahan konfigurasi atau suspend tenant.',
          'Impersonation login aman untuk investigasi tiket komplain pelanggan dengan watermark visual.',
          'Pembatasan IP Address Whitelist untuk URL panel login SuperAdmin (/admin/login).',
          'Wajib Two-Factor Authentication (TOTP via Google Authenticator / 1Password).'
        ]
      }
    ],
    apiContracts: [
      {
        endpoint: '/api/v1/admin/tenants',
        method: 'GET',
        desc: 'Mengambil daftar tenant dengan paginasi, filter status, dan agregasi kuota kontainer.',
        sampleResponse: '{"data":[{"id":"c56a4180-65aa-42ec-a945","name":"Studio Alpha","plan":"pro","containers_used":2,"status":"active"}]}'
      },
      {
        endpoint: '/api/v1/admin/tenants/{id}/suspend',
        method: 'POST',
        desc: 'Menangguhkan akses tenant dan menghentikan seluruh kontainer Docker aktif tenant bersangkutan.',
        samplePayload: '{"reason":"Pelanggaran ketentuan ToS: Monopoli CPU crypto mining"}'
      },
      {
        endpoint: '/api/v1/admin/telemetry/nodes',
        method: 'GET',
        desc: 'Metrik kesehatan agregat seluruh worker node (CPU, RAM, jumlah kontainer aktif).'
      }
    ],
    nfrs: [
      {
        metric: 'Kecepatan Muat Panel Admin',
        target: '< 600ms TTFB pada koneksi normal',
        strategy: 'Filament Table Caching & Query Indexing di PostgreSQL 16.'
      },
      {
        metric: 'Ketersediaan (Availability)',
        target: 'SLA 99.95% Uptime',
        strategy: 'Failover cluster dengan Docker Swarm / Traefik health routing.'
      },
      {
        metric: 'Integritas Audit Log',
        target: '100% Immutability (WORM)',
        strategy: 'Spatie Activitylog disimpan di tabel PostgreSQL dengan trigger larangan DELETE/UPDATE.'
      }
    ],
    roadmap: [
      {
        phase: 'Fase 1',
        title: 'Manajemen Tenant & Filament CRUD',
        timeline: 'Bulan 1 - Selesai',
        deliverables: ['Scaffold Laravel 11', 'Setup Filament v3 Resources', 'Integrasi PostgreSQL']
      },
      {
        phase: 'Fase 2',
        title: 'Telemetri Node & Docker Health',
        timeline: 'Bulan 2 - Selesai',
        deliverables: ['Worker Node Agent', 'Visualisasi cgroups CPU/RAM', 'Impersonate Login']
      },
      {
        phase: 'Fase 3',
        title: 'AI Cost Monitor & Billing Sync',
        timeline: 'Bulan 3 - Ongoing',
        deliverables: ['Token Tracking Middleware', 'Webhook Midtrans/Stripe', 'Faktur Pajak PDF']
      }
    ],
    kpis: [
      { name: 'Waktu Respon Tiket Bantuan', target: '< 15 Menit via Impersonation' },
      { name: 'Tingkat Deteksi Insiden Server', target: '< 60 Detik sebelum dampak meluas' },
      { name: 'Kepatuhan Audit Staf', target: '100% Aksi Staf Tercatat di Audit Log' }
    ]
  },
  {
    id: 'PRD-02',
    serviceId: '02-dashboard-cms',
    title: 'Dashboard CMS (Stack Studio - Portal Pelanggan by Aether Core)',
    serviceName: '02-dashboard-cms',
    badge: 'Customer Studio & PWA',
    version: 'v1.25.0-PROD',
    targetAudience: [
      'Software Engineer & Developer Portofolio',
      'Penulis Independen & Tim Media Editorial',
      'Pusat Edukasi, Universitas & Komunitas Bootcamp',
      'Pemilik Bisnis Mikro & Agensi Desain'
    ],
    techStack: {
      framework: 'Vue 3 (Composition API) + Pinia + Vite',
      language: 'TypeScript 5.5+',
      runtime: 'Node 26 LTS (CVE-2026-48930 Mitigated) / Static SPA Go Gin BFF (Prod)',
      databases: ['PostgreSQL 16 via Go API (RLS Enforced)', 'IndexedDB (Offline Cache)'],
      keyLibraries: [
        'Apache ECharts v6.1+ (High-Res Spline Canvas)',
        'vite-plugin-pwa (Workbox 7)',
        'Tiptap Block Editor v2',
        'Lucide Icons Vue',
        'DOMPurify'
      ]
    },
    summary: 'Studio manajemen situs web berbasis no-code / low-code berkinerja tinggi dengan visual editor live, publishing engine artikel & studi kasus, manajemen media terintegrasi S3, kontrol siklus hidup kontainer Docker mandiri berarsitektur grid 2-kolom, katalog blueprint arsitektur monokrom anti-slop, modul penagihan faktur pajak resmi DJP 3.0 dengan visualisasi kurva spline ECharts, pusat bantuan & live chat interaktif 1140px, navigasi ikon presisi geometris 16px dengan animasi cascade konten, serta dukungan mandatori Progressive Web App (PWA) untuk akses offline instan.',
    coreModules: [
      {
        name: 'Situs & Kontainer (Multi-Site Hub & CaaS Lifecycle)',
        desc: 'Pusat kendali armada kontainer Docker terisolasi milik pelanggan.',
        capabilities: [
          'Visual meter kuota kontainer paket terfokus (kapasitas slot aktif vs bebas) di baris atas tanpa komplikasi baris metrik CPU/RAM yang sempit.',
          'Tata letak kartu kontainer 2-kolom seimbang (.site-cards-grid) di seluruh breakpoint layar guna kenyamanan baca dan efisiensi manajemen kontainer.',
          'Penyaring pencarian terpadu yang ringkas tanpa dropdown kategori redundan, dilengkapi status kartu kosong interaktif (Empty State) dan tombol reset filter elegan.',
          'CRUD Runtime Kontainer: Start, Stop, Restart, dan Destroy dengan cgroups resource limits serta switcher Grid/Table yang proporsional.',
          'Live streaming logs kontainer Docker langsung di antarmuka web via WebSocket.',
          'Indikator status kesehatan kontainer (Running, Stopped, Provisioning, Degraded).'
        ]
      },
      {
        name: 'Katalog Template & Blueprint Architecture Store (Monochrome Studio)',
        desc: 'Pusat kurasi cetak biru arsitektur aplikasi dan sistem situs web berestetika monokrom tinggi.',
        capabilities: [
          'Estetika arsitektural Obsidian Black (#09090b) dan Pure White (#ffffff) tanpa saturasi neon atau gradasi artificial (Anti-AI Slop) demi kenyamanan visual profesional.',
          'Hero spotlight banner monokrom (.blueprint-spotlight-hero) dan panggung mockup wireframe arsitektur (.tpl-mockup-stage).',
          'Aksen warna halus non-neon per produk (stage bottom accent, soft pastel category pill .pill-portfolio/.pill-blog/.pill-education/.pill-business, checkmark fitur selaras, dan warm amber rating) memadukan keterbacaan tinggi dengan identitas domain produk.',
          'Filter segmen blueprint (Dev Portofolio, SaaS Studio, Editorial News, Documentation Hub, E-Commerce).'
        ]
      },
      {
        name: 'Pusat Bantuan & Tiket Support (4-Division Routing & Live Chat 1140px)',
        desc: 'Studio pengaduan layanan multi-divisi terintegrasi dengan diskusi live chat real-time bertema HeroCMS Studio.',
        capabilities: [
          'Pemilihan 4 Divisi Tujuan Pengaduan (Technical & Container DevOps, Customer Support CMS, Billing & Faktur Pajak, Domain & SSL Edge) dengan deteksi otomatis identitas akun tanpa input nama manual atau field urgensi.',
          'Bespoke Studio Custom Dropdown Popover untuk pemilihan Kategori Kendala, Situs/Kontainer Terdampak, dan Filter Divisi.',
          'Tabel Riwayat & Antrean Tiket Pengaduan terstruktur di bagian bawah formulir.',
          'Modal Live Chat 2 Kolom 1140px dengan model struktural WhatsApp berbalut tema HeroCMS Studio (#f8fafc dot-grid & Royal Blue #eff6ff/#e0f2fe), indikator mengetik di sisi lawan bicara, status Centang 1 (Terkirim), Centang 2 (Tersampaikan), dan Centang 2 Biru (Dibaca + jam atau tanggal-bulan-tahun), fitur upload gambar/screenshot, pemilih emotikon, serta Unified Chat Input Capsule yang menyatu langsung dengan kanvas chat.'
        ]
      },
      {
        name: 'Navigasi Ikon Berwarna Semantik & Animasi Staggered Content Cascade',
        desc: 'Sistem interaksi visual dan koreografi animasi perpindahan modul di seluruh area kerja Dashboard Studio.',
        capabilities: [
          '12 Badge Ikon Navigasi Sidebar (.nav-icon-box) berstandar presisi geometris 16px integer scaling (16/24) dengan GPU-accelerated subpixel rendering (shape-rendering: geometricPrecision; text-rendering: geometricPrecision; stroke-width: 1.85; transform: translateZ(0); backface-visibility: hidden;) mengeliminasi distorsi atau tampilan pecah/buram.',
          'Status inaktif berlatar putih bersih (#ffffff) dengan garis tepi lembut (#d4d4d8) dan ikon hitam (#18181b); status aktif bertransisi menjadi latar pastel semantik sesuai kategori modul, border aksen selaras, dan ikon berwarna cerah.',
          'Kondisi menu aktif solid non-hoverable mencegah kedipan warna ganda saat kursor melintas.',
          'Transisi panggung area kerja (studio-workspace-stage) dan animasi masuk berjenjang (studioSectionReveal & studioCardCascadeIn) pada seluruh kartu, formulir, telemetri, dan tabel saat berpindah menu.'
        ]
      },
      {
        name: 'Faktur & E-Faktur DJP 3.0 Resmi (Fiscal Billing & Spline Trend)',
        desc: 'Sistem buku besar penagihan resmi dan penerbitan faktur pajak elektronik standar Kemenkeu RI.',
        capabilities: [
          'Buku besar faktur penagihan resmi lapang (min-width: 1260px) dengan 7 kolom terdedikasi dan padding sel 18px 20px.',
          'Multi-channel payment filter (BCA Virtual Account, QRIS Dinamis, Visa Corporate Card, Mandiri Bill Payment).',
          'Modal Dokumen E-Faktur Resmi 1200px widescreen berstandar PER-03/PJ/2022 DJP Kemenkeu RI lengkap dengan pita kepatuhan pemerintah, perbandingan dual entitas PKP Penjual vs Pembeli BKP sejajar, rincian BKP/JKP bernomor, kartu nilai rupiah terbilang otomatis, validasi QR Code approval DJP, dan stempel tanda tangan digital CFO.',
          'Grafik Alokasi Fiskal Spline Area Curve interaktif (Apache ECharts) dengan kurva hermite mulus (smooth: 0.38), 3 garis analitik (Total Tagihan Resmi, DPP, PPN 11%), chips telemetri ringkas, crosshair pointer, dan floating glassmorphic tooltip IDR.',
          'Profil Wajib Pajak Badan 2 kolom terpadu dengan Live Sync KOP Surat Faktur Pajak.'
        ]
      },
      {
        name: 'Kapasitas & Paket Billing (Capacity & Pod Quota Matrix)',
        desc: 'Pusat pengelolaan kuota komputasi dan simulasi cluster resource kustom.',
        capabilities: [
          'Topologi visualisasi resource pod kontainer dinamis dengan indikator alokasi CPU cgroups v2.',
          'Arsitektur kartu paket aktif berjalan zero-overlap dengan tagline baris penuh .crown-full-tagline.',
          'Kalkulator Simulasi Resource Cluster Kustom dengan kapabilitas Checkout & Pembayaran Langsung via 4 kanal pembayaran resmi (BCA, QRIS, Visa, Mandiri) yang menerbitkan E-Faktur otomatis.'
        ]
      },
      {
        name: 'Modal Pembuatan Situs Web Baru (Smart Architecture Provisioning)',
        desc: 'Alur kerja pembuatan website baru dengan preview langsung dan auto-slug.',
        capabilities: [
          'Split-layout 2 kolom 1160px widescreen responsif (.modal-dialog-create-site) dengan live canvas browser mockup interaktif.',
          'Penataan kartu blueprint dengan perlindungan text-wrapping (white-space: normal !important) mencegah pemotongan dan kebocoran horizontal di kolom formulir sebelah kanan.',
          'Desain formulir input profesional terstandardisasi dengan ring fokus royal blue dan label field yang rapi.',
          'Sinkronisasi auto-slug cerdas dari nama situs ke subdomain URL tanpa jeda.',
          'Pilihan arsitektur preset (Portfolio Dev, SaaS Landing, Enterprise Docs, Editorial Magazine).'
        ]
      },
      {
        name: 'Integrasi Pengembang: Scoped PAT & Webhook Playground',
        desc: 'Pusat integrasi API pihak ketiga dan manajemen token akses personal.',
        capabilities: [
          'Modal Generate Personal Access Token (PAT) 900px responsif dengan preset scopes cepat (Full Admin, Read-Only, Deployer).',
          'Webhook delivery inspector & in-browser REST API playground interaktif.'
        ]
      },
      {
        name: 'Editor Desain & Halaman Visual (Visual Page Builder)',
        desc: 'Editor tampilan visual WYSIWYG responsif untuk merancang halaman website.',
        capabilities: [
          'Kustomisasi Hero Section, Blok Konten Modular, Skema Warna Brand, dan Tipografi Global.',
          'Simulator Responsif 3-Perangkat: Preview instan untuk Desktop, Tablet, dan Mobile.',
          'Aksi "Terbitkan ke Kontainer (Live)" yang memicu kompilasi dist dan deploy ke Docker dalam < 4.5s.',
          'Dukungan Hot Module Preview tanpa perlu reload browser.'
        ]
      },
      {
        name: 'Pengelola Konten: Artikel & Halaman (Publishing Engine)',
        desc: 'Engine publikasi artikel editorial, studi kasus teknis, dan dokumentasi kurikulum.',
        capabilities: [
          'Tiptap Block Editor modern dengan dukungan ProseMirror JSON AST terstruktur (Anti-XSS).',
          'Penghitung estimasi waktu baca (reading time), slug SEO otomatis, dan generator meta OpenGraph.',
          'Status publikasi fleksibel: Draft, Review, Scheduled, dan Published.',
          'Pencarian teks instan dan filter kategori / tag modular.'
        ]
      },
      {
        name: 'Media Assets & Dedicated S3 Storage Bucket',
        desc: 'Penyimpanan media terpusat dengan isolasi fisik satu bucket per pelanggan.',
        capabilities: [
          'Bucket MinIO S3 mandiri (tenant-<tenant_id>-media) dengan hard quota 2 GB per akun.',
          'Validasi berkas Magic Bytes (512 byte sniffing) untuk memblokir executable terselubung.',
          'Whitelist tipe berkas aman: Gambar (.webp, .svg, .png, .jpg) & Dokumen (.pdf, .docx, .xlsx).',
          'Galeri media dengan fungsi copy URL CDN instan dan integrasi langsung ke Visual Builder.'
        ]
      },
      {
        name: 'Custom Domain & Traefik Edge Routing',
        desc: 'Pengaturan alamat situs dengan sertifikat SSL TLS 1.3 otomatis.',
        capabilities: [
          'Subdomain gratis otomatis: https://<tenant-slug>.stacbyte.id.',
          'Panduan pemasangan Custom Domain pribadi (CNAME & A-Record Traefik).',
          'Pengecekan propagasi DNS otomatis dan status penerbitan sertifikat Let\'s Encrypt.'
        ]
      },
      {
        name: 'Mandatori Progressive Web App (PWA) & Offline Sync',
        desc: 'Kemampuan berjalan sebagai native app desktop/mobile dengan offline drafting.',
        capabilities: [
          'Manifest Web App standalone (tanpa address bar browser, terpasang di Homescreen/Dock).',
          'Tier 1 Cache-First untuk App Shell: startup terbuka seketika (< 200ms) saat offline.',
          'Offline Drafting: Tenant dapat menulis draf artikel dan konfigurasi tema di IndexedDB lokal.',
          'Background Sync API: otomatis sinkronisasi draf ke server begitu koneksi internet pulih.'
        ]
      }
    ],
    apiContracts: [
      {
        endpoint: '/api/v1/containers',
        method: 'GET',
        desc: 'Mengambil seluruh kontainer Docker milik tenant yang sedang login beserta status metriknya.'
      },
      {
        endpoint: '/api/v1/containers/{id}/action',
        method: 'POST',
        desc: 'Mengeksekusi perintah start, stop, atau restart kontainer Docker.',
        samplePayload: '{"action":"restart"}'
      },
      {
        endpoint: '/api/v1/media/upload',
        method: 'POST',
        desc: 'Mengunggah file ke dedicated S3 bucket tenant dengan pengecekan kuota 2GB & magic bytes.'
      }
    ],
    nfrs: [
      {
        metric: 'Kecepatan Startup App Shell PWA',
        target: '< 200ms saat diakses berulang (Cache-First)',
        strategy: 'Workbox Pre-caching untuk HTML, JS Chunks, dan CSS Tokens.'
      },
      {
        metric: 'Lighthouse PWA Score',
        target: '>= 95 / 100',
        strategy: 'Valid manifest.webmanifest, service worker registration, dan maskable icons.'
      },
      {
        metric: 'Kecepatan Deployment ke Kontainer',
        target: '< 4.5 detik dari klik Terbitkan hingga live',
        strategy: 'Pre-warmed Alpine Vue base image + in-memory payload stream.'
      }
    ],
    roadmap: [
      {
        phase: 'Fase 1',
        title: 'Core Studio & Visual Block Editor',
        timeline: 'Bulan 1 - Selesai',
        deliverables: ['Vue 3 Composition API', 'Pinia Store', 'Design Tokens Master CSS']
      },
      {
        phase: 'Fase 2',
        title: 'PWA & Offline Drafting Mode',
        timeline: 'Bulan 2 - Selesai',
        deliverables: ['Service Worker Workbox', 'IndexedDB Storage', 'Background Sync']
      },
      {
        phase: 'Fase 3',
        title: 'Dedicated S3 Media & Webhook Keys',
        timeline: 'Bulan 3 - Selesai',
        deliverables: ['1 Tenant = 1 S3 Bucket', 'Magic Bytes Sniffing', 'Developer API Token']
      }
    ],
    kpis: [
      { name: 'Time to Publish (TTP)', target: '< 4.5 Detik ke Live Container' },
      { name: 'Skor Lighthouse PWA', target: '>= 95 / 100' },
      { name: 'Retensi Pengguna Aktif', target: '> 80% Pelanggan Aktif Mingguan' }
    ]
  },
  {
    id: 'PRD-03',
    serviceId: '03-provision-orchestrator',
    title: 'API Orkestrator Provisioning & Deployment',
    serviceName: '03-provision-orchestrator',
    badge: 'Core Engine & Docker SDK',
    version: 'v1.0.0-PROD',
    targetAudience: [
      'Sistem Stack Studio (Internal Caller)',
      'Site Reliability Engineers (SRE)',
      'CI/CD Pipeline Automation'
    ],
    techStack: {
      framework: 'Gin Web Framework (CGO_ENABLED=0)',
      language: 'Golang 1.23+',
      runtime: 'Binary Mandiri Linux x86_64 / ARM64',
      databases: ['Moby Docker Engine Unix Socket (/var/run/docker.sock)', 'Redis 7 Streams'],
      keyLibraries: [
        'github.com/docker/docker/client',
        'github.com/gin-gonic/gin',
        'github.com/redis/go-redis/v9',
        'go.uber.org/zap'
      ]
    },
    summary: 'Microservice Golang berkinerja tinggi yang bertindak sebagai orkestrator otonom untuk mem-provisioning, mengkonfigurasi sandboxing Linux cgroups v2, menyuntikkan routing dinamis Traefik v3, mengelola rolling cutover zero-downtime, serta menjalankan garbage collection mandiri.',
    coreModules: [
      {
        name: 'Pipeline Provisioning & Rolling Cutover Zero-Downtime',
        desc: 'Eksekusi otomatis deployment website tenant dalam hitungan detik.',
        capabilities: [
          'Menerima instruksi publikasi dari Studio via REST API POST /api/v1/deploy.',
          'Mengambil snapshot konten JSON dan menginjeksi ke volume dist kontainer.',
          'Membuat kontainer Green baru dari image cloudcms-tenant-runtime:alpine-v1.',
          'Menjalankan internal health check HTTP pada /healthz sebelum mengalihkan rute.',
          'Mengalihkan rute Traefik ke kontainer Green seketika dan graceful drain kontainer Blue.'
        ]
      },
      {
        name: 'Sandboxing Kontainer & Isolasi Sumber Daya (Linux cgroups v2)',
        desc: 'Penegakan batas ketat pada setiap kontainer website pelanggan.',
        capabilities: [
          'Menetapkan batas RAM 256 MB (MemorySwap: 256MB, swap dinonaktifkan).',
          'Membatasi utilisasi CPU maksimal 0.5 vCPU (NanoCPUs: 500000000).',
          'Mencegah fork-bomb dengan PidsLimit: 50 per kontainer.',
          'Menetapkan User: "10001:10001" (non-root cmsrunner) dan ReadonlyRootfs: true.',
          'Mencabut seluruh Linux capabilities (CapDrop: ["ALL"]) dan hanya mengizinkan NET_BIND_SERVICE.',
          'Menyediakan partisi memori RAM ephemeral /tmp (Tmpfs: size=16M,noexec,nosuid,nodev).'
        ]
      },
      {
        name: 'Dynamic Label Injection untuk Traefik v3 Edge Ingress',
        desc: 'Pendaftaran otomatis domain dan sertifikat SSL tanpa restart proxy.',
        capabilities: [
          'Injeksi label traefik.enable=true dan nama network cloudcms_edge_network.',
          'Pemasangan aturan router Host(<subdomain>.stacbyte.id) || Host(<custom_domain>).',
          'Penetapan entrypoints websecure (HTTPS port 443) dengan TLS certresolver letsencrypt.',
          'Binding port service internal kontainer ke port 80.'
        ]
      },
      {
        name: 'Daemon Garbage Collector & Self-Healing Otonom',
        desc: 'Pembersihan berkala dan pemulihan kesehatan sistem otomatis.',
        capabilities: [
          'Memindai dan menghapus kontainer yatim (orphaned containers) dari build gagal.',
          'Membersihkan Docker image usang yang tidak lagi terikat pada kontainer aktif.',
          'Mendeteksi kontainer yang mati tak terduga dan me-restart secara otomatis (on-failure retry 3x).'
        ]
      }
    ],
    apiContracts: [
      {
        endpoint: '/api/v1/deploy',
        method: 'POST',
        desc: 'Memicu pembuatan kontainer tenant baru dengan snapshot konten terbaru.',
        samplePayload: '{"tenant_id":"c56a4180-65aa-42ec","site_id":"site_01","version_hash":"v98a7f"}',
        sampleResponse: '{"status":"success","container_id":"tenant_c56a4180_v98a7f","deployment_time_ms":3850}'
      },
      {
        endpoint: '/api/v1/containers/{id}/stats',
        method: 'GET',
        desc: 'Mengambil konsumsi CPU nano, pemakaian memori bytes, dan bandwidth I/O kontainer.'
      },
      {
        endpoint: '/api/v1/containers/{id}/logs',
        method: 'GET',
        desc: 'Streaming log stdout/stderr kontainer secara real-time via WebSocket.'
      }
    ],
    nfrs: [
      {
        metric: 'Latensi Provisioning Kontainer',
        target: '< 4.5 detik end-to-end',
        strategy: 'Image Alpine berukuran < 25MB, pre-pulled di lokal worker node.'
      },
      {
        metric: 'Kepadatan Server (Server Density)',
        target: '1.000 Kontainer Tenant aktif per Node 32GB RAM',
        strategy: 'Konsumsi idle Alpine Nginx hanya 12-18 MB RAM per kontainer.'
      },
      {
        metric: 'Keamanan Sandboxing',
        target: '0 Vulnerability Escape',
        strategy: 'ReadonlyRootfs + CapDrop ALL + Non-root UID 10001 + cgroups v2 limits.'
      }
    ],
    roadmap: [
      {
        phase: 'Fase 1',
        title: 'Docker SDK Client & Injeksi Label Traefik',
        timeline: 'Bulan 1 - Selesai',
        deliverables: ['Docker Engine SDK Integration', 'Dynamic Router Labels', 'Healthz Probe']
      },
      {
        phase: 'Fase 2',
        title: 'Sandboxing cgroups & Rolling Update',
        timeline: 'Bulan 2 - Selesai',
        deliverables: ['cgroups v2 Enforcement', 'Blue-Green Cutover', 'Ephemeral Tmpfs']
      },
      {
        phase: 'Fase 3',
        title: 'Multi-Node Worker Swarm Orchestration',
        timeline: 'Bulan 3 - Ongoing',
        deliverables: ['Distributed Worker Scheduler', 'Drain Node Automation', 'Prometheus Metrics']
      }
    ],
    kpis: [
      { name: 'Kecepatan Provisioning', target: '< 4.5 Detik per Kontainer' },
      { name: 'Tingkat Keberhasilan Deploy', target: '>= 99.8%' },
      { name: 'Zero-Downtime Cutover', target: '0 Detik Jeda saat Rolling Update' }
    ]
  },
  {
    id: 'PRD-04',
    serviceId: '04-marketing-site',
    title: 'Website Promosi & Pemasaran (Marketing Landing)',
    serviceName: '04-marketing-site',
    badge: 'Public Marketing & SEO',
    version: 'v1.0.0-PROD',
    targetAudience: [
      'Calon Pelanggan Baru (Pengunjung Web)',
      'Software Engineer mencari CMS Portofolio',
      'Kreator Konten & Blogger Independen',
      'Institusi Edukasi & Pemilik Bisnis UMKM'
    ],
    techStack: {
      framework: 'React 19 / Next.js 15 (App Router) atau Vite + React',
      language: 'TypeScript 5.5+',
      runtime: 'Edge CDN / Node 20 SSR',
      databases: ['Headless API (03-provision / 02-dashboard)', 'Static Assets CDN'],
      keyLibraries: [
        'Tailwind CSS v3.4',
        'Framer Motion',
        'Lucide React',
        'Radix UI Primitives'
      ]
    },
    summary: 'Situs web pemasaran publik berkonversi tinggi dengan optimasi SEO mutlak (skor 100/100 Core Web Vitals), widget Live Interactive Demo Playground tanpa perlu registrasi, showcase kurasi tema modern, kalkulator harga transparan, serta wizard onboarding kilat.',
    coreModules: [
      {
        name: 'Hero Section & Interactive Live Playground',
        desc: 'Eksperimen langsung di browser untuk memikat minat pengunjung baru.',
        capabilities: [
          'Widget live demo di mana pengunjung dapat mengutak-atik token warna, tipografi, dan tata letak portofolio tanpa login.',
          'Micro-animations mulus yang menunjukkan visual kecepatan deployment < 4.5 detik.',
          'Tombol CTA utama "Mulai Buat Website Gratis" yang langsung membuka Onboarding Wizard.'
        ]
      },
      {
        name: 'Showcase Vertikal Industri (Portofolio, Blog, Edukasi, Bisnis)',
        desc: 'Halaman mendarat khusus yang disesuaikan untuk persona target.',
        capabilities: [
          'Studi kasus portofolio teknis: integrasi riwayat commit GitHub, viewer PDF resume CV, dan kontak Slack/Telegram webhook.',
          'Pusat publikasi editorial: blok editor Tiptap, kalkulator reading time, hierarki kategori, dan feed RSS.',
          'Pusat edukasi & kurikulum: navigasi silabus bertingkat, materi ajar modular, dan profil pengajar.',
          'Showcase bisnis UMKM: katalog produk instan dengan tombol pemesanan WhatsApp & Payment Gateway.'
        ]
      },
      {
        name: 'Kalkulator Harga & Paket Langganan Transparan',
        desc: 'Simulasi biaya langganan berdasarkan kebutuhan kontainer dan resource.',
        capabilities: [
          'Slider interaktif penyesuaian jumlah kontainer Docker (1 s/d 10+ kontainer).',
          'Perbandingan fitur detail antar tier: Starter (Gratis), Pro ($9/bln), dan Business ($29/bln).',
          'Faktur pajak resmi ber-NPWP terverifikasi untuk kebutuhan reimbursement perusahaan.'
        ]
      },
      {
        name: 'Alur Onboarding & Registrasi Kilat (Rapid Wizard)',
        desc: 'Konversi pengunjung menjadi pengguna aktif dalam 4 langkah mudah.',
        capabilities: [
          'Langkah 1: Pilih Vertikal Situs (Portofolio, Blog, Edukasi, atau Bisnis).',
          'Langkah 2: Pilih Preset Tema Desain Awal.',
          'Langkah 3: Tentukan Nama Subdomain Gratis (contoh: rizalfahmi.stacbyte.id).',
          'Langkah 4: Buat Akun & Masuk Seketika ke Dashboard Studio.'
        ]
      }
    ],
    apiContracts: [
      {
        endpoint: '/api/v1/auth/register',
        method: 'POST',
        desc: 'Mendaftarkan pengguna baru dari wizard marketing dan menginisialisasi tenant pertama.',
        samplePayload: '{"name":"Rizal Fahmi","email":"rizal@aether.app","password":"***","subdomain":"rizal"}'
      },
      {
        endpoint: '/api/v1/public/check-subdomain',
        method: 'GET',
        desc: 'Pengecekan ketersediaan subdomain tenant secara real-time saat pengguna mengetik.'
      }
    ],
    nfrs: [
      {
        metric: 'Skor Core Web Vitals (Google PageSpeed)',
        target: '100 / 100 untuk Performa, SEO, dan Best Practices',
        strategy: 'Static Site Generation (SSG), font self-hosting, WebP/AVIF media format.'
      },
      {
        metric: 'Time to Interactive (TTI)',
        target: '< 1.2 detik di jaringan 4G standar',
        strategy: 'Code splitting vendor React, minimalisasi bundle JS eksternal.'
      },
      {
        metric: 'Tingkat Konversi Registrasi',
        target: '>= 8.5% dari seluruh pengunjung unik',
        strategy: 'Interactive Playground Demo + 4-Step Frictionless Wizard.'
      }
    ],
    roadmap: [
      {
        phase: 'Fase 1',
        title: 'Landing Page & Interactive Playground',
        timeline: 'Bulan 1 - Selesai',
        deliverables: ['Hero Section', 'Playground Simulator', 'Framer Motion']
      },
      {
        phase: 'Fase 2',
        title: 'Halaman Vertikal & Showcase Template',
        timeline: 'Bulan 2 - Selesai',
        deliverables: ['Showcase Portofolio', 'Showcase Blog & Edu', 'Kalkulator Harga']
      },
      {
        phase: 'Fase 3',
        title: 'SEO Content Engine & Blog Edukasi',
        timeline: 'Bulan 3 - Ongoing',
        deliverables: ['Blog Artikel SEO', 'OpenGraph Generator', 'PWA Smart Banner']
      }
    ],
    kpis: [
      { name: 'Core Web Vitals LCP', target: '< 1.5 Detik' },
      { name: 'Skor SEO Google', target: '100 / 100' },
      { name: 'Konversi Pengunjung ke Akun', target: '>= 8.5%' }
    ]
  },
  {
    id: 'PRD-05',
    serviceId: '05-ai-agent-service',
    title: 'Layanan AI Agent & Analitik Data (AI Intelligence Engine)',
    serviceName: '05-ai-agent-service',
    badge: 'AI Engine & Redis Streams',
    version: 'v1.0.0-PROD',
    targetAudience: [
      'Dashboard CMS Studio (Integrasi AI Copilot)',
      'Tenant Pengguna Akhir (Bantuan Penulisan & Desain)',
      'Sistem Analitik Real-Time Stack (Aether Core)'
    ],
    techStack: {
      framework: 'Microservice Golang 1.23+ + n8n Workflow Automation',
      language: 'Golang 1.23+',
      runtime: 'Binary Mandiri Linux + Node.js (n8n container)',
      databases: ['Redis 7 (Sorted Sets ZSET & Streams)', 'PostgreSQL 16'],
      keyLibraries: [
        'github.com/tmc/langchaingo',
        'github.com/redis/go-redis/v9',
        'n8n workflow runner',
        'OpenAI / Anthropic SDK'
      ]
    },
    summary: 'Microservice inteligensi cerdas yang memadukan kecepatan komputasi numerik Golang untuk pemrosesan telemetri streaming dengan kapabilitas penalaran LLM multi-model (OpenAI GPT-4o, Claude 3.5 Sonnet, dan Llama 3) untuk menghasilkan skema desain tema JSON, asisten copywriting konten, dan ranking artikel terpopuler via Redis Sorted Sets.',
    coreModules: [
      {
        name: 'Sintesis Desain & Tema Berbasis AI (Theme Synthesizer)',
        desc: 'Mengubah instruksi bahasa alami menjadi token desain siap pakai.',
        capabilities: [
          'Pengguna memasukkan prompt teks: "Buatkan tema portofolio bernuansa cyberpunk gelap dengan aksen neon cyan".',
          'AI Agent menyusun skema JSON token desain (warna latar, aksen, font, border radius, bayangan).',
          'Dashboard Studio secara instan menginjeksi token tersebut ke DOM tanpa perlu reload halaman.',
          'Validasi skema JSON ketat untuk memastikan tidak ada CSS injection atau atribut berbahaya.'
        ]
      },
      {
        name: 'Kopilot Konten & Optimasi SEO Terpadu',
        desc: 'Asisten cerdas untuk mempercepat pembuatan dan perapihan konten artikel.',
        capabilities: [
          'Ekstraksi kata kunci utama dan penghasilan judul artikel yang memikat (*Headline Generator*).',
          'Pembuatan meta description dan tag OpenGraph otomatis untuk meningkatkan peringkat mesin pencari.',
          'Pemeriksa keterbacaan artikel dan ringkasan eksekutif (*Executive Summary Generator*).',
          'Streaming respon token teks langsung ke Tiptap editor via WebSocket / Server-Sent Events.'
        ]
      },
      {
        name: 'Agregasi Analitik Pengunjung & Ranking Real-Time (Top-Views)',
        desc: 'Perhitungan statistik kunjungan berkecepatan kilat dengan latensi sub-milidetik.',
        capabilities: [
          'Mengonsumsi event kunjungan dari antrean Kafka / Redis Streams secara non-blocking.',
          'Menghitung dan memutakhirkan peringkat artikel terpopuler menggunakan Redis Sorted Sets (ZINCRBY).',
          'Pengambilan data Top 5 Most Viewed dengan perintah ZREVRANGEBYSCORE dalam latensi < 1ms.',
          'Ringkasan analitik mingguan otomatis: "Artikel Anda tentang Microservices naik 42% hari ini".'
        ]
      },
      {
        name: 'Otomatisasi Webhook & Integrasi Alur Kerja n8n',
        desc: 'Penghubung aksi publikasi konten ke ekosistem eksternal.',
        capabilities: [
          'Workflow visual n8n untuk distribusi otomatis artikel baru ke LinkedIn, X/Twitter, dan Telegram.',
          'Notifikasi instan form kontak pengunjung situs ke webhook Slack, Discord, atau WhatsApp Gateway.',
          'Penyaringan keamanan egress anti-SSRF pada seluruh permintaan webhook keluar.'
        ]
      }
    ],
    apiContracts: [
      {
        endpoint: '/api/v1/ai/generate-theme',
        method: 'POST',
        desc: 'Menerima prompt pengguna dan mengembalikan token desain CSS/JSON yang valid.',
        samplePayload: '{"prompt":"Minimalist slate design for senior software engineer"}'
      },
      {
        endpoint: '/api/v1/ai/assist-content',
        method: 'POST',
        desc: 'Menghasilkan meta SEO, ringkasan, atau saran perbaikan artikel via streaming SSE.'
      },
      {
        endpoint: '/api/v1/telemetry/top-views',
        method: 'GET',
        desc: 'Mengambil daftar artikel paling banyak dibaca secara real-time dari Redis ZSET.'
      }
    ],
    nfrs: [
      {
        metric: 'Latensi Pengambilan Top-Views Redis',
        target: '< 1 milidetik (sub-ms response)',
        strategy: 'Redis 7 In-Memory Sorted Sets (ZSET) dengan algoritma Skip-List O(log N).'
      },
      {
        metric: 'Latensi Streaming Token AI',
        target: 'First-token < 800ms',
        strategy: 'Model OpenAI gpt-4o-mini dengan HTTP streaming SSE via Golang.'
      },
      {
        metric: 'Ketahanan Kegagalan AI (Resilience)',
        target: 'Graceful Fallback 100%',
        strategy: 'Jika API OpenAI error/rate-limited, alihkan otomatis ke Ollama lokal tanpa downtime.'
      }
    ],
    roadmap: [
      {
        phase: 'Fase 1',
        title: 'Redis ZSET Real-Time Analytics & Worker',
        timeline: 'Bulan 1 - Selesai',
        deliverables: ['Stream Consumer', 'Redis Sorted Sets Integration', 'Top-5 Endpoint']
      },
      {
        phase: 'Fase 2',
        title: 'LLM Theme Synthesizer & SEO Assistant',
        timeline: 'Bulan 2 - Selesai',
        deliverables: ['JSON Schema Validation', 'Prompt Engineering Engine', 'SSE Streaming']
      },
      {
        phase: 'Fase 3',
        title: 'n8n Workflow Hub & Multimodal AI',
        timeline: 'Bulan 3 - Ongoing',
        deliverables: ['n8n Webhook Flows', 'Image Analysis Copilot', 'Automated Social Blast']
      }
    ],
    kpis: [
      { name: 'Latensi Redis Top-Views', target: '< 1ms' },
      { name: 'Akurasi Sintesis Format JSON', target: '100% Lolos Validasi Skema' },
      { name: 'Waktu Respon Streaming AI', target: '< 800ms ke Token Pertama' }
    ]
  },
  {
    id: 'PRD-06',
    serviceId: '06-mobile-companion',
    title: 'Mobile Companion & Quick Push (Aplikasi Pendamping Mobile)',
    serviceName: '06-mobile-companion',
    badge: 'Mobile App & Push PWA',
    version: 'v1.0.0-PROD',
    targetAudience: [
      'Pemilik Situs yang Sedang Mobile / Bepergian',
      'Tim Editorial untuk Persetujuan Cepat (Quick Approve)',
      'DevOps on-call untuk Monitoring Darurat'
    ],
    techStack: {
      framework: 'Capacitor 6 / Vue 3 Mobile PWA',
      language: 'TypeScript 5.5+',
      runtime: 'Android 14+ / iOS 17+ / Standalone PWA',
      databases: ['IndexedDB Local Storage', 'Backend REST/SSE API'],
      keyLibraries: [
        '@capacitor/push-notifications',
        '@capacitor/device',
        '@capacitor/network',
        'Lucide Icons'
      ]
    },
    summary: 'Aplikasi pendamping mobile yang dirancang untuk pemilik situs dan engineer yang membutuhkan kendali cepat dari ponsel: notifikasi push seketika saat deployment sukses atau ada lonjakan trafik, sakelar restart kontainer darurat, moderasi draf artikel, dan telemetri kunjungan ringkas.',
    coreModules: [
      {
        name: 'Notifikasi Web Push & Alerting Real-Time',
        desc: 'Peringatan instan langsung ke layar kunci perangkat pengguna.',
        capabilities: [
          'Notifikasi saat deployment kontainer selesai online di edge Traefik.',
          'Peringatan anomali trafik: "Trafik website meningkat 300% dalam 10 menit".',
          'Notifikasi form kontak masuk dari pengunjung situs dengan tombol balas cepat.',
          'Pengingat jatuh tempo faktur langganan dan konfirmasi pembayaran bank.'
        ]
      },
      {
        name: 'Sakelar Kontrol Kontainer Cepat (Quick Actions)',
        desc: 'Tindakan operasional darurat langsung dari genggaman tanpa membuka laptop.',
        capabilities: [
          'Tombol cepat: Restart Kontainer, Hentikan Sementara (Stop), dan Bersihkan Cache Traefik.',
          'Indikator visual status kesehatan kontainer dengan getaran haptik responsif.',
          'Tinjauan log singkat (50 baris terakhir) untuk mendiagnosis crash saat di jalan.'
        ]
      },
      {
        name: 'Persetujuan Publikasi Draf Artikel (Mobile Reviewer)',
        desc: 'Review dan rilis artikel editorial secara cepat.',
        capabilities: [
          'Membaca draf artikel tim penulis dengan format pembaca nyaman mata.',
          'Memberikan komentar catatan revisi atau langsung menekan tombol "Terbitkan Sekarang".'
        ]
      }
    ],
    apiContracts: [
      {
        endpoint: '/api/v1/mobile/device-token',
        method: 'POST',
        desc: 'Mendaftarkan FCM / APNs device token untuk pengiriman notifikasi push terenkripsi.'
      },
      {
        endpoint: '/api/v1/mobile/quick-metrics',
        method: 'GET',
        desc: 'Mengambil ringkasan metrik ringan yang dioptimalkan untuk hemat kuota mobile.'
      }
    ],
    nfrs: [
      {
        metric: 'Konsumsi Baterai & Data Mobile',
        target: '< 2MB transfer data per sesi monitoring',
        strategy: 'Payload JSON terkompresi Brotli & interval polling cerdas.'
      },
      {
        metric: 'Latensi Pengiriman Push Notification',
        target: '< 2.5 detik sejak event pemicu di server',
        strategy: 'Koneksi persisten HTTP/2 ke Google FCM & Apple APNs.'
      }
    ],
    roadmap: [
      {
        phase: 'Fase 1',
        title: 'PWA Mobile Shell & Push Notification Service',
        timeline: 'Bulan 2 - Selesai',
        deliverables: ['VAPID Push Keys', 'Service Worker Sync', 'Quick Status Cards']
      },
      {
        phase: 'Fase 2',
        title: 'Capacitor Native Packaging & Haptics',
        timeline: 'Bulan 3 - Ongoing',
        deliverables: ['Android APK Build', 'iOS TestFlight Shell', 'Biometric Auth']
      }
    ],
    kpis: [
      { name: 'Kecepatan Notifikasi Push', target: '< 2.5 Detik' },
      { name: 'Crash-Free Sessions', target: '>= 99.9%' }
    ]
  },
  {
    id: 'PRD-07',
    serviceId: '07-docs',
    title: 'Mission Control Docs Hub & Runbook Portal',
    serviceName: '07-docs',
    badge: 'Docs Hub & Runbooks',
    version: 'v1.4.0-PROD',
    targetAudience: [
      'Seluruh 6 Divisi Tim Aether Core (Andalusia, Irgi, Risqi, Rizal, Tyno, Paijo AI)',
      'Engineering Lead & Solution Architect',
      'Quality Assurance & Pentester Internal',
      'AI Agent Pair Programmers'
    ],
    techStack: {
      framework: 'Vue 3 (Composition API) + Pinia + Vite + Golang REST API',
      language: 'TypeScript 5.5+ & Go 1.23+',
      runtime: 'Node 20 (Dev) / Go Binary Serving Static Dist (Prod)',
      databases: ['PostgreSQL 16 (Task & Checklist Store)', 'Static Data TS Models'],
      keyLibraries: [
        'Lucide Icons Vue',
        'Master CSS Design Tokens',
        'Gin Router Backend',
        'Pinia Store'
      ]
    },
    summary: 'Pusat komando dan dokumentasi operasional terpadu (Mission Control Hub) yang menyajikan papan tugas sprint 50 tugas terstruktur, kamus blueprint arsitektur sistem, SOP runbook enterprise, matriks keamanan 20 pilar, alur kerja sistem end-to-end, dan spesifikasi PRD lengkap untuk seluruh microservices dalam ekosistem Aether Core (Stack CMS).',
    coreModules: [
      {
        name: 'Papan Tugas Sprint Terstruktur (50 Tugas Bisnis & Arsitektur)',
        desc: 'Manajemen tugas interaktif dengan pembagian divisi dan layanan.',
        capabilities: [
          'Pengelompokan 2 mode dinamis: Menurut 6 Divisi Tim atau Menurut 7 Microservice.',
          'Interaktivitas checklist tugas dengan penyimpanan persisten otomatis ke database backend.',
          'Inspektor detail tugas dengan visualisasi diagram alur, cuplikan kode, dan kriteria DoD.',
          'Filter persona instan untuk memeriksa beban kerja masing-masing anggota tim.'
        ]
      },
      {
        name: 'Kamus Blueprint Arsitektur Sistem (13 Blueprint Operasional)',
        desc: 'Dokumentasi arsitektur mendalam untuk setiap konsep teknis kritis.',
        capabilities: [
          'Penjelasan mendalam, diagram alur langkah bertahap, dan contoh kode implementasi Golang.',
          'Contoh endpoint API lengkap dengan perintah cURL siap salin dan contoh respon JSON.',
          'Matriks Do\'s and Don\'ts untuk mencegah kesalahan arsitektural fatal.',
          'Mode baca bebas distraksi (Distraction-Free Reader) dengan tombol kembali terpadu.'
        ]
      },
      {
        name: 'SOP Runbook Enterprise & Panduan Standar Tim (10 SOP)',
        desc: 'Prosedur operasional standar dari git branching hingga rilis produksi.',
        capabilities: [
          'Alur eksekusi bertahap yang dinomori secara jelas dengan perintah CLI siap pakai.',
          'Kriteria verifikasi rilis ketat sebelum kode dapat di-merge ke branch utama.',
          'Pencatatan rilis SemVer dan audit keamanan wajib sebelum PR.'
        ]
      },
      {
        name: 'Katalog PRD 7 Microservices & Spesifikasi Produk Lengkap',
        desc: 'Dokumentasi kebutuhan produk menyeluruh untuk seluruh sistem.',
        capabilities: [
          'Ringkasan eksekutif, target pengguna, dan arsitektur teknologi masing-masing service.',
          'Rincian modul fungsional inti, kontrak endpoint API, dan target NFR terukur.',
          'Roadmap implementasi multi-fase dan indikator kinerja utama (KPI).'
        ]
      },
      {
        name: 'Matriks Keamanan & Sandboxing (20 Pilar Standar Keamanan)',
        desc: 'Pusat verifikasi kepatuhan keamanan dan sandboxing kontainer.',
        capabilities: [
          '20 pilar standar keamanan web & backend dari pencegahan SQLi hingga verifikasi Magic Bytes.',
          'Spesifikasi pengerasan cgroups v2 Linux, ReadonlyRootfs, UID 10001, dan CapDrop ALL.',
          'Prosedur pentest runner lokal per-service sebelum git commit.'
        ]
      },
      {
        name: 'Alur Kerja Sistem Menyeluruh (7 Interactive System Journeys)',
        desc: 'Visualisasi alur data dan siklus hidup sistem dari ujung ke ujung.',
        capabilities: [
          'Pipeline bertahap yang terhubung dengan circular pins dan detail teknis per aktor.',
          'Target SLA latensi, penanganan kegagalan otomatis, dan perintah verifikasi CLI.'
        ]
      }
    ],
    apiContracts: [
      {
        endpoint: '/api/v1/tasks',
        method: 'GET',
        desc: 'Mengambil seluruh 50 tugas bisnis dan arsitektur beserta status checklist.'
      },
      {
        endpoint: '/api/v1/tasks/{id}/checklist',
        method: 'PATCH',
        desc: 'Memperbarui status centang checklist item pada tugas tertentu.',
        samplePayload: '{"index":0,"done":true}'
      },
      {
        endpoint: '/api/v1/telemetry/overview',
        method: 'GET',
        desc: 'Mengambil metrik agregat total tugas, blueprint, SOP, PRD, dan status sistem.'
      }
    ],
    nfrs: [
      {
        metric: 'Kecepatan Respon Antarmuka Docs',
        target: '< 100ms pergantian tab modul',
        strategy: 'Komponen lazy-loaded via defineAsyncComponent dan Pinia in-memory state.'
      },
      {
        metric: 'Konsistensi Desain Visual',
        target: '100% Zero-CSS Duplication',
        strategy: 'Menggunakan master stylesheet terpusat studio-master.css sesuai AGENTS.md.'
      },
      {
        metric: 'Kepatuhan Pemisahan Data & Styling',
        target: 'Ukuran SFC .vue < 500 baris',
        strategy: 'Seluruh array data statis diisolasi di src/data/*.ts.'
      }
    ],
    roadmap: [
      {
        phase: 'Fase 1',
        title: 'Task Board & Blueprint Architecture Portal',
        timeline: 'Selesai',
        deliverables: ['Papan 50 Tugas', '13 Blueprint Arsitektur', '10 SOP Runbooks']
      },
      {
        phase: 'Fase 2',
        title: 'Responsive Card Grid & Reader Optimization',
        timeline: 'Selesai (v1.3.1)',
        deliverables: ['Resolusi Grid Overflow', 'Pipeline Flowchart', 'Category Filter Strip']
      },
      {
        phase: 'Fase 3',
        title: 'Inkorporasi PRD, Security Matrix & System Journeys',
        timeline: 'Selesai (v1.4.0)',
        deliverables: ['Katalog 7 PRD', '20 Pilar Keamanan', '7 System Journeys']
      }
    ],
    kpis: [
      { name: 'Cakupan Dokumentasi Proyek', target: '100% dari 7 Microservices' },
      { name: 'Kepatuhan Standar Zero-CSS', target: '100% Menggunakan studio-master.css' },
      { name: 'Tingkat Kelulusan Pentest Runner', target: '100% PASS Sebelum Merge' }
    ]
  }
];
