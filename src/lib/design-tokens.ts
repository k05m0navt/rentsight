/**
 * Design Tokens
 *
 * TypeScript exports of design system tokens for JavaScript/TypeScript access.
 * These tokens are used for dynamic styling, chart colors, and programmatic
 * access to design system values.
 *
 * Based on the Dribbble reference "AI Hiring - SaaS CRM Web App" by Tamim Al Arafat
 */

export const designTokens = {
  colors: {
    // Primary palette - Updated to match AI Hiring SaaS CRM design reference
    primary: '#FF6B35', // Orange accent color from design reference
    success: '#1DCC5C', // Green color for positive metrics
    error: '#DC2626',
    warning: '#F59E0B',
    info: '#3B82F6',

    // Background colors - Updated to match design reference dark theme
    background: {
      light: '#FFFFFF',
      dark: '#1A1A1A', // Main background color from design reference
    },

    // Card/surface colors - Updated to match design reference
    card: {
      light: '#F5F5F5',
      dark: '#2A2A2A', // Card background color from design reference
    },

    // Text colors
    text: {
      light: '#1A1A1A',
      dark: '#EEEEEE',
    },

    // Muted text
    muted: {
      light: '#666666',
      dark: '#AAAAAA',
    },

    // Border colors
    border: {
      light: '#E5E5E5',
      dark: '#333333',
    },

    // Hover states
    hover: {
      light: '#F8F8F8',
      dark: '#252525',
    },

    // Chart/data visualization colors - Updated to match design reference
    chart: [
      '#FF6B35', // Primary - Orange accent from design reference
      '#1DCC5C', // Success - Green from design reference
      '#F59E0B', // Warning
      '#3B82F6', // Info
      '#8B5CF6', // Purple
      '#EC4899', // Pink
    ],
  },

  spacing: {
    // 8-point scale
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 40,
    '3xl': 48,
    '4xl': 64,
  },

  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    full: 9999,
  },

  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 20,
    xl: 24,
    '2xl': 32,
  },

  fontWeight: {
    normal: 400,
    medium: 500,
    bold: 700,
  },

  lineHeight: {
    xs: 16,
    sm: 20,
    base: 24,
    lg: 28,
    xl: 32,
    '2xl': 40,
  },

  transitions: {
    fast: '150ms',
    default: '200ms',
    slow: '300ms',
  },

  breakpoints: {
    sm: 640,
    md: 768, // Key breakpoint: sidebar → bottom nav
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  },
} as const;

export type DesignTokens = typeof designTokens;

/**
 * Helper function to get chart color by index
 * Useful for assigning colors to data series
 */
export function getChartColor(index: number): string {
  return designTokens.colors.chart[index % designTokens.colors.chart.length];
}

/**
 * Helper function to get color based on current theme
 */
export function getThemedColor(
  colorKey: 'background' | 'card' | 'text' | 'muted' | 'border' | 'hover',
  isDark: boolean,
): string {
  return designTokens.colors[colorKey][isDark ? 'dark' : 'light'];
}

/**
 * Export individual token categories for convenience
 */
export const {
  colors,
  spacing,
  borderRadius,
  fontSize,
  fontWeight,
  lineHeight,
  transitions,
  breakpoints,
} = designTokens;
