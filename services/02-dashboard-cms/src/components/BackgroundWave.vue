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

<style scoped>
.background-wave-container {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
  background: #ffffff;
}

.base-dot-grid {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(#cbd5e1 1.2px, transparent 1.2px);
  background-size: 28px 28px;
  background-position: -14px -14px;
  opacity: 0.75;
}

.ambient-glow {
  position: absolute;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(148, 163, 184, 0.18) 0%, rgba(203, 213, 225, 0.08) 50%, transparent 70%);
  filter: blur(40px);
  transition: opacity 0.4s ease;
  will-change: transform, opacity;
}

.contrast-dots {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(#475569 1.5px, transparent 1.5px);
  background-size: 28px 28px;
  background-position: -14px -14px;
  transition: opacity 0.4s ease;
  will-change: mask-image, -webkit-mask-image;
}
</style>
