<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  Layers,
  Lock,
  User,
  Mail,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  UserPlus
} from 'lucide-vue-next';
import { studioApi } from '../services/apiClient';

const router = useRouter();

// Auth Mode
const authMode = ref<'login' | 'register'>('login');

// Login State
const email = ref('');
const password = ref('');
const showPassword = ref(false);
const rememberMe = ref(true);

// Register State
const regFullName = ref('');
const regEmail = ref('');
const regPassword = ref('');
const regConfirmPassword = ref('');
const showRegPassword = ref(false);

const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const isInputFocused = ref<string | null>(null);

const setAuthMode = (mode: 'login' | 'register') => {
  authMode.value = mode;
  errorMessage.value = '';
  successMessage.value = '';
};

const handleLogin = async (e?: Event) => {
  if (e) e.preventDefault();
  errorMessage.value = '';
  successMessage.value = '';

  const idVal = email.value.trim();
  const passVal = password.value.trim();

  if (!idVal || !passVal) {
    errorMessage.value = 'Silakan masukkan username/email dan kata sandi Anda.';
    return;
  }

  isLoading.value = true;

  try {
    const res = await studioApi.login(idVal, passVal);
    if (res?.token) {
      localStorage.setItem('cloudcms_auth_token', res.token);
      localStorage.setItem('cloudcms_user_email', res.user?.email || idVal);
      successMessage.value = 'Kredensial terverifikasi! Mengalihkan ke HeroCMS Studio...';

      setTimeout(() => {
        router.push('/');
      }, 500);
    } else {
      throw new Error(res?.error || 'Autentikasi gagal');
    }
  } catch (err: any) {
    errorMessage.value = err?.message || 'Kredensial tidak valid. Silakan periksa kembali akun Anda.';
  } finally {
    isLoading.value = false;
  }
};

