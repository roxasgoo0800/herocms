<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  GitBranch,
  Clock,
  Users,
  AlertTriangle,
  Terminal,
  Copy,
  ChevronRight,
  CheckCircle2
} from 'lucide-vue-next';
import { useDocsStore } from '../stores/docsStore';

const store = useDocsStore();
const selectedJourneyId = ref(store.journeys[0]?.id || 'JRN-01');

const currentJourney = computed(() => {
  return store.journeys.find(j => j.id === selectedJourneyId.value) || store.journeys[0];
});

const selectJourney = (id: string) => {
  selectedJourneyId.value = id;
};

const copyCli = (cmd: string) => {
  navigator.clipboard.writeText(cmd);
  store.showToast('Perintah CLI berhasil disalin ke clipboard');
};
</script>

<template>
  <div class="system-journey-module fade-in-section">
    <!-- Category & Journey Quick Selector Tabs -->
    <div class="category-filter-strip" style="margin-bottom: 20px;">
      <button 
        v-for="jrn in store.journeys" 
        :key="jrn.id"
        class="category-chip"
        :class="{ active: selectedJourneyId === jrn.id }"
        @click="selectJourney(jrn.id)"
      >
        <span style="font-family: monospace; font-weight: 700;">{{ jrn.id }}</span>
        <span>{{ jrn.badge }}</span>
      </button>
    </div>

    <!-- Active Journey Canvas Card -->
    <div v-if="currentJourney" class="journey-viewer-shell" style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 24px; box-shadow: 0 1px 3px rgba(15, 23, 42, 0.05);">
      <!-- Journey Header -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 18px; flex-wrap: wrap; gap: 12px;">
        <div style="max-width: 780px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; flex-wrap: wrap;">
            <span class="task-id-chip">{{ currentJourney.id }}</span>
            <span class="nav-badge badge-primary">{{ currentJourney.category.toUpperCase() }}</span>
            <span class="nav-badge badge-success">{{ currentJourney.badge }}</span>
          </div>
          <h2 style="font-size: 1.25rem; font-weight: 800; color: #0f172a; margin: 0 0 8px; letter-spacing: -0.02em;">
            {{ currentJourney.title }}
          </h2>
          <p style="font-size: 0.88rem; color: #475569; margin: 0; line-height: 1.6;">
            {{ currentJourney.summary }}
          </p>
        </div>

        <!-- Latency SLA Pill -->
        <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 12px 18px; text-align: right; min-width: 170px;">
          <div style="font-size: 0.72rem; font-weight: 700; color: #2563eb; text-transform: uppercase; display: flex; align-items: center; justify-content: flex-end; gap: 4px;">
            <Clock :size="13" />
            <span>Target SLA Latensi</span>
          </div>
          <div style="font-size: 1.2rem; font-weight: 800; color: #1e3a8a; margin-top: 4px;">
            {{ currentJourney.latencySla }}
          </div>
        </div>
      </div>

      <!-- Participating Actors Sequence Strip -->
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px 16px; margin-bottom: 24px;">
        <div style="font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
          <Users :size="14" color="#64748b" />
          <span>Aktor & Komponen yang Terlibat dalam Alur:</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
          <template v-for="(actor, aIdx) in currentJourney.actors" :key="aIdx">
            <span class="bp-req-pill" style="font-weight: 700; color: #0f172a; background: #ffffff; border: 1px solid #cbd5e1;">
              {{ actor }}
            </span>
            <ChevronRight v-if="aIdx < currentJourney.actors.length - 1" :size="14" color="#94a3b8" />
          </template>
        </div>
      </div>

      <!-- Connected Step Pipeline (Executive Flowchart) -->
      <div style="margin-bottom: 28px;">
        <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
          <GitBranch :size="17" color="#2563eb" />
          <span>Pipeline Eksekusi Bertahap ({{ currentJourney.steps.length }} Langkah Otonom)</span>
        </h3>

        <div class="flowchart-pipeline-container">
          <div 
            v-for="(step, sIdx) in currentJourney.steps" 
            :key="step.stepNum"
            class="pipeline-step-item step-emerald"
          >
            <!-- Circular Pin Indicator & Connector Line -->
            <div class="pipeline-step-badge">
              <span class="pipeline-step-num">{{ step.stepNum }}</span>
              <div v-if="sIdx < currentJourney.steps.length - 1" class="pipeline-step-line"></div>
            </div>

            <!-- Step Card Content -->
            <div class="pipeline-step-body">
              <div class="pipeline-step-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-wrap: wrap; gap: 8px;">
                <span class="pipeline-step-tag" style="font-size: 0.95rem; font-weight: 800; color: #0f172a;">
                  {{ step.action }}
                </span>
                <span class="nav-badge badge-primary" style="font-size: 0.72rem;">
                  Aktor: {{ step.actor }}
                </span>
              </div>

              <!-- Technical Execution Detail -->
              <div style="font-size: 0.84rem; color: #475569; line-height: 1.55; margin-bottom: 8px;">
                <strong>Detail Teknis:</strong> {{ step.technicalDetail }}
              </div>

              <!-- Outcome Tag -->
              <div style="display: flex; align-items: flex-start; gap: 6px; font-size: 0.8rem; color: #047857; background: #ecfdf5; border: 1px solid #d1fae5; padding: 6px 10px; border-radius: 6px;">
                <CheckCircle2 :size="14" color="#059669" style="flex-shrink: 0; margin-top: 1px;" />
                <span><strong>Hasil Akhir:</strong> {{ step.outcome }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Failure Modes & Auto-Recovery Matrix -->
      <div style="margin-bottom: 28px;" v-if="currentJourney.failureModes && currentJourney.failureModes.length > 0">
        <h3 style="font-size: 1rem; font-weight: 700; color: #9a3412; margin-bottom: 14px; display: flex; align-items: center; gap: 8px;">
          <AlertTriangle :size="17" color="#ea580c" />
          <span>Mitigasi Modus Kegagalan & Pemulihan Mandiri (Self-Healing)</span>
        </h3>

        <div style="display: flex; flex-direction: column; gap: 10px;">
          <div 
            v-for="(fail, fIdx) in currentJourney.failureModes" 
            :key="fIdx"
            style="background: #fff7ed; border: 1px solid #ffedd5; border-left: 4px solid #ea580c; border-radius: 0 8px 8px 0; padding: 12px 16px;"
          >
            <div style="font-size: 0.85rem; font-weight: 700; color: #9a3412; margin-bottom: 4px;">
              ⚠️ Potensi Masalah: {{ fail.issue }}
            </div>
            <div style="font-size: 0.8rem; color: #7c2d12; margin-bottom: 4px;">
              <strong>Indikator Deteksi:</strong> {{ fail.detection }}
            </div>
            <div style="font-size: 0.8rem; color: #065f46; background: #ecfdf5; padding: 6px 10px; border-radius: 6px; display: inline-block;">
              <strong>🛡️ Pemulihan Otomatis:</strong> {{ fail.autoRecovery }}
            </div>
          </div>
        </div>
      </div>

      <!-- Verification CLI Box -->
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <h4 style="font-size: 0.82rem; font-weight: 700; color: #64748b; text-transform: uppercase; margin: 0; display: flex; align-items: center; gap: 6px;">
            <Terminal :size="14" color="#64748b" />
            <span>Perintah Uji & Verifikasi Lapangan (CLI):</span>
          </h4>
          <button class="btn-read-sop" style="height: 28px; font-size: 0.75rem;" @click="copyCli(currentJourney.verificationCli)">
            <Copy :size="12" />
            <span>Salin Perintah</span>
          </button>
        </div>
        <pre class="spec-code" style="padding: 12px 16px; border-radius: 8px; font-size: 0.82rem; background: #0f172a; color: #f8fafc; overflow-x: auto;">{{ currentJourney.verificationCli }}</pre>
      </div>
    </div>
  </div>
</template>
