<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Layers,
  Terminal,
  Server,
  Zap,
  TrendingUp,
  Milestone,
  CheckCircle2,
  Copy,
  Check,
  PanelLeftClose,
  PanelLeftOpen,
  Bot,
  FileText,
  AlertTriangle,
  FolderGit2
} from 'lucide-vue-next';
import { useDocsStore } from '../stores/docsStore';

const store = useDocsStore();
const prd = computed(() => store.activePrd);

const copiedPrdId = ref(false);
const copiedReport = ref(false);
const copiedSummary = ref(false);
const copiedApiIdx = ref<number | null>(null);

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    store.closePrd();
  } else if (e.altKey && e.key === 'ArrowLeft') {
    store.prevPrd();
  } else if (e.altKey && e.key === 'ArrowRight') {
    store.nextPrd();
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});

function copyPrdId() {
  if (!prd.value) return;
  navigator.clipboard.writeText(prd.value.id);
  copiedPrdId.value = true;
  store.showToast(`ID PRD ${prd.value.id} berhasil disalin!`);
  setTimeout(() => { copiedPrdId.value = false; }, 2000);
}

function copySummary() {
  if (!prd.value) return;
  navigator.clipboard.writeText(prd.value.summary);
  copiedSummary.value = true;
  store.showToast('Ringkasan PRD berhasil disalin!');
  setTimeout(() => { copiedSummary.value = false; }, 2000);
}

function copyApiPayload(payload: string, idx: number) {
  navigator.clipboard.writeText(payload);
  copiedApiIdx.value = idx;
  store.showToast('Sample Payload API berhasil disalin!');
  setTimeout(() => {
    if (copiedApiIdx.value === idx) copiedApiIdx.value = null;
  }, 2000);
}

