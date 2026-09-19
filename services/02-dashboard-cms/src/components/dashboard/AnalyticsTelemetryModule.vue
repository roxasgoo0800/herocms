<script setup lang="ts">
import {
  Terminal
} from 'lucide-vue-next';
</script>

<template>
  <section class="fade-in-section">
    <div class="page-intro-row">
      <div>
        <h1 class="page-title">Telemetri & Analitik Real-Time</h1>
        <p class="page-desc">Data hit pengunjung dicatat non-blocking melalui event stream Kafka dan dihitung via Redis Sorted Sets.</p>
      </div>
    </div>

    <div class="analytics-strip-grid">
      <div class="analytics-card">
        <span class="a-label">TOTAL KUNJUNGAN MINGGU INI</span>
        <div class="a-val">3,892 <span class="a-growth">+28%</span></div>
        <span class="a-sub">142 IP unik di 12 negara</span>
      </div>
      <div class="analytics-card">
        <span class="a-label">LATENSI EDGE TRAEFIK</span>
        <div class="a-val">1.8 ms</div>
        <span class="a-sub">Cache proxy edge aktif</span>
      </div>
      <div class="analytics-card">
        <span class="a-label">KAFKA CONSUMER LAG</span>
        <div class="a-val text-emerald">0 Pesan</div>
        <span class="a-sub">Sinkronisasi real-time 100%</span>
      </div>
    </div>

    <div class="analytics-two-col">
      <div class="pro-panel">
        <div class="panel-head">
          <h3>Top Halaman & Artikel Terpopuler</h3>
          <span class="redis-chip">Redis ZREVRANGEBYSCORE</span>
        </div>
        <div class="rank-list">
          <div class="rank-row">
            <span class="rank-badge">1</span>
            <div class="rank-title-group">
              <strong>Arsitektur Multi-Tenant dengan Docker & Go</strong>
              <span>/blog/multi-tenant-docker • Skor Telemetri: 98.4</span>
            </div>
            <span class="rank-hit">1,420 views</span>
          </div>
          <div class="rank-row">
            <span class="rank-badge">2</span>
            <div class="rank-title-group">
              <strong>Penyelarasan Telemetri Real-Time dengan Kafka</strong>
              <span>/blog/kafka-telemetry • Skor Telemetri: 82.1</span>
            </div>
            <span class="rank-hit">890 views</span>
          </div>
          <div class="rank-row">
            <span class="rank-badge">3</span>
            <div class="rank-title-group">
              <strong>Optimasi TTFB Edge Traefik v3</strong>
              <span>/blog/traefik-ttfb • Skor Telemetri: 64.5</span>
            </div>
            <span class="rank-hit">610 views</span>
          </div>
        </div>
      </div>

      <div class="pro-panel">
        <div class="panel-head">
          <h3>Log Telemetri Kafka Ingestion</h3>
          <Terminal :size="15" color="#64748b" />
        </div>
        <div class="terminal-log-window">
          <div class="t-line"><span>[00:26:12]</span> Traefik: Ingested page_view (200 OK - 1.4ms)</div>
          <div class="t-line"><span>[00:26:15]</span> Redis: ZINCRBY 'tenant:9942:views' 1 article:1</div>
          <div class="t-line"><span>[00:26:18]</span> Docker: cgroups v2 resource check healthy</div>
          <div class="t-line"><span>[00:26:22]</span> Traefik: SSL Let's Encrypt verified</div>
        </div>
      </div>
    </div>
  </section>
</template>
