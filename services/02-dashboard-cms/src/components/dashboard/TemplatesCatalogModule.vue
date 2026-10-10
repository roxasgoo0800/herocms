<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import {
  GraduationCap,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Zap,
  Search,
  X,
  Eye,
  Rocket,
  Sliders,
  Monitor,
  Tablet,
  Smartphone,
  ShieldCheck,
  Palette,
  Star,
  Grid,
  Columns,
  Wand2
} from 'lucide-vue-next';
import { useDashboardData } from '../../composables/useDashboardData';
import {
  officialTemplatesData,
  marketplacePulseMetrics,
  blueprintWorkflowSteps,
  type OfficialTemplateItem
} from '../../data/templates-data';

const {
  officialTemplates,
  activeContainer,
  applyTemplateToActiveContainer,
  deployContainerFromTemplate
} = useDashboardData();

const selectedCategory = ref<'all' | 'portfolio' | 'blog' | 'education' | 'business'>('all');
const searchTemplate = ref('');
const searchInputRef = ref<HTMLInputElement | null>(null);
const viewMode = ref<'grid' | 'split'>('grid');
const selectedSplitTemplate = ref<OfficialTemplateItem>(officialTemplatesData[0]);
const splitDevice = ref<'desktop' | 'tablet' | 'mobile'>('desktop');

// Shortcut ⌘K / Ctrl+K
const handleGlobalKeydown = (e: KeyboardEvent) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    searchInputRef.value?.focus();
  } else if (e.key === 'Escape') {
    if (isPreviewOpen.value) isPreviewOpen.value = false;
    if (isApplyModalOpen.value) isApplyModalOpen.value = false;
    if (isDeployModalOpen.value) isDeployModalOpen.value = false;
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
    const author = (tpl.author || '').toLowerCase();
    const tags = Array.isArray(tpl.tags) ? tpl.tags.join(' ').toLowerCase() : '';
    const matchFeatures = Array.isArray(tpl.features) && tpl.features.some((f: string) => f.toLowerCase().includes(q));

    const matchesSearch = !q ||
      title.includes(q) ||
      desc.includes(q) ||
      cat.includes(q) ||
      id.includes(q) ||
      tier.includes(q) ||
      author.includes(q) ||
      tags.includes(q) ||
      matchFeatures;

    if (!matchesSearch) return false;
    if (selectedCategory.value === 'all') return true;
    return tpl.category === selectedCategory.value;
  });
});

const featuredSpotlight = computed(() => {
  return officialTemplates.value.find(t => t.isFeatured) || officialTemplates.value[0];
});

// -----------------------------------------------------------------------------
// Interactive Fullscreen Preview Simulator State
// -----------------------------------------------------------------------------
const isPreviewOpen = ref(false);
const activePreviewTemplate = ref<OfficialTemplateItem | null>(null);
const previewDevice = ref<'desktop' | 'tablet' | 'mobile'>('desktop');
const previewAccent = ref<string>('#2563eb');

const colorPresets = [
  '#2563eb', // Royal Blue
  '#059669', // Emerald
  '#7c3aed', // Purple
  '#ea580c', // Orange
  '#0284c7', // Sky
  '#db2777'  // Rose
];

const openPreviewModal = (tpl: OfficialTemplateItem) => {
  activePreviewTemplate.value = tpl;
  previewAccent.value = tpl.accentColor || '#2563eb';
  previewDevice.value = 'desktop';
  isPreviewOpen.value = true;
};

// -----------------------------------------------------------------------------
// Apply to Active Container Modal State
// -----------------------------------------------------------------------------
const isApplyModalOpen = ref(false);
const templateToApply = ref<OfficialTemplateItem | null>(null);
const applyJumpToEditor = ref(true);
const isApplying = ref(false);

const openApplyModal = (tpl: OfficialTemplateItem) => {
  templateToApply.value = tpl;
  isApplyModalOpen.value = true;
};

const handleConfirmApply = async () => {
  if (!templateToApply.value) return;
  isApplying.value = true;
  const ok = await applyTemplateToActiveContainer(templateToApply.value.id, applyJumpToEditor.value);
  isApplying.value = false;
  if (ok) {
    isApplyModalOpen.value = false;
    if (isPreviewOpen.value) isPreviewOpen.value = false;
  }
};

