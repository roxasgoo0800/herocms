<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import {
  MousePointer,
  Hand,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  Undo2,
  Redo2,
  Grid,
  Ruler,
  Monitor,
  Laptop,
  Tablet,
  Smartphone,
  Sparkles,
  Rocket,
  ShieldCheck,
  Layers,
  Palette,
  Edit3,
  Sliders,
  Plus,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Check,
  Code2,
  LayoutGrid,
  CreditCard,
  Server,
  Globe,
  TrendingUp,
  X,
  FileCode,
  ArrowRight,
  ArrowLeft,
  PanelLeftClose,
  PanelLeftOpen,
  Cloud,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Files,
  Search,
  GitBranch,
  Settings,
  Terminal,
  Play,
  RefreshCw
} from 'lucide-vue-next';
import { studioApi } from '../../services/apiClient';
import { useDashboardData } from '../../composables/useDashboardData';
import type { VisualBlock } from '../../types/dashboard';

const {
  activeMenu,
  isEditorSidebarHidden,
  containers,
  activeContainerId,
  activeContainer,
  isPublishing,
  handlePublishChanges,
  aiPromptInput,
  isGeneratingAI,
  handleAiGenerateContent,
  showToast
} = useDashboardData();

// -----------------------------------------------------------------------------
// Studio Canvas Workspace State (Canva / Photoshop Engine)
// -----------------------------------------------------------------------------

type ActiveTool = 'select' | 'hand' | 'text';
type EditorViewMode = 'design' | 'preview' | 'code';
type DevicePreset = 'desktop' | 'laptop' | 'tablet' | 'mobile' | 'custom';

const activeTool = ref<ActiveTool>('select');
const editorViewMode = ref<EditorViewMode>('design');
const activeLeftTab = ref<'blocks' | 'layers' | 'design' | 'ai'>('blocks');
const activeRightTab = ref<'content' | 'layout' | 'appearance'>('content');

// Studio Booting Transition & Draft State
const isEditorBooting = ref(true);
const bootProgress = ref(15);
const bootStatusText = ref('Menyiapkan kanvas visual...');
const isDraftSaving = ref(false);
const lastSavedDraftAt = ref('');
const isDraftRestored = ref(false);

// Site Selector Dropdown State
const isSiteDropdownOpen = ref(false);
const siteDropdownRef = ref<HTMLElement | null>(null);

const toggleSiteDropdown = () => {
  isSiteDropdownOpen.value = !isSiteDropdownOpen.value;
};

const selectSiteFromDropdown = (id: string) => {
  activeContainerId.value = id;
  isSiteDropdownOpen.value = false;
};

const handleSiteDropdownOutsideClick = (e: MouseEvent) => {
  if (siteDropdownRef.value && !siteDropdownRef.value.contains(e.target as Node)) {
    isSiteDropdownOpen.value = false;
  }
};

// Canvas Zoom & Pan
const zoom = ref(0.85);
const panX = ref(0);
const panY = ref(0);
const isPanning = ref(false);
const panStart = ref({ x: 0, y: 0 });
const isSpacePressed = ref(false);

// Canvas Display Helpers
const showRulers = ref(true);
const showGrid = ref(true);
const snapToGrid = ref(true);
const mouseCoords = ref({ x: 0, y: 0 });

// Artboard Dimensions & Resizing
const currentDevice = ref<DevicePreset>('desktop');
const artboardWidth = ref(1440);
const artboardHeight = ref(920);
const isResizing = ref(false);
const resizeDirection = ref<'e' | 's' | 'se' | null>(null);
const resizeStart = ref({ x: 0, y: 0, w: 1440, h: 920 });

// Device Presets Map
const devicePresets: Record<Exclude<DevicePreset, 'custom'>, { w: number; h: number; name: string }> = {
  desktop: { w: 1440, h: 920, name: 'Desktop (1440px)' },
  laptop: { w: 1024, h: 800, name: 'Laptop (1024px)' },
  tablet: { w: 768, h: 1024, name: 'Tablet (768px)' },
  mobile: { w: 375, h: 812, name: 'Mobile (375px)' }
};

const applyDevicePreset = (preset: DevicePreset) => {
  currentDevice.value = preset;
  if (preset !== 'custom') {
    artboardWidth.value = devicePresets[preset].w;
    artboardHeight.value = devicePresets[preset].h;
    nextTick(() => {
      fitToScreen();
    });
  }
};

const rotateOrientation = () => {
  const tmp = artboardWidth.value;
  artboardWidth.value = artboardHeight.value;
  artboardHeight.value = tmp;
  currentDevice.value = 'custom';
  showToast(`Orientasi dibalik: ${artboardWidth.value}px × ${artboardHeight.value}px`, 'info');
};

// Zoom Controls
const zoomIn = () => {
  zoom.value = Math.min(2.0, parseFloat((zoom.value + 0.1).toFixed(2)));
};
const zoomOut = () => {
  zoom.value = Math.max(0.25, parseFloat((zoom.value - 0.1).toFixed(2)));
};
const setZoom = (val: number) => {
  zoom.value = val;
};
const fitToScreen = () => {
  const container = document.querySelector('.studio-viewport-area');
  if (container) {
    const rect = container.getBoundingClientRect();
    const availableWidth = rect.width - 60;
    const availableHeight = rect.height - 80;
    const scale = Math.min(availableWidth / artboardWidth.value, availableHeight / 850);
    zoom.value = Math.min(1.0, Math.max(0.35, parseFloat(scale.toFixed(2))));
    panX.value = 0;
    panY.value = 0;
  }
};

const resetView = () => {
  fitToScreen();
};

// -----------------------------------------------------------------------------
// Visual Blocks Model & Selection
// -----------------------------------------------------------------------------

const selectedBlockId = ref<string | null>('hero_1');
const hoveredBlockId = ref<string | null>(null);

// Default initial blocks generator based on activeContainer
const createDefaultBlocks = (): VisualBlock[] => {
  const siteName = activeContainer.value?.name || 'Portofolio Rizal Pratama';
  const role = activeContainer.value?.roleOrHeadline || 'Portofolio Teknis Engineer';
  const bio = activeContainer.value?.bioIntro || 'Selamat datang di website resmi yang didukung arsitektur kontainer otonom HeroCMS Studio.';

  return [
    {
      id: 'nav_1',
      type: 'navbar',
      name: 'Navigation Bar',
      title: siteName,
      buttonText: 'Hubungi Saya',
      buttonUrl: '#contact',
      isVisible: true,
      isLocked: false,
      styles: {
        bgMode: 'glass',
        paddingY: 16,
        backdropBlur: 16
      }
    },
    {
      id: 'hero_1',
      type: 'hero',
      name: 'Hero Showcase Section',
      badge: '◆ CLOUD NATIVE PLATFORM',
      title: role,
      subtitle: bio,
      buttonText: 'Eksplorasi Karya',
      buttonUrl: '#showcase',
      secondaryButtonText: 'Dokumentasi Sistem',
      secondaryButtonUrl: '#features',
      isVisible: true,
      isLocked: false,
      styles: {
        align: 'center',
        paddingY: 72,
        bgMode: 'transparent'
      }
    },
    {
      id: 'features_1',
      type: 'features',
      name: 'Fitur & Keunggulan',
      badge: 'ARSITEKTUR UTAMA',
      title: 'Pondasi Infrastruktur Modern',
      subtitle: 'Standar rekayasa perangkat lunak tingkat tinggi dengan isolasi runtime kontainer mandiri.',
      isVisible: true,
      isLocked: false,
      items: [
        {
          id: 'feat_1',
          title: 'Orkestrasi Kontainer Otonom',
          desc: 'Berjalan pada runtime Docker Engine terisolasi penuh dengan kontrol cgroups v2 kernel Linux.',
          icon: 'server'
        },
        {
          id: 'feat_2',
          title: 'Edge Ingress Traefik v3',
          desc: 'Rute proxy pintar berkecepatan tinggi dengan sertifikat SSL Let\'s Encrypt TLS v1.3 otomatis.',
          icon: 'globe'
        },
        {
          id: 'feat_3',
          title: 'Telemetri Real-Time Kafka',
          desc: 'Pencatatan statistik kunjungan mikrodetik dengan antrean Kafka stream dan Redis database.',
          icon: 'trending-up'
        }
      ],
      styles: {
        paddingY: 60,
        align: 'center',
        bgMode: 'transparent'
      }
    },
    {
      id: 'pricing_1',
      type: 'pricing',
      name: 'Paket & Layanan',
      badge: 'TRANSPARAN & EFEKTIF',
      title: 'Pilihan Kapasitas Fleksibel',
      subtitle: 'Disesuaikan dengan volume pengunjung dan kebutuhan isolasi komputasi Anda.',
      isVisible: true,
      isLocked: false,
      items: [
        {
          id: 'price_1',
          title: 'Starter Single Site',
          price: 'Rp 49.000',
          period: '/ bln',
          tag: 'Hemat',
          desc: 'Satu runtime kontainer mandiri dengan subdomain kustom dan SSL gratis.',
          features: ['1 Kontainer Docker', '0.5 vCPU • 256MB RAM', 'Traefik TLS Ingress', 'SLA 99.9% Uptime']
        },
        {
          id: 'price_2',
          title: 'Pro Multi-Container',
          price: 'Rp 149.000',
          period: '/ bln',
          tag: 'Terpopuler',
          desc: 'Tiga kontainer mandiri untuk portofolio, blog editorial, dan showcase bisnis.',
          features: ['3 Kontainer Otonom', '1.5 vCPU • 768MB RAM', 'Domain Kustom Bebas', 'Dukungan Prioritas 24/7']
        },
        {
          id: 'price_3',
          title: 'Agency Cluster',
          price: 'Rp 399.000',
          period: '/ bln',
          tag: 'Enterprise',
          desc: 'Sepuluh kontainer dengan alokasi memori dedicated untuk agensi dan korporasi.',
          features: ['10 Kontainer Cluster', 'NVMe Storage 10GB', 'Kafka Telemetry Realtime', 'Custom DNS Ingress']
        }
      ],
      styles: {
        paddingY: 60,
        align: 'center',
        bgMode: 'transparent'
      }
    },
    {
      id: 'cta_1',
      type: 'cta',
      name: 'Call to Action Banner',
      title: 'Siap Meluncurkan Website Mandiri Anda?',
      subtitle: 'Deploy situs pertama Anda dalam hitungan detik tanpa pusing mengelola server manual.',
      buttonText: 'Mulai Sekarang — Gratis',
      buttonUrl: '#start',
      isVisible: true,
      isLocked: false,
      styles: {
        paddingY: 50,
        align: 'center',
        bgMode: 'glass',
        borderRadius: 20
      }
    },
    {
      id: 'footer_1',
      type: 'footer',
      name: 'Site Footer',
      title: siteName,
      subtitle: 'Didukung penuh oleh HeroCMS Studio • Arsitektur Docker & Traefik v3',
      isVisible: true,
      isLocked: false,
      styles: {
        paddingY: 36,
        align: 'center',
        bgMode: 'transparent'
      }
    }
  ];
};

const pageBlocks = ref<VisualBlock[]>([]);

interface EditorDraftData {
  blocks: VisualBlock[];
  roleOrHeadline?: string;
  bioIntro?: string;
  accentColor?: string;
  selectedBlockId?: string | null;
  currentDevice?: DevicePreset;
  zoom?: number;
  panX?: number;
  panY?: number;
  activeLeftTab?: 'blocks' | 'layers' | 'design' | 'ai';
  activeRightTab?: 'content' | 'layout' | 'appearance';
  updatedAt: string;
}

const getDraftStorageKey = (containerId: string) => `herocms_editor_draft_${containerId}`;

// Initialize blocks from activeContainer themeConfig or defaults
const loadBlocksForActiveContainer = () => {
  if (activeContainer.value?.themeConfig?.blocks && Array.isArray(activeContainer.value.themeConfig.blocks)) {
    pageBlocks.value = JSON.parse(JSON.stringify(activeContainer.value.themeConfig.blocks));
  } else {
    pageBlocks.value = createDefaultBlocks();
  }
  if (pageBlocks.value.length > 0) {
    selectedBlockId.value = pageBlocks.value[1]?.id || pageBlocks.value[0]?.id || null;
  }
};

const restoreDraftForActiveContainer = async (containerId: string) => {
  if (!containerId) return;
  try {
    bootStatusText.value = 'Memuat draf posisi edit terakhir...';
    bootProgress.value = 55;

    let draftData: EditorDraftData | null = null;

    // 1. Coba ambil dari Redis Backend terlebih dahulu
    try {
      const res = await studioApi.getEditorDraft(containerId);
      if (res?.data && res.data.blocks && Array.isArray(res.data.blocks)) {
        draftData = res.data;
      }
    } catch (apiErr) {
      console.warn('[VisualEditor] Redis draft fetch fallback:', apiErr);
    }

    // 2. Fallback ke localStorage jika Redis belum ada
    if (!draftData) {
      const localStr = localStorage.getItem(getDraftStorageKey(containerId));
      if (localStr) {
        try {
          draftData = JSON.parse(localStr);
        } catch {}
      }
    }

    // 3. Hydrate state
    if (draftData && Array.isArray(draftData.blocks) && draftData.blocks.length > 0) {
      pageBlocks.value = draftData.blocks;
      if (activeContainer.value) {
        if (draftData.roleOrHeadline !== undefined) activeContainer.value.roleOrHeadline = draftData.roleOrHeadline;
        if (draftData.bioIntro !== undefined) activeContainer.value.bioIntro = draftData.bioIntro;
        if (draftData.accentColor !== undefined) activeContainer.value.accentColor = draftData.accentColor;
        if (!activeContainer.value.themeConfig) activeContainer.value.themeConfig = {};
        activeContainer.value.themeConfig.blocks = draftData.blocks;
      }
      if (draftData.selectedBlockId) selectedBlockId.value = draftData.selectedBlockId;
      if (draftData.currentDevice) applyDevicePreset(draftData.currentDevice);
      if (typeof draftData.zoom === 'number') zoom.value = draftData.zoom;
      if (typeof draftData.panX === 'number') panX.value = draftData.panX;
      if (typeof draftData.panY === 'number') panY.value = draftData.panY;
      if (draftData.activeLeftTab) activeLeftTab.value = draftData.activeLeftTab;
      if (draftData.activeRightTab) activeRightTab.value = draftData.activeRightTab;

      const dateObj = new Date(draftData.updatedAt || Date.now());
      lastSavedDraftAt.value = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      isDraftRestored.value = true;
    } else {
      loadBlocksForActiveContainer();
    }
  } catch (err) {
    console.error('[VisualEditor] Error restoring draft:', err);
    loadBlocksForActiveContainer();
  }
};

let autoSaveTimer: any = null;

const triggerAutoSaveDraft = () => {
  if (isEditorBooting.value || !activeContainerId.value) return;

  if (autoSaveTimer) clearTimeout(autoSaveTimer);
  isDraftSaving.value = true;

  autoSaveTimer = setTimeout(async () => {
    try {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      const draftPayload: EditorDraftData = {
        blocks: pageBlocks.value,
        roleOrHeadline: activeContainer.value?.roleOrHeadline,
        bioIntro: activeContainer.value?.bioIntro,
        accentColor: activeContainer.value?.accentColor,
        selectedBlockId: selectedBlockId.value,
        currentDevice: currentDevice.value,
        zoom: zoom.value,
        panX: panX.value,
        panY: panY.value,
        activeLeftTab: activeLeftTab.value,
        activeRightTab: activeRightTab.value,
        updatedAt: now.toISOString()
      };

      // 1. Simpan di localStorage seketika
      localStorage.setItem(getDraftStorageKey(activeContainerId.value), JSON.stringify(draftPayload));

      // 2. Persist ke Redis via backend API
      await studioApi.saveEditorDraft(activeContainerId.value, draftPayload);

      lastSavedDraftAt.value = timeStr;
    } catch (e) {
      console.warn('[VisualEditor] Auto-save to Redis failed:', e);
    } finally {
      isDraftSaving.value = false;
    }
  }, 750);
};

const resetDraftToDefault = () => {
  if (!confirm('Apakah Anda yakin ingin membuang draf yang belum terbit dan kembali ke versi awal kontainer?')) return;
  if (activeContainerId.value) {
    localStorage.removeItem(getDraftStorageKey(activeContainerId.value));
  }
  loadBlocksForActiveContainer();
  lastSavedDraftAt.value = '';
  showToast('Draf telah direset ke versi awal kontainer.', 'info');
  triggerAutoSaveDraft();
};

watch(
  () => activeContainerId.value,
  async (newId, oldId) => {
    if (newId && oldId) {
      isEditorBooting.value = true;
      bootProgress.value = 35;
      bootStatusText.value = 'Memuat draf situs...';
      await restoreDraftForActiveContainer(newId);
      setTimeout(() => {
        bootProgress.value = 100;
        bootStatusText.value = 'Draf siap!';
        setTimeout(() => {
          isEditorBooting.value = false;
        }, 180);
      }, 200);
    }
  }
);

// Keep activeContainer synced with blocks state & trigger auto-save
watch(
  pageBlocks,
  (newBlocks) => {
    if (activeContainer.value) {
      if (!activeContainer.value.themeConfig) {
        activeContainer.value.themeConfig = {};
      }
      activeContainer.value.themeConfig.blocks = newBlocks;
      recordHistory();
      triggerAutoSaveDraft();
    }
  },
  { deep: true }
);

