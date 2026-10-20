<script setup lang="ts">
import { ref, computed } from 'vue';
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
  ChevronRight,
  CheckCircle2,
  Check,
  X,
  ShieldCheck,
  Calculator,
  ArrowRight
} from 'lucide-vue-next';
import { useDashboardData } from '../../composables/useDashboardData';
import type { SubscriptionPlanCatalogItem, ContainerSite } from '../../types/dashboard';

const {
  userPlan,
  usedContainersCount,
  containers,
  subscriptionPlansCatalog,
  changeUserPlan,
  activeContainerId,
  activeMenu,
  openCreateModal,
  showToast
} = useDashboardData();

// Subnav Tab State: 'allocation' | 'plans' | 'calculator'
const activeTab = ref<'allocation' | 'plans' | 'calculator'>('allocation');

// Billing Cycle Toggle for Plans Tab: 'monthly' | 'annual'
const billingCycle = ref<'monthly' | 'annual'>('monthly');

// Addon Slot Machine State
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

// Modals State
const isUpgradeModalOpen = ref(false);
const selectedTargetPlan = ref<SubscriptionPlanCatalogItem | null>(null);
const selectedPaymentMethod = ref('visa');

const isPaymentModalOpen = ref(false);
const activeBillingCard = ref('Visa Card •••• 4242');

const openUpgradeModal = (plan: SubscriptionPlanCatalogItem) => {
  selectedTargetPlan.value = plan;
  isUpgradeModalOpen.value = true;
};

const confirmUpgradePlan = () => {
  if (!selectedTargetPlan.value) return;
  changeUserPlan(selectedTargetPlan.value.id);
  isUpgradeModalOpen.value = false;
};

const savePaymentMethod = () => {
  isPaymentModalOpen.value = false;
  showToast(`Metode pembayaran default diperbarui ke '${activeBillingCard.value}'.`, 'success');
};

const handleManageContainer = (container: ContainerSite) => {
  activeContainerId.value = container.id;
  activeMenu.value = 'containers';
};

const handleDeployVacant = () => {
  openCreateModal();
};

// Custom Cluster Simulator State
const simContainers = ref(3);
const simCpu = ref('0.5');
const simRam = ref('512');
const simStorage = ref(5);

const simulatedCost = computed(() => {
  const base = 49000;
  const extraContainers = Math.max(0, simContainers.value - 1) * 35000;
  const cpuFactor = parseFloat(simCpu.value) * 60000;
  const ramFactor = (parseInt(simRam.value) / 256) * 25000;
  const storageFactor = Math.max(0, simStorage.value - 1) * 5000;

  const subtotal = Math.round(base + extraContainers + cpuFactor + ramFactor + storageFactor);
  const tax = Math.round(subtotal * 0.11);
  const total = subtotal + tax;

  return { subtotal, tax, total };
});
</script>

