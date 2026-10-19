<template>
  <div class="task-board-module">
    <!-- Grouping Toggle Bar -->
    <div style="display: inline-flex; background: #f1f5f9; padding: 0.25rem; border-radius: 10px; border: 1px solid #e2e8f0; margin-bottom: 1.25rem; gap: 0.25rem;">
      <button 
        :style="store.groupingMode === 'division' ? activeToggleStyle : inactiveToggleStyle"
        @click="store.setGroupingMode('division')"
      >
        <span>👥 Kelompokkan per Divisi Tim (6 Divisi)</span>
      </button>
      <button 
        :style="store.groupingMode === 'service' ? activeToggleStyle : inactiveToggleStyle"
        @click="store.setGroupingMode('service')"
      >
        <span>🏢 Kelompokkan per Service (6 Area Microservices)</span>
      </button>
    </div>

    <!-- Filter & Search Row -->
    <div style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.5rem;">
      <!-- Search Input -->
      <div style="position: relative; max-width: 480px;">
        <input 
          v-model="store.searchQuery"
          type="text" 
          placeholder="Cari task, nama modul, service, file target, atau PIC..."
          style="width: 100%; padding: 0.65rem 1rem 0.65rem 2.5rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.88rem; outline: none; background: #ffffff;"
        />
        <span style="position: absolute; left: 0.85rem; top: 50%; transform: translateY(-50%); color: #94a3b8; font-size: 0.95rem;">🔍</span>
      </div>

      <!-- Filter Pills -->
      <div style="display: flex; flex-wrap: wrap; gap: 0.45rem;">
        <template v-if="store.groupingMode === 'division'">
          <button 
            :style="store.selectedFilter === 'all' ? activePillStyle : inactivePillStyle"
            @click="store.setFilter('all')"
          >
            🌐 Semua Divisi ({{ store.telemetry.totalTasks }})
          </button>
          <button 
            v-for="m in store.members" 
            :key="m.id"
            :style="store.selectedFilter === m.id ? activePillStyle : inactivePillStyle"
            @click="store.setFilter(m.id)"
          >
            {{ m.icon }} {{ m.name }}
          </button>
        </template>
        <template v-else>
          <button 
            :style="store.selectedFilter === 'all' ? activePillStyle : inactivePillStyle"
            @click="store.setFilter('all')"
          >
            🌐 Semua Service ({{ store.telemetry.totalTasks }})
          </button>
          <button 
            v-for="s in store.microservices" 
            :key="s.id"
            :style="store.selectedFilter === s.id ? activePillStyle : inactivePillStyle"
            @click="store.setFilter(s.id)"
          >
            {{ s.icon }} {{ s.id.substring(0, 8) }}
          </button>
        </template>
      </div>
    </div>

    <!-- Dynamic Focus Banner -->
    <div style="background: linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%); border: 1px solid #dbeafe; border-radius: 12px; padding: 1.25rem 1.5rem; margin-bottom: 2rem;">
      <h3 style="margin: 0 0 0.35rem 0; font-size: 1.1rem; font-weight: 700; color: #1e3a8a;">
        {{ bannerTitle }}
      </h3>
      <p style="margin: 0; font-size: 0.88rem; color: #475569; line-height: 1.5;">
        {{ bannerSubtitle }}
      </p>
    </div>

    <!-- Groups Container -->
    <div v-if="visibleGroups.length === 0" style="text-align: center; padding: 3rem; background: #fff; border-radius: 12px; border: 1px dashed #cbd5e1;">
      <p style="color: #64748b; font-size: 0.95rem;">Tidak ada task yang cocok dengan filter atau kata kunci pencarian Anda.</p>
    </div>

    <div v-else style="display: flex; flex-direction: column; gap: 2.25rem;">
      <div v-for="grp in visibleGroups" :key="grp.id" class="group-section">
        <!-- Group Header -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #e2e8f0; padding-bottom: 0.85rem; margin-bottom: 1.25rem; gap: 1rem; flex-wrap: wrap;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
              <span style="font-size: 1.35rem;">{{ grp.icon }}</span>
              <h2 style="margin: 0; font-size: 1.15rem; font-weight: 700; color: #0f172a;">{{ grp.name }}</h2>
              <span v-if="grp.path" style="background: #eff6ff; color: #2563eb; font-size: 0.72rem; font-weight: 600; padding: 0.15rem 0.5rem; border-radius: 6px; font-family: 'JetBrains Mono', monospace; border: 1px solid #bfdbfe;">
                {{ grp.path }}
              </span>
              <span style="background: #f1f5f9; color: #475569; font-size: 0.72rem; font-weight: 600; padding: 0.15rem 0.5rem; border-radius: 6px;">
                PIC: {{ grp.pic }}
              </span>
            </div>
            <p v-if="grp.lead" style="margin: 0.35rem 0 0 0; font-size: 0.84rem; color: #64748b; line-height: 1.45;">
              {{ grp.lead }}
            </p>
          </div>
          <span style="background: #eff6ff; color: #2563eb; font-size: 0.75rem; font-weight: 700; padding: 0.25rem 0.65rem; border-radius: 6px; border: 1px solid #bfdbfe;">
            {{ grp.tasks.length }} Tasks Terpetakan
          </span>
        </div>

        <!-- Task Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1rem;">
          <div 
            v-for="task in grp.tasks" 
            :key="task.id"
            class="task-card"
            style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.25rem; cursor: pointer; transition: all 0.2s; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);"
            @click="store.openTask(task)"
          >
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.65rem;">
                <span style="font-size: 0.72rem; font-weight: 600; color: #2563eb; background: #eff6ff; padding: 0.15rem 0.5rem; border-radius: 6px; border: 1px solid #bfdbfe;">
                  {{ task.category }}
                </span>
                <span style="font-size: 0.72rem; font-weight: 600; color: #b45309; background: #fffbeb; padding: 0.15rem 0.5rem; border-radius: 6px; border: 1px solid #fde68a;">
                  Sedang Dikerjakan
                </span>
              </div>
              <h3 style="margin: 0 0 0.45rem 0; font-size: 0.98rem; font-weight: 700; color: #0f172a; line-height: 1.4;">
                {{ task.title }}
              </h3>
              <p style="margin: 0; font-size: 0.82rem; color: #64748b; line-height: 1.45;">
                {{ task.lead.substring(0, 125) }}...
              </p>
            </div>

            <div style="margin-top: 1rem; pt: 0.75rem; border-top: 1px solid #f1f5f9;">
              <div style="margin-bottom: 0.6rem; font-size: 0.76rem; display: flex; flex-direction: column; gap: 0.25rem;">
                <div>
                  <span style="color: #64748b;">Rancang Awal:</span> <strong>Rizal</strong> 
                  <span style="background: #ecfdf5; color: #059669; padding: 1px 6px; border-radius: 4px; font-weight: 600; font-size: 0.7rem; margin-left: 0.35rem;">✓ Tampilan Selesai</span>
                </div>
                <div>
                  <span style="color: #64748b;">Lanjutan Handover:</span> <strong style="color: #0f172a;">{{ task.handoverTo || task.division }}</strong>
                </div>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.76rem;">
                <span style="color: #2563eb; font-weight: 600;">Lihat Detail & Checklist ➔</span>
                <span style="font-family: 'JetBrains Mono', monospace; color: #94a3b8; font-size: 0.72rem;">{{ task.id }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDocsStore } from '../stores/docsStore';
