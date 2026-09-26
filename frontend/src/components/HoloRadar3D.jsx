import React, { useState } from 'react';
import Tilt3DCard from './Tilt3DCard';

export default function HoloRadar3D({ breakdown, overallScore = 88 }) {
  const [hoveredFactor, setHoveredFactor] = useState(null);

  const factors = [
    { key: 'skill', name: 'Skill Match', weight: '40%', score: breakdown?.skillMatch?.score || 90, color: '#38BDF8' },
    { key: 'qual', name: 'Academics', weight: '20%', score: breakdown?.qualification?.score || 95, color: '#34D399' },
    { key: 'loc', name: 'Location', weight: '20%', score: breakdown?.location?.score || 100, color: '#C084FC' },
    { key: 'exp', name: 'Experience', weight: '10%', score: breakdown?.experience?.score || 80, color: '#FBBF24' },
    { key: 'int', name: 'Interests', weight: '10%', score: breakdown?.interest?.score || 85, color: '#F472B6' },
  ];

  // Pentagon Geometry (5 vertices)
  const size = 260;
  const center = size / 2;
  const radius = size * 0.4;

  const getCoordinates = (index, valuePercent) => {
    // 5 vertices rotated starting from top (-90 deg)
    const angle = (Math.PI * 2 * index) / 5 - Math.PI / 2;
    const r = radius * (valuePercent / 100);
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Generate background concentric pentagons
  const levels = [20, 40, 60, 80, 100];
  const gridPolygons = levels.map((lvl) => {
    return Array.from({ length: 5 })
      .map((_, i) => {
        const pt = getCoordinates(i, lvl);
        return `${pt.x},${pt.y}`;
      })
      .join(' ');
  });

  // User score polygon
  const scorePoints = factors
    .map((f, i) => {
      const pt = getCoordinates(i, f.score);
      return `${pt.x},${pt.y}`;
    })
    .join(' ');

  return (
    <Tilt3DCard
      className="card card-featured"
      style={{
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginBottom: '14px' }}>
        <div>
          <span
            style={{
              fontSize: '0.725rem',
              fontWeight: 700,
              color: '#C084FC',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            3D HOLOGRAPHIC RADAR
          </span>
          <h4 style={{ fontSize: '1.1rem', color: 'var(--primary-text)', marginTop: '2px' }}>
            5-Factor Fit Topology
          </h4>
        </div>

        <div
          style={{
            padding: '4px 12px',
            borderRadius: '9999px',
            backgroundColor: 'var(--status-green-bg)',
            border: '1px solid var(--status-green-border)',
            color: 'var(--status-green-text)',
            fontSize: '0.8rem',
            fontWeight: 700,
          }}
        >
          {overallScore}% Overall Index
        </div>
      </div>

      {/* SVG Radar Container with 3D Holographic Perspective */}
      <div
        style={{
          position: 'relative',
          width: `${size}px`,
          height: `${size}px`,
          margin: '10px 0',
        }}
      >
        {/* Hologram Scanner Line */}
        <div
          className="anim-scanner-sweep"
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: 'conic-gradient(from 0deg, transparent 0deg, rgba(168, 85, 247, 0.25) 60deg, transparent 65deg)',
            pointerEvents: 'none',
            zIndex: 3,
          }}
        />

        <svg width={size} height={size} style={{ overflow: 'visible' }}>
          <defs>
            <linearGradient id="scoreMeshGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#C026D3" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.6" />
            </linearGradient>

            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Grid Concentric Pentagons */}
          {gridPolygons.map((poly, idx) => (
            <polygon
              key={idx}
              points={poly}
              fill="none"
              stroke="var(--border-color)"
              strokeWidth={idx === 4 ? 1.5 : 1}
              strokeDasharray={idx < 4 ? '3,3' : 'none'}
              opacity={0.6 + idx * 0.1}
            />
          ))}

          {/* Radial Axis Spokes */}
          {Array.from({ length: 5 }).map((_, i) => {
            const outer = getCoordinates(i, 100);
            return (
              <line
                key={i}
                x1={center}
                y1={center}
                x2={outer.x}
                y2={outer.y}
                stroke="var(--border-color)"
                strokeWidth="1"
                opacity="0.5"
              />
            );
          })}

          {/* Score Polygon Mesh */}
          <polygon
            points={scorePoints}
            fill="url(#scoreMeshGrad)"
            stroke="#EC4899"
            strokeWidth="2.5"
            filter="url(#neonGlow)"
            style={{
              transition: 'all 0.4s ease',
            }}
          />

          {/* Vertex Nodes with Tooltips */}
          {factors.map((f, i) => {
            const pt = getCoordinates(i, f.score);
            const isHovered = hoveredFactor === f.key;
            return (
              <g
                key={f.key}
                onMouseEnter={() => setHoveredFactor(f.key)}
                onMouseLeave={() => setHoveredFactor(null)}
                style={{ cursor: 'pointer' }}
              >
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 7 : 5}
                  fill={f.color}
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                  style={{
                    filter: `drop-shadow(0 0 6px ${f.color})`,
                    transition: 'r 0.2s ease',
                  }}
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Factor Pills legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', width: '100%', marginTop: '6px' }}>
        {factors.map((f) => (
          <div
            key={f.key}
            onMouseEnter={() => setHoveredFactor(f.key)}
            onMouseLeave={() => setHoveredFactor(null)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '9999px',
              backgroundColor: hoveredFactor === f.key ? 'var(--box-subtle)' : 'transparent',
              border: `1px solid ${hoveredFactor === f.key ? f.color : 'var(--border-color)'}`,
              fontSize: '0.75rem',
              color: 'var(--primary-text)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: f.color }} />
            <span>{f.name}</span>
            <strong style={{ color: f.color }}>{f.score}%</strong>
          </div>
        ))}
      </div>
    </Tilt3DCard>
  );
}
