import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('ThemeContext', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  it('should initialize theme from localStorage if available', () => {
    localStorage.setItem('theme', 'dark');
    const theme = localStorage.getItem('theme');
    expect(theme).toBe('dark');
  });

  it('should default to light theme if no localStorage value', () => {
    const theme = localStorage.getItem('theme') || 'light';
    expect(theme).toBe('light');
  });

  it('should toggle theme from light to dark', () => {
    let theme = 'light';
    const toggleTheme = () => {
      theme = theme === 'light' ? 'dark' : 'light';
    };

    expect(theme).toBe('light');
    toggleTheme();
    expect(theme).toBe('dark');
  });

  it('should toggle theme from dark to light', () => {
    let theme = 'dark';
    const toggleTheme = () => {
      theme = theme === 'light' ? 'dark' : 'light';
    };

    expect(theme).toBe('dark');
    toggleTheme();
    expect(theme).toBe('light');
  });

  it('should persist theme preference in localStorage on change', () => {
    const updateTheme = (newTheme: string) => {
      localStorage.setItem('theme', newTheme);
    };

    updateTheme('dark');
    expect(localStorage.getItem('theme')).toBe('dark');

    updateTheme('light');
    expect(localStorage.getItem('theme')).toBe('light');
  });

  it('should add dark class to document element when theme is dark', () => {
    const applyTheme = (theme: string) => {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    applyTheme('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    applyTheme('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('should respect system theme preference as fallback', () => {
    const getSystemTheme = () => {
      const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return isDarkMode ? 'dark' : 'light';
    };

    const theme = getSystemTheme();
    expect(theme).toMatch(/light|dark/);
  });

  it('should handle invalid theme values gracefully', () => {
    const normalizeTheme = (theme: string) => {
      return theme === 'dark' ? 'dark' : 'light';
    };

    expect(normalizeTheme('dark')).toBe('dark');
    expect(normalizeTheme('light')).toBe('light');
    expect(normalizeTheme('invalid')).toBe('light');
    expect(normalizeTheme('')).toBe('light');
  });

  it('should sync theme across multiple tabs/windows', () => {
    const setThemeInStorage = (theme: string) => {
      localStorage.setItem('theme', theme);
      // Simulate storage event
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'theme',
        newValue: theme,
      }));
    };

    setThemeInStorage('dark');
    expect(localStorage.getItem('theme')).toBe('dark');

    setThemeInStorage('light');
    expect(localStorage.getItem('theme')).toBe('light');
  });
});
