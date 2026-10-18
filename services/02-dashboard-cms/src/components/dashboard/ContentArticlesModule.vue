<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import {
  FileText,
  Check,
  Activity,
  Search,
  Eye,
  Calendar,
  Globe,
  LayoutGrid,
  List,
  Clock,
  Zap,
  Copy,
  X,
  BookOpen,
  Edit3,
  ChevronDown,
  ArrowLeft,
  ChevronRight,
  Server,
  Plus,
  Trash2,
  Layers,
  Compass,
  Terminal,
  Network,
  GitBranch,
  ShieldCheck,
  Cpu,
  ArrowUpRight,
  Lock
} from 'lucide-vue-next';
import { useDashboardData } from '../../composables/useDashboardData';
import type { ContentArticle, CmsPage } from '../../types/dashboard';

const {
  articles,
  cmsPages,
  containers,
  activeArticleForReader,
  getArticleLiveUrl,
  copyToClipboard,
  copiedSubdomain,
  saveArticle,
  deleteArticle,
  saveCmsPage,
  deleteCmsPage
} = useDashboardData();

// -------------------------------------------------------------
// Tab Switcher State: 'articles' vs 'pages'
// -------------------------------------------------------------
const activeContentTab = ref<'articles' | 'pages'>('articles');

// -------------------------------------------------------------
// Search & Filter State
// -------------------------------------------------------------
const searchQuery = ref('');
const debouncedQuery = ref('');
let searchTimer: ReturnType<typeof setTimeout> | null = null;

watch(searchQuery, (val) => {
  if (!val.trim()) {
    debouncedQuery.value = '';
    if (searchTimer) clearTimeout(searchTimer);
    return;
  }
  if (searchTimer) clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    debouncedQuery.value = val;
  }, 120);
});

const selectedCategory = ref('all');
const selectedLayout = ref('all');
const selectedStatus = ref('all');
const viewMode = ref<'grid' | 'table'>('grid');
const searchInputRef = ref<HTMLInputElement | null>(null);

// Dropdown Toggles
const isCategoryDropdownOpen = ref(false);
const isLayoutDropdownOpen = ref(false);
const isStatusDropdownOpen = ref(false);

const categoryOptions = [
  { value: 'all', label: 'Semua Kategori' },
  { value: 'Engineering', label: 'Engineering' },
  { value: 'Distributed Systems', label: 'Distributed Systems' },
  { value: 'DevOps', label: 'DevOps' },
  { value: 'Security', label: 'Security' },
  { value: 'Tutorial', label: 'Tutorial' }
];

const layoutOptions = [
  { value: 'all', label: 'Semua Template' },
  { value: 'landing-page', label: 'Landing Page' },
  { value: 'standard-prose', label: 'Standard Prose / Doc' },
  { value: 'compact-form', label: 'Contact / Form' },
  { value: 'legal-document', label: 'Legal Document' }
];

const statusOptions = [
  { value: 'all', label: 'Semua Status' },
  { value: 'published', label: 'Published (Live)' },
  { value: 'draft', label: 'Draft (WIP)' }
];

// -------------------------------------------------------------
// Filtered Computations
// -------------------------------------------------------------
const filteredArticles = computed(() => {
  return articles.value.filter(art => {
    const q = debouncedQuery.value.toLowerCase().trim();
    const matchesSearch = !q ||
      art.title.toLowerCase().includes(q) ||
      art.slug.toLowerCase().includes(q) ||
      art.category.toLowerCase().includes(q) ||
      art.author.toLowerCase().includes(q) ||
      art.siteName.toLowerCase().includes(q) ||
      (art.excerpt && art.excerpt.toLowerCase().includes(q));
    if (!matchesSearch) return false;
    if (selectedCategory.value !== 'all' && art.category !== selectedCategory.value) return false;
    if (selectedStatus.value !== 'all' && art.status !== selectedStatus.value) return false;
    return true;
  });
});

const filteredPages = computed(() => {
  return cmsPages.value.filter(page => {
    const q = debouncedQuery.value.toLowerCase().trim();
    const matchesSearch = !q ||
      page.title.toLowerCase().includes(q) ||
      page.path.toLowerCase().includes(q) ||
      page.templateLayout.toLowerCase().includes(q) ||
      page.siteName.toLowerCase().includes(q);
    if (!matchesSearch) return false;
    if (selectedLayout.value !== 'all' && page.templateLayout !== selectedLayout.value) return false;
    if (selectedStatus.value !== 'all' && page.status !== selectedStatus.value) return false;
    return true;
  });
});

// Helper Read Time
const getReadTime = (title: string) => {
  const words = title.length * 15;
  const mins = Math.max(3, Math.round(words / 150));
  return `${mins} min baca`;
};

const getCategoryThemeClass = (cat: string) => {
  if (cat === 'Engineering') return 'editorial-theme-engineering';
  if (cat === 'Distributed Systems') return 'editorial-theme-distributed';
  if (cat === 'DevOps') return 'editorial-theme-devops';
  if (cat === 'Security') return 'editorial-theme-security';
  if (cat === 'Tutorial') return 'editorial-theme-tutorial';
  return 'editorial-theme-default';
};

const getCategoryBadgeColor = (cat: string) => {
  if (cat === 'Engineering') return 'cyan';
  if (cat === 'Distributed Systems') return 'purple';
  if (cat === 'DevOps') return 'emerald';
  if (cat === 'Security') return 'rose';
  if (cat === 'Tutorial') return 'amber';
  return 'blue';
};

const getCategoryIconComponent = (cat: string) => {
  if (cat === 'Engineering') return Terminal;
  if (cat === 'Distributed Systems') return Network;
  if (cat === 'DevOps') return GitBranch;
  if (cat === 'Security') return ShieldCheck;
  if (cat === 'Tutorial') return BookOpen;
  return Cpu;
};

const getCategoryTelemetryTag = (cat: string) => {
  if (cat === 'Engineering') return 'Kernel cgroups v2';
  if (cat === 'Distributed Systems') return 'Kafka • Redis ZSET';
  if (cat === 'DevOps') return 'Traefik v3 • 1.8ms TTFB';
  if (cat === 'Security') return 'WAF • TLS 1.3 ALPN';
  if (cat === 'Tutorial') return 'Headless Architecture';
  return 'Cloud-Native Edge';
};

// -------------------------------------------------------------
// CMS Pages Blueprint Archetypes & Color Mapping
// -------------------------------------------------------------
const getPageArchetype = (path: string, layout: string) => {
  const p = (path || '').toLowerCase();
  const l = (layout || '').toLowerCase();
  if (p === '/' || l.includes('hero') || l.includes('landing') || l.includes('beranda')) return 'landing';
  if (p === '/about' || l.includes('profile') || l.includes('bio') || l.includes('tentang')) return 'about';
  if (p === '/services' || l.includes('service') || l.includes('catalog') || l.includes('solution') || l.includes('layanan')) return 'services';
  if (p === '/contact' || l.includes('form') || l.includes('inquiry') || l.includes('kontak')) return 'contact';
  if (p.includes('privacy') || p.includes('terms') || l.includes('legal') || l.includes('compliance') || l.includes('privasi')) return 'legal';
  return 'default';
};

const getPageLayoutColor = (path: string, layout: string) => {
  const arc = getPageArchetype(path, layout);
  if (arc === 'landing') return 'blue';
  if (arc === 'about') return 'indigo';
  if (arc === 'services') return 'emerald';
  if (arc === 'contact') return 'amber';
  if (arc === 'legal') return 'slate';
  return 'blue';
};

