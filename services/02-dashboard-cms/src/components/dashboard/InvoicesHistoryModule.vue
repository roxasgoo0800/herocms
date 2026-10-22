<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue';
import * as echarts from 'echarts';
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
  link.setAttribute('download', `Aether_Core_Stack_Billing_Report_${selectedYear.value}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('Laporan billing CSV berhasil diekspor!', 'success');
};

const handleDownloadAllReceipts = () => {
  let combinedText = `=======================================================\n`;
  combinedText += `          REKAPITULASI FAKTUR PEMBAYARAN RESMI\n`;
  combinedText += `             PT AETHER CORE MULTITEK\n`;
  combinedText += `=======================================================\n`;
  combinedText += `Wajib Pajak: PT Aether Core Multitek (NPWP: 01.889.341.2-021.000)\n`;
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
  link.download = `Rekapitulasi-Faktur-Aether-Core-Stack-YTD-2026.txt`;
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
    { month: 'Mei 2026', dpp: 69000, ppn: 7590, total: 76590, ntpn: 'NTPN-8829-0521' },
    { month: 'Jun 2026', dpp: 69000, ppn: 7590, total: 76590, ntpn: 'NTPN-8829-0633' },
    { month: 'Jul 2026', dpp: 119000, ppn: 13090, total: 132090, ntpn: 'NTPN-8829-0792' },
    { month: 'Agu 2026', dpp: 149000, ppn: 16390, total: 165390, ntpn: 'NTPN-1194-8492' },
    { month: 'Sep 2026', dpp: 149000, ppn: 16390, total: 165390, ntpn: 'NTPN-3301-4491' },
    { month: 'Okt 2026', dpp: 149000, ppn: 16390, total: 165390, ntpn: 'NTPN-9942-0199' }
  ];
});

// Helper: Konversi Nominal Rupiah ke Terbilang Bahasa Indonesia Resmi
const getTerbilang = (n: number): string => {
  const bilangan = ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas'];
  const konversi = (num: number): string => {
    if (num < 12) return bilangan[num];
    if (num < 20) return konversi(num - 10) + ' Belas';
    if (num < 100) return konversi(Math.floor(num / 10)) + ' Puluh ' + (num % 10 !== 0 ? konversi(num % 10) : '');
    if (num < 200) return 'Seratus ' + konversi(num - 100);
    if (num < 1000) return konversi(Math.floor(num / 100)) + ' Ratus ' + (num % 100 !== 0 ? konversi(num % 100) : '');
    if (num < 2000) return 'Seribu ' + konversi(num - 1000);
    if (num < 1000000) return konversi(Math.floor(num / 1000)) + ' Ribu ' + (num % 1000 !== 0 ? konversi(num % 1000) : '');
    if (num < 1000000000) return konversi(Math.floor(num / 1000000)) + ' Juta ' + (num % 1000000 !== 0 ? konversi(num % 1000000) : '');
    return num.toString();
  };
  return konversi(Math.floor(n)).trim().replace(/\s+/g, ' ') + ' Rupiah';
};

// =============================================================================
// Enterprise Apache ECharts Setup: Spending Trend & PPN 11% Tax Visualization
// =============================================================================
const taxChartContainerRef = ref<HTMLDivElement | null>(null);
let taxChartInstance: echarts.ECharts | null = null;
let taxResizeObserver: ResizeObserver | null = null;

const initTaxChart = () => {
  if (!taxChartContainerRef.value) return;
  if (taxChartInstance) {
    taxChartInstance.dispose();
  }
  taxChartInstance = echarts.init(taxChartContainerRef.value, undefined, {
    renderer: 'canvas'
  });
  renderTaxChart();

  if (!taxResizeObserver && taxChartContainerRef.value) {
    taxResizeObserver = new ResizeObserver(() => {
      taxChartInstance?.resize();
    });
    taxResizeObserver.observe(taxChartContainerRef.value);
  }
};

const renderTaxChart = () => {
  if (!taxChartInstance) return;

  const months = monthlyTrend.value.map(item => item.month);
  const dppSeries = monthlyTrend.value.map(item => item.dpp);
  const ppnSeries = monthlyTrend.value.map(item => item.ppn);
  const totalSeries = monthlyTrend.value.map(item => item.total);

  const option: echarts.EChartsOption = {
    animationDuration: 800,
    animationEasing: 'cubicOut',
    grid: {
      left: '20px',
      right: '25px',
      top: '40px',
      bottom: '15px',
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15, 23, 42, 0.96)',
      borderColor: 'rgba(255, 255, 255, 0.12)',
      borderWidth: 1,
      padding: [12, 16],
      extraCssText: 'border-radius: 12px; box-shadow: 0 16px 36px -6px rgba(0,0,0,0.4); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);',
      axisPointer: {
        type: 'line',
        lineStyle: {
          color: '#94a3b8',
          type: 'dashed',
          width: 1.2
        }
      },
      formatter: (params: any) => {
        if (!Array.isArray(params) || params.length === 0) return '';
        const idx = params[0].dataIndex;
        const item = monthlyTrend.value[idx];
        if (!item) return '';

        return `
          <div style="font-family: Inter, system-ui, sans-serif; font-size: 12px; color: #f8fafc; min-width: 240px;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.12); padding-bottom: 8px; margin-bottom: 10px;">
              <span style="font-weight: 700; font-size: 13px; color: #ffffff;">📅 ${item.month}</span>
              <span style="background: rgba(16, 185, 129, 0.2); color: #34d399; font-size: 10.5px; font-weight: 700; padding: 2px 7px; border-radius: 6px;">LUNAS DJP</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <span style="color: #94a3b8; display: flex; align-items: center; gap: 6px;">
                <span style="width: 8px; height: 8px; border-radius: 50%; background: #3b82f6; box-shadow: 0 0 6px #3b82f6; display: inline-block;"></span>
                Dasar Pajak (DPP):
              </span>
              <strong style="color: #60a5fa; font-family: ui-monospace, monospace;">Rp ${item.dpp.toLocaleString('id-ID')}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <span style="color: #94a3b8; display: flex; align-items: center; gap: 6px;">
                <span style="width: 8px; height: 8px; border-radius: 50%; background: #10b981; box-shadow: 0 0 6px #10b981; display: inline-block;"></span>
                PPN 11% (Kas Negara):
              </span>
              <strong style="color: #34d399; font-family: ui-monospace, monospace;">Rp ${item.ppn.toLocaleString('id-ID')}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed rgba(255,255,255,0.15); padding-top: 8px; margin-bottom: 6px;">
              <span style="font-weight: 600; color: #e2e8f0;">Total Tagihan Resmi:</span>
              <strong style="font-size: 13.5px; color: #ffffff; font-family: ui-monospace, monospace;">Rp ${item.total.toLocaleString('id-ID')}</strong>
            </div>
            <div style="font-size: 10.5px; color: #64748b; margin-top: 4px; display: flex; justify-content: space-between;">
              <span>Kode NTPN Fiskal:</span>
              <code style="color: #cbd5e1; font-family: monospace;">${item.ntpn}</code>
            </div>
          </div>
        `;
      }
    },
    xAxis: {
      type: 'category',
      data: months,
      boundaryGap: false,
      axisLine: {
        lineStyle: { color: '#e2e8f0' }
      },
      axisTick: { show: false },
      axisLabel: {
        color: '#475569',
        fontSize: 12,
        fontWeight: 600,
        margin: 14
      }
    },
    yAxis: {
      type: 'value',
      name: 'Nilai Fiskal (IDR)',
      nameTextStyle: {
        color: '#64748b',
        fontSize: 11,
        fontWeight: 600,
        padding: [0, 0, 10, 0]
      },
      splitLine: {
        lineStyle: {
          color: '#f1f5f9',
          type: 'dashed'
        }
      },
      axisLabel: {
        color: '#64748b',
        fontSize: 11,
        formatter: (val: number) => `Rp ${(val / 1000).toLocaleString('id-ID')}k`
      }
    },
    series: [
      {
        name: 'Total Tagihan Resmi (Inc. PPN)',
        type: 'line',
        smooth: 0.38,
        symbol: 'circle',
        symbolSize: 8,
        showSymbol: true,
        lineStyle: {
          color: '#6366f1',
          width: 2.5
        },
        itemStyle: {
          color: '#6366f1',
          borderColor: '#ffffff',
          borderWidth: 2
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(99, 102, 241, 0.22)' },
            { offset: 0.7, color: 'rgba(99, 102, 241, 0.03)' },
            { offset: 1, color: 'rgba(99, 102, 241, 0.0)' }
          ])
        },
        data: totalSeries
      },
      {
        name: 'Dasar Pengenaan Pajak (DPP)',
        type: 'line',
        smooth: 0.38,
        symbol: 'circle',
        symbolSize: 8,
        showSymbol: true,
        lineStyle: {
          color: '#2563eb',
          width: 3
        },
        itemStyle: {
          color: '#2563eb',
          borderColor: '#ffffff',
          borderWidth: 2
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(37, 99, 235, 0.32)' },
            { offset: 0.7, color: 'rgba(37, 99, 235, 0.05)' },
            { offset: 1, color: 'rgba(37, 99, 235, 0.0)' }
          ])
        },
        data: dppSeries
      },
      {
        name: 'PPN 11% (Kas Negara RI)',
        type: 'line',
        smooth: 0.38,
        symbol: 'circle',
        symbolSize: 7,
        showSymbol: true,
        lineStyle: {
          color: '#10b981',
          width: 2.2,
          type: 'dashed'
        },
        itemStyle: {
          color: '#10b981',
          borderColor: '#ffffff',
          borderWidth: 2
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(16, 185, 129, 0.18)' },
            { offset: 0.7, color: 'rgba(16, 185, 129, 0.03)' },
            { offset: 1, color: 'rgba(16, 185, 129, 0.0)' }
          ])
        },
        data: ppnSeries
      }
    ]
  };

  taxChartInstance.setOption(option, true);
};

watch(activeTab, (newTab) => {
  if (newTab === 'breakdown') {
    nextTick(() => {
      initTaxChart();
    });
  }
});

onMounted(() => {
  if (activeTab.value === 'breakdown') {
    nextTick(() => {
      initTaxChart();
    });
  }
});

onUnmounted(() => {
  taxResizeObserver?.disconnect();
  taxChartInstance?.dispose();
  taxChartInstance = null;
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
    <div v-if="activeTab === 'ledger'" class="invoices-ledger-panel">
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

      <!-- Spacious Invoices Table Container -->
      <div class="invoices-table-container">
        <table class="invoices-ledger-table">
          <thead>
            <tr>
              <th class="col-inv-id">NO. FAKTUR</th>
              <th class="col-inv-date">TANGGAL PENAGIHAN</th>
              <th class="col-inv-plan">DESKRIPSI PAKET</th>
              <th class="col-inv-method">METODE BAYAR</th>
              <th class="col-inv-price">TOTAL (INC. PPN)</th>
              <th class="col-inv-status">STATUS KLIRING</th>
              <th class="col-inv-actions" style="text-align: right">DOKUMEN RESMI</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="inv in filteredInvoices"
              :key="inv.id"
              style="cursor: pointer;"
              @click="openInvoiceDetail(inv)"
            >
              <td class="col-inv-id">
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
              <td class="col-inv-date">
                <div class="date-cell">{{ inv.date }}</div>
                <div style="font-size: 11px; color: #94a3b8; margin-top: 2px;">Jatuh tempo: {{ inv.dueDate }}</div>
              </td>
              <td class="col-inv-plan">
                <div class="inv-plan-cell">
                  <strong>{{ inv.planName }}</strong>
                  <span class="inv-period-text">Periode: {{ inv.period }}</span>
                </div>
              </td>
              <td class="col-inv-method">
                <span
                  class="payment-method-tag"
                  :class="inv.paymentMethod.toLowerCase().includes('bca') ? 'tag-bca' : (inv.paymentMethod.toLowerCase().includes('qris') ? 'tag-qris' : 'tag-card')"
                >
                  {{ inv.paymentMethod }}
                </span>
              </td>
              <td class="col-inv-price">
                <div class="price-cell">
                  <strong class="total-price-val">Rp {{ inv.total.toLocaleString('id-ID') }}</strong>
                  <span class="tax-note">DPP: Rp {{ inv.amount.toLocaleString('id-ID') }} • PPN 11%: Rp {{ inv.tax.toLocaleString('id-ID') }}</span>
                </div>
              </td>
              <td class="col-inv-status">
                <span class="status-badge-paid">
                  <Check :size="11" />
                  <span>LUNAS</span>
                </span>
              </td>
              <td class="col-inv-actions" style="text-align: right" @click.stop>
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
      <div class="card-sec-head" style="margin-bottom: 16px;">
        <div>
          <h3 style="font-size: 15px; font-weight: 800; color: #0f172a; margin: 0 0 4px 0;">
            Tren Belanja SaaS & Rekapitulasi Pajak PPN 11% (YTD 2026)
          </h3>
          <p style="font-size: 12.5px; color: #64748b; margin: 0;">
            Grafik kurva garis & area spline interaktif nilai tagihan bulanan dan pajak pertambahan nilai yang telah disetorkan secara resmi ke kas negara RI.
          </p>
        </div>
        <span class="cgroups-tag">Tax Compliant DJP</span>
      </div>

      <!-- Quick Metrics Telemetry Row -->
      <div class="tax-graph-metrics-row">
        <div class="tax-metric-pill">
          <TrendingUp :size="14" style="color: #2563eb;" />
          <span>Rata-rata Belanja Bulanan: <strong>Rp 143.190 / bln</strong></span>
        </div>
        <div class="tax-metric-pill">
          <ShieldCheck :size="14" style="color: #10b981;" />
          <span>Akumulasi PPN Disetor: <strong>Rp {{ totalTaxYtd.toLocaleString('id-ID') }}</strong></span>
        </div>
        <div class="tax-metric-pill">
          <Award :size="14" style="color: #6366f1;" />
          <span>Kepatuhan Fiskal: <strong>100% DJP PER-03/PJ/2022</strong></span>
        </div>
      </div>

      <!-- Visual Spending & Tax Apache ECharts Spline Curve Line Chart -->
      <div class="monthly-spend-visualizer">
        <div class="visualizer-header">
          <div class="visualizer-title">
            <TrendingUp :size="16" style="color: #2563eb;" />
            <span>Grafik Alokasi Fiskal Bulanan Interaktif (Net DPP vs PPN 11%)</span>
          </div>
          <div class="visualizer-legend">
            <div class="legend-item">
              <span class="legend-dot-total"></span>
              <span>Total Tagihan Resmi (Inc. PPN)</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot-dpp"></span>
              <span>Dasar Pengenaan Pajak (DPP)</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot-ppn"></span>
              <span>PPN 11% (Kas Negara RI)</span>
            </div>
          </div>
        </div>

        <div class="tax-echarts-wrapper">
          <div ref="taxChartContainerRef" class="tax-echarts-canvas"></div>
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
        <div class="modal-dialog modal-dialog-invoice">
          <div class="modal-header">
            <div class="modal-header-leading">
              <div class="modal-header-icon-box" style="background: #eff6ff; color: #2563eb;">
                <Receipt :size="18" />
              </div>
              <div>
                <h3 class="modal-heading">Faktur Pajak Elektronik Resmi (E-Faktur DJP 3.0)</h3>
                <p class="modal-subheading">Dokumen bukti pemungutan PPN 11% sah Direktorat Jenderal Pajak RI • PT Hero Digital Multitek</p>
              </div>
            </div>
            <button class="modal-close-button" @click="isInvoiceDetailModalOpen = false" title="Tutup">
              <X :size="16" />
            </button>
          </div>

          <div class="invoice-doc-body">
            <div class="invoice-paper" id="printable-invoice">
              <!-- Official DJP Government Ribbon -->
              <div class="inv-gov-ribbon">
                <div class="inv-gov-title">
                  <ShieldCheck :size="14" style="color: #38bdf8;" />
                  <span>KEMENTERIAN KEUANGAN REPUBLIK INDONESIA • DIREKTORAT JENDERAL PAJAK</span>
                </div>
                <div class="inv-gov-badge">SALINAN ELEKTRONIK SAH • PMK-60/PMK.03/2022</div>
              </div>

              <!-- Paper Top Header -->
              <div class="inv-paper-top">
                <div class="inv-company-brand">
                  <div class="inv-brand-mark">
                    <Layers :size="24" />
                  </div>
                  <div>
                    <h4 class="inv-brand-title">PT HERO DIGITAL MULTITEK</h4>
                    <p class="inv-brand-sub">NPWP: 01.889.341.2-021.000 • KPP Pratama Jakarta Setiabudi</p>
                    <p class="inv-brand-sub">Cyber 2 Tower Lt. 18, Jl. H.R. Rasuna Said Kav. X-5 No. 13, Jakarta Selatan 12950</p>
                  </div>
                </div>

                <div class="inv-badge-block">
                  <h3 class="inv-doc-main-title">FAKTUR PAJAK</h3>
                  <div class="inv-paid-seal">
                    <CheckCircle2 :size="14" />
                    <span>LUNAS TERVERIFIKASI DJP</span>
                  </div>
                  <div class="inv-number-stamp">NSFP: 010.026-26.88392019</div>
                </div>
              </div>

              <!-- Dual-Entity Side by Side Comparison (Penjual PKP vs Pembeli BKP) -->
              <div class="inv-entities-grid">
                <div class="inv-entity-box">
                  <span class="inv-entity-title">
                    <Building2 :size="13" />
                    <span>PENGUSAHA KENA PAJAK (PENJUAL)</span>
                  </span>
                  <div class="inv-entity-name">PT HERO DIGITAL MULTITEK</div>
                  <div class="inv-entity-row">
                    <strong>NPWP:</strong>
                    <code>01.889.341.2-021.000</code>
                  </div>
                  <div class="inv-entity-row">
                    <strong>Alamat:</strong>
                    <span>Cyber 2 Tower Lt. 18, Jl. H.R. Rasuna Said, Jakarta Selatan</span>
                  </div>
                  <div class="inv-entity-row">
                    <strong>Billing:</strong>
                    <span>finance@aethercore.cloud • (021) 5290-8800</span>
                  </div>
                </div>

                <div class="inv-entity-box">
                  <span class="inv-entity-title">
                    <Award :size="13" />
                    <span>PEMBELI BKP / PENERIMA JKP (TENANT)</span>
                  </span>
                  <div class="inv-entity-name">{{ tenantTaxProfile.companyName || 'PT Pratama Solusi Solusindo' }}</div>
                  <div class="inv-entity-row">
                    <strong>NPWP:</strong>
                    <code>{{ tenantTaxProfile.npwp || '01.234.567.8-012.000' }}</code>
                  </div>
                  <div class="inv-entity-row">
                    <strong>Alamat:</strong>
                    <span>{{ tenantTaxProfile.taxAddress || 'Cyber 2 Tower Lt. 18, Jakarta Selatan 12950' }}</span>
                  </div>
                  <div class="inv-entity-row">
                    <strong>Finance:</strong>
                    <span>{{ tenantTaxProfile.taxEmail || userEmail }}</span>
                  </div>
                </div>
              </div>

              <!-- Meta Dates Bar -->
              <div class="inv-meta-dates-bar">
                <div class="inv-meta-date-item">
                  <span class="inv-meta-date-lbl">KODE REFERENSI:</span>
                  <span class="inv-meta-date-val">{{ selectedInvoice.id }}</span>
                </div>
                <div class="inv-meta-date-item">
                  <span class="inv-meta-date-lbl">TANGGAL PENAGIHAN:</span>
                  <span class="inv-meta-date-val">{{ selectedInvoice.date }}</span>
                </div>
                <div class="inv-meta-date-item">
                  <span class="inv-meta-date-lbl">METODE PEMBAYARAN:</span>
                  <span class="inv-meta-date-val">{{ selectedInvoice.paymentMethod }}</span>
                </div>
                <div class="inv-meta-date-item">
                  <span class="inv-meta-date-lbl">STATUS KLIRING:</span>
                  <span class="inv-meta-date-val" style="color: #059669;">BI-FAST SNAP API (Lunas)</span>
                </div>
              </div>

              <!-- BKP / JKP Items Table -->
              <div class="inv-table-wrap">
                <table class="inv-items-table">
                  <thead>
                    <tr>
                      <th style="width: 45px; text-align: center;">NO</th>
                      <th>NAMA BARANG / JASA KENA PAJAK (BKP / JKP)</th>
                      <th style="width: 170px;">PERIODE LAYANAN</th>
                      <th style="width: 130px; text-align: center;">KUOTA POD</th>
                      <th style="width: 190px; text-align: right;">HARGA JUAL / DPP</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style="text-align: center; font-weight: 700;">1</td>
                      <td>
                        <strong>{{ selectedInvoice.planName }} (Hero SaaS Subscription)</strong>
                        <p class="inv-item-desc">
                          Alokasi dedicated CPU cgroups v2, Traefik edge proxy ingress SSL TLS 1.3, Redis telemetry, automated snapshot backups, cluster node healthcheck.
                        </p>
                      </td>
                      <td>{{ selectedInvoice.period }}</td>
                      <td style="text-align: center;">
                        <span style="font-weight: 700; color: #0f172a;">{{ selectedInvoice.containerQuota }} Pods</span>
                      </td>
                      <td style="text-align: right; font-weight: 700; color: #0f172a;">
                        Rp {{ selectedInvoice.amount.toLocaleString('id-ID') }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Calculation & Terbilang Split Grid -->
              <div class="inv-calc-summary-grid">
                <div>
                  <div class="inv-terbilang-card">
                    <div class="inv-terbilang-title">TERBILANG:</div>
                    <div class="inv-terbilang-text"># {{ getTerbilang(selectedInvoice.total) }} #</div>
                  </div>

                  <div class="inv-tax-disclaimer">
                    ⚖️ <strong>Landasan Hukum DJP RI:</strong> Sesuai Peraturan Dirjen Pajak No. PER-03/PJ/2022, Faktur Pajak ini berbentuk elektronik dan sah tanpa cap atau tanda tangan basah. Pajak Masukan dapat dikreditkan menggunakan NPWP Perusahaan Anda.
                  </div>
                </div>

                <div class="inv-calc-box">
                  <div class="inv-calc-line">
                    <span>Harga Jual / Penggantian (DPP)</span>
                    <strong>Rp {{ selectedInvoice.amount.toLocaleString('id-ID') }}</strong>
                  </div>
                  <div class="inv-calc-line">
                    <span>Dikurangi Potongan Harga</span>
                    <strong>Rp 0</strong>
                  </div>
                  <div class="inv-calc-line">
                    <span>Dasar Pengenaan Pajak (DPP)</span>
                    <strong>Rp {{ selectedInvoice.amount.toLocaleString('id-ID') }}</strong>
                  </div>
                  <div class="inv-calc-line">
                    <span>PPN 11% (Dipungut Negara)</span>
                    <strong style="color: #059669;">Rp {{ selectedInvoice.tax.toLocaleString('id-ID') }}</strong>
                  </div>
                  <div class="inv-calc-line">
                    <span>Bea Meterai Lunas Elektronik</span>
                    <strong>Rp 0</strong>
                  </div>
                  <div class="inv-calc-total">
                    <span>Total Tagihan Resmi:</span>
                    <strong>Rp {{ selectedInvoice.total.toLocaleString('id-ID') }}</strong>
                  </div>
                </div>
              </div>

              <!-- Official Seal & Digital Verification Signatures -->
              <div class="inv-seal-signatures-row">
                <div class="inv-qr-validation-block">
                  <div class="inv-qr-box">
                    <QrCode :size="48" />
                  </div>
                  <div>
                    <div style="font-size: 11.5px; font-weight: 800; color: #0f172a;">VALIDASI DIGITAL DJP RI</div>
                    <div style="font-size: 11px; color: #64748b; margin-top: 2px;">
                      Hash Approval: <code>DJP-VAL-{{ selectedInvoice.id }}-VALID</code>
                    </div>
                    <div style="font-size: 10.5px; color: #059669; font-weight: 700; margin-top: 2px;">
                      ✓ Status Dokumen: Sah & Tercatat di Server Pajak
                    </div>
                  </div>
                </div>

                <div class="inv-cfo-sig-block">
                  <span class="inv-sig-place">Jakarta, {{ selectedInvoice.date }}</span>
                  <div class="inv-sig-stamp-badge">
                    <ShieldCheck :size="13" />
                    <span>DIGITALLY SIGNED & VERIFIED</span>
                  </div>
                  <h5 class="inv-sig-name">Andi Pratama, S.E., Ak., M.B.A.</h5>
                  <p class="inv-sig-role">Chief Financial Officer • PT Hero Digital Multitek</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Footer Actions (Guaranteed Side-by-Side) -->
          <div class="modal-footer-row">
            <button type="button" class="btn-modal-ghost" @click="isInvoiceDetailModalOpen = false">
              <span>Tutup</span>
            </button>
            <button type="button" class="btn-modal-ghost" @click="copyInvoiceId(selectedInvoice.id)">
              <Copy :size="14" />
              <span>Salin No. Faktur</span>
            </button>
            <button type="button" class="btn-modal-ghost" @click="handlePrintInvoice">
              <Printer :size="14" />
              <span>Cetak / Simpan PDF</span>
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
