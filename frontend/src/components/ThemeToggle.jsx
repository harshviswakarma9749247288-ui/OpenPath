import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useUIStore } from '../store/useUIStore';

export default function ThemeToggle({ showLabel = false, size = 'default' }) {
  const { theme, toggleTheme } = useUIStore();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`theme-toggle-btn size-${size} ${isDark ? 'theme-dark' : 'theme-light'}`}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      <span className={`theme-icon-wrap ${isDark ? 'dark' : 'light'}`}>
        {isDark ? (
          <Sun size={size === 'sm' ? 15 : 18} />
        ) : (
          <Moon size={size === 'sm' ? 15 : 18} />
        )}
      </span>

      {showLabel && (
        <span className="theme-label-text">
          {isDark ? 'Light' : 'Dark'}
        </span>
      )}
    </button>
  );
}
