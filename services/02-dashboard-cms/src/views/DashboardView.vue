<script setup lang="ts">
import { ref, onMounted, watch, defineAsyncComponent, computed } from 'vue';
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
  PanelLeftClose,
  PanelLeftOpen,
  ExternalLink,
  History,
  RotateCw,
  Search,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  Download,
  Trash2,
  Lock,
  AlertTriangle
} from 'lucide-vue-next';
import { useDashboardData } from '../composables/useDashboardData';
import { generateContainerLogs, type ContainerLogEntry } from '../data/container-logs';

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
import { changelogReleases } from '../data/changelog';

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
  cmsPages,
  activeArticleForReader,
  getArticleLiveUrl,
  mediaStorage,
  openCreateModal,
  toastMessage,
  isCreateModalOpen,
  newSiteForm,
  handleCreateContainer,
  isLogsModalOpen,
  activeLogContainer,
  copyContainerLogs,
  syncWithBackend,
  executeLogout,
  restartContainer,
  selectedContainerForDetail,
  containerToDelete,
  isDeleteContainerModalOpen,
  isDeletingContainer,
  cancelDeleteContainer,
  confirmDeleteContainer
} = useDashboardData();

const dashboardVersion = computed(() =>
  changelogReleases[0]?.version || 'v1.14.28'
);
const latestSystemVersion = dashboardVersion;

interface BlueprintTemplate {
  id: 'business' | 'portfolio' | 'blog' | 'education';
  name: string;
  desc: string;
  icon: any;
  badge?: string;
}

const blueprintOptions: BlueprintTemplate[] = [
  { id: 'business', name: 'Toko Online & Retail', desc: 'Etalase produk, diskon & WhatsApp checkout', icon: ShoppingBag, badge: 'Flagship' },
  { id: 'portfolio', name: 'Portofolio Teknis', desc: 'Studi kasus & cloud telemetry', icon: Briefcase },
  { id: 'blog', name: 'Blog & Editorial', desc: 'Artikel, publikasi & berita', icon: BookOpen },
  { id: 'education', name: 'Pusat Edukasi LMS', desc: 'Silabus kursus & modul', icon: GraduationCap }
];

// Real-time subdomain availability check
const isSubdomainAvailable = (sub: string) => {
  const clean = sub.toLowerCase().trim();
  if (!clean) return true;
  return !containers.value.some(c => c.subdomain.split('.')[0] === clean);
};

// Interactive Terminal Log Filters & Pro Operations
const isTerminalMaximized = ref(false);
const isStreamPaused = ref(false);
const isAutoScroll = ref(true);
const terminalCleared = ref(false);
const logFilterLevel = ref<'all' | 'traffic' | 'traefik' | 'engine' | 'docker' | 'system'>('all');
const logSearchQuery = ref('');
const isTerminalRestarting = ref(false);
const dynamicRebootLogs = ref<ContainerLogEntry[]>([]);

const containerLogs = computed<ContainerLogEntry[]>(() => {
  if (!activeLogContainer.value || terminalCleared.value) return [];
  const base = generateContainerLogs(activeLogContainer.value);
  return [...base, ...dynamicRebootLogs.value];
});

const logCounts = computed(() => {
  const logs = containerLogs.value;
  return {
    all: logs.length,
    traffic: logs.filter(l => l.service === 'traffic').length,
    traefik: logs.filter(l => l.service === 'traefik' || l.service === 'tls').length,
    engine: logs.filter(l => l.service === 'engine').length,
    docker: logs.filter(l => l.service === 'docker').length,
    system: logs.filter(l => l.service === 'system' || l.service === 'health' || l.service === 'security').length
  };
});

const filteredLogs = computed(() => {
  let list = containerLogs.value;
  if (logFilterLevel.value !== 'all') {
    if (logFilterLevel.value === 'traefik') {
      list = list.filter(l => l.service === 'traefik' || l.service === 'tls');
    } else if (logFilterLevel.value === 'system') {
      list = list.filter(l => l.service === 'system' || l.service === 'health' || l.service === 'security');
    } else {
      list = list.filter(l => l.service === logFilterLevel.value);
    }
  }

  const q = logSearchQuery.value.trim().toLowerCase();
  if (q) {
    list = list.filter(l =>
      l.message.toLowerCase().includes(q) ||
      l.serviceLabel.toLowerCase().includes(q) ||
      l.timestamp.toLowerCase().includes(q) ||
      (l.meta?.ip && l.meta.ip.toLowerCase().includes(q)) ||
      (l.meta?.path && l.meta.path.toLowerCase().includes(q))
    );
  }
  return list;
});

