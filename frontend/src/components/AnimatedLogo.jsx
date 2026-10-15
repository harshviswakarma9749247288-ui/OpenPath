import React, { useState } from 'react';

export default function AnimatedLogo({ size = 'md', interactive = true, showRings = true }) {
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const sizes = {
    sm: { box: 34, font: '0.95rem', radius: 8, ring: 46 },
    md: { box: 42, font: '1.2rem', radius: 12, ring: 58 },
    lg: { box: 64, font: '1.8rem', radius: 18, ring: 86 },
    xl: { box: 88, font: '2.4rem', radius: 24, ring: 118 },
  };

  const currentSize = sizes[size] || sizes.md;

  const handleMouseMove = (e) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const tiltX = -(y / (rect.height / 2)) * 20;
    const tiltY = (x / (rect.width / 2)) * 20;
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        width: `${currentSize.ring}px`,
        height: `${currentSize.ring}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        perspective: '600px',
        cursor: interactive ? 'pointer' : 'default',
        userSelect: 'none',
      }}
    >
      {/* Outer Orbiting 3D Ring 1 */}
      {showRings && (
        <div
          className="anim-orbit-ring"
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '1.5px dashed rgba(168, 85, 247, 0.45)',
            transform: isHovered
              ? `rotateX(65deg) rotateZ(180deg) scale(1.1)`
              : 'rotateX(65deg) rotateZ(0deg)',
            transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Orbiting 3D Ring 2 (Cross Axis) */}
      {showRings && (
        <div
          className="anim-orbit-ring-reverse"
          style={{
            position: 'absolute',
            inset: '3px',
            borderRadius: '50%',
            border: '1px solid rgba(236, 72, 153, 0.35)',
            transform: isHovered
              ? `rotateY(65deg) rotateZ(-180deg) scale(1.1)`
              : 'rotateY(65deg) rotateZ(0deg)',
            transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Orbiting Photon Satellite Dot */}
      {showRings && (
        <div
          className="anim-satellite-dot"
          style={{
            position: 'absolute',
            width: size === 'sm' ? '5px' : '7px',
            height: size === 'sm' ? '5px' : '7px',
            borderRadius: '50%',
            backgroundColor: '#06B6D4',
            boxShadow: '0 0 10px #06B6D4, 0 0 18px rgba(6, 182, 212, 0.8)',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Central 3D Core Logo Box */}
      <div
        style={{
          width: `${currentSize.box}px`,
          height: `${currentSize.box}px`,
          borderRadius: `${currentSize.radius}px`,
          background: 'linear-gradient(135deg, #7C3AED 0%, #C026D3 50%, #EC4899 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          fontWeight: 900,
          fontSize: currentSize.font,
          letterSpacing: '-0.5px',
          boxShadow: isHovered
            ? '0 0 30px rgba(236, 72, 153, 0.7), 0 0 50px rgba(124, 58, 237, 0.5), inset 0 0 15px rgba(255, 255, 255, 0.5)'
            : '0 0 18px rgba(236, 72, 153, 0.45), 0 0 30px rgba(124, 58, 237, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.35)',
          transform: isHovered
            ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.1) translateZ(12px)`
            : 'rotateX(0deg) rotateY(0deg) scale(1) translateZ(0)',
          transformStyle: 'preserve-3d',
          transition: isHovered
            ? 'transform 0.1s ease-out, box-shadow 0.3s ease'
            : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s ease',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Shimmer sweep effect */}
        <div
          className="anim-shimmer-sweep"
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(105deg, transparent 20%, rgba(255, 255, 255, 0.4) 50%, transparent 80%)',
            pointerEvents: 'none',
          }}
        />

        {/* Text glyph */}
        <span
          style={{
            position: 'relative',
            zIndex: 2,
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
            transform: 'translateZ(10px)',
          }}
        >
          OP
        </span>
      </div>
    </div>
  );
}
