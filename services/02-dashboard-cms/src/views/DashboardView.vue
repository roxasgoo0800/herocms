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
        <!-- VIEW 1: SITUS & KONTAINER DOCKER (PRO-GRADE MULTI-SITE GRID) -->
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

          <!-- High-Density Metric Cards (4 Compact Strips) -->
          <div class="stats-overview-grid">
            <div class="stat-box">
              <div class="stat-box-top">
                <span class="stat-title">KUOTA KONTAINER</span>
                <Server :size="16" color="#2563eb" />
              </div>
              <div class="stat-box-val">{{ usedContainersCount }} <span class="stat-box-denom">/ {{ userPlan.maxContainers }} Aktif</span></div>
              <div class="stat-box-sub text-emerald">● {{ userPlan.maxContainers - usedContainersCount }} slot siap dideploy</div>
            </div>

            <div class="stat-box">
              <div class="stat-box-top">
                <span class="stat-title">EDGE ROUTING TRAEFIK</span>
                <Globe :size="16" color="#059669" />
              </div>
              <div class="stat-box-val">v3.1 Online</div>
              <div class="stat-box-sub">Latensi rerata 1.8ms (Zero-Downtime)</div>
            </div>

            <div class="stat-box">
              <div class="stat-box-top">
                <span class="stat-title">TRAFIK PENGUNJUNG</span>
                <Activity :size="16" color="#9333ea" />
              </div>
              <div class="stat-box-val">3,892 <span class="growth-chip">+28%</span></div>
              <div class="stat-box-sub">Data dicatat via Kafka stream</div>
            </div>

            <div class="stat-box">
              <div class="stat-box-top">
                <span class="stat-title">KEAMANAN TLS / SSL</span>
                <ShieldCheck :size="16" color="#2563eb" />
              </div>
              <div class="stat-box-val">100% Aktif</div>
              <div class="stat-box-sub">Let's Encrypt Wildcard Auto-Renew</div>
            </div>
          </div>

          <!-- Filter & Search Toolbar -->
          <div class="filter-toolbar">
            <div class="search-input-wrap">
              <Search :size="15" class="search-icon" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Cari situs, subdomain, atau container ID..."
                class="search-field"
              />
            </div>

            <div class="filter-chips">
              <button
                class="filter-chip"
                :class="{ active: statusFilter === 'all' }"
                @click="statusFilter = 'all'"
              >
                Semua ({{ containers.length }})
              </button>
              <button
                class="filter-chip"
                :class="{ active: statusFilter === 'running' }"
                @click="statusFilter = 'running'"
              >
                Running ({{ runningContainersCount }})
              </button>
              <button
                class="filter-chip"
                :class="{ active: statusFilter === 'stopped' }"
                @click="statusFilter = 'stopped'"
              >
                Standby ({{ stoppedContainersCount }})
              </button>
            </div>
          </div>

          <!-- Professional 2-Column Responsive Grid (No awkward stretched 1-column lines!) -->
          <div v-if="filteredContainers.length > 0" class="site-cards-grid">
            <div
              v-for="c in filteredContainers"
              :key="c.id"
              class="pro-site-card"
              :class="{ 'card-stopped': c.status === 'stopped' }"
            >
              <!-- Card Top Header -->
              <div class="card-head">
                <div class="site-branding">
                  <div class="site-icon-box" :style="{ backgroundColor: c.accentColor + '15', color: c.accentColor }">
                    <Briefcase v-if="c.category === 'portfolio'" :size="18" />
                    <BookOpen v-else-if="c.category === 'blog'" :size="18" />
                    <GraduationCap v-else-if="c.category === 'education'" :size="18" />
                    <ShoppingBag v-else :size="18" />
                  </div>
                  <div>
                    <h3 class="site-title-text">{{ c.name }}</h3>
                    <span class="site-template-badge">{{ c.templateName }}</span>
                  </div>
                </div>

                <!-- Status Pill -->
                <div
                  class="pro-status-chip"
                  :class="{
                    'status-running': c.status === 'running',
                    'status-stopped': c.status === 'stopped',
                    'status-provisioning': c.status === 'provisioning'
                  }"
                >
                  <span class="dot-indicator"></span>
                  <span v-if="c.status === 'running'">Running</span>
                  <span v-else-if="c.status === 'stopped'">Standby</span>
                  <span v-else>Deploying...</span>
                </div>
              </div>

              <!-- URL Bar with Copy and Link -->
              <div class="site-url-box">
                <div class="url-text-wrap">
                  <Globe :size="13" color="#2563eb" />
                  <span class="url-text">https://{{ c.subdomain }}</span>
                </div>
                <div class="url-actions">
                  <button
                    class="btn-icon-tiny"
                    @click="copyToClipboard(c.subdomain, c.id)"
                    :title="copiedSubdomain === c.id ? 'Tersalin!' : 'Salin URL'"
                  >
                    <Check v-if="copiedSubdomain === c.id" :size="13" color="#059669" />
                    <Copy v-else :size="13" />
                  </button>
                  <a :href="`https://${c.subdomain}`" target="_blank" class="btn-icon-tiny" title="Kunjungi Situs">
                    <ArrowUpRight :size="13" />
                  </a>
                </div>
              </div>

              <!-- Compact Resource Meters (Clean 2-Column Gauge) -->
              <div class="resource-gauges-row">
                <div class="gauge-col">
                  <div class="gauge-meta">
                    <span>CPU: {{ c.cpuUsage }}%</span>
                    <span class="gauge-limit">Limit: {{ c.cpuLimit }}</span>
                  </div>
                  <div class="mini-bar-track">
                    <div
                      class="mini-bar-fill"
                      :style="{
                        width: `${Math.min(c.cpuUsage * 2.5, 100)}%`,
                        backgroundColor: c.status === 'running' ? '#2563eb' : '#94a3b8'
                      }"
                    ></div>
                  </div>
                </div>

                <div class="gauge-col">
                  <div class="gauge-meta">
                    <span>RAM: {{ c.ramUsage }}MB</span>
                    <span class="gauge-limit">Maks: {{ c.ramLimit }}MB</span>
                  </div>
                  <div class="mini-bar-track">
                    <div
                      class="mini-bar-fill"
                      :style="{
                        width: `${(c.ramUsage / c.ramLimit) * 100}%`,
                        backgroundColor: c.status === 'running' ? '#10b981' : '#94a3b8'
                      }"
                    ></div>
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
                  <span>Buka Editor</span>
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
                    title="Hapus Kontainer (Kembalikan Kuota)"
                  >
                    <Trash2 :size="13" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="empty-state-card">
            <Server :size="40" color="#94a3b8" />
            <h3>Tidak ada kontainer ditemukan</h3>
            <p>Pilih template resmi untuk menerbitkan website mandiri Anda di Docker.</p>
            <button class="btn-top-create" @click="openCreateModal()">
              <Plus :size="15" />
              <span>Buat Website Baru</span>
            </button>
          </div>
        </section>

        <!-- ============================================================= -->
        <!-- VIEW 2: EDITOR STUDIO VISUAL (PROFESSIONAL 2-PANE BUILDER)    -->
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
    <div v-if="isCreateModalOpen" class="modal-scrim">
      <div class="modal-card">
        <div class="modal-top">
          <div>
            <h3>Buat Website & Deploy Kontainer Baru</h3>
            <p>Pilih kategori dan tentukan subdomain untuk kontainer baru Anda.</p>
          </div>
          <button class="btn-modal-close" @click="isCreateModalOpen = false"><X :size="16" /></button>
        </div>

        <form @submit.prevent="handleCreateContainer" class="modal-body-form">
          <div class="modal-form-item">
            <label>Pilih Kategori Situs</label>
            <div class="category-grid-selector">
              <label
                class="category-option-card"
                :class="{ active: newSiteForm.category === 'portfolio' }"
                @click="newSiteForm.category = 'portfolio'"
              >
                <Briefcase :size="18" />
                <span>Portofolio Teknis</span>
              </label>
              <label
                class="category-option-card"
                :class="{ active: newSiteForm.category === 'blog' }"
                @click="newSiteForm.category = 'blog'"
              >
                <BookOpen :size="18" />
                <span>Blog & Media</span>
              </label>
              <label
                class="category-option-card"
                :class="{ active: newSiteForm.category === 'education' }"
                @click="newSiteForm.category = 'education'"
              >
                <GraduationCap :size="18" />
                <span>Pusat Edukasi</span>
              </label>
              <label
                class="category-option-card"
                :class="{ active: newSiteForm.category === 'business' }"
                @click="newSiteForm.category = 'business'"
              >
                <ShoppingBag :size="18" />
                <span>Bisnis & Jasa</span>
              </label>
            </div>
          </div>

          <div class="modal-form-item">
            <label>Nama Website / Brand</label>
            <input
              v-model="newSiteForm.name"
              type="text"
              placeholder="Contoh: Portofolio Ahmad, Tech Daily Blog..."
              class="input-pro"
              required
            />
          </div>

          <div class="modal-form-item">
            <label>Subdomain yang Diinginkan</label>
            <div class="subdomain-composite-input">
              <input
                v-model="newSiteForm.subdomain"
                type="text"
                placeholder="nama-situs"
                class="input-pro input-sub-prefix"
                required
              />
              <span class="sub-suffix">.cloudcms.app</span>
            </div>
            <span class="input-note">SSL Let's Encrypt otomatis di-deploy oleh Traefik edge.</span>
          </div>

          <div class="modal-form-item">
            <label>Peran / Slogan Pengenal</label>
            <input
              v-model="newSiteForm.role"
              type="text"
              placeholder="e.g. Senior Software Architect"
              class="input-pro"
            />
          </div>

          <div class="modal-footer-actions">
            <button type="button" class="btn-modal-cancel" @click="isCreateModalOpen = false">Batal</button>
            <button type="submit" class="btn-top-create">
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
   ENTERPRISE DEVELOPER CLOUD CONSOLE (VERCEL / SUPABASE / RAILWAY GRADE)
   ========================================================================== */

