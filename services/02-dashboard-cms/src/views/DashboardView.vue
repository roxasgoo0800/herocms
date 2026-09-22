<script setup lang="ts">
import { onMounted, watch, defineAsyncComponent } from 'vue';
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
  LifeBuoy,
  ArrowLeft,
  PanelLeftClose,
  PanelLeftOpen,
  ExternalLink,
  Check,
  History
} from 'lucide-vue-next';
import { useDashboardData } from '../composables/useDashboardData';

// Modular View Components (Lazy Loaded On-Demand for Maximum Speed & Lean Memory)
const ContainersModule = defineAsyncComponent(() => import('../components/dashboard/ContainersModule.vue'));
const VisualEditorModule = defineAsyncComponent(() => import('../components/dashboard/VisualEditorModule.vue'));
const ContentArticlesModule = defineAsyncComponent(() => import('../components/dashboard/ContentArticlesModule.vue'));
const MediaAssetsModule = defineAsyncComponent(() => import('../components/dashboard/MediaAssetsModule.vue'));
const TemplatesCatalogModule = defineAsyncComponent(() => import('../components/dashboard/TemplatesCatalogModule.vue'));
const CustomDomainsModule = defineAsyncComponent(() => import('../components/dashboard/CustomDomainsModule.vue'));
const AnalyticsTelemetryModule = defineAsyncComponent(() => import('../components/dashboard/AnalyticsTelemetryModule.vue'));
const WebhooksApiModule = defineAsyncComponent(() => import('../components/dashboard/WebhooksApiModule.vue'));
const BillingPlanModule = defineAsyncComponent(() => import('../components/dashboard/BillingPlanModule.vue'));
const InvoicesHistoryModule = defineAsyncComponent(() => import('../components/dashboard/InvoicesHistoryModule.vue'));
const SupportTicketingModule = defineAsyncComponent(() => import('../components/dashboard/SupportTicketingModule.vue'));
const ChangelogModule = defineAsyncComponent(() => import('../components/dashboard/ChangelogModule.vue'));
import { useSplashTransition } from '../composables/useSplashTransition';

const router = useRouter();
const { isDashboardEntering } = useSplashTransition();

const {
  activeMenu,
  isEditorSidebarHidden,
  isReaderSidebarHidden,
  userEmail,
  userPlan,
  usedContainersCount,
  containers,
  articles,
  activeArticleForReader,
  copyToClipboard,
  copiedSubdomain,
  openCreateModal,
  toastMessage,
  isCreateModalOpen,
  newSiteForm,
  handleCreateContainer,
  isLogsModalOpen,
  activeLogContainer,
  copyContainerLogs,
  syncWithBackend,
  executeLogout
} = useDashboardData();

onMounted(async () => {
  await syncWithBackend();
});

