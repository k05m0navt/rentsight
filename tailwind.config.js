/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Dark theme only - Semantic color tokens
        background: '#0A0A0A',
        surface: '#1A1A1A',
        card: '#1F1F1F',
        primary: {
          DEFAULT: '#EA580C', // Orange
          hover: '#C2410C',
          foreground: '#FFFFFF',
        },
        success: {
          DEFAULT: '#16A34A', // Green
          hover: '#15803D',
          foreground: '#FFFFFF',
        },
        text: {
          DEFAULT: '#F5F5F5', // Dark mode text
          secondary: '#D4D4D4',
        },
        muted: {
          DEFAULT: '#A3A3A3',
          foreground: '#737373',
        },
        border: {
          DEFAULT: '#262626',
          strong: '#404040',
        },
        hover: '#171717',
        focus: 'rgba(234, 88, 12, 0.3)', // Orange primary with 30% opacity for dark bg
        // Semantic states
        error: '#DC2626',
        'error-hover': '#B91C1C',
        warning: '#D97706',
        'warning-hover': '#B45309',
        info: '#2563EB',
        disabled: '#525252',
      },
      spacing: {
        // 8-point spacing scale
        0: '0',
        1: '4px', // 0.5 * 8
        2: '8px', // 1 * 8
        3: '16px', // 2 * 8
        4: '24px', // 3 * 8
        5: '32px', // 4 * 8
        6: '40px', // 5 * 8
        7: '48px', // 6 * 8
        8: '64px', // 8 * 8
      },
      fontSize: {
        xs: ['12px', { lineHeight: '16px' }],
        sm: ['14px', { lineHeight: '20px' }],
        base: ['16px', { lineHeight: '24px' }],
        lg: ['20px', { lineHeight: '28px' }],
        xl: ['24px', { lineHeight: '32px' }],
        '2xl': ['32px', { lineHeight: '40px' }],
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        bold: '700',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['Roboto Mono', 'Courier New', 'monospace'],
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '8px',
        md: '8px',
        lg: '12px',
        full: '9999px',
      },
      boxShadow: {
        // Light theme shadows
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        // Dark theme shadows (more prominent)
        'dark-sm': '0 1px 2px 0 rgb(0 0 0 / 0.3)',
        'dark-md': '0 4px 6px -1px rgb(0 0 0 / 0.5), 0 2px 4px -2px rgb(0 0 0 / 0.5)',
        'dark-lg': '0 10px 15px -3px rgb(0 0 0 / 0.7), 0 4px 6px -4px rgb(0 0 0 / 0.7)',
      },
      transitionDuration: {
        fast: '150ms',
        DEFAULT: '200ms',
        slow: '300ms',
      },
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)', // ease-in-out
      },
      // Responsive breakpoints
      screens: {
        sm: '640px',
        md: '768px', // Key breakpoint: sidebar → bottom nav
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [],
};
