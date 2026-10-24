<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue';
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
  Sparkles,
  Server,
  CreditCard,
  Globe,
  Image as ImageIcon,
  Smile,
  Paperclip,
  Mail,
  Box,
  Layers,
  Eye,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Lock
} from 'lucide-vue-next';
import { useDashboardData } from '../../composables/useDashboardData';
import type { SupportTicketItem, SupportDepartment, TicketAttachment, TicketMessage } from '../../types/dashboard';

const {
  userPlan,
  containers,
  supportTickets,
  selectedTicket,
  isCreateTicketModalOpen,
  isTicketDetailModalOpen,
  ticketReplyText,
  isSupportTyping,
  newTicketForm,
  getTenantAuthor,
  handleCreateTicket,
  openTicketDetail,
  sendTicketReply,
  resolveTicket,
  showToast
} = useDashboardData();

const searchQuery = ref('');
const statusFilter = ref<'all' | 'open' | 'in_progress' | 'resolved'>('all');
const departmentFilter = ref<string>('all');
const isFormExpanded = ref(true);

// Custom Dropdown Popover States
const isCategoryDropdownOpen = ref(false);
const isContainerDropdownOpen = ref(false);
const isDeptFilterDropdownOpen = ref(false);

const closeAllDropdowns = () => {
  isCategoryDropdownOpen.value = false;
  isContainerDropdownOpen.value = false;
  isDeptFilterDropdownOpen.value = false;
};

const handleGlobalClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement | null;
  if (!target) return;
  if (!target.closest('.studio-custom-dropdown-wrap')) {
    closeAllDropdowns();
  }
  if (!target.closest('.emoji-popover-anchor')) {
    isChatEmojiOpen.value = false;
    isCreateEmojiOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleGlobalClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleGlobalClickOutside);
});

// Tenant Identity from Session
const tenantIdentity = computed(() => getTenantAuthor());
const tenantInitials = computed(() => {
  const parts = tenantIdentity.value.authorName.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return tenantIdentity.value.authorName.slice(0, 2).toUpperCase();
});

// Department Routing Catalog
interface DepartmentOption {
  id: SupportDepartment;
  shortLabel: string;
  title: string;
  desc: string;
  agentName: string;
  agentRole: string;
  sla: string;
  accent: 'blue' | 'emerald' | 'amber' | 'purple';
  categories: string[];
  quickTemplates: { label: string; subject: string; category: string; body: string }[];
}

const departmentOptions: DepartmentOption[] = [
  {
    id: 'Technical & Container (DevOps)',
    shortLabel: 'Technical & Kontainer',
    title: 'Technical & Container Support',
    desc: 'Kendala kontainer mati/down, error 502/503, CPU & RAM penuh, atau gangguan database.',
    agentName: 'Budi Hartono',
    agentRole: 'L2 Cloud DevOps Engineer',
    sla: '< 5 Menit',
    accent: 'emerald',
    categories: [
      'Kontainer Mati / Situs Tidak Bisa Diakses (Down)',
      'Error HTTP 502 / 503 Bad Gateway',
      'Kinerja Lambat / CPU & RAM Kontainer Penuh',
      'Masalah Penyimpanan Media & Backup Data',
      'Integrasi API & Pengiriman Webhook Gagal'
    ],
    quickTemplates: [
      {
        label: '⚡ Kontainer tiba-tiba mati / down',
        subject: 'Kontainer Situs Tiba-tiba Berhenti (Down) & Tidak Bisa Diakses',
        category: 'Kontainer Mati / Situs Tidak Bisa Diakses (Down)',
        body: 'Halo tim Technical Support, kontainer situs kami tiba-tiba mati/standby dan tidak bisa diakses dari jaringan publik. Mohon bantuannya untuk pengecekan service dan restart pod kontainer kami.'
      },
      {
        label: '🚨 Muncul error 502 Bad Gateway',
        subject: 'Muncul Error 502 Bad Gateway Saat Mengakses Halaman Utama',
        category: 'Error HTTP 502 / 503 Bad Gateway',
        body: 'Halo tim DevOps, saat membuka URL situs muncul halaman 502 Bad Gateway. Mohon dibantu pengecekan routing kontainer dan healthcheck port internalnya.'
      },
      {
        label: '📈 Penggunaan RAM / CPU penuh',
        subject: 'Penggunaan Resource RAM & CPU Kontainer Mencapai Batas Kuota',
        category: 'Kinerja Lambat / CPU & RAM Kontainer Penuh',
        body: 'Halo tim Support, grafik pemakaian RAM pada kontainer kami mendekati batas maksimum sehingga respons situs melambat. Mohon saran optimasi atau pengecekan prosesnya.'
      }
    ]
  },
  {
    id: 'Customer Support & Layanan CMS',
    shortLabel: 'Customer Support CMS',
    title: 'Customer Support & Bantuan CMS',
    desc: 'Bantuan penggunaan Visual Editor, pengaturan template, artikel, media, & panduan fitur.',
    agentName: 'Nadia Putri',
    agentRole: 'Customer Care Specialist',
    sla: '< 5 Menit',
    accent: 'blue',
    categories: [
      'Kendala Visual Editor & Publikasi Halaman',
      'Pengaturan Template & Tampilan Situs',
      'Manajemen Artikel, Halaman & Media Assets',
      'Bantuan Pengaturan Akun & Pertanyaan Umum'
    ],
    quickTemplates: [
      {
        label: '🎨 Gagal simpan / publish di Visual Editor',
        subject: 'Perubahan Desain pada Visual Editor Belum Tampil di Halaman Publik',
        category: 'Kendala Visual Editor & Publikasi Halaman',
        body: 'Halo Customer Support, saya sudah menyunting blok halaman di Visual Editor dan menekan tombol Publish, tetapi tampilan di halaman publik belum berubah. Mohon panduannya.'
      },
      {
        label: '🖼️ Bantuan ganti template & layout',
        subject: 'Panduan Penyesuaian Layout & Komponen Template Situs',
        category: 'Pengaturan Template & Tampilan Situs',
        body: 'Halo tim CS, saya ingin menyesuaikan susunan seksi pada template situs agar lebih sesuai dengan profil usaha kami. Mohon arahannya.'
      }
    ]
  },
  {
    id: 'Billing, Paket & Faktur',
    shortLabel: 'Billing & Faktur',
    title: 'Billing, Paket & Faktur Pembayaran',
    desc: 'Konfirmasi pembayaran langganan, upgrade kuota kontainer, & dokumen E-Faktur PPN.',
    agentName: 'Hendra Wijaya',
    agentRole: 'Billing & Finance Specialist',
    sla: '< 10 Menit',
    accent: 'amber',
    categories: [
      'Konfirmasi Pembayaran & Aktivasi Paket',
      'Upgrade Paket / Penambahan Kuota Kontainer',
      'Permintaan & Revisi Dokumen E-Faktur Pajak',
      'Pertanyaan Tagihan & Metode Pembayaran'
    ],
    quickTemplates: [
      {
        label: '🧾 Konfirmasi pembayaran & faktur',
        subject: 'Konfirmasi Pembayaran Tagihan & Permintaan Dokumen Faktur Resmi',
        category: 'Konfirmasi Pembayaran & Aktivasi Paket',
        body: 'Halo tim Billing, kami telah menyelesaikan pembayaran perpanjangan paket langganan. Mohon dibantu verifikasi status lunas beserta penerbitan dokumen fakturnya.'
      },
      {
        label: '📦 Tambah kuota slot kontainer',
        subject: 'Permintaan Informasi Upgrade Paket & Tambahan Slot Kontainer',
        category: 'Upgrade Paket / Penambahan Kuota Kontainer',
        body: 'Halo tim Billing, kami berencana menambah beberapa situs baru. Mohon informasi prosedur upgrade kuota kontainer pada akun kami.'
      }
    ]
  },
  {
    id: 'Domain, DNS & Keamanan SSL',
    shortLabel: 'Domain, DNS & SSL',
    title: 'Domain, DNS & Keamanan SSL',
    desc: 'Kendala menghubungkan custom domain, propagasi CNAME/A record, & sertifikat HTTPS.',
    agentName: 'Raka Pratama',
    agentRole: 'Network & Edge Security',
    sla: '< 5 Menit',
    accent: 'purple',
    categories: [
      'Custom Domain Belum Terhubung (Propagasi DNS)',
      'Sertifikat SSL / HTTPS Tidak Aktif atau Error',
      'Konfigurasi Subdomain & Pengalihan (Redirect)',
      'Proteksi Keamanan & Pemblokiran Trafik'
    ],
    quickTemplates: [
      {
        label: '🌐 Custom domain belum terhubung',
        subject: 'Bantuan Pengecekan Propagasi DNS Custom Domain Situs',
        category: 'Custom Domain Belum Terhubung (Propagasi DNS)',
        body: 'Halo tim Domain & SSL, saya sudah mengarahkan CNAME dan A record dari panel domain kami, namun status domain masih menunggu verifikasi. Mohon bantuannya untuk pengecekan.'
      },
      {
        label: '🔒 Sertifikat SSL / HTTPS belum aktif',
        subject: 'Sertifikat SSL HTTPS pada Custom Domain Masih Menunggu Terbit',
        category: 'Sertifikat SSL / HTTPS Tidak Aktif atau Error',
        body: 'Halo tim Network, domain kustom kami sudah mengarah ke server namun gembok SSL HTTPS belum aktif saat dibuka di browser. Mohon dibantu penerbitan ulang sertifikatnya.'
      }
    ]
  }
];

