'use client';

import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render placeholder during SSR to avoid hydration mismatch
    return (
      <button
        aria-label="Toggle theme"
        className="px-3 py-2 rounded-md transition-gpu transition-default hover:bg-hover dark:hover:bg-hover-dark focus:outline-none focus:ring-2 focus:ring-focus dark:focus:ring-focus-dark"
      >
        <div className="h-5 w-5" />
      </button>
    );
  }

  const toggleTheme = () => {
    // Only toggle between dark and light (no system theme per spec)
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      onClick={toggleTheme}
      className="px-3 py-2 rounded-md transition-gpu transition-default hover:bg-hover dark:hover:bg-hover-dark focus:outline-none focus:ring-2 focus:ring-focus dark:focus:ring-focus-dark"
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5 text-text dark:text-text-dark" />
      ) : (
        <Moon className="h-5 w-5 text-text dark:text-text-dark" />
      )}
    </button>
  );
};

export default ThemeToggle;
