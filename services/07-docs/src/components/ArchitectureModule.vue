<template>
  <div class="architecture-module">
    <!-- Header Summary -->
    <div style="background: linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%); border: 1px solid #dbeafe; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.75rem;">
      <h2 style="margin: 0 0 0.4rem 0; font-size: 1.25rem; font-weight: 800; color: #1e3a8a;">
        📖 Blueprint & Panduan Operasional Arsitektur HeroCMS
      </h2>
      <p style="margin: 0; font-size: 0.9rem; color: #475569; line-height: 1.5;">
        Bukan sekadar kamus tulisan pasif — Setiap komponen sistem dilengkapi kebutuhan alat, port, lokasi file kode rujukan, langkah eksekusi step-by-step, perintah CLI verifikasi cepat, dan aturan wajib / larangan.
      </p>
    </div>

    <!-- Blueprint Search -->
    <div style="margin-bottom: 1.5rem; max-width: 480px;">
      <input 
        v-model="searchQuery"
        type="text" 
        placeholder="Cari blueprint, kebutuhan alat, port, atau perintah CLI..."
        style="width: 100%; padding: 0.65rem 1rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.88rem; outline: none; background: #ffffff;"
      />
    </div>

    <!-- Blueprints Grid -->
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 1.25rem;">
      <div 
        v-for="(item, idx) in filteredBlueprints" 
        :key="idx"
        class="blueprint-card"
        style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.4rem; display: flex; flex-direction: column; gap: 0.9rem; box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04); transition: all 0.2s;"
      >
        <!-- Head -->
        <div style="display: flex; align-items: flex-start; gap: 0.75rem;">
          <div style="width: 42px; height: 42px; border-radius: 8px; background: #eff6ff; display: flex; align-items: center; justify-content: center; font-size: 1.35rem; border: 1px solid #dbeafe; flex-shrink: 0;">
            {{ item.icon }}
          </div>
          <div style="flex: 1;">
            <h3 style="margin: 0; font-size: 1.05rem; font-weight: 700; color: #0f172a; line-height: 1.35;">
              {{ item.term }}
            </h3>
            <span style="display: inline-block; background: #eff6ff; color: #2563eb; font-size: 0.72rem; font-weight: 600; padding: 0.15rem 0.5rem; border-radius: 4px; margin-top: 0.25rem;">
              {{ item.category }}
            </span>
          </div>
        </div>

        <!-- Definition -->
        <p style="margin: 0; color: #475569; font-size: 0.88rem; line-height: 1.5;">
          {{ item.definition }}
        </p>

        <!-- Requirements -->
        <div v-if="item.requirements && item.requirements.length > 0">
          <div style="font-size: 0.73rem; font-weight: 700; color: #475569; text-transform: uppercase; margin-bottom: 0.35rem;">
            ⚙️ Kebutuhan Sistem & Dependensi:
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 0.35rem;">
            <span 
              v-for="(req, rIdx) in item.requirements" 
              :key="rIdx"
              style="background: #f1f5f9; color: #334155; font-size: 0.72rem; font-family: 'JetBrains Mono', monospace; padding: 0.15rem 0.5rem; border-radius: 5px; border: 1px solid #e2e8f0; font-weight: 500;"
            >
              {{ req }}
            </span>
          </div>
        </div>

        <!-- File Reference -->
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 0.65rem 0.85rem; font-size: 0.8rem;">
          <div style="font-size: 0.72rem; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 0.25rem;">
            📁 File Rujukan di Repositori:
          </div>
          <code style="font-family: 'JetBrains Mono', monospace; color: #0f172a; font-size: 0.78rem; word-break: break-all;">
            {{ item.fileReference }}
          </code>
        </div>

        <!-- Guide Steps -->
        <div v-if="item.guideSteps && item.guideSteps.length > 0">
          <div style="font-size: 0.73rem; font-weight: 700; color: #475569; text-transform: uppercase; margin-bottom: 0.35rem;">
            📋 Panduan Implementasi Lapangan:
          </div>
          <ol style="margin: 0 0 0 1.1rem; padding: 0; font-size: 0.82rem; color: #334155; line-height: 1.5;">
            <li v-for="(step, sIdx) in item.guideSteps" :key="sIdx" style="margin-bottom: 0.25rem;">
              {{ step }}
            </li>
          </ol>
        </div>

        <!-- CLI Command -->
        <div v-if="item.cliCommand">
          <div style="font-size: 0.73rem; font-weight: 700; color: #475569; text-transform: uppercase; margin-bottom: 0.25rem;">
            💻 Perintah CLI Uji Cepat:
          </div>
          <div style="background: #0f172a; color: #38bdf8; font-family: 'JetBrains Mono', monospace; font-size: 0.76rem; padding: 0.55rem 0.85rem; border-radius: 6px; overflow-x: auto; border-left: 3px solid #2563eb;">
            {{ item.cliCommand }}
          </div>
        </div>

        <!-- Do & Don't -->
        <div v-if="item.doAndDont" style="font-size: 0.78rem; padding: 0.5rem 0.75rem; border-radius: 6px; background: #fffbeb; border: 1px solid #fde68a; color: #92400e; line-height: 1.45;">
          <strong>⚖️ Aturan Wajib & Larangan:</strong> {{ item.doAndDont }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useDocsStore } from '../stores/docsStore';

const store = useDocsStore();
const searchQuery = ref('');

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
</script>

<style scoped>
.blueprint-card:hover {
  border-color: #93c5fd !important;
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.08) !important;
  transform: translateY(-2px);
}
</style>
