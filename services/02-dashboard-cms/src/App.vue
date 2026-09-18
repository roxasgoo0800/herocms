<script setup lang="ts">
import { RouterView } from 'vue-router';
import BackgroundWave from './components/BackgroundWave.vue';
</script>

<template>
  <div id="dashboard-app-root">
    <!-- Unified Interactive Background Wave from Marketing Site -->
    <BackgroundWave />
    <div style="position: relative; z-index: 1; min-height: 100vh; display: flex; flex-direction: column;">
      <RouterView />
    </div>
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
</style>
