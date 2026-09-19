<script setup lang="ts">
import {
  HardDrive,
  Plus,
  Copy,
  Trash2
} from 'lucide-vue-next';
import { useDashboardData } from '../../composables/useDashboardData';

const {
  mediaAssets,
  uploadMediaDemo,
  deleteMedia,
  copyToClipboard
} = useDashboardData();
</script>

<template>
  <section class="fade-in-section">
    <div class="page-intro-row">
      <div>
        <h1 class="page-title">Media Assets & Storage S3</h1>
        <p class="page-desc">Penyimpanan aset gambar & dokumen terdistribusi via S3 bucket dan Traefik CDN edge cache.</p>
      </div>
      <button class="btn-top-create" @click="uploadMediaDemo">
        <Plus :size="15" />
        <span>Unggah Media Baru</span>
      </button>
    </div>

    <!-- Storage Usage Card -->
    <div class="pro-panel storage-metric-panel">
      <div class="storage-info-row">
        <div class="storage-text-block">
          <strong>Kapasitas Penyimpanan S3 Bucket</strong>
          <span>120 MB dari 2 GB (SSD Storage Quota) terpakai</span>
        </div>
        <div class="storage-pct">6% Digunakan</div>
      </div>
      <div class="storage-prog-track">
        <div class="storage-prog-fill" style="width: 6%"></div>
      </div>
    </div>

    <!-- Media Assets Grid -->
    <div class="media-assets-grid">
      <div v-for="med in mediaAssets" :key="med.id" class="media-card">
        <div class="media-thumb-box">
          <HardDrive :size="28" style="color: #71717a;" />
        </div>
        <div class="media-meta-box">
          <div>
            <span class="media-name-txt" :title="med.name">{{ med.name }}</span>
            <span class="media-detail-txt">{{ med.size }} • {{ med.dimensions }}</span>
          </div>
          <div class="row-actions">
            <button class="btn-action-icon" @click="copyToClipboard(med.url, med.id)" title="Salin URL CDN">
              <Copy :size="12" />
            </button>
            <button class="btn-action-icon danger" @click="deleteMedia(med)" title="Hapus File">
              <Trash2 :size="12" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
