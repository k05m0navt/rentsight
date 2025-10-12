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
        // Semantic color tokens - Updated to match AI Hiring SaaS CRM design reference
        background: {
          DEFAULT: '#FFFFFF', // Light mode
          dark: '#1A1A1A',    // Dark mode - Main background color from design reference
        },
        card: {
          DEFAULT: '#F5F5F5',
          dark: '#2A2A2A',    // Card background color from design reference
        },
        primary: {
          DEFAULT: '#FF6B35',        // Orange accent color from design reference
          foreground: '#FFFFFF',
        },
        success: {
          DEFAULT: '#1DCC5C',        // Success/positive accent
          foreground: '#FFFFFF',
        },
        text: {
          DEFAULT: '#1A1A1A',        // Light mode
          dark: '#EEEEEE',           // Dark mode #EEEEEE
        },
        muted: {
          DEFAULT: '#666666',
          dark: '#AAAAAA',
        },
        border: {
          DEFAULT: '#E5E5E5',
          dark: '#333333',
        },
        hover: {
          DEFAULT: '#F8F8F8',
          dark: '#252525',
        },
        focus: {
          DEFAULT: 'rgba(255, 107, 53, 0.2)',   // Orange primary with 20% opacity
          dark: 'rgba(255, 107, 53, 0.4)',      // Orange primary with 40% opacity for dark bg
        },
        // Semantic states
        error: '#DC2626',
        warning: '#F59E0B',
        info: '#3B82F6',
        disabled: {
          DEFAULT: '#D1D5DB',
          dark: '#4B5563',
        },
      },
      spacing: {
        // 8-point spacing scale
        0: '0',
        1: '4px',   // 0.5 * 8
        2: '8px',   // 1 * 8
        3: '16px',  // 2 * 8
        4: '24px',  // 3 * 8
        5: '32px',  // 4 * 8
        6: '40px',  // 5 * 8
        7: '48px',  // 6 * 8
        8: '64px',  // 8 * 8
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
        md: '768px',   // Key breakpoint: sidebar → bottom nav
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [],
}

