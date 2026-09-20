<script setup lang="ts">
import { ref } from 'vue';
import {
  Activity,
  Globe,
  Zap,
  Database,
  Terminal,
  Play,
  Pause
} from 'lucide-vue-next';

const isStreamPaused = ref(false);

const trafficHourly = [
  { hour: '00', hits: 42, color: 'blue' },
  { hour: '02', hits: 28, color: 'blue' },
  { hour: '04', hits: 19, color: 'blue' },
  { hour: '06', hits: 64, color: 'emerald' },
  { hour: '08', hits: 142, color: 'emerald' },
  { hour: '10', hits: 284, color: 'purple' },
  { hour: '12', hits: 390, color: 'purple' },
  { hour: '14', hits: 480, color: 'purple' },
  { hour: '16', hits: 412, color: 'purple' },
  { hour: '18', hits: 320, color: 'emerald' },
  { hour: '20', hits: 260, color: 'blue' },
  { hour: '22', hits: 110, color: 'blue' }
];

const redisRankings = [
  { rank: 1, title: 'Arsitektur Multi-Tenant dengan Docker & Go SDK', path: '/blog/multi-tenant-docker', score: 98.4, hits: 1420, pct: 100 },
  { rank: 2, title: 'Penyelarasan Telemetri Real-Time dengan Kafka', path: '/blog/kafka-telemetry', score: 82.1, hits: 890, pct: 62 },
  { rank: 3, title: 'Optimasi TTFB Edge Traefik v3 (1.8ms Target)', path: '/blog/traefik-ttfb', score: 64.5, hits: 610, pct: 43 },
  { rank: 4, title: 'Isolasi Resource cgroups v2 Kernel Linux', path: '/blog/cgroups-v2-linux', score: 48.0, hits: 420, pct: 29 }
];

const streamLogs = ref([
  { time: '10:52:14.402', tag: 'traefik-edge', color: 'emerald', text: 'GET / 200 OK (TTFB: 1.6ms) - Client IP: 103.144.20.12' },
  { time: '10:52:15.110', tag: 'kafka-ingest', color: 'blue', text: 'Produced event to topic "tenant.9942.analytics" [P0@offset:8942]' },
  { time: '10:52:15.118', tag: 'redis-zset', color: 'purple', text: 'ZINCRBY "tenant:9942:views" 1 "article:multi-tenant-docker"' },
  { time: '10:52:18.892', tag: 'cgroups-v2', color: 'gray', text: 'Probe container #hero_tenant_9942: CPU=14% MEM=88MB/256MB healthy' },
  { time: '10:52:21.004', tag: 'tls-alpn', color: 'emerald', text: 'Edge proxy SSL handshake TLS_AES_128_GCM_SHA256 zero-overhead' },
  { time: '10:52:24.318', tag: 'traefik-edge', color: 'emerald', text: 'GET /blog/kafka-telemetry 200 OK (Cache: HIT - 0.9ms)' }
]);
</script>

