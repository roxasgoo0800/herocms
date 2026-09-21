# HeroCMS Design System & Aesthetic Guidelines (`DESIGN.md`)

> **Single Source of Truth for HeroCMS Visual Identity & Aesthetic Direction**
> 
> Dokumen ini mendefinisikan sistem desain resmi **Obsidian Slate + Electric Cyan** untuk seluruh aplikasi dan layanan frontend HeroCMS (`services/02-dashboard-cms`, `services/04-marketing-site`, dan modul frontend mendatang). 
> Dipadukan dengan filter **`antislop`** (`.agents/rules/antislop.md`), `DESIGN.md` memberikan arah estetika yang presisi, elegan, dan kelas enterprise.

---

## 1. Konsep & Filosofi Desain

HeroCMS mengusung estetika **Dark Enterprise Studio** yang modern, cepat, dan terpercaya. Tidak ada ruang untuk desain terang polos bawaan browser ("untouched light mode") atau tampilan generik AI.

- **Tema Gelap Mutlak (Absolute Dark Mode)**: Penggunaan palet warna gelap obsidian yang dalam dengan pencahayaan aksen cyan berkilau (*neon-glow* halus).
- **Zero-CSS Duplication**: Seluruh komponen UI memanfaatkan kelas terpusat dari `studio-master.css`.
- **Sensasi Telemetri Canggih**: Tampilan data, grafik, dan tabel disajikan seperti konsol kontrol infrastruktur cloud global.

---

## 2. Palet Warna Resmi (Color Tokens)

### A. Canvas & Backgrounds (Permukaan Deep Obsidian)
| Token | Hex / Value | Penggunaan |
| :--- | :--- | :--- |
| `--bg-canvas` | `#0b0f19` | Latar belakang halaman utama (Deep Obsidian) |
| `--bg-card` | `#0e1526` | Kartu data, panel navigasi, dan container utama |
| `--bg-elevated` | `#141d33` | Surface melayang, dropdown menu, modal dialog |
| `--bg-subtle` | `#161f38` | Hover state, input field, dan baris tabel terpilih |

### B. Aksen Utama & Gradasi (Electric Cyan to Royal Azure)
| Token | Hex / Gradient | Penggunaan |
| :--- | :--- | :--- |
| `--accent-cyan` | `#00f2fe` | Warna penekanan utama, fokus input, ikon aktif |
| `--accent-azure` | `#4facfe` | Warna sekunder aksen gradasi |
| `--gradient-primary` | `linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)` | Tombol CTA utama (`.btn-primary-gradient`), badge sorotan |
| `--gradient-glow` | `0 0 20px rgba(0, 242, 254, 0.25)` | Efek hover kartu telemetri dan tombol aktif |

### C. Garis Batas & Pembatas (Borders)
| Token | Value | Penggunaan |
| :--- | :--- | :--- |
| `--border-subtle` | `rgba(255, 255, 255, 0.08)` | Batas antar-kartu dan baris tabel |
| `--border-bold` | `#1e293b` | Garis pembatas panel utama & sidebar |
| `--border-focus` | `rgba(0, 242, 254, 0.5)` | Garis batas saat input dalam kondisi fokus |

### D. Indikator Status & Badges
| Status | Warna Utama | Background Semi-Transparan | Penggunaan |
| :--- | :--- | :--- | :--- |
| **Success / Published** | Emerald (`#10b981`) | `rgba(16, 185, 129, 0.12)` | Status Published, Online, 200 OK |
| **Warning / Draft** | Amber (`#f59e0b`) | `rgba(245, 158, 11, 0.12)` | Status Draft, Pending Sync, Warning |
| **Error / Critical** | Rose (`#f43f5e`) | `rgba(244, 63, 94, 0.12)` | Status Deleted, System Error, Failed |
| **Info / Neutral** | Electric Sky (`#38bdf8`) | `rgba(56, 189, 248, 0.12)` | Metadata, Tagging, Versi Build |

