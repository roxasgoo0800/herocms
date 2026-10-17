<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import {
  Server,
  Globe,
  Activity,
  ShieldCheck,
  Search,
  X,
  Play,
  Square,
  RotateCw,
  Trash2,
  Edit3,
  Terminal,
  Plus,
  ArrowUpRight,
  Copy,
  Check,
  Briefcase,
  BookOpen,
  GraduationCap,
  ShoppingBag,
  LayoutGrid,
  List,
  Sparkles,
  Zap,
  Lock
} from 'lucide-vue-next';
import { useDashboardData } from '../../composables/useDashboardData';
import PodAnalyticsModal from './PodAnalyticsModal.vue';
import type { ContainerSite } from '../../types/dashboard';

const {
  userPlan,
  containers,
  usedContainersCount,
  runningContainersCount,
  stoppedContainersCount,
  searchQuery,
  statusFilter,
  filteredContainers,
  startContainer,
  stopContainer,
  restartContainer,
  deleteContainer,
  purgeEdgeCache,
  isPurgingEdgeCache,
  openCreateModal,
  openLogsModal,
  copiedSubdomain,
  copyToClipboard,
  activeContainerId,
  activeMenu
} = useDashboardData();

const searchInputRef = ref<HTMLInputElement | null>(null);

// -----------------------------------------------------------------------------
// View Mode: Grid Cards vs Enterprise Dense Table
// -----------------------------------------------------------------------------
const viewMode = ref<'grid' | 'table'>(
  (localStorage.getItem('herocms_containers_view_mode') as 'grid' | 'table') || 'grid'
);

watch(viewMode, (newMode) => {
  localStorage.setItem('herocms_containers_view_mode', newMode);
});

// Sparkline SVG generators for live visual telemetry
const getCpuSparkline = (cpu: number) => {
  const h = Math.max(3, Math.min(16, (cpu / 100) * 18));
  return `M0,${18 - h * 0.4} Q20,${18 - h * 1.1} 40,${18 - h * 0.6} T80,${18 - h}`;
};

const getRamSparkline = (usage: number, limit: number) => {
  const ratio = Math.max(0.05, Math.min(1, usage / limit));
  const h = ratio * 16;
  return `M0,${18 - h * 0.5} Q20,${18 - h * 0.9} 40,${18 - h * 0.7} T80,${18 - h}`;
};

// Global Shortcut ⌘K / Ctrl+K
const handleGlobalKeydown = (e: KeyboardEvent) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    searchInputRef.value?.focus();
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleGlobalKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown);
});

const selectForEditor = (containerId: string) => {
  activeContainerId.value = containerId;
  activeMenu.value = 'editor';
};

// Pod & Cloudflare-Style Geo Analytics Modal State
const isAnalyticsModalOpen = ref(false);
const activeAnalyticsContainer = ref<ContainerSite | null>(null);

const openAnalyticsModal = (c: ContainerSite) => {
  activeAnalyticsContainer.value = c;
  isAnalyticsModalOpen.value = true;
};
</script>

