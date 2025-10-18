'use client';

/**
 * Theme Provider - Dark Theme Only
 *
 * Provides dark theme only with no theme switching capability.
 * Dark theme is the only theme per the redesign specification.
 *
 * Based on the redesign spec:
 * - FR-016: Dark theme as primary and only theme
 * - No theme switching functionality
 * - Simplified theme management
 */

import React from 'react';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  // Simply apply dark class to body and return children
  React.useEffect(() => {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
  }, []);

  return <>{children}</>;
}

// Mock useTheme hook for compatibility (always returns dark theme)
export const useTheme = () => ({
  theme: 'dark',
  setTheme: () => {}, // No-op since we don't support theme switching
  systemTheme: 'dark',
  resolvedTheme: 'dark',
});

export default ThemeProvider;
