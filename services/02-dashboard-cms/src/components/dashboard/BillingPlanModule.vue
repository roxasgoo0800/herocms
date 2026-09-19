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

<style scoped>
.billing-hero-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 22px;
}

@media (max-width: 1100px) {
  .billing-hero-grid { grid-template-columns: 1fr; }
}

.billing-left-stack, .billing-right-stack {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Plan Banner Card */
.plan-banner-card {
  padding: 24px;
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.03);
}

.plan-banner-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-bottom: 20px;
  border-bottom: 1px solid #f1f5f9;
  flex-wrap: wrap;
  gap: 14px;
}

.plan-status-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.68rem;
  font-weight: 800;
  color: #2563eb;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  padding: 3px 9px;
  border-radius: 999px;
  letter-spacing: 0.04em;
  margin-bottom: 8px;
}

.plan-name-headline {
  font-size: 1.5rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.03em;
  margin: 0 0 4px 0;
}

.plan-tagline {
  font-size: 0.8rem;
  color: #64748b;
  margin: 0;
  max-width: 440px;
}

.plan-price-block {
  text-align: right;
}

.plan-rate {
  font-size: 1.35rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.02em;
}

.plan-period {
  font-size: 0.72rem;
  color: #94a3b8;
  display: block;
  margin-top: 2px;
}

.plan-meta-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 18px;
  flex-wrap: wrap;
  gap: 10px;
}

.payment-method-strip {
  display: flex;
  align-items: center;
  gap: 12px;
}

.card-chip-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #0f172a;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-details-txt strong {
  font-size: 0.84rem;
  color: #0f172a;
  display: block;
}

.card-details-txt span {
  font-size: 0.72rem;
  color: #64748b;
}

.btn-change-payment {
  font-size: 0.74rem;
  font-weight: 600;
  color: #334155;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  padding: 6px 12px;
  border-radius: 7px;
  cursor: pointer;
  transition: all 0.12s ease;
}

.btn-change-payment:hover {
  background: #f8fafc;
  border-color: #94a3b8;
}

/* Quotas Card */
.resource-quotas-card {
  padding: 22px 24px;
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
}

.card-sec-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.card-sec-head h3 {
  font-size: 0.72rem;
  font-weight: 800;
  color: #64748b;
  letter-spacing: 0.06em;
  margin: 0;
}

.cgroups-tag {
  font-size: 0.68rem;
  font-weight: 700;
  color: #059669;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  padding: 2px 7px;
  border-radius: 4px;
}

.quota-meters-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.quota-item-box {
  background: #fafbfc;
  border: 1px solid #f1f5f9;
  border-radius: 12px;
  padding: 14px 16px;
}

.quota-item-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.item-name-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.item-glyph {
  width: 28px;
  height: 28px;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-glyph.blue { background: #eff6ff; color: #2563eb; }
.item-glyph.emerald { background: #ecfdf5; color: #059669; }
.item-glyph.purple { background: #faf5ff; color: #9333ea; }

.item-name-group strong {
  font-size: 0.84rem;
  color: #0f172a;
  display: block;
}

.item-name-group span {
  font-size: 0.7rem;
  color: #64748b;
}

.item-val-badge {
  font-size: 0.76rem;
  color: #475569;
}

.item-val-badge strong {
  font-weight: 800;
  color: #0f172a;
}

.slot-blocks-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-top: 4px;
}

.slot-block {
  padding: 8px 10px;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 600;
  text-align: center;
  background: #ffffff;
  border: 1px dashed #cbd5e1;
  color: #94a3b8;
  transition: all 0.15s ease;
}

.slot-block.filled {
  background: #eff6ff;
  border: 1px solid #93c5fd;
  color: #1d4ed8;
  box-shadow: 0 1px 3px rgba(37, 99, 235, 0.08);
}

.prog-track-thin {
  height: 6px;
  background: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
}

.prog-fill-thin {
  height: 100%;
  border-radius: 999px;
}

.prog-fill-thin.blue { background: #2563eb; }
.prog-fill-thin.emerald { background: #10b981; }
.prog-fill-thin.purple { background: #9333ea; }

/* Add-on Card */
.addon-expansion-card {
  padding: 24px;
  background: linear-gradient(135deg, #ffffff 0%, #f8faff 100%);
  border-radius: 16px;
  border: 1px solid #bfdbfe;
  box-shadow: 0 4px 18px -4px rgba(37, 99, 235, 0.08);
}

.addon-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.65rem;
  font-weight: 800;
  color: #2563eb;
  letter-spacing: 0.06em;
  margin-bottom: 6px;
}

.addon-card-title {
  font-size: 1.15rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.02em;
  margin: 0 0 6px 0;
}

.addon-card-desc {
  font-size: 0.78rem;
  color: #64748b;
  margin: 0 0 18px 0;
  line-height: 1.45;
}

.slot-calculator-box {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 18px;
}

.calc-label {
  display: block;
  font-size: 0.68rem;
  font-weight: 800;
  color: #64748b;
  letter-spacing: 0.05em;
  margin-bottom: 10px;
}

.slot-stepper-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 8px 12px;
  margin-bottom: 14px;
}

.btn-step {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  color: #0f172a;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.12s ease;
}

.btn-step:hover:not(:disabled) {
  background: #2563eb;
  color: #ffffff;
  border-color: #2563eb;
}

.btn-step:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.stepper-val {
  text-align: center;
}

.stepper-val strong {
  font-size: 1.25rem;
  font-weight: 800;
  color: #0f172a;
  display: block;
}

.stepper-val span {
  font-size: 0.7rem;
  color: #64748b;
}

.price-calc-summary {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px 0;
  border-top: 1px solid #f1f5f9;
  border-bottom: 1px solid #f1f5f9;
  margin-bottom: 14px;
}

.calc-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.84rem;
}

.calc-row strong {
  color: #2563eb;
  font-weight: 800;
}

.calc-row-sub {
  display: flex;
  justify-content: space-between;
  font-size: 0.72rem;
  color: #64748b;
}

.btn-confirm-addon {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: #ffffff;
  border: none;
  padding: 11px;
  border-radius: 9px;
  font-size: 0.84rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.25);
}

.btn-confirm-addon:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(37, 99, 235, 0.35);
}

/* Enterprise Tier Card */
.enterprise-tier-card {
  padding: 20px;
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
}

.ent-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}

.ent-header h4 {
  font-size: 0.92rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.ent-header span {
  font-size: 0.72rem;
  color: #64748b;
}

.ent-desc {
  font-size: 0.76rem;
  color: #64748b;
  line-height: 1.45;
  margin: 0 0 14px 0;
}

.btn-contact-sales {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.76rem;
  font-weight: 600;
  color: #2563eb;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  padding: 7px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.12s ease;
}

.btn-contact-sales:hover {
  background: #dbeafe;
}
</style>
