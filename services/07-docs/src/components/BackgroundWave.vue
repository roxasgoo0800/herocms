<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const mousePos = ref({ x: -1000, y: -1000 });
const isVisible = ref(false);

const animPos = { x: -1000, y: -1000 };
const targetPos = { x: -1000, y: -1000 };
let requestRef: number | null = null;

const onMouseMove = (e: MouseEvent) => {
  targetPos.x = e.clientX;
  targetPos.y = e.clientY;
  if (!isVisible.value) isVisible.value = true;
};

const onMouseLeave = () => {
  isVisible.value = false;
};

const animate = () => {
  const ease = 0.1;
  animPos.x += (targetPos.x - animPos.x) * ease;
  animPos.y += (targetPos.y - animPos.y) * ease;

  mousePos.value = {
    x: Math.round(animPos.x),
    y: Math.round(animPos.y)
  };

  requestRef = requestAnimationFrame(animate);
};

onMounted(() => {
  window.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseleave', onMouseLeave);
  requestRef = requestAnimationFrame(animate);
});

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseleave', onMouseLeave);
  if (requestRef) cancelAnimationFrame(requestRef);
});
</script>

<template>
  <div class="background-wave-container" aria-hidden="true">
    <!-- 1. Base Subtle Dot Grid -->
    <div class="base-dot-grid"></div>

    <!-- 2. Seamless Soft Gaussian Slate Ambient Glow (NO borders, NO rings, completely feathered) -->
    <div
      class="ambient-glow"
      :style="{
        top: `${mousePos.y - 300}px`,
        left: `${mousePos.x - 300}px`,
        opacity: isVisible ? 1 : 0
      }"
    ></div>

    <!-- 3. Smooth Contrast Dots: Feathered cleanly with NO sharp concentric lines -->
    <div
      class="contrast-dots"
      :style="{
        maskImage: `radial-gradient(circle 320px at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 75%)`,
        WebkitMaskImage: `radial-gradient(circle 320px at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 75%)`,
        opacity: isVisible ? 0.9 : 0
      }"
    ></div>
  </div>
</template>