const selectedDepartmentObj = computed(() => {
  return departmentOptions.find(d => d.id === newTicketForm.value.department) || departmentOptions[0];
});

const selectDepartment = (dept: DepartmentOption) => {
  newTicketForm.value.department = dept.id;
  if (!dept.categories.includes(newTicketForm.value.category)) {
    newTicketForm.value.category = dept.categories[0];
  }
};

const selectCategoryOption = (cat: string) => {
  newTicketForm.value.category = cat;
  isCategoryDropdownOpen.value = false;
};

const selectContainerOption = (val: string) => {
  newTicketForm.value.containerName = val;
  isContainerDropdownOpen.value = false;
};

const selectDeptFilterOption = (val: string) => {
  departmentFilter.value = val;
  isDeptFilterDropdownOpen.value = false;
};

const selectedContainerMeta = computed(() => {
  const val = newTicketForm.value.containerName;
  if (!val || val === 'Semua Layanan / Akun Tenant') {
    return {
      isGlobal: true,
      title: 'Semua Layanan / Akun Tenant Umum',
      sub: 'Berlaku untuk seluruh akun atau layanan umum',
      statusLabel: 'Global',
      statusClass: 'pill-global'
    };
  }
  const found = containers.value.find(c => `${c.name} (${c.subdomain})` === val || c.name === val);
  if (found) {
    return {
      isGlobal: false,
      title: found.name,
      sub: found.subdomain,
      statusLabel: found.status === 'running' ? 'Running' : found.status === 'stopped' ? 'Standby/Down' : 'Maintenance',
      statusClass: found.status === 'running' ? 'pill-running' : 'pill-stopped'
    };
  }
  return {
    isGlobal: false,
    title: val,
    sub: 'Kontainer Terkait',
    statusLabel: 'Terpilih',
    statusClass: 'pill-global'
  };
});

const selectedDeptFilterLabel = computed(() => {
  if (departmentFilter.value === 'all') return 'Semua Divisi Tujuan';
  const found = departmentOptions.find(d => d.id === departmentFilter.value);
  return found ? found.shortLabel : departmentFilter.value;
});

const applyQuickTemplate = (tpl: { label: string; subject: string; category: string; body: string }) => {
  newTicketForm.value.category = tpl.category;
  newTicketForm.value.subject = tpl.subject;
  newTicketForm.value.message = tpl.body;
  showToast('Template kendala berhasil diterapkan ke formulir.', 'info');
};

// Filtered Tickets for Table
const filteredTickets = computed(() => {
  return supportTickets.value.filter(t => {
    const q = searchQuery.value.toLowerCase().trim();
    const matchesSearch =
      !q ||
      t.id.toLowerCase().includes(q) ||
      t.subject.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      (t.department && t.department.toLowerCase().includes(q)) ||
      (t.containerName && t.containerName.toLowerCase().includes(q)) ||
      (t.assignedEngineer && t.assignedEngineer.toLowerCase().includes(q));
    if (!matchesSearch) return false;
    if (statusFilter.value !== 'all' && t.status !== statusFilter.value) return false;
    if (departmentFilter.value !== 'all' && t.department !== departmentFilter.value) return false;
    return true;
  });
});

const activeTicketsCount = computed(() => supportTickets.value.filter(t => t.status !== 'resolved').length);
const openTicketsCount = computed(() => supportTickets.value.filter(t => t.status === 'open').length);
const inProgressTicketsCount = computed(() => supportTickets.value.filter(t => t.status === 'in_progress').length);
const resolvedTicketsCount = computed(() => supportTickets.value.filter(t => t.status === 'resolved').length);

const getStatusLabel = (status: SupportTicketItem['status']) => {
  if (status === 'open') return 'Menunggu Respons CS';
  if (status === 'in_progress') return 'Sedang Ditangani';
  return 'Selesai / Teratasi';
};

const getDepartmentBadgeClass = (dept?: string) => {
  const d = (dept || '').toLowerCase();
  if (d.includes('billing') || d.includes('faktur')) return 'dept-badge-amber';
  if (d.includes('domain') || d.includes('dns') || d.includes('ssl')) return 'dept-badge-purple';
  if (d.includes('customer') || d.includes('cms')) return 'dept-badge-blue';
  return 'dept-badge-emerald';
};

const getAgentInitials = (name?: string) => {
  if (!name) return 'CS';
  const clean = name.split('(')[0].trim();
  const parts = clean.split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return clean.slice(0, 2).toUpperCase();
};

const getLatestMessageSnippet = (tkt: SupportTicketItem) => {
  if (!tkt.messages || tkt.messages.length === 0) return 'Belum ada pesan percakapan.';
  const last = tkt.messages[tkt.messages.length - 1];
  const prefix = last.sender === 'support' ? `${last.authorName}: ` : 'Anda: ';
  const imgTag = last.attachments?.length ? '📷 [Gambar] ' : '';
  return `${prefix}${imgTag}${last.message}`;
};

const getTicketAttachmentsCount = (tkt: SupportTicketItem) => {
  if (!tkt.messages) return 0;
  return tkt.messages.reduce((sum, m) => sum + (m.attachments?.length || 0), 0);
};

// Format read receipt timestamp (shows jam if today, or Tanggal Bulan Tahun + Jam if multi-day)
const formatReadReceiptText = (msg: TicketMessage): string => {
  const raw = msg.readAt || msg.timestamp || 'Baru saja';
  const clean = raw.replace(/^Hari ini,\s*/i, '').trim();
  return clean;
};

// Check if ticket created on previous dates for WhatsApp date divider pill
const getThreadDateDivider = (tkt: SupportTicketItem): string => {
  const c = tkt.createdAt || '';
  if (/\d{1,2}\s+[A-Za-z]+\s+\d{4}/.test(c)) {
    return c.split(',')[0].trim();
  }
  return 'Hari Ini';
};

// All attachments inside currently opened ticket thread
const currentThreadAttachments = computed<TicketAttachment[]>(() => {
  if (!selectedTicket.value?.messages) return [];
  const list: TicketAttachment[] = [];
  for (const msg of selectedTicket.value.messages) {
    if (Array.isArray(msg.attachments)) {
      list.push(...msg.attachments);
    }
  }
  return list;
});