const handleRegister = async (e?: Event) => {
  if (e) e.preventDefault();
  errorMessage.value = '';
  successMessage.value = '';

  const nameVal = regFullName.value.trim();
  const emailVal = regEmail.value.trim();
  const passVal = regPassword.value.trim();
  const confirmVal = regConfirmPassword.value.trim();

  if (!nameVal || !emailVal || !passVal) {
    errorMessage.value = 'Semua field wajib diisi.';
    return;
  }

  if (passVal.length < 6) {
    errorMessage.value = 'Kata sandi minimal terdiri dari 6 karakter.';
    return;
  }

  if (passVal !== confirmVal) {
    errorMessage.value = 'Konfirmasi kata sandi tidak cocok.';
    return;
  }

  isLoading.value = true;

  try {
    const res = await studioApi.register(nameVal, emailVal, passVal);
    if (res?.token) {
      localStorage.setItem('cloudcms_auth_token', res.token);
      localStorage.setItem('cloudcms_user_email', res.user?.email || emailVal);
      successMessage.value = 'Akun berhasil dibuat! Mengalihkan ke pemilihan kuota kontainer...';

      setTimeout(() => {
        router.push('/onboarding');
      }, 600);
    } else {
      throw new Error(res?.error || 'Pendaftaran gagal');
    }
  } catch (err: any) {
    errorMessage.value = err?.message || 'Gagal mendaftar. Silakan coba username/email lain.';
  } finally {
    isLoading.value = false;
  }
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

      <!-- Glassmorphic Authentication Card -->
      <div class="auth-panel-glass">
        <!-- Tab Pill Switcher with Animated Sliding Glider -->
        <div class="auth-tabs-bar">
          <div
            class="tab-glider-track"
            :class="{ 'glider-register': authMode === 'register' }"
            aria-hidden="true"
          ></div>
          <button
            type="button"
            class="tab-pill"
            :class="{ active: authMode === 'login' }"
            @click="setAuthMode('login')"
          >
            Masuk
          </button>
          <button
            type="button"
            class="tab-pill"
            :class="{ active: authMode === 'register' }"
            @click="setAuthMode('register')"
          >
            <Sparkles :size="13" class="pill-spark" />
            Daftar Akun Baru
          </button>
        </div>

        <transition name="auth-text-swap" mode="out-in">
          <div :key="authMode" class="panel-intro">
            <h2 class="panel-heading">
              {{ authMode === 'login' ? 'Masuk ke Konsol Tenant' : 'Buat Akun Tenant Baru' }}
            </h2>
            <p class="panel-sub">
              {{ authMode === 'login' 
                ? 'Akses manajemen situs, orkestrasi kontainer, dan editor visual profesional.' 
                : 'Daftar sekarang untuk meluncurkan kluster kontainer website instan Anda.' }}
            </p>
          </div>
        </transition>

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

        <!-- Animated Form Switcher -->
        <transition name="auth-form-swap" mode="out-in">
          <!-- FORM: LOGIN -->
          <form v-if="authMode === 'login'" key="login-form" @submit="handleLogin" class="auth-fields-stack">
            <!-- Field 1: Username / Email -->
            <div class="field-item">
              <label for="email" class="field-label">Username atau Alamat Email</label>
              <div
                class="input-control-shell"
                :class="{ 'shell-focused': isInputFocused === 'email', 'shell-filled': email.length > 0 }"
              >
              <div class="shell-lead-icon">
                <User :size="16" />
              </div>
              <input
                id="email"
                v-model="email"
                type="text"
                placeholder="admin atau nama@institusi.com"
                required
                autocomplete="username"
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

          <!-- Remember Me Switch -->
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

        <!-- FORM: REGISTER -->
        <form v-else key="register-form" @submit="handleRegister" class="auth-fields-stack">
          <!-- Field 1: Full Name -->
          <div class="field-item">
            <label for="reg-fullname" class="field-label">Nama Lengkap</label>
            <div
              class="input-control-shell"
              :class="{ 'shell-focused': isInputFocused === 'reg-fullname', 'shell-filled': regFullName.length > 0 }"
            >
              <div class="shell-lead-icon">
                <User :size="16" />
              </div>
              <input
                id="reg-fullname"
                v-model="regFullName"
                type="text"
                placeholder="Contoh: Rizal Pratama"
                required
                autocomplete="name"
                class="bare-input"
                @focus="isInputFocused = 'reg-fullname'"
                @blur="isInputFocused = null"
              />
            </div>
          </div>

          <!-- Field 2: Email or Username -->
          <div class="field-item">
            <label for="reg-email" class="field-label">Alamat Email / Username</label>
            <div
              class="input-control-shell"
              :class="{ 'shell-focused': isInputFocused === 'reg-email', 'shell-filled': regEmail.length > 0 }"
            >
              <div class="shell-lead-icon">
                <Mail :size="16" />
              </div>
              <input
                id="reg-email"
                v-model="regEmail"
                type="text"
                placeholder="nama@perusahaan.com"
                required
                autocomplete="username"
                class="bare-input"
                @focus="isInputFocused = 'reg-email'"
                @blur="isInputFocused = null"
              />
            </div>
          </div>

          <!-- Field 3: Password -->
          <div class="field-item">
            <label for="reg-password" class="field-label">Kata Sandi (Min. 6 Karakter)</label>
            <div
              class="input-control-shell"
              :class="{ 'shell-focused': isInputFocused === 'reg-password', 'shell-filled': regPassword.length > 0 }"
            >
              <div class="shell-lead-icon">
                <Lock :size="16" />
              </div>
              <input
                id="reg-password"
                v-model="regPassword"
                :type="showRegPassword ? 'text' : 'password'"
                placeholder="••••••••••••"
                required
                autocomplete="new-password"
                class="bare-input"
                @focus="isInputFocused = 'reg-password'"
                @blur="isInputFocused = null"
              />
              <button
                type="button"
                class="btn-eye-toggle"
                @click="showRegPassword = !showRegPassword"
                tabindex="-1"
                aria-label="Toggle password visibility"
              >
                <EyeOff v-if="showRegPassword" :size="16" />
                <Eye v-else :size="16" />
              </button>
            </div>
          </div>

          <!-- Field 4: Confirm Password -->
          <div class="field-item">
            <label for="reg-confirm" class="field-label">Konfirmasi Kata Sandi</label>
            <div
              class="input-control-shell"
              :class="{ 'shell-focused': isInputFocused === 'reg-confirm', 'shell-filled': regConfirmPassword.length > 0 }"
            >
              <div class="shell-lead-icon">
                <Lock :size="16" />
              </div>
              <input
                id="reg-confirm"
                v-model="regConfirmPassword"
                :type="showRegPassword ? 'text' : 'password'"
                placeholder="••••••••••••"
                required
                autocomplete="new-password"
                class="bare-input"
                @focus="isInputFocused = 'reg-confirm'"
                @blur="isInputFocused = null"
              />
            </div>
          </div>

          <!-- Primary Action CTA Button -->
          <button type="submit" class="btn-primary-action btn-register-action" :disabled="isLoading">
            <span v-if="isLoading" class="custom-spinner"></span>
            <span v-if="isLoading">Mendaftarkan Akun...</span>
            <span v-else class="cta-inner">
              <UserPlus :size="16" />
              <span>Daftar & Lanjut Pilih Paket</span>
              <ArrowRight :size="16" class="cta-arrow" />
            </span>
          </button>
        </form>
        </transition>

        <!-- Security Ingress Guarantee Badge -->
        <footer class="panel-security-chip">
          <ShieldCheck :size="14" color="#059669" />
          <span>Koneksi TLS v1.3 • cgroups v2 Terisolasi</span>
        </footer>
      </div>

      <!-- Out-of-card subfooter -->
      <div class="auth-subfooter">
        <transition name="auth-text-swap" mode="out-in">
          <p v-if="authMode === 'login'" key="login-subfooter">
            Belum punya akun tenant? 
            <a href="#" @click.prevent="setAuthMode('register')">Daftar sekarang</a>
          </p>
          <p v-else key="register-subfooter">
            Sudah memiliki akun? 
            <a href="#" @click.prevent="setAuthMode('login')">Masuk ke Studio</a>
          </p>
        </transition>
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
  background-clip: text;
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

/* Tab Pill Switcher with Glider */
.auth-tabs-bar {
  position: relative;
  display: flex;
  background: #f1f5f9;
  padding: 4px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  user-select: none;
}

.tab-glider-track {
  position: absolute;
  top: 4px;
  bottom: 4px;
  left: 4px;
  width: calc(50% - 4px);
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.08), 0 1px 2px rgba(15, 23, 42, 0.04);
  transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: none;
  z-index: 1;
}

