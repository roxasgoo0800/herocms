<script setup lang="ts">
import { ref } from 'vue';
import {
  Key,
  Webhook,
  Copy,
  Check,
  Plus,
  Send,
  ShieldCheck,
  Clock,
  Activity,
  X,
  Trash2,
  AlertTriangle,
  Layers,
  Lock,
  FileText,
  Code,
  Pause,
  Play,
  CheckCircle2,
  ExternalLink
} from 'lucide-vue-next';
import { useDashboardData } from '../../composables/useDashboardData';
import type { PersonalAccessToken, PatScopeCategory } from '../../types/dashboard';

const {
  webhooks,
  addWebhook,
  deleteWebhook,
  toggleWebhookStatus,
  testWebhook,
  patScopes,
  personalAccessTokens,
  webhookDeliveryLogs,
  createPersonalAccessToken,
  revokePersonalAccessToken,
  deletePersonalAccessToken,
  showToast
} = useDashboardData();

// Subnav Tab state: 'pat' | 'webhooks' | 'docs'
const activeTab = ref<'pat' | 'webhooks' | 'docs'>('pat');
const activeCodeTab = ref<'curl' | 'ts' | 'go' | 'py'>('curl');

// Copy feedbacks
const copiedTokenId = ref<string | null>(null);
const isRawTokenCopied = ref(false);
const isSnippetCopied = ref(false);

// Modal states
const isCreatePatModalOpen = ref(false);
const isOneTimeModalOpen = ref(false);
const isAddWebhookModalOpen = ref(false);

// One-time token reveal container
const revealedRawToken = ref('');
const revealedTokenName = ref('');

// Form states
const newPatForm = ref({
  name: '',
  expiresOption: '90 Hari',
  selectedScopes: ['content:read', 'media:read'] as string[]
});

const newWebhookForm = ref({
  name: '',
  url: '',
  secretKey: '',
  events: ['article.published', 'lead.received'] as string[]
});

// Safe Outgoing Notification Events (strictly event alerts, no container/lifecycle controls)
const availableNotificationEvents = [
  {
    id: 'article.published',
    label: 'Konten Editorial Terbit',
    desc: 'Dipicu saat artikel baru diterbitkan dari CMS Studio'
  },
  {
    id: 'lead.received',
    label: 'Formulir Kontak Masuk (Lead)',
    desc: 'Payload data kiriman form dari pengunjung situs publik'
  },
  {
    id: 'ssl.renewed',
    label: 'Sertifikat SSL Diperbarui',
    desc: 'Konfirmasi Let\'s Encrypt auto-renewal sukses di Edge Traefik v3'
  },
  {
    id: 'traffic.spike',
    label: 'Peringatan Lonjakan Trafik',
    desc: 'Notifikasi saat kunjungan melonjak melampaui batas wajar'
  },
  {
    id: 'backup.completed',
    label: 'Snapshot Backup Selesai',
    desc: 'Konfirmasi backup database dan media sukses terarsip'
  }
];

// Scope categories for PAT matrix
const scopeCategories: Array<{ id: PatScopeCategory; label: string; icon: any }> = [
  { id: 'content', label: 'Konten Editorial & Halaman (Headless)', icon: FileText },
  { id: 'leads', label: 'Formulir & Prospek Masuk (Leads)', icon: Layers },
  { id: 'media', label: 'Media CDN & S3 Storage', icon: ExternalLink },
  { id: 'telemetry', label: 'Telemetri & Analitik Kunjungan', icon: Activity },
  { id: 'tickets', label: 'Pusat Bantuan & Support', icon: ShieldCheck }
];

const getScopesByCategory = (cat: PatScopeCategory) => {
  return patScopes.value.filter(s => s.category === cat);
};

const isCategoryFullySelected = (cat: PatScopeCategory) => {
  const catScopes = getScopesByCategory(cat);
  if (catScopes.length === 0) return false;
  return catScopes.every(s => newPatForm.value.selectedScopes.includes(s.id));
};

const getCategorySelectedCount = (cat: PatScopeCategory) => {
  const catScopes = getScopesByCategory(cat);
  return catScopes.filter(s => newPatForm.value.selectedScopes.includes(s.id)).length;
};

const toggleCategoryAll = (cat: PatScopeCategory) => {
  const catScopes = getScopesByCategory(cat);
  const allSelected = isCategoryFullySelected(cat);
  if (allSelected) {
    // Deselect all in this category
    newPatForm.value.selectedScopes = newPatForm.value.selectedScopes.filter(
      id => !catScopes.some(s => s.id === id)
    );
  } else {
    // Select all in this category
    for (const s of catScopes) {
      if (!newPatForm.value.selectedScopes.includes(s.id)) {
        newPatForm.value.selectedScopes.push(s.id);
      }
    }
  }
};

