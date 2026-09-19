<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  LifeBuoy,
  Plus,
  Search,
  MessageSquare,
  Clock,
  CheckCircle2,
  User,
  ShieldCheck,
  Send,
  X,
  ChevronRight,
  Headphones,
  Check,
  Flame,
  Sparkles
} from 'lucide-vue-next';
import { useDashboardData } from '../../composables/useDashboardData';
import type { SupportTicketItem } from '../../types/dashboard';

const {
  supportTickets,
  selectedTicket,
  isCreateTicketModalOpen,
  isTicketDetailModalOpen,
  ticketReplyText,
  newTicketForm,
  openCreateTicketModal,
  handleCreateTicket,
  openTicketDetail,
  sendTicketReply,
  resolveTicket
} = useDashboardData();

const searchQuery = ref('');
const statusFilter = ref<'all' | 'open' | 'in_progress' | 'resolved'>('all');
const priorityFilter = ref<'all' | 'p1_urgent' | 'p2_high' | 'p3_normal'>('all');

const filteredTickets = computed(() => {
  return supportTickets.value.filter(t => {
    const matchesSearch = t.id.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          t.subject.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          t.category.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          (t.assignedEngineer && t.assignedEngineer.toLowerCase().includes(searchQuery.value.toLowerCase()));
    if (!matchesSearch) return false;
    if (statusFilter.value !== 'all' && t.status !== statusFilter.value) return false;
    if (priorityFilter.value !== 'all' && t.priority !== priorityFilter.value) return false;
    return true;
  });
});

const getPriorityLabel = (priority: SupportTicketItem['priority']) => {
  if (priority === 'p1_urgent') return 'P1 Kritis';
  if (priority === 'p2_high') return 'P2 Tinggi';
  return 'P3 Normal';
};

const getStatusLabel = (status: SupportTicketItem['status']) => {
  if (status === 'open') return 'Menunggu Tim';
  if (status === 'in_progress') return 'Sedang Ditangani L2';
  return 'Selesai';
};
</script>

