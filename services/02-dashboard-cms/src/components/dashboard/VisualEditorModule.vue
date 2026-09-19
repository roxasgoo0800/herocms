<script setup lang="ts">
import {
  Monitor,
  Tablet,
  Smartphone,
  Rocket,
  Sparkles,
  Server,
  Globe,
  TrendingUp,
  ShieldCheck
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
  handleAiGenerateContent
} = useDashboardData();
</script>

<template>
  <section class="fade-in-section">
    <div v-if="activeContainer" class="pro-editor-layout">
      <!-- Top Editor Sub-Toolbar -->
      <div class="editor-top-strip">
        <div class="strip-left">
          <span class="lbl-site">Mengedit:</span>
          <select v-model="activeContainerId" class="select-site-switch">
            <option v-for="c in containers" :key="c.id" :value="c.id">
              {{ c.name }} ({{ c.subdomain }})
            </option>
          </select>
          <span class="badge-saved">Disimpan otomatis</span>
        </div>

        <!-- Device Switcher + Deploy Button -->
        <div class="strip-right">
          <div class="screen-size-switch">
            <button
              class="btn-screen"
              :class="{ active: editorDevice === 'desktop' }"
              @click="editorDevice = 'desktop'"
              title="Pratinjau Desktop"
            >
              <Monitor :size="15" />
            </button>
            <button
              class="btn-screen"
              :class="{ active: editorDevice === 'tablet' }"
              @click="editorDevice = 'tablet'"
              title="Pratinjau Tablet"
            >
              <Tablet :size="15" />
            </button>
            <button
              class="btn-screen"
              :class="{ active: editorDevice === 'mobile' }"
              @click="editorDevice = 'mobile'"
              title="Pratinjau Smartphone"
            >
              <Smartphone :size="15" />
            </button>
          </div>

          <button class="btn-deploy-live" :disabled="isPublishing" @click="handlePublishChanges">
            <Rocket v-if="!isPublishing" :size="15" />
            <span v-else class="spinner-tiny"></span>
            <span>{{ isPublishing ? 'Menerbitkan...' : 'Terbitkan ke Kontainer (Live)' }}</span>
          </button>
        </div>
      </div>

      <!-- 2-Column Split: Controls + Visual Mockup -->
      <div class="builder-split-body">
        <!-- Left: Form Controls (360px) -->
        <div class="builder-controls-panel">
          <div class="panel-section-title">KONTEN SITUS</div>

          <div class="form-item">
            <label>Nama Website / Brand</label>
            <input v-model="activeContainer.name" type="text" class="input-pro" />
          </div>

          <div class="form-item">
            <label>Judul Utama (Headline)</label>
            <input v-model="activeContainer.roleOrHeadline" type="text" class="input-pro" />
          </div>

          <div class="form-item">
            <label>Bio Singkat / Deskripsi Portofolio</label>
            <textarea v-model="activeContainer.bioIntro" rows="3" class="input-pro textarea-pro"></textarea>
          </div>

          <!-- AI Writing Box -->
          <div class="ai-generator-box">
            <div class="ai-box-title">
              <Sparkles :size="14" color="#2563eb" />
              <span>Hero AI Copilot</span>
            </div>
            <input
              v-model="aiPromptInput"
              type="text"
              placeholder="Instruksi AI: 'Tulis intro senior dev'..."
              class="input-pro"
              @keydown.enter="handleAiGenerateContent"
            />
            <button class="btn-ai-submit" :disabled="isGeneratingAI || !aiPromptInput.trim()" @click="handleAiGenerateContent">
              <Sparkles :size="13" />
              <span>{{ isGeneratingAI ? 'Menyusun...' : 'Generate Konten' }}</span>
            </button>
          </div>

          <div class="panel-section-title" style="margin-top: 20px;">DESAIN & GAYA</div>

          <div class="form-item">
            <label>Warna Aksen Brand</label>
            <div class="colors-row">
              <button
                v-for="col in ['#2563eb', '#059669', '#7c3aed', '#ea580c', '#0f172a']"
                :key="col"
                class="color-dot"
                :style="{ backgroundColor: col }"
                :class="{ selected: activeContainer.accentColor === col }"
                @click="activeContainer.accentColor = col"
              ></button>
            </div>
          </div>

          <div class="form-item">
            <label>Subdomain Terhubung</label>
            <input :value="`https://${activeContainer.subdomain}`" readonly class="input-pro input-readonly" />
          </div>
        </div>

        <!-- Right: Device Canvas Preview -->
        <div class="builder-preview-canvas" :class="`device-${editorDevice}`">
          <div class="browser-mockup">
            <div class="browser-mockup-bar">
              <div class="browser-circle-dots">
                <span></span><span></span><span></span>
              </div>
              <div class="browser-url-pill">
                <ShieldCheck :size="12" color="#059669" />
                <span>https://{{ activeContainer.subdomain }}</span>
              </div>
              <span class="badge-live-tag">● Live Docker</span>
            </div>

            <!-- Rendered Template Mockup -->
            <div class="rendered-page">
              <header class="page-top-nav">
                <div class="site-logo" :style="{ color: activeContainer.accentColor }">
                  {{ activeContainer.name }}
                </div>
                <div class="nav-mock-links">
                  <span>Beranda</span>
                  <span>Tentang</span>
                  <span>Proyek</span>
                  <button class="btn-mock-cta" :style="{ backgroundColor: activeContainer.accentColor }">
                    Kontak
                  </button>
                </div>
              </header>

              <div class="page-hero-mock">
                <span class="hero-tag-badge" :style="{ color: activeContainer.accentColor, borderColor: activeContainer.accentColor + '40', backgroundColor: activeContainer.accentColor + '10' }">
                  {{ activeContainer.templateName }}
                </span>
                <h2 class="hero-h2">{{ activeContainer.roleOrHeadline }}</h2>
                <p class="hero-p">{{ activeContainer.bioIntro }}</p>
                <div class="hero-btns-mock">
                  <button class="btn-hero-pri" :style="{ backgroundColor: activeContainer.accentColor }">
                    Lihat Portofolio
                  </button>
                  <button class="btn-hero-sec">Dokumentasi</button>
                </div>
              </div>

              <div class="page-features-grid">
                <div class="feature-mock-card">
                  <Server :size="18" :style="{ color: activeContainer.accentColor }" />
                  <h4>Orkestrasi Kontainer Terisolasi</h4>
                  <p>Berjalan pada runtime Docker Engine mandiri dengan jaminan keamanan cgroups v2.</p>
                </div>
                <div class="feature-mock-card">
                  <Globe :size="18" :style="{ color: activeContainer.accentColor }" />
                  <h4>Edge Routing Traefik v3</h4>
                  <p>Sertifikat SSL Let's Encrypt TLS v1.3 aktif dan otomatis diperbarui secara berkala.</p>
                </div>
                <div class="feature-mock-card">
                  <TrendingUp :size="18" :style="{ color: activeContainer.accentColor }" />
                  <h4>Telemetri Real-Time</h4>
                  <p>Pencatatan statistik kunjungan secepat kilat dengan antrean Kafka dan Redis DB.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
