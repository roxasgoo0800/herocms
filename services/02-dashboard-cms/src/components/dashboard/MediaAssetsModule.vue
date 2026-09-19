<script setup lang="ts">
import { ref, computed } from 'vue';
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
  File
} from 'lucide-vue-next';
import { useDashboardData } from '../../composables/useDashboardData';
import type { MediaAssetItem } from '../../types/dashboard';

const {
  mediaAssets,
  uploadMediaDemo,
  uploadMediaFiles,
  copyToClipboard,
  copiedSubdomain,
  showToast
} = useDashboardData();

const assetFilter = ref<'all' | 'image' | 'vector' | 'pdf' | 'excel' | 'doc'>('all');
const mediaSearch = ref('');
const isDragging = ref(false);
const fileInputRef = ref<HTMLInputElement | null>(null);

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
  } else {
    uploadMediaDemo();
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
        <span class="pill-metric-highlight">S3 Bucket: <strong>tenant-9942-media</strong></span>
      </div>
    </div>

    <!-- Storage Telemetry Strip (4 High-Tech Cards) -->
    <div class="stats-overview-grid">
      <div class="telemetry-card">
        <div class="telemetry-top">
          <span class="telemetry-label">KAPASITAS S3 BUCKET</span>
          <div class="telemetry-glyph blue"><Database :size="15" /></div>
        </div>
        <div class="telemetry-val">120 MB <span class="telemetry-denom">/ 2.0 GB</span></div>
        <div class="telemetry-sub ready-state">
          <span class="pulse-mini-dot"></span>
          <span>1.88 GB kuota tersedia (SSD NVMe)</span>
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
          <span class="telemetry-label">BANDWIDTH BULAN INI</span>
          <div class="telemetry-glyph purple"><Globe :size="15" /></div>
        </div>
        <div class="telemetry-val">1.42 GB <span class="badge-growth-pill">Normal</span></div>
        <div class="telemetry-sub"><span>Unlimited egress edge proxy</span></div>
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
          <strong>Distribusi Penyimpanan Objek S3</strong>
          <span>Alokasi kapasitas berdasarkan format berkas media</span>
        </div>
        <div class="breakdown-tags">
          <span class="legend-item"><span class="legend-dot blue"></span> Gambar (84 MB)</span>
          <span class="legend-item"><span class="legend-dot red"></span> PDF (24 MB)</span>
          <span class="legend-item"><span class="legend-dot emerald"></span> Excel (8 MB)</span>
          <span class="legend-item"><span class="legend-dot indigo"></span> Docs (4 MB)</span>
          <span class="legend-item"><span class="legend-dot purple"></span> Vektor (12 MB)</span>
          <span class="legend-item"><span class="legend-dot gray"></span> Bebas (1.87 GB)</span>
        </div>
      </div>
      <div class="multi-seg-track">
        <div class="seg-fill blue" style="width: 4.2%" title="Gambar: 84MB"></div>
        <div class="seg-fill red" style="width: 1.2%" title="PDF: 24MB"></div>
        <div class="seg-fill emerald" style="width: 0.4%" title="Excel: 8MB"></div>
        <div class="seg-fill indigo" style="width: 0.2%" title="Docs: 4MB"></div>
        <div class="seg-fill purple" style="width: 0.6%" title="Vektor: 12MB"></div>
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
      <div class="dropzone-content">
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
          v-model="mediaSearch"
          type="text"
          placeholder="Cari berkas gambar, dokumen PDF, spreadsheet Excel, laporan..."
          class="search-command-input"
        />
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

          <!-- 4. RASTER IMAGES & BANNERS -->
          <div v-else-if="med.name.includes('banner')" class="graphic-banner-preview">
            <div class="graphic-code-watermark">
              <code>docker run -d -p 80:80 herocms/tenant</code>
            </div>
            <span class="graphic-tag-badge">HERO BANNER</span>
            <span class="media-type-badge badge-img">{{ med.type }}</span>
          </div>

          <div v-else-if="med.name.includes('avatar')" class="graphic-avatar-preview">
            <div class="avatar-ring-glow">
              <div class="avatar-inner-circle">RP</div>
            </div>
            <span class="media-type-badge badge-img">{{ med.type }}</span>
          </div>

          <div v-else-if="med.name.includes('traefik')" class="graphic-diagram-preview">
            <div class="infra-nodes-mock">
              <span>Client</span> ➔ <span>Traefik:443</span> ➔ <span>Docker C1</span>
            </div>
            <span class="media-type-badge badge-img">{{ med.type }}</span>
          </div>

          <!-- 5. SVG VECTOR -->
          <div v-else class="graphic-vector-preview">
            <div class="vector-mark-symbol">◆ HC</div>
            <span class="media-type-badge badge-svg">SVG</span>
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
        <button class="btn-primary-ghost" @click="uploadMediaDemo">
          Unggah Contoh Dokumen / Berkas
        </button>
      </div>
    </div>

    <!-- MODAL: PREVIEW & DETAIL BERKAS S3 -->
    <div v-if="isPreviewModalOpen && selectedMediaForPreview" class="modal-backdrop" @click.self="isPreviewModalOpen = false">
      <div class="modal-dialog">
        <div class="modal-header">
          <div class="modal-header-leading">
            <div class="modal-header-icon-box" :class="'type-' + selectedMediaForPreview.type.toLowerCase()">
              <FileSpreadsheet v-if="['XLSX', 'XLS', 'CSV'].includes(selectedMediaForPreview.type)" :size="18" />
              <FileText v-else-if="selectedMediaForPreview.type === 'PDF'" :size="18" />
              <File v-else-if="['DOCX', 'DOC'].includes(selectedMediaForPreview.type)" :size="18" />
              <FileCode v-else :size="18" />
            </div>
            <div>
              <h3 class="modal-heading">{{ selectedMediaForPreview.name }}</h3>
              <p class="modal-subheading">Aset tersimpan di S3 MinIO dengan proteksi TLS dan CDN Edge Caching.</p>
            </div>
          </div>
          <button class="modal-close-button" @click="isPreviewModalOpen = false" title="Tutup">
            <X :size="16" />
          </button>
        </div>

        <div class="preview-modal-body">
          <!-- Visual Header -->
          <div class="preview-visual-box" :class="'box-' + selectedMediaForPreview.type.toLowerCase()">
            <div class="preview-visual-inner">
              <span class="preview-type-pill">{{ selectedMediaForPreview.type }}</span>
              <h4>{{ selectedMediaForPreview.name }}</h4>
              <p>{{ selectedMediaForPreview.dimensions }} • {{ selectedMediaForPreview.size }}</p>
            </div>
          </div>

          <!-- Metadata Spec List -->
          <div class="file-specs-list">
            <div class="spec-row">
              <span class="spec-lbl">S3 Bucket URI:</span>
              <code>s3://tenant-9942-media/assets/{{ selectedMediaForPreview.name }}</code>
            </div>
            <div class="spec-row">
              <span class="spec-lbl">Edge CDN URL:</span>
              <div class="spec-copyable">
                <code>{{ selectedMediaForPreview.url }}</code>
                <button
                  class="btn-spec-copy"
                  @click="copyToClipboard(selectedMediaForPreview.url, selectedMediaForPreview.id)"
                >
                  <Check v-if="copiedSubdomain === selectedMediaForPreview.id" :size="13" class="text-green" />
                  <Copy v-else :size="13" />
                </button>
              </div>
            </div>
            <div class="spec-row">
              <span class="spec-lbl">Tanggal Diunggah:</span>
              <span>{{ selectedMediaForPreview.uploadedAt }}</span>
            </div>
            <div class="spec-row">
              <span class="spec-lbl">Status Edge:</span>
              <span class="badge-online">Cached on Traefik v3 (1.2ms TTFB)</span>
            </div>
          </div>
        </div>

        <div class="modal-footer-row">
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
  </section>
</template>

<style scoped>
.fade-in-section {
  animation: fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

.page-intro-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.02em;
  margin: 0 0 6px 0;
}

.page-desc {
  font-size: 13.5px;
  color: #64748b;
  margin: 0;
  max-width: 720px;
  line-height: 1.5;
}

.quota-quick-pills {
  display: flex;
  gap: 10px;
}

.pill-metric, .pill-metric-highlight {
  font-size: 11.5px;
  padding: 5px 12px;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  color: #475569;
}

.pill-metric-highlight {
  background: #eff6ff;
  border-color: #bfdbfe;
  color: #1d4ed8;
}

/* 4 Telemetry Cards */
.stats-overview-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

@media (max-width: 1100px) {
  .stats-overview-grid { grid-template-columns: repeat(2, 1fr); }
}

.telemetry-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 16px 18px;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.03);
}