// -----------------------------------------------------------------------------
// Deploy New Container Modal State
// -----------------------------------------------------------------------------
const isDeployModalOpen = ref(false);
const templateToDeploy = ref<OfficialTemplateItem | null>(null);
const deployForm = ref({
  name: '',
  subdomain: '',
  jumpToEditor: true
});
const isDeploying = ref(false);

const openDeployModal = (tpl: OfficialTemplateItem) => {
  templateToDeploy.value = tpl;
  deployForm.value.name = tpl.title.split('&')[0].trim();
  deployForm.value.subdomain = tpl.id.replace('tpl_', '').replace('_', '-');
  deployForm.value.jumpToEditor = true;
  isDeployModalOpen.value = true;
};

const handleConfirmDeploy = async () => {
  if (!templateToDeploy.value) return;
  isDeploying.value = true;
  const ok = await deployContainerFromTemplate({
    name: deployForm.value.name,
    subdomain: deployForm.value.subdomain,
    templateId: templateToDeploy.value.id,
    jumpToEditor: deployForm.value.jumpToEditor
  });
  isDeploying.value = false;
  if (ok) {
    isDeployModalOpen.value = false;
    if (isPreviewOpen.value) isPreviewOpen.value = false;
  }
};
</script>

<template>
  <section class="fade-in-section">
    <!-- Header Intro & Breadcrumb -->
    <div class="page-intro-row">
      <div>
        <h1 class="page-title">Katalog Template & Blueprint Architecture Store</h1>
        <p class="page-desc">Ekosistem arsitektur web modern siap pakai dengan integrasi Traefik v3, audit SEO 100/100, dan kesiapan deploy kontainer mandiri dalam hitungan detik.</p>
      </div>
      <div class="quota-quick-pills">
        <span class="pill-metric">Engine: <strong>Vue 3 + Visual Blocks</strong></span>
        <span class="pill-metric-highlight">Lisensi: <strong>Commercial & Client Ready</strong></span>
      </div>
    </div>

    <!-- 1. FEATURED SPOTLIGHT HERO BANNER -->
    <div v-if="featuredSpotlight" class="blueprint-spotlight-hero">
      <div class="spotlight-left-content">
        <div class="spotlight-badge-row">
          <span class="spotlight-badge-featured">
            <Sparkles :size="12" /> Blueprint Pilihan Editor
          </span>
          <span class="spotlight-badge-rating">
            <Star :size="11" fill="#fbbf24" stroke="none" /> {{ featuredSpotlight.rating || 4.98 }} ({{ featuredSpotlight.downloadsCount || 1420 }} deploy)
          </span>
          <span class="badge-status running" style="font-size: 0.7rem; padding: 2px 8px;">
            <Zap :size="11" /> {{ featuredSpotlight.lighthouseScore }}/100 Lighthouse
          </span>
        </div>

        <h2 class="spotlight-title">{{ featuredSpotlight.title }}</h2>
        <p class="spotlight-desc">{{ featuredSpotlight.desc }}</p>

        <div class="spotlight-spec-strip">
          <span class="spotlight-spec-item">Arsitek: <strong>{{ featuredSpotlight.author || 'Hero Core Studio' }}</strong></span>
          <span>•</span>
          <span class="spotlight-spec-item">Latensi: <strong>{{ featuredSpotlight.stats?.ttfb || '1.2ms' }}</strong></span>
          <span>•</span>
          <span class="spotlight-spec-item">Tata Letak: <strong>{{ featuredSpotlight.layoutType || 'Single Page Pro' }}</strong></span>
        </div>

        <div class="spotlight-actions-row">
          <button class="btn-preview-action-deploy" @click="openPreviewModal(featuredSpotlight)">
            <Eye :size="14" />
            <span>Pratinjau Interaktif</span>
          </button>
          <button class="btn-preview-action-apply" @click="openApplyModal(featuredSpotlight)">
            <Sliders :size="14" />
            <span>Terapkan ke Situs Ini</span>
          </button>
        </div>
      </div>

      <!-- Spotlight Right Realistic Mini Showcase -->
      <div class="spotlight-right-preview">
        <div class="spotlight-chassis-mockup">
          <div class="spotlight-mockup-header">
            <div class="preview-chrome-dots">
              <span></span><span></span><span></span>
            </div>
            <span style="font-family: monospace; font-size: 0.68rem; color: #94a3b8;">
              {{ featuredSpotlight.category }}.cloudcms.app
            </span>
          </div>
          <div class="spotlight-mockup-body">
            <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 8px;">
              <strong style="color: #ffffff; font-size: 0.82rem;">{{ featuredSpotlight.title.split('&')[0] }}</strong>
              <span class="badge-status running" style="font-size: 0.62rem;">Edge Ready</span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 4px;">
              <span style="font-size: 0.72rem; color: #94a3b8;">Headline:</span>
              <p style="font-size: 0.78rem; color: #e2e8f0; margin: 0; line-height: 1.35;">{{ featuredSpotlight.defaultRole }}</p>
            </div>
            <div style="display: flex; gap: 6px; margin-top: 4px;">
              <span v-for="(t, tIdx) in (featuredSpotlight.tags || []).slice(0, 3)" :key="tIdx" class="m-pill blue" style="font-size: 0.62rem;">
                {{ t }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. MARKETPLACE PULSE TELEMETRY GRID -->
    <div class="blueprint-pulse-grid">
      <div v-for="pulse in marketplacePulseMetrics" :key="pulse.id" class="pulse-card">
        <div class="pulse-info-group">
          <span class="pulse-label">{{ pulse.label }}</span>
          <span class="pulse-value">{{ pulse.value }}</span>
          <span class="pulse-sub">{{ pulse.sub }}</span>
        </div>
        <span class="pulse-badge">{{ pulse.badge }}</span>
      </div>
    </div>

    <!-- 3. MARKETPLACE FILTER & SEARCH TOOLBAR -->
    <div class="filter-toolbar" style="margin-bottom: 20px;">
      <div class="search-command-shell">
        <Search :size="15" class="search-lead-glyph" />
        <input
          ref="searchInputRef"
          v-model="searchTemplate"
          type="text"
          placeholder="Cari blueprint portofolio, media editorial, LMS, SaaS, agensi, tag teknologi..."
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
          <span>Blog & Media</span>
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
          <span>Bisnis & SaaS</span>
        </button>
      </div>

      <!-- View Mode Toggle: Grid vs Split Studio Inspector -->
      <div class="view-mode-pill-group">
        <button
          class="btn-view-mode-pill"
          :class="{ active: viewMode === 'grid' }"
          @click="viewMode = 'grid'"
          title="Tampilan Grid Katalog"
        >
          <Grid :size="14" />
          <span>Grid</span>
        </button>
        <button
          class="btn-view-mode-pill"
          :class="{ active: viewMode === 'split' }"
          @click="viewMode = 'split'"
          title="Tampilan Split Studio Inspector (Live Preview Berdampingan)"
        >
          <Columns :size="14" />
          <span>Live Studio</span>
        </button>
      </div>
    </div>

    <!-- =====================================================================
         A. GRID VIEW MODE (TAMPILAN KATALOG LUAS)
         ===================================================================== -->
    <div v-if="viewMode === 'grid'" class="template-market-grid">
      <div
        v-for="tpl in filteredTemplates"
        :key="tpl.id"
        class="tpl-market-card-pro"
      >
        <!-- Card Visual Mockup Header -->
        <div class="tpl-mockup-stage" :class="'stage-' + tpl.category" :style="{ borderBottom: `2px solid ${tpl.accentColor}` }">
          <div class="mockup-browser-shell">
            <div class="mockup-dots">
              <span></span><span></span><span></span>
            </div>
            <div class="mockup-url-pill">{{ tpl.category }}.cloudcms.app</div>
          </div>

          <!-- Dynamic Realistic Mini Canvases -->
          <div v-if="tpl.category === 'portfolio'" class="mock-canvas-portfolio">
            <div class="portfolio-hero-mini">
              <div class="avatar-badge-mini" :style="{ background: tpl.accentColor }">RP</div>
              <div class="headline-lines">
                <span class="hl-bold">{{ tpl.defaultRole || 'Senior Engineer' }}</span>
                <span class="hl-sub">Docker • Microservices • Traefik</span>
              </div>
            </div>
            <div class="mini-tag-strip">
              <span class="m-pill blue">{{ tpl.stats?.ttfb || '1.4ms' }} TTFB</span>
              <span class="m-pill emerald">{{ tpl.stats?.seo || '100%' }} SEO</span>
              <span class="m-pill purple">{{ tpl.stats?.pwa || 'PWA' }}</span>
            </div>
          </div>

          <div v-else-if="tpl.category === 'blog'" class="mock-canvas-blog">
            <div class="blog-hero-mini">
              <span class="b-cat-badge">TEKNOLOGI & PLATFORM</span>
              <h4>Arsitektur Terdistribusi Traefik v3</h4>
              <p>Panduan teknis scaling multi-tenant container...</p>
            </div>
            <div class="mini-meta-strip">
              <span>5 min baca</span> • <span>Redis Top 1</span>
            </div>
          </div>

          <div v-else-if="tpl.category === 'education'" class="mock-canvas-education">
            <div class="edu-hero-mini">
              <div class="edu-icon-circ" :style="{ color: tpl.accentColor }"><GraduationCap :size="16" /></div>
              <div>
                <strong>Masterclass Docker & Go SDK</strong>
                <span>12 Modul • 48 Video Pembelajaran</span>
              </div>
            </div>
            <div class="edu-progress-bar">
              <div class="edu-fill" :style="{ width: '70%', background: tpl.accentColor }"></div>
            </div>
          </div>

          <div v-else class="mock-canvas-business">
            <div class="biz-hero-mini">
              <div class="biz-product-card">
                <div class="biz-prod-thumb">Paket Solusi IT</div>
                <div class="biz-prod-info">
                  <strong>Arsitektur Cloud</strong>
                  <span class="biz-price">Rp 4.500.000</span>
                </div>
              </div>
              <div class="biz-wa-cta" :style="{ background: tpl.accentColor }">Order Direct WhatsApp</div>
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
              <Zap :size="11" /> {{ tpl.lighthouseScore || 100 }}/100
            </span>
          </div>

          <p class="tpl-card-desc">{{ tpl.desc }}</p>

          <div class="tpl-feature-list-wrap">
            <div v-for="(feat, fIdx) in tpl.features" :key="fIdx" class="tpl-feat-item">
              <CheckCircle2 :size="13" class="feat-check-icon" :style="{ color: tpl.accentColor }" />
              <span>{{ feat }}</span>
            </div>
          </div>
        </div>

        <!-- Card Footer Actions -->
        <div class="tpl-card-footer-pro">
          <div class="tpl-price-info">
            <span class="price-lbl">Status Lisensi:</span>
            <strong class="price-val">{{ tpl.priceText }}</strong>
          </div>
          <div class="tpl-card-actions-row">
            <button class="btn-card-preview" @click="openPreviewModal(tpl)">
              <Eye :size="14" />
              <span>Pratinjau</span>
            </button>
            <button class="btn-deploy-template" @click="openApplyModal(tpl)">
              <span>Gunakan</span>
              <ChevronRight :size="14" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- =====================================================================
         B. SPLIT STUDIO INSPECTOR MODE (LIVE PREVIEW BERDAMPINGAN)
         ===================================================================== -->
    <div v-else class="split-studio-container">
      <!-- Left: Compact Template List -->
      <div class="split-catalog-sidebar">
        <div
          v-for="tpl in filteredTemplates"
          :key="tpl.id"
          class="split-template-card"
          :class="{ active: selectedSplitTemplate?.id === tpl.id }"
          @click="selectedSplitTemplate = tpl"
        >
          <div class="split-card-thumb" :style="{ background: `linear-gradient(135deg, #0f172a 0%, ${tpl.accentColor} 100%)` }">
            <span>{{ tpl.category.slice(0, 2).toUpperCase() }}</span>
          </div>
          <div class="split-card-content">
            <div class="split-card-title-row">
              <h4 class="split-card-title">{{ tpl.title }}</h4>
              <span class="spotlight-badge-rating" style="font-size: 0.65rem;">
                ★ {{ tpl.rating || 4.95 }}
              </span>
            </div>
            <p class="split-card-desc">{{ tpl.desc }}</p>
            <div class="split-card-meta-row">
              <span>{{ tpl.author || 'Hero Core' }}</span>
              <span>•</span>
              <span style="color: #2563eb; font-weight: 700;">{{ tpl.stats?.ttfb || '1.4ms' }} TTFB</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Sticky Live Browser Simulator Pane -->
      <div class="split-preview-pane">
        <div class="split-preview-topbar">
          <div style="display: flex; align-items: center; gap: 8px;">
            <div class="preview-chrome-dots">
              <span></span><span></span><span></span>
            </div>
            <span style="color: #ffffff; font-size: 0.85rem; font-weight: 700;">
              {{ selectedSplitTemplate?.title }}
            </span>
          </div>

          <!-- Topbar Controls for Split View -->
          <div style="display: flex; align-items: center; gap: 8px;">
            <div class="preview-device-switchers">
              <button class="btn-device-pill" :class="{ active: splitDevice === 'desktop' }" @click="splitDevice = 'desktop'">
                <Monitor :size="12" />
              </button>
              <button class="btn-device-pill" :class="{ active: splitDevice === 'tablet' }" @click="splitDevice = 'tablet'">
                <Tablet :size="12" />
              </button>
              <button class="btn-device-pill" :class="{ active: splitDevice === 'mobile' }" @click="splitDevice = 'mobile'">
                <Smartphone :size="12" />
              </button>
            </div>
            <button class="btn-preview-action-apply" style="padding: 5px 10px; font-size: 0.75rem;" @click="openApplyModal(selectedSplitTemplate)">
              Terapkan
            </button>
            <button class="btn-preview-action-deploy" style="padding: 5px 12px; font-size: 0.75rem;" @click="openDeployModal(selectedSplitTemplate)">
              Deploy Baru
            </button>
          </div>
        </div>

        <!-- Rendered Split Simulator Stage -->
        <div class="split-preview-scroll-viewport" :style="{ maxWidth: splitDevice === 'mobile' ? '390px' : splitDevice === 'tablet' ? '768px' : '100%', margin: '0 auto' }">
          <div class="preview-chassis-content" :style="{ fontFamily: selectedSplitTemplate.fontFamily }">
            <header class="sim-rendered-navbar">
              <div class="sim-nav-brand" :style="{ color: selectedSplitTemplate.accentColor }">
                {{ selectedSplitTemplate.category === 'portfolio' ? 'Rizal Pratama' : selectedSplitTemplate.title.split('&')[0] }}
              </div>
              <button class="sim-nav-btn" :style="{ background: selectedSplitTemplate.accentColor }">
                Hubungi Kami
              </button>
            </header>

            <section class="sim-rendered-hero">
              <span class="sim-hero-badge" :style="{ background: `${selectedSplitTemplate.accentColor}15`, color: selectedSplitTemplate.accentColor }">
                ★ {{ selectedSplitTemplate.tier.toUpperCase() }}
              </span>
              <h2 class="sim-hero-title">
                {{ selectedSplitTemplate.defaultRole || selectedSplitTemplate.title }}
              </h2>
              <p class="sim-hero-sub">
                {{ selectedSplitTemplate.defaultBio || selectedSplitTemplate.desc }}
              </p>
              <div class="sim-hero-ctas">
                <button class="sim-btn-primary" :style="{ background: selectedSplitTemplate.accentColor }">
                  Jelajahi Solusi
                </button>
              </div>
            </section>

            <section style="padding: 16px 0; background: #fafafa;">
              <div class="sim-grid-3">
                <div v-for="(f, idx) in selectedSplitTemplate.features" :key="idx" class="sim-feature-card">
                  <strong>{{ f }}</strong>
                  <p>Dioptimalkan tanpa bloatware pihak ketiga, mendukung cache Traefik edge.</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>

    <!-- 4. BLUEPRINT WORKFLOW CONCEPT ROADMAP -->
    <div class="blueprint-workflow-strip">
      <div class="workflow-header-row">
        <h3>Filosofi Blueprint & Alur Kerja Ekosistem</h3>
        <p>Bagaimana cetak biru arsitektur HeroCMS mentransformasikan konsep desain menjadi layanan web otonom berkinerja tinggi.</p>
      </div>
      <div class="workflow-steps-grid">
        <div v-for="step in blueprintWorkflowSteps" :key="step.step" class="workflow-step-card">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span class="workflow-step-num">{{ step.step }}</span>
            <span class="workflow-step-badge">{{ step.badge }}</span>
          </div>
          <strong>{{ step.title }}</strong>
          <p>{{ step.desc }}</p>
        </div>
      </div>
    </div>

    <!-- 5. AI BLUEPRINT ARCHITECT ASSISTANT BANNER -->
    <div class="ai-blueprint-banner">
      <div class="ai-blueprint-info">
        <div class="ai-icon-circ">
          <Wand2 :size="22" />
        </div>
        <div class="ai-blueprint-text">
          <h4>Butuh Arsitektur Khusus Sesuai Karakter Bisnismu?</h4>
          <p>Deskripsikan model bisnis Anda dalam bahasa sehari-hari. AI Blueprint Architect akan menyusun modul blok visual khusus secara instan.</p>
        </div>
      </div>
      <button class="btn-ai-architect" @click="openPreviewModal(featuredSpotlight)">
        <Sparkles :size="14" />
        <span>Buka Generator AI</span>
      </button>
    </div>

    <!-- Empty State -->
    <div v-if="filteredTemplates.length === 0" class="empty-state-card" style="margin-top: 10px;">
      <Search :size="34" style="color: #94a3b8; margin-bottom: 4px;" />
      <h3>Tidak ada blueprint template ditemukan</h3>
      <p v-if="searchTemplate">
        Tidak ada blueprint yang cocok dengan kata kunci pencarian "<strong>{{ searchTemplate }}</strong>".
      </p>
      <p v-else>
        Tidak ada template untuk kategori terpilih.
      </p>
      <button class="btn-reset-filter" @click="searchTemplate = ''; selectedCategory = 'all'">
        Lihat Semua Blueprint
      </button>
    </div>

    <!-- =====================================================================
         FULLSCREEN INTERACTIVE PREVIEW SIMULATOR MODAL
         ===================================================================== -->
    <div v-if="isPreviewOpen && activePreviewTemplate" class="preview-simulator-overlay">
      <div class="preview-simulator-topbar">
        <div class="preview-meta-info">
          <div class="preview-title-wrap">
            <div class="preview-template-name">
              <span>{{ activePreviewTemplate.title }}</span>
              <span class="badge-status running" style="font-size: 0.68rem; padding: 2px 8px;">
                <Zap :size="11" /> 100/100 Lighthouse
              </span>
            </div>
            <div class="preview-meta-tags">
              <span>Kategori: <strong>{{ activePreviewTemplate.category.toUpperCase() }}</strong></span>
              <span>•</span>
              <span>Font: <strong>{{ activePreviewTemplate.fontFamily }}</strong></span>
              <span>•</span>
              <span>Latency: <strong>{{ activePreviewTemplate.stats?.ttfb || '1.2ms' }}</strong></span>
            </div>
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 16px;">
          <div class="preview-device-switchers">
            <button
              class="btn-device-pill"
              :class="{ active: previewDevice === 'desktop' }"
              @click="previewDevice = 'desktop'"
              title="Layar Desktop (1200px)"
            >
              <Monitor :size="13" />
              <span>Desktop</span>
            </button>
            <button
              class="btn-device-pill"
              :class="{ active: previewDevice === 'tablet' }"
              @click="previewDevice = 'tablet'"
              title="Layar Tablet (768px)"
            >
              <Tablet :size="13" />
              <span>Tablet</span>
            </button>
            <button
              class="btn-device-pill"
              :class="{ active: previewDevice === 'mobile' }"
              @click="previewDevice = 'mobile'"
              title="Layar Smartphone (390px)"
            >
              <Smartphone :size="13" />
              <span>Mobile</span>
            </button>
          </div>

          <div class="preview-color-selector">
            <Palette :size="14" style="color: #94a3b8; margin-right: 2px;" />
            <button
              v-for="c in colorPresets"
              :key="c"
              class="preview-color-dot"
              :class="{ active: previewAccent === c }"
              :style="{ backgroundColor: c }"
              @click="previewAccent = c"
              :title="'Uji Warna Aksen: ' + c"
            ></button>
          </div>
        </div>

        <div class="preview-actions-group">
          <button
            v-if="activeContainer"
            class="btn-preview-action-apply"
            @click="openApplyModal(activePreviewTemplate)"
          >
            <Sliders :size="14" />
            <span>Terapkan ke '{{ activeContainer.name }}'</span>
          </button>
          <button
            class="btn-preview-action-deploy"
            @click="openDeployModal(activePreviewTemplate)"
          >
            <Rocket :size="14" />
            <span>Deploy Kontainer Baru</span>
          </button>
          <button class="btn-preview-close" @click="isPreviewOpen = false" title="Tutup Pratinjau (ESC)">
            <X :size="16" />
          </button>
        </div>
      </div>

      <div class="preview-simulator-stage">
        <div class="preview-browser-chassis" :class="'device-' + previewDevice">
          <div class="preview-chassis-chrome">
            <div class="preview-chrome-dots">
              <span></span><span></span><span></span>
            </div>
            <div class="preview-chrome-address-bar">
              <ShieldCheck :size="12" style="color: #10b981;" />
              <span>https://{{ activePreviewTemplate.id.replace('tpl_', '') }}.cloudcms.app</span>
            </div>
          </div>

          <div class="preview-chassis-content" :style="{ fontFamily: activePreviewTemplate.fontFamily }">
            <header class="sim-rendered-navbar">
              <div class="sim-nav-brand" :style="{ color: previewAccent }">
                {{ activePreviewTemplate.category === 'portfolio' ? 'Rizal Pratama' : activePreviewTemplate.title.split('&')[0] }}
              </div>
              <nav class="sim-nav-links" v-if="previewDevice !== 'mobile'">
                <span>Tentang</span>
                <span>Fitur</span>
                <span>Karya</span>
                <span>Kontak</span>
              </nav>
              <button class="sim-nav-btn" :style="{ background: previewAccent }">
                Hubungi Kami
              </button>
            </header>

            <section class="sim-rendered-hero">
              <span class="sim-hero-badge" :style="{ background: `${previewAccent}15`, color: previewAccent, border: `1px solid ${previewAccent}30` }">
                ★ {{ activePreviewTemplate.tier.toUpperCase() }} • LIGHTHOUSE 100/100
              </span>
              <h2 class="sim-hero-title">
                {{ activePreviewTemplate.defaultRole || activePreviewTemplate.title }}
              </h2>
              <p class="sim-hero-sub">
                {{ activePreviewTemplate.defaultBio || activePreviewTemplate.desc }}
              </p>
              <div class="sim-hero-ctas">
                <button class="sim-btn-primary" :style="{ background: previewAccent }">
                  Mulai Sekarang
                </button>
                <button class="sim-btn-outline">
                  Pelajari Selengkapnya
                </button>
              </div>
            </section>

            <section style="padding: 24px 0; background: #fafafa; border-top: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9;">
              <div class="sim-section-header">
                <h3>Keunggulan Arsitektur & Performa</h3>
                <p>Dioptimalkan secara otonom untuk waktu muat instan dan UX responsif.</p>
              </div>
              <div class="sim-grid-3">
                <div v-for="(f, idx) in activePreviewTemplate.features" :key="idx" class="sim-feature-card">
                  <div class="sim-card-icon" :style="{ background: previewAccent }">
                    <CheckCircle2 :size="18" />
                  </div>
                  <strong>{{ f }}</strong>
                  <p>Arsitektur native tanpa bloatware pihak ketiga, mendukung cache edge Traefik v3 dan SSL otomatis.</p>
                </div>
              </div>
            </section>

            <footer class="sim-rendered-footer">
              <div>
                <strong>HeroCMS Studio Blueprint</strong> • Ditenagai oleh Traefik & Docker Container
              </div>
              <div>
                © 2026 Hak Cipta Dilindungi.
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL TERAPKAN KE SITUS AKTIF -->
    <div v-if="isApplyModalOpen && templateToApply" class="modal-backdrop">
      <div class="modal-dialog" style="max-width: 520px;">
        <div class="modal-header">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div class="stat-icon-wrapper" :style="{ background: `${templateToApply.accentColor}18`, color: templateToApply.accentColor }">
              <Sliders :size="18" />
            </div>
            <div>
              <h3 class="modal-title">Terapkan Blueprint Template</h3>
              <p class="modal-subtitle">Perbarui desain situs kontainer yang sedang aktif</p>
            </div>
          </div>
          <button class="btn-modal-close" @click="isApplyModalOpen = false"><X :size="16" /></button>
        </div>

        <div class="modal-body" style="display: flex; flex-direction: column; gap: 16px;">
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px;">
            <div style="font-size: 0.78rem; color: #64748b; margin-bottom: 4px;">Template yang dipilih:</div>
            <div style="font-size: 1rem; font-weight: 700; color: #0f172a; display: flex; align-items: center; gap: 8px;">
              <span>{{ templateToApply.title }}</span>
              <span class="badge-status info">{{ templateToApply.category.toUpperCase() }}</span>
            </div>
            <p style="font-size: 0.8125rem; color: #64748b; margin: 6px 0 0;">
              {{ templateToApply.desc }}
            </p>
          </div>

          <div v-if="activeContainer" style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px; padding: 14px;">
            <div style="font-size: 0.78rem; color: #1e40af; font-weight: 600; margin-bottom: 2px;">Situs Kontainer Target:</div>
            <div style="font-size: 0.95rem; font-weight: 700; color: #1e3a8a;">{{ activeContainer.name }}</div>
            <div style="font-size: 0.78rem; color: #3b82f6; font-family: monospace;">{{ activeContainer.subdomain }}</div>
          </div>
          <div v-else style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 10px; padding: 14px; color: #991b1b; font-size: 0.85rem;">
            Peringatan: Belum ada situs kontainer yang dipilih. Silakan pilih situs terlebih dahulu di menu Kontainer.
          </div>

          <label style="display: flex; align-items: center; gap: 10px; font-size: 0.85rem; color: #334155; cursor: pointer;">
            <input type="checkbox" v-model="applyJumpToEditor" style="width: 16px; height: 16px; accent-color: #2563eb;" />
            <span>Langsung buka dan sunting di Visual Editor setelah template diterapkan</span>
          </label>
        </div>

        <div class="modal-footer">
          <button class="btn-modal-ghost" @click="isApplyModalOpen = false" :disabled="isApplying">Batal</button>
          <button
            class="btn-modal-confirm"
            :disabled="!activeContainer || isApplying"
            @click="handleConfirmApply"
          >
            <span v-if="isApplying">Menerapkan...</span>
            <span v-else>Terapkan Blueprint</span>
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL DEPLOY BLUEPRINT BARU -->
    <div v-if="isDeployModalOpen && templateToDeploy" class="modal-backdrop">
      <div class="modal-dialog" style="max-width: 520px;">
        <div class="modal-header">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div class="stat-icon-wrapper" style="background: rgba(37, 99, 235, 0.1); color: #2563eb;">
              <Rocket :size="18" />
            </div>
            <div>
              <h3 class="modal-title">Deploy Blueprint Baru</h3>
              <p class="modal-subtitle">Alokasikan kontainer baru dengan layout ini</p>
            </div>
          </div>
          <button class="btn-modal-close" @click="isDeployModalOpen = false"><X :size="16" /></button>
        </div>

        <div class="modal-body" style="display: flex; flex-direction: column; gap: 16px;">
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px;">
            <div style="font-size: 0.75rem; color: #64748b;">Blueprint Basis:</div>
            <strong style="color: #0f172a; font-size: 0.95rem;">{{ templateToDeploy.title }}</strong>
          </div>

          <div class="form-group-field">
            <label class="form-label">Nama Situs Web <span style="color: #ef4444;">*</span></label>
            <input
              v-model="deployForm.name"
              type="text"
              class="form-input"
              placeholder="Contoh: Portal Media Baru"
            />
          </div>

          <div class="form-group-field">
            <label class="form-label">Subdomain Cloud <span style="color: #ef4444;">*</span></label>
            <div style="display: flex; align-items: center; gap: 6px;">
              <input
                v-model="deployForm.subdomain"
                type="text"
                class="form-input"
                placeholder="nama-situs"
              />
              <span style="font-size: 0.82rem; color: #64748b; font-family: monospace; white-space: nowrap;">.cloudcms.app</span>
            </div>
          </div>

          <label style="display: flex; align-items: center; gap: 10px; font-size: 0.85rem; color: #334155; cursor: pointer;">
            <input type="checkbox" v-model="deployForm.jumpToEditor" style="width: 16px; height: 16px; accent-color: #2563eb;" />
            <span>Langsung buka di Visual Editor setelah kontainer aktif</span>
          </label>
        </div>

        <div class="modal-footer">
          <button class="btn-modal-ghost" @click="isDeployModalOpen = false" :disabled="isDeploying">Batal</button>
          <button
            class="btn-modal-confirm"
            :disabled="!deployForm.name.trim() || !deployForm.subdomain.trim() || isDeploying"
            @click="handleConfirmDeploy"
          >
            <span v-if="isDeploying">Memulai Provisioning...</span>
            <span v-else>Mulai Alokasi Kontainer</span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
