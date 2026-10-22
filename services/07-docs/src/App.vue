<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted } from 'vue';
import {
  Layers,
  FolderKanban,
  Server,
  BookOpen,
  Terminal,
  LifeBuoy,
  ChevronRight,
  User,
  CheckCircle2,
  X,
  ShieldCheck,
  FileText,
  GitBranch
} from 'lucide-vue-next';
import { useDocsStore } from './stores/docsStore';
import BackgroundWave from './components/BackgroundWave.vue';
import TelemetryGrid from './components/TelemetryGrid.vue';

// Lazy-Loaded Views
const TaskArticleReader = defineAsyncComponent(() => import('./components/TaskArticleReader.vue'));
const SopArticleReader = defineAsyncComponent(() => import('./components/SopArticleReader.vue'));
const ArchitectureArticleReader = defineAsyncComponent(() => import('./components/ArchitectureArticleReader.vue'));
const PrdArticleReader = defineAsyncComponent(() => import('./components/PrdArticleReader.vue'));
const SecurityArticleReader = defineAsyncComponent(() => import('./components/SecurityArticleReader.vue'));

const TaskBoardModule = defineAsyncComponent(() => import('./components/TaskBoardModule.vue'));
const PrdCatalogModule = defineAsyncComponent(() => import('./components/PrdCatalogModule.vue'));
const ArchitectureModule = defineAsyncComponent(() => import('./components/ArchitectureModule.vue'));
const SystemJourneyModule = defineAsyncComponent(() => import('./components/SystemJourneyModule.vue'));
const SecurityMatrixModule = defineAsyncComponent(() => import('./components/SecurityMatrixModule.vue'));
const SopRunbookModule = defineAsyncComponent(() => import('./components/SopRunbookModule.vue'));
const PaijoProtocolModule = defineAsyncComponent(() => import('./components/PaijoProtocolModule.vue'));

const store = useDocsStore();

onMounted(async () => {
  await store.fetchTasks();
});

const currentBreadcrumbTitle = computed(() => {
  switch (store.activeTab) {
    case 'tasks': return 'Papan Tugas per Divisi (6 Divisi)';
    case 'services': return 'Papan Tugas per Microservice (7 Layanan)';
    case 'prds': return 'Spesifikasi Kebutuhan Produk (PRD 7 Layanan)';
    case 'blueprints': return 'Kamus & Blueprint Arsitektur Sistem';
    case 'journeys': return 'Alur Kerja Sistem (System Journeys)';
    case 'security': return 'Matriks Keamanan & Sandboxing (20 Pilar)';
    case 'sops': return 'Standar Operasional Prosedur (SOP Runbooks)';
    case 'paijo': return 'Protokol Paijo AI (PM & QA/QC Specialist)';
    default: return 'Mission Control Portal';
  }
});
</script>

