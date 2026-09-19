<script setup lang="ts">
import { Copy } from 'lucide-vue-next';
import { useDashboardData } from '../../composables/useDashboardData';

const {
  webhooks,
  apiKey,
  isApiKeyRevealed,
  copyApiKey,
  testWebhook
} = useDashboardData();
</script>

<template>
  <section class="fade-in-section">
    <div class="page-intro-row">
      <div>
        <h1 class="page-title">Webhooks & Integrasi API</h1>
        <p class="page-desc">Kirim event otomatis saat formulir kontak masuk, kontainer dideploy, atau pembaruan konten ke Discord, Slack, atau endpoint server Anda.</p>
      </div>
    </div>

    <!-- API Key Panel -->
    <div class="pro-panel api-key-box">
      <div class="api-key-header">
        <div>
          <h4>API Key Tenant (Developer Access)</h4>
          <p>Gunakan API token ini untuk integrasi CI/CD atau headless CMS via cURL / SDK.</p>
        </div>
        <button class="btn-copy-token" @click="copyApiKey">
          <Copy :size="13" />
          <span>Salin Token</span>
        </button>
      </div>
      <div class="api-token-display">
        <code>{{ isApiKeyRevealed ? apiKey : '••••••••••••••••••••••••••••••••••••••••' }}</code>
        <button class="btn-reveal-token" @click="isApiKeyRevealed = !isApiKeyRevealed">
          {{ isApiKeyRevealed ? 'Sembunyikan' : 'Perlihatkan' }}
        </button>
      </div>
    </div>

    <!-- Webhooks Table -->
    <div class="pro-panel">
      <div class="panel-head">
        <h3>Endpoint Webhook Aktif</h3>
        <span class="redis-chip">Event Dispatcher</span>
      </div>
      <div class="table-responsive">
        <table class="pro-table">
          <thead>
            <tr>
              <th>NAMA INTEGRASI</th>
              <th>TARGET URL ENDPOINT</th>
              <th>EVENTS YANG DITRANGSANG</th>
              <th>STATUS</th>
              <th>TERAKHIR DIPICU</th>
              <th style="text-align: right">PENGUJIAN</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="wh in webhooks" :key="wh.id">
              <td><strong>{{ wh.name }}</strong></td>
              <td><code class="webhook-url-code">{{ wh.url }}</code></td>
              <td>
                <div class="event-tags-wrap">
                  <span v-for="ev in wh.events" :key="ev" class="event-badge">{{ ev }}</span>
                </div>
              </td>
              <td>
                <span class="status-badge badge-published">{{ wh.status.toUpperCase() }}</span>
              </td>
              <td><span class="date-cell">{{ wh.lastTriggered }}</span></td>
              <td style="text-align: right">
                <button class="btn-test-webhook" @click="testWebhook(wh)">
                  <span>Uji Ping</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>
