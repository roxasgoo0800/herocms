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
        setTimeout(() => {
          emit('complete');
        }, 380);
      }, 160);
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
      <!-- Subtle Radial Ambient Light (Seamless & feathered) -->
      <div class="splash-ambient-glow" aria-hidden="true"></div>

      <!-- Minimalist Brand & Progress Pod (Linear / Apple style) -->
      <div class="splash-minimal-pod">
        <!-- Floating Brand Glyph Emblem -->
        <div class="splash-emblem-wrap">
          <div class="splash-glow-aura" aria-hidden="true"></div>
          <div class="brand-glyph-box">
            <Layers :size="24" color="#ffffff" />
          </div>
        </div>

        <!-- Typography -->
        <div class="brand-title-wrap">
          <h1 class="brand-wordmark">
            HeroCMS <span class="wordmark-highlight">Studio</span>
          </h1>
        </div>

        <!-- Slim Minimalist Progress Bar -->
        <div class="minimal-progress-wrap">
          <div class="minimal-progress-track">
            <div
              class="minimal-progress-fill"
              :class="{ 'is-complete': progress >= 100 }"
              :style="{ width: `${progress}%` }"
            ></div>
          </div>
        </div>

        <!-- Quiet, Human Status Subtext with dynamic stages -->
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
/* Fullscreen Backdrop (Translucent Glass preserving the Background Wave) */
.studio-splash-screen {
  position: fixed;
  inset: 0;
  z-index: 99999;
  background: rgba(248, 250, 252, 0.94);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  user-select: none;
  will-change: opacity, transform;
}

/* Feathered Ambient Soft Light */
.splash-ambient-glow {
  position: absolute;
  width: 500px;
  height: 500px;
  background: radial-gradient(
    circle,
    rgba(37, 99, 235, 0.1) 0%,
    rgba(148, 163, 184, 0.05) 50%,
    transparent 70%
  );
  filter: blur(50px);
  pointer-events: none;
  animation: auraFloat 4s ease-in-out infinite alternate;
}

@keyframes auraFloat {
  0% { transform: scale(0.95); opacity: 0.7; }
  100% { transform: scale(1.08); opacity: 1; }
}

/* Minimalist Pod with Spring/Scale Entrance */
.splash-minimal-pod {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  animation: podScaleIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes podScaleIn {
  0% {
    opacity: 0;
    transform: scale(0.86) translateY(18px);
    filter: blur(8px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
    filter: blur(0);
  }
}

/* Brand Emblem */
.splash-emblem-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.splash-glow-aura {
  position: absolute;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: rgba(37, 99, 235, 0.2);
  filter: blur(14px);
  animation: pulseAura 2.4s ease-in-out infinite alternate;
}

@keyframes pulseAura {
  0% { transform: scale(0.9); opacity: 0.5; }
  100% { transform: scale(1.15); opacity: 0.9; }
}

.brand-glyph-box {
  position: relative;
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    0 10px 24px -4px rgba(15, 23, 42, 0.18),
    inset 0 1px 1px rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

/* Wordmark */
.brand-title-wrap {
  margin-bottom: 22px;
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

/* Slim Minimal Progress Bar (Linear style) */
.minimal-progress-wrap {
  width: 170px;
  margin-bottom: 12px;
}

.minimal-progress-track {
  width: 100%;
  height: 3px;
  background: #e2e8f0;
  border-radius: 9999px;
  overflow: hidden;
  position: relative;
}

.minimal-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #2563eb 0%, #38bdf8 100%);
  border-radius: 9999px;
  transition: width 0.15s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 0 8px rgba(37, 99, 235, 0.4);
}

.minimal-progress-fill.is-complete {
  background: linear-gradient(90deg, #38bdf8 0%, #60a5fa 100%);
  box-shadow: 0 0 16px rgba(56, 189, 248, 0.8), 0 0 24px rgba(37, 99, 235, 0.5);
}

/* Quiet, Elegant Status Subtext */
.minimal-status-row {
  display: flex;
  align-items: center;
  font-size: 0.78rem;
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

/* Seamless Smooth Dissolve In & Out */
.splash-dissolve-enter-active {
  transition: opacity 0.32s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.32s cubic-bezier(0.16, 1, 0.3, 1),
              filter 0.32s cubic-bezier(0.16, 1, 0.3, 1);
}

.splash-dissolve-enter-from {
  opacity: 0;
  transform: scale(0.96);
  filter: blur(8px);
}

.splash-dissolve-leave-active {
  transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
              filter 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.splash-dissolve-leave-to {
  opacity: 0;
  transform: scale(1.08);
  filter: blur(14px);
}
</style>
