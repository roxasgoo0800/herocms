<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  FileText,
  Plus,
  Check,
  Edit3,
  Activity,
  Trash2,
  X,
  Sparkles,
  Search,
  Eye,
  Calendar,
  Globe,
  LayoutGrid,
  List,
  Clock,
  Zap,
  Flame,
  Copy
} from 'lucide-vue-next';
import { useDashboardData } from '../../composables/useDashboardData';

const {
  articles,
  isCreateArticleModalOpen,
  newArticleForm,
  handleCreateArticle,
  deleteArticle,
  showToast,
  copyToClipboard,
  copiedSubdomain
} = useDashboardData();

const searchQuery = ref('');
const selectedCategory = ref('all');
const selectedStatus = ref('all');
const viewMode = ref<'grid' | 'table'>('grid');

const filteredArticles = computed(() => {
  return articles.value.filter(art => {
    const matchesSearch = art.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          art.slug.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          art.siteName.toLowerCase().includes(searchQuery.value.toLowerCase());
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
  if (cat === 'Engineering') return 'blue';
  if (cat === 'Distributed Systems') return 'purple';
  if (cat === 'DevOps') return 'emerald';
  if (cat === 'Security') return 'rose';
  return 'amber';
};
</script>

<template>
  <section class="fade-in-section">
    <!-- Header Intro -->
    <div class="page-intro-row">
      <div>
        <h1 class="page-title">Manajemen Artikel & Editorial Studio</h1>
        <p class="page-desc">Kelola publikasi konten, postingan editorial teknis, dan landing page untuk setiap kontainer tenant dengan sinkronisasi CDN Traefik dan OpenGraph otomatis.</p>
      </div>
      <div class="header-action-group">
        <button class="btn-primary-gradient" @click="isCreateArticleModalOpen = true">
          <Plus :size="15" />
          <span>Tulis Artikel Baru</span>
        </button>
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
            <h2 class="spotlight-title">{{ trendingArticle.title }}</h2>
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
              @click="showToast(`Membuka editor untuk '${trendingArticle.title}'...`, 'info')"
            >
              <Edit3 :size="14" />
              <span>Edit di Visual Editor</span>
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
      <div class="search-command-shell">
        <Search :size="15" class="search-lead-glyph" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari judul artikel, slug URL, kata kunci, topik..."
          class="search-command-input"
        />
        <kbd class="shortcut-tag">⌘K</kbd>
      </div>

      <div class="toolbar-controls-right">
        <!-- Category Filter -->
        <select v-model="selectedCategory" class="filter-dropdown">
          <option value="all">Semua Kategori ({{ articles.length }})</option>
          <option value="Engineering">Engineering</option>
          <option value="Distributed Systems">Distributed Systems</option>
          <option value="DevOps">DevOps</option>
          <option value="Security">Security</option>
          <option value="Tutorial">Tutorial</option>
        </select>

        <!-- Status Filter -->
        <select v-model="selectedStatus" class="filter-dropdown">
          <option value="all">Semua Status</option>
          <option value="published">Published (Live)</option>
          <option value="draft">Draft (WIP)</option>
        </select>

        <!-- View Mode Switcher -->
        <div class="view-mode-toggle">
          <button
            class="btn-view-mode"
            :class="{ active: viewMode === 'grid' }"
            @click="viewMode = 'grid'"
            title="Tampilan Visual Card"
          >
            <LayoutGrid :size="15" />
          </button>
          <button
            class="btn-view-mode"
            :class="{ active: viewMode === 'table' }"
            @click="viewMode = 'table'"
            title="Tampilan Tabel Data"
          >
            <List :size="15" />
          </button>
        </div>
      </div>
    </div>

    <!-- 1. VISUAL MAGAZINE CARDS GRID (DEFAULT) -->
    <div v-if="viewMode === 'grid'" class="articles-magazine-grid">
      <div
        v-for="art in filteredArticles"
        :key="art.id"
        class="article-magazine-card"
      >
        <!-- Card Header Banner -->
        <div class="art-card-cover" :class="'cover-' + getCategoryColor(art.category)">
          <div class="cover-watermark">
            <code>/{{ art.slug }}</code>
          </div>

          <div class="cover-top-tags">
            <span class="cover-cat-pill">{{ art.category.toUpperCase() }}</span>
            <span class="cover-read-time">{{ getReadTime(art.title) }}</span>
          </div>

          <div class="cover-tech-tags">
            <span>#TECH</span>
            <span>#TRAEFIK</span>
            <span>#DOCKER</span>
          </div>

          <span class="cover-seo-tag">
            <Zap :size="10" /> 100/100
          </span>
        </div>

        <!-- Card Body -->
        <div class="art-card-body">
          <div class="art-card-site-name">
            <Globe :size="12" />
            <span>{{ art.siteName }}</span>
          </div>

          <h3 class="art-card-title" :title="art.title">
            {{ art.title }}
          </h3>

          <div class="art-card-slug-line">
            <code>/{{ art.slug }}</code>
          </div>

          <!-- Footer Metadata -->
          <div class="art-card-footer">
            <div class="art-author-info">
              <div class="author-avatar-mini">RP</div>
              <div class="author-details">
                <span class="author-name">{{ art.author }}</span>
                <span class="art-date">{{ art.publishedAt }}</span>
              </div>
            </div>

            <div class="art-metrics-col">
              <div class="art-views-badge">
                <Eye :size="12" class="view-glyph" />
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

          <!-- Card Hover Action Overlay -->
          <div class="art-card-actions-bar">
            <button
              class="btn-card-action primary"
              @click="showToast(`Membuka Visual Studio untuk '${art.title}'...`, 'info')"
            >
              <Edit3 :size="13" />
              <span>Edit Konten</span>
            </button>
            <button
              class="btn-card-action"
              @click="copyToClipboard(`https://rizalpratama.cloud/${art.slug}`, art.id)"
              :title="copiedSubdomain === art.id ? 'Tersalin!' : 'Salin Tautan'"
            >
              <Check v-if="copiedSubdomain === art.id" :size="13" class="text-green" />
              <Copy v-else :size="13" />
            </button>
            <button
              class="btn-card-action danger"
              @click="deleteArticle(art)"
              title="Hapus Artikel"
            >
              <Trash2 :size="13" />
            </button>
          </div>
        </div>
      </div>

      <div v-if="filteredArticles.length === 0" class="empty-state-box">
        <FileText :size="38" class="empty-icon" />
        <h4>Tidak ada artikel yang cocok dengan filter</h4>
        <p>Sesuaikan kata kunci pencarian atau buat publikasi editorial baru.</p>
        <button class="btn-primary-gradient" @click="isCreateArticleModalOpen = true">
          <Plus :size="14" />
          <span>Tulis Artikel Baru</span>
        </button>
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
                <div class="article-title-cell">
                  <strong class="art-title-text">{{ art.title }}</strong>
                  <div class="art-slug-box">
                    <Globe :size="11" />
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
                  <button class="btn-action-icon" @click="showToast(`Membuka Visual Editor untuk '${art.title}'...`, 'info')" title="Buka di Editor">
                    <Edit3 :size="13" />
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

    <!-- MODAL: TULIS ARTIKEL BARU -->
    <div v-if="isCreateArticleModalOpen" class="modal-backdrop" @click.self="isCreateArticleModalOpen = false">
      <div class="modal-dialog">
        <div class="modal-header">
          <div class="modal-header-leading">
            <div class="modal-header-icon-box">
              <FileText :size="18" />
            </div>
            <div>
              <h3 class="modal-heading">Tulis Artikel Baru</h3>
              <p class="modal-subheading">Publikasikan konten editorial langsung ke runtime engine kontainer Anda.</p>
            </div>
          </div>
          <button class="modal-close-button" @click="isCreateArticleModalOpen = false" title="Tutup">
            <X :size="16" />
          </button>
        </div>

        <form @submit.prevent="handleCreateArticle" class="modal-form-body">
          <div class="form-group-block">
            <label class="input-label-row">
              <span class="label-text">Judul Artikel / Post</span>
              <span class="label-badge-optional">Wajib</span>
            </label>
            <div class="input-field-wrapper">
              <input
                v-model="newArticleForm.title"
                type="text"
                class="form-text-input"
                placeholder="Contoh: Panduan Mengoptimasi CDN & Caching HeroCMS"
                required
                autofocus
              />
            </div>
          </div>

          <div class="form-row-duo">
            <div class="form-group-block">
              <label class="input-label-row">
                <span class="label-text">Kategori Topik</span>
              </label>
              <div class="input-field-wrapper">
                <select v-model="newArticleForm.category" class="form-text-input form-select-input">
                  <option value="Engineering">Engineering</option>
                  <option value="Distributed Systems">Distributed Systems</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Security">Security</option>
                  <option value="Tutorial">Tutorial</option>
                </select>
              </div>
            </div>

            <div class="form-group-block">
              <label class="input-label-row">
                <span class="label-text">Status Penerbitan</span>
              </label>
              <div class="input-field-wrapper">
                <select v-model="newArticleForm.status" class="form-text-input form-select-input">
                  <option value="published">Langsung Publish (Live)</option>
                  <option value="draft">Simpan sebagai Draft</option>
                </select>
              </div>
            </div>
          </div>

          <div class="resource-spec-callout">
            <Sparkles :size="14" class="spec-callout-icon" />
            <div class="spec-callout-text">
              <span>Optimasi Otomatis: </span>
              Slug URL ramah SEO otomatis, kartu OpenGraph Twitter/FB, dan sinkronisasi CDN instan ke edge Traefik v3.
            </div>
          </div>

          <div class="modal-footer-row">
            <button type="button" class="btn-modal-ghost" @click="isCreateArticleModalOpen = false">
              Batal
            </button>
            <button type="submit" class="btn-modal-confirm">
              <Plus :size="14" />
              <span>Simpan & Publikasikan</span>
            </button>
          </div>
        </form>
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

.search-command-shell {
  position: relative;
  flex: 1;
  max-width: 420px;
}

.search-lead-glyph {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
}

.search-command-input {
  width: 100%;
  box-sizing: border-box;
  padding: 8px 45px 8px 36px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 12.5px;
  color: #0f172a;
  outline: none;
  background: #ffffff;
}

.search-command-input:focus {
  border-color: #0f172a;
  box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.06);
}

.shortcut-tag {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 10px;
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  padding: 1px 5px;
  border-radius: 4px;
  color: #64748b;
}

.toolbar-controls-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-dropdown {
  padding: 7px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 12.5px;
  color: #334155;
  background: #ffffff;
  outline: none;
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

/* 1. VISUAL MAGAZINE CARDS GRID */
.articles-magazine-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

@media (max-width: 1180px) {
  .articles-magazine-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 680px) {
  .articles-magazine-grid { grid-template-columns: 1fr; }
}

.article-magazine-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.03);
  display: flex;
  flex-direction: column;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.article-magazine-card:hover {
  transform: translateY(-3px);
  border-color: #cbd5e1;
  box-shadow: 0 12px 24px -4px rgba(15, 23, 42, 0.08);
}

/* Card Cover Themes */
.art-card-cover {
  height: 120px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
}

.cover-blue { background: linear-gradient(135deg, #0f172a, #1e3a8a); }
.cover-purple { background: linear-gradient(135deg, #090d16, #4c1d95); }
.cover-emerald { background: linear-gradient(135deg, #064e3b, #022c22); }
.cover-rose { background: linear-gradient(135deg, #4c0519, #881337); }
.cover-amber { background: linear-gradient(135deg, #451a03, #78350f); }

.cover-watermark {
  position: absolute;
  right: -5px;
  bottom: 5px;
  opacity: 0.15;
}

.cover-watermark code {
  font-size: 20px;
  font-weight: 800;
  color: #ffffff;
  font-family: ui-monospace, monospace;
}

.cover-top-tags {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1;
}

.cover-cat-pill {
  font-size: 10px;
  font-weight: 800;
  color: #f8fafc;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(4px);
  padding: 2px 7px;
  border-radius: 4px;
  letter-spacing: 0.04em;
}

.cover-read-time {
  font-size: 10.5px;
  color: #e2e8f0;
  background: rgba(0, 0, 0, 0.3);
  padding: 2px 6px;
  border-radius: 4px;
}

.cover-tech-tags {
  display: flex;
  gap: 6px;
  position: relative;
  z-index: 1;
}

.cover-tech-tags span {
  font-size: 9px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.7);
  letter-spacing: 0.05em;
}

.cover-seo-tag {
  position: absolute;
  right: 12px;
  top: 14px;
  font-size: 9.5px;
  font-weight: 800;
  color: #10b981;
  background: rgba(16, 185, 129, 0.2);
  padding: 2px 6px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 3px;
}

/* Card Body */
.art-card-body {
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.art-card-site-name {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: #64748b;
  margin-bottom: 6px;
}

.art-card-title {
  font-size: 14.5px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 8px 0;
  line-height: 1.4;
  height: 40px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.art-card-slug-line {
  margin-bottom: 16px;
}

.art-card-slug-line code {
  font-family: ui-monospace, monospace;
  font-size: 11px;
  color: #0284c7;
  background: #f0f9ff;
  padding: 2px 6px;
  border-radius: 4px;
}

.art-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid #f1f5f9;
}

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
}

.author-details {
  display: flex;
  flex-direction: column;
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

.view-glyph {
  color: #0284c7;
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

.btn-card-action.danger:hover {
  background: #fee2e2;
  border-color: #fecaca;
  color: #dc2626;
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

/* Modal */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

.modal-dialog {
  background: #ffffff;
  border-radius: 16px;
  width: 100%;
  max-width: 540px;
  box-shadow: 0 20px 40px -10px rgba(15, 23, 42, 0.2);
  border: 1px solid #e2e8f0;
  overflow: hidden;
  animation: modalScale 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modalScale {
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1); }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 18px 24px;
  border-bottom: 1px solid #f1f5f9;
}

.modal-header-leading {
  display: flex;
  gap: 12px;
}

.modal-header-icon-box {
  width: 38px;
  height: 38px;
  border-radius: 9px;
  background: #f1f5f9;
  color: #0f172a;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.modal-heading {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 3px 0;
}

.modal-subheading {
  font-size: 12.5px;
  color: #64748b;
  margin: 0;
}

.modal-close-button {
  background: transparent;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
}

.modal-close-button:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.modal-form-body {
  padding: 20px 24px;
}

.form-group-block {
  margin-bottom: 18px;
}

.input-label-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #334155;
}

.label-badge-optional {
  color: #64748b;
  font-size: 11px;
}

.form-text-input {
  width: 100%;
  box-sizing: border-box;
  padding: 9px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 13px;
  color: #0f172a;
  outline: none;
  transition: all 0.15s ease;
}

.form-text-input:focus {
  border-color: #0f172a;
  box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.08);
}

.form-row-duo {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.resource-spec-callout {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  padding: 10px 12px;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 20px;
}

.spec-callout-icon {
  color: #16a34a;
  flex-shrink: 0;
  margin-top: 1px;
}

.spec-callout-text {
  font-size: 12px;
  color: #166534;
  line-height: 1.4;
}

.spec-callout-text span {
  font-weight: 700;
}

.modal-footer-row {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn-modal-ghost {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  color: #475569;
  padding: 9px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.btn-modal-ghost:hover {
  background: #f8fafc;
  color: #0f172a;
}

.btn-modal-confirm {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #0f172a;
  border: 1px solid #0f172a;
  color: #ffffff;
  padding: 9px 18px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.btn-modal-confirm:hover {
  background: #1e293b;
}
</style>
