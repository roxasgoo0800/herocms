<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  GraduationCap,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Zap,
  Search
} from 'lucide-vue-next';
import { useDashboardData } from '../../composables/useDashboardData';

const {
  officialTemplates,
  openCreateModal
} = useDashboardData();

const selectedCategory = ref<'all' | 'portfolio' | 'blog' | 'education' | 'business'>('all');
const searchTemplate = ref('');

const filteredTemplates = computed(() => {
  return officialTemplates.value.filter(tpl => {
    const matchesSearch = tpl.title.toLowerCase().includes(searchTemplate.value.toLowerCase()) ||
                          tpl.desc.toLowerCase().includes(searchTemplate.value.toLowerCase());
    if (!matchesSearch) return false;
    if (selectedCategory.value === 'all') return true;
    return tpl.category === selectedCategory.value;
  });
});
</script>

<template>
  <section class="fade-in-section">
    <!-- Header Intro -->
    <div class="page-intro-row">
      <div>
        <h1 class="page-title">Katalog Template Resmi & Blueprint Store</h1>
        <p class="page-desc">Pilih blueprint arsitektur web modern yang dioptimalkan untuk SEO, Lighthouse 100/100, dan integrasi PWA.</p>
      </div>
      <div class="quota-quick-pills">
        <span class="pill-metric">Engine: <strong>Vue 3 + Alpine Runtime</strong></span>
        <span class="pill-metric-highlight">Lisensi: <strong>Commercial & Client Ready</strong></span>
      </div>
    </div>

    <!-- Marketplace Filter & Search Toolbar -->
    <div class="filter-toolbar" style="margin-bottom: 24px;">
      <div class="search-command-shell">
        <Search :size="15" class="search-lead-glyph" />
        <input
          v-model="searchTemplate"
          type="text"
          placeholder="Cari template portofolio, blog editorial, kursus, UMKM..."
          class="search-command-input"
        />
        <kbd class="shortcut-tag">⌘K</kbd>
      </div>

      <div class="segmented-filter-bar">
        <button
          class="segment-pill"
          :class="{ active: selectedCategory === 'all' }"
          @click="selectedCategory = 'all'"
        >
          <span>Semua (4)</span>
        </button>
        <button
          class="segment-pill"
          :class="{ active: selectedCategory === 'portfolio' }"
          @click="selectedCategory = 'portfolio'"
        >
          <span>Portofolio</span>
        </button>
        <button
          class="segment-pill"
          :class="{ active: selectedCategory === 'blog' }"
          @click="selectedCategory = 'blog'"
        >
          <span>Blog & Editorial</span>
        </button>
        <button
          class="segment-pill"
          :class="{ active: selectedCategory === 'education' }"
          @click="selectedCategory = 'education'"
        >
          <span>Edukasi LMS</span>
        </button>
        <button
          class="segment-pill"
          :class="{ active: selectedCategory === 'business' }"
          @click="selectedCategory = 'business'"
        >
          <span>Bisnis & Toko</span>
        </button>
      </div>
    </div>

    <!-- High-End Template Grid -->
    <div class="template-market-grid">
      <div
        v-for="tpl in filteredTemplates"
        :key="tpl.id"
        class="tpl-market-card-pro"
      >
        <!-- Card Visual Mockup Header (Interactive preview canvas) -->
        <div class="tpl-mockup-stage" :class="'stage-' + tpl.category">
          <!-- Realistic UI simulation inside the card -->
          <div class="mockup-browser-shell">
            <div class="mockup-dots">
              <span></span><span></span><span></span>
            </div>
            <div class="mockup-url-pill">{{ tpl.category }}.cloudcms.app</div>
          </div>

          <!-- Specific Rich Graphic per template -->
          <div v-if="tpl.category === 'portfolio'" class="mock-canvas-portfolio">
            <div class="portfolio-hero-mini">
              <div class="avatar-badge-mini">RP</div>
              <div class="headline-lines">
                <span class="hl-bold">Senior Cloud Architect</span>
                <span class="hl-sub">Docker • Microservices • Traefik</span>
              </div>
            </div>
            <div class="mini-tag-strip">
              <span class="m-pill blue">1.8ms TTFB</span>
              <span class="m-pill emerald">100% SEO</span>
              <span class="m-pill purple">PWA Active</span>
            </div>
          </div>

          <div v-else-if="tpl.category === 'blog'" class="mock-canvas-blog">
            <div class="blog-hero-mini">
              <span class="b-cat-badge">TEKNOLOGI & CLOUD</span>
              <h4>Arsitektur Terdistribusi dengan Traefik v3</h4>
              <p>Panduan teknis scaling multi-tenant container...</p>
            </div>
            <div class="mini-meta-strip">
              <span>5 min baca</span> • <span>Redis Top 1</span>
            </div>
          </div>

          <div v-else-if="tpl.category === 'education'" class="mock-canvas-education">
            <div class="edu-hero-mini">
              <div class="edu-icon-circ"><GraduationCap :size="16" /></div>
              <div>
                <strong>Masterclass Docker & Go SDK</strong>
                <span>12 Modul • 48 Video Pembelajaran</span>
              </div>
            </div>
            <div class="edu-progress-bar">
              <div class="edu-fill" style="width: 70%"></div>
            </div>
          </div>

          <div v-else class="mock-canvas-business">
            <div class="biz-hero-mini">
              <div class="biz-product-card">
                <div class="biz-prod-thumb">Product Showcase</div>
                <div class="biz-prod-info">
                  <strong>Konsultasi Arsitektur IT</strong>
                  <span class="biz-price">Rp 4.500.000</span>
                </div>
              </div>
              <div class="biz-wa-cta">Order via WhatsApp Direct</div>
            </div>
          </div>

          <!-- Tier Badge Floating -->
          <div class="tpl-float-badges">
            <span class="tpl-type-pill">{{ tpl.category.toUpperCase() }}</span>
            <span class="tpl-tier-pill" :class="{ 'tier-pro': tpl.isPro }">
              <Sparkles v-if="tpl.isPro" :size="10" />
              {{ tpl.tier }}
            </span>
          </div>
        </div>

        <!-- Card Body -->
        <div class="tpl-card-body-pro">
          <div class="tpl-title-row">
            <h3 class="tpl-card-title">{{ tpl.title }}</h3>
            <span class="lighthouse-score">
              <Zap :size="11" /> 100/100
            </span>
          </div>

          <p class="tpl-card-desc">{{ tpl.desc }}</p>

          <div class="tpl-feature-list-wrap">
            <div v-for="(feat, fIdx) in tpl.features" :key="fIdx" class="tpl-feat-item">
              <CheckCircle2 :size="13" class="feat-check-icon" />
              <span>{{ feat }}</span>
            </div>
          </div>
        </div>

        <!-- Card Footer Action -->
        <div class="tpl-card-footer-pro">
          <div class="tpl-price-info">
            <span class="price-lbl">Lisensi Penggunaan:</span>
            <strong class="price-val">{{ tpl.priceText }}</strong>
          </div>
          <button class="btn-deploy-template" @click="openCreateModal(tpl.category)">
            <span>Gunakan Template</span>
            <ChevronRight :size="14" />
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.template-market-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

