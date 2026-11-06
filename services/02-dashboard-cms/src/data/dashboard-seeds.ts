import type {
  UserPlan,
  SubscriptionPlanCatalogItem,
  ContainerSite,
  ContentArticle,
  CmsPage,
  MediaAssetItem,
  CustomDomainItem,
  WebhookItem,
  PersonalAccessToken,
  PatScopeDefinition,
  WebhookDeliveryLog,
  InvoiceItem,
  SupportTicketItem
} from '../types/dashboard';
import { officialTemplatesData, type OfficialTemplateItem } from './templates-data';

export type { OfficialTemplateItem };

export const initialUserPlan: UserPlan = {
  name: 'Stack Pro Plan',
  price: 'Rp 149.000 / bln',
  maxContainers: 3,
  cpuPerContainer: '0.5 vCPU',
  ramPerContainer: '256 MB',
  storageQuota: '2 GB SSD'
};

export const subscriptionPlansCatalog: SubscriptionPlanCatalogItem[] = [
  {
    id: 'starter',
    name: 'Stack Starter',
    badge: 'Pemula & Uji Coba',
    priceMonthly: 49000,
    priceAnnualMonthly: 39000,
    priceMonthlyFormatted: 'Rp 49.000',
    priceAnnualFormatted: 'Rp 39.000',
    containers: 1,
    ram: '256 MB',
    cpu: '0.5 vCPU',
    storage: '1 GB NVMe',
    tagline: 'Ideal untuk portofolio tunggal, proyek riset, atau situs pribadi.',
    features: [
      '1 Kontainer Docker Otonom',
      'Traefik v3 TLS Let\'s Encrypt SSL',
      'PostgreSQL RLS Database Terisolasi',
      'MinIO S3 Media Storage (1 GB)',
      'Subdomain default aetherstack.id',
      'Dukungan Komunitas & Dokumentasi'
    ]
  },
  {
    id: 'pro',
    name: 'Stack Pro',
    badge: 'Paling Populer',
    isPopular: true,
    priceMonthly: 149000,
    priceAnnualMonthly: 119000,
    priceMonthlyFormatted: 'Rp 149.000',
    priceAnnualFormatted: 'Rp 119.000',
    containers: 3,
    ram: '256 MB / kontainer',
    cpu: '0.5 vCPU / kontainer',
    storage: '2 GB NVMe per site',
    tagline: 'Solusi lengkap untuk profesional kreatif, studio & tim berkembang.',
    features: [
      '3 Kontainer Docker Otonom (Ekspansi Slot)',
      'Visual Live Canvas Page Builder',
      'Traefik v3 HTTP/3 & Custom Ingress SSL',
      'Scoped Webhooks & Headless REST API',
      'Real-Time Analytics (Redis ZSET)',
      'Dukungan Multi-Tenant RLS Penuh'
    ]
  },
  {
    id: 'agency',
    name: 'Stack Enterprise',
    badge: 'Skala Bisnis & Tim',
    priceMonthly: 399000,
    priceAnnualMonthly: 319000,
    priceMonthlyFormatted: 'Rp 399.000',
    priceAnnualFormatted: 'Rp 319.000',
    containers: 10,
    ram: '512 MB / kontainer',
    cpu: '1.0 vCPU / kontainer',
    storage: '10 GB NVMe per site',
    tagline: 'Performa tinggi untuk agensi digital dengan puluhan website klien.',
    features: [
      '10 Kontainer Docker Otonom Terisolasi',
      'Custom Domain Tanpa Batas',
      'Dedicated CFS CPU Quota & 512 MB RAM',
      'Webhook & API Headless Integration',
      'Audit Log & Keamanan Enterprise',
      'Dukungan Teknis Prioritas 24/7 SLA 99.95%'
    ]
  }
];