---

## 3. Tipografi & Hirarki Teks

Menggunakan font **Inter** atau **Outfit** dari Google Fonts dengan keterbacaan tinggi di layar gelap.

- **Judul Utama Halaman (`<h1>` / `.page-title`)**: `1.75rem` – `2.25rem`, Weight `800`, Letter-spacing `-0.02em`, Color `#f8fafc`.
- **Judul Sekunder (`<h2>` / `.section-title`)**: `1.25rem` – `1.5rem`, Weight `700`, Color `#f1f5f9`.
- **Subjudul / Label Module (`<h3>`)**: `1.00rem` – `1.15rem`, Weight `600`, Color `#e2e8f0`.
- **Teks Paragraf Body (`<p>`)**: `0.875rem` – `0.95rem`, Height `1.6`, Color `#94a3b8`.
- **Label / Helper Text (`.label-text`)**: `0.75rem` – `0.82rem`, Weight `600`, Uppercase, Color `#64748b`.

---

## 4. Standar UX & Layout (2-Rows Pattern)

Seluruh modul CMS (Artikel, Halaman, Media, Domain, Ticketing) **WAJIB** mengikuti tata letak 2 baris terstruktur:

```text
+-----------------------------------------------------------------------------------+
| BARIS 1: Header Modul | Search Box Interaktif | Year/Category Filter Toggle       |
+-----------------------------------------------------------------------------------+
| BARIS 2: Grid Kartu Telemetri Metrik | Tabel Data Ledger (.ledger-table)          |
+-----------------------------------------------------------------------------------+
```

1. **Baris 1 (Aksi & Penyaringan)**:
   - Judul modul di sisi kiri.
   - Bar pencarian terintegrasi (`.search-box`) di tengah/kanan.
   - Segmented toggle filter (`.year-toggle-group`) di sisi kanan.
2. **Baris 2 (Tampilan Data Utama)**:
   - Grid kartu telemetri ringkasan angka metrik (`.stats-overview-grid` / `.telemetry-card`).
   - Tabel data utama (`.ledger-table` / `.pro-table`) dengan efek hover baris halus dan paginasi teratur.

---

## 5. Mode Baca Terfokus (Distraction-Free Reader Mode)

Saat pengguna membuka mode pratinjau/baca artikel atau halaman:
- **Navigasi Tunggal di Atas**: Hanya sertakan satu tombol **"← Kembali"** yang jelas di bagian atas.
- **Sidebar Auto-Collapse**: Sembunyikan sidebar agar layar lapang.
- **Hero Cover & Typographic Hierarchy**: Sampul hero dengan gradasi overlay hitam, metadata penulis & tanggal terstruktur rapi.

---

## 6. Komponen Master CSS (`src/assets/studio-master.css`)

Semua pengembang & AI agent wajib menggunakan class yang sudah tersedia:

- **Tombol Utama**: `.btn-primary-gradient` (Latar gradasi Electric Cyan dengan hover glow).
- **Tombol Sekunder/Action**: `.btn-outline-action` (Batas `rgba(255,255,255,0.1)` dengan hover cyan).
- **Kartu Metrik**: `.telemetry-card` (Border halus, background `#0e1526`, ikon berlatar glow).
- **Tabel Data**: `.ledger-table` (Header gelap `#141d33`, border-bottom halus, baris hover `#161f38`).
- **Modal Dialog**: `.modal-backdrop` & `.modal-dialog` (Glassmorphism backdrop `blur(8px)`).

---

## 7. Integrasi dengan Guardrails `antislop`

Dalam bekerja dengan AI Agent:
1. **`DESIGN.md`** bertugas memberikan **Arah Estetika, Warna, Tipografi, dan Tata Letak**.
2. **`antislop`** (`.agents/rules/antislop.md`) bertugas sebagai **Filter Quality Gate** (mencegah teks AI generik/slop, angka palsu, banner hiasan berlebihan, dan komentar kode yang redundan).
