'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark' | 'matrix' | 'techno';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>('light');

  useEffect(() => {
    // Default to minimal/light unless user has an explicit saved choice.
    const savedTheme = localStorage.getItem('theme') as ThemeMode | null;
    const initialTheme = savedTheme || 'light';
    setThemeState(initialTheme);
    applyTheme(initialTheme);
  }, []);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  const applyTheme = (t: ThemeMode) => {
    const html = document.documentElement;
    
    // Remove all theme classes
    html.classList.remove('light', 'dark', 'matrix', 'techno');
    
    // Add new theme class
    if (t !== 'light') {
      html.classList.add(t);
    }
    
    // Apply CSS variables based on theme
    const themeVariables = getThemeVariables(t);
    Object.entries(themeVariables).forEach(([key, value]) => {
      html.style.setProperty(key, value);
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    // During SSR, return a default context that won't cause errors
    return { theme: 'light' as ThemeMode, setTheme: () => {} };
  }
  return context;
}

function getThemeVariables(theme: ThemeMode): Record<string, string> {
  const themes = {
    light: {
      '--bg-primary': '#ffffff',
      '--bg-secondary': '#f9fafb',
      '--text-primary': '#000000',
      '--text-secondary': '#6b7280',
      '--border-color': '#e5e7eb',
      '--accent': '#111111',
      '--hover-bg': '#f3f4f6',
    },
    dark: {
      '--bg-primary': '#1a1a1a',
      '--bg-secondary': '#2d2d2d',
      '--text-primary': '#e5e7eb',
      '--text-secondary': '#9ca3af',
      '--border-color': '#404040',
      '--accent': '#e5e7eb',
      '--hover-bg': '#3d3d3d',
    },
    matrix: {
      '--bg-primary': '#000000',
      '--bg-secondary': '#0a0e27',
      '--text-primary': '#00ff00',
      '--text-secondary': '#00aa00',
      '--border-color': '#003300',
      '--accent': '#00ff41',
      '--hover-bg': '#001a00',
      '--font-family': "'Courier New', monospace",
    },
    techno: {
      '--bg-primary': '#0a0e27',
      '--bg-secondary': '#0f1a3c',
      '--text-primary': '#00ffff',
      '--text-secondary': '#0099ff',
      '--border-color': '#1e3a8a',
      '--accent': '#00ffff',
      '--hover-bg': '#1a2a5c',
      '--font-family': "'Inter', sans-serif",
    },
  };

  return themes[theme] || themes.light;
}
