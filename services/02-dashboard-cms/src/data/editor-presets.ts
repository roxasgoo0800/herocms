import type { VisualBlock } from '../types/dashboard';

export type DevicePreset = 'desktop' | 'laptop' | 'tablet' | 'mobile' | 'custom';

export const zoomPresets = [
  { value: 0.5, label: '50%' },
  { value: 0.75, label: '75%' },
  { value: 0.85, label: '85%' },
  { value: 1.0, label: '100%' },
  { value: 1.25, label: '125%' },
  { value: 1.5, label: '150%' },
];

export const devicePresets: Record<Exclude<DevicePreset, 'custom'>, { w: number; h: number; name: string }> = {
  desktop: { w: 1440, h: 920, name: 'Desktop (1440px)' },
  laptop: { w: 1024, h: 800, name: 'Laptop (1024px)' },
  tablet: { w: 768, h: 1024, name: 'Tablet (768px)' },
  mobile: { w: 375, h: 812, name: 'Mobile (375px)' }
};

export const fontFamilies = [
  { id: 'Inter', name: 'Inter (Sleek Clean)' },
  { id: 'Plus Jakarta Sans', name: 'Plus Jakarta Sans (Modern Modernist)' },
  { id: 'Outfit', name: 'Outfit (Geometric Premium)' },
  { id: 'Syne', name: 'Syne (Avant-Garde Display)' },
  { id: 'Fira Code', name: 'Fira Code (Developer Mono)' }
];

export const colorPalettes = [
  { name: 'Obsidian Noir', hex: '#0f172a' },
  { name: 'Midnight Slate', hex: '#1e293b' },
  { name: 'Deep Sapphire', hex: '#1e3a8a' },
  { name: 'Forest Emerald', hex: '#064e3b' },
  { name: 'Titanium Steel', hex: '#334155' },
  { name: 'Royal Indigo', hex: '#312e81' },
  { name: 'Electric Cyan', hex: '#00f2fe' },
  { name: 'Crimson Burgundy', hex: '#881337' }
];

// -----------------------------------------------------------------------------
// Block Catalog Metadata & Wireframe Types for Canva/Figma-Style Element Picker
// -----------------------------------------------------------------------------

export type BlockCategory = 'all' | 'nav' | 'content' | 'ui' | 'forms' | 'media' | 'commerce';

export interface BlockCatalogItem {
  id: string;
  type: VisualBlock['type'];
  category: Exclude<BlockCategory, 'all'>;
  name: string;
  desc: string;
  badge?: string;
  previewWireframe:
    | 'navbar'
    | 'hero'
    | 'features'
    | 'progressbar'
    | 'accordion'
    | 'carousel'
    | 'formcontrol'
    | 'modal'
    | 'pagination'
    | 'dropdown'
    | 'card'
    | 'listgroup'
    | 'pricing'
    | 'cta'
    | 'stats'
    | 'breadcrumb'
    | 'footer';
}

export const blockCategories: Array<{ id: BlockCategory; label: string; icon?: string }> = [
  { id: 'all', label: 'Semua Blok' },
  { id: 'nav', label: 'Navigasi & Header' },
  { id: 'content', label: 'Konten & Hero' },
  { id: 'ui', label: 'Elemen UI' },
  { id: 'forms', label: 'Form & Kontrol' },
  { id: 'media', label: 'Slide & Carousel' },
  { id: 'commerce', label: 'Bisnis & Konversi' }
];

