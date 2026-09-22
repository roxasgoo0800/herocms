<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
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

// Auto smooth-scroll ke pesan terbaru pada thread percakapan tiket
const threadScrollRef = ref<HTMLDivElement | null>(null);
const scrollThreadToBottom = () => {
  nextTick(() => {
    if (threadScrollRef.value) {
      threadScrollRef.value.scrollTo({
        top: threadScrollRef.value.scrollHeight,
        behavior: 'smooth'
      });
    }
  });
};

watch(
  () => [isTicketDetailModalOpen.value, selectedTicket.value?.messages?.length],
  ([isOpen]) => {
    if (isOpen) {
      scrollThreadToBottom();
    }
  }
);
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
                <span>{{ tkt.messages?.length || 0 }} Pesan</span>
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
    <Teleport to="body">
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
    </Teleport>

    <!-- MODAL 2: DETAIL PERCAKAPAN THREAD TIKET -->
    <Teleport to="body">
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
          <div class="ticket-thread-scroll" ref="threadScrollRef">
            <div class="thread-meta-banner">
              <div class="meta-banner-item">
                <span class="lbl">Kategori:</span>
                <strong>{{ selectedTicket.category }}</strong>
              </div>
              <div class="meta-banner-item">
                <span class="lbl">Dibuat:</span>
                <strong>{{ selectedTicket.createdAt }}</strong>
              </div>
              <div class="meta-banner-item">
                <span class="lbl">Assigned DevOps:</span>
                <strong class="text-blue">{{ selectedTicket.assignedEngineer || 'Dedicated DevOps Engine (L2)' }}</strong>
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
                placeholder="Tulis balasan pesan atau info tambahan untuk engineer... (Tekan Cmd/Ctrl + Enter untuk kirim)"
                class="reply-textarea"
                @keydown.enter.ctrl.prevent="sendTicketReply"
                @keydown.enter.meta.prevent="sendTicketReply"
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
    </Teleport>
  </section>
</template>
