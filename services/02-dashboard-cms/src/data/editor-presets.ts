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
  { name: 'Electric Cyan', hex: '#0284c7' },
  { name: 'Crimson Burgundy', hex: '#881337' }
];

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

export const createLibraryBlock = (type: VisualBlock['type']): VisualBlock => {
  const newId = `${type}_${Date.now() % 10000}`;
  switch (type) {
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
    case 'pricing':
      return {
        id: newId,
        type: 'pricing',
        name: 'Tabel Harga',
        badge: 'INVESTASI',
        title: 'Pilihan Paket Layanan',
        subtitle: 'Skalabilitas tanpa batas untuk kebutuhan bisnis Anda.',
        isVisible: true,
        isLocked: false,
        items: [
          { id: 'p1', title: 'Standard', price: 'Rp 99.000', period: '/ bln', desc: 'Cocok untuk awal mulai.', features: ['1 Domain', 'SSL Otomatis'] },
          { id: 'p2', title: 'Premium', price: 'Rp 249.000', period: '/ bln', desc: 'Kapasitas maksimal.', features: ['3 Domain', 'Prioritas Support'] }
        ],
        styles: { paddingY: 60, align: 'center', bgMode: 'transparent' }
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