// -------------------------------------------------------------
// Reader Navigation State
// -------------------------------------------------------------
const openArticleReader = (art: ContentArticle) => {
  activeArticleForReader.value = art;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const closeArticleReader = () => {
  activeArticleForReader.value = null;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const copyCodeSnippet = () => {
  const snippet = `func RecordArticleHit(ctx context.Context, slug string) error {
    return redisClient.ZIncrBy(ctx, "herocms:articles:views", 1.0, slug).Err()
}`;
  copyToClipboard(snippet, 'code_snippet');
};

const currentArticleIndex = computed(() => {
  if (!activeArticleForReader.value) return -1;
  return articles.value.findIndex(a => a.id === activeArticleForReader.value?.id);
});

const prevArticle = computed(() => {
  if (currentArticleIndex.value <= 0) return null;
  return articles.value[currentArticleIndex.value - 1];
});

const nextArticle = computed(() => {
  if (currentArticleIndex.value === -1 || currentArticleIndex.value >= articles.value.length - 1) return null;
  return articles.value[currentArticleIndex.value + 1];
});

// -------------------------------------------------------------
// Content Editor Modal State (Universal for Articles & Pages)
// -------------------------------------------------------------
const isEditorModalOpen = ref(false);
const editorContentType = ref<'article' | 'page'>('article');
const editingId = ref<string | null>(null);

// Form Fields
const formTitle = ref('');
const formSlug = ref('');
const formPath = ref('/');
const formContainerId = ref('');
const formCategory = ref('Engineering');
const formAuthor = ref('Rizal Pratama');
const formStatus = ref<'published' | 'draft'>('published');
const formExcerpt = ref('');
const formTags = ref('');
const formTemplateLayout = ref('standard-prose');
const formIsInNavbar = ref(false);
const formIsInFooter = ref(false);
const formMetaTitle = ref('');
const formMetaDesc = ref('');
const formContent = ref('');

// Auto Slugify Helper
const slugify = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
};

const handleTitleInput = () => {
  if (!editingId.value) {
    const slug = slugify(formTitle.value);
    if (editorContentType.value === 'article') {
      formSlug.value = slug;
    } else {
      formPath.value = slug ? `/${slug}` : '/';
    }
  }
};

const openCreateArticleModal = () => {
  editorContentType.value = 'article';
  editingId.value = null;
  formTitle.value = '';
  formSlug.value = '';
  formContainerId.value = containers.value[0]?.id || 'cnt-01';
  formCategory.value = 'Engineering';
  formAuthor.value = 'Rizal Pratama';
  formStatus.value = 'published';
  formExcerpt.value = '';
  formTags.value = 'HeroCMS, CloudNative, Edge';
  formMetaTitle.value = '';
  formMetaDesc.value = '';
  formContent.value = `## Pengantar Artikel\n\nTulis konten artikel teknis Anda di sini menggunakan format Markdown yang bersih dan terstruktur.\n\n### Sub-topik Utama\n\nPenjelasan detail arsitektur, implementasi kode, atau panduan konfigurasi sistem.`;
  isEditorModalOpen.value = true;
};

const openEditArticleModal = (art: ContentArticle) => {
  editorContentType.value = 'article';
  editingId.value = art.id;
  formTitle.value = art.title;
  formSlug.value = art.slug;
  formContainerId.value = art.containerId;
  formCategory.value = art.category;
  formAuthor.value = art.author;
  formStatus.value = art.status;
  formExcerpt.value = art.excerpt || '';
  formTags.value = art.tags ? art.tags.join(', ') : 'HeroCMS, Edge';
  formMetaTitle.value = art.metaTitle || art.title;
  formMetaDesc.value = art.metaDesc || (art.excerpt || '');
  formContent.value = art.content || `## ${art.title}\n\nKonten artikel disunting melalui HeroCMS Content Studio.`;
  isEditorModalOpen.value = true;
};

const openCreatePageModal = () => {
  editorContentType.value = 'page';
  editingId.value = null;
  formTitle.value = '';
  formPath.value = '/';
  formContainerId.value = containers.value[0]?.id || 'cnt-01';
  formTemplateLayout.value = 'standard-prose';
  formStatus.value = 'published';
  formIsInNavbar.value = true;
  formIsInFooter.value = true;
  formMetaTitle.value = '';
  formMetaDesc.value = '';
  formContent.value = `# Halaman Baru\n\nKonten halaman statis website Anda. Di-render dengan kecepatan instan via Nginx Alpine & Traefik v3.`;
  isEditorModalOpen.value = true;
};

const openEditPageModal = (page: CmsPage) => {
  editorContentType.value = 'page';
  editingId.value = page.id;
  formTitle.value = page.title;
  formPath.value = page.path;
  formContainerId.value = page.containerId;
  formTemplateLayout.value = page.templateLayout;
  formStatus.value = page.status;
  formIsInNavbar.value = page.isInNavbar;
  formIsInFooter.value = page.isInFooter;
  formMetaTitle.value = page.metaTitle || page.title;
  formMetaDesc.value = page.metaDesc || '';
  formContent.value = page.content || `# ${page.title}\n\nIsi konten halaman statis website.`;
  isEditorModalOpen.value = true;
};

const closeEditorModal = () => {
  isEditorModalOpen.value = false;
  editingId.value = null;
};

const handleSaveContent = () => {
  if (!formTitle.value.trim()) {
    alert('Judul konten wajib diisi.');
    return;
  }

  const selectedSite = containers.value.find(c => c.id === formContainerId.value);
  const siteName = selectedSite ? (selectedSite.customDomain || selectedSite.subdomain) : 'rizalpratama.cloud';

  if (editorContentType.value === 'article') {
    const finalSlug = formSlug.value.trim() || slugify(formTitle.value);
    const tagArray = formTags.value
      .split(',')
      .map(t => t.trim())
      .filter(t => Boolean(t));

    const articlePayload: ContentArticle = {
      id: editingId.value || `art-${Date.now()}`,
      title: formTitle.value.trim(),
      slug: finalSlug,
      siteName,
      containerId: formContainerId.value,
      category: formCategory.value,
      author: formAuthor.value.trim() || 'Rizal Pratama',
      views: editingId.value ? (articles.value.find(a => a.id === editingId.value)?.views || 100) : 0,
      status: formStatus.value,
      publishedAt: editingId.value
        ? (articles.value.find(a => a.id === editingId.value)?.publishedAt || 'Baru Saja')
        : 'Baru Saja',
      excerpt: formExcerpt.value.trim() || formTitle.value.trim(),
      tags: tagArray,
      metaTitle: formMetaTitle.value.trim() || formTitle.value.trim(),
      metaDesc: formMetaDesc.value.trim() || formExcerpt.value.trim(),
      content: formContent.value
    };

    saveArticle(articlePayload);

    // If currently reading this article, update the active reader state
    if (activeArticleForReader.value && activeArticleForReader.value.id === articlePayload.id) {
      activeArticleForReader.value = { ...articlePayload };
    }
  } else {
    let finalPath = formPath.value.trim();
    if (!finalPath.startsWith('/')) finalPath = `/${finalPath}`;

    const pagePayload: CmsPage = {
      id: editingId.value || `page-${Date.now()}`,
      title: formTitle.value.trim(),
      path: finalPath,
      siteName,
      containerId: formContainerId.value,
      templateLayout: formTemplateLayout.value,
      status: formStatus.value,
      updatedAt: 'Baru Saja',
      isInNavbar: formIsInNavbar.value,
      isInFooter: formIsInFooter.value,
      metaTitle: formMetaTitle.value.trim() || formTitle.value.trim(),
      metaDesc: formMetaDesc.value.trim(),
      content: formContent.value
    };

    saveCmsPage(pagePayload);
  }

  closeEditorModal();
};

const handleDropdownOutsideClick = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (!target.closest('.custom-filter-dropdown-wrap')) {
    isCategoryDropdownOpen.value = false;
    isLayoutDropdownOpen.value = false;
    isStatusDropdownOpen.value = false;
  }
};

const handleGlobalKeydown = (e: KeyboardEvent) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    if (activeArticleForReader.value) {
      activeArticleForReader.value = null;
    }
    setTimeout(() => {
      searchInputRef.value?.focus();
    }, 50);
  } else if (e.key === 'Escape') {
    if (isEditorModalOpen.value) {
      closeEditorModal();
    } else if (activeArticleForReader.value) {
      closeArticleReader();
    }
  }
};

onMounted(() => {
  document.addEventListener('click', handleDropdownOutsideClick);
  window.addEventListener('keydown', handleGlobalKeydown);
});

onUnmounted(() => {
  document.removeEventListener('click', handleDropdownOutsideClick);
  window.removeEventListener('keydown', handleGlobalKeydown);
});
</script>

