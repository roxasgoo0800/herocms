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
  Cloud
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

// Studio Booting Transition & Redis Draft State
const isEditorBooting = ref(true);
const bootProgress = ref(15);
const bootStatusText = ref('Menginisialisasi Visual Canvas Engine...');
const isDraftSaving = ref(false);
const lastSavedDraftAt = ref('');
const isDraftRestored = ref(false);

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
    bootStatusText.value = 'Mengecek draf posisi edit terakhir dari Redis...';
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
      lastSavedDraftAt.value = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
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
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
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
      bootProgress.value = 30;
      bootStatusText.value = 'Memuat draf kontainer baru dari Redis...';
      await restoreDraftForActiveContainer(newId);
      setTimeout(() => {
        bootProgress.value = 100;
        bootStatusText.value = 'Siap!';
        setTimeout(() => {
          isEditorBooting.value = false;
        }, 200);
      }, 250);
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

  // Smooth booting transition & dependency/draft load
  isEditorBooting.value = true;
  bootProgress.value = 20;
  bootStatusText.value = 'Menyiapkan Kanvas Visual Studio...';

  await nextTick();
  fitToScreen();

  bootProgress.value = 45;
  bootStatusText.value = 'Memuat dependensi & engine editor...';

  // Load / resume draft from Redis
  if (activeContainerId.value) {
    await restoreDraftForActiveContainer(activeContainerId.value);
  } else {
    loadBlocksForActiveContainer();
  }

  recordHistory();

  bootProgress.value = 90;
  bootStatusText.value = 'Mempersiapkan render kanvas akhir...';

  setTimeout(() => {
    bootProgress.value = 100;
    bootStatusText.value = 'Studio siap!';
    setTimeout(() => {
      isEditorBooting.value = false;
      if (isDraftRestored.value) {
        showToast('Draf posisi edit terakhir berhasil dipulihkan dari Redis', 'success');
      }
    }, 350);
  }, 300);
});

onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown);
  window.removeEventListener('keyup', onKeyUp);
  window.removeEventListener('mousemove', onCanvasMouseMove);
  window.removeEventListener('mouseup', onCanvasMouseUp);
  window.removeEventListener('resize', fitToScreen);
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
  { name: 'Electric Indigo', hex: '#2563eb' },
  { name: 'Cyber Emerald', hex: '#059669' },
  { name: 'Hyper Purple', hex: '#7c3aed' },
  { name: 'Solar Orange', hex: '#ea580c' },
  { name: 'Obsidian Noir', hex: '#0f172a' },
  { name: 'Neon Cyan', hex: '#06b6d4' },
  { name: 'Rose Glow', hex: '#e11d48' },
  { name: 'Amber Gold', hex: '#d97706' }
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
</script>

