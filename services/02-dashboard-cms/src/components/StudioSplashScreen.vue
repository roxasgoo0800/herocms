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
  { at: 100, text: 'Sesi siap! Membuka HeroCMS Studio...' }
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
      <!-- Ambient Glow Behind Elements -->
      <div class="splash-ambient-aura" aria-hidden="true"></div>

      <div class="splash-center-pod">
        <!-- Glowing Brand Logo Icon -->
        <div class="splash-logo-pod">
          <div class="splash-pulse-ring"></div>
          <div class="splash-glyph-box">
            <Layers :size="36" color="#ffffff" />
          </div>
        </div>

        <!-- Wordmark -->
        <div class="splash-brand-text">
          <h1 class="splash-title">
            HeroCMS <span class="splash-title-accent">Studio</span>
          </h1>
          <p class="splash-subtitle">Platform CMS Multi-Tenant & Kontainer Docker Otonom</p>
        </div>

        <!-- Progress Console Box -->
        <div class="splash-progress-card">
          <!-- Header info: status & percent -->
          <div class="progress-meta-row">
            <div class="meta-status-wrap">
              <span class="pulsing-live-dot"></span>
              <span class="meta-status-text">{{ currentStageText }}</span>
            </div>
            <span class="meta-percent-counter">{{ progress }}%</span>
          </div>

          <!-- Progress Bar Track -->
          <div class="progress-track-shell">
            <div
              class="progress-fill-glow"
              :style="{ width: `${progress}%` }"
            >
              <div class="fill-glimmer"></div>
            </div>
          </div>

          <!-- Bottom Telemetry Chips -->
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
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.studio-splash-screen {
  position: fixed;
  inset: 0;
  z-index: 99999;
  background: rgba(248, 250, 252, 0.98);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  user-select: none;
}

/* Ambient Radial Glow */
.splash-ambient-aura {
  position: absolute;
  width: 650px;
  height: 500px;
  background: radial-gradient(
    circle,
    rgba(37, 99, 235, 0.12) 0%,
    rgba(56, 189, 248, 0.08) 40%,
    transparent 70%
  );
  filter: blur(50px);
  pointer-events: none;
  animation: auraBreath 4s ease-in-out infinite alternate;
}

@keyframes auraBreath {
  0% {
    transform: scale(0.95);
    opacity: 0.8;
  }
  100% {
    transform: scale(1.1);
    opacity: 1;
  }
}

.splash-center-pod {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 480px;
  padding: 0 24px;
  text-align: center;
}

/* Logo & Pulse Ring */
.splash-logo-pod {
  position: relative;
  width: 84px;
  height: 84px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 22px;
}

.splash-pulse-ring {
  position: absolute;
  inset: -8px;
  border-radius: 28px;
  border: 1.5px solid rgba(37, 99, 235, 0.25);
  animation: pulseExpand 2s cubic-bezier(0.16, 1, 0.3, 1) infinite;
}

@keyframes pulseExpand {
  0% {
    transform: scale(0.92);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.06);
    opacity: 0.4;
  }
  100% {
    transform: scale(0.92);
    opacity: 0.8;
  }
}

.splash-glyph-box {
  position: relative;
  width: 68px;
  height: 68px;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    0 8px 24px -4px rgba(15, 23, 42, 0.2),
    0 0 20px rgba(37, 99, 235, 0.25);
}

/* Brand Typography */
.splash-brand-text {
  margin-bottom: 28px;
}

.splash-title {
  font-size: 1.6rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.03em;
  margin-bottom: 6px;
}

.splash-title-accent {
  color: #2563eb;
  font-weight: 800;
}

.splash-subtitle {
  font-size: 0.82rem;
  font-weight: 500;
  color: #64748b;
  line-height: 1.45;
  margin: 0;
}

/* Progress Console Card */
.splash-progress-card {
  width: 100%;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 18px 20px;
  box-shadow:
    0 1px 3px rgba(15, 23, 42, 0.04),
    0 12px 28px -6px rgba(15, 23, 42, 0.06);
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.progress-meta-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.meta-status-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  text-align: left;
  overflow: hidden;
}

.pulsing-live-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.25);
  flex-shrink: 0;
  animation: liveDotPulse 1.4s infinite;
}

@keyframes liveDotPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(0.85); }
}

.meta-status-text {
  font-size: 0.76rem;
  font-weight: 600;
  color: #334155;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.meta-percent-counter {
  font-size: 0.82rem;
  font-weight: 700;
  color: #2563eb;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  letter-spacing: -0.02em;
  flex-shrink: 0;
}

/* Progress Track */
.progress-track-shell {
  position: relative;
  width: 100%;
  height: 7px;
  background: #f1f5f9;
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
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
  padding-top: 4px;
  border-top: 1px solid #f1f5f9;
}

.tele-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 8px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.68rem;
  font-weight: 600;
  color: #475569;
}

/* Exit Dissolve Transition */
.splash-dissolve-leave-active {
  transition: opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.45s cubic-bezier(0.16, 1, 0.3, 1),
              filter 0.45s cubic-bezier(0.16, 1, 0.3, 1);
}

.splash-dissolve-leave-to {
  opacity: 0;
  transform: scale(1.03);
  filter: blur(8px);
}
</style>