<template>
  <section class="fade-in-section">
    <!-- Header Intro -->
    <div class="page-intro-row">
      <div>
        <h1 class="page-title">Pusat Bantuan & Tiket Support</h1>
        <p class="page-desc">Layanan bantuan teknis 24/7 dedicated untuk kendala deployment kontainer, isolasi cgroups v2, konfigurasi SSL Edge Traefik, dan integrasi API.</p>
      </div>
      <div class="header-actions">
        <button class="btn-primary-gradient" @click="openCreateTicketModal">
          <Plus :size="15" />
          <span>Buat Tiket Bantuan</span>
        </button>
      </div>
    </div>

    <!-- 4 Telemetry Metrics Cards -->
    <div class="stats-overview-grid">
      <div class="telemetry-card">
        <div class="telemetry-top">
          <span class="telemetry-label">RATA-RATA WAKTU RESPONS</span>
          <div class="telemetry-glyph emerald"><Clock :size="15" /></div>
        </div>
        <div class="telemetry-val">11 Menit <span class="badge-online">&lt; 15m SLA</span></div>
        <div class="telemetry-sub ready-state">
          <span class="pulse-mini-dot"></span>
          <span>Dedicated L2 & L3 DevOps engineer</span>
        </div>
      </div>

      <div class="telemetry-card">
        <div class="telemetry-top">
          <span class="telemetry-label">TIKET SEDANG AKTIF</span>
          <div class="telemetry-glyph blue"><MessageSquare :size="15" /></div>
        </div>
        <div class="telemetry-val">
          {{ supportTickets.filter(t => t.status !== 'resolved').length }} Tiket
          <span class="badge-growth-pill">Prioritas</span>
        </div>
        <div class="telemetry-sub"><span>1 Menunggu respons • 1 In Progress</span></div>
      </div>

      <div class="telemetry-card">
        <div class="telemetry-top">
          <span class="telemetry-label">TIKET TERATASI (RESOLVED)</span>
          <div class="telemetry-glyph emerald"><CheckCircle2 :size="15" /></div>
        </div>
        <div class="telemetry-val">
          {{ supportTickets.filter(t => t.status === 'resolved').length + 6 }} Selesai
          <span class="badge-online">100% CSAT</span>
        </div>
        <div class="telemetry-sub"><span>Tingkat kepuasan solusi optimal</span></div>
      </div>

      <div class="telemetry-card">
        <div class="telemetry-top">
          <span class="telemetry-label">STATUS DEDICATED SUPPORT</span>
          <div class="telemetry-glyph purple"><Headphones :size="15" /></div>
        </div>
        <div class="telemetry-val">Online 24/7 <span class="badge-growth-pill">Hero Pro</span></div>
        <div class="telemetry-sub"><span>Hotline & monitoring real-time aktif</span></div>
      </div>
    </div>

    <!-- Main Ticketing Panel -->
    <div class="ticketing-panel">
      <!-- Toolbar Filters -->
      <div class="ticketing-toolbar">
        <div class="search-box">
          <Search :size="14" class="search-icon" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari ID tiket (TKT-...), topik kendala, kategori, atau nama engineer..."
            class="search-input"
          />
        </div>

        <div class="toolbar-filters-group">
          <div class="status-tabs-pill">
            <button
              class="btn-tab-pill"
              :class="{ active: statusFilter === 'all' }"
              @click="statusFilter = 'all'"
            >
              Semua ({{ supportTickets.length }})
            </button>
            <button
              class="btn-tab-pill"
              :class="{ active: statusFilter === 'open' }"
              @click="statusFilter = 'open'"
            >
              Open
            </button>
            <button
              class="btn-tab-pill"
              :class="{ active: statusFilter === 'in_progress' }"
              @click="statusFilter = 'in_progress'"
            >
              In Progress
            </button>
            <button
              class="btn-tab-pill"
              :class="{ active: statusFilter === 'resolved' }"
              @click="statusFilter = 'resolved'"
            >
              Selesai
            </button>
          </div>

          <select v-model="priorityFilter" class="priority-select">
            <option value="all">Semua Prioritas</option>
            <option value="p1_urgent">P1 - Kritis</option>
            <option value="p2_high">P2 - Tinggi</option>
            <option value="p3_normal">P3 - Normal</option>
          </select>
        </div>
      </div>

      <!-- Tickets List -->
      <div class="tickets-stream-list">
        <div
          v-for="tkt in filteredTickets"
          :key="tkt.id"
          class="ticket-row-card"
          :class="'status-' + tkt.status"
          @click="openTicketDetail(tkt)"
        >
          <!-- Left Priority & ID column -->
          <div class="ticket-col-leading">
            <div class="ticket-id-tag">
              <code>{{ tkt.id }}</code>
            </div>
            <span class="priority-pill" :class="'prio-' + tkt.priority">
              <Flame v-if="tkt.priority === 'p1_urgent'" :size="11" />
              {{ getPriorityLabel(tkt.priority) }}
            </span>
          </div>

          <!-- Main Info -->
          <div class="ticket-col-main">
            <div class="ticket-title-row">
              <h3 class="ticket-subject">{{ tkt.subject }}</h3>
              <span class="status-chip" :class="'chip-' + tkt.status">
                <span class="status-dot"></span>
                {{ getStatusLabel(tkt.status) }}
              </span>
            </div>

            <div class="ticket-meta-strip">
              <span class="category-tag">{{ tkt.category }}</span>
              <span class="meta-item">
                <Clock :size="12" />
                <span>Diperbarui: <strong>{{ tkt.lastUpdated }}</strong></span>
              </span>
              <span v-if="tkt.assignedEngineer" class="meta-item engineer-assigned">
                <ShieldCheck :size="12" />
                <span>Engineer: <strong>{{ tkt.assignedEngineer }}</strong></span>
              </span>
              <span class="meta-item msg-count">
                <MessageSquare :size="12" />
                <span>{{ tkt.messages.length }} Pesan</span>
              </span>
            </div>
          </div>

          <!-- Right Actions -->
          <div class="ticket-col-actions" @click.stop>
            <button
              v-if="tkt.status !== 'resolved'"
              class="btn-resolve-quick"
              @click="resolveTicket(tkt)"
              title="Tandai Selesai"
            >
              <Check :size="13" />
              <span>Selesaikan</span>
            </button>
            <button class="btn-open-thread" @click="openTicketDetail(tkt)">
              <span>Lihat Thread</span>
              <ChevronRight :size="14" />
            </button>
          </div>
        </div>

        <div v-if="filteredTickets.length === 0" class="empty-tickets-state">
          <LifeBuoy :size="38" class="empty-icon" />
          <h4>Tidak ada tiket yang cocok dengan filter</h4>
          <p>Seluruh kendala operasional Anda sedang berjalan normal tanpa komplain aktif.</p>
          <button class="btn-primary-gradient" @click="openCreateTicketModal">
            <Plus :size="14" />
            <span>Buat Tiket Baru</span>
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL 1: BUAT TIKET BANTUAN BARU -->
    <div v-if="isCreateTicketModalOpen" class="modal-backdrop" @click.self="isCreateTicketModalOpen = false">
      <div class="modal-dialog">
        <div class="modal-header">
          <div class="modal-header-leading">
            <div class="modal-header-icon-box">
              <LifeBuoy :size="18" />
            </div>
            <div>
              <h3 class="modal-heading">Buat Tiket Bantuan Baru</h3>
              <p class="modal-subheading">Tim DevOps & Cloud Engineer siap membantu penyelesaian kendala teknis Anda.</p>
            </div>
          </div>
          <button class="modal-close-button" @click="isCreateTicketModalOpen = false" title="Tutup">
            <X :size="16" />
          </button>
        </div>

        <form @submit.prevent="handleCreateTicket" class="modal-form-body">
          <div class="form-group-block">
            <label class="input-label-row">
              <span class="label-text">Judul Kendala / Subject Masalah</span>
              <span class="label-badge-optional">Wajib</span>
            </label>
            <div class="input-field-wrapper">
              <input
                v-model="newTicketForm.subject"
                type="text"
                class="form-text-input"
                placeholder="Contoh: Traefik mengembalikan 502 Bad Gateway saat traffic spike"
                required
                autofocus
              />
            </div>
          </div>

          <div class="form-row-duo">
            <div class="form-group-block">
              <label class="input-label-row">
                <span class="label-text">Kategori Kendala</span>
              </label>
              <div class="input-field-wrapper">
                <select v-model="newTicketForm.category" class="form-text-input form-select-input">
                  <option value="Infrastructure & Container">Infrastructure & Container</option>
                  <option value="Edge Proxy & DNS">Edge Proxy & DNS</option>
                  <option value="Visual Editor">Visual Editor & Template</option>
                  <option value="Billing & Pajak">Billing & Pajak (E-Faktur)</option>
                  <option value="API & Webhooks">API & Webhooks</option>
                  <option value="General">Pertanyaan Umum</option>
                </select>
              </div>
            </div>

            <div class="form-group-block">
              <label class="input-label-row">
                <span class="label-text">Tingkat Urgensi (Priority)</span>
              </label>
              <div class="input-field-wrapper">
                <select v-model="newTicketForm.priority" class="form-text-input form-select-input">
                  <option value="p1_urgent">P1 - Kritis (Situs / Server Down)</option>
                  <option value="p2_high">P2 - Tinggi (Fitur / SSL Terganggu)</option>
                  <option value="p3_normal">P3 - Normal (Pertanyaan / Kuota)</option>
                </select>
              </div>
            </div>
          </div>

          <div class="form-group-block">
            <label class="input-label-row">
              <span class="label-text">Rincian Kendala & Langkah Reproduksi</span>
              <span class="label-badge-optional">Wajib</span>
            </label>
            <div class="input-field-wrapper">
              <textarea
                v-model="newTicketForm.message"
                rows="4"
                class="form-text-input textarea-input"
                placeholder="Jelaskan secara spesifik apa yang terjadi, subdomain yang terpengaruh, pesan error di konsol, atau waktu terjadinya kendala..."
                required
              ></textarea>
            </div>
          </div>

          <div class="resource-spec-callout">
            <Sparkles :size="14" class="spec-callout-icon" />
            <div class="spec-callout-text">
              <span>Dedicated Support SLA: </span>
              Tiket Anda otomatis dialirkan ke queue engineer HeroCMS dengan target respons pertama di bawah 15 menit.
            </div>
          </div>

          <div class="modal-footer-row">
            <button type="button" class="btn-modal-ghost" @click="isCreateTicketModalOpen = false">
              Batal
            </button>
            <button type="submit" class="btn-modal-confirm">
              <Send :size="14" />
              <span>Kirim Tiket Bantuan</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL 2: DETAIL PERCAKAPAN THREAD TIKET -->
    <div v-if="isTicketDetailModalOpen && selectedTicket" class="modal-backdrop" @click.self="isTicketDetailModalOpen = false">
      <div class="modal-dialog modal-dialog-lg">
        <div class="modal-header">
          <div class="modal-header-leading">
            <div class="modal-header-icon-box">
              <MessageSquare :size="18" />
            </div>
            <div>
              <div class="thread-header-meta">
                <span class="thread-id">{{ selectedTicket.id }}</span>
                <span class="priority-pill" :class="'prio-' + selectedTicket.priority">
                  {{ getPriorityLabel(selectedTicket.priority) }}
                </span>
                <span class="status-chip" :class="'chip-' + selectedTicket.status">
                  <span class="status-dot"></span>
                  {{ getStatusLabel(selectedTicket.status) }}
                </span>
              </div>
              <h3 class="modal-heading thread-title">{{ selectedTicket.subject }}</h3>
            </div>
          </div>
          <button class="modal-close-button" @click="isTicketDetailModalOpen = false" title="Tutup">
            <X :size="16" />
          </button>
        </div>

        <!-- Thread Messages List -->
        <div class="ticket-thread-scroll">
          <div class="thread-meta-banner">
            <div class="meta-banner-item">
              <span class="lbl">Kategori:</span>
              <strong>{{ selectedTicket.category }}</strong>
            </div>
            <div class="meta-banner-item">
              <span class="lbl">Dibuat:</span>
              <strong>{{ selectedTicket.createdAt }}</strong>
            </div>
            <div v-if="selectedTicket.assignedEngineer" class="meta-banner-item">
              <span class="lbl">Assigned DevOps:</span>
              <strong class="text-blue">{{ selectedTicket.assignedEngineer }}</strong>
            </div>
          </div>

          <div class="conversation-stream">
            <div
              v-for="msg in selectedTicket.messages"
              :key="msg.id"
              class="message-bubble-wrapper"
              :class="'sender-' + msg.sender"
            >
              <div class="msg-avatar-icon">
                <ShieldCheck v-if="msg.sender === 'support'" :size="15" />
                <User v-else :size="15" />
              </div>
              <div class="msg-bubble-card">
                <div class="msg-header">
                  <div class="msg-author-group">
                    <strong class="msg-author-name">{{ msg.authorName }}</strong>
                    <span class="msg-author-role">{{ msg.authorRole }}</span>
                  </div>
                  <span class="msg-time">{{ msg.timestamp }}</span>
                </div>
                <div class="msg-text-content">
                  {{ msg.message }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Reply Box Footer -->
        <div class="thread-reply-area">
          <div v-if="selectedTicket.status !== 'resolved'" class="reply-input-wrap">
            <textarea
              v-model="ticketReplyText"
              rows="2"
              placeholder="Tulis balasan pesan atau info tambahan untuk engineer..."
              class="reply-textarea"
              @keydown.enter.ctrl.prevent="sendTicketReply"
            ></textarea>
            <div class="reply-actions-row">
              <button
                class="btn-resolve-in-modal"
                @click="resolveTicket(selectedTicket)"
                title="Tandai Tiket Selesai"
              >
                <CheckCircle2 :size="14" />
                <span>Tandai Selesai</span>
              </button>
              <button
                class="btn-send-reply"
                :disabled="!ticketReplyText.trim()"
                @click="sendTicketReply"
              >
                <Send :size="13" />
                <span>Kirim Balasan</span>
              </button>
            </div>
          </div>
          <div v-else class="resolved-callout-banner">
            <CheckCircle2 :size="16" class="text-green" />
            <span>Tiket ini telah ditandai <strong>Selesai (Resolved)</strong>. Butuh bantuan lain? Silakan buka tiket baru.</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Scoped Futuristic Styles for Support Ticketing Module */
.fade-in-section {
  animation: fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

.page-intro-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.02em;
  margin: 0 0 6px 0;
}

.page-desc {
  font-size: 13.5px;
  color: #64748b;
  margin: 0;
  max-width: 720px;
  line-height: 1.5;
}

.btn-primary-gradient {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #0f172a;
  color: #ffffff;
  border: 1px solid #0f172a;
  padding: 9px 18px;
  border-radius: 9px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.12);
}

