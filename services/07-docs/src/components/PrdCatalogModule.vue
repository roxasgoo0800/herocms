<script setup lang="ts">
import { ref, computed } from 'vue';
import { Search, X, FileText, ArrowRight, ShieldCheck, Layers, Cpu } from 'lucide-vue-next';
import { useDocsStore } from '../stores/docsStore';
import type { MicroservicePrd } from '../types/docs';

const store = useDocsStore();
const searchQuery = ref('');
const selectedFilter = ref('Semua Layanan');

const filters = [
  'Semua Layanan',
  'Frontend & Studio',
  'Backend & Engine',
  'AI & Mobile',
  'Mission Control'
];

const filteredPrds = computed(() => {
  const q = searchQuery.value.toLowerCase().trim();
  const f = selectedFilter.value;

  return store.prds.filter(p => {
    let matchFilter = true;
    if (f === 'Frontend & Studio') {
      matchFilter = p.serviceId === '02-dashboard-cms' || p.serviceId === '04-marketing-site';
    } else if (f === 'Backend & Engine') {
      matchFilter = p.serviceId === '01-admin-console' || p.serviceId === '03-provision-orchestrator';
    } else if (f === 'AI & Mobile') {
      matchFilter = p.serviceId === '05-ai-agent-service' || p.serviceId === '06-mobile-companion';
    } else if (f === 'Mission Control') {
      matchFilter = p.serviceId === '07-docs';
    }

    if (!matchFilter) return false;
    if (!q) return true;

    return (
      p.title.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      p.serviceId.toLowerCase().includes(q) ||
      p.summary.toLowerCase().includes(q) ||
      p.techStack.framework.toLowerCase().includes(q) ||
      p.techStack.language.toLowerCase().includes(q)
    );
  });
});

const openPrd = (prd: MicroservicePrd) => {
  store.openPrd(prd);
};
</script>

<template>
  <div class="prd-catalog-module fade-in-section">
    <!-- Filter Toolbar -->
    <div class="filter-toolbar">
      <div class="search-command-shell" style="max-width: 440px; width: 100%;">
        <Search :size="15" class="search-lead-glyph" />
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Cari PRD, nama microservice, stack teknologi..."
          class="search-command-input"
        />
        <button v-if="searchQuery" class="btn-clear-search" @click="searchQuery = ''" title="Bersihkan">
          <X :size="13" />
        </button>
        <kbd class="shortcut-tag">⌘K</kbd>
      </div>

      <div class="quota-quick-pills">
        <span class="pill-metric-highlight">
          <strong>{{ filteredPrds.length }} Spesifikasi PRD Siap Pakai</strong>
        </span>
      </div>
    </div>

    <!-- Category Filter Chips -->
    <div class="category-filter-strip">
      <button 
        v-for="cat in filters" 
        :key="cat"
        class="category-chip"
        :class="{ active: selectedFilter === cat }"
        @click="selectedFilter = cat"
      >
        <span>{{ cat }}</span>
        <span v-if="cat === 'Semua Layanan'" class="chip-count">{{ store.prds.length }}</span>
      </button>
    </div>

    <!-- Empty State -->
    <div v-if="filteredPrds.length === 0" class="empty-state-card" style="padding: 48px 24px; text-align: center; background: #ffffff; border: 1px dashed #cbd5e1; border-radius: 14px;">
      <FileText :size="42" color="#94a3b8" style="margin-bottom: 12px;" />
      <h3 style="font-size: 1.05rem; font-weight: 700; color: #0f172a; margin-bottom: 4px;">Tidak Ada PRD yang Cocok</h3>
      <p style="color: #64748b; font-size: 0.85rem; margin: 0;">Silakan bersihkan pencarian atau pilih kategori filter lain.</p>
    </div>

    <!-- PRD Cards Grid -->
    <div v-else class="site-cards-grid">
      <div 
        v-for="prd in filteredPrds" 
        :key="prd.id"
        class="blueprint-card-pro"
        @click="openPrd(prd)"
      >
        <!-- Head -->
        <div class="bp-head">
          <div class="bp-icon-box" style="background: #eff6ff; color: #2563eb; font-weight: 800; font-size: 0.85rem;">
            {{ prd.id.replace('PRD-', '') }}
          </div>
          <div class="bp-title-meta">
            <div class="bp-badges-row">
              <span class="task-id-chip">{{ prd.id }}</span>
              <span class="nav-badge badge-primary">{{ prd.serviceId }}</span>
              <span class="nav-badge badge-success">{{ prd.badge }}</span>
            </div>
            <h3 class="bp-title">
              {{ prd.title }}
            </h3>
          </div>
        </div>

        <!-- Summary -->
        <p class="bp-definition">
          {{ prd.summary }}
        </p>

        <!-- Tech Stack Pills -->
        <div class="bp-requirements-box">
          <div class="bp-requirements-label" style="display: flex; align-items: center; gap: 6px;">
            <Cpu :size="13" color="#2563eb" />
            <span>Teknologi & Runtime:</span>
          </div>
          <div class="bp-requirements-list">
            <span class="bp-req-pill">{{ prd.techStack.framework }}</span>
            <span class="bp-req-pill">{{ prd.techStack.language }}</span>
            <span class="bp-req-pill" v-if="prd.techStack.databases[0]">{{ prd.techStack.databases[0].split(' ')[0] }}</span>
          </div>
        </div>

        <!-- Modules Count & Target Audience -->
        <div class="bp-file-strip">
          <Layers :size="12" color="#059669" style="flex-shrink: 0;" />
          <span class="bp-file-text">
            {{ prd.coreModules.length }} Modul Inti • Target: {{ prd.targetAudience[0] }}
          </span>
        </div>

        <!-- Alur Modul Layanan Ribbon -->
        <div class="bp-flow-preview">
          <span class="flow-preview-label">Alur Modul:</span>
          <div class="flow-pills-row">
            <template v-for="(mod, mIdx) in prd.coreModules.slice(0, 2)" :key="mIdx">
              <span class="flow-pill-mini" :title="mod.name">{{ mod.name.split('(')[0].trim() }}</span>
              <span v-if="mIdx === 0 && prd.coreModules.length > 1" class="flow-sep">→</span>
            </template>
            <span v-if="prd.coreModules.length > 2" class="flow-pill-more" :title="prd.coreModules.slice(2).map(m => m.name).join(' → ')">
              +{{ prd.coreModules.length - 2 }} modul
            </span>
          </div>
        </div>

        <!-- Footer -->
        <div class="bp-card-footer">
          <span class="bp-status-badge">
            <ShieldCheck :size="13" />
            <span>{{ prd.version }}</span>
          </span>
          <button class="btn-read-sop" @click.stop="openPrd(prd)">
            <span>Baca PRD Lengkap</span>
            <ArrowRight :size="14" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
