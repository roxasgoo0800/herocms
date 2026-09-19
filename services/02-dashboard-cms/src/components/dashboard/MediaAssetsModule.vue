<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  UploadCloud,
  Search,
  Copy,
  Check,
  Trash2,
  ExternalLink,
  Layers,
  Zap,
  Globe,
  Database
} from 'lucide-vue-next';
import { useDashboardData } from '../../composables/useDashboardData';

const {
  mediaAssets,
  uploadMediaDemo,
  deleteMedia,
  copyToClipboard,
  copiedSubdomain
} = useDashboardData();

const assetFilter = ref<'all' | 'image' | 'vector' | 'doc'>('all');
const mediaSearch = ref('');
const isDragging = ref(false);

const filteredMedia = computed(() => {
  return mediaAssets.value.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(mediaSearch.value.toLowerCase());
    if (!matchesSearch) return false;
    if (assetFilter.value === 'all') return true;
    if (assetFilter.value === 'image') return item.name.endsWith('.webp') || item.name.endsWith('.jpg') || item.name.endsWith('.png');
    if (assetFilter.value === 'vector') return item.name.endsWith('.svg');
    return true;
  });
});

const handleDropUpload = () => {
  isDragging.value = false;
  uploadMediaDemo();
};
</script>

<template>
  <section class="fade-in-section">
    <!-- Header -->
    <div class="page-intro-row">
      <div>
        <h1 class="page-title">Media Assets & Storage S3 MinIO</h1>
        <p class="page-desc">Penyimpanan objek S3 multi-region terisolasi dengan auto-optimasi WebP & CDN edge proxy Traefik v3.</p>
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
          <span class="telemetry-label">TOTAL OBJEK MEDIA</span>
          <div class="telemetry-glyph blue"><Layers :size="15" /></div>
        </div>
        <div class="telemetry-val">{{ mediaAssets.length }} File <span class="badge-online">Sync</span></div>
        <div class="telemetry-sub"><span>Otomatis dikompresi ke WebP/AVIF</span></div>
      </div>
    </div>

    <!-- Storage Visual Gauge Breakdown -->
    <div class="pro-panel storage-breakdown-panel">
      <div class="breakdown-header">
        <div class="breakdown-title-group">
          <strong>Distribusi Penyimpanan S3</strong>
          <span>Alokasi kapasitas berdasarkan tipe file</span>
        </div>
        <div class="breakdown-tags">
          <span class="legend-item"><span class="legend-dot blue"></span> Gambar & Foto (84 MB)</span>
          <span class="legend-item"><span class="legend-dot emerald"></span> Vektor & SVG (12 MB)</span>
          <span class="legend-item"><span class="legend-dot purple"></span> Dokumen & PDF (24 MB)</span>
          <span class="legend-item"><span class="legend-dot gray"></span> Bebas (1.88 GB)</span>
        </div>
      </div>
      <div class="multi-seg-track">
        <div class="seg-fill blue" style="width: 4.2%" title="Gambar: 84MB"></div>
        <div class="seg-fill emerald" style="width: 0.6%" title="Vektor: 12MB"></div>
        <div class="seg-fill purple" style="width: 1.2%" title="Dokumen: 24MB"></div>
      </div>
    </div>

    <!-- Futuristic Drag & Drop Upload Zone -->
    <div
      class="upload-dropzone-pro"
      :class="{ dragging: isDragging }"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDropUpload"
      @click="uploadMediaDemo"
    >
      <div class="dropzone-glow-ring"></div>
      <div class="dropzone-content">
        <div class="dropzone-icon-box">
          <UploadCloud :size="28" />
        </div>
        <div class="dropzone-text-group">
          <h3 class="dropzone-heading">Tarik & Lepas File ke Sini atau <span class="text-blue-link">Pilih File</span></h3>
          <p class="dropzone-sub">Mendukung WebP, PNG, JPG, SVG, AVIF, PDF (Maksimal 25MB per file)</p>
        </div>
        <div class="format-badges-row">
          <span class="format-pill">WEBP</span>
          <span class="format-pill">PNG / JPG</span>
          <span class="format-pill">SVG VECTOR</span>
          <span class="format-pill">AUTO RESIZE</span>
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
          placeholder="Cari aset gambar, banner, logo, icon..."
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
          <span>Semua File</span>
          <span class="pill-count">{{ mediaAssets.length }}</span>
        </button>
        <button
          class="segment-pill"
          :class="{ active: assetFilter === 'image' }"
          @click="assetFilter = 'image'"
        >
          <span>Foto & Raster</span>
          <span class="pill-count green">3</span>
        </button>
        <button
          class="segment-pill"
          :class="{ active: assetFilter === 'vector' }"
          @click="assetFilter = 'vector'"
        >
          <span>Vektor SVG</span>
          <span class="pill-count gray">1</span>
        </button>
      </div>
    </div>

    <!-- High-End Media Cards Grid -->
    <div class="media-gallery-grid">
      <div
        v-for="med in filteredMedia"
        :key="med.id"
        class="media-pro-card"
      >
        <!-- Card Visual Preview Area -->
        <div class="media-preview-canvas" :class="'art-' + med.id">
          <!-- Rich Contextual Graphic based on item -->
          <div v-if="med.name.includes('banner')" class="graphic-banner-preview">
            <div class="graphic-code-watermark">
              <code>docker run -d -p 80:80 herocms/tenant</code>
            </div>
            <span class="graphic-tag-badge">HERO BANNER</span>
          </div>
          <div v-else-if="med.name.includes('avatar')" class="graphic-avatar-preview">
            <div class="avatar-ring-glow">
              <div class="avatar-inner-circle">RP</div>
            </div>
          </div>
          <div v-else-if="med.name.includes('traefik')" class="graphic-diagram-preview">
            <div class="infra-nodes-mock">
              <span>Client</span> ➔ <span>Traefik:443</span> ➔ <span>Docker C1</span>
            </div>
          </div>
          <div v-else class="graphic-vector-preview">
            <div class="vector-mark-symbol">◆ HC</div>
          </div>

          <!-- Top Format Chip -->
          <span class="media-type-badge">{{ med.dimensions.includes('Vector') ? 'SVG' : 'WEBP' }}</span>

          <!-- Hover Overlay with Fast Actions -->
          <div class="media-hover-overlay">
            <button
              class="overlay-btn"
              @click.stop="copyToClipboard(med.url, med.id)"
              :title="copiedSubdomain === med.id ? 'Tersalin!' : 'Salin URL CDN'"
            >
              <Check v-if="copiedSubdomain === med.id" :size="14" class="text-green" />
              <Copy v-else :size="14" />
            </button>
            <a :href="med.url" target="_blank" class="overlay-btn" title="Buka File Penuh">
              <ExternalLink :size="14" />
            </a>
            <button class="overlay-btn danger" @click.stop="deleteMedia(med)" title="Hapus File">
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
            <span>{{ med.size }}</span>
            <span class="dot-sep">•</span>
            <span>{{ med.dimensions }}</span>
            <span class="edge-cached-tag">CDN Ready</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
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
  font-size: 0.88rem;
  color: #0f172a;
  display: block;
}

