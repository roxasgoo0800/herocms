/**
 * HeroCMS Studio API Client
 * Berkomunikasi dengan Go Backend & BFF (:8085 / Vite Proxy /api)
 */

const API_BASE = '/api';

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status?: number;
}

export async function apiFetch<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('cloudcms_auth_token');

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  if (!res.ok) {
    if (res.status === 401) {
      console.warn('[AUTH] Sesi tidak valid atau telah kedaluwarsa.');
    }
    const errJson = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(errJson.error || errJson.message || `HTTP ${res.status}`);
  }

  return res.json();
}

export const studioApi = {
  // Auth
  login: (email: string, password: string) =>
    apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  getMe: () => apiFetch('/auth/me'),
  logout: () => apiFetch('/auth/logout', { method: 'POST' }),

  // Containers
  getContainers: () => apiFetch('/containers'),
  createContainer: (payload: { name: string; subdomain: string; category?: string; role?: string }) =>
    apiFetch('/containers', { method: 'POST', body: JSON.stringify(payload) }),
  startContainer: (id: string) => apiFetch(`/containers/${id}/start`, { method: 'POST' }),
  stopContainer: (id: string) => apiFetch(`/containers/${id}/stop`, { method: 'POST' }),
  deleteContainer: (id: string) => apiFetch(`/containers/${id}`, { method: 'DELETE' }),

  // Articles
  getArticles: () => apiFetch('/articles'),

  // Assets
  getAssets: () => apiFetch('/assets'),

  // Domains
  getDomains: () => apiFetch('/domains'),

  // Tickets
  getTickets: () => apiFetch('/tickets'),
  getTicketMessages: (id: string) => apiFetch(`/tickets/${id}/messages`),

  // Invoices & Billing
  getInvoices: () => apiFetch('/invoices'),
  getBillingQuota: () => apiFetch('/billing/quota'),

  // Webhooks
  getWebhooks: () => apiFetch('/webhooks'),

  // Real-time Analytics (Redis ZSET)
  getTopViews: () => apiFetch('/analytics/top-views'),
  recordHit: (path: string) => apiFetch('/analytics/hit', { method: 'POST', body: JSON.stringify({ path }) }),

  // System Health
  getHealth: () => apiFetch('/healthz')
};
