<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import {
  ArrowLeft,
  Check,
  Copy,
  FileCode,
  CheckCircle2,
  Bot,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Terminal,
  Layers,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
  ShieldAlert
} from 'lucide-vue-next';
import { useDocsStore } from '../stores/docsStore';

const store = useDocsStore();
const task = computed(() => store.activeTask);

const copiedPath = ref(false);
const copiedTaskId = ref(false);
const copiedCode = ref(false);
const copiedReport = ref(false);

const completedCount = computed(() => {
  if (!task.value || !task.value.checklist) return 0;
  return task.value.checklist.filter(c => c.done).length;
});

const completionPercentage = computed(() => {
  if (!task.value || !task.value.checklist || task.value.checklist.length === 0) return 0;
  return Math.round((completedCount.value / task.value.checklist.length) * 100);
});

// Keydown handler: Escape to close, Alt+Left / Alt+Right to navigate
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    store.closeTask();
  } else if (e.altKey && e.key === 'ArrowLeft') {
    store.prevTask();
  } else if (e.altKey && e.key === 'ArrowRight') {
    store.nextTask();
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});

function copyFilePath() {
  if (!task.value) return;
  navigator.clipboard.writeText(task.value.codeFile);
  copiedPath.value = true;
  store.showToast(`Path file ${task.value.codeFile} disalin ke clipboard!`);
  setTimeout(() => { copiedPath.value = false; }, 2000);
}

function copyTaskId() {
  if (!task.value) return;
  navigator.clipboard.writeText(task.value.id);
  copiedTaskId.value = true;
  store.showToast(`Task ID ${task.value.id} disalin!`);
  setTimeout(() => { copiedTaskId.value = false; }, 2000);
}

function copyCode() {
  if (!task.value || !task.value.codeSnippet) return;
  navigator.clipboard.writeText(task.value.codeSnippet);
  copiedCode.value = true;
  store.showToast('Kontrak kode berhasil disalin!');
  setTimeout(() => { copiedCode.value = false; }, 2000);
}

function copyPaijoReport() {
  if (!task.value) return;
  const tpl = `Lapor Paijo:
- Pelaksana: ${task.value.handoverTo || task.value.division}
- Task ID: ${task.value.id}
- Judul: ${task.value.title}
- Status: ONGOING (100% Aktif)
- Progress Checklist: ${completedCount.value}/${task.value.checklist?.length || 0} (${completionPercentage.value}%)
- Service: ${task.value.service} (${task.value.serviceGroup})
- Target File: ${task.value.codeFile}
- Catatan Integrasi: Sesuai panduan arsitektur artikel docs.`;

  navigator.clipboard.writeText(tpl);
  copiedReport.value = true;
  store.showToast('Template laporan Paijo AI berhasil disalin!');
  setTimeout(() => { copiedReport.value = false; }, 2000);
}

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
</script>

