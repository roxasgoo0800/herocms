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
    id: 'hero_tenant_9942',
    name: 'Portofolio Rizal Pratama',
    category: 'portfolio',
    templateName: 'Portofolio Teknis Engineer',
    subdomain: 'rizal.stacbyte.id',
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
    targetContainer: 'Portofolio Rizal Pratama',
    containerId: 'hero_tenant_9942',
    status: 'active',
    sslStatus: 'issued',
    cnameRecord: 'edge.stacbyte.id',
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
    publishedAt: '16 Sep 2026',
    excerpt: 'Membangun platform PaaS multi-tenant berkinerja tinggi menggunakan Docker Engine SDK dan Golang dengan isolasi cgroups v2 ketat.',
    tags: ['#Docker', '#Golang', '#PaaS', '#MultiTenant'],
    metaTitle: 'Arsitektur Multi-Tenant dengan Docker & Go — Aether Core Stack Tech',
    metaDesc: 'Panduan teknis arsitektur multi-tenant berbasis kontainer Docker mandiri dan Golang orchestrator.',
    content: `## Pendahuluan

Arsitektur multi-tenant modern menuntut isolasi sumber daya yang kokoh tanpa mengorbankan efisiensi komputasi server. Dalam ekosistem Stack by Aether Core, setiap situs tenant dialokasikan dalam kontainer Docker mandiri yang dipantau oleh Go Orchestrator melalui socket \`/var/run/docker.sock\`.

### 1. Pembatasan Kernel Linux dengan cgroups v2
Setiap instans kontainer dikonfigurasi dengan batas memori maksimum 256MB dan kuota CPU 0.5 core. Hal ini mencegah satu tenant yang mengalami lonjakan lalu lintas menyerap seluruh kapasitas CPU host cluster.

### 2. Integrasi Reverse Proxy Traefik v3
Konfigurasi routing HTTP/HTTPS ditangani secara dinamis melalui label kontainer Traefik, menghasilkan latensi respons Time-to-First-Byte (TTFB) rata-rata 1.8 milidetik.`
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
    publishedAt: '14 Sep 2026',
    excerpt: 'Desain streaming telemetri non-blocking untuk mencatat jutaan hit per detik menggunakan Apache Kafka dan Redis Sorted Sets.',
    tags: ['#Kafka', '#Redis', '#Telemetry', '#Streaming'],
    metaTitle: 'Penyelarasan Telemetri Real-Time dengan Kafka — Aether Core Stack',
    metaDesc: 'Pipeline telemetri terdistribusi dengan Redis ZSET dan event streaming Kafka berlatensi rendah.',
    content: `## Streaming Telemetri Non-Blocking

Pencatatan statistik kunjungan halaman web tidak boleh membebani siklus permintaan HTTP pengunjung. Stack by Aether Core memanfaatkan antrean pesan asinkron Apache Kafka yang di-buffer ke Redis Sorted Sets (ZSET).

\`\`\`go
func RecordHit(ctx context.Context, slug string) error {
    return redisClient.ZIncrBy(ctx, "herocms:articles:views", 1.0, slug).Err()
}
\`\`\`

Dengan pendekatan ini, waktu eksekusi middleware analitik kurang dari 0.4 milidetik di tepi jaringan.`
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
    publishedAt: '10 Sep 2026',
    excerpt: 'Strategi penyetelan buffer TCP, HTTP/3 QUIC, dan kompresi Brotli terintegrasi untuk menghasilkan performa web Core Web Vitals sempurna.',
    tags: ['#Traefik', '#DevOps', '#Performance', '#HTTP3'],
    metaTitle: 'Mengoptimalkan TTFB Edge Traefik v3 — Aether Core Stack DevOps',
    metaDesc: 'Langkah tuning Traefik v3 untuk mencapai skor Lighthouse 100/100 dan TTFB di bawah 2 milidetik.',
    content: `## Optimasi Jaringan Tepi (Edge Ingress)

Time-to-First-Byte (TTFB) adalah metrik krusial yang mempengaruhi skor Google Core Web Vitals. Melalui implementasi Traefik v3 Edge Ingress, kompresi Brotli stream diaktifkan secara otomatis bersamaan dengan dukungan protokol HTTP/3 QUIC berbasis UDP.`
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
    publishedAt: 'Draft',
    excerpt: 'Langkah praktis menghubungkan frontend Vue 3 dengan REST API backend Golang untuk membuat portofolio interaktif yang super cepat.',
    tags: ['#Vue3', '#HeadlessCMS', '#Tutorial', '#Frontend'],
    metaTitle: 'Panduan Portfolio Headless CMS — Aether Core Stack Tutorial',
    metaDesc: 'Tutorial membangun situs personal dan portofolio interaktif dengan arsitektur headless modern.',
    content: `## Arsitektur Headless Kontemporer

Headless CMS memisahkan lapisan penyajian visual (frontend) dari tempat penyimpanan konten dan logika bisnis (backend). Melalui Stack (Aether Core) API, pengembang dapat menyajikan konten ke berbagai platform sekaligus.`
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
    publishedAt: '08 Sep 2026',
    excerpt: 'Mendalami struktur unified cgroup hierarchy pada Linux 5.x/6.x untuk mencegah noisy neighbor problem pada server multi-tenant.',
    tags: ['#Linux', '#Kernel', '#Security', '#cgroups'],
    metaTitle: 'Isolasi Resource cgroups v2 Kernel Linux — Aether Core Stack',
    metaDesc: 'Mekanisme isolasi memori dan CPU hard-limit berbasis cgroups v2 untuk kluster Docker multi-tenant.',
    content: `## Hierarki Tunggal cgroups v2

Berbeda dengan cgroups v1 yang memisahkan pengontrol CPU dan memori ke pohon terpisah, cgroups v2 mengadopsi struktur hierarki tunggal terpadu yang lebih stabil dan aman.`
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
    publishedAt: '05 Sep 2026',
    excerpt: 'Konfigurasi IP rate limiting berbasis token bucket algorithm pada middleware reverse proxy untuk menangkis serangan brute-force.',
    tags: ['#Security', '#WAF', '#RateLimit', '#DDoS'],
    metaTitle: 'Pencegahan DDoS & Rate Limiting dengan Traefik — Aether Core Stack Security',
    metaDesc: 'Strategi keamanan mitigasi DDoS dan brute-force menggunakan token bucket middleware Traefik v3.',
    content: `## Mitigasi Ancaman di Lapisan Masuk

Pencegahan serangan penolakan layanan (DDoS) memerlukan pertahanan berlapis di titik gerbang terdepan sebelum lalu lintas menyentuh kontainer aplikasi tenant.`
  }
];