<template>
  <section class="visual-studio-root">
    <!-- Studio Booting Transition Overlay -->
    <transition name="editor-boot-fade">
      <div v-if="isEditorBooting" class="studio-boot-overlay">
        <div class="boot-content">
          <div class="boot-logo-wrapper">
            <div class="boot-logo-box">
              <Layers :size="30" class="boot-icon" />
              <div class="boot-logo-pulse"></div>
            </div>
          </div>
          <div class="boot-info">
            <h3 class="boot-title">HeroCMS Studio Visual</h3>
            <p class="boot-status">{{ bootStatusText }}</p>
          </div>
          <div class="boot-progress-track">
            <div class="boot-progress-fill" :style="{ width: `${bootProgress}%` }"></div>
          </div>
          <div class="boot-meta">
            <span class="boot-badge">
              <Cloud :size="11" />
              <span>Redis Draft Sync</span>
            </span>
            <span class="boot-pct">{{ bootProgress }}%</span>
          </div>
        </div>
      </div>
    </transition>

    <div v-if="activeContainer" class="studio-main-frame">
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

          <div class="site-target-pill">
            <span class="pulse-status-dot"></span>
            <span class="pill-label">Situs:</span>
            <select v-model="activeContainerId" class="select-site-clean">
              <option v-for="c in containers" :key="c.id" :value="c.id">
                {{ c.name }} ({{ c.subdomain }})
              </option>
            </select>
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
          <!-- Canvas View Helpers Segment -->
          <div class="canvas-helpers-segment">
            <button
              class="tool-btn"
              :class="{ active: showRulers }"
              @click="showRulers = !showRulers"
              title="Penggaris Piksel (Rulers)"
            >
              <Ruler :size="14" />
            </button>
            <button
              class="tool-btn"
              :class="{ active: showGrid }"
              @click="showGrid = !showGrid"
              title="Grid Kanvas Dot-Matrix"
            >
              <Grid :size="14" />
            </button>
          </div>

          <div class="v-divider"></div>

          <!-- Zoom HUD -->
          <div class="zoom-controls-cluster">
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
              @click="isCodeModalOpen = true"
              title="Lihat Schema JSON"
            >
              <Code2 :size="13" />
            </button>
          </div>

          <!-- Draft Auto-Save Redis Status & Reset -->
          <div
            class="draft-status-badge"
            :class="{ saving: isDraftSaving }"
            :title="lastSavedDraftAt ? `Draf tersimpan di Redis & Lokal pada ${lastSavedDraftAt}` : 'Draf otomatis tersimpan ke Redis'"
          >
            <Cloud :size="13" class="draft-cloud-icon" />
            <span class="draft-status-text">
              <span v-if="isDraftSaving">Menyimpan draf...</span>
              <span v-else-if="lastSavedDraftAt">Draf Disimpan ({{ lastSavedDraftAt }})</span>
              <span v-else>Draf Redis Aktif</span>
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
          >
            <Rocket v-if="!isPublishing" :size="14" />
            <span v-else class="spin-ring-sm"></span>
            <span>{{ isPublishing ? 'Menyimpan...' : 'Terbitkan ke Kontainer' }}</span>
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
        <aside v-if="editorViewMode === 'design'" class="studio-left-dock">
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
                <div class="color-swatches-matrix">
                  <button
                    v-for="pal in colorPalettes"
                    :key="pal.hex"
                    class="swatch-btn"
                    :class="{ active: activeContainer.accentColor === pal.hex }"
                    :style="{ backgroundColor: pal.hex }"
                    @click="activeContainer.accentColor = pal.hex"
                    :title="pal.name"
                  >
                    <Check v-if="activeContainer.accentColor === pal.hex" :size="12" color="#fff" />
                  </button>
                </div>
              </div>

              <!-- Typography -->
              <div class="token-field-box" style="margin-top: 18px;">
                <label class="token-lbl">Keluarga Tipografi (Font)</label>
                <select v-model="currentFont" class="token-select-input">
                  <option v-for="f in fontFamilies" :key="f.id" :value="f.id">
                    {{ f.name }}
                  </option>
                </select>
              </div>

              <!-- Template Badge -->
              <div class="token-field-box" style="margin-top: 18px;">
                <label class="token-lbl">Blueprint Terpasang</label>
                <div class="blueprint-badge-box">
                  <Layers :size="15" color="#2563eb" />
                  <div>
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
        <!-- CENTER: INFINITE CANVAS WORKSPACE & RESIZABLE ARTBOARD             -->
        <!-- ----------------------------------------------------------------- -->
        <main
          class="studio-viewport-area"
          :class="{
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

        <!-- ----------------------------------------------------------------- -->
        <!-- RIGHT STUDIO DOCK: DEEP STYLE INSPECTOR & CONTENT CONTROLS        -->
        <!-- ----------------------------------------------------------------- -->
        <aside v-if="editorViewMode === 'design'" class="studio-right-inspector">
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
                      Kiri
                    </button>
                    <button
                      class="align-btn"
                      :class="{ active: selectedBlock.styles?.align === 'center' || !selectedBlock.styles?.align }"
                      @click="selectedBlock.styles ? (selectedBlock.styles.align = 'center') : null"
                    >
                      Tengah
                    </button>
                    <button
                      class="align-btn"
                      :class="{ active: selectedBlock.styles?.align === 'right' }"
                      @click="selectedBlock.styles ? (selectedBlock.styles.align = 'right') : null"
                    >
                      Kanan
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
  background: #eff6ff;
  border-color: #bfdbfe;
  color: #2563eb;
}

