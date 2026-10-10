import React from 'react';
import { X, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import MatchScoreBadge from './MatchScoreBadge';
import { useUIStore } from '../store/useUIStore';

export default function MatchFactorsModal({ matchData, opportunityTitle, onClose, onExploreGaps }) {
  const { navigate } = useUIStore();
  if (!matchData) return null;

  const { overallScore, breakdown, matchedSkills = [], missingSkills = [] } = matchData;

  const factors = [
    { key: 'skillMatch', name: 'Skill Match', weight: 40, data: breakdown?.skillMatch, barClass: 'bar-skillMatch' },
    { key: 'qualification', name: 'Academic Qualification', weight: 20, data: breakdown?.qualification, barClass: 'bar-qualification' },
    { key: 'location', name: 'Location & Work Mode', weight: 20, data: breakdown?.location, barClass: 'bar-location' },
    { key: 'interest', name: 'Industry & Domain Interest', weight: 10, data: breakdown?.interest, barClass: 'bar-interest' },
    { key: 'experience', name: 'Experience & Practical Background', weight: 10, data: breakdown?.experience, barClass: 'bar-experience' },
  ];

  return (
    <div className="candidate-modal-overlay">
      <div className="card animate-fade-in match-modal-card">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="modal-close-btn"
          aria-label="Close match breakdown"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="match-modal-header">
          <MatchScoreBadge score={overallScore} size={64} strokeWidth={5} showLabel={false} />
          <div>
            <h3 className="match-modal-title">
              Explainable Match Breakdown
            </h3>
            <p className="candidate-bg-desc">
              Computed algorithmically across 5 core dimensions for{' '}
              <strong>{opportunityTitle}</strong>
            </p>
          </div>
        </div>

        {/* Factors Breakdown Bars */}
        <div className="match-factors-list">
          {factors.map((f) => {
            const score = f.data?.score || 0;
            const contrib = f.data?.contribution || 0;
            const details = f.data?.details || '';

            return (
              <div key={f.key} className="match-factor-item">
                <div className="match-factor-item-header">
                  <div className="candidate-card-title-row">
                    <strong className="match-factor-name">{f.name}</strong>
                    <span className="match-factor-weight-pill">
                      Weight: {f.weight}%
                    </span>
                  </div>
                  <span className="match-factor-contrib">
                    +{contrib}% / {f.weight}%
                  </span>
                </div>

                {/* Progress bar with dynamic percentage width */}
                <div className="match-factor-track">
                  <div
                    className={`match-factor-bar ${f.barClass}`}
                    style={{ width: `${score}%` }}
                  />
                </div>

                <p className="match-factor-details">{details}</p>
              </div>
            );
          })}
        </div>

        {/* Skills Matched vs Missing */}
        <div className="match-skills-grid">
          <div className="match-skills-box matched">
            <div className="match-skills-box-header matched">
              <CheckCircle size={16} />
              <strong className="match-factor-details">Matched Skills ({matchedSkills.length})</strong>
            </div>
            <div className="match-skills-list">
              {matchedSkills.map((s, idx) => (
                <span key={idx} className="skill-chip skill-chip-matched">
                  {s.name || s}
                </span>
              ))}
              {matchedSkills.length === 0 && (
                <span className="candidate-bg-desc">No direct skill overlaps yet</span>
              )}
            </div>
          </div>

          <div className="match-skills-box missing">
            <div className="match-skills-box-header missing">
              <AlertTriangle size={16} />
              <strong className="match-factor-details">Missing Skills ({missingSkills.length})</strong>
            </div>
            <div className="match-skills-list">
              {missingSkills.map((s, idx) => (
                <span key={idx} className="skill-chip skill-chip-missing">
                  {s.name || s}
                </span>
              ))}
              {missingSkills.length === 0 && (
                <span className="candidate-bg-desc">You have 100% of required skills!</span>
              )}
            </div>
          </div>
        </div>

        {/* Modal CTAs */}
        <div className="candidate-modal-actions">
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
