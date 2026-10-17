// HeroCMS Studio - Comprehensive Container Runtime & Telemetry Log Generator
import type { ContainerSite } from '../types/dashboard';

export interface ContainerLogEntry {
  id: string;
  lineNum: number;
  timestamp: string;
  service: 'system' | 'docker' | 'traefik' | 'tls' | 'engine' | 'health' | 'traffic' | 'security';
  serviceLabel: string;
  level: 'info' | 'warn' | 'error' | 'success';
  message: string;
  meta?: {
    statusCode?: number;
    ttfb?: string;
    ip?: string;
    method?: 'GET' | 'POST' | 'HEAD';
    path?: string;
    bytes?: string;
    cache?: 'HIT' | 'MISS' | 'BYPASS';
  };
}

export const generateContainerLogs = (container: ContainerSite): ContainerLogEntry[] => {
  const shortId = `pod-${container.id.slice(0, 8)}`;
  const subdomain = container.subdomain;
  const isShop = container.category === 'business';

  const baseLogs: Omit<ContainerLogEntry, 'lineNum'>[] = [
    {
      id: 'log-1',
      timestamp: '19:20:11.204',
      service: 'system',
      serviceLabel: 'system-init',
      level: 'info',
      message: `Spawning isolated Linux cgroups v2 namespace for tenant [${shortId}]`
    },
    {
      id: 'log-2',
      timestamp: '19:20:11.580',
      service: 'docker',
      serviceLabel: 'docker-daemon',
      level: 'info',
      message: `Container sandbox initialized (CPU quota: 50000/100000 [${container.cpuLimit}], RAM limit: ${container.ramLimit}MB, OOM score: -998)`
    },
    {
      id: 'log-3',
      timestamp: '19:20:12.018',
      service: 'system',
      serviceLabel: 'storage-driver',
      level: 'info',
      message: 'Mounted ext4 overlay2 layer (isolated rootfs + tmpfs /tmp 64MB in-memory)'
    },
    {
      id: 'log-4',
      timestamp: '19:20:13.142',
      service: 'traefik',
      serviceLabel: 'traefik-proxy',
      level: 'success',
      message: `Ingress router attached: Host(\`${subdomain}\`) -> upstream pod target 127.0.0.1:8080`
    },
    {
      id: 'log-5',
      timestamp: '19:20:14.055',
      service: 'tls',
      serviceLabel: 'lets-encrypt',
      level: 'success',
      message: 'Wildcard ACME TLS-ALPN-01 verified. TLS 1.3 certificate auto-renewed (valid until 2027)'
    },
    {
      id: 'log-6',
      timestamp: '19:20:15.310',
      service: 'engine',
      serviceLabel: 'runtime-engine',
      level: 'info',
      message: 'HeroCMS Static/SSR Worker spawned (HTTP/2 & HTTP/3 QUIC listener on 0.0.0.0:8080)'
    },
    {
      id: 'log-7',
      timestamp: '19:21:02.881',
      service: 'health',
      serviceLabel: 'healthcheck',
      level: 'success',
      message: 'Internal probe HTTP 127.0.0.1:8080/healthz returned status 200 OK (latency: 0.4ms)'
    },
    {
      id: 'log-8',
      timestamp: '19:22:04.119',
      service: 'traffic',
      serviceLabel: 'edge-inbound',
      level: 'info',
      message: 'GET / 200 OK (TTFB: 0.8ms, 14.2KB) - Client IP: 103.144.20.12 - Cache: HIT - TLS 1.3',
      meta: {
        method: 'GET',
        path: '/',
        statusCode: 200,
        ttfb: '0.8ms',
        ip: '103.144.20.12',
        bytes: '14.2KB',
        cache: 'HIT'
      }
    },
    {
      id: 'log-9',
      timestamp: '19:22:18.420',
      service: 'traffic',
      serviceLabel: 'edge-inbound',
      level: 'info',
      message: `GET ${isShop ? '/catalog' : '/blog'} 200 OK (TTFB: 1.1ms, 8.4KB) - Client IP: 180.252.164.71 - Cache: HIT`,
      meta: {
        method: 'GET',
        path: isShop ? '/catalog' : '/blog',
        statusCode: 200,
        ttfb: '1.1ms',
        ip: '180.252.164.71',
        bytes: '8.4KB',
        cache: 'HIT'
      }
    },
    {
      id: 'log-10',
      timestamp: '19:23:45.012',
      service: 'security',
      serviceLabel: 'shield-check',
      level: 'info',
      message: 'Rate-limiting window evaluated: 120 req/s threshold clean • 0 bot anomalies intercepted'
    },
    {
      id: 'log-11',
      timestamp: '19:24:19.330',
      service: 'traffic',
      serviceLabel: 'edge-inbound',
      level: 'info',
      message: 'GET /sitemap.xml 200 OK (TTFB: 12.4ms, 3.1KB) - Googlebot Crawler - Cache: MISS',
      meta: {
        method: 'GET',
        path: '/sitemap.xml',
        statusCode: 200,
        ttfb: '12.4ms',
        ip: '34.120.89.14',
        bytes: '3.1KB',
        cache: 'MISS'
      }
    },
    {
      id: 'log-12',
      timestamp: '19:24:52.110',
      service: 'engine',
      serviceLabel: 'cache-cleaner',
      level: 'info',
      message: 'Edge in-memory cache sync completed: 48 items validated, memory consumption steady at 78MB'
    },
    {
      id: 'log-13',
      timestamp: '19:25:01.884',
      service: 'traffic',
      serviceLabel: 'edge-inbound',
      level: 'info',
      message: `GET ${isShop ? '/checkout' : '/contact'} 200 OK (TTFB: 1.4ms) - Client IP: 202.80.212.44 - Cache: BYPASS`,
      meta: {
        method: 'GET',
        path: isShop ? '/checkout' : '/contact',
        statusCode: 200,
        ttfb: '1.4ms',
        ip: '202.80.212.44',
        cache: 'BYPASS'
      }
    },
    {
      id: 'log-14',
      timestamp: '19:25:40.501',
      service: 'traffic',
      serviceLabel: 'edge-inbound',
      level: 'info',
      message: 'GET /api/telemetry 204 No Content - Fast-path telemetry event published',
      meta: {
        method: 'GET',
        path: '/api/telemetry',
        statusCode: 204,
        ttfb: '0.9ms'
      }
    },
    {
      id: 'log-15',
      timestamp: '19:26:10.009',
      service: 'health',
      serviceLabel: 'healthcheck',
      level: 'success',
      message: `Periodic keep-alive probe: container healthy (Uptime: ${container.uptime}, RAM: ${container.ramUsage}MB / ${container.ramLimit}MB)`
    }
  ];

  return baseLogs.map((log, index) => ({
    ...log,
    lineNum: index + 1
  }));
};
