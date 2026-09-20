<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  CreditCard,
  Plus,
  Minus,
  Sparkles,
  Server,
  Zap,
  HardDrive,
  Cpu,
  Layers,
  ChevronRight
} from 'lucide-vue-next';
import { useDashboardData } from '../../composables/useDashboardData';

const router = useRouter();

const {
  userPlan,
  usedContainersCount,
  showToast
} = useDashboardData();

const addonSlotQty = ref(1);

const incrementAddon = () => {
  if (addonSlotQty.value < 10) addonSlotQty.value++;
};

const decrementAddon = () => {
  if (addonSlotQty.value > 1) addonSlotQty.value--;
};

const handleBuyAddon = () => {
  userPlan.value.maxContainers += addonSlotQty.value;
  showToast(`Berhasil menambahkan ${addonSlotQty.value} slot kontainer! Kuota kini ${userPlan.value.maxContainers} kontainer.`, 'success');
  addonSlotQty.value = 1;
};
</script>

<template>
  <section class="fade-in-section">
    <!-- Header -->
    <div class="page-intro-row">
      <div>
        <h1 class="page-title">Kapasitas Runtime & Paket Langganan</h1>
        <p class="page-desc">Kelola kuota kontainer Docker mandiri, alokasi CPU/RAM cgroups v2, dan ekspansi slot on-demand.</p>
      </div>
      <div class="quota-quick-pills">
        <span class="pill-metric">Billing Cycle: <strong>Bulanan (Perpanjangan Otomatis)</strong></span>
        <span class="pill-metric-highlight">Metode: <strong>Visa •••• 4242</strong></span>
      </div>
    </div>

    <!-- Main 2-Column Grid -->
    <div class="billing-hero-grid">
      <!-- Left: Active Subscription & Resource Quota Cards -->
      <div class="billing-left-stack">
        <!-- 1. Plan Banner Card -->
        <div class="pro-panel plan-banner-card">
          <div class="plan-banner-top">
            <div class="plan-title-block">
              <span class="plan-status-pill">
                <span class="pulse-mini-dot"></span>
                PAKET AKTIF SAAT INI
              </span>
              <h2 class="plan-name-headline">{{ userPlan.name }}</h2>
              <p class="plan-tagline">Arsitektur multi-tenant dengan isolasi kernel cgroups v2 dan proxy Traefik SSL.</p>
            </div>
            <div class="plan-price-block">
              <div class="plan-rate">{{ userPlan.price }}</div>
              <span class="plan-period">Tagihan berikutnya: 12 Oktober 2026</span>
              <button @click="router.push('/onboarding')" class="btn-upgrade-action">
                <Sparkles :size="13" />
                <span>Upgrade / Ganti Paket</span>
              </button>
            </div>
          </div>

          <div class="plan-meta-footer">
            <div class="payment-method-strip">
              <div class="card-chip-icon">
                <CreditCard :size="16" />
              </div>
              <div class="card-details-txt">
                <strong>Visa Card berakhir •••• 4242</strong>
                <span>Kadaluarsa 08/28 • Default Billing Method</span>
              </div>
            </div>
            <button class="btn-change-payment" @click="showToast('Portal manajemen kartu Midtrans/Stripe dibuka.', 'info')">
              Ubah Kartu
            </button>
          </div>
        </div>

        <!-- 2. Interactive Resource Quota Meter Grid -->
        <div class="pro-panel resource-quotas-card">
          <div class="card-sec-head">
            <h3>ALOKASI RESOURCE RUNTIME AKTIF</h3>
            <span class="cgroups-tag">Linux cgroups v2 Enforced</span>
          </div>

          <div class="quota-meters-list">
            <!-- Slot Kontainer -->
            <div class="quota-item-box">
              <div class="quota-item-top">
                <div class="item-name-group">
                  <div class="item-glyph blue"><Layers :size="14" /></div>
                  <div>
                    <strong>Slot Kontainer Docker</strong>
                    <span>Runtime mandiri per tenant</span>
                  </div>
                </div>
                <div class="item-val-badge">
                  <strong>{{ usedContainersCount }}</strong> / {{ userPlan.maxContainers }} Terpakai
                </div>
              </div>
              <div class="slot-blocks-row">
                <div
                  v-for="idx in userPlan.maxContainers"
                  :key="idx"
                  class="slot-block"
                  :class="{ filled: idx <= usedContainersCount }"
                >
                  <span v-if="idx <= usedContainersCount">Node #{{ idx }} (Aktif)</span>
                  <span v-else>Slot #{{ idx }} (Tersedia)</span>
                </div>
              </div>
            </div>

            <!-- CPU Limits -->
            <div class="quota-item-box">
              <div class="quota-item-top">
                <div class="item-name-group">
                  <div class="item-glyph emerald"><Cpu :size="14" /></div>
                  <div>
                    <strong>Batas Alokasi CPU per Kontainer</strong>
                    <span>Dedicated CFS scheduler quota</span>
                  </div>
                </div>
                <div class="item-val-badge">
                  <strong>{{ userPlan.cpuPerContainer }}</strong> (Dedicated Quota)
                </div>
              </div>
              <div class="prog-track-thin">
                <div class="prog-fill-thin emerald" style="width: 50%"></div>
              </div>
            </div>

            <!-- RAM Limits -->
            <div class="quota-item-box">
              <div class="quota-item-top">
                <div class="item-name-group">
                  <div class="item-glyph purple"><Zap :size="14" /></div>
                  <div>
                    <strong>Batas Memori RAM per Kontainer</strong>
                    <span>cgroups v2 hard limit OOM protection</span>
                  </div>
                </div>
                <div class="item-val-badge">
                  <strong>{{ userPlan.ramPerContainer }}</strong> / Kontainer
                </div>
              </div>
              <div class="prog-track-thin">
                <div class="prog-fill-thin purple" style="width: 35%"></div>
              </div>
            </div>

            <!-- S3 Object Storage -->
            <div class="quota-item-box">
              <div class="quota-item-top">
                <div class="item-name-group">
                  <div class="item-glyph blue"><HardDrive :size="14" /></div>
                  <div>
                    <strong>Penyimpanan Media MinIO S3</strong>
                    <span>SSD NVMe multi-region bucket</span>
                  </div>
                </div>
                <div class="item-val-badge">
                  <strong>120 MB</strong> / {{ userPlan.storageQuota }} (6%)
                </div>
              </div>
              <div class="prog-track-thin">
                <div class="prog-fill-thin blue" style="width: 6%"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: On-Demand Container Slot Expansion -->
      <div class="billing-right-stack">
        <!-- 1. Add-on Slot Machine Card -->
        <div class="pro-panel addon-expansion-card">
          <div class="addon-badge">
            <Sparkles :size="12" />
            <span>EKSPANSI INSTAN</span>
          </div>
          <h3 class="addon-card-title">Tambah Slot Kontainer On-Demand</h3>
          <p class="addon-card-desc">
            Kembangkan bisnis tanpa perlu upgrade seluruh paket. Tiap slot kontainer tambahan mendapatkan CPU, RAM, dan rute SSL mandiri.
          </p>

          <div class="slot-calculator-box">
            <span class="calc-label">PILIH JUMLAH SLOT:</span>
            <div class="slot-stepper-row">
              <button class="btn-step" @click="decrementAddon" :disabled="addonSlotQty <= 1">
                <Minus :size="14" />
              </button>
              <div class="stepper-val">
                <strong>+{{ addonSlotQty }}</strong>
                <span>Slot Kontainer</span>
              </div>
              <button class="btn-step" @click="incrementAddon" :disabled="addonSlotQty >= 10">
                <Plus :size="14" />
              </button>
            </div>

            <div class="price-calc-summary">
              <div class="calc-row">
                <span>Biaya tambahan:</span>
                <strong>Rp {{ (addonSlotQty * 49000).toLocaleString('id-ID') }} / bln</strong>
              </div>
              <div class="calc-row-sub">
                <span>Total kapasitas baru:</span>
                <strong>{{ userPlan.maxContainers + addonSlotQty }} Kontainer Aktif</strong>
              </div>
            </div>

            <button class="btn-confirm-addon" @click="handleBuyAddon">
              <Plus :size="15" />
              <span>Tambah +{{ addonSlotQty }} Slot Sekarang</span>
            </button>
          </div>
        </div>

        <!-- 2. Enterprise Cluster Callout -->
        <div class="pro-panel enterprise-tier-card">
          <div class="ent-header">
            <Server :size="20" color="#2563eb" />
            <div>
              <h4>Hero Enterprise Cluster</h4>
              <span>Butuh >10 kontainer atau dedicated VPS?</span>
            </div>
          </div>
          <p class="ent-desc">
            Dapatkan node dedicated Kubernetes / Docker Swarm dengan IP statis terpisah, SLA 99.99%, dan audit kepatuhan ISO 27001.
          </p>
          <button class="btn-contact-sales" @click="showToast('Tim Sales Enterprise akan menghubungi email Anda.', 'info')">
            <span>Konsultasi Dedicated Node</span>
            <ChevronRight :size="14" />
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
