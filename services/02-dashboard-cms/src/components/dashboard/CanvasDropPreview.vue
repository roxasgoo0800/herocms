<script setup lang="ts">
import { computed } from 'vue';
import {
  Sparkles,
  Server,
  Zap,
  ShieldCheck,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Cloud,
  Layers,
  Send
} from 'lucide-vue-next';
import { blockCatalogItems } from '../../data/editor-presets';

const props = withDefaults(
  defineProps<{
    blockType: string;
    accentColor?: string;
  }>(),
  {
    accentColor: '#2563eb'
  }
);

const catalogItem = computed(() => {
  return blockCatalogItems.find((item) => item.type === props.blockType) || null;
});
</script>

<template>
  <div class="drop-slot-live-preview-container" role="presentation" aria-hidden="true">
    <!-- Top Announcement Ribbon -->
    <div class="drop-slot-preview-header">
      <div class="preview-header-badge">
        <Sparkles :size="13" class="preview-sparkle-anim" />
        <span class="preview-label">PRATINJAU TEMPAT PENEMPELAN:</span>
        <strong class="preview-item-name">{{ catalogItem?.name || blockType }}</strong>
      </div>
      <div class="preview-drop-hint">
        <span class="pulse-dot-cyan"></span>
        <span>Lepas tombol mouse untuk menempatkan komponen di posisi ini</span>
      </div>
    </div>

    <!-- Live Realistic Component Preview Stage -->
    <div class="drop-slot-preview-stage" :style="{ '--preview-accent': accentColor }">
      <!-- 1. CAROUSEL PREVIEW -->
      <div v-if="blockType === 'carousel'" class="preview-box preview-carousel">
        <div class="preview-section-heading">
          <span class="preview-tag-pill">SHOWCASE INTERAKTIF</span>
          <h4 class="preview-title">Sorotan Portofolio & Pelanggan</h4>
          <p class="preview-subtitle">Geser banner untuk melihat preview karya dan rilis fitur terbaru.</p>
        </div>
        <div class="preview-carousel-card">
          <button class="preview-nav-arrow left" type="button" tabindex="-1"><ChevronLeft :size="14" /></button>
          <div class="preview-carousel-content">
            <div class="preview-carousel-banner-img">
              <div class="preview-carousel-overlay-cta">
                <Cloud :size="14" />
                <span>Ganti Foto</span>
              </div>
            </div>
            <div class="preview-carousel-body">
              <span class="preview-badge-mini">RILIS 2.4</span>
              <h5 class="preview-carousel-headline">Ekosistem Cloud-Native Terpadu</h5>
              <p class="preview-carousel-desc">Orkestrasi kontainer mandiri dengan konsumsi memori hemat dan respon ultra-cepat.</p>
              <div class="preview-author-quote">— DevOps Lead</div>
              <div class="preview-carousel-dots">
                <span class="preview-dot active"></span>
                <span class="preview-dot"></span>
                <span class="preview-dot"></span>
              </div>
            </div>
          </div>
          <button class="preview-nav-arrow right" type="button" tabindex="-1"><ChevronRight :size="14" /></button>
        </div>
      </div>

      <!-- 2. HERO PREVIEW -->
      <div v-else-if="blockType === 'hero'" class="preview-box preview-hero">
        <div class="preview-hero-inner">
          <span class="preview-tag-pill">CLOUD NATIVE CMS ARCHITECTURE</span>
          <h3 class="preview-hero-title">Orkestrasikan Kontainer Multi-Tenant dengan Kecepatan Tinggi</h3>
          <p class="preview-hero-subtitle">
            Platform CMS cloud-native mandiri dengan isolasi tenant cgroups v2, analitik real-time, dan editor visual modern tanpa batas.
          </p>
          <div class="preview-btn-group">
            <div class="preview-btn-primary">
              <span>Mulai Sekarang</span>
              <ArrowRight :size="13" />
            </div>
            <div class="preview-btn-secondary">
              <span>Pelajari Fitur</span>
            </div>
          </div>
          <div class="preview-telemetry-pills">
            <span class="telemetry-pill"><Check :size="11" /> 99.99% Uptime SLA</span>
            <span class="telemetry-pill"><Check :size="11" /> Traefik v3 Edge Ingress</span>
            <span class="telemetry-pill"><Check :size="11" /> Multi-Tenant RLS</span>
          </div>
        </div>
      </div>

      <!-- 3. FEATURES / SHOWCASE PREVIEW -->
      <div v-else-if="blockType === 'features' || blockType === 'showcase'" class="preview-box preview-features">
        <div class="preview-section-heading">
          <span class="preview-tag-pill">ARSITEKTUR & FITUR</span>
          <h4 class="preview-title">Keunggulan Sistem Cloud Terpadu</h4>
          <p class="preview-subtitle">Dirancang dari dasar untuk mendukung skalabilitas multi-tenant enterprise.</p>
        </div>
        <div class="preview-grid-3">
          <div class="preview-bento-card">
            <div class="preview-bento-icon"><Server :size="18" /></div>
            <h5>Isolasi Kontainer Docker</h5>
            <p>Setiap tenant berjalan di cgroups v2 independen dengan kuota memori dan vCPU terisolasi.</p>
          </div>
          <div class="preview-bento-card">
            <div class="preview-bento-icon"><Zap :size="18" /></div>
            <h5>Edge Routing Traefik v3</h5>
            <p>Routing subdomain otomatis dengan sertifikat SSL Let's Encrypt auto-renew.</p>
          </div>
          <div class="preview-bento-card">
            <div class="preview-bento-icon"><ShieldCheck :size="18" /></div>
            <h5>PostgreSQL Multi-Tenant RLS</h5>
            <p>Isolasi basis data tingkat baris (Row-Level Security) dengan audit keamanan teruji.</p>
          </div>
        </div>
      </div>

      <!-- 4. PRICING PREVIEW -->
      <div v-else-if="blockType === 'pricing'" class="preview-box preview-pricing">
        <div class="preview-section-heading">
          <span class="preview-tag-pill">PAKET & BIAYA</span>
          <h4 class="preview-title">Kapasitas & Skalabilitas Fleksibel</h4>
          <p class="preview-subtitle">Pilih konfigurasi runtime yang paling sesuai dengan kebutuhan skala bisnis Anda.</p>
        </div>
        <div class="preview-grid-3">
          <div class="preview-pricing-card">
            <div class="tier-name">Starter</div>
            <div class="tier-price">Rp 49.000 <span class="per-month">/ bln</span></div>
            <ul class="tier-features">
              <li><Check :size="12" /> 1 Kontainer Standar</li>
              <li><Check :size="12" /> 256MB RAM Dedicated</li>
              <li><Check :size="12" /> Subdomain *.stackbyte.id</li>
            </ul>
            <div class="preview-btn-card">Pilih Starter</div>
          </div>
          <div class="preview-pricing-card is-flagship">
            <div class="flagship-badge">FLAGSHIP</div>
            <div class="tier-name">Pro Studio</div>
            <div class="tier-price">Rp 149.000 <span class="per-month">/ bln</span></div>
            <ul class="tier-features">
              <li><Check :size="12" /> 3 Kontainer Mandiri</li>
              <li><Check :size="12" /> 1GB RAM & Auto-Scale</li>
              <li><Check :size="12" /> Custom Domain Traefik TLS</li>
              <li><Check :size="12" /> Backup Storage MinIO S3</li>
            </ul>
            <div class="preview-btn-card is-primary">Mulai Uji Coba Pro</div>
          </div>
          <div class="preview-pricing-card">
            <div class="tier-name">Enterprise</div>
            <div class="tier-price">Rp 499.000 <span class="per-month">/ bln</span></div>
            <ul class="tier-features">
              <li><Check :size="12" /> Unlimited Kontainer Fleet</li>
              <li><Check :size="12" /> Dedicated vCPU & RAM</li>
              <li><Check :size="12" /> SLA Garansi 99.99%</li>
            </ul>
            <div class="preview-btn-card">Hubungi Sales</div>
          </div>
        </div>
      </div>

      <!-- 5. CTA PREVIEW -->
      <div v-else-if="blockType === 'cta'" class="preview-box preview-cta">
        <div class="preview-cta-card">
          <div class="preview-cta-content">
            <h4>Siap Membangun dan Meluncurkan Situs Anda Hari Ini?</h4>
            <p>Bergabung bersama ratusan pengembang yang mengelola situs cloud-native dengan HeroCMS Studio.</p>
          </div>
          <div class="preview-cta-action">
            <div class="preview-btn-cta">
              <span>Deploy Kontainer Baru Sekarang</span>
              <ArrowRight :size="14" />
            </div>
          </div>
        </div>
      </div>

      <!-- 6. STATS PREVIEW -->
      <div v-else-if="blockType === 'stats'" class="preview-box preview-stats">
        <div class="preview-section-heading">
          <span class="preview-tag-pill">TELEMETRI REAL-TIME</span>
          <h4 class="preview-title">Performa & Keandalan Fleet Sistem</h4>
        </div>
        <div class="preview-grid-4">
          <div class="preview-stat-card">
            <div class="stat-num">99.99%</div>
            <div class="stat-label">Uptime SLA Terjamin</div>
          </div>
          <div class="preview-stat-card">
            <div class="stat-num">2.4ms</div>
            <div class="stat-label">Rata-rata TTFB Latensi</div>
          </div>
          <div class="preview-stat-card">
            <div class="stat-num">10M+</div>
            <div class="stat-label">Total Permintaan Bulanan</div>
          </div>
          <div class="preview-stat-card">
            <div class="stat-num">150+</div>
            <div class="stat-label">Tenant & Domain Aktif</div>
          </div>
        </div>
      </div>

      <!-- 7. ACCORDION / FAQ PREVIEW -->
      <div v-else-if="blockType === 'accordion'" class="preview-box preview-accordion">
        <div class="preview-section-heading">
          <span class="preview-tag-pill">BANTUAN & FAQ</span>
          <h4 class="preview-title">Pertanyaan yang Sering Diajukan</h4>
        </div>
        <div class="preview-accordion-list">
          <div class="preview-acc-item is-open">
            <div class="preview-acc-head">
              <span>Bagaimana cara kerja isolasi kontainer multi-tenant?</span>
              <ChevronDown :size="14" class="acc-chevron is-rotated" />
            </div>
            <div class="preview-acc-body">
              Setiap tenant berjalan di dalam kontainer Docker mandiri yang dibatasi oleh cgroups v2 kernel Linux untuk isolasi resource CPU dan memori RAM.
            </div>
          </div>
          <div class="preview-acc-item">
            <div class="preview-acc-head">
              <span>Apakah saya dapat menggunakan custom domain pribadi?</span>
              <ChevronDown :size="14" class="acc-chevron" />
            </div>
          </div>
          <div class="preview-acc-item">
            <div class="preview-acc-head">
              <span>Bagaimana sistem mengelola pencadangan basis data otomatis?</span>
              <ChevronDown :size="14" class="acc-chevron" />
            </div>
          </div>
        </div>
      </div>

      <!-- 8. FORMCONTROL PREVIEW -->
      <div v-else-if="blockType === 'formcontrol'" class="preview-box preview-formcontrol">
        <div class="preview-form-card">
          <div class="preview-section-heading">
            <span class="preview-tag-pill">KONTAK & KONSULTASI</span>
            <h4 class="preview-title">Hubungi Tim & Mulai Kolaborasi</h4>
          </div>
          <div class="preview-form-grid">
            <div class="form-field">
              <label>Nama Lengkap</label>
              <div class="fake-input">John Doe</div>
            </div>
            <div class="form-field">
              <label>Alamat Email</label>
              <div class="fake-input">john.doe@enterprise.com</div>
            </div>
            <div class="form-field is-full">
              <label>Subjek Kebutuhan</label>
              <div class="fake-input">Konsultasi Deployment Kontainer Multi-Tenant</div>
            </div>
            <div class="form-field is-full">
              <label>Pesan Anda</label>
              <div class="fake-textarea">Halo tim HeroCMS, kami ingin berkonsultasi mengenai migrasi fleet website...</div>
            </div>
          </div>
          <div class="preview-form-footer">
            <div class="preview-btn-primary">
              <Send :size="13" />
              <span>Kirim Pesan Sekarang</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 9. CARD SHOWCASE PREVIEW -->
      <div v-else-if="blockType === 'card'" class="preview-box preview-cards">
        <div class="preview-section-heading">
          <span class="preview-tag-pill">KATALOG & SHOWCASE</span>
          <h4 class="preview-title">Sorotan Karya & Portofolio Pilihan</h4>
        </div>
        <div class="preview-grid-3">
          <div v-for="i in 3" :key="i" class="preview-content-card">
            <div class="preview-card-thumb"></div>
            <div class="preview-card-body">
              <span class="preview-card-badge">PROYEK 0{{ i }}</span>
              <h5>Infrastruktur Cloud-Native Enterprise</h5>
              <p>Showcase arsitektur sistem dengan skalabilitas dinamis dan monitoring Kafka.</p>
              <div class="preview-card-link">Lihat Detail <ArrowRight :size="11" /></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 10. NAVBAR PREVIEW -->
      <div v-else-if="blockType === 'navbar'" class="preview-box preview-navbar">
        <div class="preview-nav-bar">
          <div class="nav-brand">
            <span class="brand-glyph">◆</span>
            <strong>HeroStudio</strong>
          </div>
          <div class="nav-menu-links">
            <span class="nav-link active">Beranda</span>
            <span class="nav-link">Keunggulan</span>
            <span class="nav-link">Layanan</span>
            <span class="nav-link">Harga</span>
            <span class="nav-link">Kontak</span>
          </div>
          <div class="nav-cta-btn">Mulai Sekarang</div>
        </div>
      </div>

      <!-- 11. FOOTER PREVIEW -->
      <div v-else-if="blockType === 'footer'" class="preview-box preview-footer">
        <div class="preview-footer-grid">
          <div class="footer-col brand-col">
            <div class="nav-brand">
              <span class="brand-glyph">◆</span>
              <strong>HeroCMS Studio</strong>
            </div>
            <p>Platform CMS cloud-native modern untuk orkestrasi kontainer mandiri dan isolasi data tenant.</p>
          </div>
          <div class="footer-col">
            <h6>Produk</h6>
            <span>Dashboard Studio</span>
            <span>Visual Editor</span>
            <span>Multi-Tenant RLS</span>
          </div>
          <div class="footer-col">
            <h6>Dukungan</h6>
            <span>Dokumentasi API</span>
            <span>Status Sistem</span>
            <span>Pusat Bantuan</span>
          </div>
          <div class="footer-col">
            <h6>Legalitas</h6>
            <span>Kebijakan Privasi</span>
            <span>Syarat Layanan</span>
            <span>Keamanan Data</span>
          </div>
        </div>
        <div class="preview-footer-bottom">
          <span>© 2026 HeroCMS Studio. Hak Cipta Dilindungi Undang-Undang.</span>
        </div>
      </div>

      <!-- 12. PROGRESSBAR PREVIEW -->
      <div v-else-if="blockType === 'progressbar'" class="preview-box preview-progressbar">
        <div class="preview-section-heading">
          <span class="preview-tag-pill">KAPASITAS RUNTIME</span>
          <h4 class="preview-title">Alokasi & Pemakaian Resource Fleet</h4>
        </div>
        <div class="preview-progress-rows">
          <div class="progress-row">
            <div class="progress-meta">
              <span>Alokasi vCPU Core</span>
              <strong>18% (0.18 / 1.0 vCPU)</strong>
            </div>
            <div class="progress-track"><div class="progress-fill" style="width: 18%"></div></div>
          </div>
          <div class="progress-row">
            <div class="progress-meta">
              <span>Penggunaan RAM Cgroup</span>
              <strong>42% (108MB / 256MB)</strong>
            </div>
            <div class="progress-track"><div class="progress-fill" style="width: 42%"></div></div>
          </div>
          <div class="progress-row">
            <div class="progress-meta">
              <span>Penyimpanan Storage S3</span>
              <strong>65% (1.3GB / 2.0GB)</strong>
            </div>
            <div class="progress-track"><div class="progress-fill" style="width: 65%"></div></div>
          </div>
        </div>
      </div>

      <!-- 13. FALLBACK GENERIC PREVIEW -->
      <div v-else class="preview-box preview-generic">
        <div class="preview-generic-card">
          <Layers :size="24" class="generic-icon" />
          <div class="generic-info">
            <h5>{{ catalogItem?.name || blockType }}</h5>
            <p>{{ catalogItem?.desc || 'Komponen siap dipasang ke kanvas website.' }}</p>
          </div>
          <span class="generic-pill">{{ catalogItem?.badge || 'KOMPONEN' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.drop-slot-live-preview-container {
  position: relative;
  width: 100%;
  border: 2px dashed var(--preview-accent, #2563eb);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 16px 48px -12px rgba(37, 99, 235, 0.22), 0 0 0 1px rgba(37, 99, 235, 0.12);
  padding: 16px 22px;
  box-sizing: border-box;
  overflow: hidden;
  pointer-events: none;
  user-select: none;
  animation: dropSlotPulseGlow 2.4s infinite ease-in-out;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes dropSlotPulseGlow {
  0%, 100% {
    border-color: #2563eb;
    box-shadow: 0 14px 40px -10px rgba(37, 99, 235, 0.24), 0 0 0 1px rgba(37, 99, 235, 0.14);
  }
  50% {
    border-color: #3b82f6;
    box-shadow: 0 20px 52px -10px rgba(59, 130, 246, 0.38), 0 0 0 3px rgba(59, 130, 246, 0.22);
  }
}

/* Header Banner */
.drop-slot-preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
  padding-bottom: 10px;
  border-bottom: 1px dashed #cbd5e1;
}

.preview-header-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: #eff6ff;
  color: #1d4ed8;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 0.74rem;
  font-weight: 700;
  border: 1px solid #bfdbfe;
  letter-spacing: 0.02em;
}

.preview-sparkle-anim {
  color: #2563eb;
  animation: sparkleRotate 3s infinite linear;
}

@keyframes sparkleRotate {
  0% { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(180deg) scale(1.15); }
  100% { transform: rotate(360deg) scale(1); }
}

.preview-label {
  color: #3b82f6;
  font-size: 0.68rem;
  letter-spacing: 0.05em;
}

.preview-item-name {
  color: #1e3a8a;
  font-weight: 800;
}

.preview-drop-hint {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.73rem;
  font-weight: 600;
  color: #475569;
  background: #f1f5f9;
  padding: 4px 10px;
  border-radius: 6px;
}

.pulse-dot-cyan {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #06b6d4;
  box-shadow: 0 0 8px #06b6d4;
  animation: pulseDot 1.4s infinite ease-in-out;
}

@keyframes pulseDot {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.4); opacity: 0.6; }
}

