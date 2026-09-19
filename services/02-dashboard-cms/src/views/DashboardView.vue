<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import {
  Layers,
  Server,
  Play,
  Square,
  RotateCw,
  Trash2,
  Plus,
  Edit3,
  Sparkles,
  Globe,
  ShieldCheck,
  TrendingUp,
  CreditCard,
  Briefcase,
  BookOpen,
  GraduationCap,
  ShoppingBag,
  Smartphone,
  Tablet,
  Monitor,
  CheckCircle2,
  AlertCircle,
  X,
  User,
  LogOut,
  ChevronRight,
  Rocket,
  Search,
  Copy,
  Check,
  Terminal,
  FolderKanban,
  Palette,
  Activity,
  ArrowUpRight
} from 'lucide-vue-next';

const router = useRouter();

// Active Navigation Menu
type ActiveMenu = 'containers' | 'editor' | 'templates' | 'analytics' | 'billing';
const activeMenu = ref<ActiveMenu>('containers');

// User & Subscription Quota
const userEmail = ref(localStorage.getItem('cloudcms_user_email') || 'admin@rizalpratama.cloud');
const userPlan = ref({
  name: 'Hero Pro Plan',
  price: 'Rp 149.000 / bln',
  maxContainers: 3,
  cpuPerContainer: '0.5 vCPU',
  ramPerContainer: '256 MB',
  storageQuota: '2 GB SSD'
});

// Container & Site Model
export interface ContainerSite {
  id: string;
  name: string;
  category: 'portfolio' | 'blog' | 'education' | 'business';
  templateName: string;
  subdomain: string;
  customDomain?: string;
  status: 'running' | 'stopped' | 'provisioning';
  cpuUsage: number;
  ramUsage: number;
  ramLimit: number;
  cpuLimit: string;
  uptime: string;
  visitsThisWeek: number;
  ssl: boolean;
  roleOrHeadline: string;
  bioIntro: string;
  accentColor: string;
  lastDeployed: string;
}

// Initial customer containers
const containers = ref<ContainerSite[]>([
  {
    id: 'hero_tenant_9942',
    name: 'Portofolio Rizal Pratama',
    category: 'portfolio',
    templateName: 'Portofolio Teknis Engineer',
    subdomain: 'rizal.cloudcms.app',
    customDomain: 'rizalpratama.cloud',
    status: 'running',
    cpuUsage: 14,
    ramUsage: 88,
    ramLimit: 256,
    cpuLimit: '0.5 vCPU',
    uptime: '4 hari 12 jam',
    visitsThisWeek: 3892,
    ssl: true,
    roleOrHeadline: 'Senior Cloud & Distributed Systems Engineer',
    bioIntro: 'Membangun arsitektur microservices terdistribusi, orkestrasi kontainer Docker otonom, dan pipeline telemetri real-time dengan latensi rendah.',
    accentColor: '#2563eb',
    lastDeployed: '10 menit lalu'
  }
]);

// Search & Filter
const searchQuery = ref('');
const statusFilter = ref<'all' | 'running' | 'stopped'>('all');

const filteredContainers = computed(() => {
  return containers.value.filter(c => {
    const matchQuery = c.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                       c.subdomain.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchStatus = statusFilter.value === 'all' ? true : c.status === statusFilter.value;
    return matchQuery && matchStatus;
  });
});

// Quota calculations
const usedContainersCount = computed(() => containers.value.length);
const runningContainersCount = computed(() => containers.value.filter(c => c.status === 'running').length);
const stoppedContainersCount = computed(() => containers.value.filter(c => c.status === 'stopped').length);
const isQuotaExceeded = computed(() => containers.value.length >= userPlan.value.maxContainers);

// Active container for Editor
const activeContainerId = ref<string>('hero_tenant_9942');
const activeContainer = computed(() => {
  return containers.value.find(c => c.id === activeContainerId.value) || containers.value[0];
});

// Toast system
const toastMessage = ref<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);
const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
  toastMessage.value = { text, type };
  setTimeout(() => {
    toastMessage.value = null;
  }, 3500);
};

// Copy feedback
const copiedSubdomain = ref<string | null>(null);
const copyToClipboard = (text: string, id: string) => {
  navigator.clipboard.writeText(`https://${text}`);
  copiedSubdomain.value = id;
  setTimeout(() => {
    copiedSubdomain.value = null;
  }, 2000);
  showToast(`URL disalin ke clipboard: https://${text}`, 'info');
};

// Container Lifecycle Operations
const startContainer = (container: ContainerSite) => {
  container.status = 'provisioning';
  showToast(`Menjalankan kontainer ${container.id}...`, 'info');
  setTimeout(() => {
    container.status = 'running';
    container.cpuUsage = 14;
    container.ramUsage = 82;
    showToast(`Kontainer ${container.name} aktif melayani trafik!`, 'success');
  }, 900);
};

const stopContainer = (container: ContainerSite) => {
  container.status = 'provisioning';
  showToast(`Menghentikan kontainer ${container.id}...`, 'info');
  setTimeout(() => {
    container.status = 'stopped';
    container.cpuUsage = 0;
    container.ramUsage = 12;
    showToast(`Kontainer ${container.name} telah dihentikan (standby).`, 'info');
  }, 800);
};

