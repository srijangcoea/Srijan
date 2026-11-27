import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollProgress
 * GPU-composited, zero-re-render cyber scroll progress indicator.
 * Uses requestAnimationFrame + passive scroll listener + scaleX transform
 * to stay locked at 60 FPS with zero layout thrashing.
 */
export default function ScrollProgress() {
  const barRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    let ticking = false;

    const updateProgress = () => {
      const el = barRef.current;
      if (!el) {
        ticking = false;
        return;
      }

      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = docHeight > 0 ? Math.min(Math.max(scrollTop / docHeight, 0), 1) : 0;

      el.style.transform = `scaleX(${progress})`;
      el.style.opacity = progress > 0.002 ? '1' : '0';
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateProgress);
        ticking = true;
      }
    };

    // Initial calculation (and after route change)
    updateProgress();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [location.pathname]);

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[60] h-[3px] pointer-events-none bg-transparent"
    >
      <div
        ref={barRef}
        className="h-full w-full origin-left will-change-transform transition-opacity duration-200"
        style={{
          transform: 'scaleX(0)',
          opacity: 0,
          background: 'linear-gradient(90deg, #00daf3 0%, #22e5ff 65%, #ffd799 100%)',
          boxShadow: '0 0 12px rgba(34, 229, 255, 0.8), 0 0 4px rgba(255, 215, 153, 0.45)',
        }}
      />
    </div>
  );
}
