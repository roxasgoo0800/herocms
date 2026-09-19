import { ref } from 'vue';

const isSplashActive = ref(false);
const splashDuration = ref(1300);
const isDashboardEntering = ref(false);

export function useSplashTransition() {
  const triggerSplash = (duration = 1300) => {
    splashDuration.value = duration;
    isSplashActive.value = true;
    isDashboardEntering.value = false;
  };

  const completeSplash = () => {
    isSplashActive.value = false;
    isDashboardEntering.value = true;
    sessionStorage.setItem('herocms_splash_seen', 'true');

    // Keep choreographed entrance active during transition, then reset
    setTimeout(() => {
      isDashboardEntering.value = false;
    }, 800);
  };

  return {
    isSplashActive,
    splashDuration,
    isDashboardEntering,
    triggerSplash,
    completeSplash
  };
}
