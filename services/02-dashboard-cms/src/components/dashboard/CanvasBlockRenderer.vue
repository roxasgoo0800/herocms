<script setup lang="ts">
import { computed } from 'vue';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Cpu,
  Database,
  Edit3,
  Globe,
  HardDrive,
  Key,
  Layers,
  Lock,
  Plus,
  Rocket,
  Server,
  Shield,
  ShieldCheck,
  Sliders,
  Sparkles,
  Star,
  Terminal,
  TrendingUp,
  UploadCloud,
  Workflow,
  X,
  Zap,
  Award,
  Activity,
  Box,
  Cloud,
  Code2
} from 'lucide-vue-next';
import type { VisualBlock } from '../../types/dashboard';

const props = withDefaults(
  defineProps<{
    block: VisualBlock;
    accentColor?: string;
    isSelected?: boolean;
    previewMode?: boolean;
    navItems?: Array<{ id?: string; title: string; url?: string; active?: boolean }>;
    activePagePath?: string;
    multiPagesCount?: number;
    handlers?: Record<string, (...args: any[]) => any>;
  }>(),
  {
    accentColor: '#2563eb',
    isSelected: false,
    previewMode: false,
    navItems: undefined,
    activePagePath: '/',
    multiPagesCount: 1,
    handlers: () => ({})
  }
);

const iconComponentMap: Record<string, any> = {
  server: Server,
  cloud: Cloud,
  database: Database,
  cpu: Cpu,
  'hard-drive': HardDrive,
  terminal: Terminal,
  'code-2': Code2,
  code: Code2,
  box: Box,
  'shield-check': ShieldCheck,
  shield: Shield,
  lock: Lock,
  key: Key,
  globe: Globe,
  'trending-up': TrendingUp,
  zap: Zap,
  activity: Activity,
  rocket: Rocket,
  check: Check,
  sparkles: Sparkles,
  layers: Layers,
  award: Award,
  star: Star,
  sliders: Sliders
};

const getIconComponent = (iconName?: string) => {
  if (!iconName) return Server;
  return iconComponentMap[iconName] || Server;
};

const isEditable = computed(() => !props.previewMode && props.isSelected);
const effectiveAccent = computed(() => props.block.styles?.accentColor || props.accentColor || '#2563eb');
const renderedNavItems = computed(() => {
  if (props.navItems && props.navItems.length > 0) return props.navItems;
  if (props.block.items && props.block.items.length > 0) return props.block.items;
  return [
    { id: 'nav_1', title: 'Beranda', url: '/', active: true },
    { id: 'nav_2', title: 'Layanan', url: '/layanan', active: false },
    { id: 'nav_3', title: 'Portofolio', url: '/portofolio', active: false },
    { id: 'nav_4', title: 'Kontak', url: '/kontak', active: false }
  ];
});

const callHandler = (name: string, ...args: any[]) => {
  if (props.previewMode) return;
  props.handlers?.[name]?.(...args);
};
</script>

