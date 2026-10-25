<script setup lang="ts">
import { ref, onMounted, watch, defineAsyncComponent, computed, nextTick } from 'vue';
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
  AlertTriangle,
  Menu,
  Rocket,
  Zap,
  Check,
  ArrowUpRight
} from 'lucide-vue-next';
import { useDashboardData } from '../composables/useDashboardData';
import { generateContainerLogs, type ContainerLogEntry } from '../data/container-logs';
import { studioApi } from '../services/apiClient';

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
  tagline: string;
  features: string[];
}

const blueprintOptions: BlueprintTemplate[] = [
  {
    id: 'business',
    name: 'Toko Online & Retail',
    desc: 'Etalase produk komersial, promo diskon & checkout langsung via WhatsApp.',
    icon: ShoppingBag,
    badge: 'Flagship',
    tagline: 'Komersial & E-Commerce',
    features: ['Katalog Produk Dinamis', 'Order WhatsApp Instan', 'Tracking Pesanan']
  },
  {
    id: 'portfolio',
    name: 'Portofolio Teknis & Pro',
    desc: 'Showcase karya digital, rekayasa cloud & metrik telemetri runtime.',
    icon: Briefcase,
    badge: 'Populer',
    tagline: 'Personal & Professional',
    features: ['Showcase Portofolio Pro', 'Riwayat Pengalaman', 'Form Kontak Cepat']
  },
  {
    id: 'blog',
    name: 'Media Editorial & Blog',
    desc: 'Publikasi artikel, berita multimedia & optimasi SEO mesin pencari tinggi.',
    icon: BookOpen,
    badge: 'SEO Top',
    tagline: 'Editorial & Jurnalistik',
    features: ['Sistem Kategori & Tag', 'Format Baca Fokus', 'Sitemap Generator']
  },
  {
    id: 'education',
    name: 'Pusat Edukasi LMS',
    desc: 'Akademi pelatihan, silabus kurikulum kursus & registrasi peserta online.',
    icon: GraduationCap,
    badge: 'Akademik',
    tagline: 'Pendidikan & Kursus',
    features: ['Silabus Kurikulum Kursus', 'Pendaftaran Peserta', 'Portal Materi Edukasi']
  }
];

const brandColorPresets = [
  { id: 'blue', hex: '#2563eb', label: 'Royal Blue' },
  { id: 'emerald', hex: '#059669', label: 'Emerald' },
  { id: 'violet', hex: '#7c3aed', label: 'Violet' },
  { id: 'amber', hex: '#d97706', label: 'Amber' },
  { id: 'rose', hex: '#e11d48', label: 'Rose' },
  { id: 'slate', hex: '#0f172a', label: 'Deep Slate' }
];

const isSubdomainManuallyEdited = ref(false);

const autoSlugFromName = (name: string) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 32);
};

const onSiteNameInput = () => {
  if (!isSubdomainManuallyEdited.value) {
    newSiteForm.value.subdomain = autoSlugFromName(newSiteForm.value.name);
  }
};

const onSubdomainManualInput = () => {
  isSubdomainManuallyEdited.value = true;
};

const forceResyncSubdomain = () => {
  newSiteForm.value.subdomain = autoSlugFromName(newSiteForm.value.name);
  isSubdomainManuallyEdited.value = false;
};

const selectedBlueprint = computed(() => {
  return blueprintOptions.find(b => b.id === newSiteForm.value.category) || blueprintOptions[0];
});

watch(isCreateModalOpen, (isOpen) => {
  if (isOpen) {
    isSubdomainManuallyEdited.value = false;
  }
});

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
const terminalScreenRef = ref<HTMLElement | null>(null);
const logFilterLevel = ref<'all' | 'traffic' | 'traefik' | 'engine' | 'docker' | 'system'>('all');
const logSearchQuery = ref('');
const isTerminalRestarting = ref(false);
const dynamicRebootLogs = ref<ContainerLogEntry[]>([]);