export const initialContainers: ContainerSite[] = [
  {
    id: 'site_main_corporate',
    name: 'Situs Utama Corporate',
    category: 'business',
    templateName: 'Nova Corporate',
    subdomain: 'site.stackbyte.id',
    customDomain: 'rizalpratama.cloud',
    status: 'running',
    cpuUsage: 12,
    ramUsage: 78,
    ramLimit: 256,
    cpuLimit: '0.5 vCPU',
    uptime: '6 hari 14 jam',
    visitsThisWeek: 4892,
    ssl: true,
    accentColor: '#2563eb',
    roleOrHeadline: 'Portofolio Teknis & Bisnis Studio',
    bioIntro: 'Selamat datang di website resmi yang didukung arsitektur kontainer otonom Stack Studio.',
    lastDeployed: '12 menit lalu'
  },
  {
    id: 'site_portal_edu',
    name: 'Portal Edukasi LMS',
    category: 'education',
    templateName: 'Akademi Digital Edu',
    subdomain: 'portal.stackbyte.id',
    customDomain: 'portal.perusahaan.com',
    status: 'running',
    cpuUsage: 18,
    ramUsage: 112,
    ramLimit: 256,
    cpuLimit: '0.5 vCPU',
    uptime: '12 hari 8 jam',
    visitsThisWeek: 2140,
    ssl: true,
    accentColor: '#059669',
    roleOrHeadline: 'Pusat Pembelajaran & Silabus Teknologi',
    bioIntro: 'Platform edukasi daring terdistribusi dengan modul pembelajaran interaktif.',
    lastDeployed: '2 jam lalu'
  },
  {
    id: 'site_toko_digital',
    name: 'Etalase Toko Digital',
    category: 'business',
    templateName: 'E-Commerce Retail Store',
    subdomain: 'toko.stackbyte.id',
    customDomain: '',
    status: 'running',
    cpuUsage: 9,
    ramUsage: 64,
    ramLimit: 256,
    cpuLimit: '0.5 vCPU',
    uptime: '3 hari 20 jam',
    visitsThisWeek: 1320,
    ssl: true,
    accentColor: '#7c3aed',
    roleOrHeadline: 'Etalase Produk Komersial & Checkout WhatsApp',
    bioIntro: 'Katalog produk digital dengan integrasi pesanan instan dan pelacakan paket.',
    lastDeployed: '1 hari lalu'
  }
];

export const officialTemplates: OfficialTemplateItem[] = officialTemplatesData;

export const initialInvoices: InvoiceItem[] = [
  {
    id: 'INV-2026-10-0994',
    date: '15 Okt 2026',
    dueDate: '22 Okt 2026',
    planName: 'Stack Pro Plan (Multi-Tenant Docker)',
    period: '15 Okt 2026 - 15 Nov 2026',
    amount: 149000,
    tax: 16390,
    total: 165390,
    status: 'paid',
    paymentMethod: 'BCA Virtual Account (Auto-Debit)',
    containerQuota: 3
  },
  {
    id: 'INV-2026-09-0891',
    date: '15 Sep 2026',
    dueDate: '22 Sep 2026',
    planName: 'Stack Pro Plan (Multi-Tenant Docker)',
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
    planName: 'Stack Pro Plan (Multi-Tenant Docker)',
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
    planName: 'Stack Starter Plan (Single Container)',
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
    targetContainer: 'Situs Utama Corporate',
    containerId: 'site_main_corporate',
    status: 'active',
    sslStatus: 'issued',
    cnameRecord: 'edge.stackbyte.id',
    aRecord: '103.144.20.1',
    addedDate: '12 Sep 2026'
  },
  {
    id: 'dom_2',
    domain: 'portal.perusahaan.com',
    targetContainer: 'Portal Edukasi LMS',
    containerId: 'site_portal_edu',
    status: 'active',
    sslStatus: 'issued',
    cnameRecord: 'edge.stackbyte.id',
    aRecord: '103.144.20.1',
    addedDate: '18 Okt 2026'
  }
];

