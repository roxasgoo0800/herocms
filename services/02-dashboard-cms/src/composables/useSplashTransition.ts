import { ref } from 'vue';

const isSplashActive = ref(false);
const splashDuration = ref(1100);

export function useSplashTransition() {
  const triggerSplash = (duration = 1100) => {
    splashDuration.value = duration;
    isSplashActive.value = true;
  };

  const completeSplash = () => {
    isSplashActive.value = false;
    sessionStorage.setItem('herocms_splash_seen', 'true');
  };

  return {
    isSplashActive,
    splashDuration,
    triggerSplash,
    completeSplash
  };
}