// Watch container metadata and editor viewport to persist last edit position
watch(
  [
    () => activeContainer.value?.roleOrHeadline,
    () => activeContainer.value?.bioIntro,
    () => activeContainer.value?.accentColor,
    selectedBlockId,
    currentDevice,
    zoom
  ],
  () => {
    triggerAutoSaveDraft();
  }
);

// Computed selected block
const selectedBlock = computed(() => {
  return pageBlocks.value.find((b) => b.id === selectedBlockId.value) || null;
});

// -----------------------------------------------------------------------------
// Undo / Redo History Engine
// -----------------------------------------------------------------------------

const historyStack = ref<string[]>([]);
const historyIndex = ref(-1);
let isHistoryAction = false;

const recordHistory = () => {
  if (isHistoryAction) return;
  const snapshot = JSON.stringify(pageBlocks.value);
  if (historyIndex.value >= 0 && historyStack.value[historyIndex.value] === snapshot) {
    return;
  }
  // Truncate future if branched
  historyStack.value = historyStack.value.slice(0, historyIndex.value + 1);
  historyStack.value.push(snapshot);
  historyIndex.value = historyStack.value.length - 1;
};

const canUndo = computed(() => historyIndex.value > 0);
const canRedo = computed(() => historyIndex.value < historyStack.value.length - 1);

const handleUndo = () => {
  if (!canUndo.value) return;
  isHistoryAction = true;
  historyIndex.value--;
  pageBlocks.value = JSON.parse(historyStack.value[historyIndex.value]);
  showToast('Undo berhasil', 'info');
  nextTick(() => {
    isHistoryAction = false;
  });
};

const handleRedo = () => {
  if (!canRedo.value) return;
  isHistoryAction = true;
  historyIndex.value++;
  pageBlocks.value = JSON.parse(historyStack.value[historyIndex.value]);
  showToast('Redo berhasil', 'info');
  nextTick(() => {
    isHistoryAction = false;
  });
};

// -----------------------------------------------------------------------------
// Mouse & Gesture Handlers: Canvas Panning & Zooming
// -----------------------------------------------------------------------------

const onCanvasMouseDown = (e: MouseEvent) => {
  // If clicking on artboard or handles, don't pan unless Hand tool or Space is active
  if (activeTool.value === 'hand' || isSpacePressed.value || e.button === 1) {
    isPanning.value = true;
    panStart.value = {
      x: e.clientX - panX.value,
      y: e.clientY - panY.value
    };
    e.preventDefault();
  }
};

const onCanvasMouseMove = (e: MouseEvent) => {
  // Update coordinates HUD
  mouseCoords.value = {
    x: Math.round((e.clientX - panX.value) / zoom.value),
    y: Math.round((e.clientY - panY.value) / zoom.value)
  };

  // Panning
  if (isPanning.value) {
    panX.value = e.clientX - panStart.value.x;
    panY.value = e.clientY - panStart.value.y;
    return;
  }

  // Artboard Resizing
  if (isResizing.value && resizeDirection.value) {
    const dx = (e.clientX - resizeStart.value.x) / zoom.value;
    const dy = (e.clientY - resizeStart.value.y) / zoom.value;

    let newW = resizeStart.value.w;
    let newH = resizeStart.value.h;

    if (resizeDirection.value === 'e' || resizeDirection.value === 'se') {
      newW = Math.max(320, Math.min(2560, Math.round(resizeStart.value.w + dx)));
      if (snapToGrid.value) newW = Math.round(newW / 10) * 10;
      artboardWidth.value = newW;
    }
    if (resizeDirection.value === 's' || resizeDirection.value === 'se') {
      newH = Math.max(480, Math.min(3000, Math.round(resizeStart.value.h + dy)));
      if (snapToGrid.value) newH = Math.round(newH / 10) * 10;
      artboardHeight.value = newH;
    }

    currentDevice.value = 'custom';
  }
};

const onCanvasMouseUp = () => {
  isPanning.value = false;
  isResizing.value = false;
  resizeDirection.value = null;
};

const onCanvasWheel = (e: WheelEvent) => {
  e.preventDefault();
  if (e.ctrlKey || e.metaKey) {
    const delta = e.deltaY > 0 ? -0.05 : 0.05;
    zoom.value = Math.max(0.25, Math.min(2.0, parseFloat((zoom.value + delta).toFixed(2))));
  } else if (e.shiftKey) {
    panX.value -= e.deltaY;
  } else {
    // Normal scroll down / up moves canvas smoothly!
    panY.value -= e.deltaY * 0.85;
  }
};

// Start Resizing Artboard
const startArtboardResize = (dir: 'e' | 's' | 'se', e: MouseEvent) => {
  e.stopPropagation();
  e.preventDefault();
  isResizing.value = true;
  resizeDirection.value = dir;
  resizeStart.value = {
    x: e.clientX,
    y: e.clientY,
    w: artboardWidth.value,
    h: artboardHeight.value
  };
};

// -----------------------------------------------------------------------------
// Keyboard Shortcuts
// -----------------------------------------------------------------------------

const onKeyDown = (e: KeyboardEvent) => {
  if (e.code === 'Space' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
    isSpacePressed.value = true;
  }
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
    if (e.shiftKey) handleRedo();
    else handleUndo();
  }
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
    handleRedo();
  }
  if (e.key === 'v' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
    activeTool.value = 'select';
  }
  if (e.key === 'h' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
    activeTool.value = 'hand';
  }
  if (e.key === 'Delete' || e.key === 'Backspace') {
    if (selectedBlockId.value && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
      deleteBlock(selectedBlockId.value);
    }
  }
};

const onKeyUp = (e: KeyboardEvent) => {
  if (e.code === 'Space') {
    isSpacePressed.value = false;
  }
};

onMounted(async () => {
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
  window.addEventListener('mousemove', onCanvasMouseMove);
  window.addEventListener('mouseup', onCanvasMouseUp);
  window.addEventListener('resize', fitToScreen);
  document.addEventListener('click', handleSiteDropdownOutsideClick);

  // Smooth booting transition & dependency/draft load
  isEditorBooting.value = true;
  bootProgress.value = 25;
  bootStatusText.value = 'Menyiapkan kanvas visual...';

  await nextTick();
  fitToScreen();

  bootProgress.value = 50;
  bootStatusText.value = 'Memuat dependensi & engine editor...';

  // Load / resume draft
  if (activeContainerId.value) {
    await restoreDraftForActiveContainer(activeContainerId.value);
  } else {
    loadBlocksForActiveContainer();
  }

  recordHistory();

  bootProgress.value = 85;
  bootStatusText.value = 'Merender komponen & layout...';

  setTimeout(() => {
    bootProgress.value = 100;
    bootStatusText.value = 'Draf siap!';
    setTimeout(() => {
      isEditorBooting.value = false;
      if (isDraftRestored.value) {
        showToast('Draf posisi edit terakhir berhasil dimuat', 'success');
      }
    }, 280);
  }, 250);
});

onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown);
  window.removeEventListener('keyup', onKeyUp);
  window.removeEventListener('mousemove', onCanvasMouseMove);
  window.removeEventListener('mouseup', onCanvasMouseUp);
  window.removeEventListener('resize', fitToScreen);
  document.removeEventListener('click', handleSiteDropdownOutsideClick);
});

// -----------------------------------------------------------------------------
// Block Manipulation Actions
// -----------------------------------------------------------------------------

const selectBlock = (id: string, e?: MouseEvent) => {
  if (activeTool.value === 'hand') return;
  if (e) e.stopPropagation();
  selectedBlockId.value = id;
};

const moveBlockUp = (id: string) => {
  const idx = pageBlocks.value.findIndex((b) => b.id === id);
  if (idx > 0) {
    const temp = pageBlocks.value[idx];
    pageBlocks.value[idx] = pageBlocks.value[idx - 1];
    pageBlocks.value[idx - 1] = temp;
    showToast('Posisi section dipindah ke atas', 'info');
  }
};

const moveBlockDown = (id: string) => {
  const idx = pageBlocks.value.findIndex((b) => b.id === id);
  if (idx < pageBlocks.value.length - 1) {
    const temp = pageBlocks.value[idx];
    pageBlocks.value[idx] = pageBlocks.value[idx + 1];
    pageBlocks.value[idx + 1] = temp;
    showToast('Posisi section dipindah ke bawah', 'info');
  }
};

const duplicateBlock = (id: string) => {
  const idx = pageBlocks.value.findIndex((b) => b.id === id);
  if (idx !== -1) {
    const orig = pageBlocks.value[idx];
    const clone: VisualBlock = JSON.parse(JSON.stringify(orig));
    clone.id = `${orig.type}_${Date.now() % 10000}`;
    clone.name = `${orig.name} (Salinan)`;
    pageBlocks.value.splice(idx + 1, 0, clone);
    selectedBlockId.value = clone.id;
    showToast(`Komponen '${clone.name}' diduplikat`, 'success');
  }
};

const deleteBlock = (id: string) => {
  if (pageBlocks.value.length <= 1) {
    showToast('Halaman harus memiliki minimal 1 komponen aktif.', 'error');
    return;
  }
  const idx = pageBlocks.value.findIndex((b) => b.id === id);
  if (idx !== -1) {
    const removedName = pageBlocks.value[idx].name;
    pageBlocks.value.splice(idx, 1);
    selectedBlockId.value = pageBlocks.value[Math.max(0, idx - 1)]?.id || null;
    showToast(`Komponen '${removedName}' dihapus`, 'info');
  }
};

const toggleBlockLock = (b: VisualBlock) => {
  b.isLocked = !b.isLocked;
  showToast(b.isLocked ? `Section '${b.name}' dikunci` : `Section '${b.name}' dibuka`, 'info');
};

const toggleBlockVisibility = (b: VisualBlock) => {
  b.isVisible = !b.isVisible;
};

// Add New Block from Library
const addBlockFromLibrary = (type: VisualBlock['type']) => {
  const newId = `${type}_${Date.now() % 10000}`;
  let newBlock: VisualBlock;

  switch (type) {
    case 'hero':
      newBlock = {
        id: newId,
        type: 'hero',
        name: 'Hero Showcase Baru',
        badge: 'NEW ARRIVAL',
        title: 'Judul Hero Menawan',
        subtitle: 'Kombinasi visual memukau yang menghadirkan impresi premium bagi audiens Anda.',
        buttonText: 'Mulai Sekarang',
        buttonUrl: '#',
        isVisible: true,
        isLocked: false,
        styles: { align: 'center', paddingY: 64, bgMode: 'transparent' }
      };
      break;
    case 'features':
      newBlock = {
        id: newId,
        type: 'features',
        name: 'Fitur Grid 3 Kolom',
        badge: 'KEUNGGULAN',
        title: 'Solusi Lengkap & Komprehensif',
        subtitle: 'Dibuat untuk memberikan nilai terbaik bagi pengembangan produk Anda.',
        isVisible: true,
        isLocked: false,
        items: [
          { id: 'f1', title: 'Performa Tinggi', desc: 'Respon milidetik dengan Traefik v3 proxy.', icon: 'server' },
          { id: 'f2', title: 'Aman & Terisolasi', desc: 'Linux cgroups v2 kernel sandboxing.', icon: 'globe' },
          { id: 'f3', title: 'Analitik Realtime', desc: 'Integrasi Kafka dan Redis pipeline.', icon: 'trending-up' }
        ],
        styles: { paddingY: 60, align: 'center', bgMode: 'transparent' }
      };
      break;
    case 'pricing':
      newBlock = {
        id: newId,
        type: 'pricing',
        name: 'Tabel Harga',
        badge: 'INVESTASI',
        title: 'Pilihan Paket Layanan',
        subtitle: 'Skalabilitas tanpa batas untuk kebutuhan bisnis Anda.',
        isVisible: true,
        isLocked: false,
        items: [
          { id: 'p1', title: 'Standard', price: 'Rp 99.000', period: '/ bln', desc: 'Cocok untuk awal mulai.', features: ['1 Domain', 'SSL Otomatis'] },
          { id: 'p2', title: 'Premium', price: 'Rp 249.000', period: '/ bln', desc: 'Kapasitas maksimal.', features: ['3 Domain', 'Prioritas Support'] }
        ],
        styles: { paddingY: 60, align: 'center', bgMode: 'transparent' }
      };
      break;
    case 'cta':
      newBlock = {
        id: newId,
        type: 'cta',
        name: 'Call To Action',
        title: 'Wujudkan Ide Anda Hari Ini',
        subtitle: 'Bergabunglah bersama ribuan pengembang yang mempercayai HeroCMS Studio.',
        buttonText: 'Hubungi Kami',
        buttonUrl: '#',
        isVisible: true,
        isLocked: false,
        styles: { paddingY: 50, align: 'center', bgMode: 'glass', borderRadius: 16 }
      };
      break;
    default:
      newBlock = {
        id: newId,
        type: 'hero',
        name: 'Blok Konten Baru',
        title: 'Bagian Konten',
        subtitle: 'Tuliskan deskripsi konten Anda di sini.',
        isVisible: true,
        isLocked: false,
        styles: { paddingY: 48, align: 'left', bgMode: 'transparent' }
      };
  }

  // Insert right below selected or at bottom before footer
  const footerIdx = pageBlocks.value.findIndex((b) => b.type === 'footer');
  if (footerIdx !== -1) {
    pageBlocks.value.splice(footerIdx, 0, newBlock);
  } else {
    pageBlocks.value.push(newBlock);
  }
  selectedBlockId.value = newBlock.id;
  showToast(`Komponen '${newBlock.name}' berhasil ditambahkan ke kanvas!`, 'success');
};

// Brand Color Palettes
const colorPalettes = [
  { name: 'Obsidian Noir', hex: '#0f172a' },
  { name: 'Midnight Slate', hex: '#1e293b' },
  { name: 'Deep Sapphire', hex: '#1e3a8a' },
  { name: 'Forest Emerald', hex: '#064e3b' },
  { name: 'Titanium Steel', hex: '#334155' },
  { name: 'Muted Bordeaux', hex: '#881337' },
  { name: 'Warm Terracotta', hex: '#7c2d12' },
  { name: 'Dark Amber', hex: '#78350f' }
];

const fontFamilies = [
  { id: 'Inter', name: 'Inter (Sleek Clean)' },
  { id: 'Plus Jakarta Sans', name: 'Plus Jakarta Sans (Modern Modernist)' },
  { id: 'Outfit', name: 'Outfit (Geometric Premium)' },
  { id: 'Syne', name: 'Syne (Avant-Garde Display)' },
  { id: 'Fira Code', name: 'Fira Code (Developer Mono)' }
];

const currentFont = ref('Plus Jakarta Sans');

// JSON Schema Modal
const isCodeModalOpen = ref(false);
const schemaJsonText = computed(() => {
  return JSON.stringify(
    {
      container: {
        id: activeContainer.value?.id,
        name: activeContainer.value?.name,
        subdomain: activeContainer.value?.subdomain,
        accentColor: activeContainer.value?.accentColor
      },
      artboard: {
        width: artboardWidth.value,
        height: artboardHeight.value,
        device: currentDevice.value
      },
      blocks: pageBlocks.value
    },
    null,
    2
  );
});

const copySchemaJson = () => {
  navigator.clipboard.writeText(schemaJsonText.value);
  showToast('Schema JSON website berhasil disalin ke clipboard!', 'success');
};

// -----------------------------------------------------------------------------
// VS Code-style Code Editor Engine
// -----------------------------------------------------------------------------
type VsCodeTab = 'blocks.json' | 'index.html' | 'theme.css' | 'docker-compose.yml';

const activeVsCodeTab = ref<VsCodeTab>('blocks.json');
const isVsCodeExplorerOpen = ref(true);
const vsCodeBlocksCode = ref('');
const isVsCodeCodeDirty = ref(false);

// Sync code whenever switching into 'code' mode
watch(
  () => editorViewMode.value,
  (mode) => {
    if (mode === 'code') {
      vsCodeBlocksCode.value = schemaJsonText.value;
      isVsCodeCodeDirty.value = false;
    }
  },
  { immediate: true }
);

// Keep vsCodeBlocksCode updated if schemaJsonText changes and user hasn't typed unapplied changes
watch(schemaJsonText, (newVal) => {
  if (editorViewMode.value === 'code' && !isVsCodeCodeDirty.value) {
    vsCodeBlocksCode.value = newVal;
  }
});

