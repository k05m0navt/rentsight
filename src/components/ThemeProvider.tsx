'use client';

/**
 * Theme Provider using next-themes
 *
 * Provides dark/light theme management with localStorage persistence.
 * Dark theme is the default per the redesign specification.
 *
 * Based on the redesign spec:
 * - FR-016: Dark theme as primary theme
 * - Dark mode is default, light mode is optional
 * - Client-side storage only (localStorage)
 * - No system preference detection (enableSystem: false)
 */

import {
  ThemeProvider as NextThemesProvider,
  useTheme as useNextTheme,
  type ThemeProviderProps,
} from 'next-themes';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      storageKey="rentsight-theme"
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}

/**
 * Re-export useTheme hook from next-themes for convenience
 * Usage: const { theme, setTheme } = useTheme()
 */
export const useTheme = useNextTheme;

export default ThemeProvider;
