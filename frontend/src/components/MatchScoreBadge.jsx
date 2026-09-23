import React from 'react';

export default function MatchScoreBadge({ score, size = 48, strokeWidth = 4, showLabel = true }) {
  if (score === null || score === undefined) return null;

  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(100, Math.max(0, score));
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  let strokeColor = '#10B981'; // Green >= 80%
  let textColor = '#047857';
  let badgeLabel = 'High Match';
  let bgColor = '#ECFDF5';

  if (score < 50) {
    strokeColor = '#EF4444'; // Red < 50%
    textColor = '#B91C1C';
    badgeLabel = 'Low Match';
    bgColor = '#FEF2F2';
  } else if (score < 80) {
    strokeColor = '#F59E0B'; // Yellow 50-79%
    textColor = '#B45309';
    badgeLabel = 'Good Match';
    bgColor = '#FFFBEB';
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
            stroke="#E2E8F0"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
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
            fontWeight: 700,
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
            padding: '2px 8px',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: 600,
          }}
        >
          {badgeLabel}
        </span>
      )}
    </div>
  );
}
