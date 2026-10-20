<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  Clock,
  CheckCircle2,
  Receipt,
  Download,
  Check,
  Layers,
  X,
  Printer,
  ShieldCheck,
  Search,
  FileSpreadsheet,
  FileText,
  Building2,
  TrendingUp,
  QrCode,
  Award,
  Copy
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

// Subnav Tab State: 'ledger' | 'breakdown' | 'tax_profile'
const activeTab = ref<'ledger' | 'breakdown' | 'tax_profile'>('ledger');

const searchQuery = ref('');
const selectedYear = ref<'2026' | '2025' | 'all'>('2026');
const selectedPaymentFilter = ref<'all' | 'bca' | 'qris' | 'card' | 'mandiri'>('all');
const copiedInvoiceId = ref<string | null>(null);

// Tenant Tax Profile Settings State
const tenantTaxProfile = ref({
  companyName: 'PT Pratama Solusi Solusindo',
  npwp: '01.234.567.8-012.000',
  taxAddress: 'Cyber 2 Tower Lt. 18, Jl. H.R. Rasuna Said, Jakarta Selatan 12950',
  taxEmail: 'finance@rizalpratama.cloud',
  autoSendTaxInvoice: true
});

// Analytics Calculations
const totalSpendYtd = computed(() => {
  return invoices.value.reduce((acc, inv) => acc + inv.total, 0);
});

const totalTaxYtd = computed(() => {
  return invoices.value.reduce((acc, inv) => acc + inv.tax, 0);
});

const totalDppYtd = computed(() => {
  return invoices.value.reduce((acc, inv) => acc + inv.amount, 0);
});

const filteredInvoices = computed(() => {
  return invoices.value.filter(inv => {
    const q = searchQuery.value.trim().toLowerCase();
    const matchesSearch = !q ||
      inv.id.toLowerCase().includes(q) ||
      inv.planName.toLowerCase().includes(q) ||
      inv.paymentMethod.toLowerCase().includes(q);

    if (!matchesSearch) return false;
    if (selectedYear.value !== 'all' && !inv.date.includes(selectedYear.value)) return false;

    if (selectedPaymentFilter.value !== 'all') {
      const pm = inv.paymentMethod.toLowerCase();
      if (selectedPaymentFilter.value === 'bca' && !pm.includes('bca')) return false;
      if (selectedPaymentFilter.value === 'qris' && !pm.includes('qris')) return false;
      if (selectedPaymentFilter.value === 'card' && !pm.includes('visa') && !pm.includes('kartu')) return false;
      if (selectedPaymentFilter.value === 'mandiri' && !pm.includes('mandiri')) return false;
    }

    return true;
  });
});

const copyInvoiceId = (id: string) => {
  navigator.clipboard?.writeText(id);
  copiedInvoiceId.value = id;
  showToast(`No. Faktur ${id} berhasil disalin ke clipboard!`, 'info');
  setTimeout(() => {
    if (copiedInvoiceId.value === id) copiedInvoiceId.value = null;
  }, 2000);
};

