<script setup lang="ts">
import { ref } from 'vue';
import {
  Monitor,
  Tablet,
  Smartphone,
  Rocket,
  Sparkles,
  Server,
  Globe,
  TrendingUp,
  ShieldCheck,
  Check,
  Copy,
  ExternalLink,
  Layers,
  Palette,
  Edit3
} from 'lucide-vue-next';
import { useDashboardData } from '../../composables/useDashboardData';

const {
  containers,
  activeContainerId,
  activeContainer,
  editorDevice,
  isPublishing,
  handlePublishChanges,
  aiPromptInput,
  isGeneratingAI,
  handleAiGenerateContent,
  copyToClipboard,
  copiedSubdomain
} = useDashboardData();

const studioTab = ref<'content' | 'ai' | 'design'>('content');

const colorPalettes = [
  { name: 'Electric Indigo', hex: '#2563eb' },
  { name: 'Cyber Emerald', hex: '#059669' },
  { name: 'Hyper Purple', hex: '#7c3aed' },
  { name: 'Solar Orange', hex: '#ea580c' },
  { name: 'Obsidian Noir', hex: '#0f172a' },
  { name: 'Neon Cyan', hex: '#06b6d4' }
];

const applyPromptPreset = (preset: string) => {
  aiPromptInput.value = preset;
  handleAiGenerateContent();
};
</script>

