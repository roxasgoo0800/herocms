<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  Layers,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  KeyRound
} from 'lucide-vue-next';

const router = useRouter();

const email = ref('');
const password = ref('');
const showPassword = ref(false);
const rememberMe = ref(true);
const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const isInputFocused = ref<'email' | 'password' | null>(null);

const handleLogin = async (e?: Event) => {
  if (e) e.preventDefault();
  errorMessage.value = '';
  successMessage.value = '';

  if (!email.value.trim() || !password.value.trim()) {
    errorMessage.value = 'Silakan masukkan email dan kata sandi Anda.';
    return;
  }

  isLoading.value = true;

  // Simulate authentication latency
  setTimeout(() => {
    isLoading.value = false;
    localStorage.setItem('cloudcms_auth_token', 'token_tenant_' + Date.now());
    localStorage.setItem('cloudcms_user_email', email.value);
    successMessage.value = 'Kredensial terverifikasi! Mengalihkan ke HeroCMS Studio...';

    setTimeout(() => {
      router.push('/');
    }, 550);
  }, 850);
};

const useDemoAccount = () => {
  email.value = 'admin@rizalpratama.cloud';
  password.value = 'heroCMS2026!';
  handleLogin();
};
</script>

<template>
  <div class="auth-viewport">
    <!-- Ambient Diffused Lighting Mesh (Soft Glow behind card) -->
    <div class="ambient-mesh-glow" aria-hidden="true"></div>

    <div class="auth-surface-container">
      <!-- Modern Brand Header -->
      <header class="auth-brand-badge">
        <div class="brand-glyph-box">
          <Layers :size="22" color="#ffffff" />
        </div>
        <div class="brand-title-wrap">
          <h1 class="brand-wordmark">HeroCMS <span class="wordmark-highlight">Studio</span></h1>
        </div>
      </header>

      <!-- Glassmorphic Authentication Card (Custom Bespoke Architecture) -->
      <div class="auth-panel-glass">
        <div class="panel-intro">
          <h2 class="panel-heading">Masuk ke Konsol Tenant</h2>
          <p class="panel-sub">Akses manajemen situs, orkestrasi kontainer, dan editor visual profesional.</p>
        </div>

        <!-- Dynamic Feedback Alert -->
        <transition name="fade-slide">
          <div v-if="errorMessage" class="state-alert error-state">
            <AlertCircle :size="16" class="alert-glyph" />
            <span>{{ errorMessage }}</span>
          </div>
        </transition>

        <transition name="fade-slide">
          <div v-if="successMessage" class="state-alert success-state">
            <CheckCircle2 :size="16" class="alert-glyph" />
            <span>{{ successMessage }}</span>
          </div>
        </transition>

        <form @submit="handleLogin" class="auth-fields-stack">
          <!-- Field 1: Email -->
          <div class="field-item">
            <label for="email" class="field-label">Alamat Email / Tenant ID</label>
            <div
              class="input-control-shell"
              :class="{ 'shell-focused': isInputFocused === 'email', 'shell-filled': email.length > 0 }"
            >
              <div class="shell-lead-icon">
                <Mail :size="16" />
              </div>
              <input
                id="email"
                v-model="email"
                type="email"
                placeholder="nama@institusi.com"
                required
                autocomplete="email"
                class="bare-input"
                @focus="isInputFocused = 'email'"
                @blur="isInputFocused = null"
              />
            </div>
          </div>

          <!-- Field 2: Password -->
          <div class="field-item">
            <div class="label-split-meta">
              <label for="password" class="field-label">Kata Sandi</label>
              <a
                href="#"
                class="link-forgot-pass"
                @click.prevent="errorMessage = 'Reset kata sandi dapat diajukan melalui administrator internal.'"
              >
                Lupa sandi?
              </a>
            </div>

            <div
              class="input-control-shell"
              :class="{ 'shell-focused': isInputFocused === 'password', 'shell-filled': password.length > 0 }"
            >
              <div class="shell-lead-icon">
                <Lock :size="16" />
              </div>
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••••••"
                required
                autocomplete="current-password"
                class="bare-input"
                @focus="isInputFocused = 'password'"
                @blur="isInputFocused = null"
              />
              <button
                type="button"
                class="btn-eye-toggle"
                @click="showPassword = !showPassword"
                tabindex="-1"
                aria-label="Toggle password visibility"
              >
                <EyeOff v-if="showPassword" :size="16" />
                <Eye v-else :size="16" />
              </button>
            </div>
          </div>

          <!-- Modern Custom Switch for Remember Me (No ugly browser checkbox) -->
          <div class="remember-row">
            <label class="bespoke-switch" @click.prevent="rememberMe = !rememberMe">
              <div class="switch-track" :class="{ active: rememberMe }">
                <div class="switch-thumb"></div>
              </div>
              <span class="switch-label">Ingat sesi aktif selama 30 hari</span>
            </label>
          </div>

          <!-- Primary Action CTA Button -->
          <button type="submit" class="btn-primary-action" :disabled="isLoading">
            <span v-if="isLoading" class="custom-spinner"></span>
            <span v-if="isLoading">Memverifikasi Sesi...</span>
            <span v-else class="cta-inner">
              <span>Masuk ke Studio</span>
              <ArrowRight :size="16" class="cta-arrow" />
            </span>
          </button>
        </form>

        <!-- Fast 1-Click Access Card (Bespoke Modern Developer Card) -->
        <div class="demo-access-strip" @click="useDemoAccount">
          <div class="demo-badge-icon">
            <Sparkles :size="15" color="#2563eb" />
          </div>
          <div class="demo-info">
            <div class="demo-title">Login Cepat dengan Akun Demo</div>
            <div class="demo-subtitle">admin@rizalpratama.cloud • heroCMS2026!</div>
          </div>
          <div class="demo-arrow">
            <KeyRound :size="14" />
          </div>
        </div>

        <!-- Security Ingress Guarantee Badge -->
        <footer class="panel-security-chip">
          <ShieldCheck :size="14" color="#059669" />
          <span>Koneksi TLS v1.3 • cgroups v2 Terisolasi</span>
        </footer>
      </div>

      <!-- Out-of-card subfooter -->
      <div class="auth-subfooter">
        <p>Butuh bantuan login? Hubungi administrator tenant atau <a href="http://localhost:3000" target="_blank">kembali ke portal pemasaran</a>.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ==========================================================================
   BESPOKE MODERN SAAS AUTHENTICATION DESIGN SYSTEM (NO BOOTSTRAP / NO MVP)
   ========================================================================== */