export const initialArticles: ContentArticle[] = [
  {
    id: 'art_101',
    containerId: 'site_main_corporate',
    siteName: 'Situs Utama Corporate',
    title: 'Arsitektur Cloud-Native & Orkestrasi Kontainer Otonom',
    slug: 'arsitektur-cloud-native',
    excerpt: 'Panduan teknis perancangan microservices otonom berbasis Docker Engine SDK, Traefik edge proxy, dan multi-tenant PostgreSQL RLS.',
    content: `## Pengantar Arsitektur Cloud-Native\n\nDalam membangun sistem komputasi modern, isolasi beban kerja (workload isolation) menjadi faktor penentu keandalan infrastruktur. HeroCMS dirancang menggunakan pendekatan kontainerisasi mandiri per-tenant, di mana setiap website berjalan di lingkungan Linux cgroups v2 yang terpisah.\n\n### Keunggulan Traefik Dynamic Ingress\n\nTraefik v3 bertindak sebagai gerbang ingress utama yang menangani terminasi TLS 1.3 secara otomatis melalui integrasi Let's Encrypt ACME ALPN. Routing dilakukan secara dinamis berdasarkan label kontainer Docker tanpa perlu me-reload daemon proxy.\n\n\`\`\`go\n// Dynamic label routing configuration\nlabels := map[string]string{\n    "traefik.enable": "true",\n    "traefik.http.routers.site.rule": "Host(\`site.stackbyte.id\`)",\n}\n\`\`\`\n\n### Kesimpulan\n\nDengan model komputasi terdistribusi ini, setiap tenant memiliki jaminan performa CPU dan RAM mandiri tanpa risiko noisy neighbor effect.`,
    category: 'Engineering',
    status: 'published',
    author: 'Rizal Pratama',
    tags: ['Golang', 'Docker', 'Edge CDN', 'Traefik'],
    publishedAt: '04 November 2026',
    views: 1420
  },
  {
    id: 'art_102',
    containerId: 'site_main_corporate',
    siteName: 'Situs Utama Corporate',
    title: 'Panduan Integrasi Headless REST API & Webhooks Real-Time',
    slug: 'integrasi-headless-api',
    excerpt: 'Cara mudah mengintegrasikan konten artikel, formulir leads, dan katalog media ke Next.js, Nuxt, atau aplikasi mobile dengan token PAT aman.',
    content: `## Integrasi Headless CMS dengan Personal Access Token\n\nHeroCMS Studio menyediakan endpoint REST API standar industri yang dilindungi oleh sistem otorisasi token Personal Access Token (PAT) dengan cakupan izin granular (scopes).\n\n### Autentikasi Permintaan\n\nKirimkan token PAT melalui header \`Authorization: Bearer <TOKEN>\` pada setiap request API:\n\n\`\`\`bash\ncurl -X GET "https://api.stackbyte.id/api/v1/content/articles" \\\n  -H "Authorization: Bearer stack_pat_9942_••••••••••••e8a1"\n\`\`\`\n\nData JSON akan dikembalikan dengan struktur terstandarisasi untuk konsumsi aplikasi frontend Jamstack.`,
    category: 'Tutorial',
    status: 'published',
    author: 'Irgi & Rizal',
    tags: ['Headless', 'REST API', 'Webhooks', 'Security'],
    publishedAt: '02 November 2026',
    views: 890
  },
  {
    id: 'art_103',
    containerId: 'site_portal_edu',
    siteName: 'Portal Edukasi LMS',
    title: 'Optimasi Core Web Vitals (LCP, CLS, INP) pada Arsitektur Edge',
    slug: 'optimasi-core-web-vitals',
    excerpt: 'Strategi pencapaian skor 100/100 Google Lighthouse dengan memanfaatkan kompresi Brotli, cache HTTP immutable, dan code-splitting Vite.',
    content: `## Mengapa Core Web Vitals Sangat Krusial?\n\nPengalaman pengguna di web bergantung langsung pada kecepatan visual rendering. Tiga metrik utama Google CWV—Largest Contentful Paint (LCP), Cumulative Layout Shift (CLS), dan Interaction to Next Paint (INP)—menentukan peringkat SEO dan konversi pengunjung.\n\n### Kebijakan Caching Immutability\n\nAset statis ter-hash yang disajikan melalui Traefik dikonfigurasi dengan cache header tahunan:\n\n\`\`\`http\nCache-Control: public, max-age=31536000, immutable\n\`\`\`\n\nHal ini menjamin latensi respon TTFB tetap berada di bawah 2 milidetik pada kunjungan berulang.`,
    category: 'DevOps',
    status: 'published',
    author: 'Andalusia',
    tags: ['Performance', 'Lighthouse', 'Vite', 'Brotli'],
    publishedAt: '28 Oktober 2026',
    views: 654
  }
];

export const initialCmsPages: CmsPage[] = [
  {
    id: 'page_1',
    containerId: 'site_main_corporate',
    siteName: 'Situs Utama Corporate',
    title: 'Tentang Kami & Arsitektur Sistem',
    path: '/about',
    templateLayout: 'standard-prose',
    isInNavbar: true,
    isInFooter: true,
    status: 'published',
    updatedAt: '06 November 2026',
    metaTitle: 'Tentang Kami • HeroCMS Studio',
    metaDesc: 'Mengenal tim rekayasa di balik ekosistem cloud HeroCMS Studio.',
    content: '## Visi & Misi HeroCMS\n\nKami percaya bahwa setiap bisnis dan developer berhak memiliki kedaulatan data penuh atas website mereka tanpa ketergantungan pada SaaS tertutup.'
  },
  {
    id: 'page_2',
    containerId: 'site_main_corporate',
    siteName: 'Situs Utama Corporate',
    title: 'Kebijakan Privasi & Ketentuan Layanan',
    path: '/privacy',
    templateLayout: 'legal-document',
    isInNavbar: false,
    isInFooter: true,
    status: 'published',
    updatedAt: '05 November 2026',
    metaTitle: 'Kebijakan Privasi Data • HeroCMS Studio',
    metaDesc: 'Komitmen perlindungan data dan kepatuhan GDPR / UU PDP.',
    content: '## Kebijakan Privasi Data\n\nSeluruh data tenant disimpan di database terisolasi dengan Row-Level Security (RLS) aktif.'
  }
];

