<script setup lang="ts">
import { ref } from 'vue';
import {
  Webhook,
  Copy,
  Check,
  Eye,
  EyeOff,
  RefreshCw,
  Plus,
  Send,
  ShieldCheck,
  Clock,
  Activity,
  X
} from 'lucide-vue-next';
import { useDashboardData } from '../../composables/useDashboardData';

const {
  webhooks,
  apiKey,
  isApiKeyRevealed,
  copyApiKey,
  testWebhook,
  showToast
} = useDashboardData();

const isCopied = ref(false);
const activeCodeTab = ref<'curl' | 'ts' | 'go' | 'py'>('curl');
const isAddWebhookModalOpen = ref(false);
const isRollingKey = ref(false);

const newWebhookForm = ref({
  name: '',
  url: '',
  events: ['site.deployed'] as string[]
});

const handleCopyKey = () => {
  copyApiKey();
  isCopied.value = true;
  setTimeout(() => {
    isCopied.value = false;
  }, 2000);
};

const handleRollKey = () => {
  if (confirm('Apakah Anda yakin ingin me-regenerasi API Key? Key lama akan segera hangus dan tidak dapat digunakan lagi.')) {
    isRollingKey.value = true;
    setTimeout(() => {
      apiKey.value = 'hero_live_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      isRollingKey.value = false;
      showToast('API Key berhasil di-roll ke token baru yang aman.', 'success');
    }, 800);
  }
};

const availableEvents = [
  { id: 'site.deployed', label: 'Kontainer & Situs Dideploy', desc: 'Dipicu saat build kontainer selesai dan Traefik rilis rute SSL' },
  { id: 'form.submitted', label: 'Formulir Kontak Masuk', desc: 'Payload data submit form dari pengunjung situs publik' },
  { id: 'traffic.anomaly', label: 'Anomali Trafik & Serangan', desc: 'Peringatan lonjakan request atau proteksi rate-limit Traefik' },
  { id: 'ssl.renewed', label: 'Sertifikat SSL Diperbarui', desc: 'Konfirmasi Let\'s Encrypt auto-renewal sukses di edge' }
];

const toggleEvent = (eventId: string) => {
  const index = newWebhookForm.value.events.indexOf(eventId);
  if (index > -1) {
    if (newWebhookForm.value.events.length > 1) {
      newWebhookForm.value.events.splice(index, 1);
    } else {
      showToast('Minimal harus memilih 1 event.', 'info');
    }
  } else {
    newWebhookForm.value.events.push(eventId);
  }
};

const handleAddWebhook = () => {
  if (!newWebhookForm.value.name || !newWebhookForm.value.url) {
    showToast('Harap isi nama dan URL endpoint valid.', 'error');
    return;
  }
  webhooks.value.push({
    id: 'wh_' + Date.now(),
    name: newWebhookForm.value.name,
    url: newWebhookForm.value.url,
    events: [...newWebhookForm.value.events],
    status: 'active',
    lastTriggered: 'Belum pernah dipicu'
  });
  showToast(`Webhook '${newWebhookForm.value.name}' berhasil didaftarkan!`, 'success');
  newWebhookForm.value = {
    name: '',
    url: '',
    events: ['site.deployed']
  };
  isAddWebhookModalOpen.value = false;
};

const codeSnippets = {
  curl: `curl -X GET "https://api.herocms.cloud/v1/tenant/containers" \\
  -H "Authorization: Bearer hero_live_sec_9942a8f9c" \\
  -H "Content-Type: application/json"`,
  ts: `import { HeroCMSClient } from '@herocms/sdk';

const hero = new HeroCMSClient({
  apiKey: process.env.HEROCMS_API_KEY,
  tenantId: 'tenant-9942'
});

const containers = await hero.containers.list();
console.log('Active containers:', containers.length);`,
  go: `package main

import (
  "fmt"
  "github.com/herocms/sdk-go/herocms"
)

func main() {
  client := herocms.NewClient("hero_live_sec_9942a8f9c")
  containers, _ := client.Containers.List()
  fmt.Printf("Connected containers: %d\\n", len(containers))
}`,
  py: `from herocms import HeroCMS

client = HeroCMS(api_key="hero_live_sec_9942a8f9c")
containers = client.containers.list()

for c in containers:
    print(f"Container: {c.name} | Status: {c.status}")`
};
</script>

