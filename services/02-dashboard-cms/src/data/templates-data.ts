import type { VisualBlock } from '../types/dashboard';

export interface OfficialTemplateItem {
  id: string;
  title: string;
  category: 'portfolio' | 'blog' | 'education' | 'business';
  tier: string;
  priceText: string;
  isPro: boolean;
  desc: string;
  features: string[];
  accentColor: string;
  fontFamily: string;
  defaultRole: string;
  defaultBio: string;
  lighthouseScore: number;
  author?: string;
  rating?: number;
  downloadsCount?: number;
  isFeatured?: boolean;
  tags?: string[];
  layoutType?: string;
  stats: {
    ttfb: string;
    seo: string;
    pwa: string;
  };
  themeConfig: {
    fontFamily: string;
    accentColor: string;
    borderRadius: number;
    bgMode: string;
  };
  blocks: VisualBlock[];
}

export const marketplacePulseMetrics = [
  { id: 'm1', label: 'Situs Ter-Deploy Aktif', value: '3.120+', sub: 'Terisolasi Kontainer RLS', badge: '+18% bln ini' },
  { id: 'm2', label: 'Latensi Respon Edge', value: '1.2ms', sub: 'Traefik v3 HTTP/3 Router', badge: 'Ultra Cepat' },
  { id: 'm3', label: 'Skor Lighthouse Rata-Rata', value: '99.8 / 100', sub: 'Core Web Vitals Sempurna', badge: 'SEO 100%' },
  { id: 'm4', label: 'Blok Visual Modular', value: '48+ Modul', sub: 'Native Drag-and-Drop', badge: 'Zero Bloat' }
];

export const blueprintWorkflowSteps = [
  {
    step: '01',
    badge: 'LANGKAH AWAL',
    title: 'Pilih Blueprint Arsitektur',
    desc: 'Pilih blueprint yang sesuai dengan jenis kebutuhan Anda: portofolio teknis, media blog editorial, pusat edukasi LMS, atau showcase bisnis.'
  },
  {
    step: '02',
    badge: 'KUSTOMISASI',
    title: 'Ubah Visual & Konten Bebas',
    desc: 'Gunakan Visual Editor Studio untuk merombak susunan blok, palet warna, tipografi, konten artikel, atau formulir webhook secara langsung.'
  },
  {
    step: '03',
    badge: 'PROVISIONING',
    title: 'Deploy Mandiri 1-Klik',
    desc: 'Sistem otomatis menyiapkan kontainer terisolasi, rute edge Traefik, dan sertifikat SSL otomatis di domain pilihan Anda.'
  }
];

