import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useUIStore } from '../store/useUIStore';

export default function BackButton({
  label = 'Back',
  fallbackPage = 'dashboard',
  fallbackParams = {},
  onClick,
  className = '',
  style = {},
  variant = 'glass',
}) {
  const { goBack } = useUIStore();

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    } else {
      goBack(fallbackPage, fallbackParams);
    }
  };

  const isPill = variant === 'pill';
  const isGhost = variant === 'ghost';

  return (
    <button
      onClick={handleClick}
      className={`back-btn ${isGhost ? 'btn-ghost' : isPill ? 'announcement-pill' : 'btn-liquid-glass'} ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: isPill ? '7px 18px 7px 14px' : isGhost ? '8px 14px' : '9px 20px',
        fontSize: '0.85rem',
        fontWeight: 600,
        cursor: 'pointer',
        marginBottom: '18px',
        textDecoration: 'none',
        borderRadius: 'var(--radius-full)',
        ...style,
      }}
      title={`Go back (${label})`}
    >
      <ArrowLeft size={16} className="back-arrow-icon" />
      <span>{label}</span>
    </button>
  );
}
