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
  Lock,
  Cpu,
  HardDrive,
  TrendingUp,
  Clock,
  Wrench
} from 'lucide-vue-next';
import { useDashboardData } from '../../composables/useDashboardData';
import type { ContainerSite } from '../../types/dashboard';

const {
  userPlan,
  containers,
  usedContainersCount,
  runningContainersCount,
  maintenanceContainersCount,
  stoppedContainersCount,
  searchQuery,
  statusFilter,
  filteredContainers,
  startContainer,
  stopContainer,
  toggleMaintenance,
  restartContainer,
  deleteContainer,
  purgeEdgeCache,
  isPurgingEdgeCache,
  openCreateModal,
  openLogsModal,
  copiedSubdomain,
  copyToClipboard,
  activeContainerId,
  activeMenu,
  selectedContainerForDetail
} = useDashboardData();

const targetContainerForMaintenance = ref<ContainerSite | null>(null);
const isMaintenanceModalOpen = ref(false);
const maintenanceMessageInput = ref('Situs sedang dalam pemeliharaan berkala untuk peningkatan performa. Kami akan segera kembali.');
const estimatedEndTimeInput = ref('30 menit');

const openMaintenanceModal = (c: ContainerSite) => {
  if (c.status === 'maintenance') {
    toggleMaintenance(c);
    return;
  }
  targetContainerForMaintenance.value = c;
  maintenanceMessageInput.value = c.maintenanceConfig?.message || 'Situs sedang dalam pemeliharaan berkala untuk peningkatan performa. Kami akan segera kembali.';
  estimatedEndTimeInput.value = c.maintenanceConfig?.estimatedEndTime || '30 menit';
  isMaintenanceModalOpen.value = true;
};

const confirmEnableMaintenance = () => {
  if (!targetContainerForMaintenance.value) return;
  toggleMaintenance(
    targetContainerForMaintenance.value,
    maintenanceMessageInput.value,
    estimatedEndTimeInput.value
  );
  isMaintenanceModalOpen.value = false;
  targetContainerForMaintenance.value = null;
};

const setEtaPreset = (val: string) => {
  estimatedEndTimeInput.value = val;
};

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

// 7-day live traffic activity sparkline curve generator
const getContainerTrafficSparkline = (c: ContainerSite) => {
  const seed = (c.id.charCodeAt(c.id.length - 1) || 1) + c.visitsThisWeek;
  const points = [
    0.28 + ((seed * 17) % 35) / 100,
    0.38 + ((seed * 31) % 40) / 100,
    0.32 + ((seed * 47) % 35) / 100,
    0.58 + ((seed * 67) % 30) / 100,
    0.52 + ((seed * 83) % 35) / 100,
    0.78 + ((seed * 97) % 20) / 100,
    0.92
  ];
  const w = 110;
  const h = 26;
  const step = w / (points.length - 1);
  const coords = points.map((p, i) => ({
    x: i * step,
    y: h - p * (h - 6) - 3
  }));

  let line = `M ${coords[0].x.toFixed(1)} ${coords[0].y.toFixed(1)}`;
  for (let i = 1; i < coords.length; i++) {
    const prev = coords[i - 1];
    const curr = coords[i];
    const cpX = (prev.x + curr.x) / 2;
    line += ` C ${cpX.toFixed(1)} ${prev.y.toFixed(1)}, ${cpX.toFixed(1)} ${curr.y.toFixed(1)}, ${curr.x.toFixed(1)} ${curr.y.toFixed(1)}`;
  }
  const area = `${line} L ${w} ${h} L 0 ${h} Z`;
  return { line, area };
};

const formatShortPodId = (id: string) => {
  if (!id) return '#0000';
  if (id.length > 12) {
    const parts = id.split('-');
    return 'pod-' + (parts[parts.length - 1] || id.slice(-6));
  }
  return '#' + id;
};

