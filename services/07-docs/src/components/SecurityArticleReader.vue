<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Lock,
  AlertTriangle,
  FileCode,
  Terminal,
  CheckCircle2,
  Copy,
  Check,
  PanelLeftClose,
  PanelLeftOpen,
  Bot,
  ShieldAlert,
  Layers
} from 'lucide-vue-next';
import { useDocsStore } from '../stores/docsStore';

const store = useDocsStore();
const sec = computed(() => store.activeSecurity);

const copiedSecId = ref(false);
const copiedReport = ref(false);
const copiedCode = ref(false);
const copiedFilePath = ref(false);
const checkedItems = ref<Record<string, boolean>>({});

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    store.closeSecurity();
  } else if (e.altKey && e.key === 'ArrowLeft') {
    store.prevSecurity();
  } else if (e.altKey && e.key === 'ArrowRight') {
    store.nextSecurity();
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});

const toggleCheck = (idx: number) => {
  if (!sec.value) return;
  const key = `${sec.value.id}-${idx}`;
  checkedItems.value[key] = !checkedItems.value[key];
  const stateStr = checkedItems.value[key] ? 'Terverifikasi ✓' : 'Belum Terverifikasi';
  store.showToast(`Poin Keamanan #${idx + 1}: ${stateStr}`);
};

const checkedCount = computed(() => {
  if (!sec.value) return 0;
  return sec.value.checklist.filter((_, idx) => checkedItems.value[`${sec.value?.id}-${idx}`]).length;
});

function copySecId() {
  if (!sec.value) return;
  navigator.clipboard.writeText(sec.value.id);
  copiedSecId.value = true;
  store.showToast(`ID Pilar Keamanan ${sec.value.id} berhasil disalin!`);
  setTimeout(() => { copiedSecId.value = false; }, 2000);
}

function copyFilePath() {
  if (!sec.value) return;
  navigator.clipboard.writeText(sec.value.codeFile);
  copiedFilePath.value = true;
  store.showToast(`File target ${sec.value.codeFile} disalin!`);
  setTimeout(() => { copiedFilePath.value = false; }, 2000);
}

function copyCode(code: string) {
  navigator.clipboard.writeText(code);
  copiedCode.value = true;
  store.showToast('Cuplikan kode keamanan berhasil disalin!');
  setTimeout(() => { copiedCode.value = false; }, 2000);
}

function copyPaijoReport() {
  if (!sec.value) return;
  const tpl = `Lapor Kepatuhan Keamanan ke Paijo AI:
- Dokumen ID: ${sec.value.id}
- Pilar: #${sec.value.pillarNumber} - ${sec.value.title}
- Kategori: ${sec.value.category.toUpperCase()} (${sec.value.badge})
- File Proteksi: ${sec.value.codeFile}
- Status Audit: ${checkedCount.value} dari ${sec.value.checklist.length} Checklist Terverifikasi
- Vektor Ancaman: ${sec.value.threatVector}
- Kepatuhan: Memenuhi 20 Pilar Sandboxing & Zero-Trust HeroCMS.`;

  navigator.clipboard.writeText(tpl);
  copiedReport.value = true;
  store.showToast('Laporan kepatuhan keamanan ke Paijo AI berhasil disalin!');
  setTimeout(() => { copiedReport.value = false; }, 2000);
}

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
</script>

