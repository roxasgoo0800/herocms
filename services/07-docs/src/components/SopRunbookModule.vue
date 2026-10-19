<script setup lang="ts">
import { ref, computed } from 'vue';
import { Search, X, Terminal, CheckCircle2 } from 'lucide-vue-next';
import { useDocsStore } from '../stores/docsStore';

const store = useDocsStore();
const searchQuery = ref('');
const selectedCategory = ref('Semua Kategori');

const categories = [
  'Semua Kategori',
  'Git & Collaboration',
  'Workflow & Checklist',
  'Microservices Compliance',
  'Database & Migration',
  'Security & Pentest',
  'Orchestrator & Docker',
  'API Contract & OpenAPI',
  'Incident & Rollback',
  'Performance & Vitals'
];

const filteredSops = computed(() => {
  const q = searchQuery.value.toLowerCase().trim();
  const cat = selectedCategory.value;

  return store.sops.filter(s => {
    const matchCat = cat === 'Semua Kategori' || s.category.toLowerCase().includes(cat.toLowerCase().replace('&', '').trim());
    if (!matchCat) return false;
    if (!q) return true;
    return (
      s.title.toLowerCase().includes(q) ||
      s.id.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.pic.toLowerCase().includes(q)
    );
  });
});
</script>

<template>
  <div class="sop-runbook-module fade-in-section">
    <!-- Filter Toolbar -->
    <div class="filter-toolbar">
      <div class="search-command-shell" style="width: 420px;">
        <Search :size="15" class="search-lead-glyph" />
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Cari SOP, nomor ID, topik git, atau nama personil..."
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

    <!-- Category Filter Pills -->
    <div class="segmented-filter-bar" style="margin-bottom: 24px; flex-wrap: wrap;">
      <button 
        v-for="cat in categories" 
        :key="cat"
        class="segment-pill"
        :class="{ active: selectedCategory === cat }"
        @click="selectedCategory = cat"
      >
        <span>{{ cat }}</span>
      </button>
    </div>

    <!-- SOP Cards Grid -->
    <div class="site-cards-grid">
      <div 
        v-for="sop in filteredSops" 
        :key="sop.id"
        class="pro-site-card"
        style="--card-accent: #2563eb;"
      >
        <!-- Head -->
        <div class="card-head">
          <div class="site-branding">
            <div class="site-icon-box" style="background: #eff6ff; color: #2563eb;">
              <Terminal :size="20" />
            </div>
            <div class="site-branding-info">
              <div style="display: flex; align-items: center; gap: 6px;">
                <span class="nav-badge" style="font-family: 'JetBrains Mono', monospace;">{{ sop.id }}</span>
                <span class="nav-badge badge-primary">{{ sop.badge }}</span>
              </div>
              <h3 class="brand-title" style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 2px; line-height: 1.35; white-space: normal;">
                {{ sop.title }}
              </h3>
            </div>
          </div>
        </div>

        <!-- PIC & Category Strip -->
        <div class="card-momentum-strip" style="cursor: default; padding: 8px 12px;">
          <div class="momentum-left-meta">
            <span style="font-size: 0.74rem; color: #64748b;">
              Kategori: <strong>{{ sop.category }}</strong>
            </span>
            <div style="font-size: 0.74rem; color: #2563eb; margin-top: 2px;">
              Penanggung Jawab: <strong>{{ sop.pic }}</strong>
            </div>
          </div>
        </div>

        <!-- Numbered Implementation Steps -->
        <div class="pro-panel" style="padding: 12px 14px; background: #f8fafc; margin: 0;">
          <div style="font-size: 0.72rem; font-weight: 700; color: #475569; text-transform: uppercase; margin-bottom: 8px;">
            📋 Langkah Prosedur Kerja:
          </div>
          <ol style="margin: 0; padding-left: 20px; font-size: 0.82rem; color: #334155; line-height: 1.55;">
            <li v-for="(step, sIdx) in sop.steps" :key="sIdx" style="margin-bottom: 4px;">
              {{ step }}
            </li>
          </ol>
        </div>

        <!-- Bottom Status -->
        <div style="display: flex; justify-content: space-between; align-items: center; pt: 8px; border-top: 1px solid #f1f5f9;">
          <span style="font-size: 0.74rem; color: #059669; font-weight: 700; display: inline-flex; align-items: center; gap: 4px;">
            <CheckCircle2 :size="13" />
            <span>Standar Aktif Seluruh Tim</span>
          </span>
          <span class="nav-badge">Wajib Dipatuhi</span>
        </div>
      </div>
    </div>
  </div>
</template>