/* Stage & Base Typography */
.drop-slot-preview-stage {
  position: relative;
  width: 100%;
  box-sizing: border-box;
}

.preview-box {
  width: 100%;
  border-radius: 10px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  padding: 20px 24px;
  box-sizing: border-box;
}

.preview-section-heading {
  text-align: center;
  margin-bottom: 18px;
}

.preview-tag-pill {
  display: inline-block;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: #2563eb;
  background: #eff6ff;
  padding: 3px 10px;
  border-radius: 999px;
  margin-bottom: 6px;
}

.preview-title {
  font-size: 1.15rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 4px 0;
  letter-spacing: -0.02em;
}

.preview-subtitle {
  font-size: 0.8rem;
  color: #64748b;
  margin: 0;
}

/* Grid Layouts */
.preview-grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

.preview-grid-4 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

/* 1. Carousel Styles */
.preview-carousel-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: 680px;
  margin: 0 auto;
}

.preview-nav-arrow {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #334155;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  flex-shrink: 0;
}

.preview-carousel-content {
  flex: 1;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.06);
  background: #ffffff;
}

.preview-carousel-banner-img {
  height: 120px;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.preview-carousel-overlay-cta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #2563eb;
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 6px 14px;
  border-radius: 999px;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
}

.preview-carousel-body {
  padding: 14px 18px;
  text-align: center;
}

