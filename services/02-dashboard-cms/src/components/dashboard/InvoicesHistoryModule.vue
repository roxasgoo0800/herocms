<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  Clock,
  CheckCircle2,
  CreditCard,
  Receipt,
  Download,
  Check,
  Layers,
  X,
  Printer,
  ShieldCheck,
  Search,
  FileSpreadsheet,
  FileText
} from 'lucide-vue-next';
import { useDashboardData } from '../../composables/useDashboardData';

const {
  invoices,
  userEmail,
  selectedInvoice,
  isInvoiceDetailModalOpen,
  openInvoiceDetail,
  downloadInvoiceReceipt,
  showToast
} = useDashboardData();

const searchQuery = ref('');
const selectedYear = ref<'2026' | '2025' | 'all'>('2026');

const filteredInvoices = computed(() => {
  return invoices.value.filter(inv => {
    const matchesSearch = inv.id.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          inv.planName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          inv.paymentMethod.toLowerCase().includes(searchQuery.value.toLowerCase());
    if (!matchesSearch) return false;
    if (selectedYear.value === 'all') return true;
    return inv.date.includes(selectedYear.value);
  });
});

const handleExportCSV = () => {
  const headers = ['No Faktur', 'Tanggal', 'Paket', 'Metode Bayar', 'Subtotal', 'PPN 11%', 'Total', 'Status'];
  const rows = filteredInvoices.value.map(inv => [
    inv.id,
    inv.date,
    inv.planName,
    inv.paymentMethod,
    inv.amount,
    inv.tax,
    inv.total,
    'LUNAS'
  ]);
  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `HeroCMS_Billing_Report_${selectedYear.value}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('Laporan billing CSV berhasil diekspor!', 'success');
};

const handlePrintInvoice = () => {
  window.print();
};
</script>

<template>
  <section class="fade-in-section">
    <!-- Header Intro -->
    <div class="page-intro-row">
      <div>
        <h1 class="page-title">Faktur & Riwayat Invoice Resmi</h1>
        <p class="page-desc">Dokumen penagihan sah ber-NPWP PT Hero Digital Multitek untuk pembukuan akuntansi dan rekonsiliasi pajak PPN 11% perusahaan.</p>
      </div>
      <div class="header-action-group">
        <button class="btn-outline-action" @click="handleExportCSV">
          <FileSpreadsheet :size="14" />
          <span>Ekspor CSV</span>
        </button>
      </div>
    </div>

    <!-- 4 Commercial Summary Cards -->
    <div class="stats-overview-grid">
      <div class="telemetry-card">
        <div class="telemetry-top">
          <span class="telemetry-label">TAGIHAN BERIKUTNYA</span>
          <div class="telemetry-glyph blue"><Clock :size="15" /></div>
        </div>
        <div class="telemetry-val">Rp 149.000 <span class="badge-online">15 Okt 2026</span></div>
        <div class="telemetry-sub"><span>Perpanjangan otomatis via BCA VA</span></div>
      </div>

      <div class="telemetry-card">
        <div class="telemetry-top">
          <span class="telemetry-label">STATUS KELAYAKAN</span>
          <div class="telemetry-glyph emerald"><CheckCircle2 :size="15" /></div>
        </div>
        <div class="telemetry-val">100% <span class="badge-online">Lunas</span></div>
        <div class="telemetry-sub"><span>3 Transaksi lunas tanpa tunggakan</span></div>
      </div>

      <div class="telemetry-card">
        <div class="telemetry-top">
          <span class="telemetry-label">METODE PEMBAYARAN UTAMA</span>
          <div class="telemetry-glyph purple"><CreditCard :size="15" /></div>
        </div>
        <div class="telemetry-val">BCA VA <span class="badge-growth-pill">Auto-Debit</span></div>
        <div class="telemetry-sub"><span>VA No: 8802 9942 1089</span></div>
      </div>

      <div class="telemetry-card">
        <div class="telemetry-top">
          <span class="telemetry-label">PAJAK & LEGAL</span>
          <div class="telemetry-glyph emerald"><ShieldCheck :size="15" /></div>
        </div>
        <div class="telemetry-val">E-Faktur <span class="badge-online">PPN 11%</span></div>
        <div class="telemetry-sub"><span>NPWP: 01.889.341.2-021.000</span></div>
      </div>
    </div>

    <!-- Ledger Table Panel -->
    <div class="ledger-panel">
      <!-- Toolbar -->
      <div class="ledger-toolbar">
        <div class="search-box">
          <Search :size="14" class="search-icon" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari no. faktur, paket, atau metode pembayaran..."
            class="search-input"
          />
        </div>

        <div class="filter-controls">
          <div class="year-toggle-group">
            <button
              class="btn-year-tab"
              :class="{ active: selectedYear === '2026' }"
              @click="selectedYear = '2026'"
            >
              2026
            </button>
            <button
              class="btn-year-tab"
              :class="{ active: selectedYear === '2025' }"
              @click="selectedYear = '2025'"
            >
              2025
            </button>
            <button
              class="btn-year-tab"
              :class="{ active: selectedYear === 'all' }"
              @click="selectedYear = 'all'"
            >
              Semua
            </button>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="table-responsive">
        <table class="ledger-table">
          <thead>
            <tr>
              <th>NO. FAKTUR</th>
              <th>TANGGAL PENAGIHAN</th>
              <th>DESKRIPSI PAKET</th>
              <th>METODE BAYAR</th>
              <th>TOTAL (INC. PPN)</th>
              <th>STATUS</th>
              <th style="text-align: right">DOKUMEN</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="inv in filteredInvoices" :key="inv.id">
              <td>
                <div class="invoice-id-badge">
                  <Receipt :size="13" class="receipt-icon" />
                  <code>{{ inv.id }}</code>
                </div>
              </td>
              <td>
                <div class="date-cell">{{ inv.date }}</div>
              </td>
              <td>
                <div class="inv-plan-cell">
                  <strong>{{ inv.planName }}</strong>
                  <span class="inv-period-text">Periode: {{ inv.period }}</span>
                </div>
              </td>
              <td>
                <span class="payment-method-tag" :class="inv.paymentMethod.toLowerCase().includes('bca') ? 'tag-bca' : (inv.paymentMethod.toLowerCase().includes('qris') ? 'tag-qris' : 'tag-card')">
                  {{ inv.paymentMethod }}
                </span>
              </td>
              <td>
                <div class="price-cell">
                  <strong class="total-price-val">Rp {{ inv.total.toLocaleString('id-ID') }}</strong>
                  <span class="tax-note">PPN 11%: Rp {{ inv.tax.toLocaleString('id-ID') }}</span>
                </div>
              </td>
              <td>
                <span class="status-badge-paid">
                  <Check :size="11" />
                  <span>LUNAS</span>
                </span>
              </td>
              <td style="text-align: right">
                <div class="row-actions">
                  <button class="btn-invoice-view" @click="openInvoiceDetail(inv)" title="Lihat Faktur Pajak Resmi">
                    <FileText :size="13" />
                    <span>Lihat E-Faktur</span>
                  </button>
                  <button class="btn-invoice-dl" @click="downloadInvoiceReceipt(inv)" title="Unduh File Faktur">
                    <Download :size="13" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredInvoices.length === 0">
              <td colspan="7" class="empty-state-cell">
                Tidak ada faktur yang cocok dengan filter pencarian.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- MODAL: RINCIAN FAKTUR RESMI & PPN (TAX INVOICE DETAIL) -->
    <Teleport to="body">
      <div v-if="isInvoiceDetailModalOpen && selectedInvoice" class="modal-backdrop" @click.self="isInvoiceDetailModalOpen = false">
        <div class="modal-dialog modal-dialog-lg">
          <div class="modal-header">
            <div class="modal-header-leading">
              <div class="modal-header-icon-box">
                <Receipt :size="18" />
              </div>
              <div>
                <h3 class="modal-heading">Faktur Pajak Elektronik Resmi (E-Faktur)</h3>
                <p class="modal-subheading">Dokumen tagihan resmi ber-NPWP PT Hero Digital Multitek untuk pembukuan fiskal.</p>
              </div>
            </div>
            <button class="modal-close-button" @click="isInvoiceDetailModalOpen = false" title="Tutup">
              <X :size="16" />
            </button>
          </div>

          <div class="invoice-doc-body">
            <div class="invoice-paper" id="printable-invoice">
              <!-- Paper Header -->
              <div class="inv-paper-top">
                <div class="inv-company-brand">
                  <div class="inv-brand-mark">
                    <Layers :size="22" />
                  </div>
                  <div>
                    <h4 class="inv-brand-title">PT HERO DIGITAL MULTITEK</h4>
                    <p class="inv-brand-sub">NPWP: 01.889.341.2-021.000 • ID Billing E-Faktur</p>
                    <p class="inv-brand-sub">Cyber 2 Tower Lt. 18, Jl. H.R. Rasuna Said, Jakarta Selatan 12950</p>
                  </div>
                </div>
                <div class="inv-badge-block">
                  <div class="inv-paid-seal">
                    <CheckCircle2 :size="14" />
                    <span>PAID / LUNAS</span>
                  </div>
                  <div class="inv-number-stamp">{{ selectedInvoice.id }}</div>
                </div>
              </div>

              <!-- Meta Grid -->
              <div class="inv-meta-grid">
                <div class="inv-meta-col">
                  <span class="inv-meta-hdr">DITAGIHKAN KEPADA:</span>
                  <strong class="inv-meta-val">Rizal Pratama</strong>
                  <span class="inv-meta-sub">{{ userEmail }}</span>
                  <span class="inv-meta-sub">ID Pelanggan: CUST-TENANT-9942</span>
                </div>
                <div class="inv-meta-col">
                  <span class="inv-meta-hdr">TANGGAL PENAGIHAN:</span>
                  <strong class="inv-meta-val">{{ selectedInvoice.date }}</strong>
                  <span class="inv-meta-sub">Jatuh Tempo: {{ selectedInvoice.dueDate }}</span>
                </div>
                <div class="inv-meta-col">
                  <span class="inv-meta-hdr">METODE PEMBAYARAN:</span>
                  <strong class="inv-meta-val">{{ selectedInvoice.paymentMethod }}</strong>
                  <span class="inv-meta-sub">Status: Verifikasi Kliring Otomatis</span>
                </div>
              </div>

              <!-- Items Table -->
              <div class="inv-table-wrap">
                <table class="inv-items-table">
                  <thead>
                    <tr>
                      <th>DESKRIPSI LAYANAN SAAS</th>
                      <th>PERIODE</th>
                      <th style="text-align: center">KUOTA</th>
                      <th style="text-align: right">JUMLAH (IDR)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <strong>{{ selectedInvoice.planName }}</strong>
                        <p class="inv-item-desc">Alokasi CPU cgroups v2, Traefik edge proxy ingress, Redis telemetry, SSL auto-renew.</p>
                      </td>
                      <td>{{ selectedInvoice.period }}</td>
                      <td style="text-align: center">{{ selectedInvoice.containerQuota }} Kontainer</td>
                      <td style="text-align: right">Rp {{ selectedInvoice.amount.toLocaleString('id-ID') }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Summary & Tax -->
              <div class="inv-summary-row">
                <div class="inv-note-box">
                  <strong>Catatan Pembayaran Resmi:</strong>
                  <p>Faktur ini sah dan diterbitkan secara digital oleh sistem penagihan HeroCMS. PPN 11% telah dipungut dan disetorkan ke kas negara sesuai ketentuan PMK-60/PMK.03/2022.</p>
                </div>
                <div class="inv-calc-box">
                  <div class="inv-calc-line">
                    <span>Subtotal Dasar</span>
                    <strong>Rp {{ selectedInvoice.amount.toLocaleString('id-ID') }}</strong>
                  </div>
                  <div class="inv-calc-line">
                    <span>PPN Terhitung (11%)</span>
                    <strong>Rp {{ selectedInvoice.tax.toLocaleString('id-ID') }}</strong>
                  </div>
                  <div class="inv-calc-total">
                    <span>Total Tagihan Bersih</span>
                    <strong>Rp {{ selectedInvoice.total.toLocaleString('id-ID') }}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer-row">
            <button type="button" class="btn-modal-ghost" @click="isInvoiceDetailModalOpen = false">
              <span>Tutup</span>
            </button>
            <button type="button" class="btn-modal-ghost" @click="handlePrintInvoice">
              <Printer :size="14" />
              <span>Cetak Faktur</span>
            </button>
            <button type="button" class="btn-modal-confirm" @click="downloadInvoiceReceipt(selectedInvoice)">
              <Download :size="14" />
              <span>Unduh Dokumen Faktur</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>
