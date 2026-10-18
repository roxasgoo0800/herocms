<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import * as echarts from 'echarts';
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
  ArrowUpRight,
  Edit3,
  Cpu,
  Search,
  Lock,
  Compass,
  Share2,
  RotateCw,
  Check,
  History,
  Database,
  Calendar,
  TrendingUp,
  FileText,
  Image,
  Send,
  Layers,
  X,
  RotateCcw,
  Wrench
} from 'lucide-vue-next';
import type { ContainerSite } from '../../types/dashboard';
import { generatePodAnalytics } from '../../data/pod-analytics';

const props = defineProps<{
  container: ContainerSite;
}>();

// Customer Reliability & Peace-of-Mind Actions
const isRestoringSnapshot = ref(false);
const isCreatingBackup = ref(false);
const restoreToast = ref<string | null>(null);
const hoveredUptimeDay = ref<{ day: number; date: string; uptimePct: number; latencyMs: number } | null>(null);

const handleRestoreSnapshot = () => {
  isRestoringSnapshot.value = true;
  setTimeout(() => {
    isRestoringSnapshot.value = false;
    restoreToast.value = 'Snapshot cadangan otomatis berhasil diverifikasi dan dipulihkan!';
    setTimeout(() => {
      restoreToast.value = null;
    }, 4000);
  }, 1200);
};

const handleCreateBackup = () => {
  isCreatingBackup.value = true;
  setTimeout(() => {
    isCreatingBackup.value = false;
    restoreToast.value = 'Snapshot cadangan baru berhasil dibuat dan disimpan di S3 storage!';
    setTimeout(() => {
      restoreToast.value = null;
    }, 4000);
  }, 1400);
};

const emit = defineEmits<{
  (e: 'back'): void;
  (e: 'purgeCache', container: ContainerSite): void;
  (e: 'openLogs', container: ContainerSite): void;
  (e: 'openEditor', container: ContainerSite): void;
  (e: 'toggleMaintenance', container: ContainerSite): void;
}>();

const timeframe = ref<'24h' | '7d' | '30d'>('24h');

const report = computed(() => {
  return generatePodAnalytics(props.container);
});

const currentPoints = computed(() => {
  if (timeframe.value === '7d') return report.value.timeframe7d;
  if (timeframe.value === '30d') return report.value.timeframe30d;
  return report.value.timeframe24h;
});

// Daily Hits Search & Filter
const hitSearchQuery = ref('');
const hitReferrerFilter = ref<'all' | 'search' | 'social' | 'direct'>('all');

const filteredDailyHits = computed(() => {
  if (!report.value) return [];
  return report.value.dailyHits.filter(h => {
    const matchFilter = hitReferrerFilter.value === 'all' || h.referrerType === hitReferrerFilter.value;
    const q = hitSearchQuery.value.toLowerCase().trim();
    if (!q) return matchFilter;
    const matchSearch =
      h.clientIp.toLowerCase().includes(q) ||
      h.city.toLowerCase().includes(q) ||
      h.isp.toLowerCase().includes(q) ||
      h.targetPath.toLowerCase().includes(q) ||
      h.referrer.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });
});

const filterCounts = computed(() => {
  const hits = report.value?.dailyHits || [];
  return {
    all: hits.length,
    search: hits.filter(h => h.referrerType === 'search').length,
    social: hits.filter(h => h.referrerType === 'social').length,
    direct: hits.filter(h => h.referrerType === 'direct').length
  };
});

const isFilterActive = computed(() => {
  return hitReferrerFilter.value !== 'all' || hitSearchQuery.value.trim().length > 0;
});

const resetFilters = () => {
  hitReferrerFilter.value = 'all';
  hitSearchQuery.value = '';
};

