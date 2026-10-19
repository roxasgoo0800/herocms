<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import {
  Search,
  X,
  FolderKanban,
  ArrowRight,
  FileCode
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
          version: s.version,
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
          <span v-if="s.version" style="font-size: 0.72rem; opacity: 0.75; font-weight: 700; margin-left: 2px;">{{ s.version }}</span>
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
              <span v-if="(grp as any).version" class="nav-badge badge-success">
                {{ (grp as any).version }}
              </span>
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
          <article
            v-for="task in grp.tasks"
            :key="task.id"
            class="task-card-pro"
            :class="{ 'card-completed': getCompletionPercentage(task) === 100 }"
            @click="store.openTask(task)"
            role="button"
            tabindex="0"
            :aria-label="`Buka artikel ${task.title}`"
            @keydown.enter="store.openTask(task)"
          >
            <!-- Card Top Header: ID Chip, Category & Priority -->
            <div class="task-card-header">
              <div class="task-card-meta-left">
                <span class="task-id-chip">{{ task.id }}</span>
                <span class="task-cat-badge">{{ task.category }}</span>
              </div>
              <div class="task-card-meta-right">
                <span
                  class="task-priority-chip"
                  :class="`priority-${task.priority.toLowerCase()}`"
                >
                  {{ task.priority }}
                </span>
              </div>
            </div>

            <!-- Card Body: Title & Excerpt -->
            <div class="task-card-body">
              <h3 class="task-card-title">{{ task.title }}</h3>
              <p class="task-card-lead">{{ task.lead }}</p>
            </div>

            <!-- Target File Pill -->
            <div class="task-target-pill" :title="`${task.codeLang}: ${task.codeFile}`">
              <FileCode :size="13" class="target-file-icon" />
              <span class="target-lang-tag">{{ task.codeLang }}</span>
              <span class="target-file-path">{{ task.codeFile }}</span>
            </div>

            <!-- Sleek Progress Meter -->
            <div class="task-progress-box">
              <div class="task-progress-meta">
                <span class="progress-label">Progres Tugas</span>
                <span class="progress-val">
                  <strong>{{ getCompletedCount(task) }}</strong> / {{ task.checklist.length }}
                  <span class="progress-pct">({{ getCompletionPercentage(task) }}%)</span>
                </span>
              </div>
              <div class="task-progress-bar">
                <div
                  class="task-progress-fill"
                  :class="{ 'fill-completed': getCompletionPercentage(task) === 100 }"
                  :style="{ width: `${getCompletionPercentage(task)}%` }"
                ></div>
              </div>
            </div>

            <!-- Card Footer: Handover & Read Action -->
            <div class="task-card-footer">
              <div class="task-handover-info">
                <div class="task-avatar-mini" :title="`Handover ke ${task.handoverTo || task.division}`">
                  {{ (task.handoverTo || task.division).charAt(0).toUpperCase() }}
                </div>
                <div class="task-handover-text">
                  <span class="handover-sub">Handover:</span>
                  <span class="handover-name">{{ task.handoverTo || task.division }}</span>
                </div>
              </div>

              <div class="task-read-cta">
                <span>Buka Artikel</span>
                <ArrowRight :size="13" class="cta-arrow" />
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  </div>
</template>