.breakdown-title-group span {
  font-size: 0.74rem;
  color: #64748b;
}

.breakdown-tags {
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 0.72rem;
  color: #475569;
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
.legend-dot.emerald { background: #10b981; }
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
.seg-fill.emerald { background: #10b981; }
.seg-fill.purple { background: #9333ea; }

/* Upload Dropzone */
.upload-dropzone-pro {
  position: relative;
  background: #ffffff;
  border: 1.5px dashed #cbd5e1;
  border-radius: 16px;
  padding: 32px 24px;
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
  width: 52px;
  height: 52px;
  background: #eff6ff;
  color: #2563eb;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 14px;
  transition: transform 0.2s ease;
}

.upload-dropzone-pro:hover .dropzone-icon-box {
  transform: scale(1.08);
}

.dropzone-heading {
  font-size: 0.98rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 4px;
}

.text-blue-link {
  color: #2563eb;
  text-decoration: underline;
}

.dropzone-sub {
  font-size: 0.78rem;
  color: #64748b;
  margin-bottom: 14px;
}

.format-badges-row {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.format-pill {
  font-size: 0.68rem;
  font-weight: 700;
  color: #475569;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  padding: 3px 8px;
  border-radius: 5px;
  letter-spacing: 0.04em;
}

/* Media Grid */
.media-gallery-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
  margin-top: 20px;
}

@media (max-width: 1200px) {
  .media-gallery-grid { grid-template-columns: repeat(2, 1fr); }
}

.media-pro-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.03);
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
}

.media-pro-card:hover {
  transform: translateY(-2px);
  border-color: #cbd5e1;
  box-shadow: 0 12px 24px -6px rgba(15, 23, 42, 0.08);
}

.media-preview-canvas {
  height: 148px;
  position: relative;
  background: #0f172a;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.graphic-banner-preview {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #2563eb 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}

.graphic-code-watermark code {
  font-family: monospace;
  font-size: 0.68rem;
  color: #93c5fd;
  opacity: 0.8;
  background: rgba(0, 0, 0, 0.3);
  padding: 3px 6px;
  border-radius: 4px;
}

.graphic-tag-badge {
  font-size: 0.65rem;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: 0.08em;
  margin-top: 8px;
  background: rgba(255, 255, 255, 0.15);
  padding: 2px 8px;
  border-radius: 999px;
}

.graphic-avatar-preview {
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, #1e293b 0%, #09090b 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-ring-glow {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2563eb, #9333ea);
  padding: 3px;
  box-shadow: 0 0 20px rgba(37, 99, 235, 0.35);
}

.avatar-inner-circle {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #0f172a;
  color: #ffffff;
  font-weight: 700;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.graphic-diagram-preview {
  width: 100%;
  height: 100%;
  background: #020617;
  display: flex;
  align-items: center;
  justify-content: center;
}

.infra-nodes-mock {
  font-family: monospace;
  font-size: 0.65rem;
  color: #38bdf8;
  background: rgba(15, 23, 42, 0.7);
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid rgba(56, 189, 248, 0.2);
}

.graphic-vector-preview {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #09090b 0%, #18181b 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.vector-mark-symbol {
  font-size: 1.2rem;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: 0.05em;
  border: 1.5px solid rgba(255, 255, 255, 0.3);
  padding: 6px 14px;
  border-radius: 8px;
}

.media-type-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 0.62rem;
  font-weight: 800;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  color: #ffffff;
  padding: 2px 7px;
  border-radius: 4px;
  letter-spacing: 0.06em;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.media-hover-overlay {
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  opacity: 0;
  transition: opacity 0.18s ease;
}

.media-preview-canvas:hover .media-hover-overlay {
  opacity: 1;
}

.overlay-btn {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: #ffffff;
  color: #0f172a;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s ease, background-color 0.15s ease;
}

.overlay-btn:hover {
  transform: scale(1.1);
  background: #f8fafc;
}

.overlay-btn.danger {
  color: #ef4444;
}

.overlay-btn.danger:hover {
  background: #fef2f2;
}

.media-info-block {
  padding: 12px 14px;
  background: #ffffff;
}

.media-title-line {
  font-size: 0.84rem;
  font-weight: 600;
  color: #0f172a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 4px;
}

.media-sub-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.72rem;
  color: #64748b;
}

.dot-sep {
  color: #cbd5e1;
}

.edge-cached-tag {
  font-size: 0.65rem;
  font-weight: 700;
  color: #059669;
  background: #ecfdf5;
  padding: 1px 5px;
  border-radius: 3px;
  margin-left: auto;
}
</style>