<template>
  <div v-if="sec" class="article-reader-page fade-in-section">
    <!-- 1. Reader Navigation Top Bar -->
    <div class="reader-top-action-bar">
      <!-- Left: Back Button & Breadcrumbs -->
      <div class="reader-breadcrumb-nav">
        <button class="btn-reader-back" @click="store.closeSecurity()" title="Kembali ke Matriks Keamanan (Esc)">
          <ArrowLeft :size="14" />
          <span>Kembali ke Matriks Keamanan</span>
        </button>
        <span class="reader-crumb-divider">/</span>
        <span class="reader-crumb-module" @click="store.closeSecurity()">
          Matriks Keamanan & Sandbox
        </span>
        <span class="reader-crumb-divider">/</span>
        <span class="reader-crumb-active" style="font-family: 'JetBrains Mono', monospace;">
          {{ sec.id }}
        </span>
      </div>

      <!-- Right: Action Buttons & Navigation -->
      <div class="reader-quick-actions">
        <!-- Distraction-Free Toggle -->
        <button
          class="btn-reader-action"
          @click="store.toggleReaderSidebar()"
          :title="store.isReaderSidebarHidden ? 'Tampilkan Sidebar Navigasi' : 'Sembunyikan Sidebar untuk Mode Baca Penuh'"
        >
          <PanelLeftOpen v-if="store.isReaderSidebarHidden" :size="13" />
          <PanelLeftClose v-else :size="13" />
          <span>{{ store.isReaderSidebarHidden ? 'Buka Sidebar' : 'Mode Fokus' }}</span>
        </button>

        <!-- Copy Security ID -->
        <button class="btn-reader-action" @click="copySecId()" title="Salin ID Keamanan">
          <Check v-if="copiedSecId" :size="13" color="#059669" />
          <Copy v-else :size="13" />
          <span>{{ copiedSecId ? 'Tersalin' : 'Salin ID' }}</span>
        </button>

        <!-- Lapor Paijo Button -->
        <button class="btn-reader-action" @click="copyPaijoReport()" title="Salin Format Laporan ke Paijo AI">
          <Check v-if="copiedReport" :size="13" color="#059669" />
          <Bot v-else :size="13" color="#2563eb" />
          <span>{{ copiedReport ? 'Laporan Tersalin' : 'Lapor Paijo' }}</span>
        </button>

        <!-- Previous / Next Navigation -->
        <div style="display: flex; align-items: center; gap: 4px; border-left: 1px solid #e2e8f0; padding-left: 8px; margin-left: 4px;">
          <button
            class="btn-reader-action"
            @click="store.prevSecurity()"
            title="Pilar Sebelumnya (Alt + Panah Kiri)"
            style="padding: 6px 10px;"
          >
            <ChevronLeft :size="14" />
            <span>Sebelumnya</span>
          </button>
          <button
            class="btn-reader-action"
            @click="store.nextSecurity()"
            title="Pilar Selanjutnya (Alt + Panah Kanan)"
            style="padding: 6px 10px;"
          >
            <span>Selanjutnya</span>
            <ChevronRight :size="14" />
          </button>
        </div>
      </div>
    </div>

    <!-- 2. Editorial Article Hero Banner -->
    <div class="reader-page-hero" style="background: linear-gradient(135deg, #090d16 0%, #1e1b4b 100%);">
      <div class="reader-hero-decor-grid"></div>

      <!-- Watermark Background Glyph -->
      <div style="position: absolute; right: 28px; bottom: -15px; opacity: 0.05; color: #ffffff; pointer-events: none;">
        <ShieldCheck :size="160" />
      </div>

      <div class="reader-hero-inner">
        <!-- Badges Row -->
        <div class="reader-hero-badges">
          <span class="nav-badge" style="font-family: 'JetBrains Mono', monospace; font-size: 0.78rem; font-weight: 700; background: rgba(255, 255, 255, 0.12); color: #ffffff; border-color: rgba(255, 255, 255, 0.2);">
            {{ sec.id }}
          </span>
          <span class="nav-badge badge-primary" style="font-weight: 700;">
            PILAR #{{ sec.pillarNumber }}
          </span>
          <span class="nav-badge" style="background: rgba(147, 51, 234, 0.25); color: #d8b4fe; border-color: rgba(216, 180, 254, 0.3); font-weight: 700;">
            {{ sec.category.toUpperCase() }}
          </span>
          <span class="nav-badge badge-success">
            {{ sec.badge }}
          </span>
          <span class="nav-badge" style="background: rgba(16, 185, 129, 0.2); color: #a7f3d0; border-color: rgba(167, 243, 208, 0.3);">
            <span class="mini-status-dot running" style="margin-right: 4px;"></span>
            ZERO-TRUST SECURITY STANDARD
          </span>
        </div>

        <!-- Large Editorial Title -->
        <h1 class="reader-page-title" style="margin-bottom: 12px; font-size: 1.85rem; line-height: 1.3;">
          {{ sec.title }}
        </h1>

        <!-- Hero Subtitle / Lead Paragraph -->
        <p style="color: #cbd5e1; font-size: 0.96rem; line-height: 1.6; margin: 0 0 24px 0; max-width: 840px;">
          {{ sec.summary }}
        </p>

        <!-- Meta Author & Service Strip -->
        <div class="reader-hero-meta-row">
          <div class="reader-author-profile">
            <div class="author-avatar-large" style="background: linear-gradient(135deg, #7c3aed, #4f46e5);">
              <ShieldCheck :size="18" color="#ffffff" />
            </div>
            <div class="author-info-group">
              <div class="author-primary-name" style="display: flex; align-items: center; gap: 6px;">
                <span>Security Officer: DevSecOps & QA Gatekeeper</span>
                <CheckCircle2 :size="13" color="#38bdf8" />
              </div>
              <div class="author-secondary-sub">
                <span>File Proteksi: {{ sec.codeFile }}</span>
                <span class="sub-sep">•</span>
                <span style="color: #a7f3d0; font-weight: 700;">Status: Hardened & Enforced</span>
              </div>
            </div>
          </div>

          <!-- Hero Metrics Strips -->
          <div class="reader-hero-metrics-strip">
            <div class="hero-metric-item">
              <CheckCircle2 :size="13" style="color: #10b981;" />
              <span class="metric-num">{{ sec.checklist.length }} Poin</span>
              <span class="metric-label">Checklist Kepatuhan</span>
            </div>
            <div class="hero-metric-item">
              <Terminal :size="13" style="color: #38bdf8;" />
              <span class="metric-num">{{ sec.verificationSteps.length }} Prosedur</span>
              <span class="metric-label">Uji Lapangan</span>
            </div>
            <div class="hero-metric-item">
              <ShieldAlert :size="13" style="color: #fbbf24;" />
              <span class="metric-num">Pilar #{{ sec.pillarNumber }}</span>
              <span class="metric-label">20 Pilar Sandboxing</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 3. 2-Column Article Reader Layout Grid -->
    <div class="reader-layout-grid">
      <!-- MAIN ARTICLE BODY (LEFT COLUMN) -->
      <main class="reader-main-content">
        <!-- Callout Strip: Code Reference -->
        <div id="section-file" class="reader-edge-callout">
          <div class="callout-icon-box" style="background: #fdf2f8; color: #db2777;">
            <FileCode :size="18" />
          </div>
          <div class="callout-text-box">
            <span class="callout-title">FILE RUJUKAN ENFORCEMENT & HARDENING:</span>
            <span class="callout-url">{{ sec.codeFile }}</span>
          </div>
          <button
            class="btn-copy-callout"
            @click="copyFilePath()"
            title="Salin Path File"
          >
            <Check v-if="copiedFilePath" :size="14" color="#059669" />
            <Copy v-else :size="14" />
          </button>
        </div>

        <!-- Section 1: Threat Vector Analysis -->
        <section id="section-threat" style="margin-bottom: 34px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 14px; padding-bottom: 8px; border-bottom: 1px solid #f1f5f9;">
            <AlertTriangle :size="18" style="color: #ea580c;" />
            <h2 style="margin: 0; font-size: 1.15rem; font-weight: 800; color: #0f172a; border: none; padding: 0;">
              01. Analisis Pemodelan Ancaman (Threat Modeling Vector)
            </h2>
          </div>
          <div style="background: #fffdfa; border: 1px solid #fed7aa; border-left: 5px solid #ea580c; border-radius: 12px; padding: 20px 22px;">
            <div style="display: flex; align-items: center; gap: 6px; font-size: 0.8rem; font-weight: 800; color: #9a3412; margin-bottom: 8px; text-transform: uppercase;">
              ⚠️ Dampak Keamanan & Potensi Eksploitasi:
            </div>
            <p style="font-size: 0.92rem; color: #7c2d12; line-height: 1.65; margin: 0; font-weight: 500;">
              {{ sec.threatVector }}
            </p>
          </div>
        </section>

        <!-- Section 2: Visual Pipeline Alur Verifikasi Kepatuhan -->
        <section id="section-flowchart" style="margin-bottom: 34px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 14px; padding-bottom: 8px; border-bottom: 1px solid #f1f5f9;">
            <Terminal :size="18" style="color: #059669;" />
            <h2 style="margin: 0; font-size: 1.15rem; font-weight: 800; color: #0f172a; border: none; padding: 0;">
              02. Alur Pengujian & Verifikasi Lapangan (Step-by-Step Pipeline)
            </h2>
          </div>
          <div class="flowchart-pipeline-container">
            <div
              v-for="(vStep, vIdx) in sec.verificationSteps"
              :key="vIdx"
              class="pipeline-step-item step-emerald"
            >
              <div class="pipeline-step-badge">
                <span class="pipeline-step-num">{{ vIdx + 1 }}</span>
                <div v-if="vIdx < sec.verificationSteps.length - 1" class="pipeline-step-line"></div>
              </div>
              <div class="pipeline-step-body">
                <div class="pipeline-step-header">
                  <span class="pipeline-step-tag">PROSEDUR {{ vIdx + 1 }}</span>
                </div>
                <p class="pipeline-step-text" style="font-family: 'JetBrains Mono', monospace; font-size: 0.82rem;">
                  {{ vStep }}
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- Section 3: Enforcement Mechanism -->
        <section id="section-enforcement" style="margin-bottom: 34px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 14px; padding-bottom: 8px; border-bottom: 1px solid #f1f5f9;">
            <ShieldCheck :size="18" style="color: #2563eb;" />
            <h2 style="margin: 0; font-size: 1.15rem; font-weight: 800; color: #0f172a; border: none; padding: 0;">
              03. Mekanisme Penegakan Kebijakan (Policy Enforcement)
            </h2>
          </div>
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px 22px;">
            <p style="font-size: 0.92rem; color: #334155; line-height: 1.7; margin: 0;">
              {{ sec.enforcement }}
            </p>
          </div>
        </section>

        <!-- Section 4: Code Implementation Snippet -->
        <section id="section-code" style="margin-bottom: 34px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 14px; padding-bottom: 8px; border-bottom: 1px solid #f1f5f9;">
            <FileCode :size="18" style="color: #2563eb;" />
            <h2 style="margin: 0; font-size: 1.15rem; font-weight: 800; color: #0f172a; border: none; padding: 0;">
              04. Implementasi Kode Teknis & Konfigurasi Hardening
            </h2>
          </div>

          <div class="terminal-code-card">
            <div class="terminal-code-header">
              <div class="terminal-dots">
                <span class="dot-red"></span>
                <span class="dot-yellow"></span>
                <span class="dot-green"></span>
                <span style="font-size: 0.72rem; color: #94a3b8; margin-left: 6px;">
                  {{ sec.codeFile.split('/').pop() }}
                </span>
              </div>
              <button
                class="btn-reader-action"
                style="background: #334155; color: #f8fafc; border: none; padding: 3px 8px; font-size: 0.72rem;"
                @click="copyCode(sec.codeSnippet)"
              >
                <Check v-if="copiedCode" :size="12" color="#34d399" />
                <Copy v-else :size="12" />
                <span>{{ copiedCode ? 'Tersalin' : 'Salin Kode' }}</span>
              </button>
            </div>
            <pre class="terminal-code-body" style="color: #6ee7b7;"><code>{{ sec.codeSnippet }}</code></pre>
          </div>
        </section>

        <!-- Section 5: Interactive Compliance Checklist -->
        <section id="section-checklist" style="margin-bottom: 10px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; padding-bottom: 8px; border-bottom: 1px solid #f1f5f9; flex-wrap: wrap; gap: 8px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <CheckCircle2 :size="18" style="color: #059669;" />
              <h2 style="margin: 0; font-size: 1.15rem; font-weight: 800; color: #0f172a; border: none; padding: 0;">
                05. Lembar Checklist Verifikasi Kepatuhan Audit
              </h2>
            </div>
            <span class="nav-badge badge-success" style="font-weight: 700;">
              {{ checkedCount }} / {{ sec.checklist.length }} Poin Terverifikasi
            </span>
          </div>

          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px 22px;">
            <p style="font-size: 0.86rem; color: #64748b; margin: 0 0 16px;">
              Klik setiap item di bawah ini untuk memverifikasi pemenuhan standar keamanan saat melakukan peninjauan kode (code review) atau audit pentest:
            </p>
            <div style="display: flex; flex-direction: column; gap: 10px;">
              <div
                v-for="(item, cIdx) in sec.checklist"
                :key="cIdx"
                @click="toggleCheck(cIdx)"
                style="display: flex; align-items: flex-start; gap: 12px; padding: 12px 14px; border-radius: 10px; cursor: pointer; transition: all 0.15s ease; border: 1px solid;"
                :style="{
                  background: checkedItems[`${sec.id}-${cIdx}`] ? '#ecfdf5' : '#f8fafc',
                  borderColor: checkedItems[`${sec.id}-${cIdx}`] ? '#a7f3d0' : '#e2e8f0'
                }"
              >
                <div
                  style="width: 20px; height: 20px; border-radius: 6px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px;"
                  :style="{
                    background: checkedItems[`${sec.id}-${cIdx}`] ? '#059669' : '#ffffff',
                    border: checkedItems[`${sec.id}-${cIdx}`] ? '1px solid #059669' : '1px solid #cbd5e1'
                  }"
                >
                  <Check v-if="checkedItems[`${sec.id}-${cIdx}`]" :size="14" color="#ffffff" />
                </div>
                <div style="flex: 1; font-size: 0.88rem; line-height: 1.5;" :style="{ color: checkedItems[`${sec.id}-${cIdx}`] ? '#065f46' : '#1e293b' }">
                  <span style="font-weight: 700; margin-right: 6px;">[Audit #{{ cIdx + 1 }}]</span>
                  <span :style="{ textDecoration: checkedItems[`${sec.id}-${cIdx}`] ? 'line-through' : 'none' }">{{ item }}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <!-- RIGHT INSPECTOR SIDEBAR -->
      <aside class="reader-sidebar-inspector">
        <!-- Inspector Card 1: Metadata Pilar -->
        <div class="inspector-card">
          <h3 class="inspector-title">
            <Lock :size="16" color="#2563eb" />
            <span>Metadata Pilar Keamanan</span>
          </h3>

          <div class="inspector-specs-list">
            <div class="spec-row">
              <span class="spec-k">ID Pilar:</span>
              <span class="spec-v" style="font-family: 'JetBrains Mono', monospace; color: #1d4ed8;">{{ sec.id }}</span>
            </div>
            <div class="spec-row">
              <span class="spec-k">Urutan:</span>
              <span class="spec-v">Pilar ke-{{ sec.pillarNumber }} dari 20</span>
            </div>
            <div class="spec-row">
              <span class="spec-k">Kategori:</span>
              <span class="nav-badge badge-primary">{{ sec.category.toUpperCase() }}</span>
            </div>
            <div class="spec-row">
              <span class="spec-k">Level Kepatuhan:</span>
              <span class="nav-badge badge-success">{{ sec.badge }}</span>
            </div>
            <div class="spec-row">
              <span class="spec-k">Status Prosedur:</span>
              <span class="spec-v">{{ sec.verificationSteps.length }} Langkah Uji</span>
            </div>
          </div>
        </div>

        <!-- Inspector Card 2: Quick Jump to Sections -->
        <div class="inspector-card">
          <h3 class="inspector-title">
            <Layers :size="15" color="#2563eb" />
            <span>Lompat ke Bagian Dokumen</span>
          </h3>
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <button
              class="btn-reader-action"
              style="justify-content: flex-start; text-align: left; width: 100%;"
              @click="scrollToSection('section-threat')"
            >
              01. Analisis Ancaman
            </button>
            <button
              class="btn-reader-action"
              style="justify-content: flex-start; text-align: left; width: 100%;"
              @click="scrollToSection('section-flowchart')"
            >
              02. Alur Uji Lapangan
            </button>
            <button
              class="btn-reader-action"
              style="justify-content: flex-start; text-align: left; width: 100%;"
              @click="scrollToSection('section-enforcement')"
            >
              03. Penegakan Kebijakan
            </button>
            <button
              class="btn-reader-action"
              style="justify-content: flex-start; text-align: left; width: 100%;"
              @click="scrollToSection('section-code')"
            >
              04. Implementasi Kode
            </button>
            <button
              class="btn-reader-action"
              style="justify-content: flex-start; text-align: left; width: 100%;"
              @click="scrollToSection('section-checklist')"
            >
              05. Lembar Checklist
            </button>
          </div>
        </div>

        <!-- Inspector Card 3: QA Sign-off & Actions -->
        <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 12px; padding: 16px; display: flex; flex-direction: column; gap: 10px;">
          <div style="display: flex; align-items: center; gap: 6px; font-size: 0.82rem; font-weight: 800; color: #92400e;">
            <AlertTriangle :size="16" />
            <span>Mandat Kepatuhan Zero-Trust</span>
          </div>
          <p style="margin: 0; font-size: 0.78rem; color: #78350f; line-height: 1.5;">
            Seluruh layanan dan kontainer tenant wajib menerapkan konfigurasi pada pilar ini sebelum lolos gatekeeper pentest pre-commit.
          </p>
          <button class="btn-read-sop" style="width: 100%; justify-content: center; margin-top: 4px;" @click="copyPaijoReport()">
            <Bot :size="14" />
            <span>Lapor Audit ke Paijo AI</span>
          </button>
        </div>
      </aside>
    </div>
  </div>
</template>
