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

const statusText = computed(() => {
  if (progress.value < 35) return 'Memverifikasi sesi aman';
  if (progress.value < 75) return 'Menyiapkan workspace studio';
  return 'Membuka HeroCMS Studio';
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
      <!-- 1. Identical Dot Grid to preserve theme background uninterrupted -->
      <div class="base-dot-grid" aria-hidden="true"></div>

      <!-- 2. Ambient Soft Glow matching LoginView & BackgroundWave -->
      <div class="ambient-mesh-glow" aria-hidden="true"></div>

      <!-- 3. Glassmorphic Card (100% Theme Match with auth-panel-glass) -->
      <div class="splash-card-glass">
        <!-- Brand Glyph Box -->
        <div class="brand-glyph-box">
          <Layers :size="22" color="#ffffff" />
        </div>

        <!-- Brand Typography -->
        <div class="brand-title-wrap">
          <h1 class="brand-wordmark">
            HeroCMS <span class="wordmark-highlight">Studio</span>
          </h1>
          <div class="brand-chip-row">
            <span class="pulse-dot"></span>
            <span class="chip-text">v2.4 Enterprise Studio</span>
          </div>
        </div>

        <!-- Progress Bar: Theme Matched (Obsidian #0f172a to Royal Blue #2563eb) -->
        <div class="minimal-progress-wrap">
          <div class="minimal-progress-track">
            <div
              class="minimal-progress-fill"
              :class="{ 'is-complete': progress >= 100 }"
              :style="{ width: `${progress}%` }"
            ></div>
          </div>
        </div>

        <!-- Status Row matching theme font & color -->
        <div class="minimal-status-row">
          <span class="minimal-status-text">{{ statusText }}</span>
          <span class="status-dots">
            <span class="dot">.</span><span class="dot">.</span><span class="dot">.</span>
          </span>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
/* Fullscreen Backdrop: Translucent so dot grid and wave stay continuous */
.studio-splash-screen {
  position: fixed;
  inset: 0;
  z-index: 99999;
  background: rgba(255, 255, 255, 0.45);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
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
    rgba(37, 99, 235, 0.07) 0%,
    rgba(148, 163, 184, 0.08) 50%,
    transparent 70%
  );
  filter: blur(50px);
  pointer-events: none;
}

/* Glassmorphic Card (100% Theme Match with auth-panel-glass) */
.splash-card-glass {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;
  max-width: 380px;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(226, 232, 240, 0.85);
  border-radius: 20px;
  box-shadow:
    0 20px 40px -15px rgba(15, 23, 42, 0.08),
    0 0 0 1px rgba(255, 255, 255, 0.8);
  padding: 34px 38px;
  animation: cardScaleIn 0.42s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes cardScaleIn {
  0% {
    opacity: 0;
    transform: scale(0.92) translateY(14px);
    filter: blur(8px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
    filter: blur(0);
  }
}

/* Brand Glyph Box (100% Theme Match) */
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
}

/* Typography (100% Theme Match) */
.brand-title-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
}

.brand-wordmark {
  font-size: 1.45rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.03em;
  line-height: 1.2;
  margin: 0;
}

.wordmark-highlight {
  background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.brand-chip-row {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(248, 250, 252, 0.85);
  border: 1px solid #e2e8f0;
  padding: 3px 10px;
  border-radius: 999px;
  margin-top: 6px;
}

.pulse-dot {
  width: 6px;
  height: 6px;
  background: #10b981;
  border-radius: 50%;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
}

.chip-text {
  font-size: 0.72rem;
  color: #64748b;
  font-weight: 600;
  letter-spacing: -0.01em;
}

/* Progress Bar (Theme: Slate #0f172a to Blue #2563eb) */
.minimal-progress-wrap {
  width: 100%;
  max-width: 260px;
  margin-bottom: 14px;
}

.minimal-progress-track {
  width: 100%;
  height: 4px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 9999px;
  overflow: hidden;
  position: relative;
}

.minimal-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #0f172a 0%, #2563eb 100%);
  border-radius: 9999px;
  transition: width 0.15s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 0 8px rgba(37, 99, 235, 0.3);
}

.minimal-progress-fill.is-complete {
  background: linear-gradient(90deg, #0f172a 0%, #2563eb 60%, #10b981 100%);
  box-shadow: 0 0 12px rgba(16, 185, 129, 0.4);
}

/* Status Subtext */
.minimal-status-row {
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  font-weight: 500;
  color: #64748b;
  letter-spacing: -0.01em;
}

.status-dots .dot {
  animation: blinkDot 1.4s infinite both;
}

.status-dots .dot:nth-child(1) { animation-delay: 0s; }
.status-dots .dot:nth-child(2) { animation-delay: 0.2s; }
.status-dots .dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes blinkDot {
  0%, 80%, 100% { opacity: 0.2; }
  40% { opacity: 1; }
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
