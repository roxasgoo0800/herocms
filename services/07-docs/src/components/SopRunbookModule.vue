<script setup lang="ts">
import { ref, computed } from 'vue';
import { Search, X, Terminal, CheckCircle2, XCircle, ArrowRight, User } from 'lucide-vue-next';
import { useDocsStore } from '../stores/docsStore';
import type { EnterpriseSop } from '../types/docs';

const store = useDocsStore();
const searchQuery = ref('');
const selectedCategory = ref('Semua Kategori');

const categories = computed(() => {
  const cats = Array.from(new Set(store.sops.map(s => s.category)));
  return ['Semua Kategori', ...cats];
});

const filteredSops = computed(() => {
  const q = searchQuery.value.toLowerCase().trim();
  const cat = selectedCategory.value;

  return store.sops.filter(s => {
    const matchCat = cat === 'Semua Kategori' || s.category === cat;
    if (!matchCat) return false;
    if (!q) return true;
    return (
      s.title.toLowerCase().includes(q) ||
      s.id.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.pic.toLowerCase().includes(q) ||
      s.purpose.toLowerCase().includes(q)
    );
  });
});

const openSopReader = (sop: EnterpriseSop) => {
  store.openSop(sop);
};
</script>

<template>
  <div class="sop-runbook-module fade-in-section">
    <!-- Filter Toolbar -->
    <div class="filter-toolbar">
      <div class="search-command-shell" style="max-width: 420px; width: 100%;">
        <Search :size="15" class="search-lead-glyph" />
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Cari SOP, nomor ID, alur git, atau nama PIC..."
          class="search-command-input"
        />
        <button v-if="searchQuery" class="btn-clear-search" @click="searchQuery = ''" title="Bersihkan">
          <X :size="13" />
        </button>
        <kbd class="shortcut-tag">⌘K</kbd>
      </div>

      <div class="quota-quick-pills">
        <span class="pill-metric-highlight">
          <strong>{{ filteredSops.length }} SOP Terdaftar</strong>
        </span>
      </div>
    </div>

    <!-- Category Filter Chips (Dynamically Synced with Dataset) -->
    <div class="category-filter-strip">
      <button 
        v-for="cat in categories" 
        :key="cat"
        class="category-chip"
        :class="{ active: selectedCategory === cat }"
        @click="selectedCategory = cat"
      >
        <span>{{ cat }}</span>
        <span v-if="cat === 'Semua Kategori'" class="chip-count">{{ store.sops.length }}</span>
        <span v-else class="chip-count">{{ store.sops.filter(s => s.category === cat).length }}</span>
      </button>
    </div>

    <!-- Empty State if Search Fails -->
    <div v-if="filteredSops.length === 0" class="empty-state-card" style="padding: 48px 24px; text-align: center; background: #ffffff; border: 1px dashed #cbd5e1; border-radius: 14px;">
      <Terminal :size="42" color="#94a3b8" style="margin-bottom: 12px;" />
      <h3 style="font-size: 1.05rem; font-weight: 700; color: #0f172a; margin-bottom: 4px;">Tidak Ada SOP yang Cocok</h3>
      <p style="color: #64748b; font-size: 0.85rem; margin: 0;">Silakan bersihkan kata kunci atau pilih tab "Semua Kategori".</p>
    </div>

    <!-- SOP Cards Grid (Clean, Aligned & Pro Layout) -->
    <div v-else class="site-cards-grid">
      <div 
        v-for="sop in filteredSops" 
        :key="sop.id"
        class="sop-card-pro"
        @click="openSopReader(sop)"
      >
        <!-- Top Metadata Row -->
        <div class="card-top-header">
          <div class="sop-badges-left">
            <span class="sop-id-chip">{{ sop.id }}</span>
            <span class="nav-badge badge-primary">{{ sop.category }}</span>
          </div>
          <span class="nav-badge badge-warning">{{ sop.badge }}</span>
        </div>

        <!-- Title & Purpose -->
        <div>
          <h3 class="sop-title">{{ sop.title }}</h3>
          <p class="sop-purpose" style="margin-top: 6px;">{{ sop.purpose }}</p>
        </div>

        <!-- Flowchart Preview Mini Ribbon -->
        <div v-if="sop.flowchart && sop.flowchart.length > 0" class="sop-flow-preview">
          <span class="flow-preview-label">Alur:</span>
          <div class="flow-pills-row">
            <template v-for="(node, nIdx) in sop.flowchart.slice(0, 2)" :key="nIdx">
              <span class="flow-pill-mini" :title="node">{{ node }}</span>
              <span v-if="nIdx === 0 && sop.flowchart.length > 1" class="flow-sep">→</span>
            </template>
            <span v-if="sop.flowchart.length > 2" class="flow-pill-more" :title="sop.flowchart.slice(2).join(' → ')">
              +{{ sop.flowchart.length - 2 }} tahap
            </span>
          </div>
        </div>

        <!-- Do's and Don'ts Summary Indicator -->
        <div style="display: flex; align-items: center; gap: 12px; font-size: 0.74rem; flex-wrap: wrap;">
          <span style="display: inline-flex; align-items: center; gap: 4px; color: #059669; font-weight: 700;">
            <CheckCircle2 :size="13" />
            <span>{{ sop.dos.length }} Do's</span>
          </span>
          <span style="display: inline-flex; align-items: center; gap: 4px; color: #dc2626; font-weight: 700;">
            <XCircle :size="13" />
            <span>{{ sop.donts.length }} Don'ts</span>
          </span>
        </div>

        <!-- Bottom Footer: PIC & Open Action Button -->
        <div class="sop-card-footer">
          <div class="sop-pic-info">
            <User :size="13" color="#64748b" />
            <span>PIC: <strong style="color: #0f172a;">{{ sop.pic }}</strong></span>
          </div>
          <button class="btn-read-sop" @click.stop="openSopReader(sop)">
            <span>Baca SOP</span>
            <ArrowRight :size="14" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
