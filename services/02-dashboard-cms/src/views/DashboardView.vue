<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  Layers,
  Plus,
  Edit3,
  Globe,
  TrendingUp,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  X,
  User,
  LogOut,
  ChevronRight,
  Palette,
  FileText,
  Receipt,
  HardDrive,
  Webhook,
  FolderKanban,
  Briefcase,
  BookOpen,
  GraduationCap,
  ShoppingBag,
  Server,
  Terminal,
  Copy,
  LifeBuoy
} from 'lucide-vue-next';
import { useDashboardData } from '../composables/useDashboardData';

// Modular View Components
import ContainersModule from '../components/dashboard/ContainersModule.vue';
import VisualEditorModule from '../components/dashboard/VisualEditorModule.vue';
import ContentArticlesModule from '../components/dashboard/ContentArticlesModule.vue';
import MediaAssetsModule from '../components/dashboard/MediaAssetsModule.vue';
import TemplatesCatalogModule from '../components/dashboard/TemplatesCatalogModule.vue';
import CustomDomainsModule from '../components/dashboard/CustomDomainsModule.vue';
import AnalyticsTelemetryModule from '../components/dashboard/AnalyticsTelemetryModule.vue';
import WebhooksApiModule from '../components/dashboard/WebhooksApiModule.vue';
import BillingPlanModule from '../components/dashboard/BillingPlanModule.vue';
import InvoicesHistoryModule from '../components/dashboard/InvoicesHistoryModule.vue';
import SupportTicketingModule from '../components/dashboard/SupportTicketingModule.vue';

const router = useRouter();

const {
  activeMenu,
  isEditorSidebarHidden,
  userEmail,
  userPlan,
  usedContainersCount,
  containers,
  articles,
  openCreateModal,
  toastMessage,
  isCreateModalOpen,
  newSiteForm,
  handleCreateContainer,
  isLogsModalOpen,
  activeLogContainer,
  copyContainerLogs,
  syncWithBackend
} = useDashboardData();

onMounted(async () => {
  await syncWithBackend();
});

const handleLogout = () => {
  localStorage.removeItem('cloudcms_auth_token');
  localStorage.removeItem('cloudcms_user_email');
  sessionStorage.removeItem('herocms_splash_seen');
  router.push('/login');
};
</script>

