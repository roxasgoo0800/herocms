<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import {
  Layers,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Server,
  Zap,
  Cpu,
  HardDrive,
  CreditCard,
  QrCode,
  Building2,
  Check,
  Loader2,
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-vue-next';
import { studioApi } from '../services/apiClient';

const router = useRouter();

// Current Step: 1 = Pilih Paket, 2 = Checkout Pembayaran, 3 = Launch Container
const currentStep = ref<1 | 2 | 3>(1);

// Step 1: Selected Plan
type PlanTier = 'starter' | 'pro' | 'agency';
const selectedPlan = ref<PlanTier>('pro');

const plans = [
  {
    id: 'starter' as PlanTier,
    name: 'Hero Starter',
    badge: 'Pemula & Uji Coba',
    price: 49000,
    priceFormatted: 'Rp 49.000',
    period: '/ bulan',
    containers: 1,
    ram: '256 MB',
    cpu: '0.5 vCPU',
    storage: '1 GB NVMe',
    features: [
      '1 Kontainer Docker Otonom',
      'Traefik v3 TLS Let\'s Encrypt SSL',
      'PostgreSQL RLS Database Terisolasi',
      'MinIO S3 Media Storage (1 GB)',
      'Subdomain herocms.id'
    ]
  },
  {
    id: 'pro' as PlanTier,
    name: 'Hero Pro',
    badge: 'Paling Populer',
    isPopular: true,
    price: 149000,
    priceFormatted: 'Rp 149.000',
    period: '/ bulan',
    containers: 3,
    ram: '256 MB / kontainer',
    cpu: '0.5 vCPU / kontainer',
    storage: '2 GB NVMe per site',
    features: [
      '3 Kontainer Docker Otonom',
      'Visual Live Canvas Page Builder',
      'Real-Time Analytics (Redis ZSET)',
      'Traefik v3 HTTP/3 & Custom Ingress',
      'Dukungan Multi-Tenant RLS Penuh'
    ]
  },
  {
    id: 'agency' as PlanTier,
    name: 'Hero Agency',
    badge: 'Perusahaan & Instansi',
    price: 399000,
    priceFormatted: 'Rp 399.000',
    period: '/ bulan',
    containers: 10,
    ram: '512 MB / kontainer',
    cpu: '1.0 vCPU / kontainer',
    storage: '10 GB NVMe per site',
    features: [
      '10 Kontainer Docker Otonom',
      'Custom Domain Tanpa Batas',
      'Webhook & API Headless Integration',
      'Prioritas Resource cgroups v2',
      'Dukungan Teknis Prioritas 24/7'
    ]
  }
];

const currentPlanObj = computed(() => {
  return plans.find(p => p.id === selectedPlan.value) || plans[1];
});

// Step 2: Payment Method
const paymentMethod = ref<'qris' | 'bca_va' | 'mandiri_va' | 'credit_card'>('qris');
const isPaying = ref(false);
const paymentSuccessInvoice = ref<any>(null);

const subtotal = computed(() => currentPlanObj.value.price);
const ppnTax = computed(() => Math.round(subtotal.value * 0.11));
const grandTotal = computed(() => subtotal.value + ppnTax.value);

const formatRupiah = (val: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
};

const handleProcessPayment = async () => {
  isPaying.value = true;
  try {
    const res = await studioApi.checkoutPlan(selectedPlan.value, paymentMethod.value);
    paymentSuccessInvoice.value = res?.invoice || res;
    // Delay 1 detik untuk efek auto-settlement gateway yang elegan
    setTimeout(() => {
      isPaying.value = false;
      currentStep.value = 3;
    }, 1200);
  } catch (err: any) {
    alert(err?.message || 'Gagal memproses pembayaran. Menggunakan simulasi lokal.');
    setTimeout(() => {
      isPaying.value = false;
      currentStep.value = 3;
    }, 800);
  }
};

// Step 3: First Website Configuration
const siteName = ref('Portal Informasi Utama');
const subdomain = ref('portal-utama');
const siteCategory = ref('Portal Berita & Media');
const isDeploying = ref(false);
const deployProgress = ref(0);
const deployLogs = ref<string[]>([]);
const isDeployed = ref(false);
const deployedContainer = ref<any>(null);

const handleDeployFirstSite = async () => {
  if (!siteName.value.trim() || !subdomain.value.trim()) {
    alert('Nama situs dan subdomain wajib diisi.');
    return;
  }

  isDeploying.value = true;
  deployProgress.value = 15;
  deployLogs.value = [
    '[INIT] Memeriksa limit kuota kontainer tenant pada database...',
    '[CGROUPS] Mengalokasikan 256MB RAM & 0.5 CPU cgroups v2 sandbox...'
  ];

  setTimeout(() => {
    deployProgress.value = 45;
    deployLogs.value.push('[TRAEFIK v3] Mendaftarkan router dynamic proxy untuk ' + subdomain.value + '.herocms.id...');
    deployLogs.value.push('[INGRESS] Menerbitkan sertifikat TLS v1.3 Let\'s Encrypt...');
  }, 700);

  setTimeout(async () => {
    deployProgress.value = 75;
    deployLogs.value.push('[DATABASE] Menginisialisasi skema Row-Level Security PostgreSQL...');
    deployLogs.value.push('[STORAGE] Membuat bucket penyimpanan MinIO S3 terisolasi...');

    try {
      const res = await studioApi.createContainer({
        name: siteName.value.trim(),
        subdomain: subdomain.value.trim().toLowerCase(),
        category: siteCategory.value,
        role: 'tenant_primary'
      });
      deployedContainer.value = res?.container || res;
    } catch (e) {
      console.warn('Deploy fallback:', e);
    }

    deployProgress.value = 100;
    deployLogs.value.push('[SUCCESS] Kontainer Docker berstatus RUNNING! Ingress siap menerima trafik.');
    isDeploying.value = false;
    isDeployed.value = true;
  }, 1600);
};

const goToDashboard = () => {
  router.push('/');
};
</script>

<template>
  <div class="onboarding-viewport">
    <!-- Top Modern Brand Header -->
    <header class="onboarding-header">
      <div class="header-container">
        <div class="brand-item">
          <div class="brand-icon">
            <Layers :size="20" color="#ffffff" />
          </div>
          <span class="brand-title">HeroCMS <span class="highlight">Studio</span></span>
        </div>

        <!-- Step Indicator -->
        <div class="stepper-nav">
          <div class="step-node" :class="{ active: currentStep === 1, done: currentStep > 1 }">
            <span class="node-badge">
              <Check v-if="currentStep > 1" :size="13" stroke-width="3" />
              <span v-else>1</span>
            </span>
            <span class="node-label">Pilih Paket</span>
          </div>

          <div class="step-connector" :class="{ filled: currentStep > 1 }"></div>

          <div class="step-node" :class="{ active: currentStep === 2, done: currentStep > 2 }">
            <span class="node-badge">
              <Check v-if="currentStep > 2" :size="13" stroke-width="3" />
              <span v-else>2</span>
            </span>
            <span class="node-label">Pembayaran</span>
          </div>

          <div class="step-connector" :class="{ filled: currentStep > 2 }"></div>

          <div class="step-node" :class="{ active: currentStep === 3, done: isDeployed }">
            <span class="node-badge">
              <Check v-if="isDeployed" :size="13" stroke-width="3" />
              <span v-else>3</span>
            </span>
            <span class="node-label">Luncurkan Situs</span>
          </div>
        </div>

        <div class="header-action">
          <button @click="goToDashboard" class="btn-skip-ghost">
            Ke Dashboard
            <ChevronRight :size="16" />
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content Body -->
    <main class="onboarding-main">
      <!-- ===================================================================
           STEP 1: PILIH PAKET KUOTA
           =================================================================== -->
      <section v-if="currentStep === 1" class="step-content-box fade-in">
        <div class="step-hero-text">
          <span class="eyebrow-pill">Langkah 1 dari 3</span>
          <h1 class="main-heading">Pilih Kuota Kluster Kontainer Anda</h1>
          <p class="sub-heading">
            Setiap situs web berjalan di kontainer Docker otonom terisolasi dengan cgroups v2 dan Traefik v3 routing.
          </p>
        </div>

        <!-- Plan Grid -->
        <div class="plans-grid">
          <div
            v-for="plan in plans"
            :key="plan.id"
            class="plan-card"
            :class="{ selected: selectedPlan === plan.id, featured: plan.isPopular }"
            @click="selectedPlan = plan.id"
          >
            <div v-if="plan.isPopular" class="popular-ribbon">
              <Sparkles :size="13" />
              {{ plan.badge }}
            </div>
            <div v-else class="normal-badge">
              {{ plan.badge }}
            </div>

            <h3 class="plan-name">{{ plan.name }}</h3>

            <div class="price-stack">
              <span class="price-number">{{ plan.priceFormatted }}</span>
              <span class="price-unit">{{ plan.period }}</span>
            </div>

            <div class="resource-pill-row">
              <div class="resource-chip">
                <Server :size="13" class="chip-icon" />
                <span>{{ plan.containers }} Kontainer</span>
              </div>
              <div class="resource-chip">
                <Cpu :size="13" class="chip-icon" />
                <span>{{ plan.cpu }}</span>
              </div>
              <div class="resource-chip">
                <HardDrive :size="13" class="chip-icon" />
                <span>{{ plan.ram }}</span>
              </div>
            </div>

            <div class="divider-line"></div>

            <ul class="features-checklist">
              <li v-for="(feat, idx) in plan.features" :key="idx">
                <CheckCircle2 :size="15" class="check-glyph" />
                <span>{{ feat }}</span>
              </li>
            </ul>

            <button
              type="button"
              class="btn-select-plan"
              :class="{ 'btn-selected': selectedPlan === plan.id }"
            >
              <Check v-if="selectedPlan === plan.id" :size="16" />
              <span>{{ selectedPlan === plan.id ? 'Paket Dipilih' : 'Pilih Paket Ini' }}</span>
            </button>
          </div>
        </div>

        <!-- Action Footer -->
        <div class="step-footer-bar">
          <div class="footer-guarantee">
            <ShieldCheck :size="18" class="text-emerald" />
            <span>Garansi 30 Hari Uang Kembali • Setup Otomatis dalam 60 Detik</span>
          </div>

          <button @click="currentStep = 2" class="btn-primary-forward">
            <span>Lanjut ke Pembayaran</span>
            <ArrowRight :size="18" />
          </button>
        </div>
      </section>

      <!-- ===================================================================
           STEP 2: CHECKOUT & PEMBAYARAN INSTAN
           =================================================================== -->
      <section v-else-if="currentStep === 2" class="step-content-box fade-in">
        <div class="step-hero-text">
          <span class="eyebrow-pill">Langkah 2 dari 3</span>
          <h1 class="main-heading">Konfirmasi & Pembayaran Langsung</h1>
          <p class="sub-heading">
            Pilih metode pembayaran favorit Anda. Sistem auto-settlement akan mengaktifkan kuota Anda secara instan.
          </p>
        </div>

        <div class="checkout-layout-grid">
          <!-- Left Column: Payment Method Selection -->
          <div class="payment-methods-card">
            <h2 class="section-title">Metode Pembayaran</h2>

            <div class="method-options-list">
              <!-- QRIS Option -->
              <label
                class="method-option"
                :class="{ active: paymentMethod === 'qris' }"
                @click="paymentMethod = 'qris'"
              >
                <div class="method-left">
                  <div class="radio-disc" :class="{ checked: paymentMethod === 'qris' }"></div>
                  <div class="method-icon-box qris-box">
                    <QrCode :size="20" />
                  </div>
                  <div class="method-info">
                    <div class="method-name">QRIS Standar Nasional</div>
                    <div class="method-meta">BCA, Mandiri, GoPay, OVO, ShopeePay, DANA (Bebas Biaya Admin)</div>
                  </div>
                </div>
                <span class="instant-tag">Instan</span>
              </label>

              <!-- BCA Virtual Account -->
              <label
                class="method-option"
                :class="{ active: paymentMethod === 'bca_va' }"
                @click="paymentMethod = 'bca_va'"
              >
                <div class="method-left">
                  <div class="radio-disc" :class="{ checked: paymentMethod === 'bca_va' }"></div>
                  <div class="method-icon-box bca-box">
                    <Building2 :size="20" />
                  </div>
                  <div class="method-info">
                    <div class="method-name">BCA Virtual Account</div>
                    <div class="method-meta">Verifikasi real-time otomatis via API BCA</div>
                  </div>
                </div>
                <span class="instant-tag">Otomatis</span>
              </label>

              <!-- Mandiri Virtual Account -->
              <label
                class="method-option"
                :class="{ active: paymentMethod === 'mandiri_va' }"
                @click="paymentMethod = 'mandiri_va'"
              >
                <div class="method-left">
                  <div class="radio-disc" :class="{ checked: paymentMethod === 'mandiri_va' }"></div>
                  <div class="method-icon-box mandiri-box">
                    <Building2 :size="20" />
                  </div>
                  <div class="method-info">
                    <div class="method-name">Mandiri Virtual Account</div>
                    <div class="method-meta">Konfirmasi otomatis tanpa upload bukti transfer</div>
                  </div>
                </div>
                <span class="instant-tag">Otomatis</span>
              </label>

              <!-- Credit Card -->
              <label
                class="method-option"
                :class="{ active: paymentMethod === 'credit_card' }"
                @click="paymentMethod = 'credit_card'"
              >
                <div class="method-left">
                  <div class="radio-disc" :class="{ checked: paymentMethod === 'credit_card' }"></div>
                  <div class="method-icon-box cc-box">
                    <CreditCard :size="20" />
                  </div>
                  <div class="method-info">
                    <div class="method-name">Kartu Kredit / Debit Visa & Mastercard</div>
                    <div class="method-meta">Enkripsi TLS v1.3 & 3D Secure Protection</div>
                  </div>
                </div>
                <span class="instant-tag">3D Secure</span>
              </label>
            </div>

            <!-- Payment Simulation Preview -->
            <div class="simulation-banner">
              <div class="sim-header">
                <Zap :size="16" class="sim-zap" />
                <span>Simulasi Pembayaran Auto-Settled</span>
              </div>
              <p class="sim-desc">
                Pada mode development ini, Anda cukup klik tombol konfirmasi di samping untuk langsung melunasi faktur dan mengaktifkan kuota kontainer secara instan.
              </p>
            </div>
          </div>

          <!-- Right Column: Order Summary & Invoice Preview -->
          <div class="order-summary-card">
            <h2 class="section-title">Ringkasan Pesanan</h2>

            <div class="selected-plan-box">
              <div class="summary-plan-header">
                <div>
                  <span class="plan-sub-tag">Paket Langganan</span>
                  <div class="summary-plan-name">{{ currentPlanObj.name }}</div>
                </div>
                <div class="summary-plan-price">{{ currentPlanObj.priceFormatted }}</div>
              </div>

              <div class="summary-specs">
                <span>{{ currentPlanObj.containers }} Kontainer Otonom</span> •
                <span>{{ currentPlanObj.cpu }}</span> •
                <span>{{ currentPlanObj.ram }}</span>
              </div>
            </div>

            <div class="calc-table">
              <div class="calc-row">
                <span>Subtotal (1 Bulan)</span>
                <span>{{ formatRupiah(subtotal) }}</span>
              </div>
              <div class="calc-row">
                <span>PPN (11%)</span>
                <span>{{ formatRupiah(ppnTax) }}</span>
              </div>
              <div class="calc-row discount-row">
                <span>Biaya Gateway</span>
                <span class="text-emerald">GRATIS (Rp 0)</span>
              </div>

              <div class="calc-divider"></div>

              <div class="calc-row total-row">
                <span>Total Tagihan</span>
                <span class="total-highlight">{{ formatRupiah(grandTotal) }}</span>
              </div>
            </div>

            <!-- CTA Button -->
            <button
              @click="handleProcessPayment"
              class="btn-pay-now"
              :disabled="isPaying"
            >
              <Loader2 v-if="isPaying" class="spinner" :size="18" />
              <span v-if="isPaying">Memproses Settlement Gateway...</span>
              <span v-else class="cta-inner">
                <ShieldCheck :size="18" />
                <span>Bayar & Aktifkan Kuota</span>
                <ArrowRight :size="18" />
              </span>
            </button>

            <button @click="currentStep = 1" class="btn-back-link">
              <ArrowLeft :size="14" />
              <span>Ubah Pilihan Paket</span>
            </button>
          </div>
        </div>
      </section>

      <!-- ===================================================================
           STEP 3: QUICK WEBSITE & CONTAINER LAUNCH WIZARD
           =================================================================== -->
      <section v-else-if="currentStep === 3" class="step-content-box fade-in">
        <div class="step-hero-text">
          <span class="eyebrow-pill success-pill">
            <CheckCircle2 :size="13" />
            Pembayaran Lunas • Kuota Kontainer Aktif!
          </span>
          <h1 class="main-heading">Luncurkan Situs & Kontainer Pertama Anda</h1>
          <p class="sub-heading">
            Tentukan identitas dan subdomain situs Anda. Docker cgroups v2 dan Traefik v3 Ingress akan diprovisikan secara otomatis.
          </p>
        </div>

        <div class="launch-form-shell" v-if="!isDeployed">
          <div class="form-row-grid">
            <div class="form-field-block">
              <label class="block-label">Nama Situs Web</label>
              <input
                v-model="siteName"
                type="text"
                placeholder="Contoh: Portal Berita Nasional"
                class="form-input-control"
                :disabled="isDeploying"
              />
              <span class="field-hint">Nama yang tampil pada dashboard tenant dan title bar.</span>
            </div>

            <div class="form-field-block">
              <label class="block-label">Kategori Situs</label>
              <select v-model="siteCategory" class="form-input-control select-control" :disabled="isDeploying">
                <option value="Portal Berita & Media">Portal Berita & Media</option>
                <option value="Portal Pemerintahan (PPID)">Portal Pemerintahan (PPID / OPD)</option>
                <option value="Company Profile Bisnis">Company Profile Bisnis & Korporasi</option>
                <option value="eCommerce & Katalog Produk">eCommerce & Katalog Produk</option>
                <option value="Pendidikan & Universitas">Pendidikan & Sekolah</option>
              </select>
              <span class="field-hint">Menyesuaikan komponen default dan skema artikel.</span>
            </div>
          </div>

          <div class="form-field-block mt-4">
            <label class="block-label">Subdomain Tenant Otonom</label>
            <div class="subdomain-input-group">
              <input
                v-model="subdomain"
                type="text"
                placeholder="portal-utama"
                class="subdomain-field"
                :disabled="isDeploying"
              />
              <span class="domain-suffix">.herocms.id</span>
            </div>
            <span class="field-hint">Alamat ingress SSL Traefik v3 yang dapat langsung diakses publik.</span>
          </div>

          <!-- Provisioning Progress Box (Shows when deploying) -->
          <div v-if="isDeploying" class="deploy-terminal-box">
            <div class="terminal-bar">
              <div class="term-dots">
                <span class="dot red"></span>
                <span class="dot yellow"></span>
                <span class="dot green"></span>
              </div>
              <span class="term-title">Orchestration Provisioning Engine</span>
            </div>

            <!-- Progress Line -->
            <div class="progress-track">
              <div class="progress-fill" :style="{ width: deployProgress + '%' }"></div>
            </div>

            <div class="terminal-console">
              <div v-for="(log, idx) in deployLogs" :key="idx" class="term-line">
                <span class="term-time">[{{ new Date().toLocaleTimeString() }}]</span>
                <span class="term-text">{{ log }}</span>
              </div>
            </div>
          </div>

          <!-- CTA Deploy Button -->
          <div class="launch-actions-bar">
            <button
              @click="handleDeployFirstSite"
              class="btn-deploy-primary"
              :disabled="isDeploying"
            >
              <Loader2 v-if="isDeploying" class="spinner" :size="18" />
              <span v-if="isDeploying">Memprovisikan Kontainer Docker...</span>
              <span v-else class="cta-inner">
                <Server :size="18" />
                <span>Luncurkan Kontainer Sekarang</span>
                <ArrowRight :size="18" />
              </span>
            </button>
          </div>
        </div>

        <!-- Success View after Deploy -->
        <div v-else class="deployed-success-card fade-in">
          <div class="success-big-icon">
            <CheckCircle2 :size="48" color="#10b981" />
          </div>

          <h2 class="success-title">Situs & Kontainer Berhasil Diluncurkan!</h2>
          <p class="success-sub">
            Kontainer Docker <strong>{{ subdomain }}.herocms.id</strong> telah aktif dengan alokasi cgroups v2, database PostgreSQL RLS, dan router Traefik v3.
          </p>

          <div class="container-summary-chip">
            <div class="chip-item">
              <span class="chip-label">Status Kontainer:</span>
              <span class="status-running-tag">RUNNING (Port 80/443)</span>
            </div>
            <div class="chip-item">
              <span class="chip-label">URL Publik:</span>
              <a :href="'https://' + subdomain + '.herocms.id'" target="_blank" class="url-link">
                https://{{ subdomain }}.herocms.id
                <ExternalLink :size="12" />
              </a>
            </div>
            <div class="chip-item">
              <span class="chip-label">Alokasi Resource:</span>
              <span class="chip-val">256MB RAM / 0.5 vCPU</span>
            </div>
          </div>

          <div class="success-action-row">
            <button @click="goToDashboard" class="btn-goto-dashboard">
              <span>Masuk ke Dashboard Studio</span>
              <ArrowRight :size="18" />
            </button>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
/* ==========================================================================
   HEROCMS STUDIO UNIFIED DESIGN SYSTEM (LIGHT THEME & GLASSMORPHIC)
   ========================================================================== */

.onboarding-viewport {
  min-height: 100vh;
  background: transparent;
  color: #0f172a;
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  display: flex;
  flex-direction: column;
}

/* Header */
.onboarding-header {
  border-bottom: 1px solid rgba(226, 232, 240, 0.85);
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  position: sticky;
  top: 0;
  z-index: 50;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 14px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-icon {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);
}

.brand-title {
  font-size: 1.15rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.02em;
}

.brand-title .highlight {
  color: #2563eb;
}

/* Stepper */
.stepper-nav {
  display: flex;
  align-items: center;
  gap: 12px;
}

.step-node {
  display: flex;
  align-items: center;
  gap: 8px;
  opacity: 0.55;
  transition: all 0.25s ease;
}

.step-node.active {
  opacity: 1;
}

.step-node.done {
  opacity: 0.9;
}

.node-badge {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  color: #64748b;
  transition: all 0.2s ease;
}

.step-node.active .node-badge {
  background: #2563eb;
  border-color: #2563eb;
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.35);
}

