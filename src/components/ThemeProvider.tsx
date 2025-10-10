"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

const ThemeContext = createContext({
  theme: 'system' as Theme,
  setTheme: (t: Theme) => {}
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('system');

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      setThemeState(stored as Theme);
    } else {
      setThemeState('system');
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const root = document.documentElement;
    const applied = theme === 'system'
      ? (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : theme;
    if (applied === 'dark') root.classList.add('dark'); else root.classList.remove('dark');
    try { localStorage.setItem('theme', theme); } catch (e) { /* ignore */ }
  }, [theme]);

  const setTheme = (t: Theme) => setThemeState(t);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;


