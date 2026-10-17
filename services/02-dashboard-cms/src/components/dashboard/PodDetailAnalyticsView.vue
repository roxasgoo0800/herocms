<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  ArrowLeft,
  Globe,
  Zap,
  Activity,
  HardDrive,
  Sparkles,
  Download,
  Terminal,
  ShieldCheck,
  Server,
  Layers,
  ArrowUpRight,
  Edit3
} from 'lucide-vue-next';
import type { ContainerSite } from '../../types/dashboard';
import { generatePodAnalytics } from '../../data/pod-analytics';

const props = defineProps<{
  container: ContainerSite;
}>();

const emit = defineEmits<{
  (e: 'back'): void;
  (e: 'purgeCache', container: ContainerSite): void;
  (e: 'openLogs', container: ContainerSite): void;
  (e: 'openEditor', container: ContainerSite): void;
}>();

const timeframe = ref<'24h' | '7d' | '30d'>('24h');
const hoveredPointIndex = ref<number | null>(null);

const report = computed(() => {
  return generatePodAnalytics(props.container);
});

const currentPoints = computed(() => {
  if (timeframe.value === '7d') return report.value.timeframe7d;
  if (timeframe.value === '30d') return report.value.timeframe30d;
  return report.value.timeframe24h;
});

// Generate smooth SVG Area & Line Paths
const chartSvgData = computed(() => {
  const pts = currentPoints.value;
  if (!pts || pts.length === 0) return { areaPath: '', linePath: '', cachedPath: '', maxVal: 100, coords: [], width: 920, height: 160 };

  const maxVal = Math.max(...pts.map(p => p.requests)) * 1.15 || 100;
  const width = 920;
  const height = 160;
  const step = width / (pts.length - 1);

  const coords = pts.map((p, i) => {
    const x = i * step;
    const y = height - (p.requests / maxVal) * (height - 25) - 12;
    const yCached = height - (p.cachedRequests / maxVal) * (height - 25) - 12;
    return { x, y, yCached, point: p };
  });

  // Smooth Bézier curve
  let linePath = `M ${coords[0].x} ${coords[0].y}`;
  for (let i = 1; i < coords.length; i++) {
    const prev = coords[i - 1];
    const curr = coords[i];
    const cpX = (prev.x + curr.x) / 2;
    linePath += ` C ${cpX} ${prev.y}, ${cpX} ${curr.y}, ${curr.x} ${curr.y}`;
  }

  const areaPath = `${linePath} L ${coords[coords.length - 1].x} ${height} L ${coords[0].x} ${height} Z`;

  let cachedPath = `M ${coords[0].x} ${coords[0].yCached}`;
  for (let i = 1; i < coords.length; i++) {
    const prev = coords[i - 1];
    const curr = coords[i];
    const cpX = (prev.x + curr.x) / 2;
    cachedPath += ` C ${cpX} ${prev.yCached}, ${cpX} ${curr.yCached}, ${curr.x} ${curr.yCached}`;
  }

  return { areaPath, linePath, cachedPath, maxVal, coords, width, height };
});

