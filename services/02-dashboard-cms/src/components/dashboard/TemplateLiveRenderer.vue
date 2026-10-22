<script setup lang="ts">
import { ref } from 'vue';
import {
  ChevronDown,
  ChevronRight,
  Sparkles,
  Zap,
  GraduationCap,
  ShoppingBag,
  Send,
  MessageCircle,
  Menu,
  BookOpen,
  FolderGit2,
  ShieldCheck
} from 'lucide-vue-next';
import type { OfficialTemplateItem } from '../../data/templates-data';

const props = withDefaults(
  defineProps<{
    template: OfficialTemplateItem;
    accentColor?: string;
    isDarkMode?: boolean;
    device?: 'desktop' | 'tablet' | 'mobile';
  }>(),
  {
    accentColor: '#2563eb',
    isDarkMode: false,
    device: 'desktop'
  }
);

// Interactive state for accordions
const openAccordionIndex = ref<number | null>(0);
const toggleAccordion = (idx: number) => {
  openAccordionIndex.value = openAccordionIndex.value === idx ? null : idx;
};

// Interactive state for pricing billing cycle toggle
const isAnnualBilling = ref(false);

// Micro toast feedback when interacting inside preview
const clickFeedback = ref<string | null>(null);
const handleDemoClick = (actionName: string) => {
  clickFeedback.value = `Tombol interaktif '${actionName}' diuji dalam pratinjau live!`;
  setTimeout(() => {
    clickFeedback.value = null;
  }, 2200);
};
</script>