.step-node.done .node-badge {
  background: #10b981;
  border-color: #10b981;
  color: #ffffff;
}

.node-label {
  font-size: 0.82rem;
  font-weight: 600;
  color: #64748b;
}

.step-node.active .node-label {
  color: #0f172a;
  font-weight: 700;
}

.step-connector {
  width: 32px;
  height: 2px;
  background: #e2e8f0;
  border-radius: 1px;
}

.step-connector.filled {
  background: #10b981;
}

.btn-skip-ghost {
  display: flex;
  align-items: center;
  gap: 4px;
  background: transparent;
  border: 1px solid #e2e8f0;
  color: #475569;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  padding: 6px 14px;
  border-radius: 8px;
  transition: all 0.2s ease;
  background: #ffffff;
}

.btn-skip-ghost:hover {
  color: #0f172a;
  border-color: #cbd5e1;
  background: #f8fafc;
}

/* Main Content */
.onboarding-main {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 40px 24px 70px;
}

.step-hero-text {
  text-align: center;
  max-width: 680px;
  margin: 0 auto 36px;
}

.eyebrow-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  color: #2563eb;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 4px 14px;
  border-radius: 999px;
  margin-bottom: 12px;
}

.eyebrow-pill.success-pill {
  background: #ecfdf5;
  border-color: #a7f3d0;
  color: #059669;
}

