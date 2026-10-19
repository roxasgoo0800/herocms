<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import {
  History,
  GitCommit,
  Sparkles,
  Tag,
  Calendar,
  Search,
  X,
  ShieldCheck,
  Zap,
  Wrench,
  CheckCircle2,
  UserCheck,
  Server
} from 'lucide-vue-next';
import { changelogReleases, microserviceVersions } from '../../data/changelog';
import type { ChangelogType } from '../../types/dashboard';

const searchQuery = ref('');
const selectedTypeFilter = ref<string>('all');
const selectedServiceFilter = ref<string>('all');
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

const dashboardCmsVersion = computed(() =>
  microserviceVersions.find(s => s.id === '02-dashboard-cms')?.version || 'v1.14.27'
);
const latestVersion = dashboardCmsVersion;
const totalReleasesCount = computed(() => changelogReleases.length);
const totalItemsCount = computed(() =>
  changelogReleases.reduce((acc, rel) => acc + (rel.items ? rel.items.length : 0), 0)
);

const filteredReleases = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  const typeFilter = selectedTypeFilter.value;
  const serviceFilter = selectedServiceFilter.value;

  return changelogReleases
    .filter(rel => {
      if (serviceFilter === 'all') return true;
      return rel.service === serviceFilter;
    })
    .map(rel => {
      const matchRelHeader =
        !q ||
        rel.version.toLowerCase().includes(q) ||
        rel.title.toLowerCase().includes(q) ||
        (rel.serviceName && rel.serviceName.toLowerCase().includes(q)) ||
        (rel.summary && rel.summary.toLowerCase().includes(q));

      const matchingItems = (rel.items || []).filter(item => {
        const matchType = typeFilter === 'all' || item.type === typeFilter;
        const matchItemQuery =
          !q ||
          (item.description && item.description.toLowerCase().includes(q)) ||
          (item.scope && item.scope.toLowerCase().includes(q)) ||
          (item.type && item.type.toLowerCase().includes(q));
        return matchType && (matchRelHeader || matchItemQuery);
      });

      if (matchingItems.length > 0) {
        return {
          ...rel,
          items: matchingItems
        };
      }
      return null;
    })
    .filter(Boolean) as typeof changelogReleases;
});

const getTypeLabel = (type: ChangelogType) => {
  switch (type) {
    case 'feature':
      return 'Fitur Baru';
    case 'improvement':
      return 'Peningkatan';
    case 'bugfix':
      return 'Perbaikan Bug';
    case 'security':
      return 'Keamanan';
    case 'performance':
      return 'Performa';
    default:
      return type;
  }
};

const getTypeIcon = (type: ChangelogType) => {
  switch (type) {
    case 'feature':
      return Sparkles;
    case 'improvement':
      return Zap;
    case 'bugfix':
      return Wrench;
    case 'security':
      return ShieldCheck;
    case 'performance':
      return Zap;
    default:
      return GitCommit;
  }
};
</script>