const generatedHtmlCode = computed(() => {
  const containerName = activeContainer.value?.name || 'Website Tenant';
  const domain = activeContainer.value?.subdomain || 'tenant.cloudcms.app';
  const blocks = pageBlocks.value;

  const blocksHtml = blocks
    .map((b) => {
      return `    <!-- Block: ${b.name} (${b.type}) -->\n    <section class="section-${b.type}" id="block-${b.id}">\n      <div class="container">\n        <h2>${b.name}</h2>\n      </div>\n    </section>`;
    })
    .join('\n\n');

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${containerName} | HeroCMS</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(currentFont.value)}:wght@400;600;700;800&display=swap">
  <link rel="stylesheet" href="./theme.css">
</head>
<body class="theme-modern">
  <!-- HeroCMS Edge Runtime Generated Page -->
  <!-- Domain: ${domain} -->
  <main class="page-wrapper">
${blocksHtml || '    <!-- Belum ada blok ditambahkan -->'}
  </main>
</body>
</html>`;
});

const generatedCssCode = computed(() => {
  const accent = activeContainer.value?.accentColor || '#0f172a';
  return `/**
 * HeroCMS Design System Tokens & Generated Styles
 * Tenant Subdomain: ${activeContainer.value?.subdomain || 'tenant.cloudcms.app'}
 */

:root {
  /* Brand Tokens */
  --brand-primary: ${accent};
  --font-family-base: '${currentFont.value}', sans-serif;
  
  /* Canvas Dimensions */
  --artboard-width: ${artboardWidth.value}px;
  --artboard-height: ${artboardHeight.value}px;
  
  /* Layout Spacing */
  --container-max-width: 1440px;
  --radius-card: 16px;
  --radius-pill: 9999px;
  
  /* Slate & Neutral Colors */
  --bg-canvas: #ffffff;
  --text-main: #0f172a;
  --text-muted: #64748b;
  --border-subtle: #e2e8f0;
}

body {
  margin: 0;
  font-family: var(--font-family-base);
  color: var(--text-main);
  background: var(--bg-canvas);
  -webkit-font-smoothing: antialiased;
}

.page-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
}`;
});

const generatedDockerCode = computed(() => {
  const sub = activeContainer.value?.subdomain || 'tenant.cloudcms.app';
  const name = activeContainer.value?.name || 'Tenant App';
  const safeName = sub.replace(/[^a-zA-Z0-9_-]/g, '_');

  return `# HeroCMS Docker Cgroups Microservice Runtime
# Target Container: ${sub}
version: '3.8'

services:
  web-runtime:
    image: herocms/runtime-edge:v3.4-alpine
    container_name: ${safeName}
    restart: unless-stopped
    mem_limit: 256m
    cpus: 0.50
    environment:
      - NODE_ENV=production
      - TENANT_SUBDOMAIN=${sub}
      - TENANT_NAME=${name}
      - CACHE_TTL=3600
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.${safeName}.rule=Host(\`${sub}\`)"
      - "traefik.http.routers.${safeName}.entrypoints=websecure"
      - "traefik.http.routers.${safeName}.tls.certresolver=letsencrypt"
      - "herocms.tenant.active=true"`;
});

const currentVsCodeContent = computed(() => {
  if (activeVsCodeTab.value === 'blocks.json') return vsCodeBlocksCode.value || schemaJsonText.value;
  if (activeVsCodeTab.value === 'index.html') return generatedHtmlCode.value;
  if (activeVsCodeTab.value === 'theme.css') return generatedCssCode.value;
  return generatedDockerCode.value;
});

const vsCodeLineCount = computed(() => {
  const lines = currentVsCodeContent.value.split('\n').length;
  return Math.max(lines, 24);
});

const onVsCodeKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Tab') {
    e.preventDefault();
    const target = e.target as HTMLTextAreaElement;
    const start = target.selectionStart;
    const end = target.selectionEnd;
    vsCodeBlocksCode.value =
      vsCodeBlocksCode.value.substring(0, start) + '  ' + vsCodeBlocksCode.value.substring(end);
    isVsCodeCodeDirty.value = true;
    nextTick(() => {
      target.selectionStart = target.selectionEnd = start + 2;
    });
  }
};

const applyVsCodeChangesToCanvas = () => {
  try {
    const parsed = JSON.parse(vsCodeBlocksCode.value);
    if (parsed.blocks && Array.isArray(parsed.blocks)) {
      pageBlocks.value = parsed.blocks;
    } else if (Array.isArray(parsed)) {
      pageBlocks.value = parsed;
    }
    if (parsed.container?.accentColor && activeContainer.value) {
      activeContainer.value.accentColor = parsed.container.accentColor;
    }
    isVsCodeCodeDirty.value = false;
    recordHistory();
    triggerAutoSaveDraft();
    showToast('Perubahan kode JSON berhasil disinkronkan ke kanvas!', 'success');
  } catch (err: any) {
    showToast('Gagal menerapkan JSON: ' + (err?.message || 'Format tidak valid'), 'error');
  }
};

const formatVsCodeJson = () => {
  try {
    const parsed = JSON.parse(vsCodeBlocksCode.value);
    vsCodeBlocksCode.value = JSON.stringify(parsed, null, 2);
    showToast('Kode blocks.json berhasil dirapikan (Prettified)!', 'info');
  } catch (e: any) {
    showToast('JSON tidak valid, gagal memformat: ' + e?.message, 'error');
  }
};

const copyVsCodeCurrentCode = () => {
  navigator.clipboard.writeText(currentVsCodeContent.value);
  showToast(`Kode file ${activeVsCodeTab.value} berhasil disalin ke clipboard!`, 'success');
};
</script>

