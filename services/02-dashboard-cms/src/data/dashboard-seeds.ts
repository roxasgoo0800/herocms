import type {
  UserPlan,
  ContainerSite,
  ContentArticle,
  MediaAssetItem,
  CustomDomainItem,
  WebhookItem,
  InvoiceItem,
  SupportTicketItem
} from '../types/dashboard';

export interface OfficialTemplateItem {
  id: string;
  title: string;
  category: 'portfolio' | 'blog' | 'education' | 'business';
  tier: string;
  priceText: string;
  isPro: boolean;
  desc: string;
  features: string[];
}

export const initialUserPlan: UserPlan = {
  name: 'Hero Pro Plan',
  price: 'Rp 149.000 / bln',
  maxContainers: 3,
  cpuPerContainer: '0.5 vCPU',
  ramPerContainer: '256 MB',
  storageQuota: '2 GB SSD'
};

export const initialContainers: ContainerSite[] = [
  {
    id: 'hero_tenant_9942',
    name: 'Portofolio Rizal Pratama',
    category: 'portfolio',
    templateName: 'Portofolio Teknis Engineer',
    subdomain: 'rizal.cloudcms.app',
    customDomain: 'rizalpratama.cloud',
    status: 'running',
    cpuUsage: 14,
    ramUsage: 88,
    ramLimit: 256,
    cpuLimit: '0.5 vCPU',
    uptime: '4 hari 12 jam',
    visitsThisWeek: 3892,
    ssl: true,
    roleOrHeadline: 'Senior Cloud & Distributed Systems Engineer',
    bioIntro: 'Membangun arsitektur microservices terdistribusi, orkestrasi kontainer Docker otonom, dan pipeline telemetri real-time dengan latensi rendah.',
    accentColor: '#2563eb',
    lastDeployed: '10 menit lalu'
  }
];

export const officialTemplates: OfficialTemplateItem[] = [
  {
    id: 'tpl_portfolio_pro',
    title: 'Portofolio Teknis & Engineer',
    category: 'portfolio',
    tier: 'Included in Plan',
    priceText: 'Gratis dalam Kuota',
    isPro: false,
    desc: 'Dirancang untuk software engineer, cloud architect, dan desainer. Showcase studi kasus, GitHub telemetry, dan CV direct download.',
    features: ['Studi Kasus Interaktif', 'Integrasi GitHub Repos', 'Formulir Kontak Webhook', 'Peringkat SEO Optimal']
  },
  {
    id: 'tpl_blog_editorial',
    title: 'Editorial Media & Tech Blog',
    category: 'blog',
    tier: 'Included in Plan',
    priceText: 'Gratis dalam Kuota',
    isPro: false,
    desc: 'Platform publikasi artikel modern dengan editor visual, estimasi waktu baca, dan generator otomatis kartu media sosial OpenGraph.',
    features: ['Editor Blok Modern', 'Multi-Author Support', 'OpenGraph Generator', 'Redis Top Views Stream']
  },
  {
    id: 'tpl_edu_lms',
    title: 'Pusat Edukasi & Dokumentasi LMS',
    category: 'education',
    tier: 'Pro Template',
    priceText: 'Termasuk di Paket Pro',
    isPro: true,
    desc: 'Silabus modul bertingkat, publikasi materi ajar terstruktur, profil tutor, dan integrasi video tutorial interaktif.',
    features: ['Silabus Modul Bertingkat', 'Pencarian Dokumentasi Instan', 'Profil Tutor & Dosen', 'Download Materi PDF']
  },
  {
    id: 'tpl_business_catalog',
    title: 'Showcase Bisnis Mikro & UMKM',
    category: 'business',
    tier: 'Pro Template',
    priceText: 'Termasuk di Paket Pro',
    isPro: true,
    desc: 'Toko online mikro dan landing page jasa profesional dengan tombol order direct WhatsApp dan galeri produk responsif.',
    features: ['Katalog Produk Responsif', 'Direct WhatsApp Ordering', 'Integrasi Payment Link', 'Statistik Konversi Kunjungan']
  }
];

