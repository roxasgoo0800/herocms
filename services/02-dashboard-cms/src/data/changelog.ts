import type { ChangelogRelease, MicroserviceVersion } from '../types/dashboard';

export const microserviceVersions: MicroserviceVersion[] = [
  {
    id: '01-admin-console',
    name: 'Service 01: Admin Console & Billing',
    version: 'v1.2.0',
    serviceFolder: 'services/01-admin-console',
    badge: 'Stable',
    stack: 'Laravel 11 • FilamentPHP v3',
    lastUpdated: '18 Oktober 2026',
    leadPic: 'Andalusia'
  },
  {
    id: '02-dashboard-cms',
    name: 'Service 02: Dashboard Studio & Go BFF',
    version: 'v1.40.9',
    serviceFolder: 'services/02-dashboard-cms',
    badge: 'Latest',
    stack: 'Vue 3 • Vite • Pinia • Go Gin (8085)',
    lastUpdated: '30 Oktober 2026',
    leadPic: 'Irgi & Rizal'
  },
  {
    id: '03-provision-orchestrator',
    name: 'Service 03: Container Provision Orchestrator',
    version: 'v1.2.2',
    serviceFolder: 'services/03-provision-orchestrator',
    badge: 'Stable',
    stack: 'Golang • Docker Engine SDK • cgroups v2',
    lastUpdated: '26 Oktober 2026',
    leadPic: 'Andalusia & Rizal'
  },
  {
    id: '04-marketing-site',
    name: 'Service 04: Marketing Site & Public Landing',
    version: 'v1.9.3',
    serviceFolder: 'services/04-marketing-site',
    badge: 'Stable',
    stack: 'React 19 • Tailwind CSS • Vite',
    lastUpdated: '24 Oktober 2026',
    leadPic: 'Irgi'
  },
  {
    id: '05-ai-agent-service',
    name: 'Service 05: AI Agent Service & Workflows',
    version: 'v1.3.0',
    serviceFolder: 'services/05-ai-agent-service',
    badge: 'Stable',
    stack: 'Golang / Python • Gemini • n8n',
    lastUpdated: '17 Oktober 2026',
    leadPic: 'Andalusia'
  },
  {
    id: '06-mobile-companion',
    name: 'Service 06: Mobile Companion Platform',
    version: 'v1.0.0',
    serviceFolder: 'mobile-companion/',
    badge: 'Active',
    stack: 'Flutter / React Native • FCM',
    lastUpdated: '16 Oktober 2026',
    leadPic: 'Tyno'
  },
  {
    id: '07-docs',
    name: 'Service 07: Docs & Mission Control Hub',
    version: 'v1.5.8',
    serviceFolder: 'services/07-docs',
    badge: 'Latest',
    stack: 'Vue 3 • Go Native BFF (8087) • Docker',
    lastUpdated: '26 Oktober 2026',
    leadPic: 'Rizal & Paijo AI'
  }
];