<template>
  <section class="visual-studio-root">
    <!-- Studio Booting Transition Overlay (Themed identically to Splash Screen) -->
    <transition name="studio-boot-dissolve">
      <div v-if="isEditorBooting" class="studio-boot-screen" role="status" aria-live="polite">
        <!-- Theme Base Dot Grid -->
        <div class="base-dot-grid" aria-hidden="true"></div>

        <!-- Clean Center Pod -->
        <div class="boot-center-pod">
          <!-- Logo Emblem matching splashscreen -->
          <div class="brand-glyph-box">
            <Layers :size="24" color="#ffffff" />
          </div>

          <!-- Brand Wordmark -->
          <h1 class="brand-wordmark">
            HeroCMS <span class="wordmark-highlight">Studio</span>
            <span class="wordmark-editor-tag">Visual Editor</span>
          </h1>

          <!-- Obsidian Black Loading Bar directly under wordmark -->
          <div class="boot-progress-track">
            <div
              class="boot-progress-fill"
              :style="{ width: `${bootProgress}%` }"
            ></div>
          </div>

          <!-- Dynamic Real Initialization Status -->
          <p class="boot-status-text">
            {{ bootStatusText }}
          </p>
        </div>
      </div>
    </transition>

    <div v-if="activeContainer" class="studio-main-frame" :class="{ 'is-revealed': !isEditorBooting }">
      <!-- =================================================================== -->
      <!-- 1. TOP STUDIO COMMAND BAR (Photoshop / Canva Toolbar)                -->
      <!-- =================================================================== -->
      <header class="studio-command-bar">
        <!-- Left: Target Container Selector & Tools -->
        <div class="cmd-left-group">
          <!-- Back to Dashboard -->
          <button
            class="btn-back-dashboard"
            @click="activeMenu = 'containers'"
            title="Kembali ke Dashboard Utama"
          >
            <ArrowLeft :size="14" />
            <span>Dashboard</span>
          </button>

          <button
            class="btn-toggle-sidebar"
            :class="{ active: !isEditorSidebarHidden }"
            @click="isEditorSidebarHidden = !isEditorSidebarHidden"
            :title="isEditorSidebarHidden ? 'Tampilkan Menu Sidebar' : 'Sembunyikan Menu Sidebar'"
          >
            <PanelLeftOpen v-if="isEditorSidebarHidden" :size="15" />
            <PanelLeftClose v-else :size="15" />
          </button>

          <div class="v-divider"></div>

          <div class="site-dropdown-wrapper" ref="siteDropdownRef">
            <button
              class="site-target-pill"
              :class="{ 'is-open': isSiteDropdownOpen }"
              @click.stop="toggleSiteDropdown"
              type="button"
              title="Pilih Situs / Kontainer Tenant"
            >
              <span class="pulse-status-dot"></span>
              <span class="pill-label">SITUS:</span>
              <span class="site-display-name">{{ activeContainer?.name || 'Pilih Situs' }}</span>
              <span class="site-display-subdomain">({{ activeContainer?.subdomain || '...' }})</span>
              <ChevronDown :size="13" class="site-chevron-icon" :class="{ 'is-rotated': isSiteDropdownOpen }" />
            </button>

            <!-- Floating Custom Dropdown -->
            <transition name="dropdown-scale">
              <div v-if="isSiteDropdownOpen" class="site-floating-dropdown">
                <div class="site-dropdown-header">
                  <div class="site-dropdown-header-left">
                    <span class="site-dropdown-title">Situs Terpasang</span>
                    <span class="site-dropdown-subtitle">Daftar container website tenant aktif</span>
                  </div>
                  <span class="site-dropdown-count-badge">{{ containers.length }}</span>
                </div>

                <div class="site-dropdown-list">
                  <button
                    v-for="c in containers"
                    :key="c.id"
                    type="button"
                    class="site-item-btn"
                    :class="{ active: c.id === activeContainerId }"
                    @click="selectSiteFromDropdown(c.id)"
                  >
                    <div class="site-item-icon-box">
                      <Globe :size="14" />
                    </div>
                    <div class="site-item-info">
                      <div class="site-item-row-top">
                        <span class="site-item-name">{{ c.name }}</span>
                        <span v-if="c.id === activeContainerId" class="site-item-active-badge">Aktif</span>
                      </div>
                      <span class="site-item-domain">{{ c.subdomain }}</span>
                    </div>
                    <div class="site-item-action">
                      <Check v-if="c.id === activeContainerId" :size="14" class="site-item-check-icon" />
                    </div>
                  </button>
                </div>
              </div>
            </transition>
          </div>

          <div class="v-divider"></div>

          <!-- Studio Tools Segment -->
          <div class="tools-segment">
            <button
              class="tool-btn"
              :class="{ active: activeTool === 'select' }"
              @click="activeTool = 'select'"
              title="Pointer / Seleksi (V)"
            >
              <MousePointer :size="14" />
            </button>
            <button
              class="tool-btn"
              :class="{ active: activeTool === 'hand' }"
              @click="activeTool = 'hand'"
              title="Hand / Pan Kanvas (H atau Tahan Spacebar)"
            >
              <Hand :size="14" />
            </button>
          </div>

          <div class="v-divider"></div>

          <!-- Undo / Redo -->
          <div class="history-segment">
            <button
              class="tool-btn"
              :disabled="!canUndo"
              @click="handleUndo"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 :size="14" />
            </button>
            <button
              class="tool-btn"
              :disabled="!canRedo"
              @click="handleRedo"
              title="Redo (Ctrl+Y)"
            >
              <Redo2 :size="14" />
            </button>
          </div>
        </div>

        <!-- Center: Device Presets & Resizer HUD -->
        <div class="cmd-center-group">
          <div class="device-switcher-dock">
            <button
              class="dev-dock-btn"
              :class="{ active: currentDevice === 'desktop' }"
              @click="applyDevicePreset('desktop')"
              title="Desktop 1440px"
            >
              <Monitor :size="14" />
              <span>Desktop</span>
            </button>
            <button
              class="dev-dock-btn"
              :class="{ active: currentDevice === 'laptop' }"
              @click="applyDevicePreset('laptop')"
              title="Laptop 1024px"
            >
              <Laptop :size="14" />
              <span>Laptop</span>
            </button>
            <button
              class="dev-dock-btn"
              :class="{ active: currentDevice === 'tablet' }"
              @click="applyDevicePreset('tablet')"
              title="Tablet 768px"
            >
              <Tablet :size="14" />
              <span>Tablet</span>
            </button>
            <button
              class="dev-dock-btn"
              :class="{ active: currentDevice === 'mobile' }"
              @click="applyDevicePreset('mobile')"
              title="Mobile 375px"
            >
              <Smartphone :size="14" />
              <span>Mobile</span>
            </button>
          </div>

          <!-- Dimension Indicator & Rotate -->
          <div class="dimension-hud" title="Dimensi Viewport (Klik ikon putar untuk membalik orientasi)">
            <div class="dim-metric">
              <span class="dim-tag">W</span>
              <span class="dim-number">{{ artboardWidth }}</span>
            </div>
            <span class="dim-multiplier">×</span>
            <div class="dim-metric">
              <span class="dim-tag">H</span>
              <span class="dim-number">{{ artboardHeight }}</span>
            </div>
            <span class="dim-unit">px</span>
            <div class="dim-sep"></div>
            <button class="btn-rotate-mini" @click="rotateOrientation" title="Putar Orientasi (Landscape / Portrait)">
              <RotateCcw :size="13" />
            </button>
          </div>
        </div>

        <!-- Right: Zoom, Mode Switcher, & Publish Button -->
        <div class="cmd-right-group">
          <!-- Canvas View & Zoom HUD -->
          <div class="zoom-controls-cluster">
            <button
              class="btn-zoom-icon"
              :class="{ active: showRulers }"
              @click="showRulers = !showRulers"
              title="Penggaris Piksel (Rulers)"
            >
              <Ruler :size="13" />
            </button>
            <button
              class="btn-zoom-icon"
              :class="{ active: showGrid }"
              @click="showGrid = !showGrid"
              title="Grid Kanvas Dot-Matrix"
            >
              <Grid :size="13" />
            </button>
            <div class="zoom-v-sep"></div>
            <button class="btn-zoom-icon" @click="zoomOut" title="Zoom Out (-)">
              <ZoomOut :size="13" />
            </button>
            <div class="zoom-slider-wrap">
              <input
                type="range"
                min="0.25"
                max="2.0"
                step="0.05"
                v-model.number="zoom"
                class="zoom-slider-input"
              />
            </div>
            <button class="btn-zoom-icon" @click="zoomIn" title="Zoom In (+)">
              <ZoomIn :size="13" />
            </button>
            <div class="zoom-dropdown-pill">
              <span>{{ Math.round(zoom * 100) }}%</span>
              <select :value="zoom" @change="setZoom(parseFloat(($event.target as HTMLSelectElement).value))" class="zoom-select-hidden">
                <option :value="0.5">50%</option>
                <option :value="0.75">75%</option>
                <option :value="0.85">85%</option>
                <option :value="1.0">100%</option>
                <option :value="1.25">125%</option>
                <option :value="1.5">150%</option>
              </select>
            </div>
            <div class="zoom-v-sep"></div>
            <button class="btn-zoom-fit" @click="resetView" title="Reset Pandangan (100%)">
              <RotateCcw :size="12" />
            </button>
            <button class="btn-zoom-fit" @click="fitToScreen" title="Paskan ke Layar (Fit)">
              <Maximize2 :size="12" />
            </button>
          </div>

          <div class="v-divider"></div>

          <!-- View Modes -->
          <div class="viewmode-toggle-group">
            <button
              class="vmode-btn"
              :class="{ active: editorViewMode === 'design' }"
              @click="editorViewMode = 'design'"
              title="Mode Desain Studio"
            >
              Desain
            </button>
            <button
              class="vmode-btn"
              :class="{ active: editorViewMode === 'preview' }"
              @click="editorViewMode = 'preview'"
              title="Mode Simulasi Pengunjung"
            >
              Pratinjau
            </button>
            <button
              class="vmode-btn"
              :class="{ active: editorViewMode === 'code' }"
              @click="editorViewMode = 'code'"
              title="Mode Editor Kode (VS Code Style)"
            >
              <Code2 :size="13" />
            </button>
          </div>

          <!-- Draft Auto-Save Status & Reset -->
          <div
            class="draft-status-badge"
            :class="{ saving: isDraftSaving }"
            :title="lastSavedDraftAt ? `Draf tersimpan otomatis (${lastSavedDraftAt})` : 'Draf otomatis tersimpan'"
          >
            <Cloud :size="13" class="draft-cloud-icon" />
            <span class="draft-status-text">
              {{ isDraftSaving ? 'Menyimpan...' : 'Tersimpan' }}
            </span>
          </div>

          <button
            class="btn-reset-draft"
            @click="resetDraftToDefault"
            title="Reset draf ke versi awal kontainer"
          >
            <RotateCcw :size="12" />
          </button>

          <div class="v-divider"></div>

          <!-- Publish Button -->
          <button
            class="btn-publish-live"
            :disabled="isPublishing"
            @click="handlePublishChanges"
            title="Terbitkan perubahan ke kontainer langsung"
          >
            <Rocket v-if="!isPublishing" :size="14" />
            <span v-else class="spin-ring-sm"></span>
            <span>{{ isPublishing ? 'Menerbitkan...' : 'Terbitkan' }}</span>
          </button>
        </div>
      </header>

      <!-- =================================================================== -->
      <!-- 2. STUDIO WORKSPACE SPLIT: LEFT DOCK | CANVAS | RIGHT INSPECTOR      -->
      <!-- =================================================================== -->
      <div class="studio-panes-container">
        <!-- ----------------------------------------------------------------- -->
        <!-- LEFT STUDIO DOCK (Blocks Library, Layers Tree, Design Tokens, AI) -->
        <!-- ----------------------------------------------------------------- -->
        <aside class="studio-left-dock" :class="{ 'dock-hidden': editorViewMode !== 'design' }">
          <!-- Dock Tabs Header -->
          <nav class="left-dock-tabs">
            <button
              class="dock-tab-item"
              :class="{ active: activeLeftTab === 'blocks' }"
              @click="activeLeftTab = 'blocks'"
              title="Komponen & Blok Baru"
            >
              <Plus :size="14" />
              <span>Blok</span>
            </button>
            <button
              class="dock-tab-item"
              :class="{ active: activeLeftTab === 'layers' }"
              @click="activeLeftTab = 'layers'"
              title="Hirarki Lapisan (Layers)"
            >
              <Layers :size="14" />
              <span>Layers</span>
            </button>
            <button
              class="dock-tab-item"
              :class="{ active: activeLeftTab === 'design' }"
              @click="activeLeftTab = 'design'"
              title="Token Desain & Brand"
            >
              <Palette :size="14" />
              <span>Desain</span>
            </button>
            <button
              class="dock-tab-item"
              :class="{ active: activeLeftTab === 'ai' }"
              @click="activeLeftTab = 'ai'"
              title="AI Studio Copilot"
            >
              <Sparkles :size="14" />
              <span>AI</span>
            </button>
          </nav>

          <!-- Dock Body -->
          <div class="dock-tab-body">
            <!-- TAB 1: BLOCKS LIBRARY -->
            <div v-if="activeLeftTab === 'blocks'" class="dock-blocks-catalog">
              <div class="dock-section-head">
                <h4>Katalog Blok Website</h4>
                <p>Klik blok di bawah untuk menambahkannya langsung ke halaman.</p>
              </div>

              <div class="block-cards-grid">
                <div class="block-add-card" @click="addBlockFromLibrary('hero')">
                  <div class="card-icon-bubble">
                    <LayoutGrid :size="18" />
                  </div>
                  <div class="card-meta">
                    <strong>Hero Showcase</strong>
                    <span>Banner visual tajam dengan headline & tombol aksi</span>
                  </div>
                  <Plus :size="14" class="icon-add-plus" />
                </div>

                <div class="block-add-card" @click="addBlockFromLibrary('features')">
                  <div class="card-icon-bubble">
                    <Server :size="18" />
                  </div>
                  <div class="card-meta">
                    <strong>Bento Features Grid</strong>
                    <span>Grid 3 kartu keunggulan dengan ikon modern</span>
                  </div>
                  <Plus :size="14" class="icon-add-plus" />
                </div>

                <div class="block-add-card" @click="addBlockFromLibrary('pricing')">
                  <div class="card-icon-bubble">
                    <CreditCard :size="18" />
                  </div>
                  <div class="card-meta">
                    <strong>Tabel Harga / Paket</strong>
                    <span>Daftar paket transparan dengan checklist fitur</span>
                  </div>
                  <Plus :size="14" class="icon-add-plus" />
                </div>

                <div class="block-add-card" @click="addBlockFromLibrary('cta')">
                  <div class="card-icon-bubble">
                    <Rocket :size="18" />
                  </div>
                  <div class="card-meta">
                    <strong>Call To Action Banner</strong>
                    <span>Pusat konversi pengunjung dengan efek glowing</span>
                  </div>
                  <Plus :size="14" class="icon-add-plus" />
                </div>
              </div>
            </div>

            <!-- TAB 2: LAYERS TREE (Photoshop Style) -->
            <div v-else-if="activeLeftTab === 'layers'" class="dock-layers-panel">
              <div class="dock-section-head">
                <h4>Struktur Lapisan Halaman</h4>
                <p>{{ pageBlocks.length }} komponen aktif di kanvas</p>
              </div>

              <div class="layers-list-tree">
                <div
                  v-for="(block, idx) in pageBlocks"
                  :key="block.id"
                  class="layer-row-item"
                  :class="{
                    selected: selectedBlockId === block.id,
                    hidden: !block.isVisible,
                    locked: block.isLocked
                  }"
                  @click="selectBlock(block.id)"
                  @mouseenter="hoveredBlockId = block.id"
                  @mouseleave="hoveredBlockId = null"
                >
                  <span class="layer-type-dot"></span>
                  <span class="layer-name-text">{{ block.name }}</span>

                  <div class="layer-actions-group" @click.stop>
                    <button class="icon-layer-btn" @click="toggleBlockVisibility(block)" :title="block.isVisible ? 'Sembunyikan' : 'Tampilkan'">
                      <Eye v-if="block.isVisible" :size="12" />
                      <EyeOff v-else :size="12" />
                    </button>
                    <button class="icon-layer-btn" @click="toggleBlockLock(block)" :title="block.isLocked ? 'Buka Kunci' : 'Kunci Section'">
                      <Lock v-if="block.isLocked" :size="12" />
                      <Unlock v-else :size="12" />
                    </button>
                    <button class="icon-layer-btn" :disabled="idx === 0" @click="moveBlockUp(block.id)" title="Naikkan Urutan">
                      <ChevronUp :size="12" />
                    </button>
                    <button class="icon-layer-btn" :disabled="idx === pageBlocks.length - 1" @click="moveBlockDown(block.id)" title="Turunkan Urutan">
                      <ChevronDown :size="12" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- TAB 3: DESIGN TOKENS -->
            <div v-else-if="activeLeftTab === 'design'" class="dock-design-panel">
              <div class="dock-section-head">
                <h4>Palet & Brand Identitas</h4>
                <p>Kustomisasi warna primer dan tipografi seluruh halaman.</p>
              </div>

              <!-- Accent Color -->
              <div class="token-field-box">
                <label class="token-lbl">Warna Utama (Aksen Brand)</label>
                <div class="color-palette-cards">
                  <button
                    v-for="pal in colorPalettes"
                    :key="pal.hex"
                    class="palette-card-btn"
                    :class="{ active: activeContainer.accentColor === pal.hex }"
                    @click="activeContainer.accentColor = pal.hex"
                    :title="pal.name"
                  >
                    <span class="palette-swatch-dot" :style="{ backgroundColor: pal.hex }">
                      <Check v-if="activeContainer.accentColor === pal.hex" :size="10" color="#fff" />
                    </span>
                    <div class="palette-meta">
                      <span class="palette-name">{{ pal.name }}</span>
                      <span class="palette-hex">{{ pal.hex }}</span>
                    </div>
                  </button>
                </div>
              </div>

              <!-- Typography -->
              <div class="token-field-box" style="margin-top: 16px;">
                <label class="token-lbl">Keluarga Tipografi (Font)</label>
                <select v-model="currentFont" class="token-select-input">
                  <option v-for="f in fontFamilies" :key="f.id" :value="f.id">
                    {{ f.name }}
                  </option>
                </select>
              </div>

              <!-- Template Badge -->
              <div class="token-field-box" style="margin-top: 16px;">
                <label class="token-lbl">Blueprint Terpasang</label>
                <div class="blueprint-badge-box">
                  <div class="blueprint-icon-box">
                    <Layers :size="14" color="#ffffff" />
                  </div>
                  <div class="blueprint-meta">
                    <strong>{{ activeContainer.templateName }}</strong>
                    <span>Dockerized cgroups runtime</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- TAB 4: AI COPILOT -->
            <div v-else class="dock-ai-panel">
              <div class="dock-section-head">
                <h4>AI Studio Copywriter</h4>
                <p>Hasilkan headline & narasi memikat menggunakan mesin AI.</p>
              </div>

              <textarea
                v-model="aiPromptInput"
                class="ai-prompt-area"
                rows="3"
                placeholder="Tulis instruksi konten, misal: Buatkan headline dan bio profesional untuk Senior Cloud Architect..."
              ></textarea>

              <button
                class="btn-generate-ai"
                :disabled="isGeneratingAI || !aiPromptInput.trim()"
                @click="handleAiGenerateContent"
              >
                <Sparkles :size="14" />
                <span>{{ isGeneratingAI ? 'Merumuskan...' : 'Generate Konten AI' }}</span>
              </button>

              <div class="prompt-presets-list">
                <span class="preset-title">Preset Cepat:</span>
                <button
                  class="preset-chip"
                  @click="aiPromptInput = 'Senior Cloud & DevOps Engineer dengan spesialisasi Kubernetes dan Docker microservices.'"
                >
                  Cloud & DevOps
                </button>
                <button
                  class="preset-chip"
                  @click="aiPromptInput = 'Platform edukasi teknologi modern dengan kurikulum intensif dan sertifikasi industri.'"
                >
                  Edukasi & LMS
                </button>
                <button
                  class="preset-chip"
                  @click="aiPromptInput = 'Agensi digital kreatif penyedia solusi branding visual dan website performa tinggi.'"
                >
                  Agensi Kreatif
                </button>
              </div>
            </div>
          </div>
        </aside>

        <!-- ----------------------------------------------------------------- -->
        <!-- CENTER WORKSPACE: DUAL ENGINE (CANVAS & VS CODE WORKSPACE)          -->
        <!-- ----------------------------------------------------------------- -->
        <div class="studio-center-workspace">
          <!-- 1. Infinite Canvas Workspace & Resizable Artboard -->
          <main
            class="studio-viewport-area"
            :class="{
              'is-view-hidden': editorViewMode === 'code',
              'tool-hand-active': activeTool === 'hand' || isSpacePressed,
              'is-dragging-canvas': isPanning,
              'grid-dots-visible': showGrid
            }"
            @mousedown="onCanvasMouseDown"
            @wheel="onCanvasWheel"
          >
          <!-- Coordinate Rulers (Photoshop Style) -->
          <div v-if="showRulers" class="canvas-ruler-top">
            <div class="ruler-tick-cluster" :style="{ transform: `translateX(${panX}px) scaleX(${zoom})` }">
              <span v-for="i in 40" :key="`rt_${i}`" class="ruler-mark" :style="{ left: `${(i - 1) * 100}px` }">
                {{ (i - 1) * 100 }}
              </span>
            </div>
          </div>
          <div v-if="showRulers" class="canvas-ruler-left">
            <div class="ruler-tick-cluster-v" :style="{ transform: `translateY(${panY}px) scaleY(${zoom})` }">
              <span v-for="i in 30" :key="`rl_${i}`" class="ruler-mark-v" :style="{ top: `${(i - 1) * 100}px` }">
                {{ (i - 1) * 100 }}
              </span>
            </div>
          </div>

          <!-- Bottom Coordinates HUD -->
          <div class="canvas-coords-badge">
            <span>X: {{ mouseCoords.x }}px</span>
            <span class="hud-sep">•</span>
            <span>Y: {{ mouseCoords.y }}px</span>
            <span class="hud-sep">•</span>
            <span>Zoom: {{ Math.round(zoom * 100) }}%</span>
          </div>

          <!-- The Zoomable & Transformed Artboard Container -->
          <div
            class="artboard-transform-wrapper"
            :style="{
              transform: `translate(calc(-50% + ${panX}px), ${panY}px) scale(${zoom})`,
              transformOrigin: 'top center'
            }"
          >
            <!-- Resizable Website Frame Shell -->
            <div
              class="artboard-frame"
              :style="{
                width: `${artboardWidth}px`,
                fontFamily: currentFont
              }"
            >
              <!-- Browser Chrome Window Bar -->
              <div class="artboard-window-bar">
                <div class="window-traffic-dots">
                  <span class="dot red"></span>
                  <span class="dot yellow"></span>
                  <span class="dot green"></span>
                </div>
                <div class="window-url-capsule">
                  <ShieldCheck :size="12" color="#10b981" />
                  <span class="url-text">https://{{ activeContainer.subdomain }}</span>
                </div>
                <div class="window-ingress-tag">
                  <span class="live-dot-mini"></span>
                  <span>Traefik v3 Edge: 1.8ms</span>
                </div>
              </div>

              <!-- Website Content Stage -->
              <div class="website-rendered-surface" :style="{ '--accent-brand': activeContainer.accentColor }">
                <!-- Loop Over Blocks -->
                <template v-for="block in pageBlocks" :key="block.id">
                  <div
                    v-if="block.isVisible"
                    class="block-node-wrapper"
                    :class="{
                      'is-selected': selectedBlockId === block.id && editorViewMode === 'design',
                      'is-hovered': hoveredBlockId === block.id && editorViewMode === 'design',
                      'is-locked': block.isLocked
                    }"
                    @click="selectBlock(block.id, $event)"
                    @mouseenter="hoveredBlockId = block.id"
                    @mouseleave="hoveredBlockId = null"
                  >
                    <!-- SELECTION BOUNDING BOX & ACTION BAR OVERLAY (Photoshop/Canva Selection) -->
                    <div v-if="selectedBlockId === block.id && editorViewMode === 'design'" class="selection-overlay-box">
                      <!-- 4 Corner Transformation Anchors -->
                      <span class="corner-anchor tl"></span>
                      <span class="corner-anchor tr"></span>
                      <span class="corner-anchor bl"></span>
                      <span class="corner-anchor br"></span>

                      <!-- Floating Action Bar Attached to Selected Block -->
                      <div class="floating-selection-bar" @click.stop>
                        <span class="selection-tag-pill">◆ {{ block.name }}</span>
                        <div class="bar-divider"></div>
                        <button class="float-btn" @click="moveBlockUp(block.id)" title="Pindah ke Atas">
                          <ChevronUp :size="13" />
                        </button>
                        <button class="float-btn" @click="moveBlockDown(block.id)" title="Pindah ke Bawah">
                          <ChevronDown :size="13" />
                        </button>
                        <button class="float-btn" @click="duplicateBlock(block.id)" title="Duplikat Section">
                          <Copy :size="13" />
                        </button>
                        <button class="float-btn" @click="toggleBlockLock(block)" :title="block.isLocked ? 'Buka Kunci' : 'Kunci'">
                          <Lock v-if="block.isLocked" :size="13" />
                          <Unlock v-else :size="13" />
                        </button>
                        <button class="float-btn delete" @click="deleteBlock(block.id)" title="Hapus Section">
                          <Trash2 :size="13" />
                        </button>
                      </div>
                    </div>

                    <!-- BLOCK TYPE 1: NAVBAR -->
                    <nav
                      v-if="block.type === 'navbar'"
                      class="rendered-nav-block"
                      :style="{ padding: `${block.styles?.paddingY || 16}px 32px` }"
                    >
                      <div class="site-brand-logo" :style="{ color: activeContainer.accentColor }">
                        <span class="brand-cube-icon">◆</span>
                        <span class="brand-title">{{ block.title }}</span>
                      </div>
                      <div class="nav-links-cluster">
                        <a href="#hero" class="nav-anchor active">Beranda</a>
                        <a href="#features" class="nav-anchor">Keunggulan</a>
                        <a href="#pricing" class="nav-anchor">Layanan</a>
                        <a href="#cta" class="nav-anchor">Kontak</a>
                        <button class="btn-nav-action" :style="{ backgroundColor: activeContainer.accentColor }">
                          {{ block.buttonText || 'Hubungi Saya' }}
                        </button>
                      </div>
                    </nav>

                    <!-- BLOCK TYPE 2: HERO SECTION -->
                    <header
                      v-else-if="block.type === 'hero'"
                      class="rendered-hero-block"
                      :style="{
                        padding: `${block.styles?.paddingY || 72}px 32px`,
                        textAlign: block.styles?.align || 'center'
                      }"
                    >
                      <!-- Glowing Ambient Blur Mesh -->
                      <div
                        class="ambient-mesh-glow"
                        :style="{
                          background: `radial-gradient(circle, ${activeContainer.accentColor}33 0%, transparent 70%)`
                        }"
                      ></div>

                      <div
                        v-if="block.badge"
                        class="hero-badge-tag"
                        :style="{
                          color: activeContainer.accentColor,
                          borderColor: activeContainer.accentColor + '40',
                          backgroundColor: activeContainer.accentColor + '12'
                        }"
                      >
                        <span>{{ block.badge }}</span>
                      </div>

                      <h1 class="hero-main-heading">
                        {{ block.title }}
                      </h1>

                      <p class="hero-bio-lead">
                        {{ block.subtitle }}
                      </p>

                      <div class="hero-cta-cluster">
                        <button
                          class="btn-primary-glow"
                          :style="{ backgroundColor: activeContainer.accentColor }"
                        >
                          <span>{{ block.buttonText || 'Eksplorasi Karya' }}</span>
                          <ArrowRight :size="14" />
                        </button>
                        <button v-if="block.secondaryButtonText" class="btn-secondary-clean">
                          <span>{{ block.secondaryButtonText }}</span>
                        </button>
                      </div>
                    </header>

                    <!-- BLOCK TYPE 3: FEATURES GRID -->
                    <section
                      v-else-if="block.type === 'features'"
                      class="rendered-features-block"
                      :style="{ padding: `${block.styles?.paddingY || 60}px 32px` }"
                    >
                      <div class="section-title-wrap">
                        <span v-if="block.badge" class="badge-mini-caps">{{ block.badge }}</span>
                        <h2 class="sec-headline">{{ block.title }}</h2>
                        <p v-if="block.subtitle" class="sec-lead">{{ block.subtitle }}</p>
                      </div>

                      <div class="features-cards-trio">
                        <div
                          v-for="item in block.items"
                          :key="item.id"
                          class="feature-bento-card"
                        >
                          <div
                            class="card-icon-pill"
                            :style="{
                              color: activeContainer.accentColor,
                              backgroundColor: activeContainer.accentColor + '12'
                            }"
                          >
                            <Server v-if="item.icon === 'server'" :size="20" />
                            <Globe v-else-if="item.icon === 'globe'" :size="20" />
                            <TrendingUp v-else :size="20" />
                          </div>
                          <h3 class="card-item-title">{{ item.title }}</h3>
                          <p class="card-item-desc">{{ item.desc }}</p>
                        </div>
                      </div>
                    </section>

                    <!-- BLOCK TYPE 4: PRICING -->
                    <section
                      v-else-if="block.type === 'pricing'"
                      class="rendered-pricing-block"
                      :style="{ padding: `${block.styles?.paddingY || 60}px 32px` }"
                    >
                      <div class="section-title-wrap">
                        <span v-if="block.badge" class="badge-mini-caps">{{ block.badge }}</span>
                        <h2 class="sec-headline">{{ block.title }}</h2>
                        <p v-if="block.subtitle" class="sec-lead">{{ block.subtitle }}</p>
                      </div>

                      <div class="pricing-cards-row">
                        <div
                          v-for="item in block.items"
                          :key="item.id"
                          class="price-tier-card"
                          :class="{ featured: item.tag === 'Terpopuler' }"
                        >
                          <span v-if="item.tag" class="tier-tag-pill" :style="{ backgroundColor: activeContainer.accentColor }">
                            {{ item.tag }}
                          </span>
                          <h4 class="tier-name">{{ item.title }}</h4>
                          <div class="tier-price-val">
                            <span class="price-num">{{ item.price }}</span>
                            <span class="price-cycle">{{ item.period }}</span>
                          </div>
                          <p class="tier-desc">{{ item.desc }}</p>
                          <ul v-if="item.features" class="tier-feature-list">
                            <li v-for="(f, fi) in item.features" :key="fi">
                              <Check :size="13" :color="activeContainer.accentColor" />
                              <span>{{ f }}</span>
                            </li>
                          </ul>
                          <button
                            class="btn-tier-action"
                            :style="{
                              backgroundColor: item.tag === 'Terpopuler' ? activeContainer.accentColor : '#f1f5f9',
                              color: item.tag === 'Terpopuler' ? '#ffffff' : '#0f172a'
                            }"
                          >
                            Pilih Paket
                          </button>
                        </div>
                      </div>
                    </section>

                    <!-- BLOCK TYPE 5: CALL TO ACTION -->
                    <section
                      v-else-if="block.type === 'cta'"
                      class="rendered-cta-block"
                      :style="{ padding: `${block.styles?.paddingY || 50}px 32px` }"
                    >
                      <div
                        class="cta-inner-banner"
                        :style="{
                          borderColor: activeContainer.accentColor + '30',
                          background: `linear-gradient(135deg, ${activeContainer.accentColor}15 0%, #ffffff80 100%)`
                        }"
                      >
                        <h2 class="cta-heading">{{ block.title }}</h2>
                        <p class="cta-lead">{{ block.subtitle }}</p>
                        <button
                          class="btn-cta-big"
                          :style="{ backgroundColor: activeContainer.accentColor }"
                        >
                          {{ block.buttonText || 'Mulai Sekarang' }}
                        </button>
                      </div>
                    </section>

                    <!-- BLOCK TYPE 6: FOOTER -->
                    <footer
                      v-else-if="block.type === 'footer'"
                      class="rendered-footer-block"
                      :style="{ padding: `${block.styles?.paddingY || 36}px 32px` }"
                    >
                      <div class="footer-divider-line"></div>
                      <div class="footer-content-row">
                        <div class="footer-brand">
                          <span class="brand-cube-icon" :style="{ color: activeContainer.accentColor }">◆</span>
                          <strong>{{ block.title }}</strong>
                        </div>
                        <p class="footer-copy">{{ block.subtitle }}</p>
                      </div>
                    </footer>
                  </div>
                </template>
              </div>

              <!-- RESIZE HANDLES (Canva / Figma Freeform Resizer) -->
              <div v-if="editorViewMode === 'design'" class="artboard-resize-handles">
                <!-- Right Width Handle -->
                <div
                  class="resize-handle handle-right"
                  @mousedown="startArtboardResize('e', $event)"
                  title="Tarik untuk mengubah lebar viewport"
                >
                  <div class="handle-pill-grip"></div>
                </div>

                <!-- Bottom Height Handle -->
                <div
                  class="resize-handle handle-bottom"
                  @mousedown="startArtboardResize('s', $event)"
                  title="Tarik untuk mengubah tinggi viewport"
                >
                  <div class="handle-pill-grip-h"></div>
                </div>

                <!-- Corner Handle -->
                <div
                  class="resize-handle handle-corner"
                  @mousedown="startArtboardResize('se', $event)"
                  title="Tarik diagonal untuk mengubah lebar & tinggi"
                >
                  <div class="corner-dot-grip"></div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <!-- 2. VS Code-Style Canvas Code Editor Workspace -->
        <section
          class="studio-vscode-workspace"
          :class="{ 'is-view-hidden': editorViewMode !== 'code' }"
        >
          <!-- 1. VS Code Activity Bar (Far Left Strip) -->
          <aside class="vscode-activity-bar">
            <div class="vscode-act-top">
              <button
                class="vscode-act-btn"
                :class="{ active: isVsCodeExplorerOpen }"
                @click="isVsCodeExplorerOpen = !isVsCodeExplorerOpen"
                title="Penjelajah File (Ctrl+Shift+E)"
              >
                <Files :size="18" />
              </button>
              <button class="vscode-act-btn" title="Pencarian (Ctrl+Shift+F)">
                <Search :size="17" />
              </button>
              <button class="vscode-act-btn" title="Kontrol Sumber (Git)">
                <GitBranch :size="17" />
              </button>
            </div>
            <div class="vscode-act-bottom">
              <button class="vscode-act-btn" title="Terminal Live">
                <Terminal :size="17" />
              </button>
              <button class="vscode-act-btn" title="Pengaturan Editor">
                <Settings :size="17" />
              </button>
            </div>
          </aside>

          <!-- 2. VS Code File Explorer Sidebar -->
          <transition name="vscode-explorer-slide">
            <aside v-if="isVsCodeExplorerOpen" class="vscode-explorer-sidebar">
              <div class="vscode-explorer-header">
                <span class="vscode-explorer-title">PENJELAJAH</span>
                <span class="vscode-explorer-badge">HEROCMS</span>
              </div>
              <div class="vscode-file-tree">
                <div class="vscode-tree-section">
                  <div class="vscode-section-head">
                    <ChevronDown :size="12" />
                    <span>HEROCMS-WORKSPACE</span>
                  </div>

                  <div class="vscode-tree-items">
                    <!-- Config folder -->
                    <div class="vscode-folder-row">
                      <ChevronDown :size="11" />
                      <span class="folder-name">config</span>
                    </div>
                    <button
                      class="vscode-file-item indent"
                      :class="{ active: activeVsCodeTab === 'docker-compose.yml' }"
                      @click="activeVsCodeTab = 'docker-compose.yml'"
                    >
                      <span class="file-icon docker">🐳</span>
                      <span class="file-name">docker-compose.yml</span>
                    </button>

                    <!-- Src folder -->
                    <div class="vscode-folder-row">
                      <ChevronDown :size="11" />
                      <span class="folder-name">src</span>
                    </div>
                    <button
                      class="vscode-file-item indent"
                      :class="{ active: activeVsCodeTab === 'blocks.json' }"
                      @click="activeVsCodeTab = 'blocks.json'"
                    >
                      <span class="file-icon json">{ }</span>
                      <span class="file-name">blocks.json</span>
                    </button>
                    <button
                      class="vscode-file-item indent"
                      :class="{ active: activeVsCodeTab === 'index.html' }"
                      @click="activeVsCodeTab = 'index.html'"
                    >
                      <span class="file-icon html">&lt;&gt;</span>
                      <span class="file-name">index.html</span>
                    </button>
                    <button
                      class="vscode-file-item indent"
                      :class="{ active: activeVsCodeTab === 'theme.css' }"
                      @click="activeVsCodeTab = 'theme.css'"
                    >
                      <span class="file-icon css">#</span>
                      <span class="file-name">theme.css</span>
                    </button>
                  </div>
                </div>
              </div>
            </aside>
          </transition>

          <!-- 3. VS Code Main Code Editor Pane -->
          <div class="vscode-editor-main">
            <!-- Tabs Bar -->
            <div class="vscode-tabs-bar">
              <div class="vscode-tabs-scroll">
                <button
                  class="vscode-tab-btn"
                  :class="{ active: activeVsCodeTab === 'blocks.json' }"
                  @click="activeVsCodeTab = 'blocks.json'"
                >
                  <span class="tab-icon json">{ }</span>
                  <span class="tab-label">blocks.json</span>
                  <span class="tab-unsaved-dot" v-if="isVsCodeCodeDirty">●</span>
                  <span class="tab-close-icon"><X :size="11" /></span>
                </button>
                <button
                  class="vscode-tab-btn"
                  :class="{ active: activeVsCodeTab === 'index.html' }"
                  @click="activeVsCodeTab = 'index.html'"
                >
                  <span class="tab-icon html">&lt;&gt;</span>
                  <span class="tab-label">index.html</span>
                  <span class="tab-close-icon"><X :size="11" /></span>
                </button>
                <button
                  class="vscode-tab-btn"
                  :class="{ active: activeVsCodeTab === 'theme.css' }"
                  @click="activeVsCodeTab = 'theme.css'"
                >
                  <span class="tab-icon css">#</span>
                  <span class="tab-label">theme.css</span>
                  <span class="tab-close-icon"><X :size="11" /></span>
                </button>
                <button
                  class="vscode-tab-btn"
                  :class="{ active: activeVsCodeTab === 'docker-compose.yml' }"
                  @click="activeVsCodeTab = 'docker-compose.yml'"
                >
                  <span class="tab-icon docker">🐳</span>
                  <span class="tab-label">docker-compose.yml</span>
                  <span class="tab-close-icon"><X :size="11" /></span>
                </button>
              </div>

              <!-- Top Actions Bar -->
              <div class="vscode-editor-actions">
                <button
                  v-if="activeVsCodeTab === 'blocks.json'"
                  class="vscode-action-btn primary"
                  @click="applyVsCodeChangesToCanvas"
                  title="Sinkronkan & Terapkan Perubahan JSON ke Kanvas Studio"
                >
                  <Play :size="12" />
                  <span>Terapkan ke Kanvas</span>
                </button>
                <button
                  v-if="activeVsCodeTab === 'blocks.json'"
                  class="vscode-action-btn"
                  @click="formatVsCodeJson"
                  title="Format JSON (Prettier)"
                >
                  <Sparkles :size="12" />
                  <span>Prettify</span>
                </button>
                <button
                  class="vscode-action-btn"
                  @click="copyVsCodeCurrentCode"
                  title="Salin Isi File Ini"
                >
                  <Copy :size="12" />
                  <span>Salin</span>
                </button>
                <button
                  class="vscode-action-btn exit"
                  @click="editorViewMode = 'design'"
                  title="Kembali ke Mode Desain Kanvas"
                >
                  <ArrowLeft :size="12" />
                  <span>Kembali ke Kanvas</span>
                </button>
              </div>
            </div>

            <!-- Breadcrumbs -->
            <div class="vscode-breadcrumbs-bar">
              <span class="crumb">herocms</span>
              <span class="crumb-sep">&gt;</span>
              <span class="crumb">src</span>
              <span class="crumb-sep">&gt;</span>
              <span class="crumb active">{{ activeVsCodeTab }}</span>
              <span v-if="activeVsCodeTab === 'blocks.json'" class="crumb-tip">
                (Edit JSON di sini lalu klik "Terapkan ke Kanvas")
              </span>
            </div>

            <!-- Code Editor Workspace (Lines + Code Area) -->
            <div class="vscode-code-viewport">
              <!-- Line Numbers Gutter -->
              <div class="vscode-gutter">
                <div
                  v-for="line in vsCodeLineCount"
                  :key="line"
                  class="vscode-line-number"
                >
                  <span class="line-num-text">{{ line }}</span>
                </div>
              </div>

              <!-- Code Content Surface -->
              <div class="vscode-text-surface">
                <!-- If blocks.json, provide interactive editable textarea -->
                <textarea
                  v-if="activeVsCodeTab === 'blocks.json'"
                  v-model="vsCodeBlocksCode"
                  @keydown="onVsCodeKeydown"
                  @input="isVsCodeCodeDirty = true"
                  class="vscode-code-textarea"
                  spellcheck="false"
                  autocomplete="off"
                  autocorrect="off"
                  autocapitalize="off"
                ></textarea>

                <!-- If read-only generated code (index.html, theme.css, docker-compose.yml) -->
                <pre v-else class="vscode-code-pre">{{ currentVsCodeContent }}</pre>
              </div>
            </div>

            <!-- 4. VS Code Status Bar (Bottom Strip) -->
            <footer class="vscode-status-bar">
              <div class="vscode-status-left">
                <span class="status-item git">
                  <GitBranch :size="12" />
                  <span>main*</span>
                </span>
                <span class="status-item">
                  <RefreshCw :size="11" />
                  <span>0 ⨉ 0 ⚠</span>
                </span>
                <span class="status-item highlight">HeroCMS Runtime Edge v3.4</span>
              </div>
              <div class="vscode-status-right">
                <span class="status-item">Spasi: 2</span>
                <span class="status-item">UTF-8</span>
                <span class="status-item lang">
                  {{
                    activeVsCodeTab === 'blocks.json' ? 'JSON' :
                    activeVsCodeTab === 'index.html' ? 'HTML' :
                    activeVsCodeTab === 'theme.css' ? 'CSS' : 'YAML'
                  }}
                </span>
                <span class="status-item">Prettier: ✓</span>
              </div>
            </footer>
          </div>
        </section>
        </div>

        <!-- ----------------------------------------------------------------- -->
        <!-- RIGHT STUDIO DOCK: DEEP STYLE INSPECTOR & CONTENT CONTROLS        -->
        <!-- ----------------------------------------------------------------- -->
        <aside class="studio-right-inspector" :class="{ 'dock-hidden': editorViewMode !== 'design' }">
          <!-- Inspector Tabs Header -->
          <div class="inspector-tabs-bar">
            <button
              class="insp-tab-btn"
              :class="{ active: activeRightTab === 'content' }"
              @click="activeRightTab = 'content'"
            >
              <Edit3 :size="13" />
              <span>Konten</span>
            </button>
            <button
              class="insp-tab-btn"
              :class="{ active: activeRightTab === 'layout' }"
              @click="activeRightTab = 'layout'"
            >
              <Sliders :size="13" />
              <span>Tata Letak</span>
            </button>
            <button
              class="insp-tab-btn"
              :class="{ active: activeRightTab === 'appearance' }"
              @click="activeRightTab = 'appearance'"
            >
              <Palette :size="13" />
              <span>Visual</span>
            </button>
          </div>

          <!-- Inspector Content Body -->
          <div class="inspector-scroll-area">
            <template v-if="selectedBlock">
              <!-- Selected Block Header Card -->
              <div class="selected-block-card">
                <div class="block-card-top">
                  <span class="badge-block-type">{{ selectedBlock.type.toUpperCase() }}</span>
                  <span class="badge-block-status">
                    <span class="status-indicator-dot"></span>
                    Aktif
                  </span>
                </div>
                <h3 class="block-card-title">{{ selectedBlock.name }}</h3>
              </div>

              <!-- TAB 1: KONTEN TEKS & TOMBOL -->
              <div v-if="activeRightTab === 'content'" class="tab-pane-inspector">
                <!-- Badge Text -->
                <div v-if="selectedBlock.badge !== undefined" class="field-item">
                  <label class="field-label">Label Kategori / Badge</label>
                  <div class="field-input-box">
                    <input
                      type="text"
                      v-model="selectedBlock.badge"
                      class="field-input"
                      placeholder="Misal: DOCKER RUNTIME"
                    />
                  </div>
                </div>

                <!-- Title / Headline -->
                <div class="field-item">
                  <label class="field-label">Judul Utama (Headline)</label>
                  <div class="field-input-box">
                    <input
                      type="text"
                      v-model="selectedBlock.title"
                      class="field-input"
                      placeholder="Judul bagian..."
                    />
                  </div>
                </div>

                <!-- Subtitle / Deskripsi -->
                <div v-if="selectedBlock.subtitle !== undefined" class="field-item">
                  <label class="field-label">Deskripsi / Sub-Headline</label>
                  <div class="field-input-box">
                    <textarea
                      v-model="selectedBlock.subtitle"
                      class="field-textarea"
                      rows="3"
                      placeholder="Deskripsi penjelasan..."
                    ></textarea>
                  </div>
                </div>

                <!-- Primary Button -->
                <div v-if="selectedBlock.buttonText !== undefined" class="field-item">
                  <label class="field-label">Label Tombol Aksi (CTA)</label>
                  <div class="field-input-box">
                    <input
                      type="text"
                      v-model="selectedBlock.buttonText"
                      class="field-input"
                      placeholder="Misal: Mulai Sekarang"
                    />
                  </div>
                </div>

                <!-- Secondary Button (Hero) -->
                <div v-if="selectedBlock.secondaryButtonText !== undefined" class="field-item">
                  <label class="field-label">Tombol Sekunder</label>
                  <div class="field-input-box">
                    <input
                      type="text"
                      v-model="selectedBlock.secondaryButtonText"
                      class="field-input"
                      placeholder="Misal: Pelajari Sistem"
                    />
                  </div>
                </div>
              </div>

              <!-- TAB 2: TATA LETAK & SPACING -->
              <div v-else-if="activeRightTab === 'layout'" class="tab-pane-inspector">
                <div class="field-item">
                  <div class="field-label-split">
                    <label class="field-label">Padding Vertikal (Atas/Bawah)</label>
                    <span class="field-val-badge">{{ selectedBlock.styles?.paddingY || 40 }}px</span>
                  </div>
                  <input
                    type="range"
                    min="16"
                    max="140"
                    step="4"
                    :value="selectedBlock.styles?.paddingY || 40"
                    @input="selectedBlock.styles ? (selectedBlock.styles.paddingY = parseInt(($event.target as HTMLInputElement).value)) : null"
                    class="range-slider"
                  />
                </div>

                <div class="field-item">
                  <label class="field-label">Perataan Teks (Alignment)</label>
                  <div class="align-buttons-group">
                    <button
                      class="align-btn"
                      :class="{ active: selectedBlock.styles?.align === 'left' }"
                      @click="selectedBlock.styles ? (selectedBlock.styles.align = 'left') : null"
                    >
                      <AlignLeft :size="13" />
                      <span>Kiri</span>
                    </button>
                    <button
                      class="align-btn"
                      :class="{ active: selectedBlock.styles?.align === 'center' || !selectedBlock.styles?.align }"
                      @click="selectedBlock.styles ? (selectedBlock.styles.align = 'center') : null"
                    >
                      <AlignCenter :size="13" />
                      <span>Tengah</span>
                    </button>
                    <button
                      class="align-btn"
                      :class="{ active: selectedBlock.styles?.align === 'right' }"
                      @click="selectedBlock.styles ? (selectedBlock.styles.align = 'right') : null"
                    >
                      <AlignRight :size="13" />
                      <span>Kanan</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- TAB 3: VISUAL & EFFECTS -->
              <div v-else class="tab-pane-inspector">
                <div class="field-item">
                  <label class="field-label">Mode Latar Belakang (Background)</label>
                  <div class="bgmode-selector-matrix">
                    <button
                      class="bgmode-btn"
                      :class="{ active: selectedBlock.styles?.bgMode === 'transparent' || !selectedBlock.styles?.bgMode }"
                      @click="selectedBlock.styles ? (selectedBlock.styles.bgMode = 'transparent') : null"
                    >
                      Transparan
                    </button>
                    <button
                      class="bgmode-btn"
                      :class="{ active: selectedBlock.styles?.bgMode === 'glass' }"
                      @click="selectedBlock.styles ? (selectedBlock.styles.bgMode = 'glass') : null"
                    >
                      Glassmorphism
                    </button>
                  </div>
                </div>

                <div class="field-item" style="margin-top: 20px;">
                  <label class="field-label">Aksi Cepat Section</label>
                  <div class="block-quick-actions">
                    <button class="btn-quick-outline" @click="duplicateBlock(selectedBlock.id)">
                      <Copy :size="13" />
                      <span>Duplikat Section</span>
                    </button>
                    <button class="btn-quick-outline danger" @click="deleteBlock(selectedBlock.id)">
                      <Trash2 :size="13" />
                      <span>Hapus Section</span>
                    </button>
                  </div>
                </div>
              </div>
            </template>

            <!-- Fallback When No Block is Selected -->
            <div v-else class="empty-inspector-state">
              <MousePointer :size="28" color="#94a3b8" />
              <p>Pilih salah satu komponen di kanvas atau daftar layers untuk mengedit konten dan gayanya.</p>
            </div>
          </div>
        </aside>
      </div>

      <!-- =================================================================== -->
      <!-- 3. CODE & SCHEMA MODAL (Canva / Developer Inspector)                 -->
      <!-- =================================================================== -->
      <div v-if="isCodeModalOpen" class="code-modal-backdrop" @click.self="isCodeModalOpen = false">
        <div class="code-modal-card">
          <div class="modal-header">
            <div class="modal-title-wrap">
              <FileCode :size="18" color="#2563eb" />
              <h4>Struktur Schema JSON Website</h4>
            </div>
            <button class="btn-modal-close" @click="isCodeModalOpen = false">
              <X :size="16" />
            </button>
          </div>
          <div class="modal-body">
            <pre class="schema-code-block">{{ schemaJsonText }}</pre>
          </div>
          <div class="modal-footer">
            <button class="btn-copy-schema" @click="copySchemaJson">
              <Copy :size="14" />
              <span>Salin Schema JSON</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* -----------------------------------------------------------------------------
 * Visual Studio Main Root & Reset
 * --------------------------------------------------------------------------- */
