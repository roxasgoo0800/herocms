import type { ChangelogRelease } from '../types/dashboard';

export const changelogReleases: ChangelogRelease[] = [
  {
    version: 'v1.2.5',
    releaseDate: '22 September 2026',
    title: 'Restorasi Arsitektur Kartu Kontainer & Kompatibilitas Studio Master CSS',
    summary: 'Memperbaiki tata letak kartu kontainer yang sempat berantakan akibat mismatch class HTML. Mengembalikan struktur markup visual studio resmi yang terhubung dengan studio-master.css (radar status chip, subdomain URL box, dual resource gauges, dan action control bar).',
    badge: 'Latest',
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