export const changelogReleases: ChangelogRelease[] = [
  {
    version: 'v1.40.9',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '30 Oktober 2026',
    title: 'Sitemap Alur Figma: Layout Hierarki Rute Bertingkat & Anti-Tumpang Tindih',
    summary: 'Perombakan tata letak kanvas Alur Figma: (1) Frame halaman kini diposisikan dari pohon rute, bukan indeks array. Rute utama (/about, /harga) berjajar horizontal, sedangkan sub-rute (/about/rizal) ditumpuk vertikal tepat di bawah halaman induknya; (2) Tinggi frame dihitung dari tinggi riil artboard (±880px) sehingga frame tidak lagi saling menimpa, dan tinggi kanvas/SVG mengikuti isi; (3) Konektor kini ditarik dari halaman induk langsung (/about → /about/rizal) dengan kurva vertikal, bukan semuanya dari beranda; (4) Pembuatan sub-rute wajib memiliki halaman induk, path dinormalisasi (slash ganda/akhir), dan link sub-rute hanya ditambahkan ke navbar halaman induk.',
    badge: 'Latest',
    author: 'Aether Core Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'CHG-4024',
        type: 'bugfix',
        scope: 'Sitemap Frame Overlap',
        description: 'Posisi frame dihitung dari layout pohon rute dengan tinggi frame riil sehingga artboard tidak saling menumpuk.'
      },
      {
        id: 'CHG-4025',
        type: 'feature',
        scope: 'Nested Route Hierarchy',
        description: 'Sub-rute ditempatkan di bawah halaman induknya dengan konektor vertikal induk → anak; validasi halaman induk dan navbar sub-rute hanya di halaman induk.'
      }
    ]
  },
  {
    version: 'v1.40.8',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '29 Oktober 2026',
    title: 'Adaptive Zoom-Proportional Floating Shelf HUD & Dynamic Boundary Clamping',
    summary: 'Penyempurnaan arsitektur floating tools shelf (.studio-viewport-floating-shelf) agar beradaptasi secara dinamis terhadap level zoom kanvas: (1) Proportional Zoom Scaling: Toolbar tools kini otomatis menyesuaikan ukurannya secara tersinkronisasi 1:1 dengan rasio zoom kanvas (scale = Math.min(1.0, Math.max(0.35, zoom.value))), sehingga saat pengguna melakukan zoom out (misal: 35%, 40%, 50%), toolbar tidak lagi tampak raksasa ("ngikut gede") melainkan mengecil proporsional mengikuti ukuran artboard website; (2) Boundary Clearance & Auto-Clamping: Menghitung effectiveShelfWidth dan effectiveShelfHeight yang mempertimbangkan faktor skala sehingga kalkulasi posisi vertikal (idealTop) dan pembatasan horizontal (minLeft/maxLeft) selalu presisi 16px dari batas layar dan tombol Detail di sisi kanan tidak pernah terpotong; (3) Transform & Motion Parity: Menetapkan transformOrigin: top center dan sinkronisasi variabel CSS --shelf-scale pada transisi hud-slide-down untuk pergerakan bebas lonjakan; (4) Strict View Mode Guard: Memastikan tools toolbar secara mutlak hanya muncul pada mode Single WYSIWYG dan otomatis tersembunyi ketika berada di mode Alur Figma, Pratinjau, maupun saat menekan ESC / klik di latar kanvas.',
    badge: 'Stable',
    author: 'Aether Core Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'CHG-4022',
        type: 'improvement',
        scope: 'Zoom-Proportional Floating HUD',
        description: 'Menyinkronkan skala visual floating tools toolbar dengan zoom kanvas sehingga mengecil proporsional saat zoom out.'
      },
      {
        id: 'CHG-4023',
        type: 'bugfix',
        scope: 'Floating HUD Boundary Clamping & Origin Fix',
        description: 'Mencegah pemotongan tombol tepi kanan dan lonjakan transisi dengan memperhitungkan skala efektif pada boundary clamping.'
      }
    ]
  },
  {
    version: 'v1.40.7',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '29 Oktober 2026',
    title: 'Template Preservation on Refresh & Zero-Delay LocalStorage Persistence',
    summary: 'Perbaikan mendasar pada proses pemuatan template dan ketahanan draf saat peramban di-refresh: (1) Template Hijacking Fix: Menghilangkan paksaan tpl_corporate_multipage pada loadBlocksForActiveContainer yang sebelumnya menyebabkan kontainer pengguna (seperti wedak Toko HeroStore) terganti secara sepihak ke template korporat saat halaman di-refresh; (2) User Customization Priority: Memastikan halaman dan blok yang tersimpan pada themeConfig kontainer selalu diprioritaskan sebelum fallback ke template bawaan; (3) Zero-Delay LocalStorage Persistence: Menjadikan penyimpanan draf ke localStorage berjalan instan (0ms sinkron) sebelum request debounce ke Redis, menjamin halaman baru yang baru saja dibuat (/about) tidak akan hilang meski peramban di-refresh dalam hitungan milidetik; (4) Instant Hydration from Local Storage: Memprioritaskan pembacaan draf lokal saat booting sehingga restorasi status halaman berlangsung instan tanpa lag.',
    badge: 'Stable',
    author: 'Aether Core Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'CHG-4020',
        type: 'bugfix',
        scope: 'Multi-Page Template Hijacking Prevention',
        description: 'Mencegah situs terkonversi paksa ke template korporat saat di-refresh dengan menghapus kondisi fallback ambigu.'
      },
      {
        id: 'CHG-4021',
        type: 'improvement',
        scope: 'Instant Local Draft Persistence',
        description: 'Menyimpan draf halaman secara instan (0ms) ke localStorage sebelum debounce Redis agar zero-loss saat browser reload.'
      }
    ]
  },
  {
    version: 'v1.40.6',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '29 Oktober 2026',
    title: 'Atomic Multi-Page Deletion Safety Guard & Real-Time Synchronized Page Editing',
    summary: 'Perbaikan kritis pada mekanisme penghapusan halaman dan pengeditan multi-rute: (1) Atomic Deletion Safety Guard: Memperbaiki bug kritis di mana menghapus halaman anak (/about) saat sedang aktif malah menimpa halaman utama (Beranda). Fungsi syncActivePageBlocks kini diverifikasi secara ketat agar tidak pernah menimpa halaman lain ketika id halaman aktif tidak lagi terdaftar; (2) Safe Home Fallback: Menghapus halaman aktif kini langsung me-load blok halaman Beranda secara murni tanpa memicu sinkronisasi balik konten halaman yang telah dihapus; (3) Full In-Place Editing for /about: Seluruh rute sekunder (seperti /about, /pricing, dll) memiliki kapabilitas edit penuh WYSIWYG yang identik dengan Beranda (ganti teks, gambar, tambah seksi, atur style); (4) Real-Time Block Synchronization: Setiap perubahan blok pada halaman mana pun otomatis tersinkronisasi ke multiPages dataset secara instan sehingga pratinjau Alur Figma selalu 100% mutakhir; (5) Explicit Chrome URL Indicator: Window bar peramban kini menampilkan rute spesifik halaman aktif (misal: https://situs.stackbyte.id/about) serta badge nama halaman.',
    badge: 'Stable',
    author: 'Aether Core Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'CHG-4018',
        type: 'bugfix',
        scope: 'Multi-Page Deletion Overwrite Protection',
        description: 'Mencegah penimpaan konten halaman utama (Beranda) saat menghapus halaman anak yang sedang aktif dengan mengisolasi state sinkronisasi.'
      },
      {
        id: 'CHG-4019',
        type: 'improvement',
        scope: 'WYSIWYG Multi-Page Edit Workflow',
        description: 'Menyempurnakan alur pengeditan halaman /about dengan sinkronisasi reaktif ke Alur Figma dan indikator URL aktif di chrome bar.'
      }
    ]
  },
  {
    version: 'v1.40.5',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '29 Oktober 2026',
    title: 'Animated Dashed Connector Flow & Dynamic Flowing Signal Particle Engine',
    summary: 'Penyempurnaan visual garis konektor alur halaman pada mode Alur Figma: (1) Pure Animated Dashed Line: Mengganti gradien SVG defs yang rentan terhadap hash-routing (#editor) dengan garis putus-putus solid Royal Blue (#2563eb, dasharray 10px/7px) yang mengalir mulus tanpa henti ke arah halaman tujuan; (2) Dual-Layer Depth & Guide Track: Menambahkan jalur panduan halus (subtle gray track #cbd5e1) di bawah garis putus-putus agar struktur koneksi tetap tegas dan berestetika tinggi; (3) Dynamic Signal Particle: Menambahkan partikel pulsa cyan bercahaya (#38bdf8) yang meluncur dinamis di sepanjang kurva Bezier dari halaman asal ke halaman tujuan setiap 2.2 detik (Figma/Zapier/n8n style); (4) Standalone Chevron Arrowhead: Menggantikan marker-end SVG dengan poligon panah independen berpresisi tinggi yang 100% konsisten di seluruh peramban.',
    badge: 'Stable',
    author: 'Aether Core Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'CHG-4015',
        type: 'feature',
        scope: 'Animated Dashed Bezier Connector',
        description: 'Menerapkan animasi garis putus-putus mengalir (flowing dash animation) menghubungkan antar halaman pada diagram sitemap Alur Figma.'
      },
      {
        id: 'CHG-4016',
        type: 'feature',
        scope: 'Flowing Signal Pulse Particle',
        description: 'Menyematkan partikel pulsa bercahaya yang bergerak dinamis di sepanjang kurva alur untuk visualisasi rute interaktif.'
      },
      {
        id: 'CHG-4017',
        type: 'bugfix',
        scope: 'SVG Gradient Hash Route Incompatibility',
        description: 'Mengatasi hilangnya garis konektor akibat konflik url(#id) SVG gradient pada peramban dengan route hash.'
      }
    ]
  },
  {
    version: 'v1.40.4',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '29 Oktober 2026',
    title: 'Freeform 2D Canvas Panning Engine & Multi-Artboard Framing Architecture',
    summary: 'Restorasi kemampuan navigasi bebas (freeform 2D pan) dan framing kanvas pada mode Alur Figma dan Single Design: (1) Native Mac Trackpad 2D Smooth Pan: Mengintegrasikan deltaX dan deltaY secara simultan pada wheel handler sehingga gestur usap 2-jari di Mac trackpad dapat menggeser kanvas bebas ke segala arah (kiri, kanan, atas, bawah, maupun diagonal) tanpa lag; (2) Freeform Left-Click Drag Panning: Mengaktifkan drag langsung dengan klik-kiri mouse pada seluruh permukaan kanvas mode Alur Figma serta area kosong kanvas mode Single Design tanpa harus menekan tombol Spasi atau mengganti tool; (3) Drag Suppression on Card Clicks: Membedakan gestur drag/pan kanvas (>6px) dengan klik biasa sehingga saat menggeser kanvas melewati kartu artboard halaman, sistem tidak sengaja berpindah halaman atau membuka modal; (4) Ultra-Wide Multi-Artboard Framing & Fit: Mengoreksi kalkulasi sitemapCanvasWidth dan framing awal saat beralih ke mode Alur Figma sehingga seluruh halaman (termasuk Beranda yang sebelumnya terpotong di tepi kiri) tampil utuh dan terpusat dengan padding seimbang; (5) Dynamic Pan Limits (16.000px): Memperluas batasan pan horizontal secara dinamis agar pengguna leluasa menjelajahi diagram alur halaman tanpa batasan artifisial.',
    badge: 'Stable',
    author: 'Aether Core Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'CHG-4012',
        type: 'bugfix',
        scope: 'Mac Trackpad Horizontal deltaX & Free Pan',
        description: 'Memperbaiki wheel event handler agar merespon deltaX sehingga gestur swipe horizontal Mac trackpad dapat menggeser kanvas ke kiri dan kanan.'
      },
      {
        id: 'CHG-4013',
        type: 'feature',
        scope: 'Direct Left-Click Drag on Canvas',
        description: 'Memungkinkan pengguna menggeser kanvas secara bebas menggunakan klik-kiri mouse pada kanvas Alur Figma dan background dot-matrix.'
      },
      {
        id: 'CHG-4014',
        type: 'bugfix',
        scope: 'Multi-Artboard Auto-Center & Framing',
        description: 'Menyeimbangkan kalkulasi sitemapCanvasWidth agar halaman Beranda tidak lagi terpotong di tepi kiri layar saat membuka Alur Figma.'
      }
    ]
  },
  {
    version: 'v1.40.3',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '29 Oktober 2026',
    title: 'Top-Layer Smart Sticky HUD Toolbar with Real-Time Content Tracking & Scroll Pinning',
    summary: 'Penyempurnaan arsitektur toolbar visual menjadi Smart Sticky HUD pada layer teratas kanvas: (1) Top-Layer Stacking Context (Z-Index 9999999): Menempatkan toolbar HUD langsung pada kontainer kanvas terluar (.studio-viewport-area) agar tombol-tombol pada ujung kanan (seperti tombol Detail) tidak pernah terpotong atau tenggelam oleh pembatas overflow artboard; (2) In-Context Active Content Tracking: Menghitung posisi bounding rect secara dinamis sehingga toolbar melayang presisi 12px di atas section aktif saat berada dalam viewport; (3) Smart Sticky Top Pinning: Saat halaman di-scroll ke bawah dan batas atas konten tenggelam di luar layar, toolbar otomatis mengunci posisinya (stick) di bagian atas viewport dengan visual indikator cyan bercahaya dan tetap sejajar horizontal dengan konten hingga seluruh blok terlewati; (4) Reactive Geometry Synchronization: Memantau pergerakan pan kanvas, zoom, wheel, dan pembaruan blok secara reaktif dengan zero-lag koordinasi.',
    badge: 'Stable',
    author: 'Aether Core Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'CHG-4010',
        type: 'bugfix',
        scope: 'Toolbar Overflow Clipping & Top Layer Elevation',
        description: 'Mencegah tombol Detail dan aksi ujung kanan terpotong dengan menaikkan toolbar ke root viewport stacking context.'
      },
      {
        id: 'CHG-4011',
        type: 'feature',
        scope: 'Smart Sticky Scroll Pinning Engine',
        description: 'Menyematkan mekanisme sticky otomatis yang menahan toolbar di pucuk viewport saat bagian atas konten aktif ter-scroll ke luar pandangan.'
      }
    ]
  },
  {
    version: 'v1.40.2',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '29 Oktober 2026',
    title: 'Contextual In-Place Floating HUD Shelf & Canvas Outside / Escape Deactivation Handler',
    summary: 'Restorasi penempatan toolbar kontekstual agar menempel tepat di atas konten aktif serta implementasi pembatalan seleksi: (1) In-Place Block-Anchored Floating HUD: Memindahkan toolbar HUD dari posisi statis atas kanvas (top 14px viewport) menjadi menempel langsung di atas blok konten yang sedang aktif diklik (bottom: calc(100% + 14px)) sehingga selalu mengikuti pergerakan kanvas, scroll, dan fokus mata pengguna; (2) First-Block Chrome Clearance: Memberikan offset khusus (bottom: calc(100% + 46px)) pada blok urutan pertama agar toolbar tidak menutupi window chrome peramban; (3) Escape Keyboard Deactivation: Menekan tombol Esc pada keyboard seketika membatalkan status aktif blok (selectedBlockId = null) dan melepas fokus input teks; (4) Outside Canvas Click Deactivation: Mengklik area kanvas di luar artboard, background dot-matrix, rulers, maupun window bar otomatis menonaktifkan blok yang terpilih.',
    badge: 'Stable',
    author: 'Aether Core Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'CHG-4008',
        type: 'bugfix',
        scope: 'WYSIWYG Floating Shelf Placement',
        description: 'Menata ulang posisi toolbar HUD agar menempel persis di atas section/konten yang aktif alih-alih melayang statis di pucuk layar.'
      },
      {
        id: 'CHG-4009',
        type: 'improvement',
        scope: 'Canvas Outside Click & Escape Shortcut',
        description: 'Mendukung pembatalan seleksi blok secara instan saat menekan Esc atau mengklik area di luar konten artboard.'
      }
    ]
  },
  {
    version: 'v1.40.1',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '29 Oktober 2026',
    title: 'Figma Flow Canvas Layout Refinement, Zero-Overlap Spacing, Floating Frame Titles & Smooth Bezier Curves',
    summary: 'Penyempurnaan visual dan ergonomi kanvas Alur Figma (Sitemap Flow) pasca uji antarmuka: (1) Zero-Overlap Dynamic Artboard Spacing: Menetapkan algoritma kalkulasi jarak dinamis getPageCanvasX dengan ARTBOARD_GAP 360px sehingga kartu artboard halaman tidak lagi bertumpuk satu sama lain; (2) Smooth Forward Bezier S-Curve & Anchor Dots: Menata ulang rute SVG connector dengan kurva Bezier halus yang mengalir lurus ke depan dari sisi kanan Beranda ke sisi kiri halaman anak, dilengkapi titik jangkar sumber bercahaya (#38bdf8) dan badge rute terpusat sempurna; (3) Figma-Style Floating Frame Title Shelf: Memindahkan label halaman ke atas artboard dalam bentuk frame shelf bergaya Figma (# Beranda / [Aktif] [Edit Halaman]) sehingga menghilangkan benturan bar ganda dengan chrome jendela peramban; (4) Floating HUD Toolbar Context Isolation: Menyembunyikan toolbar floating shelf pengeditan blok saat berada di mode Alur Figma agar kanvas lapang dan bebas distraksi; (5) Smart Auto-Fit & Hover Hints: Auto-fit viewport adaptif khusus sitemap flow serta overlay petunjuk klik fokus yang halus tanpa tooltip native HTML mengganggu.',
    badge: 'Stable',
    author: 'Aether Core Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'CHG-4005',
        type: 'bugfix',
        scope: 'Visual Canvas Layout & Artboard Spacing',
        description: 'Memperbaiki tumpang tindih artboard dengan kalkulasi jarak dinamis 360px serta penataan ulang simpul Tambah Halaman sejajar kartu.'
      },
      {
        id: 'CHG-4006',
        type: 'improvement',
        scope: 'SVG Bezier Connectors & Flow Navigation',
        description: 'Memperbaiki arah lengkungan kurva Bezier agar selalu mengalir mulus ke kanan dan menempatkan route pill tepat di tengah celah.'
      },
      {
        id: 'CHG-4007',
        type: 'improvement',
        scope: 'Figma Floating Frame Header & HUD Visibility',
        description: 'Menyajikan title shelf ala Figma di atas artboard dan menyembunyikan HUD toolbar blok saat berpindah ke mode Alur Figma.'
      }
    ]
  },
  {
    version: 'v1.40.0',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '29 Oktober 2026',
    title: 'Conventional Multi-Page Architecture, Flagship Multi-Page Template & Figma-Style Sitemap Flow Canvas with Bezier Connectors',
    summary: 'Transformasi arsitektur website dari single-page menjadi model website konvensional multi-halaman tingkat enterprise dengan kanvas sitemap visual bergaya Figma: (1) Flagship Multi-Page Blueprint (tpl_corporate_multipage): Menghadirkan template korporat 4 halaman lengkap (Beranda /, Tentang Kami /about, Layanan /services, Kontak /contact) dengan susunan blok yang dirancang khusus dan navigasi terintegrasi; (2) Figma-Style Flow Canvas (Alur Figma): Mode kanvas sitemap visual multi-artboard di mana semua artboard halaman tersaji berdampingan secara horizontal dengan garis konektor kurva Bezier SVG bercahaya, panah alur, animasi alur dashed, serta route pill badge interaktif (➜ /about, ➜ /services, ➜ /contact) yang menghubungkan tautan navigasi ke halaman tujuan; (3) Interactive Page Switcher & Route Creator: Dropdown pemilih halaman di header untuk berpindah halaman secara instan serta modal "Tambah Halaman Baru" untuk membuat rute baru (misal: /pricing, /portfolio) dengan template layout otomatis; (4) Seamless In-Editor Navigation: Klik tautan navigasi di mode pratinjau kanvas seketika berpindah ke halaman rute yang bersangkutan; (5) Multi-Page HTML Compiler & RLS Persistence: Menambahkan compiler multi-halaman compileMultiPageSiteToHTML dan persistensi draf multiPages ke PostgreSQL RLS dan Redis.',
    badge: 'Stable',
    author: 'Aether Core Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'CHG-4001',
        type: 'feature',
        scope: 'Flagship Multi-Page Corporate Template (tpl_corporate_multipage)',
        description: 'Menambahkan template resmi multi-halaman dengan 4 rute independen (/, /about, /services, /contact) lengkap dengan blok konten terisolasi.'
      },
      {
        id: 'CHG-4002',
        type: 'feature',
        scope: 'Figma-Style Sitemap Flow Canvas & Bezier Connectors',
        description: 'Menghadirkan kanvas visual multi-artboard berdampingan dengan kurva Bezier SVG interaktif, animasi alur dashed, dan route pills navigasi.'
      },
      {
        id: 'CHG-4003',
        type: 'feature',
        scope: 'Top Bar Page Switcher & Route Creation Modal',
        description: 'Dropdown pemilihan rute aktif dengan counter rute dan modal interaktif pembuatan halaman rute baru.'
      },
      {
        id: 'CHG-4004',
        type: 'improvement',
        scope: 'Multi-Page Static Compiler & Traefik v3 HTTP/3 Sync',
        description: 'Mendukung kompilasi multi-halaman HTML mandiri serta sinkronisasi draf dan publikasi multi-tenant multi-rute.'
      }
    ]
  },
  {
    version: 'v1.39.3',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '29 Oktober 2026',
    title: 'Navbar Dynamic Links Manager, In-Canvas Controls, Sticky Toggle & Dedicated Floating HUD Tooling',
    summary: 'Penyempurnaan komprehensif blok Navbar pada Katalog Blok Website (Langkah 1 dari 18 blok): (1) Dedicated Navbar Floating HUD: Menghadirkan konteks tools "Navbar" di floating toolbar dengan preset gaya latar (Glassmorphism, Solid White, Bordered, Transparan), tombol toggle Sticky Position (Melayang) dengan indikator 📌, pengaturan perataan menu (Split vs Center), tombol siklus ikon lambang brand (◆, ▲, ●, ★, ❖, ✦), tombol cepat "+ Link", dan color picker aksen; (2) In-Canvas Interactive Editing: Menu navigasi sekarang 100% dinamis ter-render dari items, mendukung inline text edit pada klik tautan, tombol hapus tautan (×) pada hover, dan tombol cepat [+ Link] langsung di kanvas; (3) Detail Editor Modal Integration: Tab Konten kini memuat editor terstruktur untuk menu navigasi lengkap dengan input nama menu, target URL/anchor ID (#hero, #features, dll.), reorder up/down, duplikasi, dan hapus; serta tab Tata Letak yang menyediakan konfigurasi gaya latar, sticky, alignment, dan glyph brand; (4) Modal Live Preview Sync: Pratinjau langsung di dalam modal detail 100% sinkron merefleksikan perubahan tautan menu dan styling navbar.',
    badge: 'Stable',
    author: 'Aether Core Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'CHG-3931',
        type: 'feature',
        scope: 'Dedicated Navbar Floating HUD Shelf',
        description: 'Menyediakan konteks tools "Navbar" di floating HUD dengan kontrol gaya latar, toggle sticky 📌, perataan split/center, siklus glyph brand, dan tombol tambah tautan.'
      },
      {
        id: 'CHG-3932',
        type: 'improvement',
        scope: 'In-Canvas Dynamic Nav Links & Inline Editing',
        description: 'Tautan navigasi kanvas kini ter-render dinamis dari items, mendukung inline edit teks, tombol hapus tautan pada hover, dan penambahan tautan langsung di kanvas.'
      },
      {
        id: 'CHG-3933',
        type: 'feature',
        scope: 'Detail Modal Nav Menu & Anchor URL Editor',
        description: 'Mengintegrasikan editor tautan navigasi di modal detail dengan input nama menu dan target URL/anchor ID serta kontrol tata letak sticky dan brand symbol.'
      },
      {
        id: 'CHG-3934',
        type: 'improvement',
        scope: 'Modal Live Preview 1-to-1 Realtime Sync',
        description: 'Menyinkronkan preview navbar di dalam modal detail agar merespons perubahan nama tautan, URL, dan gaya secara seketika.'
      }
    ]
  },
  {
    version: 'v1.39.2',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '29 Oktober 2026',
    title: 'Offline Resilient Zero-Blank Startup, Fallback Container Anchor, & Safe Accent Binding',
    summary: 'Penyempurnaan arsitektur ketahanan frontend saat Docker atau backend Go offline/mati: (1) Permanent Fallback Container Anchor: Menjamin activeContainer tidak pernah bernilai undefined saat backend offline atau cache kosong, mencegah TypeError render template yang sebelumnya mengakibatkan layar putih polos (blank screen); (2) Safe Accent Color Binding: Memperbarui 50+ binding template activeContainer.accentColor menjadi computed siteAccentColor ber-fallback aman (#2563eb); (3) Offline Studio Health Indicator: Menambahkan detektor isBackendOffline dan badge amber "Studio: Mode Offline" pada header atas sehingga pengguna tetap dapat mendesain draf secara lokal tanpa error; (4) Resilient Local Hydration: Mencegah pembersihan total state kontainer saat cache dibersihkan sehingga startup studio selalu mulus 100%.',
    badge: 'Stable',
    author: 'Aether Core Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'CHG-3921',
        type: 'bugfix',
        scope: 'Zero-Blank Offline Startup Resilience',
        description: 'Menerapkan defaultFallbackContainer sehingga antarmuka visual studio tidak crash saat frontend dibuka sebelum Docker dinyalakan.'
      },
      {
        id: 'CHG-3922',
        type: 'bugfix',
        scope: 'Safe Computed Brand Accent Binding',
        description: 'Memperbaiki puluhan binding template yang sebelumnya mengakses activeContainer.accentColor secara unhandled menjadi siteAccentColor.'
      },
      {
        id: 'CHG-3923',
        type: 'feature',
        scope: 'Offline Mode Header Health Tag',
        description: 'Menampilkan status "Studio: Mode Offline" dengan pulsing amber dot saat koneksi Docker/Go backend terputus.'
      }
    ]
  },
  {
    version: 'v1.39.1',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '28 Oktober 2026',
    title: 'Carousel Photo Hover Overlay Boundary Encapsulation & Isolated In-Place Image Swap',
    summary: 'Perbaikan posisi dan isolasi batas overlay "Ganti Foto" pada komponen Carousel: (1) Photo Container Isolation: Menerapkan position: relative !important dan border-radius: 12px pada .carousel-slide-img-wrap sehingga efek blur dan overlay tombol [ ☁ Ganti Foto ] terkunci 100% tepat hanya di atas area foto (680x220px); (2) Uncluttered Text & Controls: Menghilangkan bug di mana overlay sebelumnya membesar menutupi seluruh kartu carousel, memastikan judul, deskripsi, tag badge, tombol panah navigasi, dan titik paginasi tetap jernih dan dapat dibaca/diakses; (3) Modal Rich Editor Sync: Menghubungkan tombol ganti foto interaktif serupa pada pratinjau slide di dalam modal editor detail.',
    badge: 'Stable',
    author: 'Aether Core Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'CHG-3911',
        type: 'bugfix',
        scope: 'Carousel Image Overlay Boundary Clamp',
        description: 'Memperbaiki batasan CSS absolut overlay hover agar terisolasi hanya pada kontainer foto slide dan tidak menutupi seluruh section kartu carousel.'
      },
      {
        id: 'CHG-3912',
        type: 'improvement',
        scope: 'Clean Carousel Typography & Navigation',
        description: 'Memastikan teks judul, deskripsi narasi, dan kontrol panah geser carousel tetap bebas gangguan visual saat kursor berada di luar gambar.'
      }
    ]
  },
  {
    version: 'v1.39.0',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '28 Oktober 2026',
    title: 'Live Publishing & Cloud Deployment Studio Suite & Bespoke Reset Draft Modal Dialog',
    summary: 'Penyempurnaan total menu fungsional "Terbitkan" (Rocket) dan "Reset Draf" (RotateCcw) pada bilah navigasi atas Visual Studio: (1) Live Publishing & Cloud Deployment Suite: Mengklik tombol "Terbitkan" kini menjalankan pipeline sinkronisasi realtime 3-tahap (Kompilasi layout HTML/Tailwind, persistensi PostgreSQL RLS, dan routing Traefik v3 HTTP/3 edge ingress) lengkap dengan indikator proses dan modal dialog hasil rilis resmi; (2) Bespoke Publish Success Modal: Menyediakan kartu URL terminal dengan SSL badge, one-click copy link, tombol kunjungi situs live ke tab baru, telemetri metrik komponen, serta iframe Sandbox Live Preview hasil kompilasi produksi yang interaktif (Desktop/Mobile switcher); (3) Bespoke Reset Draft Modal: Mengganti popup native window.confirm() dengan modal dialog studio berdesain elegan untuk konfirmasi pembatalan draf sebelum mengembalikan susunan blok ke blueprint awal kontainer.',
    badge: 'Stable',
    author: 'Aether Core Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'CHG-3901',
        type: 'feature',
        scope: 'Live Publishing Pipeline & Success Dialog',
        description: 'Menghubungkan tombol Terbitkan ke pipeline kompilasi template, penyimpanan database, dan menampilkan dialog hasil rilis lengkap dengan terminal URL link, tombol salin tautan, dan tombol kunjungi situs.'
      },
      {
        id: 'CHG-3902',
        type: 'feature',
        scope: 'Interactive Live Sandbox Iframe in Publish Modal',
        description: 'Menyediakan frame pratinjau live sandbox terisolasi di dalam modal terbit dengan dukungan pergantian viewport desktop dan mobile.'
      },
      {
        id: 'CHG-3903',
        type: 'improvement',
        scope: 'Bespoke Reset Draft Confirmation Modal',
        description: 'Menggantikan dialog konfirmasi browser native dengan modal dialog konfirmasi studio bertema amber warning untuk reset draf ke konfigurasi awal kontainer.'
      }
    ]
  },
  {
    version: 'v1.38.9',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '28 Oktober 2026',
    title: 'Pure Vibrant Color Swatches, Dedicated Label Pill Architecture, & Safe Hex Input Sanitization',
    summary: 'Penyempurnaan visual dan arsitektur palet warna pada bilah perkakas Floating HUD: (1) Pure Vibrant Color Swatches: Memisahkan label teks ("Bg", "Teks", "Ikon", "Warna") sepenuhnya ke luar lingkaran palet warna ke dalam wadah pill .shelf-color-tag berdampingan dengan dot warna murni .shelf-color-wrap, mengeliminasi masalah teks yang sebelumnya menutupi dan memotong tampilan warna asli; (2) Safe Hex Sanitizer: Menambahkan helper safeHexColor() untuk menyaring nilai warna non-hex seperti "transparent" sebelum masuk ke input HTML5 color native sehingga mencegah browser me-reset warna ke hitam pekat (#000000); (3) Checkerboard Pattern for Transparent: Menyediakan visual pola checkerboard kotak-kotak ala Photoshop/Figma untuk tombol sekunder atau elemen bertransparansi.',
    badge: 'Stable',
    author: 'Aether Core Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'CHG-3891',
        type: 'improvement',
        scope: 'Dedicated Shelf Color Pill & Tag Container',
        description: 'Merestrukturisasi elemen kontrol warna HUD menjadi .shelf-color-field yang memisahkan teks label (.shelf-color-tag) dari lingkaran dot warna (.shelf-color-wrap), menghasilkan visual swatch yang 100% bersih, cerah, dan akurat.'
      },
      {
        id: 'CHG-3892',
        type: 'bugfix',
        scope: 'Safe Hex Color Input Sanitizer',
        description: 'Mencegah input tipe color native browser me-reset nilai "transparent" ke hitam pekat #000000 dengan helper sanitasi otomatis.'
      },
      {
        id: 'CHG-3893',
        type: 'feature',
        scope: 'Transparent Checkerboard Swatch Indicator',
        description: 'Menampilkan pola checkerboard conic gradient untuk tombol berlatar transparan (outline/ghost) agar mudah dibedakan secara visual.'
      }
    ]
  },
  {
    version: 'v1.38.8',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '28 Oktober 2026',
    title: 'In-Place Direct Card Icon Picker, Carousel Hover Image Quick-Swap, & Card Context Studio Polish',
    summary: 'Penyempurnaan alur kerja pengeditan visual cepat langsung di kanvas: (1) Direct Card Icon Picker: Mengklik ikon pada kartu Bento/Features mana pun di kanvas kini membuka modal picker ikon Lucide secara langsung di tempat tanpa perlu membuka modal detail penuh, lengkap dengan indikator badge edit pensil saat terseleksi; (2) Carousel Hover Image Quick-Swap: Mengarahkan kursor (hover) ke foto slide carousel kini memunculkan badge overlay interaktif "Ganti Foto" yang langsung memicu upload gambar lokal komputer; (3) Floating HUD Context Synchronization: Memperkaya tab Kartu di toolbar dengan palet warna aksen/ikon kartu dan menghubungkan pemilihan gambar carousel langsung ke slide aktif.',
    badge: 'Stable',
    author: 'Aether Core Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'CHG-3881',
        type: 'feature',
        scope: 'Direct Canvas Card Icon Picker',
        description: 'Ikon kartu bento/fitur dapat langsung diganti di kanvas dengan modal pemilih ikon 30+ pilihan tanpa jeda atau pembukaan modal detail.'
      },
      {
        id: 'CHG-3882',
        type: 'feature',
        scope: 'Carousel Hover "Ganti Foto" Action',
        description: 'Menambahkan overlay gelap elegan dan tombol badge [Ganti Foto] pada gambar slide carousel saat di-hover untuk memudahkan penggantian foto secara fleksibel.'
      },
      {
        id: 'CHG-3883',
        type: 'improvement',
        scope: 'Card Accent / Icon Color in HUD',
        description: 'Menambahkan kontrol warna aksen ikon kartu di bilah alat melayang (Context: Kartu) untuk kustomisasi visual instan.'
      }
    ]
  },
  {
    version: 'v1.38.7',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '28 Oktober 2026',
    title: 'Dual-Color Button Customization (Background & Text Label) & Direct Button Styling Suite',
    summary: 'Penyempurnaan kustomisasi tombol komponen kanvas artboard: (1) Dual Color Pickers: Tab Tombol pada bilah perkakas floating HUD kini menyediakan kontrol warna ganda yang intuitif—Warna Latar Tombol (Bg) dan Warna Teks Tombol (Teks); (2) Dynamic Text Color Binding: Mengaktifkan properti buttonTextColor dan secondaryButtonTextColor ke seluruh elemen tombol kanvas (Navbar Action, Hero Primary Glow, Hero Secondary Clean, Pricing Tier Actions, CTA Big Button, Form Submit, dan Modal Dialog Primary/Secondary); (3) Auto Inversion & Contrast: Teks dan ikon anak panah/bintang secara otomatis menyesuaikan warna teks yang ditentukan pengguna tanpa tertimpa warna default CSS.',
    badge: 'Stable',
    author: 'Aether Core Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'CHG-3871',
        type: 'feature',
        scope: 'Button Text Color Picker in Floating HUD',
        description: 'Menambahkan palet pemilih warna teks tombol independen di bilah alat melayang (Context: BUTTON) berdampingan dengan pemilih warna background.'
      },
      {
        id: 'CHG-3872',
        type: 'improvement',
        scope: 'Full Canvas Button Text Color Binding',
        description: 'Menyelaraskan styling warna teks tombol ke 8 tipe tombol di kanvas artboard (Navbar, Hero Primary/Secondary, Pricing, CTA, Form, Modal).'
      }
    ]
  },
  {
    version: 'v1.38.6',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '28 Oktober 2026',
    title: 'Bespoke Font Family HUD Popover Dropdown, Live Typeface Previews & Complete Tooling Suite Polish',
    summary: 'Penyempurnaan estetika dan fungsionalitas seluruh bilah perkakas floating HUD: (1) Bespoke Font Family Popover: Menggantikan elemen <select> mentah pada tab Teks dengan custom popover dropdown kaca Deep Slate modern (.hud-font-popover-menu) lengkap dengan preview nama font menggunakan typeface aslinya dan badge kategori (sans, serif, display, mono); (2) Google Fonts Integration: Menghadirkan 8 koleksi Google Fonts resmi (Inter, Plus Jakarta Sans, Outfit, Poppins, Syne Avant-Garde, Playfair Display, Fira Code, Roboto) yang langsung teraplikasikan ke teks komponen artboard kanvas secara instan; (3) Anti-Clipping & Scroll Isolation: Memastikan dropdown font berada pada layer teratas (z-index 100000000), terlindungi dari event wheel kanvas (@wheel.stop), dan dapat digulir dengan sangat mulus.',
    badge: 'Stable',
    author: 'Aether Core Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'CHG-3861',
        type: 'feature',
        scope: 'Bespoke Font Popover Dropdown',
        description: 'Dropdown pemilihan font pada tab Teks HUD kini menggunakan antarmuka kustom popover dengan font preview langsung, badge kategori, dan centang aktif, bebas dari select HTML polos.'
      },
      {
        id: 'CHG-3862',
        type: 'improvement',
        scope: '8 Google Fonts Studio Suite',
        description: 'Mendukung keluarga font lengkap termasuk Syne Avant-Garde Display dan Fira Code dengan integrasi Google Fonts resmi.'
      },
      {
        id: 'CHG-3863',
        type: 'improvement',
        scope: 'Unified HUD Tools Interactivity',
        description: 'Seluruh tombol aksi teks (A-/A+, Bold, Rata Kiri/Tengah/Kanan, Warna Teks, Kapitalisasi AA) dan konteks lainnya terisolasi rapi dan responsif 100%.'
      }
    ]
  },
  {
    version: 'v1.38.5',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '28 Oktober 2026',
    title: 'Floating Popover Scroll Event Isolation & Canvas Wheel Hijack Prevention',
    summary: 'Perbaikan esensial pada isolasi event scroll roda mouse/trackpad: (1) Canvas Wheel Hijack Prevention: Menghentikan pembajakan event wheel kanvas (@wheel.stop) pada bilah alat melayang dan menu popover sehingga gerakan scroll mouse diarahkan 100% ke daftar menu dropdown secara alami dan tidak lagi menggeser kanvas artboard; (2) Overscroll Behavior Contain: Menerapkan overscroll-behavior: contain pada menu popover agar momentum scroll tidak bocor keluar ke kanvas induk saat mencapai batas atas atau bawah daftar; (3) Smooth Internal Popover Scrolling: Memastikan daftar panjang animasi (12 varian) dapat digulir dengan lancar dan responsif.',
    badge: 'Stable',
    author: 'Aether Core Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'CHG-3851',
        type: 'bugfix',
        scope: 'Dropdown Wheel Event Isolation',
        description: 'Menerapkan @wheel.stop pada .studio-viewport-floating-shelf dan .hud-popover-menu serta guard target di onCanvasWheel untuk mencegah scroll kanvas bergerak saat mouse berada di atas menu dropdown.'
      },
      {
        id: 'CHG-3852',
        type: 'improvement',
        scope: 'Overscroll Boundary Containment',
        description: 'Menambahkan properti overscroll-behavior: contain dan momentum scroll CSS sehingga guliran daftar item popover terisolasi penuh.'
      }
    ]
  },
  {
    version: 'v1.38.4',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '28 Oktober 2026',
    title: 'Studio Detail Bento Card Refactor, Custom Popover Dropdowns, & 12-Animation Motion Suite Parity',
    summary: 'Peningkatan menyeluruh antarmuka kanvas dan editor detail HeroCMS Studio: (1) Bento Card Modal Refactor: Mengelompokkan formulir modal detail ke dalam bento cards terstruktur (Identitas & Teks Utama, Deskripsi Kaya WYSIWYG, dan Sub-Item) dengan segmented control device switcher (Desktop, Tablet, Mobile) dan live browser mockup; (2) Bespoke Floating Popover Menus: Menggantikan dropdown bawaan OS pada bilah alat melayang dengan custom popover glassmorphic terkurasi yang anti-clipping (overflow: visible) dan dilengkapi panah chevron interaktif serta checkmark indikator; (3) 12-Animation Motion Suite Parity: Menyelaraskan seluruh varian animasi di floating HUD dengan modal detail (Fade In, Fade In Up, Slide Up, Slide In Left, Cinematic Blur Fade, Spring 3D Elastic, Zoom In Pop, Perspective Tilt 3D, Floating Infinite, Pulse Glow, Dynamic Bounce); (4) Instant Motion Replay: Menyediakan reactive key remounting sehingga animasi langsung terputar ulang di kanvas saat dipilih.',
    badge: 'Stable',
    author: 'Aether Core Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'CHG-3841',
        type: 'feature',
        scope: 'Bento Card Form Clustering',
        description: 'Input form tidak lagi telanjang dan monoton, melainkan terorganisir rapi dalam 3 Bento Card modular dengan visual header dan metadata tag.'
      },
      {
        id: 'CHG-3842',
        type: 'improvement',
        scope: 'Custom Floating Popover Dropdowns',
        description: 'Menggantikan elemen select OS dengan popover dropdown custom glassmorphic bertema Deep Slate dan z-index tinggi, menghilangkan masalah dropdown terpotong (clipping) akibat batas kontainer.'
      },
      {
        id: 'CHG-3843',
        type: 'feature',
        scope: 'Full 12-Animation Motion Suite & Replay',
        description: 'Menyediakan seluruh 12 varian animasi gerak lengkap pada floating toolbar dengan dukungan keyframe langsung dan trigger pemutaran animasi instan pada kanvas artboard.'
      },
      {
        id: 'CHG-3844',
        type: 'improvement',
        scope: 'Segmented Device Switcher & Browser Mockup',
        description: 'Kontrol pergantian viewport desktop/tablet/mobile menggunakan segmented pill control Linear/macOS style, serta titlebar pratinjau browser dengan SSL badge dan refresh trigger.'
      },
      {
        id: 'CHG-3845',
        type: 'improvement',
        scope: 'Realtime Sync Status & Footer Elevation',
        description: 'Footer modal dilengkapi indikator status sinkronisasi artboard dengan pulsating green dot dan tombol aksi bertema Deep Slate.'
      }
    ]
  },
  {
    version: 'v1.38.3',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '28 Oktober 2026',
    title: 'Smart In-Context Floating HUD Tracking, Proportional Zoom Scaling, & Top-Layer Anti-Clipping',
    summary: 'Penyempurnaan posisi bilah alat (Floating HUD) agar presisi berada tepat di atas konten section yang sedang dipilih (selected) sekaligus menjamin tidak pernah terpotong: (1) Dynamic In-Context Tracking: Bilah perkakas kini secara otomatis mengapung (float) persis 10px di atas garis batas section/konten yang sedang di-select dan bergeser secara sinkron saat kanvas di-pan atau di-scroll (1:1 lockstep tanpa jeda); (2) Proportional Zoom-Out Scaling: Saat kanvas di-zoom out (misal 68%, 50%), bilah alat otomatis mengecil secara proporsional sesuai skala kanvas (transform-origin: bottom center) sehingga tidak tampak over-scaled atau melebar melebihi kartu section; (3) Top-Level Layer Elevation (z-index 9999999): Bilah alat tetap dirender pada layer kanvas teratas (viewport overlay) sehingga 100% bebas dari batasan overflow:hidden milik section dan tidak terpotong batas artboard; (4) Viewport Boundary Clamping: Menerapkan batas aman (minTop 28px/14px) agar saat section berada di bagian teratas kanvas, toolbar tetap tertahan rapi di layar dan tidak lenyap ke luar viewport.',
    badge: 'Stable',
    author: 'Aether Core Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'CHG-3831',
        type: 'feature',
        scope: 'Smart In-Context Floating Position',
        description: 'Bilah perkakas melayang tepat di atas komponen atau section yang sedang aktif dipilih, tidak lagi terpaku statis di puncak viewport.'
      },
      {
        id: 'CHG-3832',
        type: 'feature',
        scope: 'Proportional Zoom-Out Scaling',
        description: 'Bilah perkakas otomatis mengecil proporsional mengikuti zoom kanvas (zoom out) dengan transform-origin bottom center, menjaga keharmonisan rasio visual.'
      },
      {
        id: 'CHG-3833',
        type: 'bugfix',
        scope: 'Top-Layer Anti-Clipping Elevation',
        description: 'Bilah perkakas berada di layer teratas di luar hierarki overflow kontainer sehingga tidak ada risiko kepotong oleh section atau kartu lain.'
      },
      {
        id: 'CHG-3834',
        type: 'improvement',
        scope: 'Viewport Boundary Clamping & Smooth Gliding',
        description: 'Toolbar bertransisi halus antar section saat berpindah pilihan dan otomatis mengunci pada batas atas layar saat kanvas di-scroll ke puncak.'
      }
    ]
  },
  {
    version: 'v1.38.2',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '27 Oktober 2026',
    title: 'Top-Layer Viewport Floating Shelf, Individual Button Styling, & Google Fonts Enterprise',
    summary: 'Penyempurnaan arsitektur bilah perkakas floating dan interaktivitas kanvas tingkat enterprise: (1) Top-Layer Viewport Floating Shelf: Memindahkan bilah perkakas sepenuhnya keluar dari wrapper konten kanvas ke layer viewport teratas (.studio-viewport-floating-shelf, z-index: 9999999). Bilah kini dapat melebar penuh (bisa penuh!), tidak pernah terpotong, tidak pernah tenggelam atau menabrak kartu kanvas, dan tetap melekat (stick 0ms delay) di bagian atas viewport saat kanvas digeser atau di-scroll; (2) Individual Button Styling: Memperbaiki pemilihan tombol sehingga kustomisasi bentuk sudut (radius), style (solid/outline/glow), dan warna berlaku secara independen pada tombol spesifik yang diklik (Primary, Secondary, atau paket kartu tertentu), tidak lagi tertimpa secara global ke seluruh tombol; (3) Google Fonts Enterprise & Font Switcher Fix: Mengimpor paket Google Fonts resmi (Inter, Plus Jakarta Sans, Outfit, Poppins, Playfair Display, Fira Code, Roboto, Syne) ke index.html dan memperbaiki selector font agar menerapkan string font-family CSS yang valid seketika.',
    badge: 'Stable',
    author: 'Aether Core Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'CHG-3821',
        type: 'feature',
        scope: 'Top-Layer Viewport Floating Shelf',
        description: 'Bilah perkakas berada di layer teratas di depan kanvas, tidak terpotong, bisa melebar penuh, dan menempel tanpa jeda lag.'
      },
      {
        id: 'CHG-3822',
        type: 'bugfix',
        scope: 'Individual Button Styling',
        description: 'Styling radius, style, dan warna tombol kini berlaku secara terisolasi hanya pada tombol yang diklik (primary, secondary, atau item kartu).'
      },
      {
        id: 'CHG-3823',
        type: 'bugfix',
        scope: 'Google Fonts Enterprise Integration',
        description: 'Memuat seluruh koleksi Google Fonts dan menghubungkan nilai font-family CSS asli pada dropdown HUD agar penggantian font langsung terlihat di kanvas.'
      }
    ]
  },
  {
    version: 'v1.38.1',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '27 Oktober 2026',
    title: 'Anti-Submerge In-Section HUD Positioning, Pruned Streamlined Toolbar, & Zero Spillover',
    summary: 'Perbaikan posisi bilah perkakas (Floating HUD) agar tidak tenggelam ("anti-tenggelam") dan tidak menabrak section lain: (1) In-Section Smart Float (top: 12px): Menempatkan bilah perkakas di dalam ruang padding atas (whitespace) milik section aktif itu sendiri (top: 12px), sehingga 100% bebas dari tabrakan atau menutupi kartu section di atasnya dan tidak lagi terselip di garis batas pembatas; (2) Special Navbar Placement: Khusus blok navbar yang ramping, toolbar secara otomatis diletakkan tepat di bawah bilah navigasi; (3) Streamlined Compact Controls & Zero Spillover: Menyederhanakan kontrol section menjadi ringkas (Align, Latar, Jarak, Pola, Anim) dengan lebar optimal (~650px) dan membungkus seluruh tombol di dalam container gelap tanpa ada tombol yang meluber atau terpotong tanpa latar belakang.',
    badge: 'Stable',
    author: 'Aether Core Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'CHG-3811',
        type: 'bugfix',
        scope: 'Anti-Submerge In-Section Positioning',
        description: 'Memindahkan posisi bilah perkakas ke top: 12px di dalam padding atas section aktif, mencegah tabrakan dengan kartu blok di atasnya.'
      },
      {
        id: 'CHG-3812',
        type: 'improvement',
        scope: 'Streamlined Toolbar & Anti-Spill Container',
        description: 'Merampingkan dropdown dan memastikan latar gelap bilah membungkus seluruh aksi dan tombol Detail tanpa terpotong.'
      }
    ]
  },
  {
    version: 'v1.38.0',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '27 Oktober 2026',
    title: 'In-Canvas WYSIWYG Direct Interactive Editing & Element HUD Synchronizer',
    summary: 'Penyempurnaan kemampuan pengeditan langsung di atas kanvas (WYSIWYG Inline & Direct Click Manipulation) tanpa wajib membuka modal Detail: (1) Direct In-Canvas Editing: Semua elemen kanvas—termasuk tulisan (judul, subjudul, badge), progress bar, gambar, kartu bento, tombol CTA, formulir, modal, navbar, carousel, dan footer—kini dapat diklik langsung di kanvas untuk diedit secara inline menggunakan contenteditable; (2) Context-Aware HUD Sync: Mengklik elemen otomatis mengaktifkan tab kontrol terkait di floating toolbar atas (misal: klik tombol membuka pengaturan radius dan warna tombol, klik progress bar membuka slider persen reaktif, klik gambar membuka modal ganti foto); (3) Preserved Detail Modal: Tombol [Detail] di toolbar tetap tersedia penuh untuk pengeditan komprehensif bila diinginkan pengguna.',
    badge: 'Stable',
    author: 'Aether Core Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'CHG-3801',
        type: 'feature',
        scope: 'In-Canvas Direct WYSIWYG Editing',
        description: 'Teks, tombol, gambar, progress bar, kartu, dan footer dapat diklik langsung dan diedit tanpa harus membuka modal detail.'
      },
      {
        id: 'CHG-3802',
        type: 'improvement',
        scope: 'Real-Time Element HUD Synchronization',
        description: 'Klik langsung pada elemen spesifik kanvas otomatis mengalihkan tab HUD floating toolbar ke konteks yang sesuai (teks, tombol, kartu, progressbar, gambar).'
      },
      {
        id: 'CHG-3803',
        type: 'feature',
        scope: 'Preserved Detail Modal Launcher',
        description: 'Tombol Detail tetap hadir di bilah perkakas untuk pengeditan visual menyeluruh dan konfigurasi tingkat lanjut.'
      }
    ]
  },
  {
    version: 'v1.37.0',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '27 Oktober 2026',
    title: 'Zero-Delay Block-Attached HUD, Isolated "Konten +" Drawer, & Focus Studio Canvas',
    summary: 'Penyempurnaan total UX interaksi editor visual: (1) Zero-Delay Block-Stuck HUD: Menempelkan bilah perkakas langsung pada elemen section aktif (inside selection-overlay-box) sehingga saat pengguna melakukan scroll kanvas, bilah bergerak sinkron secara instan 0ms delay tanpa lag animasi trailing ("ngikut berjarak") yang mengganggu; (2) Zero-Clipping & Anti-Outside: Menghapus batas overflow kanvas (overflow: visible !important) dan membatasi lebar maks toolbar (max-width: calc(100% - 20px)) agar tidak pernah terpotong dan tidak pernah keluar dari kanvas; (3) Isolated "Konten +" Drawer: Tombol [Konten +] kini khusus membuka dan menutup Katalog Blok Website (studio-left-dock) yang tersembunyi secara default, sementara menu sidebar dashboard utama tetap terisolasi 100% hidden demi kenyamanan fokus.',
    badge: 'Stable',
    author: 'Aether Core Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'CHG-3701',
        type: 'feature',
        scope: 'Zero-Delay Direct-Attached HUD',
        description: 'Bilah perkakas menempel langsung pada section aktif, bergerak serentak dengan scroll kanvas tanpa delay lag.'
      },
      {
        id: 'CHG-3702',
        type: 'improvement',
        scope: 'Dedicated "Konten +" Catalog Drawer',
        description: 'Tombol [Konten +] mengendalikan buka-tutup Katalog Blok Website di kiri, bukan membuka menu sidebar dashboard.'
      },
      {
        id: 'CHG-3703',
        type: 'bugfix',
        scope: 'Zero-Clipping & Anti-Outside Width',
        description: 'Mengaktifkan overflow: visible pada rendered surface dan membatasi lebar toolbar agar tidak keluar atau terpotong.'
      }
    ]
  },
  {
    version: 'v1.36.4',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '27 Oktober 2026',
    title: 'Viewport Unclipped Floating Island HUD Engine (Ngawang di Depan Kanvas, Zero Clipping & True Native 1:1 Scale)',
    summary: 'Restrukturisasi arsitektur bilah perkakas floating HUD langsung ke root viewport layer (.studio-viewport-area): (1) Viewport-Level Unclipped Floating Layer: Toolbar diletakkan melayang bebas ("ngawang") tepat di depan kanvas artboard dan di luar website-rendered-surface, membebaskan perkakas dari pemotongan overflow: hidden kanvas (Zero Clipping dari kiri, kanan, maupun atas); (2) True Native 1:1 Scale: Karena berada di luar wrapper transform kanvas, bilah perkakas beroperasi pada rasio pixel 1:1 native yang tajam dan proporsional di semua tingkat resolusi monitor dan level zoom; (3) Dynamic Boundary Clamping & Real-Time Section Tracking: Menghitung koordinat target secara reaktif mengikuti section yang sedang diedit dengan pembatasan margin aman layar dan transisi instan 60fps saat canvas panning/scrolling.',
    badge: 'Stable',
    author: 'Aether Core Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'CHG-3641',
        type: 'feature',
        scope: 'Viewport Floating HUD Architecture',
        description: 'Memindahkan bilah perkakas langsung ke container viewport utama di depan kanvas artboard, melenyapkan pemotongan batas overflow section.'
      },
      {
        id: 'CHG-3642',
        type: 'improvement',
        scope: 'True Native 1:1 UI Scaling',
        description: 'Memastikan ukuran tombol, chip, input teks, dan dropdown bilah perkakas selalu konsisten tajam dan tidak mengecil atau membesar saat kanvas di-zoom.'
      },
      {
        id: 'CHG-3643',
        type: 'bugfix',
        scope: 'Safe Edge Clamping & Pan Synchrony',
        description: 'Menerapkan dynamic boundary clamping agar bilah perkakas tidak pernah keluar dari tepi kiri/kanan viewport dengan tracking mulus saat scrolling dan panning.'
      }
    ]
  },
  {
    version: 'v1.36.3',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '27 Oktober 2026',
    title: 'Floating HUD Stacking Elevation (z-index 99999) & Canvas Zoom Counter-Scaling',
    summary: 'Penyempurnaan posisi melayang bilah perkakas (Floating Island HUD) di atas section aktif: (1) Absolute Stacking Elevation (z-index 99999): Menetapkan zIndex 99999 langsung pada inline style section yang dipilih, menjamin bilah perkakas selalu berada di layer paling depan dan 100% tidak pernah tertutupi atau membelakangi/tenggelam di balik kartu atau section di atasnya; (2) Zoom Counter-Scaling (1:1 Pixel Precision): Menerapkan kompensasi skala scale(calc(1 / var(--canvas-zoom))) pada toolbar melayang sehingga ukuran perkakas tetap konsisten 1:1 pixel tajam di semua level zoom dan resolusi monitor, tidak lagi membesar saat zoom in atau mengecil saat zoom out; (3) Auto-Flip Top Edge Clamping: Section teratas secara otomatis membalik posisi toolbar ke dalam (top: 14px) agar tidak terpotong tepi layar.',
    badge: 'Stable',
    author: 'Aether Core Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'CHG-3631',
        type: 'bugfix',
        scope: 'Inline Stacking Elevation (z-index 99999)',
        description: 'Memosisikan section aktif dan bilah melayang di layer mutlak z-index 99999 sehingga tidak pernah lagi tertimpa kartu section di atasnya.'
      },
      {
        id: 'CHG-3632',
        type: 'bugfix',
        scope: 'Zoom-Immune Counter-Scale Engine',
        description: 'Menerapkan kalkulasi inverse zoom scale(calc(1 / var(--canvas-zoom))) sehingga toolbar selalu tampil pada ukuran proporsional 1:1 di segala resolusi dan level zoom.'
      },
      {
        id: 'CHG-3633',
        type: 'improvement',
        scope: 'Smart Auto-Flip Viewport Clamping',
        description: 'Menjaga toolbar tetap nyaman dijangkau tepat di atas section, dan meluncur ke dalam pada section paling atas agar tidak keluar batas kanvas.'
      }
    ]
  },
  {
    version: 'v1.36.2',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '27 Oktober 2026',
    title: 'Absolute Stacking Elevation (z-index 9999) & Ultra-Compact HUD Geometry',
    summary: 'Penyempurnaan tuntas geometri dan kedalaman bilah alat melayang (HUD): (1) Stacking Context Inline Elevation: Menetapkan z-index 9999 langsung pada inline style section terpilih, overlay box, dan toolbar melayang, menjamin 100% tidak ada section lain yang dapat menutupi atau menenggelamkan bagian atas HUD; (2) Ultra-Compact HUD Architecture: Merestrukturisasi label menjadi format ringkas (Shadow: Off, Pola: Off, Divider: Off, Anim: Off) dan ikonik context chip (Section, Teks, Tombol, Kartu, Gambar), menghemat 220px lebar toolbar sehingga tidak lagi terpotong pada batas tepi layar kiri dan kanan.',
    badge: 'Stable',
    author: 'Aether Core Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'CHG-3621',
        type: 'bugfix',
        scope: 'Inline Stacking Context Elevation (z-index 9999)',
        description: 'Memindahkan z-index 9999 langsung ke inline style DOM section aktif agar tidak kalah spesifisitas dari section tetangga dengan shadow.'
      },
      {
        id: 'CHG-3622',
        type: 'improvement',
        scope: 'Ultra-Compact HUD Horizontal Geometry',
        description: 'Mengoptimalkan lebar komponen HUD (tinggi 25px, padding 6px, label ringkas) agar muat sempurna di dalam lebar kanvas tanpa terpotong di tepi.'
      }
    ]
  },
  {
    version: 'v1.36.1',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '27 Oktober 2026',
    title: 'Text Editing Delete Key Protection, Isolated Tool Animation & Floating HUD Stacking Fix',
    summary: 'Perbaikan stabilitas kanvas dan interaksi UI: (1) In-Context Text Safety Guard: Menambahkan proteksi cerdas pada tombol Backspace dan Delete saat pengguna sedang mengetik atau mengedit teks/heading di kanvas, sehingga menekan Backspace/Delete hanya menghapus huruf dan tidak lagi menghapus section kanvas; (2) Isolated Motion Viewport: Memisahkan layer animasi konten ke viewport independen sehingga Smart Floating HUD (tools) dan bounding box seleksi tetap diam stabil dan tidak ikut membal/bergoyang saat efek animasi diputar; (3) Anti-Submerged HUD Stacking: Menetapkan z-index 800+ pada section terpilih agar bilah alat melayang (HUD) selalu berada di atas semua section lain dan tidak tertelan oleh tombol section sebelumnya.',
    badge: 'Stable',
    author: 'Aether Core Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'CHG-3611',
        type: 'bugfix',
        scope: 'In-Context Text Editing Keydown Guard',
        description: 'Mencegah shortcut Delete/Backspace menghapus section kanvas saat kursor berada di elemen contenteditable teks atau form input.'
      },
      {
        id: 'CHG-3612',
        type: 'improvement',
        scope: 'Isolated Tool Motion Viewport',
        description: 'Memindahkan kelas animasi CSS anim-* dari wrapper utama ke viewport konten internal, menjaga bilah alat Floating HUD tetap stabil di tempat.'
      },
      {
        id: 'CHG-3613',
        type: 'bugfix',
        scope: 'HUD Stacking & Overflow Prevention',
        description: 'Menaikkan z-index section aktif ke layer 800+ dan memperpendek label dropdown sehingga toolbar tidak tenggelam di bawah section lain maupun terpotong ke samping.'
      }
    ]
  },
  {
    version: 'v1.36.0',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '27 Oktober 2026',
    title: 'Modern Motion & Animation Engine & Complete Elimination of Legacy Modal Form',
    summary: 'Pembaruan arsitektur interaksi kanvas: (1) Penghapusan total modal popup form legacy ("Studio Editor Konten & Desain") yang sebelumnya muncul saat double-click, dialihkan 100% ke pengalaman in-context direct editing Canva/Figma; (2) Next-Gen Animation Suite: Menambahkan efek animasi modern 2027 (Cinematic Blur Fade ala Apple, Spring 3D Elastic, Perspective Tilt 3D); (3) Smart Floating HUD Motion Bar: Selektor animasi, scrubber durasi/kecepatan (0.2s - 2.5s), dan tombol preview/replay instan langsung di toolbar melayang kanvas.',
    badge: 'Stable',
    author: 'Aether Core Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'CHG-3601',
        type: 'feature',
        scope: 'Next-Gen 2027 Motion Presets (Blur Fade, Spring 3D, Tilt 3D)',
        description: 'Menambahkan efek animasi masuk terkini dengan akselerasi halus: Cinematic Blur Fade, Spring 3D Elastic, dan Perspective Tilt 3D.'
      },
      {
        id: 'CHG-3602',
        type: 'feature',
        scope: 'In-Context Floating HUD Animation & Duration Controls',
        description: 'Menyediakan selektor animasi langsung di toolbar melayang Section lengkap dengan scrubber kecepatan dan tombol putar ulang (preview).'
      },
      {
        id: 'CHG-3603',
        type: 'improvement',
        scope: 'Eliminasi Modal Popup Form Legacy',
        description: 'Menonaktifkan modal form popup Studio Editor Konten & Desain yang menginterupsi alur kerja, memastikan 100% editing dilakukan langsung di atas kanvas.'
      }
    ]
  },
  {
    version: 'v1.35.0',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '27 Oktober 2026',
    title: 'Era 2027 Visual Suite: Infinite Logo Marquee, Section Shape Dividers, Ambient Micro-Patterns, Adaptive Bento Grid & Pricing Switcher',
    summary: 'Lompatan estetika dan fleksibilitas kanvas berorientasi standar desain modern 2027: (1) Infinite Running Logo Marquee: Komponen baru running ticker dengan animasi CSS mulus meluncur horizontal tanpa henti, mask gradient fade di tepi, dan pause saat kursor diarahkan; (2) Section Shape Dividers: Pilihan transisi antar-section berbentuk Gelombang Halus (Wave), Garis Miring Dinamis (Slant Tilt), dan Lengkungan Cembung (Curved Arch); (3) Ambient Background Micro-Patterns: Pilihan tekstur latar section berupa Ambient Dot Grid, Blueprint Matrix Grid, dan Soft Radial Aura Glow Mesh; (4) Adaptive Bento Grid Card Layout: Pengaturan jumlah kolom grid (2, 3, 4 kolom), orientasi kartu vertikal/horizontal (icon side by side), serta kustomisasi border radius kartu di Floating HUD; (5) Interactive Pricing Switcher: Saklar periode tagihan Bulanan vs Tahunan (-20% diskon) yang langsung mengalkulasi dan mengubah angka harga di kanvas secara real-time.',
    badge: 'Stable',
    author: 'Aether Core Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'CHG-3501',
        type: 'feature',
        scope: 'Infinite Logo Marquee Component (Trend 2027)',
        description: 'Menambahkan blok katalog baru "Infinite Logo Marquee" dengan running track otomatis meluncur tanpa henti, masking gradient pinggir ala Apple/Vercel, serta dukungan edit judul dan badge langsung.'
      },
      {
        id: 'CHG-3502',
        type: 'feature',
        scope: 'Section Shape Dividers (Wave, Tilt, Curve)',
        description: 'Menyediakan pemisah batas bawah section berbasis vektor SVG (Wave, Slant Tilt, Curved Arch) yang dapat dipilih langsung melalui Floating HUD Section.'
      },
      {
        id: 'CHG-3503',
        type: 'feature',
        scope: 'Ambient Background Patterns & Gradient Meshes',
        description: 'Menyediakan layer tekstur latar belakang section mencakup Dot Grid, Blueprint Grid, dan Ambient Radial Aura Glow yang dapat diatur via Floating HUD.'
      },
      {
        id: 'CHG-3504',
        type: 'feature',
        scope: 'Adaptive Bento Card Columns & Orientation Controls',
        description: 'Memperluas Floating HUD Card dengan kontrol fleksibel: pilihan 2/3/4 kolom grid, orientasi horizontal vs vertikal, serta kustomisasi sudut kartu (0px, 14px, 24px).'
      },
      {
        id: 'CHG-3505',
        type: 'feature',
        scope: 'Interactive Pricing Billing Switcher (Monthly vs Yearly -20%)',
        description: 'Menambahkan saklar interaktif Bulanan vs Tahunan pada blok Pricing yang mengalkulasi harga diskon 20% tahunan dan memperbarui visual kanvas secara seketika.'
      }
    ]
  },
  {
    version: 'v1.34.0',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '27 Oktober 2026',
    title: 'Precision Drag-and-Drop Insertion Engine & Direct On-Canvas Image Upload Architecture',
    summary: 'Penyempurnaan arsitektur kanvas interaktif dan penanganan media di Visual Studio: (1) Precision Drag-and-Drop Insertion: Menghilangkan anomali di mana elemen selalu jatuh di bagian paling bawah halaman. Sistem kini membaca koordinat kursor dan indeks target secara akurat (atas/bawah elemen) dengan drop event langsung di node blok; (2) Context-Aware Quick Add: Menambahkan komponen dari katalog langsung menyisipkannya tepat di bawah blok yang sedang aktif/dipilih, bukan di paling bawah; (3) Direct On-Canvas Image Upload: Interaksi upload gambar instan ala Canva/Figma dengan pill hover "Ganti Foto", dialog picker berkas native komputer, dan drag-and-drop file gambar langsung dari desktop ke kanvas; (4) Smart Floating HUD Image Context: Menambahkan mode Image Tools di Floating Island Toolbar dengan tombol Upload Cepat dan preset fotografi resolusi tinggi Unsplash (Cloud, Studio, Neural AI, Workspace).',
    badge: 'Stable',
    author: 'Aether Core Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'CHG-3401',
        type: 'bugfix',
        scope: 'Precision Drag-and-Drop Insertion & Reordering',
        description: 'Memperbaiki penanganan drop event pada .block-node-wrapper dan website-rendered-surface sehingga penempatan blok hasil drag-and-drop dari katalog atau pergeseran urutan kanvas tepat berada di indeks yang dituju pengguna, bukan jatuh ke indeks terbawah (pageBlocks.length).'
      },
      {
        id: 'CHG-3402',
        type: 'improvement',
        scope: 'Contextual In-Place Insertion from Catalog Modal',
        description: 'Blok yang dipilih dari katalog kini langsung disisipkan persis di bawah blok yang sedang aktif/dipilih di kanvas, memberikan alur desain yang cepat dan alami seperti Notion dan Webflow.'
      },
      {
        id: 'CHG-3403',
        type: 'feature',
        scope: 'Direct On-Canvas Image Upload & Draft Persistence',
        description: 'Menyediakan mekanisme penggantian gambar instan pada kanvas via tombol overlay "Ganti Foto", file picker terintegrasi, kompresi client-side hemat memori, auto-save draf seketika ke Redis dan localStorage, serta dukungan Drag & Drop file gambar langsung dari desktop.'
      },
      {
        id: 'CHG-3404',
        type: 'feature',
        scope: 'Smart Floating Island Image Context & Unsplash Presets',
        description: 'Menyediakan context mode "Gambar" di Floating Island HUD dengan tombol aksi upload cepat dan curated preset fotografi resolusi tinggi siap pakai.'
      }
    ]
  },
  {
    version: 'v1.33.0',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '27 Oktober 2026',
    title: 'Floating In-Context Smart Island HUD, 100% Immersive Full Canvas & Dynamic Tooling Architecture',
    summary: 'Evolusi radikal antarmuka Visual Studio HeroCMS ke paradigma ultra-modern dan futuristik: (1) 100% Immersive Full Canvas: Taskbar sidebar kiri disembunyikan secara default sehingga ruang desain menjadi lapang, bersih, dan bebas distraksi; (2) Floating In-Context Smart Island HUD: Toolbar pintar glassmorphic gelap melayang tepat di atas kotak seleksi elemen yang aktif (zero travel distance); (3) Dynamic Context-Aware Tooling: Toolbar secara otomatis mengubah perkakasnya sesuai elemen yang diklik — Tipografi & Font saat mengklik teks, Shape Radius & Style Glow saat mengklik tombol, Scrubber Slider 0-100% saat mengklik progress bar, serta Ganti Ikon & Card Style (Glass, Border, Glow) saat mengklik kartu; (4) Smart Viewport Auto-Flip: Meluncur ke bawah elemen secara otomatis saat mendekati tepi atas layar agar tidak terpotong header.',
    badge: 'Stable',
    author: 'Aether Core Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'c-02dash-13300-1',
        type: 'feature',
        scope: 'Floating In-Context Smart Island HUD',
        description: 'Dynamic Floating Toolbar: Toolbar melayang di atas elemen terpilih dengan glassmorphism blur, spring animation, dan auto-flip positioning.'
      },
      {
        id: 'c-02dash-13300-2',
        type: 'feature',
        scope: 'Context-Aware Dynamic Controls',
        description: 'Multi-Context Engine: Kontrol otomatis berganti antara Mode Teks (font, size A-/A+, bold, alignment, color, uppercase), Mode Tombol (radius 0-999px, variant solid/outline/glow, link popover), Mode Kartu (ganti ikon, card style glass/border/glow), dan Mode Progressbar (live scrubber 0-100%).'
      },
      {
        id: 'c-02dash-13300-3',
        type: 'feature',
        scope: '100% Immersive Full Canvas Experience',
        description: 'Distraction-Free Workspace: Sidebar kiri dan panel kanan tertutup secara default, dilengkapi tombol pill melayang di kanvas untuk membuka katalog blok kapan pun dibutuhkan.'
      },
      {
        id: 'c-02dash-13300-4',
        type: 'feature',
        scope: 'Live Interactive Progressbar Scrubber & Card Presets',
        description: 'In-Canvas Customization: Pengguna dapat menggeser persentase meteran secara live di floating HUD serta mengubah preset gaya kartu ke glassmorphism atau neon glow.'
      }
    ]
  },
  {
    version: 'v1.32.0',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '27 Oktober 2026',
    title: 'Canva-Style Visual Studio: Inline Direct Canvas Editing, Right Property Inspector, Button Design System & Native Drag-Drop',
    summary: 'Perombakan radikal pengalaman visual editor Studio menuju paradigma Canva/Figma Direct Manipulation: (1) Zero-Modal Inline Editing: Menggantikan modal form popup dengan kemampuan mengetik teks langsung pada kanvas (contenteditable) saat section aktif; (2) Contextual Right Property Inspector: Bilah properti sebelah kanan adaptif untuk mengatur tipografi, font weight, text-transform, alignment teks, warna section, aksen brand, padding, dan daftar kartu; (3) Full Button & CTA Design Controls: Pengaturan bentuk sudut tombol (Kotak 0px, Sedang 8px, Bulat 16px, Pill 999px), varian gaya (Solid, Outline, Glow ✨), label & URL tombol primer, serta aktivasi/tata kelola tombol sekunder dengan live rendering di kanvas; (4) Click-to-Change Quick Icon Picker: Mengklik ikon pada kartu kanvas memunculkan dialog pemilih visual untuk mengganti ikon seketika; (5) Native Drag & Drop: Drag kartu dari katalog sidebar langsung ke sela-sela kanvas dengan slot indikator pemandu.',
    badge: 'Stable',
    author: 'Aether Core Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'c-02dash-13200-1',
        type: 'feature',
        scope: 'Inline Direct Canvas Editing',
        description: 'Direct Text Typing: Teks headline, subjudul, badge, dan kartu dalam section terseleksi dapat langsung diklik dan diketik di kanvas tanpa terhalang modal popup.'
      },
      {
        id: 'c-02dash-13200-2',
        type: 'feature',
        scope: 'Contextual Right Property Inspector',
        description: 'Bilah Properti Kanan: Panel taskbar kanan Canva-style yang menyediakan kontrol perataan teks, font selector, background & text colors, padding slider, serta manajemen kartu.'
      },
      {
        id: 'c-02dash-13200-3',
        type: 'feature',
        scope: 'Button Design & CTA Navigation System',
        description: 'Kontrol Tombol Komprehensif: Pengaturan bentuk sudut tombol (Kotak, Sedang, Bulat, Pill), varian tampilan (Solid, Outline, Glow), label & URL link tombol utama, serta toggle saklar tombol sekunder dengan efek real-time di kanvas.'
      },
      {
        id: 'c-02dash-13200-4',
        type: 'feature',
        scope: 'Typography & Elevation Styling',
        description: 'Tipografi Lanjutan & Elevasi: Pengaturan font weight (400-900), text transform (Normal, Kapital Semua, Huruf Besar Depan), bayangan (sm, md, lg, glow), dan slider radius section.'
      },
      {
        id: 'c-02dash-13200-5',
        type: 'feature',
        scope: 'Click-to-Change Icon Picker Popover',
        description: 'Quick Icon Picker: Ikon pada kartu kanvas dapat diklik langsung untuk memilih ikon baru dari koleksi visual secara real-time.'
      },
      {
        id: 'c-02dash-13200-6',
        type: 'feature',
        scope: 'Visual Editor Drag & Drop Architecture',
        description: 'Native HTML5 Drag & Drop: Menambahkan draggable="true", event payload dragstart/dragend, dan slot indikator drop di sela-sela antar-blok kanvas.'
      }
    ]
  },
  {
    version: 'v1.31.1',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '26 Oktober 2026',
    title: 'Domain Correction to stackbyte.id & Provision Orchestrator Live Sync',
    summary: 'Penyelarasan domain resmi platform dan perbaikan routing: (1) Koreksi Typo Domain: Mengoreksi seluruh referensi domain dari stacbyte.id menjadi stackbyte.id (dengan huruf "k") di seluruh modul frontend dan backend, memastikan DNS publik Cloudflare & rute Traefik v3 tersinkronisasi sempurna; (2) Integrasi Orchestrator: Menghubungkan variabel ORCHESTRATOR_URL dan token secret internal pada kontainer Dashboard CMS agar provisioning kontainer tenant baru di Service 03 langsung dieksekusi secara real-time via Docker SDK.',
    badge: 'Stable',
    author: 'Aether Core Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'c-02dash-13110-1',
        type: 'bugfix',
        scope: 'Platform Domain Suffix Alignment',
        description: 'Koreksi Domain Resmi stackbyte.id: Mengubah default subdomain kontainer, input domain wizard, mockup browser preview, dan aturan CORS allowlist dari stacbyte.id menjadi stackbyte.id.'
      },
      {
        id: 'c-02dash-13110-2',
        type: 'bugfix',
        scope: 'Orchestrator RPC Client Communication',
        description: 'Sinkronisasi Komunikasi Orchestrator: Mengonfigurasi ORCHESTRATOR_URL=http://herocms_provision_orchestrator:8080 pada docker-compose untuk memastikan setiap aksi deploy, restart, stop, dan get stats terkirim langsung ke engine Service 03.'
      }
    ]
  },
  {
    version: 'v1.31.0',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '26 Oktober 2026',
    title: '100% Dynamic Engine: Zero-Static Data Architecture for Articles & Web Pages',
    summary: 'Transformasi penuh modul Artikel Editorial & Halaman Web menjadi 100% dinamis terisolasi per-tenant: (1) Zero Static Seeds: Menghapus seluruh array seed tiruan dan mock data statis (initialArticles, initialCmsPages, hardcoded Linux paragraphs), seluruh data dimulai dari kondisi bersih 0 data dan disimpan secara persisten di PostgreSQL; (2) Basis Data PostgreSQL & RLS: Menambahkan tabel pages dan memperluas content_items dengan kebijakan tenant_pages_isolation & tenant_content_isolation; (3) REST API CRUD Lengkap: Menyediakan endpoint Go BFF GET/POST/PUT/DELETE untuk /api/articles dan /api/pages yang terintegrasi dengan invalidasi cache Redis; (4) Dynamic Content Article Reader: Merender konten teks markdown dinamis asli yang ditulis pengguna alih-alih teks statis; (5) Empty State & UX Polishing: Menyediakan tampilan Zero-Data Empty State yang elegan dengan tombol aksi cepat, serta memperbarui label navigasi menjadi "Halaman Web (Pages)".',
    badge: 'Stable',
    author: 'Aether Core Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'c-02dash-13100-1',
        type: 'feature',
        scope: 'PostgreSQL Dynamic Storage & RLS Isolation',
        description: 'Tabel PostgreSQL pages & Ekstensi content_items Terisolasi RLS: Menambahkan skema tabel pages dengan relasi tenant_id dan site_id, serta memperluas tabel content_items (excerpt, tags, meta_title, meta_desc). Diberlakukan kebijakan Row-Level Security tenant_pages_isolation & tenant_content_isolation untuk isolasi data multi-tenant ketat.'
      },
      {
        id: 'c-02dash-13100-2',
        type: 'feature',
        scope: 'Go BFF REST API Endpoints',
        description: 'Full CRUD REST API Endpoints untuk Articles & CMS Pages: Mengimplementasikan handler, service, dan repositori Go Gin untuk GET/POST/PUT/DELETE pada /api/articles dan /api/pages. Setiap mutasi data memicu invalidasi cache Redis tenant:%s:menu:* dan menghangatkan kembali dataset bundle secara otomatis.'
      },
      {
        id: 'c-02dash-13100-3',
        type: 'improvement',
        scope: 'Editorial Reader Dynamic Rendering',
        description: 'Dynamic Content Markdown Article Reader: Mengganti paragraf statis hardcoded seputar kernel Linux pada Reader View dengan parser blok markdown dinamis (parsedArticleBlocks) yang merender judul h2/h3, code blocks dengan tombol salin, dan paragraf asli sesuai artikel yang ditulis pengguna.'
      },
      {
        id: 'c-02dash-13100-4',
        type: 'improvement',
        scope: 'Clean Zero-State & UI Renaming',
        description: 'Pembersihan Total Seed Statis & Empty State Interaktif: Mengosongkan initialArticles dan initialCmsPages, membersihkan legacy dummy seeds dari PostgreSQL dan cache browser, menyematkan Zero-Data Empty State yang elegan dengan tombol tambah instan pada tampilan Grid maupun Tabel, serta memperbarui nama tab menjadi "Halaman Web (Pages)".'
      }
    ]
  },
  {
    version: 'v1.30.2',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '26 Oktober 2026',
    title: '100% Visual Parity: Standalone Template HTML Compiler for Container Deployment',
    summary: 'Penyelarasan visual 100% antara Demo Live Katalog Template dan hasil deployment website di kontainer Nginx: (1) Standalone Template HTML Compiler: Mengembangkan templateHtmlCompiler.ts yang mengompilasi seluruh blok visual (Navbar dengan glyph monogram, Hero dengan terminal mockup Traefik v3, Kartu produk E-Commerce berharga Rupiah & checkout WhatsApp, Galeri showcase karya portofolio, Silabus kursus akordeon interaktif, Tier harga dengan toggle tagihan bulanan/tahunan, Call-to-Action, Footer, dan Floating Pod Badge status runtime) menjadi HTML mandiri beresolusi tinggi tanpa dependensi framework eksternal; (2) Integrasi End-to-End customHTML: Menghubungkan compiler HTML ke seluruh alur pembuatan kontainer (handleCreateContainer), adopsi blueprint dari katalog (applyTemplateToActiveContainer & deployContainerFromTemplate), serta publikasi Visual Editor (handlePublishChanges); (3) Sinkronisasi PostgreSQL & Storage Runtime: Menyimpan customHTML dan konfigurasi tema ke basis data PostgreSQL serta menyemainya langsung ke persistent storage container di Service 03 (public/index.html & public/index.html.live).',
    badge: 'Stable',
    author: 'Aether Core Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'c-02dash-13002-1',
        type: 'feature',
        scope: 'Visual Block HTML Compiler (templateHtmlCompiler.ts)',
        description: 'Menghadirkan compiler template yang menerjemahkan array VisualBlock[] menjadi standalone responsive HTML dengan CSS pixel-perfect identik dengan TemplateLiveRenderer.vue.'
      },
      {
        id: 'c-02dash-13002-2',
        type: 'bugfix',
        scope: 'Catalog & Editor Synchronization (useDashboardData.ts)',
        description: 'Menghubungkan compileTemplateToHTML pada createContainer, saveSiteDesign, dan handlePublishChanges agar container Nginx melayani konten yang 100% sama dengan pratinjau katalog.'
      },
      {
        id: 'c-02dash-13002-3',
        type: 'improvement',
        scope: 'BFF & Orchestrator Payload (handler.go, service.go, repository.go)',
        description: 'Mendukung field customHTML pada CreateContainerPayload dan SaveSiteDesign serta memperbarui kolom template_name dan category di PostgreSQL.'
      },
      {
        id: 'c-02dash-13002-4',
        type: 'bugfix',
        scope: 'Deployment Stepper Lifecycle (useDashboardData.ts & ContainersModule.vue)',
        description: 'Memperbaiki siklus animasi stepper provisioning otomatis agar tidak stuck di fase 4/4 Running: menambahkan penanda deployStep 5 (seluruh 4 centang hijau), transisi otomatis ke tampilan kartu normal setelah 2.2 detik, pembersihan deployPhase residu pada sinkronisasi Redis/cache, serta tombol Selesai untuk menutup banner stepper.'
      }
    ]
  },
  {
    version: 'v1.30.1',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '25 Oktober 2026',
    title: 'Instant Template Re-deploy Animation & Live Multi-Theme Container Web Re-seeding',
    summary: 'Penyempurnaan alur kerja katalog template saat memilih opsi \'Gunakan\' / \'Terapkan ke Situs Ini\': (1) Alur Re-deploy Kontainer Otomatis: Saat pengguna menerapkan blueprint dari katalog ke kontainer situs aktif, sistem langsung memicu re-deployment terstruktur dengan 4 fase animasi reaktif (1/4 Build & Blueprint Compilation -> 2/4 Docker Engine & Storage Update -> 3/4 Traefik Ingress Routing -> 4/4 Go Live Running) alih-alih hanya menyimpan draft lokal; (2) Re-seeding Web Storage Langsung ke Container: Menghubungkan SaveSiteDesign ke endpoint orchestrator POST /api/v1/containers/:id/template, sehingga file public/index.html kontainer Nginx langsung diperbarui seketika dengan konten tema baru (Toko Online, Portofolio, Blog, atau LMS Edukasi); (3) Sinkronisasi Visual Editor & Penerbitan Desain: Perubahan pada Visual Editor kini menyertakan metadata templateName dan category saat dipublikasikan, memastikan situs web live selalu identik dengan blueprint desain.',
    badge: 'Stable',
    author: 'Aether Core Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'c-02dash-13001-1',
        type: 'feature',
        scope: 'Template Application Flow (useDashboardData.ts)',
        description: 'Menerapkan siklus deployment 4 tahap saat menerapkan template ke kontainer aktif, lengkap dengan pembaruan status dan pesan progress.'
      },
      {
        id: 'c-02dash-13001-2',
        type: 'feature',
        scope: 'Orchestrator Template Application (service.go & client.go)',
        description: 'Menambahkan ApplyTemplate pada orchestrator client dan menghubungkan SaveSiteDesign agar menyemai ulang website kontainer runtime di Service 03.'
      }
    ]
  },
  {
    version: 'v1.30.0',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '25 Oktober 2026',
    title: 'Autonomous Multi-Theme Template Seeding & Instant Container Web Generation',
    summary: 'Pembaruan fungsional utama pembuatan situs dan provisioning kontainer mandiri: (1) Dynamic Multi-Theme Template Seeding: Setiap website baru yang dibuat—baik melalui modal \'+ Buat Website Baru\' maupun melalui \'Katalog Blueprint Template\'—secara otomatis menyemai dan menyajikan website lengkap sesuai kategori dan tema yang dipilih (Toko Online/Retail dengan keranjang WhatsApp & harga rupiah, Portofolio Teknis Engineer dengan avatar monogram & kartu proyek terdistribusi, Media Editorial & Blog dengan artikel mingguan & newsletter, atau Pusat Edukasi LMS dengan silabus kursus & review siswa); (2) Identitas & Aksen Brand Dinamis: Menyuntikkan nama website, slogan/headline kustom, bio intro, alamat subdomain, dan kode warna aksen brand (--primary) ke dalam template yang langsung dirender oleh Nginx di dalam kontainer Docker terisolasi; (3) Sinkronisasi End-to-End BFF ke Orchestrator: Menghubungkan parameter templateName, accentColor, dan bioIntro dari Vue 3 apiClient -> Go BFF handler -> Service 03 Provision Orchestrator -> persistent storage index.html; (4) Endpoint Pembaruan HTML Langsung: Menghadirkan endpoint PUT /containers/:id/html untuk sinkronisasi kode HTML langsung ke media publik kontainer runtime tanpa downtime.',
    badge: 'Stable',
    author: 'Aether Core Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'c-02dash-13000-1',
        type: 'feature',
        scope: 'Container Provisioning Pipeline (apiClient.ts & useDashboardData.ts)',
        description: 'Menyertakan atribut templateName, category, accentColor, role, dan bioIntro pada pembuatan kontainer dari dialog modal maupun katalog blueprint.'
      },
      {
        id: 'c-02dash-13000-2',
        type: 'feature',
        scope: 'Go BFF Handler & Orchestrator Client (handler.go & service.go)',
        description: 'Menerima payload template kustom di backend Go dan menyalurkannya secara aman ke Service 03 Provision Orchestrator dengan token autentikasi internal.'
      },
      {
        id: 'c-02dash-13000-3',
        type: 'feature',
        scope: 'Multi-Theme Web Generator (Service 03 generator.go & manager.go)',
        description: 'Menyediakan engine generator HTML untuk 4 ekosistem blueprint (Business, Portfolio, Blog, Education) dengan UI modern, responsif, dan zero-dependency.'
      }
    ]
  },
  {
    version: 'v1.29.10',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '25 Oktober 2026',
    title: 'Dynamic Traffic Momentum & Zero-Hit Baseline Sparkline Calculation',
    summary: 'Perbaikan bug anomali indikator pertumbuhan trafik pada kartu kontainer: (1) Dynamic Growth Calculation: Menggantikan persentase pertumbuhan statis (+24%) dengan komputasi momentum dinamis yang mengevaluasi hits riil (c.visitsThisWeek). Saat trafik bernilai 0 hits, sistem secara akurat menampilkan badge netral \'0%\' dengan icon minus, mencegah anomali visual \'0 hits tapi naik +24%\'; (2) Zero-Hit Baseline Sparkline: Saat kontainer belum memiliki kunjungan, grafik mini sparkline menyajikan garis baseline putus-putus netral (#cbd5e1) tanpa kurva naik palsu; (3) Sinkronisasi Modul Artikel & Analitik Pod: Penyelarasan badge pertumbuhan di modul Artikel dan Analitik Pod agar konsisten menampilkan 0% saat belum ada interaksi pembaca.',
    badge: 'Stable',
    author: 'Aether Core Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'c-02dash-12910-1',
        type: 'bugfix',
        scope: 'Traffic Growth & Sparkline Calculation (ContainersModule.vue)',
        description: 'Menerapkan getContainerTrafficGrowth dan getContainerTrafficSparkline dinamis untuk menyajikan persentase 0% dan baseline netral saat hits bernilai nol.'
      },
      {
        id: 'c-02dash-12910-2',
        type: 'bugfix',
        scope: 'Zero Growth Fallback Alignment (ContentArticlesModule.vue & PodDetailAnalyticsView.vue)',
        description: 'Menambahkan pemeriksaan kondisional pada badge pertumbuhan total pembaca artikel dan edge requests agar menampilkan 0% saat data kosong.'
      }
    ]
  },
  {
    version: 'v1.29.9',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '25 Oktober 2026',
    title: 'Seamless Enterprise Modal Dialog Architecture: Maintenance Mode & Destructive Pod Deletion UI/UX Refactor',
    summary: 'Refaktor arsitektur visual dan tata letak dialog modal HeroCMS Studio: (1) Eliminasi Double-Padding & Edge-to-Edge Canvas: Menghadirkan class universal .modal-dialog-seamless dengan header dan footer tepi-ke-tepi (#f8fafc canvas) yang menyatu alami tanpa efek kotak melayang di dalam kotak; (2) Refaktor Dialog Mode Pemeliharaan: Penyelarasan palet warna Amber (#b45309), status pill HTTP 503 dengan dot berdenyut halus, preset durasi ETA bertema amber hangat, dan textarea berfokus ring; (3) Refaktor Dialog Hapus Kontainer Runtime: Redesain target pod card dengan icon server elegan, badge spesifikasi & status sejajar horizontal, callout konsekuensi terstruktur dengan red bullet indicator, serta tombol destruktif bergradasi bahaya; (4) Aksesibilitas & Responsivitas: Peningkatan ARIA labeling, penutupan dialog via tombol ghost close, dan adaptasi fluid pada resolusi tablet hingga mobile.',
    badge: 'Stable',
    author: 'Aether Core Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'c-02dash-12909-1',
        type: 'improvement',
        scope: 'Seamless Modal Architecture (.modal-dialog-seamless)',
        description: 'Menghilangkan margin collapse dan padding ganda pada dialog modal, menghasilkan footer canvas slate edge-to-edge yang bersih dan profesional.'
      },
      {
        id: 'c-02dash-12909-2',
        type: 'improvement',
        scope: 'Maintenance Mode Modal Dialog (ContainersModule.vue)',
        description: 'Penyelarasan palet warna Amber 503, perbaikan field textarea dan input ETA, serta chip preset waktu pemeliharaan yang harmonis.'
      },
      {
        id: 'c-02dash-12909-3',
        type: 'improvement',
        scope: 'Pod Deletion Danger Zone Dialog (DashboardView.vue)',
        description: 'Penyelarasan badge spesifikasi dan status secara horizontal, perapihan daftar konsekuensi teknis dengan bullet indicator, dan tombol destruktif bergradasi bahaya.'
      }
    ]
  },
  {
    version: 'v1.29.8',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '25 Oktober 2026',
    title: 'Container Web Storage Bind Mounting, Bespoke HTTP 503 Maintenance Page & Seamless Zero-Downtime Go-Live Reversion',
    summary: 'Integrasi penuh Mode Pemeliharaan dengan Engine Kontainer Docker Service 03: (1) Dynamic Public Storage Web Mounting: Menghubungkan direktori public host kontainer langsung ke root web Nginx (/usr/share/nginx/html:ro), memungkinkan pergantian tampilan situs seketika tanpa downtime atau rebuild kontainer; (2) Bespoke HTTP 503 Maintenance Page: Menampilkan halaman pemeliharaan visual elegan bertema HeroCMS Enterprise lengkap dengan noindex meta tag, auto-refresh 60 detik, estimasi waktu penyelesaian (ETA), dan badge status Amber; (3) Sinkronisasi Service 02 ke Service 03: Menghubungkan API PUT /api/containers/:id/maintenance ke Service 03 dengan passing tenant_id dan subdomain akurat; (4) Pemulihan Instan Go-Live: Backup otomatis index.html.live yang dipulihkan seketika saat mode pemeliharaan dinonaktifkan.',
    badge: 'Stable',
    author: 'Aether Core Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'c-02dash-12908-1',
        type: 'feature',
        scope: 'Orchestrator Maintenance Mode RPC Client (orchestrator/client.go)',
        description: 'Menambahkan method SetMaintenance pada Service 02 Orchestrator Client dengan propagasi tenant_id dan subdomain terisolasi ke endpoint Service 03.'
      },
      {
        id: 'c-02dash-12908-2',
        type: 'improvement',
        scope: 'Subdomain Lookup & Metadata Propagation (service.go & repository.go)',
        description: 'Menerapkan GetSiteSubdomain untuk memetakan ID situs ke subdomain kontainer Docker secara presisi saat eksekusi toggle maintenance.'
      },
      {
        id: 'c-02dash-12908-3',
        type: 'feature',
        scope: 'Live Website Instant Restoration (storage/manager.go)',
        description: 'Mekanisme backup index.html.live dan atomic write untuk beralih antara live tenant website dan 503 maintenance page secara instan.'
      }
    ]
  },
  {
    version: 'v1.29.7',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '25 Oktober 2026',
    title: 'Maintenance Mode End-to-End Execution, PostgreSQL Persistence, Reactive State Refresh, & Instant Status Switch',
    summary: 'Penyempurnaan kapabilitas Mode Pemeliharaan (Maintenance Mode) end-to-end: (1) Eksekusi & Reaktivitas Instan: Menghubungkan toggleMaintenance secara asinkron dengan studioApi.toggleMaintenance, memperbarui status kontainer menjadi \'maintenance\' seketika serta memicu re-render reaktif instan di kartu grid, dense table, dan tab filter segmented; (2) Persistensi Basis Data PostgreSQL & Cache Invalidation: Memperbarui endpoint PUT /api/containers/:id/maintenance dan query GetSites untuk mengembalikan status maintenance beserta konfigurasi pesan dan estimasi waktu downtime (ETA); (3) Banner & Badge Indikator Amber: Kartu kontainer menampilkan strip peringatan interaktif dan badge status \'Maintenance\' dengan efek radar Amber saat mode pemeliharaan aktif, serta tombol toggle cepat untuk kembali Go-Live.',
    badge: 'Stable',
    author: 'Aether Core Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'c-02dash-12907-1',
        type: 'feature',
        scope: 'Instant Maintenance Mode Workflow & Reactivity (useDashboardData.ts)',
        description: 'Menerapkan eksekusi asinkron studioApi.toggleMaintenance dengan pembaruan reaktif langsung pada status kontainer dan penghitungan metrik tab filter.'
      },
      {
        id: 'c-02dash-12907-2',
        type: 'improvement',
        scope: 'PostgreSQL & Redis Maintenance Metadata Serialization (repository.go)',
        description: 'Menyertakan objek maintenanceConfig secara otomatis pada query GetSites saat status situs dalam pemeliharaan sehingga pesan dan ETA tetap tersimpan konsisten.'
      }
    ]
  },
  {
    version: 'v1.29.6',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '25 Oktober 2026',
    title: 'Fix Reactive Stepper Pipeline Multi-Stage Progression & In-Flight Instance Mutex',
    summary: 'Memperbaiki bug reaktivitas Vue 3 pada stepper alur deployment kontainer baru: (1) Reactive Proxy Instance Binding: Membungkus objek kontainer deployment baru dengan reactive() dan menerapkan helper mutasi setDeployProgress() yang memperbarui item di dalam array containers.value dan memicu trigger reaktivitas level atas sehingga seluruh tahapan (1/4 Build App -> 2/4 Start Docker Engine -> 3/4 Edge Traefik Ingress -> 4/4 Running Live -> 5/5 All Done) beranimasi lancar secara real-time tanpa stuck di tahap awal; (2) In-Flight Instance Object Identity: Mempertahankan referensi objek reaktif asli saat sinkronisasi latar belakang berjalan dengan Object.assign() alih-alih me-replace objek; (3) Status Done Stepper & Selebrasi Selesai: Menyempurnakan kondisi visual tahap 4 dengan spinner transisi hingga seluruh 4 lingkaran bercentang hijau (deployStep 5) dan pesan runtime aktif.',
    badge: 'Stable',
    author: 'Aether Core Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'c-02dash-12906-1',
        type: 'bugfix',
        scope: 'Vue 3 Reactive Proxy Stepper Pipeline (useDashboardData.ts)',
        description: 'Menerapkan reactive() dan setDeployProgress() untuk memastikan setiap transisi tahapan deployment memicu re-render template secara instan tanpa tertahan pada tahap 1.'
      },
      {
        id: 'c-02dash-12906-2',
        type: 'improvement',
        scope: '4-Stage Sequential Deployment Timing & Completion Celebration (ContainersModule.vue & useDashboardData.ts)',
        description: 'Menyempurnakan durasi transisi tiap tahap deployment dan menambahkan fase selebrasi seluruh centang hijau sebelum banner transisi tertutup.'
      },
      {
        id: 'c-02dash-12906-3',
        type: 'bugfix',
        scope: 'In-Flight Instance Retention via Object.assign (useDashboardData.ts)',
        description: 'Mempertahankan identitas instans objek reaktif yang sama di dalam containers.value saat syncWithBackend dipanggil di latar belakang.'
      }
    ]
  },
  {
    version: 'v1.29.5',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '25 Oktober 2026',
    title: 'Create Website Modal Responsive Architecture, Sticky Pinned Footer, 4-Stage Progressive Deployment Pipeline Stepper, & In-Flight State Preservation',
    summary: 'Peningkatan responsivitas modal pembuatan website dan visualisasi pipeline deployment kontainer otonom: (1) Modal Responsive Architecture & Pinned Sticky Footer: Mengubah layout modal dialog pembuatan website dari scroll monolitik menjadi flex-column dengan header dan footer pinned (sticky). Tombol "Deploy & Luncurkan Kontainer" selalu terlihat di layar laptop standar tanpa perlu scroll; body modal dipadatkan dan memiliki internal sleek scrollbar; (2) 4-Stage Progressive Deployment Pipeline Stepper: Menyempurnakan alur peluncuran kontainer di kartu antarmuka dengan stepper visual 4 tahap penuh: 1/4 Build App -> 2/4 Start Docker -> 3/4 Edge Traefik -> 4/4 Running dengan durasi animasi progresif dan deskripsi status cgroups v2/TLS ALPN; (3) In-Flight Provisioning State Preservation: Memastikan sinkronisasi latar belakang Redis/backend tidak menimpa atau menghilangkan kontainer yang sedang dalam status deployment aktif; (4) Pembersihan Filter Dummy: Menghapus pengecekan nama subdomain/nama user agar tidak menyaring atau menghapus kontainer riil yang dibuat oleh pengguna.',
    badge: 'Stable',
    author: 'Aether Core Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'c-02dash-12905-1',
        type: 'improvement',
        scope: 'Modal Layout & CSS Responsiveness (studio-master.css)',
        description: 'Merestrukturisasi .modal-dialog-create-site menjadi flex container dengan fixed header, internal scrollable body, dan sticky pinned footer untuk memastikan tombol deploy selalu terlihat di resolusi laptop tanpa scrolling.'
      },
      {
        id: 'c-02dash-12905-2',
        type: 'feature',
        scope: '4-Stage Sequential Deployment Pipeline Stepper (useDashboardData.ts & ContainersModule.vue)',
        description: 'Menerapkan transisi visual sekuensial 4 tahap (Build App -> Start Docker Engine -> Edge Traefik Ingress -> Running) dengan durasi transisi realistis dan pesan status teknis yang informatif.'
      },
      {
        id: 'c-02dash-12905-3',
        type: 'bugfix',
        scope: 'In-Flight Provisioning State Retention (useDashboardData.ts)',
        description: 'Memodifikasi syncWithBackend() agar mempertahankan kontainer yang sedang dalam fase deployment (deployPhase/deployStep) sehingga animasi progres tidak ter-reset prematurely saat sinkronisasi API selesai.'
      },
      {
        id: 'c-02dash-12905-4',
        type: 'improvement',
        scope: 'User Subdomain Whitelist Sanity (useDashboardData.ts)',
        description: 'Menghilangkan filter substring yang sebelumnya menyaring situs bernama rizal atau wedak sehingga seluruh website nyata yang dideploy pengguna tersimpan dan tertampil dengan sempurna.'
      }
    ]
  },
  {
    version: 'v1.29.4',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '25 Oktober 2026',
    title: 'Multi-Stage Progressive Reboot Lifecycle Logging, Live Terminal Stream Synchronization, & Container Restart Stepper',
    summary: 'Peningkatan menyeluruh transparansi dan feedback visual saat proses reboot / restart kontainer berlangsung: (1) Logging Siklus Reboot Multi-Tahap di Redis: Menambahkan pencatatan kronologis lengkap ke Redis (SIGTERM drainage, stop exit code, Docker process respawn, validasi sintaks Nginx, probe healthcheck, dan ingress Traefik verification) sehingga terminal tidak lagi hanya menampilkan 1 baris statis; (2) Progressive Terminal Stream & Auto-Scroll: Menampilkan umpan balik progresif 8-tahap secara visual di modal terminal dengan auto-scroll otomatis dan sinkronisasi log real-time dari Docker engine; (3) Stepper Animasi pada Kartu Kontainer: Tombol reboot di kartu kontainer kini mengaktifkan stepper fase transisi 2/3 dan 3/3 sebelum kembali ke status Running; (4) Emisi Lifecycle Event Kafka: Service 03 kini mempublikasikan event tenant.container.restarted ke broker Kafka/Redpanda saat kontainer di-reboot.',
    badge: 'Stable',
    author: 'Aether Core Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'c-02dash-12904-1',
        type: 'improvement',
        scope: 'Multi-Stage Reboot Log Lifecycle (service.go & redis.go)',
        description: 'Mencatat seluruh fase siklus reboot kontainer ke Redis list (SIGTERM, drainage, cgroups reset, Docker spawn, Nginx test, healthcheck, Traefik check) agar riwayat log runtime informatif dan transparan.'
      },
      {
        id: 'c-02dash-12904-2',
        type: 'feature',
        scope: 'Progressive Terminal Feedback & Auto-Scroll (DashboardView.vue)',
        description: 'Menerapkan animasi progres log bertahap di konsol terminal dengan auto-scroll dan sinkronisasi instan terhadap stdout/stderr Docker kontainer.'
      },
      {
        id: 'c-02dash-12904-3',
        type: 'improvement',
        scope: 'Card Reboot Stepper Progression (useDashboardData.ts)',
        description: 'Menghubungkan alur reboot kartu kontainer dengan stepper deployment beranimasi sehingga pengguna dapat melihat tahapan reboot secara real-time.'
      },
      {
        id: 'c-02dash-12904-4',
        type: 'improvement',
        scope: 'Kafka Event Publication (provisioner.go)',
        description: 'Memancarkan event tenant.container.restarted ke Kafka topic herocms.orchestrator.lifecycle saat kontainer berhasil di-restart.'
      }
    ]
  },
  {
    version: 'v1.29.3',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '25 Oktober 2026',
    title: 'End-to-End API Interoperability, Dual Cgroups v2 Field Normalization, Subdomain Suffix Stripping, & Redis Container Cascade Purge',
    summary: 'Peningkatan menyeluruh kehandalan dan integrasi API antar-service: (1) Normalisasi Dual Cgroups v2 JSON Fields: Sinkronisasi field name telemetri antara Service 03 (cpu_percentage/memory_usage_mb) dan Service 02 (cpu_percent/memory_mb) sehingga telemetri CPU & RAM dari Docker cgroups selalu ter-decode akurat dan tersimpan di Redis tanpa nilai 0; (2) Sanitasi Subdomain Fleksibel: Menangani input subdomain dengan atau tanpa domain suffix (.stacbyte.id, .cloudcms.app, .herocms.id) agar tidak memicu regex mismatch; (3) Redis Cascade Key Purge: Menghapus seluruh data telemetri dan stream log dari Redis secara otomatis saat kontainer dihancurkan (DeleteContainer); (4) Verifikasi Pentest Pass: Seluruh suite pengujian penetrasi keamanan (Service 02 & Service 03) terverifikasi 100% PASS.',
    badge: 'Stable',
    author: 'Aether Core Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'c-02dash-12903-1',
        type: 'improvement',
        scope: 'Cgroups Telemetry Field Normalization (client.go & provisioner.go)',
        description: 'Mendukung field ganda cpu_percent/cpu_percentage dan memory_mb/memory_usage_mb pada response Service 03 dan client Service 02 untuk memastikan nilai CPU & RAM real-time selalu sinkron dan akurat.'
      },
      {
        id: 'c-02dash-12903-2',
        type: 'improvement',
        scope: 'Flexible Subdomain Suffix Trimming (service.go)',
        description: 'Menambahkan sanitasi otomatis untuk memotong suffix domain seperti .stacbyte.id dari payload subdomain sebelum validasi regex, mencegah error format subdomain.'
      },
      {
        id: 'c-02dash-12903-3',
        type: 'feature',
        scope: 'Redis Cascade Purge on Container Destroy (service.go)',
        description: 'Membersihkan kunci Redis tenant:<id>:container:<site_id>:telemetry dan :logs secara instan saat kontainer dihapus agar tidak meninggalkan orphaned cache.'
      },
      {
        id: 'c-02dash-12903-4',
        type: 'security',
        scope: 'Automated Pentest Suite Verification (pentest/)',
        description: 'Menjalankan kembali suite pentest Service 02 dan Service 03 untuk memverifikasi proteksi RLS, Traefik injection prevention, dan auth rate limiting dengan status PASS.'
      }
    ]
  },
  {
    version: 'v1.29.2',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '25 Oktober 2026',
    title: 'Strict Redis Integration for Telemetry & Logs, Laser-Animated Deployment Stepper, & Persistent UUID Synchronization',
    summary: 'Peningkatan menyeluruh integritas data dan visualisasi interaktif: (1) Integrasi Penuh Redis & Zero Database Polling: Metrik CPU & RAM dan seluruh stream log kontainer kini disimpan dan dibaca secara eksklusif dari Redis (LRange/RPush capped 500 baris) tanpa membebani database PostgreSQL; (2) Sinkronisasi Persistent UUID: InsertSite kini mengembalikan real UUID dari PostgreSQL RETURNING id sehingga kontainer yang baru dibuat tidak pernah hilang saat halaman di-refresh; (3) Animasi Stepper Build & Deploy Spektakuler: Efek sinar laser dinamis (stepper-laser-beam), denyut pulsasi lingkaran fase aktif (step-circle-pulse), putaran spinner RotateCw pada langkah yang sedang berjalan, dan aliran gradasi garis antar-tahap (stepper-line-flow); (4) Penyesuaian Guard CSRF: Membebaskan rute mutasi API development dan Bearer token agar deploy lokal tidak pernah terblokir 403.',
    badge: 'Stable',
    author: 'Aether Core Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'c-02dash-12902-1',
        type: 'bugfix',
        scope: 'Persistent UUID & Refresh Retention (repository.go & service.go & useDashboardData.ts)',
        description: 'Menyelesaikan masalah kontainer hilang saat refresh dengan memastikan InsertSite mengembalikan UUID asli dari PostgreSQL RETURNING id dan memperbarui state client secara sinkron.'
      },
      {
        id: 'c-02dash-12902-2',
        type: 'feature',
        scope: 'Redis Log List & Telemetry Architecture (redis.go & service.go)',
        description: 'Menerapkan arsitektur Redis terpusat untuk logging container (PushContainerLog / GetContainerLogs) dan telemetri runtime tanpa pernah menulis metrik sementara ke tabel PostgreSQL.'
      },
      {
        id: 'c-02dash-12902-3',
        type: 'improvement',
        scope: 'Visual Stepper Laser Animations (studio-master.css & ContainersModule.vue)',
        description: 'Menambahkan efek animasi laser scanner, denyut pulsasi pada lingkaran step aktif, putaran spinner progress, dan aliran gradasi garis antar-tahap dari Build App hingga Running.'
      },
      {
        id: 'c-02dash-12902-4',
        type: 'bugfix',
        scope: 'Development CSRF Guard Bypass (middleware.go)',
        description: 'Membebaskan pemeriksaan CSRF double-cookie pada environment development dan request dengan token Bearer sehingga mutasi data kontainer tidak tertolak status 403.'
      }
    ]
  },
  {
    version: 'v1.29.1',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '25 Oktober 2026',
    title: 'Real-Time Container Telemetry Polling, Robust Subdomain Isolation, & Guaranteed Delete Lifecycle',
    summary: 'Penyempurnaan arsitektur container lifecycle dan telemetri sumber daya runtime: (1) Telemetri CPU & RAM Real-Time: Implementasi polling background 3.5 detik pada ContainersModule dan PodDetailAnalyticsView yang membaca data cgroups v2 aktual dari Docker daemon dengan perhitungan delta CPU kuantitatif; (2) Isolasi Penamaan Kontainer & Router Traefik: Penamaan kontainer dan router kini unik per subdomain/site (tenant_<cleanSub>_<version>) sehingga pembuatan website baru tidak pernah bertabrakan atau menimpa kontainer lain; (3) Siklus Penghapusan Terjamin: Pembebasan middleware CSRF untuk request token Bearer yang valid, penyelarasan SQL penghapusan PostgreSQL dengan relasi cascade, serta pencabutan rute Traefik otomatis dari tenants.yml saat kontainer dihapus; (4) Penyesuaian TTL cache Redis containers dari 30 menit menjadi 5 detik untuk sinkronisasi instan.',
    badge: 'Stable',
    author: 'Aether Core Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'c-02dash-12901-1',
        type: 'bugfix',
        scope: 'Containers Deletion & CSRF (middleware.go & repository.go & useDashboardData.ts)',
        description: 'Memperbaiki kegagalan hapus kontainer dengan mengizinkan autentikasi Bearer pada CSRF guard, memperluas query SQL DeleteSite dengan pencocokan UUID, subdomain, dan nama, serta memastikan rute Traefik dan kontainer Docker terhapus bersih.'
      },
      {
        id: 'c-02dash-12901-2',
        type: 'performance',
        scope: 'Real-Time Telemetry Polling (ContainersModule.vue & PodDetailAnalyticsView.vue)',
        description: 'Menambahkan loop pembaruan telemetri otomatis 3.5 detik untuk kontainer berstatus running, menyelaraskan nama field cpu_percentage dan memory_usage_mb, serta menghitung penggunaan RAM bersih tanpa cache buffer.'
      },
      {
        id: 'c-02dash-12901-3',
        type: 'bugfix',
        scope: 'Container Naming Collision & Orchestration (provisioner.go)',
        description: 'Memperbaiki konflik penamaan kontainer Docker dan router Traefik yang sebelumnya selalu memakai tenant ID menjadi unik per-site (tenant_<subdomain>_<version>) sehingga deploy multi-website berjalan 100% stabil.'
      },
      {
        id: 'c-02dash-12901-4',
        type: 'improvement',
        scope: 'Redis Cache Tuning & Sync (service.go & config.go)',
        description: 'Mengoptimalkan TTL cache daftar kontainer di Redis menjadi 5 detik dan menyelaraskan konfigurasi default REDIS_PASSWORD ke secret_redis_password agar terhubung ke kontainer Redis aktif.'
      }
    ]
  },
  {
    version: 'v1.29.0',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '25 Oktober 2026',
    title: 'Visual Deployment Stepper, Dynamic Container Resolution, & Comprehensive Docker Lifecycle Logs',
    summary: 'Peningkatan transparansi menyeluruh pada alur pembuatan dan deployment website/kontainer baru: (1) Penambahan Visual Deployment Stepper langsung pada kartu kontainer (1. Build App -> 2. Start Docker -> 3. Edge Traefik -> 4. Live Running) dengan indikator progress dan estimasi status realtime; (2) Integrasi tombol shortcut "Lihat Logs" langsung pada banner stepper kartu; (3) Resolusi identifier kontainer dinamis pada Service 03 Orchestrator yang otomatis mencocokkan ID, Name, SiteID, TenantID, dan Subdomain ke instance Docker riil; (4) Penyelarasan chronicle dan parser terminal log terintegrasi yang menyajikan jejak build image, penegakan cgroups v2, sandboxing non-root UID 10001, registrasi rute Traefik, healthcheck probe, hingga access logs stdout/stderr Nginx container.',
    badge: 'Stable',
    author: 'Aether Core Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'c-02dash-12900-1',
        type: 'feature',
        scope: 'Container Cards & Visual Stepper (ContainersModule.vue & studio-master.css)',
        description: 'Menambahkan banner stepper visual 4-tahap pada kartu kontainer baru yang memperlihatkan fase Build App, Start Docker, Edge Traefik, dan Running secara transparan dan dinamis.'
      },
      {
        id: 'c-02dash-12900-2',
        type: 'feature',
        scope: 'Orchestrator Container Target Resolution (internal/docker/provisioner.go)',
        description: 'Mengimplementasikan ResolveTargetContainer pada Provisioner untuk memetakan site ID, nama kontainer, tenant ID, atau subdomain ke Docker Container ID yang tepat.'
      },
      {
        id: 'c-02dash-12900-3',
        type: 'improvement',
        scope: 'Live Logs Chronicle & Parsing (internal/service/service.go & DashboardView.vue)',
        description: 'Mengintegrasikan chronicle build, cgroups v2, sandboxing UID 10001, rute Traefik, probe healthcheck, dan stream stdout/stderr Nginx riil ke dalam viewer developer terminal.'
      },
      {
        id: 'c-02dash-12900-4',
        type: 'improvement',
        scope: 'Deployment State Machine (useDashboardData.ts)',
        description: 'Menerapkan transisi status kontainer baru secara bertahap dari building (1/3), deploying (2/3), routing (3/3), hingga running (4/4) dengan feedback toast yang informatif.'
      }
    ]
  },
  {
    version: 'v1.28.1',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '25 Oktober 2026',
    title: 'Purge Dummy Static Seeds, Relational Query Joins, & Traefik Docker API 1.44 Negotiation',
    summary: 'Pembersihan total data dummy statis dan perbaikan komunikasi Docker API: (1) Konfigurasi DOCKER_API_VERSION=1.44 dan docker endpoint Traefik v3 untuk menyelesaikan error negosiasi API Docker daemon macOS; (2) Pembersihan seluruh data dummy SQL lama (situs rizal & wedak, domain rizalpratama.cloud, tiket, invoice, dan webhook dummy) dari database PostgreSQL dan in-memory fallback; (3) Refaktor query repository Go dengan LEFT JOIN ke tabel sites sehingga artikel dan custom domain secara dinamis menggunakan nama kontainer dan ID kontainer nyata; (4) Penyelarasan fallback UI frontend Vue 3 agar tidak menampilkan nama atau ID kontainer placeholder.',
    badge: 'Stable',
    author: 'Aether Core Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'c-02dash-12801-1',
        type: 'bugfix',
        scope: 'Traefik Edge Ingress (docker-compose.yml)',
        description: 'Menambahkan environment DOCKER_API_VERSION=1.44 dan endpoint docker unix:///var/run/docker.sock pada service traefik untuk mengatasi error client version 1.24 is too old pada Docker engine modern.'
      },
      {
        id: 'c-02dash-12801-2',
        type: 'bugfix',
        scope: 'Database & In-Memory Seeding (internal/repository/repository.go)',
        description: 'Menghapus seluruh query INSERT dummy sites, custom_domains, content_items, support_tickets, invoices, dan webhooks; menambahkan skrip pembersihan otomatis untuk rekaman dummy legacy.'
      },
      {
        id: 'c-02dash-12801-3',
        type: 'improvement',
        scope: 'Relational Query Joins (internal/repository/repository.go)',
        description: 'Memperbarui GetArticles dan GetDomains menggunakan LEFT JOIN sites s ON c.site_id = s.id untuk menyajikan nama situs dan ID kontainer asli dari database secara relasional.'
      },
      {
        id: 'c-02dash-12801-4',
        type: 'bugfix',
        scope: 'Frontend Reactive Fallbacks (useDashboardData.ts, VisualEditorModule, CustomDomainsModule, ContentArticlesModule)',
        description: 'Menghilangkan hardcoded fallback Portofolio Rizal Pratama dan hero_tenant_9942, menggantikannya dengan nilai reaktif nyata dari kontainer aktif.'
      }
    ]
  },
  {
    version: 'v1.28.0',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '25 Oktober 2026',
    title: 'Migrasi Ekosistem Domain Resmi ke stacbyte.id (Edge Subdomains, DNS CNAME, Previews & CORS)',
    summary: 'Memperbarui domain resmi platform dari cloudcms.app ke stacbyte.id secara menyeluruh pada backend Go dan frontend Vue 3: (1) Penyesuaian pembuatan kontainer baru dengan subdomain default .stacbyte.id; (2) Target panduan DNS CNAME resmi diarahkan ke edge.stacbyte.id; (3) Pembaruan seluruh URL preview mockup perangkat (Mobile, Tablet, Desktop) pada Katalog Blueprint dan Visual Editor Studio; (4) Penyelarasan CORS allowlist Go BFF serta webhook event simulator ke domain stacbyte.id dengan tetap mempertahankan backward compatibility.',
    badge: 'Stable',
    author: 'Aether Core Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'c-02dash-12800-1',
        type: 'feature',
        scope: 'Backend Subdomain Formatting & CORS Allowlist (repository.go, service.go, config.go, middleware.go)',
        description: 'Menetapkan stacbyte.id sebagai domain induk default untuk provisioning situs baru dan verifikasi slug, serta menambahkan *.stacbyte.id ke dalam aturan CORS allowlist Go BFF.'
      },
      {
        id: 'c-02dash-12800-2',
        type: 'improvement',
        scope: 'Frontend Edge Routing & CNAME Guidance (useDashboardData.ts & CustomDomainsModule.vue)',
        description: 'Menyelaraskan pembuatan subdomain kontainer ke ${subdomain}.stacbyte.id dan target CNAME resmi custom domain ke edge.stacbyte.id.'
      },
      {
        id: 'c-02dash-12800-3',
        type: 'improvement',
        scope: 'Blueprint Catalog & Live Simulator Device Mockups (TemplatesCatalogModule.vue & TemplateLiveRenderer.vue)',
        description: 'Mengubah display bar URL pada simulator Safari/Chrome iPhone & iPad ke https://<blueprint>.stacbyte.id serta payload webhook simulator.'
      }
    ]
  },
  {
    version: 'v1.27.0',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '25 Oktober 2026',
    title: 'Transisi Penuh 100% Real Data Lintas Seluruh Menu & Eliminasi Data Statis / Dummy',
    summary: 'Menghapus total seluruh fallback array dummy / statis (seeds) dan generator data sintetis di seluruh modul HeroCMS Studio: (1) Inisialisasi state reaktif dimulai dari array kosong murni (containers, articles, customDomains, mediaAssets, invoices, supportTickets, webhooks) yang dihidrasi langsung dari PostgreSQL 16, Redis 7, MinIO S3, dan Service 03 Orchestrator; (2) Eliminasi 100 log pengunjung palsu (Telkomsel/Indosat IPs) di pod-analytics.ts diganti dengan empty state autentik dan telemetri cgroups v2 real-time; (3) Refaktor total fleet-telemetry.ts untuk mengkalkulasi metrik SLA, HTTP status, dan top pages 100% dari kontainer dan artikel real di PostgreSQL, serta menghapus asal ancaman buatan; (4) Penambahan empty state interaktif pada Webhooks & API Keys module saat belum ada webhook terdaftar; (5) Purge otomatis cache lama browser yang menyimpan data mock.',
    badge: 'Stable',
    author: 'Aether Core Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'c-02dash-12700-1',
        type: 'feature',
        scope: 'Clean Reactive Hydration & Eliminasi Static Seeds (useDashboardData.ts)',
        description: 'Menghapus ketergantungan import array seed statis (initialContainers, initialArticles, initialInvoices, initialCustomDomains, dll). Semua state reaktif dimulai dari [] dan disinkronkan secara instan lewat endpoint GET /api/cache/warm yang mengagregasi 100% data real dari PostgreSQL dan Redis.'
      },
      {
        id: 'c-02dash-12700-2',
        type: 'improvement',
        scope: 'Real-Data Analytics & Zero Synthetic Generator (pod-analytics.ts & fleet-telemetry.ts)',
        description: 'Menghapus 250+ baris data sintetis (100 IP pengunjung Telkomsel buatan, fake threat countries, fake Kafka stream logs). Metrik pod dan global fleet sekarang 100% dihitung dari kontainer aktif, Redis hit counter (analytics:views), dan artikel riil di PostgreSQL.'
      },
      {
        id: 'c-02dash-12700-3',
        type: 'improvement',
        scope: 'Studio Empty State System untuk Webhooks & Pod Access Ledger',
        description: 'Menerapkan empty state elegan saat kontainer belum menerima kunjungan atau saat tenant belum mendaftarkan webhook/domain kustom, lengkap dengan panduan aktivasi URL dan tombol aksi langsung.'
      }
    ]
  },
  {
    version: 'v1.26.0',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '25 Oktober 2026',
    title: 'Integrasi Penuh Service 02 Dashboard Studio ke Service 03 Container Provision Orchestrator',
    summary: 'Mengintegrasikan ekosistem Dashboard CMS (Service 02) secara langsung dengan Container Provision Orchestrator (Service 03): (1) Implementasi Orchestrator Client internal dengan proteksi X-HeroCMS-Internal-Secret; (2) Integrasi alur provisi otomatis situs baru ke kontainer otonom, Traefik edge routing, dan alokasi storage; (3) Endpoint dan UI trigger untuk Start, Stop, Emergency Restart/Reboot, dan Penghapusan Pod beserta purge storage; (4) Telemetri live cgroups v2 (CPU CFS quota, memcg memory usage, network I/O, pids) dan streaming runtime console log langsung dari engine kontainer; (5) Perbaikan bug query SQL PostgreSQL 15-parameter pada InsertSite.',
    badge: 'Stable',
    author: 'Aether Core Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'c-02dash-12600-1',
        type: 'feature',
        scope: 'Client HTTP Internal Service 03 & Handlers Lifecycle Pod',
        description: 'Membangun internal package orchestrator.Client di Go backend Service 02 yang berkomunikasi aman dengan Service 03 via header X-HeroCMS-Internal-Secret untuk menjalankan DeployContainer, StartContainer, StopContainer, RestartContainer, DestroyContainer, GetStats, dan GetLogs.'
      },
      {
        id: 'c-02dash-12600-2',
        type: 'feature',
        scope: 'Telemetri Real-Time cgroups v2 & Terminal Streaming Log',
        description: 'Menghubungkan PodDetailAnalyticsView.vue dan modal terminal DashboardView.vue ke endpoint /api/containers/:id/stats dan /api/containers/:id/logs untuk menampilkan metrik penggunaan resource kernel Linux dan konsol log langsung dari kontainer yang aktif.'
      },
      {
        id: 'c-02dash-12600-3',
        type: 'bugfix',
        scope: 'Perbaikan Parameter SQL InsertSite PostgreSQL 16',
        description: 'Memperbaiki ketidaksesuaian jumlah parameter statement SQL (14 parameter yang sebelumnya menyebabkan error pq: got 14 parameters but statement requires 15) dengan menyertakan nilai status situs secara eksplisit.'
      }
    ]
  },
  {
    version: 'v1.25.1',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '25 Oktober 2026',
    title: 'Aksen Warna Halus Non-Neon per Produk Blueprint Template & Penyempurnaan Visual Card',
    summary: 'Menyematkan aksen warna halus non-neon (muted semantic palette) pada setiap kartu produk blueprint template dalam balutan tema monokrom studio: (1) Border aksen bawah panggung mockup selaras dengan warna khas blueprint; (2) Lencana domain kategori pastel lembut (.pill-portfolio, .pill-blog, .pill-education, .pill-business); (3) Mini canvas wireframe responsif (tag TTFB, SEO, PWA, badge kategori blog, meter progres edukasi, dan badge harga produk); (4) Lencana skor Lighthouse bernuansa warm amber dan tanda centang fitur selaras; (5) Thumbnail split-studio dengan border aksen dan rating terpadu.',
    badge: 'Stable',
    author: 'Aether Core Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'c-02dash-12501-1',
        type: 'improvement',
        scope: 'Aksen Warna Non-Neon Kartu Produk Template (.tpl-market-card-pro)',
        description: 'Menyematkan aksen warna halus non-neon pada kartu produk blueprint template (border stage sesuai accentColor produk, badge kategori pastel lembut, dan tanda centang fitur selaras) untuk mempermudah identifikasi tanpa merusak tema arsitektural hitam-putih studio.'
      },
      {
        id: 'c-02dash-12501-2',
        type: 'improvement',
        scope: 'Penyempurnaan Visual Mini Canvas & Split Studio Thumbnails',
        description: 'Menyelaraskan elemen mini canvas pada tiap produk (avatar badge, pills metrik TTFB/SEO/PWA, progress bar edukasi, dan CTA belanja UMKM) serta thumbnail split studio (.split-card-thumb) dengan aksen domain terpadu.'
      }
    ]
  },
  {
    version: 'v1.25.0',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '24 Oktober 2026',
    title: 'Refaktor Pusat Bantuan & Live Chat 1140px, Ikon Sidebar Berwarna & Animasi Cascade Konten Studio',
    summary: 'Merombak total modul Pusat Bantuan & Tiket Support serta menyempurnakan animasi antarmuka Dashboard Studio: (1) Pemilihan 4 Divisi Tujuan Pengaduan dengan deteksi otomatis identitas akun tanpa field urgensi; (2) Modal Live Chat 1140px berdesain model WhatsApp dalam tema HeroCMS Studio (bubble speech tail, indikator mengetik lawan bicara, Centang 1/2/Biru + jam/tanggal dibaca, upload gambar, emotikon, serta Unified Chat Input Capsule menyatu dengan kanvas); (3) Bespoke Custom Dropdown Popover & tabel riwayat tiket di bawah formulir; (4) Ikon menu sidebar berwarna semantik (.nav-icon-box) dengan animasi klik pegas (navSelectSpring) serta animasi transisi berjenjang (staggered card cascade) pada seluruh konten dan kartu di area kerja kanan.',
    badge: 'Stable',
    author: 'Aether Core Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'c-02dash-12500-1',
        type: 'feature',
        scope: 'Studio Buat Pengaduan 4 Divisi & Identitas Otomatis',
        description: 'Menyediakan 4 kartu pemilihan divisi tujuan bantuan, deteksi otomatis nama dan email akun dari sesi, pilihan kontainer terkait, serta penghapusan opsi tingkat urgensi.'
      },
      {
        id: 'c-02dash-12500-2',
        type: 'feature',
        scope: 'Modal Live Chat Model WhatsApp Tema Studio 1140px & Unified Input Capsule',
        description: 'Memperbesar ruang diskusi tiket menjadi workspace 2 kolom 1140px dengan model struktural WhatsApp berbalut tema HeroCMS Studio (#f8fafc dot-grid & Royal Blue #eff6ff/#e0f2fe), indikator mengetik lawan bicara, Centang 1/2/Biru beserta timestamp Dibaca, upload gambar, emotikon, dan kapsul input balasan yang menyatu langsung di dalam kanvas chat.'
      },
      {
        id: 'c-02dash-12500-3',
        type: 'improvement',
        scope: 'Custom Dropdown Popover & Tabel Riwayat Tiket di Bawah Formulir',
        description: 'Menghapus badge CS & DevOps Siaga 24/7, mengganti dropdown bawaan browser dengan Bespoke Studio Custom Dropdown Popover (Kategori Kendala, Situs/Kontainer Terdampak, dan Filter Divisi), serta menampilkan pengaduan dalam tabel enterprise di bawah formulir.'
      },
      {
        id: 'c-02dash-12500-4',
        type: 'feature',
        scope: 'Ikon Sidebar Berwarna Semantik & Animasi Cascade Konten Workspace',
        description: 'Menambahkan 12 badge ikon berwarna semantik (.nav-icon-box) pada navigasi sidebar kiri lengkap dengan animasi pegas saat menu dipilih (navSelectSpring & navIconPop), penguncian warna hitam aktif tanpa flicker hover, serta animasi masuk berjenjang (studio-workspace-stage & studioCardCascadeIn) untuk seluruh kartu, tabel, dan formulir di panel kanan.'
      },
      {
        id: 'c-02dash-12500-5',
        type: 'improvement',
        scope: 'Monochrome Hitam-Putih Brand Header, Kapasitas Kontainer & Profil User + Anti-Bounce Scroll',
        description: 'Merombak tampilan kartu judul Stack Studio di kiri atas, kartu Kapasitas Kontainer (tanpa chip CPU/RAM agar lega), serta kartu profil user PRO di kiri bawah dengan palet eksklusif Hitam & Putih (#09090b & #ffffff) tanpa efek neon, ditambah penguncian overscroll-behavior.'
      },
      {
        id: 'c-02dash-12500-6',
        type: 'improvement',
        scope: 'Grid 2 Kartu per Baris, Empty State Kontainer & Modal Buat Website 1160px',
        description: 'Menata ulang grid Situs & Kontainer menjadi 2 kartu per baris, menyempurnakan kartu Empty State ("Tidak ada kontainer ditemukan") beserta tombol Reset Pencarian & Filter, serta memperlebar modal Buat Website & Deploy Kontainer Baru ke 1160px dengan refaktor kartu form input Konfigurasi Identitas & Rute Subdomain.'
      },
      {
        id: 'c-02dash-12500-7',
        type: 'improvement',
        scope: 'Background Ikon Menu Aktif & Anti-Neon Monokrom Katalog Template',
        description: 'Menambahkan background semantik pastel pada ikon sidebar saat status aktif (.nav-link.active .nav-icon-box), serta membersihkan seluruh gradien neon warna-warni (AI Slop) pada Katalog Template & Blueprint Store beralih ke estetika arsitektural monokrom Hitam & Putih (#09090b & #ffffff).'
      }
    ]
  },
  {
    version: 'v1.24.3',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '24 Oktober 2026',
    title: 'Penyempurnaan Responsivitas Kartu Kontainer 1680x1050, Pembersihan Badge Header & Ribon E-Faktur',
    summary: 'Menerapkan perbaikan UI/UX pada modul Kontainer, Media Assets, Custom Domains, dan Faktur: (1) Menata ulang tombol toggle Grid/Table agar tidak kaku/blocky; (2) Memperbaiki responsivitas kartu kontainer pada resolusi 1680x1050 sehingga CPU dan RAM tidak enter atau patah baris; (3) Menghapus pill metrik Region dan S3 Bucket pada header Media Assets; (4) Menghapus pill Edge Engine Traefik dan SSL Auto ACME pada Custom Domains; (5) Menghapus pita header Kementerian Keuangan pada lembar modal E-Faktur.',
    badge: 'Stable',
    author: 'Aether Core Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'c-02dash-12430-1',
        type: 'improvement',
        scope: 'Responsivitas Kartu Kontainer & Switcher Grid/Table',
        description: 'Menyempurnakan styling view-mode-btn dengan padding auto fleksibel dan menyingkat label telemetri CPU & RAM agar pas tanpa enter pada resolusi desktop 1680x1050.'
      },
      {
        id: 'c-02dash-12430-2',
        type: 'improvement',
        scope: 'Pembersihan Metadata Header Media & Custom Domain',
        description: 'Menghapus pill Region dan S3 Bucket pada Media Assets serta badge Edge Engine Traefik dan SSL Auto ACME pada Custom Domains.'
      },
      {
        id: 'c-02dash-12430-3',
        type: 'improvement',
        scope: 'Penyederhanaan Lembar Dokumen E-Faktur',
        description: 'Menghilangkan pita instansi pemerintah Kementerian Keuangan dari bagian atas lembar modal pratinjau faktur pajak.'
      }
    ]
  },
  {
    version: 'v1.24.2',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '24 Oktober 2026',
    title: 'Mitigasi Kerentanan Keamanan Node.js CVE-2026-48930 (Upgrade Node.js 26.12.1 & Sinkronisasi Lockfile)',
    summary: 'Memperbarui runtime Node.js ke rilis keamanan terbaru v26.12.1 (node:26-alpine) untuk memitigasi CVE-2026-48930 (Improper Null Termination / Silent Authority Rebinding pada DNS/TLS Resolver Bindings), memperbaiki sinkronisasi package-lock.json pada Rollup 4.65.0, serta menyelaraskan pipeline GitHub Actions CI/CD ke Node.js 26.',
    badge: 'Stable',
    author: 'Aether Core Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'c-02dash-12420-1',
        type: 'security',
        scope: 'Mitigasi CVE-2026-48930 & Upgrade Toolchain Node.js 26',
        description: 'Memperbarui base image frontend-builder di Dockerfile ke node:26-alpine dan runtime pengembangan ke Node.js v26.12.1 (npm v11.20.0).'
      },
      {
        id: 'c-02dash-12420-2',
        type: 'bugfix',
        scope: 'Resolusi Konflik Dependency Lockfile Rollup & Babel',
        description: 'Menyinkronkan package-lock.json untuk mengatasi error ENOTEMPTY pada node_modules/rollup saat instalasi dependensi.'
      }
    ]
  },
  {
    version: 'v1.24.1',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '22 Oktober 2026',
    title: 'Standardisasi Toolchain Go 1.23 & Resolusi Kompatibilitas Multi-Architecture Docker Container Build',
    summary: 'Memperbaiki kompatibilitas kompilasi kontainer dan pipeline CI/CD: (1) Menyelaraskan persyaratan Go module ke go 1.23 pada backend BFF; (2) Memperbarui dependensi checksum via go mod tidy; (3) Memvalidasi kompatibilitas build kontainer Docker pada arsitektur linux/amd64 dan linux/arm64.',
    badge: 'Stable',
    author: 'Aether Core Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'c-02dash-12410-1',
        type: 'bugfix',
        scope: 'Go Module Toolchain Version Alignment',
        description: 'Menyelaraskan go.mod ke go 1.23 untuk kompatibilitas build Alpine Linux dan Docker container.'
      },
      {
        id: 'c-02dash-12410-2',
        type: 'improvement',
        scope: 'Checksum Dependensi Go & Build Integrity',
        description: 'Melakukan peremajaan go.sum dan go mod tidy untuk memastikan integritas pustaka Go backend.'
      }
    ]
  },
  {
    version: 'v1.24.0',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '22 Oktober 2026',
    title: 'Transformasi Rebranding Universal: Transisi Identitas Perusahaan ke Aether Core & Produk CMS ke Stack',
    summary: 'Melakukan transformasi jenama resmi (brand identity) pada antarmuka dan backend studio: (1) Menyelaraskan nama entitas induk perusahaan menjadi Aether Core; (2) Memperbarui penamaan resmi produk CMS menjadi Stack (Stack Studio by Aether Core); (3) Merevisi seluruh judul navigasi, breadcrumbs, splash screen loader, onboarding flow, modal otentikasi, modul artikel CMS, generator zone DNS, dan dokumentasi REST API SDK ke identitas baru Aether Core Stack.',
    badge: 'Stable',
    author: 'Aether Core Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'c-02dash-12400-1',
        type: 'feature',
        scope: 'Branding Identity Transisi ke Aether Core (Company) & Stack (CMS Product)',
        description: 'Memperbarui logo wordmark, badge, breadcrumbs, splash screen loader, dan console sidebar menjadi Stack Studio by Aether Core.'
      },
      {
        id: 'c-02dash-12400-2',
        type: 'improvement',
        scope: 'Penyelarasan Data Mock Seeds, Templates & Onboarding Tiers',
        description: 'Memperbarui nama paket langganan menjadi Stack Starter, Stack Pro, dan Stack Enterprise, serta menyelaraskan domain default aethercore.cloud pada seluruh simulasi kontainer.'
      },
      {
        id: 'c-02dash-12400-3',
        type: 'improvement',
        scope: 'Harmonisasi Dokumentasi REST API, SDK Snippets & Header Signature',
        description: 'Menyelaraskan contoh cURL, TypeScript, Go, dan Python SDK ke @aethercore/stack-sdk serta mengadopsi header keamanan webhook X-Stack-Signature.'
      }
    ]
  },
  {
    version: 'v1.23.0',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '20 Oktober 2026',
    title: 'Refaktor Autentik Modal Dokumen E-Faktur DJP 3.0 & Transformasi Grafik Kurva Area Spline Belanja Fiskal & Pajak PPN 11%',
    summary: 'Merombak total tampilan modal pratinjau lembar faktur pajak resmi (Lihat E-Faktur) dan grafik tren belanja fiskal menjadi standar enterprise kelas satu: (1) Merefaktor modal dokumen E-Faktur (.modal-dialog-invoice, lebar 960px) mengikuti standar e-Faktur 3.0 / PER-03/PJ/2022 DJP Kemenkeu RI lengkap dengan pita kepatuhan pemerintah, perbandingan 2 entitas PKP Penjual vs Pembeli BKP sejajar, tabel spesifikasi teknis BKP/JKP bernomor, kartu nilai terbilang rupiah otomatis, kalkulasi fiskal lengkap, stempel keabsahan hijau emerald, dan validasi digital hash QR Code dengan tanda tangan elektronik CFO PT Hero Digital Multitek; (2) Menggantikan grafik batang menjadi Grafik Kurva Garis & Area Spline Interaktif (Apache ECharts Area Spline Chart) dengan 3 garis kurva halus bergradasi (Total Tagihan Resmi, Dasar Pengenaan Pajak, dan PPN 11% Kas Negara) serta chip metrik telemetri ringkas di bagian atas.',
    badge: 'Stable',
    author: 'HeroCMS Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'c-02dash-12300-1',
        type: 'feature',
        scope: 'Authentic Indonesian E-Faktur 3.0 Document Paper Modal',
        description: 'Menyajikan lembar faktur pajak standar DJP PER-03/PJ/2022 berukuran 960px dengan pita inspeksi Kemenkeu, perbandingan profil PKP Penjual vs Pembeli BKP, format rupiah terbilang otomatis, dan stempel digital CFO.'
      },
      {
        id: 'c-02dash-12300-2',
        type: 'improvement',
        scope: 'Interactive ECharts Spline Curve Area Chart Visualization',
        description: 'Mentransformasikan grafik batang menjadi grafik garis kurva spline mulus bergradasi transparan untuk 3 metrik fiskal utama (Total Tagihan, DPP, dan PPN 11%) dengan crosshair pointer dan tooltip informatif.'
      },
      {
        id: 'c-02dash-12300-3',
        type: 'feature',
        scope: 'Quick Fiscal Telemetry Metric Chips',
        description: 'Menambahkan 3 indikator chip telemetri di atas grafik alokasi fiskal untuk memantau rata-rata belanja bulanan, akumulasi PPN yang disetor, dan status kepatuhan perpajakan.'
      }
    ]
  },
  {
    version: 'v1.22.0',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '20 Oktober 2026',
    title: 'Pelebaran Buku Besar Faktur (Spacious Ledger Table) & Visualisasi Tren Belanja SaaS & Pajak PPN 11% Berbasis Apache ECharts Interaktif',
    summary: 'Merombak tampilan buku besar faktur penagihan resmi (InvoicesHistoryModule) menjadi luas, berjarak nyaman, dan elegan sesuai standar tata kelola enterprise: (1) Menghilangkan kepadatan sempit pada tabel faktur dengan merancang container khusus .invoices-table-container (min-width: 1260px) serta alokasi lebar kolom individual yang proporsional (.col-inv-id, .col-inv-date, .col-inv-plan, .col-inv-method, .col-inv-price, .col-inv-status, .col-inv-actions) dengan padding mewah 18px 20px sehingga rincian DPP/PPN 11% dan status kliring tampil lapang tanpa dempet; (2) Mengintegrasikan pustaka visualisasi data Apache ECharts ke dalam tab Rekapitulasi Pajak PPN 11% menggantikan grafik batang CSS statis dengan grafik batang bertumpuk (Stacked Bar DPP vs PPN 11%) dan garis tren total penagihan resmi, dilengkapi tooltip interaktif glassmorphic bercahaya, penanganan resize dinamis via ResizeObserver, dan transisi tab reaktif.',
    badge: 'Stable',
    author: 'HeroCMS Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'c-02dash-12200-1',
        type: 'improvement',
        scope: 'Invoices Ledger Table Spacious Layout & Sizing',
        description: 'Menerapkan lebar tabel minimal 1260px dengan padding sel luas (18px 20px) dan penetapan lebar terdedikasi pada seluruh 7 kolom dokumen resmi, menghilangkan efek sempit/dempet antar konten penagihan.'
      },
      {
        id: 'c-02dash-12200-2',
        type: 'feature',
        scope: 'Interactive Apache ECharts Fiscal Spending & VAT Visualizer',
        description: 'Menyematkan mesin rendering Apache ECharts canvas beresolusi tinggi pada grafik tren fiskal bulanan (Dasar Pengenaan Pajak vs PPN 11% Kas Negara) dengan tooltip informatif berformat rupiah (IDR).'
      },
      {
        id: 'c-02dash-12200-3',
        type: 'performance',
        scope: 'Reactive Tab Lifecycle & Memory Leak Prevention',
        description: 'Mengelola instansiasi ECharts secara reaktif menggunakan watch(activeTab) dan nextTick(), serta menjamin pelepasan memori (dispose & disconnect ResizeObserver) pada siklus unmount.'
      }
    ]
  },
  {
    version: 'v1.21.0',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '20 Oktober 2026',
    title: 'Refaktor Komprehensif Modul Faktur & E-Faktur: Filter Multi-Kanal, Visualisasi Alokasi Fiskal Bulanan & Pratinjau KOP Pajak Live',
    summary: 'Merombak arsitektur modul Faktur & Riwayat Tagihan Resmi (InvoicesHistoryModule) menjadi sistem penagihan enterprise interaktif: (1) Bilah filter pencarian mutakhir dengan selektor kanal pembayaran spesifik (BCA VA, QRIS, Visa Corporate, Mandiri Bill) dan tombol salin instan nomor faktur satu-klik; (2) Tab Rekapitulasi Pajak PPN 11% dilengkapi grafik batang visualisasi alokasi fiskal bulanan (DPP vs PPN 11%) serta kode verifikasi NTPN resmi; (3) Tab Profil Wajib Pajak 2 kolom terpadu yang menampilkan formulir identitas perpajakan badan usaha berdampingan dengan Pratinjau KOP Dokumen E-Faktur sinkronisasi langsung (Live Sync KOP Preview); (4) Penyempurnaan lembar dokumen kertas E-Faktur digital berstempel lunas dan stempel QR Code validasi DJP.',
    badge: 'Stable',
    author: 'HeroCMS Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'c-02dash-12100-1',
        type: 'feature',
        scope: 'Multi-Channel Payment Filter & Instant Invoice Copy Tool',
        description: 'Menyediakan filter dropdown kanal pembayaran spesifik pada buku besar faktur serta tombol salin nomor faktur langsung ke clipboard dengan indikator status reaktif.'
      },
      {
        id: 'c-02dash-12100-2',
        type: 'feature',
        scope: 'Monthly Fiscal Spending & Tax Stacked Bar Visualizer',
        description: 'Menyematkan visualisasi grafik batang komparasi pengeluaran bulanan (Dasar Pengenaan Pajak vs PPN 11%) disertai kode NTPN per transaksi pada tabel rekonsiliasi.'
      },
      {
        id: 'c-02dash-12100-3',
        type: 'feature',
        scope: 'Interactive 2-Column Tax Profile with Live E-Faktur KOP Preview',
        description: 'Menyajikan tata letak 2 kolom pada pengaturan wajib pajak: formulir konfigurasi di sisi kiri dan pratinjau KOP surat faktur pajak digital di sisi kanan yang merespons perubahan data secara instan.'
      }
    ]
  },
  {
    version: 'v1.20.1',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '20 Oktober 2026',
    title: 'Pemisahan Hierarki Tagline Kartu Paket (Zero-Overlap) & Integrasi Checkout Pembayaran Langsung Kalkulator Simulasi Cluster',
    summary: 'Memperbaiki tata letak kartu paket aktif berjalan (.plan-crown-card) dengan memisahkan teks deskripsi tagline ke dalam baris penuh mandiri (.crown-full-tagline) di bawah bar judul dan harga (.crown-top-bar), secara mutlak mengeliminasi masalah tombol "Ganti / Upgrade Paket" yang menimpa paragraf deskripsi di semua resolusi. Menambahkan kapabilitas Checkout & Pembayaran Langsung pada Kalkulator Simulasi Resource Cluster Kustom (Tab 3) sehingga pengguna dapat langsung membayar estimasi spesifikasi kustom via 4 kanal pembayaran resmi (BCA VA, QRIS, Visa, Mandiri Bill), mengaktifkan kuota kluster seketika, dan otomatis menerbitkan E-Faktur resmi PMK-60.',
    badge: 'Stable',
    author: 'HeroCMS Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'c-02dash-12010-1',
        type: 'bugfix',
        scope: 'Plan Crown Card Layout Strict Tier Separation',
        description: 'Meredesain struktur kartu paket utama menggunakan .crown-top-bar (khusus judul dan harga/tombol) serta baris penuh .crown-full-tagline terpisah di bawahnya, mencegah teks deskripsi bertumpuk atau melenceng di bawah tombol aksi.'
      },
      {
        id: 'c-02dash-12010-2',
        type: 'feature',
        scope: 'Custom Cluster Simulation Checkout & Instant Payment',
        description: 'Menyediakan tombol "Bayar & Aktifkan Cluster Sekarang" pada Kalkulator Simulasi Resource Kustom yang langsung membuka modal checkout, menghitung DPP + PPN 11%, memperbarui kuota paket, dan menerbitkan E-Faktur resmi berstempel DJP.'
      }
    ]
  },
  {
    version: 'v1.20.0',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '20 Oktober 2026',
    title: 'Perombakan Dialog Pembuatan Website Baru: Studio Split-Layout 980px, Live Canvas Browser Mockup & Sinkronisasi Subdomain Cerdas',
    summary: 'Merombak arsitektur dan antarmuka dialog modal Pembuatan Website Baru (.modal-dialog-create-site) dari sebelumnya berukuran sempit 580px dan berantakan menjadi modal studio interaktif seluas 980px dengan sistem 2 kolom responsif: (1) Kolom Konfigurasi Terstruktur meliputi pemilihan blueprint 2x2 berfitur lengkap, formulir identitas dengan auto-slug generator cerdas dan verifikasi ketersediaan subdomain Traefik Edge real-time, serta pemilih palet warna aksen brand dinamis; (2) Kolom Pratinjau Live Kanvas menampilkan mockup jendela browser lengkap dengan address bar SSL TLS 1.3, hero banner reaktif yang menyesuaikan nama dan warna aksen secara instan, serta kartu telemetri alokasi runtime kontainer Docker cgroups v2 dan bar kapasitas kuota langganan; (3) Perluasan dialog konfigurasi blueprint (.blueprint-config-dialog) menjadi 760px dan pemantapan tombol aksi side-by-side anti-wrap.',
    badge: 'Stable',
    author: 'HeroCMS Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'c-02dash-12000-1',
        type: 'feature',
        scope: 'Expansive 980px Studio Modal Architecture (.modal-dialog-create-site)',
        description: 'Memperluas dimensi dialog pembuatan website menjadi 980px dengan tata letak split-grid 2 kolom yang lapang, seimbang, dan eye-catching di seluruh resolusi layar (720p, 1080p, 1440p, 2480p+).'
      },
      {
        id: 'c-02dash-12000-2',
        type: 'feature',
        scope: 'Interactive Real-Time Browser Mockup & Live Canvas Preview',
        description: 'Menyematkan frame mockup jendela browser macOS dengan address bar SSL TLS 1.3 dan pratinjau kanvas dinamis yang merespons perubahan nama website, slogan, blueprint, serta warna aksen secara instan.'
      },
      {
        id: 'c-02dash-12000-3',
        type: 'improvement',
        scope: 'Smart Auto-Slug Generator & Traefik Edge Subdomain Checker',
        description: 'Menyediakan fitur sinkronisasi otomatis nama situs ke subdomain URL ramah SEO dengan tombol re-sync serta validasi ketersediaan rute edge Traefik v3 HTTP/3 secara langsung.'
      },
      {
        id: 'c-02dash-12000-4',
        type: 'improvement',
        scope: 'Container Telemetry Specs & Plan Quota Progress Meter',
        description: 'Menampilkan telemetri alokasi sumber daya kontainer (0.5 vCPU, 256 MB RAM, Let\'s Encrypt Auto) dan widget progres pemakaian kuota slot kontainer paket langganan secara transparan.'
      }
    ]
  },
  {
    version: 'v1.19.1',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '20 Oktober 2026',
    title: 'Perbaikan Penumpukan Tombol Upgrade Paket & Integrasi Alur Checkout Pembayaran Langsung dengan E-Faktur Otomatis',
    summary: 'Memperbaiki tata letak header kartu paket berjalan (.plan-crown-header) untuk mengeliminasi penumpukan teks dan tombol "Ganti / Upgrade Paket" di semua resolusi layar (720p, 1080p, 1440p, 2480p+). Menambahkan alur Checkout & Pembayaran Langsung terpadu pada penambahan slot kontainer maupun upgrade paket langganan (mendukung 4 metode pembayaran: BCA VA, QRIS Dinamis, Visa Corporate, Mandiri Bill) yang secara instan menerbitkan Faktur Pajak Resmi (E-Faktur PPN 11%) ke buku besar faktur serta langsung memunculkan pratinjau dokumen faktur lunas siap cetak/unduh.',
    badge: 'Stable',
    author: 'HeroCMS Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'c-02dash-11910-1',
        type: 'bugfix',
        scope: 'Plan Crown Header Non-Overlapping Layout Protection',
        description: 'Meredesain struktur kartu paket utama menggunakan .plan-crown-header terpisah dengan grouping judul dan harga otomatis, mencegah tombol aksi bertumpuk di atas deskripsi kuota pada viewport 720p dan 1080p.'
      },
      {
        id: 'c-02dash-11910-2',
        type: 'feature',
        scope: 'Integrated Instant Checkout & Payment Gateway Modal',
        description: 'Menyediakan modal checkout terintegrasi (680px) untuk penambahan slot kontainer dan upgrade paket dengan kalkulasi DPP + PPN 11%, instruksi pembayaran instan, dan 4 kanal pembayaran resmi.'
      },
      {
        id: 'c-02dash-11910-3',
        type: 'feature',
        scope: 'Automatic Tax E-Faktur Issuance & Reactive Ledger Sync',
        description: 'Otomatisasi penerbitan faktur pajak lunas (INV-2026-10-XXXX) ke dalam buku besar InvoicesHistoryModule begitu pembayaran dikonfirmasi, sekaligus memunculkan dialog dokumen E-Faktur resmi seketika.'
      }
    ]
  },
  {
    version: 'v1.19.0',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '20 Oktober 2026',
    title: 'Refaktor Modul Faktur & Riwayat Tagihan Resmi (E-Faktur): Buku Besar, Rekapitulasi Pajak PPN 11% & Profil Wajib Pajak Badan',
    summary: 'Merombak antarmuka modul Faktur & Invoice resmi menjadi sistem penagihan enterprise komprehensif 3-Tab: (1) Buku Besar Faktur interaktif dengan pencarian cepat, filter tahun, clickable row inspection, dan ekspor batch dokumen; (2) Tab Rekapitulasi Pajak PPN 11% & Tren Belanja SaaS menampilkan historis pengeluaran bulanan dan sertifikat kepatuhan fiskal terintegrasi; (3) Tab Pengaturan Profil Wajib Pajak untuk mengonfigurasi identitas PT/Badan Usaha, NPWP 16 digit format baru, alamat kantor resmi, serta otomatisasi pengiriman PDF faktur pajak ke email finance; (4) Pembaruan lembar E-Faktur resmi dengan stempel digital QR Code validasi DJP dan rincian DPP & PPN 11% sesuai PMK-60/PMK.03/2022.',
    badge: 'Stable',
    author: 'HeroCMS Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'c-02dash-11900-1',
        type: 'feature',
        scope: 'Interactive Invoices Ledger & Batch Archival Download',
        description: 'Menyajikan buku besar faktur lengkap dengan status kelayakan 100% lunas, pencarian instan, filter tahun penagihan, tombol ekspor CSV laporan keuangan, dan fitur unduh seluruh berkas faktur dalam satu arsip terpadu.'
      },
      {
        id: 'c-02dash-11900-2',
        type: 'feature',
        scope: 'VAT Tax Reconciliation & Monthly SaaS Spending Analytics',
        description: 'Menambahkan tab rekapitulasi pajak PPN 11% dan tren belanja bulanan (Juli s/d Oktober 2026) disertai sertifikat kepatuhan wajib pajak resmi ber-NPWP PT Hero Digital Multitek.'
      },
      {
        id: 'c-02dash-11900-3',
        type: 'feature',
        scope: 'Corporate Tenant Tax Profile & 16-Digit NPWP Configuration',
        description: 'Menyematkan formulir pengaturan identitas perpajakan badan usaha untuk pencantuman otomatis nama PT, NPWP 16 digit format baru, alamat resmi faktur, serta toggle otomatisasi pengiriman PDF E-Faktur ke email finance.'
      },
      {
        id: 'c-02dash-11900-4',
        type: 'improvement',
        scope: 'Digital E-Faktur Paper Modal with DJP QR Verification Stamp',
        description: 'Menyempurnakan dialog dokumen faktur pajak digital berstempel lunas resmi, verifikasi QR Code DJP, rincian DPP dan PPN 11%, serta tombol aksi cetak dan unduh yang berdampingan secara presisi.'
      }
    ]
  },
  {
    version: 'v1.18.1',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '20 Oktober 2026',
    title: 'Penguatan Proteksi Universal Side-by-Side Baris Aksi Tabel & Sinkronisasi Faktur Tagihan Oktober',
    summary: 'Menerapkan proteksi tata letak tombol baris aksi universal (Anti-Enter / Strict Non-Wrapping) untuk seluruh tabel dan kartu (.row-actions, .ticket-col-actions, .endpoint-actions, .page-card-actions) di semua variasi resolusi layar (720p, 1080p, 1440p, 2480p+). Memperbarui dataset riwayat penagihan resmi dengan faktur periode berjalan Oktober 2026 dan menyinkronkan jadwal perpanjangan otomatis berikutnya ke 15 November 2026.',
    badge: 'Stable',
    author: 'HeroCMS Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'c-02dash-11801-1',
        type: 'improvement',
        scope: 'Universal Side-by-Side Action Buttons Enforced',
        description: 'Menjamin seluruh tombol aksi baris tabel (Lihat E-Faktur, Unduh, Selesaikan Tiket, Hapus, Salin) tetap berdampingan horizontal tanpa mengalami pematahan baris canggung di resolusi rendah maupun tinggi.'
      },
      {
        id: 'c-02dash-11801-2',
        type: 'bugfix',
        scope: 'Current October 2026 Billing Invoice & Telemetry Sync',
        description: 'Menyinkronkan data invoice periode berjalan INV-2026-10-0994 (Lunas) dan memperbarui telemetri jadwal penagihan berikutnya menjadi 15 November 2026.'
      }
    ]
  },
  {
    version: 'v1.18.0',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '20 Oktober 2026',
    title: 'Refaktor Eye-Catching Modul Kapasitas Runtime & Paket Langganan: Peta Topologi Pod Node, Matriks 3-Tier Harga & Simulator Custom Cluster',
    summary: 'Merombak tampilan dan kapabilitas fungsional modul Kapasitas Runtime & Paket Langganan menjadi sangat atraktif, intuitif, dan responsif (720p hingga 2480p+). Menghadirkan: (1) Cluster 4 Kartu Telemetri Komersial real-time (Slot Kontainer, CPU CFS, RAM cgroups v2, S3 Storage); (2) Crown Jewel Plan Card dengan visual ambient top gradient, kapsul kapabilitas aktif, dan manajemen metode penagihan; (3) Peta Topologi Slot Node interaktif yang memvisualisasikan kontainer aktif lengkap dengan telemetri runtime serta slot kosong siap deploy; (4) Matriks 3-Tier Pilihan Paket (Starter, Pro, Agency) dengan toggle siklus Bulanan vs Tahunan (Diskon 20%) dan modal konfirmasi perubahan paket prorata; (5) Kalkulator Simulasi Resource Cluster Kustom dinamis dengan slider interaktif dan kalkulasi PPN 11%.',
    badge: 'Stable',
    author: 'HeroCMS Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'c-02dash-11800-1',
        type: 'feature',
        scope: 'Interactive Container Node Topology Map (.pod-topology-grid)',
        description: 'Menyajikan visualisasi topologi slot kontainer nyata: slot terpakai menampilkan status running, domain rute Traefik, dan telemetri CPU/RAM, sedangkan slot kosong menyajikan akses langsung untuk deploy kontainer baru.'
      },
      {
        id: 'c-02dash-11800-2',
        type: 'feature',
        scope: '3-Tier Subscription Pricing Matrix with Annual Discount Toggle',
        description: 'Menambahkan katalog perbandingan paket interaktif (Starter, Pro, Agency) dengan switch siklus penagihan Bulanan vs Tahunan (Diskon 20%) serta status paket aktif pengguna saat ini.'
      },
      {
        id: 'c-02dash-11800-3',
        type: 'feature',
        scope: 'Dynamic Custom Cluster Resource Simulator (.calculator-simulator-card)',
        description: 'Kalkulator interaktif berbasis slider untuk menghitung simulasi biaya runtime kustom (Kontainer 1-25, CPU 0.25-2.0 vCPU, RAM 256MB-4GB, S3 Storage 1-100GB) lengkap dengan rincian subtotal dan PPN 11%.'
      },
      {
        id: 'c-02dash-11800-4',
        type: 'improvement',
        scope: 'Prorated Plan Upgrade Confirmation & Billing Method Modals',
        description: 'Menyematkan dialog modal konfirmasi upgrade paket (680px) dengan perbandingan spesifikasi sebelumnya vs target, pemberitahuan prorata otomatis, serta dialog manajemen metode pembayaran utama.'
      }
    ]
  },
  {
    version: 'v1.17.3',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '20 Oktober 2026',
    title: 'Interactive Webhook Delivery Inspector (Request/Response) & In-Browser Headless REST API Playground ("Try It Out")',
    summary: 'Menambahkan fitur standar industri terdepan untuk integrasi developer di HeroCMS: (1) Interactive Webhook Delivery Inspector Drawer/Modal dengan inspeksi detail HTTP request header (RFC 9421 anti-replay timestamp & HMAC-SHA256 signature), JSON payload yang dikirim, respon remote server, serta kapabilitas Redeliver (Kirim Ulang Event); (2) In-Browser Interactive Headless REST API Request Playground ("Try It Out") pada tab REST API & SDK dengan simulasi otentikasi Bearer Token PAT, validasi granular scope otomatis, dan respon data CMS real-time (Articles, Leads, Media, Telemetry) tanpa risiko kontainer.',
    badge: 'Stable',
    author: 'HeroCMS Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'c-02dash-11703-1',
        type: 'feature',
        scope: 'Interactive Webhook Delivery Inspector Modal (.modal-dialog-inspector: 780px)',
        description: 'Tabel riwayat pengiriman webhook kini interaktif (clickable row & tombol inspeksi) untuk membuka modal inspector lengkap dengan metadata strip, URL target, status latensi, dan tab pemisah Request vs Response.'
      },
      {
        id: 'c-02dash-11703-2',
        type: 'security',
        scope: 'RFC 9421 Anti-Replay Timestamp & HMAC-SHA256 Delivery Verification',
        description: 'Menampilkan header inspeksi keamanan X-HeroCMS-Signature dengan format anti-replay timestamp (t=<timestamp>,v1=<hmac>) beserta X-HeroCMS-Delivery ID untuk verifikasi integritas pesan di sisi penerima.'
      },
      {
        id: 'c-02dash-11703-3',
        type: 'feature',
        scope: 'Manual Event Redelivery Engine (Kirim Ulang Event)',
        description: 'Menyediakan tombol "Kirim Ulang Event (Redeliver)" langsung di dalam modal inspector dengan telemetri dispatch ulang instan dan pembaruan timestamp log pengiriman.'
      },
      {
        id: 'c-02dash-11703-4',
        type: 'feature',
        scope: 'In-Browser Headless REST API Playground ("Try It Out")',
        description: 'Menyematkan playground interaktif pada tab REST API & SDK untuk mengeksekusi endpoint live (/content/articles, /leads/submit, /media/assets, /telemetry/overview) menggunakan token PAT aktif, lengkap dengan validasi 401 Unauthorized dan 403 Forbidden bila scope tidak mencukupi.'
      }
    ]
  },
  {
    version: 'v1.17.2',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '20 Oktober 2026',
    title: 'Penyempurnaan Responsivitas & Tata Letak Dialog Modal Generate Personal Access Token (PAT)',
    summary: 'Memperluas dan merombak tata letak dialog modal Generate Personal Access Token (PAT) dari sebelumnya berukuran sempit (620px) menjadi modal luas adaptif 900px (.modal-dialog-pat) dengan grid responsif di seluruh resolusi (720p, 1080p, 1440p, 2480p+). Menata formulir input nama token dan masa berlaku secara berdampingan (2-column settings grid), menyematkan bar template izin cepat (Quick Scope Presets: Jamstack Reader, Content Writer, Lead Collector, Full Access), memperluas matriks kartu izin modular dengan hover lift dan checkmark status, serta menambahkan bilah ringkasan izin aktif (Live Scope Summary Strip) sebelum tombol eksekusi.',
    badge: 'Stable',
    author: 'HeroCMS Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'c-02dash-11702-1',
        type: 'improvement',
        scope: 'Expansive PAT Modal Sizing (.modal-dialog-pat: 900px)',
        description: 'Menerapkan lebar modal adaptif max-width: 900px (width: min(900px, 94vw)) untuk menghilangkan kesan sempit dan sesak pada dialog pembuatan token PAT di berbagai layar monitor dan laptop.'
      },
      {
        id: 'c-02dash-11702-2',
        type: 'feature',
        scope: 'Quick Scope Presets Selector Bar',
        description: 'Menambahkan tombol template izin cepat (Jamstack Reader, Content Writer, Lead Collector, Semua Izin) di atas matriks cakupan izin agar pengguna dapat mengonfigurasi set permissions dalam 1 klik instan.'
      },
      {
        id: 'c-02dash-11702-3',
        type: 'improvement',
        scope: 'Adaptive 2-Column Settings Grid & Multi-Column Scopes Cards',
        description: 'Mengubah field input nama token dan dropdown masa berlaku menjadi grid 2 kolom sejajar yang responsif, serta menata kartu-kartu izin granular menjadi grid multi-kolom adaptif minmax(280px, 1fr).'
      },
      {
        id: 'c-02dash-11702-4',
        type: 'improvement',
        scope: 'Live Active Scopes Summary Strip & One-Time Reveal Dialog Sizing',
        description: 'Menyematkan bilah ringkasan izin aktif di bagian bawah form untuk memvalidasi scope sebelum pembuatan token, serta memperluas dialog One-Time Reveal (.modal-dialog-onetime: 680px) agar string raw token tampil lapang tanpa line-break canggung.'
      }
    ]
  },
  {
    version: 'v1.17.1',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '20 Oktober 2026',
    title: 'Refaktor Modal Tambah Webhook Endpoint: Preset Terintegrasi (Discord/Slack/Zapier/Custom), Pengelompokan Event & Live JSON Payload Preview',
    summary: 'Menyempurnakan dialog modal Tambah Webhook Endpoint pada modul Webhooks & API Developer. Menambahkan pilihan preset platform instan (Discord, Slack, Zapier, Custom HTTP Server) dengan tips format URL dan konfigurasi otomatis. Mengelompokkan event notifikasi ke dalam kategori tematik (Konten & Editorial, Formulir Kontak & Prospek, Edge Ingress & Keamanan, Pemeliharaan & Cadangan) disertai kontrol "Pilih Semua" per kategori. Menyematkan generator kunci HMAC-SHA256 secret mandiri dengan tombol roll & copy, serta pratinjau dinamis JSON payload real-time interaktif dengan navigasi per-event dan proteksi tata letak tombol berjejer horizontal (side-by-side).',
    badge: 'Stable',
    author: 'HeroCMS Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'c-02dash-11701-1',
        type: 'feature',
        scope: 'Webhook Platform Presets (Discord, Slack, Zapier, Custom)',
        description: 'Menyediakan kartu preset target terintegrasi yang secara otomatis mengisi nama integrasi, placeholder URL yang tepat, tips panduan konfigurasi, dan rekomendasi event notifikasi yang sesuai untuk masing-masing platform.'
      },
      {
        id: 'c-02dash-11701-2',
        type: 'improvement',
        scope: 'Categorized Notification Events Matrix',
        description: 'Mengorganisir checklist event notifikasi ke dalam 4 kategori terstruktur dengan ikon, counter jumlah terpilih, dan tombol toggle "Pilih Semua / Hapus Semua" per kelompok event.'
      },
      {
        id: 'c-02dash-11701-3',
        type: 'feature',
        scope: 'Live Dynamic JSON Payload Preview Terminal',
        description: 'Menyematkan terminal pratinjau payload JSON real-time interaktif di dalam modal dengan tab navigasi sampel per event (article.published, lead.received, ssl.renewed, traffic.spike, backup.completed) serta tombol salin JSON instan.'
      },
      {
        id: 'c-02dash-11701-4',
        type: 'security',
        scope: 'HMAC-SHA256 Secret Key Management in Modal',
        description: 'Menyertakan field kunci tanda tangan rahasia (HMAC-SHA256) terintegrasi dengan aksi regenerasi rahasia (roll secret) beranimasi dan salin ke clipboard untuk verifikasi header X-HeroCMS-Signature.'
      }
    ]
  },
  {
    version: 'v1.17.0',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '20 Oktober 2026',
    title: 'Refaktor Arsitektur Webhooks Notifikasi Event & Peluncuran Personal Access Tokens (PAT) dengan Granular Scopes Filter',
    summary: 'Merombak total arsitektur modul Webhooks & API Developer menjadi sistem integrasi tingkat aplikasi yang aman dan terisolasi. Mengeliminasi kontrol lifecycle kontainer (stop/start/deploy) dan pipeline CI/CD dari API publik pengguna demi mencegah celah keamanan infrastruktur. Menghadirkan kapabilitas Personal Access Tokens (PAT) layaknya GitHub/Cloudflare dengan filter izin granular per kategori (Headless CMS, Prospek/Leads, CDN Media S3, Telemetri, dan Support), dialog pengungkapan token satu kali (One-Time Reveal) berstandar Zero-Knowledge, pembaruan webhook berfokus pada notifikasi event aman (Discord, Slack, Zapier), serta tabel inspeksi riwayat pengiriman payload (Delivery Logs) real-time.',
    badge: 'Stable',
    author: 'HeroCMS Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'c-02dash-11700-1',
        type: 'feature',
        scope: 'Personal Access Tokens (PAT) Engine & Granular Scopes Filter',
        description: 'Menerapkan sistem Personal Access Tokens (PAT) dengan matriks filter izin (scopes) granular layaknya Cloudflare API Tokens dan GitHub PAT. Scopes terbagi ke dalam 5 kategori modular (content:read, content:write, leads:read, leads:write, media:read, media:upload, telemetry:read, tickets:read) dengan toggle "Pilih Semua" per kategori.'
      },
      {
        id: 'c-02dash-11700-2',
        type: 'security',
        scope: 'Zero-Container Lifecycle API Policy & Zero-Knowledge Token Vault',
        description: 'Menghapus endpoint dan skrip kontrol siklus hidup kontainer (start/stop/restart) serta alur CI/CD dari API publik tenant demi mengamankan isolasi docker host. Menambahkan dialog One-Time Token Reveal dengan peringatan keamanan ketat bahwa raw token tidak pernah disimpan di database server.'
      },
      {
        id: 'c-02dash-11700-3',
        type: 'feature',
        scope: 'Outgoing Webhook Event Notification & Real-Time Delivery Logs Table',
        description: 'Merefaktor webhook outgoing agar berfokus murni pada notifikasi event aplikasi aman (article.published, lead.received, ssl.renewed, traffic.spike, backup.completed) dengan header HMAC-SHA256 signature (X-HeroCMS-Signature), tombol simulasi Test Ping langsung, serta tabel riwayat log pengiriman (Delivery Logs) yang menampilkan HTTP 200 OK dan latensi dispatch.'
      },
      {
        id: 'c-02dash-11700-4',
        type: 'improvement',
        scope: 'Headless REST API Interactive Documentation & Responsive UI',
        description: 'Menambahkan tab dokumentasi interaktif Headless REST API v1 lengkap dengan contoh cuplikan kode cURL, TypeScript/Node.js SDK, Golang, dan Python, serta menjamin tata letak tombol aksi dan modal footers selalu berjejer rapi secara horizontal (side-by-side) tanpa wrapping ganjil di seluruh variasi resolusi layar.'
      }
    ]
  },
  {
    version: 'v1.16.4',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '20 Oktober 2026',
    title: 'Perbaikan Full-Bleed Edge-to-Edge Visual Editor & Eliminasi Pemotongan Ruang Kosong Sebelah Kanan Lintas Layar',
    summary: 'Memperbaiki masalah penyusutan (shrink) dan pemotongan kanvas Visual Editor yang menyisakan ruang kosong (blank empty space) di sisi kanan layar pada resolusi laptop, desktop QHD (1440px), hingga 4K Ultrawide (2480px+). Mengisolasi kontainer editor (.is-editor-workspace) dari batasan max-width dan padding content-scroll-pane umum, menonaktifkan header duplikat saat mode editor aktif, serta memastikan area kanvas dan toolbar studio membentang 100% penuh dari tepi ke tepi (edge-to-edge full width).',
    badge: 'Stable',
    author: 'HeroCMS Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'c-02dash-11604-1',
        type: 'bugfix',
        scope: 'Visual Editor Workspace Isolation (.is-editor-workspace)',
        description: 'Menerapkan kelas khusus .is-editor-workspace pada kontainer utama saat activeMenu === "editor" dengan padding: 0 !important, margin: 0 !important, max-width: none !important, dan width: 100% !important. Mengeliminasi pembatasan max-width 1680px/1880px dari media queries Tier 3 & Tier 4 yang sebelumnya menyebabkan editor menyusut dan menyisakan ruang kosong di sebelah kanan.'
      },
      {
        id: 'c-02dash-11604-2',
        type: 'bugfix',
        scope: 'Top Nav Header Auto-Hide on Editor Mode (.editor-active-mode)',
        description: 'Menyembunyikan top-nav-header dashboard secara otomatis saat mode editor aktif sehingga tidak ada tumpang tindih header ganda dan visual editor mendapatkan ruang vertikal 100vh penuh secara native.'
      },
      {
        id: 'c-02dash-11604-3',
        type: 'improvement',
        scope: 'Visual Studio Root & Viewport Sizing (visual-editor.css)',
        description: 'Mengoptimalkan .visual-studio-root menjadi width: 100%; max-width: 100%; height: 100%; min-height: 100%; sehingga studio command bar, left dock, dan infinite canvas artboard dapat memanfaatkan 100% lebar layar secara presisi.'
      },
      {
        id: 'c-02dash-11604-4',
        type: 'bugfix',
        scope: 'Reader Mode Grid Full Expansion (.reader-layout-grid)',
        description: 'Menghapus batasan max-width 960px/1340px dan justify-content: start pada reader-layout-grid dan reader-editorial-hero di layar besar agar konten baca artikel membentang proporsional dan tidak terpotong sepihak di sisi kanan.'
      }
    ]
  },
  {
    version: 'v1.16.3',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '20 Oktober 2026',
    title: 'Penataan Horizontal Sejajar (Side-by-Side Berjejer) untuk Grup Tombol Aksi, Card Action Bars, Modal Footers & Segmented Filter Bars',
    summary: 'Memperbaiki tata letak kelompok tombol aksi yang sebelumnya mengalami pemecahan baris baru ("enter gitu / stacking vertikal") sehingga kembali berjejer rapi secara horizontal (side-by-side) di seluruh resolusi (720px, 1080px, 1440px, 2480px+). Mengeliminasi paksaan flex-direction: column dan column-reverse pada card-action-bar, modal-footer, reader navigation bar, dan pod analytics footer. Menambahkan proteksi Universal Side-by-Side Button Protection di studio-master.css dengan scrollbar sentuh mulus (touch horizontal scrolling) saat ruang sempit.',
    badge: 'Stable',
    author: 'HeroCMS Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'c-02dash-11603-1',
        type: 'bugfix',
        scope: 'Card Action Bar Inline Alignment (.card-action-bar)',
        description: 'Menghapus pemecahan baris column pada .card-action-bar di resolusi <= 720px dan mengunci flex-wrap: nowrap. Tombol Editor [✏️ Editor] dan kelompok tombol runtime kontainer [▶][■][⚡][🗑] kini tetap sejajar berdampingan dalam satu baris horizontal tanpa terpisah baris.'
      },
      {
        id: 'c-02dash-11603-2',
        type: 'bugfix',
        scope: 'Modal Dialog Action Footers (.modal-footer, .modal-footer-row, dll.)',
        description: 'Mendefinisikan styling flex horizontal dasar untuk .modal-footer yang sebelumnya absen di desktop, serta mencabut aturan column-reverse 100% full-width di mobile/720px. Tombol dialog ("Batal", "Deploy Kontainer", "Simpan Artikel", "Cetak E-Faktur", "Uji Ulang DNS") kini selalu berjejer horizontal berdampingan dengan ukuran proporsional.'
      },
      {
        id: 'c-02dash-11603-3',
        type: 'bugfix',
        scope: 'Segmented Filter Bars & Control Pills (.segmented-filter-bar, .status-tabs-pill)',
        description: 'Mengubah flex-wrap: wrap menjadi flex-wrap: nowrap dengan overflow-x: auto pada .segmented-filter-bar dan .status-tabs-pill. Tombol filter kategori, status, dan timeframe kini tidak lagi patah atau menumpuk ke baris kedua di dalam kapsul abu-abu.'
      },
      {
        id: 'c-02dash-11603-4',
        type: 'bugfix',
        scope: 'Reader Navigation Header & Pod Analytics Toolbar (.reader-header-nav-actions, .footer-right-buttons)',
        description: 'Mengunci baris horizontal tanpa wrapping pada header artikel reader (.reader-header-nav-bar) dan footer pod telemetry (.footer-right-buttons). Tombol aksi (Bagikan, Buka Web, Sunting, Export CSV, Purge Cache, Terminal) tetap berjejer satu baris dengan overflow horizontal terproteksi.'
      },
      {
        id: 'c-02dash-11603-5',
        type: 'improvement',
        scope: 'Universal Side-by-Side Button Protection (studio-master.css)',
        description: 'Menerapkan aturan flex-wrap: nowrap !important dan button { white-space: nowrap !important; flex-shrink: 0; } universal pada seluruh kelas kluster tombol Studio (toolbar, actions cell, command bar, batch action, reply actions, dsb.) di seluruh tingkatan resolusi.'
      }
    ]
  },
  {
    version: 'v1.16.2',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '20 Oktober 2026',
    title: 'Standarisasi Text Anti-Wrap & Integritas Button/Span (Anti-Enter) Lintas Resolusi',
    summary: 'Mengimplementasikan sistem Universal Text Anti-Wrap & Button/Span Integrity System pada studio-master.css. Mengatasi masalah teks terputus/terpotong menjadi beberapa baris ("terkena enter") pada tombol, badge, status pill, metric card, navigation tab, breadcrumbs, dan form label saat ukuran viewport berubah (720px, 1080px, 1440px, hingga 2480px+). Memastikan seluruh tombol aksi (action buttons), segmented filter, dan status tags tetap utuh pada satu baris (single-line intact) dengan flex-wrap yang aman pada kontainer induk.',
    badge: 'Stable',
    author: 'HeroCMS Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'c-02dash-11602-1',
        type: 'bugfix',
        scope: 'Universal Button & Inline Span Anti-Wrap (studio-master.css)',
        description: 'Menerapkan aturan white-space: nowrap !important pada seluruh elemen button dan span di dalamnya (.btn-primary, .btn-ghost-sm, .btn-top-create, .btn-action-primary, .btn-modal-confirm, .btn-reader-action-*, dll.) agar teks label tombol tidak pernah terpotong ke baris baru.'
      },
      {
        id: 'c-02dash-11602-2',
        type: 'bugfix',
        scope: 'Semantic Badges, Status Pills & Counters Integrity (studio-master.css)',
        description: 'Menstandarkan seluruh badge status (.radar-status-pill, .badge-status, .standard-badge, .pod-meta-pill, .dns-valid-pill, .ssl-status-badge, .hud-pill, .pill-metric, .tag-chip, dll.) dengan white-space: nowrap !important dan flex-shrink: 0.'
      },
      {
        id: 'c-02dash-11602-3',
        type: 'improvement',
        scope: 'Action Toolbars & Header Flex-Wrap Safe Zones (studio-master.css)',
        description: 'Menambahkan flex-wrap: wrap yang aman pada toolbar aksi (.card-action-bar, .footer-right-buttons, .reader-header-nav-actions, .filter-toolbar, .page-intro-row, .quota-quick-pills) sehingga tombol membungkus sebagai satu kesatuan utuh tanpa merusak teks di dalam tombol.'
      },
      {
        id: 'c-02dash-11602-4',
        type: 'bugfix',
        scope: 'Top Breadcrumbs, Navigation & Table Cells (studio-master.css)',
        description: 'Memastikan breadcrumb navigasi atas (.breadcrumbs, .crumb-current, .crumb-link), brand tags, dan sel aksi tabel (.table-actions-cell) tidak mengalami wrapping internal saat ruang viewport menyempit.'
      }
    ]
  },
  {
    version: 'v1.16.1',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '20 Oktober 2026',
    title: 'Arsitektur Responsif Multi-Tier Lintas Resolusi (720px, 1080px, 1440px, 2480px+ Ultrawide), Mobile Navigation Drawer, Universal Modal & Reader Fluid Reflow',
    summary: 'Mengimplementasikan sistem desain responsif multi-tier komprehensif di seluruh modul antarmuka Studio CMS. Mengatasi masalah tata letak pada layar 720px (mobile/tablet), 1080px (laptop/standar desktop), 1440px (QHD 2K), hingga 2480px+ (4K UHD & Ultrawide). Menyediakan sidebar off-canvas drawer dengan tombol hamburger di top header dan backdrop interaktif untuk layar <= 1024px. Mengoptimasi seluruh formulir modal dialog, footer actions, dan pemilih konfigurasi menjadi form fleksibel dan bottom-sheet ergonomis. Memperbaiki mode baca artikel (Article Reader) dan editor markdown agar tidak terjadi kebocoran scroll horizontal, serta menerapkan pembatasan max-width pada monitor ultrawide agar konten teks tetap ergonomis dibaca.',
    badge: 'Stable',
    author: 'HeroCMS Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'c-02dash-11601-1',
        type: 'feature',
        scope: 'Mobile Navigation Drawer & Hamburger System (DashboardView.vue & studio-master.css)',
        description: 'Mentransformasi sidebar menjadi off-canvas navigation drawer pada layar <= 1024px dengan tombol toggle hamburger di header navigasi, backdrop penutup interaktif, keyboard listener tombol Escape, dan penutupan otomatis saat memilih menu.'
      },
      {
        id: 'c-02dash-11601-2',
        type: 'bugfix',
        scope: 'Universal Form & Modal Responsiveness pada 720px (studio-master.css)',
        description: 'Menstandarkan seluruh dialog modal (.modal-dialog, .modal-dialog-lg, .modal-dialog-media-studio, .blueprint-config-dialog) agar beradaptasi menjadi bottom-sheet mobile pada <= 720px. Merombak multi-column form rows (.form-row-2col, .form-row-3col, .events-checklist-grid, .cert-detail-row) menjadi 1 kolom vertikal, dan mengubah modal footer (.modal-footer, .modal-footer-row, .modal-footer-bespoke, .rich-modal-footer, .studio-modal-footer) menjadi tombol bertumpuk (column-reverse full-width).'
      },
      {
        id: 'c-02dash-11601-3',
        type: 'bugfix',
        scope: 'Detail Artikel & Reader View Responsiveness (ContentArticlesModule.vue & studio-master.css)',
        description: 'Mengoptimalkan layout artikel reader (.reader-layout-grid, .reader-header-nav-bar, .reader-editorial-hero, .reader-main-content) agar bertumpuk rapi di layar kecil, tombol aksi membungkus (wrap), hero title proporsional, serta mengisolasi blok kode (pre/code) dan gambar agar tidak memicu kebocoran horizontal scroll.'
      },
      {
        id: 'c-02dash-11601-4',
        type: 'improvement',
        scope: 'Tier 2 (1080p) & Tier 3 (1440p 2K) Balanced Card & Telemetry Grids (studio-master.css)',
        description: 'Menerapkan grid 2 kolom seimbang untuk kartu kontainer, blueprint template, artikel, dan media assets pada rentang 721px-1366px, serta mengekspansinya ke 3 kolom kartu dan 4 kolom telemetri dengan batasan max-width 1680px pada monitor 1440p.'
      },
      {
        id: 'c-02dash-11601-5',
        type: 'improvement',
        scope: 'Tier 4 (2480px+ 4K UHD & Ultrawide Ergonomics) Container Bounds (studio-master.css)',
        description: 'Membatasi lebar baca artikel maksimal 960px pada monitor ultrawide untuk mencegah baris teks terlalu panjang yang melelahkan mata, serta mengekspansi kartu grid kontainer dan katalog template secara seimbang menjadi 4-5 kolom pada viewport 1920px hingga 2400px+.'
      },
      {
        id: 'c-02dash-11601-6',
        type: 'bugfix',
        scope: 'Universal Table Responsive Anti-Overflow Shell (studio-master.css)',
        description: 'Menjamin seluruh tabel data (.table-responsive-shell, .container-table-card, .pro-table, .ledger-table, .inv-table-wrap) memiliki kemampuan horizontal touch scroll yang mulus tanpa merusak tata letak shell aplikasi utama.'
      }
    ]
  },
  {
    version: 'v1.16.0',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '20 Oktober 2026',
    title: 'Konsolidasi Analitik Terpadu, Integrasi Pod Detail Deep-Dive, Perbaikan Master CSS & Ekspansi Telemetri Vitals',
    summary: 'Menghapus tombol analitik pada menu Situs & Kontainer (ContainersModule.vue) dan mengonsolidasikan seluruh kapabilitas observabilitas ke menu Analitik & Telemetri (AnalyticsTelemetryModule.vue). Modul Analitik kini mendukung Dual-View Mode (Ikhtisar Fleet Global vs Detail Pod & Kontainer Mandiri) dengan navigasi langsung dan pemilih pod terpadu. Memperbaiki dan menstandarkan styling CSS master button (.btn-primary, .btn-ghost-sm, .terminal-filter-pill). Memperluas metrik telemetri dengan Core Web Vitals RUM (LCP, INP, CLS, FCP, TTFB, Burn Rate), persebaran Edge POPs Ingress Traefik (Jakarta, Singapura, US, Tokyo, Frankfurt), distribusi protokol jaringan (HTTP/3 QUIC vs HTTP/2), efisiensi kompresi Brotli 11, atribusi perangkat/OS/browser, serta metrik kesehatan pool PostgreSQL RLS dan Redis In-Memory.',
    badge: 'Stable',
    author: 'HeroCMS Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'c-02dash-11600-1',
        type: 'improvement',
        scope: 'Konsolidasi Analitik & Hapus Tombol di Kontainer (ContainersModule.vue)',
        description: 'Menghapus tombol analitik yang redundan dari kartu grid dan baris tabel kontainer. Mengalihkan alur observabilitas sepenuhnya ke menu Analitik & Telemetri.'
      },
      {
        id: 'c-02dash-11600-2',
        type: 'feature',
        scope: 'Dual-View Mode & Integrasi Pod Detail (AnalyticsTelemetryModule.vue)',
        description: 'Menyediakan switcher mode antara Ikhtisar Fleet Global dan Detail Pod & Kontainer Mandiri lengkap dengan Apache ECharts, log stream hit, kalender uptime SLA 30 hari, dan inspeksi kernel cgroups v2.'
      },
      {
        id: 'c-02dash-11600-3',
        type: 'bugfix',
        scope: 'Standarisasi CSS Button & Master Tokens (studio-master.css)',
        description: 'Menambahkan styling resmi untuk .btn-primary, .btn-ghost-sm, dan .terminal-filter-pill agar tombol Export dan aksi tabel ter-CSS sempurna sesuai tema HeroCMS Studio.'
      },
      {
        id: 'c-02dash-11600-4',
        type: 'feature',
        scope: 'Ekspansi Telemetri Core Web Vitals RUM & Edge POPs (fleet-telemetry.ts)',
        description: 'Memperkaya data telemetri dengan 6 metrik Core Web Vitals (LCP, INP, CLS, FCP, TTFB, Burn Rate), pemantauan latensi 5 Edge POP Data Centers, serta distribusi HTTP/3 QUIC dan kompresi Brotli.'
      },
      {
        id: 'c-02dash-11600-5',
        type: 'feature',
        scope: 'Atribusi Privasi Klien & Kesehatan PostgreSQL RLS (AnalyticsTelemetryModule.vue)',
        description: 'Menampilkan distribusi perangkat, peramban, dan sistem operasi pengunjung, serta utilitas koneksi PostgreSQL RLS dan jejak memori cache Redis In-Memory.'
      }
    ]
  },
  {
    version: 'v1.15.0',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '20 Oktober 2026',
    title: 'Transformasi Modul Telemetri & Audit Performa Fleet Enterprise (SLA, Peak Traffic & Security Audit)',
    summary: 'Merombak menyeluruh modul Analitik & Telemetri (AnalyticsTelemetryModule.vue) menjadi Pusat Audit Keandalan & Observabilitas Fleet (Macro Fleet Telemetry Hub). Menghadirkan fitur Scope Switcher (Semua Situs vs Kontainer Tertentu), metrik kepatuhan SLA & beban puncak (Peak RPS), audit anggaran kesalahan status HTTP RFC 9110 (2xx, 3xx, 4xx, 5xx), tabel komparasi saturasi armada kontainer & risiko OOM cgroups v2, audit keamanan penyerapan ancaman (Rate Limiting 429 & WAF), query Top Pages Redis In-Memory, log stream Kafka Redpanda terfilter, serta kemampuan ekspor laporan audit kepatuhan resmi dalam format JSON.',
    badge: 'Stable',
    author: 'HeroCMS Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'c-02dash-11500-1',
        type: 'feature',
        scope: 'Interactive Fleet Scope Switcher & Timeframe',
        description: 'Menyediakan filter evaluasi dinamis antara Semua Situs (Global Fleet) dan kontainer spesifik dengan rentang waktu 24 jam, 7 hari, dan 30 hari.'
      },
      {
        id: 'c-02dash-11500-2',
        type: 'feature',
        scope: 'RFC 9110 HTTP Status & SLA Error Budget Audit',
        description: 'Menyajikan matriks audit kode respon HTTP (2xx, 3xx, 4xx, 5xx) beserta visualisasi sisa anggaran kesalahan (Error Budget) dan status kepatuhan SLA (<0.10% threshold).'
      },
      {
        id: 'c-02dash-11500-3',
        type: 'feature',
        scope: 'Fleet Resource Saturation & OOM Risk Benchmark Table',
        description: 'Tabel komparasi seluruh armada kontainer dengan data pangsa trafik, latensi rata-rata edge, peak CPU, alokasi RAM cgroups v2, skor risiko OOM, dan tombol pintas Buka Analitik Pod.'
      },
      {
        id: 'c-02dash-11500-4',
        type: 'security',
        scope: 'Threat Ingestion & Bot Classification Audit',
        description: 'Panel audit penangkal eksploitasi WAF, mitigasi Rate Limiter 429, klasifikasi trafik manusia vs crawler bot, dan rincian negara asal penetrasi yang diblokir.'
      },
      {
        id: 'c-02dash-11500-5',
        type: 'feature',
        scope: 'Compliance SLA Audit Report JSON Export',
        description: 'Fasilitas unduh satu-klik laporan kepatuhan SLA dan telemetri resmi dalam format JSON terstruktur untuk kebutuhan audit eksternal dan manajemen.'
      }
    ]
  },
  {
    version: 'v1.14.28',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '20 Oktober 2026',
    title: 'Isolasi Catatan Rilis Mandiri Service 02 Dashboard CMS & Eliminasi Dependensi Lintas-Layanan',
    summary: 'Menerapkan pemisahan mutlak catatan rilis khusus untuk Service 02: Dashboard Studio & Go BFF. Menghapus entri rilis microservice lain (seperti Service 07 Docs) dari dataset dashboard, memindahkan arsip 07-docs ke direktori resminya di services/07-docs/src/data/changelog.ts, menyederhanakan antarmuka ChangelogModule menjadi pembaca rilis studio murni dengan telemetri versi mandiri, filter kategori bersih, serta menyelaraskan tata kelola Semantic Versioning independen sesuai standar arsitektur monorepo.',
    badge: 'Stable',
    author: 'HeroCMS Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'c-02dash-11428-1',
        type: 'improvement',
        scope: 'Decoupled Service Changelog Architecture',
        description: 'Mengisolasi dataset changelog agar murni hanya memuat riwayat pembaruan dan patch dari Service 02: Dashboard Studio, mencegah kontaminasi entri antar-microservice.'
      },
      {
        id: 'c-02dash-11428-2',
        type: 'bugfix',
        scope: 'ChangelogModule UI Streamlining',
        description: 'Menghapus tombol filter lintas-service dan widget matriks multi-layanan dari tampilan ChangelogModule, menghadirkan antarmuka pelacak rilis studio yang bersih, fokus, dan bebas bug.'
      },
      {
        id: 'c-02dash-11428-3',
        type: 'feature',
        scope: 'Independent Docs Changelog Persistence',
        description: 'Memindahkan 6 versi rilis Service 07 Docs (v1.0.0 s/d v1.4.1) ke services/07-docs/src/data/changelog.ts dengan pengetikan TypeScript lengkap.'
      }
    ]
  },
  {
    version: 'v1.14.27',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '19 Oktober 2026',
    title: 'Desentralisasi Matriks Versi Microservices Independen & Navigasi Filter Layanan Terpadu',
    summary: 'Menerapkan pemisahan versi independen untuk setiap aplikasi/service di monorepo HeroCMS guna mencegah kebingungan versi monolitik. Menghadirkan widget Matriks Versi Independen Microservices di ChangelogModule yang menampilkan status versi individual 7 microservices (01-admin-console, 02-dashboard-cms, 03-provision-orchestrator, 04-marketing-site, 05-ai-agent-service, 06-mobile-companion, 07-docs), filter rilis per-service interaktif, serta binding versi DashboardView khusus ke versi 02-dashboard-cms.',
    badge: 'Stable',
    author: 'HeroCMS Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'c-02dash-11427-1',
        type: 'feature',
        scope: 'Independent Microservice Version Matrix',
        description: 'Menyajikan panel grid visual 7 kartu microservice di ChangelogModule dengan informasi versi aktif masing-masing aplikasi, badge stabilitas, tech stack, dan PIC lead.'
      },
      {
        id: 'c-02dash-11427-2',
        type: 'feature',
        scope: 'Multi-Service Changelog Filter Tabs',
        description: 'Menambahkan navigasi filter tab berbasis service (Semua Layanan, 02-dashboard-cms, 07-docs) sehingga catatan perubahan setiap microservice terisolasi dan mudah ditelusuri.'
      },
      {
        id: 'c-02dash-11427-3',
        type: 'improvement',
        scope: 'Decoupled Version Resolution in DashboardView',
        description: 'Memperbaiki resolusi versi di sidebar DashboardView dan status telemetri agar selalu merujuk ke versi spesifik 02-dashboard-cms (v1.14.27) dan tidak tercampur dengan nomor versi service lain.'
      }
    ]
  },
  {
    version: 'v1.14.26',
    service: '02-dashboard-cms',
    serviceName: 'Service 02: Dashboard Studio & Go BFF',
    releaseDate: '19 Oktober 2026',
    title: 'Kamus Arsitektur Berbasis Blueprint Panduan Operasional & 10 SOP Lifecycle Standar Industri',
    summary: 'Mentransformasi Kamus Arsitektur menjadi blueprint operasional interaktif yang dilengkapi kebutuhan sistem, port, lokasi file rujukan, langkah eksekusi step-by-step, perintah CLI verifikasi cepat, dan aturan Do & Don\'ts; meresmikan 10 Standar Operasional Prosedur (SOP) industri mencakup git branching (SOP-GIT-01), siklus pengerjaan tugas end-to-end (SOP-FLOW-01), tata cara klaim dan kelola checklist (SOP-CHK-01), serta matriks kepatuhan mutlak dan larangan 6 microservices (SOP-SVC-01).',
    badge: 'Stable',
    author: 'HeroCMS Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'c-11426-1',
        type: 'feature',
        scope: 'Actionable Architecture Blueprint Guides',
        description: 'Mentransformasi 13 entri kamus arsitektur di index.html dan TASK_CHECKLIST.md menjadi kartu blueprint interaktif lengkap dengan dependensi, port, file rujukan, CLI command, langkah pakai, dan Do/Don\'ts.'
      },
      {
        id: 'c-11426-2',
        type: 'feature',
        scope: 'Enterprise Lifecycle SOPs (Git, Branching, Workflow & Checklist)',
        description: 'Menetapkan SOP resmi pembuatan git branch fitur/bug, pesan commit konvensional, alur kerja dari awal sampai akhir, dan tata cara klaim checklist ongoing.'
      },
      {
        id: 'c-11426-3',
        type: 'improvement',
        scope: '6 Microservices Architecture Compliance & Mandates',
        description: 'Merumuskan aturan wajib dan larangan spesifik untuk masing-masing 6 microservices guna mencegah regresi arsitektur dan kebocoran keamanan.'
      }
    ]
  },
  {
    version: 'v1.14.25',
    releaseDate: '19 Oktober 2026',
    title: 'Integrasi Paijo sebagai Karyawan Internal (PM & QA/QC Specialist) & 5 Task Checklist Jaminan Kualitas (Total 50 Tasks Ongoing)',
    summary: 'Meresmikan Paijo (AI Agent) sebagai salah satu karyawan inti di tim HeroCMS yang memegang peran ganda: Lead Project Management (PM) dan Quality Assurance & Quality Control (QA & QC), melengkapi Paijo dengan 5 task checklist jaminan kualitas mandiri (Playwright E2E Regression, Sprint Backlog & DoD Gatekeeper, Cross-Service Security Pentest, OpenAPI Contract Verifier, dan Core Web Vitals Auditing), meningkatkan total task bisnis menjadi 50 tasks (100% ongoing), serta memperbarui matriks 6 divisi dan 6 microservices.',
    author: 'HeroCMS Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'c-11425-1',
        type: 'feature',
        scope: 'Paijo Internal Employee Roster & Dual PM-QA/QC Role',
        description: 'Mengukuhkan status Paijo sebagai karyawan internal penanggung jawab Project Management dan QA & QC di SKILL.md, TASK_CHECKLIST.md, dan Mission Control portal.'
      },
      {
        id: 'c-11425-2',
        type: 'feature',
        scope: '5 Dedicated QA & QC Tasks Suite (Total 50 Tasks Ongoing)',
        description: 'Menambahkan 5 task checklist granular khusus untuk Paijo (TSK-QA-01 hingga TSK-QA-05) dengan status 100% ongoing, mencakup E2E browser regression, gatekeeping Definition of Done, audit pentest, verifikasi kontrak API, dan benchmark Web Vitals.'
      },
      {
        id: 'c-11425-3',
        type: 'improvement',
        scope: '6 Divisions & 6 Microservices Synchronization',
        description: 'Menyelaraskan filter pill, selector persona, dan telemetri portal menjadi 6 Divisi (Rizal, Irgi, Andalusia, Risqi, Tyno, Paijo) dan 6 Microservices (01 Admin, 02 Studio, 03 Orchestrator, 04 Marketing, 05 AI Agent, 06 Mobile).'
      }
    ]
  },
  {
    version: 'v1.14.24',
    releaseDate: '19 Oktober 2026',
    title: 'Pemisahan Matriks Tugas Berdasarkan 6 Microservices & Dual-Grouping Mode (Divisi & Services)',
    summary: 'Menyediakan pemisahan matriks pekerjaan bisnis berdasarkan 6 layanan microservices arsitektur HeroCMS (01-admin-console, 02-dashboard-cms, 03-provision-orchestrator, 04-marketing-site, 05-ai-agent-service, 06-mobile-companion) di samping pengelompokan 5 divisi keahlian tim, menambahkan toggle switcher interaktif dan tab navigasi khusus per-service di portal Mission Control, serta menyinkronkan TASK_CHECKLIST.md.',
    author: 'HeroCMS Dev / Paijo AI Agent (PM)',
    items: [
      {
        id: 'c-11424-1',
        type: 'feature',
        scope: 'Dual-Mode Task Grouping (Division & Service)',
        description: 'Menambahkan tombol pengalih (toggle) dan tab navigasi mandiri untuk melihat 45 tugas bisnis terkelompok berdasarkan 5 Divisi Tim atau berdasarkan 6 Microservices.'
      },
      {
        id: 'c-11424-2',
        type: 'feature',
        scope: '6 Microservices Architecture Granular Mapping',
        description: 'Memetakan seluruh 45 task ke dalam 6 direktori service: Service 01 Admin Console (4 tasks), Service 02 Studio & BFF (29 tasks), Service 03 Orchestrator & Infra (6 tasks), Service 04 Marketing Site (1 task), Service 05 AI Agent Service (3 tasks), dan Service 06 Mobile Companion (2 tasks).'
      },
      {
        id: 'c-11424-3',
        type: 'improvement',
        scope: 'Interactive Service Filter Pills & Dynamic Metadata',
        description: 'Menghadirkan pil filter per-service (01 Admin, 02 Studio, 03 Orchestrator, 04 Marketing, 05 AI Agent, 06 Mobile) dengan informasi direktori path, tech stack, dan PIC penanggung jawab service.'
      }
    ]
  },
  {
    version: 'v1.14.23',
    releaseDate: '19 Oktober 2026',
    title: 'Penataan Roster 5 Anggota Tim, Eliminasi Kartu Pelaksana & Kamus Arsitektur Ramah Pengguna',
    summary: 'Memperbarui profil keahlian 5 anggota tim inti (Andalusia Full Stack Lead jago BE & FE, Irgi Frontend Web Specialist, Risqi Database Management Specialist, Rizal DevOps/Security & Rancang Bangun Awal, Tyno Mobile Specialist) serta menegaskan peran Paijo AI sebagai Active Project Manager, menghapus kartu Pelaksana Aktif dari telemetri, dan memaparkan seluruh komponen arsitektur sistem ke dalam istilah teknis yang manusiawi dan mudah dipahami.',
    author: 'HeroCMS Dev / Paijo AI Agent (PM)',
    items: [
      {
        id: 'c-11423-1',
        type: 'improvement',
        scope: 'Team Governance & Active PM Protocol',
        description: 'Menegaskan keahlian 5 anggota tim di SKILL.md, TASK_CHECKLIST.md, dan Mission Control portal: Andalusia (Full Stack Lead), Irgi (Frontend Web), Risqi (Database Management), Rizal (DevOps, Security & Rancang Awal FE/BE), Tyno (Mobile Frontend), dan Paijo AI (Lead Technical PM).'
      },
      {
        id: 'c-11423-2',
        type: 'improvement',
        scope: 'Telemetry Grid & Clean Overview',
        description: 'Menutup / menghapus kartu telemetri Dikerjakan Aktif (Pelaksana) dari portal Mission Control dan menyajikan 4 kartu telemetri berimbang: Total Task Bisnis (45), Status 100% Ongoing, Cakupan 6 Area Microservices, dan Tim Pelaksana & Handover.'
      },
      {
        id: 'c-11423-3',
        type: 'feature',
        scope: 'Friendly Architecture Dictionary',
        description: 'Menulis ulang seluruh entri kamus arsitektur di index.html dan dokumentasi teknis ke dalam bahasa yang komunikatif, ramah, dan mudah dipahami tanpa mengurangi ketelitian teknis.'
      }
    ]
  },
  {
    version: 'v1.14.22',
    releaseDate: '19 Oktober 2026',
    title: 'Restorasi Matriks 45 Task Granular, Eliminasi Metrik Kesiapan Sprint & Tracking Handover Tim (Pelaksana: Rizal)',
    summary: 'Memulihkan kelengkapan matriks seluruh task bisnis menjadi 45 task granular mencakup 12 modul Studio dan 5 services microservices HeroCMS, menghapus metrik estimasi kesiapan rilis sprint, menetapkan status seluruh task menjadi 100% ONGOING (proses real berjalan), mendokumentasikan Rizal sebagai pelaksana aktif pembenahan tampilan (seluruh item UI dicentang pada checklist), serta memetakan rencana serah terima (handover) ke rekan tim sesuai jobdesk spesifik (Andalusia, Irgi, Risqi, Tyno, Rizal).',
    author: 'HeroCMS Dev (Rizal) / Paijo AI Agent',
    items: [
      {
        id: 'c-11422-1',
        type: 'improvement',
        scope: 'Task Matrix & Granular Coverage',
        description: 'Menyajikan seluruh 45 task bisnis riil yang mencakup 12 modul Studio dan seluruh services microservices di docs/project-management/index.html dan TASK_CHECKLIST.md tanpa terpotong.'
      },
      {
        id: 'c-11422-2',
        type: 'improvement',
        scope: 'Telemetry & Sprint Metric Removal',
        description: 'Menghapus kartu telemetri Kesiapan Rilis Sprint (Jujur) sesuai instruksi karena pekerjaan terus berkembang, dan menggantikannya dengan metrik transparansi task ongoing, pelaksana aktif (Rizal), dan target handover.'
      },
      {
        id: 'c-11422-3',
        type: 'feature',
        scope: 'Interactive Checklist UI Status & Handover Tracking',
        description: 'Menegakkan status 100% ONGOING pada seluruh task, menandai item pembenahan tampilan UI sebagai [SELESAI] / dicentang pada checklist, dan memetakan target serah terima ke Andalusia (BE), Irgi (FE), Risqi (DB), dan Tyno (Mobile).'
      }
    ]
  },
  {
    version: 'v1.14.21',
    releaseDate: '19 Oktober 2026',
    title: 'Ekspansi Peran Rizal ke Tim Backend Engineering (DevOps, Security & Backend Lead)',
    summary: 'Memperluas matriks penugasan resmi Rizal untuk mencakup pengembangan backend Go BFF (autentikasi middleware JWT, rate limiting, security handlers) bersama Andalusia, serta memperbarui Mission Control persona filter, SOP, dan dataset runbook di seluruh repositori.',
    author: 'HeroCMS Dev / Paijo AI Agent',
    items: [
      {
        id: 'c-11421-1',
        type: 'improvement',
        scope: 'Team Governance & Backend Ownership',
        description: 'Memperbarui penetapan peran Rizal menjadi DevOps, Security & Backend Specialist di SKILL.md, TASK_CHECKLIST.md, KAMUS_DAN_SOP_HEROCMS.md, dan index.html.'
      },
      {
        id: 'c-11421-2',
        type: 'feature',
        scope: 'Go BFF Auth & Security Middleware Task',
        description: 'Menambahkan task TSK-BE-SEC-01 ke antrean pengerjaan Rizal mencakup implementasi JWT ED25519 asymmetric verification dan Redis memory bucket rate-limiting.'
      }
    ]
  },
  {
    version: 'v1.14.20',
    releaseDate: '19 Oktober 2026',
    title: 'Transformasi Portal Mission Control ke Reader View Artikel Teknis, Pengelompokan Divisi & Mode Fokus Petugas',
    summary: 'Merombak arsitektur antarmuka docs/project-management/index.html dari modal dialog ringkas menjadi Dedicated Technical Article Reader View (mengikuti standar Reader Mode HeroCMS Studio), menambahkan fitur pengelompokan task berbasis divisi tim (DevOps & Security, Frontend Web, Backend & Fullstack, Database, Mobile), mengintegrasikan Mode Fokus Petugas ("Sedang Melihat Sebagai..."), menyajikan checklist interaktif bertahap, serta mengkalibrasi ulang metrik kesiapan sprint menjadi rasio realistis (fokus aktif pada 02-dashboard-cms dan 04-marketing-site).',
    author: 'HeroCMS Dev / Paijo AI Agent',
    items: [
      {
        id: 'c-11420-1',
        type: 'feature',
        scope: 'Technical Article Reader View Architecture',
        description: 'Membangun antarmuka baca artikel teknis 2 kolom dengan diagram alur arsitektur, checklist interaktif yang dapat dicentang langsung, dan mockup terminal kode macOS.'
      },
      {
        id: 'c-11420-2',
        type: 'improvement',
        scope: 'Division Grouping & User Persona Switcher',
        description: 'Menambahkan pengelompokan kartu per divisi dan dropdown pemilih profil pengguna agar setiap anggota (terutama Rizal) langsung tahu apa yang harus dikerjakan tanpa kebingungan.'
      },
      {
        id: 'c-11420-3',
        type: 'improvement',
        scope: 'Realistic Sprint Readiness Calibration',
        description: 'Mengkalibrasi ulang persentase kesiapan rilis menjadi 18% untuk mencerminkan fase fondasi aktif pada 02-dashboard-cms dan 04-marketing-site.'
      }
    ]
  },
  {
    version: 'v1.14.19',
    releaseDate: '19 Oktober 2026',
    title: 'Penjabaran Matriks 36 Task Granular 12 Modul Studio & Katalog Kontrak API Microservices',
    summary: 'Menjabarkan secara mendalam 36 task teknis berbasis 12 modul resmi di services/02-dashboard-cms dan hubungannya ke seluruh microservices (01-admin, 03-provision, 04-marketing, 05-ai-agent, Mobile). Menyusun model bisnis SaaS terukur (4 vertikal blueprint), katalog spesifikasi API BFF, serta memperbarui Mission Control portal dengan dataset granular.',
    author: 'HeroCMS Dev / Paijo AI Agent',
    items: [
      {
        id: 'c-11419-1',
        type: 'improvement',
        scope: 'Granular Service Task Matrix',
        description: 'Menyusun rincian tugas teknis mendalam per-petugas (Andalusia, Irgi, Risqi, Rizal, Tyno) di docs/project-management/TASK_CHECKLIST.md untuk seluruh 12 modul Studio.'
      },
      {
        id: 'c-11419-2',
        type: 'feature',
        scope: 'Core API Specification Catalog',
        description: 'Mendokumentasikan kontrak API BFF lengkap (/auth, /containers, /sites/blocks, /media, /telemetry) dan log pengerjaan di docs/KAMUS_DAN_SOP_HEROCMS.md.'
      },
      {
        id: 'c-11419-3',
        type: 'improvement',
        scope: 'Interactive Mission Control Portal Sync',
        description: 'Memperbarui dataset di docs/project-management/index.html dengan 36 tugas terperinci sehingga telemetri kesiapan rilis dan filter modul sinkron 100%.'
      }
    ]
  },
  {
    version: 'v1.14.18',
    releaseDate: '19 Oktober 2026',
    title: 'Portal Interaktif HeroCMS Mission Control, Kamus Arsitektur & Skill SOP Tim',
    summary: 'Menerbitkan portal interaktif mandiri HeroCMS Mission Control berbasis web (docs/project-management/index.html) dengan tema Studio resmi, meluncurkan Buku Kamus Arsitektur & SOP Pengerjaan Lengkap (docs/KAMUS_DAN_SOP_HEROCMS.md), serta meresmikan Master Skill .agents/skills/herocms-team-governance-and-sop sebagai rujukan permanen seluruh anggota tim dan AI Agent.',
    author: 'HeroCMS Dev / Paijo AI Agent',
    items: [
      {
        id: 'c-11418-1',
        type: 'feature',
        scope: 'Interactive Mission Control Portal',
        description: 'Membangun aplikasi portal HTML mandiri dengan telemetri kesiapan rilis, papan tugas dengan filter petugas & pencarian real-time, tab kamus arsitektur, dan modal detail DoD.'
      },
      {
        id: 'c-11418-2',
        type: 'feature',
        scope: 'Master Architecture & SOP Bible',
        description: 'Menerbitkan docs/KAMUS_DAN_SOP_HEROCMS.md yang memuat glosarium teknis (RLS, cgroups v2, Traefik dynamic labels, ZSET, dll) serta runbook SOP pengerjaan per-divisi.'
      },
      {
        id: 'c-11418-3',
        type: 'improvement',
        scope: 'AI Team Governance Skill',
        description: 'Menambahkan skill resmi .agents/skills/herocms-team-governance-and-sop untuk memandu tata kelola tim dan standar pengerjaan kode.'
      }
    ]
  },
  {
    version: 'v1.14.17',
    releaseDate: '19 Oktober 2026',
    title: 'Pembagian Divisi Bisnis Enterprise & Inisiasi Task Checklist PM (Paijo AI Agent)',
    summary: 'Mendefinisikan matriks penugasan dan roadmap divisi bisnis lintas tim (Andalusia: Fullstack, Irgi: Frontend Web, Risqi: Database Management, Rizal: DevOps & Security, Tyno: Mobile Companion App) serta menginisiasi Single Source of Truth manajemen proyek berbasis Git di docs/project-management/TASK_CHECKLIST.md di bawah koordinasi Paijo AI Agent.',
    author: 'HeroCMS Dev / Paijo AI Agent',
    items: [
      {
        id: 'c-11417-1',
        type: 'improvement',
        scope: 'Project Management & Team Governance',
        description: 'Membentuk dokumen living task checklist terstruktur di docs/project-management/TASK_CHECKLIST.md untuk melacak backlog, KPI, dan protokol pelaporan tim.'
      },
      {
        id: 'c-11417-2',
        type: 'improvement',
        scope: 'Multi-Division Roster & Architecture Mapping',
        description: 'Memetakan tanggung jawab teknis, mitigasi bottleneck, dan dependensi API contracts untuk 5 anggota tim inti pada skala bisnis SaaS.'
      }
    ]
  },
  {
    version: 'v1.14.16',
    releaseDate: '19 Oktober 2026',
    title: 'Pemisahan Suite Pentest Modular Per-Service (services/<service>/pentest/)',
    summary: 'Menata ulang seluruh suite pengujian penetrasi (pentest) dari root monorepo menjadi modular per-service di dalam direktori masing-masing layanan (contoh: services/02-dashboard-cms/pentest/). Dengan pemisahan ini, setiap modul memiliki domain pengujian keamanan yang terisolasi, mandiri, dan rapi sesuai batasan tanggung jawab servisnya.',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-11416-1',
        type: 'improvement',
        scope: 'Per-Service Pentest Architecture',
        description: 'Memindahkan dan mengisolasi berkas pentest ke subfolder pentest/ pada masing-masing service (02-dashboard-cms, 03-provision-orchestrator, 04-marketing-site, 05-ai-agent-service).'
      },
      {
        id: 'c-11416-2',
        type: 'improvement',
        scope: 'Pentest Runner Skill & Standards Update',
        description: 'Memperbarui skill herocms-pentest-runner dan AGENTS.md Bagian 9 untuk mendukung eksekusi verifikasi keamanan per-service.'
      }
    ]
  },
  {
    version: 'v1.14.15',
    releaseDate: '19 Oktober 2026',
    title: 'Integrasi Skill Pentest Pre-Commit & Audit Keamanan Mandatori Sebelum PR',
    summary: 'Menambahkan skill resmi herocms-pentest-runner (.agents/skills/herocms-pentest-runner) dan menetapkan Bagian 9 pada AGENTS.md mengenai standar audit keamanan mandatori. Setiap pengembang dan AI Agent diwajibkan menjalankan rangkaian pengujian pentest black-box HTTP di direktori pentest/ sebelum melakukan git commit atau membuka Pull Request.',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-11415-1',
        type: 'feature',
        scope: 'Pre-Commit & Pre-PR Pentest Skill',
        description: 'Membuat modul skill herocms-pentest-runner yang memandu eksekusi otomatis audit Traefik injection, Redis injection, brute-force auth, dan path traversal.'
      },
      {
        id: 'c-11415-2',
        type: 'improvement',
        scope: 'AGENTS.md Mandatory Security Standard',
        description: 'Menambahkan aturan Section 9 pada AGENTS.md yang mewajibkan status 100% PASS pada suite pentest sebelum kode di-push dan di-merge ke main.'
      }
    ]
  },
  {
    version: 'v1.14.14',
    releaseDate: '19 Oktober 2026',
    title: 'Isolasi Rangkaian Uji & Pentest ke Direktori Terpusat pentest/',
    summary: 'Memisahkan seluruh berkas pengujian penetrasi (pentest) dan unit test (*_test.go) dari direktori kode produksi (services/*) ke direktori root pentest/ terisolasi. Penataan ini memastikan kode aplikasi tetap bersih, rapi, dan modular tanpa mencampurkan skrip pengujian internal ke dalam pohon berkas implementasi layanan.',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-11414-1',
        type: 'improvement',
        scope: 'Test Suite & Pentest Folder Segregation',
        description: 'Memindahkan 12 berkas *_test.go dari 02-dashboard-cms, 03-provision-orchestrator, 04-marketing-site, dan 05-ai-agent-service ke struktur pentest/ terpusat.'
      },
      {
        id: 'c-11414-2',
        type: 'improvement',
        scope: 'Pentest Documentation & Architecture Hygiene',
        description: 'Menambahkan pentest/README.md sebagai panduan arsitektur pengujian dan pemetaan terhadap laporan audit QC_AND_PENTEST_REPORT.md.'
      }
    ]
  },
  {
    version: 'v1.14.13',
    releaseDate: '18 Oktober 2026',
    title: 'Fix Code Block Background Leak & Upgrade to Ray.so / VS Code Terminal Editor Styling',
    summary: 'Memperbaiki dan meningkatkan tampilan cuplikan kode di Reader Mode artikel: (1) Memperbaiki selector CSS inline code (.reader-prose-body code) yang sebelumnya bocor ke dalam blok <pre><code> sehingga menghasilkan highlight putih/abu-abu yang mengganggu di balik baris teks; (2) Merombak kartu kode (.reader-code-card) menjadi antarmuka terminal/editor modern setara Ray.so dan VS Code: tab file aktif dengan ikon FileCode, language badge GO 1.22, gutter nomor baris digital (01-04), palet syntax highlighting Tokyo Night / One Dark Pro, dan status footer real-time dengan pulsing live dot Redis counter.',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-11413-1',
        type: 'bugfix',
        scope: 'Code Snippet Inline Background Isolation',
        description: 'Mengisolasi selector .reader-prose-body :not(pre) > code agar tidak merusak elemen code di dalam kartu editor gelap.'
      },
      {
        id: 'c-11413-2',
        type: 'improvement',
        scope: 'Ray.so / VS Code Editor Aesthetics with Gutter Numbers',
        description: 'Menambahkan gutter line numbers, tab file aktif berikon FileCode, badge bahasa GO 1.22, dan footer status telemetri latensi 0.3ms.'
      }
    ]
  },
  {
    version: 'v1.14.12',
    releaseDate: '18 Oktober 2026',
    title: 'Stunning Executive Editorial Reader Experience (Obsidian Ambient Glow, Watermark, & Telemetry Tiles)',
    summary: 'Merombak tampilan Reader Mode artikel editorial menjadi sangat memukau (eye-catching), modern, dan berkelas enterprise APM (Vercel / Linear / Stripe Press Grade): (1) Banner Hero Obsidian dengan ambient radial glow biru royal (#2563eb) dan indigo, kisi dot-matrix halus, watermark ikon transparan 96px di pojok kanan atas, serta tipografi judul tebal 2.25rem putih elegan; (2) Kartu artikel utama dengan border berkelas, callout URL publik interaktif bergradasi hijau-biru dengan tombol "Buka Tab Baru" dan "Salin URL", serta nomor bab berseri (01, 02, 03) dengan badge gradasi biru modern; (3) Sidebar inspektor dengan kartu telemetri edge real-time beraksen 4 mini tiles taktil lengkap dengan watermark ikon transparan berwarna semantik (Eye, Zap, Sparkles, Cpu), serta launchpad aksi cepat (Buka Halaman Live & Sunting Dokumen).',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-11412-1',
        type: 'improvement',
        scope: 'Executive Obsidian Editorial Hero Banner',
        description: 'Menerapkan kanvas hero obsidian mendalam dengan ambient radial glow, watermark BookOpen 96px transparan, avatar verified badge, dan glowing glass KPI pills.'
      },
      {
        id: 'c-11412-2',
        type: 'improvement',
        scope: 'Interactive Live Ingress URL Callout & Badges',
        description: 'Menyematkan bar URL live bergradasi dengan status HTTPS/HTTP3, tombol aksi satu klik, dan penomoran bab 01-03 beraksen gradasi biru royal.'
      },
      {
        id: 'c-11412-3',
        type: 'improvement',
        scope: 'Tactile Watermark Telemetry Tiles in Sidebar',
        description: 'Mendesain ulang grid telemetri sidebar menjadi 4 mini tiles taktil dengan efek hover elevasi dan watermark ikon berwarna semantik.'
      }
    ]
  },
  {
    version: 'v1.14.11',
    releaseDate: '18 Oktober 2026',
    title: 'Fix Teleport Viewport Backdrops, Reader View Text Contrast, and Navigation Redundancies',
    summary: 'Memperbaiki 4 masalah visual dan fungsional penting: (1) Membungkus seluruh modal (DNS Propagation Tester, SSL X.509 Inspector di Custom Domains, serta Content Editor Modal di Artikel & Halaman) dengan Teleport to="body" sehingga efek backdrop blur menutupi 100% viewport layar secara merata melintasi sidebar dan top bar tanpa terpotong di content area; (2) Memperbaiki kontras tipografi judul (.reader-page-title), profil penulis, tanggal, dan metrik pill pada reader view editorial agar tampil tajam dan elegan dengan warna teks gelap (#0f172a) di atas kartu putih; (3) Memperbaiki resolver hostname URL artikel publik live (getArticleLiveUrl) agar selalu menghasilkan domain/subdomain FQDN yang valid tanpa spasi nama kontainer; (4) Menghapus duplikasi tombol navigasi kembali ganda di topbar dan sidebar saat mode pembaca aktif.',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-11411-1',
        type: 'bugfix',
        scope: 'Modal Viewport Backdrop Teleportation',
        description: 'Membungkus dialog modal di Custom Domains dan Content Articles dengan Teleport to="body" agar backdrop overlay menutupi seluruh layar secara penuh dan konsisten.'
      },
      {
        id: 'c-11411-2',
        type: 'bugfix',
        scope: 'Editorial Reader View Typography & Contrast',
        description: 'Mengatasi warna teks putih pada hero reader view kartu putih (.reader-editorial-hero), menjadikan judul artikel, nama penulis, tanggal, dan metrik telemetri tajam dengan kontras optimal.'
      },
      {
        id: 'c-11411-3',
        type: 'bugfix',
        scope: 'Dynamic Article Live FQDN Resolution',
        description: 'Menyematkan helper getArticleLiveUrl untuk meresolusi hostname target kontainer secara dinamis, mencegah kemunculan spasi pada URL publik.'
      },
      {
        id: 'c-11411-4',
        type: 'improvement',
        scope: 'Reader Mode Single Navigation Standard',
        description: 'Mengharmonisasi tata letak navigasi mode baca sesuai mandat AGENTS.md dengan menghilangkan duplikasi tombol kembali dan tautan ganda di top bar.'
      }
    ]
  },
  {
    version: 'v1.14.10',
    releaseDate: '18 Oktober 2026',
    title: 'Harmonize Telemetry Card Typography, Badges, and Structure Across All Studio Modules',
    summary: 'Menyelaraskan tipografi, struktur HTML, dan styling kartu telemetri di Custom Domains dan Media Assets (DAM) agar 100% konsisten dengan kartu telemetri Situs & Kontainer. Menghapus variasi font kustom dan inline monospace, menerapkan kelas standar master (.telemetry-card, .telemetry-val, .telemetry-denom, .badge-online, .badge-growth-pill, dan .telemetry-sub .pulse-mini-dot), serta memastikan hierarki teks, ukuran font 1.75rem, bobot 800, dan padding kartu tampil presisi tanpa perbedaan.',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-11410-1',
        type: 'bugfix',
        scope: 'Custom Domains & Media Assets Telemetry Typography',
        description: 'Menstandarkan hierarki tipografi nilai metrik, satuan pembagi (.telemetry-denom), pill badge status (.badge-online / .badge-growth-pill), dan subtitle ready-state agar identik dengan kartu telemetri Kontainer.'
      },
      {
        id: 'c-11410-2',
        type: 'improvement',
        scope: 'Master Grid Uniformity in Media Assets DAM',
        description: 'Mengintegrasikan Media Assets ke .stats-overview-grid dan .telemetry-card standar, menghapus penyesuaian CSS terpisah untuk menjaga konsistensi tampilan lintas modul.'
      }
    ]
  },
  {
    version: 'v1.14.9',
    releaseDate: '18 Oktober 2026',
    title: 'Custom Domains Polish: Multi-PoP Anycast Diagnostic Modal, SSL X.509 Inspector, and Typography Fixes',
    summary: 'Menyempurnakan modul Custom Domain & Edge DNS Ingress: memperbaiki tipografi metrik telemetri atas (.telemetry-val) sehingga teks nilai dan badge tidak menempel, menyematkan watermark pojok kanan atas 58px berwarna semantik (blue, emerald, purple, sky), menambahkan validasi live FQDN format domain secara real-time, tombol "Salin DNS" 1-klik format zone file, modal interaktif inspeksi propagasi DNS 14 node Anycast global (Jakarta, Singapura, Tokyo, San Jose, Frankfurt, Sydney), serta modal inspeksi sertifikat SSL X.509 TLS v1.3 Let\'s Encrypt.',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-1149-1',
        type: 'bugfix',
        scope: 'Custom Domains Telemetry Spacing & Watermarks',
        description: 'Memperbaiki layout flex pada .telemetry-val agar angka metrik dan badge status memiliki jarak bernafas ideal (gap: 8px) dan menyematkan ikon watermark 58px beraksen warna.'
      },
      {
        id: 'c-1149-2',
        type: 'feature',
        scope: 'Global Anycast PoP DNS Live Inspector Modal',
        description: 'Menambahkan modal interaktif untuk simulasi kueri dan inspeksi propagasi DNS CNAME/A Record ke 6 node global utama dengan indikator latency TTFB dan status PASS.'
      },
      {
        id: 'c-1149-3',
        type: 'feature',
        scope: 'SSL X.509 Certificate Inspector & One-Click Zone Export',
        description: 'Menambahkan modal inspeksi sertifikat SSL Let\'s Encrypt (Common Name, SANs, cipher, auto-renewal) dan tombol ekspor salin semua record DNS ke clipboard.'
      }
    ]
  },
  {
    version: 'v1.14.8',
    releaseDate: '18 Oktober 2026',
    title: 'Enlarged & Prominent Telemetry Cards with Enhanced Typography and Status Footers',
    summary: 'Memperbesar proporsi dan kehadiran visual kartu telemetri di seluruh dashboard, khususnya pada modul Media Assets DAM (.dam-mini-stat-card) dan modul-modul studio (.telemetry-card). Meningkatkan ukuran font angka nilai menjadi 1.65rem–1.75rem, memperluas padding kartu menjadi 18px-22px dengan min-height 122px, memperbesar ikon transparan pojok kanan atas menjadi 58px, serta menyematkan status footer informatif untuk memberikan keseimbangan visual yang sempurna.',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-1148-1',
        type: 'improvement',
        scope: 'DAM Media Assets Module (.dam-mini-stat-card)',
        description: 'Memperbesar ukuran kartu mini stat DAM agar seimbang dengan widget kapasitas storage S3 di sidebar, menampilkan angka metrik besar (1.65rem), badge status aksen, watermark 58px, dan footer telemetri aktif.'
      },
      {
        id: 'c-1148-2',
        type: 'improvement',
        scope: 'Universal Studio Telemetry (.telemetry-card)',
        description: 'Meningkatkan padding kartu (20px 22px 18px), min-height 122px, dan ukuran tipografi angka nilai (.telemetry-val: 1.75rem) agar lebih eye-catching dan kokoh di seluruh layar desktop.'
      }
    ]
  },
  {
    version: 'v1.14.7',
    releaseDate: '18 Oktober 2026',
    title: 'Custom Domain & Edge DNS Ingress: Enterprise Telemetry, Interactive Registrar Guides & Workflow Pipeline',
    summary: 'Merombak total modul Custom Domain & Edge DNS Ingress dengan standar visual HeroCMS Studio terkini: penambahan baris 4 kartu telemetri berikon tunggal transparan pojok kanan atas (Domain Terhubung, Sertifikat TLS 1.3, Edge Ingress Cluster, dan Latensi DNS TTFB), selector registrar interaktif dengan panduan spesifik (Cloudflare, Niagahoster, Domainesia, IDwebhost, Namecheap), alur pipeline 3 langkah konfigurasi DNS, DNS routing workbench berpresisi tinggi dengan one-click copy, serta diagnostik live handshake Traefik edge.',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-1147-1',
        type: 'feature',
        scope: 'Custom Domains Module (.stats-overview-grid)',
        description: 'Menambahkan 4 kartu metrik telemetri modern berikon tunggal transparan di pojok kanan atas untuk pemantauan kuota domain kustom, status SSL Let\'s Encrypt, cluster Anycast edge, dan latensi TTFB.'
      },
      {
        id: 'c-1147-2',
        type: 'improvement',
        scope: 'Connect Domain Hero Card & Registrar Presets',
        description: 'Memperbarui kartu penghubung domain dengan registrar chip interaktif yang memunculkan tips konfigurasi DNS khusus (Cloudflare DNS-only, cPanel Zone Editor, dsb) dan estimasi TTL.'
      },
      {
        id: 'c-1147-3',
        type: 'improvement',
        scope: 'DNS Records Workbench & Traefik Diagnostics',
        description: 'Menyempurnakan kartu domain terhubung dengan DNS record table baru (CNAME & A Record), feedback salin target instan, dan diagnostik protokol TLS 1.3 ALPN / HTTP/2 multiplexing.'
      }
    ]
  },
  {
    version: 'v1.14.6',
    releaseDate: '18 Oktober 2026',
    title: 'Universal Rollout: Single Translucent Corner Watermark Cards across All Dashboard Modules',
    summary: 'Menerapkan desain kartu telemetri minimalis modern secara universal ke seluruh modul dashboard HeroCMS (ContainersModule, MediaAssetsModule, SupportTicketingModule, InvoicesHistoryModule, AnalyticsTelemetryModule, ChangelogModule). Menghilangkan glyph box kecil dan menyematkan satu ikon transparan berwarna berukuran 48px-58px di pojok kanan atas kartu yang responsif saat disentuh (hover), menciptakan konsistensi tema visual yang harmonis di seluruh studio.',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-1146-1',
        type: 'improvement',
        scope: 'Containers & Websites Module (.stats-overview-grid)',
        description: 'Menerapkan kartu telemetri beraksen warna atas dengan ikon tunggal transparan Server, Globe, Activity, dan ShieldCheck di pojok kanan atas.'
      },
      {
        id: 'c-1146-2',
        type: 'improvement',
        scope: 'DAM Media Assets Module (.dam-mini-stat-card)',
        description: 'Merombak 4 kartu stat DAM Media menjadi kartu beraksen dengan watermark transparan Layers, Zap, Globe, dan Server.'
      },
      {
        id: 'c-1146-3',
        type: 'improvement',
        scope: 'Support, Invoices, Analytics, & Changelog Modules',
        description: 'Menstandarkan seluruh modul lainnya dengan kartu telemetri berikon tunggal transparan di pojok kanan atas.'
      }
    ]
  },
  {
    version: 'v1.14.5',
    releaseDate: '18 Oktober 2026',
    title: 'Minimalist Single Translucent Corner Watermark for Telemetry Cards',
    summary: 'Menyederhanakan tampilan kartu telemetri dengan mengeliminasi ikon ganda (menghilangkan glyph box kecil). Kini hanya menggunakan satu ikon besar berukuran 58px transparan berwarna (opacity 20%, hover 38%) yang diposisikan rapi di pojok kanan atas kartu, menciptakan tampilan minimalis, bersih, dan mewah tanpa kesan menumpuk.',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-1145-1',
        type: 'improvement',
        scope: 'Single Top-Right Translucent Icon (.telemetry-corner-watermark)',
        description: 'Menghilangkan glyph box kecil sehingga hanya ada satu ikon tunggal transparan berwarna di pojok kanan atas kartu dengan ukuran 58px.'
      },
      {
        id: 'c-1145-2',
        type: 'improvement',
        scope: 'Focused Top-Right Radial Glow (.telemetry-card.accent-*)',
        description: 'Mengarahkan fokus pendaran gradasi radial ke koordinat 92% 18% untuk menyatu mulus dengan ikon pojok kanan atas.'
      }
    ]
  },
  {
    version: 'v1.14.4',
    releaseDate: '18 Oktober 2026',
    title: 'Contemporary Translucent Telemetry Glyphs & Ambient Watermark Icons',
    summary: 'Meningkatkan estetika kartu telemetri atas menjadi berstandar visual kontemporer (kekinian). Memperbesar glyph ikon menjadi 42x42px dengan ikon 20px berbalut latar transparan berwarna cerah (opacity 11%) dan garis batas halus (opacity 24%). Menghadirkan watermark ikon besar 64px transparan di sudut kanan bawah kartu yang bereaksi dengan rotasi dan perbesaran dinamis saat kartu disentuh, dipadukan dengan ambient radial light di sudut kartu.',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-1144-1',
        type: 'improvement',
        scope: 'Enlarged Translucent Glyphs (.telemetry-glyph)',
        description: 'Memperbesar ukuran wadah glyph menjadi 42x42px dengan ikon 20px, menggunakan background tinted transparan 11% dan border 24% per palet semantik.'
      },
      {
        id: 'c-1144-2',
        type: 'improvement',
        scope: 'Ambient Watermark Icons (.telemetry-watermark)',
        description: 'Menambahkan ikon watermark berukuran 64px semi-transparan (opacity 7%) di latar belakang kartu yang beranimasi membesar dan berputar halus saat dihover.'
      },
      {
        id: 'c-1144-3',
        type: 'improvement',
        scope: 'Radial Ambient Corner Glow (.telemetry-card.accent-*)',
        description: 'Memberikan gradasi radial halus di sudut kanan bawah setiap kartu telemetri untuk kedalaman visual yang mewah tanpa kesan murahan.'
      }
    ]
  },
  {
    version: 'v1.14.3',
    releaseDate: '18 Oktober 2026',
    title: 'Architectural Wireframe Blueprint Cards & Telemetry Grid Elevation',
    summary: 'Merombak tampilan kartu Halaman Statis (CMS Pages) dari blok hitam monoton menjadi Mini-Browser Architectural Blueprint Mockup dengan chrome traffic lights, SSL omnibox address bar, dan visual wireframe layout nyata per arketipe (Hero Landing, About Bio & Timeline, Services Enterprise Grid, Contact Form, Legal Compliance Paper). Menyempurnakan 4 kartu Telemetri di bagian atas dengan aksen warna atas (Royal Blue, Emerald, Purple, Sky), icon glyph berkontras tajam dengan ambient ring, serta tipografi nilai tebal yang eye-catching dan profesional.',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-1143-1',
        type: 'improvement',
        scope: 'Mini-Browser Blueprint Window Mockup (.cms-page-window-mockup)',
        description: 'Menggantikan blok gelap kaku dengan jendela mini-browser realistis berisikan traffic light dots, SSL route bar, dan kanvas preview dot-grid.'
      },
      {
        id: 'c-1143-2',
        type: 'improvement',
        scope: 'Archetype Wireframe Illustrations (.wf-landing, .wf-about, .wf-services, .wf-contact, .wf-legal)',
        description: 'Menerapkan ilustrasi blueprint arsitektural spesifik sesuai tata letak halaman asli, memberikan identitas visual instan tanpa AI-slop.'
      },
      {
        id: 'c-1143-3',
        type: 'improvement',
        scope: 'Telemetry Card Polish & Accent Border Headers (.telemetry-card.accent-*)',
        description: 'Menambahkan aksen warna atas, glyph 32x32px dengan border ambient lembut, dan tipografi 1.55rem tebal berkontras tinggi pada 4 kartu telemetri.'
      },
      {
        id: 'c-1143-4',
        type: 'improvement',
        scope: 'High-End Page Card Actions & Navigation Tags',
        description: 'Menghadirkan tombol aksi primer Edit Halaman berbalut Deep Slate 900 dengan hover Royal Blue, serta badge navigasi navbar dan footer yang kontras.'
      }
    ]
  },
  {
    version: 'v1.14.2',
    releaseDate: '18 Oktober 2026',
    title: 'Senior Staff UI/UX Redesign: High-End Editorial Composition & Device Glass Centerpieces',
    summary: 'Merombak visual kartu editorial menjadi standar industri top-tier (Vercel, Stripe, Linear). Memperbesar proporsi hero visual cover menjadi 175px (aspect ratio 16:9), menambahkan ambient dot matrix grid overlay, floating glassmorphic device badges dengan glowing technical icons, telemetry chip berdenyut live (cgroups v2, Kafka Redis ZSET, Traefik TTFB), dateline metadata terstruktur, tipografi judul ekstra tegas (19px/weight 800/-0.022em), kutipan 3 baris yang bernapas, serta tombol CTA modern dengan ikon ArrowUpRight.',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-1142-1',
        type: 'improvement',
        scope: 'Editorial Cover Architectural Composition (Height 175px & Mesh Matrix)',
        description: 'Meningkatkan proporsi vertikal cover menjadi 175px dengan dot-matrix grid overlay halus dan ambient radial lighting berkarakter kuat.'
      },
      {
        id: 'c-1142-2',
        type: 'improvement',
        scope: 'Glassmorphic Device Badges & Dynamic Telemetry Chips',
        description: 'Menghadirkan centerpiece frosted glass badge 50x50px di tengah cover yang memuat glif teknis bersinar dan micro-pill telemetri dengan pulsing status dot.'
      },
      {
        id: 'c-1142-3',
        type: 'improvement',
        scope: 'Card Typography Hierarchy & Modern Action CTA',
        description: 'Menyempurnakan tipografi dateline, judul berbobot 800, excerpt lapang 3 baris, target container bar terisolasi, profil avatar elegan, dan tombol CTA Baca Artikel dengan ArrowUpRight.'
      }
    ]
  },
  {
    version: 'v1.14.1',
    releaseDate: '18 Oktober 2026',
    title: 'Peningkatan Estetika Visual Editorial 3-Kolom & Palet Teknis Non-Slop',
    summary: 'Menerapkan tata letak seimbang 3 data per baris (3-Column Grid) pada modul Artikel & Halaman Statis untuk memanfaatkan lebar layar secara proporsional. Menambahkan cover header visual berkelas dengan palet tematik teknis terkurasi per kategori (Engineering Deep Slate-Navy, Distributed Systems Indigo-Slate, DevOps Forest-Slate, Security Obsidian, Tutorial Warm Cedar) lengkap dengan watermark glif arsitektur transparan, pill kategori berkontras tajam, dan tombol aksi "Baca" & "Edit" yang ergonomis tanpa efek gradien murah atau AI-slop.',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-1141-1',
        type: 'improvement',
        scope: '3-Column Balanced Grid Layout (.editorial-card-grid & .cms-pages-grid)',
        description: 'Menerapkan grid 3 kolom proporsional pada resolusi desktop sehingga kartu membagi ruang baris secara seimbang tanpa menyisakan ruang kosong lebar.'
      },
      {
        id: 'c-1141-2',
        type: 'improvement',
        scope: 'Architectural Editorial Visual Covers (Non-AI-Slop Palettes)',
        description: 'Menghadirkan top cover header berbobot visual dengan palet warna teknis yang solid dan berkarakter, watermark icon arsitektur halus, serta pratinjau slug URL yang jelas.'
      },
      {
        id: 'c-1141-3',
        type: 'improvement',
        scope: 'Static CMS Pages Blueprint Cover',
        description: 'Menambahkan top cover arsitektural dark-navy dengan rute URL terhighlight, badge layout template terkurasi, dan tombol aksi Edit instan.'
      }
    ]
  },
  {
    version: 'v1.14.0',
    releaseDate: '18 Oktober 2026',
    title: 'Enterprise Dual-Content Engine & Content Studio Editor (Artikel & Halaman Statis)',
    summary: 'Merombak total modul "Artikel & Halaman CMS" menjadi Enterprise Dual-Content Engine yang sesungguhnya. Menghadirkan navigasi tab ganda untuk mengelola Artikel Editorial berkala (Blog Posts) dan Halaman Statis Website (CMS Pages seperti Beranda, Tentang Kami, Layanan, Kontak, Kebijakan Privasi). Mengeliminasi kartu spotlight gradien norak dan menggantinya dengan kartu editorial Ghost/Medium-style yang bersih, menyertakan kartu halaman statis dengan indikator rute URL, layout template, integrasi navigasi navbar/footer, serta menyediakan Content Editor Modal terpadu (Markdown editor, slug generator, dan SEO meta tags) dan mode membaca bebas distraksi (Distraction-Free Reader View).',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-1140-1',
        type: 'feature',
        scope: 'Dual-Content Architecture (Articles & Static CMS Pages)',
        description: 'Menambahkan tab navigasi terpadu untuk memisahkan manajemen Artikel Editorial berkala dengan Halaman Statis website (Pages), lengkap dengan persistensi state dan telemetri adaptif.'
      },
      {
        id: 'c-1140-2',
        type: 'improvement',
        scope: 'Ghost & Medium Editorial Card Aesthetics',
        description: 'Menghapus banner spotlight neon raksasa dan menyajikan desain kartu editorial modern dengan kutipan nyata (excerpt), waktu baca, avatar penulis, metrik views Redis ZSET, dan visual minimalis enterprise.'
      },
      {
        id: 'c-1140-3',
        type: 'feature',
        scope: 'Universal Content Studio Modal Editor',
        description: 'Menyediakan modal editor lengkap untuk membuat dan mengedit Artikel maupun Halaman Statis dengan auto-slug generator, integrasi layout template, toggle navbar/footer, SEO meta description, dan editor Markdown.'
      },
      {
        id: 'c-1140-4',
        type: 'improvement',
        scope: 'Distraction-Free Editorial Reader View',
        description: 'Memperbarui tampilan pembaca artikel dengan tipografi elegan, tombol sunting cepat langsung dari reader, salin tautan live CDN, dan tombol navigasi kembali yang intuitif.'
      }
    ]
  },
  {
    version: 'v1.13.4',
    releaseDate: '18 Oktober 2026',
    title: 'Transformasi Enterprise DAM Inspector Telemetry & Kanvas Bersih',
    summary: 'Menghilangkan widget Dominansi Warna & Kontras agar antarmuka fokus dan profesional, menyederhanakan kanvas switcher ke mode mandiri (Latar Terang, Latar Gelap, Papan Catur), serta merombak panel detail inspector menjadi Enterprise Digital Asset Management (DAM) Hub yang kaya informasi: ekstraksi MIME-type presisi, ukuran byte tepat S3, resolusi & kalkulasi aspek rasio dinamis, integrasi referensi penggunaan konten CMS, checksum integritas SHA-256/ETag, parameter kompresi & cache HTTP, serta tombol sematan cepat (Markdown, HTML, CSS, Direct URL).',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-1134-1',
        type: 'improvement',
        scope: 'DAM Inspector Rail (Enterprise Telemetry & Metadata)',
        description: 'Menyajikan panel spesifikasi teknis lengkap mencakup MIME-Type spesifik, byte presisi, aspek rasio resolusi dinamis, pelacakan referensi artikel/halaman CMS yang menggunakan berkas, dan verifikasi checksum SHA-256.'
      },
      {
        id: 'c-1134-2',
        type: 'improvement',
        scope: 'Media Stage Canvas & Quick Embeds',
        description: 'Menghapus komputasi dominansi warna dan menyederhanakan switcher kanvas menjadi 3 mode praktis tanpa auto-flash, serta menambahkan opsi sematan 1-klik untuk Markdown, tag <img> HTML, dan CSS background-image.'
      }
    ]
  },
  {
    version: 'v1.13.3',
    releaseDate: '18 Oktober 2026',
    title: 'Eliminasi Total Delay Transisi Kategori & Navigasi Folder Instan 0ms',
    summary: 'Menghilangkan latensi dan jeda waktu klik saat berpindah kategori folder DAM (Semua Berkas, Foto & Raster, Vektor SVG, Dokumen PDF, Excel, dsb). Menghapus pembungkus Transition mode="out-in" yang sebelumnya memblokir render konten baru secara serial, menonaktifkan scale bounce delay pada tombol folder aktif, serta menerapkan micro-fade instan 120ms pada kartu media untuk interaksi secepat kilat (0ms input latency).',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-1133-1',
        type: 'performance',
        scope: 'DAM Category Navigation (Zero-Latency Rendering)',
        description: 'Menghilangkan serial leave-then-enter transition delay (mode="out-in") pada grid dan list view sehingga konten baru dirender seketika (0ms) saat kategori folder diklik.'
      },
      {
        id: 'c-1133-2',
        type: 'bugfix',
        scope: 'Folder Button & Card Settle Animation (.dam-folder-item & cardInstantFade)',
        description: 'Menghapus keyframe folderActivePop yang menunda visual feedback pada tab aktif dan menggantinya dengan micro-fade ultra-cepat 120ms tanpa jeda.'
      }
    ]
  },
  {
    version: 'v1.13.2',
    releaseDate: '18 Oktober 2026',
    title: 'Perbaikan Transisi Kategori Galeri & Eliminasi Flash Hitam Modal Inspector',
    summary: 'Memperbaiki masalah animasi duplikasi kartu galeri dan latensi saat pemilihan kategori folder dengan mengganti TransitionGroup keyed dinamis menjadi transisi view terpadu (dam-category-switch, mode="out-in") dengan key stabil. Memperbaiki masalah flash latar belakang hitam sebelum putih pada modal pratinjau SVG dengan menerapkan caching luminansi instan (assetLuminanceCache), fallback awal otomatis light canvas untuk SVG, dan penghapusan delay transisi CSS pada initial mount.',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-1132-1',
        type: 'bugfix',
        scope: 'DAM Modal Inspector (assetLuminanceCache & Instant SVG Theme)',
        description: 'Menghilangkan visual flash background hitam-ke-putih saat modal dibuka dengan menginisialisasi SVG langsung pada theme-light-canvas secara instan dan menyimpan hasil komputasi luminansi ke dalam memori cache.'
      },
      {
        id: 'c-1132-2',
        type: 'bugfix',
        scope: 'Category View Transition (Transition mode="out-in")',
        description: 'Menghapus key dinamis yang memicu duplikasi elemen kartu di dalam CSS Grid, menggantinya dengan transisi kategori yang ringan, cepat (140ms), dan responsif tanpa lag.'
      }
    ]
  },
  {
    version: 'v1.13.1',
    releaseDate: '18 Oktober 2026',
    title: 'Animasi Transisi Staggered Cascade Saat Pergantian Kategori Media',
    summary: 'Menerapkan sistem animasi transisi dinamis bergelombang (staggered cascade wave) menggunakan Vue TransitionGroup dan FLIP physics saat pengguna berpindah antar-kategori folder (Semua Berkas, Foto & Raster, Vektor SVG, Dokumen PDF, dll) maupun saat melakukan filter pencarian. Dilengkapi animasi spring pop pada tombol kategori aktif dan transisi halus pada status kosong.',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-1131-1',
        type: 'improvement',
        scope: 'DAM Media Cards Animation (.dam-card-flip & @keyframes mediaCardCascade)',
        description: 'Menghadirkan efek transisi gelombang masuk berjenjang (stagger delay 45ms) dengan kurva cubic-bezier spring halus saat kategori folder dipilih, menghilangkan pergantian konten yang kaku.'
      },
      {
        id: 'c-1131-2',
        type: 'improvement',
        scope: 'Sidebar Folder Active Pop (@keyframes folderActivePop)',
        description: 'Menambahkan efek micro-animation spring scaling pada tombol kategori folder yang sedang diklik untuk memberikan feedback sentuhan interaktif yang responsif.'
      },
      {
        id: 'c-1131-3',
        type: 'improvement',
        scope: 'List Table Row Cascade (.dam-row-flip & @keyframes mediaRowCascade)',
        description: 'Animasi sliding horizontal halus pada baris tabel saat mode list view aktif dengan stagger index optimal.'
      }
    ]
  },
  {
    version: 'v1.13.0',
    releaseDate: '18 Oktober 2026',
    title: 'Deteksi Otomatis Dominansi Warna & Latar Belakang Kanvas Adaptif Cerdas',
    summary: 'Menambahkan mesin analitik luminansi visual otomatis berbasis HTML5 Canvas sampling dan SVG color inspection. Sistem otomatis mendeteksi rasio warna gelap vs terang pada berkas dengan background transparan (seperti logo Ubuntu hitam atau grafis putih), lalu secara cerdas menyesuaikan latar belakang kanvas pratinjau studio (Auto Terang / Gelap) agar kontras terlihat sempurna. Dilengkapi meteran persentase dominansi warna, HUD status adaptif, dan kontrol toggle 4-mode (Auto, Terang, Gelap, Catur).',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-1130-1',
        type: 'feature',
        scope: 'Visual Luminance Engine (analyzeAssetLuminance)',
        description: 'Implementasi sampling piksel HTML5 Canvas 48x48 offscreen dan inspeksi fill/stroke SVG untuk menghitung persentase luminansi non-transparan secara instan (<5ms) tanpa pembatasan CORS via blob URL streaming.'
      },
      {
        id: 'c-1130-2',
        type: 'feature',
        scope: 'Adaptive Dynamic Studio Canvas (.theme-light-canvas & .theme-dark-canvas)',
        description: 'Otomatis mengaktifkan kanvas Pure Slate dot-grid (#f8fafc) jika objek transparan dominan gelap/hitam (seperti SVG Ubuntu), dan kanvas Deep Slate dot-grid (#0b1120) jika objek dominan putih/terang.'
      },
      {
        id: 'c-1130-3',
        type: 'feature',
        scope: 'Interactive Backdrop Toolbar (.canvas-theme-switcher) & HUD Dominance Pill',
        description: 'Menyediakan tombol segmented toggle (Auto Adaptif, Terang, Gelap, Papan Catur) di pojok panggung, meteran persentase visual di panel spesifikasi, dan floating HUD pill status dominansi warna.'
      }
    ]
  },
  {
    version: 'v1.12.4',
    releaseDate: '18 Oktober 2026',
    title: 'Perbaikan Clickability Checkbox Seleksi Kartu Media Galeri',
    summary: 'Memperbaiki masalah checkbox seleksi kartu media yang tidak dapat diklik akibat tertutup layer glassmorphic hover overlay. Menaikkan z-index checkbox ke level 30 dengan pointer-events aktif, serta mengubah elemen menjadi tombol semantik yang berada di atas layer hover.',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-1124-1',
        type: 'bugfix',
        scope: 'Interactive Multi-Select Checkbox (.media-card-checkbox)',
        description: 'Menaikkan z-index dari 6 ke 30 dengan pointer-events: auto, memindahkan elemen button checkbox setelah layer hover di DOM tree sehingga klik seleksi selalu terpicu tanpa terhalang dock aksi.'
      }
    ]
  },
  {
    version: 'v1.12.3',
    releaseDate: '18 Oktober 2026',
    title: 'Penyesuaian Warna Status Terpilih Kategori Folder Menjadi Deep Slate Hitam',
    summary: 'Mengubah warna status aktif/terpilih pada item navigasi Kategori & Folder sidebar DAM dari warna biru muda menjadi Deep Slate hitam pekat (#0f172a) dengan teks putih bersih, ikon monokrom kontras tinggi, dan counter badge semi-transparan yang selaras dengan tema utama HeroCMS Studio.',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-1123-1',
        type: 'improvement',
        scope: 'DAM Sidebar Navigation (.dam-folder-item.active)',
        description: 'Menerapkan background Deep Slate (#0f172a), warna teks dan icon putih (#ffffff), bayangan halus, serta counter badge bernuansa kontras tinggi saat kategori folder dipilih.'
      }
    ]
  },
  {
    version: 'v1.12.2',
    releaseDate: '18 Oktober 2026',
    title: 'Pelebaran Viewport Imersif Modal Studio Media Inspector (1240px)',
    summary: 'Menaikkan ukuran dialog modal Media Inspector Studio menjadi 1240px (95vw) dengan ketinggian kanvas 640px dan batas resolusi gambar 560px. Memberikan panggung visual sinematik yang megah untuk foto resolusi tinggi dan ilustrasi vektor SVG tanpa rasa sempit di layar desktop lebar.',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-1122-1',
        type: 'improvement',
        scope: 'Studio Modal Dimensions (.modal-dialog-media-studio & .studio-inspector-split)',
        description: 'Memperlebar dialog dari 980px ke 1240px dan mempertinggi layout split-pane dari 520px ke 640px, dengan kolom inspektur 420px dan panggung visual ~800px.'
      },
      {
        id: 'c-1122-2',
        type: 'improvement',
        scope: 'Visual Canvas Max Height (.stage-visual-img)',
        description: 'Menaikkan batas maksimal ketinggian foto/vektor dari 420px ke 560px sehingga gambar resolusi tinggi tampil detail, tajam, dan megah.'
      },
      {
        id: 'c-1122-3',
        type: 'improvement',
        scope: 'Typography & Header Comfort (.studio-modal-name-row)',
        description: 'Memperlebar batas judul berkas menjadi 650px agar nama berkas panjang tidak terpotong elipsis di header.'
      }
    ]
  },
  {
    version: 'v1.12.1',
    releaseDate: '18 Oktober 2026',
    title: 'Pelebaran Kartu Galeri Media Gaya Google Photos & Rendering Vektor SVG',
    summary: 'Memperlebar kartu galeri media pada panggung utama (minmax 340px) dan mempertinggi kanvas pratinjau menjadi 220px seperti tata letak Google Photos / Unsplash. Menghilangkan text wrapping yang canggung pada spesifikasi berkas, serta menambahkan rendering nyata untuk vektor SVG langsung di kartu galeri dengan bayangan kedalaman sinematik.',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-1121-1',
        type: 'improvement',
        scope: 'Expansive Gallery Cards (.media-gallery-grid & .media-preview-canvas)',
        description: 'Menaikkan ukuran minimum kartu dari 240px ke 340px dan ketinggian kanvas pratinjau ke 220px, memberikan visual impact yang lapang dan proporsional layaknya Google Photos.'
      },
      {
        id: 'c-1121-2',
        type: 'improvement',
        scope: 'Card Metadata Clean Row (.media-sub-meta)',
        description: 'Menata ulang baris ukuran berkas, dimensi, dan status CDN Ready ke dalam satu baris fleksibel tanpa pemotongan atau text-wrapping yang terpecah.'
      },
      {
        id: 'c-1121-3',
        type: 'feature',
        scope: 'Direct SVG Vector Thumbnails (.svg-vector-thumb)',
        description: 'Menampilkan berkas ilustrasi dan icon SVG secara nyata di kartu galeri tanpa menggunakan kotak blueprint statis.'
      }
    ]
  },
  {
    version: 'v1.12.0',
    releaseDate: '18 Oktober 2026',
    title: 'Bespoke Split-Pane Media Inspector Studio & Universal SVG Vector Renderer',
    summary: 'Refaktor menyeluruh modal rincian berkas S3 menjadi Split-Pane Studio Media Inspector berstandar Figma dan Cloudflare R2. Menghadirkan panggung pratinjau visual berdinding kanvas ambient dot-grid dengan rendering instan untuk berkas vektor SVG & gambar raster, HUD status resolusi dan kuota S3 di bagian bawah, serta rail inspektur metadata teknis terpadu lengkap dengan fitur 1-klik salin Markdown/HTML embed code untuk CMS editor.',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-1120-1',
        type: 'feature',
        scope: 'Studio Split-Pane Architecture (.modal-dialog-media-studio)',
        description: 'Merombak modal satu kolom yang bertumpuk menjadi tata letak 2-Kolom Split-Pane: Media Viewport Stage di sisi kiri dengan kanvas kontras tinggi, dan Properties Inspector Rail di sisi kanan dengan scroll independen.'
      },
      {
        id: 'c-1120-2',
        type: 'improvement',
        scope: 'Vector & Visual Asset Rendering (MediaAssetsModule.vue)',
        description: 'Memperluas deteksi aset visual (isVisualAsset) sehingga berkas vektor SVG, ilustrasi, dan icon tampil jernih dalam resolusi penuh dengan bayangan kedalaman sinematik di kanvas pratinjau.'
      },
      {
        id: 'c-1120-3',
        type: 'feature',
        scope: 'CMS Quick Embed Snippets (MediaAssetsModule.vue)',
        description: 'Menambahkan fitur salin instan kode sematan Markdown (![alt](url)) dan HTML (<img>) dengan feedback visual real-time untuk mempercepat alur penulisan artikel di CMS.'
      },
      {
        id: 'c-1120-4',
        type: 'improvement',
        scope: 'Header Dock & Direct Actions (.studio-modal-topbar)',
        description: 'Menyediakan bilah aksi cepat di header modal: tombol Buka Berkas di tab baru, Salin URL CDN langsung, pill ekstensi tipe berkas, dan indikator status CDN Edge Traefik v3.'
      }
    ]
  },
  {
    version: 'v1.11.1',
    releaseDate: '18 Oktober 2026',
    title: 'Dedicated Boxed Scrollable Stage Panel untuk Media Assets DAM',
    summary: 'Membungkus galeri kartu media dan tabel ledger berkas ke dalam container viewport independen ber-border bersih (Boxed Viewport Panel) dengan dedicated vertical scrollbar. Memastikan sidebar navigasi, storage meter, ringkasan telemetri, dan bar pencarian/filter tetap tenang dan terkunci di tempat saat pengguna menelusuri katalog aset.',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-1111-1',
        type: 'improvement',
        scope: 'DAM Stage Viewport (.dam-content-scroll-box)',
        description: 'Menambahkan container kotak berbatas halus (#e2e8f0, radius 14px, bayangan lembut) dengan scroll internal yang halus (thin custom scrollbar) dan responsive auto-fill grid untuk kartu aset.'
      },
      {
        id: 'c-1111-2',
        type: 'improvement',
        scope: 'Layout Ergonomics (MediaAssetsModule.vue)',
        description: 'Mengunci posisi bilah aksi, pencarian terpadu, dan batch toolbar di atas viewport media sehingga kontrol filter selalu terlihat tanpa harus menggulir halaman ke atas.'
      }
    ]
  },
  {
    version: 'v1.11.0',
    releaseDate: '18 Oktober 2026',
    title: 'Arsitektur Digital Asset Management (DAM) 2-Kolom & Studio S3 Storage',
    summary: 'Refaktor besar penataan tata letak Media Assets menjadi arsitektur 2-Kolom Digital Asset Management (DAM) modern berdensitas tinggi. Mengintegrasikan S3 Storage Quota Health Hub, navigasi folder/kategori cerdas, compact drag-and-drop uploader di sidebar kiri, strip telemetri mini ringkas, fitur seleksi massal (Batch Multi-Selection) dengan floating action dock, serta galeri media di area panggung utama yang langsung tampil di atas layar tanpa scroll vertikal berlebih.',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-1110-1',
        type: 'feature',
        scope: 'DAM Architecture & Layout (MediaAssetsModule.vue)',
        description: 'Merombak penataan vertikal bertumpuk menjadi 2-Kolom DAM: Sidebar Rail (310px) berisi widget kuota S3, navigasi folder kategori cerdas dengan counter dinamis, dan compact uploader, serta Main Stage yang lapang.'
      },
      {
        id: 'c-1110-2',
        type: 'feature',
        scope: 'Batch Operations & Multi-Select (MediaAssetsModule.vue)',
        description: 'Menyediakan fitur seleksi berkas ganda (checkbox per kartu dan Select All), dilengkapi Floating Batch Action Dock untuk salin semua URL CDN, unduh terpilih, dan hapus massal dari S3 bucket.'
      },
      {
        id: 'c-1110-3',
        type: 'feature',
        scope: 'UI / UX & Dual View Mode (MediaAssetsModule.vue)',
        description: 'Menyediakan tombol pengubah tampilan interaktif antara Galeri Kartu Sinematik (Grid Mode) dan Tabel Ledger Berkas Berstandar Enterprise (List Mode) lengkap dengan thumbnail mini, spesifikasi berkas, dan aksi inline instan.'
      },
      {
        id: 'c-1110-4',
        type: 'improvement',
        scope: 'Master Stylesheet & Compact Metrics (studio-master.css)',
        description: 'Menghadirkan strip telemetri mini 4-kolom kompak di atas panggung utama, Glassmorphic Floating Action Dock, mikro-animasi checkerboard background pada aset transparan, dan optimasi ruang vertikal.'
      }
    ]
  },
  {
    version: 'v1.10.0',
    releaseDate: '18 Oktober 2026',
    title: 'Peluncuran Fitur Enterprise Maintenance Mode (Mode Pemeliharaan)',
    summary: 'Menambahkan kapabilitas Mode Pemeliharaan (Maintenance Mode) terpadu di Dashboard Situs dan Pod Detail Analytics. Memungkinkan pengelola website mengalihkan trafik publik ke pesan pemeliharaan HTTP 503 bersahabat secara instan, dilengkapi badge status semantic Amber, tab filter dedicated, modal konfigurasi estimasi waktu (ETA), dan endpoint API PUT /containers/:id/maintenance.',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-1100-1',
        type: 'feature',
        scope: 'Containers & Sites Hub (ContainersModule.vue)',
        description: 'Menambahkan kontrol toggle Mode Pemeliharaan pada kartu situs dan tabel data, badge status semantic Amber dengan radar pulsing amber, filter tab Pemeliharaan, dan modal dialog konfigurasi pesan kustom serta estimasi durasi pemeliharaan.'
      },
      {
        id: 'c-1100-2',
        type: 'feature',
        scope: 'Pod Detail & Analytics (PodDetailAnalyticsView.vue)',
        description: 'Menyediakan banner peringatan pemeliharaan aktif dengan tombol aksi Go-Live cepat dan status pill telemetri pemeliharaan berstandar Cloudflare & Datadog APM.'
      },
      {
        id: 'c-1100-3',
        type: 'feature',
        scope: 'Backend API & Repository (cmd/server, internal/handler, service, repository)',
        description: 'Menyediakan endpoint PUT /containers/:id/maintenance dengan validasi tenant ID, persistensi status ke basis data/in-memory repository, serta unit test suite komprehensif.'
      }
    ]
  },
  {
    version: 'v1.9.4',
    releaseDate: '18 Oktober 2026',
    title: 'Unit Test Suite Komprehensif & Pengerasan Ketahanan Kode di Seluruh Services',
    summary: 'Penyempurnaan total unit test di seluruh microservices HeroCMS (02-dashboard-cms, 03-provision-orchestrator, 04-marketing-site, 05-ai-agent-service). Memperbaiki potensi nil-pointer dereference, data race pada repository, menambahkan in-memory test mocks instan tanpa TCP dial latency, serta pengujian validasi input, sanitasi regex, dan security headers dengan hasil 100% lulus di seluruh package.',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-194-1',
        type: 'improvement',
        scope: 'Dashboard CMS Backend (services/02-dashboard-cms)',
        description: 'Menambahkan test suite komprehensif di cmd/server, internal/config, handler, middleware, redis, repository, service, dan storage (coverage hingga 93.5%). Memperbaiki nil pointer safety pada S3 client, Redis in-memory mock, dan data race pada invoices repo.'
      },
      {
        id: 'c-194-2',
        type: 'improvement',
        scope: 'Provision Orchestrator (services/03-provision-orchestrator)',
        description: 'Menambahkan pengujian simulasi lifecycle tenant container dan nil pointer checks pada Docker provisioner close dan deploy (coverage 65.4%).'
      },
      {
        id: 'c-194-3',
        type: 'improvement',
        scope: 'Marketing Site (services/04-marketing-site)',
        description: 'Mengekstrak SetupMarketingMux dan menambahkan unit test untuk healthz, enterprise security headers, immutable static cache, dan HTML5 SPA routing fallback (coverage 55.8%).'
      },
      {
        id: 'c-194-4',
        type: 'security',
        scope: 'AI Agent Service (services/05-ai-agent-service)',
        description: 'Memperluas unit test untuk validasi tenant_id injection regex, path validation, AI template generation, telemetry hits, dan security headers (coverage 45.5%).'
      }
    ]
  },
  {
    version: 'v1.9.3',
    releaseDate: '18 Oktober 2026',
    title: 'Penerapan Menyeluruh Standar Keamanan & Arsitektur di Seluruh 5 Services',
    summary: 'Menerapkan standarisasi 20 pilar keamanan, graceful shutdown, healthcheck endpoints, pengerasan non-root container, optimasi bundling Vite, dan pembuatan unit test suite di seluruh microservices: 01-admin-console, 02-dashboard-cms, 03-provision-orchestrator, 04-marketing-site, dan 05-ai-agent-service.',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-193-1',
        type: 'improvement',
        scope: 'Marketing Site (services/04-marketing-site)',
        description: 'Menambahkan endpoint /healthz, graceful shutdown, security headers, dan konfigurasi manualChunks di vite.config.ts.'
      },
      {
        id: 'c-193-2',
        type: 'improvement',
        scope: 'AI Agent Service (services/05-ai-agent-service)',
        description: 'Menambahkan graceful shutdown server, security headers, redis client close cleanup, serta unit test suite di cmd/worker/main_test.go.'
      },
      {
        id: 'c-193-3',
        type: 'security',
        scope: 'Admin Console (services/01-admin-console)',
        description: 'Hardening Dockerfile dengan eksekusi user non-root www-data.'
      },
      {
        id: 'c-193-4',
        type: 'feature',
        scope: 'Provision Orchestrator (services/03-provision-orchestrator)',
        description: 'Penyempurnaan siklus hidup kontainer (Stop, Start, Destroy) dan penambahan unit test pengujian 100% lolos verifikasi.'
      }
    ]
  },
  {
    version: 'v1.9.2',
    releaseDate: '18 Oktober 2026',
    title: 'Eksplorasi Ekosistem skills.sh: Integrasi Playwright E2E Testing & Web Performance Vitals Skill',
    summary: 'Memperluas kapabilitas AI Agent dengan 2 skill operasional modern standar skills.sh: browser-e2e-playwright (pengujian browser otomatis, verifikasi visual modal destruktif, selector a11y-first) dan web-performance-vitals (optimasi Core Web Vitals, code-splitting Vite manualChunks, HTTP cache headers, dan mitigasi N+1 SQL). Seluruh integrasi dikembangkan pada branch mandiri feat/agent-skills-architecture.',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-192-1',
        type: 'feature',
        scope: 'Browser Testing Skill (.agents/skills/browser-e2e-playwright)',
        description: 'Standar pengujian E2E menggunakan Playwright: selector resilient berbasis teks/role, event-driven assertions, dan pengujian responsive mobile.'
      },
      {
        id: 'c-192-2',
        type: 'feature',
        scope: 'Web Performance Skill (.agents/skills/web-performance-vitals)',
        description: 'Standar tolok ukur TTFB, LCP, CLS, dan INP, optimasi vendor chunks di vite.config.ts, dan header caching Traefik/Go server.'
      }
    ]
  },
  {
    version: 'v1.9.1',
    releaseDate: '18 Oktober 2026',
    title: 'Adopsi 20 Pilar Praktis Keamanan Web & Backend serta Modul Skill herocms-security-sandboxing',
    summary: 'Memperkuat arsitektur keamanan platform dengan mendokumentasikan 20 Pilar Praktis Keamanan Web & Backend di SECURITY_AND_SANDBOXING.md serta menambahkan skill herocms-security-sandboxing (.agents/skills/) untuk memandu AI Agent dalam pengerasan kontainer Docker, isolasi multi-tenant, proteksi OWASP Top 10, sanitasi input, dan penegakan credential safety.',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-191-1',
        type: 'security',
        scope: 'Dokumentasi Keamanan (docs/SECURITY_AND_SANDBOXING.md)',
        description: 'Menambahkan Seksi 5 berisi matriks 20 pilar checklist keamanan praktis: proteksi API key, isolasi .env, anti-SQLi, anti-XSS, server-side auth, RLS database, sesi aman, hingga magic bytes upload scanning.'
      },
      {
        id: 'c-191-2',
        type: 'feature',
        scope: 'Security Audit Skill (.agents/skills/herocms-security-sandboxing)',
        description: 'Membuat modul skill baru untuk mengaudit setiap penulisan kode backend/frontend, parameter HostConfig Docker Engine SDK, dan pencegahan kebocoran data multi-tenant.'
      }
    ]
  },
  {
    version: 'v1.9.0',
    releaseDate: '18 Oktober 2026',
    title: 'Integrasi 5 Modul Skill Agen Mandiri (Standar skills.sh): Frontend Studio, Go Orchestrator, Traefik Infra, Database RLS, & Changelog SemVer',
    summary: 'Memperluas kapabilitas agen AI dengan 5 paket standar skill modular (.agents/skills/): herocms-frontend-studio (Zero-CSS duplication & master design tokens), herocms-go-orchestrator (Docker Engine SDK, cgroups quota, & graceful shutdown), herocms-traefik-infra (Traefik v3 dynamic routing & network topology), herocms-database-rls (PostgreSQL Row-Level Security & Redis caching), serta herocms-changelog-semver untuk kepatuhan tata kelola rilis.',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-190-1',
        type: 'feature',
        scope: 'Frontend Studio Skill (.agents/skills/herocms-frontend-studio)',
        description: 'Menetapkan kepatuhan desain DESIGN.md, Zero-CSS duplication di studio-master.css, dan on-demand lazy loading modul antar-menu.'
      },
      {
        id: 'c-190-2',
        type: 'feature',
        scope: 'Go Provisioning Orchestrator Skill (.agents/skills/herocms-go-orchestrator)',
        description: 'Standar idiomatik Golang 1.23, Docker Engine SDK lifecycle, konteks timeout, dan pembatasan isolasi cgroups v2 kontainer tenant.'
      },
      {
        id: 'c-190-3',
        type: 'feature',
        scope: 'Traefik Edge Routing & Infra Skill (.agents/skills/herocms-traefik-infra)',
        description: 'Standarisasi topologi 3 jaringan Docker (app-network, traefik_network, redis-net) dan injeksi label dinamis Traefik v3.'
      },
      {
        id: 'c-190-4',
        type: 'feature',
        scope: 'PostgreSQL Multi-Tenant RLS Skill (.agents/skills/herocms-database-rls)',
        description: 'Pola migrasi SQL dengan Row-Level Security berbasis app.current_tenant_id dan namespacing cache Redis.'
      },
      {
        id: 'c-190-5',
        type: 'feature',
        scope: 'Changelog & SemVer Assistant Skill (.agents/skills/herocms-changelog-semver)',
        description: 'Otomasi kepatuhan Semantic Versioning dan penulisan changelog terstruktur sesuai mandat AGENTS.md.'
      }
    ]
  },
  {
    version: 'v1.8.2',
    releaseDate: '17 Oktober 2026',
    title: 'Modal Konfirmasi Hapus Kontainer (Bespoke Danger Zone Dialog): Menggantikan Native Browser Confirm dengan UI Studio Terpadu',
    summary: 'Menghilangkan native browser confirm() dialog yang kaku pada penghapusan kontainer runtime, digantikan dengan HeroCMS Studio Danger Zone Modal yang elegan: kartu pratinjau pod target, rincian konsekuensi teknis destruktif (penghentian isolasi cgroups v2, pencabutan rute Traefik/SSL, pengembalian slot kuota), dan tombol aksi destruktif dengan status loading.',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-182-1',
        type: 'improvement',
        scope: 'Eliminate Native Browser window.confirm()',
        description: 'Mengganti dialog bawaan browser yang kaku dengan modal konfirmasi interaktif bergaya HeroCMS Studio Design System.'
      },
      {
        id: 'c-182-2',
        type: 'feature',
        scope: 'Bespoke Danger Zone Delete Confirmation Modal',
        description: 'Menampilkan detail lengkap pod yang akan dihapus, ringkasan dampak teknis (cgroups v2, Traefik edge unrouting, pengembalian kuota), serta proteksi aksi dengan tombol destruktif dan loading spinner.'
      }
    ]
  },
  {
    version: 'v1.8.1',
    releaseDate: '17 Oktober 2026',
    title: 'Ekspansi Ukuran Konsol Terminal: Desain Super Lebar (1480px / 95vw), Layar 84vh, dan Tipografi Monospace Nyaman',
    summary: 'Merespons masukan pengguna untuk memperbesar ukuran modal log terminal: memperlebar dialog menjadi 1480px (95vw) dengan tinggi 84vh, tinggi layar konsol ditingkatkan menjadi 540px+, ukuran font monospace dinaikkan menjadi 0.83rem, padding toolbar diperluas, serta mode layar penuh yang kini mencakup 99vw/97vh.',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-181-1',
        type: 'improvement',
        scope: 'Terminal Console Viewport Enlargement (1480px / 95vw)',
        description: 'Memperluas dimensi dialog konsol dari 980px menjadi 1480px (95vw) dan minimum height 84vh agar baris log telemetri dan URL panjang tidak terpotong atau wrap.'
      },
      {
        id: 'c-181-2',
        type: 'improvement',
        scope: 'Output Screen Height & Typography Scaling',
        description: 'Meningkatkan tinggi output screen konsol menjadi 540px+, menaikkan ukuran font baris log ke 0.83rem, serta memperbesar traffic lights dan tombol filter.'
      }
    ]
  },
  {
    version: 'v1.8.0',
    releaseDate: '17 Oktober 2026',
    title: 'Perombakan Total Terminal Log Kontainer: Konsol Pengembang macOS-Style, Filter Interaktif, Line Numbers, dan Auto-Scroll',
    summary: 'Merombak total jendela modal Log Runtime Kontainer menjadi konsol pengembang kelas dunia (setara Railway, Warp, dan Vercel Console): bingkai window macOS dengan traffic lights interaktif (tutup, jeda stream, layar penuh), penghapusan raw UUID digantikan identitas pod bersih ber-SSL, indikator beacon "STREAM LIVE" dengan status pause/resume, bilah filter level layanan (Inbound, Traefik & SSL, Engine, Docker, System) dengan pill counter, kolom line numbers bernomor presisi, pencarian log real-time dengan highlight, pengunduhan file .log fisik, serta sequence animasi live reboot.',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-180-1',
        type: 'feature',
        scope: 'macOS Developer Console Window & Fullscreen Mode',
        description: 'Menyematkan window chrome dengan traffic lights (🔴 tutup, 🟡 jeda, 🟢 fullscreen toggle), mode layar penuh 98vw/94vh, dan identitas pod bersih ber-SSL.'
      },
      {
        id: 'c-180-2',
        type: 'feature',
        scope: 'Interactive Real-Time Log Search & Service Tabs',
        description: 'Menerapkan pencarian log instan dengan tombol clear, tab kategori layanan dengan jumlah baris dinamis, serta dataset log runtime modular di src/data/container-logs.ts.'
      },
      {
        id: 'c-180-3',
        type: 'feature',
        scope: 'Developer Utilities: Auto-Scroll, Log Download & Clear Screen',
        description: 'Menyediakan tombol kendali auto-scroll (ON/OFF), jeda streaming live, unduhan berkas fisik .log, dan pembersihan/pemulihan layar konsol.'
      },
      {
        id: 'c-180-4',
        type: 'improvement',
        scope: 'Line Numbers & High-DPI Obsidian Screen',
        description: 'Menambahkan kolom line number dua digit (01, 02, 03...), service badges warna-warni, penyorotan status kode HTTP, dan kursor terminal berkedip.'
      }
    ]
  },
  {
    version: 'v1.7.1',
    releaseDate: '17 Oktober 2026',
    title: 'Perombakan Filter Bar Log Akses: Segmented Pill Tabs Berikon, Pill Badges Counter, dan Input Search Interaktif',
    summary: 'Merombak tampilan filter log akses pengunjung harian di Detail Kontainer dari tombol mentah menjadi bilah toolbar tingkat enterprise: segmented pills dengan ikon (Globe, Google Search, Media Sosial, Direct), indikator jumlah hit dinamis, input pencarian dengan clear button (X), tombol reset filter, serta empty state interaktif.',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-171-1',
        type: 'improvement',
        scope: 'Segmented Filter Pills with Live Counter Badges',
        description: 'Menerapkan tab segmented modern berperekat halus dengan ikon saluran, penanda active card putih berbayang lembut, dan pill badge jumlah log hit yang real-time.'
      },
      {
        id: 'c-171-2',
        type: 'improvement',
        scope: 'Interactive Clearable Search Input & Reset Button',
        description: 'Menyediakan input pencarian dengan fokus ring biru aksen, tombol hapus pencarian instan (X), dan tombol Reset Filter saat filter aktif atau pencarian menghasilkan 0 baris.'
      }
    ]
  },
  {
    version: 'v1.7.0',
    releaseDate: '17 Oktober 2026',
    title: 'Bespoke CMS Content & Media Analytics Suite: Status Publikasi, Media Library WebP Health, Top Pages Engagement, dan Saluran Pengunjung Organik',
    summary: 'Meluncurkan modul analisis khusus CMS ke dalam Detail Kontainer HeroCMS: menyajikan metrik esensial untuk situs berbasis konten tanpa beban database. Mencakup ringkasan status publikasi (halaman terbit vs draft, validitas /sitemap.xml, latensi purge cache instan 118ms), telemetri penyimpanan media library (rasio konversi WebP 93.8%, bandwidth terhemat, deteksi aset terbesar), proteksi form kontak & anti-spam edge tanpa captcha, tabel peringkat konten terpopuler (views, waktu baca, cache hit %, TTFB), dan visualisasi multi-warna saluran kedatangan pembaca (Google SEO, Media Sosial, Direct, Referral).',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-170-1',
        type: 'feature',
        scope: 'CMS Content Performance & Top Pages Table',
        description: 'Menambahkan tabel interaktif halaman & konten terpopuler lengkap dengan ranking badge, URL path, total pembaca, estimasi waktu baca, cache hit ratio, dan kecepatan buka TTFB.'
      },
      {
        id: 'c-170-2',
        type: 'feature',
        scope: 'Media Library Storage & WebP Optimization Health',
        description: 'Menghadirkan kartu telemetri penyimpanan aset media dengan progress meter kapasitas, persentase konversi otomatis format WebP, penghematan bandwidth, serta audit berkas terbesar.'
      },
      {
        id: 'c-170-3',
        type: 'feature',
        scope: 'Publishing Lifecycle & Edge Purge Latency',
        description: 'Menampilkan status verifikasi sitemap XML, perbandingan halaman terbit vs draft, dan latensi pembersihan cache instan (instant edge cache invalidation) saat konten diperbarui.'
      },
      {
        id: 'c-170-4',
        type: 'feature',
        scope: 'Traffic Acquisition Channels & Form Spam Shield',
        description: 'Menyediakan widget visual saluran kedatangan pengunjung (SEO Google, Sosmed, Direct) serta indikator proteksi formulir kontak dari serangan bot spammer via Traefik edge rate limit.'
      }
    ]
  },
  {
    version: 'v1.6.0',
    releaseDate: '17 Oktober 2026',
    title: 'Integrasi Enterprise Apache ECharts: Grafik Telemetri Edge & Cache Kelas Industri (Cloudflare & Datadog APM Standard)',
    summary: 'Mengadopsi library visualisasi data industri terkemuka Apache ECharts (echarts) ke dalam HeroCMS Dashboard: menggantikan grafik SVG manual dengan engine canvas beresolusi tinggi, cubic hermite spline mulus, shading gradasi area presisi (#2563eb dan #10b981), axisPointer crosshair otomatis, interactive HTML glassmorphic tooltip card, responsive auto-resize via ResizeObserver, transisi animasi halus saat perpindahan timeframe (24 Jam / 7 Hari / 30 Hari), serta optimasi manual vendor chunks di Vite.',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-160-1',
        type: 'feature',
        scope: 'Apache ECharts Engine Integration',
        description: 'Menginstal dan mengintegrasikan pustaka visualisasi data tingkat enterprise Apache ECharts (echarts) dengan pemisahan chunk vendor terpisah di vite.config.ts untuk efisiensi HTTP long-term caching.'
      },
      {
        id: 'c-160-2',
        type: 'improvement',
        scope: 'High-DPI Canvas Antialiasing & Dual Area Gradients',
        description: 'Mengganti SVG rendering manual yang terdistorsi dengan canvas anti-aliasing tajam berskala rasio pixel perangkat (Retina ready), gradasi area linier transparan, dan bayangan garis kurva (drop shadow glow).'
      },
      {
        id: 'c-160-3',
        type: 'feature',
        scope: 'Smart AxisPointer Crosshair & Glassmorphic Tooltip',
        description: 'Menyediakan pelacak koordinat kursor axisPointer otomatis dan kartu tooltip gelap kaca (glassmorphic) yang merinci status edge ingress, cache hit %, origin pass, latensi, dan bandwidth secara interaktif.'
      },
      {
        id: 'c-160-4',
        type: 'performance',
        scope: 'Fluid Timeframe Morphing & ResizeObserver',
        description: 'Menerapkan transisi animasi morfologis halus (700ms cubicOut) saat beralih antara 24 Jam, 7 Hari, dan 30 Hari, serta sinkronisasi otomatis ukuran grafik dengan ResizeObserver.'
      }
    ]
  },
  {
    version: 'v1.5.2',
    releaseDate: '17 Oktober 2026',
    title: 'PaaS Developer Card Overhaul: Railway & Vercel-Style Dynamic Identity, Top Accent Stripe & Live Traffic Sparkline',
    summary: 'Merombak tampilan kartu kontainer di Situs & Kontainer agar dinamis, hidup, dan setara PaaS kelas dunia: menambahkan garis aksen gradasi 3px warna brand container, ambient glow di sudut atas, avatar ikon 44x44 dengan kategori badge, penghapusan raw UUID diganti short pod ID (#pod-000001), kapsul URL modern ber-SSL, widget mini-trend sparkline kurva area trafik 7 hari (+24% growth), gauge meter CPU/RAM presisi, serta toolbar aksi yang rapi.',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-152-1',
        type: 'improvement',
        scope: 'Top Brand Accent Stripe & Ambient Glow',
        description: 'Menyematkan garis aksen atas dinamis berdasarkan warna tema situs (--card-accent) dan radial glow halus saat hover, memberikan identitas visual unik pada setiap kontainer.'
      },
      {
        id: 'c-152-2',
        type: 'feature',
        scope: 'Live Traffic Momentum & Area Sparkline Widget',
        description: 'Menambahkan strip trafik 7 hari dengan mini SVG Area Sparkline curve bergradasi halus dan persentase pertumbuhan (+24%), membuat kartu terlihat aktif dan memancarkan data hidup.'
      },
      {
        id: 'c-152-3',
        type: 'improvement',
        scope: 'Clean Identity & Short Pod ID Tag',
        description: 'Menghapus string UUID panjang yang mengganggu dan menggantinya dengan pod tag rapi (mis. pod-000001) serta badge kategori situs (Portofolio, Bisnis, Publikasi, Edukasi).'
      },
      {
        id: 'c-152-4',
        type: 'improvement',
        scope: 'Pro PaaS Dual Gauges & Unified Action Toolbar',
        description: 'Merapikan bar meter CPU CFS Quota dan RAM memcg dengan ikon dan label yang bersih tanpa underline garis janggal, serta mengelompokkan tombol Editor, Analitik, dan 5 kontrol runtime secara proporsional.'
      }
    ]
  },
  {
    version: 'v1.5.1',
    releaseDate: '17 Oktober 2026',
    title: 'Perombakan Visual Chart Edge & Cache: Industry Standard Catmull-Rom Spline, Y/X-Axis Scale & Scrub Tooltip',
    summary: 'Merombak grafik volume traffic & cache edge Traefik menjadi setara standar visual Cloudflare Analytics & Vercel Web Analytics: menghilangkan titik lingkaran kaku (static circle beads), mengimplementasikan algoritma Catmull-Rom to Cubic Bézier spline dengan bayangan halus (drop shadow glow), skala vertikal Y-axis dinamis (formatted k/M), label horizontal X-axis waktu (WIB), hairline crosshair interaktif, serta floating glassmorphic tooltip yang responsif mengikuti kursor.',
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
