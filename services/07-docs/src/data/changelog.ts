import type { ChangelogRelease } from '../types/docs';

export const docsChangelogReleases: ChangelogRelease[] = [
  {
    version: 'v1.5.4',
    service: '07-docs',
    serviceName: 'Service 07: Docs & Mission Control',
    releaseDate: '24 Oktober 2026',
    title: 'Sinkronisasi PRD-02 Dashboard Studio v1.25.0 (Pusat Bantuan Live Chat & Animasi Studio) serta Mitigasi Node.js CVE-2026-48930',
    summary: 'Memperbarui dokumentasi PRD-02 Dashboard Studio ke versi v1.25.0-PROD (mencakup Pusat Bantuan 4 Divisi & Live Chat 1140px model WhatsApp bertema Studio, kapsul chat terpadu, ikon navigasi sidebar berwarna semantik, serta animasi cascade konten), sekaligus meng-upgrade base image frontend-builder ke Node.js 26 (v26.12.1 / node:26-alpine) untuk memitigasi CVE-2026-48930.',
    badge: 'Latest',
    author: 'Paijo (PM & QA/QC Lead) & Aether Core Dev (Rizal)',
    items: [
      {
        id: 'c-07docs-154-1',
        type: 'security',
        scope: 'Mitigasi CVE-2026-48930 & Upgrade Toolchain Node.js 26',
        description: 'Memperbarui Dockerfile Stage 1 (frontend-builder) ke node:26-alpine dan menyelaraskan environment CI Quality Gate ke Node.js 26.'
      },
      {
        id: 'c-07docs-154-2',
        type: 'feature',
        scope: 'Sinkronisasi Spesifikasi PRD-02 Dashboard Studio v1.25.0-PROD',
        description: 'Mendokumentasikan modul Pusat Bantuan & Live Chat 1140px (4 divisi tujuan, Centang 1/2/Biru + timestamp baca, Unified Chat Capsule), sistem ikon sidebar berwarna semantik (.nav-icon-box), serta koreografi animasi masuk berjenjang (studioCardCascadeIn).'
      }
    ]
  },
  {
    version: 'v1.5.3',
    service: '07-docs',
    serviceName: 'Service 07: Docs & Mission Control',
    releaseDate: '22 Oktober 2026',
    title: 'Sinkronisasi Matriks 52 Sprint Tasks, Penambahan Tugas CI/CD & Rebranding, serta Pembaruan Status Pekerjaan Riil',
    summary: 'Memperbarui basis data interaktif Mission Control Docs Hub: (1) Menambahkan tugas baru TSK-CICD-01 (Selective Quality Gate CI/CD & Automated GitHub Incident Triage); (2) Menambahkan tugas baru TSK-REB-01 (Universal Rebranding Platform: Aether Core & Stack CMS); (3) Memperbarui status riil tugas TSK-OPS-03, TSK-CHG-01, TSK-INV-01, dan TSK-QA-03 menjadi COMPLETED dengan checklist terverifikasi; (4) Sinkronisasi dokumen TASK_CHECKLIST.md dan database SQLite internal.',
    badge: 'Stable',
    author: 'Paijo (PM & QA/QC Lead) & Aether Core Dev (Rizal)',
    items: [
      {
        id: 'c-07docs-153-1',
        type: 'improvement',
        scope: 'Sprint Tasks Database & Telemetri 52 Tugas',
        description: 'Memperbarui dataset tasks.json dengan 2 task baru (TSK-CICD-01, TSK-REB-01) dan menyelaraskan total menjadi 52 tugas terlacak.'
      },
      {
        id: 'c-07docs-153-2',
        type: 'improvement',
        scope: 'Sinkronisasi Status Riil Pekerjaan Sprint',
        description: 'Memperbarui checklist dan status penyelesaian tugas E-Faktur DJP 3.0, CI/CD automated incident dispatch, serta pentest runner.'
      }
    ]
  },
  {
    version: 'v1.5.2',
    service: '07-docs',
    serviceName: 'Service 07: Docs & Mission Control',
    releaseDate: '22 Oktober 2026',
    title: 'Dokumentasi Sistem Quality Gate CI/CD Selektif, Skrip Pra-Commit Lokal & Triase Insiden GitHub Otomatis',
    summary: 'Memperbarui seluruh pilar dokumentasi Mission Control Docs Hub dengan menambahkan SOP dan Blueprint Arsitektur pengujian kualitas otomatis: (1) Penambahan SOP-CICD-01 Standar Selective Quality Gate CI/CD & Automated Incident Triage GitHub Actions; (2) Penambahan Blueprint Arsitektur BP-CICD-01; (3) Dokumentasi skrip verifikasi pra-commit lokal scripts/test-changed.sh; (4) Dokumentasi alur 4 tahap rilis enterprise (Quality Gate -> PR Merge -> Tag Release -> Docker Hub).',
    badge: 'Stable',
    author: 'Paijo (PM & QA/QC Lead) & Aether Core Dev (Rizal)',
    items: [
      {
        id: 'c-07docs-152-1',
        type: 'feature',
        scope: 'SOP & Blueprint CI/CD Quality Gate & Incident Dispatcher',
        description: 'Menambahkan SOP-CICD-01 dan Blueprint BP-CICD-01 ke sistem dokumentasi interaktif Mission Control Hub.'
      },
      {
        id: 'c-07docs-152-2',
        type: 'improvement',
        scope: 'Dokumentasi Utilitas Skrip Pra-Commit Lokal test-changed.sh',
        description: 'Mendokumentasikan tata cara penggunaan skrip pengujian selektif lokal sebelum developer melakukan git push.'
      }
    ]
  },
  {
    version: 'v1.5.1',
    service: '07-docs',
    serviceName: 'Service 07: Docs & Mission Control',
    releaseDate: '22 Oktober 2026',
    title: 'Penyelarasan Identitas Rebranding: Entitas Perusahaan Aether Core & Produk CMS Stack',
    summary: 'Memperbarui seluruh pilar dokumentasi Mission Control Docs Hub, kop header, breadcrumbs, dan spesifikasi PRD untuk mencerminkan identitas resmi baru: Aether Core sebagai nama entitas perusahaan dan Stack sebagai nama produk platform CMS otonom.',
    badge: 'Stable',
    author: 'Paijo (PM & QA/QC Lead) & Aether Core Dev (Rizal)',
    items: [
      {
        id: 'c-07docs-151-1',
        type: 'improvement',
        scope: 'Branding Alignment Header, Navigation & Mission Control Layout',
        description: 'Menyelaraskan logo wordmark, breadcrumbs, dan profil tim menjadi Aether Core Docs & Engineering.'
      },
      {
        id: 'c-07docs-151-2',
        type: 'improvement',
        scope: 'Penyelarasan Spesifikasi PRD & Dokumen Divisi Layanan',
        description: 'Memperbarui nama produk portal pelanggan menjadi Stack Studio by Aether Core serta menyelaraskan deskripsi PRD dan pembagian kerja tim.'
      }
    ]
  },
  {
    version: 'v1.5.0',
    service: '07-docs',
    serviceName: 'Service 07: Docs & Mission Control',
    releaseDate: '20 Oktober 2026',
    title: 'Dokumentasi Komprehensif Arsitektur E-Faktur DJP 3.0, Visualisasi Fiskal ECharts, Blueprint Penagihan & System Journey JRN-08',
    summary: 'Memperbarui seluruh pilar dokumentasi Mission Control Docs Hub untuk mencakup kapabilitas penagihan enterprise dan modul Dashboard Studio terbaru: (1) Pembaruan PRD-02 Dashboard CMS ke versi v1.23.0-PROD mencakup E-Faktur DJP 3.0, Apache ECharts spline area visualizer, buku besar faktur 1260px, checkout simulasi cluster kustom, modal website split-layout 980px, dan scoped PAT; (2) Blueprint Arsitektur baru BP-EFAKTUR-01; (3) System Journey baru JRN-08 Siklus Penagihan Resmi SaaS & Rekonsiliasi PPN 11%.',
    badge: 'Stable',
    author: 'Paijo (PM & QA/QC Lead) & HeroCMS Dev (Rizal)',
    items: [
      {
        id: 'c-07docs-150-1',
        type: 'feature',
        scope: 'Pembaruan PRD-02 Dashboard CMS Studio v1.23.0',
        description: 'Mendokumentasikan modul Faktur & E-Faktur DJP 3.0, integrasi Apache ECharts spline area curve, buku besar lapang 1260px, simulasi cluster checkout, dan modal 980px pembuatan situs baru.'
      },
      {
        id: 'c-07docs-150-2',
        type: 'feature',
        scope: 'Blueprint Arsitektur BP-EFAKTUR-01 Penagihan Resmi & E-Faktur DJP 3.0',
        description: 'Menyusun kamus blueprint arsitektur teknis penagihan resmi SaaS, standar PER-03/PJ/2022 & PMK-60, approval hash QR Code DJP, tanda tangan digital CFO, dan kode implementasi Vue 3 ECharts.'
      },
      {
        id: 'c-07docs-150-3',
        type: 'feature',
        scope: 'System Journey JRN-08 Siklus Penagihan SaaS & Rekonsiliasi PPN 11%',
        description: 'Memetakan 6 tahapan alur hidup transaksi komersial dari pemilihan paket / simulasi cluster kustom, kliring multi-kanal, pencatatan buku besar, hingga rendering modal E-Faktur 1200px.'
      }
    ]
  },
  {
    version: 'v1.4.1',
    service: '07-docs',
    serviceName: 'Service 07: Docs & Mission Control',
    releaseDate: '19 Oktober 2026',
    title: 'Penyempurnaan Tombol Baca, Alur Kerja Ribbon, dan Refaktor Master CSS Tampilan Detail Reader (PRD & Security)',
    summary: 'Memperbaiki styling tombol aksi Baca di semua kartu dari PRD, Kamus Blueprint, Matriks Keamanan hingga SOP menggunakan styling universal master CSS (.btn-read-sop). Menambahkan visual ribbon alur kerja (.bp-flow-preview) dengan pil bertahap dan panah penghubung. Merefaktor PrdArticleReader dan SecurityArticleReader ke sistem layout editorial Obsidian Studio Master (.article-reader-page, .reader-page-hero, .reader-layout-grid, .reader-main-content, .reader-sidebar-inspector), melengkapi alur kerja pipeline flowchart interaktif, dan menyempurnakan kartu detail agar tidak berantakan di layar monitor.',
    badge: 'Stable',
    author: 'HeroCMS Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'c-07docs-141-1',
        type: 'improvement',
        scope: 'Universal Card Action Button & Alur Kerja Ribbon',
        description: 'Menerapkan kelas styling universal .btn-read-sop dan .bp-flow-preview pada ArchitectureModule, PrdCatalogModule, SecurityMatrixModule, dan SopRunbookModule dengan hover glow, aksen biru, dan pratinjau tahapan alur kerja terhubung.'
      },
      {
        id: 'c-07docs-141-2',
        type: 'bugfix',
        scope: 'PrdArticleReader Master Obsidian Layout Refactoring',
        description: 'Merefaktor PrdArticleReader.vue menggunakan standar kelas master reader (.article-reader-page, .reader-page-hero, .reader-layout-grid, .reader-main-content, .reader-sidebar-inspector), menambahkan diagram pipeline alur kerja modul (.flowchart-pipeline-container), dan menata ulang card spesifikasi tech stack.'
      },
      {
        id: 'c-07docs-141-3',
        type: 'bugfix',
        scope: 'SecurityArticleReader Master Obsidian Layout Refactoring',
        description: 'Merefaktor SecurityArticleReader.vue ke standar master reader dengan hero banner gelap bergradasi, diagram pipeline alur verifikasi pengujian (.flowchart-pipeline-container), checklist interaktif kepatuhan audit, dan callout rujukan file proteksi.'
      },
      {
        id: 'c-07docs-141-4',
        type: 'improvement',
        scope: 'SystemJourneyModule Flowchart Connector Line Fix',
        description: 'Menghubungkan garis connector vertikal dan badge penomoran (.pipeline-step-badge, .pipeline-step-line) pada seluruh alur proses bisnis dan siklus perjalanan sistem HeroCMS.'
      }
    ]
  },
  {
    version: 'v1.4.0',
    service: '07-docs',
    serviceName: 'Service 07: Docs & Mission Control',
    releaseDate: '19 Oktober 2026',
    title: 'Inkorporasi Spesifikasi PRD (7 Layanan), Matriks Keamanan & Sandboxing (20 Pilar), serta Alur Kerja Sistem (System Journeys)',
    summary: 'Menambahkan 3 modul dokumentasi arsitektur dan spesifikasi enterprise utama ke dalam Mission Control Portal: 1) Katalog PRD menyeluruh untuk 7 microservice lengkap dengan target persona, teknologi, modul fungsional, kontrak API, NFR, roadmap, dan KPI. 2) Matriks Keamanan Web & Backend mencakup 20 Pilar Standar Keamanan OWASP/CWE plus spesifikasi pengerasan Linux cgroups v2 sandboxing kontainer Docker (UID 10001, ReadonlyRootfs, CapDrop ALL, tmpfs RAM) dan checklist verifikasi interaktif. 3) Alur Kerja Sistem (System Journeys) interaktif yang memetakan siklus hidup end-to-end (provisioning <4.5s, edge routing Traefik v3 & TLS 1.3, isolasi PostgreSQL RLS, telemetri Redis Sorted Sets, AI Copilot synthesis, dedicated S3 bucket, dan offline drafting PWA).',
    badge: 'Stable',
    author: 'HeroCMS Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'c-07docs-140-1',
        type: 'feature',
        scope: 'Katalog PRD 7 Microservices (01 - 07)',
        description: 'Membangun PrdCatalogModule dan PrdArticleReader yang memuat dokumen kebutuhan produk (PRD) lengkap untuk Platform Admin Console (01), Dashboard CMS Studio (02), API Orkestrator Provisioning (03), Website Promosi (04), AI Agent Service (05), Mobile Companion (06), dan Docs Hub (07).'
      },
      {
        id: 'c-07docs-140-2',
        type: 'security',
        scope: 'Matriks Keamanan 20 Pilar & Docker Sandboxing',
        description: 'Membangun SecurityMatrixModule dan SecurityArticleReader yang memaparkan 20 Pilar Keamanan Web & Backend (API Key aman, anti-SQLi pgx, anti-XSS DOMPurify/CSP, CSRF double submit, Redis stateful session, dedicated S3 bucket quota 2GB, magic bytes sniffing) serta penegakan Linux cgroups v2 sandboxing.'
      },
      {
        id: 'c-07docs-140-3',
        type: 'feature',
        scope: 'Alur Kerja Sistem (7 Interactive System Journeys)',
        description: 'Membangun SystemJourneyModule yang memvisualisasikan alur sistem kritis dari hulu ke hilir dengan connected pipeline flowchart, urutan aktor, SLA latensi, penanganan kegagalan otomatis (self-healing), dan perintah verifikasi CLI siap salin.'
      },
      {
        id: 'c-07docs-140-4',
        type: 'improvement',
        scope: 'Sidebar Navigation & Telemetry Stats Expansion',
        description: 'Memperbarui sidebar navigasi Docs Hub dengan tab PRD, Alur Kerja Sistem, dan Keamanan & Sandbox, serta memperluas TelemetryGrid untuk menampilkan metrik agregat 7 PRD, 21 Pilar Keamanan, dan 7 System Journeys.'
      }
    ]
  },
  {
    version: 'v1.3.1',
    service: '07-docs',
    serviceName: 'Service 07: Docs & Mission Control',
    releaseDate: '19 Oktober 2026',
    title: 'Perbaikan Responsif Grid Kartu Melebihi Batas Layar & Perapihan Tampilan Alur Flowchart Kamus/SOP',
    summary: 'Memperbaiki masalah kartu melebihi batas layar monitor komputer (cropped/overflow) dengan menerapkan sistem grid adaptif minmax(0, 1fr) pada .site-cards-grid (2 kolom pada resolusi laptop <=1440px dan 3 kolom pada layar lebar), mencegah teks panjang merusak ukuran kartu via text truncation dan max-width batas. Merombak tampilan berantakan saat klik menu/kartu Kamus Arsitektur dan SOP & Runbooks: mengganti tab filter yang menumpuk menjadi chips filter mandiri (.category-chip), menata ulang flowchart menjadi diagram pipeline berurutan yang terhubung (.flowchart-pipeline-container), memformat panduan Cara Coba dengan nomor langkah rapi (.step-test-list), menata matriks Do\'s & Don\'ts responsif auto-fit, serta memotong badge service pada inspector sidebar agar tidak tembus kartu.',
    badge: 'Stable',
    author: 'HeroCMS Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'c-07docs-131-1',
        type: 'bugfix',
        scope: 'Responsive Cards Grid & Screen Cropping Prevention',
        description: 'Memperbaiki .site-cards-grid menggunakan minmax(0, 1fr) dengan breakpoint 1440px (2 kolom pada laptop), menambahkan min-width: 0 pada seluruh kartu (.task-card-pro, .sop-card-pro, .blueprint-card-pro) sehingga kartu tidak lagi meluap dan terpotong di layar monitor.'
      },
      {
        id: 'c-07docs-131-2',
        type: 'bugfix',
        scope: 'Kamus & SOP Category Filter Chips',
        description: 'Mengganti grouped pill bar yang berjejal dan berantakan pada kategori Kamus Arsitektur dan SOP menjadi filter chip mandiri (.category-chip) yang mengalir responsif dengan counter badge akurat.'
      },
      {
        id: 'c-07docs-131-3',
        type: 'improvement',
        scope: 'Connected Step Pipeline Flowchart Architecture',
        description: 'Mengganti susunan box flowchart yang tidak terhubung menjadi pipeline langkah berurutan terhubung (.flowchart-pipeline-container) dengan badge nomor bulat, garis penghubung bertahap, dan kartu keterangan yang rapi.'
      },
      {
        id: 'c-07docs-131-4',
        type: 'bugfix',
        scope: 'Inspector Sidebar & Do\'s/Don\'ts Matrix Breathing Room',
        description: 'Memperbaiki .spec-row dengan flex-wrap dan badge truncation pada service name, merestrukturisasi .dnd-matrix-container dengan minmax(280px, 1fr), serta menata daftar Cara Coba (.step-test-list) dengan penomoran elegan.'
      }
    ]
  },
  {
    version: 'v1.3.0',
    service: '07-docs',
    serviceName: 'Service 07: Docs & Mission Control',
    releaseDate: '19 Oktober 2026',
    title: 'Peluncuran Mode Baca Artikel SOP & Arsitektur dengan Flowchart, DND Matrix, Golang API & Uji cURL',
    summary: 'Memutakhirkan microservice docs ke v1.3.0 dengan menghadirkan pengalaman pembaca artikel mendalam pada kartu SOP (SopArticleReader.vue) dan Kamus Arsitektur (ArchitectureArticleReader.vue). Dilengkapi visual flowchart pengerjaan, matriks Do\'s & Don\'ts (DND) 2 kolom, spesifikasi teknis implementasi backend Golang, perintah cURL siap salin dengan panduan live testing per-service, perbaikan filter kategori dinamis, restrukturisasi kartu yang rapi dan terstandarisasi, eliminasi widget status sprint sidebar, identitas profil engineering enterprise netral, serta verifikasi deployment kontainer Docker Compose di port 8087.',
    badge: 'Stable',
    author: 'HeroCMS Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'c-07docs-130-1',
        type: 'feature',
        scope: 'Dedicated SOP Article Reader with Flowchart & DND Matrix',
        description: 'Menerbitkan SopArticleReader.vue lengkap dengan visual step flowchart, uraian runbook bertahap, matriks Do\'s & Don\'ts 2 kolom, contoh API call dan handler Go, serta kriteria Definition of Done.'
      },
      {
        id: 'c-07docs-130-2',
        type: 'feature',
        scope: 'Architecture Blueprint Reader with Golang Code & Live cURL Testing',
        description: 'Menerbitkan ArchitectureArticleReader.vue untuk seluruh 13 blueprint arsitektur yang menguraikan konsep sistem, alur data komponen, potongan implementasi Go resmi, spesifikasi API endpoint, dan panduan cara coba (live testing).'
      },
      {
        id: 'c-07docs-130-3',
        type: 'improvement',
        scope: 'Card Restructuring & Dynamic Category Filters',
        description: 'Menstandarisasi kartu SOP (.sop-card-pro) dan kartu arsitektur (.blueprint-card-pro) dengan layout rapi dan seimbang, serta menyinkronkan kategori filter secara dinamis dari dataset.'
      },
      {
        id: 'c-07docs-130-4',
        type: 'improvement',
        scope: 'Sidebar Streamlining & Enterprise Workspace Identity',
        description: 'Menghapus widget gauge status sprint yang tidak diperlukan pada footer sidebar dan mengganti profil user individu menjadi identitas HeroCMS Engineering (Platform & Mission Control).'
      },
      {
        id: 'c-07docs-130-5',
        type: 'feature',
        scope: 'Verified Docker Compose Multi-Stage Deployment',
        description: 'Memverifikasi dan menjalankan service docs via docker compose di port 8087 dengan multi-stage build Alpine ultra-lightweight, lulus seluruh automated pentest black-box suite.'
      }
    ]
  },
  {
    version: 'v1.2.0',
    service: '07-docs',
    serviceName: 'Service 07: Docs & Mission Control',
    releaseDate: '19 Oktober 2026',
    title: 'Transformasi Mode Baca Artikel In-Page, Restrukturisasi Kartu Rapi & Upgrade Tipografi Plus Jakarta Sans',
    summary: 'Meredesain menyeluruh pengalaman pembaca dokumen di services/07-docs: mengganti modal dialog mengambang dengan pembaca artikel editorial penuh (in-page reader) yang distraction-free, merapikan struktur kartu tugas dengan visual hierarchy modern tanpa tumpukan kotak abu-abu yang padat, serta mengintegrasikan fondasi tipografi Plus Jakarta Sans dengan anti-aliasing tajam dan font JetBrains Mono untuk keterbacaan kelas enterprise.',
    badge: 'Stable',
    author: 'HeroCMS Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'c-07docs-120-1',
        type: 'feature',
        scope: 'Dedicated In-Page Article Reader View',
        description: 'Menggantikan modal popup dialog (TaskDetailModal) dengan komponen pembaca artikel komprehensif (TaskArticleReader.vue) berbasis tata letak 2 kolom, header navigasi dengan tombol kembali, mode fokus pembaca tanpa distraksi (immersive mode), dan navigasi sekuensial antar-tugas.'
      },
      {
        id: 'c-07docs-120-2',
        type: 'improvement',
        scope: 'Task Card Pro System & Visual De-Cluttering',
        description: 'Merapikan dan menstandarisasi kartu tugas (.task-card-pro) dengan hierarki visual jelas: chip ID monospace, badge prioritas semantik, pill file target terpadu, meter progres checklist ramping, dan baris handover personil yang bersih.'
      },
      {
        id: 'c-07docs-120-3',
        type: 'improvement',
        scope: 'Universal Plus Jakarta Sans Typography & Font Smoothing',
        description: 'Memperbaiki font tampilan dokumen dengan mengaktifkan font Plus Jakarta Sans secara universal pada html, body, tombol, heading, dan input dengan -webkit-font-smoothing dan font JetBrains Mono untuk blok kode.'
      },
      {
        id: 'c-07docs-120-4',
        type: 'performance',
        scope: 'Keyboard Navigation & Sequential Task Reading',
        description: 'Menambahkan pintasan keyboard Escape untuk kembali ke papan tugas serta Alt+Panah untuk membaca tugas berikutnya/sebelumnya secara cepat tanpa memuat ulang halaman.'
      }
    ]
  },
  {
    version: 'v1.0.0',
    service: '07-docs',
    serviceName: 'Service 07: Docs & Mission Control',
    releaseDate: '19 Oktober 2026',
    title: 'Peluncuran Service 07 Docs & Mission Control Hub (Vue 3 + Go Native BFF + Database Persistence)',
    summary: 'Menerbitkan microservice mandiri services/07-docs (HeroCMS Docs & Mission Control Hub) yang menyatukan 4 telemetri real-time, 50 task matrix berstatus ONGOING dengan alur handover spesialis, modal reader interaktif dengan checklist persistence langsung ke database melalui REST API PATCH, 13 blueprint panduan arsitektur operasional, 10 SOP standar enterprise, dan modul protokol Paijo AI PM & QA/QC. Layanan berjalan di port 8087 dengan routing Traefik (docs.herocms.stackbyte.id), dilengkapi pentest suite, dan arsitektur zero-CSS duplication berbasis studio-master.css.',
    badge: 'Stable',
    author: 'HeroCMS Dev (Rizal) & Paijo (PM & QA/QC)',
    items: [
      {
        id: 'c-11500-1',
        type: 'feature',
        scope: 'Service 07 Docs & Mission Control Microservice',
        description: 'Mendirikan layanan microservice baru services/07-docs dengan frontend Vue 3 (Vite + TypeScript + Pinia), Go Native BFF (port 8087, Go 1.22+ Standard Router), dan registrasi ingress Traefik docs.herocms.stackbyte.id.'
      },
      {
        id: 'c-11500-2',
        type: 'feature',
        scope: 'Interactive Checklist with Database Persistence',
        description: 'Mengimplementasikan penyimpanan checklist real-time ke database melalui endpoint PATCH /api/v1/tasks/:id/checklist sehingga progres centang pada modal pembaca tersimpan secara persisten.'
      },
      {
        id: 'c-11500-3',
        type: 'feature',
        scope: '50-Task Dual-Mode Matrix & Continuous Sprint ONGOING Status',
        description: 'Menyajikan 50 task bisnis dalam dua mode pengelompokan (Divisi Tim & 6 Microservices) dengan status 100% ONGOING dan metadata handover kepemilikan antar-rekan tim.'
      },
      {
        id: 'c-11500-4',
        type: 'security',
        scope: 'Dedicated Black-Box Pentest Suite & Zero-CSS Studio Master',
        description: 'Menyematkan test suite pentest/security_test.go untuk validasi CORS, security headers, dan bounds checking, serta menerapkan arsitektur visual studio-master.css tanpa duplikasi styling.'
      }
    ]
  }
];
