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
  BookOpen,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  AlertTriangle,
  FileCode,
  Sparkles,
  Cpu,
  Layers,
  Terminal
} from 'lucide-vue-next';
import { useDocsStore } from '../stores/docsStore';

const store = useDocsStore();
const bp = computed(() => store.activeBlueprint);

const copiedBpId = ref(false);
const copiedReport = ref(false);
const copiedFilePath = ref(false);
const isCliCopied = ref(false);
const isCurlCopied = ref(false);

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    store.closeBlueprint();
  } else if (e.altKey && e.key === 'ArrowLeft') {
    store.prevBlueprint();
  } else if (e.altKey && e.key === 'ArrowRight') {
    store.nextBlueprint();
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});

function copyBpId() {
  if (!bp.value) return;
  navigator.clipboard.writeText(bp.value.id);
  copiedBpId.value = true;
  store.showToast(`Blueprint ID ${bp.value.id} berhasil disalin!`);
  setTimeout(() => { copiedBpId.value = false; }, 2000);
}

function copyFilePath() {
  if (!bp.value) return;
  navigator.clipboard.writeText(bp.value.fileReference);
  copiedFilePath.value = true;
  store.showToast(`File rujukan ${bp.value.fileReference} disalin!`);
  setTimeout(() => { copiedFilePath.value = false; }, 2000);
}

function copyCli(cmd: string) {
  navigator.clipboard.writeText(cmd);
  isCliCopied.value = true;
  store.showToast('Perintah CLI uji cepat berhasil disalin!');
  setTimeout(() => { isCliCopied.value = false; }, 2000);
}

function copyCurl(curl: string) {
  navigator.clipboard.writeText(curl);
  isCurlCopied.value = true;
  store.showToast('Perintah cURL berhasil disalin!');
  setTimeout(() => { isCurlCopied.value = false; }, 2000);
}