const toggleAutoScroll = () => {
  isAutoScroll.value = !isAutoScroll.value;
};

const toggleStreamPause = () => {
  isStreamPaused.value = !isStreamPaused.value;
};

const clearTerminalScreen = () => {
  terminalCleared.value = true;
};

const restoreTerminalScreen = () => {
  terminalCleared.value = false;
};

const downloadLogFile = () => {
  if (!activeLogContainer.value) return;
  const content = filteredLogs.value
    .map(l => `[${l.timestamp}] [${l.serviceLabel}] ${l.message}`)
    .join('\n');
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `runtime-log-${activeLogContainer.value.subdomain}.log`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const handleTerminalRestart = async () => {
  if (!activeLogContainer.value) return;
  isTerminalRestarting.value = true;
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${String(now.getMilliseconds()).padStart(3, '0')}`;
  
  dynamicRebootLogs.value.push({
    id: `reboot-${Date.now()}-1`,
    lineNum: containerLogs.value.length + 1,
    timestamp: timeStr,
    service: 'system',
    serviceLabel: 'system-reboot',
    level: 'warn',
    message: `Received SIGTERM signal. Initiating graceful container drainage for [pod-${activeLogContainer.value.id.slice(0, 8)}]`
  });

  await restartContainer(activeLogContainer.value);
  
  setTimeout(() => {
    const timeStr2 = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds() + 1).padStart(2, '0')}.112`;
    dynamicRebootLogs.value.push({
      id: `reboot-${Date.now()}-2`,
      lineNum: containerLogs.value.length + 1,
      timestamp: timeStr2,
      service: 'docker',
      serviceLabel: 'docker-daemon',
      level: 'success',
      message: 'Container process spawned successfully. cgroups v2 resource tree intact. Ingress route active.'
    });
    isTerminalRestarting.value = false;
  }, 1200);
};

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
            <span class="nav-badge">{{ articles.length + cmsPages.length }}</span>
          </button>

          <button
            class="nav-link"
            :class="{ active: activeMenu === 'media' }"
            @click="activeMenu = 'media'"
          >
            <HardDrive :size="17" />
            <span class="nav-link-text">Media Assets (S3)</span>
            <span class="nav-badge">{{ mediaStorage.usedStorage }}</span>
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
            <span class="nav-badge badge-primary">{{ latestSystemVersion }}</span>
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
          <span
            :class="(activeMenu === 'content' && activeArticleForReader) || (activeMenu === 'analytics' && selectedContainerForDetail) ? 'crumb-link' : 'crumb-current'"
            @click="(activeMenu === 'content' && activeArticleForReader) ? (activeArticleForReader = null) : (activeMenu === 'analytics' && selectedContainerForDetail) ? (selectedContainerForDetail = null) : null"
            :title="(activeMenu === 'content' && activeArticleForReader) ? 'Kembali ke Daftar Artikel' : (activeMenu === 'analytics' && selectedContainerForDetail) ? 'Kembali ke Ikhtisar Telemetri Fleet' : undefined"
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
          <template v-if="(activeMenu === 'analytics' || activeMenu === 'containers') && selectedContainerForDetail">
            <ChevronRight :size="14" class="crumb-sep" />
            <span class="crumb-current crumb-article-title" :title="selectedContainerForDetail.name" style="color: #2563eb; font-weight: 700;">
              {{ selectedContainerForDetail.subdomain }}
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

          <!-- Open Live URL -->
          <a
            :href="getArticleLiveUrl(activeArticleForReader)"
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
              <label class="field-title">Pilih Blueprint Awal</label>
              <div class="template-selector-grid">
                <button
                  type="button"
                  v-for="tpl in blueprintOptions"
                  :key="tpl.id"
                  class="template-option"
                  :class="{ active: newSiteForm.category === tpl.id }"
                  @click="newSiteForm.category = tpl.id as any"
                >
                  <div class="template-option-icon">
                    <component :is="tpl.icon" :size="15" />
                  </div>
                  <div class="template-option-text">
                    <div class="template-option-name" style="display: flex; align-items: center; gap: 6px;">
                      <span>{{ tpl.name }}</span>
                      <span v-if="tpl.badge" style="font-size: 0.62rem; color: #ea580c; background: #fff7ed; border: 1px solid #fed7aa; padding: 1px 5px; border-radius: 4px; font-weight: 700;">
                        {{ tpl.badge }}
                      </span>
                    </div>
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
              <!-- Real-time Subdomain Availability Feedback -->
              <div class="subdomain-check-feedback" v-if="newSiteForm.subdomain.trim()">
                <span v-if="isSubdomainAvailable(newSiteForm.subdomain)" class="feedback-avail">
                  <CheckCircle2 :size="12" /> Subdomain tersedia & rute edge Traefik siap dialokasikan
                </span>
                <span v-else class="feedback-taken">
                  <AlertCircle :size="12" /> Subdomain sudah digunakan oleh kontainer lain
                </span>
              </div>
              <p class="field-helper-text" v-else>
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
    <!-- MODAL: DOCKER & TRAEFIK RUNTIME LOGS (PRO DEVELOPER TERMINAL)  -->
    <!-- ============================================================= -->
    <Teleport to="body">
      <div v-if="isLogsModalOpen && activeLogContainer" class="modal-backdrop" @click.self="isLogsModalOpen = false">
        <div class="modal-dialog terminal-modal-dialog" :class="{ 'is-maximized': isTerminalMaximized }">
          <!-- Terminal Main Window Frame -->
          <div class="terminal-container-view">
            <!-- 1. Window Chrome Top Header (macOS Traffic Lights & Identity) -->
            <div class="terminal-window-header">
              <div class="terminal-window-left">
                <!-- Mac Traffic Light Buttons -->
                <div class="mac-traffic-lights">
                  <button type="button" class="mac-light-dot red" title="Tutup Terminal (ESC)" @click="isLogsModalOpen = false"></button>
                  <button type="button" class="mac-light-dot yellow" :title="isStreamPaused ? 'Lanjutkan Stream' : 'Jeda Stream'" @click="toggleStreamPause"></button>
                  <button type="button" class="mac-light-dot green" :title="isTerminalMaximized ? 'Perkecil' : 'Layar Penuh'" @click="isTerminalMaximized = !isTerminalMaximized"></button>
                </div>

                <!-- Pod Identity Trail -->
                <div class="terminal-target-title">
                  <Terminal :size="14" style="color: #60a5fa;" />
                  <span style="font-weight: 700; color: #f4f4f5;">Console Log Pod:</span>
                  <span class="terminal-pod-badge">#pod-{{ activeLogContainer.id.slice(0, 8) }}</span>
                  <span style="color: #71717a;">•</span>
                  <span style="display: flex; align-items: center; gap: 4px; color: #34d399; font-size: 0.73rem;">
                    <Lock :size="11" />
                    <span>https://{{ activeLogContainer.subdomain }}</span>
                  </span>
                </div>
              </div>

              <div class="terminal-window-right">
                <!-- Live Beacon Indicator -->
                <span class="terminal-live-beacon" :class="{ paused: isStreamPaused }">
                  <span class="pulse-mini-dot" :style="{ backgroundColor: isStreamPaused ? '#fbbf24' : '#10b981' }"></span>
                  <span>{{ isStreamPaused ? 'STREAM PAUSED' : 'STREAM LIVE' }}</span>
                </span>

                <!-- Fullscreen Toggle Button -->
                <button
                  type="button"
                  class="terminal-tool-btn"
                  :title="isTerminalMaximized ? 'Keluar dari Layar Penuh' : 'Mode Layar Penuh'"
                  @click="isTerminalMaximized = !isTerminalMaximized"
                >
                  <Minimize2 v-if="isTerminalMaximized" :size="13" />
                  <Maximize2 v-else :size="13" />
                </button>

                <!-- Close Button -->
                <button
                  type="button"
                  class="terminal-tool-btn"
                  title="Tutup Konsol"
                  @click="isLogsModalOpen = false"
                >
                  <X :size="13" />
                </button>
              </div>
            </div>

            <!-- 2. Secondary Telemetry Specs Bar -->
            <div class="terminal-meta-bar">
              <div class="terminal-meta-left">
                <div class="terminal-meta-item">
                  <span class="t-meta-lbl">STATUS:</span>
                  <span class="t-meta-val" :class="activeLogContainer.status">{{ activeLogContainer.status.toUpperCase() }}</span>
                </div>
                <div class="terminal-meta-item">
                  <span class="t-meta-lbl">CGROUPS V2:</span>
                  <span class="t-meta-val">{{ activeLogContainer.cpuLimit }} • {{ activeLogContainer.ramUsage }}MB / {{ activeLogContainer.ramLimit }}MB</span>
                </div>
                <div class="terminal-meta-item">
                  <span class="t-meta-lbl">INGRESS ROUTER:</span>
                  <span class="t-meta-val">Traefik v3.1 (TLS 1.3 ALPN)</span>
                </div>
                <div class="terminal-meta-item">
                  <span class="t-meta-lbl">UPTIME:</span>
                  <span class="t-meta-val">{{ activeLogContainer.uptime }}</span>
                </div>
              </div>

              <div style="font-size: 0.7rem; color: #71717a;">
                TCP Socket: <strong>Active</strong> • Linux Namespace Isolated
              </div>
            </div>

            <!-- 3. Terminal Controls & Level Filter Toolbar -->
            <div class="terminal-controls-row">
              <!-- Service Category Tabs -->
              <div class="terminal-level-tabs">
                <button
                  type="button"
                  class="terminal-level-pill"
                  :class="{ active: logFilterLevel === 'all' }"
                  @click="logFilterLevel = 'all'"
                >
                  Semua ({{ logCounts.all }})
                </button>
                <button
                  type="button"
                  class="terminal-level-pill"
                  :class="{ active: logFilterLevel === 'traffic' }"
                  @click="logFilterLevel = 'traffic'"
                >
                  Inbound ({{ logCounts.traffic }})
                </button>
                <button
                  type="button"
                  class="terminal-level-pill"
                  :class="{ active: logFilterLevel === 'traefik' }"
                  @click="logFilterLevel = 'traefik'"
                >
                  Traefik & SSL ({{ logCounts.traefik }})
                </button>
                <button
                  type="button"
                  class="terminal-level-pill"
                  :class="{ active: logFilterLevel === 'engine' }"
                  @click="logFilterLevel = 'engine'"
                >
                  Engine ({{ logCounts.engine }})
                </button>
                <button
                  type="button"
                  class="terminal-level-pill"
                  :class="{ active: logFilterLevel === 'docker' }"
                  @click="logFilterLevel = 'docker'"
                >
                  Docker ({{ logCounts.docker }})
                </button>
                <button
                  type="button"
                  class="terminal-level-pill"
                  :class="{ active: logFilterLevel === 'system' }"
                  @click="logFilterLevel = 'system'"
                >
                  System ({{ logCounts.system }})
                </button>
              </div>

              <!-- Search and Utility Action Buttons -->
              <div class="terminal-actions-right">
                <!-- Real-time Text Filter -->
                <div class="terminal-search-shell">
                  <Search :size="12" class="search-icon" />
                  <input
                    v-model="logSearchQuery"
                    type="text"
                    placeholder="Filter teks log (IP, status, path)..."
                    class="terminal-search-input"
                  />
                  <button
                    v-if="logSearchQuery"
                    type="button"
                    style="position: absolute; right: 6px; background: none; border: none; color: #94a3b8; cursor: pointer; padding: 0;"
                    title="Hapus pencarian"
                    @click="logSearchQuery = ''"
                  >
                    <X :size="11" />
                  </button>
                </div>

                <!-- Pause / Play Stream Toggle -->
                <button
                  type="button"
                  class="terminal-tool-btn"
                  :class="{ active: !isStreamPaused }"
                  :title="isStreamPaused ? 'Lanjutkan stream live' : 'Jeda auto-stream'"
                  @click="toggleStreamPause"
                >
                  <Pause v-if="!isStreamPaused" :size="12" />
                  <Play v-else :size="12" />
                  <span>{{ isStreamPaused ? 'Resume' : 'Pause' }}</span>
                </button>

                <!-- Auto-Scroll Toggle -->
                <button
                  type="button"
                  class="terminal-tool-btn"
                  :class="{ active: isAutoScroll }"
                  :title="isAutoScroll ? 'Auto-scroll aktif: otomatis menggulir ke log terbaru' : 'Auto-scroll nonaktif'"
                  @click="toggleAutoScroll"
                >
                  <span>Auto-Scroll: {{ isAutoScroll ? 'ON' : 'OFF' }}</span>
                </button>

                <!-- Download Log File -->
                <button
                  type="button"
                  class="terminal-tool-btn"
                  title="Unduh log runtime sebagai file .log"
                  @click="downloadLogFile"
                >
                  <Download :size="12" />
                  <span>Unduh .log</span>
                </button>

                <!-- Clear / Restore Screen -->
                <button
                  type="button"
                  class="terminal-tool-btn"
                  :title="terminalCleared ? 'Muat ulang log' : 'Bersihkan tampilan layar'"
                  @click="terminalCleared ? restoreTerminalScreen() : clearTerminalScreen()"
                >
                  <RotateCw v-if="terminalCleared" :size="12" />
                  <Trash2 v-else :size="12" />
                  <span>{{ terminalCleared ? 'Restore' : 'Clear' }}</span>
                </button>
              </div>
            </div>

            <!-- 4. Console Screen & Lines -->
            <div class="terminal-output-screen">
              <div
                v-for="entry in filteredLogs"
                :key="entry.id"
                class="terminal-log-row"
              >
                <!-- Line Number -->
                <span class="log-ln">{{ String(entry.lineNum).padStart(2, '0') }}</span>

                <!-- Timestamp -->
                <span class="log-ts">[{{ entry.timestamp }}]</span>

                <!-- Service Badge -->
                <span class="log-service-badge" :class="entry.service">
                  [{{ entry.serviceLabel }}]
                </span>

                <!-- Log Message Body with Syntax Highlights -->
                <div class="log-text-body">
                  <span>{{ entry.message }}</span>
                  <!-- Metadata Pill Highlights if present -->
                  <span v-if="entry.meta?.cache" class="cache-pill" :class="entry.meta.cache.toLowerCase()" style="margin-left: 6px; font-size: 0.64rem;">
                    {{ entry.meta.cache }}
                  </span>
                </div>
              </div>

              <!-- Empty State if Filter doesn't match -->
              <div v-if="filteredLogs.length === 0" style="padding: 40px 20px; text-align: center; color: #71717a;">
                <Search :size="20" style="margin-bottom: 6px; color: #52525b;" />
                <div style="font-weight: 600; color: #a1a1aa; font-size: 0.8rem;">
                  {{ terminalCleared ? 'Layar konsol telah dibersihkan' : 'Tidak ada baris log yang cocok' }}
                </div>
                <div style="font-size: 0.72rem; margin-top: 3px;">
                  {{ terminalCleared ? 'Klik tombol "Restore" di toolbar untuk menampilkan kembali riwayat log.' : `Kriteria pencarian "${logSearchQuery}" tidak ditemukan pada kategori ini.` }}
                </div>
              </div>

              <!-- Live Blinking Terminal Cursor -->
              <div v-if="!isStreamPaused && filteredLogs.length > 0" style="padding: 4px 0 4px 40px; color: #52525b; font-size: 0.72rem;">
                <span style="color: #34d399;">●</span> Menunggu event berikutnya di socket Traefik/cgroups...
                <span class="log-cursor-beacon"></span>
              </div>
            </div>
          </div>

          <!-- 5. Modal Footer Actions -->
          <div class="modal-footer-row" style="margin-top: 12px;">
            <div style="display: flex; align-items: center; gap: 8px; font-size: 0.73rem; color: #64748b;">
              <span>Memori: <strong>{{ activeLogContainer.ramUsage }} MB</strong></span>
              <span>•</span>
              <span>Menampilkan <strong>{{ filteredLogs.length }}</strong> baris log aktif</span>
            </div>

            <div style="display: flex; align-items: center; gap: 8px;">
              <button
                type="button"
                class="btn-modal-ghost"
                :disabled="isTerminalRestarting"
                title="Restart Kontainer Langsung"
                @click="handleTerminalRestart"
              >
                <RotateCw :size="13" :class="{ 'spin-anim': isTerminalRestarting }" />
                <span>{{ isTerminalRestarting ? 'Me-reboot kontainer...' : 'Restart Kontainer' }}</span>
              </button>
              <button type="button" class="btn-modal-ghost" title="Salin seluruh log ke clipboard" @click="copyContainerLogs">
                <Copy :size="13" />
                <span>Salin Log</span>
              </button>
              <button type="button" class="btn-modal-confirm" @click="isLogsModalOpen = false">
                Tutup Konsol
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- 3. Bespoke Danger Zone Modal: Delete Container Confirmation -->
    <Teleport to="body">
      <div
        v-if="isDeleteContainerModalOpen && containerToDelete"
        class="modal-backdrop"
        @click.self="cancelDeleteContainer"
      >
        <div
          class="modal-dialog modal-dialog-delete"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
        >
          <!-- Modal Header -->
          <div class="modal-header">
            <div class="modal-header-leading">
              <div class="modal-header-icon-box danger-icon-box">
                <AlertTriangle :size="18" />
              </div>
              <div>
                <h3 id="delete-dialog-title" class="modal-heading">Hapus Kontainer Runtime</h3>
                <p class="modal-subheading">Tindakan ini permanen dan akan melepas rute ingress Traefik.</p>
              </div>
            </div>
            <button
              type="button"
              class="modal-close-button"
              :disabled="isDeletingContainer"
              @click="cancelDeleteContainer"
              title="Tutup dialog"
            >
              <X :size="16" />
            </button>
          </div>

          <!-- Modal Body -->
          <div class="delete-modal-body">
            <!-- Target Pod Card -->
            <div class="delete-target-card">
              <div class="target-card-leading">
                <div class="target-app-icon">
                  <Server :size="17" />
                </div>
                <div class="target-app-info">
                  <div class="target-app-name">{{ containerToDelete.name }}</div>
                  <div class="target-app-subdomain">
                    <Globe :size="11" />
                    <span>https://{{ containerToDelete.subdomain }}</span>
                  </div>
                </div>
              </div>
              <div class="target-card-meta">
                <span class="badge-target-spec">{{ containerToDelete.cpuLimit }} • {{ containerToDelete.ramLimit }} MB</span>
                <span
                  class="badge-target-status"
                  :class="containerToDelete.status === 'running' ? 'status-emerald' : 'status-amber'"
                >
                  {{ containerToDelete.status === 'running' ? '● Running' : '○ Standby' }}
                </span>
              </div>
            </div>

            <!-- Danger Impact Callout -->
            <div class="delete-impact-callout">
              <div class="impact-callout-header">
                <AlertCircle :size="13" />
                <span>Konsekuensi penghapusan kontainer:</span>
              </div>
              <ul class="impact-list">
                <li>
                  <strong>Proses Pod Dihentikan:</strong> Runtime Docker & cgroups v2 akan dimatikan seketika.
                </li>
                <li>
                  <strong>Rute Traefik & SSL Dicabut:</strong> Permintaan masuk ke <code>{{ containerToDelete.subdomain }}</code> akan langsung mengembalikan status HTTP 404.
                </li>
                <li>
                  <strong>Pengembalian Kuota:</strong> 1 slot kuota ({{ containers.length }}/{{ userPlan.maxContainers }}) akan otomatis dikembalikan ke kuota langganan Anda.
                </li>
              </ul>
            </div>
          </div>

          <!-- Modal Footer Actions -->
          <div class="modal-footer-row delete-footer-row">
            <button
              type="button"
              class="btn-modal-ghost"
              :disabled="isDeletingContainer"
              @click="cancelDeleteContainer"
            >
              Batal
            </button>
            <button
              type="button"
              class="btn-modal-confirm-destructive"
              :disabled="isDeletingContainer"
              @click="confirmDeleteContainer"
            >
              <RotateCw v-if="isDeletingContainer" :size="13" class="spin-anim" />
              <Trash2 v-else :size="13" />
              <span>{{ isDeletingContainer ? 'Menghapus Kontainer...' : 'Ya, Hapus Kontainer' }}</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>
    </div>
  </div>
</template>
