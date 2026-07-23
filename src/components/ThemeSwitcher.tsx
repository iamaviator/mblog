'use client';

import { useTheme, type ThemeMode } from '@/context/ThemeContext';
import { useEffect, useState } from 'react';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything until mounted on client
  if (!mounted) {
    return <div className="hidden" />;
  }

  const themes: Array<{ value: ThemeMode; label: string; emoji: string }> = [
    { value: 'light', label: 'Light', emoji: '☀️' },
    { value: 'dark', label: 'Dark', emoji: '🌙' },
    { value: 'matrix', label: 'Matrix', emoji: '💚' },
    { value: 'techno', label: 'Techno', emoji: '🤖' },
  ];

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="theme-switcher" className="text-xs text-[var(--text-secondary)] hidden sm:inline">
        Theme:
      </label>
      <select
        id="theme-switcher"
        aria-label="Select theme"
        value={theme}
        onChange={(event) => setTheme(event.target.value as ThemeMode)}
        className="px-2 py-1 rounded text-sm bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-color)]"
      >
        {themes.map((t) => (
          <option key={t.value} value={t.value}>
            {t.emoji} {t.label}
          </option>
        ))}
      </select>
    </div>
  );
}
