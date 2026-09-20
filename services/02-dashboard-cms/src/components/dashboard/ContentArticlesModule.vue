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
