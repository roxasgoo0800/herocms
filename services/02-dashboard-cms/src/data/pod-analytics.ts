// Aether Core Stack Studio - Pod & Container Cloudflare-Style Edge Analytics Dataset
import type { ContainerSite } from '../types/dashboard';

export interface GeoCountryStat {
  code: string;
  name: string;
  flag: string;
  requests: number;
  percentage: number;
  ttfb: string;
  bandwidth: string;
}

export interface TimeframeDataPoint {
  label: string;
  requests: number;
  cachedRequests: number;
  bandwidthMB: number;
  latencyMs: number;
}

export interface LiveRequestEntry {
  id: string;
  timestamp: string;
  countryCode: string;
  flag: string;
  city: string;
  method: 'GET' | 'POST' | 'HEAD';
  path: string;
  status: 200 | 304 | 404;
  ttfb: string;
  device: 'Mobile' | 'Desktop' | 'Tablet';
  browser: string;
}

export interface PodProcessItem {
  pid: number;
  name: string;
  command: string;
  cpuPct: number;
  memoryMB: number;
  threads: number;
  status: 'running' | 'sleeping';
  uptime: string;
}

export interface DailyVisitorHit {
  id: string;
  timestamp: string;
  clientIp: string;
  countryCode: string;
  flag: string;
  city: string;
  isp: string;
  referrer: string;
  referrerType: 'search' | 'direct' | 'social' | 'campaign';
  targetPath: string;
  httpMethod: 'GET' | 'POST' | 'HEAD';
  statusCode: number;
  cacheStatus: 'HIT' | 'MISS' | 'BYPASS';
  ttfb: string;
  userAgent: string;
  os: string;
}

export interface PodResourceDeepMetrics {
  cpuUsagePct: number;
  cpuPeakPct: number;
  cpuUserPct: number;
  cpuSystemPct: number;
  cpuThrottleTime: string;
  loadAverage: { one: number; five: number; fifteen: number };
  memRssMB: number;
  memCacheMB: number;
  memSwapMB: number;
  memPeakMB: number;
  memLimitMB: number;
  oomKills: number;
  diskUsedMB: number;
  diskTotalMB: number;
  diskReadIops: number;
  diskWriteIops: number;
  networkIngressRate: string;
  networkEgressRate: string;
  tcpActiveSockets: number;
  tcpKeepAlive: number;
}

export interface PodAnalyticsReport {
  podId: string;
  gatewayIp: string;
  ingressRouter: string;
  totalRequests: number;
  cacheHitRatio: number;
  totalBandwidth: string;
  bandwidthSaved: string;
  avgLatency: string;
  uniqueCountriesCount: number;
  countries: GeoCountryStat[];
  timeframe24h: TimeframeDataPoint[];
  timeframe7d: TimeframeDataPoint[];
  timeframe30d: TimeframeDataPoint[];
  deviceBreakdown: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
  topPaths: { path: string; hits: number; percentage: number }[];
  httpStatusCodes: { code: string; label: string; count: number; percentage: number; color: string }[];
  webVitals: {
    lcp: { val: string; status: 'good' | 'needs-improvement'; label: string };
    inp: { val: string; status: 'good' | 'needs-improvement'; label: string };
    cls: { val: string; status: 'good' | 'needs-improvement'; label: string };
  };
  liveRequests: LiveRequestEntry[];
  deepResources: PodResourceDeepMetrics;
  processes: PodProcessItem[];
  dailyHits: DailyVisitorHit[];
  // Customer Peace-of-Mind & Reliability Additions
  uptimeCalendar: { day: number; date: string; uptimePct: number; status: 'operational' | 'degraded'; latencyMs: number }[];
  backupSnapshot: { id: string; timestamp: string; size: string; status: 'verified'; checksum: string };
  sslCertificate: { issuer: string; protocol: string; validUntil: string; autoRenew: boolean; daysRemaining: number };
  bandwidthQuota: { usedGB: number; limitGB: number; percentage: number; extraCharge: string };
  deployHistory: { buildId: string; title: string; author: string; timeAgo: string; status: 'Live (Production)' | 'Superseded'; commitHash: string }[];
  // Bespoke CMS Content, Media & SEO Telemetry
  cmsPublishing: {
    totalPages: number;
    publishedPages: number;
    draftPages: number;
    sitemapStatus: 'Valid (200 OK)';
    lastPurgeLatency: string;
    lastModified: string;
    engineMode: string;
  };
  cmsMedia: {
    usedMB: number;
    quotaMB: number;
    percentage: number;
    totalFiles: number;
    webpOptimizedPct: number;
    bandwidthSavedMB: number;
    largestAsset: { name: string; size: string; path: string; status: 'Optimized' | 'Needs WebP' };
  };
  cmsTopPages: {
    id: string;
    title: string;
    path: string;
    views: number;
    sharePct: number;
    avgReadTime: string;
    cacheHitPct: number;
    ttfb: string;
    isIndexed: boolean;
  }[];
  cmsAcquisition: {
    name: string;
    category: 'search' | 'social' | 'direct' | 'referral';
    visitors: number;
    percentage: number;
    color: string;
  }[];
  cmsFormProtection: {
    totalSubmissions: number;
    legitimateCount: number;
    botSpamBlocked: number;
    rateLimitPolicy: string;
    avgVerificationMs: number;
  };
}

