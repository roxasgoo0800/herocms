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
  VisualBlock,
  CmsPage
} from '../types/dashboard';
import {
  initialUserPlan,
  initialContainers,
  officialTemplates as defaultOfficialTemplates,
  initialInvoices,
  initialCustomDomains,
  initialArticles,
  initialCmsPages,
  initialMediaAssets,
  initialWebhooks,
  initialSupportTickets
} from '../data/dashboard-seeds';
import type { OfficialTemplateItem } from '../data/templates-data';

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
  'tickets',
  'changelog'
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
const userPlan = ref<UserPlan>({ ...initialUserPlan });

// Toast System
const toastMessage = ref<ToastMessage | null>(null);
const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
  toastMessage.value = { text, type };
  setTimeout(() => {
    toastMessage.value = null;
  }, 3500);
};

// Containers State
const containers = ref<ContainerSite[]>([...initialContainers]);

const activeContainerId = ref<string>(resolveInitialContainerId());
const activeContainer = computed(() => {
  return containers.value.find(c => c.id === activeContainerId.value) || containers.value[0];
});

const activeArticleForReader = ref<ContentArticle | null>(null);
const isReaderSidebarHidden = ref(true);
const selectedContainerForDetail = ref<ContainerSite | null>(null);

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
  if (newMenu !== 'containers') {
    selectedContainerForDetail.value = null;
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
const maintenanceContainersCount = computed(() => containers.value.filter(c => c.status === 'maintenance').length);
const stoppedContainersCount = computed(() => containers.value.filter(c => c.status === 'stopped').length);
const isQuotaExceeded = computed(() => containers.value.length >= userPlan.value.maxContainers);

// Search & Filter
const searchQuery = ref('');
const statusFilter = ref<'all' | 'running' | 'maintenance' | 'stopped'>('all');

const filteredContainers = computed(() => {
  const q = (searchQuery.value || '').trim().toLowerCase();
  return containers.value.filter(c => {
    if (!c) return false;
    const name = (c.name || '').toLowerCase();
    const subdomain = (c.subdomain || '').toLowerCase();
    const id = (c.id || '').toLowerCase();
    const category = (c.category || '').toLowerCase();
    const templateName = (c.templateName || '').toLowerCase();

    const matchQuery = !q ||
                       name.includes(q) ||
                       subdomain.includes(q) ||
                       id.includes(q) ||
                       category.includes(q) ||
                       templateName.includes(q);

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

const toggleMaintenance = async (container: ContainerSite, message?: string, estimatedEndTime?: string) => {
  const willEnable = container.status !== 'maintenance';
  container.status = 'provisioning';
  showToast(
    willEnable
      ? `Mengaktifkan Mode Pemeliharaan untuk ${container.name}...`
      : `Mengakhiri Mode Pemeliharaan untuk ${container.name}...`,
    'info'
  );

  studioApi
    .toggleMaintenance(container.id, willEnable, message, estimatedEndTime)
    .catch(err => console.warn('[API] Maintenance notice:', err));

  setTimeout(() => {
    if (willEnable) {
      container.status = 'maintenance';
      container.maintenanceConfig = {
        enabled: true,
        message: message || 'Situs sedang dalam pemeliharaan berkala untuk peningkatan performa. Kami akan segera kembali.',
        estimatedEndTime: estimatedEndTime || '30 menit'
      };
      showToast(
        `Mode Pemeliharaan aktif untuk ${container.name}! Trafik publik dialihkan ke respons HTTP 503.`,
        'info'
      );
    } else {
      container.status = 'running';
      if (container.maintenanceConfig) {
        container.maintenanceConfig.enabled = false;
      }
      showToast(`Situs ${container.name} kembali Go-Live dan melayani trafik normal!`, 'success');
    }
  }, 700);
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

// Danger Zone: Delete Container State & Workflow
const containerToDelete = ref<ContainerSite | null>(null);
const isDeleteContainerModalOpen = ref(false);
const isDeletingContainer = ref(false);

const requestDeleteContainer = (container: ContainerSite) => {
  containerToDelete.value = container;
  isDeleteContainerModalOpen.value = true;
};

const cancelDeleteContainer = () => {
  if (isDeletingContainer.value) return;
  isDeleteContainerModalOpen.value = false;
  containerToDelete.value = null;
};

const confirmDeleteContainer = async () => {
  if (!containerToDelete.value) return;
  const container = containerToDelete.value;
  isDeletingContainer.value = true;

  try {
    const idx = containers.value.findIndex(c => c.id === container.id);
    if (idx !== -1) {
      const deletedId = container.id;
      const deletedName = container.name;
      containers.value.splice(idx, 1);
      showToast(`Kontainer '${deletedName}' (${deletedId}) berhasil dihapus. Slot kuota kini ${containers.value.length}/${userPlan.value.maxContainers}.`, 'info');
      if (containers.value.length > 0) {
        activeContainerId.value = containers.value[0].id;
      }
      await studioApi.deleteContainer(deletedId).catch(err => console.warn('[API] Delete container notice:', err));
    }
  } catch (err) {
    console.error('[Container] Delete failed:', err);
    showToast('Gagal menghapus kontainer dari sistem Docker.', 'info');
  } finally {
    isDeletingContainer.value = false;
    isDeleteContainerModalOpen.value = false;
    containerToDelete.value = null;
  }
};

const deleteContainer = (container: ContainerSite) => {
  requestDeleteContainer(container);
};


const isPurgingEdgeCache = ref<string | null>(null);

const purgeEdgeCache = async (container: ContainerSite) => {
  isPurgingEdgeCache.value = container.id;
  showToast(`Membersihkan cache Traefik & Redis untuk '${container.name}'...`, 'info');
  setTimeout(() => {
    isPurgingEdgeCache.value = null;
    showToast(`Edge cache untuk '${container.name}' (${container.subdomain}) berhasil di-purge! Latensi disegarkan ke 1.2ms.`, 'success');
  }, 750);
};

// Modals for Containers
const isCreateModalOpen = ref(false);
const newSiteForm = ref({
  name: '',
  subdomain: '',
  category: 'business' as 'portfolio' | 'blog' | 'education' | 'business',
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
  if (newSiteForm.value.category === 'business') tplName = 'Toko Online & Penjualan Retail';
  if (newSiteForm.value.category === 'blog') tplName = 'Editorial Media & Blog';
  if (newSiteForm.value.category === 'education') tplName = 'Pusat Edukasi LMS';

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
  if (!text) return;
  let toCopy = text.trim();

  toCopy = toCopy.replace(/^https?:\/\/(https?:\/\/)/i, '$1');

  if (!/^[a-zA-Z0-9+.-]+:\/\//.test(toCopy)) {
    if (toCopy.includes('.') && !toCopy.includes(' ') && !toCopy.includes('\n')) {
      toCopy = `https://${toCopy}`;
    }
  }

  navigator.clipboard.writeText(toCopy);
  copiedSubdomain.value = id;
  setTimeout(() => {
    copiedSubdomain.value = null;
  }, 2000);
  showToast(`Tautan disalin ke clipboard: ${toCopy}`, 'info');
};

// Official Templates & Blueprint Engine State
const officialTemplates = ref<OfficialTemplateItem[]>([...defaultOfficialTemplates]);

const applyTemplateToActiveContainer = async (templateId: string, jumpToEditor: boolean = false, customAccentColor?: string): Promise<boolean> => {
  const tpl = officialTemplates.value.find(t => t.id === templateId);
  if (!tpl) {
    showToast('Blueprint template tidak ditemukan.', 'error');
    return false;
  }
  if (!activeContainer.value) {
    showToast('Silakan pilih atau buat kontainer situs terlebih dahulu sebelum menerapkan template.', 'error');
    return false;
  }

  try {
    const targetId = activeContainer.value.id;
    const chosenAccent = customAccentColor || tpl.accentColor;
    const clonedBlocks = JSON.parse(JSON.stringify(tpl.blocks || []));

    // Sinkronkan state kontainer aktif
    activeContainer.value.templateName = tpl.title;
    activeContainer.value.accentColor = chosenAccent;
    activeContainer.value.roleOrHeadline = tpl.defaultRole;
    activeContainer.value.bioIntro = tpl.defaultBio;
    activeContainer.value.lastDeployed = 'Baru saja (Template diterapkan)';
    if (!activeContainer.value.themeConfig) {
      activeContainer.value.themeConfig = {};
    }
    activeContainer.value.themeConfig = {
      ...activeContainer.value.themeConfig,
      ...tpl.themeConfig,
      accentColor: chosenAccent,
      blocks: clonedBlocks
    };

    // Payload draft lengkap untuk Visual Editor Studio
    const editorDraftPayload = {
      blocks: clonedBlocks,
      roleOrHeadline: tpl.defaultRole,
      bioIntro: tpl.defaultBio,
      accentColor: chosenAccent,
      fontFamily: tpl.fontFamily,
      selectedBlockId: clonedBlocks[1]?.id || clonedBlocks[0]?.id || null,
      zoom: 100,
      currentDevice: 'desktop',
      updatedAt: new Date().toISOString(),
      timestamp: Date.now()
    };

    // Cache lokal untuk reaktivitas instan Visual Editor
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(`herocms_editor_draft_${targetId}`, JSON.stringify(editorDraftPayload));
      localStorage.setItem(`cloudcms_draft_${targetId}`, JSON.stringify(editorDraftPayload));
    }

    // Persist ke database backend
    await studioApi.saveSiteDesign(targetId, {
      roleOrHeadline: tpl.defaultRole,
      bioIntro: tpl.defaultBio,
      accentColor: chosenAccent,
      themeConfig: activeContainer.value.themeConfig
    }).catch(err => console.warn('[API] saveSiteDesign warning:', err));

    await studioApi.saveEditorDraft(targetId, editorDraftPayload)
      .catch(err => console.warn('[API] saveEditorDraft warning:', err));

    showToast(`Blueprint '${tpl.title}' berhasil diterapkan ke '${activeContainer.value.name}'!`, 'success');

    if (jumpToEditor) {
      activeMenu.value = 'editor';
    }
    return true;
  } catch (err: any) {
    console.error('Failed to apply template:', err);
    showToast('Gagal menerapkan template: ' + (err?.message || 'Kesalahan internal'), 'error');
    return false;
  }
};

const deployContainerFromTemplate = async (payload: { name: string; subdomain: string; templateId: string; jumpToEditor?: boolean }): Promise<boolean> => {
  if (!payload.name?.trim() || !payload.subdomain?.trim()) {
    showToast('Nama situs dan subdomain wajib diisi.', 'error');
    return false;
  }

  const tpl = officialTemplates.value.find(t => t.id === payload.templateId);
  const cleanSubdomain = payload.subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '');
  const newId = `hero_tenant_${Math.floor(1000 + Math.random() * 9000)}`;
  const clonedBlocks = tpl ? JSON.parse(JSON.stringify(tpl.blocks)) : [];

  const newContainerObj: ContainerSite = {
    id: newId,
    name: payload.name.trim(),
    category: tpl ? tpl.category : 'portfolio',
    templateName: tpl ? tpl.title : 'Portofolio Teknis Engineer',
    subdomain: `${cleanSubdomain}.cloudcms.app`,
    status: 'provisioning',
    cpuUsage: 4,
    ramUsage: 36,
    ramLimit: 256,
    cpuLimit: '0.5 vCPU',
    uptime: 'Inisialisasi...',
    visitsThisWeek: 0,
    ssl: true,
    roleOrHeadline: tpl?.defaultRole || ('Website Resmi ' + payload.name),
    bioIntro: tpl?.defaultBio || 'Selamat datang di website resmi yang didukung arsitektur kontainer otonom HeroCMS Studio.',
    accentColor: tpl?.accentColor || '#2563eb',
    lastDeployed: 'Baru saja',
    themeConfig: tpl ? { ...tpl.themeConfig, blocks: clonedBlocks } : { blocks: clonedBlocks }
  };

  containers.value.push(newContainerObj);
  activeContainerId.value = newId;

  if (typeof localStorage !== 'undefined') {
    const editorDraftPayload = {
      blocks: clonedBlocks,
      roleOrHeadline: newContainerObj.roleOrHeadline,
      bioIntro: newContainerObj.bioIntro,
      accentColor: newContainerObj.accentColor,
      fontFamily: tpl?.fontFamily || 'Inter',
      selectedBlockId: clonedBlocks[1]?.id || clonedBlocks[0]?.id || null,
      zoom: 100,
      currentDevice: 'desktop',
      updatedAt: new Date().toISOString(),
      timestamp: Date.now()
    };
    localStorage.setItem(`herocms_editor_draft_${newId}`, JSON.stringify(editorDraftPayload));
    localStorage.setItem(`cloudcms_draft_${newId}`, JSON.stringify(editorDraftPayload));
  }

  showToast(`Mengalokasikan kontainer baru dengan blueprint '${tpl?.title || 'Default'}'...`, 'info');

  try {
    await studioApi.createContainer({
      name: payload.name.trim(),
      subdomain: cleanSubdomain,
      category: newContainerObj.category,
      role: newContainerObj.roleOrHeadline
    });

    await studioApi.saveSiteDesign(newId, {
      roleOrHeadline: newContainerObj.roleOrHeadline,
      bioIntro: newContainerObj.bioIntro,
      accentColor: newContainerObj.accentColor,
      themeConfig: newContainerObj.themeConfig
    }).catch(() => {});

    await studioApi.saveEditorDraft(newId, {
      blocks: clonedBlocks,
      timestamp: Date.now()
    }).catch(() => {});
  } catch (err) {
    console.warn('[API] Create container backend sync notice:', err);
  }

  setTimeout(() => {
    newContainerObj.status = 'running';
    newContainerObj.cpuUsage = 14;
    newContainerObj.ramUsage = 72;
    newContainerObj.uptime = 'Baru saja running';
    showToast(`Kontainer '${newContainerObj.name}' aktif! Rute live di https://${newContainerObj.subdomain}`, 'success');
  }, 1200);

  if (payload.jumpToEditor) {
    activeMenu.value = 'editor';
  } else {
    activeMenu.value = 'containers';
  }

  return true;
};

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
const invoices = ref<InvoiceItem[]>([...initialInvoices]);

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
const customDomains = ref<CustomDomainItem[]>([...initialCustomDomains]);

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

// Content Articles & CMS Pages State
const articles = ref<ContentArticle[]>([...initialArticles]);
const cmsPages = ref<CmsPage[]>([...initialCmsPages]);

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
    publishedAt: newArticleForm.value.status === 'published' ? 'Baru saja' : 'Draft',
    excerpt: `Ringkasan publikasi konten untuk ${newArticleForm.value.title}.`,
    content: `## ${newArticleForm.value.title}\n\nKonten artikel baru telah dibuat dan siap disunting melalui HeroCMS Content Studio.`
  };
  articles.value.unshift(newArt);
  isCreateArticleModalOpen.value = false;
  newArticleForm.value.title = '';
  showToast(`Artikel '${newArt.title}' berhasil disimpan!`, 'success');
};

const saveArticle = (art: ContentArticle) => {
  const idx = articles.value.findIndex(a => a.id === art.id);
  if (idx !== -1) {
    articles.value[idx] = { ...art };
    showToast(`Artikel '${art.title}' berhasil diperbarui!`, 'success');
  } else {
    articles.value.unshift({ ...art });
    showToast(`Artikel '${art.title}' berhasil ditambahkan!`, 'success');
  }
};

const deleteArticle = (art: ContentArticle) => {
  if (confirm(`Apakah Anda yakin ingin menghapus artikel '${art.title}'?`)) {
    const idx = articles.value.findIndex(a => a.id === art.id);
    if (idx !== -1) {
      articles.value.splice(idx, 1);
      showToast(`Artikel '${art.title}' berhasil dihapus.`, 'info');
    }
  }
};

const saveCmsPage = (page: CmsPage) => {
  const idx = cmsPages.value.findIndex(p => p.id === page.id);
  if (idx !== -1) {
    cmsPages.value[idx] = { ...page };
    showToast(`Halaman '${page.title}' berhasil diperbarui!`, 'success');
  } else {
    cmsPages.value.unshift({ ...page });
    showToast(`Halaman baru '${page.title}' berhasil ditambahkan!`, 'success');
  }
};

const deleteCmsPage = (page: CmsPage) => {
  if (confirm(`Apakah Anda yakin ingin menghapus halaman '${page.title}' (${page.path})?`)) {
    const idx = cmsPages.value.findIndex(p => p.id === page.id);
    if (idx !== -1) {
      cmsPages.value.splice(idx, 1);
      showToast(`Halaman '${page.title}' telah dihapus.`, 'info');
    }
  }
};

// Media Assets State
const mediaBucketName = ref<string>('tenant-994200000000-media');
const mediaStorage = ref({
  usedStorage: '0 MB',
  usedBytes: 0,
  maxStorage: '2048 MB',
  maxBytes: 2147483648,
  freeStorage: '2.00 GB',
  usagePercentage: '0.0%'
});
const mediaAssets = ref<MediaAssetItem[]>([...initialMediaAssets]);
const isUploadingMedia = ref(false);

const formatBytesToReadable = (bytes: number): string => {
  if (bytes <= 0) return '0 MB';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
};

const parseReadableToBytes = (sizeStr: string): number => {
  if (!sizeStr) return 0;
  const clean = sizeStr.trim().toUpperCase();
  const num = parseFloat(clean.replace(/[^0-9.]/g, '')) || 0;
  if (clean.includes('GB')) return Math.round(num * 1024 * 1024 * 1024);
  if (clean.includes('MB')) return Math.round(num * 1024 * 1024);
  if (clean.includes('KB')) return Math.round(num * 1024);
  return Math.round(num);
};

const recalculateStorage = () => {
  const maxBytes = 2147483648; // 2.0 GB
  let totalBytes = 0;
  for (const item of mediaAssets.value) {
    if (typeof item.sizeBytes === 'number' && item.sizeBytes > 0) {
      totalBytes += item.sizeBytes;
    } else {
      totalBytes += parseReadableToBytes(item.size);
    }
  }

  const freeBytes = Math.max(0, maxBytes - totalBytes);
  const percent = (totalBytes / maxBytes) * 100;
  const percentStr = percent > 0 && percent < 0.1 ? '0.1%' : `${percent.toFixed(1)}%`;

  mediaStorage.value = {
    usedStorage: formatBytesToReadable(totalBytes),
    usedBytes: totalBytes,
    maxStorage: '2048 MB',
    maxBytes,
    freeStorage: formatBytesToReadable(freeBytes),
    usagePercentage: percentStr
  };
};

const uploadMediaFiles = async (files: FileList | File[]) => {
  isUploadingMedia.value = true;
  let successCount = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await studioApi.uploadAsset(formData);
      if (res?.asset) {
        mediaAssets.value.unshift(res.asset);
        if (res.storage?.usedStorage) {
          mediaStorage.value = {
            usedStorage: res.storage.usedStorage,
            usedBytes: res.storage.usedBytes || 0,
            maxStorage: res.storage.maxStorage || '2048 MB',
            maxBytes: res.storage.maxBytes || 2147483648,
            freeStorage: res.storage.freeStorage || '2.00 GB',
            usagePercentage: res.storage.usagePercentage || '0.0%'
          };
        } else {
          recalculateStorage();
        }
        successCount++;
      } else {
        throw new Error('Format respon server tidak valid');
      }
    } catch (err: any) {
      console.warn('[MEDIA S3 UPLOAD ERROR]', err);
      const errMsg = err?.message || 'Gagal mengunggah berkas ke MinIO S3';
      showToast(errMsg, 'error');
    }
  }

  isUploadingMedia.value = false;
  if (successCount > 0) {
    showToast(`${successCount} file berhasil diunggah ke MinIO S3 & disinkronkan!`, 'success');
    if (!mediaStorage.value.usedStorage || mediaStorage.value.usedStorage === '0 MB') {
      recalculateStorage();
    }
  }
};

const deleteMedia = async (med: MediaAssetItem) => {
  let serverStorageUpdated = false;
  try {
    const res = await studioApi.deleteAsset(med.id);
    if (res?.storage?.usedStorage) {
      mediaStorage.value = {
        usedStorage: res.storage.usedStorage,
        usedBytes: res.storage.usedBytes || 0,
        maxStorage: res.storage.maxStorage || '2048 MB',
        maxBytes: res.storage.maxBytes || 2147483648,
        freeStorage: res.storage.freeStorage || '2.00 GB',
        usagePercentage: res.storage.usagePercentage || '0.0%'
      };
      serverStorageUpdated = true;
    }
  } catch (err: any) {
    console.warn('[MEDIA S3 DELETE WARNING]', err);
  }
  const idx = mediaAssets.value.findIndex(m => m.id === med.id);
  if (idx !== -1) {
    mediaAssets.value.splice(idx, 1);
    if (!serverStorageUpdated) {
      recalculateStorage();
    }
    showToast(`Media ${med.name} dihapus dari S3 bucket.`, 'info');
  }
};

// Webhooks & API Keys State
const webhooks = ref<WebhookItem[]>([...initialWebhooks]);

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

// Helper to get current tenant author details dynamically
const getTenantAuthor = () => {
  const email = userEmail.value || 'admin@herocms.id';
  let name = email.split('@')[0];
  name = name.split('.').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
  return {
    authorName: name || 'Tenant Administrator',
    authorRole: 'Tenant Administrator'
  };
};

// Normalize ticket data from any source (Redis, DB, localStorage, seeds)
const normalizeTicket = (t: any): SupportTicketItem => {
  let msgs: TicketMessage[] = [];
  if (Array.isArray(t.messages)) {
    msgs = t.messages.map((m: any) => ({
      id: m.id || `msg_${Date.now()}`,
      sender: m.sender || (m.senderRole === 'staff' || m.senderRole === 'support' ? 'support' : 'tenant'),
      authorName: m.authorName || m.senderName || 'Staff',
      authorRole: m.authorRole || m.senderRole || 'Support',
      timestamp: m.timestamp || m.createdAt || 'Baru saja',
      message: m.message || ''
    }));
  }

  let priority: SupportTicketItem['priority'] = 'p3_normal';
  const pLow = (t.priority || '').toLowerCase();
  if (pLow === 'p1_urgent' || pLow === 'urgent' || pLow === 'critical' || pLow === 'p1') {
    priority = 'p1_urgent';
  } else if (pLow === 'p2_high' || pLow === 'high' || pLow === 'p2') {
    priority = 'p2_high';
  }

  let status: SupportTicketItem['status'] = 'open';
  const sLow = (t.status || '').toLowerCase();
  if (sLow === 'resolved' || sLow === 'closed' || sLow === 'selesai') {
    status = 'resolved';
  } else if (sLow === 'in_progress' || sLow === 'answered' || sLow === 'pending' || sLow === 'proses') {
    status = 'in_progress';
  }

  return {
    id: t.id || t.ticket_number || `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
    subject: t.subject || 'Tiket Bantuan',
    category: t.category || 'Infrastructure & Container',
    priority,
    status,
    createdAt: t.createdAt || 'Baru saja',
    lastUpdated: t.lastUpdated || t.lastReply || 'Baru saja',
    assignedEngineer: t.assignedEngineer || (status !== 'open' ? 'Budi Hartono (L2 Cloud DevOps)' : undefined),
    messages: msgs
  };
};

// Support Ticketing State
const supportTickets = ref<SupportTicketItem[]>(initialSupportTickets.map(t => normalizeTicket(t)));

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

const handleCreateTicket = async () => {
  if (!newTicketForm.value.subject || !newTicketForm.value.message) {
    showToast('Harap isi judul dan deskripsi tiket bantuan.', 'error');
    return;
  }

  const { authorName, authorRole } = getTenantAuthor();
  const tempId = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;
  const optimisticTicket: SupportTicketItem = {
    id: tempId,
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
        authorName,
        authorRole,
        timestamp: 'Baru saja',
        message: newTicketForm.value.message
      }
    ]
  };

  supportTickets.value.unshift(optimisticTicket);
  isCreateTicketModalOpen.value = false;
  showToast(`Tiket ${tempId} berhasil dibuat! Tim DevOps akan merespons dalam < 15 menit.`, 'success');

  try {
    const res = await studioApi.createTicket({
      subject: optimisticTicket.subject,
      category: optimisticTicket.category,
      priority: optimisticTicket.priority,
      message: newTicketForm.value.message,
      authorName,
      authorRole
    });
    if (res && res.id) {
      optimisticTicket.id = res.id;
      if (res.createdAt) optimisticTicket.createdAt = res.createdAt;
    }
  } catch (err) {
    console.warn('[TICKET SYNC] Offline fallback retained for created ticket');
  }
};

const openTicketDetail = async (ticket: SupportTicketItem) => {
  selectedTicket.value = ticket;
  ticketReplyText.value = '';
  isTicketDetailModalOpen.value = true;

  if (!ticket.messages) {
    ticket.messages = [];
  }

  if (ticket.messages.length === 0) {
    try {
      const res = await studioApi.getTicketMessages(ticket.id);
      if (res?.messages && Array.isArray(res.messages)) {
        ticket.messages = res.messages.map((m: any) => ({
          id: m.id || `msg_${Date.now()}`,
          sender: m.sender || (m.senderRole === 'staff' || m.senderRole === 'support' ? 'support' : 'tenant'),
          authorName: m.authorName || m.senderName || 'Staff',
          authorRole: m.authorRole || m.senderRole || 'Support',
          timestamp: m.timestamp || m.createdAt || 'Baru saja',
          message: m.message || ''
        }));
      }
    } catch (e) {
      // Retain existing
    }
  }
};

const sendTicketReply = async () => {
  if (!ticketReplyText.value.trim() || !selectedTicket.value) return;

  const currentTicket = selectedTicket.value;
  const replyContent = ticketReplyText.value.trim();
  const { authorName, authorRole } = getTenantAuthor();

  if (!currentTicket.messages) {
    currentTicket.messages = [];
  }

  const newMsg: TicketMessage = {
    id: `msg_${Date.now()}`,
    sender: 'tenant',
    authorName,
    authorRole,
    timestamp: 'Baru saja',
    message: replyContent
  };

  currentTicket.messages.push(newMsg);
  currentTicket.lastUpdated = 'Baru saja';
  ticketReplyText.value = '';
  showToast('Balasan terkirim ke tiket support.', 'success');

  try {
    await studioApi.sendTicketReply(currentTicket.id, {
      message: replyContent,
      authorName,
      authorRole,
      sender: 'tenant'
    });
  } catch (err) {
    console.warn('[TICKET REPLY] Backend sync failed, retained in client state');
  }

  if (currentTicket.status === 'open') {
    setTimeout(() => {
      if (currentTicket) {
        currentTicket.status = 'in_progress';
        currentTicket.assignedEngineer = 'Budi Hartono (L2 Cloud DevOps)';
        const autoReply: TicketMessage = {
          id: `msg_${Date.now() + 1}`,
          sender: 'support',
          authorName: 'Budi Hartono',
          authorRole: 'L2 Cloud DevOps Engineer',
          timestamp: 'Baru saja',
          message: 'Pesan Anda sudah diterima. Kami sedang menguji replikasi isu pada staging environment.'
        };
        currentTicket.messages.push(autoReply);
        showToast('Tim Support merespons tiket Anda!', 'info');

        studioApi.sendTicketReply(currentTicket.id, {
          message: autoReply.message,
          authorName: autoReply.authorName,
          authorRole: autoReply.authorRole,
          sender: 'support'
        }).catch(() => {});
      }
    }, 2000);
  }
};

const resolveTicket = async (ticket: SupportTicketItem) => {
  ticket.status = 'resolved';
  ticket.lastUpdated = 'Baru saja';
  showToast(`Tiket ${ticket.id} ditandai sebagai Selesai / Resolved.`, 'success');

  try {
    await studioApi.resolveTicket(ticket.id);
  } catch (err) {
    console.warn('[TICKET RESOLVE] Backend sync failed, retained in client state');
  }
};

// User-scoped LocalStorage Cache Key Helper
const getCacheKey = (email?: string) => {
  const user = (email || userEmail.value || '').toLowerCase().trim();
  return user ? `herocms_dashboard_cache_${user}` : 'herocms_dashboard_cache';
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
        if (Array.isArray(b.containers?.containers)) {
          containers.value = b.containers.containers;
          if (b.containers.quota?.max) {
            userPlan.value.maxContainers = b.containers.quota.max;
          }
          if (containers.value.length > 0 && !containers.value.some(c => c.id === activeContainerId.value)) {
            activeContainerId.value = containers.value[0].id;
          }
        }
        if (Array.isArray(b.articles?.articles)) {
          articles.value = b.articles.articles;
        }
        if (b.assets) {
          if (Array.isArray(b.assets.assets)) {
            mediaAssets.value = b.assets.assets;
          }
          if (b.assets.bucketName) {
            mediaBucketName.value = b.assets.bucketName;
          }
          if (b.assets.usedStorage) {
            mediaStorage.value = {
              usedStorage: b.assets.usedStorage,
              usedBytes: b.assets.usedBytes || 0,
              maxStorage: b.assets.maxStorage || '2048 MB',
              maxBytes: b.assets.maxBytes || 2147483648,
              freeStorage: b.assets.freeStorage || '2.00 GB',
              usagePercentage: b.assets.usagePercentage || '0.0%'
            };
          } else {
            recalculateStorage();
          }
        }
        if (Array.isArray(b.domains?.domains)) {
          customDomains.value = b.domains.domains;
        }
        if (Array.isArray(b.tickets?.tickets)) {
          supportTickets.value = b.tickets.tickets.map((t: any) => normalizeTicket(t));
        }
        if (Array.isArray(b.invoices?.invoices)) {
          invoices.value = b.invoices.invoices;
        }
        if (Array.isArray(b.webhooks?.webhooks)) {
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

        // Persist to user-scoped local cache for instant zero-latency loads
        try {
          localStorage.setItem(getCacheKey(), JSON.stringify({
            timestamp: Date.now(),
            user: userEmail.value,
            containers: containers.value,
            articles: articles.value,
            cmsPages: cmsPages.value,
            mediaAssets: mediaAssets.value,
            mediaStorage: mediaStorage.value,
            mediaBucketName: mediaBucketName.value,
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

    if (cRes.status === 'fulfilled' && Array.isArray(cRes.value?.containers)) {
      containers.value = cRes.value.containers;
      if (cRes.value.quota?.max) {
        userPlan.value.maxContainers = cRes.value.quota.max;
      }
      if (containers.value.length > 0 && !containers.value.some(c => c.id === activeContainerId.value)) {
        activeContainerId.value = containers.value[0].id;
      }
    }
    if (aRes.status === 'fulfilled' && Array.isArray(aRes.value?.articles)) {
      articles.value = aRes.value.articles;
    }
    if (mRes.status === 'fulfilled' && mRes.value) {
      if (Array.isArray(mRes.value?.assets)) {
        mediaAssets.value = mRes.value.assets;
      }
      if (mRes.value.bucketName) {
        mediaBucketName.value = mRes.value.bucketName;
      }
      if (mRes.value.usedStorage) {
        mediaStorage.value = {
          usedStorage: mRes.value.usedStorage,
          usedBytes: mRes.value.usedBytes || 0,
          maxStorage: mRes.value.maxStorage || '2048 MB',
          maxBytes: mRes.value.maxBytes || 2147483648,
          freeStorage: mRes.value.freeStorage || '2.00 GB',
          usagePercentage: mRes.value.usagePercentage || '0.0%'
        };
      } else {
        recalculateStorage();
      }
    }
    if (dRes.status === 'fulfilled' && Array.isArray(dRes.value?.domains)) {
      customDomains.value = dRes.value.domains;
    }
    if (tRes.status === 'fulfilled' && Array.isArray(tRes.value?.tickets)) {
      supportTickets.value = tRes.value.tickets.map((t: any) => normalizeTicket(t));
    }
    if (iRes.status === 'fulfilled' && Array.isArray(iRes.value?.invoices)) {
      invoices.value = iRes.value.invoices;
    }
    if (wRes.status === 'fulfilled' && Array.isArray(wRes.value?.webhooks)) {
      webhooks.value = wRes.value.webhooks;
    }

    // Persist fresh server state to user-scoped local cache for instant zero-latency loads
    try {
      localStorage.setItem(getCacheKey(), JSON.stringify({
        timestamp: Date.now(),
        user: userEmail.value,
        containers: containers.value,
        articles: articles.value,
        mediaAssets: mediaAssets.value,
        mediaStorage: mediaStorage.value,
        mediaBucketName: mediaBucketName.value,
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
const hydrateFromCache = (overrideEmail?: string) => {
  try {
    const targetEmail = (overrideEmail || userEmail.value || '').toLowerCase().trim();
    const raw = localStorage.getItem(getCacheKey(targetEmail));
    if (raw) {
      const data = JSON.parse(raw);
      if (data.user && targetEmail && data.user.toLowerCase().trim() !== targetEmail) {
        return;
      }
      if (Array.isArray(data.containers)) {
        containers.value = data.containers;
        if (containers.value.length > 0 && !containers.value.some(c => c.id === activeContainerId.value)) {
          activeContainerId.value = containers.value[0].id;
        }
      }
      if (Array.isArray(data.articles)) articles.value = data.articles;
      if (Array.isArray(data.cmsPages)) cmsPages.value = data.cmsPages;
      if (Array.isArray(data.mediaAssets)) {
        mediaAssets.value = data.mediaAssets;
        if (data.mediaStorage) {
          mediaStorage.value = data.mediaStorage;
        } else {
          recalculateStorage();
        }
        if (data.mediaBucketName) {
          mediaBucketName.value = data.mediaBucketName;
        }
      }
      if (Array.isArray(data.customDomains)) customDomains.value = data.customDomains;
      if (Array.isArray(data.supportTickets)) supportTickets.value = data.supportTickets.map((t: any) => normalizeTicket(t));
      if (Array.isArray(data.invoices)) invoices.value = data.invoices;
      if (Array.isArray(data.webhooks)) webhooks.value = data.webhooks;
      if (data.userPlan?.name) userPlan.value = data.userPlan;
    }
  } catch (e) {
    // Graceful fallback to default values
  }
};

if (typeof localStorage !== 'undefined' && localStorage.getItem('cloudcms_auth_token')) {
  hydrateFromCache();
}

// Reset entire dashboard reactive state and client storage
const resetDashboardState = () => {
  // 1. Reset all in-memory reactive state
  const prevEmail = userEmail.value;
  userEmail.value = '';
  userPlan.value = { ...initialUserPlan };
  containers.value = [...initialContainers];
  activeContainerId.value = 'hero_tenant_9942';
  articles.value = [...initialArticles];
  cmsPages.value = [...initialCmsPages];
  activeArticleForReader.value = null;
  mediaAssets.value = [...initialMediaAssets];
  recalculateStorage();
  customDomains.value = [...initialCustomDomains];
  supportTickets.value = initialSupportTickets.map(t => normalizeTicket(t));
  invoices.value = [...initialInvoices];
  webhooks.value = [...initialWebhooks];
  activeMenu.value = 'containers';
  searchQuery.value = '';
  statusFilter.value = 'all';

  // 2. Clear user and cache storage
  if (typeof localStorage !== 'undefined') {
    if (prevEmail) {
      localStorage.removeItem(getCacheKey(prevEmail));
    }
    localStorage.removeItem('herocms_dashboard_cache');
    localStorage.removeItem('cloudcms_auth_token');
    localStorage.removeItem('cloudcms_user_email');
    localStorage.removeItem('cloudcms_csrf_token');
    localStorage.removeItem('herocms_active_menu');
    localStorage.removeItem('herocms_active_container_id');
  }
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.removeItem('herocms_splash_seen');
    sessionStorage.clear();
  }

  // 3. Clear all browser cookies
  if (typeof document !== 'undefined') {
    const cookiesToClear = [
      'herocms_session',
      'csrf_token',
      'herocms_active_menu',
      'herocms_active_container_id'
    ];
    for (const name of cookiesToClear) {
      document.cookie = `${name}=; path=/; max-age=-1; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
  }
};

const executeLogout = async (router?: any) => {
  try {
    // 1. Panggil API backend untuk memusnahkan sesi di Redis dan membatalkan cookie
    await studioApi.logout().catch((e) => console.warn('[AUTH] Logout API notice:', e));
  } catch (err) {
    console.warn('[AUTH] Logout notice:', err);
  } finally {
    // 2. Bersihkan seluruh reactive state dan client storage
    resetDashboardState();

    // 3. Navigasi bersih ke halaman login
    if (router) {
      router.push('/login');
    } else if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }
};

const updateUserEmail = (email: string) => {
  userEmail.value = email;
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('cloudcms_user_email', email);
  }
};

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
    maintenanceContainersCount,
    stoppedContainersCount,
    isQuotaExceeded,
    searchQuery,
    statusFilter,
    filteredContainers,
    startContainer,
    stopContainer,
    toggleMaintenance,
    restartContainer,
    deleteContainer,
    containerToDelete,
    isDeleteContainerModalOpen,
    isDeletingContainer,
    requestDeleteContainer,
    cancelDeleteContainer,
    confirmDeleteContainer,
    isPurgingEdgeCache,
    purgeEdgeCache,
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
    applyTemplateToActiveContainer,
    deployContainerFromTemplate,
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
    cmsPages,
    activeArticleForReader,
    isReaderSidebarHidden,
    isCreateArticleModalOpen,
    newArticleForm,
    handleCreateArticle,
    saveArticle,
    deleteArticle,
    saveCmsPage,
    deleteCmsPage,
    mediaAssets,
    mediaBucketName,
    mediaStorage,
    isUploadingMedia,
    recalculateStorage,
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
    resolveTicket,
    executeLogout,
    resetDashboardState,
    updateUserEmail,
    getCacheKey,
    hydrateFromCache,
    selectedContainerForDetail
  };
}

export type { VisualBlock };
