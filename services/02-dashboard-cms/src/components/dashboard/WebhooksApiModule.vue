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
