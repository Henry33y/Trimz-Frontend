import { createContext, useContext, useEffect, useState, useRef } from 'react';

const ThemeContext = createContext();

/**
 * theme values: 'light' | 'dark' | 'system'
 * - 'system' follows the OS preference and updates on change
 */
export const ThemeProvider = ({ children }) => {
  const getInitialTheme = () => {
    try {
      const saved = localStorage.getItem('theme');
      if (saved) return saved;
      // Default to light mode
      return 'light';
    } catch (e) {
      return 'light';
    }
  };

  const [theme, setTheme] = useState(getInitialTheme);
  const mmRef = useRef(null);

  useEffect(() => {
    const root = document.documentElement;

    const apply = (currentTheme) => {
      if (currentTheme === 'dark') {
        root.classList.add('dark');
      } else if (currentTheme === 'light') {
        root.classList.remove('dark');
      } else if (currentTheme === 'system') {
        // follow system
        const prefersDark = window?.matchMedia?.('(prefers-color-scheme: dark)')?.matches;
        if (prefersDark) root.classList.add('dark');
        else root.classList.remove('dark');
      }
    };

    apply(theme);

    try {
      localStorage.setItem('theme', theme);
    } catch (e) { }

    // if theme is system, listen for system changes
    if (mmRef.current) {
      mmRef.current.removeEventListener('change', mmRef.current._handler);
      mmRef.current = null;
    }

    if (theme === 'system' && window?.matchMedia) {
      const mm = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = (e) => {
        if (theme !== 'system') return;
        if (e.matches) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
      };
      mm.addEventListener ? mm.addEventListener('change', handler) : mm.addListener(handler);
      mm._handler = handler;
      mmRef.current = mm;
    }

    return () => {
      if (mmRef.current) {
        const mm = mmRef.current;
        mm.removeEventListener ? mm.removeEventListener('change', mm._handler) : mm.removeListener(mm._handler);
        mmRef.current = null;
      }
    };
  }, [theme]);

  // Cycle through light -> dark -> system -> light
  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : t === 'dark' ? 'system' : 'light'));

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;