.preview-badge-mini {
  display: inline-block;
  font-size: 0.65rem;
  font-weight: 800;
  color: #ffffff;
  background: #2563eb;
  padding: 2px 8px;
  border-radius: 999px;
  margin-bottom: 6px;
}

.preview-carousel-headline {
  font-size: 0.95rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 4px 0;
}

.preview-carousel-desc {
  font-size: 0.74rem;
  color: #64748b;
  margin: 0 0 6px 0;
}

.preview-author-quote {
  font-size: 0.7rem;
  font-style: italic;
  color: #94a3b8;
  margin-bottom: 8px;
}

.preview-carousel-dots {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.preview-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #cbd5e1;
}

.preview-dot.active {
  width: 16px;
  border-radius: 999px;
  background: #2563eb;
}

/* 2. Hero Styles */
.preview-hero-inner {
  text-align: center;
  max-width: 620px;
  margin: 0 auto;
}

.preview-hero-title {
  font-size: 1.35rem;
  font-weight: 900;
  color: #0f172a;
  line-height: 1.25;
  margin: 6px 0 8px 0;
  letter-spacing: -0.03em;
}

.preview-hero-subtitle {
  font-size: 0.82rem;
  color: #64748b;
  line-height: 1.5;
  margin: 0 0 16px 0;
}

