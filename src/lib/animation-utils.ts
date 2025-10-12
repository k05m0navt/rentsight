/**
 * Animation Utilities
 *
 * GPU-accelerated animation helpers for optimal performance.
 * Per the redesign specification (FR-013), all animations use full motion
 * without reduced motion preference detection.
 *
 * IMPORTANT: Only use GPU-accelerated properties (opacity, transform) for
 * 60fps performance. Avoid animating layout properties (width, height, etc.)
 */

/**
 * Performant transition classes
 * Only animates GPU-accelerated properties
 */
export const performantTransition = {
  // Only opacity
  opacity: 'transition-opacity duration-200 ease-in-out',

  // Only transform
  transform: 'transition-transform duration-200 ease-in-out',

  // Both opacity and transform
  both: 'transition-[opacity,transform] duration-200 ease-in-out',

  // Fast transitions (150ms)
  fast: 'transition-[opacity,transform] duration-fast ease-in-out',

  // Slow transitions (300ms)
  slow: 'transition-[opacity,transform] duration-slow ease-in-out',
} as const;

/**
 * Common animation presets using GPU-accelerated properties
 */
export const animations = {
  // Fade in/out
  fadeIn: 'animate-in fade-in duration-200',
  fadeOut: 'animate-out fade-out duration-200',

  // Slide animations
  slideInFromRight: 'animate-in slide-in-from-right duration-200',
  slideInFromLeft: 'animate-in slide-in-from-left duration-200',
  slideInFromTop: 'animate-in slide-in-from-top duration-200',
  slideInFromBottom: 'animate-in slide-in-from-bottom duration-200',

  // Scale animations
  scaleIn: 'animate-in zoom-in duration-200',
  scaleOut: 'animate-out zoom-out duration-200',
} as const;

/**
 * Hover scale effect (subtle)
 * Optimized for buttons and interactive elements
 */
export const hoverScale =
  'transition-transform duration-fast hover:scale-[1.02] active:scale-[0.98]';

/**
 * Smooth fade transition for theme changes
 */
export const themeTransition = 'transition-[background-color,color] duration-200 ease-in-out';

/**
 * Loading spinner animation (CSS-based for performance)
 * More efficient than JS-based animations
 */
export const spinAnimation = 'animate-spin';

/**
 * Pulse animation for loading states
 */
export const pulseAnimation = 'animate-pulse';

/**
 * Helper to apply will-change for performance hints
 * Use sparingly - only for elements that will definitely animate
 *
 * @param properties - CSS properties that will change
 */
export function withWillChange(properties: string[]): string {
  return `will-change-[${properties.join(',')}]`;
}

/**
 * Check if animations should be disabled (e.g., for IE11)
 * Returns true if animations should be instant
 */
export function shouldDisableAnimations(): boolean {
  if (typeof window === 'undefined') return false;

  // Detect IE11
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isIE11 = !!(window as any).MSInputMethodContext && !!(document as any).documentMode;

  return isIE11;
}

/**
 * Get animation duration based on browser capabilities
 * Returns 0ms for IE11, normal duration otherwise
 */
export function getAnimationDuration(duration: 'fast' | 'default' | 'slow' = 'default'): string {
  if (shouldDisableAnimations()) {
    return '0ms';
  }

  const durations = {
    fast: '150ms',
    default: '200ms',
    slow: '300ms',
  };

  return durations[duration];
}

/**
 * Animation timing function (cubic-bezier)
 */
export const easing = {
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  linear: 'linear',
} as const;

/**
 * All animation utilities grouped for convenience
 */
export const animationUtils = {
  performantTransition,
  animations,
  hoverScale,
  themeTransition,
  spinAnimation,
  pulseAnimation,
  withWillChange,
  shouldDisableAnimations,
  getAnimationDuration,
  easing,
};