export const officialTemplatesData: OfficialTemplateItem[] = [
  {
    id: 'tpl_portfolio_pro',
    title: 'Portofolio Teknis & Cloud Engineer',
    category: 'portfolio',
    tier: 'Included in Plan',
    priceText: 'Gratis dalam Kuota',
    isPro: false,
    desc: 'Dirancang untuk software engineer, cloud architect, dan desainer. Dilengkapi showcase studi kasus, integrasi telemetri GitHub, formulir kontak webhook, dan CV direct download.',
    features: ['Studi Kasus Proyek Interaktif', 'Telemetri Metrik & Uptime', 'Formulir Kontak Webhook', 'Peringkat SEO & Mobile 100/100'],
    accentColor: '#2563eb',
    fontFamily: 'Inter',
    defaultRole: 'Senior Cloud & Platform Engineer',
    defaultBio: 'Merancang sistem terdistribusi skala besar, orkestrasi kontainer Docker/Kubernetes mandiri, dan edge router Traefik berlatensi rendah.',
    lighthouseScore: 100,
    author: 'Hero Core Platform',
    rating: 4.98,
    downloadsCount: 1420,
    isFeatured: true,
    layoutType: 'Single Page Showpiece',
    tags: ['Cloud Engineer', 'GitHub API', 'PWA Offline', 'Lighthouse 100'],
    stats: {
      ttfb: '1.4ms',
      seo: '100%',
      pwa: 'Aktif PWA'
    },
    themeConfig: {
      fontFamily: 'Inter',
      accentColor: '#2563eb',
      borderRadius: 10,
      bgMode: 'glass'
    },
    blocks: [
      {
        id: 'port_nav',
        type: 'navbar',
        name: 'Header Navigasi Glassmorphic',
        title: 'Rizal Pratama',
        buttonText: 'Hubungi Saya',
        buttonUrl: '#contact',
        isVisible: true,
        isLocked: false,
        styles: {
          bgMode: 'glass',
          paddingY: 16,
          backdropBlur: 16,
          accentColor: '#2563eb'
        }
      },
      {
        id: 'port_hero',
        type: 'hero',
        name: 'Hero Showcase Utama',
        badge: '◆ SENIOR CLOUD ARCHITECT',
        title: 'Membangun Infrastruktur Cloud Otonom & Kontainer Skalabel',
        subtitle: 'Fokus pada rekayasa platform high-availability, orkestrasi Docker otonom, dan optimalisasi edge proxy Traefik v3 dengan latensi di bawah 2ms.',
        buttonText: 'Lihat Studi Kasus',
        buttonUrl: '#showcase',
        secondaryButtonText: 'GitHub Profil',
        secondaryButtonUrl: 'https://github.com',
        isVisible: true,
        isLocked: false,
        styles: {
          align: 'center',
          paddingY: 64,
          bgMode: 'transparent',
          accentColor: '#2563eb'
        }
      },
      {
        id: 'port_stats',
        type: 'stats',
        name: 'Telemetri Metrik & Kinerja',
        title: 'Statistik Telemetri Produksi',
        subtitle: 'Performa operasional langsung pada cluster server mandiri.',
        isVisible: true,
        isLocked: false,
        items: [
          { id: 's1', title: '99.99%', desc: 'Uptime Produksi Bulanan' },
          { id: 's2', title: '1.2ms', desc: 'Rerata Latensi Edge TTFB' },
          { id: 's3', title: '40+', desc: 'Kontainer Mikro Beroperasi' },
          { id: 's4', title: '100/100', desc: 'Skor Lighthouse Audit' }
        ],
        styles: {
          paddingY: 36,
          bgMode: 'glass',
          accentColor: '#2563eb'
        }
      },
      {
        id: 'port_features',
        type: 'features',
        name: 'Pilar Keahlian Teknis',
        badge: 'KOMPETENSI INTI',
        title: 'Fondasi Rekayasa Perangkat Lunak',
        subtitle: 'Standar rekayasa berorientasi keamanan, efisiensi resource cgroups v2, dan automasi tanpa batas.',
        isVisible: true,
        isLocked: false,
        items: [
          {
            id: 'f1',
            title: 'Isolasi Runtime Kontainer CaaS',
            desc: 'Alokasi sumber daya ketat per-tenant memanfaatkan Linux cgroups v2 dan Seccomp sandbox profil.',
            icon: 'server'
          },
          {
            id: 'f2',
            title: 'Edge Ingress Traefik TLS 1.3',
            desc: 'Routing dinamis berbasis label kontainer dengan otomatisasi penerbitan sertifikat SSL Let\'s Encrypt.',
            icon: 'globe'
          },
          {
            id: 'f3',
            title: 'Arsitektur Multi-Tenant PostgreSQL RLS',
            desc: 'Pemisahan data tingkat baris (Row-Level Security) yang menjamin kerahasiaan antar-penyewa workspace.',
            icon: 'shield'
          }
        ],
        styles: {
          paddingY: 48,
          accentColor: '#2563eb'
        }
      },
      {
        id: 'port_showcase',
        type: 'showcase',
        name: 'Galeri Studi Kasus',
        badge: 'PORTFOLIO KARYA',
        title: 'Studi Kasus & Implementasi Nyata',
        subtitle: 'Solusi perangkat lunak mutakhir yang melayani ribuan pengguna aktif.',
        isVisible: true,
        isLocked: false,
        items: [
          {
            id: 'sc1',
            title: 'HeroCMS Studio Enterprise',
            desc: 'Platform headless CMS & orkestrator kontainer dengan editor visual instan dan caching Redis multi-layer.',
            tag: 'Golang • Vue 3 • Docker'
          },
          {
            id: 'sc2',
            title: 'Dynamic Edge Routing Traefik',
            desc: 'Sistem reverse proxy cerdas multi-domain dengan sertifikat TLS otomatis dan auto-renewal.',
            tag: 'Traefik v3 • TLS 1.3'
          },
          {
            id: 'sc3',
            title: 'Autonomous Object Storage Gateway',
            desc: 'Integrasi MinIO S3 terisolasi per-akun dengan kuota penyimpanan NVMe SSD terpartisi.',
            tag: 'MinIO S3 • Go SDK'
          }
        ],
        styles: {
          paddingY: 54,
          accentColor: '#2563eb'
        }
      },
      {
        id: 'port_cta',
        type: 'cta',
        name: 'Call to Action Kontak',
        badge: 'KOLABORASI',
        title: 'Siap Membangun Solusi Cloud Bersama?',
        subtitle: 'Mari diskusikan arsitektur sistem, migrasi kontainer, atau pengembangan produk digital Anda.',
        buttonText: 'Kirim Pesan Langsung',
        buttonUrl: 'mailto:contact@rizalpratama.cloud',
        secondaryButtonText: 'Jadwalkan Konsultasi',
        secondaryButtonUrl: '#consult',
        isVisible: true,
        isLocked: false,
        styles: {
          paddingY: 60,
          bgMode: 'glass',
          accentColor: '#2563eb'
        }
      },
      {
        id: 'port_footer',
        type: 'footer',
        name: 'Footer Hak Cipta',
        title: 'HeroCMS Studio',
        content: '© 2026 Rizal Pratama. Didukung infrastruktur kontainer otonom HeroCMS Platform.',
        isVisible: true,
        isLocked: false,
        styles: {
          paddingY: 28,
          accentColor: '#2563eb'
        }
      }
    ]
  },
  {
    id: 'tpl_blog_editorial',
    title: 'Editorial Media & Tech Publishing',
    category: 'blog',
    tier: 'Included in Plan',
    priceText: 'Gratis dalam Kuota',
    isPro: false,
    desc: 'Platform publikasi artikel modern dengan editor visual, estimasi waktu baca, generator otomatis OpenGraph card, dan pemantauan tren pembaca berbasis Redis ZSET.',
    features: ['Editor Blok Kaya Format', 'Generator OpenGraph Otomatis', 'Analitik Tren Bacaan Real-Time', 'Sistem Topik & Kategori Tag'],
    accentColor: '#059669',
    fontFamily: 'Plus Jakarta Sans',
    defaultRole: 'Tech Chronicle & Editorial Lab',
    defaultBio: 'Jurnal berkala riset teknologi, rekayasa perangkat lunak, keamanan siber, dan arsitektur terdistribusi modern.',
    lighthouseScore: 100,
    author: 'Hero Publishing Lab',
    rating: 4.95,
    downloadsCount: 1180,
    isFeatured: true,
    layoutType: 'Multi-Section Media',
    tags: ['Editorial', 'Markdown/Visual', 'Reading Time', 'OpenGraph Auto-Gen'],
    stats: {
      ttfb: '1.2ms',
      seo: '100%',
      pwa: 'Aktif PWA'
    },
    themeConfig: {
      fontFamily: 'Plus Jakarta Sans',
      accentColor: '#059669',
      borderRadius: 12,
      bgMode: 'glass'
    },
    blocks: [
      {
        id: 'blog_nav',
        type: 'navbar',
        name: 'Header Editorial',
        title: 'TechChronicle',
        buttonText: 'Berlangganan Newsletter',
        buttonUrl: '#subscribe',
        isVisible: true,
        isLocked: false,
        styles: {
          bgMode: 'glass',
          paddingY: 16,
          accentColor: '#059669'
        }
      },
      {
        id: 'blog_hero',
        type: 'hero',
        name: 'Hero Editorial Utama',
        badge: '◆ PUBLIKASI TEKNOLOGI TERDEPAN',
        title: 'Eksplorasi Mendalam Rekayasa Cloud & Sistem Terdistribusi',
        subtitle: 'Wawasan teknis langsung dari para engineer yang membangun platform berskala jutaan request.',
        buttonText: 'Baca Artikel Terbaru',
        buttonUrl: '#articles',
        secondaryButtonText: 'Kategori Topik',
        secondaryButtonUrl: '#topics',
        isVisible: true,
        isLocked: false,
        styles: {
          align: 'center',
          paddingY: 60,
          accentColor: '#059669'
        }
      },
      {
        id: 'blog_featured',
        type: 'card',
        name: 'Artikel Pilihan Redaksi',
        badge: 'ARTIKEL UNGGULAN',
        title: 'Ulasan Arsitektur Terpilih Minggu Ini',
        subtitle: 'Analisis mendalam seputar efisiensi kernel Linux dan edge computing.',
        isVisible: true,
        isLocked: false,
        items: [
          {
            id: 'a1',
            title: 'Arsitektur Multi-Tenant HeroCMS dengan PostgreSQL RLS',
            desc: 'Bagaimana Row-Level Security mengamankan isolasi tenant hingga tingkat query database tanpa kebocoran data.',
            tag: 'Keamanan • 8 Menit Baca',
            price: 'Trending #1'
          },
          {
            id: 'a2',
            title: 'Strategi Caching Traefik v3 dan Dynamic TLS Edge Router',
            desc: 'Mencapai skor TTFB 1.2ms pada jaringan global menggunakan proxy reverse mutakhir dan sertifikat otomatis.',
            tag: 'Infrastruktur • 5 Menit Baca',
            price: 'Trending #2'
          },
          {
            id: 'a3',
            title: 'Pengamanan Kernel Linux Cgroups v2 & Seccomp Sandbox',
            desc: 'Membatasi jatah CPU dan RAM pada level kernel agar setiap kontainer CaaS beroperasi secara stabil.',
            tag: 'Linux DevOps • 6 Menit Baca',
            price: 'Trending #3'
          }
        ],
        styles: {
          paddingY: 48,
          accentColor: '#059669'
        }
      },
      {
        id: 'blog_index',
        type: 'listgroup',
        name: 'Indeks Bacaan Mingguan',
        badge: 'EDISI TERBARU',
        title: 'Indeks Publikasi Artikel & Panduan Kode',
        subtitle: 'Daftar topik terhangat yang diperbarui secara berkesinambungan.',
        isVisible: true,
        isLocked: false,
        items: [
          { id: 't1', title: 'Panduan Praktis Migrasi Dockerfile ke Multi-Arch Buildx ARM64/AMD64', desc: '10 Okt 2026 • Docker Engine' },
          { id: 't2', title: 'Manajemen Bucket Terisolasi MinIO S3 pada Aplikasi Multi-Tenant', desc: '8 Okt 2026 • Object Storage' },
          { id: 't3', title: 'Implementasi CSRF Double Submit Cookie pada Arsitektur Single-Page App', desc: '5 Okt 2026 • Web Security' }
        ],
        styles: {
          paddingY: 40,
          accentColor: '#059669'
        }
      },
      {
        id: 'blog_cta',
        type: 'cta',
        name: 'Kotak Berlangganan Newsletter',
        badge: 'NEWSLETTER',
        title: 'Dapatkan Kiriman Artikel Teknis Tiap Pekan',
        subtitle: 'Tanpa spam. Hanya intisari kode, diagram arsitektur sistem, dan tips skalabilitas cloud.',
        buttonText: 'Berlangganan Gratis',
        buttonUrl: '#subscribe-form',
        isVisible: true,
        isLocked: false,
        styles: {
          paddingY: 54,
          bgMode: 'glass',
          accentColor: '#059669'
        }
      },
      {
        id: 'blog_footer',
        type: 'footer',
        name: 'Footer Editorial',
        title: 'TechChronicle Editorial',
        content: '© 2026 TechChronicle Publishing. Seluruh hak cipta dilindungi undang-undang.',
        isVisible: true,
        isLocked: false,
        styles: {
          paddingY: 28,
          accentColor: '#059669'
        }
      }
    ]
  },
  {
    id: 'tpl_edu_lms',
    title: 'Pusat Edukasi & Dokumentasi LMS',
    category: 'education',
    tier: 'Pro Template',
    priceText: 'Termasuk di Paket Pro',
    isPro: true,
    desc: 'Sistem manajemen pembelajaran (LMS) dan portal edukasi interaktif. Dilengkapi silabus kurikulum modular bertingkat, progres belajar, profil tutor ahli, dan materi unduh.',
    features: ['Silabus Modul Bertingkat', 'Pencarian Dokumentasi Instan', 'Profil Tutor & Dosen Ahli', 'Download Materi Silabus PDF'],
    accentColor: '#7c3aed',
    fontFamily: 'Outfit',
    defaultRole: 'Cloud Engineering Academy & Masterclass',
    defaultBio: 'Pusat pelatihan intensif rekayasa infrastruktur modern, kontainer otonom, dan arsitektur backend berkinerja tinggi.',
    lighthouseScore: 100,
    author: 'Hero LMS Solutions',
    rating: 4.92,
    downloadsCount: 890,
    isFeatured: false,
    layoutType: 'Course & Syllabus Hub',
    tags: ['LMS Silabus', 'Video Embed', 'Accordion Modul', 'Pricing'],
    stats: {
      ttfb: '1.6ms',
      seo: '100%',
      pwa: 'Aktif PWA'
    },
    themeConfig: {
      fontFamily: 'Outfit',
      accentColor: '#7c3aed',
      borderRadius: 14,
      bgMode: 'glass'
    },
    blocks: [
      {
        id: 'edu_nav',
        type: 'navbar',
        name: 'Header Edukasi LMS',
        title: 'HeroAcademy',
        buttonText: 'Portal Siswa',
        buttonUrl: '#portal',
        isVisible: true,
        isLocked: false,
        styles: {
          bgMode: 'glass',
          paddingY: 16,
          accentColor: '#7c3aed'
        }
      },
      {
        id: 'edu_hero',
        type: 'hero',
        name: 'Hero Banner Pelatihan',
        badge: '◆ BOOTCAMP INTENSIF DOCKER & CLOUD',
        title: 'Kuasai Rekayasa Infrastruktur Kontainer dari Nol ke Produksi',
        subtitle: 'Kurikulum praktis berbasis studi kasus industri nyata. Dipandu langsung oleh praktisi cloud architect senior.',
        buttonText: 'Daftar Kelas Sekarang',
        buttonUrl: '#pricing',
        secondaryButtonText: 'Lihat Silabus Lengkap',
        secondaryButtonUrl: '#curriculum',
        isVisible: true,
        isLocked: false,
        styles: {
          align: 'center',
          paddingY: 64,
          accentColor: '#7c3aed'
        }
      },
      {
        id: 'edu_progress',
        type: 'progressbar',
        name: 'Indikator Target Kelulusan',
        badge: 'KUALITAS PELATIHAN',
        title: 'Tingkat Kelulusan & Penyerapan Industri',
        subtitle: 'Siswa kami berhasil mengimplementasikan sistem produksi skala besar dengan standar tinggi.',
        isVisible: true,
        isLocked: false,
        items: [
          { id: 'p1', title: 'Penyelesaian Proyek Akhir', percentage: 94 },
          { id: 'p2', title: 'Penguasaan Container Orchestration', percentage: 98 },
          { id: 'p3', title: 'Penerapan Praktik Keamanan Produksi', percentage: 91 }
        ],
        styles: {
          paddingY: 40,
          accentColor: '#7c3aed'
        }
      },
      {
        id: 'edu_syllabus',
        type: 'accordion',
        name: 'Silabus Kurikulum Lengkap',
        badge: 'KURIKULUM MODULAR',
        title: 'Rincian Modul Pembelajaran Praktis',
        subtitle: 'Materi terstruktur yang dirancang secara bertahap untuk memastikan pemahaman mendalam.',
        isVisible: true,
        isLocked: false,
        items: [
          {
            id: 'm1',
            title: 'Modul 01: Fundamental Kontainer & Arsitektur Linux Kernel',
            desc: 'Memahami namespaces, cgroups v2, sistem file union overlayfs, serta pembuatan rootfs minimalis dari nol.'
          },
          {
            id: 'm2',
            title: 'Modul 02: Reverse Proxy & Ingress Edge Traefik v3',
            desc: 'Konfigurasi router dinamis, otomatisasi SSL Let\'s Encrypt TLS v1.3, rate-limiting, dan middleware autentikasi.'
          },
          {
            id: 'm3',
            title: 'Modul 03: Penyimpanan Objek Terisolasi dengan MinIO S3',
            desc: 'Manajemen multi-bucket, partisi storage per-tenant, kebijakan CORS, dan upload langsung berkas berkecepatan tinggi.'
          },
          {
            id: 'm4',
            title: 'Modul 04: Keamanan Produksi & Observabilitas Sistem',
            desc: 'Audit Row-Level Security PostgreSQL, proteksi CSRF double submit cookie, dan pelacakan metrik real-time Redis.'
          }
        ],
        styles: {
          paddingY: 50,
          accentColor: '#7c3aed'
        }
      },
      {
        id: 'edu_pricing',
        type: 'pricing',
        name: 'Pilihan Paket Belajar',
        badge: 'BIAYA PENDIDIKAN',
        title: 'Investasi Pendidikan Terjangkau',
        subtitle: 'Pilih skema belajar yang paling sesuai dengan target karier Anda.',
        isVisible: true,
        isLocked: false,
        items: [
          {
            id: 'c1',
            title: 'Akses Mandiri (Self-Paced)',
            price: 'Rp 499.000',
            period: 'Akses Seumur Hidup',
            desc: 'Cocok untuk pembelajar mandiri yang ingin belajar sesuai jadwal sendiri.',
            features: ['Akses Seluruh Video Modul', 'Source Code & Lab Docker', 'Forum Diskusi Komunitas', 'Sertifikat Kelulusan Digital']
          },
          {
            id: 'c2',
            title: 'Mentorship Intensif (1-on-1)',
            price: 'Rp 1.499.000',
            period: '3 Bulan Bimbingan',
            desc: 'Program bimbingan langsung dengan review kode proyek akhir oleh mentor senior.',
            features: ['Semua Fitur Akses Mandiri', 'Sesi Review Kode 1-on-1 Mingguan', 'Ujian Mock Interview Cloud Architect', 'Rekomendasi Penempatan Kerja'],
            tag: 'Paling Populer'
          }
        ],
        styles: {
          paddingY: 54,
          accentColor: '#7c3aed'
        }
      },
      {
        id: 'edu_footer',
        type: 'footer',
        name: 'Footer Edukasi',
        title: 'HeroAcademy LMS',
        content: '© 2026 HeroAcademy LMS. Mendorong talenta digital Indonesia berkelas dunia.',
        isVisible: true,
        isLocked: false,
        styles: {
          paddingY: 28,
          accentColor: '#7c3aed'
        }
      }
    ]
  },
  {
    id: 'tpl_business_catalog',
    title: 'Showcase Bisnis, Agency & UMKM',
    category: 'business',
    tier: 'Pro Template',
    priceText: 'Termasuk di Paket Pro',
    isPro: true,
    desc: 'Toko online mikro, showcase layanan agensi, dan landing page UMKM profesional. Dilengkapi tombol direct order WhatsApp, galeri penawaran harga, dan integrasi katalog produk responsif.',
    features: ['Katalog Produk & Layanan Responsif', 'Direct WhatsApp Ordering', 'Integrasi Payment Link QRIS', 'Statistik Konversi Penjualan'],
    accentColor: '#ea580c',
    fontFamily: 'Plus Jakarta Sans',
    defaultRole: 'Agensi Solusi Digital & Cloud Studio',
    defaultBio: 'Membantu transformasi digital bisnis UMKM dan perusahaan berkembang dengan infrastruktur web yang andal dan konversi optimal.',
    lighthouseScore: 100,
    author: 'Hero Commercial Core',
    rating: 4.97,
    downloadsCount: 2040,
    isFeatured: true,
    layoutType: 'Catalog & WhatsApp Checkout',
    tags: ['E-Commerce UMKM', 'WhatsApp Checkout', 'Pricing Cards', 'Conversion Ready'],
    stats: {
      ttfb: '1.3ms',
      seo: '100%',
      pwa: 'Aktif PWA'
    },
    themeConfig: {
      fontFamily: 'Plus Jakarta Sans',
      accentColor: '#ea580c',
      borderRadius: 12,
      bgMode: 'glass'
    },
    blocks: [
      {
        id: 'biz_nav',
        type: 'navbar',
        name: 'Header Bisnis Agensi',
        title: 'HeroSolutions',
        buttonText: 'Konsultasi via WhatsApp',
        buttonUrl: 'https://wa.me/6281234567890?text=Halo%20saya%20ingin%20konsultasi%20layanan',
        isVisible: true,
        isLocked: false,
        styles: {
          bgMode: 'glass',
          paddingY: 16,
          accentColor: '#ea580c'
        }
      },
      {
        id: 'biz_hero',
        type: 'hero',
        name: 'Hero Bisnis & Solusi',
        badge: '◆ SOLUSI DIGITAL TERPADU',
        title: 'Akselerasi Pertumbuhan Bisnis Anda dengan Website Berkinerja Tinggi',
        subtitle: 'Kami membangun website modern, cepat, dan ramah SEO yang dirancang khusus untuk meningkatkan penjualan dan kepercayaan pelanggan.',
        buttonText: 'Lihat Layanan Kami',
        buttonUrl: '#services',
        secondaryButtonText: 'Hubungi WhatsApp',
        secondaryButtonUrl: 'https://wa.me/6281234567890',
        isVisible: true,
        isLocked: false,
        styles: {
          align: 'center',
          paddingY: 60,
          accentColor: '#ea580c'
        }
      },
      {
        id: 'biz_stats',
        type: 'stats',
        name: 'Pencapaian Bisnis',
        title: 'Bukti Kinerja Nyata',
        subtitle: 'Kepercayaan klien adalah komitmen utama layanan kami.',
        isVisible: true,
        isLocked: false,
        items: [
          { id: 'b1', title: '120+', desc: 'Proyek Bisnis Terselesaikan' },
          { id: 'b2', title: '99.8%', desc: 'Tingkat Kepuasan Klien' },
          { id: 'b3', title: '24/7', desc: 'SLA Dukungan Teknis' },
          { id: 'b4', title: '< 2 Detik', desc: 'Kecepatan Muat Website' }
        ],
        styles: {
          paddingY: 36,
          bgMode: 'glass',
          accentColor: '#ea580c'
        }
      },
      {
        id: 'biz_cards',
        type: 'card',
        name: 'Paket Layanan Profesional',
        badge: 'KATALOG LAYANAN',
        title: 'Pilihan Solusi Sesuai Skala Kebutuhan',
        subtitle: 'Transparan, tanpa biaya tersembunyi, siap pakai dalam hitungan hari.',
        isVisible: true,
        isLocked: false,
        items: [
          {
            id: 'pkg1',
            title: 'Website Showcase UMKM',
            desc: 'Landing page profil usaha interaktif dengan integrasi katalog produk, peta lokasi Google Maps, dan tombol order WhatsApp.',
            price: 'Mulai Rp 1.500.000',
            tag: 'Cepat & Terjangkau'
          },
          {
            id: 'pkg2',
            title: 'Sistem Portal & Katalog Dinamis',
            desc: 'Website bisnis multi-halaman dengan CMS mandiri, galeri tak terbatas, manajemen artikel, dan analitik pengunjung.',
            price: 'Mulai Rp 3.500.000',
            tag: 'Paling Dicari'
          },
          {
            id: 'pkg3',
            title: 'Arsitektur Custom Enterprise',
            desc: 'Pengembangan web berskala besar dengan kontainer Docker mandiri, domain kustom, backup otomatis, dan SLA prioritas.',
            price: 'Mulai Rp 7.500.000',
            tag: 'Dedicated Solution'
          }
        ],
        styles: {
          paddingY: 50,
          accentColor: '#ea580c'
        }
      },
      {
        id: 'biz_cta',
        type: 'cta',
        name: 'Call to Action Penutup',
        badge: 'KONSULTASI GRATIS',
        title: 'Mulai Konsultasikan Kebutuhan Website Bisnis Anda Hari Ini',
        subtitle: 'Tim kami siap membantu merekomendasikan solusi teknologi yang paling efisien untuk bisnis Anda.',
        buttonText: 'Chat Langsung via WhatsApp',
        buttonUrl: 'https://wa.me/6281234567890?text=Halo%20saya%20tertarik%20dengan%20layanan%20HeroSolutions',
        isVisible: true,
        isLocked: false,
        styles: {
          paddingY: 56,
          bgMode: 'glass',
          accentColor: '#ea580c'
        }
      },
      {
        id: 'biz_footer',
        type: 'footer',
        name: 'Footer Bisnis',
        title: 'HeroSolutions Studio',
        content: '© 2026 PT Hero Solusi Digital. Seluruh hak cipta dilindungi undang-undang.',
        isVisible: true,
        isLocked: false,
        styles: {
          paddingY: 28,
          accentColor: '#ea580c'
        }
      }
    ]
  },
  {
    id: 'tpl_saas_startup',
    title: 'SaaS Product Landing & Cloud Platform',
    category: 'business',
    tier: 'Pro Template',
    priceText: 'Termasuk di Paket Pro',
    isPro: true,
    desc: 'Blueprint modern untuk startup produk digital dan layanan SaaS. Menampilkan live product preview, tabel matriks harga, FAQ teknis interaktif, dan integrasi pendaftaran akun gratis.',
    features: ['Live Feature Showcase', 'Matriks Komparasi Paket Harga', 'FAQ Interaktif Accordion', 'Formulir Uji Coba Gratis Langsung'],
    accentColor: '#0284c7',
    fontFamily: 'Inter',
    defaultRole: 'Cloud Orchestrator & CaaS Platform',
    defaultBio: 'Platform otomatisasi deployment aplikasi berbasis kontainer mikro dengan zero-configuration dan proteksi edge menyeluruh.',
    lighthouseScore: 100,
    author: 'Hero Cloud Ecosystem',
    rating: 4.99,
    downloadsCount: 1650,
    isFeatured: true,
    layoutType: 'SaaS Platform Landing',
    tags: ['SaaS Landing', 'Feature Matrix', 'FAQ Accordion', 'Lead Gen'],
    stats: {
      ttfb: '1.1ms',
      seo: '100%',
      pwa: 'Aktif PWA'
    },
    themeConfig: {
      fontFamily: 'Inter',
      accentColor: '#0284c7',
      borderRadius: 10,
      bgMode: 'glass'
    },
    blocks: [
      {
        id: 'saas_nav',
        type: 'navbar',
        name: 'Header SaaS Minimalis',
        title: 'HeroCloud SaaS',
        buttonText: 'Coba Gratis 14 Hari',
        buttonUrl: '#signup',
        isVisible: true,
        isLocked: false,
        styles: {
          bgMode: 'glass',
          paddingY: 16,
          accentColor: '#0284c7'
        }
      },
      {
        id: 'saas_hero',
        type: 'hero',
        name: 'Hero Banner SaaS',
        badge: '◆ CLOUD NATIVE ORCHESTRATOR',
        title: 'Deploy dan Skalakan Kontainer Anda dalam Hitungan Detik',
        subtitle: 'Tinggalkan kerumitan konfigurasi server manual. Nikmati orkestrasi kontainer otonom dengan isolasi memori penuh dan routing edge Traefik instan.',
        buttonText: 'Mulai Uji Coba Gratis',
        buttonUrl: '#signup',
        secondaryButtonText: 'Dokumentasi API',
        secondaryButtonUrl: '#docs',
        isVisible: true,
        isLocked: false,
        styles: {
          align: 'center',
          paddingY: 64,
          accentColor: '#0284c7'
        }
      },
      {
        id: 'saas_features',
        type: 'features',
        name: 'Fitur Utama SaaS',
        badge: 'KEUNGGULAN SISTEM',
        title: 'Semua yang Dibutuhkan untuk Skalabilitas Produksi',
        subtitle: 'Dirancang khusus oleh insinyur sistem untuk performa tanpa kompromi.',
        isVisible: true,
        isLocked: false,
        items: [
          {
            id: 'sf1',
            title: 'Zero-Config SSL Ingress',
            desc: 'Sertifikat TLS 1.3 Let\'s Encrypt terbit otomatis untuk setiap subdomain dan kustom domain pengguna.',
            icon: 'lock'
          },
          {
            id: 'sf2',
            title: 'Isolasi cgroups v2 Kernel',
            desc: 'Jaminan alokasi CPU dan RAM independen per-kontainer tanpa risiko degradasi performa.',
            icon: 'cpu'
          },
          {
            id: 'sf3',
            title: 'Caching Redis & Top Views',
            desc: 'Akselerasi respon database dengan integrasi Redis caching bertingkat dan analitik hit instan.',
            icon: 'zap'
          }
        ],
        styles: {
          paddingY: 48,
          accentColor: '#0284c7'
        }
      },
      {
        id: 'saas_pricing',
        type: 'pricing',
        name: 'Matriks Harga Layanan',
        badge: 'SKEMA BIAYA',
        title: 'Harga Transparan Sesuai Pertumbuhan Bisnis',
        subtitle: 'Mulai dari paket starter hingga kebutuhan infrastruktur enterprise dedicated.',
        isVisible: true,
        isLocked: false,
        items: [
          {
            id: 'sp1',
            title: 'Starter Node',
            price: 'Rp 69.000',
            period: '/ bulan',
            desc: 'Ideal untuk eksperimen aplikasi dan situs personal.',
            features: ['1 Dedicated Kontainer', '256 MB RAM Terisolasi', '0.5 vCPU Alokasi', 'SSL Otomatis TLS 1.3']
          },
          {
            id: 'sp2',
            title: 'Pro Cluster',
            price: 'Rp 149.000',
            period: '/ bulan',
            desc: 'Solusi terbaik untuk tim pengembang dan agensi aktif.',
            features: ['3 Dedicated Kontainer', '768 MB RAM Agregat', '2 GB S3 Storage MinIO', 'Custom Domain Tanpa Batas', 'SLA 99.9% Uptime'],
            tag: 'Paling Populer'
          }
        ],
        styles: {
          paddingY: 54,
          accentColor: '#0284c7'
        }
      },
      {
        id: 'saas_faq',
        type: 'accordion',
        name: 'FAQ Tanya Jawab Teknis',
        badge: 'PERTANYAAN UMUM',
        title: 'Pertanyaan yang Sering Diajukan',
        subtitle: 'Semua informasi penting seputar keamanan, penagihan, dan migrasi.',
        isVisible: true,
        isLocked: false,
        items: [
          {
            id: 'faq1',
            title: 'Apakah saya bisa menggunakan domain saya sendiri?',
            desc: 'Tentu saja. Anda dapat menghubungkan domain kustom Anda melalui menu Domain & Ingress DNS dengan memetakan CNAME ke target edge proxy kami.'
          },
          {
            id: 'faq2',
            title: 'Bagaimana keamanan data antar penyewa dijamin?',
            desc: 'Setiap akun diisolasi menggunakan Row-Level Security (RLS) PostgreSQL, bucket MinIO tersendiri, dan ruang nama cgroups v2 kernel Linux terpisah.'
          }
        ],
        styles: {
          paddingY: 48,
          accentColor: '#0284c7'
        }
      },
      {
        id: 'saas_footer',
        type: 'footer',
        name: 'Footer SaaS',
        title: 'HeroCloud Systems',
        content: '© 2026 HeroCloud Systems Inc. Semua hak dilindungi.',
        isVisible: true,
        isLocked: false,
        styles: {
          paddingY: 28,
          accentColor: '#0284c7'
        }
      }
    ]
  },
  {
    id: 'tpl_creative_agency',
    title: 'Studio Desain Kreatif & Pengalaman Web',
    category: 'portfolio',
    tier: 'Pro Template',
    priceText: 'Termasuk di Paket Pro',
    isPro: true,
    desc: 'Blueprint bertema avant-garde dengan tipografi ekspresif dan tata letak modular visual. Sempurna untuk studio desain, creative director, fotografer, dan agensi multimedia.',
    features: ['Tipografi Avant-Garde Bespoke', 'Galeri Showcase Interaktif', 'Formulir Permintaan Penawaran', 'Animasi Micro-Interactions'],
    accentColor: '#db2777',
    fontFamily: 'Syne',
    defaultRole: 'Bespoke Digital Design & Creative Studio',
    defaultBio: 'Menciptakan karya visual yang membekas, identitas brand yang berani, dan pengalaman web yang memenangkan penghargaan.',
    lighthouseScore: 100,
    author: 'Studio Avant-Garde',
    rating: 4.94,
    downloadsCount: 760,
    isFeatured: false,
    layoutType: 'Avant-Garde Showcase',
    tags: ['Creative Studio', 'Masonry Grid', 'Dark/Glass', 'Design Portfolio'],
    stats: {
      ttfb: '1.5ms',
      seo: '100%',
      pwa: 'Aktif PWA'
    },
    themeConfig: {
      fontFamily: 'Syne',
      accentColor: '#db2777',
      borderRadius: 16,
      bgMode: 'glass'
    },
    blocks: [
      {
        id: 'cr_nav',
        type: 'navbar',
        name: 'Header Studio Minimalis',
        title: 'AtelierVisual',
        buttonText: 'Mulai Proyek',
        buttonUrl: '#inquiry',
        isVisible: true,
        isLocked: false,
        styles: {
          bgMode: 'glass',
          paddingY: 16,
          accentColor: '#db2777'
        }
      },
      {
        id: 'cr_hero',
        type: 'hero',
        name: 'Hero Statement Visual',
        badge: '◆ CREATIVE & DIGITAL ATELIER',
        title: 'Kami Merancang Identitas Visual dan Pengalaman Digital yang Berani',
        subtitle: 'Menggabungkan keindahan estetika bespoke dengan keandalan rekayasa web kelas dunia.',
        buttonText: 'Lihat Arsip Karya',
        buttonUrl: '#showcase',
        secondaryButtonText: 'Filosofi Desain',
        secondaryButtonUrl: '#about',
        isVisible: true,
        isLocked: false,
        styles: {
          align: 'center',
          paddingY: 68,
          accentColor: '#db2777'
        }
      },
      {
        id: 'cr_showcase',
        type: 'showcase',
        name: 'Galeri Arsip Karya',
        badge: 'PROYEK PILIHAN',
        title: 'Arsip Eksplorasi Desain Terbaru',
        subtitle: 'Koleksi kolaborasi dengan brand global dan startup visioner.',
        isVisible: true,
        isLocked: false,
        items: [
          {
            id: 'cr1',
            title: 'MonoStudio Brand Experience',
            desc: 'Perombakan identitas brand holistik dan platform pameran digital virtual.',
            tag: 'Identitas Visual • Web GL'
          },
          {
            id: 'cr2',
            title: 'Kinetix Type Specimen',
            desc: 'Eksperimen tipografi kinetik interaktif dan antarmuka web generatif.',
            tag: 'Tipografi • Desain Interaksi'
          },
          {
            id: 'cr3',
            title: 'Lumina Spatial Audio Experience',
            desc: 'Landing page imersif untuk perangkat audio nirkabel premium generasi terbaru.',
            tag: 'E-Commerce • Immersive Web'
          }
        ],
        styles: {
          paddingY: 52,
          accentColor: '#db2777'
        }
      },
      {
        id: 'cr_cta',
        type: 'cta',
        name: 'Inquiry Form Section',
        badge: 'MULAI KERJASAMA',
        title: 'Punya Visi Besar untuk Brand Anda? Mari Wujudkan Bersama.',
        subtitle: 'Kami menerima proyek desain web dan kolaborasi kreatif untuk kuartal ini.',
        buttonText: 'Kirimkan Brief Proyek',
        buttonUrl: 'mailto:studio@ateliervisual.design',
        isVisible: true,
        isLocked: false,
        styles: {
          paddingY: 58,
          bgMode: 'glass',
          accentColor: '#db2777'
        }
      },
      {
        id: 'cr_footer',
        type: 'footer',
        name: 'Footer Atelier',
        title: 'AtelierVisual Design Lab',
        content: '© 2026 AtelierVisual Studio. Terdaftar dan dilindungi hukum hak cipta.',
        isVisible: true,
        isLocked: false,
        styles: {
          paddingY: 28,
          accentColor: '#db2777'
        }
      }
    ]
  }
];