// Smooth scroll ke atas saat berganti menu antarmuka
watch(activeMenu, () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

const handleLogout = async () => {
  await executeLogout(router);
};
</script>

<template>
  <div class="dashboard-root-layout">
    <div
      class="app-shell"
      :class="{
        'editor-immersive-mode': activeMenu === 'editor' && isEditorSidebarHidden,
        'reader-immersive-mode': activeMenu === 'content' && activeArticleForReader && isReaderSidebarHidden,
        'dashboard-choreographed-enter': isDashboardEntering
      }"
    >
    <!-- 1. LEFT SIDEBAR: Professional Cloud Console Navigation -->
    <aside class="app-sidebar">
      <!-- Workspace Brand Switcher -->
      <div class="sidebar-header">
        <div class="workspace-brand-header">
          <div class="brand-glyph">
            <Layers :size="18" color="#ffffff" />
          </div>
          <div class="brand-meta">
            <div class="brand-title">
              HeroCMS <span class="brand-gradient">Studio</span>
            </div>
            <div class="brand-plan-row">
              <span class="pulse-green"></span>
              <span class="plan-name">{{ userPlan.name }}</span>
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
            <span class="nav-badge">{{ usedContainersCount }}/{{ userPlan.maxContainers }}</span>
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
            <span class="nav-badge">{{ articles.length }}</span>
          </button>

          <button
            class="nav-link"
            :class="{ active: activeMenu === 'media' }"
            @click="activeMenu = 'media'"
          >
            <HardDrive :size="17" />
            <span class="nav-link-text">Media Assets (S3)</span>
            <span class="nav-badge">120MB</span>
          </button>

          <button
            class="nav-link"
            :class="{ active: activeMenu === 'templates' }"
            @click="activeMenu = 'templates'"
          >
            <Palette :size="17" />
            <span class="nav-link-text">Katalog Template</span>
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
            <span class="nav-badge badge-success">SSL</span>
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
            <span class="nav-badge badge-success">Lunas</span>
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
            <span class="nav-badge badge-warning">1 Aktif</span>
          </button>
        </nav>

        <div class="nav-section-title">INFORMASI & SISTEM</div>
        <nav class="sidebar-nav-list">
          <button
            class="nav-link"
            :class="{ active: activeMenu === 'changelog' }"
            @click="activeMenu = 'changelog'"
          >
            <History :size="17" />
            <span class="nav-link-text">Changelog & Rilis</span>
            <span class="nav-badge badge-primary">v1.2.5</span>
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
          <!-- Back button if in reader mode -->
          <button
            v-if="activeMenu === 'content' && activeArticleForReader"
            class="btn-top-back-reader"
            @click="activeArticleForReader = null"
            title="Kembali ke Daftar Artikel"
          >
            <ArrowLeft :size="13" />
            <span>Kembali ke Daftar</span>
          </button>
          <span v-if="activeMenu === 'content' && activeArticleForReader" class="crumb-sep">/</span>

          <span>HeroCMS Studio</span>
          <ChevronRight :size="14" class="crumb-sep" />
          <span
            :class="activeMenu === 'content' && activeArticleForReader ? 'crumb-link' : 'crumb-current'"
            @click="activeMenu === 'content' && activeArticleForReader ? (activeArticleForReader = null) : null"
            :title="activeMenu === 'content' && activeArticleForReader ? 'Kembali ke Daftar Artikel' : undefined"
          >
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
              activeMenu === 'tickets' ? 'Pusat Bantuan & Tiket Support' :
              'Changelog & Catatan Rilis Sistem'
            }}
          </span>
          <template v-if="activeMenu === 'content' && activeArticleForReader">
            <ChevronRight :size="14" class="crumb-sep" />
            <span class="crumb-current crumb-article-title" :title="activeArticleForReader.title">
              {{ activeArticleForReader.title }}
            </span>
          </template>
        </div>

        <!-- Top Actions -->
        <div v-if="activeMenu === 'content' && activeArticleForReader" class="top-actions">
          <!-- Toggle Sidebar Menu (Mode Fokus Membaca) -->
          <button
            class="btn-top-reader-toggle"
            @click="isReaderSidebarHidden = !isReaderSidebarHidden"
            :title="isReaderSidebarHidden ? 'Tampilkan Menu Navigasi' : 'Sembunyikan Menu Navigasi (Mode Fokus)'"
          >
            <PanelLeftOpen v-if="isReaderSidebarHidden" :size="14" />
            <PanelLeftClose v-else :size="14" />
            <span>{{ isReaderSidebarHidden ? 'Tampilkan Menu' : 'Sembunyikan Menu' }}</span>
          </button>

          <!-- Copy Link -->
          <button
            class="btn-top-reader-action"
            @click="copyToClipboard(`https://rizalpratama.cloud/${activeArticleForReader.slug}`, activeArticleForReader.id)"
            :title="copiedSubdomain === activeArticleForReader.id ? 'Tersalin!' : 'Salin URL Publik'"
          >
            <Check v-if="copiedSubdomain === activeArticleForReader.id" :size="13" class="text-green" />
            <Copy v-else :size="13" />
            <span>{{ copiedSubdomain === activeArticleForReader.id ? 'Tersalin' : 'Salin Tautan' }}</span>
          </button>

          <!-- Open Live URL -->
          <a
            :href="`https://rizalpratama.cloud/${activeArticleForReader.slug}`"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-top-reader-action"
            title="Buka Halaman di Tab Baru"
          >
            <ExternalLink :size="13" />
            <span>Buka URL Publik</span>
          </a>
        </div>

        <div v-else class="top-actions">
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
        <ChangelogModule v-else-if="activeMenu === 'changelog'" />
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