@media (max-width: 1300px) {
  .template-market-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  .template-market-grid { grid-template-columns: 1fr; }
}

.tpl-market-card-pro {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.03);
  display: flex;
  flex-direction: column;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.tpl-market-card-pro:hover {
  transform: translateY(-3px);
  border-color: #cbd5e1;
  box-shadow: 0 14px 28px -4px rgba(15, 23, 42, 0.09);
}

/* Mockup Canvas Header */
.tpl-mockup-stage {
  height: 180px;
  position: relative;
  background: #0f172a;
  padding: 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
}

.stage-portfolio { background: linear-gradient(135deg, #090d16 0%, #1e293b 60%, #1d4ed8 100%); }
.stage-blog { background: linear-gradient(135deg, #090d16 0%, #0f172a 60%, #0369a1 100%); }
.stage-education { background: linear-gradient(135deg, #090d16 0%, #1e293b 60%, #047857 100%); }
.stage-business { background: linear-gradient(135deg, #090d16 0%, #1e293b 60%, #c2410c 100%); }

.mockup-browser-shell {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(8px);
  border-radius: 6px;
  padding: 4px 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  width: fit-content;
}

.mockup-dots {
  display: flex;
  gap: 4px;
}

.mockup-dots span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
}

.mockup-url-pill {
  font-family: ui-monospace, monospace;
  font-size: 0.62rem;
  color: #94a3b8;
}

/* Specific Mini Canvases */
.mock-canvas-portfolio {
  padding: 10px 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.portfolio-hero-mini {
  display: flex;
  align-items: center;
  gap: 8px;
}

.avatar-badge-mini {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #2563eb;
  color: #ffffff;
  font-weight: 800;
  font-size: 0.68rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 10px rgba(37, 99, 235, 0.5);
}

.headline-lines {
  display: flex;
  flex-direction: column;
}

.hl-bold {
  font-size: 0.76rem;
  font-weight: 700;
  color: #ffffff;
}

.hl-sub {
  font-size: 0.62rem;
  color: #94a3b8;
}

.mini-tag-strip {
  display: flex;
  gap: 5px;
}

.m-pill {
  font-size: 0.6rem;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
}

.m-pill.blue { background: rgba(37, 99, 235, 0.3); color: #93c5fd; border: 1px solid rgba(147, 197, 253, 0.3); }
.m-pill.emerald { background: rgba(16, 185, 129, 0.3); color: #6ee7b7; border: 1px solid rgba(110, 231, 183, 0.3); }
.m-pill.purple { background: rgba(147, 51, 234, 0.3); color: #d8b4fe; border: 1px solid rgba(216, 180, 254, 0.3); }

/* Blog Mini */
.mock-canvas-blog {
  padding: 6px 0;
}

.b-cat-badge {
  font-size: 0.58rem;
  font-weight: 800;
  color: #38bdf8;
  letter-spacing: 0.06em;
}

.blog-hero-mini h4 {
  font-size: 0.78rem;
  font-weight: 700;
  color: #ffffff;
  margin: 2px 0;
  line-height: 1.25;
}

.blog-hero-mini p {
  font-size: 0.64rem;
  color: #94a3b8;
  margin: 0;
}

.mini-meta-strip {
  font-size: 0.6rem;
  color: #64748b;
  margin-top: 4px;
}

/* Education Mini */
.edu-hero-mini {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #ffffff;
}

.edu-icon-circ {
  width: 28px;
  height: 28px;
  border-radius: 7px;
  background: rgba(16, 185, 129, 0.25);
  color: #34d399;
  display: flex;
  align-items: center;
  justify-content: center;
}

.edu-hero-mini strong {
  font-size: 0.75rem;
  display: block;
}

.edu-hero-mini span {
  font-size: 0.62rem;
  color: #94a3b8;
}

.edu-progress-bar {
  height: 4px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 999px;
  margin-top: 8px;
  overflow: hidden;
}

.edu-fill {
  height: 100%;
  background: #10b981;
}

/* Biz Mini */
.biz-hero-mini {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.biz-product-card {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 6px 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.biz-prod-thumb {
  font-size: 0.62rem;
  color: #94a3b8;
}

.biz-prod-info {
  text-align: right;
}

.biz-prod-info strong {
  font-size: 0.68rem;
  color: #ffffff;
  display: block;
}

.biz-price {
  font-size: 0.64rem;
  color: #fb923c;
  font-weight: 700;
}

.biz-wa-cta {
  font-size: 0.62rem;
  font-weight: 700;
  color: #ffffff;
  background: #16a34a;
  padding: 4px 8px;
  border-radius: 4px;
  text-align: center;
}

/* Float Badges */
.tpl-float-badges {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tpl-type-pill {
  font-size: 0.62rem;
  font-weight: 800;
  color: #ffffff;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(6px);
  padding: 2px 7px;
  border-radius: 4px;
  letter-spacing: 0.06em;
}

.tpl-tier-pill {
  font-size: 0.62rem;
  font-weight: 700;
  color: #34d399;
  background: rgba(16, 185, 129, 0.2);
  border: 1px solid rgba(52, 211, 153, 0.3);
  padding: 2px 8px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 3px;
}

.tpl-tier-pill.tier-pro {
  color: #a78bfa;
  background: rgba(139, 92, 246, 0.2);
  border-color: rgba(167, 139, 250, 0.3);
}

/* Card Body */
.tpl-card-body-pro {
  padding: 18px 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.tpl-title-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 6px;
}

.tpl-card-title {
  font-size: 0.96rem;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.01em;
  margin: 0;
}

.lighthouse-score {
  font-size: 0.66rem;
  font-weight: 800;
  color: #059669;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  padding: 2px 6px;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  gap: 3px;
}

.tpl-card-desc {
  font-size: 0.78rem;
  color: #64748b;
  line-height: 1.45;
  margin: 0 0 14px 0;
}

.tpl-feature-list-wrap {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: auto;
  padding-top: 10px;
  border-top: 1px solid #f1f5f9;
}

.tpl-feat-item {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 0.74rem;
  color: #475569;
}

.feat-check-icon {
  color: #10b981;
  flex-shrink: 0;
}

/* Footer Action */
.tpl-card-footer-pro {
  padding: 14px 20px;
  background: #f8fafc;
  border-top: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.price-lbl {
  display: block;
  font-size: 0.65rem;
  color: #94a3b8;
}

.price-val {
  font-size: 0.8rem;
  font-weight: 700;
  color: #0f172a;
}

.btn-deploy-template {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: #0f172a;
  color: #ffffff;
  border: none;
  padding: 7px 14px;
  border-radius: 8px;
  font-size: 0.76rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.btn-deploy-template:hover {
  background: #2563eb;
  transform: translateY(-1px);
}
</style>