<template>
  <section class="fade-in-section">
    <!-- Header Intro -->
    <div class="page-intro-row">
      <div>
        <h1 class="page-title">Telemetri & Analitik Real-Time (Kafka & Redis)</h1>
        <p class="page-desc">Data hit pengunjung dicatat non-blocking melalui event stream Kafka dan dihitung via Redis Sorted Sets.</p>
      </div>
      <div class="quota-quick-pills">
        <span class="pill-metric">Kafka Broker: <strong>redpanda:9092</strong></span>
        <span class="pill-metric-highlight">Redis Engine: <strong>In-Memory (v7.2)</strong></span>
      </div>
    </div>

    <!-- 1. Top Telemetry Strips (4 High-Tech Cards) -->
    <div class="stats-overview-grid">
      <div class="telemetry-card">
        <div class="telemetry-top">
          <span class="telemetry-label">TOTAL KUNJUNGAN MINGGU INI</span>
          <div class="telemetry-glyph blue"><Activity :size="15" /></div>
        </div>
        <div class="telemetry-val">3,892 <span class="badge-growth-pill">+28%</span></div>
        <div class="telemetry-sub ready-state">
          <span class="pulse-mini-dot"></span>
          <span>142 IP unik di 12 negara</span>
        </div>
      </div>

      <div class="telemetry-card">
        <div class="telemetry-top">
          <span class="telemetry-label">LATENSI EDGE TRAEFIK</span>
          <div class="telemetry-glyph emerald"><Globe :size="15" /></div>
        </div>
        <div class="telemetry-val">1.8 ms <span class="badge-online">Fast</span></div>
        <div class="telemetry-sub"><span>Cache proxy edge v3 aktif</span></div>
      </div>

      <div class="telemetry-card">
        <div class="telemetry-top">
          <span class="telemetry-label">KAFKA CONSUMER LAG</span>
          <div class="telemetry-glyph purple"><Zap :size="15" /></div>
        </div>
        <div class="telemetry-val">0 Pesan <span class="badge-online">Sync</span></div>
        <div class="telemetry-sub"><span>Sinkronisasi real-time 100%</span></div>
      </div>

      <div class="telemetry-card">
        <div class="telemetry-top">
          <span class="telemetry-label">MEMORI REDIS SORTED SET</span>
          <div class="telemetry-glyph blue"><Database :size="15" /></div>
        </div>
        <div class="telemetry-val">18.4 MB <span class="telemetry-denom">/ 128 MB</span></div>
        <div class="telemetry-sub"><span>1,420 kunci terindeks di RAM</span></div>
      </div>
    </div>

    <!-- 2. Interactive 24-Hour Traffic Bar Chart -->
    <div class="pro-panel traffic-timeline-panel">
      <div class="timeline-head">
        <div>
          <h3 class="timeline-title">Distribusi Trafik 24 Jam Terakhir</h3>
          <p class="timeline-sub">Event request HTTP/2 & HTTP/3 yang diserap oleh Traefik Edge Proxy</p>
        </div>
        <div class="timeline-badges">
          <span class="tl-chip"><span class="tl-dot blue"></span> 200 OK (96%)</span>
          <span class="tl-chip"><span class="tl-dot emerald"></span> 304 Cache Hit (3.8%)</span>
          <span class="tl-chip"><span class="tl-dot purple"></span> Telemetry Events</span>
        </div>
      </div>

      <div class="bars-chart-container">
        <div
          v-for="bar in trafficHourly"
          :key="bar.hour"
          class="chart-col"
        >
          <div class="bar-fill-track">
            <div
              class="bar-fill-actual"
              :class="bar.color"
              :style="{ height: `${(bar.hits / 480) * 100}%` }"
              :title="`Pukul ${bar.hour}:00 - ${bar.hits} hits`"
            >
              <span class="bar-tooltip-val">{{ bar.hits }}</span>
            </div>
          </div>
          <span class="col-hour-lbl">{{ bar.hour }}:00</span>
        </div>
      </div>
    </div>

    <!-- 3. Bottom 2-Column: Redis Leaderboard & Kafka Stream Terminal -->
    <div class="analytics-split-panes">
      <!-- Left: Redis ZSET Leaderboard -->
      <div class="pro-panel redis-board-panel">
        <div class="board-head">
          <div class="board-title-group">
            <h3>Top Halaman & Artikel Terpopuler</h3>
            <span class="board-desc">Diurutkan real-time via query <code>ZREVRANGEBYSCORE</code></span>
          </div>
          <span class="redis-tech-badge">Redis In-Memory</span>
        </div>

        <div class="rank-cards-list">
          <div
            v-for="item in redisRankings"
            :key="item.rank"
            class="rank-item-card"
          >
            <div class="rank-number-circ" :class="'top-' + item.rank">
              {{ item.rank }}
            </div>
            <div class="rank-detail-column">
              <div class="rank-title-line">
                <strong class="rank-item-title">{{ item.title }}</strong>
                <span class="rank-hits-badge">{{ item.hits.toLocaleString('id-ID') }} views</span>
              </div>
              <div class="rank-sub-meta">
                <span class="rank-path">{{ item.path }}</span>
                <span class="dot-sep">•</span>
                <span class="rank-score">Skor Telemetri: {{ item.score }}</span>
              </div>
              <div class="rank-prog-bar">
                <div class="rank-prog-fill" :style="{ width: `${item.pct}%` }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Kafka Live Streaming Console -->
      <div class="pro-panel kafka-terminal-panel">
        <div class="terminal-ctrl-header">
          <div class="terminal-title-flex">
            <Terminal :size="16" color="#38bdf8" />
            <div>
              <h3>Log Stream Kafka Ingestion</h3>
              <span>Cluster: Redpanda v24.1 • Topic: <code>tenant.9942.analytics</code></span>
            </div>
          </div>

          <div class="terminal-actions">
            <button
              class="btn-pause-stream"
              @click="isStreamPaused = !isStreamPaused"
              :title="isStreamPaused ? 'Lanjutkan Stream' : 'Jeda Stream'"
            >
              <Play v-if="isStreamPaused" :size="12" />
              <Pause v-else :size="12" />
              <span>{{ isStreamPaused ? 'Resume' : 'Pause' }}</span>
            </button>
            <div class="live-stream-dot" :class="{ paused: isStreamPaused }"></div>
          </div>
        </div>

        <div class="terminal-screen-stage">
          <div
            v-for="(log, lIdx) in streamLogs"
            :key="lIdx"
            class="stream-log-row"
          >
            <span class="log-timestamp">{{ log.time }}</span>
            <span class="stream-badge" :class="log.color">[{{ log.tag }}]</span>
            <span class="log-message-txt">{{ log.text }}</span>
          </div>
        </div>

        <div class="terminal-footer-meta">
          <span>Throughput Ingestion: <strong>240 events/sec</strong></span>
          <span class="text-green">● Zero Consumer Lag</span>
        </div>
      </div>
    </div>
  </section>
</template>