<template>
  <section class="fade-in-section">
    <!-- 1. Page Title & Quick Infrastructure Summary -->
    <div class="page-intro-row">
      <div>
        <h1 class="page-title">Situs & Kontainer Docker</h1>
        <p class="page-desc">Kelola runtime mandiri multi-tenant, batasan Linux cgroups v2, dan rute edge proxy Traefik v3.</p>
      </div>
      <div class="quota-quick-pills">
        <span class="pill-metric">Running: <strong>{{ runningContainersCount }}</strong></span>
        <span class="pill-metric">Standby: <strong>{{ stoppedContainersCount }}</strong></span>
        <span class="pill-metric-highlight">Sisa Kuota: <strong>{{ userPlan.maxContainers - usedContainersCount }} Slot</strong></span>
      </div>
    </div>

    <!-- 2. Bespoke Telemetry Metric Cards (4 Sleek Strips) -->
    <div class="stats-overview-grid">
      <div class="telemetry-card">
        <div class="telemetry-top">
          <span class="telemetry-label">KUOTA KONTAINER</span>
          <div class="telemetry-glyph blue">
            <Server :size="15" />
          </div>
        </div>
        <div class="telemetry-val">
          {{ usedContainersCount }} <span class="telemetry-denom">/ {{ userPlan.maxContainers }} Aktif</span>
        </div>
        <div class="telemetry-sub ready-state">
          <span class="pulse-mini-dot"></span>
          <span>{{ userPlan.maxContainers - usedContainersCount }} slot siap dideploy (cgroups v2)</span>
        </div>
      </div>

      <div class="telemetry-card">
        <div class="telemetry-top">
          <span class="telemetry-label">EDGE ROUTING TRAEFIK</span>
          <div class="telemetry-glyph emerald">
            <Globe :size="15" />
          </div>
        </div>
        <div class="telemetry-val">
          v3.1 <span class="badge-online">Online</span>
        </div>
        <div class="telemetry-sub">
          <span>Latensi rerata 1.2ms (Zero-Downtime)</span>
        </div>
      </div>

      <div class="telemetry-card">
        <div class="telemetry-top">
          <span class="telemetry-label">TRAFIK PENGUNJUNG</span>
          <div class="telemetry-glyph purple">
            <Activity :size="15" />
          </div>
        </div>
        <div class="telemetry-val">
          3,892 <span class="badge-growth-pill">+28%</span>
        </div>
        <div class="telemetry-sub">
          <span>Data dicatat via Kafka stream</span>
        </div>
      </div>

      <div class="telemetry-card">
        <div class="telemetry-top">
          <span class="telemetry-label">KEAMANAN TLS / SSL</span>
          <div class="telemetry-glyph blue">
            <ShieldCheck :size="15" />
          </div>
        </div>
        <div class="telemetry-val">
          100% <span class="badge-online">Aktif</span>
        </div>
        <div class="telemetry-sub">
          <span>Let's Encrypt Wildcard Auto-Renew</span>
        </div>
      </div>
    </div>

    <!-- 3. Bespoke Search Command, Segmented Filter & View Switcher Bar -->
    <div class="filter-toolbar">
      <div class="search-command-shell">
        <Search :size="15" class="search-lead-glyph" />
        <input
          ref="searchInputRef"
          v-model="searchQuery"
          type="text"
          placeholder="Cari situs, subdomain, atau container ID..."
          class="search-command-input"
        />
        <button v-if="searchQuery" class="btn-clear-search" @click="searchQuery = ''" title="Bersihkan">
          <X :size="13" />
        </button>
        <kbd class="shortcut-tag">⌘K</kbd>
      </div>

      <div class="segmented-filter-bar">
        <button
          class="segment-pill"
          :class="{ active: statusFilter === 'all' }"
          @click="statusFilter = 'all'"
        >
          <span>Semua</span>
          <span class="pill-count">{{ containers.length }}</span>
        </button>
        <button
          class="segment-pill"
          :class="{ active: statusFilter === 'running' }"
          @click="statusFilter = 'running'"
        >
          <span class="mini-status-dot running"></span>
          <span>Running</span>
          <span class="pill-count green">{{ runningContainersCount }}</span>
        </button>
        <button
          class="segment-pill"
          :class="{ active: statusFilter === 'stopped' }"
          @click="statusFilter = 'stopped'"
        >
          <span class="mini-status-dot stopped"></span>
          <span>Standby</span>
          <span class="pill-count gray">{{ stoppedContainersCount }}</span>
        </button>
      </div>

      <!-- View Switcher (Grid View vs Enterprise Table View) -->
      <div class="view-mode-toggle-group">
        <button
          type="button"
          class="view-mode-btn"
          :class="{ active: viewMode === 'grid' }"
          @click="viewMode = 'grid'"
          title="Tampilan Kartu Visual (Grid View)"
        >
          <LayoutGrid :size="14" />
          <span>Grid</span>
        </button>
        <button
          type="button"
          class="view-mode-btn"
          :class="{ active: viewMode === 'table' }"
          @click="viewMode = 'table'"
          title="Tampilan Tabel Enterprise (Dense Table)"
        >
          <List :size="14" />
          <span>Tabel</span>
        </button>
      </div>

      <!-- Quick Deploy CTA Button -->
      <button
        v-if="containers.length < userPlan.maxContainers"
        class="btn-top-create"
        style="padding: 7px 14px; font-size: 0.78rem; border-radius: 8px;"
        @click="openCreateModal()"
        title="Deploy Kontainer Baru"
      >
        <Plus :size="14" />
        <span>Deploy Baru</span>
      </button>
    </div>

    <!-- 4A. GRID CARD VIEW (INDUSTRY STANDARD) -->
    <div
      v-if="viewMode === 'grid' && (filteredContainers.length > 0 || (!searchQuery.trim() && statusFilter === 'all' && containers.length < userPlan.maxContainers))"
      class="site-cards-grid"
    >
      <!-- Active & Existing Container Cards -->
      <div
        v-for="c in filteredContainers"
        :key="c.id"
        class="pro-site-card"
        :class="{ 'card-stopped': c.status === 'stopped' }"
      >
        <!-- Card Top Header -->
        <div class="card-head">
          <div class="site-branding">
            <div class="site-icon-box" :style="{ backgroundColor: (c.accentColor || '#ea580c') + '14', color: c.accentColor || '#ea580c' }">
              <ShoppingBag v-if="c.category === 'business'" :size="18" />
              <Briefcase v-else-if="c.category === 'portfolio'" :size="18" />
              <BookOpen v-else-if="c.category === 'blog'" :size="18" />
              <GraduationCap v-else-if="c.category === 'education'" :size="18" />
              <Server v-else :size="18" />
            </div>
            <div class="site-branding-info">
              <div class="site-title-row">
                <h3 class="site-title-text">{{ c.name }}</h3>
              </div>
              <div class="site-sub-row">
                <span class="site-template-badge">{{ c.templateName }}</span>
                <span class="site-id-tag">#{{ c.id }}</span>
              </div>
            </div>
          </div>

          <!-- Radar Status Chip -->
          <div
            class="radar-status-pill"
            :class="{
              'status-running': c.status === 'running',
              'status-stopped': c.status === 'stopped',
              'status-provisioning': c.status === 'provisioning'
            }"
          >
            <span class="radar-ping-ring" v-if="c.status === 'running'"></span>
            <span class="radar-dot"></span>
            <span v-if="c.status === 'running'">Running</span>
            <span v-else-if="c.status === 'stopped'">Standby</span>
            <span v-else>Deploying...</span>
          </div>
        </div>

        <!-- Bespoke Terminal URL Box -->
        <div class="site-url-box">
          <div class="url-text-wrap">
            <Lock :size="11" style="color: #10b981; flex-shrink: 0;" />
            <span class="url-mono">https://{{ c.subdomain }}</span>
          </div>
          <div class="url-actions">
            <button
              class="btn-url-action"
              @click="copyToClipboard(c.subdomain, c.id)"
              :title="copiedSubdomain === c.id ? 'Tersalin!' : 'Salin URL Subdomain'"
            >
              <Check v-if="copiedSubdomain === c.id" :size="13" color="#059669" />
              <Copy v-else :size="13" />
            </button>
            <a :href="`https://${c.subdomain}`" target="_blank" class="btn-url-action" title="Buka Situs di Tab Baru">
              <ArrowUpRight :size="13" />
            </a>
          </div>
        </div>

        <!-- Custom Domain Badge (if attached) -->
        <div v-if="c.customDomain" class="custom-domain-pill">
          <Globe :size="12" />
          <span>{{ c.customDomain }}</span>
          <span style="font-size: 0.65rem; color: #059669; font-weight: 700; margin-left: auto;">● TLS 1.3</span>
        </div>

        <!-- Dual Infrastructure Meters with Micro Sparkline Waves -->
        <div class="resource-gauges-row">
          <div class="gauge-col">
            <div class="gauge-meta">
              <div class="gauge-header-flex">
                <span class="gauge-title">CPU USAGE</span>
                <!-- Micro Sparkline SVG -->
                <svg class="sparkline-micro-svg" viewBox="0 0 80 20">
                  <path :d="getCpuSparkline(c.cpuUsage)" fill="none" stroke="#2563eb" stroke-width="1.8" stroke-linecap="round" />
                </svg>
              </div>
              <span class="gauge-val">
                <strong>{{ c.cpuUsage }}%</strong>
                <span class="gauge-sub">/ {{ c.cpuLimit }}</span>
              </span>
            </div>
            <div class="custom-meter-track">
              <div
                class="custom-meter-fill fill-blue"
                :style="{ width: `${Math.min(c.cpuUsage * 2.5, 100)}%` }"
              >
                <span class="meter-glow"></span>
              </div>
            </div>
          </div>

          <div class="gauge-col">
            <div class="gauge-meta">
              <div class="gauge-header-flex">
                <span class="gauge-title">RAM MEMORY</span>
                <!-- Micro Sparkline SVG -->
                <svg class="sparkline-micro-svg" viewBox="0 0 80 20">
                  <path :d="getRamSparkline(c.ramUsage, c.ramLimit)" fill="none" stroke="#059669" stroke-width="1.8" stroke-linecap="round" />
                </svg>
              </div>
              <span class="gauge-val">
                <strong>{{ c.ramUsage }} MB</strong>
                <span class="gauge-sub">/ {{ c.ramLimit }} MB</span>
              </span>
            </div>
            <div class="custom-meter-track">
              <div
                class="custom-meter-fill fill-emerald"
                :style="{ width: `${(c.ramUsage / c.ramLimit) * 100}%` }"
              >
                <span class="meter-glow"></span>
              </div>
            </div>
          </div>
        </div>

        <!-- Edge Performance Strip -->
        <div class="edge-telemetry-strip" style="cursor: pointer;" @click="openAnalyticsModal(c)" title="Klik untuk Buka Detail Pod & Geo Analitik Cloudflare">
          <span class="edge-badge emerald">
            <Zap :size="10" />
            <span>Traefik v3.1</span>
          </span>
          <span class="edge-badge blue">
            <span>⚡ 1.2ms TTFB</span>
          </span>
          <span class="edge-telemetry-sub">
            <span>⏱ {{ c.uptime }}</span>
          </span>
        </div>

        <!-- Card Action Buttons Footer -->
        <div class="card-action-bar">
          <button
            class="btn-action-primary"
            @click="selectForEditor(c.id)"
          >
            <Edit3 :size="14" />
            <span>Editor</span>
          </button>

          <button
            class="btn-open-analytics-action"
            @click="openAnalyticsModal(c)"
            title="Lihat Detail Pod, Geo Analitik & Graph Cloudflare"
          >
            <Activity :size="13" />
            <span>Analitik</span>
          </button>

          <!-- Runtime Controls -->
          <div class="runtime-btn-group">
            <button
              v-if="c.status === 'stopped'"
              class="btn-icon-ctrl btn-play"
              @click="startContainer(c)"
              title="Jalankan Kontainer (Start)"
            >
              <Play :size="13" />
            </button>
            <button
              v-if="c.status === 'running'"
              class="btn-icon-ctrl btn-pause"
              @click="stopContainer(c)"
              title="Hentikan Sementara (Standby)"
            >
              <Square :size="12" />
            </button>
            <button
              class="btn-icon-ctrl"
              :disabled="c.status === 'stopped'"
              @click="restartContainer(c)"
              title="Restart Kontainer (Zero-Downtime Reboot)"
            >
              <RotateCw :size="13" />
            </button>
            <button
              class="btn-icon-ctrl btn-term"
              @click="openLogsModal(c)"
              title="Lihat Log Docker & Traefik"
            >
              <Terminal :size="13" />
            </button>
            <button
              class="btn-icon-ctrl btn-purge"
              :disabled="c.status === 'stopped'"
              @click="purgeEdgeCache(c)"
              title="Purge Edge & Traefik Cache"
            >
              <Sparkles :size="13" :class="{ 'spin-anim': isPurgingEdgeCache === c.id }" />
            </button>
            <button
              class="btn-icon-ctrl btn-del"
              @click="deleteContainer(c)"
              title="Hapus Kontainer & Kembalikan Kuota"
            >
              <Trash2 :size="13" />
            </button>
          </div>
        </div>
      </div>

      <!-- Quota Available Slot Placeholders (Fills 3-column grid) -->
      <template v-if="!searchQuery.trim() && statusFilter === 'all' && containers.length < userPlan.maxContainers">
        <div
          v-for="slotNum in (userPlan.maxContainers - containers.length)"
          :key="'slot-' + slotNum"
          class="empty-slot-card"
          @click="openCreateModal()"
        >
          <div class="slot-dashed-inner">
            <div class="slot-icon-circle">
              <Plus :size="20" />
            </div>
            <div class="slot-text-group">
              <div class="slot-badge">SLOT KONTAINER #{{ containers.length + slotNum }}</div>
              <h4 class="slot-title">Siap Dideploy</h4>
              <p class="slot-specs">{{ userPlan.cpuPerContainer }} • {{ userPlan.ramPerContainer }} • Traefik Ready</p>
            </div>
            <button class="btn-slot-create" type="button">
              <Plus :size="13" />
              <span>Deploy Website Baru</span>
            </button>
          </div>
        </div>
      </template>
    </div>

    <!-- 4B. DENSE ENTERPRISE TABLE VIEW -->
    <div
      v-else-if="viewMode === 'table' && (filteredContainers.length > 0 || (!searchQuery.trim() && statusFilter === 'all' && containers.length < userPlan.maxContainers))"
      class="container-table-card"
    >
      <div style="overflow-x: auto;">
        <table class="ledger-table">
          <thead>
            <tr>
              <th>SITUS & KONTAINER</th>
              <th>RUTE EDGE & DOMAIN</th>
              <th>STATUS & UPTIME</th>
              <th>ALOKASI CPU & RAM</th>
              <th>LATENSI EDGE</th>
              <th>DEPLOY TERAKHIR</th>
              <th style="text-align: right;">AKSI CEPAT</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in filteredContainers" :key="'table-' + c.id">
              <!-- Site Name & Category -->
              <td>
                <div class="table-site-cell">
                  <div class="site-icon-box" :style="{ backgroundColor: (c.accentColor || '#ea580c') + '14', color: c.accentColor || '#ea580c' }">
                    <ShoppingBag v-if="c.category === 'business'" :size="16" />
                    <Briefcase v-else-if="c.category === 'portfolio'" :size="16" />
                    <BookOpen v-else-if="c.category === 'blog'" :size="16" />
                    <GraduationCap v-else-if="c.category === 'education'" :size="16" />
                    <Server v-else :size="16" />
                  </div>
                  <div class="table-site-info">
                    <span class="table-site-title">{{ c.name }}</span>
                    <div class="table-site-meta">
                      <span>{{ c.templateName }}</span>
                      <span class="site-id-tag">#{{ c.id }}</span>
                    </div>
                  </div>
                </div>
              </td>

              <!-- Route & Domain -->
              <td>
                <div class="table-route-cell">
                  <div class="table-url-mono">
                    <Lock :size="11" style="color: #10b981;" />
                    <span>https://{{ c.subdomain }}</span>
                    <button
                      class="btn-url-action"
                      style="display: inline-flex;"
                      @click="copyToClipboard(c.subdomain, c.id)"
                      :title="copiedSubdomain === c.id ? 'Tersalin!' : 'Salin Subdomain'"
                    >
                      <Check v-if="copiedSubdomain === c.id" :size="11" color="#059669" />
                      <Copy v-else :size="11" />
                    </button>
                    <a :href="`https://${c.subdomain}`" target="_blank" class="btn-url-action" style="display: inline-flex;" title="Buka">
                      <ArrowUpRight :size="11" />
                    </a>
                  </div>
                  <div v-if="c.customDomain" class="custom-domain-pill" style="margin-top: 2px;">
                    <Globe :size="10" />
                    <span>{{ c.customDomain }}</span>
                  </div>
                </div>
              </td>

              <!-- Status & Uptime -->
              <td>
                <div style="display: flex; flex-direction: column; gap: 4px;">
                  <div
                    class="radar-status-pill"
                    style="align-self: flex-start;"
                    :class="{
                      'status-running': c.status === 'running',
                      'status-stopped': c.status === 'stopped',
                      'status-provisioning': c.status === 'provisioning'
                    }"
                  >
                    <span class="radar-ping-ring" v-if="c.status === 'running'"></span>
                    <span class="radar-dot"></span>
                    <span v-if="c.status === 'running'">Running</span>
                    <span v-else-if="c.status === 'stopped'">Standby</span>
                    <span v-else>Deploying...</span>
                  </div>
                  <span style="font-size: 0.68rem; color: #94a3b8; font-family: monospace;">{{ c.uptime }}</span>
                </div>
              </td>

              <!-- Resource Telemetry (CPU & RAM) -->
              <td>
                <div class="table-resource-cell">
                  <!-- CPU -->
                  <div class="table-meter-row">
                    <div class="table-meter-meta">
                      <span>CPU {{ c.cpuUsage }}%</span>
                      <span style="color: #94a3b8;">/ {{ c.cpuLimit }}</span>
                    </div>
                    <div class="custom-meter-track" style="height: 4px;">
                      <div class="custom-meter-fill fill-blue" :style="{ width: `${Math.min(c.cpuUsage * 2.5, 100)}%` }"></div>
                    </div>
                  </div>
                  <!-- RAM -->
                  <div class="table-meter-row">
                    <div class="table-meter-meta">
                      <span>RAM {{ c.ramUsage }}MB</span>
                      <span style="color: #94a3b8;">/ {{ c.ramLimit }}MB</span>
                    </div>
                    <div class="custom-meter-track" style="height: 4px;">
                      <div class="custom-meter-fill fill-emerald" :style="{ width: `${(c.ramUsage / c.ramLimit) * 100}%` }"></div>
                    </div>
                  </div>
                </div>
              </td>

              <!-- Latency & Protocol -->
              <td>
                <div style="display: flex; flex-direction: column; gap: 4px;">
                  <span class="edge-badge blue" style="align-self: flex-start; cursor: pointer;" @click="openAnalyticsModal(c)" title="Klik untuk Buka Detail Pod & Geo Analitik Cloudflare">
                    ⚡ 1.2ms TTFB
                  </span>
                  <span style="font-size: 0.68rem; color: #64748b; font-weight: 600;">Traefik v3.1 TLS 1.3</span>
                </div>
              </td>

              <!-- Last Deployed -->
              <td>
                <span style="font-size: 0.74rem; color: #64748b;">{{ c.lastDeployed }}</span>
              </td>

              <!-- Actions -->
              <td>
                <div class="table-actions-cell">
                  <button
                    class="btn-action-primary"
                    style="padding: 5px 11px; font-size: 0.74rem;"
                    @click="selectForEditor(c.id)"
                  >
                    <Edit3 :size="13" />
                    <span>Editor</span>
                  </button>

                  <button
                    class="btn-open-analytics-action"
                    style="padding: 5px 9px; font-size: 0.72rem;"
                    @click="openAnalyticsModal(c)"
                    title="Lihat Detail Pod, Geo Analitik & Graph Cloudflare"
                  >
                    <Activity :size="12" />
                    <span>Analitik</span>
                  </button>

                  <div class="runtime-btn-group">
                    <button
                      v-if="c.status === 'stopped'"
                      class="btn-icon-ctrl btn-play"
                      @click="startContainer(c)"
                      title="Jalankan Kontainer (Start)"
                    >
                      <Play :size="12" />
                    </button>
                    <button
                      v-if="c.status === 'running'"
                      class="btn-icon-ctrl btn-pause"
                      @click="stopContainer(c)"
                      title="Hentikan (Standby)"
                    >
                      <Square :size="11" />
                    </button>
                    <button
                      class="btn-icon-ctrl"
                      :disabled="c.status === 'stopped'"
                      @click="restartContainer(c)"
                      title="Restart Kontainer"
                    >
                      <RotateCw :size="12" />
                    </button>
                    <button
                      class="btn-icon-ctrl btn-term"
                      @click="openLogsModal(c)"
                      title="Lihat Log Konsol"
                    >
                      <Terminal :size="12" />
                    </button>
                    <button
                      class="btn-icon-ctrl btn-purge"
                      :disabled="c.status === 'stopped'"
                      @click="purgeEdgeCache(c)"
                      title="Purge Cache"
                    >
                      <Sparkles :size="12" :class="{ 'spin-anim': isPurgingEdgeCache === c.id }" />
                    </button>
                    <button
                      class="btn-icon-ctrl btn-del"
                      @click="deleteContainer(c)"
                      title="Hapus"
                    >
                      <Trash2 :size="12" />
                    </button>
                  </div>
                </div>
              </td>
            </tr>

            <!-- Available Quota Table Row -->
            <tr
              v-if="!searchQuery.trim() && statusFilter === 'all' && containers.length < userPlan.maxContainers"
              class="table-slot-row"
              @click="openCreateModal()"
            >
              <td colspan="7">
                <div class="table-slot-content">
                  <div class="table-slot-left">
                    <div class="slot-icon-circle" style="width: 28px; height: 28px;">
                      <Plus :size="14" />
                    </div>
                    <div>
                      <strong style="font-size: 0.84rem; color: #09090b;">Slot Kontainer Siap Dideploy</strong>
                      <span style="font-size: 0.72rem; color: #71717a; margin-left: 8px;">
                        Alokasi {{ userPlan.cpuPerContainer }} • {{ userPlan.ramPerContainer }} • Traefik Ingress Ready
                      </span>
                    </div>
                  </div>
                  <button class="btn-slot-create" type="button" style="padding: 4px 10px; font-size: 0.74rem;">
                    <Plus :size="12" />
                    <span>Deploy Situs Baru</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 5. Empty State if search finds nothing -->
    <div v-else class="empty-state-card" style="margin-top: 10px;">
      <Server :size="34" style="color: #94a3b8; margin-bottom: 4px;" />
      <h3>Tidak ada kontainer ditemukan</h3>
      <p v-if="searchQuery">
        Tidak ada situs atau kontainer yang cocok dengan kata kunci pencarian "<strong>{{ searchQuery }}</strong>".
      </p>
      <p v-else>
        Tidak ada kontainer dengan status filter terpilih.
      </p>
      <button class="btn-reset-filter" @click="searchQuery = ''; statusFilter = 'all'">
        Reset Pencarian & Filter
      </button>
    </div>

    <!-- 6. Cloudflare-Style Pod & Container Detail Analytics Modal -->
    <PodAnalyticsModal
      :is-open="isAnalyticsModalOpen"
      :container="activeAnalyticsContainer"
      @close="isAnalyticsModalOpen = false"
      @purge-cache="purgeEdgeCache"
      @open-logs="openLogsModal"
    />
  </section>
</template>