<template>
  <section class="fade-in-section">
    <div v-if="activeContainer" class="studio-workspace-layout">
      <!-- 1. Top Studio Controls Bar -->
      <div class="studio-top-bar">
        <div class="bar-left-controls">
          <div class="site-selector-pill">
            <span class="live-dot-ping"></span>
            <span class="selector-lbl">Target:</span>
            <select v-model="activeContainerId" class="studio-site-dropdown">
              <option v-for="c in containers" :key="c.id" :value="c.id">
                {{ c.name }} ({{ c.subdomain }})
              </option>
            </select>
          </div>
          <span class="sync-tag-pulse">Disimpan otomatis di state memory</span>
        </div>

        <!-- Center: Responsive Device Switcher -->
        <div class="device-switcher-dock">
          <button
            class="dock-btn"
            :class="{ active: editorDevice === 'desktop' }"
            @click="editorDevice = 'desktop'"
            title="Desktop 1440px"
          >
            <Monitor :size="15" />
            <span>Desktop</span>
          </button>
          <button
            class="dock-btn"
            :class="{ active: editorDevice === 'tablet' }"
            @click="editorDevice = 'tablet'"
            title="Tablet 768px"
          >
            <Tablet :size="15" />
            <span>Tablet</span>
          </button>
          <button
            class="dock-btn"
            :class="{ active: editorDevice === 'mobile' }"
            @click="editorDevice = 'mobile'"
            title="Mobile 390px"
          >
            <Smartphone :size="15" />
            <span>Mobile</span>
          </button>
        </div>

        <!-- Right: Deploy Live Button -->
        <div class="bar-right-actions">
          <button
            class="btn-publish-glow"
            :disabled="isPublishing"
            @click="handlePublishChanges"
          >
            <Rocket v-if="!isPublishing" :size="15" />
            <span v-else class="spin-ring-sm"></span>
            <span>{{ isPublishing ? 'Menerbitkan...' : 'Terbitkan ke Kontainer (Live)' }}</span>
          </button>
        </div>
      </div>

      <!-- 2. Main Studio Split Area -->
      <div class="studio-split-panes">
        <!-- Left Pane: Inspector & Controls Panel (370px) -->
        <aside class="studio-inspector-panel">
          <!-- Inspector Tabs -->
          <div class="inspector-tabs-header">
            <button
              class="insp-tab-btn"
              :class="{ active: studioTab === 'content' }"
              @click="studioTab = 'content'"
            >
              <Edit3 :size="13" />
              <span>Konten</span>
            </button>
            <button
              class="insp-tab-btn"
              :class="{ active: studioTab === 'ai' }"
              @click="studioTab = 'ai'"
            >
              <Sparkles :size="13" />
              <span>AI Copilot</span>
            </button>
            <button
              class="insp-tab-btn"
              :class="{ active: studioTab === 'design' }"
              @click="studioTab = 'design'"
            >
              <Palette :size="13" />
              <span>Palet Gaya</span>
            </button>
          </div>

          <div class="inspector-body-content">
            <!-- TAB 1: KONTEN DASAR -->
            <div v-if="studioTab === 'content'" class="tab-pane-content">
              <div class="field-item-pro">
                <label class="field-label-sm">Nama Website / Identitas Brand</label>
                <input
                  v-model="activeContainer.name"
                  type="text"
                  class="studio-input"
                  placeholder="Nama brand atau portfolio"
                />
              </div>

              <div class="field-item-pro">
                <label class="field-label-sm">Headline Utama (Hero Title)</label>
                <input
                  v-model="activeContainer.roleOrHeadline"
                  type="text"
                  class="studio-input"
                  placeholder="e.g. Lead Distributed Systems Engineer"
                />
              </div>

              <div class="field-item-pro">
                <div class="label-with-hint">
                  <label class="field-label-sm">Deskripsi Singkat / Bio Intro</label>
                  <span class="char-count">{{ (activeContainer.bioIntro || '').length }} karakter</span>
                </div>
                <textarea
                  v-model="activeContainer.bioIntro"
                  rows="4"
                  class="studio-input studio-textarea"
                  placeholder="Tuliskan perkenalan singkat yang menarik..."
                ></textarea>
              </div>

              <div class="field-item-pro">
                <label class="field-label-sm">Subdomain Traefik Routing</label>
                <div class="subdomain-preview-box">
                  <Globe :size="13" color="#2563eb" />
                  <span class="sub-txt">https://{{ activeContainer.subdomain }}</span>
                  <button
                    class="btn-copy-mini"
                    @click="copyToClipboard(activeContainer.subdomain, 'studio_sub')"
                    title="Salin Subdomain"
                  >
                    <Check v-if="copiedSubdomain === 'studio_sub'" :size="12" class="text-green" />
                    <Copy v-else :size="12" />
                  </button>
                </div>
              </div>
            </div>

            <!-- TAB 2: AI COPILOT -->
            <div v-else-if="studioTab === 'ai'" class="tab-pane-ai">
              <div class="ai-hero-box">
                <div class="ai-title-row">
                  <div class="ai-sparkle-glyph">
                    <Sparkles :size="16" />
                  </div>
                  <div>
                    <h4>Hero AI Studio Copilot</h4>
                    <span>Generator narasi profesional berbasis prompt</span>
                  </div>
                </div>

                <div class="preset-prompts-wrap">
                  <span class="preset-label">CONTOH PROMPT CEPAT:</span>
                  <div class="preset-chips">
                    <button
                      class="preset-chip"
                      @click="applyPromptPreset('Tulis profil Senior Cloud Architect spesialis microservices dan Docker')"
                    >
                      🚀 Cloud Architect
                    </button>
                    <button
                      class="preset-chip"
                      @click="applyPromptPreset('Buat headline menarik untuk startup B2B SaaS efisiensi bisnis')"
                    >
                      💼 B2B SaaS Startup
                    </button>
                    <button
                      class="preset-chip"
                      @click="applyPromptPreset('Tulis bio interaktif untuk Lead Frontend & UI/UX Developer')"
                    >
                      🎨 UI/UX Engineer
                    </button>
                  </div>
                </div>

                <div class="ai-input-wrap">
                  <textarea
                    v-model="aiPromptInput"
                    rows="3"
                    placeholder="Ketik instruksi AI: contoh 'Perbaiki bio ini agar lebih persuasif untuk klien enterprise'..."
                    class="ai-prompt-area"
                    @keydown.ctrl.enter="handleAiGenerateContent"
                  ></textarea>
                  <button
                    class="btn-generate-ai-action"
                    :disabled="isGeneratingAI || !aiPromptInput.trim()"
                    @click="handleAiGenerateContent"
                  >
                    <Sparkles :size="14" />
                    <span>{{ isGeneratingAI ? 'Menyusun Konten...' : 'Generate Konten Sekarang' }}</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- TAB 3: PALET GAYA -->
            <div v-else class="tab-pane-design">
              <div class="field-item-pro">
                <label class="field-label-sm">Warna Aksen Brand & Elemen CTA</label>
                <div class="color-palette-cards">
                  <div
                    v-for="pal in colorPalettes"
                    :key="pal.hex"
                    class="palette-card-item"
                    :class="{ active: activeContainer.accentColor === pal.hex }"
                    @click="activeContainer.accentColor = pal.hex"
                  >
                    <span class="color-swatch-circle" :style="{ backgroundColor: pal.hex }"></span>
                    <div class="pal-info">
                      <span class="pal-name">{{ pal.name }}</span>
                      <span class="pal-hex">{{ pal.hex }}</span>
                    </div>
                    <Check v-if="activeContainer.accentColor === pal.hex" :size="14" class="pal-check" />
                  </div>
                </div>
              </div>

              <div class="field-item-pro" style="margin-top: 20px;">
                <label class="field-label-sm">Template Blueprint Terpasang</label>
                <div class="template-active-box">
                  <Layers :size="16" color="#2563eb" />
                  <div>
                    <strong>{{ activeContainer.templateName }}</strong>
                    <span>Dioptimasi untuk SEO & Lighthouse 100/100</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <!-- Right Pane: Live Device Preview Canvas -->
        <main class="studio-canvas-stage">
          <div class="device-frame-shell" :class="`device-mode-${editorDevice}`">
            <!-- Browser Top Window Bar -->
            <div class="mock-browser-chrome">
              <div class="traffic-lights">
                <span class="light red"></span>
                <span class="light yellow"></span>
                <span class="light green"></span>
              </div>
              <div class="mock-url-pill">
                <ShieldCheck :size="12" color="#059669" />
                <span class="mock-url-text">https://{{ activeContainer.subdomain }}</span>
              </div>
              <div class="mock-edge-status">
                <span class="status-live-point"></span>
                <span>Docker Ingress: 1.8ms</span>
              </div>
            </div>

            <!-- Website Rendered Screen (High-End & Futuristic) -->
            <div class="mock-rendered-website">
              <!-- Site Navbar -->
              <nav class="mock-site-nav">
                <div class="mock-brand-name" :style="{ color: activeContainer.accentColor }">
                  <span class="brand-cube">◆</span>
                  <span>{{ activeContainer.name }}</span>
                </div>
                <div class="mock-nav-links">
                  <span>Beranda</span>
                  <span>Karya</span>
                  <span>Artikel</span>
                  <button class="btn-mock-contact" :style="{ backgroundColor: activeContainer.accentColor }">
                    Hubungi Saya
                  </button>
                </div>
              </nav>

              <!-- Hero Section with Glowing Backdrop -->
              <header class="mock-hero-section">
                <div class="mock-ambient-blur" :style="{ background: `radial-gradient(circle, ${activeContainer.accentColor}33 0%, transparent 70%)` }"></div>

                <div class="mock-pill-category" :style="{ color: activeContainer.accentColor, borderColor: activeContainer.accentColor + '40', backgroundColor: activeContainer.accentColor + '12' }">
                  <span class="pill-sparkle">✦</span>
                  <span>{{ activeContainer.templateName }}</span>
                </div>

                <h1 class="mock-hero-headline">
                  {{ activeContainer.roleOrHeadline }}
                </h1>

                <p class="mock-hero-bio">
                  {{ activeContainer.bioIntro }}
                </p>

                <div class="mock-cta-row">
                  <button class="mock-btn-primary" :style="{ backgroundColor: activeContainer.accentColor }">
                    <span>Eksplorasi Portofolio</span>
                    <ExternalLink :size="13" />
                  </button>
                  <button class="mock-btn-secondary">
                    <span>Lihat Dokumentasi</span>
                  </button>
                </div>
              </header>

              <!-- Feature Highlights Grid -->
              <section class="mock-features-grid">
                <div class="mock-feature-card">
                  <div class="feat-icon-wrap" :style="{ color: activeContainer.accentColor, backgroundColor: activeContainer.accentColor + '12' }">
                    <Server :size="16" />
                  </div>
                  <h4>Orkestrasi Kontainer Terisolasi</h4>
                  <p>Berjalan pada runtime Docker Engine mandiri dengan jaminan keamanan cgroups v2 kernel.</p>
                </div>

                <div class="mock-feature-card">
                  <div class="feat-icon-wrap" :style="{ color: activeContainer.accentColor, backgroundColor: activeContainer.accentColor + '12' }">
                    <Globe :size="16" />
                  </div>
                  <h4>Edge Ingress Traefik v3</h4>
                  <p>Sertifikat SSL Let's Encrypt TLS v1.3 aktif dan otomatis diperbarui secara berkala.</p>
                </div>

                <div class="mock-feature-card">
                  <div class="feat-icon-wrap" :style="{ color: activeContainer.accentColor, backgroundColor: activeContainer.accentColor + '12' }">
                    <TrendingUp :size="16" />
                  </div>
                  <h4>Telemetri Real-Time</h4>
                  <p>Pencatatan statistik kunjungan secepat kilat dengan antrean Kafka dan Redis DB.</p>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  </section>
