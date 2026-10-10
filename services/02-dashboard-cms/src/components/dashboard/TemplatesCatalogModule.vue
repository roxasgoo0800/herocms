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
  Palette,
  Star,
  Grid,
  Columns,
  Wand2,
  RotateCw,
  Sun,
  Moon,
  Lock,
  Wifi,
  ArrowDown,
  ShieldCheck,
  Check,
  Globe,
  FolderGit2
} from 'lucide-vue-next';
import { useDashboardData } from '../../composables/useDashboardData';
import {
  officialTemplatesData,
  marketplacePulseMetrics,
  blueprintWorkflowSteps,
  type OfficialTemplateItem
} from '../../data/templates-data';
import TemplateLiveRenderer from './TemplateLiveRenderer.vue';

const {
  officialTemplates,
  containers,
  userPlan,
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

// -----------------------------------------------------------------------------
// Interactive Fullscreen Preview Simulator State
// -----------------------------------------------------------------------------
const isPreviewOpen = ref(false);
const activePreviewTemplate = ref<OfficialTemplateItem | null>(null);
const previewDevice = ref<'desktop' | 'tablet' | 'mobile'>('desktop');
const previewAccent = ref<string>('#2563eb');
const isPreviewDarkMode = ref(false);
const previewZoomScale = ref<number>(1);
const isRefreshing = ref(false);

const handleRefreshSimulator = () => {
  isRefreshing.value = true;
  setTimeout(() => {
    isRefreshing.value = false;
  }, 450);
};

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
  isPreviewDarkMode.value = false;
  previewZoomScale.value = 1;
  isPreviewOpen.value = true;
};

// Shortcut ⌘K / Ctrl+K & ESC
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
// Apply to Active Container Modal State
// -----------------------------------------------------------------------------
const isApplyModalOpen = ref(false);
const templateToApply = ref<OfficialTemplateItem | null>(null);
const applyJumpToEditor = ref(true);
const applySelectedAccent = ref<string>('#2563eb');
const isApplying = ref(false);

const modalAccentPresets = [
  '#2563eb', // Royal Blue
  '#4f46e5', // Indigo
  '#8b5cf6', // Violet
  '#059669', // Emerald
  '#d97706', // Amber
  '#e11d48', // Rose
  '#0284c7', // Cyan Sky
  '#0f172a'  // Deep Slate
];

const openApplyModal = (tpl: OfficialTemplateItem) => {
  templateToApply.value = tpl;
  applySelectedAccent.value = tpl.accentColor || '#2563eb';
  applyJumpToEditor.value = true;
  isApplyModalOpen.value = true;
};

