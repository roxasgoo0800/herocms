<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const canvasRef = ref<HTMLCanvasElement | null>(null);

let animationFrameId: number;
let mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000, isHovering: false };
let time = 0;

interface Dot {
  ox: number;
  oy: number;
  x: number;
  y: number;
}

let dots: Dot[] = [];
const SPACING = 28;
const INFLUENCE_RADIUS = 150;

const initDots = (width: number, height: number) => {
  dots = [];
  const cols = Math.ceil(width / SPACING) + 2;
  const rows = Math.ceil(height / SPACING) + 2;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const ox = c * SPACING - 14;
      const oy = r * SPACING - 14;
      dots.push({
        ox,
        oy,
        x: ox,
        y: oy
      });
    }
  }
};

const handleMouseMove = (e: MouseEvent) => {
  mouse.targetX = e.clientX;
  mouse.targetY = e.clientY;
  mouse.isHovering = true;
};

const handleMouseLeave = () => {
  mouse.isHovering = false;
  mouse.targetX = -1000;
  mouse.targetY = -1000;
};

const handleResize = () => {
  if (!canvasRef.value) return;
  const canvas = canvasRef.value;
  canvas.width = window.innerWidth * window.devicePixelRatio;
  canvas.height = window.innerHeight * window.devicePixelRatio;
  initDots(window.innerWidth, window.innerHeight);
};

const render = () => {
  if (!canvasRef.value) return;
  const canvas = canvasRef.value;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const dpr = window.devicePixelRatio || 1;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.scale(dpr, dpr);

  // Smooth lerp mouse coordinates
  const lerp = 0.15;
  mouse.x += (mouse.targetX - mouse.x) * lerp;
  mouse.y += (mouse.targetY - mouse.y) * lerp;

  time += 0.04;

  // Render ambient subtle spotlight under mouse
  if (mouse.isHovering || mouse.x > 0) {
    const ambientGrad = ctx.createRadialGradient(
      mouse.x, mouse.y, 10,
      mouse.x, mouse.y, 220
    );
    ambientGrad.addColorStop(0, 'rgba(37, 99, 235, 0.08)');
    ambientGrad.addColorStop(0.5, 'rgba(148, 163, 184, 0.04)');
    ambientGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = ambientGrad;
    ctx.beginPath();
    ctx.arc(mouse.x, mouse.y, 220, 0, Math.PI * 2);
    ctx.fill();
  }

  // Draw interactive dot matrix with wave physics
  for (let i = 0; i < dots.length; i++) {
    const dot = dots[i];
    const dx = dot.ox - mouse.x;
    const dy = dot.oy - mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    let curX = dot.ox;
    let curY = dot.oy;
    let radius = 1.3;
    let color = 'rgba(203, 213, 225, 0.75)'; // Slate 300 base dot

    if (dist < INFLUENCE_RADIUS && dist > 0) {
      const factor = (1 - dist / INFLUENCE_RADIUS);
      // Sinusoidal ripple wave displacement
      const wave = Math.sin(dist * 0.08 - time * 3.5) * factor * 9;
      
      curX = dot.ox + (dx / dist) * wave;
      curY = dot.oy + (dy / dist) * wave;

      // Expand dot and shift color to vibrant brand blue based on proximity
      radius = 1.3 + factor * 2.2;
      const alpha = 0.6 + factor * 0.4;
      color = `rgba(37, 99, 235, ${alpha})`;
    }

    ctx.beginPath();
    ctx.arc(curX, curY, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }

  ctx.restore();
  animationFrameId = requestAnimationFrame(render);
};

onMounted(() => {
  handleResize();
  window.addEventListener('resize', handleResize);
  window.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseleave', handleMouseLeave);
  animationFrameId = requestAnimationFrame(render);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseleave', handleMouseLeave);
  cancelAnimationFrame(animationFrameId);
});
</script>

<template>
  <canvas
    ref="canvasRef"
    class="interactive-dot-wave-canvas"
    aria-hidden="true"
  ></canvas>
</template>

<style scoped>
.interactive-dot-wave-canvas {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 0;
  background-color: #f8fafc;
}
</style>