<template>
  <div class="dashboard-root-layout">
    <div class="app-shell" :class="{ 'editor-immersive-mode': activeMenu === 'editor' && isEditorSidebarHidden }">
    <!-- 1. LEFT SIDEBAR: Professional Cloud Console Navigation -->
    <aside class="app-sidebar">
      <!-- Workspace Brand Switcher -->
      <div class="sidebar-header">
        <div class="workspace-card">
          <div class="brand-icon">
            <Layers :size="18" color="#ffffff" />
          </div>
          <div class="workspace-info">
            <div class="workspace-name">HeroCMS Studio</div>
            <div class="workspace-badge">
              <span class="pulse-green"></span>
              {{ userPlan.name }}
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Section -->
      <div class="sidebar-nav-sections">
        <div class="nav-section-title">KONTEN & STUDIO</div>
        <nav class="sidebar-nav-list">
          <button
            class="nav-link"
            :class="{ active: activeMenu === 'containers' }"
            @click="activeMenu = 'containers'"
          >
            <FolderKanban :size="17" />
            <span class="nav-link-text">Situs & Kontainer</span>
            <span class="nav-count-badge">{{ usedContainersCount }}/{{ userPlan.maxContainers }}</span>
          </button>

          <button
            class="nav-link"
            :class="{ active: activeMenu === 'editor' }"
            @click="activeMenu = 'editor'"
            :disabled="containers.length === 0"
          >
            <Edit3 :size="17" />
            <span class="nav-link-text">Editor Studio Visual</span>
          </button>

          <button
            class="nav-link"
            :class="{ active: activeMenu === 'content' }"
            @click="activeMenu = 'content'"
          >
            <FileText :size="17" />
            <span class="nav-link-text">Artikel & Halaman</span>
            <span class="nav-pill-tag">{{ articles.length }}</span>
          </button>

          <button
            class="nav-link"
            :class="{ active: activeMenu === 'media' }"
            @click="activeMenu = 'media'"
          >
            <HardDrive :size="17" />
            <span class="nav-link-text">Media Assets (S3)</span>
            <span class="nav-pill-tag">120MB</span>
          </button>

          <button
            class="nav-link"
            :class="{ active: activeMenu === 'templates' }"
            @click="activeMenu = 'templates'"
          >
            <Palette :size="17" />
            <span class="nav-link-text">Katalog Template</span>
            <span class="nav-pill-tag">Store</span>
          </button>
        </nav>

        <div class="nav-section-title">INFRASTRUKTUR & EDGE</div>
        <nav class="sidebar-nav-list">
          <button
            class="nav-link"
            :class="{ active: activeMenu === 'domains' }"
            @click="activeMenu = 'domains'"
          >
            <Globe :size="17" />
            <span class="nav-link-text">Custom Domain & DNS</span>
            <span class="nav-pill-tag green">SSL</span>
          </button>

          <button
            class="nav-link"
            :class="{ active: activeMenu === 'analytics' }"
            @click="activeMenu = 'analytics'"
          >
            <TrendingUp :size="17" />
            <span class="nav-link-text">Analitik & Telemetri</span>
          </button>

          <button
            class="nav-link"
            :class="{ active: activeMenu === 'webhooks' }"
            @click="activeMenu = 'webhooks'"
          >
            <Webhook :size="17" />
            <span class="nav-link-text">Webhooks & API</span>
          </button>
        </nav>

        <div class="nav-section-title">FINANSIAL & BILLING</div>
        <nav class="sidebar-nav-list">
          <button
            class="nav-link"
            :class="{ active: activeMenu === 'billing' }"
            @click="activeMenu = 'billing'"
          >
            <CreditCard :size="17" />
            <span class="nav-link-text">Kapasitas & Paket</span>
          </button>

          <button
            class="nav-link"
            :class="{ active: activeMenu === 'invoices' }"
            @click="activeMenu = 'invoices'"
          >
            <Receipt :size="17" />
            <span class="nav-link-text">Faktur & Invoice</span>
            <span class="nav-pill-tag green">Lunas</span>
          </button>
        </nav>

        <div class="nav-section-title">BANTUAN & SUPPORT</div>
        <nav class="sidebar-nav-list">
          <button
            class="nav-link"
            :class="{ active: activeMenu === 'tickets' }"
            @click="activeMenu = 'tickets'"
          >
            <LifeBuoy :size="17" />
            <span class="nav-link-text">Tiket Support</span>
            <span class="nav-pill-tag amber">1 Aktif</span>
          </button>
        </nav>
      </div>

      <!-- Bottom Sidebar: Quota Gauge & User Profile -->
      <div class="sidebar-footer">
        <!-- Compact Quota Card -->
        <div class="quota-gauge-widget">
          <div class="gauge-header">
            <span>Kapasitas Kontainer</span>
            <strong>{{ usedContainersCount }} / {{ userPlan.maxContainers }}</strong>
          </div>
          <div class="gauge-segments">
            <span
              v-for="idx in userPlan.maxContainers"
              :key="idx"
              class="gauge-seg"
              :class="{ filled: idx <= usedContainersCount }"
            ></span>
          </div>
          <div class="gauge-footer">
            <span>{{ userPlan.cpuPerContainer }} • {{ userPlan.ramPerContainer }}</span>
            <button class="link-upgrade" @click="activeMenu = 'billing'">Upgrade</button>
          </div>
        </div>

        <!-- User Dropdown Strip -->
        <div class="sidebar-user-strip">
          <div class="user-avatar-small">
            <User :size="14" color="#2563eb" />
          </div>
          <div class="user-info-text">
            <div class="user-name">Rizal Pratama</div>
            <div class="user-email-sub">{{ userEmail }}</div>
          </div>
          <button class="btn-sidebar-logout" @click="handleLogout" title="Keluar">
            <LogOut :size="14" />
          </button>
        </div>
      </div>
    </aside>

    <!-- 2. MAIN APPLICATION WORKSPACE -->
    <div class="app-main-area">
      <!-- Sticky Glassmorphism Header -->
      <header class="top-nav-header">
        <div class="breadcrumbs">
          <span>HeroCMS Studio</span>
          <ChevronRight :size="14" class="crumb-sep" />
          <span class="crumb-current">
            {{
              activeMenu === 'containers' ? 'Situs & Kontainer' :
              activeMenu === 'editor' ? 'Editor Visual Studio' :
              activeMenu === 'content' ? 'Artikel & Halaman CMS' :
              activeMenu === 'media' ? 'Media Assets & Storage S3' :
              activeMenu === 'templates' ? 'Katalog Template & Pricelist' :
              activeMenu === 'domains' ? 'Custom Domain & DNS Traefik' :
              activeMenu === 'analytics' ? 'Analitik Real-Time (Kafka & Redis)' :
              activeMenu === 'webhooks' ? 'Webhooks & Integrasi API' :
              activeMenu === 'billing' ? 'Kapasitas & Paket Langganan' :
              activeMenu === 'invoices' ? 'Faktur & Riwayat Invoice Resmi' :
              'Pusat Bantuan & Tiket Support'
            }}
          </span>
        </div>

        <div class="top-actions">
          <!-- Engine Health Tag -->
          <div class="edge-status-tag">
            <span class="pulse-green-sm"></span>
            <span>Traefik Edge: <strong>1.8ms TTFB</strong></span>
          </div>

          <!-- Primary Add Website Button -->
          <button class="btn-top-create" @click="openCreateModal()">
            <Plus :size="15" />
            <span>Buat Website Baru</span>
          </button>
        </div>
      </header>

      <!-- Global Toast Alert -->
      <div v-if="toastMessage" class="toast-popup" :class="toastMessage.type">
        <CheckCircle2 v-if="toastMessage.type === 'success'" :size="16" />
        <AlertCircle v-else :size="16" />
        <span>{{ toastMessage.text }}</span>
        <button class="btn-toast-x" @click="toastMessage = null"><X :size="14" /></button>
      </div>

      <!-- Main Dynamic Workspace View (Modular per-menu components) -->
      <main class="content-scroll-pane">
        <ContainersModule v-if="activeMenu === 'containers'" />
        <VisualEditorModule v-else-if="activeMenu === 'editor'" />
        <ContentArticlesModule v-else-if="activeMenu === 'content'" />
        <MediaAssetsModule v-else-if="activeMenu === 'media'" />
        <TemplatesCatalogModule v-else-if="activeMenu === 'templates'" />
        <CustomDomainsModule v-else-if="activeMenu === 'domains'" />
        <AnalyticsTelemetryModule v-else-if="activeMenu === 'analytics'" />
        <WebhooksApiModule v-else-if="activeMenu === 'webhooks'" />
        <BillingPlanModule v-else-if="activeMenu === 'billing'" />
        <InvoicesHistoryModule v-else-if="activeMenu === 'invoices'" />
        <SupportTicketingModule v-else-if="activeMenu === 'tickets'" />
      </main>
    </div>

    <!-- ============================================================= -->
    <!-- MODAL: BUAT SITUS & KONTAINER (HANDCRAFTED MINIMALIST SAAS)  -->
    <!-- ============================================================= -->
    <Teleport to="body">
      <div v-if="isCreateModalOpen" class="modal-backdrop" @click.self="isCreateModalOpen = false">
        <div class="modal-dialog">
          <!-- Header -->
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

          <form @submit.prevent="handleCreateContainer" class="modal-form">
            <!-- 1. Blueprint Selection -->
            <div class="form-field-group">
              <label class="field-title">Pilih Template Awal</label>
              <div class="template-selector-grid">
                <button
                  type="button"
                  v-for="tpl in [
                    { id: 'portfolio', name: 'Portofolio', desc: 'Studi kasus & CV online', icon: Briefcase },
                    { id: 'blog', name: 'Blog & Media', desc: 'Artikel & publikasi berita', icon: BookOpen },
                    { id: 'education', name: 'Pusat Edukasi', desc: 'Silabus kursus & LMS', icon: GraduationCap },
                    { id: 'business', name: 'Bisnis & UMKM', desc: 'Showcase produk & kontak', icon: ShoppingBag }
                  ]"
                  :key="tpl.id"
                  class="template-option"
                  :class="{ active: newSiteForm.category === tpl.id }"
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

            <!-- 2. Nama Website -->
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

            <!-- 3. Subdomain Field -->
            <div class="form-field-group">
              <label class="field-title" for="modal-subdomain">
                Subdomain
                <span class="field-req-dot">*</span>
              </label>
              <div class="url-input-container">
                <span class="url-addon-prefix">
                  <Globe :size="13" class="url-addon-icon" />
                  https://
                </span>
                <input
                  id="modal-subdomain"
                  v-model="newSiteForm.subdomain"
                  type="text"
                  placeholder="nama-situs"
                  class="url-core-input"
                  required
                />
                <span class="url-addon-suffix">.cloudcms.app</span>
              </div>
              <p class="field-helper-text">
                Rute edge Traefik otomatis menerbitkan sertifikat SSL TLS v1.3 Let's Encrypt.
              </p>
            </div>

            <!-- 4. Headline / Peran -->
            <div class="form-field-group">
              <div class="field-title-flex">
                <label class="field-title" for="modal-role">Headline atau Peran</label>
                <span class="field-optional-badge">Opsional</span>
              </div>
              <input
                id="modal-role"
                v-model="newSiteForm.role"
                type="text"
                placeholder="e.g. Senior Software & Cloud Architect"
                class="field-text-input"
              />
            </div>

            <!-- 5. Resource Allocation Spec Note -->
            <div class="resource-spec-callout">
              <Server :size="13" class="spec-callout-icon" />
              <div class="spec-callout-text">
                <span>Alokasi runtime: </span>
                <strong>0.5 vCPU</strong> • <strong>256 MB RAM</strong> (cgroups v2) • Traefik v3 Proxy
              </div>
            </div>

            <!-- 6. Footer Actions -->
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
    </Teleport>

    <!-- ============================================================= -->
    <!-- MODAL: DOCKER & TRAEFIK RUNTIME LOGS                          -->
    <!-- ============================================================= -->
    <Teleport to="body">
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
    </Teleport>
    </div>
  </div>
</template>

<style>
/* ==========================================================================
   HEROCMS STUDIO - BESPOKE ENTERPRISE DESIGN SYSTEM (CLEAN & NON-BOOTSTRAP)
   ========================================================================== */

.dashboard-root-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
}

.app-shell {
  display: flex;
  min-height: 100vh;
  background: transparent;
  position: relative;
}

/* Editor Immersive Mode: Hide Sidebar & Top Header for maximum wide workspace */
.app-shell.editor-immersive-mode .app-sidebar {
  display: none !important;
}

.app-shell.editor-immersive-mode .top-nav-header {
  display: none !important;
}

.app-shell.editor-immersive-mode .content-scroll-pane {
  padding: 0 !important;
  margin: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  overflow: hidden !important;
}

/* 1. LEFT SIDEBAR (GLASSMORPHIC & SLEEK) */
.app-sidebar {
  width: 256px;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-right: 1px solid rgba(226, 232, 240, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: sticky;
  top: 0;
  height: 100vh;
  z-index: 50;
}

.sidebar-header {
  padding: 16px;
  border-bottom: 1px solid #f1f5f9;
}

.workspace-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 10px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.brand-icon {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);
}