.preview-btn-group {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 16px;
}

.preview-btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #0f172a;
  color: #ffffff;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 700;
}

.preview-btn-secondary {
  display: inline-flex;
  align-items: center;
  background: #f1f5f9;
  color: #334155;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 700;
  border: 1px solid #e2e8f0;
}

.preview-telemetry-pills {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}

.telemetry-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.68rem;
  font-weight: 600;
  color: #059669;
  background: #ecfdf5;
  padding: 3px 8px;
  border-radius: 999px;
  border: 1px solid #a7f3d0;
}

/* 3. Bento Features Styles */
.preview-bento-card {
  padding: 14px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
}

.preview-bento-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #eff6ff;
  color: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.preview-bento-card h5 {
  font-size: 0.84rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 4px 0;
}

.preview-bento-card p {
  font-size: 0.72rem;
  color: #64748b;
  margin: 0;
  line-height: 1.4;
}

/* 4. Pricing Styles */
.preview-pricing-card {
  position: relative;
  padding: 14px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  display: flex;
  flex-direction: column;
}

.preview-pricing-card.is-flagship {
  border-color: #2563eb;
  background: #f8faff;
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.1);
}

.flagship-badge {
  position: absolute;
  top: -8px;
  right: 12px;
  font-size: 0.6rem;
  font-weight: 800;
  background: #2563eb;
  color: #ffffff;
  padding: 2px 6px;
  border-radius: 999px;
}