</template>

<style scoped>
.studio-workspace-layout {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Studio Top Bar */
.studio-top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 10px 18px;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.03);
  flex-wrap: wrap;
  gap: 12px;
}

.bar-left-controls {
  display: flex;
  align-items: center;
  gap: 14px;
}

.site-selector-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 5px 10px;
}

.live-dot-ping {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.25);
}

.selector-lbl {
  font-size: 0.72rem;
  font-weight: 700;
  color: #64748b;
}

.studio-site-dropdown {
  border: none;
  background: transparent;
  font-size: 0.82rem;
  font-weight: 700;
  color: #0f172a;
  outline: none;
  cursor: pointer;
}

.sync-tag-pulse {
  font-size: 0.72rem;
  color: #059669;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  padding: 3px 8px;
  border-radius: 6px;
}

/* Device Switcher */
.device-switcher-dock {
  display: flex;
  background: #f1f5f9;
  padding: 3px;
  border-radius: 9px;
  gap: 2px;
}

.dock-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.74rem;
  font-weight: 600;
  color: #64748b;
  background: transparent;
  border: none;
  padding: 6px 12px;
  border-radius: 7px;
  cursor: pointer;
  transition: all 0.12s ease;
}

.dock-btn:hover {
  color: #0f172a;
}

.dock-btn.active {
  background: #ffffff;
  color: #2563eb;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.08);
}