const restartContainer = (container: ContainerSite) => {
  container.status = 'provisioning';
  showToast(`Me-restart kontainer ${container.id}...`, 'info');
  setTimeout(() => {
    container.status = 'running';
    container.cpuUsage = 15;
    container.ramUsage = 86;
    showToast(`Kontainer ${container.name} sehat setelah reboot!`, 'success');
  }, 1100);
};

const deleteContainer = (container: ContainerSite) => {
  if (confirm(`Hapus kontainer '${container.name}'? Slot kuota (${containers.value.length}/${userPlan.value.maxContainers}) akan dikembalikan.`)) {
    const idx = containers.value.findIndex(c => c.id === container.id);
    if (idx !== -1) {
      containers.value.splice(idx, 1);
      showToast(`Kontainer ${container.id} dihapus. Kuota kini ${containers.value.length}/${userPlan.value.maxContainers}.`, 'info');
      if (containers.value.length > 0) {
        activeContainerId.value = containers.value[0].id;
      }
    }
  }
};

// Modal: Buat CMS Baru
const isCreateModalOpen = ref(false);
const newSiteForm = ref({
  name: '',
  subdomain: '',
  category: 'portfolio' as 'portfolio' | 'blog' | 'education' | 'business',
  role: ''
});

const openCreateModal = (category?: 'portfolio' | 'blog' | 'education' | 'business') => {
  if (isQuotaExceeded.value) {
    showToast(`Kuota kontainer (${containers.value.length}/${userPlan.value.maxContainers}) penuh. Silakan upgrade atau hapus kontainer lama.`, 'error');
    activeMenu.value = 'billing';
    return;
  }
  newSiteForm.value.name = '';
  newSiteForm.value.subdomain = '';
  newSiteForm.value.role = '';
  if (category) newSiteForm.value.category = category;
  isCreateModalOpen.value = true;
};

const handleCreateContainer = () => {
  if (!newSiteForm.value.name.trim() || !newSiteForm.value.subdomain.trim()) {
    showToast('Nama situs dan subdomain wajib diisi.', 'error');
    return;
  }

  const cleanSubdomain = newSiteForm.value.subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '');
  const newId = `hero_tenant_${Math.floor(1000 + Math.random() * 9000)}`;

  let tplName = 'Portofolio Teknis Engineer';
  if (newSiteForm.value.category === 'blog') tplName = 'Editorial Media & Blog';
  if (newSiteForm.value.category === 'education') tplName = 'Pusat Edukasi LMS';
  if (newSiteForm.value.category === 'business') tplName = 'Showcase Bisnis & UMKM';

  const newContainerObj: ContainerSite = {
    id: newId,
    name: newSiteForm.value.name,
    category: newSiteForm.value.category,
    templateName: tplName,
    subdomain: `${cleanSubdomain}.cloudcms.app`,
    status: 'running',
    cpuUsage: 12,
    ramUsage: 74,
    ramLimit: 256,
    cpuLimit: '0.5 vCPU',
    uptime: 'Baru dibuat',
    visitsThisWeek: 0,
    ssl: true,
    roleOrHeadline: newSiteForm.value.role || 'Website Resmi ' + newSiteForm.value.name,
    bioIntro: 'Selamat datang di website resmi yang didukung arsitektur kontainer otonom HeroCMS Studio.',
    accentColor: '#2563eb',
    lastDeployed: 'Baru saja'
  };

  containers.value.push(newContainerObj);
  activeContainerId.value = newId;
  isCreateModalOpen.value = false;
  showToast(`Situs '${newContainerObj.name}' berhasil dibuat di kontainer ${newId}!`, 'success');
  activeMenu.value = 'editor';
};

// Official Templates & Pricelist Catalog
const officialTemplates = ref([
  {
    id: 'tpl_portfolio_pro',
    title: 'Portofolio Teknis & Engineer',
    category: 'portfolio' as const,
    tier: 'Included in Plan',
    priceText: 'Gratis dalam Kuota',
    isPro: false,
    desc: 'Dirancang untuk software engineer, cloud architect, dan desainer. Showcase studi kasus, GitHub telemetry, dan CV direct download.',
    features: ['Studi Kasus Interaktif', 'Integrasi GitHub Repos', 'Formulir Kontak Webhook', 'Peringkat SEO Optimal']
  },
  {
    id: 'tpl_blog_editorial',
    title: 'Editorial Media & Tech Blog',
    category: 'blog' as const,
    tier: 'Included in Plan',
    priceText: 'Gratis dalam Kuota',
    isPro: false,
    desc: 'Platform publikasi artikel modern dengan editor visual, estimasi waktu baca, dan generator otomatis kartu media sosial OpenGraph.',
    features: ['Editor Blok Modern', 'Multi-Author Support', 'OpenGraph Generator', 'Redis Top Views Stream']
  },
  {
    id: 'tpl_edu_lms',
    title: 'Pusat Edukasi & Dokumentasi LMS',
    category: 'education' as const,
    tier: 'Pro Template',
    priceText: 'Termasuk di Paket Pro',
    isPro: true,
    desc: 'Silabus modul bertingkat, publikasi materi ajar terstruktur, profil tutor, dan integrasi video tutorial interaktif.',
    features: ['Silabus Modul Bertingkat', 'Pencarian Dokumentasi Instan', 'Profil Tutor & Dosen', 'Download Materi PDF']
  },
  {
    id: 'tpl_business_catalog',
    title: 'Showcase Bisnis Mikro & UMKM',
    category: 'business' as const,
    tier: 'Pro Template',
    priceText: 'Termasuk di Paket Pro',
    isPro: true,
    desc: 'Toko online mikro dan landing page jasa profesional dengan tombol order direct WhatsApp dan galeri produk responsif.',
    features: ['Katalog Produk Responsif', 'Direct WhatsApp Ordering', 'Integrasi Payment Link', 'Statistik Konversi Kunjungan']
  }
]);

