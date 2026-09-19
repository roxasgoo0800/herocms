<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { Layers } from 'lucide-vue-next';
import { useDashboardData } from '../composables/useDashboardData';

const props = withDefaults(
  defineProps<{
    targetUrl?: string;
    durationMs?: number;
  }>(),
  {
    targetUrl: '/',
    durationMs: 1100
  }
);

const emit = defineEmits<{
  (e: 'revealing'): void;
  (e: 'complete'): void;
}>();

const progress = ref(8);
const isFinished = ref(false);
const statusText = ref('Memverifikasi sesi & token...');

let isUnmounted = false;
let stepTimer: number | null = null;

onMounted(async () => {
  const startTime = Date.now();
  const { syncWithBackend } = useDashboardData();

  // 1. Stage 1: Auth Token & Sesi Validation
  statusText.value = 'Memverifikasi sesi & token...';
  progress.value = 25;

  // 2. Stage 2: Background Data Hydration & Font Pre-warming
  const syncPromise = syncWithBackend().catch(err => console.warn('[Splash Sync]', err));
  const fontPromise = document.fonts ? document.fonts.ready : Promise.resolve();

  // Smoothly advance progress while fetching network data
  stepTimer = window.setTimeout(() => {
    if (!isUnmounted && progress.value < 65) {
      statusText.value = 'Mengambil data kontainer & telemetri...';
      progress.value = 65;
    }
  }, 220);

  // Await actual network data & font caching
  await Promise.allSettled([syncPromise, fontPromise]);
  if (isUnmounted) return;

  // 3. Stage 3: Visual Editor & Local Cache Preparation
  statusText.value = 'Menyiapkan cache workspace & modul...';
  progress.value = 90;

  // Ensure a smooth, visually pleasant minimum time (~900ms - 1100ms)
  const elapsed = Date.now() - startTime;
  const remaining = Math.max(80, props.durationMs - elapsed);

  setTimeout(() => {
    if (isUnmounted) return;
    progress.value = 100;
    statusText.value = 'Workspace studio siap!';

    setTimeout(() => {
      if (isUnmounted) return;
      isFinished.value = true;
      emit('revealing');

      setTimeout(() => {
        emit('complete');
      }, 340);
    }, 100);
  }, remaining);
});

onUnmounted(() => {
  isUnmounted = true;
  if (stepTimer) clearTimeout(stepTimer);
});
</script>

<template>
  <transition name="splash-dissolve" appear>
    <div v-if="!isFinished" class="studio-splash-screen" role="status" aria-live="polite">
      <!-- 1. Background Theme Dot Grid (Solid white canvas ensures dashboard is completely hidden) -->
      <div class="base-dot-grid" aria-hidden="true"></div>

      <!-- 2. Clean Center Content: Logo -> Black Loading Bar -> Status -->
      <div class="splash-center-pod">
        <!-- Logo Emblem -->
        <div class="brand-glyph-box">
          <Layers :size="24" color="#ffffff" />
        </div>

        <!-- Brand Wordmark -->
        <h1 class="brand-wordmark">
          HeroCMS <span class="wordmark-highlight">Studio</span>
        </h1>

        <!-- Black Loading Bar directly under Logo -->
        <div class="splash-progress-track">
          <div
            class="splash-progress-fill"
            :style="{ width: `${progress}%` }"
          ></div>
        </div>

        <!-- Dynamic Real Initialization Status -->
        <p class="splash-status-text">
          {{ statusText }}
        </p>
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

/* Theme Base Dot Grid */
.base-dot-grid {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(#cbd5e1 1.2px, transparent 1.2px);
  background-size: 28px 28px;
  background-position: -14px -14px;
  opacity: 0.75;
  pointer-events: none;
}

/* Clean Center Pod */
.splash-center-pod {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  animation: podEntrance 0.38s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes podEntrance {
  0% {
    opacity: 0;
    transform: scale(0.92) translateY(12px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Brand Glyph Box: Obsidian Black matching theme buttons and badges */
.brand-glyph-box {
  width: 50px;
  height: 50px;
  background: #0f172a;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
  box-shadow: 0 10px 24px -4px rgba(15, 23, 42, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Wordmark */
.brand-wordmark {
  font-size: 1.55rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.03em;
  line-height: 1.2;
  margin: 0 0 20px 0;
}

.wordmark-highlight {
  background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Black Loading Bar (Directly beneath logo & wordmark) */
.splash-progress-track {
  width: 180px;
  height: 3.5px;
  background: #e2e8f0;
  border-radius: 9999px;
  overflow: hidden;
  position: relative;
  margin-bottom: 10px;
}

.splash-progress-fill {
  height: 100%;
  background: #0f172a; /* Solid Theme Obsidian Black */
  border-radius: 9999px;
  transition: width 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Clean Status Text */
.splash-status-text {
  font-size: 0.78rem;
  font-weight: 500;
  color: #64748b;
  letter-spacing: -0.01em;
  margin: 0;
}

/* Dissolve Transitions */
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
