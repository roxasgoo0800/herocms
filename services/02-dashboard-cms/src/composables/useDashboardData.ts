import { ref, computed, watch } from 'vue';
import { studioApi } from '../services/apiClient';
import type {
  ActiveMenu,
  UserPlan,
  ContainerSite,
  ContentArticle,
  MediaAssetItem,
  CustomDomainItem,
  WebhookItem,
  InvoiceItem,
  ToastMessage,
  SupportTicketItem,
  TicketMessage,
  VisualBlock
} from '../types/dashboard';

const VALID_MENUS: ActiveMenu[] = [
  'containers',
  'editor',
  'content',
  'media',
  'templates',
  'domains',
  'analytics',
  'webhooks',
  'billing',
  'invoices',
  'tickets'
];

const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^|;\\s*)' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[2]) : null;
};

const setCookie = (name: string, value: string, days = 30) => {
  if (typeof document === 'undefined') return;
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
};

const resolveInitialMenu = (): ActiveMenu => {
  if (typeof window !== 'undefined') {
    const hash = window.location.hash.replace(/^#/, '') as ActiveMenu;
    if (VALID_MENUS.includes(hash)) {
      return hash;
    }
  }

  const cookieMenu = getCookie('herocms_active_menu') as ActiveMenu;
  if (cookieMenu && VALID_MENUS.includes(cookieMenu)) {
    return cookieMenu;
  }

  if (typeof localStorage !== 'undefined') {
    const localMenu = localStorage.getItem('herocms_active_menu') as ActiveMenu;
    if (localMenu && VALID_MENUS.includes(localMenu)) {
      return localMenu;
    }
  }

  return 'containers';
};

const resolveInitialContainerId = (): string => {
  const cookieId = getCookie('herocms_active_container_id');
  if (cookieId) return cookieId;
  if (typeof localStorage !== 'undefined') {
    const localId = localStorage.getItem('herocms_active_container_id');
    if (localId) return localId;
  }
  return 'hero_tenant_9942';
};

// Active Menu Navigation (Persisted via Cookies, LocalStorage, URL Hash, & Redis)
const activeMenu = ref<ActiveMenu>(resolveInitialMenu());
const isEditorSidebarHidden = ref(true);

// User & Plan State
const userEmail = ref(localStorage.getItem('cloudcms_user_email') || 'admin@rizalpratama.cloud');
const userPlan = ref<UserPlan>({
  name: 'Hero Pro Plan',
  price: 'Rp 149.000 / bln',
  maxContainers: 3,
  cpuPerContainer: '0.5 vCPU',
  ramPerContainer: '256 MB',
  storageQuota: '2 GB SSD'
});

// Toast System
const toastMessage = ref<ToastMessage | null>(null);
const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
  toastMessage.value = { text, type };
  setTimeout(() => {
    toastMessage.value = null;
  }, 3500);
};

// Containers State
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

const activeContainerId = ref<string>(resolveInitialContainerId());
const activeContainer = computed(() => {
  return containers.value.find(c => c.id === activeContainerId.value) || containers.value[0];
});

const activeArticleForReader = ref<ContentArticle | null>(null);
const isReaderSidebarHidden = ref(true);

watch(activeArticleForReader, (newArt) => {
  if (newArt) {
    isReaderSidebarHidden.value = true;
  }
});

// Watch activeMenu and persist across refresh (Cookies, LocalStorage, URL Hash, & Redis)
watch(activeMenu, (newMenu) => {
  if (!VALID_MENUS.includes(newMenu)) return;
  if (newMenu !== 'content') {
    activeArticleForReader.value = null;
  }
  setCookie('herocms_active_menu', newMenu);
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('herocms_active_menu', newMenu);
  }
  if (typeof window !== 'undefined' && window.location.hash !== '#' + newMenu) {
    history.replaceState(null, '', '#' + newMenu);
  }
  studioApi.saveUserState({ activeMenu: newMenu, activeContainerId: activeContainerId.value }).catch(() => {});
}, { immediate: true });

// Watch activeContainerId and persist
watch(activeContainerId, (newId) => {
  if (!newId) return;
  setCookie('herocms_active_container_id', newId);
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('herocms_active_container_id', newId);
  }
  studioApi.saveUserState({ activeMenu: activeMenu.value, activeContainerId: newId }).catch(() => {});
});

// Listen to browser hash changes (Back / Forward navigation)
if (typeof window !== 'undefined') {
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace(/^#/, '') as ActiveMenu;
    if (VALID_MENUS.includes(hash) && activeMenu.value !== hash) {
      activeMenu.value = hash;
    }
  });

  // Background sync with Redis user state
  studioApi.getUserState().then((res: any) => {
    if (res?.state?.activeMenu && VALID_MENUS.includes(res.state.activeMenu)) {
      const currentHash = window.location.hash.replace(/^#/, '');
      if (!currentHash) {
        activeMenu.value = res.state.activeMenu;
      }
    }
    if (res?.state?.activeContainerId) {
      activeContainerId.value = res.state.activeContainerId;
    }
  }).catch(() => {});
}

const usedContainersCount = computed(() => containers.value.length);
const runningContainersCount = computed(() => containers.value.filter(c => c.status === 'running').length);
const stoppedContainersCount = computed(() => containers.value.filter(c => c.status === 'stopped').length);
const isQuotaExceeded = computed(() => containers.value.length >= userPlan.value.maxContainers);

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