function copyPaijoReport() {
  if (!prd.value) return;
  const tpl = `Lapor Kesiapan PRD ke Paijo AI:
- Dokumen ID: ${prd.value.id}
- Judul PRD: ${prd.value.title}
- Service: ${prd.value.serviceId} (${prd.value.serviceName})
- Versi Dokumen: ${prd.value.version} (${prd.value.badge})
- Modul Inti: ${prd.value.coreModules.length} Modul Terverifikasi
- Kontrak API: ${prd.value.apiContracts?.length || 0} Endpoints
- Tech Stack: ${prd.value.techStack.framework} / ${prd.value.techStack.language}
- Target NFR: ${prd.value.nfrs.map(n => `${n.metric}: ${n.target}`).join(', ')}
- Status: Siap Implementasi Sesuai Master Arsitektur HeroCMS.`;

  navigator.clipboard.writeText(tpl);
  copiedReport.value = true;
  store.showToast('Laporan PRD ke Paijo AI berhasil disalin!');
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
  <div v-if="prd" class="article-reader-page fade-in-section">
    <!-- 1. Reader Navigation Top Bar -->
    <div class="reader-top-action-bar">
      <!-- Left: Back Button & Breadcrumbs -->
      <div class="reader-breadcrumb-nav">
        <button class="btn-reader-back" @click="store.closePrd()" title="Kembali ke Katalog PRD (Esc)">
          <ArrowLeft :size="14" />
          <span>Kembali ke Katalog PRD</span>
        </button>
        <span class="reader-crumb-divider">/</span>
        <span class="reader-crumb-module" @click="store.closePrd()">
          Katalog PRD Layanan
        </span>
        <span class="reader-crumb-divider">/</span>
        <span class="reader-crumb-active" style="font-family: 'JetBrains Mono', monospace;">
          {{ prd.id }}
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

        <!-- Copy PRD ID -->
        <button class="btn-reader-action" @click="copyPrdId()" title="Salin ID PRD">
          <Check v-if="copiedPrdId" :size="13" color="#059669" />
          <Copy v-else :size="13" />
          <span>{{ copiedPrdId ? 'Tersalin' : 'Salin ID' }}</span>
        </button>

        <!-- Lapor Paijo Button -->
        <button class="btn-reader-action" @click="copyPaijoReport()" title="Salin Format Laporan ke Paijo AI">
          <Check v-if="copiedReport" :size="13" color="#059669" />
          <Bot v-else :size="13" color="#2563eb" />
          <span>{{ copiedReport ? 'Laporan Tersalin' : 'Lapor Paijo' }}</span>
        </button>

        <!-- Previous / Next PRD Navigation -->
        <div style="display: flex; align-items: center; gap: 4px; border-left: 1px solid #e2e8f0; padding-left: 8px; margin-left: 4px;">
          <button
            class="btn-reader-action"
            @click="store.prevPrd()"
            title="PRD Sebelumnya (Alt + Panah Kiri)"
            style="padding: 6px 10px;"
          >
            <ChevronLeft :size="14" />
            <span>Sebelumnya</span>
          </button>
          <button
            class="btn-reader-action"
            @click="store.nextPrd()"
            title="PRD Selanjutnya (Alt + Panah Kanan)"
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
        <FileText :size="160" />
      </div>

      <div class="reader-hero-inner">
        <!-- Badges Row -->
        <div class="reader-hero-badges">
          <span class="nav-badge" style="font-family: 'JetBrains Mono', monospace; font-size: 0.78rem; font-weight: 700; background: rgba(255, 255, 255, 0.12); color: #ffffff; border-color: rgba(255, 255, 255, 0.2);">
            {{ prd.id }}
          </span>
          <span class="nav-badge badge-primary" style="font-weight: 700;">
            {{ prd.serviceId }}
          </span>
          <span class="nav-badge badge-success">
            {{ prd.badge }}
          </span>
          <span class="nav-badge" style="background: rgba(37, 99, 235, 0.25); color: #93c5fd; border-color: rgba(147, 197, 253, 0.3); font-weight: 700;">
            {{ prd.version }}
          </span>
          <span class="nav-badge" style="background: rgba(16, 185, 129, 0.2); color: #a7f3d0; border-color: rgba(167, 243, 208, 0.3);">
            <span class="mini-status-dot running" style="margin-right: 4px;"></span>
            SPESIFIKASI KEBUTUHAN PRODUK
          </span>
        </div>

        <!-- Large Editorial Title -->
        <h1 class="reader-page-title" style="margin-bottom: 12px; font-size: 1.85rem; line-height: 1.3;">
          {{ prd.title }}
        </h1>

        <!-- Hero Subtitle / Lead Paragraph -->
        <p style="color: #cbd5e1; font-size: 0.96rem; line-height: 1.6; margin: 0 0 24px 0; max-width: 840px;">
          {{ prd.summary }}
        </p>

        <!-- Meta Author & Service Strip -->
        <div class="reader-hero-meta-row">
          <div class="reader-author-profile">
            <div class="author-avatar-large" style="background: linear-gradient(135deg, #2563eb, #1d4ed8);">
              <Server :size="18" color="#ffffff" />
            </div>
            <div class="author-info-group">
              <div class="author-primary-name" style="display: flex; align-items: center; gap: 6px;">
                <span>Microservice: {{ prd.serviceName }}</span>
                <CheckCircle2 :size="13" color="#38bdf8" />
              </div>
              <div class="author-secondary-sub">
                <span>Stack: {{ prd.techStack.framework }} ({{ prd.techStack.language }})</span>
                <span class="sub-sep">•</span>
                <span style="color: #a7f3d0; font-weight: 700;">Status: Ready for Implementation</span>
              </div>
            </div>
          </div>

          <!-- Hero Metrics Strips -->
          <div class="reader-hero-metrics-strip">
            <div class="hero-metric-item">
              <Layers :size="13" style="color: #38bdf8;" />
              <span class="metric-num">{{ prd.coreModules.length }} Modul</span>
              <span class="metric-label">Arsitektur Fungsional</span>
            </div>
            <div class="hero-metric-item">
              <Terminal :size="13" style="color: #10b981;" />
              <span class="metric-num">{{ prd.apiContracts?.length || 0 }} Endpoints</span>
              <span class="metric-label">Kontrak API</span>
            </div>
            <div class="hero-metric-item">
              <Zap :size="13" style="color: #fbbf24;" />
              <span class="metric-num">{{ prd.nfrs.length }} NFR</span>
              <span class="metric-label">Target SLA</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 3. 2-Column Article Reader Layout Grid -->
    <div class="reader-layout-grid">
      <!-- MAIN ARTICLE BODY (LEFT COLUMN) -->
      <main class="reader-main-content">
        <!-- Callout Strip: Repository & Service Workspace Path -->
        <div id="section-workspace" class="reader-edge-callout">
          <div class="callout-icon-box">
            <FolderGit2 :size="18" />
          </div>
          <div class="callout-text-box">
            <span class="callout-title">DIREKTORI WORKSPACE MICROSERVICE:</span>
            <span class="callout-url">services/{{ prd.serviceId }}/</span>
          </div>
          <button
            class="btn-copy-callout"
            @click="copySummary()"
            title="Salin Ringkasan PRD"
          >
            <Check v-if="copiedSummary" :size="14" color="#059669" />
            <Copy v-else :size="14" />
          </button>
        </div>

        <!-- Section 1: Target Audience & Persona -->
        <section id="section-audience" style="margin-bottom: 34px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 14px; padding-bottom: 8px; border-bottom: 1px solid #f1f5f9;">
            <Layers :size="18" style="color: #2563eb;" />
            <h2 style="margin: 0; font-size: 1.15rem; font-weight: 800; color: #0f172a; border: none; padding: 0;">
              01. Target Pengguna & Persona Pengguna Sistem
            </h2>
          </div>
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px 22px;">
            <p style="font-size: 0.88rem; color: #475569; margin: 0 0 16px; line-height: 1.6;">
              Layanan <strong>{{ prd.serviceName }}</strong> dirancang untuk melayani persona pengguna internal maupun eksternal dengan batasan hak akses ketat:
            </p>
            <ul class="step-test-list">
              <li v-for="(aud, idx) in prd.targetAudience" :key="idx" class="step-test-item">
                <span class="step-test-num" style="background: #eff6ff; border-color: #bfdbfe; color: #1d4ed8;">{{ idx + 1 }}</span>
                <span style="font-size: 0.88rem; color: #1e293b; font-weight: 600;">{{ aud }}</span>
              </li>
            </ul>
          </div>
        </section>

        <!-- Section 2: Visual Pipeline Alur Siklus Layanan -->
        <section id="section-lifecycle" style="margin-bottom: 34px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 14px; padding-bottom: 8px; border-bottom: 1px solid #f1f5f9;">
            <Terminal :size="18" style="color: #059669;" />
            <h2 style="margin: 0; font-size: 1.15rem; font-weight: 800; color: #0f172a; border: none; padding: 0;">
              02. Alur Kerja & Eksekusi Modul Fungsional
            </h2>
          </div>
          <div class="flowchart-pipeline-container">
            <div
              v-for="(mod, mIdx) in prd.coreModules"
              :key="mIdx"
              class="pipeline-step-item step-emerald"
            >
              <div class="pipeline-step-badge">
                <span class="pipeline-step-num">{{ mIdx + 1 }}</span>
                <div v-if="mIdx < prd.coreModules.length - 1" class="pipeline-step-line"></div>
              </div>
              <div class="pipeline-step-body">
                <div class="pipeline-step-header">
                  <span class="pipeline-step-tag">MODUL {{ mIdx + 1 }}</span>
                </div>
                <h4 style="margin: 0 0 4px; font-size: 0.95rem; font-weight: 700; color: #0f172a;">{{ mod.name }}</h4>
                <p class="pipeline-step-text">{{ mod.desc }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Section 3: Rincian Lengkap Modul Fungsional Inti -->
        <section id="section-modules" style="margin-bottom: 34px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 14px; padding-bottom: 8px; border-bottom: 1px solid #f1f5f9;">
            <Server :size="18" style="color: #2563eb;" />
            <h2 style="margin: 0; font-size: 1.15rem; font-weight: 800; color: #0f172a; border: none; padding: 0;">
              03. Rincian Modul Fungsional Inti & Kapabilitas ({{ prd.coreModules.length }} Modul)
            </h2>
          </div>

          <div style="display: flex; flex-direction: column; gap: 16px;">
            <div
              v-for="(mod, mIdx) in prd.coreModules"
              :key="mIdx"
              style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px 22px; box-shadow: 0 1px 3px rgba(15, 23, 42, 0.03);"
            >
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; flex-wrap: wrap; gap: 8px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span class="task-id-chip">M-0{{ mIdx + 1 }}</span>
                  <h3 style="font-size: 1.05rem; font-weight: 800; color: #0f172a; margin: 0;">{{ mod.name }}</h3>
                </div>
                <span class="nav-badge badge-primary">{{ mod.capabilities.length }} Kapabilitas</span>
              </div>

              <p style="font-size: 0.88rem; color: #475569; line-height: 1.6; margin: 0 0 14px;">
                {{ mod.desc }}
              </p>

              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 16px;">
                <div style="font-size: 0.76rem; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 0.03em;">
                  Kapabilitas Wajib yang Harus Tersedia:
                </div>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                  <div
                    v-for="(cap, cIdx) in mod.capabilities"
                    :key="cIdx"
                    style="display: flex; align-items: flex-start; gap: 8px; font-size: 0.84rem; color: #1e293b;"
                  >
                    <CheckCircle2 :size="15" color="#059669" style="flex-shrink: 0; margin-top: 2px;" />
                    <span>{{ cap }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Section 4: API & Inter-Service Integration Contracts -->
        <section v-if="prd.apiContracts && prd.apiContracts.length > 0" id="section-api" style="margin-bottom: 34px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 14px; padding-bottom: 8px; border-bottom: 1px solid #f1f5f9;">
            <Terminal :size="18" style="color: #2563eb;" />
            <h2 style="margin: 0; font-size: 1.15rem; font-weight: 800; color: #0f172a; border: none; padding: 0;">
              04. Kontrak Endpoint API & Integrasi Antar-Layanan ({{ prd.apiContracts.length }} Endpoints)
            </h2>
          </div>

          <div style="display: flex; flex-direction: column; gap: 16px;">
            <div
              v-for="(api, aIdx) in prd.apiContracts"
              :key="aIdx"
              style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px 22px;"
            >
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; flex-wrap: wrap; gap: 8px;">
                <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                  <span
                    class="nav-badge"
                    :class="api.method === 'GET' ? 'badge-primary' : api.method === 'POST' ? 'badge-success' : 'badge-warning'"
                    style="font-size: 0.8rem; font-weight: 800;"
                  >
                    {{ api.method }}
                  </span>
                  <code style="font-weight: 700; color: #0f172a; font-size: 0.94rem; background: #f1f5f9; padding: 3px 8px; border-radius: 6px;">
                    {{ api.endpoint }}
                  </code>
                </div>
                <span class="nav-badge">REST Standard</span>
              </div>

              <p style="font-size: 0.86rem; color: #475569; margin: 0 0 14px; line-height: 1.55;">
                {{ api.desc }}
              </p>

              <!-- Request Payload Box -->
              <div v-if="api.samplePayload" class="terminal-code-card" style="margin-bottom: 12px;">
                <div class="terminal-code-header">
                  <div class="terminal-dots">
                    <span class="dot-red"></span>
                    <span class="dot-yellow"></span>
                    <span class="dot-green"></span>
                    <span style="font-size: 0.72rem; color: #94a3b8; margin-left: 6px;">Request Payload (JSON)</span>
                  </div>
                  <button
                    class="btn-reader-action"
                    style="background: #334155; color: #f8fafc; border: none; padding: 3px 8px; font-size: 0.72rem;"
                    @click="copyApiPayload(api.samplePayload, aIdx)"
                  >
                    <Check v-if="copiedApiIdx === aIdx" :size="12" color="#34d399" />
                    <Copy v-else :size="12" />
                    <span>{{ copiedApiIdx === aIdx ? 'Tersalin' : 'Salin Payload' }}</span>
                  </button>
                </div>
                <pre class="terminal-code-body" style="color: #93c5fd;"><code>{{ api.samplePayload }}</code></pre>
              </div>

              <!-- Response Sample Box -->
              <div v-if="api.sampleResponse" class="terminal-code-card">
                <div class="terminal-code-header">
                  <div class="terminal-dots">
                    <span class="dot-red"></span>
                    <span class="dot-yellow"></span>
                    <span class="dot-green"></span>
                    <span style="font-size: 0.72rem; color: #94a3b8; margin-left: 6px;">Expected Response (JSON)</span>
                  </div>
                </div>
                <pre class="terminal-code-body" style="color: #6ee7b7;"><code>{{ api.sampleResponse }}</code></pre>
              </div>
            </div>
          </div>
        </section>

        <!-- Section 5: Non-Functional Requirements (NFR) & SLA -->
        <section id="section-nfr" style="margin-bottom: 34px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 14px; padding-bottom: 8px; border-bottom: 1px solid #f1f5f9;">
            <Zap :size="18" style="color: #d97706;" />
            <h2 style="margin: 0; font-size: 1.15rem; font-weight: 800; color: #0f172a; border: none; padding: 0;">
              05. Kebutuhan Non-Fungsional (NFR) & Komitmen SLA
            </h2>
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 14px;">
            <div
              v-for="(nfr, nIdx) in prd.nfrs"
              :key="nIdx"
              style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px 20px; box-shadow: 0 1px 3px rgba(15, 23, 42, 0.03);"
            >
              <div style="font-size: 0.76rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.03em;">
                {{ nfr.metric }}
              </div>
              <div style="font-size: 1.15rem; font-weight: 800; color: #2563eb; margin: 6px 0 8px;">
                {{ nfr.target }}
              </div>
              <div style="font-size: 0.82rem; color: #475569; line-height: 1.5; background: #f8fafc; padding: 8px 10px; border-radius: 6px; border: 1px solid #e2e8f0;">
                ⚙️ <strong>Strategi:</strong> {{ nfr.strategy }}
              </div>
            </div>
          </div>
        </section>

        <!-- Section 6: Implementation Roadmap -->
        <section id="section-roadmap" style="margin-bottom: 34px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 14px; padding-bottom: 8px; border-bottom: 1px solid #f1f5f9;">
            <Milestone :size="18" style="color: #2563eb;" />
            <h2 style="margin: 0; font-size: 1.15rem; font-weight: 800; color: #0f172a; border: none; padding: 0;">
              06. Roadmap Tahapan Implementasi & Deliverables
            </h2>
          </div>
          <div class="flowchart-pipeline-container">
            <div
              v-for="(phase, pIdx) in prd.roadmap"
              :key="pIdx"
              class="pipeline-step-item"
            >
              <div class="pipeline-step-badge">
                <span class="pipeline-step-num">{{ pIdx + 1 }}</span>
                <div v-if="pIdx < prd.roadmap.length - 1" class="pipeline-step-line"></div>
              </div>
              <div class="pipeline-step-body">
                <div class="pipeline-step-header" style="justify-content: space-between; flex-wrap: wrap; gap: 6px;">
                  <span class="pipeline-step-tag">{{ phase.phase }}</span>
                  <span class="nav-badge badge-primary">{{ phase.timeline }}</span>
                </div>
                <h4 style="margin: 0 0 8px; font-size: 0.95rem; font-weight: 700; color: #0f172a;">{{ phase.title }}</h4>
                <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                  <span v-for="(del, dIdx) in phase.deliverables" :key="dIdx" class="bp-req-pill">
                    ✓ {{ del }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Section 7: Key Performance Indicators (KPIs) -->
        <section id="section-kpis" style="margin-bottom: 10px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 14px; padding-bottom: 8px; border-bottom: 1px solid #f1f5f9;">
            <TrendingUp :size="18" style="color: #059669;" />
            <h2 style="margin: 0; font-size: 1.15rem; font-weight: 800; color: #0f172a; border: none; padding: 0;">
              07. Indikator Kinerja Utama (Key Performance Indicators)
            </h2>
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px;">
            <div
              v-for="(kpi, kIdx) in prd.kpis"
              :key="kIdx"
              style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; padding: 18px 20px;"
            >
              <div style="font-size: 0.76rem; font-weight: 700; color: #047857; text-transform: uppercase;">
                {{ kpi.name }}
              </div>
              <div style="font-size: 1.2rem; font-weight: 800; color: #065f46; margin-top: 6px;">
                {{ kpi.target }}
              </div>
            </div>
          </div>
        </section>
      </main>

      <!-- RIGHT INSPECTOR SIDEBAR -->
      <aside class="reader-sidebar-inspector">
        <!-- Inspector Card 1: Technical Stack Specifications -->
        <div class="inspector-card">
          <h3 class="inspector-title">
            <Cpu :size="16" color="#2563eb" />
            <span>Spesifikasi Stack Teknis</span>
          </h3>

          <div class="inspector-specs-list">
            <div class="spec-row">
              <span class="spec-k">Microservice:</span>
              <span class="nav-badge badge-primary">{{ prd.serviceId }}</span>
            </div>
            <div class="spec-row">
              <span class="spec-k">Framework:</span>
              <span class="spec-v">{{ prd.techStack.framework }}</span>
            </div>
            <div class="spec-row">
              <span class="spec-k">Bahasa:</span>
              <span class="spec-v">{{ prd.techStack.language }}</span>
            </div>
            <div class="spec-row">
              <span class="spec-k">Runtime:</span>
              <span class="spec-v">{{ prd.techStack.runtime }}</span>
            </div>
            <div class="spec-row" v-if="prd.techStack.databases && prd.techStack.databases.length > 0">
              <span class="spec-k">Database:</span>
              <div style="display: flex; flex-direction: column; gap: 4px; align-items: flex-end;">
                <span v-for="(db, dbIdx) in prd.techStack.databases" :key="dbIdx" class="bp-req-pill" style="font-size: 0.72rem;">{{ db }}</span>
              </div>
            </div>
          </div>

          <h4 style="font-size: 0.74rem; font-weight: 700; color: #64748b; margin: 16px 0 8px; text-transform: uppercase; letter-spacing: 0.03em;">Pustaka Kunci:</h4>
          <div style="display: flex; flex-wrap: wrap; gap: 6px;">
            <span v-for="(lib, lIdx) in prd.techStack.keyLibraries" :key="lIdx" class="bp-req-pill">
              {{ lib }}
            </span>
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
              @click="scrollToSection('section-audience')"
            >
              01. Target Pengguna & Persona
            </button>
            <button
              class="btn-reader-action"
              style="justify-content: flex-start; text-align: left; width: 100%;"
              @click="scrollToSection('section-lifecycle')"
            >
              02. Alur Eksekusi Modul
            </button>
            <button
              class="btn-reader-action"
              style="justify-content: flex-start; text-align: left; width: 100%;"
              @click="scrollToSection('section-modules')"
            >
              03. Rincian Modul Fungsional
            </button>
            <button
              v-if="prd.apiContracts && prd.apiContracts.length > 0"
              class="btn-reader-action"
              style="justify-content: flex-start; text-align: left; width: 100%;"
              @click="scrollToSection('section-api')"
            >
              04. Kontrak Endpoint API
            </button>
            <button
              class="btn-reader-action"
              style="justify-content: flex-start; text-align: left; width: 100%;"
              @click="scrollToSection('section-nfr')"
            >
              05. Kebutuhan NFR & SLA
            </button>
            <button
              class="btn-reader-action"
              style="justify-content: flex-start; text-align: left; width: 100%;"
              @click="scrollToSection('section-roadmap')"
            >
              06. Roadmap Deliverables
            </button>
            <button
              class="btn-reader-action"
              style="justify-content: flex-start; text-align: left; width: 100%;"
              @click="scrollToSection('section-kpis')"
            >
              07. Indikator Kinerja (KPIs)
            </button>
          </div>
        </div>

        <!-- Inspector Card 3: QA Sign-off & Actions -->
        <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 12px; padding: 16px; display: flex; flex-direction: column; gap: 10px;">
          <div style="display: flex; align-items: center; gap: 6px; font-size: 0.82rem; font-weight: 800; color: #92400e;">
            <AlertTriangle :size="16" />
            <span>Verifikasi QA Gatekeeper</span>
          </div>
          <p style="margin: 0; font-size: 0.78rem; color: #78350f; line-height: 1.5;">
            Pengembangan fitur di microservice ini wajib mengikuti seluruh kontrak endpoint API, batasan NFR, dan lulus pentest suite sebelum rilis.
          </p>
          <button class="btn-read-sop" style="width: 100%; justify-content: center; margin-top: 4px;" @click="copyPaijoReport()">
            <Bot :size="14" />
            <span>Lapor Kesiapan ke Paijo AI</span>
          </button>
        </div>
      </aside>
    </div>
  </div>
</template>
