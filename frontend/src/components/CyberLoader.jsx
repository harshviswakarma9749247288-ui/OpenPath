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
    <div className={`cyber-loader-container ${fullScreen ? 'fullscreen' : ''}`}>
      {/* 3D Rotating Logo Centerpiece */}
      <div className="cyber-loader-logo-wrap">
        {/* Outer Pulsing Glow Aura */}
        <div className="anim-pulse-glow cyber-loader-aura" />
        <AnimatedLogo size="lg" interactive={false} showRings={true} />
      </div>

      {/* Cyber Status Text with Kinetic Fade */}
      <div className="cyber-loader-content">
        <div className="cyber-loader-status-pill">
          <span className="cyber-loader-status-dot" />
          <span className="cyber-loader-status-label">
            AI MATCHING ENGINE ACTIVE
          </span>
        </div>

        <p key={displayMessage} className="animate-fade-in cyber-loader-message">
          {displayMessage}
        </p>

        {/* High-Tech Shimmering Progress Bar */}
        <div className="cyber-loader-stream-track">
          <div className="anim-progress-stream cyber-loader-stream-bar" />
        </div>
      </div>
    </div>
  );
}