<template>
  <div id="dashboard-app-root">
    <!-- 1. Background Wave with Dot Grid & Gaussian Ambient Glow -->
    <BackgroundWave />

    <div class="dashboard-root-layout" style="position: relative; z-index: 1;">
      <div class="app-shell" :class="{ 'reader-immersive-mode': store.isReaderSidebarHidden && (store.activeTask || store.activeSop || store.activeBlueprint || store.activePrd || store.activeSecurity) }">
        <!-- 2. LEFT SIDEBAR: Professional Cloud Console Navigation -->
        <aside class="app-sidebar">
          <!-- Workspace Brand Switcher -->
          <div class="sidebar-header">
            <div class="workspace-brand-header">
              <div class="brand-glyph">
                <Layers :size="18" color="#ffffff" />
              </div>
              <div class="brand-meta">
                <div class="brand-title">
                  Aether Core <span class="brand-gradient">Docs</span>
                </div>
                <div class="brand-plan-row">
                  <span class="pulse-green"></span>
                  <span class="plan-name">Mission Control Hub</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Navigation Sections -->
          <div class="sidebar-nav-sections">
            <div class="nav-section-title">PAPAN TUGAS & SPRINT</div>
            <nav class="sidebar-nav-list">
              <button
                class="nav-link"
                :class="{ active: store.activeTab === 'tasks' }"
                @click="store.setActiveTab('tasks'); store.setGroupingMode('division')"
              >
                <FolderKanban :size="17" />
                <span class="nav-link-text">Tugas per Divisi</span>
                <span class="nav-badge">{{ store.telemetry.totalTasks }} Ongoing</span>
              </button>

              <button
                class="nav-link"
                :class="{ active: store.activeTab === 'services' }"
                @click="store.setActiveTab('services'); store.setGroupingMode('service')"
              >
                <Server :size="17" />
                <span class="nav-link-text">Tugas per Service</span>
                <span class="nav-badge">{{ store.telemetry.totalServices }} Services</span>
              </button>
            </nav>

            <div class="nav-section-title">ARSITEKTUR & SPESIFIKASI</div>
            <nav class="sidebar-nav-list">
              <button
                class="nav-link"
                :class="{ active: store.activeTab === 'prds' }"
                @click="store.setActiveTab('prds')"
              >
                <FileText :size="17" />
                <span class="nav-link-text">PRD Semua Layanan</span>
                <span class="nav-badge badge-warning">{{ store.telemetry.totalPrds }} PRD</span>
              </button>

              <button
                class="nav-link"
                :class="{ active: store.activeTab === 'blueprints' }"
                @click="store.setActiveTab('blueprints')"
              >
                <BookOpen :size="17" />
                <span class="nav-link-text">Kamus Arsitektur</span>
                <span class="nav-badge badge-primary">{{ store.telemetry.totalBlueprints }} Blueprint</span>
              </button>

              <button
                class="nav-link"
                :class="{ active: store.activeTab === 'journeys' }"
                @click="store.setActiveTab('journeys')"
              >
                <GitBranch :size="17" />
                <span class="nav-link-text">Alur Kerja Sistem</span>
                <span class="nav-badge badge-primary">{{ store.telemetry.totalJourneys }} Alur</span>
              </button>

              <button
                class="nav-link"
                :class="{ active: store.activeTab === 'security' }"
                @click="store.setActiveTab('security')"
              >
                <ShieldCheck :size="17" />
                <span class="nav-link-text">Keamanan & Sandbox</span>
                <span class="nav-badge badge-success">{{ store.telemetry.totalSecurityPillars }} Pilar</span>
              </button>

              <button
                class="nav-link"
                :class="{ active: store.activeTab === 'sops' }"
                @click="store.setActiveTab('sops')"
              >
                <Terminal :size="17" />
                <span class="nav-link-text">SOP & Runbooks</span>
                <span class="nav-badge badge-success">{{ store.telemetry.totalSops }} SOP</span>
              </button>
            </nav>

            <div class="nav-section-title">PROJECT MANAGEMENT</div>
            <nav class="sidebar-nav-list">
              <button
                class="nav-link"
                :class="{ active: store.activeTab === 'paijo' }"
                @click="store.setActiveTab('paijo')"
              >
                <LifeBuoy :size="17" />
                <span class="nav-link-text">Paijo PM & QA/QC Hub</span>
                <span class="nav-badge badge-warning">AI Copilot</span>
              </button>
            </nav>
          </div>

          <!-- Bottom Sidebar: Workspace Identity -->
          <div class="sidebar-footer">
            <div class="sidebar-user-strip">
              <div class="user-avatar-small" style="background: #eff6ff;">
                <ShieldCheck :size="15" color="#2563eb" />
              </div>
              <div class="user-info-text">
                <div class="user-name">Aether Core Engineering</div>
                <div class="user-email-sub">Platform & Mission Control</div>
              </div>
            </div>
          </div>
        </aside>

        <!-- 3. MAIN APPLICATION WORKSPACE -->
        <div class="app-main-area">
          <!-- Glassmorphism Sticky Header -->
          <header class="top-nav-header">
            <div class="breadcrumbs">
              <span>Aether Core Docs</span>
              <ChevronRight :size="14" class="crumb-sep" />
              <span
                :class="{ 'crumb-link': store.activeTask || store.activeSop || store.activeBlueprint || store.activePrd || store.activeSecurity }"
                @click="store.closeTask(); store.closeSop(); store.closeBlueprint(); store.closePrd(); store.closeSecurity(); store.closeJourney();"
                :style="{ cursor: (store.activeTask || store.activeSop || store.activeBlueprint || store.activePrd || store.activeSecurity) ? 'pointer' : 'default' }"
              >
                {{ currentBreadcrumbTitle }}
              </span>
              <template v-if="store.activeTask">
                <ChevronRight :size="14" class="crumb-sep" />
                <span class="crumb-current" style="font-family: 'JetBrains Mono', monospace; font-weight: 700;">
                  {{ store.activeTask.id }}
                </span>
              </template>
              <template v-else-if="store.activeSop">
                <ChevronRight :size="14" class="crumb-sep" />
                <span class="crumb-current" style="font-family: 'JetBrains Mono', monospace; font-weight: 700;">
                  {{ store.activeSop.id }}
                </span>
              </template>
              <template v-else-if="store.activeBlueprint">
                <ChevronRight :size="14" class="crumb-sep" />
                <span class="crumb-current" style="font-family: 'JetBrains Mono', monospace; font-weight: 700;">
                  {{ store.activeBlueprint.id }}
                </span>
              </template>
              <template v-else-if="store.activePrd">
                <ChevronRight :size="14" class="crumb-sep" />
                <span class="crumb-current" style="font-family: 'JetBrains Mono', monospace; font-weight: 700;">
                  {{ store.activePrd.id }}
                </span>
              </template>
              <template v-else-if="store.activeSecurity">
                <ChevronRight :size="14" class="crumb-sep" />
                <span class="crumb-current" style="font-family: 'JetBrains Mono', monospace; font-weight: 700;">
                  {{ store.activeSecurity.id }}
                </span>
              </template>
            </div>

            <div class="top-actions">
              <!-- Persona Selector styled to match Studio Search/Pill -->
              <div class="search-command-shell" style="width: auto; height: 34px; padding: 0 10px; gap: 6px;">
                <User :size="13" class="search-lead-glyph" style="margin-right: 0;" />
                <span style="font-size: 0.76rem; font-weight: 600; color: #64748b; white-space: nowrap;">Melihat:</span>
                <select
                  v-model="store.selectedFilter"
                  style="border: none; background: transparent; font-size: 0.8rem; font-weight: 700; color: #0f172a; outline: none; cursor: pointer; padding-right: 4px;"
                >
                  <option value="all">🌐 Semua Tim ({{ store.telemetry.totalTasks }} Task)</option>
                  <option v-for="m in store.members" :key="m.id" :value="m.id">
                    {{ m.icon }} {{ m.name }} ({{ m.role }})
                  </option>
                </select>
              </div>

              <!-- PM & QA Tag -->
              <div class="edge-status-tag">
                <span class="pulse-green-sm"></span>
                <span>PM & QA: <strong>Paijo AI Agent</strong></span>
              </div>
            </div>
          </header>

          <!-- Main Scrollable Pane -->
          <main class="content-scroll-pane">
            <!-- Dedicated Article Readers (Rendered when Task, SOP, Blueprint, PRD, or Security is Active) -->
            <TaskArticleReader v-if="store.activeTask" />
            <SopArticleReader v-else-if="store.activeSop" />
            <ArchitectureArticleReader v-else-if="store.activeBlueprint" />
            <PrdArticleReader v-else-if="store.activePrd" />
            <SecurityArticleReader v-else-if="store.activeSecurity" />

            <!-- Directory Overview Canvas (Rendered when No Reader is Open) -->
            <template v-else>
              <!-- Page Intro Row -->
              <div class="page-intro-row">
                <div>
                  <h1 class="page-title">
                    {{
                      store.activeTab === 'tasks' ? 'Papan Tugas Bisnis & Arsitektur (Divisi Tim)' :
                      store.activeTab === 'services' ? 'Papan Tugas per Microservice (01 - 07)' :
                      store.activeTab === 'prds' ? 'Spesifikasi Kebutuhan Produk (PRD 7 Microservices)' :
                      store.activeTab === 'blueprints' ? 'Kamus Arsitektur & Operational Blueprint' :
                      store.activeTab === 'journeys' ? 'Alur Kerja & Perjalanan Sistem Menyeluruh' :
                      store.activeTab === 'security' ? 'Matriks Keamanan Web, Backend & Sandboxing Kontainer' :
                      store.activeTab === 'sops' ? 'Standar Operasional Prosedur (SOP) Enterprise' :
                      'Pusat Kendali Paijo AI (Project Management & QA/QC)'
                    }}
                  </h1>
                  <p class="page-desc">
                    {{
                      store.activeTab === 'tasks' || store.activeTab === 'services' ?
                      'Seluruh 50 tugas bisnis & arsitektur berada dalam fase ONGOING, dilengkapi alur handover kepemilikan dan checklist interaktif.' :
                      store.activeTab === 'prds' ?
                      'Dokumentasi komprehensif visi, target pengguna, modul fungsional, kontrak API, dan NFR terukur untuk seluruh microservice platform Aether Core (Stack CMS).' :
                      store.activeTab === 'blueprints' ?
                      '13 Blueprint operasional lengkap dengan dependensi, file rujukan, langkah eksekusi, dan perintah CLI siap pakai.' :
                      store.activeTab === 'journeys' ?
                      'Pipeline visual bertahap dari provisioning < 4.5s, routing SSL Traefik, isolasi DB RLS, hingga offline sync PWA.' :
                      store.activeTab === 'security' ?
                      'Pengerasan cgroups v2 Linux, UID 10001, ReadonlyRootfs, serta 20 pilar keamanan OWASP & mitigasi CWE.' :
                      store.activeTab === 'sops' ?
                      '10 Panduan standar industri mencakup git branching, siklus pengerjaan tugas, pentest pre-commit, dan tata kelola rilis.' :
                      'Protokol kendali mutu otomatis, checklist verifikasi rilis, dan generator template laporan sprint berkala.'
                    }}
                  </p>
                </div>
                <div class="quota-quick-pills">
                  <span class="pill-metric">Tugas Ongoing: <strong>{{ store.telemetry.totalTasks }}</strong></span>
                  <span class="pill-metric">7 Services: <strong>100% Tercakup</strong></span>
                  <span class="pill-metric-highlight">Versi Docs: <strong>v1.4.1</strong></span>
                </div>
              </div>

              <!-- Telemetry Strips -->
              <TelemetryGrid />

              <!-- Active View Component -->
              <div class="tab-module-canvas">
                <TaskBoardModule v-if="store.activeTab === 'tasks' || store.activeTab === 'services'" />
                <PrdCatalogModule v-else-if="store.activeTab === 'prds'" />
                <ArchitectureModule v-else-if="store.activeTab === 'blueprints'" />
                <SystemJourneyModule v-else-if="store.activeTab === 'journeys'" />
                <SecurityMatrixModule v-else-if="store.activeTab === 'security'" />
                <SopRunbookModule v-else-if="store.activeTab === 'sops'" />
                <PaijoProtocolModule v-else-if="store.activeTab === 'paijo'" />
              </div>
            </template>
          </main>
        </div>
      </div>
    </div>

    <!-- Global Toast Alert -->
    <Teleport to="body">
      <div v-if="store.toastMessage" class="toast-popup success">
        <CheckCircle2 :size="16" />
        <span>{{ store.toastMessage }}</span>
        <button class="btn-toast-x" @click="store.toastMessage = null"><X :size="14" /></button>
      </div>
    </Teleport>
  </div>
</template>

<style>
:root {
  --bg-app: #ffffff;
  --text-main: #0f172a;
  --text-muted: #64748b;
  --brand-blue: #2563eb;
  --brand-blue-hover: #1d4ed8;
  --brand-emerald: #10b981;
}

html, body {
  min-height: 100%;
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  background-color: #ffffff;
  color: #0f172a;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

button, input, select, textarea {
  font-family: inherit;
}

.crumb-link {
  transition: color 0.15s ease;
}

.crumb-link:hover {
  color: #2563eb;
  text-decoration: underline;
}
</style>