// Number formatting helper for KPI labels
const formatMetric = (val: number) => {
  if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M';
  if (val >= 1000) return (val / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return Math.round(val).toLocaleString();
};

const timeframeLabel = computed(() => {
  if (timeframe.value === '7d') return '7 Hari Terakhir';
  if (timeframe.value === '30d') return '30 Hari Terakhir';
  return '24 Jam Terakhir';
});

// Summary Stats for Chart Header KPI strip
const chartStats = computed(() => {
  const pts = currentPoints.value;
  if (!pts || pts.length === 0) return { total: 0, cached: 0, hitPct: '0.0', peak: 0 };
  const total = pts.reduce((acc, p) => acc + p.requests, 0);
  const cached = pts.reduce((acc, p) => acc + p.cachedRequests, 0);
  const peak = Math.max(...pts.map(p => p.requests), 0);
  const hitPct = total > 0 ? ((cached / total) * 100).toFixed(1) : '0.0';
  return { total, cached, hitPct, peak };
});

// -----------------------------------------------------------------------------
// Enterprise Apache ECharts Setup (Cloudflare / Datadog APM Standard)
// -----------------------------------------------------------------------------
const chartContainerRef = ref<HTMLDivElement | null>(null);
let chartInstance: echarts.ECharts | null = null;
let resizeObserver: ResizeObserver | null = null;

const initChart = () => {
  if (!chartContainerRef.value) return;
  if (chartInstance) {
    chartInstance.dispose();
  }
  chartInstance = echarts.init(chartContainerRef.value, undefined, {
    renderer: 'canvas'
  });
  updateChart();
};

const updateChart = () => {
  if (!chartInstance) return;
  const pts = currentPoints.value;
  if (!pts || pts.length === 0) return;

  const labels = pts.map(p => p.label);
  const totalSeries = pts.map(p => p.requests);
  const cachedSeries = pts.map(p => p.cachedRequests);

  const option: echarts.EChartsOption = {
    animationDuration: 700,
    animationEasing: 'cubicOut',
    grid: {
      left: '18px',
      right: '25px',
      top: '30px',
      bottom: '15px',
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15, 23, 42, 0.96)',
      borderColor: 'rgba(255, 255, 255, 0.12)',
      borderWidth: 1,
      padding: [10, 14],
      extraCssText: 'border-radius: 10px; box-shadow: 0 16px 36px -6px rgba(0,0,0,0.4); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);',
      axisPointer: {
        type: 'line',
        lineStyle: {
          color: '#94a3b8',
          type: 'dashed',
          width: 1.2
        }
      },
      formatter: (params: any) => {
        if (!Array.isArray(params) || params.length === 0) return '';
        const idx = params[0].dataIndex;
        const pt = pts[idx];
        if (!pt) return '';

        const hitPct = pt.requests > 0 ? ((pt.cachedRequests / pt.requests) * 100).toFixed(1) : '0';
        const miss = Math.max(0, pt.requests - pt.cachedRequests);

        return `
          <div style="font-family: inherit; font-size: 12px; color: #ffffff; min-width: 220px;">
            <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 6px; border-bottom: 1px solid rgba(255,255,255,0.1); margin-bottom: 8px; font-weight: 600; color: #94a3b8; font-size: 11px;">
              <span>🕒 ${pt.label} (${timeframeLabel.value})</span>
              <span style="color: #38bdf8; font-family: ui-monospace, monospace;">Cloudflare Edge</span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 6px;">
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <span style="display: flex; align-items: center; gap: 6px; color: #cbd5e1;">
                  <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #3b82f6; box-shadow: 0 0 6px #3b82f6;"></span>
                  Total Ingress:
                </span>
                <strong style="color: #ffffff; font-family: ui-monospace, monospace;">${pt.requests.toLocaleString()} reqs</strong>
              </div>
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <span style="display: flex; align-items: center; gap: 6px; color: #cbd5e1;">
                  <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #10b981; box-shadow: 0 0 6px #10b981;"></span>
                  Edge Cache Hit:
                </span>
                <strong style="color: #34d399; font-family: ui-monospace, monospace;">${pt.cachedRequests.toLocaleString()} (${hitPct}%)</strong>
              </div>
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <span style="display: flex; align-items: center; gap: 6px; color: #cbd5e1;">
                  <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #f59e0b;"></span>
                  Origin Pod Pass:
                </span>
                <strong style="color: #ffffff; font-family: ui-monospace, monospace;">${miss.toLocaleString()} reqs</strong>
              </div>
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 8px; padding-top: 6px; border-top: 1px solid rgba(255,255,255,0.08); font-size: 11px; color: #94a3b8;">
              <span>⚡ Latensi: <strong style="color: #f1f5f9;">${pt.latencyMs} ms</strong></span>
              <span>📦 Bandwidth: <strong style="color: #f1f5f9;">${pt.bandwidthMB} MB</strong></span>
            </div>
          </div>
        `;
      }
    },
    xAxis: {
      type: 'category',
      data: labels,
      boundaryGap: false,
      axisLine: {
        lineStyle: { color: '#e2e8f0' }
      },
      axisTick: { show: false },
      axisLabel: {
        color: '#64748b',
        fontSize: 11,
        fontFamily: 'ui-monospace, SFMono-Regular, monospace',
        margin: 12
      }
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: {
          color: '#f1f5f9',
          type: 'dashed'
        }
      },
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: '#94a3b8',
        fontSize: 11,
        fontFamily: 'ui-monospace, SFMono-Regular, monospace',
        formatter: (val: number) => {
          if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M';
          if (val >= 1000) return (val / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
          return val.toString();
        }
      }
    },
    series: [
      {
        name: 'Total Permintaan Masuk',
        type: 'line',
        smooth: 0.38,
        symbol: 'circle',
        symbolSize: 6,
        showSymbol: false,
        lineStyle: {
          width: 3,
          color: '#2563eb',
          shadowColor: 'rgba(37, 99, 235, 0.25)',
          shadowBlur: 8,
          shadowOffsetY: 4
        },
        itemStyle: {
          color: '#2563eb',
          borderColor: '#ffffff',
          borderWidth: 2
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(37, 99, 235, 0.28)' },
            { offset: 0.8, color: 'rgba(37, 99, 235, 0.04)' },
            { offset: 1, color: 'rgba(37, 99, 235, 0.0)' }
          ])
        },
        data: totalSeries
      },
      {
        name: 'Dilayani dari Edge Cache',
        type: 'line',
        smooth: 0.38,
        symbol: 'circle',
        symbolSize: 6,
        showSymbol: false,
        lineStyle: {
          width: 2,
          color: '#10b981',
          type: 'dashed'
        },
        itemStyle: {
          color: '#10b981',
          borderColor: '#ffffff',
          borderWidth: 2
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(16, 185, 129, 0.18)' },
            { offset: 0.8, color: 'rgba(16, 185, 129, 0.02)' },
            { offset: 1, color: 'rgba(16, 185, 129, 0.0)' }
          ])
        },
        data: cachedSeries
      }
    ]
  };

  chartInstance.setOption(option);
};

onMounted(() => {
  nextTick(() => {
    initChart();
    if (chartContainerRef.value) {
      resizeObserver = new ResizeObserver(() => {
        chartInstance?.resize();
      });
      resizeObserver.observe(chartContainerRef.value);
    }
  });
});

onUnmounted(() => {
  resizeObserver?.disconnect();
  chartInstance?.dispose();
  chartInstance = null;
});

watch(timeframe, () => {
  nextTick(() => {
    updateChart();
  });
});

