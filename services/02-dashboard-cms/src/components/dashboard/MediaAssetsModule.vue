<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import {
  UploadCloud,
  Search,
  Copy,
  Check,
  Layers,
  Zap,
  Globe,
  Database,
  FileText,
  FileSpreadsheet,
  FileCode,
  Download,
  Eye,
  X,
  File,
  Trash2,
  Loader2,
  ExternalLink,
  ShieldCheck,
  HardDrive,
  Calendar,
  ArrowUpDown,
  ChevronDown,
  LayoutGrid,
  List,
  Sparkles,
  Server,
  Folder,
  Image as ImageIcon,
  CheckSquare,
  Square,
  Plus,
  Code
} from 'lucide-vue-next';
import { useDashboardData } from '../../composables/useDashboardData';
import type { MediaAssetItem } from '../../types/dashboard';

const isImage = (type?: string) => {
  if (!type) return false;
  return ['JPG', 'JPEG', 'PNG', 'WEBP', 'GIF', 'AVIF'].includes(type.toUpperCase());
};

const isVisualAsset = (type?: string) => {
  if (!type) return false;
  return isImage(type) || type.toUpperCase() === 'SVG';
};

const copyEmbedCode = (format: 'markdown' | 'html', item: MediaAssetItem) => {
  let snippet = '';
  if (format === 'markdown') {
    snippet = `![${item.name}](${item.url})`;
  } else {
    snippet = `<img src="${item.url}" alt="${item.name}" loading="lazy" />`;
  }
  copyToClipboard(snippet, item.id + '_' + format);
};

const {
  mediaAssets,
  mediaBucketName,
  mediaStorage,
  isUploadingMedia,
  uploadMediaFiles,
  deleteMedia,
  copyToClipboard,
  copiedSubdomain,
  showToast
} = useDashboardData();

const assetFilter = ref<'all' | 'image' | 'vector' | 'pdf' | 'excel' | 'doc'>('all');
const sortBy = ref<'newest' | 'oldest' | 'name' | 'size'>('newest');
const viewMode = ref<'grid' | 'list'>('grid');
const isSortDropdownOpen = ref(false);
const sortOptions = [
  { value: 'newest', label: 'Terbaru' },
  { value: 'oldest', label: 'Terlama' },
  { value: 'name', label: 'Nama (A-Z)' },
  { value: 'size', label: 'Ukuran Terbesar' }
] as const;

const mediaSearch = ref('');
const isDragging = ref(false);
const failedImageIds = ref<Set<string>>(new Set());
const fileInputRef = ref<HTMLInputElement | null>(null);
const searchInputRef = ref<HTMLInputElement | null>(null);

// Batch Multi-Selection State
const selectedAssetIds = ref<Set<string>>(new Set());

let dragCounter = 0;

const handleGlobalKeydown = (e: KeyboardEvent) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    searchInputRef.value?.focus();
  }
};

const handleSortDropdownOutsideClick = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (!target.closest('.custom-filter-dropdown-wrap')) {
    isSortDropdownOpen.value = false;
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleGlobalKeydown);
  document.addEventListener('click', handleSortDropdownOutsideClick);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown);
  document.removeEventListener('click', handleSortDropdownOutsideClick);
});

// Category Storage Telemetry Breakdown
const storageCategoryStats = computed(() => {
  let imagesBytes = 0;
  let docsBytes = 0;
  let vectorBytes = 0;

  for (const item of mediaAssets.value) {
    const bytes = typeof item.sizeBytes === 'number' ? item.sizeBytes : 0;
    const type = item.type.toUpperCase();
    if (['JPG', 'JPEG', 'PNG', 'WEBP', 'GIF', 'AVIF'].includes(type)) {
      imagesBytes += bytes;
    } else if (type === 'SVG') {
      vectorBytes += bytes;
    } else {
      docsBytes += bytes;
    }
  }

  const maxBytes = 2147483648; // 2.0 GB
  const imgPct = Math.max((imagesBytes / maxBytes) * 100, 0.4);
  const docPct = docsBytes > 0 ? Math.max((docsBytes / maxBytes) * 100, 0.3) : 0;
  const vecPct = vectorBytes > 0 ? Math.max((vectorBytes / maxBytes) * 100, 0.3) : 0;

  const formatFn = (b: number) => {
    if (b <= 0) return '0 KB';
    if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
    return `${(b / (1024 * 1024)).toFixed(1)} MB`;
  };

  return {
    imagesFormatted: formatFn(imagesBytes),
    imagesPct: `${imgPct.toFixed(1)}%`,
    docsFormatted: formatFn(docsBytes),
    docsPct: `${docPct.toFixed(1)}%`,
    vectorFormatted: formatFn(vectorBytes),
    vectorPct: `${vecPct.toFixed(1)}%`
  };
});

// Folder category asset count
const categoryCounts = computed(() => {
  const counts = {
    all: mediaAssets.value.length,
    image: 0,
    pdf: 0,
    excel: 0,
    doc: 0,
    vector: 0
  };
  for (const item of mediaAssets.value) {
    const t = item.type.toUpperCase();
    if (['JPG', 'JPEG', 'PNG', 'WEBP', 'GIF', 'AVIF'].includes(t)) {
      counts.image++;
    } else if (t === 'PDF') {
      counts.pdf++;
    } else if (['XLSX', 'XLS', 'CSV'].includes(t)) {
      counts.excel++;
    } else if (['DOCX', 'DOC', 'TXT'].includes(t)) {
      counts.doc++;
    } else if (t === 'SVG') {
      counts.vector++;
    }
  }
  return counts;
});

// Document preview modal state
const isPreviewModalOpen = ref(false);
const showPdfPreview = ref(false);
const selectedMediaForPreview = ref<MediaAssetItem | null>(null);

const handleImageError = (id: string) => {
  failedImageIds.value.add(id);
};

