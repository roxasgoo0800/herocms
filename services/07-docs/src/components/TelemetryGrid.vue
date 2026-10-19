<script setup lang="ts">
import { FolderKanban, Clock, BookOpen, Terminal } from 'lucide-vue-next';
import { useDocsStore } from '../stores/docsStore';

const store = useDocsStore();
</script>

<template>
  <section class="stats-overview-grid" style="margin-bottom: 24px;">
    <!-- 1. Total Tasks -->
    <div class="telemetry-card accent-blue">
      <div class="telemetry-corner-watermark blue"><FolderKanban :size="58" /></div>
      <div class="telemetry-top">
        <span class="telemetry-label">TOTAL TUGAS BISNIS & ARSITEKTUR</span>
      </div>
      <div class="telemetry-val">
        {{ store.telemetry.totalTasks }}
        <span class="badge-growth-pill">6 Services</span>
      </div>
      <div class="telemetry-sub ready-state">
        <span class="pulse-mini-dot"></span>
        <span>12 Modul Studio + BFF + QA Suite</span>
      </div>
    </div>

    <!-- 2. Ongoing Status -->
    <div class="telemetry-card accent-amber">
      <div class="telemetry-corner-watermark amber"><Clock :size="58" /></div>
      <div class="telemetry-top">
        <span class="telemetry-label">STATUS SPRINT PROGRES</span>
      </div>
      <div class="telemetry-val">
        100%
        <span class="badge-warning" style="font-size: 0.72rem; padding: 2px 7px; border-radius: 6px; font-weight: 700;">Ongoing</span>
      </div>
      <div class="telemetry-sub">
        <span>Tampilan selesai, real proses berjalan</span>
      </div>
    </div>

    <!-- 3. Architecture Blueprints -->
    <div class="telemetry-card accent-emerald">
      <div class="telemetry-corner-watermark emerald"><BookOpen :size="58" /></div>
      <div class="telemetry-top">
        <span class="telemetry-label">BLUEPRINT ARSITEKTUR SISTEM</span>
      </div>
      <div class="telemetry-val">
        {{ store.telemetry.totalBlueprints }}
        <span class="badge-online">Standar</span>
      </div>
      <div class="telemetry-sub">
        <span>13 Panduan operasional + CLI command</span>
      </div>
    </div>

    <!-- 4. Enterprise SOPs -->
    <div class="telemetry-card accent-sky">
      <div class="telemetry-corner-watermark sky"><Terminal :size="58" /></div>
      <div class="telemetry-top">
        <span class="telemetry-label">SOP & RUNBOOK ENTERPRISE</span>
      </div>
      <div class="telemetry-val">
        {{ store.telemetry.totalSops }}
        <span class="telemetry-denom">Runbooks</span>
      </div>
      <div class="telemetry-sub">
        <span>Git branching, DoD, pentest, RLS isolasi</span>
      </div>
    </div>
  </section>
</template>
