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
  X
} from 'lucide-vue-next';
import { useDocsStore } from './stores/docsStore';
import BackgroundWave from './components/BackgroundWave.vue';
import TelemetryGrid from './components/TelemetryGrid.vue';
import TaskDetailModal from './components/TaskDetailModal.vue';

// Lazy-Loaded Views
const TaskBoardModule = defineAsyncComponent(() => import('./components/TaskBoardModule.vue'));
const ArchitectureModule = defineAsyncComponent(() => import('./components/ArchitectureModule.vue'));
const SopRunbookModule = defineAsyncComponent(() => import('./components/SopRunbookModule.vue'));
const PaijoProtocolModule = defineAsyncComponent(() => import('./components/PaijoProtocolModule.vue'));

const store = useDocsStore();

onMounted(async () => {
  await store.fetchTasks();
});

const currentBreadcrumbTitle = computed(() => {
  switch (store.activeTab) {
    case 'tasks': return 'Papan Tugas per Divisi (6 Divisi)';
    case 'services': return 'Papan Tugas per Microservice (6 Layanan)';
    case 'blueprints': return 'Kamus & Blueprint Arsitektur Sistem';
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
      <div class="app-shell">
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
                  HeroCMS <span class="brand-gradient">Docs</span>
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
                <span class="nav-badge">6 Services</span>
              </button>
            </nav>

            <div class="nav-section-title">ARSITEKTUR & STANDAR</div>
            <nav class="sidebar-nav-list">
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

          <!-- Bottom Sidebar: Quota Gauge & User Profile -->
          <div class="sidebar-footer">
            <div class="quota-gauge-widget">
              <div class="gauge-header">
                <span>Status Sprint</span>
                <strong>{{ store.telemetry.totalTasks }} / {{ store.telemetry.totalTasks }} Ongoing</strong>
              </div>
              <div class="gauge-segments">
                <span class="gauge-seg filled"></span>
                <span class="gauge-seg filled"></span>
                <span class="gauge-seg filled"></span>
                <span class="gauge-seg filled"></span>
                <span class="gauge-seg filled"></span>
                <span class="gauge-seg filled"></span>
              </div>
              <div class="gauge-footer">
                <span>6 Divisi • 6 Microservices</span>
                <span style="color: #2563eb; font-weight: 700;">Continuous</span>
              </div>
            </div>

            <div class="sidebar-user-strip">
              <div class="user-avatar-small">
                <User :size="14" color="#2563eb" />
              </div>
              <div class="user-info-text">
                <div class="user-name">Rizal Pratama</div>
                <div class="user-email-sub">DevOps & Security Lead</div>
              </div>
            </div>
          </div>
        </aside>

        <!-- 3. MAIN APPLICATION WORKSPACE -->
        <div class="app-main-area">
          <!-- Glassmorphism Sticky Header -->
          <header class="top-nav-header">
            <div class="breadcrumbs">
              <span>HeroCMS Docs</span>
              <ChevronRight :size="14" class="crumb-sep" />
              <span class="crumb-current">{{ currentBreadcrumbTitle }}</span>
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
            <!-- Page Intro Row -->
            <div class="page-intro-row">
              <div>
                <h1 class="page-title">
                  {{
                    store.activeTab === 'tasks' ? 'Papan Tugas Bisnis & Arsitektur (Divisi Tim)' :
                    store.activeTab === 'services' ? 'Papan Tugas per Microservice (01 - 06)' :
                    store.activeTab === 'blueprints' ? 'Kamus Arsitektur & Operational Blueprint' :
                    store.activeTab === 'sops' ? 'Standar Operasional Prosedur (SOP) Enterprise' :
                    'Pusat Kendali Paijo AI (Project Management & QA/QC)'
                  }}
                </h1>
                <p class="page-desc">
                  {{
                    store.activeTab === 'tasks' || store.activeTab === 'services' ?
                    'Seluruh 50 tugas bisnis & arsitektur berada dalam fase ONGOING, dilengkapi alur handover kepemilikan dan checklist interaktif.' :
                    store.activeTab === 'blueprints' ?
                    '13 Blueprint operasional lengkap dengan dependensi, file rujukan, langkah eksekusi, dan perintah CLI siap pakai.' :
                    store.activeTab === 'sops' ?
                    '10 Panduan standar industri mencakup git branching, siklus pengerjaan tugas, pentest pre-commit, dan tata kelola rilis.' :
                    'Protokol kendali mutu otomatis, checklist verifikasi rilis, dan generator template laporan sprint berkala.'
                  }}
                </p>
              </div>
              <div class="quota-quick-pills">
                <span class="pill-metric">Tugas Ongoing: <strong>{{ store.telemetry.totalTasks }}</strong></span>
                <span class="pill-metric">6 Divisi: <strong>100% Aktif</strong></span>
                <span class="pill-metric-highlight">Versi: <strong>v1.15.0</strong></span>
              </div>
            </div>

            <!-- Telemetry Strips -->
            <TelemetryGrid />

            <!-- Active View Component -->
            <div class="tab-module-canvas">
              <TaskBoardModule v-if="store.activeTab === 'tasks' || store.activeTab === 'services'" />
              <ArchitectureModule v-else-if="store.activeTab === 'blueprints'" />
              <SopRunbookModule v-else-if="store.activeTab === 'sops'" />
              <PaijoProtocolModule v-else-if="store.activeTab === 'paijo'" />
            </div>
          </main>
        </div>
      </div>
    </div>

    <!-- Modal Reader View -->
    <TaskDetailModal />

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
