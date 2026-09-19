<script setup lang="ts">
import {
  Briefcase,
  BookOpen,
  GraduationCap,
  ShoppingBag,
  CheckCircle2,
  ChevronRight
} from 'lucide-vue-next';
import { useDashboardData } from '../../composables/useDashboardData';

const {
  officialTemplates,
  openCreateModal
} = useDashboardData();
</script>

<template>
  <section class="fade-in-section">
    <div class="page-intro-row">
      <div>
        <h1 class="page-title">Katalog Template & Pricelist</h1>
        <p class="page-desc">Pilih template resmi siap pakai yang dioptimalkan untuk SEO dan kemudahan editor blok.</p>
      </div>
    </div>

    <div class="template-market-grid">
      <div v-for="tpl in officialTemplates" :key="tpl.id" class="tpl-market-card">
        <div class="tpl-card-header">
          <span class="tpl-type-pill">{{ tpl.category.toUpperCase() }}</span>
          <span class="tpl-tier-pill" :class="{ 'tier-pro': tpl.isPro }">{{ tpl.tier }}</span>
        </div>

        <div class="tpl-icon-preview">
          <Briefcase v-if="tpl.category === 'portfolio'" :size="32" color="#2563eb" />
          <BookOpen v-else-if="tpl.category === 'blog'" :size="32" color="#2563eb" />
          <GraduationCap v-else-if="tpl.category === 'education'" :size="32" color="#059669" />
          <ShoppingBag v-else :size="32" color="#d97706" />
        </div>

        <div class="tpl-card-body">
          <h3 class="tpl-card-title">{{ tpl.title }}</h3>
          <p class="tpl-card-desc">{{ tpl.desc }}</p>

          <ul class="tpl-checklist">
            <li v-for="(feat, fIdx) in tpl.features" :key="fIdx">
              <CheckCircle2 :size="13" color="#059669" />
              <span>{{ feat }}</span>
            </li>
          </ul>
        </div>

        <div class="tpl-card-bottom">
          <div class="tpl-cost">
            <span>Lisensi:</span>
            <strong>{{ tpl.priceText }}</strong>
          </div>
          <button class="btn-use-tpl" @click="openCreateModal(tpl.category)">
            <span>Pakai Template</span>
            <ChevronRight :size="14" />
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
