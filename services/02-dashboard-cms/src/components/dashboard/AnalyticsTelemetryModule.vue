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

<style scoped>
/* 24-Hour Traffic Chart */
.traffic-timeline-panel {
  padding: 20px 24px;
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.03);
  margin-bottom: 22px;
}

.timeline-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.timeline-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 2px 0;
}

.timeline-sub {
  font-size: 0.76rem;
  color: #64748b;
  margin: 0;
}

.timeline-badges {
  display: flex;
  gap: 12px;
}

.tl-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.72rem;
  font-weight: 600;
  color: #475569;
}

.tl-dot {
  width: 8px;
  height: 8px;
  border-radius: 2px;
}

.tl-dot.blue { background: #2563eb; }
.tl-dot.emerald { background: #10b981; }
.tl-dot.purple { background: #9333ea; }

.bars-chart-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 120px;
  padding-top: 14px;
  border-bottom: 1px solid #f1f5f9;
  gap: 8px;
}

.chart-col {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  position: relative;
}

.bar-fill-track {
  width: 100%;
  max-width: 32px;
  height: 90px;
  display: flex;
  align-items: flex-end;
  border-radius: 6px 6px 0 0;
  background: #f8fafc;
}

.bar-fill-actual {
  width: 100%;
  border-radius: 6px 6px 0 0;
  position: relative;
  transition: height 0.3s ease;
  cursor: pointer;
}

.bar-fill-actual.blue { background: linear-gradient(180deg, #60a5fa 0%, #2563eb 100%); }
.bar-fill-actual.emerald { background: linear-gradient(180deg, #34d399 0%, #059669 100%); }
.bar-fill-actual.purple { background: linear-gradient(180deg, #a78bfa 0%, #7c3aed 100%); }

.bar-fill-actual:hover {
  filter: brightness(1.15);
}

.bar-tooltip-val {
  position: absolute;
  top: -22px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.65rem;
  font-weight: 700;
  color: #0f172a;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  padding: 1px 4px;
  border-radius: 4px;
  opacity: 0;
  transition: opacity 0.15s ease;
  pointer-events: none;
  white-space: nowrap;
}

.bar-fill-actual:hover .bar-tooltip-val {
  opacity: 1;
}

.col-hour-lbl {
  font-size: 0.65rem;
  font-weight: 600;
  color: #94a3b8;
  margin-top: 6px;
}

/* Bottom Split */
.analytics-split-panes {
  display: grid;
  grid-template-columns: 1fr 1.15fr;
  gap: 20px;
}

@media (max-width: 1100px) {
  .analytics-split-panes { grid-template-columns: 1fr; }
}

/* Redis Leaderboard */
.redis-board-panel {
  padding: 22px;
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
}

.board-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 18px;
}

.board-title-group h3 {
  font-size: 0.96rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 3px 0;
}

.board-desc {
  font-size: 0.72rem;
  color: #64748b;
}

.board-desc code {
  color: #2563eb;
}

.redis-tech-badge {
  font-size: 0.68rem;
  font-weight: 700;
  color: #dc2626;
  background: #fef2f2;
  border: 1px solid #fecaca;
  padding: 2px 7px;
  border-radius: 4px;
}

.rank-cards-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.rank-item-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 14px;
  background: #fafbfc;
  border: 1px solid #f1f5f9;
  border-radius: 12px;
  transition: all 0.15s ease;
}

.rank-item-card:hover {
  background: #f8faff;
  border-color: #cbd5e1;
}

.rank-number-circ {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 800;
  flex-shrink: 0;
}

.rank-number-circ.top-1 { background: #fef3c7; color: #b45309; border: 1px solid #fde68a; }
.rank-number-circ.top-2 { background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0; }
.rank-number-circ.top-3 { background: #fff7ed; color: #c2410c; border: 1px solid #ffedd5; }
.rank-number-circ.top-4 { background: #f8fafc; color: #94a3b8; border: 1px solid #f1f5f9; }

.rank-detail-column {
  flex: 1;
  min-width: 0;
}

.rank-title-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3px;
}

.rank-item-title {
  font-size: 0.82rem;
  color: #0f172a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 260px;
}

.rank-hits-badge {
  font-size: 0.74rem;
  font-weight: 700;
  color: #2563eb;
}

.rank-sub-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.68rem;
  color: #64748b;
  margin-bottom: 6px;
}

.rank-path {
  font-family: ui-monospace, monospace;
}

.rank-prog-bar {
  height: 4px;
  background: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
}

.rank-prog-fill {
  height: 100%;
  background: linear-gradient(90deg, #2563eb, #38bdf8);
  border-radius: 999px;
}

/* Kafka Terminal */
.kafka-terminal-panel {
  background: #090d16;
  border: 1px solid #1e293b;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
}

.terminal-ctrl-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.terminal-title-flex {
  display: flex;
  align-items: center;
  gap: 10px;
}

.terminal-title-flex h3 {
  font-size: 0.88rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
}

.terminal-title-flex span {
  font-size: 0.68rem;
  color: #94a3b8;
}

.terminal-title-flex code {
  color: #38bdf8;
}

.terminal-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-pause-stream {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.68rem;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #ffffff;
  padding: 4px 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.12s ease;
}

.btn-pause-stream:hover {
  background: rgba(255, 255, 255, 0.15);
}

.live-stream-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 8px #10b981;
}

.live-stream-dot.paused {
  background: #f59e0b;
  box-shadow: 0 0 8px #f59e0b;
}

.terminal-screen-stage {
  padding: 14px 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-family: ui-monospace, monospace;
  font-size: 0.72rem;
  min-height: 180px;
}

.stream-log-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
  line-height: 1.4;
}

.log-timestamp {
  color: #64748b;
  font-size: 0.66rem;
  flex-shrink: 0;
}

.stream-badge {
  font-size: 0.62rem;
  font-weight: 700;
  padding: 1px 5px;
  border-radius: 4px;
  flex-shrink: 0;
}

.stream-badge.emerald { background: rgba(16, 185, 129, 0.2); color: #34d399; }
.stream-badge.blue { background: rgba(37, 99, 235, 0.2); color: #60a5fa; }
.stream-badge.purple { background: rgba(147, 51, 234, 0.2); color: #c084fc; }
.stream-badge.gray { background: rgba(148, 163, 184, 0.2); color: #94a3b8; }

.log-message-txt {
  color: #e2e8f0;
  word-break: break-all;
}

.terminal-footer-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 0.7rem;
  color: #94a3b8;
}

.terminal-footer-meta strong {
  color: #ffffff;
}

.text-green {
  color: #34d399;
}
</style>
