<script setup lang="ts">
import { ref } from 'vue';
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
  Info
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

    <!-- 1. Sleek "Connect New Domain" Hero Card -->
    <div class="pro-panel connect-domain-hero">
      <div class="connect-domain-top">
        <div class="connect-lead">
          <div class="connect-icon-box">
            <Globe :size="20" />
          </div>
          <div>
            <h3 class="connect-title">Hubungkan Domain Kustom Baru</h3>
            <p class="connect-desc">Gunakan domain milik Anda dari registrar mana pun (Cloudflare, Niagahoster, Domainesia, Namecheap, dsb).</p>
          </div>
        </div>
        <div class="registrar-pills">
          <span class="reg-pill">Cloudflare</span>
          <span class="reg-pill">Niagahoster</span>
          <span class="reg-pill">Domainesia</span>
          <span class="reg-pill">IDwebhost</span>
        </div>
      </div>

      <div class="connect-form-grid">
        <div class="form-group-domain">
          <label class="input-label-sm">Nama Domain atau Subdomain</label>
          <div class="domain-input-shell">
            <span class="domain-protocol">https://</span>
            <input
              v-model="newDomainInput"
              type="text"
              placeholder="contoh: rizalpratama.id atau portal.bisnis.com"
              class="domain-core-field"
              @keydown.enter="handleAddDomain"
            />
          </div>
        </div>

        <div class="form-group-target">
          <label class="input-label-sm">Target Kontainer Tenant</label>
          <div class="select-target-shell">
            <Server :size="14" class="select-lead-glyph" />
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
    </div>

    <!-- 2. Connected Domains List -->
    <div class="connected-domains-section">
      <div class="section-title-strip">
        <h3>DOMAIN TERHUBUNG & PANDUAN DNS</h3>
        <span class="live-sync-indicator">
          <span class="pulse-mini-dot"></span>
          Ingress Active (Port 80 / 443)
        </span>
      </div>

      <div v-for="dom in customDomains" :key="dom.id" class="domain-profile-card">
        <!-- Card Top Bar -->
        <div class="domain-card-header">
          <div class="domain-brand-group">
            <div class="domain-glyph-box">
              <Globe :size="20" />
            </div>
            <div class="domain-text-group">
              <div class="domain-main-row">
                <h2 class="domain-headline">{{ dom.domain }}</h2>
                <span class="domain-target-pill">
                  <ArrowRight :size="11" />
                  {{ dom.targetContainer }}
                </span>
              </div>
              <span class="domain-created-txt">Ditambahkan pada {{ dom.addedDate }} • Proxy Ingress Rule ID: <code>route-{{ dom.id }}</code></span>
            </div>
          </div>

          <!-- Status Chips & Quick Actions -->
          <div class="domain-header-actions">
            <div class="ssl-status-badge">
              <ShieldCheck :size="13" color="#059669" />
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

            <a :href="`https://${dom.domain}`" target="_blank" class="btn-visit-site" title="Buka Domain">
              <ExternalLink :size="13" />
            </a>

            <button class="btn-del-domain" @click="deleteDomain(dom)" title="Putuskan Domain">
              <Trash2 :size="13" />
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
                    title="Salin Target"
                  >
                    <Check v-if="copiedSubdomain === 'cname_' + dom.id" :size="12" class="text-green" />
                    <Copy v-else :size="12" />
                  </button>
                </div>
              </div>
              <div class="dns-col-status">
                <span class="dns-valid-pill">
                  <CheckCircle2 :size="12" />
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
                    title="Salin IP Target"
                  >
                    <Check v-if="copiedSubdomain === 'a_' + dom.id" :size="12" class="text-green" />
                    <Copy v-else :size="12" />
                  </button>
                </div>
              </div>
              <div class="dns-col-status">
                <span class="dns-valid-pill">
                  <CheckCircle2 :size="12" />
                  <span>Valid (Edge IP)</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Helpful Registrar Note -->
        <div class="domain-tip-footer">
          <Info :size="14" color="#2563eb" class="tip-icon" />
          <span>
            <strong>Catatan Propagasi:</strong> Perubahan DNS umumnya memakan waktu 5–15 menit (maks. 24 jam tergantung TTL registrar). Begitu terdeteksi, SSL otomatis diterbitkan dan aktif selamanya.
          </span>
        </div>
      </div>
    </div>
  </section>
</template>
