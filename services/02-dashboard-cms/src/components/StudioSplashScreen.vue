<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { Layers } from 'lucide-vue-next';

const props = withDefaults(
  defineProps<{
    targetUrl?: string;
    durationMs?: number;
  }>(),
  {
    targetUrl: '/',
    durationMs: 1300
  }
);

const emit = defineEmits<{
  (e: 'revealing'): void;
  (e: 'complete'): void;
}>();

const progress = ref(0);
const isFinished = ref(false);

const ringCircumference = 289; // 2 * Math.PI * 46
const ringOffset = computed(() => {
  return ringCircumference - (progress.value / 100) * ringCircumference;
});

const statusText = computed(() => {
  if (progress.value < 40) return 'Menyiapkan workspace';
  if (progress.value < 85) return 'Memuat modul studio';
  return 'Membuka dashboard';
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
        emit('revealing');
        setTimeout(() => {
          emit('complete');
        }, 340);
      }, 100);
    }
  };

  timer = requestAnimationFrame(step);
});

onUnmounted(() => {
  if (timer) cancelAnimationFrame(timer);
});
</script>

<template>
  <transition name="splash-dissolve" appear>
    <div v-if="!isFinished" class="studio-splash-screen" role="status" aria-live="polite">
      <!-- 1. Background Theme Dot Grid (Solid white canvas ensures dashboard is completely hidden) -->
      <div class="base-dot-grid" aria-hidden="true"></div>

      <!-- 2. Ambient Soft Center Light -->
      <div class="ambient-mesh-glow" aria-hidden="true"></div>

      <!-- 3. Iconic Center Piece: Circular Halo Ring + Emblem -->
      <div class="splash-center-pod">
        <!-- Circular Progress Halo with Centered Brand Emblem -->
        <div class="halo-emblem-container">
          <!-- Concentric Ambient Aura -->
          <div class="halo-ambient-aura" :class="{ 'is-complete': progress >= 100 }" aria-hidden="true"></div>

          <!-- SVG Circular Progress Ring -->
          <svg class="halo-svg-ring" width="104" height="104" viewBox="0 0 104 104" aria-hidden="true">
            <defs>
              <linearGradient id="heroHaloGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#0f172a" />
                <stop offset="60%" stop-color="#2563eb" />
                <stop offset="100%" stop-color="#38bdf8" />
              </linearGradient>
            </defs>

            <!-- Background subtle track -->
            <circle
              class="halo-track"
              cx="52"
              cy="52"
              r="46"
              stroke="#e2e8f0"
              stroke-width="2.5"
              fill="none"
            />

            <!-- Active animated progress stroke -->
            <circle
              class="halo-fill"
              cx="52"
              cy="52"
              r="46"
              stroke="url(#heroHaloGrad)"
              stroke-width="2.5"
              stroke-linecap="round"
              fill="none"
              :stroke-dasharray="ringCircumference"
              :stroke-dashoffset="ringOffset"
            />
          </svg>

          <!-- Floating Core Brand Glyph Box -->
          <div class="brand-glyph-box" :class="{ 'glyph-pulse': progress >= 100 }">
            <Layers :size="26" color="#ffffff" />
          </div>
        </div>

        <!-- Cohesive Typography & Monospace Progress Stream -->
        <div class="brand-title-wrap">
          <h1 class="brand-wordmark">
            HeroCMS <span class="wordmark-highlight">Studio</span>
          </h1>

          <div class="status-stream-row">
            <span class="status-stream-text">{{ statusText }}</span>
            <span class="status-dot-sep">•</span>
            <span class="status-stream-pct">{{ progress }}%</span>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
/* Fullscreen Backdrop: OPAQUE #ffffff so dashboard underneath is completely hidden until reveal */
.studio-splash-screen {
  position: fixed;
  inset: 0;
  z-index: 99999;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  user-select: none;
  will-change: opacity, transform;
}

/* Exact Theme Base Dot Grid */
.base-dot-grid {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(#cbd5e1 1.2px, transparent 1.2px);
  background-size: 28px 28px;
  background-position: -14px -14px;
  opacity: 0.75;
  pointer-events: none;
}

/* Ambient Soft Glow matching LoginView & BackgroundWave */
.ambient-mesh-glow {
  position: absolute;
  width: 550px;
  height: 550px;
  background: radial-gradient(
    circle,
    rgba(37, 99, 235, 0.08) 0%,
    rgba(148, 163, 184, 0.08) 50%,
    transparent 70%
  );
  filter: blur(50px);
  pointer-events: none;
}

/* Minimalist Center Pod */
.splash-center-pod {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  animation: podScaleIn 0.42s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes podScaleIn {
  0% {
    opacity: 0;
    transform: scale(0.9) translateY(14px);
    filter: blur(6px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
    filter: blur(0);
  }
}

/* Circular Halo Ring Container */
.halo-emblem-container {
  position: relative;
  width: 104px;
  height: 104px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 22px;
}

.halo-ambient-aura {
  position: absolute;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(37, 99, 235, 0.15) 0%, rgba(148, 163, 184, 0.05) 60%, transparent 75%);
  filter: blur(16px);
  transition: all 0.4s ease;
  pointer-events: none;
}

.halo-ambient-aura.is-complete {
  background: radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, rgba(37, 99, 235, 0.12) 60%, transparent 75%);
  transform: scale(1.2);
}

.halo-svg-ring {
  position: absolute;
  inset: 0;
  transform: rotate(-90deg);
  pointer-events: none;
}

.halo-track {
  opacity: 0.8;
}

.halo-fill {
  transition: stroke-dashoffset 0.12s linear;
  filter: drop-shadow(0 0 4px rgba(37, 99, 235, 0.4));
}

/* Brand Glyph Box Centered Inside the Halo */
.brand-glyph-box {
  position: relative;
  z-index: 2;
  width: 54px;
  height: 54px;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    0 12px 28px -4px rgba(15, 23, 42, 0.25),
    inset 0 1px 1px rgba(255, 255, 255, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.12);
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.brand-glyph-box.glyph-pulse {
  transform: scale(1.04);
  box-shadow:
    0 14px 32px -4px rgba(37, 99, 235, 0.3),
    inset 0 1px 1px rgba(255, 255, 255, 0.35);
}

/* Typography & Status Stream */
.brand-title-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.brand-wordmark {
  font-size: 1.55rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.035em;
  line-height: 1.2;
  margin: 0 0 8px 0;
}

.wordmark-highlight {
  background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.status-stream-row {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.84rem;
  font-weight: 500;
  color: #64748b;
  letter-spacing: -0.01em;
}

.status-dot-sep {
  opacity: 0.5;
  font-size: 0.75rem;
}

.status-stream-pct {
  font-variant-numeric: tabular-nums;
  font-weight: 600;
  color: #0f172a;
  min-width: 32px;
  text-align: left;
}

/* Dissolve in & out for the whole overlay */
.splash-dissolve-enter-active {
  transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.splash-dissolve-enter-from {
  opacity: 0;
}

.splash-dissolve-leave-active {
  transition: opacity 0.34s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.34s cubic-bezier(0.16, 1, 0.3, 1),
              filter 0.34s cubic-bezier(0.16, 1, 0.3, 1);
}

.splash-dissolve-leave-to {
  opacity: 0;
  transform: scale(1.04);
  filter: blur(8px);
}
</style>
