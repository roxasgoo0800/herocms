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
  Calendar
} from 'lucide-vue-next';
import { useDashboardData } from '../../composables/useDashboardData';
import type { MediaAssetItem } from '../../types/dashboard';

const isImage = (type?: string) => {
  if (!type) return false;
  return ['JPG', 'JPEG', 'PNG', 'WEBP', 'GIF', 'AVIF', 'SVG'].includes(type.toUpperCase());
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
const mediaSearch = ref('');
const isDragging = ref(false);
const fileInputRef = ref<HTMLInputElement | null>(null);
const searchInputRef = ref<HTMLInputElement | null>(null);

const handleGlobalKeydown = (e: KeyboardEvent) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    searchInputRef.value?.focus();
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleGlobalKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown);
});

// Document preview modal state
const isPreviewModalOpen = ref(false);
const selectedMediaForPreview = ref<MediaAssetItem | null>(null);

const filteredMedia = computed(() => {
  return mediaAssets.value.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(mediaSearch.value.toLowerCase()) ||
                          item.type.toLowerCase().includes(mediaSearch.value.toLowerCase());
    if (!matchesSearch) return false;
    if (assetFilter.value === 'all') return true;
    if (assetFilter.value === 'image') return ['WEBP', 'JPG', 'JPEG', 'PNG', 'AVIF'].includes(item.type);
    if (assetFilter.value === 'vector') return item.type === 'SVG';
    if (assetFilter.value === 'pdf') return item.type === 'PDF';
    if (assetFilter.value === 'excel') return ['XLSX', 'XLS', 'CSV'].includes(item.type);
    if (assetFilter.value === 'doc') return ['DOCX', 'DOC'].includes(item.type);
    return true;
  });
});

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

const handleDropUpload = (e: DragEvent) => {
  isDragging.value = false;
  if (e.dataTransfer && e.dataTransfer.files.length > 0) {
    uploadMediaFiles(e.dataTransfer.files);
  }
};

const openPreviewModal = (item: MediaAssetItem) => {
  selectedMediaForPreview.value = item;
  isPreviewModalOpen.value = true;
};

