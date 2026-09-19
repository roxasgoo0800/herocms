// HeroCMS Studio - Unified Dashboard Types

export type ActiveMenu =
  | 'containers'
  | 'editor'
  | 'content'
  | 'media'
  | 'templates'
  | 'domains'
  | 'analytics'
  | 'webhooks'
  | 'billing'
  | 'invoices';

export interface UserPlan {
  name: string;
  price: string;
  maxContainers: number;
  cpuPerContainer: string;
  ramPerContainer: string;
  storageQuota: string;
}

export interface ContainerSite {
  id: string;
  name: string;
  category: 'portfolio' | 'blog' | 'education' | 'business';
  templateName: string;
  subdomain: string;
  customDomain?: string;
  status: 'running' | 'stopped' | 'provisioning';
  cpuUsage: number;
  ramUsage: number;
  ramLimit: number;
  cpuLimit: string;
  uptime: string;
  visitsThisWeek: number;
  ssl: boolean;
  roleOrHeadline: string;
  bioIntro: string;
  accentColor: string;
  lastDeployed: string;
}

export interface ContentArticle {
  id: string;
  title: string;
  slug: string;
  siteName: string;
  containerId: string;
  category: string;
  author: string;
  views: number;
  status: 'published' | 'draft';
  publishedAt: string;
}

export interface MediaAssetItem {
  id: string;
  name: string;
  size: string;
  type: string;
  dimensions: string;
  uploadedAt: string;
  url: string;
}

export interface CustomDomainItem {
  id: string;
  domain: string;
  targetContainer: string;
  containerId: string;
  status: 'active' | 'pending_dns' | 'verifying';
  sslStatus: 'issued' | 'pending';
  cnameRecord: string;
  aRecord: string;
  addedDate: string;
}

export interface WebhookItem {
  id: string;
  name: string;
  url: string;
  events: string[];
  status: 'active' | 'paused';
  lastTriggered: string;
}

export interface InvoiceItem {
  id: string;
  date: string;
  dueDate: string;
  planName: string;
  period: string;
  amount: number;
  tax: number;
  total: number;
  status: 'paid' | 'pending' | 'failed';
  paymentMethod: string;
  containerQuota: number;
}

export interface ToastMessage {
  text: string;
  type: 'success' | 'info' | 'error';
}
