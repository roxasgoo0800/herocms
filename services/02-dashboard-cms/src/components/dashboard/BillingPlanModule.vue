<script setup lang="ts">
import {
  Plus
} from 'lucide-vue-next';
import { useDashboardData } from '../../composables/useDashboardData';

const {
  userPlan,
  usedContainersCount,
  showToast
} = useDashboardData();
</script>

<template>
  <section class="fade-in-section">
    <div class="page-intro-row">
      <div>
        <h1 class="page-title">Paket Langganan & Billing</h1>
        <p class="page-desc">Kelola kapasitas kontainer Docker, batas resource CPU/RAM, dan opsi penambahan kuota on-demand.</p>
      </div>
    </div>

    <div class="billing-two-col">
      <div class="pro-panel">
        <div class="plan-summary-row">
          <div>
            <span class="plan-active-tag">PAKET AKTIF SAAT INI</span>
            <h2 class="plan-h2">{{ userPlan.name }}</h2>
            <span class="plan-cost">{{ userPlan.price }}</span>
          </div>
          <button class="btn-top-create" @click="showToast('Permintaan upgrade telah dicatat!', 'info')">
            Upgrade Paket
          </button>
        </div>

        <div class="plan-resource-list">
          <div class="resource-row">
            <span>Slot Kontainer Docker</span>
            <strong>{{ usedContainersCount }} dari {{ userPlan.maxContainers }} Terpakai</strong>
          </div>
          <div class="resource-row">
            <span>Batas CPU per Kontainer</span>
            <strong>{{ userPlan.cpuPerContainer }} (Dedicated Limit)</strong>
          </div>
          <div class="resource-row">
            <span>Batas RAM per Kontainer</span>
            <strong>{{ userPlan.ramPerContainer }} (cgroups v2)</strong>
          </div>
          <div class="resource-row">
            <span>Penyimpanan Media S3</span>
            <strong>120 MB / {{ userPlan.storageQuota }}</strong>
          </div>
        </div>
      </div>

      <div class="pro-panel addon-panel">
        <h3>Tambah Slot Kontainer On-Demand</h3>
        <p>Tambah slot kontainer tanpa mengganti paket utama Anda.</p>
        <div class="addon-price-tag">
          <div class="addon-title">+1 Slot Kontainer</div>
          <div class="addon-sub">Rp 49.000 / bulan</div>
        </div>
        <button
          class="btn-add-slot"
          @click="userPlan.maxContainers += 1; showToast(`Kuota Anda telah bertambah menjadi ${userPlan.maxContainers} kontainer!`, 'success')"
        >
          <Plus :size="15" />
          <span>Tambah +1 Kontainer Sekarang</span>
        </button>
      </div>
    </div>
  </section>
</template>
