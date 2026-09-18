# Panduan Presentasi Alur Infrastruktur & Arsitektur Platform CMS

Dokumen ini dirancang sebagai panduan presentasi kepada rekan tim atau penguji. Di dalamnya terdapat diagram visual arsitektur beserta poin-poin penjelasan (*talking points*) untuk setiap lapisan sistem.

---

## 🖼️ Diagram Alur Infrastruktur (Enterprise Architecture)

![Diagram Alur Infrastruktur Multi-Tenant Cloud CMS](file:///home/rizal/dockerfile/docker-cms/docs/assets/infra_flow_diagram.jpg)

---

## 🎤 Skrip & Poin Presentasi Langkah-demi-Langkah

Gunakan urutan penjelasan berikut saat mendemonstrasikan diagram kepada audiens:

### 1. Lapisan Terluar: Pengunjung & DNS (`Public Internet & Visitors`)
* **Poin Penjelasan:**
  - *"Sistem kita melayani tiga jenis pengunjung: pengunjung umum yang melihat portofolio/blog, pelanggan (tenant) yang mengelola konten, dan tim internal/superadmin."*
  - *"Semua lalu lintas pertama kali disaring melalui **Cloudflare (WAF & CDN)** untuk menangkal serangan DDoS dan mempercepat aset statis di tingkat global melalui DNS."*

---

### 2. Lapisan Pintu Masuk: Ingress & Reverse Proxy (`Traefik v3 Edge Proxy`)
* **Poin Penjelasan:**
  - *"Di pintu gerbang server, kita menggunakan **Traefik v3** sebagai Edge Reverse Proxy."*
  - *"Keunggulan utama Traefik adalah integrasi langsungnya dengan Docker daemon dan fitur **Auto SSL Let's Encrypt**. Artinya, setiap kali ada pelanggan yang mendaftarkan domain baru atau custom domain, sertifikat HTTPS/SSL akan terbit secara otomatis tanpa kita perlu menyentuh server atau me-restart proxy."*

---

### 3. Lapisan Aplikasi Pengguna (`Applications`)
* **Poin Penjelasan:**
  - *"Di lapisan ini terdapat 3 frontend yang disesuaikan dengan kebutuhan beban kerjanya:"*
    1. **Website Promosi (React + TypeScript):** Bertujuan untuk pemasaran publik dan konversi pendaftaran dengan performa SEO tinggi dan fitur *Interactive Playground*.
    2. **Dashboard CMS (Vue 3 + Vite):** Panel studio interaktif tempat pelanggan mengatur konten, mendesain tampilan secara visual, dan berinteraksi dengan asisten AI.
    3. **Admin Console (Laravel 11):** Panel SuperAdmin internal untuk tim operasional mengawasi kesehatan server, status pembayaran langganan, dan penggunaan kuota memori tenant.

---

### 4. Lapisan Microservice Inti (`Core Microservices`)
* **Poin Penjelasan:**
  - *"Di balik layar, terdapat dua backend service berkecepatan tinggi yang dibangun menggunakan **Golang**:"*
    1. **Go Provisioning Orchestrator:** Bertindak sebagai 'pabrik' kontainer. Service ini berbicara langsung dengan **Docker Engine API** via socket sistem. Saat pelanggan menekan tombol 'Terbitkan', orchestrator inilah yang membuat kontainer baru, mengatur isolasi memori/CPU, dan mendaftarkan routing-nya ke Traefik.
    2. **Go AI Agent Service:** Bertanggung jawab atas kecerdasan buatan. Menggabungkan model LLM untuk membuat palet tema JSON dari teks, mengolah data ranking artikel terpopuler (*Top Views*), dan menggerakkan otomatisasi media sosial melalui alur kerja **n8n**.

---

### 5. Lapisan Eksekusi Dinamis (`Isolated Tenant Docker Containers Fleet`)
* **Poin Penjelasan:**
  - *"Ini adalah keunggulan utama arsitektur kita: **Setiap website pelanggan berjalan di dalam kontainer Docker terisolasi sendiri (Vue 3 SSR / Alpine Nginx)**."*
  - *"Mengapa model ini unggul dibanding CMS tradisional?"*
    - **Aman (Sandboxed):** Kontainer berjalan tanpa hak root (`UID 10001`), filesystem-nya read-only, dan dibatasi maksimal 0.5 CPU serta 256MB RAM (`cgroups`). Jadi jika ada satu website diserang, website pelanggan lain tetap 100% aman dan tidak terpengaruh.
    - **Zero-Downtime Blue/Green Deployment:** Saat pemilik website memperbarui konten, sistem menyalakan kontainer versi baru terlebih dahulu, memastikan statusnya sehat, baru kemudian mengalihkan trafik. Tidak ada momen website 'down' saat update.

---

### 6. Lapisan Infrastruktur Data & Event (`Data Infrastructure`)
* **Poin Penjelasan:**
  - *"Untuk menopang performa tinggi, kita membagi tugas penyimpanan data secara spesifik:"*
    1. **PostgreSQL 16:** Database relasional utama untuk data pengguna dan konten situs, dilindungi oleh **Row-Level Security (RLS)** agar data antar-tenant tidak pernah bocor.
    2. **Redis 7:** Menangani caching sesi cepat dan kalkulasi peringkat **Top Views** menggunakan struktur data *Sorted Sets* sehingga data artikel terpopuler bisa ditarik dalam waktu kurang dari 1 milidetik.
    3. **Kafka / Redpanda:** Event bus pengumpul jutaan data klik dan kunjungan halaman (*telemetry*) tanpa membebani database utama.
    4. **MinIO (S3 Storage):** Penyimpanan aset media (gambar, logo, PDF portofolio) dengan teknologi *presigned URL* langsung dari browser pelanggan.

---

## 💡 Ringkasan Nilai Jual untuk Audiens
1. **Otonom & Modern:** Mengubah proses devops yang rumit menjadi otomatis sekali klik.
2. **Keamanan Setara Perusahaan Global:** Menerapkan standar isolasi kontainer modern seperti yang digunakan di Fly.io dan Ghost Pro.
3. **Didukung AI:** Bukan sekadar CMS biasa, tetapi memiliki kecerdasan generatif tema dan analitik real-time.
