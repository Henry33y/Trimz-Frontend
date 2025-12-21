import { BiMoon, BiSun, BiAdjust } from 'react-icons/bi';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  const title =
    theme === 'dark' ? 'Theme: dark (click to cycle)' : theme === 'light' ? 'Theme: light (click to cycle)' : 'Theme: system (click to cycle)';

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="w-10 h-10 flex items-center justify-center rounded-full border border-transparent hover:border-gray-300 transition-colors duration-300 bg-white/0 dark:bg-slate-700/0"
      title={title}
    >
      {theme === 'dark' && <BiMoon className="text-yellow-300" />}
      {theme === 'light' && <BiSun className="text-gray-700" />}
      {theme === 'system' && <BiAdjust className="text-indigo-400" />}
    </button>
  );
};

export default ThemeToggle;
