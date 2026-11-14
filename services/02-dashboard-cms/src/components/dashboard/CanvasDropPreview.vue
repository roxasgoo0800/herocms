<script setup lang="ts">
import { computed } from 'vue';
import { Layers } from 'lucide-vue-next';
import { blockCatalogItems, createLibraryBlock } from '../../data/editor-presets';
import type { VisualBlock } from '../../types/dashboard';
import CanvasBlockRenderer from './CanvasBlockRenderer.vue';

const props = withDefaults(
  defineProps<{
    blockType: string;
    accentColor?: string;
  }>(),
  {
    accentColor: '#2563eb'
  }
);

const catalogItem = computed(() => {
  return blockCatalogItems.find((item) => item.type === props.blockType) || null;
});

const previewBlock = computed<VisualBlock>(() => {
  return createLibraryBlock((props.blockType || 'hero') as VisualBlock['type']);
});
</script>

<template>
  <div class="drop-target-indicator" role="presentation" aria-hidden="true">
    <!-- Subtle Neutral Drop Target Header -->
    <div class="drop-target-header">
      <div class="drop-target-badge">
        <Layers :size="12" class="drop-target-icon" />
        <span class="drop-target-label">Posisi Penempatan:</span>
        <strong class="drop-target-name">{{ catalogItem?.name || blockType }}</strong>
      </div>
      <div class="drop-target-hint">
        <span class="drop-target-dot"></span>
        <span>Lepas untuk menempatkan komponen di sini</span>
      </div>
    </div>

    <!-- Authentic Component Preview (Single Source Renderer, Full Color) -->
    <div class="drop-target-component-stage">
      <CanvasBlockRenderer
        :block="previewBlock"
        :accent-color="accentColor"
        :preview-mode="true"
      />
    </div>
  </div>
</template>

<style scoped>
/* 1. DROP TARGET INDICATOR: Soft neutral slate outline & background */
.drop-target-indicator {
  position: relative;
  width: 100%;
  border: 1.5px dashed #94a3b8;
  border-radius: 12px;
  background: rgba(248, 250, 252, 0.94);
  box-shadow: 0 2px 12px rgba(15, 23, 42, 0.06);
  padding: 10px 12px 12px 12px;
  box-sizing: border-box;
  overflow: hidden;
  pointer-events: none;
  user-select: none;
}

.drop-target-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px dashed #cbd5e1;
}

.drop-target-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #ffffff;
  color: #334155;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 600;
  border: 1px solid #cbd5e1;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
}

.drop-target-icon {
  color: #64748b;
}

.drop-target-label {
  color: #64748b;
  font-size: 0.68rem;
  font-weight: 600;
}

.drop-target-name {
  color: #0f172a;
  font-weight: 700;
}

.drop-target-hint {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.7rem;
  font-weight: 500;
  color: #475569;
  background: #ffffff;
  padding: 3px 9px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.drop-target-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #64748b;
}

/* 2. COMPONENT STAGE: Pure authentic canvas appearance */
.drop-target-component-stage {
  position: relative;
  width: 100%;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(15, 23, 42, 0.04);
}
</style>
