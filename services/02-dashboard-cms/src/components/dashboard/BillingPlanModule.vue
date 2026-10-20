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
  Building2,
  QrCode,
  RefreshCw
} from 'lucide-vue-next';
import { useDashboardData } from '../../composables/useDashboardData';
import type { SubscriptionPlanCatalogItem, ContainerSite } from '../../types/dashboard';

const {
  userPlan,
  usedContainersCount,
  containers,
  subscriptionPlansCatalog,
  activeContainerId,
  activeMenu,
  openCreateModal,
  openInvoiceDetail,
  processBillingPaymentAndCreateInvoice,
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

// Checkout & Integrated Payment State
interface CheckoutData {
  type: 'addon' | 'upgrade';
  title: string;
  description: string;
  qty?: number;
  planId?: 'starter' | 'pro' | 'agency';
  planName?: string;
  subtotal: number;
  tax: number;
  total: number;
  newContainersCount: number;
  targetPlan?: SubscriptionPlanCatalogItem;
}

const isCheckoutModalOpen = ref(false);
const checkoutData = ref<CheckoutData | null>(null);
const checkoutPaymentMethod = ref('BCA Virtual Account (Auto-Debit)');
const isProcessingPayment = ref(false);

const isPaymentModalOpen = ref(false);
const activeBillingCard = ref('Visa Card •••• 4242');

const openAddonCheckout = () => {
  const subtotal = addonSlotQty.value * 49000;
  const tax = Math.round(subtotal * 0.11);
  const total = subtotal + tax;
  checkoutData.value = {
    type: 'addon',
    title: `Ekspansi +${addonSlotQty.value} Slot Kontainer Docker`,
    description: `Penambahan kapasitas runtime ${addonSlotQty.value} kontainer otonom dengan isolasi CPU/RAM cgroups v2 dan rute Traefik SSL mandiri.`,
    qty: addonSlotQty.value,
    subtotal,
    tax,
    total,
    newContainersCount: userPlan.value.maxContainers + addonSlotQty.value
  };
  isCheckoutModalOpen.value = true;
};

const openUpgradeCheckout = (plan: SubscriptionPlanCatalogItem) => {
  const subtotal = billingCycle.value === 'monthly' ? plan.priceMonthly : plan.priceAnnualMonthly * 12;
  const tax = Math.round(subtotal * 0.11);
  const total = subtotal + tax;
  checkoutData.value = {
    type: 'upgrade',
    title: `Upgrade Paket Langganan: ${plan.name}`,
    description: `Migrasi paket ke ${plan.name} (${plan.containers} Kontainer, ${plan.cpu}, ${plan.ram}, ${plan.storage}).`,
    planId: plan.id,
    planName: plan.name,
    subtotal,
    tax,
    total,
    newContainersCount: plan.containers,
    targetPlan: plan
  };
  isCheckoutModalOpen.value = true;
};

const processCheckoutPayment = () => {
  if (!checkoutData.value) return;
  isProcessingPayment.value = true;

  setTimeout(() => {
    const data = checkoutData.value!;
    let invoicePlanName = data.title;
    const periodStr = '20 Okt 2026 - 20 Nov 2026';

    if (data.type === 'addon' && data.qty) {
      userPlan.value.maxContainers += data.qty;
      invoicePlanName = `Ekspansi +${data.qty} Slot Kontainer Docker (cgroups v2)`;
    } else if (data.type === 'upgrade' && data.targetPlan) {
      const p = data.targetPlan;
      userPlan.value = {
        name: p.name,
        price: `${p.priceMonthlyFormatted} / bln`,
        maxContainers: p.containers,
        cpuPerContainer: p.cpu,
        ramPerContainer: p.ram,
        storageQuota: p.storage
      };
      invoicePlanName = `${p.name} (Multi-Tenant Docker Cluster)`;
    }

    // GENERATE OFFICIAL INVOICE REAL-TIME IN INVOICE LEDGER
    const newInvoice = processBillingPaymentAndCreateInvoice({
      planName: invoicePlanName,
      amount: data.subtotal,
      paymentMethod: checkoutPaymentMethod.value,
      period: periodStr,
      containerQuota: userPlan.value.maxContainers
    });

    isProcessingPayment.value = false;
    isCheckoutModalOpen.value = false;

    showToast(`Pembayaran Rp ${data.total.toLocaleString('id-ID')} Berhasil! Faktur ${newInvoice.id} resmi terbit & kuota aktif.`, 'success');

    // Immediately open the generated official invoice document modal for the user!
    openInvoiceDetail(newInvoice);
  }, 600);
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
        <!-- 1. The Crown Jewel Active Plan Card (Refactored: Non-Overlapping Clean Header) -->
        <div class="plan-crown-card">
          <div class="plan-crown-header">
            <div class="plan-crown-title-group">
              <span class="plan-crown-badge">
                <span class="pulse-mini-dot"></span>
                PAKET AKTIF SAAT INI • {{ userPlan.name }}
              </span>
              <h2 class="plan-name-headline">{{ userPlan.name }}</h2>
              <p class="plan-tagline">
                Arsitektur multi-tenant mandiri dengan isolasi kernel cgroups v2, Traefik v3 HTTP/3 edge routing, dan automasi SSL TLS 1.3 Let's Encrypt.
              </p>
            </div>

            <div class="plan-crown-price-group">
              <div class="plan-crown-rate">{{ userPlan.price }}</div>
              <span class="plan-crown-period">Tagihan berikutnya: 12 November 2026</span>
              <button type="button" @click="activeTab = 'plans'" class="btn-crown-upgrade">
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
        <!-- 1. Add-on Slot Machine Card with Integrated Checkout -->
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

            <!-- Triggers Integrated Checkout Modal -->
            <button class="btn-confirm-addon" @click="openAddonCheckout">
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

          <!-- Bottom Action Button with Integrated Checkout -->
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
              @click="openUpgradeCheckout(plan)"
            >
              <span>Pilih & Bayar Paket Ini</span>
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
    <!-- MODAL 1: CHECKOUT PEMBAYARAN INSTAN & PENERBITAN FAKTUR RESMI -->
    <!-- ================================================================= -->
    <Teleport to="body">
      <div
        v-if="isCheckoutModalOpen && checkoutData"
        class="modal-backdrop"
        @click.self="isCheckoutModalOpen = false"
      >
        <div class="modal-dialog modal-dialog-checkout">
          <!-- Modal Header -->
          <div class="modal-header">
            <div class="modal-header-leading">
              <div class="modal-header-icon-box" style="background: #eff6ff; color: #2563eb;">
                <CreditCard :size="18" />
              </div>
              <div>
                <h3 class="modal-heading">Checkout & Aktivasi Layanan Instan</h3>
                <p class="modal-subheading">Selesaikan pembayaran untuk mengaktifkan kuota runtime dan menerbitkan E-Faktur resmi.</p>
              </div>
            </div>
            <button class="modal-close-button" @click="isCheckoutModalOpen = false" title="Tutup">
              <X :size="16" />
            </button>
          </div>

          <div class="modal-form-body">
            <!-- 1. Order Summary Box -->
            <div class="checkout-summary-box">
              <div class="checkout-item-title">{{ checkoutData.title }}</div>
              <p class="checkout-item-desc">{{ checkoutData.description }}</p>

              <table class="checkout-calc-table">
                <tbody>
                  <tr>
                    <td>Dasar Pengenaan Pajak (DPP)</td>
                    <td style="text-align: right; font-weight: 600;">Rp {{ checkoutData.subtotal.toLocaleString('id-ID') }}</td>
                  </tr>
                  <tr>
                    <td>Pajak Pertambahan Nilai (PPN 11%)</td>
                    <td style="text-align: right; font-weight: 600; color: #059669;">Rp {{ checkoutData.tax.toLocaleString('id-ID') }}</td>
                  </tr>
                  <tr class="total-row">
                    <td>Total Tagihan Bersih</td>
                    <td style="text-align: right;">Rp {{ checkoutData.total.toLocaleString('id-ID') }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- 2. Select Payment Method Grid -->
            <div class="form-group-block" style="margin-bottom: 14px;">
              <label class="input-label-row">
                <span class="label-text">Pilih Metode Pembayaran</span>
                <span class="label-badge-optional">Verifikasi Instan</span>
              </label>

              <div class="checkout-methods-grid">
                <div
                  class="checkout-method-card"
                  :class="{ active: checkoutPaymentMethod === 'BCA Virtual Account (Auto-Debit)' }"
                  @click="checkoutPaymentMethod = 'BCA Virtual Account (Auto-Debit)'"
                >
                  <div class="checkout-method-icon">
                    <Building2 :size="16" />
                  </div>
                  <div class="checkout-method-info">
                    <strong>BCA Virtual Account</strong>
                    <span>Auto-Debit / Kliring Instan</span>
                  </div>
                </div>

                <div
                  class="checkout-method-card"
                  :class="{ active: checkoutPaymentMethod === 'QRIS Dinamis (GoPay / OVO / Dana)' }"
                  @click="checkoutPaymentMethod = 'QRIS Dinamis (GoPay / OVO / Dana)'"
                >
                  <div class="checkout-method-icon">
                    <QrCode :size="16" />
                  </div>
                  <div class="checkout-method-info">
                    <strong>QRIS Dinamis</strong>
                    <span>GoPay, OVO, ShopeePay</span>
                  </div>
                </div>

                <div
                  class="checkout-method-card"
                  :class="{ active: checkoutPaymentMethod === 'Visa Card •••• 4242' }"
                  @click="checkoutPaymentMethod = 'Visa Card •••• 4242'"
                >
                  <div class="checkout-method-icon">
                    <CreditCard :size="16" />
                  </div>
                  <div class="checkout-method-info">
                    <strong>Visa •••• 4242</strong>
                    <span>Kartu Kredit / Debit Default</span>
                  </div>
                </div>

                <div
                  class="checkout-method-card"
                  :class="{ active: checkoutPaymentMethod === 'Mandiri Bill Payment' }"
                  @click="checkoutPaymentMethod = 'Mandiri Bill Payment'"
                >
                  <div class="checkout-method-icon">
                    <Layers :size="16" />
                  </div>
                  <div class="checkout-method-info">
                    <strong>Mandiri Bill</strong>
                    <span>ATM / Livin' Mandiri</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 3. Dynamic Payment Simulation Preview Box -->
            <div class="checkout-pay-preview-box">
              <div v-if="checkoutPaymentMethod.includes('QRIS')" class="checkout-qr-box">
                <QrCode :size="48" />
              </div>
              <div v-else-if="checkoutPaymentMethod.includes('BCA')" style="width: 50px; height: 50px; border-radius: 8px; background: #eff6ff; color: #2563eb; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                <Building2 :size="24" />
              </div>
              <div v-else style="width: 50px; height: 50px; border-radius: 8px; background: #f8fafc; color: #0f172a; border: 1px solid #cbd5e1; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                <CreditCard :size="24" />
              </div>

              <div>
                <strong style="font-size: 13px; color: #0f172a; display: block; margin-bottom: 2px;">
                  {{ checkoutPaymentMethod }}
                </strong>
                <p v-if="checkoutPaymentMethod.includes('QRIS')" style="font-size: 11.5px; color: #64748b; margin: 0;">
                  Pindai QRIS di atas dengan aplikasi e-wallet pilihan Anda. Status pembayaran akan terverifikasi otomatis.
                </p>
                <p v-else-if="checkoutPaymentMethod.includes('BCA')" style="font-size: 11.5px; color: #64748b; margin: 0;">
                  Nomor VA: <strong>8802 9942 1089</strong> • Bank Central Asia. Tagihan terverifikasi seketika setelah transfer.
                </p>
                <p v-else style="font-size: 11.5px; color: #64748b; margin: 0;">
                  Tagihan sebesar Rp {{ checkoutData.total.toLocaleString('id-ID') }} akan otomatis diproses via payment gateway.
                </p>
              </div>
            </div>

            <!-- Legal Notice -->
            <div class="api-notice-banner" style="margin-bottom: 18px;">
              <div class="notice-icon-box">
                <ShieldCheck :size="16" />
              </div>
              <div class="notice-content">
                <h4 class="notice-title">Penerbitan E-Faktur Resmi Otomatis</h4>
                <p class="notice-desc">
                  Begitu pembayaran berhasil, dokumen faktur pajak elektronik resmi ber-NPWP PT Hero Digital Multitek akan langsung terbit dan tercatat di buku besar akun Anda.
                </p>
              </div>
            </div>

            <!-- Modal Footer (Guaranteed Side-by-Side) -->
            <div class="modal-footer-row">
              <button
                type="button"
                class="btn-modal-ghost"
                :disabled="isProcessingPayment"
                @click="isCheckoutModalOpen = false"
              >
                Batal
              </button>
              <button
                type="button"
                class="btn-modal-confirm"
                :disabled="isProcessingPayment"
                @click="processCheckoutPayment"
              >
                <RefreshCw v-if="isProcessingPayment" :size="14" class="spin-anim" />
                <Check v-else :size="14" />
                <span>{{ isProcessingPayment ? 'Memproses Kliring Bank...' : `Bayar Rp ${checkoutData.total.toLocaleString('id-ID')} & Terbitkan Faktur` }}</span>
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
