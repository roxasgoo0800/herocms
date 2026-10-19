<script setup lang="ts">
import { FolderKanban, FileText, ShieldCheck, GitBranch } from 'lucide-vue-next';
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
        <span class="badge-growth-pill">{{ store.telemetry.totalServices }} Services</span>
      </div>
      <div class="telemetry-sub ready-state">
        <span class="pulse-mini-dot"></span>
        <span>6 Divisi Tim Aktif • Sprint Ongoing</span>
      </div>
    </div>

    <!-- 2. PRD Microservices -->
    <div class="telemetry-card accent-amber">
      <div class="telemetry-corner-watermark amber"><FileText :size="58" /></div>
      <div class="telemetry-top">
        <span class="telemetry-label">SPESIFIKASI PRD LENGKAP</span>
      </div>
      <div class="telemetry-val">
        {{ store.telemetry.totalPrds }}
        <span class="badge-warning" style="font-size: 0.72rem; padding: 2px 7px; border-radius: 6px; font-weight: 700;">Layanan</span>
      </div>
      <div class="telemetry-sub">
        <span>Katalog 7 Microservice (01 - 07)</span>
      </div>
    </div>

    <!-- 3. Security Standards & Sandboxing -->
    <div class="telemetry-card accent-emerald">
      <div class="telemetry-corner-watermark emerald"><ShieldCheck :size="58" /></div>
      <div class="telemetry-top">
        <span class="telemetry-label">STANDAR KEAMANAN & SANDBOXING</span>
      </div>
      <div class="telemetry-val">
        {{ store.telemetry.totalSecurityPillars }}
        <span class="badge-online">Pilar</span>
      </div>
      <div class="telemetry-sub">
        <span>20 Pilar Keamanan + cgroups v2 Sandboxing</span>
      </div>
    </div>

    <!-- 4. System Journeys & Blueprints -->
    <div class="telemetry-card accent-sky">
      <div class="telemetry-corner-watermark sky"><GitBranch :size="58" /></div>
      <div class="telemetry-top">
        <span class="telemetry-label">ALUR KERJA SISTEM & BLUEPRINT</span>
      </div>
      <div class="telemetry-val">
        {{ store.telemetry.totalJourneys }}
        <span class="telemetry-denom">Alur</span>
      </div>
      <div class="telemetry-sub">
        <span>{{ store.telemetry.totalBlueprints }} Blueprint + {{ store.telemetry.totalSops }} SOP Runbooks</span>
      </div>
    </div>
  </section>
</template>

