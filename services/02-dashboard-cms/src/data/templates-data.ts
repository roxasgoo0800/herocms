import type { VisualBlock, TemplatePage } from '../types/dashboard';

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
  isMultiPage?: boolean;
  pages?: TemplatePage[];
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
    id: 'tpl_corporate_multipage',
    title: 'Enterprise Corporate & Service Suite (Multi-Page Figma Architecture)',
    category: 'business',
    tier: 'Bespoke Enterprise',
    priceText: 'Multi-Page Ready',
    isPro: false,
    isFeatured: true,
    desc: 'Blueprint website korporasi konvensional multi-halaman dengan arsitektur sitemap visual gaya Figma. Dilengkapi rute lengkap Beranda (/), Tentang Kami (/about), Katalog Layanan (/services), dan Kontak Kami (/contact) yang saling terhubung dinamis.',
    features: [
      'Struktur Multi-Halaman Konvensional (/, /about, /services, /contact)',
      'Arsitektur Visual Figma Flow Canvas dengan Garis Alur Konektor Bezier',
      'Navigasi Navbar Dinamis yang Otomatis Berpindah Antar Halaman',
      'Formulir Lead Generation, Showcase Portofolio, dan Tabel Layanan',
      'SEO Multi-Halaman Terisolasi & Cache Traefik v3 HTTP/3'
    ],
    accentColor: '#2563eb',
    fontFamily: 'Plus Jakarta Sans',
    defaultRole: 'Platform Solusi Cloud & Rekayasa Enterprise',
    defaultBio: 'Membangun infrastruktur perangkat lunak modern tingkat tinggi dengan isolasi runtime kontainer mandiri.',
    lighthouseScore: 99.8,
    layoutType: 'multi-page',
    isMultiPage: true,
    tags: ['Multi-Page', 'Sitemap Flow', 'Figma Canvas', 'Enterprise', 'Bespoke'],
    stats: {
      ttfb: '0.8ms',
      seo: '100/100',
      pwa: 'Multi-Page Ready'
    },
    themeConfig: {
      fontFamily: 'Plus Jakarta Sans',
      accentColor: '#2563eb',
      borderRadius: 12,
      bgMode: 'glass'
    },
    pages: [
      {
        id: 'page_home',
        path: '/',
        title: 'Beranda',
        description: 'Halaman utama landing korporasi dengan headline impresif, keunggulan, dan portofolio.',
        canvasX: 0,
        canvasY: 0,
        blocks: [
          {
            id: 'home_nav',
            type: 'navbar',
            name: 'Header & Navigasi Utama',
            title: 'AetherCorp',
            buttonText: 'Konsultasi Gratis',
            buttonUrl: '/contact',
            isVisible: true,
            isLocked: false,
            items: [
              { id: 'hn_1', title: 'Beranda', url: '/' },
              { id: 'hn_2', title: 'Tentang Kami', url: '/about' },
              { id: 'hn_3', title: 'Layanan', url: '/services' },
              { id: 'hn_4', title: 'Kontak', url: '/contact' }
            ],
            styles: { bgMode: 'glass', navStyle: 'glass', navAlign: 'split', isSticky: true, brandGlyph: '◆', paddingY: 16 }
          },
          {
            id: 'home_hero',
            type: 'hero',
            name: 'Hero Showcase Korporat',
            badge: '◆ ENTERPRISE MULTI-PAGE PLATFORM',
            title: 'Solusi Rekayasa Digital & Cloud Enterprise',
            subtitle: 'Menghadirkan ekosistem perangkat lunak berkinerja tinggi, isolasi kontainer aman, dan skalabilitas tanpa batas.',
            buttonText: 'Eksplorasi Layanan',
            buttonUrl: '/services',
            secondaryButtonText: 'Tentang Perusahaan',
            secondaryButtonUrl: '/about',
            isVisible: true,
            isLocked: false,
            styles: { align: 'center', paddingY: 72, bgMode: 'transparent' }
          },
          {
            id: 'home_features',
            type: 'features',
            name: 'Pilar Keunggulan Teknologi',
            badge: 'PONDASI SISTEM',
            title: 'Keandalan Tingkat Tinggi untuk Bisnis Kritis',
            subtitle: 'Dirancang untuk ketahanan beban jutaan transaksi tanpa kompromi.',
            isVisible: true,
            isLocked: false,
            items: [
              { id: 'hf_1', title: 'Orkestrasi Mandiri Traefik v3', desc: 'Routing otomatis dengan penerbitan SSL TLS v1.3 Let\'s Encrypt.', icon: 'globe' },
              { id: 'hf_2', title: 'Isolasi Memori Linux cgroups v2', desc: 'Proteksi sumber daya RAM dan CPU per-kontainer tanpa bottleneck.', icon: 'server' },
              { id: 'hf_3', title: 'Telemetri Realtime Kafka & Redis', desc: 'Pemrosesan data mikrodetik dengan analitik streaming latensi ultra-rendah.', icon: 'trending-up' }
            ],
            styles: { paddingY: 60, align: 'center', bgMode: 'transparent' }
          },
          {
            id: 'home_cta',
            type: 'cta',
            name: 'Call To Action Beranda',
            title: 'Siap Mempercepat Transformasi Digital Anda?',
            subtitle: 'Jadwalkan sesi konsultasi strategis bersama arsitek sistem senior kami hari ini.',
            buttonText: 'Hubungi Tim Ahli',
            buttonUrl: '/contact',
            isVisible: true,
            isLocked: false,
            styles: { paddingY: 52, align: 'center', bgMode: 'glass', borderRadius: 16 }
          },
          {
            id: 'home_footer',
            type: 'footer',
            name: 'Site Footer',
            title: 'AetherCorp Platform Suite',
            subtitle: 'Hak Cipta © 2026 AetherCorp Enterprise. Dilindungi Undang-Undang.',
            isVisible: true,
            isLocked: false,
            styles: { paddingY: 36, align: 'center', bgMode: 'transparent' }
          }
        ]
      },
      {
        id: 'page_about',
        path: '/about',
        title: 'Tentang Kami',
        description: 'Profil visi, misi, milestone perjalanan, dan kultur rekayasa perusahaan.',
        canvasX: 1800,
        canvasY: 0,
        blocks: [
          {
            id: 'about_nav',
            type: 'navbar',
            name: 'Header & Navigasi',
            title: 'AetherCorp',
            buttonText: 'Konsultasi Gratis',
            buttonUrl: '/contact',
            isVisible: true,
            isLocked: false,
            items: [
              { id: 'an_1', title: 'Beranda', url: '/' },
              { id: 'an_2', title: 'Tentang Kami', url: '/about' },
              { id: 'an_3', title: 'Layanan', url: '/services' },
              { id: 'an_4', title: 'Kontak', url: '/contact' }
            ],
            styles: { bgMode: 'glass', navStyle: 'glass', navAlign: 'split', isSticky: true, brandGlyph: '◆', paddingY: 16 }
          },
          {
            id: 'about_hero',
            type: 'hero',
            name: 'Hero Profil Perusahaan',
            badge: 'PROFIL & VISI KORPORAT',
            title: 'Membangun Ekosistem Rekayasa Terdepan Sejak 2020',
            subtitle: 'Berdedikasi membantu perusahaan skala nasional dan multinasional mencapai keandalan operasional sistem hingga 99.99%.',
            buttonText: 'Pelajari Layanan Kami',
            buttonUrl: '/services',
            secondaryButtonText: 'Hubungi Manajemen',
            secondaryButtonUrl: '/contact',
            isVisible: true,
            isLocked: false,
            styles: { align: 'center', paddingY: 64, bgMode: 'transparent' }
          },
          {
            id: 'about_stats',
            type: 'stats',
            name: 'Pencapaian & Skala Dampak',
            badge: 'REKAM JEJAK',
            title: 'Dampak Nyata di Berbagai Industri',
            subtitle: 'Angka terverifikasi dari eksekusi proyek rekayasa skala enterprise.',
            isVisible: true,
            isLocked: false,
            items: [
              { id: 'as_1', title: '500+', desc: 'Proyek Sistem Berhasil Rilis' },
              { id: 'as_2', title: '99.99%', desc: 'SLA Ketersediaan Infrastruktur' },
              { id: 'as_3', title: '18M+', desc: 'Kunjungan Pengguna per Bulan' },
              { id: 'as_4', title: '15+', desc: 'Negara Mitra Operasional' }
            ],
            styles: { paddingY: 56, align: 'center', bgMode: 'glass' }
          },
          {
            id: 'about_list',
            type: 'listgroup',
            name: 'Standar Nilai & Kepatuhan',
            badge: 'KOMITMEN INTEGRITAS',
            title: 'Prinsip Kualitas Tanpa Kompromi',
            subtitle: 'Pondasi filosofi teknis yang membimbing setiap baris kode yang kami kembangkan.',
            isVisible: true,
            isLocked: false,
            items: [
              { id: 'al_1', title: 'Kepatuhan Regulasi & Sertifikasi ISO/IEC 27001', desc: 'Enkripsi data berlapis dan audit keamanan independen berkala.', tag: 'Standar Global' },
              { id: 'al_2', title: 'Isolasi Tenant Tingkat Kernel (Row-Level Security)', desc: 'Menjamin 100% privasi data tidak saling silang antar organisasi.', tag: 'Zero Leakage' },
              { id: 'al_3', title: 'Dukungan Operasional 24/7 dengan MTTR < 10 Menit', desc: 'Tim engineer siaga memitigasi potensi gangguan sebelum berdampak pada pengguna.', tag: 'SLA Tinggi' }
            ],
            styles: { paddingY: 56, align: 'left', bgMode: 'transparent' }
          },
          {
            id: 'about_footer',
            type: 'footer',
            name: 'Site Footer',
            title: 'AetherCorp Platform Suite',
            subtitle: 'Hak Cipta © 2026 AetherCorp Enterprise. Dilindungi Undang-Undang.',
            isVisible: true,
            isLocked: false,
            styles: { paddingY: 36, align: 'center', bgMode: 'transparent' }
          }
        ]
      },
      {
        id: 'page_services',
        path: '/services',
        title: 'Layanan & Solusi',
        description: 'Daftar komprehensif paket solusi rekayasa, arsitektur, dan paket investasi.',
        canvasX: 3600,
        canvasY: 0,
        blocks: [
          {
            id: 'srv_nav',
            type: 'navbar',
            name: 'Header & Navigasi',
            title: 'AetherCorp',
            buttonText: 'Konsultasi Gratis',
            buttonUrl: '/contact',
            isVisible: true,
            isLocked: false,
            items: [
              { id: 'sn_1', title: 'Beranda', url: '/' },
              { id: 'sn_2', title: 'Tentang Kami', url: '/about' },
              { id: 'sn_3', title: 'Layanan', url: '/services' },
              { id: 'sn_4', title: 'Kontak', url: '/contact' }
            ],
            styles: { bgMode: 'glass', navStyle: 'glass', navAlign: 'split', isSticky: true, brandGlyph: '◆', paddingY: 16 }
          },
          {
            id: 'srv_hero',
            type: 'hero',
            name: 'Hero Solusi & Katalog',
            badge: 'KATALOG LAYANAN TEKNOLOGI',
            title: 'Portofolio Solusi Menyeluruh untuk Pertumbuhan Eksponensial',
            subtitle: 'Dirancang modular agar dapat disesuaikan dengan skala dan fase perkembangan teknologi bisnis Anda.',
            buttonText: 'Pilih Paket Solusi',
            buttonUrl: '#pricing-tiers',
            secondaryButtonText: 'Tanya Tim Konsultan',
            secondaryButtonUrl: '/contact',
            isVisible: true,
            isLocked: false,
            styles: { align: 'center', paddingY: 64, bgMode: 'transparent' }
          },
          {
            id: 'srv_pricing',
            type: 'pricing',
            name: 'Tabel Paket Solusi',
            badge: 'INVESTASI TEKNOLOGI',
            title: 'Pilihan Paket Layanan Rekayasa',
            subtitle: 'Skalabilitas transparan tanpa biaya tersembunyi dengan dukungan teknis penuh.',
            isVisible: true,
            isLocked: false,
            items: [
              { id: 'sp_1', title: 'Startup Acceleration', price: 'Rp 2.490.000', period: '/ bln', desc: 'Pondasi cloud native dan domain kustom.', features: ['Isolasi Kontainer Docker', 'SSL Auto Let\'s Encrypt', 'SLA 99.9% Uptime'] },
              { id: 'sp_2', title: 'Corporate Growth', price: 'Rp 5.990.000', period: '/ bln', tag: 'Paling Populer', desc: 'Optimalisasi penuh dan redis caching.', features: ['Dedicated Redis & Kafka', 'Audit Keamanan Berkala', 'Prioritas Engineer 24/7'] },
              { id: 'sp_3', title: 'Enterprise Bespoke', price: 'Hubungi Kami', period: '', desc: 'Arsitektur kustom multi-region dan disaster recovery.', features: ['Multi-Region Failover', 'Custom Dedicated VPC', 'Dedicated Solutions Architect'] }
            ],
            styles: { paddingY: 60, align: 'center', bgMode: 'transparent' }
          },
          {
            id: 'srv_accordion',
            type: 'accordion',
            name: 'Tanya Jawab Layanan (FAQ)',
            badge: 'FAQ LAYANAN',
            title: 'Pertanyaan yang Kerap Ditanyakan',
            subtitle: 'Informasi transparan seputar proses migrasi, dukungan teknis, dan SLA kami.',
            isVisible: true,
            isLocked: false,
            activeItemIndex: 0,
            items: [
              { id: 'sfaq_1', title: 'Berapa lama proses implementasi dan migrasi ke Aether Platform?', desc: 'Rata-rata integrasi dan provisioning kontainer mandiri selesai dalam waktu kurang dari 24 jam kerja.' },
              { id: 'sfaq_2', title: 'Apakah ada kontrak jangka panjang yang mengikat?', desc: 'Kami menyediakan opsi fleksibel bulanan maupun tahunan dengan diskon khusus tanpa pengikatan vendor lock-in.' },
              { id: 'sfaq_3', title: 'Bagaimana prosedur penanganan eskalasi insiden darurat?', desc: 'Tim NOC kami aktif 24/7/365 dengan waktu respon tanggap awal di bawah 15 menit melalui saluran dedicated.' }
            ],
            styles: { paddingY: 56, align: 'center', bgMode: 'glass' }
          },
          {
            id: 'srv_footer',
            type: 'footer',
            name: 'Site Footer',
            title: 'AetherCorp Platform Suite',
            subtitle: 'Hak Cipta © 2026 AetherCorp Enterprise. Dilindungi Undang-Undang.',
            isVisible: true,
            isLocked: false,
            styles: { paddingY: 36, align: 'center', bgMode: 'transparent' }
          }
        ]
      },
      {
        id: 'page_contact',
        path: '/contact',
        title: 'Hubungi Kami',
        description: 'Formulir kontak langsung, pemesanan jadwal konsultasi, dan informasi saluran resmi.',
        canvasX: 5400,
        canvasY: 0,
        blocks: [
          {
            id: 'cnt_nav',
            type: 'navbar',
            name: 'Header & Navigasi',
            title: 'AetherCorp',
            buttonText: 'Konsultasi Gratis',
            buttonUrl: '/contact',
            isVisible: true,
            isLocked: false,
            items: [
              { id: 'cn_1', title: 'Beranda', url: '/' },
              { id: 'cn_2', title: 'Tentang Kami', url: '/about' },
              { id: 'cn_3', title: 'Layanan', url: '/services' },
              { id: 'cn_4', title: 'Kontak', url: '/contact' }
            ],
            styles: { bgMode: 'glass', navStyle: 'glass', navAlign: 'split', isSticky: true, brandGlyph: '◆', paddingY: 16 }
          },
          {
            id: 'cnt_hero',
            type: 'hero',
            name: 'Hero Hubungi Kami',
            badge: 'KOMUNIKASI LANGSUNG',
            title: 'Mari Diskusikan Kebutuhan Proyek Strategis Anda',
            subtitle: 'Arsitek sistem dan konsultan solusi kami siap mendengarkan tantangan teknologi bisnis Anda.',
            buttonText: 'Isi Formulir Pesan',
            buttonUrl: '#form-kontak',
            isVisible: true,
            isLocked: false,
            styles: { align: 'center', paddingY: 60, bgMode: 'transparent' }
          },
          {
            id: 'cnt_form',
            type: 'formcontrol',
            name: 'Formulir Kontak Resmi',
            badge: 'FORMULIR INQUIRY',
            title: 'Sampaikan Rincian Kebutuhan Anda',
            subtitle: 'Kami menjamin kerahasiaan informasi proyek Anda melalui kesepakatan NDA standar industri.',
            buttonText: 'Kirimkan Pesan Sekarang',
            isVisible: true,
            isLocked: false,
            items: [
              { id: 'cf_1', title: 'Nama Lengkap & Jabatan', label: 'Contoh: Budi Santoso (CTO)', tag: 'text' },
              { id: 'cf_2', title: 'Email Perusahaan', label: 'budi@perusahaan.com', tag: 'email' },
              { id: 'cf_3', title: 'Kategori Layanan yang Dibutuhkan', label: 'Cloud Migration / Web Platform', tag: 'select' },
              { id: 'cf_4', title: 'Gambaran Singkat Rencana Proyek', label: 'Jelaskan perkiraan timeline dan tujuan utama...', tag: 'textarea' }
            ],
            styles: { paddingY: 56, align: 'center', bgMode: 'glass', borderRadius: 16 }
          },
          {
            id: 'cnt_footer',
            type: 'footer',
            name: 'Site Footer',
            title: 'AetherCorp Platform Suite',
            subtitle: 'Hak Cipta © 2026 AetherCorp Enterprise. Dilindungi Undang-Undang.',
            isVisible: true,
            isLocked: false,
            styles: { paddingY: 36, align: 'center', bgMode: 'transparent' }
          }
        ]
      }
    ],
    blocks: [
      {
        id: 'home_nav',
        type: 'navbar',
        name: 'Header & Navigasi Utama',
        title: 'AetherCorp',
        buttonText: 'Konsultasi Gratis',
        buttonUrl: '/contact',
        isVisible: true,
        isLocked: false,
        items: [
          { id: 'hn_1', title: 'Beranda', url: '/' },
          { id: 'hn_2', title: 'Tentang Kami', url: '/about' },
          { id: 'hn_3', title: 'Layanan', url: '/services' },
          { id: 'hn_4', title: 'Kontak', url: '/contact' }
        ],
        styles: { bgMode: 'glass', navStyle: 'glass', navAlign: 'split', isSticky: true, brandGlyph: '◆', paddingY: 16 }
      },
      {
        id: 'home_hero',
        type: 'hero',
        name: 'Hero Showcase Korporat',
        badge: '◆ ENTERPRISE MULTI-PAGE PLATFORM',
        title: 'Solusi Rekayasa Digital & Cloud Enterprise',
        subtitle: 'Menghadirkan ekosistem perangkat lunak berkinerja tinggi, isolasi kontainer aman, dan skalabilitas tanpa batas.',
        buttonText: 'Eksplorasi Layanan',
        buttonUrl: '/services',
        secondaryButtonText: 'Tentang Perusahaan',
        secondaryButtonUrl: '/about',
        isVisible: true,
        isLocked: false,
        styles: { align: 'center', paddingY: 72, bgMode: 'transparent' }
      },
      {
        id: 'home_features',
        type: 'features',
        name: 'Pilar Keunggulan Teknologi',
        badge: 'PONDASI SISTEM',
        title: 'Keandalan Tingkat Tinggi untuk Bisnis Kritis',
        subtitle: 'Dirancang untuk ketahanan beban jutaan transaksi tanpa kompromi.',
        isVisible: true,
        isLocked: false,
        items: [
          { id: 'hf_1', title: 'Orkestrasi Mandiri Traefik v3', desc: 'Routing otomatis dengan penerbitan SSL TLS v1.3 Let\'s Encrypt.', icon: 'globe' },
          { id: 'hf_2', title: 'Isolasi Memori Linux cgroups v2', desc: 'Proteksi sumber daya RAM dan CPU per-kontainer tanpa bottleneck.', icon: 'server' },
          { id: 'hf_3', title: 'Telemetri Realtime Kafka & Redis', desc: 'Pemrosesan data mikrodetik dengan analitik streaming latensi ultra-rendah.', icon: 'trending-up' }
        ],
        styles: { paddingY: 60, align: 'center', bgMode: 'transparent' }
      },
      {
        id: 'home_cta',
        type: 'cta',
        name: 'Call To Action Beranda',
        title: 'Siap Mempercepat Transformasi Digital Anda?',
        subtitle: 'Jadwalkan sesi konsultasi strategis bersama arsitek sistem senior kami hari ini.',
        buttonText: 'Hubungi Tim Ahli',
        buttonUrl: '/contact',
        isVisible: true,
        isLocked: false,
        styles: { paddingY: 52, align: 'center', bgMode: 'glass', borderRadius: 16 }
      },
      {
        id: 'home_footer',
        type: 'footer',
        name: 'Site Footer',
        title: 'AetherCorp Platform Suite',
        subtitle: 'Hak Cipta © 2026 AetherCorp Enterprise. Dilindungi Undang-Undang.',
        isVisible: true,
        isLocked: false,
        styles: { paddingY: 36, align: 'center', bgMode: 'transparent' }
      }
    ]
  },
  {
    id: 'tpl_ecommerce_store',
    title: 'Toko Online Modern & Katalog Penjualan Produk (E-Commerce)',
    category: 'business',
    tier: 'Included in Plan',
    priceText: 'Gratis dalam Kuota',
    isPro: false,
    desc: 'Website toko online instan untuk jualan produk retail, fashion, kuliner, dan barang UMKM. Dilengkapi etalase produk dengan harga Rupiah, keranjang belanja interaktif, promo diskon, dan checkout langsung ke WhatsApp penjual.',
    features: [
      'Etalase Produk Lengkap & Tag Diskon Coret',
      'Checkout Otomatis Direct WhatsApp Penjual',
      'Keranjang Belanja Cepat & Estimasi Ongkir',
      'Integrasi Pembayaran QRIS & Rekening Toko',
      'Peringkat SEO Google Shopping & Mobile Responsif'
    ],
    accentColor: '#ea580c',
    fontFamily: 'Plus Jakarta Sans',
    defaultRole: 'Toko Online Resmi & Retail Store',
    defaultBio: 'Pusat belanja produk original berkualitas dengan promo diskon harian, garansi resmi 100%, dan pengiriman cepat ke seluruh Indonesia.',
    lighthouseScore: 100,
    author: 'Hero Commerce Core',
    rating: 4.99,
    downloadsCount: 3820,
    isFeatured: true,
    layoutType: 'E-Commerce Store & WhatsApp Checkout',
    tags: ['Toko Online', 'Jualan Produk', 'WhatsApp Checkout', 'E-Commerce UMKM', 'Diskon Promo'],
    stats: {
      ttfb: '1.2ms',
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
        id: 'shop_nav',
        type: 'navbar',
        name: 'Header Toko Online',
        title: 'HeroStore Official',
        buttonText: 'Keranjang (3 Item)',
        buttonUrl: '#cart',
        isVisible: true,
        isLocked: false,
        styles: {
          bgMode: 'glass',
          paddingY: 16,
          accentColor: '#ea580c'
        }
      },
      {
        id: 'shop_hero',
        type: 'hero',
        name: 'Banner Promo & Jualan',
        badge: '🔥 FLASH SALE SPESIAL HARI INI • DISKON S.D 60%',
        title: 'Belanja Produk Favorit Anda dengan Harga Terbaik & Garansi Resmi',
        subtitle: 'Koleksi lengkap barang berkualitas, jaminan produk original 100%, pengiriman cepat, dan kemudahan transaksi langsung via WhatsApp.',
        buttonText: 'Beli Sekarang / Lihat Etalase',
        buttonUrl: '#products',
        secondaryButtonText: 'Chat WhatsApp Penjual',
        secondaryButtonUrl: 'https://wa.me/6281234567890?text=Halo%20Admin,%20saya%20ingin%20tanya%20produk%20promo%20HeroStore',
        isVisible: true,
        isLocked: false,
        styles: {
          align: 'center',
          paddingY: 54,
          accentColor: '#ea580c'
        }
      },
      {
        id: 'shop_stats',
        type: 'stats',
        name: 'Jaminan & Kepercayaan Toko',
        title: 'Komitmen Belanja Aman',
        subtitle: 'Kepuasan dan keamanan transaksi ribuan pembeli adalah prioritas kami.',
        isVisible: true,
        isLocked: false,
        items: [
          { id: 's1', title: '50.000+', desc: 'Pesanan Sukses Dikirim' },
          { id: 's2', title: '100%', desc: 'Jaminan Originalitas' },
          { id: 's3', title: '4.98 / 5.0', desc: 'Rating Pembeli Puas' },
          { id: 's4', title: '< 5 Menit', desc: 'Respon CS WhatsApp' }
        ],
        styles: {
          paddingY: 36,
          bgMode: 'glass',
          accentColor: '#ea580c'
        }
      },
      {
        id: 'shop_products',
        type: 'card',
        name: 'Etalase Produk Paling Laris',
        badge: 'PRODUK BEST SELLER',
        title: 'Etalase Produk Unggulan & Promo Terbatas',
        subtitle: 'Pilih produk favorit Anda, klik beli, dan pesanan akan otomatis terhubung ke WhatsApp penjual.',
        isVisible: true,
        isLocked: false,
        items: [
          {
            id: 'prod1',
            title: 'Wireless Noise-Cancelling Headphones Pro',
            desc: 'Suara bass bertenaga, daya tahan baterai 45 jam, mikrofon ultra jernih untuk panggilan, dan ear cushion memory foam empuk.',
            price: 'Rp 349.000 (Hemat 50%)',
            tag: 'Diskon 50% • Best Seller'
          },
          {
            id: 'prod2',
            title: 'Smart Ergonomic Backpack Anti Air & USB Port',
            desc: 'Material kain Oxford waterproof, kompartemen laptop 16 inci aman dengan busa tebal, dan slot botol minuman ergonomis.',
            price: 'Rp 219.000 (Hemat 45%)',
            tag: 'Flash Sale • Terlaris'
          },
          {
            id: 'prod3',
            title: 'Jam Tangan Pintar AMOLED Sport Edition IP68',
            desc: 'Pelacak kebugaran 120+ mode olahraga, sensor detak jantung 24 jam, notifikasi WhatsApp masuk, dan baterai tahan 14 hari.',
            price: 'Rp 489.000 (Hemat 40%)',
            tag: 'Garansi 1 Thn • Gratis Ongkir'
          }
        ],
        styles: {
          paddingY: 48,
          accentColor: '#ea580c'
        }
      },
      {
        id: 'shop_features',
        type: 'features',
        name: 'Keunggulan Belanja',
        badge: 'KEUNGGULAN KAMI',
        title: 'Kenapa Harus Belanja di Toko Kami?',
        subtitle: 'Layanan purna jual terbaik untuk menjamin kenyamanan setiap transaksi Anda.',
        isVisible: true,
        isLocked: false,
        items: [
          {
            id: 'f1',
            title: 'Gratis Ongkir Seluruh Indonesia',
            desc: 'Nikmati subsidi bebas ongkos kirim ke seluruh kota dengan ekspedisi terpercaya.'
          },
          {
            id: 'f2',
            title: 'Garansi Retur & Uang Kembali 7 Hari',
            desc: 'Barang tidak sesuai atau rusak saat pengiriman? Kami ganti baru tanpa ribet.'
          },
          {
            id: 'f3',
            title: 'Bisa Bayar di Tempat (COD) & QRIS',
            desc: 'Pilihan metode pembayaran fleksibel: transfer bank, QRIS instan, atau bayar tunai saat kurir tiba.'
          }
        ],
        styles: {
          paddingY: 48,
          accentColor: '#ea580c'
        }
      },
      {
        id: 'shop_cta',
        type: 'cta',
        name: 'Call to Action Jualan',
        badge: 'ORDER CEPAT WHATSAPP',
        title: 'Ingin Pesan Sekarang atau Tanya Ketersediaan Varian?',
        subtitle: 'Admin kami yang ramah siap melayani pesanan Anda langsung via WhatsApp dengan respon super cepat.',
        buttonText: 'Chat & Beli via WhatsApp',
        buttonUrl: 'https://wa.me/6281234567890?text=Halo%20Admin,%20saya%20mau%20order%20produk%20di%20HeroStore',
        isVisible: true,
        isLocked: false,
        styles: {
          paddingY: 54,
          bgMode: 'glass',
          accentColor: '#ea580c'
        }
      },
      {
        id: 'shop_footer',
        type: 'footer',
        name: 'Footer Toko',
        title: 'HeroStore Official Store',
        content: '© 2026 PT Hero Niaga Retail. Pusat belanja online resmi dan terpercaya di Indonesia.',
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
    author: 'Aether Core Platform',
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
            title: 'Stack Studio Enterprise (Aether Core)',
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
        title: 'Stack Studio',
        content: '© 2026 Rizal Pratama. Didukung infrastruktur kontainer otonom Aether Core Stack.',
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
    author: 'Aether Core Publishing Lab',
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
            title: 'Arsitektur Multi-Tenant Aether Core Stack dengan PostgreSQL RLS',
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
