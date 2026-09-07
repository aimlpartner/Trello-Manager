'use client';

import { useSyncExternalStore, useCallback, useEffect } from 'react';

const THEME_STORAGE_KEY = 'btp_theme';

function subscribe(callback: () => void) {
  if (typeof window === 'undefined') {
    return () => {};
  }
  window.addEventListener('storage', callback);
  window.addEventListener('btp-theme-change', callback);
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('btp-theme-change', callback);
    mediaQuery.removeEventListener('change', callback);
  };
}

function getClientSnapshot(): 'light' | 'dark' {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as 'light' | 'dark' | null;
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
  } catch {
    // ignore
  }
  return 'dark';
}

function getServerSnapshot(): 'light' | 'dark' {
  return 'dark';
}

/**
 * Clean hydration-safe theme hook using React 18+ useSyncExternalStore.
 * Guarantees server and client HTML match during hydration, avoids setState in effect,
 * and synchronizes theme to DOM and localStorage.
 */
export function useTheme(): [
  'light' | 'dark',
  (action: 'light' | 'dark' | ((prev: 'light' | 'dark') => 'light' | 'dark')) => void
] {
  const theme = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot
  );

  const setTheme = useCallback(
    (action: 'light' | 'dark' | ((prev: 'light' | 'dark') => 'light' | 'dark')) => {
      const current = getClientSnapshot();
      const nextTheme = typeof action === 'function' ? action(current) : action;
      try {
        localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
        document.documentElement.setAttribute('data-theme', nextTheme);
        if (nextTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        window.dispatchEvent(new CustomEvent('btp-theme-change'));
      } catch {
        // ignore
      }
    },
    []
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return [theme, setTheme];
}