<template>
  <div
    class="template-live-canvas"
    :class="{ 'dark-mode-canvas': isDarkMode }"
    :style="{
      fontFamily: template.fontFamily || 'Inter',
      '--tpl-accent': accentColor || template.accentColor || '#2563eb'
    }"
  >
    <!-- Micro toast feedback for live simulator clicks -->
    <transition name="fade">
      <div v-if="clickFeedback" class="sim-micro-toast">
        <Sparkles :size="12" />
        <span>{{ clickFeedback }}</span>
      </div>
    </transition>

    <!-- Loop through actual Visual Blocks defined in template -->
    <template v-for="(block, bIdx) in template.blocks" :key="block.id || bIdx">
      <!-- 1. NAVBAR BLOCK -->
      <header
        v-if="block.type === 'navbar'"
        class="sim-block-navbar"
        :class="{ 'mobile-nav': device === 'mobile' }"
      >
        <div class="sim-brand-area">
          <span class="sim-brand-glyph" :style="{ backgroundColor: accentColor }">
            {{ template.category === 'portfolio' ? 'R' : template.title.slice(0, 1) }}
          </span>
          <span class="sim-brand-title" :style="{ color: isDarkMode ? '#ffffff' : '#0f172a' }">
            {{ block.title || template.title.split('&')[0] }}
          </span>
        </div>

        <nav v-if="device !== 'mobile'" class="sim-nav-links-row">
          <a href="javascript:void(0)" @click="handleDemoClick('Navigasi Beranda')">Beranda</a>
          <a href="javascript:void(0)" @click="handleDemoClick('Navigasi Produk')">
            {{ template.category === 'business' ? 'Katalog Produk' : 'Fitur' }}
          </a>
          <a href="javascript:void(0)" @click="handleDemoClick('Navigasi Promo')">
            {{ template.category === 'business' ? 'Promo Diskon' : 'Showcase' }}
          </a>
          <a href="javascript:void(0)" @click="handleDemoClick('Navigasi Kontak')">
            {{ template.category === 'business' ? 'WhatsApp Toko' : 'Kontak' }}
          </a>
        </nav>

        <div class="sim-nav-actions">
          <button
            v-if="block.buttonText && device !== 'mobile'"
            class="sim-btn-nav-cta"
            :style="{ backgroundColor: accentColor }"
            @click="handleDemoClick(block.buttonText)"
          >
            {{ block.buttonText }}
          </button>
          <button
            v-if="device === 'mobile'"
            class="sim-btn-mobile-menu"
            @click="handleDemoClick('Menu Mobile')"
          >
            <Menu :size="16" />
          </button>
        </div>
      </header>

      <!-- 2. HERO BLOCK -->
      <section
        v-else-if="block.type === 'hero'"
        class="sim-block-hero"
        :class="{ 'hero-compact': device === 'mobile' }"
      >
        <div
          v-if="block.badge"
          class="sim-hero-badge-pill"
          :style="{
            backgroundColor: `${accentColor}15`,
            color: accentColor,
            borderColor: `${accentColor}35`
          }"
        >
          <Sparkles :size="11" />
          <span>{{ block.badge }}</span>
        </div>

        <h1 class="sim-hero-headline" :style="{ color: isDarkMode ? '#ffffff' : '#0f172a' }">
          {{ block.title || template.defaultRole || template.title }}
        </h1>

        <p class="sim-hero-subheadline" :style="{ color: isDarkMode ? '#94a3b8' : '#475569' }">
          {{ block.subtitle || template.defaultBio || template.desc }}
        </p>

        <div class="sim-hero-btn-group">
          <button
            v-if="block.buttonText"
            class="sim-btn-primary"
            :style="{ backgroundColor: accentColor }"
            @click="handleDemoClick(block.buttonText)"
          >
            <span>{{ block.buttonText }}</span>
            <ChevronRight :size="14" />
          </button>

          <button
            v-if="block.secondaryButtonText"
            class="sim-btn-secondary"
            :class="{ 'btn-sec-dark': isDarkMode }"
            @click="handleDemoClick(block.secondaryButtonText)"
          >
            <span>{{ block.secondaryButtonText }}</span>
          </button>
        </div>

        <!-- Interactive Cloud Showcase Terminal Mockup (for Portfolio Blueprint) -->
        <div
          v-if="template.category === 'portfolio' && device !== 'mobile'"
          class="sim-terminal-strip"
          :class="{ 'terminal-dark': isDarkMode }"
        >
          <div class="terminal-strip-top">
            <div class="terminal-strip-dots">
              <span class="d-red"></span>
              <span class="d-yellow"></span>
              <span class="d-green"></span>
            </div>
            <span class="terminal-strip-title">node-edge-cluster ~ zsh</span>
            <span class="terminal-strip-badge">Traefik v3 HTTP/3</span>
          </div>
          <div class="terminal-strip-content">
            <div class="t-line">
              <span class="t-prefix">rizal@cloudcms:~$</span>
              <span class="t-command">curl -s https://rizal.cloudcms.app/telemetry | jq '{status, engine, latency}'</span>
            </div>
            <div class="t-response">
              <span class="t-bracket">{</span>
              <div class="t-indent">
                <div><span class="t-key">"status"</span>: <span class="t-green">"200_ACTIVE_RUNNING"</span>,</div>
                <div><span class="t-key">"edge_router"</span>: <span class="t-cyan">"Traefik v3.1 TLS 1.3"</span>,</div>
                <div><span class="t-key">"isolation"</span>: <span class="t-blue">"Docker Linux cgroups v2"</span>,</div>
                <div><span class="t-key">"avg_ttfb"</span>: <span class="t-yellow">"1.2ms"</span></div>
              </div>
              <span class="t-bracket">}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 3. STATS BLOCK -->
      <section
        v-else-if="block.type === 'stats'"
        class="sim-block-stats"
        :class="{ 'stats-dark': isDarkMode }"
      >
        <div class="sim-stats-container">
          <div
            v-for="(st, sIdx) in (block.items || [])"
            :key="st.id || sIdx"
            class="sim-stat-box"
          >
            <span class="sim-stat-value" :style="{ color: accentColor }">
              {{ st.title }}
            </span>
            <span class="sim-stat-desc" :style="{ color: isDarkMode ? '#cbd5e1' : '#64748b' }">
              {{ st.desc }}
            </span>
          </div>
        </div>
      </section>

      <!-- 4. FEATURES BLOCK -->
      <section
        v-else-if="block.type === 'features'"
        class="sim-block-features"
        :class="{ 'features-dark': isDarkMode }"
      >
        <div class="sim-section-header-wrap">
          <span
            v-if="block.badge"
            class="sim-section-sub-badge"
            :style="{ color: accentColor }"
          >
            {{ block.badge }}
          </span>
          <h2 class="sim-section-title" :style="{ color: isDarkMode ? '#ffffff' : '#0f172a' }">
            {{ block.title || 'Keunggulan Arsitektur' }}
          </h2>
          <p v-if="block.subtitle" class="sim-section-sub" :style="{ color: isDarkMode ? '#94a3b8' : '#64748b' }">
            {{ block.subtitle }}
          </p>
        </div>

        <div class="sim-features-grid">
          <div
            v-for="(feat, fIdx) in (block.items || [])"
            :key="feat.id || fIdx"
            class="sim-feature-card-item"
            :class="{ 'card-dark': isDarkMode }"
          >
            <div class="sim-feature-icon-box" :style="{ backgroundColor: `${accentColor}18`, color: accentColor }">
              <Zap v-if="fIdx % 3 === 0" :size="18" />
              <ShieldCheck v-else-if="fIdx % 3 === 1" :size="18" />
              <Sparkles v-else :size="18" />
            </div>
            <strong :style="{ color: isDarkMode ? '#f8fafc' : '#0f172a' }">{{ feat.title }}</strong>
            <p :style="{ color: isDarkMode ? '#94a3b8' : '#64748b' }">{{ feat.desc }}</p>
          </div>
        </div>
      </section>

      <!-- 5. SHOWCASE BLOCK -->
      <section
        v-else-if="block.type === 'showcase'"
        class="sim-block-showcase"
        :class="{ 'showcase-dark': isDarkMode }"
      >
        <div class="sim-section-header-wrap">
          <h2 class="sim-section-title" :style="{ color: isDarkMode ? '#ffffff' : '#0f172a' }">
            {{ block.title || 'Showcase & Portofolio Karya' }}
          </h2>
          <p v-if="block.subtitle" class="sim-section-sub" :style="{ color: isDarkMode ? '#94a3b8' : '#64748b' }">
            {{ block.subtitle }}
          </p>
        </div>

        <div class="sim-showcase-grid">
          <div
            v-for="(item, scIdx) in (block.items || [])"
            :key="item.id || scIdx"
            class="sim-showcase-card"
            :class="{ 'card-dark': isDarkMode }"
          >
            <div class="sim-showcase-preview-banner" :style="{ background: `linear-gradient(135deg, #090d16 0%, ${accentColor} 100%)` }">
              <div class="showcase-thumb-content">
                <FolderGit2 :size="24" style="color: rgba(255,255,255,0.7);" />
                <span>{{ item.tag || 'Project' }}</span>
              </div>
            </div>
            <div class="sim-showcase-body">
              <span class="showcase-tag-pill" :style="{ color: accentColor, backgroundColor: `${accentColor}15` }">
                {{ item.tag || 'Studi Kasus' }}
              </span>
              <strong :style="{ color: isDarkMode ? '#ffffff' : '#0f172a' }">{{ item.title }}</strong>
              <p :style="{ color: isDarkMode ? '#94a3b8' : '#64748b' }">{{ item.desc }}</p>
              <button class="sim-btn-text-link" :style="{ color: accentColor }" @click="handleDemoClick(item.title)">
                <span>Eksplorasi Proyek</span>
                <ChevronRight :size="13" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- 6. CARD (ARTICLE / PRODUCT) BLOCK -->
      <section
        v-else-if="block.type === 'card'"
        class="sim-block-cards-section"
        :class="{ 'cards-dark': isDarkMode }"
      >
        <div class="sim-section-header-wrap">
          <h2 class="sim-section-title" :style="{ color: isDarkMode ? '#ffffff' : '#0f172a' }">
            {{ block.title || 'Katalog Pilihan' }}
          </h2>
          <p v-if="block.subtitle" class="sim-section-sub" :style="{ color: isDarkMode ? '#94a3b8' : '#64748b' }">
            {{ block.subtitle }}
          </p>
        </div>

        <div class="sim-cards-grid">
          <div
            v-for="(cItem, ciIdx) in (block.items || [])"
            :key="cItem.id || ciIdx"
            class="sim-rich-content-card"
            :class="{ 'card-dark': isDarkMode }"
          >
            <div class="card-thumb-canvas" :style="{ background: `linear-gradient(135deg, #1e293b 0%, ${accentColor}40 100%)` }">
              <span v-if="cItem.price" class="card-price-badge" :style="{ backgroundColor: accentColor }">
                {{ cItem.price }}
              </span>
              <span v-else class="card-cat-badge">
                {{ cItem.tag || 'Editorial' }}
              </span>
            </div>
            <div class="card-inner-body">
              <strong :style="{ color: isDarkMode ? '#ffffff' : '#0f172a' }">{{ cItem.title }}</strong>
              <p :style="{ color: isDarkMode ? '#94a3b8' : '#64748b' }">{{ cItem.desc }}</p>
              <button
                class="sim-btn-card-action"
                :style="{ backgroundColor: `${accentColor}15`, color: accentColor, borderColor: `${accentColor}30` }"
                @click="handleDemoClick(cItem.title)"
              >
                <ShoppingBag v-if="cItem.price" :size="13" />
                <BookOpen v-else :size="13" />
                <span>{{ cItem.price ? 'Pesan Sekarang' : 'Baca Selengkapnya' }}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- 7. LISTGROUP BLOCK -->
      <section
        v-else-if="block.type === 'listgroup'"
        class="sim-block-listgroup"
        :class="{ 'listgroup-dark': isDarkMode }"
      >
        <div class="sim-section-header-wrap">
          <h2 class="sim-section-title" :style="{ color: isDarkMode ? '#ffffff' : '#0f172a' }">
            {{ block.title || 'Indeks Tren & Referensi' }}
          </h2>
        </div>

        <div class="sim-listgroup-stack">
          <div
            v-for="(lItem, liIdx) in (block.items || [])"
            :key="lItem.id || liIdx"
            class="sim-listgroup-row"
            :class="{ 'row-dark': isDarkMode }"
            @click="handleDemoClick(lItem.title)"
          >
            <div class="listgroup-rank" :style="{ backgroundColor: `${accentColor}18`, color: accentColor }">
              #{{ liIdx + 1 }}
            </div>
            <div class="listgroup-text">
              <strong :style="{ color: isDarkMode ? '#ffffff' : '#0f172a' }">{{ lItem.title }}</strong>
              <span :style="{ color: isDarkMode ? '#94a3b8' : '#64748b' }">{{ lItem.desc }}</span>
            </div>
            <ChevronRight :size="16" class="listgroup-arrow" />
          </div>
        </div>
      </section>

      <!-- 8. ACCORDION BLOCK (INTERACTIVE CLICKABLE FAQ / SYLLABUS) -->
      <section
        v-else-if="block.type === 'accordion'"
        class="sim-block-accordion"
        :class="{ 'accordion-dark': isDarkMode }"
      >
        <div class="sim-section-header-wrap">
          <h2 class="sim-section-title" :style="{ color: isDarkMode ? '#ffffff' : '#0f172a' }">
            {{ block.title || 'Silabus Modul & Pertanyaan Umum' }}
          </h2>
          <p v-if="block.subtitle" class="sim-section-sub" :style="{ color: isDarkMode ? '#94a3b8' : '#64748b' }">
            {{ block.subtitle }}
          </p>
        </div>

        <div class="sim-accordion-stack">
          <div
            v-for="(acc, aIdx) in (block.items || [])"
            :key="acc.id || aIdx"
            class="sim-accordion-item"
            :class="{ open: openAccordionIndex === aIdx, 'item-dark': isDarkMode }"
          >
            <button
              class="sim-accordion-header"
              :style="{ color: isDarkMode ? '#ffffff' : '#0f172a' }"
              @click="toggleAccordion(aIdx)"
            >
              <div style="display: flex; align-items: center; gap: 8px;">
                <GraduationCap v-if="template.category === 'education'" :size="15" :style="{ color: accentColor }" />
                <span>{{ acc.title }}</span>
              </div>
              <ChevronDown
                :size="15"
                class="sim-acc-arrow"
                :class="{ rotated: openAccordionIndex === aIdx }"
              />
            </button>
            <div v-show="openAccordionIndex === aIdx" class="sim-accordion-body" :style="{ color: isDarkMode ? '#94a3b8' : '#64748b' }">
              <p>{{ acc.desc }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 9. PRICING BLOCK (WITH BILLING TOGGLE) -->
      <section
        v-else-if="block.type === 'pricing'"
        class="sim-block-pricing"
        :class="{ 'pricing-dark': isDarkMode }"
      >
        <div class="sim-section-header-wrap">
          <h2 class="sim-section-title" :style="{ color: isDarkMode ? '#ffffff' : '#0f172a' }">
            {{ block.title || 'Paket Layanan & Investasi' }}
          </h2>
          <p v-if="block.subtitle" class="sim-section-sub" :style="{ color: isDarkMode ? '#94a3b8' : '#64748b' }">
            {{ block.subtitle }}
          </p>

          <div class="sim-billing-toggle-pill">
            <button :class="{ active: !isAnnualBilling }" @click="isAnnualBilling = false">Bulanan</button>
            <button :class="{ active: isAnnualBilling }" @click="isAnnualBilling = true">
              <span>Tahunan</span>
              <span class="disc-pill" :style="{ backgroundColor: accentColor }">-20%</span>
            </button>
          </div>
        </div>

        <div class="sim-pricing-cards-grid">
          <div
            v-for="(plan, pIdx) in (block.items || [])"
            :key="plan.id || pIdx"
            class="sim-pricing-tier-card"
            :class="{ 'card-dark': isDarkMode, featured: pIdx === 1 }"
            :style="pIdx === 1 ? { borderColor: accentColor } : {}"
          >
            <span v-if="pIdx === 1" class="tier-popular-tag" :style="{ backgroundColor: accentColor }">
              Paling Populer
            </span>
            <strong class="tier-name" :style="{ color: isDarkMode ? '#ffffff' : '#0f172a' }">{{ plan.title }}</strong>
            <div class="tier-price-row">
              <span class="tier-price" :style="{ color: accentColor }">
                {{ isAnnualBilling ? 'Hemat ' + (plan.price || 'Rp 199k') : (plan.price || 'Rp 249k') }}
              </span>
              <span class="tier-period">/ {{ isAnnualBilling ? 'thn' : 'bln' }}</span>
            </div>
            <p class="tier-desc" :style="{ color: isDarkMode ? '#94a3b8' : '#64748b' }">{{ plan.desc }}</p>

            <button
              class="sim-btn-tier-cta"
              :style="pIdx === 1 ? { backgroundColor: accentColor, color: '#ffffff' } : { borderColor: accentColor, color: accentColor }"
              @click="handleDemoClick('Langganan ' + plan.title)"
            >
              Mulai Paket Ini
            </button>
          </div>
        </div>
      </section>

      <!-- 10. CTA (CALL TO ACTION) BLOCK -->
      <section
        v-else-if="block.type === 'cta'"
        class="sim-block-cta"
        :style="{ background: `linear-gradient(135deg, #090d16 0%, ${accentColor} 100%)` }"
      >
        <div class="sim-cta-content">
          <h2 class="sim-cta-title">{{ block.title || 'Siap Memulai Transformasi Digital Anda?' }}</h2>
          <p class="sim-cta-sub">{{ block.subtitle || 'Konsultasikan arsitektur web modern Anda dengan tim engineer kami.' }}</p>
          <div class="sim-cta-action-row">
            <button class="sim-btn-cta-action" @click="handleDemoClick(block.buttonText || 'Hubungi Kami')">
              <MessageCircle v-if="template.category === 'business'" :size="15" />
              <Send v-else :size="15" />
              <span>{{ block.buttonText || 'Hubungi Kami Langsung' }}</span>
            </button>
          </div>
        </div>
      </section>

      <!-- 11. FOOTER BLOCK -->
      <footer
        v-else-if="block.type === 'footer'"
        class="sim-block-footer"
        :class="{ 'footer-dark': isDarkMode }"
      >
        <div class="sim-footer-inner">
          <div class="footer-left">
            <div class="footer-brand" :style="{ color: accentColor }">
              {{ template.category === 'portfolio' ? 'Rizal Pratama' : template.title.split('&')[0] }}
            </div>
            <p :style="{ color: isDarkMode ? '#94a3b8' : '#64748b' }">
              © 2026 Seluruh Hak Cipta Dilindungi. Ditenagai oleh arsitektur kontainer Stack Studio (Aether Core).
            </p>
          </div>
          <div class="footer-right">
            <span class="edge-status-pill">
              <span class="edge-dot"></span> Traefik v3 Edge Router
            </span>
          </div>
        </div>
      </footer>
    </template>
  </div>
</template>
