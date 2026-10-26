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
  ExternalLink,
  MessageSquare,
  Hash,
  Zap,
  Globe,
  RefreshCw,
  Info,
  Sparkles,
  Eye
} from 'lucide-vue-next';
import { useDashboardData } from '../../composables/useDashboardData';
import type { PersonalAccessToken, PatScopeCategory, WebhookDeliveryLog } from '../../types/dashboard';

const {
  webhooks,
  addWebhook,
  deleteWebhook,
  toggleWebhookStatus,
  testWebhook,
  redeliverWebhookEvent,
  patScopes,
  personalAccessTokens,
  webhookDeliveryLogs,
  createPersonalAccessToken,
  revokePersonalAccessToken,
  deletePersonalAccessToken,
  articles,
  mediaAssets,
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
const isDeliveryInspectorOpen = ref(false);

// Inspector state
const selectedDeliveryLog = ref<WebhookDeliveryLog | null>(null);
const inspectorActiveTab = ref<'request' | 'response'>('request');
const isInspectorPayloadCopied = ref(false);

const openDeliveryInspector = (log: WebhookDeliveryLog) => {
  selectedDeliveryLog.value = log;
  inspectorActiveTab.value = 'request';
  isDeliveryInspectorOpen.value = true;
};

const handleRedeliverFromInspector = () => {
  if (!selectedDeliveryLog.value) return;
  redeliverWebhookEvent(selectedDeliveryLog.value);
  selectedDeliveryLog.value.timestamp = 'Baru saja';
};

const copyInspectorPayload = () => {
  if (!selectedDeliveryLog.value?.requestPayload) return;
  navigator.clipboard.writeText(JSON.stringify(selectedDeliveryLog.value.requestPayload, null, 2));
  isInspectorPayloadCopied.value = true;
  showToast('Request payload disalin!', 'info');
  setTimeout(() => {
    isInspectorPayloadCopied.value = false;
  }, 2000);
};

// Interactive API Playground state
const playgroundSelectedToken = ref<string>('');
const playgroundEndpoint = ref<string>('/api/v1/content/articles');
const playgroundMethod = ref<'GET' | 'POST'>('GET');
const isPlaygroundExecuting = ref(false);
const playgroundResponse = ref<any>(null);
const playgroundMeta = ref<{ status: number; durationMs: number; statusText: string } | null>(null);
const isPlaygroundResponseCopied = ref(false);

// Auto-select first active PAT for playground
if (personalAccessTokens.value.length > 0) {
  const activeToken = personalAccessTokens.value.find(t => t.status === 'active') || personalAccessTokens.value[0];
  playgroundSelectedToken.value = activeToken.id;
}

const onPlaygroundEndpointChange = () => {
  if (playgroundEndpoint.value === '/api/v1/leads/submit') {
    playgroundMethod.value = 'POST';
  } else {
    playgroundMethod.value = 'GET';
  }
};

const executePlaygroundRequest = () => {
  isPlaygroundExecuting.value = true;
  setTimeout(() => {
    const token = personalAccessTokens.value.find(t => t.id === playgroundSelectedToken.value);
    const duration = Math.floor(14 + Math.random() * 18);

    if (!token || token.status === 'revoked') {
      playgroundMeta.value = {
        status: 401,
        statusText: 'Unauthorized',
        durationMs: duration
      };
      playgroundResponse.value = {
        error: 'Unauthorized',
        message: 'Personal Access Token tidak valid atau telah dicabut (revoked).',
        code: 'AUTH_TOKEN_INVALID'
      };
      isPlaygroundExecuting.value = false;
      return;
    }

    let requiredScope = 'content:read';
    if (playgroundEndpoint.value.includes('/content/')) requiredScope = 'content:read';
    if (playgroundEndpoint.value === '/api/v1/leads/submit') requiredScope = 'leads:write';
    if (playgroundEndpoint.value.includes('/media/')) requiredScope = 'media:read';
    if (playgroundEndpoint.value.includes('/telemetry/')) requiredScope = 'telemetry:read';

    if (!token.scopes.includes(requiredScope)) {
      playgroundMeta.value = {
        status: 403,
        statusText: 'Forbidden',
        durationMs: duration
      };
      playgroundResponse.value = {
        error: 'Forbidden',
        message: `Token '${token.name}' tidak memiliki cakupan izin scope '${requiredScope}' yang dibutuhkan.`,
        code: 'INSUFFICIENT_SCOPES',
        required_scope: requiredScope,
        token_scopes: token.scopes
      };
      isPlaygroundExecuting.value = false;
      return;
    }

    playgroundMeta.value = {
      status: 200,
      statusText: 'OK',
      durationMs: duration
    };

    if (playgroundEndpoint.value === '/api/v1/content/articles') {
      playgroundResponse.value = {
        status: 'success',
        endpoint: '/api/v1/content/articles',
        tenant: 'tenant-9942',
        total: articles.value.length,
        data: articles.value.slice(0, 3).map(a => ({
          id: a.id,
          title: a.title,
          slug: a.slug,
          category: a.category,
          author: a.author,
          views: a.views,
          status: a.status,
          published_at: a.publishedAt
        }))
      };
    } else if (playgroundEndpoint.value === '/api/v1/content/articles/membangun-arsitektur-cloud-mandiri') {
      const art = articles.value[0] || {
        id: 'art_8821',
        title: 'Membangun Arsitektur Cloud Mandiri',
        slug: 'membangun-arsitektur-cloud-mandiri',
        author: 'Rizal Pratama'
      };
      playgroundResponse.value = {
        status: 'success',
        data: {
          ...art,
          content_markdown: '# Membangun Arsitektur Cloud Mandiri\\n\\nStack Studio menyajikan isolasi kontainer mandiri dengan Edge Traefik v3...'
        }
      };
    } else if (playgroundEndpoint.value === '/api/v1/leads/submit') {
      playgroundResponse.value = {
        status: 'success',
        message: 'Formulir kontak berhasil diterima dan diarsipkan ke leads CRM.',
        lead_id: `lead_${Date.now()}`,
        created_at: new Date().toISOString()
      };
    } else if (playgroundEndpoint.value === '/api/v1/media/assets') {
      playgroundResponse.value = {
        status: 'success',
        total_assets: mediaAssets.value.length,
        data: mediaAssets.value.slice(0, 4).map(m => ({
          id: m.id,
          name: m.name,
          url: m.url,
          size: m.size,
          mime_type: m.type
        }))
      };
    } else if (playgroundEndpoint.value === '/api/v1/telemetry/overview') {
      playgroundResponse.value = {
        status: 'success',
        telemetry: {
          tenant_id: 'tenant-9942',
          total_pageviews_weekly: 14280,
          average_ttfb_ms: 1.8,
          active_containers: 3,
          ssl_status: 'valid_tls_1.3'
        }
      };
    }

    isPlaygroundExecuting.value = false;
  }, 350);
};

const copyPlaygroundResponse = () => {
  if (!playgroundResponse.value) return;
  navigator.clipboard.writeText(JSON.stringify(playgroundResponse.value, null, 2));
  isPlaygroundResponseCopied.value = true;
  showToast('Respons JSON playground disalin!', 'info');
  setTimeout(() => {
    isPlaygroundResponseCopied.value = false;
  }, 2000);
};

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

// Target Platform Presets for Webhooks
type PresetType = 'discord' | 'slack' | 'zapier' | 'custom';
const selectedPreset = ref<PresetType>('discord');

const webhookPresets = [
  {
    id: 'discord' as PresetType,
    name: 'Discord Webhook',
    desc: 'Alert channel bot Discord',
    icon: MessageSquare,
    badge: 'Populer',
    placeholder: 'https://discord.com/api/webhooks/128.../xyz',
    defaultName: 'Discord Alur Notifikasi Editorial (#editorial-alerts)',
    tip: 'Salin Webhook URL dari Server Settings > Integrations > Webhooks di server Discord Anda.',
    defaultEvents: ['article.published', 'lead.received']
  },
  {
    id: 'slack' as PresetType,
    name: 'Slack Incoming',
    desc: 'Bot alert channel Slack',
    icon: Hash,
    badge: 'Pro',
    placeholder: 'https://hooks.slack.com/services/T00/B00/XXXXX',
    defaultName: 'Slack Leads & Growth Bot (#leads-crm)',
    tip: 'Gunakan URL Incoming Webhooks dari integrasi Slack App pada workspace Anda.',
    defaultEvents: ['lead.received', 'traffic.spike']
  },
  {
    id: 'zapier' as PresetType,
    name: 'Zapier / Make',
    desc: 'Otomasi CRM, Sheet & App',
    icon: Zap,
    badge: 'Automasi',
    placeholder: 'https://hooks.zapier.com/hooks/catch/12345/abcde',
    defaultName: 'Zapier Event & Lead Relay',
    tip: 'Buat trigger Catch Webhook di Zapier untuk meneruskan payload ke 5.000+ aplikasi cloud.',
    defaultEvents: ['article.published', 'lead.received', 'backup.completed']
  },
  {
    id: 'custom' as PresetType,
    name: 'Custom HTTP API',
    desc: 'Endpoint API REST Anda',
    icon: Globe,
    badge: 'Universal',
    placeholder: 'https://api.perusahaan.com/v1/webhook',
    defaultName: 'Backend Event Webhook Listener (HTTPS)',
    tip: 'Payload HTTP POST JSON standar berkecepatan tinggi bertanda tangan HMAC-SHA256.',
    defaultEvents: ['article.published', 'lead.received', 'ssl.renewed']
  }
];

const selectPreset = (presetId: PresetType) => {
  selectedPreset.value = presetId;
  const preset = webhookPresets.find(p => p.id === presetId);
  if (!preset) return;

  const isPreviousDefault = webhookPresets.some(p => p.defaultName === newWebhookForm.value.name);
  if (!newWebhookForm.value.name.trim() || isPreviousDefault) {
    newWebhookForm.value.name = preset.defaultName;
  }
  newWebhookForm.value.events = [...preset.defaultEvents];
};

// Categorized Notification Events for Add Modal
interface WebhookEventCategory {
  id: string;
  name: string;
  icon: any;
  events: Array<{
    id: string;
    label: string;
    desc: string;
  }>;
}

const webhookEventCategories: WebhookEventCategory[] = [
  {
    id: 'editorial',
    name: 'Konten & Editorial CMS',
    icon: FileText,
    events: [
      {
        id: 'article.published',
        label: 'Konten Editorial Terbit',
        desc: 'Dipicu saat artikel baru diterbitkan secara publik dari CMS Studio'
      },
      {
        id: 'article.updated',
        label: 'Pembaruan Konten Artikel',
        desc: 'Dipicu saat konten artikel yang sudah terbit diperbarui'
      }
    ]
  },
  {
    id: 'leads',
    name: 'Formulir Kontak & Prospek (Leads CRM)',
    icon: Layers,
    events: [
      {
        id: 'lead.received',
        label: 'Formulir Kontak Masuk (Lead)',
        desc: 'Payload data kiriman pesan formulir konsultasi/kontak dari pengunjung situs publik'
      }
    ]
  },
  {
    id: 'edge_security',
    name: 'Edge Ingress & Keamanan Sistem',
    icon: ShieldCheck,
    events: [
      {
        id: 'ssl.renewed',
        label: 'Sertifikat SSL Diperbarui',
        desc: 'Konfirmasi sertifikat Let\'s Encrypt TLS 1.3 sukses diperpanjang otomatis di Edge Traefik v3'
      },
      {
        id: 'traffic.spike',
        label: 'Peringatan Lonjakan Trafik',
        desc: 'Notifikasi otomatis saat volume kunjungan melonjak melewati batas wajar'
      }
    ]
  },
  {
    id: 'maintenance',
    name: 'Pemeliharaan & Cadangan Data',
    icon: Clock,
    events: [
      {
        id: 'backup.completed',
        label: 'Snapshot Backup Selesai',
        desc: 'Konfirmasi arsip snapshot database PostgreSQL dan MinIO S3 sukses tersimpan'
      }
    ]
  }
];

const isCategoryAllSelected = (cat: WebhookEventCategory) => {
  return cat.events.every(e => newWebhookForm.value.events.includes(e.id));
};

const getCategoryCount = (cat: WebhookEventCategory) => {
  return cat.events.filter(e => newWebhookForm.value.events.includes(e.id)).length;
};

const toggleCategoryAllEvents = (cat: WebhookEventCategory) => {
  const allSel = isCategoryAllSelected(cat);
  if (allSel) {
    newWebhookForm.value.events = newWebhookForm.value.events.filter(
      id => !cat.events.some(e => e.id === id)
    );
    if (newWebhookForm.value.events.length === 0) {
      newWebhookForm.value.events = ['article.published'];
      showToast('Minimal 1 event notifikasi harus tetap terpilih.', 'info');
    }
  } else {
    for (const e of cat.events) {
      if (!newWebhookForm.value.events.includes(e.id)) {
        newWebhookForm.value.events.push(e.id);
      }
    }
  }
};

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

// Secret Signing Key Management
const isRollingSecret = ref(false);
const isSecretCopied = ref(false);

const regenerateSecretKey = () => {
  isRollingSecret.value = true;
  setTimeout(() => {
    newWebhookForm.value.secretKey = `whsec_9942_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 8)}`;
    isRollingSecret.value = false;
    showToast('Secret signing key baru berhasil di-generate!', 'info');
  }, 250);
};

const copySecretKey = () => {
  if (!newWebhookForm.value.secretKey) return;
  navigator.clipboard.writeText(newWebhookForm.value.secretKey);
  isSecretCopied.value = true;
  showToast('Secret key berhasil disalin!', 'success');
  setTimeout(() => {
    isSecretCopied.value = false;
  }, 2000);
};

// Live Dynamic JSON Payload Preview
const selectedPreviewEvent = ref<string>('article.published');
const isPayloadCopied = ref(false);

const getSamplePayload = (eventId: string) => {
  const nowIso = new Date().toISOString();
  switch (eventId) {
    case 'article.published':
    case 'article.updated':
      return {
        event: eventId,
        timestamp: nowIso,
        tenant_id: 'tenant-9942',
        webhook_id: 'wh_auto_generated',
        data: {
          article_id: 'art_8821',
          title: 'Membangun Arsitektur Cloud Mandiri & Multi-Tenant',
          slug: 'membangun-arsitektur-cloud-mandiri',
          category: 'Teknologi & Cloud',
          author: 'Rizal Pratama',
          published_at: nowIso,
          url: 'https://rizalpratama.stacbyte.id/artikel/membangun-arsitektur-cloud-mandiri'
        }
      };
    case 'lead.received':
      return {
        event: 'lead.received',
        timestamp: nowIso,
        tenant_id: 'tenant-9942',
        webhook_id: 'wh_auto_generated',
        data: {
          lead_id: 'lead_9942_01',
          name: 'Budi Santoso',
          email: 'budi@enterprise.co.id',
          phone: '+6281234567890',
          company: 'PT Solusi Bangsa Digital',
          message: 'Tertarik dengan implementasi Stack untuk 50 kontainer website.',
          source_site: 'rizalpratama.stacbyte.id'
        }
      };
    case 'ssl.renewed':
      return {
        event: 'ssl.renewed',
        timestamp: nowIso,
        tenant_id: 'tenant-9942',
        webhook_id: 'wh_auto_generated',
        data: {
          domain: 'rizalpratama.stacbyte.id',
          issuer: "Let's Encrypt Authority X3",
          tls_version: 'TLS 1.3',
          valid_until: '2027-01-18T00:00:00Z',
          edge_router: 'traefik-v3-edge-01'
        }
      };
    case 'traffic.spike':
      return {
        event: 'traffic.spike',
        timestamp: nowIso,
        tenant_id: 'tenant-9942',
        webhook_id: 'wh_auto_generated',
        data: {
          container_id: 'cnt_9942_01',
          subdomain: 'rizalpratama.stacbyte.id',
          requests_per_minute: 4820,
          normal_baseline: 450,
          ratio: '10.7x spike',
          action_taken: 'Traefik rate-limit & edge caching activated'
        }
      };
    case 'backup.completed':
      return {
        event: 'backup.completed',
        timestamp: nowIso,
        tenant_id: 'tenant-9942',
        webhook_id: 'wh_auto_generated',
        data: {
          backup_id: 'snap_20261020_9942',
          size_compressed: '142.5 MB',
          postgres_tables: 38,
          s3_objects_archived: 124,
          storage_target: 'cold-storage-cluster-jkt'
        }
      };
    default:
      return {
        event: eventId,
        timestamp: nowIso,
        tenant_id: 'tenant-9942',
        status: 'simulated'
      };
  }
};

const copyPreviewPayload = () => {
  const jsonStr = JSON.stringify(getSamplePayload(selectedPreviewEvent.value), null, 2);
  navigator.clipboard.writeText(jsonStr);
  isPayloadCopied.value = true;
  showToast('Contoh JSON payload berhasil disalin!', 'info');
  setTimeout(() => {
    isPayloadCopied.value = false;
  }, 2000);
};

// Scope categories for PAT matrix
const scopeCategories: Array<{ id: PatScopeCategory; label: string; icon: any }> = [
  { id: 'content', label: 'Konten Editorial & Halaman (Headless)', icon: FileText },
  { id: 'leads', label: 'Formulir & Prospek Masuk (Leads)', icon: Layers },
  { id: 'media', label: 'Media CDN & S3 Storage', icon: ExternalLink },
  { id: 'telemetry', label: 'Telemetri & Analitik Kunjungan', icon: Activity },
  { id: 'tickets', label: 'Pusat Bantuan & Support', icon: ShieldCheck }
];

// Quick Scope Presets for PAT Generation
type PatPresetType = 'jamstack' | 'writer' | 'leads' | 'all' | 'custom';
const activePatPreset = ref<PatPresetType>('jamstack');

const applyPatPreset = (preset: PatPresetType) => {
  activePatPreset.value = preset;
  switch (preset) {
    case 'jamstack':
      newPatForm.value.selectedScopes = ['content:read', 'media:read'];
      break;
    case 'writer':
      newPatForm.value.selectedScopes = ['content:read', 'content:write', 'media:read', 'media:upload'];
      break;
    case 'leads':
      newPatForm.value.selectedScopes = ['leads:read', 'leads:write'];
      break;
    case 'all':
      newPatForm.value.selectedScopes = patScopes.value.map(s => s.id);
      break;
  }
};

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
  activePatPreset.value = 'custom';
};

