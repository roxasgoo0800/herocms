import { defineStore } from 'pinia';
import type {
  TaskItem,
  TelemetryStats,
  EnterpriseSop,
  ArchitectureBlueprint,
  MicroservicePrd,
  SecurityStandard,
  SystemJourney
} from '../types/docs';
import { teamMembers, microservicesList } from '../data/team';
import { architectureBlueprints } from '../data/blueprints';
import { enterpriseSops } from '../data/sops';
import { microservicePrds } from '../data/prds';
import { securityStandards } from '../data/security';
import { systemJourneys } from '../data/journeys';

export const useDocsStore = defineStore('docsStore', {
  state: () => ({
    tasks: [] as TaskItem[],
    loading: false,
    groupingMode: 'division' as 'division' | 'service',
    selectedFilter: 'all',
    searchQuery: '',
    activeTab: 'tasks' as 'tasks' | 'services' | 'prds' | 'blueprints' | 'journeys' | 'security' | 'sops' | 'paijo',
    activeTask: null as TaskItem | null,
    activeSop: null as EnterpriseSop | null,
    activeBlueprint: null as ArchitectureBlueprint | null,
    activePrd: null as MicroservicePrd | null,
    activeSecurity: null as SecurityStandard | null,
    activeJourney: null as SystemJourney | null,
    isReaderSidebarHidden: false,
    toastMessage: null as string | null,
    members: teamMembers,
    microservices: microservicesList,
    blueprints: architectureBlueprints,
    sops: enterpriseSops,
    prds: microservicePrds,
    securityStandards: securityStandards,
    journeys: systemJourneys
  }),

  getters: {
    telemetry(state): TelemetryStats {
      return {
        totalTasks: state.tasks.length || 50,
        ongoingTasks: state.tasks.filter(t => t.status === 'ONGOING').length || state.tasks.length || 50,
        totalServices: state.microservices.length,
        totalMembers: state.members.length,
        totalBlueprints: state.blueprints.length,
        totalSops: state.sops.length,
        totalPrds: state.prds.length,
        totalSecurityPillars: state.securityStandards.length,
        totalJourneys: state.journeys.length
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

    setActiveTab(tab: 'tasks' | 'services' | 'prds' | 'blueprints' | 'journeys' | 'security' | 'sops' | 'paijo') {
      this.activeTab = tab;
      this.activeTask = null;
      this.activeSop = null;
      this.activeBlueprint = null;
      this.activePrd = null;
      this.activeSecurity = null;
      this.activeJourney = null;
      if (tab === 'tasks') {
        this.groupingMode = 'division';
      } else if (tab === 'services') {
        this.groupingMode = 'service';
      }
    },

    openTask(task: TaskItem) {
      this.activeTask = task;
      this.activeSop = null;
      this.activeBlueprint = null;
      this.activePrd = null;
      this.activeSecurity = null;
      this.activeJourney = null;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    closeTask() {
      this.activeTask = null;
    },

    openSop(sop: EnterpriseSop) {
      this.activeSop = sop;
      this.activeTask = null;
      this.activeBlueprint = null;
      this.activePrd = null;
      this.activeSecurity = null;
      this.activeJourney = null;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    closeSop() {
      this.activeSop = null;
    },

    openBlueprint(bp: ArchitectureBlueprint) {
      this.activeBlueprint = bp;
      this.activeTask = null;
      this.activeSop = null;
      this.activePrd = null;
      this.activeSecurity = null;
      this.activeJourney = null;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    closeBlueprint() {
      this.activeBlueprint = null;
    },

    openPrd(prd: MicroservicePrd) {
      this.activePrd = prd;
      this.activeTask = null;
      this.activeSop = null;
      this.activeBlueprint = null;
      this.activeSecurity = null;
      this.activeJourney = null;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    closePrd() {
      this.activePrd = null;
    },

    openSecurity(sec: SecurityStandard) {
      this.activeSecurity = sec;
      this.activeTask = null;
      this.activeSop = null;
      this.activeBlueprint = null;
      this.activePrd = null;
      this.activeJourney = null;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    closeSecurity() {
      this.activeSecurity = null;
    },

    openJourney(jrn: SystemJourney) {
      this.activeJourney = jrn;
      this.activeTask = null;
      this.activeSop = null;
      this.activeBlueprint = null;
      this.activePrd = null;
      this.activeSecurity = null;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    closeJourney() {
      this.activeJourney = null;
    },

    toggleReaderSidebar() {
      this.isReaderSidebarHidden = !this.isReaderSidebarHidden;
    },

    nextTask() {
      if (!this.activeTask) return;
      const list = this.filteredTasks.length > 0 ? this.filteredTasks : this.tasks;
      const idx = list.findIndex(t => t.id === this.activeTask?.id);
      if (idx !== -1 && idx < list.length - 1) {
        this.activeTask = list[idx + 1];
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },

    prevTask() {
      if (!this.activeTask) return;
      const list = this.filteredTasks.length > 0 ? this.filteredTasks : this.tasks;
      const idx = list.findIndex(t => t.id === this.activeTask?.id);
      if (idx > 0) {
        this.activeTask = list[idx - 1];
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },

    nextSop() {
      if (!this.activeSop) return;
      const idx = this.sops.findIndex(s => s.id === this.activeSop?.id);
      if (idx !== -1 && idx < this.sops.length - 1) {
        this.activeSop = this.sops[idx + 1];
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },

    prevSop() {
      if (!this.activeSop) return;
      const idx = this.sops.findIndex(s => s.id === this.activeSop?.id);
      if (idx > 0) {
        this.activeSop = this.sops[idx - 1];
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },

    nextBlueprint() {
      if (!this.activeBlueprint) return;
      const idx = this.blueprints.findIndex(b => b.id === this.activeBlueprint?.id);
      if (idx !== -1 && idx < this.blueprints.length - 1) {
        this.activeBlueprint = this.blueprints[idx + 1];
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },

    prevBlueprint() {
      if (!this.activeBlueprint) return;
      const idx = this.blueprints.findIndex(b => b.id === this.activeBlueprint?.id);
      if (idx > 0) {
        this.activeBlueprint = this.blueprints[idx - 1];
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },

    nextPrd() {
      if (!this.activePrd) return;
      const idx = this.prds.findIndex(p => p.id === this.activePrd?.id);
      if (idx !== -1 && idx < this.prds.length - 1) {
        this.activePrd = this.prds[idx + 1];
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },

    prevPrd() {
      if (!this.activePrd) return;
      const idx = this.prds.findIndex(p => p.id === this.activePrd?.id);
      if (idx > 0) {
        this.activePrd = this.prds[idx - 1];
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },

    nextSecurity() {
      if (!this.activeSecurity) return;
      const idx = this.securityStandards.findIndex(s => s.id === this.activeSecurity?.id);
      if (idx !== -1 && idx < this.securityStandards.length - 1) {
        this.activeSecurity = this.securityStandards[idx + 1];
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },

    prevSecurity() {
      if (!this.activeSecurity) return;
      const idx = this.securityStandards.findIndex(s => s.id === this.activeSecurity?.id);
      if (idx > 0) {
        this.activeSecurity = this.securityStandards[idx - 1];
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },

    nextJourney() {
      if (!this.activeJourney) return;
      const idx = this.journeys.findIndex(j => j.id === this.activeJourney?.id);
      if (idx !== -1 && idx < this.journeys.length - 1) {
        this.activeJourney = this.journeys[idx + 1];
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },

    prevJourney() {
      if (!this.activeJourney) return;
      const idx = this.journeys.findIndex(j => j.id === this.activeJourney?.id);
      if (idx > 0) {
        this.activeJourney = this.journeys[idx - 1];
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
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
