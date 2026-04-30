// src/context/ThemeContext.jsx

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Get saved theme from localStorage or default to 'light'
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  });

  const [resolvedTheme, setResolvedTheme] = useState('light');

  // Apply theme to document
  useEffect(() => {
    const root = window.document.documentElement;
    const body = window.document.body;

    // Remove existing theme classes
    root.classList.remove('light', 'dark');
    body.classList.remove('light', 'dark');

    let effectiveTheme = theme;

    if (theme === 'auto') {
      // Check system preference
      effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }

    // Apply theme class
    root.classList.add(effectiveTheme);
    body.classList.add(effectiveTheme);
    
    // Set color-scheme for native elements
    root.style.colorScheme = effectiveTheme;
    
    // Update resolved theme
    setResolvedTheme(effectiveTheme);

    // Save to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Listen for system theme changes when in 'auto' mode
  useEffect(() => {
    if (theme !== 'auto') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      const root = window.document.documentElement;
      const body = window.document.body;
      
      root.classList.remove('light', 'dark');
      body.classList.remove('light', 'dark');
      
      const newTheme = e.matches ? 'dark' : 'light';
      root.classList.add(newTheme);
      body.classList.add(newTheme);
      root.style.colorScheme = newTheme;
      setResolvedTheme(newTheme);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const value = {
    theme,
    setTheme,
    resolvedTheme,
    isDark: resolvedTheme === 'dark',
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};