const toggleScopeItem = (scopeId: string) => {
  const idx = newPatForm.value.selectedScopes.indexOf(scopeId);
  if (idx > -1) {
    newPatForm.value.selectedScopes.splice(idx, 1);
  } else {
    newPatForm.value.selectedScopes.push(scopeId);
  }
  activePatPreset.value = 'custom';
};

// PAT Creation Handler
const openCreatePatModal = () => {
  activePatPreset.value = 'jamstack';
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
  selectedPreset.value = 'discord';
  newWebhookForm.value = {
    name: 'Discord Alur Notifikasi Editorial (#editorial-alerts)',
    url: '',
    secretKey: `whsec_9942_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 8)}`,
    events: ['article.published', 'lead.received']
  };
  selectedPreviewEvent.value = 'article.published';
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
curl -X GET "https://api.aether.cloud/v1/content/articles?status=published" \\
  -H "Authorization: Bearer stack_pat_9942_••••••••••••" \\
  -H "Content-Type: application/json"

# 2. Kirim Prospek / Formulir Kontak dari Landing Page
curl -X POST "https://api.aether.cloud/v1/leads/submit" \\
  -H "Authorization: Bearer stack_pat_9942_••••••••••••" \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Budi Santoso","email":"budi@perusahaan.com","message":"Tertarik demo platform"}'`,

  ts: `import { StackClient } from '@aether/stack-sdk';

// Inisialisasi SDK dengan Personal Access Token (PAT)
const stack = new StackClient({
  token: process.env.STACK_PAT_TOKEN, // stack_pat_9942_...
  tenantId: 'tenant-9942'
});

// Ambil artikel terbit untuk rendering Next.js / Astro static site
const { data: articles } = await stack.content.getArticles({
  category: 'Teknologi',
  limit: 10
});

console.log('Total artikel terbit:', articles.length);`,

  go: `package main

import (
  "context"
  "fmt"
  "github.com/aethercloud/stack-sdk-go/stack"
)

func main() {
  // Client Headless CMS resmi Stack
  client := stack.NewClient("stack_pat_9942_••••••••••••")

  articles, err := client.Content.ListArticles(context.Background(), &stack.ListOptions{
    Status: "published",
    Limit:  20,
  })
  if err != nil {
    panic(err)
  }

  fmt.Printf("Berhasil mengambil %d artikel\\n", len(articles))
}`,

  py: `from aether_stack import StackClient

# Inisialisasi client Python untuk analisis atau ingest data
client = StackClient(token="stack_pat_9942_••••••••••••")

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
          API dan Webhooks Stack (Aether Core) dirancang khusus untuk integrasi data tingkat aplikasi: <strong>Headless CMS</strong>, <strong>prospek formulir kontak</strong>, dan <strong>notifikasi real-time</strong>. Akses stop/start kontainer dan alur CI/CD sengaja ditiadakan dari publik API untuk mencegah eksploitasi infrastruktur cloud.
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
          Buat token pertama Anda untuk mengintegrasikan website publik atau aplikasi mobile dengan konten Stack secara terisolasi.
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
              Stack by Aether Core akan mengirim payload HTTP POST JSON bertanda tangan HMAC-SHA256 ke endpoint Discord, Slack, atau server webhook Anda saat event terpicu.
            </p>
          </div>
          <div class="security-signature-chip">
            <ShieldCheck :size="12" />
            <span>Tanda Tangan Header: <code>X-Stack-Signature</code></span>
          </div>
        </div>

        <div v-if="webhooks.length > 0" class="endpoints-list">
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
        <div v-else style="padding: 36px 20px; text-align: center; background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 10px; margin-top: 12px;">
          <Webhook :size="28" style="color: #94a3b8; margin: 0 auto 8px auto;" />
          <h4 style="font-size: 0.88rem; font-weight: 700; color: #0f172a; margin: 0 0 4px 0;">Belum Ada Webhook Terdaftar</h4>
          <p style="font-size: 0.74rem; color: #64748b; margin: 0 0 14px 0;">
            Tambahkan URL endpoint server atau Discord/Slack Anda untuk menerima notifikasi otomatis saat event terjadi.
          </p>
          <button type="button" class="btn-top-create" style="margin: 0 auto;" @click="openAddWebhookModal">
            <Plus :size="13" />
            <span>Tambah Webhook Baru</span>
          </button>
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
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody v-if="webhookDeliveryLogs.length > 0">
              <tr
                v-for="log in webhookDeliveryLogs"
                :key="log.id"
                class="delivery-log-row-interactive"
                @click="openDeliveryInspector(log)"
              >
                <td><strong>{{ log.webhookName }}</strong></td>
                <td><span class="event-pill">{{ log.event }}</span></td>
                <td>
                  <span :class="log.statusCode >= 200 && log.statusCode < 300 ? 'code-badge-200' : 'code-badge-error'">
                    <CheckCircle2 v-if="log.statusCode >= 200 && log.statusCode < 300" :size="11" />
                    <AlertTriangle v-else :size="11" />
                    {{ log.statusCode }} {{ log.statusCode === 200 ? 'OK' : 'Error' }}
                  </span>
                </td>
                <td><span class="latency-tag">{{ log.durationMs }}ms</span></td>
                <td>{{ log.timestamp }}</td>
                <td>
                  <span class="rate-badge">Terkirim</span>
                </td>
                <td>
                  <button
                    type="button"
                    class="btn-inspect-log"
                    @click.stop="openDeliveryInspector(log)"
                    title="Buka detail payload dan header"
                  >
                    <Eye :size="11" />
                    <span>Inspeksi</span>
                  </button>
                </td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="7" style="text-align: center; padding: 36px 16px; color: #64748b; font-size: 0.76rem;">
                  Belum ada log pengiriman webhook. Riwayat dispatch HTTP akan muncul otomatis di sini saat ada event terpanggil.
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
          Akses konten CMS secara headless untuk Jamstack frontend (Next.js, Nuxt, Astro, SvelteKit) atau terima submit formulir prospek langsung ke Stack Studio database.
        </p>

        <div class="api-auth-example-box">
          <span class="auth-header-label">FORMAT OTENTIKASI WAJIB:</span>
          <code class="auth-header-code">Authorization: Bearer stack_pat_9942_••••••••••••••••••••••••••••••••</code>
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
            <span class="api-target-info">Base URL: <code>https://api.aether.cloud/v1</code></span>
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

      <!-- Interactive In-Browser REST API Playground Card -->
      <div class="api-playground-card">
        <div class="playground-title-row">
          <div>
            <h4 class="playground-title-text">
              <Sparkles :size="15" style="color: #2563eb;" />
              <span>Interactive REST API Request Playground ("Try It Out")</span>
            </h4>
            <p class="playground-subtitle">
              Uji coba request langsung di dalam browser menggunakan token PAT aktif Anda. Mendukung validasi scope otomatis dan live data.
            </p>
          </div>
          <span class="playground-badge-pill">Live In-Browser Runner</span>
        </div>

        <!-- Request Config Bar -->
        <div class="playground-request-bar">
          <select v-model="playgroundMethod" class="playground-method-select">
            <option value="GET">GET</option>
            <option value="POST">POST</option>
          </select>

          <select
            v-model="playgroundEndpoint"
            class="playground-endpoint-select"
            @change="onPlaygroundEndpointChange"
          >
            <option value="/api/v1/content/articles">GET /api/v1/content/articles (Daftar Artikel)</option>
            <option value="/api/v1/content/articles/membangun-arsitektur-cloud-mandiri">GET /api/v1/content/articles/{slug} (Detail Artikel)</option>
            <option value="/api/v1/leads/submit">POST /api/v1/leads/submit (Submit Formulir Prospek)</option>
            <option value="/api/v1/media/assets">GET /api/v1/media/assets (Media & CDN URLs)</option>
            <option value="/api/v1/telemetry/overview">GET /api/v1/telemetry/overview (Telemetri Situs)</option>
          </select>

          <select v-model="playgroundSelectedToken" class="playground-token-picker" title="Pilih Personal Access Token untuk otentikasi">
            <option v-for="t in personalAccessTokens" :key="t.id" :value="t.id">
              PAT: {{ t.name }} ({{ t.status === 'active' ? 'Aktif' : 'Dicabut' }})
            </option>
          </select>

          <button
            type="button"
            class="btn-playground-execute"
            :disabled="isPlaygroundExecuting || personalAccessTokens.length === 0"
            @click="executePlaygroundRequest"
          >
            <RefreshCw v-if="isPlaygroundExecuting" :size="13" class="spin-anim" />
            <Send v-else :size="13" />
            <span>{{ isPlaygroundExecuting ? 'Mengirim...' : 'Kirim Request' }}</span>
          </button>
        </div>

        <!-- Terminal Output View -->
        <div class="playground-terminal-view">
          <div class="playground-terminal-header">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Response JSON Output</span>
              <span
                v-if="playgroundMeta"
                class="playground-status-pill"
                :class="playgroundMeta.status >= 200 && playgroundMeta.status < 300 ? 'success' : 'error'"
              >
                {{ playgroundMeta.status }} {{ playgroundMeta.statusText }} • {{ playgroundMeta.durationMs }}ms
              </span>
            </div>

            <button
              v-if="playgroundResponse"
              type="button"
              class="btn-pat-copy-mini"
              @click="copyPlaygroundResponse"
            >
              <Check v-if="isPlaygroundResponseCopied" :size="11" />
              <Copy v-else :size="11" />
              <span>{{ isPlaygroundResponseCopied ? 'Tersalin' : 'Salin Output' }}</span>
            </button>
          </div>

          <div class="playground-terminal-body">
            <pre v-if="playgroundResponse" class="playground-code-pre"><code>{{ JSON.stringify(playgroundResponse, null, 2) }}</code></pre>
            <pre v-else class="playground-code-pre" style="color: #64748b;"><code>// Tekan tombol "Kirim Request" di atas untuk mengeksekusi endpoint live dengan Personal Access Token yang dipilih.
// Server akan memvalidasi header Bearer Token dan hak akses scopes secara otomatis.</code></pre>
          </div>
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
    <!-- MODAL 1: BUAT PERSONAL ACCESS TOKEN BARU (EXPANSIVE & RESPONSIVE) -->
    <!-- ================================================================= -->
    <Teleport to="body">
      <div
        v-if="isCreatePatModalOpen"
        class="modal-backdrop"
        @click.self="isCreatePatModalOpen = false"
      >
        <div class="modal-dialog modal-dialog-pat">
          <!-- Modal Header -->
          <div class="modal-header">
            <div class="modal-header-leading">
              <div class="modal-header-icon-box" style="background: #eff6ff; color: #2563eb;">
                <Key :size="18" />
              </div>
              <div>
                <h3 class="modal-heading">Generate Personal Access Token (PAT)</h3>
                <p class="modal-subheading">Konfigurasikan nama, masa berlaku, dan cakupan izin akses (scopes) granular.</p>
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
            <!-- 1. Top Settings: Token Name & Expiration (Responsive 2-Col Grid) -->
            <div class="pat-modal-settings-grid">
              <div class="form-group-block" style="margin-bottom: 0;">
                <label class="input-label-row">
                  <span class="label-text">Nama Token (Deskripsi Penggunaan)</span>
                  <span class="label-badge-optional">Wajib</span>
                </label>
                <input
                  v-model="newPatForm.name"
                  type="text"
                  class="form-text-input"
                  placeholder="Contoh: Next.js Jamstack Blog, Flutter Mobile Reader, Zapier CRM"
                  required
                  autofocus
                />
              </div>

              <div class="form-group-block" style="margin-bottom: 0;">
                <label class="input-label-row">
                  <span class="label-text">Masa Berlaku (Expiration)</span>
                  <span class="label-badge-optional" style="color: #059669; font-weight: 700;">Keamanan Direkomendasikan</span>
                </label>
                <select v-model="newPatForm.expiresOption" class="form-select-input">
                  <option value="30 Hari">30 Hari</option>
                  <option value="60 Hari">60 Hari</option>
                  <option value="90 Hari">90 Hari (Rekomendasi Keamanan)</option>
                  <option value="1 Tahun">1 Tahun</option>
                  <option value="Tidak Pernah">Tidak Pernah Expired (No Expiration)</option>
                </select>
              </div>
            </div>

            <!-- 2. Quick Scope Presets Selector Bar -->
            <div class="pat-quick-presets-bar">
              <div class="pat-quick-presets-label">
                <Sparkles :size="14" style="color: #2563eb;" />
                <span>Pilihan Template Izin Cepat:</span>
              </div>
              <div class="pat-preset-buttons">
                <button
                  type="button"
                  class="btn-pat-preset-pill"
                  :class="{ active: activePatPreset === 'jamstack' }"
                  @click="applyPatPreset('jamstack')"
                >
                  <FileText :size="12" />
                  <span>Jamstack Reader (2 scope)</span>
                </button>
                <button
                  type="button"
                  class="btn-pat-preset-pill"
                  :class="{ active: activePatPreset === 'writer' }"
                  @click="applyPatPreset('writer')"
                >
                  <Key :size="12" />
                  <span>Content Writer (4 scope)</span>
                </button>
                <button
                  type="button"
                  class="btn-pat-preset-pill"
                  :class="{ active: activePatPreset === 'leads' }"
                  @click="applyPatPreset('leads')"
                >
                  <Layers :size="12" />
                  <span>Lead Collector (2 scope)</span>
                </button>
                <button
                  type="button"
                  class="btn-pat-preset-pill"
                  :class="{ active: activePatPreset === 'all' }"
                  @click="applyPatPreset('all')"
                >
                  <CheckCircle2 :size="12" />
                  <span>Semua Izin (Full Access)</span>
                </button>
              </div>
            </div>

            <!-- 3. Granular Scopes Filter Matrix -->
            <div class="form-group-block">
              <label class="input-label-row">
                <span class="label-text">Matriks Cakupan Izin Granular (Scopes)</span>
                <span class="label-badge-optional">{{ newPatForm.selectedScopes.length }} scope terpilih</span>
              </label>

              <div class="scopes-matrix-container">
                <div
                  v-for="cat in scopeCategories"
                  :key="cat.id"
                  class="scope-category-card"
                >
                  <div class="scope-category-head">
                    <div class="scope-category-title-wrap">
                      <component :is="cat.icon" :size="15" style="color: #475569;" />
                      <strong class="scope-category-name">{{ cat.label }}</strong>
                      <span class="scope-category-count">
                        {{ getCategorySelectedCount(cat.id) }} dari {{ getScopesByCategory(cat.id).length }} dipilih
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

            <!-- 4. Active Permissions Live Summary Strip -->
            <div class="pat-scopes-live-summary">
              <div class="pat-summary-left">
                <ShieldCheck :size="14" style="color: #059669;" />
                <span>Ikhtisar Izin Aktif:</span>
                <span class="pat-summary-count-badge">{{ newPatForm.selectedScopes.length }} scope diizinkan</span>
              </div>
              <div class="pat-summary-chips">
                <span
                  v-for="sc in newPatForm.selectedScopes"
                  :key="sc"
                  class="pat-scope-chip"
                  :class="sc.split(':')[0]"
                >
                  {{ sc }}
                </span>
              </div>
            </div>

            <!-- 5. Modal Footer Actions (Guaranteed Side-by-Side) -->
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
                <span>Generate Token PAT</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- ================================================================= -->
    <!-- MODAL 2: ONE-TIME TOKEN REVEAL DIALOG (EXPANSIVE & ZERO-KNOWLEDGE) -->
    <!-- ================================================================= -->
    <Teleport to="body">
      <div
        v-if="isOneTimeModalOpen"
        class="modal-backdrop"
        @click.self="isOneTimeModalOpen = false"
      >
        <div class="modal-dialog modal-dialog-onetime">
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
                  Demi kepatuhan standar keamanan data (Zero-Knowledge Architecture), Stack (Aether Core) <strong>tidak pernah menyimpan raw token</strong> di database. Jika Anda menutup dialog ini tanpa menyalin, Anda harus membuat token baru.
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
    <!-- MODAL 3: TAMBAH OUTGOING WEBHOOK BARU (REFAKTOR PRESET & EVENT GROUPS) -->
    <!-- ================================================================= -->
    <Teleport to="body">
      <div
        v-if="isAddWebhookModalOpen"
        class="modal-backdrop"
        @click.self="isAddWebhookModalOpen = false"
      >
        <div class="modal-dialog" style="max-width: 720px;">
          <!-- Modal Header -->
          <div class="modal-header">
            <div class="modal-header-leading">
              <div class="modal-header-icon-box" style="background: #eff6ff; color: #2563eb;">
                <Webhook :size="18" />
              </div>
              <div>
                <h3 class="modal-heading">Tambah Webhook Endpoint Notifikasi</h3>
                <p class="modal-subheading">Kirimkan payload HTTP POST JSON real-time ke Discord, Slack, Zapier, atau endpoint API server.</p>
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
            <!-- 1. Platform Presets Selector -->
            <div class="form-group-block">
              <label class="input-label-row">
                <span class="label-text">Pilih Platform Target (Preset Integrasi)</span>
                <span class="label-badge-optional">Rekomendasi Cepat</span>
              </label>
              <div class="webhook-presets-grid">
                <div
                  v-for="preset in webhookPresets"
                  :key="preset.id"
                  class="webhook-preset-card"
                  :class="{ active: selectedPreset === preset.id }"
                  @click="selectPreset(preset.id)"
                >
                  <span class="webhook-preset-badge">{{ preset.badge }}</span>
                  <div
                    class="webhook-preset-icon-box"
                    :class="preset.id"
                  >
                    <component :is="preset.icon" :size="17" />
                  </div>
                  <strong class="webhook-preset-name">{{ preset.name }}</strong>
                  <span class="webhook-preset-desc">{{ preset.desc }}</span>
                </div>
              </div>

              <!-- Preset Guidance Tip Box -->
              <div class="preset-helper-tip-box">
                <Info :size="14" style="color: #2563eb; flex-shrink: 0;" />
                <span class="helper-tip-text">
                  <strong>Tips {{ webhookPresets.find(p => p.id === selectedPreset)?.name }}:</strong>
                  {{ webhookPresets.find(p => p.id === selectedPreset)?.tip }}
                </span>
              </div>
            </div>

            <!-- 2. Integration Name & Endpoint URL -->
            <div class="form-group-block">
              <label class="input-label-row">
                <span class="label-text">Nama Integrasi Webhook</span>
                <span class="label-badge-optional">Wajib</span>
              </label>
              <input
                v-model="newWebhookForm.name"
                type="text"
                class="form-text-input"
                placeholder="Contoh: Discord Alur Notifikasi Editorial (#editorial-alerts)"
                required
              />
            </div>

            <div class="form-group-block">
              <label class="input-label-row">
                <span class="label-text">Target URL Endpoint (Wajib HTTPS)</span>
                <span class="label-badge-optional">Protokol Terenkripsi TLS 1.3</span>
              </label>
              <input
                v-model="newWebhookForm.url"
                type="url"
                class="form-text-input"
                :placeholder="webhookPresets.find(p => p.id === selectedPreset)?.placeholder || 'https://api.perusahaan.com/v1/webhook'"
                required
              />
            </div>

            <!-- 3. Secret Signing Key (HMAC-SHA256) -->
            <div class="form-group-block">
              <label class="input-label-row">
                <span class="label-text">Kunci Tanda Tangan Rahasia (HMAC-SHA256 Secret)</span>
                <span class="label-badge-optional">Header: X-Stack-Signature</span>
              </label>
              <div class="secret-key-field-wrap">
                <span class="secret-prefix-tag">HMAC-SHA256</span>
                <code class="secret-code-display">{{ newWebhookForm.secretKey }}</code>
                <div class="secret-actions-wrap">
                  <button
                    type="button"
                    class="btn-secret-tool"
                    :disabled="isRollingSecret"
                    @click="regenerateSecretKey"
                    title="Generate kunci secret baru"
                  >
                    <RefreshCw :size="12" :class="{ 'spin-anim': isRollingSecret }" />
                    <span>{{ isRollingSecret ? 'Rolling...' : 'Roll Secret' }}</span>
                  </button>
                  <button
                    type="button"
                    class="btn-secret-tool"
                    :class="{ copied: isSecretCopied }"
                    @click="copySecretKey"
                    title="Salin secret key"
                  >
                    <Check v-if="isSecretCopied" :size="12" />
                    <Copy v-else :size="12" />
                    <span>{{ isSecretCopied ? 'Tersalin' : 'Salin' }}</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- 4. Grouped Notification Events Selection -->
            <div class="form-group-block">
              <label class="input-label-row">
                <span class="label-text">Pilih Event Notifikasi Yang Dikirim</span>
                <span class="label-badge-optional">{{ newWebhookForm.events.length }} event aktif</span>
              </label>

              <div class="webhook-event-groups-container">
                <div
                  v-for="cat in webhookEventCategories"
                  :key="cat.id"
                  class="webhook-group-card"
                >
                  <div class="webhook-group-head">
                    <div class="webhook-group-title-row">
                      <component :is="cat.icon" :size="14" style="color: #64748b;" />
                      <span class="webhook-group-title">{{ cat.name }}</span>
                      <span class="webhook-group-count">
                        {{ getCategoryCount(cat) }} / {{ cat.events.length }}
                      </span>
                    </div>
                    <button
                      type="button"
                      class="btn-group-toggle-all"
                      @click="toggleCategoryAllEvents(cat)"
                    >
                      {{ isCategoryAllSelected(cat) ? 'Hapus Semua' : 'Pilih Semua' }}
                    </button>
                  </div>

                  <div class="webhook-event-grid">
                    <div
                      v-for="ev in cat.events"
                      :key="ev.id"
                      class="webhook-event-select-card"
                      :class="{ active: newWebhookForm.events.includes(ev.id) }"
                      @click="toggleWebhookEvent(ev.id)"
                    >
                      <div class="webhook-event-top">
                        <code class="webhook-event-id">{{ ev.id }}</code>
                        <div
                          class="custom-checkbox"
                          :class="{ checked: newWebhookForm.events.includes(ev.id) }"
                        >
                          <Check v-if="newWebhookForm.events.includes(ev.id)" :size="11" />
                        </div>
                      </div>
                      <div class="webhook-event-title">{{ ev.label }}</div>
                      <div class="webhook-event-desc">{{ ev.desc }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 5. Live Dynamic JSON Payload Preview -->
            <div class="form-group-block">
              <label class="input-label-row">
                <span class="label-text">Pratinjau JSON Payload Real-Time</span>
                <span class="label-badge-optional">Format Data Terkirim</span>
              </label>

              <div class="payload-preview-section">
                <div class="payload-preview-header">
                  <div class="payload-preview-title-wrap">
                    <Sparkles :size="13" style="color: #0284c7;" />
                    <span>Pilih Sampel Event Payload:</span>
                  </div>

                  <div class="payload-event-tabs">
                    <button
                      type="button"
                      v-for="ev in ['article.published', 'lead.received', 'ssl.renewed', 'traffic.spike', 'backup.completed']"
                      :key="ev"
                      class="payload-event-tab-btn"
                      :class="{ active: selectedPreviewEvent === ev }"
                      @click="selectedPreviewEvent = ev"
                    >
                      {{ ev }}
                    </button>
                  </div>
                </div>

                <div class="payload-terminal-box">
                  <button
                    type="button"
                    class="btn-copy-preview-payload"
                    @click="copyPreviewPayload"
                    title="Salin contoh JSON payload"
                  >
                    <Check v-if="isPayloadCopied" :size="11" />
                    <Copy v-else :size="11" />
                    <span>{{ isPayloadCopied ? 'Tersalin' : 'Salin JSON' }}</span>
                  </button>
                  <pre class="payload-code-pre"><code>{{ JSON.stringify(getSamplePayload(selectedPreviewEvent), null, 2) }}</code></pre>
                </div>
              </div>
            </div>

            <!-- Modal Footer Actions (Guaranteed Side-by-Side) -->
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
                <span>Simpan Webhook Endpoint</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- ================================================================= -->
      <!-- MODAL 4: WEBHOOK DELIVERY INSPECTOR (REQUEST/RESPONSE & REDELIVER) -->
      <!-- ================================================================= -->
      <div
        v-if="isDeliveryInspectorOpen && selectedDeliveryLog"
        class="modal-backdrop"
        @click.self="isDeliveryInspectorOpen = false"
      >
        <div class="modal-dialog modal-dialog-inspector">
          <!-- Modal Header -->
          <div class="modal-header">
            <div class="modal-header-leading">
              <div class="modal-header-icon-box" style="background: #eff6ff; color: #0284c7;">
                <Activity :size="18" />
              </div>
              <div>
                <h3 class="modal-heading">Webhook Delivery Inspector</h3>
                <p class="modal-subheading">
                  Detail pengiriman payload event, status HTTP response, dan log HMAC-SHA256 signature.
                </p>
              </div>
            </div>
            <button
              class="modal-close-button"
              @click="isDeliveryInspectorOpen = false"
              title="Tutup"
            >
              <X :size="16" />
            </button>
          </div>

          <!-- Modal Body -->
          <div class="modal-form-body">
            <!-- 1. Metadata Strip -->
            <div class="inspector-meta-strip">
              <div class="inspector-meta-item">
                <span class="inspector-meta-label">TARGET WEBHOOK</span>
                <span class="inspector-meta-value">{{ selectedDeliveryLog.webhookName }}</span>
              </div>
              <div class="inspector-meta-item">
                <span class="inspector-meta-label">EVENT TYPE</span>
                <span class="inspector-meta-value" style="font-family: ui-monospace, monospace; color: #0284c7;">{{ selectedDeliveryLog.event }}</span>
              </div>
              <div class="inspector-meta-item">
                <span class="inspector-meta-label">STATUS & LATENSI</span>
                <span class="inspector-meta-value">
                  <span :class="selectedDeliveryLog.statusCode >= 200 && selectedDeliveryLog.statusCode < 300 ? 'code-badge-200' : 'code-badge-error'">
                    {{ selectedDeliveryLog.statusCode }} OK • {{ selectedDeliveryLog.durationMs }}ms
                  </span>
                </span>
              </div>
              <div class="inspector-meta-item">
                <span class="inspector-meta-label">WAKTU DISPATCH</span>
                <span class="inspector-meta-value">{{ selectedDeliveryLog.timestamp }}</span>
              </div>
            </div>

            <!-- Target URL Box -->
            <div class="endpoint-url-box" style="margin-bottom: 14px;">
              <code>{{ selectedDeliveryLog.targetUrl || 'https://api.discord.com/api/webhooks/...' }}</code>
            </div>

            <!-- 2. Subtabs: Request vs Response -->
            <div class="inspector-subtabs">
              <button
                type="button"
                class="inspector-tab-btn"
                :class="{ active: inspectorActiveTab === 'request' }"
                @click="inspectorActiveTab = 'request'"
              >
                <Code :size="13" />
                <span>Request (Headers & Payload)</span>
              </button>
              <button
                type="button"
                class="inspector-tab-btn"
                :class="{ active: inspectorActiveTab === 'response' }"
                @click="inspectorActiveTab = 'response'"
              >
                <CheckCircle2 :size="13" />
                <span>Response (HTTP Body)</span>
              </button>
            </div>

            <!-- Subtab 1: Request -->
            <div v-if="inspectorActiveTab === 'request'">
              <!-- Request Headers Table -->
              <div style="margin-bottom: 12px;">
                <label class="input-label-row" style="margin-bottom: 6px;">
                  <span class="label-text">Request Headers (dengan RFC 9421 Timestamp & HMAC-SHA256)</span>
                </label>
                <table class="inspector-headers-table">
                  <thead>
                    <tr>
                      <th style="width: 200px;">Header Name</th>
                      <th>Header Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Content-Type</td>
                      <td>application/json</td>
                    </tr>
                    <tr>
                      <td>User-Agent</td>
                      <td>AetherCore-Stack-Webhook-Dispatcher/v1.17</td>
                    </tr>
                    <tr>
                      <td>X-Stack-Event</td>
                      <td>{{ selectedDeliveryLog.event }}</td>
                    </tr>
                    <tr>
                      <td>X-Stack-Delivery</td>
                      <td>{{ selectedDeliveryLog.id }}</td>
                    </tr>
                    <tr>
                      <td>X-Stack-Signature</td>
                      <td>{{ selectedDeliveryLog.requestHeaders?.['X-Stack-Signature'] || selectedDeliveryLog.requestHeaders?.['X-HeroCMS-Signature'] || 't=1774075190,v1=9f82abb742a8b98c76...' }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Request Payload JSON -->
              <div>
                <label class="input-label-row" style="margin-bottom: 6px;">
                  <span class="label-text">Dispatched JSON Payload</span>
                  <span class="label-badge-optional">POST Body</span>
                </label>
                <div class="inspector-terminal-box">
                  <button
                    type="button"
                    class="btn-copy-preview-payload"
                    @click="copyInspectorPayload"
                    title="Salin Request JSON"
                  >
                    <Check v-if="isInspectorPayloadCopied" :size="11" />
                    <Copy v-else :size="11" />
                    <span>{{ isInspectorPayloadCopied ? 'Tersalin' : 'Salin JSON' }}</span>
                  </button>
                  <pre class="inspector-code-pre"><code>{{ JSON.stringify(selectedDeliveryLog.requestPayload || { event: selectedDeliveryLog.event, timestamp: selectedDeliveryLog.timestamp }, null, 2) }}</code></pre>
                </div>
              </div>
            </div>

            <!-- Subtab 2: Response -->
            <div v-else-if="inspectorActiveTab === 'response'">
              <div>
                <label class="input-label-row" style="margin-bottom: 6px;">
                  <span class="label-text">Remote Webhook Endpoint Response Body</span>
                  <span class="label-badge-optional">HTTP {{ selectedDeliveryLog.statusCode }}</span>
                </label>
                <div class="inspector-terminal-box">
                  <pre class="inspector-code-pre"><code>{{ selectedDeliveryLog.responseBody || '{\n  "status": 200,\n  "message": "Webhook payload received and queued successfully"\n}' }}</code></pre>
                </div>
              </div>
            </div>

            <!-- Modal Footer Actions (Guaranteed Side-by-Side) -->
            <div class="modal-footer-row" style="margin-top: 18px;">
              <button
                type="button"
                class="btn-modal-ghost"
                @click="isDeliveryInspectorOpen = false"
              >
                Tutup
              </button>
              <button
                type="button"
                class="btn-modal-confirm"
                @click="handleRedeliverFromInspector"
              >
                <RefreshCw :size="13" />
                <span>Kirim Ulang Event (Redeliver)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>