const toggleScopeItem = (scopeId: string) => {
  const idx = newPatForm.value.selectedScopes.indexOf(scopeId);
  if (idx > -1) {
    newPatForm.value.selectedScopes.splice(idx, 1);
  } else {
    newPatForm.value.selectedScopes.push(scopeId);
  }
};

// Webhook events toggle
const toggleWebhookEvent = (eventId: string) => {
  const idx = newWebhookForm.value.events.indexOf(eventId);
  if (idx > -1) {
    if (newWebhookForm.value.events.length > 1) {
      newWebhookForm.value.events.splice(idx, 1);
    } else {
      showToast('Minimal harus memilih 1 event notifikasi.', 'info');
    }
  } else {
    newWebhookForm.value.events.push(eventId);
  }
};

// PAT Creation Handler
const openCreatePatModal = () => {
  newPatForm.value = {
    name: '',
    expiresOption: '90 Hari',
    selectedScopes: ['content:read', 'media:read']
  };
  isCreatePatModalOpen.value = true;
};

const handleCreatePat = () => {
  if (!newPatForm.value.name.trim()) {
    showToast('Harap beri nama deskriptif untuk Personal Access Token.', 'error');
    return;
  }
  if (newPatForm.value.selectedScopes.length === 0) {
    showToast('Harap pilih minimal 1 cakupan hak akses (scope).', 'error');
    return;
  }

  const result = createPersonalAccessToken(
    newPatForm.value.name.trim(),
    newPatForm.value.selectedScopes,
    newPatForm.value.expiresOption
  );

  revealedRawToken.value = result.rawToken;
  revealedTokenName.value = result.token.name;
  isCreatePatModalOpen.value = false;
  isOneTimeModalOpen.value = true;
};

const handleCopyRawToken = () => {
  if (!revealedRawToken.value) return;
  navigator.clipboard.writeText(revealedRawToken.value);
  isRawTokenCopied.value = true;
  showToast('Raw token berhasil disalin ke clipboard!', 'success');
  setTimeout(() => {
    isRawTokenCopied.value = false;
  }, 2500);
};

const handleCopyMasked = (token: PersonalAccessToken) => {
  navigator.clipboard.writeText(token.tokenMasked);
  copiedTokenId.value = token.id;
  showToast(`Token string disalin: ${token.tokenMasked}`, 'info');
  setTimeout(() => {
    copiedTokenId.value = null;
  }, 2000);
};

const handleRevoke = (token: PersonalAccessToken) => {
  if (confirm(`Cabut token '${token.name}'? Aplikasi pihak ketiga yang menggunakan token ini tidak dapat mengakses API lagi.`)) {
    revokePersonalAccessToken(token.id);
  }
};

const handleDelete = (token: PersonalAccessToken) => {
  if (confirm(`Hapus token '${token.name}' secara permanen dari daftar?`)) {
    deletePersonalAccessToken(token.id);
  }
};

// Webhook Creation Handler
const openAddWebhookModal = () => {
  newWebhookForm.value = {
    name: '',
    url: '',
    secretKey: `whsec_9942_${Math.random().toString(36).substring(2, 10)}`,
    events: ['article.published', 'lead.received']
  };
  isAddWebhookModalOpen.value = true;
};

const handleAddWebhookSubmit = () => {
  if (!newWebhookForm.value.name.trim() || !newWebhookForm.value.url.trim()) {
    showToast('Harap isi nama integrasi dan URL endpoint HTTPS.', 'error');
    return;
  }
  if (!newWebhookForm.value.url.startsWith('https://')) {
    showToast('URL webhook wajib menggunakan protokol terenkripsi (HTTPS).', 'error');
    return;
  }
  addWebhook(
    newWebhookForm.value.name.trim(),
    newWebhookForm.value.url.trim(),
    newWebhookForm.value.events,
    newWebhookForm.value.secretKey
  );
  isAddWebhookModalOpen.value = false;
};

