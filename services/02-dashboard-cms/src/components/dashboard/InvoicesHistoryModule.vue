<script setup lang="ts">
import {
  Clock,
  CheckCircle2,
  CreditCard,
  Receipt,
  Download,
  Check,
  Layers,
  X
} from 'lucide-vue-next';
import { useDashboardData } from '../../composables/useDashboardData';

const {
  invoices,
  userEmail,
  selectedInvoice,
  isInvoiceDetailModalOpen,
  openInvoiceDetail,
  downloadInvoiceReceipt
} = useDashboardData();
</script>

<template>
  <section class="fade-in-section">
    <div class="page-intro-row">
      <div>
        <h1 class="page-title">Faktur & Riwayat Invoice</h1>
        <p class="page-desc">Faktur resmi ber-NPWP untuk setiap siklus penagihan langganan HeroCMS Studio untuk kebutuhan pembukuan dan pajak perusahaan Anda.</p>
      </div>
    </div>

    <!-- 3 Commercial Summary Cards -->
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
          <span class="telemetry-label">STATUS PEMBAYARAN</span>
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
    </div>

    <!-- Invoices Table Panel -->
    <div class="pro-panel">
      <div class="panel-head">
        <h3>Daftar Faktur Pajak & Tagihan Resmi</h3>
        <span class="redis-chip">SaaS Billing Ledger</span>
      </div>
      <div class="table-responsive">
        <table class="pro-table">
          <thead>
            <tr>
              <th>NO. FAKTUR</th>
              <th>TANGGAL PENAGIHAN</th>
              <th>DESKRIPSI PAKET</th>
              <th>METODE BAYAR</th>
              <th>TOTAL (TERMASUK PPN)</th>
              <th>STATUS</th>
              <th style="text-align: right">DOKUMEN</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="inv in invoices" :key="inv.id">
              <td>
                <code class="invoice-id-code">{{ inv.id }}</code>
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
                <span class="payment-method-tag">{{ inv.paymentMethod }}</span>
              </td>
              <td>
                <strong class="total-price-cell">Rp {{ inv.total.toLocaleString('id-ID') }}</strong>
              </td>
              <td>
                <span class="status-badge badge-published">
                  <Check :size="11" />
                  LUNAS
                </span>
              </td>
              <td style="text-align: right">
                <div class="row-actions">
                  <button class="btn-invoice-view" @click="openInvoiceDetail(inv)" title="Lihat Rincian Faktur">
                    <Receipt :size="13" />
                    <span>Faktur</span>
                  </button>
                  <button class="btn-invoice-dl" @click="downloadInvoiceReceipt(inv)" title="Unduh File Faktur">
                    <Download :size="13" />
                    <span>Unduh</span>
                  </button>
                </div>
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
              <h3 class="modal-heading">Faktur Pajak Elektronik Resmi</h3>
              <p class="modal-subheading">Dokumen tagihan resmi ber-NPWP PT Hero Digital Multitek untuk pembukuan.</p>
            </div>
          </div>
          <button class="modal-close-button" @click="isInvoiceDetailModalOpen = false" title="Tutup">
            <X :size="16" />
          </button>
        </div>

        <div class="invoice-doc-body">
          <div class="invoice-paper">
            <div class="inv-paper-top">
              <div class="inv-company-brand">
                <div class="inv-brand-mark">
                  <Layers :size="20" />
                </div>
                <div>
                  <h4 class="inv-brand-title">PT HERO DIGITAL MULTITEK</h4>
                  <p class="inv-brand-sub">NPWP: 01.889.341.2-021.000 • ID Billing E-Faktur</p>
                  <p class="inv-brand-sub">Cyber 2 Tower Lt. 18, Jl. H.R. Rasuna Said, Jakarta Selatan</p>
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
                      <p class="inv-item-desc">Alokasi CPU cgroups v2, Traefik proxy ingress, sertifikat SSL auto-renew.</p>
                    </td>
                    <td>{{ selectedInvoice.period }}</td>
                    <td style="text-align: center">{{ selectedInvoice.containerQuota }} Kontainer</td>
                    <td style="text-align: right">Rp {{ selectedInvoice.amount.toLocaleString('id-ID') }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="inv-summary-row">
              <div class="inv-note-box">
                <strong>Catatan Pembayaran:</strong>
                <p>Faktur ini sah dan diterbitkan secara digital oleh sistem penagihan HeroCMS. PPN 11% telah disetorkan sesuai regulasi PMK-60/PMK.03/2022.</p>
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
                  <span>Total Tagihan</span>
                  <strong>Rp {{ selectedInvoice.total.toLocaleString('id-ID') }}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer-row">
          <button type="button" class="btn-modal-ghost" @click="isInvoiceDetailModalOpen = false">
            Tutup
          </button>
          <button type="button" class="btn-modal-confirm" @click="downloadInvoiceReceipt(selectedInvoice)">
            <Download :size="14" />
            <span>Unduh Faktur Teks</span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