// Image upload handling for Create Form & Chat Reply
const createFileInputRef = ref<HTMLInputElement | null>(null);
const chatFileInputRef = ref<HTMLInputElement | null>(null);
const stagedReplyAttachments = ref<TicketAttachment[]>([]);
const lightboxImage = ref<TicketAttachment | null>(null);

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const readFilesAsAttachments = (files: FileList | File[], targetArray: TicketAttachment[]) => {
  Array.from(files).forEach(file => {
    if (!file.type.startsWith('image/')) {
      showToast(`Berkas "${file.name}" bukan gambar. Harap pilih PNG, JPG, WEBP, atau GIF.`, 'error');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      showToast(`Ukuran gambar "${file.name}" melebihi batas 8 MB.`, 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        targetArray.push({
          id: `att_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          name: file.name,
          size: formatFileSize(file.size),
          dataUrl: reader.result,
          mimeType: file.type
        });
      }
    };
    reader.readAsDataURL(file);
  });
};

const handleCreateAttachmentChange = (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (input.files?.length) {
    readFilesAsAttachments(input.files, newTicketForm.value.attachments);
    input.value = '';
  }
};

const removeCreateAttachment = (id: string) => {
  newTicketForm.value.attachments = newTicketForm.value.attachments.filter(a => a.id !== id);
};

const handleChatAttachmentChange = (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (input.files?.length) {
    readFilesAsAttachments(input.files, stagedReplyAttachments.value);
    input.value = '';
  }
};

const handleChatPaste = (e: ClipboardEvent) => {
  const items = e.clipboardData?.items;
  if (!items) return;
  const imageFiles: File[] = [];
  for (let i = 0; i < items.length; i++) {
    if (items[i].type.startsWith('image/')) {
      const f = items[i].getAsFile();
      if (f) imageFiles.push(f);
    }
  }
  if (imageFiles.length > 0) {
    readFilesAsAttachments(imageFiles, stagedReplyAttachments.value);
    showToast('Gambar dari clipboard berhasil dilampirkan ke chat!', 'info');
  }
};

const removeStagedReplyAttachment = (id: string) => {
  stagedReplyAttachments.value = stagedReplyAttachments.value.filter(a => a.id !== id);
};

// Emoji Picker Popover State
const isChatEmojiOpen = ref(false);
const isCreateEmojiOpen = ref(false);

const emojiGroups = [
  {
    title: 'Sapaan & Ekspresi',
    emojis: ['👋', '😊', '🙏', '👍', '🙌', '🤝', '🎉', '👏', '😄', '❤️']
  },
  {
    title: 'Status & Teknis',
    emojis: ['✅', '⚠️', '🚨', '🔥', '⚡', '🛠️', '🐳', '🌐', '🔒', '📸']
  },
  {
    title: 'Respons & Proses',
    emojis: ['⏳', '🔍', '💡', '🚀', '💯', '📎', '✨', '📊', '🧾', '🤔']
  }
];

const insertEmojiToChat = (emoji: string) => {
  ticketReplyText.value += emoji;
  isChatEmojiOpen.value = false;
};

const insertEmojiToCreate = (emoji: string) => {
  newTicketForm.value.message += emoji;
  isCreateEmojiOpen.value = false;
};

const quickChatReplies = [
  'Terima kasih banyak atas bantuannya 🙏',
  'Berikut saya lampirkan screenshot kendalanya 📸',
  'Sudah saya cek kembali dan sekarang berjalan normal ✅',
  'Mohon info estimasi waktu penanganannya ya ⏳'
];

// Submit Ticket from Inline Studio and scroll to Table
const ticketTableRef = ref<HTMLElement | null>(null);
const createFormCardRef = ref<HTMLElement | null>(null);
const subjectInputRef = ref<HTMLInputElement | null>(null);

const focusCreateForm = () => {
  isFormExpanded.value = true;
  nextTick(() => {
    createFormCardRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => subjectInputRef.value?.focus(), 250);
  });
};

watch(isCreateTicketModalOpen, (val) => {
  if (val) {
    isCreateTicketModalOpen.value = false;
    focusCreateForm();
  }
});

const submitNewTicketAndScroll = async () => {
  if (!newTicketForm.value.subject.trim() || !newTicketForm.value.message.trim()) {
    showToast('Harap lengkapi subjek dan rincian kendala terlebih dahulu.', 'error');
    return;
  }
  await handleCreateTicket();
  nextTick(() => {
    ticketTableRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
};

// Submit Chat Reply (with text and/or images)
const handleSendChatReply = async () => {
  if (!ticketReplyText.value.trim() && stagedReplyAttachments.value.length === 0) return;
  const attachmentsToSend = [...stagedReplyAttachments.value];
  stagedReplyAttachments.value = [];
  isChatEmojiOpen.value = false;
  await sendTicketReply(attachmentsToSend);
  scrollThreadToBottom();
};

const reopenTicket = (tkt: SupportTicketItem) => {
  tkt.status = 'in_progress';
  tkt.lastUpdated = 'Baru saja';
  showToast(`Tiket ${tkt.id} dibuka kembali untuk diskusi lanjutan.`, 'info');
};

// Auto smooth-scroll to latest message in chat modal
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
  () => [
    isTicketDetailModalOpen.value,
    selectedTicket.value?.messages?.length,
    isSupportTyping.value
  ],
  ([isOpen]) => {
    if (isOpen) {
      scrollThreadToBottom();
    } else {
      isChatEmojiOpen.value = false;
      stagedReplyAttachments.value = [];
    }
  }
);
</script>

<template>
  <section class="fade-in-section">
    <!-- 1. HEADER INTRO -->
    <div class="page-intro-row">
      <div>
        <h1 class="page-title">Pusat Bantuan & Pengaduan Layanan</h1>
        <p class="page-desc">
          Laporkan kendala kontainer mati, gangguan domain/SSL, bantuan Visual Editor, atau konfirmasi tagihan langsung ke divisi terkait dan pantau lewat Live Chat Support.
        </p>
      </div>
      <div class="header-actions" style="display: flex; align-items: center; gap: 10px;">
        <button type="button" class="btn-top-create" @click="focusCreateForm">
          <Plus :size="15" />
          <span>Buat Pengaduan Baru</span>
        </button>
      </div>
    </div>

    <!-- 2. TELEMETRY OVERVIEW CARDS -->
    <div class="stats-overview-grid">
      <div class="telemetry-card accent-emerald">
        <div class="telemetry-corner-watermark emerald"><Clock :size="58" /></div>
        <div class="telemetry-top">
          <span class="telemetry-label">WAKTU RESPONS RATA-RATA</span>
        </div>
        <div class="telemetry-val">&lt; 5 Menit <span class="badge-online">Live Chat SLA</span></div>
        <div class="telemetry-sub ready-state">
          <span class="pulse-mini-dot"></span>
          <span>Langsung terhubung ke divisi spesialis</span>
        </div>
      </div>

      <div class="telemetry-card accent-blue">
        <div class="telemetry-corner-watermark blue"><MessageSquare :size="58" /></div>
        <div class="telemetry-top">
          <span class="telemetry-label">PENGADUAN SEDANG AKTIF</span>
        </div>
        <div class="telemetry-val">
          {{ activeTicketsCount }} Tiket
          <span class="badge-growth-pill">Aktif</span>
        </div>
        <div class="telemetry-sub">
          <span>{{ openTicketsCount }} Menunggu CS • {{ inProgressTicketsCount }} Sedang Ditangani</span>
        </div>
      </div>

      <div class="telemetry-card accent-emerald">
        <div class="telemetry-corner-watermark emerald"><CheckCircle2 :size="58" /></div>
        <div class="telemetry-top">
          <span class="telemetry-label">PENGADUAN TERATASI</span>
        </div>
        <div class="telemetry-val">
          {{ resolvedTicketsCount + 12 }} Selesai
          <span class="badge-online">99.8% CSAT</span>
        </div>
        <div class="telemetry-sub"><span>Riwayat solusi & tindak lanjut tuntas</span></div>
      </div>

      <div class="telemetry-card accent-purple">
        <div class="telemetry-corner-watermark purple"><Headphones :size="58" /></div>
        <div class="telemetry-top">
          <span class="telemetry-label">DIVISI BANTUAN TERSEDIA</span>
        </div>
        <div class="telemetry-val">4 Divisi <span class="badge-growth-pill">Media & Emot</span></div>
        <div class="telemetry-sub"><span>DevOps • Customer Care • Billing • SSL</span></div>
      </div>
    </div>

    <!-- 3. EYE-CATCHING PENGADUAN & TICKET CREATION STUDIO -->
    <div ref="createFormCardRef" class="support-studio-card">
      <div class="support-studio-header" @click="isFormExpanded = !isFormExpanded">
        <div class="studio-header-left">
          <div class="studio-header-icon">
            <LifeBuoy :size="20" />
          </div>
          <div>
            <div class="studio-title-flex">
              <h2 class="studio-card-title">Buat Tiket Bantuan & Pengaduan Masalah</h2>
              <span class="studio-step-badge">Identitas Otomatis Terhubung</span>
            </div>
            <p class="studio-card-subtitle">
              Pilih tujuan divisi bantuan, tentukan kategori kendala, dan tulis rincian masalah Anda. Setelah dikirim, tiket otomatis masuk ke tabel di bawah untuk diskusi Live Chat.
            </p>
          </div>
        </div>

        <div class="studio-header-right" @click.stop>
          <div class="verified-sender-pill" title="Data pengirim diambil otomatis dari sesi login Anda">
            <div class="sender-avatar-mini">{{ tenantInitials }}</div>
            <div class="sender-pill-info">
              <strong>{{ tenantIdentity.authorName }}</strong>
              <span>{{ tenantIdentity.authorEmail }}</span>
            </div>
            <span class="verified-check-tag">
              <CheckCircle2 :size="12" />
              <span>Terverifikasi</span>
            </span>
          </div>
          <button
            type="button"
            class="btn-collapse-studio"
            @click="isFormExpanded = !isFormExpanded"
            :title="isFormExpanded ? 'Sembunyikan Formulir' : 'Tampilkan Formulir'"
          >
            <ChevronUp v-if="isFormExpanded" :size="16" />
            <ChevronDown v-else :size="16" />
          </button>
        </div>
      </div>

      <form v-if="isFormExpanded" @submit.prevent="submitNewTicketAndScroll" class="support-studio-body">
        <!-- STEP 1: PILIH DIVISI TUJUAN PENGADUAN -->
        <div class="studio-section-block">
          <div class="studio-section-label-row">
            <span class="step-num-pill">1</span>
            <span class="studio-section-label">Pilih Tujuan Pengaduan (Dikirim ke Divisi Mana?)</span>
            <span class="studio-section-hint">Pilih divisi agar laporan Anda langsung ditangani oleh spesialis yang tepat</span>
          </div>

          <div class="department-cards-grid">
            <div
              v-for="dept in departmentOptions"
              :key="dept.id"
              class="dept-select-card"
              :class="[
                `accent-${dept.accent}`,
                { active: newTicketForm.department === dept.id }
              ]"
              @click="selectDepartment(dept)"
            >
              <div class="dept-card-top">
                <div class="dept-icon-box" :class="`icon-${dept.accent}`">
                  <Server v-if="dept.accent === 'emerald'" :size="18" />
                  <Headphones v-else-if="dept.accent === 'blue'" :size="18" />
                  <CreditCard v-else-if="dept.accent === 'amber'" :size="18" />
                  <Globe v-else :size="18" />
                </div>
                <div class="dept-radio-indicator">
                  <Check v-if="newTicketForm.department === dept.id" :size="12" />
                </div>
              </div>

              <h3 class="dept-card-title">{{ dept.title }}</h3>
              <p class="dept-card-desc">{{ dept.desc }}</p>

              <div class="dept-card-footer">
                <span class="dept-agent-tag">
                  <ShieldCheck :size="11" />
                  <span>{{ dept.agentName }}</span>
                </span>
                <span class="dept-sla-tag">Respons {{ dept.sla }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- STEP 2: KATEGORI KENDALA, KONTAINER & RINCIAN MASALAH -->
        <div class="studio-section-block">
          <div class="studio-section-label-row">
            <span class="step-num-pill">2</span>
            <span class="studio-section-label">Detail Kendala & Rincian Pengaduan</span>
            <span class="studio-section-hint">
              Ditujukan ke: <strong>{{ selectedDepartmentObj.title }}</strong> (Petugas: <strong>{{ selectedDepartmentObj.agentName }}</strong>)
            </span>
          </div>

          <!-- Quick Fill Templates Row -->
          <div class="quick-templates-bar">
            <span class="quick-tpl-label">
              <Sparkles :size="12" />
              <span>Contoh Masalah Cepat:</span>
            </span>
            <div class="quick-tpl-chips">
              <button
                v-for="tpl in selectedDepartmentObj.quickTemplates"
                :key="tpl.label"
                type="button"
                class="btn-quick-tpl-chip"
                @click="applyQuickTemplate(tpl)"
              >
                {{ tpl.label }}
              </button>
            </div>
          </div>

          <div class="studio-form-grid-2">
            <!-- BESPOKE DROPDOWN 1: Kategori Kendala -->
            <div class="form-group-block" style="margin-bottom: 0;">
              <label class="input-label-row">
                <span class="label-text">Kategori Kendala</span>
                <span class="label-badge-optional">Sesuai Divisi {{ selectedDepartmentObj.shortLabel }}</span>
              </label>

              <div class="studio-custom-dropdown-wrap">
                <button
                  type="button"
                  class="studio-custom-select-btn"
                  :class="{ open: isCategoryDropdownOpen }"
                  @click.stop="isCategoryDropdownOpen = !isCategoryDropdownOpen; isContainerDropdownOpen = false; isDeptFilterDropdownOpen = false"
                >
                  <div class="custom-select-left">
                    <div class="custom-select-icon" :class="`icon-${selectedDepartmentObj.accent}`">
                      <Layers :size="15" />
                    </div>
                    <div class="custom-select-texts">
                      <span class="custom-select-main">{{ newTicketForm.category }}</span>
                      <span class="custom-select-sub">Divisi {{ selectedDepartmentObj.shortLabel }} • Petugas {{ selectedDepartmentObj.agentName }}</span>
                    </div>
                  </div>
                  <div class="custom-select-right">
                    <span class="custom-select-pill" :class="getDepartmentBadgeClass(selectedDepartmentObj.id)">
                      {{ selectedDepartmentObj.shortLabel }}
                    </span>
                    <ChevronDown :size="15" class="custom-select-chevron" :class="{ rotated: isCategoryDropdownOpen }" />
                  </div>
                </button>

                <div v-if="isCategoryDropdownOpen" class="studio-custom-select-menu" @click.stop>
                  <div class="custom-menu-group-header">
                    <span>KATEGORI KENDALA — {{ selectedDepartmentObj.shortLabel.toUpperCase() }}</span>
                  </div>
                  <button
                    v-for="cat in selectedDepartmentObj.categories"
                    :key="cat"
                    type="button"
                    class="custom-menu-item"
                    :class="{ selected: newTicketForm.category === cat }"
                    @click="selectCategoryOption(cat)"
                  >
                    <div class="menu-item-left">
                      <span class="menu-item-dot" :class="`dot-${selectedDepartmentObj.accent}`"></span>
                      <span class="menu-item-label">{{ cat }}</span>
                    </div>
                    <span v-if="newTicketForm.category === cat" class="menu-item-check">
                      <Check :size="13" />
                    </span>
                  </button>

                  <div class="custom-menu-divider"></div>
                  <div class="custom-menu-group-header">
                    <span>KATEGORI UMUM LAINNYA</span>
                  </div>
                  <button
                    type="button"
                    class="custom-menu-item"
                    :class="{ selected: newTicketForm.category === 'Pertanyaan & Bantuan Umum' }"
                    @click="selectCategoryOption('Pertanyaan & Bantuan Umum')"
                  >
                    <div class="menu-item-left">
                      <span class="menu-item-dot dot-blue"></span>
                      <span class="menu-item-label">Pertanyaan & Bantuan Umum</span>
                    </div>
                    <span v-if="newTicketForm.category === 'Pertanyaan & Bantuan Umum'" class="menu-item-check">
                      <Check :size="13" />
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <!-- BESPOKE DROPDOWN 2: Situs / Kontainer Terdampak -->
            <div class="form-group-block" style="margin-bottom: 0;">
              <label class="input-label-row">
                <span class="label-text">Situs / Kontainer Terkait</span>
                <span class="label-badge-optional">Pilih Target Layanan</span>
              </label>

              <div class="studio-custom-dropdown-wrap">
                <button
                  type="button"
                  class="studio-custom-select-btn"
                  :class="{ open: isContainerDropdownOpen }"
                  @click.stop="isContainerDropdownOpen = !isContainerDropdownOpen; isCategoryDropdownOpen = false; isDeptFilterDropdownOpen = false"
                >
                  <div class="custom-select-left">
                    <div class="custom-select-icon" :class="selectedContainerMeta.isGlobal ? 'icon-blue' : 'icon-emerald'">
                      <Globe v-if="selectedContainerMeta.isGlobal" :size="15" />
                      <Box v-else :size="15" />
                    </div>
                    <div class="custom-select-texts">
                      <span class="custom-select-main">{{ selectedContainerMeta.title }}</span>
                      <span class="custom-select-sub">{{ selectedContainerMeta.sub }}</span>
                    </div>
                  </div>
                  <div class="custom-select-right">
                    <span class="custom-select-status-pill" :class="selectedContainerMeta.statusClass">
                      <span class="status-mini-dot"></span>
                      <span>{{ selectedContainerMeta.statusLabel }}</span>
                    </span>
                    <ChevronDown :size="15" class="custom-select-chevron" :class="{ rotated: isContainerDropdownOpen }" />
                  </div>
                </button>

                <div v-if="isContainerDropdownOpen" class="studio-custom-select-menu" @click.stop>
                  <div class="custom-menu-group-header">
                    <span>CAKUPAN LAYANAN AKUN</span>
                  </div>
                  <button
                    type="button"
                    class="custom-menu-item"
                    :class="{ selected: newTicketForm.containerName === 'Semua Layanan / Akun Tenant' }"
                    @click="selectContainerOption('Semua Layanan / Akun Tenant')"
                  >
                    <div class="menu-item-left">
                      <div class="menu-item-icon-mini icon-blue">
                        <Globe :size="13" />
                      </div>
                      <div class="menu-item-text-col">
                        <span class="menu-item-label">Semua Layanan / Akun Tenant Umum</span>
                        <span class="menu-item-sub">Pengaduan umum, tagihan, atau seluruh layanan akun</span>
                      </div>
                    </div>
                    <span v-if="newTicketForm.containerName === 'Semua Layanan / Akun Tenant'" class="menu-item-check">
                      <Check :size="13" />
                    </span>
                  </button>

                  <div class="custom-menu-divider"></div>
                  <div class="custom-menu-group-header">
                    <span>KONTAINER SITUS AKTIF ({{ containers.length }})</span>
                  </div>
                  <button
                    v-for="cnt in containers"
                    :key="cnt.id"
                    type="button"
                    class="custom-menu-item"
                    :class="{ selected: newTicketForm.containerName === `${cnt.name} (${cnt.subdomain})` }"
                    @click="selectContainerOption(`${cnt.name} (${cnt.subdomain})`)"
                  >
                    <div class="menu-item-left">
                      <div class="menu-item-icon-mini" :class="cnt.status === 'running' ? 'icon-emerald' : 'icon-amber'">
                        <Server :size="13" />
                      </div>
                      <div class="menu-item-text-col">
                        <span class="menu-item-label">{{ cnt.name }}</span>
                        <code class="menu-item-domain">{{ cnt.subdomain }}</code>
                      </div>
                    </div>
                    <div class="menu-item-right-group">
                      <span class="custom-select-status-pill" :class="cnt.status === 'running' ? 'pill-running' : 'pill-stopped'">
                        <span class="status-mini-dot"></span>
                        <span>{{ cnt.status === 'running' ? 'Running' : 'Standby/Down' }}</span>
                      </span>
                      <span v-if="newTicketForm.containerName === `${cnt.name} (${cnt.subdomain})`" class="menu-item-check">
                        <Check :size="13" />
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Judul / Subjek Masalah -->
          <div class="form-group-block" style="margin-top: 14px; margin-bottom: 14px;">
            <label class="input-label-row">
              <span class="label-text">Subjek / Judul Pengaduan</span>
              <span class="label-badge-optional">Wajib Diisi</span>
            </label>
            <input
              ref="subjectInputRef"
              v-model="newTicketForm.subject"
              type="text"
              class="form-text-input"
              placeholder="Contoh: Kontainer situs Toko Kopi tiba-tiba mati dan tidak bisa diakses..."
              required
            />
          </div>

          <!-- Rincian Kendala -->
          <div class="form-group-block" style="margin-bottom: 14px;">
            <label class="input-label-row">
              <span class="label-text">Rincian Kendala yang Dialami</span>
              <span class="label-badge-optional">Wajib Diisi</span>
            </label>
            <div class="create-textarea-container">
              <textarea
                v-model="newTicketForm.message"
                rows="3"
                class="form-text-input textarea-input"
                placeholder="Ceritakan detail kendala yang Anda alami, pesan error yang muncul, atau bantuan yang dibutuhkan dari tim kami..."
                required
              ></textarea>

              <!-- Staged Attachments in Create Form -->
              <div v-if="newTicketForm.attachments.length > 0" class="staged-attachments-strip">
                <div
                  v-for="att in newTicketForm.attachments"
                  :key="att.id"
                  class="staged-att-item"
                >
                  <img :src="att.dataUrl" :alt="att.name" class="staged-att-thumb" @click="lightboxImage = att" />
                  <div class="staged-att-meta">
                    <span class="staged-att-name">{{ att.name }}</span>
                    <span class="staged-att-size">{{ att.size }}</span>
                  </div>
                  <button type="button" class="btn-remove-att" @click="removeCreateAttachment(att.id)" title="Hapus gambar">
                    <X :size="12" />
                  </button>
                </div>
              </div>

              <!-- Bottom Toolbar inside Create Form -->
              <div class="create-form-Booking-bar">
                <div class="create-Booking-left">
                  <input
                    ref="createFileInputRef"
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    multiple
                    style="display: none;"
                    @change="handleCreateAttachmentChange"
                  />
                  <button
                    type="button"
                    class="btn-composer-tool"
                    @click="createFileInputRef?.click()"
                    title="Lampirkan Tangkapan Layar / Gambar Bukti Kendala"
                  >
                    <ImageIcon :size="14" />
                    <span>Lampirkan Gambar / Screenshot</span>
                  </button>

                  <div class="emoji-popover-anchor">
                    <button
                      type="button"
                      class="btn-composer-tool"
                      @click.stop="isCreateEmojiOpen = !isCreateEmojiOpen; isChatEmojiOpen = false"
                      title="Sisipkan Emotikon"
                    >
                      <Smile :size="14" />
                      <span>Emotikon</span>
                    </button>

                    <div v-if="isCreateEmojiOpen" class="emoji-picker-popover create-emoji-pos" @click.stop>
                      <div class="emoji-popover-header">
                        <span>Pilih Emotikon</span>
                        <button type="button" class="btn-close-mini" @click="isCreateEmojiOpen = false">
                          <X :size="12" />
                        </button>
                      </div>
                      <div v-for="grp in emojiGroups" :key="grp.title" class="emoji-group-sec">
                        <div class="emoji-group-lbl">{{ grp.title }}</div>
                        <div class="emoji-grid-row">
                          <button
                            v-for="em in grp.emojis"
                            :key="em"
                            type="button"
                            class="btn-emoji-item"
                            @click="insertEmojiToCreate(em)"
                          >
                            {{ em }}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="create-Booking-right">
                  <span class="auto-user-note">
                    <Mail :size="12" />
                    <span>Pengirim otomatis: <strong>{{ tenantIdentity.authorEmail }}</strong></span>
                  </span>
                  <button type="submit" class="btn-submit-pengaduan">
                    <Send :size="14" />
                    <span>Kirim Tiket Bantuan</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>

    <!-- 4. TABEL RIWAYAT PENGADUAN & TIKET SUPPORT (DI BAWAH FORM) -->
    <div ref="ticketTableRef" class="ticketing-panel">
      <div class="ticketing-table-header">
        <div>
          <h3 class="table-section-title">Daftar Tiket Bantuan & Riwayat Pengaduan Anda</h3>
          <p class="table-section-desc">
            Klik tombol <strong>Lihat Thread & Chat</strong> pada baris tiket untuk berdiskusi langsung seperti WhatsApp, mengirim gambar screenshot, atau emotikon dengan Customer Support.
          </p>
        </div>
        <span class="table-count-pill">Total {{ filteredTickets.length }} Tiket</span>
      </div>

      <!-- Toolbar Filters -->
      <div class="ticketing-toolbar">
        <div class="search-box">
          <Search :size="14" class="search-icon" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari nomor tiket (TKT-...), subjek kendala, kontainer, atau nama petugas..."
            class="search-input"
          />
        </div>

        <div class="toolbar-filters-group">
          <div class="status-tabs-pill">
            <button
              type="button"
              class="btn-tab-pill"
              :class="{ active: statusFilter === 'all' }"
              @click="statusFilter = 'all'"
            >
              Semua ({{ supportTickets.length }})
            </button>
            <button
              type="button"
              class="btn-tab-pill"
              :class="{ active: statusFilter === 'open' }"
              @click="statusFilter = 'open'"
            >
              Menunggu CS ({{ openTicketsCount }})
            </button>
            <button
              type="button"
              class="btn-tab-pill"
              :class="{ active: statusFilter === 'in_progress' }"
              @click="statusFilter = 'in_progress'"
            >
              Ditangani ({{ inProgressTicketsCount }})
            </button>
            <button
              type="button"
              class="btn-tab-pill"
              :class="{ active: statusFilter === 'resolved' }"
              @click="statusFilter = 'resolved'"
            >
              Selesai ({{ resolvedTicketsCount }})
            </button>
          </div>

          <!-- BESPOKE DROPDOWN 3: Filter Divisi Tujuan -->
          <div class="studio-custom-dropdown-wrap toolbar-dropdown-wrap">
            <button
              type="button"
              class="studio-filter-dropdown-btn"
              :class="{ open: isDeptFilterDropdownOpen }"
              @click.stop="isDeptFilterDropdownOpen = !isDeptFilterDropdownOpen; isCategoryDropdownOpen = false; isContainerDropdownOpen = false"
            >
              <Layers :size="13" class="filter-btn-icon" />
              <span>{{ selectedDeptFilterLabel }}</span>
              <ChevronDown :size="13" class="custom-select-chevron" :class="{ rotated: isDeptFilterDropdownOpen }" />
            </button>

            <div v-if="isDeptFilterDropdownOpen" class="studio-custom-select-menu toolbar-filter-menu" @click.stop>
              <div class="custom-menu-group-header">
                <span>FILTER DIVISI TUJUAN</span>
              </div>
              <button
                type="button"
                class="custom-menu-item"
                :class="{ selected: departmentFilter === 'all' }"
                @click="selectDeptFilterOption('all')"
              >
                <div class="menu-item-left">
                  <span class="menu-item-dot dot-slate"></span>
                  <span class="menu-item-label">Semua Divisi Tujuan</span>
                </div>
                <span v-if="departmentFilter === 'all'" class="menu-item-check">
                  <Check :size="13" />
                </span>
              </button>
              <button
                v-for="dept in departmentOptions"
                :key="dept.id"
                type="button"
                class="custom-menu-item"
                :class="{ selected: departmentFilter === dept.id }"
                @click="selectDeptFilterOption(dept.id)"
              >
                <div class="menu-item-left">
                  <span class="menu-item-dot" :class="`dot-${dept.accent}`"></span>
                  <span class="menu-item-label">{{ dept.shortLabel }}</span>
                </div>
                <span v-if="departmentFilter === dept.id" class="menu-item-check">
                  <Check :size="13" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Structured Enterprise Table -->
      <div v-if="filteredTickets.length > 0" style="overflow-x: auto;">
        <table class="ledger-table support-ledger-table">
          <thead>
            <tr>
              <th style="width: 130px;">ID TIKET & WAKTU</th>
              <th style="width: 220px;">TUJUAN & KATEGORI</th>
              <th>SUBJEK & RINGKASAN DISKUSI</th>
              <th style="width: 195px;">PETUGAS SUPPORT</th>
              <th style="width: 155px;">STATUS</th>
              <th style="width: 190px; text-align: right;">DISKUSI / THREAD</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="tkt in filteredTickets"
              :key="tkt.id"
              class="support-table-row"
              @click="openTicketDetail(tkt)"
            >
              <!-- Col 1: Ticket ID & Time -->
              <td>
                <div class="tkt-id-cell">
                  <code class="tkt-code-badge">{{ tkt.id }}</code>
                  <span class="tkt-time-sub">
                    <Clock :size="11" />
                    <span>{{ tkt.lastUpdated }}</span>
                  </span>
                </div>
              </td>

              <!-- Col 2: Department & Category -->
              <td>
                <div class="tkt-dept-cell">
                  <span class="dept-pill-badge" :class="getDepartmentBadgeClass(tkt.department)">
                    {{ tkt.department || 'Technical & Container (DevOps)' }}
                  </span>
                  <span class="tkt-cat-sub">{{ tkt.category }}</span>
                </div>
              </td>

              <!-- Col 3: Subject, Container & Last Message Preview -->
              <td>
                <div class="tkt-subject-cell">
                  <div class="tkt-subject-line">
                    <span class="tkt-subject-title">{{ tkt.subject }}</span>
                    <span v-if="getTicketAttachmentsCount(tkt) > 0" class="tkt-att-indicator" title="Memiliki lampiran gambar">
                      <Paperclip :size="11" />
                      <span>{{ getTicketAttachmentsCount(tkt) }}</span>
                    </span>
                  </div>
                  <p class="tkt-snippet-preview">{{ getLatestMessageSnippet(tkt) }}</p>
                  <div class="tkt-context-tags">
                    <span v-if="tkt.containerName" class="tkt-cnt-mini-tag">
                      <Box :size="10" />
                      <span>{{ tkt.containerName }}</span>
                    </span>
                  </div>
                </div>
              </td>

              <!-- Col 4: Assigned Support Specialist -->
              <td>
                <div class="tkt-agent-cell">
                  <div class="agent-avatar-circle">
                    {{ getAgentInitials(tkt.assignedEngineer) }}
                    <span class="agent-online-dot"></span>
                  </div>
                  <div class="agent-meta-col">
                    <strong class="agent-name-txt">{{ tkt.assignedEngineer || 'Tim Support Siaga' }}</strong>
                    <span class="agent-role-txt">{{ tkt.assignedRole || 'Support Specialist' }}</span>
                  </div>
                </div>
              </td>

              <!-- Col 5: Status -->
              <td>
                <span class="status-chip" :class="'chip-' + tkt.status">
                  <span class="status-dot"></span>
                  <span>{{ getStatusLabel(tkt.status) }}</span>
                </span>
              </td>

              <!-- Col 6: Actions / Open Chat Thread -->
              <td style="text-align: right;" @click.stop>
                <div class="tkt-actions-cell">
                  <button
                    v-if="tkt.status !== 'resolved'"
                    type="button"
                    class="btn-resolve-quick"
                    @click="resolveTicket(tkt)"
                    title="Tandai Masalah Selesai"
                  >
                    <Check :size="13" />
                  </button>
                  <button
                    type="button"
                    class="btn-open-thread"
                    @click="openTicketDetail(tkt)"
                  >
                    <MessageSquare :size="13" />
                    <span>Lihat Thread ({{ tkt.messages?.length || 1 }})</span>
                    <ChevronRight :size="13" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-tickets-state">
        <LifeBuoy :size="38" class="empty-icon" />
        <h4>Tidak ada tiket pengaduan yang cocok dengan filter</h4>
        <p>Gunakan formulir di atas untuk membuat pengaduan baru ke tim Customer Support atau DevOps.</p>
        <button type="button" class="btn-top-create" @click="focusCreateForm">
          <Plus :size="14" />
          <span>Buat Pengaduan Baru</span>
        </button>
      </div>
    </div>

    <!-- 5. MODAL BESAR: WHATSAPP-MODEL LIVE CHAT DALAM TEMA TENANT HEROCMS STUDIO (1140px WIDE, 2 COLUMNS) -->
    <Teleport to="body">
      <div
        v-if="isTicketDetailModalOpen && selectedTicket"
        class="modal-backdrop"
        @click.self="isTicketDetailModalOpen = false"
      >
        <div class="modal-dialog modal-dialog-support-xl">
          <!-- Modal Top Header -->
          <div class="modal-header support-chat-modal-header">
            <div class="modal-header-leading">
              <div class="modal-header-icon-box" style="background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe;">
                <MessageSquare :size="19" />
              </div>
              <div>
                <div class="thread-header-meta">
                  <span class="thread-id">{{ selectedTicket.id }}</span>
                  <span class="dept-pill-badge" :class="getDepartmentBadgeClass(selectedTicket.department)">
                    {{ selectedTicket.department || 'Technical & Container (DevOps)' }}
                  </span>
                  <span class="status-chip" :class="'chip-' + selectedTicket.status">
                    <span class="status-dot"></span>
                    <span>{{ getStatusLabel(selectedTicket.status) }}</span>
                  </span>
                </div>
                <h3 class="modal-heading thread-title">{{ selectedTicket.subject }}</h3>
              </div>
            </div>

            <div class="chat-header-right-actions">
              <button
                v-if="selectedTicket.status !== 'resolved'"
                type="button"
                class="btn-resolve-in-header"
                @click="resolveTicket(selectedTicket)"
                title="Tandai Masalah Selesai"
              >
                <CheckCircle2 :size="14" />
                <span>Tandai Selesai</span>
              </button>
              <button
                v-else
                type="button"
                class="btn-reopen-ticket"
                @click="reopenTicket(selectedTicket)"
              >
                <RotateCcw :size="13" />
                <span>Buka Kembali Chat</span>
              </button>
              <button
                type="button"
                class="modal-close-button"
                @click="isTicketDetailModalOpen = false"
                title="Tutup Ruang Chat"
              >
                <X :size="16" />
              </button>
            </div>
          </div>

          <!-- 2-Column Workspace Body -->
          <div class="support-chat-workspace">
            <!-- LEFT COLUMN: UNIFIED CHAT STREAM & INLINE CHAT DOCK -->
            <div class="support-chat-main-col">
              <!-- Active Counterpart Presence Bar -->
              <div class="wa-counterpart-topbar">
                <div class="wa-counterpart-left">
                  <div class="wa-agent-avatar">
                    {{ getAgentInitials(selectedTicket.assignedEngineer) }}
                    <span class="wa-online-ring"></span>
                  </div>
                  <div class="wa-counterpart-info">
                    <div class="wa-counterpart-name-row">
                      <strong>{{ selectedTicket.assignedEngineer || 'Budi Hartono' }}</strong>
                      <span class="wa-verified-role-pill">
                        <ShieldCheck :size="11" />
                        <span>{{ selectedTicket.assignedRole || 'Support Specialist' }}</span>
                      </span>
                    </div>
                    <!-- Live Typing Status or Online Status in Header -->
                    <div v-if="isSupportTyping" class="wa-header-typing-status">
                      <span class="wa-typing-mini-dots">
                        <span></span><span></span><span></span>
                      </span>
                      <span>sedang mengetik balasan...</span>
                    </div>
                    <div v-else class="wa-header-online-status">
                      <span>Online • Terhubung ke {{ selectedTicket.department || 'Support' }}</span>
                    </div>
                  </div>
                </div>

                <div class="wa-counterpart-right">
                  <span class="wa-context-chip">
                    <Box :size="11" />
                    <span>{{ selectedTicket.containerName || 'Semua Layanan' }}</span>
                  </span>
                </div>
              </div>

              <!-- Unified Chat Canvas (Messages + Integrated Bottom Chat Capsule) -->
              <div class="wa-unified-chat-surface">
                <!-- Scrollable Messages Stream -->
                <div ref="threadScrollRef" class="ticket-thread-scroll wa-chat-canvas">
                  <!-- Date Divider Pill -->
                  <div class="wa-date-divider-row">
                    <span class="wa-date-pill">{{ getThreadDateDivider(selectedTicket) }}</span>
                  </div>

                  <!-- Security & Identity Verification Notice Banner -->
                  <div class="wa-encryption-banner">
                    <Lock :size="12" class="wa-lock-icon" />
                    <span>
                      Percakapan resmi dengan <strong>{{ selectedTicket.assignedEngineer || 'Tim Support' }}</strong>. Identitas Anda terhubung sebagai <strong>{{ selectedTicket.reporterName || tenantIdentity.authorName }} ({{ selectedTicket.reporterEmail || tenantIdentity.authorEmail }})</strong>.
                    </span>
                  </div>

                  <div class="conversation-stream wa-conversation-stream">
                    <div
                      v-for="msg in selectedTicket.messages"
                      :key="msg.id"
                      class="wa-msg-row"
                      :class="msg.sender === 'tenant' ? 'wa-row-outgoing' : 'wa-row-incoming'"
                    >
                      <!-- Avatar for Lawan Bicara / Support (Left Side) -->
                      <div v-if="msg.sender === 'support'" class="wa-msg-avatar incoming-av">
                        {{ getAgentInitials(msg.authorName) }}
                      </div>

                      <!-- Speech Bubble -->
                      <div
                        class="wa-bubble-card"
                        :class="msg.sender === 'tenant' ? 'wa-bubble-outgoing' : 'wa-bubble-incoming'"
                      >
                        <!-- Speech Bubble Tail -->
                        <span v-if="msg.sender === 'support'" class="wa-tail-in"></span>
                        <span v-else class="wa-tail-out"></span>

                        <!-- Bubble Sender Header -->
                        <div class="wa-bubble-sender-head">
                          <strong class="wa-sender-name" :class="msg.sender === 'support' ? 'name-support' : 'name-tenant'">
                            {{ msg.sender === 'support' ? msg.authorName : `Anda (${msg.authorName})` }}
                          </strong>
                          <span class="wa-sender-role-tag" :class="msg.sender === 'support' ? 'role-support' : 'role-tenant'">
                            {{ msg.sender === 'support' ? msg.authorRole : (msg.authorEmail || tenantIdentity.authorEmail) }}
                          </span>
                        </div>

                        <!-- Attached Images inside Message Bubble -->
                        <div v-if="msg.attachments && msg.attachments.length > 0" class="wa-attachments-grid">
                          <div
                            v-for="att in msg.attachments"
                            :key="att.id"
                            class="chat-image-card wa-image-frame"
                            @click="lightboxImage = att"
                            title="Klik untuk memperbesar gambar"
                          >
                            <img :src="att.dataUrl" :alt="att.name" class="chat-attached-img" />
                            <div class="chat-image-caption">
                              <div class="caption-left">
                                <ImageIcon :size="12" />
                                <span class="caption-name">{{ att.name }}</span>
                              </div>
                              <span class="caption-size">{{ att.size }}</span>
                            </div>
                          </div>
                        </div>

                        <!-- Message Text -->
                        <div v-if="msg.message" class="wa-bubble-text">{{ msg.message }}</div>

                        <!-- Bubble Bottom Metadata: Time + Centang 1 / Centang 2 / Centang Biru + Jam & Tanggal Read -->
                        <div class="wa-bubble-footer" :class="msg.sender === 'tenant' ? 'footer-outgoing' : 'footer-incoming'">
                          <span class="wa-msg-time">{{ msg.timestamp }}</span>

                          <!-- Outgoing Delivery & Read Receipt Status (Centang 1, 2, & Biru) -->
                          <template v-if="msg.sender === 'tenant'">
                            <!-- 1. CENTANG 1 ABU-ABU (Sent) -->
                            <span
                              v-if="msg.deliveryStatus === 'sent'"
                              class="wa-receipt-pill status-sent"
                              title="Pesan terkirim ke server"
                            >
                              <svg class="wa-tick-svg tick-grey" viewBox="0 0 16 11" width="14" height="10" fill="none">
                                <path d="M11.5 1.5L5.2 8.2L2.5 5.4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                              </svg>
                              <span>Terkirim</span>
                            </span>

                            <!-- 2. CENTANG 2 ABU-ABU (Delivered) -->
                            <span
                              v-else-if="msg.deliveryStatus === 'delivered'"
                              class="wa-receipt-pill status-delivered"
                              title="Pesan sudah sampai di perangkat Customer Support"
                            >
                              <svg class="wa-tick-svg tick-grey" viewBox="0 0 18 11" width="16" height="11" fill="none">
                                <path d="M11.8 1.5L5.5 8.5L2.2 5.2" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M16.2 1.5L9.9 8.5L8.1 6.7" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" />
                              </svg>
                              <span>Tersampaikan</span>
                            </span>

                            <!-- 3. CENTANG 2 BIRU MENYALA (Read + Jam / Tanggal Bulan Tahun) -->
                            <span
                              v-else
                              class="wa-receipt-pill status-read"
                              :title="`Dibaca oleh ${selectedTicket.assignedEngineer || 'Customer Support'} pada ${formatReadReceiptText(msg)}`"
                            >
                              <svg class="wa-tick-svg tick-blue" viewBox="0 0 18 11" width="16" height="11" fill="none">
                                <path d="M11.8 1.5L5.5 8.5L2.2 5.2" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M16.2 1.5L9.9 8.5L8.1 6.7" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" />
                              </svg>
                              <span class="wa-read-time-text">Dibaca {{ formatReadReceiptText(msg) }}</span>
                            </span>
                          </template>
                        </div>
                      </div>

                      <!-- Avatar for Anda / Tenant (Right Side) -->
                      <div v-if="msg.sender === 'tenant'" class="wa-msg-avatar outgoing-av">
                        {{ tenantInitials }}
                      </div>
                    </div>

                    <!-- TYPING INDICATOR DI SISI LAWAN BICARA (LEFT SIDE INCOMING BUBBLE) -->
                    <div v-if="isSupportTyping" class="wa-msg-row wa-row-incoming wa-typing-entry">
                      <div class="wa-msg-avatar incoming-av">
                        {{ getAgentInitials(selectedTicket.assignedEngineer) }}
                      </div>
                      <div class="wa-bubble-card wa-bubble-incoming wa-typing-bubble-card">
                        <span class="wa-tail-in"></span>
                        <div class="wa-bubble-sender-head" style="margin-bottom: 4px;">
                          <strong class="wa-sender-name name-support">
                            {{ selectedTicket.assignedEngineer || 'Customer Support' }}
                          </strong>
                          <span class="wa-sender-role-tag role-support">
                            {{ selectedTicket.assignedRole || 'Support Specialist' }}
                          </span>
                        </div>
                        <div class="wa-typing-indicator-body">
                          <div class="wa-bouncing-dots">
                            <span class="wa-dot"></span>
                            <span class="wa-dot"></span>
                            <span class="wa-dot"></span>
                          </div>
                          <span class="wa-typing-caption">sedang mengetik balasan...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- UNIFIED CHAT INPUT DOCK (SEAMLESSLY INTEGRATED WITH CHAT STREAM) -->
                <div class="wa-unified-chat-dock">
                  <template v-if="selectedTicket.status !== 'resolved'">
                    <!-- Quick Suggestion Chips Floating Above Capsule -->
                    <div class="quick-chat-chips-row">
                      <button
                        v-for="qr in quickChatReplies"
                        :key="qr"
                        type="button"
                        class="btn-quick-chat-chip"
                        @click="ticketReplyText = qr"
                      >
                        {{ qr }}
                      </button>
                    </div>

                    <!-- Single Integrated Chat Input Capsule -->
                    <div class="wa-chat-capsule-box">
                      <!-- Staged Image Previews Inside Top of Capsule -->
                      <div v-if="stagedReplyAttachments.length > 0" class="staged-attachments-strip capsule-staged-strip">
                        <div
                          v-for="att in stagedReplyAttachments"
                          :key="att.id"
                          class="staged-att-item"
                        >
                          <img :src="att.dataUrl" :alt="att.name" class="staged-att-thumb" @click="lightboxImage = att" />
                          <div class="staged-att-meta">
                            <span class="staged-att-name">{{ att.name }}</span>
                            <span class="staged-att-size">{{ att.size }}</span>
                          </div>
                          <button
                            type="button"
                            class="btn-remove-att"
                            @click="removeStagedReplyAttachment(att.id)"
                            title="Batal lampirkan gambar ini"
                          >
                            <X :size="12" />
                          </button>
                        </div>
                      </div>

                      <!-- Main Inline Input Row: [Emoji] [Image] [Seamless Input] [Send] -->
                      <div class="wa-capsule-input-row">
                        <div class="wa-capsule-left-icons">
                          <!-- Emoji Picker Trigger -->
                          <div class="emoji-popover-anchor">
                            <button
                              type="button"
                              class="btn-capsule-icon"
                              :class="{ active: isChatEmojiOpen }"
                              @click.stop="isChatEmojiOpen = !isChatEmojiOpen; isCreateEmojiOpen = false"
                              title="Sisipkan Emotikon"
                            >
                              <Smile :size="18" />
                            </button>

                            <div v-if="isChatEmojiOpen" class="emoji-picker-popover chat-emoji-pos" @click.stop>
                              <div class="emoji-popover-header">
                                <span>Kirim Emotikon ke Chat</span>
                                <button type="button" class="btn-close-mini" @click="isChatEmojiOpen = false">
                                  <X :size="12" />
                                </button>
                              </div>
                              <div v-for="grp in emojiGroups" :key="grp.title" class="emoji-group-sec">
                                <div class="emoji-group-lbl">{{ grp.title }}</div>
                                <div class="emoji-grid-row">
                                  <button
                                    v-for="em in grp.emojis"
                                    :key="em"
                                    type="button"
                                    class="btn-emoji-item"
                                    @click="insertEmojiToChat(em)"
                                  >
                                    {{ em }}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          <!-- Hidden Image Input & Upload Icon Trigger -->
                          <input
                            ref="chatFileInputRef"
                            type="file"
                            accept="image/png,image/jpeg,image/webp,image/gif"
                            multiple
                            style="display: none;"
                            @change="handleChatAttachmentChange"
                          />
                          <button
                            type="button"
                            class="btn-capsule-icon"
                            @click="chatFileInputRef?.click()"
                            title="Lampirkan Gambar / Screenshot (PNG, JPG, WEBP)"
                          >
                            <ImageIcon :size="18" />
                          </button>
                        </div>

                        <!-- Seamless Inline Chat Input -->
                        <textarea
                          v-model="ticketReplyText"
                          rows="1"
                          placeholder="Ketik pesan balasan atau tempel (paste) screenshot..."
                          class="wa-capsule-textarea"
                          @paste="handleChatPaste"
                          @keydown.enter.exact.prevent="handleSendChatReply"
                          @keydown.enter.ctrl.prevent="handleSendChatReply"
                          @keydown.enter.meta.prevent="handleSendChatReply"
                        ></textarea>

                        <!-- Inline Send Button -->
                        <button
                          type="button"
                          class="btn-capsule-send"
                          :disabled="!ticketReplyText.trim() && stagedReplyAttachments.length === 0"
                          @click="handleSendChatReply"
                          title="Kirim Pesan (Enter)"
                        >
                          <Send :size="15" />
                          <span>Kirim</span>
                        </button>
                      </div>
                    </div>
                  </template>

                  <!-- Resolved Banner Inside Dock -->
                  <div v-else class="resolved-callout-banner">
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <CheckCircle2 :size="16" class="text-green" />
                      <span>Tiket pengaduan ini telah ditandai <strong>Selesai (Resolved)</strong>.</span>
                    </div>
                    <button type="button" class="btn-reopen-ticket" @click="reopenTicket(selectedTicket)">
                      <RotateCcw :size="13" />
                      <span>Buka Kembali Chat</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- RIGHT COLUMN: ACCURATE TICKET & REPORTER INFORMATION SIDEBAR -->
            <aside class="support-chat-info-sidebar">
              <!-- Card 1: Identitas Pengirim (Otomatis) -->
              <div class="chat-info-card">
                <div class="chat-info-card-title">
                  <User :size="13" />
                  <span>IDENTITAS PELAPOR (TERVERIFIKASI)</span>
                </div>
                <div class="reporter-profile-box">
                  <div class="reporter-avatar-lg">{{ tenantInitials }}</div>
                  <div class="reporter-profile-meta">
                    <strong>{{ selectedTicket.reporterName || tenantIdentity.authorName }}</strong>
                    <span>{{ selectedTicket.reporterEmail || tenantIdentity.authorEmail }}</span>
                    <span class="reporter-plan-tag">Paket {{ userPlan.name }}</span>
                  </div>
                </div>
              </div>

              <!-- Card 2: Detail Informasi Pengaduan -->
              <div class="chat-info-card">
                <div class="chat-info-card-title">
                  <Layers :size="13" />
                  <span>RINCIAN PENGADUAN & ROUTING</span>
                </div>
                <div class="chat-info-kv-list">
                  <div class="chat-info-kv">
                    <span class="kv-label">Nomor Tiket</span>
                    <code class="kv-code">{{ selectedTicket.id }}</code>
                  </div>
                  <div class="chat-info-kv">
                    <span class="kv-label">Divisi Tujuan</span>
                    <strong class="kv-val text-blue">{{ selectedTicket.department || 'Technical & Container (DevOps)' }}</strong>
                  </div>
                  <div class="chat-info-kv">
                    <span class="kv-label">Kategori Kendala</span>
                    <strong class="kv-val">{{ selectedTicket.category }}</strong>
                  </div>
                  <div class="chat-info-kv">
                    <span class="kv-label">Situs / Kontainer</span>
                    <strong class="kv-val">{{ selectedTicket.containerName || 'Semua Layanan / Umum' }}</strong>
                  </div>
                  <div class="chat-info-kv">
                    <span class="kv-label">Waktu Pengaduan</span>
                    <span class="kv-val">{{ selectedTicket.createdAt }}</span>
                  </div>
                  <div class="chat-info-kv">
                    <span class="kv-label">Pembaruan Terakhir</span>
                    <span class="kv-val">{{ selectedTicket.lastUpdated }}</span>
                  </div>
                  <div class="chat-info-kv">
                    <span class="kv-label">Total Percakapan</span>
                    <span class="kv-val">{{ selectedTicket.messages?.length || 0 }} Pesan</span>
                  </div>
                </div>
              </div>

              <!-- Card 3: Petugas Penangan (CS / Engineer) -->
              <div class="chat-info-card">
                <div class="chat-info-card-title">
                  <ShieldCheck :size="13" />
                  <span>PETUGAS PENANGAN (CS / ENGINEER)</span>
                </div>
                <div class="assigned-specialist-box">
                  <div class="agent-avatar-circle lg">
                    {{ getAgentInitials(selectedTicket.assignedEngineer) }}
                    <span class="agent-online-dot"></span>
                  </div>
                  <div class="assigned-spec-info">
                    <strong>{{ selectedTicket.assignedEngineer || 'Budi Hartono' }}</strong>
                    <span>{{ selectedTicket.assignedRole || 'Support Specialist' }}</span>
                    <span v-if="isSupportTyping" class="sla-typing-text">💬 Sedang mengetik balasan...</span>
                    <span v-else class="sla-online-text">● Aktif di Ruang Chat</span>
                  </div>
                </div>
              </div>

              <!-- Card 4: Galeri Gambar Terlampir di Chat -->
              <div class="chat-info-card">
                <div class="chat-info-card-title">
                  <ImageIcon :size="13" />
                  <span>LAMPIRAN GAMBAR DI CHAT ({{ currentThreadAttachments.length }})</span>
                </div>
                <div v-if="currentThreadAttachments.length > 0" class="sidebar-attachments-grid">
                  <div
                    v-for="att in currentThreadAttachments"
                    :key="att.id"
                    class="sidebar-att-thumb-card"
                    @click="lightboxImage = att"
                    :title="`Lihat ${att.name} (${att.size})`"
                  >
                    <img :src="att.dataUrl" :alt="att.name" />
                    <div class="sidebar-att-overlay">
                      <Eye :size="13" />
                    </div>
                  </div>
                </div>
                <p v-else class="sidebar-empty-att">
                  Belum ada gambar/screenshot yang dikirim di ruang chat ini.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- 6. LIGHTBOX PREVIEW GAMBAR PENUH -->
    <Teleport to="body">
      <div v-if="lightboxImage" class="modal-backdrop" style="z-index: 100005;" @click.self="lightboxImage = null">
        <div class="lightbox-preview-dialog">
          <div class="lightbox-header">
            <div class="lightbox-title-group">
              <ImageIcon :size="16" />
              <strong>{{ lightboxImage.name }}</strong>
              <span>({{ lightboxImage.size }})</span>
            </div>
            <button type="button" class="modal-close-button" @click="lightboxImage = null">
              <X :size="16" />
            </button>
          </div>
          <div class="lightbox-body">
            <img :src="lightboxImage.dataUrl" :alt="lightboxImage.name" class="lightbox-full-img" />
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>
