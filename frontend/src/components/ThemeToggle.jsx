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
      className="theme-toggle-btn"
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: size === 'sm' ? '6px 10px' : '7px 14px',
        borderRadius: '9999px',
        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
        border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid rgba(0, 0, 0, 0.12)',
        color: isDark ? '#FDE047' : '#D97706',
        cursor: 'pointer',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: isDark
          ? '0 0 14px rgba(253, 224, 71, 0.18)'
          : '0 2px 8px rgba(0, 0, 0, 0.06)',
      }}
    >
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: isDark ? 'rotate(0deg)' : 'rotate(40deg)',
          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {isDark ? (
          <Sun size={size === 'sm' ? 15 : 18} />
        ) : (
          <Moon size={size === 'sm' ? 15 : 18} />
        )}
      </span>

      {showLabel && (
        <span
          style={{
            fontSize: '0.8rem',
            fontWeight: 600,
            color: 'var(--primary-text)',
            whiteSpace: 'nowrap',
          }}
        >
          {isDark ? 'Light' : 'Dark'}
        </span>
      )}
    </button>
  );
}
