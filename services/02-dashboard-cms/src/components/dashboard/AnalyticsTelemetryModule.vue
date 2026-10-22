<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import {
  Globe,
  Zap,
  Terminal,
  Play,
  Pause,
  TrendingUp,
  Download,
  CheckCircle2,
  ArrowUpRight,
  Layers,
  ArrowLeft,
  Smartphone,
  Monitor,
  Compass,
  Radio,
  Database
} from 'lucide-vue-next';
import { useDashboardData } from '../../composables/useDashboardData';
import { generateFleetTelemetry } from '../../data/fleet-telemetry';
import PodDetailAnalyticsView from './PodDetailAnalyticsView.vue';
import type { ContainerSite } from '../../types/dashboard';

const {
  containers,
  selectedContainerForDetail,
  activeContainerId,
  activeMenu,
  showToast,
  purgeEdgeCache,
  openLogsModal,
  toggleMaintenance
} = useDashboardData();

// View Mode: Fleet Global Telemetry vs Deep-Dive Pod Detail
const activeViewMode = ref<'fleet' | 'pod'>('fleet');
const selectedPodContainer = ref<ContainerSite | null>(null);

// Scope & Filter State
const selectedScope = ref<string>('all');
const selectedTimeframe = ref<'24h' | '7d' | '30d'>('24h');
const selectedLogCategory = ref<'all' | 'security' | 'error' | 'latency' | 'edge'>('all');
const isStreamPaused = ref(false);

// Active Report Computation
const report = computed(() => {
  return generateFleetTelemetry(containers.value, selectedScope.value, selectedTimeframe.value);
});

// Filtered Live Stream Logs
const filteredLogs = computed(() => {
  if (selectedLogCategory.value === 'all') return report.value.auditLogs;
  return report.value.auditLogs.filter(l => l.category === selectedLogCategory.value);
});

const selectForEditor = (containerId: string) => {
  activeContainerId.value = containerId;
  activeMenu.value = 'editor';
};