const getCategoryLabel = (cat: string) => {
  switch (cat) {
    case 'business': return 'Bisnis';
    case 'portfolio': return 'Portofolio';
    case 'blog': return 'Publikasi';
    case 'education': return 'Edukasi';
    default: return 'Aplikasi';
  }
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

const navigateToAnalytics = (c: ContainerSite) => {
  selectedContainerForDetail.value = c;
  activeMenu.value = 'analytics';
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
</script>

<template>
  <div class="containers-root-wrapper">
    <!-- Main Situs & Kontainer Overview List (Cards vs Table) -->
    <section class="fade-in-section">
      <!-- Page Title & Quick Infrastructure Summary -->
      <div class="page-intro-row">
      <div>
        <h1 class="page-title">Situs & Kontainer Docker</h1>
        <p class="page-desc">Kelola runtime mandiri multi-tenant, batasan Linux cgroups v2, dan rute edge proxy Traefik v3.</p>
      </div>
      <div class="quota-quick-pills">
        <span class="pill-metric">Running: <strong>{{ runningContainersCount }}</strong></span>
        <span v-if="maintenanceContainersCount > 0" class="pill-metric" style="color: #b45309; background: #fffbeb; border-color: #fde68a;">
          Maintenance: <strong>{{ maintenanceContainersCount }}</strong>
        </span>
        <span class="pill-metric">Standby: <strong>{{ stoppedContainersCount }}</strong></span>
        <span class="pill-metric-highlight">Sisa Kuota: <strong>{{ userPlan.maxContainers - usedContainersCount }} Slot</strong></span>
      </div>
    </div>

    <!-- 2. Bespoke Telemetry Metric Cards (4 Sleek Strips) -->
    <div class="stats-overview-grid">
      <div class="telemetry-card accent-blue">
        <div class="telemetry-corner-watermark blue"><Server :size="58" /></div>
        <div class="telemetry-top">
          <span class="telemetry-label">KUOTA KONTAINER</span>
        </div>
        <div class="telemetry-val">
          {{ usedContainersCount }} <span class="telemetry-denom">/ {{ userPlan.maxContainers }} Aktif</span>
        </div>
        <div class="telemetry-sub ready-state">
          <span class="pulse-mini-dot"></span>
          <span>{{ userPlan.maxContainers - usedContainersCount }} slot siap dideploy (cgroups v2)</span>
        </div>
      </div>

      <div class="telemetry-card accent-emerald">
        <div class="telemetry-corner-watermark emerald"><Globe :size="58" /></div>
        <div class="telemetry-top">
          <span class="telemetry-label">EDGE ROUTING TRAEFIK</span>
        </div>
        <div class="telemetry-val">
          v3.1 <span class="badge-online">Online</span>
        </div>
        <div class="telemetry-sub">
          <span>Latensi rerata 1.2ms (Zero-Downtime)</span>
        </div>
      </div>

      <div class="telemetry-card accent-purple">
        <div class="telemetry-corner-watermark purple"><Activity :size="58" /></div>
        <div class="telemetry-top">
          <span class="telemetry-label">TRAFIK PENGUNJUNG</span>
        </div>
        <div class="telemetry-val">
          3,892 <span class="badge-growth-pill">+28%</span>
        </div>
        <div class="telemetry-sub">
          <span>Data dicatat via Kafka stream</span>
        </div>
      </div>

      <div class="telemetry-card accent-sky">
        <div class="telemetry-corner-watermark sky"><ShieldCheck :size="58" /></div>
        <div class="telemetry-top">
          <span class="telemetry-label">KEAMANAN TLS / SSL</span>
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
          :class="{ active: statusFilter === 'maintenance' }"
          @click="statusFilter = 'maintenance'"
        >
          <span class="mini-status-dot maintenance"></span>
          <span>Pemeliharaan</span>
          <span class="pill-count amber">{{ maintenanceContainersCount }}</span>
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
        :style="{ '--card-accent': c.accentColor || '#2563eb' }"
      >
        <!-- Card Top Header -->
        <div class="card-head">
          <div class="site-branding">
            <div
              class="site-icon-box"
              :style="{ backgroundColor: (c.accentColor || '#ea580c') + '15', color: c.accentColor || '#ea580c', borderColor: (c.accentColor || '#ea580c') + '30' }"
            >
              <ShoppingBag v-if="c.category === 'business'" :size="20" />
              <Briefcase v-else-if="c.category === 'portfolio'" :size="20" />
              <BookOpen v-else-if="c.category === 'blog'" :size="20" />
              <GraduationCap v-else-if="c.category === 'education'" :size="20" />
              <Server v-else :size="20" />
            </div>
            <div class="site-branding-info">
              <div class="site-title-row">
                <h3
                  class="site-title-text"
                  @click="selectForEditor(c.id)"
                  title="Buka Website di Visual Editor"
                >
                  {{ c.name }}
                </h3>
              </div>
              <div class="site-sub-row">
                <span class="site-template-badge">{{ c.templateName }}</span>
                <span class="site-category-badge">{{ getCategoryLabel(c.category) }}</span>
                <span class="site-id-tag">{{ formatShortPodId(c.id) }}</span>
              </div>
            </div>
          </div>

          <!-- Radar Status Chip -->
          <div
            class="radar-status-pill"
            :class="{
              'status-running': c.status === 'running',
              'status-maintenance': c.status === 'maintenance',
              'status-stopped': c.status === 'stopped',
              'status-provisioning': c.status === 'provisioning'
            }"
          >
            <span class="radar-ping-ring" v-if="c.status === 'running'"></span>
            <span class="radar-ping-ring amber" v-if="c.status === 'maintenance'"></span>
            <span class="radar-dot"></span>
            <span v-if="c.status === 'running'">Running</span>
            <span v-else-if="c.status === 'maintenance'">Maintenance</span>
            <span v-else-if="c.status === 'stopped'">Standby</span>
            <span v-else>Deploying...</span>
          </div>
        </div>

        <!-- Maintenance Mode Active Notice -->
        <div v-if="c.status === 'maintenance'" class="maintenance-alert-strip">
          <Wrench :size="12" style="flex-shrink: 0;" />
          <span>Mode Pemeliharaan Aktif: Pengunjung publik dialihkan ke respons HTTP 503.</span>
        </div>

        <!-- Bespoke Terminal URL Box -->
        <div class="site-url-box">
          <div class="url-text-wrap">
            <Lock :size="12" style="color: #059669; flex-shrink: 0;" />
            <span class="url-prefix">https://</span>
            <span class="url-mono">{{ c.subdomain }}</span>
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
          <Globe :size="12" style="color: #2563eb;" />
          <span class="custom-domain-name">{{ c.customDomain }}</span>
          <span class="custom-domain-tls">
            <ShieldCheck :size="11" />
            <span>TLS 1.3 Active</span>
          </span>
        </div>

        <!-- Live Traffic Activity & Momentum Sparkline Strip -->
        <div class="card-momentum-strip" @click="navigateToAnalytics(c)" title="Lihat Trafik di Menu Analitik & Telemetri">
          <div class="momentum-left-meta">
            <div class="momentum-title-flex">
              <Activity :size="12" style="color: #2563eb;" />
              <span>TRAFIK MINGGU INI</span>
            </div>
            <div class="momentum-stat-flex">
              <strong>{{ c.visitsThisWeek.toLocaleString() }} hits</strong>
              <span class="momentum-growth-badge">
                <TrendingUp :size="10" />
                <span>+24%</span>
              </span>
            </div>
          </div>

          <!-- Mini Sparkline Area Curve -->
          <div class="momentum-sparkline-box">
            <svg viewBox="0 0 110 26" preserveAspectRatio="none" class="mini-sparkline-svg">
              <defs>
                <linearGradient :id="`sparkGrad-${c.id}`" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" :stop-color="c.accentColor || '#2563eb'" stop-opacity="0.25" />
                  <stop offset="100%" :stop-color="c.accentColor || '#2563eb'" stop-opacity="0.0" />
                </linearGradient>
              </defs>
              <path :d="getContainerTrafficSparkline(c).area" :fill="`url(#sparkGrad-${c.id})`" />
              <path :d="getContainerTrafficSparkline(c).line" fill="none" :stroke="c.accentColor || '#2563eb'" stroke-width="2" stroke-linecap="round" />
            </svg>
          </div>
        </div>

        <!-- Dual Infrastructure Resource Meters (cgroups v2 & memcg) -->
        <div class="resource-gauges-row">
          <div class="gauge-col">
            <div class="gauge-meta">
              <div class="gauge-header-flex">
                <Cpu :size="11" style="color: #2563eb;" />
                <span class="gauge-title">CPU CFS QUOTA</span>
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
                <HardDrive :size="11" style="color: #059669;" />
                <span class="gauge-title">RAM MEMCG</span>
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
        <div class="edge-telemetry-strip">
          <div class="edge-telemetry-left">
            <span class="edge-badge emerald">
              <Zap :size="10" />
              <span>Traefik v3.1</span>
            </span>
            <span class="edge-badge blue">
              <span>⚡ 1.2ms TTFB</span>
            </span>
          </div>
          <span class="edge-telemetry-sub">
            <Clock :size="11" />
            <span>⏱ {{ c.uptime }}</span>
          </span>
        </div>

        <!-- Card Action Buttons Footer -->
        <div class="card-action-bar">
          <div class="card-action-left">
            <button
              class="btn-action-primary"
              @click="selectForEditor(c.id)"
              title="Buka Website di Visual Editor"
            >
              <Edit3 :size="13" />
              <span>Editor</span>
            </button>
          </div>

          <!-- Runtime Controls -->
          <div class="runtime-btn-group">
            <button
              v-if="c.status === 'stopped'"
              class="btn-icon-ctrl btn-play"
              @click="startContainer(c)"
              title="Jalankan Kontainer (Start Pod)"
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
              class="btn-icon-ctrl btn-maintenance"
              :class="{ 'in-maintenance': c.status === 'maintenance' }"
              :disabled="c.status === 'stopped'"
              @click="openMaintenanceModal(c)"
              :title="c.status === 'maintenance' ? 'Akhiri Mode Pemeliharaan (Go Live)' : 'Aktifkan Mode Pemeliharaan (Maintenance)'"
            >
              <Wrench :size="12" />
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
                    <span class="table-site-title" style="cursor: pointer;" @click="selectForEditor(c.id)" title="Buka di Visual Editor">{{ c.name }}</span>
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
                      'status-maintenance': c.status === 'maintenance',
                      'status-stopped': c.status === 'stopped',
                      'status-provisioning': c.status === 'provisioning'
                    }"
                  >
                    <span class="radar-ping-ring" v-if="c.status === 'running'"></span>
                    <span class="radar-ping-ring amber" v-if="c.status === 'maintenance'"></span>
                    <span class="radar-dot"></span>
                    <span v-if="c.status === 'running'">Running</span>
                    <span v-else-if="c.status === 'maintenance'">Maintenance</span>
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
                  <span class="edge-badge blue" style="align-self: flex-start;">
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
                      class="btn-icon-ctrl btn-maintenance"
                      :class="{ 'in-maintenance': c.status === 'maintenance' }"
                      :disabled="c.status === 'stopped'"
                      @click="openMaintenanceModal(c)"
                      :title="c.status === 'maintenance' ? 'Akhiri Mode Pemeliharaan (Go Live)' : 'Aktifkan Mode Pemeliharaan'"
                    >
                      <Wrench :size="11" />
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
  </section>

  <!-- 6. Maintenance Mode Configuration Dialog -->
  <Teleport to="body">
    <div
      v-if="isMaintenanceModalOpen && targetContainerForMaintenance"
      class="modal-backdrop"
      @click.self="isMaintenanceModalOpen = false"
    >
      <div
        class="modal-dialog"
        style="max-width: 480px;"
        role="dialog"
        aria-modal="true"
      >
        <div class="modal-header">
          <div class="modal-header-leading">
            <div class="modal-header-icon-box" style="background: #fffbeb; color: #b45309; border: 1px solid #fde68a;">
              <Wrench :size="18" />
            </div>
            <div>
              <h3 class="modal-heading">Aktifkan Mode Pemeliharaan</h3>
              <p class="modal-subheading">Trafik publik akan dialihkan ke pesan pemeliharaan 503.</p>
            </div>
          </div>
          <button
            type="button"
            class="modal-close-button"
            @click="isMaintenanceModalOpen = false"
            title="Tutup dialog"
          >
            <X :size="16" />
          </button>
        </div>

        <div class="modal-body" style="padding: 20px 24px;">
          <!-- Target Site Overview Card -->
          <div class="modal-target-site-card">
            <div class="modal-target-site-left">
              <div class="modal-target-icon-box">
                <Globe :size="16" />
              </div>
              <div>
                <div class="modal-target-site-name">{{ targetContainerForMaintenance.name }}</div>
                <div class="modal-target-site-url">https://{{ targetContainerForMaintenance.subdomain }}</div>
              </div>
            </div>
            <span class="modal-target-site-badge">
              <Wrench :size="11" />
              <span>HTTP 503 Service</span>
            </span>
          </div>

          <!-- Form Fields -->
          <div class="modal-form-group">
            <label class="modal-field-label">
              <span>Pesan Pemeliharaan untuk Pengunjung</span>
              <span class="modal-field-hint">Akan tampil di layar publik</span>
            </label>
            <textarea
              v-model="maintenanceMessageInput"
              rows="3"
              class="field-textarea-input"
              placeholder="Contoh: Kami sedang melakukan pemeliharaan berkala untuk peningkatan performa. Kami akan segera kembali."
            ></textarea>
          </div>

          <div class="modal-form-group" style="margin-bottom: 6px;">
            <label class="modal-field-label">
              <span>Estimasi Selesai (ETA)</span>
              <span class="modal-field-hint">Estimasi durasi downtime</span>
            </label>
            <input
              v-model="estimatedEndTimeInput"
              type="text"
              class="field-text-input"
              placeholder="Contoh: 30 menit atau 14:00 WIB"
            />
            <!-- Quick ETA Presets -->
            <div class="eta-preset-chips">
              <button
                type="button"
                class="eta-chip-btn"
                :class="{ active: estimatedEndTimeInput === '15 menit' }"
                @click="setEtaPreset('15 menit')"
              >
                15 Menit
              </button>
              <button
                type="button"
                class="eta-chip-btn"
                :class="{ active: estimatedEndTimeInput === '30 menit' }"
                @click="setEtaPreset('30 menit')"
              >
                30 Menit
              </button>
              <button
                type="button"
                class="eta-chip-btn"
                :class="{ active: estimatedEndTimeInput === '1 jam' }"
                @click="setEtaPreset('1 jam')"
              >
                1 Jam
              </button>
              <button
                type="button"
                class="eta-chip-btn"
                :class="{ active: estimatedEndTimeInput === '2 jam' }"
                @click="setEtaPreset('2 jam')"
              >
                2 Jam
              </button>
            </div>
          </div>
        </div>

        <div class="modal-footer" style="padding: 16px 24px; border-top: 1px solid #f1f5f9; display: flex; justify-content: flex-end; gap: 10px;">
          <button
            type="button"
            class="btn-modal-ghost"
            @click="isMaintenanceModalOpen = false"
          >
            Batal
          </button>
          <button
            type="button"
            class="btn-modal-confirm"
            style="background: #b45309; border-color: #92400e; padding: 8px 16px; font-size: 0.82rem;"
            @click="confirmEnableMaintenance"
          >
            <Wrench :size="13" />
            <span>Aktifkan Maintenance</span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</div>
</template>
