// Aether Core Stack Studio - Enterprise Fleet Telemetry & Audit Dataset
import type { ContainerSite } from '../types/dashboard';

export interface AuditSlaOverview {
  uptimeSla: number;
  uptimeSlaTarget: string;
  peakRps: number;
  peakTimestamp: string;
  totalRequests: number;
  totalBandwidth: string;
  bandwidthSaved: string;
  latencyP50: number;
  latencyP95: number;
  latencyP99: number;
  errorRatePct: number;
  cacheHitRatio: number;
}

export interface HttpStatusBreakdown {
  code2xx: { count: number; pct: number; label: string };
  code3xx: { count: number; pct: number; label: string };
  code4xx: { count: number; pct: number; label: string };
  code5xx: { count: number; pct: number; label: string };
  errorBudgetRemainingPct: number;
  slaStatus: 'COMPLIANT' | 'WARNING' | 'BREACHED';
}

export interface ThreatOrigin {
  country: string;
  code: string;
  flag: string;
  hitsBlocked: number;
  reason: string;
}

export interface SecurityThreatAudit {
  rateLimited429Count: number;
  wafBlockedCount: number;
  humanTrafficPct: number;
  goodBotsPct: number;
  suspiciousScrapersPct: number;
  tls13RatioPct: number;
  activeCertificates: number;
  topThreatOrigins: ThreatOrigin[];
}

export interface FleetContainerBenchmark {
  id: string;
  name: string;
  subdomain: string;
  customDomain?: string;
  status: 'running' | 'stopped' | 'provisioning' | 'maintenance';
  uptime: string;
  visits: number;
  trafficSharePct: number;
  avgLatencyMs: number;
  peakCpuPct: number;
  ramUsageMB: number;
  ramLimitMB: number;
  ramUsagePct: number;
  oomRisk: 'Aman' | 'Waspada' | 'Kritis';
  oomRiskBadge: 'safe' | 'warning' | 'danger';
  cacheRatioPct: number;
}

export interface HourlyTrafficPoint {
  hour: string;
  requests: number;
  peakRps: number;
  cached: number;
  errors: number;
  latencyP95: number;
  bandwidthMB: number;
}

export interface TopContentRanking {
  rank: number;
  title: string;
  path: string;
  containerName: string;
  hits: number;
  score: number;
  pct: number;
}

export interface LiveKafkaAuditLog {
  id: string;
  time: string;
  tag: string;
  category: 'all' | 'security' | 'error' | 'latency' | 'edge';
  color: 'emerald' | 'blue' | 'purple' | 'amber' | 'red' | 'gray';
  text: string;
  meta: string;
}

export interface CoreWebVitalsTelemetry {
  lcpSeconds: number;
  lcpStatus: 'good' | 'needs-improvement' | 'poor';
  inpMs: number;
  inpStatus: 'good' | 'needs-improvement' | 'poor';
  clsScore: number;
  clsStatus: 'good' | 'needs-improvement' | 'poor';
  fcpSeconds: number;
  fcpStatus: 'good' | 'needs-improvement' | 'poor';
  ttfbMs: number;
  ttfbStatus: 'good' | 'needs-improvement' | 'poor';
  burnRatePerDay: number;
}

export interface EdgeDataCenterPop {
  code: string;
  name: string;
  country: string;
  flag: string;
  trafficSharePct: number;
  avgTtfbMs: number;
  primaryProtocol: string;
  status: 'optimal' | 'busy';
}

export interface ClientFingerprintBreakdown {
  devices: { type: string; pct: number; count: number }[];
  browsers: { name: string; pct: number }[];
  operatingSystems: { name: string; pct: number }[];
  protocolShares: { protocol: string; pct: number; port: string }[];
  compressionSavings: { method: string; pct: number; ratio: string }[];
}

export interface DatabaseAndCacheTelemetry {
  pgConnectionsActive: number;
  pgConnectionsMax: number;
  pgQueueDepth: number;
  pgRlsEvaluationMs: number;
  redisMemoryUsedMB: number;
  redisMemoryMaxMB: number;
  redisHitRatioPct: number;
  redisTotalKeys: number;
  kafkaThroughputPerSec: number;
  kafkaConsumerLagMs: number;
}