// CSV Export
const exportTelemetry = () => {
  const headers = ['Country Code', 'Country Name', 'Requests', 'Percentage', 'Avg TTFB', 'Bandwidth'];
  const rows = report.value.countries.map(c => [
    c.code,
    `"${c.name}"`,
    c.requests,
    `${c.percentage}%`,
    c.ttfb,
    c.bandwidth
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `cloudflare-edge-telemetry-${props.container.subdomain}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
</script>

<template>
  <div class="pod-detail-page">
    <!-- 1. Breadcrumb & Navigation Bar -->
    <div class="pod-breadcrumb-bar">
      <div class="breadcrumb-left-group">
        <button type="button" class="btn-back-to-list" @click="emit('back')">
          <ArrowLeft :size="14" />
          <span>Kembali ke Daftar Kontainer</span>
        </button>

        <div class="breadcrumb-trail">
          <span>Situs & Kontainer</span>
          <span class="divider">/</span>
          <span class="current">{{ container.name }}</span>
          <span class="divider">/</span>
          <span style="font-family: ui-monospace, SFMono-Regular, monospace; font-size: 0.72rem; color: #64748b;">
            #{{ container.id }}
          </span>
        </div>
      </div>

      <div class="footer-right-buttons">
        <button type="button" class="btn-analytics-export" @click="exportTelemetry">
          <Download :size="13" />
          <span>Export CSV</span>
        </button>
        <button type="button" class="btn-modal-ghost" @click="emit('purgeCache', container)">
          <Sparkles :size="13" />
          <span>Purge Edge Cache</span>
        </button>
        <button type="button" class="btn-modal-ghost" @click="emit('openLogs', container)">
          <Terminal :size="13" />
          <span>Log Terminal</span>
        </button>
        <button type="button" class="btn-modal-ghost" @click="emit('openEditor', container)">
          <Edit3 :size="13" />
          <span>Buka di Editor</span>
        </button>
        <a :href="`https://${container.subdomain}`" target="_blank" class="btn-modal-confirm">
          <span>Kunjungi Situs</span>
          <ArrowUpRight :size="14" />
        </a>
      </div>
    </div>

    <!-- 2. Hero Banner Card -->
    <div class="pod-hero-card">
      <div class="pod-header-top-flex">
        <div class="pod-title-group">
          <div
            class="pod-avatar-glyph"
            :style="{ backgroundColor: (container.accentColor || '#2563eb') + '16', color: container.accentColor || '#2563eb' }"
          >
            <Globe :size="24" />
          </div>
          <div>
            <div class="pod-main-name">
              <span>{{ container.name }}</span>
              <span class="pod-id-subtag">{{ report.podId }}</span>
            </div>
            <div class="pod-meta-bar">
              <span class="pod-meta-pill status-green">
                <span class="pulse-mini-dot"></span>
                <span>Running • Healthy</span>
              </span>
              <span class="pod-meta-pill route-pill">
                <Layers :size="11" />
                <span>https://{{ container.subdomain }}</span>
              </span>
              <span v-if="container.customDomain" class="pod-meta-pill">
                <Globe :size="11" />
                <span>{{ container.customDomain }}</span>
              </span>
              <span class="pod-meta-pill">
                <Server :size="11" />
                <span>Gateway {{ report.gatewayIp }}</span>
              </span>
              <span class="pod-meta-pill">
                <ShieldCheck :size="11" style="color: #10b981;" />
                <span>TLS 1.3 ALPN</span>
              </span>
              <span class="pod-meta-pill">
                <span>Alokasi {{ container.cpuLimit }} CPU • {{ container.ramLimit }}MB RAM</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 3. Live Edge Ingest Streaming Ticker -->
    <div class="edge-live-ticker-shell">
      <div class="ticker-pulse-title">
        <span class="ticker-live-dot"></span>
        <span>LIVE EDGE INGEST</span>
      </div>
      <div class="ticker-stream-scroll">
        <div
          v-for="req in report.liveRequests"
          :key="req.id"
          class="ticker-entry-pill"
        >
          <span class="flag">{{ req.flag }}</span>
          <span>{{ req.city }}</span>
          <span class="method">{{ req.method }}</span>
          <span>{{ req.path }}</span>
          <span class="status-200">{{ req.status }}</span>
          <span style="color: #2563eb;">{{ req.ttfb }}</span>
          <span style="color: #94a3b8;">{{ req.device }} ({{ req.browser }})</span>
        </div>
      </div>
    </div>

    <!-- 4. Top Cloudflare Metric Strips (4 KPIs) -->
    <div class="cf-metrics-grid">
      <div class="cf-metric-card">
        <div class="cf-metric-top">
          <span class="cf-metric-label">TOTAL PERMINTAAN EDGE</span>
          <Activity :size="16" style="color: #2563eb;" />
        </div>
        <div class="cf-metric-value">
          <span>{{ report.totalRequests.toLocaleString() }}</span>
          <span class="cf-growth-badge">+18.4%</span>
        </div>
        <div class="cf-metric-sub">
          <span>{{ report.uniqueCountriesCount }} negara pengakses terdeteksi</span>
        </div>
      </div>

      <div class="cf-metric-card">
        <div class="cf-metric-top">
          <span class="cf-metric-label">CACHE HIT RATIO</span>
          <Sparkles :size="16" style="color: #059669;" />
        </div>
        <div class="cf-metric-value">
          <span style="color: #059669;">{{ report.cacheHitRatio }}%</span>
        </div>
        <div class="cf-metric-sub">
          <span>Traefik Edge In-Memory Cache</span>
        </div>
      </div>

      <div class="cf-metric-card">
        <div class="cf-metric-top">
          <span class="cf-metric-label">BANDWIDTH DIHEMAT</span>
          <HardDrive :size="16" style="color: #7c3aed;" />
        </div>
        <div class="cf-metric-value">
          <span>{{ report.bandwidthSaved }}</span>
        </div>
        <div class="cf-metric-sub">
          <span>Dari total {{ report.totalBandwidth }} egress</span>
        </div>
      </div>

      <div class="cf-metric-card">
        <div class="cf-metric-top">
          <span class="cf-metric-label">RATA-RATA TTFB EDGE</span>
          <Zap :size="16" style="color: #d97706;" />
        </div>
        <div class="cf-metric-value">
          <span>{{ report.avgLatency }}</span>
        </div>
        <div class="cf-metric-sub">
          <span>p50: 0.8ms • p95: 2.1ms</span>
        </div>
      </div>
    </div>

    <!-- 5. Cloudflare-Style Interactive Area Chart -->
    <div class="cf-chart-panel">
      <div class="cf-chart-header">
        <div class="cf-chart-title-group">
          <h4>
            <Activity :size="16" style="color: #2563eb;" />
            <span>Permintaan Edge & Efisiensi Cache</span>
          </h4>
          <p>Volume request yang dilayani langsung dari cache edge Traefik vs Origin Pod</p>
        </div>

        <!-- Timeframe Switcher -->
        <div class="cf-timeframe-toggle">
          <button
            type="button"
            class="cf-time-btn"
            :class="{ active: timeframe === '24h' }"
            @click="timeframe = '24h'"
          >
            24 Jam
          </button>
          <button
            type="button"
            class="cf-time-btn"
            :class="{ active: timeframe === '7d' }"
            @click="timeframe = '7d'"
          >
            7 Hari
          </button>
          <button
            type="button"
            class="cf-time-btn"
            :class="{ active: timeframe === '30d' }"
            @click="timeframe = '30d'"
          >
            30 Hari
          </button>
        </div>
      </div>

      <!-- SVG Smooth Area Curve -->
      <div class="cf-svg-chart-wrapper" style="height: 220px;">
        <svg
          :viewBox="`0 0 ${chartSvgData.width} ${chartSvgData.height}`"
          preserveAspectRatio="none"
          style="width: 100%; height: 100%; overflow: visible;"
        >
          <defs>
            <linearGradient id="cfAreaGradFull" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#2563eb" stop-opacity="0.30" />
              <stop offset="100%" stop-color="#2563eb" stop-opacity="0.0" />
            </linearGradient>
          </defs>

          <!-- Gridlines -->
          <line x1="0" y1="30" :x2="chartSvgData.width" y2="30" stroke="#f1f5f9" stroke-dasharray="4 4" />
          <line x1="0" y1="80" :x2="chartSvgData.width" y2="80" stroke="#f1f5f9" stroke-dasharray="4 4" />
          <line x1="0" y1="130" :x2="chartSvgData.width" y2="130" stroke="#f1f5f9" stroke-dasharray="4 4" />

          <!-- Filled Area -->
          <path :d="chartSvgData.areaPath" fill="url(#cfAreaGradFull)" />

          <!-- Line Paths -->
          <path :d="chartSvgData.cachedPath" fill="none" stroke="#93c5fd" stroke-width="2" stroke-dasharray="3 3" />
          <path :d="chartSvgData.linePath" fill="none" stroke="#2563eb" stroke-width="2.5" stroke-linecap="round" />

          <!-- Data Points & Tooltip Targets -->
          <g v-for="(c, i) in chartSvgData.coords" :key="i">
            <circle
              :cx="c.x"
              :cy="c.y"
              r="4"
              fill="#ffffff"
              stroke="#2563eb"
              stroke-width="2.5"
              style="cursor: pointer;"
              @mouseenter="hoveredPointIndex = i"
              @mouseleave="hoveredPointIndex = null"
            />
            <!-- Hover Pulse Marker -->
            <circle
              v-if="hoveredPointIndex === i"
              :cx="c.x"
              :cy="c.y"
              r="9"
              fill="none"
              stroke="#2563eb"
              stroke-width="2"
              opacity="0.6"
            />
          </g>
        </svg>

        <!-- Hover Tooltip -->
        <div
          v-if="hoveredPointIndex !== null && chartSvgData.coords[hoveredPointIndex]"
          style="position: absolute; top: 10px; right: 14px; background: #0f172a; color: #ffffff; padding: 6px 12px; border-radius: 6px; font-size: 0.74rem; box-shadow: 0 4px 12px rgba(0,0,0,0.15); pointer-events: none;"
        >
          <strong>{{ chartSvgData.coords[hoveredPointIndex].point.label }}</strong>:
          {{ chartSvgData.coords[hoveredPointIndex].point.requests.toLocaleString() }} reqs
          ({{ chartSvgData.coords[hoveredPointIndex].point.bandwidthMB }} MB) • {{ chartSvgData.coords[hoveredPointIndex].point.latencyMs }}ms TTFB
        </div>
      </div>

      <!-- Legend Row -->
      <div class="cf-chart-legend-row">
        <div class="cf-legend-item">
          <span class="legend-swatch swatch-cached"></span>
          <span>Total Permintaan Masuk</span>
        </div>
        <div class="cf-legend-item">
          <span class="legend-swatch swatch-origin"></span>
          <span>Dilayani dari Edge Cache</span>
        </div>
      </div>
    </div>

    <!-- 6. Dual Columns: Geo Traffic by Country vs Device & Vitals -->
    <div class="analytics-dual-grid">
      <!-- Left: Cloudflare Geo Traffic by Country -->
      <div class="analytics-sub-card">
        <div class="card-title-row">
          <h4>
            <Globe :size="16" style="color: #2563eb;" />
            <span>Pengunjung Berdasarkan Negara (Geo Traffic)</span>
          </h4>
          <span class="card-title-subbadge">Top 8 Wilayah Pengakses</span>
        </div>

        <div class="country-stat-list">
          <div
            v-for="(cty, idx) in report.countries"
            :key="cty.code"
            class="country-stat-row"
          >
            <div class="country-flag-title">
              <span class="country-flag-icon">{{ cty.flag }}</span>
              <span>{{ cty.name }}</span>
            </div>

            <div class="country-bar-wrap">
              <div
                class="country-bar-fill"
                :class="{ 'bar-secondary': idx > 1 }"
                :style="{ width: `${cty.percentage}%` }"
              ></div>
            </div>

            <div class="country-stat-numbers">
              <span class="country-req-count">{{ cty.requests.toLocaleString() }}</span>
              <span class="country-pct-label">{{ cty.percentage }}% • {{ cty.ttfb }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Devices, Core Web Vitals, HTTP Codes -->
      <div class="analytics-right-widgets">
        <!-- Widget 1: Device Breakdown -->
        <div class="analytics-sub-card" style="padding: 14px 16px;">
          <div class="card-title-row" style="margin-bottom: 10px; padding-bottom: 6px;">
            <h4>Tipe Perangkat & Browser</h4>
            <span style="font-size: 0.68rem; color: #64748b;">72% Mobile Traffic</span>
          </div>

          <div class="device-progress-strip">
            <div class="dev-bar-mobile" :style="{ width: `${report.deviceBreakdown.mobile}%` }"></div>
            <div class="dev-bar-desktop" :style="{ width: `${report.deviceBreakdown.desktop}%` }"></div>
            <div class="dev-bar-tablet" :style="{ width: `${report.deviceBreakdown.tablet}%` }"></div>
          </div>

          <div class="device-legend-row">
            <div class="dev-legend-pill">
              <span class="dot-mobile"></span>
              <span>Mobile {{ report.deviceBreakdown.mobile }}%</span>
            </div>
            <div class="dev-legend-pill">
              <span class="dot-desktop"></span>
              <span>Desktop {{ report.deviceBreakdown.desktop }}%</span>
            </div>
            <div class="dev-legend-pill">
              <span class="dot-tablet"></span>
              <span>Tablet {{ report.deviceBreakdown.tablet }}%</span>
            </div>
          </div>
        </div>

        <!-- Widget 2: Core Web Vitals -->
        <div class="analytics-sub-card" style="padding: 14px 16px;">
          <div class="card-title-row" style="margin-bottom: 8px; padding-bottom: 6px;">
            <h4>Real Experience (Web Vitals)</h4>
            <span style="font-size: 0.68rem; color: #059669; font-weight: 700;">🟢 Skor Optimal</span>
          </div>

          <div class="vitals-grid">
            <div class="vital-box">
              <div class="vital-label">LCP</div>
              <div class="vital-val">{{ report.webVitals.lcp.val }}</div>
              <span class="vital-badge-good">Good</span>
            </div>
            <div class="vital-box">
              <div class="vital-label">INP</div>
              <div class="vital-val">{{ report.webVitals.inp.val }}</div>
              <span class="vital-badge-good">Fast</span>
            </div>
            <div class="vital-box">
              <div class="vital-label">CLS</div>
              <div class="vital-val">{{ report.webVitals.cls.val }}</div>
              <span class="vital-badge-good">Stable</span>
            </div>
          </div>
        </div>

        <!-- Widget 3: HTTP Status Codes -->
        <div class="analytics-sub-card" style="padding: 14px 16px;">
          <div class="card-title-row" style="margin-bottom: 8px; padding-bottom: 6px;">
            <h4>Status Kode HTTP</h4>
            <span style="font-size: 0.68rem; color: #64748b;">Zero 5xx Errors</span>
          </div>

          <div class="http-status-grid">
            <div v-for="st in report.httpStatusCodes" :key="st.code" class="http-code-chip">
              <span class="code-title" :style="{ color: st.color }">{{ st.code }}</span>
              <span class="code-pct">{{ st.percentage }}%</span>
            </div>
          </div>
        </div>

        <!-- Widget 4: DDoS Shield & Rate Limiting -->
        <div class="bot-shield-card">
          <ShieldCheck :size="18" style="flex-shrink: 0;" />
          <div>
            <strong>Traefik Bot & DDoS Shield Aktif</strong>
            <div style="font-size: 0.7rem; opacity: 0.9;">Rate limit: 120 req/s • 0 anomali serangan terdeteksi</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