const switchToPodDetail = (c: ContainerSite) => {
  selectedPodContainer.value = c;
  selectedContainerForDetail.value = c;
  activeViewMode.value = 'pod';
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const openPodViewDirectly = () => {
  if (!selectedPodContainer.value && containers.value.length > 0) {
    selectedPodContainer.value = containers.value[0];
  }
  activeViewMode.value = 'pod';
};

const returnToFleetOverview = () => {
  activeViewMode.value = 'fleet';
  selectedContainerForDetail.value = null;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

onMounted(() => {
  if (selectedContainerForDetail.value) {
    selectedPodContainer.value = selectedContainerForDetail.value;
    activeViewMode.value = 'pod';
  }
});

watch(selectedContainerForDetail, (newVal) => {
  if (newVal) {
    selectedPodContainer.value = newVal;
    activeViewMode.value = 'pod';
  }
});

// Export Official SLA & Telemetry Audit Report
const exportAuditReport = () => {
  const auditPayload = {
    exportDate: new Date().toISOString(),
    organization: 'Aether Core Stack Enterprise Fleet',
    auditType: 'Cloud SLA & Operational Telemetry Audit',
    complianceStandard: 'ISO 27001 / SOC 2 / RFC 9110 Error Budget',
    evaluatedScope: {
      scopeId: report.value.scopeId,
      scopeName: report.value.scopeName,
      timeframe: report.value.timeframe
    },
    slaOverview: report.value.sla,
    coreWebVitalsRUM: report.value.webVitals,
    edgeIngressDataCenters: report.value.edgePops,
    clientFingerprint: report.value.fingerprint,
    infraDatabaseAndCache: report.value.infraHealth,
    httpStatusRFC9110: report.value.httpStatus,
    securityAndThreatAudit: report.value.security,
    fleetSaturationBenchmarks: report.value.benchmarks
  };

  const blob = new Blob([JSON.stringify(auditPayload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `aether-stack-sla-audit-${report.value.scopeId}-${report.value.timeframe}-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);

  showToast('Laporan audit SLA & telemetri resmi berhasil diunduh (JSON)!', 'success');
};
</script>

<template>
  <div class="analytics-module-wrapper">
    <!-- VIEW MODE 1: DETAIL POD & KONTAINER MANDIRI -->
    <template v-if="activeViewMode === 'pod' && selectedPodContainer">
      <!-- Container Quick Selector Bar within Pod View -->
      <div class="pro-panel" style="margin-bottom: 16px; padding: 12px 18px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
        <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
          <button type="button" class="btn-ghost-sm" @click="returnToFleetOverview">
            <ArrowLeft :size="13" />
            <span>Ikhtisar Fleet Global</span>
          </button>
          <span style="color: #cbd5e1;">|</span>
          <span style="font-size: 0.8rem; font-weight: 700; color: #0f172a;">Pilih Pod:</span>
          <div style="display: flex; gap: 6px; flex-wrap: wrap;">
            <button
              v-for="c in containers"
              :key="'pod-select-' + c.id"
              type="button"
              class="segment-pill"
              :class="{ active: selectedPodContainer.id === c.id }"
              @click="selectedPodContainer = c; selectedContainerForDetail = c"
            >
              <span class="mini-status-dot" :class="c.status"></span>
              <span>{{ c.name }}</span>
            </button>
          </div>
        </div>

        <button type="button" class="btn-primary" @click="exportAuditReport">
          <Download :size="13" />
          <span>Export Audit (JSON)</span>
        </button>
      </div>

      <!-- Render Comprehensive Pod Detail Analytics Component -->
      <PodDetailAnalyticsView
        :container="selectedPodContainer"
        @back="returnToFleetOverview"
        @purge-cache="purgeEdgeCache"
        @open-logs="openLogsModal"
        @toggle-maintenance="toggleMaintenance"
        @open-editor="(c) => selectForEditor(c.id)"
      />
    </template>

    <!-- VIEW MODE 2: FLEET GLOBAL TELEMETRY & SLA AUDIT SUITE -->
    <section v-else class="fade-in-section">
      <!-- Header Intro & Scope Navigation -->
      <div class="page-intro-row">
        <div>
          <h1 class="page-title">Telemetri Fleet & Analitik Real-Time</h1>
          <p class="page-desc">
            Pusat evaluasi keandalan SLA, Core Web Vitals, perutean Traefik Edge v3, dan performa armada kontainer multi-tenant.
          </p>
        </div>

        <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
          <!-- View Mode Toggle (Fleet Overview vs Pod Deep Dive) -->
          <div class="segmented-filter-bar" style="margin-bottom: 0;">
            <button
              type="button"
              class="segment-pill"
              :class="{ active: activeViewMode === 'fleet' }"
              @click="returnToFleetOverview"
            >
              <span>🌐 Ikhtisar Fleet Global</span>
            </button>
            <button
              type="button"
              class="segment-pill"
              :class="{ active: activeViewMode === 'pod' }"
              @click="openPodViewDirectly"
            >
              <span>📊 Detail Pod</span>
              <span v-if="selectedPodContainer" class="pill-count blue">{{ selectedPodContainer.name }}</span>
            </button>
          </div>

          <!-- Timeframe Switcher -->
          <div class="segmented-filter-bar" style="margin-bottom: 0;">
            <button
              type="button"
              class="segment-pill"
              :class="{ active: selectedTimeframe === '24h' }"
              @click="selectedTimeframe = '24h'"
            >
              24 Jam
            </button>
            <button
              type="button"
              class="segment-pill"
              :class="{ active: selectedTimeframe === '7d' }"
              @click="selectedTimeframe = '7d'"
            >
              7 Hari
            </button>
            <button
              type="button"
              class="segment-pill"
              :class="{ active: selectedTimeframe === '30d' }"
              @click="selectedTimeframe = '30d'"
            >
              30 Hari
            </button>
          </div>

          <!-- Export Audit Report Button -->
          <button
            type="button"
            class="btn-primary"
            @click="exportAuditReport"
            title="Unduh laporan audit resmi untuk evaluasi kepatuhan SLA"
          >
            <Download :size="14" />
            <span>Export Laporan Audit</span>
          </button>
        </div>
      </div>

      <!-- Scope Filter Strip: Semua Situs vs Kontainer Tertentu -->
      <div class="pro-panel" style="margin-bottom: 22px; padding: 12px 16px;">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <Layers :size="16" color="#2563eb" />
            <span style="font-size: 0.82rem; font-weight: 700; color: #0f172a;">
              Cakupan Evaluasi Telemetri:
            </span>
          </div>

          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button
              type="button"
              class="segment-pill"
              :class="{ active: selectedScope === 'all' }"
              @click="selectedScope = 'all'"
            >
              <span>🌐 Semua Situs (Global Fleet - {{ containers.length }})</span>
            </button>

            <button
              v-for="c in containers"
              :key="c.id"
              type="button"
              class="segment-pill"
              :class="{ active: selectedScope === c.id }"
              @click="selectedScope = c.id"
            >
              <span>{{ c.name }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 1. Executive SLA & Peak Telemetry Strip (4 High-Tech Cards) -->
      <div class="stats-overview-grid">
        <!-- Card 1: Peak RPS & Load -->
        <div class="telemetry-card accent-blue">
          <div class="telemetry-corner-watermark blue"><TrendingUp :size="58" /></div>
          <div class="telemetry-top">
            <span class="telemetry-label">BEBAN PUNCAK & TRAFIK (PEAK RPS)</span>
          </div>
          <div class="telemetry-val">
            {{ report.sla.peakRps }} <span class="telemetry-denom">req/detik</span>
          </div>
          <div class="telemetry-sub ready-state">
            <span class="pulse-mini-dot"></span>
            <span>Peak: {{ report.sla.peakTimestamp }}</span>
          </div>
        </div>

        <!-- Card 2: SLA & Error Budget -->
        <div class="telemetry-card accent-emerald">
          <div class="telemetry-corner-watermark emerald"><CheckCircle2 :size="58" /></div>
          <div class="telemetry-top">
            <span class="telemetry-label">KEPATUHAN UPTIME & SLA</span>
          </div>
          <div class="telemetry-val">
            {{ report.sla.uptimeSla }}% <span class="badge-online">Lulus SLA</span>
          </div>
          <div class="telemetry-sub">
            <span>Error rate: {{ report.sla.errorRatePct }}% (Target &lt; 0.10%)</span>
          </div>
        </div>

        <!-- Card 3: Persentil Latensi p95 -->
        <div class="telemetry-card accent-purple">
          <div class="telemetry-corner-watermark purple"><Zap :size="58" /></div>
          <div class="telemetry-top">
            <span class="telemetry-label">LATENSI EDGE PERSENTIL (p95)</span>
          </div>
          <div class="telemetry-val">
            {{ report.sla.latencyP95 }} ms <span class="badge-online">Edge v3</span>
          </div>
          <div class="telemetry-sub">
            <span>p50: {{ report.sla.latencyP50 }}ms • p99: {{ report.sla.latencyP99 }}ms</span>
          </div>
        </div>

        <!-- Card 4: Cache Ratio & Bandwidth Savings -->
        <div class="telemetry-card accent-sky">
          <div class="telemetry-corner-watermark sky"><Globe :size="58" /></div>
          <div class="telemetry-top">
            <span class="telemetry-label">EFISIENSI CACHE & BANDWIDTH</span>
          </div>
          <div class="telemetry-val">
            {{ report.sla.cacheHitRatio }}% <span class="badge-growth-pill">Hit Ratio</span>
          </div>
          <div class="telemetry-sub">
            <span>{{ report.sla.bandwidthSaved }}</span>
          </div>
        </div>
      </div>

      <!-- 2. Core Web Vitals & Real User Monitoring (RUM) Telemetry Strip -->
      <div class="telemetry-vitals-strip">
        <div class="vital-pill-card">
          <div class="vital-label-row">
            <span class="vital-code-badge">⚡ LCP (LARGEST CONTENTFUL PAINT)</span>
            <span class="vital-status-dot good"></span>
          </div>
          <div class="vital-val-row">
            <span class="vital-number">{{ report.webVitals.lcpSeconds }}s</span>
            <span class="nav-badge badge-success" style="font-size: 0.65rem;">Sangat Cepat</span>
          </div>
          <span class="vital-sub-note">Ambang Batas: &lt; 2.5s (Target Google CWV)</span>
        </div>

        <div class="vital-pill-card">
          <div class="vital-label-row">
            <span class="vital-code-badge">👆 INP (INTERACTION TO NEXT PAINT)</span>
            <span class="vital-status-dot good"></span>
          </div>
          <div class="vital-val-row">
            <span class="vital-number">{{ report.webVitals.inpMs }}ms</span>
            <span class="nav-badge badge-success" style="font-size: 0.65rem;">Responsif</span>
          </div>
          <span class="vital-sub-note">Ambang Batas: &lt; 200ms (Interaksi User)</span>
        </div>

        <div class="vital-pill-card">
          <div class="vital-label-row">
            <span class="vital-code-badge">📐 CLS (CUMULATIVE LAYOUT SHIFT)</span>
            <span class="vital-status-dot good"></span>
          </div>
          <div class="vital-val-row">
            <span class="vital-number">{{ report.webVitals.clsScore }}</span>
            <span class="nav-badge badge-success" style="font-size: 0.65rem;">Stabil</span>
          </div>
          <span class="vital-sub-note">Ambang Batas: &lt; 0.10 (Zero Visual Glitch)</span>
        </div>

        <div class="vital-pill-card">
          <div class="vital-label-row">
            <span class="vital-code-badge">⏱ FCP (FIRST CONTENTFUL PAINT)</span>
            <span class="vital-status-dot good"></span>
          </div>
          <div class="vital-val-row">
            <span class="vital-number">{{ report.webVitals.fcpSeconds }}s</span>
            <span class="nav-badge badge-primary" style="font-size: 0.65rem;">Instan</span>
          </div>
          <span class="vital-sub-note">Ambang Batas: &lt; 1.8s (Render DOM Pertama)</span>
        </div>

        <div class="vital-pill-card">
          <div class="vital-label-row">
            <span class="vital-code-badge">🌐 TTFB (EDGE PROXY INGRESS)</span>
            <span class="vital-status-dot good"></span>
          </div>
          <div class="vital-val-row">
            <span class="vital-number">{{ report.webVitals.ttfbMs }}ms</span>
            <span class="nav-badge badge-primary" style="font-size: 0.65rem;">Traefik v3</span>
          </div>
          <span class="vital-sub-note">Burn Rate SLA: {{ report.webVitals.burnRatePerDay }}x / hari</span>
        </div>
      </div>

      <!-- 3. Matriks Kode Status HTTP & Error Budget SLA (RFC 9110) -->
      <div class="pro-panel" style="margin-bottom: 22px; padding: 20px 24px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
          <div>
            <h3 style="font-size: 0.98rem; font-weight: 700; color: #0f172a; margin: 0 0 4px 0;">
              Audit Kode Status Respon HTTP & Anggaran Kesalahan (SLA Error Budget)
            </h3>
            <p style="font-size: 0.76rem; color: #64748b; margin: 0;">
              Klasifikasi respon HTTP/2 dan HTTP/3 Traefik edge proxy terhadap standar kepatuhan operasional enterprise.
            </p>
          </div>

          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="nav-badge" :class="report.httpStatus.slaStatus === 'COMPLIANT' ? 'badge-success' : 'badge-warning'" style="font-size: 0.72rem;">
              SLA {{ report.httpStatus.slaStatus }}
            </span>
            <span style="font-size: 0.74rem; font-weight: 600; color: #334155;">
              Sisa Error Budget: <strong>{{ report.httpStatus.errorBudgetRemainingPct }}%</strong>
            </span>
          </div>
        </div>

        <!-- Progress Distribution Bar -->
        <div style="height: 12px; width: 100%; display: flex; border-radius: 6px; overflow: hidden; background: #e2e8f0; margin-bottom: 16px;">
          <div :style="{ width: `${report.httpStatus.code2xx.pct}%` }" style="background: #10b981;" :title="`2xx Success: ${report.httpStatus.code2xx.count} (${report.httpStatus.code2xx.pct}%)`"></div>
          <div :style="{ width: `${report.httpStatus.code3xx.pct}%` }" style="background: #3b82f6;" :title="`3xx Cache: ${report.httpStatus.code3xx.count} (${report.httpStatus.code3xx.pct}%)`"></div>
          <div :style="{ width: `${report.httpStatus.code4xx.pct}%` }" style="background: #f59e0b;" :title="`4xx Client: ${report.httpStatus.code4xx.count} (${report.httpStatus.code4xx.pct}%)`"></div>
          <div :style="{ width: `${report.httpStatus.code5xx.pct}%` }" style="background: #ef4444;" :title="`5xx Server: ${report.httpStatus.code5xx.count} (${report.httpStatus.code5xx.pct}%)`"></div>
        </div>

        <!-- Status Metric Cards (4 Pillars) -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 12px;">
          <div style="padding: 12px; border-radius: 8px; background: #f8fafc; border: 1px solid #e2e8f0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <span style="font-size: 0.72rem; font-weight: 700; color: #059669;">2xx SUKSES</span>
              <span class="nav-badge badge-success" style="font-size: 0.68rem;">{{ report.httpStatus.code2xx.pct }}%</span>
            </div>
            <div style="font-size: 1.15rem; font-weight: 800; color: #0f172a;">
              {{ report.httpStatus.code2xx.count.toLocaleString('id-ID') }}
            </div>
            <div style="font-size: 0.7rem; color: #64748b; margin-top: 2px;">
              HTTP 200 OK & 201 Created
            </div>
          </div>

          <div style="padding: 12px; border-radius: 8px; background: #f8fafc; border: 1px solid #e2e8f0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <span style="font-size: 0.72rem; font-weight: 700; color: #2563eb;">3xx CACHE / REDIRECT</span>
              <span class="nav-badge badge-primary" style="font-size: 0.68rem;">{{ report.httpStatus.code3xx.pct }}%</span>
            </div>
            <div style="font-size: 1.15rem; font-weight: 800; color: #0f172a;">
              {{ report.httpStatus.code3xx.count.toLocaleString('id-ID') }}
            </div>
            <div style="font-size: 0.7rem; color: #64748b; margin-top: 2px;">
              HTTP 304 Not Modified & 301
            </div>
          </div>

          <div style="padding: 12px; border-radius: 8px; background: #f8fafc; border: 1px solid #e2e8f0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <span style="font-size: 0.72rem; font-weight: 700; color: #b45309;">4xx KLIEN / THROTTLED</span>
              <span class="nav-badge badge-warning" style="font-size: 0.68rem;">{{ report.httpStatus.code4xx.pct }}%</span>
            </div>
            <div style="font-size: 1.15rem; font-weight: 800; color: #0f172a;">
              {{ report.httpStatus.code4xx.count.toLocaleString('id-ID') }}
            </div>
            <div style="font-size: 0.7rem; color: #64748b; margin-top: 2px;">
              HTTP 404 & 429 Rate Limited
            </div>
          </div>

          <div style="padding: 12px; border-radius: 8px; background: #f8fafc; border: 1px solid #e2e8f0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <span style="font-size: 0.72rem; font-weight: 700; color: #dc2626;">5xx GANGGUAN SERVER</span>
              <span class="nav-badge" :class="report.httpStatus.code5xx.pct <= 0.1 ? 'badge-success' : 'badge-danger'" style="font-size: 0.68rem;">
                {{ report.httpStatus.code5xx.pct }}%
              </span>
            </div>
            <div style="font-size: 1.15rem; font-weight: 800; color: #0f172a;">
              {{ report.httpStatus.code5xx.count.toLocaleString('id-ID') }}
            </div>
            <div style="font-size: 0.7rem; color: #64748b; margin-top: 2px;">
              Ambang Batas Audit: &lt; 0.10%
            </div>
          </div>
        </div>
      </div>

      <!-- 4. Interactive 24-Hour Traffic Bar Chart & Peak Spikes -->
      <div class="pro-panel traffic-timeline-panel">
        <div class="timeline-head">
          <div>
            <h3 class="timeline-title">Distribusi Trafik 24 Jam & Analisis Beban Puncak</h3>
            <p class="timeline-sub">
              Event request HTTP yang diserap oleh Traefik Edge Proxy • Puncak beban terdeteksi pada pukul 14:00 WIB
            </p>
          </div>
          <div class="timeline-badges">
            <span class="tl-chip"><span class="tl-dot emerald"></span> 200 OK (96%)</span>
            <span class="tl-chip"><span class="tl-dot blue"></span> 304 Cache Hit</span>
            <span class="tl-chip"><span class="tl-dot purple"></span> Peak RPS Indicator</span>
          </div>
        </div>

        <div class="bars-chart-container">
          <div
            v-for="bar in report.hourlyTraffic"
            :key="bar.hour"
            class="chart-col"
          >
            <div class="bar-fill-track">
              <div
                class="bar-fill-actual"
                :class="bar.hour === '14' ? 'purple' : bar.hour === '12' || bar.hour === '16' ? 'blue' : 'emerald'"
                :style="{ height: `${Math.min(100, Math.max(12, (bar.requests / 600) * 100))}%` }"
                :title="`Pukul ${bar.hour}:00 - ${bar.requests} req (Peak: ${bar.peakRps} rps, Latensi: ${bar.latencyP95}ms)`"
              >
                <span class="bar-tooltip-val">{{ bar.requests }} req ({{ bar.peakRps }} rps)</span>
              </div>
            </div>
            <span class="col-hour-lbl">{{ bar.hour }}:00</span>
          </div>
        </div>
      </div>

      <!-- 5. Edge Ingress POP Data Centers & Transport Compression Efficiency -->
      <div class="edge-infra-grid">
        <!-- Ingress POP Locations -->
        <div class="pro-panel" style="padding: 20px 24px;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px;">
            <div>
              <h3 style="font-size: 0.95rem; font-weight: 700; color: #0f172a; margin: 0 0 3px 0;">
                Titik Masuk Edge Ingress (Edge Data Centers & POP)
              </h3>
              <p style="font-size: 0.74rem; color: #64748b; margin: 0;">
                Pusat perutean anycast Traefik v3 yang melayani request pengguna di berbagai region
              </p>
            </div>
            <span class="nav-badge badge-primary">5 Region Aktif</span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 8px;">
            <div
              v-for="pop in report.edgePops"
              :key="pop.code"
              style="display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;"
            >
              <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 1.15rem;">{{ pop.flag }}</span>
                <div>
                  <div style="font-size: 0.78rem; font-weight: 700; color: #0f172a;">
                    {{ pop.name }}
                  </div>
                  <div style="font-size: 0.68rem; color: #64748b; font-family: ui-monospace, monospace;">
                    {{ pop.code }} • {{ pop.primaryProtocol }}
                  </div>
                </div>
              </div>

              <div style="display: flex; align-items: center; gap: 12px;">
                <div style="text-align: right;">
                  <span style="font-size: 0.78rem; font-weight: 700; color: #059669;">
                    ⚡ {{ pop.avgTtfbMs }}ms
                  </span>
                  <div style="font-size: 0.67rem; color: #2563eb; font-weight: 600;">
                    {{ pop.trafficSharePct }}% volume
                  </div>
                </div>
                <span class="nav-badge badge-success" style="font-size: 0.64rem;">Optimal</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Protocol & Transport Compression -->
        <div class="pro-panel" style="padding: 20px 24px;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px;">
            <div>
              <h3 style="font-size: 0.95rem; font-weight: 700; color: #0f172a; margin: 0 0 3px 0;">
                Distribusi Protokol Jaringan & Efisiensi Kompresi
              </h3>
              <p style="font-size: 0.74rem; color: #64748b; margin: 0;">
                Penyerapan HTTP/3 QUIC (UDP 443) serta penghematan bandwidth via Brotli 11
              </p>
            </div>
            <span class="nav-badge badge-success">HTTP/3 Ready</span>
          </div>

          <!-- Protocol Bars -->
          <div style="margin-bottom: 16px;">
            <div style="font-size: 0.72rem; font-weight: 700; color: #334155; margin-bottom: 6px;">
              Pangsa Protokol Transport HTTP:
            </div>
            <div style="display: flex; flex-direction: column; gap: 6px;">
              <div
                v-for="proto in report.fingerprint.protocolShares"
                :key="proto.protocol"
                style="padding: 8px 10px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; display: flex; align-items: center; justify-content: space-between;"
              >
                <div style="display: flex; align-items: center; gap: 6px;">
                  <Radio :size="12" color="#2563eb" />
                  <span style="font-size: 0.74rem; font-weight: 600; color: #0f172a;">{{ proto.protocol }}</span>
                </div>
                <span class="nav-badge badge-primary" style="font-size: 0.68rem;">{{ proto.pct }}%</span>
              </div>
            </div>
          </div>

          <!-- Compression Savings -->
          <div>
            <div style="font-size: 0.72rem; font-weight: 700; color: #334155; margin-bottom: 6px;">
              Reduksi Ukuran Transfer Data (Encoding Content):
            </div>
            <div style="display: flex; flex-direction: column; gap: 6px;">
              <div
                v-for="comp in report.fingerprint.compressionSavings"
                :key="comp.method"
                style="padding: 8px 10px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; display: flex; align-items: center; justify-content: space-between;"
              >
                <span style="font-size: 0.74rem; font-weight: 600; color: #0f172a;">{{ comp.method }}</span>
                <span style="font-size: 0.72rem; color: #059669; font-weight: 700;">{{ comp.ratio }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 6. Client Device, Browser & Operating System Breakdown -->
      <div class="pro-panel" style="margin-bottom: 22px; padding: 20px 24px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
          <div>
            <h3 style="font-size: 0.98rem; font-weight: 700; color: #0f172a; margin: 0 0 4px 0;">
              Telemetri Klien: Perangkat, Browser & Sistem Operasi
            </h3>
            <p style="font-size: 0.76rem; color: #64748b; margin: 0;">
              Atribusi privasi-ramah tanpa cookie pelacak (RFC 8942 Client Hints)
            </p>
          </div>
          <span class="nav-badge badge-primary">Vercel & Datadog Standard</span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
          <!-- Device Type -->
          <div style="padding: 14px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px;">
            <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 10px;">
              <Smartphone :size="14" color="#2563eb" />
              <span style="font-size: 0.76rem; font-weight: 700; color: #0f172a;">Jenis Perangkat Pengunjung</span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <div v-for="dev in report.fingerprint.devices" :key="dev.type">
                <div style="display: flex; justify-content: space-between; font-size: 0.74rem; margin-bottom: 3px;">
                  <span style="color: #334155; font-weight: 600;">{{ dev.type }}</span>
                  <span style="color: #0f172a; font-weight: 700;">{{ dev.pct }}% ({{ dev.count.toLocaleString('id-ID') }})</span>
                </div>
                <div style="height: 6px; width: 100%; background: #e2e8f0; border-radius: 3px; overflow: hidden;">
                  <div :style="{ width: `${dev.pct}%` }" style="height: 100%; background: #2563eb;"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Browser Share -->
          <div style="padding: 14px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px;">
            <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 10px;">
              <Compass :size="14" color="#059669" />
              <span style="font-size: 0.76rem; font-weight: 700; color: #0f172a;">Browser Populer</span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <div v-for="br in report.fingerprint.browsers" :key="br.name">
                <div style="display: flex; justify-content: space-between; font-size: 0.74rem; margin-bottom: 3px;">
                  <span style="color: #334155; font-weight: 600;">{{ br.name }}</span>
                  <span style="color: #0f172a; font-weight: 700;">{{ br.pct }}%</span>
                </div>
                <div style="height: 6px; width: 100%; background: #e2e8f0; border-radius: 3px; overflow: hidden;">
                  <div :style="{ width: `${br.pct}%` }" style="height: 100%; background: #10b981;"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Operating System -->
          <div style="padding: 14px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px;">
            <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 10px;">
              <Monitor :size="14" color="#7c3aed" />
              <span style="font-size: 0.76rem; font-weight: 700; color: #0f172a;">Sistem Operasi</span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <div v-for="os in report.fingerprint.operatingSystems" :key="os.name">
                <div style="display: flex; justify-content: space-between; font-size: 0.74rem; margin-bottom: 3px;">
                  <span style="color: #334155; font-weight: 600;">{{ os.name }}</span>
                  <span style="color: #0f172a; font-weight: 700;">{{ os.pct }}%</span>
                </div>
                <div style="height: 6px; width: 100%; background: #e2e8f0; border-radius: 3px; overflow: hidden;">
                  <div :style="{ width: `${os.pct}%` }" style="height: 100%; background: #8b5cf6;"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 7. PostgreSQL Multi-Tenant RLS & Redis Memory Telemetry -->
      <div class="pro-panel" style="margin-bottom: 22px; padding: 18px 24px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 10px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <Database :size="16" color="#2563eb" />
            <span style="font-size: 0.88rem; font-weight: 700; color: #0f172a;">
              Infrastruktur Basis Data PostgreSQL RLS & Redis Cache Footprint
            </span>
          </div>
          <span class="nav-badge badge-success" style="font-size: 0.7rem;">Multi-Tenant Isolation Valid</span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
          <div style="padding: 10px 14px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
            <div style="font-size: 0.68rem; color: #64748b; font-weight: 600;">POOL KONEKSI POSTGRESQL</div>
            <div style="font-size: 1.15rem; font-weight: 800; color: #0f172a; margin-top: 2px;">
              {{ report.infraHealth.pgConnectionsActive }} <span style="font-size: 0.75rem; color: #94a3b8;">/ {{ report.infraHealth.pgConnectionsMax }} Aktif</span>
            </div>
            <div style="font-size: 0.66rem; color: #059669; margin-top: 2px;">Zero Connection Queue</div>
          </div>

          <div style="padding: 10px 14px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
            <div style="font-size: 0.68rem; color: #64748b; font-weight: 600;">LATENSI EVALUASI RLS POLICY</div>
            <div style="font-size: 1.15rem; font-weight: 800; color: #2563eb; margin-top: 2px;">
              {{ report.infraHealth.pgRlsEvaluationMs }} ms
            </div>
            <div style="font-size: 0.66rem; color: #64748b; margin-top: 2px;">Per Tenant DB Query</div>
          </div>

          <div style="padding: 10px 14px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
            <div style="font-size: 0.68rem; color: #64748b; font-weight: 600;">MEMORI IN-MEMORY REDIS</div>
            <div style="font-size: 1.15rem; font-weight: 800; color: #0f172a; margin-top: 2px;">
              {{ report.infraHealth.redisMemoryUsedMB }} MB <span style="font-size: 0.75rem; color: #94a3b8;">/ {{ report.infraHealth.redisMemoryMaxMB }} MB</span>
            </div>
            <div style="font-size: 0.66rem; color: #059669; margin-top: 2px;">Hit Rate: {{ report.infraHealth.redisHitRatioPct }}%</div>
          </div>

          <div style="padding: 10px 14px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
            <div style="font-size: 0.68rem; color: #64748b; font-weight: 600;">THROUGHPUT EVENT KAFKA</div>
            <div style="font-size: 1.15rem; font-weight: 800; color: #7c3aed; margin-top: 2px;">
              {{ report.infraHealth.kafkaThroughputPerSec }} <span style="font-size: 0.75rem; color: #94a3b8;">events/s</span>
            </div>
            <div style="font-size: 0.66rem; color: #059669; margin-top: 2px;">Consumer Lag: 0ms (Real-Time)</div>
          </div>
        </div>
      </div>

      <!-- 8. Fleet Benchmark & Capacity Saturation Table -->
      <div class="pro-panel" style="margin-bottom: 22px; padding: 20px 24px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
          <div>
            <h3 style="font-size: 0.98rem; font-weight: 700; color: #0f172a; margin: 0 0 4px 0;">
              Matriks Komparasi Performa & Saturasi Armada Kontainer (Fleet Health)
            </h3>
            <p style="font-size: 0.76rem; color: #64748b; margin: 0;">
              Pengawasan alokasi sumber daya cgroups v2, risiko kehabisan memori (OOM), dan kontribusi beban antar-situs.
            </p>
          </div>

          <span class="nav-badge badge-primary">
            {{ report.benchmarks.length }} Kontainer Terdaftar
          </span>
        </div>

        <div style="overflow-x: auto;">
          <table class="pro-table" style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr>
                <th style="text-align: left; padding: 10px 12px;">Situs & Kontainer</th>
                <th style="text-align: center; padding: 10px 12px;">Status & Uptime</th>
                <th style="text-align: right; padding: 10px 12px;">Pangsa Trafik</th>
                <th style="text-align: right; padding: 10px 12px;">Latensi Edge</th>
                <th style="text-align: right; padding: 10px 12px;">Peak CPU</th>
                <th style="text-align: right; padding: 10px 12px;">Alokasi RAM</th>
                <th style="text-align: center; padding: 10px 12px;">Risiko OOM</th>
                <th style="text-align: center; padding: 10px 12px;">Aksi Analitik</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="c in report.benchmarks" :key="c.id">
                <!-- Site & Container -->
                <td style="padding: 12px;">
                  <div style="font-weight: 700; color: #0f172a; font-size: 0.85rem;">
                    {{ c.name }}
                  </div>
                  <div style="font-size: 0.72rem; color: #64748b; font-family: 'JetBrains Mono', monospace;">
                    {{ c.customDomain || c.subdomain }}
                  </div>
                </td>

                <!-- Status & Uptime -->
                <td style="text-align: center; padding: 12px;">
                  <span class="nav-badge" :class="c.status === 'running' ? 'badge-success' : 'badge-warning'" style="font-size: 0.68rem;">
                    {{ c.status === 'running' ? 'Aktif' : c.status }}
                  </span>
                  <div style="font-size: 0.68rem; color: #64748b; margin-top: 2px;">
                    {{ c.uptime }}
                  </div>
                </td>

                <!-- Traffic Share -->
                <td style="text-align: right; padding: 12px;">
                  <div style="font-weight: 700; color: #0f172a; font-size: 0.85rem;">
                    {{ c.visits.toLocaleString('id-ID') }}
                  </div>
                  <div style="font-size: 0.7rem; color: #2563eb; font-weight: 600;">
                    {{ c.trafficSharePct }}% volume
                  </div>
                </td>

                <!-- Latency -->
                <td style="text-align: right; padding: 12px;">
                  <span style="font-weight: 700; color: #059669; font-size: 0.85rem;">
                    {{ c.avgLatencyMs }} ms
                  </span>
                  <div style="font-size: 0.68rem; color: #64748b;">
                    Cache: {{ c.cacheRatioPct }}%
                  </div>
                </td>

                <!-- Peak CPU -->
                <td style="text-align: right; padding: 12px;">
                  <span style="font-weight: 700; color: #334155; font-size: 0.85rem;">
                    {{ c.peakCpuPct }}%
                  </span>
                  <div style="font-size: 0.68rem; color: #94a3b8;">
                    Limit: 0.5 vCPU
                  </div>
                </td>

                <!-- RAM cgroups v2 -->
                <td style="text-align: right; padding: 12px;">
                  <div style="font-weight: 700; color: #0f172a; font-size: 0.82rem;">
                    {{ c.ramUsageMB }} MB <span style="font-size: 0.7rem; color: #94a3b8;">/ {{ c.ramLimitMB }} MB</span>
                  </div>
                  <div style="font-size: 0.68rem; color: #64748b;">
                    {{ c.ramUsagePct }}% terpakai
                  </div>
                </td>

                <!-- OOM Risk -->
                <td style="text-align: center; padding: 12px;">
                  <span
                    class="nav-badge"
                    :class="{
                      'badge-success': c.oomRiskBadge === 'safe',
                      'badge-warning': c.oomRiskBadge === 'warning',
                      'badge-danger': c.oomRiskBadge === 'danger'
                    }"
                    style="font-size: 0.68rem;"
                  >
                    {{ c.oomRisk }}
                  </span>
                </td>

                <!-- Action Button -->
                <td style="text-align: center; padding: 12px;">
                  <button
                    type="button"
                    class="btn-ghost-sm"
                    @click="switchToPodDetail(containers.find(item => item.id === c.id) || containers[0])"
                    title="Buka panel analitik pod dan manajemen kernel kontainer ini"
                  >
                    <span>Detail Analitik Pod</span>
                    <ArrowUpRight :size="12" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 9. Bottom 2-Column: Redis Leaderboard & Security Threat Audit -->
      <div class="analytics-split-panes">
        <!-- Left: Redis ZSET Leaderboard -->
        <div class="pro-panel redis-board-panel">
          <div class="board-head">
            <div class="board-title-group">
              <h3>Top Halaman & Artikel Terpopuler</h3>
              <span class="board-desc">Diurutkan real-time via kueri <code>ZREVRANGEBYSCORE</code> Redis In-Memory</span>
            </div>
            <span class="redis-tech-badge">Redis In-Memory</span>
          </div>

          <div class="rank-cards-list">
            <div
              v-for="item in report.topPages"
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
                  <span style="color: #2563eb; font-weight: 600;">{{ item.containerName }}</span>
                  <span class="dot-sep">•</span>
                  <span class="rank-score">Skor: {{ item.score }}</span>
                </div>
                <div class="rank-prog-bar">
                  <div class="rank-prog-fill" :style="{ width: `${item.pct}%` }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Security Threat & Bot Classification Audit -->
        <div class="pro-panel" style="padding: 22px; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
            <div>
              <h3 style="font-size: 0.96rem; font-weight: 700; color: #0f172a; margin: 0 0 3px 0;">
                Audit Keamanan & Penyerapan Ancaman
              </h3>
              <span style="font-size: 0.72rem; color: #64748b;">
                Inspeksi proteksi WAF, mitigasi Rate Limiter 429, dan klasifikasi bot crawler
              </span>
            </div>
            <span class="nav-badge badge-primary" style="font-size: 0.68rem;">TLS 1.3 Strict</span>
          </div>

          <!-- Security Quick Stats 3-Grid -->
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 16px;">
            <div style="padding: 8px 10px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; text-align: center;">
              <div style="font-size: 0.68rem; color: #64748b; font-weight: 600;">RATE-LIMITED (429)</div>
              <div style="font-size: 1.05rem; font-weight: 800; color: #b45309;">
                {{ report.security.rateLimited429Count }}
              </div>
              <div style="font-size: 0.62rem; color: #059669;">Throttled Bursts</div>
            </div>

            <div style="padding: 8px 10px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; text-align: center;">
              <div style="font-size: 0.68rem; color: #64748b; font-weight: 600;">WAF BLOCKED</div>
              <div style="font-size: 1.05rem; font-weight: 800; color: #dc2626;">
                {{ report.security.wafBlockedCount }}
              </div>
              <div style="font-size: 0.62rem; color: #059669;">Anti-Exploit</div>
            </div>

            <div style="padding: 8px 10px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; text-align: center;">
              <div style="font-size: 0.68rem; color: #64748b; font-weight: 600;">TRAFIK MANUSIA</div>
              <div style="font-size: 1.05rem; font-weight: 800; color: #2563eb;">
                {{ report.security.humanTrafficPct }}%
              </div>
              <div style="font-size: 0.62rem; color: #64748b;">Verified Visitors</div>
            </div>
          </div>

          <!-- Threat Origins List -->
          <div style="font-size: 0.74rem; font-weight: 700; color: #334155; margin-bottom: 8px;">
            Asal Penetrasi & Percobaan Eksploitasi yang Ditangkal:
          </div>

          <div style="display: flex; flex-direction: column; gap: 8px;">
            <div
              v-for="origin in report.security.topThreatOrigins"
              :key="origin.code"
              style="display: flex; justify-content: space-between; align-items: center; padding: 8px 10px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px;"
            >
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 1rem;">{{ origin.flag }}</span>
                <div>
                  <div style="font-size: 0.74rem; font-weight: 700; color: #0f172a;">
                    {{ origin.country }}
                  </div>
                  <div style="font-size: 0.65rem; color: #64748b;">
                    {{ origin.reason }}
                  </div>
                </div>
              </div>

              <span class="nav-badge badge-danger" style="font-size: 0.68rem; padding: 2px 6px;">
                {{ origin.hitsBlocked }} Diblokir
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 10. Kafka Live Streaming Telemetry Audit Console -->
      <div class="pro-panel kafka-terminal-panel" style="margin-top: 22px;">
        <div class="terminal-ctrl-header">
          <div class="terminal-title-flex">
            <Terminal :size="16" color="#38bdf8" />
            <div>
              <h3>Konsol Audit Log Telemetri Real-Time (Kafka Event Ingestion)</h3>
              <span>Cluster: Redpanda v24.1 • Topic: <code>tenant.fleet.analytics</code> • Throughput: <strong>240 events/detik</strong></span>
            </div>
          </div>

          <div class="terminal-actions">
            <!-- Log Category Pills (Fully styled for dark terminal) -->
            <div style="display: flex; gap: 6px;">
              <button
                type="button"
                class="terminal-filter-pill"
                :class="{ active: selectedLogCategory === 'all' }"
                @click="selectedLogCategory === 'all'"
              >
                Semua Log
              </button>
              <button
                type="button"
                class="terminal-filter-pill"
                :class="{ active: selectedLogCategory === 'security' }"
                @click="selectedLogCategory === 'security'"
              >
                Keamanan (WAF/429)
              </button>
              <button
                type="button"
                class="terminal-filter-pill"
                :class="{ active: selectedLogCategory === 'latency' }"
                @click="selectedLogCategory === 'latency'"
              >
                cgroups & Latensi
              </button>
              <button
                type="button"
                class="terminal-filter-pill"
                :class="{ active: selectedLogCategory === 'edge' }"
                @click="selectedLogCategory === 'edge'"
              >
                Edge Proxy
              </button>
            </div>

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
            v-for="log in filteredLogs"
            :key="log.id"
            class="stream-log-row"
          >
            <span class="log-timestamp">{{ log.time }}</span>
            <span class="stream-badge" :class="log.color">[{{ log.tag }}]</span>
            <span class="log-message-txt">{{ log.text }}</span>
            <span style="font-size: 0.68rem; color: #64748b; margin-left: auto; font-family: 'JetBrains Mono', monospace;">
              {{ log.meta }}
            </span>
          </div>
        </div>

        <div class="terminal-footer-meta">
          <span>SLA Audit Status: <strong style="color: #10b981;">100% Zero Consumer Lag</strong></span>
          <span class="text-green">● Non-Blocking Asynchronous Edge Ingestion</span>
        </div>
      </div>
    </section>
  </div>
</template>
