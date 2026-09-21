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
  ChevronRight,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Check,
  Code2,
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
  AlignJustify,
  Bold,
  Italic,
  Underline,
  Type,
  Zap,
  Files,
  Search,
  GitBranch,
  Play,
  RefreshCw,
  Cpu,
  Database,
  Activity,
  Terminal,
  Shield,
  HardDrive,
  Box,
  Award,
  Star,
  Key,
  Image as ImageIcon,
  UploadCloud
} from 'lucide-vue-next';
import { studioApi } from '../../services/apiClient';
import { useDashboardData } from '../../composables/useDashboardData';
import type { VisualBlock } from '../../types/dashboard';
import {
  zoomPresets,
  devicePresets,
  fontFamilies,
  colorPalettes,
  blockCategories,
  blockCatalogItems,
  type BlockCategory,
  createDefaultBlocks,
  createLibraryBlock,
  type DevicePreset,
  fontOptions,
  colorPresets,
  brandPalettes,
  editorIconOptions,
  animationOptions,
  type FontOption,
  type ColorPreset,
  type BrandPalette,
  type AnimationOption
} from '../../data/editor-presets';

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
// Block Catalog Filter & Search State (Canva-Style Explorer)
// -----------------------------------------------------------------------------
const selectedCatalogCategory = ref<BlockCategory>('all');
const catalogSearchQuery = ref('');

const filteredCatalogItems = computed(() => {
  return blockCatalogItems.filter(item => {
    const matchCat =
      selectedCatalogCategory.value === 'all' || item.category === selectedCatalogCategory.value;
    const q = catalogSearchQuery.value.trim().toLowerCase();
    const matchQuery =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.desc.toLowerCase().includes(q) ||
      item.type.toLowerCase().includes(q);
    return matchCat && matchQuery;
  });
});

// Interactive Component Helpers for Canvas
const toggleAccordionItem = (block: VisualBlock, index: number) => {
  block.activeItemIndex = block.activeItemIndex === index ? -1 : index;
};

const nextSlide = (block: VisualBlock) => {
  const len = block.items?.length || 1;
  block.activeItemIndex = ((block.activeItemIndex || 0) + 1) % len;
};

const prevSlide = (block: VisualBlock) => {
  const len = block.items?.length || 1;
  block.activeItemIndex = ((block.activeItemIndex || 0) - 1 + len) % len;
};

const setSlide = (block: VisualBlock, index: number) => {
  block.activeItemIndex = index;
};

const toggleBlockOpen = (block: VisualBlock) => {
  block.isOpen = !block.isOpen;
};

const selectDropdownOption = (block: VisualBlock, index: number) => {
  block.activeItemIndex = index;
  block.isOpen = false;
};

const setPageNumber = (block: VisualBlock, index: number) => {
  block.activeItemIndex = index;
};

// -----------------------------------------------------------------------------
// Studio Canvas Workspace State (Canva / Photoshop Engine)
// -----------------------------------------------------------------------------

type ActiveTool = 'select' | 'hand' | 'text';
type EditorViewMode = 'design' | 'preview' | 'code';

const activeTool = ref<ActiveTool>('select');
const editorViewMode = ref<EditorViewMode>('design');
const activeLeftTab = ref<'blocks' | 'layers' | 'design' | 'ai'>('blocks');
const activeRightTab = ref<'layout' | 'appearance'>('layout');

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

// Font Family Dropdown State
const isFontDropdownOpen = ref(false);
const fontDropdownRef = ref<HTMLElement | null>(null);

const toggleFontDropdown = () => {
  isFontDropdownOpen.value = !isFontDropdownOpen.value;
};

const selectFontFromDropdown = (fontId: string) => {
  currentFont.value = fontId;
  isFontDropdownOpen.value = false;
};

const currentFontLabel = computed(() => {
  return fontFamilies.find(f => f.id === currentFont.value)?.name || currentFont.value;
});

// Zoom Dropdown State
const isZoomDropdownOpen = ref(false);
const zoomDropdownRef = ref<HTMLElement | null>(null);

const toggleZoomDropdown = () => {
  isZoomDropdownOpen.value = !isZoomDropdownOpen.value;
};

const selectZoomFromDropdown = (val: number) => {
  setZoom(val);
  isZoomDropdownOpen.value = false;
};

