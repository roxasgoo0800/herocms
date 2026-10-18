---
name: web-performance-vitals
description: Panduan optimasi performa web, Core Web Vitals (LCP, CLS, INP), code-splitting Vite, HTTP caching, dan penanganan latensi Go API di HeroCMS. Gunakan saat mengaudit kecepatan halaman, optimasi bundle size, atau men-tune TTFB.
---

# Web Performance & Core Web Vitals Skill (`web-performance-vitals`)

Skill ini memandu AI Agent dalam menganalisis, memprofiling, dan mengoptimalkan performa frontend serta latensi backend pada ekosistem HeroCMS.

---

## 1. Tolok Ukur Core Web Vitals (Enterprise Targets)

| Metrik | Target Optimal | Strategi Penegakan di HeroCMS |
| :--- | :--- | :--- |
| **TTFB** (Time to First Byte) | `< 100 ms` | Cache Redis di Go server, Traefik edge routing, HTTP/2 multiplexing. |
| **LCP** (Largest Contentful Paint) | `< 1.8 detik` | Preload hero fonts/images, WebP/AVIF format, CDN asset caching. |
| **CLS** (Cumulative Layout Shift) | `< 0.05` | Selalu tentukan rasio aspek gambar (`width`/`height`), hindari injeksi DOM tanpa placeholder. |
| **INP** (Interaction to Next Paint) | `< 150 ms` | Debounce input pencarian (300ms), hindari long-running synchronous loops di main thread. |

---

## 2. Aturan Bundling & Code-Splitting di Vite

Saat mengonfigurasi atau mengevaluasi `vite.config.ts`:

1. **Vendor Code-Splitting Manual**:
   Pertahankan pemisahan pustaka berukuran besar agar tidak mencemari initial chunk:
   ```typescript
   build: {
     rollupOptions: {
       output: {
         manualChunks: {
           'vue-vendor': ['vue', 'vue-router', 'pinia'],
           'lucide-icons': ['lucide-vue-next'],
           'echarts': ['echarts']
         }
       }
     }
   }
   ```
2. **On-Demand Lazy Loading**:
   Komponen modul yang tidak langsung terlihat saat halaman dibuka wajib dimuat dengan `defineAsyncComponent`.
3. **Chunk Size Monitoring**:
   Pastikan tidak ada chunk aplikasi yang melebihi batas toleransi tanpa pemisahan asinkron.

---

## 3. Kebijakan HTTP Caching di Layer Ingress & Go Server

- **Aset Statis Ter-Hash (`/assets/*.js`, `/assets/*.css`)**:
  ```http
  Cache-Control: public, max-age=31536000, immutable
  ```
- **Halaman HTML Dinamis (`index.html`)**:
  ```http
  Cache-Control: no-cache, no-store, must-revalidate
  ```
- **Respon API Konten Tenant**:
  ```http
  Cache-Control: public, max-age=60, stale-while-revalidate=300
  ```

---

## 4. Deteksi Masalah Performa Backend & Database

- **Cegah N+1 Query**:
  * Di PostgreSQL/Go pgx, gunakan `JOIN` atau batch kueri `WHERE id IN (...)` ketimbang memanggil kueri di dalam perulangan `for`.
- **Indeks Kolom Penyaring**:
  * Setiap kolom yang masuk dalam klausa `WHERE`, `ORDER BY`, atau `GROUP BY` secara berkala (misal: `tenant_id`, `status`, `created_at`) wajib memiliki index b-tree.
