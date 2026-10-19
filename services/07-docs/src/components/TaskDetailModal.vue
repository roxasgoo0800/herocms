<template>
  <div v-if="task" class="modal-backdrop" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 1.5rem;" @click.self="store.closeTask()">
    <div class="modal-dialog" style="background: #ffffff; border-radius: 14px; max-width: 860px; width: 100%; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1); border: 1px solid #e2e8f0; display: flex; flex-direction: column;">
      <!-- Modal Top Bar -->
      <div style="padding: 1.25rem 1.75rem; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; background: #ffffff; z-index: 10;">
        <div style="display: flex; align-items: center; gap: 0.6rem;">
          <span style="background: #eff6ff; color: #2563eb; font-weight: 700; font-size: 0.75rem; padding: 0.2rem 0.6rem; border-radius: 6px; font-family: 'JetBrains Mono', monospace; border: 1px solid #bfdbfe;">
            {{ task.id }}
          </span>
          <span style="font-size: 0.75rem; color: #64748b; font-weight: 600;">{{ task.category }}</span>
        </div>
        <button 
          style="background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 8px; padding: 0.4rem 0.85rem; font-size: 0.82rem; font-weight: 600; color: #334155; cursor: pointer; display: flex; align-items: center; gap: 0.35rem;"
          @click="store.closeTask()"
        >
          <span>✕ Tutup Detail</span>
        </button>
      </div>

      <!-- Modal Body -->
      <div style="padding: 1.75rem; display: flex; flex-direction: column; gap: 1.5rem;">
        <!-- Header Info -->
        <div>
          <h2 style="margin: 0 0 0.5rem 0; font-size: 1.35rem; font-weight: 800; color: #0f172a; line-height: 1.35;">
            {{ task.title }}
          </h2>
          <p style="margin: 0; font-size: 0.95rem; color: #475569; line-height: 1.6;">
            {{ task.lead }}
          </p>
        </div>

        <!-- Personil & Status Info Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.75rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 1rem;">
          <div>
            <div style="font-size: 0.72rem; color: #64748b; font-weight: 600; text-transform: uppercase;">Perancang Awal</div>
            <div style="font-size: 0.88rem; font-weight: 700; color: #0f172a; margin-top: 0.15rem;">
              Rizal <span style="background: #ecfdf5; color: #059669; font-size: 0.7rem; padding: 1px 5px; border-radius: 4px;">✓ UI Selesai</span>
            </div>
          </div>
          <div>
            <div style="font-size: 0.72rem; color: #64748b; font-weight: 600; text-transform: uppercase;">Lanjutan Handover</div>
            <div style="font-size: 0.88rem; font-weight: 700; color: #2563eb; margin-top: 0.15rem;">
              {{ task.handoverTo || task.division }}
            </div>
          </div>
          <div>
            <div style="font-size: 0.72rem; color: #64748b; font-weight: 600; text-transform: uppercase;">Status Pengerjaan</div>
            <div style="font-size: 0.88rem; font-weight: 700; color: #b45309; margin-top: 0.15rem;">
              ⏳ 100% ONGOING (Proses Real)
            </div>
          </div>
          <div>
            <div style="font-size: 0.72rem; color: #64748b; font-weight: 600; text-transform: uppercase;">File Target</div>
            <div style="font-size: 0.82rem; font-family: 'JetBrains Mono', monospace; color: #334155; margin-top: 0.15rem; word-break: break-all;">
              {{ task.codeFile }}
            </div>
          </div>
        </div>

        <!-- Interactive Checklist Section (Direct Database Persistence!) -->
        <div style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 10px; padding: 1.25rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.85rem;">
            <h4 style="margin: 0; font-size: 0.95rem; font-weight: 700; color: #0f172a; display: flex; align-items: center; gap: 0.4rem;">
              <span>☑️ Rincian Checklist Pekerjaan (Klik untuk Sinkronisasi DB):</span>
            </h4>
            <span style="font-size: 0.76rem; color: #64748b;">
              {{ completedCount }} / {{ task.checklist.length }} Dicentang
            </span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.6rem;">
            <div 
              v-for="(item, idx) in task.checklist" 
              :key="idx"
              style="display: flex; align-items: flex-start; gap: 0.65rem; padding: 0.6rem 0.75rem; border-radius: 8px; transition: background 0.2s; cursor: pointer;"
              :style="{ background: item.done ? '#f0fdf4' : '#f8fafc', border: item.done ? '1px solid #bbf7d0' : '1px solid #e2e8f0' }"
              @click="store.toggleChecklistItem(task.id, idx)"
            >
              <input 
                type="checkbox" 
                :checked="item.done" 
                style="margin-top: 0.2rem; cursor: pointer; accent-color: #059669; width: 16px; height: 16px;" 
                @click.stop="store.toggleChecklistItem(task.id, idx)"
              />
              <div style="flex: 1; font-size: 0.86rem; line-height: 1.45;" :style="{ color: item.done ? '#15803d' : '#334155', textDecoration: item.done ? 'none' : 'none' }">
                <span v-if="item.done" style="font-weight: 700; margin-right: 0.35rem;">[x] ✓ SELESAI:</span>
                <span v-else style="font-weight: 700; margin-right: 0.35rem; color: #b45309;">[ ] ⏳ ONGOING:</span>
                {{ item.text }}
              </div>
            </div>
          </div>
        </div>

        <!-- Technical Flow Description -->
        <div v-if="task.flowDesc">
          <h4 style="margin: 0 0 0.4rem 0; font-size: 0.92rem; font-weight: 700; color: #0f172a;">
            ⚙️ Alur Logika Teknis:
          </h4>
          <p style="margin: 0; font-size: 0.88rem; color: #475569; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 0.75rem 1rem; line-height: 1.5; font-family: 'JetBrains Mono', monospace;">
            {{ task.flowDesc }}
          </p>
        </div>

        <!-- Code Snippet -->
        <div v-if="task.codeSnippet">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
            <h4 style="margin: 0; font-size: 0.92rem; font-weight: 700; color: #0f172a;">
              💻 Cuplikan Implementasi / Kontrak Kode ({{ task.codeLang }}):
            </h4>
            <span style="font-size: 0.72rem; color: #64748b; font-family: 'JetBrains Mono', monospace;">
              {{ task.codeFile }}
            </span>
          </div>
          <pre style="background: #0f172a; color: #e2e8f0; font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; padding: 1rem; border-radius: 8px; overflow-x: auto; margin: 0; border-left: 3px solid #2563eb;"><code>{{ task.codeSnippet }}</code></pre>
        </div>

        <!-- Definition of Done (DoD) -->
        <div v-if="task.dod" style="background: #f8fafc; border-left: 4px solid #059669; padding: 0.85rem 1.15rem; border-radius: 0 8px 8px 0;">
          <h4 style="margin: 0 0 0.35rem 0; font-size: 0.88rem; font-weight: 700; color: #065f46;">
            ✅ Kriteria Definition of Done (DoD):
          </h4>
          <p v-if="typeof task.dod === 'string'" style="margin: 0; font-size: 0.85rem; color: #1e293b; line-height: 1.45;">
            {{ task.dod }}
          </p>
          <ul v-else-if="Array.isArray(task.dod)" style="margin: 0; padding-left: 1.25rem; font-size: 0.85rem; color: #1e293b; line-height: 1.5;">
            <li v-for="(criterion, cIdx) in task.dod" :key="cIdx" style="margin-bottom: 0.2rem;">
              {{ criterion }}
            </li>
          </ul>
        </div>

        <!-- Paijo AI Architecture Notes -->
        <div v-if="task.aiNotes" style="background: #eff6ff; border-left: 4px solid #2563eb; padding: 0.85rem 1.15rem; border-radius: 0 8px 8px 0;">
          <h4 style="margin: 0 0 0.25rem 0; font-size: 0.88rem; font-weight: 700; color: #1e40af;">
            🤖 Catatan Arsitektur Paijo AI (PM & QA/QC):
          </h4>
          <p style="margin: 0; font-size: 0.85rem; color: #1e293b; line-height: 1.45;">
            {{ task.aiNotes }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDocsStore } from '../stores/docsStore';

const store = useDocsStore();
const task = computed(() => store.activeTask);

const completedCount = computed(() => {
  if (!task.value || !task.value.checklist) return 0;
  return task.value.checklist.filter(i => i.done).length;
});
</script>
