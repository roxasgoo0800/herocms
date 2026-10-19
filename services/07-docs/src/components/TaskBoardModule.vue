<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import {
  Search,
  X,
  FolderKanban,
  CheckCircle2,
  ArrowRight,
  FileCode,
  UserCheck
} from 'lucide-vue-next';
import { useDocsStore } from '../stores/docsStore';
import type { TaskItem } from '../types/docs';

const store = useDocsStore();
const searchInputRef = ref<HTMLInputElement | null>(null);

const handleGlobalKeydown = (e: KeyboardEvent) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    searchInputRef.value?.focus();
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleGlobalKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown);
});

interface GroupedTasks {
  id: string;
  name: string;
  pic: string;
  icon: string;
  lead: string;
  path?: string;
  tasks: TaskItem[];
}

const visibleGroups = computed<GroupedTasks[]>(() => {
  const query = store.searchQuery.trim().toLowerCase();
  const filter = store.selectedFilter;

  if (store.groupingMode === 'division') {
    return store.members
      .filter(m => filter === 'all' || m.id === filter)
      .map(m => {
        const memberTasks = store.tasks.filter(t => {
          const matchDiv = t.division === m.id;
          if (!matchDiv) return false;
          if (!query) return true;
          return (
            t.title.toLowerCase().includes(query) ||
            t.lead.toLowerCase().includes(query) ||
            t.codeFile.toLowerCase().includes(query) ||
            t.category.toLowerCase().includes(query) ||
            t.id.toLowerCase().includes(query)
          );
        });
        return {
          id: m.id,
          name: `${m.name} (${m.role})`,
          pic: m.pic,
          icon: m.icon,
          lead: m.focus,
          tasks: memberTasks
        };
      })
      .filter(g => g.tasks.length > 0);
  } else {
    return store.microservices
      .filter(s => filter === 'all' || s.id === filter)
      .map(s => {
        const serviceTasks = store.tasks.filter(t => {
          const matchSvc = t.serviceGroup === s.id;
          if (!matchSvc) return false;
          if (!query) return true;
          return (
            t.title.toLowerCase().includes(query) ||
            t.lead.toLowerCase().includes(query) ||
            t.codeFile.toLowerCase().includes(query) ||
            t.category.toLowerCase().includes(query) ||
            t.id.toLowerCase().includes(query)
          );
        });
        return {
          id: s.id,
          name: s.name,
          pic: s.pic,
          icon: s.icon,
          lead: s.lead,
          path: s.path,
          tasks: serviceTasks
        };
      })
      .filter(g => g.tasks.length > 0);
  }
});

const getCompletedCount = (t: TaskItem) => {
  if (!t.checklist) return 0;
  return t.checklist.filter(c => c.done).length;
};

const getCompletionPercentage = (t: TaskItem) => {
  if (!t.checklist || t.checklist.length === 0) return 0;
  return Math.round((getCompletedCount(t) / t.checklist.length) * 100);
};
</script>