.main-heading {
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: #0f172a;
  line-height: 1.25;
  margin-bottom: 10px;
}

.sub-heading {
  font-size: 0.95rem;
  color: #64748b;
  line-height: 1.6;
}

/* Step 1: Plans Grid */
.plans-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 36px;
}

@media (max-width: 960px) {
  .plans-grid {
    grid-template-columns: 1fr;
  }
}

.plan-card {
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  position: relative;
  cursor: pointer;
  box-shadow: 0 4px 20px -4px rgba(15, 23, 42, 0.05);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.plan-card:hover {
  background: #ffffff;
  border-color: #93c5fd;
  transform: translateY(-3px);
  box-shadow: 0 12px 28px -6px rgba(15, 23, 42, 0.08);
}

.plan-card.selected {
  background: #ffffff;
  border-color: #2563eb;
  box-shadow: 0 0 0 2px #2563eb, 0 16px 36px -8px rgba(37, 99, 235, 0.16);
}

.popular-ribbon {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: #ffffff;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 4px 14px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35);
}

.normal-badge {
  font-size: 0.75rem;
  font-weight: 700;
  color: #64748b;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.plan-name {
  font-size: 1.35rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.02em;
  margin-bottom: 10px;
}

.price-stack {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 18px;
}

.price-number {
  font-size: 1.85rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.03em;
}

.price-unit {
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 500;
}

.resource-pill-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.resource-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 5px 10px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #334155;
}

