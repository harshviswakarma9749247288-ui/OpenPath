import React from 'react';

export default function MatchScoreBadge({ score, size = 48, strokeWidth = 4, showLabel = true }) {
  if (score === null || score === undefined) return null;

  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(100, Math.max(0, score));
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  let statusClass = 'high';
  let badgeLabel = 'High Match';

  if (score < 50) {
    statusClass = 'low';
    badgeLabel = 'Low Match';
  } else if (score < 80) {
    statusClass = 'good';
    badgeLabel = 'Good Match';
  }

  return (
    <div className={`match-score-badge-wrap ${statusClass}`}>
      <div className="match-score-circle-container" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="match-score-circle-svg">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            className="match-score-bg-circle"
          />
          {/* Neon Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="match-score-prog-circle"
          />
        </svg>
        <span className={`match-score-center-text ${size <= 40 ? 'text-sm' : ''}`}>
          {score}%
        </span>
      </div>
      {showLabel && (
        <span className={`match-score-label-pill ${statusClass}`}>
          {badgeLabel}
        </span>
      )}
    </div>
  );
}