.telemetry-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.telemetry-label {
  font-size: 11px;
  font-weight: 700;
  color: #64748b;
  letter-spacing: 0.05em;
}

.telemetry-glyph {
  width: 28px;
  height: 28px;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.telemetry-glyph.blue { background: #f0f9ff; color: #0284c7; }
.telemetry-glyph.emerald { background: #ecfdf5; color: #059669; }
.telemetry-glyph.purple { background: #f5f3ff; color: #7c3aed; }

.telemetry-val {
  font-size: 19px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.telemetry-denom {
  font-size: 13px;
  font-weight: 500;
  color: #64748b;
}

.telemetry-sub {
  font-size: 12px;
  color: #94a3b8;
}

.pulse-mini-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10b981;
  margin-right: 5px;
}

.badge-online {
  font-size: 11px;
  font-weight: 600;
  color: #0284c7;
  background: #f0f9ff;
  padding: 2px 8px;
  border-radius: 20px;
}

.badge-growth-pill {
  font-size: 11px;
  font-weight: 600;
  color: #7c3aed;
  background: #f5f3ff;
  padding: 2px 8px;
  border-radius: 20px;
}

/* Storage Breakdown Panel */
.storage-breakdown-panel {
  padding: 16px 20px;
  margin-bottom: 20px;
  background: #ffffff;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
}

.breakdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  flex-wrap: wrap;
  gap: 10px;
}

.breakdown-title-group strong {
  font-size: 13.5px;
  color: #0f172a;
  display: block;
}

.breakdown-title-group span {
  font-size: 12px;
  color: #64748b;
}

.breakdown-tags {
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 11.5px;
  color: #475569;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 2px;
}

.legend-dot.blue { background: #2563eb; }
.legend-dot.red { background: #ef4444; }
.legend-dot.emerald { background: #10b981; }
.legend-dot.indigo { background: #4f46e5; }
.legend-dot.purple { background: #9333ea; }
.legend-dot.gray { background: #e2e8f0; }

.multi-seg-track {
  height: 10px;
  background: #f1f5f9;
  border-radius: 999px;
  overflow: hidden;
  display: flex;
  position: relative;
}

.seg-fill.blue { background: #2563eb; }
.seg-fill.red { background: #ef4444; }
.seg-fill.emerald { background: #10b981; }
.seg-fill.indigo { background: #4f46e5; }
.seg-fill.purple { background: #9333ea; }

/* Upload Dropzone */
.upload-dropzone-pro {
  position: relative;
  background: #ffffff;
  border: 1.5px dashed #cbd5e1;
  border-radius: 16px;
  padding: 30px 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  overflow: hidden;
}

.upload-dropzone-pro:hover, .upload-dropzone-pro.dragging {
  border-color: #2563eb;
  background: #f8faff;
  transform: translateY(-1px);
  box-shadow: 0 8px 24px -4px rgba(37, 99, 235, 0.08);
}

.dropzone-icon-box {
  width: 50px;
  height: 50px;
  background: #eff6ff;
  color: #2563eb;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px auto;
}

.dropzone-heading {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 6px 0;
}

.text-blue-link {
  color: #2563eb;
  text-decoration: underline;
}

.dropzone-sub {
  font-size: 12.5px;
  color: #64748b;
  margin: 0 0 14px 0;
}

.format-badges-row {
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}

.format-pill {
  font-size: 10.5px;
  font-weight: 700;
  padding: 3px 9px;
  border-radius: 6px;
  letter-spacing: 0.04em;
}

.pill-img { background: #eff6ff; color: #1d4ed8; }
.pill-pdf { background: #fef2f2; color: #b91c1c; }
.pill-excel { background: #ecfdf5; color: #047857; }
.pill-doc { background: #eef2ff; color: #4338ca; }
.pill-svg { background: #fdf4ff; color: #a21caf; }
.pill-cdn { background: #f1f5f9; color: #475569; }

/* Filter Toolbar */
.filter-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.search-command-shell {
  position: relative;
  flex: 1;
  max-width: 380px;
}

.search-lead-glyph {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
}

.search-command-input {
  width: 100%;
  box-sizing: border-box;
  padding: 8px 45px 8px 36px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 12.5px;
  color: #0f172a;
  outline: none;
  background: #ffffff;
}

.search-command-input:focus {
  border-color: #0f172a;
  box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.06);
}

.shortcut-tag {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 10px;
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  padding: 1px 5px;
  border-radius: 4px;
  color: #64748b;
}

.segmented-filter-bar {
  display: flex;
  gap: 4px;
  background: #f1f5f9;
  padding: 3px;
  border-radius: 8px;
  flex-wrap: wrap;
}

.segment-pill {
  background: transparent;
  border: none;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.segment-pill.active {
  background: #ffffff;
  color: #0f172a;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.08);
}

/* Media Cards Grid */
.media-gallery-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
}

@media (max-width: 1280px) {
  .media-gallery-grid { grid-template-columns: repeat(3, 1fr); }
}

@media (max-width: 860px) {
  .media-gallery-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 580px) {
  .media-gallery-grid { grid-template-columns: 1fr; }
}

.media-pro-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.03);
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;
}

.media-pro-card:hover {
  transform: translateY(-3px);
  border-color: #cbd5e1;
  box-shadow: 0 10px 24px -4px rgba(15, 23, 42, 0.08);
}

.media-preview-canvas {
  position: relative;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* Visual Canvas Types */
.art-type-pdf, .graphic-pdf-preview {
  background: linear-gradient(135deg, #450a0a, #991b1b);
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.pdf-watermark-symbol {
  position: absolute;
  right: -10px;
  bottom: -10px;
  opacity: 0.12;
  transform: scale(2.2);
  color: #ffffff;
}

.pdf-doc-sheet {
  background: #ffffff;
  width: 110px;
  height: 105px;
  border-radius: 6px;
  padding: 10px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.pdf-doc-bar-red {
  height: 4px;
  background: #dc2626;
  border-radius: 2px;
  width: 40%;
}

.pdf-line {
  height: 3px;
  background: #e2e8f0;
  border-radius: 2px;
}

.pdf-line.long { width: 100%; }
.pdf-line.medium { width: 75%; }
.pdf-line.short { width: 50%; }

.pdf-meta-pill {
  margin-top: auto;
  font-size: 8px;
  font-weight: 800;
  color: #b91c1c;
  background: #fee2e2;
  padding: 2px 4px;
  border-radius: 3px;
  text-align: center;
}

/* Excel Sheet Canvas */
.art-type-xlsx, .art-type-xls, .art-type-csv, .graphic-excel-preview {
  background: linear-gradient(135deg, #064e3b, #047857);
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.excel-watermark-symbol {
  position: absolute;
  right: -10px;
  bottom: -10px;
  opacity: 0.12;
  transform: scale(2.2);
  color: #ffffff;
}

.excel-sheet-grid {
  background: #ffffff;
  width: 125px;
  height: 105px;
  border-radius: 6px;
  padding: 8px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.excel-formula-bar {
  display: flex;
  align-items: center;
  gap: 4px;
  background: #f1f5f9;
  padding: 2px 5px;
  border-radius: 3px;
  font-size: 8.5px;
}

.fx-label {
  font-weight: 700;
  color: #059669;
}

.fx-formula {
  font-family: ui-monospace, monospace;
  color: #334155;
  font-size: 8px;
}

.excel-grid-rows {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.excel-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 3px;
}

.excel-row span {
  height: 12px;
  background: #ecfdf5;
  border: 1px solid #d1fae5;
  border-radius: 2px;
}

/* Word Doc Canvas */
.art-type-docx, .art-type-doc, .graphic-doc-preview {
  background: linear-gradient(135deg, #1e1b4b, #3730a3);
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.doc-watermark-symbol {
  position: absolute;
  right: -10px;
  bottom: -10px;
  opacity: 0.12;
  transform: scale(2.2);
  color: #ffffff;
}

.word-doc-sheet {
  background: #ffffff;
  width: 110px;
  height: 105px;
  border-radius: 6px;
  padding: 10px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.word-header-line {
  height: 5px;
  background: #4338ca;
  border-radius: 2px;
  width: 60%;
}

.word-para-line {
  height: 3px;
  background: #e2e8f0;
  border-radius: 2px;
}

.word-para-line.short { width: 45%; }

.word-page-indicator {
  margin-top: auto;
  font-size: 8px;
  font-weight: 800;
  color: #4338ca;
  background: #e0e7ff;
  padding: 2px 4px;
  border-radius: 3px;
  text-align: center;
}

/* Images & Banners */
.graphic-banner-preview {
  background: linear-gradient(135deg, #0f172a, #1e293b);
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.graphic-code-watermark code {
  font-family: ui-monospace, monospace;
  font-size: 10px;
  color: #38bdf8;
  opacity: 0.6;
}

.graphic-tag-badge {
  position: absolute;
  bottom: 10px;
  left: 10px;
  font-size: 9px;
  font-weight: 800;
  color: #38bdf8;
  background: rgba(56, 189, 248, 0.12);
  padding: 2px 6px;
  border-radius: 4px;
}

.graphic-avatar-preview {
  background: linear-gradient(135deg, #1e293b, #334155);
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-ring-glow {
  padding: 3px;
  border-radius: 50%;
  background: linear-gradient(135deg, #38bdf8, #818cf8);
}

.avatar-inner-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #0f172a;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 15px;
}

.graphic-diagram-preview {
  background: #090d16;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.infra-nodes-mock {
  font-family: ui-monospace, monospace;
  font-size: 9.5px;
  color: #10b981;
}

.infra-nodes-mock span {
  background: rgba(16, 185, 129, 0.12);
  padding: 2px 5px;
  border-radius: 3px;
}

.graphic-vector-preview {
  background: linear-gradient(135deg, #2e1065, #581c87);
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.vector-mark-symbol {
  font-size: 22px;
  font-weight: 900;
  color: #e9d5ff;
  letter-spacing: 0.1em;
}

/* Badges */
.media-type-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  font-size: 10px;
  font-weight: 800;
  padding: 2px 7px;
  border-radius: 4px;
  letter-spacing: 0.05em;
}

.badge-pdf { background: #dc2626; color: #ffffff; }
.badge-excel { background: #059669; color: #ffffff; }
.badge-docx { background: #4f46e5; color: #ffffff; }
.badge-img { background: #0284c7; color: #ffffff; }
.badge-svg { background: #9333ea; color: #ffffff; }

/* Hover overlay */
.media-hover-overlay {
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  opacity: 0;
  transition: all 0.15s ease;
}

.media-pro-card:hover .media-hover-overlay {
  opacity: 1;
}

.overlay-btn {
  width: 32px;
  height: 32px;
  border-radius: 7px;
  background: #ffffff;
  color: #0f172a;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
}

.overlay-btn:hover {
  background: #f1f5f9;
  transform: scale(1.08);
}

.overlay-btn.danger:hover {
  background: #fee2e2;
  color: #dc2626;
}

.text-green { color: #059669; }

/* Info block */
.media-info-block {
  padding: 12px 14px;
}

.media-title-line {
  font-size: 13px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.media-sub-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11.5px;
  color: #64748b;
}

.dot-sep { color: #cbd5e1; }

.edge-cached-tag {
  margin-left: auto;
  font-size: 10px;
  font-weight: 600;
  color: #059669;
  background: #ecfdf5;
  padding: 1px 6px;
  border-radius: 4px;
}

.empty-gallery-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 48px;
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  border-radius: 14px;
}

.empty-icon {
  color: #94a3b8;
  margin-bottom: 12px;
}

.empty-gallery-state h4 {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 6px 0;
}

.empty-gallery-state p {
  font-size: 13px;
  color: #64748b;
  margin: 0 0 16px 0;
}

.btn-primary-ghost {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  color: #0f172a;
  font-size: 13px;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
}

/* Modal */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

.modal-dialog {
  background: #ffffff;
  border-radius: 16px;
  width: 100%;
  max-width: 540px;
  box-shadow: 0 20px 40px -10px rgba(15, 23, 42, 0.2);
  border: 1px solid #e2e8f0;
  overflow: hidden;
  animation: modalScale 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modalScale {
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1); }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 18px 24px;
  border-bottom: 1px solid #f1f5f9;
}

.modal-header-leading {
  display: flex;
  gap: 12px;
}

.modal-header-icon-box {
  width: 38px;
  height: 38px;
  border-radius: 9px;
  background: #f1f5f9;
  color: #0f172a;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.modal-header-icon-box.type-pdf { background: #fee2e2; color: #dc2626; }
.modal-header-icon-box.type-xlsx, .modal-header-icon-box.type-xls, .modal-header-icon-box.type-csv { background: #d1fae5; color: #059669; }
.modal-header-icon-box.type-docx, .modal-header-icon-box.type-doc { background: #e0e7ff; color: #4338ca; }

.modal-heading {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 3px 0;
  word-break: break-all;
}

.modal-subheading {
  font-size: 12px;
  color: #64748b;
  margin: 0;
}

.modal-close-button {
  background: transparent;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
}

.modal-close-button:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.preview-modal-body {
  padding: 20px 24px;
}

.preview-visual-box {
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  color: #ffffff;
  margin-bottom: 20px;
}

.box-pdf { background: linear-gradient(135deg, #7f1d1d, #b91c1c); }
.box-xlsx, .box-xls, .box-csv { background: linear-gradient(135deg, #064e3b, #047857); }
.box-docx, .box-doc { background: linear-gradient(135deg, #1e1b4b, #3730a3); }
.box-webp, .box-png, .box-jpg, .box-jpeg { background: linear-gradient(135deg, #0f172a, #1e293b); }
.box-svg { background: linear-gradient(135deg, #3b0764, #6b21a8); }

.preview-type-pill {
  display: inline-block;
  font-size: 11px;
  font-weight: 800;
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 8px;
  border-radius: 4px;
  margin-bottom: 8px;
}

.preview-visual-inner h4 {
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 4px 0;
  word-break: break-all;
}

.preview-visual-inner p {
  font-size: 12.5px;
  opacity: 0.85;
  margin: 0;
}

.file-specs-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.spec-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.spec-lbl {
  font-size: 11px;
  font-weight: 700;
  color: #64748b;
  letter-spacing: 0.04em;
}

.spec-row code {
  font-family: ui-monospace, monospace;
  font-size: 11.5px;
  background: #f1f5f9;
  padding: 4px 8px;
  border-radius: 6px;
  color: #0f172a;
  word-break: break-all;
}

.spec-copyable {
  display: flex;
  align-items: center;
  gap: 8px;
}

.spec-copyable code {
  flex: 1;
}

.btn-spec-copy {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  padding: 5px 8px;
  cursor: pointer;
  color: #475569;
}

.btn-spec-copy:hover {
  background: #f8fafc;
  color: #0f172a;
}

.modal-footer-row {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 24px;
  border-top: 1px solid #f1f5f9;
}

.btn-modal-ghost {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  color: #475569;
  padding: 9px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.btn-modal-ghost:hover {
  background: #f8fafc;
  color: #0f172a;
}

.btn-modal-confirm {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #0f172a;
  border: 1px solid #0f172a;
  color: #ffffff;
  padding: 9px 18px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.btn-modal-confirm:hover {
  background: #1e293b;
}
</style>