// Headless REST API Code snippets
const codeSnippets = {
  curl: `# 1. Query Daftar Artikel Headless CMS
curl -X GET "https://api.herocms.cloud/v1/content/articles?status=published" \\
  -H "Authorization: Bearer hero_pat_9942_••••••••••••" \\
  -H "Content-Type: application/json"

# 2. Kirim Prospek / Formulir Kontak dari Landing Page
curl -X POST "https://api.herocms.cloud/v1/leads/submit" \\
  -H "Authorization: Bearer hero_pat_9942_••••••••••••" \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Budi Santoso","email":"budi@perusahaan.com","message":"Tertarik demo platform"}'`,

  ts: `import { HeroCMSClient } from '@herocms/sdk';

// Inisialisasi SDK dengan Personal Access Token (PAT)
const hero = new HeroCMSClient({
  token: process.env.HEROCMS_PAT_TOKEN, // hero_pat_9942_...
  tenantId: 'tenant-9942'
});

// Ambil artikel terbit untuk rendering Next.js / Astro static site
const { data: articles } = await hero.content.getArticles({
  category: 'Teknologi',
  limit: 10
});

console.log('Total artikel terbit:', articles.length);`,

  go: `package main

import (
  "context"
  "fmt"
  "github.com/herocms/sdk-go/herocms"
)

func main() {
  // Client Headless CMS resmi HeroCMS
  client := herocms.NewClient("hero_pat_9942_••••••••••••")

  articles, err := client.Content.ListArticles(context.Background(), &herocms.ListOptions{
    Status: "published",
    Limit:  20,
  })
  if err != nil {
    panic(err)
  }

  fmt.Printf("Berhasil mengambil %d artikel\\n", len(articles))
}`,

  py: `from herocms import HeroCMSClient

# Inisialisasi client Python untuk analisis atau ingest data
client = HeroCMSClient(token="hero_pat_9942_••••••••••••")

# Ambil ringkasan performa telemetri situs
telemetry = client.telemetry.get_overview()
print(f"Kunjungan Minggu Ini: {telemetry.get('visits_total')}")

# Submit lead dari bot/skrip otomatis
client.leads.submit(
    name="Mitra Cloud",
    email="partner@cloud.id",
    message="Permintaan integrasi API"
)`
};

const copyActiveSnippet = () => {
  navigator.clipboard.writeText(codeSnippets[activeCodeTab.value]);
  isSnippetCopied.value = true;
  showToast('Contoh kode disalin ke clipboard!', 'info');
  setTimeout(() => {
    isSnippetCopied.value = false;
  }, 2000);
};
</script>

