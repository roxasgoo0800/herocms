import type { TeamMember, MicroserviceMeta } from '../types/docs';

export const teamMembers: TeamMember[] = [
  {
    id: "Rizal",
    name: "Rizal",
    role: "DevOps, Security & Rancang Bangun Awal",
    pic: "Rizal (Pelaksana Aktif)",
    icon: "🛡️⚙️",
    handover: "Rizal (PIC Ingress & Security)",
    focus: "Traefik SSL Ingress, cgroups Linux 256MB, pentest suite, serta merintis tampilan awal & handler awal.",
    responsibilities: "Menjaga keamanan gerbang server, hardening cgroups v2, dan automated pentest runner."
  },
  {
    id: "Andalusia",
    name: "Andalusia",
    role: "Full Stack Lead (Jago Backend & Frontend)",
    pic: "Rizal (Fondasi Siap)",
    icon: "⚙️",
    handover: "Andalusia (Target Handover Backend)",
    focus: "Mesin Docker SDK (03), API BFF (02), dan kasir pembayaran Midtrans (01).",
    responsibilities: "Menguasai backend Go Gin, Laravel Filament Admin, dan integrasi OpenAPI."
  },
  {
    id: "Irgi",
    name: "Irgi",
    role: "Frontend Web Specialist (Studio & Marketing)",
    pic: "Rizal (UI Selesai Dicentang)",
    icon: "🎨",
    handover: "Irgi (Target Handover Frontend)",
    focus: "Dashboard Studio Vue 3 (02) dan Website Marketing React 19 (04).",
    responsibilities: "Keindahan visual, interaksi drag-and-drop blok 60fps, dan responsive mobile."
  },
  {
    id: "Risqi",
    name: "Risqi",
    role: "Database Management Specialist",
    pic: "Rizal (Skema Mock Siap)",
    icon: "🗄️",
    handover: "Risqi (Target Handover Database)",
    focus: "PostgreSQL 16 RLS, Redis 7 ZSET (<1ms), MinIO S3, dan automated backup cron.",
    responsibilities: "Isolasi data multi-tenant kernel RLS, tuning indeks, dan disaster recovery."
  },
  {
    id: "Tyno",
    name: "Tyno",
    role: "Mobile Apps Specialist (Jago Frontend Mobile)",
    pic: "Rizal (Kontrak API Siap)",
    icon: "📱",
    handover: "Tyno (Target Handover Mobile)",
    focus: "HeroCMS Companion App (Flutter / React Native) untuk Android & iOS.",
    responsibilities: "Live telemetry monitoring di saku, push notif FCM leads/invoice, dan reboot FaceID."
  },
  {
    id: "Paijo",
    name: "Paijo (AI Agent)",
    role: "Lead Project Manager & QA/QC Specialist",
    pic: "Paijo (Karyawan PM & QA/QC)",
    icon: "🤖🔍",
    handover: "Paijo (PM & QA/QC Specialist)",
    focus: "Sprint backlog orchestration, Definition of Done (DoD) gate, E2E Playwright, dan Pentest audit.",
    responsibilities: "Mendistribusikan task tanpa henti, memvalidasi kualitas rilis, dan menjaga roadmap."
  }
];

