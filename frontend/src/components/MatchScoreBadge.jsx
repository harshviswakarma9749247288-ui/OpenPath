import React from 'react';

export default function MatchScoreBadge({ score, size = 48, strokeWidth = 4, showLabel = true }) {
  if (score === null || score === undefined) return null;

  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(100, Math.max(0, score));
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  let strokeColor = 'var(--status-green)';
  let textColor = 'var(--status-green-text)';
  let badgeLabel = 'High Match';
  let bgColor = 'var(--status-green-bg)';
  let borderColor = 'var(--status-green-border)';

  if (score < 50) {
    strokeColor = 'var(--status-red)';
    textColor = 'var(--status-red-text)';
    badgeLabel = 'Low Match';
    bgColor = 'var(--status-red-bg)';
    borderColor = 'var(--status-red-border)';
  } else if (score < 80) {
    strokeColor = 'var(--status-yellow)';
    textColor = 'var(--status-yellow-text)';
    badgeLabel = 'Good Match';
    bgColor = 'var(--status-yellow-bg)';
    borderColor = 'var(--status-yellow-border)';
  }

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="var(--border-color)"
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