export const initialCmsPages: CmsPage[] = [
  {
    id: 'page_1',
    title: 'Beranda Utama (Home Landing)',
    path: '/',
    siteName: 'Portofolio Rizal Pratama',
    containerId: 'hero_tenant_9942',
    templateLayout: 'Hero Showcase Portfolio',
    status: 'published',
    updatedAt: '18 Okt 2026',
    isInNavbar: true,
    isInFooter: true,
    metaTitle: 'Rizal Pratama — Senior Cloud Architect & Software Engineer',
    metaDesc: 'Portofolio resmi arsitektur sistem cloud-native, orchestrator multi-tenant, dan sistem terdistribusi skala besar.',
    content: 'Halaman beranda utama yang menampilkan ringkasan profil keahlian, metrik kontainer aktif, dan proyek unggulan.'
  },
  {
    id: 'page_2',
    title: 'Tentang Saya & Pengalaman (About)',
    path: '/about',
    siteName: 'Portofolio Rizal Pratama',
    containerId: 'hero_tenant_9942',
    templateLayout: 'Executive Profile & Biography',
    status: 'published',
    updatedAt: '15 Okt 2026',
    isInNavbar: true,
    isInFooter: true,
    metaTitle: 'Tentang Rizal Pratama — Rekayasa Sistem & Keamanan',
    metaDesc: 'Profil profesional, rekam jejak sertifikasi arsitektur cloud, dan riwayat rekayasa perangkat lunak.',
    content: 'Halaman biografi lengkap yang mendokumentasikan sertifikasi teknis, metodologi devops, dan filosofi desain sistem terdistribusi.'
  },
  {
    id: 'page_3',
    title: 'Layanan & Solusi Konsultasi (Services)',
    path: '/services',
    siteName: 'Portofolio Rizal Pratama',
    containerId: 'hero_tenant_9942',
    templateLayout: 'Enterprise Solutions Grid',
    status: 'published',
    updatedAt: '12 Okt 2026',
    isInNavbar: true,
    isInFooter: false,
    metaTitle: 'Layanan Arsitektur Cloud & DevOps — Aether Core Stack Solutions',
    metaDesc: 'Layanan konsultasi orkestrasi kontainer, konfigurasi high-availability Traefik, dan audit keamanan multi-tenant.',
    content: 'Daftar penawaran paket konsultasi infrastruktur cloud, deployment pipeline CI/CD, dan mitigasi keamanan aplikasi.'
  },
  {
    id: 'page_4',
    title: 'Kontak & Formulir Diskusi (Contact)',
    path: '/contact',
    siteName: 'Portofolio Rizal Pratama',
    containerId: 'hero_tenant_9942',
    templateLayout: 'Interactive Inquiry Form',
    status: 'published',
    updatedAt: '10 Okt 2026',
    isInNavbar: true,
    isInFooter: true,
    metaTitle: 'Hubungi Rizal Pratama — Diskusi Proyek & Konsultasi',
    metaDesc: 'Formulir kontak langsung untuk penawaran kerjasama proyek dan integrasi webhook notifikasi Discord/Slack.',
    content: 'Formulir interaktif terhubung dengan webhook live yang langsung meneruskan pesan ke kanal komunikasi tim.'
  },
  {
    id: 'page_5',
    title: 'Kebijakan Privasi & Keamanan Data (Privacy)',
    path: '/privacy-policy',
    siteName: 'Portofolio Rizal Pratama',
    containerId: 'hero_tenant_9942',
    templateLayout: 'Legal & Compliance Document',
    status: 'draft',
    updatedAt: '06 Okt 2026',
    isInNavbar: false,
    isInFooter: true,
    metaTitle: 'Kebijakan Privasi & Keamanan Data — Aether Core Stack Platform',
    metaDesc: 'Dokumentasi kepatuhan privasi data tenant dan perlindungan enkripsi penyimpanan objek S3 MinIO.',
    content: 'Pernyataan kepatuhan hukum mengenai pengelolaan data pribadi pengunjung, cookie teknis, dan penyimpanan log telemetri.'
  }
];

