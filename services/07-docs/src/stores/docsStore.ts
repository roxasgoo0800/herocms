import { defineStore } from 'pinia';
import type { TaskItem, TelemetryStats } from '../types/docs';
import { teamMembers, microservicesList } from '../data/team';
import { architectureBlueprints } from '../data/blueprints';
import { enterpriseSops } from '../data/sops';

export const useDocsStore = defineStore('docsStore', {
  state: () => ({
    tasks: [] as TaskItem[],
    loading: false,
    groupingMode: 'division' as 'division' | 'service',
    selectedFilter: 'all',
    searchQuery: '',
    activeTab: 'tasks' as 'tasks' | 'services' | 'blueprints' | 'sops' | 'paijo',
    activeTask: null as TaskItem | null,
    toastMessage: null as string | null,
    members: teamMembers,
    microservices: microservicesList,
    blueprints: architectureBlueprints,
    sops: enterpriseSops
  }),

  getters: {
    telemetry(state): TelemetryStats {
      return {
        totalTasks: state.tasks.length || 50,
        ongoingTasks: state.tasks.filter(t => t.status === 'ONGOING').length || state.tasks.length || 50,
        totalServices: state.microservices.length,
        totalMembers: state.members.length,
        totalBlueprints: state.blueprints.length,
        totalSops: state.sops.length
      };
    },

    filteredTasks(state): TaskItem[] {
      const q = state.searchQuery.toLowerCase().trim();
      return state.tasks.filter(t => {
        let matchGroup = true;
        if (state.selectedFilter !== 'all') {
          if (state.groupingMode === 'division') {
            matchGroup = t.division === state.selectedFilter;
          } else {
            matchGroup = t.serviceGroup === state.selectedFilter;
          }
        }

        const matchQ = !q ||
          t.title.toLowerCase().includes(q) ||
          t.lead.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q) ||
          t.codeFile.toLowerCase().includes(q);

        return matchGroup && matchQ;
      });
    }
  },

  actions: {
    async fetchTasks() {
      this.loading = true;
      try {
        const res = await fetch('/api/v1/tasks');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            this.tasks = data;
            return;
          }
        }
      } catch (err) {
        console.warn('API /api/v1/tasks unreachable, falling back to local dataset:', err);
      } finally {
        this.loading = false;
      }

      // Fallback: If API is still starting, load seed dataset
      if (this.tasks.length === 0) {
        try {
          const fallbackRes = await fetch('/api/v1/seed');
          if (fallbackRes.ok) {
            this.tasks = await fallbackRes.json();
          }
        } catch {
          // Keep empty or let component load
        }
      }
    },

    setTasks(tasks: TaskItem[]) {
      this.tasks = tasks;
    },

    async toggleChecklistItem(taskId: string, itemIndex: number) {
      const task = this.tasks.find(t => t.id === taskId);
      if (!task || !task.checklist || !task.checklist[itemIndex]) return;

      const previousStatus = task.checklist[itemIndex].done;
      task.checklist[itemIndex].done = !previousStatus;

      // Update activeTask if currently open
      if (this.activeTask && this.activeTask.id === taskId) {
        this.activeTask.checklist[itemIndex].done = task.checklist[itemIndex].done;
      }

      const statusText = task.checklist[itemIndex].done ? 'Selesai ✓' : 'Ongoing ⏳';
      this.showToast(`Checklist ${task.id} [${itemIndex + 1}] diperbarui: ${statusText}`);

      // Persist to backend database via PATCH
      try {
        await fetch(`/api/v1/tasks/${taskId}/checklist`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            index: itemIndex,
            done: task.checklist[itemIndex].done
          })
        });
      } catch (err) {
        console.warn('Gagal sinkronisasi ke server database:', err);
      }
    },

    setGroupingMode(mode: 'division' | 'service') {
      this.groupingMode = mode;
      this.selectedFilter = 'all';
    },

    setFilter(filter: string) {
      this.selectedFilter = filter;
    },

    setActiveTab(tab: 'tasks' | 'services' | 'blueprints' | 'sops' | 'paijo') {
      this.activeTab = tab;
      if (tab === 'tasks') {
        this.groupingMode = 'division';
      } else if (tab === 'services') {
        this.groupingMode = 'service';
      }
    },

    openTask(task: TaskItem) {
      this.activeTask = task;
    },

    closeTask() {
      this.activeTask = null;
    },

    showToast(message: string) {
      this.toastMessage = message;
      setTimeout(() => {
        if (this.toastMessage === message) {
          this.toastMessage = null;
        }
      }, 2500);
    }
  }
});
