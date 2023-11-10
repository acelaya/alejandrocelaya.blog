import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import type { FC } from 'react';
import { clsx } from 'clsx';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';

type ThemeToggleProps = {
  className?: string;
};

type Theme = 'dark' | 'light';

const getSystemPreferredTheme = (): Theme => window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

export const ThemeToggle: FC<ThemeToggleProps> = ({ className }) => {
  const [theme, setTheme] = useState<Theme | undefined>();
  const toggleTheme = useCallback(() => setTheme(prev => prev === 'dark' ? 'light' : 'dark'), [])

  // Load initial theme value. Check local storage and fall back to system preferred scheme
  useEffect(() => {
    const initialTheme = (localStorage.getItem('theme') ?? getSystemPreferredTheme()) as Theme;
    setTheme(initialTheme);
  }, []);

  // Every time theme changes, save it in local storage and update attribute
  useLayoutEffect(() => {
    if (theme) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  return (
    <button className={clsx(className, 'cursor-pointer')} onClick={toggleTheme}>
      <FontAwesomeIcon fixedWidth icon={theme === 'dark' ? faMoon : faSun} />
      <span className="ml-2 md:sr-only"><span className="capitalize">{theme}</span> theme</span>
    </button>
  );
};