.visual-studio-root {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  min-height: 100vh;
  background: #f8fafc;
  border-radius: 0;
  overflow: hidden;
  border: none;
}

.studio-main-frame {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
  position: relative;
  transition: opacity 0.3s ease;
}

.studio-main-frame:not(.is-revealed) {
  opacity: 0;
  pointer-events: none;
}

.studio-main-frame.is-revealed {
  opacity: 1;
}

/* -----------------------------------------------------------------------------
 * Seamless Entrance Animations for Studio Sections
 * --------------------------------------------------------------------------- */
.studio-main-frame.is-revealed .studio-command-bar {
  animation: studioRevealTop 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes studioRevealTop {
  0% {
    opacity: 0;
    transform: translateY(-8px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* -----------------------------------------------------------------------------
 * 1. Top Command Bar (Harmonized Heights & Clean Alignment)
 * --------------------------------------------------------------------------- */
.studio-command-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 52px;
  padding: 0 16px;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  gap: 12px;
  flex-shrink: 0;
  z-index: 50;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.03);
}

.btn-back-dashboard {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 12px;
  background: #0f172a;
  color: #ffffff;
  border: 1px solid transparent;
  border-radius: 8px;
  font-size: 0.76rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  flex-shrink: 0;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.1);
}

.btn-back-dashboard:hover {
  background: #1e293b;
  transform: translateX(-1px);
}

.btn-toggle-sidebar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  border-radius: 8px;
  color: #475569;
  cursor: pointer;
  transition: all 0.15s ease;
  flex-shrink: 0;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.03);
}