// Container Operations
const startContainer = async (container: ContainerSite) => {
  container.status = 'provisioning';
  showToast(`Menjalankan kontainer ${container.id}...`, 'info');
  studioApi.startContainer(container.id).catch(err => console.warn('[API] Start container notice:', err));
  setTimeout(() => {
    container.status = 'running';
    container.cpuUsage = 14;
    container.ramUsage = 82;
    showToast(`Kontainer ${container.name} aktif melayani trafik!`, 'success');
  }, 900);
};

const stopContainer = async (container: ContainerSite) => {
  container.status = 'provisioning';
  showToast(`Menghentikan kontainer ${container.id}...`, 'info');
  studioApi.stopContainer(container.id).catch(err => console.warn('[API] Stop container notice:', err));
  setTimeout(() => {
    container.status = 'stopped';
    container.cpuUsage = 0;
    container.ramUsage = 12;
    showToast(`Kontainer ${container.name} telah dihentikan (standby).`, 'info');
  }, 800);
};

const restartContainer = async (container: ContainerSite) => {
  container.status = 'provisioning';
  showToast(`Me-restart kontainer ${container.id}...`, 'info');
  studioApi.startContainer(container.id).catch(err => console.warn('[API] Restart container notice:', err));
  setTimeout(() => {
    container.status = 'running';
    container.cpuUsage = 15;
    container.ramUsage = 86;
    showToast(`Kontainer ${container.name} sehat setelah reboot!`, 'success');
  }, 1100);
};

const deleteContainer = async (container: ContainerSite) => {
  if (confirm(`Hapus kontainer '${container.name}'? Slot kuota (${containers.value.length}/${userPlan.value.maxContainers}) akan dikembalikan.`)) {
    const idx = containers.value.findIndex(c => c.id === container.id);
    if (idx !== -1) {
      const deletedId = container.id;
      containers.value.splice(idx, 1);
      showToast(`Kontainer ${deletedId} dihapus. Kuota kini ${containers.value.length}/${userPlan.value.maxContainers}.`, 'info');
      if (containers.value.length > 0) {
        activeContainerId.value = containers.value[0].id;
      }
      studioApi.deleteContainer(deletedId).catch(err => console.warn('[API] Delete container notice:', err));
    }
  }
};

// Modals for Containers
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
    status: 'provisioning',
    cpuUsage: 4,
    ramUsage: 36,
    ramLimit: 256,
    cpuLimit: '0.5 vCPU',
    uptime: 'Inisialisasi...',
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
  activeMenu.value = 'containers';
  showToast(`Mengalokasikan kontainer ${newId} & mendaftarkan rute Traefik...`, 'info');

  studioApi.createContainer({
    name: newSiteForm.value.name,
    subdomain: cleanSubdomain,
    category: newSiteForm.value.category,
    role: newSiteForm.value.role
  }).catch(err => console.warn('[API] Create container backend sync notice:', err));

  setTimeout(() => {
    newContainerObj.status = 'running';
    newContainerObj.cpuUsage = 14;
    newContainerObj.ramUsage = 72;
    newContainerObj.uptime = 'Baru saja running';
    showToast(`Kontainer '${newContainerObj.name}' aktif! Rute siap di https://${newContainerObj.subdomain}`, 'success');
  }, 1400);
};

// Runtime Logs Modal
const isLogsModalOpen = ref(false);
const activeLogContainer = ref<ContainerSite | null>(null);

const openLogsModal = (container: ContainerSite) => {
  activeLogContainer.value = container;
  isLogsModalOpen.value = true;
};