.btn-publish-glow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: #ffffff;
  border: none;
  padding: 8px 18px;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.25);
}

.btn-publish-glow:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.35);
}

/* Studio Split Panes */
.studio-split-panes {
  display: grid;
  grid-template-columns: 370px 1fr;
  gap: 18px;
  align-items: start;
}

@media (max-width: 1050px) {
  .studio-split-panes { grid-template-columns: 1fr; }
}

/* Left Inspector Panel */
.studio-inspector-panel {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.03);
}

.inspector-tabs-header {
  display: flex;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.insp-tab-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px 10px;
  font-size: 0.74rem;
  font-weight: 700;
  color: #64748b;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: all 0.12s ease;
}

.insp-tab-btn:hover {
  color: #0f172a;
}

.insp-tab-btn.active {
  color: #2563eb;
  border-bottom-color: #2563eb;
  background: #ffffff;
}

.inspector-body-content {
  padding: 20px;
}

.field-item-pro {
  margin-bottom: 16px;
}

.field-label-sm {
  display: block;
  font-size: 0.72rem;
  font-weight: 700;
  color: #475569;
  margin-bottom: 6px;
}

.studio-input {
  width: 100%;
  padding: 9px 12px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  font-size: 0.84rem;
  color: #0f172a;
  outline: none;
  transition: all 0.15s ease;
}

.studio-input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
}

.studio-textarea {
  resize: vertical;
  line-height: 1.45;
}

.label-with-hint {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.char-count {
  font-size: 0.68rem;
  color: #94a3b8;
}

.subdomain-preview-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 8px 12px;
  border-radius: 8px;
}

.sub-txt {
  flex: 1;
  font-family: ui-monospace, monospace;
  font-size: 0.76rem;
  color: #0f172a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.btn-copy-mini {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 5px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #475569;
}

