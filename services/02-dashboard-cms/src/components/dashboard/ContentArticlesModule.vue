<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
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
  Flame,
  Copy,
  X,
  BookOpen,
  Edit3,
  ChevronDown,
  ArrowLeft,
  ExternalLink,
  ChevronRight,
  Server
} from 'lucide-vue-next';
import { useDashboardData } from '../../composables/useDashboardData';
import type { ContentArticle } from '../../types/dashboard';

const {
  articles,
  activeArticleForReader,
  copyToClipboard,
  copiedSubdomain
} = useDashboardData();

const searchQuery = ref('');
const selectedCategory = ref('all');
const selectedStatus = ref('all');
const viewMode = ref<'grid' | 'table'>('grid');
const searchInputRef = ref<HTMLInputElement | null>(null);

const openArticleReader = (art: ContentArticle) => {
  activeArticleForReader.value = art;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const closeArticleReader = () => {
  activeArticleForReader.value = null;
};

const copyCodeSnippet = () => {
  const snippet = `func RecordArticleHit(ctx context.Context, slug string) error {
    // Atomic increment via Redis Sorted Set (ZSET) - Sub-millisecond latency
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

const filteredArticles = computed(() => {
  return articles.value.filter(art => {
    const q = searchQuery.value.toLowerCase().trim();
    const matchesSearch = !q ||
      art.title.toLowerCase().includes(q) ||
      art.slug.toLowerCase().includes(q) ||
      art.category.toLowerCase().includes(q) ||
      art.author.toLowerCase().includes(q) ||
      art.siteName.toLowerCase().includes(q);
    if (!matchesSearch) return false;
    if (selectedCategory.value !== 'all' && art.category !== selectedCategory.value) return false;
    if (selectedStatus.value !== 'all' && art.status !== selectedStatus.value) return false;
    return true;
  });
});

const trendingArticle = computed(() => {
  return [...articles.value].sort((a, b) => b.views - a.views)[0];
});

const getReadTime = (title: string) => {
  const words = title.length * 15;
  const mins = Math.max(3, Math.round(words / 150));
  return `${mins} min baca`;
};

const getCategoryColor = (cat: string) => {
  if (cat === 'Engineering') return 'cyan';
  if (cat === 'Distributed Systems') return 'purple';
  if (cat === 'DevOps') return 'emerald';
  if (cat === 'Security') return 'sapphire';
  if (cat === 'Tutorial') return 'amber';
  return 'slate';
};

const getCategoryTags = (cat: string) => {
  if (cat === 'Engineering') return ['#GO-SDK', '#DOCKER', '#CGROUPS-V2'];
  if (cat === 'Distributed Systems') return ['#KAFKA', '#REDIS-ZSET', '#EVENT-STREAM'];
  if (cat === 'DevOps') return ['#TRAEFIK-V3', '#EDGE-PROXY', '#1.8MS-TTFB'];
  if (cat === 'Security') return ['#RATE-LIMIT', '#DDOS-WAF', '#TLS-ALPN'];
  if (cat === 'Tutorial') return ['#HEADLESS-CMS', '#VUE3', '#LIGHTHOUSE'];
  return ['#HEROCMS', '#CLOUD-NATIVE', '#EDGE'];
};

const isCategoryDropdownOpen = ref(false);
const isStatusDropdownOpen = ref(false);

const categoryOptions = [
  { value: 'all', label: 'Semua Kategori' },
  { value: 'Engineering', label: 'Engineering' },
  { value: 'Distributed Systems', label: 'Distributed Systems' },
  { value: 'DevOps', label: 'DevOps' },
  { value: 'Security', label: 'Security' },
  { value: 'Tutorial', label: 'Tutorial' }
];

const statusOptions = [
  { value: 'all', label: 'Semua Status' },
  { value: 'published', label: 'Published (Live)' },
  { value: 'draft', label: 'Draft (WIP)' }
];

const handleContentDropdownOutsideClick = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (!target.closest('.custom-filter-dropdown-wrap')) {
    isCategoryDropdownOpen.value = false;
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
  } else if (e.key === 'Escape' && activeArticleForReader.value) {
    closeArticleReader();
  }
};

onMounted(() => {
  document.addEventListener('click', handleContentDropdownOutsideClick);
  window.addEventListener('keydown', handleGlobalKeydown);
});

onUnmounted(() => {
  document.removeEventListener('click', handleContentDropdownOutsideClick);
  window.removeEventListener('keydown', handleGlobalKeydown);
});
</script>

<template>
  <section class="fade-in-section">
    <!-- ============================================================= -->
    <!-- 1. DEDICATED FULL-PAGE ARTICLE READER VIEW (THEMED STUDIO)   -->
    <!-- ============================================================= -->
    <div v-if="activeArticleForReader" class="article-reader-page">
      <!-- Breadcrumb & Back Action Bar -->
      <div class="reader-top-action-bar">
        <div class="reader-breadcrumb-nav">
          <button class="btn-reader-back" @click="closeArticleReader()">
            <ArrowLeft :size="14" />
            <span>Kembali ke Daftar</span>
          </button>
          <span class="reader-crumb-divider">/</span>
          <span class="reader-crumb-module" @click="closeArticleReader()">Artikel & Halaman CMS</span>
          <span class="reader-crumb-divider">/</span>
          <span class="reader-crumb-active" :title="activeArticleForReader.title">
            {{ activeArticleForReader.title }}
          </span>
        </div>

        <div class="reader-quick-actions">
          <button
            class="btn-reader-action"
            @click="copyToClipboard(`https://rizalpratama.cloud/${activeArticleForReader.slug}`, activeArticleForReader.id)"
            :title="copiedSubdomain === activeArticleForReader.id ? 'Tautan Tersalin!' : 'Salin Tautan Publik'"
          >
            <Check v-if="copiedSubdomain === activeArticleForReader.id" :size="13" class="text-green" />
            <Copy v-else :size="13" />
            <span>{{ copiedSubdomain === activeArticleForReader.id ? 'Tautan Tersalin' : 'Salin Tautan' }}</span>
          </button>

          <a
            :href="`https://rizalpratama.cloud/${activeArticleForReader.slug}`"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-reader-action"
            title="Buka Halaman di Tab Baru"
          >
            <ExternalLink :size="13" />
            <span>Buka URL Publik</span>
          </a>
        </div>
      </div>

      <!-- Hero Header (Themed with Obsidian + Category Accent Gradient) -->
      <div class="reader-page-hero" :class="'cover-' + getCategoryColor(activeArticleForReader.category)">
        <div class="reader-hero-decor-grid"></div>
        <div class="reader-hero-inner">
          <div class="reader-hero-badges">
            <span class="cover-cat-pill" :class="'pill-' + getCategoryColor(activeArticleForReader.category)">
              {{ activeArticleForReader.category.toUpperCase() }}
            </span>
            <span class="cover-read-time">
              <Clock :size="12" />
              <span>{{ getReadTime(activeArticleForReader.title) }}</span>
            </span>
            <span class="seo-score-pill">
              <Zap :size="12" />
              <span>SEO 100/100</span>
            </span>
            <span class="art-status-chip chip-live">
              <span class="dot"></span>
              {{ activeArticleForReader.status === 'published' ? 'Edge Live' : 'Draft' }}
            </span>
          </div>

          <h1 class="reader-page-title">{{ activeArticleForReader.title }}</h1>

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
                <Eye :size="14" class="text-cyan" />
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
              <code class="callout-url">https://rizalpratama.cloud/{{ activeArticleForReader.slug }}</code>
            </div>
            <button
              class="btn-copy-callout"
              @click="copyToClipboard(`https://rizalpratama.cloud/${activeArticleForReader.slug}`, activeArticleForReader.id)"
              :title="copiedSubdomain === activeArticleForReader.id ? 'Tersalin!' : 'Salin URL'"
            >
              <Check v-if="copiedSubdomain === activeArticleForReader.id" :size="13" class="text-green" />
              <Copy v-else :size="13" />
            </button>
          </div>

          <!-- Dynamic Editorial Body -->
          <div class="reader-prose-body">
            <p class="reader-lead-paragraph">
              Dalam implementasi arsitektur cloud-native modern, kecepatan penyajian konten statis dan dinamis di level reverse proxy edge Traefik v3 menjadi faktor penentu utama pengalaman pengguna, ranking SEO Google Core Web Vitals, serta efisiensi penggunaan memori server.
            </p>

            <h2 id="section-1">1. Isolasi Resource Kernel Linux cgroups v2</h2>
            <p>
              Setiap tenant situs pada HeroCMS dialokasikan di dalam kontainer Docker Alpine Nginx mandiri yang terisolasi ketat. Menggunakan subsistem <strong>cgroups v2</strong> pada kernel Linux, sistem menerapkan batas memori hard-limit sebesar <code>256 MB</code> dan pembatasan alokasi CPU maksimum <code>0.5 vCPU</code>.
            </p>
            <p>
              Dengan arsitektur ini, lonjakan trafik tiba-tiba pada satu tenant tidak akan pernah menyebabkan degradasi kinerja atau kondisi <em>out-of-memory (OOM)</em> pada tenant lainnya dalam kluster yang sama.
            </p>

            <div class="reader-info-callout">
              <div class="info-callout-icon"><Zap :size="16" /></div>
              <div class="info-callout-body">
                <strong>Catatan Arsitektur:</strong> Traefik v3 membaca label Docker secara dinamis melalui socket <code>/var/run/docker.sock</code>. Begitu kontainer tenant di-deploy, routing otomatis dibuat dalam hitungan milidetik tanpa perlu reload Nginx master.
              </div>
            </div>

            <h2 id="section-2">2. Telemetri Real-Time Non-Blocking dengan Redis Sorted Sets (ZSET)</h2>
            <p>
              Setiap kali rute artikel ini diakses oleh browser pengunjung, edge middleware Traefik secara asinkron meneruskan sinyal telemetry ke antrian Kafka, yang kemudian diakumulasikan ke Redis Sorted Sets (<code>ZSET</code>) menggunakan perintah atomik:
            </p>

            <!-- Code Block Demonstration -->
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

            <h2 id="section-3">3. Optimasi Cache Header & TLS ALPN Passthrough</h2>
            <p>
              Header <code>Cache-Control: public, max-age=31536000, immutable</code> secara otomatis diinjeksi pada file statis CSS, JS, dan gambar WebP. Sementara dokumen HTML halaman di-cache di level edge Traefik dengan strategi <code>stale-while-revalidate</code>, memastikan latensi <em>Time To First Byte (TTFB)</em> konsisten di bawah <strong>2ms</strong> bagi pengunjung global.
            </p>

            <!-- Tech Tags Cloud -->
            <div class="reader-article-tags">
              <span class="tag-lead">Topik Terkait:</span>
              <span
                v-for="tag in getCategoryTags(activeArticleForReader.category)"
                :key="tag"
                class="reader-tag-chip"
              >
                {{ tag }}
              </span>
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
          <!-- Metadata Inspector Card -->
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

          <!-- Real-Time Edge Telemetry Card -->
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
                <span class="tc-val text-cyan">99.4%</span>
                <span class="tc-lbl">Cache Hit</span>
              </div>
              <div class="tc-metric">
                <span class="tc-val text-purple">0.5 vCPU</span>
                <span class="tc-lbl">cgroups v2</span>
              </div>
            </div>
          </div>

          <!-- Quick Return Button -->
          <button class="btn-sidebar-back-list" @click="closeArticleReader()">
            <ArrowLeft :size="14" />
            <span>Kembali ke Daftar Artikel</span>
          </button>
        </aside>
      </div>
    </div>

    <!-- ============================================================= -->
    <!-- 2. DEFAULT ARTICLES & PAGES LIST VIEW (WHEN NOT IN READER)     -->
    <!-- ============================================================= -->
    <div v-else>
      <!-- Header Intro -->
      <div class="page-intro-row">
        <div>
          <h1 class="page-title">Konten & Editorial Studio</h1>
          <p class="page-desc">Jelajahi publikasi konten, postingan editorial teknis, dan landing page kontainer tenant Anda dengan sinkronisasi CDN Traefik dan OpenGraph otomatis.</p>
        </div>
      </div>

      <!-- 4 Content Telemetry Cards -->
      <div class="stats-overview-grid">
        <div class="telemetry-card">
          <div class="telemetry-top">
            <span class="telemetry-label">TOTAL ARTIKEL</span>
            <div class="telemetry-glyph blue"><FileText :size="15" /></div>
          </div>
          <div class="telemetry-val">{{ articles.length }} <span class="telemetry-denom">Artikel</span></div>
          <div class="telemetry-sub"><span>8,450 kata terindeks di edge</span></div>
        </div>

        <div class="telemetry-card">
          <div class="telemetry-top">
            <span class="telemetry-label">TERPUBLIKASI (LIVE)</span>
            <div class="telemetry-glyph emerald"><Check :size="15" /></div>
          </div>
          <div class="telemetry-val">{{ articles.filter(a => a.status === 'published').length }} <span class="badge-online">Live CDN</span></div>
          <div class="telemetry-sub"><span>Lighthouse 100/100 SEO ready</span></div>
        </div>

        <div class="telemetry-card">
          <div class="telemetry-top">
            <span class="telemetry-label">DRAFT PENULISAN</span>
            <div class="telemetry-glyph purple"><Edit3 :size="15" /></div>
          </div>
          <div class="telemetry-val">{{ articles.filter(a => a.status === 'draft').length }} <span class="badge-growth-pill">WIP</span></div>
          <div class="telemetry-sub"><span>Belum dipublikasikan ke publik</span></div>
        </div>

        <div class="telemetry-card">
          <div class="telemetry-top">
            <span class="telemetry-label">TOTAL PEMBACA (VIEWS)</span>
            <div class="telemetry-glyph blue"><Activity :size="15" /></div>
          </div>
          <div class="telemetry-val">{{ articles.reduce((acc, a) => acc + a.views, 0).toLocaleString('id-ID') }} <span class="badge-online">+24%</span></div>
          <div class="telemetry-sub"><span>Dihitung non-blocking via Redis ZSET</span></div>
        </div>
      </div>

      <!-- Featured Post Spotlight Card (Top Trending Post on Redis) -->
      <div v-if="trendingArticle" class="spotlight-post-card">
        <div class="spotlight-glow-layer"></div>
        <div class="spotlight-content">
          <div class="spotlight-tag-row">
            <span class="spotlight-fire-pill">
              <Flame :size="13" />
              <span>#1 POPULER DI REDIS STREAM</span>
            </span>
            <span class="spotlight-site-tag">{{ trendingArticle.siteName }}</span>
          </div>

          <div class="spotlight-main-row">
            <div class="spotlight-info">
              <h2 class="spotlight-title" @click="openArticleReader(trendingArticle)" style="cursor: pointer;">
                {{ trendingArticle.title }}
              </h2>
              <p class="spotlight-excerpt">
                Eksplorasi mendalam mengenai arsitektur sistem otonom, isolasi resource CPU cgroups v2, integrasi event stream Kafka, dan latensi proxy Traefik v3 sub-2ms.
              </p>

              <div class="spotlight-meta-strip">
                <span class="s-meta-item">
                  <Eye :size="13" class="text-blue" />
                  <strong>{{ trendingArticle.views.toLocaleString('id-ID') }}</strong> Views
                </span>
                <span class="s-meta-item">
                  <Clock :size="13" />
                  {{ getReadTime(trendingArticle.title) }}
                </span>
                <span class="s-meta-item seo-score-pill">
                  <Zap :size="11" />
                  SEO 99/100
                </span>
                <span class="s-meta-item">
                  <Calendar :size="13" />
                  {{ trendingArticle.publishedAt }}
                </span>
              </div>
            </div>

            <div class="spotlight-actions">
              <button
                class="btn-spotlight-edit"
                @click="openArticleReader(trendingArticle)"
              >
                <Eye :size="14" />
                <span>Baca Artikel Lengkap</span>
              </button>
              <button
                class="btn-spotlight-copy"
                @click="copyToClipboard(`https://rizalpratama.cloud/${trendingArticle.slug}`, trendingArticle.id)"
                :title="copiedSubdomain === trendingArticle.id ? 'Tersalin!' : 'Salin URL Artikel'"
              >
                <Check v-if="copiedSubdomain === trendingArticle.id" :size="14" class="text-green" />
                <Copy v-else :size="14" />
                <span>{{ copiedSubdomain === trendingArticle.id ? 'URL Tersalin' : 'Salin URL' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Toolbar Filters & View Switcher -->
      <div class="editorial-toolbar">
        <!-- Custom Clean Search Bar (Obsidian/Cyan Themed, No Collisions) -->
        <div class="articles-search-bar">
          <Search :size="15" class="articles-search-icon" />
          <input
            ref="searchInputRef"
            v-model="searchQuery"
            type="text"
            placeholder="Cari judul artikel, slug URL, kata kunci, topik..."
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
          <!-- Custom Category Dropdown -->
          <div class="custom-filter-dropdown-wrap">
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

          <!-- Custom Status Dropdown -->
          <div class="custom-filter-dropdown-wrap">
            <button
              type="button"
              class="custom-filter-trigger-btn"
              @click.stop="isStatusDropdownOpen = !isStatusDropdownOpen; isCategoryDropdownOpen = false"
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

      <!-- 1. GRID OF VISUAL ARTICLE CARDS -->
      <div v-if="viewMode === 'grid'">
        <div class="articles-card-grid">
          <div
            v-for="art in filteredArticles"
            :key="art.id"
            class="article-visual-card"
          >
            <!-- Visual Hero Cover with Theme Accent Gradient -->
            <div
              class="art-card-cover"
              :class="'cover-' + getCategoryColor(art.category)"
              @click="openArticleReader(art)"
              style="cursor: pointer;"
            >
              <div class="art-cover-glow"></div>
              
              <!-- Top Metadata Strip inside Cover -->
              <div class="cover-top-meta">
                <span class="cover-cat-pill" :class="'pill-' + getCategoryColor(art.category)">
                  {{ art.category.toUpperCase() }}
                </span>
                <div class="cover-top-right">
                  <span class="cover-read-time">
                    <Clock :size="11" />
                    <span>{{ getReadTime(art.title) }}</span>
                  </span>
                  <span class="seo-score-pill">
                    <Zap :size="11" />
                    <span>SEO 100</span>
                  </span>
                </div>
              </div>

              <!-- Cover Center Tech Visual -->
              <div class="art-cover-center">
                <div class="art-floating-icon">
                  <BookOpen :size="26" />
                </div>
                <div class="cover-dynamic-tags">
                  <span
                    v-for="tag in getCategoryTags(art.category)"
                    :key="tag"
                    class="tag-micro-badge"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>

              <!-- Target Site Chip on Cover Bottom -->
              <div class="cover-bottom-bar">
                <span class="cover-site-badge">
                  <Globe :size="11" />
                  <span>{{ art.siteName }}</span>
                </span>
                <span class="cover-slug-chip">/{{ art.slug }}</span>
              </div>
            </div>

            <!-- Card Body Content -->
            <div class="art-card-content">
              <h3 class="art-card-title" @click="openArticleReader(art)" style="cursor: pointer;">
                {{ art.title }}
              </h3>

              <div class="art-card-footer">
                <div class="art-author-row">
                  <div class="author-avatar-mini">RP</div>
                  <div class="author-details">
                    <span class="author-name">{{ art.author }}</span>
                    <span class="art-date">{{ art.publishedAt }}</span>
                  </div>
                </div>

                <div class="art-metrics-col">
                  <div class="art-views-badge">
                    <Eye :size="12" class="text-blue" />
                    <span>{{ art.views.toLocaleString('id-ID') }}</span>
                  </div>
                  <span
                    class="art-status-chip"
                    :class="art.status === 'published' ? 'chip-live' : 'chip-draft'"
                  >
                    <span class="dot"></span>
                    {{ art.status === 'published' ? 'Live' : 'Draft' }}
                  </span>
                </div>
              </div>

              <!-- Card Action Bar -->
              <div class="art-card-actions-bar">
                <button
                  class="btn-card-action primary"
                  @click="openArticleReader(art)"
                >
                  <Eye :size="13" />
                  <span>Baca Artikel</span>
                </button>
                <button
                  class="btn-card-action"
                  @click="copyToClipboard(`https://rizalpratama.cloud/${art.slug}`, art.id)"
                  :title="copiedSubdomain === art.id ? 'Tersalin!' : 'Salin Tautan'"
                >
                  <Check v-if="copiedSubdomain === art.id" :size="13" class="text-green" />
                  <Copy v-else :size="13" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="filteredArticles.length === 0" class="empty-state-box">
          <FileText :size="38" class="empty-icon" />
          <h4>Tidak ada artikel yang cocok dengan filter</h4>
          <p>Sesuaikan kata kunci pencarian atau filter kategori Anda.</p>
        </div>
      </div>

      <!-- 2. DATA TABLE VIEW (WHEN TOGGLED) -->
      <div v-else class="articles-panel">
        <div class="table-responsive">
          <table class="articles-table">
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
                  <span class="category-pill">{{ art.category }}</span>
                </td>
                <td>
                  <span class="status-badge" :class="art.status === 'published' ? 'badge-published' : 'badge-draft'">
                    <span class="status-dot"></span>
                    {{ art.status === 'published' ? 'Published' : 'Draft' }}
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
                      <Eye :size="13" />
                    </button>
                    <button class="btn-action-icon" @click="copyToClipboard(`https://rizalpratama.cloud/${art.slug}`, art.id)" :title="copiedSubdomain === art.id ? 'Tersalin!' : 'Salin Tautan'">
                      <Check v-if="copiedSubdomain === art.id" :size="13" class="text-green" />
                      <Copy v-else :size="13" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

  </section>
</template>

<style scoped>
/* Scoped Futuristic Styles for Content Articles Module */
.fade-in-section {
  animation: fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

.page-intro-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.02em;
  margin: 0 0 6px 0;
}

.page-desc {
  font-size: 13.5px;
  color: #64748b;
  margin: 0;
  max-width: 720px;
  line-height: 1.5;
}

.btn-primary-gradient {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #0f172a;
  color: #ffffff;
  border: 1px solid #0f172a;
  padding: 9px 18px;
  border-radius: 9px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.12);
}

.btn-primary-gradient:hover {
  background: #1e293b;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);
}

/* 4 Summary Cards */
.stats-overview-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

@media (max-width: 1100px) {
  .stats-overview-grid { grid-template-columns: repeat(2, 1fr); }
}

.telemetry-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 16px 18px;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.03);
}

.telemetry-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.telemetry-label {
  font-size: 11px;
  font-weight: 700;
  color: #64748b;
  letter-spacing: 0.05em;
}

.telemetry-glyph {
  width: 28px;
  height: 28px;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.telemetry-glyph.blue { background: #f0f9ff; color: #0284c7; }
.telemetry-glyph.emerald { background: #ecfdf5; color: #059669; }
.telemetry-glyph.purple { background: #f5f3ff; color: #7c3aed; }

.telemetry-val {
  font-size: 19px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.telemetry-denom {
  font-size: 13px;
  font-weight: 500;
  color: #64748b;
}

.telemetry-sub {
  font-size: 12px;
  color: #94a3b8;
}

.badge-online {
  font-size: 11px;
  font-weight: 600;
  color: #0284c7;
  background: #f0f9ff;
  padding: 2px 8px;
  border-radius: 20px;
}

.badge-growth-pill {
  font-size: 11px;
  font-weight: 600;
  color: #7c3aed;
  background: #f5f3ff;
  padding: 2px 8px;
  border-radius: 20px;
}

/* Spotlight Post Banner */
.spotlight-post-card {
  position: relative;
  background: #090d16;
  border: 1px solid #1e293b;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  overflow: hidden;
  box-shadow: 0 10px 30px -10px rgba(15, 23, 42, 0.4);
}

.spotlight-glow-layer {
  position: absolute;
  top: -50px;
  right: -50px;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, rgba(15, 23, 42, 0) 70%);
  pointer-events: none;
}

.spotlight-content {
  position: relative;
  z-index: 1;
}

.spotlight-tag-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.spotlight-fire-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 800;
  color: #f97316;
  background: rgba(249, 115, 22, 0.12);
  border: 1px solid rgba(249, 115, 22, 0.3);
  padding: 3px 9px;
  border-radius: 20px;
  letter-spacing: 0.04em;
}

.spotlight-site-tag {
  font-size: 11.5px;
  color: #94a3b8;
}

.spotlight-main-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 24px;
  flex-wrap: wrap;
}

.spotlight-info {
  flex: 1;
  min-width: 320px;
}

.spotlight-title {
  font-size: 19px;
  font-weight: 700;
  color: #f8fafc;
  margin: 0 0 8px 0;
  letter-spacing: -0.01em;
}

.spotlight-excerpt {
  font-size: 13px;
  color: #94a3b8;
  margin: 0 0 16px 0;
  line-height: 1.5;
  max-width: 780px;
}

.spotlight-meta-strip {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 12px;
  color: #cbd5e1;
  flex-wrap: wrap;
}

.s-meta-item {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.seo-score-pill {
  color: #10b981;
  background: rgba(16, 185, 129, 0.12);
  padding: 2px 7px;
  border-radius: 4px;
  font-weight: 700;
}

.spotlight-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.btn-spotlight-edit {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #2563eb;
  color: #ffffff;
  border: 1px solid #3b82f6;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-spotlight-edit:hover {
  background: #1d4ed8;
}

.btn-spotlight-copy {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #1e293b;
  color: #cbd5e1;
  border: 1px solid #334155;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-spotlight-copy:hover {
  background: #334155;
  color: #ffffff;
}

/* Editorial Toolbar */
.editorial-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

/* Custom Single-Container Search Bar (Obsidian / Studio Themed) */
.articles-search-bar {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  padding: 0 12px;
  height: 38px;
  flex: 1;
  max-width: 440px;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.03);
}

.articles-search-bar:focus-within {
  border-color: #0284c7;
  box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.12), 0 2px 5px rgba(15, 23, 42, 0.05);
}

.articles-search-icon {
  color: #94a3b8;
  flex-shrink: 0;
  transition: color 0.15s ease;
}

.articles-search-bar:focus-within .articles-search-icon {
  color: #0284c7;
}

.articles-search-input {
  flex: 1;
  border: none !important;
  outline: none !important;
  background: transparent !important;
  font-size: 13px;
  color: #0f172a;
  padding: 0;
  font-family: inherit;
  box-shadow: none !important;
}

.articles-search-input::placeholder {
  color: #94a3b8;
}

.articles-search-clear {
  background: transparent;
  border: none;
  padding: 2px;
  color: #94a3b8;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.15s ease;
}

.articles-search-clear:hover {
  color: #0f172a;
  background: #f1f5f9;
}

.articles-search-shortcut {
  font-size: 10.5px;
  font-weight: 600;
  color: #64748b;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  padding: 2px 6px;
  border-radius: 5px;
  font-family: ui-monospace, SFMono-Regular, monospace;
  cursor: pointer;
  user-select: none;
  transition: all 0.15s ease;
}

.articles-search-shortcut:hover {
  background: #e2e8f0;
  color: #0f172a;
}

.toolbar-controls-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Custom Floating Filter Dropdowns */
.custom-filter-dropdown-wrap {
  position: relative;
}

.custom-filter-trigger-btn {
  height: 35px;
  padding: 0 13px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 12.5px;
  font-weight: 600;
  color: #334155;
  background: #ffffff;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
  transition: all 0.15s ease;
  user-select: none;
}

.custom-filter-trigger-btn:hover {
  border-color: #0284c7;
  color: #0284c7;
  box-shadow: 0 2px 6px rgba(2, 132, 199, 0.12);
}

.filter-chevron {
  color: #64748b;
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.filter-chevron.rotate-180 {
  transform: rotate(180deg);
}

.custom-filter-dropdown-menu {
  position: absolute;
  top: calc(100% + 5px);
  right: 0;
  min-width: 195px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 4px;
  box-shadow: 0 12px 28px -4px rgba(15, 23, 42, 0.16), 0 4px 10px -2px rgba(15, 23, 42, 0.08);
  z-index: 150;
  display: flex;
  flex-direction: column;
  gap: 2px;
  animation: fadeIn 0.15s ease-out forwards;
}

.custom-filter-dropdown-item {
  appearance: none;
  background: transparent;
  border: none;
  width: 100%;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  color: #334155;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.12s ease;
  text-align: left;
}

.custom-filter-dropdown-item:hover {
  background: #f8fafc;
  color: #0f172a;
}

.custom-filter-dropdown-item.active {
  background: #f0f9ff;
  color: #0284c7;
  font-weight: 600;
}

.dropdown-check-icon {
  color: #0284c7;
  flex-shrink: 0;
}

.view-mode-toggle {
  display: flex;
  background: #f1f5f9;
  padding: 3px;
  border-radius: 8px;
}

.btn-view-mode {
  background: transparent;
  border: none;
  color: #64748b;
  padding: 5px 8px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-view-mode.active {
  background: #ffffff;
  color: #0f172a;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.08);
}

/* 1. VISUAL ARTICLE CARDS GRID (2 COLUMNS PER ROW) */
.articles-card-grid,
.articles-magazine-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  width: 100%;
}

@media (max-width: 768px) {
  .articles-card-grid,
  .articles-magazine-grid {
    grid-template-columns: 1fr;
  }
}

.article-visual-card,
.article-magazine-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
  display: flex;
  flex-direction: column;
  transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
  box-sizing: border-box;
}

.article-visual-card:hover,
.article-magazine-card:hover {
  transform: translateY(-3px);
  border-color: #38bdf8;
  box-shadow: 0 12px 24px -4px rgba(15, 23, 42, 0.08);
}

/* Card Cover Themes (Obsidian Slate + Cyan / Emerald / Purple / Sapphire / Amber) */
.art-card-cover {
  height: 135px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  cursor: pointer;
}

.art-cover-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 80% 20%, rgba(56, 189, 248, 0.16) 0%, transparent 60%);
  pointer-events: none;
}

