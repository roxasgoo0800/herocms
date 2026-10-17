// HeroCMS Studio - Pod & Container Cloudflare-Style Edge Analytics Dataset
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
      { id: 'req-1', timestamp: '19:15:42', countryCode: 'ID', flag: '🇮🇩', city: 'Jakarta', method: 'GET', path: isShop ? '/catalog' : '/showcase', status: 200, ttfb: '0.8 ms', device: 'Mobile', browser: 'Safari 17.4' },
      { id: 'req-2', timestamp: '19:15:38', countryCode: 'SG', flag: '🇸🇬', city: 'Singapore', method: 'GET', path: isShop ? '/api/products' : '/api/telemetry', status: 200, ttfb: '1.2 ms', device: 'Desktop', browser: 'Chrome 122' },
      { id: 'req-3', timestamp: '19:15:29', countryCode: 'ID', flag: '🇮🇩', city: 'Surabaya', method: 'GET', path: '/', status: 200, ttfb: '0.9 ms', device: 'Mobile', browser: 'Chrome Mobile' },
      { id: 'req-4', timestamp: '19:15:22', countryCode: 'US', flag: '🇺🇸', city: 'San Jose', method: 'GET', path: isShop ? '/checkout' : '/blog', status: 200, ttfb: '11.8 ms', device: 'Desktop', browser: 'Firefox 123' },
      { id: 'req-5', timestamp: '19:15:15', countryCode: 'MY', flag: '🇲🇾', city: 'Kuala Lumpur', method: 'HEAD', path: '/', status: 304, ttfb: '1.8 ms', device: 'Mobile', browser: 'Edge 122' }
    ]
  };
};