<template>
  <section class="fade-in-section">
    <!-- Row 1: Header Module & Search Filter -->
    <div class="page-intro-row">
      <div>
        <h1 class="page-title">Changelog & Catatan Rilis Sistem</h1>
        <p class="page-desc">
          Transparansi riwayat pengembangan platform, pembaruan versi minor, patch perbaikan bug, dan optimasi arsitektur.
        </p>
      </div>
      <div class="quota-quick-pills">
        <span class="pill-metric">Versi Aktif: <strong>{{ latestVersion }}</strong></span>
        <span class="pill-metric-highlight">Arsitektur: <strong>Semantic Versioning</strong></span>
      </div>
    </div>

    <!-- Row 2: Telemetry Metrics Cards -->
    <div class="stats-overview-grid">
      <div class="telemetry-card accent-blue">
        <div class="telemetry-corner-watermark blue"><Tag :size="58" /></div>
        <div class="telemetry-top">
          <span class="telemetry-label">VERSI DASHBOARD CMS</span>
        </div>
        <div class="telemetry-val">
          {{ dashboardCmsVersion }} <span class="badge-online">Produksi Stabil</span>
        </div>
        <div class="telemetry-sub ready-state">
          <span class="pulse-mini-dot"></span>
          <span>Zero Stale Cache • Instant Reload</span>
        </div>
      </div>

      <div class="telemetry-card accent-emerald">
        <div class="telemetry-corner-watermark emerald"><History :size="58" /></div>
        <div class="telemetry-top">
          <span class="telemetry-label">TOTAL RILIS TERTATA</span>
        </div>
        <div class="telemetry-val">
          {{ totalReleasesCount }} <span class="telemetry-denom">Versi Dirilis</span>
        </div>
        <div class="telemetry-sub">
          <span>Terdokumentasi per microservice</span>
        </div>
      </div>

      <div class="telemetry-card accent-purple">
        <div class="telemetry-corner-watermark purple"><GitCommit :size="58" /></div>
        <div class="telemetry-top">
          <span class="telemetry-label">TOTAL CATATAN PERUBAHAN</span>
        </div>
        <div class="telemetry-val">
          {{ totalItemsCount }} <span class="telemetry-denom">Catatan Log</span>
        </div>
        <div class="telemetry-sub">
          <span>Terdokumentasi otomatis dan transparan</span>
        </div>
      </div>

      <div class="telemetry-card accent-sky">
        <div class="telemetry-corner-watermark sky"><CheckCircle2 :size="58" /></div>
        <div class="telemetry-top">
          <span class="telemetry-label">INTEGRITAS REPOSITORY</span>
        </div>
        <div class="telemetry-val">
          100% <span class="badge-growth-pill">Terverifikasi</span>
        </div>
        <div class="telemetry-sub">
          <span>7 Microservices mandiri</span>
        </div>
      </div>
    </div>

    <!-- Row 2.5: Matriks Versi Independen Microservices (7 Layanan HeroCMS) -->
    <div class="pro-panel" style="margin-bottom: 24px; padding: 18px 20px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; flex-wrap: wrap; gap: 8px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <Server :size="16" color="#2563eb" />
          <h3 style="margin: 0; font-size: 0.98rem; font-weight: 800; color: #0f172a;">
            Matriks Versi Independen Microservices (7 Layanan HeroCMS)
          </h3>
        </div>
        <span class="nav-badge badge-primary">Versi Mandiri per Service</span>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 10px;">
        <div
          v-for="svc in microserviceVersions"
          :key="svc.id"
          class="pro-panel"
          style="padding: 10px 12px; border-radius: 8px; cursor: pointer; transition: all 0.15s ease;"
          :style="{
            borderColor: selectedServiceFilter === svc.id ? '#2563eb' : '#e2e8f0',
            background: selectedServiceFilter === svc.id ? '#eff6ff' : '#f8fafc'
          }"
          @click="selectedServiceFilter = selectedServiceFilter === svc.id ? 'all' : svc.id"
          :title="`Klik untuk filter changelog ${svc.name}`"
        >
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <code style="font-family: 'JetBrains Mono', monospace; font-size: 0.72rem; font-weight: 700; color: #334155;">{{ svc.id }}</code>
            <span class="nav-badge" :class="svc.badge === 'Latest' ? 'badge-primary' : 'badge-success'" style="font-size: 0.68rem; padding: 1px 6px;">
              {{ svc.version }}
            </span>
          </div>
          <div style="font-size: 0.82rem; font-weight: 700; color: #0f172a; line-height: 1.3;">
            {{ svc.name }}
          </div>
          <div style="font-size: 0.7rem; color: #64748b; margin-top: 2px;">
            PIC: {{ svc.leadPic }} • {{ svc.stack }}
          </div>
        </div>
      </div>
    </div>

    <!-- Filter & Search Toolbar (Unified HeroCMS Studio Layout) -->
    <div class="filter-toolbar" style="margin-bottom: 24px;">
      <div class="search-command-shell">
        <Search :size="15" class="search-lead-glyph" />
        <input
          ref="searchInputRef"
          v-model="searchQuery"
          type="text"
          placeholder="Cari versi (v1.x), modul, atau deskripsi log..."
          class="search-command-input"
        />
        <button v-if="searchQuery" class="btn-clear-search" @click="searchQuery = ''" title="Bersihkan">
          <X :size="13" />
        </button>
        <kbd class="shortcut-tag">⌘K</kbd>
      </div>

      <div class="segmented-filter-bar">
        <button
          type="button"
          class="segment-pill"
          :class="{ active: selectedServiceFilter === 'all' }"
          @click="selectedServiceFilter = 'all'"
        >
          <span>🌐 Semua Service (7)</span>
        </button>
        <button
          type="button"
          class="segment-pill"
          :class="{ active: selectedServiceFilter === '02-dashboard-cms' }"
          @click="selectedServiceFilter = '02-dashboard-cms'"
        >
          <span>02 Dashboard CMS</span>
        </button>
        <button
          type="button"
          class="segment-pill"
          :class="{ active: selectedServiceFilter === '07-docs' }"
          @click="selectedServiceFilter = '07-docs'"
        >
          <span>07 Docs Hub</span>
        </button>
      </div>
    </div>

    <div class="segmented-filter-bar" style="margin-bottom: 24px;">
      <button
        type="button"
        class="segment-pill"
        :class="{ active: selectedTypeFilter === 'all' }"
        @click="selectedTypeFilter = 'all'"
      >
        <span>Semua Tipe</span>
      </button>
      <button
        type="button"
        class="segment-pill"
        :class="{ active: selectedTypeFilter === 'feature' }"
        @click="selectedTypeFilter = 'feature'"
      >
        <Sparkles :size="12" />
        <span>Fitur Baru</span>
      </button>
      <button
        type="button"
        class="segment-pill"
        :class="{ active: selectedTypeFilter === 'bugfix' }"
        @click="selectedTypeFilter = 'bugfix'"
      >
        <Wrench :size="12" />
        <span>Perbaikan Bug</span>
      </button>
      <button
        type="button"
        class="segment-pill"
        :class="{ active: selectedTypeFilter === 'performance' }"
        @click="selectedTypeFilter = 'performance'"
      >
        <Zap :size="12" />
        <span>Performa</span>
      </button>
      <button
        type="button"
        class="segment-pill"
        :class="{ active: selectedTypeFilter === 'security' }"
        @click="selectedTypeFilter = 'security'"
      >
        <ShieldCheck :size="12" />
        <span>Keamanan</span>
      </button>
    </div>

    <!-- Release Cards Timeline Stream -->
    <div class="changelog-stream-wrap">
      <div
        v-for="rel in filteredReleases"
        :key="rel.version"
        class="changelog-release-card"
      >
        <!-- Header Rilis -->
        <div class="release-card-header">
          <div class="release-version-group">
            <span v-if="rel.serviceName" class="nav-badge badge-primary" style="font-weight: 700;">
              {{ rel.serviceName }}
            </span>
            <span class="release-version-badge">{{ rel.version }}</span>
            <span v-if="rel.badge" class="release-status-badge" :class="rel.badge.toLowerCase()">
              {{ rel.badge }}
            </span>
            <span class="release-date-pill">
              <Calendar :size="12" />
              {{ rel.releaseDate }}
            </span>
          </div>

          <div class="release-author-info">
            <UserCheck :size="13" />
            <span>{{ rel.author }}</span>
          </div>
        </div>

        <div class="release-summary-block">
          <h2 class="release-title">{{ rel.title }}</h2>
          <p class="release-summary">{{ rel.summary }}</p>
        </div>

        <!-- Log Items List -->
        <div class="release-items-list">
          <div
            v-for="item in rel.items"
            :key="item.id"
            class="changelog-entry-row"
          >
            <div class="entry-badge-tag" :class="'type-' + item.type">
              <component :is="getTypeIcon(item.type)" :size="11" />
              <span>{{ getTypeLabel(item.type) }}</span>
            </div>

            <span class="entry-scope-badge">[{{ item.scope }}]</span>

            <div class="entry-description-text">
              {{ item.description }}
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredReleases.length === 0" class="empty-state-banner">
        <History :size="32" class="empty-icon text-slate" />
        <h3>Tidak ada catatan rilis yang cocok</h3>
        <p>Silakan sesuaikan kata kunci pencarian atau ubah filter tipe changelog Anda.</p>
        <button class="btn-ghost-sm" @click="searchQuery = ''; selectedTypeFilter = 'all'">
          Reset Pencarian
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.changelog-stream-wrap {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.changelog-release-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 22px 24px;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
  transition: all 0.2s ease;
}

