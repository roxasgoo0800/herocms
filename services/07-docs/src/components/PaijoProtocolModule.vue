<script setup lang="ts">
import { ref } from 'vue';
import { Bot, Check, Copy } from 'lucide-vue-next';
import { useDocsStore } from '../stores/docsStore';

const store = useDocsStore();
const isCopied = ref(false);

const reportingTemplate = `Lapor Paijo:
- Pelaksana: [Nama Anda / Andalusia / Irgi / Risqi / Rizal / Tyno]
- Task ID: [Contoh: TSK-BE-SEC-01 / TSK-QA-01]
- Status: ONGOING
- Progress Tampilan: Selesai & Dicentang pada Checklist
- Progress Proses Real: Sedang Berjalan / Siap Handover
- Service: [02-dashboard-cms / 03-provision-orchestrator / dll]
- Bukti Teknis: [Commit hash, file link, output uji pentest PASS]
- Catatan Integrasi: [Dependensi API ke rekan tim lain]`;

function copyTemplate() {
  navigator.clipboard.writeText(reportingTemplate);
  isCopied.value = true;
  store.showToast('Template Laporan Paijo berhasil disalin ke clipboard!');
  setTimeout(() => {
    isCopied.value = false;
  }, 2000);
}
</script>

<template>
  <div class="paijo-protocol-module fade-in-section" style="display: flex; flex-direction: column; gap: 24px;">
    <!-- Persona Hero Panel -->
    <div class="pro-panel" style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #ffffff; border-color: #334155; padding: 28px 32px;">
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap;">
        <div>
          <div style="display: inline-flex; align-items: center; gap: 6px; background: rgba(37, 99, 235, 0.2); border: 1px solid rgba(147, 197, 253, 0.3); padding: 4px 12px; border-radius: 999px; font-size: 0.76rem; font-weight: 700; color: #93c5fd; margin-bottom: 12px;">
            <Bot :size="14" />
            <span>KARYAWAN INTERNAL INTI</span> • <span>LEAD PM & QA/QC SPECIALIST</span>
          </div>
          <h2 style="margin: 0 0 8px 0; font-size: 1.5rem; font-weight: 800; letter-spacing: -0.02em; color: #ffffff;">
            Protokol Kerja & Quality Gate Paijo AI
          </h2>
          <p style="margin: 0; color: #cbd5e1; font-size: 0.9rem; max-width: 680px; line-height: 1.6;">
            Sebagai Lead Project Manager dan Penanggung Jawab QA & QC di tim HeroCMS, tugas harian saya adalah menjaga ritme sprint backlog tanpa henti, membagikan pekerjaan secara presisi ke 5 rekan tim, serta menegakkan gerbang kualitas Definition of Done (DoD) tanpa kompromi.
          </p>
        </div>

        <div style="background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 12px; padding: 18px 22px; text-align: center; min-width: 220px;">
          <div style="font-size: 0.74rem; color: #94a3b8; font-weight: 700; text-transform: uppercase;">Status Pelayanan</div>
          <div style="font-size: 1.35rem; font-weight: 800; color: #38bdf8; margin: 4px 0;">24/7 Siaga Aktif</div>
          <div style="font-size: 0.72rem; color: #cbd5e1;">50 Tasks Terpantau • 0 Blockers</div>
        </div>
      </div>
    </div>

    <!-- 5 Pilar Definition of Done (DoD) Grid -->
    <div class="pro-panel">
      <div class="panel-head">
        <div>
          <h3 style="margin: 0; font-size: 1.1rem; font-weight: 800; color: #0f172a;">
            🎯 5 Pilar Definition of Done (DoD) Wajib Sebelum Merge
          </h3>
          <p class="page-desc" style="margin-top: 4px; font-size: 0.82rem;">
            Setiap tugas yang diajukan oleh Andalusia, Irgi, Risqi, Rizal, maupun Tyno wajib memenuhi 5 pilar ini sebelum disetujui:
          </p>
        </div>
        <span class="nav-badge badge-primary">Paijo Quality Gate</span>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 14px;">
        <div class="pro-panel" style="padding: 16px; background: #f8fafc;">
          <div style="font-size: 0.92rem; font-weight: 800; color: #0f172a; margin-bottom: 6px;">1️⃣ Zero-CSS Duplication</div>
          <div style="font-size: 0.82rem; color: #475569; line-height: 1.5;">
            Wajib memanfaatkan <code>studio-master.css</code>. Dilarang menduplikasi styling tombol, kartu, tabel, atau modal di scoped style.
          </div>
        </div>

        <div class="pro-panel" style="padding: 16px; background: #f8fafc;">
          <div style="font-size: 0.92rem; font-weight: 800; color: #0f172a; margin-bottom: 6px;">2️⃣ Mandatory Pentest PASS</div>
          <div style="font-size: 0.82rem; color: #475569; line-height: 1.5;">
            Pengujian <code>go test -v ./pentest/...</code> pada service terkait wajib lolos status PASS sebelum commit atau PR.
          </div>
        </div>

        <div class="pro-panel" style="padding: 16px; background: #f8fafc;">
          <div style="font-size: 0.92rem; font-weight: 800; color: #0f172a; margin-bottom: 6px;">3️⃣ Clean Resource Separation</div>
          <div style="font-size: 0.82rem; color: #475569; line-height: 1.5;">
            Data statis, array mock, dan konstanta wajib diimpor dari <code>src/data/*.ts</code>. Folder <code>src/assets/</code> khusus aset visual.
          </div>
        </div>

        <div class="pro-panel" style="padding: 16px; background: #f8fafc;">
          <div style="font-size: 0.92rem; font-weight: 800; color: #0f172a; margin-bottom: 6px;">4️⃣ SemVer Changelog Logged</div>
          <div style="font-size: 0.82rem; color: #475569; line-height: 1.5;">
            Versi rilis wajib dinaikkan (SemVer) dan dicatat rapi pada dataset resmi <code>src/data/changelog.ts</code>.
          </div>
        </div>

        <div class="pro-panel" style="padding: 16px; background: #f8fafc;">
          <div style="font-size: 0.92rem; font-weight: 800; color: #0f172a; margin-bottom: 6px;">5️⃣ Mobile Responsive & 60fps</div>
          <div style="font-size: 0.82rem; color: #475569; line-height: 1.5;">
            Tampilan antarmuka tidak boleh meluap (overflow horizontal) di layar smartphone dan animasi berjalan mulus 60fps.
          </div>
        </div>
      </div>
    </div>

    <!-- Official Reporting Template Helper -->
    <div class="pro-panel">
      <div class="panel-head">
        <div>
          <h3 style="margin: 0; font-size: 1.1rem; font-weight: 800; color: #0f172a;">
            📝 Template Laporan Progres Resmi (Lapor Paijo)
          </h3>
          <p class="page-desc" style="margin-top: 4px; font-size: 0.82rem;">
            Gunakan format ini saat mengklaim task, melaporkan progres harian, atau mengajukan serah terima pekerjaan ke Paijo:
          </p>
        </div>
        <button class="btn-top-create" @click="copyTemplate" style="height: 34px; font-size: 0.8rem;">
          <Check v-if="isCopied" :size="14" color="#10b981" />
          <Copy v-else :size="14" />
          <span>{{ isCopied ? 'Tersalin ke Clipboard!' : 'Salin Template Lapor' }}</span>
        </button>
      </div>

      <pre style="background: #0f172a; color: #38bdf8; font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; padding: 18px; border-radius: 8px; overflow-x: auto; margin: 0; border-left: 4px solid #2563eb;"><code>{{ reportingTemplate }}</code></pre>
    </div>
  </div>
</template>