// Valid, self-contained base64 PDF that renders seamlessly in any browser offline
export const SAMPLE_PDF_DATA_URI = 'data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iaiA8PC9UeXBlIC9DYXRhbG9nIC9QYWdlcyAyIDAgUj4+IGVuZG9iagoyIDAgb2JqIDw8L1R5cGUgL1BhZ2VzIC9LaWRzIFszIDAgUl0gL0NvdW50IDE+PiBlbmRvYmoKMyAwIG9iaiA8PC9UeXBlIC9QYWdlIC9QYXJlbnQgMiAwIFIgL1Jlc291cmNlcyA8PC9Gb250IDw8L0YxIDQgMCBSPj4+PiAvTWVkaWFCb3ggWzAgMCA2MTIgNzkyXSAvQ29udGVudHMgNSAwIFI+PiBlbmRvYmoKNCAwIG9iaiA8PC9UeXBlIC9Gb250IC9TdWJ0eXBlIC9UeXBlMSAvQmFzZUZvbnQgL0hlbHZldGljYT4+IGVuZG9iago1IDAgb2JqIDw8L0xlbmd0aCAyNDg+PiBzdHJlYW0KQlQKL0YxIDE4IFRmCjUwIDcyMCBUZAooSEVST0NNUyBTVFVESU8gLSBET0tVTUVOIEFSU0lURUtUVVIgQ0xPVUQpIFRqCjAgLTMyIFRkCi9GMSAxMSBUZgooTGFwb3JhbiBSZXNtaSBBcnNpdGVrdHVyIEtvbnRhaW5lciBPdG9ub20gJiBUcmFlZmlrIEVkZ2UgSW5ncmVzcykgVGoKMCAtMjQgVGQKKFRlbmFudDogUFQgSGVybyBEaWdpdGFsIE11bHRpdGVrIHwgU3RhdHVzOiBWZXJpZmllZCBDbGVhbikgVGoKRVQKZW5kc3RyZWFtCmVuZG9iagp4cmVmCjAgNgowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMDkgMDAwMDAgbiAKMDAwMDAwMDA1OCAwMDAwMCBuIAowMDAwMDAwMTE1IDAwMDAwIG4gCjAwMDAwMDAyMjQgMDAwMDAgbiAKMDAwMDAwMDI5MyAwMDAwMCBuIAp0cmFpbGVyIDw8L1NpemUgNiAvUm9vdCAxIDAgUj4+CnN0YXJ0eHJlZgo1OTIKJSVFT0Y=';

export const initialMediaAssets: MediaAssetItem[] = [
  {
    id: 'med_pdf_01',
    name: 'Laporan-Masalah-BMT-Assyafiiyah-2026-10-30.pdf',
    type: 'PDF',
    size: '119.4 KB',
    sizeBytes: 122266,
    dimensions: 'Portable Document',
    url: SAMPLE_PDF_DATA_URI,
    s3Key: '1793933847448012000-Laporan-Masalah-BMT-Assyafiiyah-2026-10-30.pdf',
    bucketName: 'tenant-994200000000-media',
    uploadedAt: '6 Nov 2026'
  },
  {
    id: 'med_png_02',
    name: 'Profil Wanita dengan Halo Bintang.png',
    type: 'PNG',
    size: '267.4 KB',
    sizeBytes: 273817,
    dimensions: '1254x1254 px',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="100%" height="100%" fill="%23f8fafc"/><circle cx="200" cy="200" r="140" fill="none" stroke="%232563eb" stroke-width="4"/><path d="M200 60 L200 340 M60 200 L340 200" stroke="%2394a3b8" stroke-dasharray="4,4"/><text x="200" y="208" font-family="sans-serif" font-size="16" font-weight="bold" fill="%230f172a" text-anchor="middle">Aset Media MinIO S3</text></svg>',
    s3Key: '1793614066-profil-wanita.png',
    bucketName: 'tenant-994200000000-media',
    uploadedAt: '5 Nov 2026'
  },
  {
    id: 'med_svg_03',
    name: 'HeroCMS Logo Glyph.svg',
    type: 'SVG',
    size: '14.2 KB',
    sizeBytes: 14540,
    dimensions: 'Vector Scalable',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="100%" height="100%" rx="32" fill="%232563eb"/><path d="M60 100 L90 130 L140 70" stroke="%23ffffff" stroke-width="14" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    s3Key: '1793614066-herocms-logo.svg',
    bucketName: 'tenant-994200000000-media',
    uploadedAt: '4 Nov 2026'
  }
];

