<script setup lang="ts">
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
  Terminal,
  Edit3,
  Trash2,
  Plus,
  ChevronRight,
  Copy,
  Check,
  Layers,
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
  isCreateModalOpen,
  newSiteForm,
  openCreateModal,
  handleCreateContainer,
  isLogsModalOpen,
  activeLogContainer,
  openLogsModal,
  copyContainerLogs,
  copiedSubdomain,
  copyToClipboard,
  activeContainerId,
  activeMenu
} = useDashboardData();

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

    <!-- Telemetry Metric Cards (4 Sleek Strips) -->
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

    <!-- Search Command & Segmented Filter Bar -->
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
          <span class="dot-online"></span>
          <span>Running</span>
          <span class="pill-count">{{ runningContainersCount }}</span>
        </button>
        <button
          class="segment-pill"
          :class="{ active: statusFilter === 'stopped' }"
          @click="statusFilter = 'stopped'"
        >
          <span class="dot-paused"></span>
          <span>Standby</span>
          <span class="pill-count">{{ stoppedContainersCount }}</span>
        </button>
      </div>

      <button class="btn-primary-deploy" @click="openCreateModal()">
        <Plus :size="14" />
        <span>Deploy Kontainer Baru</span>
      </button>
    </div>

    <!-- Container Grid List -->
    <div v-if="filteredContainers.length > 0" class="container-cards-grid">
      <div
        v-for="c in filteredContainers"
        :key="c.id"
        class="container-item-card"
        :class="{ running: c.status === 'running', stopped: c.status === 'stopped' }"
      >
        <!-- Card Top Bar -->
        <div class="card-status-bar">
          <div class="status-indicator-tag" :class="c.status">
            <span class="status-ping-dot"></span>
            <span class="status-text-label">{{ c.status.toUpperCase() }}</span>
          </div>
          <div class="card-actions-quick">
            <button class="btn-terminal-logs" @click="openLogsModal(c)" title="Lihat Log cgroups & Traefik">
              <Terminal :size="13" />
              <span>Log</span>
            </button>
            <button class="btn-card-del" @click="deleteContainer(c)" title="Hapus Kontainer">
              <Trash2 :size="13" />
            </button>
          </div>
        </div>

        <!-- Site Header Info -->
        <div class="card-site-header">
          <div class="site-avatar-box">
            <Layers :size="20" />
          </div>
          <div class="site-title-column">
            <h3 class="site-name-heading">{{ c.name }}</h3>
            <span class="site-template-badge">{{ c.templateName }}</span>
          </div>
        </div>

        <!-- Domain & Routing Strip -->
        <div class="routing-strip-box">
          <div class="routing-row">
            <div class="routing-label-wrap">
              <span class="route-type-badge">SUBDOMAIN</span>
              <a :href="'https://' + c.subdomain" target="_blank" class="route-link">
                {{ c.subdomain }}
              </a>
            </div>
            <button
              class="btn-copy-url"
              @click="copyToClipboard(c.subdomain, c.id + '_sub')"
              title="Salin URL"
            >
              <Check v-if="copiedSubdomain === c.id + '_sub'" :size="12" class="text-green" />
              <Copy v-else :size="12" />
            </button>
          </div>

          <div v-if="c.customDomain" class="routing-row custom-domain-row">
            <div class="routing-label-wrap">
              <span class="route-type-badge custom">CUSTOM</span>
              <a :href="'https://' + c.customDomain" target="_blank" class="route-link bold">
                {{ c.customDomain }}
              </a>
            </div>
            <span class="badge-ssl-verified">
              <ShieldCheck :size="11" />
              <span>SSL Valid</span>
            </span>
          </div>
        </div>

        <!-- Cgroups Resource Gauges -->
        <div class="cgroups-meter-cluster">
          <div class="meter-bar-item">
            <div class="meter-header">
              <span class="meter-lbl">CPU (Limit {{ c.cpuLimit }})</span>
              <span class="meter-pct">{{ c.cpuUsage }}%</span>
            </div>
            <div class="meter-track">
              <div class="meter-fill cpu" :style="{ width: c.cpuUsage + '%' }"></div>
            </div>
          </div>

          <div class="meter-bar-item">
            <div class="meter-header">
              <span class="meter-lbl">RAM (cgroups v2)</span>
              <span class="meter-pct">{{ c.ramUsage }} MB / {{ c.ramLimit }} MB</span>
            </div>
            <div class="meter-track">
              <div
                class="meter-fill ram"
                :style="{ width: (c.ramUsage / c.ramLimit) * 100 + '%' }"
              ></div>
            </div>
          </div>
        </div>

        <!-- Card Footer Operations -->
        <div class="card-footer-controls">
          <div class="power-buttons-duo">
            <button
              v-if="c.status === 'running'"
              class="btn-power-op stop"
              @click="stopContainer(c)"
              title="Hentikan sementara (Standby)"
            >
              <Square :size="13" />
              <span>Stop</span>
            </button>
            <button
              v-if="c.status === 'stopped'"
              class="btn-power-op start"
              @click="startContainer(c)"
              title="Nyalakan kontainer"
            >
              <Play :size="13" />
              <span>Start</span>
            </button>
            <button
              class="btn-power-op restart"
              @click="restartContainer(c)"
              title="Graceful restart"
            >
              <RotateCw :size="13" />
              <span>Restart</span>
            </button>
          </div>

          <button class="btn-open-editor" @click="selectForEditor(c.id)">
            <Edit3 :size="13" />
            <span>Kustomisasi</span>
            <ChevronRight :size="13" />
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state-card">
      <div class="empty-state-icon">
        <Server :size="28" />
      </div>
      <h3 class="empty-state-title">Tidak ada kontainer yang cocok</h3>
      <p class="empty-state-desc">Pencarian untuk '{{ searchQuery }}' tidak menemukan kontainer aktif.</p>
      <button class="btn-clear-empty" @click="searchQuery = ''; statusFilter = 'all'">
        Reset Filter
      </button>
    </div>

    <!-- MODAL: BUAT SITUS & KONTAINER -->
    <div v-if="isCreateModalOpen" class="modal-backdrop" @click.self="isCreateModalOpen = false">
      <div class="modal-dialog">
        <div class="modal-header">
          <div class="modal-header-leading">
            <div class="modal-header-icon-box">
              <Layers :size="18" />
            </div>
            <div>
              <h3 class="modal-heading">Buat Situs Baru</h3>
              <p class="modal-subheading">Inisialisasi kontainer Docker mandiri dengan routing Traefik v3.</p>
            </div>
          </div>
          <button class="modal-close-button" @click="isCreateModalOpen = false" title="Tutup">
            <X :size="16" />
          </button>
        </div>

        <form @submit.prevent="handleCreateContainer" class="modal-form-body">
          <!-- Template Selection -->
          <div class="form-field-group">
            <label class="field-title">
              Pilih Blueprint Kategori
              <span class="field-req-dot">*</span>
            </label>
            <div class="template-radio-grid">
              <button
                v-for="tpl in [
                  { id: 'portfolio', name: 'Portofolio Teknis', desc: 'Engineer, Arsitek, & Desainer', icon: Briefcase },
                  { id: 'blog', name: 'Editorial & Blog', desc: 'Publikasi artikel & media', icon: BookOpen },
                  { id: 'education', name: 'Pusat Edukasi LMS', desc: 'Silabus kurikulum & modul', icon: GraduationCap },
                  { id: 'business', name: 'Bisnis & UMKM', desc: 'Katalog produk & WhatsApp order', icon: ShoppingBag }
                ]"
                :key="tpl.id"
                type="button"
                class="template-option-card"
                :class="{ selected: newSiteForm.category === tpl.id }"
                @click="newSiteForm.category = tpl.id as any"
              >
                <div class="template-option-icon">
                  <component :is="tpl.icon" :size="15" />
                </div>
                <div class="template-option-text">
                  <div class="template-option-name">{{ tpl.name }}</div>
                  <div class="template-option-desc">{{ tpl.desc }}</div>
                </div>
                <div class="template-option-radio">
                  <div class="radio-dot"></div>
                </div>
              </button>
            </div>
          </div>

          <!-- Nama Website -->
          <div class="form-field-group">
            <label class="field-title" for="modal-site-name">
              Nama Website
              <span class="field-req-dot">*</span>
            </label>
            <input
              id="modal-site-name"
              v-model="newSiteForm.name"
              type="text"
              placeholder="Contoh: Portofolio Rizal Pratama"
              class="field-text-input"
              required
            />
          </div>

          <!-- Subdomain Edge Traefik -->
          <div class="form-field-group">
            <label class="field-title" for="modal-subdomain">
              Subdomain Gratis (Traefik Ingress)
              <span class="field-req-dot">*</span>
            </label>
            <div class="domain-prefix-input-wrap">
              <input
                id="modal-subdomain"
                v-model="newSiteForm.subdomain"
                type="text"
                placeholder="rizal-dev"
                class="field-text-input prefix-part"
                required
              />
              <span class="domain-suffix-tag">.cloudcms.app</span>
            </div>
            <p class="field-helper-note">
              Sertifikat SSL Let's Encrypt TLS v1.3 akan diterbitkan secara otomatis.
            </p>
          </div>

          <!-- Headline / Peran Singkat -->
          <div class="form-field-group">
            <label class="field-title" for="modal-role">
              Headline / Slogan Profil
            </label>
            <input
              id="modal-role"
              v-model="newSiteForm.role"
              type="text"
              placeholder="Contoh: Senior Cloud & Distributed Systems Engineer"
              class="field-text-input"
            />
          </div>

          <!-- Resource Allocation Spec Note -->
          <div class="resource-spec-callout">
            <Server :size="13" class="spec-callout-icon" />
            <div class="spec-callout-text">
              <span>Alokasi runtime: </span>
              <strong>0.5 vCPU</strong> • <strong>256 MB RAM</strong> (cgroups v2) • Traefik v3 Proxy
            </div>
          </div>

          <div class="modal-footer-row">
            <button type="button" class="btn-modal-ghost" @click="isCreateModalOpen = false">
              Batal
            </button>
            <button type="submit" class="btn-modal-confirm">
              <Plus :size="14" />
              <span>Deploy Kontainer</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL: DOCKER & TRAEFIK RUNTIME LOGS -->
    <div v-if="isLogsModalOpen && activeLogContainer" class="modal-backdrop" @click.self="isLogsModalOpen = false">
      <div class="modal-dialog modal-dialog-lg">
        <div class="modal-header">
          <div class="modal-header-leading">
            <div class="modal-header-icon-box">
              <Terminal :size="18" />
            </div>
            <div>
              <h3 class="modal-heading">Log Runtime Kontainer</h3>
              <p class="modal-subheading">Telemetri Docker container #{{ activeLogContainer.id }} via proxy Traefik v3.</p>
            </div>
          </div>
          <button class="modal-close-button" @click="isLogsModalOpen = false" title="Tutup">
            <X :size="16" />
          </button>
        </div>

        <div class="terminal-container-view">
          <div class="terminal-meta-bar">
            <div class="terminal-meta-left">
              <div class="terminal-meta-item">
                <span class="t-meta-lbl">STATUS:</span>
                <span class="t-meta-val" :class="activeLogContainer.status">{{ activeLogContainer.status.toUpperCase() }}</span>
              </div>
              <div class="terminal-meta-item">
                <span class="t-meta-lbl">CGROUPS:</span>
                <span class="t-meta-val">{{ activeLogContainer.cpuLimit }} • {{ activeLogContainer.ramUsage }}MB / {{ activeLogContainer.ramLimit }}MB</span>
              </div>
              <div class="terminal-meta-item">
                <span class="t-meta-lbl">ROUTE:</span>
                <span class="t-meta-val">https://{{ activeLogContainer.subdomain }}</span>
              </div>
            </div>
            <div class="terminal-meta-right">
              <span class="pulse-green-sm"></span>
              <span class="t-stream-tag">Stream Live (Kafka/Docker)</span>
            </div>
          </div>

          <div class="terminal-output-screen">
            <div class="log-entry"><span class="log-ts">[09:20:11.204]</span> <span class="log-tag system">[system-init]</span> Spawning runtime sandbox for tenant {{ activeLogContainer.id }}</div>
            <div class="log-entry"><span class="log-ts">[09:20:12.018]</span> <span class="log-tag docker">[docker-daemon]</span> Container {{ activeLogContainer.id }} initialized (cgroups v2: cpu_quota=50000/100000, mem_limit={{ activeLogContainer.ramLimit }}MB)</div>
            <div class="log-entry"><span class="log-ts">[09:20:13.142]</span> <span class="log-tag traefik">[traefik-proxy]</span> Ingress router attached: Host(`{{ activeLogContainer.subdomain }}`) -> service '{{ activeLogContainer.id }}:80'</div>
            <div class="log-entry"><span class="log-ts">[09:20:14.055]</span> <span class="log-tag tls">[lets-encrypt]</span> Wildcard challenge ACME TLS-ALPN-01 verified. Certificate auto-renewed</div>
            <div class="log-entry"><span class="log-ts">[09:20:15.310]</span> <span class="log-tag nginx">[runtime-engine]</span> HTTP/2 & HTTP/3 (QUIC) fast-path listener initialized on 0.0.0.0:80</div>
            <div class="log-entry"><span class="log-ts">[09:21:02.881]</span> <span class="log-tag health">[healthcheck]</span> Internal probe HTTP 127.0.0.1:80/healthz returned status 200 OK (0.4ms)</div>
            <div class="log-entry" v-if="activeLogContainer.status === 'running'"><span class="log-ts">[09:22:04.119]</span> <span class="log-tag traffic">[edge-inbound]</span> GET / 200 OK (TTFB: 1.6ms, 4.2KB) - Client IP: 103.144.20.12 - SSL TLS 1.3</div>
            <div class="log-entry" v-if="activeLogContainer.status === 'running'"><span class="log-ts">[09:24:18.490]</span> <span class="log-tag traffic">[edge-inbound]</span> GET /api/telemetry 204 No Content - Kafka event published</div>
            <div class="log-entry" v-if="activeLogContainer.status === 'stopped'"><span class="log-ts">[09:22:30.501]</span> <span class="log-tag warn">[docker-daemon]</span> SIGTERM received from tenant dashboard. Container process halted cleanly (Standby)</div>
            <div class="log-entry" v-if="activeLogContainer.status === 'provisioning'"><span class="log-ts">[09:25:01.002]</span> <span class="log-tag docker">[docker-daemon]</span> Re-allocating cgroups v2 resource tree and rebuilding Traefik route...</div>
          </div>
        </div>

        <div class="modal-footer-row">
          <button type="button" class="btn-modal-ghost" @click="copyContainerLogs">
            <Copy :size="14" />
            <span>Salin Log</span>
          </button>
          <button type="button" class="btn-modal-confirm" @click="isLogsModalOpen = false">
            Tutup Konsol
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
