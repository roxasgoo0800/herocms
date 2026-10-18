---
name: herocms-frontend-studio
description: Standar implementasi UI Vue 3 & Pinia untuk HeroCMS Studio (DESIGN.md), Zero-CSS duplication, master tokens, modul lazy-loading, dan pemisahan data statis vs asset visual. Gunakan saat membuat atau memodifikasi modul UI di services/02-dashboard-cms dan services/04-marketing-site.
---

# HeroCMS Frontend Studio Skill (`herocms-frontend-studio`)

Skill ini memandu AI Agent dalam merancang, memodifikasi, dan merefaktor komponen antarmuka pengguna (UI/UX) di seluruh layanan frontend HeroCMS (`services/02-dashboard-cms` dan `services/04-marketing-site`).

---

## 1. Prinsip Utama: Zero-CSS Duplication

Sebelum menambahkan CSS baru ke blok `<style scoped>`, selalu manfaatkan utilitas dan komponen yang sudah didefinisikan di:
- `services/02-dashboard-cms/src/assets/studio-master.css`
- `services/02-dashboard-cms/src/assets/studio-animations.css`

### Class Standar yang Wajib Digunakan:
- **Tombol CTA & Aksi**:
  - Primer: `.btn-top-create` atau `.btn-modal-confirm` (Deep Slate `#0f172a`, radius 8px, hover `#1e293b`)
  - Sekunder/Ghost: `.btn-modal-ghost` atau `.btn-outline-action`
  - Gradasi Khusus: `.btn-primary-gradient` (Royal Blue linear gradient)
- **Kartu & Telemetri**:
  - Grid: `.stats-overview-grid`
  - Kartu Metrik: `.telemetry-card` (Pure White `#ffffff`, border `#e2e8f0`, shadow halus)
- **Tabel Data**:
  - Kontainer & Tabel: `.ledger-table` atau `.pro-table`
- **Filter & Navigasi Baris 1**:
  - Kotak Pencarian: `.search-box` (dengan icon search dan input terintegrasi)
  - Tab Penyaring / Segmented Toggle: `.year-toggle-group`
- **Dialog & Modal**:
  - Backdrop: `.modal-backdrop`
  - Panel: `.modal-dialog` (border-radius 14px, shadow elevasi)

> **Catatan Scoped CSS**:
> Blok `<style scoped>` di Single File Component (`.vue`) **hanya diperbolehkan** untuk layout yang benar-benar spesifik dan unik (misal: kanvas drag-and-drop template, kanvas artikel reader).

---

## 2. Palet Warna & Visual Identity (HeroCMS Studio)

Selalu ikuti token warna resmi di `DESIGN.md`:
* **Canvas & Latar Belakang**:
  * Kanvas utama: `#ffffff`
  * Kanvas sekunder / artboard: `#f8fafc` dengan pola *ambient dot grid* (`radial-gradient(#cbd5e1 1.2px, transparent 1.2px)`)
* **Surfaces & Cards**: `#ffffff` dengan border `#e2e8f0` / `#e4e4e7` dan radius `12px`–`14px`.
* **Aksi Primer (Anchors)**: Deep Slate `#0f172a` / `#09090b`.
* **Brand Wordmark & Aksen**: Royal Blue `linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)`.
* **Semantic Status Badges**:
  * Running / Aktif / Published: Emerald (`#059669` / `#10b981`, bg: `#ecfdf5`, border: `#d1fae5`)
  * Standby / Menunggu / Draft: Amber (`#b45309`, bg: `#fffbeb`, border: `#fde68a`)
  * Error / Deleted / Kritis: Red (`#ef4444`, bg: `#fef2f2`, border: `#fecaca`)
  * Info / Edge / Telemetri: Royal Blue (`#2563eb`, bg: `#eff6ff`, border: `#bfdbfe`)

---

## 3. Pemisahan Sumber Daya (Clean Resource Separation)

DILARANG menaruh ratusan baris array statis, daftar template, mock seed, atau preset desain di dalam file `.vue` atau composable logika.

* **Folder `src/assets/`**:
  * Khusus file visual, stylesheet CSS (`studio-master.css`), gambar, font, dan icons.
  * DILARANG membuat file data `.ts` di dalam `src/assets/`.
* **Folder `src/data/`**:
  * Khusus file TypeScript berisi static mock data, seed, preset, dan konstanta (seperti `src/data/dashboard-seeds.ts`, `templates-data.ts`, `container-logs.ts`).
  * Impor secara modular ke dalam komponen:
    ```typescript
    import { initialTemplates, type TemplateItem } from '@/data/templates-data';
    ```

---

## 4. Lazy-Loading Antar-Modul (`defineAsyncComponent`)

Di view induk (seperti `DashboardView.vue`), setiap modul menu **WAJIB** dimuat secara asinkron menggunakan `defineAsyncComponent`:

```typescript
import { defineAsyncComponent } from 'vue';

const ContainersModule = defineAsyncComponent(() => 
  import('../components/dashboard/ContainersModule.vue')
);
const MediaAssetsModule = defineAsyncComponent(() => 
  import('../components/dashboard/MediaAssetsModule.vue')
);
```

**Tujuan**: Menjaga initial bundle JavaScript tetap kecil (~67 kB) dan mengeliminasi overhead pemuatan modul yang belum dibuka pengguna.

---

## 5. Tata Letak UX 2-Baris (Two-Row Layout Standard)

Ketika merancang atau memperbaiki halaman manajemen di Dashboard:
* **Baris 1 (Aksi & Filter)**:
  * Judul modul / breadcrumbs ringkas
  * Input pencarian terpadu (`.search-box`)
  * Filter tab kategori / tahun (`.year-toggle-group`)
  * Tombol CTA utama di pojok kanan (`.btn-top-create`)
* **Baris 2 (Data Display)**:
  * Grid telemetri metrik (3-4 kartu `.telemetry-card`)
  * Tabel data interaktif (`.ledger-table`) dengan pagination & batch action
