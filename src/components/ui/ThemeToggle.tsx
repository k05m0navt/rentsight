"use client";

import React from 'react';
import useTheme from '@/hooks/useTheme';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const next = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  return (
    <button
      aria-label="Toggle theme"
      onClick={next}
      className="px-3 py-1 rounded focus:outline-none"
    >
      {theme === 'dark' ? 'Dark' : theme === 'light' ? 'Light' : 'System'}
    </button>
  );
};

export default ThemeToggle;