.cover-cyan {
  background: linear-gradient(135deg, #070c18 0%, #032b49 55%, #0284c7 100%);
  border-top: 2px solid #00e5ff;
}

.cover-purple {
  background: linear-gradient(135deg, #090a1a 0%, #1e1145 55%, #4f46e5 100%);
  border-top: 2px solid #a855f7;
}

.cover-emerald {
  background: linear-gradient(135deg, #03130e 0%, #04412c 55%, #059669 100%);
  border-top: 2px solid #10b981;
}

.cover-sapphire {
  background: linear-gradient(135deg, #070d1d 0%, #0f2757 55%, #2563eb 100%);
  border-top: 2px solid #38bdf8;
}

.cover-amber {
  background: linear-gradient(135deg, #140d04 0%, #431f05 55%, #d97706 100%);
  border-top: 2px solid #f59e0b;
}

.cover-slate {
  background: linear-gradient(135deg, #0b0f19 0%, #1e293b 55%, #475569 100%);
  border-top: 2px solid #94a3b8;
}

.cover-top-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 2;
  gap: 8px;
}

.cover-top-right {
  display: flex;
  align-items: center;
  gap: 6px;
}

.cover-cat-pill {
  font-size: 9.5px;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: 4px;
  letter-spacing: 0.05em;
  backdrop-filter: blur(6px);
  text-transform: uppercase;
}

.pill-cyan {
  background: rgba(0, 229, 255, 0.2);
  color: #38bdf8;
  border: 1px solid rgba(0, 229, 255, 0.35);
}

.pill-purple {
  background: rgba(168, 85, 247, 0.2);
  color: #c084fc;
  border: 1px solid rgba(168, 85, 247, 0.35);
}

.pill-emerald {
  background: rgba(16, 185, 129, 0.2);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.35);
}

.pill-sapphire {
  background: rgba(59, 130, 246, 0.2);
  color: #93c5fd;
  border: 1px solid rgba(59, 130, 246, 0.35);
}

.pill-amber {
  background: rgba(245, 158, 11, 0.2);
  color: #fbbf24;
  border: 1px solid rgba(245, 158, 11, 0.35);
}

.pill-slate {
  background: rgba(148, 163, 184, 0.2);
  color: #cbd5e1;
  border: 1px solid rgba(148, 163, 184, 0.35);
}

.cover-read-time {
  font-size: 10px;
  color: #e2e8f0;
  background: rgba(0, 0, 0, 0.45);
  padding: 2px 7px;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.seo-score-pill {
  font-size: 9px;
  font-weight: 800;
  color: #10b981;
  background: rgba(16, 185, 129, 0.22);
  border: 1px solid rgba(16, 185, 129, 0.32);
  padding: 2px 6px;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  gap: 3px;
  backdrop-filter: blur(4px);
}

/* Cover Center Floating Tech Visual */
.art-cover-center {
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
  z-index: 2;
  margin: 6px 0;
}

.art-floating-icon {
  width: 38px;
  height: 38px;
  border-radius: 9px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  flex-shrink: 0;
  backdrop-filter: blur(6px);
}

.cover-dynamic-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.tag-micro-badge {
  font-size: 9px;
  font-weight: 700;
  color: #ffffff;
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: ui-monospace, SFMono-Regular, monospace;
  backdrop-filter: blur(4px);
  letter-spacing: 0.02em;
}

/* Cover Bottom Bar */
.cover-bottom-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 2;
  font-size: 11px;
}

.cover-site-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 500;
  font-size: 11px;
}

.cover-slug-chip {
  font-family: ui-monospace, SFMono-Regular, monospace;
  color: #38bdf8;
  font-size: 10px;
  background: rgba(0, 0, 0, 0.35);
  padding: 1px 6px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Card Body */
.art-card-content,
.art-card-body {
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  flex: 1;
  background: #ffffff;
}

.art-card-title {
  font-size: 14.5px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 10px 0;
  line-height: 1.4;
  height: 40px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  cursor: pointer;
  transition: color 0.15s ease;
}

.art-card-title:hover {
  color: #0284c7;
}

.art-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid #f1f5f9;
}

.art-author-row,
.art-author-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.author-avatar-mini {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #0f172a;
  color: #ffffff;
  font-size: 10px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.author-details {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.author-name {
  font-size: 11.5px;
  font-weight: 600;
  color: #0f172a;
}

.art-date {
  font-size: 10.5px;
  color: #94a3b8;
}

.art-metrics-col {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.art-views-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 700;
  color: #0f172a;
}

.art-status-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 12px;
}

.art-status-chip.chip-live {
  background: #ecfdf5;
  color: #059669;
}

.art-status-chip.chip-draft {
  background: #f1f5f9;
  color: #64748b;
}

.art-status-chip .dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: currentColor;
}

/* Card Actions Bar on hover */
.art-card-actions-bar {
  display: flex;
  gap: 6px;
  margin-top: 14px;
  padding-top: 10px;
  border-top: 1px dashed #e2e8f0;
}

.btn-card-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  color: #475569;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-card-action:hover {
  background: #f8fafc;
  color: #0f172a;
}

.btn-card-action.primary {
  flex: 1;
  background: #0f172a;
  border-color: #0f172a;
  color: #ffffff;
}

.btn-card-action.primary:hover {
  background: #1e293b;
}

.empty-state-box {
  grid-column: 1 / -1;
  text-align: center;
  padding: 48px;
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  border-radius: 14px;
}

.empty-icon {
  color: #94a3b8;
  margin-bottom: 12px;
}

.empty-state-box h4 {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 6px 0;
}

.empty-state-box p {
  font-size: 13px;
  color: #64748b;
  margin: 0 0 16px 0;
}

/* 2. TABLE VIEW */
.articles-panel {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
}

.table-responsive {
  width: 100%;
  overflow-x: auto;
}

.articles-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.articles-table th {
  padding: 12px 18px;
  font-size: 11px;
  font-weight: 700;
  color: #64748b;
  letter-spacing: 0.05em;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
}

.articles-table td {
  padding: 14px 18px;
  font-size: 13px;
  color: #334155;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
}

.articles-table tbody tr:hover td {
  background: #fafbfc;
}

.articles-table tbody tr:last-child td {
  border-bottom: none;
}

.article-title-cell {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.art-title-text {
  font-size: 13.5px;
  color: #0f172a;
}

.art-slug-box {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #64748b;
  font-size: 11.5px;
}

.art-slug-box code {
  font-family: ui-monospace, SFMono-Regular, monospace;
  color: #0284c7;
}

.site-tag {
  display: inline-block;
  font-size: 12px;
  color: #334155;
  background: #f1f5f9;
  padding: 3px 8px;
  border-radius: 6px;
  font-weight: 500;
}

.category-pill {
  display: inline-block;
  font-size: 11.5px;
  font-weight: 600;
  color: #475569;
  background: #e2e8f0;
  padding: 2px 8px;
  border-radius: 4px;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11.5px;
  font-weight: 600;
  padding: 3px 9px;
  border-radius: 20px;
}

.badge-published {
  background: #ecfdf5;
  color: #059669;
  border: 1px solid #a7f3d0;
}

.badge-draft {
  background: #f8fafc;
  color: #64748b;
  border: 1px solid #e2e8f0;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.views-cell {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  color: #0f172a;
}

.view-icon {
  color: #0284c7;
}

.date-cell {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #64748b;
}

.row-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.btn-action-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 7px;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  color: #475569;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-action-icon:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.btn-action-icon.danger:hover {
  background: #fef2f2;
  border-color: #fecaca;
  color: #dc2626;
}

/* ==========================================================================
   DEDICATED FULL-PAGE ARTICLE READER STYLES (OBSIDIAN STUDIO THEME)
   ========================================================================== */
.article-reader-page {
  animation: fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Top Action & Breadcrumb Navigation Bar */
.reader-top-action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 10px 18px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
  flex-wrap: wrap;
}

.reader-breadcrumb-nav {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12.5px;
}

.btn-reader-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  color: #334155;
  font-size: 12.5px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 7px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-reader-back:hover {
  background: #e2e8f0;
  color: #0f172a;
}

.reader-crumb-divider {
  color: #cbd5e1;
  font-weight: 400;
}

.reader-crumb-module {
  color: #64748b;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.15s ease;
}

.reader-crumb-module:hover {
  color: #0284c7;
  text-decoration: underline;
}

.reader-crumb-active {
  color: #0f172a;
  font-weight: 700;
  max-width: 320px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
}

.reader-quick-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-reader-action {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  color: #334155;
  font-size: 12px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 7px;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.15s ease;
}

.btn-reader-action:hover {
  background: #f8fafc;
  color: #0f172a;
  border-color: #94a3b8;
}

/* Reader Page Hero (Cover Palette) */
.reader-page-hero {
  position: relative;
  border-radius: 16px;
  padding: 34px 38px;
  margin-bottom: 26px;
  overflow: hidden;
  box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.12);
}

.reader-hero-decor-grid {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(255, 255, 255, 0.12) 1.2px, transparent 1.2px);
  background-size: 20px 20px;
  pointer-events: none;
  opacity: 0.7;
}

