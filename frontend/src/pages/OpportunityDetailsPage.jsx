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
  Bot,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useOpportunityStore } from '../store/useOpportunityStore';
import { useApplicationStore } from '../store/useApplicationStore';
import { useAuthStore } from '../store/useAuthStore';
import { useUIStore } from '../store/useUIStore';
import MatchScoreBadge from '../components/MatchScoreBadge';
import BackButton from '../components/BackButton';

// Safe formatters to prevent React Error #31
const formatLocation = (loc) => {
  if (!loc) return 'Remote';
  if (typeof loc === 'string') return loc;
  if (typeof loc === 'object') {
    const parts = [loc.city, loc.state].filter(Boolean);
    if (parts.length > 0) return parts.join(', ');
    return loc.type || loc.country || 'Remote';
  }
  return 'Remote';
};

const formatOrganization = (org, company) => {
  const target = org || company;
  if (!target) return 'Partner Employer';
  if (typeof target === 'string') return target;
  if (typeof target === 'object') return target.name || 'Partner Employer';
  return 'Partner Employer';
};

const formatSkill = (skill) => {
  if (!skill) return '';
  if (typeof skill === 'string') return skill;
  if (typeof skill === 'object') return skill.name || skill.title || '';
  return String(skill);
};

export default function OpportunityDetailsPage({ opportunityId }) {
  const { fetchOpportunityById, toggleSaveOpportunity, savedIds } = useOpportunityStore();
  const { apply, applications, fetchMyApplications } = useApplicationStore();
  const { user, isAuthenticated } = useAuthStore();
  const { navigate, showToast, openMentorForOpportunity } = useUIStore();

  const [opp, setOpp] = useState(null);
  const [isApplying, setIsApplying] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [applicationNotes, setApplicationNotes] = useState('');
  const [submittedAppId, setSubmittedAppId] = useState('');

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
      <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--secondary-text)' }}>
        <p>Loading opportunity details...</p>
      </div>
    );
  }

  const isSaved = Array.isArray(savedIds) && savedIds.includes(opp._id);
  const isApplied = Array.isArray(applications) && applications.some(
    (a) => (a.opportunity?._id || a.opportunity) === opp._id
  );

  const orgName = formatOrganization(opp.organization, opp.company);
  const locString = formatLocation(opp.location);
  const matchDetails = opp.matchDetails;
  const matchScore = matchDetails?.overallScore ?? opp.matchScore;
  const matchedSkills = Array.isArray(matchDetails?.matchedSkills) ? matchDetails.matchedSkills : [];
  const missingSkills = Array.isArray(matchDetails?.missingSkills) ? matchDetails.missingSkills : [];
  const allRequiredSkills = opp.requiredSkills || opp.skills || [];

  const handleOpenMentor = () => {
    openMentorForOpportunity({
      id: opp._id,
      title: opp.title,
      company: orgName,
      requiredSkills: Array.isArray(allRequiredSkills) ? allRequiredSkills.map(formatSkill) : [],
      matchScore: matchScore ?? 75,
    });
  };

  const handleConfirmApply = async () => {
    setIsApplying(true);
    const res = await apply(opp._id, applicationNotes);
    setIsApplying(false);
    setShowApplyModal(false);

    if (res.success) {
      if (res.application?._id) {
        setSubmittedAppId(res.application._id);
      }
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
      <BackButton label="Back to Opportunities" fallbackPage="opportunities" />

      {/* 1. MATCH-FIRST HEADER CARD */}
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
            {orgName.substring(0, 2).toUpperCase()}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary-text)', margin: 0 }}>
                {opp.title}
              </h1>
              <span className="badge badge-internship">{opp.type || 'Full-time'}</span>
            </div>
            <p style={{ fontSize: '1rem', color: 'var(--secondary-text)', marginTop: '6px', margin: '6px 0 0 0' }}>
              {orgName} • {locString}
            </p>
          </div>
        </div>

        {/* Right Match Indicator & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
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

          {/* AI Career Mentor Trigger */}
          <button
            type="button"
            onClick={handleOpenMentor}
            style={{
              padding: '10px 16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(59, 130, 246, 0.4)',
              backgroundColor: 'rgba(59, 130, 246, 0.12)',
              color: '#60A5FA',
              fontWeight: 600,
              fontSize: '0.85rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <Bot size={18} /> Ask AI Mentor
          </button>

          <button
            onClick={() => toggleSaveOpportunity(opp._id)}
            style={{
              padding: '10px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              color: isSaved ? '#EC4899' : 'var(--secondary-text)',
              backgroundColor: 'var(--chip-bg)',
              backdropFilter: 'blur(8px)',
              cursor: 'pointer',
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

      {/* 2. Key Highlights Strip */}
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
              {opp.salary?.amount ? `${opp.salary.amount} / ${opp.salary.period || 'month'}` : 'Competitive'}
            </strong>
          </div>
        </div>

        <div className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Calendar size={22} color="#7C3AED" />
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--secondary-text)' }}>APPLICATION DEADLINE</span>
            <strong style={{ fontSize: '0.95rem', display: 'block', color: 'var(--primary-text)' }}>
              {opp.deadline ? new Date(opp.deadline).toLocaleDateString() : 'Rolling Application'}
            </strong>
          </div>
        </div>

        <div className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <GraduationCap size={22} color="#EC4899" />
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--secondary-text)' }}>ELIGIBILITY</span>
            <strong style={{ fontSize: '0.95rem', display: 'block', color: 'var(--primary-text)' }}>
              {opp.qualification?.degree || 'Open to All Degrees'}
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

      {/* 3. Skill Alignment Banner */}
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
            <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-text)', margin: 0 }}>Candidate Skill Alignment</h3>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={handleOpenMentor}
              className="btn-secondary"
              style={{
                padding: '6px 14px',
                fontSize: '0.775rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: '#60A5FA',
                borderColor: 'rgba(59, 130, 246, 0.4)',
              }}
            >
              <Sparkles size={13} /> AI Gap Analysis
            </button>
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

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#34D399', display: 'block', marginBottom: '8px' }}>
              Matched Skills ({matchedSkills.length})
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {matchedSkills.map((s, idx) => (
                <span key={idx} className="skill-chip skill-chip-matched">
                  {formatSkill(s)}
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
                  {formatSkill(s)}
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
              Your profile details and verified skills will be automatically shared with {orgName}.
            </p>

            <div style={{ padding: '14px', backgroundColor: 'var(--box-subtle)', border: '1px solid var(--box-subtle-border)', borderRadius: '10px', marginBottom: '16px', fontSize: '0.85rem', color: 'var(--primary-text)' }}>
              <strong>Applicant: </strong> {user?.name || 'Applicant'} ({user?.email || 'No email specified'})<br />
              <strong>Education: </strong> {user?.education?.degree ? `${user.education.degree}${user.education.fieldOfStudy ? ` in ${user.education.fieldOfStudy}` : ''}` : 'Education not specified'} • {user?.location?.city || 'Location not specified'}
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

      {/* APPLICATION SUCCESS MODAL */}
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
                #OP-{submittedAppId ? submittedAppId.slice(-6).toUpperCase() : 'CONFIRMED'}
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