.workspace-info {
  display: flex;
  flex-direction: column;
}

.workspace-name {
  font-size: 0.88rem;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.01em;
}

.workspace-badge {
  font-size: 0.72rem;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 5px;
}

.pulse-green {
  width: 6px;
  height: 6px;
  background: #10b981;
  border-radius: 50%;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
}

.sidebar-nav-sections {
  flex: 1;
  padding: 16px 12px;
  overflow-y: auto;
}

.nav-section-title {
  font-size: 0.68rem;
  font-weight: 700;
  color: #94a3b8;
  letter-spacing: 0.08em;
  padding: 0 10px 8px;
  margin-top: 14px;
}

.nav-section-title:first-child {
  margin-top: 0;
}

.sidebar-nav-list {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 8px;
  font-size: 0.84rem;
  font-weight: 600;
  color: #475569;
  background: transparent;
  border: none;
  cursor: pointer;
  width: 100%;
  text-align: left;
  transition: all 0.15s ease;
}

.nav-link:hover:not(:disabled) {
  background: #f1f5f9;
  color: #0f172a;
}

.nav-link.active {
  background: #0f172a;
  color: #ffffff;
  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.12);
}

.nav-link:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.nav-link-text {
  flex: 1;
}

.nav-count-badge {
  font-size: 0.7rem;
  background: rgba(148, 163, 184, 0.2);
  color: inherit;
  padding: 1px 6px;
  border-radius: 999px;
  font-family: monospace;
}

.nav-link.active .nav-count-badge {
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

.nav-pill-tag {
  font-size: 0.68rem;
  background: #eff6ff;
  color: #2563eb;
  padding: 1px 6px;
  border-radius: 4px;
  font-weight: 700;
}

.sidebar-footer {
  padding: 12px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Quota Gauge Widget */
.quota-gauge-widget {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 12px;
}

.gauge-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.74rem;
  color: #64748b;
  margin-bottom: 8px;
}

.gauge-header strong {
  color: #0f172a;
}

.gauge-segments {
  display: flex;
  gap: 4px;
  height: 6px;
  margin-bottom: 8px;
}

.gauge-seg {
  flex: 1;
  background: #e2e8f0;
  border-radius: 2px;
  transition: background-color 0.2s ease;
}

.gauge-seg.filled {
  background: #2563eb;
}

.gauge-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.7rem;
  color: #64748b;
}

.link-upgrade {
  background: transparent;
  border: none;
  color: #2563eb;
  font-weight: 700;
  cursor: pointer;
  padding: 0;
}

.link-upgrade:hover {
  text-decoration: underline;
}

/* User Strip */
.sidebar-user-strip {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 8px;
  border-radius: 8px;
}

.user-avatar-small {
  width: 28px;
  height: 28px;
  background: #eff6ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-info-text {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 0.8rem;
  font-weight: 600;
  color: #0f172a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-email-sub {
  font-size: 0.7rem;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.btn-sidebar-logout {
  background: transparent;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px;
  display: flex;
  transition: color 0.15s ease;
}

.btn-sidebar-logout:hover {
  color: #ef4444;
}

/* 2. MAIN APPLICATION WORKSPACE */
.app-main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  position: relative;
  z-index: 1;
}

.top-nav-header {
  height: 56px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid #e2e8f0;
  padding: 0 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 40;
}

.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.84rem;
  color: #64748b;
}

.crumb-sep {
  color: #cbd5e1;
}

.crumb-current {
  color: #0f172a;
  font-weight: 600;
}

.top-actions {
  display: flex;
  align-items: center;
  gap: 14px;
}

.edge-status-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.76rem;
  color: #475569;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 4px 10px;
  border-radius: 999px;
}

.pulse-green-sm {
  width: 6px;
  height: 6px;
  background: #10b981;
  border-radius: 50%;
}

.btn-top-create {
  background: #0f172a;
  color: #ffffff;
  border: 1px solid #0f172a;
  padding: 7px 14px;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.15s ease;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.12);
}

.btn-top-create:hover {
  background: #1e293b;
  transform: translateY(-1px);
}

/* Toast */
.toast-popup {
  position: fixed;
  top: 68px;
  right: 28px;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 0.82rem;
  box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.12);
}