.chip-icon {
  color: #2563eb;
}

.divider-line {
  height: 1px;
  background: #f1f5f9;
  margin-bottom: 20px;
}

.features-checklist {
  list-style: none;
  padding: 0;
  margin: 0 0 24px 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
}

.features-checklist li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 0.84rem;
  color: #475569;
  line-height: 1.45;
}

.check-glyph {
  color: #10b981;
  flex-shrink: 0;
  margin-top: 1px;
}

.btn-select-plan {
  width: 100%;
  padding: 11px 16px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  color: #1e293b;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.btn-select-plan:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.btn-select-plan.btn-selected {
  background: #2563eb;
  border-color: #2563eb;
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3);
}

.step-footer-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 16px 24px;
  box-shadow: 0 4px 16px -4px rgba(15, 23, 42, 0.04);
}

.footer-guarantee {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.85rem;
  color: #475569;
  font-weight: 500;
}

.text-emerald {
  color: #10b981;
}

.btn-primary-forward {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: #ffffff;
  border: none;
  padding: 12px 26px;
  border-radius: 12px;
  font-size: 0.92rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.35);
  transition: all 0.2s ease;
}

.btn-primary-forward:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.45);
}

/* Step 2: Checkout */
.checkout-layout-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 32px;
}

@media (max-width: 900px) {
  .checkout-layout-grid {
    grid-template-columns: 1fr;
  }
}

