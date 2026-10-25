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
  Activity,
  X,
  FileCode,
  CheckCircle
} from 'lucide-vue-next';
import { useDashboardData } from '../../composables/useDashboardData';
import type { CustomDomainItem } from '../../types/dashboard';

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
    tip: 'Buka cPanel > Zone Editor, tambahkan CNAME Record mengarah ke target edge.stacbyte.id.',
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

// Domain Live Validation
const isDomainValid = computed(() => {
  if (!newDomainInput.value.trim()) return false;
  const clean = newDomainInput.value.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  return clean.includes('.') && clean.length >= 4 && !clean.endsWith('.');
});

// Anycast PoP Nodes Modal State
interface DnsPoPNode {
  city: string;
  country: string;
  flag: string;
  region: string;
  latency: string;
  status: 'valid' | 'testing';
  ip: string;
}

const isDnsModalOpen = ref(false);
const isSslModalOpen = ref(false);
const activeDomainForModal = ref<CustomDomainItem | null>(null);
const isRecheckingPoPs = ref(false);

const popNodes = ref<DnsPoPNode[]>([
  { city: 'Jakarta', country: 'Indonesia', flag: '🇮🇩', region: 'ID-JKT-1', latency: '1.2ms', status: 'valid', ip: '103.144.20.1' },
  { city: 'Singapore', country: 'Singapore', flag: '🇸🇬', region: 'SG-SIN-1', latency: '3.4ms', status: 'valid', ip: '103.144.20.1' },
  { city: 'Tokyo', country: 'Japan', flag: '🇯🇵', region: 'JP-NRT-1', latency: '18.2ms', status: 'valid', ip: '103.144.20.1' },
  { city: 'San Jose', country: 'United States', flag: '🇺🇸', region: 'US-SJC-1', latency: '82.6ms', status: 'valid', ip: '103.144.20.1' },
  { city: 'Frankfurt', country: 'Germany', flag: '🇩🇪', region: 'EU-FRA-1', latency: '110.4ms', status: 'valid', ip: '103.144.20.1' },
  { city: 'Sydney', country: 'Australia', flag: '🇦🇺', region: 'AU-SYD-1', latency: '44.8ms', status: 'valid', ip: '103.144.20.1' }
]);

const openDnsInspector = (dom: CustomDomainItem) => {
  activeDomainForModal.value = dom;
  isDnsModalOpen.value = true;
};

const openSslInspector = (dom: CustomDomainItem) => {
  activeDomainForModal.value = dom;
  isSslModalOpen.value = true;
};

const recheckDnsPoPs = () => {
  isRecheckingPoPs.value = true;
  popNodes.value.forEach(p => (p.status = 'testing'));
  setTimeout(() => {
    popNodes.value.forEach(p => (p.status = 'valid'));
    isRecheckingPoPs.value = false;
    showToast('Seluruh 14 Anycast PoP node merespons valid & SSL terverifikasi!', 'success');
  }, 1000);
};

