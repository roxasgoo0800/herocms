<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import {
  GraduationCap,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Zap,
  Search,
  X
} from 'lucide-vue-next';
import { useDashboardData } from '../../composables/useDashboardData';

const {
  officialTemplates,
  openCreateModal
} = useDashboardData();

const selectedCategory = ref<'all' | 'portfolio' | 'blog' | 'education' | 'business'>('all');
const searchTemplate = ref('');
const searchInputRef = ref<HTMLInputElement | null>(null);

const handleGlobalKeydown = (e: KeyboardEvent) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    searchInputRef.value?.focus();
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleGlobalKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown);
});

const filteredTemplates = computed(() => {
  const q = searchTemplate.value.trim().toLowerCase();
  return officialTemplates.value.filter(tpl => {
    if (!tpl) return false;
    const title = (tpl.title || '').toLowerCase();
    const desc = (tpl.desc || '').toLowerCase();
    const cat = (tpl.category || '').toLowerCase();
    const id = (tpl.id || '').toLowerCase();
    const tier = (tpl.tier || '').toLowerCase();
    const matchFeatures = Array.isArray(tpl.features) && tpl.features.some((f: string) => f.toLowerCase().includes(q));

    const matchesSearch = !q ||
                          title.includes(q) ||
                          desc.includes(q) ||
                          cat.includes(q) ||
                          id.includes(q) ||
                          tier.includes(q) ||
                          matchFeatures;

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
          ref="searchInputRef"
          v-model="searchTemplate"
          type="text"
          placeholder="Cari template portofolio, blog editorial, kursus, UMKM..."
          class="search-command-input"
        />
        <button v-if="searchTemplate" class="btn-clear-search" @click="searchTemplate = ''" title="Bersihkan">
          <X :size="13" />
        </button>
        <kbd class="shortcut-tag">⌘K</kbd>
      </div>

      <div class="segmented-filter-bar">
        <button
          class="segment-pill"
          :class="{ active: selectedCategory === 'all' }"
          @click="selectedCategory = 'all'"
        >
          <span>Semua ({{ officialTemplates.length }})</span>
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

    <!-- Empty State for Template Search / Filter -->
    <div v-if="filteredTemplates.length === 0" class="empty-state-card" style="margin-top: 10px;">
      <Search :size="34" style="color: #94a3b8; margin-bottom: 4px;" />
      <h3>Tidak ada blueprint template ditemukan</h3>
      <p v-if="searchTemplate">
        Tidak ada template yang cocok dengan kata kunci pencarian "<strong>{{ searchTemplate }}</strong>".
      </p>
      <p v-else>
        Tidak ada template untuk kategori terpilih.
      </p>
      <button class="btn-reset-filter" @click="searchTemplate = ''; selectedCategory = 'all'">
        Lihat Semua Template
      </button>
    </div>
  </section>
</template>