.btn-toggle-sidebar:hover {
  background: #f8fafc;
  color: #0f172a;
  border-color: #cbd5e1;
}

.btn-toggle-sidebar.active {
  background: #0f172a;
  border-color: #0f172a;
  color: #ffffff;
}

.cmd-left-group {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.cmd-center-group {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 1;
  min-width: 0;
  overflow: hidden;
}

.cmd-right-group {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0 !important;
  margin-left: auto;
}

.v-divider {
  width: 1px;
  height: 20px;
  background: #e2e8f0;
  margin: 0 3px;
  flex-shrink: 0;
}

.site-dropdown-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  z-index: 60;
}

.site-target-pill {
  appearance: none;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 32px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0 10px;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.03);
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s ease;
  user-select: none;
}

.site-target-pill:hover,
.site-target-pill.is-open {
  background: #ffffff;
  border-color: #cbd5e1;
  box-shadow: 0 2px 5px rgba(15, 23, 42, 0.06);
}

.pulse-status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.25);
  flex-shrink: 0;
}

.pill-label {
  font-size: 0.7rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  flex-shrink: 0;
}

.site-display-name {
  font-size: 0.8rem;
  font-weight: 700;
  color: #0f172a;
  max-width: 190px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.site-display-subdomain {
  font-size: 0.76rem;
  font-weight: 500;
  color: #64748b;
  max-width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.site-chevron-icon {
  color: #64748b;
  transition: transform 0.2s ease, color 0.15s ease;
  flex-shrink: 0;
  margin-left: 2px;
}

.site-chevron-icon.is-rotated {
  transform: rotate(180deg);
  color: #0f172a;
}

.site-floating-dropdown {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  min-width: 320px;
  max-width: 380px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 12px 28px -6px rgba(15, 23, 42, 0.12), 0 8px 12px -6px rgba(15, 23, 42, 0.06);
  padding: 6px;
  z-index: 1000;
  box-sizing: border-box;
}

.site-dropdown-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px 8px 10px;
  border-bottom: 1px solid #f1f5f9;
  margin-bottom: 4px;
}

.site-dropdown-header-left {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.site-dropdown-title {
  font-size: 0.72rem;
  font-weight: 700;
  color: #0f172a;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.site-dropdown-subtitle {
  font-size: 0.65rem;
  color: #94a3b8;
}

.site-dropdown-count-badge {
  font-size: 0.65rem;
  font-weight: 700;
  padding: 2px 7px;
  background: #f1f5f9;
  color: #475569;
  border-radius: 9999px;
  border: 1px solid #e2e8f0;
}

.site-dropdown-list {
  display: flex;
  flex-direction: column;
  gap: 3px;
  max-height: 260px;
  overflow-y: auto;
  padding: 2px 0;
}

.site-item-btn {
  appearance: none;
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid transparent;
  background: transparent;
  text-align: left;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: inherit;
  box-sizing: border-box;
}

.site-item-btn:hover {
  background: #f8fafc;
  border-color: #f1f5f9;
}

.site-item-btn.active {
  background: #f8fafc;
  border-color: #e2e8f0;
}

.site-item-icon-box {
  width: 30px;
  height: 30px;
  border-radius: 7px;
  background: #f1f5f9;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.15s ease;
}

.site-item-btn:hover .site-item-icon-box {
  background: #e2e8f0;
  color: #0f172a;
}

.site-item-btn.active .site-item-icon-box {
  background: #0f172a;
  color: #ffffff;
}

.site-item-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.site-item-row-top {
  display: flex;
  align-items: center;
  gap: 6px;
}

.site-item-name {
  font-size: 0.78rem;
  font-weight: 600;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.site-item-btn.active .site-item-name {
  font-weight: 700;
  color: #0f172a;
}

.site-item-active-badge {
  font-size: 0.6rem;
  font-weight: 700;
  background: #dcfce7;
  color: #15803d;
  padding: 1px 5px;
  border-radius: 4px;
  flex-shrink: 0;
}

.site-item-domain {
  font-size: 0.68rem;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.site-item-action {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  flex-shrink: 0;
}

.site-item-check-icon {
  color: #0f172a;
}

.dropdown-scale-enter-active,
.dropdown-scale-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
  transform-origin: top left;
}

.dropdown-scale-enter-from,
.dropdown-scale-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.97);
}

.tools-segment,
.history-segment,
.canvas-helpers-segment {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  height: 32px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 2px;
}

.tool-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  border-radius: 6px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.15s ease;
}

.tool-btn:hover:not(:disabled) {
  background: #ffffff;
  color: #0f172a;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.tool-btn.active {
  background: #0f172a;
  color: #ffffff;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.2);
}

.tool-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

/* Device Switcher Dock */
.device-switcher-dock {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  height: 32px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 2px;
}

.dev-dock-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 28px;
  border: none;
  background: transparent;
  padding: 0 9px;
  border-radius: 6px;
  font-size: 0.74rem;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.15s ease;
}

.dev-dock-btn:hover {
  color: #0f172a;
}

.dev-dock-btn.active {
  background: #ffffff;
  color: #0f172a;
  font-weight: 700;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.06);
}

.dimension-hud {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0 5px 0 9px;
  font-size: 0.74rem;
  font-weight: 600;
  color: #334155;
  white-space: nowrap;
  flex-shrink: 0;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.03);
  user-select: none;
}

.dim-metric {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.dim-tag {
  font-size: 0.63rem;
  font-weight: 800;
  color: #64748b;
  text-transform: uppercase;
  background: #f1f5f9;
  border-radius: 4px;
  padding: 1px 4px;
  line-height: 1.2;
}

.dim-number {
  font-size: 0.76rem;
  font-weight: 700;
  color: #0f172a;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  letter-spacing: -0.01em;
}

.dim-multiplier {
  font-size: 0.72rem;
  font-weight: 600;
  color: #94a3b8;
  margin: 0 1px;
}

@media (max-width: 1380px) {
  .dimension-hud {
    display: none;
  }
}

@media (max-width: 1200px) {
  .dev-dock-btn span {
    display: none;
  }
}

.dim-sep {
  width: 1px;
  height: 16px;
  background: #e2e8f0;
  margin: 0 2px;
}

.btn-rotate-mini {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: #64748b;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.btn-rotate-mini:hover {
  background: #f1f5f9;
  color: #0f172a;
  transform: rotate(-90deg);
}

/* Zoom Controls */
.zoom-controls-cluster {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  height: 32px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 2px 6px;
}

.btn-zoom-icon,
.btn-zoom-fit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border: none;
  background: transparent;
  color: #64748b;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-zoom-icon:hover,
.btn-zoom-fit:hover {
  background: #ffffff;
  color: #0f172a;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}

.btn-zoom-icon.active {
  background: #0f172a;
  color: #ffffff;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.18);
}

.zoom-v-sep {
  width: 1px;
  height: 14px;
  background: #e2e8f0;
  margin: 0 2px;
}

.zoom-slider-wrap {
  display: none;
}

.zoom-dropdown-pill {
  position: relative;
  font-size: 0.74rem;
  font-weight: 700;
  color: #0f172a;
  padding: 0 5px;
  cursor: pointer;
  font-family: ui-monospace, SFMono-Regular, monospace;
}

.zoom-select-hidden {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

/* View Mode Switcher */
.viewmode-toggle-group {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  height: 32px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 2px;
}

.vmode-btn {
  border: none;
  background: transparent;
  height: 28px;
  padding: 0 10px;
  border-radius: 6px;
  font-size: 0.74rem;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.15s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.vmode-btn.active {
  background: #ffffff;
  color: #0f172a;
  font-weight: 700;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.06);
}

.btn-publish-live {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  background: #0f172a;
  color: #ffffff;
  border: 1px solid #1e293b;
  padding: 0 14px;
  border-radius: 8px;
  font-size: 0.76rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.18);
  transition: all 0.15s ease;
  flex-shrink: 0 !important;
  white-space: nowrap;
}

.btn-publish-live:hover:not(:disabled) {
  background: #1e293b;
  border-color: #334155;
  transform: translateY(-0.5px);
  box-shadow: 0 3px 8px rgba(15, 23, 42, 0.28);
}

.spin-ring-sm {
  width: 12px;
  height: 12px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* -----------------------------------------------------------------------------
 * 2. Panes Layout: Left Dock | Infinite Canvas | Right Inspector
 * --------------------------------------------------------------------------- */
.studio-panes-container {
  display: flex;
  flex: 1;
  width: 100%;
  height: calc(100% - 52px);
  overflow: hidden;
  position: relative;
}

/* Left Studio Dock */
.studio-left-dock {
  width: 290px;
  height: 100%;
  background: #ffffff;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  z-index: 20;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
              margin-left 0.3s cubic-bezier(0.16, 1, 0.3, 1),
              opacity 0.25s ease;
  will-change: transform, margin-left, opacity;
}

.studio-left-dock.dock-hidden {
  transform: translateX(-100%);
  margin-left: -290px;
  opacity: 0;
  pointer-events: none;
}

.left-dock-tabs {
  display: flex;
  gap: 2px;
  padding: 3px;
  margin: 10px 12px 10px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.dock-tab-item {
  flex: 1;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  border: none;
  background: transparent;
  border-radius: 6px;
  font-size: 0.72rem;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.15s ease;
}

.dock-tab-item:hover {
  color: #0f172a;
}

.dock-tab-item.active {
  background: #ffffff;
  color: #0f172a;
  font-weight: 700;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.08);
}

.dock-tab-body {
  flex: 1;
  overflow-y: auto;
  padding: 12px 14px 20px;
}

.dock-section-head {
  margin-bottom: 12px;
}

.dock-section-head h4 {
  font-size: 0.82rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 3px;
  letter-spacing: -0.01em;
}

.dock-section-head p {
  font-size: 0.72rem;
  color: #64748b;
  margin: 0;
  line-height: 1.4;
}

/* Block Cards Grid - Obsidian HeroCMS Theme */
.block-cards-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.block-add-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.02);
}

.block-add-card:hover {
  border-color: #0f172a;
  background: #f8fafc;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px -2px rgba(15, 23, 42, 0.08);
}

.card-icon-bubble {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  box-shadow: 0 2px 6px -1px rgba(15, 23, 42, 0.2);
  flex-shrink: 0;
}

.block-add-card:hover .card-icon-bubble {
  background: #1e293b;
  color: #ffffff;
}

.card-meta {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-meta strong {
  font-size: 0.78rem;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.25;
}

.card-meta span {
  font-size: 0.68rem;
  color: #64748b;
  line-height: 1.35;
  margin-top: 2px;
}

.icon-add-plus {
  color: #94a3b8;
  transition: all 0.15s ease;
}

.block-add-card:hover .icon-add-plus {
  color: #0f172a;
  transform: scale(1.15);
}

/* Layers List - Theme Harmonized */
.layers-list-tree {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.layer-row-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.76rem;
  font-weight: 600;
  color: #334155;
  transition: all 0.15s ease;
}

.layer-row-item:hover {
  border-color: #0f172a;
  background: #f8fafc;
}

.layer-row-item.selected {
  background: #0f172a;
  border-color: #0f172a;
  color: #ffffff;
  box-shadow: 0 2px 8px -1px rgba(15, 23, 42, 0.25);
}

.layer-row-item.selected .layer-name-text {
  color: #ffffff;
  font-weight: 600;
}

.layer-type-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #94a3b8;
  flex-shrink: 0;
}

.layer-row-item.selected .layer-type-dot {
  background: #ffffff;
}

.layer-name-text {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.layer-actions-group {
  display: flex;
  align-items: center;
  gap: 3px;
  opacity: 0.6;
}

.layer-row-item:hover .layer-actions-group,
.layer-row-item.selected .layer-actions-group {
  opacity: 1;
}

.icon-layer-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: none;
  background: transparent;
  color: #64748b;
  border-radius: 4px;
  cursor: pointer;
}

.icon-layer-btn:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.layer-row-item.selected .icon-layer-btn {
  color: #94a3b8;
}

.layer-row-item.selected .icon-layer-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
}

/* Design Tokens - Curated Palette Grid */
.color-palette-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
  margin-top: 8px;
  width: 100%;
  box-sizing: border-box;
}

