<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
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
  ShoppingBag
} from 'lucide-vue-next';
import { useDashboardData } from '../../composables/useDashboardData';

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
  openCreateModal,
  openLogsModal,
  copiedSubdomain,
  copyToClipboard,
  activeContainerId,
  activeMenu
} = useDashboardData();

const searchInputRef = ref<HTMLInputElement | null>(null);

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
</script>

<template>
  <section class="fade-in-section">
    <!-- Page Title & Quick Summary -->
    <div class="page-intro-row">
      <div>
        <h1 class="page-title">Situs & Kontainer Docker</h1>
        <p class="page-desc">Kelola runtime mandiri pelanggan, batasan cgroups Linux, dan rute proxy Traefik v3.</p>
      </div>
      <div class="quota-quick-pills">
        <span class="pill-metric">Running: <strong>{{ runningContainersCount }}</strong></span>
        <span class="pill-metric">Standby: <strong>{{ stoppedContainersCount }}</strong></span>
        <span class="pill-metric-highlight">Sisa Kuota: <strong>{{ userPlan.maxContainers - usedContainersCount }} Slot</strong></span>
      </div>
    </div>

    <!-- Bespoke Telemetry Metric Cards (4 Sleek Strips) -->
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
          <span>{{ userPlan.maxContainers - usedContainersCount }} slot siap dideploy</span>
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
          <span>Latensi rerata 1.8ms (Zero-Downtime)</span>
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

    <!-- Bespoke Search Command & Segmented Filter Bar -->
    <div class="filter-toolbar">
      <div class="search-command-shell">
        <Search :size="15" class="search-lead-glyph" />
        <input
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
    </div>

    <!-- 3-Column Site Cards Grid (Matching 3-Container Subscription Quota) -->
    <div v-if="filteredContainers.length > 0 || (!searchQuery.trim() && statusFilter === 'all' && containers.length < userPlan.maxContainers)" class="site-cards-grid">
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
            <div class="site-icon-box" :style="{ backgroundColor: c.accentColor + '14', color: c.accentColor }">
              <Briefcase v-if="c.category === 'portfolio'" :size="18" />
              <BookOpen v-else-if="c.category === 'blog'" :size="18" />
              <GraduationCap v-else-if="c.category === 'education'" :size="18" />
              <ShoppingBag v-else :size="18" />
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

        <!-- Bespoke Terminal URL Pill -->
        <div class="site-url-box">
          <div class="url-text-wrap">
            <Globe :size="13" class="url-glyph" />
            <span class="url-mono">https://{{ c.subdomain }}</span>
          </div>
          <div class="url-actions">
            <button
              class="btn-url-action"
              @click="copyToClipboard(c.subdomain, c.id)"
              :title="copiedSubdomain === c.id ? 'Tersalin!' : 'Salin URL'"
            >
              <Check v-if="copiedSubdomain === c.id" :size="13" color="#059669" />
              <Copy v-else :size="13" />
            </button>
            <a :href="`https://${c.subdomain}`" target="_blank" class="btn-url-action" title="Buka Situs">
              <ArrowUpRight :size="13" />
            </a>
          </div>
        </div>

        <!-- Bespoke Dual Infrastructure Meters -->
        <div class="resource-gauges-row">
          <div class="gauge-col">
            <div class="gauge-meta">
              <span class="gauge-title">CPU ALLOCATION</span>
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
              <span class="gauge-title">RAM MEMORY</span>
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

        <!-- Card Action Buttons Footer -->
        <div class="card-action-bar">
          <button
            class="btn-action-primary"
            @click="selectForEditor(c.id)"
          >
            <Edit3 :size="14" />
            <span>Buka Editor Studio</span>
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
              title="Hentikan Sementara (Stop)"
            >
              <Square :size="12" />
            </button>
            <button
              class="btn-icon-ctrl"
              :disabled="c.status === 'stopped'"
              @click="restartContainer(c)"
              title="Restart Kontainer"
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
              class="btn-icon-ctrl btn-del"
              @click="deleteContainer(c)"
              title="Hapus Kontainer"
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

    <!-- Empty State if search finds nothing -->
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
</template>
