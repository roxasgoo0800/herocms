# HeroCMS Platform - Universal Frontend & Architecture Standards

Dokumen standar arsitektur, konsistensi tema, performa, dan konvensi pengembangan kode untuk **seluruh layanan dan aplikasi frontend** di repositori HeroCMS (`services/02-dashboard-cms`, `services/04-marketing-site`, serta layanan baru di masa mendatang). Setiap AI agent maupun developer yang bekerja di repositori ini **WAJIB** mematuhi standar berikut:

---

## 1. Lingkup Berlaku Universal (All Frontend Services)
Aturan ini berlaku untuk **seluruh aplikasi web, landing page, dan modul frontend** di HeroCMS monorepo:
- `services/02-dashboard-cms`
- `services/04-marketing-site`
- Layanan web / dashboard baru berikutnya.

---

## 2. Konsistensi Tema Visual (HeroCMS Studio - Bespoke Enterprise Design System)
- **Karakter Visual Utama**: Mengikuti tema resmi HeroCMS Studio yang tercantum di [`DESIGN.md`](file:///home/rizal/dockerfile/docker-cms/DESIGN.md) dan arsitektur visual di [`src/assets/studio-master.css`](file:///home/rizal/dockerfile/docker-cms/services/02-dashboard-cms/src/assets/studio-master.css) & [`src/assets/studio-animations.css`](file:///home/rizal/dockerfile/docker-cms/services/02-dashboard-cms/src/assets/studio-animations.css).
- **Palet Warna Resmi**:
  - **Canvas & Background**: Pure White `#ffffff` dan Slate Canvas `#f8fafc` dengan pola *ambient dot grid* (`radial-gradient(#cbd5e1 1.2px, transparent 1.2px)`).
  - **Surfaces & Cards**: Pure White `#ffffff` dengan garis batas tipis halus `#e2e8f0` / `#e4e4e7` dan bayangan lembut (`box-shadow: 0 1px 3px rgba(15, 23, 42, 0.05)`).
  - **Aksi Primer & Anchors**: Deep Slate `#0f172a` / `#09090b` untuk tombol CTA utama, menu aktif, dan brand glyph.
  - **Aksen Biru & Gradasi**: Royal Blue (`linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)`) untuk wordmark brand, tautan, progress kuota, dan ring fokus.
  - **Sidebar & Top Bar**: Frosted glassmorphic white (`rgba(255, 255, 255, 0.96)`, `backdrop-filter: blur(20px)`).
  - **Badges Status Semantic**:
    - Running / Aktif / Published: Emerald (`#059669` / `#10b981`, bg: `#ecfdf5`, border: `#d1fae5`)
    - Menunggu / Draft / Standby: Amber (`#b45309`, bg: `#fffbeb`, border: `#fde68a`)
    - Error / Kritis / Dihapus: Red (`#ef4444`, bg: `#fef2f2`, border: `#fecaca`)
    - Info / Netral: Royal Blue / Sky (`#2563eb`, bg: `#eff6ff`, border: `#bfdbfe`)
- **Konsistensi Radius**: `border-radius: 12px`–`14px` untuk kartu dan modal, `8px` untuk tombol dan input form.

---

## 3. Arsitektur Master CSS Terpusat (`src/assets/studio-master.css`)
- **Induk CSS Bersama**: Seluruh styling bersama, sistem grid, tipografi, tombol (`.btn-top-create`, `.btn-modal-confirm`, `.btn-modal-ghost`), kartu telemetri (`.stats-overview-grid`, `.telemetry-card`), tabel data (`.ledger-table`, `.pro-table`), bar pencarian (`.search-box`), tab segmen (`.year-toggle-group`), badges status, dan sistem modal dialog (`.modal-backdrop`, `.modal-dialog`) **HARUS** berada di master CSS terpusat.
- **Zero-CSS New Menu/Feature Creation**: Saat membuat menu atau fitur baru, manfaatkan class yang sudah tersedia di master CSS. DILARANG membuat duplikasi CSS untuk elemen-elemen yang sudah ada.
- **Bespoke Scoped Styles Only**: Tag `<style scoped>` di komponen `.vue` hanya diperbolehkan jika ada kebutuhan visual yang benar-benar spesifik/unik untuk komponen tersebut.

---

## 4. Pemisahan Folder Data Statis (`src/data/*.ts`) vs Styling (`src/assets/*.css`)
- **Pemisahan Sumber Daya Bersih (Clean Resource Separation)**:
  - **`src/assets/`**: Khusus file visual, stylesheet CSS (`studio-master.css`, `visual-editor.css`), icon, font, dan gambar. DILARANG mencampur file data TypeScript ke dalam folder assets.
  - **`src/data/`**: Khusus file TypeScript berisi mock seeds, konstanta template, generator mockup, daftar font, dan preset desain (seperti [`src/data/dashboard-seeds.ts`](file:///home/rizal/dockerfile/docker-cms/services/02-dashboard-cms/src/data/dashboard-seeds.ts)).
- **No Heavy Static Arrays in `.vue` or Logic Composables**: Dilarang menaruh ratusan baris data statis di dalam file Single File Component (`.vue`) maupun composables logika. Wajib diimpor secara modular dari `src/data/*.ts`.
- **Tujuan**: Menjaga file `.vue` dan composable tetap ramping (<500 baris) agar pemindaian IDE instan, konsumsi RAM hemat, dan hot-reloading (HMR) tidak lag.

---

## 5. Standar UX & Tata Letak Halaman
- **Tata Letak Bersih 2 Baris (2 Rows)**:
  - **Baris 1 (Aksi & Filter)**: Judul modul, bar pencarian interaktif terpadu (`.search-box`), dan tab penyaring tahun/kategori/status.
  - **Baris 2 (Data Display)**: Grid telemetri metrik dan tabel data / kartu layanan.
- **Mode Baca / Reader View**:
  - **Navigasi Tunggal di Atas**: Hanya gunakan satu header navigasi ringkas di bagian atas dengan tombol Kembali (**Back**) yang jelas.
  - **Distraction-Free / Focus Reading**: Saat mode pembaca dibuka, sembunyikan atau minimalkan menu sidebar (*hidden/collapsed*) agar area baca lapang dan pengguna fokus membaca konten.

---

## 6. Lazy Loading Modul Antar-Menu (`defineAsyncComponent`)
- **On-Demand Chunking**: Di view induk seperti [`DashboardView.vue`](file:///home/rizal/dockerfile/docker-cms/services/02-dashboard-cms/src/views/DashboardView.vue), semua modul menu **WAJIB** dimuat menggunakan `defineAsyncComponent`.

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

---

## 8. Standar Changelog & Semantic Versioning (Wajib untuk AI Agent & Developer)
Setiap AI Agent maupun pengembang yang melakukan modifikasi kode, penambahan fitur, atau perbaikan bug di repositori HeroCMS **WAJIB** mencatat perubahan secara terstruktur ke dalam dataset changelog resmi di:
[`services/02-dashboard-cms/src/data/changelog.ts`](file:///Users/rizalfahmi/Documents/React/herocms/services/02-dashboard-cms/src/data/changelog.ts)

- **Aturan Penomoran Versi (Semantic Versioning: `vMajor.Minor.Patch/Revision`)**:
  1. **Major (`X.0.0`)**: Digunakan jika ada perubahan arsitektur fundamental, perombakan database/API yang bersifat breaking change, atau perombakan sistem UI/UX secara radikal.
  2. **Minor (`x.Y.0`)**: Digunakan setiap kali menambahkan **menu baru, modul baru, atau kapabilitas fungsional baru** yang backwards-compatible (contoh: pembuatan Menu Changelog, Modul Telemetri baru).
  3. **Revision / Patch (`x.y.Z`)**: Digunakan untuk **perbaikan bug (bugfix), optimasi performa** (contoh: smooth scrolling fix, cache invalidation tune), perbaikan visual CSS, atau perapihan kode.

- **Struktur Entri Changelog Wajib**:
  Setiap versi baru ditambahkan di posisi teratas array `changelogReleases` dengan format:
  ```typescript
  {
    version: 'v1.X.Y',
    releaseDate: 'DD MMMM YYYY',
    title: 'Judul Rilis Ringkas & Informatif',
    description: 'Ringkasan perubahan fungsional dan teknis yang diterapkan.',
    isLatest: true, // pastikan versi sebelumnya diset false
    items: [
      {
        id: 'CHG-XXXX',
        type: 'feature' | 'fix' | 'improvement' | 'security' | 'perf',
        title: 'Judul Perubahan',
        description: 'Detail teknis apa yang diubah dan dampaknya.',
        component: 'Dashboard / Editor / Backend / Auth',
        author: 'HeroCMS Dev / AI Agent',
        tags: ['Tag1', 'Tag2']
      }
    ]
  }
  ```
- **Larangan**: Dilarang menyelesaikan pekerjaan atau melakukan commit tanpa memperbarui catatan perubahan dan menaikkan nomor versi yang sesuai di changelog.