.tier-name {
  font-size: 0.85rem;
  font-weight: 800;
  color: #0f172a;
}

.tier-price {
  font-size: 1.05rem;
  font-weight: 900;
  color: #0f172a;
  margin: 4px 0 10px 0;
}

.per-month {
  font-size: 0.7rem;
  font-weight: 500;
  color: #64748b;
}

.tier-features {
  list-style: none;
  padding: 0;
  margin: 0 0 12px 0;
  font-size: 0.7rem;
  color: #475569;
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.tier-features li {
  display: flex;
  align-items: center;
  gap: 5px;
}

.tier-features li svg {
  color: #059669;
}

.preview-btn-card {
  text-align: center;
  padding: 6px 10px;
  border-radius: 6px;
  background: #f1f5f9;
  color: #0f172a;
  font-size: 0.72rem;
  font-weight: 700;
  border: 1px solid #e2e8f0;
}

.preview-btn-card.is-primary {
  background: #2563eb;
  color: #ffffff;
  border: none;
}

/* 5. CTA Styles */
.preview-cta-card {
  background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
  border-radius: 12px;
  padding: 20px 24px;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.preview-cta-content h4 {
  font-size: 1.05rem;
  font-weight: 800;
  margin: 0 0 4px 0;
}

.preview-cta-content p {
  font-size: 0.78rem;
  opacity: 0.9;
  margin: 0;
}

.preview-btn-cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #ffffff;
  color: #0f172a;
  font-size: 0.78rem;
  font-weight: 800;
  padding: 10px 18px;
  border-radius: 8px;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 6. Stats Styles */
.preview-stat-card {
  text-align: center;
  padding: 12px;
  border-radius: 8px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.stat-num {
  font-size: 1.25rem;
  font-weight: 900;
  color: #2563eb;
  margin-bottom: 2px;
  letter-spacing: -0.02em;
}

.stat-label {
  font-size: 0.7rem;
  font-weight: 600;
  color: #64748b;
}

/* 7. Accordion Styles */
.preview-accordion-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-width: 600px;
  margin: 0 auto;
}

.preview-acc-item {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 10px 14px;
  background: #ffffff;
}

.preview-acc-item.is-open {
  border-color: #93c5fd;
  background: #f8faff;
}

.preview-acc-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.78rem;
  font-weight: 700;
  color: #0f172a;
}

.acc-chevron.is-rotated {
  transform: rotate(180deg);
  color: #2563eb;
}

.preview-acc-body {
  margin-top: 6px;
  font-size: 0.72rem;
  color: #475569;
  line-height: 1.4;
}

/* 8. FormControl Styles */
.preview-form-card {
  max-width: 580px;
  margin: 0 auto;
}

.preview-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 12px;
}

