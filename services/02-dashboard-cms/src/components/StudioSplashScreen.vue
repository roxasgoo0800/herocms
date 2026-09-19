<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { Layers, ShieldCheck, Server, Globe, Cpu } from 'lucide-vue-next';

const props = withDefaults(
  defineProps<{
    targetUrl?: string;
    durationMs?: number;
  }>(),
  {
    targetUrl: '/',
    durationMs: 1400
  }
);

const emit = defineEmits<{
  (e: 'complete'): void;
}>();

const progress = ref(0);
const isFinished = ref(false);

const stages = [
  { at: 15, text: 'Menginisialisasi sesi terenkripsi TLS v1.3...' },
  { at: 45, text: 'Menghubungkan ke backend Go & database PostgreSQL...' },
  { at: 75, text: 'Memuat modul studio visual, stylesheet CSS & telemetri...' },
  { at: 95, text: 'Menyiapkan workspace konsol tenant...' },
  { at: 100, text: 'Selesai! Membuka HeroCMS Studio...' }
];

const currentStageText = computed(() => {
  for (let i = stages.length - 1; i >= 0; i--) {
    if (progress.value >= stages[i].at) {
      return stages[i].text;
    }
  }
  return 'Mempersiapkan lingkungan studio...';
});

let timer: number | null = null;
const startTime = Date.now();

onMounted(() => {
  const step = () => {
    const elapsed = Date.now() - startTime;
    const rawPct = Math.min(100, (elapsed / props.durationMs) * 100);
    progress.value = Math.round(rawPct);

    if (progress.value < 100) {
      timer = requestAnimationFrame(step);
    } else {
      setTimeout(() => {
        isFinished.value = true;
        setTimeout(() => {
          emit('complete');
        }, 350);
      }, 200);
    }
  };

  timer = requestAnimationFrame(step);
});

onUnmounted(() => {
  if (timer) cancelAnimationFrame(timer);
});
</script>

<template>
  <transition name="splash-dissolve">
    <div v-if="!isFinished" class="studio-splash-screen" role="status" aria-live="polite">
      <!-- 1. Base Subtle Dot Matrix Grid (Exact match with HeroCMS BackgroundWave) -->
      <div class="base-dot-grid" aria-hidden="true"></div>

      <!-- 2. Ambient Mesh Diffused Glow -->
      <div class="ambient-mesh-glow" aria-hidden="true"></div>

      <!-- 3. Central Cohesive Surface Container -->
      <div class="auth-surface-container">
        <!-- Modern Brand Header (Exact match with LoginView) -->
        <header class="auth-brand-badge">
          <div class="brand-glyph-box">
            <Layers :size="22" color="#ffffff" />
          </div>
          <div class="brand-title-wrap">
            <h1 class="brand-wordmark">HeroCMS <span class="wordmark-highlight">Studio</span></h1>
          </div>
        </header>

        <!-- Glassmorphic Card (Exact match with LoginView auth-panel-glass) -->
        <div class="auth-panel-glass splash-card">
          <!-- Card Heading Intro -->
          <div class="panel-intro">
            <div class="splash-badge-row">
              <span class="pulse-live-dot"></span>
              <span class="splash-mode-badge">WORKSPACE INITIALIZATION</span>
            </div>
            <h2 class="panel-heading">Mempersiapkan Konsol Studio</h2>
            <p class="panel-sub">
              Menyinkronkan sesi kredensial, runtime kontainer, dan aset visual...
            </p>
          </div>

          <!-- Progress Console Zone -->
          <div class="splash-progress-zone">
            <div class="progress-meta-row">
              <span class="meta-stage-text">{{ currentStageText }}</span>
              <span class="meta-percent-number">{{ progress }}%</span>
            </div>

            <!-- Progress Track Shell -->
            <div class="progress-track-shell">
              <div
                class="progress-fill-glow"
                :style="{ width: `${progress}%` }"
              >
                <div class="fill-glimmer"></div>
              </div>
            </div>
          </div>

          <!-- Infrastructure Telemetry Badges -->
          <div class="telemetry-badges-row">
            <div class="tele-chip">
              <ShieldCheck :size="12" color="#059669" />
              <span>TLS v1.3</span>
            </div>
            <div class="tele-chip">
              <Server :size="12" color="#2563eb" />
              <span>cgroups v2</span>
            </div>
            <div class="tele-chip">
              <Globe :size="12" color="#7c3aed" />
              <span>Traefik v3</span>
            </div>
            <div class="tele-chip">
              <Cpu :size="12" color="#0891b2" />
              <span>PostgreSQL RLS</span>
            </div>
          </div>

          <!-- Security Ingress Guarantee Badge (Exact match with LoginView) -->
          <footer class="panel-security-chip">
            <ShieldCheck :size="14" color="#059669" />
            <span>Koneksi TLS v1.3 • cgroups v2 Terisolasi</span>
          </footer>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