.app-shell {
  display: flex;
  min-height: 100vh;
  background: transparent;
  position: relative;
}

/* 1. LEFT SIDEBAR */
.app-sidebar {
  width: 256px;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-right: 1px solid #e2e8f0;
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
  background: #0f172a;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
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
  gap: 2px;
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
  transition: all 0.12s ease;
}

.nav-link:hover:not(:disabled) {
  background: #f1f5f9;
  color: #0f172a;
}

.nav-link.active {
  background: #0f172a;
  color: #ffffff;
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
  background: transparent;
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
  border: none;
  padding: 7px 14px;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: background 0.15s ease;
}

.btn-top-create:hover {
  background: #1e293b;
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

/* Content View (Full Width) */
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

/* 4 Compact Stat Strips */
.stats-overview-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

@media (max-width: 1024px) {
  .stats-overview-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.stat-box {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
}

.stat-box-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.stat-title {
  font-size: 0.68rem;
  font-weight: 700;
  color: #64748b;
  letter-spacing: 0.06em;
}

.stat-box-val {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 6px;
}

.stat-box-denom {
  font-size: 0.78rem;
  font-weight: 500;
  color: #64748b;
}

.stat-box-sub {
  font-size: 0.72rem;
  color: #64748b;
  margin-top: 4px;
}

.text-emerald { color: #059669 !important; }

.growth-chip {
  font-size: 0.7rem;
  background: #ecfdf5;
  color: #059669;
  border: 1px solid #a7f3d0;
  padding: 1px 6px;
  border-radius: 999px;
}

/* Search and Filter Toolbar */
.filter-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}

.search-input-wrap {
  position: relative;
  width: 320px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  pointer-events: none;
}

.search-field {
  width: 100%;
  padding: 8px 12px 8px 34px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.84rem;
  background: #ffffff;
  color: #0f172a;
  outline: none;
}

.search-field:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.filter-chips {
  display: flex;
  gap: 6px;
}

.filter-chip {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  color: #64748b;
  font-size: 0.78rem;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.12s ease;
}

.filter-chip:hover {
  background: #f8fafc;
  color: #0f172a;
}

.filter-chip.active {
  background: #0f172a;
  border-color: #0f172a;
  color: #ffffff;
}

/* 3-Column Site Cards Grid (Matching 3-Container Quota) */
.site-cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
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
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 14px;
  transition: all 0.15s ease;
}

.pro-site-card:hover {
  border-color: #cbd5e1;
  box-shadow: 0 4px 12px -2px rgba(15, 23, 42, 0.06);
}

.pro-site-card.card-stopped {
  background: #fbfcfd;
  border-color: #e2e8f0;
}

.card-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.site-branding {
  display: flex;
  align-items: center;
  gap: 12px;
}

.site-icon-box {
  width: 38px;
  height: 38px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.site-title-text {
  font-size: 0.98rem;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.3;
}

.site-template-badge {
  font-size: 0.72rem;
  color: #64748b;
}

.pro-status-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 9px;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 600;
}

.pro-status-chip.status-running {
  background: #ecfdf5;
  color: #059669;
  border: 1px solid #a7f3d0;
}

.pro-status-chip.status-stopped {
  background: #f1f5f9;
  color: #64748b;
  border: 1px solid #e2e8f0;
}

.pro-status-chip.status-provisioning {
  background: #eff6ff;
  color: #2563eb;
  border: 1px solid #bfdbfe;
}

.dot-indicator {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

/* URL Bar */
.site-url-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  border-radius: 8px;
  padding: 6px 10px;
}

.url-text-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.78rem;
  color: #2563eb;
  font-family: monospace;
}

