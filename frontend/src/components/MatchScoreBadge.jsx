import React from 'react';

export default function MatchScoreBadge({ score, size = 48, strokeWidth = 4, showLabel = true }) {
  if (score === null || score === undefined) return null;

  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(100, Math.max(0, score));
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  let strokeColor = '#34D399'; // Neon Emerald >= 80%
  let textColor = '#6EE7B7';
  let badgeLabel = 'High Match';
  let bgColor = 'rgba(16, 185, 129, 0.15)';
  let borderColor = 'rgba(16, 185, 129, 0.35)';

  if (score < 50) {
    strokeColor = '#F87171'; // Neon Rose < 50%
    textColor = '#FCA5A5';
    badgeLabel = 'Low Match';
    bgColor = 'rgba(239, 68, 68, 0.15)';
    borderColor = 'rgba(239, 68, 68, 0.35)';
  } else if (score < 80) {
    strokeColor = '#FBBF24'; // Neon Amber 50-79%
    textColor = '#FDE68A';
    badgeLabel = 'Good Match';
    bgColor = 'rgba(245, 158, 11, 0.15)';
    borderColor = 'rgba(245, 158, 11, 0.35)';
  }

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', filter: `drop-shadow(0 0 6px ${strokeColor}44)` }}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Neon Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{ transition: 'stroke-dashoffset 0.6s ease' }}
          />
        </svg>
        <span
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: size,
            height: size,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: size > 40 ? '0.8rem' : '0.65rem',
            fontWeight: 800,
            color: textColor,
          }}
        >
          {score}%
        </span>
      </div>
      {showLabel && (
        <span
          style={{
            backgroundColor: bgColor,
            color: textColor,
            border: `1px solid ${borderColor}`,
            padding: '2px 8px',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: 700,
            backdropFilter: 'blur(8px)',
          }}
        >
          {badgeLabel}
        </span>
      )}
    </div>
  );
}