.cmd-left-group,
.cmd-center-group,
.cmd-right-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.v-divider {
  width: 1px;
  height: 20px;
  background: #e2e8f0;
  margin: 0 3px;
  flex-shrink: 0;
}

.site-target-pill {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 32px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0 10px;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.02);
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
}

.select-site-clean {
  border: none;
  background: transparent;
  font-size: 0.8rem;
  font-weight: 600;
  color: #0f172a;
  cursor: pointer;
  outline: none;
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
  background: #2563eb;
  color: #ffffff;
  box-shadow: 0 1px 2px rgba(37, 99, 235, 0.25);
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

.dim-unit {
  font-size: 0.66rem;
  font-weight: 600;
  color: #94a3b8;
  margin-right: 1px;
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
  background: #eff6ff;
  color: #2563eb;
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

.zoom-v-sep {
  width: 1px;
  height: 14px;
  background: #e2e8f0;
  margin: 0 2px;
}

.zoom-slider-wrap {
  width: 56px;
  display: flex;
  align-items: center;
  padding: 0 2px;
}

.zoom-slider-input {
  width: 100%;
  height: 4px;
  border-radius: 2px;
  accent-color: #2563eb;
  cursor: pointer;
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
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: #ffffff;
  border: none;
  padding: 0 14px;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(37, 99, 235, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.15);
  transition: all 0.15s ease;
  flex-shrink: 0;
}

.btn-publish-live:hover:not(:disabled) {
  transform: translateY(-0.5px);
  box-shadow: 0 2px 6px rgba(37, 99, 235, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.2);
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
}

.left-dock-tabs {
  display: flex;
  gap: 3px;
  padding: 3px;
  margin: 10px 12px 6px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 9px;
}

.dock-tab-item {
  flex: 1;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  border: none;
  background: transparent;
  border-radius: 6px;
  font-size: 0.74rem;
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
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.08);
}

.dock-tab-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.dock-section-head {
  margin-bottom: 14px;
}

.dock-section-head h4 {
  font-size: 0.84rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 3px;
}

.dock-section-head p {
  font-size: 0.72rem;
  color: #64748b;
  margin: 0;
  line-height: 1.4;
}

/* Block Cards Grid */
.block-cards-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.block-add-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.block-add-card:hover {
  border-color: #2563eb;
  background: #eff6ff;
  transform: translateY(-1px);
}

.card-icon-bubble {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2563eb;
  flex-shrink: 0;
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
}

.card-meta span {
  font-size: 0.68rem;
  color: #64748b;
  line-height: 1.3;
}

.icon-add-plus {
  color: #94a3b8;
}

.block-add-card:hover .icon-add-plus {
  color: #2563eb;
}

/* Layers List */
.layers-list-tree {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.layer-row-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.76rem;
  font-weight: 600;
  color: #334155;
  transition: all 0.15s ease;
}

.layer-row-item:hover {
  border-color: #cbd5e1;
  background: #f1f5f9;
}

.layer-row-item.selected {
  background: #eff6ff;
  border-color: #93c5fd;
  color: #1d4ed8;
  font-weight: 700;
}

.layer-type-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #2563eb;
  flex-shrink: 0;
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
  background: #ffffff;
  color: #0f172a;
}

/* Design Tokens */
.color-swatches-matrix {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-top: 8px;
}

.swatch-btn {
  height: 32px;
  border-radius: 7px;
  border: 2px solid transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s ease;
}

.swatch-btn:hover {
  transform: scale(1.08);
}

.swatch-btn.active {
  border-color: #0f172a;
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
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  font-size: 0.78rem;
  font-weight: 700;
  color: #0f172a;
  margin-top: 6px;
  outline: none;
}

.blueprint-badge-box {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 9px;
  margin-top: 6px;
}

.blueprint-badge-box strong {
  display: block;
  font-size: 0.78rem;
  color: #0f172a;
}