export const availablePatScopes: PatScopeDefinition[] = [
  // Konten & Headless CMS
  {
    id: 'content:read',
    name: 'Baca Artikel & Halaman (Headless CMS)',
    category: 'content',
    categoryLabel: 'Konten & Headless CMS',
    action: 'read',
    description: 'Mengambil konten artikel, blog post, halaman statis, kategori, dan tags untuk Next.js / Nuxt / Mobile App.'
  },
  {
    id: 'content:write',
    name: 'Tulis & Sunting Draft Konten',
    category: 'content',
    categoryLabel: 'Konten & Headless CMS',
    action: 'write',
    description: 'Membuat draft artikel baru, update isi artikel, dan mengelola tag dari aplikasi eksternal.'
  },
  // Formulir & Leads CRM
  {
    id: 'leads:read',
    name: 'Baca Data Leads & Pesan Masuk',
    category: 'leads',
    categoryLabel: 'Formulir Kontak & Leads CRM',
    action: 'read',
    description: 'Mengunduh data pengirim formulir kontak, pesan pengunjung, dan email newsletter ke sistem CRM eksternal.'
  },
  {
    id: 'leads:write',
    name: 'Kirim Data Submit Formulir',
    category: 'leads',
    categoryLabel: 'Formulir Kontak & Leads CRM',
    action: 'write',
    description: 'Mengirimkan payload form kontak dari landing page statis eksternal langsung ke database tenant.'
  },
  // Media Assets
  {
    id: 'media:read',
    name: 'Akses Katalog Media & URL CDN',
    category: 'media',
    categoryLabel: 'Media Assets & CDN S3',
    action: 'read',
    description: 'Membaca daftar file gambar, thumbnail, dan link publik CDN Cloudflare/S3.'
  },
  {
    id: 'media:upload',
    name: 'Unggah Aset Gambar & Berkas Baru',
    category: 'media',
    categoryLabel: 'Media Assets & CDN S3',
    action: 'upload',
    description: 'Mengunggah file media (PNG, JPG, WebP, SVG, PDF) langsung ke bucket penyimpanan S3.'
  },
  // Telemetri & Analitik
  {
    id: 'telemetry:read',
    name: 'Baca Ringkasan Metrik & Pageviews',
    category: 'telemetry',
    categoryLabel: 'Telemetri & Analitik',
    action: 'read',
    description: 'Membaca statistik hit rate harian, total tayangan halaman (pageviews), dan rata-rata TTFB latency.'
  },
  // Pusat Bantuan
  {
    id: 'tickets:read',
    name: 'Pantau Status Tiket Bantuan',
    category: 'tickets',
    categoryLabel: 'Pusat Bantuan & Support',
    action: 'read',
    description: 'Melihat status tiket pertanyaan teknis, riwayat percakapan, dan SLA tanggapan tim support.'
  }
];

export const initialPersonalAccessTokens: PersonalAccessToken[] = [
  {
    id: 'pat_1',
    name: 'Mobile App Flutter (Headless Reader)',
    tokenPrefix: 'stack_pat_9942_fltr',
    tokenMasked: 'stack_pat_9942_••••••••••••e8a1',
    scopes: ['content:read', 'media:read'],
    createdAt: '10 Oktober 2026',
    expiresAt: '90 Hari',
    lastUsedAt: '12 menit lalu',
    status: 'active'
  },
  {
    id: 'pat_2',
    name: 'Zapier Webhook Lead Forwarder',
    tokenPrefix: 'stack_pat_9942_zapr',
    tokenMasked: 'stack_pat_9942_••••••••••••92b4',
    scopes: ['leads:read', 'leads:write'],
    createdAt: '01 Oktober 2026',
    expiresAt: 'Tidak Pernah',
    lastUsedAt: '2 jam lalu',
    status: 'active'
  },
  {
    id: 'pat_3',
    name: 'Marketing Site Next.js Jamstack',
    tokenPrefix: 'stack_pat_9942_nxtj',
    tokenMasked: 'stack_pat_9942_••••••••••••44cc',
    scopes: ['content:read', 'media:read', 'leads:write', 'telemetry:read'],
    createdAt: '15 September 2026',
    expiresAt: '1 Tahun',
    lastUsedAt: '3 menit lalu',
    status: 'active'
  }
];