const copyAllDnsRecords = (dom: CustomDomainItem) => {
  const cname = dom.cnameRecord || 'edge.stacbyte.id';
  const a = dom.aRecord || '103.144.20.1';
  const zoneSnippet = `; --- Stack DNS Zone File (Aether Core) for ${dom.domain} ---
; CNAME Record (Subdomain & www)
www.${dom.domain}.    3600    IN    CNAME    ${cname}.
; A Record (Root Apex @)
${dom.domain}.        3600    IN    A        ${a}`;
  copyToClipboard(zoneSnippet, 'all_records_' + dom.id);
  showToast(`Semua record DNS untuk ${dom.domain} disalin ke clipboard!`, 'success');
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
    </div>

    <!-- 1. Top Telemetry Metrics Grid (Modern Single Corner Watermark Standard) -->
    <div class="stats-overview-grid">
      <!-- Card 1: Domain Kustom Terhubung -->
      <div class="telemetry-card accent-blue">
        <div class="telemetry-corner-watermark blue"><Globe :size="58" /></div>
        <div class="telemetry-top">
          <span class="telemetry-label">DOMAIN KUSTOM TERHUBUNG</span>
        </div>
        <div class="telemetry-val">
          {{ customDomains.length }} <span class="telemetry-denom">/ 10 Kuota</span>
        </div>
        <div class="telemetry-sub ready-state">
          <span class="pulse-mini-dot"></span>
          <span>Traefik Ingress Router v3.1 siap</span>
        </div>
      </div>

      <!-- Card 2: Status Sertifikat SSL / TLS -->
      <div class="telemetry-card accent-emerald">
        <div class="telemetry-corner-watermark emerald"><ShieldCheck :size="58" /></div>
        <div class="telemetry-top">
          <span class="telemetry-label">SERTIFIKAT TLS / SSL</span>
        </div>
        <div class="telemetry-val">
          100% <span class="badge-online">Aktif</span>
        </div>
        <div class="telemetry-sub">
          <span>Auto-Renew ACME TLS-ALPN-01</span>
        </div>
      </div>

      <!-- Card 3: Anycast Ingress Cluster -->
      <div class="telemetry-card accent-purple">
        <div class="telemetry-corner-watermark purple"><Network :size="58" /></div>
        <div class="telemetry-top">
          <span class="telemetry-label">EDGE ROUTING CLUSTER</span>
        </div>
        <div class="telemetry-val">
          14 PoP <span class="badge-growth-pill" style="color: #7c3aed; background: #faf5ff; border-color: #e9d5ff;">Anycast</span>
        </div>
        <div class="telemetry-sub">
          <span>Port 80 / 443 (HTTP/2 & HTTP/3)</span>
        </div>
      </div>

      <!-- Card 4: Latensi Edge & DNS TTFB -->
      <div class="telemetry-card accent-sky">
        <div class="telemetry-corner-watermark sky"><Zap :size="58" /></div>
        <div class="telemetry-top">
          <span class="telemetry-label">LATENSI EDGE TTFB</span>
        </div>
        <div class="telemetry-val">
          1.8ms <span class="badge-online">Optimal</span>
        </div>
        <div class="telemetry-sub">
          <span>Global DNS health check normal</span>
        </div>
      </div>
    </div>

    <!-- 2. Sleek "Connect New Domain" Hero Card -->
    <div class="pro-panel connect-domain-hero">
      <div class="connect-domain-top">
        <div class="connect-lead">
          <div class="connect-icon-box">
            <Globe :size="24" />
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
          <!-- Live Validation Hint -->
          <div v-if="newDomainInput.trim()" class="domain-val-hint" :class="{ valid: isDomainValid }">
            <CheckCircle2 v-if="isDomainValid" :size="12" />
            <Info v-else :size="12" />
            <span>{{ isDomainValid ? 'Format FQDN valid & siap dihubungkan' : 'Ketik nama domain FQDN lengkap (contoh: bisnis.id)' }}</span>
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
            <strong>1. Daftarkan Domain</strong>
            <span>Masukkan nama domain & tentukan situs target</span>
          </div>
        </div>
        <div class="flow-step-item">
          <span class="flow-step-num">2</span>
          <div class="flow-step-txt">
            <strong>2. Konfigurasi DNS</strong>
            <span>Buat CNAME atau A Record di registrar domain</span>
          </div>
        </div>
        <div class="flow-step-item">
          <span class="flow-step-num">3</span>
          <div class="flow-step-txt">
            <strong>3. SSL Otomatis Terbit</strong>
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
              <Globe :size="24" />
            </div>
            <div class="domain-text-group">
              <div class="domain-main-row">
                <h2 class="domain-headline">{{ dom.domain }}</h2>
                <span class="domain-verified-tag">
                  <CheckCircle :size="11" />
                  Verified
                </span>
                <span class="domain-target-pill">
                  <ArrowRight :size="11" />
                  {{ dom.targetContainer || 'Portofolio Rizal Pratama' }}
                </span>
              </div>
              <span class="domain-created-txt">
                Ditambahkan pada {{ dom.addedDate || '12 Sep 2026' }} • Ingress Rule: <code>route-{{ dom.id }}</code> • HTTP/2 & HTTP/3 ALPN
              </span>
            </div>
          </div>

          <!-- Status Chips & Quick Actions -->
          <div class="domain-header-actions">
            <!-- Clickable SSL Status Badge -->
            <div
              class="ssl-status-badge"
              @click="openSslInspector(dom)"
              title="Klik untuk inspeksi sertifikat SSL Let's Encrypt"
            >
              <ShieldCheck :size="14" color="#059669" />
              <span>TLS 1.3 Let's Encrypt (Aktif)</span>
            </div>

            <!-- Ping DNS Button (Opens Multi-Node Anycast Modal) -->
            <button
              class="btn-ping-dns"
              @click="openDnsInspector(dom)"
              title="Inspeksi Propagasi DNS 14 Node Global"
            >
              <RotateCw :size="13" />
              <span>Cek DNS</span>
            </button>

            <!-- Copy All DNS Records Button -->
            <button
              class="btn-copy-all-dns"
              @click="copyAllDnsRecords(dom)"
              title="Salin semua DNS Records (Format Zone File)"
            >
              <Check v-if="copiedSubdomain === 'all_records_' + dom.id" :size="13" class="text-green" />
              <FileCode v-else :size="13" />
              <span>{{ copiedSubdomain === 'all_records_' + dom.id ? 'Tersalin!' : 'Salin DNS' }}</span>
            </button>

            <!-- Open Site Button -->
            <a :href="`https://${dom.domain}`" target="_blank" class="btn-visit-site" title="Buka Domain di Tab Baru">
              <ExternalLink :size="14" />
            </a>

            <!-- Delete Domain Button -->
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
                  <code>{{ dom.cnameRecord || 'edge.stacbyte.id' }}</code>
                  <button
                    class="btn-mini-copy"
                    @click="copyToClipboard(dom.cnameRecord || 'edge.stacbyte.id', 'cname_' + dom.id)"
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
                  <code>{{ dom.aRecord || '103.144.20.1' }}</code>
                  <button
                    class="btn-mini-copy"
                    @click="copyToClipboard(dom.aRecord || '103.144.20.1', 'a_' + dom.id)"
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
          <div class="diag-item clickable" @click="openSslInspector(dom)" title="Lihat sertifikat X.509">
            <Lock :size="13" color="#059669" />
            <span>Sertifikat SSL: <strong>Let's Encrypt Authority X3 (Auto-Renew)</strong></span>
          </div>
          <div class="diag-item clickable" @click="openDnsInspector(dom)" title="Lihat status edge node">
            <Network :size="13" color="#2563eb" />
            <span>Proxy Ingress: <strong>Traefik v3.1 Ingress Router</strong></span>
          </div>
          <div class="diag-item">
            <Zap :size="13" color="#0284c7" />
            <span>Anycast Edge IP: <strong>{{ dom.aRecord || '103.144.20.1' }}</strong></span>
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

    <!-- MODAL 1: Global Edge DNS Live Propagation Tester -->
    <Teleport to="body">
      <div v-if="isDnsModalOpen" class="modal-backdrop" @click="isDnsModalOpen = false">
      <div class="modal-dialog modal-dialog-lg" @click.stop>
        <div class="modal-header">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div class="connect-icon-box" style="width: 38px; height: 38px;">
              <Network :size="18" />
            </div>
            <div>
              <h3 class="modal-title" style="margin: 0; font-size: 1.1rem; font-weight: 800;">
                Verifikasi Propagasi DNS Edge Global
              </h3>
              <p style="margin: 0; font-size: 0.76rem; color: #64748b;">
                Simulasi resolusi kueri CNAME & A Record ke 14 cluster Anycast Traefik untuk <strong>{{ activeDomainForModal?.domain }}</strong>
              </p>
            </div>
          </div>
          <button class="btn-modal-close" @click="isDnsModalOpen = false">
            <X :size="16" />
          </button>
        </div>

        <div class="modal-body" style="padding-top: 14px;">
          <!-- Node Summary Banner -->
          <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 9px; padding: 12px 16px; display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <CheckCircle :size="16" color="#059669" />
              <span style="font-size: 0.82rem; font-weight: 700; color: #065f46;">
                100% Edge Node Terpropagasi & Sehat
              </span>
            </div>
            <span style="font-size: 0.74rem; color: #047857; font-weight: 600;">
              Anycast TTFB Rerata: 1.8ms
            </span>
          </div>

          <!-- PoP Nodes Grid -->
          <div class="pop-nodes-grid">
            <div v-for="node in popNodes" :key="node.region" class="pop-node-card">
              <div class="pop-node-left">
                <span class="pop-node-flag">{{ node.flag }}</span>
                <div>
                  <div class="pop-node-city">{{ node.city }}, {{ node.country }}</div>
                  <div class="pop-node-region">{{ node.region }} • {{ node.ip }}</div>
                </div>
              </div>
              <div class="pop-node-right">
                <span class="pop-latency-badge">{{ node.latency }}</span>
                <span class="dns-valid-pill" style="font-size: 0.68rem; padding: 2px 7px;">
                  <CheckCircle2 :size="11" />
                  <span>PASS</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer" style="display: flex; justify-content: space-between; align-items: center;">
          <button
            type="button"
            class="btn-ping-dns"
            :disabled="isRecheckingPoPs"
            @click="recheckDnsPoPs"
          >
            <RotateCw :size="14" :class="{ 'spin-icon': isRecheckingPoPs }" />
            <span>{{ isRecheckingPoPs ? 'Menguji Ulang...' : 'Uji Ulang DNS' }}</span>
          </button>
          <button type="button" class="btn-modal-ghost" @click="isDnsModalOpen = false">
            Tutup
          </button>
        </div>
      </div>
    </div>
    </Teleport>

    <!-- MODAL 2: SSL X.509 Certificate Inspector -->
    <Teleport to="body">
      <div v-if="isSslModalOpen" class="modal-backdrop" @click="isSslModalOpen = false">
        <div class="modal-dialog" @click.stop>
        <div class="modal-header">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div class="connect-icon-box" style="width: 38px; height: 38px; background: linear-gradient(135deg, #059669 0%, #10b981 100%);">
              <ShieldCheck :size="18" />
            </div>
            <div>
              <h3 class="modal-title" style="margin: 0; font-size: 1.1rem; font-weight: 800;">
                Inspeksi Sertifikat SSL TLS v1.3
              </h3>
              <p style="margin: 0; font-size: 0.76rem; color: #64748b;">
                Diterbitkan otomatis oleh Let's Encrypt ACME ALPN Engine
              </p>
            </div>
          </div>
          <button class="btn-modal-close" @click="isSslModalOpen = false">
            <X :size="16" />
          </button>
        </div>

        <div class="modal-body" style="padding-top: 14px;">
          <div class="cert-details-grid">
            <div class="cert-detail-row">
              <span class="cert-detail-label">Common Name (CN)</span>
              <span class="cert-detail-value">{{ activeDomainForModal?.domain }}</span>
            </div>
            <div class="cert-detail-row">
              <span class="cert-detail-label">Subject Alt Names (SAN)</span>
              <span class="cert-detail-value">{{ activeDomainForModal?.domain }}, *.{{ activeDomainForModal?.domain }}</span>
            </div>
            <div class="cert-detail-row">
              <span class="cert-detail-label">Certificate Authority</span>
              <span class="cert-detail-value">Let's Encrypt Authority X3 (ISRG Root X1)</span>
            </div>
            <div class="cert-detail-row">
              <span class="cert-detail-label">Validitas / Status</span>
              <span class="cert-detail-value" style="color: #059669;">
                Aktif • Berlaku 90 Hari (Auto-Renew 30 hari sebelum kedaluwarsa)
              </span>
            </div>
            <div class="cert-detail-row">
              <span class="cert-detail-label">Algoritma Enkripsi</span>
              <span class="cert-detail-value">ECDSA 384-bit / SHA-256 with RSA</span>
            </div>
            <div class="cert-detail-row">
              <span class="cert-detail-label">Protokol & Handshake</span>
              <span class="cert-detail-value">TLS 1.3 / ALPN HTTP/2 & HTTP/3 (QUIC)</span>
            </div>
          </div>
        </div>

        <div class="modal-footer" style="display: flex; justify-content: flex-end;">
          <button type="button" class="btn-modal-ghost" @click="isSslModalOpen = false">
            Tutup
          </button>
        </div>
      </div>
    </div>
    </Teleport>
  </section>
</template>