const copyContainerLogs = () => {
  if (!activeLogContainer.value) return;
  const logText = `[docker-cgroups] Container ${activeLogContainer.value.id} (${activeLogContainer.value.subdomain})\nStatus: ${activeLogContainer.value.status}\nTraefik v3 Edge Proxy: Online TLS 1.3\nCPU: ${activeLogContainer.value.cpuUsage}% / ${activeLogContainer.value.cpuLimit}\nRAM: ${activeLogContainer.value.ramUsage} MB / ${activeLogContainer.value.ramLimit} MB`;
  navigator.clipboard.writeText(logText);
  showToast('Log kontainer disalin ke clipboard!', 'info');
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

const handlePublishChanges = async () => {
  if (!activeContainer.value) return;
  isPublishing.value = true;
  try {
    const payload = {
      roleOrHeadline: activeContainer.value.roleOrHeadline,
      bioIntro: activeContainer.value.bioIntro,
      accentColor: activeContainer.value.accentColor,
      themeConfig: activeContainer.value.themeConfig || {}
    };
    await studioApi.saveSiteDesign(activeContainer.value.id, payload);
    activeContainer.value.lastDeployed = 'Baru saja';
    showToast(`Perubahan desain '${activeContainer.value.name}' berhasil disimpan ke PostgreSQL & disinkronkan live!`, 'success');
  } catch (err: any) {
    console.error('[STUDIO SAVE ERROR]', err);
    activeContainer.value.lastDeployed = 'Baru saja (lokal)';
    showToast(`Perubahan disimpan lokal: ${err?.message || 'Sinkronisasi offline'}`, 'info');
  } finally {
    isPublishing.value = false;
  }
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

// Invoices State
const invoices = ref<InvoiceItem[]>([
  {
    id: 'INV-2026-09-0891',
    date: '15 Sep 2026',
    dueDate: '22 Sep 2026',
    planName: 'Hero Pro Plan (Multi-Tenant Docker)',
    period: '15 Sep 2026 - 15 Okt 2026',
    amount: 149000,
    tax: 16390,
    total: 165390,
    status: 'paid',
    paymentMethod: 'BCA Virtual Account (Auto-Debit)',
    containerQuota: 3
  },
  {
    id: 'INV-2026-08-0412',
    date: '15 Agu 2026',
    dueDate: '22 Agu 2026',
    planName: 'Hero Pro Plan (Multi-Tenant Docker)',
    period: '15 Agu 2026 - 15 Sep 2026',
    amount: 149000,
    tax: 16390,
    total: 165390,
    status: 'paid',
    paymentMethod: 'QRIS Gopay / ShopeePay',
    containerQuota: 3
  },
  {
    id: 'INV-2026-07-0098',
    date: '15 Jul 2026',
    dueDate: '22 Jul 2026',
    planName: 'Hero Starter Plan (Single Container)',
    period: '15 Jul 2026 - 15 Agu 2026',
    amount: 69000,
    tax: 7590,
    total: 76590,
    status: 'paid',
    paymentMethod: 'Kartu Kredit Mandiri Visa',
    containerQuota: 1
  }
]);

const selectedInvoice = ref<InvoiceItem | null>(null);
const isInvoiceDetailModalOpen = ref(false);

const openInvoiceDetail = (inv: InvoiceItem) => {
  selectedInvoice.value = inv;
  isInvoiceDetailModalOpen.value = true;
};

const downloadInvoiceReceipt = (inv: InvoiceItem) => {
  const invoiceText = `=======================================================
           HEROCMS CLOUD PLATFORM PT
     FAKTUR TAGIHAN RESMI (OFFICIAL TAX INVOICE)
=======================================================
No. Faktur     : ${inv.id}
Tanggal        : ${inv.date}
Jatuh Tempo    : ${inv.dueDate}
Pelanggan      : Rizal Pratama (${userEmail.value})
Status         : LUNAS / PAID (Terverifikasi Bank)
Metode Bayar   : ${inv.paymentMethod}
-------------------------------------------------------
RINCIAN LAYANAN:
1. ${inv.planName}
   Periode: ${inv.period}
   Kapasitas: ${inv.containerQuota} Kontainer Docker (cgroups v2)
   Harga Dasar     : Rp ${inv.amount.toLocaleString('id-ID')}
   PPN (11%)       : Rp ${inv.tax.toLocaleString('id-ID')}
-------------------------------------------------------
TOTAL DIBAYAR      : Rp ${inv.total.toLocaleString('id-ID')}
=======================================================
Dokumen ini sah dan diterbitkan secara digital oleh
sistem penagihan otomatis HeroCMS Cloud Platform.`;

  const blob = new Blob([invoiceText], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Faktur-HeroCMS-${inv.id}.txt`;
  link.click();
  URL.revokeObjectURL(url);
  showToast(`Faktur ${inv.id} berhasil diunduh!`, 'success');
};

// Custom Domains State
const customDomains = ref<CustomDomainItem[]>([
  {
    id: 'dom_1',
    domain: 'rizalpratama.cloud',
    targetContainer: 'Portofolio Rizal Pratama',
    containerId: 'hero_tenant_9942',
    status: 'active',
    sslStatus: 'issued',
    cnameRecord: 'edge.cloudcms.app',
    aRecord: '103.144.20.1',
    addedDate: '12 Sep 2026'
  }
]);

const newDomainInput = ref('');
const targetContainerForDomain = ref('hero_tenant_9942');

const handleAddDomain = () => {
  if (!newDomainInput.value.trim()) {
    showToast('Masukkan nama domain Anda (misal: perusahaan.id)', 'error');
    return;
  }
  const cleanDom = newDomainInput.value.toLowerCase().trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  const matched = containers.value.find(c => c.id === targetContainerForDomain.value);
  const newDomObj: CustomDomainItem = {
    id: `dom_${Date.now()}`,
    domain: cleanDom,
    targetContainer: matched ? matched.name : 'Portofolio Rizal Pratama',
    containerId: targetContainerForDomain.value,
    status: 'verifying',
    sslStatus: 'pending',
    cnameRecord: 'edge.cloudcms.app',
    aRecord: '103.144.20.1',
    addedDate: 'Baru saja'
  };
  customDomains.value.push(newDomObj);
  newDomainInput.value = '';
  showToast(`Domain ${cleanDom} didaftarkan! Menguji propagasi DNS Traefik...`, 'info');
  setTimeout(() => {
    newDomObj.status = 'active';
    newDomObj.sslStatus = 'issued';
    showToast(`Domain ${cleanDom} terverifikasi & SSL TLS 1.3 Let's Encrypt aktif!`, 'success');
  }, 1600);
};

const deleteDomain = (dom: CustomDomainItem) => {
  if (confirm(`Putuskan tautan domain '${dom.domain}' dari kontainer?`)) {
    const idx = customDomains.value.findIndex(d => d.id === dom.id);
    if (idx !== -1) {
      customDomains.value.splice(idx, 1);
      showToast(`Domain ${dom.domain} telah dilepas dari routing Traefik.`, 'info');
    }
  }
};

// Content Articles State
const articles = ref<ContentArticle[]>([
  {
    id: 'art_1',
    title: 'Arsitektur Multi-Tenant dengan Docker & Go',
    slug: 'arsitektur-multi-tenant-docker-go',
    siteName: 'Portofolio Rizal Pratama',
    containerId: 'hero_tenant_9942',
    category: 'Engineering',
    author: 'Rizal Pratama',
    views: 1420,
    status: 'published',
    publishedAt: '16 Sep 2026'
  },
  {
    id: 'art_2',
    title: 'Penyelarasan Telemetri Real-Time dengan Kafka',
    slug: 'telemetri-real-time-kafka',
    siteName: 'Portofolio Rizal Pratama',
    containerId: 'hero_tenant_9942',
    category: 'Distributed Systems',
    author: 'Rizal Pratama',
    views: 890,
    status: 'published',
    publishedAt: '14 Sep 2026'
  },
  {
    id: 'art_3',
    title: 'Mengoptimalkan TTFB Edge Traefik v3 hingga Sub-2ms',
    slug: 'optimasi-ttfb-edge-traefik',
    siteName: 'Portofolio Rizal Pratama',
    containerId: 'hero_tenant_9942',
    category: 'DevOps',
    author: 'Rizal Pratama',
    views: 610,
    status: 'published',
    publishedAt: '10 Sep 2026'
  },
  {
    id: 'art_4',
    title: 'Panduan Membangun Website Portfolio Modern dengan Headless CMS',
    slug: 'panduan-portfolio-headless-cms',
    siteName: 'Portofolio Rizal Pratama',
    containerId: 'hero_tenant_9942',
    category: 'Tutorial',
    author: 'Rizal Pratama',
    views: 0,
    status: 'draft',
    publishedAt: 'Draft'
  },
  {
    id: 'art_5',
    title: 'Isolasi Resource cgroups v2 Kernel Linux untuk Multi-Tenant',
    slug: 'isolasi-resource-cgroups-v2',
    siteName: 'Portofolio Rizal Pratama',
    containerId: 'hero_tenant_9942',
    category: 'Engineering',
    author: 'Rizal Pratama',
    views: 420,
    status: 'published',
    publishedAt: '08 Sep 2026'
  },
  {
    id: 'art_6',
    title: 'Pencegahan DDoS & Rate Limiting dengan Traefik Middleware',
    slug: 'pencegahan-ddos-rate-limiting-traefik',
    siteName: 'Portofolio Rizal Pratama',
    containerId: 'hero_tenant_9942',
    category: 'Security',
    author: 'Rizal Pratama',
    views: 350,
    status: 'published',
    publishedAt: '05 Sep 2026'
  }
]);

const isCreateArticleModalOpen = ref(false);
const newArticleForm = ref({
  title: '',
  category: 'Engineering',
  status: 'published' as 'published' | 'draft'
});

const handleCreateArticle = () => {
  if (!newArticleForm.value.title.trim()) {
    showToast('Judul artikel wajib diisi.', 'error');
    return;
  }
  const slug = newArticleForm.value.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const newArt: ContentArticle = {
    id: `art_${Date.now()}`,
    title: newArticleForm.value.title,
    slug,
    siteName: activeContainer.value ? activeContainer.value.name : 'Portofolio Rizal Pratama',
    containerId: activeContainer.value ? activeContainer.value.id : 'hero_tenant_9942',
    category: newArticleForm.value.category,
    author: 'Rizal Pratama',
    views: 0,
    status: newArticleForm.value.status,
    publishedAt: newArticleForm.value.status === 'published' ? 'Baru saja' : 'Draft'
  };
  articles.value.unshift(newArt);
  isCreateArticleModalOpen.value = false;
  newArticleForm.value.title = '';
  showToast(`Artikel '${newArt.title}' berhasil disimpan!`, 'success');
};

const deleteArticle = (art: ContentArticle) => {
  if (confirm(`Hapus artikel '${art.title}'?`)) {
    const idx = articles.value.findIndex(a => a.id === art.id);
    if (idx !== -1) {
      articles.value.splice(idx, 1);
      showToast(`Artikel '${art.title}' dihapus.`, 'info');
    }
  }
};

// Media Assets State
const mediaAssets = ref<MediaAssetItem[]>([
  {
    id: 'med_1',
    name: 'hero-banner-developer.webp',
    size: '84 KB',
    type: 'WEBP',
    dimensions: '1920x1080',
    uploadedAt: '18 Sep 2026',
    url: 'https://cdn.cloudcms.app/assets/hero-banner.webp'
  },
  {
    id: 'med_2',
    name: 'laporan-keuangan-q3-2026.xlsx',
    size: '245 KB',
    type: 'XLSX',
    dimensions: 'Spreadsheet (14 Kolom)',
    uploadedAt: '17 Sep 2026',
    url: 'https://cdn.cloudcms.app/assets/laporan-keuangan-q3-2026.xlsx'
  },
  {
    id: 'med_3',
    name: 'arsitektur-sistem-cloudcms.pdf',
    size: '1.4 MB',
    type: 'PDF',
    dimensions: 'Dokumen PDF (18 Hal)',
    uploadedAt: '16 Sep 2026',
    url: 'https://cdn.cloudcms.app/assets/arsitektur-sistem-cloudcms.pdf'
  },
  {
    id: 'med_4',
    name: 'avatar-profile-rizal.jpg',
    size: '42 KB',
    type: 'JPEG',
    dimensions: '800x800',
    uploadedAt: '15 Sep 2026',
    url: 'https://cdn.cloudcms.app/assets/avatar.jpg'
  },
  {
    id: 'med_5',
    name: 'sop-deployment-kontainer.docx',
    size: '88 KB',
    type: 'DOCX',
    dimensions: 'Dokumen Word (6 Hal)',
    uploadedAt: '14 Sep 2026',
    url: 'https://cdn.cloudcms.app/assets/sop-deployment-kontainer.docx'
  },
  {
    id: 'med_6',
    name: 'traefik-architecture-diagram.png',
    size: '156 KB',
    type: 'PNG',
    dimensions: '1440x900',
    uploadedAt: '12 Sep 2026',
    url: 'https://cdn.cloudcms.app/assets/diagram.png'
  },
  {
    id: 'med_7',
    name: 'brand-logo-white.svg',
    size: '8 KB',
    type: 'SVG',
    dimensions: 'Vector',
    uploadedAt: '10 Sep 2026',
    url: 'https://cdn.cloudcms.app/assets/logo.svg'
  }
]);

const uploadMediaFiles = (files: FileList | File[]) => {
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const ext = file.name.split('.').pop()?.toUpperCase() || 'FILE';
    let sizeStr = `${(file.size / 1024).toFixed(0)} KB`;
    if (file.size > 1024 * 1024) {
      sizeStr = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
    }

    let dimensionStr = 'Dokumen S3';
    if (['PNG', 'JPG', 'JPEG', 'WEBP', 'AVIF'].includes(ext)) {
      dimensionStr = 'Raster Image';
    } else if (ext === 'SVG') {
      dimensionStr = 'Vector';
    } else if (ext === 'PDF') {
      dimensionStr = 'Dokumen PDF';
    } else if (['XLSX', 'XLS', 'CSV'].includes(ext)) {
      dimensionStr = 'Spreadsheet Excel';
    } else if (['DOCX', 'DOC'].includes(ext)) {
      dimensionStr = 'Dokumen Word';
    }

    const newAsset: MediaAssetItem = {
      id: `med_${Date.now()}_${i}`,
      name: file.name,
      size: sizeStr,
      type: ext,
      dimensions: dimensionStr,
      uploadedAt: 'Baru saja',
      url: `https://cdn.cloudcms.app/assets/${encodeURIComponent(file.name)}`
    };
    mediaAssets.value.unshift(newAsset);
  }
  showToast(`${files.length} file berhasil diunggah ke S3 MinIO & di-cache di Traefik edge!`, 'success');
};