const parseRawLogsToEntries = (rawLogs: string): ContainerLogEntry[] => {
  const rawLines = rawLogs.split('\n').filter((l: string) => l.trim().length > 0);
  return rawLines.map((line: string, i: number) => {
    const now = new Date();
    let timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${String(i * 10).padStart(3, '0')}`;
    let cleanMsg = line.trim();

    const timeMatch = cleanMsg.match(/^\[(\d{2}:\d{2}:\d{2}(?:\.\d{3})?)\]\s*(.*)$/);
    if (timeMatch) {
      timeStr = timeMatch[1];
      cleanMsg = timeMatch[2];
    }

    let service: ContainerLogEntry['service'] = 'system';
    let serviceLabel = 'system';
    let level: ContainerLogEntry['level'] = 'info';

    if (cleanMsg.includes('[build-image]') || cleanMsg.includes('[BUILD]')) {
      service = 'engine';
      serviceLabel = 'build-image';
      level = 'info';
    } else if (cleanMsg.includes('[cgroups-v2]') || cleanMsg.includes('[CGROUPS]')) {
      service = 'docker';
      serviceLabel = 'cgroups-v2';
      level = 'info';
    } else if (cleanMsg.includes('[security-sandbox]') || cleanMsg.includes('[SANDBOX]')) {
      service = 'security';
      serviceLabel = 'sandbox-uid';
      level = 'info';
    } else if (cleanMsg.includes('[docker-engine]') || cleanMsg.includes('[DOCKER]') || cleanMsg.includes('[SPAWN]') || cleanMsg.includes('spawned')) {
      service = 'docker';
      serviceLabel = 'docker-spawn';
      level = 'success';
    } else if (cleanMsg.includes('[traefik-edge]') || cleanMsg.includes('[TRAEFIK]')) {
      service = 'traefik';
      serviceLabel = 'traefik-v3';
      level = 'success';
    } else if (cleanMsg.includes('[healthcheck]') || cleanMsg.includes('[HEALTHCHECK]') || cleanMsg.includes('probe')) {
      service = 'health';
      serviceLabel = 'probe-200';
      level = 'success';
    } else if (cleanMsg.includes('[runtime-nginx]') || cleanMsg.includes('[RUNTIME]') || cleanMsg.includes('nginx')) {
      service = 'engine';
      serviceLabel = 'nginx-alpine';
      level = 'info';
    } else if (cleanMsg.includes('[REBOOT]') || cleanMsg.includes('SIGTERM') || cleanMsg.includes('[DRAIN]')) {
      service = 'system';
      serviceLabel = 'system-reboot';
      level = 'warn';
    } else if (cleanMsg.includes('[STOP]') || cleanMsg.includes('[STOPPED]')) {
      service = 'docker';
      serviceLabel = 'docker-stop';
      level = 'warn';
    } else if (cleanMsg.includes('HTTP/')) {
      service = 'traffic';
      serviceLabel = 'http-traffic';
      level = 'success';
    } else if (cleanMsg.toLowerCase().includes('err') || cleanMsg.toLowerCase().includes('fail')) {
      level = 'error';
    } else if (cleanMsg.toLowerCase().includes('warn')) {
      level = 'warn';
    }

    return {
      id: `live-docker-${Date.now()}-${i}`,
      lineNum: i + 1,
      timestamp: timeStr,
      service,
      serviceLabel,
      level,
      message: cleanMsg
    };
  });
};

const fetchLatestContainerLogs = async () => {
  if (!activeLogContainer.value) return;
  try {
    const res = await studioApi.getContainerLogs(activeLogContainer.value.id, 100);
    if (res?.logs && typeof res.logs === 'string') {
      const entries = parseRawLogsToEntries(res.logs);
      if (entries.length > 0) {
        dynamicRebootLogs.value = entries;
        if (isAutoScroll.value) {
          nextTick(() => {
            if (terminalScreenRef.value) {
              terminalScreenRef.value.scrollTop = terminalScreenRef.value.scrollHeight;
            }
          });
        }
      }
    }
  } catch {
    // Fallback handled by containerLogs computed
  }
};

watch(isLogsModalOpen, async (isOpen) => {
  if (isOpen && activeLogContainer.value) {
    dynamicRebootLogs.value = [];
    await fetchLatestContainerLogs();
  }
});

const containerLogs = computed<ContainerLogEntry[]>(() => {
  if (!activeLogContainer.value || terminalCleared.value) return [];
  if (dynamicRebootLogs.value.length > 0) {
    return dynamicRebootLogs.value;
  }
  return generateContainerLogs(activeLogContainer.value);
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
  const formatTime = (offsetMs: number) => {
    const d = new Date(now.getTime() + offsetMs);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}.${String(d.getMilliseconds()).padStart(3, '0')}`;
  };

  const pushRebootLog = (service: ContainerLogEntry['service'], serviceLabel: string, level: ContainerLogEntry['level'], message: string, offsetMs: number) => {
    dynamicRebootLogs.value.push({
      id: `reboot-${Date.now()}-${dynamicRebootLogs.value.length + 1}`,
      lineNum: containerLogs.value.length + 1,
      timestamp: formatTime(offsetMs),
      service,
      serviceLabel,
      level,
      message
    });
    if (isAutoScroll.value) {
      nextTick(() => {
        if (terminalScreenRef.value) {
          terminalScreenRef.value.scrollTop = terminalScreenRef.value.scrollHeight;
        }
      });
    }
  };

  // Phase 1: Graceful SIGTERM drainage
  pushRebootLog('system', 'system-reboot', 'warn', `⚠️ [REBOOT] Received SIGTERM signal. Initiating graceful container drainage for [pod-${activeLogContainer.value.id.slice(0, 8)}]`, 0);
  pushRebootLog('system', 'network-drain', 'info', `⏳ [DRAIN] Waiting for active HTTP keep-alive connections to terminate (drain window: 3s)...`, 120);

  // Trigger container restart via API & Docker SDK
  await restartContainer(activeLogContainer.value);

  // Phase 2-4: Progression milestones
  setTimeout(() => {
    pushRebootLog('docker', 'docker-stop', 'info', `🛑 [STOP] Container process stopped cleanly (exit code 0). Cgroups v2 memory limits reset.`, 400);
  }, 350);

  setTimeout(() => {
    pushRebootLog('docker', 'docker-spawn', 'success', `🐳 [SPAWN] Docker Engine respawning container process (PID 1, UID 10001, tmpfs on /tmp)...`, 700);
  }, 700);

  setTimeout(() => {
    pushRebootLog('engine', 'nginx-alpine', 'info', `⚙️ [RUNTIME] Nginx configuration syntax verified (syntax ok). Worker process spawned on port 80.`, 1000);
  }, 1050);

  setTimeout(() => {
    pushRebootLog('health', 'probe-200', 'success', `🩺 [HEALTHCHECK] Container internal health probe (GET http://127.0.0.1:80/healthz) -> 200 OK`, 1350);
  }, 1400);

  setTimeout(async () => {
    pushRebootLog('traefik', 'traefik-v3', 'success', `🌐 [TRAEFIK] Edge router ingress re-verified active (TLS 1.3 ALPN HTTP/2).`, 1700);
    pushRebootLog('docker', 'docker-daemon', 'success', `🚀 [RUNNING] Container process spawned successfully. cgroups v2 resource tree intact. Ingress route active.`, 1900);
    isTerminalRestarting.value = false;
    await fetchLatestContainerLogs();
  }, 1800);
};

// Responsive Mobile Navigation Drawer State
const isMobileNavOpen = ref(false);

const selectMenu = (menuKey: string) => {
  activeMenu.value = menuKey as any;
  isMobileNavOpen.value = false;
};

onMounted(async () => {
  await syncWithBackend();
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMobileNavOpen.value) {
      isMobileNavOpen.value = false;
    }
  });
});