<template>
  <div class="canvas-block-renderer-root" :class="{ 'is-preview-mode': previewMode }">
    <!-- BLOCK TYPE 1: NAVBAR -->
    <nav
      v-if="block.type === 'navbar'"
      class="rendered-nav-block"
      :class="[
        `nav-style-${block.styles?.navStyle || block.styles?.bgMode || 'glass'}`,
        `nav-align-${block.styles?.navAlign || 'split'}`
      ]"
      :style="{
        padding: `${block.styles?.paddingY || 16}px 32px`,
        position: !previewMode && block.styles?.isSticky ? 'sticky' : 'relative',
        top: !previewMode && block.styles?.isSticky ? '0' : undefined,
        zIndex: !previewMode && block.styles?.isSticky ? 40 : undefined,
        backgroundColor: block.styles?.navStyle === 'solid' ? (block.styles?.bgColor || '#ffffff') :
                         block.styles?.navStyle === 'transparent' ? 'transparent' :
                         block.styles?.navStyle === 'bordered' ? (block.styles?.bgColor || '#ffffff') : undefined,
        borderBottom: block.styles?.navStyle === 'bordered' ? `2px solid ${block.styles?.accentColor || '#cbd5e1'}` : undefined
      }"
    >
      <div class="site-brand-logo" :style="{ color: effectiveAccent }">
        <span
          class="brand-cube-icon"
          @click="callHandler('cycleNavbarBrandGlyph', block)"
          :title="previewMode ? undefined : 'Klik untuk ganti lambang brand'"
        >
          {{ block.styles?.brandGlyph || '◆' }}
        </span>
        <span
          class="brand-title inline-editable-text"
          :contenteditable="isEditable"
          @click="callHandler('onTextClick', block, 'title', $event)"
          @keydown="callHandler('onInlineTextKeyDown', $event)"
          @blur="callHandler('onInlineTextBlur', block, 'title', $event)"
          :title="previewMode ? undefined : 'Klik untuk mengedit brand'"
        >{{ block.title }}</span>
      </div>

      <div class="nav-links-cluster" :class="{ 'is-centered': block.styles?.navAlign === 'center' }">
        <div
          v-if="!previewMode && multiPagesCount > 1"
          class="nav-sitemap-sync-indicator"
          @click.stop="callHandler('setCanvasViewMode', 'sitemap')"
          title="Menu navigasi terintegrasi langsung dengan Alur Figma (Klik untuk lihat Alur Figma)"
        >
          <Workflow :size="10" />
          <span>Alur Figma ({{ multiPagesCount }})</span>
        </div>
        <div
          v-for="(item, idx) in renderedNavItems"
          :key="item.id || idx"
          class="nav-link-item-wrapper"
          @click="callHandler('onNavItemClick', block, idx, $event)"
        >
          <a
            :href="item.url || '#'"
            class="nav-anchor"
            :class="{ active: (activePagePath === item.url) || item.active }"
            :style="{ color: ((activePagePath === item.url) || item.active) ? effectiveAccent : undefined }"
            @click.prevent
          >
            <span
              class="inline-editable-text"
              :contenteditable="isEditable"
              @keydown="callHandler('onInlineTextKeyDown', $event)"
              @blur="callHandler('onInlineItemTextBlur', block, idx, 'title', $event)"
              :title="previewMode ? undefined : 'Klik untuk edit menu navigasi'"
            >{{ item.title }}</span>
          </a>
          <button
            v-if="isEditable && renderedNavItems.length > 1"
            type="button"
            class="btn-nav-link-delete"
            @click.stop="callHandler('removeNavItem', block, idx)"
            title="Hapus rute halaman ini dari Alur Figma & navigasi"
          >
            ×
          </button>
        </div>

        <button
          v-if="isEditable"
          type="button"
          class="btn-nav-quick-add"
          @click.stop="callHandler('addNavItem', block)"
          title="Tambah Link Navigasi Baru"
        >
          <Plus :size="11" />
        </button>

        <button
          class="btn-nav-action"
          :style="{
            backgroundColor: block.styles?.buttonColor || effectiveAccent,
            color: block.styles?.buttonTextColor || '#ffffff',
            borderRadius: (block.styles?.buttonRadius !== undefined ? block.styles.buttonRadius + 'px' : '8px'),
            border: block.styles?.buttonStyle === 'outline' ? '2px solid currentColor' : undefined,
            boxShadow: block.styles?.buttonStyle === 'glow' ? `0 0 16px ${(block.styles?.buttonColor || effectiveAccent)}66` : undefined
          }"
          @click="callHandler('onButtonClick', block, 'primary', $event)"
        >
          <span
            class="inline-editable-text"
            :contenteditable="isEditable"
            @keydown="callHandler('onInlineTextKeyDown', $event)"
            @blur="callHandler('onInlineTextBlur', block, 'buttonText', $event)"
            :title="previewMode ? undefined : 'Klik untuk mengedit tombol'"
          >{{ block.buttonText || 'Hubungi Saya' }}</span>
        </button>
      </div>
    </nav>

    <!-- BLOCK TYPE 2: HERO SECTION -->
    <header
      v-else-if="block.type === 'hero'"
      class="rendered-hero-block"
      :style="{
        padding: `${block.styles?.paddingY || 72}px 32px`,
        textAlign: block.styles?.align || 'center'
      }"
    >
      <div
        class="ambient-mesh-glow"
        :style="{
          background: `radial-gradient(circle, ${effectiveAccent}33 0%, transparent 70%)`
        }"
      ></div>

      <div
        v-if="block.badge"
        class="hero-badge-tag"
        :style="{
          color: effectiveAccent,
          borderColor: effectiveAccent + '40',
          backgroundColor: effectiveAccent + '12'
        }"
        @click="callHandler('onTextClick', block, 'badge', $event)"
      >
        <span
          class="inline-editable-text"
          :contenteditable="isEditable"
          @keydown="callHandler('onInlineTextKeyDown', $event)"
          @blur="callHandler('onInlineTextBlur', block, 'badge', $event)"
        >{{ block.badge }}</span>
      </div>

      <h1
        class="hero-main-heading inline-editable-text"
        :contenteditable="isEditable"
        @click="callHandler('onTextClick', block, 'title', $event)"
        @keydown="callHandler('onInlineTextKeyDown', $event)"
        @blur="callHandler('onInlineTextBlur', block, 'title', $event)"
        :title="previewMode ? undefined : 'Klik untuk mengedit judul hero'"
      >
        {{ block.title }}
      </h1>

      <p
        class="hero-bio-lead inline-editable-text"
        :contenteditable="isEditable"
        @click="callHandler('onTextClick', block, 'subtitle', $event)"
        @keydown="callHandler('onInlineTextKeyDown', $event)"
        @blur="callHandler('onInlineTextBlur', block, 'subtitle', $event)"
        :title="previewMode ? undefined : 'Klik untuk mengedit deskripsi hero'"
      >
        {{ block.subtitle }}
      </p>

      <div class="hero-cta-cluster">
        <button
          class="btn-primary-glow"
          :style="{
            backgroundColor: block.styles?.buttonColor || effectiveAccent,
            color: block.styles?.buttonTextColor || '#ffffff',
            borderRadius: (block.styles?.buttonRadius !== undefined ? block.styles.buttonRadius + 'px' : '8px'),
            border: block.styles?.buttonStyle === 'outline' ? `2px solid ${(block.styles?.buttonColor || effectiveAccent)}` : undefined,
            boxShadow: block.styles?.buttonStyle === 'glow' ? `0 0 20px ${(block.styles?.buttonColor || effectiveAccent)}66` : undefined
          }"
          @click="callHandler('onButtonClick', block, 'primary', $event)"
        >
          <span
            class="inline-editable-text"
            :style="{ color: block.styles?.buttonTextColor || '#ffffff' }"
            :contenteditable="isEditable"
            @keydown="callHandler('onInlineTextKeyDown', $event)"
            @blur="callHandler('onInlineTextBlur', block, 'buttonText', $event)"
            :title="previewMode ? undefined : 'Klik untuk mengedit tombol'"
          >{{ block.buttonText || 'Eksplorasi Karya' }}</span>
          <ArrowRight :size="14" />
        </button>
        <button
          v-if="block.secondaryButtonText"
          class="btn-secondary-clean"
          :style="{
            backgroundColor: block.styles?.secondaryButtonColor || 'transparent',
            color: block.styles?.secondaryButtonTextColor || '#0f172a',
            borderRadius: (block.styles?.secondaryButtonRadius !== undefined ? block.styles.secondaryButtonRadius + 'px' : '8px'),
            border: block.styles?.secondaryButtonStyle === 'outline' ? '2px solid #cbd5e1' : undefined,
            boxShadow: block.styles?.secondaryButtonStyle === 'glow' ? '0 0 16px rgba(100, 116, 139, 0.4)' : undefined
          }"
          @click="callHandler('onButtonClick', block, 'secondary', $event)"
        >
          <span
            class="inline-editable-text"
            :style="{ color: block.styles?.secondaryButtonTextColor || '#0f172a' }"
            :contenteditable="isEditable"
            @keydown="callHandler('onInlineTextKeyDown', $event)"
            @blur="callHandler('onInlineTextBlur', block, 'secondaryButtonText', $event)"
          >{{ block.secondaryButtonText }}</span>
        </button>
      </div>
    </header>

    <!-- BLOCK TYPE 3: FEATURES GRID -->
    <section
      v-else-if="block.type === 'features' || block.type === 'showcase'"
      class="rendered-features-block"
      :style="{ padding: `${block.styles?.paddingY || 60}px 32px` }"
    >
      <div class="section-title-wrap" :style="{ textAlign: block.styles?.align || 'center' }">
        <span
          v-if="block.badge"
          class="badge-mini-caps inline-editable-text"
          :contenteditable="isEditable"
          @click="callHandler('onTextClick', block, 'badge', $event)"
          @keydown="callHandler('onInlineTextKeyDown', $event)"
          @blur="callHandler('onInlineTextBlur', block, 'badge', $event)"
        >{{ block.badge }}</span>
        <h2
          class="sec-headline inline-editable-text"
          :contenteditable="isEditable"
          @click="callHandler('onTextClick', block, 'title', $event)"
          @keydown="callHandler('onInlineTextKeyDown', $event)"
          @blur="callHandler('onInlineTextBlur', block, 'title', $event)"
        >{{ block.title }}</h2>
        <p
          v-if="block.subtitle"
          class="sec-lead inline-editable-text"
          :contenteditable="isEditable"
          @click="callHandler('onTextClick', block, 'subtitle', $event)"
          @keydown="callHandler('onInlineTextKeyDown', $event)"
          @blur="callHandler('onInlineTextBlur', block, 'subtitle', $event)"
        >{{ block.subtitle }}</p>
      </div>

      <div
        class="features-cards-trio"
        :style="{
          gridTemplateColumns: block.styles?.cardColumns ? `repeat(${block.styles.cardColumns}, minmax(0, 1fr))` : undefined
        }"
      >
        <div
          v-for="(item, idx) in block.items"
          :key="item.id"
          class="feature-bento-card"
          :style="{
            borderRadius: (block.styles?.cardRadius !== undefined ? block.styles.cardRadius + 'px' : undefined)
          }"
          @click="callHandler('onCardItemClick', block, idx, $event)"
        >
          <div
            class="card-icon-pill"
            :class="{ 'is-clickable-icon': !previewMode }"
            :style="{
              color: effectiveAccent,
              backgroundColor: effectiveAccent + '12'
            }"
            @click="callHandler('openIconPickerForBlock', block.id, idx)"
            :title="previewMode ? undefined : 'Klik untuk langsung ganti icon item'"
          >
            <component :is="getIconComponent(item.icon)" :size="20" />
            <span v-if="!previewMode" class="icon-edit-pencil-badge" title="Ganti Ikon">
              <Edit3 :size="8" />
            </span>
          </div>
          <h3
            class="card-item-title inline-editable-text"
            :contenteditable="isEditable"
            @keydown="callHandler('onInlineTextKeyDown', $event)"
            @blur="callHandler('onInlineItemTextBlur', block, idx, 'title', $event)"
          >{{ item.title }}</h3>
          <p
            class="card-item-desc inline-editable-text"
            :contenteditable="isEditable"
            @keydown="callHandler('onInlineTextKeyDown', $event)"
            @blur="callHandler('onInlineItemTextBlur', block, idx, 'desc', $event)"
          >{{ item.desc }}</p>
        </div>
      </div>
    </section>

    <!-- BLOCK TYPE 4: PRICING -->
    <section
      v-else-if="block.type === 'pricing'"
      class="rendered-pricing-block"
      :style="{ padding: `${block.styles?.paddingY || 60}px 32px` }"
    >
      <div class="section-title-wrap" :style="{ textAlign: block.styles?.align || 'center' }">
        <span
          v-if="block.badge"
          class="badge-mini-caps inline-editable-text"
          :contenteditable="isEditable"
          @click="callHandler('onTextClick', block, 'badge', $event)"
          @keydown="callHandler('onInlineTextKeyDown', $event)"
          @blur="callHandler('onInlineTextBlur', block, 'badge', $event)"
        >{{ block.badge }}</span>
        <h2
          class="sec-headline inline-editable-text"
          :contenteditable="isEditable"
          @click="callHandler('onTextClick', block, 'title', $event)"
          @keydown="callHandler('onInlineTextKeyDown', $event)"
          @blur="callHandler('onInlineTextBlur', block, 'title', $event)"
        >{{ block.title }}</h2>
        <div v-if="block.styles?.richContent" v-html="block.styles.richContent" class="sec-lead"></div>
        <p
          v-else-if="block.subtitle"
          class="sec-lead inline-editable-text"
          :contenteditable="isEditable"
          @click="callHandler('onTextClick', block, 'subtitle', $event)"
          @keydown="callHandler('onInlineTextKeyDown', $event)"
          @blur="callHandler('onInlineTextBlur', block, 'subtitle', $event)"
        >{{ block.subtitle }}</p>
      </div>

      <div class="pricing-cards-row">
        <div
          v-for="(item, idx) in block.items"
          :key="item.id"
          class="price-tier-card"
          :class="{ featured: item.tag === 'Terpopuler' }"
          @click="callHandler('onCardItemClick', block, idx, $event)"
        >
          <span
            v-if="item.tag"
            class="tier-tag-pill inline-editable-text"
            :contenteditable="isEditable"
            :style="{ backgroundColor: effectiveAccent }"
            @keydown="callHandler('onInlineTextKeyDown', $event)"
            @blur="callHandler('onInlineItemTextBlur', block, idx, 'tag', $event)"
          >
            {{ item.tag }}
          </span>
          <h4
            class="tier-name inline-editable-text"
            :contenteditable="isEditable"
            @keydown="callHandler('onInlineTextKeyDown', $event)"
            @blur="callHandler('onInlineItemTextBlur', block, idx, 'title', $event)"
          >{{ item.title }}</h4>
          <div class="tier-price-val">
            <span
              class="price-num inline-editable-text"
              :contenteditable="isEditable"
              @keydown="callHandler('onInlineTextKeyDown', $event)"
              @blur="callHandler('onInlineItemTextBlur', block, idx, 'price', $event)"
            >{{ item.price }}</span>
            <span
              class="price-cycle inline-editable-text"
              :contenteditable="isEditable"
              @keydown="callHandler('onInlineTextKeyDown', $event)"
              @blur="callHandler('onInlineItemTextBlur', block, idx, 'period', $event)"
            >{{ item.period }}</span>
          </div>
          <p
            class="tier-desc inline-editable-text"
            :contenteditable="isEditable"
            @keydown="callHandler('onInlineTextKeyDown', $event)"
            @blur="callHandler('onInlineItemTextBlur', block, idx, 'desc', $event)"
          >{{ item.desc }}</p>
          <ul v-if="item.features" class="tier-feature-list">
            <li v-for="(f, fi) in item.features" :key="fi">
              <Check :size="13" :color="effectiveAccent" />
              <span
                class="inline-editable-text"
                :contenteditable="isEditable"
                @keydown="callHandler('onInlineTextKeyDown', $event)"
                @blur="callHandler('onInlineFeatureBlur', block, idx, fi, $event)"
              >{{ f }}</span>
            </li>
          </ul>
          <button
            class="btn-tier-action"
            :style="{
              backgroundColor: item.buttonColor || (item.tag === 'Terpopuler' ? effectiveAccent : '#f1f5f9'),
              color: item.buttonColor ? '#ffffff' : (item.tag === 'Terpopuler' ? '#ffffff' : '#0f172a'),
              borderRadius: (item.buttonRadius !== undefined ? item.buttonRadius + 'px' : (block.styles?.buttonRadius !== undefined ? block.styles.buttonRadius + 'px' : '8px')),
              border: item.buttonStyle === 'outline' ? '2px solid currentColor' : undefined,
              boxShadow: item.buttonStyle === 'glow' ? `0 0 16px ${(item.buttonColor || effectiveAccent)}66` : undefined
            }"
            @click="callHandler('onButtonClick', block, idx, $event)"
          >
            <span
              class="inline-editable-text"
              :contenteditable="isEditable"
              @keydown="callHandler('onInlineTextKeyDown', $event)"
              @blur="callHandler('onInlineTextBlur', block, 'buttonText', $event)"
            >{{ block.buttonText || 'Pilih Paket' }}</span>
          </button>
        </div>
      </div>
    </section>

    <!-- BLOCK TYPE 5: CALL TO ACTION -->
    <section
      v-else-if="block.type === 'cta'"
      class="rendered-cta-block"
      :style="{ padding: `${block.styles?.paddingY || 50}px 32px` }"
    >
      <div
        class="cta-inner-banner"
        :style="{
          borderColor: effectiveAccent + '30',
          background: `linear-gradient(135deg, ${effectiveAccent}15 0%, #ffffff80 100%)`
        }"
      >
        <h2
          class="cta-heading inline-editable-text"
          :contenteditable="isEditable"
          @click="callHandler('onTextClick', block, 'title', $event)"
          @keydown="callHandler('onInlineTextKeyDown', $event)"
          @blur="callHandler('onInlineTextBlur', block, 'title', $event)"
        >{{ block.title }}</h2>
        <div v-if="block.styles?.richContent" v-html="block.styles.richContent" class="cta-lead"></div>
        <p
          v-else
          class="cta-lead inline-editable-text"
          :contenteditable="isEditable"
          @click="callHandler('onTextClick', block, 'subtitle', $event)"
          @keydown="callHandler('onInlineTextKeyDown', $event)"
          @blur="callHandler('onInlineTextBlur', block, 'subtitle', $event)"
        >{{ block.subtitle }}</p>
        <button
          class="btn-cta-big"
          :style="{
            backgroundColor: block.styles?.buttonColor || effectiveAccent,
            borderRadius: (block.styles?.buttonRadius !== undefined ? block.styles.buttonRadius + 'px' : '8px'),
            border: block.styles?.buttonStyle === 'outline' ? '2px solid currentColor' : undefined,
            boxShadow: block.styles?.buttonStyle === 'glow' ? `0 0 20px ${(block.styles?.buttonColor || effectiveAccent)}66` : undefined
          }"
          @click="callHandler('onButtonClick', block, 'primary', $event)"
        >
          <span
            class="inline-editable-text"
            :contenteditable="isEditable"
            @keydown="callHandler('onInlineTextKeyDown', $event)"
            @blur="callHandler('onInlineTextBlur', block, 'buttonText', $event)"
          >{{ block.buttonText || 'Mulai Sekarang' }}</span>
        </button>
      </div>
    </section>

    <!-- BLOCK TYPE: PROGRESS BAR -->
    <section
      v-else-if="block.type === 'progressbar'"
      class="rendered-progressbar-block"
      :style="{ padding: `${block.styles?.paddingY || 56}px 32px` }"
    >
      <div class="section-title-wrap" :style="{ textAlign: block.styles?.align || 'left' }">
        <span
          v-if="block.badge"
          class="badge-mini-caps inline-editable-text"
          :contenteditable="isEditable"
          @click="callHandler('onTextClick', block, 'badge', $event)"
          @keydown="callHandler('onInlineTextKeyDown', $event)"
          @blur="callHandler('onInlineTextBlur', block, 'badge', $event)"
        >{{ block.badge }}</span>
        <h2
          class="sec-headline inline-editable-text"
          :contenteditable="isEditable"
          @click="callHandler('onTextClick', block, 'title', $event)"
          @keydown="callHandler('onInlineTextKeyDown', $event)"
          @blur="callHandler('onInlineTextBlur', block, 'title', $event)"
        >{{ block.title }}</h2>
        <div v-if="block.styles?.richContent" v-html="block.styles.richContent" class="sec-lead"></div>
        <p
          v-else-if="block.subtitle"
          class="sec-lead inline-editable-text"
          :contenteditable="isEditable"
          @click="callHandler('onTextClick', block, 'subtitle', $event)"
          @keydown="callHandler('onInlineTextKeyDown', $event)"
          @blur="callHandler('onInlineTextBlur', block, 'subtitle', $event)"
        >{{ block.subtitle }}</p>
      </div>

      <div class="progress-meters-grid">
        <div
          v-for="(item, idx) in block.items"
          :key="item.id"
          class="progress-meter-card"
          @click="callHandler('onProgressItemClick', block, idx, $event)"
        >
          <div class="pm-head">
            <span
              class="pm-title inline-editable-text"
              :contenteditable="isEditable"
              @keydown="callHandler('onInlineTextKeyDown', $event)"
              @blur="callHandler('onInlineItemTextBlur', block, idx, 'title', $event)"
            >{{ item.title }}</span>
            <span
              class="pm-val inline-editable-text"
              :contenteditable="isEditable"
              :style="{ color: effectiveAccent }"
              @keydown="callHandler('onInlineTextKeyDown', $event)"
              @blur="callHandler('onInlineItemTextBlur', block, idx, 'percentage', $event)"
              :title="previewMode ? undefined : 'Klik untuk ubah persen'"
            >{{ item.percentage || 0 }}%</span>
          </div>
          <div class="pm-track" @click="callHandler('onProgressItemClick', block, idx, $event)">
            <div
              class="pm-fill"
              :style="{
                width: (item.percentage || 0) + '%',
                background: `linear-gradient(90deg, ${effectiveAccent}, #38bdf8)`
              }"
            ></div>
          </div>
          <p
            v-if="item.desc"
            class="pm-desc inline-editable-text"
            :contenteditable="isEditable"
            @keydown="callHandler('onInlineTextKeyDown', $event)"
            @blur="callHandler('onInlineItemTextBlur', block, idx, 'desc', $event)"
          >{{ item.desc }}</p>
        </div>
      </div>
    </section>

    <!-- BLOCK TYPE: ACCORDION / COLLAPSE -->
    <section
      v-else-if="block.type === 'accordion'"
      class="rendered-accordion-block"
      :style="{ padding: `${block.styles?.paddingY || 56}px 32px` }"
    >
      <div class="section-title-wrap" :style="{ textAlign: block.styles?.align || 'center' }">
        <span
          v-if="block.badge"
          class="badge-mini-caps inline-editable-text"
          :contenteditable="isEditable"
          @click="callHandler('onTextClick', block, 'badge', $event)"
          @keydown="callHandler('onInlineTextKeyDown', $event)"
          @blur="callHandler('onInlineTextBlur', block, 'badge', $event)"
        >{{ block.badge }}</span>
        <h2
          class="sec-headline inline-editable-text"
          :contenteditable="isEditable"
          @click="callHandler('onTextClick', block, 'title', $event)"
          @keydown="callHandler('onInlineTextKeyDown', $event)"
          @blur="callHandler('onInlineTextBlur', block, 'title', $event)"
        >{{ block.title }}</h2>
        <div v-if="block.styles?.richContent" v-html="block.styles.richContent" class="sec-lead"></div>
        <p
          v-else-if="block.subtitle"
          class="sec-lead inline-editable-text"
          :contenteditable="isEditable"
          @click="callHandler('onTextClick', block, 'subtitle', $event)"
          @keydown="callHandler('onInlineTextKeyDown', $event)"
          @blur="callHandler('onInlineTextBlur', block, 'subtitle', $event)"
        >{{ block.subtitle }}</p>
      </div>

      <div class="accordion-items-stack">
        <div
          v-for="(item, idx) in block.items"
          :key="item.id"
          class="accordion-card-item"
          :class="{ 'is-expanded': (block.activeItemIndex ?? 0) === idx }"
          @click="callHandler('onCardItemClick', block, idx, $event)"
        >
          <button class="acc-card-trigger" @click.stop="callHandler('toggleAccordionItem', block, idx)">
            <span
              class="acc-card-title inline-editable-text"
              :contenteditable="isEditable"
              @keydown="callHandler('onInlineTextKeyDown', $event)"
              @blur="callHandler('onInlineItemTextBlur', block, idx, 'title', $event)"
            >{{ item.title }}</span>
            <ChevronDown :size="16" class="acc-card-icon" />
          </button>
          <div
            v-if="(block.activeItemIndex ?? 0) === idx"
            class="acc-card-content inline-editable-text"
            :contenteditable="isEditable"
            @keydown="callHandler('onInlineTextKeyDown', $event)"
            @blur="callHandler('onInlineItemTextBlur', block, idx, 'desc', $event)"
          >
            {{ item.desc }}
          </div>
        </div>
      </div>
    </section>

    <!-- BLOCK TYPE: CAROUSEL / SLIDER -->
    <section
      v-else-if="block.type === 'carousel'"
      class="rendered-carousel-block"
      :style="{ padding: `${block.styles?.paddingY || 60}px 32px` }"
    >
      <div class="section-title-wrap" :style="{ textAlign: block.styles?.align || 'center' }">
        <span
          v-if="block.badge"
          class="badge-mini-caps inline-editable-text"
          :contenteditable="isEditable"
          @click="callHandler('onTextClick', block, 'badge', $event)"
          @keydown="callHandler('onInlineTextKeyDown', $event)"
          @blur="callHandler('onInlineTextBlur', block, 'badge', $event)"
        >{{ block.badge }}</span>
        <h2
          class="sec-headline inline-editable-text"
          :contenteditable="isEditable"
          @click="callHandler('onTextClick', block, 'title', $event)"
          @keydown="callHandler('onInlineTextKeyDown', $event)"
          @blur="callHandler('onInlineTextBlur', block, 'title', $event)"
        >{{ block.title }}</h2>
        <div v-if="block.styles?.richContent" v-html="block.styles.richContent" class="sec-lead"></div>
        <p
          v-else-if="block.subtitle"
          class="sec-lead inline-editable-text"
          :contenteditable="isEditable"
          @click="callHandler('onTextClick', block, 'subtitle', $event)"
          @keydown="callHandler('onInlineTextKeyDown', $event)"
          @blur="callHandler('onInlineTextBlur', block, 'subtitle', $event)"
        >{{ block.subtitle }}</p>
      </div>

      <div class="carousel-stage-container">
        <div v-if="block.items && block.items.length > 0" class="carousel-slide-card">
          <div
            v-if="block.items[block.activeItemIndex || 0]?.image"
            class="carousel-slide-img-wrap"
            @click="callHandler('onImageClick', block, block.activeItemIndex || 0, $event)"
            :title="previewMode ? undefined : 'Klik ganti foto slide langsung'"
            :style="{ cursor: previewMode ? 'default' : 'pointer' }"
          >
            <img
              :src="block.items[block.activeItemIndex || 0].image"
              :alt="block.items[block.activeItemIndex || 0].title || 'Slide Image'"
              class="carousel-slide-img"
            />
            <div v-if="!previewMode" class="carousel-img-hover-overlay">
              <span
                class="btn-change-photo-badge"
                @click.stop="callHandler('triggerImageUpload', block.id, block.activeItemIndex || 0)"
                title="Unggah Foto dari Komputer"
              >
                <UploadCloud :size="13" />
                <span>Ganti Foto</span>
              </span>
              <span
                class="btn-change-photo-badge secondary"
                @click.stop="callHandler('openMediaPickerForBlock', block.id, block.activeItemIndex || 0)"
                title="Pilih dari Pustaka MinIO S3"
              >
                <Database :size="13" />
                <span>Pustaka</span>
              </span>
            </div>
          </div>
          <span
            v-if="block.items[block.activeItemIndex || 0]?.tag"
            class="carousel-tag-badge inline-editable-text"
            :contenteditable="isEditable"
            @keydown="callHandler('onInlineTextKeyDown', $event)"
            @blur="callHandler('onInlineItemTextBlur', block, block.activeItemIndex || 0, 'tag', $event)"
          >
            {{ block.items[block.activeItemIndex || 0]?.tag }}
          </span>
          <h3
            class="carousel-headline inline-editable-text"
            :contenteditable="isEditable"
            @keydown="callHandler('onInlineTextKeyDown', $event)"
            @blur="callHandler('onInlineItemTextBlur', block, block.activeItemIndex || 0, 'title', $event)"
          >{{ block.items[block.activeItemIndex || 0]?.title }}</h3>
          <p
            class="carousel-lead-desc inline-editable-text"
            :contenteditable="isEditable"
            @keydown="callHandler('onInlineTextKeyDown', $event)"
            @blur="callHandler('onInlineItemTextBlur', block, block.activeItemIndex || 0, 'desc', $event)"
          >{{ block.items[block.activeItemIndex || 0]?.desc }}</p>
          <span
            v-if="block.items[block.activeItemIndex || 0]?.author"
            class="carousel-author-credit inline-editable-text"
            :contenteditable="isEditable"
            @keydown="callHandler('onInlineTextKeyDown', $event)"
            @blur="callHandler('onInlineItemTextBlur', block, block.activeItemIndex || 0, 'role', $event)"
          >
            — {{ block.items[block.activeItemIndex || 0]?.author }}
          </span>
        </div>

        <div class="carousel-nav-arrows">
          <button class="carousel-arrow-btn" @click.stop="callHandler('prevSlide', block)" title="Slide Sebelumnya">
            <ArrowLeft :size="16" />
          </button>
          <button class="carousel-arrow-btn" @click.stop="callHandler('nextSlide', block)" title="Slide Berikutnya">
            <ArrowRight :size="16" />
          </button>
        </div>

        <div class="carousel-dots-indicator">
          <button
            v-for="(item, sIdx) in block.items"
            :key="item.id"
            class="carousel-dot"
            :class="{ active: (block.activeItemIndex || 0) === sIdx }"
            @click.stop="callHandler('setSlide', block, sIdx)"
          ></button>
        </div>
      </div>
    </section>

    <!-- BLOCK TYPE: FORM CONTROL -->
    <section
      v-else-if="block.type === 'formcontrol'"
      class="rendered-formcontrol-block"
      :style="{ padding: `${block.styles?.paddingY || 60}px 32px` }"
    >
      <div class="section-title-wrap" :style="{ textAlign: block.styles?.align || 'center' }">
        <span
          v-if="block.badge"
          class="badge-mini-caps inline-editable-text"
          :contenteditable="isEditable"
          @click="callHandler('onTextClick', block, 'badge', $event)"
          @keydown="callHandler('onInlineTextKeyDown', $event)"
          @blur="callHandler('onInlineTextBlur', block, 'badge', $event)"
        >{{ block.badge }}</span>
        <h2
          class="sec-headline inline-editable-text"
          :contenteditable="isEditable"
          @click="callHandler('onTextClick', block, 'title', $event)"
          @keydown="callHandler('onInlineTextKeyDown', $event)"
          @blur="callHandler('onInlineTextBlur', block, 'title', $event)"
        >{{ block.title }}</h2>
        <div v-if="block.styles?.richContent" v-html="block.styles.richContent" class="sec-lead"></div>
        <p
          v-else-if="block.subtitle"
          class="sec-lead inline-editable-text"
          :contenteditable="isEditable"
          @click="callHandler('onTextClick', block, 'subtitle', $event)"
          @keydown="callHandler('onInlineTextKeyDown', $event)"
          @blur="callHandler('onInlineTextBlur', block, 'subtitle', $event)"
        >{{ block.subtitle }}</p>
      </div>

      <div class="form-card-container">
        <form class="form-fields-stack" @submit.prevent>
          <div v-for="(item, idx) in block.items" :key="item.id" class="form-field-group">
            <label
              class="form-field-label inline-editable-text"
              :contenteditable="isEditable"
              @keydown="callHandler('onInlineTextKeyDown', $event)"
              @blur="callHandler('onInlineItemTextBlur', block, idx, 'title', $event)"
            >{{ item.title }}</label>
            <select v-if="item.tag === 'select'" class="form-rendered-select">
              <option>Pilihan 1: Solusi Cloud & Docker</option>
              <option>Pilihan 2: Visual Studio CMS</option>
              <option>Pilihan 3: Domain & Edge SSL</option>
            </select>
            <textarea
              v-else-if="item.tag === 'textarea'"
              rows="3"
              class="form-rendered-textarea"
              :placeholder="item.label || item.desc"
            ></textarea>
            <input
              v-else
              :type="item.tag || 'text'"
              class="form-rendered-input"
              :placeholder="item.label || item.desc"
            />
          </div>
          <button
            class="btn-form-submit"
            :style="{
              backgroundColor: effectiveAccent,
              borderRadius: (block.styles?.buttonRadius !== undefined ? block.styles.buttonRadius + 'px' : '8px')
            }"
            @click="callHandler('onButtonClick', block, 'primary', $event)"
          >
            <span
              class="inline-editable-text"
              :contenteditable="isEditable"
              @keydown="callHandler('onInlineTextKeyDown', $event)"
              @blur="callHandler('onInlineTextBlur', block, 'buttonText', $event)"
            >{{ block.buttonText || 'Kirim Pesan Sekarang' }}</span>
          </button>
        </form>
      </div>
    </section>

    <!-- BLOCK TYPE: MODAL -->
    <section
      v-else-if="block.type === 'modal'"
      class="rendered-modal-block"
      :style="{ padding: `${block.styles?.paddingY || 48}px 32px` }"
    >
      <div class="modal-preview-stage">
        <div class="modal-stage-header">
          <span
            class="modal-stage-badge inline-editable-text"
            :contenteditable="isEditable"
            @click="callHandler('onTextClick', block, 'badge', $event)"
            @keydown="callHandler('onInlineTextKeyDown', $event)"
            @blur="callHandler('onInlineTextBlur', block, 'badge', $event)"
          >{{ block.badge || 'POPUP PROMOSI' }}</span>
          <button class="modal-stage-close" @click.stop="callHandler('toggleBlockOpen', block)">
            <X :size="14" />
          </button>
        </div>
        <div class="modal-stage-body">
          <h3
            class="modal-stage-title inline-editable-text"
            :contenteditable="isEditable"
            @click="callHandler('onTextClick', block, 'title', $event)"
            @keydown="callHandler('onInlineTextKeyDown', $event)"
            @blur="callHandler('onInlineTextBlur', block, 'title', $event)"
          >{{ block.title }}</h3>
          <div v-if="block.styles?.richContent" v-html="block.styles.richContent" class="modal-stage-desc"></div>
          <p
            v-else
            class="modal-stage-desc inline-editable-text"
            :contenteditable="isEditable"
            @click="callHandler('onTextClick', block, 'subtitle', $event)"
            @keydown="callHandler('onInlineTextKeyDown', $event)"
            @blur="callHandler('onInlineTextBlur', block, 'subtitle', $event)"
          >{{ block.subtitle }}</p>
          <div class="modal-stage-actions">
            <button
              class="btn-modal-secondary"
              :style="{
                backgroundColor: block.styles?.secondaryButtonColor || 'transparent',
                borderRadius: (block.styles?.secondaryButtonRadius !== undefined ? block.styles.secondaryButtonRadius + 'px' : '8px'),
                border: block.styles?.secondaryButtonStyle === 'outline' ? '2px solid #cbd5e1' : undefined,
                boxShadow: block.styles?.secondaryButtonStyle === 'glow' ? '0 0 16px rgba(100, 116, 139, 0.4)' : undefined
              }"
              @click="callHandler('onButtonClick', block, 'secondary', $event)"
            >
              <span
                class="inline-editable-text"
                :contenteditable="isEditable"
                @keydown="callHandler('onInlineTextKeyDown', $event)"
                @blur="callHandler('onInlineTextBlur', block, 'secondaryButtonText', $event)"
              >{{ block.secondaryButtonText || 'Nanti Saja' }}</span>
            </button>
            <button
              class="btn-modal-primary"
              :style="{
                backgroundColor: block.styles?.buttonColor || effectiveAccent,
                borderRadius: (block.styles?.buttonRadius !== undefined ? block.styles.buttonRadius + 'px' : '8px'),
                border: block.styles?.buttonStyle === 'outline' ? '2px solid currentColor' : undefined,
                boxShadow: block.styles?.buttonStyle === 'glow' ? `0 0 20px ${(block.styles?.buttonColor || effectiveAccent)}66` : undefined
              }"
              @click="callHandler('onButtonClick', block, 'primary', $event)"
            >
              <span
                class="inline-editable-text"
                :contenteditable="isEditable"
                @keydown="callHandler('onInlineTextKeyDown', $event)"
                @blur="callHandler('onInlineTextBlur', block, 'buttonText', $event)"
              >{{ block.buttonText || 'Klaim Sekarang' }}</span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- BLOCK TYPE: DROPDOWN -->
    <section
      v-else-if="block.type === 'dropdown'"
      class="rendered-dropdown-block"
      :style="{ padding: `${block.styles?.paddingY || 36}px 32px` }"
    >
      <div class="dropdown-component-card">
        <div class="section-title-wrap" style="margin-bottom: 12px; text-align: left;">
          <span
            v-if="block.badge"
            class="badge-mini-caps inline-editable-text"
            :contenteditable="isEditable"
            @click="callHandler('onTextClick', block, 'badge', $event)"
            @keydown="callHandler('onInlineTextKeyDown', $event)"
            @blur="callHandler('onInlineTextBlur', block, 'badge', $event)"
          >{{ block.badge }}</span>
          <h3
            class="sec-headline inline-editable-text"
            style="font-size: 1.1rem;"
            :contenteditable="isEditable"
            @click="callHandler('onTextClick', block, 'title', $event)"
            @keydown="callHandler('onInlineTextKeyDown', $event)"
            @blur="callHandler('onInlineTextBlur', block, 'title', $event)"
          >{{ block.title }}</h3>
          <div v-if="block.styles?.richContent" v-html="block.styles.richContent" style="font-size: 0.85rem; color: #64748b; margin-top: 4px;"></div>
          <p
            v-else-if="block.subtitle"
            class="inline-editable-text"
            style="font-size: 0.85rem; color: #64748b; margin-top: 4px;"
            :contenteditable="isEditable"
            @click="callHandler('onTextClick', block, 'subtitle', $event)"
            @keydown="callHandler('onInlineTextKeyDown', $event)"
            @blur="callHandler('onInlineTextBlur', block, 'subtitle', $event)"
          >{{ block.subtitle }}</p>
        </div>
        <button class="dropdown-trigger-btn" @click.stop="callHandler('toggleBlockOpen', block)">
          <span>{{ block.items?.[block.activeItemIndex || 0]?.title || 'Pilih Kategori...' }}</span>
          <ChevronDown :size="16" />
        </button>
        <div v-if="block.isOpen" class="dropdown-options-list">
          <div
            v-for="(item, dIdx) in block.items"
            :key="item.id"
            class="dropdown-option-row"
            :class="{ 'is-selected': (block.activeItemIndex || 0) === dIdx }"
            @click.stop="callHandler('selectDropdownOption', block, dIdx)"
          >
            <span
              class="inline-editable-text"
              :contenteditable="isEditable"
              @keydown="callHandler('onInlineTextKeyDown', $event)"
              @blur="callHandler('onInlineItemTextBlur', block, dIdx, 'title', $event)"
            >{{ item.title }}</span>
            <span
              v-if="item.desc"
              class="inline-editable-text"
              style="font-size: 0.72rem; color: #94a3b8;"
              :contenteditable="isEditable"
              @keydown="callHandler('onInlineTextKeyDown', $event)"
              @blur="callHandler('onInlineItemTextBlur', block, dIdx, 'desc', $event)"
            >{{ item.desc }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- BLOCK TYPE: CARDS GRID -->
    <section
      v-else-if="block.type === 'card'"
      class="rendered-card-block"
      :style="{ padding: `${block.styles?.paddingY || 60}px 32px` }"
    >
      <div class="section-title-wrap" :style="{ textAlign: block.styles?.align || 'center' }">
        <span
          v-if="block.badge"
          class="badge-mini-caps inline-editable-text"
          :contenteditable="isEditable"
          @click="callHandler('onTextClick', block, 'badge', $event)"
          @keydown="callHandler('onInlineTextKeyDown', $event)"
          @blur="callHandler('onInlineTextBlur', block, 'badge', $event)"
        >{{ block.badge }}</span>
        <h2
          class="sec-headline inline-editable-text"
          :contenteditable="isEditable"
          @click="callHandler('onTextClick', block, 'title', $event)"
          @keydown="callHandler('onInlineTextKeyDown', $event)"
          @blur="callHandler('onInlineTextBlur', block, 'title', $event)"
        >{{ block.title }}</h2>
        <div v-if="block.styles?.richContent" v-html="block.styles.richContent" class="sec-lead"></div>
        <p
          v-else-if="block.subtitle"
          class="sec-lead inline-editable-text"
          :contenteditable="isEditable"
          @click="callHandler('onTextClick', block, 'subtitle', $event)"
          @keydown="callHandler('onInlineTextKeyDown', $event)"
          @blur="callHandler('onInlineTextBlur', block, 'subtitle', $event)"
        >{{ block.subtitle }}</p>
      </div>

      <div
        class="cards-showcase-grid"
        :style="{
          gridTemplateColumns: block.styles?.cardColumns ? `repeat(${block.styles?.cardColumns}, minmax(0, 1fr))` : undefined
        }"
      >
        <div
          v-for="(item, idx) in block.items"
          :key="item.id"
          class="showcase-grid-card"
          :style="{
            borderRadius: (block.styles?.cardRadius !== undefined ? block.styles.cardRadius + 'px' : undefined)
          }"
          @click="callHandler('onCardItemClick', block, idx, $event)"
        >
          <div class="card-header-banner">
            <img
              v-if="item.image"
              :src="item.image"
              :alt="item.title || 'Card Cover'"
              class="card-cover-image"
            />
            <div v-if="!previewMode" class="card-cover-hover-overlay">
              <span class="btn-card-change-photo" @click.stop="callHandler('openMediaPickerForBlock', block.id, idx)" title="Pilih dari Pustaka MinIO S3">
                <Database :size="12" />
                <span>Pustaka</span>
              </span>
              <span class="btn-card-change-photo secondary" @click.stop="callHandler('triggerImageUpload', block.id, idx)" title="Upload dari Komputer">
                <UploadCloud :size="12" />
                <span>Upload</span>
              </span>
            </div>
            <span
              v-if="item.tag"
              class="card-tag-pill inline-editable-text"
              style="position: relative; z-index: 2;"
              :contenteditable="isEditable"
              @keydown="callHandler('onInlineTextKeyDown', $event)"
              @blur="callHandler('onInlineItemTextBlur', block, idx, 'tag', $event)"
            >{{ item.tag }}</span>
          </div>
          <div class="card-body-content">
            <h3
              class="card-grid-title inline-editable-text"
              :contenteditable="isEditable"
              @keydown="callHandler('onInlineTextKeyDown', $event)"
              @blur="callHandler('onInlineItemTextBlur', block, idx, 'title', $event)"
            >{{ item.title }}</h3>
            <p
              class="card-grid-desc inline-editable-text"
              :contenteditable="isEditable"
              @keydown="callHandler('onInlineTextKeyDown', $event)"
              @blur="callHandler('onInlineItemTextBlur', block, idx, 'desc', $event)"
            >{{ item.desc }}</p>
            <span
              v-if="item.role"
              class="card-role-label inline-editable-text"
              :contenteditable="isEditable"
              @keydown="callHandler('onInlineTextKeyDown', $event)"
              @blur="callHandler('onInlineItemTextBlur', block, idx, 'role', $event)"
            >Peran: {{ item.role }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- BLOCK TYPE: LIST GROUP -->
    <section
      v-else-if="block.type === 'listgroup'"
      class="rendered-listgroup-block"
      :style="{ padding: `${block.styles?.paddingY || 56}px 32px` }"
    >
      <div class="section-title-wrap" :style="{ textAlign: block.styles?.align || 'left' }">
        <span
          v-if="block.badge"
          class="badge-mini-caps inline-editable-text"
          :contenteditable="isEditable"
          @click="callHandler('onTextClick', block, 'badge', $event)"
          @keydown="callHandler('onInlineTextKeyDown', $event)"
          @blur="callHandler('onInlineTextBlur', block, 'badge', $event)"
        >{{ block.badge }}</span>
        <h2
          class="sec-headline inline-editable-text"
          :contenteditable="isEditable"
          @click="callHandler('onTextClick', block, 'title', $event)"
          @keydown="callHandler('onInlineTextKeyDown', $event)"
          @blur="callHandler('onInlineTextBlur', block, 'title', $event)"
        >{{ block.title }}</h2>
        <div v-if="block.styles?.richContent" v-html="block.styles.richContent" class="sec-lead"></div>
        <p
          v-else-if="block.subtitle"
          class="sec-lead inline-editable-text"
          :contenteditable="isEditable"
          @click="callHandler('onTextClick', block, 'subtitle', $event)"
          @keydown="callHandler('onInlineTextKeyDown', $event)"
          @blur="callHandler('onInlineTextBlur', block, 'subtitle', $event)"
        >{{ block.subtitle }}</p>
      </div>

      <div class="listgroup-stack-card">
        <div
          v-for="(item, idx) in block.items"
          :key="item.id"
          class="listgroup-item-row"
          @click="callHandler('onCardItemClick', block, idx, $event)"
        >
          <span class="lg-check-icon"><Check :size="14" /></span>
          <div class="lg-text-meta">
            <span
              class="lg-item-title inline-editable-text"
              :contenteditable="isEditable"
              @keydown="callHandler('onInlineTextKeyDown', $event)"
              @blur="callHandler('onInlineItemTextBlur', block, idx, 'title', $event)"
            >{{ item.title }}</span>
            <span
              v-if="item.desc"
              class="lg-item-desc inline-editable-text"
              :contenteditable="isEditable"
              @keydown="callHandler('onInlineTextKeyDown', $event)"
              @blur="callHandler('onInlineItemTextBlur', block, idx, 'desc', $event)"
            >{{ item.desc }}</span>
          </div>
          <span
            v-if="item.tag"
            class="lg-badge-tag inline-editable-text"
            :contenteditable="isEditable"
            @keydown="callHandler('onInlineTextKeyDown', $event)"
            @blur="callHandler('onInlineItemTextBlur', block, idx, 'tag', $event)"
          >{{ item.tag }}</span>
        </div>
      </div>
    </section>

    <!-- BLOCK TYPE: STATS -->
    <section
      v-else-if="block.type === 'stats'"
      class="rendered-stats-block"
      :style="{ padding: `${block.styles?.paddingY || 56}px 32px` }"
    >
      <div class="section-title-wrap" :style="{ textAlign: block.styles?.align || 'center' }">
        <span
          v-if="block.badge"
          class="badge-mini-caps inline-editable-text"
          :contenteditable="isEditable"
          @click="callHandler('onTextClick', block, 'badge', $event)"
          @keydown="callHandler('onInlineTextKeyDown', $event)"
          @blur="callHandler('onInlineTextBlur', block, 'badge', $event)"
        >{{ block.badge }}</span>
        <h2
          class="sec-headline inline-editable-text"
          :contenteditable="isEditable"
          @click="callHandler('onTextClick', block, 'title', $event)"
          @keydown="callHandler('onInlineTextKeyDown', $event)"
          @blur="callHandler('onInlineTextBlur', block, 'title', $event)"
        >{{ block.title }}</h2>
        <div v-if="block.styles?.richContent" v-html="block.styles.richContent" class="sec-lead"></div>
        <p
          v-else-if="block.subtitle"
          class="sec-lead inline-editable-text"
          :contenteditable="isEditable"
          @click="callHandler('onTextClick', block, 'subtitle', $event)"
          @keydown="callHandler('onInlineTextKeyDown', $event)"
          @blur="callHandler('onInlineTextBlur', block, 'subtitle', $event)"
        >{{ block.subtitle }}</p>
      </div>

      <div class="stats-counters-row">
        <div
          v-for="(item, idx) in block.items"
          :key="item.id"
          class="stat-counter-box"
          @click="callHandler('onCardItemClick', block, idx, $event)"
        >
          <span
            class="stat-number-val inline-editable-text"
            :contenteditable="isEditable"
            @click="callHandler('onTextClick', block, 'title', $event)"
            @keydown="callHandler('onInlineTextKeyDown', $event)"
            @blur="callHandler('onInlineItemTextBlur', block, idx, 'title', $event)"
          >{{ item.title }}</span>
          <span
            class="stat-number-desc inline-editable-text"
            :contenteditable="isEditable"
            @click="callHandler('onTextClick', block, 'subtitle', $event)"
            @keydown="callHandler('onInlineTextKeyDown', $event)"
            @blur="callHandler('onInlineItemTextBlur', block, idx, 'desc', $event)"
          >{{ item.desc }}</span>
        </div>
      </div>
    </section>

    <!-- BLOCK TYPE: PAGINATION -->
    <section
      v-else-if="block.type === 'pagination'"
      class="rendered-pagination-block"
      :style="{ padding: `${block.styles?.paddingY || 32}px 32px` }"
    >
      <div
        v-if="block.subtitle"
        class="inline-editable-text"
        style="text-align: center; font-size: 0.8rem; color: #64748b; margin-bottom: 8px;"
        :contenteditable="isEditable"
        @click="callHandler('onTextClick', block, 'subtitle', $event)"
        @keydown="callHandler('onInlineTextKeyDown', $event)"
        @blur="callHandler('onInlineTextBlur', block, 'subtitle', $event)"
      >
        {{ block.subtitle }}
      </div>
      <div class="pagination-controls-row">
        <button class="pagination-btn" title="Sebelumnya">&laquo;</button>
        <button
          v-for="(item, pIdx) in block.items"
          :key="item.id"
          class="pagination-btn"
          :class="{ 'is-active': (block.activeItemIndex || 0) === pIdx }"
          @click.stop="callHandler('setPageNumber', block, pIdx)"
        >
          <span
            class="inline-editable-text"
            :contenteditable="isEditable"
            @keydown="callHandler('onInlineTextKeyDown', $event)"
            @blur="callHandler('onInlineItemTextBlur', block, pIdx, 'title', $event)"
          >{{ item.title }}</span>
        </button>
        <button class="pagination-btn" title="Berikutnya">&raquo;</button>
      </div>
    </section>

    <!-- BLOCK TYPE: BREADCRUMB -->
    <nav
      v-else-if="block.type === 'breadcrumb'"
      class="rendered-breadcrumb-block"
      :style="{ padding: `${block.styles?.paddingY || 20}px 32px` }"
    >
      <div class="breadcrumb-trail-nav">
        <template v-for="(item, bIdx) in block.items" :key="item.id">
          <span v-if="bIdx > 0" class="bc-sep-icon">/</span>
          <a
            v-if="bIdx < (block.items?.length || 1) - 1"
            :href="item.url || '#'"
            class="bc-item-anchor"
            @click.prevent
          >
            <span
              class="inline-editable-text"
              :contenteditable="isEditable"
              @keydown="callHandler('onInlineTextKeyDown', $event)"
              @blur="callHandler('onInlineItemTextBlur', block, bIdx, 'title', $event)"
            >{{ item.title }}</span>
          </a>
          <span
            v-else
            class="bc-item-current inline-editable-text"
            :contenteditable="isEditable"
            @keydown="callHandler('onInlineTextKeyDown', $event)"
            @blur="callHandler('onInlineItemTextBlur', block, bIdx, 'title', $event)"
          >{{ item.title }}</span>
        </template>
      </div>
    </nav>

    <!-- BLOCK TYPE: MARQUEE -->
    <section
      v-else-if="block.type === 'marquee'"
      class="rendered-marquee-block"
      :style="{ padding: `${block.styles?.paddingY || 32}px 32px` }"
    >
      <div class="section-title-wrap" style="margin-bottom: 18px; text-align: center;">
        <span v-if="block.badge" class="badge-mini-caps">{{ block.badge }}</span>
        <h3 v-if="block.title" class="sec-headline" style="font-size: 1.05rem;">{{ block.title }}</h3>
      </div>
      <div class="marquee-logos-row">
        <div v-for="item in block.items" :key="item.id" class="marquee-logo-chip">
          <component :is="getIconComponent(item.icon)" :size="16" :style="{ color: effectiveAccent }" />
          <span>{{ item.title }}</span>
        </div>
      </div>
    </section>

    <!-- BLOCK TYPE 6: FOOTER -->
    <footer
      v-else-if="block.type === 'footer'"
      class="rendered-footer-block"
      :style="{ padding: `${block.styles?.paddingY || 36}px 32px` }"
    >
      <div class="footer-divider-line"></div>
      <div class="footer-content-row">
        <div class="footer-brand">
          <span class="brand-cube-icon" :style="{ color: effectiveAccent }">◆</span>
          <strong
            class="inline-editable-text"
            :contenteditable="isEditable"
            @click="callHandler('onTextClick', block, 'title', $event)"
            @keydown="callHandler('onInlineTextKeyDown', $event)"
            @blur="callHandler('onInlineTextBlur', block, 'title', $event)"
            :title="previewMode ? undefined : 'Klik untuk mengedit brand footer'"
          >{{ block.title }}</strong>
        </div>
        <p
          class="footer-copy inline-editable-text"
          :contenteditable="isEditable"
          @click="callHandler('onTextClick', block, 'subtitle', $event)"
          @keydown="callHandler('onInlineTextKeyDown', $event)"
          @blur="callHandler('onInlineTextBlur', block, 'subtitle', $event)"
          :title="previewMode ? undefined : 'Klik untuk mengedit copyright footer'"
        >{{ block.subtitle }}</p>
      </div>
    </footer>
  </div>
</template>