const filteredMedia = computed(() => {
  const filtered = mediaAssets.value.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(mediaSearch.value.toLowerCase()) ||
                          item.type.toLowerCase().includes(mediaSearch.value.toLowerCase());
    if (!matchesSearch) return false;
    if (assetFilter.value === 'all') return true;
    if (assetFilter.value === 'image') return ['WEBP', 'JPG', 'JPEG', 'PNG', 'AVIF', 'GIF'].includes(item.type);
    if (assetFilter.value === 'vector') return item.type === 'SVG';
    if (assetFilter.value === 'pdf') return item.type === 'PDF';
    if (assetFilter.value === 'excel') return ['XLSX', 'XLS', 'CSV'].includes(item.type);
    if (assetFilter.value === 'doc') return ['DOCX', 'DOC', 'TXT'].includes(item.type);
    return true;
  });

  return [...filtered].sort((a, b) => {
    if (sortBy.value === 'newest') return 0;
    if (sortBy.value === 'oldest') return -1;
    if (sortBy.value === 'name') return a.name.localeCompare(b.name);
    if (sortBy.value === 'size') {
      const sizeA = typeof a.sizeBytes === 'number' ? a.sizeBytes : 0;
      const sizeB = typeof b.sizeBytes === 'number' ? b.sizeBytes : 0;
      return sizeB - sizeA;
    }
    return 0;
  });
});

// Multi-Selection Methods
const isAssetSelected = (id: string) => selectedAssetIds.value.has(id);

const toggleSelectAsset = (id: string, e?: Event) => {
  if (e) e.stopPropagation();
  const next = new Set(selectedAssetIds.value);
  if (next.has(id)) {
    next.delete(id);
  } else {
    next.add(id);
  }
  selectedAssetIds.value = next;
};

const isAllSelected = computed(() => {
  if (filteredMedia.value.length === 0) return false;
  return filteredMedia.value.every(item => selectedAssetIds.value.has(item.id));
});

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedAssetIds.value = new Set();
  } else {
    selectedAssetIds.value = new Set(filteredMedia.value.map(item => item.id));
  }
};

const clearSelection = () => {
  selectedAssetIds.value = new Set();
};

const batchCopyUrls = () => {
  const urls = filteredMedia.value
    .filter(item => selectedAssetIds.value.has(item.id))
    .map(item => item.url)
    .join('\n');
  if (urls) {
    navigator.clipboard.writeText(urls);
    showToast(`${selectedAssetIds.value.size} URL CDN berhasil disalin ke clipboard!`, 'success');
  }
};

const batchDownload = async () => {
  const selectedItems = filteredMedia.value.filter(item => selectedAssetIds.value.has(item.id));
  showToast(`Mengunduh ${selectedItems.length} berkas...`, 'info');
  for (const item of selectedItems) {
    await downloadMediaFile(item);
  }
};

const batchDelete = () => {
  const count = selectedAssetIds.value.size;
  if (confirm(`Apakah Anda yakin ingin menghapus ${count} berkas terpilih dari S3 bucket?`)) {
    const selectedItems = filteredMedia.value.filter(item => selectedAssetIds.value.has(item.id));
    for (const item of selectedItems) {
      deleteMedia(item);
    }
    clearSelection();
    showToast(`${count} berkas berhasil dihapus dari S3 bucket.`, 'success');
  }
};

const triggerFileInput = () => {
  fileInputRef.value?.click();
};

const handleFileInputChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    uploadMediaFiles(target.files);
    target.value = '';
  }
};

const handleDragEnter = (e: DragEvent) => {
  e.preventDefault();
  dragCounter++;
  isDragging.value = true;
};

const handleDragLeave = (e: DragEvent) => {
  e.preventDefault();
  dragCounter--;
  if (dragCounter <= 0) {
    dragCounter = 0;
    isDragging.value = false;
  }
};

const handleDropUpload = (e: DragEvent) => {
  dragCounter = 0;
  isDragging.value = false;
  if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
    uploadMediaFiles(e.dataTransfer.files);
  }
};

const openPreviewModal = (item: MediaAssetItem) => {
  selectedMediaForPreview.value = item;
  showPdfPreview.value = false;
  isPreviewModalOpen.value = true;
};

