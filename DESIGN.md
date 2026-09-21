# HeroCMS Design System & Aesthetic Guidelines (`DESIGN.md`)

> **Single Source of Truth for HeroCMS Visual Identity & Aesthetic Direction**
> 
> Dokumen ini mendefinisikan sistem desain resmi **HeroCMS Studio - Bespoke Enterprise Design System** untuk seluruh aplikasi dan layanan frontend HeroCMS (`services/02-dashboard-cms`, `services/04-marketing-site`, dan modul frontend mendatang). 
> Desain ini berakar pada arsitektur visual asli di [`src/assets/studio-master.css`](file:///home/rizal/dockerfile/docker-cms/services/02-dashboard-cms/src/assets/studio-master.css) dan [`src/assets/studio-animations.css`](file:///home/rizal/dockerfile/docker-cms/services/02-dashboard-cms/src/assets/studio-animations.css). Dipadukan dengan filter **`antislop`** (`.agents/rules/antislop.md`), panduan ini menjaga konsistensi visual yang bersih, elegan, profesional, dan berstandar enterprise global (setara standar Linear, Vercel, dan Stripe).

---

## 1. Konsep & Filosofi Desain

HeroCMS Studio mengusung estetika **Bespoke Enterprise Studio**: antarmuka kerja yang cerah, bersih, berkecepatan tinggi, dan berfokus pada konten dengan kontras visual tinggi:

- **Clean Pristine Canvas with Ambient Dot Grid**: Latar belakang putih bersih (`#ffffff` / `#f8fafc`) dipadukan dengan aksen grafis *ambient dot grid* (`radial-gradient(#cbd5e1 1.2px, transparent 1.2px)`) dan *ambient glow* halus yang memberikan kedalaman tanpa membuat tampilan kusam.
- **Glassmorphic Navigation**: Sidebar kiri dan top bar navigasi memanfaatkan efek *frosted glass* halus (`rgba(255, 255, 255, 0.96)` dan `backdrop-filter: blur(20px)`) dengan garis batas tipis presisi (`#e2e8f0`).
- **High-Contrast Deep Slate Anchors**: Warna Deep Slate / Obsidian (`#0f172a` / `#09090b`) digunakan sebagai penanda interaksi utama: brand glyph, tombol aksi primer (CTA), tab/menu navigasi aktif, dan konsol kode/terminal.
- **Royal Azure Accents**: Aksen gradasi biru modern (`linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)`) digunakan untuk brand wordmark, tautan interaktif, meter kemajuan kuota, dan fokus status.
- **Zero-CSS Duplication**: Fitur atau menu baru wajib memanfaatkan class utility dan komponen yang sudah didefinisikan di `studio-master.css`.

---

## 2. Palet Warna Resmi (Color Tokens)

### A. Canvas & Surfaces (Permukaan Bersih & Terang)
| Token | Hex / Value | Penggunaan |
| :--- | :--- | :--- |
| `--bg-canvas` | `#ffffff` | Kanvas utama dashboard & background wave container |
| `--bg-canvas-subtle` | `#f8fafc` | Kanvas sekunder, latar belakang artboard kanvas visual |
| `--bg-card` | `#ffffff` | Kartu konten, modul fitur, tabel, dan kotak telemetri |
| `--bg-surface-elevated`| `#ffffff` | Modal dialog, dropdown popover, floating toolbar |
| `--bg-surface-muted` | `#f1f5f9` / `#f4f4f5` | Segmented toggle bar, background input readonly, chip badge |
| `--dot-grid-color` | `#cbd5e1` | Titik-titik pola dot grid kanvas (`opacity: 0.75`) |

### B. Slate Primer, Brand Wordmark & Aksen
| Token | Hex / Gradient | Penggunaan |
| :--- | :--- | :--- |
| `--slate-primary` | `#0f172a` | Tombol CTA primer, brand glyph, menu aktif, judul heading |
| `--slate-hover` | `#1e293b` | Hover state tombol CTA primer |
| `--brand-gradient` | `linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)` | Wordmark "HeroCMS Studio", progress bar kuota, aksen tautan |
| `--blue-accent` | `#2563eb` | Warna tautan, status TTFB, ring fokus input form |
| `--blue-subtle` | `#eff6ff` | Latar belakang badge informasi, hover tautan sekunder |

### C. Garis Batas & Pembatas (Borders)
| Token | Value | Penggunaan |
| :--- | :--- | :--- |
| `--border-subtle` | `#f1f5f9` / `#f4f4f5` | Pemisah baris dalam kartu dan tabel |
| `--border-default` | `#e2e8f0` / `#e4e4e7` | Garis batas kartu, sidebar, topbar, dan modal |
| `--border-strong` | `#cbd5e1` | Garis batas input aktif, tombol outline sekunder |
| `--border-focus` | `#2563eb` / `#0284c7` | Garis batas input saat fokus (dengan shadow halus) |

### D. Indikator Status & Semantic Badges
| Status | Warna Utama | Background | Border | Penggunaan |
| :--- | :--- | :--- | :--- | :--- |
| **Running / Aktif / Success** | `#059669` / `#10b981` | `#ecfdf5` | `#d1fae5` | Status container aktif, published, online |
| **Warning / Draft / Standby** | `#b45309` / `#f59e0b` | `#fffbeb` | `#fde68a` | Container standby, draft, butuh tindakan |
| **Danger / Error / Deleted** | `#ef4444` / `#b91c1c` | `#fef2f2` | `#fecaca` | Error koneksi, container stop, hapus section |
| **Info / Edge / Plan** | `#2563eb` / `#0284c7` | `#eff6ff` | `#bfdbfe` | Lisensi, kuota, latency ping, PWA badge |

---

## 3. Tipografi & Hirarki Teks

Menggunakan font **Inter** atau font sistem bawaan modern (`-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`):

- **Brand Wordmark**: `1.55rem`, Weight `800`, Letter-spacing `-0.03em`, Color `#0f172a` dengan aksen gradasi biru.
- **Judul Utama Halaman (`<h1>` / `.page-title`)**: `1.45rem` – `1.75rem`, Weight `800`, Letter-spacing `-0.025em`, Color `#0f172a`.
- **Deskripsi Subjudul Modul**: `0.85rem`, Weight `400`, Color `#64748b`, line-height `1.5`.
- **Judul Kartu / Section (`<h3>`)**: `0.95rem` – `1.05rem`, Weight `700`, Color `#0f172a`.
- **Teks Paragraf Body (`<p>`)**: `0.82rem` – `0.875rem`, Color `#475569`, line-height `1.55`.
- **Label / Helper Text (`.field-label`)**: `0.72rem` – `0.78rem`, Weight `600`, Color `#475569` / `#334155`.
- **Monospace / Telemetri / Data Badge**: `0.68rem` – `0.74rem`, `ui-monospace, SFMono-Regular, monospace`, Weight `600`.

---

## 4. Standar UX & Tata Letak Halaman (2-Rows Pattern)

Seluruh modul CMS (Situs & Kontainer, Katalog Template, Artikel & Halaman, Media Assets, Webhooks, Billing) mengikuti tata letak 2 baris terstruktur:

```text
+-----------------------------------------------------------------------------------+
| BARIS 1: Header Modul (Judul & Subjudul) | Status Ringkasan / Tombol Aksi Utama   |
+-----------------------------------------------------------------------------------+
| BARIS 2: Bar Pencarian Terpadu + Segment Filter Pill (Semua, Running, Standby)    |
+-----------------------------------------------------------------------------------+
| DISPLAY DATA: Grid Kartu Layanan / Tabel Data Telemetri                           |
+-----------------------------------------------------------------------------------+
```

---

## 5. Sistem Modal Dialog & Editor Konten

Modal dialog di HeroCMS Studio mengikuti standar kartu bersih yang elegan:

1. **Backdrop**: `rgba(15, 23, 42, 0.65)` dengan `backdrop-filter: blur(8px)`.
2. **Container Modal**: `background: #ffffff; border: 1px solid #e4e4e7; border-radius: 14px; box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.25);`.
3. **Header Modal**: Permukaan putih bersih dengan icon box `#f4f4f5`, judul tegas `#09090b`, subjudul `#71717a`, dan tombol close (`X`).
4. **Navigasi Sub-Tab**: Segmented bar berlatar `#f1f5f9`, dengan tab aktif Deep Slate `#0f172a` (teks putih) atau biru bersih.
5. **Formulir & Input**: Input berlatar belakang putih (`#ffffff`), border halus `#cbd5e1` / `#e2e8f0`, teks kontras `#0f172a`, dan ring fokus biru (`#2563eb`).
6. **Area Pratinjau Interaktif**: Frame browser bersih dengan titlebar macOS traffic dots halus dan canvas preview interaktif.
7. **Footer Modal**: Tombol **Batal** (`.btn-modal-ghost`) dan tombol **Terapkan / Simpan** primer (`.btn-modal-confirm` berlatar Deep Slate `#0f172a` dengan hover `#27272a`).

---

## 6. Integrasi dengan Guardrails `antislop`

- **`DESIGN.md`**: Memberikan arah estetika, token warna, tipografi, dan konsistensi layout yang sesuai dengan kode asli `studio-master.css` dan `studio-animations.css`.
- **`antislop`** (`.agents/rules/antislop.md`): Bertindak sebagai filter kualitas kode & konten (mencegah teks AI generik/slop, tombol tiruan tanpa fungsi, dan elemen yang tidak berakar pada sistem desain HeroCMS).