const uploadMediaDemo = () => {
  const fakeFiles = [
    { name: 'laporan-performa-q4.xlsx', size: '310 KB', type: 'XLSX', dim: 'Spreadsheet Excel (8 Sheet)' },
    { name: 'whitepaper-edge-architecture.pdf', size: '2.1 MB', type: 'PDF', dim: 'Dokumen PDF (32 Hal)' },
    { name: 'spesifikasi-kebutuhan-software.docx', size: '142 KB', type: 'DOCX', dim: 'Dokumen Word (12 Hal)' },
    { name: 'diagram-topologi-jaringan.png', size: '420 KB', type: 'PNG', dim: '1920x1080' },
    { name: 'banner-event-tech-summit.webp', size: '94 KB', type: 'WEBP', dim: '1200x630' }
  ];
  const picked = fakeFiles[Math.floor(Math.random() * fakeFiles.length)];
  const newAsset: MediaAssetItem = {
    id: `med_${Date.now()}`,
    name: picked.name,
    size: picked.size,
    type: picked.type,
    dimensions: picked.dim,
    uploadedAt: 'Baru saja',
    url: `https://cdn.cloudcms.app/assets/${picked.name}`
  };
  mediaAssets.value.unshift(newAsset);
  showToast(`File ${picked.name} (${picked.type}) terunggah ke S3 bucket & terindeks!`, 'success');
};