// Unified outside-click handler for all custom dropdowns
const handleAllDropdownOutsideClick = (e: MouseEvent) => {
  if (fontDropdownRef.value && !fontDropdownRef.value.contains(e.target as Node)) {
    isFontDropdownOpen.value = false;
  }
  if (zoomDropdownRef.value && !zoomDropdownRef.value.contains(e.target as Node)) {
    isZoomDropdownOpen.value = false;
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
    const siteName = activeContainer.value?.name || 'Portofolio Rizal Pratama';
    const role = activeContainer.value?.roleOrHeadline || 'Portofolio Teknis Engineer';
    const bio = activeContainer.value?.bioIntro || 'Selamat datang di website resmi yang didukung arsitektur kontainer otonom HeroCMS Studio.';
    pageBlocks.value = createDefaultBlocks(siteName, role, bio);
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
      if (draftData.activeRightTab) {
        activeRightTab.value = draftData.activeRightTab === 'content' ? 'layout' : draftData.activeRightTab;
      }

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
    clampPan();
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

// Clamp pan values to prevent infinite scrolling
const PAN_LIMIT = 4000;
const clampPan = () => {
  panX.value = Math.max(-PAN_LIMIT, Math.min(PAN_LIMIT, panX.value));
  panY.value = Math.max(-PAN_LIMIT, Math.min(PAN_LIMIT, panY.value));
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
  clampPan();
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
  if (editorViewMode.value === 'code') {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'f') {
      e.preventDefault();
      activeVsCodeSidebar.value = 'search';
      nextTick(() => {
        vsCodeSearchInputRef.value?.focus();
        vsCodeSearchInputRef.value?.select();
      });
      return;
    }
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'e') {
      e.preventDefault();
      activeVsCodeSidebar.value = 'explorer';
      return;
    }
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
  document.addEventListener('click', handleAllDropdownOutsideClick);

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
  document.removeEventListener('click', handleAllDropdownOutsideClick);
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
  const newBlock = createLibraryBlock(type);
  const footerIdx = pageBlocks.value.findIndex((b) => b.type === 'footer');
  if (footerIdx !== -1) {
    pageBlocks.value.splice(footerIdx, 0, newBlock);
  } else {
    pageBlocks.value.push(newBlock);
  }
  selectedBlockId.value = newBlock.id;
  showToast(`Komponen '${newBlock.name}' berhasil ditambahkan ke kanvas!`, 'success');
};

const currentFont = ref('Plus Jakarta Sans');

// -----------------------------------------------------------------------------
// Rich Studio Modal: Visual & WYSIWYG Content Engine
// -----------------------------------------------------------------------------
const isRichEditorOpen = ref(false);
const richEditorActiveTab = ref<'content' | 'typography' | 'appearance' | 'animation'>('content');
const richPreviewDevice = ref<'desktop' | 'tablet' | 'mobile'>('desktop');
const editingBlockDraft = ref<VisualBlock | null>(null);
const animReplayKey = ref(0);
const richContentSurfaceRef = ref<HTMLDivElement | null>(null);

const iconComponentMap: Record<string, any> = {
  server: Server,
  cloud: Cloud,
  database: Database,
  cpu: Cpu,
  'hard-drive': HardDrive,
  terminal: Terminal,
  'code-2': Code2,
  box: Box,
  'shield-check': ShieldCheck,
  shield: Shield,
  lock: Lock,
  key: Key,
  globe: Globe,
  'trending-up': TrendingUp,
  zap: Zap,
  activity: Activity,
  rocket: Rocket,
  check: Check,
  sparkles: Sparkles,
  layers: Layers,
  award: Award,
  star: Star,
  sliders: Sliders
};

const getIconComponent = (iconName?: string) => {
  if (!iconName) return Server;
  return iconComponentMap[iconName] || Server;
};

// Interactive Icon Picker State
const isIconPickerOpen = ref(false);
const activeIconPickerSubIdx = ref<number | null>(null);
const iconPickerSearchQuery = ref('');
const selectedIconCategory = ref<'Semua' | 'Tech & Cloud' | 'Keamanan & Sistem' | 'Performa & Bisnis' | 'Desain & UI'>('Semua');

const openIconPicker = (subIdx: number) => {
  activeIconPickerSubIdx.value = subIdx;
  iconPickerSearchQuery.value = '';
  selectedIconCategory.value = 'Semua';
  isIconPickerOpen.value = true;
};

const closeIconPicker = () => {
  isIconPickerOpen.value = false;
  activeIconPickerSubIdx.value = null;
};

const filteredIconOptions = computed(() => {
  let list = editorIconOptions;
  if (selectedIconCategory.value !== 'Semua') {
    list = list.filter((item) => item.category === selectedIconCategory.value);
  }
  if (iconPickerSearchQuery.value.trim()) {
    const q = iconPickerSearchQuery.value.toLowerCase();
    list = list.filter((item) => item.name.toLowerCase().includes(q) || item.id.toLowerCase().includes(q));
  }
  return list;
});

const selectIconForItem = (iconId: string) => {
  if (
    activeIconPickerSubIdx.value !== null &&
    editingBlockDraft.value?.items &&
    editingBlockDraft.value.items[activeIconPickerSubIdx.value]
  ) {
    editingBlockDraft.value.items[activeIconPickerSubIdx.value].icon = iconId;
  }
  closeIconPicker();
};

const moveSubItemUp = (idx: number) => {
  if (!editingBlockDraft.value?.items || idx <= 0) return;
  const items = editingBlockDraft.value.items;
  const temp = items[idx];
  items[idx] = items[idx - 1];
  items[idx - 1] = temp;
};

const moveSubItemDown = (idx: number) => {
  if (!editingBlockDraft.value?.items || idx >= editingBlockDraft.value.items.length - 1) return;
  const items = editingBlockDraft.value.items;
  const temp = items[idx];
  items[idx] = items[idx + 1];
  items[idx + 1] = temp;
};

const duplicateSubItem = (idx: number) => {
  if (!editingBlockDraft.value?.items) return;
  const original = editingBlockDraft.value.items[idx];
  const copy = JSON.parse(JSON.stringify(original));
  copy.id = 'item-' + Date.now();
  copy.title = `${copy.title || 'Item'} (Salinan)`;
  editingBlockDraft.value.items.splice(idx + 1, 0, copy);
};

const blockUsesIcons = (blockType?: string): boolean => {
  return blockType === 'features' || blockType === 'showcase';
};

const blockUsesImages = (blockType?: string): boolean => {
  return blockType === 'carousel';
};

const onSlideImageUpload = (subIdx: number, event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;
  const file = target.files[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    if (
      editingBlockDraft.value?.items &&
      editingBlockDraft.value.items[subIdx] &&
      e.target?.result
    ) {
      editingBlockDraft.value.items[subIdx].image = e.target.result as string;
    }
  };
  reader.readAsDataURL(file);
};

const removeSlideImage = (subIdx: number) => {
  if (editingBlockDraft.value?.items && editingBlockDraft.value.items[subIdx]) {
    editingBlockDraft.value.items[subIdx].image = '';
  }
};

const addNewSubItem = () => {
  if (!editingBlockDraft.value) return;
  if (!editingBlockDraft.value.items) editingBlockDraft.value.items = [];
  const type = editingBlockDraft.value.type;
  const newId = 'item-' + Date.now();
  if (type === 'accordion') {
    editingBlockDraft.value.items.push({
      id: newId,
      title: 'Pertanyaan Baru',
      desc: 'Jawaban atau penjelasan untuk pertanyaan ini...'
    });
  } else if (type === 'progressbar') {
    editingBlockDraft.value.items.push({
      id: newId,
      title: 'Metrik Performa Baru',
      desc: 'Keterangan kapasitas atau performa sistem',
      percentage: 85
    });
  } else if (type === 'carousel') {
    editingBlockDraft.value.items.push({
      id: newId,
      title: 'Slide Baru',
      desc: 'Deskripsi singkat seputar rilis atau sorotan fitur.',
      tag: 'Baru',
      author: 'Studio Team',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80'
    });
  } else if (type === 'formcontrol') {
    editingBlockDraft.value.items.push({
      id: newId,
      title: 'Field Form Baru',
      label: 'Masukkan nilai...',
      tag: 'text'
    });
  } else {
    editingBlockDraft.value.items.push({
      id: newId,
      title: 'Fitur Baru',
      desc: 'Deskripsi fitur baru...',
      icon: 'zap'
    });
  }
};

const applyBrandPalette = (palette: BrandPalette) => {
  if (!editingBlockDraft.value) return;
  if (!editingBlockDraft.value.styles) {
    editingBlockDraft.value.styles = {};
  }
  editingBlockDraft.value.styles.textColor = palette.textColor;
  editingBlockDraft.value.styles.bgColor = palette.bgColor;
  editingBlockDraft.value.styles.accentColor = palette.accentColor;
};

const wysiwygWordCount = computed(() => {
  const text = (editingBlockDraft.value?.styles?.richContent || editingBlockDraft.value?.subtitle || '')
    .replace(/<[^>]*>/g, '')
    .trim();
  return text ? text.split(/\s+/).length : 0;
});

const wysiwygCharCount = computed(() => {
  const text = (editingBlockDraft.value?.styles?.richContent || editingBlockDraft.value?.subtitle || '')
    .replace(/<[^>]*>/g, '');
  return text.length;
});

const openRichModalEditor = (block: VisualBlock) => {
  editingBlockDraft.value = JSON.parse(JSON.stringify(block));
  if (!editingBlockDraft.value?.styles) {
    editingBlockDraft.value!.styles = {};
  }
  if (!editingBlockDraft.value?.styles.richContent) {
    editingBlockDraft.value!.styles.richContent =
      editingBlockDraft.value?.subtitle || editingBlockDraft.value?.title || '';
  }
  if (!editingBlockDraft.value?.styles.animation) {
    editingBlockDraft.value!.styles.animation = 'none';
  }
  if (!editingBlockDraft.value?.styles.fontFamily) {
    editingBlockDraft.value!.styles.fontFamily = "'Plus Jakarta Sans', system-ui, sans-serif";
  }
  richEditorActiveTab.value = 'content';
  isRichEditorOpen.value = true;
};

const closeRichModalEditor = () => {
  isRichEditorOpen.value = false;
  editingBlockDraft.value = null;
};

const onWysiwygInput = () => {
  if (richContentSurfaceRef.value && editingBlockDraft.value?.styles) {
    editingBlockDraft.value.styles.richContent = richContentSurfaceRef.value.innerHTML;
  }
};

const applyRichModalEditor = () => {
  if (!editingBlockDraft.value) return;
  const idx = pageBlocks.value.findIndex((b) => b.id === editingBlockDraft.value?.id);
  if (idx !== -1) {
    if (richContentSurfaceRef.value && editingBlockDraft.value.styles) {
      editingBlockDraft.value.styles.richContent = richContentSurfaceRef.value.innerHTML;
    }
    pageBlocks.value[idx] = JSON.parse(JSON.stringify(editingBlockDraft.value));
    selectedBlockId.value = editingBlockDraft.value.id;
    showToast(`Perubahan '${editingBlockDraft.value.name}' berhasil diterapkan!`, 'success');
  }
  isRichEditorOpen.value = false;
  editingBlockDraft.value = null;
};

const replayPreviewAnimation = () => {
  animReplayKey.value += 1;
};

const formatWysiwyg = (cmd: string, val: string | undefined = undefined) => {
  document.execCommand(cmd, false, val);
  if (richContentSurfaceRef.value && editingBlockDraft.value?.styles) {
    editingBlockDraft.value.styles.richContent = richContentSurfaceRef.value.innerHTML;
  }
};

const setEditingFont = (font: FontOption) => {
  if (editingBlockDraft.value?.styles) {
    editingBlockDraft.value.styles.fontFamily = font.family;
  }
};

const setEditingColor = (color: ColorPreset, type: 'text' | 'bg' | 'accent') => {
  if (!editingBlockDraft.value?.styles) return;
  if (type === 'text') editingBlockDraft.value.styles.textColor = color.textHex;
  if (type === 'bg') editingBlockDraft.value.styles.bgColor = color.hex;
  if (type === 'accent') editingBlockDraft.value.styles.accentColor = color.hex;
};

const setEditingAnimation = (anim: AnimationOption['id']) => {
  if (editingBlockDraft.value?.styles) {
    editingBlockDraft.value.styles.animation = anim;
    replayPreviewAnimation();
  }
};

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
type VsCodeSidebarMode = 'explorer' | 'search';

const activeVsCodeTab = ref<VsCodeTab>('blocks.json');
const activeVsCodeSidebar = ref<VsCodeSidebarMode | null>('explorer');
const vsCodeBlocksCode = ref('');
const isVsCodeCodeDirty = ref(false);

// VS Code Search & Replace Engine
const vsCodeSearchQuery = ref('');
const vsCodeReplaceQuery = ref('');
const isVsCodeReplaceOpen = ref(false);
const vsCodeSearchCaseSensitive = ref(false);
const vsCodeSearchWholeWord = ref(false);
const vsCodeSearchInputRef = ref<HTMLInputElement | null>(null);
const vsCodeTextareaRef = ref<HTMLTextAreaElement | null>(null);
const vsCodePreRef = ref<HTMLElement | null>(null);
const vsCodeGutterRef = ref<HTMLElement | null>(null);

const toggleVsCodeSidebar = (mode: VsCodeSidebarMode) => {
  if (activeVsCodeSidebar.value === mode) {
    activeVsCodeSidebar.value = null;
  } else {
    activeVsCodeSidebar.value = mode;
    if (mode === 'search') {
      nextTick(() => {
        vsCodeSearchInputRef.value?.focus();
        vsCodeSearchInputRef.value?.select();
      });
    }
  }
};

const syncGutterScroll = (e: Event) => {
  const target = e.target as HTMLElement;
  if (vsCodeGutterRef.value) {
    vsCodeGutterRef.value.scrollTop = target.scrollTop;
  }
};

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

interface VsCodeSearchMatch {
  line: number;
  col: number;
  before: string;
  highlight: string;
  after: string;
  fullLine: string;
}

interface VsCodeSearchGroup {
  filename: VsCodeTab;
  fileType: string;
  icon: string;
  isCollapsed: boolean;
  matches: VsCodeSearchMatch[];
}

const vsCodeSearchResults = computed<VsCodeSearchGroup[]>(() => {
  const q = vsCodeSearchQuery.value.trim();
  if (!q) return [];

  const files: { name: VsCodeTab; content: string; type: string; icon: string }[] = [
    { name: 'blocks.json', content: vsCodeBlocksCode.value || schemaJsonText.value, type: 'json', icon: '{ }' },
    { name: 'index.html', content: generatedHtmlCode.value, type: 'html', icon: '<>' },
    { name: 'theme.css', content: generatedCssCode.value, type: 'css', icon: '#' },
    { name: 'docker-compose.yml', content: generatedDockerCode.value, type: 'docker', icon: '🐳' }
  ];

  const results: VsCodeSearchGroup[] = [];

  for (const file of files) {
    const lines = file.content.split('\n');
    const matches: VsCodeSearchMatch[] = [];

    for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
      const lineStr = lines[lineIdx];

      if (vsCodeSearchWholeWord.value) {
        const flags = vsCodeSearchCaseSensitive.value ? 'g' : 'gi';
        const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b${escaped}\\b`, flags);
        let regexResult: RegExpExecArray | null;
        while ((regexResult = regex.exec(lineStr)) !== null) {
          const idx = regexResult.index;
          const matchedText = regexResult[0];
          const before = lineStr.substring(Math.max(0, idx - 20), idx);
          const after = lineStr.substring(idx + matchedText.length, Math.min(lineStr.length, idx + matchedText.length + 25));
          matches.push({
            line: lineIdx + 1,
            col: idx + 1,
            before: idx > 20 ? '...' + before : before,
            highlight: matchedText,
            after: (idx + matchedText.length + 25) < lineStr.length ? after + '...' : after,
            fullLine: lineStr.trim()
          });
        }
      } else {
        const searchTarget = vsCodeSearchCaseSensitive.value ? lineStr : lineStr.toLowerCase();
        const searchPattern = vsCodeSearchCaseSensitive.value ? q : q.toLowerCase();

        let startPos = 0;
        let matchIdx = -1;
        while ((matchIdx = searchTarget.indexOf(searchPattern, startPos)) !== -1) {
          const matchedText = lineStr.substring(matchIdx, matchIdx + q.length);
          const before = lineStr.substring(Math.max(0, matchIdx - 20), matchIdx);
          const after = lineStr.substring(matchIdx + q.length, Math.min(lineStr.length, matchIdx + q.length + 25));
          matches.push({
            line: lineIdx + 1,
            col: matchIdx + 1,
            before: matchIdx > 20 ? '...' + before : before,
            highlight: matchedText,
            after: (matchIdx + q.length + 25) < lineStr.length ? after + '...' : after,
            fullLine: lineStr.trim()
          });
          startPos = matchIdx + Math.max(1, q.length);
        }
      }
    }

    if (matches.length > 0) {
      results.push({
        filename: file.name,
        fileType: file.type,
        icon: file.icon,
        isCollapsed: false,
        matches
      });
    }
  }

  return results;
});

const totalVsCodeSearchResults = computed(() => {
  return vsCodeSearchResults.value.reduce((acc, g) => acc + g.matches.length, 0);
});

const jumpToSearchResult = (filename: VsCodeTab, match: VsCodeSearchMatch) => {
  activeVsCodeTab.value = filename;

  nextTick(() => {
    const lineHeight = 21;
    const targetScroll = Math.max(0, (match.line - 6) * lineHeight);

    if (filename === 'blocks.json' && vsCodeTextareaRef.value) {
      const textarea = vsCodeTextareaRef.value;
      const content = textarea.value;
      const lines = content.split('\n');
      let charPos = 0;
      for (let i = 0; i < match.line - 1 && i < lines.length; i++) {
        charPos += lines[i].length + 1;
      }
      charPos += Math.max(0, match.col - 1);

      textarea.focus();
      textarea.setSelectionRange(charPos, charPos + match.highlight.length);
      textarea.scrollTop = targetScroll;
      if (vsCodeGutterRef.value) {
        vsCodeGutterRef.value.scrollTop = targetScroll;
      }
    } else if (vsCodePreRef.value) {
      vsCodePreRef.value.scrollTop = targetScroll;
      if (vsCodeGutterRef.value) {
        vsCodeGutterRef.value.scrollTop = targetScroll;
      }
    }
  });
};

const executeVsCodeReplaceAll = () => {
  const q = vsCodeSearchQuery.value;
  if (!q) return;

  const replaceWith = vsCodeReplaceQuery.value;

  if (activeVsCodeTab.value === 'blocks.json') {
    const flags = vsCodeSearchCaseSensitive.value ? 'g' : 'gi';
    const escaped = vsCodeSearchWholeWord.value
      ? `\\b${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`
      : q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escaped, flags);

    const matches = vsCodeBlocksCode.value.match(regex);
    const count = matches ? matches.length : 0;

    if (count > 0) {
      vsCodeBlocksCode.value = vsCodeBlocksCode.value.replace(regex, replaceWith);
      isVsCodeCodeDirty.value = true;
      showToast(`Berhasil mengganti ${count} teks di blocks.json!`, 'success');
    } else {
      showToast('Tidak ada kecocokan ditemukan untuk diganti di blocks.json.', 'info');
    }
  } else {
    showToast('File ini read-only. Penggantian hanya didukung di blocks.json.', 'info');
  }
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
            <div class="zoom-dropdown-pill" ref="zoomDropdownRef">
              <button
                class="zoom-pill-trigger"
                :class="{ 'is-open': isZoomDropdownOpen }"
                @click.stop="toggleZoomDropdown"
                type="button"
                title="Pilih Zoom Level"
              >
                <span>{{ Math.round(zoom * 100) }}%</span>
                <ChevronDown :size="11" class="zoom-chevron-icon" :class="{ 'is-rotated': isZoomDropdownOpen }" />
              </button>
              <transition name="dropdown-scale">
                <div v-if="isZoomDropdownOpen" class="custom-floating-dropdown zoom-floating-dropdown">
                  <div class="custom-dropdown-header">
                    <span class="custom-dropdown-title">Zoom Level</span>
                  </div>
                  <div class="custom-dropdown-list">
                    <button
                      v-for="z in zoomPresets"
                      :key="z.value"
                      type="button"
                      class="custom-dropdown-item"
                      :class="{ active: zoom === z.value }"
                      @click="selectZoomFromDropdown(z.value)"
                    >
                      <span class="custom-dropdown-item-label">{{ z.label }}</span>
                      <Check v-if="zoom === z.value" :size="13" class="custom-dropdown-check" />
                    </button>
                  </div>
                </div>
              </transition>
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
            <!-- TAB 1: BLOCKS LIBRARY (Canva/Figma Component Picker) -->
            <div v-if="activeLeftTab === 'blocks'" class="dock-blocks-catalog">
              <div class="dock-catalog-header">
                <div class="dock-section-head" style="margin-bottom: 0;">
                  <h4>Katalog Blok Website</h4>
                  <p>Pilih dan tambahkan komponen visual kaya ke kanvas halaman.</p>
                </div>

                <!-- Live Search Box -->
                <div class="dock-search-box">
                  <Search :size="13" class="search-icon" />
                  <input
                    v-model="catalogSearchQuery"
                    type="text"
                    placeholder="Cari blok (progress, slide, modal, card)..."
                    class="catalog-search-input"
                  />
                  <button
                    v-if="catalogSearchQuery"
                    class="catalog-clear-btn"
                    @click="catalogSearchQuery = ''"
                    title="Hapus pencarian"
                  >
                    <X :size="11" />
                  </button>
                </div>

                <!-- Category Filter Chips -->
                <div class="catalog-category-chips">
                  <button
                    v-for="cat in blockCategories"
                    :key="cat.id"
                    class="cat-chip-btn"
                    :class="{ active: selectedCatalogCategory === cat.id }"
                    @click="selectedCatalogCategory = cat.id"
                  >
                    {{ cat.label }}
                  </button>
                </div>

                <!-- Count Bar -->
                <div class="catalog-count-bar">
                  <span>Komponen Tersedia</span>
                  <span class="catalog-count-badge">{{ filteredCatalogItems.length }} Blok</span>
                </div>
              </div>

              <!-- Visual Wireframe Cards Grid -->
              <div class="block-cards-grid">
                <div
                  v-for="item in filteredCatalogItems"
                  :key="item.id"
                  class="visual-wireframe-card"
                  @click="addBlockFromLibrary(item.type)"
                  :title="'Tambah ' + item.name + ' ke Kanvas'"
                >
                  <!-- Top Bar: Category Pill & Quick Add Button -->
                  <div class="card-top-row">
                    <span class="card-badge-pill">{{ item.badge || 'KOMPONEN' }}</span>
                    <span class="btn-quick-add">
                      <Plus :size="12" /> Tambah
                    </span>
                  </div>

                  <!-- CANVA-STYLE MINI VISUAL WIREFRAME PREVIEW -->
                  <div class="block-wireframe-preview" :class="'wf-' + item.previewWireframe">
                    <!-- 1. Navbar Wireframe -->
                    <div v-if="item.previewWireframe === 'navbar'" class="mini-wf-navbar">
                      <div class="mini-brand"><span class="mini-dot"></span><span>STUDIO</span></div>
                      <div class="mini-links"><span></span><span></span><span></span></div>
                      <div class="mini-pill-btn"></div>
                    </div>

                    <!-- 2. Hero Wireframe -->
                    <div v-else-if="item.previewWireframe === 'hero'" class="mini-wf-hero">
                      <div class="mini-badge-line"></div>
                      <div class="mini-title-line"></div>
                      <div class="mini-desc-line"></div>
                      <div class="mini-buttons-row">
                        <div class="mini-btn primary"></div>
                        <div class="mini-btn secondary"></div>
                      </div>
                    </div>

                    <!-- 3. Features Bento Wireframe -->
                    <div v-else-if="item.previewWireframe === 'features'" class="mini-wf-bento">
                      <div v-for="i in 3" :key="i" class="mini-bento-tile">
                        <span class="mini-icon-circle"></span>
                        <span class="mini-line-sm"></span>
                        <span class="mini-line-xs"></span>
                      </div>
                    </div>

                    <!-- 4. Progress Bar Wireframe -->
                    <div v-else-if="item.previewWireframe === 'progressbar'" class="mini-wf-progress">
                      <div class="mini-pg-row">
                        <div class="mini-pg-label"><span>Lighthouse Core</span><span>95%</span></div>
                        <div class="mini-pg-track"><div class="mini-pg-fill" style="width: 95%"></div></div>
                      </div>
                      <div class="mini-pg-row">
                        <div class="mini-pg-label"><span>Docker RAM</span><span>72%</span></div>
                        <div class="mini-pg-track"><div class="mini-pg-fill" style="width: 72%"></div></div>
                      </div>
                      <div class="mini-pg-row">
                        <div class="mini-pg-label"><span>SSL Ingress</span><span>100%</span></div>
                        <div class="mini-pg-track"><div class="mini-pg-fill" style="width: 100%"></div></div>
                      </div>
                    </div>

                    <!-- 5. Accordion Wireframe -->
                    <div v-else-if="item.previewWireframe === 'accordion'" class="mini-wf-accordion">
                      <div class="mini-acc-item open">
                        <div class="mini-acc-head"><span>Isolasi cgroups v2</span><span class="mini-chevron">▼</span></div>
                        <div class="mini-acc-body"><span class="mini-line-xs"></span><span class="mini-line-xs w-75"></span></div>
                      </div>
                      <div class="mini-acc-item">
                        <div class="mini-acc-head"><span>Otomatisasi SSL TLS</span><span class="mini-chevron">▶</span></div>
                      </div>
                      <div class="mini-acc-item">
                        <div class="mini-acc-head"><span>Koneksi Custom Domain</span><span class="mini-chevron">▶</span></div>
                      </div>
                    </div>

                    <!-- 6. Carousel Wireframe -->
                    <div v-else-if="item.previewWireframe === 'carousel'" class="mini-wf-carousel">
                      <div class="mini-carousel-arrows">
                        <span class="mini-arrow">&lt;</span>
                        <div class="mini-slide-content">
                          <span class="mini-slide-tag">Rilis 2.4</span>
                          <span class="mini-line-sm"></span>
                        </div>
                        <span class="mini-arrow">&gt;</span>
                      </div>
                      <div class="mini-carousel-dots">
                        <span class="dot active"></span><span class="dot"></span><span class="dot"></span>
                      </div>
                    </div>

                    <!-- 7. Form Control Wireframe -->
                    <div v-else-if="item.previewWireframe === 'formcontrol'" class="mini-wf-form">
                      <div class="mini-form-row"><span class="mini-input-field">Nama Lengkap...</span></div>
                      <div class="mini-form-row"><span class="mini-input-field">name@domain.com</span></div>
                      <div class="mini-form-row split">
                        <span class="mini-select-field">Pilih Layanan ▼</span>
                        <span class="mini-submit-btn">Kirim</span>
                      </div>
                    </div>

                    <!-- 8. Card Grid Wireframe -->
                    <div v-else-if="item.previewWireframe === 'card'" class="mini-wf-cards">
                      <div v-for="i in 3" :key="i" class="mini-card-col">
                        <div class="mini-card-img"></div>
                        <span class="mini-line-sm"></span>
                        <span class="mini-line-xs"></span>
                      </div>
                    </div>

                    <!-- 9. Modal Wireframe -->
                    <div v-else-if="item.previewWireframe === 'modal'" class="mini-wf-modal-backdrop">
                      <div class="mini-wf-modal-dialog">
                        <div class="mini-modal-head"><span>Akses Pro</span><span class="mini-close">&times;</span></div>
                        <span class="mini-line-xs"></span>
                        <div class="mini-modal-btns">
                          <span class="mini-btn-xs cancel">Tutup</span>
                          <span class="mini-btn-xs ok">Klaim</span>
                        </div>
                      </div>
                    </div>

                    <!-- 10. Dropdown Wireframe -->
                    <div v-else-if="item.previewWireframe === 'dropdown'" class="mini-wf-dropdown">
                      <div class="mini-dropdown-trigger">
                        <span>Filter Kategori</span>
                        <span class="mini-arrow">▼</span>
                      </div>
                      <div class="mini-dropdown-menu">
                        <span class="mini-dd-item active">✓ Cloud & Docker</span>
                        <span class="mini-dd-item">Studio UI/UX</span>
                      </div>
                    </div>

                    <!-- 11. List Group Wireframe -->
                    <div v-else-if="item.previewWireframe === 'listgroup'" class="mini-wf-listgroup">
                      <div class="mini-lg-row active"><span class="mini-chk">✓</span><span>Domain Otomatis</span></div>
                      <div class="mini-lg-row"><span class="mini-chk">✓</span><span>cgroups v2 Kernel</span></div>
                      <div class="mini-lg-row"><span class="mini-chk">✓</span><span>BFF Go Latensi 1ms</span></div>
                    </div>

                    <!-- 12. Pricing Wireframe -->
                    <div v-else-if="item.previewWireframe === 'pricing'" class="mini-wf-pricing">
                      <div class="mini-price-col"><span>49k</span><div class="mini-btn-xs">Pilih</div></div>
                      <div class="mini-price-col popular"><span class="pop-pill">PRO</span><span>149k</span><div class="mini-btn-xs pop">Pilih</div></div>
                      <div class="mini-price-col"><span>399k</span><div class="mini-btn-xs">Pilih</div></div>
                    </div>

                    <!-- 13. Stats Wireframe -->
                    <div v-else-if="item.previewWireframe === 'stats'" class="mini-wf-stats">
                      <div class="mini-stat-tile"><strong>99.98%</strong><span>Uptime</span></div>
                      <div class="mini-stat-tile"><strong>1.2ms</strong><span>Latency</span></div>
                      <div class="mini-stat-tile"><strong>12.8M</strong><span>Requests</span></div>
                      <div class="mini-stat-tile"><strong>256MB</strong><span>RAM</span></div>
                    </div>

                    <!-- 14. CTA Wireframe -->
                    <div v-else-if="item.previewWireframe === 'cta'" class="mini-wf-cta">
                      <span class="mini-cta-title">Siap Deploy Website?</span>
                      <span class="mini-cta-btn">Mulai Sekarang</span>
                    </div>

                    <!-- 15. Pagination Wireframe -->
                    <div v-else-if="item.previewWireframe === 'pagination'" class="mini-wf-pagination">
                      <span class="mini-pg-btn">&laquo;</span>
                      <span class="mini-pg-btn">1</span>
                      <span class="mini-pg-btn active">2</span>
                      <span class="mini-pg-btn">3</span>
                      <span class="mini-pg-btn">&raquo;</span>
                    </div>

                    <!-- 16. Breadcrumb Wireframe -->
                    <div v-else-if="item.previewWireframe === 'breadcrumb'" class="mini-wf-breadcrumb">
                      <span>Home</span><span class="slash">/</span>
                      <span>Docs</span><span class="slash">/</span>
                      <span class="active">Editor</span>
                    </div>

                    <!-- 17. Footer Wireframe -->
                    <div v-else class="mini-wf-footer">
                      <div class="mini-ft-cols">
                        <div class="col"><span class="bar"></span><span class="bar sm"></span></div>
                        <div class="col"><span class="bar"></span><span class="bar sm"></span></div>
                        <div class="col"><span class="bar"></span><span class="bar sm"></span></div>
                      </div>
                      <div class="mini-ft-copy"><span>© 2026 HeroCMS Studio</span></div>
                    </div>
                  </div>

                  <!-- Bottom Meta -->
                  <div class="card-meta">
                    <strong>{{ item.name }}</strong>
                    <span>{{ item.desc }}</span>
                  </div>
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
                <div class="font-dropdown-wrapper" ref="fontDropdownRef">
                  <button
                    class="font-pill-trigger"
                    :class="{ 'is-open': isFontDropdownOpen }"
                    @click.stop="toggleFontDropdown"
                    type="button"
                    title="Pilih Font Family"
                  >
                    <span class="font-pill-label" :style="{ fontFamily: currentFont }">{{ currentFontLabel }}</span>
                    <ChevronDown :size="12" class="font-chevron-icon" :class="{ 'is-rotated': isFontDropdownOpen }" />
                  </button>
                  <transition name="dropdown-scale">
                    <div v-if="isFontDropdownOpen" class="custom-floating-dropdown font-floating-dropdown">
                      <div class="custom-dropdown-header">
                        <span class="custom-dropdown-title">Keluarga Font</span>
                        <span class="custom-dropdown-count-badge">{{ fontFamilies.length }}</span>
                      </div>
                      <div class="custom-dropdown-list">
                        <button
                          v-for="f in fontFamilies"
                          :key="f.id"
                          type="button"
                          class="custom-dropdown-item"
                          :class="{ active: currentFont === f.id }"
                          @click="selectFontFromDropdown(f.id)"
                        >
                          <div class="font-item-info">
                            <span class="font-item-name" :style="{ fontFamily: f.id }">{{ f.id }}</span>
                            <span class="font-item-desc">{{ f.name }}</span>
                          </div>
                          <Check v-if="currentFont === f.id" :size="13" class="custom-dropdown-check" />
                        </button>
                      </div>
                    </div>
                  </transition>
                </div>
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
                      'is-locked': block.isLocked,
                      [block.styles?.animation && block.styles.animation !== 'none' ? 'anim-' + block.styles.animation : '']: true
                    }"
                    :style="{
                      backgroundColor: block.styles?.bgColor,
                      color: block.styles?.textColor,
                      fontFamily: block.styles?.fontFamily,
                      fontWeight: block.styles?.fontWeight,
                      letterSpacing: block.styles?.letterSpacing ? `${block.styles.letterSpacing}px` : undefined,
                      textTransform: block.styles?.textTransform,
                      animationDuration: block.styles?.animationDuration ? `${block.styles.animationDuration}s` : undefined,
                      '--accent-brand': block.styles?.accentColor || activeContainer.accentColor
                    }"
                    @click="selectBlock(block.id, $event)"
                    @dblclick="openRichModalEditor(block)"
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
                        <!-- Tombol Buka Editor Konten, Tipografi, Warna & Animasi -->
                        <button
                          type="button"
                          class="float-btn highlight-edit-btn"
                          @click="openRichModalEditor(block)"
                          title="Buka Editor Konten, Tipografi, Warna & Animasi"
                        >
                          <Edit3 :size="12" /> Edit Konten & Gaya
                        </button>
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
                      <div class="site-brand-logo" :style="{ color: block.styles?.accentColor || activeContainer.accentColor }">
                        <span class="brand-cube-icon">◆</span>
                        <span class="brand-title">{{ block.title }}</span>
                      </div>
                      <div class="nav-links-cluster">
                        <a href="#hero" class="nav-anchor active">Beranda</a>
                        <a href="#features" class="nav-anchor">Keunggulan</a>
                        <a href="#pricing" class="nav-anchor">Layanan</a>
                        <a href="#cta" class="nav-anchor">Kontak</a>
                        <button class="btn-nav-action" :style="{ backgroundColor: block.styles?.accentColor || activeContainer.accentColor }">
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
                          background: `radial-gradient(circle, ${(block.styles?.accentColor || activeContainer.accentColor)}33 0%, transparent 70%)`
                        }"
                      ></div>

                      <div
                        v-if="block.badge"
                        class="hero-badge-tag"
                        :style="{
                          color: block.styles?.accentColor || activeContainer.accentColor,
                          borderColor: (block.styles?.accentColor || activeContainer.accentColor) + '40',
                          backgroundColor: (block.styles?.accentColor || activeContainer.accentColor) + '12'
                        }"
                      >
                        <span>{{ block.badge }}</span>
                      </div>

                      <h1 class="hero-main-heading">
                        {{ block.title }}
                      </h1>

                      <div v-if="block.styles?.richContent" v-html="block.styles.richContent" class="hero-bio-lead"></div>
                      <p v-else class="hero-bio-lead">
                        {{ block.subtitle }}
                      </p>

                      <div class="hero-cta-cluster">
                        <button
                          class="btn-primary-glow"
                          :style="{ backgroundColor: block.styles?.accentColor || activeContainer.accentColor }"
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
                      v-else-if="block.type === 'features' || block.type === 'showcase'"
                      class="rendered-features-block"
                      :style="{ padding: `${block.styles?.paddingY || 60}px 32px` }"
                    >
                      <div class="section-title-wrap" :style="{ textAlign: block.styles?.align || 'center' }">
                        <span v-if="block.badge" class="badge-mini-caps">{{ block.badge }}</span>
                        <h2 class="sec-headline">{{ block.title }}</h2>
                        <div v-if="block.styles?.richContent" v-html="block.styles.richContent" class="sec-lead"></div>
                        <p v-else-if="block.subtitle" class="sec-lead">{{ block.subtitle }}</p>
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
                              color: block.styles?.accentColor || activeContainer.accentColor,
                              backgroundColor: (block.styles?.accentColor || activeContainer.accentColor) + '12'
                            }"
                          >
                            <component :is="getIconComponent(item.icon)" :size="20" />
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
                      <div class="section-title-wrap" :style="{ textAlign: block.styles?.align || 'center' }">
                        <span v-if="block.badge" class="badge-mini-caps">{{ block.badge }}</span>
                        <h2 class="sec-headline">{{ block.title }}</h2>
                        <div v-if="block.styles?.richContent" v-html="block.styles.richContent" class="sec-lead"></div>
                        <p v-else-if="block.subtitle" class="sec-lead">{{ block.subtitle }}</p>
                      </div>

                      <div class="pricing-cards-row">
                        <div
                          v-for="item in block.items"
                          :key="item.id"
                          class="price-tier-card"
                          :class="{ featured: item.tag === 'Terpopuler' }"
                        >
                          <span v-if="item.tag" class="tier-tag-pill" :style="{ backgroundColor: block.styles?.accentColor || activeContainer.accentColor }">
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
                              <Check :size="13" :color="block.styles?.accentColor || activeContainer.accentColor" />
                              <span>{{ f }}</span>
                            </li>
                          </ul>
                          <button
                            class="btn-tier-action"
                            :style="{
                              backgroundColor: item.tag === 'Terpopuler' ? (block.styles?.accentColor || activeContainer.accentColor) : '#f1f5f9',
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
                          borderColor: (block.styles?.accentColor || activeContainer.accentColor) + '30',
                          background: `linear-gradient(135deg, ${(block.styles?.accentColor || activeContainer.accentColor)}15 0%, #ffffff80 100%)`
                        }"
                      >
                        <h2 class="cta-heading">{{ block.title }}</h2>
                        <div v-if="block.styles?.richContent" v-html="block.styles.richContent" class="cta-lead"></div>
                        <p v-else class="cta-lead">{{ block.subtitle }}</p>
                        <button
                          class="btn-cta-big"
                          :style="{ backgroundColor: block.styles?.accentColor || activeContainer.accentColor }"
                        >
                          {{ block.buttonText || 'Mulai Sekarang' }}
                        </button>
                      </div>
                    </section>

                    <!-- BLOCK TYPE: PROGRESS BAR -->
                    <section
                      v-else-if="block.type === 'progressbar'"
                      class="rendered-progressbar-block"
                      :style="{ padding: `${block.styles?.paddingY || 56}px 32px` }"
                    >
                      <div class="section-title-wrap" :style="{ textAlign: block.styles?.align || 'left' }">
                        <span v-if="block.badge" class="badge-mini-caps">{{ block.badge }}</span>
                        <h2 class="sec-headline">{{ block.title }}</h2>
                        <div v-if="block.styles?.richContent" v-html="block.styles.richContent" class="sec-lead"></div>
                        <p v-else-if="block.subtitle" class="sec-lead">{{ block.subtitle }}</p>
                      </div>

                      <div class="progress-meters-grid">
                        <div
                          v-for="item in block.items"
                          :key="item.id"
                          class="progress-meter-card"
                        >
                          <div class="pm-head">
                            <span class="pm-title">{{ item.title }}</span>
                            <span class="pm-val" :style="{ color: block.styles?.accentColor || activeContainer.accentColor }">{{ item.percentage || 0 }}%</span>
                          </div>
                          <div class="pm-track">
                            <div
                              class="pm-fill"
                              :style="{
                                width: (item.percentage || 0) + '%',
                                background: `linear-gradient(90deg, ${block.styles?.accentColor || activeContainer.accentColor}, #38bdf8)`
                              }"
                            ></div>
                          </div>
                          <p v-if="item.desc" class="pm-desc">{{ item.desc }}</p>
                        </div>
                      </div>
                    </section>

                    <!-- BLOCK TYPE: ACCORDION / COLLAPSE -->
                    <section
                      v-else-if="block.type === 'accordion'"
                      class="rendered-accordion-block"
                      :style="{ padding: `${block.styles?.paddingY || 56}px 32px` }"
                    >
                      <div class="section-title-wrap" :style="{ textAlign: block.styles?.align || 'center' }">
                        <span v-if="block.badge" class="badge-mini-caps">{{ block.badge }}</span>
                        <h2 class="sec-headline">{{ block.title }}</h2>
                        <div v-if="block.styles?.richContent" v-html="block.styles.richContent" class="sec-lead"></div>
                        <p v-else-if="block.subtitle" class="sec-lead">{{ block.subtitle }}</p>
                      </div>

                      <div class="accordion-items-stack">
                        <div
                          v-for="(item, idx) in block.items"
                          :key="item.id"
                          class="accordion-card-item"
                          :class="{ 'is-expanded': (block.activeItemIndex ?? 0) === idx }"
                        >
                          <button class="acc-card-trigger" @click.stop="toggleAccordionItem(block, idx)">
                            <span class="acc-card-title">{{ item.title }}</span>
                            <ChevronDown :size="16" class="acc-card-icon" />
                          </button>
                          <div v-if="(block.activeItemIndex ?? 0) === idx" class="acc-card-content">
                            {{ item.desc }}
                          </div>
                        </div>
                      </div>
                    </section>

                    <!-- BLOCK TYPE: CAROUSEL / SLIDER -->
                    <section
                      v-else-if="block.type === 'carousel'"
                      class="rendered-carousel-block"
                      :style="{ padding: `${block.styles?.paddingY || 60}px 32px` }"
                    >
                      <div class="section-title-wrap" :style="{ textAlign: block.styles?.align || 'center' }">
                        <span v-if="block.badge" class="badge-mini-caps">{{ block.badge }}</span>
                        <h2 class="sec-headline">{{ block.title }}</h2>
                        <div v-if="block.styles?.richContent" v-html="block.styles.richContent" class="sec-lead"></div>
                        <p v-else-if="block.subtitle" class="sec-lead">{{ block.subtitle }}</p>
                      </div>

                      <div class="carousel-stage-container">
                        <div v-if="block.items && block.items.length > 0" class="carousel-slide-card">
                          <div v-if="block.items[block.activeItemIndex || 0]?.image" class="carousel-slide-img-wrap">
                            <img
                              :src="block.items[block.activeItemIndex || 0].image"
                              :alt="block.items[block.activeItemIndex || 0].title || 'Slide Image'"
                              class="carousel-slide-img"
                            />
                          </div>
                          <span v-if="block.items[block.activeItemIndex || 0]?.tag" class="carousel-tag-badge">
                            {{ block.items[block.activeItemIndex || 0]?.tag }}
                          </span>
                          <h3 class="carousel-headline">{{ block.items[block.activeItemIndex || 0]?.title }}</h3>
                          <p class="carousel-lead-desc">{{ block.items[block.activeItemIndex || 0]?.desc }}</p>
                          <span v-if="block.items[block.activeItemIndex || 0]?.author" class="carousel-author-credit">
                            — {{ block.items[block.activeItemIndex || 0]?.author }}
                          </span>
                        </div>

                        <!-- Carousel Nav Arrows -->
                        <div class="carousel-nav-arrows">
                          <button class="carousel-arrow-btn" @click.stop="prevSlide(block)" title="Slide Sebelumnya">
                            <ArrowLeft :size="16" />
                          </button>
                          <button class="carousel-arrow-btn" @click.stop="nextSlide(block)" title="Slide Berikutnya">
                            <ArrowRight :size="16" />
                          </button>
                        </div>

                        <!-- Dots -->
                        <div class="carousel-dots-indicator">
                          <button
                            v-for="(item, sIdx) in block.items"
                            :key="item.id"
                            class="carousel-dot"
                            :class="{ active: (block.activeItemIndex || 0) === sIdx }"
                            @click.stop="setSlide(block, sIdx)"
                          ></button>
                        </div>
                      </div>
                    </section>

                    <!-- BLOCK TYPE: FORM CONTROL -->
                    <section
                      v-else-if="block.type === 'formcontrol'"
                      class="rendered-formcontrol-block"
                      :style="{ padding: `${block.styles?.paddingY || 60}px 32px` }"
                    >
                      <div class="section-title-wrap" :style="{ textAlign: block.styles?.align || 'center' }">
                        <span v-if="block.badge" class="badge-mini-caps">{{ block.badge }}</span>
                        <h2 class="sec-headline">{{ block.title }}</h2>
                        <div v-if="block.styles?.richContent" v-html="block.styles.richContent" class="sec-lead"></div>
                        <p v-else-if="block.subtitle" class="sec-lead">{{ block.subtitle }}</p>
                      </div>

                      <div class="form-card-container">
                        <form class="form-fields-stack" @submit.prevent>
                          <div v-for="item in block.items" :key="item.id" class="form-field-group">
                            <label class="form-field-label">{{ item.title }}</label>
                            <select v-if="item.tag === 'select'" class="form-rendered-select">
                              <option>Pilihan 1: Solusi Cloud & Docker</option>
                              <option>Pilihan 2: Visual Studio CMS</option>
                              <option>Pilihan 3: Domain & Edge SSL</option>
                            </select>
                            <textarea
                              v-else-if="item.tag === 'textarea'"
                              rows="3"
                              class="form-rendered-textarea"
                              :placeholder="item.label || item.desc"
                            ></textarea>
                            <input
                              v-else
                              :type="item.tag || 'text'"
                              class="form-rendered-input"
                              :placeholder="item.label || item.desc"
                            />
                          </div>
                          <button
                            class="btn-form-submit"
                            :style="{ backgroundColor: block.styles?.accentColor || activeContainer.accentColor }"
                          >
                            {{ block.buttonText || 'Kirim Pesan Sekarang' }}
                          </button>
                        </form>
                      </div>
                    </section>

                    <!-- BLOCK TYPE: MODAL -->
                    <section
                      v-else-if="block.type === 'modal'"
                      class="rendered-modal-block"
                      :style="{ padding: `${block.styles?.paddingY || 48}px 32px` }"
                    >
                      <div class="modal-preview-stage">
                        <div class="modal-stage-header">
                          <span class="modal-stage-badge">{{ block.badge || 'POPUP PROMOSI' }}</span>
                          <button class="modal-stage-close" @click.stop="toggleBlockOpen(block)">
                            <X :size="14" />
                          </button>
                        </div>
                        <div class="modal-stage-body">
                          <h3 class="modal-stage-title">{{ block.title }}</h3>
                          <div v-if="block.styles?.richContent" v-html="block.styles.richContent" class="modal-stage-desc"></div>
                          <p v-else class="modal-stage-desc">{{ block.subtitle }}</p>
                          <div class="modal-stage-actions">
                            <button class="btn-modal-secondary" @click.stop>
                              {{ block.secondaryButtonText || 'Nanti Saja' }}
                            </button>
                            <button
                              class="btn-modal-primary"
                              :style="{ backgroundColor: block.styles?.accentColor || activeContainer.accentColor }"
                              @click.stop
                            >
                              {{ block.buttonText || 'Klaim Sekarang' }}
                            </button>
                          </div>
                        </div>
                      </div>
                    </section>

                    <!-- BLOCK TYPE: DROPDOWN -->
                    <section
                      v-else-if="block.type === 'dropdown'"
                      class="rendered-dropdown-block"
                      :style="{ padding: `${block.styles?.paddingY || 36}px 32px` }"
                    >
                      <div class="dropdown-component-card">
                        <div class="section-title-wrap" style="margin-bottom: 12px; text-align: left;">
                          <span v-if="block.badge" class="badge-mini-caps">{{ block.badge }}</span>
                          <h3 class="sec-headline" style="font-size: 1.1rem;">{{ block.title }}</h3>
                          <div v-if="block.styles?.richContent" v-html="block.styles.richContent" style="font-size: 0.85rem; color: #64748b; margin-top: 4px;"></div>
                          <p v-else-if="block.subtitle" style="font-size: 0.85rem; color: #64748b; margin-top: 4px;">{{ block.subtitle }}</p>
                        </div>
                        <button class="dropdown-trigger-btn" @click.stop="toggleBlockOpen(block)">
                          <span>{{ block.items?.[block.activeItemIndex || 0]?.title || 'Pilih Kategori...' }}</span>
                          <ChevronDown :size="16" />
                        </button>
                        <div v-if="block.isOpen" class="dropdown-options-list">
                          <div
                            v-for="(item, dIdx) in block.items"
                            :key="item.id"
                            class="dropdown-option-row"
                            :class="{ 'is-selected': (block.activeItemIndex || 0) === dIdx }"
                            @click.stop="selectDropdownOption(block, dIdx)"
                          >
                            <span>{{ item.title }}</span>
                            <span v-if="item.desc" style="font-size: 0.72rem; color: #94a3b8;">{{ item.desc }}</span>
                          </div>
                        </div>
                      </div>
                    </section>

                    <!-- BLOCK TYPE: CARDS GRID -->
                    <section
                      v-else-if="block.type === 'card'"
                      class="rendered-card-block"
                      :style="{ padding: `${block.styles?.paddingY || 60}px 32px` }"
                    >
                      <div class="section-title-wrap" :style="{ textAlign: block.styles?.align || 'center' }">
                        <span v-if="block.badge" class="badge-mini-caps">{{ block.badge }}</span>
                        <h2 class="sec-headline">{{ block.title }}</h2>
                        <div v-if="block.styles?.richContent" v-html="block.styles.richContent" class="sec-lead"></div>
                        <p v-else-if="block.subtitle" class="sec-lead">{{ block.subtitle }}</p>
                      </div>

                      <div class="cards-showcase-grid">
                        <div
                          v-for="item in block.items"
                          :key="item.id"
                          class="showcase-grid-card"
                        >
                          <div class="card-header-banner">
                            <span v-if="item.tag" class="card-tag-pill">{{ item.tag }}</span>
                          </div>
                          <div class="card-body-content">
                            <h3 class="card-grid-title">{{ item.title }}</h3>
                            <p class="card-grid-desc">{{ item.desc }}</p>
                            <span v-if="item.role" class="card-role-label">Peran: {{ item.role }}</span>
                          </div>
                        </div>
                      </div>
                    </section>

                    <!-- BLOCK TYPE: LIST GROUP -->
                    <section
                      v-else-if="block.type === 'listgroup'"
                      class="rendered-listgroup-block"
                      :style="{ padding: `${block.styles?.paddingY || 56}px 32px` }"
                    >
                      <div class="section-title-wrap" :style="{ textAlign: block.styles?.align || 'left' }">
                        <span v-if="block.badge" class="badge-mini-caps">{{ block.badge }}</span>
                        <h2 class="sec-headline">{{ block.title }}</h2>
                        <div v-if="block.styles?.richContent" v-html="block.styles.richContent" class="sec-lead"></div>
                        <p v-else-if="block.subtitle" class="sec-lead">{{ block.subtitle }}</p>
                      </div>

                      <div class="listgroup-stack-card">
                        <div
                          v-for="item in block.items"
                          :key="item.id"
                          class="listgroup-item-row"
                        >
                          <span class="lg-check-icon"><Check :size="14" /></span>
                          <div class="lg-text-meta">
                            <span class="lg-item-title">{{ item.title }}</span>
                            <span v-if="item.desc" class="lg-item-desc">{{ item.desc }}</span>
                          </div>
                          <span v-if="item.tag" class="lg-badge-tag">{{ item.tag }}</span>
                        </div>
                      </div>
                    </section>

                    <!-- BLOCK TYPE: STATS -->
                    <section
                      v-else-if="block.type === 'stats'"
                      class="rendered-stats-block"
                      :style="{ padding: `${block.styles?.paddingY || 56}px 32px` }"
                    >
                      <div class="section-title-wrap" :style="{ textAlign: block.styles?.align || 'center' }">
                        <span v-if="block.badge" class="badge-mini-caps">{{ block.badge }}</span>
                        <h2 class="sec-headline">{{ block.title }}</h2>
                        <div v-if="block.styles?.richContent" v-html="block.styles.richContent" class="sec-lead"></div>
                        <p v-else-if="block.subtitle" class="sec-lead">{{ block.subtitle }}</p>
                      </div>

                      <div class="stats-counters-row">
                        <div
                          v-for="item in block.items"
                          :key="item.id"
                          class="stat-counter-box"
                        >
                          <span class="stat-number-val">{{ item.title }}</span>
                          <span class="stat-number-desc">{{ item.desc }}</span>
                        </div>
                      </div>
                    </section>

                    <!-- BLOCK TYPE: PAGINATION -->
                    <section
                      v-else-if="block.type === 'pagination'"
                      class="rendered-pagination-block"
                      :style="{ padding: `${block.styles?.paddingY || 32}px 32px` }"
                    >
                      <div v-if="block.subtitle" style="text-align: center; font-size: 0.8rem; color: #64748b; margin-bottom: 8px;">
                        {{ block.subtitle }}
                      </div>
                      <div class="pagination-controls-row">
                        <button class="pagination-btn" title="Sebelumnya">&laquo;</button>
                        <button
                          v-for="(item, pIdx) in block.items"
                          :key="item.id"
                          class="pagination-btn"
                          :class="{ 'is-active': (block.activeItemIndex || 0) === pIdx }"
                          @click.stop="setPageNumber(block, pIdx)"
                        >
                          {{ item.title }}
                        </button>
                        <button class="pagination-btn" title="Berikutnya">&raquo;</button>
                      </div>
                    </section>

                    <!-- BLOCK TYPE: BREADCRUMB -->
                    <nav
                      v-else-if="block.type === 'breadcrumb'"
                      class="rendered-breadcrumb-block"
                      :style="{ padding: `${block.styles?.paddingY || 20}px 32px` }"
                    >
                      <div class="breadcrumb-trail-nav">
                        <template v-for="(item, bIdx) in block.items" :key="item.id">
                          <span v-if="bIdx > 0" class="bc-sep-icon">/</span>
                          <a
                            v-if="bIdx < (block.items?.length || 1) - 1"
                            :href="item.url || '#'"
                            class="bc-item-anchor"
                            @click.prevent
                          >
                            {{ item.title }}
                          </a>
                          <span v-else class="bc-item-current">{{ item.title }}</span>
                        </template>
                      </div>
                    </nav>

                    <!-- BLOCK TYPE 6: FOOTER -->
                    <footer
                      v-else-if="block.type === 'footer'"
                      class="rendered-footer-block"
                      :style="{ padding: `${block.styles?.paddingY || 36}px 32px` }"
                    >
                      <div class="footer-divider-line"></div>
                      <div class="footer-content-row">
                        <div class="footer-brand">
                          <span class="brand-cube-icon" :style="{ color: block.styles?.accentColor || activeContainer.accentColor }">◆</span>
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
                :class="{ active: activeVsCodeSidebar === 'explorer' }"
                @click="toggleVsCodeSidebar('explorer')"
                title="Penjelajah File (Ctrl+Shift+E)"
              >
                <Files :size="18" />
              </button>
              <button
                class="vscode-act-btn"
                :class="{ active: activeVsCodeSidebar === 'search' }"
                @click="toggleVsCodeSidebar('search')"
                title="Pencarian di Workspace (Ctrl+Shift+F)"
              >
                <Search :size="17" />
                <span v-if="totalVsCodeSearchResults > 0" class="vscode-act-badge">
                  {{ totalVsCodeSearchResults > 99 ? '99+' : totalVsCodeSearchResults }}
                </span>
              </button>
            </div>
          </aside>

          <!-- 2. VS Code Primary Sidebar (Explorer or Search) -->
          <transition name="vscode-explorer-slide">
            <aside v-if="activeVsCodeSidebar" class="vscode-explorer-sidebar">
              <!-- A. Explorer View -->
              <div v-if="activeVsCodeSidebar === 'explorer'" class="vscode-sidebar-inner">
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
              </div>

              <!-- B. Search View -->
              <div v-else-if="activeVsCodeSidebar === 'search'" class="vscode-sidebar-inner vscode-search-panel">
                <div class="vscode-explorer-header">
                  <span class="vscode-explorer-title">PENCARIAN</span>
                  <span v-if="totalVsCodeSearchResults > 0" class="vscode-explorer-badge">
                    {{ totalVsCodeSearchResults }} hasil
                  </span>
                </div>

                <!-- Search Input Controls -->
                <div class="vscode-search-controls">
                  <div class="vscode-search-row">
                    <div class="vscode-input-with-tools">
                      <input
                        ref="vsCodeSearchInputRef"
                        v-model="vsCodeSearchQuery"
                        type="text"
                        placeholder="Cari kata kunci..."
                        class="vscode-tool-input"
                        spellcheck="false"
                      />
                      <button
                        v-if="vsCodeSearchQuery"
                        class="vscode-input-clear-btn"
                        @click="vsCodeSearchQuery = ''"
                        title="Bersihkan"
                      >
                        <X :size="12" />
                      </button>
                      <div class="vscode-input-modifiers">
                        <button
                          class="vscode-modifier-btn"
                          :class="{ active: vsCodeSearchCaseSensitive }"
                          @click="vsCodeSearchCaseSensitive = !vsCodeSearchCaseSensitive"
                          title="Cocokkan Besar/Kecil (Match Case)"
                        >
                          Aa
                        </button>
                        <button
                          class="vscode-modifier-btn"
                          :class="{ active: vsCodeSearchWholeWord }"
                          @click="vsCodeSearchWholeWord = !vsCodeSearchWholeWord"
                          title="Cocokkan Seluruh Kata (Match Whole Word)"
                        >
                          ab
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Replace Input Toggle -->
                  <div class="vscode-replace-box">
                    <button
                      class="vscode-replace-collapse-btn"
                      :class="{ expanded: isVsCodeReplaceOpen }"
                      @click="isVsCodeReplaceOpen = !isVsCodeReplaceOpen"
                      title="Alihkan Ganti Teks"
                    >
                      <ChevronRight :size="12" />
                    </button>
                    <div v-if="isVsCodeReplaceOpen" class="vscode-replace-fields">
                      <div class="vscode-input-with-tools">
                        <input
                          v-model="vsCodeReplaceQuery"
                          type="text"
                          placeholder="Ganti dengan..."
                          class="vscode-tool-input"
                          spellcheck="false"
                        />
                      </div>
                      <button
                        class="vscode-replace-exec-btn"
                        :disabled="!vsCodeSearchQuery"
                        @click="executeVsCodeReplaceAll"
                        title="Ganti Semua di blocks.json"
                      >
                        Ganti Semua
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Search Results Tree -->
                <div class="vscode-search-results">
                  <div v-if="!vsCodeSearchQuery" class="vscode-search-prompt">
                    <Search :size="22" class="search-prompt-icon" />
                    <p class="search-prompt-title">Cari di Seluruh Workspace</p>
                    <p class="search-prompt-sub">Ketik kata untuk menemukan teks di blocks.json, index.html, theme.css, dan docker-compose.yml</p>
                    <div class="search-sample-tags">
                      <button class="sample-tag" @click="vsCodeSearchQuery = 'navbar'">navbar</button>
                      <button class="sample-tag" @click="vsCodeSearchQuery = 'hero'">hero</button>
                      <button class="sample-tag" @click="vsCodeSearchQuery = 'accentColor'">accentColor</button>
                      <button class="sample-tag" @click="vsCodeSearchQuery = 'subdomain'">subdomain</button>
                    </div>
                  </div>

                  <div v-else-if="totalVsCodeSearchResults === 0" class="vscode-search-none">
                    <p>Tidak ada hasil untuk "{{ vsCodeSearchQuery }}"</p>
                  </div>

                  <div v-else class="vscode-search-group-list">
                    <div
                      v-for="group in vsCodeSearchResults"
                      :key="group.filename"
                      class="vscode-search-file-block"
                    >
                      <div
                        class="vscode-search-file-title"
                        @click="group.isCollapsed = !group.isCollapsed"
                      >
                        <ChevronDown v-if="!group.isCollapsed" :size="12" />
                        <ChevronRight v-else :size="12" />
                        <span class="file-icon" :class="group.fileType">{{ group.icon }}</span>
                        <span class="file-name">{{ group.filename }}</span>
                        <span class="match-count-pill">{{ group.matches.length }}</span>
                      </div>

                      <div v-if="!group.isCollapsed" class="vscode-search-match-items">
                        <button
                          v-for="match in group.matches"
                          :key="match.line + '-' + match.col"
                          class="vscode-search-hit-row"
                          @click="jumpToSearchResult(group.filename, match)"
                        >
                          <span class="hit-line-num">{{ match.line }}</span>
                          <span class="hit-snippet">
                            <span>{{ match.before }}</span>
                            <mark class="hit-mark">{{ match.highlight }}</mark>
                            <span>{{ match.after }}</span>
                          </span>
                        </button>
                      </div>
                    </div>
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
              <!-- Line Numbers Gutter (Synced with editor scroll) -->
              <div ref="vsCodeGutterRef" class="vscode-gutter">
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
                  ref="vsCodeTextareaRef"
                  v-model="vsCodeBlocksCode"
                  @keydown="onVsCodeKeydown"
                  @input="isVsCodeCodeDirty = true"
                  @scroll="syncGutterScroll"
                  class="vscode-code-textarea"
                  spellcheck="false"
                  autocomplete="off"
                  autocorrect="off"
                  autocapitalize="off"
                ></textarea>

                <!-- If read-only generated code (index.html, theme.css, docker-compose.yml) -->
                <pre
                  v-else
                  ref="vsCodePreRef"
                  @scroll="syncGutterScroll"
                  class="vscode-code-pre"
                >{{ currentVsCodeContent }}</pre>
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
              <span>Visual & Efek</span>
            </button>
          </div>

          <!-- Inspector Content Body -->
          <div class="inspector-scroll-area">
            <template v-if="selectedBlock">
              <!-- TAB 1: TATA LETAK & SPACING -->
              <div v-if="activeRightTab === 'layout'" class="tab-pane-inspector">
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

      <!-- =================================================================== -->
      <!-- 4. RICH STUDIO MODAL: ADVANCED WYSIWYG & VISUAL DESIGN ENGINE       -->
      <!-- =================================================================== -->
      <div v-if="isRichEditorOpen && editingBlockDraft" class="rich-editor-backdrop" @click.self="closeRichModalEditor">
        <div class="rich-editor-modal">
          <!-- Modal Top Header -->
          <div class="rich-modal-header">
            <div class="rich-header-left">
              <div class="rich-title-icon-box">
                <Edit3 :size="18" color="#0f172a" />
              </div>
              <div class="rich-title-text-cluster">
                <div class="rich-title-sup">
                  <span class="rich-header-badge">{{ editingBlockDraft.type }}</span>
                  <span class="rich-header-breadcrumb">/ Studio Visual Engine / Pengaturan Desain & Konten</span>
                </div>
                <h3 class="rich-header-heading">
                  Studio Editor Konten & Desain: {{ editingBlockDraft.name }}
                </h3>
              </div>
            </div>

            <button type="button" class="btn-close-rich-modal" @click="closeRichModalEditor" title="Tutup Modal (ESC)">
              <X :size="16" />
            </button>
          </div>

          <!-- Dedicated Sub-Header Tab Navigation Bar -->
          <div class="rich-tabs-subbar">
            <div class="segmented-tab-group">
              <button
                type="button"
                class="btn-segmented-tab"
                :class="{ active: richEditorActiveTab === 'content' }"
                @click="richEditorActiveTab = 'content'"
              >
                <Type :size="13" />
                <span>Konten & WYSIWYG</span>
              </button>
              <button
                type="button"
                class="btn-segmented-tab"
                :class="{ active: richEditorActiveTab === 'typography' }"
                @click="richEditorActiveTab = 'typography'"
              >
                <Sparkles :size="13" />
                <span>Tipografi & Font</span>
              </button>
              <button
                type="button"
                class="btn-segmented-tab"
                :class="{ active: richEditorActiveTab === 'appearance' }"
                @click="richEditorActiveTab = 'appearance'"
              >
                <Palette :size="13" />
                <span>Warna & Gaya</span>
              </button>
              <button
                type="button"
                class="btn-segmented-tab"
                :class="{ active: richEditorActiveTab === 'animation' }"
                @click="richEditorActiveTab = 'animation'"
              >
                <Zap :size="13" />
                <span>Animasi & Gerakan</span>
              </button>
            </div>
          </div>

          <!-- Modal Body (2 Columns Split) -->
          <div class="rich-modal-body">
            <!-- Left Column: Controls & Form per Tab -->
            <div class="rich-controls-pane">
              <!-- TAB 1: KONTEN & WYSIWYG -->
              <div v-if="richEditorActiveTab === 'content'" style="display: flex; flex-direction: column; gap: 16px;">
                <div class="field-item">
                  <label class="field-label">Nama Bagian / Komponen</label>
                  <input type="text" v-model="editingBlockDraft.name" class="field-input" />
                </div>
                <div class="field-item" v-if="editingBlockDraft.badge !== undefined">
                  <label class="field-label">Label Badge Kategori</label>
                  <input type="text" v-model="editingBlockDraft.badge" class="field-input" />
                </div>
                <div class="field-item">
                  <label class="field-label">Judul Utama (Headline)</label>
                  <input type="text" v-model="editingBlockDraft.title" class="field-input" />
                </div>
                <div class="field-item" v-if="editingBlockDraft.buttonText !== undefined">
                  <label class="field-label">Label Tombol Aksi (CTA)</label>
                  <input type="text" v-model="editingBlockDraft.buttonText" class="field-input" />
                </div>

                <!-- WYSIWYG Rich Text Editor Surface -->
                <div class="field-item">
                  <div class="field-label-split" style="margin-bottom: 6px;">
                    <label class="field-label">Deskripsi Kaya (Notion-Style WYSIWYG)</label>
                    <span style="font-size: 10px; color: #2563eb; font-weight: 600;">Format Bebas: Bold, Italic, List & Perataan</span>
                  </div>
                  <div class="wysiwyg-unified-card">
                    <div class="wysiwyg-card-toolbar">
                      <button type="button" class="wysiwyg-btn" @click="formatWysiwyg('bold')" title="Tebal (Ctrl+B)">
                        <Bold :size="13" />
                      </button>
                      <button type="button" class="wysiwyg-btn" @click="formatWysiwyg('italic')" title="Miring (Ctrl+I)">
                        <Italic :size="13" />
                      </button>
                      <button type="button" class="wysiwyg-btn" @click="formatWysiwyg('underline')" title="Garis Bawah (Ctrl+U)">
                        <Underline :size="13" />
                      </button>
                      <button type="button" class="wysiwyg-btn" @click="formatWysiwyg('strikeThrough')" title="Coret">
                        <s>S</s>
                      </button>
                      <div class="wysiwyg-divider"></div>
                      <button type="button" class="wysiwyg-btn" @click="formatWysiwyg('justifyLeft')" title="Rata Kiri">
                        <AlignLeft :size="13" />
                      </button>
                      <button type="button" class="wysiwyg-btn" @click="formatWysiwyg('justifyCenter')" title="Rata Tengah">
                        <AlignCenter :size="13" />
                      </button>
                      <button type="button" class="wysiwyg-btn" @click="formatWysiwyg('justifyRight')" title="Rata Kanan">
                        <AlignRight :size="13" />
                      </button>
                      <button type="button" class="wysiwyg-btn" @click="formatWysiwyg('justifyFull')" title="Rata Kanan Kiri">
                        <AlignJustify :size="13" />
                      </button>
                      <div class="wysiwyg-divider"></div>
                      <button type="button" class="wysiwyg-btn" @click="formatWysiwyg('insertUnorderedList')" title="Daftar Bullet">
                        •
                      </button>
                      <button type="button" class="wysiwyg-btn" @click="formatWysiwyg('insertOrderedList')" title="Daftar Angka">
                        1.
                      </button>
                      <button type="button" class="wysiwyg-btn" @click="formatWysiwyg('removeFormat')" title="Hapus Format">
                        <RotateCcw :size="13" />
                      </button>
                    </div>
                    <div
                      ref="richContentSurfaceRef"
                      class="wysiwyg-card-surface"
                      contenteditable="true"
                      data-placeholder="Ketik konten blok di sini..."
                      v-html="editingBlockDraft.styles?.richContent || editingBlockDraft.subtitle || ''"
                      @input="onWysiwygInput"
                    ></div>
                    <div class="wysiwyg-card-footer">
                      <span>{{ wysiwygWordCount }} kata · {{ wysiwygCharCount }} karakter</span>
                      <span style="font-size: 10px; color: #64748b;">Editor Aktif</span>
                    </div>
                  </div>
                </div>

                <!-- Sub-items editor inside Studio Modal -->
                <div v-if="editingBlockDraft.items && editingBlockDraft.items.length > 0" class="field-item">
                  <div class="field-label-split" style="margin-bottom: 8px;">
                    <label class="field-label">Daftar Item / Sub-Elemen ({{ editingBlockDraft.items.length }})</label>
                    <span v-if="blockUsesIcons(editingBlockDraft.type)" style="font-size: 10px; color: #2563eb; font-weight: 600;">Klik icon untuk mengganti</span>
                    <span v-else-if="blockUsesImages(editingBlockDraft.type)" style="font-size: 10px; color: #2563eb; font-weight: 600;">Unggah gambar slide</span>
                    <span v-else style="font-size: 10px; color: #64748b; font-weight: 500;">Sesuaikan konten item</span>
                  </div>
                  <div class="sub-items-editor-list">
                    <div
                      v-for="(subItem, subIdx) in editingBlockDraft.items"
                      :key="subItem.id || subIdx"
                      class="sub-item-card-v2"
                    >
                      <div class="sub-item-top-bar">
                        <div class="sub-item-pill-group">
                          <span class="sub-item-badge">Item #{{ subIdx + 1 }}</span>
                          <span v-if="subItem.title" class="sub-item-preview-title">{{ subItem.title }}</span>
                        </div>
                        <div class="sub-item-actions-cluster">
                          <button
                            type="button"
                            class="btn-subitem-action"
                            :disabled="subIdx === 0"
                            @click="moveSubItemUp(subIdx)"
                            title="Naikkan Urutan"
                          >
                            <ChevronUp :size="13" />
                          </button>
                          <button
                            type="button"
                            class="btn-subitem-action"
                            :disabled="subIdx === editingBlockDraft.items.length - 1"
                            @click="moveSubItemDown(subIdx)"
                            title="Turunkan Urutan"
                          >
                            <ChevronDown :size="13" />
                          </button>
                          <button
                            type="button"
                            class="btn-subitem-action"
                            @click="duplicateSubItem(subIdx)"
                            title="Duplikasi Item"
                          >
                            <Copy :size="12" />
                          </button>
                          <button
                            v-if="editingBlockDraft.items.length > 1"
                            type="button"
                            class="btn-subitem-action danger"
                            @click="editingBlockDraft.items.splice(subIdx, 1)"
                            title="Hapus Item"
                          >
                            <Trash2 :size="12" />
                          </button>
                        </div>
                      </div>

                      <div class="sub-item-main-row">
                        <!-- Icon Trigger Button (Only for blocks that use icons) -->
                        <button
                          v-if="blockUsesIcons(editingBlockDraft.type)"
                          type="button"
                          class="sub-item-icon-trigger"
                          @click="openIconPicker(subIdx)"
                          title="Klik untuk memilih Icon"
                        >
                          <component :is="getIconComponent(subItem.icon)" :size="20" />
                          <span class="icon-trigger-label">Ganti</span>
                        </button>

                        <div class="sub-item-title-col">
                          <div v-if="subItem.title !== undefined" class="sub-item-field-row">
                            <label class="sub-item-field-label">
                              {{
                                editingBlockDraft.type === 'accordion' ? 'Pertanyaan Accordion / FAQ' :
                                editingBlockDraft.type === 'carousel' ? 'Judul Slide' :
                                editingBlockDraft.type === 'progressbar' ? 'Label Metrik / Capaian' :
                                editingBlockDraft.type === 'pricing' ? 'Nama Paket' :
                                'Judul Item'
                              }}
                            </label>
                            <input
                              type="text"
                              v-model="subItem.title"
                              class="field-input sub-item-input"
                              :placeholder="
                                editingBlockDraft.type === 'accordion' ? 'Pertanyaan FAQ...' :
                                editingBlockDraft.type === 'carousel' ? 'Judul slide...' :
                                editingBlockDraft.type === 'progressbar' ? 'Nama metrik...' :
                                'Judul item...'
                              "
                            />
                          </div>
                          <div v-if="subItem.label !== undefined" class="sub-item-field-row" style="margin-top: 4px;">
                            <label class="sub-item-field-label">
                              {{ editingBlockDraft.type === 'formcontrol' ? 'Placeholder Input' : 'Label Badge' }}
                            </label>
                            <input
                              type="text"
                              v-model="subItem.label"
                              class="field-input sub-item-input"
                              placeholder="Label..."
                            />
                          </div>
                        </div>
                      </div>

                      <!-- Slide Image Uploader for Carousel -->
                      <div v-if="blockUsesImages(editingBlockDraft.type)" class="sub-item-image-uploader">
                        <label class="sub-item-field-label">Gambar Slide Carousel</label>
                        <div class="slide-img-preview-row">
                          <div class="slide-img-preview-box">
                            <img
                              v-if="subItem.image"
                              :src="subItem.image"
                              alt="Slide Preview"
                              class="slide-thumbnail"
                            />
                            <div v-else class="slide-img-placeholder">
                              <ImageIcon :size="18" />
                              <span>Tidak ada gambar</span>
                            </div>
                            <button
                              v-if="subItem.image"
                              type="button"
                              class="btn-remove-slide-img"
                              @click="removeSlideImage(subIdx)"
                              title="Hapus Gambar"
                            >
                              <X :size="11" />
                            </button>
                          </div>
                          <div class="slide-img-controls">
                            <label :for="'slide-upload-' + subIdx" class="btn-upload-slide-img">
                              <UploadCloud :size="13" /> Unggah Gambar
                            </label>
                            <input
                              :id="'slide-upload-' + subIdx"
                              type="file"
                              accept="image/*"
                              @change="onSlideImageUpload(subIdx, $event)"
                              style="display: none;"
                            />
                            <input
                              type="text"
                              v-model="subItem.image"
                              class="field-input sub-item-input"
                              placeholder="Atau tempel URL gambar (https://...)"
                              style="font-size: 11px;"
                            />
                          </div>
                        </div>
                      </div>

                      <div v-if="subItem.desc !== undefined" class="sub-item-field-row">
                        <label class="sub-item-field-label">
                          {{
                            editingBlockDraft.type === 'accordion' ? 'Jawaban / Penjelasan Accordion' :
                            editingBlockDraft.type === 'carousel' ? 'Deskripsi Slide' :
                            editingBlockDraft.type === 'progressbar' ? 'Keterangan Metrik / Info Kuota' :
                            'Deskripsi Item'
                          }}
                        </label>
                        <textarea
                          v-model="subItem.desc"
                          class="field-textarea sub-item-textarea"
                          rows="2"
                          :placeholder="
                            editingBlockDraft.type === 'accordion' ? 'Tuliskan jawaban atau rincian FAQ di sini...' :
                            editingBlockDraft.type === 'carousel' ? 'Deskripsi singkat slide...' :
                            'Deskripsi item...'
                          "
                        ></textarea>
                      </div>

                      <div v-if="subItem.percentage !== undefined" class="sub-item-progress-row">
                        <label class="sub-item-field-label" style="white-space: nowrap; margin-bottom: 0;">Nilai: {{ subItem.percentage }}%</label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          v-model.number="subItem.percentage"
                          class="range-slider"
                          style="flex: 1;"
                        />
                      </div>

                      <div v-if="subItem.tag !== undefined" class="sub-item-field-row" style="margin-top: 4px;">
                        <label class="sub-item-field-label">Tag / Lencana</label>
                        <input
                          type="text"
                          v-model="subItem.tag"
                          class="field-input sub-item-input"
                          placeholder="Contoh: Terpopuler, Baru..."
                        />
                      </div>

                      <div v-if="subItem.price !== undefined" class="sub-item-field-row" style="margin-top: 4px;">
                        <label class="sub-item-field-label">Harga & Periode</label>
                        <div style="display: flex; gap: 8px;">
                          <input
                            type="text"
                            v-model="subItem.price"
                            class="field-input sub-item-input"
                            placeholder="Harga (mis: Rp 299rb)"
                            style="flex: 1;"
                          />
                          <input
                            type="text"
                            v-model="subItem.period"
                            class="field-input sub-item-input"
                            placeholder="Periode (mis: /bln)"
                            style="width: 100px;"
                          />
                        </div>
                      </div>

                      <div v-if="subItem.role !== undefined" class="sub-item-field-row" style="margin-top: 4px;">
                        <label class="sub-item-field-label">Peran / Jabatan</label>
                        <input
                          type="text"
                          v-model="subItem.role"
                          class="field-input sub-item-input"
                          placeholder="Peran (mis: Lead Engineer)"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      @click="addNewSubItem"
                      class="btn-add-subitem"
                    >
                      <Plus :size="13" /> Tambah Item Baru
                    </button>
                  </div>
                </div>
              </div>

              <!-- TAB 2: TIPOGRAFI & FONT -->
              <div v-else-if="richEditorActiveTab === 'typography'" style="display: flex; flex-direction: column; gap: 14px;">
                <div class="field-item">
                  <div class="field-label-split" style="margin-bottom: 8px;">
                    <label class="field-label">Pilih Jenis Font (Font Family)</label>
                    <span style="font-size: 10px; color: #2563eb; font-weight: 600;">Google Fonts Enterprise</span>
                  </div>
                  <div class="typography-compact-grid">
                    <div
                      v-for="font in fontOptions"
                      :key="font.id"
                      class="font-compact-card"
                      :class="{ 'is-selected': editingBlockDraft.styles?.fontFamily === font.family }"
                      @click="setEditingFont(font)"
                    >
                      <div class="font-compact-top">
                        <span class="font-compact-name">{{ font.name.split(' ')[0] }}</span>
                        <span class="font-category-tag">{{ font.category }}</span>
                      </div>
                      <div class="font-compact-preview" :style="{ fontFamily: font.family }">
                        Ag Headline Preview 123
                      </div>
                    </div>
                  </div>
                </div>

                <div class="color-setting-card">
                  <div class="field-label-split">
                    <label class="field-label">Ketebalan Font (Font Weight)</label>
                    <span class="field-val-badge">{{ editingBlockDraft.styles?.fontWeight || 'Default' }}</span>
                  </div>
                  <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                    <button
                      v-for="weight in ['400', '500', '600', '700', '800', '900']"
                      :key="weight"
                      type="button"
                      class="btn-segmented-tab"
                      :class="{ active: editingBlockDraft.styles?.fontWeight === weight }"
                      @click="editingBlockDraft.styles ? (editingBlockDraft.styles.fontWeight = weight) : null"
                      style="padding: 4px 10px; font-size: 11px;"
                    >
                      {{ weight === '400' ? 'Normal (400)' : weight === '600' ? 'SemiBold (600)' : weight === '700' ? 'Bold (700)' : weight === '900' ? 'Black (900)' : weight }}
                    </button>
                  </div>
                </div>

                <div class="color-setting-card">
                  <div class="field-label-split">
                    <label class="field-label">Letter Spacing (Jarak Karakter)</label>
                    <span class="field-val-badge">{{ editingBlockDraft.styles?.letterSpacing || 0 }}px</span>
                  </div>
                  <input
                    type="range"
                    min="-1"
                    max="6"
                    step="0.5"
                    :value="editingBlockDraft.styles?.letterSpacing || 0"
                    @input="editingBlockDraft.styles ? (editingBlockDraft.styles.letterSpacing = parseFloat(($event.target as HTMLInputElement).value)) : null"
                    class="range-slider"
                  />
                </div>

                <div class="color-setting-card">
                  <label class="field-label" style="margin-bottom: 8px;">Transformasi Teks (Text Transform)</label>
                  <div style="display: flex; gap: 6px;">
                    <button
                      v-for="tt in [
                        { id: 'none', label: 'Biasa (Default)' },
                        { id: 'uppercase', label: 'UPPERCASE' },
                        { id: 'capitalize', label: 'Capitalize' }
                      ]"
                      :key="tt.id"
                      type="button"
                      class="btn-segmented-tab"
                      :class="{ active: editingBlockDraft.styles?.textTransform === tt.id }"
                      @click="editingBlockDraft.styles ? (editingBlockDraft.styles.textTransform = tt.id as any) : null"
                      style="padding: 4px 10px; font-size: 11px;"
                    >
                      {{ tt.label }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- TAB 3: WARNA & GAYA -->
              <div v-else-if="richEditorActiveTab === 'appearance'" style="display: flex; flex-direction: column; gap: 14px;">
                <!-- Section 1: Curated Brand Palettes -->
                <div class="field-item">
                  <div class="field-label-split" style="margin-bottom: 8px;">
                    <label class="field-label">Preset Palet Brand Terpadu</label>
                    <span style="font-size: 10px; color: #2563eb; font-weight: 600;">1-Klik Harmonis</span>
                  </div>
                  <div class="brand-palettes-grid">
                    <div
                      v-for="pal in brandPalettes"
                      :key="pal.id"
                      class="brand-palette-card"
                      :class="{ 'is-active': editingBlockDraft.styles?.textColor === pal.textColor && editingBlockDraft.styles?.bgColor === pal.bgColor }"
                      @click="applyBrandPalette(pal)"
                    >
                      <div class="brand-palette-meta">
                        <span class="brand-palette-name">{{ pal.name }}</span>
                      </div>
                      <div class="brand-palette-desc">{{ pal.desc }}</div>
                      <div class="brand-palette-preview">
                        <span class="brand-preview-chip" :style="{ background: pal.textColor, color: '#ffffff' }">Text</span>
                        <span class="brand-preview-chip" :style="{ background: pal.bgColor, color: pal.textColor }">Card</span>
                        <span class="brand-preview-chip" :style="{ background: pal.accentColor, color: '#ffffff' }">Accent</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Section 2: Detailed Controls -->
                <div class="color-setting-card">
                  <div class="color-setting-header">
                    <span class="color-setting-title">Warna Teks Utama</span>
                    <span style="font-size: 11px; font-family: monospace; color: #64748b;">{{ editingBlockDraft.styles?.textColor || '#0f172a' }}</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                    <button
                      v-for="col in colorPresets"
                      :key="col.id"
                      type="button"
                      class="color-swatch-circle"
                      :style="{ backgroundColor: col.hex }"
                      :class="{ 'is-active': editingBlockDraft.styles?.textColor === col.hex }"
                      @click="setEditingColor(col, 'text')"
                      :title="col.name"
                    ></button>
                  </div>
                  <div class="color-picker-dual-control">
                    <input
                      type="color"
                      v-model="editingBlockDraft.styles!.textColor"
                      class="native-color-trigger"
                    />
                    <input
                      type="text"
                      v-model="editingBlockDraft.styles!.textColor"
                      class="field-input"
                      style="width: 140px; font-size: 12px; font-family: monospace;"
                      placeholder="#0f172a"
                    />
                  </div>
                </div>

                <div class="color-setting-card">
                  <div class="color-setting-header">
                    <span class="color-setting-title">Latar Belakang (Background Surface)</span>
                    <span style="font-size: 11px; font-family: monospace; color: #64748b;">{{ editingBlockDraft.styles?.bgColor || '#ffffff' }}</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                    <button
                      v-for="col in colorPresets"
                      :key="col.id"
                      type="button"
                      class="color-swatch-circle"
                      :style="{ backgroundColor: col.hex }"
                      :class="{ 'is-active': editingBlockDraft.styles?.bgColor === col.hex }"
                      @click="setEditingColor(col, 'bg')"
                      :title="col.name"
                    ></button>
                  </div>
                  <div class="color-picker-dual-control">
                    <input
                      type="color"
                      v-model="editingBlockDraft.styles!.bgColor"
                      class="native-color-trigger"
                    />
                    <input
                      type="text"
                      v-model="editingBlockDraft.styles!.bgColor"
                      class="field-input"
                      style="width: 140px; font-size: 12px; font-family: monospace;"
                      placeholder="#ffffff"
                    />
                  </div>
                </div>

                <div class="color-setting-card">
                  <div class="color-setting-header">
                    <span class="color-setting-title">Warna Aksen Brand / Tombol</span>
                    <span style="font-size: 11px; font-family: monospace; color: #64748b;">{{ editingBlockDraft.styles?.accentColor || '#2563eb' }}</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                    <button
                      v-for="col in colorPresets"
                      :key="col.id"
                      type="button"
                      class="color-swatch-circle"
                      :style="{ backgroundColor: col.hex }"
                      :class="{ 'is-active': editingBlockDraft.styles?.accentColor === col.hex }"
                      @click="setEditingColor(col, 'accent')"
                      :title="col.name"
                    ></button>
                  </div>
                  <div class="color-picker-dual-control">
                    <input
                      type="color"
                      v-model="editingBlockDraft.styles!.accentColor"
                      class="native-color-trigger"
                    />
                    <input
                      type="text"
                      v-model="editingBlockDraft.styles!.accentColor"
                      class="field-input"
                      style="width: 140px; font-size: 12px; font-family: monospace;"
                      placeholder="#2563eb"
                    />
                  </div>
                </div>
              </div>

              <!-- TAB 4: ANIMASI & GERAKAN -->
              <div v-else-if="richEditorActiveTab === 'animation'" style="display: flex; flex-direction: column; gap: 16px;">
                <div class="field-item">
                  <div class="field-label-split" style="margin-bottom: 8px;">
                    <label class="field-label">Pilih Efek Animasi</label>
                    <span style="font-size: 10px; color: #2563eb; font-weight: 600;">Aktif saat dilihat pengunjung</span>
                  </div>
                  <div class="animations-grid">
                    <div
                      v-for="anim in animationOptions"
                      :key="anim.id"
                      class="animation-card"
                      :class="{ 'is-active': editingBlockDraft.styles?.animation === anim.id }"
                      @click="setEditingAnimation(anim.id)"
                    >
                      <div class="anim-title">
                        <span>{{ anim.name }}</span>
                        <Zap v-if="editingBlockDraft.styles?.animation === anim.id" :size="14" color="#2563eb" />
                      </div>
                      <div class="anim-desc">{{ anim.desc }}</div>
                    </div>
                  </div>
                </div>

                <div class="field-item" v-if="editingBlockDraft.styles?.animation && editingBlockDraft.styles.animation !== 'none'">
                  <div class="field-label-split">
                    <label class="field-label">Durasi Animasi (Kecepatan Gerakan)</label>
                    <span class="field-val-badge">{{ editingBlockDraft.styles?.animationDuration || 0.65 }} detik</span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="2.5"
                    step="0.05"
                    :value="editingBlockDraft.styles?.animationDuration || 0.65"
                    @input="editingBlockDraft.styles ? (editingBlockDraft.styles.animationDuration = parseFloat(($event.target as HTMLInputElement).value)) : null; replayPreviewAnimation()"
                    class="range-slider"
                  />
                </div>
              </div>
            </div>

            <!-- Right Column: Interactive Realtime Live Preview -->
            <div class="rich-preview-pane">
              <div class="preview-stage-header">
                <span class="preview-stage-title">
                  <span class="live-pulse-dot"></span>
                  Pratinjau Interaktif Realtime
                </span>
                <div class="preview-device-switch">
                  <button
                    type="button"
                    class="btn-device"
                    :class="{ 'is-active': richPreviewDevice === 'desktop' }"
                    @click="richPreviewDevice = 'desktop'"
                    title="Desktop Preview"
                  >
                    <Laptop :size="13" />
                  </button>
                  <button
                    type="button"
                    class="btn-device"
                    :class="{ 'is-active': richPreviewDevice === 'tablet' }"
                    @click="richPreviewDevice = 'tablet'"
                    title="Tablet Preview"
                  >
                    <Tablet :size="13" />
                  </button>
                  <button
                    type="button"
                    class="btn-device"
                    :class="{ 'is-active': richPreviewDevice === 'mobile' }"
                    @click="richPreviewDevice = 'mobile'"
                    title="Mobile Phone Preview"
                  >
                    <Smartphone :size="13" />
                  </button>
                </div>
              </div>

              <!-- Authentic Browser Mockup Window in Preview -->
              <div class="preview-browser-frame" :class="'device-' + richPreviewDevice">
                <div class="browser-mock-titlebar">
                  <div class="mock-window-dots">
                    <span class="mock-dot red"></span>
                    <span class="mock-dot yellow"></span>
                    <span class="mock-dot green"></span>
                  </div>
                  <div class="mock-url-pill">
                    preview.herocms.internal/artboard/{{ editingBlockDraft.type.toLowerCase() }}
                  </div>
                  <button
                    type="button"
                    class="preview-replay-trigger"
                    @click="replayPreviewAnimation"
                    title="Putar Ulang Efek Animasi"
                  >
                    <RotateCcw :size="11" /> Putar Ulang
                  </button>
                </div>

                <div
                  class="browser-content-viewport"
                  :style="{
                    backgroundColor: editingBlockDraft.styles?.bgColor || '#ffffff',
                    color: editingBlockDraft.styles?.textColor || '#0f172a',
                    '--accent-brand': editingBlockDraft.styles?.accentColor || activeContainer.accentColor
                  }"
                >
                  <!-- Elemen Preview dengan style & animasi langsung yang 100% 1-to-1 dengan kanvas -->
                  <div
                    :key="animReplayKey"
                    class="live-preview-stage"
                    :class="[editingBlockDraft.styles?.animation && editingBlockDraft.styles.animation !== 'none' ? 'anim-' + editingBlockDraft.styles.animation : '']"
                    :style="{
                      fontFamily: editingBlockDraft.styles?.fontFamily,
                      fontWeight: editingBlockDraft.styles?.fontWeight,
                      letterSpacing: editingBlockDraft.styles?.letterSpacing ? `${editingBlockDraft.styles.letterSpacing}px` : undefined,
                      textTransform: editingBlockDraft.styles?.textTransform,
                      animationDuration: editingBlockDraft.styles?.animationDuration ? `${editingBlockDraft.styles.animationDuration}s` : undefined
                    }"
                  >
                    <!-- 1. NAVBAR PREVIEW -->
                    <nav
                      v-if="editingBlockDraft.type === 'navbar'"
                      class="rendered-nav-block"
                      :style="{ padding: `${editingBlockDraft.styles?.paddingY || 16}px 24px` }"
                    >
                      <div class="site-brand-logo" :style="{ color: editingBlockDraft.styles?.accentColor || activeContainer.accentColor }">
                        <span class="brand-cube-icon">◆</span>
                        <span class="brand-title">{{ editingBlockDraft.title }}</span>
                      </div>
                      <div class="nav-links-cluster">
                        <a href="#hero" class="nav-anchor active">Beranda</a>
                        <a href="#features" class="nav-anchor">Keunggulan</a>
                        <a href="#pricing" class="nav-anchor">Layanan</a>
                        <a href="#cta" class="nav-anchor">Kontak</a>
                        <button class="btn-nav-action" type="button" :style="{ backgroundColor: editingBlockDraft.styles?.accentColor || activeContainer.accentColor }">
                          {{ editingBlockDraft.buttonText || 'Hubungi Saya' }}
                        </button>
                      </div>
                    </nav>

                    <!-- 2. HERO PREVIEW -->
                    <header
                      v-else-if="editingBlockDraft.type === 'hero'"
                      class="rendered-hero-block"
                      :style="{
                        padding: `${editingBlockDraft.styles?.paddingY || 56}px 24px`,
                        textAlign: editingBlockDraft.styles?.align || 'center'
                      }"
                    >
                      <div
                        class="ambient-mesh-glow"
                        :style="{
                          background: `radial-gradient(circle, ${(editingBlockDraft.styles?.accentColor || activeContainer.accentColor)}33 0%, transparent 70%)`
                        }"
                      ></div>

                      <div
                        v-if="editingBlockDraft.badge"
                        class="hero-badge-tag"
                        :style="{
                          color: editingBlockDraft.styles?.accentColor || activeContainer.accentColor,
                          borderColor: (editingBlockDraft.styles?.accentColor || activeContainer.accentColor) + '40',
                          backgroundColor: (editingBlockDraft.styles?.accentColor || activeContainer.accentColor) + '12'
                        }"
                      >
                        <span>{{ editingBlockDraft.badge }}</span>
                      </div>

                      <h1 class="hero-main-heading">
                        {{ editingBlockDraft.title }}
                      </h1>

                      <div
                        v-if="editingBlockDraft.styles?.richContent"
                        v-html="editingBlockDraft.styles.richContent"
                        class="hero-bio-lead"
                      ></div>
                      <p v-else class="hero-bio-lead">
                        {{ editingBlockDraft.subtitle }}
                      </p>

                      <div class="hero-cta-cluster">
                        <button
                          class="btn-primary-glow"
                          type="button"
                          :style="{ backgroundColor: editingBlockDraft.styles?.accentColor || activeContainer.accentColor }"
                        >
                          <span>{{ editingBlockDraft.buttonText || 'Eksplorasi Karya' }}</span>
                          <ArrowRight :size="14" />
                        </button>
                        <button v-if="editingBlockDraft.secondaryButtonText" type="button" class="btn-secondary-clean">
                          <span>{{ editingBlockDraft.secondaryButtonText }}</span>
                        </button>
                      </div>
                    </header>

                    <!-- 3. FEATURES / SHOWCASE PREVIEW -->
                    <section
                      v-else-if="editingBlockDraft.type === 'features' || editingBlockDraft.type === 'showcase'"
                      class="rendered-features-block"
                      :style="{ padding: `${editingBlockDraft.styles?.paddingY || 40}px 20px` }"
                    >
                      <div class="section-title-wrap" :style="{ textAlign: editingBlockDraft.styles?.align || 'center' }">
                        <span v-if="editingBlockDraft.badge" class="badge-mini-caps">{{ editingBlockDraft.badge }}</span>
                        <h2 class="sec-headline">{{ editingBlockDraft.title }}</h2>
                        <div v-if="editingBlockDraft.styles?.richContent" v-html="editingBlockDraft.styles.richContent" class="sec-lead"></div>
                        <p v-else-if="editingBlockDraft.subtitle" class="sec-lead">{{ editingBlockDraft.subtitle }}</p>
                      </div>

                      <div class="features-cards-trio">
                        <div
                          v-for="item in editingBlockDraft.items"
                          :key="item.id"
                          class="feature-bento-card"
                        >
                          <div
                            class="card-icon-pill"
                            :style="{
                              color: editingBlockDraft.styles?.accentColor || activeContainer.accentColor,
                              backgroundColor: (editingBlockDraft.styles?.accentColor || activeContainer.accentColor) + '12'
                            }"
                          >
                            <component :is="getIconComponent(item.icon)" :size="20" />
                          </div>
                          <h3 class="card-item-title">{{ item.title }}</h3>
                          <p class="card-item-desc">{{ item.desc }}</p>
                        </div>
                      </div>
                    </section>

                    <!-- 4. PRICING PREVIEW -->
                    <section
                      v-else-if="editingBlockDraft.type === 'pricing'"
                      class="rendered-pricing-block"
                      :style="{ padding: `${editingBlockDraft.styles?.paddingY || 40}px 20px` }"
                    >
                      <div class="section-title-wrap" :style="{ textAlign: editingBlockDraft.styles?.align || 'center' }">
                        <span v-if="editingBlockDraft.badge" class="badge-mini-caps">{{ editingBlockDraft.badge }}</span>
                        <h2 class="sec-headline">{{ editingBlockDraft.title }}</h2>
                        <div v-if="editingBlockDraft.styles?.richContent" v-html="editingBlockDraft.styles.richContent" class="sec-lead"></div>
                        <p v-else-if="editingBlockDraft.subtitle" class="sec-lead">{{ editingBlockDraft.subtitle }}</p>
                      </div>

                      <div class="pricing-cards-row">
                        <div
                          v-for="item in editingBlockDraft.items"
                          :key="item.id"
                          class="price-tier-card"
                          :class="{ featured: item.tag === 'Terpopuler' }"
                        >
                          <span v-if="item.tag" class="tier-tag-pill" :style="{ backgroundColor: editingBlockDraft.styles?.accentColor || activeContainer.accentColor }">
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
                              <Check :size="13" :color="editingBlockDraft.styles?.accentColor || activeContainer.accentColor" />
                              <span>{{ f }}</span>
                            </li>
                          </ul>
                          <button
                            class="btn-tier-action"
                            type="button"
                            :style="{
                              backgroundColor: item.tag === 'Terpopuler' ? (editingBlockDraft.styles?.accentColor || activeContainer.accentColor) : '#f1f5f9',
                              color: item.tag === 'Terpopuler' ? '#ffffff' : '#0f172a'
                            }"
                          >
                            Pilih Paket
                          </button>
                        </div>
                      </div>
                    </section>

                    <!-- 5. CTA PREVIEW -->
                    <section
                      v-else-if="editingBlockDraft.type === 'cta'"
                      class="rendered-cta-block"
                      :style="{ padding: `${editingBlockDraft.styles?.paddingY || 36}px 20px` }"
                    >
                      <div
                        class="cta-inner-banner"
                        :style="{
                          borderColor: (editingBlockDraft.styles?.accentColor || activeContainer.accentColor) + '30',
                          background: `linear-gradient(135deg, ${(editingBlockDraft.styles?.accentColor || activeContainer.accentColor)}15 0%, #ffffff80 100%)`
                        }"
                      >
                        <h2 class="cta-heading">{{ editingBlockDraft.title }}</h2>
                        <div v-if="editingBlockDraft.styles?.richContent" v-html="editingBlockDraft.styles.richContent" class="cta-lead"></div>
                        <p v-else class="cta-lead">{{ editingBlockDraft.subtitle }}</p>
                        <button
                          class="btn-cta-big"
                          type="button"
                          :style="{ backgroundColor: editingBlockDraft.styles?.accentColor || activeContainer.accentColor }"
                        >
                          {{ editingBlockDraft.buttonText || 'Mulai Sekarang' }}
                        </button>
                      </div>
                    </section>

                    <!-- 6. PROGRESS BAR PREVIEW (1-to-1 with canvas cards) -->
                    <section
                      v-else-if="editingBlockDraft.type === 'progressbar'"
                      class="rendered-progressbar-block"
                      :style="{ padding: `${editingBlockDraft.styles?.paddingY || 40}px 20px` }"
                    >
                      <div class="section-title-wrap" :style="{ textAlign: editingBlockDraft.styles?.align || 'left' }">
                        <span v-if="editingBlockDraft.badge" class="badge-mini-caps">{{ editingBlockDraft.badge }}</span>
                        <h2 class="sec-headline">{{ editingBlockDraft.title }}</h2>
                        <div v-if="editingBlockDraft.styles?.richContent" v-html="editingBlockDraft.styles.richContent" class="sec-lead"></div>
                        <p v-else-if="editingBlockDraft.subtitle" class="sec-lead">{{ editingBlockDraft.subtitle }}</p>
                      </div>

                      <div class="progress-meters-grid">
                        <div
                          v-for="item in editingBlockDraft.items"
                          :key="item.id"
                          class="progress-meter-card"
                        >
                          <div class="pm-head">
                            <span class="pm-title">{{ item.title }}</span>
                            <span class="pm-val" :style="{ color: editingBlockDraft.styles?.accentColor || activeContainer.accentColor }">{{ item.percentage || 0 }}%</span>
                          </div>
                          <div class="pm-track">
                            <div
                              class="pm-fill"
                              :style="{
                                width: (item.percentage || 0) + '%',
                                background: `linear-gradient(90deg, ${editingBlockDraft.styles?.accentColor || activeContainer.accentColor}, #38bdf8)`
                              }"
                            ></div>
                          </div>
                          <p v-if="item.desc" class="pm-desc">{{ item.desc }}</p>
                        </div>
                      </div>
                    </section>

                    <!-- 7. ACCORDION / COLLAPSE PREVIEW -->
                    <section
                      v-else-if="editingBlockDraft.type === 'accordion'"
                      class="rendered-accordion-block"
                      :style="{ padding: `${editingBlockDraft.styles?.paddingY || 40}px 20px` }"
                    >
                      <div class="section-title-wrap" :style="{ textAlign: editingBlockDraft.styles?.align || 'center' }">
                        <span v-if="editingBlockDraft.badge" class="badge-mini-caps">{{ editingBlockDraft.badge }}</span>
                        <h2 class="sec-headline">{{ editingBlockDraft.title }}</h2>
                        <div v-if="editingBlockDraft.styles?.richContent" v-html="editingBlockDraft.styles.richContent" class="sec-lead"></div>
                        <p v-else-if="editingBlockDraft.subtitle" class="sec-lead">{{ editingBlockDraft.subtitle }}</p>
                      </div>

                      <div class="accordion-items-stack">
                        <div
                          v-for="(item, idx) in editingBlockDraft.items"
                          :key="item.id"
                          class="accordion-card-item"
                          :class="{ 'is-expanded': (editingBlockDraft.activeItemIndex ?? 0) === idx }"
                        >
                          <button class="acc-card-trigger" type="button" @click="toggleAccordionItem(editingBlockDraft, idx)">
                            <span class="acc-card-title">{{ item.title }}</span>
                            <ChevronDown :size="16" class="acc-card-icon" />
                          </button>
                          <div v-if="(editingBlockDraft.activeItemIndex ?? 0) === idx" class="acc-card-content">
                            {{ item.desc }}
                          </div>
                        </div>
                      </div>
                    </section>

                    <!-- 8. CAROUSEL / SLIDER PREVIEW -->
                    <section
                      v-else-if="editingBlockDraft.type === 'carousel'"
                      class="rendered-carousel-block"
                      :style="{ padding: `${editingBlockDraft.styles?.paddingY || 40}px 20px` }"
                    >
                      <div class="section-title-wrap" :style="{ textAlign: editingBlockDraft.styles?.align || 'center' }">
                        <span v-if="editingBlockDraft.badge" class="badge-mini-caps">{{ editingBlockDraft.badge }}</span>
                        <h2 class="sec-headline">{{ editingBlockDraft.title }}</h2>
                        <div v-if="editingBlockDraft.styles?.richContent" v-html="editingBlockDraft.styles.richContent" class="sec-lead"></div>
                        <p v-else-if="editingBlockDraft.subtitle" class="sec-lead">{{ editingBlockDraft.subtitle }}</p>
                      </div>

                      <div class="carousel-stage-container">
                        <div v-if="editingBlockDraft.items && editingBlockDraft.items.length > 0" class="carousel-slide-card">
                          <div v-if="editingBlockDraft.items[editingBlockDraft.activeItemIndex || 0]?.image" class="carousel-slide-img-wrap">
                            <img
                              :src="editingBlockDraft.items[editingBlockDraft.activeItemIndex || 0].image"
                              :alt="editingBlockDraft.items[editingBlockDraft.activeItemIndex || 0].title || 'Slide Image'"
                              class="carousel-slide-img"
                            />
                          </div>
                          <span v-if="editingBlockDraft.items[editingBlockDraft.activeItemIndex || 0]?.tag" class="carousel-tag-badge">
                            {{ editingBlockDraft.items[editingBlockDraft.activeItemIndex || 0]?.tag }}
                          </span>
                          <h3 class="carousel-headline">{{ editingBlockDraft.items[editingBlockDraft.activeItemIndex || 0]?.title }}</h3>
                          <p class="carousel-lead-desc">{{ editingBlockDraft.items[editingBlockDraft.activeItemIndex || 0]?.desc }}</p>
                          <span v-if="editingBlockDraft.items[editingBlockDraft.activeItemIndex || 0]?.author" class="carousel-author-credit">
                            — {{ editingBlockDraft.items[editingBlockDraft.activeItemIndex || 0]?.author }}
                          </span>
                        </div>

                        <!-- Carousel Nav Arrows -->
                        <div class="carousel-nav-arrows">
                          <button class="carousel-arrow-btn" type="button" @click="prevSlide(editingBlockDraft)" title="Slide Sebelumnya">
                            <ArrowLeft :size="16" />
                          </button>
                          <button class="carousel-arrow-btn" type="button" @click="nextSlide(editingBlockDraft)" title="Slide Berikutnya">
                            <ArrowRight :size="16" />
                          </button>
                        </div>

                        <!-- Dots -->
                        <div class="carousel-dots-indicator">
                          <button
                            v-for="(item, sIdx) in editingBlockDraft.items"
                            :key="item.id"
                            type="button"
                            class="carousel-dot"
                            :class="{ active: (editingBlockDraft.activeItemIndex || 0) === sIdx }"
                            @click="setSlide(editingBlockDraft, sIdx)"
                          ></button>
                        </div>
                      </div>
                    </section>

                    <!-- 9. FORM CONTROL PREVIEW -->
                    <section
                      v-else-if="editingBlockDraft.type === 'formcontrol'"
                      class="rendered-formcontrol-block"
                      :style="{ padding: `${editingBlockDraft.styles?.paddingY || 40}px 20px` }"
                    >
                      <div class="section-title-wrap" :style="{ textAlign: editingBlockDraft.styles?.align || 'center' }">
                        <span v-if="editingBlockDraft.badge" class="badge-mini-caps">{{ editingBlockDraft.badge }}</span>
                        <h2 class="sec-headline">{{ editingBlockDraft.title }}</h2>
                        <div v-if="editingBlockDraft.styles?.richContent" v-html="editingBlockDraft.styles.richContent" class="sec-lead"></div>
                        <p v-else-if="editingBlockDraft.subtitle" class="sec-lead">{{ editingBlockDraft.subtitle }}</p>
                      </div>

                      <div class="form-card-container">
                        <form class="form-fields-stack" @submit.prevent>
                          <div v-for="item in editingBlockDraft.items" :key="item.id" class="form-field-group">
                            <label class="form-field-label">{{ item.title }}</label>
                            <select v-if="item.tag === 'select'" class="form-rendered-select">
                              <option>Pilihan 1: Solusi Cloud & Docker</option>
                              <option>Pilihan 2: Visual Studio CMS</option>
                              <option>Pilihan 3: Domain & Edge SSL</option>
                            </select>
                            <textarea
                              v-else-if="item.tag === 'textarea'"
                              rows="3"
                              class="form-rendered-textarea"
                              :placeholder="item.label || item.desc"
                            ></textarea>
                            <input
                              v-else
                              :type="item.tag || 'text'"
                              class="form-rendered-input"
                              :placeholder="item.label || item.desc"
                            />
                          </div>
                          <button
                            class="btn-form-submit"
                            type="button"
                            :style="{ backgroundColor: editingBlockDraft.styles?.accentColor || activeContainer.accentColor }"
                          >
                            {{ editingBlockDraft.buttonText || 'Kirim Pesan Sekarang' }}
                          </button>
                        </form>
                      </div>
                    </section>

                    <!-- 10. MODAL PREVIEW -->
                    <section
                      v-else-if="editingBlockDraft.type === 'modal'"
                      class="rendered-modal-block"
                      :style="{ padding: `${editingBlockDraft.styles?.paddingY || 36}px 20px` }"
                    >
                      <div class="modal-preview-stage">
                        <div class="modal-stage-header">
                          <span class="modal-stage-badge">{{ editingBlockDraft.badge || 'POPUP PROMOSI' }}</span>
                          <button class="modal-stage-close" type="button" @click="toggleBlockOpen(editingBlockDraft)">
                            <X :size="14" />
                          </button>
                        </div>
                        <div class="modal-stage-body">
                          <h3 class="modal-stage-title">{{ editingBlockDraft.title }}</h3>
                          <div v-if="editingBlockDraft.styles?.richContent" v-html="editingBlockDraft.styles.richContent" class="modal-stage-desc"></div>
                          <p v-else class="modal-stage-desc">{{ editingBlockDraft.subtitle }}</p>
                          <div class="modal-stage-actions">
                            <button class="btn-modal-secondary" type="button">
                              {{ editingBlockDraft.secondaryButtonText || 'Nanti Saja' }}
                            </button>
                            <button
                              class="btn-modal-primary"
                              type="button"
                              :style="{ backgroundColor: editingBlockDraft.styles?.accentColor || activeContainer.accentColor }"
                            >
                              {{ editingBlockDraft.buttonText || 'Klaim Sekarang' }}
                            </button>
                          </div>
                        </div>
                      </div>
                    </section>

                    <!-- 11. DROPDOWN PREVIEW (1-to-1 with canvas card & select) -->
                    <section
                      v-else-if="editingBlockDraft.type === 'dropdown'"
                      class="rendered-dropdown-block"
                      :style="{ padding: `${editingBlockDraft.styles?.paddingY || 36}px 20px` }"
                    >
                      <div class="dropdown-component-card">
                        <div class="section-title-wrap" style="margin-bottom: 12px; text-align: left;">
                          <span v-if="editingBlockDraft.badge" class="badge-mini-caps">{{ editingBlockDraft.badge }}</span>
                          <h3 class="sec-headline" style="font-size: 1.1rem;">{{ editingBlockDraft.title }}</h3>
                          <div v-if="editingBlockDraft.styles?.richContent" v-html="editingBlockDraft.styles.richContent" style="font-size: 0.85rem; color: #64748b; margin-top: 4px;"></div>
                          <p v-else-if="editingBlockDraft.subtitle" style="font-size: 0.85rem; color: #64748b; margin-top: 4px;">{{ editingBlockDraft.subtitle }}</p>
                        </div>
                        <button class="dropdown-trigger-btn" type="button" @click="toggleBlockOpen(editingBlockDraft)">
                          <span>{{ editingBlockDraft.items?.[editingBlockDraft.activeItemIndex || 0]?.title || 'Pilih Kategori...' }}</span>
                          <ChevronDown :size="16" />
                        </button>
                        <div v-if="editingBlockDraft.isOpen" class="dropdown-options-list">
                          <div
                            v-for="(item, dIdx) in editingBlockDraft.items"
                            :key="item.id"
                            class="dropdown-option-row"
                            :class="{ 'is-selected': (editingBlockDraft.activeItemIndex || 0) === dIdx }"
                            @click="selectDropdownOption(editingBlockDraft, dIdx)"
                          >
                            <span>{{ item.title }}</span>
                            <span v-if="item.desc" style="font-size: 0.72rem; color: #94a3b8;">{{ item.desc }}</span>
                          </div>
                        </div>
                      </div>
                    </section>

                    <!-- 12. CARD SHOWCASE PREVIEW -->
                    <section
                      v-else-if="editingBlockDraft.type === 'card'"
                      class="rendered-card-block"
                      :style="{ padding: `${editingBlockDraft.styles?.paddingY || 40}px 20px` }"
                    >
                      <div class="section-title-wrap" :style="{ textAlign: editingBlockDraft.styles?.align || 'center' }">
                        <span v-if="editingBlockDraft.badge" class="badge-mini-caps">{{ editingBlockDraft.badge }}</span>
                        <h2 class="sec-headline">{{ editingBlockDraft.title }}</h2>
                        <div v-if="editingBlockDraft.styles?.richContent" v-html="editingBlockDraft.styles.richContent" class="sec-lead"></div>
                        <p v-else-if="editingBlockDraft.subtitle" class="sec-lead">{{ editingBlockDraft.subtitle }}</p>
                      </div>

                      <div class="cards-showcase-grid">
                        <div
                          v-for="item in editingBlockDraft.items"
                          :key="item.id"
                          class="showcase-grid-card"
                        >
                          <div class="card-header-banner">
                            <span v-if="item.tag" class="card-tag-pill">{{ item.tag }}</span>
                          </div>
                          <div class="card-body-content">
                            <h3 class="card-grid-title">{{ item.title }}</h3>
                            <p class="card-grid-desc">{{ item.desc }}</p>
                            <span v-if="item.role" class="card-role-label">Peran: {{ item.role }}</span>
                          </div>
                        </div>
                      </div>
                    </section>

                    <!-- 13. LIST GROUP PREVIEW -->
                    <section
                      v-else-if="editingBlockDraft.type === 'listgroup'"
                      class="rendered-listgroup-block"
                      :style="{ padding: `${editingBlockDraft.styles?.paddingY || 36}px 20px` }"
                    >
                      <div class="section-title-wrap" :style="{ textAlign: editingBlockDraft.styles?.align || 'left' }">
                        <span v-if="editingBlockDraft.badge" class="badge-mini-caps">{{ editingBlockDraft.badge }}</span>
                        <h2 class="sec-headline">{{ editingBlockDraft.title }}</h2>
                        <div v-if="editingBlockDraft.styles?.richContent" v-html="editingBlockDraft.styles.richContent" class="sec-lead"></div>
                        <p v-else-if="editingBlockDraft.subtitle" class="sec-lead">{{ editingBlockDraft.subtitle }}</p>
                      </div>

                      <div class="listgroup-stack-card">
                        <div
                          v-for="item in editingBlockDraft.items"
                          :key="item.id"
                          class="listgroup-item-row"
                        >
                          <span class="lg-check-icon"><Check :size="14" /></span>
                          <div class="lg-text-meta">
                            <span class="lg-item-title">{{ item.title }}</span>
                            <span v-if="item.desc" class="lg-item-desc">{{ item.desc }}</span>
                          </div>
                          <span v-if="item.tag" class="lg-badge-tag">{{ item.tag }}</span>
                        </div>
                      </div>
                    </section>

                    <!-- 14. STATS PREVIEW -->
                    <section
                      v-else-if="editingBlockDraft.type === 'stats'"
                      class="rendered-stats-block"
                      :style="{ padding: `${editingBlockDraft.styles?.paddingY || 36}px 20px` }"
                    >
                      <div class="section-title-wrap" :style="{ textAlign: editingBlockDraft.styles?.align || 'center' }">
                        <span v-if="editingBlockDraft.badge" class="badge-mini-caps">{{ editingBlockDraft.badge }}</span>
                        <h2 class="sec-headline">{{ editingBlockDraft.title }}</h2>
                        <div v-if="editingBlockDraft.styles?.richContent" v-html="editingBlockDraft.styles.richContent" class="sec-lead"></div>
                        <p v-else-if="editingBlockDraft.subtitle" class="sec-lead">{{ editingBlockDraft.subtitle }}</p>
                      </div>

                      <div class="stats-counters-row">
                        <div
                          v-for="item in editingBlockDraft.items"
                          :key="item.id"
                          class="stat-counter-box"
                        >
                          <span class="stat-number-val">{{ item.title }}</span>
                          <span class="stat-number-desc">{{ item.desc }}</span>
                        </div>
                      </div>
                    </section>

                    <!-- 15. PAGINATION PREVIEW -->
                    <section
                      v-else-if="editingBlockDraft.type === 'pagination'"
                      class="rendered-pagination-block"
                      :style="{ padding: `${editingBlockDraft.styles?.paddingY || 24}px 20px` }"
                    >
                      <div v-if="editingBlockDraft.subtitle" style="text-align: center; font-size: 0.8rem; color: #64748b; margin-bottom: 8px;">
                        {{ editingBlockDraft.subtitle }}
                      </div>
                      <div class="pagination-controls-row">
                        <button class="pagination-btn" type="button" title="Sebelumnya">&laquo;</button>
                        <button
                          v-for="(item, pIdx) in editingBlockDraft.items"
                          :key="item.id"
                          type="button"
                          class="pagination-btn"
                          :class="{ 'is-active': (editingBlockDraft.activeItemIndex || 0) === pIdx }"
                          @click="setPageNumber(editingBlockDraft, pIdx)"
                        >
                          {{ item.title }}
                        </button>
                        <button class="pagination-btn" type="button" title="Berikutnya">&raquo;</button>
                      </div>
                    </section>

                    <!-- 16. BREADCRUMB PREVIEW -->
                    <nav
                      v-else-if="editingBlockDraft.type === 'breadcrumb'"
                      class="rendered-breadcrumb-block"
                      :style="{ padding: `${editingBlockDraft.styles?.paddingY || 16}px 20px` }"
                    >
                      <div class="breadcrumb-trail-nav">
                        <template v-for="(item, bIdx) in editingBlockDraft.items" :key="item.id">
                          <span v-if="bIdx > 0" class="bc-sep-icon">/</span>
                          <a
                            v-if="bIdx < (editingBlockDraft.items?.length || 1) - 1"
                            :href="item.url || '#'"
                            class="bc-item-anchor"
                            @click.prevent
                          >
                            {{ item.title }}
                          </a>
                          <span v-else class="bc-item-current">{{ item.title }}</span>
                        </template>
                      </div>
                    </nav>

                    <!-- 17. FOOTER PREVIEW -->
                    <footer
                      v-else-if="editingBlockDraft.type === 'footer'"
                      class="rendered-footer-block"
                      :style="{ padding: `${editingBlockDraft.styles?.paddingY || 24}px 20px` }"
                    >
                      <div class="footer-divider-line"></div>
                      <div class="footer-content-row">
                        <div class="footer-brand">
                          <span class="brand-cube-icon" :style="{ color: editingBlockDraft.styles?.accentColor || activeContainer.accentColor }">◆</span>
                          <strong>{{ editingBlockDraft.title }}</strong>
                        </div>
                        <p class="footer-copy">{{ editingBlockDraft.subtitle }}</p>
                      </div>
                    </footer>

                    <!-- 18. FALLBACK PREVIEW -->
                    <section v-else style="padding: 24px 20px; text-align: center;">
                      <span v-if="editingBlockDraft.badge" class="badge-mini-caps">{{ editingBlockDraft.badge }}</span>
                      <h2 class="sec-headline">{{ editingBlockDraft.title }}</h2>
                      <div v-if="editingBlockDraft.styles?.richContent" v-html="editingBlockDraft.styles.richContent" class="sec-lead"></div>
                      <p v-else-if="editingBlockDraft.subtitle" class="sec-lead">{{ editingBlockDraft.subtitle }}</p>
                      <button
                        v-if="editingBlockDraft.buttonText"
                        type="button"
                        class="btn-primary-glow"
                        :style="{ backgroundColor: editingBlockDraft.styles?.accentColor || activeContainer.accentColor }"
                      >
                        {{ editingBlockDraft.buttonText }}
                      </button>
                    </section>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="rich-modal-footer">
            <div class="rich-footer-hint">
              <span>Tips: Tekan <kbd style="background: #f1f5f9; border: 1px solid #cbd5e1; padding: 2px 5px; border-radius: 4px; font-size: 0.7rem; color: #334155;">ESC</kbd> untuk menutup. Perubahan otomatis diselaraskan secara realtime.</span>
            </div>
            <div style="display: flex; align-items: center; gap: 10px;">
              <button type="button" class="btn-outline-action" @click="closeRichModalEditor">
                Batal
              </button>
              <button type="button" class="btn-primary-gradient" @click="applyRichModalEditor" style="display: inline-flex; align-items: center; gap: 6px;">
                <Check :size="14" /> Terapkan ke Kanvas
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- =================================================================== -->
      <!-- Interactive Lucide Icon Picker Modal Dialog                         -->
      <!-- =================================================================== -->
      <div v-if="isIconPickerOpen" class="icon-picker-backdrop" @click.self="closeIconPicker">
        <div class="icon-picker-modal">
          <div class="icon-picker-header">
            <div style="display: flex; align-items: center; gap: 8px;">
              <Sparkles :size="16" color="#2563eb" />
              <span class="icon-picker-title">Pilih Icon Item</span>
            </div>
            <button type="button" class="btn-close-rich-modal" @click="closeIconPicker" style="width: 28px; height: 28px;">
              <X :size="14" />
            </button>
          </div>

          <div class="icon-picker-search-bar">
            <Search :size="14" style="position: absolute; left: 28px; top: 20px; color: #94a3b8;" />
            <input
              type="text"
              v-model="iconPickerSearchQuery"
              class="icon-picker-search-input"
              placeholder="Cari icon (server, cloud, shield, zap, lock)..."
            />
          </div>

          <div style="display: flex; gap: 6px; padding: 4px 18px 10px; overflow-x: auto; flex-shrink: 0;">
            <button
              v-for="cat in (['Semua', 'Tech & Cloud', 'Keamanan & Sistem', 'Performa & Bisnis', 'Desain & UI'] as const)"
              :key="cat"
              type="button"
              class="btn-segmented-tab"
              :class="{ active: selectedIconCategory === cat }"
              @click="selectedIconCategory = cat"
              style="padding: 3px 10px; font-size: 11px; white-space: nowrap;"
            >
              {{ cat }}
            </button>
          </div>

          <div class="icon-picker-body">
            <div class="icon-picker-grid">
              <button
                v-for="opt in filteredIconOptions"
                :key="opt.id"
                type="button"
                class="icon-picker-tile"
                :class="{ 'is-selected': activeIconPickerSubIdx !== null && editingBlockDraft?.items?.[activeIconPickerSubIdx]?.icon === opt.icon }"
                @click="selectIconForItem(opt.icon)"
              >
                <component :is="getIconComponent(opt.icon)" :size="20" />
                <span class="icon-tile-name">{{ opt.name }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
