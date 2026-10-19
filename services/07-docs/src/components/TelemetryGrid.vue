<template>
  <section class="stats-overview-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 1rem; margin-bottom: 1.75rem;">
    <!-- Card 1: Total Tasks -->
    <div class="telemetry-card" style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.25rem; box-shadow: 0 1px 3px rgba(15, 23, 42, 0.05);">
      <div style="font-size: 0.8rem; font-weight: 600; color: #64748b; margin-bottom: 0.4rem;">Total Task Bisnis & Arsitektur</div>
      <div style="display: flex; align-items: baseline; justify-content: space-between;">
        <span style="font-size: 1.9rem; font-weight: 800; color: #0f172a; font-family: 'JetBrains Mono', monospace;">{{ store.telemetry.totalTasks }}</span>
        <span style="background: #eff6ff; color: #2563eb; font-size: 0.75rem; font-weight: 700; padding: 0.2rem 0.55rem; border-radius: 6px; border: 1px solid #bfdbfe;">
          6 Services
        </span>
      </div>
      <div style="font-size: 0.78rem; color: #94a3b8; margin-top: 0.4rem;">12 Modul Studio + BFF + QA Suite</div>
    </div>

    <!-- Card 2: 100% Ongoing Status -->
    <div class="telemetry-card" style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.25rem; box-shadow: 0 1px 3px rgba(15, 23, 42, 0.05);">
      <div style="font-size: 0.8rem; font-weight: 600; color: #64748b; margin-bottom: 0.4rem;">Status Seluruh Pekerjaan</div>
      <div style="display: flex; align-items: baseline; justify-content: space-between;">
        <span style="font-size: 1.9rem; font-weight: 800; color: #b45309; font-family: 'JetBrains Mono', monospace;">100%</span>
        <span style="background: #fffbeb; color: #b45309; font-size: 0.75rem; font-weight: 700; padding: 0.2rem 0.55rem; border-radius: 6px; border: 1px solid #fde68a;">
          Ongoing
        </span>
      </div>
      <div style="font-size: 0.78rem; color: #94a3b8; margin-top: 0.4rem;">Tampilan selesai, real proses berjalan</div>
    </div>

    <!-- Card 3: Microservices Coverage -->
    <div class="telemetry-card" style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.25rem; box-shadow: 0 1px 3px rgba(15, 23, 42, 0.05);">
      <div style="font-size: 0.8rem; font-weight: 600; color: #64748b; margin-bottom: 0.4rem;">Cakupan Microservices</div>
      <div style="display: flex; align-items: baseline; justify-content: space-between;">
        <span style="font-size: 1.9rem; font-weight: 800; color: #2563eb; font-family: 'JetBrains Mono', monospace;">{{ store.telemetry.totalServices }}</span>
        <span style="background: #ecfdf5; color: #059669; font-size: 0.75rem; font-weight: 700; padding: 0.2rem 0.55rem; border-radius: 6px; border: 1px solid #d1fae5;">
          Terisolasi
        </span>
      </div>
      <div style="font-size: 0.78rem; color: #94a3b8; margin-top: 0.4rem;">Admin, Studio, Infra, Marketing, AI, Mobile</div>
    </div>

    <!-- Card 4: Team Members & Handover -->
    <div class="telemetry-card" style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.25rem; box-shadow: 0 1px 3px rgba(15, 23, 42, 0.05);">
      <div style="font-size: 0.8rem; font-weight: 600; color: #64748b; margin-bottom: 0.4rem;">Tim Pelaksana & Handover</div>
      <div style="display: flex; align-items: baseline; justify-content: space-between;">
        <span style="font-size: 1.9rem; font-weight: 800; color: #059669; font-family: 'JetBrains Mono', monospace;">{{ store.telemetry.totalMembers }}</span>
        <span style="background: #eff6ff; color: #2563eb; font-size: 0.75rem; font-weight: 700; padding: 0.2rem 0.55rem; border-radius: 6px; border: 1px solid #bfdbfe;">
          6 Personil
        </span>
      </div>
      <div style="font-size: 0.78rem; color: #94a3b8; margin-top: 0.4rem;">Rizal, Andalusia, Irgi, Risqi, Tyno & Paijo</div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useDocsStore } from '../stores/docsStore';

const store = useDocsStore();
</script>