const deleteMedia = (med: MediaAssetItem) => {
  const idx = mediaAssets.value.findIndex(m => m.id === med.id);
  if (idx !== -1) {
    mediaAssets.value.splice(idx, 1);
    showToast(`Media ${med.name} dihapus dari S3 bucket.`, 'info');
  }
};

// Webhooks & API Keys State
const webhooks = ref<WebhookItem[]>([
  {
    id: 'wh_1',
    name: 'Discord Notification Bot',
    url: 'https://discord.com/api/webhooks/12894.../hero-alerts',
    events: ['site.deployed', 'form.submitted'],
    status: 'active',
    lastTriggered: '10 menit lalu'
  },
  {
    id: 'wh_2',
    name: 'Slack Dev Channel Ingress',
    url: 'https://hooks.slack.com/services/T00/B00/XXXXX',
    events: ['site.deployed', 'traffic.anomaly'],
    status: 'active',
    lastTriggered: '1 jam lalu'
  }
]);

const apiKey = ref('hero_sec_live_9942a8b9c1d2e3f4g5h6');
const isApiKeyRevealed = ref(false);

const copyApiKey = () => {
  navigator.clipboard.writeText(apiKey.value);
  showToast('API Key disalin ke clipboard!', 'info');
};

const testWebhook = (wh: WebhookItem) => {
  showToast(`Mengirim ping uji coba ke ${wh.name}...`, 'info');
  setTimeout(() => {
    wh.lastTriggered = 'Baru saja';
    showToast(`Webhook ${wh.name} sukses merespon HTTP 200 OK!`, 'success');
  }, 1000);
};