export const initialWebhooks: WebhookItem[] = [
  {
    id: 'wh_1',
    name: 'Discord Notification Channel (#editorial-alerts)',
    url: 'https://discord.com/api/webhooks/12894.../hero-alerts',
    secretKey: 'whsec_9942_dc_88a91c2d3e4f',
    events: ['article.published', 'lead.received'],
    status: 'active',
    lastTriggered: '10 menit lalu'
  },
  {
    id: 'wh_2',
    name: 'Slack Leads & Growth Bot (#leads-crm)',
    url: 'https://hooks.slack.com/services/T00/B00/XXXXX',
    secretKey: 'whsec_9942_sl_77b82e3f4g5h',
    events: ['lead.received', 'traffic.spike'],
    status: 'active',
    lastTriggered: '1 jam lalu'
  }
];

export const initialWebhookDeliveryLogs: WebhookDeliveryLog[] = [
  {
    id: 'del_1',
    webhookId: 'wh_1',
    webhookName: 'Discord Notification Channel (#editorial-alerts)',
    targetUrl: 'https://discord.com/api/webhooks/12894.../hero-alerts',
    event: 'article.published',
    statusCode: 200,
    durationMs: 42,
    timestamp: '10 menit lalu',
    status: 'success',
    requestHeaders: {
      'Content-Type': 'application/json',
      'User-Agent': 'AetherCore-Stack-Webhook-Dispatcher/1.0',
      'X-Stack-Delivery-ID': 'del_1_9942a8f',
      'X-Stack-Signature': 't=1729420200,v1=9f82d1c4e7a83b2c019d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b'
    },
    requestPayload: {
      event: 'article.published',
      timestamp: '2026-10-20T07:00:00Z',
      tenant_id: 'tenant-9942',
      data: {
        article_id: 'art_8821',
        title: 'Membangun Arsitektur Cloud Mandiri & Multi-Tenant',
        slug: 'membangun-arsitektur-cloud-mandiri',
        author: 'Rizal Pratama',
        published_at: '2026-10-20T07:00:00Z',
        url: 'https://rizalpratama.stackbyte.id/artikel/membangun-arsitektur-cloud-mandiri'
      }
    },
    responseBody: '{"id": "1290349812903", "type": 0, "content": "Artikel Baru Terbit: Membangun Arsitektur Cloud Mandiri", "channel_id": "128940029"}'
  },
  {
    id: 'del_2',
    webhookId: 'wh_2',
    webhookName: 'Slack Leads & Growth Bot (#leads-crm)',
    targetUrl: 'https://hooks.slack.com/services/T00/B00/XXXXX',
    event: 'lead.received',
    statusCode: 200,
    durationMs: 38,
    timestamp: '1 jam lalu',
    status: 'success',
    requestHeaders: {
      'Content-Type': 'application/json',
      'User-Agent': 'AetherCore-Stack-Webhook-Dispatcher/1.0',
      'X-Stack-Delivery-ID': 'del_2_9942b4c',
      'X-Stack-Signature': 't=1729416600,v1=4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b'
    },
    requestPayload: {
      event: 'lead.received',
      timestamp: '2026-10-20T06:00:00Z',
      tenant_id: 'tenant-9942',
      data: {
        lead_id: 'lead_9942_01',
        name: 'Budi Santoso',
        email: 'budi@enterprise.co.id',
        company: 'PT Solusi Bangsa Digital',
        message: 'Tertarik dengan implementasi Stack untuk 50 kontainer website.',
        source_site: 'rizalpratama.stackbyte.id'
      }
    },
    responseBody: 'ok'
  },
  {
    id: 'del_3',
    webhookId: 'wh_1',
    webhookName: 'Discord Notification Channel (#editorial-alerts)',
    targetUrl: 'https://discord.com/api/webhooks/12894.../stack-alerts',
    event: 'ssl.renewed',
    statusCode: 200,
    durationMs: 45,
    timestamp: '5 jam lalu',
    status: 'success',
    requestHeaders: {
      'Content-Type': 'application/json',
      'User-Agent': 'AetherCore-Stack-Webhook-Dispatcher/1.0',
      'X-Stack-Delivery-ID': 'del_3_9942c1d',
      'X-Stack-Signature': 't=1729402200,v1=8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f'
    },
    requestPayload: {
      event: 'ssl.renewed',
      timestamp: '2026-10-20T02:00:00Z',
      tenant_id: 'tenant-9942',
      data: {
        domain: 'rizalpratama.stackbyte.id',
        issuer: "Let's Encrypt Authority X3",
        tls_version: 'TLS 1.3',
        valid_until: '2027-01-18T00:00:00Z',
        edge_router: 'traefik-v3-edge-01'
      }
    },
    responseBody: '{"id": "1290349812904", "type": 0, "content": "Sertifikat SSL Let\'s Encrypt TLS 1.3 Sukses Diperbarui", "channel_id": "128940029"}'
  },
  {
    id: 'del_4',
    webhookId: 'wh_2',
    webhookName: 'Slack Leads & Growth Bot (#leads-crm)',
    targetUrl: 'https://hooks.slack.com/services/T00/B00/XXXXX',
    event: 'traffic.spike',
    statusCode: 200,
    durationMs: 39,
    timestamp: '1 hari lalu',
    status: 'success',
    requestHeaders: {
      'Content-Type': 'application/json',
      'User-Agent': 'AetherCore-Stack-Webhook-Dispatcher/1.0',
      'X-Stack-Delivery-ID': 'del_4_9942d3e',
      'X-Stack-Signature': 't=1729333800,v1=1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b'
    },
    requestPayload: {
      event: 'traffic.spike',
      timestamp: '2026-10-19T07:00:00Z',
      tenant_id: 'tenant-9942',
      data: {
        container_id: 'cnt_9942_01',
        subdomain: 'rizalpratama.stackbyte.id',
        requests_per_minute: 4820,
        normal_baseline: 450,
        ratio: '10.7x spike',
        action_taken: 'Traefik rate-limit & edge caching activated'
      }
    },
    responseBody: 'ok'
  }
];