.btn-primary-gradient:hover {
  background: #1e293b;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);
}

/* 4 Metrics Strip */
.stats-overview-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

@media (max-width: 1100px) {
  .stats-overview-grid { grid-template-columns: repeat(2, 1fr); }
}

.telemetry-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 16px 18px;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.03);
}

.telemetry-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.telemetry-label {
  font-size: 11px;
  font-weight: 700;
  color: #64748b;
  letter-spacing: 0.05em;
}

.telemetry-glyph {
  width: 28px;
  height: 28px;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.telemetry-glyph.blue { background: #f0f9ff; color: #0284c7; }
.telemetry-glyph.emerald { background: #ecfdf5; color: #059669; }
.telemetry-glyph.purple { background: #f5f3ff; color: #7c3aed; }

.telemetry-val {
  font-size: 19px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.telemetry-sub {
  font-size: 12px;
  color: #94a3b8;
}

.pulse-mini-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10b981;
  margin-right: 5px;
}

.badge-online {
  font-size: 11px;
  font-weight: 600;
  color: #0284c7;
  background: #f0f9ff;
  padding: 2px 8px;
  border-radius: 20px;
}

.badge-growth-pill {
  font-size: 11px;
  font-weight: 600;
  color: #7c3aed;
  background: #f5f3ff;
  padding: 2px 8px;
  border-radius: 20px;
}

/* Ticketing Panel */
.ticketing-panel {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
}

.ticketing-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 18px;
  border-bottom: 1px solid #e2e8f0;
  background: #fafbfc;
  gap: 16px;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 280px;
}

.search-icon {
  position: absolute;
  left: 11px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
}

.search-input {
  width: 100%;
  box-sizing: border-box;
  padding: 8px 12px 8px 34px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 13px;
  color: #0f172a;
  outline: none;
  background: #ffffff;
}

.search-input:focus {
  border-color: #0f172a;
  box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.06);
}

.toolbar-filters-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.status-tabs-pill {
  display: flex;
  background: #f1f5f9;
  padding: 3px;
  border-radius: 8px;
}

.btn-tab-pill {
  background: transparent;
  border: none;
  padding: 5px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-tab-pill.active {
  background: #ffffff;
  color: #0f172a;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.08);
}

.priority-select {
  padding: 6px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 12.5px;
  color: #334155;
  background: #ffffff;
  outline: none;
}

/* Tickets Stream List */
.tickets-stream-list {
  display: flex;
  flex-direction: column;
}

.ticket-row-card {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f1f5f9;
  gap: 18px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.ticket-row-card:hover {
  background: #fafbfc;
}

.ticket-row-card:last-child {
  border-bottom: none;
}

.ticket-col-leading {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 90px;
  flex-shrink: 0;
}

.ticket-id-tag code {
  font-family: ui-monospace, SFMono-Regular, monospace;
  font-size: 12px;
  font-weight: 700;
  color: #0f172a;
  background: #f1f5f9;
  padding: 2px 6px;
  border-radius: 4px;
}

.priority-pill {
  font-size: 10px;
  font-weight: 800;
  padding: 2px 6px;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  gap: 3px;
  letter-spacing: 0.03em;
  width: fit-content;
}

.prio-p1_urgent { background: #fee2e2; color: #dc2626; border: 1px solid #fecaca; }
.prio-p2_high { background: #fef3c7; color: #d97706; border: 1px solid #fde68a; }
.prio-p3_normal { background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0; }

.ticket-col-main {
  flex: 1;
  min-width: 0;
}

.ticket-title-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 6px;
}

.ticket-subject {
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ticket-row-card:hover .ticket-subject {
  color: #2563eb;
}

.status-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 20px;
  flex-shrink: 0;
}

.status-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: currentColor;
}

.chip-open { background: #eff6ff; color: #1d4ed8; }
.chip-in_progress { background: #fef3c7; color: #b45309; }
.chip-resolved { background: #ecfdf5; color: #047857; }

.ticket-meta-strip {
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 12px;
  color: #64748b;
  flex-wrap: wrap;
}

.category-tag {
  background: #f1f5f9;
  padding: 2px 7px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  color: #334155;
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.meta-item strong {
  color: #334155;
}

.engineer-assigned {
  color: #2563eb;
}

.ticket-col-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.btn-resolve-quick {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  color: #475569;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 11.5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-resolve-quick:hover {
  background: #ecfdf5;
  border-color: #a7f3d0;
  color: #059669;
}

.btn-open-thread {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: #0f172a;
  color: #ffffff;
  border: 1px solid #0f172a;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-open-thread:hover {
  background: #1e293b;
}

.empty-tickets-state {
  text-align: center;
  padding: 48px;
}

.empty-icon {
  color: #94a3b8;
  margin-bottom: 12px;
}

.empty-tickets-state h4 {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 6px 0;
}

.empty-tickets-state p {
  font-size: 13px;
  color: #64748b;
  margin: 0 0 16px 0;
}

/* Modal Dialog Styles */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

.modal-dialog-lg {
  max-width: 740px !important;
}

.modal-dialog {
  background: #ffffff;
  border-radius: 16px;
  width: 100%;
  max-width: 580px;
  box-shadow: 0 20px 40px -10px rgba(15, 23, 42, 0.2);
  border: 1px solid #e2e8f0;
  overflow: hidden;
  animation: modalScale 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modalScale {
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1); }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 18px 24px;
  border-bottom: 1px solid #f1f5f9;
}

.modal-header-leading {
  display: flex;
  gap: 12px;
}

.modal-header-icon-box {
  width: 38px;
  height: 38px;
  border-radius: 9px;
  background: #f1f5f9;
  color: #0f172a;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.modal-heading {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 3px 0;
}

.thread-title {
  font-size: 15px;
  margin-top: 4px;
}

.thread-header-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.thread-id {
  font-family: ui-monospace, monospace;
  font-weight: 700;
  font-size: 12px;
  color: #0f172a;
}

.modal-subheading {
  font-size: 12.5px;
  color: #64748b;
  margin: 0;
}

.modal-close-button {
  background: transparent;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
}

.modal-close-button:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.modal-form-body {
  padding: 20px 24px;
}

.form-group-block {
  margin-bottom: 18px;
}

.input-label-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #334155;
}

.label-badge-optional {
  color: #64748b;
  font-size: 11px;
}

.form-text-input {
  width: 100%;
  box-sizing: border-box;
  padding: 9px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 13px;
  color: #0f172a;
  outline: none;
  transition: all 0.15s ease;
}

.form-text-input:focus {
  border-color: #0f172a;
  box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.08);
}

.textarea-input {
  font-family: inherit;
  resize: vertical;
}

.form-row-duo {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.resource-spec-callout {
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  padding: 10px 12px;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 20px;
}

.spec-callout-icon {
  color: #2563eb;
  flex-shrink: 0;
  margin-top: 1px;
}

.spec-callout-text {
  font-size: 12px;
  color: #1e40af;
  line-height: 1.4;
}

.spec-callout-text span {
  font-weight: 700;
}

.modal-footer-row {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn-modal-ghost {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  color: #475569;
  padding: 9px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.btn-modal-ghost:hover {
  background: #f8fafc;
  color: #0f172a;
}

.btn-modal-confirm {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #0f172a;
  border: 1px solid #0f172a;
  color: #ffffff;
  padding: 9px 18px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.btn-modal-confirm:hover {
  background: #1e293b;
}

/* Thread Conversation */
.ticket-thread-scroll {
  padding: 18px 24px;
  max-height: 55vh;
  overflow-y: auto;
  background: #f8fafc;
}

.thread-meta-banner {
  display: flex;
  gap: 20px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 12px;
  margin-bottom: 18px;
}

.meta-banner-item {
  display: flex;
  gap: 5px;
}

.meta-banner-item .lbl {
  color: #64748b;
}

.text-blue { color: #2563eb; }

.conversation-stream {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.message-bubble-wrapper {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.msg-avatar-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #e2e8f0;
  color: #475569;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.sender-support .msg-avatar-icon {
  background: #0f172a;
  color: #ffffff;
}

.msg-bubble-card {
  flex: 1;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 14px 16px;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
}

.sender-support .msg-bubble-card {
  border-color: #bfdbfe;
  background: #f0f7ff;
}

.msg-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.msg-author-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.msg-author-name {
  font-size: 13px;
  color: #0f172a;
}

.msg-author-role {
  font-size: 11px;
  color: #64748b;
  background: #e2e8f0;
  padding: 1px 6px;
  border-radius: 4px;
}

.sender-support .msg-author-role {
  background: #dbeafe;
  color: #1d4ed8;
  font-weight: 600;
}

.msg-time {
  font-size: 11px;
  color: #94a3b8;
}

.msg-text-content {
  font-size: 13px;
  color: #334155;
  line-height: 1.5;
  white-space: pre-wrap;
}

/* Thread Reply Area */
.thread-reply-area {
  padding: 16px 24px;
  background: #ffffff;
  border-top: 1px solid #e2e8f0;
}

.reply-input-wrap {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.reply-textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 13px;
  font-family: inherit;
  resize: vertical;
  outline: none;
}

.reply-textarea:focus {
  border-color: #0f172a;
  box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.08);
}

.reply-actions-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn-resolve-in-modal {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  color: #475569;
  padding: 7px 14px;
  border-radius: 7px;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
}

.btn-resolve-in-modal:hover {
  background: #ecfdf5;
  border-color: #a7f3d0;
  color: #059669;
}

.btn-send-reply {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #0f172a;
  border: 1px solid #0f172a;
  color: #ffffff;
  padding: 7px 16px;
  border-radius: 7px;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
}

.btn-send-reply:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.resolved-callout-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 12.5px;
  color: #065f46;
}

.text-green { color: #059669; }
</style>