.blueprint-badge-box span {
  font-size: 0.68rem;
  color: #64748b;
}

/* AI Copilot */
.ai-prompt-area {
  width: 100%;
  padding: 10px 12px;
  border: 1.5px solid #cbd5e1;
  border-radius: 8px;
  background: #ffffff;
  font-size: 0.8rem;
  font-weight: 500;
  color: #0f172a;
  resize: vertical;
  min-height: 80px;
  margin-bottom: 10px;
  outline: none;
  font-family: inherit;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
  transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
  box-sizing: border-box;
}

.ai-prompt-area:hover {
  border-color: #94a3b8;
}

.ai-prompt-area:focus {
  border-color: #7c3aed;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.14);
}

.btn-generate-ai {
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 34px;
  padding: 0 14px;
  border-radius: 8px;
  border: none;
  background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
  color: #ffffff;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(124, 58, 237, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2);
  margin-bottom: 16px;
  transition: all 0.15s ease;
}

.btn-generate-ai:hover:not(:disabled) {
  transform: translateY(-0.5px);
  box-shadow: 0 2px 6px rgba(124, 58, 237, 0.35);
}

.prompt-presets-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.preset-title {
  font-size: 0.7rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
}

.preset-chip {
  text-align: left;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  padding: 6px 9px;
  border-radius: 6px;
  font-size: 0.72rem;
  font-weight: 600;
  color: #334155;
  cursor: pointer;
  transition: all 0.15s;
}

.preset-chip:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
  color: #0f172a;
}

/* -----------------------------------------------------------------------------
 * 3. Infinite Viewport & Artboard Workspace
 * --------------------------------------------------------------------------- */
.studio-viewport-area {
  flex: 1;
  height: 100%;
  position: relative;
  overflow: hidden;
  background: #f1f5f9;
  user-select: none;
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
}

.inspector-tabs-bar {
  display: flex;
  gap: 3px;
  padding: 3px;
  margin: 12px 14px 6px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 9px;
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
  background: #ffffff;
  color: #0f172a;
  font-weight: 700;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.08);
}

.inspector-scroll-area {
  flex: 1;
  overflow-y: auto;
  padding: 12px 16px 20px;
}

/* Selected Block Card */
.selected-block-card {
  padding: 12px 14px;
  margin-bottom: 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
}

.block-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.badge-block-type {
  font-size: 0.62rem;
  font-weight: 800;
  color: #2563eb;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  padding: 2px 7px;
  border-radius: 5px;
  letter-spacing: 0.05em;
}

.badge-block-status {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.68rem;
  font-weight: 600;
  color: #059669;
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
}

/* Form Fields & High-Fidelity Inputs */
.field-item {
  margin-bottom: 15px;
}

.field-label {
  display: block;
  font-size: 0.74rem;
  font-weight: 600;
  color: #334155;
  margin-bottom: 6px;
  letter-spacing: -0.01em;
}

.field-label-split {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.field-val-badge {
  font-size: 0.72rem;
  font-weight: 700;
  color: #2563eb;
  background: #eff6ff;
  border: 1px solid #dbeafe;
  padding: 1px 6px;
  border-radius: 5px;
  font-family: ui-monospace, SFMono-Regular, monospace;
}

.field-input-box {
  position: relative;
  width: 100%;
}

.field-input {
  width: 100%;
  height: 38px;
  padding: 0 12px;
  background: #ffffff;
  border: 1.5px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 500;
  color: #0f172a;
  font-family: inherit;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
  transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
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
  border-color: #2563eb;
  background: #ffffff;
  box-shadow: 0 0 0 3.5px rgba(37, 99, 235, 0.14);
}

.field-textarea {
  width: 100%;
  min-height: 84px;
  padding: 9px 12px;
  background: #ffffff;
  border: 1.5px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 500;
  color: #0f172a;
  font-family: inherit;
  line-height: 1.5;
  resize: vertical;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
  transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
  outline: none;
  box-sizing: border-box;
}

.field-textarea::placeholder {
  color: #94a3b8;
  font-weight: 400;
}

.field-textarea:hover {
  border-color: #94a3b8;
}

.field-textarea:focus {
  border-color: #2563eb;
  background: #ffffff;
  box-shadow: 0 0 0 3.5px rgba(37, 99, 235, 0.14);
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
  background: #2563eb;
  border: 2px solid #ffffff;
  box-shadow: 0 1px 3px rgba(37, 99, 235, 0.4);
  cursor: pointer;
  transition: transform 0.1s ease;
}

.range-slider::-webkit-slider-thumb:hover {
  transform: scale(1.15);
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
  height: 30px;
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
  background: #ffffff;
  color: #2563eb;
  font-weight: 700;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.08);
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
  gap: 6px;
  height: 34px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  font-size: 0.76rem;
  font-weight: 600;
  color: #334155;
  cursor: pointer;
  transition: all 0.15s ease;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.03);
}

