'use client';

import { Suspense } from 'react';
import { ThemeSwitcher } from './ThemeSwitcher';

function ThemeSwitcherFallback() {
  return null;
}

export function ThemeSwitcherWrapper() {
  return (
    <Suspense fallback={<ThemeSwitcherFallback />}>
      <ThemeSwitcher />
    </Suspense>
  );
}
