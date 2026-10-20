---
name: herocms-changelog-semver
description: Prosedur pencatatan perubahan rilis dan penomoran versi Semantic Versioning (SemVer) sesuai mandat AGENTS.md ke dataset changelog independen per-service (misal: services/02-dashboard-cms/src/data/changelog.ts, services/07-docs/src/data/changelog.ts). Gunakan setiap kali menyelesaikan fitur, perbaikan bug, atau refaktor di HeroCMS.
---

# HeroCMS Changelog & Semantic Versioning Skill (`herocms-changelog-semver`)

Skill ini memandu AI Agent dalam memenuhi **kewajiban pembaruan Changelog & penomoran Semantic Versioning** sesuai aturan resmi di [`AGENTS.md`](file:///Users/rizalfahmi/Documents/React/herocms/AGENTS.md).

Setiap AI Agent maupun developer yang menyelesaikan tugas di repositori HeroCMS **WAJIB** mencatat perubahannya ke dalam direktori service masing-masing:
- **Service 02 Dashboard CMS**: `services/02-dashboard-cms/src/data/changelog.ts`
- **Service 07 Docs Hub**: `services/07-docs/src/data/changelog.ts`
- **Aturan Mutlak**: Dilarang keras mencampurkan riwayat rilis service lain ke dalam changelog `02-dashboard-cms`. Setiap service memiliki catatan rilis mandiri.

---

## 1. Aturan Penomoran Versi (Semantic Versioning: `vMajor.Minor.Patch`)

1. **Major (`vX.0.0`)**:
   * Digunakan jika ada perubahan arsitektur fundamental, perombakan skema database/API breaking change, atau perombakan sistem UI/UX secara radikal.
2. **Minor (`vx.Y.0`)**:
   * Digunakan setiap kali menambahkan **menu baru, modul baru, skill baru, atau kapabilitas fungsional baru** yang backwards-compatible (contoh: pembuatan menu baru, fitur danger zone, orchestrator endpoint baru).
3. **Patch / Revision (`vx.y.Z`)**:
   * Digunakan untuk **perbaikan bug (bugfix), penyesuaian visual kecil, optimasi performa**, perapihan layout CSS, atau perbaikan kompilasi.

---

## 2. Struktur Entri Changelog Wajib

Setiap versi baru **harus ditempatkan di posisi paling atas** (indeks `0`) dari array `changelogReleases`:

```typescript
import type { ChangelogRelease } from '../types/dashboard';

export const changelogReleases: ChangelogRelease[] = [
  {
    version: 'v1.8.3', // Naikkan patch atau minor sesuai jenis perubahan
    releaseDate: '18 Oktober 2026', // Format DD MMMM YYYY
    title: 'Judul Rilis yang Ringkas & Informatif',
    summary: 'Deskripsi menyeluruh mengenai apa saja yang ditambahkan atau diperbaiki.',
    badge: 'Latest', // Hapus badge 'Latest' dari versi sebelumnya!
    author: 'HeroCMS Dev / AI Agent',
    items: [
      {
        id: 'c-183-1',
        type: 'feature', // 'feature' | 'improvement' | 'fix' | 'security' | 'perf'
        scope: 'Nama Modul atau Komponen',
        description: 'Detail teknis apa yang diubah dan dampaknya bagi sistem/pengguna.'
      }
    ]
  },
  // Versi-versi sebelumnya berada di bawahnya...
];
```

---

## 3. Checklist Sebelum Menyelesaikan Tugas

Sebelum melaporkan pekerjaan selesai kepada pengguna:
1. Periksa versi terakhir di `services/02-dashboard-cms/src/data/changelog.ts`.
2. Tentukan apakah perubahan masuk kategori **Minor** atau **Patch**.
3. Tambahkan objek rilis baru dengan properti `badge: 'Latest'`.
4. Pastikan entri rilis sebelumnya tidak lagi memiliki `badge: 'Latest'`.
5. Pastikan kode TypeScript valid tanpa kesalahan lint atau missing commas.