// Visual Editor Simulator State
const editorDevice = ref<'desktop' | 'tablet' | 'mobile'>('desktop');
const isPublishing = ref(false);

const handlePublishChanges = () => {
  if (!activeContainer.value) return;
  isPublishing.value = true;
  setTimeout(() => {
    isPublishing.value = false;
    activeContainer.value.lastDeployed = 'Baru saja';
    showToast(`Perubahan '${activeContainer.value.name}' live ke Docker!`, 'success');
  }, 1200);
};

// AI Generator Assistant
const isGeneratingAI = ref(false);
const aiPromptInput = ref('');
const handleAiGenerateContent = () => {
  if (!aiPromptInput.value.trim() || !activeContainer.value) return;
  isGeneratingAI.value = true;
  setTimeout(() => {
    isGeneratingAI.value = false;
    activeContainer.value.bioIntro = `Solusi komputasi cloud otonom & arsitektur modern berorientasi masa depan yang dirancang berdasarkan kebutuhan: ${aiPromptInput.value}. Memaksimalkan efisiensi kontainer dan skalabilitas tinggi.`;
    aiPromptInput.value = '';
    showToast('Asisten AI berhasil menyusun konten baru!', 'success');
  }, 900);
};

const handleLogout = () => {
  localStorage.removeItem('cloudcms_auth_token');
  localStorage.removeItem('cloudcms_user_email');
  router.push('/login');
};
</script>