.palette-card-btn {
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 6px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  cursor: pointer;
  transition: all 0.15s ease;
  text-align: left;
  outline: none;
  box-sizing: border-box;
  min-width: 0;
  width: 100%;
}

.palette-card-btn:hover {
  border-color: #cbd5e1;
  background: #f8fafc;
}

.palette-card-btn.active {
  border-color: #94a3b8;
  background: #f1f5f9;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
}

.palette-swatch-dot {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.12);
}

.palette-meta {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.palette-name {
  font-size: 0.7rem;
  font-weight: 600;
  color: #334155;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;
  transition: color 0.15s ease;
}

.palette-card-btn.active .palette-name {
  font-weight: 700;
  color: #0f172a;
}

.palette-hex {
  font-size: 0.62rem;
  font-family: ui-monospace, SFMono-Regular, monospace;
  color: #64748b;
  line-height: 1.2;
}

.palette-card-btn.active .palette-hex {
  color: #475569;
}

.token-lbl {
  font-size: 0.72rem;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  display: block;
}

.token-select-input {
  width: 100%;
  height: 34px;
  padding: 0 10px;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  font-size: 0.78rem;
  font-weight: 600;
  color: #0f172a;
  margin-top: 6px;
  outline: none;
  transition: all 0.15s ease;
}

.token-select-input:hover {
  border-color: #94a3b8;
}

.token-select-input:focus {
  border-color: #0f172a;
  box-shadow: 0 0 0 2px rgba(15, 23, 42, 0.1);
}

.blueprint-badge-box {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 7px;
  margin-top: 6px;
}

.blueprint-icon-box {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: #0f172a;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.blueprint-meta strong {
  display: block;
  font-size: 0.76rem;
  font-weight: 700;
  color: #0f172a;
}

.blueprint-meta span {
  font-size: 0.66rem;
  color: #64748b;
}

/* AI Copilot - Refined Obsidian Theme */
.ai-prompt-area {
  width: 100%;
  padding: 9px 11px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  background: #ffffff;
  font-size: 0.78rem;
  font-weight: 500;
  color: #0f172a;
  resize: vertical;
  min-height: 76px;
  margin-bottom: 10px;
  outline: none;
  font-family: inherit;
  line-height: 1.45;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.03);
  transition: all 0.15s ease;
  box-sizing: border-box;
}

.ai-prompt-area:hover {
  border-color: #94a3b8;
}

.ai-prompt-area:focus {
  border-color: #0f172a;
  background: #ffffff;
  box-shadow: 0 0 0 2px rgba(15, 23, 42, 0.1);
}

.btn-generate-ai {
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 34px;
  padding: 0 14px;
  border-radius: 6px;
  border: 1px solid #0f172a;
  background: #0f172a;
  color: #ffffff;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.15);
  margin-bottom: 14px;
  transition: all 0.15s ease;
}

.btn-generate-ai:hover:not(:disabled) {
  background: #1e293b;
  border-color: #1e293b;
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(15, 23, 42, 0.25);
}

.btn-generate-ai:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.prompt-presets-list {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.preset-title {
  font-size: 0.68rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 2px;
}

.preset-chip {
  text-align: left;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  padding: 8px 10px;
  border-radius: 6px;
  font-size: 0.74rem;
  font-weight: 600;
  color: #334155;
  cursor: pointer;
  transition: all 0.15s ease;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.02);
}

.preset-chip:hover {
  background: #f8fafc;
  border-color: #0f172a;
  color: #0f172a;
  transform: translateX(2px);
}

/* -----------------------------------------------------------------------------
 * 3. Center Workspace: Dual Engine (Canvas & VS Code Editor)
 * --------------------------------------------------------------------------- */
.studio-center-workspace {
  flex: 1;
  height: 100%;
  position: relative;
  overflow: hidden;
  min-width: 0;
  display: flex;
  background: #181818;
}

.studio-viewport-area {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #f1f5f9;
  user-select: none;
  transition: opacity 0.35s ease, visibility 0s linear 0s;
  opacity: 1;
  visibility: visible;
  z-index: 1;
}

.studio-viewport-area.is-view-hidden {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: opacity 0.3s ease, visibility 0s linear 0.3s;
}

.studio-viewport-area.grid-dots-visible {
  background-image: radial-gradient(#cbd5e1 1.2px, transparent 1.2px);
  background-size: 24px 24px;
}

.studio-viewport-area.tool-hand-active {
  cursor: grab;
}

.studio-viewport-area.is-dragging-canvas {
  cursor: grabbing !important;
}

/* Coordinate Rulers */
.canvas-ruler-top {
  position: absolute;
  top: 0;
  left: 24px;
  right: 0;
  height: 20px;
  background: #ffffff;
  border-bottom: 1px solid #cbd5e1;
  z-index: 15;
  overflow: hidden;
}

.ruler-tick-cluster {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
}

.ruler-mark {
  position: absolute;
  top: 2px;
  font-size: 0.58rem;
  font-weight: 700;
  color: #94a3b8;
  font-family: monospace;
  padding-left: 2px;
  border-left: 1px solid #cbd5e1;
  height: 16px;
}

.canvas-ruler-left {
  position: absolute;
  top: 20px;
  left: 0;
  bottom: 0;
  width: 24px;
  background: #ffffff;
  border-right: 1px solid #cbd5e1;
  z-index: 15;
  overflow: hidden;
}

.ruler-tick-cluster-v {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}

.ruler-mark-v {
  position: absolute;
  left: 2px;
  font-size: 0.58rem;
  font-weight: 700;
  color: #94a3b8;
  font-family: monospace;
  border-top: 1px solid #cbd5e1;
  width: 20px;
}

.canvas-coords-badge {
  position: absolute;
  bottom: 12px;
  left: 36px;
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(8px);
  color: #f8fafc;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.68rem;
  font-family: monospace;
  font-weight: 600;
  z-index: 20;
}

.hud-sep {
  opacity: 0.4;
}

/* Artboard Transform Wrapper */
.artboard-transform-wrapper {
  position: absolute;
  top: 36px;
  left: 50%;
  transition: transform 0.05s ease-out;
  display: flex;
  justify-content: center;
  padding-bottom: 240px;
}

/* Artboard Frame */
.artboard-frame {
  position: relative;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 20px 45px -10px rgba(15, 23, 42, 0.15), 0 0 0 1px rgba(15, 23, 42, 0.08);
  display: flex;
  flex-direction: column;
}

.artboard-window-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 38px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  border-radius: 12px 12px 0 0;
  padding: 0 14px;
}

.window-traffic-dots {
  display: flex;
  gap: 6px;
}

.window-traffic-dots .dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.dot.red { background: #ef4444; }
.dot.yellow { background: #f59e0b; }
.dot.green { background: #10b981; }

.window-url-capsule {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 3px 12px;
  font-size: 0.72rem;
  font-family: monospace;
  font-weight: 600;
  color: #334155;
}

.window-ingress-tag {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.68rem;
  font-weight: 700;
  color: #10b981;
}

.live-dot-mini {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10b981;
}

/* Rendered Website Surface */
.website-rendered-surface {
  position: relative;
  background: #ffffff;
  border-radius: 0 0 12px 12px;
  overflow: hidden;
}

/* Block Node Wrapper */
.block-node-wrapper {
  position: relative;
  cursor: pointer;
  transition: outline 0.15s ease;
}

.block-node-wrapper.is-hovered:not(.is-selected) {
  outline: 1.5px dashed #93c5fd;
  outline-offset: -1.5px;
}

.block-node-wrapper.is-selected {
  outline: 2px solid #2563eb;
  outline-offset: -2px;
}

/* Selection Bounding Box Overlay & Floating Toolbar */
.selection-overlay-box {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 30;
}

.corner-anchor {
  position: absolute;
  width: 8px;
  height: 8px;
  background: #ffffff;
  border: 2px solid #2563eb;
  border-radius: 2px;
}

.corner-anchor.tl { top: -4px; left: -4px; }
.corner-anchor.tr { top: -4px; right: -4px; }
.corner-anchor.bl { bottom: -4px; left: -4px; }
.corner-anchor.br { bottom: -4px; right: -4px; }

.floating-selection-bar {
  position: absolute;
  top: -42px;
  left: 20px;
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 4px;
  background: #0f172a;
  color: #ffffff;
  padding: 4px 8px;
  border-radius: 8px;
  box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.3);
  z-index: 40;
}

.selection-tag-pill {
  font-size: 0.68rem;
  font-weight: 800;
  color: #60a5fa;
  letter-spacing: 0.04em;
  padding-right: 4px;
}

.bar-divider {
  width: 1px;
  height: 14px;
  background: rgba(255, 255, 255, 0.2);
  margin: 0 3px;
}

.float-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border: none;
  background: transparent;
  color: #cbd5e1;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s;
}

.float-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
}

.float-btn.delete:hover {
  background: #ef4444;
  color: #ffffff;
}

/* -----------------------------------------------------------------------------
 * Artboard Resize Handles
 * --------------------------------------------------------------------------- */
.artboard-resize-handles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.resize-handle {
  position: absolute;
  pointer-events: auto;
  z-index: 25;
}

.handle-right {
  top: 0;
  right: -10px;
  width: 14px;
  height: 100%;
  cursor: ew-resize;
  display: flex;
  align-items: center;
  justify-content: center;
}

.handle-pill-grip {
  width: 4px;
  height: 48px;
  background: #94a3b8;
  border-radius: 4px;
  transition: all 0.15s;
}

.handle-right:hover .handle-pill-grip {
  background: #2563eb;
  width: 6px;
  height: 64px;
}

.handle-bottom {
  bottom: -10px;
  left: 0;
  width: 100%;
  height: 14px;
  cursor: ns-resize;
  display: flex;
  align-items: center;
  justify-content: center;
}

.handle-pill-grip-h {
  width: 48px;
  height: 4px;
  background: #94a3b8;
  border-radius: 4px;
  transition: all 0.15s;
}

.handle-bottom:hover .handle-pill-grip-h {
  background: #2563eb;
  width: 64px;
  height: 6px;
}

.handle-corner {
  bottom: -12px;
  right: -12px;
  width: 24px;
  height: 24px;
  cursor: nwse-resize;
  display: flex;
  align-items: center;
  justify-content: center;
}

.corner-dot-grip {
  width: 12px;
  height: 12px;
  background: #2563eb;
  border: 2px solid #ffffff;
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  transition: transform 0.15s;
}

.handle-corner:hover .corner-dot-grip {
  transform: scale(1.3);
}

/* -----------------------------------------------------------------------------
 * Rendered Block Designs (Clean & Modern CSS)
 * --------------------------------------------------------------------------- */
/* 1. Navbar */
.rendered-nav-block {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(226, 232, 240, 0.7);
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(16px);
}

.site-brand-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 800;
  font-size: 1.05rem;
}

.brand-cube-icon {
  font-size: 0.95rem;
}

.nav-links-cluster {
  display: flex;
  align-items: center;
  gap: 20px;
}

.nav-anchor {
  font-size: 0.85rem;
  font-weight: 600;
  color: #475569;
  text-decoration: none;
  transition: color 0.15s;
}

.nav-anchor:hover,
.nav-anchor.active {
  color: #0f172a;
}

.btn-nav-action {
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  color: #ffffff;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
}

/* 2. Hero Section */
.rendered-hero-block {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.ambient-mesh-glow {
  position: absolute;
  top: -20%;
  left: 15%;
  width: 70%;
  height: 140%;
  pointer-events: none;
  z-index: 0;
}

.hero-badge-tag {
  display: inline-flex;
  align-items: center;
  padding: 5px 14px;
  border-radius: 20px;
  border: 1px solid;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  margin-bottom: 18px;
  z-index: 1;
}

.hero-main-heading {
  font-size: 2.8rem;
  font-weight: 900;
  color: #0f172a;
  letter-spacing: -0.03em;
  line-height: 1.15;
  max-width: 850px;
  margin: 0 0 16px;
  z-index: 1;
}

.hero-bio-lead {
  font-size: 1.1rem;
  color: #64748b;
  max-width: 680px;
  line-height: 1.6;
  margin: 0 0 28px;
  z-index: 1;
}

.hero-cta-cluster {
  display: flex;
  align-items: center;
  gap: 14px;
  z-index: 1;
}

.btn-primary-glow {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 10px;
  border: none;
  color: #ffffff;
  font-size: 0.92rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3);
}

.btn-secondary-clean {
  padding: 12px 22px;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  color: #0f172a;
  font-size: 0.92rem;
  font-weight: 700;
  cursor: pointer;
}

/* 3. Features */
.rendered-features-block {
  max-width: 1200px;
  margin: 0 auto;
}

.section-title-wrap {
  text-align: center;
  margin-bottom: 40px;
}

.badge-mini-caps {
  font-size: 0.72rem;
  font-weight: 800;
  color: var(--accent-brand);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.sec-headline {
  font-size: 1.9rem;
  font-weight: 850;
  color: #0f172a;
  letter-spacing: -0.02em;
  margin: 6px 0 10px;
}

.sec-lead {
  font-size: 0.95rem;
  color: #64748b;
  max-width: 600px;
  margin: 0 auto;
}

.features-cards-trio {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.feature-bento-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
  transition: transform 0.2s ease;
}

.feature-bento-card:hover {
  transform: translateY(-3px);
}

.card-icon-pill {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.card-item-title {
  font-size: 1.05rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 8px;
}

.card-item-desc {
  font-size: 0.85rem;
  color: #64748b;
  line-height: 1.5;
  margin: 0;
}

/* 4. Pricing */
.rendered-pricing-block {
  max-width: 1100px;
  margin: 0 auto;
}

.pricing-cards-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.price-tier-card {
  position: relative;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 30px 24px;
  display: flex;
  flex-direction: column;
}

.price-tier-card.featured {
  border-color: var(--accent-brand);
  box-shadow: 0 10px 25px -4px rgba(37, 99, 235, 0.15);
}

.tier-tag-pill {
  position: absolute;
  top: -12px;
  right: 20px;
  color: #ffffff;
  font-size: 0.68rem;
  font-weight: 800;
  text-transform: uppercase;
  padding: 3px 10px;
  border-radius: 12px;
}

.tier-name {
  font-size: 1.15rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 12px;
}

.tier-price-val {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 8px;
}

.price-num {
  font-size: 1.8rem;
  font-weight: 900;
  color: #0f172a;
}

.price-cycle {
  font-size: 0.85rem;
  color: #64748b;
}

.tier-desc {
  font-size: 0.82rem;
  color: #64748b;
  margin: 0 0 18px;
  line-height: 1.4;
}

.tier-feature-list {
  list-style: none;
  padding: 0;
  margin: 0 0 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}

.tier-feature-list li {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.82rem;
  color: #334155;
}

.btn-tier-action {
  width: 100%;
  padding: 10px;
  border-radius: 9px;
  border: none;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
}

/* 5. CTA */
.rendered-cta-block {
  max-width: 1000px;
  margin: 0 auto;
}

.cta-inner-banner {
  border: 1px solid;
  border-radius: 20px;
  padding: 44px 32px;
  text-align: center;
}

.cta-heading {
  font-size: 1.8rem;
  font-weight: 850;
  color: #0f172a;
  margin: 0 0 10px;
}

.cta-lead {
  font-size: 1rem;
  color: #64748b;
  max-width: 550px;
  margin: 0 auto 24px;
}

.btn-cta-big {
  padding: 12px 28px;
  border-radius: 10px;
  border: none;
  color: #ffffff;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3);
}

/* 6. Footer */
.rendered-footer-block {
  max-width: 1200px;
  margin: 0 auto;
}

.footer-divider-line {
  height: 1px;
  background: #e2e8f0;
  margin-bottom: 24px;
}

.footer-content-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: #0f172a;
}

.footer-copy {
  font-size: 0.8rem;
  color: #64748b;
  margin: 0;
}

/* -----------------------------------------------------------------------------
 * 4. Right Inspector Dock (Modern High-Fidelity Design System)
 * --------------------------------------------------------------------------- */
.studio-right-inspector {
  width: 320px;
  height: 100%;
  background: #ffffff;
  border-left: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  z-index: 20;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
              margin-right 0.3s cubic-bezier(0.16, 1, 0.3, 1),
              opacity 0.25s ease;
  will-change: transform, margin-right, opacity;
}

.studio-right-inspector.dock-hidden {
  transform: translateX(100%);
  margin-right: -320px;
  opacity: 0;
  pointer-events: none;
}

.inspector-tabs-bar {
  display: flex;
  gap: 2px;
  padding: 3px;
  margin: 10px 14px 10px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.insp-tab-btn {
  flex: 1;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: none;
  background: transparent;
  border-radius: 6px;
  font-size: 0.74rem;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.15s ease;
}

.insp-tab-btn:hover {
  color: #0f172a;
}

.insp-tab-btn.active {
  background: #0f172a;
  color: #ffffff;
  font-weight: 600;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.15);
}

.inspector-scroll-area {
  flex: 1;
  overflow-y: auto;
  padding: 10px 14px 20px;
}

/* Selected Block Card - Refined HeroCMS Obsidian */
.selected-block-card {
  padding: 12px 14px;
  margin-bottom: 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.02);
}

.block-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.badge-block-type {
  font-size: 0.62rem;
  font-weight: 700;
  color: #ffffff;
  background: #0f172a;
  border: 1px solid #0f172a;
  padding: 2px 7px;
  border-radius: 4px;
  letter-spacing: 0.06em;
}

