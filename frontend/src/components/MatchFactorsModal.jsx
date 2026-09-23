import React from 'react';
import { X, CheckCircle, AlertTriangle, Info, ArrowRight } from 'lucide-react';
import MatchScoreBadge from './MatchScoreBadge';
import { useUIStore } from '../store/useUIStore';

export default function MatchFactorsModal({ matchData, opportunityTitle, onClose, onExploreGaps }) {
  const { navigate } = useUIStore();
  if (!matchData) return null;

  const { overallScore, breakdown, matchedSkills = [], missingSkills = [] } = matchData;

  const factors = [
    { key: 'skillMatch', name: 'Skill Match', weight: 40, data: breakdown?.skillMatch },
    { key: 'qualification', name: 'Academic Qualification', weight: 20, data: breakdown?.qualification },
    { key: 'location', name: 'Location & Work Mode', weight: 20, data: breakdown?.location },
    { key: 'interest', name: 'Industry & Domain Interest', weight: 10, data: breakdown?.interest },
    { key: 'experience', name: 'Experience & Practical Background', weight: 10, data: breakdown?.experience },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.5)',
        backdropFilter: 'blur(4px)',
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
          boxShadow: 'var(--shadow-lg)',
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
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--secondary-navy)' }}>
              Explainable Match Breakdown
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--secondary-text)' }}>
              Computed algorithmically across 5 core dimensions for{' '}
              <strong style={{ color: 'var(--primary-text)' }}>{opportunityTitle}</strong>
            </p>
          </div>
        </div>

        {/* Factors Breakdown Bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
          {factors.map((f) => {
            const score = f.data?.score || 0;
            const contrib = f.data?.contribution || 0;
            const details = f.data?.details || '';

            return (
              <div
                key={f.key}
                style={{
                  padding: '12px 16px',
                  backgroundColor: '#F8FAFC',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--primary-text)' }}>{f.name}</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--secondary-text)', backgroundColor: '#E2E8F0', padding: '1px 6px', borderRadius: '4px' }}>
                      Weight: {f.weight}%
                    </span>
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-blue)' }}>
                    +{contrib}% / {f.weight}%
                  </span>
                </div>

                {/* Progress bar */}
                <div style={{ height: '8px', backgroundColor: '#E2E8F0', borderRadius: '4px', overflow: 'hidden', marginBottom: '6px' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${score}%`,
                      backgroundColor: score >= 80 ? '#10B981' : score >= 50 ? '#F59E0B' : '#EF4444',
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
              padding: '12px',
              backgroundColor: '#ECFDF5',
              borderRadius: 'var(--radius-md)',
              border: '1px solid #A7F3D0',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#047857', marginBottom: '8px' }}>
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
                <span style={{ fontSize: '0.8rem', color: '#065F46' }}>No direct skill overlaps yet</span>
              )}
            </div>
          </div>

          <div
            style={{
              padding: '12px',
              backgroundColor: '#FFF7ED',
              borderRadius: 'var(--radius-md)',
              border: '1px solid #FFEDD5',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#C2410C', marginBottom: '8px' }}>
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
                <span style={{ fontSize: '0.8rem', color: '#9A3412' }}>You have 100% of required skills!</span>
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