export const blockCatalogItems: BlockCatalogItem[] = [
  {
    id: 'cat_navbar',
    type: 'navbar',
    category: 'nav',
    name: 'Navbar Glassmorphism',
    desc: 'Header navigasi transparan dengan logo brand, menu link, dan tombol aksi CTA.',
    badge: 'NAVIGASI',
    previewWireframe: 'navbar'
  },
  {
    id: 'cat_hero',
    type: 'hero',
    category: 'content',
    name: 'Hero Showcase Section',
    desc: 'Banner visual tajam dengan ambient glow, headline memukau, dan dual button aksi.',
    badge: 'UTAMA',
    previewWireframe: 'hero'
  },
  {
    id: 'cat_features',
    type: 'features',
    category: 'content',
    name: 'Bento Features Grid',
    desc: 'Grid 3 kartu keunggulan modern dengan ikon melayang dan deskripsi singkat.',
    badge: 'POPULER',
    previewWireframe: 'features'
  },
  {
    id: 'cat_progressbar',
    type: 'progressbar',
    category: 'ui',
    name: 'Progress Bar & Metrik',
    desc: 'Bar indikator progres persentase dengan animasi garis glow neon untuk performa/kapasitas.',
    badge: 'INTERAKTIF',
    previewWireframe: 'progressbar'
  },
  {
    id: 'cat_accordion',
    type: 'accordion',
    category: 'ui',
    name: 'Accordion & Collapse FAQ',
    desc: 'Daftar pertanyaan dan jawaban yang dapat diciutkan/dilebarkan dengan transisi halus.',
    badge: 'FAQ',
    previewWireframe: 'accordion'
  },
  {
    id: 'cat_carousel',
    type: 'carousel',
    category: 'media',
    name: 'Slide & Banner Carousel',
    desc: 'Slider presentasi horizontal dengan tombol prev/next dan indikator titik halaman.',
    badge: 'SLIDER',
    previewWireframe: 'carousel'
  },
  {
    id: 'cat_formcontrol',
    type: 'formcontrol',
    category: 'forms',
    name: 'Formulir Kontak & Kontrol',
    desc: 'Grup input field, dropdown select, dan area pesan untuk menangkap prospek pengunjung.',
    badge: 'FORM',
    previewWireframe: 'formcontrol'
  },
  {
    id: 'cat_card',
    type: 'card',
    category: 'content',
    name: 'Grid Kartu Showcase',
    desc: 'Tampilan kartu portofolio dan produk dengan tag kategori, deskripsi, dan hover glow.',
    badge: 'KARTU',
    previewWireframe: 'card'
  },
  {
    id: 'cat_modal',
    type: 'modal',
    category: 'ui',
    name: 'Modal Dialog & Popup',
    desc: 'Kotak dialog melayang dengan latar belakang blur untuk pengumuman atau penawaran khusus.',
    badge: 'POPUP',
    previewWireframe: 'modal'
  },
  {
    id: 'cat_dropdown',
    type: 'dropdown',
    category: 'ui',
    name: 'Dropdown Filter & Pilihan',
    desc: 'Menu pilihan seleksi bertingkat untuk menyaring kategori konten atau bahasa.',
    badge: 'SELEKSI',
    previewWireframe: 'dropdown'
  },
  {
    id: 'cat_listgroup',
    type: 'listgroup',
    category: 'content',
    name: 'Daftar List Group & Cek',
    desc: 'Daftar checklist vertikal terstruktur dengan ikon centang status dan deskripsi rinci.',
    badge: 'LIST',
    previewWireframe: 'listgroup'
  },
  {
    id: 'cat_pricing',
    type: 'pricing',
    category: 'commerce',
    name: 'Tabel Harga / Paket',
    desc: 'Daftar komparasi paket langganan transparan dengan badge pilihan terpopuler.',
    badge: 'HARGA',
    previewWireframe: 'pricing'
  },
  {
    id: 'cat_stats',
    type: 'stats',
    category: 'commerce',
    name: 'Metrik & Counter Telemetri',
    desc: 'Grid angka statistik besar untuk membangun kepercayaan pelanggan (SLA, kunjungan, latensi).',
    badge: 'METRIK',
    previewWireframe: 'stats'
  },
  {
    id: 'cat_cta',
    type: 'cta',
    category: 'commerce',
    name: 'Call To Action Banner',
    desc: 'Area ajakan konversi pengunjung berlatar gradasi intens dengan tombol aksi kontras.',
    badge: 'KONVERSI',
    previewWireframe: 'cta'
  },
  {
    id: 'cat_pagination',
    type: 'pagination',
    category: 'nav',
    name: 'Pagination Bar Navigasi',
    desc: 'Komponen nomor halaman horizontal lengkap dengan tombol sebelumnya dan selanjutnya.',
    badge: 'PAGINASI',
    previewWireframe: 'pagination'
  },
  {
    id: 'cat_breadcrumb',
    type: 'breadcrumb',
    category: 'nav',
    name: 'Navigasi Breadcrumb',
    desc: 'Petunjuk jejak lokasi hierarki halaman untuk navigasi cepat pengguna.',
    badge: 'JEJAK',
    previewWireframe: 'breadcrumb'
  },
  {
    id: 'cat_footer',
    type: 'footer',
    category: 'nav',
    name: 'Site Footer & Hak Cipta',
    desc: 'Penutup halaman dengan identitas brand, navigasi sekunder, dan legalitas hak cipta.',
    badge: 'FOOTER',
    previewWireframe: 'footer'
  }
];

// -----------------------------------------------------------------------------
// Initial Page Seed
// -----------------------------------------------------------------------------