/* AI Studio Box */
.ai-hero-box {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.ai-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ai-sparkle-glyph {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.ai-title-row h4 {
  font-size: 0.88rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.ai-title-row span {
  font-size: 0.7rem;
  color: #64748b;
}

.preset-prompts-wrap {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.preset-label {
  font-size: 0.65rem;
  font-weight: 800;
  color: #64748b;
  letter-spacing: 0.05em;
}

.preset-chips {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.preset-chip {
  text-align: left;
  font-size: 0.72rem;
  font-weight: 600;
  color: #334155;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 6px 10px;
  border-radius: 7px;
  cursor: pointer;
  transition: all 0.12s ease;
}

.preset-chip:hover {
  background: #eff6ff;
  color: #2563eb;
  border-color: #bfdbfe;
}

.ai-prompt-area {
  width: 100%;
  padding: 10px 12px;
  border-radius: 9px;
  border: 1px solid #cbd5e1;
  font-size: 0.8rem;
  color: #0f172a;
  outline: none;
  resize: vertical;
  margin-bottom: 8px;
}

.ai-prompt-area:focus {
  border-color: #7c3aed;
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.12);
}

.btn-generate-ai-action {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  color: #ffffff;
  border: none;
  padding: 10px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-generate-ai-action:hover:not(:disabled) {
  background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
  transform: translateY(-1px);
}

/* Palettes */
.color-palette-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.palette-card-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.12s ease;
}

.palette-card-item:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.palette-card-item.active {
  background: #eff6ff;
  border-color: #2563eb;
}

.color-swatch-circle {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  flex-shrink: 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
}

.pal-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1;
}

.pal-name {
  font-size: 0.72rem;
  font-weight: 700;
  color: #0f172a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pal-hex {
  font-size: 0.65rem;
  color: #64748b;
  font-family: monospace;
}

.pal-check {
  color: #2563eb;
  flex-shrink: 0;
}

.template-active-box {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 10px 14px;
  border-radius: 9px;
}

.template-active-box strong {
  font-size: 0.82rem;
  color: #0f172a;
  display: block;
}

.template-active-box span {
  font-size: 0.7rem;
  color: #64748b;
}

/* Right Stage Canvas */
.studio-canvas-stage {
  display: flex;
  justify-content: center;
  overflow-x: auto;
  padding-bottom: 20px;
}

.device-frame-shell {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 16px;
  box-shadow: 0 12px 32px -4px rgba(15, 23, 42, 0.1), 0 2px 8px rgba(15, 23, 42, 0.04);
  overflow: hidden;
  transition: width 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.device-mode-desktop { width: 100%; max-width: 1080px; }
.device-mode-tablet { width: 768px; }
.device-mode-mobile { width: 390px; }

.mock-browser-chrome {
  height: 42px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
}

.traffic-lights {
  display: flex;
  gap: 6px;
}

.traffic-lights .light {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.light.red { background: #ef4444; }
.light.yellow { background: #f59e0b; }
.light.green { background: #10b981; }

.mock-url-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  padding: 4px 14px;
  border-radius: 999px;
  font-size: 0.72rem;
  color: #334155;
}

.mock-edge-status {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.68rem;
  color: #059669;
}

.status-live-point {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10b981;
}

/* Rendered Website */
.mock-rendered-website {
  background: #ffffff;
  padding: 24px 32px 48px;
  position: relative;
  overflow: hidden;
  min-height: 480px;
}

.mock-site-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 14px;
}

.mock-brand-name {
  font-size: 1.05rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  display: flex;
  align-items: center;
  gap: 6px;
}

.mock-nav-links {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 0.78rem;
  color: #64748b;
}

.btn-mock-contact {
  color: #ffffff;
  border: none;
  padding: 5px 12px;
  border-radius: 6px;
  font-size: 0.74rem;
  font-weight: 600;
  cursor: pointer;
}

.mock-hero-section {
  text-align: center;
  max-width: 680px;
  margin: 0 auto 48px;
  position: relative;
}

.mock-ambient-blur {
  position: absolute;
  top: -60px;
  left: 50%;
  transform: translateX(-50%);
  width: 420px;
  height: 240px;
  filter: blur(50px);
  pointer-events: none;
  z-index: 0;
}

.mock-pill-category {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.72rem;
  font-weight: 800;
  padding: 3px 10px;
  border-radius: 999px;
  border: 1px solid;
  margin-bottom: 16px;
  position: relative;
  z-index: 1;
}

.mock-hero-headline {
  font-size: 1.85rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.03em;
  line-height: 1.25;
  margin-bottom: 14px;
  position: relative;
  z-index: 1;
}

.mock-hero-bio {
  font-size: 0.88rem;
  color: #64748b;
  line-height: 1.55;
  margin-bottom: 24px;
  position: relative;
  z-index: 1;
}

.mock-cta-row {
  display: flex;
  justify-content: center;
  gap: 10px;
  position: relative;
  z-index: 1;
}

.mock-btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #ffffff;
  border: none;
  padding: 9px 18px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.mock-btn-secondary {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  color: #334155;
  padding: 9px 16px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
}

/* Features Grid */
.mock-features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

@media (max-width: 700px) {
  .mock-features-grid { grid-template-columns: 1fr; }
}

.mock-feature-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 18px;
  text-align: left;
}

.feat-icon-wrap {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.mock-feature-card h4 {
  font-size: 0.84rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 6px;
}

.mock-feature-card p {
  font-size: 0.74rem;
  color: #64748b;
  line-height: 1.45;
  margin: 0;
}
</style>
