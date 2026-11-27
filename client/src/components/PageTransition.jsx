import React from 'react';
import { motion } from 'framer-motion';

/**
 * PageTransition
 * Wraps any page with a smooth fade-up entrance animation using Framer Motion.
 * Matches the animation style already used in AboutSection.
 * - opacity: 0 → 1
 * - y: 18px → 0
 * - duration: 0.55s, ease: [0.22, 1, 0.36, 1] (expo ease-out)
 * - Respects prefers-reduced-motion via Framer Motion's built-in support
 */
export default function PageTransition({ children, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
