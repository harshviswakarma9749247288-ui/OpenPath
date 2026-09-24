import React from 'react';
import { X, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import MatchScoreBadge from './MatchScoreBadge';
import { useUIStore } from '../store/useUIStore';

export default function MatchFactorsModal({ matchData, opportunityTitle, onClose, onExploreGaps }) {
  const { navigate } = useUIStore();
  if (!matchData) return null;

  const { overallScore, breakdown, matchedSkills = [], missingSkills = [] } = matchData;

  const factors = [
    { key: 'skillMatch', name: 'Skill Match', weight: 40, data: breakdown?.skillMatch, color: '#A855F7' },
    { key: 'qualification', name: 'Academic Qualification', weight: 20, data: breakdown?.qualification, color: '#10B981' },
    { key: 'location', name: 'Location & Work Mode', weight: 20, data: breakdown?.location, color: '#06B6D4' },
    { key: 'interest', name: 'Industry & Domain Interest', weight: 10, data: breakdown?.interest, color: '#EC4899' },
    { key: 'experience', name: 'Experience & Practical Background', weight: 10, data: breakdown?.experience, color: '#F59E0B' },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(3, 7, 18, 0.75)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '16px',
      }}
    >
      <div
        className="card animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '28px',
          position: 'relative',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'rgba(13, 18, 34, 0.95)',
          border: '1px solid rgba(168, 85, 247, 0.35)',
          boxShadow: 'var(--shadow-lg), 0 0 35px rgba(124, 58, 237, 0.3)',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '20px', right: '20px', color: '#94A3B8' }}
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
          <MatchScoreBadge score={overallScore} size={64} strokeWidth={5} showLabel={false} />
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFFFFF' }}>
              Explainable Match Breakdown
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--secondary-text)' }}>
              Computed algorithmically across 5 core dimensions for{' '}
              <strong style={{ color: '#F8FAFC' }}>{opportunityTitle}</strong>
            </p>
          </div>
        </div>

        {/* Factors Breakdown Bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          {factors.map((f) => {
            const score = f.data?.score || 0;
            const contrib = f.data?.contribution || 0;
            const details = f.data?.details || '';

            return (
              <div
                key={f.key}
                style={{
                  padding: '14px 18px',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <strong style={{ fontSize: '0.9rem', color: '#F8FAFC' }}>{f.name}</strong>
                    <span style={{ fontSize: '0.75rem', color: '#A78BFA', backgroundColor: 'rgba(124, 58, 237, 0.15)', padding: '1px 8px', borderRadius: '9999px', border: '1px solid rgba(124, 58, 237, 0.3)' }}>
                      Weight: {f.weight}%
                    </span>
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#C084FC' }}>
                    +{contrib}% / {f.weight}%
                  </span>
                </div>

                {/* Progress bar */}
                <div style={{ height: '7px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', overflow: 'hidden', marginBottom: '6px' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${score}%`,
                      background: `linear-gradient(90deg, ${f.color} 0%, #EC4899 100%)`,
                      boxShadow: `0 0 10px ${f.color}88`,
                      borderRadius: '4px',
                      transition: 'width 0.8s ease',
                    }}
                  />
                </div>

                <p style={{ fontSize: '0.775rem', color: 'var(--secondary-text)' }}>{details}</p>
              </div>
            );
          })}
        </div>

        {/* Skills Matched vs Missing */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '24px' }}>
          <div
            style={{
              padding: '14px',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34D399', marginBottom: '8px' }}>
              <CheckCircle size={16} />
              <strong style={{ fontSize: '0.85rem' }}>Matched Skills ({matchedSkills.length})</strong>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {matchedSkills.map((s, idx) => (
                <span key={idx} className="skill-chip skill-chip-matched">
                  {s.name || s}
                </span>
              ))}
              {matchedSkills.length === 0 && (
                <span style={{ fontSize: '0.8rem', color: '#6EE7B7' }}>No direct skill overlaps yet</span>
              )}
            </div>
          </div>

          <div
            style={{
              padding: '14px',
              backgroundColor: 'rgba(244, 63, 94, 0.1)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#FDA4AF', marginBottom: '8px' }}>
              <AlertTriangle size={16} />
              <strong style={{ fontSize: '0.85rem' }}>Missing Skills ({missingSkills.length})</strong>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {missingSkills.map((s, idx) => (
                <span key={idx} className="skill-chip skill-chip-missing">
                  {s.name || s}
                </span>
              ))}
              {missingSkills.length === 0 && (
                <span style={{ fontSize: '0.8rem', color: '#FDA4AF' }}>You have 100% of required skills!</span>
              )}
            </div>
          </div>
        </div>

        {/* Modal CTAs */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button onClick={onClose} className="btn-secondary">
            Close
          </button>
          {missingSkills.length > 0 && (
            <button
              onClick={() => {
                onClose();
                if (onExploreGaps) onExploreGaps();
                else navigate('learning');
              }}
              className="btn-primary"
            >
              Bridge Skill Gaps <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