.changelog-release-card:hover {
  border-color: #cbd5e1;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.06);
}

.release-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 12px;
  padding-bottom: 14px;
  border-bottom: 1px solid #f1f5f9;
}

.release-version-group {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.release-version-badge {
  font-size: 0.95rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.01em;
  background: #f1f5f9;
  padding: 4px 10px;
  border-radius: 6px;
}

.release-status-badge {
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 3px 8px;
  border-radius: 9999px;
}

.release-status-badge.latest {
  background: #ecfdf5;
  color: #059669;
  border: 1px solid #d1fae5;
}

.release-status-badge.stable {
  background: #eff6ff;
  color: #2563eb;
  border: 1px solid #bfdbfe;
}

.release-status-badge.lts {
  background: #f8fafc;
  color: #475569;
  border: 1px solid #e2e8f0;
}

.release-date-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.75rem;
  color: #64748b;
  margin-left: 4px;
}

.release-author-info {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.72rem;
  color: #64748b;
  background: #f8fafc;
  padding: 3px 10px;
  border-radius: 6px;
}

.release-summary-block {
  margin-bottom: 18px;
}

.release-title {
  font-size: 1.08rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 6px;
  letter-spacing: -0.01em;
}

.release-summary {
  font-size: 0.82rem;
  color: #64748b;
  margin: 0;
  line-height: 1.5;
}

