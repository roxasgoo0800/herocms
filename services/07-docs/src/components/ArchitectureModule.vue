<script setup lang="ts">
import { ref, computed } from 'vue';
import { Search, X, BookOpen, ArrowRight, ShieldCheck } from 'lucide-vue-next';
import { useDocsStore } from '../stores/docsStore';
import type { ArchitectureBlueprint } from '../types/docs';

const store = useDocsStore();
const searchQuery = ref('');
const selectedCategory = ref('Semua Kategori');

const categories = computed(() => {
  const cats = Array.from(new Set(store.blueprints.map(b => b.category)));
  return ['Semua Kategori', ...cats];
});

const filteredBlueprints = computed(() => {
  const q = searchQuery.value.toLowerCase().trim();
  const cat = selectedCategory.value;

  return store.blueprints.filter(b => {
    const matchCat = cat === 'Semua Kategori' || b.category === cat;
    if (!matchCat) return false;
    if (!q) return true;
    return (
      b.term.toLowerCase().includes(q) ||
      b.id.toLowerCase().includes(q) ||
      b.definition.toLowerCase().includes(q) ||
      b.category.toLowerCase().includes(q) ||
      b.service.toLowerCase().includes(q) ||
      b.fileReference.toLowerCase().includes(q) ||
      b.cliCommand.toLowerCase().includes(q)
    );
  });
});

const openBlueprintReader = (bp: ArchitectureBlueprint) => {
  store.openBlueprint(bp);
};
</script>

<template>
  <div class="architecture-module fade-in-section">
    <!-- Filter Toolbar -->
    <div class="filter-toolbar">
      <div class="search-command-shell" style="max-width: 420px; width: 100%;">
        <Search :size="15" class="search-lead-glyph" />
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Cari blueprint, ID arsitektur, nama service, atau file rujukan..."
          class="search-command-input"
        />
        <button v-if="searchQuery" class="btn-clear-search" @click="searchQuery = ''" title="Bersihkan">
          <X :size="13" />
        </button>
        <kbd class="shortcut-tag">⌘K</kbd>
      </div>

      <div class="quota-quick-pills">
        <span class="pill-metric-highlight">
          <strong>{{ filteredBlueprints.length }} Blueprint Siap Pakai</strong>
        </span>
      </div>
    </div>

    <!-- Category Filter Chips -->
    <div class="category-filter-strip">
      <button 
        v-for="cat in categories" 
        :key="cat"
        class="category-chip"
        :class="{ active: selectedCategory === cat }"
        @click="selectedCategory = cat"
      >
        <span>{{ cat }}</span>
        <span v-if="cat === 'Semua Kategori'" class="chip-count">{{ store.blueprints.length }}</span>
        <span v-else class="chip-count">{{ store.blueprints.filter(b => b.category === cat).length }}</span>
      </button>
    </div>

    <!-- Empty State -->
    <div v-if="filteredBlueprints.length === 0" class="empty-state-card" style="padding: 48px 24px; text-align: center; background: #ffffff; border: 1px dashed #cbd5e1; border-radius: 14px;">
      <BookOpen :size="42" color="#94a3b8" style="margin-bottom: 12px;" />
      <h3 style="font-size: 1.05rem; font-weight: 700; color: #0f172a; margin-bottom: 4px;">Tidak Ada Blueprint yang Cocok</h3>
      <p style="color: #64748b; font-size: 0.85rem; margin: 0;">Silakan bersihkan pencarian atau pilih kategori lain.</p>
    </div>

    <!-- Blueprints Cards Grid (Pro Aligned & Clickable) -->
    <div v-else class="site-cards-grid">
      <div 
        v-for="item in filteredBlueprints" 
        :key="item.id"
        class="blueprint-card-pro"
        @click="openBlueprintReader(item)"
      >
        <!-- Head -->
        <div class="bp-head">
          <div class="bp-icon-box">
            {{ item.icon }}
          </div>
          <div class="bp-title-meta">
            <div class="bp-badges-row">
              <span class="task-id-chip">{{ item.id }}</span>
              <span class="nav-badge badge-primary" :title="item.service">{{ item.service.split('/')[0].trim() }}</span>
              <span class="nav-badge badge-success">{{ item.category }}</span>
            </div>
            <h3 class="bp-title">
              {{ item.term }}
            </h3>
          </div>
        </div>

        <!-- Definition -->
        <p class="bp-definition">
          {{ item.definition }}
        </p>

        <!-- System Requirements Preview -->
        <div v-if="item.requirements && item.requirements.length > 0" class="bp-requirements-box">
          <div class="bp-requirements-label">
            ⚙️ Kebutuhan Sistem:
          </div>
          <div class="bp-requirements-list">
            <span 
              v-for="(req, rIdx) in item.requirements.slice(0, 2)" 
              :key="rIdx"
              class="bp-req-pill"
              :title="req"
            >
              {{ req }}
            </span>
            <span v-if="item.requirements.length > 2" class="bp-req-more" :title="item.requirements.slice(2).join(', ')">
              +{{ item.requirements.length - 2 }} lainnya
            </span>
          </div>
        </div>

        <!-- File Reference Strip -->
        <div class="bp-file-strip" :title="item.fileReference">
          <BookOpen :size="12" color="#059669" style="flex-shrink: 0;" />
          <span class="bp-file-text">
            {{ item.fileReference }}
          </span>
        </div>

        <!-- Alur Kerja / Flowchart Preview Ribbon -->
        <div v-if="item.flowchart && item.flowchart.length > 0" class="bp-flow-preview">
          <span class="flow-preview-label">Alur Kerja:</span>
          <div class="flow-pills-row">
            <template v-for="(node, nIdx) in item.flowchart.slice(0, 2)" :key="nIdx">
              <span class="flow-pill-mini" :title="node">{{ node }}</span>
              <span v-if="nIdx === 0 && item.flowchart.length > 1" class="flow-sep">→</span>
            </template>
            <span v-if="item.flowchart.length > 2" class="flow-pill-more" :title="item.flowchart.slice(2).join(' → ')">
              +{{ item.flowchart.length - 2 }} tahap
            </span>
          </div>
        </div>

        <!-- Footer: Action Button -->
        <div class="bp-card-footer">
          <span class="bp-status-badge">
            <ShieldCheck :size="13" />
            <span>Terstandarisasi</span>
          </span>
          <button class="btn-read-sop" @click.stop="openBlueprintReader(item)">
            <span>Baca Arsitektur</span>
            <ArrowRight :size="14" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
