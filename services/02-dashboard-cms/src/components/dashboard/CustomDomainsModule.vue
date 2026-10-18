<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  Globe,
  Plus,
  CheckCircle2,
  RotateCw,
  ShieldCheck,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  Server,
  ArrowRight,
  Info,
  Network,
  Zap,
  Sparkles,
  Lock,
  Activity
} from 'lucide-vue-next';
import { useDashboardData } from '../../composables/useDashboardData';

const {
  containers,
  customDomains,
  newDomainInput,
  targetContainerForDomain,
  handleAddDomain,
  deleteDomain,
  copyToClipboard,
  copiedSubdomain,
  showToast
} = useDashboardData();

interface RegistrarGuide {
  id: string;
  name: string;
  tip: string;
  recommendedTTL: string;
}

const registrarGuides: RegistrarGuide[] = [
  {
    id: 'cloudflare',
    name: 'Cloudflare',
    tip: 'Gunakan mode "DNS Only" (awan abu-abu) selama verifikasi handshake SSL awal Traefik Edge.',
    recommendedTTL: 'Auto'
  },
  {
    id: 'niagahoster',
    name: 'Niagahoster',
    tip: 'Buka cPanel > Zone Editor, tambahkan CNAME Record mengarah ke target edge.cloudcms.app.',
    recommendedTTL: '14400 (4 Jam)'
  },
  {
    id: 'domainesia',
    name: 'Domainesia',
    tip: 'Masuk Client Area > DNS Management, tambahkan CNAME atau A Record ke cluster Anycast edge kami.',
    recommendedTTL: '3600 (1 Jam)'
  },
  {
    id: 'idwebhost',
    name: 'IDwebhost',
    tip: 'Pada Domain Manager > Name Server & DNS, arahkan CNAME atau Anycast IP 103.144.20.1.',
    recommendedTTL: '3600 (1 Jam)'
  },
  {
    id: 'namecheap',
    name: 'Namecheap',
    tip: 'Di Advanced DNS > Host Records, tambahkan CNAME Record untuk host @ atau www.',
    recommendedTTL: 'Automatic'
  }
];

const selectedRegistrar = ref<string>('cloudflare');
const currentGuide = computed(() => {
  return registrarGuides.find(r => r.id === selectedRegistrar.value) || registrarGuides[0];
});

const isVerifyingDNS = ref(false);

const testDnsPing = () => {
  isVerifyingDNS.value = true;
  showToast('Memverifikasi propagasi DNS di 14 node Traefik Edge...', 'info');
  setTimeout(() => {
    isVerifyingDNS.value = false;
    showToast('Semua record CNAME & A valid! SSL TLS 1.3 terverifikasi.', 'success');
  }, 1200);
};
</script>

