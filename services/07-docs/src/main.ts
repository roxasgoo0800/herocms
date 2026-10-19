import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import './assets/studio-master.css';
import './assets/studio-animations.css';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.mount('#app');