// Support Ticketing State
const supportTickets = ref<SupportTicketItem[]>([
  {
    id: 'TKT-8921',
    subject: 'Bantuan Penyetelan Custom SSL Wildcard di Edge Traefik v3',
    category: 'Edge Proxy & DNS',
    priority: 'p2_high',
    status: 'in_progress',
    createdAt: '18 Sep 2026, 14:20',
    lastUpdated: '10 menit lalu',
    assignedEngineer: 'Budi Hartono (L2 Cloud DevOps)',
    messages: [
      {
        id: 'msg_1',
        sender: 'tenant',
        authorName: 'Rizal Pratama',
        authorRole: 'Tenant Administrator',
        timestamp: '18 Sep 2026, 14:20',
        message: 'Halo tim support HeroCMS, saya baru saja mengarahkan CNAME *.rizalpratama.cloud ke ingress edge Traefik (103.144.20.12). Namun status verifikasi SSL di dashboard masih pending. Mohon bantuan inspeksi log Let\'s Encrypt ALPN challenge.'
      },
      {
        id: 'msg_2',
        sender: 'support',
        authorName: 'Budi Hartono',
        authorRole: 'L2 Cloud DevOps Engineer',
        timestamp: '18 Sep 2026, 14:35',
        message: 'Halo Pak Rizal, terima kasih telah menghubungi tim support. Kami sudah melakukan pengecekan pada Traefik dynamic configuration. Propagasi DNS Anda sudah terdeteksi di edge node Jakarta. Sertifikat TLS 1.3 wildcard sedang dalam proses issue otomatis, estimasi selesai dalam 5-10 menit ke depan.'
      }
    ]
  },
  {
    id: 'TKT-8410',
    subject: 'Permintaan Penambahan Kuota MinIO S3 Storage ke 5GB',
    category: 'Infrastructure & Container',
    priority: 'p3_normal',
    status: 'resolved',
    createdAt: '15 Sep 2026, 09:10',
    lastUpdated: '15 Sep 2026, 11:30',
    assignedEngineer: 'Siti Rahma (Storage Infrastructure Admin)',
    messages: [
      {
        id: 'msg_3',
        sender: 'tenant',
        authorName: 'Rizal Pratama',
        authorRole: 'Tenant Administrator',
        timestamp: '15 Sep 2026, 09:10',
        message: 'Selamat pagi, media PDF dan dokumen presentasi kami bertambah. Bisakah alokasi MinIO S3 kami dinaikkan dari 2GB ke 5GB?'
      },
      {
        id: 'msg_4',
        sender: 'support',
        authorName: 'Siti Rahma',
        authorRole: 'Storage Infrastructure Admin',
        timestamp: '15 Sep 2026, 11:30',
        message: 'Halo Pak Rizal, penambahan kuota bucket S3 MinIO tenant-9942 sebesar 3GB tambahan telah disetujui dan dialokasikan ke storage cluster NVMe. Kuota efektif sekarang 5GB.'
      }
    ]
  },
  {
    id: 'TKT-8102',
    subject: 'Rekonsiliasi Faktur Pajak E-Faktur Masa Agustus 2026',
    category: 'Billing & Pajak',
    priority: 'p3_normal',
    status: 'resolved',
    createdAt: '16 Agu 2026, 13:00',
    lastUpdated: '17 Agu 2026, 10:15',
    assignedEngineer: 'Hendra Wijaya (Finance Compliance)',
    messages: [
      {
        id: 'msg_5',
        sender: 'tenant',
        authorName: 'Rizal Pratama',
        authorRole: 'Tenant Administrator',
        timestamp: '16 Agu 2026, 13:00',
        message: 'Mohon konfirmasi e-faktur PPN 11% untuk invoice INV-2026-08-0412 apakah sudah terunggah ke DJP online?'
      },
      {
        id: 'msg_6',
        sender: 'support',
        authorName: 'Hendra Wijaya',
        authorRole: 'Finance Compliance',
        timestamp: '17 Agu 2026, 10:15',
        message: 'Faktur pajak elektronik dengan NSFP 010.021-26.9942001 telah berhasil divalidasi oleh sistem DJP. File faktur resmi dapat langsung diunduh pada menu Faktur & Invoice.'
      }
    ]
  },
  {
    id: 'TKT-9042',
    subject: 'Integrasi Webhook Discord Payload dengan Traefik TLS Alerts',
    category: 'API & Webhooks',
    priority: 'p2_high',
    status: 'open',
    createdAt: 'Hari ini, 09:45',
    lastUpdated: 'Baru saja',
    messages: [
      {
        id: 'msg_7',
        sender: 'tenant',
        authorName: 'Rizal Pratama',
        authorRole: 'Tenant Administrator',
        timestamp: 'Hari ini, 09:45',
        message: 'Kami ingin menambahkan custom bot alert saat SSL mendekati 7 hari sebelum expiry. Apakah signature HMAC-SHA256 mendukung header webhook Discord kustom?'
      }
    ]
  }
]);

const selectedTicket = ref<SupportTicketItem | null>(null);
const isCreateTicketModalOpen = ref(false);
const isTicketDetailModalOpen = ref(false);
const ticketReplyText = ref('');

