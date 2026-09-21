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
  | 'invoices'
  | 'tickets';

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
  themeConfig?: Record<string, any>;
}

export interface VisualBlock {
  id: string;
  type:
    | 'navbar'
    | 'hero'
    | 'features'
    | 'showcase'
    | 'pricing'
    | 'testimonials'
    | 'cta'
    | 'contact'
    | 'footer'
    | 'progressbar'
    | 'carousel'
    | 'accordion'
    | 'formcontrol'
    | 'modal'
    | 'pagination'
    | 'dropdown'
    | 'card'
    | 'listgroup'
    | 'stats'
    | 'breadcrumb';
  name: string;
  badge?: string;
  title: string;
  subtitle?: string;
  content?: string;
  buttonText?: string;
  buttonUrl?: string;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
  imageUrl?: string;
  isVisible: boolean;
  isLocked: boolean;
  isOpen?: boolean;
  activeItemIndex?: number;
  items?: Array<{
    id: string;
    title: string;
    desc?: string;
    icon?: string;
    image?: string;
    tag?: string;
    price?: string;
    period?: string;
    features?: string[];
    author?: string;
    role?: string;
    avatar?: string;
    percentage?: number;
    active?: boolean;
    status?: string;
    label?: string;
    url?: string;
  }>;
  styles?: {
    paddingY?: number;
    align?: 'left' | 'center' | 'right';
    bgMode?: 'transparent' | 'solid' | 'gradient' | 'glass';
    bgColor?: string;
    textColor?: string;
    accentColor?: string;
    borderRadius?: number;
    shadow?: 'none' | 'sm' | 'md' | 'lg' | 'glow';
    backdropBlur?: number;
    fontFamily?: string;
    fontWeight?: '300' | '400' | '500' | '600' | '700' | '800' | '900' | string;
    fontSize?: number;
    letterSpacing?: number;
    textTransform?: 'none' | 'uppercase' | 'capitalize' | 'lowercase';
    animation?: 'none' | 'fadeInUp' | 'slideInLeft' | 'zoomIn' | 'bounce' | 'pulseGlow' | 'float';
    animationDuration?: number;
    animationDelay?: number;
    richContent?: string;
  };
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

export interface TicketMessage {
  id: string;
  sender: 'tenant' | 'support';
  authorName: string;
  authorRole: string;
  timestamp: string;
  message: string;
}

export interface SupportTicketItem {
  id: string;
  subject: string;
  category: 'Infrastructure & Container' | 'Edge Proxy & DNS' | 'Visual Editor' | 'Billing & Pajak' | 'API & Webhooks' | 'General';
  priority: 'p1_urgent' | 'p2_high' | 'p3_normal';
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
  lastUpdated: string;
  assignedEngineer?: string;
  messages: TicketMessage[];
}
