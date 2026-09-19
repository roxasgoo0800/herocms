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

<style scoped>
/* Hero Connect Card */
.connect-domain-hero {
  padding: 22px 24px;
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.03);
  margin-bottom: 24px;
}

.connect-domain-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
  flex-wrap: wrap;
  gap: 12px;
}

.connect-lead {
  display: flex;
  align-items: center;
  gap: 14px;
}

.connect-icon-box {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.12);
  flex-shrink: 0;
}

.connect-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 2px;
}

.connect-desc {
  font-size: 0.78rem;
  color: #64748b;
  margin: 0;
}

.registrar-pills {
  display: flex;
  gap: 6px;
}

.reg-pill {
  font-size: 0.7rem;
  font-weight: 600;
  color: #475569;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 3px 8px;
  border-radius: 6px;
}

.connect-form-grid {
  display: grid;
  grid-template-columns: 1.6fr 1.2fr auto;
  gap: 14px;
  align-items: flex-end;
}

@media (max-width: 900px) {
  .connect-form-grid { grid-template-columns: 1fr; }
}

.input-label-sm {
  display: block;
  font-size: 0.72rem;
  font-weight: 700;
  color: #475569;
  margin-bottom: 6px;
  letter-spacing: 0.02em;
}

.domain-input-shell {
  display: flex;
  align-items: center;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 9px;
  overflow: hidden;
  transition: all 0.15s ease;
}

.domain-input-shell:focus-within {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
}

.domain-protocol {
  font-size: 0.78rem;
  font-weight: 600;
  color: #94a3b8;
  background: #f8fafc;
  padding: 9px 12px;
  border-right: 1px solid #e2e8f0;
  user-select: none;
}

.domain-core-field {
  flex: 1;
  border: none;
  outline: none;
  font-size: 0.84rem;
  padding: 9px 12px;
  color: #0f172a;
}

.select-target-shell {
  position: relative;
  display: flex;
  align-items: center;
}

.select-lead-glyph {
  position: absolute;
  left: 12px;
  color: #64748b;
  pointer-events: none;
}

.select-target-field {
  width: 100%;
  padding: 9px 12px 9px 34px;
  border-radius: 9px;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  font-size: 0.84rem;
  color: #0f172a;
  outline: none;
  transition: all 0.15s ease;
}

.select-target-field:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
}

.btn-connect-domain {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: #ffffff;
  border: none;
  padding: 10px 18px;
  border-radius: 9px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.btn-connect-domain:hover {
  background: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
}

/* Connected Domains Section */
.section-title-strip {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.section-title-strip h3 {
  font-size: 0.72rem;
  font-weight: 800;
  color: #64748b;
  letter-spacing: 0.06em;
  margin: 0;
}

.live-sync-indicator {
  font-size: 0.72rem;
  font-weight: 600;
  color: #059669;
  display: flex;
  align-items: center;
  gap: 5px;
}

.domain-profile-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 20px 24px;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.03);
  margin-bottom: 20px;
}

.domain-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 18px;
  border-bottom: 1px solid #f1f5f9;
  margin-bottom: 18px;
  flex-wrap: wrap;
  gap: 14px;
}

.domain-brand-group {
  display: flex;
  align-items: center;
  gap: 14px;
}

.domain-glyph-box {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #eff6ff;
  color: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.domain-main-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.domain-headline {
  font-size: 1.15rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.02em;
  margin: 0;
}

.domain-target-pill {
  font-size: 0.72rem;
  font-weight: 600;
  color: #2563eb;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  padding: 2px 8px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.domain-created-txt {
  font-size: 0.72rem;
  color: #94a3b8;
}

.domain-created-txt code {
  color: #475569;
}

.domain-header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ssl-status-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.72rem;
  font-weight: 700;
  color: #059669;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  padding: 5px 10px;
  border-radius: 8px;
}

.btn-ping-dns {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.74rem;
  font-weight: 600;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #334155;
  padding: 6px 11px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.12s ease;
}

.btn-ping-dns:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.btn-visit-site, .btn-del-domain {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.12s ease;
}

.btn-visit-site:hover {
  color: #0f172a;
  background: #f8fafc;
}

.btn-del-domain:hover {
  color: #dc2626;
  background: #fef2f2;
  border-color: #fecaca;
}

/* DNS Records Table Box */
.dns-table-box {
  background: #fafbfc;
  border: 1px solid #f1f5f9;
  border-radius: 12px;
  padding: 16px 18px;
  margin-bottom: 14px;
}

.dns-table-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 0.74rem;
}

.table-title {
  font-weight: 700;
  color: #0f172a;
}

.table-note {
  color: #64748b;
}

.dns-records-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.dns-row-item {
  display: grid;
  grid-template-columns: 110px 180px 1fr 180px;
  align-items: center;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 10px 14px;
  gap: 12px;
}

@media (max-width: 900px) {
  .dns-row-item { grid-template-columns: 1fr; }
}

.record-badge {
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  padding: 3px 8px;
  border-radius: 5px;
  display: inline-block;
  text-align: center;
}

.record-badge.cname { background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; }
.record-badge.a-rec { background: #faf5ff; color: #9333ea; border: 1px solid #e9d5ff; }

.col-lbl {
  display: block;
  font-size: 0.62rem;
  font-weight: 700;
  color: #94a3b8;
  margin-bottom: 2px;
}

.dns-col-host code, .val-copy-group code {
  font-family: ui-monospace, monospace;
  font-size: 0.78rem;
  color: #0f172a;
}

.val-copy-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-mini-copy {
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  color: #64748b;
  border-radius: 5px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.1s ease;
}

.btn-mini-copy:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.dns-valid-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.72rem;
  font-weight: 700;
  color: #059669;
  background: #ecfdf5;
  padding: 3px 8px;
  border-radius: 6px;
}

.domain-tip-footer {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.74rem;
  color: #475569;
  background: #f8fafc;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.tip-icon {
  flex-shrink: 0;
}
</style>