.reader-hero-inner {
  position: relative;
  z-index: 1;
}

.reader-hero-badges {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.reader-page-title {
  font-size: 28px;
  font-weight: 800;
  color: #ffffff !important;
  line-height: 1.3;
  letter-spacing: -0.02em;
  margin: 0 0 20px 0;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.45);
}

.reader-hero-meta-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.reader-author-profile {
  display: flex;
  align-items: center;
  gap: 12px;
}

.author-avatar-large {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: linear-gradient(135deg, #38bdf8, #0284c7);
  color: #ffffff;
  font-size: 14px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
}

.author-info-group {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.author-primary-name {
  color: #ffffff;
  font-weight: 700;
  font-size: 14px;
}

.author-secondary-sub {
  color: rgba(226, 232, 240, 0.85);
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.sub-sep {
  opacity: 0.6;
}

.reader-hero-metrics-strip {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.hero-metric-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 6px 14px;
  border-radius: 20px;
  color: #f8fafc;
  font-size: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.metric-num {
  font-weight: 700;
}

.metric-label {
  color: rgba(226, 232, 240, 0.75);
  font-size: 11px;
}

/* 2-Column Reader Layout Grid */
.reader-layout-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 28px;
  align-items: start;
}

@media (max-width: 1024px) {
  .reader-layout-grid {
    grid-template-columns: 1fr;
  }
}

/* Main Content Prose */
.reader-main-content {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 32px 36px;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
}

.reader-edge-callout {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 12px 16px;
  margin-bottom: 28px;
}

.callout-icon-box {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: #e0f2fe;
  color: #0284c7;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.callout-text-box {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
}

.callout-title {
  font-size: 11px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.callout-url {
  font-size: 13px;
  font-family: ui-monospace, SFMono-Regular, monospace;
  font-weight: 600;
  color: #0284c7;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.btn-copy-callout {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  color: #475569;
  width: 32px;
  height: 32px;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
  flex-shrink: 0;
}

.btn-copy-callout:hover {
  background: #f1f5f9;
  color: #0f172a;
}

/* Prose Body Typography */
.reader-prose-body {
  color: #334155;
  font-size: 14.5px;
  line-height: 1.75;
}

.reader-lead-paragraph {
  font-size: 16px;
  line-height: 1.75;
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 24px;
}

.reader-prose-body h2 {
  font-size: 19px;
  font-weight: 700;
  color: #0f172a;
  margin: 32px 0 14px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #f1f5f9;
}

.reader-prose-body p {
  margin: 0 0 16px 0;
}

.reader-prose-body code {
  font-family: ui-monospace, SFMono-Regular, monospace;
  background: #f1f5f9;
  color: #0284c7;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12.5px;
}

.reader-info-callout {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-left: 4px solid #16a34a;
  padding: 14px 16px;
  border-radius: 8px;
  margin: 24px 0;
  font-size: 13.5px;
  color: #166534;
  line-height: 1.6;
}

.info-callout-icon {
  color: #16a34a;
  flex-shrink: 0;
  margin-top: 2px;
}

/* Code Card */
.reader-code-card {
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 10px;
  overflow: hidden;
  margin: 24px 0;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);
}

.code-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  background: #1e293b;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.code-header-left {
  display: flex;
  align-items: center;
  gap: 6px;
}

.code-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.code-dot.red { background: #ef4444; }
.code-dot.yellow { background: #f59e0b; }
.code-dot.green { background: #10b981; }

.code-filename {
  font-family: ui-monospace, SFMono-Regular, monospace;
  font-size: 12px;
  color: #94a3b8;
  margin-left: 8px;
}

.btn-code-copy {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #e2e8f0;
  font-size: 11px;
  font-weight: 500;
  padding: 3px 8px;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-code-copy:hover {
  background: rgba(255, 255, 255, 0.16);
  color: #ffffff;
}

.code-pre {
  margin: 0;
  padding: 18px;
  font-family: ui-monospace, SFMono-Regular, monospace;
  font-size: 13px;
  line-height: 1.65;
  color: #e2e8f0;
  overflow-x: auto;
  background: transparent;
}

.token-keyword { color: #c084fc; font-weight: 600; }
.token-function { color: #38bdf8; font-weight: 600; }
.token-string { color: #4ade80; }
.token-type { color: #fbbf24; }
.token-comment { color: #64748b; font-style: italic; }
.token-number { color: #f472b6; }

/* Article Tags Row */
.reader-article-tags {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 32px;
  padding-top: 20px;
  border-top: 1px solid #f1f5f9;
}

.tag-lead {
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
}

.reader-tag-chip {
  background: #f1f5f9;
  color: #0284c7;
  font-size: 11.5px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 6px;
  font-family: ui-monospace, SFMono-Regular, monospace;
}

/* Bottom Pagination Navigation */
.reader-pagination-bar {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-top: 36px;
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
}

.pagination-spacer {
  flex: 1;
}

.btn-pagination-nav {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  text-align: left;
  flex: 1;
  max-width: 48%;
}

.btn-pagination-nav.next {
  text-align: right;
  justify-content: flex-end;
}

.btn-pagination-nav:hover {
  background: #ffffff;
  border-color: #0284c7;
  box-shadow: 0 4px 12px rgba(2, 132, 199, 0.1);
  transform: translateY(-2px);
}

.nav-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.nav-dir {
  font-size: 11px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.nav-title {
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}

/* Sidebar Inspector */
.reader-sidebar-inspector {
  position: sticky;
  top: 85px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.inspector-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 18px 20px;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
}

.inspector-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13.5px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 14px 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #f1f5f9;
}

.inspector-specs-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.spec-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12.5px;
}

.spec-k {
  color: #64748b;
}

.spec-v {
  color: #0f172a;
  font-weight: 600;
}

.spec-code {
  font-family: ui-monospace, SFMono-Regular, monospace;
  background: #f1f5f9;
  padding: 2px 6px;
  border-radius: 4px;
  color: #0284c7;
  font-size: 11.5px;
}

.spec-live-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: #059669;
  font-weight: 600;
  font-size: 11.5px;
}

.spec-live-pill .dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10b981;
}

.telemetry-compact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.tc-metric {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 10px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.tc-val {
  font-size: 15px;
  font-weight: 800;
  color: #0f172a;
}

.tc-lbl {
  font-size: 11px;
  color: #64748b;
}

.btn-sidebar-back-list {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  background: #0f172a;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  padding: 11px 16px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.1);
}

.btn-sidebar-back-list:hover {
  background: #1e293b;
}
</style>
