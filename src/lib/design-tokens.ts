/**
 * Design Tokens
 *
 * Centralized design system tokens for elevation, colors, and spacing
 */

/**
 * Elevation System (3 levels)
 * Based on Material Design principles
 */
export const elevation = {
  flat: {
    shadow: 'shadow-none',
    border: 'border border-border dark:border-border-dark',
    background: 'bg-surface dark:bg-surface-dark',
  },
  raised: {
    light: 'shadow-sm', // Subtle shadow for light mode
    dark: 'dark:shadow-md dark:shadow-black/20',
    hover: 'hover:shadow-md transition-shadow duration-200',
    combined:
      'shadow-sm dark:shadow-md dark:shadow-black/20 hover:shadow-md transition-shadow duration-200',
  },
  overlay: {
    light: 'shadow-lg',
    dark: 'dark:shadow-2xl dark:shadow-black/40',
    combined: 'shadow-lg dark:shadow-2xl dark:shadow-black/40',
  },
} as const;

/**
 * Semantic Color System
 *
 * Colors are defined semantically for consistent usage across the app
 */
export const colors = {
  // Primary brand color (orange)
  primary: {
    DEFAULT: 'text-primary',
    bg: 'bg-primary',
    bgHover: 'hover:bg-primary/90',
    border: 'border-primary',
    text: 'text-primary',
  },

  // Success state (green)
  success: {
    DEFAULT: 'text-success',
    bg: 'bg-success',
    bgHover: 'hover:bg-success/90',
    border: 'border-success',
    text: 'text-success',
    light: 'bg-success/10 dark:bg-success/20',
  },

  // Warning state (yellow/amber)
  warning: {
    DEFAULT: 'text-warning',
    bg: 'bg-warning',
    bgHover: 'hover:bg-warning/90',
    border: 'border-warning',
    text: 'text-warning',
    light: 'bg-warning/10 dark:bg-warning/20',
  },

  // Error/destructive state (red)
  error: {
    DEFAULT: 'text-error',
    bg: 'bg-error',
    bgHover: 'hover:bg-error/90',
    border: 'border-error',
    text: 'text-error',
    light: 'bg-error/10 dark:bg-error/20',
  },

  // Muted/secondary content
  muted: {
    DEFAULT: 'text-muted dark:text-muted-dark',
    bg: 'bg-muted dark:bg-muted-dark',
    border: 'border-muted dark:border-muted-dark',
  },
} as const;

/**
 * Spacing Scale (8-point grid system)
 */
export const spacing = {
  xs: 'gap-2', // 8px
  sm: 'gap-4', // 16px
  md: 'gap-6', // 24px
  lg: 'gap-8', // 32px
  xl: 'gap-12', // 48px
} as const;

/**
 * Border Radius Scale
 */
export const borderRadius = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
} as const;

/**
 * Typography Scale
 */
export const typography = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
} as const;

/**
 * Transition Durations
 */
export const transitions = {
  fast: 'duration-150',
  normal: 'duration-200',
  slow: 'duration-300',
} as const;

/**
 * Helper function to combine elevation classes
 */
export function getElevation(level: keyof typeof elevation, state?: 'hover' | 'focus'): string {
  if (level === 'flat') {
    const flat = elevation.flat;
    return `${flat.shadow} ${flat.border} ${flat.background}`;
  }

  if (level === 'raised') {
    const raised = elevation.raised;
    return state === 'hover'
      ? `${raised.light} ${raised.dark} ${raised.hover}`
      : `${raised.light} ${raised.dark}`;
  }

  if (level === 'overlay') {
    const overlay = elevation.overlay;
    return `${overlay.light} ${overlay.dark}`;
  }

  return '';
}

/**
 * Helper function to get semantic color classes
 */
export function getColor(
  semantic: keyof typeof colors,
  variant: 'bg' | 'text' | 'border' | 'light' = 'text',
): string {
  const color = colors[semantic];

  if (typeof color === 'string') {
    return color;
  }

  // Type-safe access
  if (variant in color) {
    return color[variant as keyof typeof color] as string;
  }

  return color.DEFAULT;
}
