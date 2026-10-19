<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import {
  ArrowLeft,
  Check,
  Copy,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  Bot,
  Terminal,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  AlertTriangle,
  ShieldAlert,
  FileCode,
  Sparkles
} from 'lucide-vue-next';
import { useDocsStore } from '../stores/docsStore';

const store = useDocsStore();
const sop = computed(() => store.activeSop);

const copiedSopId = ref(false);
const copiedReport = ref(false);
const copiedCommandIndex = ref<number | null>(null);
const isCurlCopied = ref(false);

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    store.closeSop();
  } else if (e.altKey && e.key === 'ArrowLeft') {
    store.prevSop();
  } else if (e.altKey && e.key === 'ArrowRight') {
    store.nextSop();
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});

function copySopId() {
  if (!sop.value) return;
  navigator.clipboard.writeText(sop.value.id);
  copiedSopId.value = true;
  store.showToast(`SOP ID ${sop.value.id} berhasil disalin!`);
  setTimeout(() => { copiedSopId.value = false; }, 2000);
}

function copyCommand(cmd: string, idx: number) {
  navigator.clipboard.writeText(cmd);
  copiedCommandIndex.value = idx;
  store.showToast('Perintah CLI berhasil disalin!');
  setTimeout(() => {
    if (copiedCommandIndex.value === idx) copiedCommandIndex.value = null;
  }, 2000);
}

function copyCurl(curl: string) {
  navigator.clipboard.writeText(curl);
  isCurlCopied.value = true;
  store.showToast('Perintah cURL berhasil disalin!');
  setTimeout(() => {
    isCurlCopied.value = false;
  }, 2000);
}