<template>
  <section class="fade-in-section">
    <!-- Header Intro -->
    <div class="page-intro-row">
      <div>
        <h1 class="page-title">Webhooks & Integrasi API Developer</h1>
        <p class="page-desc">Kirim payload JSON event real-time ke Discord, Slack, atau custom backend endpoint saat ada deployment atau interaksi situs.</p>
      </div>
      <div class="header-actions">
        <button class="btn-primary-gradient" @click="isAddWebhookModalOpen = true">
          <Plus :size="15" />
          <span>Tambah Webhook Baru</span>
        </button>
      </div>
    </div>

    <!-- Quick Telemetry Summary Strip -->
    <div class="webhooks-stats-grid">
      <div class="stat-card">
        <div class="stat-top">
          <span class="stat-label">DISPATCHER RUNTIME</span>
          <span class="pulse-beacon"></span>
        </div>
        <div class="stat-value">Aktif & Listening</div>
        <div class="stat-sub">Redis Stream Ingest • Zero Dropped</div>
      </div>

      <div class="stat-card">
        <div class="stat-top">
          <span class="stat-label">TOTAL EVENT TERKIRIM</span>
          <Activity :size="15" class="stat-icon-blue" />
        </div>
        <div class="stat-value">14,280 <span class="rate-badge">99.98% Sukses</span></div>
        <div class="stat-sub">Dalam 30 hari terakhir</div>
      </div>

      <div class="stat-card">
        <div class="stat-top">
          <span class="stat-label">RATA-RATA LATENSI PING</span>
          <Clock :size="15" class="stat-icon-emerald" />
        </div>
        <div class="stat-value">42 ms <span class="badge-online">Ultra Fast</span></div>
        <div class="stat-sub">Timeout Limit: 5000ms</div>
      </div>

      <div class="stat-card">
        <div class="stat-top">
          <span class="stat-label">INTEGRASI AKTIF</span>
          <Webhook :size="15" class="stat-icon-purple" />
        </div>
        <div class="stat-value">{{ webhooks.length }} Endpoint</div>
        <div class="stat-sub">Discord, Slack, & Custom API</div>
      </div>
    </div>

    <!-- 1. API Token Vault Card -->
    <div class="developer-vault-card">
      <div class="vault-header">
        <div class="vault-info">
          <div class="vault-icon-badge">
            <ShieldCheck :size="20" />
          </div>
          <div>
            <div class="vault-title-row">
              <h3>Tenant API Secret Token</h3>
              <span class="vault-env-chip">Production v1</span>
            </div>
            <p class="vault-sub">Gunakan token ini sebagai header <code>Authorization: Bearer &lt;KEY&gt;</code> untuk otentikasi CI/CD pipelines dan akses Headless REST API.</p>
          </div>
        </div>

        <div class="vault-actions">
          <button class="btn-roll-key" :disabled="isRollingKey" @click="handleRollKey">
            <RefreshCw :size="13" :class="{ 'spin-anim': isRollingKey }" />
            <span>{{ isRollingKey ? 'Meregenerasi...' : 'Roll Key' }}</span>
          </button>
        </div>
      </div>

      <!-- Token Shell Box -->
      <div class="token-secret-box">
        <div class="token-code-area">
          <span class="token-prefix">BEARER</span>
          <code class="token-text" :class="{ masked: !isApiKeyRevealed }">
            {{ isApiKeyRevealed ? apiKey : '••••••••••••••••••••••••••••••••••••••••••••••••••••••••' }}
          </code>
        </div>
        <div class="token-btn-group">
          <button class="btn-token-tool" @click="isApiKeyRevealed = !isApiKeyRevealed" :title="isApiKeyRevealed ? 'Sembunyikan' : 'Tampilkan'">
            <EyeOff v-if="isApiKeyRevealed" :size="14" />
            <Eye v-else :size="14" />
            <span>{{ isApiKeyRevealed ? 'Sembunyikan' : 'Perlihatkan' }}</span>
          </button>
          <button class="btn-token-tool copy-btn" :class="{ copied: isCopied }" @click="handleCopyKey">
            <Check v-if="isCopied" :size="14" />
            <Copy v-else :size="14" />
            <span>{{ isCopied ? 'Tersalin!' : 'Salin Token' }}</span>
          </button>
        </div>
      </div>

      <!-- Code Snippet Tabs -->
      <div class="code-snippets-container">
        <div class="snippet-header">
          <div class="snippet-tabs">
            <button
              class="code-tab"
              :class="{ active: activeCodeTab === 'curl' }"
              @click="activeCodeTab = 'curl'"
            >
              <span>cURL</span>
            </button>
            <button
              class="code-tab"
              :class="{ active: activeCodeTab === 'ts' }"
              @click="activeCodeTab = 'ts'"
            >
              <span>TypeScript / Node.js</span>
            </button>
            <button
              class="code-tab"
              :class="{ active: activeCodeTab === 'go' }"
              @click="activeCodeTab = 'go'"
            >
              <span>Golang SDK</span>
            </button>
            <button
              class="code-tab"
              :class="{ active: activeCodeTab === 'py' }"
              @click="activeCodeTab = 'py'"
            >
              <span>Python</span>
            </button>
          </div>
          <span class="api-target-info">Base Endpoint: <code>https://api.herocms.cloud/v1</code></span>
        </div>

        <div class="code-terminal-view">
          <pre><code>{{ codeSnippets[activeCodeTab] }}</code></pre>
        </div>
      </div>
    </div>

    <!-- 2. Webhook Endpoints Management -->
    <div class="endpoints-card">
      <div class="endpoints-header">
        <div>
          <h3 class="endpoints-title">Endpoint Webhook Terpasang</h3>
          <p class="endpoints-desc">HeroCMS akan mengirim payload HTTP POST JSON bertanda tangan HMAC-SHA256 untuk setiap event yang dipilih.</p>
        </div>
        <div class="endpoints-badge-strip">
          <span class="security-signature-chip">
            <ShieldCheck :size="12" />
            Signature: HMAC-SHA256 (Secret Terlindungi)
          </span>
        </div>
      </div>

      <div class="endpoints-list">
        <div v-for="wh in webhooks" :key="wh.id" class="endpoint-item-pro">
          <div class="endpoint-status-icon">
            <div class="status-ping-orb online"></div>
          </div>

          <div class="endpoint-main-info">
            <div class="endpoint-title-row">
              <strong class="endpoint-name">{{ wh.name }}</strong>
              <span class="delivery-status-tag">
                <span class="status-dot"></span>
                200 OK • 38ms
              </span>
            </div>

            <div class="endpoint-url-box">
              <code>{{ wh.url }}</code>
            </div>

            <div class="endpoint-meta-bar">
              <div class="event-capsules">
                <span class="meta-label">Events:</span>
                <span v-for="ev in wh.events" :key="ev" class="event-pill">
                  {{ ev }}
                </span>
              </div>
              <div class="last-trigger-time">
                <Clock :size="12" />
                <span>Terakhir dipicu: <strong>{{ wh.lastTriggered }}</strong></span>
              </div>
            </div>
          </div>

          <div class="endpoint-actions">
            <button class="btn-test-ping" @click="testWebhook(wh)">
              <Send :size="13" />
              <span>Kirim Test Ping</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL: TAMBAH WEBHOOK BARU -->
    <Teleport to="body">
      <div v-if="isAddWebhookModalOpen" class="modal-backdrop" @click.self="isAddWebhookModalOpen = false">
        <div class="modal-dialog">
          <div class="modal-header">
            <div class="modal-header-leading">
              <div class="modal-header-icon-box">
                <Webhook :size="18" />
              </div>
              <div>
                <h3 class="modal-heading">Tambah Webhook Endpoint</h3>
                <p class="modal-subheading">Konfigurasikan URL target penerima event webhook berformat JSON.</p>
              </div>
            </div>
            <button class="modal-close-button" @click="isAddWebhookModalOpen = false" title="Tutup">
              <X :size="16" />
            </button>
          </div>

          <form @submit.prevent="handleAddWebhook" class="modal-form-body">
            <div class="form-group-block">
              <label class="input-label-row">
                <span class="label-text">Nama Integrasi</span>
                <span class="label-badge-optional">Wajib</span>
              </label>
              <div class="input-field-wrapper">
                <input
                  v-model="newWebhookForm.name"
                  type="text"
                  class="form-text-input"
                  placeholder="Contoh: Discord Server Alur Notifikasi"
                  required
                  autofocus
                />
              </div>
            </div>

            <div class="form-group-block">
              <label class="input-label-row">
                <span class="label-text">Target URL Endpoint (HTTPS)</span>
                <span class="label-badge-optional">Wajib</span>
              </label>
              <div class="input-field-wrapper">
                <input
                  v-model="newWebhookForm.url"
                  type="url"
                  class="form-text-input"
                  placeholder="https://discord.com/api/webhooks/... atau https://api.anda.com/hook"
                  required
                />
              </div>
            </div>

            <div class="form-group-block">
              <label class="input-label-row">
                <span class="label-text">Pilih Events Yang Dikirim</span>
                <span class="label-badge-optional">{{ newWebhookForm.events.length }} dipilih</span>
              </label>
              <div class="events-checklist-grid">
                <div
                  v-for="ev in availableEvents"
                  :key="ev.id"
                  class="event-check-box"
                  :class="{ active: newWebhookForm.events.includes(ev.id) }"
                  @click="toggleEvent(ev.id)"
                >
                  <div class="event-check-box-top">
                    <strong>{{ ev.id }}</strong>
                    <div class="custom-checkbox" :class="{ checked: newWebhookForm.events.includes(ev.id) }">
                      <Check v-if="newWebhookForm.events.includes(ev.id)" :size="12" />
                    </div>
                  </div>
                  <div class="event-check-title">{{ ev.label }}</div>
                  <div class="event-check-desc">{{ ev.desc }}</div>
                </div>
              </div>
            </div>

            <div class="modal-footer-row">
              <button type="button" class="btn-modal-ghost" @click="isAddWebhookModalOpen = false">
                Batal
              </button>
              <button type="submit" class="btn-modal-confirm">
                <Plus :size="14" />
                <span>Simpan Webhook</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<style scoped>
