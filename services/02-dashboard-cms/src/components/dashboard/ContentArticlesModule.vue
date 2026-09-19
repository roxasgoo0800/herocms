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
  Globe
} from 'lucide-vue-next';
import { useDashboardData } from '../../composables/useDashboardData';

const {
  articles,
  isCreateArticleModalOpen,
  newArticleForm,
  handleCreateArticle,
  deleteArticle,
  showToast
} = useDashboardData();

const searchQuery = ref('');
const selectedCategory = ref('all');
const selectedStatus = ref('all');

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
</script>

<template>
  <section class="fade-in-section">
    <!-- Header Intro -->
    <div class="page-intro-row">
      <div>
        <h1 class="page-title">Manajemen Artikel & Publikasi Konten</h1>
        <p class="page-desc">Kelola publikasi konten, postingan editorial, dan landing page untuk setiap kontainer tenant dengan sinkronisasi CDN dan OpenGraph otomatis.</p>
      </div>
      <button class="btn-primary-gradient" @click="isCreateArticleModalOpen = true">
        <Plus :size="15" />
        <span>Tulis Artikel Baru</span>
      </button>
    </div>

    <!-- 4 Content Telemetry Cards -->
    <div class="stats-overview-grid">
      <div class="telemetry-card">
        <div class="telemetry-top">
          <span class="telemetry-label">TOTAL KONTEN</span>
          <div class="telemetry-glyph blue"><FileText :size="15" /></div>
        </div>
        <div class="telemetry-val">{{ articles.length }} <span class="telemetry-denom">Artikel</span></div>
        <div class="telemetry-sub"><span>Di seluruh kontainer aktif</span></div>
      </div>

      <div class="telemetry-card">
        <div class="telemetry-top">
          <span class="telemetry-label">TERPUBLIKASI (LIVE)</span>
          <div class="telemetry-glyph emerald"><Check :size="15" /></div>
        </div>
        <div class="telemetry-val">{{ articles.filter(a => a.status === 'published').length }} <span class="badge-online">Live CDN</span></div>
        <div class="telemetry-sub"><span>Dapat diakses publik</span></div>
      </div>

      <div class="telemetry-card">
        <div class="telemetry-top">
          <span class="telemetry-label">DRAFT PENULISAN</span>
          <div class="telemetry-glyph purple"><Edit3 :size="15" /></div>
        </div>
        <div class="telemetry-val">{{ articles.filter(a => a.status === 'draft').length }} <span class="badge-growth-pill">WIP</span></div>
        <div class="telemetry-sub"><span>Belum dipublikasikan ke edge</span></div>
      </div>

      <div class="telemetry-card">
        <div class="telemetry-top">
          <span class="telemetry-label">TOTAL PEMBACA BULAN INI</span>
          <div class="telemetry-glyph blue"><Activity :size="15" /></div>
        </div>
        <div class="telemetry-val">{{ articles.reduce((acc, a) => acc + a.views, 0).toLocaleString('id-ID') }} <span class="badge-online">+18%</span></div>
        <div class="telemetry-sub"><span>Dihitung via Redis stream</span></div>
      </div>
    </div>

    <!-- Articles Table Panel -->
    <div class="articles-panel">
      <!-- Toolbar Filter -->
      <div class="articles-toolbar">
        <div class="search-box">
          <Search :size="14" class="search-icon" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari judul artikel, slug URL, atau nama situs..."
            class="search-input"
          />
        </div>

        <div class="filter-controls">
          <select v-model="selectedCategory" class="filter-select">
            <option value="all">Semua Kategori</option>
            <option value="Engineering">Engineering</option>
            <option value="Product">Product</option>
            <option value="Security">Security</option>
            <option value="Infrastructure">Infrastructure</option>
            <option value="Tutorial">Tutorial</option>
          </select>

          <select v-model="selectedStatus" class="filter-select">
            <option value="all">Semua Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      <!-- Table -->
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
                <span class="site-tag">
                  {{ art.siteName }}
                </span>
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
            <tr v-if="filteredArticles.length === 0">
              <td colspan="7" class="empty-state-cell">
                Tidak ada artikel yang cocok dengan kata kunci pencarian.
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
                  <option value="Product">Product</option>
                  <option value="Security">Security</option>
                  <option value="Infrastructure">Infrastructure</option>
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
              Slug URL ramah SEO otomatis, kartu OpenGraph Twitter/FB, dan sinkronisasi CDN instan ke edge.
            </div>
          </div>

          <div class="modal-footer-row">
            <button type="button" class="btn-modal-ghost" @click="isCreateArticleModalOpen = false">
              Batal
            </button>
            <button type="submit" class="btn-modal-confirm">
              <Plus :size="14" />
              <span>Simpan Artikel</span>
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

/* Articles Panel */
.articles-panel {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
}

.articles-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 18px;
  border-bottom: 1px solid #e2e8f0;
  background: #fafbfc;
  gap: 16px;
}

.search-box {
  position: relative;
  flex: 1;
  max-width: 420px;
}

.search-icon {
  position: absolute;
  left: 11px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
}

.search-input {
  width: 100%;
  box-sizing: border-box;
  padding: 8px 12px 8px 34px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 13px;
  color: #0f172a;
  outline: none;
  background: #ffffff;
}

.search-input:focus {
  border-color: #0f172a;
  box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.06);
}

.filter-controls {
  display: flex;
  gap: 10px;
}

.filter-select {
  padding: 7px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 12.5px;
  color: #334155;
  background: #ffffff;
  outline: none;
}

/* Table */
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

.empty-state-cell {
  text-align: center;
  padding: 36px !important;
  color: #94a3b8;
  font-size: 13px;
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