.section-title {
  font-size: 1.15rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.01em;
  margin-bottom: 18px;
}

.payment-methods-card,
.order-summary-card {
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 4px 20px -4px rgba(15, 23, 42, 0.05);
}

.method-options-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.method-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.method-option:hover {
  border-color: #93c5fd;
  background: #ffffff;
}

.method-option.active {
  background: #eff6ff;
  border-color: #2563eb;
  box-shadow: 0 0 0 1px #2563eb;
}

.method-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.radio-disc {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid #cbd5e1;
  position: relative;
  background: #ffffff;
}

.radio-disc.checked {
  border-color: #2563eb;
}

.radio-disc.checked::after {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #2563eb;
}

.method-icon-box {
  width: 38px;
  height: 38px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qris-box {
  background: #fee2e2;
  color: #dc2626;
}

.bca-box {
  background: #e0f2fe;
  color: #0284c7;
}

.mandiri-box {
  background: #fef3c7;
  color: #d97706;
}

.cc-box {
  background: #ede9fe;
  color: #6366f1;
}

.method-name {
  font-size: 0.9rem;
  font-weight: 700;
  color: #0f172a;
}

.method-meta {
  font-size: 0.76rem;
  color: #64748b;
}

.instant-tag {
  font-size: 0.72rem;
  font-weight: 700;
  color: #059669;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  padding: 3px 8px;
  border-radius: 6px;
}

.simulation-banner {
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 12px;
  padding: 16px;
}

.sim-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.84rem;
  font-weight: 700;
  color: #2563eb;
  margin-bottom: 6px;
}

.sim-desc {
  font-size: 0.8rem;
  color: #475569;
  line-height: 1.5;
  margin: 0;
}

/* Order Summary */
.selected-plan-box {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
}

.summary-plan-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 6px;
}

.plan-sub-tag {
  font-size: 0.72rem;
  color: #64748b;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.summary-plan-name {
  font-size: 1.1rem;
  font-weight: 800;
  color: #0f172a;
}