.url-actions {
  display: flex;
  gap: 4px;
}

.btn-icon-tiny {
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  color: #64748b;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-icon-tiny:hover {
  background: #e2e8f0;
  color: #0f172a;
}

/* Compact 2-Col Gauges */
.resource-gauges-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  padding: 10px 12px;
  background: #fafbfc;
  border-radius: 8px;
  border: 1px solid #f1f5f9;
}

.gauge-col {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.gauge-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.72rem;
  color: #475569;
  font-weight: 600;
}

.gauge-limit {
  font-size: 0.68rem;
  color: #94a3b8;
  font-weight: 400;
}

.mini-bar-track {
  height: 5px;
  background: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
}

.mini-bar-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.3s ease;
}

/* Card Actions Footer */
.card-action-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 10px;
  border-top: 1px solid #f1f5f9;
}

.btn-action-primary {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #0f172a;
  color: #ffffff;
  border: none;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.12s ease;
}

.btn-action-primary:hover {
  background: #1e293b;
}

.runtime-btn-group {
  display: flex;
  gap: 4px;
}

.btn-icon-ctrl {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.12s ease;
}

.btn-icon-ctrl:hover:not(:disabled) {
  background: #f8fafc;
  color: #0f172a;
}

.btn-play {
  color: #059669;
  border-color: #a7f3d0;
  background: #ecfdf5;
}

