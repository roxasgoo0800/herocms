import { useState, useEffect, useRef } from 'react';

export type ScrollDirection = 'down' | 'up';

export interface ScrollState {
  direction: ScrollDirection;
  velocity: number;
  scrollY: number;
}

/**
 * useScrollDirection: Tracks whether the user is scrolling down or up,
 * along with scroll velocity for directional animations.
 */
export const useScrollDirection = (): ScrollState => {
  const [scrollState, setScrollState] = useState<ScrollState>({
    direction: 'down',
    velocity: 0,
    scrollY: 0
  });

  const lastScrollY = useRef(0);
  const lastTime = useRef(Date.now());
  const ticking = useRef(false);

  useEffect(() => {
    lastScrollY.current = window.scrollY;
    lastTime.current = Date.now();

    const onScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY;
          const now = Date.now();
          const dt = Math.max(1, now - lastTime.current);
          const dy = currentY - lastScrollY.current;
          const vel = dy / dt;

          if (Math.abs(dy) > 3) {
            const nextDirection: ScrollDirection = dy > 0 ? 'down' : 'up';
            setScrollState({
              direction: nextDirection,
              velocity: vel,
              scrollY: currentY
            });
          }

          lastScrollY.current = currentY;
          lastTime.current = now;
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return scrollState;
};