<template>
  <div class="task-board-module fade-in-section">
    <!-- 1. Bespoke Search Command & Mode Switcher Bar -->
    <div class="filter-toolbar">
      <div class="search-command-shell">
        <Search :size="15" class="search-lead-glyph" />
        <input
          ref="searchInputRef"
          v-model="store.searchQuery"
          type="text"
          placeholder="Cari task, nama modul, service, target file, atau PIC..."
          class="search-command-input"
        />
        <button
          v-if="store.searchQuery"
          class="btn-clear-search"
          @click="store.searchQuery = ''"
          title="Bersihkan"
        >
          <X :size="13" />
        </button>
        <kbd class="shortcut-tag">⌘K</kbd>
      </div>

      <!-- Segmented Mode Toggle (Divisi vs Service) -->
      <div class="year-toggle-group">
        <button
          class="btn-year-tab"
          :class="{ active: store.groupingMode === 'division' }"
          @click="store.setGroupingMode('division')"
        >
          <span>👥 Mode Divisi (6)</span>
        </button>
        <button
          class="btn-year-tab"
          :class="{ active: store.groupingMode === 'service' }"
          @click="store.setGroupingMode('service')"
        >
          <span>🏢 Mode Service (6)</span>
        </button>
      </div>
    </div>

    <!-- 2. Segmented Filter Pills -->
    <div class="segmented-filter-bar" style="margin-bottom: 24px; flex-wrap: wrap;">
      <button
        class="segment-pill"
        :class="{ active: store.selectedFilter === 'all' }"
        @click="store.setFilter('all')"
      >
        <span>Semua</span>
        <span class="pill-count">{{ store.telemetry.totalTasks }}</span>
      </button>

      <template v-if="store.groupingMode === 'division'">
        <button
          v-for="m in store.members"
          :key="m.id"
          class="segment-pill"
          :class="{ active: store.selectedFilter === m.id }"
          @click="store.setFilter(m.id)"
        >
          <span class="mini-status-dot running"></span>
          <span>{{ m.icon }} {{ m.name }}</span>
        </button>
      </template>

      <template v-else>
        <button
          v-for="s in store.microservices"
          :key="s.id"
          class="segment-pill"
          :class="{ active: store.selectedFilter === s.id }"
          @click="store.setFilter(s.id)"
        >
          <span class="mini-status-dot running"></span>
          <span>{{ s.icon }} {{ s.id.substring(0, 10) }}</span>
        </button>
      </template>
    </div>

    <!-- 3. Empty State Notification -->
    <div v-if="visibleGroups.length === 0" class="empty-state-card" style="padding: 48px 24px; text-align: center; background: #ffffff; border: 1px dashed #cbd5e1; border-radius: 14px;">
      <FolderKanban :size="42" color="#94a3b8" style="margin-bottom: 12px;" />
      <h3 style="font-size: 1.05rem; font-weight: 700; color: #0f172a; margin-bottom: 4px;">Tidak Ada Task yang Cocok</h3>
      <p style="color: #64748b; font-size: 0.85rem; margin: 0;">Silakan bersihkan filter pencarian untuk menampilkan seluruh 50 task.</p>
    </div>

    <!-- 4. Group Sections & Responsive Cards Grid -->
    <div v-else style="display: flex; flex-direction: column; gap: 32px;">
      <section v-for="grp in visibleGroups" :key="grp.id" class="group-section">
        <!-- Group Header Header Bar -->
        <div class="page-intro-row" style="margin-bottom: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px;">
          <div>
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
              <span style="font-size: 1.25rem;">{{ grp.icon }}</span>
              <h2 style="font-size: 1.15rem; font-weight: 800; color: #0f172a; margin: 0; letter-spacing: -0.02em;">
                {{ grp.name }}
              </h2>
              <span v-if="grp.path" class="nav-badge badge-primary">
                {{ grp.path }}
              </span>
              <span class="nav-badge">
                PIC: {{ grp.pic }}
              </span>
            </div>
            <p style="margin: 4px 0 0; font-size: 0.82rem; color: #64748b;">
              {{ grp.lead }}
            </p>
          </div>
          <div class="quota-quick-pills">
            <span class="pill-metric-highlight">
              <strong>{{ grp.tasks.length }} Tasks Terdaftar</strong>
            </span>
          </div>
        </div>

        <!-- Cards Grid using studio-master.css -->
        <div class="site-cards-grid">
          <div
            v-for="task in grp.tasks"
            :key="task.id"
            class="pro-site-card"
            style="--card-accent: #2563eb; cursor: pointer;"
            @click="store.openTask(task)"
          >
            <!-- Card Head -->
            <div class="card-head">
              <div class="site-branding">
                <div class="site-icon-box" style="background: #eff6ff; color: #2563eb;">
                  <FolderKanban :size="20" />
                </div>
                <div class="site-branding-info">
                  <div style="display: flex; align-items: center; gap: 6px;">
                    <span class="nav-badge" style="font-family: 'JetBrains Mono', monospace;">{{ task.id }}</span>
                    <span class="nav-badge badge-warning">⏳ ONGOING</span>
                  </div>
                  <h3 class="brand-title" style="font-size: 0.98rem; font-weight: 700; color: #0f172a; margin-top: 2px; line-height: 1.35; white-space: normal;">
                    {{ task.title }}
                  </h3>
                </div>
              </div>
            </div>

            <!-- Lead Paragraph -->
            <p class="page-desc" style="font-size: 0.82rem; color: #475569; line-height: 1.45; margin: 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
              {{ task.lead }}
            </p>

            <!-- Technical File Box -->
            <div class="site-url-box" style="margin: 0;">
              <div class="url-text-wrap">
                <FileCode :size="12" style="color: #2563eb; flex-shrink: 0;" />
                <span class="url-prefix">{{ task.codeLang }}:</span>
                <span class="url-mono" style="font-size: 0.74rem;">{{ task.codeFile }}</span>
              </div>
            </div>

            <!-- Checklist Progress Meter -->
            <div class="resource-gauges-row" style="margin: 0; padding: 10px 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
              <div class="gauge-col" style="width: 100%;">
                <div class="gauge-meta" style="margin-bottom: 6px;">
                  <div class="gauge-header-flex">
                    <CheckCircle2 :size="12" style="color: #059669;" />
                    <span class="gauge-title">CHECKLIST PROGRES</span>
                  </div>
                  <span class="gauge-val" style="font-size: 0.76rem;">
                    <strong>{{ getCompletedCount(task) }} / {{ task.checklist.length }}</strong>
                    <span class="gauge-sub"> ({{ getCompletionPercentage(task) }}%)</span>
                  </span>
                </div>
                <div class="custom-meter-track" style="height: 5px;">
                  <div
                    class="custom-meter-fill fill-blue"
                    :style="{ width: `${getCompletionPercentage(task)}%` }"
                  ></div>
                </div>
              </div>
            </div>

            <!-- Personil & Handover Strip -->
            <div class="card-momentum-strip" style="cursor: default; padding: 8px 12px;">
              <div class="momentum-left-meta">
                <div class="momentum-title-flex">
                  <UserCheck :size="12" style="color: #059669;" />
                  <span>PERANCANG AWAL: <strong>Rizal (✓ UI Siap)</strong></span>
                </div>
                <div class="momentum-stat-flex" style="margin-top: 2px;">
                  <span style="font-size: 0.74rem; color: #64748b;">
                    Handover: <strong style="color: #2563eb;">{{ task.handoverTo || task.division }}</strong>
                  </span>
                </div>
              </div>
            </div>

            <!-- Card Bottom Action Link -->
            <div style="display: flex; justify-content: space-between; align-items: center; pt: 8px; border-top: 1px solid #f1f5f9;">
              <span style="font-size: 0.78rem; font-weight: 700; color: #2563eb; display: inline-flex; align-items: center; gap: 4px;">
                <span>Buka Detail & Checklist Interaktif</span>
                <ArrowRight :size="13" />
              </span>
              <span class="nav-badge badge-primary">{{ task.priority }}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
