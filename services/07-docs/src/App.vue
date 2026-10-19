<template>
  <div class="docs-app" style="min-height: 100vh; background-color: #f8fafc; color: #0f172a; font-family: 'Inter', sans-serif;">
    <!-- Top Glassmorphic Navigation Bar -->
    <header style="background: rgba(255, 255, 255, 0.96); backdrop-filter: blur(20px); border-bottom: 1px solid #e2e8f0; position: sticky; top: 0; z-index: 50;">
      <div style="max-width: 1400px; margin: 0 auto; padding: 0.85rem 1.5rem; display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap;">
        <!-- Brand -->
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <div style="width: 36px; height: 36px; border-radius: 9px; background: #0f172a; color: #ffffff; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.1rem; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
            H
          </div>
          <div>
            <div style="display: flex; align-items: center; gap: 0.45rem;">
              <span style="font-size: 1.1rem; font-weight: 800; letter-spacing: -0.02em; color: #0f172a;">HeroCMS</span>
              <span style="font-size: 1.1rem; font-weight: 800; background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Docs</span>
            </div>
            <div style="font-size: 0.72rem; color: #64748b; font-weight: 600;">Team Mission Control & Architecture Hub</div>
          </div>
        </div>

        <!-- Top Controls: Persona Selector & PM Badge -->
        <div style="display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;">
          <div style="display: flex; align-items: center; gap: 0.45rem; background: #f8fafc; padding: 0.35rem 0.65rem; border-radius: 8px; border: 1px solid #e2e8f0;">
            <label for="persona-select" style="font-size: 0.76rem; font-weight: 600; color: #64748b;">👤 Melihat Sebagai:</label>
            <select 
              id="persona-select"
              v-model="store.selectedFilter"
              style="border: none; background: transparent; font-size: 0.82rem; font-weight: 700; color: #0f172a; outline: none; cursor: pointer;"
              @change="onPersonaChange"
            >
              <option value="all">🌐 Semua Anggota Tim (50 Task)</option>
              <option v-for="m in store.members" :key="m.id" :value="m.id">
                {{ m.icon }} {{ m.name }} ({{ m.role }})
              </option>
            </select>
          </div>

          <div style="display: inline-flex; align-items: center; gap: 0.45rem; background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; font-size: 0.78rem; font-weight: 700; padding: 0.35rem 0.8rem; border-radius: 20px;">
            <span style="width: 8px; height: 8px; border-radius: 50%; background: #2563eb; display: inline-block;"></span>
            <span>🤖 PM & QA/QC: Paijo AI Agent</span>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Container -->
    <main style="max-width: 1400px; margin: 0 auto; padding: 1.75rem 1.5rem 4rem 1.5rem;">
      <!-- Telemetry Cards -->
      <TelemetryGrid />

      <!-- Navigation Tabs Bar -->
      <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 0.4rem; display: flex; flex-wrap: wrap; gap: 0.35rem; margin-bottom: 1.75rem; box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);">
        <button 
          :style="store.activeTab === 'tasks' ? activeTabStyle : inactiveTabStyle"
          @click="store.setActiveTab('tasks')"
        >
          <span>📋 Papan Tugas per Divisi (6 Divisi)</span>
          <span style="font-size: 0.72rem; padding: 0.1rem 0.45rem; border-radius: 5px; font-weight: 700;" :style="store.activeTab === 'tasks' ? { background: '#2563eb', color: '#fff' } : { background: '#e2e8f0', color: '#475569' }">
            {{ store.telemetry.totalTasks }}
          </span>
        </button>

        <button 
          :style="store.activeTab === 'services' ? activeTabStyle : inactiveTabStyle"
          @click="store.setActiveTab('services')"
        >
          <span>🏢 Papan Tugas per Service (6 Area)</span>
          <span style="font-size: 0.72rem; padding: 0.1rem 0.45rem; border-radius: 5px; font-weight: 700;" :style="store.activeTab === 'services' ? { background: '#2563eb', color: '#fff' } : { background: '#e2e8f0', color: '#475569' }">
            6 Services
          </span>
        </button>

        <button 
          :style="store.activeTab === 'blueprints' ? activeTabStyle : inactiveTabStyle"
          @click="store.setActiveTab('blueprints')"
        >
          <span>📖 Blueprint & Kamus Arsitektur</span>
          <span style="font-size: 0.72rem; padding: 0.1rem 0.45rem; border-radius: 5px; font-weight: 700;" :style="store.activeTab === 'blueprints' ? { background: '#2563eb', color: '#fff' } : { background: '#e2e8f0', color: '#475569' }">
            {{ store.telemetry.totalBlueprints }}
          </span>
        </button>

        <button 
          :style="store.activeTab === 'sops' ? activeTabStyle : inactiveTabStyle"
          @click="store.setActiveTab('sops')"
        >
          <span>🛡️ SOP & Runbook Tim</span>
          <span style="font-size: 0.72rem; padding: 0.1rem 0.45rem; border-radius: 5px; font-weight: 700;" :style="store.activeTab === 'sops' ? { background: '#2563eb', color: '#fff' } : { background: '#e2e8f0', color: '#475569' }">
            {{ store.telemetry.totalSops }}
          </span>
        </button>

        <button 
          :style="store.activeTab === 'paijo' ? activeTabStyle : inactiveTabStyle"
          @click="store.setActiveTab('paijo')"
        >
          <span>🤖 Protokol Paijo AI</span>
        </button>
      </div>

      <!-- Active Module View (Lazy-Loaded via defineAsyncComponent) -->
      <section>
        <TaskBoardModule v-if="store.activeTab === 'tasks' || store.activeTab === 'services'" />
        <ArchitectureModule v-else-if="store.activeTab === 'blueprints'" />
        <SopRunbookModule v-else-if="store.activeTab === 'sops'" />
        <PaijoProtocolModule v-else-if="store.activeTab === 'paijo'" />
      </section>
    </main>

    <!-- Modal Reader View -->
    <TaskDetailModal />

    <!-- Global Toast Notification -->
    <div 
      v-if="store.toastMessage"
      style="position: fixed; bottom: 1.5rem; right: 1.5rem; background: #0f172a; color: #ffffff; padding: 0.85rem 1.25rem; border-radius: 10px; font-size: 0.85rem; font-weight: 600; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); display: flex; align-items: center; gap: 0.6rem; z-index: 10000; border: 1px solid #334155;"
    >
      <span style="color: #10b981;">✓</span>
      <span>{{ store.toastMessage }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, onMounted } from 'vue';
