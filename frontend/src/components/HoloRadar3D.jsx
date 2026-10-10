import React, { useState } from 'react';
import Tilt3DCard from './Tilt3DCard';

export default function HoloRadar3D({ breakdown, overallScore = 88 }) {
  const [hoveredFactor, setHoveredFactor] = useState(null);

  const factors = [
    { key: 'skill', name: 'Skill Match', weight: '40%', score: breakdown?.skillMatch?.score || 90 },
    { key: 'qual', name: 'Academics', weight: '20%', score: breakdown?.qualification?.score || 95 },
    { key: 'loc', name: 'Location', weight: '20%', score: breakdown?.location?.score || 100 },
    { key: 'exp', name: 'Experience', weight: '10%', score: breakdown?.experience?.score || 80 },
    { key: 'int', name: 'Interests', weight: '10%', score: breakdown?.interest?.score || 85 },
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
    <Tilt3DCard className="card card-featured holo-radar-card">
      <div className="holo-radar-header">
        <div>
          <span className="holo-radar-tag">
            3D HOLOGRAPHIC RADAR
          </span>
          <h4 className="holo-radar-title">
            5-Factor Fit Topology
          </h4>
        </div>

        <div className="holo-radar-overall-badge">
          {overallScore}% Overall Index
        </div>
      </div>

      {/* SVG Radar Container with 3D Holographic Perspective */}
      <div className="holo-radar-svg-box">
        {/* Hologram Scanner Line */}
        <div className="anim-scanner-sweep holo-scanner-sweep" />

        <svg width={size} height={size} className="holo-radar-svg">
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
              className="holo-grid-poly"
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
                className="holo-axis-spoke"
              />
            );
          })}

          {/* Score Polygon Mesh */}
          <polygon
            points={scorePoints}
            className="holo-score-mesh"
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
                className="holo-vertex-group"
              >
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 7 : 5}
                  className={`holo-vertex-dot dot-${f.key}`}
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Factor Pills legend */}
      <div className="holo-pills-row">
        {factors.map((f) => (
          <div
            key={f.key}
            onMouseEnter={() => setHoveredFactor(f.key)}
            onMouseLeave={() => setHoveredFactor(null)}
            className={`holo-factor-pill factor-${f.key} ${hoveredFactor === f.key ? 'hovered' : ''}`}
          >
            <span className={`holo-factor-indicator-dot dot-${f.key}`} />
            <span>{f.name}</span>
            <strong className={`holo-factor-score-val val-${f.key}`}>{f.score}%</strong>
          </div>
        ))}
      </div>
    </Tilt3DCard>
  );
}