.release-items-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.changelog-entry-row {
  display: flex;
  align-items: baseline;
  gap: 10px;
  padding: 8px 12px;
  background: #f8fafc;
  border-radius: 8px;
  font-size: 0.8rem;
  line-height: 1.5;
}

.entry-badge-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.68rem;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 4px;
  white-space: nowrap;
  flex-shrink: 0;
}

.entry-badge-tag.type-feature {
  background: #eff6ff;
  color: #2563eb;
}

.entry-badge-tag.type-improvement {
  background: #faf5ff;
  color: #9333ea;
}

.entry-badge-tag.type-bugfix {
  background: #fffbeb;
  color: #b45309;
}

.entry-badge-tag.type-security {
  background: #ecfdf5;
  color: #059669;
}

.entry-badge-tag.type-performance {
  background: #f0fdf4;
  color: #16a34a;
}

.entry-scope-badge {
  font-weight: 700;
  color: #0f172a;
  flex-shrink: 0;
}

.entry-description-text {
  color: #334155;
  flex: 1;
}



.empty-state-banner {
  text-align: center;
  padding: 48px 20px;
  background: #ffffff;
  border: 1px dashed #cbd5e1;
  border-radius: 12px;
}

.empty-state-banner h3 {
  margin: 12px 0 6px;
  font-size: 0.95rem;
  color: #0f172a;
}

.empty-state-banner p {
  font-size: 0.8rem;
  color: #64748b;
  margin: 0 0 16px;
}

.btn-ghost-sm {
  padding: 6px 14px;
  border-radius: 6px;
  background: #f1f5f9;
  border: none;
  font-size: 0.75rem;
  font-weight: 600;
  color: #0f172a;
  cursor: pointer;
}
</style>
