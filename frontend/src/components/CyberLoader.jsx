import React, { useEffect, useState } from 'react';
import AnimatedLogo from './AnimatedLogo';

export default function CyberLoader({ message, fullScreen = false }) {
  const [msgIndex, setMsgIndex] = useState(0);

  const messages = [
    'Calibrating 5-Factor Algorithmic Weights...',
    'Synthesizing Skill Alignment Graph (40% Weight)...',
    'Auditing Verified Credentials & Education...',
    'Rendering Transparent Career Pathway...',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % messages.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  const displayMessage = message || messages[msgIndex];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: fullScreen ? '100vh' : '280px',
        width: '100%',
        padding: '40px 20px',
        position: fullScreen ? 'fixed' : 'relative',
        inset: fullScreen ? 0 : 'auto',
        backgroundColor: fullScreen ? 'var(--background)' : 'transparent',
        zIndex: fullScreen ? 9999 : 1,
        backdropFilter: fullScreen ? 'blur(20px)' : 'none',
      }}
    >
      {/* 3D Rotating Logo Centerpiece */}
      <div style={{ position: 'relative', marginBottom: '28px' }}>
        {/* Outer Pulsing Glow Aura */}
        <div
          className="anim-pulse-glow"
          style={{
            position: 'absolute',
            inset: '-20px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.35) 0%, rgba(236, 72, 153, 0.15) 50%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <AnimatedLogo size="lg" interactive={false} showRings={true} />
      </div>

      {/* Cyber Status Text with Kinetic Fade */}
      <div style={{ textAlign: 'center', maxWidth: '460px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 14px',
            borderRadius: '9999px',
            backgroundColor: 'rgba(124, 58, 237, 0.15)',
            border: '1px solid rgba(168, 85, 247, 0.35)',
            marginBottom: '12px',
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#34D399',
              boxShadow: '0 0 8px #34D399',
            }}
          />
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#C084FC',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            AI MATCHING ENGINE ACTIVE
          </span>
        </div>

        <p
          key={displayMessage}
          className="animate-fade-in"
          style={{
            fontSize: '0.95rem',
            color: 'var(--primary-text)',
            fontWeight: 600,
            letterSpacing: '-0.2px',
            minHeight: '24px',
          }}
        >
          {displayMessage}
        </p>

        {/* High-Tech Shimmering Progress Bar */}
        <div
          style={{
            width: '240px',
            height: '4px',
            backgroundColor: 'var(--box-subtle)',
            borderRadius: '9999px',
            overflow: 'hidden',
            margin: '16px auto 0 auto',
            position: 'relative',
          }}
        >
          <div
            className="anim-progress-stream"
            style={{
              position: 'absolute',
              height: '100%',
              width: '40%',
              background: 'linear-gradient(90deg, transparent, #7C3AED, #EC4899, #06B6D4, transparent)',
              borderRadius: '9999px',
            }}
          />
        </div>
      </div>
    </div>
  );
}