.btn-pause {
  color: #d97706;
}

.btn-del:hover {
  background: #fef2f2;
  border-color: #fecaca;
  color: #dc2626;
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
  border: none;
  padding: 7px 14px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
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
}

.btn-add-slot:hover {
  background: #f8fafc;
}

/* Modal */
.modal-scrim {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.modal-card {
  background: #ffffff;
  border-radius: 14px;
  width: 100%;
  max-width: 480px;
  padding: 24px;
  box-shadow: 0 20px 40px -10px rgba(15, 23, 42, 0.2);
}

.modal-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.modal-top h3 {
  font-size: 1.15rem;
  color: #0f172a;
}

.modal-top p {
  font-size: 0.78rem;
  color: #64748b;
  margin-top: 2px;
}

.btn-modal-close {
  background: transparent;
  border: none;
  color: #94a3b8;
  cursor: pointer;
}

.modal-body-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.modal-form-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.modal-form-item label {
  font-size: 0.78rem;
  font-weight: 600;
  color: #334155;
}

.category-grid-selector {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}

.category-option-card {
  padding: 8px 10px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: #f8fafc;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.76rem;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
}

.category-option-card.active {
  background: #eff6ff;
  border-color: #bfdbfe;
  color: #2563eb;
}

.subdomain-composite-input {
  display: flex;
  align-items: center;
}

.input-sub-prefix {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.sub-suffix {
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  border-left: none;
  padding: 8px 10px;
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
  font-size: 0.8rem;
  color: #64748b;
  font-family: monospace;
}

.input-note {
  font-size: 0.7rem;
  color: #64748b;
}

.modal-footer-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
  padding-top: 12px;
  border-top: 1px solid #f1f5f9;
}

.btn-modal-cancel {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  padding: 7px 12px;
  border-radius: 6px;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
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
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