export const createDefaultBlocks = (siteName: string, role: string, bio: string): VisualBlock[] => {
  return [
    {
      id: 'nav_1',
      type: 'navbar',
      name: 'Navigation Bar',
      title: siteName,
      buttonText: 'Hubungi Saya',
      buttonUrl: '#contact',
      isVisible: true,
      isLocked: false,
      styles: {
        bgMode: 'glass',
        paddingY: 16,
        backdropBlur: 16
      }
    },
    {
      id: 'hero_1',
      type: 'hero',
      name: 'Hero Showcase Section',
      badge: '◆ CLOUD NATIVE PLATFORM',
      title: role,
      subtitle: bio,
      buttonText: 'Eksplorasi Karya',
      buttonUrl: '#showcase',
      secondaryButtonText: 'Dokumentasi Sistem',
      secondaryButtonUrl: '#features',
      isVisible: true,
      isLocked: false,
      styles: {
        align: 'center',
        paddingY: 72,
        bgMode: 'transparent'
      }
    },
    {
      id: 'features_1',
      type: 'features',
      name: 'Fitur & Keunggulan',
      badge: 'ARSITEKTUR UTAMA',
      title: 'Pondasi Infrastruktur Modern',
      subtitle: 'Standar rekayasa perangkat lunak tingkat tinggi dengan isolasi runtime kontainer mandiri.',
      isVisible: true,
      isLocked: false,
      items: [
        {
          id: 'feat_1',
          title: 'Orkestrasi Kontainer Otonom',
          desc: 'Berjalan pada runtime Docker Engine terisolasi penuh dengan kontrol cgroups v2 kernel Linux.',
          icon: 'server'
        },
        {
          id: 'feat_2',
          title: 'Edge Ingress Traefik v3',
          desc: 'Rute proxy pintar berkecepatan tinggi dengan sertifikat SSL Let\'s Encrypt TLS v1.3 otomatis.',
          icon: 'globe'
        },
        {
          id: 'feat_3',
          title: 'Telemetri Real-Time Kafka',
          desc: 'Pencatatan statistik kunjungan mikrodetik dengan antrean Kafka stream dan Redis database.',
          icon: 'trending-up'
        }
      ],
      styles: {
        paddingY: 60,
        align: 'center',
        bgMode: 'transparent'
      }
    },
    {
      id: 'pricing_1',
      type: 'pricing',
      name: 'Paket & Layanan',
      badge: 'TRANSPARAN & EFEKTIF',
      title: 'Pilihan Kapasitas Fleksibel',
      subtitle: 'Disesuaikan dengan volume pengunjung dan kebutuhan isolasi komputasi Anda.',
      isVisible: true,
      isLocked: false,
      items: [
        {
          id: 'price_1',
          title: 'Starter Single Site',
          price: 'Rp 49.000',
          period: '/ bln',
          tag: 'Hemat',
          desc: 'Satu runtime kontainer mandiri dengan subdomain kustom dan SSL gratis.',
          features: ['1 Kontainer Docker', '0.5 vCPU • 256MB RAM', 'Traefik TLS Ingress', 'SLA 99.9% Uptime']
        },
        {
          id: 'price_2',
          title: 'Pro Multi-Container',
          price: 'Rp 149.000',
          period: '/ bln',
          tag: 'Terpopuler',
          desc: 'Tiga kontainer mandiri untuk portofolio, blog editorial, dan showcase bisnis.',
          features: ['3 Kontainer Otonom', '1.5 vCPU • 768MB RAM', 'Domain Kustom Bebas', 'Dukungan Prioritas 24/7']
        },
        {
          id: 'price_3',
          title: 'Agency Cluster',
          price: 'Rp 399.000',
          period: '/ bln',
          tag: 'Enterprise',
          desc: 'Sepuluh kontainer dengan alokasi memori dedicated untuk agensi dan korporasi.',
          features: ['10 Kontainer Cluster', 'NVMe Storage 10GB', 'Kafka Telemetry Realtime', 'Custom DNS Ingress']
        }
      ],
      styles: {
        paddingY: 60,
        align: 'center',
        bgMode: 'transparent'
      }
    },
    {
      id: 'cta_1',
      type: 'cta',
      name: 'Call to Action Banner',
      title: 'Siap Meluncurkan Website Mandiri Anda?',
      subtitle: 'Deploy situs pertama Anda dalam hitungan detik tanpa pusing mengelola server manual.',
      buttonText: 'Mulai Sekarang — Gratis',
      buttonUrl: '#start',
      isVisible: true,
      isLocked: false,
      styles: {
        paddingY: 50,
        align: 'center',
        bgMode: 'glass',
        borderRadius: 20
      }
    },
    {
      id: 'footer_1',
      type: 'footer',
      name: 'Site Footer',
      title: siteName,
      subtitle: 'Didukung penuh oleh HeroCMS Studio • Arsitektur Docker & Traefik v3',
      isVisible: true,
      isLocked: false,
      styles: {
        paddingY: 36,
        align: 'center',
        bgMode: 'transparent'
      }
    }
  ];
};

// -----------------------------------------------------------------------------
// Generator for All 17 Block Types from Catalog
// -----------------------------------------------------------------------------