function copyPaijoReport() {
  if (!sop.value) return;
  const tpl = `Lapor Kepatuhan SOP ke Paijo AI:
- Penanggung Jawab: ${sop.value.pic}
- Nomor SOP: ${sop.value.id}
- Judul SOP: ${sop.value.title}
- Kategori: ${sop.value.category}
- Status: 100% Wajib Dipatuhi (${sop.value.badge})
- Runbook Steps: ${sop.value.steps.length} Langkah Terverifikasi
- Aturan Mutlak: ${sop.value.dos.length} Do's, ${sop.value.donts.length} Don'ts
- Bukti Audit: Telah ditinjau sesuai standar HeroCMS Studio & QA Gatekeeper.`;

  navigator.clipboard.writeText(tpl);
  copiedReport.value = true;
  store.showToast('Laporan kepatuhan SOP ke Paijo AI berhasil disalin!');
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
  <div v-if="sop" class="article-reader-page fade-in-section">
    <!-- 1. Reader Navigation Top Bar -->
    <div class="reader-top-action-bar">
      <!-- Left: Back Button & Breadcrumbs -->
      <div class="reader-breadcrumb-nav">
        <button class="btn-reader-back" @click="store.closeSop()" title="Kembali ke SOP & Runbooks (Esc)">
          <ArrowLeft :size="14" />
          <span>Kembali ke SOP & Runbooks</span>
        </button>
        <span class="reader-crumb-divider">/</span>
        <span class="reader-crumb-module" @click="store.closeSop()">
          Standar Operasional Prosedur
        </span>
        <span class="reader-crumb-divider">/</span>
        <span class="reader-crumb-active" style="font-family: 'JetBrains Mono', monospace;">
          {{ sop.id }}
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

        <!-- Copy SOP ID -->
        <button class="btn-reader-action" @click="copySopId()" title="Salin ID SOP">
          <Check v-if="copiedSopId" :size="13" color="#059669" />
          <Copy v-else :size="13" />
          <span>{{ copiedSopId ? 'Tersalin' : 'Salin ID' }}</span>
        </button>

        <!-- Lapor Paijo Button -->
        <button class="btn-reader-action" @click="copyPaijoReport()" title="Salin Format Laporan ke Paijo AI">
          <Check v-if="copiedReport" :size="13" color="#059669" />
          <Bot v-else :size="13" color="#2563eb" />
          <span>{{ copiedReport ? 'Laporan Tersalin' : 'Lapor Paijo' }}</span>
        </button>

        <!-- Previous / Next SOP Navigation -->
        <div style="display: flex; align-items: center; gap: 4px; border-left: 1px solid #e2e8f0; padding-left: 8px; margin-left: 4px;">
          <button
            class="btn-reader-action"
            @click="store.prevSop()"
            title="SOP Sebelumnya (Alt + Panah Kiri)"
            style="padding: 6px 10px;"
          >
            <ChevronLeft :size="14" />
            <span>Sebelumnya</span>
          </button>
          <button
            class="btn-reader-action"
            @click="store.nextSop()"
            title="SOP Selanjutnya (Alt + Panah Kanan)"
            style="padding: 6px 10px;"
          >
            <span>Selanjutnya</span>
            <ChevronRight :size="14" />
          </button>
        </div>
      </div>
    </div>

    <!-- 2. Editorial Article Hero Banner -->
    <div class="reader-page-hero" style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);">
      <div class="reader-hero-decor-grid"></div>

      <!-- Watermark Background Glyph -->
      <div style="position: absolute; right: 28px; bottom: -15px; opacity: 0.05; color: #ffffff; pointer-events: none;">
        <Terminal :size="160" />
      </div>

      <div class="reader-hero-inner">
        <!-- Badges Row -->
        <div class="reader-hero-badges">
          <span class="nav-badge" style="font-family: 'JetBrains Mono', monospace; font-size: 0.78rem; font-weight: 700; background: rgba(255, 255, 255, 0.12); color: #ffffff; border-color: rgba(255, 255, 255, 0.2);">
            {{ sop.id }}
          </span>
          <span class="nav-badge" style="background: rgba(37, 99, 235, 0.25); color: #93c5fd; border-color: rgba(147, 197, 253, 0.3); font-weight: 700;">
            {{ sop.category }}
          </span>
          <span class="nav-badge" style="background: rgba(245, 158, 11, 0.2); color: #fde68a; border-color: rgba(253, 230, 138, 0.3); font-weight: 700;">
            {{ sop.badge }}
          </span>
          <span class="nav-badge" style="background: rgba(16, 185, 129, 0.2); color: #a7f3d0; border-color: rgba(167, 243, 208, 0.3);">
            <span class="mini-status-dot running" style="margin-right: 4px;"></span>
            STANDAR OPERASIONAL PROSEDUR
          </span>
        </div>

        <!-- Large Editorial Title -->
        <h1 class="reader-page-title" style="margin-bottom: 12px; font-size: 1.85rem; line-height: 1.3;">
          {{ sop.title }}
        </h1>

        <!-- Hero Subtitle / Lead Paragraph -->
        <p style="color: #cbd5e1; font-size: 0.96rem; line-height: 1.6; margin: 0 0 24px 0; max-width: 820px;">
          {{ sop.purpose }}
        </p>

        <!-- Meta Author & Handover Strip -->
        <div class="reader-hero-meta-row">
          <!-- Personil Profiles -->
          <div class="reader-author-profile">
            <div class="author-avatar-large" style="background: linear-gradient(135deg, #2563eb, #1d4ed8);">
              {{ sop.pic.substring(0, 2).toUpperCase() }}
            </div>
            <div class="author-info-group">
              <div class="author-primary-name" style="display: flex; align-items: center; gap: 6px;">
                <span>Penanggung Jawab: {{ sop.pic }}</span>
                <CheckCircle2 :size="13" color="#38bdf8" />
              </div>
              <div class="author-secondary-sub">
                <span>QA Gatekeeper: Paijo AI Agent</span>
                <span class="sub-sep">•</span>
                <span style="color: #93c5fd; font-weight: 700;">Status Kepatuhan: 100% Wajib Dipatuhi</span>
              </div>
            </div>
          </div>

          <!-- Hero Metrics Strips -->
          <div class="reader-hero-metrics-strip">
            <div class="hero-metric-item">
              <CheckCircle2 :size="13" style="color: #10b981;" />
              <span class="metric-num">{{ sop.steps.length }} Langkah</span>
              <span class="metric-label">Runbook</span>
            </div>
            <div class="hero-metric-item">
              <Terminal :size="13" style="color: #38bdf8;" />
              <span class="metric-num">{{ sop.commands?.length || 0 }} CLI</span>
              <span class="metric-label">Perintah Siap Pakai</span>
            </div>
            <div class="hero-metric-item">
              <ShieldAlert :size="13" style="color: #fbbf24;" />
              <span class="metric-num">{{ sop.dos.length }} Do / {{ sop.donts.length }} Don't</span>
              <span class="metric-label">Matriks Aturan</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 3. 2-Column Article Reader Layout Grid -->
    <div class="reader-layout-grid">
      <!-- MAIN ARTICLE BODY (LEFT COLUMN) -->
      <main class="reader-main-content">
        <!-- Section 1: Visual Flowchart Pengerjaan -->
        <section v-if="sop.flowchart && sop.flowchart.length > 0" id="section-flowchart" style="margin-bottom: 34px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 14px; padding-bottom: 8px; border-bottom: 1px solid #f1f5f9;">
            <Terminal :size="18" style="color: #2563eb;" />
            <h2 style="margin: 0; font-size: 1.15rem; font-weight: 800; color: #0f172a; border: none; padding: 0;">
              01. Diagram Alur Pengerjaan (Step Flowchart)
            </h2>
          </div>
          <div class="flowchart-pipeline-container">
            <div
              v-for="(node, nIdx) in sop.flowchart"
              :key="nIdx"
              class="pipeline-step-item"
            >
              <div class="pipeline-step-badge">
                <span class="pipeline-step-num">{{ nIdx + 1 }}</span>
                <div v-if="nIdx < sop.flowchart.length - 1" class="pipeline-step-line"></div>
              </div>
              <div class="pipeline-step-body">
                <div class="pipeline-step-header">
                  <span class="pipeline-step-tag">TAHAP {{ nIdx + 1 }}</span>
                </div>
                <p class="pipeline-step-text">{{ node }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Section 2: Langkah-Langkah Eksekusi Runbook -->
        <section id="section-steps" style="margin-bottom: 34px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 14px; padding-bottom: 8px; border-bottom: 1px solid #f1f5f9;">
            <CheckCircle2 :size="18" style="color: #059669;" />
            <h2 style="margin: 0; font-size: 1.15rem; font-weight: 800; color: #0f172a; border: none; padding: 0;">
              02. Langkah-Langkah Eksekusi Prosedur (Runbook Steps)
            </h2>
          </div>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px 22px;">
            <ul class="step-test-list">
              <li v-for="(step, sIdx) in sop.steps" :key="sIdx" class="step-test-item">
                <span class="step-test-num" style="background: #ecfdf5; border-color: #a7f3d0; color: #047857;">{{ sIdx + 1 }}</span>
                <span>{{ step }}</span>
              </li>
            </ul>
          </div>
        </section>

        <!-- Section 3: Matriks Do's & Don'ts (DND) -->
        <section id="section-dnd" style="margin-bottom: 34px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 14px; padding-bottom: 8px; border-bottom: 1px solid #f1f5f9;">
            <ShieldAlert :size="18" style="color: #d97706;" />
            <h2 style="margin: 0; font-size: 1.15rem; font-weight: 800; color: #0f172a; border: none; padding: 0;">
              03. Matriks Aturan Wajib (Do's) & Larangan Keras (Don'ts)
            </h2>
          </div>
          <div class="dnd-matrix-container">
            <!-- DOs Column -->
            <div class="dnd-column dos">
              <div class="dnd-header">
                <CheckCircle2 :size="18" />
                <span>DO'S — WAJIB DILAKUKAN</span>
              </div>
              <ul class="dnd-list">
                <li v-for="(item, dIdx) in sop.dos" :key="dIdx">
                  <CheckCircle2 :size="15" style="flex-shrink: 0; margin-top: 2px;" />
                  <span>{{ item }}</span>
                </li>
              </ul>
            </div>

            <!-- DONTs Column -->
            <div class="dnd-column donts">
              <div class="dnd-header">
                <XCircle :size="18" />
                <span>DON'TS — DILARANG KERAS</span>
              </div>
              <ul class="dnd-list">
                <li v-for="(item, dIdx) in sop.donts" :key="dIdx">
                  <XCircle :size="15" style="flex-shrink: 0; margin-top: 2px;" />
                  <span>{{ item }}</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <!-- Section 4: Perintah Terminal CLI -->
        <section v-if="sop.commands && sop.commands.length > 0" id="section-commands" style="margin-bottom: 34px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 14px; padding-bottom: 8px; border-bottom: 1px solid #f1f5f9;">
            <Terminal :size="18" style="color: #2563eb;" />
            <h2 style="margin: 0; font-size: 1.15rem; font-weight: 800; color: #0f172a; border: none; padding: 0;">
              04. Perintah Terminal & Perintah Uji Cepat (CLI)
            </h2>
          </div>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div
              v-for="(cmd, cIdx) in sop.commands"
              :key="cIdx"
              class="terminal-code-card"
            >
              <div class="terminal-code-header">
                <div class="terminal-dots">
                  <span class="dot-red"></span>
                  <span class="dot-yellow"></span>
                  <span class="dot-green"></span>
                  <span style="font-size: 0.72rem; color: #94a3b8; margin-left: 6px;">zsh terminal</span>
                </div>
                <button
                  class="btn-reader-action"
                  style="background: #334155; color: #f8fafc; border: none; padding: 3px 8px; font-size: 0.72rem;"
                  @click="copyCommand(cmd, cIdx)"
                >
                  <Check v-if="copiedCommandIndex === cIdx" :size="12" color="#34d399" />
                  <Copy v-else :size="12" />
                  <span>{{ copiedCommandIndex === cIdx ? 'Tersalin' : 'Salin Perintah' }}</span>
                </button>
              </div>
              <pre class="terminal-code-body"><code>{{ cmd }}</code></pre>
            </div>
          </div>
        </section>

        <!-- Section 5: API Call & Integrasi Golang Backend -->
        <section v-if="sop.apiExample" id="section-api" style="margin-bottom: 34px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 14px; padding-bottom: 8px; border-bottom: 1px solid #f1f5f9;">
            <FileCode :size="18" style="color: #059669;" />
            <h2 style="margin: 0; font-size: 1.15rem; font-weight: 800; color: #0f172a; border: none; padding: 0;">
              05. Spesifikasi API Call & Integrasi Golang Backend
            </h2>
          </div>

          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px 22px;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px; flex-wrap: wrap;">
              <span class="nav-badge badge-primary">{{ sop.apiExample.method }}</span>
              <code style="font-weight: 700; color: #0f172a; font-size: 0.92rem;">{{ sop.apiExample.endpoint }}</code>
              <span class="nav-badge badge-success">{{ sop.apiExample.service }}</span>
            </div>
            <p style="font-size: 0.86rem; color: #475569; margin: 0 0 16px; line-height: 1.5;">
              {{ sop.apiExample.description }}
            </p>

            <!-- cURL Window Box -->
            <div class="terminal-code-card" style="margin-bottom: 14px;">
              <div class="terminal-code-header">
                <span class="terminal-code-title">HTTP Request via cURL</span>
                <button
                  class="btn-reader-action"
                  style="background: #334155; color: #f8fafc; border: none; padding: 3px 8px; font-size: 0.72rem;"
                  @click="copyCurl(sop.apiExample!.curl)"
                >
                  <Check v-if="isCurlCopied" :size="12" color="#34d399" />
                  <Copy v-else :size="12" />
                  <span>{{ isCurlCopied ? 'Tersalin' : 'Salin cURL' }}</span>
                </button>
              </div>
              <pre class="terminal-code-body"><code>{{ sop.apiExample.curl }}</code></pre>
            </div>

            <!-- Go Handler Snippet -->
            <div v-if="sop.apiExample.goHandlerSnippet" class="terminal-code-card" style="margin-bottom: 14px;">
              <div class="terminal-code-header">
                <span class="terminal-code-title">Implementasi Handler di Golang</span>
              </div>
              <pre class="terminal-code-body" style="color: #a7f3d0;"><code>{{ sop.apiExample.goHandlerSnippet }}</code></pre>
            </div>

            <!-- Response Sample -->
            <div v-if="sop.apiExample.responseSample" class="terminal-code-card">
              <div class="terminal-code-header">
                <span class="terminal-code-title">Sample Response JSON / Output</span>
              </div>
              <pre class="terminal-code-body" style="color: #fde047;"><code>{{ sop.apiExample.responseSample }}</code></pre>
            </div>
          </div>
        </section>

        <!-- Section 6: Kriteria Verifikasi DoD & Sign-Off -->
        <section v-if="sop.verificationCriteria" id="section-dod" style="margin-bottom: 10px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 14px; padding-bottom: 8px; border-bottom: 1px solid #f1f5f9;">
            <ShieldCheck :size="18" style="color: #059669;" />
            <h2 style="margin: 0; font-size: 1.15rem; font-weight: 800; color: #0f172a; border: none; padding: 0;">
              06. Kriteria Verifikasi DoD & Quality Gate
            </h2>
          </div>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px 22px;">
            <ul style="margin: 0; padding-left: 20px; display: flex; flex-direction: column; gap: 10px; font-size: 0.86rem; color: #334155; line-height: 1.55;">
              <li v-for="(crit, crIdx) in sop.verificationCriteria" :key="crIdx">
                {{ crit }}
              </li>
            </ul>
          </div>
        </section>
      </main>

      <!-- RIGHT INSPECTOR SIDEBAR -->
      <aside class="reader-sidebar-inspector">
        <!-- Inspector Card -->
        <div class="inspector-card">
          <h3 class="inspector-title">
            <ShieldCheck :size="16" color="#2563eb" />
            <span>Metadata SOP & Runbook</span>
          </h3>

          <div class="inspector-specs-list">
            <div class="spec-row">
              <span class="spec-k">Nomor SOP:</span>
              <span class="spec-v" style="font-family: 'JetBrains Mono', monospace; color: #1d4ed8;">{{ sop.id }}</span>
            </div>
            <div class="spec-row">
              <span class="spec-k">Kategori:</span>
              <span class="spec-v">{{ sop.category }}</span>
            </div>
            <div class="spec-row">
              <span class="spec-k">Penanggung Jawab:</span>
              <span class="spec-v" style="font-weight: 700; color: #0f172a;">{{ sop.pic }}</span>
            </div>
            <div class="spec-row">
              <span class="spec-k">Tingkat Kepatuhan:</span>
              <span class="nav-badge badge-warning">{{ sop.badge }}</span>
            </div>
            <div class="spec-row">
              <span class="spec-k">Total Runbook Steps:</span>
              <span class="spec-v">{{ sop.steps.length }} Tahap</span>
            </div>
            <div class="spec-row">
              <span class="spec-k">Matriks Aturan:</span>
              <span class="spec-v">{{ sop.dos.length }} Do / {{ sop.donts.length }} Don't</span>
            </div>
          </div>
        </div>

        <!-- Quick Jump to Sections -->
        <div class="inspector-card">
          <h3 class="inspector-title">
            <Sparkles :size="15" color="#2563eb" />
            <span>Lompat ke Bagian Artikel</span>
          </h3>
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <button
              v-if="sop.flowchart && sop.flowchart.length > 0"
              class="btn-reader-action"
              style="justify-content: flex-start; text-align: left; width: 100%;"
              @click="scrollToSection('section-flowchart')"
            >
              01. Diagram Alur Flowchart
            </button>
            <button
              class="btn-reader-action"
              style="justify-content: flex-start; text-align: left; width: 100%;"
              @click="scrollToSection('section-steps')"
            >
              02. Langkah Eksekusi Runbook
            </button>
            <button
              class="btn-reader-action"
              style="justify-content: flex-start; text-align: left; width: 100%;"
              @click="scrollToSection('section-dnd')"
            >
              03. Matriks Do's & Don'ts
            </button>
            <button
              v-if="sop.commands && sop.commands.length > 0"
              class="btn-reader-action"
              style="justify-content: flex-start; text-align: left; width: 100%;"
              @click="scrollToSection('section-commands')"
            >
              04. Perintah Terminal (CLI)
            </button>
            <button
              v-if="sop.apiExample"
              class="btn-reader-action"
              style="justify-content: flex-start; text-align: left; width: 100%;"
              @click="scrollToSection('section-api')"
            >
              05. API Call & Golang Backend
            </button>
            <button
              v-if="sop.verificationCriteria"
              class="btn-reader-action"
              style="justify-content: flex-start; text-align: left; width: 100%;"
              @click="scrollToSection('section-dod')"
            >
              06. Kriteria Verifikasi DoD
            </button>
          </div>
        </div>

        <!-- QA/QC Sign-off Warning Box -->
        <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 12px; padding: 16px; display: flex; flex-direction: column; gap: 8px;">
          <div style="display: flex; align-items: center; gap: 6px; font-size: 0.82rem; font-weight: 800; color: #92400e;">
            <AlertTriangle :size="16" />
            <span>Pemberitahuan QA Gatekeeper</span>
          </div>
          <p style="margin: 0; font-size: 0.78rem; color: #78350f; line-height: 1.5;">
            Seluruh pull request yang melanggar ketentuan pada SOP ini akan ditolak secara otomatis oleh bot review Paijo (Lead PM & QA/QC).
          </p>
        </div>
      </aside>
    </div>
  </div>
</template>
