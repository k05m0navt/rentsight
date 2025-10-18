/**
 * Animation Utilities
 *
 * Reusable Framer Motion animation variants and configurations
 */

import type { Variants, Transition } from 'framer-motion';

/**
 * Standard transition configurations
 */
export const transitions = {
  fast: { duration: 0.15, ease: 'easeOut' } as Transition,
  normal: { duration: 0.2, ease: 'easeOut' } as Transition,
  slow: { duration: 0.3, ease: 'easeOut' } as Transition,
  spring: { type: 'spring', stiffness: 300, damping: 30 } as Transition,
};

/**
 * Fade In Animation Variant
 */
export const fadeInVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: transitions.normal,
  },
  exit: {
    opacity: 0,
    transition: transitions.fast,
  },
};

/**
 * Scale In Animation Variant (for modals/dialogs)
 */
export const scaleInVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transitions.normal,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: transitions.fast,
  },
};

/**
 * Slide In Animation Variants
 */
export const slideInVariants = {
  up: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: transitions.normal },
    exit: { opacity: 0, y: -20, transition: transitions.fast },
  },
  down: {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: transitions.normal },
    exit: { opacity: 0, y: 20, transition: transitions.fast },
  },
  left: {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: transitions.normal },
    exit: { opacity: 0, x: -20, transition: transitions.fast },
  },
  right: {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: transitions.normal },
    exit: { opacity: 0, x: 20, transition: transitions.fast },
  },
} as const;

/**
 * Stagger Children Configuration
 */
export const staggerChildrenVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05, // 50ms delay between each child
      delayChildren: 0.1, // Wait 100ms before starting
    },
  },
};

/**
 * Stagger Child Item Variant
 */
export const staggerItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.normal,
  },
};

/**
 * Hover Scale Animation
 */
export const hoverScaleVariants: Variants = {
  rest: {
    scale: 1,
  },
  hover: {
    scale: 1.02,
    transition: transitions.fast,
  },
  tap: {
    scale: 0.98,
    transition: transitions.fast,
  },
};

/**
 * Page Transition Variants
 */
export const pageTransitionVariants: Variants = {
  initial: {
    opacity: 0,
    y: 8,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: transitions.slow,
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: transitions.fast,
  },
};

/**
 * Motion Configuration for respecting prefers-reduced-motion
 */
export const motionConfig = {
  reducedMotion: 'user' as const, // Automatically respects user preference
};

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get transition duration based on reduced motion preference
 */
export function getTransition(type: keyof typeof transitions = 'normal'): Transition {
  if (prefersReducedMotion()) {
    return { duration: 0 }; // Instant transitions for reduced motion
  }
  return transitions[type];
}