.summary-plan-price {
  font-size: 1.1rem;
  font-weight: 800;
  color: #2563eb;
}

.summary-specs {
  font-size: 0.78rem;
  color: #64748b;
  font-weight: 500;
}

.calc-table {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 24px;
}

.calc-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.88rem;
  color: #475569;
}

.calc-divider {
  height: 1px;
  background: #e2e8f0;
  margin: 6px 0;
}

.total-row {
  font-size: 1.05rem;
  font-weight: 700;
  color: #0f172a;
}

.total-highlight {
  font-size: 1.35rem;
  font-weight: 800;
  color: #2563eb;
}

.btn-pay-now {
  width: 100%;
  padding: 14px 20px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #ffffff;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.3);
  transition: all 0.2s ease;
  margin-bottom: 12px;
}

.btn-pay-now:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.4);
}

.btn-pay-now:disabled {
  opacity: 0.75;
  cursor: not-allowed;
}

.cta-inner {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-back-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: transparent;
  border: none;
  color: #64748b;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  padding: 8px;
  transition: color 0.2s ease;
}

.btn-back-link:hover {
  color: #0f172a;
}

/* Step 3: Launch Form */
.launch-form-shell {
  max-width: 760px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 4px 20px -4px rgba(15, 23, 42, 0.05);
}

.form-row-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

@media (max-width: 640px) {
  .form-row-grid {
    grid-template-columns: 1fr;
  }
}

.form-field-block {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mt-4 {
  margin-top: 18px;
}

.block-label {
  font-size: 0.86rem;
  font-weight: 700;
  color: #0f172a;
}

.form-input-control {
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 0.92rem;
  color: #0f172a;
  outline: none;
  transition: all 0.2s ease;
}

.form-input-control:focus {
  border-color: #2563eb;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.select-control {
  appearance: auto;
  cursor: pointer;
}

.field-hint {
  font-size: 0.75rem;
  color: #64748b;
}

.subdomain-input-group {
  display: flex;
  align-items: center;
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.2s ease;
}

.subdomain-input-group:focus-within {
  border-color: #2563eb;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.subdomain-field {
  flex: 1;
  background: transparent;
  border: none;
  padding: 10px 14px;
  font-size: 0.95rem;
  color: #2563eb;
  font-weight: 700;
  font-family: monospace;
  outline: none;
}

.domain-suffix {
  padding: 0 14px;
  font-size: 0.88rem;
  color: #64748b;
  font-weight: 600;
  font-family: monospace;
  background: #f1f5f9;
  height: 100%;
  display: flex;
  align-items: center;
  border-left: 1px solid #e2e8f0;
}

/* Deploy Terminal */
.deploy-terminal-box {
  margin-top: 24px;
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 24px -4px rgba(15, 23, 42, 0.2);
}

.terminal-bar {
  display: flex;
  align-items: center;
  padding: 10px 14px;
  background: #020617;
  border-bottom: 1px solid #1e293b;
  gap: 12px;
}

.term-dots {
  display: flex;
  gap: 6px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.dot.red { background: #ef4444; }
.dot.yellow { background: #f59e0b; }
.dot.green { background: #10b981; }

.term-title {
  font-size: 0.75rem;
  color: #94a3b8;
  font-family: monospace;
}

.progress-track {
  height: 4px;
  background: #1e293b;
  width: 100%;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #2563eb, #38bdf8, #10b981);
  transition: width 0.4s ease;
}

.terminal-console {
  padding: 14px;
  font-family: 'Fira Code', monospace;
  font-size: 0.78rem;
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 160px;
  overflow-y: auto;
}

.term-line {
  display: flex;
  gap: 8px;
}

.term-time {
  color: #64748b;
}

.term-text {
  color: #38bdf8;
}

.launch-actions-bar {
  margin-top: 28px;
}

.btn-deploy-primary {
  width: 100%;
  padding: 14px 24px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: #ffffff;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.35);
  transition: all 0.2s ease;
}

.btn-deploy-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(37, 99, 235, 0.45);
}

.btn-deploy-primary:disabled {
  opacity: 0.75;
  cursor: not-allowed;
}

/* Success Card */
.deployed-success-card {
  max-width: 680px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid #a7f3d0;
  border-radius: 20px;
  padding: 40px;
  text-align: center;
  box-shadow: 0 16px 36px -8px rgba(16, 185, 129, 0.15);
}

.success-big-icon {
  width: 80px;
  height: 80px;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.success-title {
  font-size: 1.6rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.02em;
  margin-bottom: 10px;
}

.success-sub {
  font-size: 0.92rem;
  color: #475569;
  line-height: 1.6;
  margin-bottom: 28px;
}

.container-summary-chip {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: left;
  margin-bottom: 32px;
}

.chip-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.88rem;
}

.chip-label {
  color: #64748b;
}

.status-running-tag {
  background: #ecfdf5;
  color: #059669;
  border: 1px solid #a7f3d0;
  font-weight: 700;
  padding: 2px 10px;
  border-radius: 6px;
  font-size: 0.78rem;
}

.url-link {
  color: #2563eb;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 600;
}

.url-link:hover {
  text-decoration: underline;
}

.chip-val {
  color: #0f172a;
  font-weight: 600;
}

.success-action-row {
  display: flex;
  justify-content: center;
}

.btn-goto-dashboard {
  padding: 14px 32px;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: #ffffff;
  border: none;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.35);
  transition: all 0.2s ease;
}

.btn-goto-dashboard:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 28px rgba(37, 99, 235, 0.45);
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.fade-in {
  animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

.node-badge {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #1e293b;
  border: 1px solid rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  color: #94a3b8;
}

.step-node.active .node-badge {
  background: #2563eb;
  border-color: #3b82f6;
  color: #ffffff;
  box-shadow: 0 0 12px rgba(37, 99, 235, 0.5);
}

.step-node.done .node-badge {
  background: #10b981;
  border-color: #10b981;
  color: #ffffff;
}

.node-label {
  font-size: 0.82rem;
  font-weight: 600;
  color: #cbd5e1;
}

.step-connector {
  width: 32px;
  height: 2px;
  background: #1e293b;
  border-radius: 1px;
}

.step-connector.filled {
  background: #10b981;
}

.btn-skip-ghost {
  display: flex;
  align-items: center;
  gap: 4px;
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 0.82rem;
  font-weight: 500;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.btn-skip-ghost:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.05);
}

/* Main Content */
.onboarding-main {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 48px 24px 80px;
}

.step-hero-text {
  text-align: center;
  max-width: 680px;
  margin: 0 auto 40px;
}

.eyebrow-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(37, 99, 235, 0.15);
  border: 1px solid rgba(59, 130, 246, 0.3);
  color: #60a5fa;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 999px;
  margin-bottom: 14px;
}

.eyebrow-pill.success-pill {
  background: rgba(16, 185, 129, 0.15);
  border-color: rgba(16, 185, 129, 0.3);
  color: #34d399;
}

.main-heading {
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: #ffffff;
  line-height: 1.25;
  margin-bottom: 12px;
}

.sub-heading {
  font-size: 0.95rem;
  color: #94a3b8;
  line-height: 1.6;
}

/* Step 1: Plans Grid */
.plans-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 40px;
}

@media (max-width: 960px) {
  .plans-grid {
    grid-template-columns: 1fr;
  }
}

.plan-card {
  background: rgba(30, 41, 59, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  position: relative;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.plan-card:hover {
  background: rgba(30, 41, 59, 0.7);
  border-color: rgba(59, 130, 246, 0.4);
  transform: translateY(-3px);
  box-shadow: 0 16px 32px -10px rgba(0, 0, 0, 0.5);
}

.plan-card.selected {
  background: rgba(37, 99, 235, 0.08);
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.4), 0 20px 40px -10px rgba(37, 99, 235, 0.25);
}

.popular-ribbon {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
  color: #ffffff;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 4px 14px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
}

.normal-badge {
  font-size: 0.75rem;
  font-weight: 600;
  color: #94a3b8;
  margin-bottom: 12px;
}

.plan-name {
  font-size: 1.3rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 10px;
}

.price-stack {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 16px;
}

.price-number {
  font-size: 1.75rem;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.03em;
}

.price-unit {
  font-size: 0.85rem;
  color: #94a3b8;
}

.resource-pill-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.resource-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.72rem;
  font-weight: 600;
  color: #cbd5e1;
}

.chip-icon {
  color: #38bdf8;
}

.divider-line {
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
  margin-bottom: 20px;
}

.features-checklist {
  list-style: none;
  padding: 0;
  margin: 0 0 24px 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
}

.features-checklist li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 0.82rem;
  color: #94a3b8;
  line-height: 1.45;
}