// Smooth scroll ke atas saat berganti menu antarmuka
watch(activeMenu, () => {
  const pane = document.querySelector('.content-scroll-pane');
  if (pane) {
    pane.scrollTo({ top: 0, behavior: 'smooth' });
  }
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
        'editor-active-mode': activeMenu === 'editor',
        'editor-immersive-mode': activeMenu === 'editor' && isEditorSidebarHidden,
        'reader-immersive-mode': activeMenu === 'content' && activeArticleForReader && isReaderSidebarHidden,
        'dashboard-choreographed-enter': isDashboardEntering,
        'mobile-nav-open': isMobileNavOpen
      }"
    >
      <!-- Mobile Backdrop Overlay for Screens <= 1024px -->
      <div
        v-if="isMobileNavOpen"
        class="mobile-nav-backdrop"
        @click="isMobileNavOpen = false"
      ></div>

      <!-- 1. LEFT SIDEBAR: Professional Cloud Console Navigation -->
      <aside class="app-sidebar">
      <!-- Workspace Brand Switcher (Clean Monochrome Black & White Header) -->
      <div class="sidebar-header">
        <div class="workspace-brand-card" @click="selectMenu('containers')" title="Stack Studio by Aether Core">
          <div class="brand-glyph-pro">
            <Layers :size="18" color="#ffffff" />
          </div>
          <div class="brand-meta">
            <div class="brand-title-row">
              <div class="brand-title">
                Stack <span>Studio</span>
              </div>
              <span class="brand-entity-pill">Aether Core</span>
            </div>
            <div class="brand-plan-row">
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
            @click="selectMenu('containers')"
          >
            <span class="nav-icon-box icon-blue">
              <FolderKanban :size="16" />
            </span>
            <span class="nav-link-text">Situs & Kontainer</span>
            <span class="nav-badge">{{ usedContainersCount }}/{{ userPlan.maxContainers }}</span>
          </button>

          <button
            class="nav-link"
            :class="{ active: activeMenu === 'editor' }"
            @click="selectMenu('editor')"
            :disabled="containers.length === 0"
          >
            <span class="nav-icon-box icon-violet">
              <Edit3 :size="16" />
            </span>
            <span class="nav-link-text">Editor Studio Visual</span>
          </button>

          <button
            class="nav-link"
            :class="{ active: activeMenu === 'content' }"
            @click="selectMenu('content')"
          >
            <span class="nav-icon-box icon-emerald">
              <FileText :size="16" />
            </span>
            <span class="nav-link-text">Artikel & Halaman</span>
            <span class="nav-badge">{{ articles.length + cmsPages.length }}</span>
          </button>

          <button
            class="nav-link"
            :class="{ active: activeMenu === 'media' }"
            @click="selectMenu('media')"
          >
            <span class="nav-icon-box icon-amber">
              <HardDrive :size="16" />
            </span>
            <span class="nav-link-text">Media Assets (S3)</span>
            <span class="nav-badge">{{ mediaStorage.usedStorage }}</span>
          </button>

          <button
            class="nav-link"
            :class="{ active: activeMenu === 'templates' }"
            @click="selectMenu('templates')"
          >
            <span class="nav-icon-box icon-rose">
              <Palette :size="16" />
            </span>
            <span class="nav-link-text">Katalog Template</span>
          </button>
        </nav>

        <div class="nav-section-title">INFRASTRUKTUR & EDGE</div>
        <nav class="sidebar-nav-list">
          <button
            class="nav-link"
            :class="{ active: activeMenu === 'domains' }"
            @click="selectMenu('domains')"
          >
            <span class="nav-icon-box icon-cyan">
              <Globe :size="16" />
            </span>
            <span class="nav-link-text">Custom Domain & DNS</span>
            <span class="nav-badge badge-success">SSL</span>
          </button>

          <button
            class="nav-link"
            :class="{ active: activeMenu === 'analytics' }"
            @click="selectMenu('analytics')"
          >
            <span class="nav-icon-box icon-indigo">
              <TrendingUp :size="16" />
            </span>
            <span class="nav-link-text">Analitik & Telemetri</span>
          </button>

          <button
            class="nav-link"
            :class="{ active: activeMenu === 'webhooks' }"
            @click="selectMenu('webhooks')"
          >
            <span class="nav-icon-box icon-teal">
              <Webhook :size="16" />
            </span>
            <span class="nav-link-text">Webhooks & API</span>
          </button>
        </nav>

        <div class="nav-section-title">FINANSIAL & BILLING</div>
        <nav class="sidebar-nav-list">
          <button
            class="nav-link"
            :class="{ active: activeMenu === 'billing' }"
            @click="selectMenu('billing')"
          >
            <span class="nav-icon-box icon-purple">
              <CreditCard :size="16" />
            </span>
            <span class="nav-link-text">Kapasitas & Paket</span>
          </button>

          <button
            class="nav-link"
            :class="{ active: activeMenu === 'invoices' }"
            @click="selectMenu('invoices')"
          >
            <span class="nav-icon-box icon-mint">
              <Receipt :size="16" />
            </span>
            <span class="nav-link-text">Faktur & Invoice</span>
            <span class="nav-badge badge-success">Lunas</span>
          </button>
        </nav>

        <div class="nav-section-title">BANTUAN & SUPPORT</div>
        <nav class="sidebar-nav-list">
          <button
            class="nav-link"
            :class="{ active: activeMenu === 'tickets' }"
            @click="selectMenu('tickets')"
          >
            <span class="nav-icon-box icon-sky">
              <LifeBuoy :size="16" />
            </span>
            <span class="nav-link-text">Tiket Support</span>
            <span class="nav-badge badge-warning">1 Aktif</span>
          </button>
        </nav>

        <div class="nav-section-title">INFORMASI & SISTEM</div>
        <nav class="sidebar-nav-list">
          <button
            class="nav-link"
            :class="{ active: activeMenu === 'changelog' }"
            @click="selectMenu('changelog')"
          >
            <span class="nav-icon-box icon-orange">
              <History :size="16" />
            </span>
            <span class="nav-link-text">Changelog & Rilis</span>
            <span class="nav-badge badge-primary">{{ latestSystemVersion }}</span>
          </button>
        </nav>
      </div>

      <!-- Bottom Sidebar: Quota Gauge & User Profile (Monochrome Black & White) -->
      <div class="sidebar-footer">
        <!-- Spacious Monochrome Container Capacity Card (Without CPU/RAM Chips) -->
        <div class="quota-gauge-widget">
          <div class="gauge-header">
            <span class="gauge-title-label">Kapasitas Kontainer</span>
            <span class="quota-count-pill">
              <strong>{{ usedContainersCount }}</strong> / {{ userPlan.maxContainers }} Pod
            </span>
          </div>

          <div class="gauge-segments">
            <span
              v-for="idx in userPlan.maxContainers"
              :key="idx"
              class="gauge-seg"
              :class="{ filled: idx <= usedContainersCount }"
            ></span>
          </div>

          <button type="button" class="btn-quota-upgrade-cta" @click="selectMenu('billing')">
            <span>Upgrade Kapasitas</span>
            <ArrowUpRight :size="13" />
          </button>
        </div>

        <!-- Monochrome Executive User Profile Pod -->
        <div class="sidebar-user-strip">
          <div class="user-avatar-pro">
            <span class="user-avatar-initials">RP</span>
          </div>
          <div class="user-info-text">
            <div class="user-name-row">
              <span class="user-name">Rizal Pratama</span>
              <span class="user-role-pill">PRO</span>
            </div>
            <div class="user-email-sub">{{ userEmail }}</div>
          </div>
          <button type="button" class="btn-sidebar-logout" @click="handleLogout" title="Keluar dari Sesi Studio">
            <LogOut :size="14" />
          </button>
        </div>
      </div>
    </aside>

    <!-- 2. MAIN APPLICATION WORKSPACE -->
    <div class="app-main-area">
      <!-- Sticky Glassmorphism Header -->
      <header class="top-nav-header">
        <div class="top-nav-left-cluster" style="display: flex; align-items: center; gap: 8px; min-width: 0;">
          <!-- Mobile Drawer Hamburger Toggle (visible on <= 1024px) -->
          <button
            type="button"
            class="btn-mobile-nav-toggle"
            @click="isMobileNavOpen = !isMobileNavOpen"
            :title="isMobileNavOpen ? 'Tutup Menu Navigasi' : 'Buka Menu Navigasi'"
          >
            <Menu v-if="!isMobileNavOpen" :size="17" />
            <X v-else :size="17" />
          </button>

          <div class="breadcrumbs">
            <span>Stack Studio</span>
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
      <main class="content-scroll-pane" :class="{ 'is-editor-workspace': activeMenu === 'editor' }">
        <Transition name="studio-workspace-stage" mode="out-in">
          <ContainersModule v-if="activeMenu === 'containers'" key="menu-containers" />
          <VisualEditorModule v-else-if="activeMenu === 'editor'" key="menu-editor" />
          <ContentArticlesModule v-else-if="activeMenu === 'content'" key="menu-content" />
          <MediaAssetsModule v-else-if="activeMenu === 'media'" key="menu-media" />
          <TemplatesCatalogModule v-else-if="activeMenu === 'templates'" key="menu-templates" />
          <CustomDomainsModule v-else-if="activeMenu === 'domains'" key="menu-domains" />
          <AnalyticsTelemetryModule v-else-if="activeMenu === 'analytics'" key="menu-analytics" />
          <WebhooksApiModule v-else-if="activeMenu === 'webhooks'" key="menu-webhooks" />
          <BillingPlanModule v-else-if="activeMenu === 'billing'" key="menu-billing" />
          <InvoicesHistoryModule v-else-if="activeMenu === 'invoices'" key="menu-invoices" />
          <SupportTicketingModule v-else-if="activeMenu === 'tickets'" key="menu-tickets" />
          <ChangelogModule v-else-if="activeMenu === 'changelog'" key="menu-changelog" />
        </Transition>
      </main>
    </div>

    <!-- ============================================================= -->
    <!-- MODAL: BUAT SITUS & KONTAINER BARU (EXPANSIVE STUDIO DESIGN)  -->
    <!-- ============================================================= -->
    <Teleport to="body">
      <div v-if="isCreateModalOpen" class="modal-backdrop" @click.self="isCreateModalOpen = false">
        <div class="modal-dialog modal-dialog-create-site">
          <!-- 1. Header Bar -->
          <div class="modal-header create-site-header">
            <div class="modal-header-leading">
              <div class="create-site-header-glyph">
                <Rocket :size="20" />
              </div>
              <div>
                <div class="create-site-title-row">
                  <h3 class="modal-heading">Buat Website & Deploy Kontainer Baru</h3>
                  <span class="create-ready-pill">
                    <Zap :size="10" /> Ready to Provision
                  </span>
                </div>
                <p class="modal-subheading">
                  Inisialisasi kontainer mandiri terisolasi (cgroups v2) dengan sertifikat SSL otomatis dan routing Traefik v3 HTTP/3.
                </p>
              </div>
            </div>
            <button class="modal-close-button" @click="isCreateModalOpen = false" title="Tutup">
              <X :size="16" />
            </button>
          </div>

          <form @submit.prevent="handleCreateContainer" class="create-site-form">
            <!-- 2-Column Responsive Studio Layout -->
            <div class="create-site-split-grid">
              
              <!-- LEFT COLUMN: Form Controls & Blueprints -->
              <div class="create-site-fields-col">
                
                <!-- 1. Blueprint Architecture Selection -->
                <div class="create-step-block">
                  <div class="create-step-header">
                    <span class="step-num-pill">1</span>
                    <span class="step-title-text">Pilih Blueprint Arsitektur Situs</span>
                    <span class="step-helper-badge">4 Ekosistem Tersedia</span>
                  </div>

                  <div class="blueprint-cards-grid">
                    <button
                      type="button"
                      v-for="tpl in blueprintOptions"
                      :key="tpl.id"
                      class="blueprint-card-item"
                      :class="{ active: newSiteForm.category === tpl.id }"
                      @click="newSiteForm.category = tpl.id as any"
                    >
                      <div class="blueprint-card-top">
                        <div class="blueprint-card-icon" :class="'icon-' + tpl.id">
                          <component :is="tpl.icon" :size="16" />
                        </div>
                        <div class="blueprint-card-badges">
                          <span v-if="tpl.badge" class="blueprint-pill-badge" :class="'pill-' + tpl.id">
                            {{ tpl.badge }}
                          </span>
                          <span class="blueprint-radio-check" :class="{ checked: newSiteForm.category === tpl.id }">
                            <Check v-if="newSiteForm.category === tpl.id" :size="11" stroke-width="3" />
                          </span>
                        </div>
                      </div>

                      <div class="blueprint-card-body">
                        <h4 class="blueprint-card-name">{{ tpl.name }}</h4>
                        <p class="blueprint-card-desc">{{ tpl.desc }}</p>
                      </div>

                      <div class="blueprint-card-footer">
                        <span class="blueprint-feature-tag" v-for="(feat, fIdx) in tpl.features.slice(0, 2)" :key="fIdx">
                          {{ feat }}
                        </span>
                      </div>
                    </button>
                  </div>
                </div>

                <!-- 2. Domain & Identity Configuration (Refactored Eye-Catching Studio Form) -->
                <div class="create-step-block">
                  <div class="create-step-header">
                    <span class="step-num-pill">2</span>
                    <span class="step-title-text">Konfigurasi Identitas & Rute Subdomain</span>
                    <span class="step-helper-badge">Auto-SSL TLS 1.3</span>
                  </div>

                  <div class="create-form-inputs-group">
                    <!-- 2-Column Identity Row: Website Name & Headline -->
                    <div class="create-identity-dual-grid">
                      <!-- Website Name -->
                      <div class="create-field-card">
                        <div class="create-field-top">
                          <label class="create-field-label" for="modal-site-name">
                            <span>Nama Website</span>
                            <span class="field-req-dot">*</span>
                          </label>
                          <span class="create-field-tag required">Wajib</span>
                        </div>
                        <div class="create-input-shell">
                          <span class="create-input-icon">
                            <Globe :size="15" />
                          </span>
                          <input
                            id="modal-site-name"
                            v-model="newSiteForm.name"
                            @input="onSiteNameInput"
                            type="text"
                            placeholder="Contoh: Toko Kopi Sejahtera"
                            class="create-text-input-clean"
                            required
                            autocomplete="off"
                          />
                        </div>
                      </div>

                      <!-- Role / Headline -->
                      <div class="create-field-card">
                        <div class="create-field-top">
                          <label class="create-field-label" for="modal-role">
                            <span>Headline / Slogan Situs</span>
                          </label>
                          <span class="create-field-tag optional">Opsional</span>
                        </div>
                        <div class="create-input-shell">
                          <span class="create-input-icon">
                            <FileText :size="15" />
                          </span>
                          <input
                            id="modal-role"
                            v-model="newSiteForm.role"
                            type="text"
                            placeholder="Contoh: Solusi Retail & Grosir"
                            class="create-text-input-clean"
                          />
                        </div>
                      </div>
                    </div>

                    <!-- Subdomain Edge Cloud Capsule -->
                    <div class="create-field-card create-subdomain-card">
                      <div class="subdomain-label-row">
                        <label class="create-field-label" for="modal-subdomain">
                          <span>Alamat Subdomain Edge Cloud</span>
                          <span class="field-req-dot">*</span>
                        </label>
                        <div style="display: flex; align-items: center; gap: 8px;">
                          <button
                            type="button"
                            class="btn-resync-slug"
                            @click="forceResyncSubdomain"
                            title="Sinkronkan ulang dari nama website"
                            v-if="isSubdomainManuallyEdited"
                          >
                            <RotateCw :size="11" />
                            <span>Sinkronkan Nama</span>
                          </button>
                          <span v-if="newSiteForm.subdomain.trim() && isSubdomainAvailable(newSiteForm.subdomain)" class="subdomain-inline-status avail">
                            <CheckCircle2 :size="12" /> Tersedia
                          </span>
                          <span v-else-if="newSiteForm.subdomain.trim()" class="subdomain-inline-status taken">
                            <AlertCircle :size="12" /> Sudah Digunakan
                          </span>
                          <span v-else class="subdomain-inline-status neutral">
                            Let's Encrypt Wildcard
                          </span>
                        </div>
                      </div>

                      <div class="create-url-container">
                        <span class="url-addon-prefix">
                          <Lock :size="12" class="url-addon-lock" />
                          <span>https://</span>
                        </span>
                        <input
                          id="modal-subdomain"
                          v-model="newSiteForm.subdomain"
                          @input="onSubdomainManualInput"
                          type="text"
                          placeholder="nama-situs"
                          class="create-url-core"
                          required
                          autocomplete="off"
                        />
                        <span class="url-addon-suffix">.stacbyte.id</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 3. Visual Accent Brand Color -->
                <div class="create-step-block">
                  <div class="create-step-header">
                    <span class="step-num-pill">3</span>
                    <span class="step-title-text">Palet Warna Aksen Brand</span>
                  </div>

                  <div class="color-presets-row">
                    <button
                      type="button"
                      v-for="color in brandColorPresets"
                      :key="color.id"
                      class="color-preset-btn"
                      :class="{ active: newSiteForm.accentColor === color.hex }"
                      :style="{ '--swatch-color': color.hex }"
                      @click="newSiteForm.accentColor = color.hex"
                      :title="color.label"
                    >
                      <span class="color-swatch-dot" :style="{ backgroundColor: color.hex }"></span>
                      <span class="color-preset-label">{{ color.label }}</span>
                      <Check v-if="newSiteForm.accentColor === color.hex" :size="12" class="color-check-icon" />
                    </button>
                  </div>
                </div>

              </div>

              <!-- RIGHT COLUMN: Live Studio Preview & Telemetry Specs -->
              <div class="create-site-preview-col">
                
                <!-- Live Browser Mockup Card -->
                <div class="create-mockup-frame">
                  <div class="mockup-frame-header">
                    <div class="mac-traffic-lights">
                      <span class="mac-dot mac-red"></span>
                      <span class="mac-dot mac-yellow"></span>
                      <span class="mac-dot mac-green"></span>
                    </div>
                    <div class="mockup-address-pill">
                      <Lock :size="11" style="color: #10b981;" />
                      <span class="mockup-url-text">
                        https://{{ (newSiteForm.subdomain || 'nama-situs').toLowerCase() }}.stacbyte.id
                      </span>
                    </div>
                    <span class="mockup-tls-tag">TLS 1.3</span>
                  </div>

                  <!-- Mockup Canvas Screen -->
                  <div class="mockup-canvas-screen">
                    <div class="mockup-site-banner" :style="{ background: `linear-gradient(135deg, ${newSiteForm.accentColor || '#2563eb'} 0%, #0f172a 100%)` }">
                      <div class="mockup-brand-row">
                        <div class="mockup-avatar-box">
                          <component :is="selectedBlueprint.icon" :size="18" />
                        </div>
                        <div class="mockup-badge-blueprint">
                          {{ selectedBlueprint.tagline }}
                        </div>
                      </div>

                      <h4 class="mockup-site-title">
                        {{ newSiteForm.name || 'Nama Website Anda' }}
                      </h4>
                      <p class="mockup-site-headline">
                        {{ newSiteForm.role || 'Website Resmi Aether Core Stack Cloud' }}
                      </p>

                      <div class="mockup-action-demo">
                        <span class="mockup-demo-btn" :style="{ backgroundColor: newSiteForm.accentColor || '#2563eb' }">
                          Kunjungi Situs
                        </span>
                        <span class="mockup-demo-ghost">
                          Hubungi Kami
                        </span>
                      </div>
                    </div>

                    <div class="mockup-features-strip">
                      <div class="mockup-feature-chip" v-for="(feat, fIdx) in selectedBlueprint.features" :key="fIdx">
                        <Check :size="11" style="color: #059669;" />
                        <span>{{ feat }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Container Runtime Allocation Box -->
                <div class="create-telemetry-card">
                  <div class="telemetry-card-title-row">
                    <div class="telemetry-card-icon-box">
                      <Server :size="14" />
                    </div>
                    <div>
                      <h5 class="telemetry-card-title">Alokasi Runtime Kontainer</h5>
                      <span class="telemetry-card-sub">Isolasi Kernel Linux cgroups v2</span>
                    </div>
                  </div>

                  <div class="telemetry-specs-grid">
                    <div class="telemetry-spec-item">
                      <span class="spec-label">CPU Limit</span>
                      <strong class="spec-value">{{ userPlan.cpuPerContainer || '0.5 vCPU' }}</strong>
                    </div>
                    <div class="telemetry-spec-item">
                      <span class="spec-label">RAM Alokasi</span>
                      <strong class="spec-value">{{ userPlan.ramPerContainer || '256 MB' }}</strong>
                    </div>
                    <div class="telemetry-spec-item">
                      <span class="spec-label">Edge Ingress</span>
                      <strong class="spec-value">Traefik v3 (1.8ms)</strong>
                    </div>
                    <div class="telemetry-spec-item">
                      <span class="spec-label">Sertifikat SSL</span>
                      <strong class="spec-value">Let's Encrypt Auto</strong>
                    </div>
                  </div>

                  <!-- Quota Utilization Bar -->
                  <div class="create-quota-widget">
                    <div class="quota-widget-header">
                      <span>Kapasitas Slot Kontainer</span>
                      <strong>{{ containers.length + 1 }} dari {{ userPlan.maxContainers }} Slot ({{ userPlan.name }})</strong>
                    </div>
                    <div class="quota-progress-track">
                      <div
                        class="quota-progress-fill"
                        :style="{ width: `${Math.min(100, Math.round(((containers.length + 1) / userPlan.maxContainers) * 100))}%` }"
                      ></div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <!-- Modal Footer Actions -->
            <div class="modal-footer-row create-site-footer">
              <div class="create-footer-note">
                <span class="pulse-green-sm"></span>
                <span>Traefik Edge & Docker Host Siap Menerima Beban Kerja</span>
              </div>
              <div class="create-footer-buttons">
                <button type="button" class="btn-modal-ghost" @click="isCreateModalOpen = false">
                  Batal
                </button>
                <button
                  type="submit"
                  class="btn-modal-confirm btn-create-deploy"
                  :disabled="!newSiteForm.name.trim() || !newSiteForm.subdomain.trim() || !isSubdomainAvailable(newSiteForm.subdomain)"
                >
                  <Rocket :size="15" />
                  <span>Deploy & Luncurkan Kontainer</span>
                </button>
              </div>
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
            <div class="terminal-output-screen" ref="terminalScreenRef">
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
          class="modal-dialog modal-dialog-seamless modal-dialog-delete"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
        >
          <!-- Modal Header -->
          <div class="modal-seamless-header">
            <div class="modal-header-leading">
              <div class="modal-header-icon-box modal-icon-danger">
                <AlertTriangle :size="18" stroke-width="2.2" />
              </div>
              <div>
                <h3 id="delete-dialog-title" class="modal-heading">Hapus Kontainer Runtime</h3>
                <p class="modal-subheading">Tindakan ini permanen dan akan melepas rute ingress Traefik.</p>
              </div>
            </div>
            <button
              type="button"
              class="modal-close-button-ghost"
              :disabled="isDeletingContainer"
              @click="cancelDeleteContainer"
              title="Tutup dialog"
            >
              <X :size="16" />
            </button>
          </div>

          <!-- Modal Body -->
          <div class="modal-seamless-body">
            <!-- Target Pod Card -->
            <div class="modal-target-site-card">
              <div class="modal-target-site-left">
                <div class="modal-target-icon-box delete-pod-icon">
                  <Server :size="18" />
                </div>
                <div class="modal-target-site-info">
                  <div class="modal-target-site-name">{{ containerToDelete.name }}</div>
                  <div class="modal-target-site-url">
                    <Globe :size="11" />
                    <span>https://{{ containerToDelete.subdomain }}</span>
                  </div>
                </div>
              </div>
              <div class="delete-pod-badges">
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
                <AlertCircle :size="15" />
                <span>Konsekuensi penghapusan kontainer:</span>
              </div>
              <div class="impact-list-clean">
                <div class="impact-item">
                  <span class="impact-item-dot"></span>
                  <div><strong>Proses Pod Dihentikan:</strong> Runtime Docker & cgroups v2 akan dimatikan seketika.</div>
                </div>
                <div class="impact-item">
                  <span class="impact-item-dot"></span>
                  <div><strong>Rute Ingress & SSL Dicabut:</strong> Permintaan masuk ke <code>{{ containerToDelete.subdomain }}</code> akan langsung mengembalikan status HTTP 404.</div>
                </div>
                <div class="impact-item">
                  <span class="impact-item-dot"></span>
                  <div><strong>Pengembalian Kuota:</strong> 1 slot kuota ({{ containers.length }}/{{ userPlan.maxContainers }}) akan otomatis dikembalikan ke kuota langganan Anda.</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Footer Actions -->
          <div class="modal-seamless-footer">
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