.form-field.is-full {
  grid-column: span 2;
}

.form-field label {
  display: block;
  font-size: 0.7rem;
  font-weight: 700;
  color: #334155;
  margin-bottom: 4px;
}

.fake-input {
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 0.74rem;
  color: #64748b;
}

.fake-textarea {
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 0.74rem;
  color: #64748b;
  min-height: 48px;
}

.preview-form-footer {
  display: flex;
  justify-content: flex-end;
}

/* 9. Cards Showcase */
.preview-content-card {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  background: #ffffff;
}

.preview-card-thumb {
  height: 70px;
  background: linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%);
}

.preview-card-body {
  padding: 10px;
}

.preview-card-badge {
  font-size: 0.6rem;
  font-weight: 800;
  color: #2563eb;
  background: #eff6ff;
  padding: 2px 6px;
  border-radius: 4px;
}

.preview-content-card h5 {
  font-size: 0.78rem;
  font-weight: 700;
  color: #0f172a;
  margin: 4px 0 2px 0;
}

.preview-content-card p {
  font-size: 0.68rem;
  color: #64748b;
  margin: 0 0 6px 0;
  line-height: 1.3;
}

.preview-card-link {
  font-size: 0.68rem;
  font-weight: 700;
  color: #2563eb;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

/* 10. Navbar */
.preview-nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  border-radius: 8px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.nav-brand {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.82rem;
  color: #0f172a;
}

.brand-glyph {
  color: #2563eb;
}

.nav-menu-links {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nav-link {
  font-size: 0.74rem;
  color: #64748b;
  font-weight: 600;
}

.nav-link.active {
  color: #2563eb;
  font-weight: 800;
}

.nav-cta-btn {
  background: #0f172a;
  color: #ffffff;
  padding: 5px 12px;
  border-radius: 6px;
  font-size: 0.72rem;
  font-weight: 700;
}

/* 11. Footer */
.preview-footer-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1fr;
  gap: 14px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e2e8f0;
}

.footer-col {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 0.7rem;
  color: #64748b;
}

.brand-col p {
  font-size: 0.68rem;
  margin: 6px 0 0 0;
  line-height: 1.3;
}

.footer-col h6 {
  font-size: 0.74rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 4px 0;
}

.preview-footer-bottom {
  padding-top: 8px;
  font-size: 0.68rem;
  color: #94a3b8;
  text-align: center;
}

/* 12. ProgressBar */
.preview-progress-rows {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.progress-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.72rem;
  color: #334155;
  margin-bottom: 4px;
}

.progress-track {
  height: 8px;
  background: #f1f5f9;
  border-radius: 999px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #2563eb 0%, #3b82f6 100%);
  border-radius: 999px;
}

/* 13. Generic */
.preview-generic-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
}

.generic-icon {
  color: #2563eb;
}

.generic-info h5 {
  font-size: 0.85rem;
  font-weight: 700;
  margin: 0 0 2px 0;
  color: #0f172a;
}

.generic-info p {
  font-size: 0.72rem;
  color: #64748b;
  margin: 0;
}

.generic-pill {
  margin-left: auto;
  font-size: 0.65rem;
  font-weight: 800;
  color: #2563eb;
  background: #eff6ff;
  padding: 3px 8px;
  border-radius: 999px;
}
</style>