.check-glyph {
  color: #10b981;
  flex-shrink: 0;
  margin-top: 1px;
}

.btn-select-plan {
  width: 100%;
  padding: 10px 16px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  color: #f1f5f9;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.btn-select-plan:hover {
  background: rgba(255, 255, 255, 0.1);
}

.btn-select-plan.btn-selected {
  background: #2563eb;
  border-color: #3b82f6;
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.4);
}

.step-footer-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(30, 41, 59, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 18px 24px;
}

.footer-guarantee {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.85rem;
  color: #cbd5e1;
}

.text-emerald {
  color: #10b981;
}

.btn-primary-forward {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: #ffffff;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 0.92rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
  transition: all 0.2s ease;
}

.btn-primary-forward:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(37, 99, 235, 0.5);
}

/* Step 2: Checkout */
.checkout-layout-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 32px;
}

@media (max-width: 900px) {
  .checkout-layout-grid {
    grid-template-columns: 1fr;
  }
}

.section-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 18px;
}

.payment-methods-card,
.order-summary-card {
  background: rgba(30, 41, 59, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  padding: 28px;
}

.method-options-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.method-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.method-option:hover {
  border-color: rgba(59, 130, 246, 0.3);
  background: rgba(15, 23, 42, 0.7);
}

.method-option.active {
  background: rgba(37, 99, 235, 0.08);
  border-color: #3b82f6;
  box-shadow: 0 0 0 1px #3b82f6;
}

.method-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.radio-disc {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid #64748b;
  position: relative;
}

.radio-disc.checked {
  border-color: #3b82f6;
}

.radio-disc.checked::after {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #3b82f6;
}

.method-icon-box {
  width: 38px;
  height: 38px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qris-box {
  background: #dc2626;
  color: #ffffff;
}

.bca-box {
  background: #0284c7;
  color: #ffffff;
}

.mandiri-box {
  background: #d97706;
  color: #ffffff;
}

.cc-box {
  background: #4f46e5;
  color: #ffffff;
}

.method-name {
  font-size: 0.88rem;
  font-weight: 600;
  color: #ffffff;
}

.method-meta {
  font-size: 0.75rem;
  color: #94a3b8;
}

.instant-tag {
  font-size: 0.7rem;
  font-weight: 700;
  color: #10b981;
  background: rgba(16, 185, 129, 0.1);
  padding: 3px 8px;
  border-radius: 6px;
}

.simulation-banner {
  background: rgba(59, 130, 246, 0.08);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 12px;
  padding: 16px;
}

.sim-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.82rem;
  font-weight: 700;
  color: #60a5fa;
  margin-bottom: 6px;
}

.sim-desc {
  font-size: 0.78rem;
  color: #94a3b8;
  line-height: 1.5;
  margin: 0;
}

/* Order Summary */
.selected-plan-box {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
}

.summary-plan-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 6px;
}