export interface FleetTelemetryReport {
  scopeId: string;
  scopeName: string;
  timeframe: '24h' | '7d' | '30d';
  sla: AuditSlaOverview;
  httpStatus: HttpStatusBreakdown;
  security: SecurityThreatAudit;
  benchmarks: FleetContainerBenchmark[];
  hourlyTraffic: HourlyTrafficPoint[];
  topPages: TopContentRanking[];
  auditLogs: LiveKafkaAuditLog[];
  // Expanded Broad Telemetry
  webVitals: CoreWebVitalsTelemetry;
  edgePops: EdgeDataCenterPop[];
  fingerprint: ClientFingerprintBreakdown;
  infraHealth: DatabaseAndCacheTelemetry;
}

export function generateFleetTelemetry(
  containers: ContainerSite[],
  selectedContainerId: string = 'all',
  timeframe: '24h' | '7d' | '30d' = '24h'
): FleetTelemetryReport {
  const isGlobal = selectedContainerId === 'all';
  const targetContainer = containers.find(c => c.id === selectedContainerId);
  const activeContainers = containers.filter(c => c.status === 'running');

  // Baseline multiplier based on timeframe
  const tfMultiplier = timeframe === '30d' ? 28 : timeframe === '7d' ? 7 : 1;

  // Calculate Fleet Benchmarks
  const totalVisits = containers.reduce((acc, c) => acc + (c.visitsThisWeek || 120), 0) * tfMultiplier;
  
  const benchmarks: FleetContainerBenchmark[] = containers.map(c => {
    const visits = (c.visitsThisWeek || 120) * tfMultiplier;
    const share = totalVisits > 0 ? Math.round((visits / totalVisits) * 100) : 100;
    const ramPct = Math.round((c.ramUsage / (c.ramLimit || 256)) * 100);
    const peakCpu = Math.min(98, Math.round(c.cpuUsage * 1.8 + 12));
    
    let oomRisk: 'Aman' | 'Waspada' | 'Kritis' = 'Aman';
    let oomRiskBadge: 'safe' | 'warning' | 'danger' = 'safe';
    if (ramPct >= 85) {
      oomRisk = 'Kritis';
      oomRiskBadge = 'danger';
    } else if (ramPct >= 65) {
      oomRisk = 'Waspada';
      oomRiskBadge = 'warning';
    }

    return {
      id: c.id,
      name: c.name,
      subdomain: c.subdomain,
      customDomain: c.customDomain,
      status: c.status,
      uptime: c.uptime || '99.98%',
      visits,
      trafficSharePct: share,
      avgLatencyMs: Number((1.2 + (c.cpuUsage / 50)).toFixed(1)),
      peakCpuPct: peakCpu,
      ramUsageMB: c.ramUsage,
      ramLimitMB: c.ramLimit || 256,
      ramUsagePct: ramPct,
      oomRisk,
      oomRiskBadge,
      cacheRatioPct: Math.min(98, Math.round(92 + (c.id.charCodeAt(0) % 6)))
    };
  });

  // Calculate Scope Traffic Values
  const scopedVisits = isGlobal
    ? totalVisits
    : (targetContainer?.visitsThisWeek || 3892) * tfMultiplier;

  const scopedPeakRps = isGlobal
    ? Number((scopedVisits / (24 * 3600) * 14.2).toFixed(1))
    : Number((scopedVisits / (24 * 3600) * 9.5).toFixed(1));

  const totalBandwidthGB = Number(((scopedVisits * 1.4) / 1024).toFixed(2));
  const bandwidthSavedGB = Number((totalBandwidthGB * 0.74).toFixed(2));

  // SLA Overview
  const sla: AuditSlaOverview = {
    uptimeSla: 99.98,
    uptimeSlaTarget: '99.90%',
    peakRps: Math.max(12.4, scopedPeakRps),
    peakTimestamp: '14:24:08 WIB (Traffic Peak)',
    totalRequests: scopedVisits,
    totalBandwidth: `${totalBandwidthGB} GB`,
    bandwidthSaved: `${bandwidthSavedGB} GB (74% CDN Savings)`,
    latencyP50: 1.2,
    latencyP95: 3.4,
    latencyP99: 8.8,
    errorRatePct: 0.04,
    cacheHitRatio: 94.6
  };

  // HTTP Status Breakdown (Error Budget Audit)
  const count2xx = Math.round(scopedVisits * 0.962);
  const count3xx = Math.round(scopedVisits * 0.034);
  const count4xx = Math.round(scopedVisits * 0.0036);
  const count5xx = Math.max(1, Math.round(scopedVisits * 0.0004));

  const httpStatus: HttpStatusBreakdown = {
    code2xx: { count: count2xx, pct: 96.2, label: '2xx Success (HTTP 200/201)' },
    code3xx: { count: count3xx, pct: 3.4, label: '3xx Cache & Redirect (304/301)' },
    code4xx: { count: count4xx, pct: 0.36, label: '4xx Client / Rate Limited (404/429)' },
    code5xx: { count: count5xx, pct: 0.04, label: '5xx Server Faults (SLA Target < 0.10%)' },
    errorBudgetRemainingPct: 96.0,
    slaStatus: count5xx / scopedVisits <= 0.001 ? 'COMPLIANT' : 'WARNING'
  };

  // Security & Threat Audit
  const security: SecurityThreatAudit = {
    rateLimited429Count: Math.round(scopedVisits * 0.0028) + 18,
    wafBlockedCount: Math.round(scopedVisits * 0.0012) + 7,
    humanTrafficPct: 78.4,
    goodBotsPct: 17.6,
    suspiciousScrapersPct: 4.0,
    tls13RatioPct: 100,
    activeCertificates: isGlobal ? Math.max(1, activeContainers.length) : 1,
    topThreatOrigins: [
      { country: 'Rusia (Proxy & VPN)', code: 'RU', flag: '🇷🇺', hitsBlocked: 342, reason: 'Aggressive WordPress /wp-admin Probe' },
      { country: 'Amerika Serikat (Cloud Scraper)', code: 'US', flag: '🇺🇸', hitsBlocked: 219, reason: 'AI Content Scraping Bot (Rate Limited)' },
      { country: 'Tiongkok (Automated Scanner)', code: 'CN', flag: '🇨🇳', hitsBlocked: 148, reason: 'Directory Traversal & Sensitive Env Probe' },
      { country: 'Belanda (Tor Exit Node)', code: 'NL', flag: '🇳🇱', hitsBlocked: 94, reason: 'SQL Injection Signature on Query String' }
    ]
  };

  // 24-Hour Traffic Distribution with Peak & Status
  const hours = [
    { hour: '00', baseHits: 42, p95: 1.1 },
    { hour: '02', baseHits: 28, p95: 1.0 },
    { hour: '04', baseHits: 19, p95: 0.9 },
    { hour: '06', baseHits: 84, p95: 1.4 },
    { hour: '08', baseHits: 192, p95: 2.1 },
    { hour: '10', baseHits: 340, p95: 3.2 },
    { hour: '12', baseHits: 460, p95: 4.1 },
    { hour: '14', baseHits: 580, p95: 5.4 }, // Peak
    { hour: '16', baseHits: 490, p95: 4.6 },
    { hour: '18', baseHits: 380, p95: 3.3 },
    { hour: '20', baseHits: 310, p95: 2.7 },
    { hour: '22', baseHits: 160, p95: 1.8 }
  ];

  const hourlyTraffic: HourlyTrafficPoint[] = hours.map(h => {
    const scale = isGlobal ? 1 : 0.75;
    const requests = Math.round(h.baseHits * scale * (scopedVisits / 3100));
    const cached = Math.round(requests * 0.94);
    const errors = Math.max(0, Math.round(requests * 0.004));
    const peakRps = Number(((requests / 3600) * 12.8).toFixed(1));
    const bandwidthMB = Number(((requests * 1.6) / 1024).toFixed(1));

    return {
      hour: h.hour,
      requests,
      peakRps,
      cached,
      errors,
      latencyP95: h.p95,
      bandwidthMB
    };
  });

  // Top Pages / Content via Redis Sorted Sets
  const topPages: TopContentRanking[] = isGlobal
    ? [
        { rank: 1, title: 'Arsitektur Multi-Tenant dengan Docker & Go SDK', path: '/blog/multi-tenant-docker', containerName: 'Portofolio Rizal', hits: Math.round(scopedVisits * 0.36), score: 99.4, pct: 100 },
        { rank: 2, title: 'Penyelarasan Telemetri Real-Time dengan Kafka', path: '/blog/kafka-telemetry', containerName: 'Portofolio Rizal', hits: Math.round(scopedVisits * 0.24), score: 84.1, pct: 67 },
        { rank: 3, title: 'Katalog Produk & Solusi Enterprise', path: '/solutions/enterprise-cloud', containerName: 'Toko Online Flagship', hits: Math.round(scopedVisits * 0.18), score: 68.5, pct: 50 },
        { rank: 4, title: 'Optimasi TTFB Edge Traefik v3 (1.8ms Target)', path: '/blog/traefik-ttfb', containerName: 'Portofolio Rizal', hits: Math.round(scopedVisits * 0.12), score: 52.0, pct: 33 },
        { rank: 5, title: 'Dokumentasi REST API & Kontrak Webhook', path: '/docs/api-contracts', containerName: 'Developer Portal', hits: Math.round(scopedVisits * 0.08), score: 38.2, pct: 22 }
      ]
    : [
        { rank: 1, title: `${targetContainer?.name || 'Halaman Utama'} - Beranda`, path: '/', containerName: targetContainer?.name || 'Situs', hits: Math.round(scopedVisits * 0.52), score: 98.2, pct: 100 },
        { rank: 2, title: 'Artikel & Studi Kasus Arsitektur', path: '/articles', containerName: targetContainer?.name || 'Situs', hits: Math.round(scopedVisits * 0.28), score: 82.5, pct: 54 },
        { rank: 3, title: 'Tentang & Profil Pengembang', path: '/about', containerName: targetContainer?.name || 'Situs', hits: Math.round(scopedVisits * 0.14), score: 56.0, pct: 27 },
        { rank: 4, title: 'Formulir Kontak & Konsultasi', path: '/contact', containerName: targetContainer?.name || 'Situs', hits: Math.round(scopedVisits * 0.06), score: 32.1, pct: 12 }
      ];

  // Kafka Ingestion Real-Time Audit Logs
  const auditLogs: LiveKafkaAuditLog[] = [
    {
      id: 'log-1',
      time: '14:24:12.892',
      tag: 'traefik-edge',
      category: 'edge',
      color: 'emerald',
      text: 'GET /blog/multi-tenant-docker 200 OK (Cache: HIT, TTFB: 1.2ms) - Client IP: 103.144.20.12',
      meta: 'TLS 1.3 • Brotli 11'
    },
    {
      id: 'log-2',
      time: '14:24:10.114',
      tag: 'rate-limit',
      category: 'security',
      color: 'amber',
      text: 'RATE-LIMIT HTTP 429: Throttling burst IP 185.220.101.44 (Trigger: >50 req/10s on /login)',
      meta: 'Traefik Middleware Active'
    },
    {
      id: 'log-3',
      time: '14:24:08.550',
      tag: 'kafka-ingest',
      category: 'all',
      color: 'blue',
      text: `Produced SLA telemetric record to topic "tenant.fleet.analytics" [P0@offset:194208]`,
      meta: 'Zero Consumer Lag'
    },
    {
      id: 'log-4',
      time: '14:24:06.012',
      tag: 'waf-block',
      category: 'security',
      color: 'red',
      text: 'WAF BLOCKED: Suspicious pattern "/.env" from 45.154.255.89 (Scanner Blocked 403 Forbidden)',
      meta: 'Anti-Traversal Rule #12'
    },
    {
      id: 'log-5',
      time: '14:24:04.770',
      tag: 'redis-zset',
      category: 'all',
      color: 'purple',
      text: 'ZINCRBY "tenant:views:2026-10" 1 "/blog/multi-tenant-docker" (Query cost: 0.18ms in-memory)',
      meta: 'Redis v7.2 In-Memory'
    },
    {
      id: 'log-6',
      time: '14:23:58.320',
      tag: 'cgroups-v2',
      category: 'latency',
      color: 'gray',
      text: `cgroups v2 heartbeat probe: Pod #${targetContainer?.id || 'hero_tenant_9942'} CPU=14% MEM=88MB/256MB healthy`,
      meta: 'OOM Risk: 0%'
    },
    {
      id: 'log-7',
      time: '14:23:52.190',
      tag: 'tls-alpn',
      category: 'edge',
      color: 'emerald',
      text: 'TLS Handshake ALPN h2 verified (Cipher: TLS_AES_128_GCM_SHA256, Zero Round-Trip Overhead)',
      meta: 'Let\'s Encrypt Valid'
    }
  ];

  // Core Web Vitals (Real User Monitoring)
  const webVitals: CoreWebVitalsTelemetry = {
    lcpSeconds: 0.82,
    lcpStatus: 'good',
    inpMs: 38,
    inpStatus: 'good',
    clsScore: 0.012,
    clsStatus: 'good',
    fcpSeconds: 0.45,
    fcpStatus: 'good',
    ttfbMs: isGlobal ? 1.2 : Number((1.1 + (targetContainer?.cpuUsage || 10) / 70).toFixed(1)),
    ttfbStatus: 'good',
    burnRatePerDay: 0.04
  };

  // Edge Ingress Data Centers
  const edgePops: EdgeDataCenterPop[] = [
    { code: 'ID-CGK1', name: 'Jakarta (Equinix JK1)', country: 'Indonesia', flag: '🇮🇩', trafficSharePct: 68.4, avgTtfbMs: 0.9, primaryProtocol: 'HTTP/3 QUIC', status: 'optimal' },
    { code: 'SG-SIN1', name: 'Singapore (Equinix SG1)', country: 'Singapura', flag: '🇸🇬', trafficSharePct: 18.2, avgTtfbMs: 4.2, primaryProtocol: 'HTTP/3 QUIC', status: 'optimal' },
    { code: 'US-SFO1', name: 'San Francisco (AWS West)', country: 'Amerika Serikat', flag: '🇺🇸', trafficSharePct: 6.8, avgTtfbMs: 12.4, primaryProtocol: 'HTTP/2', status: 'optimal' },
    { code: 'JP-NRT1', name: 'Tokyo (Equinix TY2)', country: 'Jepang', flag: '🇯🇵', trafficSharePct: 4.1, avgTtfbMs: 8.6, primaryProtocol: 'HTTP/3 QUIC', status: 'optimal' },
    { code: 'DE-FRA1', name: 'Frankfurt (Equinix FR5)', country: 'Jerman', flag: '🇩🇪', trafficSharePct: 2.5, avgTtfbMs: 16.8, primaryProtocol: 'HTTP/2', status: 'optimal' }
  ];

  // Client Fingerprint & Protocol Distribution
  const fingerprint: ClientFingerprintBreakdown = {
    devices: [
      { type: 'Mobile Smartphone', pct: 61.2, count: Math.round(scopedVisits * 0.612) },
      { type: 'Desktop Workstation', pct: 34.8, count: Math.round(scopedVisits * 0.348) },
      { type: 'Tablet Device', pct: 4.0, count: Math.round(scopedVisits * 0.040) }
    ],
    browsers: [
      { name: 'Google Chrome / Chromium', pct: 58.4 },
      { name: 'Apple Safari (iOS / macOS)', pct: 26.1 },
      { name: 'Mozilla Firefox Gecko', pct: 9.2 },
      { name: 'Microsoft Edge Chromium', pct: 6.3 }
    ],
    operatingSystems: [
      { name: 'Android 14 / 15', pct: 42.5 },
      { name: 'Apple iOS / iPadOS', pct: 24.8 },
      { name: 'Microsoft Windows 11', pct: 20.3 },
      { name: 'Apple macOS Sonoma', pct: 10.4 },
      { name: 'Linux Kernel / Distros', pct: 2.0 }
    ],
    protocolShares: [
      { protocol: 'HTTP/3 QUIC (UDP 443)', pct: 71.5, port: '443/UDP' },
      { protocol: 'HTTP/2 ALPN (TCP 443)', pct: 26.8, port: '443/TCP' },
      { protocol: 'HTTP/1.1 (Legacy Fallback)', pct: 1.7, port: '80/TCP' }
    ],
    compressionSavings: [
      { method: 'Brotli (br-11)', pct: 64, ratio: '-72% Data Transfer' },
      { method: 'Gzip (gz-9)', pct: 31, ratio: '-51% Data Transfer' },
      { method: 'Raw / Uncompressed', pct: 5, ratio: 'No Compression' }
    ]
  };

  // Infrastructure Health (PostgreSQL RLS & Redis & Kafka)
  const infraHealth: DatabaseAndCacheTelemetry = {
    pgConnectionsActive: 18,
    pgConnectionsMax: 100,
    pgQueueDepth: 0,
    pgRlsEvaluationMs: 0.14,
    redisMemoryUsedMB: 32.8,
    redisMemoryMaxMB: 512,
    redisHitRatioPct: 98.6,
    redisTotalKeys: 14280,
    kafkaThroughputPerSec: 240,
    kafkaConsumerLagMs: 0
  };

  return {
    scopeId: selectedContainerId,
    scopeName: isGlobal ? 'Semua Situs (Global Fleet)' : targetContainer?.name || 'Situs Terpilih',
    timeframe,
    sla,
    httpStatus,
    security,
    benchmarks,
    hourlyTraffic,
    topPages,
    auditLogs,
    webVitals,
    edgePops,
    fingerprint,
    infraHealth
  };
}