/* Scoped Futuristic Styles for Webhooks & API Module */
.fade-in-section {
  animation: fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

.page-intro-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.02em;
  margin: 0 0 6px 0;
}

.page-desc {
  font-size: 13.5px;
  color: #64748b;
  margin: 0;
  max-width: 680px;
  line-height: 1.5;
}

.btn-primary-gradient {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #0f172a;
  color: #ffffff;
  border: 1px solid #0f172a;
  padding: 9px 18px;
  border-radius: 9px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.12);
}

.btn-primary-gradient:hover {
  background: #1e293b;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);
}

/* 4 Metrics Strip */
.webhooks-stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

@media (max-width: 1100px) {
  .webhooks-stats-grid { grid-template-columns: repeat(2, 1fr); }
}

.stat-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.03);
}

.stat-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 11px;
  font-weight: 700;
  color: #64748b;
  letter-spacing: 0.05em;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.stat-sub {
  font-size: 12px;
  color: #94a3b8;
}

.rate-badge {
  font-size: 11px;
  font-weight: 600;
  color: #059669;
  background: #ecfdf5;
  padding: 2px 8px;
  border-radius: 20px;
}

.badge-online {
  font-size: 11px;
  font-weight: 600;
  color: #0284c7;
  background: #f0f9ff;
  padding: 2px 8px;
  border-radius: 20px;
}