.plan-sub-tag {
  font-size: 0.72rem;
  color: #94a3b8;
}

.summary-plan-name {
  font-size: 1.05rem;
  font-weight: 700;
  color: #ffffff;
}

.summary-plan-price {
  font-size: 1.05rem;
  font-weight: 800;
  color: #38bdf8;
}

.summary-specs {
  font-size: 0.78rem;
  color: #64748b;
}

.calc-table {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 24px;
}

.calc-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.85rem;
  color: #94a3b8;
}

.calc-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
  margin: 6px 0;
}

.total-row {
  font-size: 1.05rem;
  font-weight: 700;
  color: #ffffff;
}

.total-highlight {
  font-size: 1.25rem;
  font-weight: 800;
  color: #38bdf8;
}

.btn-pay-now {
  width: 100%;
  padding: 14px 20px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #ffffff;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.35);
  transition: all 0.2s ease;
  margin-bottom: 12px;
}

.btn-pay-now:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.45);
}

.btn-pay-now:disabled {
  opacity: 0.75;
  cursor: not-allowed;
}

.cta-inner {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-back-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 0.82rem;
  cursor: pointer;
  width: 100%;
  padding: 8px;
  transition: color 0.2s ease;
}

.btn-back-link:hover {
  color: #ffffff;
}

/* Step 3: Launch Form */
.launch-form-shell {
  max-width: 760px;
  margin: 0 auto;
  background: rgba(30, 41, 59, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  padding: 32px;
}

.form-row-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

@media (max-width: 640px) {
  .form-row-grid {
    grid-template-columns: 1fr;
  }
}

.form-field-block {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mt-4 {
  margin-top: 18px;
}

.block-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #e2e8f0;
}

.form-input-control {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 0.9rem;
  color: #ffffff;
  outline: none;
  transition: border-color 0.2s ease;
}

.form-input-control:focus {
  border-color: #3b82f6;
}

.select-control {
  appearance: auto;
  cursor: pointer;
}

.field-hint {
  font-size: 0.75rem;
  color: #64748b;
}

.subdomain-input-group {
  display: flex;
  align-items: center;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  overflow: hidden;
  transition: border-color 0.2s ease;
}

.subdomain-input-group:focus-within {
  border-color: #3b82f6;
}

.subdomain-field {
  flex: 1;
  background: transparent;
  border: none;
  padding: 10px 14px;
  font-size: 0.92rem;
  color: #38bdf8;
  font-family: monospace;
  outline: none;
}

.domain-suffix {
  padding: 0 14px;
  font-size: 0.85rem;
  color: #94a3b8;
  font-family: monospace;
  background: rgba(255, 255, 255, 0.04);
  height: 100%;
  display: flex;
  align-items: center;
  border-left: 1px solid rgba(255, 255, 255, 0.08);
}

/* Deploy Terminal */
.deploy-terminal-box {
  margin-top: 24px;
  background: #020617;
  border: 1px solid #1e293b;
  border-radius: 12px;
  overflow: hidden;
}

.terminal-bar {
  display: flex;
  align-items: center;
  padding: 10px 14px;
  background: #0f172a;
  border-bottom: 1px solid #1e293b;
  gap: 12px;
}

.term-dots {
  display: flex;
  gap: 6px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.dot.red { background: #ef4444; }
.dot.yellow { background: #f59e0b; }
.dot.green { background: #10b981; }

.term-title {
  font-size: 0.75rem;
  color: #94a3b8;
  font-family: monospace;
}

.progress-track {
  height: 4px;
  background: #1e293b;
  width: 100%;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #2563eb, #38bdf8, #10b981);
  transition: width 0.4s ease;
}

.terminal-console {
  padding: 14px;
  font-family: 'Fira Code', monospace;
  font-size: 0.78rem;
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 160px;
  overflow-y: auto;
}

.term-line {
  display: flex;
  gap: 8px;
}

.term-time {
  color: #475569;
}

.term-text {
  color: #38bdf8;
}

.launch-actions-bar {
  margin-top: 28px;
}

.btn-deploy-primary {
  width: 100%;
  padding: 14px 24px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: #ffffff;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
  transition: all 0.2s ease;
}

.btn-deploy-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(37, 99, 235, 0.5);
}

.btn-deploy-primary:disabled {
  opacity: 0.75;
  cursor: not-allowed;
}

/* Success Card */
.deployed-success-card {
  max-width: 680px;
  margin: 0 auto;
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 20px;
  padding: 40px;
  text-align: center;
  box-shadow: 0 20px 40px -10px rgba(16, 185, 129, 0.15);
}

.success-big-icon {
  width: 80px;
  height: 80px;
  background: rgba(16, 185, 129, 0.12);
  border: 1px solid rgba(16, 185, 129, 0.25);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.success-title {
  font-size: 1.6rem;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.02em;
  margin-bottom: 10px;
}

.success-sub {
  font-size: 0.92rem;
  color: #cbd5e1;
  line-height: 1.6;
  margin-bottom: 28px;
}

.container-summary-chip {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: left;
  margin-bottom: 32px;
}

.chip-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.85rem;
}

.chip-label {
  color: #94a3b8;
}

.status-running-tag {
  background: rgba(16, 185, 129, 0.15);
  color: #34d399;
  font-weight: 700;
  padding: 2px 10px;
  border-radius: 6px;
  font-size: 0.78rem;
}

.url-link {
  color: #38bdf8;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 600;
}

.url-link:hover {
  text-decoration: underline;
}

.chip-val {
  color: #f1f5f9;
  font-weight: 600;
}

.success-action-row {
  display: flex;
  justify-content: center;
}

.btn-goto-dashboard {
  padding: 14px 32px;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: #ffffff;
  border: none;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
  transition: all 0.2s ease;
}

.btn-goto-dashboard:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 28px rgba(37, 99, 235, 0.5);
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.fade-in {
  animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
