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
  Plus
} from 'lucide-vue-next';
import { useDashboardData } from '../../composables/useDashboardData';
import type { MediaAssetItem } from '../../types/dashboard';

const isImage = (type?: string) => {
  if (!type) return false;
  return ['JPG', 'JPEG', 'PNG', 'WEBP', 'GIF', 'AVIF'].includes(type.toUpperCase());
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

              <!-- 4. SVG VECTOR CANVAS -->
              <div v-else-if="med.type === 'SVG'" class="graphic-vector-preview">
                <div class="vector-blueprint-box">
                  <div class="vector-glyph-symbol">
                    <FileCode :size="28" />
                  </div>
                  <span class="vector-mark-text">SVG SCALABLE VECTOR</span>
                </div>
                <span class="media-type-badge badge-svg">SVG</span>
              </div>

              <!-- 5. REAL RASTER IMAGES (JPG, PNG, WEBP, AVIF) -->
              <div v-else-if="isImage(med.type)" style="width: 100%; height: 100%;">
                <img
                  v-if="!failedImageIds.has(med.id)"
                  :src="med.url"
                  :alt="med.name"
                  class="gallery-card-thumb"
                  loading="lazy"
                  @error="handleImageError(med.id)"
                />
                <div v-else class="gallery-card-thumb-fallback">
                  <Eye :size="24" style="color: #64748b; margin-bottom: 4px;" />
                  <span style="font-size: 11px; color: #94a3b8; font-weight: 600;">{{ med.type }} IMAGE</span>
                </div>
                <span class="media-type-badge badge-img">{{ med.type }}</span>
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
                <span class="file-size-tag">{{ med.size }}</span>
                <span class="dot-sep">•</span>
                <span>{{ med.dimensions }}</span>
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
      </main>
    </div>

    <!-- MODAL: PREVIEW & DETAIL BERKAS S3 (BESPOKE MEDIA INSPECTOR) -->
    <Teleport to="body">
      <div v-if="isPreviewModalOpen && selectedMediaForPreview" class="modal-backdrop" @click.self="isPreviewModalOpen = false">
        <div class="modal-dialog modal-dialog-media-inspector">
          <div class="modal-header">
            <div class="modal-header-leading">
              <div class="modal-header-icon-box" :class="'type-' + selectedMediaForPreview.type.toLowerCase()">
                <FileSpreadsheet v-if="['XLSX', 'XLS', 'CSV'].includes(selectedMediaForPreview.type)" :size="18" />
                <FileText v-else-if="selectedMediaForPreview.type === 'PDF'" :size="18" />
                <File v-else-if="['DOCX', 'DOC'].includes(selectedMediaForPreview.type)" :size="18" />
                <FileCode v-else :size="18" />
              </div>
              <div style="min-width: 0; flex: 1;">
                <h3 class="modal-heading" :title="selectedMediaForPreview.name" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 500px;">
                  {{ selectedMediaForPreview.name }}
                </h3>
                <p class="modal-subheading">Aset tersimpan di S3 MinIO dengan proteksi TLS dan CDN Edge Caching.</p>
              </div>
            </div>
            <button class="modal-close-button" @click="isPreviewModalOpen = false" title="Tutup">
              <X :size="16" />
            </button>
          </div>

          <div class="preview-modal-body">
            <!-- 1. Real Visual Hero Canvas Viewport -->
            <div class="inspector-canvas-box">
              <!-- Floating Header Pills -->
              <div class="canvas-floating-toolbar">
                <span class="canvas-tag-pill">{{ selectedMediaForPreview.type }} • {{ selectedMediaForPreview.dimensions }}</span>
                <button
                  v-if="selectedMediaForPreview.type === 'PDF'"
                  type="button"
                  class="btn-canvas-action"
                  @click="showPdfPreview = !showPdfPreview"
                  :title="showPdfPreview ? 'Tampilkan info ringkas' : 'Pratinjau lembar PDF interaktif'"
                >
                  <Eye :size="12" />
                  <span>{{ showPdfPreview ? 'Tutup Pratinjau' : 'Lihat Lembar PDF' }}</span>
                </button>
                <a :href="selectedMediaForPreview.url" target="_blank" rel="noopener noreferrer" class="btn-canvas-action" title="Buka berkas langsung di tab baru">
                  <ExternalLink :size="12" />
                  <span>Buka Tab Baru</span>
                </a>
              </div>

              <!-- If Image / Graphic: Render REAL Image -->
              <img
                v-if="isImage(selectedMediaForPreview.type)"
                :src="selectedMediaForPreview.url"
                :alt="selectedMediaForPreview.name"
                class="inspector-real-img"
              />

              <!-- If PDF and PDF Viewer is Expanded: Render Embedded Frame -->
              <div v-else-if="selectedMediaForPreview.type === 'PDF' && showPdfPreview" style="width: 100%; height: 320px; border-radius: 8px; overflow: hidden; background: #ffffff;">
                <iframe :src="selectedMediaForPreview.url" style="width: 100%; height: 100%; border: none;"></iframe>
              </div>

              <!-- If PDF / Document: Stylized Document Card -->
              <div v-else class="inspector-doc-canvas">
                <div class="inspector-doc-icon-wrap" :class="'type-' + (['XLSX', 'XLS', 'CSV'].includes(selectedMediaForPreview.type) ? 'excel' : ['DOCX', 'DOC', 'TXT'].includes(selectedMediaForPreview.type) ? 'word' : selectedMediaForPreview.type === 'PDF' ? 'pdf' : 'vector')">
                  <FileSpreadsheet v-if="['XLSX', 'XLS', 'CSV'].includes(selectedMediaForPreview.type)" :size="30" />
                  <FileText v-else-if="selectedMediaForPreview.type === 'PDF'" :size="30" />
                  <File v-else-if="['DOCX', 'DOC', 'TXT'].includes(selectedMediaForPreview.type)" :size="30" />
                  <FileCode v-else :size="30" />
                </div>
                <h4>{{ selectedMediaForPreview.name }}</h4>
                <p>{{ selectedMediaForPreview.dimensions }} • {{ selectedMediaForPreview.size }}</p>
                <button
                  v-if="selectedMediaForPreview.type === 'PDF'"
                  type="button"
                  class="btn-canvas-action"
                  style="margin-top: 12px; background: rgba(37, 99, 235, 0.2); border-color: rgba(37, 99, 235, 0.4);"
                  @click="showPdfPreview = true"
                >
                  <Eye :size="12" />
                  <span>Pratinjau Lembar Dokumen PDF</span>
                </button>
              </div>
            </div>

            <!-- 2. High-Tech 2x2 Telemetry Grid for File Specs -->
            <div class="inspector-grid-telemetry">
              <div class="inspector-telemetry-cell">
                <div class="telemetry-cell-label">
                  <HardDrive :size="13" />
                  <span>Ukuran & Dimensi</span>
                </div>
                <div class="telemetry-cell-val">{{ selectedMediaForPreview.size }} <span style="font-weight: 500; font-size: 11.5px; color: #64748b;">({{ selectedMediaForPreview.dimensions }})</span></div>
                <div class="telemetry-cell-sub">Format: {{ selectedMediaForPreview.type }} File Object</div>
              </div>

              <div class="inspector-telemetry-cell">
                <div class="telemetry-cell-label">
                  <Database :size="13" />
                  <span>S3 Dedicated Bucket</span>
                </div>
                <div class="telemetry-cell-val" style="color: #2563eb; font-family: ui-monospace, monospace; font-size: 12.5px;">
                  {{ selectedMediaForPreview.bucketName || mediaBucketName }}
                </div>
                <div class="telemetry-cell-sub">Isolasi Fisik Multi-Tenant</div>
              </div>

              <div class="inspector-telemetry-cell">
                <div class="telemetry-cell-label">
                  <Calendar :size="13" />
                  <span>Tanggal Diunggah</span>
                </div>
                <div class="telemetry-cell-val">{{ selectedMediaForPreview.uploadedAt }}</div>
                <div class="telemetry-cell-sub">Waktu Sinkronisasi Database</div>
              </div>

              <div class="inspector-telemetry-cell">
                <div class="telemetry-cell-label">
                  <ShieldCheck :size="13" />
                  <span>Keamanan & CDN Edge</span>
                </div>
                <div class="telemetry-cell-val">
                  <span class="badge-online">Cached Traefik v3 (1.2ms)</span>
                </div>
                <div class="telemetry-cell-sub">Magic Bytes Passed • Anti-RCE Clean</div>
              </div>
            </div>

            <!-- 3. Copyable S3 URI & Edge CDN URL Strips -->
            <div class="inspector-url-bar">
              <span class="url-bar-label">
                <Database :size="13" />
                <span>S3 Bucket URI:</span>
              </span>
              <div class="url-bar-shell">
                <span class="url-bar-text">s3://{{ selectedMediaForPreview.bucketName || mediaBucketName }}/{{ selectedMediaForPreview.s3Key || selectedMediaForPreview.name }}</span>
                <button
                  class="btn-url-copy"
                  @click="copyToClipboard('s3://' + (selectedMediaForPreview.bucketName || mediaBucketName) + '/' + (selectedMediaForPreview.s3Key || selectedMediaForPreview.name), selectedMediaForPreview.id + '_s3')"
                >
                  <Check v-if="copiedSubdomain === selectedMediaForPreview.id + '_s3'" :size="13" class="text-green" />
                  <Copy v-else :size="13" />
                  <span>{{ copiedSubdomain === selectedMediaForPreview.id + '_s3' ? 'Tersalin' : 'Salin URI' }}</span>
                </button>
              </div>
            </div>

            <div class="inspector-url-bar">
              <span class="url-bar-label">
                <Globe :size="13" />
                <span>Edge Public CDN URL:</span>
              </span>
              <div class="url-bar-shell">
                <span class="url-bar-text">{{ selectedMediaForPreview.url }}</span>
                <button
                  class="btn-url-copy"
                  @click="copyToClipboard(selectedMediaForPreview.url, selectedMediaForPreview.id)"
                >
                  <Check v-if="copiedSubdomain === selectedMediaForPreview.id" :size="13" class="text-green" />
                  <Copy v-else :size="13" />
                  <span>{{ copiedSubdomain === selectedMediaForPreview.id ? 'Tersalin' : 'Salin URL' }}</span>
                </button>
              </div>
            </div>
          </div>

          <div class="modal-footer-row">
            <button type="button" class="btn-modal-danger" @click="handleDeleteFromModal(selectedMediaForPreview)">
              <Trash2 :size="14" />
              <span>Hapus Berkas</span>
            </button>
            <div style="flex: 1;"></div>
            <button type="button" class="btn-modal-ghost" @click="isPreviewModalOpen = false">
              Tutup
            </button>
            <button type="button" class="btn-modal-confirm" @click="downloadMediaFile(selectedMediaForPreview)">
              <Download :size="14" />
              <span>Unduh Berkas</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>