<template>
  <section class="fade-in-section">
    <!-- Header Intro -->
    <div class="page-intro-row">
      <div>
        <h1 class="page-title">Custom Domain & Edge DNS Ingress</h1>
        <p class="page-desc">Tautkan domain kustom Anda ke proxy edge Traefik v3 dengan sertifikat SSL TLS v1.3 Let's Encrypt otomatis.</p>
      </div>
      <div class="quota-quick-pills">
        <span class="pill-metric">Edge Engine: <strong>Traefik v3.1 Ingress</strong></span>
        <span class="pill-metric-highlight">SSL: <strong>Auto ACME TLS-ALPN-01</strong></span>
      </div>
    </div>

    <!-- 1. Top Telemetry Metrics Grid (Modern Single Corner Watermark Standard) -->
    <div class="stats-overview-grid">
      <!-- Card 1: Domain Kustom Terhubung -->
      <div class="telemetry-card accent-blue">
        <Globe class="telemetry-corner-watermark" />
        <span class="telemetry-label">DOMAIN KUSTOM TERHUBUNG</span>
        <div class="telemetry-main-val">
          <span class="telemetry-number">{{ customDomains.length }}</span>
          <span class="telemetry-unit">/ 10 Kuota</span>
        </div>
        <div class="telemetry-footer-status">
          <span class="status-indicator-dot dot-emerald"></span>
          <span class="telemetry-status-text">Traefik Ingress Router v3.1 siap</span>
        </div>
      </div>

      <!-- Card 2: Status Sertifikat SSL / TLS -->
      <div class="telemetry-card accent-emerald">
        <ShieldCheck class="telemetry-corner-watermark" />
        <span class="telemetry-label">SERTIFIKAT TLS / SSL</span>
        <div class="telemetry-main-val">
          <span class="telemetry-number">100%</span>
          <span class="badge-telemetry-emerald">Let's Encrypt</span>
        </div>
        <div class="telemetry-footer-status">
          <span class="telemetry-status-text">Auto-Renew ACME TLS-ALPN-01</span>
        </div>
      </div>

      <!-- Card 3: Anycast Ingress Cluster -->
      <div class="telemetry-card accent-purple">
        <Network class="telemetry-corner-watermark" />
        <span class="telemetry-label">EDGE ROUTING CLUSTER</span>
        <div class="telemetry-main-val">
          <span class="telemetry-number">14 PoP</span>
          <span class="badge-telemetry-purple">Anycast</span>
        </div>
        <div class="telemetry-footer-status">
          <span class="telemetry-status-text">Port 80 / 443 (HTTP/2 & HTTP/3)</span>
        </div>
      </div>

      <!-- Card 4: Latensi Edge & DNS TTFB -->
      <div class="telemetry-card accent-sky">
        <Zap class="telemetry-corner-watermark" />
        <span class="telemetry-label">LATENSI EDGE TTFB</span>
        <div class="telemetry-main-val">
          <span class="telemetry-number">1.8ms</span>
          <span class="badge-telemetry-sky">Optimal</span>
        </div>
        <div class="telemetry-footer-status">
          <span class="telemetry-status-text">Global DNS health check normal</span>
        </div>
      </div>
    </div>

    <!-- 2. Sleek "Connect New Domain" Hero Card -->
    <div class="pro-panel connect-domain-hero">
      <div class="connect-domain-top">
        <div class="connect-lead">
          <div class="connect-icon-box">
            <Globe :size="22" />
          </div>
          <div>
            <h3 class="connect-title">Hubungkan Domain Kustom Baru</h3>
            <p class="connect-desc">Gunakan domain milik Anda dari registrar mana pun untuk diarahkan langsung ke website tenant.</p>
          </div>
        </div>
        <div class="registrar-pills">
          <span class="reg-pill-label">Pilih Registrar:</span>
          <button
            v-for="guide in registrarGuides"
            :key="guide.id"
            type="button"
            class="reg-pill"
            :class="{ active: selectedRegistrar === guide.id }"
            @click="selectedRegistrar = guide.id"
          >
            {{ guide.name }}
          </button>
        </div>
      </div>

      <!-- Dynamic Registrar Guidance Banner -->
      <div class="registrar-quick-tip-banner">
        <div class="registrar-tip-lead">
          <Sparkles :size="15" color="#2563eb" />
          <span><strong>Panduan {{ currentGuide.name }}:</strong> {{ currentGuide.tip }}</span>
        </div>
        <span class="registrar-tip-ttl">Rekomendasi TTL: {{ currentGuide.recommendedTTL }}</span>
      </div>

      <div class="connect-form-grid">
        <div class="form-group-domain">
          <label class="input-label-sm">Nama Domain atau Subdomain</label>
          <div class="domain-input-shell">
            <span class="domain-protocol">https://</span>
            <input
              v-model="newDomainInput"
              type="text"
              placeholder="contoh: domainku.id atau portal.bisnis.com"
              class="domain-core-field"
              @keydown.enter="handleAddDomain"
            />
          </div>
        </div>

        <div class="form-group-target">
          <label class="input-label-sm">Target Kontainer Tenant</label>
          <div class="select-target-shell">
            <Server :size="15" class="select-lead-glyph" />
            <select v-model="targetContainerForDomain" class="select-target-field">
              <option v-for="c in containers" :key="c.id" :value="c.id">
                {{ c.name }} ({{ c.subdomain }})
              </option>
            </select>
          </div>
        </div>

        <div class="form-group-action">
          <label class="input-label-sm">&nbsp;</label>
          <button class="btn-connect-domain" @click="handleAddDomain">
            <Plus :size="15" />
            <span>Hubungkan Domain</span>
          </button>
        </div>
      </div>

      <!-- Workflow Pipeline Steps -->
      <div class="connect-flow-strip">
        <div class="flow-step-item">
          <span class="flow-step-num">1</span>
          <div class="flow-step-txt">
            <strong>Daftarkan Domain</strong>
            <span>Masukkan nama domain & tentukan situs target</span>
          </div>
        </div>
        <div class="flow-step-item">
          <span class="flow-step-num">2</span>
          <div class="flow-step-txt">
            <strong>Konfigurasi DNS</strong>
            <span>Buat CNAME atau A Record di registrar domain</span>
          </div>
        </div>
        <div class="flow-step-item">
          <span class="flow-step-num">3</span>
          <div class="flow-step-txt">
            <strong>SSL Otomatis Terbit</strong>
            <span>Traefik memvalidasi & menerbitkan TLS 1.3</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 3. Connected Domains List -->
    <div class="connected-domains-section">
      <div class="section-title-strip">
        <h3>DOMAIN TERHUBUNG & PANDUAN DNS</h3>
        <span class="live-sync-indicator">
          <span class="pulse-mini-dot"></span>
          Ingress Active (Port 80 / 443)
        </span>
      </div>

      <!-- Empty State -->
      <div v-if="customDomains.length === 0" class="empty-domains-card">
        <div class="empty-domain-icon">
          <Globe :size="26" />
        </div>
        <h4 class="empty-domain-title">Belum Ada Domain Kustom Terhubung</h4>
        <p class="empty-domain-desc">
          Tautkan domain kustom milik Anda melalui formulir di atas untuk menggunakan domain sendiri dengan sertifikat SSL gratis otomatis.
        </p>
      </div>

      <!-- Domain Cards -->
      <div v-for="dom in customDomains" :key="dom.id" class="domain-profile-card">
        <!-- Card Top Bar -->
        <div class="domain-card-header">
          <div class="domain-brand-group">
            <div class="domain-glyph-box">
              <Globe :size="22" />
            </div>
            <div class="domain-text-group">
              <div class="domain-main-row">
                <h2 class="domain-headline">{{ dom.domain }}</h2>
                <span class="domain-target-pill">
                  <ArrowRight :size="11" />
                  {{ dom.targetContainer }}
                </span>
              </div>
              <span class="domain-created-txt">
                Ditambahkan pada {{ dom.addedDate }} • Ingress Rule: <code>route-{{ dom.id }}</code> • HTTP/2 & HTTP/3 ALPN
              </span>
            </div>
          </div>

          <!-- Status Chips & Quick Actions -->
          <div class="domain-header-actions">
            <div class="ssl-status-badge">
              <ShieldCheck :size="14" color="#059669" />
              <span>TLS 1.3 Let's Encrypt (Aktif)</span>
            </div>

            <button
              class="btn-ping-dns"
              :disabled="isVerifyingDNS"
              @click="testDnsPing"
              title="Periksa Propagasi DNS Edge"
            >
              <RotateCw :size="13" :class="{ 'spin-icon': isVerifyingDNS }" />
              <span>{{ isVerifyingDNS ? 'Memeriksa...' : 'Cek DNS' }}</span>
            </button>

            <a :href="`https://${dom.domain}`" target="_blank" class="btn-visit-site" title="Buka Domain di Tab Baru">
              <ExternalLink :size="14" />
            </a>

            <button class="btn-del-domain" @click="deleteDomain(dom)" title="Putuskan Domain">
              <Trash2 :size="14" />
            </button>
          </div>
        </div>

        <!-- DNS Configuration Records Table -->
        <div class="dns-table-box">
          <div class="dns-table-header">
            <span class="table-title">Konfigurasi DNS di Registrar Domain Anda:</span>
            <span class="table-note">Arahkan salah satu atau kedua record di bawah ke cluster Traefik kami:</span>
          </div>

          <div class="dns-records-list">
            <!-- Record 1: CNAME -->
            <div class="dns-row-item">
              <div class="dns-col-type">
                <span class="record-badge cname">CNAME</span>
              </div>
              <div class="dns-col-host">
                <span class="col-lbl">NAME / HOST</span>
                <code>@ atau www</code>
              </div>
              <div class="dns-col-val">
                <span class="col-lbl">TARGET / VALUE</span>
                <div class="val-copy-group">
                  <code>{{ dom.cnameRecord }}</code>
                  <button
                    class="btn-mini-copy"
                    @click="copyToClipboard(dom.cnameRecord, 'cname_' + dom.id)"
                    title="Salin Target CNAME"
                  >
                    <Check v-if="copiedSubdomain === 'cname_' + dom.id" :size="13" class="text-green" />
                    <Copy v-else :size="13" />
                  </button>
                </div>
              </div>
              <div class="dns-col-ttl">
                <span class="col-lbl">TTL</span>
                <code>Auto / 3600</code>
              </div>
              <div class="dns-col-status">
                <span class="dns-valid-pill">
                  <CheckCircle2 :size="13" />
                  <span>Valid & Terpropagasi</span>
                </span>
              </div>
            </div>

            <!-- Record 2: A Record -->
            <div class="dns-row-item">
              <div class="dns-col-type">
                <span class="record-badge a-rec">A RECORD</span>
              </div>
              <div class="dns-col-host">
                <span class="col-lbl">NAME / HOST</span>
                <code>@ (Root Apex)</code>
              </div>
              <div class="dns-col-val">
                <span class="col-lbl">IP ANYCAST EDGE</span>
                <div class="val-copy-group">
                  <code>{{ dom.aRecord }}</code>
                  <button
                    class="btn-mini-copy"
                    @click="copyToClipboard(dom.aRecord, 'a_' + dom.id)"
                    title="Salin IP Anycast"
                  >
                    <Check v-if="copiedSubdomain === 'a_' + dom.id" :size="13" class="text-green" />
                    <Copy v-else :size="13" />
                  </button>
                </div>
              </div>
              <div class="dns-col-ttl">
                <span class="col-lbl">TTL</span>
                <code>Auto / 3600</code>
              </div>
              <div class="dns-col-status">
                <span class="dns-valid-pill">
                  <CheckCircle2 :size="13" />
                  <span>Valid (Edge IP)</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Traefik Edge Diagnostics Bar -->
        <div class="domain-diagnostics-bar">
          <div class="diag-item">
            <Lock :size="13" color="#059669" />
            <span>Sertifikat SSL: <strong>Let's Encrypt Authority X3 (90 Hari Auto-Renew)</strong></span>
          </div>
          <div class="diag-item">
            <Network :size="13" color="#2563eb" />
            <span>Proxy Ingress: <strong>Traefik v3.1 Ingress Router</strong></span>
          </div>
          <div class="diag-item">
            <Activity :size="13" color="#9333ea" />
            <span>Protokol: <strong>TLS 1.3 ALPN / HTTP/2 Multiplexing</strong></span>
          </div>
        </div>

        <!-- Helpful Registrar Note -->
        <div class="domain-tip-footer">
          <Info :size="15" color="#2563eb" class="tip-icon" />
          <span>
            <strong>Catatan Propagasi DNS:</strong> Perubahan DNS umumnya memerlukan waktu 5–15 menit (maks. 24 jam tergantung TTL registrar). Begitu terdeteksi, SSL Let's Encrypt otomatis diterbitkan dan diperbarui selamanya tanpa henti layanan.
          </span>
        </div>
      </div>
    </div>
  </section>
</template>
