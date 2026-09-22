import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './assets/studio-master.css';
import './assets/visual-editor.css';
import './assets/studio-animations.css';

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount('#app');

// Auto-cleanup stale Service Workers & CacheStorage so CSS/JS updates load instantly without hard reload
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister().catch(() => {});
    }
  }).catch(() => {});

  if ('caches' in window) {
    caches.keys().then((keys) => {
      for (const key of keys) {
        caches.delete(key).catch(() => {});
      }
    }).catch(() => {});
  }
}