.toast-popup.success { background: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; }
.toast-popup.info { background: #eff6ff; border: 1px solid #bfdbfe; color: #1d4ed8; }
.toast-popup.error { background: #fef2f2; border: 1px solid #fecaca; color: #991b1b; }

.btn-toast-x {
  background: transparent;
  border: none;
  color: inherit;
  cursor: pointer;
  margin-left: 6px;
}

/* Full Width Content View */
.content-scroll-pane {
  padding: 28px 40px 64px;
  width: 100%;
  max-width: none;
  box-sizing: border-box;
}

.page-intro-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.page-title {
  font-size: 1.35rem;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.02em;
  margin-bottom: 4px;
}

.page-desc {
  font-size: 0.84rem;
  color: #64748b;
}

.quota-quick-pills {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pill-metric {
  font-size: 0.76rem;
  color: #475569;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 4px 10px;
  border-radius: 6px;
}

.pill-metric-highlight {
  font-size: 0.76rem;
  color: #2563eb;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  padding: 4px 10px;
  border-radius: 6px;
}

/* ==========================================================================
   BESPOKE TELEMETRY CARDS (NO GENERIC STAT BOXES)
   ========================================================================== */
.stats-overview-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
  width: 100%;
}

@media (max-width: 1024px) {
  .stats-overview-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.telemetry-card {
  background: #ffffff;
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: 12px;
  padding: 16px 18px;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.03), 0 4px 12px -2px rgba(15, 23, 42, 0.02);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.15s ease;
}

.telemetry-card:hover {
  border-color: #cbd5e1;
  transform: translateY(-1px);
  box-shadow: 0 6px 18px -3px rgba(15, 23, 42, 0.06);
}

.telemetry-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.telemetry-label {
  font-size: 0.68rem;
  font-weight: 700;
  color: #64748b;
  letter-spacing: 0.06em;
}

.telemetry-glyph {
  width: 28px;
  height: 28px;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.telemetry-glyph.blue { background: #eff6ff; color: #2563eb; }
.telemetry-glyph.emerald { background: #ecfdf5; color: #059669; }
.telemetry-glyph.purple { background: #faf5ff; color: #9333ea; }

.telemetry-val {
  font-size: 1.3rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.02em;
  display: flex;
  align-items: center;
  gap: 6px;
}

.telemetry-denom {
  font-size: 0.78rem;
  font-weight: 500;
  color: #64748b;
}

.telemetry-sub {
  font-size: 0.72rem;
  color: #64748b;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.ready-state {
  color: #059669;
  font-weight: 500;
}

.pulse-mini-dot {
  width: 6px;
  height: 6px;
  background: #10b981;
  border-radius: 50%;
}

.badge-online {
  font-size: 0.7rem;
  font-weight: 600;
  color: #059669;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  padding: 1px 7px;
  border-radius: 999px;
}

.badge-growth-pill {
  font-size: 0.7rem;
  font-weight: 700;
  color: #059669;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  padding: 1px 7px;
  border-radius: 999px;
}

/* ==========================================================================
   BESPOKE SEARCH COMMAND & SEGMENTED CONTROL BAR (ZERO BOOTSTRAP)
   ========================================================================== */
.filter-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 22px;
  width: 100%;
}

.search-command-shell {
  position: relative;
  display: flex;
  align-items: center;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  height: 42px;
  width: 380px;
  padding: 0 14px;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
}

.search-command-shell:focus-within {
  border-color: #3b82f6;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.12), 0 2px 6px rgba(15, 23, 42, 0.05);
}

.search-lead-glyph {
  color: #94a3b8;
  margin-right: 10px;
  flex-shrink: 0;
  transition: color 0.15s ease;
}

.search-command-shell:focus-within .search-lead-glyph {
  color: #2563eb;
}

.search-command-input {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-size: 0.84rem;
  color: #0f172a;
  font-family: inherit;
  letter-spacing: -0.01em;
}

.search-command-input::placeholder {
  color: #94a3b8;
}

.btn-clear-search {
  background: transparent;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px;
  margin-right: 6px;
  display: flex;
  align-items: center;
  border-radius: 4px;
  transition: all 0.12s ease;
}

.btn-clear-search:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.shortcut-tag {
  font-size: 0.7rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #64748b;
  padding: 2px 6px;
  border-radius: 6px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  box-shadow: 0 1px 0 rgba(15, 23, 42, 0.06);
  flex-shrink: 0;
}

/* Bespoke Segmented Pill Bar */
.segmented-filter-bar {
  display: inline-flex;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 4px;
  gap: 3px;
  box-shadow: inset 0 1px 2px rgba(15, 23, 42, 0.03);
}

.segment-pill {
  background: transparent;
  border: none;
  color: #64748b;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 8px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
}

.segment-pill:hover {
  color: #0f172a;
}

.segment-pill.active {
  background: #ffffff;
  color: #0f172a;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.08), 0 1px 2px rgba(15, 23, 42, 0.04);
}

.mini-status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.mini-status-dot.running {
  background: #10b981;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
}

.mini-status-dot.stopped {
  background: #94a3b8;
}

.pill-count {
  font-size: 0.7rem;
  background: rgba(148, 163, 184, 0.18);
  color: #475569;
  padding: 1px 7px;
  border-radius: 999px;
  font-family: ui-monospace, monospace;
  font-weight: 700;
}

.segment-pill.active .pill-count.green {
  background: #ecfdf5;
  color: #059669;
}

.segment-pill.active .pill-count.gray {
  background: #f1f5f9;
  color: #64748b;
}

/* ==========================================================================
   3-COLUMN SITE CARDS GRID & BESPOKE CONTAINER INFRASTRUCTURE CARDS
   ========================================================================== */
.site-cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
  width: 100%;
}

@media (max-width: 1280px) {
  .site-cards-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .site-cards-grid {
    grid-template-columns: 1fr;
  }
}

.pro-site-card {
  background: #ffffff;
  border: 1px solid rgba(226, 232, 240, 0.95);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04), 0 6px 16px -4px rgba(15, 23, 42, 0.03);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 16px;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
}

.pro-site-card:hover {
  border-color: #cbd5e1;
  box-shadow: 0 12px 28px -6px rgba(15, 23, 42, 0.09), 0 2px 6px rgba(15, 23, 42, 0.04);
  transform: translateY(-2px);
}

.pro-site-card.card-stopped {
  background: #fbfcfe;
  border-color: #e2e8f0;
}

.card-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.site-branding {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.site-icon-box {
  width: 40px;
  height: 40px;
  border-radius: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.site-branding-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.site-title-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.site-title-text {
  font-size: 0.96rem;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.015em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.site-sub-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.site-template-badge {
  font-size: 0.72rem;
  color: #64748b;
  font-weight: 500;
}

.site-id-tag {
  font-size: 0.68rem;
  color: #94a3b8;
  font-family: ui-monospace, monospace;
}

/* Radar Status Pill */
.radar-status-pill {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 9px;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  flex-shrink: 0;
}

.radar-status-pill.status-running {
  background: #ecfdf5;
  color: #059669;
  border: 1px solid #a7f3d0;
}

.radar-status-pill.status-stopped {
  background: #f1f5f9;
  color: #64748b;
  border: 1px solid #e2e8f0;
}

.radar-status-pill.status-provisioning {
  background: #eff6ff;
  color: #2563eb;
  border: 1px solid #bfdbfe;
}

.radar-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  position: relative;
  z-index: 2;
}

.radar-ping-ring {
  position: absolute;
  left: 9px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10b981;
  animation: radar-ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
  z-index: 1;
}

@keyframes radar-ping {
  75%, 100% {
    transform: scale(3.2);
    opacity: 0;
  }
}

/* Bespoke Terminal URL Pill */
.site-url-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 7px 12px;
}

.url-text-wrap {
  display: flex;
  align-items: center;
  gap: 7px;
  min-width: 0;
}

.url-glyph {
  color: #2563eb;
  flex-shrink: 0;
}

.url-mono {
  font-size: 0.78rem;
  color: #2563eb;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.url-actions {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}

.btn-url-action {
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  color: #64748b;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.12s ease;
}

.btn-url-action:hover {
  background: #e2e8f0;
  color: #0f172a;
}

/* Bespoke Dual Infrastructure Meters */
.resource-gauges-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  padding: 12px 14px;
  background: #fafbfc;
  border-radius: 10px;
  border: 1px solid #f1f5f9;
}

.gauge-col {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.gauge-meta {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-size: 0.72rem;
}

.gauge-title {
  color: #64748b;
  font-weight: 700;
  font-size: 0.68rem;
  letter-spacing: 0.04em;
}

.gauge-val {
  color: #0f172a;
  font-size: 0.74rem;
}

.gauge-sub {
  color: #94a3b8;
  font-weight: 400;
}

.custom-meter-track {
  height: 6px;
  background: #e2e8f0;
  border-radius: 999px;
  position: relative;
  overflow: hidden;
}

.custom-meter-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
}

.fill-blue { background: linear-gradient(90deg, #2563eb 0%, #60a5fa 100%); }
.fill-emerald { background: linear-gradient(90deg, #059669 0%, #34d399 100%); }

.meter-glow {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: #ffffff;
  opacity: 0.75;
  border-radius: 999px;
}

/* Card Action Buttons */
.card-action-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid #f1f5f9;
}

.btn-action-primary {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: #09090b;
  color: #ffffff;
  border: 1px solid #09090b;
  padding: 7px 15px;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.12s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.btn-action-primary:hover {
  background: #27272a;
  border-color: #27272a;
}

.runtime-btn-group {
  display: flex;
  gap: 5px;
}

.btn-icon-ctrl {
  width: 30px;
  height: 30px;
  border-radius: 7px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.14s ease;
}

.btn-icon-ctrl:hover:not(:disabled) {
  background: #f8fafc;
  color: #0f172a;
  border-color: #cbd5e1;
}

.btn-play {
  color: #059669;
  border-color: #a7f3d0;
  background: #ecfdf5;
}

.btn-play:hover {
  background: #d1fae5;
  border-color: #6ee7b7;
}

.btn-pause {
  color: #d97706;
}

.btn-pause:hover {
  background: #fffbeb;
  border-color: #fde68a;
}

.btn-term {
  color: #09090b;
}

.btn-term:hover {
  background: #f4f4f5;
  border-color: #09090b;
}

.btn-del:hover {
  background: #fef2f2;
  border-color: #fecaca;
  color: #dc2626;
}

/* Available Slot Placeholder Cards */
.empty-slot-card {
  border: 1.5px dashed #d4d4d8;
  border-radius: 16px;
  background: #fafafa;
  min-height: 230px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.16s ease;
  padding: 24px;
}

.empty-slot-card:hover {
  border-color: #09090b;
  background: #f4f4f5;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px -6px rgba(0, 0, 0, 0.06);
}

.slot-dashed-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 12px;
}

.slot-icon-circle {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #ffffff;
  border: 1px solid #e4e4e7;
  color: #09090b;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s ease, border-color 0.15s ease;
}

.empty-slot-card:hover .slot-icon-circle {
  transform: scale(1.06);
  border-color: #09090b;
}

.slot-text-group {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.slot-badge {
  font-size: 0.7rem;
  font-weight: 600;
  color: #71717a;
  letter-spacing: 0.06em;
  font-family: ui-monospace, monospace;
}

.slot-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #09090b;
}

.slot-specs {
  font-size: 0.74rem;
  color: #71717a;
}

.btn-slot-create {
  margin-top: 4px;
  background: #09090b;
  border: 1px solid #09090b;
  color: #ffffff;
  padding: 6px 14px;
  border-radius: 7px;
  font-size: 0.78rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.12s ease;
}

.empty-slot-card:hover .btn-slot-create {
  background: #27272a;
  border-color: #27272a;
}

/* Empty State */
.empty-state-card {
  background: #ffffff;
  border: 2px dashed #cbd5e1;
  border-radius: 14px;
  padding: 48px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.empty-state-card h3 {
  font-size: 1.1rem;
  color: #0f172a;
}

.empty-state-card p {
  font-size: 0.82rem;
  color: #64748b;
}

/* ==========================================================================
   VIEW 2: EDITOR STUDIO (HIGH-END 2-COLUMN)
   ========================================================================== */
.editor-top-strip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 10px 16px;
  margin-bottom: 16px;
}

.strip-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.lbl-site {
  font-size: 0.78rem;
  color: #64748b;
  font-weight: 600;
}

.select-site-switch {
  padding: 5px 10px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.82rem;
  font-weight: 600;
  color: #0f172a;
  background: #ffffff;
}

.badge-saved {
  font-size: 0.72rem;
  color: #059669;
  background: #ecfdf5;
  padding: 2px 8px;
  border-radius: 4px;
}

.strip-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.screen-size-switch {
  display: flex;
  background: #f1f5f9;
  border-radius: 6px;
  padding: 2px;
}

.btn-screen {
  background: transparent;
  border: none;
  color: #64748b;
  padding: 5px 8px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
}

.btn-screen.active {
  background: #ffffff;
  color: #0f172a;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
}

.btn-deploy-live {
  background: #0f172a;
  color: #ffffff;
  border: 1px solid #0f172a;
  padding: 7px 14px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.12);
}

.btn-deploy-live:hover:not(:disabled) {
  background: #1e293b;
}

.builder-split-body {
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: 20px;
  align-items: start;
}

@media (max-width: 960px) {
  .builder-split-body {
    grid-template-columns: 1fr;
  }
}

.builder-controls-panel {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
}

.panel-section-title {
  font-size: 0.68rem;
  font-weight: 700;
  color: #94a3b8;
  letter-spacing: 0.08em;
  margin-bottom: 12px;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 14px;
}

.form-item label {
  font-size: 0.78rem;
  font-weight: 600;
  color: #334155;
}

.input-pro {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.84rem;
  color: #0f172a;
  background: #ffffff;
}

.input-pro:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.textarea-pro {
  resize: vertical;
  line-height: 1.4;
}

.input-readonly {
  background: #f8fafc;
  color: #64748b;
  cursor: not-allowed;
}

/* AI Copilot Box */
.ai-generator-box {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 6px;
}

.ai-box-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.76rem;
  font-weight: 700;
  color: #0f172a;
}

.btn-ai-submit {
  background: #2563eb;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 0.76rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.btn-ai-submit:hover:not(:disabled) {
  background: #1d4ed8;
}

.colors-row {
  display: flex;
  gap: 8px;
}

.color-dot {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: transform 0.1s ease;
}

.color-dot.selected {
  border-color: #0f172a;
  transform: scale(1.1);
}

/* Preview Canvas */
.builder-preview-canvas {
  display: flex;
  justify-content: center;
  transition: all 0.2s ease;
}

.builder-preview-canvas.device-desktop { width: 100%; }
.builder-preview-canvas.device-tablet { width: 720px; margin: 0 auto; }
.builder-preview-canvas.device-mobile { width: 360px; margin: 0 auto; }

.browser-mockup {
  width: 100%;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 20px -5px rgba(15, 23, 42, 0.08);
}

.browser-mockup-bar {
  background: #f1f5f9;
  border-bottom: 1px solid #e2e8f0;
  padding: 8px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.browser-circle-dots {
  display: flex;
  gap: 5px;
}

.browser-circle-dots span {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #cbd5e1;
}

.browser-url-pill {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  padding: 2px 10px;
  border-radius: 4px;
  font-size: 0.72rem;
  color: #475569;
  display: flex;
  align-items: center;
  gap: 5px;
  font-family: monospace;
}

.badge-live-tag {
  font-size: 0.7rem;
  color: #059669;
  font-weight: 600;
}

.rendered-page {
  padding: 28px 24px;
  background: #ffffff;
}

.page-top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 20px;
  border-bottom: 1px solid #f1f5f9;
}

.site-logo {
  font-size: 1.1rem;
  font-weight: 700;
}

.nav-mock-links {
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 0.8rem;
  color: #64748b;
}

.btn-mock-cta {
  color: #ffffff;
  border: none;
  padding: 4px 10px;
  border-radius: 5px;
  font-size: 0.75rem;
  font-weight: 600;
}

.page-hero-mock {
  padding: 32px 0 24px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hero-tag-badge {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid;
  margin-bottom: 10px;
}

.hero-h2 {
  font-size: 1.45rem;
  color: #0f172a;
  max-width: 520px;
  line-height: 1.3;
  margin-bottom: 8px;
}

.hero-p {
  font-size: 0.86rem;
  color: #64748b;
  max-width: 480px;
  line-height: 1.4;
  margin-bottom: 16px;
}

.hero-btns-mock {
  display: flex;
  gap: 8px;
}

.btn-hero-pri {
  color: #ffffff;
  border: none;
  padding: 7px 14px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
}

.btn-hero-sec {
  background: #f8fafc;
  color: #0f172a;
  border: 1px solid #e2e8f0;
  padding: 7px 14px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
}

.page-features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #f1f5f9;
}

.feature-mock-card {
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  border-radius: 8px;
  padding: 12px;
}

.feature-mock-card h4 {
  font-size: 0.82rem;
  color: #0f172a;
  margin: 6px 0 3px;
}

.feature-mock-card p {
  font-size: 0.72rem;
  color: #64748b;
  line-height: 1.3;
}

/* ==========================================================================
   VIEW 3 & 4: TEMPLATES & ANALYTICS
   ========================================================================== */
.template-market-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 18px;
}

.tpl-market-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
  transition: all 0.15s ease;
}

.tpl-market-card:hover {
  border-color: #cbd5e1;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px -4px rgba(15, 23, 42, 0.08);
}

.tpl-card-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.tpl-type-pill {
  font-size: 0.68rem;
  font-weight: 700;
  color: #2563eb;
  background: #eff6ff;
  padding: 2px 6px;
  border-radius: 4px;
}

.tpl-tier-pill {
  font-size: 0.7rem;
  color: #059669;
  background: #ecfdf5;
  padding: 2px 6px;
  border-radius: 999px;
  font-weight: 600;
}

.tpl-tier-pill.tier-pro {
  color: #7c3aed;
  background: #f5f3ff;
}

.tpl-icon-preview {
  height: 110px;
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
}

.tpl-card-title {
  font-size: 0.98rem;
  color: #0f172a;
  margin-bottom: 4px;
}

.tpl-card-desc {
  font-size: 0.78rem;
  color: #64748b;
  margin-bottom: 12px;
  line-height: 1.35;
}

.tpl-checklist {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 16px;
}

.tpl-checklist li {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  color: #475569;
}

.tpl-card-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid #f1f5f9;
}

.tpl-cost span {
  display: block;
  font-size: 0.68rem;
  color: #64748b;
}

.tpl-cost strong {
  font-size: 0.78rem;
  color: #0f172a;
}

.btn-use-tpl {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: #0f172a;
  color: #ffffff;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.76rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease;
}

.btn-use-tpl:hover {
  background: #1e293b;
}

/* Analytics */
.analytics-strip-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.analytics-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 16px;
}

.a-label {
  font-size: 0.68rem;
  font-weight: 700;
  color: #64748b;
  display: block;
  margin-bottom: 4px;
}

.a-val {
  font-size: 1.4rem;
  font-weight: 700;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 6px;
}

.a-growth {
  font-size: 0.72rem;
  background: #ecfdf5;
  color: #059669;
  padding: 1px 6px;
  border-radius: 999px;
}

.a-sub {
  font-size: 0.72rem;
  color: #64748b;
  margin-top: 3px;
  display: block;
}

.analytics-two-col {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 18px;
}

.pro-panel {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
}

.panel-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.panel-head h3 {
  font-size: 0.98rem;
  color: #0f172a;
}

.redis-chip {
  font-size: 0.68rem;
  color: #dc2626;
  background: #fef2f2;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
}

.rank-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.rank-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: #f8fafc;
  border-radius: 8px;
}

