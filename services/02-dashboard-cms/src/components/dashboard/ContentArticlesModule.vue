<script setup lang="ts">
import {
  FileText,
  Plus,
  Check,
  Edit3,
  Activity,
  Trash2,
  X,
  Sparkles
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
</script>

<template>
  <section class="fade-in-section">
    <div class="page-intro-row">
      <div>
        <h1 class="page-title">Manajemen Artikel & Halaman</h1>
        <p class="page-desc">Kelola publikasi konten, postingan editorial, dan halaman statis untuk setiap kontainer tenant.</p>
      </div>
      <button class="btn-top-create" @click="isCreateArticleModalOpen = true">
        <Plus :size="15" />
        <span>Buat Artikel Baru</span>
      </button>
    </div>

    <!-- Content Stats Strip -->
    <div class="stats-overview-grid">
      <div class="telemetry-card">
        <div class="telemetry-top">
          <span class="telemetry-label">TOTAL KONTEN</span>
          <div class="telemetry-glyph blue"><FileText :size="15" /></div>
        </div>
        <div class="telemetry-val">{{ articles.length }} <span class="telemetry-denom">Artikel</span></div>
        <div class="telemetry-sub"><span>Di seluruh kontainer</span></div>
      </div>
      <div class="telemetry-card">
        <div class="telemetry-top">
          <span class="telemetry-label">TERPUBLIKASI (LIVE)</span>
          <div class="telemetry-glyph emerald"><Check :size="15" /></div>
        </div>
        <div class="telemetry-val">{{ articles.filter(a => a.status === 'published').length }} <span class="badge-online">Live</span></div>
        <div class="telemetry-sub"><span>Dapat diakses publik</span></div>
      </div>
      <div class="telemetry-card">
        <div class="telemetry-top">
          <span class="telemetry-label">DRAFT PENULISAN</span>
          <div class="telemetry-glyph purple"><Edit3 :size="15" /></div>
        </div>
        <div class="telemetry-val">{{ articles.filter(a => a.status === 'draft').length }} <span class="telemetry-denom">Draft</span></div>
        <div class="telemetry-sub"><span>Belum dipublikasikan</span></div>
      </div>
      <div class="telemetry-card">
        <div class="telemetry-top">
          <span class="telemetry-label">TOTAL PEMBACA</span>
          <div class="telemetry-glyph blue"><Activity :size="15" /></div>
        </div>
        <div class="telemetry-val">{{ articles.reduce((acc, a) => acc + a.views, 0).toLocaleString('id-ID') }} <span class="badge-growth-pill">+18%</span></div>
        <div class="telemetry-sub"><span>Dihitung via Redis stream</span></div>
      </div>
    </div>

    <!-- Articles Table Panel -->
    <div class="pro-panel">
      <div class="panel-head">
        <h3>Daftar Artikel & Publikasi</h3>
        <span class="redis-chip">CMS Post Engine</span>
      </div>
      <div class="table-responsive">
        <table class="pro-table">
          <thead>
            <tr>
              <th>JUDUL ARTIKEL</th>
              <th>TARGET SITUS</th>
              <th>KATEGORI</th>
              <th>STATUS</th>
              <th>VIEWS</th>
              <th>TANGGAL</th>
              <th style="text-align: right">AKSI</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="art in articles" :key="art.id">
              <td>
                <div class="article-title-cell">
                  <strong>{{ art.title }}</strong>
                  <span class="article-slug-text">/{{ art.slug }}</span>
                </div>
              </td>
              <td><span class="site-tag">{{ art.siteName }}</span></td>
              <td><span class="category-pill">{{ art.category }}</span></td>
              <td>
                <span class="status-badge" :class="art.status === 'published' ? 'badge-published' : 'badge-draft'">
                  {{ art.status === 'published' ? 'Published' : 'Draft' }}
                </span>
              </td>
              <td><span class="views-cell">{{ art.views.toLocaleString('id-ID') }}</span></td>
              <td><span class="date-cell">{{ art.publishedAt }}</span></td>
              <td style="text-align: right">
                <div class="row-actions">
                  <button class="btn-action-icon" @click="showToast(`Membuka editor artikel '${art.title}'...`, 'info')" title="Edit Artikel">
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
                  <option value="published">Langsung Publish</option>
                  <option value="draft">Simpan sebagai Draft</option>
                </select>
              </div>
            </div>
          </div>

          <div class="resource-spec-callout">
            <Sparkles :size="13" class="spec-callout-icon" />
            <div class="spec-callout-text">
              <span>Optimasi Otomatis: </span>
              Slug URL SEO friendly, format Markdown/Rich text, dan sinkronisasi CDN instan.
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
