import type {
  UserPlan,
  ContainerSite,
  ContentArticle,
  CmsPage,
  MediaAssetItem,
  CustomDomainItem,
  WebhookItem,
  InvoiceItem,
  SupportTicketItem
} from '../types/dashboard';
import { officialTemplatesData, type OfficialTemplateItem } from './templates-data';

export type { OfficialTemplateItem };

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

export const officialTemplates: OfficialTemplateItem[] = officialTemplatesData;

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
    publishedAt: '16 Sep 2026',
    excerpt: 'Membangun platform PaaS multi-tenant berkinerja tinggi menggunakan Docker Engine SDK dan Golang dengan isolasi cgroups v2 ketat.',
    tags: ['#Docker', '#Golang', '#PaaS', '#MultiTenant'],
    metaTitle: 'Arsitektur Multi-Tenant dengan Docker & Go — HeroCMS Tech',
    metaDesc: 'Panduan teknis arsitektur multi-tenant berbasis kontainer Docker mandiri dan Golang orchestrator.',
    content: `## Pendahuluan

Arsitektur multi-tenant modern menuntut isolasi sumber daya yang kokoh tanpa mengorbankan efisiensi komputasi server. Dalam ekosistem HeroCMS, setiap situs tenant dialokasikan dalam kontainer Docker mandiri yang dipantau oleh Go Orchestrator melalui socket \`/var/run/docker.sock\`.

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
    metaTitle: 'Penyelarasan Telemetri Real-Time dengan Kafka — HeroCMS',
    metaDesc: 'Pipeline telemetri terdistribusi dengan Redis ZSET dan event streaming Kafka berlatensi rendah.',
    content: `## Streaming Telemetri Non-Blocking

Pencatatan statistik kunjungan halaman web tidak boleh membebani siklus permintaan HTTP pengunjung. HeroCMS memanfaatkan antrean pesan asinkron Apache Kafka yang di-buffer ke Redis Sorted Sets (ZSET).

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
    metaTitle: 'Mengoptimalkan TTFB Edge Traefik v3 — HeroCMS DevOps',
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
    metaTitle: 'Panduan Portfolio Headless CMS — HeroCMS Tutorial',
    metaDesc: 'Tutorial membangun situs personal dan portofolio interaktif dengan arsitektur headless modern.',
    content: `## Arsitektur Headless Kontemporer

Headless CMS memisahkan lapisan penyajian visual (frontend) dari tempat penyimpanan konten dan logika bisnis (backend). Melalui HeroCMS API, pengembang dapat menyajikan konten ke berbagai platform sekaligus.`
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
    metaTitle: 'Isolasi Resource cgroups v2 Kernel Linux — HeroCMS',
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
    metaTitle: 'Pencegahan DDoS & Rate Limiting dengan Traefik — HeroCMS Security',
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
    metaTitle: 'Layanan Arsitektur Cloud & DevOps — HeroCMS Solutions',
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
    metaTitle: 'Kebijakan Privasi & Keamanan Data — HeroCMS Platform',
    metaDesc: 'Dokumentasi kepatuhan privasi data tenant dan perlindungan enkripsi penyimpanan objek S3 MinIO.',
    content: 'Pernyataan kepatuhan hukum mengenai pengelolaan data pribadi pengunjung, cookie teknis, dan penyimpanan log telemetri.'
  }
];

export const initialMediaAssets: MediaAssetItem[] = [];

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
