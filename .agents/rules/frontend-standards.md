---
description: HeroCMS Frontend & Dashboard Architecture Standards
globs: services/02-dashboard-cms/**
---

# HeroCMS Studio - Frontend Architecture & Coding Standards

Dokumen standar arsitektur, konsistensi tema, dan konvensi pengembangan frontend untuk HeroCMS Studio (`services/02-dashboard-cms`). Setiap AI agent maupun developer yang bekerja di repositori ini **WAJIB** mematuhi standar berikut:

---

## 1. Konsistensi Tema Visual (Obsidian Slate + Electric Cyan)
- **Tema Gelap Mutlak**: Seluruh menu, modal dialog, formulir input, tabel, dan halaman baru **HARUS** menggunakan tema resmi **Obsidian Slate + Electric Cyan**. DILARANG menggunakan palet terang/putih biasa atau warna bawaan browser.
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

## 2. Arsitektur Master CSS Terpusat (`src/assets/studio-master.css`)
- **Induk CSS Seluruh Menu**: Seluruh styling bersama, sistem grid, tipografi, tombol (`.btn-primary-gradient`, `.btn-outline-action`), kartu telemetri (`.stats-overview-grid`, `.telemetry-card`), tabel data (`.ledger-table`, `.pro-table`), bar pencarian (`.search-box`), tab segmen (`.year-toggle-group`), badges status, dan sistem modal dialog (`.modal-backdrop`, `.modal-dialog`) **HARUS** berada di [`services/02-dashboard-cms/src/assets/studio-master.css`](file:///home/rizal/dockerfile/docker-cms/services/02-dashboard-cms/src/assets/studio-master.css).
- **Zero-CSS New Menu Creation**: Saat membuat menu atau fitur baru, gunakan class yang sudah tersedia di `studio-master.css`. DILARANG membuat CSS duplikat untuk elemen-elemen yang sudah ada di master CSS.
- **Bespoke Scoped Styles Only**: Tag `<style scoped>` di komponen `.vue` hanya diperbolehkan jika ada kebutuhan visual yang benar-benar spesifik/unik untuk komponen tersebut (contoh: kertas faktur fisik `.invoice-paper`, cover reader mode artikel).

---

## 3. Standar UX & Tata Letak Halaman (Artikel, Halaman, dan Reader Mode)
- **Tata Letak Bersih 2 Baris (2 Rows)**:
  - **Baris 1 (Aksi & Filter)**: Judul modul, bar pencarian interaktif terpadu (`.search-box`), dan tab penyaring tahun/kategori (`.year-toggle-group`).
  - **Baris 2 (Data Display)**: Grid telemetri metrik dan tabel data (`.ledger-table`).
- **Mode Baca / Reader View (Contoh: "Artikel & Halaman CMS -> Judul")**:
  - **Navigasi Tunggal di Atas**: Hanya gunakan satu header navigasi ringkas di bagian atas dengan tombol Kembali (**Back**) yang jelas. Dilarang membuat tombol navigasi atau toolbar ganda yang membingungkan.
  - **Distraction-Free / Focus Reading**: Saat mode pembaca dibuka, sembunyikan atau minimalkan menu sidebar (*hidden/collapsed*) agar area baca lapang dan pengguna fokus membaca konten.
  - **Estetika Konten**: Tampilan artikel di reader mode harus menyatu dengan tema Obsidian Dark, memiliki kover hero yang elegan, metadata penulis & tanggal terstruktur, serta tipografi paragraf yang nyaman di mata.

---

## 4. Pemisahan Data & Preset JS Statis (`src/assets/*.ts`)
- **No Heavy Static Arrays in `.vue`**: Dilarang menaruh ribuan baris data statis, generator mockups, daftar font, palet warna, atau konstanta template di dalam file Single File Component (`.vue`).
- **Isolasi Modul Aset**: Pindahkan konstanta dan generator statis ke dalam file TypeScript terpisah di `src/assets/` (seperti [`src/assets/editor-presets.ts`](file:///home/rizal/dockerfile/docker-cms/services/02-dashboard-cms/src/assets/editor-presets.ts)) lalu diimpor secara modular.
- **Tujuan**: Menjaga file `.vue` tetap ramping (di bawah 500 baris) agar pemindaian IDE (Volar/VS Code) instan, konsumsi memori hemat, dan hot-reloading (HMR) tidak lag.

---

## 5. Lazy Loading Modul Antar-Menu (`defineAsyncComponent`)
- **On-Demand Chunking**: Di [`DashboardView.vue`](file:///home/rizal/dockerfile/docker-cms/services/02-dashboard-cms/src/views/DashboardView.vue), semua modul menu **WAJIB** dimuat menggunakan `defineAsyncComponent`:
  ```typescript
  const MenuModule = defineAsyncComponent(() => import('../components/dashboard/MenuModule.vue'));
  ```
- **Dampak**: Initial bundle JS hanya berkisar ~67 kB. Pengguna hanya mendownload kode modul saat menu tersebut aktif diklik.

---

## 6. Vendor Code-Splitting di `vite.config.ts`
- **Manual Chunks**: Pertahankan pemisahan vendor di `vite.config.ts`:
  ```typescript
  manualChunks: {
    'vue-vendor': ['vue', 'vue-router', 'pinia'],
    'lucide-icons': ['lucide-vue-next']
  }
  ```
- **Dampak**: Library inti di-cache secara permanen oleh browser (*long-term HTTP caching*).