export const initialInvoices: InvoiceItem[] = [
  {
    id: 'INV-2026-09-0891',
    date: '15 Sep 2026',
    dueDate: '22 Sep 2026',
    planName: 'Hero Pro Plan (Multi-Tenant Docker)',
    period: '15 Sep 2026 - 15 Okt 2026',
    amount: 149000,
    tax: 16390,
    total: 165390,
    status: 'paid',
    paymentMethod: 'BCA Virtual Account (Auto-Debit)',
    containerQuota: 3
  },
  {
    id: 'INV-2026-08-0412',
    date: '15 Agu 2026',
    dueDate: '22 Agu 2026',
    planName: 'Hero Pro Plan (Multi-Tenant Docker)',
    period: '15 Agu 2026 - 15 Sep 2026',
    amount: 149000,
    tax: 16390,
    total: 165390,
    status: 'paid',
    paymentMethod: 'QRIS Gopay / ShopeePay',
    containerQuota: 3
  },
  {
    id: 'INV-2026-07-0098',
    date: '15 Jul 2026',
    dueDate: '22 Jul 2026',
    planName: 'Hero Starter Plan (Single Container)',
    period: '15 Jul 2026 - 15 Agu 2026',
    amount: 69000,
    tax: 7590,
    total: 76590,
    status: 'paid',
    paymentMethod: 'Kartu Kredit Mandiri Visa',
    containerQuota: 1
  }
];

export const initialCustomDomains: CustomDomainItem[] = [
  {
    id: 'dom_1',
    domain: 'rizalpratama.cloud',
    targetContainer: 'Portofolio Rizal Pratama',
    containerId: 'hero_tenant_9942',
    status: 'active',
    sslStatus: 'issued',
    cnameRecord: 'edge.cloudcms.app',
    aRecord: '103.144.20.1',
    addedDate: '12 Sep 2026'
  }
];

export const initialArticles: ContentArticle[] = [
  {
    id: 'art_1',
    title: 'Arsitektur Multi-Tenant dengan Docker & Go',
    slug: 'arsitektur-multi-tenant-docker-go',
    siteName: 'Portofolio Rizal Pratama',
    containerId: 'hero_tenant_9942',
    category: 'Engineering',
    author: 'Rizal Pratama',
    views: 1420,
    status: 'published',
    publishedAt: '16 Sep 2026'
  },
  {
    id: 'art_2',
    title: 'Penyelarasan Telemetri Real-Time dengan Kafka',
    slug: 'telemetri-real-time-kafka',
    siteName: 'Portofolio Rizal Pratama',
    containerId: 'hero_tenant_9942',
    category: 'Distributed Systems',
    author: 'Rizal Pratama',
    views: 890,
    status: 'published',
    publishedAt: '14 Sep 2026'
  },
  {
    id: 'art_3',
    title: 'Mengoptimalkan TTFB Edge Traefik v3 hingga Sub-2ms',
    slug: 'optimasi-ttfb-edge-traefik',
    siteName: 'Portofolio Rizal Pratama',
    containerId: 'hero_tenant_9942',
    category: 'DevOps',
    author: 'Rizal Pratama',
    views: 610,
    status: 'published',
    publishedAt: '10 Sep 2026'
  },
  {
    id: 'art_4',
    title: 'Panduan Membangun Website Portfolio Modern dengan Headless CMS',
    slug: 'panduan-portfolio-headless-cms',
    siteName: 'Portofolio Rizal Pratama',
    containerId: 'hero_tenant_9942',
    category: 'Tutorial',
    author: 'Rizal Pratama',
    views: 0,
    status: 'draft',
    publishedAt: 'Draft'
  },
  {
    id: 'art_5',
    title: 'Isolasi Resource cgroups v2 Kernel Linux untuk Multi-Tenant',
    slug: 'isolasi-resource-cgroups-v2',
    siteName: 'Portofolio Rizal Pratama',
    containerId: 'hero_tenant_9942',
    category: 'Engineering',
    author: 'Rizal Pratama',
    views: 420,
    status: 'published',
    publishedAt: '08 Sep 2026'
  },
  {
    id: 'art_6',
    title: 'Pencegahan DDoS & Rate Limiting dengan Traefik Middleware',
    slug: 'pencegahan-ddos-rate-limiting-traefik',
    siteName: 'Portofolio Rizal Pratama',
    containerId: 'hero_tenant_9942',
    category: 'Security',
    author: 'Rizal Pratama',
    views: 350,
    status: 'published',
    publishedAt: '05 Sep 2026'
  }
];

