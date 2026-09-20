# HeroCMS Platform - Universal Frontend & Architecture Standards

Dokumen standar arsitektur, konsistensi tema, performa, dan konvensi pengembangan kode untuk **seluruh layanan dan aplikasi frontend** di repositori HeroCMS (`services/02-dashboard-cms`, `services/04-marketing-site`, serta layanan baru di masa mendatang). Setiap AI agent maupun developer yang bekerja di repositori ini **WAJIB** mematuhi standar berikut:

---

## 1. Lingkup Berlaku Universal (All Frontend Services)
Aturan ini tidak hanya berlaku untuk Dashboard CMS, tetapi berlaku untuk **seluruh aplikasi web, landing page, dan modul frontend** di HeroCMS monorepo:
- `services/02-dashboard-cms`
- `services/04-marketing-site`
- Layanan web / dashboard baru berikutnya.

---

## 2. Konsistensi Tema Visual (Obsidian Slate + Electric Cyan)
- **Tema Gelap Mutlak**: Seluruh menu, modal dialog, formulir input, tabel data, dan halaman baru **HARUS** menggunakan tema resmi **Obsidian Slate + Electric Cyan**. DILARANG menggunakan palet terang/putih biasa atau warna bawaan browser (*no unthemed light mode*).
- **Palet Warna Resmi**:
  - **Canvas & Background**: Deep Obsidian `#0b0f19`, Surface Card `#0e1526`, Elevated Surface `#141d33` / `#161f38`.
  - **Aksen & Gradasi Utama**: Electric Cyan `#00f2fe` ke Royal Azure `#4facfe` (`linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)`).
  - **Garis Batas (Borders)**: Halus semi-transparan `rgba(255, 255, 255, 0.08)` atau `#1e293b`.
  - **Indikator & Badges Status**:
    - Sukses / Aktif / Published: Emerald (`#10b981`, bg: `rgba(16, 185, 129, 0.12)`)
    - Menunggu / Draft / Warning: Amber (`#f59e0b`, bg: `rgba(245, 158, 11, 0.12)`)
    - Error / Kritis / Dihapus: Rose (`#f43f5e`, bg: `rgba(244, 63, 94, 0.12)`)
    - Info / Netral: Electric Cyan / Sky (`#38bdf8`, bg: `rgba(56, 189, 248, 0.12)`)
- **Efek Interaksi**: Tombol dan kartu interaktif harus memiliki hover glow halus, transisi mulus (`transition: all 0.2s ease`), dan radius sudut konsisten (`border-radius: 12px` untuk kartu, `8px`–`10px` untuk tombol dan input).

---

## 3. Arsitektur Master CSS Terpusat (`src/assets/studio-master.css`)
- **Induk CSS Bersama**: Seluruh styling bersama, sistem grid, tipografi, tombol (`.btn-primary-gradient`, `.btn-outline-action`), kartu telemetri (`.stats-overview-grid`, `.telemetry-card`), tabel data (`.ledger-table`, `.pro-table`), bar pencarian (`.search-box`), tab segmen (`.year-toggle-group`), badges status, dan sistem modal dialog (`.modal-backdrop`, `.modal-dialog`) **HARUS** berada di master CSS terpusat.
- **Zero-CSS New Menu/Feature Creation**: Saat membuat menu atau fitur baru, manfaatkan class yang sudah tersedia di master CSS. DILARANG membuat duplikasi CSS untuk elemen-elemen yang sudah ada.
- **Bespoke Scoped Styles Only**: Tag `<style scoped>` di komponen `.vue` hanya diperbolehkan jika ada kebutuhan visual yang benar-benar spesifik/unik untuk komponen tersebut (contoh: kertas faktur fisik `.invoice-paper`, cover reader mode artikel).

---

## 4. Pemisahan Data Statis & Mock Seeds (`src/assets/*.ts`)
- **No Heavy Static Arrays in `.vue` or Logic Composables**: Dilarang menaruh ratusan baris data statis, seed mock arrays, generator mockups, daftar font, palet warna, atau konstanta template di dalam file Single File Component (`.vue`) maupun composables logika.
- **Isolasi Modul Aset**: Pindahkan konstanta, seed awal, dan generator statis ke dalam file TypeScript terpisah di `src/assets/` (seperti [`src/assets/dashboard-seeds.ts`](file:///home/rizal/dockerfile/docker-cms/services/02-dashboard-cms/src/assets/dashboard-seeds.ts) dan [`src/assets/editor-presets.ts`](file:///home/rizal/dockerfile/docker-cms/services/02-dashboard-cms/src/assets/editor-presets.ts)) lalu diimpor secara modular.
- **Tujuan**: Menjaga file `.vue` dan composable tetap ramping (<500 baris jika memungkinkan) agar pemindaian IDE (Volar/VS Code Language Server) instan, konsumsi RAM hemat, dan hot-reloading (HMR) tidak lag.

---

## 5. Standar UX & Tata Letak Halaman (Artikel, Halaman, dan Reader Mode)
- **Tata Letak Bersih 2 Baris (2 Rows)**:
  - **Baris 1 (Aksi & Filter)**: Judul modul, bar pencarian interaktif terpadu (`.search-box`), dan tab penyaring tahun/kategori (`.year-toggle-group`).
  - **Baris 2 (Data Display)**: Grid telemetri metrik dan tabel data (`.ledger-table`).
- **Mode Baca / Reader View (Contoh: "Artikel & Halaman CMS -> Judul")**:
  - **Navigasi Tunggal di Atas**: Hanya gunakan satu header navigasi ringkas di bagian atas dengan tombol Kembali (**Back**) yang jelas. Dilarang membuat tombol navigasi atau toolbar ganda yang membingungkan.
  - **Distraction-Free / Focus Reading**: Saat mode pembaca dibuka, sembunyikan atau minimalkan menu sidebar (*hidden/collapsed*) agar area baca lapang dan pengguna fokus membaca konten.
  - **Estetika Konten**: Tampilan artikel di reader mode harus menyatu dengan tema Obsidian Dark, memiliki kover hero yang elegan, metadata penulis & tanggal terstruktur, serta tipografi paragraf yang nyaman di mata.

---

## 6. Lazy Loading Modul Antar-Menu (`defineAsyncComponent`)
- **On-Demand Chunking**: Di view induk seperti [`DashboardView.vue`](file:///home/rizal/dockerfile/docker-cms/services/02-dashboard-cms/src/views/DashboardView.vue), semua modul menu **WAJIB** dimuat menggunakan `defineAsyncComponent`:
  ```typescript
  const MenuModule = defineAsyncComponent(() => import('../components/dashboard/MenuModule.vue'));
  ```
- **Dampak**: Initial bundle JS hanya berkisar ~67 kB. Pengguna hanya mendownload kode modul saat menu tersebut aktif diklik.

---

## 7. Vendor Code-Splitting & Long-Term Caching
- **Manual Chunks**: Pertahankan pemisahan vendor di `vite.config.ts`:
  ```typescript
  manualChunks: {
    'vue-vendor': ['vue', 'vue-router', 'pinia'],
    'lucide-icons': ['lucide-vue-next']
  }
  ```
- **HTTP Caching**: File server (Go backend / Traefik) menyajikan static assets ter-hash (`/assets/*`) dengan header:
  ```http
  Cache-Control: public, max-age=31536000, immutable
  ```
  agar browser dapat melakukan cache permanen tanpa mengunduh ulang aset yang tidak berubah.
