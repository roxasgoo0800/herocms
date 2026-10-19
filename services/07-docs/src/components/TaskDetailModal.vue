<script setup lang="ts">
import { computed } from 'vue';
import {
  Layers,
  X,
  CheckCircle2,
  Bot
} from 'lucide-vue-next';
import { useDocsStore } from '../stores/docsStore';

const store = useDocsStore();
const task = computed(() => store.activeTask);

const completedCount = computed(() => {
  if (!task.value || !task.value.checklist) return 0;
  return task.value.checklist.filter(c => c.done).length;
});
</script>

<template>
  <Teleport to="body">
    <div
      v-if="task"
      class="modal-backdrop"
      @click.self="store.closeTask()"
    >
      <div class="modal-dialog modal-dialog-lg">
        <!-- Modal Header -->
        <div class="modal-header">
          <div class="modal-header-leading">
            <div class="modal-header-icon-box" style="background: #0f172a; color: #ffffff;">
              <Layers :size="18" />
            </div>
            <div>
              <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 2px;">
                <span class="nav-badge" style="font-family: 'JetBrains Mono', monospace;">{{ task.id }}</span>
                <span class="nav-badge badge-warning">⏳ 100% ONGOING</span>
              </div>
              <h3 class="modal-heading" style="margin: 0; font-size: 1.15rem; font-weight: 800; color: #0f172a;">
                {{ task.title }}
              </h3>
            </div>
          </div>
          <button class="modal-close-button" @click="store.closeTask()" title="Tutup Modal">
            <X :size="16" />
          </button>
        </div>

        <!-- Modal Body Content -->
        <div style="display: flex; flex-direction: column; gap: 20px;">
          <!-- Task Summary Lead -->
          <p class="page-desc" style="font-size: 0.9rem; color: #475569; line-height: 1.55; margin: 0;">
            {{ task.lead }}
          </p>

          <!-- Personnel & Handover Strip (Studio Telemetry Style) -->
          <div class="pro-panel" style="padding: 14px 18px; background: #f8fafc;">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px;">
              <div>
                <span style="font-size: 0.7rem; font-weight: 700; color: #64748b; text-transform: uppercase;">Perancang Awal:</span>
                <div style="font-size: 0.85rem; font-weight: 700; color: #0f172a; margin-top: 2px;">
                  Rizal <span class="nav-badge badge-success" style="font-size: 0.65rem; padding: 1px 5px;">✓ UI Selesai</span>
                </div>
              </div>

              <div>
                <span style="font-size: 0.7rem; font-weight: 700; color: #64748b; text-transform: uppercase;">Lanjutan Handover:</span>
                <div style="font-size: 0.85rem; font-weight: 700; color: #2563eb; margin-top: 2px;">
                  {{ task.handoverTo || task.division }}
                </div>
              </div>

              <div>
                <span style="font-size: 0.7rem; font-weight: 700; color: #64748b; text-transform: uppercase;">Status Sprint:</span>
                <div style="font-size: 0.85rem; font-weight: 700; color: #b45309; margin-top: 2px;">
                  ⏳ 100% ONGOING
                </div>
              </div>

              <div>
                <span style="font-size: 0.7rem; font-weight: 700; color: #64748b; text-transform: uppercase;">File Target:</span>
                <div style="font-size: 0.78rem; font-family: 'JetBrains Mono', monospace; color: #334155; margin-top: 2px; word-break: break-all;">
                  {{ task.codeFile }}
                </div>
              </div>
            </div>
          </div>

          <!-- Interactive Checklist (Real-Time Database Persistence!) -->
          <div class="pro-panel" style="padding: 18px;">
            <div class="panel-head" style="margin-bottom: 12px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <CheckCircle2 :size="16" style="color: #059669;" />
                <h4 style="margin: 0; font-size: 0.95rem; font-weight: 700; color: #0f172a;">
                  Rincian Checklist Tugas (Klik untuk Simpan ke Database)
                </h4>
              </div>
              <span class="nav-badge badge-primary">
                {{ completedCount }} / {{ task.checklist.length }} Selesai
              </span>
            </div>

            <div style="display: flex; flex-direction: column; gap: 8px;">
              <div
                v-for="(item, idx) in task.checklist"
                :key="idx"
                style="display: flex; align-items: flex-start; gap: 10px; padding: 10px 12px; border-radius: 8px; border: 1px solid #e2e8f0; cursor: pointer; transition: background 0.15s ease;"
                :style="{ background: item.done ? '#f0fdf4' : '#ffffff', borderColor: item.done ? '#bbf7d0' : '#e2e8f0' }"
                @click="store.toggleChecklistItem(task.id, idx)"
              >
                <input
                  type="checkbox"
                  :checked="item.done"
                  style="margin-top: 2px; cursor: pointer; accent-color: #059669; width: 16px; height: 16px;"
                  @click.stop="store.toggleChecklistItem(task.id, idx)"
                />
                <div style="flex: 1; font-size: 0.84rem; line-height: 1.45;" :style="{ color: item.done ? '#15803d' : '#334155' }">
                  <span v-if="item.done" style="font-weight: 700; margin-right: 4px;">[x] ✓ SELESAI:</span>
                  <span v-else style="font-weight: 700; margin-right: 4px; color: #b45309;">[ ] ⏳ ONGOING:</span>
                  {{ item.text }}
                </div>
              </div>
            </div>
          </div>

          <!-- Technical Logic Flow -->
          <div v-if="task.flowDesc" class="pro-panel" style="padding: 16px 18px;">
            <h4 style="margin: 0 0 6px 0; font-size: 0.9rem; font-weight: 700; color: #0f172a;">
              ⚙️ Alur Logika Teknis:
            </h4>
            <p style="margin: 0; font-size: 0.82rem; color: #475569; font-family: 'JetBrains Mono', monospace; line-height: 1.5; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 14px;">
              {{ task.flowDesc }}
            </p>
          </div>

          <!-- Code Snippet Box -->
          <div v-if="task.codeSnippet">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <h4 style="margin: 0; font-size: 0.88rem; font-weight: 700; color: #0f172a;">
                💻 Kontrak Kode Implementasi ({{ task.codeLang }}):
              </h4>
              <span class="nav-badge" style="font-family: 'JetBrains Mono', monospace; font-size: 0.7rem;">
                {{ task.codeFile }}
              </span>
            </div>
            <pre style="background: #0f172a; color: #e2e8f0; font-family: 'JetBrains Mono', monospace; font-size: 0.78rem; padding: 14px; border-radius: 8px; overflow-x: auto; margin: 0; border-left: 3px solid #2563eb;"><code>{{ task.codeSnippet }}</code></pre>
          </div>

          <!-- Definition of Done (DoD) Criteria -->
          <div v-if="task.dod" style="background: #f8fafc; border-left: 4px solid #059669; padding: 12px 16px; border-radius: 0 8px 8px 0; border: 1px solid #e2e8f0; border-left-width: 4px;">
            <h4 style="margin: 0 0 4px 0; font-size: 0.88rem; font-weight: 700; color: #065f46;">
              ✅ Kriteria Definition of Done (DoD):
            </h4>
            <p v-if="typeof task.dod === 'string'" style="margin: 0; font-size: 0.82rem; color: #1e293b; line-height: 1.45;">
              {{ task.dod }}
            </p>
            <ul v-else-if="Array.isArray(task.dod)" style="margin: 0; padding-left: 18px; font-size: 0.82rem; color: #1e293b; line-height: 1.5;">
              <li v-for="(criterion, cIdx) in task.dod" :key="cIdx" style="margin-bottom: 2px;">
                {{ criterion }}
              </li>
            </ul>
          </div>

          <!-- Paijo AI Notes -->
          <div v-if="task.aiNotes" style="background: #eff6ff; border-left: 4px solid #2563eb; padding: 12px 16px; border-radius: 0 8px 8px 0; border: 1px solid #bfdbfe; border-left-width: 4px;">
            <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
              <Bot :size="15" color="#2563eb" />
              <h4 style="margin: 0; font-size: 0.88rem; font-weight: 700; color: #1e40af;">
                Catatan Arsitektur Paijo AI (PM & QA/QC):
              </h4>
            </div>
            <p style="margin: 0; font-size: 0.82rem; color: #1e293b; line-height: 1.45;">
              {{ task.aiNotes }}
            </p>
          </div>
        </div>

        <!-- Modal Footer -->
        <div style="display: flex; justify-content: flex-end; margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0;">
          <button class="btn-modal-confirm" @click="store.closeTask()">
            Tutup Detail Tugas
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
