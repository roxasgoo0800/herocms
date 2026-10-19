<script setup lang="ts">
import { ref, computed } from 'vue';
import { Search, X, ShieldCheck, ArrowRight, Lock, AlertTriangle, FileCode } from 'lucide-vue-next';
import { useDocsStore } from '../stores/docsStore';
import type { SecurityStandard } from '../types/docs';

const store = useDocsStore();
const searchQuery = ref('');
const selectedCategory = ref('Semua Pilar');

const categories = [
  'Semua Pilar',
  'sandboxing',
  'owasp',
  'database',
  'edge',
  'assets',
  'audit'
];

const categoryLabels: Record<string, string> = {
  'Semua Pilar': 'Semua Pilar Keamanan',
  'sandboxing': 'Sandboxing Kontainer',
  'owasp': 'OWASP Web Defense',
  'database': 'Database & RLS',
  'edge': 'Edge & Ingress Network',
  'assets': 'Aset Media & Anti-Malware',
  'audit': 'Audit & Kepatuhan'
};

const filteredStandards = computed(() => {
  const q = searchQuery.value.toLowerCase().trim();
  const cat = selectedCategory.value;

  return store.securityStandards.filter(s => {
    const matchCat = cat === 'Semua Pilar' || s.category === cat;
    if (!matchCat) return false;
    if (!q) return true;

    return (
      s.title.toLowerCase().includes(q) ||
      s.id.toLowerCase().includes(q) ||
      s.summary.toLowerCase().includes(q) ||
      s.threatVector.toLowerCase().includes(q) ||
      s.enforcement.toLowerCase().includes(q) ||
      s.codeFile.toLowerCase().includes(q)
    );
  });
});

const openSecurity = (sec: SecurityStandard) => {
  store.openSecurity(sec);
};
</script>

<template>
  <div class="security-matrix-module fade-in-section">
    <!-- Filter Toolbar -->
    <div class="filter-toolbar">
      <div class="search-command-shell" style="max-width: 440px; width: 100%;">
        <Search :size="15" class="search-lead-glyph" />
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Cari pilar keamanan, mitigasi OWASP, file kode..."
          class="search-command-input"
        />
        <button v-if="searchQuery" class="btn-clear-search" @click="searchQuery = ''" title="Bersihkan">
          <X :size="13" />
        </button>
        <kbd class="shortcut-tag">⌘K</kbd>
      </div>

      <div class="quota-quick-pills">
        <span class="pill-metric-highlight">
          <strong>{{ filteredStandards.length }} Standar Keamanan & Sandboxing</strong>
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
        <span>{{ categoryLabels[cat] || cat }}</span>
        <span v-if="cat === 'Semua Pilar'" class="chip-count">{{ store.securityStandards.length }}</span>
        <span v-else class="chip-count">{{ store.securityStandards.filter(s => s.category === cat).length }}</span>
      </button>
    </div>

    <!-- Empty State -->
    <div v-if="filteredStandards.length === 0" class="empty-state-card" style="padding: 48px 24px; text-align: center; background: #ffffff; border: 1px dashed #cbd5e1; border-radius: 14px;">
      <Lock :size="42" color="#94a3b8" style="margin-bottom: 12px;" />
      <h3 style="font-size: 1.05rem; font-weight: 700; color: #0f172a; margin-bottom: 4px;">Tidak Ada Standar Keamanan yang Cocok</h3>
      <p style="color: #64748b; font-size: 0.85rem; margin: 0;">Silakan bersihkan pencarian atau pilih kategori lain.</p>
    </div>

    <!-- Security Standards Grid -->
    <div v-else class="site-cards-grid">
      <div 
        v-for="sec in filteredStandards" 
        :key="sec.id"
        class="blueprint-card-pro"
        @click="openSecurity(sec)"
      >
        <!-- Head -->
        <div class="bp-head">
          <div class="bp-icon-box" style="background: #fef2f2; color: #ef4444; font-weight: 800; font-size: 0.85rem;">
            <ShieldCheck :size="20" color="#ef4444" />
          </div>
          <div class="bp-title-meta">
            <div class="bp-badges-row">
              <span class="task-id-chip">{{ sec.id }}</span>
              <span class="nav-badge badge-primary">{{ categoryLabels[sec.category] || sec.category }}</span>
              <span class="nav-badge badge-success">{{ sec.badge }}</span>
            </div>
            <h3 class="bp-title">
              {{ sec.title }}
            </h3>
          </div>
        </div>

        <!-- Summary -->
        <p class="bp-definition">
          {{ sec.summary }}
        </p>

        <!-- Threat Vector Strip -->
        <div class="bp-requirements-box" style="background: #fffbeb; border-color: #fde68a;">
          <div class="bp-requirements-label" style="display: flex; align-items: center; gap: 6px; color: #b45309;">
            <AlertTriangle :size="13" color="#b45309" />
            <span>Vektor Ancaman yang Dimigas:</span>
          </div>
          <p style="font-size: 0.78rem; color: #78350f; margin: 4px 0 0; line-height: 1.4;">
            {{ sec.threatVector }}
          </p>
        </div>

        <!-- Code File Reference Strip -->
        <div class="bp-file-strip">
          <FileCode :size="12" color="#059669" style="flex-shrink: 0;" />
          <span class="bp-file-text">
            {{ sec.codeFile }}
          </span>
        </div>

        <!-- Alur Verifikasi Preview Ribbon -->
        <div v-if="sec.verificationSteps && sec.verificationSteps.length > 0" class="bp-flow-preview">
          <span class="flow-preview-label">Alur Verifikasi:</span>
          <div class="flow-pills-row">
            <template v-for="(vStep, vIdx) in sec.verificationSteps.slice(0, 2)" :key="vIdx">
              <span class="flow-pill-mini" :title="vStep">{{ vStep.split(':')[0].trim() }}</span>
              <span v-if="vIdx === 0 && sec.verificationSteps.length > 1" class="flow-sep">→</span>
            </template>
            <span v-if="sec.verificationSteps.length > 2" class="flow-pill-more" :title="sec.verificationSteps.slice(2).join(' → ')">
              +{{ sec.verificationSteps.length - 2 }} langkah
            </span>
          </div>
        </div>

        <!-- Footer -->
        <div class="bp-card-footer">
          <span class="bp-status-badge">
            <Lock :size="13" />
            <span>{{ sec.checklist.length }} Poin Checklist</span>
          </span>
          <button class="btn-read-sop" @click.stop="openSecurity(sec)">
            <span>Baca SOP Keamanan</span>
            <ArrowRight :size="14" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