.auth-viewport {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: transparent;
  padding: 48px 20px;
  overflow: hidden;
}

/* Ambient Diffused Glow behind the card */
.ambient-mesh-glow {
  position: absolute;
  width: 540px;
  height: 400px;
  background: radial-gradient(
    circle,
    rgba(37, 99, 235, 0.08) 0%,
    rgba(148, 163, 184, 0.05) 50%,
    transparent 70%
  );
  filter: blur(50px);
  pointer-events: none;
  z-index: 1;
}

.auth-surface-container {
  width: 100%;
  max-width: 440px;
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Brand Header */
.auth-brand-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 24px;
}

.brand-glyph-box {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  box-shadow: 0 8px 20px -4px rgba(15, 23, 42, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.2s ease;
}

.brand-glyph-box:hover {
  transform: translateY(-1px);
}

.brand-wordmark {
  font-size: 1.55rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.03em;
  line-height: 1.2;
}

.wordmark-highlight {
  background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.brand-chip-row {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(248, 250, 252, 0.85);
  border: 1px solid #e2e8f0;
  padding: 3px 10px;
  border-radius: 999px;
  margin-top: 6px;
}

.pulse-dot {
  width: 6px;
  height: 6px;
  background: #10b981;
  border-radius: 50%;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
}

.chip-text {
  font-size: 0.72rem;
  color: #64748b;
  font-weight: 600;
  letter-spacing: 0.02em;
}

/* Glassmorphic Panel Surface */
.auth-panel-glass {
  width: 100%;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: 20px;
  padding: 32px 28px;
  box-shadow:
    0 0 0 1px rgba(15, 23, 42, 0.03),
    0 16px 36px -8px rgba(15, 23, 42, 0.07),
    0 2px 6px rgba(15, 23, 42, 0.02);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.panel-intro {
  margin-bottom: 2px;
}

.panel-heading {
  font-size: 1.18rem;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.01em;
  margin-bottom: 4px;
}

.panel-sub {
  font-size: 0.82rem;
  color: #64748b;
  line-height: 1.45;
}

/* State Alerts */
.state-alert {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 500;
}

.state-alert.error-state {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #991b1b;
}

.state-alert.success-state {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #166534;
}

.alert-glyph {
  flex-shrink: 0;
}

/* Form Stack */
.auth-fields-stack {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.field-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #334155;
  letter-spacing: -0.01em;
}

.label-split-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.link-forgot-pass {
  font-size: 0.76rem;
  color: #2563eb;
  text-decoration: none;
  font-weight: 600;
}

.link-forgot-pass:hover {
  text-decoration: underline;
}

/* Bespoke Input Control Shell */
.input-control-shell {
  position: relative;
  display: flex;
  align-items: center;
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  padding: 0 12px;
  height: 42px;
  transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
}

.input-control-shell:hover {
  border-color: #94a3b8;
  background: #ffffff;
}

.input-control-shell.shell-focused {
  background: #ffffff;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12), 0 1px 2px rgba(15, 23, 42, 0.04);
}

.input-control-shell.shell-focused .shell-lead-icon {
  color: #2563eb;
}

.shell-lead-icon {
  color: #94a3b8;
  display: flex;
  align-items: center;
  margin-right: 10px;
  pointer-events: none;
  transition: color 0.15s ease;
}

.bare-input {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-size: 0.88rem;
  color: #0f172a;
  font-family: inherit;
}

.bare-input::placeholder {
  color: #94a3b8;
  font-weight: 400;
}

.btn-eye-toggle {
  background: transparent;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  border-radius: 4px;
  transition: color 0.15s ease;
}

.btn-eye-toggle:hover {
  color: #334155;
}

/* Modern Switch Toggle (No generic checkbox) */
.remember-row {
  display: flex;
  align-items: center;
  margin-top: -2px;
}

.bespoke-switch {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
}

.switch-track {
  width: 32px;
  height: 18px;
  background: #e2e8f0;
  border-radius: 999px;
  position: relative;
  transition: background-color 0.2s ease;
}

.switch-track.active {
  background: #0f172a;
}

.switch-thumb {
  width: 14px;
  height: 14px;
  background: #ffffff;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: 2px;
  transition: transform 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
}

.switch-track.active .switch-thumb {
  transform: translateX(14px);
}

.switch-label {
  font-size: 0.78rem;
  color: #475569;
  font-weight: 500;
}

/* Primary CTA Button */
.btn-primary-action {
  width: 100%;
  height: 42px;
  background: #0f172a;
  color: #ffffff;
  border: 1px solid #0f172a;
  border-radius: 10px;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 4px;
  transition: all 0.15s ease;
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.08),
    0 4px 10px rgba(15, 23, 42, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.12);
}

.btn-primary-action:hover:not(:disabled) {
  background: #1e293b;
  transform: translateY(-1px);
  box-shadow:
    0 2px 4px rgba(15, 23, 42, 0.1),
    0 8px 18px rgba(15, 23, 42, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.18);
}

.btn-primary-action:active:not(:disabled) {
  transform: translateY(0);
}

.btn-primary-action:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.cta-inner {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.cta-arrow {
  transition: transform 0.15s ease;
}

.btn-primary-action:hover .cta-arrow {
  transform: translateX(2px);
}

/* Fast 1-Click Demo Card */
.demo-access-strip {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.demo-access-strip:hover {
  background: #eff6ff;
  border-color: #bfdbfe;
  border-style: solid;
}

.demo-badge-icon {
  width: 28px;
  height: 28px;
  border-radius: 7px;
  background: #eff6ff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.demo-info {
  flex: 1;
}

.demo-title {
  font-size: 0.8rem;
  font-weight: 600;
  color: #0f172a;
}

.demo-subtitle {
  font-size: 0.72rem;
  color: #64748b;
  font-family: monospace;
}

.demo-arrow {
  color: #94a3b8;
  display: flex;
  align-items: center;
}

.demo-access-strip:hover .demo-arrow {
  color: #2563eb;
}

/* Security Chip */
.panel-security-chip {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 0.72rem;
  color: #64748b;
  padding-top: 4px;
}

/* Subfooter */
.auth-subfooter {
  margin-top: 20px;
  font-size: 0.78rem;
  color: #64748b;
  text-align: center;
}

.auth-subfooter a {
  color: #2563eb;
  text-decoration: none;
  font-weight: 600;
}

.auth-subfooter a:hover {
  text-decoration: underline;
}

/* Spinner */
.custom-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  margin-right: 6px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Transitions */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.2s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
