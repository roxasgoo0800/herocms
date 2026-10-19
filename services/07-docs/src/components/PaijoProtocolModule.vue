<template>
  <div class="paijo-protocol-module" style="display: flex; flex-direction: column; gap: 1.5rem;">
    <!-- Persona Hero -->
    <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border-radius: 14px; padding: 2rem; color: #ffffff; display: flex; align-items: center; justify-content: space-between; gap: 1.5rem; flex-wrap: wrap;">
      <div>
        <div style="display: inline-flex; align-items: center; gap: 0.45rem; background: rgba(59, 130, 246, 0.2); border: 1px solid rgba(147, 197, 253, 0.3); padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.78rem; font-weight: 600; color: #93c5fd; margin-bottom: 0.75rem;">
          <span>🤖 Karyawan Internal Inti</span> • <span>PM & QA/QC Specialist</span>
        </div>
        <h2 style="margin: 0 0 0.5rem 0; font-size: 1.6rem; font-weight: 800; letter-spacing: -0.02em;">
          Protokol Kerja & Quality Gate Paijo AI
        </h2>
        <p style="margin: 0; color: #cbd5e1; font-size: 0.95rem; max-width: 680px; line-height: 1.6;">
          Sebagai Lead Project Manager dan Penanggung Jawab QA & QC di tim HeroCMS, tugas harian saya adalah menjaga ritme sprint backlog tanpa henti, membagikan pekerjaan secara presisi ke 5 rekan tim, serta menegakkan gerbang kualitas Definition of Done (DoD) tanpa kompromi.
        </p>
      </div>

      <div style="background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 12px; padding: 1.25rem 1.5rem; text-align: center; min-width: 220px;">
        <div style="font-size: 0.8rem; color: #94a3b8; font-weight: 600;">Status Pelayanan</div>
        <div style="font-size: 1.3rem; font-weight: 800; color: #38bdf8; margin: 0.25rem 0;">24/7 Siaga Aktif</div>
        <div style="font-size: 0.74rem; color: #cbd5e1;">50 Tasks Terpantau • 0 Blockers</div>
      </div>
    </div>

    <!-- 5 Pilar Definition of Done (DoD) -->
    <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.5rem;">
      <h3 style="margin: 0 0 0.5rem 0; font-size: 1.15rem; font-weight: 700; color: #0f172a;">
        🎯 5 Pilar Definition of Done (DoD) Wajib Sebelum Merge
      </h3>
      <p style="margin: 0 0 1.25rem 0; font-size: 0.88rem; color: #64748b;">
        Setiap tugas yang diajukan oleh Andalusia, Irgi, Risqi, Rizal, maupun Tyno wajib memenuhi 5 pilar pemeriksaan ini sebelum disetujui oleh Paijo:
      </p>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem;">
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 1rem;">
          <div style="font-size: 1.2rem; margin-bottom: 0.4rem;">1️⃣ Zero-CSS Duplication</div>
          <div style="font-size: 0.84rem; color: #475569; line-height: 1.5;">
            Memanfaatkan master stylesheet <code>studio-master.css</code>. Dilarang menduplikasi kelas tombol, kartu telemetri, atau modal di scoped style.
          </div>
        </div>

        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 1rem;">
          <div style="font-size: 1.2rem; margin-bottom: 0.4rem;">2️⃣ Mandatory Pentest PASS</div>
          <div style="font-size: 0.84rem; color: #475569; line-height: 1.5;">
            Pengujian <code>go test -v ./pentest/...</code> pada service terkait wajib lolos status PASS (atau SKIP jika servis belum dinyalakan).
          </div>
        </div>

        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 1rem;">
          <div style="font-size: 1.2rem; margin-bottom: 0.4rem;">3️⃣ Clean Resource Separation</div>
          <div style="font-size: 0.84rem; color: #475569; line-height: 1.5;">
            Data statis, array mock, dan preset wajib berada di folder <code>src/data/*.ts</code>. Folder <code>src/assets/</code> khusus visual murni.
          </div>
        </div>

        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 1rem;">
          <div style="font-size: 1.2rem; margin-bottom: 0.4rem;">4️⃣ SemVer Changelog Logged</div>
          <div style="font-size: 0.84rem; color: #475569; line-height: 1.5;">
            Nomor versi baru wajib dinaikkan dan dicatat ke dalam dataset <code>src/data/changelog.ts</code> sebelum commit atau push.
          </div>
        </div>

        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 1rem;">
          <div style="font-size: 1.2rem; margin-bottom: 0.4rem;">5️⃣ Mobile Responsive & 60fps</div>
          <div style="font-size: 0.84rem; color: #475569; line-height: 1.5;">
            Tampilan antarmuka tidak boleh meluap (overflow horizontal) di layar smartphone dan drag-and-drop berjalan mulus 60fps.
          </div>
        </div>
      </div>
    </div>

    <!-- Official Reporting Template Helper -->
    <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.5rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
        <h3 style="margin: 0; font-size: 1.15rem; font-weight: 700; color: #0f172a;">
          📝 Template Laporan Progres Resmi (Lapor Paijo)
        </h3>
        <button 
          style="background: #0f172a; color: #ffffff; border: none; border-radius: 8px; padding: 0.45rem 0.95rem; font-size: 0.82rem; font-weight: 600; cursor: pointer;"
          @click="copyTemplate"
        >
          📋 Salin Template
        </button>
      </div>
      <p style="margin: 0 0 1rem 0; font-size: 0.88rem; color: #64748b;">
        Gunakan format ini saat mengklaim task, melaporkan progres harian, atau mengajukan serah terima pekerjaan ke Paijo:
      </p>

      <pre style="background: #0f172a; color: #38bdf8; font-family: 'JetBrains Mono', monospace; font-size: 0.82rem; padding: 1.25rem; border-radius: 8px; overflow-x: auto; margin: 0; border-left: 4px solid #2563eb;"><code>{{ reportingTemplate }}</code></pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDocsStore } from '../stores/docsStore';

const store = useDocsStore();

const reportingTemplate = `Lapor Paijo:
- Pelaksana: [Nama Anda / Andalusia / Irgi / Risqi / Rizal / Tyno]
- Task ID: [Contoh: TSK-CNT-01 / TSK-QA-01]
- Status: ONGOING
- Progress Tampilan: Selesai & Dicentang pada Checklist
- Progress Proses Real: Sedang Berjalan / Siap Handover
- Service: [02-dashboard-cms / 03-provision-orchestrator / dll]
- Bukti Teknis: [Commit hash, file link, output uji pentest PASS]
- Catatan Integrasi: [Dependensi API ke rekan tim lain]`;

function copyTemplate() {
  navigator.clipboard.writeText(reportingTemplate);
  store.showToast('Template Laporan Paijo berhasil disalin ke clipboard!');
}
</script>
