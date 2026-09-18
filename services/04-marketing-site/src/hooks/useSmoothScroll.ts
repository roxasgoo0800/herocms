import { useEffect } from 'react';

/**
 * useSmoothScroll: High-fidelity, Lenis-grade buttery smooth scroll engine.
 * Delivers effortless, fluid inertia without rigid notch stepping or floating dizziness.
 */
export const useSmoothScroll = () => {
  useEffect(() => {
    // Only apply on devices with mouse wheel (skip touch devices)
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    let current = window.scrollY;
    let target = window.scrollY;
    let isRunning = false;
    // 0.095 is the sweet spot used by modern high-end creative sites:
    // extremely soft, cushioned deceleration that feels luxurious and responsive
    const ease = 0.095;

    const updateScroll = () => {
      const diff = target - current;
      const delta = diff * ease;

      current += delta;
      window.scrollTo(0, current);

      // Continue animating until distance is virtually zero for silk finish
      if (Math.abs(diff) > 0.1) {
        requestAnimationFrame(updateScroll);
      } else {
        current = target;
        window.scrollTo(0, current);
        isRunning = false;
      }
    };

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) return;

      e.preventDefault();

      // Normalize wheel delta across varying mice, trackpads & OS acceleration curves
      const rawDelta = e.deltaY;
      const magnitude = Math.min(Math.abs(rawDelta), 130);
      const step = Math.sign(rawDelta) * magnitude * 1.35;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

      target = Math.max(0, Math.min(target + step, maxScroll));

      if (!isRunning) {
        isRunning = true;
        current = window.scrollY;
        requestAnimationFrame(updateScroll);
      }
    };

    const onScroll = () => {
      if (!isRunning) {
        current = window.scrollY;
        target = window.scrollY;
      }
    };

    // Smooth anchor navigation
    const onAnchorClick = (e: MouseEvent) => {
      const targetEl = (e.target as HTMLElement).closest('a[href^="#"]');
      if (targetEl) {
        const href = targetEl.getAttribute('href');
        if (href && href.startsWith('#') && href.length > 1) {
          const targetSection = document.querySelector(href);
          if (targetSection) {
            e.preventDefault();
            const topPos = (targetSection as HTMLElement).getBoundingClientRect().top + window.scrollY - 80;
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            target = Math.max(0, Math.min(topPos, maxScroll));
            if (!isRunning) {
              isRunning = true;
              current = window.scrollY;
              requestAnimationFrame(updateScroll);
            }
          }
        }
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('click', onAnchorClick);

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('click', onAnchorClick);
    };
  }, []);
};
