import type { ChangelogRelease } from '../types/dashboard';

export const changelogReleases: ChangelogRelease[] = [
  {
    version: 'v1.14.2',
    releaseDate: '18 Oktober 2026',
    title: 'Senior Staff UI/UX Redesign: High-End Editorial Composition & Device Glass Centerpieces',
    summary: 'Merombak visual kartu editorial menjadi standar industri top-tier (Vercel, Stripe, Linear). Memperbesar proporsi hero visual cover menjadi 175px (aspect ratio 16:9), menambahkan ambient dot matrix grid overlay, floating glassmorphic device badges dengan glowing technical icons, telemetry chip berdenyut live (cgroups v2, Kafka Redis ZSET, Traefik TTFB), dateline metadata terstruktur, tipografi judul ekstra tegas (19px/weight 800/-0.022em), kutipan 3 baris yang bernapas, serta tombol CTA modern dengan ikon ArrowUpRight.',
    badge: 'Latest',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-1142-1',
        type: 'improvement',
        scope: 'Editorial Cover Architectural Composition (Height 175px & Mesh Matrix)',
        description: 'Meningkatkan proporsi vertikal cover menjadi 175px dengan dot-matrix grid overlay halus dan ambient radial lighting berkarakter kuat.'
      },
      {
        id: 'c-1142-2',
        type: 'improvement',
        scope: 'Glassmorphic Device Badges & Dynamic Telemetry Chips',
        description: 'Menghadirkan centerpiece frosted glass badge 50x50px di tengah cover yang memuat glif teknis bersinar dan micro-pill telemetri dengan pulsing status dot.'
      },
      {
        id: 'c-1142-3',
        type: 'improvement',
        scope: 'Card Typography Hierarchy & Modern Action CTA',
        description: 'Menyempurnakan tipografi dateline, judul berbobot 800, excerpt lapang 3 baris, target container bar terisolasi, profil avatar elegan, dan tombol CTA Baca Artikel dengan ArrowUpRight.'
      }
    ]
  },
  {
    version: 'v1.14.1',
    releaseDate: '18 Oktober 2026',
    title: 'Peningkatan Estetika Visual Editorial 3-Kolom & Palet Teknis Non-Slop',
    summary: 'Menerapkan tata letak seimbang 3 data per baris (3-Column Grid) pada modul Artikel & Halaman Statis untuk memanfaatkan lebar layar secara proporsional. Menambahkan cover header visual berkelas dengan palet tematik teknis terkurasi per kategori (Engineering Deep Slate-Navy, Distributed Systems Indigo-Slate, DevOps Forest-Slate, Security Obsidian, Tutorial Warm Cedar) lengkap dengan watermark glif arsitektur transparan, pill kategori berkontras tajam, dan tombol aksi "Baca" & "Edit" yang ergonomis tanpa efek gradien murah atau AI-slop.',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-1141-1',
        type: 'improvement',
        scope: '3-Column Balanced Grid Layout (.editorial-card-grid & .cms-pages-grid)',
        description: 'Menerapkan grid 3 kolom proporsional pada resolusi desktop sehingga kartu membagi ruang baris secara seimbang tanpa menyisakan ruang kosong lebar.'
      },
      {
        id: 'c-1141-2',
        type: 'improvement',
        scope: 'Architectural Editorial Visual Covers (Non-AI-Slop Palettes)',
        description: 'Menghadirkan top cover header berbobot visual dengan palet warna teknis yang solid dan berkarakter, watermark icon arsitektur halus, serta pratinjau slug URL yang jelas.'
      },
      {
        id: 'c-1141-3',
        type: 'improvement',
        scope: 'Static CMS Pages Blueprint Cover',
        description: 'Menambahkan top cover arsitektural dark-navy dengan rute URL terhighlight, badge layout template terkurasi, dan tombol aksi Edit instan.'
      }
    ]
  },
  {
    version: 'v1.14.0',
    releaseDate: '18 Oktober 2026',
    title: 'Enterprise Dual-Content Engine & Content Studio Editor (Artikel & Halaman Statis)',
    summary: 'Merombak total modul "Artikel & Halaman CMS" menjadi Enterprise Dual-Content Engine yang sesungguhnya. Menghadirkan navigasi tab ganda untuk mengelola Artikel Editorial berkala (Blog Posts) dan Halaman Statis Website (CMS Pages seperti Beranda, Tentang Kami, Layanan, Kontak, Kebijakan Privasi). Mengeliminasi kartu spotlight gradien norak dan menggantinya dengan kartu editorial Ghost/Medium-style yang bersih, menyertakan kartu halaman statis dengan indikator rute URL, layout template, integrasi navigasi navbar/footer, serta menyediakan Content Editor Modal terpadu (Markdown editor, slug generator, dan SEO meta tags) dan mode membaca bebas distraksi (Distraction-Free Reader View).',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-1140-1',
        type: 'feature',
        scope: 'Dual-Content Architecture (Articles & Static CMS Pages)',
        description: 'Menambahkan tab navigasi terpadu untuk memisahkan manajemen Artikel Editorial berkala dengan Halaman Statis website (Pages), lengkap dengan persistensi state dan telemetri adaptif.'
      },
      {
        id: 'c-1140-2',
        type: 'improvement',
        scope: 'Ghost & Medium Editorial Card Aesthetics',
        description: 'Menghapus banner spotlight neon raksasa dan menyajikan desain kartu editorial modern dengan kutipan nyata (excerpt), waktu baca, avatar penulis, metrik views Redis ZSET, dan visual minimalis enterprise.'
      },
      {
        id: 'c-1140-3',
        type: 'feature',
        scope: 'Universal Content Studio Modal Editor',
        description: 'Menyediakan modal editor lengkap untuk membuat dan mengedit Artikel maupun Halaman Statis dengan auto-slug generator, integrasi layout template, toggle navbar/footer, SEO meta description, dan editor Markdown.'
      },
      {
        id: 'c-1140-4',
        type: 'improvement',
        scope: 'Distraction-Free Editorial Reader View',
        description: 'Memperbarui tampilan pembaca artikel dengan tipografi elegan, tombol sunting cepat langsung dari reader, salin tautan live CDN, dan tombol navigasi kembali yang intuitif.'
      }
    ]
  },
  {
    version: 'v1.13.4',
    releaseDate: '18 Oktober 2026',
    title: 'Transformasi Enterprise DAM Inspector Telemetry & Kanvas Bersih',
    summary: 'Menghilangkan widget Dominansi Warna & Kontras agar antarmuka fokus dan profesional, menyederhanakan kanvas switcher ke mode mandiri (Latar Terang, Latar Gelap, Papan Catur), serta merombak panel detail inspector menjadi Enterprise Digital Asset Management (DAM) Hub yang kaya informasi: ekstraksi MIME-type presisi, ukuran byte tepat S3, resolusi & kalkulasi aspek rasio dinamis, integrasi referensi penggunaan konten CMS, checksum integritas SHA-256/ETag, parameter kompresi & cache HTTP, serta tombol sematan cepat (Markdown, HTML, CSS, Direct URL).',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-1134-1',
        type: 'improvement',
        scope: 'DAM Inspector Rail (Enterprise Telemetry & Metadata)',
        description: 'Menyajikan panel spesifikasi teknis lengkap mencakup MIME-Type spesifik, byte presisi, aspek rasio resolusi dinamis, pelacakan referensi artikel/halaman CMS yang menggunakan berkas, dan verifikasi checksum SHA-256.'
      },
      {
        id: 'c-1134-2',
        type: 'improvement',
        scope: 'Media Stage Canvas & Quick Embeds',
        description: 'Menghapus komputasi dominansi warna dan menyederhanakan switcher kanvas menjadi 3 mode praktis tanpa auto-flash, serta menambahkan opsi sematan 1-klik untuk Markdown, tag <img> HTML, dan CSS background-image.'
      }
    ]
  },
  {
    version: 'v1.13.3',
    releaseDate: '18 Oktober 2026',
    title: 'Eliminasi Total Delay Transisi Kategori & Navigasi Folder Instan 0ms',
    summary: 'Menghilangkan latensi dan jeda waktu klik saat berpindah kategori folder DAM (Semua Berkas, Foto & Raster, Vektor SVG, Dokumen PDF, Excel, dsb). Menghapus pembungkus Transition mode="out-in" yang sebelumnya memblokir render konten baru secara serial, menonaktifkan scale bounce delay pada tombol folder aktif, serta menerapkan micro-fade instan 120ms pada kartu media untuk interaksi secepat kilat (0ms input latency).',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-1133-1',
        type: 'performance',
        scope: 'DAM Category Navigation (Zero-Latency Rendering)',
        description: 'Menghilangkan serial leave-then-enter transition delay (mode="out-in") pada grid dan list view sehingga konten baru dirender seketika (0ms) saat kategori folder diklik.'
      },
      {
        id: 'c-1133-2',
        type: 'bugfix',
        scope: 'Folder Button & Card Settle Animation (.dam-folder-item & cardInstantFade)',
        description: 'Menghapus keyframe folderActivePop yang menunda visual feedback pada tab aktif dan menggantinya dengan micro-fade ultra-cepat 120ms tanpa jeda.'
      }
    ]
  },
  {
    version: 'v1.13.2',
    releaseDate: '18 Oktober 2026',
    title: 'Perbaikan Transisi Kategori Galeri & Eliminasi Flash Hitam Modal Inspector',
    summary: 'Memperbaiki masalah animasi duplikasi kartu galeri dan latensi saat pemilihan kategori folder dengan mengganti TransitionGroup keyed dinamis menjadi transisi view terpadu (dam-category-switch, mode="out-in") dengan key stabil. Memperbaiki masalah flash latar belakang hitam sebelum putih pada modal pratinjau SVG dengan menerapkan caching luminansi instan (assetLuminanceCache), fallback awal otomatis light canvas untuk SVG, dan penghapusan delay transisi CSS pada initial mount.',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-1132-1',
        type: 'bugfix',
        scope: 'DAM Modal Inspector (assetLuminanceCache & Instant SVG Theme)',
        description: 'Menghilangkan visual flash background hitam-ke-putih saat modal dibuka dengan menginisialisasi SVG langsung pada theme-light-canvas secara instan dan menyimpan hasil komputasi luminansi ke dalam memori cache.'
      },
      {
        id: 'c-1132-2',
        type: 'bugfix',
        scope: 'Category View Transition (Transition mode="out-in")',
        description: 'Menghapus key dinamis yang memicu duplikasi elemen kartu di dalam CSS Grid, menggantinya dengan transisi kategori yang ringan, cepat (140ms), dan responsif tanpa lag.'
      }
    ]
  },
  {
    version: 'v1.13.1',
    releaseDate: '18 Oktober 2026',
    title: 'Animasi Transisi Staggered Cascade Saat Pergantian Kategori Media',
    summary: 'Menerapkan sistem animasi transisi dinamis bergelombang (staggered cascade wave) menggunakan Vue TransitionGroup dan FLIP physics saat pengguna berpindah antar-kategori folder (Semua Berkas, Foto & Raster, Vektor SVG, Dokumen PDF, dll) maupun saat melakukan filter pencarian. Dilengkapi animasi spring pop pada tombol kategori aktif dan transisi halus pada status kosong.',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-1131-1',
        type: 'improvement',
        scope: 'DAM Media Cards Animation (.dam-card-flip & @keyframes mediaCardCascade)',
        description: 'Menghadirkan efek transisi gelombang masuk berjenjang (stagger delay 45ms) dengan kurva cubic-bezier spring halus saat kategori folder dipilih, menghilangkan pergantian konten yang kaku.'
      },
      {
        id: 'c-1131-2',
        type: 'improvement',
        scope: 'Sidebar Folder Active Pop (@keyframes folderActivePop)',
        description: 'Menambahkan efek micro-animation spring scaling pada tombol kategori folder yang sedang diklik untuk memberikan feedback sentuhan interaktif yang responsif.'
      },
      {
        id: 'c-1131-3',
        type: 'improvement',
        scope: 'List Table Row Cascade (.dam-row-flip & @keyframes mediaRowCascade)',
        description: 'Animasi sliding horizontal halus pada baris tabel saat mode list view aktif dengan stagger index optimal.'
      }
    ]
  },
  {
    version: 'v1.13.0',
    releaseDate: '18 Oktober 2026',
    title: 'Deteksi Otomatis Dominansi Warna & Latar Belakang Kanvas Adaptif Cerdas',
    summary: 'Menambahkan mesin analitik luminansi visual otomatis berbasis HTML5 Canvas sampling dan SVG color inspection. Sistem otomatis mendeteksi rasio warna gelap vs terang pada berkas dengan background transparan (seperti logo Ubuntu hitam atau grafis putih), lalu secara cerdas menyesuaikan latar belakang kanvas pratinjau studio (Auto Terang / Gelap) agar kontras terlihat sempurna. Dilengkapi meteran persentase dominansi warna, HUD status adaptif, dan kontrol toggle 4-mode (Auto, Terang, Gelap, Catur).',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-1130-1',
        type: 'feature',
        scope: 'Visual Luminance Engine (analyzeAssetLuminance)',
        description: 'Implementasi sampling piksel HTML5 Canvas 48x48 offscreen dan inspeksi fill/stroke SVG untuk menghitung persentase luminansi non-transparan secara instan (<5ms) tanpa pembatasan CORS via blob URL streaming.'
      },
      {
        id: 'c-1130-2',
        type: 'feature',
        scope: 'Adaptive Dynamic Studio Canvas (.theme-light-canvas & .theme-dark-canvas)',
        description: 'Otomatis mengaktifkan kanvas Pure Slate dot-grid (#f8fafc) jika objek transparan dominan gelap/hitam (seperti SVG Ubuntu), dan kanvas Deep Slate dot-grid (#0b1120) jika objek dominan putih/terang.'
      },
      {
        id: 'c-1130-3',
        type: 'feature',
        scope: 'Interactive Backdrop Toolbar (.canvas-theme-switcher) & HUD Dominance Pill',
        description: 'Menyediakan tombol segmented toggle (Auto Adaptif, Terang, Gelap, Papan Catur) di pojok panggung, meteran persentase visual di panel spesifikasi, dan floating HUD pill status dominansi warna.'
      }
    ]
  },
  {
    version: 'v1.12.4',
    releaseDate: '18 Oktober 2026',
    title: 'Perbaikan Clickability Checkbox Seleksi Kartu Media Galeri',
    summary: 'Memperbaiki masalah checkbox seleksi kartu media yang tidak dapat diklik akibat tertutup layer glassmorphic hover overlay. Menaikkan z-index checkbox ke level 30 dengan pointer-events aktif, serta mengubah elemen menjadi tombol semantik yang berada di atas layer hover.',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-1124-1',
        type: 'bugfix',
        scope: 'Interactive Multi-Select Checkbox (.media-card-checkbox)',
        description: 'Menaikkan z-index dari 6 ke 30 dengan pointer-events: auto, memindahkan elemen button checkbox setelah layer hover di DOM tree sehingga klik seleksi selalu terpicu tanpa terhalang dock aksi.'
      }
    ]
  },
  {
    version: 'v1.12.3',
    releaseDate: '18 Oktober 2026',
    title: 'Penyesuaian Warna Status Terpilih Kategori Folder Menjadi Deep Slate Hitam',
    summary: 'Mengubah warna status aktif/terpilih pada item navigasi Kategori & Folder sidebar DAM dari warna biru muda menjadi Deep Slate hitam pekat (#0f172a) dengan teks putih bersih, ikon monokrom kontras tinggi, dan counter badge semi-transparan yang selaras dengan tema utama HeroCMS Studio.',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-1123-1',
        type: 'improvement',
        scope: 'DAM Sidebar Navigation (.dam-folder-item.active)',
        description: 'Menerapkan background Deep Slate (#0f172a), warna teks dan icon putih (#ffffff), bayangan halus, serta counter badge bernuansa kontras tinggi saat kategori folder dipilih.'
      }
    ]
  },
  {
    version: 'v1.12.2',
    releaseDate: '18 Oktober 2026',
    title: 'Pelebaran Viewport Imersif Modal Studio Media Inspector (1240px)',
    summary: 'Menaikkan ukuran dialog modal Media Inspector Studio menjadi 1240px (95vw) dengan ketinggian kanvas 640px dan batas resolusi gambar 560px. Memberikan panggung visual sinematik yang megah untuk foto resolusi tinggi dan ilustrasi vektor SVG tanpa rasa sempit di layar desktop lebar.',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-1122-1',
        type: 'improvement',
        scope: 'Studio Modal Dimensions (.modal-dialog-media-studio & .studio-inspector-split)',
        description: 'Memperlebar dialog dari 980px ke 1240px dan mempertinggi layout split-pane dari 520px ke 640px, dengan kolom inspektur 420px dan panggung visual ~800px.'
      },
      {
        id: 'c-1122-2',
        type: 'improvement',
        scope: 'Visual Canvas Max Height (.stage-visual-img)',
        description: 'Menaikkan batas maksimal ketinggian foto/vektor dari 420px ke 560px sehingga gambar resolusi tinggi tampil detail, tajam, dan megah.'
      },
      {
        id: 'c-1122-3',
        type: 'improvement',
        scope: 'Typography & Header Comfort (.studio-modal-name-row)',
        description: 'Memperlebar batas judul berkas menjadi 650px agar nama berkas panjang tidak terpotong elipsis di header.'
      }
    ]
  },
  {
    version: 'v1.12.1',
    releaseDate: '18 Oktober 2026',
    title: 'Pelebaran Kartu Galeri Media Gaya Google Photos & Rendering Vektor SVG',
    summary: 'Memperlebar kartu galeri media pada panggung utama (minmax 340px) dan mempertinggi kanvas pratinjau menjadi 220px seperti tata letak Google Photos / Unsplash. Menghilangkan text wrapping yang canggung pada spesifikasi berkas, serta menambahkan rendering nyata untuk vektor SVG langsung di kartu galeri dengan bayangan kedalaman sinematik.',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-1121-1',
        type: 'improvement',
        scope: 'Expansive Gallery Cards (.media-gallery-grid & .media-preview-canvas)',
        description: 'Menaikkan ukuran minimum kartu dari 240px ke 340px dan ketinggian kanvas pratinjau ke 220px, memberikan visual impact yang lapang dan proporsional layaknya Google Photos.'
      },
      {
        id: 'c-1121-2',
        type: 'improvement',
        scope: 'Card Metadata Clean Row (.media-sub-meta)',
        description: 'Menata ulang baris ukuran berkas, dimensi, dan status CDN Ready ke dalam satu baris fleksibel tanpa pemotongan atau text-wrapping yang terpecah.'
      },
      {
        id: 'c-1121-3',
        type: 'feature',
        scope: 'Direct SVG Vector Thumbnails (.svg-vector-thumb)',
        description: 'Menampilkan berkas ilustrasi dan icon SVG secara nyata di kartu galeri tanpa menggunakan kotak blueprint statis.'
      }
    ]
  },
  {
    version: 'v1.12.0',
    releaseDate: '18 Oktober 2026',
    title: 'Bespoke Split-Pane Media Inspector Studio & Universal SVG Vector Renderer',
    summary: 'Refaktor menyeluruh modal rincian berkas S3 menjadi Split-Pane Studio Media Inspector berstandar Figma dan Cloudflare R2. Menghadirkan panggung pratinjau visual berdinding kanvas ambient dot-grid dengan rendering instan untuk berkas vektor SVG & gambar raster, HUD status resolusi dan kuota S3 di bagian bawah, serta rail inspektur metadata teknis terpadu lengkap dengan fitur 1-klik salin Markdown/HTML embed code untuk CMS editor.',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-1120-1',
        type: 'feature',
        scope: 'Studio Split-Pane Architecture (.modal-dialog-media-studio)',
        description: 'Merombak modal satu kolom yang bertumpuk menjadi tata letak 2-Kolom Split-Pane: Media Viewport Stage di sisi kiri dengan kanvas kontras tinggi, dan Properties Inspector Rail di sisi kanan dengan scroll independen.'
      },
      {
        id: 'c-1120-2',
        type: 'improvement',
        scope: 'Vector & Visual Asset Rendering (MediaAssetsModule.vue)',
        description: 'Memperluas deteksi aset visual (isVisualAsset) sehingga berkas vektor SVG, ilustrasi, dan icon tampil jernih dalam resolusi penuh dengan bayangan kedalaman sinematik di kanvas pratinjau.'
      },
      {
        id: 'c-1120-3',
        type: 'feature',
        scope: 'CMS Quick Embed Snippets (MediaAssetsModule.vue)',
        description: 'Menambahkan fitur salin instan kode sematan Markdown (![alt](url)) dan HTML (<img>) dengan feedback visual real-time untuk mempercepat alur penulisan artikel di CMS.'
      },
      {
        id: 'c-1120-4',
        type: 'improvement',
        scope: 'Header Dock & Direct Actions (.studio-modal-topbar)',
        description: 'Menyediakan bilah aksi cepat di header modal: tombol Buka Berkas di tab baru, Salin URL CDN langsung, pill ekstensi tipe berkas, dan indikator status CDN Edge Traefik v3.'
      }
    ]
  },
  {
    version: 'v1.11.1',
    releaseDate: '18 Oktober 2026',
    title: 'Dedicated Boxed Scrollable Stage Panel untuk Media Assets DAM',
    summary: 'Membungkus galeri kartu media dan tabel ledger berkas ke dalam container viewport independen ber-border bersih (Boxed Viewport Panel) dengan dedicated vertical scrollbar. Memastikan sidebar navigasi, storage meter, ringkasan telemetri, dan bar pencarian/filter tetap tenang dan terkunci di tempat saat pengguna menelusuri katalog aset.',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-1111-1',
        type: 'improvement',
        scope: 'DAM Stage Viewport (.dam-content-scroll-box)',
        description: 'Menambahkan container kotak berbatas halus (#e2e8f0, radius 14px, bayangan lembut) dengan scroll internal yang halus (thin custom scrollbar) dan responsive auto-fill grid untuk kartu aset.'
      },
      {
        id: 'c-1111-2',
        type: 'improvement',
        scope: 'Layout Ergonomics (MediaAssetsModule.vue)',
        description: 'Mengunci posisi bilah aksi, pencarian terpadu, dan batch toolbar di atas viewport media sehingga kontrol filter selalu terlihat tanpa harus menggulir halaman ke atas.'
      }
    ]
  },
  {
    version: 'v1.11.0',
    releaseDate: '18 Oktober 2026',
    title: 'Arsitektur Digital Asset Management (DAM) 2-Kolom & Studio S3 Storage',
    summary: 'Refaktor besar penataan tata letak Media Assets menjadi arsitektur 2-Kolom Digital Asset Management (DAM) modern berdensitas tinggi. Mengintegrasikan S3 Storage Quota Health Hub, navigasi folder/kategori cerdas, compact drag-and-drop uploader di sidebar kiri, strip telemetri mini ringkas, fitur seleksi massal (Batch Multi-Selection) dengan floating action dock, serta galeri media di area panggung utama yang langsung tampil di atas layar tanpa scroll vertikal berlebih.',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-1110-1',
        type: 'feature',
        scope: 'DAM Architecture & Layout (MediaAssetsModule.vue)',
        description: 'Merombak penataan vertikal bertumpuk menjadi 2-Kolom DAM: Sidebar Rail (310px) berisi widget kuota S3, navigasi folder kategori cerdas dengan counter dinamis, dan compact uploader, serta Main Stage yang lapang.'
      },
      {
        id: 'c-1110-2',
        type: 'feature',
        scope: 'Batch Operations & Multi-Select (MediaAssetsModule.vue)',
        description: 'Menyediakan fitur seleksi berkas ganda (checkbox per kartu dan Select All), dilengkapi Floating Batch Action Dock untuk salin semua URL CDN, unduh terpilih, dan hapus massal dari S3 bucket.'
      },
      {
        id: 'c-1110-3',
        type: 'feature',
        scope: 'UI / UX & Dual View Mode (MediaAssetsModule.vue)',
        description: 'Menyediakan tombol pengubah tampilan interaktif antara Galeri Kartu Sinematik (Grid Mode) dan Tabel Ledger Berkas Berstandar Enterprise (List Mode) lengkap dengan thumbnail mini, spesifikasi berkas, dan aksi inline instan.'
      },
      {
        id: 'c-1110-4',
        type: 'improvement',
        scope: 'Master Stylesheet & Compact Metrics (studio-master.css)',
        description: 'Menghadirkan strip telemetri mini 4-kolom kompak di atas panggung utama, Glassmorphic Floating Action Dock, mikro-animasi checkerboard background pada aset transparan, dan optimasi ruang vertikal.'
      }
    ]
  },
  {
    version: 'v1.10.0',
    releaseDate: '18 Oktober 2026',
    title: 'Peluncuran Fitur Enterprise Maintenance Mode (Mode Pemeliharaan)',
    summary: 'Menambahkan kapabilitas Mode Pemeliharaan (Maintenance Mode) terpadu di Dashboard Situs dan Pod Detail Analytics. Memungkinkan pengelola website mengalihkan trafik publik ke pesan pemeliharaan HTTP 503 bersahabat secara instan, dilengkapi badge status semantic Amber, tab filter dedicated, modal konfigurasi estimasi waktu (ETA), dan endpoint API PUT /containers/:id/maintenance.',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-1100-1',
        type: 'feature',
        scope: 'Containers & Sites Hub (ContainersModule.vue)',
        description: 'Menambahkan kontrol toggle Mode Pemeliharaan pada kartu situs dan tabel data, badge status semantic Amber dengan radar pulsing amber, filter tab Pemeliharaan, dan modal dialog konfigurasi pesan kustom serta estimasi durasi pemeliharaan.'
      },
      {
        id: 'c-1100-2',
        type: 'feature',
        scope: 'Pod Detail & Analytics (PodDetailAnalyticsView.vue)',
        description: 'Menyediakan banner peringatan pemeliharaan aktif dengan tombol aksi Go-Live cepat dan status pill telemetri pemeliharaan berstandar Cloudflare & Datadog APM.'
      },
      {
        id: 'c-1100-3',
        type: 'feature',
        scope: 'Backend API & Repository (cmd/server, internal/handler, service, repository)',
        description: 'Menyediakan endpoint PUT /containers/:id/maintenance dengan validasi tenant ID, persistensi status ke basis data/in-memory repository, serta unit test suite komprehensif.'
      }
    ]
  },
  {
    version: 'v1.9.4',
    releaseDate: '18 Oktober 2026',
    title: 'Unit Test Suite Komprehensif & Pengerasan Ketahanan Kode di Seluruh Services',
    summary: 'Penyempurnaan total unit test di seluruh microservices HeroCMS (02-dashboard-cms, 03-provision-orchestrator, 04-marketing-site, 05-ai-agent-service). Memperbaiki potensi nil-pointer dereference, data race pada repository, menambahkan in-memory test mocks instan tanpa TCP dial latency, serta pengujian validasi input, sanitasi regex, dan security headers dengan hasil 100% lulus di seluruh package.',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-194-1',
        type: 'improvement',
        scope: 'Dashboard CMS Backend (services/02-dashboard-cms)',
        description: 'Menambahkan test suite komprehensif di cmd/server, internal/config, handler, middleware, redis, repository, service, dan storage (coverage hingga 93.5%). Memperbaiki nil pointer safety pada S3 client, Redis in-memory mock, dan data race pada invoices repo.'
      },
      {
        id: 'c-194-2',
        type: 'improvement',
        scope: 'Provision Orchestrator (services/03-provision-orchestrator)',
        description: 'Menambahkan pengujian simulasi lifecycle tenant container dan nil pointer checks pada Docker provisioner close dan deploy (coverage 65.4%).'
      },
      {
        id: 'c-194-3',
        type: 'improvement',
        scope: 'Marketing Site (services/04-marketing-site)',
        description: 'Mengekstrak SetupMarketingMux dan menambahkan unit test untuk healthz, enterprise security headers, immutable static cache, dan HTML5 SPA routing fallback (coverage 55.8%).'
      },
      {
        id: 'c-194-4',
        type: 'security',
        scope: 'AI Agent Service (services/05-ai-agent-service)',
        description: 'Memperluas unit test untuk validasi tenant_id injection regex, path validation, AI template generation, telemetry hits, dan security headers (coverage 45.5%).'
      }
    ]
  },
  {
    version: 'v1.9.3',
    releaseDate: '18 Oktober 2026',
    title: 'Penerapan Menyeluruh Standar Keamanan & Arsitektur di Seluruh 5 Services',
    summary: 'Menerapkan standarisasi 20 pilar keamanan, graceful shutdown, healthcheck endpoints, pengerasan non-root container, optimasi bundling Vite, dan pembuatan unit test suite di seluruh microservices: 01-admin-console, 02-dashboard-cms, 03-provision-orchestrator, 04-marketing-site, dan 05-ai-agent-service.',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-193-1',
        type: 'improvement',
        scope: 'Marketing Site (services/04-marketing-site)',
        description: 'Menambahkan endpoint /healthz, graceful shutdown, security headers, dan konfigurasi manualChunks di vite.config.ts.'
      },
      {
        id: 'c-193-2',
        type: 'improvement',
        scope: 'AI Agent Service (services/05-ai-agent-service)',
        description: 'Menambahkan graceful shutdown server, security headers, redis client close cleanup, serta unit test suite di cmd/worker/main_test.go.'
      },
      {
        id: 'c-193-3',
        type: 'security',
        scope: 'Admin Console (services/01-admin-console)',
        description: 'Hardening Dockerfile dengan eksekusi user non-root www-data.'
      },
      {
        id: 'c-193-4',
        type: 'feature',
        scope: 'Provision Orchestrator (services/03-provision-orchestrator)',
        description: 'Penyempurnaan siklus hidup kontainer (Stop, Start, Destroy) dan penambahan unit test pengujian 100% lolos verifikasi.'
      }
    ]
  },
  {
    version: 'v1.9.2',
    releaseDate: '18 Oktober 2026',
    title: 'Eksplorasi Ekosistem skills.sh: Integrasi Playwright E2E Testing & Web Performance Vitals Skill',
    summary: 'Memperluas kapabilitas AI Agent dengan 2 skill operasional modern standar skills.sh: browser-e2e-playwright (pengujian browser otomatis, verifikasi visual modal destruktif, selector a11y-first) dan web-performance-vitals (optimasi Core Web Vitals, code-splitting Vite manualChunks, HTTP cache headers, dan mitigasi N+1 SQL). Seluruh integrasi dikembangkan pada branch mandiri feat/agent-skills-architecture.',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-192-1',
        type: 'feature',
        scope: 'Browser Testing Skill (.agents/skills/browser-e2e-playwright)',
        description: 'Standar pengujian E2E menggunakan Playwright: selector resilient berbasis teks/role, event-driven assertions, dan pengujian responsive mobile.'
      },
      {
        id: 'c-192-2',
        type: 'feature',
        scope: 'Web Performance Skill (.agents/skills/web-performance-vitals)',
        description: 'Standar tolok ukur TTFB, LCP, CLS, dan INP, optimasi vendor chunks di vite.config.ts, dan header caching Traefik/Go server.'
      }
    ]
  },
  {
    version: 'v1.9.1',
    releaseDate: '18 Oktober 2026',
    title: 'Adopsi 20 Pilar Praktis Keamanan Web & Backend serta Modul Skill herocms-security-sandboxing',
    summary: 'Memperkuat arsitektur keamanan platform dengan mendokumentasikan 20 Pilar Praktis Keamanan Web & Backend di SECURITY_AND_SANDBOXING.md serta menambahkan skill herocms-security-sandboxing (.agents/skills/) untuk memandu AI Agent dalam pengerasan kontainer Docker, isolasi multi-tenant, proteksi OWASP Top 10, sanitasi input, dan penegakan credential safety.',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-191-1',
        type: 'security',
        scope: 'Dokumentasi Keamanan (docs/SECURITY_AND_SANDBOXING.md)',
        description: 'Menambahkan Seksi 5 berisi matriks 20 pilar checklist keamanan praktis: proteksi API key, isolasi .env, anti-SQLi, anti-XSS, server-side auth, RLS database, sesi aman, hingga magic bytes upload scanning.'
      },
      {
        id: 'c-191-2',
        type: 'feature',
        scope: 'Security Audit Skill (.agents/skills/herocms-security-sandboxing)',
        description: 'Membuat modul skill baru untuk mengaudit setiap penulisan kode backend/frontend, parameter HostConfig Docker Engine SDK, dan pencegahan kebocoran data multi-tenant.'
      }
    ]
  },
  {
    version: 'v1.9.0',
    releaseDate: '18 Oktober 2026',
    title: 'Integrasi 5 Modul Skill Agen Mandiri (Standar skills.sh): Frontend Studio, Go Orchestrator, Traefik Infra, Database RLS, & Changelog SemVer',
    summary: 'Memperluas kapabilitas agen AI dengan 5 paket standar skill modular (.agents/skills/): herocms-frontend-studio (Zero-CSS duplication & master design tokens), herocms-go-orchestrator (Docker Engine SDK, cgroups quota, & graceful shutdown), herocms-traefik-infra (Traefik v3 dynamic routing & network topology), herocms-database-rls (PostgreSQL Row-Level Security & Redis caching), serta herocms-changelog-semver untuk kepatuhan tata kelola rilis.',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-190-1',
        type: 'feature',
        scope: 'Frontend Studio Skill (.agents/skills/herocms-frontend-studio)',
        description: 'Menetapkan kepatuhan desain DESIGN.md, Zero-CSS duplication di studio-master.css, dan on-demand lazy loading modul antar-menu.'
      },
      {
        id: 'c-190-2',
        type: 'feature',
        scope: 'Go Provisioning Orchestrator Skill (.agents/skills/herocms-go-orchestrator)',
        description: 'Standar idiomatik Golang 1.23, Docker Engine SDK lifecycle, konteks timeout, dan pembatasan isolasi cgroups v2 kontainer tenant.'
      },
      {
        id: 'c-190-3',
        type: 'feature',
        scope: 'Traefik Edge Routing & Infra Skill (.agents/skills/herocms-traefik-infra)',
        description: 'Standarisasi topologi 3 jaringan Docker (app-network, traefik_network, redis-net) dan injeksi label dinamis Traefik v3.'
      },
      {
        id: 'c-190-4',
        type: 'feature',
        scope: 'PostgreSQL Multi-Tenant RLS Skill (.agents/skills/herocms-database-rls)',
        description: 'Pola migrasi SQL dengan Row-Level Security berbasis app.current_tenant_id dan namespacing cache Redis.'
      },
      {
        id: 'c-190-5',
        type: 'feature',
        scope: 'Changelog & SemVer Assistant Skill (.agents/skills/herocms-changelog-semver)',
        description: 'Otomasi kepatuhan Semantic Versioning dan penulisan changelog terstruktur sesuai mandat AGENTS.md.'
      }
    ]
  },
  {
    version: 'v1.8.2',
    releaseDate: '17 Oktober 2026',
    title: 'Modal Konfirmasi Hapus Kontainer (Bespoke Danger Zone Dialog): Menggantikan Native Browser Confirm dengan UI Studio Terpadu',
    summary: 'Menghilangkan native browser confirm() dialog yang kaku pada penghapusan kontainer runtime, digantikan dengan HeroCMS Studio Danger Zone Modal yang elegan: kartu pratinjau pod target, rincian konsekuensi teknis destruktif (penghentian isolasi cgroups v2, pencabutan rute Traefik/SSL, pengembalian slot kuota), dan tombol aksi destruktif dengan status loading.',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-182-1',
        type: 'improvement',
        scope: 'Eliminate Native Browser window.confirm()',
        description: 'Mengganti dialog bawaan browser yang kaku dengan modal konfirmasi interaktif bergaya HeroCMS Studio Design System.'
      },
      {
        id: 'c-182-2',
        type: 'feature',
        scope: 'Bespoke Danger Zone Delete Confirmation Modal',
        description: 'Menampilkan detail lengkap pod yang akan dihapus, ringkasan dampak teknis (cgroups v2, Traefik edge unrouting, pengembalian kuota), serta proteksi aksi dengan tombol destruktif dan loading spinner.'
      }
    ]
  },
  {
    version: 'v1.8.1',
    releaseDate: '17 Oktober 2026',
    title: 'Ekspansi Ukuran Konsol Terminal: Desain Super Lebar (1480px / 95vw), Layar 84vh, dan Tipografi Monospace Nyaman',
    summary: 'Merespons masukan pengguna untuk memperbesar ukuran modal log terminal: memperlebar dialog menjadi 1480px (95vw) dengan tinggi 84vh, tinggi layar konsol ditingkatkan menjadi 540px+, ukuran font monospace dinaikkan menjadi 0.83rem, padding toolbar diperluas, serta mode layar penuh yang kini mencakup 99vw/97vh.',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-181-1',
        type: 'improvement',
        scope: 'Terminal Console Viewport Enlargement (1480px / 95vw)',
        description: 'Memperluas dimensi dialog konsol dari 980px menjadi 1480px (95vw) dan minimum height 84vh agar baris log telemetri dan URL panjang tidak terpotong atau wrap.'
      },
      {
        id: 'c-181-2',
        type: 'improvement',
        scope: 'Output Screen Height & Typography Scaling',
        description: 'Meningkatkan tinggi output screen konsol menjadi 540px+, menaikkan ukuran font baris log ke 0.83rem, serta memperbesar traffic lights dan tombol filter.'
      }
    ]
  },
  {
    version: 'v1.8.0',
    releaseDate: '17 Oktober 2026',
    title: 'Perombakan Total Terminal Log Kontainer: Konsol Pengembang macOS-Style, Filter Interaktif, Line Numbers, dan Auto-Scroll',
    summary: 'Merombak total jendela modal Log Runtime Kontainer menjadi konsol pengembang kelas dunia (setara Railway, Warp, dan Vercel Console): bingkai window macOS dengan traffic lights interaktif (tutup, jeda stream, layar penuh), penghapusan raw UUID digantikan identitas pod bersih ber-SSL, indikator beacon "STREAM LIVE" dengan status pause/resume, bilah filter level layanan (Inbound, Traefik & SSL, Engine, Docker, System) dengan pill counter, kolom line numbers bernomor presisi, pencarian log real-time dengan highlight, pengunduhan file .log fisik, serta sequence animasi live reboot.',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-180-1',
        type: 'feature',
        scope: 'macOS Developer Console Window & Fullscreen Mode',
        description: 'Menyematkan window chrome dengan traffic lights (🔴 tutup, 🟡 jeda, 🟢 fullscreen toggle), mode layar penuh 98vw/94vh, dan identitas pod bersih ber-SSL.'
      },
      {
        id: 'c-180-2',
        type: 'feature',
        scope: 'Interactive Real-Time Log Search & Service Tabs',
        description: 'Menerapkan pencarian log instan dengan tombol clear, tab kategori layanan dengan jumlah baris dinamis, serta dataset log runtime modular di src/data/container-logs.ts.'
      },
      {
        id: 'c-180-3',
        type: 'feature',
        scope: 'Developer Utilities: Auto-Scroll, Log Download & Clear Screen',
        description: 'Menyediakan tombol kendali auto-scroll (ON/OFF), jeda streaming live, unduhan berkas fisik .log, dan pembersihan/pemulihan layar konsol.'
      },
      {
        id: 'c-180-4',
        type: 'improvement',
        scope: 'Line Numbers & High-DPI Obsidian Screen',
        description: 'Menambahkan kolom line number dua digit (01, 02, 03...), service badges warna-warni, penyorotan status kode HTTP, dan kursor terminal berkedip.'
      }
    ]
  },
  {
    version: 'v1.7.1',
    releaseDate: '17 Oktober 2026',
    title: 'Perombakan Filter Bar Log Akses: Segmented Pill Tabs Berikon, Pill Badges Counter, dan Input Search Interaktif',
    summary: 'Merombak tampilan filter log akses pengunjung harian di Detail Kontainer dari tombol mentah menjadi bilah toolbar tingkat enterprise: segmented pills dengan ikon (Globe, Google Search, Media Sosial, Direct), indikator jumlah hit dinamis, input pencarian dengan clear button (X), tombol reset filter, serta empty state interaktif.',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-171-1',
        type: 'improvement',
        scope: 'Segmented Filter Pills with Live Counter Badges',
        description: 'Menerapkan tab segmented modern berperekat halus dengan ikon saluran, penanda active card putih berbayang lembut, dan pill badge jumlah log hit yang real-time.'
      },
      {
        id: 'c-171-2',
        type: 'improvement',
        scope: 'Interactive Clearable Search Input & Reset Button',
        description: 'Menyediakan input pencarian dengan fokus ring biru aksen, tombol hapus pencarian instan (X), dan tombol Reset Filter saat filter aktif atau pencarian menghasilkan 0 baris.'
      }
    ]
  },
  {
    version: 'v1.7.0',
    releaseDate: '17 Oktober 2026',
    title: 'Bespoke CMS Content & Media Analytics Suite: Status Publikasi, Media Library WebP Health, Top Pages Engagement, dan Saluran Pengunjung Organik',
    summary: 'Meluncurkan modul analisis khusus CMS ke dalam Detail Kontainer HeroCMS: menyajikan metrik esensial untuk situs berbasis konten tanpa beban database. Mencakup ringkasan status publikasi (halaman terbit vs draft, validitas /sitemap.xml, latensi purge cache instan 118ms), telemetri penyimpanan media library (rasio konversi WebP 93.8%, bandwidth terhemat, deteksi aset terbesar), proteksi form kontak & anti-spam edge tanpa captcha, tabel peringkat konten terpopuler (views, waktu baca, cache hit %, TTFB), dan visualisasi multi-warna saluran kedatangan pembaca (Google SEO, Media Sosial, Direct, Referral).',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-170-1',
        type: 'feature',
        scope: 'CMS Content Performance & Top Pages Table',
        description: 'Menambahkan tabel interaktif halaman & konten terpopuler lengkap dengan ranking badge, URL path, total pembaca, estimasi waktu baca, cache hit ratio, dan kecepatan buka TTFB.'
      },
      {
        id: 'c-170-2',
        type: 'feature',
        scope: 'Media Library Storage & WebP Optimization Health',
        description: 'Menghadirkan kartu telemetri penyimpanan aset media dengan progress meter kapasitas, persentase konversi otomatis format WebP, penghematan bandwidth, serta audit berkas terbesar.'
      },
      {
        id: 'c-170-3',
        type: 'feature',
        scope: 'Publishing Lifecycle & Edge Purge Latency',
        description: 'Menampilkan status verifikasi sitemap XML, perbandingan halaman terbit vs draft, dan latensi pembersihan cache instan (instant edge cache invalidation) saat konten diperbarui.'
      },
      {
        id: 'c-170-4',
        type: 'feature',
        scope: 'Traffic Acquisition Channels & Form Spam Shield',
        description: 'Menyediakan widget visual saluran kedatangan pengunjung (SEO Google, Sosmed, Direct) serta indikator proteksi formulir kontak dari serangan bot spammer via Traefik edge rate limit.'
      }
    ]
  },
  {
    version: 'v1.6.0',
    releaseDate: '17 Oktober 2026',
    title: 'Integrasi Enterprise Apache ECharts: Grafik Telemetri Edge & Cache Kelas Industri (Cloudflare & Datadog APM Standard)',
    summary: 'Mengadopsi library visualisasi data industri terkemuka Apache ECharts (echarts) ke dalam HeroCMS Dashboard: menggantikan grafik SVG manual dengan engine canvas beresolusi tinggi, cubic hermite spline mulus, shading gradasi area presisi (#2563eb dan #10b981), axisPointer crosshair otomatis, interactive HTML glassmorphic tooltip card, responsive auto-resize via ResizeObserver, transisi animasi halus saat perpindahan timeframe (24 Jam / 7 Hari / 30 Hari), serta optimasi manual vendor chunks di Vite.',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-160-1',
        type: 'feature',
        scope: 'Apache ECharts Engine Integration',
        description: 'Menginstal dan mengintegrasikan pustaka visualisasi data tingkat enterprise Apache ECharts (echarts) dengan pemisahan chunk vendor terpisah di vite.config.ts untuk efisiensi HTTP long-term caching.'
      },
      {
        id: 'c-160-2',
        type: 'improvement',
        scope: 'High-DPI Canvas Antialiasing & Dual Area Gradients',
        description: 'Mengganti SVG rendering manual yang terdistorsi dengan canvas anti-aliasing tajam berskala rasio pixel perangkat (Retina ready), gradasi area linier transparan, dan bayangan garis kurva (drop shadow glow).'
      },
      {
        id: 'c-160-3',
        type: 'feature',
        scope: 'Smart AxisPointer Crosshair & Glassmorphic Tooltip',
        description: 'Menyediakan pelacak koordinat kursor axisPointer otomatis dan kartu tooltip gelap kaca (glassmorphic) yang merinci status edge ingress, cache hit %, origin pass, latensi, dan bandwidth secara interaktif.'
      },
      {
        id: 'c-160-4',
        type: 'performance',
        scope: 'Fluid Timeframe Morphing & ResizeObserver',
        description: 'Menerapkan transisi animasi morfologis halus (700ms cubicOut) saat beralih antara 24 Jam, 7 Hari, dan 30 Hari, serta sinkronisasi otomatis ukuran grafik dengan ResizeObserver.'
      }
    ]
  },
  {
    version: 'v1.5.2',
    releaseDate: '17 Oktober 2026',
    title: 'PaaS Developer Card Overhaul: Railway & Vercel-Style Dynamic Identity, Top Accent Stripe & Live Traffic Sparkline',
    summary: 'Merombak tampilan kartu kontainer di Situs & Kontainer agar dinamis, hidup, dan setara PaaS kelas dunia: menambahkan garis aksen gradasi 3px warna brand container, ambient glow di sudut atas, avatar ikon 44x44 dengan kategori badge, penghapusan raw UUID diganti short pod ID (#pod-000001), kapsul URL modern ber-SSL, widget mini-trend sparkline kurva area trafik 7 hari (+24% growth), gauge meter CPU/RAM presisi, serta toolbar aksi yang rapi.',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-152-1',
        type: 'improvement',
        scope: 'Top Brand Accent Stripe & Ambient Glow',
        description: 'Menyematkan garis aksen atas dinamis berdasarkan warna tema situs (--card-accent) dan radial glow halus saat hover, memberikan identitas visual unik pada setiap kontainer.'
      },
      {
        id: 'c-152-2',
        type: 'feature',
        scope: 'Live Traffic Momentum & Area Sparkline Widget',
        description: 'Menambahkan strip trafik 7 hari dengan mini SVG Area Sparkline curve bergradasi halus dan persentase pertumbuhan (+24%), membuat kartu terlihat aktif dan memancarkan data hidup.'
      },
      {
        id: 'c-152-3',
        type: 'improvement',
        scope: 'Clean Identity & Short Pod ID Tag',
        description: 'Menghapus string UUID panjang yang mengganggu dan menggantinya dengan pod tag rapi (mis. pod-000001) serta badge kategori situs (Portofolio, Bisnis, Publikasi, Edukasi).'
      },
      {
        id: 'c-152-4',
        type: 'improvement',
        scope: 'Pro PaaS Dual Gauges & Unified Action Toolbar',
        description: 'Merapikan bar meter CPU CFS Quota dan RAM memcg dengan ikon dan label yang bersih tanpa underline garis janggal, serta mengelompokkan tombol Editor, Analitik, dan 5 kontrol runtime secara proporsional.'
      }
    ]
  },
  {
    version: 'v1.5.1',
    releaseDate: '17 Oktober 2026',
    title: 'Perombakan Visual Chart Edge & Cache: Industry Standard Catmull-Rom Spline, Y/X-Axis Scale & Scrub Tooltip',
    summary: 'Merombak grafik volume traffic & cache edge Traefik menjadi setara standar visual Cloudflare Analytics & Vercel Web Analytics: menghilangkan titik lingkaran kaku (static circle beads), mengimplementasikan algoritma Catmull-Rom to Cubic Bézier spline dengan bayangan halus (drop shadow glow), skala vertikal Y-axis dinamis (formatted k/M), label horizontal X-axis waktu (WIB), hairline crosshair interaktif, serta floating glassmorphic tooltip yang responsif mengikuti kursor.',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-151-1',
        type: 'improvement',
        scope: 'Clean Industry-Standard Spline & Elimination of Clunky Circles',
        description: 'Menghapus titik lingkaran statis di sepanjang garis yang membuat tampilan kaku, menggantinya dengan kurva Catmull-Rom to Cubic Bézier spline mulus dengan gradasi area halus (#2563eb dan #10b981) dan glow effect.'
      },
      {
        id: 'c-151-2',
        type: 'improvement',
        scope: 'Dynamic Y-Axis Scale Guides & X-Axis Timestamps',
        description: 'Menambahkan 4 garis grid horizontal dan skala metrik sumbu Y otomatis (mis. 5.2k, 3.5k, 1.7k, 0) serta label waktu sumbu X presisi yang disinkronkan dengan interval filter 24 Jam, 7 Hari, dan 30 Hari.'
      },
      {
        id: 'c-151-3',
        type: 'feature',
        scope: 'Interactive Crosshair Scrubber & Glassmorphic Tooltip',
        description: 'Menyediakan hairline crosshair vertikal yang muncul saat scrubbing kursor mouse di atas grafik, pulsing halo dot pada titik koordinat aktif, serta floating glassmorphic tooltip kartu gelap yang merinci Total Permintaan, Edge Cache Hit %, Origin Pass, TTFB, dan Bandwidth.'
      },
      {
        id: 'c-151-4',
        type: 'improvement',
        scope: 'Header Quick KPI Strip & Accessible Legend',
        description: 'Menyematkan badge ringkasan telemetri langsung di header grafik (Total Volume, Cache Hit %, Puncak Traffic req/periode) serta legend yang membedakan Traefik Ingress, Edge Cache Hit, dan Container Cache Miss.'
      }
    ]
  },
  {
    version: 'v1.5.0',
    releaseDate: '17 Oktober 2026',
    title: 'Cloudflare-Style Pod Detail & Geo Edge Analytics: Distribusi Pengunjung Berdasarkan Negara & Live Edge Ingest',
    summary: 'Peluncuran modul inspeksi Pod & Container Telemetry kelas industri terinspirasi oleh Cloudflare Dashboard & Vercel Edge Analytics: visualisasi distribusi traffic pengunjung berdasarkan negara dengan bendera nasional & latensi regional, grafik area interaktif per jam/hari (requests, cache hit ratio 92.4%, bandwidth egress), live edge ingest ticker real-time, breakdown tipe perangkat (Mobile vs Desktop), Core Web Vitals (LCP, INP, CLS), HTTP status codes, serta tombol export dataset CSV.',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-150-1',
        type: 'feature',
        scope: 'Pod & Ingress Full-Page Sub-View Inspector',
        description: 'Menyediakan halaman inspeksi Pod & Analitik Edge terdedikasi (Full-Page Sub-View) dengan bilah navigasi breadcrumb dan tombol kembali instan ke daftar kontainer, merinci spesifikasi container runtime, gateway IP Traefik internal, TLS 1.3 ALPN handshake, cgroups v2 limits, serta quick action bar.'
      },
      {
        id: 'c-150-2',
        type: 'feature',
        scope: 'Cloudflare-Style Geo Traffic by Country',
        description: 'Menyajikan ranking distribusi negara pengakses lengkap dengan bendera nasional (🇮🇩 Indonesia, 🇸🇬 Singapura, 🇺🇸 Amerika Serikat, 🇲🇾 Malaysia, dll.), total request, persentase visual bar, dan latensi TTFB regional.'
      },
      {
        id: 'c-150-3',
        type: 'feature',
        scope: 'Interactive Edge Area Chart & Timeframe Filter',
        description: 'Menyematkan grafik kurva area SVG bergradasi halus dengan filter 24 Jam, 7 Hari, dan 30 Hari, memvisualisasikan volume request total vs request yang dilayani dari Traefik Edge Cache.'
      },
      {
        id: 'c-150-4',
        type: 'feature',
        scope: 'Live Edge Ingest Streaming Ticker',
        description: 'Menampilkan ticker live feed traffic real-time yang memancarkan request terkini lengkap dengan kota asal, metode HTTP, path rute, kode status, latensi, dan tipe perangkat.'
      },
      {
        id: 'c-150-5',
        type: 'improvement',
        scope: 'Devices, Web Vitals, HTTP Codes & CSV Export',
        description: 'Melengkapi analitik dengan rasio pengunjung Mobile (72.4%) vs Desktop (24.1%), skor Real Experience Core Web Vitals (LCP 0.7s, INP 14ms, CLS 0.01), distribusi status 200/304/404, serta kapabilitas 1-klik unduh berkas CSV analitik.'
      },
      {
        id: 'c-150-6',
        type: 'feature',
        scope: 'Datadog & cgroups v2 Kernel Resource Telemetry & Process Tree',
        description: 'Menambahkan grid telemetri resource mendalam (CPU CFS quota period, CPU throttling, Load Average, Memory RSS/Cache split, Swap 0MB, Disk IOPS, Active TCP sockets) serta tabel inspeksi pohon proses Linux worker (PID, CPU, Memory RSS, Threads).'
      },
      {
        id: 'c-150-7',
        type: 'feature',
        scope: 'Vercel-Style Daily Visitor Hit & Access Attribution Ledger',
        description: 'Menyediakan tabel log akses pengunjung harian dengan pencarian IP/ISP/Path, filter saluran referrer (Google Search, Media Sosial, Direct), indikator cache status (HIT/MISS/BYPASS), bendera negara, dan detail User Agent.'
      },
      {
        id: 'c-150-8',
        type: 'feature',
        scope: 'Customer Peace-of-Mind & Reliability Suite',
        description: 'Menambahkan suite ketenangan customer mencakup kalender Uptime SLA 30 hari (Statuspage/UptimeRobot style) dengan 0 menit downtime, kartu cadangan otomatis harian (snapshot verification & 1-klik restore), masa berlaku sertifikat SSL Wildcard auto-renew (89 hari tersisa), transparansi kuota bandwidth tanpa overage fee, serta riwayat publikasi build & deployment.'
      }
    ]
  },
  {
    version: 'v1.4.2',
    releaseDate: '17 Oktober 2026',
    title: 'Perombakan Antarmuka Situs & Kontainer Standar Industri: Dual View Grid/Tabel, Telemetri Sparkline & Purge Edge Cache',
    summary: 'Peningkatan menyeluruh modul Situs & Kontainer setara platform PaaS kelas dunia (Vercel & Railway): pengalih tampilan Grid Visual dan Tabel Ledger Enterprise yang tersimpan di localStorage, kurva sparkline SVG CPU & RAM langsung, chip latensi edge Traefik v3 (⚡ 1.2ms TTFB), tombol Purge Edge Cache instan, validasi ketersediaan subdomain real-time pada modal deploy, serta Terminal Log Viewer interaktif dengan filter level log dan pencarian teks.',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-142-1',
        type: 'feature',
        scope: 'Situs & Kontainer Dual-View Architecture',
        description: 'Menyediakan tombol pengalih mode tampilan antara Visual Grid (kartu modern dengan kurva telemetri) dan Dense Enterprise Table (.ledger-table) yang mencakup indikator slot kuota tersisa dan aksi cepat, dengan preferensi tersimpan di localStorage.'
      },
      {
        id: 'c-142-2',
        type: 'feature',
        scope: 'Live SVG Sparkline Telemetry & Edge Chips',
        description: 'Mengintegrasikan visualisasi kurva sparkline SVG reaktif bebas latensi untuk telemetri CPU & RAM di setiap kartu kontainer, status validasi SSL TLS 1.3, serta chip latensi Traefik v3 (⚡ 1.2ms TTFB).'
      },
      {
        id: 'c-142-3',
        type: 'feature',
        scope: 'Traefik v3 Purge Edge Cache Operation',
        description: 'Menambahkan tombol operasi Purge Edge Cache dengan feedback loading animasi dan toast pemberitahuan sukses, serta penyegaran telemetri edge secara langsung.'
      },
      {
        id: 'c-142-4',
        type: 'improvement',
        scope: 'Deploy Container Modal & Real-Time Subdomain Check',
        description: 'Memperkaya formulir modal Buat & Luncurkan Kontainer dengan pengecekan ketersediaan subdomain secara real-time (.cloudcms.app) serta highlight blueprint Toko Online & Retail sebagai pilihan Flagship #1.'
      },
      {
        id: 'c-142-5',
        type: 'improvement',
        scope: 'Terminal Logs Console Filter & Search',
        description: 'Melengkapi modal Terminal Logs dengan tab filter tingkat log (ALL, DOCKER, TRAEFIK, SYSTEM, TRAFFIC), pencarian teks log langsung, status isolasi cgroups v2, dan tombol zero-downtime reboot kontainer.'
      }
    ]
  },
  {
    version: 'v1.4.1',
    releaseDate: '10 Oktober 2026',
    title: 'Perombakan UI/UX Modal Blueprint Enterprise, Palet Aksen Interaktif & Sinkronisasi Reaktif Editor',
    summary: 'Peningkatan estetika formulir modal Terapkan & Deploy Blueprint dengan diagram alur pipeline sumber-ke-target, pemilih palet warna aksen interaktif, switch toggle iOS kustom, perbaikan kebocoran styling CSS global .modal-body, serta sinkronisasi reaktif blok visual draft editor antara template catalog dan canvas Visual Editor Studio.',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-141-1',
        type: 'improvement',
        scope: 'Modal Arsitektur Blueprint & Form UX',
        description: 'Merombak tampilan modal Terapkan Blueprint menjadi visual pipeline transfer (kartu blueprint sumber -> flow connector -> kartu kontainer target), selector palet warna aksen identitas dengan 8 warna enterprise, switch toggle bergaya iOS halus, indikator snapshot cadangan otomatis, serta tombol CTA bergaya bespoke Deep Slate.'
      },
      {
        id: 'c-141-2',
        type: 'bugfix',
        scope: 'CSS Architecture & Modal Body Scope Isolation',
        description: 'Menghilangkan kebocoran aturan global .modal-body dari visual-editor.css yang sebelumnya menyebabkan latar belakang modal menghitam, dan menetapkan styling modal terpusat di studio-master.css sesuai standar desain HeroCMS Studio.'
      },
      {
        id: 'c-141-3',
        type: 'bugfix',
        scope: 'Sinkronisasi Reaktif Visual Editor & State Draft',
        description: 'Memperbaiki ketidaksesuaian kunci penyimpanan draf (herocms_editor_draft_ vs cloudcms_draft_), menangani ekstraksi payload res.draft dari Go backend, serta menambahkan watcher reaktif pada VisualEditorModule agar blok baru dari blueprint langsung diterapkan ke kanvas tanpa tertimpa draft lama.'
      },
      {
        id: 'c-141-4',
        type: 'improvement',
        scope: 'Live Terminal Simulator & Visual Showcase',
        description: 'Menambahkan mockup terminal macOS interaktif pada hero pratinjau live simulator untuk menampilkan telemetri Traefik v3, latensi TTFB sub-2ms, dan isolasi Linux cgroups v2 secara realistis.'
      },
      {
        id: 'c-141-5',
        type: 'improvement',
        scope: 'Teleport Fullscreen Blur & Dead-Center Alignment',
        description: 'Membungkus seluruh modal dan simulator pratinjau dengan Teleport to="body" dan z-index 100000 agar efek backdrop blur menyelimuti 100% seluruh layar viewport (melintasi sidebar dan header atas tanpa terisolasi di content area), serta posisi form dialog tepat berada di tengah layar.'
      },
      {
        id: 'c-141-6',
        type: 'feature',
        scope: 'Desktop Simulator Fullscreen Edge-to-Edge',
        description: 'Menjadikan pratinjau versi desktop tampil dalam mode Layar Penuh 100% (Edge-to-Edge Fullscreen) secara default tanpa ruang hitam kosong di kiri-kanan, serta menyediakan tombol pengalih mode Layar Penuh vs Bingkai Jendela (1200px) di toolbar simulator.'
      },
      {
        id: 'c-141-7',
        type: 'feature',
        scope: 'Tablet Orientation Switcher (Portret 768px vs Lanskap 1024px)',
        description: 'Menambahkan fitur rotasi orientasi tablet (Portret 768px dan Lanskap 1024px) baik pada Simulator Layar Penuh maupun Split Studio Preview dengan animasi transisi sasis yang mulus, tombol pengalih di toolbar atas, serta adaptasi rendering responsif secara langsung.'
      },
      {
        id: 'c-141-8',
        type: 'feature',
        scope: 'Mobile Landscape Orientation Switcher (Portret 390px vs Lanskap 844px)',
        description: 'Menambahkan opsi rotasi orientasi smartphone (Portret 390px dan Lanskap 844px) dengan bezel fisik elegan, Dynamic Island presisi, indikator gestur bar bawah, transisi sasis mulus, dan adaptasi tata letak konten responsif.'
      },
      {
        id: 'c-141-9',
        type: 'feature',
        scope: 'Realistic Physical Hardware Device Mockups (Mobile Phone & iPad Tablet)',
        description: 'Mengubah tampilan pratinjau mobile dan tablet menjadi mockup fisik perangkat keras yang otentik: Smartphone Flagship (speaker earpiece slit, Dynamic Island dengan lensa kamera & sensor, status bar 09:41, floating Safari address pill, home notch pill) dan iPad Pro Tablet (bezel camera, status bar iPadOS, Safari tab strip & SSL address box, home indicator), baik di Simulator Layar Penuh maupun Split Studio View.'
      },
      {
        id: 'c-141-10',
        type: 'improvement',
        scope: 'Device Aspect Ratio & Screen Inner Scrolling Fix',
        description: 'Memperbaiki proporsi fisik perangkat mobile dan tablet agar tidak melar/memanjang tanpa batas ke bawah: menetapkan batas tinggi fisik proporsional (iPhone ~780px, iPad ~860px) dengan scrollbar internal yang mulus di dalam layar perangkat dan perataan tengah vertikal pada panggung simulator.'
      },
      {
        id: 'c-141-11',
        type: 'improvement',
        scope: 'Mobile Landscape Ergonomics & Hardware Orientation Realignment',
        description: 'Memperbaiki tata letak hardware smartphone pada mode rotasi lanskap: memindahkan Dynamic Island fisik ke bezel samping kiri (sesuai arah rotasi 90 derajat alami), menghilangkan lubang speaker yang janggal di sisi panjang atas, memperluas tinggi viewport lanskap menjadi 520px agar konten lega, menyatukan URL bar ke status bar atas, dan mempertahankan gestur bar bawah yang elegan.'
      },
      {
        id: 'c-141-12',
        type: 'improvement',
        scope: 'Stable Hardware Frame Preservation & Fluid Device Dimension Morphing',
        description: 'Memperbaiki sasis fisik perangkat agar bingkai HP dan tablet tidak pernah hilang atau berkedip saat orientasi diubah: menghilangkan keyframe 3D yang sebelumnya menimpa multi-ring box-shadow, memastikan bezel titanium dan rounded corners tetap kokoh utuh, serta menerapkan transisi dimensi hardware yang mulus berbasis kurva cubic-bezier(0.16, 1, 0.3, 1) layaknya simulator kelas industri.'
      },
      {
        id: 'c-141-13',
        type: 'feature',
        scope: 'Flagship Commercial Selling Store Blueprint (E-Commerce Jualan Retail)',
        description: 'Menetapkan blueprint Toko Online & Penjualan Produk Retail sebagai blueprint unggulan #1 (default) menggantikan portofolio personal: dilengkapi etalase produk dengan harga Rupiah, promo flash sale, keranjang belanja, tombol direct checkout WhatsApp, dan jaminan belanja aman untuk mendukung ekosistem website komersial yang berorientasi pada penjualan produk nyata.'
      }
    ]
  },
  {
    version: 'v1.4.0',
    releaseDate: '10 Oktober 2026',
    title: 'Katalog Template & Blueprint Store 100% Fungsional, Simulator Pratinjau Interaktif & Engine Deploy Satu-Klik',
    summary: 'Transformasi menyeluruh modul Katalog Template dari sekadar rancangan visual menjadi Blueprint Engine operasional 100%: 6 blueprint resmi siap pakai (Portofolio, Editorial Blog, Edukasi LMS, Bisnis UMKM, SaaS Startup, Agensi Kreatif), Simulator Pratinjau Interaktif dengan switch perangkat Desktop/Tablet/Mobile dan live color palette testing, kapabilitas penerapan langsung ke situs kontainer aktif, alokasi kontainer mandiri satu-klik, serta sinkronisasi penuh dengan Visual Editor dan backend Go PostgreSQL.',
    badge: 'Stable',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-140-1',
        type: 'feature',
        scope: 'Blueprint Engine & Dataset Arsitektur',
        description: 'Membuat dataset terpusat src/data/templates-data.ts berisi 6 blueprint arsitektur lengkap dengan skema blok visual native (navbar, hero, features, showcase, accordion FAQ, stats, cta, footer), konfigurasi tema, skor Lighthouse 100/100, dan metrik latensi TTFB sub-2ms.'
      },
      {
        id: 'c-140-2',
        type: 'feature',
        scope: 'Simulator Pratinjau Interaktif Responsif',
        description: 'Menghadirkan modal simulator pratinjau live fullscreen dengan simulasi viewport multi-perangkat (Desktop 1200px, Tablet 768px, Mobile 390px), pengujian palet warna aksen real-time, browser chassis realistis, serta tombol aksi cepat untuk menerapkan atau mendeploy blueprint.'
      },
      {
        id: 'c-140-3',
        type: 'feature',
        scope: 'Engine Penerapan Template & Deploy Kontainer',
        description: 'Menyediakan fitur Terapkan Blueprint ke Situs Aktif yang secara otomatis menimpa draft editor dan tema kontainer terpilih serta menyinkronkannya ke backend, dan fitur Deploy Blueprint Baru dengan formulir alokasi kontainer otomatis ber-subdomain cloudcms.app.'
      },
      {
        id: 'c-140-4',
        type: 'improvement',
        scope: 'Backend Go Service & Repository Integration',
        description: 'Memperluas CreateContainerInput pada Go backend agar mendukung parameter templateName, accentColor, dan bioIntro kustom serta menyimpannya ke database PostgreSQL dan cache RLS.'
      },
      {
        id: 'c-140-5',
        type: 'feature',
        scope: 'Ecosystem Condiments & Dual View Mode',
        description: 'Menambahkan banner Spotlight Blueprint Pilihan Editor, bar metrik Marketplace Pulse Telemetry, mode tampilan Dual View (Grid Catalog vs Split Studio Inspector berdampingan dengan live device preview instan), peta alur kerja filosofi blueprint (3 langkah), serta banner asisten AI Blueprint Architect.'
      },
      {
        id: 'c-140-6',
        type: 'improvement',
        scope: 'Realistic Device Simulator & Dynamic Block Rendering',
        description: 'Memperbaharui simulator pratinjau secara radikal: menghadirkan komponen TemplateLiveRenderer yang merender blok visual aktual (Accordion buka-tutup interaktif, toggle paket harga, ranking listgroup, showcase studi kasus), chassis smartphone realistis dengan Dynamic Island & status bar, macOS browser bar dengan live TTFB status, switch dark/light mode live, zoom scaler (100%, 85%, 70%), dan animasi muat ulang.'
      }
    ]
  },
  {
    version: 'v1.3.9',
    releaseDate: '10 Oktober 2026',
    title: 'Isolasi Cache Multi-Tenant per User, Proteksi CSRF & Sinkronisasi Metrik Kapasitas',
    summary: 'Perbaikan komprehensif pada integritas state multi-tenant: isolasi cache localStorage per user/tenant, perbaikan validasi array kosong (Array.isArray) agar menu tidak tertukar data mock antar-user, pencegahan reset kapasitas storage menjadi 0 MB saat beralih akun, penataan urutan CSRF saat login, dan penerapan NoCache HTTP header pada backend API.',
    badge: 'Stable',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-139-1',
        type: 'bugfix',
        scope: 'State Management & LocalStorage Cache',
        description: 'Menerapkan scoping kunci cache localStorage berbasis user email (herocms_dashboard_cache_${email}) dan memperbaiki validasi sinkronisasi data dari Array.length menjadi Array.isArray pada containers, articles, custom domains, tickets, invoices, dan webhooks sehingga akun dengan 0 item menampilkan data asli kosong alih-alih tertukar data seed atau data user sebelumnya.'
      },
      {
        id: 'c-139-2',
        type: 'bugfix',
        scope: 'Media Storage Telemetry & Client Recalculation',
        description: 'Mencegah recalculateStorage klien menimpa telemetri kapasitas server S3 yang valid menjadi 0 MB saat beralih akun atau saat upload/delete berkas, serta mempertahankan angka kapasitas real-time yang dilaporkan oleh database dan MinIO S3.'
      },
      {
        id: 'c-139-3',
        type: 'bugfix',
        scope: 'Auth Flow & Backend Cache Security',
        description: 'Memperbaiki urutan pemanggilan resetDashboardState sebelum request login/register agar token CSRF dan sesi tidak terhapus pasca-login, menambahkan middleware NoCache pada seluruh rute /api/* untuk mencegah browser caching antar-akun, dan memastikan registrasi tenant baru selalu menghasilkan UUID valid.'
      }
    ]
  },
  {
    version: 'v1.3.8',
    releaseDate: '10 Oktober 2026',
    title: 'Audit & Penyempurnaan Modul Media Assets S3 MinIO',
    summary: 'Penyempurnaan arsitektur media assets: penambahan kolom bucket_name pada DDL & migrasi PostgreSQL, penyempurnaan unduhan file via blob fetch, filter sorting aset (Terbaru, Terlama, Nama, Ukuran), pratinjau interaktif dokumen PDF dalam modal inspector, penanganan gambar gagal muat, dan eliminasi flicker drag-and-drop.',
    badge: 'Stable',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-138-1',
        type: 'bugfix',
        scope: 'PostgreSQL Database & Repository',
        description: 'Memperbaiki skema DDL media_assets dan menambahkan migrasi ALTER TABLE ADD COLUMN IF NOT EXISTS bucket_name agar query CreateAsset dan GetAssets berjalan tanpa kendala kolom tidak ditemukan.'
      },
      {
        id: 'c-138-2',
        type: 'improvement',
        scope: 'Media Assets UI & UX',
        description: 'Menambahkan fitur sort berkas (Terbaru, Terlama, Nama A-Z, Ukuran), pratinjau lembar PDF langsung di modal inspector, fallback thumbnail gambar gagal muat, dukungan filter GIF & TXT, dan download berkas langsung berbasis blob URL.'
      }
    ]
  },
  {
    version: 'v1.3.7',
    releaseDate: '28 September 2026',
    title: 'Dukungan Multi-Arsitektur CI/CD (linux/amd64 & linux/arm64/v8)',
    summary: 'Menerapkan setup QEMU dan kompilasi multi-arsitektur Buildx pada pipeline GitHub Actions agar image Docker di Docker Hub mendukung arsitektur ARM64 (Apple Silicon, Raspberry Pi, AWS Graviton) dan AMD64 secara native tanpa error manifest.',
    badge: 'Stable',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-137-1',
        type: 'feature',
        scope: 'CI/CD Multi-Arch Pipeline',
        description: 'Mengintegrasikan docker/setup-qemu-action@v3 dan parameter platforms: linux/amd64,linux/arm64 pada workflow .github/workflows/docker-image.yml untuk menghasilkan image manifest multi-platform bagi roxas0800/herocms-dashboard dan roxas0800/herocms-marketing.'
      }
    ]
  },
  {
    version: 'v1.3.6',
    releaseDate: '28 September 2026',
    title: 'Adopsi Pre-Built Container Image Resmi CI/CD pada Docker Compose',
    summary: 'Menggantikan build lokal Dockerfile pada service dashboard-cms dan marketing-site dengan image resmi terkompilasi dari Docker Hub (roxas0800/herocms-dashboard dan roxas0800/herocms-marketing) hasil pipeline CI/CD GitHub Actions.',
    badge: 'Stable',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-136-1',
        type: 'improvement',
        scope: 'Docker Compose & Production Deployment',
        description: 'Menghapus direktif local build context pada service dashboard-cms dan marketing-site di docker-compose.yml, beralih penuh ke Docker Hub registry image roxas0800/herocms-dashboard:latest dan roxas0800/herocms-marketing:latest untuk mempercepat deployment tanpa overhead kompilasi lokal.'
      }
    ]
  },
  {
    version: 'v1.3.5',
    releaseDate: '28 September 2026',
    title: 'Integrasi Traefik Edge Routing untuk MinIO S3 (minio.stackbyte.id)',
    summary: 'Menghubungkan container MinIO ke traefik_network dengan konfigurasi dynamic router label Traefik v3 untuk endpoint publik S3 (minio.stackbyte.id) dan MinIO Console (minio-console.stackbyte.id) tanpa ekspos port numerik.',
    badge: 'Stable',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-135-1',
        type: 'feature',
        scope: 'Traefik Edge & Ingress',
        description: 'Menerapkan dynamic routing Traefik v3 untuk MinIO S3 API (Port 9000) pada Host minio.stackbyte.id dan Web Console UI (Port 9001) pada Host minio-console.stackbyte.id tanpa membutuhkan port di URL.'
      },
      {
        id: 'c-135-2',
        type: 'improvement',
        scope: 'Environment & Docker Compose',
        description: 'Menghubungkan container herocms_minio ke bridge external traefik_network dan menyelaraskan S3_PUBLIC_URL default menjadi http://minio.stackbyte.id.'
      }
    ]
  },
  {
    version: 'v1.3.4',
    releaseDate: '28 September 2026',
    title: 'Pipeline CI/CD: GitHub Actions Otomatisasi Build & Push Docker Hub',
    summary: 'Menerapkan workflow GitHub Actions terenkripsi untuk otomatisasi kompilasi image Docker (dashboard-cms dan marketing-site) serta push ke Docker Hub menggunakan kredensial rahasia tersimpan.',
    badge: 'Stable',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-134-1',
        type: 'feature',
        scope: 'GitHub Actions CI/CD',
        description: 'Menambahkan workflow .github/workflows/docker-image.yml dengan strategi build matrix, caching layer GitHub Actions (GHA), serta integrasi aman DOCKERHUB_USERNAME dan DOCKERHUB_TOKEN via GitHub Repository Secrets.'
      }
    ]
  },
  {
    version: 'v1.3.3',
    releaseDate: '28 September 2026',
    title: 'Perbaikan Sanitasi Skema URL Clipboard & Pencegahan Duplikasi Protokol',
    summary: 'Memperbaiki helper copyToClipboard agar mendeteksi protokol URL dan URI scheme (http, https, s3) yang sudah ada dari environment, sehingga menyalin URL tidak lagi menghasilkan prefiks ganda seperti https://http://.',
    badge: 'Stable',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-133-1',
        type: 'bugfix',
        scope: 'Clipboard & URL Resolver',
        description: 'Menghilangkan penambahan protokol https:// secara paksa pada helper copyToClipboard. Skema URL yang sudah diawali http://, https://, atau s3:// disalin utuh apa adanya sesuai konfigurasi environment.'
      }
    ]
  },
  {
    version: 'v1.3.2',
    releaseDate: '28 September 2026',
    title: 'Transisi Data Aktual Media S3 & Penulisan Penggunaan Kuota Real-Time',
    summary: 'Menghapus seluruh berkas contoh/demo statis dari basis data dan repositori, beralih penuh ke data aktual customer, serta menghadirkan kalkulasi dan penulisan metrik kapasitas penyimpanan S3 secara real-time pada setiap unggahan dan penghapusan berkas.',
    badge: 'Stable',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-132-1',
        type: 'improvement',
        scope: 'Pembersihan Data Contoh / Mock',
        description: 'Menghapus seluruh entri mock media dari PostgreSQL, repository Go, dan inisialisasi frontend seeds. Mengarahkan modul Media Assets murni menampilkan berkas yang benar-benar diunggah oleh tenant.'
      },
      {
        id: 'c-132-2',
        type: 'feature',
        scope: 'Real-Time Storage Usage Telemetry',
        description: 'Menerapkan kalkulasi penggunaan kuota dinamis (recalculateStorage) di klien dan server: kapasitas S3 terpakai, kuota bebas (2.0 GB), persentase utilisasi, dan jumlah berkas langsung diperbarui saat berkas diunggah atau dihapus.'
      },
      {
        id: 'c-132-3',
        type: 'improvement',
        scope: 'Cache & Hydration Synchronization',
        description: 'Menyinkronkan status penyimpanan dan nama bucket ke dalam warmup bundle Redis serta cache lokal dashboard, mencegah keterlambatan pembacaan telemetri saat aplikasi dimuat ulang.'
      },
      {
        id: 'c-132-4',
        type: 'improvement',
        scope: 'Environment Templates (.env.example)',
        description: 'Menambahkan konfigurasi lengkap MinIO S3 Object Storage (S3_PORT, MINIO_CONSOLE_PORT, S3_ENDPOINT, S3_ACCESS_KEY, S3_SECRET_KEY, S3_BUCKET, S3_USE_SSL, S3_PUBLIC_URL) pada file template .env.example root dan dashboard-cms.'
      }
    ]
  },
  {
    version: 'v1.3.1',
    releaseDate: '28 September 2026',
    title: 'Desain Ulang Modal Media Inspector & Render Thumbnail Asli S3',
    summary: 'Merombak tampilan modal inspeksi berkas menjadi Media Inspector modern dengan hero visual viewport, render foto asli, grid telemetri 2x2, serta perapihan URL bar dengan tombol 1-klik salin dan buka tab baru.',
    badge: 'Stable',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-131-1',
        type: 'improvement',
        scope: 'Media Inspector Modal UI',
        description: 'Merombak modal preview berkas (.modal-dialog-media-inspector): menampilkan foto nyata langsung di viewport kanvas dengan background studio, grid telemetri spesifikasi 2x2, dan bilah salin URL/URI S3 tanpa pemotongan teks.'
      },
      {
        id: 'c-131-2',
        type: 'improvement',
        scope: 'Galeri Media Assets',
        description: 'Menampilkan thumbnail foto nyata pada kartu galeri berkas gambar (JPG, PNG, WebP, AVIF) menggantikan placeholder grafis statis.'
      },
      {
        id: 'c-131-3',
        type: 'bugfix',
        scope: 'URL Resolver S3',
        description: 'Membersihkan duplikasi prefiks bucket pada resolusi storageURL di storage layer MinIO sehingga URL langsung merujuk ke bucket tenant secara presisi.'
      }
    ]
  },
  {
    version: 'v1.3.0',
    releaseDate: '28 September 2026',
    title: 'Multi-Tenant S3 Bucket Isolation, Kuota Hard Limit 2 GB & Pertahanan Siber Media Assets',
    summary: 'Menerapkan arsitektur segregasi S3 bucket mandiri per customer (1 tenant = 1 dedicated bucket), penegakan kuota penyimpanan 2.0 GB server-side, magic bytes content sniffing, whitelist tipe berkas aman, dan telemetri kuota dinamis.',
    badge: 'Stable',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-130-1',
        type: 'feature',
        scope: 'Multi-Tenant S3 Bucket Engine',
        description: 'Menerapkan segregasi fisik S3 di mana setiap tenant memiliki dedicated bucket MinIO mandiri (tenant-<id>-media) dengan lazy auto-provisioning dan scoped public-read policy.'
      },
      {
        id: 'c-130-2',
        type: 'security',
        scope: 'File Upload & Anti-Malware Sniffing',
        description: 'Menambahkan deteksi magic bytes (512 bytes awal), whitelist ketat (Gambar, PDF, CSV, XLSX, DOCX, TXT), dan pemblokiran total executable/skrip berbahaya (.exe, .sh, .php, .js).'
      },
      {
        id: 'c-130-3',
        type: 'feature',
        scope: 'Storage Quota Enforcer (2 GB)',
        description: 'Penegakan batas kuota penyimpanan 2.0 GB per akun customer di backend Go dengan penolakan HTTP 413 dan visual gauge telemetri real-time di UI Media Assets.'
      }
    ]
  },
  {
    version: 'v1.2.7',
    releaseDate: '28 September 2026',
    title: 'Modernisasi Image MinIO S3 & Penataan Port Orkestrasi Database Lokal',
    summary: 'Memperbarui image container MinIO S3 ke image resmi Chainguard (cgr.dev/chainguard/minio) untuk mengatasi deprecation image lama di Docker Hub/Quay, serta menata mapping port agar tidak bentrok dengan Portainer.',
    badge: 'Stable',
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-127-1',
        type: 'bugfix',
        scope: 'Infrastruktur MinIO S3',
        description: 'Memperbarui image MinIO S3 pada docker-compose.db.yml dan docker-compose.yml menggunakan cgr.dev/chainguard/minio:latest dan menyesuaikan healthcheck tanpa utilitas mc.'
      },
      {
        id: 'c-127-2',
        type: 'improvement',
        scope: 'Local Docker Environment',
        description: 'Menyesuaikan alokasi port Portainer (HTTP: 9002, HTTPS: 9443) agar port 9000 bersih dan dapat digunakan secara optimal oleh MinIO S3 API.'
      }
    ]
  },
  {
    version: 'v1.2.6',
    releaseDate: '22 September 2026',
    title: 'Integrasi MinIO S3 Object Storage untuk Media Assets & Refinement Command Search Bar',
    summary: 'Mengaktifkan arsitektur MinIO S3 Object Storage asli untuk menu Media Assets (S3) lengkap dengan konfigurasi Docker Compose, S3 client Go (minio-go/v7), endpoint upload multipart & delete, serta perampingan visual Search Command Bar di seluruh modul dashboard.',
    badge: 'Stable',
    author: 'HeroCMS Core Architecture Team',
    items: [
      {
        id: 'c-126-1',
        type: 'feature',
        scope: 'Infrastruktur MinIO S3',
        description: 'Menambahkan container MinIO S3 dan volume data pada docker-compose.db.yml dan docker-compose.yml (port 9000 untuk S3 API dan port 9001 untuk Web Console), lengkap dengan konfigurasi kredensial dan bucket herocms-media.'
      },
      {
        id: 'c-126-2',
        type: 'feature',
        scope: 'Backend Golang Storage Layer',
        description: 'Menerapkan package resmi minio-go/v7 dalam storage.S3Client dengan auto-create bucket dan policy public-read, penambahan CreateAsset dan DeleteAsset di repository, serta endpoint POST /api/assets/upload dan DELETE /api/assets/:id.'
      },
      {
        id: 'c-126-3',
        type: 'feature',
        scope: 'Frontend Media Assets (S3)',
        description: 'Menghubungkan unggahan berkas nyata (FormData multipart) dan penghapusan aset via apiClient.ts dan useDashboardData.ts, dilengkapi indikator loading spinner saat upload, tombol hapus di hover kartu, dan tombol hapus di modal preview berkas.'
      },
      {
        id: 'c-126-4',
        type: 'improvement',
        scope: 'Sistem Pencarian Command Bar',
        description: 'Merampingkan CSS .search-command-shell pada studio-master.css menjadi satu kontainer modern (tinggi 38px, border-radius 9px, focus ring 2px halus) di modul Situs & Kontainer, Media Assets, Katalog Template, dan Changelog, dilengkapi tombol clear X dan shortcut ⌘K.'
      }
    ]
  },
  {
    version: 'v1.2.5',
    releaseDate: '22 September 2026',
    title: 'Restorasi Arsitektur Kartu Kontainer & Kompatibilitas Studio Master CSS',
    summary: 'Memperbaiki tata letak kartu kontainer yang sempat berantakan akibat mismatch class HTML. Mengembalikan struktur markup visual studio resmi yang terhubung dengan studio-master.css (radar status chip, subdomain URL box, dual resource gauges, dan action control bar).',
    badge: 'Stable',
    author: 'HeroCMS Core Architecture Team',
    items: [
      {
        id: 'c-125-1',
        type: 'bugfix',
        scope: 'Situs & Kontainer UI',
        description: 'Mengembalikan struktur markup kartu .pro-site-card ke standar studio-master.css, memulihkan radar status pill bengan animasi ping, kotak tautan subdomain terpadu, pengukur alokasi CPU & RAM dengan track gradient, serta bar tombol kontrol runtime Docker.'
      }
    ]
  },
  {
    version: 'v1.2.4',
    releaseDate: '22 September 2026',
    title: 'Penyelarasan Desain Toolbar & Searchbar, Perbaikan CSS Billing, dan Validasi Runtime Kontainer',
    summary: 'Penyelarasan visual dan fungsional pada sistem pencarian antar modul: integrasi command bar ⌘K terpadu dengan segmented pill filter, styling tombol Upgrade Paket langganan, perbaikan search query kontainer dan template, serta pembersihan card specs telemetri.',
    badge: 'Stable',
    author: 'HeroCMS Core Architecture Team',
    items: [
      {
        id: 'c-124-1',
        type: 'bugfix',
        scope: 'Kapasitas & Paket Langganan',
        description: 'Menambahkan rule CSS .btn-upgrade-action pada studio-master.css sehingga tombol Upgrade / Ganti Paket memiliki visual Deep Slate dan efek hover Royal Blue yang elegan.'
      },
      {
        id: 'c-124-2',
        type: 'improvement',
        scope: 'Changelog & Toolbar',
        description: 'Merestrukturisasi toolbar ChangelogModule menjadi layout 1 baris modern (.filter-toolbar) yang menyatukan search command bar dengan tombol filter jenis perubahan (segmented-pill).'
      },
      {
        id: 'c-124-3',
        type: 'bugfix',
        scope: 'Pencarian & Kontainer',
        description: 'Memperbaiki logika filter pencarian pada Situs & Kontainer dan Katalog Template agar responsif terhadap kata kunci multi-field, dilengkapi shortcut ⌘K dan empty state action.'
      },
      {
        id: 'c-124-4',
        type: 'improvement',
        scope: 'Runtime & TypeScript',
        description: 'Menyelaraskan properti telemetry card specs pada ContainersModule dan filteredContainers di useDashboardData dengan interface ContainerSite yang valid.'
      }
    ]
  },
  {
    version: 'v1.2.3',
    releaseDate: '22 September 2026',
    title: 'Perbaikan Total Pusat Bantuan, Siklus Tiket & Sinkronisasi DB/Redis',
    summary: 'Restorasi menyeluruh pada modul tiket support: integrasi penuh API backend (Create, Reply, Resolve), proteksi null-safety pesan, normalisasi status/prioritas, dan identitas author tenant dinamis.',
    badge: 'Stable',
    author: 'HeroCMS Core Architecture Team',
    items: [
      {
        id: 'c-123-1',
        type: 'bugfix',
        scope: 'Pusat Bantuan & Tiket',
        description: 'Menambahkan fungsi normalisasi data (normalizeTicket) untuk mencegah runtime exception ketika daftar tiket dimuat dari Redis / backend tanpa array pesan.'
      },
      {
        id: 'c-123-2',
        type: 'feature',
        scope: 'Backend API & DB',
        description: 'Mengimplementasikan endpoint penuh POST /tickets, POST /tickets/:id/messages, dan PUT /tickets/:id/resolve dengan persistensi PostgreSQL dan cache invalidation Redis.'
      },
      {
        id: 'c-123-3',
        type: 'improvement',
        scope: 'Identitas Tenant',
        description: 'Menggantikan authorName hardcoded dengan identitas akun aktif (getTenantAuthor) yang sinkron dengan email tenant login saat membuat tiket atau membalas pesan.'
      },
      {
        id: 'c-123-4',
        type: 'improvement',
        scope: 'UI / UX & Keyboard',
        description: 'Dukungan pintasan keyboard Cmd+Enter (macOS) dan Ctrl+Enter untuk pengiriman balasan instan, auto-scroll thread, serta proteksi fallback status L2 assigned.'
      }
    ]
  },
  {
    version: 'v1.2.2',
    releaseDate: '22 September 2026',
    title: 'Sesi Logout Terpadu, Auto-Invalidation Cache & Standar Changelog',
    summary: 'Pembaruan krusial pada penanganan siklus logout sesi multi-user, auto-purge service worker usang, dan integrasi modul catatan rilis sistem.',
    badge: 'Stable',
    author: 'HeroCMS Core Architecture Team',
    items: [
      {
        id: 'c-122-1',
        type: 'bugfix',
        scope: 'Auth & Redis',
        description: 'Memusnahkan sesi Redis (DeleteSession) dan menghapus cookie herocms_session serta CSRF saat logout via API /api/auth/logout.'
      },
      {
        id: 'c-122-2',
        type: 'bugfix',
        scope: 'State Management',
        description: 'Implementasi resetDashboardState() yang membersihkan seluruh singleton reactive ref dan cache lokal saat user berganti akun.'
      },
      {
        id: 'c-122-3',
        type: 'security',
        scope: 'Middleware',
        description: 'Memprioritaskan Authorization Bearer token di atas session cookie lama pada middleware SessionOrJWTAuth.'
      },
      {
        id: 'c-122-4',
        type: 'performance',
        scope: 'Cache Invalidation',
        description: 'Menonaktifkan service worker agresif dan menambahkan header anti-cache pada index.html sehingga update CSS/JS langsung aktif tanpa perlu CTRL + SHIFT + R.'
      },
      {
        id: 'c-122-5',
        type: 'feature',
        scope: 'Changelog',
        description: 'Penambahan menu Changelog & Rilis terpadu pada dashboard tenant serta standarisasi Semantic Versioning bagi AI Agent di AGENTS.md.'
      }
    ]
  },
  {
    version: 'v1.2.1',
    releaseDate: '22 September 2026',
    title: 'Hardware-Accelerated Smooth Scrolling 120 FPS & Dock Optimization',
    summary: 'Menghilangkan lagging pada panel kiri editor visual dan menyelaraskan smooth scrolling di seluruh 11 menu dashboard.',
    badge: 'Stable',
    author: 'HeroCMS Frontend Team',
    items: [
      {
        id: 'c-121-1',
        type: 'bugfix',
        scope: 'Visual Editor',
        description: 'Menghapus event listener pembajak wheel JS (onDockTabWheel) yang menyebabkan lagging parah pada trackpad MacBook.'
      },
      {
        id: 'c-121-2',
        type: 'performance',
        scope: 'CSS Master',
        description: 'Menghapus scroll-behavior: smooth dari universal selector * dan membatasinya hanya pada root html dengan fallback prefers-reduced-motion.'
      },
      {
        id: 'c-121-3',
        type: 'performance',
        scope: 'GPU Compositing',
        description: 'Menambahkan transform: translateZ(0) pada dock-tab-body dan contain: content pada visual-wireframe-card untuk rendering 120 FPS mulus.'
      },
      {
        id: 'c-121-4',
        type: 'improvement',
        scope: 'Navigation',
        description: 'Menambahkan watcher activeMenu di DashboardView.vue untuk auto smooth scroll kembali ke atas saat berpindah antar menu.'
      }
    ]
  },
  {
    version: 'v1.2.0',
    releaseDate: '21 September 2026',
    title: 'Canva-Style Block Wireframes & Carousel Chip Navigasi',
    summary: 'Peningkatan besar pada pengalaman memilih komponen visual di editor dengan wireframe interaktif dan navigasi kategori horizontal.',
    badge: 'Stable',
    author: 'HeroCMS Studio Design Team',
    items: [
      {
        id: 'c-120-1',
        type: 'feature',
        scope: 'Visual Editor',
        description: 'Tampilan wireframe visual preview mini untuk setiap kartu komponen di katalog blok (Navbar, Hero, Bento Grid, Progress Bar).'
      },
      {
        id: 'c-120-2',
        type: 'feature',
        scope: 'Visual Editor',
        description: 'Tombol navigasi panah kiri & kanan carousel chip kategori dengan indikator visual state.'
      },
      {
        id: 'c-120-3',
        type: 'improvement',
        scope: 'UI / UX',
        description: 'Penyelarasan floating toolbar editor agar tetap terlihat jelas pada blok teratas tanpa tertutup header.'
      }
    ]
  },
  {
    version: 'v1.1.0',
    releaseDate: '20 September 2026',
    title: 'Support Ticketing Module & Real-Time Reader Mode',
    summary: 'Peluncuran modul bantuan DevOps 24/7 dan mode baca artikel minim gangguan.',
    author: 'HeroCMS Support & Publishing Team',
    items: [
      {
        id: 'c-110-1',
        type: 'feature',
        scope: 'Tickets',
        description: 'Sistem tiket support multi-level dengan SLA counter, badge prioritas, dan percakapan interaktif dua arah.'
      },
      {
        id: 'c-110-2',
        type: 'feature',
        scope: 'Articles',
        description: 'Distraction-free Reader View dengan auto-hide sidebar, kalkulator waktu baca, dan navigasi artikel sebelum/sesudah.'
      },
      {
        id: 'c-110-3',
        type: 'improvement',
        scope: 'Performance',
        description: 'Code-splitting modul antarmuka menggunakan defineAsyncComponent untuk menjaga initial bundle di bawah 70 kB.'
      }
    ]
  },
  {
    version: 'v1.0.0',
    releaseDate: '18 September 2026',
    title: 'Peluncuran Perdana HeroCMS Studio Enterprise Cloud',
    summary: 'Rilis fondasi utama platform CMS cloud multi-tenant dengan isolasi kontainer Docker dan Traefik edge proxy.',
    badge: 'LTS',
    author: 'HeroCMS Engineering',
    items: [
      {
        id: 'c-100-1',
        type: 'feature',
        scope: 'Core Hub',
        description: 'Penyediaan kontainer mandiri berbasis cgroups Linux dengan alokasi vCPU, RAM, dan SSD transparan.'
      },
      {
        id: 'c-100-2',
        type: 'security',
        scope: 'Database & Auth',
        description: 'Row-Level Security (RLS) PostgreSQL 16 multi-tenant dan proteksi CSRF Double Submit Cookie.'
      },
      {
        id: 'c-100-3',
        type: 'feature',
        scope: 'Telemetry & Cache',
        description: 'Integrasi Redis 7 untuk rate limiting 120 req/menit, ZSET hit counter artikel, dan Traefik v3 proxy routing.'
      }
    ]
  }
];
