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
  </section>
</template>

<style scoped>
/* Scoped Futuristic Styles for Invoices & Billing Module */
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

.header-action-group {
  display: flex;
  gap: 10px;
}

.btn-outline-action {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  color: #334155;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-outline-action:hover {
  background: #f8fafc;
  border-color: #94a3b8;
  color: #0f172a;
}

/* 4 Summary Cards */
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

/* Ledger Panel */
.ledger-panel {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
}

.ledger-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 18px;
  border-bottom: 1px solid #e2e8f0;
  background: #fafbfc;
  gap: 16px;
}

.search-box {
  position: relative;
  flex: 1;
  max-width: 420px;
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

.year-toggle-group {
  display: flex;
  background: #f1f5f9;
  padding: 3px;
  border-radius: 8px;
}

.btn-year-tab {
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

.btn-year-tab.active {
  background: #ffffff;
  color: #0f172a;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.08);
}

/* Ledger Table */
.table-responsive {
  width: 100%;
  overflow-x: auto;
}

.ledger-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.ledger-table th {
  padding: 12px 18px;
  font-size: 11px;
  font-weight: 700;
  color: #64748b;
  letter-spacing: 0.05em;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
}

.ledger-table td {
  padding: 14px 18px;
  font-size: 13px;
  color: #334155;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
}

.ledger-table tbody tr:hover td {
  background: #fafbfc;
}

.ledger-table tbody tr:last-child td {
  border-bottom: none;
}

.invoice-id-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 4px 9px;
  border-radius: 6px;
}

.receipt-icon {
  color: #64748b;
}

.invoice-id-badge code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 12px;
  font-weight: 600;
  color: #0f172a;
}

.date-cell {
  font-size: 12.5px;
  color: #475569;
}

.inv-plan-cell {
  display: flex;
  flex-direction: column;
}

.inv-plan-cell strong {
  color: #0f172a;
  font-size: 13px;
}

.inv-period-text {
  font-size: 11.5px;
  color: #64748b;
}

.payment-method-tag {
  font-size: 11.5px;
  font-weight: 600;
  padding: 3px 9px;
  border-radius: 6px;
  display: inline-block;
}

.tag-bca {
  background: #eff6ff;
  color: #1d4ed8;
  border: 1px solid #bfdbfe;
}

.tag-qris {
  background: #fdf2f8;
  color: #be185d;
  border: 1px solid #fbcfe8;
}

.tag-card {
  background: #f5f3ff;
  color: #6d28d9;
  border: 1px solid #ddd6fe;
}

.price-cell {
  display: flex;
  flex-direction: column;
}

.total-price-val {
  font-size: 13.5px;
  font-weight: 700;
  color: #0f172a;
}

.tax-note {
  font-size: 11px;
  color: #64748b;
}

.status-badge-paid {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 700;
  color: #059669;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  padding: 3px 9px;
  border-radius: 20px;
}

.row-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.btn-invoice-view {
  display: inline-flex;
  align-items: center;
  gap: 6px;
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

.btn-invoice-view:hover {
  background: #1e293b;
}

.btn-invoice-dl {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  color: #475569;
  width: 30px;
  height: 30px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-invoice-dl:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.empty-state-cell {
  text-align: center;
  padding: 36px !important;
  color: #94a3b8;
  font-size: 13px;
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
  max-width: 780px !important;
}

.modal-dialog {
  background: #ffffff;
  border-radius: 16px;
  width: 100%;
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

/* Printable E-Faktur Paper */
.invoice-doc-body {
  padding: 20px 24px;
  max-height: 70vh;
  overflow-y: auto;
  background: #f8fafc;
}

.invoice-paper {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 28px;
  box-shadow: 0 1px 4px rgba(15, 23, 42, 0.05);
}

.inv-paper-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 2px solid #0f172a;
  padding-bottom: 18px;
  margin-bottom: 20px;
}

.inv-company-brand {
  display: flex;
  gap: 14px;
}

.inv-brand-mark {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: #0f172a;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.inv-brand-title {
  font-size: 16px;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 3px 0;
  letter-spacing: -0.01em;
}

.inv-brand-sub {
  font-size: 11.5px;
  color: #64748b;
  margin: 0 0 2px 0;
}

.inv-badge-block {
  text-align: right;
}

.inv-paid-seal {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  color: #059669;
  font-size: 12px;
  font-weight: 800;
  padding: 5px 12px;
  border-radius: 6px;
  letter-spacing: 0.05em;
  margin-bottom: 6px;
}

.inv-number-stamp {
  font-family: ui-monospace, SFMono-Regular, monospace;
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
}

.inv-meta-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  background: #fafbfc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 14px 16px;
  margin-bottom: 20px;
}

.inv-meta-col {
  display: flex;
  flex-direction: column;
}

.inv-meta-hdr {
  font-size: 10px;
  font-weight: 700;
  color: #94a3b8;
  letter-spacing: 0.06em;
  margin-bottom: 4px;
}

.inv-meta-val {
  font-size: 13px;
  color: #0f172a;
  margin-bottom: 2px;
}

.inv-meta-sub {
  font-size: 11.5px;
  color: #64748b;
}

.inv-table-wrap {
  margin-bottom: 20px;
}

.inv-items-table {
  width: 100%;
  border-collapse: collapse;
}

.inv-items-table th {
  background: #f1f5f9;
  padding: 9px 12px;
  font-size: 11px;
  font-weight: 700;
  color: #475569;
  text-align: left;
  border-bottom: 1px solid #cbd5e1;
}

.inv-items-table td {
  padding: 12px;
  font-size: 12.5px;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: top;
}

.inv-item-desc {
  font-size: 11px;
  color: #64748b;
  margin: 3px 0 0 0;
}

.inv-summary-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  padding-top: 14px;
  border-top: 1px solid #e2e8f0;
}

.inv-note-box {
  flex: 1;
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  border-radius: 8px;
  padding: 12px;
}

.inv-note-box strong {
  font-size: 11px;
  color: #334155;
}

.inv-note-box p {
  font-size: 11px;
  color: #64748b;
  margin: 4px 0 0 0;
  line-height: 1.4;
}

.inv-calc-box {
  width: 260px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.inv-calc-line {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #64748b;
}

.inv-calc-line strong {
  color: #0f172a;
}

.inv-calc-total {
  display: flex;
  justify-content: space-between;
  padding-top: 8px;
  margin-top: 4px;
  border-top: 2px solid #0f172a;
  font-size: 14px;
  font-weight: 800;
  color: #0f172a;
}

.modal-footer-row {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 24px;
  border-top: 1px solid #f1f5f9;
}

.btn-modal-ghost {
  display: inline-flex;
  align-items: center;
  gap: 6px;
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
</style>
