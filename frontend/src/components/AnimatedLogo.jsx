import React, { useState } from 'react';

export default function AnimatedLogo({ size = 'md', interactive = true, showRings = false }) {
  const [isHovered, setIsHovered] = useState(false);

  const sizes = {
    sm: { box: 34, font: '0.85rem', radius: 10, star: 5 },
    md: { box: 42, font: '1.05rem', radius: 12, star: 6 },
    lg: { box: 60, font: '1.5rem', radius: 16, star: 8 },
    xl: { box: 80, font: '2.0rem', radius: 22, star: 10 },
  };

  const currentSize = sizes[size] || sizes.md;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        width: `${currentSize.box}px`,
        height: `${currentSize.box}px`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        cursor: interactive ? 'pointer' : 'default',
        userSelect: 'none',
      }}
    >
      {/* Sleek Minimalist Core Logo Badge */}
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: `${currentSize.radius}px`,
          background: 'linear-gradient(135deg, #7C3AED 0%, #C026D3 55%, #EC4899 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          fontWeight: 900,
          border: '1px solid rgba(255, 255, 255, 0.25)',
          boxShadow: isHovered
            ? '0 6px 20px rgba(236, 72, 153, 0.45), 0 2px 10px rgba(124, 58, 237, 0.35)'
            : '0 3px 12px rgba(124, 58, 237, 0.3), 0 1px 3px rgba(0, 0, 0, 0.2)',
          transform: isHovered && interactive ? 'translateY(-1px) scale(1.04)' : 'scale(1)',
          transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle glass reflection highlight */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '45%',
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Clean Modern OP Mark with Star Beacon */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 1,
            fontWeight: 900,
            fontSize: currentSize.font,
            letterSpacing: '-0.5px',
            color: '#FFFFFF',
            textShadow: '0 1px 3px rgba(0, 0, 0, 0.35)',
          }}
        >
          <span>OP</span>
          <span
            style={{
              position: 'absolute',
              top: '-2px',
              right: '-4px',
              width: `${currentSize.star}px`,
              height: `${currentSize.star}px`,
              borderRadius: '50%',
              backgroundColor: '#38BDF8',
              boxShadow: '0 0 6px #38BDF8, 0 0 10px rgba(56, 189, 248, 0.8)',
            }}
          />
        </div>
      </div>
    </div>
  );
}