export const initialMediaAssets: MediaAssetItem[] = [];

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
        url: 'https://rizalpratama.stacbyte.id/artikel/membangun-arsitektur-cloud-mandiri'
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
        source_site: 'rizalpratama.stacbyte.id'
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
        domain: 'rizalpratama.stacbyte.id',
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
        subdomain: 'rizalpratama.stacbyte.id',
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
    containerName: 'Toko Kopi Nusantara (kopinusantara.stacbyte.id)',
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
        message: 'Halo tim Technical Support 👋, kontainer situs Toko Kopi Nusantara (kopinusantara.stacbyte.id) tiba-tiba berstatus Standby dan tidak merespons saat diakses publik. Mohon bantuannya untuk pengecekan service kontainer kami 🙏'
      },
      {
        id: 'msg_2',
        sender: 'support',
        authorName: 'Budi Hartono',
        authorRole: 'L2 Cloud DevOps Engineer',
        timestamp: '09:48 WIB',
        message: 'Halo Pak Rizal, laporan Anda sudah kami terima. Kami sedang memeriksa healthcheck pod kontainer kopinusantara.stacbyte.id dan log memory cgroups v2. Apabila ada tangkapan layar (screenshot) pesan error di browser, silakan dilampirkan di chat ini ya 👍'
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
    containerName: 'Portofolio Rizal Pratama (rizalpratama.stacbyte.id)',
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
    containerName: 'Portofolio Rizal Pratama (rizalpratama.stacbyte.id)',
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