const handleConfirmApply = async () => {
  if (!templateToApply.value) return;
  isApplying.value = true;
  const ok = await applyTemplateToActiveContainer(
    templateToApply.value.id,
    applyJumpToEditor.value,
    applySelectedAccent.value
  );
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

      <!-- View Mode Toggle -->
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
         A. GRID VIEW MODE
         ===================================================================== -->
    <div v-if="viewMode === 'grid'" class="template-market-grid">
      <div
        v-for="tpl in filteredTemplates"
        :key="tpl.id"
        class="tpl-market-card-pro"
      >
        <div class="tpl-mockup-stage" :class="'stage-' + tpl.category" :style="{ borderBottom: `2px solid ${tpl.accentColor}` }">
          <div class="mockup-browser-shell">
            <div class="mockup-dots">
              <span></span><span></span><span></span>
            </div>
            <div class="mockup-url-pill">{{ tpl.category }}.cloudcms.app</div>
          </div>

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

          <div class="tpl-float-badges">
            <span class="tpl-type-pill">{{ tpl.category.toUpperCase() }}</span>
            <span class="tpl-tier-pill" :class="{ 'tier-pro': tpl.isPro }">
              <Sparkles v-if="tpl.isPro" :size="10" />
              {{ tpl.tier }}
            </span>
          </div>
        </div>

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

        <div class="split-preview-scroll-viewport" :style="{ maxWidth: splitDevice === 'mobile' ? '390px' : splitDevice === 'tablet' ? '768px' : '100%', margin: '0 auto' }">
          <TemplateLiveRenderer
            :template="selectedSplitTemplate"
            :accent-color="selectedSplitTemplate.accentColor"
            :device="splitDevice"
          />
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
         FULLSCREEN INTERACTIVE PREVIEW SIMULATOR MODAL (BESPOKE CHASSIS)
         ===================================================================== -->
    <Teleport to="body">
      <div v-if="isPreviewOpen && activePreviewTemplate" class="preview-simulator-overlay">
      <!-- Topbar Controls -->
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

        <!-- Center: Device Switcher, Color Picker, Zoom & Day/Night -->
        <div style="display: flex; align-items: center; gap: 14px;">
          <!-- Device Switchers -->
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

          <!-- Color Accent Picker -->
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

          <!-- Day / Night Mode Simulation Switch -->
          <button
            class="btn-device-pill"
            style="padding: 6px 10px;"
            :title="isPreviewDarkMode ? 'Mode Terang (Light)' : 'Mode Gelap (Dark)'"
            @click="isPreviewDarkMode = !isPreviewDarkMode"
          >
            <Sun v-if="isPreviewDarkMode" :size="14" style="color: #fbbf24;" />
            <Moon v-else :size="14" style="color: #94a3b8;" />
          </button>

          <!-- Zoom Scale Switcher -->
          <div class="preview-device-switchers" style="padding: 2px;">
            <button
              class="btn-device-pill"
              :class="{ active: previewZoomScale === 1 }"
              style="padding: 4px 8px; font-size: 0.7rem;"
              @click="previewZoomScale = 1"
            >
              100%
            </button>
            <button
              class="btn-device-pill"
              :class="{ active: previewZoomScale === 0.85 }"
              style="padding: 4px 8px; font-size: 0.7rem;"
              @click="previewZoomScale = 0.85"
            >
              85%
            </button>
            <button
              class="btn-device-pill"
              :class="{ active: previewZoomScale === 0.75 }"
              style="padding: 4px 8px; font-size: 0.7rem;"
              @click="previewZoomScale = 0.75"
            >
              75%
            </button>
          </div>

          <!-- Reload Simulator Button -->
          <button
            class="btn-device-pill"
            style="padding: 6px 9px;"
            title="Muat Ulang Simulasi"
            @click="handleRefreshSimulator"
          >
            <RotateCw :size="13" :class="{ 'spin-animation': isRefreshing }" />
          </button>
        </div>

        <!-- Right Action Buttons -->
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
            <span>Deploy Baru</span>
          </button>
          <button class="btn-preview-close" @click="isPreviewOpen = false" title="Tutup Pratinjau (ESC)">
            <X :size="16" />
          </button>
        </div>
      </div>

      <!-- Simulator Viewport Stage with Zoom Scaling -->
      <div class="preview-simulator-stage">
        <div
          class="preview-browser-chassis"
          :class="'device-' + previewDevice"
          :style="{
            transform: `scale(${previewZoomScale})`,
            transformOrigin: 'top center',
            transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), max-width 0.25s ease'
          }"
        >
          <!-- 1. Real macOS Chrome Bar (for Desktop & Tablet) -->
          <div v-if="previewDevice !== 'mobile'" class="preview-chassis-chrome">
            <div class="preview-chrome-dots">
              <span></span><span></span><span></span>
            </div>

            <!-- Reload Icon & URL Bar -->
            <button
              style="background: transparent; border: none; color: #64748b; cursor: pointer; display: flex; align-items: center; padding: 2px;"
              title="Refresh"
              @click="handleRefreshSimulator"
            >
              <RotateCw :size="12" :class="{ 'spin-animation': isRefreshing }" />
            </button>

            <div class="preview-chrome-address-bar">
              <Lock :size="11" style="color: #10b981;" />
              <span style="color: #0f172a; font-weight: 600;">https://{{ activePreviewTemplate.id.replace('tpl_', '') }}.cloudcms.app</span>
              <span style="margin-left: auto; font-size: 0.65rem; color: #10b981; font-weight: 700; background: #ecfdf5; padding: 1px 6px; border-radius: 4px;">
                ● 1.2ms TTFB
              </span>
            </div>
          </div>

          <!-- 2. Realistic Smartphone Hardware Bar & Notch (for Mobile) -->
          <div v-if="previewDevice === 'mobile'" class="mobile-hardware-bar">
            <span>09:41</span>
            <div class="mobile-dynamic-island"></div>
            <div style="display: flex; align-items: center; gap: 4px;">
              <Wifi :size="11" />
              <span>100%</span>
            </div>
          </div>

          <!-- Dynamic Live Renderer Content -->
          <div class="preview-chassis-content" :style="{ opacity: isRefreshing ? 0.4 : 1, transition: 'opacity 0.2s ease' }">
            <TemplateLiveRenderer
              :template="activePreviewTemplate"
              :accent-color="previewAccent"
              :is-dark-mode="isPreviewDarkMode"
              :device="previewDevice"
            />
          </div>

          <!-- Smartphone Home Indicator (for Mobile) -->
          <div v-if="previewDevice === 'mobile'" class="mobile-home-indicator-bar">
            <div class="home-notch-pill"></div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>

    <!-- MODAL TERAPKAN KE SITUS AKTIF (BESPOKE PIPELINE DESIGN) -->
    <Teleport to="body">
      <div v-if="isApplyModalOpen && templateToApply" class="modal-backdrop">
        <div class="modal-dialog blueprint-config-dialog">
          <!-- Header -->
          <div class="modal-header-bespoke">
            <div class="modal-header-info">
              <div class="modal-glyph-box" :style="{ background: `${applySelectedAccent}18`, color: applySelectedAccent }">
                <Sliders :size="20" />
              </div>
              <div class="modal-header-text">
                <h3>Terapkan Blueprint Arsitektur</h3>
                <p>Perbarui susunan blok dan tema desain pada kontainer aktif</p>
              </div>
            </div>
            <button class="btn-modal-close-bespoke" @click="isApplyModalOpen = false" title="Tutup">
              <X :size="15" />
            </button>
          </div>

          <div class="blueprint-modal-body">
            <!-- 1. Pipeline Transfer Flow Diagram -->
            <div class="pipeline-transfer-wrap">
              <!-- Source Blueprint Card -->
              <div class="blueprint-source-card" :style="{ borderLeft: `3px solid ${applySelectedAccent}` }">
                <div class="pipeline-card-lead">
                  <span class="pipeline-card-role-label">Blueprint Sumber</span>
                  <span class="pipe-meta-pill" style="color: #2563eb; background: #eff6ff; border-color: #bfdbfe;">
                    <Sparkles :size="10" /> {{ templateToApply.tier }}
                  </span>
                </div>

                <div class="blueprint-source-title-row">
                  <span class="blueprint-source-title">{{ templateToApply.title }}</span>
                  <span class="badge-status info" style="font-size: 0.65rem;">{{ templateToApply.category.toUpperCase() }}</span>
                </div>

                <p class="blueprint-source-desc">{{ templateToApply.desc }}</p>

                <div class="blueprint-source-meta-pills">
                  <span class="pipe-meta-pill">
                    <Zap :size="10" style="color: #10b981;" /> {{ templateToApply.lighthouseScore }}/100 SEO
                  </span>
                  <span class="pipe-meta-pill">
                    ⚡ {{ templateToApply.stats?.ttfb || '1.2ms' }} Latensi
                  </span>
                  <span class="pipe-meta-pill">
                    Aa {{ templateToApply.fontFamily }}
                  </span>
                  <span class="pipe-meta-pill">
                    {{ templateToApply.blocks.length }} Blok Siap Pakai
                  </span>
                </div>
              </div>

              <!-- Connector Flow Node -->
              <div class="pipeline-connector-node">
                <span class="pipeline-connector-badge">
                  <ArrowDown :size="12" class="pipeline-arrow-pulse" />
                  <span>Menerapkan Struktur Blok & Styling Ke:</span>
                </span>
              </div>

              <!-- Target Container Card -->
              <div v-if="activeContainer" class="blueprint-target-card">
                <div class="blueprint-target-header">
                  <span class="pipeline-card-role-label" style="color: #1e40af;">Kontainer Target</span>
                  <span class="target-badge-online">
                    <span class="target-pulse-dot"></span>
                    <span>Online / Siap Update</span>
                  </span>
                </div>
                <h4 class="target-container-name">{{ activeContainer.name }}</h4>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span class="target-subdomain-pill">https://{{ activeContainer.subdomain }}.cloudcms.app</span>
                  <span style="font-size: 0.72rem; color: #64748b;">(Port 80/443 Traefik)</span>
                </div>
              </div>
              <div v-else class="modal-safety-banner" style="background: #fef2f2; border-color: #fecaca; color: #991b1b;">
                <span>Peringatan: Belum ada situs kontainer yang dipilih. Silakan pilih kontainer aktif di menu Kontainer.</span>
              </div>
            </div>

            <!-- 2. Accent Color Palette Selector -->
            <div class="modal-palette-group">
              <div class="modal-palette-header">
                <span class="modal-palette-label">
                  <Palette :size="13" /> Warna Aksen Identitas
                </span>
                <span class="modal-palette-hex">{{ applySelectedAccent }}</span>
              </div>
              <div class="modal-color-swatches-row">
                <button
                  v-for="color in modalAccentPresets"
                  :key="color"
                  class="modal-swatch-dot"
                  :class="{ active: applySelectedAccent.toLowerCase() === color.toLowerCase() }"
                  :style="{ backgroundColor: color }"
                  @click="applySelectedAccent = color"
                  :title="'Pilih warna aksen: ' + color"
                >
                  <Check v-if="applySelectedAccent.toLowerCase() === color.toLowerCase()" :size="13" class="swatch-check-glyph" />
                </button>
              </div>
            </div>

            <!-- 3. iOS Style Toggle Switch -->
            <div class="modal-toggle-row" @click="applyJumpToEditor = !applyJumpToEditor">
              <div class="toggle-text-wrap">
                <span class="toggle-label-title">Buka di Visual Editor Studio</span>
                <span class="toggle-label-desc">Otomatis beralih ke kanvas visual editor untuk langsung menyunting konten</span>
              </div>
              <div class="ios-switch" :class="{ active: applyJumpToEditor }">
                <div class="ios-switch-thumb"></div>
              </div>
            </div>

            <!-- 4. Safety Assurance Notice -->
            <div class="modal-safety-banner">
              <ShieldCheck :size="16" style="flex-shrink: 0; color: #059669;" />
              <span><strong>Snapshot Aman:</strong> Cadangan kontainer dibuat otomatis. Anda selalu dapat membatalkan atau menyunting setiap blok kapan saja.</span>
            </div>
          </div>

          <!-- Footer Actions -->
          <div class="modal-footer-bespoke">
            <button class="btn-modal-ghost-bespoke" @click="isApplyModalOpen = false" :disabled="isApplying">
              Batal
            </button>
            <button
              class="btn-modal-confirm-bespoke"
              :disabled="!activeContainer || isApplying"
              @click="handleConfirmApply"
            >
              <RotateCw v-if="isApplying" :size="14" class="spin-animation" />
              <Sparkles v-else :size="14" />
              <span v-if="isApplying">Menerapkan Blueprint...</span>
              <span v-else>Terapkan Blueprint Sekarang</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- MODAL DEPLOY BLUEPRINT BARU (BESPOKE ENTERPRISE DESIGN) -->
    <Teleport to="body">
      <div v-if="isDeployModalOpen && templateToDeploy" class="modal-backdrop">
        <div class="modal-dialog blueprint-config-dialog">
          <!-- Header -->
          <div class="modal-header-bespoke">
            <div class="modal-header-info">
              <div class="modal-glyph-box" style="background: rgba(37, 99, 235, 0.12); color: #2563eb;">
                <Rocket :size="20" />
              </div>
              <div class="modal-header-text">
                <h3>Deploy Blueprint Kontainer Baru</h3>
                <p>Alokasikan kontainer mandiri terisolasi dengan cetak biru ini</p>
              </div>
            </div>
            <button class="btn-modal-close-bespoke" @click="isDeployModalOpen = false" title="Tutup">
              <X :size="15" />
            </button>
          </div>

          <div class="blueprint-modal-body">
            <!-- Blueprint Summary Strip -->
            <div class="blueprint-source-card" :style="{ borderLeft: `3px solid ${templateToDeploy.accentColor}` }">
              <div class="pipeline-card-lead">
                <span class="pipeline-card-role-label">Basis Arsitektur</span>
                <span class="badge-status running" style="font-size: 0.65rem;">
                  <Zap :size="10" /> {{ templateToDeploy.lighthouseScore }}/100 Core Web Vitals
                </span>
              </div>
              <strong style="color: #0f172a; font-size: 0.95rem;">{{ templateToDeploy.title }}</strong>
              <p class="blueprint-source-desc" style="margin-bottom: 0;">{{ templateToDeploy.desc }}</p>
            </div>

            <!-- Quota Indicator Strip -->
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px 14px; display: flex; align-items: center; justify-content: space-between;">
              <div style="font-size: 0.78rem; color: #475569;">
                Status Kuota Paket: <strong>{{ userPlan?.name || 'HeroPro' }}</strong>
              </div>
              <div style="display: flex; align-items: center; gap: 6px;">
                <span class="badge-status running" style="font-size: 0.7rem;">
                  {{ containers.length }} / {{ userPlan?.maxContainers || 3 }} Kontainer
                </span>
              </div>
            </div>

            <!-- Form Fields -->
            <div class="form-group-field">
              <label class="form-label" style="display: flex; align-items: center; gap: 6px;">
                <FolderGit2 :size="13" style="color: #2563eb;" />
                <span>Nama Situs / Brand</span>
                <span style="color: #ef4444;">*</span>
              </label>
              <input
                v-model="deployForm.name"
                type="text"
                class="form-input"
                placeholder="Contoh: Portofolio Senior Architect"
                style="font-size: 0.875rem;"
              />
            </div>

            <div class="form-group-field">
              <label class="form-label" style="display: flex; align-items: center; gap: 6px;">
                <Globe :size="13" style="color: #2563eb;" />
                <span>Subdomain Edge Cloud Traefik</span>
                <span style="color: #ef4444;">*</span>
              </label>
              <div style="display: flex; align-items: center; gap: 6px;">
                <input
                  v-model="deployForm.subdomain"
                  type="text"
                  class="form-input"
                  placeholder="nama-proyek"
                  style="font-family: monospace; font-size: 0.85rem;"
                />
                <span style="font-size: 0.82rem; color: #64748b; font-family: monospace; white-space: nowrap; background: #f1f5f9; padding: 8px 12px; border-radius: 8px; border: 1px solid #e2e8f0;">
                  .cloudcms.app
                </span>
              </div>
            </div>

            <!-- iOS Toggle Switch -->
            <div class="modal-toggle-row" @click="deployForm.jumpToEditor = !deployForm.jumpToEditor">
              <div class="toggle-text-wrap">
                <span class="toggle-label-title">Buka di Visual Editor Setelah Terdeploy</span>
                <span class="toggle-label-desc">Langsung arahkan ke kanvas studio untuk menyunting teks dan susunan komponen</span>
              </div>
              <div class="ios-switch" :class="{ active: deployForm.jumpToEditor }">
                <div class="ios-switch-thumb"></div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="modal-footer-bespoke">
            <button class="btn-modal-ghost-bespoke" @click="isDeployModalOpen = false" :disabled="isDeploying">
              Batal
            </button>
            <button
              class="btn-modal-confirm-bespoke"
              :disabled="!deployForm.name.trim() || !deployForm.subdomain.trim() || isDeploying"
              @click="handleConfirmDeploy"
            >
              <RotateCw v-if="isDeploying" :size="14" class="spin-animation" />
              <Rocket v-else :size="14" />
              <span v-if="isDeploying">Memulai Provisioning Kontainer...</span>
              <span v-else>Mulai Alokasi & Deploy</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>