<template>
  <section class="fade-in-section">
    <!-- Header Page Intro Row -->
    <div class="page-intro-row">
      <div>
        <h1 class="page-title">Webhooks Notifikasi & Scoped API Access</h1>
        <p class="page-desc">
          Kelola Personal Access Tokens (PAT) dengan hak akses terbatas untuk integrasi Headless CMS, serta webhook event notifikasi keluar (Discord, Slack, Zapier). Tanpa akses lifecycle kontainer demi keamanan.
        </p>
      </div>
      <div class="header-actions">
        <button
          v-if="activeTab === 'pat'"
          class="btn-primary-gradient"
          @click="openCreatePatModal"
        >
          <Plus :size="15" />
          <span>Buat Token PAT Baru</span>
        </button>
        <button
          v-else-if="activeTab === 'webhooks'"
          class="btn-primary-gradient"
          @click="openAddWebhookModal"
        >
          <Plus :size="15" />
          <span>Tambah Webhook Baru</span>
        </button>
      </div>
    </div>

    <!-- Sub-Navigation Tabs Bar -->
    <div class="api-subnav-bar">
      <button
        class="api-subnav-tab"
        :class="{ active: activeTab === 'pat' }"
        @click="activeTab = 'pat'"
      >
        <Key :size="15" />
        <span>Personal Access Tokens (PAT)</span>
        <span class="tab-badge-pill">{{ personalAccessTokens.length }}</span>
      </button>

      <button
        class="api-subnav-tab"
        :class="{ active: activeTab === 'webhooks' }"
        @click="activeTab = 'webhooks'"
      >
        <Webhook :size="15" />
        <span>Outgoing Webhooks (Notifikasi)</span>
        <span class="tab-badge-pill">{{ webhooks.length }}</span>
      </button>

      <button
        class="api-subnav-tab"
        :class="{ active: activeTab === 'docs' }"
        @click="activeTab = 'docs'"
      >
        <Code :size="15" />
        <span>Headless REST API & SDK</span>
      </button>
    </div>

    <!-- Security Advisory Notice Banner -->
    <div class="api-notice-banner">
      <div class="notice-icon-box">
        <ShieldCheck :size="18" />
      </div>
      <div class="notice-content">
        <h4 class="notice-title">Isolasi Keamanan & Zero-Container Access Policy</h4>
        <p class="notice-desc">
          API dan Webhooks HeroCMS dirancang khusus untuk integrasi data tingkat aplikasi: <strong>Headless CMS</strong>, <strong>prospek formulir kontak</strong>, dan <strong>notifikasi real-time</strong>. Akses stop/start kontainer dan alur CI/CD sengaja ditiadakan dari publik API untuk mencegah eksploitasi infrastruktur cloud.
        </p>
      </div>
    </div>

    <!-- Quick Telemetry Summary Strip -->
    <div class="webhooks-stats-grid">
      <div class="stat-card">
        <div class="stat-top">
          <span class="stat-label">TOKEN PAT AKTIF</span>
          <Lock :size="15" class="stat-icon-blue" />
        </div>
        <div class="stat-value">
          {{ personalAccessTokens.filter(t => t.status === 'active').length }} Token
          <span class="rate-badge">Granular Scoped</span>
        </div>
        <div class="stat-sub">HMAC SHA-256 Auth • Auto Revoke</div>
      </div>

      <div class="stat-card">
        <div class="stat-top">
          <span class="stat-label">EVENT DISPATCHER</span>
          <span class="pulse-beacon"></span>
        </div>
        <div class="stat-value">Aktif & Listening</div>
        <div class="stat-sub">Redis Stream Ingest • Zero Dropped</div>
      </div>

      <div class="stat-card">
        <div class="stat-top">
          <span class="stat-label">TOTAL EVENT TERKIRIM</span>
          <Activity :size="15" class="stat-icon-emerald" />
        </div>
        <div class="stat-value">
          14,280 <span class="rate-badge">99.98% Sukses</span>
        </div>
        <div class="stat-sub">Dalam 30 hari terakhir</div>
      </div>

      <div class="stat-card">
        <div class="stat-top">
          <span class="stat-label">RATA-RATA LATENSI PING</span>
          <Clock :size="15" class="stat-icon-purple" />
        </div>
        <div class="stat-value">
          42 ms <span class="badge-online">Ultra Fast</span>
        </div>
        <div class="stat-sub">Timeout Limit: 5000ms</div>
      </div>
    </div>

    <!-- ================================================================= -->
    <!-- TAB 1: PERSONAL ACCESS TOKENS (PAT) -->
    <!-- ================================================================= -->
    <div v-if="activeTab === 'pat'" class="pat-vault-card">
      <div class="pat-section-header">
        <div>
          <h3 class="pat-section-title">Personal Access Tokens Terdaftar</h3>
          <p class="pat-section-desc">
            Token autentikasi aman dengan filter izin (scopes) granular layaknya Cloudflare API Tokens atau GitHub PAT. Gunakan token ini sebagai header <code>Authorization: Bearer &lt;TOKEN&gt;</code> pada aplikasi frontend Next.js, Flutter, atau otomasi Zapier.
          </p>
        </div>
        <button class="btn-primary-gradient" @click="openCreatePatModal">
          <Plus :size="14" />
          <span>Buat Token PAT Baru</span>
        </button>
      </div>

      <!-- PAT Tokens List -->
      <div v-if="personalAccessTokens.length > 0" class="pat-tokens-list">
        <div
          v-for="token in personalAccessTokens"
          :key="token.id"
          class="pat-token-item-card"
          :class="{ revoked: token.status === 'revoked' }"
        >
          <!-- Top Row: Name, Status & Masked String -->
          <div class="pat-token-top-row">
            <div class="pat-token-name-group">
              <strong class="pat-name-text">{{ token.name }}</strong>
              <span
                class="pat-status-badge"
                :class="token.status === 'active' ? 'active' : 'revoked'"
              >
                {{ token.status === 'active' ? 'Aktif' : 'Dicabut (Revoked)' }}
              </span>
            </div>

            <!-- Masked Token String with Copy Button -->
            <div class="pat-masked-token-wrap">
              <code class="pat-masked-code">{{ token.tokenMasked }}</code>
              <button
                class="btn-pat-copy-mini"
                @click="handleCopyMasked(token)"
                :title="copiedTokenId === token.id ? 'Tersalin' : 'Salin String Token'"
              >
                <Check v-if="copiedTokenId === token.id" :size="13" />
                <Copy v-else :size="13" />
                <span>{{ copiedTokenId === token.id ? 'Disalin' : 'Salin' }}</span>
              </button>
            </div>
          </div>

          <!-- Middle: Allowed Scopes Badges -->
          <div class="pat-scopes-wrap">
            <span class="pat-scopes-label">Cakupan Izin (Scopes):</span>
            <span
              v-for="sc in token.scopes"
              :key="sc"
              class="pat-scope-chip"
              :class="sc.split(':')[0]"
            >
              {{ sc }}
            </span>
          </div>

          <!-- Bottom: Meta Footer & Actions -->
          <div class="pat-meta-footer">
            <div class="pat-meta-details">
              <div class="pat-meta-item">
                <Clock :size="13" />
                <span>Masa Berlaku: <strong>{{ token.expiresAt }}</strong></span>
              </div>
              <div class="pat-meta-item">
                <Activity :size="13" />
                <span>Terakhir Digunakan: <strong>{{ token.lastUsedAt }}</strong></span>
              </div>
              <div class="pat-meta-item">
                <span>Dibuat: <strong>{{ token.createdAt }}</strong></span>
              </div>
            </div>

            <div class="pat-actions-group">
              <button
                v-if="token.status === 'active'"
                class="btn-pat-revoke"
                @click="handleRevoke(token)"
              >
                <AlertTriangle :size="13" />
                <span>Cabut Izin (Revoke)</span>
              </button>
              <button
                class="btn-pat-delete"
                @click="handleDelete(token)"
                title="Hapus token dari daftar"
              >
                <Trash2 :size="13" />
                <span>Hapus</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="pat-empty-state">
        <div class="pat-empty-icon">
          <Key :size="24" />
        </div>
        <h4 class="pat-empty-title">Belum Ada Personal Access Token</h4>
        <p class="pat-empty-desc">
          Buat token pertama Anda untuk mengintegrasikan website publik atau aplikasi mobile dengan konten HeroCMS secara terisolasi.
        </p>
        <button class="btn-primary-gradient" @click="openCreatePatModal">
          <Plus :size="14" />
          <span>Buat Token Baru</span>
        </button>
      </div>
    </div>

    <!-- ================================================================= -->
    <!-- TAB 2: OUTGOING EVENT WEBHOOKS -->
    <!-- ================================================================= -->
    <div v-if="activeTab === 'webhooks'">
      <div class="endpoints-card">
        <div class="endpoints-header">
          <div>
            <h3 class="endpoints-title">Endpoint Webhook Notifikasi</h3>
            <p class="endpoints-desc">
              HeroCMS akan mengirim payload HTTP POST JSON bertanda tangan HMAC-SHA256 ke endpoint Discord, Slack, atau server webhook Anda saat event terpicu.
            </p>
          </div>
          <div class="security-signature-chip">
            <ShieldCheck :size="12" />
            <span>Tanda Tangan Header: <code>X-HeroCMS-Signature</code></span>
          </div>
        </div>

        <div class="endpoints-list">
          <div
            v-for="wh in webhooks"
            :key="wh.id"
            class="endpoint-item-pro"
            :class="{ paused: wh.status === 'paused' }"
          >
            <div class="endpoint-status-icon">
              <div
                class="status-ping-orb"
                :class="wh.status === 'active' ? 'online' : 'paused'"
              ></div>
            </div>

            <div class="endpoint-main-info">
              <div class="endpoint-title-row">
                <strong class="endpoint-name">{{ wh.name }}</strong>
                <span class="delivery-status-tag">
                  <span class="status-dot"></span>
                  {{ wh.status === 'active' ? 'Aktif (Listening)' : 'Dijeda (Paused)' }}
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
              <button
                class="btn-endpoint-pause"
                @click="toggleWebhookStatus(wh.id)"
                :title="wh.status === 'active' ? 'Jeda pengiriman webhook' : 'Lanjutkan pengiriman'"
              >
                <Pause v-if="wh.status === 'active'" :size="13" />
                <Play v-else :size="13" />
                <span>{{ wh.status === 'active' ? 'Jeda' : 'Lanjutkan' }}</span>
              </button>
              <button
                class="btn-endpoint-del"
                @click="deleteWebhook(wh.id)"
                title="Hapus webhook"
              >
                <Trash2 :size="13" />
                <span>Hapus</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Webhook Delivery Logs Table -->
      <div class="delivery-logs-card">
        <div class="delivery-logs-head">
          <h4 class="delivery-logs-title">Riwayat Pengiriman Webhook Terakhir (Delivery Logs)</h4>
          <p class="delivery-logs-sub">
            Inspeksi telemetri pengiriman payload real-time, status HTTP response, dan latensi dispatch.
          </p>
        </div>

        <div class="delivery-table-wrapper">
          <table class="delivery-log-table">
            <thead>
              <tr>
                <th>Target Webhook</th>
                <th>Event Type</th>
                <th>HTTP Status</th>
                <th>Latensi</th>
                <th>Waktu Pengiriman</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="log in webhookDeliveryLogs" :key="log.id">
                <td><strong>{{ log.webhookName }}</strong></td>
                <td><span class="event-pill">{{ log.event }}</span></td>
                <td>
                  <span class="code-badge-200">
                    <CheckCircle2 :size="11" />
                    {{ log.statusCode }} OK
                  </span>
                </td>
                <td><span class="latency-tag">{{ log.durationMs }}ms</span></td>
                <td>{{ log.timestamp }}</td>
                <td>
                  <span class="rate-badge">Terkirim</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ================================================================= -->
    <!-- TAB 3: HEADLESS REST API & SDK -->
    <!-- ================================================================= -->
    <div v-if="activeTab === 'docs'" class="api-docs-container">
      <div class="api-docs-hero">
        <h3 class="api-docs-hero-title">Headless REST API Endpoint Reference</h3>
        <p class="api-docs-hero-desc">
          Akses konten CMS secara headless untuk Jamstack frontend (Next.js, Nuxt, Astro, SvelteKit) atau terima submit formulir prospek langsung ke HeroCMS Studio database.
        </p>

        <div class="api-auth-example-box">
          <span class="auth-header-label">FORMAT OTENTIKASI WAJIB:</span>
          <code class="auth-header-code">Authorization: Bearer hero_pat_9942_••••••••••••••••••••••••••••••••</code>
        </div>
      </div>

      <!-- Interactive Code Snippets Explorer -->
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

          <div style="display: flex; align-items: center; gap: 12px;">
            <span class="api-target-info">Base URL: <code>https://api.herocms.cloud/v1</code></span>
            <button class="btn-pat-copy-mini" @click="copyActiveSnippet">
              <Check v-if="isSnippetCopied" :size="13" />
              <Copy v-else :size="13" />
              <span>{{ isSnippetCopied ? 'Tersalin' : 'Salin Snippet' }}</span>
            </button>
          </div>
        </div>

        <div class="code-terminal-view">
          <pre><code>{{ codeSnippets[activeCodeTab] }}</code></pre>
        </div>
      </div>

      <!-- Available Endpoints Catalog -->
      <div class="pat-vault-card">
        <h4 class="pat-section-title" style="margin-bottom: 14px;">Katalog Endpoint Headless REST API v1</h4>
        <div class="endpoint-catalog-grid">
          <div class="endpoint-catalog-card">
            <div class="endpoint-path-row">
              <span class="http-method-pill get">GET</span>
              <code class="endpoint-path-code">/api/v1/content/articles</code>
              <span class="endpoint-desc-inline">Ambil daftar artikel yang terbit dengan filter tag & pagination</span>
            </div>
            <span class="endpoint-scope-required">scope: content:read</span>
          </div>

          <div class="endpoint-catalog-card">
            <div class="endpoint-path-row">
              <span class="http-method-pill get">GET</span>
              <code class="endpoint-path-code">/api/v1/content/articles/{slug}</code>
              <span class="endpoint-desc-inline">Ambil artikel detail beserta isi markdown/HTML lengkap</span>
            </div>
            <span class="endpoint-scope-required">scope: content:read</span>
          </div>

          <div class="endpoint-catalog-card">
            <div class="endpoint-path-row">
              <span class="http-method-pill post">POST</span>
              <code class="endpoint-path-code">/api/v1/leads/submit</code>
              <span class="endpoint-desc-inline">Kirim formulir kontak & pendaftaran prospek dari landing page publik</span>
            </div>
            <span class="endpoint-scope-required">scope: leads:write</span>
          </div>

          <div class="endpoint-catalog-card">
            <div class="endpoint-path-row">
              <span class="http-method-pill get">GET</span>
              <code class="endpoint-path-code">/api/v1/media/assets</code>
              <span class="endpoint-desc-inline">Ambil daftar media assets beserta public URL CDN MinIO S3</span>
            </div>
            <span class="endpoint-scope-required">scope: media:read</span>
          </div>

          <div class="endpoint-catalog-card">
            <div class="endpoint-path-row">
              <span class="http-method-pill get">GET</span>
              <code class="endpoint-path-code">/api/v1/telemetry/overview</code>
              <span class="endpoint-desc-inline">Baca statistik kunjungan mingguan dan telemetri situs</span>
            </div>
            <span class="endpoint-scope-required">scope: telemetry:read</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ================================================================= -->
    <!-- MODAL 1: BUAT PERSONAL ACCESS TOKEN BARU -->
    <!-- ================================================================= -->
    <Teleport to="body">
      <div
        v-if="isCreatePatModalOpen"
        class="modal-backdrop"
        @click.self="isCreatePatModalOpen = false"
      >
        <div class="modal-dialog">
          <div class="modal-header">
            <div class="modal-header-leading">
              <div class="modal-header-icon-box">
                <Key :size="18" />
              </div>
              <div>
                <h3 class="modal-heading">Generate Personal Access Token (PAT)</h3>
                <p class="modal-subheading">Konfigurasikan nama, masa berlaku, dan cakupan izin akses (scopes).</p>
              </div>
            </div>
            <button
              class="modal-close-button"
              @click="isCreatePatModalOpen = false"
              title="Tutup"
            >
              <X :size="16" />
            </button>
          </div>

          <form @submit.prevent="handleCreatePat" class="modal-form-body">
            <!-- Token Name -->
            <div class="form-group-block">
              <label class="input-label-row">
                <span class="label-text">Nama Token (Deskripsi Penggunaan)</span>
                <span class="label-badge-optional">Wajib</span>
              </label>
              <input
                v-model="newPatForm.name"
                type="text"
                class="form-text-input"
                placeholder="Misal: Next.js Jamstack Blog, Mobile Flutter App, Zapier CRM"
                required
                autofocus
              />
            </div>

            <!-- Expiration Dropdown -->
            <div class="form-group-block">
              <label class="input-label-row">
                <span class="label-text">Masa Berlaku (Expiration)</span>
              </label>
              <select v-model="newPatForm.expiresOption" class="form-select-input">
                <option value="30 Hari">30 Hari</option>
                <option value="60 Hari">60 Hari</option>
                <option value="90 Hari">90 Hari (Rekomendasi Keamanan)</option>
                <option value="1 Tahun">1 Tahun</option>
                <option value="Tidak Pernah">Tidak Pernah Expired (No Expiration)</option>
              </select>
            </div>

            <!-- Scopes Selection Matrix -->
            <div class="form-group-block">
              <label class="input-label-row">
                <span class="label-text">Cakupan Izin (Granular Scopes Filter)</span>
                <span class="label-badge-optional">{{ newPatForm.selectedScopes.length }} dipilih</span>
              </label>

              <div class="scopes-matrix-container">
                <div
                  v-for="cat in scopeCategories"
                  :key="cat.id"
                  class="scope-category-card"
                >
                  <div class="scope-category-head">
                    <div class="scope-category-title-wrap">
                      <component :is="cat.icon" :size="14" style="color: #64748b;" />
                      <span class="scope-category-name">{{ cat.label }}</span>
                      <span class="scope-category-count">
                        {{ getCategorySelectedCount(cat.id) }} / {{ getScopesByCategory(cat.id).length }}
                      </span>
                    </div>
                    <button
                      type="button"
                      class="btn-scope-toggle-all"
                      @click="toggleCategoryAll(cat.id)"
                    >
                      {{ isCategoryFullySelected(cat.id) ? 'Hapus Semua' : 'Pilih Semua' }}
                    </button>
                  </div>

                  <div class="scope-items-grid">
                    <div
                      v-for="scope in getScopesByCategory(cat.id)"
                      :key="scope.id"
                      class="scope-select-card"
                      :class="{ active: newPatForm.selectedScopes.includes(scope.id) }"
                      @click="toggleScopeItem(scope.id)"
                    >
                      <div class="scope-select-top">
                        <code class="scope-code-text">{{ scope.id }}</code>
                        <div
                          class="custom-checkbox"
                          :class="{ checked: newPatForm.selectedScopes.includes(scope.id) }"
                        >
                          <Check v-if="newPatForm.selectedScopes.includes(scope.id)" :size="11" />
                        </div>
                      </div>
                      <div class="scope-select-name">{{ scope.name }}</div>
                      <div class="scope-select-desc">{{ scope.description }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="modal-footer-row">
              <button
                type="button"
                class="btn-modal-ghost"
                @click="isCreatePatModalOpen = false"
              >
                Batal
              </button>
              <button type="submit" class="btn-modal-confirm">
                <Key :size="14" />
                <span>Generate Token</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- ================================================================= -->
    <!-- MODAL 2: ONE-TIME TOKEN REVEAL DIALOG (KRITIS) -->
    <!-- ================================================================= -->
    <Teleport to="body">
      <div
        v-if="isOneTimeModalOpen"
        class="modal-backdrop"
        @click.self="isOneTimeModalOpen = false"
      >
        <div class="modal-dialog">
          <div class="modal-header">
            <div class="modal-header-leading">
              <div class="modal-header-icon-box" style="background: #fef3c7; color: #b45309;">
                <Lock :size="18" />
              </div>
              <div>
                <h3 class="modal-heading">Simpan Token PAT Anda Sekarang</h3>
                <p class="modal-subheading">{{ revealedTokenName }}</p>
              </div>
            </div>
            <button
              class="modal-close-button"
              @click="isOneTimeModalOpen = false"
              title="Tutup"
            >
              <X :size="16" />
            </button>
          </div>

          <div class="modal-form-body">
            <!-- Warning Banner -->
            <div class="one-time-warning-box">
              <AlertTriangle :size="20" class="one-time-warning-icon" />
              <div>
                <h4 class="one-time-warning-title">Token Ini Hanya Ditampilkan Satu Kali!</h4>
                <p class="one-time-warning-desc">
                  Demi kepatuhan standar keamanan data (Zero-Knowledge Architecture), HeroCMS <strong>tidak pernah menyimpan raw token</strong> di database. Jika Anda menutup dialog ini tanpa menyalin, Anda harus membuat token baru.
                </p>
              </div>
            </div>

            <!-- Raw Token Box -->
            <div class="one-time-token-field">
              <span class="one-time-token-field-label">RAW PERSONAL ACCESS TOKEN</span>
              <div class="raw-token-code-row">
                <code class="raw-token-code">{{ revealedRawToken }}</code>
                <button
                  type="button"
                  class="btn-copy-raw-big"
                  :class="{ copied: isRawTokenCopied }"
                  @click="handleCopyRawToken"
                >
                  <Check v-if="isRawTokenCopied" :size="15" />
                  <Copy v-else :size="15" />
                  <span>{{ isRawTokenCopied ? 'Tersalin!' : 'Salin Token' }}</span>
                </button>
              </div>
            </div>

            <div class="modal-footer-row">
              <button
                type="button"
                class="btn-modal-confirm"
                @click="isOneTimeModalOpen = false"
              >
                <CheckCircle2 :size="14" />
                <span>Saya Sudah Menyimpan Token Ini</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ================================================================= -->
    <!-- MODAL 3: TAMBAH OUTGOING WEBHOOK BARU -->
    <!-- ================================================================= -->
    <Teleport to="body">
      <div
        v-if="isAddWebhookModalOpen"
        class="modal-backdrop"
        @click.self="isAddWebhookModalOpen = false"
      >
        <div class="modal-dialog">
          <div class="modal-header">
            <div class="modal-header-leading">
              <div class="modal-header-icon-box">
                <Webhook :size="18" />
              </div>
              <div>
                <h3 class="modal-heading">Tambah Webhook Endpoint</h3>
                <p class="modal-subheading">Konfigurasikan URL target penerima payload event notifikasi JSON.</p>
              </div>
            </div>
            <button
              class="modal-close-button"
              @click="isAddWebhookModalOpen = false"
              title="Tutup"
            >
              <X :size="16" />
            </button>
          </div>

          <form @submit.prevent="handleAddWebhookSubmit" class="modal-form-body">
            <div class="form-group-block">
              <label class="input-label-row">
                <span class="label-text">Nama Integrasi</span>
                <span class="label-badge-optional">Wajib</span>
              </label>
              <input
                v-model="newWebhookForm.name"
                type="text"
                class="form-text-input"
                placeholder="Contoh: Discord Alur Notifikasi Editorial (#leads-crm)"
                required
                autofocus
              />
            </div>

            <div class="form-group-block">
              <label class="input-label-row">
                <span class="label-text">Target URL Endpoint (Wajib HTTPS)</span>
                <span class="label-badge-optional">Wajib</span>
              </label>
              <input
                v-model="newWebhookForm.url"
                type="url"
                class="form-text-input"
                placeholder="https://discord.com/api/webhooks/... atau https://api.anda.com/hook"
                required
              />
            </div>

            <div class="form-group-block">
              <label class="input-label-row">
                <span class="label-text">Secret Signing Key (HMAC-SHA256)</span>
                <span class="label-badge-optional">Auto-generated</span>
              </label>
              <input
                v-model="newWebhookForm.secretKey"
                type="text"
                class="form-text-input"
                readonly
              />
            </div>

            <div class="form-group-block">
              <label class="input-label-row">
                <span class="label-text">Pilih Event Notifikasi Yang Dikirim</span>
                <span class="label-badge-optional">{{ newWebhookForm.events.length }} dipilih</span>
              </label>
              <div class="events-checklist-grid">
                <div
                  v-for="ev in availableNotificationEvents"
                  :key="ev.id"
                  class="event-check-box"
                  :class="{ active: newWebhookForm.events.includes(ev.id) }"
                  @click="toggleWebhookEvent(ev.id)"
                >
                  <div class="event-check-box-top">
                    <strong>{{ ev.id }}</strong>
                    <div
                      class="custom-checkbox"
                      :class="{ checked: newWebhookForm.events.includes(ev.id) }"
                    >
                      <Check v-if="newWebhookForm.events.includes(ev.id)" :size="12" />
                    </div>
                  </div>
                  <div class="event-check-title">{{ ev.label }}</div>
                  <div class="event-check-desc">{{ ev.desc }}</div>
                </div>
              </div>
            </div>

            <div class="modal-footer-row">
              <button
                type="button"
                class="btn-modal-ghost"
                @click="isAddWebhookModalOpen = false"
              >
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
