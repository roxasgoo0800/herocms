<template>
  <div class="sop-runbook-module">
    <!-- Header Summary -->
    <div style="background: linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%); border: 1px solid #dbeafe; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.75rem;">
      <h2 style="margin: 0 0 0.4rem 0; font-size: 1.25rem; font-weight: 800; color: #1e3a8a;">
        🛡️ Standar Operasional Prosedur (SOP) Industri & Lifecycle Runbook
      </h2>
      <p style="margin: 0; font-size: 0.9rem; color: #475569; line-height: 1.5;">
        Panduan resmi pengerjaan teknis, alur git branching, pesan commit standar industri, siklus kerja dari awal sampai akhir, cara mengklaim dan menandai checklist, serta batas kepatuhan mutlak pada 6 microservices.
      </p>
    </div>

    <!-- Category Filters & Search -->
    <div style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.75rem;">
      <div style="max-width: 480px;">
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Cari SOP, nomor ID, topik git, atau nama personil..."
          style="width: 100%; padding: 0.65rem 1rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.88rem; outline: none; background: #ffffff;"
        />
      </div>

      <div style="display: flex; flex-wrap: wrap; gap: 0.45rem;">
        <button 
          v-for="cat in categories" 
          :key="cat"
          :style="selectedCategory === cat ? activeCatStyle : inactiveCatStyle"
          @click="selectedCategory = cat"
        >
          {{ cat }}
        </button>
      </div>
    </div>

    <!-- SOP Cards Grid -->
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(420px, 1fr)); gap: 1.25rem;">
      <div 
        v-for="sop in filteredSops" 
        :key="sop.id"
        class="sop-card"
        style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.4rem; display: flex; flex-direction: column; gap: 0.85rem; box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04); transition: all 0.2s;"
      >
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="background: #eff6ff; color: #2563eb; font-weight: 700; font-size: 0.78rem; padding: 0.2rem 0.6rem; border-radius: 6px; font-family: 'JetBrains Mono', monospace; border: 1px solid #bfdbfe;">
              {{ sop.id }}
            </span>
            <span style="background: #f1f5f9; color: #475569; font-size: 0.72rem; font-weight: 600; padding: 0.15rem 0.5rem; border-radius: 5px;">
              {{ sop.category }}
            </span>
          </div>
          <span 
            style="font-size: 0.72rem; font-weight: 700; padding: 0.2rem 0.6rem; border-radius: 6px;"
            :style="{
              background: sop.badge === 'Security Gate' || sop.badge === 'Quality Gate' ? '#eff6ff' : '#ecfdf5',
              color: sop.badge === 'Security Gate' || sop.badge === 'Quality Gate' ? '#2563eb' : '#059669',
              border: sop.badge === 'Security Gate' || sop.badge === 'Quality Gate' ? '1px solid #bfdbfe' : '1px solid #d1fae5'
            }"
          >
            {{ sop.badge }}
          </span>
        </div>

        <div>
          <h3 style="margin: 0 0 0.35rem 0; font-size: 1.05rem; font-weight: 700; color: #0f172a; line-height: 1.4;">
            {{ sop.title }}
          </h3>
          <div style="font-size: 0.78rem; color: #64748b;">
            PIC Penanggung Jawab: <strong style="color: #0f172a;">{{ sop.pic }}</strong>
          </div>
        </div>

        <div style="border-top: 1px solid #f1f5f9; padding-top: 0.75rem;">
          <ol style="margin: 0 0 0 1.2rem; padding: 0; font-size: 0.85rem; color: #334155; line-height: 1.55;">
            <li v-for="(step, sIdx) in sop.steps" :key="sIdx" style="margin-bottom: 0.45rem;">
              {{ step }}
            </li>
          </ol>
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
const selectedCategory = ref('Semua');

const categories = [
  'Semua',
  'Alur Kerja & Git',
  'Kepatuhan Service',
  'Engineering Teknis',
  'DevOps & Security',
  'Quality Gate & Security'
];

const activeCatStyle = {
  background: '#0f172a',
  color: '#ffffff',
  border: '1px solid #0f172a',
  padding: '0.35rem 0.8rem',
  borderRadius: '8px',
  fontSize: '0.8rem',
  fontWeight: '600',
  cursor: 'pointer'
};

const inactiveCatStyle = {
  background: '#ffffff',
  color: '#475569',
  border: '1px solid #e2e8f0',
  padding: '0.35rem 0.8rem',
  borderRadius: '8px',
  fontSize: '0.8rem',
  fontWeight: '500',
  cursor: 'pointer'
};

const filteredSops = computed(() => {
  const q = searchQuery.value.toLowerCase().trim();
  const cat = selectedCategory.value;

  return store.sops.filter(sop => {
    const matchCat = cat === 'Semua' || sop.category === cat;
    const matchQ = !q ||
      sop.title.toLowerCase().includes(q) ||
      sop.id.toLowerCase().includes(q) ||
      sop.pic.toLowerCase().includes(q) ||
      sop.steps.some(s => s.toLowerCase().includes(q));

    return matchCat && matchQ;
  });
});
</script>

<style scoped>
.sop-card:hover {
  border-color: #93c5fd !important;
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.08) !important;
  transform: translateY(-2px);
}
</style>