export const microservicesList: MicroserviceMeta[] = [
  {
    id: "01-admin-console",
    name: "Service 01: Admin Console & Billing",
    version: "v1.2.0",
    path: "services/01-admin-console",
    stack: "Laravel 11 • Filament v3 • PHP 8.3 • Midtrans / Xendit",
    pic: "Andalusia, Risqi & Paijo (QA)",
    icon: "🏛️",
    lead: "Panel kontrol internal superadmin untuk mengelola tenant, verifikasi langganan, pelacakan faktur, webhook kasir pembayaran, resolver tiket, dan verifikasi kontrak API.",
    mandates: [
      "Validasi tanda tangan SHA512 pada webhook Midtrans/Xendit",
      "Autentikasi ketat Filament SuperAdmin",
      "Isolasi relasi invoice terhadap tenant ID"
    ],
    forbidden: [
      "Dilarang menyimpan plaintext API token",
      "Dilarang mengekspos kredensial database tenant ke client"
    ]
  },
  {
    id: "02-dashboard-cms",
    name: "Service 02: Dashboard Studio & Go BFF",
    version: "v1.14.27",
    path: "services/02-dashboard-cms",
    stack: "Vue 3 • Vite • Pinia • Gin Golang (Port 8085) • Redis • MinIO",
    pic: "Irgi, Rizal, Andalusia & Paijo (QA)",
    icon: "🎨",
    lead: "Pusat antarmuka utama pengguna (12 Modul Studio), backend Go BFF (port 8085), visual editor blok, artikel, media, custom domain, analitik, dan suite regresi E2E Playwright.",
    mandates: [
      "Single-binary mode Gin port 8085 (embed.FS)",
      "Zero-CSS Duplication menggunakan studio-master.css",
      "Lazy loading modul menu via defineAsyncComponent",
      "DOMPurify sanitasi untuk semua input HTML dinamis"
    ],
    forbidden: [
      "Dilarang menaruh ratusan baris data statis di dalam file .vue",
      "Dilarang membuat style duplikat di scoped style"
    ]
  },
  {
    id: "03-provision-orchestrator",
    name: "Service 03: Container Provision Orchestrator & Infra",
    version: "v1.8.0",
    path: "services/03-provision-orchestrator",
    stack: "Golang • Docker Engine SDK • Linux cgroups v2 • Traefik v3",
    pic: "Andalusia, Rizal & Paijo (QC)",
    icon: "⚙️",
    lead: "Mesin otonom pembuat dan pengatur siklus hidup kontainer Docker mandiri tenant dengan cgroups sandboxing (RAM 256MB/CPU 0.5), Traefik ingress SSL, dan pentest compliance gate.",
    mandates: [
      "Hard limit cgroups v2 256MB RAM / 0.5 CPU",
      "Non-root UID 10001 dan read-only rootfs",
      "Drop ALL capabilities",
      "Sanitasi regex domain Traefik ^[a-z0-9-]+$"
    ],
    forbidden: [
      "Dilarang memakai flag --privileged",
      "Dilarang membuka port langsung ke host tanpa ingress Traefik"
    ]
  },
  {
    id: "04-marketing-site",
    name: "Service 04: Marketing Site & Public Landing",
    version: "v1.9.2",
    path: "services/04-marketing-site",
    stack: "React 19 • TypeScript • Tailwind CSS • Vite",
    pic: "Irgi & Paijo (QA)",
    icon: "🚀",
    lead: "Website pemasaran publik utama HeroCMS untuk landing page berkonversi tinggi, showcase playground interaktif, kalkulator harga, pendaftaran tenant baru, dan audit Core Web Vitals (LCP < 1.2s).",
    mandates: [
      "Skor LCP < 1.2 detik, CLS = 0",
      "Sanitasi path routing cegah directory traversal (/../../etc/passwd)",
      "Tailwind CSS utility & mobile-first responsive"
    ],
    forbidden: [
      "Dilarang mengimpor library script berat yang memblokir render hero image"
    ]
  },
  {
    id: "05-ai-agent-service",
    name: "Service 05: AI Agent Service & Workflows",
    version: "v1.3.0",
    path: "services/05-ai-agent-service",
    stack: "Golang / Python • Gemini API • Claude LLM • n8n",
    pic: "Andalusia",
    icon: "🤖",
    lead: "Microservice kecerdasan buatan untuk copilot penulisan konten otomatis di visual editor, generator template tema website dari teks prompt, dan alur kerja n8n auto-poster.",
    mandates: [
      "Rate-limit kuota prompt per tenant",
      "Streaming SSE response dengan TTFT < 800ms",
      "Sanitasi teks/JSON keluaran LLM"
    ],
    forbidden: [
      "Dilarang mengeksekusi prompt LLM langsung ke shell server host"
    ]
  },
  {
    id: "06-mobile-companion",
    name: "Service 06: Mobile Companion Platform",
    version: "v1.0.0",
    path: "mobile-companion/",
    stack: "Flutter / React Native • Firebase Cloud Messaging (FCM)",
    pic: "Tyno",
    icon: "📱",
    lead: "Aplikasi mobile smartphone Android & iOS pendamping pemilik website untuk memantau pengunjung live, menerima notifikasi pesan baru & invoice, dan reboot darurat lewat FaceID.",
    mandates: [
      "Monitoring telemetri live & push alert FCM",
      "Emergency reboot via FaceID / Biometrics",
      "Offline-first local caching"
    ],
    forbidden: [
      "Dilarang membebani aplikasi mobile dengan canvas page builder drag-and-drop"
    ]
  },
  {
    id: "07-docs",
    name: "Service 07: Team SOP & Enterprise Documentation Hub",
    version: "v1.3.0",
    path: "services/07-docs",
    stack: "Vue 3 • Vite • Pinia • Go BFF (Port 8087) • SQLite (WAL)",
    pic: "Rizal & Paijo (QA)",
    icon: "📚",
    lead: "Pusat dokumentasi tim enterprise, kamus blueprint arsitektur, sprint board interaktif, SOP operasional, reader view artikel komprehensif, dan verifikasi pentest otomatis.",
    mandates: [
      "Zero-CSS Duplication menggunakan studio-master.css",
      "Mode baca artikel distraction-free reader view",
      "Pemisahan data statis di src/data/*.ts",
      "Audit pentest sebelum commit"
    ],
    forbidden: [
      "Dilarang menumpuk modal popup berat untuk membaca artikel dokumentasi",
      "Dilarang menyatukan versi microservices yang berbeda menjadi satu versi monolitik"
    ]
  }
];