const handleExportCSV = () => {
  const headers = ['No Faktur', 'Tanggal', 'Paket', 'Metode Bayar', 'DPP Pokok', 'PPN 11%', 'Total Tagihan', 'Status Kliring'];
  const rows = filteredInvoices.value.map(inv => [
    inv.id,
    inv.date,
    `"${inv.planName}"`,
    `"${inv.paymentMethod}"`,
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

const handleDownloadAllReceipts = () => {
  let combinedText = `=======================================================\n`;
  combinedText += `          REKAPITULASI FAKTUR PEMBAYARAN RESMI\n`;
  combinedText += `              PT HERO DIGITAL MULTITEK\n`;
  combinedText += `=======================================================\n`;
  combinedText += `Wajib Pajak: PT Hero Digital Multitek (NPWP: 01.889.341.2-021.000)\n`;
  combinedText += `Pelanggan  : Rizal Pratama (${userEmail.value})\n`;
  combinedText += `Perusahaan : ${tenantTaxProfile.value.companyName} (NPWP: ${tenantTaxProfile.value.npwp})\n`;
  combinedText += `Total Transaksi: ${invoices.value.length} Dokumen Lunas\n\n`;

  invoices.value.forEach((inv, idx) => {
    combinedText += `[${idx + 1}] NO FAKTUR: ${inv.id}\n`;
    combinedText += `    Tanggal : ${inv.date} (Jatuh Tempo: ${inv.dueDate})\n`;
    combinedText += `    Layanan : ${inv.planName} (${inv.period})\n`;
    combinedText += `    Metode  : ${inv.paymentMethod}\n`;
    combinedText += `    DPP Dasar: Rp ${inv.amount.toLocaleString('id-ID')}\n`;
    combinedText += `    PPN 11% : Rp ${inv.tax.toLocaleString('id-ID')}\n`;
    combinedText += `    Total   : Rp ${inv.total.toLocaleString('id-ID')} [LUNAS / VERIFIED]\n`;
    combinedText += `-------------------------------------------------------\n`;
  });

  combinedText += `\nDokumen ini sah dan diterbitkan secara elektronik sesuai\n`;
  combinedText += `Peraturan Direktur Jenderal Pajak RI No. PER-03/PJ/2022.\n`;

  const blob = new Blob([combinedText], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Rekapitulasi-Faktur-HeroCMS-YTD-2026.txt`;
  link.click();
  URL.revokeObjectURL(url);
  showToast('Seluruh arsip faktur resmi berhasil diunduh dalam 1 berkas!', 'success');
};

const handlePrintInvoice = () => {
  window.print();
};

const handleSaveTaxProfile = () => {
  showToast('Profil wajib pajak dan data faktur resmi berhasil disimpan!', 'success');
};

const monthlyTrend = computed(() => {
  return [
    { month: 'Jul 2026', dpp: 69000, ppn: 7590, total: 76590, ntpn: 'NTPN-8829-0792', dppHeight: 40, ppnHeight: 8 },
    { month: 'Agu 2026', dpp: 149000, ppn: 16390, total: 165390, ntpn: 'NTPN-1194-8492', dppHeight: 80, ppnHeight: 16 },
    { month: 'Sep 2026', dpp: 149000, ppn: 16390, total: 165390, ntpn: 'NTPN-3301-4491', dppHeight: 80, ppnHeight: 16 },
    { month: 'Okt 2026', dpp: 149000, ppn: 16390, total: 165390, ntpn: 'NTPN-9942-0199', dppHeight: 80, ppnHeight: 16 }
  ];
});
</script>

<template>
  <section class="fade-in-section">
    <!-- Header Intro Row (Clean 2-Row Rule Compliance) -->
    <div class="page-intro-row">
      <div>
        <h1 class="page-title">Faktur & Riwayat Tagihan Resmi (E-Faktur Pajak)</h1>
        <p class="page-desc">
          Dokumen penagihan sah ber-NPWP PT Hero Digital Multitek untuk rekonsiliasi akuntansi perusahaan, audit PPN 11%, dan bukti potong fiskal elektronik DJP.
        </p>
      </div>
      <div class="header-actions">
        <button class="btn-outline-action" @click="handleExportCSV" title="Unduh format tabel CSV">
          <FileSpreadsheet :size="14" />
          <span>Ekspor CSV</span>
        </button>
        <button class="btn-primary-gradient" @click="handleDownloadAllReceipts" title="Unduh seluruh faktur lunas">
          <Download :size="14" />
          <span>Unduh Semua Faktur</span>
        </button>
      </div>
    </div>

    <!-- Sub-Navigation Tabs Bar -->
    <div class="api-subnav-bar">
      <button
        class="api-subnav-tab"
        :class="{ active: activeTab === 'ledger' }"
        @click="activeTab = 'ledger'"
      >
        <Receipt :size="15" />
        <span>Buku Besar Faktur & E-Faktur</span>
        <span class="tab-badge-pill">{{ invoices.length }} Lunas</span>
      </button>

      <button
        class="api-subnav-tab"
        :class="{ active: activeTab === 'breakdown' }"
        @click="activeTab = 'breakdown'"
      >
        <TrendingUp :size="15" />
        <span>Rekapitulasi Pajak PPN 11% & Tren Belanja</span>
        <span class="tab-badge-pill">PMK-60</span>
      </button>

      <button
        class="api-subnav-tab"
        :class="{ active: activeTab === 'tax_profile' }"
        @click="activeTab = 'tax_profile'"
      >
        <Building2 :size="15" />
        <span>Profil Wajib Pajak & Alamat Faktur</span>
        <span class="tab-badge-pill">PKP Aktif</span>
      </button>
    </div>

    <!-- 4 Commercial & Tax Telemetry Summary Cards -->
    <div class="stats-overview-grid">
      <!-- Card 1: Next Billing -->
      <div class="telemetry-card accent-blue">
        <div class="telemetry-corner-watermark blue"><Clock :size="58" /></div>
        <div class="telemetry-top">
          <span class="telemetry-label">TAGIHAN PERIODE BERIKUTNYA</span>
        </div>
        <div class="telemetry-val">
          Rp 149.000 <span class="badge-online">15 Nov 2026</span>
        </div>
        <div class="telemetry-sub">
          <span>Perpanjangan otomatis via BCA VA (Auto-Debit)</span>
        </div>
      </div>

      <!-- Card 2: Total Spend YTD -->
      <div class="telemetry-card accent-emerald">
        <div class="telemetry-corner-watermark emerald"><CheckCircle2 :size="58" /></div>
        <div class="telemetry-top">
          <span class="telemetry-label">TOTAL BELANJA SAAS YTD 2026</span>
        </div>
        <div class="telemetry-val">
          Rp {{ totalSpendYtd.toLocaleString('id-ID') }}
          <span class="badge-online">{{ invoices.length }} Lunas</span>
        </div>
        <div class="telemetry-sub">
          <span>DPP: Rp {{ totalDppYtd.toLocaleString('id-ID') }} • 100% lunas terverifikasi</span>
        </div>
      </div>

      <!-- Card 3: Tax PPN 11% -->
      <div class="telemetry-card accent-purple">
        <div class="telemetry-corner-watermark purple"><ShieldCheck :size="58" /></div>
        <div class="telemetry-top">
          <span class="telemetry-label">AKUMULASI PPN 11% DISETOR</span>
        </div>
        <div class="telemetry-val">
          Rp {{ totalTaxYtd.toLocaleString('id-ID') }}
          <span class="badge-growth-pill">DJP Valid</span>
        </div>
        <div class="telemetry-sub">
          <span>Dipungut & disetor sesuai PMK-60/PMK.03/2022</span>
        </div>
      </div>

      <!-- Card 4: Legal & NPWP Entity -->
      <div class="telemetry-card accent-sky">
        <div class="telemetry-corner-watermark sky"><Building2 :size="58" /></div>
        <div class="telemetry-top">
          <span class="telemetry-label">BADAN USAHA & NPWP PENERBIT</span>
        </div>
        <div class="telemetry-val">
          E-Faktur <span class="badge-online">Terverifikasi</span>
        </div>
        <div class="telemetry-sub">
          <span>PT Hero Digital Multitek • Cyber 2 Tower Jkt</span>
        </div>
      </div>
    </div>

    <!-- ================================================================= -->
    <!-- TAB 1: BUKU BESAR FAKTUR (LEDGER & INVOICES LIST) -->
    <!-- ================================================================= -->
    <div v-if="activeTab === 'ledger'" class="ledger-panel">
      <!-- Toolbar Filters -->
      <div class="invoice-filter-bar">
        <div class="invoice-filter-left">
          <div class="search-box" style="flex: 1; max-width: 480px;">
            <Search :size="14" class="search-icon" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari no. faktur (INV-...), deskripsi paket, atau metode bayar..."
              class="search-input"
            />
            <button
              v-if="searchQuery"
              class="btn-toast-x"
              style="margin-right: 8px;"
              @click="searchQuery = ''"
              title="Reset pencarian"
            >
              <X :size="13" />
            </button>
          </div>

          <select v-model="selectedPaymentFilter" class="invoice-method-select">
            <option value="all">Semua Metode Pembayaran</option>
            <option value="bca">BCA Virtual Account</option>
            <option value="qris">QRIS Dinamis</option>
            <option value="card">Visa Corporate Card</option>
            <option value="mandiri">Mandiri Bill Payment</option>
          </select>
        </div>

        <div class="invoice-filter-right">
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
              Semua Tahun
            </button>
          </div>
        </div>
      </div>

      <!-- Table Wrapper -->
      <div class="table-responsive">
        <table class="ledger-table">
          <thead>
            <tr>
              <th>NO. FAKTUR</th>
              <th>TANGGAL PENAGIHAN</th>
              <th>DESKRIPSI PAKET</th>
              <th>METODE BAYAR</th>
              <th>TOTAL (INC. PPN)</th>
              <th>STATUS KLIRING</th>
              <th style="text-align: right">DOKUMEN RESMI</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="inv in filteredInvoices"
              :key="inv.id"
              style="cursor: pointer;"
              @click="openInvoiceDetail(inv)"
            >
              <td>
                <div class="invoice-id-badge" @click.stop>
                  <Receipt :size="13" class="receipt-icon" />
                  <code>{{ inv.id }}</code>
                  <button
                    class="ledger-copy-btn"
                    @click="copyInvoiceId(inv.id)"
                    :title="copiedInvoiceId === inv.id ? 'Tersalin!' : 'Salin Nomor Faktur'"
                  >
                    <Check v-if="copiedInvoiceId === inv.id" :size="12" style="color: #10b981;" />
                    <Copy v-else :size="12" />
                  </button>
                </div>
              </td>
              <td>
                <div class="date-cell">{{ inv.date }}</div>
                <span style="font-size: 11px; color: #94a3b8;">Jatuh tempo: {{ inv.dueDate }}</span>
              </td>
              <td>
                <div class="inv-plan-cell">
                  <strong>{{ inv.planName }}</strong>
                  <span class="inv-period-text">Periode: {{ inv.period }}</span>
                </div>
              </td>
              <td>
                <span
                  class="payment-method-tag"
                  :class="inv.paymentMethod.toLowerCase().includes('bca') ? 'tag-bca' : (inv.paymentMethod.toLowerCase().includes('qris') ? 'tag-qris' : 'tag-card')"
                >
                  {{ inv.paymentMethod }}
                </span>
              </td>
              <td>
                <div class="price-cell">
                  <strong class="total-price-val">Rp {{ inv.total.toLocaleString('id-ID') }}</strong>
                  <span class="tax-note">DPP: Rp {{ inv.amount.toLocaleString('id-ID') }} • PPN 11%: Rp {{ inv.tax.toLocaleString('id-ID') }}</span>
                </div>
              </td>
              <td>
                <span class="status-badge-paid">
                  <Check :size="11" />
                  <span>LUNAS</span>
                </span>
              </td>
              <td style="text-align: right" @click.stop>
                <div class="row-actions">
                  <button class="btn-invoice-view" @click="openInvoiceDetail(inv)" title="Lihat Lembar Faktur Pajak Resmi">
                    <FileText :size="13" />
                    <span>Lihat E-Faktur</span>
                  </button>
                  <button class="btn-invoice-dl" @click="downloadInvoiceReceipt(inv)" title="Unduh Dokumen Teks Rekapitulasi">
                    <Download :size="13" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredInvoices.length === 0">
              <td colspan="7" class="empty-state-cell">
                Tidak ada dokumen faktur yang cocok dengan parameter filter pencarian Anda.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ================================================================= -->
    <!-- TAB 2: ANALITIK PENGELUARAN & REKAPITULASI PAJAK -->
    <!-- ================================================================= -->
    <div v-else-if="activeTab === 'breakdown'" class="tax-breakdown-card">
      <div class="card-sec-head" style="margin-bottom: 20px;">
        <div>
          <h3 style="font-size: 15px; font-weight: 800; color: #0f172a; margin: 0 0 4px 0;">
            Tren Belanja SaaS & Rekapitulasi Pajak PPN 11% (YTD 2026)
          </h3>
          <p style="font-size: 12.5px; color: #64748b; margin: 0;">
            Rincian historis nilai tagihan bulanan dan pajak pertambahan nilai yang telah disetorkan secara resmi ke kas negara.
          </p>
        </div>
        <span class="cgroups-tag">Tax Compliant DJP</span>
      </div>

      <!-- Visual Spending & Tax Bar Chart -->
      <div class="monthly-spend-visualizer">
        <div class="visualizer-header">
          <div class="visualizer-title">
            <TrendingUp :size="16" style="color: #2563eb;" />
            <span>Grafik Alokasi Fiskal Bulanan (Net DPP vs PPN 11%)</span>
          </div>
          <div class="visualizer-legend">
            <div class="legend-item">
              <span class="legend-dot-dpp"></span>
              <span>Dasar Pengenaan Pajak (DPP)</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot-ppn"></span>
              <span>PPN 11% (Kas Negara)</span>
            </div>
          </div>
        </div>

        <div class="visualizer-bars-grid">
          <div v-for="item in monthlyTrend" :key="item.month" class="month-bar-col">
            <div class="month-bar-track" :title="`${item.month}: DPP Rp ${item.dpp.toLocaleString('id-ID')} + PPN Rp ${item.ppn.toLocaleString('id-ID')}`">
              <div class="month-bar-ppn" :style="{ height: `${item.ppnHeight}px` }"></div>
              <div class="month-bar-dpp" :style="{ height: `${item.dppHeight}px` }"></div>
            </div>
            <span class="month-bar-val">Rp {{ item.total.toLocaleString('id-ID') }}</span>
            <span class="month-bar-label">{{ item.month }}</span>
          </div>
        </div>
      </div>

      <!-- Monthly Detailed Reconciliation Cards -->
      <div class="spend-trend-grid">
        <div
          v-for="item in monthlyTrend"
          :key="item.month"
          class="spend-month-card"
        >
          <div>
            <div class="spend-month-header">
              <span class="spend-month-title">{{ item.month }}</span>
              <span class="status-badge-paid" style="font-size: 10px; padding: 1px 6px;">Lunas</span>
            </div>
            <div class="spend-month-val">Rp {{ item.total.toLocaleString('id-ID') }}</div>
            <div class="spend-month-tax">PPN 11%: Rp {{ item.ppn.toLocaleString('id-ID') }}</div>
          </div>
          <div style="font-size: 11px; color: #64748b; margin-top: 10px; border-top: 1px dashed #e2e8f0; padding-top: 8px; display: flex; justify-content: space-between; align-items: center;">
            <span>Kode NTPN:</span>
            <code style="font-size: 10.5px; font-weight: 700; color: #0f172a;">{{ item.ntpn }}</code>
          </div>
        </div>
      </div>

      <!-- Tax Certificate Box -->
      <div class="tax-certificate-card">
        <div class="cert-left-content">
          <div class="cert-icon-badge">
            <Award :size="24" />
          </div>
          <div>
            <h4 class="cert-title">Surat Keterangan Kepatuhan Wajib Pajak (SKF)</h4>
            <p class="cert-desc">
              Seluruh transaksi akun tenant Anda tercatat sah pada sistem Direktorat Jenderal Pajak RI. Faktur pajak masukan dapat dikreditkan menggunakan NPWP Perusahaan Anda.
            </p>
          </div>
        </div>

        <button class="btn-primary-gradient" @click="handleDownloadAllReceipts">
          <Download :size="14" />
          <span>Unduh Surat Keterangan Fiskal</span>
        </button>
      </div>
    </div>

    <!-- ================================================================= -->
    <!-- TAB 3: PENGATURAN PROFIL FAKTUR PAJAK TENANT -->
    <!-- ================================================================= -->
    <div v-else-if="activeTab === 'tax_profile'" class="tax-profile-card">
      <div class="card-sec-head" style="margin-bottom: 20px;">
        <div>
          <h3 style="font-size: 15px; font-weight: 800; color: #0f172a; margin: 0 0 4px 0;">
            Pengaturan Identitas Wajib Pajak Badan (E-Faktur Setting)
          </h3>
          <p style="font-size: 12.5px; color: #64748b; margin: 0;">
            Data di bawah ini akan dicantumkan secara otomatis pada setiap lembar dokumen E-Faktur resmi untuk keperluan klaim kredit pajak masukan perusahaan Anda.
          </p>
        </div>
        <span class="cgroups-tag">Corporate Billing Identity</span>
      </div>

      <div class="tax-profile-split-grid">
        <!-- Left Column: Settings Form -->
        <form @submit.prevent="handleSaveTaxProfile" class="modal-form-body" style="padding: 0;">
          <div class="tax-profile-form-grid" style="grid-template-columns: 1fr;">
            <div class="form-group-block" style="margin-bottom: 0;">
              <label class="input-label-row">
                <span class="label-text">Nama Perusahaan / Wajib Pajak Badan</span>
                <span class="label-badge-optional">Wajib</span>
              </label>
              <input
                v-model="tenantTaxProfile.companyName"
                type="text"
                class="form-text-input"
                placeholder="Contoh: PT Pratama Solusi Solusindo"
                required
              />
            </div>

            <div class="form-group-block" style="margin-bottom: 0;">
              <label class="input-label-row">
                <span class="label-text">NPWP 16 Digit (Format Baru NIK / NPWP)</span>
                <span class="label-badge-optional">Wajib</span>
              </label>
              <input
                v-model="tenantTaxProfile.npwp"
                type="text"
                class="form-text-input"
                placeholder="Contoh: 01.234.567.8-012.000"
                required
              />
            </div>

            <div class="form-group-block" style="margin-bottom: 0;">
              <label class="input-label-row">
                <span class="label-text">Alamat Lengkap Sesuai SKT / SPPKP</span>
                <span class="label-badge-optional">Wajib</span>
              </label>
              <input
                v-model="tenantTaxProfile.taxAddress"
                type="text"
                class="form-text-input"
                placeholder="Contoh: Cyber 2 Tower Lt. 18, Jl. H.R. Rasuna Said, Jakarta Selatan 12950"
                required
              />
            </div>

            <div class="form-group-block" style="margin-bottom: 0;">
              <label class="input-label-row">
                <span class="label-text">Email Departemen Keuangan / Tax Accounting</span>
                <span class="label-badge-optional">Wajib</span>
              </label>
              <input
                v-model="tenantTaxProfile.taxEmail"
                type="email"
                class="form-text-input"
                placeholder="Contoh: finance@perusahaan.com"
                required
              />
            </div>

            <div class="form-group-block" style="margin-bottom: 0;">
              <label style="display: inline-flex; align-items: center; gap: 8px; cursor: pointer; font-size: 12.5px; color: #334155; font-weight: 600; margin-top: 10px;">
                <input
                  v-model="tenantTaxProfile.autoSendTaxInvoice"
                  type="checkbox"
                  style="width: 16px; height: 16px; accent-color: #2563eb; cursor: pointer;"
                />
                <span>Kirim otomatis lembar PDF Faktur Pajak ke email finance setiap perpanjangan</span>
              </label>
            </div>
          </div>

          <div style="display: flex; justify-content: flex-start; margin-top: 18px;">
            <button type="submit" class="btn-primary-gradient">
              <Check :size="14" />
              <span>Simpan Profil Wajib Pajak</span>
            </button>
          </div>
        </form>

        <!-- Right Column: Live E-Faktur KOP Preview -->
        <div class="live-kop-preview-card">
          <div class="live-kop-header">
            <span class="live-kop-title">
              <Building2 :size="14" style="color: #2563eb;" />
              <span>Pratinjau KOP Dokumen E-Faktur</span>
            </span>
            <span class="live-kop-badge">Live Sync</span>
          </div>

          <div class="live-kop-body">
            <div class="kop-paper-preview">
              <div style="font-size: 10px; font-weight: 800; color: #94a3b8; letter-spacing: 0.05em; margin-bottom: 6px;">
                IDENTITAS PEMBELI BKP / PENERIMA JKP
              </div>
              <h4 class="kop-client-name">{{ tenantTaxProfile.companyName || 'Nama Perusahaan Anda' }}</h4>
              <div class="kop-detail-row">
                <strong>NPWP:</strong>
                <code>{{ tenantTaxProfile.npwp || '00.000.000.0-000.000' }}</code>
              </div>
              <div class="kop-detail-row">
                <strong>Alamat:</strong>
                <span>{{ tenantTaxProfile.taxAddress || 'Alamat kantor resmi perusahaan Anda...' }}</span>
              </div>
              <div class="kop-detail-row">
                <strong>Email:</strong>
                <span>{{ tenantTaxProfile.taxEmail || userEmail }}</span>
              </div>

              <div class="kop-seal-stamp">
                <span style="color: #059669; font-weight: 700; display: flex; align-items: center; gap: 4px;">
                  <CheckCircle2 :size="12" /> Validasi Pajak Masukan Siap Klaim
                </span>
                <span style="color: #94a3b8; font-size: 10px;">DJP PER-03/PJ/2022</span>
              </div>
            </div>

            <div style="margin-top: 12px; font-size: 11px; color: #64748b; line-height: 1.4;">
              💡 <em>Identitas di atas akan dicantumkan secara otomatis pada lembar E-Faktur resmi di bawah ini.</em>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ================================================================= -->
    <!-- MODAL: RINCIAN FAKTUR RESMI & PPN (TAX INVOICE DETAIL PAPER) -->
    <!-- ================================================================= -->
    <Teleport to="body">
      <div
        v-if="isInvoiceDetailModalOpen && selectedInvoice"
        class="modal-backdrop"
        @click.self="isInvoiceDetailModalOpen = false"
      >
        <div class="modal-dialog modal-dialog-lg">
          <div class="modal-header">
            <div class="modal-header-leading">
              <div class="modal-header-icon-box" style="background: #eff6ff; color: #2563eb;">
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
                    <p class="inv-brand-sub">NPWP: 01.889.341.2-021.000 • ID Billing E-Faktur DJP</p>
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
                  <strong class="inv-meta-val">{{ tenantTaxProfile.companyName || 'Rizal Pratama' }}</strong>
                  <span class="inv-meta-sub">{{ userEmail }}</span>
                  <span class="inv-meta-sub">NPWP Pembeli: {{ tenantTaxProfile.npwp || '01.234.567.8-012.000' }}</span>
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
                        <p class="inv-item-desc">
                          Alokasi dedicated CPU cgroups v2, Traefik edge proxy ingress SSL TLS 1.3, Redis telemetry, automated snapshot backups.
                        </p>
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
                  <div class="inv-qr-stamp-box">
                    <div class="inv-qr-dummy">
                      <QrCode :size="32" />
                    </div>
                    <div>
                      <strong>Validasi Digital DJP:</strong>
                      <p style="margin: 2px 0 0 0;">Faktur ini sah dan diterbitkan secara digital oleh sistem penagihan HeroCMS. PPN 11% telah dipungut dan disetorkan ke kas negara sesuai PMK-60/PMK.03/2022.</p>
                    </div>
                  </div>
                </div>

                <div class="inv-calc-box">
                  <div class="inv-calc-line">
                    <span>Dasar Pengenaan Pajak (DPP)</span>
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

          <!-- Modal Footer Actions (Guaranteed Side-by-Side) -->
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
