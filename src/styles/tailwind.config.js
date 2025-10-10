/** Tailwind configuration for Rentsight feature
 *  Minimal config to support theming and dark mode via `class` strategy.
 */
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // semantic tokens are driven by CSS variables in tokens.css
      colors: {
        background: 'var(--color-bg)',
        foreground: 'var(--color-text-primary)',
        card: 'var(--color-surface)',
        'card-foreground': 'var(--color-text-primary)',
        popover: 'var(--color-bg)',
        'popover-foreground': 'var(--color-text-primary)',
        primary: 'var(--color-primary)',
        'primary-foreground': 'var(--color-bg)', // Assuming foreground for primary is light/dark background
        secondary: 'var(--color-surface)',
        'secondary-foreground': 'var(--color-text-primary)',
        muted: 'var(--color-surface)',
        'muted-foreground': 'var(--color-text-secondary)',
        accent: 'var(--color-surface)',
        'accent-foreground': 'var(--color-text-primary)',
        destructive: '#ef4444', // red-500, direct color for destructive
        'destructive-foreground': '#ffffff', // white, direct color for destructive foreground
        destructiveBackground: 'rgba(239, 68, 68, 0.1)', // transparent red-500
        border: 'var(--color-surface)',
        input: 'var(--color-surface)',
        ring: 'var(--color-primary)',
      },
      fontSize: {
        xs: 'var(--font-size-xs)',
        sm: 'var(--font-size-sm)',
        base: 'var(--font-size-base)',
        lg: 'var(--font-size-lg)',
        xl: 'var(--font-size-xl)',
        '2xl': 'var(--font-size-2xl)',
        '3xl': 'var(--font-size-3xl)',
      },
      lineHeight: {
        tight: 'var(--line-height-tight)',
        normal: 'var(--line-height-normal)',
        relaxed: 'var(--line-height-relaxed)',
      },
      spacing: {
        xs: 'var(--spacing-xs)',
        sm: 'var(--spacing-sm)',
        md: 'var(--spacing-md)',
        lg: 'var(--spacing-lg)',
        xl: 'var(--spacing-xl)',
      },
    },
  },
  plugins: [],
};