export const initialMediaAssets: MediaAssetItem[] = [
  {
    id: 'med_1',
    name: 'hero-banner-developer.webp',
    size: '84 KB',
    type: 'WEBP',
    dimensions: '1920x1080',
    uploadedAt: '18 Sep 2026',
    url: 'https://cdn.cloudcms.app/assets/hero-banner.webp'
  },
  {
    id: 'med_2',
    name: 'laporan-keuangan-q3-2026.xlsx',
    size: '245 KB',
    type: 'XLSX',
    dimensions: 'Spreadsheet (14 Kolom)',
    uploadedAt: '17 Sep 2026',
    url: 'https://cdn.cloudcms.app/assets/laporan-keuangan-q3-2026.xlsx'
  },
  {
    id: 'med_3',
    name: 'arsitektur-sistem-cloudcms.pdf',
    size: '1.4 MB',
    type: 'PDF',
    dimensions: 'Dokumen PDF (18 Hal)',
    uploadedAt: '16 Sep 2026',
    url: 'https://cdn.cloudcms.app/assets/arsitektur-sistem-cloudcms.pdf'
  },
  {
    id: 'med_4',
    name: 'avatar-profile-rizal.jpg',
    size: '42 KB',
    type: 'JPEG',
    dimensions: '800x800',
    uploadedAt: '15 Sep 2026',
    url: 'https://cdn.cloudcms.app/assets/avatar.jpg'
  },
  {
    id: 'med_5',
    name: 'sop-deployment-kontainer.docx',
    size: '88 KB',
    type: 'DOCX',
    dimensions: 'Dokumen Word (6 Hal)',
    uploadedAt: '14 Sep 2026',
    url: 'https://cdn.cloudcms.app/assets/sop-deployment-kontainer.docx'
  },
  {
    id: 'med_6',
    name: 'traefik-architecture-diagram.png',
    size: '156 KB',
    type: 'PNG',
    dimensions: '1440x900',
    uploadedAt: '12 Sep 2026',
    url: 'https://cdn.cloudcms.app/assets/diagram.png'
  },
  {
    id: 'med_7',
    name: 'brand-logo-white.svg',
    size: '8 KB',
    type: 'SVG',
    dimensions: 'Vector',
    uploadedAt: '10 Sep 2026',
    url: 'https://cdn.cloudcms.app/assets/logo.svg'
  }
];

export const initialWebhooks: WebhookItem[] = [
  {
    id: 'wh_1',
    name: 'Discord Notification Bot',
    url: 'https://discord.com/api/webhooks/12894.../hero-alerts',
    events: ['site.deployed', 'form.submitted'],
    status: 'active',
    lastTriggered: '10 menit lalu'
  },
  {
    id: 'wh_2',
    name: 'Slack Dev Channel Ingress',
    url: 'https://hooks.slack.com/services/T00/B00/XXXXX',
    events: ['site.deployed', 'traffic.anomaly'],
    status: 'active',
    lastTriggered: '1 jam lalu'
  }
];