const newTicketForm = ref({
  subject: '',
  category: 'Infrastructure & Container' as SupportTicketItem['category'],
  priority: 'p2_high' as SupportTicketItem['priority'],
  message: ''
});

const openCreateTicketModal = () => {
  newTicketForm.value = {
    subject: '',
    category: 'Infrastructure & Container',
    priority: 'p2_high',
    message: ''
  };
  isCreateTicketModalOpen.value = true;
};

const handleCreateTicket = () => {
  if (!newTicketForm.value.subject || !newTicketForm.value.message) {
    showToast('Harap isi judul dan deskripsi tiket bantuan.', 'error');
    return;
  }

  const newTicketId = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;
  const newTicket: SupportTicketItem = {
    id: newTicketId,
    subject: newTicketForm.value.subject,
    category: newTicketForm.value.category,
    priority: newTicketForm.value.priority,
    status: 'open',
    createdAt: 'Baru saja',
    lastUpdated: 'Baru saja',
    messages: [
      {
        id: `msg_${Date.now()}`,
        sender: 'tenant',
        authorName: 'Rizal Pratama',
        authorRole: 'Tenant Administrator',
        timestamp: 'Baru saja',
        message: newTicketForm.value.message
      }
    ]
  };

  supportTickets.value.unshift(newTicket);
  isCreateTicketModalOpen.value = false;
  showToast(`Tiket ${newTicketId} berhasil dibuat! Tim DevOps akan merespons dalam < 15 menit.`, 'success');
};

const openTicketDetail = (ticket: SupportTicketItem) => {
  selectedTicket.value = ticket;
  ticketReplyText.value = '';
  isTicketDetailModalOpen.value = true;
};

const sendTicketReply = () => {
  if (!ticketReplyText.value.trim() || !selectedTicket.value) return;

  const newMsg: TicketMessage = {
    id: `msg_${Date.now()}`,
    sender: 'tenant',
    authorName: 'Rizal Pratama',
    authorRole: 'Tenant Administrator',
    timestamp: 'Baru saja',
    message: ticketReplyText.value.trim()
  };

  selectedTicket.value.messages.push(newMsg);
  selectedTicket.value.lastUpdated = 'Baru saja';
  ticketReplyText.value = '';
  showToast('Balasan terkirim ke tiket support.', 'success');

  if (selectedTicket.value.status === 'open') {
    setTimeout(() => {
      if (selectedTicket.value) {
        selectedTicket.value.status = 'in_progress';
        selectedTicket.value.assignedEngineer = 'Budi Hartono (L2 Cloud DevOps)';
        selectedTicket.value.messages.push({
          id: `msg_${Date.now() + 1}`,
          sender: 'support',
          authorName: 'Budi Hartono',
          authorRole: 'L2 Cloud DevOps Engineer',
          timestamp: 'Baru saja',
          message: 'Pesan Anda sudah diterima. Kami sedang menguji replikasi isu pada staging environment.'
        });
        showToast('Tim Support merespons tiket Anda!', 'info');
      }
    }, 2000);
  }
};

const resolveTicket = (ticket: SupportTicketItem) => {
  ticket.status = 'resolved';
  ticket.lastUpdated = 'Baru saja';
  showToast(`Tiket ${ticket.id} ditandai sebagai Selesai / Resolved.`, 'success');
};

