<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';
import BackgroundWave from './components/BackgroundWave.vue';
import StudioSplashScreen from './components/StudioSplashScreen.vue';
import { useSplashTransition } from './composables/useSplashTransition';

const { isSplashActive, splashDuration, revealDashboard, completeSplash, triggerSplash } = useSplashTransition();

onMounted(() => {
  // Cold start splash on direct dashboard visit if authenticated
  const isDirectDashboardVisit = window.location.pathname === '/' || window.location.pathname === '';
  const hasSeenSplash = sessionStorage.getItem('herocms_splash_seen') === 'true';
  const hasToken = localStorage.getItem('cloudcms_auth_token');

  if (isDirectDashboardVisit && hasToken && !hasSeenSplash) {
    triggerSplash(1000);
  }
});
</script>

<template>
  <div id="dashboard-app-root">
    <!-- Unified Interactive Background Wave from Marketing Site -->
    <BackgroundWave />
    <div style="position: relative; z-index: 1; min-height: 100vh; display: flex; flex-direction: column;">
      <RouterView />
    </div>

    <!-- Centralized Studio Gateway Splash Screen -->
    <StudioSplashScreen
      v-if="isSplashActive"
      :duration-ms="splashDuration"
      @revealing="revealDashboard"
      @complete="completeSplash"
    />
  </div>
</template>

<style>
/* Global CSS for CloudCMS Studio Dashboard */
:root {
  --bg-app: #f8fafc;
  --bg-card: #ffffff;
  --border-subtle: #e2e8f0;
  --border-focus: #2563eb;
  --text-main: #0f172a;
  --text-muted: #64748b;
  --brand-blue: #2563eb;
  --brand-blue-hover: #1d4ed8;
  --brand-emerald: #10b981;
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  height: 100%;
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: var(--bg-app);
  color: var(--text-main);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#dashboard-app-root {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

button, input {
  font-family: inherit;
}

/* Seamless Route Transitions */
.app-route-fade-enter-active,
.app-route-fade-leave-active {
  transition: opacity 0.32s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.32s cubic-bezier(0.16, 1, 0.3, 1),
              filter 0.32s cubic-bezier(0.16, 1, 0.3, 1);
}

.app-route-fade-enter-from {
  opacity: 0;
  transform: scale(0.995);
  filter: blur(3px);
}

.app-route-fade-leave-to {
  opacity: 0;
  transform: scale(1.005);
  filter: blur(3px);
}
</style>
