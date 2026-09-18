import React, { useEffect, useRef, useState } from 'react';

/**
 * BackgroundWave: Clean, subtle ambient dot illumination without any harsh circular borders or rings.
 * Features an ultra-soft, diffused Gaussian slate glow that seamlessly follows the cursor.
 */
export const BackgroundWave: React.FC = () => {
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: -1000, y: -1000 });
  const [isVisible, setIsVisible] = useState<boolean>(false);

  // Smooth lerp interpolation for silky motion
  const animPos = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });
  const targetPos = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });
  const requestRef = useRef<number>();

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    const animate = () => {
      const ease = 0.1;
      animPos.current.x += (targetPos.current.x - animPos.current.x) * ease;
      animPos.current.y += (targetPos.current.y - animPos.current.y) * ease;

      setMousePos({
        x: Math.round(animPos.current.x),
        y: Math.round(animPos.current.y)
      });

      requestRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isVisible]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
        background: '#ffffff'
      }}
      aria-hidden="true"
    >
      {/* 1. Base Subtle Dot Grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(#cbd5e1 1.2px, transparent 1.2px)',
          backgroundSize: '28px 28px',
          backgroundPosition: '-14px -14px',
          opacity: 0.75
        }}
      />

      {/* 2. Seamless Soft Gaussian Slate Ambient Glow (NO borders, NO rings, completely feathered) */}
      <div
        style={{
          position: 'absolute',
          top: mousePos.y - 300,
          left: mousePos.x - 300,
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(148, 163, 184, 0.18) 0%, rgba(203, 213, 225, 0.08) 50%, transparent 70%)',
          filter: 'blur(40px)',
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.4s ease',
          willChange: 'transform, opacity'
        }}
      />

      {/* 3. Smooth Contrast Dots: Feathered cleanly with NO sharp concentric lines */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(#475569 1.5px, transparent 1.5px)',
          backgroundSize: '28px 28px',
          backgroundPosition: '-14px -14px',
          maskImage: `radial-gradient(circle 320px at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 75%)`,
          WebkitMaskImage: `radial-gradient(circle 320px at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 75%)`,
          opacity: isVisible ? 0.9 : 0,
          transition: 'opacity 0.4s ease',
          willChange: 'mask-image, -webkit-mask-image'
        }}
      />
    </div>
  );
};