// Backend API Synchronization & Redis Warmup
const isBackendSyncing = ref(false);
const syncWithBackend = async (_options?: { forceWarmRedis?: boolean }) => {
  try {
    isBackendSyncing.value = true;

    // 1. Primary Strategy: Warm all menus in Redis & receive unified bundle
    try {
      const warmRes = await studioApi.warmAllMenusCache();
      if (warmRes?.bundle) {
        const b = warmRes.bundle;
        if (b.containers?.containers?.length) {
          containers.value = b.containers.containers;
          if (b.containers.quota?.max) {
            userPlan.value.maxContainers = b.containers.quota.max;
          }
        }
        if (b.articles?.articles?.length) {
          articles.value = b.articles.articles;
        }
        if (Array.isArray(b.assets?.assets) && b.assets.assets.length) {
          mediaAssets.value = b.assets.assets;
        }
        if (b.domains?.domains?.length) {
          customDomains.value = b.domains.domains;
        }
        if (b.tickets?.tickets?.length) {
          supportTickets.value = b.tickets.tickets;
        }
        if (b.invoices?.invoices?.length) {
          invoices.value = b.invoices.invoices;
        }
        if (b.webhooks?.webhooks?.length) {
          webhooks.value = b.webhooks.webhooks;
        }
        if (b.quota?.plan?.name) {
          userPlan.value = {
            name: b.quota.plan.name,
            price: b.quota.plan.price || 'Rp 149.000 / bln',
            maxContainers: b.quota.plan.maxContainers || 3,
            cpuPerContainer: '0.5 vCPU',
            ramPerContainer: '256 MB',
            storageQuota: '2 GB SSD'
          };
        }

        // Persist to local cache for instant zero-latency loads
        try {
          localStorage.setItem('herocms_dashboard_cache', JSON.stringify({
            timestamp: Date.now(),
            containers: containers.value,
            articles: articles.value,
            mediaAssets: mediaAssets.value,
            customDomains: customDomains.value,
            supportTickets: supportTickets.value,
            invoices: invoices.value,
            webhooks: webhooks.value,
            userPlan: userPlan.value
          }));
        } catch (e) {
          // Ignored
        }

        console.info('[CACHE] Redis cache and local state successfully warmed!');
        return;
      }
    } catch (warmErr) {
      console.warn('[CACHE NOTICE] Single-shot Redis warmup endpoint deferred, falling back to parallel fetch:', warmErr);
    }

    // 2. Secondary Strategy: Parallel fetch across individual endpoints
    const [cRes, aRes, mRes, dRes, tRes, iRes, wRes] = await Promise.allSettled([
      studioApi.getContainers(),
      studioApi.getArticles(),
      studioApi.getAssets(),
      studioApi.getDomains(),
      studioApi.getTickets(),
      studioApi.getInvoices(),
      studioApi.getWebhooks()
    ]);

    if (cRes.status === 'fulfilled' && cRes.value?.containers?.length) {
      containers.value = cRes.value.containers;
      if (cRes.value.quota?.max) {
        userPlan.value.maxContainers = cRes.value.quota.max;
      }
    }
    if (aRes.status === 'fulfilled' && aRes.value?.articles?.length) {
      articles.value = aRes.value.articles;
    }
    if (mRes.status === 'fulfilled' && Array.isArray(mRes.value?.assets) && mRes.value.assets.length) {
      mediaAssets.value = mRes.value.assets;
    }
    if (dRes.status === 'fulfilled' && dRes.value?.domains?.length) {
      customDomains.value = dRes.value.domains;
    }
    if (tRes.status === 'fulfilled' && tRes.value?.tickets?.length) {
      supportTickets.value = tRes.value.tickets;
    }
    if (iRes.status === 'fulfilled' && iRes.value?.invoices?.length) {
      invoices.value = iRes.value.invoices;
    }
    if (wRes.status === 'fulfilled' && wRes.value?.webhooks?.length) {
      webhooks.value = wRes.value.webhooks;
    }

    // Persist fresh server state to local cache for instant zero-latency loads
    try {
      localStorage.setItem('herocms_dashboard_cache', JSON.stringify({
        timestamp: Date.now(),
        containers: containers.value,
        articles: articles.value,
        mediaAssets: mediaAssets.value,
        customDomains: customDomains.value,
        supportTickets: supportTickets.value,
        invoices: invoices.value,
        webhooks: webhooks.value,
        userPlan: userPlan.value
      }));
    } catch (e) {
      // Ignored
    }
  } catch (err) {
    console.warn('[SYNC NOTICE] Backend sync deferred:', err);
  } finally {
    isBackendSyncing.value = false;
  }
};

// Immediate cache hydration for instant zero-latency rendering
const hydrateFromCache = () => {
  try {
    const raw = localStorage.getItem('herocms_dashboard_cache');
    if (raw) {
      const data = JSON.parse(raw);
      if (Array.isArray(data.containers) && data.containers.length) containers.value = data.containers;
      if (Array.isArray(data.articles) && data.articles.length) articles.value = data.articles;
      if (Array.isArray(data.mediaAssets) && data.mediaAssets.length) mediaAssets.value = data.mediaAssets;
      if (Array.isArray(data.customDomains) && data.customDomains.length) customDomains.value = data.customDomains;
      if (Array.isArray(data.supportTickets) && data.supportTickets.length) supportTickets.value = data.supportTickets;
      if (Array.isArray(data.invoices) && data.invoices.length) invoices.value = data.invoices;
      if (Array.isArray(data.webhooks) && data.webhooks.length) webhooks.value = data.webhooks;
      if (data.userPlan?.name) userPlan.value = data.userPlan;
    }
  } catch (e) {
    // Graceful fallback to default values
  }
};

hydrateFromCache();

export function useDashboardData() {
  return {
    isBackendSyncing,
    syncWithBackend,
    activeMenu,
    isEditorSidebarHidden,
    userEmail,
    userPlan,
    toastMessage,
    showToast,
    containers,
    activeContainerId,
    activeContainer,
    usedContainersCount,
    runningContainersCount,
    stoppedContainersCount,
    isQuotaExceeded,
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
    officialTemplates,
    editorDevice,
    isPublishing,
    handlePublishChanges,
    isGeneratingAI,
    aiPromptInput,
    handleAiGenerateContent,
    invoices,
    selectedInvoice,
    isInvoiceDetailModalOpen,
    openInvoiceDetail,
    downloadInvoiceReceipt,
    customDomains,
    newDomainInput,
    targetContainerForDomain,
    handleAddDomain,
    deleteDomain,
    articles,
    activeArticleForReader,
    isReaderSidebarHidden,
    isCreateArticleModalOpen,
    newArticleForm,
    handleCreateArticle,
    deleteArticle,
    mediaAssets,
    uploadMediaDemo,
    uploadMediaFiles,
    deleteMedia,
    webhooks,
    apiKey,
    isApiKeyRevealed,
    copyApiKey,
    testWebhook,
    supportTickets,
    selectedTicket,
    isCreateTicketModalOpen,
    isTicketDetailModalOpen,
    ticketReplyText,
    newTicketForm,
    openCreateTicketModal,
    handleCreateTicket,
    openTicketDetail,
    sendTicketReply,
    resolveTicket
  };
}

export type { VisualBlock };