/* Fullscreen Backdrop */
.studio-splash-screen {
  position: fixed;
  inset: 0;
  z-index: 99999;
  background-color: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 20px;
  overflow: hidden;
  user-select: none;
}

/* 1. Base Subtle Dot Matrix Grid (Exact match with HeroCMS BackgroundWave) */
.base-dot-grid {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(#cbd5e1 1.2px, transparent 1.2px);
  background-size: 28px 28px;
  background-position: -14px -14px;
  opacity: 0.85;
  pointer-events: none;
  z-index: 1;
}

/* 2. Ambient Diffused Glow */
.ambient-mesh-glow {
  position: absolute;
  width: 580px;
  height: 440px;
  background: radial-gradient(
    circle,
    rgba(37, 99, 235, 0.12) 0%,
    rgba(148, 163, 184, 0.08) 50%,
    transparent 70%
  );
  filter: blur(50px);
  pointer-events: none;
  z-index: 2;
  animation: meshBreath 3.5s ease-in-out infinite alternate;
}

@keyframes meshBreath {
  0% { transform: scale(0.96); opacity: 0.8; }
  100% { transform: scale(1.08); opacity: 1; }
}

/* 3. Surface Container */
.auth-surface-container {
  width: 100%;
  max-width: 440px;
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Brand Header (Identical to LoginView) */
.auth-brand-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 24px;
}

.brand-glyph-box {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  box-shadow: 0 8px 20px -4px rgba(15, 23, 42, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: logoPulse 2s ease-in-out infinite alternate;
}

@keyframes logoPulse {
  0% { transform: scale(1); box-shadow: 0 8px 20px -4px rgba(15, 23, 42, 0.2); }
  100% { transform: scale(1.04); box-shadow: 0 10px 24px -2px rgba(37, 99, 235, 0.25); }
}

.brand-wordmark {
  font-size: 1.55rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.03em;
  line-height: 1.2;
}

.wordmark-highlight {
  background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Glassmorphic Panel (Identical to LoginView auth-panel-glass) */
.auth-panel-glass.splash-card {
  width: 100%;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: 20px;
  padding: 32px 28px;
  box-shadow:
    0 0 0 1px rgba(15, 23, 42, 0.03),
    0 16px 36px -8px rgba(15, 23, 42, 0.07),
    0 2px 6px rgba(15, 23, 42, 0.02);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Heading Intro */
.panel-intro {
  margin-bottom: 2px;
}

.splash-badge-row {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #eff6ff;
  border: 1px solid #dbeafe;
  padding: 3px 9px;
  border-radius: 6px;
  margin-bottom: 10px;
}

.pulse-live-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.25);
  animation: liveDotPulse 1.4s infinite;
}

@keyframes liveDotPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.85); }
}

.splash-mode-badge {
  font-size: 0.65rem;
  font-weight: 800;
  color: #1d4ed8;
  letter-spacing: 0.06em;
}

.panel-heading {
  font-size: 1.18rem;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.01em;
  margin-bottom: 4px;
}

.panel-sub {
  font-size: 0.82rem;
  color: #64748b;
  line-height: 1.45;
  margin: 0;
}

/* Progress Zone */
.splash-progress-zone {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
}

.progress-meta-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.meta-stage-text {
  font-size: 0.76rem;
  font-weight: 600;
  color: #334155;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.meta-percent-number {
  font-size: 0.8rem;
  font-weight: 700;
  color: #2563eb;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  flex-shrink: 0;
}

/* Progress Track */
.progress-track-shell {
  position: relative;
  width: 100%;
  height: 6px;
  background: #e2e8f0;
  border-radius: 9999px;
  overflow: hidden;
}

.progress-fill-glow {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  background: linear-gradient(90deg, #2563eb 0%, #38bdf8 50%, #2563eb 100%);
  border-radius: 9999px;
  transition: width 0.15s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
}

.fill-glimmer {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  animation: shimmerMove 1.5s infinite;
}

@keyframes shimmerMove {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* Telemetry Badges */
.telemetry-badges-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 6px;
}

.tele-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 8px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.68rem;
  font-weight: 600;
  color: #475569;
}

/* Security Guarantee Chip (Exact match with LoginView) */
.panel-security-chip {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 0.72rem;
  color: #64748b;
  padding-top: 4px;
}

/* Exit Transition */
.splash-dissolve-leave-active {
  transition: opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
              filter 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.splash-dissolve-leave-to {
  opacity: 0;
  transform: scale(1.02);
  filter: blur(6px);
}
</style>
