import type { SystemJourney } from '../types/docs';

export const systemJourneys: SystemJourney[] = [
  {
    id: 'JRN-01',
    title: 'Siklus Provisioning Kontainer Tenant & Rolling Cutover Zero-Downtime',
    category: 'deployment',
    badge: 'Container Provisioning',
    latencySla: '< 4.5 Detik',
    summary: 'Alur kerja lengkap dari saat pengguna menekan tombol "Terbitkan ke Kontainer (Live)" di Dashboard Studio, orkestrator mengkompilasi artefak konten, Moby Docker Engine membuat kontainer Alpine Nginx baru dengan isolasi cgroups v2, pengujian kesehatan internal, hingga pengalihan rute Traefik tanpa jeda layanan.',
    actors: [
      'Tenant User (HeroCMS Studio)',
      'Dashboard Backend API',
      'Go Orchestrator (Moby Docker SDK)',
      'Docker Engine Worker Node',
      'Traefik v3 Edge Ingress'
    ],
    steps: [
      {
        stepNum: 1,
        actor: 'Tenant User',
        action: 'Klik Tombol "Terbitkan ke Kontainer (Live)"',
        technicalDetail: 'Studio memvalidasi integritas konfigurasi tema dan konten di Pinia state sebelum mengirim payload.',
        outcome: 'HTTP POST /api/v1/deploy dikirim ke Go Orchestrator dengan TenantID, SiteID, dan hash versi baru.'
      },
      {
        stepNum: 2,
        actor: 'Go Orchestrator',
        action: 'Kompilasi Artefak Konten & Snapshot JSON',
        technicalDetail: 'Orkestrator mengambil snapshot konten dari PostgreSQL dan merendernya ke direktori volume /var/cloudcms/tenants/<id>/dist.',
        outcome: 'File dist statis (HTML, JS, CSS) siap dipasang (mount) ke kontainer baru.'
      },
      {
        stepNum: 3,
        actor: 'Docker Engine',
        action: 'Pembuatan Kontainer Green Baru dengan Profil Sandboxing',
        technicalDetail: 'Memanggil Docker Engine API untuk spawn kontainer baru: User: 10001:10001, ReadonlyRootfs: true, Memory: 256MB, NanoCPUs: 500000000, Tmpfs: /tmp.',
        outcome: 'Kontainer Green berjalan dengan nama tenant_<id>_<version_hash>.'
      },
      {
        stepNum: 4,
        actor: 'Traefik v3',
        action: 'Penyuntikan Dynamic Labels & Health Check Probe',
        technicalDetail: 'Label traefik.enable=true dan host router disematkan. Orkestrator memverifikasi GET http://<ip_kontainer>:80/healthz mengembalikan 200 OK.',
        outcome: 'Kontainer dinyatakan sehat dan siap menerima lalu lintas publik.'
      },
      {
        stepNum: 5,
        actor: 'Traefik v3 & Docker',
        action: 'Rolling Cutover Zero-Downtime & Graceful Drain',
        technicalDetail: 'Traefik mengarahkan seluruh permintaan baru ke Kontainer Green. Kontainer Blue lama diberi jeda 15 detik untuk menyelesaikan koneksi sebelum dihentikan (docker stop).',
        outcome: 'Website publik tenant aktif diperbarui secara live tanpa 1 milidetik pun waktu henti (0 downtime).'
      }
    ],
    failureModes: [
      {
        issue: 'Kontainer Green gagal melewati health check /healthz dalam 3 detik.',
        detection: 'Orkestrator mendeteksi timeout HTTP connection refused atau status non-200.',
        autoRecovery: 'Batalkan cutover Traefik, pertahankan kontainer Blue tetap melayani publik, catat error ke deployment log, dan beri notifikasi ke Studio.'
      },
      {
        issue: 'Node server kehabisan memori RAM (OOM) saat spawning.',
        detection: 'Docker Engine merespon dengan error ResourceExhausted.',
        autoRecovery: 'Pindahkan permintaan deployment secara otomatis ke worker node cadangan via cluster scheduler.'
      }
    ],
    verificationCli: 'curl -i -X POST http://localhost:8083/api/v1/deploy -H "Content-Type: application/json" -d \'{"tenant_id":"c56a4180-65aa-42ec","site_id":"site_01","version_hash":"v98a7f"}\''
  },
  {
    id: 'JRN-02',
    title: 'Resolusi Edge Ingress Traefik v3 & Otomatisasi Sertifikat SSL TLS 1.3',
    category: 'routing',
    badge: 'Edge Ingress & ACME',
    latencySla: '< 80ms TTFB Cache',
    summary: 'Alur perjalanan permintaan pengunjung publik dari peramban internet melewati resolver DNS Cloudflare, ditangkap oleh Traefik v3 Edge Ingress, validasi sertifikat SSL otomatis Let\'s Encrypt (HTTP-01 Challenge) untuk custom domain baru, hingga diteruskan ke kontainer tenant di jaringan internal.',
    actors: [
      'Pengunjung Web',
      'Authoritative DNS',
      'Traefik v3 Edge Router',
      'Let\'s Encrypt CA (ACME)',
      'Kontainer Nginx Tenant'
    ],
    steps: [
      {
        stepNum: 1,
        actor: 'Pengunjung Web',
        action: 'Membuka Alamat https://portofolio.desainer.id di Browser',
        technicalDetail: 'Browser mengirimkan kueri DNS untuk menerjemahkan nama domain ke IP publik Traefik server.',
        outcome: 'IP Publik server diperoleh, browser memulai handshake TLS v1.3 ke port 443.'
      },
      {
        stepNum: 2,
        actor: 'Traefik v3',
        action: 'Inspeksi SNI (Server Name Indication) & Cek Cache Sertifikat',
        technicalDetail: 'Traefik membaca SNI portofolio.desainer.id dan memeriksa apakah sertifikat valid sudah ada di file acme.json.',
        outcome: 'Jika sudah ada: selesaikan enkripsi HTTPS seketika. Jika belum ada: picu penerbitan ACME.'
      },
      {
        stepNum: 3,
        actor: 'Let\'s Encrypt CA',
        action: 'Eksekusi HTTP-01 Challenge',
        technicalDetail: 'Let\'s Encrypt mengirimkan token verifikasi ke http://portofolio.desainer.id/.well-known/acme-challenge/<token>. Traefik merespon secara internal.',
        outcome: 'Kepemilikan domain terverifikasi resmi oleh otoritas sertifikat.'
      },
      {
        stepNum: 4,
        actor: 'Traefik v3',
        action: 'Penerbitan & Penyimpanan Kunci Sertifikat TLS 1.3',
        technicalDetail: 'Let\'s Encrypt menerbitkan sertifikat SSL X.509 berumur 90 hari, Traefik menyimpannya dan mengaktifkan auto-renewal 30 hari sebelum kedaluwarsa.',
        outcome: 'Koneksi TLS terenkripsi sempurna dengan cipher suite modern (ECDHE-ECDSA-AES128-GCM-SHA256).'
      },
      {
        stepNum: 5,
        actor: 'Kontainer Nginx Tenant',
        action: 'Penyajian Konten HTML Melalui Jaringan Internal',
        technicalDetail: 'Traefik meneruskan permintaan HTTP ke IP kontainer tenant pada cloudcms_edge_network di port 80.',
        outcome: 'Halaman website tampil memukau di browser pengunjung dengan ikon gembok aman (HTTPS A+ rating).'
      }
    ],
    failureModes: [
      {
        issue: 'Pelanggan salah mengarahkan DNS CNAME / A-Record sehingga HTTP-01 challenge gagal.',
        detection: 'Let\'s Encrypt merespon dengan error Connection Refused / No Route to Host.',
        autoRecovery: 'Traefik mengembalikan fallback halaman panduan perbaikan DNS ("Periksa CNAME record Anda") dan retry challenge setiap 15 menit.'
      }
    ],
    verificationCli: 'openssl s_client -connect localhost:443 -servername demo.stackbyte.id -tls1_3'
  },
  {
    id: 'JRN-03',
    title: 'Isolasi Multi-Tenant PostgreSQL via Row-Level Security (RLS)',
    category: 'database',
    badge: 'PostgreSQL RLS',
    latencySla: '< 15ms Query Latency',
    summary: 'Alur penegakan batas isolasi data antar penyewa secara matematis di level kernel database PostgreSQL. Setiap permintaan API menginisialisasi parameter session app.current_tenant_id sehingga tidak ada celah query developer yang dapat membocorkan data milik tenant lain.',
    actors: [
      'Klien Web (Vue 3 / PWA)',
      'Backend Go / Laravel API',
      'PostgreSQL 16 Engine',
      'Row-Level Security Policy Enforcer'
    ],
    steps: [
      {
        stepNum: 1,
        actor: 'Klien Web',
        action: 'Mengirim Permintaan GET /api/v1/posts dengan JWT Bearer Token',
        technicalDetail: 'Request menyertakan Authorization: Bearer <JWT> yang telah ditandatangani secara kriptografis oleh server.',
        outcome: 'Request diterima oleh middleware autentikasi backend.'
      },
      {
        stepNum: 2,
        actor: 'Backend API',
        action: 'Verifikasi Token & Ekstraksi Tenant UUID',
        technicalDetail: 'Backend memverifikasi keabsahan signature JWT dan mengekstrak UUID tenant terdaftar (misal: c56a4180-65aa-42ec).',
        outcome: 'Identitas tenant aktif terkonfirmasi valid.'
      },
      {
        stepNum: 3,
        actor: 'PostgreSQL 16',
        action: 'Membuka Koneksi Transaksi & Eksekusi SET LOCAL',
        technicalDetail: 'Backend menjalankan query perintah sesi pada koneksi database yang sedang aktif: SET LOCAL app.current_tenant_id = \'c56a4180-65aa-42ec\';.',
        outcome: 'Variabel session tenant terpasang khusus untuk siklus transaksi saat ini.'
      },
      {
        stepNum: 4,
        actor: 'RLS Policy Enforcer',
        action: 'Penyaringan Baris Data Otomatis di Mesin Database',
        technicalDetail: 'Backend menjalankan query SELECT * FROM content_items. Mesin RLS PostgreSQL menyuntikkan filter internal: WHERE site_id IN (SELECT id FROM sites WHERE tenant_id = app.current_tenant_id).',
        outcome: 'Sekalipun programmer lupa menulis klausa WHERE, database menolak menyajikan baris milik tenant lain.'
      },
      {
        stepNum: 5,
        actor: 'Backend API',
        action: 'Pengembalian Payload Terisolasi ke Klien',
        technicalDetail: 'Data dikonversi menjadi JSON dan dikembalikan dengan kode 200 OK.',
        outcome: 'Tenant hanya melihat data miliknya sendiri secara 100% aman (Zero Cross-Tenant Bleed).'
      }
    ],
    failureModes: [
      {
        issue: 'Koneksi database pooling tidak mereset variabel session sehingga ada sisa tenant sebelumnya.',
        detection: 'Penggunaan SET SESSION alih-alih SET LOCAL.',
        autoRecovery: 'Wajib gunakan SET LOCAL di dalam blok BEGIN ... COMMIT transaksi agar otomatis bersih begitu query selesai.'
      }
    ],
    verificationCli: 'psql -U cloudcms_app -d cloudcms -c "SET LOCAL app.current_tenant_id = \'c56a4180-65aa-42ec\'; SELECT COUNT(*) FROM sites;"'
  },
  {
    id: 'JRN-04',
    title: 'Telemetri Pengunjung Real-Time & Redis Sorted Sets (Top-Views)',
    category: 'telemetry',
    badge: 'Redis In-Memory Streams',
    latencySla: '< 1ms Latensi Top-Views',
    summary: 'Alur penangkapan event kunjungan dari seluruh website publik tenant secara asynchronous dan non-blocking melalui event bus, agregasi skor kunjungan real-time pada Redis 7 Sorted Sets (ZSET), hingga penyajian daftar artikel paling populer di Dashboard Studio dalam waktu kurang dari 1 milidetik.',
    actors: [
      'Pengunjung Website Tenant',
      'Kontainer Nginx Tenant',
      'Event Stream Consumer',
      'Redis 7 Cache Cluster',
      'Dashboard CMS Studio'
    ],
    steps: [
      {
        stepNum: 1,
        actor: 'Pengunjung Website',
        action: 'Membaca Artikel Blog Tertentu di Website Tenant',
        technicalDetail: 'JavaScript ringan (beacon) di halaman pengunjung mengirimkan sinyal navigasi non-blocking ke endpoint /api/v1/telemetry/hit.',
        outcome: 'Event hit berisi tenant_id, site_id, post_slug, dan timestamp tercatat.'
      },
      {
        stepNum: 2,
        actor: 'Kontainer Nginx',
        action: 'Meneruskan Event Kunjungan ke Antrean Redis Streams',
        technicalDetail: 'Permintaan langsung direspon 204 No Content ke browser dalam 2ms, sementara payload dimasukkan ke stream:hits.',
        outcome: 'Browser pengunjung tidak mengalami perlambatan loading sama sekali.'
      },
      {
        stepNum: 3,
        actor: 'Stream Consumer',
        action: 'Konsumsi Batch & Eksekusi Perintah ZINCRBY Atomik',
        technicalDetail: 'Worker Go membaca aliran data dan mengeksekusi: ZINCRBY site:<site_id>:views:zset 1 "panduan-microservices".',
        outcome: 'Skor kunjungan artikel bertambah secara atomik di struktur memori Skip-List Redis.'
      },
      {
        stepNum: 4,
        actor: 'Dashboard CMS Studio',
        action: 'Mengambil Data Top 5 Artikel Paling Banyak Dibaca',
        technicalDetail: 'Studio memanggil GET /api/v1/telemetry/top-views. Backend mengeksekusi ZREVRANGEBYSCORE site:<site_id>:views:zset +inf -inf WITHSCORES LIMIT 0 5.',
        outcome: 'Daftar 5 artikel terpopuler beserta total view diambil dari RAM Redis dalam waktu sub-milidetik (< 1ms).'
      },
      {
        stepNum: 5,
        actor: 'Dashboard CMS Studio',
        action: 'Render Widget Analitik Interaktif',
        technicalDetail: 'Komponen TelemetryGrid dan kartu wawasan langsung menampilkan grafik tren kunjungan terkini.',
        outcome: 'Pengguna mendapatkan wawasan trafik seketika tanpa membebani database relational PostgreSQL.'
      }
    ],
    failureModes: [
      {
        issue: 'Lonjakan trafik masif (viral surge) mencapai 50.000 hit/detik.',
        detection: 'Antrean buffer stream:hits menumpuk.',
        autoRecovery: 'Worker Go secara otomatis meningkatkan konkurensi goroutine konsumsi batch dan melakukan flush agregat setiap 500ms.'
      }
    ],
    verificationCli: 'redis-cli ZREVRANGE site:demo_site:views:zset 0 4 WITHSCORES'
  },
  {
    id: 'JRN-05',
    title: 'Generasi Desain & Tema Dinamis oleh AI Agent Copilot',
    category: 'ai',
    badge: 'AI Design Synthesis',
    latencySla: '< 800ms Token Pertama',
    summary: 'Alur kerja kecerdasan buatan dari saat desainer/pengguna memasukkan prompt instruksi bahasa alami di HeroCMS Studio, microservice AI memproses instruksi menggunakan model LLM dengan validasi skema JSON ketat, hingga token CSS disuntikkan secara dinamis ke canvas pratinjau tanpa me-reload aplikasi.',
    actors: [
      'Tenant User (HeroCMS Studio)',
      'AI Agent Service (Golang Worker)',
      'LLM Reasoning Engine (OpenAI / Claude)',
      'JSON Schema Validator',
      'Studio DOM Canvas'
    ],
    steps: [
      {
        stepNum: 1,
        actor: 'Tenant User',
        action: 'Mengetikkan Prompt Desain di Menu AI Theme Copilot',
        technicalDetail: 'Contoh input: "Tema modern minimalis untuk konsultan hukum dengan aksen navy elegan dan font serif mewah".',
        outcome: 'Studio mengirimkan request POST /api/v1/ai/generate-theme.'
      },
      {
        stepNum: 2,
        actor: 'AI Agent Service',
        action: 'Penyusunan System Prompt & Guardrails Keamanan',
        technicalDetail: 'Go Worker menyisipkan konteks batasan: format wajib JSON token desain valid, larangan menyisipkan tag <script> atau URL eksternal tidak dikenal.',
        outcome: 'Payload prompt terstruktur dikirimkan ke endpoint LLM via streaming HTTP.'
      },
      {
        stepNum: 3,
        actor: 'LLM Reasoning Engine',
        action: 'Generasi Desain Token Semantik',
        technicalDetail: 'Model memetakan konsep estetika ke nilai warna heksadesimal (#0f172a, #1e3a8a), tipografi (Playfair Display + Inter), dan border radius (8px).',
        outcome: 'Aliran token JSON dihasilkan dan dikirim kembali ke Go Worker.'
      },
      {
        stepNum: 4,
        actor: 'JSON Schema Validator',
        action: 'Validasi Skema & Sanitasi Token',
        technicalDetail: 'Worker memvalidasi bahwa seluruh field wajib (bg_color, accent, font_heading, font_body) ada dan berformat warna valid.',
        outcome: 'Objek token desain dinyatakan aman dan sesuai standar HeroCMS Studio.'
      },
      {
        stepNum: 5,
        actor: 'Studio DOM Canvas',
        action: 'Injeksi Variabel CSS Dinamis ke Pratinjau',
        technicalDetail: 'Pinia store memperbarui style variables pada iframe simulator 3-perangkat secara instan.',
        outcome: 'Tampilan website seketika berubah gaya di depan mata pengguna tanpa reload halaman.'
      }
    ],
    failureModes: [
      {
        issue: 'Model LLM menghasilkan JSON yang rusak (malformed syntax) atau terpotong.',
        detection: 'json.Unmarshal di Go menghasilkan syntax error.',
        autoRecovery: 'Worker secara otomatis memanggil algoritma json-repair lokal; jika tetap gagal, kembalikan preset tema fallback yang paling mendekati.'
      }
    ],
    verificationCli: 'curl -i -X POST http://localhost:8085/api/v1/ai/generate-theme -H "Content-Type: application/json" -d \'{"prompt":"Dark minimalist tech portfolio"}\''
  },
  {
    id: 'JRN-06',
    title: 'Dedicated S3 Bucket Auto-Provisioning & Verifikasi Aset Media',
    category: 'storage',
    badge: 'Isolated S3 Storage',
    latencySla: '< 1.5 Detik per File',
    summary: 'Alur penanganan berkas media di mana setiap tenant memiliki 1 Dedicated MinIO S3 bucket mandiri, pemeriksaan kuota total akun maksimal 2 GB, verifikasi konten sejati (Magic Bytes 512 sniffing), sanitasi anti-path traversal, dan pembuatan CDN URL publik yang siap dipasang ke artikel atau layout visual.',
    actors: [
      'Tenant User',
      'Media Asset Controller',
      'Magic Bytes Sniffer',
      'MinIO S3 Object Storage',
      'Visual Page Builder'
    ],
    steps: [
      {
        stepNum: 1,
        actor: 'Tenant User',
        action: 'Mengunggah Berkas Gambar / Dokumen ke Media Library',
        technicalDetail: 'User melakukan drag-and-drop berkas header-banner.webp ke area upload Studio.',
        outcome: 'Form multipart/form-data dikirim ke endpoint /api/v1/media/upload.'
      },
      {
        stepNum: 2,
        actor: 'Media Asset Controller',
        action: 'Verifikasi Batas Ukuran & Hard Quota Akun 2 GB',
        technicalDetail: 'Controller memeriksa: ukuran file <= 25 MB dan (total_terpakai + ukuran_baru) <= 2.147.483.648 bytes (2 GB).',
        outcome: 'Pemeriksaan kuota lolos; upload diizinkan berlanjut.'
      },
      {
        stepNum: 3,
        actor: 'Magic Bytes Sniffer',
        action: 'Pembacaan 512 Byte Awal Berkas untuk Deteksi MIME Sejati',
        technicalDetail: 'http.DetectContentType membaca header biner untuk memvalidasi bahwa berkas benar-benar image/webp dan bukan script berbahaya.',
        outcome: 'Tipe berkas terverifikasi aman dan terdaftar di whitelist resmi.'
      },
      {
        stepNum: 4,
        actor: 'MinIO S3 Storage',
        action: 'Penyimpanan Objek ke Dedicated Bucket Tenant',
        technicalDetail: 'Jika bucket tenant-<tenant_id>-media belum ada, backend menginisialisasi bucket otomatis dan mengunggah berkas dengan nama ter-sanitasi.',
        outcome: 'Objek tersimpan terisolasi secara fisik dari tenant lain di bucket miliknya sendiri.'
      },
      {
        stepNum: 5,
        actor: 'Visual Page Builder',
        action: 'Penyediaan URL CDN Publik Terenkripsi',
        technicalDetail: 'Backend mengembalikan metadata: {"url":"https://storage.stackbyte.id/tenant-c56a/header-banner.webp","size":420000}.',
        outcome: 'Gambar seketika muncul di galeri media dan siap disematkan ke editor visual sekali klik.'
      }
    ],
    failureModes: [
      {
        issue: 'Penyusupan skrip bash berbahaya yang diubah namanya menjadi photo.jpg.',
        detection: 'Magic Bytes sniffer mendeteksi tipe konten text/x-shellscript atau text/plain.',
        autoRecovery: 'Tolak berkas seketika dengan status HTTP 400 Bad Request ("Format berkas tidak sesuai konten"), catat ke security warning log.'
      }
    ],
    verificationCli: 'curl -i -X POST http://localhost:8082/api/v1/media/upload -F "file=@test-image.webp"'
  },
  {
    id: 'JRN-07',
    title: 'Offline Content Drafting & Background Sync pada Studio PWA',
    category: 'pwa',
    badge: 'PWA Offline Sync',
    latencySla: '< 200ms Instant Startup',
    summary: 'Alur ketahanan operasional Progressive Web App (PWA) di mana penulis dapat terus mengetik draf artikel atau menyusun tema situs meskipun koneksi internet terputus total. Seluruh data disimpan di IndexedDB lokal browser dan secara otomatis disinkronkan ke server begitu perangkat kembali online via Background Sync API.',
    actors: [
      'Penulis Konten',
      'Service Worker (Workbox 7)',
      'IndexedDB Local Database',
      'Background Sync Manager',
      'PostgreSQL Server'
    ],
    steps: [
      {
        stepNum: 1,
        actor: 'Penulis Konten',
        action: 'Menulis Artikel saat Koneksi Internet Terputus (Mode Offline)',
        technicalDetail: 'Penulis terus mengetik paragraf baru dan mengedit tata letak di Tiptap editor.',
        outcome: 'Indikator status header beralih menampilkan banner kuning: "Mode Offline - Draf Tersimpan Lokal".'
      },
      {
        stepNum: 2,
        actor: 'Service Worker',
        action: 'Penyimpanan Perubahan ke IndexedDB Browser',
        technicalDetail: 'useContentStore mencegat kegagalan network fetch dan mengalihkan penyimpanan ke object store articles_offline_queue di IndexedDB.',
        outcome: 'Draf artikel tersimpan aman di penyimpanan lokal perangkat tanpa risiko kehilangan data.'
      },
      {
        stepNum: 3,
        actor: 'Service Worker',
        action: 'Pendaftaran Task ke Background Sync API',
        technicalDetail: 'Workbox mendaftarkan antrean sinkronisasi dengan tag: sync-article-drafts pada navigator.serviceWorker.ready.',
        outcome: 'Peramban memonitor status konektivitas jaringan secara otomatis di latar belakang.'
      },
      {
        stepNum: 4,
        actor: 'Background Sync Manager',
        action: 'Deteksi Pemulihan Koneksi Internet (Online Trigger)',
        technicalDetail: 'Begitu koneksi WiFi/seluler aktif kembali, browser memicu event sync pada Service Worker.',
        outcome: 'Antrean transaksi draf offline diambil dan dikirimkan secara berurutan ke backend via HTTP PATCH.'
      },
      {
        stepNum: 5,
        actor: 'PostgreSQL Server',
        action: 'Penggabungan Data & Konfirmasi Sinkronisasi',
        technicalDetail: 'Server menyimpan revisi terbaru dan mengembalikan status 200 OK.',
        outcome: 'Banner Studio berubah menjadi hijau: "Sinkronisasi Berhasil - Seluruh Perubahan Tersimpan".'
      }
    ],
    failureModes: [
      {
        issue: 'Konflik versi: artikel diedit dari dua perangkat berbeda saat salah satunya offline.',
        detection: 'Hash versi atau timestamp artikel di server lebih baru dari draf offline.',
        autoRecovery: 'Tampilkan dialog pembanding revisi (Diff Inspector) agar penulis dapat memilih menggabungkan atau mempertahankan versi tertentu.'
      }
    ],
    verificationCli: 'navigator.serviceWorker.getRegistration().then(r => r.sync.register("sync-article-drafts"))'
  },
  {
    id: 'JRN-08',
    title: 'Siklus Penagihan Resmi SaaS, Rekonsiliasi Fiskal PPN 11%, dan Penerbitan E-Faktur DJP Otomatis',
    category: 'billing',
    badge: 'E-Faktur & Fiscal Billing',
    latencySla: '< 1.2 Detik Penerbitan E-Faktur',
    summary: 'Alur end-to-end penagihan langganan cloud SaaS, kalkulasi Dasar Pengenaan Pajak (DPP) vs PPN 11% kas negara, rekonsiliasi kliring pembayaran multi-kanal, penerbitan dokumen E-Faktur resmi standar PER-03/PJ/2022, hingga pemetaan kurva tren alokasi fiskal interaktif.',
    actors: [
      'Tenant Finance Lead',
      'HeroCMS Billing Store (Pinia)',
      'SNAP Banking Gateway',
      'HeroCMS BFF & Ledger Service',
      'Apache ECharts Fiscal Engine'
    ],
    steps: [
      {
        stepNum: 1,
        actor: 'Tenant Finance Lead',
        action: 'Pemilihan Paket atau Checkout Cluster Kustom',
        technicalDetail: 'Tenant memilih paket langganan (Starter/Pro/Enterprise) atau menentukan kapasitas CPU & RAM pada Kalkulator Simulasi Cluster. Pinia store useDashboardData mengkalkulasi DPP pokok, PPN 11%, dan total biaya serta mengarahkan ke kanal pembayaran.',
        outcome: 'Invoice penagihan berstatus unconfirmed terbentuk dengan rincian kuota kontainer dan spesifikasi Traefik ingress.'
      },
      {
        stepNum: 2,
        actor: 'SNAP Banking Gateway',
        action: 'Kliring Transaksi Multi-Kanal (BCA, QRIS, Visa, Mandiri)',
        technicalDetail: 'Tenant menyelesaikan transfer pembayaran melalui Virtual Account, QRIS Dinamis, Kartu Korporat, atau Bill Payment. Banking gateway mengirimkan notifikasi settlement webhook ke backend yang diverifikasi dengan signature SHA512.',
        outcome: 'Status tagihan berubah seketika menjadi LUNAS (Settled) dan kuota resource cluster tenant diaktifkan otomatis.'
      },
      {
        stepNum: 3,
        actor: 'HeroCMS BFF & Ledger Service',
        action: 'Penerbitan Nomor Seri Faktur Pajak (NSFP) & Kode NTPN',
        technicalDetail: 'Sistem penagihan secara otomatis mengalokasikan nomor seri faktur pajak DJP dan mencatatkan nomor bukti potong negara. ID Faktur INV-2026-XXXX diasosiasikan dengan NSFP 010.026-XX dan kode unik NTPN untuk keperluan audit pembukuan fiskal.',
        outcome: 'Data transaksi tersimpan pada buku besar dengan status siap kredit pajak masukan.'
      },
      {
        stepNum: 4,
        actor: 'HeroCMS Billing Store (Pinia)',
        action: 'Pencatatan Buku Besar Lapang (1260px)',
        technicalDetail: 'Transaksi baru otomatis tampil pada tabel buku besar .invoices-ledger-table yang lega tanpa dempet. Tabel berdimensi min-width 1260px mengalokasikan lebar terdedikasi pada 7 kolom dengan padding sel 18px 20px.',
        outcome: 'Pengguna dapat mencari, menyaring berdasarkan kanal bayar, dan menyalin nomor faktur dengan satu klik.'
      },
      {
        stepNum: 5,
        actor: 'HeroCMS Billing Store (Pinia)',
        action: 'Rendering Lembar Dokumen E-Faktur 1200px Widescreen',
        technicalDetail: 'Tenant mengklik "Lihat E-Faktur" untuk membuka lembar dokumen faktur pajak elektronik standar Kemenkeu RI. Modal 1200px merender KOP DJP PER-03/PJ/2022, perbandingan 2 entitas PKP Penjual vs Pembeli BKP, rincian BKP/JKP bernomor, nominal terbilang otomatis, dan QR Code approval DJP.',
        outcome: 'Dokumen sah dapat langsung dicetak ke PDF atau diunduh sebagai arsip pembukuan keuangan.'
      },
      {
        stepNum: 6,
        actor: 'Apache ECharts Fiscal Engine',
        action: 'Pemutakhiran Kurva Spline ECharts Alokasi Fiskal',
        technicalDetail: 'Tab Rekapitulasi Pajak PPN 11% secara reaktif memperbarui visualisasi kurva area spline alokasi fiskal bulanan. Mesin ECharts canvas merender 3 garis kurva halus (Total Tagihan Resmi, DPP Pokok, dan PPN 11%) dengan crosshair pointer dan floating glassmorphic tooltip IDR.',
        outcome: 'Tim manajemen dan finance memperoleh transparansi penuh mengenai tren pengeluaran SaaS dan setoran pajak masukan.'
      }
    ],
    failureModes: [
      {
        issue: 'NPWP pembeli belum diisi pada profil wajib pajak saat penerbitan E-Faktur.',
        detection: 'Validasi form tenantTaxProfile mendeteksi string kosong pada field NPWP.',
        autoRecovery: 'Sistem otomatis mengarahkan ke Tab 3 (Profil Wajib Pajak) dengan Live Sync KOP Preview untuk melengkapi identitas perpajakan.'
      },
      {
        issue: 'Wadah kontainer ECharts canvas belum terpasang di DOM saat perpindahan tab.',
        detection: 'taxChartContainerRef bernilai null sebelum transisi tab selesai.',
        autoRecovery: 'Gunakan watch(activeTab) yang dibungkus dengan nextTick() untuk menjamin kontainer DOM siap sebelum echarts.init() dipanggil.'
      }
    ],
    verificationCli: 'cd services/02-dashboard-cms && go test -v ./pentest/... && npm run build'
  }
,
  {
    id: 'JRN-09',
    title: 'Pemodelan Multi-Halaman Hierarkis, Kanvas Alur Figma Bebas Overlap, dan Routing Dinamis Traefik Edge',
    category: 'routing',
    badge: 'Multi-Page Sitemap & Routing',
    latencySla: '< 1.8ms (Traefik Ingress)',
    summary: 'Alur kerja lengkap saat arsitek web atau pengguna merancang struktur website multi-halaman di HeroCMS Studio: mulai dari pembuatan rute bertingkat di modal blueprint berwarna, visualisasi diagram pohon rute horizontal di kanvas Alur Figma dengan kurva bezier non-overlapping, inline path renaming, hingga penerbitan konfigurasi routing ke edge proxy Traefik v3 tanpa reload server.',
    actors: [
      'Web Architect & CMS Designer',
      'HeroCMS Visual Editor Engine (Pinia + Vue 3)',
      'Traefik v3 Edge Ingress Controller',
      'Nginx Multi-Page Static Compiler'
    ],
    steps: [
      {
        stepNum: 1,
        actor: 'Web Architect & CMS Designer',
        action: 'Inisiasi Penambahan Halaman Rute via Modal Bespoke',
        technicalDetail: 'Pengguna menekan tombol "+ Halaman Rute" di top bar atau memilih opsi di Dropdown Daftar Halaman. Modal 680px bespoke terbuka menampilkan 4 kartu blueprint berwarna (Konten, Pricing, Kontak, Bersih), quick chips 1-klik, dan parent nesting helper.',
        outcome: 'Pengguna memilih blueprint yang diinginkan dan menentukan judul halaman serta rute URL.'
      },
      {
        stepNum: 2,
        actor: 'HeroCMS Visual Editor Engine',
        action: 'Evaluasi Hierarki & Live Telemetry Routing',
        technicalDetail: 'Sistem menganalisis kedalaman path via getPathDepth(path) dan getParentPath(path). Kartu telemetri memberikan umpan balik instan: Level 1 (Rute Utama) atau Level 2 (Sub-Rute bernaung di bawah halaman induk) dengan validasi keberadaan induk.',
        outcome: 'Validasi memastikan sub-rute bertingkat (misal: /about/rizal) hanya dapat dibuat jika halaman induk (/about) telah terdaftar.'
      },
      {
        stepNum: 3,
        actor: 'HeroCMS Template Compiler',
        action: 'Injeksi Blueprint Komponen & Sinkronisasi Navigasi',
        technicalDetail: 'Template engine menyusun visual blocks awal sesuai blueprint terpilih lengkap dengan navbar terisolasi dan footer korporasi. Rute baru otomatis didaftarkan ke tautan menu navigasi navbar seluruh halaman terkait.',
        outcome: 'Halaman baru terbentuk di memori dengan ID unik page_<timestamp> dan siap ditampilkan di kanvas.'
      },
      {
        stepNum: 4,
        actor: 'Figma Flow Engine (SVG Canvas)',
        action: 'Kalkulasi Koordinat Pohon Horizontal & Auto-Layout Bebas Overlap',
        technicalDetail: 'Computed property sitemapLayout memetakan kedalaman rute ke arah horizontal (kolom X = depth * 1760px). Halaman sejajar dalam kolom yang sama ditumpuk vertikal dengan memperhitungkan tinggi frame riil (~880px) dan row spacing 160px. Induk diposisikan persis di tengah rentang anak-anaknya.',
        outcome: 'Seluruh frame artboard tersusun rapi ke arah kanan tanpa ada artboard yang saling menimpa.'
      },
      {
        stepNum: 5,
        actor: 'SVG Flow Connector Layer',
        action: 'Rendering Kurva S Bezier Dinamis & Particle Animation',
        technicalDetail: 'Lapisan SVG berukuran dinamis merender kurva bezier M startX startY C cp1x cp1y, cp2x cp2y, endX endY langsung dari sisi kanan frame induk ke sisi kiri frame anak. Garis alur dilengkapi animasi dash flowing, partikel pulsa sinyal, dan pill badge interaktif pada 75% lintasan.',
        outcome: 'Alur navigasi visual terlihat jelas, profesional, dan dapat diklik untuk melompat antar-halaman.'
      },
      {
        stepNum: 6,
        actor: 'HeroCMS Studio Visual Engine',
        action: 'Ganti Rute Langsung (Inline Route Rename)',
        technicalDetail: 'Pengguna mengklik pill rute pada frame judul untuk mengganti path secara instan. Fungsi commitEditRoute memvalidasi slug, mencegah siklus/pemindahan ke dalam sub-rute sendiri, dan meng-cascade perubahan prefix ke seluruh sub-rute serta tautan navbar.',
        outcome: 'Struktur URL selalu konsisten dan bebas tautan rusak (broken links).'
      },
      {
        stepNum: 7,
        actor: 'Traefik v3 Edge Ingress & Go BFF',
        action: 'Publikasi Multi-Halaman ke Kontainer Docker Produksi',
        technicalDetail: 'Saat tombol "Terbitkan ke Kontainer (Live)" ditekan, Go BFF mengompilasi seluruh berkas HTML halaman (/index.html, /about/index.html, /pricing/index.html) dan menyinkronkannya ke kontainer Nginx Alpine tenant via Docker Engine SDK.',
        outcome: 'Seluruh rute publik langsung dapat diakses di browser melalui URL https://<tenant-subdomain>.stackbyte.id/<path> dengan latensi sub-milidetik.'
      }
    ],
    failureModes: [
      {
        issue: 'Pengguna mencoba membuat sub-rute (/about/tim) sebelum halaman induk (/about) ada.',
        detection: 'Validasi getParentPath() mendeteksi halaman induk tidak ditemukan di array multiPages.',
        autoRecovery: 'Sistem menampilkan toast error yang informatif dan memblokir pembuatan hingga halaman induk didaftarkan.'
      },
      {
        issue: 'Pill dropdown daftar halaman terpotong oleh penggaris kanvas saat dibuka.',
        detection: 'Elemen .studio-command-bar memotong sumbu Y karena overflow-x: auto.',
        autoRecovery: 'Selector CSS :has(.custom-floating-dropdown) otomatis mengaktifkan overflow: visible dan elevasi z-index: 200 saat dropdown aktif.'
      }
    ],
    verificationCli: 'cd services/02-dashboard-cms && go test -v ./pentest/... && npm run build'
  }
];