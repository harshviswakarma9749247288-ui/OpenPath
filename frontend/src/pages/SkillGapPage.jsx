import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Target,
} from 'lucide-react';
import { useUIStore } from '../store/useUIStore';
import { useOpportunityStore } from '../store/useOpportunityStore';
import api from '../utils/api';
import CyberLoader from '../components/CyberLoader';
import Tilt3DCard from '../components/Tilt3DCard';

export default function SkillGapPage({ opportunityId }) {
  const { navigate } = useUIStore();
  const { opportunities } = useOpportunityStore();

  const [gapData, setGapData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const targetId = opportunityId || (opportunities[0]?._id);

  useEffect(() => {
    if (targetId) {
      setIsLoading(true);
      api
        .get(`/opportunities/${targetId}/skill-gap`)
        .then((res) => {
          setGapData(res.data.skillGap);
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  }, [targetId]);

  if (isLoading || !gapData) {
    return <CyberLoader message="Auditing Skill Competencies & Curating Roadmaps..." />;
  }

  const { opportunityTitle, organization, readinessPercentage, matchedSkills, missingSkills, recommendationNote } =
    gapData;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px 20px 80px 20px' }}>
      <button
        onClick={() => navigate('details', { id: targetId })}
        className="btn-ghost"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}
      >
        <ArrowLeft size={16} /> Back to Opportunity
      </button>

      {/* Header Banner */}
      <div
        className="card card-featured"
        style={{
          padding: '32px',
          marginBottom: '28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <div>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#C084FC',
              textTransform: 'uppercase',
              backgroundColor: 'rgba(168, 85, 247, 0.15)',
              border: '1px solid rgba(168, 85, 247, 0.35)',
              padding: '4px 12px',
              borderRadius: '9999px',
              letterSpacing: '0.05em',
            }}
          >
            SKILL GAP ANALYSIS
          </span>
          <h1 style={{ fontSize: '2rem', marginTop: '12px', color: 'var(--primary-text)' }}>
            Target Skill Readiness
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--secondary-text)', marginTop: '4px' }}>
            For <strong style={{ color: 'var(--primary-text)' }}>{opportunityTitle}</strong> at {organization}
          </p>
          <p style={{ fontSize: '0.9rem', color: 'var(--primary-text)', marginTop: '12px', maxWidth: '540px' }}>
            {recommendationNote}
          </p>
        </div>

        {/* Readiness Meter with 3D Tilt */}
        <Tilt3DCard
          style={{
            padding: '24px 28px',
            backgroundColor: 'var(--card-bg)',
            backdropFilter: 'blur(12px)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid rgba(168, 85, 247, 0.35)',
            boxShadow: '0 0 20px rgba(124, 58, 237, 0.2)',
            textAlign: 'center',
          }}
        >
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--secondary-text)' }}>
            ROLE SKILL READINESS
          </span>
          <h2 style={{ fontSize: '2.5rem', color: '#C084FC', fontWeight: 800, textShadow: '0 0 20px rgba(192, 132, 252, 0.4)' }}>
            {readinessPercentage}%
          </h2>
          <span style={{ fontSize: '0.8rem', color: '#34D399', fontWeight: 600 }}>
            {matchedSkills.length} of {matchedSkills.length + missingSkills.length} Required Skills
          </span>
        </Tilt3DCard>
      </div>

      {/* Matched Skills Section */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <CheckCircle2 size={20} color="#34D399" />
          <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-text)' }}>
            Verified In Your Profile ({matchedSkills.length})
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
          {matchedSkills.map((s, idx) => (
            <div
              key={idx}
              className="card"
              style={{
                padding: '16px',
                borderLeft: '4px solid #10B981',
                backgroundColor: 'var(--status-green-bg)',
                border: '1px solid var(--status-green-border)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <strong style={{ fontSize: '1rem', color: 'var(--status-green-text)' }}>{s.name}</strong>
                <span style={{ fontSize: '0.7rem', color: 'var(--status-green-text)', backgroundColor: 'var(--status-green-bg)', border: '1px solid var(--status-green-border)', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                  {s.category || 'Skill'}
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--secondary-text)' }}>
                Proficiency verified. Contributes to your 40% skill factor.
              </p>
            </div>
          ))}
          {matchedSkills.length === 0 && (
            <p style={{ color: 'var(--secondary-text)', fontSize: '0.85rem' }}>No skills currently matched.</p>
          )}
        </div>
      </div>

      {/* Missing Skills Section with Direct Action Learning CTAs */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <AlertTriangle size={20} color="#FBBF24" />
          <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-text)' }}>
            Missing Competencies to Bridge ({missingSkills.length})
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {missingSkills.map((s, idx) => (
            <Tilt3DCard
              key={idx}
              className="card"
              maxTilt={6}
              style={{
                padding: '18px',
                borderLeft: '4px solid #F43F5E',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <strong style={{ fontSize: '1rem', color: 'var(--primary-text)' }}>{s.name}</strong>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      color: s.priority === 'High Priority' ? '#FDA4AF' : '#FDE68A',
                      backgroundColor: s.priority === 'High Priority' ? 'rgba(244, 63, 94, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                      border: `1px solid ${s.priority === 'High Priority' ? 'rgba(244, 63, 94, 0.35)' : 'rgba(245, 158, 11, 0.35)'}`,
                      padding: '2px 8px',
                      borderRadius: '4px',
                    }}
                  >
                    {s.priority}
                  </span>
                </div>
                <p style={{ fontSize: '0.825rem', color: 'var(--secondary-text)', marginBottom: '14px' }}>
                  Adding competency in {s.name} directly improves your score and suitability.
                </p>
              </div>

              <button
                onClick={() => navigate('learning', { skillId: s._id, skillName: s.name })}
                className="btn-primary"
                style={{ padding: '8px 14px', fontSize: '0.8rem', width: '100%' }}
              >
                <BookOpen size={14} /> View Learning Roadmap <ArrowRight size={14} />
              </button>
            </Tilt3DCard>
          ))}
          {missingSkills.length === 0 && (
            <div className="card" style={{ padding: '24px', gridColumn: '1 / -1', backgroundColor: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.35)' }}>
              <p style={{ color: '#34D399', fontWeight: 600 }}>
                Awesome! You have all the required skills for this position.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
