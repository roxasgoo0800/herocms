// Aether Core Stack Studio - Unified Dashboard Types

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
  | 'tickets'
  | 'changelog';

export interface UserPlan {
  name: string;
  price: string;
  maxContainers: number;
  cpuPerContainer: string;
  ramPerContainer: string;
  storageQuota: string;
}

export interface SubscriptionPlanCatalogItem {
  id: 'starter' | 'pro' | 'agency';
  name: string;
  badge: string;
  isPopular?: boolean;
  priceMonthly: number;
  priceAnnualMonthly: number;
  priceMonthlyFormatted: string;
  priceAnnualFormatted: string;
  containers: number;
  ram: string;
  cpu: string;
  storage: string;
  tagline: string;
  features: string[];
}

export interface ContainerSite {
  id: string;
  name: string;
  category: 'portfolio' | 'blog' | 'education' | 'business';
  templateName: string;
  subdomain: string;
  customDomain?: string;
  containerId?: string;
  status: 'running' | 'stopped' | 'provisioning' | 'maintenance' | 'building' | 'deploying';
  deployPhase?: 'building' | 'deploying' | 'routing' | 'running';
  deployStep?: number;
  deployStepMessage?: string;
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
  maintenanceConfig?: {
    enabled: boolean;
    message?: string;
    estimatedEndTime?: string;
  };
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
    | 'breadcrumb'
    | 'marquee';
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
    buttonRadius?: number;
    buttonStyle?: 'solid' | 'outline' | 'glow' | 'pill';
    buttonColor?: string;
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
    animation?: 'none' | 'fadeInUp' | 'slideInLeft' | 'zoomIn' | 'bounce' | 'pulseGlow' | 'float' | 'blurFade' | 'springPop' | 'tiltIn';
    animationDuration?: number;
    animationDelay?: number;
    richContent?: string;
    buttonRadius?: number;
    buttonStyle?: 'solid' | 'outline' | 'glow' | 'pill';
    buttonColor?: string;
    secondaryButtonRadius?: number;
    secondaryButtonStyle?: 'solid' | 'outline' | 'glow' | 'pill';
    secondaryButtonColor?: string;
    cardStyle?: 'default' | 'flat' | 'bordered' | 'glass' | 'glow';
    cardColumns?: 2 | 3 | 4;
    cardOrientation?: 'vertical' | 'horizontal';
    cardRadius?: number;
    bgPattern?: 'none' | 'dots' | 'grid' | 'mesh';
    shapeDivider?: 'none' | 'wave' | 'tilt' | 'curve';
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
  excerpt?: string;
  coverImage?: string;
  content?: string;
  tags?: string[];
  metaTitle?: string;
  metaDesc?: string;
}

export interface CmsPage {
  id: string;
  title: string;
  path: string;
  siteName: string;
  containerId: string;
  templateLayout: string;
  status: 'published' | 'draft';
  updatedAt: string;
  isInNavbar: boolean;
  isInFooter: boolean;
  metaTitle?: string;
  metaDesc?: string;
  content?: string;
}

export interface MediaAssetItem {
  id: string;
  name: string;
  size: string;
  sizeBytes?: number;
  type: string;
  dimensions: string;
  uploadedAt: string;
  url: string;
  bucketName?: string;
  s3Key?: string;
  mimeType?: string;
  sha256?: string;
  etag?: string;
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

export type PatScopeCategory = 'content' | 'leads' | 'media' | 'telemetry' | 'tickets';

export interface PatScopeDefinition {
  id: string;
  name: string;
  category: PatScopeCategory;
  categoryLabel: string;
  action: 'read' | 'write' | 'upload';
  description: string;
}

export interface PersonalAccessToken {
  id: string;
  name: string;
  tokenPrefix: string;
  tokenMasked: string;
  rawToken?: string;
  scopes: string[];
  createdAt: string;
  expiresAt: string;
  lastUsedAt: string;
  status: 'active' | 'revoked' | 'expired';
}

export interface WebhookItem {
  id: string;
  name: string;
  url: string;
  secretKey?: string;
  events: string[];
  status: 'active' | 'paused';
  lastTriggered: string;
}

export interface WebhookDeliveryLog {
  id: string;
  webhookId: string;
  webhookName: string;
  targetUrl?: string;
  event: string;
  statusCode: number;
  durationMs: number;
  timestamp: string;
  status: 'success' | 'failed';
  requestHeaders?: Record<string, string>;
  requestPayload?: any;
  responseBody?: string;
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

export interface TicketAttachment {
  id: string;
  name: string;
  size: string;
  dataUrl: string;
  mimeType?: string;
}

export interface TicketMessage {
  id: string;
  sender: 'tenant' | 'support';
  authorName: string;
  authorRole: string;
  authorEmail?: string;
  timestamp: string;
  message: string;
  attachments?: TicketAttachment[];
  deliveryStatus?: 'sent' | 'delivered' | 'read';
  readAt?: string;
}

export type SupportDepartment =
  | 'Customer Support & Layanan CMS'
  | 'Technical & Container (DevOps)'
  | 'Billing, Paket & Faktur'
  | 'Domain, DNS & Keamanan SSL';

export interface SupportTicketItem {
  id: string;
  subject: string;
  department?: SupportDepartment | string;
  category: string;
  containerName?: string;
  reporterName?: string;
  reporterEmail?: string;
  priority?: 'p1_urgent' | 'p2_high' | 'p3_normal';
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
  lastUpdated: string;
  assignedEngineer?: string;
  assignedRole?: string;
  messages: TicketMessage[];
}

export type ChangelogType = 'feature' | 'improvement' | 'bugfix' | 'security' | 'performance';

export interface ChangelogItem {
  id: string;
  type: ChangelogType;
  scope: string;
  description: string;
}

export interface ChangelogRelease {
  version: string;
  releaseDate: string;
  title: string;
  summary: string;
  service?: string;
  serviceName?: string;
  badge?: 'Latest' | 'Stable' | 'LTS';
  items: ChangelogItem[];
  author: string;
}

export interface MicroserviceVersion {
  id: string;
  name: string;
  version: string;
  serviceFolder: string;
  badge: 'Latest' | 'Stable' | 'Active';
  stack: string;
  lastUpdated: string;
  leadPic: string;
}
