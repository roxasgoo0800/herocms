<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Layers, Lock, Mail, ArrowRight, ShieldCheck, Eye, EyeOff, Sparkles, CheckCircle2, AlertCircle } from 'lucide-vue-next';

const router = useRouter();

const email = ref('');
const password = ref('');
const showPassword = ref(false);
const rememberMe = ref(true);
const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

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
    // Set authentication token
    localStorage.setItem('cloudcms_auth_token', 'token_tenant_' + Date.now());
    localStorage.setItem('cloudcms_user_email', email.value);
    successMessage.value = 'Login berhasil! Mengalihkan ke Dashboard Studio...';

    setTimeout(() => {
      router.push('/');
    }, 600);
  }, 900);
};

const useDemoAccount = () => {
  email.value = 'admin@rizalpratama.cloud';
  password.value = 'heroCMS2026!';
  handleLogin();
};
</script>

<template>
  <div class="login-page">
    <div class="login-card-wrapper">
      <!-- Brand Header -->
      <div class="brand-header">
        <div class="logo-box">
          <Layers :size="24" color="#ffffff" />
        </div>
        <h1 class="brand-title">HeroCMS <span>Studio</span></h1>
        <p class="brand-desc">Portal Manajemen Konten & Orkestrasi Kontainer Mandiri</p>
      </div>

      <!-- Main Form Card -->
      <div class="login-card">
        <div class="card-header">
          <h2>Masuk ke Akun Tenant</h2>
          <p>Kelola situs, artikel, dan terbitkan perubahan ke kontainer Docker secara langsung.</p>
        </div>

        <!-- Feedback Alerts -->
        <div v-if="errorMessage" class="alert-box error">
          <AlertCircle :size="17" />
          <span>{{ errorMessage }}</span>
        </div>

        <div v-if="successMessage" class="alert-box success">
          <CheckCircle2 :size="17" />
          <span>{{ successMessage }}</span>
        </div>

        <form @submit="handleLogin" class="login-form">
          <!-- Email / Tenant ID Field -->
          <div class="form-group">
            <label for="email">Alamat Email / Tenant ID</label>
            <div class="input-wrapper">
              <span class="input-icon"><Mail :size="17" /></span>
              <input
                id="email"
                v-model="email"
                type="email"
                placeholder="nama@institusi.com"
                required
                autocomplete="email"
              />
            </div>
          </div>

          <!-- Password Field -->
          <div class="form-group">
            <div class="label-row">
              <label for="password">Kata Sandi</label>
              <a href="#" class="forgot-link" @click.prevent="errorMessage = 'Fitur reset password dapat diakses via SuperAdmin internal.'">
                Lupa sandi?
              </a>
            </div>
            <div class="input-wrapper">
              <span class="input-icon"><Lock :size="17" /></span>
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••••••"
                required
                autocomplete="current-password"
              />
              <button
                type="button"
                class="btn-toggle-eye"
                @click="showPassword = !showPassword"
                tabindex="-1"
                aria-label="Toggle password visibility"
              >
                <EyeOff v-if="showPassword" :size="17" />
                <Eye v-else :size="17" />
              </button>
            </div>
          </div>

          <!-- Remember Me Checkbox -->
          <div class="checkbox-row">
            <label class="custom-checkbox">
              <input type="checkbox" v-model="rememberMe" />
              <span class="checkmark"></span>
              <span class="checkbox-label">Ingat sesi saya selama 30 hari</span>
            </label>
          </div>

          <!-- Submit Button -->
          <button type="submit" class="btn-submit" :disabled="isLoading">
            <span v-if="isLoading" class="spinner"></span>
            <span v-if="isLoading">Memverifikasi Kredensial...</span>
            <span v-else class="btn-text">
              Masuk ke Studio <ArrowRight :size="17" />
            </span>
          </button>
        </form>

        <!-- Divider -->
        <div class="divider">
          <span>atau gunakan akses cepat</span>
        </div>

        <!-- 1-Click Demo Login -->
        <button type="button" class="btn-demo" @click="useDemoAccount" :disabled="isLoading">
          <Sparkles :size="16" color="#2563eb" />
          <span>Login Otomatis dengan Akun Demo</span>
        </button>

        <!-- Security Badge Footer -->
        <div class="card-footer-security">
          <ShieldCheck :size="15" color="#059669" />
          <span>Koneksi Terenkripsi TLS v1.3 & Alokasi Resource Terisolasi</span>
        </div>
      </div>

      <!-- Footer Help Note -->
      <div class="login-subfooter">
        <p>Butuh bantuan login? Hubungi administrator tenant atau <a href="http://localhost:3000" target="_blank">kembali ke halaman pemasaran</a>.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: transparent;
  padding: 40px 20px;
}

