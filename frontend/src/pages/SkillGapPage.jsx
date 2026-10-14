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
import { useAuthStore } from '../store/useAuthStore';
import { useOpportunityStore } from '../store/useOpportunityStore';
import api from '../utils/api';
import CyberLoader from '../components/CyberLoader';
import Tilt3DCard from '../components/Tilt3DCard';
import BackButton from '../components/BackButton';

export default function SkillGapPage({ opportunityId }) {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';
  const { navigate } = useUIStore();
  const { opportunities } = useOpportunityStore();

  const [gapData, setGapData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [targetId, setTargetId] = useState(opportunityId || opportunities[0]?._id || null);

  useEffect(() => {
    if (opportunityId) {
      setTargetId(opportunityId);
    } else if (opportunities.length > 0) {
      setTargetId(opportunities[0]._id);
    } else {
      api
        .get('/opportunities?limit=1')
        .then((res) => {
          if (res.data?.opportunities?.[0]?._id) {
            setTargetId(res.data.opportunities[0]._id);
          } else {
            setIsLoading(false);
          }
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  }, [opportunityId, opportunities]);

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

  if (isLoading) {
    return <CyberLoader message="Auditing Skill Competencies & Curating Roadmaps..." />;
  }

  if (!gapData) {
    return (
      <div className="card dashboard-empty-state">
        <AlertTriangle size={48} color="#F59E0B" className="dashboard-empty-icon" />
        <h2 className="dashboard-empty-title">No Opportunity Selected</h2>
        <p className="dashboard-empty-sub">
          Please select an opportunity from the dashboard or listings to analyze your personalized skill gap readiness.
        </p>
        <button onClick={() => navigate('opportunities')} className="btn-primary">
          Browse Opportunities
        </button>
      </div>
    );
  }

  const { opportunityTitle, organization, readinessPercentage, matchedSkills, missingSkills, recommendationNote } =
    gapData;

  return (
    <div className="dashboard-container">
      <BackButton
        label={isAdmin ? "Back to Admin Command" : "Back to Opportunity"}
        fallbackPage={isAdmin ? "admin" : "details"}
        fallbackParams={isAdmin ? {} : { id: targetId }}
      />

      {/* Header Banner */}
      <div className="card card-featured dashboard-header-banner">
        <div>
          <span className="header-category-pill">
            SKILL GAP ANALYSIS
          </span>
          <h1 className="header-title-main">
            Target Skill Readiness
          </h1>
          <p className="header-sub-text">
            For <strong>{opportunityTitle}</strong> at {organization}
          </p>
          <p className="candidate-modal-bio">
            {recommendationNote}
          </p>
        </div>

        {/* Readiness Meter with 3D Tilt */}
        <Tilt3DCard className="readiness-meter-card">
          <span className="kpi-label">
            ROLE SKILL READINESS
          </span>
          <h2 className="readiness-percentage-value">
            {readinessPercentage}%
          </h2>
          <span className="readiness-matched-label">
            {matchedSkills.length} of {matchedSkills.length + missingSkills.length} Required Skills
          </span>
        </Tilt3DCard>
      </div>

      {/* Matched Skills Section */}
      <div className="dashboard-section-wrap">
        <div className="candidate-card-title-row mb-14">
          <CheckCircle2 size={20} color="#34D399" />
          <h3 className="dashboard-section-title">
            Verified In Your Profile ({matchedSkills.length})
          </h3>
        </div>

        <div className="skillgap-verified-grid">
          {matchedSkills.map((s, idx) => (
            <div key={idx} className="card skillgap-verified-card">
              <div className="candidate-card-title-row space-between mb-4">
                <strong className="skillgap-skill-name">{s.name}</strong>
                <span className="skillgap-badge-green">
                  {s.category || 'Skill'}
                </span>
              </div>
              <p className="candidate-bg-desc">
                Proficiency verified. Contributes to your 40% skill factor.
              </p>
            </div>
          ))}
          {matchedSkills.length === 0 && (
            <p className="candidate-bg-desc">No skills currently matched.</p>
          )}
        </div>
      </div>

      {/* Missing Skills Section with Direct Action Learning CTAs */}
      <div>
        <div className="candidate-card-title-row mb-14">
          <AlertTriangle size={20} color="#FBBF24" />
          <h3 className="dashboard-section-title">
            Missing Competencies to Bridge ({missingSkills.length})
          </h3>
        </div>

        <div className="skillgap-missing-grid">
          {missingSkills.map((s, idx) => (
            <Tilt3DCard
              key={idx}
              className="card skillgap-missing-card"
              maxTilt={6}
            >
              <div>
                <div className="candidate-card-title-row space-between mb-8">
                  <strong className="candidate-card-title">{s.name}</strong>
                  <span
                    className={`skillgap-priority-pill ${s.priority === 'High Priority' ? 'high' : 'medium'}`}
                  >
                    {s.priority}
                  </span>
                </div>
                <p className="candidate-bg-desc mb-14">
                  Adding competency in {s.name} directly improves your score and suitability.
                </p>
              </div>

              <button
                onClick={() => navigate('learning', { skillId: s._id, skillName: s.name })}
                className="btn-primary skillgap-roadmap-btn"
              >
                <BookOpen size={14} /> View Learning Roadmap <ArrowRight size={14} />
              </button>
            </Tilt3DCard>
          ))}
          {missingSkills.length === 0 && (
            <div className="card skillgap-all-matched-banner">
              <p className="text-emerald-semibold">
                Awesome! You have all the required skills for this position.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
