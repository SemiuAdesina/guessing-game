import { useEffect, useState } from 'react';

const ThemeToggle = () => {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;

    if (dark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark((prev) => !prev)}
      className="fixed top-4 right-4 z-50 w-10 h-10 flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded-full shadow hover:scale-105 transition"
      aria-label="Toggle theme"
    >
      <span className="text-xl">{dark ? '☀️' : '🌙'}</span>
    </button>
  );
};

export default ThemeToggle;