function copyPaijoReport() {
  if (!bp.value) return;
  const tpl = `Lapor Integrasi Arsitektur ke Paijo AI:
- Blueprint ID: ${bp.value.id}
- Istilah/Fitur: ${bp.value.term}
- Service: ${bp.value.service} (${bp.value.serviceName})
- Target File: ${bp.value.fileReference}
- Status: Siap Pakai & Terverifikasi Produksi
- Endpoint API: ${bp.value.apiEndpoint ? `${bp.value.apiEndpoint.method} ${bp.value.apiEndpoint.path}` : 'N/A'}
- Catatan Integrasi: Telah memenuhi arsitektur standar HeroCMS Studio.`;

  navigator.clipboard.writeText(tpl);
  copiedReport.value = true;
  store.showToast('Laporan arsitektur ke Paijo AI berhasil disalin!');
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
  <div v-if="bp" class="article-reader-page fade-in-section">
    <!-- 1. Reader Navigation Top Bar -->
    <div class="reader-top-action-bar">
      <!-- Left: Back Button & Breadcrumbs -->
      <div class="reader-breadcrumb-nav">
        <button class="btn-reader-back" @click="store.closeBlueprint()" title="Kembali ke Kamus Arsitektur (Esc)">
          <ArrowLeft :size="14" />
          <span>Kembali ke Kamus Arsitektur</span>
        </button>
        <span class="reader-crumb-divider">/</span>
        <span class="reader-crumb-module" @click="store.closeBlueprint()">
          Kamus Arsitektur
        </span>
        <span class="reader-crumb-divider">/</span>
        <span class="reader-crumb-active" style="font-family: 'JetBrains Mono', monospace;">
          {{ bp.id }}
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

        <!-- Copy Blueprint ID -->
        <button class="btn-reader-action" @click="copyBpId()" title="Salin ID Blueprint">
          <Check v-if="copiedBpId" :size="13" color="#059669" />
          <Copy v-else :size="13" />
          <span>{{ copiedBpId ? 'Tersalin' : 'Salin ID' }}</span>
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
            @click="store.prevBlueprint()"
            title="Blueprint Sebelumnya (Alt + Panah Kiri)"
            style="padding: 6px 10px;"
          >
            <ChevronLeft :size="14" />
            <span>Sebelumnya</span>
          </button>
          <button
            class="btn-reader-action"
            @click="store.nextBlueprint()"
            title="Blueprint Selanjutnya (Alt + Panah Kanan)"
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
        <Cpu :size="160" />
      </div>

      <div class="reader-hero-inner">
        <!-- Badges Row -->
        <div class="reader-hero-badges">
          <span class="nav-badge" style="font-family: 'JetBrains Mono', monospace; font-size: 0.78rem; font-weight: 700; background: rgba(255, 255, 255, 0.12); color: #ffffff; border-color: rgba(255, 255, 255, 0.2);">
            {{ bp.id }}
          </span>
          <span class="nav-badge badge-primary" style="font-weight: 700;">
            {{ bp.service }}
          </span>
          <span class="nav-badge badge-success">
            {{ bp.category }}
          </span>
          <span class="nav-badge" style="background: rgba(16, 185, 129, 0.2); color: #a7f3d0; border-color: rgba(167, 243, 208, 0.3);">
            <span class="mini-status-dot running" style="margin-right: 4px;"></span>
            BLUEPRINT ARSITEKTUR TERVERIFIKASI
          </span>
        </div>

        <!-- Large Editorial Title -->
        <h1 class="reader-page-title" style="margin-bottom: 12px; font-size: 1.85rem; line-height: 1.3;">
          <span style="margin-right: 6px;">{{ bp.icon }}</span>
          {{ bp.term }}
        </h1>

        <!-- Hero Subtitle / Lead Paragraph -->
        <p style="color: #cbd5e1; font-size: 0.96rem; line-height: 1.6; margin: 0 0 24px 0; max-width: 820px;">
          {{ bp.definition }}
        </p>

        <!-- Meta Author & Service Strip -->
        <div class="reader-hero-meta-row">
          <div class="reader-author-profile">
            <div class="author-avatar-large" style="background: linear-gradient(135deg, #059669, #047857);">
              <BookOpen :size="18" color="#ffffff" />
            </div>
            <div class="author-info-group">
              <div class="author-primary-name" style="display: flex; align-items: center; gap: 6px;">
                <span>Target Service: {{ bp.serviceName }}</span>
                <CheckCircle2 :size="13" color="#34d399" />
              </div>
              <div class="author-secondary-sub">
                <span>Rujukan: {{ bp.fileReference }}</span>
                <span class="sub-sep">•</span>
                <span style="color: #a7f3d0; font-weight: 700;">Status: Standar Produksi</span>
              </div>
            </div>
          </div>

          <!-- Hero Metrics Strips -->
          <div class="reader-hero-metrics-strip">
            <div class="hero-metric-item">
              <Layers :size="13" style="color: #38bdf8;" />
              <span class="metric-num" :title="bp.service">{{ bp.service.split('/')[0].trim() }}</span>
              <span class="metric-label">Microservice</span>
            </div>
            <div v-if="bp.apiEndpoint" class="hero-metric-item">
              <Terminal :size="13" style="color: #10b981;" />
              <span class="metric-num">Port {{ bp.apiEndpoint.port }}</span>
              <span class="metric-label">HTTP API</span>
            </div>
            <div class="hero-metric-item">
              <CheckCircle2 :size="13" style="color: #f59e0b;" />
              <span class="metric-num">{{ bp.dos.length }} Do / {{ bp.donts.length }} Don't</span>
              <span class="metric-label">Aturan Mutlak</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 3. 2-Column Article Reader Layout Grid -->
    <div class="reader-layout-grid">
      <!-- MAIN ARTICLE BODY (LEFT COLUMN) -->
      <main class="reader-main-content">
        <!-- Section: File Reference Callout -->
        <div id="section-file" class="reader-edge-callout">
          <div class="callout-icon-box">
            <FileCode :size="18" />
          </div>
          <div class="callout-text-box">
            <span class="callout-title">FILE RUJUKAN ARSITEKTUR / KONTRAK IMPLEMENTASI:</span>
            <span class="callout-url" :title="bp.fileReference">{{ bp.fileReference }}</span>
          </div>
          <button
            class="btn-copy-callout"
            @click="copyFilePath()"
            :title="copiedFilePath ? 'Tersalin!' : 'Salin Path File'"
          >
            <Check v-if="copiedFilePath" :size="14" color="#059669" />
            <Copy v-else :size="14" />
          </button>
        </div>

        <!-- Section 1: Konsep, Alasan Rancang Bangun & Arsitektur -->
        <section id="section-concept" style="margin-bottom: 34px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 14px; padding-bottom: 8px; border-bottom: 1px solid #f1f5f9;">
            <BookOpen :size="18" style="color: #2563eb;" />
            <h2 style="margin: 0; font-size: 1.15rem; font-weight: 800; color: #0f172a; border: none; padding: 0;">
              01. Konsep, Alasan Rancang Bangun & Arsitektur Sistem
            </h2>
          </div>
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px 22px;">
            <p style="font-size: 0.92rem; color: #1e293b; line-height: 1.7; margin: 0 0 16px;">
              {{ bp.inDepthExplanation }}
            </p>

            <div style="font-size: 0.76rem; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 8px;">
              ⚙️ Kebutuhan Sistem & Dependensi Modul:
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
              <span
                v-for="(req, rIdx) in bp.requirements"
                :key="rIdx"
                class="nav-badge"
                style="font-family: 'JetBrains Mono', monospace; font-size: 0.74rem; background: #f8fafc; border-color: #cbd5e1; color: #334155;"
              >
                {{ req }}
              </span>
            </div>
          </div>
        </section>

        <!-- Section 2: Flowchart Arsitektur -->
        <section v-if="bp.flowchart && bp.flowchart.length > 0" id="section-flowchart" style="margin-bottom: 34px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 14px; padding-bottom: 8px; border-bottom: 1px solid #f1f5f9;">
            <Terminal :size="18" style="color: #059669;" />
            <h2 style="margin: 0; font-size: 1.15rem; font-weight: 800; color: #0f172a; border: none; padding: 0;">
              02. Diagram Alur Data & Interaksi Komponen
            </h2>
          </div>
          <div class="flowchart-pipeline-container">
            <div
              v-for="(node, nIdx) in bp.flowchart"
              :key="nIdx"
              class="pipeline-step-item step-emerald"
            >
              <div class="pipeline-step-badge">
                <span class="pipeline-step-num">{{ nIdx + 1 }}</span>
                <div v-if="nIdx < bp.flowchart.length - 1" class="pipeline-step-line"></div>
              </div>
              <div class="pipeline-step-body">
                <div class="pipeline-step-header">
                  <span class="pipeline-step-tag">LANGKAH {{ nIdx + 1 }}</span>
                </div>
                <p class="pipeline-step-text">{{ node }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Section 3: Implementasi Golang Backend -->
        <section v-if="bp.golangImplementation" id="section-golang" style="margin-bottom: 34px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 14px; padding-bottom: 8px; border-bottom: 1px solid #f1f5f9;">
            <FileCode :size="18" style="color: #2563eb;" />
            <h2 style="margin: 0; font-size: 1.15rem; font-weight: 800; color: #0f172a; border: none; padding: 0;">
              03. Implementasi Kode Golang Backend
            </h2>
          </div>

          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px 22px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
              <div style="display: flex; align-items: center; gap: 6px;">
                <FileCode :size="16" color="#059669" />
                <span style="font-family: 'JetBrains Mono', monospace; font-size: 0.84rem; font-weight: 700; color: #0f172a;">
                  {{ bp.golangImplementation.file }}
                </span>
              </div>
              <span class="nav-badge badge-success">Golang 1.22+ Standard</span>
            </div>

            <p style="font-size: 0.86rem; color: #475569; margin: 0 0 14px; line-height: 1.55;">
              {{ bp.golangImplementation.explanation }}
            </p>

            <!-- macOS Dark Code Box -->
            <div class="terminal-code-card">
              <div class="terminal-code-header">
                <div class="terminal-dots">
                  <span class="dot-red"></span>
                  <span class="dot-yellow"></span>
                  <span class="dot-green"></span>
                  <span style="font-size: 0.72rem; color: #94a3b8; margin-left: 6px;">
                    {{ bp.golangImplementation.file.split('/').pop() }}
                  </span>
                </div>
              </div>
              <pre class="terminal-code-body" style="color: #6ee7b7;"><code>{{ bp.golangImplementation.codeSnippet }}</code></pre>
            </div>
          </div>
        </section>

        <!-- Section 4: API Endpoint & Panduan Cara Coba (Live Testing) -->
        <section v-if="bp.apiEndpoint" id="section-api" style="margin-bottom: 34px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 14px; padding-bottom: 8px; border-bottom: 1px solid #f1f5f9;">
            <Terminal :size="18" style="color: #059669;" />
            <h2 style="margin: 0; font-size: 1.15rem; font-weight: 800; color: #0f172a; border: none; padding: 0;">
              04. Spesifikasi API Endpoint & Panduan Cara Coba (Live Testing)
            </h2>
          </div>

          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px 22px;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px; flex-wrap: wrap;">
              <span
                class="nav-badge"
                :class="bp.apiEndpoint.method === 'GET' ? 'badge-primary' : 'badge-success'"
                style="font-size: 0.8rem; font-weight: 800;"
              >
                {{ bp.apiEndpoint.method }}
              </span>
              <code style="font-weight: 700; color: #0f172a; font-size: 0.94rem;">
                {{ bp.apiEndpoint.path }}
              </code>
              <span class="nav-badge">Port: {{ bp.apiEndpoint.port }}</span>
            </div>

            <p style="font-size: 0.86rem; color: #475569; margin: 0 0 16px; line-height: 1.5;">
              {{ bp.apiEndpoint.description }}
            </p>

            <!-- cURL Window Box -->
            <div class="terminal-code-card" style="margin-bottom: 16px;">
              <div class="terminal-code-header">
                <span class="terminal-code-title">Perintah cURL Siap Eksekusi</span>
                <button
                  class="btn-reader-action"
                  style="background: #334155; color: #f8fafc; border: none; padding: 3px 8px; font-size: 0.72rem;"
                  @click="copyCurl(bp.apiEndpoint!.curlCommand)"
                >
                  <Check v-if="isCurlCopied" :size="12" color="#34d399" />
                  <Copy v-else :size="12" />
                  <span>{{ isCurlCopied ? 'Tersalin' : 'Salin cURL' }}</span>
                </button>
              </div>
              <pre class="terminal-code-body"><code>{{ bp.apiEndpoint.curlCommand }}</code></pre>
            </div>

            <!-- JSON Request Body (jika ada) -->
            <div v-if="bp.apiEndpoint.requestBody" class="terminal-code-card" style="margin-bottom: 16px;">
              <div class="terminal-code-header">
                <span class="terminal-code-title">Request Body (JSON)</span>
              </div>
              <pre class="terminal-code-body" style="color: #93c5fd;"><code>{{ bp.apiEndpoint.requestBody }}</code></pre>
            </div>

            <!-- JSON Response Sample -->
            <div class="terminal-code-card" style="margin-bottom: 16px;">
              <div class="terminal-code-header">
                <span class="terminal-code-title">Expected Response Body (JSON)</span>
              </div>
              <pre class="terminal-code-body" style="color: #fde047;"><code>{{ bp.apiEndpoint.responseSample }}</code></pre>
            </div>

            <!-- Cara Coba Step-by-Step -->
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px 18px;">
              <div style="font-size: 0.8rem; font-weight: 700; color: #0f172a; margin-bottom: 12px; text-transform: uppercase;">
                🧪 Langkah Cara Coba di Lingkungan Lokal / Staging:
              </div>
              <ul class="step-test-list">
                <li v-for="(trialStep, tIdx) in bp.apiEndpoint.howToTest" :key="tIdx" class="step-test-item">
                  <span class="step-test-num">{{ tIdx + 1 }}</span>
                  <span>{{ trialStep }}</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <!-- Section 5: Matriks Do's & Don'ts -->
        <section id="section-dnd" style="margin-bottom: 34px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 14px; padding-bottom: 8px; border-bottom: 1px solid #f1f5f9;">
            <ShieldCheck :size="18" style="color: #d97706;" />
            <h2 style="margin: 0; font-size: 1.15rem; font-weight: 800; color: #0f172a; border: none; padding: 0;">
              05. Aturan Mutlak (Do's) & Larangan Keras (Don'ts)
            </h2>
          </div>
          <div class="dnd-matrix-container">
            <!-- DOs Column -->
            <div class="dnd-column dos">
              <div class="dnd-header">
                <CheckCircle2 :size="18" />
                <span>DO'S — ATURAN MUTLAK</span>
              </div>
              <ul class="dnd-list">
                <li v-for="(item, dIdx) in bp.dos" :key="dIdx">
                  <CheckCircle2 :size="15" style="flex-shrink: 0; margin-top: 2px;" />
                  <span>{{ item }}</span>
                </li>
              </ul>
            </div>

            <!-- DONTs Column -->
            <div class="dnd-column donts">
              <div class="dnd-header">
                <XCircle :size="18" />
                <span>DON'TS — LARANGAN MUTLAK</span>
              </div>
              <ul class="dnd-list">
                <li v-for="(item, dIdx) in bp.donts" :key="dIdx">
                  <XCircle :size="15" style="flex-shrink: 0; margin-top: 2px;" />
                  <span>{{ item }}</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <!-- Section 6: Perintah CLI Uji Cepat -->
        <section v-if="bp.cliCommand" id="section-cli" style="margin-bottom: 10px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 14px; padding-bottom: 8px; border-bottom: 1px solid #f1f5f9;">
            <Terminal :size="18" style="color: #2563eb;" />
            <h2 style="margin: 0; font-size: 1.15rem; font-weight: 800; color: #0f172a; border: none; padding: 0;">
              06. Perintah CLI Uji Cepat di Host
            </h2>
          </div>
          <div class="terminal-code-card">
            <div class="terminal-code-header">
              <div class="terminal-dots">
                <span class="dot-red"></span>
                <span class="dot-yellow"></span>
                <span class="dot-green"></span>
                <span style="font-size: 0.72rem; color: #94a3b8; margin-left: 6px;">bash / zsh host</span>
              </div>
              <button
                class="btn-reader-action"
                style="background: #334155; color: #f8fafc; border: none; padding: 3px 8px; font-size: 0.72rem;"
                @click="copyCli(bp.cliCommand)"
              >
                <Check v-if="isCliCopied" :size="12" color="#34d399" />
                <Copy v-else :size="12" />
                <span>{{ isCliCopied ? 'Tersalin' : 'Salin Perintah' }}</span>
              </button>
            </div>
            <pre class="terminal-code-body"><code>{{ bp.cliCommand }}</code></pre>
          </div>
        </section>
      </main>

      <!-- RIGHT INSPECTOR SIDEBAR -->
      <aside class="reader-sidebar-inspector">
        <!-- Inspector Card -->
        <div class="inspector-card">
          <h3 class="inspector-title">
            <ShieldCheck :size="16" color="#2563eb" />
            <span>Metadata Arsitektur</span>
          </h3>

          <div class="inspector-specs-list">
            <div class="spec-row">
              <span class="spec-k">ID Blueprint:</span>
              <span class="spec-v" style="font-family: 'JetBrains Mono', monospace; color: #1d4ed8;">{{ bp.id }}</span>
            </div>
            <div class="spec-row">
              <span class="spec-k">Target Service:</span>
              <span class="nav-badge badge-primary" :title="bp.service">{{ bp.service.split('/')[0].trim() }}</span>
            </div>
            <div class="spec-row">
              <span class="spec-k">Kategori:</span>
              <span class="spec-v">{{ bp.category }}</span>
            </div>
            <div class="spec-row">
              <span class="spec-k">Status:</span>
              <span class="nav-badge badge-success">Standar Produksi</span>
            </div>
            <div v-if="bp.apiEndpoint" class="spec-row">
              <span class="spec-k">Port HTTP:</span>
              <span class="spec-v">{{ bp.apiEndpoint.port }}</span>
            </div>
            <div class="spec-row">
              <span class="spec-k">Matriks Aturan:</span>
              <span class="spec-v">{{ bp.dos.length }} Do / {{ bp.donts.length }} Don't</span>
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
              class="btn-reader-action"
              style="justify-content: flex-start; text-align: left; width: 100%;"
              @click="scrollToSection('section-concept')"
            >
              01. Rancang Bangun & Arsitektur
            </button>
            <button
              v-if="bp.flowchart && bp.flowchart.length > 0"
              class="btn-reader-action"
              style="justify-content: flex-start; text-align: left; width: 100%;"
              @click="scrollToSection('section-flowchart')"
            >
              02. Diagram Alur Flowchart
            </button>
            <button
              v-if="bp.golangImplementation"
              class="btn-reader-action"
              style="justify-content: flex-start; text-align: left; width: 100%;"
              @click="scrollToSection('section-golang')"
            >
              03. Implementasi Kode Golang
            </button>
            <button
              v-if="bp.apiEndpoint"
              class="btn-reader-action"
              style="justify-content: flex-start; text-align: left; width: 100%;"
              @click="scrollToSection('section-api')"
            >
              04. API & Panduan Cara Coba
            </button>
            <button
              class="btn-reader-action"
              style="justify-content: flex-start; text-align: left; width: 100%;"
              @click="scrollToSection('section-dnd')"
            >
              05. Matriks Do's & Don'ts
            </button>
            <button
              v-if="bp.cliCommand"
              class="btn-reader-action"
              style="justify-content: flex-start; text-align: left; width: 100%;"
              @click="scrollToSection('section-cli')"
            >
              06. Perintah CLI Uji Cepat
            </button>
          </div>
        </div>

        <!-- QA/QC Sign-off Warning Box -->
        <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 12px; padding: 16px; display: flex; flex-direction: column; gap: 8px;">
          <div style="display: flex; align-items: center; gap: 6px; font-size: 0.82rem; font-weight: 800; color: #92400e;">
            <AlertTriangle :size="16" />
            <span>Verifikasi QA & Security</span>
          </div>
          <p style="margin: 0; font-size: 0.78rem; color: #78350f; line-height: 1.5;">
            Seluruh integrasi backend ke blueprint ini wajib mematuhi aturan Do's dan lolos pengujian pentest runner per-service.
          </p>
        </div>
      </aside>
    </div>
  </div>
</template>