<template>
  <div v-if="task" class="article-reader-page fade-in-section">
    <!-- 1. Reader Navigation Top Bar -->
    <div class="reader-top-action-bar">
      <!-- Left: Back Button & Breadcrumbs -->
      <div class="reader-breadcrumb-nav">
        <button class="btn-reader-back" @click="store.closeTask()" title="Kembali ke Papan Tugas (Esc)">
          <ArrowLeft :size="14" />
          <span>Kembali ke Papan Tugas</span>
        </button>
        <span class="reader-crumb-divider">/</span>
        <span class="reader-crumb-module" @click="store.closeTask()">
          {{ store.groupingMode === 'division' ? 'Tugas per Divisi' : 'Tugas per Service' }}
        </span>
        <span class="reader-crumb-divider">/</span>
        <span class="reader-crumb-active" style="font-family: 'JetBrains Mono', monospace;">
          {{ task.id }}
        </span>
      </div>

      <!-- Right: Action Buttons & Navigation -->
      <div class="reader-quick-actions">
        <!-- Distraction-Free Toggle -->
        <button
          class="btn-reader-action"
          @click="store.toggleReaderSidebar()"
          :title="store.isReaderSidebarHidden ? 'Tampilkan Sidebar Navigasi' : 'Sembunyikan Sidebar untuk Mode Baca Penuh'"
        >
          <PanelLeftOpen v-if="store.isReaderSidebarHidden" :size="13" />
          <PanelLeftClose v-else :size="13" />
          <span>{{ store.isReaderSidebarHidden ? 'Buka Sidebar' : 'Mode Fokus' }}</span>
        </button>

        <!-- Copy Task ID -->
        <button class="btn-reader-action" @click="copyTaskId()" title="Salin Task ID">
          <Check v-if="copiedTaskId" :size="13" color="#059669" />
          <Copy v-else :size="13" />
          <span>{{ copiedTaskId ? 'Tersalin' : 'Salin ID' }}</span>
        </button>

        <!-- Lapor Paijo Button -->
        <button class="btn-reader-action" @click="copyPaijoReport()" title="Salin Format Laporan ke Paijo AI">
          <Check v-if="copiedReport" :size="13" color="#059669" />
          <Bot v-else :size="13" color="#2563eb" />
          <span>{{ copiedReport ? 'Laporan Tersalin' : 'Lapor Paijo' }}</span>
        </button>

        <!-- Previous / Next Task Navigation -->
        <div style="display: flex; align-items: center; gap: 4px; border-left: 1px solid #e2e8f0; padding-left: 8px; margin-left: 4px;">
          <button
            class="btn-reader-action"
            @click="store.prevTask()"
            title="Task Sebelumnya (Alt + Panah Kiri)"
            style="padding: 6px 10px;"
          >
            <ChevronLeft :size="14" />
            <span>Sebelumnya</span>
          </button>
          <button
            class="btn-reader-action"
            @click="store.nextTask()"
            title="Task Selanjutnya (Alt + Panah Kanan)"
            style="padding: 6px 10px;"
          >
            <span>Selanjutnya</span>
            <ChevronRight :size="14" />
          </button>
        </div>
      </div>
    </div>

    <!-- 2. Editorial Article Hero Banner -->
    <div class="reader-page-hero" style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);">
      <div class="reader-hero-decor-grid"></div>

      <!-- Watermark Background Glyph -->
      <div style="position: absolute; right: 28px; bottom: -15px; opacity: 0.05; color: #ffffff; pointer-events: none;">
        <Layers :size="160" />
      </div>

      <div class="reader-hero-inner">
        <!-- Badges Row -->
        <div class="reader-hero-badges">
          <span class="nav-badge" style="font-family: 'JetBrains Mono', monospace; font-size: 0.78rem; font-weight: 700; background: rgba(255, 255, 255, 0.12); color: #ffffff; border-color: rgba(255, 255, 255, 0.2);">
            {{ task.id }}
          </span>
          <span class="nav-badge" style="background: rgba(37, 99, 235, 0.25); color: #93c5fd; border-color: rgba(147, 197, 253, 0.3); font-weight: 700;">
            {{ task.category }}
          </span>
          <span
            class="task-priority-chip"
            :class="`priority-${task.priority.toLowerCase()}`"
            style="box-shadow: 0 1px 4px rgba(0,0,0,0.2);"
          >
            PRIORITAS: {{ task.priority }}
          </span>
          <span class="nav-badge" style="background: rgba(245, 158, 11, 0.15); color: #fde68a; border-color: rgba(253, 230, 138, 0.3);">
            <span class="mini-status-dot running" style="margin-right: 4px;"></span>
            100% ONGOING SPRINT
          </span>
          <span v-if="task.phase" class="nav-badge" style="background: rgba(255, 255, 255, 0.08); color: #cbd5e1; border-color: rgba(255, 255, 255, 0.15);">
            FASE: {{ task.phase }}
          </span>
        </div>

        <!-- Large Editorial Title -->
        <h1 class="reader-page-title" style="margin-bottom: 12px; font-size: 1.85rem; line-height: 1.3;">
          {{ task.title }}
        </h1>

        <!-- Hero Subtitle / Lead Paragraph -->
        <p style="color: #cbd5e1; font-size: 0.96rem; line-height: 1.6; margin: 0 0 24px 0; max-width: 820px;">
          {{ task.lead }}
        </p>

        <!-- Meta Author & Handover Strip -->
        <div class="reader-hero-meta-row">
          <!-- Personil Profiles -->
          <div class="reader-author-profile">
            <div class="author-avatar-large" style="background: linear-gradient(135deg, #2563eb, #1d4ed8);">
              RP
            </div>
            <div class="author-info-group">
              <div class="author-primary-name" style="display: flex; align-items: center; gap: 6px;">
                <span>Perancang Awal: Rizal Pratama</span>
                <CheckCircle2 :size="13" color="#38bdf8" />
              </div>
              <div class="author-secondary-sub">
                <span>DevOps & Security Lead</span>
                <span class="sub-sep">•</span>
                <span style="color: #93c5fd; font-weight: 700;">Handover ke: {{ task.handoverTo || task.division }}</span>
              </div>
            </div>
          </div>

          <!-- Hero Metrics Strips -->
          <div class="reader-hero-metrics-strip">
            <div class="hero-metric-item">
              <CheckCircle2 :size="13" style="color: #10b981;" />
              <span class="metric-num">{{ completedCount }}/{{ task.checklist.length }}</span>
              <span class="metric-label">Checklist ({{ completionPercentage }}%)</span>
            </div>
            <div class="hero-metric-item">
              <Terminal :size="13" style="color: #38bdf8;" />
              <span class="metric-num">{{ task.serviceGroup }}</span>
              <span class="metric-label">{{ task.codeLang }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 3. 2-Column Article Reader Layout Grid -->
    <div class="reader-layout-grid">
      <!-- MAIN ARTICLE BODY (LEFT COLUMN) -->
      <main class="reader-main-content">
        <!-- Section 1: File Reference Callout -->
        <div id="section-file" class="reader-edge-callout">
          <div class="callout-icon-box">
            <FileCode :size="18" />
          </div>
          <div class="callout-text-box">
            <span class="callout-title">KONTRAK FILE SUMBER / TARGET MODUL:</span>
            <span class="callout-url" :title="task.codeFile">{{ task.codeFile }}</span>
          </div>
          <button
            class="btn-copy-callout"
            @click="copyFilePath()"
            :title="copiedPath ? 'Tersalin!' : 'Salin Path File'"
          >
            <Check v-if="copiedPath" :size="14" color="#059669" />
            <Copy v-else :size="14" />
          </button>
        </div>

        <!-- Section 2: Interactive Checklist (Database Persisted!) -->
        <section id="section-checklist" style="margin-bottom: 34px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #f1f5f9;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <CheckCircle2 :size="18" style="color: #059669;" />
              <h2 style="margin: 0; font-size: 1.15rem; font-weight: 800; color: #0f172a; border: none; padding: 0;">
                Checklist Interaktif Tugas (Sinkronisasi Database Real-Time)
              </h2>
            </div>
            <span class="nav-badge badge-primary">
              {{ completedCount }} / {{ task.checklist.length }} Selesai ({{ completionPercentage }}%)
            </span>
          </div>

          <p style="font-size: 0.84rem; color: #64748b; margin: 0 0 14px 0;">
            Klik setiap item untuk mencentang status. Perubahan langsung tersimpan ke backend PostgreSQL & BFF:
          </p>

          <!-- Interactive Items List -->
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <div
              v-for="(item, idx) in task.checklist"
              :key="idx"
              style="display: flex; align-items: flex-start; gap: 12px; padding: 12px 14px; border-radius: 9px; border: 1px solid #e2e8f0; cursor: pointer; transition: all 0.15s ease;"
              :style="{
                background: item.done ? '#f0fdf4' : '#ffffff',
                borderColor: item.done ? '#bbf7d0' : '#e2e8f0',
                boxShadow: item.done ? 'none' : '0 1px 2px rgba(15,23,42,0.03)'
              }"
              @click="store.toggleChecklistItem(task.id, idx)"
            >
              <input
                type="checkbox"
                :checked="item.done"
                style="margin-top: 3px; cursor: pointer; accent-color: #059669; width: 17px; height: 17px;"
                @click.stop="store.toggleChecklistItem(task.id, idx)"
              />
              <div style="flex: 1; font-size: 0.88rem; line-height: 1.5;" :style="{ color: item.done ? '#15803d' : '#1e293b' }">
                <span v-if="item.done" style="font-weight: 800; margin-right: 6px; color: #16a34a;">[x] ✓ SELESAI:</span>
                <span v-else style="font-weight: 800; margin-right: 6px; color: #b45309;">[ ] ⏳ ONGOING:</span>
                <span>{{ item.text }}</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Section 3: Technical Logic Flow -->
        <section v-if="task.flowDesc" id="section-logic" style="margin-bottom: 34px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #f1f5f9;">
            <Terminal :size="17" style="color: #2563eb;" />
            <h2 style="margin: 0; font-size: 1.15rem; font-weight: 800; color: #0f172a; border: none; padding: 0;">
              Alur Logika & Mekanisme Teknis
            </h2>
          </div>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px 18px; color: #334155; font-size: 0.88rem; line-height: 1.65;">
            {{ task.flowDesc }}
          </div>
        </section>

        <!-- Section 4: Code Implementation Contract -->
        <section v-if="task.codeSnippet" id="section-code" style="margin-bottom: 34px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #f1f5f9;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <FileCode :size="17" style="color: #2563eb;" />
              <h2 style="margin: 0; font-size: 1.15rem; font-weight: 800; color: #0f172a; border: none; padding: 0;">
                Kontrak Kode Implementasi ({{ task.codeLang }})
              </h2>
            </div>
            <button class="btn-reader-action" @click="copyCode()" title="Salin Kode">
              <Check v-if="copiedCode" :size="13" color="#059669" />
              <Copy v-else :size="13" />
              <span>{{ copiedCode ? 'Tersalin' : 'Salin Kode' }}</span>
            </button>
          </div>

          <!-- Code Card Frame with macOS dots -->
          <div class="reader-code-card">
            <div class="code-card-header">
              <div class="code-header-left">
                <div class="code-window-dots">
                  <span class="code-dot red"></span>
                  <span class="code-dot yellow"></span>
                  <span class="code-dot green"></span>
                </div>
                <div class="code-file-tab">
                  <FileCode :size="12" class="code-file-icon" />
                  <span class="code-filename">{{ task.codeFile }}</span>
                </div>
              </div>
              <div class="code-header-right">
                <span class="code-lang-badge">{{ task.codeLang }}</span>
              </div>
            </div>

            <div class="code-editor-viewport">
              <pre class="code-pre"><code>{{ task.codeSnippet }}</code></pre>
            </div>

            <div class="code-card-footer">
              <div class="code-footer-stat">
                <span class="footer-dot-live"></span>
                <span>Production Contract Spec</span>
              </div>
              <span class="code-footer-engine">HeroCMS Architecture Engine</span>
            </div>
          </div>
        </section>

        <!-- Section 5: Definition of Done (DoD) Criteria -->
        <section v-if="task.dod" id="section-dod" style="margin-bottom: 34px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #f1f5f9;">
            <ShieldAlert :size="17" style="color: #059669;" />
            <h2 style="margin: 0; font-size: 1.15rem; font-weight: 800; color: #0f172a; border: none; padding: 0;">
              Kriteria Definition of Done (DoD) Wajib
            </h2>
          </div>

          <div class="reader-info-callout" style="margin: 0;">
            <CheckCircle2 :size="18" class="info-callout-icon" />
            <div style="flex: 1;">
              <div style="font-weight: 800; margin-bottom: 6px; color: #166534; font-size: 0.92rem;">
                Syarat Kualitas Wajib Sebelum Disetujui Merge:
              </div>
              <p v-if="typeof task.dod === 'string'" style="margin: 0; font-size: 0.86rem; line-height: 1.55; color: #14532d;">
                {{ task.dod }}
              </p>
              <ul v-else-if="Array.isArray(task.dod)" style="margin: 0; padding-left: 20px; font-size: 0.86rem; line-height: 1.6; color: #14532d;">
                <li v-for="(criterion, cIdx) in task.dod" :key="cIdx" style="margin-bottom: 3px;">
                  {{ criterion }}
                </li>
              </ul>
            </div>
          </div>
        </section>

        <!-- Section 6: Catatan Paijo AI -->
        <section v-if="task.aiNotes" id="section-paijo" style="margin-bottom: 24px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #f1f5f9;">
            <Bot :size="17" style="color: #2563eb;" />
            <h2 style="margin: 0; font-size: 1.15rem; font-weight: 800; color: #0f172a; border: none; padding: 0;">
              Catatan Arsitektur & Review Paijo AI (Lead PM & QA/QC)
            </h2>
          </div>

          <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-left: 4px solid #2563eb; padding: 16px 18px; border-radius: 9px;">
            <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 6px;">
              <Sparkles :size="14" color="#2563eb" />
              <strong style="color: #1e40af; font-size: 0.88rem;">Instruksi Khusus untuk Assignee:</strong>
            </div>
            <p style="margin: 0; font-size: 0.86rem; color: #1e3a8a; line-height: 1.6;">
              {{ task.aiNotes }}
            </p>
          </div>
        </section>

        <!-- Bottom Sequential Navigation -->
        <div class="reader-pagination-bar">
          <button class="btn-pagination-nav" @click="store.prevTask()">
            <ChevronLeft :size="20" style="color: #64748b;" />
            <div class="nav-text">
              <span class="nav-dir">Tugas Sebelumnya</span>
              <span class="nav-title">Alt + Panah Kiri</span>
            </div>
          </button>

          <div class="pagination-spacer"></div>

          <button class="btn-pagination-nav next" @click="store.nextTask()">
            <div class="nav-text">
              <span class="nav-dir">Tugas Selanjutnya</span>
              <span class="nav-title">Alt + Panah Kanan</span>
            </div>
            <ChevronRight :size="20" style="color: #64748b;" />
          </button>
        </div>
      </main>

      <!-- SIDEBAR INSPECTOR (RIGHT COLUMN) -->
      <aside class="reader-sidebar-inspector">
        <!-- Inspector Card 1: Ringkasan Tugas & Handover -->
        <div class="inspector-card">
          <h4 class="inspector-title">
            <UserCheck :size="15" color="#2563eb" />
            <span>Spesifikasi & Handover</span>
          </h4>
          <div class="inspector-specs-list">
            <div class="spec-row">
              <span class="spec-k">Task ID:</span>
              <code class="spec-code">{{ task.id }}</code>
            </div>
            <div class="spec-row">
              <span class="spec-k">Status:</span>
              <span class="spec-live-pill">
                <span class="mini-status-dot running"></span>
                100% ONGOING
              </span>
            </div>
            <div class="spec-row">
              <span class="spec-k">Prioritas:</span>
              <span class="nav-badge" :class="`badge-${task.priority.toLowerCase() === 'critical' ? 'danger' : 'primary'}`">
                {{ task.priority }}
              </span>
            </div>
            <div class="spec-row">
              <span class="spec-k">Perancang Awal:</span>
              <span class="spec-v">Rizal Pratama (✓ Selesai)</span>
            </div>
            <div class="spec-row">
              <span class="spec-k">Handover Ke:</span>
              <strong style="color: #2563eb;">{{ task.handoverTo || task.division }}</strong>
            </div>
            <div class="spec-row">
              <span class="spec-k">Microservice:</span>
              <span class="spec-v">{{ task.service }}</span>
            </div>
            <div class="spec-row">
              <span class="spec-k">Bahasa:</span>
              <code class="spec-code">{{ task.codeLang }}</code>
            </div>
          </div>
        </div>

        <!-- Inspector Card 2: Quick Jump Table of Contents -->
        <div class="inspector-card">
          <h4 class="inspector-title">
            <Layers :size="15" color="#059669" />
            <span>Daftar Isi Artikel</span>
          </h4>
          <nav style="display: flex; flex-direction: column; gap: 6px; font-size: 0.82rem;">
            <a href="#section-file" @click.prevent="scrollToSection('section-file')" style="color: #475569; text-decoration: none; padding: 4px 0; display: flex; align-items: center; gap: 6px;">
              <span>• Kontrak File Sumber</span>
            </a>
            <a href="#section-checklist" @click.prevent="scrollToSection('section-checklist')" style="color: #475569; text-decoration: none; padding: 4px 0; display: flex; align-items: center; gap: 6px;">
              <span>• Checklist Interaktif (DB)</span>
            </a>
            <a v-if="task.flowDesc" href="#section-logic" @click.prevent="scrollToSection('section-logic')" style="color: #475569; text-decoration: none; padding: 4px 0; display: flex; align-items: center; gap: 6px;">
              <span>• Alur Logika Teknis</span>
            </a>
            <a v-if="task.codeSnippet" href="#section-code" @click.prevent="scrollToSection('section-code')" style="color: #475569; text-decoration: none; padding: 4px 0; display: flex; align-items: center; gap: 6px;">
              <span>• Kontrak Kode Implementasi</span>
            </a>
            <a v-if="task.dod" href="#section-dod" @click.prevent="scrollToSection('section-dod')" style="color: #475569; text-decoration: none; padding: 4px 0; display: flex; align-items: center; gap: 6px;">
              <span>• Kriteria DoD Wajib</span>
            </a>
            <a v-if="task.aiNotes" href="#section-paijo" @click.prevent="scrollToSection('section-paijo')" style="color: #475569; text-decoration: none; padding: 4px 0; display: flex; align-items: center; gap: 6px;">
              <span>• Catatan Review Paijo AI</span>
            </a>
          </nav>
        </div>

        <!-- Inspector Card 3: Integrasi Paijo AI Reporter -->
        <div class="inspector-card" style="background: #f8fafc;">
          <h4 class="inspector-title">
            <Bot :size="15" color="#2563eb" />
            <span>Pelaporan Sprint Paijo</span>
          </h4>
          <p style="font-size: 0.78rem; color: #64748b; line-height: 1.5; margin: 0 0 12px 0;">
            Salin ringkasan progres task ini dengan 1 klik untuk dilaporkan ke Lead PM Paijo AI.
          </p>
          <button
            class="btn-modal-confirm"
            style="width: 100%; justify-content: center; font-size: 0.82rem; padding: 8px 12px;"
            @click="copyPaijoReport()"
          >
            <Check v-if="copiedReport" :size="14" />
            <Bot v-else :size="14" />
            <span>{{ copiedReport ? 'Laporan Disalin!' : 'Salin Laporan Paijo' }}</span>
          </button>
        </div>
      </aside>
    </div>
  </div>
</template>