const downloadMediaFile = (item: MediaAssetItem) => {
  // Simulate download file
  const element = document.createElement('a');
  element.setAttribute('href', item.url);
  element.setAttribute('download', item.name);
  element.setAttribute('target', '_blank');
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  showToast(`Mengunduh berkas ${item.name}...`, 'info');
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
        <p class="page-desc">Penyimpanan objek S3 multi-region terisolasi untuk foto, vektor, berkas PDF, spreadsheet Excel (.xlsx), dan dokumen Word (.docx) dengan CDN edge proxy Traefik v3.</p>
      </div>
      <div class="quota-quick-pills">
        <span class="pill-metric">Region: <strong>ID-JKT-1 (MinIO S3)</strong></span>
        <span class="pill-metric-highlight">S3 Dedicated Bucket: <strong>{{ mediaBucketName }}</strong></span>
      </div>
    </div>

    <!-- Storage Telemetry Strip (4 High-Tech Cards) -->
    <div class="stats-overview-grid">
      <div class="telemetry-card">
        <div class="telemetry-top">
          <span class="telemetry-label">KAPASITAS S3 BUCKET</span>
          <div class="telemetry-glyph blue"><Database :size="15" /></div>
        </div>
        <div class="telemetry-val">{{ mediaStorage.usedStorage }} <span class="telemetry-denom">/ 2.0 GB</span></div>
        <div class="telemetry-sub ready-state">
          <span class="pulse-mini-dot"></span>
          <span>{{ mediaStorage.freeStorage }} kuota tersedia (SSD NVMe)</span>
        </div>
      </div>

      <div class="telemetry-card">
        <div class="telemetry-top">
          <span class="telemetry-label">CDN EDGE HIT RATIO</span>
          <div class="telemetry-glyph emerald"><Zap :size="15" /></div>
        </div>
        <div class="telemetry-val">99.4% <span class="badge-online">Optimal</span></div>
        <div class="telemetry-sub"><span>Rerata latensi serving: 1.2ms TTFB</span></div>
      </div>

      <div class="telemetry-card">
        <div class="telemetry-top">
          <span class="telemetry-label">UTILISASI KUOTA AKUN</span>
          <div class="telemetry-glyph purple"><Globe :size="15" /></div>
        </div>
        <div class="telemetry-val">{{ mediaStorage.usagePercentage }} <span class="badge-growth-pill">Max 2 GB</span></div>
        <div class="telemetry-sub"><span>Terisolasi per customer account</span></div>
      </div>

      <div class="telemetry-card">
        <div class="telemetry-top">
          <span class="telemetry-label">TOTAL OBJEK BERKAS</span>
          <div class="telemetry-glyph blue"><Layers :size="15" /></div>
        </div>
        <div class="telemetry-val">{{ mediaAssets.length }} File <span class="badge-online">Sync</span></div>
        <div class="telemetry-sub"><span>Mendukung Raster, SVG, PDF, XLSX, DOCX</span></div>
      </div>
    </div>

    <!-- Storage Visual Gauge Breakdown -->
    <div class="pro-panel storage-breakdown-panel">
      <div class="breakdown-header">
        <div class="breakdown-title-group">
          <strong>Distribusi Penyimpanan Objek S3 Terisolasi</strong>
          <span>Alokasi kapasitas objek media pelanggan (Batas: 2.0 GB)</span>
        </div>
        <div class="breakdown-tags">
          <span class="legend-item"><span class="legend-dot blue"></span> Terpakai ({{ mediaStorage.usedStorage }})</span>
          <span class="legend-item"><span class="legend-dot gray"></span> Kuota Bebas ({{ mediaStorage.freeStorage }})</span>
        </div>
      </div>
      <div class="multi-seg-track">
        <div class="seg-fill blue" :style="{ width: mediaStorage.usagePercentage }" :title="'Terpakai: ' + mediaStorage.usedStorage"></div>
      </div>
    </div>

    <!-- Futuristic Drag & Drop Upload Zone -->
    <div
      class="upload-dropzone-pro"
      :class="{ dragging: isDragging }"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDropUpload"
      @click="triggerFileInput"
    >
      <!-- Hidden Native File Input -->
      <input
        ref="fileInputRef"
        type="file"
        multiple
        accept="image/*,.pdf,.xlsx,.xls,.docx,.doc,.csv,.svg"
        style="display: none"
        @change="handleFileInputChange"
      />

      <div class="dropzone-glow-ring"></div>
      <div v-if="isUploadingMedia" class="dropzone-content">
        <div class="dropzone-icon-box">
          <Loader2 :size="28" class="spin-animation" style="color: #2563eb;" />
        </div>
        <div class="dropzone-text-group">
          <h3 class="dropzone-heading">Mengunggah ke MinIO S3...</h3>
          <p class="dropzone-sub">Menyimpan objek dan mengindeks metadata ke database.</p>
        </div>
      </div>
      <div v-else class="dropzone-content">
        <div class="dropzone-icon-box">
          <UploadCloud :size="28" />
        </div>
        <div class="dropzone-text-group">
          <h3 class="dropzone-heading">
            Tarik & Lepas File ke Sini atau <span class="text-blue-link">Pilih dari Komputer</span>
          </h3>
          <p class="dropzone-sub">
            Mendukung <strong>Foto (WebP, PNG, JPG)</strong>, <strong>PDF</strong>, <strong>Excel (.xlsx, .csv)</strong>, <strong>Word (.docx)</strong>, & <strong>SVG</strong> (Maks. 50MB per file)
          </p>
        </div>
        <div class="format-badges-row">
          <span class="format-pill pill-img">WEBP / PNG / JPG</span>
          <span class="format-pill pill-pdf">PDF DOCUMENT</span>
          <span class="format-pill pill-excel">EXCEL .XLSX</span>
          <span class="format-pill pill-doc">WORD .DOCX</span>
          <span class="format-pill pill-svg">SVG VECTOR</span>
          <span class="format-pill pill-cdn">EDGE CDN CACHED</span>
        </div>
      </div>
    </div>

    <!-- Media Filter & Search Toolbar -->
    <div class="filter-toolbar" style="margin-top: 24px;">
      <div class="search-command-shell">
        <Search :size="15" class="search-lead-glyph" />
        <input
          ref="searchInputRef"
          v-model="mediaSearch"
          type="text"
          placeholder="Cari berkas gambar, dokumen PDF, spreadsheet Excel, laporan..."
          class="search-command-input"
        />
        <button v-if="mediaSearch" class="btn-clear-search" @click="mediaSearch = ''" title="Bersihkan">
          <X :size="13" />
        </button>
        <kbd class="shortcut-tag">⌘K</kbd>
      </div>

      <div class="segmented-filter-bar">
        <button
          class="segment-pill"
          :class="{ active: assetFilter === 'all' }"
          @click="assetFilter = 'all'"
        >
          <span>Semua ({{ mediaAssets.length }})</span>
        </button>
        <button
          class="segment-pill"
          :class="{ active: assetFilter === 'image' }"
          @click="assetFilter = 'image'"
        >
          <span>Foto & Raster</span>
        </button>
        <button
          class="segment-pill"
          :class="{ active: assetFilter === 'pdf' }"
          @click="assetFilter = 'pdf'"
        >
          <span>Dokumen PDF</span>
        </button>
        <button
          class="segment-pill"
          :class="{ active: assetFilter === 'excel' }"
          @click="assetFilter = 'excel'"
        >
          <span>Excel Spreadsheet</span>
        </button>
        <button
          class="segment-pill"
          :class="{ active: assetFilter === 'doc' }"
          @click="assetFilter = 'doc'"
        >
          <span>Word Docs</span>
        </button>
        <button
          class="segment-pill"
          :class="{ active: assetFilter === 'vector' }"
          @click="assetFilter = 'vector'"
        >
          <span>Vektor SVG</span>
        </button>
      </div>
    </div>

    <!-- High-End Media Cards Grid -->
    <div class="media-gallery-grid">
      <div
        v-for="med in filteredMedia"
        :key="med.id"
        class="media-pro-card"
        @click="openPreviewModal(med)"
      >
        <!-- Card Visual Preview Area -->
        <div class="media-preview-canvas" :class="'art-type-' + med.type.toLowerCase()">
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

          <!-- 4. REAL RASTER IMAGES & SVGS -->
          <div v-else-if="isImage(med.type)" class="graphic-real-image">
            <img :src="med.url" :alt="med.name" class="gallery-card-thumb" loading="lazy" />
            <span class="media-type-badge badge-img">{{ med.type }}</span>
          </div>

          <!-- 5. SVG VECTOR / FALLBACK -->
          <div v-else class="graphic-vector-preview">
            <div class="vector-mark-symbol">◆ HC</div>
            <span class="media-type-badge badge-svg">{{ med.type }}</span>
          </div>

          <!-- Hover Overlay with Fast Actions -->
          <div class="media-hover-overlay" @click.stop>
            <button
              class="overlay-btn"
              @click.stop="copyToClipboard(med.url, med.id)"
              :title="copiedSubdomain === med.id ? 'Tersalin!' : 'Salin URL CDN'"
            >
              <Check v-if="copiedSubdomain === med.id" :size="14" class="text-green" />
              <Copy v-else :size="14" />
            </button>
            <button
              class="overlay-btn"
              @click.stop="downloadMediaFile(med)"
              title="Unduh Berkas"
            >
              <Download :size="14" />
            </button>
            <button
              class="overlay-btn"
              @click.stop="openPreviewModal(med)"
              title="Rincian & Preview"
            >
              <Eye :size="14" />
            </button>
            <button
              class="overlay-btn overlay-btn-danger"
              @click.stop="handleDeleteMedia(med)"
              title="Hapus dari S3"
            >
              <Trash2 :size="14" />
            </button>
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
            <span class="file-dim-tag">{{ med.dimensions }}</span>
            <span class="edge-cached-tag">CDN Ready</span>
          </div>
        </div>
      </div>

      <div v-if="filteredMedia.length === 0" class="empty-gallery-state">
        <UploadCloud :size="36" class="empty-icon" />
        <h4>Tidak ada berkas media ditemukan</h4>
        <p>Unggah berkas baru atau sesuaikan kata kunci pencarian Anda.</p>
        <button class="btn-primary-ghost" @click="triggerFileInput">
          <UploadCloud :size="14" style="margin-right: 6px;" />
          Pilih Berkas untuk Diunggah
        </button>
      </div>
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

              <!-- If PDF / Document: Stylized Document Card -->
              <div v-else class="inspector-doc-canvas">
                <div class="inspector-doc-icon-wrap" :class="'type-' + (['XLSX', 'XLS', 'CSV'].includes(selectedMediaForPreview.type) ? 'excel' : ['DOCX', 'DOC'].includes(selectedMediaForPreview.type) ? 'word' : selectedMediaForPreview.type === 'PDF' ? 'pdf' : 'vector')">
                  <FileSpreadsheet v-if="['XLSX', 'XLS', 'CSV'].includes(selectedMediaForPreview.type)" :size="30" />
                  <FileText v-else-if="selectedMediaForPreview.type === 'PDF'" :size="30" />
                  <File v-else-if="['DOCX', 'DOC'].includes(selectedMediaForPreview.type)" :size="30" />
                  <FileCode v-else :size="30" />
                </div>
                <h4>{{ selectedMediaForPreview.name }}</h4>
                <p>{{ selectedMediaForPreview.dimensions }} • {{ selectedMediaForPreview.size }}</p>
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