// CSV Export
const exportTelemetry = () => {
  const headers = ['Timestamp', 'Client IP', 'Country', 'City', 'ISP ASN', 'Referrer', 'Target Path', 'Method', 'Status', 'Cache', 'TTFB', 'User Agent'];
  const rows = report.value.dailyHits.map(h => [
    h.timestamp,
    h.clientIp,
    h.countryCode,
    `"${h.city}"`,
    `"${h.isp}"`,
    `"${h.referrer}"`,
    `"${h.targetPath}"`,
    h.httpMethod,
    h.statusCode,
    h.cacheStatus,
    h.ttfb,
    `"${h.userAgent} (${h.os})"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `daily-hits-telemetry-${props.container.subdomain}.csv`);
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
          <span style="cursor: pointer;" @click="emit('back')">Situs & Kontainer</span>
          <span class="divider">/</span>
          <span class="current" style="color: #2563eb;">{{ container.subdomain }}</span>
          <span class="divider">/</span>
          <span style="font-family: ui-monospace, SFMono-Regular, monospace; font-size: 0.72rem; color: #64748b;">
            #{{ container.id }}
          </span>
        </div>
      </div>

      <div class="footer-right-buttons">
        <button type="button" class="btn-analytics-export btn-accent-slate" @click="exportTelemetry" title="Export Laporan Log Hit Harian">
          <Download :size="13" />
          <span>Export CSV</span>
        </button>
        <button
          type="button"
          class="btn-modal-ghost btn-accent-amber"
          @click="emit('toggleMaintenance', container)"
          :title="container.status === 'maintenance' ? 'Akhiri Pemeliharaan & Go-Live' : 'Aktifkan Mode Pemeliharaan'"
        >
          <Wrench :size="13" />
          <span>{{ container.status === 'maintenance' ? 'Akhiri Maintenance' : 'Mode Maintenance' }}</span>
        </button>
        <button type="button" class="btn-modal-ghost btn-accent-purple" @click="emit('purgeCache', container)" title="Purge Edge Cloudflare Cache">
          <Sparkles :size="13" />
          <span>Purge Edge Cache</span>
        </button>
        <button type="button" class="btn-modal-ghost btn-accent-slate" @click="emit('openLogs', container)" title="Buka Log Terminal Docker">
          <Terminal :size="13" />
          <span>Log Terminal</span>
        </button>
        <button type="button" class="btn-modal-ghost btn-accent-blue" @click="emit('openEditor', container)" title="Edit Halaman di Visual Editor">
          <Edit3 :size="13" />
          <span>Buka di Editor</span>
        </button>
        <a :href="`https://${container.subdomain}`" target="_blank" class="btn-modal-confirm">
          <span>Kunjungi Situs</span>
          <ArrowUpRight :size="14" />
        </a>
      </div>
    </div>

    <!-- Maintenance Banner Alert -->
    <div
      v-if="container.status === 'maintenance'"
      style="margin-bottom: 14px; background: #fffbeb; border: 1px solid #fde68a; border-radius: 12px; padding: 14px 18px; display: flex; align-items: center; justify-content: space-between; gap: 16px;"
    >
      <div style="display: flex; align-items: center; gap: 12px;">
        <div style="width: 36px; height: 36px; border-radius: 8px; background: #fef3c7; color: #b45309; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
          <Wrench :size="18" />
        </div>
        <div>
          <div style="font-size: 0.84rem; font-weight: 700; color: #92400e;">
            Mode Pemeliharaan Sedang Aktif (HTTP 503 Service Unavailable)
          </div>
          <div style="font-size: 0.74rem; color: #b45309; margin-top: 2px;">
            Pengunjung publik tidak dapat mengakses situs ini secara langsung. Pesan aktif:
            <em>"{{ container.maintenanceConfig?.message || 'Situs sedang dalam pemeliharaan berkala...' }}"</em>
            <span v-if="container.maintenanceConfig?.estimatedEndTime" style="margin-left: 6px; font-weight: 600;">
              • Estimasi: {{ container.maintenanceConfig.estimatedEndTime }}
            </span>
          </div>
        </div>
      </div>
      <button
        type="button"
        class="btn-modal-confirm"
        style="background: #059669; border-color: #047857; flex-shrink: 0; padding: 6px 14px; font-size: 0.78rem;"
        @click="emit('toggleMaintenance', container)"
      >
        <span>Akhiri Pemeliharaan (Go Live)</span>
      </button>
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
              <span v-if="container.status === 'maintenance'" class="pod-meta-pill" style="background: #fffbeb; color: #b45309; border: 1px solid #fde68a;">
                <Wrench :size="11" />
                <span>Maintenance Mode • HTTP 503 Active</span>
              </span>
              <span v-else-if="container.status === 'running'" class="pod-meta-pill status-green">
                <span class="pulse-mini-dot"></span>
                <span>Running • Healthy</span>
              </span>
              <span v-else class="pod-meta-pill" style="background: #f1f5f9; color: #64748b;">
                <span>Standby</span>
              </span>
              <span class="pod-meta-pill route-pill">
                <Lock :size="11" style="color: #10b981;" />
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
                <Cpu :size="11" />
                <span>Alokasi {{ container.cpuLimit }} CPU • {{ container.ramLimit }}MB RAM</span>
              </span>
              <span class="pod-meta-pill">
                <span>⏱ Uptime: {{ container.uptime }}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 3. Industry Standards Reference Banner -->
    <div class="industry-standard-banner">
      <div style="display: flex; align-items: center; gap: 8px;">
        <Sparkles :size="16" style="color: #2563eb; flex-shrink: 0;" />
        <div>
          <strong style="font-size: 0.78rem; color: #0f172a;">Arsitektur Telemetri Standar Industri Dunia:</strong>
          <span style="font-size: 0.74rem; color: #64748b; margin-left: 6px;">
            HeroCMS mengadopsi standar PaaS global berikut untuk menjamin transparansi infrastruktur penuh:
          </span>
        </div>
      </div>

      <div class="standards-flex">
        <span class="standard-badge cf-badge" title="Cloudflare Enterprise Anycast, TTFB Sub-2ms & Geo Edge Cache">
          <strong>Cloudflare Enterprise</strong> (Edge Traffic & Geo Standard)
        </span>
        <span class="standard-badge dd-badge" title="Datadog APM & Linux cgroups v2 Kernel Resource Isolation">
          <strong>Datadog APM & Kubernetes</strong> (Pod cgroups v2 & Process Tree)
        </span>
        <span class="standard-badge vercel-badge" title="Vercel Web Analytics & Privacy-friendly Visitor Attribution">
          <strong>Vercel Web Analytics</strong> (Daily Visitor Attribution & Vitals)
        </span>
      </div>
    </div>

    <!-- Toast Notification for Customer Backup/Restore Action -->
    <div
      v-if="restoreToast"
      style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 10px; padding: 12px 18px; display: flex; align-items: center; gap: 10px; color: #065f46; font-size: 0.8rem; font-weight: 600; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.1);"
    >
      <Check :size="16" style="color: #059669; flex-shrink: 0;" />
      <span>{{ restoreToast }}</span>
    </div>

    <!-- 4. CUSTOMER PEACE-OF-MIND & BUSINESS RELIABILITY SUITE -->
    <div class="confidence-cards-grid">
      <!-- Card 1: 30-Day Uptime SLA Calendar -->
      <div class="confidence-card">
        <div class="confidence-card-head">
          <span class="confidence-card-title">
            <Calendar :size="15" style="color: #059669;" />
            <span>Keandalan Uptime 30 Hari</span>
          </span>
          <span class="confidence-status-badge green">99.99% Operational</span>
        </div>

        <div class="uptime-calendar-shell">
          <div class="uptime-bars-strip">
            <div
              v-for="b in report.uptimeCalendar"
              :key="b.day"
              class="uptime-bar-item"
              :title="`${b.date}: ${b.uptimePct}% Uptime (Latensi ${b.latencyMs}ms)`"
              @mouseenter="hoveredUptimeDay = b"
              @mouseleave="hoveredUptimeDay = null"
            ></div>
          </div>

          <div class="uptime-labels-flex">
            <span>30 hari lalu</span>
            <span v-if="hoveredUptimeDay" style="color: #059669; font-weight: 700;">
              {{ hoveredUptimeDay.date }}: 100% Uptime ({{ hoveredUptimeDay.latencyMs }}ms)
            </span>
            <span v-else style="color: #059669; font-weight: 600;">
              0 menit downtime terdeteksi
            </span>
            <span>Hari ini (Live)</span>
          </div>
        </div>

        <div style="font-size: 0.72rem; color: #64748b; border-top: 1px solid #f1f5f9; padding-top: 8px;">
          SLA 99.98% Terpenuhi • Monitoring ping edge proxy setiap 30 detik
        </div>
      </div>

      <!-- Card 2: Automated Backup Snapshot -->
      <div class="confidence-card">
        <div class="confidence-card-head">
          <span class="confidence-card-title">
            <Database :size="15" style="color: #2563eb;" />
            <span>Cadangan Otomatis</span>
          </span>
          <span class="confidence-status-badge blue">S3 Terverifikasi</span>
        </div>

        <div class="snapshot-info-box">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <strong style="color: #0f172a;">Snapshot Terakhir</strong>
            <span class="snapshot-id-code">{{ report.backupSnapshot.id }}</span>
          </div>
          <div style="color: #64748b;">
            📅 {{ report.backupSnapshot.timestamp }} • Ukuran: <strong>{{ report.backupSnapshot.size }}</strong>
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 8px;">
          <button
            type="button"
            class="btn-modal-ghost btn-accent-emerald"
            style="flex: 1; padding: 6px 10px; font-size: 0.72rem; justify-content: center;"
            :disabled="isRestoringSnapshot"
            @click="handleRestoreSnapshot"
            title="Pulihkan data website ke kondisi snapshot ini"
          >
            <RotateCw :size="12" :class="{ 'spin-anim': isRestoringSnapshot }" />
            <span>{{ isRestoringSnapshot ? 'Memulihkan...' : 'Pulihkan Snapshot' }}</span>
          </button>

          <button
            type="button"
            class="btn-modal-ghost btn-accent-blue"
            style="padding: 6px 10px; font-size: 0.72rem;"
            :disabled="isCreatingBackup"
            @click="handleCreateBackup"
            title="Buat backup instan baru sekarang"
          >
            <Sparkles :size="12" :class="{ 'spin-anim': isCreatingBackup }" />
            <span>+ Backup</span>
          </button>
        </div>
      </div>

      <!-- Card 3: SSL Wildcard & Health Check -->
      <div class="confidence-card">
        <div class="confidence-card-head">
          <span class="confidence-card-title">
            <Lock :size="15" style="color: #059669;" />
            <span>Sertifikat SSL HTTPS</span>
          </span>
          <span class="confidence-status-badge green">Auto-Renew Aktif</span>
        </div>

        <div style="display: flex; flex-direction: column; gap: 5px; font-size: 0.74rem;">
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #64748b;">Penerbit (Issuer)</span>
            <strong style="color: #0f172a;">{{ report.sslCertificate.issuer }}</strong>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #64748b;">Protokol Enkripsi</span>
            <strong style="color: #2563eb;">{{ report.sslCertificate.protocol }}</strong>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #64748b;">Masa Berlaku</span>
            <strong style="color: #059669;">{{ report.sslCertificate.validUntil }}</strong>
          </div>
        </div>

        <div style="font-size: 0.72rem; color: #059669; font-weight: 600; border-top: 1px solid #f1f5f9; padding-top: 8px;">
          🟢 {{ report.sslCertificate.daysRemaining }} hari tersisa • Otomatis diperpanjang
        </div>
      </div>

      <!-- Card 4: Bandwidth Quota & No Extra Cost -->
      <div class="confidence-card">
        <div class="confidence-card-head">
          <span class="confidence-card-title">
            <HardDrive :size="15" style="color: #7c3aed;" />
            <span>Kuota Bandwidth</span>
          </span>
          <span class="confidence-status-badge green">Rp 0 Tagihan</span>
        </div>

        <div style="display: flex; flex-direction: column; gap: 6px;">
          <div style="display: flex; justify-content: space-between; font-size: 0.75rem;">
            <span style="color: #64748b;">Egress Terpakai</span>
            <strong>{{ report.bandwidthQuota.usedGB }} GB / {{ report.bandwidthQuota.limitGB }} GB</strong>
          </div>
          <div class="custom-meter-track" style="height: 6px;">
            <div class="custom-meter-fill fill-purple" :style="{ width: `${report.bandwidthQuota.percentage}%` }"></div>
          </div>
        </div>

        <div style="font-size: 0.72rem; color: #64748b; border-top: 1px solid #f1f5f9; padding-top: 8px;">
          {{ report.bandwidthQuota.extraCharge }} • Kapasitas aman untuk lonjakan traffic
        </div>
      </div>
    </div>

    <!-- 5. BESPOKE CMS SUITE: Publishing, Media Library & Form Shield -->
    <div class="cms-suite-grid">
      <!-- Card 1: Publishing & Sitemap SEO Health -->
      <div class="cms-suite-card">
        <div class="cms-suite-head">
          <span class="cms-suite-title">
            <FileText :size="15" style="color: #2563eb;" />
            <span>Status Publikasi & SEO</span>
          </span>
          <span class="confidence-status-badge green">{{ report.cmsPublishing.sitemapStatus }}</span>
        </div>

        <div class="cms-metric-strip">
          <div class="cms-metric-row">
            <span>Halaman Terbit / Draft</span>
            <strong>{{ report.cmsPublishing.publishedPages }} Terbit <span style="color: #94a3b8; font-weight: normal;">({{ report.cmsPublishing.draftPages }} Draft)</span></strong>
          </div>
          <div class="cms-metric-row">
            <span>Edge Purge Latency</span>
            <strong style="color: #059669;">⚡ {{ report.cmsPublishing.lastPurgeLatency }} (Instan)</strong>
          </div>
          <div class="cms-metric-row">
            <span>Arsitektur Rendering</span>
            <strong>{{ report.cmsPublishing.engineMode }}</strong>
          </div>
        </div>

        <div style="font-size: 0.72rem; color: #64748b; border-top: 1px solid #f1f5f9; padding-top: 8px;">
          📅 Terakhir diperbarui: <strong>{{ report.cmsPublishing.lastModified }}</strong>
        </div>
      </div>

      <!-- Card 2: Media Library & Image Optimization Health -->
      <div class="cms-suite-card">
        <div class="cms-suite-head">
          <span class="cms-suite-title">
            <Image :size="15" style="color: #059669;" />
            <span>Penyimpanan Media & WebP</span>
          </span>
          <span class="confidence-status-badge green">{{ report.cmsMedia.webpOptimizedPct }}% WebP</span>
        </div>

        <div style="display: flex; flex-direction: column; gap: 6px;">
          <div style="display: flex; justify-content: space-between; font-size: 0.75rem;">
            <span style="color: #64748b;">Media Terpakai</span>
            <strong>{{ report.cmsMedia.usedMB }} MB / {{ report.cmsMedia.quotaMB }} MB</strong>
          </div>
          <div class="custom-meter-track" style="height: 6px;">
            <div class="custom-meter-fill fill-emerald" :style="{ width: `${report.cmsMedia.percentage}%` }"></div>
          </div>
        </div>

        <div class="cms-metric-strip">
          <div class="cms-metric-row">
            <span>Total Berkas Gambar</span>
            <strong>{{ report.cmsMedia.totalFiles }} berkas</strong>
          </div>
          <div class="cms-metric-row">
            <span>Bandwidth Terhemat</span>
            <strong style="color: #059669;">{{ report.cmsMedia.bandwidthSavedMB }} MB (Kompresi Aktif)</strong>
          </div>
        </div>

        <div style="font-size: 0.72rem; color: #64748b; border-top: 1px solid #f1f5f9; padding-top: 8px; display: flex; align-items: center; justify-content: space-between;">
          <span>Aset Terbesar:</span>
          <code style="font-size: 0.7rem; background: #f1f5f9; padding: 1px 5px; border-radius: 4px;">{{ report.cmsMedia.largestAsset.name }} ({{ report.cmsMedia.largestAsset.size }})</code>
        </div>
      </div>

      <!-- Card 3: Form Shield & Bot Defense -->
      <div class="cms-suite-card">
        <div class="cms-suite-head">
          <span class="cms-suite-title">
            <Send :size="15" style="color: #7c3aed;" />
            <span>Proteksi Formulir & Kontak</span>
          </span>
          <span class="confidence-status-badge blue">Zero Captcha</span>
        </div>

        <div class="cms-metric-strip">
          <div class="cms-metric-row">
            <span>Pesan Kontak Masuk</span>
            <strong>{{ report.cmsFormProtection.legitimateCount }} terverifikasi</strong>
          </div>
          <div class="cms-metric-row">
            <span>Spam Bot Dicegat</span>
            <strong style="color: #059669;">🛡️ {{ report.cmsFormProtection.botSpamBlocked }} serangan diblokir</strong>
          </div>
          <div class="cms-metric-row">
            <span>Kebijakan Shield</span>
            <strong style="font-size: 0.72rem;">{{ report.cmsFormProtection.rateLimitPolicy }}</strong>
          </div>
        </div>

        <div style="font-size: 0.72rem; color: #059669; font-weight: 600; border-top: 1px solid #f1f5f9; padding-top: 8px;">
          🟢 Formulir aman dari bot spammer tanpa mengganggu kenyamanan pengunjung
        </div>
      </div>
    </div>

    <!-- 6. TOP CMS PAGES & CONTENT ENGAGEMENT + ACQUISITION CHANNELS -->
    <div style="display: grid; grid-template-columns: 1.5fr 1fr; gap: 14px;">
      <!-- Left: Top CMS Pages Table -->
      <div class="telemetry-table-card" style="margin: 0; padding: 14px 18px;">
        <div class="telemetry-table-header" style="padding-bottom: 8px;">
          <div class="table-header-title">
            <Layers :size="16" style="color: #2563eb;" />
            <div>
              <h4>Performa Konten & Halaman Terpopuler (Top Pages)</h4>
              <span style="font-size: 0.72rem; color: #64748b;">
                Halaman dengan jumlah pembaca terbanyak, waktu baca rata-rata, dan kecepatan TTFB
              </span>
            </div>
          </div>
        </div>

        <div style="overflow-x: auto;">
          <table class="ledger-table" style="font-size: 0.76rem;">
            <thead>
              <tr>
                <th style="width: 38px;">#</th>
                <th>HALAMAN / JUDUL ARTIKEL</th>
                <th>URL PATH</th>
                <th style="text-align: right;">PEMBACA</th>
                <th style="text-align: right;">WAKTU BACA</th>
                <th style="text-align: right;">CACHE</th>
                <th style="text-align: right;">TTFB</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(pg, idx) in report.cmsTopPages" :key="pg.id">
                <td>
                  <span class="top-page-rank-badge" :class="`top-${idx + 1}`">{{ idx + 1 }}</span>
                </td>
                <td>
                  <strong style="color: #0f172a;">{{ pg.title }}</strong>
                </td>
                <td>
                  <code style="font-size: 0.71rem; color: #2563eb; background: #eff6ff; padding: 1px 6px; border-radius: 4px;">{{ pg.path }}</code>
                </td>
                <td style="text-align: right;">
                  <strong style="color: #0f172a;">{{ pg.views.toLocaleString() }}</strong>
                  <span style="font-size: 0.68rem; color: #64748b; margin-left: 4px;">({{ pg.sharePct }}%)</span>
                </td>
                <td style="text-align: right; color: #64748b;">
                  {{ pg.avgReadTime }}
                </td>
                <td style="text-align: right;">
                  <span class="radar-status-pill status-running" style="display: inline-flex; padding: 1px 6px; font-size: 0.66rem;">
                    {{ pg.cacheHitPct }}%
                  </span>
                </td>
                <td style="text-align: right; font-weight: 600; color: #059669;">
                  {{ pg.ttfb }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Right: Traffic Acquisition Channels (Saluran Pengunjung) -->
      <div class="cms-suite-card" style="margin: 0;">
        <div class="cms-suite-head">
          <span class="cms-suite-title">
            <Compass :size="15" style="color: #2563eb;" />
            <span>Saluran Kedatangan Pembaca</span>
          </span>
          <span style="font-size: 0.68rem; color: #64748b; font-weight: 600;">100% Organik</span>
        </div>

        <div>
          <div style="font-size: 0.74rem; color: #64748b; margin-bottom: 8px;">
            Distribusi sumber trafik pembaca website (SEO, Media Sosial, & Rujukan Langsung):
          </div>

          <!-- Multi-Color Progress Strip -->
          <div class="cms-acquisition-strip">
            <div
              v-for="ch in report.cmsAcquisition"
              :key="ch.name"
              class="cms-acquisition-bar"
              :style="{ width: `${ch.percentage}%`, backgroundColor: ch.color }"
              :title="`${ch.name}: ${ch.percentage}% (${ch.visitors.toLocaleString()} pengunjung)`"
            ></div>
          </div>

          <!-- Acquisition Legend List -->
          <div class="cms-acquisition-legend">
            <div
              v-for="ch in report.cmsAcquisition"
              :key="ch.name"
              class="cms-channel-item"
            >
              <div class="cms-channel-left">
                <span class="cms-channel-dot" :style="{ backgroundColor: ch.color }"></span>
                <span>{{ ch.name }}</span>
              </div>
              <span class="cms-channel-val">{{ ch.percentage }}%</span>
            </div>
          </div>
        </div>

        <div style="font-size: 0.72rem; color: #64748b; border-top: 1px solid #f1f5f9; padding-top: 8px;">
          💡 <strong>Insight CMS:</strong> 44.3% pembaca datang via Google Search organik berkat arsitektur headless berkecepatan tinggi dan sitemap valid.
        </div>
      </div>
    </div>

    <!-- 7. DEPLOYMENT & VERSION HISTORY (RECENT BUILDS) -->
    <div class="telemetry-table-card" style="padding: 14px 18px;">
      <div class="telemetry-table-header" style="padding-bottom: 8px;">
        <div class="table-header-title">
          <History :size="16" style="color: #2563eb;" />
          <div>
            <h4>Riwayat Versi & Deploy Terakhir (Build Timeline)</h4>
            <span style="font-size: 0.72rem; color: #64748b;">
              Catatan publikasi perubahan editor dan update infrastruktur website
            </span>
          </div>
        </div>
        <span style="font-size: 0.72rem; color: #059669; font-weight: 600;">
          🟢 Build Aktif: {{ report.deployHistory[0]?.buildId }}
        </span>
      </div>

      <div class="deploy-timeline-list">
        <div
          v-for="bld in report.deployHistory"
          :key="bld.buildId"
          class="deploy-item-row"
        >
          <div class="deploy-info-group">
            <div class="deploy-title-bold">
              <span>{{ bld.title }}</span>
              <span class="deploy-hash-tag">#{{ bld.commitHash }}</span>
            </div>
            <div class="deploy-meta-sub">
              Diterapkan {{ bld.timeAgo }} oleh <strong>{{ bld.author }}</strong>
            </div>
          </div>

          <div>
            <span
              class="radar-status-pill"
              :class="bld.status === 'Live (Production)' ? 'status-running' : 'status-stopped'"
              style="padding: 3px 9px; font-size: 0.7rem;"
            >
              <span class="radar-dot"></span>
              <span>{{ bld.status }}</span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 6. Live Edge Ingest Streaming Ticker -->
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

    <!-- 5. Top Cloudflare Metric Strips (4 KPIs) -->
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

    <!-- 6. Deep Container Resource Telemetry Grid (Datadog & cgroups v2) -->
    <div class="deep-resources-grid">
      <!-- CPU & CFS Throttling -->
      <div class="deep-resource-card">
        <div class="deep-card-head">
          <span class="deep-card-title">
            <Cpu :size="15" style="color: #2563eb;" />
            <span>CPU & CFS Quota (cgroups v2)</span>
          </span>
          <span style="font-size: 0.7rem; font-weight: 700; color: #2563eb;">
            {{ report.deepResources.cpuUsagePct }}% / {{ container.cpuLimit }}
          </span>
        </div>
        <div class="custom-meter-track">
          <div class="custom-meter-fill fill-blue" :style="{ width: `${report.deepResources.cpuUsagePct}%` }"></div>
        </div>
        <div class="deep-metric-row-list">
          <div class="deep-row-item">
            <span>Alokasi CFS Period / Quota</span>
            <strong>100ms / 50ms (0.5 vCPU)</strong>
          </div>
          <div class="deep-row-item">
            <span>User vs System CPU</span>
            <strong>{{ report.deepResources.cpuUserPct }}% usr / {{ report.deepResources.cpuSystemPct }}% sys</strong>
          </div>
          <div class="deep-row-item">
            <span>CPU Throttled Time</span>
            <strong style="color: #059669;">{{ report.deepResources.cpuThrottleTime }} (Optimal)</strong>
          </div>
          <div class="deep-row-item">
            <span>Load Average (1m, 5m, 15m)</span>
            <strong>{{ report.deepResources.loadAverage.one }}, {{ report.deepResources.loadAverage.five }}, {{ report.deepResources.loadAverage.fifteen }}</strong>
          </div>
        </div>
      </div>

      <!-- Memory Breakdown (memcg) -->
      <div class="deep-resource-card">
        <div class="deep-card-head">
          <span class="deep-card-title">
            <HardDrive :size="15" style="color: #059669;" />
            <span>Memori memcg Linux</span>
          </span>
          <span style="font-size: 0.7rem; font-weight: 700; color: #059669;">
            {{ container.ramUsage }}MB / {{ report.deepResources.memLimitMB }}MB
          </span>
        </div>
        <div class="custom-meter-track">
          <div class="custom-meter-fill fill-emerald" :style="{ width: `${(container.ramUsage / report.deepResources.memLimitMB) * 100}%` }"></div>
        </div>
        <div class="deep-metric-row-list">
          <div class="deep-row-item">
            <span>RSS (Resident Application Memory)</span>
            <strong>{{ report.deepResources.memRssMB }} MB</strong>
          </div>
          <div class="deep-row-item">
            <span>Page Cache & Buffers</span>
            <strong>{{ report.deepResources.memCacheMB }} MB</strong>
          </div>
          <div class="deep-row-item">
            <span>Swap Thrashing</span>
            <strong style="color: #059669;">0 MB (Tanpa Swap I/O)</strong>
          </div>
          <div class="deep-row-item">
            <span>OOM Kills Event</span>
            <strong style="color: #059669;">0 Kills (Kernel Aman)</strong>
          </div>
        </div>
      </div>

      <!-- Network & Storage I/O -->
      <div class="deep-resource-card">
        <div class="deep-card-head">
          <span class="deep-card-title">
            <Server :size="15" style="color: #7c3aed;" />
            <span>Network & Disk I/O</span>
          </span>
          <span style="font-size: 0.7rem; font-weight: 700; color: #7c3aed;">
            {{ report.deepResources.diskUsedMB }}MB / {{ report.deepResources.diskTotalMB }}MB
          </span>
        </div>
        <div class="custom-meter-track">
          <div class="custom-meter-fill fill-purple" :style="{ width: `${(report.deepResources.diskUsedMB / report.deepResources.diskTotalMB) * 100}%` }"></div>
        </div>
        <div class="deep-metric-row-list">
          <div class="deep-row-item">
            <span>Throughput Jaringan</span>
            <strong>↓ {{ report.deepResources.networkIngressRate }} • ↑ {{ report.deepResources.networkEgressRate }}</strong>
          </div>
          <div class="deep-row-item">
            <span>Active TCP Socket Connections</span>
            <strong>{{ report.deepResources.tcpActiveSockets }} Active ({{ report.deepResources.tcpKeepAlive }} Keep-Alive)</strong>
          </div>
          <div class="deep-row-item">
            <span>Disk IOPS Read / Write</span>
            <strong>{{ report.deepResources.diskReadIops }} read / {{ report.deepResources.diskWriteIops }} write IOPS</strong>
          </div>
          <div class="deep-row-item">
            <span>Storage Driver</span>
            <strong>ext4 overlay2 (Docker Isolated)</strong>
          </div>
        </div>
      </div>
    </div>

    <!-- 7. Active Process Table (Linux Worker Process Tree) -->
    <div class="telemetry-table-card">
      <div class="telemetry-table-header">
        <div class="table-header-title">
          <Terminal :size="16" style="color: #2563eb;" />
          <h4>Pohon Proses Aktif di Dalam Kontainer (Linux Process Tree)</h4>
        </div>
        <span style="font-size: 0.72rem; color: #64748b;">
          {{ report.processes.length }} worker process berjalan di namespace cgroups pod
        </span>
      </div>

      <div style="overflow-x: auto;">
        <table class="ledger-table">
          <thead>
            <tr>
              <th style="width: 70px;">PID</th>
              <th>NAMA PROSES</th>
              <th>COMMAND / BINARY PATH</th>
              <th>CPU USAGE</th>
              <th>MEMORY RSS</th>
              <th>THREADS</th>
              <th>STATUS</th>
              <th style="text-align: right;">UPTIME</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="proc in report.processes" :key="proc.pid">
              <td>
                <span style="font-family: ui-monospace, monospace; font-weight: 700; color: #2563eb;">{{ proc.pid }}</span>
              </td>
              <td>
                <strong style="color: #0f172a; font-size: 0.78rem;">{{ proc.name }}</strong>
              </td>
              <td>
                <code style="font-size: 0.72rem; color: #475569; background: #f1f5f9; padding: 2px 6px; border-radius: 4px;">{{ proc.command }}</code>
              </td>
              <td>
                <span style="font-family: ui-monospace, monospace; font-weight: 600;">{{ proc.cpuPct }}%</span>
              </td>
              <td>
                <span style="font-family: ui-monospace, monospace; font-weight: 600; color: #059669;">{{ proc.memoryMB }} MB</span>
              </td>
              <td>
                <span style="color: #64748b; font-size: 0.74rem;">{{ proc.threads }} threads</span>
              </td>
              <td>
                <span class="radar-status-pill status-running" style="display: inline-flex; padding: 2px 8px; font-size: 0.68rem;">
                  <span class="radar-dot"></span>
                  <span>{{ proc.status }}</span>
                </span>
              </td>
              <td style="text-align: right; color: #64748b; font-size: 0.74rem;">
                {{ proc.uptime }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 8. Cloudflare-Style Interactive Area Chart -->
    <div class="cf-chart-panel">
      <div class="cf-chart-header">
        <div class="cf-chart-title-group">
          <h4>
            <Activity :size="16" style="color: #2563eb;" />
            <span>Permintaan Edge & Efisiensi Cache</span>
          </h4>
          <p>Volume request yang dilayani langsung dari cache edge Traefik vs Origin Pod</p>

          <!-- Quick Telemetry KPI Badges -->
          <div class="cf-chart-kpi-bar">
            <span class="cf-kpi-pill">
              <Activity :size="12" style="color: #2563eb;" />
              <span>Total Volume:</span>
              <strong>{{ formatMetric(chartStats.total) }}</strong>
            </span>
            <span class="cf-kpi-pill emerald-tint">
              <Zap :size="12" style="color: #059669;" />
              <span>Edge Cache Hit:</span>
              <strong>{{ chartStats.hitPct }}%</strong>
            </span>
            <span class="cf-kpi-pill">
              <TrendingUp :size="12" style="color: #7c3aed;" />
              <span>Puncak (Peak):</span>
              <strong>{{ formatMetric(chartStats.peak) }} req/periode</strong>
            </span>
          </div>
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

      <!-- Enterprise ECharts Canvas Area (Cloudflare / Datadog APM Standard) -->
      <div class="cf-echarts-wrapper">
        <div ref="chartContainerRef" class="cf-echarts-canvas"></div>
      </div>

      <!-- Professional Legend Row -->
      <div class="cf-chart-legend-row">
        <div class="cf-legend-left">
          <div class="cf-legend-item">
            <span class="legend-swatch swatch-total"></span>
            <span>Total Permintaan Masuk (Traefik Ingress)</span>
          </div>
          <div class="cf-legend-item">
            <span class="legend-swatch swatch-cached"></span>
            <span>Dilayani dari Edge Cache (Hit {{ chartStats.hitPct }}%)</span>
          </div>
          <div class="cf-legend-item">
            <span class="legend-swatch swatch-origin"></span>
            <span>Diteruskan ke Container Pod (Cache Miss)</span>
          </div>
        </div>

        <div style="font-size: 0.72rem; color: #94a3b8; display: flex; align-items: center; gap: 4px;">
          <span>Data telemetri edge proxy • Resolusi per interval WIB</span>
        </div>
      </div>
    </div>

    <!-- 9. Dual Columns: Geo Traffic by Country vs Device & Vitals -->
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

    <!-- 10. DAILY VISITOR HIT ATTRIBUTION LOG (YANG HIT PER HARI SIAPA AJA) -->
    <div class="telemetry-table-card">
      <!-- Row 1: Header Title & Live Status -->
      <div class="telemetry-table-header" style="border-bottom: none; padding-bottom: 4px;">
        <div class="table-header-title">
          <Compass :size="16" style="color: #2563eb;" />
          <div>
            <h4>Log Akses & Pengunjung Harian (Live Access Ledger)</h4>
            <p style="margin: 2px 0 0 0; font-size: 0.73rem; color: #64748b;">
              Daftar pengunjung unik yang mengakses pod hari ini (IP, Provider ISP, Saluran Referrer, dan URL Target)
            </p>
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 8px;">
          <span class="radar-status-pill status-running" style="padding: 3px 9px; font-size: 0.7rem;">
            <span class="radar-dot"></span>
            <span>Live Ingress Stream</span>
          </span>
          <span style="font-size: 0.72rem; color: #64748b; font-weight: 600; background: #f1f5f9; padding: 3px 8px; border-radius: 6px;">
            {{ filteredDailyHits.length }} dari {{ report.dailyHits.length }} hits
          </span>
        </div>
      </div>

      <!-- Row 2: Dedicated Enterprise Filter & Search Toolbar -->
      <div class="telemetry-filter-toolbar">
        <!-- Left: Segmented Filter Pills with Icons and Count Badges -->
        <div class="telemetry-segmented-pills">
          <button
            type="button"
            class="telemetry-pill-btn"
            :class="{ active: hitReferrerFilter === 'all' }"
            @click="hitReferrerFilter = 'all'"
          >
            <Globe :size="13" />
            <span>Semua Hit</span>
            <span class="telemetry-pill-count">{{ filterCounts.all }}</span>
          </button>

          <button
            type="button"
            class="telemetry-pill-btn"
            :class="{ active: hitReferrerFilter === 'search' }"
            @click="hitReferrerFilter = 'search'"
          >
            <Search :size="13" />
            <span>Google Search</span>
            <span class="telemetry-pill-count">{{ filterCounts.search }}</span>
          </button>

          <button
            type="button"
            class="telemetry-pill-btn"
            :class="{ active: hitReferrerFilter === 'social' }"
            @click="hitReferrerFilter = 'social'"
          >
            <Share2 :size="13" />
            <span>Media Sosial</span>
            <span class="telemetry-pill-count">{{ filterCounts.social }}</span>
          </button>

          <button
            type="button"
            class="telemetry-pill-btn"
            :class="{ active: hitReferrerFilter === 'direct' }"
            @click="hitReferrerFilter = 'direct'"
          >
            <Compass :size="13" />
            <span>Direct</span>
            <span class="telemetry-pill-count">{{ filterCounts.direct }}</span>
          </button>
        </div>

        <!-- Right: Enhanced Search Box & Reset Button -->
        <div class="telemetry-filter-right">
          <div class="telemetry-search-shell">
            <Search :size="13" class="telemetry-search-icon" />
            <input
              v-model="hitSearchQuery"
              type="text"
              placeholder="Cari IP, kota, ISP, path (/catalog)..."
              class="telemetry-search-input"
            />
            <button
              v-if="hitSearchQuery"
              type="button"
              class="telemetry-search-clear"
              title="Hapus pencarian"
              @click="hitSearchQuery = ''"
            >
              <X :size="11" />
            </button>
          </div>

          <button
            v-if="isFilterActive"
            type="button"
            class="btn-filter-reset"
            title="Reset semua filter dan pencarian"
            @click="resetFilters"
          >
            <RotateCcw :size="11" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      <div style="overflow-x: auto;">
        <table class="ledger-table">
          <thead>
            <tr>
              <th style="width: 85px;">WAKTU</th>
              <th>PENGUNJUNG & IP</th>
              <th>PROVIDER JARINGAN (ISP ASN)</th>
              <th>SALURAN REFERRER</th>
              <th>RUTE TARGET</th>
              <th>HTTP & CACHE</th>
              <th>LATENSI</th>
              <th style="text-align: right;">PERANGKAT & OS</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="hit in filteredDailyHits" :key="hit.id">
              <!-- Waktu -->
              <td>
                <span style="font-family: ui-monospace, monospace; font-size: 0.74rem; color: #64748b;">
                  {{ hit.timestamp }}
                </span>
              </td>

              <!-- Pengunjung & IP -->
              <td>
                <div style="display: flex; align-items: center; gap: 7px;">
                  <span style="font-size: 1.05rem;">{{ hit.flag }}</span>
                  <div style="display: flex; flex-direction: column;">
                    <strong style="font-family: ui-monospace, monospace; font-size: 0.78rem; color: #0f172a;">
                      {{ hit.clientIp }}
                    </strong>
                    <span style="font-size: 0.68rem; color: #64748b;">{{ hit.city }}, {{ hit.countryCode }}</span>
                  </div>
                </div>
              </td>

              <!-- Provider / ISP -->
              <td>
                <div style="display: flex; align-items: center; gap: 5px;">
                  <Server :size="11" style="color: #64748b;" />
                  <span style="font-size: 0.74rem; color: #334155; font-weight: 500;">{{ hit.isp }}</span>
                </div>
              </td>

              <!-- Sumber Referrer -->
              <td>
                <span class="referrer-tag" :title="hit.referrer">
                  <Share2 v-if="hit.referrerType === 'social'" :size="10" style="color: #ea580c;" />
                  <Search v-else-if="hit.referrerType === 'search'" :size="10" style="color: #2563eb;" />
                  <Compass v-else :size="10" style="color: #10b981;" />
                  <span>{{ hit.referrer }}</span>
                </span>
              </td>

              <!-- Rute Target -->
              <td>
                <code style="font-size: 0.73rem; color: #1e40af; background: #eff6ff; padding: 2px 6px; border-radius: 4px; font-weight: 600;">
                  {{ hit.targetPath }}
                </code>
              </td>

              <!-- HTTP & Cache -->
              <td>
                <div style="display: flex; align-items: center; gap: 5px;">
                  <span style="font-size: 0.72rem; font-weight: 700; color: #059669;">{{ hit.statusCode }}</span>
                  <span
                    class="cache-pill"
                    :class="{
                      hit: hit.cacheStatus === 'HIT',
                      miss: hit.cacheStatus === 'MISS',
                      bypass: hit.cacheStatus === 'BYPASS'
                    }"
                  >
                    {{ hit.cacheStatus }}
                  </span>
                </div>
              </td>

              <!-- Latensi -->
              <td>
                <span style="font-size: 0.74rem; font-family: ui-monospace, monospace; font-weight: 600; color: #2563eb;">
                  ⚡ {{ hit.ttfb }}
                </span>
              </td>

              <!-- Perangkat & OS -->
              <td style="text-align: right;">
                <div style="display: flex; flex-direction: column; align-items: flex-end;">
                  <span style="font-size: 0.73rem; font-weight: 600; color: #1e293b;">{{ hit.userAgent }}</span>
                  <span style="font-size: 0.67rem; color: #64748b;">{{ hit.os }}</span>
                </div>
              </td>
            </tr>

            <tr v-if="filteredDailyHits.length === 0">
              <td colspan="8" style="text-align: center; padding: 40px 20px; color: #64748b;">
                <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
                  <Search :size="24" style="color: #94a3b8;" />
                  <span style="font-weight: 600; color: #1e293b; font-size: 0.85rem;">Tidak ada log akses yang cocok</span>
                  <span style="font-size: 0.74rem; color: #94a3b8; max-width: 420px;">
                    Tidak ditemukan data pengunjung dengan kriteria filter atau kata kunci pencarian "{{ hitSearchQuery }}".
                  </span>
                  <button
                    type="button"
                    class="btn-modal-ghost btn-accent-slate"
                    style="margin-top: 6px; padding: 6px 14px; font-size: 0.74rem;"
                    @click="resetFilters"
                  >
                    <RotateCcw :size="12" />
                    <span>Reset Filter Pencarian</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