.tab-glider-track.glider-register {
  transform: translateX(100%);
}

.tab-pill {
  position: relative;
  z-index: 2;
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 12px;
  font-size: 0.82rem;
  font-weight: 600;
  color: #64748b;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: color 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.tab-pill:hover {
  color: #1e293b;
}

.tab-pill.active {
  color: #0f172a;
  background: transparent;
  box-shadow: none;
}

.pill-spark {
  color: #2563eb;
}

.btn-register-action {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%) !important;
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3) !important;
}

.btn-register-action:hover {
  box-shadow: 0 6px 18px rgba(37, 99, 235, 0.4) !important;
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

/* Form Swap Transitions */
.auth-form-swap-enter-active,
.auth-form-swap-leave-active {
  transition: opacity 0.24s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.24s cubic-bezier(0.16, 1, 0.3, 1);
}

.auth-form-swap-enter-from {
  opacity: 0;
  transform: translateY(10px) scale(0.99);
}

.auth-form-swap-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.99);
}

/* Header & Text Crossfade Animations */
.auth-text-swap-enter-active,
.auth-text-swap-leave-active {
  transition: opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.auth-text-swap-enter-from {
  opacity: 0;
  transform: translateY(4px);
}

.auth-text-swap-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* Micro Cascade Animation for Input Fields */
.auth-fields-stack > .field-item {
  animation: fieldFadeUp 0.32s cubic-bezier(0.16, 1, 0.3, 1) backwards;
}

.auth-fields-stack > .field-item:nth-child(1) { animation-delay: 0.02s; }
.auth-fields-stack > .field-item:nth-child(2) { animation-delay: 0.05s; }
.auth-fields-stack > .field-item:nth-child(3) { animation-delay: 0.08s; }
.auth-fields-stack > .field-item:nth-child(4) { animation-delay: 0.11s; }
.auth-fields-stack > .remember-row { animation: fieldFadeUp 0.32s cubic-bezier(0.16, 1, 0.3, 1) 0.08s backwards; }
.auth-fields-stack > .btn-primary-action { animation: fieldFadeUp 0.32s cubic-bezier(0.16, 1, 0.3, 1) 0.12s backwards; }

@keyframes fieldFadeUp {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
