---
name: browser-e2e-playwright
description: Panduan pengujian antarmuka berbasis browser E2E (End-to-End) dan verifikasi visual untuk HeroCMS Studio dan Marketing Site menggunakan Playwright atau browser automation. Gunakan saat memvalidasi alur kerja UI, modal dialog, formulir input, dan regresi visual.
---

# Browser Testing & E2E Verification Skill (`browser-e2e-playwright`)

Skill ini memandu AI Agent dalam merancang skenario pengujian browser otomatis, verifikasi alur kerja pengguna (E2E), dan inspeksi visual antarmuka di `services/02-dashboard-cms` dan `services/04-marketing-site`.

---

## 1. Prinsip Utama Pengujian UI

1. **Selector Resilien (User-Facing First)**:
   * Prioritaskan selector berbasis teks atau role yang dapat diakses pengguna (`role="button"`, `name="Simpan"`, teks tombol), bukan XPath rapuh atau CSS class dinamis.
   * Gunakan atribut `data-testid` atau `id` unik pada elemen-elemen interaktif kritis:
     * Contoh: `id="btn-confirm-delete"`, `data-testid="pod-row-001"`.
2. **Zero-Flaky Asynchronous Waits**:
   * Dilarang menggunakan `sleep()` atau `waitForTimeout()` dengan durasi statis.
   * Gunakan event-driven waiting: `waitForSelector()`, `waitForResponse()`, atau assertion kondisi state (`toBeVisible()`).
3. **Pembersihan State (Test Isolation)**:
   * Setiap tes harus independen. Bersihkan cookies, session storage, dan mock state sebelum setiap suite pengujian dijalankan.

---

## 2. Checklist Alur Kritis yang Wajib Diuji

- **Autentikasi & Sesi**:
  * Login dengan kredensial benar -> redirect ke `/app/overview`.
  * Login dengan kredensial salah -> tampilkan pesan toast peringatan tanpa membocorkan info sensitif.
  * Logout -> session cookie dihapus dan redirect ke halaman login.
- **Danger Zone Modal (Penghapusan Kontainer)**:
  * Klik tombol hapus -> modal dialog muncul (bukan native browser confirm).
  * Memverifikasi teks nama kontainer yang akan dihapus sesuai target.
  * Klik tombol batal -> modal tertutup tanpa mutasi state.
  * Klik konfirmasi hapus -> tombol menampilkan spinner loading dan item terhapus dari daftar.
- **Visual Editor & Template Renderer**:
  * Pemuatan kanvas drag-and-drop.
  * Perubahan teks atau warna pada preset langsung ter-update di live preview iframe.
- **Responsivitas & Mobile Layout**:
  * Pengujian viewport desktop (1440x900) vs tablet (768x1024) vs mobile (375x812).
  * Memastikan sidebar menutup secara anggun di layar mobile dan hamburger menu berfungsi dengan baik.

---

## 3. Template Skrip Pengujian Playwright (TypeScript)

```typescript
import { test, expect } from '@playwright/test';

test.describe('HeroCMS Studio - Alur Manajemen Pods', () => {
  test.beforeEach(async ({ page }) => {
    // 1. Buka dashboard studio
    await page.goto('http://localhost:5173/app');
  });

  test('Harus menampilkan modal bespoke danger zone saat menghapus pod', async ({ page }) => {
    // Cari modul pods
    const podsTable = page.locator('.ledger-table');
    await expect(podsTable).toBeVisible();

    // Klik tombol aksi hapus pada baris pertama
    const deleteBtn = page.locator('button.btn-action-delete').first();
    await deleteBtn.click();

    // Verifikasi modal kustom muncul
    const dangerModal = page.locator('.modal-dialog');
    await expect(dangerModal).toBeVisible();
    await expect(dangerModal).toContainText('Konfirmasi Tindakan Destruktif');

    // Klik tombol Batal
    await page.locator('.btn-modal-ghost').click();
    await expect(dangerModal).not.toBeVisible();
  });
});
```