const downloadMediaFile = async (item: MediaAssetItem) => {
  showToast(`Mengunduh berkas ${item.name}...`, 'info');
  try {
    const res = await fetch(item.url);
    if (!res.ok) throw new Error('Download failed');
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    const element = document.createElement('a');
    element.href = blobUrl;
    element.download = item.name;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    URL.revokeObjectURL(blobUrl);
    showToast(`Berkas ${item.name} berhasil diunduh!`, 'success');
  } catch {
    const element = document.createElement('a');
    element.setAttribute('href', item.url);
    element.setAttribute('download', item.name);
    element.setAttribute('target', '_blank');
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
};

const handleDeleteMedia = (item: MediaAssetItem) => {
  if (confirm(`Apakah Anda yakin ingin menghapus '${item.name}' dari S3 bucket?`)) {
    deleteMedia(item);
  }
};

const handleDeleteFromModal = (item: MediaAssetItem) => {
  if (confirm(`Apakah Anda yakin ingin menghapus '${item.name}' dari S3 bucket?`)) {
    deleteMedia(item);
    isPreviewModalOpen.value = false;
  }
};
</script>

<template>
  <section class="fade-in-section">
    <!-- Header -->
    <div class="page-intro-row">
      <div>
        <h1 class="page-title">Media Assets & Dokumen S3 MinIO</h1>
        <p class="page-desc">Pusat Digital Asset Management (DAM) terisolasi untuk foto, vektor, berkas PDF, spreadsheet Excel (.xlsx), dan dokumen Word (.docx) dengan CDN edge proxy Traefik v3.</p>
      </div>
      <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
        <div class="quota-quick-pills">
          <span class="pill-metric">Region: <strong>ID-JKT-1</strong></span>
          <span class="pill-metric-highlight">S3 Bucket: <strong>{{ mediaBucketName }}</strong></span>
        </div>
        <button type="button" class="btn-top-create" @click="triggerFileInput">
          <Plus :size="15" />
          <span>Unggah Berkas Baru</span>
        </button>
      </div>
    </div>

    <!-- Hidden Native File Input -->
    <input
      ref="fileInputRef"
      type="file"
      multiple
      accept="image/*,.pdf,.xlsx,.xls,.docx,.doc,.csv,.svg"
      style="display: none"
      @change="handleFileInputChange"
    />

    <!-- STUDIO DIGITAL ASSET MANAGEMENT (DAM) 2-COLUMN LAYOUT -->
    <div class="dam-studio-container">
      <!-- SIDEBAR RAIL (Kiri ~310px) -->
      <aside class="dam-sidebar-rail">
        <!-- 1. Storage Quota & Engine Widget -->
        <div class="dam-storage-widget">
          <div class="dam-storage-widget-top">
            <div class="dam-widget-title">
              <Database :size="16" style="color: #2563eb;" />
              <span>Kapasitas S3 Bucket</span>
            </div>
            <span class="dam-widget-badge">AES-256 TLS</span>
          </div>

          <div class="dam-storage-val-row">
            <div>
              <span class="dam-storage-num">{{ mediaStorage.usedStorage }}</span>
              <span class="dam-storage-denom"> / 2.00 GB</span>
            </div>
            <span class="dam-storage-pct">{{ mediaStorage.usagePercentage }}</span>
          </div>

          <!-- Multi-Segment Visual Progress Bar -->
          <div class="storage-meter-shell" :title="'Total terpakai: ' + mediaStorage.usedStorage">
            <div class="meter-fill-segment seg-images" :style="{ width: storageCategoryStats.imagesPct }" title="Foto & Raster"></div>
            <div class="meter-fill-segment seg-docs" :style="{ width: storageCategoryStats.docsPct }" title="Dokumen (PDF, XLSX, DOCX)"></div>
            <div class="meter-fill-segment seg-vector" :style="{ width: storageCategoryStats.vectorPct }" title="Vektor SVG"></div>
          </div>

          <!-- Breakdown List -->
          <div class="dam-storage-mini-legend">
            <div class="dam-legend-row">
              <span class="dam-legend-label">
                <span class="dam-legend-dot blue"></span>
                <span>Foto & Raster</span>
              </span>
              <span class="dam-legend-val">{{ storageCategoryStats.imagesFormatted }}</span>
            </div>
            <div class="dam-legend-row">
              <span class="dam-legend-label">
                <span class="dam-legend-dot emerald"></span>
                <span>Dokumen & Sheets</span>
              </span>
              <span class="dam-legend-val">{{ storageCategoryStats.docsFormatted }}</span>
            </div>
            <div class="dam-legend-row">
              <span class="dam-legend-label">
                <span class="dam-legend-dot purple"></span>
                <span>Vektor SVG</span>
              </span>
              <span class="dam-legend-val">{{ storageCategoryStats.vectorFormatted }}</span>
            </div>
            <div class="dam-legend-row">
              <span class="dam-legend-label">
                <span class="dam-legend-dot slate"></span>
                <span>Sisa Kuota Bebas</span>
              </span>
              <span class="dam-legend-val">{{ mediaStorage.freeStorage }}</span>
            </div>
          </div>
        </div>

        <!-- 2. Virtual Folder & Category Navigation -->
        <nav class="dam-folder-nav">
          <p class="dam-nav-section-title">Kategori & Folder</p>

          <button
            type="button"
            class="dam-folder-item"
            :class="{ active: assetFilter === 'all' }"
            @click="assetFilter = 'all'"
          >
            <span class="dam-folder-leading">
              <Folder :size="15" />
              <span>Semua Berkas</span>
            </span>
            <span class="dam-folder-badge">{{ categoryCounts.all }}</span>
          </button>

          <button
            type="button"
            class="dam-folder-item"
            :class="{ active: assetFilter === 'image' }"
            @click="assetFilter = 'image'"
          >
            <span class="dam-folder-leading">
              <ImageIcon :size="15" style="color: #2563eb;" />
              <span>Foto & Raster</span>
            </span>
            <span class="dam-folder-badge">{{ categoryCounts.image }}</span>
          </button>

          <button
            type="button"
            class="dam-folder-item"
            :class="{ active: assetFilter === 'pdf' }"
            @click="assetFilter = 'pdf'"
          >
            <span class="dam-folder-leading">
              <FileText :size="15" style="color: #dc2626;" />
              <span>Dokumen PDF</span>
            </span>
            <span class="dam-folder-badge">{{ categoryCounts.pdf }}</span>
          </button>

          <button
            type="button"
            class="dam-folder-item"
            :class="{ active: assetFilter === 'excel' }"
            @click="assetFilter = 'excel'"
          >
            <span class="dam-folder-leading">
              <FileSpreadsheet :size="15" style="color: #059669;" />
              <span>Excel Spreadsheet</span>
            </span>
            <span class="dam-folder-badge">{{ categoryCounts.excel }}</span>
          </button>

          <button
            type="button"
            class="dam-folder-item"
            :class="{ active: assetFilter === 'doc' }"
            @click="assetFilter = 'doc'"
          >
            <span class="dam-folder-leading">
              <File :size="15" style="color: #4f46e5;" />
              <span>Word Documents</span>
            </span>
            <span class="dam-folder-badge">{{ categoryCounts.doc }}</span>
          </button>

          <button
            type="button"
            class="dam-folder-item"
            :class="{ active: assetFilter === 'vector' }"
            @click="assetFilter = 'vector'"
          >
            <span class="dam-folder-leading">
              <FileCode :size="15" style="color: #9333ea;" />
              <span>Vektor SVG</span>
            </span>
            <span class="dam-folder-badge">{{ categoryCounts.vector }}</span>
          </button>
        </nav>

        <!-- 3. Compact Drag & Drop Ingestion Widget -->
        <div
          class="dam-compact-uploader"
          :class="{ dragging: isDragging }"
          @dragenter="handleDragEnter"
          @dragover.prevent="isDragging = true"
          @dragleave="handleDragLeave"
          @drop.prevent="handleDropUpload"
          @click="triggerFileInput"
        >
          <div v-if="isUploadingMedia">
            <Loader2 :size="24" class="spin-animation" style="color: #2563eb; margin-bottom: 6px;" />
            <h4>Mengunggah ke S3...</h4>
            <p>Memproses objek media terenkripsi.</p>
          </div>
          <div v-else>
            <div class="dam-compact-uploader-icon">
              <UploadCloud :size="20" />
            </div>
            <h4>Unggah Cepat</h4>
            <p>Tarik file ke sini (Maks. 50MB)</p>
            <button type="button" class="btn-dam-browse" @click.stop="triggerFileInput">
              <Sparkles :size="12" />
              <span>Pilih Berkas</span>
            </button>
          </div>
        </div>
      </aside>

      <!-- MAIN STAGE (Kanan Fleksibel) -->
      <main class="dam-main-stage">
        <!-- Top Metrics Strip (4 Mini Inline Cards) -->
        <div class="dam-mini-stats-strip">
          <div class="dam-mini-stat-card">
            <div class="dam-mini-stat-info">
              <span class="dam-mini-stat-label">Total Objek Berkas</span>
              <div class="dam-mini-stat-val">
                <span>{{ mediaAssets.length }} File</span>
              </div>
            </div>
            <div class="dam-mini-stat-glyph blue">
              <Layers :size="16" />
            </div>
          </div>

          <div class="dam-mini-stat-card">
            <div class="dam-mini-stat-info">
              <span class="dam-mini-stat-label">CDN Edge Hit Ratio</span>
              <div class="dam-mini-stat-val">
                <span>99.4%</span>
                <span class="badge-online" style="font-size: 10px;">Optimal</span>
              </div>
            </div>
            <div class="dam-mini-stat-glyph emerald">
              <Zap :size="16" />
            </div>
          </div>

          <div class="dam-mini-stat-card">
            <div class="dam-mini-stat-info">
              <span class="dam-mini-stat-label">Serving Latency</span>
              <div class="dam-mini-stat-val">
                <span>1.2ms TTFB</span>
              </div>
            </div>
            <div class="dam-mini-stat-glyph purple">
              <Globe :size="16" />
            </div>
          </div>

          <div class="dam-mini-stat-card">
            <div class="dam-mini-stat-info">
              <span class="dam-mini-stat-label">Dedicated S3 Storage</span>
              <div class="dam-mini-stat-val" style="font-size: 13px; font-family: ui-monospace, monospace; color: #2563eb;">
                <span>MinIO Isolated</span>
              </div>
            </div>
            <div class="dam-mini-stat-glyph slate">
              <Server :size="16" />
            </div>
          </div>
        </div>

        <!-- Floating Batch Action Bar (Ketika ada berkas yang dipilih) -->
        <div v-if="selectedAssetIds.size > 0" class="dam-batch-bar">
          <div class="batch-selection-tag">
            <CheckSquare :size="16" style="color: #38bdf8;" />
            <span>{{ selectedAssetIds.size }} dari {{ filteredMedia.length }} berkas dipilih</span>
          </div>

          <div class="batch-action-buttons">
            <button type="button" class="btn-batch-action" @click="batchCopyUrls" title="Salin semua URL CDN terpilih">
              <Copy :size="13" />
              <span>Salin Semua URL</span>
            </button>
            <button type="button" class="btn-batch-action" @click="batchDownload" title="Unduh semua berkas terpilih">
              <Download :size="13" />
              <span>Unduh Terpilih</span>
            </button>
            <button type="button" class="btn-batch-action danger" @click="batchDelete" title="Hapus berkas terpilih dari S3">
              <Trash2 :size="13" />
              <span>Hapus ({{ selectedAssetIds.size }})</span>
            </button>
            <button type="button" class="btn-batch-action" @click="clearSelection" style="background: transparent; border-color: rgba(255,255,255,0.3);">
              Batal
            </button>
          </div>
        </div>

        <!-- Filter & Search Toolbar -->
        <div class="filter-toolbar" style="margin-bottom: 0;">
          <div class="search-command-shell">
            <Search :size="15" class="search-lead-glyph" />
            <input
              ref="searchInputRef"
              v-model="mediaSearch"
              type="text"
              placeholder="Cari berkas gambar, dokumen PDF, spreadsheet Excel... (⌘K)"
              class="search-command-input"
            />
            <button v-if="mediaSearch" class="btn-clear-search" @click="mediaSearch = ''" title="Bersihkan">
              <X :size="13" />
            </button>
            <kbd class="shortcut-tag">⌘K</kbd>
          </div>

          <div class="filter-controls-group">
            <!-- Select All Checkbox Button -->
            <button
              type="button"
              class="segment-pill"
              :class="{ active: isAllSelected }"
              @click="toggleSelectAll"
              title="Pilih atau Batalkan Semua Berkas"
              style="display: inline-flex; align-items: center; gap: 6px;"
            >
              <CheckSquare v-if="isAllSelected" :size="13" style="color: #2563eb;" />
              <Square v-else :size="13" />
              <span>{{ isAllSelected ? 'Batalkan Pilihan' : 'Pilih Semua' }}</span>
            </button>

            <!-- Custom Sort Dropdown -->
            <div class="custom-filter-dropdown-wrap">
              <button
                type="button"
                class="custom-filter-trigger-btn"
                @click.stop="isSortDropdownOpen = !isSortDropdownOpen"
                title="Urutkan Berkas"
              >
                <ArrowUpDown :size="13" style="color: #64748b;" />
                <span>{{ sortOptions.find(o => o.value === sortBy)?.label || 'Terbaru' }}</span>
                <ChevronDown :size="13" class="filter-chevron" :class="{ 'rotate-180': isSortDropdownOpen }" />
              </button>
              <div v-if="isSortDropdownOpen" class="custom-filter-dropdown-menu">
                <button
                  v-for="opt in sortOptions"
                  :key="opt.value"
                  type="button"
                  class="custom-filter-dropdown-item"
                  :class="{ active: sortBy === opt.value }"
                  @click="sortBy = opt.value; isSortDropdownOpen = false"
                >
                  <span>{{ opt.label }}</span>
                  <Check v-if="sortBy === opt.value" :size="13" class="dropdown-check-icon" />
                </button>
              </div>
            </div>

            <!-- View Mode Switcher (Grid vs List) -->
            <div class="view-mode-toggle-group">
              <button
                type="button"
                class="view-mode-btn"
                :class="{ active: viewMode === 'grid' }"
                @click="viewMode = 'grid'"
                title="Tampilan Galeri Kartu"
              >
                <LayoutGrid :size="15" />
              </button>
              <button
                type="button"
                class="view-mode-btn"
                :class="{ active: viewMode === 'list' }"
                @click="viewMode = 'list'"
                title="Tampilan Tabel Berkas"
              >
                <List :size="15" />
              </button>
            </div>
          </div>
        </div>

        <!-- SCROLLABLE DEDICATED MEDIA STAGE PANEL (BOXED VIEWPORT) -->
        <div class="dam-content-scroll-box">
          <!-- 1. GRID VIEW MODE: CINEMATIC MEDIA CARDS -->
          <div v-if="viewMode === 'grid'" class="media-gallery-grid">
          <div
            v-for="med in filteredMedia"
            :key="med.id"
            class="media-pro-card"
            :class="{ 'is-selected': isAssetSelected(med.id) }"
            @click="openPreviewModal(med)"
          >
            <!-- Card Visual Preview Area -->
            <div
              class="media-preview-canvas"
              :class="[
                'art-type-' + med.type.toLowerCase(),
                { 'checkerboard-bg': isImage(med.type) || med.type === 'SVG' }
              ]"
            >
              <!-- Multi-Select Checkbox -->
              <div
                class="media-card-checkbox"
                :class="{ selected: isAssetSelected(med.id) }"
                @click.stop="toggleSelectAsset(med.id, $event)"
                title="Pilih berkas untuk aksi massal"
              >
                <Check v-if="isAssetSelected(med.id)" :size="13" />
              </div>

              <!-- 1. PDF DOCUMENT PREVIEW CANVAS -->
              <div v-if="med.type === 'PDF'" class="graphic-pdf-preview">
                <div class="pdf-watermark-symbol">
                  <FileText :size="32" class="pdf-icon-hero" />
                </div>
                <div class="pdf-doc-sheet">
                  <div class="pdf-doc-bar-red"></div>
                  <div class="pdf-line long"></div>
                  <div class="pdf-line medium"></div>
                  <div class="pdf-line short"></div>
                  <div class="pdf-meta-pill">ADOBE PDF DOCUMENT</div>
                </div>
                <span class="media-type-badge badge-pdf">PDF</span>
              </div>

              <!-- 2. EXCEL SPREADSHEET PREVIEW CANVAS -->
              <div v-else-if="['XLSX', 'XLS', 'CSV'].includes(med.type)" class="graphic-excel-preview">
                <div class="excel-watermark-symbol">
                  <FileSpreadsheet :size="32" class="excel-icon-hero" />
                </div>
                <div class="excel-sheet-grid">
                  <div class="excel-formula-bar">
                    <span class="fx-label">fx</span>
                    <span class="fx-formula">=SUM(B2:B14) * 1.11</span>
                  </div>
                  <div class="excel-grid-rows">
                    <div class="excel-row"><span></span><span></span><span></span></div>
                    <div class="excel-row"><span></span><span></span><span></span></div>
                    <div class="excel-row"><span></span><span></span><span></span></div>
                  </div>
                </div>
                <span class="media-type-badge badge-excel">{{ med.type }}</span>
              </div>

              <!-- 3. WORD DOCUMENT PREVIEW CANVAS -->
              <div v-else-if="['DOCX', 'DOC'].includes(med.type)" class="graphic-doc-preview">
                <div class="doc-watermark-symbol">
                  <File :size="32" class="doc-icon-hero" />
                </div>
                <div class="word-doc-sheet">
                  <div class="word-header-line"></div>
                  <div class="word-para-line"></div>
                  <div class="word-para-line"></div>
                  <div class="word-para-line short"></div>
                  <span class="word-page-indicator">MS WORD DOCUMENT</span>
                </div>
                <span class="media-type-badge badge-docx">{{ med.type }}</span>
              </div>

              <!-- 4. REAL VISUAL ASSETS (JPG, PNG, WEBP, AVIF, SVG) -->
              <div v-else-if="isVisualAsset(med.type)" class="gallery-visual-wrapper">
                <img
                  v-if="!failedImageIds.has(med.id)"
                  :src="med.url"
                  :alt="med.name"
                  class="gallery-card-thumb"
                  :class="{ 'svg-vector-thumb': med.type === 'SVG' }"
                  loading="lazy"
                  @error="handleImageError(med.id)"
                />
                <div v-else class="gallery-card-thumb-fallback">
                  <Eye :size="24" style="color: #64748b; margin-bottom: 4px;" />
                  <span style="font-size: 11px; color: #94a3b8; font-weight: 600;">{{ med.type }} IMAGE</span>
                </div>
                <span class="media-type-badge" :class="med.type === 'SVG' ? 'badge-svg' : 'badge-img'">{{ med.type }}</span>
              </div>

              <!-- Fallback Generic Object -->
              <div v-else class="graphic-vector-preview">
                <div class="vector-mark-symbol">◆ {{ med.type }}</div>
                <span class="media-type-badge badge-svg">{{ med.type }}</span>
              </div>

              <!-- Glassmorphic Floating Action Dock (Card Hover) -->
              <div class="media-hover-overlay" @click.stop>
                <div class="glass-action-dock">
                  <button
                    class="dock-action-btn"
                    :class="{ success: copiedSubdomain === med.id }"
                    @click.stop="copyToClipboard(med.url, med.id)"
                    :title="copiedSubdomain === med.id ? 'Tersalin!' : 'Salin URL CDN Edge'"
                  >
                    <Check v-if="copiedSubdomain === med.id" :size="15" />
                    <Copy v-else :size="15" />
                  </button>
                  <button
                    class="dock-action-btn"
                    @click.stop="downloadMediaFile(med)"
                    title="Unduh Berkas Langsung"
                  >
                    <Download :size="15" />
                  </button>
                  <button
                    class="dock-action-btn"
                    @click.stop="openPreviewModal(med)"
                    title="Rincian & Pratinjau Lengkap"
                  >
                    <Eye :size="15" />
                  </button>
                  <button
                    class="dock-action-btn danger"
                    @click.stop="handleDeleteMedia(med)"
                    title="Hapus dari S3 Bucket"
                  >
                    <Trash2 :size="15" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Card Meta Details -->
            <div class="media-info-block">
              <div class="media-title-line" :title="med.name">
                {{ med.name }}
              </div>
              <div class="media-sub-meta">
                <div class="media-sub-left">
                  <span class="file-size-tag">{{ med.size }}</span>
                  <span class="dot-sep">•</span>
                  <span class="dimensions-tag">{{ med.dimensions }}</span>
                </div>
                <span class="edge-cached-tag">
                  <span class="pulse-green-dot"></span>
                  <span>CDN Ready</span>
                </span>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="filteredMedia.length === 0" class="empty-gallery-state">
            <UploadCloud :size="36" class="empty-icon" />
            <h4>Tidak ada berkas media ditemukan</h4>
            <p>Unggah berkas baru atau pilih kategori folder lain pada sidebar.</p>
            <button class="btn-primary-ghost" @click="triggerFileInput">
              <UploadCloud :size="14" style="margin-right: 6px;" />
              Pilih Berkas untuk Diunggah
            </button>
          </div>
        </div>

        <!-- 2. LIST VIEW MODE: HIGH-TECH LEDGER TABLE -->
        <div v-else class="media-list-container">
          <table class="media-ledger-table">
            <thead>
              <tr>
                <th style="width: 40px; text-align: center;">
                  <button type="button" @click="toggleSelectAll" style="background: none; border: none; cursor: pointer; color: #64748b; display: inline-flex; align-items: center;">
                    <CheckSquare v-if="isAllSelected" :size="15" style="color: #2563eb;" />
                    <Square v-else :size="15" />
                  </button>
                </th>
                <th>Berkas</th>
                <th>Tipe</th>
                <th>Ukuran</th>
                <th>Dimensi</th>
                <th>Status Edge</th>
                <th>Tanggal Unggah</th>
                <th style="text-align: right;">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="med in filteredMedia"
                :key="med.id"
                @click="openPreviewModal(med)"
                style="cursor: pointer;"
                :class="{ 'is-selected': isAssetSelected(med.id) }"
              >
                <td style="text-align: center;" @click.stop="toggleSelectAsset(med.id, $event)">
                  <button type="button" style="background: none; border: none; cursor: pointer; color: #64748b; display: inline-flex; align-items: center;">
                    <CheckSquare v-if="isAssetSelected(med.id)" :size="15" style="color: #2563eb;" />
                    <Square v-else :size="15" />
                  </button>
                </td>
                <td>
                  <div class="table-media-item-cell">
                    <div class="table-thumb-mini">
                      <img v-if="isImage(med.type)" :src="med.url" :alt="med.name" />
                      <FileText v-else-if="med.type === 'PDF'" :size="18" style="color: #dc2626;" />
                      <FileSpreadsheet v-else-if="['XLSX', 'XLS', 'CSV'].includes(med.type)" :size="18" style="color: #059669;" />
                      <File v-else-if="['DOCX', 'DOC'].includes(med.type)" :size="18" style="color: #4338ca;" />
                      <FileCode v-else :size="18" style="color: #9333ea;" />
                    </div>
                    <div class="table-media-name-meta">
                      <strong :title="med.name">{{ med.name }}</strong>
                      <span>s3://{{ med.bucketName || mediaBucketName }}/{{ med.name }}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span
                    class="format-pill"
                    :class="{
                      'pill-img': isImage(med.type),
                      'pill-pdf': med.type === 'PDF',
                      'pill-excel': ['XLSX', 'XLS', 'CSV'].includes(med.type),
                      'pill-doc': ['DOCX', 'DOC'].includes(med.type),
                      'pill-svg': med.type === 'SVG'
                    }"
                  >
                    {{ med.type }}
                  </span>
                </td>
                <td style="font-weight: 600; color: #0f172a;">{{ med.size }}</td>
                <td style="color: #64748b;">{{ med.dimensions }}</td>
                <td>
                  <span class="edge-cached-tag">
                    <span class="pulse-green-dot"></span>
                    <span>Traefik Edge (1.2ms)</span>
                  </span>
                </td>
                <td style="color: #64748b; font-size: 11.5px;">{{ med.uploadedAt }}</td>
                <td>
                  <div class="table-actions-strip" @click.stop>
                    <button
                      type="button"
                      class="btn-table-action"
                      @click.stop="copyToClipboard(med.url, med.id)"
                      :title="copiedSubdomain === med.id ? 'Tersalin!' : 'Salin URL CDN'"
                    >
                      <Check v-if="copiedSubdomain === med.id" :size="13" class="text-green" />
                      <Copy v-else :size="13" />
                    </button>
                    <button
                      type="button"
                      class="btn-table-action"
                      @click.stop="downloadMediaFile(med)"
                      title="Unduh Berkas"
                    >
                      <Download :size="13" />
                    </button>
                    <button
                      type="button"
                      class="btn-table-action"
                      @click.stop="openPreviewModal(med)"
                      title="Pratinjau Berkas"
                    >
                      <Eye :size="13" />
                    </button>
                    <button
                      type="button"
                      class="btn-table-action danger"
                      @click.stop="handleDeleteMedia(med)"
                      title="Hapus dari S3"
                    >
                      <Trash2 :size="13" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredMedia.length === 0">
                <td colspan="8" style="text-align: center; padding: 40px; color: #64748b;">
                  Tidak ada berkas media ditemukan.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>

    <!-- MODAL: BESPOKE STUDIO MEDIA INSPECTOR & TELEMETRY HUB -->
    <Teleport to="body">
      <div v-if="isPreviewModalOpen && selectedMediaForPreview" class="modal-backdrop" @click.self="isPreviewModalOpen = false">
        <div class="modal-dialog modal-dialog-media-studio">
          <!-- MODAL TOP BAR -->
          <div class="studio-modal-topbar">
            <div class="studio-modal-title-group">
              <div class="studio-modal-format-badge" :class="'type-' + selectedMediaForPreview.type.toLowerCase()">
                <FileSpreadsheet v-if="['XLSX', 'XLS', 'CSV'].includes(selectedMediaForPreview.type)" :size="16" />
                <FileText v-else-if="selectedMediaForPreview.type === 'PDF'" :size="16" />
                <File v-else-if="['DOCX', 'DOC', 'TXT'].includes(selectedMediaForPreview.type)" :size="16" />
                <FileCode v-else-if="selectedMediaForPreview.type === 'SVG'" :size="16" />
                <ImageIcon v-else :size="16" />
              </div>
              <div class="studio-modal-meta-text">
                <div class="studio-modal-name-row">
                  <h3 :title="selectedMediaForPreview.name">{{ selectedMediaForPreview.name }}</h3>
                  <span class="studio-format-pill">{{ selectedMediaForPreview.type }}</span>
                  <span class="studio-status-edge">
                    <span class="pulse-green-dot"></span>
                    <span>CDN Ready</span>
                  </span>
                </div>
                <p class="studio-modal-subtitle">MinIO Dedicated S3 • Traefik Edge Proxy • TLS 1.3 Strict</p>
              </div>
            </div>

            <!-- Header Quick Actions -->
            <div class="studio-modal-top-actions">
              <a
                :href="selectedMediaForPreview.url"
                target="_blank"
                rel="noopener noreferrer"
                class="btn-studio-header-action"
                title="Buka berkas di tab browser baru"
              >
                <ExternalLink :size="13" />
                <span>Buka Berkas</span>
              </a>
              <button
                type="button"
                class="btn-studio-header-action"
                @click="copyToClipboard(selectedMediaForPreview.url, selectedMediaForPreview.id + '_top')"
                :title="copiedSubdomain === selectedMediaForPreview.id + '_top' ? 'Tersalin!' : 'Salin URL CDN'"
              >
                <Check v-if="copiedSubdomain === selectedMediaForPreview.id + '_top'" :size="13" class="text-green" />
                <Copy v-else :size="13" />
                <span>{{ copiedSubdomain === selectedMediaForPreview.id + '_top' ? 'Tersalin' : 'Salin URL' }}</span>
              </button>
              <button
                type="button"
                class="modal-close-button"
                @click="isPreviewModalOpen = false"
                title="Tutup Modal"
              >
                <X :size="16" />
              </button>
            </div>
          </div>

          <!-- SPLIT STAGE & INSPECTOR BODY -->
          <div class="studio-inspector-split">
            <!-- 1. LEFT: MEDIA VIEWPORT STAGE -->
            <div class="studio-media-stage">
              <!-- Background / Canvas Layer -->
              <div class="stage-canvas-inner">
                <!-- If Image or SVG: Render crisp visual element -->
                <div v-if="isVisualAsset(selectedMediaForPreview.type)" class="stage-visual-container">
                  <img
                    v-if="!failedImageIds.has(selectedMediaForPreview.id)"
                    :src="selectedMediaForPreview.url"
                    :alt="selectedMediaForPreview.name"
                    class="stage-visual-img"
                    @error="handleImageError(selectedMediaForPreview.id)"
                  />
                  <div v-else class="stage-fallback-box">
                    <ImageIcon :size="40" style="color: #64748b;" />
                    <p>Pratinjau visual tidak dapat dimuat</p>
                  </div>
                </div>

                <!-- If PDF: Interactive Viewer or Adobe Doc Sheet -->
                <div v-else-if="selectedMediaForPreview.type === 'PDF'" class="stage-pdf-container">
                  <div v-if="showPdfPreview" class="stage-pdf-frame-shell">
                    <iframe :src="selectedMediaForPreview.url" class="stage-pdf-frame"></iframe>
                  </div>
                  <div v-else class="stage-doc-card doc-pdf">
                    <div class="stage-doc-art">
                      <FileText :size="48" style="color: #ef4444;" />
                    </div>
                    <h4>Dokumen Portable Document Format (PDF)</h4>
                    <p>{{ selectedMediaForPreview.dimensions }} • {{ selectedMediaForPreview.size }}</p>
                    <button type="button" class="btn-canvas-action" @click="showPdfPreview = true" style="margin-top: 10px;">
                      <Eye :size="13" />
                      <span>Buka Pratinjau Interaktif Lembar PDF</span>
                    </button>
                  </div>
                </div>

                <!-- If Spreadsheet (Excel / CSV) -->
                <div v-else-if="['XLSX', 'XLS', 'CSV'].includes(selectedMediaForPreview.type)" class="stage-doc-card doc-excel">
                  <div class="stage-doc-art">
                    <FileSpreadsheet :size="48" style="color: #10b981;" />
                  </div>
                  <h4>Spreadsheet Buku Kerja Excel ({{ selectedMediaForPreview.type }})</h4>
                  <p>{{ selectedMediaForPreview.size }} • Siap diunduh untuk kalkulasi angka</p>
                </div>

                <!-- If Document (DOCX / DOC / TXT) -->
                <div v-else class="stage-doc-card doc-word">
                  <div class="stage-doc-art">
                    <File :size="48" style="color: #3b82f6;" />
                  </div>
                  <h4>Dokumen Teks / Pengolah Kata ({{ selectedMediaForPreview.type }})</h4>
                  <p>{{ selectedMediaForPreview.size }} • Terisolasi di bucket MinIO</p>
                </div>
              </div>

              <!-- Stage Floating Bottom HUD Strip -->
              <div class="stage-bottom-hud">
                <div class="hud-left">
                  <span class="hud-pill">
                    <span class="hud-label">Dimensi:</span>
                    <strong>{{ selectedMediaForPreview.dimensions }}</strong>
                  </span>
                  <span class="hud-pill">
                    <span class="hud-label">Ukuran:</span>
                    <strong>{{ selectedMediaForPreview.size }}</strong>
                  </span>
                </div>
                <div class="hud-right">
                  <span class="hud-badge-s3">MinIO Protected</span>
                </div>
              </div>
            </div>

            <!-- 2. RIGHT: INSPECTOR & PROPERTIES RAIL -->
            <div class="studio-inspector-rail">
              <!-- Section A: Technical Specs Grid -->
              <div class="inspector-card-section">
                <div class="section-header-title">
                  <HardDrive :size="13" />
                  <span>Spesifikasi Berkas</span>
                </div>
                <div class="inspector-metrics-compact-grid">
                  <div class="compact-metric-tile">
                    <span class="tile-caption">Tipe Format</span>
                    <strong class="tile-value">{{ selectedMediaForPreview.type }} Object</strong>
                  </div>
                  <div class="compact-metric-tile">
                    <span class="tile-caption">Ukuran Berkas</span>
                    <strong class="tile-value">{{ selectedMediaForPreview.size }}</strong>
                  </div>
                  <div class="compact-metric-tile">
                    <span class="tile-caption">Dimensi Resolusi</span>
                    <strong class="tile-value">{{ selectedMediaForPreview.dimensions }}</strong>
                  </div>
                  <div class="compact-metric-tile">
                    <span class="tile-caption" style="display: flex; align-items: center; gap: 4px;">
                      <Calendar :size="10" />
                      <span>Diunggah Pada</span>
                    </span>
                    <strong class="tile-value">{{ selectedMediaForPreview.uploadedAt }}</strong>
                  </div>
                </div>
              </div>

              <!-- Section B: S3 Storage Location -->
              <div class="inspector-card-section">
                <div class="section-header-title">
                  <Database :size="13" />
                  <span>Penyimpanan S3 MinIO</span>
                </div>
                <div class="inspector-field-group">
                  <label class="inspector-field-label">Dedicated S3 Bucket</label>
                  <div class="bucket-display-pill">
                    <Database :size="12" style="color: #2563eb;" />
                    <code>{{ selectedMediaForPreview.bucketName || mediaBucketName }}</code>
                    <span class="bucket-isolated-tag">Multi-Tenant</span>
                  </div>
                </div>
                <div class="inspector-field-group" style="margin-top: 10px;">
                  <label class="inspector-field-label">S3 URI Berkas</label>
                  <div class="inspector-copy-input-row">
                    <span class="copy-input-text" :title="'s3://' + (selectedMediaForPreview.bucketName || mediaBucketName) + '/' + (selectedMediaForPreview.s3Key || selectedMediaForPreview.name)">
                      s3://{{ selectedMediaForPreview.bucketName || mediaBucketName }}/{{ selectedMediaForPreview.s3Key || selectedMediaForPreview.name }}
                    </span>
                    <button
                      type="button"
                      class="btn-inspector-copy"
                      @click="copyToClipboard('s3://' + (selectedMediaForPreview.bucketName || mediaBucketName) + '/' + (selectedMediaForPreview.s3Key || selectedMediaForPreview.name), selectedMediaForPreview.id + '_s3')"
                    >
                      <Check v-if="copiedSubdomain === selectedMediaForPreview.id + '_s3'" :size="12" class="text-green" />
                      <Copy v-else :size="12" />
                      <span>{{ copiedSubdomain === selectedMediaForPreview.id + '_s3' ? 'Tersalin' : 'Salin URI' }}</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Section C: CDN Public URL & Quick Embed Code -->
              <div class="inspector-card-section">
                <div class="section-header-title">
                  <Globe :size="13" />
                  <span>Tautan CDN & Kode Sematan</span>
                </div>
                <div class="inspector-field-group">
                  <label class="inspector-field-label">Edge Public CDN URL</label>
                  <div class="inspector-copy-input-row">
                    <span class="copy-input-text" :title="selectedMediaForPreview.url">
                      {{ selectedMediaForPreview.url }}
                    </span>
                    <button
                      type="button"
                      class="btn-inspector-copy"
                      @click="copyToClipboard(selectedMediaForPreview.url, selectedMediaForPreview.id + '_cdn')"
                    >
                      <Check v-if="copiedSubdomain === selectedMediaForPreview.id + '_cdn'" :size="12" class="text-green" />
                      <Copy v-else :size="12" />
                      <span>{{ copiedSubdomain === selectedMediaForPreview.id + '_cdn' ? 'Tersalin' : 'Salin URL' }}</span>
                    </button>
                  </div>
                </div>

                <!-- Quick Embed Snippets for Markdown & HTML -->
                <div class="inspector-field-group" style="margin-top: 10px;">
                  <label class="inspector-field-label">Salin Format Sematan Cepat (Untuk Artikel & CMS)</label>
                  <div class="embed-format-btn-group">
                    <button
                      type="button"
                      class="btn-embed-chip"
                      @click="copyEmbedCode('markdown', selectedMediaForPreview)"
                      :title="'Salin kode Markdown ![' + selectedMediaForPreview.name + '](' + selectedMediaForPreview.url + ')'"
                    >
                      <Check v-if="copiedSubdomain === selectedMediaForPreview.id + '_markdown'" :size="12" class="text-green" />
                      <Code v-else :size="12" />
                      <span>{{ copiedSubdomain === selectedMediaForPreview.id + '_markdown' ? 'Markdown Tersalin!' : 'Salin Markdown' }}</span>
                    </button>
                    <button
                      type="button"
                      class="btn-embed-chip"
                      @click="copyEmbedCode('html', selectedMediaForPreview)"
                      :title="'Salin tag HTML <img>'"
                    >
                      <Check v-if="copiedSubdomain === selectedMediaForPreview.id + '_html'" :size="12" class="text-green" />
                      <Code v-else :size="12" />
                      <span>{{ copiedSubdomain === selectedMediaForPreview.id + '_html' ? 'HTML Tersalin!' : 'Salin HTML <img>' }}</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Section D: Security & Edge Cache Health -->
              <div class="inspector-card-section">
                <div class="section-header-title">
                  <ShieldCheck :size="13" />
                  <span>Keamanan & Integritas S3</span>
                </div>
                <div class="security-badges-flex">
                  <span class="sec-badge green">
                    <span class="pulse-green-dot"></span>
                    <span>Traefik Edge (1.2ms TTFB)</span>
                  </span>
                  <span class="sec-badge blue">TLS 1.3 Strict</span>
                  <span class="sec-badge slate">Magic Bytes Verified</span>
                </div>
              </div>
            </div>
          </div>

          <!-- MODAL BOTTOM FOOTER -->
          <div class="studio-modal-footer">
            <button
              type="button"
              class="btn-modal-danger"
              @click="handleDeleteFromModal(selectedMediaForPreview)"
              title="Hapus berkas ini secara permanen dari bucket S3"
            >
              <Trash2 :size="14" />
              <span>Hapus Berkas</span>
            </button>
            <div style="flex: 1;"></div>
            <button
              type="button"
              class="btn-modal-ghost"
              @click="isPreviewModalOpen = false"
            >
              Tutup
            </button>
            <button
              type="button"
              class="btn-modal-confirm"
              @click="downloadMediaFile(selectedMediaForPreview)"
            >
              <Download :size="14" />
              <span>Unduh Berkas</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>
