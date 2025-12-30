import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

// Professional, modern color theme presets
const COLOR_THEMES = {
  default: {
    name: 'Default',
    description: 'Classic PGC Red & Blue',
    primary: { main: '#e13a27', light: '#ff7363', dark: '#a0271b' },
    secondary: { main: '#2C2B6F', light: '#534bf4', dark: '#1d1c4a' },
  },
  ocean: {
    name: 'Ocean',
    description: 'Professional Teal & Navy',
    primary: { main: '#0d9488', light: '#2dd4bf', dark: '#0f766e' },
    secondary: { main: '#1e3a5f', light: '#3b82f6', dark: '#1e293b' },
  },
  emerald: {
    name: 'Emerald',
    description: 'Modern Green & Slate',
    primary: { main: '#059669', light: '#34d399', dark: '#047857' },
    secondary: { main: '#334155', light: '#64748b', dark: '#1e293b' },
  },
  royal: {
    name: 'Royal',
    description: 'Elegant Purple & Indigo',
    primary: { main: '#7c3aed', light: '#a78bfa', dark: '#5b21b6' },
    secondary: { main: '#3730a3', light: '#6366f1', dark: '#312e81' },
  },
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

// Apply color theme CSS variables to document
const applyColorTheme = (themeKey) => {
  const theme = COLOR_THEMES[themeKey] || COLOR_THEMES.default;
  const root = document.documentElement;

  // Apply primary colors
  root.style.setProperty('--color-primary-main', theme.primary.main);
  root.style.setProperty('--color-primary-light', theme.primary.light);
  root.style.setProperty('--color-primary-dark', theme.primary.dark);

  // Apply secondary colors
  root.style.setProperty('--color-secondary-main', theme.secondary.main);
  root.style.setProperty('--color-secondary-light', theme.secondary.light);
  root.style.setProperty('--color-secondary-dark', theme.secondary.dark);
};

export const ThemeProvider = ({ children }) => {
  // Lazy initialize dark mode state from localStorage
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.classList.add('dark');
        return true;
      }
    }
    document.documentElement.classList.remove('dark');
    return false;
  });

  // Hero style state: 'classic' (solid teal) or 'modern' (diagonal gradients)
  const [heroStyle, setHeroStyleState] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('heroStyle') || 'modern';
    }
    return 'modern';
  });

  // Color theme state
  const [colorTheme, setColorThemeState] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('colorTheme');
      if (saved && COLOR_THEMES[saved]) {
        applyColorTheme(saved);
        return saved;
      }
    }
    applyColorTheme('default');
    return 'default';
  });

  const toggleTheme = () => {
    setIsDark(prev => {
      const newValue = !prev;
      if (newValue) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return newValue;
    });
  };

  const setHeroStyle = (style) => {
    setHeroStyleState(style);
    localStorage.setItem('heroStyle', style);
  };

  const setColorTheme = (themeKey) => {
    if (COLOR_THEMES[themeKey]) {
      setColorThemeState(themeKey);
      localStorage.setItem('colorTheme', themeKey);
      applyColorTheme(themeKey);
    }
  };

  const value = {
    isDarkMode: isDark,
    isDark,
    toggleTheme,
    heroStyle,
    setHeroStyle,
    colorTheme,
    setColorTheme,
    colorThemes: COLOR_THEMES,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