.btn-quick-outline:hover {
  background: #f8fafc;
  border-color: #94a3b8;
  color: #0f172a;
}

.btn-quick-outline.danger {
  color: #dc2626;
  border-color: #fecaca;
  background: #fffafa;
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
 * Visual Studio Booting Overlay & Transition
 * --------------------------------------------------------------------------- */
.editor-boot-fade-enter-active,
.editor-boot-fade-leave-active {
  transition: opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1), filter 0.35s ease;
}

.editor-boot-fade-enter-from,
.editor-boot-fade-leave-to {
  opacity: 0;
  filter: blur(6px);
}

.studio-boot-overlay {
  position: absolute;
  inset: 0;
  z-index: 99999;
  background: #090d16;
  display: flex;
  align-items: center;
  justify-content: center;
}

.boot-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 320px;
  max-width: 90%;
  text-align: center;
}

.boot-logo-wrapper {
  margin-bottom: 22px;
}

.boot-logo-box {
  position: relative;
  width: 58px;
  height: 58px;
  border-radius: 16px;
  background: linear-gradient(135deg, #1e293b, #0f172a);
  border: 1px solid rgba(56, 189, 248, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #38bdf8;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

.boot-logo-pulse {
  position: absolute;
  inset: -4px;
  border-radius: 20px;
  background: radial-gradient(circle, rgba(56, 189, 248, 0.25) 0%, transparent 70%);
  animation: boot-pulse-ring 2s ease-out infinite;
  pointer-events: none;
}

@keyframes boot-pulse-ring {
  0% { transform: scale(0.95); opacity: 0.8; }
  50% { transform: scale(1.1); opacity: 0.25; }
  100% { transform: scale(0.95); opacity: 0.8; }
}

.boot-info {
  margin-bottom: 18px;
}

.boot-title {
  margin: 0 0 6px 0;
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: #f1f5f9;
}

.boot-status {
  margin: 0;
  font-size: 0.76rem;
  color: #94a3b8;
  font-weight: 500;
}

.boot-progress-track {
  width: 100%;
  height: 4px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  overflow: hidden;
  margin-bottom: 12px;
}

.boot-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #38bdf8, #6366f1);
  border-radius: 999px;
  transition: width 0.25s ease;
}

.boot-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  font-size: 0.7rem;
  color: #64748b;
}

.boot-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: #38bdf8;
  font-weight: 600;
}

.boot-pct {
  font-family: monospace;
  color: #94a3b8;
  font-weight: 600;
}

/* -----------------------------------------------------------------------------
 * Draft Status Badge & Reset in Command Bar
 * --------------------------------------------------------------------------- */
.draft-status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  border-radius: 6px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  font-size: 0.72rem;
  font-weight: 600;
  color: #475569;
  transition: all 0.2s ease;
  user-select: none;
}

.draft-status-badge.saving {
  color: #2563eb;
  background: #eff6ff;
  border-color: #bfdbfe;
}

.draft-cloud-icon {
  color: #0284c7;
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
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  color: #64748b;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-reset-draft:hover {
  background: #fee2e2;
  border-color: #fca5a5;
  color: #ef4444;
}
</style>
