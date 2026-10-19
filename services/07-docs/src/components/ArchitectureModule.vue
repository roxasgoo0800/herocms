<script setup lang="ts">
import { ref, computed } from 'vue';
import { Search, X, BookOpen, Check, Copy } from 'lucide-vue-next';
import { useDocsStore } from '../stores/docsStore';

const store = useDocsStore();
const searchQuery = ref('');
const copiedCmdIndex = ref<number | null>(null);

const filteredBlueprints = computed(() => {
  const q = searchQuery.value.toLowerCase().trim();
  if (!q) return store.blueprints;
  return store.blueprints.filter(b => 
    b.term.toLowerCase().includes(q) ||
    b.definition.toLowerCase().includes(q) ||
    b.category.toLowerCase().includes(q) ||
    b.fileReference.toLowerCase().includes(q) ||
    b.cliCommand.toLowerCase().includes(q)
  );
});

const copyCommand = (cmd: string, idx: number) => {
  navigator.clipboard.writeText(cmd);
  copiedCmdIndex.value = idx;
  setTimeout(() => {
    if (copiedCmdIndex.value === idx) copiedCmdIndex.value = null;
  }, 2000);
};
</script>

<template>
  <div class="architecture-module fade-in-section">
    <!-- Filter Toolbar -->
    <div class="filter-toolbar">
      <div class="search-command-shell" style="width: 420px;">
        <Search :size="15" class="search-lead-glyph" />
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Cari blueprint, kebutuhan alat, port, atau perintah CLI..."
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

    <!-- Blueprints Cards Grid -->
    <div class="site-cards-grid">
      <div 
        v-for="(item, idx) in filteredBlueprints" 
        :key="idx"
        class="pro-site-card"
        style="--card-accent: #059669;"
      >
        <!-- Head -->
        <div class="card-head">
          <div class="site-branding">
            <div class="site-icon-box" style="background: #ecfdf5; color: #059669; font-size: 1.25rem;">
              {{ item.icon }}
            </div>
            <div class="site-branding-info">
              <span class="nav-badge badge-success">{{ item.category }}</span>
              <h3 class="brand-title" style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 2px; line-height: 1.35; white-space: normal;">
                {{ item.term }}
              </h3>
            </div>
          </div>
        </div>

        <!-- Definition -->
        <p class="page-desc" style="font-size: 0.84rem; color: #475569; line-height: 1.5; margin: 0;">
          {{ item.definition }}
        </p>

        <!-- System Requirements Pills -->
        <div v-if="item.requirements && item.requirements.length > 0">
          <div style="font-size: 0.72rem; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 6px;">
            ⚙️ Kebutuhan Sistem & Port:
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 6px;">
            <span 
              v-for="(req, rIdx) in item.requirements" 
              :key="rIdx"
              class="nav-badge"
              style="font-family: 'JetBrains Mono', monospace; font-size: 0.72rem;"
            >
              {{ req }}
            </span>
          </div>
        </div>

        <!-- File Reference Box -->
        <div class="site-url-box" style="margin: 0;">
          <div class="url-text-wrap">
            <BookOpen :size="12" style="color: #059669; flex-shrink: 0;" />
            <span class="url-prefix">File Rujukan:</span>
            <span class="url-mono" style="font-size: 0.74rem;">{{ item.fileReference }}</span>
          </div>
        </div>

        <!-- Guide Steps List -->
        <div v-if="item.guideSteps && item.guideSteps.length > 0" class="pro-panel" style="padding: 12px 14px; background: #f8fafc; margin: 0;">
          <div style="font-size: 0.72rem; font-weight: 700; color: #475569; text-transform: uppercase; margin-bottom: 6px;">
            📋 Langkah Implementasi:
          </div>
          <ol style="margin: 0; padding-left: 18px; font-size: 0.8rem; color: #334155; line-height: 1.5;">
            <li v-for="(step, sIdx) in item.guideSteps" :key="sIdx" style="margin-bottom: 3px;">
              {{ step }}
            </li>
          </ol>
        </div>

        <!-- CLI Command Box with Copy Button -->
        <div v-if="item.cliCommand">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <span style="font-size: 0.72rem; font-weight: 700; color: #64748b; text-transform: uppercase;">
              💻 Perintah CLI Uji Cepat:
            </span>
            <button
              class="btn-url-action"
              style="padding: 2px 6px; font-size: 0.7rem; display: inline-flex; align-items: center; gap: 4px;"
              @click="copyCommand(item.cliCommand, idx)"
            >
              <Check v-if="copiedCmdIndex === idx" :size="11" color="#059669" />
              <Copy v-else :size="11" />
              <span>{{ copiedCmdIndex === idx ? 'Tersalin' : 'Salin' }}</span>
            </button>
          </div>
          <pre style="background: #0f172a; color: #38bdf8; font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; padding: 10px 12px; border-radius: 6px; overflow-x: auto; margin: 0; border-left: 3px solid #059669;"><code>{{ item.cliCommand }}</code></pre>
        </div>

        <!-- Do & Don't Strip -->
        <div v-if="item.doAndDont" style="font-size: 0.78rem; padding: 8px 12px; border-radius: 6px; background: #fffbeb; border: 1px solid #fde68a; color: #92400e; line-height: 1.45;">
          <strong>⚖️ Aturan & Larangan:</strong> {{ item.doAndDont }}
        </div>
      </div>
    </div>
  </div>
</template>