import { useDocsStore } from './stores/docsStore';
import TelemetryGrid from './components/TelemetryGrid.vue';
import TaskDetailModal from './components/TaskDetailModal.vue';

// Rule 6: Lazy Loading Modules via defineAsyncComponent
const TaskBoardModule = defineAsyncComponent(() => import('./components/TaskBoardModule.vue'));
const ArchitectureModule = defineAsyncComponent(() => import('./components/ArchitectureModule.vue'));
const SopRunbookModule = defineAsyncComponent(() => import('./components/SopRunbookModule.vue'));
const PaijoProtocolModule = defineAsyncComponent(() => import('./components/PaijoProtocolModule.vue'));

const store = useDocsStore();

onMounted(async () => {
  await store.fetchTasks();
});

function onPersonaChange() {
  store.setActiveTab('tasks');
}

const activeTabStyle = {
  background: '#0f172a',
  color: '#ffffff',
  border: 'none',
  padding: '0.6rem 1.1rem',
  borderRadius: '8px',
  fontSize: '0.86rem',
  fontWeight: '700',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem',
  transition: 'all 0.2s'
};

const inactiveTabStyle = {
  background: 'transparent',
  color: '#475569',
  border: 'none',
  padding: '0.6rem 1.1rem',
  borderRadius: '8px',
  fontSize: '0.86rem',
  fontWeight: '600',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem',
  transition: 'all 0.2s'
};
</script>

<style>
/* Ambient dot pattern background matching DESIGN.md */
body {
  margin: 0;
  background-color: #f8fafc;
  background-image: radial-gradient(#cbd5e1 1.2px, transparent 1.2px);
  background-size: 24px 24px;
}

* {
  box-sizing: border-box;
}
</style>