<template>
  <section class="fade-in-section">
    <!-- Header Page Intro Row -->
    <div class="page-intro-row">
      <div>
        <h1 class="page-title">Kapasitas Runtime & Paket Langganan</h1>
        <p class="page-desc">
          Pantau alokasi cgroups v2 kernel kontainer, manajemen paket multi-tenant, dan kalkulasi ekspansi sumber daya on-demand.
        </p>
      </div>
      <div class="quota-quick-pills">
        <span class="pill-metric">Kernel: <strong>cgroups v2 Enforced</strong></span>
        <span class="pill-metric-highlight">Billing: <strong>{{ activeBillingCard }}</strong></span>
      </div>
    </div>

    <!-- Sub-Navigation Tabs Bar -->
    <div class="api-subnav-bar">
      <button
        class="api-subnav-tab"
        :class="{ active: activeTab === 'allocation' }"
        @click="activeTab = 'allocation'"
      >
        <Layers :size="15" />
        <span>Alokasi Runtime & Kapasitas Pod</span>
        <span class="tab-badge-pill">{{ usedContainersCount }}/{{ userPlan.maxContainers }} Pods</span>
      </button>

      <button
        class="api-subnav-tab"
        :class="{ active: activeTab === 'plans' }"
        @click="activeTab = 'plans'"
      >
        <Sparkles :size="15" />
        <span>Katalog Paket Langganan & Upgrade</span>
        <span class="tab-badge-pill">3 Pilihan Paket</span>
      </button>

      <button
        class="api-subnav-tab"
        :class="{ active: activeTab === 'calculator' }"
        @click="activeTab = 'calculator'"
      >
        <Calculator :size="15" />
        <span>Kalkulator Simulasi Resource Kustom</span>
      </button>
    </div>

    <!-- 4 Commercial & Telemetry Cards Cluster (Always Eye-Catching) -->
    <div class="stats-overview-grid" style="margin-bottom: 22px;">
      <!-- Card 1: Slot Kontainer -->
      <div class="telemetry-card accent-blue">
        <div class="telemetry-corner-watermark blue"><Layers :size="58" /></div>
        <div class="telemetry-top">
          <span class="telemetry-label">KUOTA SLOT KONTAINER</span>
        </div>
        <div class="telemetry-val">
          {{ usedContainersCount }} / {{ userPlan.maxContainers }} Pods
          <span class="badge-online">
            {{ userPlan.maxContainers - usedContainersCount }} Slot Tersedia
          </span>
        </div>
        <div class="telemetry-sub">
          <span>Runtime mandiri per tenant dengan isolasi cgroups v2</span>
        </div>
      </div>

      <!-- Card 2: Dedicated CPU -->
      <div class="telemetry-card accent-emerald">
        <div class="telemetry-corner-watermark emerald"><Cpu :size="58" /></div>
        <div class="telemetry-top">
          <span class="telemetry-label">ALOKASI CPU TERDEDIKASI</span>
        </div>
        <div class="telemetry-val">
          {{ userPlan.cpuPerContainer }}
          <span class="badge-online">Zero Noisy Neighbor</span>
        </div>
        <div class="telemetry-sub">
          <span>Dedicated CFS Scheduler hard quota per kontainer</span>
        </div>
      </div>

      <!-- Card 3: RAM Memory -->
      <div class="telemetry-card accent-purple">
        <div class="telemetry-corner-watermark purple"><Zap :size="58" /></div>
        <div class="telemetry-top">
          <span class="telemetry-label">BATAS MEMORI RAM CGROUPS V2</span>
        </div>
        <div class="telemetry-val">
          {{ userPlan.ramPerContainer }}
          <span class="badge-online">OOM Protection</span>
        </div>
        <div class="telemetry-sub">
          <span>cgroups v2 hard limit mencegah server overload</span>
        </div>
      </div>

      <!-- Card 4: S3 NVMe Storage -->
      <div class="telemetry-card accent-amber">
        <div class="telemetry-corner-watermark amber"><HardDrive :size="58" /></div>
        <div class="telemetry-top">
          <span class="telemetry-label">NVME S3 MEDIA STORAGE</span>
        </div>
        <div class="telemetry-val">
          120 MB <span style="font-size: 13px; color: #64748b; font-weight: 600;">/ {{ userPlan.storageQuota }}</span>
          <span class="badge-online">6% Terpakai</span>
        </div>
        <div class="telemetry-sub">
          <span>SSD Multi-Region Jakarta (MinIO Object Store)</span>
        </div>
      </div>
    </div>

    <!-- ================================================================= -->
    <!-- TAB 1: ALOKASI RUNTIME & STATUS POD -->
    <!-- ================================================================= -->
    <div v-if="activeTab === 'allocation'" class="billing-hero-grid">
      <!-- Left Column: Active Plan Crown Card & Pod Topology Visualizer -->
      <div class="billing-left-stack">
        <!-- 1. The Crown Jewel Active Plan Card -->
        <div class="plan-crown-card">
          <div class="plan-banner-top">
            <div class="plan-title-block">
              <span class="plan-crown-badge">
                <span class="pulse-mini-dot"></span>
                PAKET AKTIF SAAT INI • {{ userPlan.name }}
              </span>
              <h2 class="plan-name-headline">{{ userPlan.name }}</h2>
              <p class="plan-tagline">
                Arsitektur multi-tenant mandiri dengan isolasi kernel cgroups v2, Traefik v3 HTTP/3 edge routing, dan automasi SSL TLS 1.3 Let's Encrypt.
              </p>
            </div>

            <div class="plan-price-block">
              <div class="plan-rate">{{ userPlan.price }}</div>
              <span class="plan-period">Tagihan berikutnya: 12 November 2026</span>
              <button @click="activeTab = 'plans'" class="btn-upgrade-action">
                <Sparkles :size="13" />
                <span>Ganti / Upgrade Paket</span>
              </button>
            </div>
          </div>

          <!-- Feature Capsules Strip -->
          <div class="plan-crown-features">
            <span class="plan-feature-capsule">
              <Check :size="12" />
              <span>{{ userPlan.maxContainers }} Kontainer Docker Otonom</span>
            </span>
            <span class="plan-feature-capsule">
              <Check :size="12" />
              <span>Traefik v3 HTTP/3 & SSL Wildcard</span>
            </span>
            <span class="plan-feature-capsule">
              <Check :size="12" />
              <span>Dedicated CFS CPU {{ userPlan.cpuPerContainer }}</span>
            </span>
            <span class="plan-feature-capsule">
              <Check :size="12" />
              <span>cgroups v2 RAM {{ userPlan.ramPerContainer }}</span>
            </span>
            <span class="plan-feature-capsule">
              <Check :size="12" />
              <span>Scoped Webhooks & REST API</span>
            </span>
          </div>

          <!-- Bottom Card Meta: Payment Strip & Side-by-Side Actions -->
          <div class="plan-meta-footer">
            <div class="payment-method-strip">
              <div class="card-chip-icon">
                <CreditCard :size="16" />
              </div>
              <div class="card-details-txt">
                <strong>{{ activeBillingCard }}</strong>
                <span>Kadaluarsa 08/28 • Default Billing Method (Auto-Renew)</span>
              </div>
            </div>

            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: nowrap !important;">
              <button class="btn-change-payment" @click="isPaymentModalOpen = true">
                Ubah Kartu
              </button>
              <button class="btn-change-payment" @click="activeMenu = 'invoices'">
                Lihat Faktur
              </button>
            </div>
          </div>
        </div>

        <!-- 2. Interactive Pod Topology (Visual Slot Node Map) -->
        <div class="pro-panel pod-topology-section">
          <div class="pod-topology-head">
            <div>
              <h3 class="pod-topology-title">
                <Layers :size="15" style="color: #2563eb;" />
                <span>PETA TOPOLOGI NODE & ALOKASI SLOT ({{ usedContainersCount }}/{{ userPlan.maxContainers }} SLOTS)</span>
              </h3>
              <p class="pod-topology-sub">
                Setiap slot dialokasikan namespace Docker terisolasi, cgroups CPU/RAM limiter, dan dynamic Traefik domain router.
              </p>
            </div>
            <span class="cgroups-tag">Linux cgroups v2 Enforced</span>
          </div>

          <div class="pod-topology-grid">
            <!-- Render Occupied Slots -->
            <div
              v-for="cnt in containers"
              :key="cnt.id"
              class="pod-slot-card occupied"
            >
              <div>
                <div class="pod-slot-top">
                  <span
                    class="pod-status-chip"
                    :class="cnt.status === 'running' ? 'running' : 'stopped'"
                  >
                    <span class="status-dot"></span>
                    {{ cnt.status === 'running' ? 'Running' : cnt.status }}
                  </span>
                  <span style="font-size: 11px; font-weight: 700; color: #64748b; font-family: ui-monospace, monospace;">
                    {{ cnt.id }}
                  </span>
                </div>

                <h4 class="pod-site-name" :title="cnt.name">{{ cnt.name }}</h4>
                <span class="pod-site-domain">{{ cnt.customDomain || cnt.subdomain }}</span>

                <div class="pod-metrics-bar">
                  <span>CPU: <strong>{{ cnt.cpuUsage }}%</strong></span>
                  <span>RAM: <strong>{{ cnt.ramUsage }}MB / {{ cnt.ramLimit }}MB</strong></span>
                </div>
              </div>

              <button
                type="button"
                class="btn-pod-manage"
                @click="handleManageContainer(cnt)"
              >
                <span>Kelola Kontainer Ini</span>
                <ChevronRight :size="12" />
              </button>
            </div>

            <!-- Render Vacant Available Slots -->
            <div
              v-for="idx in Math.max(0, userPlan.maxContainers - containers.length)"
              :key="`vacant-${idx}`"
              class="pod-slot-card vacant"
            >
              <div style="width: 38px; height: 38px; border-radius: 10px; background: #eff6ff; color: #2563eb; display: flex; align-items: center; justify-content: center; margin-bottom: 8px;">
                <Plus :size="18" />
              </div>
              <h4 style="font-size: 13.5px; font-weight: 700; color: #0f172a; margin: 0 0 4px 0;">
                Slot #{{ containers.length + idx }} Siap Pakai
              </h4>
              <p style="font-size: 11.5px; color: #64748b; margin: 0 0 10px 0; max-width: 220px;">
                Slot kontainer kosong dalam kuota langganan Anda. Siap untuk deploy website baru.
              </p>
              <button
                type="button"
                class="btn-vacant-deploy"
                @click="handleDeployVacant"
              >
                <Plus :size="13" />
                <span>Deploy Situs Baru</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Add-on Slot Machine & Enterprise Callout -->
      <div class="billing-right-stack">
        <!-- 1. Add-on Slot Machine Card -->
        <div class="pro-panel addon-expansion-card">
          <div class="addon-badge">
            <Sparkles :size="12" />
            <span>EKSPANSI INSTAN</span>
          </div>
          <h3 class="addon-card-title">Tambah Slot Kontainer On-Demand</h3>
          <p class="addon-card-desc">
            Kembangkan portofolio tanpa perlu upgrade seluruh paket. Tiap slot kontainer tambahan mendapatkan dedicated CPU, RAM, dan rute SSL Traefik mandiri.
          </p>

          <div class="slot-calculator-box">
            <span class="calc-label">PILIH JUMLAH SLOT TAMBAHAN:</span>
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

        <!-- 2. Enterprise Dedicated Cluster Callout -->
        <div class="pro-panel enterprise-tier-card">
          <div class="ent-header">
            <Server :size="20" color="#2563eb" />
            <div>
              <h4>Hero Enterprise Dedicated Cluster</h4>
              <span>Butuh >10 kontainer atau dedicated VPS?</span>
            </div>
          </div>
          <p class="ent-desc">
            Dapatkan node dedicated Kubernetes / Docker Swarm dengan IP statis terpisah, SLA 99.99%, audit kepatuhan ISO 27001, dan dukungan teknis 24/7 dedicated.
          </p>
          <button class="btn-contact-sales" @click="showToast('Tim Sales Enterprise akan menghubungi email Anda.', 'info')">
            <span>Konsultasi Dedicated Node</span>
            <ChevronRight :size="14" />
          </button>
        </div>
      </div>
    </div>

    <!-- ================================================================= -->
    <!-- TAB 2: KATALOG PAKET LANGGANAN & UPGRADE -->
    <!-- ================================================================= -->
    <div v-else-if="activeTab === 'plans'" class="plans-explorer-container">
      <!-- Billing Cycle Toggle Switch -->
      <div class="billing-cycle-toggle-wrapper">
        <span style="font-size: 13px; font-weight: 700; color: #0f172a;">Siklus Penagihan:</span>
        <div class="billing-toggle-pill">
          <button
            class="btn-cycle-tab"
            :class="{ active: billingCycle === 'monthly' }"
            @click="billingCycle = 'monthly'"
          >
            <span>Bulanan (Monthly)</span>
          </button>
          <button
            class="btn-cycle-tab"
            :class="{ active: billingCycle === 'annual' }"
            @click="billingCycle = 'annual'"
          >
            <span>Tahunan (Annual)</span>
            <span class="discount-badge-bubble">Hemat 20%</span>
          </button>
        </div>
      </div>

      <!-- 3-Tier Responsive Pricing Matrix -->
      <div class="pricing-tier-grid">
        <div
          v-for="plan in subscriptionPlansCatalog"
          :key="plan.id"
          class="pricing-tier-card"
          :class="{ featured: plan.isPopular }"
        >
          <!-- Featured Ribbon -->
          <div v-if="plan.isPopular" class="pricing-featured-ribbon">
            <Sparkles :size="12" />
            <span>Paling Populer & Paket Anda</span>
          </div>

          <div>
            <span class="tier-badge">{{ plan.badge }}</span>
            <h3 class="tier-name">{{ plan.name }}</h3>
            <p class="tier-tagline">{{ plan.tagline }}</p>

            <div class="tier-price-row">
              <span class="tier-price-number">
                {{ billingCycle === 'monthly' ? plan.priceMonthlyFormatted : plan.priceAnnualFormatted }}
              </span>
              <span class="tier-price-period">
                {{ billingCycle === 'monthly' ? '/ bulan' : '/ bln (ditagih tahunan)' }}
              </span>
            </div>

            <!-- Hardware Specs Grid -->
            <div class="tier-specs-grid">
              <div class="tier-spec-chip">
                <Server :size="12" />
                <span>{{ plan.containers }} Kontainer</span>
              </div>
              <div class="tier-spec-chip">
                <Cpu :size="12" />
                <span>{{ plan.cpu }}</span>
              </div>
              <div class="tier-spec-chip">
                <Zap :size="12" />
                <span>{{ plan.ram }}</span>
              </div>
              <div class="tier-spec-chip">
                <HardDrive :size="12" />
                <span>{{ plan.storage }}</span>
              </div>
            </div>

            <!-- Features Checklist -->
            <ul class="tier-features-list">
              <li v-for="(feat, idx) in plan.features" :key="idx">
                <CheckCircle2 :size="14" />
                <span>{{ feat }}</span>
              </li>
            </ul>
          </div>

          <!-- Bottom Action Button -->
          <div style="margin-top: 14px;">
            <button
              v-if="userPlan.name.toLowerCase().includes(plan.name.toLowerCase())"
              disabled
              class="btn-plan-active"
            >
              <Check :size="13" />
              <span>Paket Anda Saat Ini</span>
            </button>
            <button
              v-else
              class="btn-plan-select"
              @click="openUpgradeModal(plan)"
            >
              <span>Pilih / Beralih ke Paket Ini</span>
              <ChevronRight :size="13" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ================================================================= -->
    <!-- TAB 3: KALKULATOR SIMULASI RESOURCE KUSTOM -->
    <!-- ================================================================= -->
    <div v-else-if="activeTab === 'calculator'" class="calculator-simulator-card">
      <div class="card-sec-head" style="margin-bottom: 20px;">
        <div>
          <h3 style="font-size: 15px; font-weight: 800; color: #0f172a; margin: 0 0 4px 0;">
            Kalkulator Simulasi Resource Cluster Kustom
          </h3>
          <p style="font-size: 12.5px; color: #64748b; margin: 0;">
            Hitung perkiraan biaya spesifikasi khusus jika Anda membutuhkan konfigurasi di luar paket standar.
          </p>
        </div>
        <span class="cgroups-tag">Dynamic Estimation</span>
      </div>

      <div class="sim-sliders-grid">
        <!-- Slider 1: Jumlah Kontainer -->
        <div class="sim-slider-box">
          <div class="sim-slider-top">
            <span class="sim-slider-label"><Server :size="14" style="color: #2563eb;" /> Jumlah Kontainer</span>
            <span class="sim-slider-value">{{ simContainers }} Kontainer</span>
          </div>
          <input
            v-model.number="simContainers"
            type="range"
            min="1"
            max="25"
            step="1"
            class="sim-range-input"
          />
          <span style="font-size: 11px; color: #94a3b8; display: block; margin-top: 4px;">1 s/d 25 pod kontainer</span>
        </div>

        <!-- Slider 2: CPU Limit -->
        <div class="sim-slider-box">
          <div class="sim-slider-top">
            <span class="sim-slider-label"><Cpu :size="14" style="color: #059669;" /> Dedicated CPU per Kontainer</span>
            <span class="sim-slider-value">{{ simCpu }} vCPU</span>
          </div>
          <input
            v-model="simCpu"
            type="range"
            min="0.25"
            max="2.0"
            step="0.25"
            class="sim-range-input"
          />
          <span style="font-size: 11px; color: #94a3b8; display: block; margin-top: 4px;">0.25 s/d 2.0 dedicated vCPU</span>
        </div>

        <!-- Slider 3: RAM Limit -->
        <div class="sim-slider-box">
          <div class="sim-slider-top">
            <span class="sim-slider-label"><Zap :size="14" style="color: #9333ea;" /> RAM cgroups v2 per Kontainer</span>
            <span class="sim-slider-value">{{ simRam }} MB</span>
          </div>
          <input
            v-model="simRam"
            type="range"
            min="256"
            max="4096"
            step="256"
            class="sim-range-input"
          />
          <span style="font-size: 11px; color: #94a3b8; display: block; margin-top: 4px;">256 MB s/d 4096 MB (4 GB)</span>
        </div>

        <!-- Slider 4: NVMe S3 Storage -->
        <div class="sim-slider-box">
          <div class="sim-slider-top">
            <span class="sim-slider-label"><HardDrive :size="14" style="color: #d97706;" /> NVMe S3 Media Storage</span>
            <span class="sim-slider-value">{{ simStorage }} GB NVMe</span>
          </div>
          <input
            v-model.number="simStorage"
            type="range"
            min="1"
            max="100"
            step="1"
            class="sim-range-input"
          />
          <span style="font-size: 11px; color: #94a3b8; display: block; margin-top: 4px;">1 GB s/d 100 GB NVMe Storage</span>
        </div>
      </div>

      <!-- Cost Calculation Result Summary Strip -->
      <div class="sim-cost-summary-box">
        <div class="sim-cost-left">
          <span class="sim-cost-label">ESTIMASI BIAYA RUNTIME BULANAN:</span>
          <div class="sim-cost-total">
            Rp {{ simulatedCost.total.toLocaleString('id-ID') }}
            <span style="font-size: 13px; color: #94a3b8; font-weight: 500;">/ bulan</span>
          </div>
          <span class="sim-cost-breakdown">
            Subtotal: Rp {{ simulatedCost.subtotal.toLocaleString('id-ID') }} • PPN 11%: Rp {{ simulatedCost.tax.toLocaleString('id-ID') }}
          </span>
        </div>

        <button
          type="button"
          class="btn-primary-gradient"
          @click="showToast(`Konfigurasi kluster custom (${simContainers} Kontainer, ${simCpu} vCPU, ${simRam}MB RAM) disimpan. Tim Solutions Engineer akan mengonfirmasi via email.`, 'success')"
        >
          <Sparkles :size="14" />
          <span>Ajukan Konfigurasi Custom Cluster</span>
        </button>
      </div>
    </div>

    <!-- ================================================================= -->
    <!-- MODAL 1: KONFIRMASI UPGRADE / GANTI PAKET LANGGANAN -->
    <!-- ================================================================= -->
    <Teleport to="body">
      <div
        v-if="isUpgradeModalOpen && selectedTargetPlan"
        class="modal-backdrop"
        @click.self="isUpgradeModalOpen = false"
      >
        <div class="modal-dialog modal-dialog-upgrade">
          <div class="modal-header">
            <div class="modal-header-leading">
              <div class="modal-header-icon-box" style="background: #eff6ff; color: #2563eb;">
                <Sparkles :size="18" />
              </div>
              <div>
                <h3 class="modal-heading">Konfirmasi Perubahan Paket Langganan</h3>
                <p class="modal-subheading">Periksa penyesuaian alokasi resource kontainer dan metode pembayaran.</p>
              </div>
            </div>
            <button class="modal-close-button" @click="isUpgradeModalOpen = false" title="Tutup">
              <X :size="16" />
            </button>
          </div>

          <div class="modal-form-body">
            <!-- Comparison Strip -->
            <div class="upgrade-comparison-strip">
              <div class="upgrade-plan-box">
                <span class="upgrade-plan-label">Paket Saat Ini</span>
                <span class="upgrade-plan-name">{{ userPlan.name }}</span>
                <span class="upgrade-plan-price">{{ userPlan.price }}</span>
              </div>

              <div class="upgrade-arrow-glyph">
                <ArrowRight :size="20" />
              </div>

              <div class="upgrade-plan-box" style="text-align: right;">
                <span class="upgrade-plan-label">Paket Baru Target</span>
                <span class="upgrade-plan-name" style="color: #2563eb;">{{ selectedTargetPlan.name }}</span>
                <span class="upgrade-plan-price">{{ selectedTargetPlan.priceMonthlyFormatted }} / bln</span>
              </div>
            </div>

            <!-- Resource Differences Table -->
            <table class="upgrade-specs-table">
              <thead>
                <tr>
                  <th>Spesifikasi Sumber Daya</th>
                  <th>Sebelumnya</th>
                  <th>Setelah Upgrade</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Slot Kontainer Docker</strong></td>
                  <td>{{ userPlan.maxContainers }} Kontainer</td>
                  <td><strong style="color: #059669;">{{ selectedTargetPlan.containers }} Kontainer Otonom</strong></td>
                </tr>
                <tr>
                  <td><strong>Dedicated vCPU Limit</strong></td>
                  <td>{{ userPlan.cpuPerContainer }}</td>
                  <td><strong style="color: #059669;">{{ selectedTargetPlan.cpu }}</strong></td>
                </tr>
                <tr>
                  <td><strong>Memori RAM per Kontainer</strong></td>
                  <td>{{ userPlan.ramPerContainer }}</td>
                  <td><strong style="color: #059669;">{{ selectedTargetPlan.ram }}</strong></td>
                </tr>
                <tr>
                  <td><strong>NVMe S3 Media Bucket</strong></td>
                  <td>{{ userPlan.storageQuota }}</td>
                  <td><strong style="color: #059669;">{{ selectedTargetPlan.storage }}</strong></td>
                </tr>
              </tbody>
            </table>

            <!-- Payment Method Selection -->
            <div class="form-group-block">
              <label class="input-label-row">
                <span class="label-text">Pilih Sumber Pembayaran Tagihan</span>
              </label>
              <select v-model="selectedPaymentMethod" class="form-select-input">
                <option value="visa">Visa Card •••• 4242 (Default)</option>
                <option value="qris">QRIS Otomatis (GoPay, OVO, ShopeePay)</option>
                <option value="bca">BCA Virtual Account (Auto Confirm)</option>
                <option value="mandiri">Mandiri Bill Payment</option>
              </select>
            </div>

            <!-- Prorated Advisory Notice -->
            <div class="api-notice-banner" style="margin-bottom: 16px;">
              <div class="notice-icon-box">
                <ShieldCheck :size="16" />
              </div>
              <div class="notice-content">
                <h4 class="notice-title">Perhitungan Prorata Otomatis</h4>
                <p class="notice-desc">
                  Sisa tagihan siklus aktif Anda akan dikreditkan secara prorata untuk mengurangi biaya tagihan pertama paket baru.
                </p>
              </div>
            </div>

            <!-- Modal Footer Actions (Guaranteed Side-by-Side) -->
            <div class="modal-footer-row">
              <button
                type="button"
                class="btn-modal-ghost"
                @click="isUpgradeModalOpen = false"
              >
                Batal
              </button>
              <button
                type="button"
                class="btn-modal-confirm"
                @click="confirmUpgradePlan"
              >
                <Check :size="14" />
                <span>Konfirmasi & Terapkan Paket Sekarang</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ================================================================= -->
    <!-- MODAL 2: UBAH METODE PEMBAYARAN -->
    <!-- ================================================================= -->
    <Teleport to="body">
      <div
        v-if="isPaymentModalOpen"
        class="modal-backdrop"
        @click.self="isPaymentModalOpen = false"
      >
        <div class="modal-dialog modal-dialog-onetime">
          <div class="modal-header">
            <div class="modal-header-leading">
              <div class="modal-header-icon-box" style="background: #eff6ff; color: #2563eb;">
                <CreditCard :size="18" />
              </div>
              <div>
                <h3 class="modal-heading">Kelola Metode Pembayaran Billing</h3>
                <p class="modal-subheading">Pilih kartu kredit atau rekening virtual account utama penagihan otomatis.</p>
              </div>
            </div>
            <button class="modal-close-button" @click="isPaymentModalOpen = false" title="Tutup">
              <X :size="16" />
            </button>
          </div>

          <div class="modal-form-body">
            <div class="form-group-block">
              <label class="input-label-row">
                <span class="label-text">Pilih Kartu / Metode Pembayaran Aktif</span>
              </label>
              <select v-model="activeBillingCard" class="form-select-input">
                <option value="Visa Card •••• 4242">Visa Card •••• 4242 (Kadaluarsa 08/28)</option>
                <option value="Mastercard •••• 8812">Mastercard •••• 8812 (Kadaluarsa 11/29)</option>
                <option value="BCA Virtual Account Otomatis">BCA Virtual Account Otomatis</option>
                <option value="Mandiri Bill Payment">Mandiri Bill Payment</option>
              </select>
            </div>

            <!-- Modal Footer Actions (Guaranteed Side-by-Side) -->
            <div class="modal-footer-row">
              <button
                type="button"
                class="btn-modal-ghost"
                @click="isPaymentModalOpen = false"
              >
                Tutup
              </button>
              <button
                type="button"
                class="btn-modal-confirm"
                @click="savePaymentMethod"
              >
                <Check :size="14" />
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>