export const initialSupportTickets: SupportTicketItem[] = [
  {
    id: 'TKT-9042',
    subject: 'Kontainer Toko Kopi Nusantara Tiba-tiba Standby / Tidak Bisa Diakses',
    department: 'Technical & Container (DevOps)',
    category: 'Kontainer Mati / Situs Tidak Bisa Diakses (Down)',
    containerName: 'Toko Kopi Nusantara (kopinusantara.stackbyte.id)',
    reporterName: 'Rizal Pratama',
    reporterEmail: 'rizal@herocms.id',
    priority: 'p3_normal',
    status: 'in_progress',
    createdAt: 'Hari ini, 09:45',
    lastUpdated: '5 menit lalu',
    assignedEngineer: 'Budi Hartono',
    assignedRole: 'L2 Cloud DevOps Engineer',
    messages: [
      {
        id: 'msg_1',
        sender: 'tenant',
        authorName: 'Rizal Pratama',
        authorRole: 'Tenant Administrator',
        authorEmail: 'rizal@herocms.id',
        timestamp: '09:45 WIB',
        deliveryStatus: 'read',
        readAt: '09:46 WIB',
        message: 'Halo tim Technical Support 👋, kontainer situs Toko Kopi Nusantara (kopinusantara.stackbyte.id) tiba-tiba berstatus Standby dan tidak merespons saat diakses publik. Mohon bantuannya untuk pengecekan service kontainer kami 🙏'
      },
      {
        id: 'msg_2',
        sender: 'support',
        authorName: 'Budi Hartono',
        authorRole: 'L2 Cloud DevOps Engineer',
        timestamp: '09:48 WIB',
        message: 'Halo Pak Rizal, laporan Anda sudah kami terima. Kami sedang memeriksa healthcheck pod kontainer kopinusantara.stackbyte.id dan log memory cgroups v2. Apabila ada tangkapan layar (screenshot) pesan error di browser, silakan dilampirkan di chat ini ya 👍'
      },
      {
        id: 'msg_2b',
        sender: 'tenant',
        authorName: 'Rizal Pratama',
        authorRole: 'Tenant Administrator',
        authorEmail: 'rizal@herocms.id',
        timestamp: '09:50 WIB',
        deliveryStatus: 'read',
        readAt: '09:51 WIB',
        message: 'Baik Pak Budi, terima kasih respon cepatnya. Saya tunggu kabar hasil pengecekan pod kontainernya ya 🙏'
      }
    ]
  },
  {
    id: 'TKT-8921',
    subject: 'Bantuan Penyetelan Custom Domain & Verifikasi SSL Wildcard',
    department: 'Domain, DNS & Keamanan SSL',
    category: 'Custom Domain Belum Terhubung (Propagasi DNS)',
    containerName: 'Portofolio Rizal Pratama (rizalpratama.stackbyte.id)',
    reporterName: 'Rizal Pratama',
    reporterEmail: 'rizal@herocms.id',
    priority: 'p3_normal',
    status: 'in_progress',
    createdAt: '18 Oktober 2026, 14:20',
    lastUpdated: '19 Oktober 2026, 09:15',
    assignedEngineer: 'Raka Pratama',
    assignedRole: 'Network & Edge Security',
    messages: [
      {
        id: 'msg_3',
        sender: 'tenant',
        authorName: 'Rizal Pratama',
        authorRole: 'Tenant Administrator',
        authorEmail: 'rizal@herocms.id',
        timestamp: '18 Oktober 2026, 14:20 WIB',
        deliveryStatus: 'read',
        readAt: '18 Oktober 2026, 14:24 WIB',
        message: 'Halo tim Domain & SSL, saya baru saja mengarahkan CNAME *.rizalpratama.cloud ke server ingress (103.144.20.12). Namun status verifikasi SSL di dashboard masih menunggu propagasi. Mohon bantuannya.'
      },
      {
        id: 'msg_4',
        sender: 'support',
        authorName: 'Raka Pratama',
        authorRole: 'Network & Edge Security',
        timestamp: '18 Oktober 2026, 14:32 WIB',
        message: 'Halo Pak Rizal, terima kasih telah menghubungi tim Network & SSL. Propagasi DNS CNAME Anda sudah terdeteksi di node Jakarta. Sertifikat TLS 1.3 sedang diterbitkan otomatis dan akan aktif dalam beberapa menit ke depan ✅'
      },
      {
        id: 'msg_4b',
        sender: 'tenant',
        authorName: 'Rizal Pratama',
        authorRole: 'Tenant Administrator',
        authorEmail: 'rizal@herocms.id',
        timestamp: '19 Oktober 2026, 09:12 WIB',
        deliveryStatus: 'read',
        readAt: '19 Oktober 2026, 09:15 WIB',
        message: 'Halo Pak Raka, untuk domain utama sudah aktif HTTPS-nya, sekarang tinggal menunggu propagasi subdomain blog-nya saja. Terima kasih! 🙌'
      }
    ]
  },
  {
    id: 'TKT-8410',
    subject: 'Konsultasi Pengaturan Layout Seksi Hero pada Visual Editor',
    department: 'Customer Support & Layanan CMS',
    category: 'Kendala Visual Editor & Publikasi Halaman',
    containerName: 'Portofolio Rizal Pratama (rizalpratama.stackbyte.id)',
    reporterName: 'Rizal Pratama',
    reporterEmail: 'rizal@herocms.id',
    priority: 'p3_normal',
    status: 'open',
    createdAt: 'Hari ini, 11:10',
    lastUpdated: 'Baru saja',
    assignedEngineer: 'Nadia Putri',
    assignedRole: 'Customer Care Specialist',
    messages: [
      {
        id: 'msg_5',
        sender: 'tenant',
        authorName: 'Rizal Pratama',
        authorRole: 'Tenant Administrator',
        authorEmail: 'rizal@herocms.id',
        timestamp: '11:10 WIB',
        deliveryStatus: 'delivered',
        message: 'Selamat siang Customer Support, saya ingin menyesuaikan urutan blok galeri dan tombol CTA di halaman utama menggunakan Visual Editor agar tampil rapi di layar mobile. Mohon panduannya 😊'
      }
    ]
  },
  {
    id: 'TKT-8102',
    subject: 'Konfirmasi Faktur Pembayaran & Dokumen E-Faktur PPN',
    department: 'Billing, Paket & Faktur',
    category: 'Permintaan & Revisi Dokumen E-Faktur Pajak',
    containerName: 'Semua Layanan / Akun Tenant',
    reporterName: 'Rizal Pratama',
    reporterEmail: 'rizal@herocms.id',
    priority: 'p3_normal',
    status: 'resolved',
    createdAt: '15 Oktober 2026, 13:00',
    lastUpdated: '15 Oktober 2026, 14:15',
    assignedEngineer: 'Hendra Wijaya',
    assignedRole: 'Billing & Finance Specialist',
    messages: [
      {
        id: 'msg_6',
        sender: 'tenant',
        authorName: 'Rizal Pratama',
        authorRole: 'Tenant Administrator',
        authorEmail: 'rizal@herocms.id',
        timestamp: '15 Oktober 2026, 13:00 WIB',
        deliveryStatus: 'read',
        readAt: '15 Oktober 2026, 13:04 WIB',
        message: 'Mohon konfirmasi dokumen faktur untuk invoice INV-2026-08-0412 apakah sudah siap diunduh untuk keperluan laporan keuangan perusahaan kami?'
      },
      {
        id: 'msg_7',
        sender: 'support',
        authorName: 'Hendra Wijaya',
        authorRole: 'Billing & Finance Specialist',
        timestamp: '15 Oktober 2026, 14:15 WIB',
        message: 'Halo Pak Rizal, dokumen faktur resmi untuk invoice INV-2026-08-0412 sudah terverifikasi lunas dan siap diunduh langsung pada menu Faktur & Invoice. Terima kasih telah menggunakan layanan kami 🙏'
      }
    ]
  }
];
