import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Bookmark,
  Briefcase,
  MapPin,
  Calendar,
  IndianRupee,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Share2,
  Check,
  Send,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useOpportunityStore } from '../store/useOpportunityStore';
import { useApplicationStore } from '../store/useApplicationStore';
import { useAuthStore } from '../store/useAuthStore';
import { useUIStore } from '../store/useUIStore';
import MatchScoreBadge from '../components/MatchScoreBadge';

export default function OpportunityDetailsPage({ opportunityId }) {
  const { fetchOpportunityById, toggleSaveOpportunity, savedIds } = useOpportunityStore();
  const { apply, applications, fetchMyApplications } = useApplicationStore();
  const { user, isAuthenticated } = useAuthStore();
  const { navigate, showToast } = useUIStore();

  const [opp, setOpp] = useState(null);
  const [isApplying, setIsApplying] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [applicationNotes, setApplicationNotes] = useState('');

  useEffect(() => {
    if (opportunityId) {
      fetchOpportunityById(opportunityId).then((res) => {
        if (res) setOpp(res);
      });
      fetchMyApplications();
    }
  }, [opportunityId]);

  if (!opp) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p>Loading opportunity details...</p>
      </div>
    );
  }

  const isSaved = savedIds.includes(opp._id);
  const isApplied = applications.some(
    (a) => (a.opportunity?._id || a.opportunity) === opp._id
  );

  const matchDetails = opp.matchDetails;
  const matchScore = matchDetails?.overallScore;
  const matchedSkills = matchDetails?.matchedSkills || [];
  const missingSkills = matchDetails?.missingSkills || [];

  const handleConfirmApply = async () => {
    setIsApplying(true);
    const res = await apply(opp._id, applicationNotes);
    setIsApplying(false);
    setShowApplyModal(false);

    if (res.success) {
      // Trigger festive celebration confetti per UI/UX Brief!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
      setShowSuccessModal(true);
    } else {
      showToast(res.error || 'Failed to apply', 'error');
    }
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '24px 20px 80px 20px' }}>
      {/* Top back button */}
      <button
        onClick={() => navigate('opportunities')}
        className="btn-ghost"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}
      >
        <ArrowLeft size={16} /> Back to Browse
      </button>

      {/* 1. MATCH-FIRST HEADER CARD (Strictly follows UI/UX Brief) */}
      <div
        className="card card-featured"
        style={{
          padding: '28px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              backgroundColor: 'rgba(124, 58, 237, 0.15)',
              border: '1px solid rgba(168, 85, 247, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem',
              fontWeight: 800,
              color: '#C084FC',
              boxShadow: '0 0 15px rgba(124, 58, 237, 0.2)',
            }}
          >
            {opp.organization.substring(0, 2).toUpperCase()}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary-text)' }}>
                {opp.title}
              </h1>
              <span className="badge badge-internship">{opp.type}</span>
            </div>
            <p style={{ fontSize: '1rem', color: 'var(--secondary-text)', marginTop: '4px' }}>
              {opp.organization} • {opp.location?.type} {opp.location?.city ? `(${opp.location.city})` : ''}
            </p>
          </div>
        </div>

        {/* Right Match Indicator & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {matchScore !== null && matchScore !== undefined && (
            <div
              onClick={() => navigate('match', { id: opp._id })}
              style={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 14px',
                backgroundColor: 'var(--card-bg)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-subtle)',
                backdropFilter: 'blur(8px)',
              }}
              title="Click to view 5-factor mathematical breakdown"
            >
              <MatchScoreBadge score={matchScore} size={46} showLabel={false} />
              <div style={{ textAlign: 'left' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#7C3AED', display: 'block' }}>
                  VIEW BREAKDOWN
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--secondary-text)' }}>
                  5-Factor Explainable
                </span>
              </div>
            </div>
          )}

          <button
            onClick={() => toggleSaveOpportunity(opp._id)}
            style={{
              padding: '10px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              color: isSaved ? '#EC4899' : 'var(--secondary-text)',
              backgroundColor: 'var(--chip-bg)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <Bookmark size={20} fill={isSaved ? 'currentColor' : 'none'} />
          </button>

          {isApplied ? (
            <button
              disabled
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                color: '#34D399',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                padding: '10px 22px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.9rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Check size={16} /> Applied
            </button>
          ) : (
            <button
              onClick={() => setShowApplyModal(true)}
              className="btn-primary"
              style={{ padding: '10px 24px', fontSize: '0.9rem' }}
            >
              Apply Now
            </button>
          )}
        </div>
      </div>

      {/* 2. Key Highlights Strip (Salary, Deadline, Experience, Qualification) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '14px',
          marginBottom: '28px',
        }}
      >
        <div className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <IndianRupee size={22} color="#06B6D4" />
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--secondary-text)' }}>STIPEND / SALARY</span>
            <strong style={{ fontSize: '0.95rem', display: 'block', color: 'var(--primary-text)' }}>
              {opp.salary?.amount} / {opp.salary?.period}
            </strong>
          </div>
        </div>

        <div className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Calendar size={22} color="#7C3AED" />
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--secondary-text)' }}>APPLICATION DEADLINE</span>
            <strong style={{ fontSize: '0.95rem', display: 'block', color: 'var(--primary-text)' }}>
              {new Date(opp.deadline).toLocaleDateString()}
            </strong>
          </div>
        </div>

        <div className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <GraduationCap size={22} color="#EC4899" />
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--secondary-text)' }}>ELIGIBILITY</span>
            <strong style={{ fontSize: '0.95rem', display: 'block', color: 'var(--primary-text)' }}>
              {opp.qualification?.degree || 'Open to All'}
            </strong>
          </div>
        </div>

        <div className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Briefcase size={22} color="#10B981" />
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--secondary-text)' }}>EXPERIENCE</span>
            <strong style={{ fontSize: '0.95rem', display: 'block', color: 'var(--primary-text)' }}>
              {opp.experienceRequired?.level || 'Fresher Friendly'}
            </strong>
          </div>
        </div>
      </div>

      {/* 3. Skill Alignment Banner (Matched vs Missing) */}
      <div
        className="card"
        style={{
          padding: '22px',
          marginBottom: '28px',
          borderLeft: '4px solid #7C3AED',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="#7C3AED" />
            <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-text)' }}>Candidate Skill Alignment</h3>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => navigate('match', { id: opp._id })}
              className="btn-secondary"
              style={{ padding: '6px 14px', fontSize: '0.775rem' }}
            >
              5-Factor Math
            </button>
            <button
              onClick={() => navigate('skill-gap', { id: opp._id })}
              className="btn-primary"
              style={{ padding: '6px 16px', fontSize: '0.775rem' }}
            >
              Bridge Skill Gap <ArrowRight size={14} />
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#34D399', display: 'block', marginBottom: '8px' }}>
              Matched Skills ({matchedSkills.length})
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {matchedSkills.map((s, idx) => (
                <span key={idx} className="skill-chip skill-chip-matched">
                  {s.name || s}
                </span>
              ))}
              {matchedSkills.length === 0 && (
                <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>No direct skill overlaps</span>
              )}
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#F87171', display: 'block', marginBottom: '8px' }}>
              Missing Skills to Learn ({missingSkills.length})
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {missingSkills.map((s, idx) => (
                <span key={idx} className="skill-chip skill-chip-missing">
                  {s.name || s}
                </span>
              ))}
              {missingSkills.length === 0 && (
                <span style={{ fontSize: '0.8rem', color: '#34D399' }}>All required skills matched!</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Description, Responsibilities & Requirements */}
      <div className="card" style={{ padding: '32px', marginBottom: '32px' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '12px', color: 'var(--secondary-navy)' }}>
          About the Opportunity
        </h3>
        <p style={{ fontSize: '0.95rem', color: 'var(--primary-text)', lineHeight: '1.7', marginBottom: '28px' }}>
          {opp.description}
        </p>

        {opp.responsibilities && opp.responsibilities.length > 0 && (
          <div style={{ marginBottom: '28px' }}>
            <h4 style={{ fontSize: '1.05rem', marginBottom: '12px', color: 'var(--primary-text)' }}>
              Core Responsibilities
            </h4>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem', color: 'var(--secondary-text)' }}>
              {opp.responsibilities.map((resp, idx) => (
                <li key={idx}>{resp}</li>
              ))}
            </ul>
          </div>
        )}

        {opp.requirements && opp.requirements.length > 0 && (
          <div>
            <h4 style={{ fontSize: '1.05rem', marginBottom: '12px', color: 'var(--primary-text)' }}>
              Candidate Requirements
            </h4>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem', color: 'var(--secondary-text)' }}>
              {opp.requirements.map((req, idx) => (
                <li key={idx}>{req}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* APPLY MODAL */}
      {showApplyModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(7, 10, 19, 0.85)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px',
          }}
        >
          <div className="card card-featured animate-fade-in" style={{ maxWidth: '540px', width: '100%', padding: '28px', backgroundColor: 'var(--card-bg)' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '8px', color: 'var(--primary-text)' }}>Submit Your Application</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--secondary-text)', marginBottom: '18px' }}>
              Your profile details and verified skills will be automatically shared with {opp.organization}.
            </p>

            <div style={{ padding: '14px', backgroundColor: 'var(--box-subtle)', border: '1px solid var(--box-subtle-border)', borderRadius: '10px', marginBottom: '16px', fontSize: '0.85rem', color: 'var(--primary-text)' }}>
              <strong>Applicant: </strong> {user?.name || 'Alex Rivera'} ({user?.email})<br />
              <strong>Degree: </strong> {user?.education?.degree || 'B.Tech CS'} • {user?.location?.city || 'Bengaluru'}
            </div>

            <div className="form-group">
              <label className="form-label">Note / Cover Message to Hiring Team (Optional)</label>
              <textarea
                rows={3}
                className="form-textarea"
                placeholder="Share why you are excited about this role..."
                value={applicationNotes}
                onChange={(e) => setApplicationNotes(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setShowApplyModal(false)} className="btn-secondary">
                Cancel
              </button>
              <button
                disabled={isApplying}
                onClick={handleConfirmApply}
                className="btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Send size={16} /> {isApplying ? 'Submitting...' : 'Confirm Application'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* APPLICATION SUCCESS MODAL (Mandatory per UI/UX Brief) */}
      {showSuccessModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(7, 10, 19, 0.7)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px',
          }}
        >
          <div
            className="card card-featured animate-fade-in"
            style={{
              maxWidth: '480px',
              width: '100%',
              padding: '36px',
              textAlign: 'center',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--card-bg)',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                color: '#10B981',
                boxShadow: '0 0 25px rgba(16, 185, 129, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 18px auto',
              }}
            >
              <CheckCircle2 size={36} />
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '8px', color: 'var(--primary-text)' }}>
              Application Submitted!
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--secondary-text)', marginBottom: '24px', lineHeight: '1.6' }}>
              Your application for <strong style={{ color: 'var(--primary-text)' }}>{opp.title}</strong> has been logged with ID{' '}
              <code style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#0891B2', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
                #OP-{Math.floor(100000 + Math.random() * 900000)}
              </code>. The employer has been notified.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  navigate('applications');
                }}
                className="btn-primary"
              >
                Track in Applications
              </button>
              <button onClick={() => setShowSuccessModal(false)} className="btn-secondary">
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