export const generatePodAnalytics = (container: ContainerSite): PodAnalyticsReport => {
  const isShop = container.category === 'business';
  const multiplier = Math.max(1, Math.round(container.visitsThisWeek / 300));

  return {
    podId: `pod-${container.id}-traefik-cgroups`,
    gatewayIp: `172.20.0.${Math.floor(10 + Math.random() * 40)}`,
    ingressRouter: `traefik-v3-ingress-${container.id}`,
    totalRequests: 48250 * multiplier,
    cacheHitRatio: 92.4,
    totalBandwidth: `${(1.84 * multiplier).toFixed(2)} GB`,
    bandwidthSaved: `${(1.62 * multiplier).toFixed(2)} GB`,
    avgLatency: '1.2 ms',
    uniqueCountriesCount: 18,
    countries: [
      { code: 'ID', name: 'Indonesia', flag: '🇮🇩', requests: 28450 * multiplier, percentage: 59.0, ttfb: '0.9 ms', bandwidth: '1.08 GB' },
      { code: 'SG', name: 'Singapura', flag: '🇸🇬', requests: 7810 * multiplier, percentage: 16.2, ttfb: '1.4 ms', bandwidth: '298 MB' },
      { code: 'US', name: 'Amerika Serikat', flag: '🇺🇸', requests: 4230 * multiplier, percentage: 8.8, ttfb: '12.4 ms', bandwidth: '162 MB' },
      { code: 'MY', name: 'Malaysia', flag: '🇲🇾', requests: 3110 * multiplier, percentage: 6.5, ttfb: '2.1 ms', bandwidth: '118 MB' },
      { code: 'JP', name: 'Jepang', flag: '🇯🇵', requests: 1980 * multiplier, percentage: 4.1, ttfb: '8.6 ms', bandwidth: '75 MB' },
      { code: 'AU', name: 'Australia', flag: '🇦🇺', requests: 1420 * multiplier, percentage: 2.9, ttfb: '9.2 ms', bandwidth: '54 MB' },
      { code: 'DE', name: 'Jerman', flag: '🇩🇪', requests: 720 * multiplier, percentage: 1.5, ttfb: '16.8 ms', bandwidth: '28 MB' },
      { code: 'GB', name: 'Inggris', flag: '🇬🇧', requests: 530 * multiplier, percentage: 1.0, ttfb: '18.2 ms', bandwidth: '20 MB' }
    ],
    timeframe24h: [
      { label: '00:00', requests: 420 * multiplier, cachedRequests: 390 * multiplier, bandwidthMB: 18, latencyMs: 1.1 },
      { label: '02:00', requests: 280 * multiplier, cachedRequests: 260 * multiplier, bandwidthMB: 12, latencyMs: 0.9 },
      { label: '04:00', requests: 190 * multiplier, cachedRequests: 175 * multiplier, bandwidthMB: 8, latencyMs: 0.8 },
      { label: '06:00', requests: 640 * multiplier, cachedRequests: 590 * multiplier, bandwidthMB: 28, latencyMs: 1.2 },
      { label: '08:00', requests: 1420 * multiplier, cachedRequests: 1310 * multiplier, bandwidthMB: 62, latencyMs: 1.4 },
      { label: '10:00', requests: 2840 * multiplier, cachedRequests: 2620 * multiplier, bandwidthMB: 124, latencyMs: 1.3 },
      { label: '12:00', requests: 3900 * multiplier, cachedRequests: 3610 * multiplier, bandwidthMB: 172, latencyMs: 1.5 },
      { label: '14:00', requests: 4800 * multiplier, cachedRequests: 4430 * multiplier, bandwidthMB: 210, latencyMs: 1.2 },
      { label: '16:00', requests: 4120 * multiplier, cachedRequests: 3810 * multiplier, bandwidthMB: 180, latencyMs: 1.1 },
      { label: '18:00', requests: 3200 * multiplier, cachedRequests: 2950 * multiplier, bandwidthMB: 140, latencyMs: 1.0 },
      { label: '20:00', requests: 2600 * multiplier, cachedRequests: 2400 * multiplier, bandwidthMB: 114, latencyMs: 1.2 },
      { label: '22:00', requests: 1100 * multiplier, cachedRequests: 1010 * multiplier, bandwidthMB: 48, latencyMs: 1.0 }
    ],
    timeframe7d: [
      { label: 'Sen', requests: 6420 * multiplier, cachedRequests: 5940 * multiplier, bandwidthMB: 280, latencyMs: 1.1 },
      { label: 'Sel', requests: 7120 * multiplier, cachedRequests: 6580 * multiplier, bandwidthMB: 310, latencyMs: 1.2 },
      { label: 'Rab', requests: 6890 * multiplier, cachedRequests: 6360 * multiplier, bandwidthMB: 300, latencyMs: 1.0 },
      { label: 'Kam', requests: 8450 * multiplier, cachedRequests: 7810 * multiplier, bandwidthMB: 370, latencyMs: 1.3 },
      { label: 'Jum', requests: 9120 * multiplier, cachedRequests: 8430 * multiplier, bandwidthMB: 400, latencyMs: 1.4 },
      { label: 'Sab', requests: 5410 * multiplier, cachedRequests: 5010 * multiplier, bandwidthMB: 236, latencyMs: 0.9 },
      { label: 'Min', requests: 4840 * multiplier, cachedRequests: 4470 * multiplier, bandwidthMB: 212, latencyMs: 0.8 }
    ],
    timeframe30d: [
      { label: 'Mgg 1', requests: 26400 * multiplier, cachedRequests: 24390 * multiplier, bandwidthMB: 1150, latencyMs: 1.2 },
      { label: 'Mgg 2', requests: 31200 * multiplier, cachedRequests: 28830 * multiplier, bandwidthMB: 1360, latencyMs: 1.1 },
      { label: 'Mgg 3', requests: 29800 * multiplier, cachedRequests: 27530 * multiplier, bandwidthMB: 1300, latencyMs: 1.3 },
      { label: 'Mgg 4', requests: 34100 * multiplier, cachedRequests: 31500 * multiplier, bandwidthMB: 1490, latencyMs: 1.2 }
    ],
    deviceBreakdown: {
      mobile: 72.4,
      desktop: 24.1,
      tablet: 3.5
    },
    topPaths: isShop
      ? [
          { path: '/', hits: 16400 * multiplier, percentage: 34.0 },
          { path: '/catalog', hits: 13500 * multiplier, percentage: 28.0 },
          { path: '/api/products', hits: 9160 * multiplier, percentage: 19.0 },
          { path: '/checkout', hits: 5790 * multiplier, percentage: 12.0 },
          { path: '/tentang-kami', hits: 3400 * multiplier, percentage: 7.0 }
        ]
      : [
          { path: '/', hits: 18200 * multiplier, percentage: 37.7 },
          { path: '/blog', hits: 14100 * multiplier, percentage: 29.2 },
          { path: '/showcase', hits: 8700 * multiplier, percentage: 18.0 },
          { path: '/api/telemetry', hits: 4800 * multiplier, percentage: 10.0 },
          { path: '/contact', hits: 2450 * multiplier, percentage: 5.1 }
        ],
    httpStatusCodes: [
      { code: '200', label: '200 OK (Cache/Origin)', count: 46700 * multiplier, percentage: 96.8, color: '#10b981' },
      { code: '304', label: '304 Not Modified', count: 1150 * multiplier, percentage: 2.4, color: '#2563eb' },
      { code: '404', label: '404 Not Found', count: 390 * multiplier, percentage: 0.8, color: '#f59e0b' },
      { code: '5xx', label: '5xx Server Error', count: 0, percentage: 0.0, color: '#ef4444' }
    ],
    webVitals: {
      lcp: { val: '0.7s', status: 'good', label: 'Largest Contentful Paint' },
      inp: { val: '14ms', status: 'good', label: 'Interaction to Next Paint' },
      cls: { val: '0.01', status: 'good', label: 'Cumulative Layout Shift' }
    },
    liveRequests: [
      { id: 'req-1', timestamp: '19:26:42', countryCode: 'ID', flag: '🇮🇩', city: 'Jakarta', method: 'GET', path: isShop ? '/catalog' : '/showcase', status: 200, ttfb: '0.8 ms', device: 'Mobile', browser: 'Safari 17.4' },
      { id: 'req-2', timestamp: '19:26:38', countryCode: 'SG', flag: '🇸🇬', city: 'Singapore', method: 'GET', path: isShop ? '/api/products' : '/api/telemetry', status: 200, ttfb: '1.2 ms', device: 'Desktop', browser: 'Chrome 122' },
      { id: 'req-3', timestamp: '19:26:29', countryCode: 'ID', flag: '🇮🇩', city: 'Surabaya', method: 'GET', path: '/', status: 200, ttfb: '0.9 ms', device: 'Mobile', browser: 'Chrome Mobile' },
      { id: 'req-4', timestamp: '19:26:22', countryCode: 'US', flag: '🇺🇸', city: 'San Jose', method: 'GET', path: isShop ? '/checkout' : '/blog', status: 200, ttfb: '11.8 ms', device: 'Desktop', browser: 'Firefox 123' },
      { id: 'req-5', timestamp: '19:26:15', countryCode: 'MY', flag: '🇲🇾', city: 'Kuala Lumpur', method: 'HEAD', path: '/', status: 304, ttfb: '1.8 ms', device: 'Mobile', browser: 'Edge 122' }
    ],
    // Datadog & Kubernetes Pod cgroups v2 Deep Resource Breakdown
    deepResources: {
      cpuUsagePct: container.cpuUsage || 14,
      cpuPeakPct: (container.cpuUsage || 14) + 12,
      cpuUserPct: 9.4,
      cpuSystemPct: 4.6,
      cpuThrottleTime: '0.018s',
      loadAverage: { one: 0.12, five: 0.08, fifteen: 0.05 },
      memRssMB: container.ramUsage ? Math.round(container.ramUsage * 0.82) : 74,
      memCacheMB: container.ramUsage ? Math.round(container.ramUsage * 0.18) : 16,
      memSwapMB: 0,
      memPeakMB: container.ramUsage ? container.ramUsage + 18 : 98,
      memLimitMB: container.ramLimit || 256,
      oomKills: 0,
      diskUsedMB: 48.2,
      diskTotalMB: 1000,
      diskReadIops: 14,
      diskWriteIops: 6,
      networkIngressRate: '142 KB/s',
      networkEgressRate: '1.84 MB/s',
      tcpActiveSockets: 24,
      tcpKeepAlive: 6
    },
    // Linux Container Active Process List (Worker PID tree)
    processes: [
      { pid: 1, name: 'dumb-init', command: '/usr/bin/dumb-init -- /entrypoint.sh', cpuPct: 0.1, memoryMB: 2.2, threads: 1, status: 'sleeping', uptime: container.uptime },
      { pid: 14, name: 'traefik-sidecar', command: 'traefik proxy --api.insecure=false --entrypoints.web', cpuPct: 1.4, memoryMB: 18.6, threads: 4, status: 'running', uptime: container.uptime },
      { pid: 28, name: 'stack-ssr-worker', command: 'stack-app serve --port=8080 --workers=4', cpuPct: 8.6, memoryMB: 56.4, threads: 8, status: 'running', uptime: container.uptime },
      { pid: 42, name: 'redis-cache-engine', command: 'redis-server --maxmemory 32mb --save ""', cpuPct: 0.4, memoryMB: 8.2, threads: 2, status: 'sleeping', uptime: container.uptime }
    ],
    // Vercel & Plausible Daily Visitor Hit Attribution Log
    dailyHits: [
      {
        id: 'hit-101',
        timestamp: '19:26:14',
        clientIp: '103.144.20.12',
        countryCode: 'ID',
        flag: '🇮🇩',
        city: 'Jakarta',
        isp: 'Telkomsel Mobile Broadband',
        referrer: 'Google Search (Organik)',
        referrerType: 'search',
        targetPath: isShop ? '/catalog' : '/showcase',
        httpMethod: 'GET',
        statusCode: 200,
        cacheStatus: 'HIT',
        ttfb: '0.8 ms',
        userAgent: 'Safari Mobile 17.4',
        os: 'iOS 17.4'
      },
      {
        id: 'hit-102',
        timestamp: '19:25:40',
        clientIp: '180.252.164.71',
        countryCode: 'ID',
        flag: '🇮🇩',
        city: 'Surabaya',
        isp: 'Biznet Fiber Enterprise',
        referrer: 'Instagram Feed Ad #promo10',
        referrerType: 'social',
        targetPath: isShop ? '/api/products' : '/blog',
        httpMethod: 'GET',
        statusCode: 200,
        cacheStatus: 'HIT',
        ttfb: '0.9 ms',
        userAgent: 'Chrome Mobile 122',
        os: 'Android 14'
      },
      {
        id: 'hit-103',
        timestamp: '19:25:02',
        clientIp: '178.62.204.88',
        countryCode: 'SG',
        flag: '🇸🇬',
        city: 'Singapore',
        isp: 'Singtel Internet Exchange',
        referrer: 'Direct / Bookmark',
        referrerType: 'direct',
        targetPath: '/',
        httpMethod: 'GET',
        statusCode: 200,
        cacheStatus: 'HIT',
        ttfb: '1.2 ms',
        userAgent: 'Chrome 122 Desktop',
        os: 'Windows 11'
      },
      {
        id: 'hit-104',
        timestamp: '19:24:19',
        clientIp: '34.120.89.14',
        countryCode: 'US',
        flag: '🇺🇸',
        city: 'San Jose',
        isp: 'Google Cloud Platform ASN',
        referrer: 'Google Search Console Bot',
        referrerType: 'search',
        targetPath: '/sitemap.xml',
        httpMethod: 'GET',
        statusCode: 200,
        cacheStatus: 'MISS',
        ttfb: '12.4 ms',
        userAgent: 'Googlebot/2.1 Crawler',
        os: 'Linux x86_64'
      },
      {
        id: 'hit-105',
        timestamp: '19:23:45',
        clientIp: '202.80.212.44',
        countryCode: 'ID',
        flag: '🇮🇩',
        city: 'Bandung',
        isp: 'Indosat Ooredoo Hutchison',
        referrer: 'WhatsApp Chat Broadcast',
        referrerType: 'social',
        targetPath: isShop ? '/checkout' : '/contact',
        httpMethod: 'GET',
        statusCode: 200,
        cacheStatus: 'BYPASS',
        ttfb: '1.4 ms',
        userAgent: 'Safari Mobile 17.2',
        os: 'iOS 17.2'
      },
      {
        id: 'hit-106',
        timestamp: '19:22:11',
        clientIp: '175.143.48.90',
        countryCode: 'MY',
        flag: '🇲🇾',
        city: 'Kuala Lumpur',
        isp: 'TM Net Telekom Malaysia',
        referrer: 'Direct / URL Address Bar',
        referrerType: 'direct',
        targetPath: '/',
        httpMethod: 'HEAD',
        statusCode: 304,
        cacheStatus: 'HIT',
        ttfb: '1.8 ms',
        userAgent: 'Edge 122 Desktop',
        os: 'Windows 11'
      },
      {
        id: 'hit-107',
        timestamp: '19:20:54',
        clientIp: '139.130.4.5',
        countryCode: 'AU',
        flag: '🇦🇺',
        city: 'Sydney',
        isp: 'Telstra Global Network',
        referrer: 'LinkedIn Post Share',
        referrerType: 'social',
        targetPath: isShop ? '/catalog' : '/showcase',
        httpMethod: 'GET',
        statusCode: 200,
        cacheStatus: 'HIT',
        ttfb: '9.2 ms',
        userAgent: 'Safari 17.3 Desktop',
        os: 'macOS Sonoma'
      },
      {
        id: 'hit-108',
        timestamp: '19:18:32',
        clientIp: '133.242.18.2',
        countryCode: 'JP',
        flag: '🇯🇵',
        city: 'Tokyo',
        isp: 'Sakura Internet Inc.',
        referrer: 'Twitter / X Dev Community',
        referrerType: 'social',
        targetPath: isShop ? '/api/products' : '/blog',
        httpMethod: 'GET',
        statusCode: 200,
        cacheStatus: 'HIT',
        ttfb: '8.6 ms',
        userAgent: 'Chrome 122 Desktop',
        os: 'Linux'
      }
    ],
    // 30 Days Uptime Statuspage Calendar
    uptimeCalendar: Array.from({ length: 30 }, (_, i) => {
      const dayNum = 30 - i;
      return {
        day: dayNum,
        date: `${dayNum} hari lalu`,
        uptimePct: 100,
        status: 'operational' as const,
        latencyMs: Number((0.8 + Math.random() * 0.5).toFixed(1))
      };
    }).reverse(),
    // Automated Backup Snapshot
    backupSnapshot: {
      id: `snap-${container.id}-20261017-0400`,
      timestamp: 'Hari ini, 04:00 WIB (Otomatis)',
      size: `${(18.4 * multiplier).toFixed(1)} MB`,
      status: 'verified',
      checksum: 'sha256:8f4c2e...b901a'
    },
    // SSL Wildcard Certificate
    sslCertificate: {
      issuer: "Let's Encrypt Authority X3",
      protocol: 'TLS 1.3 / ALPN HTTP/2',
      validUntil: '15 Januari 2027',
      autoRenew: true,
      daysRemaining: 89
    },
    // Bandwidth Quota Usage
    bandwidthQuota: {
      usedGB: Number((1.84 * multiplier).toFixed(2)),
      limitGB: 50,
      percentage: Number(((1.84 * multiplier / 50) * 100).toFixed(1)),
      extraCharge: 'Rp 0 (Termasuk Paket)'
    },
    // Deployment & Build History
    deployHistory: [
      {
        buildId: `build-${container.id}-42`,
        title: isShop ? 'Pembaruan Banner Promo & WhatsApp Checkout' : 'Penyelarasan Telemetri & Desain Portofolio',
        author: 'Rizal Pratama (Owner)',
        timeAgo: '2 jam lalu',
        status: 'Live (Production)',
        commitHash: '8459af2'
      },
      {
        buildId: `build-${container.id}-41`,
        title: 'Optimasi Gambar WebP & Minifikasi Skrip',
        author: 'Stack Auto-Optimizer (Aether Core)',
        timeAgo: 'Kemarin, 14:20 WIB',
        status: 'Superseded',
        commitHash: '7a12bc9'
      },
      {
        buildId: `build-${container.id}-40`,
        title: isShop ? 'Inisialisasi Blueprint Toko Retail' : 'Inisialisasi Blueprint Engineer',
        author: 'Rizal Pratama (Owner)',
        timeAgo: '4 hari lalu',
        status: 'Superseded',
        commitHash: '1f44d90'
      }
    ],
    // Bespoke CMS Content, Media & SEO Telemetry
    cmsPublishing: {
      totalPages: isShop ? 32 : 18,
      publishedPages: isShop ? 28 : 15,
      draftPages: isShop ? 4 : 3,
      sitemapStatus: 'Valid (200 OK)',
      lastPurgeLatency: '118 ms',
      lastModified: 'Hari ini, 17:40 WIB',
      engineMode: 'SSG & Edge In-Memory Cache'
    },
    cmsMedia: {
      usedMB: Math.max(120, Math.round(180 * multiplier * 0.7)),
      quotaMB: 5000,
      percentage: Number(((Math.max(120, Math.round(180 * multiplier * 0.7)) / 5000) * 100).toFixed(1)),
      totalFiles: 86 * multiplier,
      webpOptimizedPct: 93.8,
      bandwidthSavedMB: Math.round(540 * multiplier),
      largestAsset: {
        name: isShop ? 'hero-banner-summer-sale.webp' : 'portfolio-hero-showcase.webp',
        size: '340 KB',
        path: '/uploads/images/hero-banner-2026.webp',
        status: 'Optimized'
      }
    },
    cmsTopPages: isShop
      ? [
          { id: 'p-1', title: 'Beranda Toko (Homepage)', path: '/', views: 16400 * multiplier, sharePct: 34.0, avgReadTime: '2m 15s', cacheHitPct: 98.4, ttfb: '0.8 ms', isIndexed: true },
          { id: 'p-2', title: 'Katalog Produk & Kategori', path: '/catalog', views: 13500 * multiplier, sharePct: 28.0, avgReadTime: '4m 30s', cacheHitPct: 94.2, ttfb: '1.1 ms', isIndexed: true },
          { id: 'p-3', title: 'Promo & Flash Sale Spesial', path: '/promo', views: 9160 * multiplier, sharePct: 19.0, avgReadTime: '1m 45s', cacheHitPct: 96.0, ttfb: '0.9 ms', isIndexed: true },
          { id: 'p-4', title: 'Panduan Ukuran & FAQ Belanja', path: '/panduan-belanja', views: 5790 * multiplier, sharePct: 12.0, avgReadTime: '3m 10s', cacheHitPct: 99.1, ttfb: '0.7 ms', isIndexed: true },
          { id: 'p-5', title: 'Kontak & Bantuan WhatsApp', path: '/kontak', views: 3400 * multiplier, sharePct: 7.0, avgReadTime: '0m 55s', cacheHitPct: 91.5, ttfb: '1.2 ms', isIndexed: true }
        ]
      : [
          { id: 'p-1', title: 'Beranda Utama & Featured Work', path: '/', views: 18200 * multiplier, sharePct: 37.7, avgReadTime: '2m 40s', cacheHitPct: 97.8, ttfb: '0.8 ms', isIndexed: true },
          { id: 'p-2', title: 'Artikel: Panduan Desain & Arsitektur', path: '/blog', views: 14100 * multiplier, sharePct: 29.2, avgReadTime: '5m 12s', cacheHitPct: 95.4, ttfb: '1.0 ms', isIndexed: true },
          { id: 'p-3', title: 'Showcase Proyek Unggulan', path: '/showcase', views: 8700 * multiplier, sharePct: 18.0, avgReadTime: '3m 50s', cacheHitPct: 98.2, ttfb: '0.9 ms', isIndexed: true },
          { id: 'p-4', title: 'Layanan Konsultasi & Studio', path: '/layanan', views: 4800 * multiplier, sharePct: 10.0, avgReadTime: '1m 30s', cacheHitPct: 96.8, ttfb: '1.1 ms', isIndexed: true },
          { id: 'p-5', title: 'Hubungi Studio & Formulir Kerjasama', path: '/contact', views: 2450 * multiplier, sharePct: 5.1, avgReadTime: '1m 10s', cacheHitPct: 92.0, ttfb: '1.3 ms', isIndexed: true }
        ],
    cmsAcquisition: [
      { name: 'Google Search (Organik SEO)', category: 'search', visitors: Math.round(21400 * multiplier), percentage: 44.3, color: '#2563eb' },
      { name: 'Media Sosial (WhatsApp, IG, X)', category: 'social', visitors: Math.round(14800 * multiplier), percentage: 30.7, color: '#10b981' },
      { name: 'Kunjungan Langsung (Direct URL)', category: 'direct', visitors: Math.round(8900 * multiplier), percentage: 18.4, color: '#7c3aed' },
      { name: 'Rujukan Web & Backlink', category: 'referral', visitors: Math.round(3150 * multiplier), percentage: 6.6, color: '#f59e0b' }
    ],
    cmsFormProtection: {
      totalSubmissions: 84 * multiplier,
      legitimateCount: 81 * multiplier,
      botSpamBlocked: 164 * multiplier,
      rateLimitPolicy: 'Traefik IP Shield (Max 5 req/min, 0 Captcha)',
      avgVerificationMs: 12
    }
  };
};