export const createLibraryBlock = (type: VisualBlock['type']): VisualBlock => {
  const newId = `${type}_${Date.now() % 10000}`;
  switch (type) {
    case 'navbar':
      return {
        id: newId,
        type: 'navbar',
        name: 'Header & Navigasi Kustom',
        title: 'HeroStudio',
        buttonText: 'Mulai Sekarang',
        buttonUrl: '#',
        isVisible: true,
        isLocked: false,
        styles: { bgMode: 'glass', paddingY: 16, backdropBlur: 16 }
      };

    case 'hero':
      return {
        id: newId,
        type: 'hero',
        name: 'Hero Showcase Baru',
        badge: 'NEW ARRIVAL',
        title: 'Judul Hero Menawan',
        subtitle: 'Kombinasi visual memukau yang menghadirkan impresi premium bagi audiens Anda.',
        buttonText: 'Mulai Sekarang',
        buttonUrl: '#',
        secondaryButtonText: 'Dokumentasi',
        secondaryButtonUrl: '#',
        isVisible: true,
        isLocked: false,
        styles: { align: 'center', paddingY: 64, bgMode: 'transparent' }
      };

    case 'features':
      return {
        id: newId,
        type: 'features',
        name: 'Fitur Grid 3 Kolom',
        badge: 'KEUNGGULAN',
        title: 'Solusi Lengkap & Komprehensif',
        subtitle: 'Dibuat untuk memberikan nilai terbaik bagi pengembangan produk Anda.',
        isVisible: true,
        isLocked: false,
        items: [
          { id: 'f1', title: 'Performa Tinggi', desc: 'Respon milidetik dengan Traefik v3 proxy.', icon: 'server' },
          { id: 'f2', title: 'Aman & Terisolasi', desc: 'Linux cgroups v2 kernel sandboxing.', icon: 'globe' },
          { id: 'f3', title: 'Analitik Realtime', desc: 'Integrasi Kafka dan Redis pipeline.', icon: 'trending-up' }
        ],
        styles: { paddingY: 60, align: 'center', bgMode: 'transparent' }
      };

    case 'progressbar':
      return {
        id: newId,
        type: 'progressbar',
        name: 'Indikator Progres & Metrik',
        badge: 'TELEMETRI SISTEM',
        title: 'Pencapaian Kapasitas & Performa',
        subtitle: 'Status real-time alokasi sumber daya dan ketahanan infrastruktur aplikasi.',
        isVisible: true,
        isLocked: false,
        items: [
          { id: 'pb1', title: 'Optimalisasi Core Web Vitals', desc: 'Lighthouse Score 99/100', percentage: 95 },
          { id: 'pb2', title: 'Alokasi Memori Docker Kontainer', desc: '184MB / 256MB cgroups limit', percentage: 72 },
          { id: 'pb3', title: 'Ketahanan SSL & TLS Ingress', desc: 'A+ Grade Let\'s Encrypt Auto-Renewal', percentage: 100 },
          { id: 'pb4', title: 'Integritas Row-Level Security', desc: '100% data multi-tenant terisolasi', percentage: 100 }
        ],
        styles: { paddingY: 56, align: 'left', bgMode: 'glass' }
      };

    case 'accordion':
      return {
        id: newId,
        type: 'accordion',
        name: 'Accordion & Collapse FAQ',
        badge: 'PERTANYAAN UMUM',
        title: 'Tanya Jawab & Bantuan Teknis',
        subtitle: 'Klik setiap pertanyaan untuk melihat panduan dan penjelasan detail seputar sistem.',
        isVisible: true,
        isLocked: false,
        activeItemIndex: 0,
        items: [
          { id: 'ac1', title: 'Bagaimana cara kerja isolasi kontainer per tenant?', desc: 'Setiap website berjalan di dalam kontainer Docker mandiri dengan Linux cgroups v2 sehingga sumber daya CPU dan RAM terjamin tidak bocor ke tenant lain.' },
          { id: 'ac2', title: 'Apakah sertifikat SSL diterbitkan otomatis?', desc: 'Ya, Traefik v3 secara otomatis mendeteksi domain baru dan menerbitkan sertifikat Let\'s Encrypt dalam hitungan detik tanpa downtime.' },
          { id: 'ac3', title: 'Dapatkah saya menghubungkan custom domain sendiri?', desc: 'Sangat bisa. Cukup arahkan CNAME ke ingress server kami, dan sistem akan memverifikasi DNS dalam waktu singkat.' },
          { id: 'ac4', title: 'Apakah data saya diamankan dengan backup berkala?', desc: 'PostgreSQL 16 dan Redis kami memiliki volume persistent terenkripsi dan snapshot otomatis setiap 24 jam.' }
        ],
        styles: { paddingY: 56, align: 'center', bgMode: 'transparent' }
      };

    case 'carousel':
      return {
        id: newId,
        type: 'carousel',
        name: 'Slide & Carousel Banner',
        badge: 'SHOWCASE INTERAKTIF',
        title: 'Sorotan Portofolio & Pelanggan',
        subtitle: 'Geser banner untuk melihat preview karya dan rilis fitur terbaru.',
        isVisible: true,
        isLocked: false,
        activeItemIndex: 0,
        items: [
          { id: 'sl1', title: 'Ekosistem Cloud-Native Terpadu', desc: 'Orkestrasi kontainer mandiri dengan konsumsi memori hemat dan respon ultra-cepat.', tag: 'Rilis 2.4', author: 'DevOps Lead', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80' },
          { id: 'sl2', title: 'Studio Visual Tingkat Enterprise', desc: 'Editor drag-and-drop canggih dengan kontrol piksel presisi dan mode pratinjau multi-perangkat.', tag: 'Featured', author: 'Design Architect', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80' },
          { id: 'sl3', title: 'AI Copilot & Otomasi Konten', desc: 'Hasilkan artikel blog, palet warna kustom, dan optimasi SEO hanya dalam hitungan detik.', tag: 'AI Powered', author: 'AI Specialist', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80' }
        ],
        styles: { paddingY: 60, align: 'center', bgMode: 'glass' }
      };

    case 'formcontrol':
      return {
        id: newId,
        type: 'formcontrol',
        name: 'Formulir Kontak & Kontrol',
        badge: 'HUBUNGI KAMI',
        title: 'Kirimkan Pesan atau Pertanyaan',
        subtitle: 'Tim teknis kami siap merespons kebutuhan Anda dalam waktu kurang dari 24 jam.',
        buttonText: 'Kirim Pesan Sekarang',
        isVisible: true,
        isLocked: false,
        items: [
          { id: 'fc1', title: 'Nama Lengkap', label: 'Masukkan nama Anda', tag: 'text' },
          { id: 'fc2', title: 'Alamat Email', label: 'name@company.com', tag: 'email' },
          { id: 'fc3', title: 'Kategori Kebutuhan', label: 'Pilih Layanan', tag: 'select' },
          { id: 'fc4', title: 'Detail Kebutuhan Proyek', label: 'Jelaskan tujuan dan perkiraan volume pengunjung...', tag: 'textarea' }
        ],
        styles: { paddingY: 60, align: 'center', bgMode: 'glass', borderRadius: 16 }
      };

    case 'modal':
      return {
        id: newId,
        type: 'modal',
        name: 'Modal Dialog & Popup',
        badge: 'POPUP PROMOSI',
        title: 'Dapatkan Akses Awal Fitur Pro',
        subtitle: 'Daftarkan email Anda sekarang untuk mendapatkan diskon 50% paket tahunan dan bonus domain kustom.',
        buttonText: 'Klaim Promo Sekarang',
        secondaryButtonText: 'Nanti Saja',
        isOpen: true,
        isVisible: true,
        isLocked: false,
        styles: { paddingY: 48, align: 'center', bgMode: 'glass' }
      };

    case 'pagination':
      return {
        id: newId,
        type: 'pagination',
        name: 'Pagination Bar Navigasi',
        title: 'Navigasi Halaman Data',
        subtitle: 'Menampilkan 1-10 dari 128 artikel',
        activeItemIndex: 1,
        isVisible: true,
        isLocked: false,
        items: [
          { id: 'pg1', title: '1', active: false },
          { id: 'pg2', title: '2', active: true },
          { id: 'pg3', title: '3', active: false },
          { id: 'pg4', title: '4', active: false },
          { id: 'pg5', title: '5', active: false }
        ],
        styles: { paddingY: 32, align: 'center', bgMode: 'transparent' }
      };

    case 'dropdown':
      return {
        id: newId,
        type: 'dropdown',
        name: 'Dropdown Filter & Pilihan',
        badge: 'FILTER DATA',
        title: 'Pilih Kategori Tampilan',
        subtitle: 'Filter konten berdasarkan kategori atau status publikasi.',
        activeItemIndex: 0,
        isOpen: false,
        isVisible: true,
        isLocked: false,
        items: [
          { id: 'dp1', title: 'Semua Kategori', desc: 'Menampilkan seluruh koleksi' },
          { id: 'dp2', title: 'Arsitektur Cloud & Docker', desc: 'Artikel teknis kontainer' },
          { id: 'dp3', title: 'Panduan Desain & UI/UX', desc: 'Standar estetika studio' },
          { id: 'dp4', title: 'Update Rilis Produk', desc: 'Catatan perubahan terbaru' }
        ],
        styles: { paddingY: 36, align: 'left', bgMode: 'transparent' }
      };

    case 'card':
      return {
        id: newId,
        type: 'card',
        name: 'Grid Kartu Showcase',
        badge: 'KARYA TERBARU',
        title: 'Koleksi Portofolio & Proyek',
        subtitle: 'Eksplorasi implementasi sistem dan aplikasi modern yang telah kami bangun.',
        isVisible: true,
        isLocked: false,
        items: [
          { id: 'c1', title: 'Dashboard Finansial Pro', desc: 'Analitik real-time dengan streaming transaksi Kafka dan PostgreSQL RLS.', tag: 'Fintech', role: 'Fullstack' },
          { id: 'c2', title: 'SaaS Multi-Tenant Engine', desc: 'Manajemen kontainer otonom dengan isolasi memori dan otomatisasi SSL.', tag: 'Cloud Platform', role: 'DevOps' },
          { id: 'c3', title: 'AI Copilot Studio', desc: 'Generasi visual dan konten editorial berbasis LLM dengan latensi rendah.', tag: 'Artificial Intelligence', role: 'AI Eng' }
        ],
        styles: { paddingY: 60, align: 'center', bgMode: 'transparent' }
      };

    case 'listgroup':
      return {
        id: newId,
        type: 'listgroup',
        name: 'Daftar List Group & Cek',
        badge: 'CHECKLIST FITUR',
        title: 'Kemampuan Platform HeroCMS',
        subtitle: 'Seluruh spesifikasi teknis dibangun untuk keandalan dan kecepatan tinggi.',
        isVisible: true,
        isLocked: false,
        items: [
          { id: 'lg1', title: 'Dukungan Subdomain & Custom Domain Otomatis', desc: 'Mapping instan ke server proxy Traefik v3', tag: 'Aktif' },
          { id: 'lg2', title: 'Isolasi Memori & CPU via Linux cgroups v2', desc: 'Mencegah bottleneck performa antar kontainer', tag: 'Aktif' },
          { id: 'lg3', title: 'Penyimpanan Terdistribusi & Snapshot Harian', desc: 'Volume persistent NVMe dengan enkripsi AES-256', tag: 'Aktif' },
          { id: 'lg4', title: 'BFF Go High-Throughput & Vue 3 SSR', desc: 'Waktu muat halaman di bawah 50ms di seluruh dunia', tag: 'Aktif' }
        ],
        styles: { paddingY: 56, align: 'left', bgMode: 'glass' }
      };

    case 'pricing':
      return {
        id: newId,
        type: 'pricing',
        name: 'Tabel Harga / Paket',
        badge: 'INVESTASI',
        title: 'Pilihan Paket Layanan',
        subtitle: 'Skalabilitas tanpa batas untuk kebutuhan bisnis Anda.',
        isVisible: true,
        isLocked: false,
        items: [
          { id: 'p1', title: 'Standard', price: 'Rp 99.000', period: '/ bln', desc: 'Cocok untuk awal mulai.', features: ['1 Domain', 'SSL Otomatis', '0.5 vCPU'] },
          { id: 'p2', title: 'Premium', price: 'Rp 249.000', period: '/ bln', tag: 'Terpopuler', desc: 'Kapasitas maksimal.', features: ['3 Domain', 'Prioritas Support', '1.5 vCPU'] },
          { id: 'p3', title: 'Enterprise', price: 'Rp 499.000', period: '/ bln', desc: 'Skala penuh tanpa batas.', features: ['10 Domain', 'Dedicated Redis', 'Kafka Stream'] }
        ],
        styles: { paddingY: 60, align: 'center', bgMode: 'transparent' }
      };

    case 'stats':
      return {
        id: newId,
        type: 'stats',
        name: 'Metrik & Counter Telemetri',
        badge: 'TELEMETRI SISTEM',
        title: 'Statistik Skala Platform',
        subtitle: 'Angka terverifikasi dari jutaan permintaan yang diproses setiap hari.',
        isVisible: true,
        isLocked: false,
        items: [
          { id: 'st1', title: '99.98%', desc: 'SLA Ketersediaan Uptime' },
          { id: 'st2', title: '1.2ms', desc: 'Latensi Edge Ingress Traefik' },
          { id: 'st3', title: '12.8M+', desc: 'Permintaan API Diproses Tiap Hari' },
          { id: 'st4', title: '256MB', desc: 'Alokasi RAM Ringan per Kontainer' }
        ],
        styles: { paddingY: 56, align: 'center', bgMode: 'transparent' }
      };

    case 'cta':
      return {
        id: newId,
        type: 'cta',
        name: 'Call To Action',
        title: 'Wujudkan Ide Anda Hari Ini',
        subtitle: 'Bergabunglah bersama ribuan pengembang yang mempercayai HeroCMS Studio.',
        buttonText: 'Hubungi Kami',
        buttonUrl: '#',
        isVisible: true,
        isLocked: false,
        styles: { paddingY: 50, align: 'center', bgMode: 'glass', borderRadius: 16 }
      };

    case 'breadcrumb':
      return {
        id: newId,
        type: 'breadcrumb',
        name: 'Navigasi Breadcrumb',
        title: 'Jalur Halaman',
        isVisible: true,
        isLocked: false,
        items: [
          { id: 'bc1', title: 'Beranda', url: '#' },
          { id: 'bc2', title: 'Dokumentasi', url: '#' },
          { id: 'bc3', title: 'Katalog Blok', url: '#' },
          { id: 'bc4', title: 'Visual Editor', url: '#' }
        ],
        styles: { paddingY: 20, align: 'left', bgMode: 'transparent' }
      };

    case 'footer':
      return {
        id: newId,
        type: 'footer',
        name: 'Site Footer',
        title: 'HeroCMS Platform',
        subtitle: 'Hak Cipta © 2026 HeroCMS Studio. Dilindungi Undang-Undang.',
        isVisible: true,
        isLocked: false,
        styles: { paddingY: 36, align: 'center', bgMode: 'transparent' }
      };

    default:
      return {
        id: newId,
        type: 'hero',
        name: 'Blok Konten Baru',
        title: 'Bagian Konten',
        subtitle: 'Tuliskan deskripsi konten Anda di sini.',
        isVisible: true,
        isLocked: false,
        styles: { paddingY: 48, align: 'left', bgMode: 'transparent' }
      };
  }
};

// -----------------------------------------------------------------------------
// Typography, Animation, and Color Presets for Visual Rich Studio
// -----------------------------------------------------------------------------

export interface FontOption {
  id: string;
  name: string;
  family: string;
  category: 'sans' | 'serif' | 'display' | 'mono';
}

export const fontOptions: FontOption[] = [
  { id: 'inter', name: 'Inter (Sleek Clean)', family: "'Inter', system-ui, sans-serif", category: 'sans' },
  { id: 'plus-jakarta', name: 'Plus Jakarta Sans (Modern UI)', family: "'Plus Jakarta Sans', system-ui, sans-serif", category: 'sans' },
  { id: 'outfit', name: 'Outfit (Geometric High-End)', family: "'Outfit', system-ui, sans-serif", category: 'sans' },
  { id: 'poppins', name: 'Poppins (Friendly Tech)', family: "'Poppins', sans-serif", category: 'sans' },
  { id: 'playfair', name: 'Playfair Display (Luxury Serif)', family: "'Playfair Display', Georgia, serif", category: 'serif' },
  { id: 'fira-code', name: 'Fira Code (Developer Mono)', family: "'Fira Code', 'Courier New', monospace", category: 'mono' },
  { id: 'roboto', name: 'Roboto (Neutral Pro)', family: "'Roboto', sans-serif", category: 'sans' }
];

export interface ColorPreset {
  id: string;
  name: string;
  hex: string;
  textHex: string;
}

export const colorPresets: ColorPreset[] = [
  { id: 'slate', name: 'Deep Slate', hex: '#0f172a', textHex: '#0f172a' },
  { id: 'blue', name: 'Royal Blue', hex: '#2563eb', textHex: '#2563eb' },
  { id: 'sky', name: 'Sky Cyan', hex: '#0284c7', textHex: '#0284c7' },
  { id: 'emerald', name: 'Emerald Green', hex: '#059669', textHex: '#059669' },
  { id: 'amber', name: 'Amber Gold', hex: '#d97706', textHex: '#d97706' },
  { id: 'rose', name: 'Rose Red', hex: '#e11d48', textHex: '#e11d48' },
  { id: 'violet', name: 'Ultra Violet', hex: '#7c3aed', textHex: '#7c3aed' },
  { id: 'zinc', name: 'Neutral Zinc', hex: '#52525b', textHex: '#52525b' },
  { id: 'canvas', name: 'Slate Light', hex: '#f8fafc', textHex: '#0f172a' },
  { id: 'white', name: 'Pure White', hex: '#ffffff', textHex: '#0f172a' }
];

export interface BrandPalette {
  id: string;
  name: string;
  desc: string;
  textColor: string;
  bgColor: string;
  accentColor: string;
}

export const brandPalettes: BrandPalette[] = [
  { id: 'hero-slate', name: 'Hero Slate Pro', desc: 'Tema resmi enterprise HeroCMS', textColor: '#0f172a', bgColor: '#ffffff', accentColor: '#2563eb' },
  { id: 'ocean-blue', name: 'Oceanic Cloud', desc: 'Biru royal sejuk & terpercaya', textColor: '#0f172a', bgColor: '#f0f9ff', accentColor: '#0284c7' },
  { id: 'emerald-vault', name: 'Emerald Security', desc: 'Aksen hijau fintech terisolasi', textColor: '#064e3b', bgColor: '#f0fdf4', accentColor: '#059669' },
  { id: 'violet-luxury', name: 'Violet Studio', desc: 'Modern, elegan & berani', textColor: '#1e1b4b', bgColor: '#faf5ff', accentColor: '#7c3aed' },
  { id: 'amber-sunset', name: 'Amber Horizon', desc: 'Hangat, dinamis & atraktif', textColor: '#451a03', bgColor: '#fffbeb', accentColor: '#d97706' },
  { id: 'monochrome', name: 'Minimal Mono', desc: 'Netral hitam putih esensial', textColor: '#09090b', bgColor: '#ffffff', accentColor: '#09090b' }
];

export interface EditorIconOption {
  id: string;
  name: string;
  category: 'Tech & Cloud' | 'Keamanan & Sistem' | 'Performa & Bisnis' | 'Desain & UI';
  icon: string;
}

export const editorIconOptions: EditorIconOption[] = [
  // Tech & Cloud
  { id: 'server', name: 'Server Node', category: 'Tech & Cloud', icon: 'server' },
  { id: 'cloud', name: 'Cloud Native', category: 'Tech & Cloud', icon: 'cloud' },
  { id: 'database', name: 'Database SQL', category: 'Tech & Cloud', icon: 'database' },
  { id: 'cpu', name: 'CPU Processor', category: 'Tech & Cloud', icon: 'cpu' },
  { id: 'hard-drive', name: 'Storage SSD', category: 'Tech & Cloud', icon: 'hard-drive' },
  { id: 'terminal', name: 'CLI Terminal', category: 'Tech & Cloud', icon: 'terminal' },
  { id: 'code-2', name: 'API & Code', category: 'Tech & Cloud', icon: 'code-2' },
  { id: 'box', name: 'Docker Box', category: 'Tech & Cloud', icon: 'box' },

  // Keamanan & Sistem
  { id: 'shield-check', name: 'Shield Verify', category: 'Keamanan & Sistem', icon: 'shield-check' },
  { id: 'shield', name: 'Security Guard', category: 'Keamanan & Sistem', icon: 'shield' },
  { id: 'lock', name: 'Encryption Lock', category: 'Keamanan & Sistem', icon: 'lock' },
  { id: 'key', name: 'API Key Access', category: 'Keamanan & Sistem', icon: 'key' },
  { id: 'globe', name: 'Global Network', category: 'Keamanan & Sistem', icon: 'globe' },

  // Performa & Bisnis
  { id: 'trending-up', name: 'High Growth', category: 'Performa & Bisnis', icon: 'trending-up' },
  { id: 'zap', name: 'Ultra Fast', category: 'Performa & Bisnis', icon: 'zap' },
  { id: 'activity', name: 'Live Telemetry', category: 'Performa & Bisnis', icon: 'activity' },
  { id: 'rocket', name: 'Fast Deploy', category: 'Performa & Bisnis', icon: 'rocket' },
  { id: 'check', name: 'Compliance SLA', category: 'Performa & Bisnis', icon: 'check' },

  // Desain & UI
  { id: 'sparkles', name: 'AI Features', category: 'Desain & UI', icon: 'sparkles' },
  { id: 'layers', name: 'Multi Layer', category: 'Desain & UI', icon: 'layers' },
  { id: 'award', name: 'Award Trophy', category: 'Desain & UI', icon: 'award' },
  { id: 'star', name: 'Featured Star', category: 'Desain & UI', icon: 'star' },
  { id: 'sliders', name: 'Custom Control', category: 'Desain & UI', icon: 'sliders' }
];

export interface AnimationOption {
  id: 'none' | 'fadeInUp' | 'slideInLeft' | 'zoomIn' | 'bounce' | 'pulseGlow' | 'float';
  name: string;
  desc: string;
  icon: string;
}

export const animationOptions: AnimationOption[] = [
  { id: 'none', name: 'Tanpa Animasi', desc: 'Elemen statis tanpa efek gerakan', icon: 'eye-off' },
  { id: 'fadeInUp', name: 'Fade In Up', desc: 'Meluncur lembut dari bawah dengan transisi opasitas', icon: 'arrow-up' },
  { id: 'slideInLeft', name: 'Slide In Left', desc: 'Masuk dari sisi kiri dengan akselerasi halus', icon: 'arrow-right' },
  { id: 'zoomIn', name: 'Zoom In Pop', desc: 'Membesar dinamis dari titik tengah', icon: 'maximize' },
  { id: 'bounce', name: 'Dynamic Bounce', desc: 'Efek membal ceria untuk memikat perhatian', icon: 'zap' },
  { id: 'pulseGlow', name: 'Pulse Glow', desc: 'Berdenyut dengan pendar royal blue halus', icon: 'sparkles' },
  { id: 'float', name: 'Floating Infinite', desc: 'Mengambang naik-turun halus secara terus menerus', icon: 'cloud' }
];
