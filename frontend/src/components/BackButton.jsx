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
  const variantClass = isGhost ? 'ghost' : isPill ? 'pill' : 'liquid';

  return (
    <button
      onClick={handleClick}
      className={`back-btn ${variantClass} ${isGhost ? 'btn-ghost' : isPill ? 'announcement-pill' : 'btn-liquid-glass'} ${className}`}
      title={`Go back (${label})`}
    >
      <ArrowLeft size={16} className="back-arrow-icon" />
      <span>{label}</span>
    </button>
  );
}