import type { TaskItem } from '../types/docs';

const store = useDocsStore();

const activeToggleStyle = {
  background: '#ffffff',
  color: '#0f172a',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  border: 'none',
  padding: '0.45rem 0.9rem',
  borderRadius: '8px',
  fontSize: '0.82rem',
  fontWeight: '600',
  cursor: 'pointer'
};

const inactiveToggleStyle = {
  background: 'transparent',
  color: '#64748b',
  border: 'none',
  padding: '0.45rem 0.9rem',
  borderRadius: '8px',
  fontSize: '0.82rem',
  fontWeight: '600',
  cursor: 'pointer'
};

const activePillStyle = {
  background: '#0f172a',
  color: '#ffffff',
  border: '1px solid #0f172a',
  padding: '0.35rem 0.75rem',
  borderRadius: '8px',
  fontSize: '0.8rem',
  fontWeight: '600',
  cursor: 'pointer'
};

const inactivePillStyle = {
  background: '#ffffff',
  color: '#475569',
  border: '1px solid #e2e8f0',
  padding: '0.35rem 0.75rem',
  borderRadius: '8px',
  fontSize: '0.8rem',
  fontWeight: '500',
  cursor: 'pointer'
};

const bannerTitle = computed(() => {
  if (store.groupingMode === 'service') {
    if (store.selectedFilter === 'all') return '🏢 Tampilan 6 Microservices HeroCMS Platform';
    const svc = store.microservices.find(s => s.id === store.selectedFilter);
    return svc ? `${svc.icon} ${svc.name}` : 'Detail Service';
  } else {
    if (store.selectedFilter === 'all') return '🌐 Tampilan Global Seluruh Divisi (50 Task Terpetakan)';
    const mem = store.members.find(m => m.id === store.selectedFilter);
    return mem ? `${mem.icon} Mode Fokus: ${mem.name} (${mem.role})` : 'Detail Divisi';
  }
});