.rank-badge {
  width: 22px;
  height: 22px;
  background: #eff6ff;
  color: #2563eb;
  font-weight: 700;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.76rem;
  flex-shrink: 0;
}

.rank-title-group {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.rank-title-group strong {
  font-size: 0.82rem;
  color: #0f172a;
}

.rank-title-group span {
  font-size: 0.7rem;
  color: #64748b;
}

.rank-hit {
  font-size: 0.78rem;
  color: #2563eb;
  font-weight: 700;
}

.terminal-log-window {
  background: #0f172a;
  border-radius: 8px;
  padding: 14px;
  font-family: monospace;
  font-size: 0.74rem;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.t-line {
  color: #cbd5e1;
}

.t-line span {
  color: #64748b;
  margin-right: 6px;
}

/* Billing Two Col */
.billing-two-col {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 20px;
}

.plan-summary-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-bottom: 16px;
  border-bottom: 1px solid #f1f5f9;
  margin-bottom: 16px;
}

.plan-active-tag {
  font-size: 0.68rem;
  font-weight: 700;
  color: #2563eb;
}

.plan-h2 {
  font-size: 1.3rem;
  color: #0f172a;
  margin: 2px 0;
}

.plan-cost {
  font-size: 0.86rem;
  color: #64748b;
}

.plan-resource-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.resource-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.82rem;
  padding: 8px 10px;
  background: #f8fafc;
  border-radius: 6px;
}