<template>
  <div class="app-shell">
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
        <div class="nav-section-title">CORE PLATFORM</div>
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
            :class="{ active: activeMenu === 'templates' }"
            @click="activeMenu = 'templates'"
          >
            <Palette :size="17" />
            <span class="nav-link-text">Katalog Template</span>
            <span class="nav-pill-tag">Store</span>
          </button>
        </nav>

        <div class="nav-section-title">INFRASTRUKTUR & METRIK</div>
        <nav class="sidebar-nav-list">
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
            :class="{ active: activeMenu === 'billing' }"
            @click="activeMenu = 'billing'"
          >
            <CreditCard :size="17" />
            <span class="nav-link-text">Kapasitas & Billing</span>
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
            <LogOut :size="15" />
          </button>
        </div>
      </div>
    </aside>

    <!-- 2. MAIN CONTENT AREA -->
    <div class="app-main-area">
      <!-- Top Utility Header Bar -->
      <header class="top-nav-header">
        <div class="breadcrumbs">
          <span>HeroCMS Studio</span>
          <ChevronRight :size="14" class="crumb-sep" />
          <span class="crumb-current">
            {{
              activeMenu === 'containers' ? 'Situs & Kontainer' :
              activeMenu === 'editor' ? 'Editor Visual Studio' :
              activeMenu === 'templates' ? 'Katalog Template & Pricelist' :
              activeMenu === 'analytics' ? 'Analitik Real-Time (Redis)' : 'Paket Langganan & Billing'
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

      <!-- Main Dynamic Workspace View -->
      <main class="content-scroll-pane">
        <!-- ============================================================= -->
        <!-- VIEW 1: SITUS & KONTAINER DOCKER                              -->
        <!-- ============================================================= -->
        <section v-if="activeMenu === 'containers'" class="fade-in-section">
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
          <div v-if="filteredContainers.length > 0 || (statusFilter === 'all' && containers.length < userPlan.maxContainers)" class="site-cards-grid">
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
                  @click="activeContainerId = c.id; activeMenu = 'editor'"
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
            <template v-if="statusFilter === 'all' && containers.length < userPlan.maxContainers">
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

          <!-- Empty State (When Filter returns 0 results) -->
          <div v-else class="empty-state-card">
            <Server :size="40" color="#94a3b8" />
            <h3>Tidak ada kontainer dengan status '{{ statusFilter }}'</h3>
            <p>Ubah filter pencarian atau deploy kontainer baru untuk mengisi kuota website Anda.</p>
            <button class="btn-top-create" @click="openCreateModal()">
              <Plus :size="15" />
              <span>Buat Website Baru</span>
            </button>
          </div>
        </section>

        <!-- ============================================================= -->
        <!-- VIEW 2: EDITOR STUDIO VISUAL                                  -->
        <!-- ============================================================= -->
        <section v-else-if="activeMenu === 'editor'" class="fade-in-section">
          <div v-if="activeContainer" class="pro-editor-layout">
            <!-- Top Editor Sub-Toolbar -->
            <div class="editor-top-strip">
              <div class="strip-left">
                <span class="lbl-site">Mengedit:</span>
                <select v-model="activeContainerId" class="select-site-switch">
                  <option v-for="c in containers" :key="c.id" :value="c.id">
                    {{ c.name }} ({{ c.subdomain }})
                  </option>
                </select>
                <span class="badge-saved">Disimpan otomatis</span>
              </div>

              <!-- Device Switcher + Deploy Button -->
              <div class="strip-right">
                <div class="screen-size-switch">
                  <button
                    class="btn-screen"
                    :class="{ active: editorDevice === 'desktop' }"
                    @click="editorDevice = 'desktop'"
                  >
                    <Monitor :size="15" />
                  </button>
                  <button
                    class="btn-screen"
                    :class="{ active: editorDevice === 'tablet' }"
                    @click="editorDevice = 'tablet'"
                  >
                    <Tablet :size="15" />
                  </button>
                  <button
                    class="btn-screen"
                    :class="{ active: editorDevice === 'mobile' }"
                    @click="editorDevice = 'mobile'"
                  >
                    <Smartphone :size="15" />
                  </button>
                </div>

                <button class="btn-deploy-live" :disabled="isPublishing" @click="handlePublishChanges">
                  <Rocket v-if="!isPublishing" :size="15" />
                  <span v-else class="spinner-tiny"></span>
                  <span>{{ isPublishing ? 'Menerbitkan...' : 'Terbitkan ke Kontainer (Live)' }}</span>
                </button>
              </div>
            </div>

            <!-- 2-Column Split: Controls + Visual Mockup -->
            <div class="builder-split-body">
              <!-- Left: Form Controls (360px) -->
              <div class="builder-controls-panel">
                <div class="panel-section-title">KONTEN SITUS</div>

                <div class="form-item">
                  <label>Nama Website / Brand</label>
                  <input v-model="activeContainer.name" type="text" class="input-pro" />
                </div>

                <div class="form-item">
                  <label>Judul Utama (Headline)</label>
                  <input v-model="activeContainer.roleOrHeadline" type="text" class="input-pro" />
                </div>

                <div class="form-item">
                  <label>Bio Singkat / Deskripsi Portofolio</label>
                  <textarea v-model="activeContainer.bioIntro" rows="3" class="input-pro textarea-pro"></textarea>
                </div>

                <!-- AI Writing Box -->
                <div class="ai-generator-box">
                  <div class="ai-box-title">
                    <Sparkles :size="14" color="#2563eb" />
                    <span>Hero AI Copilot</span>
                  </div>
                  <input
                    v-model="aiPromptInput"
                    type="text"
                    placeholder="Instruksi AI: 'Tulis intro senior dev'..."
                    class="input-pro"
                    @keydown.enter="handleAiGenerateContent"
                  />
                  <button class="btn-ai-submit" :disabled="isGeneratingAI || !aiPromptInput.trim()" @click="handleAiGenerateContent">
                    <Sparkles :size="13" />
                    <span>{{ isGeneratingAI ? 'Menyusun...' : 'Generate Konten' }}</span>
                  </button>
                </div>

                <div class="panel-section-title" style="margin-top: 20px;">DESAIN & GAYA</div>

                <div class="form-item">
                  <label>Warna Aksen Brand</label>
                  <div class="colors-row">
                    <button
                      v-for="col in ['#2563eb', '#059669', '#7c3aed', '#ea580c', '#0f172a']"
                      :key="col"
                      class="color-dot"
                      :style="{ backgroundColor: col }"
                      :class="{ selected: activeContainer.accentColor === col }"
                      @click="activeContainer.accentColor = col"
                    ></button>
                  </div>
                </div>

                <div class="form-item">
                  <label>Subdomain Terhubung</label>
                  <input :value="`https://${activeContainer.subdomain}`" readonly class="input-pro input-readonly" />
                </div>
              </div>

              <!-- Right: Device Canvas Preview -->
              <div class="builder-preview-canvas" :class="`device-${editorDevice}`">
                <div class="browser-mockup">
                  <div class="browser-mockup-bar">
                    <div class="browser-circle-dots">
                      <span></span><span></span><span></span>
                    </div>
                    <div class="browser-url-pill">
                      <ShieldCheck :size="12" color="#059669" />
                      <span>https://{{ activeContainer.subdomain }}</span>
                    </div>
                    <span class="badge-live-tag">● Live Docker</span>
                  </div>

                  <!-- Rendered Template Mockup -->
                  <div class="rendered-page">
                    <header class="page-top-nav">
                      <div class="site-logo" :style="{ color: activeContainer.accentColor }">
                        {{ activeContainer.name }}
                      </div>
                      <div class="nav-mock-links">
                        <span>Beranda</span>
                        <span>Tentang</span>
                        <span>Proyek</span>
                        <button class="btn-mock-cta" :style="{ backgroundColor: activeContainer.accentColor }">
                          Kontak
                        </button>
                      </div>
                    </header>

                    <div class="page-hero-mock">
                      <span class="hero-tag-badge" :style="{ color: activeContainer.accentColor, borderColor: activeContainer.accentColor + '40', backgroundColor: activeContainer.accentColor + '10' }">
                        {{ activeContainer.templateName }}
                      </span>
                      <h2 class="hero-h2">{{ activeContainer.roleOrHeadline }}</h2>
                      <p class="hero-p">{{ activeContainer.bioIntro }}</p>
                      <div class="hero-btns-mock">
                        <button class="btn-hero-pri" :style="{ backgroundColor: activeContainer.accentColor }">
                          Lihat Portofolio
                        </button>
                        <button class="btn-hero-sec">Dokumentasi</button>
                      </div>
                    </div>

                    <div class="page-features-grid">
                      <div class="feature-mock-card">
                        <Server :size="18" :style="{ color: activeContainer.accentColor }" />
                        <h4>Orkestrasi Kontainer Terisolasi</h4>
                        <p>Berjalan pada runtime Docker Engine mandiri dengan jaminan keamanan cgroups v2.</p>
                      </div>
                      <div class="feature-mock-card">
                        <Globe :size="18" :style="{ color: activeContainer.accentColor }" />
                        <h4>Edge Routing Traefik v3</h4>
                        <p>Sertifikat SSL Let's Encrypt TLS v1.3 aktif dan otomatis diperbarui secara berkala.</p>
                      </div>
                      <div class="feature-mock-card">
                        <TrendingUp :size="18" :style="{ color: activeContainer.accentColor }" />
                        <h4>Telemetri Real-Time</h4>
                        <p>Pencatatan statistik kunjungan secepat kilat dengan antrean Kafka dan Redis DB.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- ============================================================= -->
        <!-- VIEW 3: KATALOG TEMPLATE & PRICELIST STORE                    -->
        <!-- ============================================================= -->
        <section v-else-if="activeMenu === 'templates'" class="fade-in-section">
          <div class="page-intro-row">
            <div>
              <h1 class="page-title">Katalog Template & Pricelist</h1>
              <p class="page-desc">Pilih template resmi siap pakai yang dioptimalkan untuk SEO dan kemudahan editor blok.</p>
            </div>
          </div>

          <div class="template-market-grid">
            <div v-for="tpl in officialTemplates" :key="tpl.id" class="tpl-market-card">
              <div class="tpl-card-header">
                <span class="tpl-type-pill">{{ tpl.category.toUpperCase() }}</span>
                <span class="tpl-tier-pill" :class="{ 'tier-pro': tpl.isPro }">{{ tpl.tier }}</span>
              </div>

              <div class="tpl-icon-preview">
                <Briefcase v-if="tpl.category === 'portfolio'" :size="32" color="#2563eb" />
                <BookOpen v-else-if="tpl.category === 'blog'" :size="32" color="#2563eb" />
                <GraduationCap v-else-if="tpl.category === 'education'" :size="32" color="#059669" />
                <ShoppingBag v-else :size="32" color="#d97706" />
              </div>

              <div class="tpl-card-body">
                <h3 class="tpl-card-title">{{ tpl.title }}</h3>
                <p class="tpl-card-desc">{{ tpl.desc }}</p>

                <ul class="tpl-checklist">
                  <li v-for="(feat, fIdx) in tpl.features" :key="fIdx">
                    <CheckCircle2 :size="13" color="#059669" />
                    <span>{{ feat }}</span>
                  </li>
                </ul>
              </div>

              <div class="tpl-card-bottom">
                <div class="tpl-cost">
                  <span>Lisensi:</span>
                  <strong>{{ tpl.priceText }}</strong>
                </div>
                <button class="btn-use-tpl" @click="openCreateModal(tpl.category)">
                  <span>Pakai Template</span>
                  <ChevronRight :size="14" />
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- ============================================================= -->
        <!-- VIEW 4: ANALITIK & TELEMETRI REAL-TIME (REDIS SORTED SETS)   -->
        <!-- ============================================================= -->
        <section v-else-if="activeMenu === 'analytics'" class="fade-in-section">
          <div class="page-intro-row">
            <div>
              <h1 class="page-title">Telemetri & Analitik Real-Time</h1>
              <p class="page-desc">Data hit pengunjung dicatat non-blocking melalui event stream Kafka dan dihitung via Redis Sorted Sets.</p>
            </div>
          </div>

          <div class="analytics-strip-grid">
            <div class="analytics-card">
              <span class="a-label">TOTAL KUNJUNGAN MINGGU INI</span>
              <div class="a-val">3,892 <span class="a-growth">+28%</span></div>
              <span class="a-sub">142 IP unik di 12 negara</span>
            </div>
            <div class="analytics-card">
              <span class="a-label">LATENSI EDGE TRAEFIK</span>
              <div class="a-val">1.8 ms</div>
              <span class="a-sub">Cache proxy edge aktif</span>
            </div>
            <div class="analytics-card">
              <span class="a-label">KAFKA CONSUMER LAG</span>
              <div class="a-val text-emerald">0 Pesan</div>
              <span class="a-sub">Sinkronisasi real-time 100%</span>
            </div>
          </div>

          <div class="analytics-two-col">
            <div class="pro-panel">
              <div class="panel-head">
                <h3>Top Halaman & Artikel Terpopuler</h3>
                <span class="redis-chip">Redis ZREVRANGEBYSCORE</span>
              </div>
              <div class="rank-list">
                <div class="rank-row">
                  <span class="rank-badge">1</span>
                  <div class="rank-title-group">
                    <strong>Arsitektur Multi-Tenant dengan Docker & Go</strong>
                    <span>/blog/multi-tenant-docker • Skor Telemetri: 98.4</span>
                  </div>
                  <span class="rank-hit">1,420 views</span>
                </div>
                <div class="rank-row">
                  <span class="rank-badge">2</span>
                  <div class="rank-title-group">
                    <strong>Penyelarasan Telemetri Real-Time dengan Kafka</strong>
                    <span>/blog/kafka-telemetry • Skor Telemetri: 82.1</span>
                  </div>
                  <span class="rank-hit">890 views</span>
                </div>
                <div class="rank-row">
                  <span class="rank-badge">3</span>
                  <div class="rank-title-group">
                    <strong>Optimasi TTFB Edge Traefik v3</strong>
                    <span>/blog/traefik-ttfb • Skor Telemetri: 64.5</span>
                  </div>
                  <span class="rank-hit">610 views</span>
                </div>
              </div>
            </div>

            <div class="pro-panel">
              <div class="panel-head">
                <h3>Log Telemetri Kafka Ingestion</h3>
                <Terminal :size="15" color="#64748b" />
              </div>
              <div class="terminal-log-window">
                <div class="t-line"><span>[00:26:12]</span> Traefik: Ingested page_view (200 OK - 1.4ms)</div>
                <div class="t-line"><span>[00:26:15]</span> Redis: ZINCRBY 'tenant:9942:views' 1 article:1</div>
                <div class="t-line"><span>[00:26:18]</span> Docker: cgroups v2 resource check healthy</div>
                <div class="t-line"><span>[00:26:22]</span> Traefik: SSL Let's Encrypt verified</div>
              </div>
            </div>
          </div>
        </section>

        <!-- ============================================================= -->
        <!-- VIEW 5: PAKET LANGGANAN & BILLING                             -->
        <!-- ============================================================= -->
        <section v-else-if="activeMenu === 'billing'" class="fade-in-section">
          <div class="page-intro-row">
            <div>
              <h1 class="page-title">Paket Langganan & Billing</h1>
              <p class="page-desc">Kelola kapasitas kontainer Docker, batas resource CPU/RAM, dan opsi penambahan kuota on-demand.</p>
            </div>
          </div>

          <div class="billing-two-col">
            <div class="pro-panel">
              <div class="plan-summary-row">
                <div>
                  <span class="plan-active-tag">PAKET AKTIF SAAT INI</span>
                  <h2 class="plan-h2">{{ userPlan.name }}</h2>
                  <span class="plan-cost">{{ userPlan.price }}</span>
                </div>
                <button class="btn-top-create" @click="showToast('Permintaan upgrade telah dicatat!', 'info')">
                  Upgrade Paket
                </button>
              </div>

              <div class="plan-resource-list">
                <div class="resource-row">
                  <span>Slot Kontainer Docker</span>
                  <strong>{{ usedContainersCount }} dari {{ userPlan.maxContainers }} Terpakai</strong>
                </div>
                <div class="resource-row">
                  <span>Batas CPU per Kontainer</span>
                  <strong>{{ userPlan.cpuPerContainer }} (Dedicated Limit)</strong>
                </div>
                <div class="resource-row">
                  <span>Batas RAM per Kontainer</span>
                  <strong>{{ userPlan.ramPerContainer }} (cgroups v2)</strong>
                </div>
                <div class="resource-row">
                  <span>Penyimpanan Media S3</span>
                  <strong>120 MB / {{ userPlan.storageQuota }}</strong>
                </div>
              </div>
            </div>

            <div class="pro-panel addon-panel">
              <h3>Tambah Slot Kontainer On-Demand</h3>
              <p>Tambah slot kontainer tanpa mengganti paket utama Anda.</p>
              <div class="addon-price-tag">
                <div class="addon-title">+1 Slot Kontainer</div>
                <div class="addon-sub">Rp 49.000 / bulan</div>
              </div>
              <button
                class="btn-add-slot"
                @click="userPlan.maxContainers += 1; showToast(`Kuota Anda telah bertambah menjadi ${userPlan.maxContainers} kontainer!`, 'success')"
              >
                <Plus :size="15" />
                <span>Tambah +1 Kontainer Sekarang</span>
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>

    <!-- ============================================================= -->
    <!-- MODAL: BUAT WEBSITE / TAMBAH KONTAINER BARU                  -->
    <!-- ============================================================= -->
    <div v-if="isCreateModalOpen" class="modal-scrim" @click.self="isCreateModalOpen = false">
      <div class="modal-card">
        <div class="modal-top">
          <div>
            <div class="modal-badge-sup">
              <span class="pulse-mini-dot"></span>
              <span>DOCKER RUNTIME ENGINE</span>
            </div>
            <h3 class="modal-h3">Deploy Kontainer Website Baru</h3>
            <p class="modal-p">Inisialisasi kontainer mandiri dengan isolasi cgroups Linux & routing Traefik v3.</p>
          </div>
          <button class="btn-modal-close" @click="isCreateModalOpen = false"><X :size="16" /></button>
        </div>

        <form @submit.prevent="handleCreateContainer" class="modal-body-form">
          <!-- Custom Category Selector -->
          <div class="custom-form-field">
            <label class="field-label">KATEGORI SITUS & TEMPLATE</label>
            <div class="category-grid-selector">
              <div
                class="category-option-card"
                :class="{ active: newSiteForm.category === 'portfolio' }"
                @click="newSiteForm.category = 'portfolio'"
              >
                <div class="cat-icon-wrap blue"><Briefcase :size="16" /></div>
                <div class="cat-meta">
                  <span class="cat-name">Portofolio</span>
                  <span class="cat-desc">Tech & Engineer</span>
                </div>
              </div>
              <div
                class="category-option-card"
                :class="{ active: newSiteForm.category === 'blog' }"
                @click="newSiteForm.category = 'blog'"
              >
                <div class="cat-icon-wrap emerald"><BookOpen :size="16" /></div>
                <div class="cat-meta">
                  <span class="cat-name">Blog & Media</span>
                  <span class="cat-desc">Editorial Artikel</span>
                </div>
              </div>
              <div
                class="category-option-card"
                :class="{ active: newSiteForm.category === 'education' }"
                @click="newSiteForm.category = 'education'"
              >
                <div class="cat-icon-wrap purple"><GraduationCap :size="16" /></div>
                <div class="cat-meta">
                  <span class="cat-name">Pusat Edukasi</span>
                  <span class="cat-desc">Dokumentasi LMS</span>
                </div>
              </div>
              <div
                class="category-option-card"
                :class="{ active: newSiteForm.category === 'business' }"
                @click="newSiteForm.category = 'business'"
              >
                <div class="cat-icon-wrap amber"><ShoppingBag :size="16" /></div>
                <div class="cat-meta">
                  <span class="cat-name">Bisnis & UMKM</span>
                  <span class="cat-desc">Showcase & Produk</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Nama Website -->
          <div class="custom-form-field">
            <label class="field-label">
              <span>NAMA WEBSITE / BRAND</span>
              <span class="field-required">*</span>
            </label>
            <div class="custom-input-box">
              <input
                v-model="newSiteForm.name"
                type="text"
                placeholder="Contoh: Portofolio Ahmad, Tech Daily Blog..."
                class="input-custom-core"
                required
              />
            </div>
          </div>

          <!-- Subdomain with Integrated Chip -->
          <div class="custom-form-field">
            <label class="field-label">
              <span>SUBDOMAIN CLOUDCMS</span>
              <span class="field-required">*</span>
            </label>
            <div class="custom-composite-box">
              <Globe :size="15" class="composite-lead-icon" />
              <input
                v-model="newSiteForm.subdomain"
                type="text"
                placeholder="nama-situs"
                class="composite-input-core"
                required
              />
              <span class="composite-domain-tag">.cloudcms.app</span>
            </div>
            <span class="field-helper">Sertifikat SSL Let's Encrypt TLS v1.3 aktif otomatis via Traefik edge routing.</span>
          </div>

          <!-- Headline / Peran -->
          <div class="custom-form-field">
            <label class="field-label">PERAN / HEADLINE PEMBUKA (OPSIONAL)</label>
            <div class="custom-input-box">
              <input
                v-model="newSiteForm.role"
                type="text"
                placeholder="Contoh: Senior Distributed Systems Architect"
                class="input-custom-core"
              />
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="modal-footer-actions">
            <button type="button" class="btn-ghost-cancel" @click="isCreateModalOpen = false">Batal</button>
            <button type="submit" class="btn-primary-deploy">
              <Rocket :size="15" />
              <span>Deploy Kontainer Sekarang</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ==========================================================================
   HEROCMS STUDIO - BESPOKE ENTERPRISE DESIGN SYSTEM (CLEAN & NON-BOOTSTRAP)
   ========================================================================== */

.app-shell {
  display: flex;
  min-height: 100vh;
  background: transparent;
  position: relative;
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
  background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
  color: #ffffff;
  border: 1px solid #0f172a;
  padding: 7px 15px;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

.btn-action-primary:hover {
  background: #1e293b;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.2);
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

.btn-del:hover {
  background: #fef2f2;
  border-color: #fecaca;
  color: #dc2626;
}

/* Available Slot Placeholder Cards */
.empty-slot-card {
  border: 1.5px dashed #cbd5e1;
  border-radius: 16px;
  background: rgba(248, 250, 252, 0.5);
  min-height: 230px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  padding: 20px;
}

.empty-slot-card:hover {
  border-color: #3b82f6;
  background: rgba(239, 246, 255, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px -6px rgba(37, 99, 235, 0.08);
}

.slot-dashed-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 12px;
}

.slot-icon-circle {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: #eff6ff;
  color: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}

.empty-slot-card:hover .slot-icon-circle {
  transform: scale(1.08);
}

.slot-text-group {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.slot-badge {
  font-size: 0.68rem;
  font-weight: 700;
  color: #2563eb;
  letter-spacing: 0.08em;
  font-family: ui-monospace, monospace;
}

.slot-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #0f172a;
}

.slot-specs {
  font-size: 0.74rem;
  color: #64748b;
}

.btn-slot-create {
  margin-top: 4px;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  color: #0f172a;
  padding: 6px 14px;
  border-radius: 7px;
  font-size: 0.76rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.empty-slot-card:hover .btn-slot-create {
  background: #2563eb;
  border-color: #2563eb;
  color: #ffffff;
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
   BESPOKE GLASSMORPHIC MODAL & CUSTOM FORM SYSTEM (ZERO BOOTSTRAP)
   ========================================================================== */
.modal-scrim {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.modal-card {
  background: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.85);
  border-radius: 20px;
  width: 100%;
  max-width: 520px;
  padding: 28px 30px;
  box-shadow: 0 25px 60px -15px rgba(15, 23, 42, 0.25), 0 0 0 1px rgba(15, 23, 42, 0.05);
}

.modal-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.modal-badge-sup {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #2563eb;
  margin-bottom: 4px;
}

.modal-h3 {
  font-size: 1.2rem;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.02em;
}

.modal-p {
  font-size: 0.8rem;
  color: #64748b;
  margin-top: 3px;
  line-height: 1.4;
}

.btn-modal-close {
  background: #f1f5f9;
  border: none;
  color: #64748b;
  cursor: pointer;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.12s ease;
}

.btn-modal-close:hover {
  background: #e2e8f0;
  color: #0f172a;
}

.modal-body-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.custom-form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  font-size: 0.74rem;
  font-weight: 700;
  color: #475569;
  letter-spacing: 0.04em;
  display: flex;
  align-items: center;
  gap: 3px;
}

.field-required {
  color: #ef4444;
  font-weight: 700;
}

/* Category Grid Selector */
.category-grid-selector {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.category-option-card {
  padding: 10px 12px;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  background: #ffffff;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
}

.category-option-card:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
  transform: translateY(-1px);
}

.category-option-card.active {
  background: #eff6ff;
  border-color: #2563eb;
  box-shadow: 0 0 0 1px #2563eb;
}

.cat-icon-wrap {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.cat-icon-wrap.blue { background: #eff6ff; color: #2563eb; }
.cat-icon-wrap.emerald { background: #ecfdf5; color: #059669; }
.cat-icon-wrap.purple { background: #faf5ff; color: #9333ea; }
.cat-icon-wrap.amber { background: #fffbeb; color: #d97706; }

.cat-meta {
  display: flex;
  flex-direction: column;
}

.cat-name {
  font-size: 0.82rem;
  font-weight: 700;
  color: #0f172a;
}

.cat-desc {
  font-size: 0.68rem;
  color: #64748b;
}

/* Bespoke Input Box */
.custom-input-box {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  align-items: center;
}

.custom-input-box:focus-within {
  background: #ffffff;
  border-color: #3b82f6;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.12), 0 1px 2px rgba(15, 23, 42, 0.05);
}

.input-custom-core {
  width: 100%;
  height: 42px;
  padding: 0 14px;
  border: none;
  background: transparent;
  font-size: 0.86rem;
  color: #0f172a;
  outline: none;
  font-family: inherit;
}

.input-custom-core::placeholder {
  color: #94a3b8;
}

/* Bespoke Composite Box */
.custom-composite-box {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  display: flex;
  align-items: center;
  padding: 0 10px 0 14px;
  height: 42px;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  gap: 8px;
}

.custom-composite-box:focus-within {
  background: #ffffff;
  border-color: #3b82f6;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.12), 0 1px 2px rgba(15, 23, 42, 0.05);
}

.composite-lead-icon {
  color: #2563eb;
  flex-shrink: 0;
}

.composite-input-core {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 0.86rem;
  color: #0f172a;
  outline: none;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.composite-input-core::placeholder {
  color: #94a3b8;
}

.composite-domain-tag {
  background: #e2e8f0;
  color: #475569;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.78rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 6px;
  flex-shrink: 0;
}

.field-helper {
  font-size: 0.72rem;
  color: #64748b;
  margin-top: 1px;
}

.modal-footer-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
}

.btn-ghost-cancel {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  color: #475569;
  padding: 9px 18px;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-ghost-cancel:hover {
  background: #f8fafc;
  color: #0f172a;
}

.btn-primary-deploy {
  background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
  color: #ffffff;
  border: 1px solid #0f172a;
  padding: 9px 20px;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.18);
  transition: all 0.15s ease;
}

.btn-primary-deploy:hover {
  background: #1e293b;
  transform: translateY(-1px);
  box-shadow: 0 6px 14px rgba(15, 23, 42, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.25);
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

.fade-in-section {
  animation: fadeIn 0.18s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
