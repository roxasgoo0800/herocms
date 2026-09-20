/**
 * HeroCMS Studio API Client
 * Berkomunikasi dengan Go Backend & BFF (:8085 / Vite Proxy /api)
 * Dilengkapi dengan PWA Cookie Support & Proteksi CSRF (Double Submit Cookie)
 */

const API_BASE = '/api';

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
  return match ? decodeURIComponent(match[3]) : null;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status?: number;
}

export async function apiFetch<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('cloudcms_auth_token');
  const csrfToken = getCookie('csrf_token') || localStorage.getItem('cloudcms_csrf_token');
  const method = (options.method || 'GET').toUpperCase();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Sertakan Header X-CSRF-Token untuk seluruh request mutasi (POST, PUT, DELETE, PATCH)
  if (csrfToken && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    headers['X-CSRF-Token'] = csrfToken;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    credentials: 'include', // Mengizinkan pengiriman HTTP-Only Session Cookies untuk PWA
    headers
  });

  // Perbarui token CSRF jika server menyertakan header baru
  const serverCsrf = res.headers.get('X-CSRF-Token');
  if (serverCsrf) {
    localStorage.setItem('cloudcms_csrf_token', serverCsrf);
  }

  if (!res.ok) {
    if (res.status === 401) {
      console.warn('[AUTH] Sesi tidak valid atau telah kedaluwarsa.');
    }
    const errJson = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(errJson.error || errJson.message || `HTTP ${res.status}`);
  }

  const json = await res.json();
  if (json?.csrf_token) {
    localStorage.setItem('cloudcms_csrf_token', json.csrf_token);
  }
  return json;
}

export const studioApi = {
  // Auth
  login: (email: string, password: string) =>
    apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (fullName: string, email: string, password: string) =>
    apiFetch('/auth/register', { method: 'POST', body: JSON.stringify({ full_name: fullName, email, password }) }),
  getMe: () => apiFetch('/auth/me'),
  logout: () => apiFetch('/auth/logout', { method: 'POST' }),
  getUserState: () => apiFetch('/user/state'),
  saveUserState: (state: any) => apiFetch('/user/state', { method: 'PUT', body: JSON.stringify(state) }),

  // Containers
  getContainers: () => apiFetch('/containers'),
  createContainer: (payload: { name: string; subdomain: string; category?: string; role?: string }) =>
    apiFetch('/containers', { method: 'POST', body: JSON.stringify(payload) }),
  saveSiteDesign: (id: string, payload: any) =>
    apiFetch(`/containers/${id}/design`, { method: 'PUT', body: JSON.stringify(payload) }),
  getEditorDraft: (id: string) => apiFetch(`/containers/${id}/draft`),
  saveEditorDraft: (id: string, draft: any) =>
    apiFetch(`/containers/${id}/draft`, { method: 'PUT', body: JSON.stringify(draft) }),
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
  checkoutPlan: (planTier: string, paymentMethod: string) =>
    apiFetch('/billing/checkout', { method: 'POST', body: JSON.stringify({ plan_tier: planTier, payment_method: paymentMethod }) }),

  // Webhooks
  getWebhooks: () => apiFetch('/webhooks'),

  // Real-time Analytics (Redis ZSET)
  getTopViews: () => apiFetch('/analytics/top-views'),
  recordHit: (path: string) => apiFetch('/analytics/hit', { method: 'POST', body: JSON.stringify({ path }) }),

  // Redis Cache Warming & Pre-fetch
  warmAllMenusCache: () => apiFetch('/cache/warm', { method: 'GET' }),

  // System Health
  getHealth: () => apiFetch('/healthz')
};