export const initialSupportTickets: SupportTicketItem[] = [
  {
    id: 'TKT-8921',
    subject: 'Bantuan Penyetelan Custom SSL Wildcard di Edge Traefik v3',
    category: 'Edge Proxy & DNS',
    priority: 'p2_high',
    status: 'in_progress',
    createdAt: '18 Sep 2026, 14:20',
    lastUpdated: '10 menit lalu',
    assignedEngineer: 'Budi Hartono (L2 Cloud DevOps)',
    messages: [
      {
        id: 'msg_1',
        sender: 'tenant',
        authorName: 'Rizal Pratama',
        authorRole: 'Tenant Administrator',
        timestamp: '18 Sep 2026, 14:20',
        message: 'Halo tim support HeroCMS, saya baru saja mengarahkan CNAME *.rizalpratama.cloud ke ingress edge Traefik (103.144.20.12). Namun status verifikasi SSL di dashboard masih pending. Mohon bantuan inspeksi log Let\'s Encrypt ALPN challenge.'
      },
      {
        id: 'msg_2',
        sender: 'support',
        authorName: 'Budi Hartono',
        authorRole: 'L2 Cloud DevOps Engineer',
        timestamp: '18 Sep 2026, 14:35',
        message: 'Halo Pak Rizal, terima kasih telah menghubungi tim support. Kami sudah melakukan pengecekan pada Traefik dynamic configuration. Propagasi DNS Anda sudah terdeteksi di edge node Jakarta. Sertifikat TLS 1.3 wildcard sedang dalam proses issue otomatis, estimasi selesai dalam 5-10 menit ke depan.'
      }
    ]
  },
  {
    id: 'TKT-8410',
    subject: 'Permintaan Penambahan Kuota MinIO S3 Storage ke 5GB',
    category: 'Infrastructure & Container',
    priority: 'p3_normal',
    status: 'resolved',
    createdAt: '15 Sep 2026, 09:10',
    lastUpdated: '15 Sep 2026, 11:30',
    assignedEngineer: 'Siti Rahma (Storage Infrastructure Admin)',
    messages: [
      {
        id: 'msg_3',
        sender: 'tenant',
        authorName: 'Rizal Pratama',
        authorRole: 'Tenant Administrator',
        timestamp: '15 Sep 2026, 09:10',
        message: 'Selamat pagi, media PDF dan dokumen presentasi kami bertambah. Bisakah alokasi MinIO S3 kami dinaikkan dari 2GB ke 5GB?'
      },
      {
        id: 'msg_4',
        sender: 'support',
        authorName: 'Siti Rahma',
        authorRole: 'Storage Infrastructure Admin',
        timestamp: '15 Sep 2026, 11:30',
        message: 'Halo Pak Rizal, penambahan kuota bucket S3 MinIO tenant-9942 sebesar 3GB tambahan telah disetujui dan dialokasikan ke storage cluster NVMe. Kuota efektif sekarang 5GB.'
      }
    ]
  },
  {
    id: 'TKT-8102',
    subject: 'Rekonsiliasi Faktur Pajak E-Faktur Masa Agustus 2026',
    category: 'Billing & Pajak',
    priority: 'p3_normal',
    status: 'resolved',
    createdAt: '16 Agu 2026, 13:00',
    lastUpdated: '17 Agu 2026, 10:15',
    assignedEngineer: 'Hendra Wijaya (Finance Compliance)',
    messages: [
      {
        id: 'msg_5',
        sender: 'tenant',
        authorName: 'Rizal Pratama',
        authorRole: 'Tenant Administrator',
        timestamp: '16 Agu 2026, 13:00',
        message: 'Mohon konfirmasi e-faktur PPN 11% untuk invoice INV-2026-08-0412 apakah sudah terunggah ke DJP online?'
      },
      {
        id: 'msg_6',
        sender: 'support',
        authorName: 'Hendra Wijaya',
        authorRole: 'Finance Compliance',
        timestamp: '17 Agu 2026, 10:15',
        message: 'Faktur pajak elektronik dengan NSFP 010.021-26.9942001 telah berhasil divalidasi oleh sistem DJP. File faktur resmi dapat langsung diunduh pada menu Faktur & Invoice.'
      }
    ]
  },
  {
    id: 'TKT-9042',
    subject: 'Integrasi Webhook Discord Payload dengan Traefik TLS Alerts',
    category: 'API & Webhooks',
    priority: 'p2_high',
    status: 'open',
    createdAt: 'Hari ini, 09:45',
    lastUpdated: 'Baru saja',
    messages: [
      {
        id: 'msg_7',
        sender: 'tenant',
        authorName: 'Rizal Pratama',
        authorRole: 'Tenant Administrator',
        timestamp: 'Hari ini, 09:45',
        message: 'Kami ingin menambahkan custom bot alert saat SSL mendekati 7 hari sebelum expiry. Apakah signature HMAC-SHA256 mendukung header webhook Discord kustom?'
      }
    ]
  }
];