.resource-row span { color: #64748b; }
.resource-row strong { color: #0f172a; }

.addon-panel h3 {
  font-size: 1.05rem;
  color: #0f172a;
  margin-bottom: 4px;
}

.addon-panel p {
  font-size: 0.8rem;
  color: #64748b;
  margin-bottom: 14px;
}

.addon-price-tag {
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  padding: 12px;
  text-align: center;
  margin-bottom: 14px;
}

.addon-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #1d4ed8;
}

.addon-sub {
  font-size: 0.78rem;
  color: #2563eb;
}

.btn-add-slot {
  width: 100%;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  color: #0f172a;
  padding: 8px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.15s ease;
}

.btn-add-slot:hover {
  background: #f8fafc;
  border-color: #94a3b8;
}

/* ==========================================================================
   HANDCRAFTED MINIMALIST SAAS MODAL (LINEAR / VERCEL GRADE)
   ========================================================================== */
.modal-backdrop {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  box-sizing: border-box;
  animation: modalFade 0.15s ease-out;
}

@keyframes modalFade {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-dialog {
  background: #ffffff;
  border: 1px solid #e4e4e7;
  border-radius: 14px;
  width: 100%;
  max-width: 580px;
  max-height: calc(100vh - 32px);
  overflow-y: auto;
  padding: 28px;
  box-sizing: border-box;
  box-shadow: 0 20px 35px -10px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(0, 0, 0, 0.08);
  animation: dialogScale 0.18s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  z-index: 100000;
}

.modal-dialog-lg {
  max-width: 820px !important;
}

@keyframes dialogScale {
  from { opacity: 0; transform: scale(0.97) translateY(4px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 22px;
  width: 100%;
}

.modal-header-leading {
  display: flex;
  align-items: center;
  gap: 12px;
}

.modal-header-icon-box {
  width: 38px;
  height: 38px;
  border-radius: 9px;
  background: #f4f4f5;
  border: 1px solid #e4e4e7;
  color: #18181b;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.modal-heading {
  font-size: 1.15rem;
  font-weight: 700;
  color: #09090b;
  letter-spacing: -0.015em;
}

.modal-subheading {
  font-size: 0.8rem;
  color: #71717a;
  margin-top: 2px;
  line-height: 1.4;
}

.modal-close-button {
  background: transparent;
  border: none;
  color: #71717a;
  cursor: pointer;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.12s ease;
  margin: 0;
}

.modal-close-button:hover {
  background: #f4f4f5;
  color: #09090b;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

.form-field-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

.field-title-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.field-title {
  font-size: 0.8rem;
  font-weight: 600;
  color: #27272a;
  letter-spacing: -0.01em;
}

.field-req-dot {
  color: #e11d48;
  margin-left: 2px;
}

.field-optional-badge {
  font-size: 0.72rem;
  color: #a1a1aa;
  font-weight: 400;
}

/* Template Selector: Clean Tactile Radio Cards */
.template-selector-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  width: 100%;
}

.template-option {
  padding: 12px 14px;
  border: 1px solid #e4e4e7;
  border-radius: 9px;
  background: #ffffff;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  text-align: left;
  transition: all 0.14s ease;
  width: 100%;
  box-sizing: border-box;
}

.template-option:hover {
  border-color: #a1a1aa;
  background: #fafafa;
}

.template-option.active {
  border-color: #09090b;
  background: #fafafa;
  box-shadow: 0 0 0 1px #09090b;
}

.template-option-icon {
  width: 30px;
  height: 30px;
  border-radius: 6px;
  background: #f4f4f5;
  color: #71717a;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.14s ease;
}

.template-option:hover .template-option-icon {
  background: #e4e4e7;
  color: #18181b;
}

.template-option.active .template-option-icon {
  background: #09090b;
  color: #ffffff;
}

.template-option-radio {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1.5px solid #d4d4d8;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-left: auto;
  transition: border-color 0.14s ease;
}

.template-option.active .template-option-radio {
  border-color: #09090b;
}

.radio-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #09090b;
  opacity: 0;
  transform: scale(0.6);
  transition: all 0.14s ease;
}

.template-option.active .radio-dot {
  opacity: 1;
  transform: scale(1);
}

.template-option-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  flex: 1;
}

.template-option-name {
  font-size: 0.83rem;
  font-weight: 600;
  color: #09090b;
}

.template-option-desc {
  font-size: 0.72rem;
  color: #71717a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Handcrafted Input Fields */
.field-text-input {
  width: 100%;
  height: 40px;
  padding: 0 12px;
  border: 1px solid #d4d4d8;
  border-radius: 8px;
  background: #ffffff;
  font-size: 0.86rem;
  color: #09090b;
  font-family: inherit;
  transition: border-color 0.14s ease, box-shadow 0.14s ease;
  box-sizing: border-box;
}

.field-text-input::placeholder {
  color: #a1a1aa;
}

.field-text-input:focus {
  outline: none;
  border-color: #09090b;
  box-shadow: 0 0 0 1px #09090b;
}

/* Subdomain Composite URL */
.url-input-container {
  display: flex;
  align-items: center;
  border: 1px solid #d4d4d8;
  border-radius: 8px;
  height: 40px;
  background: #ffffff;
  transition: border-color 0.14s ease, box-shadow 0.14s ease;
  width: 100%;
  box-sizing: border-box;
  padding: 0 12px;
  gap: 6px;
}

.url-input-container:focus-within {
  border-color: #09090b;
  box-shadow: 0 0 0 1px #09090b;
}

.url-addon-prefix {
  color: #a1a1aa;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.82rem;
  user-select: none;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.url-addon-icon {
  color: #a1a1aa;
  flex-shrink: 0;
}

.url-core-input {
  flex: 1;
  height: 100%;
  border: none;
  outline: none;
  background: transparent;
  padding: 0 2px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.84rem;
  font-weight: 500;
  color: #09090b;
  min-width: 0;
}

.url-core-input::placeholder {
  color: #a1a1aa;
  font-weight: 400;
}

.url-addon-suffix {
  color: #71717a;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.82rem;
  user-select: none;
  flex-shrink: 0;
  font-weight: 500;
  margin-left: auto;
}

.field-helper-text {
  font-size: 0.73rem;
  color: #71717a;
  margin-top: 3px;
  line-height: 1.4;
}

/* Minimalist Hardware Resource Note */
.resource-spec-callout {
  background: #f4f4f5;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 0.75rem;
  color: #52525b;
  display: flex;
  align-items: center;
  gap: 8px;
  box-sizing: border-box;
  width: 100%;
}

.spec-callout-icon {
  color: #71717a;
  flex-shrink: 0;
}

.spec-callout-text strong {
  color: #18181b;
  font-weight: 600;
}

/* Modal Actions */
.modal-footer-row {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  margin-top: 8px;
  padding-top: 18px;
  border-top: 1px solid #f4f4f5;
  width: 100%;
  box-sizing: border-box;
}

.btn-modal-ghost {
  background: transparent;
  border: 1px solid #e4e4e7;
  color: #52525b;
  font-size: 0.84rem;
  font-weight: 500;
  height: 38px;
  padding: 0 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.12s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-modal-ghost:hover {
  background: #f4f4f5;
  color: #09090b;
  border-color: #d4d4d8;
}

.btn-modal-confirm {
  background: #09090b;
  color: #ffffff;
  border: 1px solid #09090b;
  font-size: 0.84rem;
  font-weight: 500;
  height: 38px;
  padding: 0 18px;
  border-radius: 8px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.12s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.btn-modal-confirm:hover {
  background: #27272a;
  border-color: #27272a;
}

.spinner-tiny {
  width: 12px;
  height: 12px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Terminal Logs Dialog (Enlarged Pro Developer Sizing) */
.modal-dialog-lg {
  max-width: 880px;
  width: 100%;
}

.terminal-container-view {
  background: #09090b;
  border: 1px solid #27272a;
  border-radius: 12px;
  overflow: hidden;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.terminal-meta-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 18px;
  background: #18181b;
  border-bottom: 1px solid #27272a;
  font-size: 0.78rem;
}

.terminal-meta-left {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.terminal-meta-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.t-stream-tag {
  color: #a1a1aa;
  font-size: 0.74rem;
  font-weight: 500;
}

.terminal-meta-item {
  display: flex;
  align-items: center;
  gap: 7px;
}

.t-meta-lbl {
  color: #71717a;
  font-weight: 600;
  font-size: 0.7rem;
  letter-spacing: 0.04em;
}

.t-meta-val {
  color: #e4e4e7;
  font-weight: 500;
}

.t-meta-val.running {
  color: #10b981;
  font-weight: 600;
}

.t-meta-val.stopped {
  color: #f59e0b;
  font-weight: 600;
}

.t-meta-val.provisioning {
  color: #3b82f6;
  font-weight: 600;
}

.terminal-output-screen {
  padding: 18px 20px;
  min-height: 320px;
  max-height: 420px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 0.82rem;
  line-height: 1.6;
}

.log-entry {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  color: #d4d4d8;
  word-break: break-word;
}

.log-ts {
  color: #71717a;
  flex-shrink: 0;
}

.log-tag {
  font-weight: 600;
  flex-shrink: 0;
}

.log-tag.system { color: #c084fc; }
.log-tag.docker { color: #60a5fa; }
.log-tag.traefik { color: #34d399; }
.log-tag.tls { color: #a78bfa; }
.log-tag.nginx { color: #f472b6; }
.log-tag.health { color: #4ade80; }
.log-tag.traffic { color: #38bdf8; }
.log-tag.warn { color: #fbbf24; }

.fade-in-section {
  animation: fadeIn 0.18s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ==========================================================================
   ENTERPRISE SUITE MODULE STYLES (TABLES, MEDIA, DOMAINS, INVOICES, MODALS)
   ========================================================================== */

/* Pro Table & Layout */
.table-responsive {
  width: 100%;
  overflow-x: auto;
}

.pro-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.82rem;
  text-align: left;
}

.pro-table th {
  padding: 10px 14px;
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: #71717a;
  background: #fafafa;
  border-bottom: 1px solid #e4e4e7;
  white-space: nowrap;
}

.pro-table td {
  padding: 12px 14px;
  border-bottom: 1px solid #f4f4f5;
  color: #18181b;
  vertical-align: middle;
}

.pro-table tbody tr:hover td {
  background: #fbfbfb;
}

.pro-table tbody tr:last-child td {
  border-bottom: none;
}

/* Content Module */
.article-title-cell strong {
  font-size: 0.86rem;
  font-weight: 600;
  color: #09090b;
  display: block;
}

.article-slug-text {
  font-size: 0.72rem;
  color: #71717a;
  font-family: monospace;
}

.category-pill {
  display: inline-flex;
  align-items: center;
  font-size: 0.7rem;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 100px;
  background: #f4f4f5;
  color: #3f3f46;
  border: 1px solid #e4e4e7;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 100px;
  letter-spacing: 0.03em;
}

.status-badge.badge-published {
  background: #ecfdf5;
  color: #059669;
  border: 1px solid #a7f3d0;
}

.status-badge.badge-draft {
  background: #f4f4f5;
  color: #71717a;
  border: 1px solid #e4e4e7;
}

.views-count {
  font-size: 0.8rem;
  font-weight: 600;
  color: #18181b;
}

.date-cell {
  font-size: 0.75rem;
  color: #71717a;
}

.row-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
}

.btn-action-icon {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 1px solid #e4e4e7;
  background: #ffffff;
  color: #71717a;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-action-icon:hover {
  background: #f4f4f5;
  color: #09090b;
}

.btn-action-icon.danger:hover {
  background: #fef2f2;
  color: #dc2626;
  border-color: #fecaca;
}

.btn-action-icon.external:hover {
  background: #eff6ff;
  color: #2563eb;
  border-color: #bfdbfe;
}

/* Media Storage Module */
.storage-metric-panel {
  background: #fafafa;
  border: 1px solid #e4e4e7;
  border-radius: 10px;
  padding: 16px 20px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.storage-info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.storage-text-block strong {
  font-size: 0.92rem;
  color: #09090b;
  display: block;
}

.storage-text-block span {
  font-size: 0.78rem;
  color: #71717a;
}

.storage-actions {
  display: flex;
  gap: 8px;
}

.storage-prog-track {
  width: 100%;
  height: 7px;
  background: #e4e4e7;
  border-radius: 999px;
  overflow: hidden;
}

.storage-prog-fill {
  height: 100%;
  background: #09090b;
  border-radius: 999px;
  transition: width 0.3s ease;
}

.media-assets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 14px;
}

.media-card {
  background: #ffffff;
  border: 1px solid #e4e4e7;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.15s ease;
}

.media-card:hover {
  border-color: #a1a1aa;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
}

.media-thumb-box {
  height: 130px;
  background: #f4f4f5;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.media-thumb-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.media-meta-box {
  padding: 10px 12px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.media-name-txt {
  font-size: 0.8rem;
  font-weight: 600;
  color: #09090b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 140px;
  display: block;
}

.media-detail-txt {
  font-size: 0.72rem;
  color: #71717a;
  display: block;
  margin-top: 2px;
}

.media-del-btn {
  width: 26px;
  height: 26px;
  border-radius: 6px;
  border: 1px solid transparent;
  background: transparent;
  color: #a1a1aa;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.media-del-btn:hover {
  background: #fef2f2;
  color: #dc2626;
  border-color: #fecaca;
}

/* Custom Domains Module */
.add-domain-box {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.domain-name-cell {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.86rem;
  font-weight: 600;
  color: #09090b;
}

.dns-target-code {
  font-family: monospace;
  font-size: 0.74rem;
  background: #f4f4f5;
  padding: 3px 6px;
  border-radius: 4px;
  color: #3f3f46;
}

.ssl-live-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.7rem;
  font-weight: 600;
  color: #059669;
  background: #ecfdf5;
  padding: 2px 8px;
  border-radius: 100px;
  border: 1px solid #a7f3d0;
}

.dns-records-helper {
  margin-top: 20px;
  background: #fafafa;
  border: 1px solid #e4e4e7;
  border-radius: 10px;
  padding: 18px;
}

.dns-tip-box {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-top: 12px;
  font-size: 0.76rem;
  color: #71717a;
  background: #ffffff;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid #e4e4e7;
}

/* Webhooks & API Module */
.api-key-box {
  background: #fafafa;
  border: 1px solid #e4e4e7;
  border-radius: 10px;
  padding: 18px;
  margin-bottom: 20px;
}

.api-key-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.api-key-header h4 {
  font-size: 0.88rem;
  font-weight: 600;
  color: #09090b;
  margin: 0;
}

.api-key-header p {
  font-size: 0.75rem;
  color: #71717a;
  margin: 3px 0 0 0;
}

.btn-copy-token {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.74rem;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 6px;
  background: #ffffff;
  border: 1px solid #e4e4e7;
  color: #18181b;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-copy-token:hover {
  background: #f4f4f5;
  border-color: #d4d4d8;
}

.api-token-display {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  border: 1px solid #e4e4e7;
  border-radius: 8px;
  padding: 10px 14px;
}

.api-token-display code {
  font-family: monospace;
  font-size: 0.78rem;
  color: #09090b;
}

.btn-reveal-token {
  font-size: 0.72rem;
  font-weight: 600;
  color: #71717a;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 2px 6px;
}

.btn-reveal-token:hover {
  color: #09090b;
}

.webhook-url-code {
  font-family: monospace;
  font-size: 0.74rem;
  color: #09090b;
  background: #f4f4f5;
  padding: 3px 6px;
  border-radius: 4px;
}

.event-tags-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.event-badge {
  font-size: 0.68rem;
  font-weight: 500;
  background: #eff6ff;
  color: #2563eb;
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid #bfdbfe;
}

.btn-test-webhook {
  font-size: 0.72rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 6px;
  background: #ffffff;
  border: 1px solid #e4e4e7;
  color: #18181b;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-test-webhook:hover {
  background: #f4f4f5;
  border-color: #a1a1aa;
}

/* Invoices Module */
.invoice-id-code {
  font-family: monospace;
  font-size: 0.76rem;
  font-weight: 700;
  color: #09090b;
}

.inv-plan-cell strong {
  font-size: 0.82rem;
  color: #09090b;
  display: block;
}

.inv-period-text {
  font-size: 0.72rem;
  color: #71717a;
}

.payment-method-tag {
  font-size: 0.74rem;
  color: #3f3f46;
}

.total-price-cell {
  font-size: 0.86rem;
  font-weight: 700;
  color: #09090b;
}

.btn-invoice-view {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.72rem;
  font-weight: 600;
  padding: 5px 10px;
  border-radius: 6px;
  background: #09090b;
  color: #ffffff;
  border: none;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-invoice-view:hover {
  background: #27272a;
}

.btn-invoice-dl {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.72rem;
  font-weight: 500;
  padding: 5px 9px;
  border-radius: 6px;
  background: #ffffff;
  color: #71717a;
  border: 1px solid #e4e4e7;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-invoice-dl:hover {
  background: #f4f4f5;
  color: #09090b;
}

/* Official Tax Invoice Modal Paper Styling */
.invoice-doc-body {
  padding: 20px 24px;
  background: #fafafa;
  max-height: 70vh;
  overflow-y: auto;
}

.invoice-paper {
  background: #ffffff;
  border: 1px solid #e4e4e7;
  border-radius: 10px;
  padding: 28px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
}

.inv-paper-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid #f4f4f5;
  padding-bottom: 20px;
  margin-bottom: 20px;
}

.inv-company-brand {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.inv-brand-mark {
  width: 38px;
  height: 38px;
  border-radius: 8px;
  background: #09090b;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.inv-brand-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #09090b;
  margin: 0 0 2px 0;
}

.inv-brand-sub {
  font-size: 0.72rem;
  color: #71717a;
  margin: 0;
  line-height: 1.4;
}

.inv-badge-block {
  text-align: right;
}

.inv-paid-seal {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.7rem;
  font-weight: 700;
  color: #059669;
  background: #ecfdf5;
  padding: 4px 10px;
  border-radius: 100px;
  border: 1px solid #a7f3d0;
  letter-spacing: 0.04em;
}

.inv-number-stamp {
  font-family: monospace;
  font-size: 0.76rem;
  font-weight: 700;
  color: #71717a;
  margin-top: 6px;
}

.inv-meta-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f4f4f5;
  margin-bottom: 20px;
}

.inv-meta-col {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.inv-meta-hdr {
  font-size: 0.66rem;
  font-weight: 600;
  color: #a1a1aa;
  letter-spacing: 0.05em;
}

.inv-meta-val {
  font-size: 0.84rem;
  color: #09090b;
  margin-top: 2px;
}

.inv-meta-sub {
  font-size: 0.72rem;
  color: #71717a;
}

.inv-table-wrap {
  margin-bottom: 20px;
}

.inv-items-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8rem;
}

.inv-items-table th {
  background: #fafafa;
  border-bottom: 1px solid #e4e4e7;
  padding: 8px 12px;
  font-size: 0.68rem;
  font-weight: 600;
  color: #71717a;
  letter-spacing: 0.04em;
  text-align: left;
}

.inv-items-table td {
  padding: 12px;
  border-bottom: 1px solid #f4f4f5;
  color: #18181b;
}

.inv-item-desc {
  font-size: 0.7rem;
  color: #71717a;
  margin: 2px 0 0 0;
}

.inv-summary-row {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 20px;
  align-items: flex-start;
  padding-top: 12px;
}

.inv-note-box {
  font-size: 0.72rem;
  color: #71717a;
  background: #fafafa;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #f4f4f5;
}

.inv-note-box strong {
  color: #09090b;
  display: block;
  margin-bottom: 4px;
}

.inv-note-box p {
  margin: 0;
  line-height: 1.4;
}

.inv-calc-box {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.inv-calc-line {
  display: flex;
  justify-content: space-between;
  font-size: 0.78rem;
  color: #71717a;
}

.inv-calc-line strong {
  color: #09090b;
}

.inv-calc-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  border-top: 1px solid #e4e4e7;
  font-size: 0.95rem;
  font-weight: 700;
  color: #09090b;
}
</style>