.badge-block-status {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.68rem;
  font-weight: 600;
  color: #059669;
  background: #ecfdf5;
  border: 1px solid #d1fae5;
  padding: 1px 7px;
  border-radius: 9999px;
}

.status-indicator-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.25);
}

.block-card-title {
  font-size: 0.92rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  line-height: 1.35;
  letter-spacing: -0.01em;
}

/* Form Fields & High-Fidelity Inputs */
.field-item {
  margin-bottom: 16px;
}

.field-label {
  display: block;
  font-size: 0.72rem;
  font-weight: 700;
  color: #334155;
  margin-bottom: 6px;
  letter-spacing: 0.01em;
}

.field-label-split {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.field-val-badge {
  font-size: 0.7rem;
  font-weight: 700;
  color: #0f172a;
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  padding: 2px 7px;
  border-radius: 4px;
  font-family: ui-monospace, SFMono-Regular, monospace;
}

.field-input-box {
  position: relative;
  width: 100%;
}

.field-input {
  width: 100%;
  height: 36px;
  padding: 0 11px;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 500;
  color: #0f172a;
  font-family: inherit;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.02);
  transition: all 0.15s ease;
  outline: none;
  box-sizing: border-box;
}

.field-input::placeholder {
  color: #94a3b8;
  font-weight: 400;
}

.field-input:hover {
  border-color: #94a3b8;
}

.field-input:focus {
  border-color: #0f172a;
  background: #ffffff;
  box-shadow: 0 0 0 2px rgba(15, 23, 42, 0.08);
}

.field-textarea {
  width: 100%;
  min-height: 76px;
  padding: 9px 11px;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 500;
  color: #0f172a;
  font-family: inherit;
  line-height: 1.45;
  resize: vertical;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.02);
  transition: all 0.15s ease;
  outline: none;
  box-sizing: border-box;
}

.field-textarea:hover {
  border-color: #94a3b8;
}

.field-textarea:focus {
  border-color: #0f172a;
  background: #ffffff;
  box-shadow: 0 0 0 2px rgba(15, 23, 42, 0.08);
}

.field-textarea::placeholder {
  color: #94a3b8;
  font-weight: 400;
}

/* Range Slider */
.range-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: #e2e8f0;
  outline: none;
  margin: 8px 0;
  cursor: pointer;
}

.range-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #0f172a;
  border: 2px solid #ffffff;
  box-shadow: 0 1px 4px rgba(15, 23, 42, 0.35);
  cursor: pointer;
  transition: transform 0.1s ease, background 0.15s ease;
}

.range-slider::-webkit-slider-thumb:hover {
  transform: scale(1.15);
  background: #1e293b;
}

/* Alignment & Background Selector Groups */
.align-buttons-group,
.bgmode-selector-matrix {
  display: flex;
  gap: 3px;
  padding: 3px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.align-btn,
.bgmode-btn {
  flex: 1;
  height: 32px;
  gap: 5px;
  border: none;
  background: transparent;
  border-radius: 6px;
  font-size: 0.74rem;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.align-btn:hover,
.bgmode-btn:hover {
  color: #0f172a;
}

.align-btn.active,
.bgmode-btn.active {
  background: #0f172a;
  color: #ffffff;
  font-weight: 600;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.15);
}

.block-quick-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.btn-quick-outline {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  height: 36px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  font-size: 0.76rem;
  font-weight: 600;
  color: #334155;
  cursor: pointer;
  transition: all 0.15s ease;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.02);
}

.btn-quick-outline:hover {
  background: #f8fafc;
  border-color: #0f172a;
  color: #0f172a;
}

.btn-quick-outline.danger {
  color: #ef4444;
  border-color: #fecaca;
  background: #ffffff;
}

.btn-quick-outline.danger:hover {
  background: #fef2f2;
  border-color: #f87171;
  color: #b91c1c;
}

.btn-quick-outline.danger:hover {
  background: #fef2f2;
  border-color: #f87171;
  color: #b91c1c;
}

.empty-inspector-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 60px 16px;
  gap: 12px;
  color: #94a3b8;
}

.empty-inspector-state p {
  font-size: 0.78rem;
  line-height: 1.5;
  margin: 0;
}

/* -----------------------------------------------------------------------------
 * 5. Code & Schema Modal
 * --------------------------------------------------------------------------- */
.code-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.code-modal-card {
  width: 680px;
  max-width: 90vw;
  max-height: 80vh;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-title-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.modal-title-wrap h4 {
  font-size: 0.94rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
}

.btn-modal-close {
  border: none;
  background: transparent;
  color: #64748b;
  cursor: pointer;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
  background: #0f172a;
}

.schema-code-block {
  margin: 0;
  color: #38bdf8;
  font-size: 0.76rem;
  font-family: monospace;
  line-height: 1.5;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 14px 20px;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
}

.btn-copy-schema {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  background: #2563eb;
  color: #ffffff;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
}

/* -----------------------------------------------------------------------------
 * Visual Studio Booting Overlay & Transition (Identical Theme to StudioSplashScreen)
 * --------------------------------------------------------------------------- */
.studio-boot-screen {
  position: absolute;
  inset: 0;
  z-index: 99999;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  user-select: none;
  will-change: opacity, transform;
}

/* Theme Base Dot Grid */
.base-dot-grid {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(#cbd5e1 1.2px, transparent 1.2px);
  background-size: 28px 28px;
  background-position: -14px -14px;
  opacity: 0.75;
  pointer-events: none;
}

/* Clean Center Pod */
.boot-center-pod {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  animation: podEntrance 0.38s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes podEntrance {
  0% {
    opacity: 0;
    transform: scale(0.92) translateY(12px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Brand Glyph Box: Obsidian Black matching theme buttons and badges */
.brand-glyph-box {
  width: 50px;
  height: 50px;
  background: #0f172a;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
  box-shadow: 0 10px 24px -4px rgba(15, 23, 42, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Wordmark */
.brand-wordmark {
  font-size: 1.55rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.03em;
  line-height: 1.2;
  margin: 0 0 20px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.wordmark-highlight {
  background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.wordmark-editor-tag {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  padding: 3px 8px;
  border-radius: 6px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  color: #2563eb;
  vertical-align: middle;
}

/* Black Loading Bar (Directly beneath logo & wordmark) */
.boot-progress-track {
  width: 180px;
  height: 3.5px;
  background: #e2e8f0;
  border-radius: 9999px;
  overflow: hidden;
  position: relative;
  margin-bottom: 10px;
}

.boot-progress-fill {
  height: 100%;
  background: #0f172a; /* Solid Theme Obsidian Black */
  border-radius: 9999px;
  transition: width 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Clean Status Text */
.boot-status-text {
  font-size: 0.78rem;
  font-weight: 500;
  color: #64748b;
  letter-spacing: -0.01em;
  margin: 0;
}

/* Dissolve Transitions */
.studio-boot-dissolve-enter-active {
  transition: opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.studio-boot-dissolve-enter-from {
  opacity: 0;
}

.studio-boot-dissolve-leave-active {
  transition: opacity 0.32s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.32s cubic-bezier(0.16, 1, 0.3, 1),
              filter 0.32s cubic-bezier(0.16, 1, 0.3, 1);
}

.studio-boot-dissolve-leave-to {
  opacity: 0;
  transform: scale(1.03);
  filter: blur(8px);
}

/* -----------------------------------------------------------------------------
 * Draft Status Badge & Reset in Command Bar (Fixed Height & Non-wrapping)
 * --------------------------------------------------------------------------- */
.draft-status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 10px;
  border-radius: 8px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  font-size: 0.72rem;
  font-weight: 600;
  color: #334155;
  transition: all 0.2s ease;
  user-select: none;
  white-space: nowrap;
  flex-shrink: 0;
  box-sizing: border-box;
}

.draft-status-text {
  white-space: nowrap;
  display: inline-block;
  line-height: 1;
}

.draft-status-badge.saving {
  color: #2563eb;
  background: #eff6ff;
  border-color: #bfdbfe;
}

.draft-cloud-icon {
  color: #0284c7;
  flex-shrink: 0;
}

.draft-status-badge.saving .draft-cloud-icon {
  animation: pulse-cloud 1s ease-in-out infinite;
}

@keyframes pulse-cloud {
  0% { transform: scale(1); opacity: 0.7; }
  50% { transform: scale(1.18); opacity: 1; color: #2563eb; }
  100% { transform: scale(1); opacity: 0.7; }
}

.btn-reset-draft {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  color: #64748b;
  cursor: pointer;
  transition: all 0.15s ease;
  flex-shrink: 0;
  box-sizing: border-box;
}

.btn-reset-draft:hover {
  background: #fee2e2;
  border-color: #fca5a5;
  color: #ef4444;
}

/* -----------------------------------------------------------------------------
 * 6. VS Code-Style Canvas Workspace Editor
 * --------------------------------------------------------------------------- */
.studio-vscode-workspace {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: flex;
  background: #1e1e1e;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  color: #cccccc;
  transition: opacity 0.4s ease, visibility 0s linear 0s;
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
  z-index: 2;
}

.studio-vscode-workspace.is-view-hidden {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: opacity 0.3s ease, visibility 0s linear 0.3s;
}

/* 1. Activity Bar */
.vscode-activity-bar {
  width: 48px;
  background: #181818;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-right: 1px solid #282828;
  flex-shrink: 0;
  z-index: 10;
}

.vscode-act-top,
.vscode-act-bottom {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.vscode-act-btn {
  width: 48px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: #858585;
  cursor: pointer;
  position: relative;
  transition: color 0.15s ease;
}

.vscode-act-btn:hover {
  color: #ffffff;
}

.vscode-act-btn.active {
  color: #ffffff;
}

.vscode-act-btn.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 4px;
  bottom: 4px;
  width: 2px;
  background: #007acc;
  border-radius: 0 2px 2px 0;
}

/* 2. File Explorer Sidebar */
.vscode-explorer-sidebar {
  width: 220px;
  background: #1f1f1f;
  border-right: 1px solid #282828;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  overflow: hidden;
}

.vscode-explorer-slide-enter-active,
.vscode-explorer-slide-leave-active {
  transition: width 0.25s ease, opacity 0.2s ease;
}

.vscode-explorer-slide-enter-from,
.vscode-explorer-slide-leave-to {
  width: 0;
  opacity: 0;
}

.vscode-explorer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px 6px;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #999999;
  border-bottom: 1px solid #262626;
}

.vscode-explorer-badge {
  font-size: 0.6rem;
  font-weight: 700;
  padding: 1px 5px;
  background: #2d2d2d;
  color: #007acc;
  border-radius: 4px;
}

.vscode-file-tree {
  flex: 1;
  overflow-y: auto;
  padding: 6px 0;
}

.vscode-tree-section {
  display: flex;
  flex-direction: column;
}

.vscode-section-head {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 12px;
  font-size: 0.68rem;
  font-weight: 700;
  color: #bbbbbb;
  cursor: default;
  user-select: none;
}

.vscode-tree-items {
  display: flex;
  flex-direction: column;
}

.vscode-folder-row {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 16px;
  font-size: 0.73rem;
  font-weight: 600;
  color: #cccccc;
  cursor: pointer;
  user-select: none;
}

.vscode-folder-row .folder-name {
  color: #e2e8f0;
}

.vscode-file-item {
  appearance: none;
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 5px 16px 5px 28px;
  background: transparent;
  border: none;
  width: 100%;
  text-align: left;
  font-size: 0.74rem;
  color: #999999;
  cursor: pointer;
  transition: all 0.12s ease;
  font-family: inherit;
}

.vscode-file-item:hover {
  background: #2a2d2e;
  color: #ffffff;
}

.vscode-file-item.active {
  background: #37373d;
  color: #ffffff;
  font-weight: 600;
}

.vscode-file-item .file-icon {
  font-size: 0.72rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
}

.file-icon.json { color: #f1c40f; }
.file-icon.html { color: #e44d26; }
.file-icon.css { color: #42a5f5; }
.file-icon.docker { font-size: 0.75rem; }

/* 3. Main Editor Pane */
.vscode-editor-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #1e1e1e;
  overflow: hidden;
}

/* Tabs Bar */
.vscode-tabs-bar {
  height: 36px;
  background: #181818;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #282828;
  flex-shrink: 0;
  overflow: hidden;
}

.vscode-tabs-scroll {
  display: flex;
  align-items: stretch;
  height: 100%;
  overflow-x: auto;
  scrollbar-width: none;
}

.vscode-tabs-scroll::-webkit-scrollbar {
  display: none;
}

.vscode-tab-btn {
  appearance: none;
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 0 14px;
  background: #181818;
  border: none;
  border-right: 1px solid #242424;
  color: #8c8c8c;
  font-size: 0.73rem;
  font-family: inherit;
  cursor: pointer;
  position: relative;
  transition: all 0.12s ease;
  white-space: nowrap;
}

.vscode-tab-btn:hover {
  background: #1f1f1f;
  color: #cccccc;
}

.vscode-tab-btn.active {
  background: #1e1e1e;
  color: #ffffff;
  border-top: 2px solid #0078d4;
}

.vscode-tab-btn .tab-unsaved-dot {
  font-size: 0.55rem;
  color: #e2e8f0;
}

.vscode-tab-btn .tab-close-icon {
  opacity: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
  border-radius: 3px;
  transition: opacity 0.15s ease;
}

.vscode-tab-btn:hover .tab-close-icon,
.vscode-tab-btn.active .tab-close-icon {
  opacity: 0.7;
}

.vscode-tab-btn .tab-close-icon:hover {
  opacity: 1;
  background: rgba(255, 255, 255, 0.15);
}

/* Actions in Tab Bar */
.vscode-editor-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 10px;
  flex-shrink: 0;
}

.vscode-action-btn {
  appearance: none;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 25px;
  padding: 0 9px;
  border-radius: 4px;
  border: 1px solid #3c3c3c;
  background: #2a2a2a;
  color: #cccccc;
  font-size: 0.69rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: inherit;
}

.vscode-action-btn:hover {
  background: #333333;
  color: #ffffff;
  border-color: #4a4a4a;
}

.vscode-action-btn.primary {
  background: #007acc;
  border-color: #008be5;
  color: #ffffff;
  font-weight: 600;
}

.vscode-action-btn.primary:hover {
  background: #0069b4;
  box-shadow: 0 0 10px rgba(0, 122, 204, 0.4);
}

.vscode-action-btn.exit {
  background: #252526;
  border-color: #3e3e42;
  color: #9cdcfe;
}

.vscode-action-btn.exit:hover {
  background: #2d2d30;
  color: #ffffff;
}

/* Breadcrumbs */
.vscode-breadcrumbs-bar {
  height: 23px;
  background: #1e1e1e;
  border-bottom: 1px solid #282828;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 0 16px;
  font-size: 0.68rem;
  color: #777777;
  flex-shrink: 0;
}

.vscode-breadcrumbs-bar .crumb-sep {
  font-size: 0.6rem;
  color: #555555;
}

.vscode-breadcrumbs-bar .crumb.active {
  color: #cccccc;
}

.vscode-breadcrumbs-bar .crumb-tip {
  color: #007acc;
  font-size: 0.65rem;
  margin-left: 10px;
}

/* Code Viewport (Gutter + Surface) */
.vscode-code-viewport {
  flex: 1;
  display: flex;
  min-height: 0;
  overflow: hidden;
  position: relative;
  background: #1e1e1e;
}

.vscode-gutter {
  width: 48px;
  padding: 12px 10px 12px 0;
  background: #1e1e1e;
  border-right: 1px solid #282828;
  display: flex;
  flex-direction: column;
  user-select: none;
  flex-shrink: 0;
  overflow: hidden;
}

.vscode-line-number {
  height: 21px;
  line-height: 21px;
  text-align: right;
  font-size: 0.74rem;
  font-family: 'JetBrains Mono', 'Fira Code', Consolas, Monaco, monospace;
  color: #6e7681;
}

.vscode-text-surface {
  flex: 1;
  min-width: 0;
  height: 100%;
  position: relative;
  overflow: auto;
}

.vscode-code-textarea {
  width: 100%;
  height: 100%;
  padding: 12px 16px;
  border: none;
  background: transparent;
  color: #d4d4d4;
  font-family: 'JetBrains Mono', 'Fira Code', Consolas, Monaco, monospace;
  font-size: 0.8rem;
  line-height: 21px;
  resize: none;
  outline: none;
  tab-size: 2;
  white-space: pre;
  overflow: auto;
  box-sizing: border-box;
}

.vscode-code-pre {
  margin: 0;
  padding: 12px 16px;
  color: #9cdcfe;
  font-family: 'JetBrains Mono', 'Fira Code', Consolas, Monaco, monospace;
  font-size: 0.8rem;
  line-height: 21px;
  tab-size: 2;
  white-space: pre;
  box-sizing: border-box;
}

/* 4. VS Code Status Bar */
.vscode-status-bar {
  height: 22px;
  background: #007acc;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  font-size: 0.65rem;
  flex-shrink: 0;
  user-select: none;
}

.vscode-status-left,
.vscode-status-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.vscode-status-bar .status-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  opacity: 0.92;
  transition: opacity 0.15s ease;
}

.vscode-status-bar .status-item:hover {
  opacity: 1;
}

.vscode-status-bar .status-item.highlight {
  background: rgba(0, 0, 0, 0.15);
  padding: 1px 6px;
  border-radius: 3px;
}
</style>