<template>
  <section class="fade-in-section">
    <!-- ============================================================= -->
    <!-- 1. DEDICATED ARTICLE READER VIEW (DISTRACTION-FREE EDITORIAL) -->
    <!-- ============================================================= -->
    <div v-if="activeArticleForReader" class="article-reader-page">
      <!-- Reader Header Bar -->
      <div class="reader-header-nav-bar">
        <button class="btn-reader-back" @click="closeArticleReader()">
          <ArrowLeft :size="15" />
          <span>Kembali ke Studio Konten</span>
        </button>

        <div class="reader-header-nav-actions">
          <button
            class="btn-reader-action-secondary"
            @click="copyToClipboard(getArticleLiveUrl(activeArticleForReader), activeArticleForReader.id)"
            :title="copiedSubdomain === activeArticleForReader.id ? 'Tersalin!' : 'Salin URL Live'"
          >
            <Check v-if="copiedSubdomain === activeArticleForReader.id" :size="13" class="text-green" />
            <Copy v-else :size="13" />
            <span>{{ copiedSubdomain === activeArticleForReader.id ? 'URL Tersalin' : 'Salin URL' }}</span>
          </button>

          <button
            class="btn-reader-action-primary"
            @click="openEditArticleModal(activeArticleForReader)"
          >
            <Edit3 :size="13" />
            <span>Edit Artikel Ini</span>
          </button>
        </div>
      </div>

      <!-- Hero Header Editorial -->
      <div class="reader-editorial-hero">
        <div class="reader-hero-inner">
          <div class="reader-hero-badges">
            <span class="editorial-cat-chip">
              {{ activeArticleForReader.category.toUpperCase() }}
            </span>
            <span class="cover-read-time">
              <Clock :size="12" />
              <span>{{ getReadTime(activeArticleForReader.title) }}</span>
            </span>
            <span class="art-status-chip" :class="activeArticleForReader.status === 'published' ? 'chip-live' : 'chip-draft'">
              <span class="dot"></span>
              {{ activeArticleForReader.status === 'published' ? 'Published (Live CDN)' : 'Draft (WIP)' }}
            </span>
          </div>

          <h1 class="reader-page-title">{{ activeArticleForReader.title }}</h1>

          <p v-if="activeArticleForReader.excerpt" class="reader-hero-lead">
            {{ activeArticleForReader.excerpt }}
          </p>

          <div class="reader-hero-meta-row">
            <div class="reader-author-profile">
              <div class="author-avatar-large">RP</div>
              <div class="author-info-group">
                <div class="author-primary-name">{{ activeArticleForReader.author }}</div>
                <div class="author-secondary-sub">
                  <span>{{ activeArticleForReader.publishedAt }}</span>
                  <span class="sub-sep">•</span>
                  <span>{{ activeArticleForReader.siteName }}</span>
                </div>
              </div>
            </div>

            <div class="reader-hero-metrics-strip">
              <div class="hero-metric-item">
                <Eye :size="14" class="text-blue" />
                <span class="metric-num">{{ activeArticleForReader.views.toLocaleString('id-ID') }}</span>
                <span class="metric-label">Redis Views</span>
              </div>
              <div class="hero-metric-item">
                <Activity :size="14" class="text-green" />
                <span class="metric-num">1.8ms</span>
                <span class="metric-label">TTFB Traefik</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Reader Layout: 2 Columns -->
      <div class="reader-layout-grid">
        <!-- Content Column (Left, 72%) -->
        <article class="reader-main-content">
          <!-- Edge URL Callout -->
          <div class="reader-edge-callout">
            <div class="callout-icon-box">
              <Globe :size="16" />
            </div>
            <div class="callout-text-box">
              <span class="callout-title">Edge URL Publikasi Live:</span>
              <code class="callout-url">{{ getArticleLiveUrl(activeArticleForReader) }}</code>
            </div>
            <button
              class="btn-copy-callout"
              @click="copyToClipboard(getArticleLiveUrl(activeArticleForReader), activeArticleForReader.id)"
              :title="copiedSubdomain === activeArticleForReader.id ? 'Tersalin!' : 'Salin URL'"
            >
              <Check v-if="copiedSubdomain === activeArticleForReader.id" :size="13" class="text-green" />
              <Copy v-else :size="13" />
            </button>
          </div>

          <!-- Editorial Body -->
          <div class="reader-prose-body">
            <div class="reader-markdown-render">
              <p class="reader-lead-paragraph">
                {{ activeArticleForReader.excerpt || 'Dalam implementasi cloud-native modern, optimalisasi latensi edge Traefik v3 dan isolasi CPU cgroups v2 menjadi fondasi performa tinggi.' }}
              </p>

              <h2 id="sec-1">1. Arsitektur Isolasi Kernel Linux & Kontainer Nginx</h2>
              <p>
                Setiap tenant HeroCMS beroperasi di dalam sandbox Docker Alpine terisolasi mandiri. Batas memori hard-limit <code>256 MB</code> dan pembatasan alokasi CPU maksimum <code>0.5 vCPU</code> memastikan lonjakan beban pada satu tenant tidak mengganggu stabilitas tenant lain.
              </p>

              <div class="reader-info-callout">
                <div class="info-callout-icon"><Zap :size="16" /></div>
                <div class="info-callout-body">
                  <strong>Catatan Arsitektur:</strong> Traefik v3 membaca event Docker secara real-time via <code>/var/run/docker.sock</code>. Routing otomatis dibuat dalam hitungan milidetik tanpa reload Nginx master.
                </div>
              </div>

              <h2 id="sec-2">2. Telemetri Real-Time Non-Blocking Redis ZSET</h2>
              <p>
                Setiap request halaman dicatat secara asinkron ke Redis Sorted Sets (<code>ZSET</code>) menggunakan perintah atomik dengan latensi sub-millisecond:
              </p>

              <div class="reader-code-card">
                <div class="code-card-header">
                  <div class="code-header-left">
                    <span class="code-dot red"></span>
                    <span class="code-dot yellow"></span>
                    <span class="code-dot green"></span>
                    <span class="code-filename">internal/telemetry/redis_counter.go</span>
                  </div>
                  <button
                    class="btn-code-copy"
                    @click="copyCodeSnippet()"
                  >
                    <Check v-if="copiedSubdomain === 'code_snippet'" :size="12" class="text-green" />
                    <Copy v-else :size="12" />
                    <span>{{ copiedSubdomain === 'code_snippet' ? 'Tersalin' : 'Salin Kode' }}</span>
                  </button>
                </div>
                <pre class="code-pre"><code><span class="token-keyword">func</span> <span class="token-function">RecordArticleHit</span>(ctx context.Context, slug <span class="token-type">string</span>) <span class="token-type">error</span> {
    <span class="token-comment">// Atomic increment via Redis Sorted Set (ZSET) - Sub-millisecond latency</span>
    <span class="token-keyword">return</span> redisClient.<span class="token-function">ZIncrBy</span>(ctx, <span class="token-string">"herocms:articles:views"</span>, <span class="token-number">1.0</span>, slug).<span class="token-function">Err</span>()
}</code></pre>
              </div>

              <h2 id="sec-3">3. Optimasi Cache Header & TLS ALPN</h2>
              <p>
                Header <code>Cache-Control: public, max-age=31536000, immutable</code> diinjeksi pada file statis CSS, JS, dan WebP. Dokumen HTML di-cache di level edge Traefik dengan strategi <code>stale-while-revalidate</code>, memastikan TTFB konsisten di bawah 2ms.
              </p>

              <!-- Tags Cloud -->
              <div v-if="activeArticleForReader.tags && activeArticleForReader.tags.length" class="reader-article-tags">
                <span class="tag-lead">Topik Terkait:</span>
                <span
                  v-for="tag in activeArticleForReader.tags"
                  :key="tag"
                  class="reader-tag-chip"
                >
                  #{{ tag }}
                </span>
              </div>
            </div>
          </div>

          <!-- Bottom Navigation Pagination -->
          <div class="reader-pagination-bar">
            <button
              v-if="prevArticle"
              class="btn-pagination-nav prev"
              @click="openArticleReader(prevArticle)"
            >
              <ArrowLeft :size="14" />
              <div class="nav-text">
                <span class="nav-dir">Artikel Sebelumnya</span>
                <span class="nav-title">{{ prevArticle.title }}</span>
              </div>
            </button>
            <div v-else class="pagination-spacer"></div>

            <button
              v-if="nextArticle"
              class="btn-pagination-nav next"
              @click="openArticleReader(nextArticle)"
            >
              <div class="nav-text">
                <span class="nav-dir">Artikel Selanjutnya</span>
                <span class="nav-title">{{ nextArticle.title }}</span>
              </div>
              <ChevronRight :size="14" />
            </button>
          </div>
        </article>

        <!-- Sidebar Inspector (Right, 28%) -->
        <aside class="reader-sidebar-inspector">
          <!-- Metadata Card -->
          <div class="inspector-card">
            <h4 class="inspector-title">
              <Server :size="14" />
              <span>Spesifikasi Deployment</span>
            </h4>
            <div class="inspector-specs-list">
              <div class="spec-row">
                <span class="spec-k">Target Kontainer</span>
                <span class="spec-v">{{ activeArticleForReader.siteName }}</span>
              </div>
              <div class="spec-row">
                <span class="spec-k">Container ID</span>
                <code class="spec-code">{{ activeArticleForReader.containerId }}</code>
              </div>
              <div class="spec-row">
                <span class="spec-k">Slug URL</span>
                <code class="spec-code">/{{ activeArticleForReader.slug }}</code>
              </div>
              <div class="spec-row">
                <span class="spec-k">Status Routing</span>
                <span class="spec-live-pill"><span class="dot"></span> Active in Traefik</span>
              </div>
              <div class="spec-row">
                <span class="spec-k">Auto-SSL</span>
                <span class="spec-v">Let's Encrypt TLS v1.3</span>
              </div>
              <div class="spec-row">
                <span class="spec-k">Tanggal Rilis</span>
                <span class="spec-v">{{ activeArticleForReader.publishedAt }}</span>
              </div>
            </div>
          </div>

          <!-- Telemetry Metric Card -->
          <div class="inspector-card">
            <h4 class="inspector-title">
              <Activity :size="14" />
              <span>Metrik Edge Real-Time</span>
            </h4>
            <div class="telemetry-compact-grid">
              <div class="tc-metric">
                <span class="tc-val">{{ activeArticleForReader.views.toLocaleString('id-ID') }}</span>
                <span class="tc-lbl">Redis Views</span>
              </div>
              <div class="tc-metric">
                <span class="tc-val text-green">1.8 ms</span>
                <span class="tc-lbl">Edge TTFB</span>
              </div>
              <div class="tc-metric">
                <span class="tc-val text-blue">99.4%</span>
                <span class="tc-lbl">Cache Hit</span>
              </div>
              <div class="tc-metric">
                <span class="tc-val text-purple">0.5 vCPU</span>
                <span class="tc-lbl">cgroups v2</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>

    <!-- ============================================================= -->
    <!-- 2. DEFAULT VIEW: DUAL-CONTENT ENGINE (ARTICLES & CMS PAGES)   -->
    <!-- ============================================================= -->
    <div v-else>
      <!-- Header Baris 1: Judul Modul & Tombol Aksi Tambah -->
      <div class="content-studio-header-row">
        <div>
          <h1 class="page-title">Artikel & Halaman CMS</h1>
          <p class="page-desc">
            Pusat manajemen konten enterprise: publikasikan artikel editorial berkala dan kelola halaman website statis tenant Anda.
          </p>
        </div>

        <div class="content-studio-actions">
          <button
            v-if="activeContentTab === 'articles'"
            class="btn-top-create"
            @click="openCreateArticleModal()"
          >
            <Plus :size="15" />
            <span>Tulis Artikel Baru</span>
          </button>
          <button
            v-else
            class="btn-top-create"
            @click="openCreatePageModal()"
          >
            <Plus :size="15" />
            <span>Tambah Halaman Baru</span>
          </button>
        </div>
      </div>

      <!-- Segmented Tab Nav: Artikel & Blog vs Halaman Statis -->
      <div class="content-tab-navigation-bar">
        <div class="segmented-tab-group">
          <button
            class="btn-segmented-tab"
            :class="{ active: activeContentTab === 'articles' }"
            @click="activeContentTab = 'articles'"
          >
            <BookOpen :size="14" />
            <span>Artikel & Blog</span>
            <span class="tab-count-badge">{{ articles.length }}</span>
          </button>
          <button
            class="btn-segmented-tab"
            :class="{ active: activeContentTab === 'pages' }"
            @click="activeContentTab = 'pages'"
          >
            <Layers :size="14" />
            <span>Halaman Statis (Pages)</span>
            <span class="tab-count-badge">{{ cmsPages.length }}</span>
          </button>
        </div>
      </div>

      <!-- 4 Telemetry Cards (Adaptive per Tab) -->
      <div v-if="activeContentTab === 'articles'" class="stats-overview-grid">
        <div class="telemetry-card accent-blue">
          <div class="telemetry-corner-watermark blue"><FileText :size="58" /></div>
          <div class="telemetry-top">
            <span class="telemetry-label">TOTAL ARTIKEL</span>
          </div>
          <div class="telemetry-val">{{ articles.length }} <span class="telemetry-denom">Artikel</span></div>
          <div class="telemetry-sub"><span>8,450 kata terindeks di Edge CDN</span></div>
        </div>

        <div class="telemetry-card accent-emerald">
          <div class="telemetry-corner-watermark emerald"><Check :size="58" /></div>
          <div class="telemetry-top">
            <span class="telemetry-label">TERPUBLIKASI (LIVE)</span>
          </div>
          <div class="telemetry-val">{{ articles.filter(a => a.status === 'published').length }} <span class="badge-online">Live CDN</span></div>
          <div class="telemetry-sub"><span>Lighthouse 100/100 SEO ready</span></div>
        </div>

        <div class="telemetry-card accent-purple">
          <div class="telemetry-corner-watermark purple"><Edit3 :size="58" /></div>
          <div class="telemetry-top">
            <span class="telemetry-label">DRAFT PENULISAN</span>
          </div>
          <div class="telemetry-val">{{ articles.filter(a => a.status === 'draft').length }} <span class="badge-growth-pill">WIP</span></div>
          <div class="telemetry-sub"><span>Belum dipublikasikan ke publik</span></div>
        </div>

        <div class="telemetry-card accent-sky">
          <div class="telemetry-corner-watermark sky"><Activity :size="58" /></div>
          <div class="telemetry-top">
            <span class="telemetry-label">TOTAL PEMBACA (VIEWS)</span>
          </div>
          <div class="telemetry-val">{{ articles.reduce((acc, a) => acc + a.views, 0).toLocaleString('id-ID') }} <span class="badge-online">+24%</span></div>
          <div class="telemetry-sub"><span>Dihitung non-blocking via Redis ZSET</span></div>
        </div>
      </div>

      <div v-else class="stats-overview-grid">
        <div class="telemetry-card accent-blue">
          <div class="telemetry-corner-watermark blue"><Layers :size="58" /></div>
          <div class="telemetry-top">
            <span class="telemetry-label">TOTAL HALAMAN STATIS</span>
          </div>
          <div class="telemetry-val">{{ cmsPages.length }} <span class="telemetry-denom">Halaman</span></div>
          <div class="telemetry-sub"><span>Rute web terisolasi di Nginx tenant</span></div>
        </div>

        <div class="telemetry-card accent-emerald">
          <div class="telemetry-corner-watermark emerald"><Check :size="58" /></div>
          <div class="telemetry-top">
            <span class="telemetry-label">HALAMAN LIVE</span>
          </div>
          <div class="telemetry-val">{{ cmsPages.filter(p => p.status === 'published').length }} <span class="badge-online">Live Route</span></div>
          <div class="telemetry-sub"><span>Tersedia untuk traffic publik</span></div>
        </div>

        <div class="telemetry-card accent-purple">
          <div class="telemetry-corner-watermark purple"><Compass :size="58" /></div>
          <div class="telemetry-top">
            <span class="telemetry-label">NAVBAR MENU UTAMA</span>
          </div>
          <div class="telemetry-val">{{ cmsPages.filter(p => p.isInNavbar).length }} <span class="badge-growth-pill">Header Nav</span></div>
          <div class="telemetry-sub"><span>Tautkan otomatis pada navbar website</span></div>
        </div>

        <div class="telemetry-card accent-sky">
          <div class="telemetry-corner-watermark sky"><Globe :size="58" /></div>
          <div class="telemetry-top">
            <span class="telemetry-label">FOOTER LINKS</span>
          </div>
          <div class="telemetry-val">{{ cmsPages.filter(p => p.isInFooter).length }} <span class="badge-growth-pill">Footer Nav</span></div>
          <div class="telemetry-sub"><span>Kebijakan, kontak, dan tautan sekunder</span></div>
        </div>
      </div>

      <!-- Toolbar Filters & View Switcher -->
      <div class="editorial-toolbar">
        <!-- Search Input -->
        <div class="articles-search-bar">
          <Search :size="15" class="articles-search-icon" />
          <input
            ref="searchInputRef"
            v-model="searchQuery"
            type="text"
            :placeholder="activeContentTab === 'articles' ? 'Cari judul artikel, slug, kategori, penulis...' : 'Cari judul halaman, URL path, template layout...'"
            class="articles-search-input"
          />
          <button
            v-if="searchQuery"
            type="button"
            class="articles-search-clear"
            @click="searchQuery = ''; searchInputRef?.focus()"
            title="Hapus pencarian"
          >
            <X :size="13" />
          </button>
          <kbd class="articles-search-shortcut" @click="searchInputRef?.focus()">⌘K</kbd>
        </div>

        <div class="toolbar-controls-right">
          <!-- Dropdown Kategori (Tab Artikel) -->
          <div v-if="activeContentTab === 'articles'" class="custom-filter-dropdown-wrap">
            <button
              type="button"
              class="custom-filter-trigger-btn"
              @click.stop="isCategoryDropdownOpen = !isCategoryDropdownOpen; isStatusDropdownOpen = false"
              title="Filter Kategori"
            >
              <span>{{ categoryOptions.find(o => o.value === selectedCategory)?.label || 'Semua Kategori' }}</span>
              <ChevronDown :size="13" class="filter-chevron" :class="{ 'rotate-180': isCategoryDropdownOpen }" />
            </button>
            <div v-if="isCategoryDropdownOpen" class="custom-filter-dropdown-menu">
              <button
                v-for="opt in categoryOptions"
                :key="opt.value"
                type="button"
                class="custom-filter-dropdown-item"
                :class="{ active: selectedCategory === opt.value }"
                @click="selectedCategory = opt.value; isCategoryDropdownOpen = false"
              >
                <span>{{ opt.label }}</span>
                <Check v-if="selectedCategory === opt.value" :size="13" class="dropdown-check-icon" />
              </button>
            </div>
          </div>

          <!-- Dropdown Template Layout (Tab Halaman Statis) -->
          <div v-else class="custom-filter-dropdown-wrap">
            <button
              type="button"
              class="custom-filter-trigger-btn"
              @click.stop="isLayoutDropdownOpen = !isLayoutDropdownOpen; isStatusDropdownOpen = false"
              title="Filter Template Layout"
            >
              <span>{{ layoutOptions.find(o => o.value === selectedLayout)?.label || 'Semua Template' }}</span>
              <ChevronDown :size="13" class="filter-chevron" :class="{ 'rotate-180': isLayoutDropdownOpen }" />
            </button>
            <div v-if="isLayoutDropdownOpen" class="custom-filter-dropdown-menu">
              <button
                v-for="opt in layoutOptions"
                :key="opt.value"
                type="button"
                class="custom-filter-dropdown-item"
                :class="{ active: selectedLayout === opt.value }"
                @click="selectedLayout = opt.value; isLayoutDropdownOpen = false"
              >
                <span>{{ opt.label }}</span>
                <Check v-if="selectedLayout === opt.value" :size="13" class="dropdown-check-icon" />
              </button>
            </div>
          </div>

          <!-- Dropdown Status (Published vs Draft) -->
          <div class="custom-filter-dropdown-wrap">
            <button
              type="button"
              class="custom-filter-trigger-btn"
              @click.stop="isStatusDropdownOpen = !isStatusDropdownOpen; isCategoryDropdownOpen = false; isLayoutDropdownOpen = false"
              title="Filter Status"
            >
              <span>{{ statusOptions.find(o => o.value === selectedStatus)?.label || 'Semua Status' }}</span>
              <ChevronDown :size="13" class="filter-chevron" :class="{ 'rotate-180': isStatusDropdownOpen }" />
            </button>
            <div v-if="isStatusDropdownOpen" class="custom-filter-dropdown-menu">
              <button
                v-for="opt in statusOptions"
                :key="opt.value"
                type="button"
                class="custom-filter-dropdown-item"
                :class="{ active: selectedStatus === opt.value }"
                @click="selectedStatus = opt.value; isStatusDropdownOpen = false"
              >
                <span>{{ opt.label }}</span>
                <Check v-if="selectedStatus === opt.value" :size="13" class="dropdown-check-icon" />
              </button>
            </div>
          </div>

          <!-- View Mode Toggle -->
          <div class="view-mode-toggle">
            <button
              class="btn-view-mode"
              :class="{ active: viewMode === 'grid' }"
              @click="viewMode = 'grid'"
              title="Tampilan Grid Kartu"
            >
              <LayoutGrid :size="14" />
            </button>
            <button
              class="btn-view-mode"
              :class="{ active: viewMode === 'table' }"
              @click="viewMode = 'table'"
              title="Tampilan Tabel Data"
            >
              <List :size="14" />
            </button>
          </div>
        </div>
      </div>

      <!-- ============================================================= -->
      <!-- TAB 1: ARTIKEL & BLOG DISPLAY                                 -->
      <!-- ============================================================= -->
      <div v-if="activeContentTab === 'articles'">
        <!-- Grid View: Editorial Clean Cards -->
        <div v-if="viewMode === 'grid'">
          <div class="editorial-card-grid">
            <div
              v-for="art in filteredArticles"
              :key="art.id"
              class="editorial-article-card"
              :class="getCategoryThemeClass(art.category)"
            >
              <!-- Card Top Editorial Cover: High-End Architectural Visual Composition -->
              <div
                class="art-card-editorial-cover"
                @click="openArticleReader(art)"
              >
                <!-- Subtle Ambient Grid Overlay -->
                <div class="cover-mesh-grid"></div>

                <!-- Watermark Background Tech Glyph -->
                <div class="cover-watermark-glyph">
                  <component :is="getCategoryIconComponent(art.category)" :size="88" />
                </div>

                <!-- Floating Top Meta Bar -->
                <div class="cover-top-meta-row">
                  <span class="editorial-cat-chip" :class="'pill-' + getCategoryBadgeColor(art.category)">
                    <span class="cat-dot"></span>
                    {{ art.category }}
                  </span>

                  <div class="cover-meta-badges">
                    <span class="cover-read-time">
                      <Clock :size="11" />
                      <span>{{ getReadTime(art.title) }}</span>
                    </span>
                    <span
                      class="art-status-chip"
                      :class="art.status === 'published' ? 'chip-live' : 'chip-draft'"
                    >
                      <span class="dot"></span>
                      {{ art.status === 'published' ? 'Live CDN' : 'Draft' }}
                    </span>
                  </div>
                </div>

                <!-- Centerpiece: Glassmorphic Technical Badge with Live Telemetry -->
                <div class="cover-center-stage">
                  <div class="glass-device-badge">
                    <component :is="getCategoryIconComponent(art.category)" :size="28" />
                  </div>
                  <div class="cover-telemetry-pill">
                    <span class="pulse-telemetry-dot"></span>
                    <span>{{ getCategoryTelemetryTag(art.category) }}</span>
                  </div>
                </div>

                <!-- Floating Bottom URL Slug Preview -->
                <div class="cover-bottom-path-preview">
                  <div class="path-preview-inner">
                    <Globe :size="11" class="text-blue-light" />
                    <span class="cover-site-text">{{ art.siteName }}</span>
                    <span class="cover-path-sep">/</span>
                    <span class="cover-slug-text">{{ art.slug }}</span>
                  </div>
                </div>
              </div>

              <!-- Card Body Content -->
              <div class="card-main-body">
                <div class="card-dateline-row">
                  <span class="date-item">
                    <Calendar :size="12" />
                    <span>{{ art.publishedAt }}</span>
                  </span>
                  <span class="dateline-sep">•</span>
                  <span class="read-item">
                    <Clock :size="12" />
                    <span>{{ getReadTime(art.title) }}</span>
                  </span>
                </div>

                <h3 class="editorial-card-title" @click="openArticleReader(art)">
                  {{ art.title }}
                </h3>

                <p class="editorial-card-excerpt">
                  {{ art.excerpt || 'Eksplorasi mendalam arsitektur cloud-native, isolasi cgroups v2, dan routing Traefik v3.' }}
                </p>

                <!-- Tags Row -->
                <div v-if="art.tags && art.tags.length" class="editorial-tags-row">
                  <span v-for="tag in art.tags.slice(0, 3)" :key="tag" class="tag-subtle-badge">
                    #{{ tag }}
                  </span>
                </div>

                <!-- Route & Container Bar -->
                <div class="card-route-strip">
                  <div class="route-strip-left">
                    <Server :size="12" />
                    <span class="route-domain-text">{{ art.siteName }}</span>
                  </div>
                  <code class="route-slug-code">/{{ art.slug }}</code>
                </div>
              </div>

              <!-- Card Footer: Author, Views & Action Buttons -->
              <div class="editorial-card-footer">
                <div class="art-author-row">
                  <div class="author-avatar-styled">
                    {{ art.author.split(' ').map(n => n[0]).join('').slice(0, 2) }}
                  </div>
                  <div class="author-details">
                    <span class="author-name">{{ art.author }}</span>
                    <span class="author-role-sub">Lead Platform Architect</span>
                  </div>
                </div>

                <div class="editorial-card-actions">
                  <div class="art-views-badge" title="Redis Atomic Views">
                    <Eye :size="12" class="text-blue" />
                    <span>{{ art.views.toLocaleString('id-ID') }}</span>
                  </div>

                  <button
                    class="btn-card-read-action"
                    @click="openArticleReader(art)"
                    title="Baca Artikel Lengkap"
                  >
                    <span>Baca</span>
                    <ArrowUpRight :size="13" />
                  </button>

                  <button
                    class="btn-card-icon-action"
                    @click="openEditArticleModal(art)"
                    title="Edit Artikel"
                  >
                    <Edit3 :size="13" />
                  </button>

                  <button
                    class="btn-card-icon-action"
                    @click="copyToClipboard(`https://${art.siteName}/${art.slug}`, art.id)"
                    :title="copiedSubdomain === art.id ? 'Tersalin!' : 'Salin URL Artikel'"
                  >
                    <Check v-if="copiedSubdomain === art.id" :size="13" class="text-green" />
                    <Copy v-else :size="13" />
                  </button>

                  <button
                    class="btn-card-icon-action btn-danger-action"
                    @click="deleteArticle(art)"
                    title="Hapus Artikel"
                  >
                    <Trash2 :size="13" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div v-if="filteredArticles.length === 0" class="empty-state-box">
            <FileText :size="38" class="empty-icon" />
            <h4>Tidak ada artikel yang cocok</h4>
            <p>Sesuaikan kata kunci pencarian atau filter kategori Anda.</p>
          </div>
        </div>

        <!-- Table View: Professional Ledger -->
        <div v-else class="articles-panel">
          <div class="table-responsive">
            <table class="ledger-table">
              <thead>
                <tr>
                  <th>JUDUL ARTIKEL & SLUG</th>
                  <th>TARGET SITUS</th>
                  <th>KATEGORI</th>
                  <th>STATUS</th>
                  <th>VIEWS (REDIS)</th>
                  <th>TANGGAL RILIS</th>
                  <th style="text-align: right">AKSI</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="art in filteredArticles" :key="art.id">
                  <td>
                    <div class="art-title-cell" @click="openArticleReader(art)" style="cursor: pointer;">
                      <div class="art-title-text">{{ art.title }}</div>
                      <div class="art-slug-box">
                        <code>/{{ art.slug }}</code>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="site-tag">{{ art.siteName }}</span>
                  </td>
                  <td>
                    <span class="editorial-cat-chip">{{ art.category }}</span>
                  </td>
                  <td>
                    <span class="art-status-chip" :class="art.status === 'published' ? 'chip-live' : 'chip-draft'">
                      <span class="dot"></span>
                      {{ art.status === 'published' ? 'Live' : 'Draft' }}
                    </span>
                  </td>
                  <td>
                    <div class="views-cell">
                      <Eye :size="12" class="view-icon" />
                      <span>{{ art.views.toLocaleString('id-ID') }}</span>
                    </div>
                  </td>
                  <td>
                    <div class="date-cell">
                      <Calendar :size="12" />
                      <span>{{ art.publishedAt }}</span>
                    </div>
                  </td>
                  <td style="text-align: right">
                    <div class="row-actions">
                      <button class="btn-action-icon" @click="openArticleReader(art)" title="Baca Artikel">
                        <BookOpen :size="13" />
                      </button>
                      <button class="btn-action-icon" @click="openEditArticleModal(art)" title="Edit Artikel">
                        <Edit3 :size="13" />
                      </button>
                      <button class="btn-action-icon" @click="copyToClipboard(`https://${art.siteName}/${art.slug}`, art.id)" :title="copiedSubdomain === art.id ? 'Tersalin!' : 'Salin Tautan'">
                        <Check v-if="copiedSubdomain === art.id" :size="13" class="text-green" />
                        <Copy v-else :size="13" />
                      </button>
                      <button class="btn-action-icon danger" @click="deleteArticle(art)" title="Hapus Artikel">
                        <Trash2 :size="13" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- ============================================================= -->
      <!-- TAB 2: HALAMAN STATIS (CMS PAGES) DISPLAY                     -->
      <!-- ============================================================= -->
      <div v-else>
        <!-- Grid View: Architectural Blueprint Page Cards -->
        <div v-if="viewMode === 'grid'">
          <div class="cms-pages-grid">
            <div
              v-for="page in filteredPages"
              :key="page.id"
              class="cms-page-card"
            >
              <!-- Card Top: Interactive Mini-Browser Blueprint Window -->
              <div class="cms-page-window-mockup" @click="openEditPageModal(page)">
                <!-- Browser Chrome Top Bar -->
                <div class="browser-chrome-bar">
                  <div class="browser-traffic-lights">
                    <span class="traffic-dot dot-close"></span>
                    <span class="traffic-dot dot-minimize"></span>
                    <span class="traffic-dot dot-expand"></span>
                  </div>

                  <div class="browser-address-omnibox">
                    <Lock :size="9.5" class="ssl-shield-icon" />
                    <span class="address-origin">{{ page.siteName }}</span>
                    <span class="address-path">{{ page.path }}</span>
                  </div>

                  <div class="browser-status-wrapper">
                    <span
                      class="art-status-chip"
                      :class="page.status === 'published' ? 'chip-live' : 'chip-draft'"
                    >
                      <span class="dot"></span>
                      {{ page.status === 'published' ? 'Live Route' : 'Draft' }}
                    </span>
                  </div>
                </div>

                <!-- Browser Viewport Canvas with Blueprint Wireframe -->
                <div class="browser-viewport-canvas">
                  <div class="blueprint-canvas-grid"></div>

                  <!-- Archetype 1: Landing Page (Hero Showcase) -->
                  <div v-if="getPageArchetype(page.path, page.templateLayout) === 'landing'" class="wireframe-blueprint wf-landing">
                    <div class="wf-landing-header">
                      <div class="wf-logo-dot"></div>
                      <div class="wf-nav-lines">
                        <span class="wf-nav-line"></span>
                        <span class="wf-nav-line"></span>
                        <span class="wf-nav-line"></span>
                      </div>
                    </div>
                    <div class="wf-landing-hero">
                      <div class="wf-hero-badge"></div>
                      <div class="wf-hero-title"></div>
                      <div class="wf-hero-subtitle"></div>
                      <div class="wf-hero-cta-group">
                        <div class="wf-btn-primary"></div>
                        <div class="wf-btn-ghost"></div>
                      </div>
                    </div>
                    <div class="wf-landing-cards">
                      <div class="wf-mini-card"></div>
                      <div class="wf-mini-card active"></div>
                      <div class="wf-mini-card"></div>
                    </div>
                  </div>

                  <!-- Archetype 2: About / Profile Bio -->
                  <div v-else-if="getPageArchetype(page.path, page.templateLayout) === 'about'" class="wireframe-blueprint wf-about">
                    <div class="wf-about-split">
                      <div class="wf-about-avatar-col">
                        <div class="wf-avatar-circle">
                          <span class="wf-avatar-initials">RP</span>
                        </div>
                        <div class="wf-avatar-subline"></div>
                        <div class="wf-avatar-pill"></div>
                      </div>
                      <div class="wf-about-timeline-col">
                        <div class="wf-timeline-row">
                          <span class="wf-t-dot"></span>
                          <div class="wf-t-bar primary"></div>
                        </div>
                        <div class="wf-timeline-row">
                          <span class="wf-t-dot"></span>
                          <div class="wf-t-bar"></div>
                        </div>
                        <div class="wf-timeline-row">
                          <span class="wf-t-dot"></span>
                          <div class="wf-t-bar"></div>
                        </div>
                      </div>
                    </div>
                    <div class="wf-about-skills-strip">
                      <span class="wf-skill-tag"></span>
                      <span class="wf-skill-tag"></span>
                      <span class="wf-skill-tag"></span>
                      <span class="wf-skill-tag"></span>
                    </div>
                  </div>

                  <!-- Archetype 3: Services Catalog -->
                  <div v-else-if="getPageArchetype(page.path, page.templateLayout) === 'services'" class="wireframe-blueprint wf-services">
                    <div class="wf-section-bar">
                      <div class="wf-sec-badge"></div>
                      <div class="wf-sec-heading"></div>
                    </div>
                    <div class="wf-services-grid">
                      <div class="wf-service-col sc-blue">
                        <div class="wf-sc-icon"></div>
                        <div class="wf-sc-title"></div>
                        <div class="wf-sc-desc"></div>
                        <div class="wf-sc-check"></div>
                      </div>
                      <div class="wf-service-col sc-indigo">
                        <div class="wf-sc-icon"></div>
                        <div class="wf-sc-title"></div>
                        <div class="wf-sc-desc"></div>
                        <div class="wf-sc-check"></div>
                      </div>
                      <div class="wf-service-col sc-emerald">
                        <div class="wf-sc-icon"></div>
                        <div class="wf-sc-title"></div>
                        <div class="wf-sc-desc"></div>
                        <div class="wf-sc-check"></div>
                      </div>
                    </div>
                  </div>

                  <!-- Archetype 4: Contact / Inquiry Form -->
                  <div v-else-if="getPageArchetype(page.path, page.templateLayout) === 'contact'" class="wireframe-blueprint wf-contact">
                    <div class="wf-contact-split">
                      <div class="wf-contact-info-panel">
                        <div class="wf-ci-badge"></div>
                        <div class="wf-ci-line"></div>
                        <div class="wf-ci-line short"></div>
                        <div class="wf-ci-pill"></div>
                      </div>
                      <div class="wf-contact-form-panel">
                        <div class="wf-input-box"></div>
                        <div class="wf-input-box"></div>
                        <div class="wf-input-box textarea"></div>
                        <div class="wf-form-submit-btn"></div>
                      </div>
                    </div>
                  </div>

                  <!-- Archetype 5: Legal / Compliance Document -->
                  <div v-else-if="getPageArchetype(page.path, page.templateLayout) === 'legal'" class="wireframe-blueprint wf-legal">
                    <div class="wf-legal-paper">
                      <div class="wf-legal-watermark">
                        <ShieldCheck :size="48" />
                      </div>
                      <div class="wf-legal-header-line"></div>
                      <div class="wf-legal-sub-line"></div>
                      <div class="wf-legal-paragraphs">
                        <div class="wf-legal-p-line"></div>
                        <div class="wf-legal-p-line"></div>
                        <div class="wf-legal-p-line short"></div>
                      </div>
                      <div class="wf-legal-signature-box">
                        <div class="wf-legal-seal"></div>
                        <div class="wf-legal-sig-line"></div>
                      </div>
                    </div>
                  </div>

                  <!-- Fallback Archetype for newly created custom pages -->
                  <div v-else class="wireframe-blueprint wf-default">
                    <div class="wf-landing-header">
                      <div class="wf-logo-dot"></div>
                      <div class="wf-nav-lines">
                        <span class="wf-nav-line"></span>
                        <span class="wf-nav-line"></span>
                      </div>
                    </div>
                    <div class="wf-default-body">
                      <div class="wf-default-content">
                        <div class="wf-hero-title"></div>
                        <div class="wf-hero-subtitle"></div>
                        <div class="wf-hero-subtitle"></div>
                      </div>
                      <div class="wf-default-aside">
                        <div class="wf-mini-card"></div>
                        <div class="wf-mini-card"></div>
                      </div>
                    </div>
                  </div>

                  <!-- Floating Bottom Template Pill & Container Tag -->
                  <div class="browser-viewport-bottom-bar">
                    <div class="viewport-template-pill" :class="'pill-' + getPageLayoutColor(page.path, page.templateLayout)">
                      <Layers :size="10.5" />
                      <span>{{ page.templateLayout }}</span>
                    </div>
                    <div class="viewport-container-tag">
                      <Server :size="10.5" />
                      <code>{{ page.containerId }}</code>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Card Body: Title & Meta -->
              <div class="page-card-body">
                <div class="card-dateline-row">
                  <span class="date-item">
                    <Clock :size="11.5" />
                    <span>Diperbarui: {{ page.updatedAt }}</span>
                  </span>
                  <span class="dateline-sep">•</span>
                  <span class="runtime-item">
                    <Zap :size="11.5" class="text-amber" />
                    <span>Nginx Alpine Edge</span>
                  </span>
                </div>

                <h3 class="page-card-title" @click="openEditPageModal(page)">
                  {{ page.title }}
                </h3>

                <p class="page-card-desc">
                  {{ page.metaDesc || 'Halaman statis siap saji dengan isolasi Nginx Alpine dan optimasi cache Traefik edge.' }}
                </p>

                <!-- Navigation Integration Indicators -->
                <div class="page-nav-indicators">
                  <span
                    class="nav-indicator-pill nav-header"
                    :class="{ active: page.isInNavbar }"
                    :title="page.isInNavbar ? 'Ditampilkan di Header Navbar' : 'Tidak tampil di Navbar'"
                  >
                    <Compass :size="11.5" />
                    <span>Navbar Header {{ page.isInNavbar ? '✓' : '—' }}</span>
                  </span>

                  <span
                    class="nav-indicator-pill nav-footer"
                    :class="{ active: page.isInFooter }"
                    :title="page.isInFooter ? 'Ditampilkan di Footer Navigasi' : 'Tidak tampil di Footer'"
                  >
                    <Globe :size="11.5" />
                    <span>Footer Links {{ page.isInFooter ? '✓' : '—' }}</span>
                  </span>
                </div>
              </div>

              <!-- Card Footer: Actions -->
              <div class="page-card-footer">
                <div class="page-footer-left">
                  <span class="page-site-slug-preview">
                    <code>{{ page.path }}</code>
                  </span>
                </div>

                <div class="page-card-actions">
                  <button
                    class="btn-primary-card-action"
                    @click="openEditPageModal(page)"
                    title="Edit Halaman Statis"
                  >
                    <Edit3 :size="13" />
                    <span>Edit Halaman</span>
                  </button>

                  <button
                    class="btn-card-icon-action"
                    @click="copyToClipboard(`https://${page.siteName}${page.path}`, page.id)"
                    :title="copiedSubdomain === page.id ? 'Tersalin!' : 'Salin URL Lengkap'"
                  >
                    <Check v-if="copiedSubdomain === page.id" :size="13" class="text-green" />
                    <Copy v-else :size="13" />
                  </button>

                  <button
                    class="btn-card-icon-action btn-danger-action"
                    @click="deleteCmsPage(page)"
                    title="Hapus Halaman"
                  >
                    <Trash2 :size="13" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div v-if="filteredPages.length === 0" class="empty-state-box">
            <Layers :size="38" class="empty-icon" />
            <h4>Tidak ada halaman statis yang cocok</h4>
            <p>Sesuaikan filter atau klik tombol "Tambah Halaman Baru" di atas.</p>
          </div>
        </div>

        <!-- Table View: CMS Pages -->
        <div v-else class="articles-panel">
          <div class="table-responsive">
            <table class="ledger-table">
              <thead>
                <tr>
                  <th>JUDUL HALAMAN & PATH</th>
                  <th>TARGET SITUS</th>
                  <th>TEMPLATE LAYOUT</th>
                  <th>NAVIGASI (NAV/FOOTER)</th>
                  <th>STATUS</th>
                  <th>TERAKHIR DIUBAH</th>
                  <th style="text-align: right">AKSI</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="page in filteredPages" :key="page.id">
                  <td>
                    <div class="art-title-cell" @click="openEditPageModal(page)" style="cursor: pointer;">
                      <div class="art-title-text">{{ page.title }}</div>
                      <div class="art-slug-box">
                        <code>{{ page.path }}</code>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="site-tag">{{ page.siteName }}</span>
                  </td>
                  <td>
                    <span class="page-layout-badge">{{ page.templateLayout }}</span>
                  </td>
                  <td>
                    <div class="nav-indicators-table-cell">
                      <span class="badge-nav-indicator" :class="{ on: page.isInNavbar }">Nav</span>
                      <span class="badge-nav-indicator" :class="{ on: page.isInFooter }">Footer</span>
                    </div>
                  </td>
                  <td>
                    <span class="art-status-chip" :class="page.status === 'published' ? 'chip-live' : 'chip-draft'">
                      <span class="dot"></span>
                      {{ page.status === 'published' ? 'Live' : 'Draft' }}
                    </span>
                  </td>
                  <td>
                    <div class="date-cell">
                      <Calendar :size="12" />
                      <span>{{ page.updatedAt }}</span>
                    </div>
                  </td>
                  <td style="text-align: right">
                    <div class="row-actions">
                      <button class="btn-action-icon" @click="openEditPageModal(page)" title="Edit Halaman">
                        <Edit3 :size="13" />
                      </button>
                      <button class="btn-action-icon" @click="copyToClipboard(`https://${page.siteName}${page.path}`, page.id)" :title="copiedSubdomain === page.id ? 'Tersalin!' : 'Salin Tautan'">
                        <Check v-if="copiedSubdomain === page.id" :size="13" class="text-green" />
                        <Copy v-else :size="13" />
                      </button>
                      <button class="btn-action-icon danger" @click="deleteCmsPage(page)" title="Hapus Halaman">
                        <Trash2 :size="13" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- ============================================================= -->
    <!-- 3. UNIVERSAL CONTENT STUDIO MODAL EDITOR (ARTICLE & CMS PAGE) -->
    <!-- ============================================================= -->
    <Teleport to="body">
      <div v-if="isEditorModalOpen" class="modal-backdrop" @click.self="closeEditorModal">
        <div class="modal-dialog modal-dialog-lg content-editor-dialog">
        <div class="modal-header">
          <div class="modal-header-leading">
            <div class="modal-icon-badge">
              <BookOpen v-if="editorContentType === 'article'" :size="18" />
              <Layers v-else :size="18" />
            </div>
            <div>
              <h3 class="modal-title">
                {{ editingId ? 'Edit ' + (editorContentType === 'article' ? 'Artikel Editorial' : 'Halaman Statis') : 'Buat ' + (editorContentType === 'article' ? 'Artikel Baru' : 'Halaman Statis Baru') }}
              </h3>
              <p class="modal-subtitle">
                {{ editorContentType === 'article' ? 'Kelola publikasi konten berkala, slug URL, dan metadata SEO.' : 'Atur halaman website tenant, layout template, dan tautan navigasi.' }}
              </p>
            </div>
          </div>
          <button class="btn-modal-close" @click="closeEditorModal">
            <X :size="18" />
          </button>
        </div>

        <form class="editor-modal-form" @submit.prevent="handleSaveContent">
          <!-- Row 1: Title & Slug/Path -->
          <div class="form-row-2col">
            <div class="form-field-group">
              <label class="form-field-label">Judul {{ editorContentType === 'article' ? 'Artikel' : 'Halaman' }} *</label>
              <input
                v-model="formTitle"
                type="text"
                class="studio-input"
                :placeholder="editorContentType === 'article' ? 'Contoh: Arsitektur Cloud-Native dengan Golang' : 'Contoh: Tentang Kami & Visi Perusahaan'"
                @input="handleTitleInput"
                required
              />
            </div>

            <div class="form-field-group">
              <label class="form-field-label">{{ editorContentType === 'article' ? 'Slug URL (/artikel-slug)' : 'Path URL (contoh: /about)' }} *</label>
              <input
                v-if="editorContentType === 'article'"
                v-model="formSlug"
                type="text"
                class="studio-input"
                placeholder="arsitektur-cloud-native"
                required
              />
              <input
                v-else
                v-model="formPath"
                type="text"
                class="studio-input"
                placeholder="/about"
                required
              />
            </div>
          </div>

          <!-- Row 2: Target Container & Status -->
          <div class="form-row-2col">
            <div class="form-field-group">
              <label class="form-field-label">Target Kontainer Website</label>
              <select v-model="formContainerId" class="studio-select">
                <option v-for="c in containers" :key="c.id" :value="c.id">
                  {{ c.name }} ({{ c.customDomain || c.subdomain }})
                </option>
              </select>
            </div>

            <div class="form-field-group">
              <label class="form-field-label">Status Publikasi</label>
              <select v-model="formStatus" class="studio-select">
                <option value="published">Published (Live di Edge CDN)</option>
                <option value="draft">Draft (Disimpan Sementara / WIP)</option>
              </select>
            </div>
          </div>

          <!-- Specific Fields for Article -->
          <div v-if="editorContentType === 'article'" class="form-row-3col">
            <div class="form-field-group">
              <label class="form-field-label">Kategori</label>
              <select v-model="formCategory" class="studio-select">
                <option value="Engineering">Engineering</option>
                <option value="Distributed Systems">Distributed Systems</option>
                <option value="DevOps">DevOps</option>
                <option value="Security">Security</option>
                <option value="Tutorial">Tutorial</option>
              </select>
            </div>

            <div class="form-field-group">
              <label class="form-field-label">Penulis (Author)</label>
              <input v-model="formAuthor" type="text" class="studio-input" placeholder="Rizal Pratama" />
            </div>

            <div class="form-field-group">
              <label class="form-field-label">Tags (Pisahkan koma)</label>
              <input v-model="formTags" type="text" class="studio-input" placeholder="GO-SDK, Docker, Edge" />
            </div>
          </div>

          <!-- Specific Fields for Page -->
          <div v-else class="form-row-3col">
            <div class="form-field-group">
              <label class="form-field-label">Template Layout</label>
              <select v-model="formTemplateLayout" class="studio-select">
                <option value="landing-page">Landing Page</option>
                <option value="standard-prose">Standard Prose / Document</option>
                <option value="compact-form">Contact / Form</option>
                <option value="legal-document">Legal Document</option>
              </select>
            </div>

            <div class="form-field-group form-checkbox-group">
              <label class="form-field-label">Integrasi Navigasi</label>
              <div class="checkbox-pair-row">
                <label class="studio-checkbox-label">
                  <input v-model="formIsInNavbar" type="checkbox" />
                  <span>Navbar Header</span>
                </label>
                <label class="studio-checkbox-label">
                  <input v-model="formIsInFooter" type="checkbox" />
                  <span>Footer Links</span>
                </label>
              </div>
            </div>

            <div class="form-field-group">
              <label class="form-field-label">Meta Title (SEO)</label>
              <input v-model="formMetaTitle" type="text" class="studio-input" placeholder="Judul untuk Google Search" />
            </div>
          </div>

          <!-- Excerpt / Meta Description -->
          <div class="form-field-group">
            <label class="form-field-label">Ringkasan Singkat / Meta Description (SEO)</label>
            <input
              v-if="editorContentType === 'article'"
              v-model="formExcerpt"
              type="text"
              class="studio-input"
              placeholder="Deskripsi singkat konten untuk tampilan kartu dan snippet Google..."
            />
            <input
              v-else
              v-model="formMetaDesc"
              type="text"
              class="studio-input"
              placeholder="Deskripsi ringkas halaman untuk OpenGraph dan mesin pencari..."
            />
          </div>

          <!-- Content Markdown Textarea -->
          <div class="form-field-group">
            <div class="label-with-hint">
              <label class="form-field-label">Konten Dokumen (Markdown)</label>
              <span class="field-hint">Mendukung heading (#), bold, list, dan link</span>
            </div>
            <textarea
              v-model="formContent"
              class="studio-textarea content-markdown-area"
              rows="9"
              placeholder="Tuliskan konten Anda di sini..."
            ></textarea>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn-modal-ghost" @click="closeEditorModal">
              Batal
            </button>
            <button type="submit" class="btn-modal-confirm">
              <Check :size="15" />
              <span>Simpan {{ editorContentType === 'article' ? 'Artikel' : 'Halaman' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
    </Teleport>
  </section>
</template>
