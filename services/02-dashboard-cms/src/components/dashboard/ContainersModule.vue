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
                <a
                  :href="'https://' + c.subdomain"
                  target="_blank"
                  class="site-subdomain-link"
                  @click.stop
                >
                  <span>{{ c.subdomain }}</span>
                  <ArrowUpRight :size="11" />
                </a>
                <button
                  class="btn-copy-subdomain"
                  @click.stop="copyToClipboard(c.subdomain, c.id)"
                  :title="copiedSubdomain === c.id ? 'Tersalin!' : 'Salin Domain'"
                >
                  <Check v-if="copiedSubdomain === c.id" :size="11" class="text-green" />
                  <Copy v-else :size="11" />
                </button>
              </div>
            </div>
          </div>

          <div class="card-status-badge">
            <span
              class="status-pill"
              :class="{
                'pill-running': c.status === 'running',
                'pill-stopped': c.status === 'stopped',
                'pill-provisioning': c.status === 'provisioning'
              }"
            >
              <span class="status-dot-mini"></span>
              <span v-if="c.status === 'running'">Running</span>
              <span v-else-if="c.status === 'stopped'">Standby</span>
              <span v-else>Deploying...</span>
            </span>
          </div>
        </div>

        <!-- Telemetry Spec Rows -->
        <div class="card-specs-body">
          <div class="spec-row">
            <span class="spec-label">TEMPLATE / ENGINE</span>
            <span class="spec-value mono">{{ c.templateName }}</span>
          </div>
          <div class="spec-row">
            <span class="spec-label">PENGGUNAAN CPU</span>
            <div class="spec-meter-val">
              <span class="spec-value">{{ c.cpuUsage }}% <span class="spec-denom">/ {{ c.cpuLimit }}</span></span>
              <div class="meter-bar-micro">
                <div class="meter-fill" :style="{ width: Math.min(c.cpuUsage * 2, 100) + '%' }"></div>
              </div>
            </div>
          </div>
          <div class="spec-row">
            <span class="spec-label">MEMORI RAM</span>
            <div class="spec-meter-val">
              <span class="spec-value">{{ c.ramUsage }} MB <span class="spec-denom">/ {{ c.ramLimit }} MB</span></span>
              <div class="meter-bar-micro">
                <div class="meter-fill purple" :style="{ width: ((c.ramUsage / c.ramLimit) * 100) + '%' }"></div>
              </div>
            </div>
          </div>
          <div class="spec-row">
            <span class="spec-label">UPTIME & TRAFIK</span>
            <span class="spec-value mono text-blue">{{ c.uptime }} • {{ (c.visitsThisWeek || 0).toLocaleString() }} visits</span>
          </div>
          <div class="spec-row">
            <span class="spec-label">KATEGORI SITUS</span>
            <span class="spec-value text-capitalize">{{ c.category }} • SSL Aktif</span>
          </div>
        </div>

        <!-- Card Footer Control Deck -->
        <div class="card-control-deck">
          <button class="btn-primary-open-editor" @click="selectForEditor(c.id)">
            <Edit3 :size="13" />
            <span>Buka Editor</span>
          </button>

          <div class="deck-runtime-toggles">
            <button
              v-if="c.status === 'stopped'"
              class="btn-icon-ctrl btn-play"
              @click="startContainer(c)"
              title="Start Kontainer"
            >
              <Play :size="12" />
            </button>
            <button
              v-else
              class="btn-icon-ctrl btn-stop"
              :disabled="c.status === 'provisioning'"
              @click="stopContainer(c)"
              title="Stop Kontainer"
            >
              <Square :size="12" />
            </button>
            <button
              class="btn-icon-ctrl"
              :disabled="c.status === 'stopped' || c.status === 'provisioning'"
              @click="restartContainer(c)"
              title="Restart Kontainer"
            >
              <RotateCw :size="12" />
            </button>
            <button
              class="btn-icon-ctrl btn-term"
              @click="openLogsModal(c)"
              title="Lihat Log"
            >
              <Terminal :size="12" />
            </button>
            <button
              class="btn-icon-ctrl btn-del"
              @click="deleteContainer(c)"
              title="Hapus Kontainer"
            >
              <Trash2 :size="12" />
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
