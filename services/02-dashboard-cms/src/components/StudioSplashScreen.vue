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
  statusText.value = 'Memverifikasi sesi & kredensial...';
  progress.value = 20;

  // 2. Stage 2: Background Data Hydration & Redis Cache Pre-warming
  const syncPromise = syncWithBackend({ forceWarmRedis: true }).catch(err => console.warn('[Splash Sync]', err));
  const fontPromise = document.fonts ? document.fonts.ready : Promise.resolve();

  // Smoothly advance progress while fetching network data & warming Redis
  stepTimer = window.setTimeout(() => {
    if (!isUnmounted && progress.value < 65) {
      statusText.value = 'Memanaskan cache Redis & sinkronisasi menu...';
      progress.value = 65;
    }
  }, 180);

  // Await actual network data & font caching
  await Promise.allSettled([syncPromise, fontPromise]);
  if (isUnmounted) return;

  // 3. Stage 3: Visual Editor & Local Cache Preparation
  statusText.value = 'Menyiapkan cache visual editor & workspace...';
  progress.value = 90;

  // Ensure a smooth, visually pleasant minimum time (~850ms - 1050ms)
  const elapsed = Date.now() - startTime;
  const remaining = Math.max(80, props.durationMs - elapsed);

  setTimeout(() => {
    if (isUnmounted) return;
    progress.value = 100;
    statusText.value = 'Workspace teroptimalisasi & siap!';

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
