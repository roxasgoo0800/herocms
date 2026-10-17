import type { ChangelogRelease } from '../types/dashboard';

export const changelogReleases: ChangelogRelease[] = [
  {
    version: 'v1.5.1',
    releaseDate: '17 Oktober 2026',
    title: 'Perombakan Visual Chart Edge & Cache: Industry Standard Catmull-Rom Spline, Y/X-Axis Scale & Scrub Tooltip',
    summary: 'Merombak grafik volume traffic & cache edge Traefik menjadi setara standar visual Cloudflare Analytics & Vercel Web Analytics: menghilangkan titik lingkaran kaku (static circle beads), mengimplementasikan algoritma Catmull-Rom to Cubic Bézier spline dengan bayangan halus (drop shadow glow), skala vertikal Y-axis dinamis (formatted k/M), label horizontal X-axis waktu (WIB), hairline crosshair interaktif, serta floating glassmorphic tooltip yang responsif mengikuti kursor.',
    badge: 'Latest',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-151-1',
        type: 'improvement',
        scope: 'Clean Industry-Standard Spline & Elimination of Clunky Circles',
        description: 'Menghapus titik lingkaran statis di sepanjang garis yang membuat tampilan kaku, menggantinya dengan kurva Catmull-Rom to Cubic Bézier spline mulus dengan gradasi area halus (#2563eb dan #10b981) dan glow effect.'
      },
      {
        id: 'c-151-2',
        type: 'improvement',
        scope: 'Dynamic Y-Axis Scale Guides & X-Axis Timestamps',
        description: 'Menambahkan 4 garis grid horizontal dan skala metrik sumbu Y otomatis (mis. 5.2k, 3.5k, 1.7k, 0) serta label waktu sumbu X presisi yang disinkronkan dengan interval filter 24 Jam, 7 Hari, dan 30 Hari.'
      },
      {
        id: 'c-151-3',
        type: 'feature',
        scope: 'Interactive Crosshair Scrubber & Glassmorphic Tooltip',
        description: 'Menyediakan hairline crosshair vertikal yang muncul saat scrubbing kursor mouse di atas grafik, pulsing halo dot pada titik koordinat aktif, serta floating glassmorphic tooltip kartu gelap yang merinci Total Permintaan, Edge Cache Hit %, Origin Pass, TTFB, dan Bandwidth.'
      },
      {
        id: 'c-151-4',
        type: 'improvement',
        scope: 'Header Quick KPI Strip & Accessible Legend',
        description: 'Menyematkan badge ringkasan telemetri langsung di header grafik (Total Volume, Cache Hit %, Puncak Traffic req/periode) serta legend yang membedakan Traefik Ingress, Edge Cache Hit, dan Container Cache Miss.'
      }
    ]
  },
  {
    version: 'v1.5.0',
    releaseDate: '17 Oktober 2026',
    title: 'Cloudflare-Style Pod Detail & Geo Edge Analytics: Distribusi Pengunjung Berdasarkan Negara & Live Edge Ingest',
    summary: 'Peluncuran modul inspeksi Pod & Container Telemetry kelas industri terinspirasi oleh Cloudflare Dashboard & Vercel Edge Analytics: visualisasi distribusi traffic pengunjung berdasarkan negara dengan bendera nasional & latensi regional, grafik area interaktif per jam/hari (requests, cache hit ratio 92.4%, bandwidth egress), live edge ingest ticker real-time, breakdown tipe perangkat (Mobile vs Desktop), Core Web Vitals (LCP, INP, CLS), HTTP status codes, serta tombol export dataset CSV.',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-150-1',
        type: 'feature',
        scope: 'Pod & Ingress Full-Page Sub-View Inspector',
        description: 'Menyediakan halaman inspeksi Pod & Analitik Edge terdedikasi (Full-Page Sub-View) dengan bilah navigasi breadcrumb dan tombol kembali instan ke daftar kontainer, merinci spesifikasi container runtime, gateway IP Traefik internal, TLS 1.3 ALPN handshake, cgroups v2 limits, serta quick action bar.'
      },
      {
        id: 'c-150-2',
        type: 'feature',
        scope: 'Cloudflare-Style Geo Traffic by Country',
        description: 'Menyajikan ranking distribusi negara pengakses lengkap dengan bendera nasional (🇮🇩 Indonesia, 🇸🇬 Singapura, 🇺🇸 Amerika Serikat, 🇲🇾 Malaysia, dll.), total request, persentase visual bar, dan latensi TTFB regional.'
      },
      {
        id: 'c-150-3',
        type: 'feature',
        scope: 'Interactive Edge Area Chart & Timeframe Filter',
        description: 'Menyematkan grafik kurva area SVG bergradasi halus dengan filter 24 Jam, 7 Hari, dan 30 Hari, memvisualisasikan volume request total vs request yang dilayani dari Traefik Edge Cache.'
      },
      {
        id: 'c-150-4',
        type: 'feature',
        scope: 'Live Edge Ingest Streaming Ticker',
        description: 'Menampilkan ticker live feed traffic real-time yang memancarkan request terkini lengkap dengan kota asal, metode HTTP, path rute, kode status, latensi, dan tipe perangkat.'
      },
      {
        id: 'c-150-5',
        type: 'improvement',
        scope: 'Devices, Web Vitals, HTTP Codes & CSV Export',
        description: 'Melengkapi analitik dengan rasio pengunjung Mobile (72.4%) vs Desktop (24.1%), skor Real Experience Core Web Vitals (LCP 0.7s, INP 14ms, CLS 0.01), distribusi status 200/304/404, serta kapabilitas 1-klik unduh berkas CSV analitik.'
      },
      {
        id: 'c-150-6',
        type: 'feature',
        scope: 'Datadog & cgroups v2 Kernel Resource Telemetry & Process Tree',
        description: 'Menambahkan grid telemetri resource mendalam (CPU CFS quota period, CPU throttling, Load Average, Memory RSS/Cache split, Swap 0MB, Disk IOPS, Active TCP sockets) serta tabel inspeksi pohon proses Linux worker (PID, CPU, Memory RSS, Threads).'
      },
      {
        id: 'c-150-7',
        type: 'feature',
        scope: 'Vercel-Style Daily Visitor Hit & Access Attribution Ledger',
        description: 'Menyediakan tabel log akses pengunjung harian dengan pencarian IP/ISP/Path, filter saluran referrer (Google Search, Media Sosial, Direct), indikator cache status (HIT/MISS/BYPASS), bendera negara, dan detail User Agent.'
      },
      {
        id: 'c-150-8',
        type: 'feature',
        scope: 'Customer Peace-of-Mind & Reliability Suite',
        description: 'Menambahkan suite ketenangan customer mencakup kalender Uptime SLA 30 hari (Statuspage/UptimeRobot style) dengan 0 menit downtime, kartu cadangan otomatis harian (snapshot verification & 1-klik restore), masa berlaku sertifikat SSL Wildcard auto-renew (89 hari tersisa), transparansi kuota bandwidth tanpa overage fee, serta riwayat publikasi build & deployment.'
      }
    ]
  },
  {
    version: 'v1.4.2',
    releaseDate: '17 Oktober 2026',
    title: 'Perombakan Antarmuka Situs & Kontainer Standar Industri: Dual View Grid/Tabel, Telemetri Sparkline & Purge Edge Cache',
    summary: 'Peningkatan menyeluruh modul Situs & Kontainer setara platform PaaS kelas dunia (Vercel & Railway): pengalih tampilan Grid Visual dan Tabel Ledger Enterprise yang tersimpan di localStorage, kurva sparkline SVG CPU & RAM langsung, chip latensi edge Traefik v3 (⚡ 1.2ms TTFB), tombol Purge Edge Cache instan, validasi ketersediaan subdomain real-time pada modal deploy, serta Terminal Log Viewer interaktif dengan filter level log dan pencarian teks.',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-142-1',
        type: 'feature',
        scope: 'Situs & Kontainer Dual-View Architecture',
        description: 'Menyediakan tombol pengalih mode tampilan antara Visual Grid (kartu modern dengan kurva telemetri) dan Dense Enterprise Table (.ledger-table) yang mencakup indikator slot kuota tersisa dan aksi cepat, dengan preferensi tersimpan di localStorage.'
      },
      {
        id: 'c-142-2',
        type: 'feature',
        scope: 'Live SVG Sparkline Telemetry & Edge Chips',
        description: 'Mengintegrasikan visualisasi kurva sparkline SVG reaktif bebas latensi untuk telemetri CPU & RAM di setiap kartu kontainer, status validasi SSL TLS 1.3, serta chip latensi Traefik v3 (⚡ 1.2ms TTFB).'
      },
      {
        id: 'c-142-3',
        type: 'feature',
        scope: 'Traefik v3 Purge Edge Cache Operation',
        description: 'Menambahkan tombol operasi Purge Edge Cache dengan feedback loading animasi dan toast pemberitahuan sukses, serta penyegaran telemetri edge secara langsung.'
      },
      {
        id: 'c-142-4',
        type: 'improvement',
        scope: 'Deploy Container Modal & Real-Time Subdomain Check',
        description: 'Memperkaya formulir modal Buat & Luncurkan Kontainer dengan pengecekan ketersediaan subdomain secara real-time (.cloudcms.app) serta highlight blueprint Toko Online & Retail sebagai pilihan Flagship #1.'
      },
      {
        id: 'c-142-5',
        type: 'improvement',
        scope: 'Terminal Logs Console Filter & Search',
        description: 'Melengkapi modal Terminal Logs dengan tab filter tingkat log (ALL, DOCKER, TRAEFIK, SYSTEM, TRAFFIC), pencarian teks log langsung, status isolasi cgroups v2, dan tombol zero-downtime reboot kontainer.'
      }
    ]
  },
  {
    version: 'v1.4.1',
    releaseDate: '10 Oktober 2026',
    title: 'Perombakan UI/UX Modal Blueprint Enterprise, Palet Aksen Interaktif & Sinkronisasi Reaktif Editor',
    summary: 'Peningkatan estetika formulir modal Terapkan & Deploy Blueprint dengan diagram alur pipeline sumber-ke-target, pemilih palet warna aksen interaktif, switch toggle iOS kustom, perbaikan kebocoran styling CSS global .modal-body, serta sinkronisasi reaktif blok visual draft editor antara template catalog dan canvas Visual Editor Studio.',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-141-1',
        type: 'improvement',
        scope: 'Modal Arsitektur Blueprint & Form UX',
        description: 'Merombak tampilan modal Terapkan Blueprint menjadi visual pipeline transfer (kartu blueprint sumber -> flow connector -> kartu kontainer target), selector palet warna aksen identitas dengan 8 warna enterprise, switch toggle bergaya iOS halus, indikator snapshot cadangan otomatis, serta tombol CTA bergaya bespoke Deep Slate.'
      },
      {
        id: 'c-141-2',
        type: 'bugfix',
        scope: 'CSS Architecture & Modal Body Scope Isolation',
        description: 'Menghilangkan kebocoran aturan global .modal-body dari visual-editor.css yang sebelumnya menyebabkan latar belakang modal menghitam, dan menetapkan styling modal terpusat di studio-master.css sesuai standar desain HeroCMS Studio.'
      },
      {
        id: 'c-141-3',
        type: 'bugfix',
        scope: 'Sinkronisasi Reaktif Visual Editor & State Draft',
        description: 'Memperbaiki ketidaksesuaian kunci penyimpanan draf (herocms_editor_draft_ vs cloudcms_draft_), menangani ekstraksi payload res.draft dari Go backend, serta menambahkan watcher reaktif pada VisualEditorModule agar blok baru dari blueprint langsung diterapkan ke kanvas tanpa tertimpa draft lama.'
      },
      {
        id: 'c-141-4',
        type: 'improvement',
        scope: 'Live Terminal Simulator & Visual Showcase',
        description: 'Menambahkan mockup terminal macOS interaktif pada hero pratinjau live simulator untuk menampilkan telemetri Traefik v3, latensi TTFB sub-2ms, dan isolasi Linux cgroups v2 secara realistis.'
      },
      {
        id: 'c-141-5',
        type: 'improvement',
        scope: 'Teleport Fullscreen Blur & Dead-Center Alignment',
        description: 'Membungkus seluruh modal dan simulator pratinjau dengan Teleport to="body" dan z-index 100000 agar efek backdrop blur menyelimuti 100% seluruh layar viewport (melintasi sidebar dan header atas tanpa terisolasi di content area), serta posisi form dialog tepat berada di tengah layar.'
      },
      {
        id: 'c-141-6',
        type: 'feature',
        scope: 'Desktop Simulator Fullscreen Edge-to-Edge',
        description: 'Menjadikan pratinjau versi desktop tampil dalam mode Layar Penuh 100% (Edge-to-Edge Fullscreen) secara default tanpa ruang hitam kosong di kiri-kanan, serta menyediakan tombol pengalih mode Layar Penuh vs Bingkai Jendela (1200px) di toolbar simulator.'
      },
      {
        id: 'c-141-7',
        type: 'feature',
        scope: 'Tablet Orientation Switcher (Portret 768px vs Lanskap 1024px)',
        description: 'Menambahkan fitur rotasi orientasi tablet (Portret 768px dan Lanskap 1024px) baik pada Simulator Layar Penuh maupun Split Studio Preview dengan animasi transisi sasis yang mulus, tombol pengalih di toolbar atas, serta adaptasi rendering responsif secara langsung.'
      },
      {
        id: 'c-141-8',
        type: 'feature',
        scope: 'Mobile Landscape Orientation Switcher (Portret 390px vs Lanskap 844px)',
        description: 'Menambahkan opsi rotasi orientasi smartphone (Portret 390px dan Lanskap 844px) dengan bezel fisik elegan, Dynamic Island presisi, indikator gestur bar bawah, transisi sasis mulus, dan adaptasi tata letak konten responsif.'
      },
      {
        id: 'c-141-9',
        type: 'feature',
        scope: 'Realistic Physical Hardware Device Mockups (Mobile Phone & iPad Tablet)',
        description: 'Mengubah tampilan pratinjau mobile dan tablet menjadi mockup fisik perangkat keras yang otentik: Smartphone Flagship (speaker earpiece slit, Dynamic Island dengan lensa kamera & sensor, status bar 09:41, floating Safari address pill, home notch pill) dan iPad Pro Tablet (bezel camera, status bar iPadOS, Safari tab strip & SSL address box, home indicator), baik di Simulator Layar Penuh maupun Split Studio View.'
      },
      {
        id: 'c-141-10',
        type: 'improvement',
        scope: 'Device Aspect Ratio & Screen Inner Scrolling Fix',
        description: 'Memperbaiki proporsi fisik perangkat mobile dan tablet agar tidak melar/memanjang tanpa batas ke bawah: menetapkan batas tinggi fisik proporsional (iPhone ~780px, iPad ~860px) dengan scrollbar internal yang mulus di dalam layar perangkat dan perataan tengah vertikal pada panggung simulator.'
      },
      {
        id: 'c-141-11',
        type: 'improvement',
        scope: 'Mobile Landscape Ergonomics & Hardware Orientation Realignment',
        description: 'Memperbaiki tata letak hardware smartphone pada mode rotasi lanskap: memindahkan Dynamic Island fisik ke bezel samping kiri (sesuai arah rotasi 90 derajat alami), menghilangkan lubang speaker yang janggal di sisi panjang atas, memperluas tinggi viewport lanskap menjadi 520px agar konten lega, menyatukan URL bar ke status bar atas, dan mempertahankan gestur bar bawah yang elegan.'
      },
      {
        id: 'c-141-12',
        type: 'improvement',
        scope: 'Stable Hardware Frame Preservation & Fluid Device Dimension Morphing',
        description: 'Memperbaiki sasis fisik perangkat agar bingkai HP dan tablet tidak pernah hilang atau berkedip saat orientasi diubah: menghilangkan keyframe 3D yang sebelumnya menimpa multi-ring box-shadow, memastikan bezel titanium dan rounded corners tetap kokoh utuh, serta menerapkan transisi dimensi hardware yang mulus berbasis kurva cubic-bezier(0.16, 1, 0.3, 1) layaknya simulator kelas industri.'
      },
      {
        id: 'c-141-13',
        type: 'feature',
        scope: 'Flagship Commercial Selling Store Blueprint (E-Commerce Jualan Retail)',
        description: 'Menetapkan blueprint Toko Online & Penjualan Produk Retail sebagai blueprint unggulan #1 (default) menggantikan portofolio personal: dilengkapi etalase produk dengan harga Rupiah, promo flash sale, keranjang belanja, tombol direct checkout WhatsApp, dan jaminan belanja aman untuk mendukung ekosistem website komersial yang berorientasi pada penjualan produk nyata.'
      }
    ]
  },
  {
    version: 'v1.4.0',
    releaseDate: '10 Oktober 2026',
    title: 'Katalog Template & Blueprint Store 100% Fungsional, Simulator Pratinjau Interaktif & Engine Deploy Satu-Klik',
    summary: 'Transformasi menyeluruh modul Katalog Template dari sekadar rancangan visual menjadi Blueprint Engine operasional 100%: 6 blueprint resmi siap pakai (Portofolio, Editorial Blog, Edukasi LMS, Bisnis UMKM, SaaS Startup, Agensi Kreatif), Simulator Pratinjau Interaktif dengan switch perangkat Desktop/Tablet/Mobile dan live color palette testing, kapabilitas penerapan langsung ke situs kontainer aktif, alokasi kontainer mandiri satu-klik, serta sinkronisasi penuh dengan Visual Editor dan backend Go PostgreSQL.',
    badge: 'Stable',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-140-1',
        type: 'feature',
        scope: 'Blueprint Engine & Dataset Arsitektur',
        description: 'Membuat dataset terpusat src/data/templates-data.ts berisi 6 blueprint arsitektur lengkap dengan skema blok visual native (navbar, hero, features, showcase, accordion FAQ, stats, cta, footer), konfigurasi tema, skor Lighthouse 100/100, dan metrik latensi TTFB sub-2ms.'
      },
      {
        id: 'c-140-2',
        type: 'feature',
        scope: 'Simulator Pratinjau Interaktif Responsif',
        description: 'Menghadirkan modal simulator pratinjau live fullscreen dengan simulasi viewport multi-perangkat (Desktop 1200px, Tablet 768px, Mobile 390px), pengujian palet warna aksen real-time, browser chassis realistis, serta tombol aksi cepat untuk menerapkan atau mendeploy blueprint.'
      },
      {
        id: 'c-140-3',
        type: 'feature',
        scope: 'Engine Penerapan Template & Deploy Kontainer',
        description: 'Menyediakan fitur Terapkan Blueprint ke Situs Aktif yang secara otomatis menimpa draft editor dan tema kontainer terpilih serta menyinkronkannya ke backend, dan fitur Deploy Blueprint Baru dengan formulir alokasi kontainer otomatis ber-subdomain cloudcms.app.'
      },
      {
        id: 'c-140-4',
        type: 'improvement',
        scope: 'Backend Go Service & Repository Integration',
        description: 'Memperluas CreateContainerInput pada Go backend agar mendukung parameter templateName, accentColor, dan bioIntro kustom serta menyimpannya ke database PostgreSQL dan cache RLS.'
      },
      {
        id: 'c-140-5',
        type: 'feature',
        scope: 'Ecosystem Condiments & Dual View Mode',
        description: 'Menambahkan banner Spotlight Blueprint Pilihan Editor, bar metrik Marketplace Pulse Telemetry, mode tampilan Dual View (Grid Catalog vs Split Studio Inspector berdampingan dengan live device preview instan), peta alur kerja filosofi blueprint (3 langkah), serta banner asisten AI Blueprint Architect.'
      },
      {
        id: 'c-140-6',
        type: 'improvement',
        scope: 'Realistic Device Simulator & Dynamic Block Rendering',
        description: 'Memperbaharui simulator pratinjau secara radikal: menghadirkan komponen TemplateLiveRenderer yang merender blok visual aktual (Accordion buka-tutup interaktif, toggle paket harga, ranking listgroup, showcase studi kasus), chassis smartphone realistis dengan Dynamic Island & status bar, macOS browser bar dengan live TTFB status, switch dark/light mode live, zoom scaler (100%, 85%, 70%), dan animasi muat ulang.'
      }
    ]
  },
  {
    version: 'v1.3.9',
    releaseDate: '10 Oktober 2026',
    title: 'Isolasi Cache Multi-Tenant per User, Proteksi CSRF & Sinkronisasi Metrik Kapasitas',
    summary: 'Perbaikan komprehensif pada integritas state multi-tenant: isolasi cache localStorage per user/tenant, perbaikan validasi array kosong (Array.isArray) agar menu tidak tertukar data mock antar-user, pencegahan reset kapasitas storage menjadi 0 MB saat beralih akun, penataan urutan CSRF saat login, dan penerapan NoCache HTTP header pada backend API.',
    badge: 'Stable',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-139-1',
        type: 'bugfix',
        scope: 'State Management & LocalStorage Cache',
        description: 'Menerapkan scoping kunci cache localStorage berbasis user email (herocms_dashboard_cache_${email}) dan memperbaiki validasi sinkronisasi data dari Array.length menjadi Array.isArray pada containers, articles, custom domains, tickets, invoices, dan webhooks sehingga akun dengan 0 item menampilkan data asli kosong alih-alih tertukar data seed atau data user sebelumnya.'
      },
      {
        id: 'c-139-2',
        type: 'bugfix',
        scope: 'Media Storage Telemetry & Client Recalculation',
        description: 'Mencegah recalculateStorage klien menimpa telemetri kapasitas server S3 yang valid menjadi 0 MB saat beralih akun atau saat upload/delete berkas, serta mempertahankan angka kapasitas real-time yang dilaporkan oleh database dan MinIO S3.'
      },
      {
        id: 'c-139-3',
        type: 'bugfix',
        scope: 'Auth Flow & Backend Cache Security',
        description: 'Memperbaiki urutan pemanggilan resetDashboardState sebelum request login/register agar token CSRF dan sesi tidak terhapus pasca-login, menambahkan middleware NoCache pada seluruh rute /api/* untuk mencegah browser caching antar-akun, dan memastikan registrasi tenant baru selalu menghasilkan UUID valid.'
      }
    ]
  },
  {
    version: 'v1.3.8',
    releaseDate: '10 Oktober 2026',
    title: 'Audit & Penyempurnaan Modul Media Assets S3 MinIO',
    summary: 'Penyempurnaan arsitektur media assets: penambahan kolom bucket_name pada DDL & migrasi PostgreSQL, penyempurnaan unduhan file via blob fetch, filter sorting aset (Terbaru, Terlama, Nama, Ukuran), pratinjau interaktif dokumen PDF dalam modal inspector, penanganan gambar gagal muat, dan eliminasi flicker drag-and-drop.',
    badge: 'Stable',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-138-1',
        type: 'bugfix',
        scope: 'PostgreSQL Database & Repository',
        description: 'Memperbaiki skema DDL media_assets dan menambahkan migrasi ALTER TABLE ADD COLUMN IF NOT EXISTS bucket_name agar query CreateAsset dan GetAssets berjalan tanpa kendala kolom tidak ditemukan.'
      },
      {
        id: 'c-138-2',
        type: 'improvement',
        scope: 'Media Assets UI & UX',
        description: 'Menambahkan fitur sort berkas (Terbaru, Terlama, Nama A-Z, Ukuran), pratinjau lembar PDF langsung di modal inspector, fallback thumbnail gambar gagal muat, dukungan filter GIF & TXT, dan download berkas langsung berbasis blob URL.'
      }
    ]
  },
  {
    version: 'v1.3.7',
    releaseDate: '28 September 2026',
    title: 'Dukungan Multi-Arsitektur CI/CD (linux/amd64 & linux/arm64/v8)',
    summary: 'Menerapkan setup QEMU dan kompilasi multi-arsitektur Buildx pada pipeline GitHub Actions agar image Docker di Docker Hub mendukung arsitektur ARM64 (Apple Silicon, Raspberry Pi, AWS Graviton) dan AMD64 secara native tanpa error manifest.',
    badge: 'Stable',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-137-1',
        type: 'feature',
        scope: 'CI/CD Multi-Arch Pipeline',
        description: 'Mengintegrasikan docker/setup-qemu-action@v3 dan parameter platforms: linux/amd64,linux/arm64 pada workflow .github/workflows/docker-image.yml untuk menghasilkan image manifest multi-platform bagi roxas0800/herocms-dashboard dan roxas0800/herocms-marketing.'
      }
    ]
  },
  {
    version: 'v1.3.6',
    releaseDate: '28 September 2026',
    title: 'Adopsi Pre-Built Container Image Resmi CI/CD pada Docker Compose',
    summary: 'Menggantikan build lokal Dockerfile pada service dashboard-cms dan marketing-site dengan image resmi terkompilasi dari Docker Hub (roxas0800/herocms-dashboard dan roxas0800/herocms-marketing) hasil pipeline CI/CD GitHub Actions.',
    badge: 'Stable',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-136-1',
        type: 'improvement',
        scope: 'Docker Compose & Production Deployment',
        description: 'Menghapus direktif local build context pada service dashboard-cms dan marketing-site di docker-compose.yml, beralih penuh ke Docker Hub registry image roxas0800/herocms-dashboard:latest dan roxas0800/herocms-marketing:latest untuk mempercepat deployment tanpa overhead kompilasi lokal.'
      }
    ]
  },
  {
    version: 'v1.3.5',
    releaseDate: '28 September 2026',
    title: 'Integrasi Traefik Edge Routing untuk MinIO S3 (minio.stackbyte.id)',
    summary: 'Menghubungkan container MinIO ke traefik_network dengan konfigurasi dynamic router label Traefik v3 untuk endpoint publik S3 (minio.stackbyte.id) dan MinIO Console (minio-console.stackbyte.id) tanpa ekspos port numerik.',
    badge: 'Stable',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-135-1',
        type: 'feature',
        scope: 'Traefik Edge & Ingress',
        description: 'Menerapkan dynamic routing Traefik v3 untuk MinIO S3 API (Port 9000) pada Host minio.stackbyte.id dan Web Console UI (Port 9001) pada Host minio-console.stackbyte.id tanpa membutuhkan port di URL.'
      },
      {
        id: 'c-135-2',
        type: 'improvement',
        scope: 'Environment & Docker Compose',
        description: 'Menghubungkan container herocms_minio ke bridge external traefik_network dan menyelaraskan S3_PUBLIC_URL default menjadi http://minio.stackbyte.id.'
      }
    ]
  },
  {
    version: 'v1.3.4',
    releaseDate: '28 September 2026',
    title: 'Pipeline CI/CD: GitHub Actions Otomatisasi Build & Push Docker Hub',
    summary: 'Menerapkan workflow GitHub Actions terenkripsi untuk otomatisasi kompilasi image Docker (dashboard-cms dan marketing-site) serta push ke Docker Hub menggunakan kredensial rahasia tersimpan.',
    badge: 'Stable',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-134-1',
        type: 'feature',
        scope: 'GitHub Actions CI/CD',
        description: 'Menambahkan workflow .github/workflows/docker-image.yml dengan strategi build matrix, caching layer GitHub Actions (GHA), serta integrasi aman DOCKERHUB_USERNAME dan DOCKERHUB_TOKEN via GitHub Repository Secrets.'
      }
    ]
  },
  {
    version: 'v1.3.3',
    releaseDate: '28 September 2026',
    title: 'Perbaikan Sanitasi Skema URL Clipboard & Pencegahan Duplikasi Protokol',
    summary: 'Memperbaiki helper copyToClipboard agar mendeteksi protokol URL dan URI scheme (http, https, s3) yang sudah ada dari environment, sehingga menyalin URL tidak lagi menghasilkan prefiks ganda seperti https://http://.',
    badge: 'Stable',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-133-1',
        type: 'bugfix',
        scope: 'Clipboard & URL Resolver',
        description: 'Menghilangkan penambahan protokol https:// secara paksa pada helper copyToClipboard. Skema URL yang sudah diawali http://, https://, atau s3:// disalin utuh apa adanya sesuai konfigurasi environment.'
      }
    ]
  },
  {
    version: 'v1.3.2',
    releaseDate: '28 September 2026',
    title: 'Transisi Data Aktual Media S3 & Penulisan Penggunaan Kuota Real-Time',
    summary: 'Menghapus seluruh berkas contoh/demo statis dari basis data dan repositori, beralih penuh ke data aktual customer, serta menghadirkan kalkulasi dan penulisan metrik kapasitas penyimpanan S3 secara real-time pada setiap unggahan dan penghapusan berkas.',
    badge: 'Stable',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-132-1',
        type: 'improvement',
        scope: 'Pembersihan Data Contoh / Mock',
        description: 'Menghapus seluruh entri mock media dari PostgreSQL, repository Go, dan inisialisasi frontend seeds. Mengarahkan modul Media Assets murni menampilkan berkas yang benar-benar diunggah oleh tenant.'
      },
      {
        id: 'c-132-2',
        type: 'feature',
        scope: 'Real-Time Storage Usage Telemetry',
        description: 'Menerapkan kalkulasi penggunaan kuota dinamis (recalculateStorage) di klien dan server: kapasitas S3 terpakai, kuota bebas (2.0 GB), persentase utilisasi, dan jumlah berkas langsung diperbarui saat berkas diunggah atau dihapus.'
      },
      {
        id: 'c-132-3',
        type: 'improvement',
        scope: 'Cache & Hydration Synchronization',
        description: 'Menyinkronkan status penyimpanan dan nama bucket ke dalam warmup bundle Redis serta cache lokal dashboard, mencegah keterlambatan pembacaan telemetri saat aplikasi dimuat ulang.'
      },
      {
        id: 'c-132-4',
        type: 'improvement',
        scope: 'Environment Templates (.env.example)',
        description: 'Menambahkan konfigurasi lengkap MinIO S3 Object Storage (S3_PORT, MINIO_CONSOLE_PORT, S3_ENDPOINT, S3_ACCESS_KEY, S3_SECRET_KEY, S3_BUCKET, S3_USE_SSL, S3_PUBLIC_URL) pada file template .env.example root dan dashboard-cms.'
      }
    ]
  },
  {
    version: 'v1.3.1',
    releaseDate: '28 September 2026',
    title: 'Desain Ulang Modal Media Inspector & Render Thumbnail Asli S3',
    summary: 'Merombak tampilan modal inspeksi berkas menjadi Media Inspector modern dengan hero visual viewport, render foto asli, grid telemetri 2x2, serta perapihan URL bar dengan tombol 1-klik salin dan buka tab baru.',
    badge: 'Stable',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-131-1',
        type: 'improvement',
        scope: 'Media Inspector Modal UI',
        description: 'Merombak modal preview berkas (.modal-dialog-media-inspector): menampilkan foto nyata langsung di viewport kanvas dengan background studio, grid telemetri spesifikasi 2x2, dan bilah salin URL/URI S3 tanpa pemotongan teks.'
      },
      {
        id: 'c-131-2',
        type: 'improvement',
        scope: 'Galeri Media Assets',
        description: 'Menampilkan thumbnail foto nyata pada kartu galeri berkas gambar (JPG, PNG, WebP, AVIF) menggantikan placeholder grafis statis.'
      },
      {
        id: 'c-131-3',
        type: 'bugfix',
        scope: 'URL Resolver S3',
        description: 'Membersihkan duplikasi prefiks bucket pada resolusi storageURL di storage layer MinIO sehingga URL langsung merujuk ke bucket tenant secara presisi.'
      }
    ]
  },
  {
    version: 'v1.3.0',
    releaseDate: '28 September 2026',
    title: 'Multi-Tenant S3 Bucket Isolation, Kuota Hard Limit 2 GB & Pertahanan Siber Media Assets',
    summary: 'Menerapkan arsitektur segregasi S3 bucket mandiri per customer (1 tenant = 1 dedicated bucket), penegakan kuota penyimpanan 2.0 GB server-side, magic bytes content sniffing, whitelist tipe berkas aman, dan telemetri kuota dinamis.',
    badge: 'Stable',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-130-1',
        type: 'feature',
        scope: 'Multi-Tenant S3 Bucket Engine',
        description: 'Menerapkan segregasi fisik S3 di mana setiap tenant memiliki dedicated bucket MinIO mandiri (tenant-<id>-media) dengan lazy auto-provisioning dan scoped public-read policy.'
      },
      {
        id: 'c-130-2',
        type: 'security',
        scope: 'File Upload & Anti-Malware Sniffing',
        description: 'Menambahkan deteksi magic bytes (512 bytes awal), whitelist ketat (Gambar, PDF, CSV, XLSX, DOCX, TXT), dan pemblokiran total executable/skrip berbahaya (.exe, .sh, .php, .js).'
      },
      {
        id: 'c-130-3',
        type: 'feature',
        scope: 'Storage Quota Enforcer (2 GB)',
        description: 'Penegakan batas kuota penyimpanan 2.0 GB per akun customer di backend Go dengan penolakan HTTP 413 dan visual gauge telemetri real-time di UI Media Assets.'
      }
    ]
  },
  {
    version: 'v1.2.7',
    releaseDate: '28 September 2026',
    title: 'Modernisasi Image MinIO S3 & Penataan Port Orkestrasi Database Lokal',
    summary: 'Memperbarui image container MinIO S3 ke image resmi Chainguard (cgr.dev/chainguard/minio) untuk mengatasi deprecation image lama di Docker Hub/Quay, serta menata mapping port agar tidak bentrok dengan Portainer.',
    badge: 'Stable',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-127-1',
        type: 'bugfix',
        scope: 'Infrastruktur MinIO S3',
        description: 'Memperbarui image MinIO S3 pada docker-compose.db.yml dan docker-compose.yml menggunakan cgr.dev/chainguard/minio:latest dan menyesuaikan healthcheck tanpa utilitas mc.'
      },
      {
        id: 'c-127-2',
        type: 'improvement',
        scope: 'Local Docker Environment',
        description: 'Menyesuaikan alokasi port Portainer (HTTP: 9002, HTTPS: 9443) agar port 9000 bersih dan dapat digunakan secara optimal oleh MinIO S3 API.'
      }
    ]
  },
  {
    version: 'v1.2.6',
    releaseDate: '22 September 2026',
    title: 'Integrasi MinIO S3 Object Storage untuk Media Assets & Refinement Command Search Bar',
    summary: 'Mengaktifkan arsitektur MinIO S3 Object Storage asli untuk menu Media Assets (S3) lengkap dengan konfigurasi Docker Compose, S3 client Go (minio-go/v7), endpoint upload multipart & delete, serta perampingan visual Search Command Bar di seluruh modul dashboard.',
    badge: 'Stable',
    author: 'HeroCMS Core Architecture Team',
    items: [
      {
        id: 'c-126-1',
        type: 'feature',
        scope: 'Infrastruktur MinIO S3',
        description: 'Menambahkan container MinIO S3 dan volume data pada docker-compose.db.yml dan docker-compose.yml (port 9000 untuk S3 API dan port 9001 untuk Web Console), lengkap dengan konfigurasi kredensial dan bucket herocms-media.'
      },
      {
        id: 'c-126-2',
        type: 'feature',
        scope: 'Backend Golang Storage Layer',
        description: 'Menerapkan package resmi minio-go/v7 dalam storage.S3Client dengan auto-create bucket dan policy public-read, penambahan CreateAsset dan DeleteAsset di repository, serta endpoint POST /api/assets/upload dan DELETE /api/assets/:id.'
      },
      {
        id: 'c-126-3',
        type: 'feature',
        scope: 'Frontend Media Assets (S3)',
        description: 'Menghubungkan unggahan berkas nyata (FormData multipart) dan penghapusan aset via apiClient.ts dan useDashboardData.ts, dilengkapi indikator loading spinner saat upload, tombol hapus di hover kartu, dan tombol hapus di modal preview berkas.'
      },
      {
        id: 'c-126-4',
        type: 'improvement',
        scope: 'Sistem Pencarian Command Bar',
        description: 'Merampingkan CSS .search-command-shell pada studio-master.css menjadi satu kontainer modern (tinggi 38px, border-radius 9px, focus ring 2px halus) di modul Situs & Kontainer, Media Assets, Katalog Template, dan Changelog, dilengkapi tombol clear X dan shortcut ⌘K.'
      }
    ]
  },
  {
    version: 'v1.2.5',
    releaseDate: '22 September 2026',
    title: 'Restorasi Arsitektur Kartu Kontainer & Kompatibilitas Studio Master CSS',
    summary: 'Memperbaiki tata letak kartu kontainer yang sempat berantakan akibat mismatch class HTML. Mengembalikan struktur markup visual studio resmi yang terhubung dengan studio-master.css (radar status chip, subdomain URL box, dual resource gauges, dan action control bar).',
    badge: 'Stable',
    author: 'HeroCMS Core Architecture Team',
    items: [
      {
        id: 'c-125-1',
        type: 'bugfix',
        scope: 'Situs & Kontainer UI',
        description: 'Mengembalikan struktur markup kartu .pro-site-card ke standar studio-master.css, memulihkan radar status pill bengan animasi ping, kotak tautan subdomain terpadu, pengukur alokasi CPU & RAM dengan track gradient, serta bar tombol kontrol runtime Docker.'
      }
    ]
  },
  {
    version: 'v1.2.4',
    releaseDate: '22 September 2026',
    title: 'Penyelarasan Desain Toolbar & Searchbar, Perbaikan CSS Billing, dan Validasi Runtime Kontainer',
    summary: 'Penyelarasan visual dan fungsional pada sistem pencarian antar modul: integrasi command bar ⌘K terpadu dengan segmented pill filter, styling tombol Upgrade Paket langganan, perbaikan search query kontainer dan template, serta pembersihan card specs telemetri.',
    badge: 'Stable',
    author: 'HeroCMS Core Architecture Team',
    items: [
      {
        id: 'c-124-1',
        type: 'bugfix',
        scope: 'Kapasitas & Paket Langganan',
        description: 'Menambahkan rule CSS .btn-upgrade-action pada studio-master.css sehingga tombol Upgrade / Ganti Paket memiliki visual Deep Slate dan efek hover Royal Blue yang elegan.'
      },
      {
        id: 'c-124-2',
        type: 'improvement',
        scope: 'Changelog & Toolbar',
        description: 'Merestrukturisasi toolbar ChangelogModule menjadi layout 1 baris modern (.filter-toolbar) yang menyatukan search command bar dengan tombol filter jenis perubahan (segmented-pill).'
      },
      {
        id: 'c-124-3',
        type: 'bugfix',
        scope: 'Pencarian & Kontainer',
        description: 'Memperbaiki logika filter pencarian pada Situs & Kontainer dan Katalog Template agar responsif terhadap kata kunci multi-field, dilengkapi shortcut ⌘K dan empty state action.'
      },
      {
        id: 'c-124-4',
        type: 'improvement',
        scope: 'Runtime & TypeScript',
        description: 'Menyelaraskan properti telemetry card specs pada ContainersModule dan filteredContainers di useDashboardData dengan interface ContainerSite yang valid.'
      }
    ]
  },
  {
    version: 'v1.2.3',
    releaseDate: '22 September 2026',
    title: 'Perbaikan Total Pusat Bantuan, Siklus Tiket & Sinkronisasi DB/Redis',
    summary: 'Restorasi menyeluruh pada modul tiket support: integrasi penuh API backend (Create, Reply, Resolve), proteksi null-safety pesan, normalisasi status/prioritas, dan identitas author tenant dinamis.',
    badge: 'Stable',
    author: 'HeroCMS Core Architecture Team',
    items: [
      {
        id: 'c-123-1',
        type: 'bugfix',
        scope: 'Pusat Bantuan & Tiket',
        description: 'Menambahkan fungsi normalisasi data (normalizeTicket) untuk mencegah runtime exception ketika daftar tiket dimuat dari Redis / backend tanpa array pesan.'
      },
      {
        id: 'c-123-2',
        type: 'feature',
        scope: 'Backend API & DB',
        description: 'Mengimplementasikan endpoint penuh POST /tickets, POST /tickets/:id/messages, dan PUT /tickets/:id/resolve dengan persistensi PostgreSQL dan cache invalidation Redis.'
      },
      {
        id: 'c-123-3',
        type: 'improvement',
        scope: 'Identitas Tenant',
        description: 'Menggantikan authorName hardcoded dengan identitas akun aktif (getTenantAuthor) yang sinkron dengan email tenant login saat membuat tiket atau membalas pesan.'
      },
      {
        id: 'c-123-4',
        type: 'improvement',
        scope: 'UI / UX & Keyboard',
        description: 'Dukungan pintasan keyboard Cmd+Enter (macOS) dan Ctrl+Enter untuk pengiriman balasan instan, auto-scroll thread, serta proteksi fallback status L2 assigned.'
      }
    ]
  },
  {
    version: 'v1.2.2',
    releaseDate: '22 September 2026',
    title: 'Sesi Logout Terpadu, Auto-Invalidation Cache & Standar Changelog',
    summary: 'Pembaruan krusial pada penanganan siklus logout sesi multi-user, auto-purge service worker usang, dan integrasi modul catatan rilis sistem.',
    badge: 'Stable',
    author: 'HeroCMS Core Architecture Team',
    items: [
      {
        id: 'c-122-1',
        type: 'bugfix',
        scope: 'Auth & Redis',
        description: 'Memusnahkan sesi Redis (DeleteSession) dan menghapus cookie herocms_session serta CSRF saat logout via API /api/auth/logout.'
      },
      {
        id: 'c-122-2',
        type: 'bugfix',
        scope: 'State Management',
        description: 'Implementasi resetDashboardState() yang membersihkan seluruh singleton reactive ref dan cache lokal saat user berganti akun.'
      },
      {
        id: 'c-122-3',
        type: 'security',
        scope: 'Middleware',
        description: 'Memprioritaskan Authorization Bearer token di atas session cookie lama pada middleware SessionOrJWTAuth.'
      },
      {
        id: 'c-122-4',
        type: 'performance',
        scope: 'Cache Invalidation',
        description: 'Menonaktifkan service worker agresif dan menambahkan header anti-cache pada index.html sehingga update CSS/JS langsung aktif tanpa perlu CTRL + SHIFT + R.'
      },
      {
        id: 'c-122-5',
        type: 'feature',
        scope: 'Changelog',
        description: 'Penambahan menu Changelog & Rilis terpadu pada dashboard tenant serta standarisasi Semantic Versioning bagi AI Agent di AGENTS.md.'
      }
    ]
  },
  {
    version: 'v1.2.1',
    releaseDate: '22 September 2026',
    title: 'Hardware-Accelerated Smooth Scrolling 120 FPS & Dock Optimization',
    summary: 'Menghilangkan lagging pada panel kiri editor visual dan menyelaraskan smooth scrolling di seluruh 11 menu dashboard.',
    badge: 'Stable',
    author: 'HeroCMS Frontend Team',
    items: [
      {
        id: 'c-121-1',
        type: 'bugfix',
        scope: 'Visual Editor',
        description: 'Menghapus event listener pembajak wheel JS (onDockTabWheel) yang menyebabkan lagging parah pada trackpad MacBook.'
      },
      {
        id: 'c-121-2',
        type: 'performance',
        scope: 'CSS Master',
        description: 'Menghapus scroll-behavior: smooth dari universal selector * dan membatasinya hanya pada root html dengan fallback prefers-reduced-motion.'
      },
      {
        id: 'c-121-3',
        type: 'performance',
        scope: 'GPU Compositing',
        description: 'Menambahkan transform: translateZ(0) pada dock-tab-body dan contain: content pada visual-wireframe-card untuk rendering 120 FPS mulus.'
      },
      {
        id: 'c-121-4',
        type: 'improvement',
        scope: 'Navigation',
        description: 'Menambahkan watcher activeMenu di DashboardView.vue untuk auto smooth scroll kembali ke atas saat berpindah antar menu.'
      }
    ]
  },
  {
    version: 'v1.2.0',
    releaseDate: '21 September 2026',
    title: 'Canva-Style Block Wireframes & Carousel Chip Navigasi',
    summary: 'Peningkatan besar pada pengalaman memilih komponen visual di editor dengan wireframe interaktif dan navigasi kategori horizontal.',
    badge: 'Stable',
    author: 'HeroCMS Studio Design Team',
    items: [
      {
        id: 'c-120-1',
        type: 'feature',
        scope: 'Visual Editor',
        description: 'Tampilan wireframe visual preview mini untuk setiap kartu komponen di katalog blok (Navbar, Hero, Bento Grid, Progress Bar).'
      },
      {
        id: 'c-120-2',
        type: 'feature',
        scope: 'Visual Editor',
        description: 'Tombol navigasi panah kiri & kanan carousel chip kategori dengan indikator visual state.'
      },
      {
        id: 'c-120-3',
        type: 'improvement',
        scope: 'UI / UX',
        description: 'Penyelarasan floating toolbar editor agar tetap terlihat jelas pada blok teratas tanpa tertutup header.'
      }
    ]
  },
  {
    version: 'v1.1.0',
    releaseDate: '20 September 2026',
    title: 'Support Ticketing Module & Real-Time Reader Mode',
    summary: 'Peluncuran modul bantuan DevOps 24/7 dan mode baca artikel minim gangguan.',
    author: 'HeroCMS Support & Publishing Team',
    items: [
      {
        id: 'c-110-1',
        type: 'feature',
        scope: 'Tickets',
        description: 'Sistem tiket support multi-level dengan SLA counter, badge prioritas, dan percakapan interaktif dua arah.'
      },
      {
        id: 'c-110-2',
        type: 'feature',
        scope: 'Articles',
        description: 'Distraction-free Reader View dengan auto-hide sidebar, kalkulator waktu baca, dan navigasi artikel sebelum/sesudah.'
      },
      {
        id: 'c-110-3',
        type: 'improvement',
        scope: 'Performance',
        description: 'Code-splitting modul antarmuka menggunakan defineAsyncComponent untuk menjaga initial bundle di bawah 70 kB.'
      }
    ]
  },
  {
    version: 'v1.0.0',
    releaseDate: '18 September 2026',
    title: 'Peluncuran Perdana HeroCMS Studio Enterprise Cloud',
    summary: 'Rilis fondasi utama platform CMS cloud multi-tenant dengan isolasi kontainer Docker dan Traefik edge proxy.',
    badge: 'LTS',
    author: 'HeroCMS Engineering',
    items: [
      {
        id: 'c-100-1',
        type: 'feature',
        scope: 'Core Hub',
        description: 'Penyediaan kontainer mandiri berbasis cgroups Linux dengan alokasi vCPU, RAM, dan SSD transparan.'
      },
      {
        id: 'c-100-2',
        type: 'security',
        scope: 'Database & Auth',
        description: 'Row-Level Security (RLS) PostgreSQL 16 multi-tenant dan proteksi CSRF Double Submit Cookie.'
      },
      {
        id: 'c-100-3',
        type: 'feature',
        scope: 'Telemetry & Cache',
        description: 'Integrasi Redis 7 untuk rate limiting 120 req/menit, ZSET hit counter artikel, dan Traefik v3 proxy routing.'
      }
    ]
  }
];