.pulse-beacon {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
  animation: pulseBeacon 2s infinite;
}

@keyframes pulseBeacon {
  0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
  70% { box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
  100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
}

.stat-icon-blue { color: #0284c7; }
.stat-icon-emerald { color: #10b981; }
.stat-icon-purple { color: #8b5cf6; }

/* 1. Developer Vault Card */
.developer-vault-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 22px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
}

.vault-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 18px;
}

.vault-info {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.vault-icon-badge {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: #f1f5f9;
  color: #0f172a;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.vault-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 4px;
}

.vault-title-row h3 {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.vault-env-chip {
  font-size: 11px;
  font-weight: 600;
  color: #1e293b;
  background: #e2e8f0;
  padding: 2px 8px;
  border-radius: 4px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.vault-sub {
  font-size: 13px;
  color: #64748b;
  margin: 0;
  line-height: 1.4;
}

.vault-sub code {
  background: #f1f5f9;
  color: #0f172a;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: ui-monospace, SFMono-Regular, monospace;
  font-size: 12px;
}

.btn-roll-key {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  color: #475569;
  padding: 7px 14px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-roll-key:hover {
  background: #f8fafc;
  color: #0f172a;
  border-color: #94a3b8;
}

.spin-anim {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Token Box */
.token-secret-box {
  background: #090d16;
  border: 1px solid #1e293b;
  border-radius: 10px;
  padding: 10px 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.token-code-area {
  display: flex;
  align-items: center;
  gap: 12px;
  overflow: hidden;
}

.token-prefix {
  font-size: 10px;
  font-weight: 700;
  color: #38bdf8;
  background: rgba(56, 189, 248, 0.12);
  padding: 2px 6px;
  border-radius: 4px;
  letter-spacing: 0.05em;
  font-family: ui-monospace, monospace;
}

.token-text {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 13.5px;
  color: #f8fafc;
  letter-spacing: 0.02em;
}

.token-text.masked {
  letter-spacing: 0.15em;
  color: #64748b;
}

.token-btn-group {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.btn-token-tool {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #1e293b;
  color: #cbd5e1;
  border: 1px solid #334155;
  padding: 6px 12px;
  border-radius: 7px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-token-tool:hover {
  background: #334155;
  color: #ffffff;
}

.btn-token-tool.copy-btn.copied {
  background: #065f46;
  border-color: #059669;
  color: #ffffff;
}

/* Code Snippet Tabs */
.code-snippets-container {
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 10px;
  overflow: hidden;
}

.snippet-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 14px;
  background: #090d16;
  border-bottom: 1px solid #1e293b;
}

.snippet-tabs {
  display: flex;
  gap: 4px;
}

.code-tab {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 12px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.code-tab:hover {
  color: #f8fafc;
}

.code-tab.active {
  background: #1e293b;
  color: #38bdf8;
}

.api-target-info {
  font-size: 11px;
  color: #64748b;
}

.api-target-info code {
  color: #38bdf8;
  font-family: ui-monospace, monospace;
}

.code-terminal-view {
  padding: 16px 20px;
  overflow-x: auto;
}

.code-terminal-view pre {
  margin: 0;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 12.5px;
  color: #e2e8f0;
  line-height: 1.6;
}

/* 2. Endpoints Management */
.endpoints-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 22px;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
}

.endpoints-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.endpoints-title {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 4px 0;
}

.endpoints-desc {
  font-size: 13px;
  color: #64748b;
  margin: 0;
}

.security-signature-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 600;
  color: #0284c7;
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  padding: 4px 10px;
  border-radius: 20px;
}

.endpoints-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.endpoint-item-pro {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px 18px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.endpoint-item-pro:hover {
  background: #ffffff;
  border-color: #cbd5e1;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.05);
}

.endpoint-status-icon {
  flex-shrink: 0;
}

.status-ping-orb {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
}

.endpoint-main-info {
  flex: 1;
  min-width: 0;
}

.endpoint-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}

.endpoint-name {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
}

.delivery-status-tag {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 600;
  color: #059669;
  background: #ecfdf5;
  padding: 2px 8px;
  border-radius: 20px;
}

.status-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #059669;
}

.endpoint-url-box {
  margin-bottom: 8px;
}

.endpoint-url-box code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 12px;
  color: #334155;
  background: #edf2f7;
  padding: 3px 8px;
  border-radius: 5px;
  display: inline-block;
}

.endpoint-meta-bar {
  display: flex;
  align-items: center;
  gap: 18px;
  font-size: 12px;
  color: #64748b;
}

.event-capsules {
  display: flex;
  align-items: center;
  gap: 6px;
}

.meta-label {
  font-weight: 600;
  color: #94a3b8;
}

.event-pill {
  font-size: 11px;
  font-weight: 600;
  color: #0284c7;
  background: #f0f9ff;
  border: 1px solid #e0f2fe;
  padding: 1px 7px;
  border-radius: 4px;
  font-family: ui-monospace, monospace;
}

.last-trigger-time {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.last-trigger-time strong {
  color: #334155;
}

.btn-test-ping {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  color: #0f172a;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  flex-shrink: 0;
}

.btn-test-ping:hover {
  background: #0f172a;
  color: #ffffff;
  border-color: #0f172a;
}

/* Modal Styles */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
  padding: 24px;
}

.modal-dialog {
  background: #ffffff;
  border-radius: 16px;
  width: 100%;
  max-width: 580px;
  max-height: calc(100vh - 48px);
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.25);
  border: 1px solid #e2e8f0;
  overflow: hidden;
  animation: modalScale 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modalScale {
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1); }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #f1f5f9;
  background: #ffffff;
  flex-shrink: 0;
}

.modal-header-leading {
  display: flex;
  gap: 12px;
  align-items: center;
}

.modal-header-icon-box {
  width: 38px;
  height: 38px;
  border-radius: 9px;
  background: #f1f5f9;
  color: #0f172a;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.modal-heading {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 2px 0;
}

.modal-subheading {
  font-size: 12px;
  color: #64748b;
  margin: 0;
}

.modal-close-button {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #64748b;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.15s ease;
}

.modal-close-button:hover {
  background: #fee2e2;
  border-color: #fca5a5;
  color: #ef4444;
}

.modal-form-body {
  padding: 20px 24px;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

.form-group-block {
  margin-bottom: 18px;
}

.input-label-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #334155;
}

.label-badge-optional {
  color: #64748b;
  font-size: 11px;
}

.form-text-input {
  width: 100%;
  box-sizing: border-box;
  padding: 9px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 13px;
  color: #0f172a;
  outline: none;
  transition: all 0.15s ease;
}

.form-text-input:focus {
  border-color: #0f172a;
  box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.08);
}

.events-checklist-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.event-check-box {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 10px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.event-check-box:hover {
  background: #f1f5f9;
}

.event-check-box.active {
  background: #f0f9ff;
  border-color: #0284c7;
}

.event-check-box-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: ui-monospace, monospace;
  font-size: 11px;
  color: #0284c7;
  margin-bottom: 4px;
}

.custom-checkbox {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  border: 1px solid #cbd5e1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
}

.custom-checkbox.checked {
  background: #0284c7;
  border-color: #0284c7;
  color: #ffffff;
}

.event-check-title {
  font-size: 12px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 2px;
}

.event-check-desc {
  font-size: 11px;
  color: #64748b;
  line-height: 1.3;
}

.modal-footer-row {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 24px;
}

.btn-modal-ghost {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  color: #475569;
  padding: 9px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.btn-modal-ghost:hover {
  background: #f8fafc;
  color: #0f172a;
}

.btn-modal-confirm {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #0f172a;
  border: 1px solid #0f172a;
  color: #ffffff;
  padding: 9px 18px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.btn-modal-confirm:hover {
  background: #1e293b;
}
</style>