.login-card-wrapper {
  width: 100%;
  max-width: 460px;
  position: relative;
  z-index: 2;
}

.brand-header {
  text-align: center;
  margin-bottom: 28px;
}

.logo-box {
  width: 48px;
  height: 48px;
  background: #0f172a;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.15);
}

.brand-title {
  font-size: 1.6rem;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.02em;
  margin-bottom: 6px;
}

.brand-title span {
  color: #2563eb;
}

.brand-desc {
  font-size: 0.88rem;
  color: #64748b;
  line-height: 1.4;
}

.login-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  padding: 36px 32px;
  box-shadow: 0 10px 30px -8px rgba(15, 23, 42, 0.07), 0 4px 6px -2px rgba(15, 23, 42, 0.02);
}

.card-header {
  margin-bottom: 24px;
}

.card-header h2 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 6px;
}

.card-header p {
  font-size: 0.86rem;
  color: #64748b;
  line-height: 1.5;
}

.alert-box {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 8px;
  font-size: 0.84rem;
  margin-bottom: 20px;
}

.alert-box.error {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #991b1b;
}

.alert-box.success {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #166534;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.form-group label {
  font-size: 0.84rem;
  font-weight: 600;
  color: #1e293b;
}

.label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.forgot-link {
  font-size: 0.8rem;
  color: #2563eb;
  text-decoration: none;
  font-weight: 500;
}

.forgot-link:hover {
  text-decoration: underline;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 14px;
  color: #94a3b8;
  display: flex;
  align-items: center;
  pointer-events: none;
}

.input-wrapper input {
  width: 100%;
  padding: 11px 14px 11px 42px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.92rem;
  color: #0f172a;
  background: #ffffff;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.input-wrapper input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.14);
}

.btn-toggle-eye {
  position: absolute;
  right: 12px;
  background: transparent;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
}

.btn-toggle-eye:hover {
  color: #475569;
}

.checkbox-row {
  display: flex;
  align-items: center;
}

.custom-checkbox {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 0.84rem;
  color: #475569;
  user-select: none;
}

.custom-checkbox input {
  accent-color: #2563eb;
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.btn-submit {
  width: 100%;
  padding: 12px 18px;
  background: #0f172a;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 6px;
  transition: background 0.15s ease, transform 0.1s ease;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.12);
}

.btn-submit:hover:not(:disabled) {
  background: #1e293b;
  transform: translateY(-1px);
}

.btn-submit:active:not(:disabled) {
  transform: translateY(0);
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-text {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 22px 0 16px;
  color: #94a3b8;
  font-size: 0.78rem;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #e2e8f0;
}

.divider span {
  padding: 0 10px;
}

.btn-demo {
  width: 100%;
  padding: 10px 14px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  color: #1d4ed8;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background 0.15s ease, border-color 0.15s ease;
}

.btn-demo:hover {
  background: #dbeafe;
  border-color: #93c5fd;
}

.card-footer-security {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 0.76rem;
  color: #64748b;
  text-align: center;
}

.login-subfooter {
  text-align: center;
  margin-top: 24px;
  font-size: 0.82rem;
  color: #64748b;
}

.login-subfooter a {
  color: #2563eb;
  text-decoration: none;
  font-weight: 500;
}

.login-subfooter a:hover {
  text-decoration: underline;
}
</style>