const bannerSubtitle = computed(() => {
  if (store.groupingMode === 'service') {
    if (store.selectedFilter === 'all') return 'Menampilkan seluruh pekerjaan bisnis yang dipetakan ke dalam 6 layanan microservices arsitektur HeroCMS.';
    const svc = store.microservices.find(s => s.id === store.selectedFilter);
    return svc ? svc.lead : '';
  } else {
    if (store.selectedFilter === 'all') return 'Menampilkan seluruh rancangan arsitektur dan pekerjaan tim lintas 6 divisi. Dikelola dan diaudit aktif oleh Paijo AI (Project Manager & QA/QC).';
    const mem = store.members.find(m => m.id === store.selectedFilter);
    return mem ? mem.focus : '';
  }
});

interface GroupDisplay {
  id: string;
  name: string;
  icon: string;
  pic: string;
  path?: string;
  lead?: string;
  tasks: TaskItem[];
}

const visibleGroups = computed<GroupDisplay[]>(() => {
  const filtered = store.filteredTasks;
  const groups: GroupDisplay[] = [];

  if (store.groupingMode === 'division') {
    const targetMembers = store.selectedFilter === 'all' 
      ? store.members 
      : store.members.filter(m => m.id === store.selectedFilter);

    targetMembers.forEach(mem => {
      const tasksForMem = filtered.filter(t => t.division === mem.id);
      if (tasksForMem.length > 0) {
        groups.push({
          id: mem.id,
          name: `Divisi ${mem.role}`,
          icon: mem.icon,
          pic: mem.pic,
          tasks: tasksForMem
        });
      }
    });
  } else {
    const targetServices = store.selectedFilter === 'all'
      ? store.microservices
      : store.microservices.filter(s => s.id === store.selectedFilter);

    targetServices.forEach(svc => {
      const tasksForSvc = filtered.filter(t => t.serviceGroup === svc.id);
      if (tasksForSvc.length > 0) {
        groups.push({
          id: svc.id,
          name: svc.name,
          icon: svc.icon,
          pic: svc.pic,
          path: svc.path,
          lead: svc.lead,
          tasks: tasksForSvc
        });
      }
    });
  }

  return groups;
});
</script>

<style scoped>
.task-card:hover {
  border-color: #93c5fd !important;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.08) !important;
  transform: translateY(-2px);
}
</style>
