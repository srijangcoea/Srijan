import React, { useEffect, useRef, useState } from 'react';

/**
 * Reveal Component
 * Ultra-lightweight, GPU-friendly scroll-triggered animation using IntersectionObserver.
 * - Triggers once per element (unobserves on entry).
 * - Animates opacity (0 -> 1) and translateY (30px -> 0) over 0.5s ease-out.
 * - Dynamically attaches `will-change: transform, opacity` during transition, removes it after.
 * - Staggers by index with max delay of 500ms.
 * - Completely respects prefers-reduced-motion.
 */
export default function Reveal({
  children,
  delay = 0,
  duration = 0.5,
  className = '',
  as: Component = 'div',
  style: userStyle = {},
  ...rest
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    // Respect prefers-reduced-motion
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true);
      return;
    }

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setIsAnimating(true);
          observer.unobserve(element);
        }
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleTransitionEnd = (e) => {
    if (e.target === ref.current) {
      setIsAnimating(false);
    }
  };

  const safeDelay = Math.min(Math.max(delay, 0), 500);

  const animationStyle = isVisible
    ? {
        opacity: 1,
        transform: 'translateY(0px)',
        transition: `opacity ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${safeDelay}ms, transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${safeDelay}ms`,
        willChange: isAnimating ? 'opacity, transform' : 'auto',
      }
    : {
        opacity: 0,
        transform: 'translateY(30px)',
        willChange: 'opacity, transform',
      };

  return (
    <Component
      ref={ref}
      style={{ ...userStyle, ...animationStyle }}
      onTransitionEnd={handleTransitionEnd}
      className={className}
      {...rest}
    >
      {children}
    </Component>
  );
}
