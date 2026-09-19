<script setup lang="ts">
import {
  Globe,
  Plus,
  CheckCircle2,
  RotateCw,
  ShieldCheck,
  Trash2
} from 'lucide-vue-next';
import { useDashboardData } from '../../composables/useDashboardData';

const {
  containers,
  customDomains,
  newDomainInput,
  targetContainerForDomain,
  handleAddDomain,
  deleteDomain
} = useDashboardData();
</script>

<template>
  <section class="fade-in-section">
    <div class="page-intro-row">
      <div>
        <h1 class="page-title">Custom Domain & DNS Edge</h1>
        <p class="page-desc">Hubungkan domain pribadi Anda ke edge proxy Traefik v3 dengan auto-provisioning sertifikat SSL TLS v1.3 Let's Encrypt.</p>
      </div>
    </div>

    <!-- Add Domain Input Box -->
    <div class="pro-panel add-domain-box">
      <h3>Hubungkan Domain Baru</h3>
      <p>Masukkan domain atau subdomain kustom milik Anda yang telah dibeli di registrar (Niagahoster, Domainesia, Cloudflare, dll).</p>
      <div class="domain-form-row">
        <div class="domain-input-wrap">
          <Globe :size="15" class="domain-lead-icon" />
          <input
            v-model="newDomainInput"
            type="text"
            placeholder="contoh: rizalpratama.id atau blog.bisnis.com"
            class="domain-text-input"
          />
        </div>
        <select v-model="targetContainerForDomain" class="domain-select-target">
          <option v-for="c in containers" :key="c.id" :value="c.id">
            Tautkan ke: {{ c.name }}
          </option>
        </select>
        <button class="btn-top-create" @click="handleAddDomain">
          <Plus :size="14" />
          <span>Hubungkan Domain</span>
        </button>
      </div>
    </div>

    <!-- Domains List -->
    <div class="domains-list-panel pro-panel">
      <div class="panel-head">
        <h3>Domain Terhubung & Panduan DNS</h3>
        <span class="redis-chip">Traefik v3 Ingress</span>
      </div>

      <div v-for="dom in customDomains" :key="dom.id" class="domain-card-item">
        <div class="domain-item-head">
          <div class="domain-title-group">
            <Globe :size="17" class="dom-icon" />
            <div>
              <h4 class="dom-name">{{ dom.domain }}</h4>
              <span class="dom-sub">Menuju kontainer: <strong>{{ dom.targetContainer }}</strong> (Ditambahkan: {{ dom.addedDate }})</span>
            </div>
          </div>
          <div class="domain-badges">
            <span class="status-badge badge-published" v-if="dom.status === 'active'">
              <CheckCircle2 :size="12" />
              DNS Terpropagasi
            </span>
            <span class="status-badge badge-draft" v-else>
              <RotateCw :size="12" class="spin-icon" />
              Memverifikasi DNS...
            </span>
            <span class="ssl-badge-edge">
              <ShieldCheck :size="12" />
              TLS 1.3 Let's Encrypt
            </span>
            <button class="btn-action-icon danger" @click="deleteDomain(dom)" title="Putuskan Domain">
              <Trash2 :size="13" />
            </button>
          </div>
        </div>

        <!-- DNS Helper Table -->
        <div class="dns-records-helper">
          <div class="dns-helper-title">Konfigurasi DNS di Registrar Domain Anda:</div>
          <div class="table-responsive">
            <table class="pro-table">
              <thead>
                <tr>
                  <th>TIPE</th>
                  <th>NAME / HOST</th>
                  <th>VALUE / TARGET</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><span class="dns-target-code">CNAME</span></td>
                  <td><code>@</code> atau <code>www</code></td>
                  <td><code>{{ dom.cnameRecord }}</code></td>
                  <td><span class="status-badge badge-published">Valid (Proksi Aktif)</span></td>
                </tr>
                <tr>
                  <td><span class="dns-target-code">A</span></td>
                  <td><code>@</code></td>
                  <td><code>{{ dom.aRecord }}</code></td>
                  <td><span class="status-badge badge-published">Valid (Traefik Edge)</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
