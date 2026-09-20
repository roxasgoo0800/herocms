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

  // Triggered in unison as splash screen begins dissolving out
  const revealDashboard = () => {
    isDashboardEntering.value = true;
  };

  // Triggered when splash screen has fully faded out
  const completeSplash = () => {
    isSplashActive.value = false;
    sessionStorage.setItem('herocms_splash_seen', 'true');

    setTimeout(() => {
      isDashboardEntering.value = false;
    }, 600);
  };

  return {
    isSplashActive,
    splashDuration,
    isDashboardEntering,
    triggerSplash,
    revealDashboard,
    completeSplash
  };
}
