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
  ShieldCheck,
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
  const isAdmin = user?.role === 'admin';
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
      <div className="opp-loading-box">
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
    <div className="opp-details-wrapper">
      {/* Top back button */}
      <BackButton label={isAdmin ? "Back to Command Center" : "Back to Opportunities"} fallbackPage={isAdmin ? "admin" : "opportunities"} />

      {/* 1. MATCH-FIRST HEADER CARD */}
      <div className="card card-featured opp-details-card">
        <div className="opp-header-left">
          <div className="opp-logo-avatar">
            {orgName.substring(0, 2).toUpperCase()}
          </div>

          <div>
            <div className="opp-title-badge-row">
              <h1 className="opp-title-text">
                {opp.title}
              </h1>
              <span className="badge badge-internship">{opp.type || 'Full-time'}</span>
            </div>
            <p className="opp-company-loc-sub">
              {orgName} • {locString}
            </p>
          </div>
        </div>

        {/* Right Match Indicator & Actions */}
        <div className="opp-header-actions-row">
          {isAdmin ? (
            <span className={`opp-admin-status-badge ${opp.status === 'Active' ? 'status-active' : 'status-inactive'}`}>
              <ShieldCheck size={14} /> STATUS: {opp.status?.toUpperCase() || 'ACTIVE'}
            </span>
          ) : matchScore !== null && matchScore !== undefined ? (
            <div
              onClick={() => navigate('match', { id: opp._id })}
              className="opp-match-btn-trigger"
              title="Click to view 5-factor mathematical breakdown"
            >
              <MatchScoreBadge score={matchScore} size={46} showLabel={false} />
              <div className="text-left">
                <span className="opp-match-btn-trigger-title">
                  VIEW BREAKDOWN
                </span>
                <span className="opp-match-btn-trigger-sub">
                  5-Factor Explainable
                </span>
              </div>
            </div>
          ) : null}

          {/* AI Career Mentor Trigger */}
          <button
            type="button"
            onClick={handleOpenMentor}
            className="opp-mentor-btn"
          >
            <Bot size={18} /> Ask AI Mentor
          </button>

          {!isAdmin && (
            <button
              onClick={() => toggleSaveOpportunity(opp._id)}
              className={`opp-save-btn ${isSaved ? 'is-saved' : ''}`}
              title="Save Opportunity"
            >
              <Bookmark size={20} fill={isSaved ? 'currentColor' : 'none'} />
            </button>
          )}

          {isAdmin ? (
            <button
              onClick={() => navigate('admin')}
              className="btn-primary opp-admin-btn"
            >
              <ShieldCheck size={16} /> Admin Command Center
            </button>
          ) : isApplied ? (
            <button disabled className="opp-applied-pill">
              <Check size={16} /> Applied
            </button>
          ) : (
            <button
              onClick={() => setShowApplyModal(true)}
              className="btn-primary opp-apply-btn"
            >
              Apply Now
            </button>
          )}
        </div>
      </div>

      {/* 2. Key Highlights Strip */}
      <div className="opp-highlights-grid">
        <div className="card opp-highlight-card">
          <IndianRupee size={22} color="#06B6D4" />
          <div>
            <span className="opp-highlight-label">STIPEND / SALARY</span>
            <strong className="opp-highlight-val">
              {opp.salary?.amount ? `${opp.salary.amount} / ${opp.salary.period || 'month'}` : 'Competitive'}
            </strong>
          </div>
        </div>

        <div className="card opp-highlight-card">
          <Calendar size={22} color="#7C3AED" />
          <div>
            <span className="opp-highlight-label">APPLICATION DEADLINE</span>
            <strong className="opp-highlight-val">
              {opp.deadline ? new Date(opp.deadline).toLocaleDateString() : 'Rolling Application'}
            </strong>
          </div>
        </div>

        <div className="card opp-highlight-card">
          <GraduationCap size={22} color="#EC4899" />
          <div>
            <span className="opp-highlight-label">ELIGIBILITY</span>
            <strong className="opp-highlight-val">
              {opp.qualification?.degree || 'Open to All Degrees'}
            </strong>
          </div>
        </div>

        <div className="card opp-highlight-card">
          <Briefcase size={22} color="#10B981" />
          <div>
            <span className="opp-highlight-label">EXPERIENCE</span>
            <strong className="opp-highlight-val">
              {opp.experienceRequired?.level || 'Fresher Friendly'}
            </strong>
          </div>
        </div>
      </div>

      {/* 3. Skill Alignment Banner */}
      <div className="card opp-skills-alignment-card">
        <div className="opp-skills-alignment-header">
          <div className="opp-skills-alignment-title-row">
            <Sparkles size={18} color="#7C3AED" />
            <h3 className="opp-skills-alignment-title">
              {isAdmin ? `Required Technical Competencies (${allRequiredSkills.length})` : 'Candidate Skill Alignment'}
            </h3>
          </div>
          <div className="opp-skills-actions-group">
            <button
              onClick={handleOpenMentor}
              className="btn-secondary opp-skills-mentor-btn"
            >
              <Sparkles size={13} /> AI Mentor Analysis
            </button>
            {!isAdmin && (
              <>
                <button
                  onClick={() => navigate('match', { id: opp._id })}
                  className="btn-secondary opp-skills-btn-sm"
                >
                  5-Factor Math
                </button>
                <button
                  onClick={() => navigate('skill-gap', { id: opp._id })}
                  className="btn-primary opp-skills-btn-primary-sm"
                >
                  Bridge Skill Gap <ArrowRight size={14} />
                </button>
              </>
            )}
          </div>
        </div>

        <div className="opp-skills-compare-grid">
          <div>
            <span className="opp-skills-matched-heading">
              Matched Skills ({matchedSkills.length})
            </span>
            <div className="opp-skills-chips-row">
              {matchedSkills.map((s, idx) => (
                <span key={idx} className="skill-chip skill-chip-matched">
                  {formatSkill(s)}
                </span>
              ))}
              {matchedSkills.length === 0 && (
                <span className="opp-skills-empty-matched">No direct skill overlaps</span>
              )}
            </div>
          </div>

          <div>
            <span className="opp-skills-missing-heading">
              Missing Skills to Learn ({missingSkills.length})
            </span>
            <div className="opp-skills-chips-row">
              {missingSkills.map((s, idx) => (
                <span key={idx} className="skill-chip skill-chip-missing">
                  {formatSkill(s)}
                </span>
              ))}
              {missingSkills.length === 0 && (
                <span className="opp-skills-all-matched">All required skills matched!</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Description, Responsibilities & Requirements */}
      <div className="card opp-content-card">
        <h3 className="opp-section-title-navy">
          About the Opportunity
        </h3>
        <p className="opp-desc-body">
          {opp.description}
        </p>

        {opp.responsibilities && opp.responsibilities.length > 0 && (
          <div className="opp-block-margin">
            <h4 className="opp-block-title">
              Core Responsibilities
            </h4>
            <ul className="opp-bullet-list">
              {opp.responsibilities.map((resp, idx) => (
                <li key={idx}>{resp}</li>
              ))}
            </ul>
          </div>
        )}

        {opp.requirements && opp.requirements.length > 0 && (
          <div>
            <h4 className="opp-block-title">
              Candidate Requirements
            </h4>
            <ul className="opp-bullet-list">
              {opp.requirements.map((req, idx) => (
                <li key={idx}>{req}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* APPLY MODAL */}
      {showApplyModal && (
        <div className="opp-modal-overlay">
          <div className="card card-featured animate-fade-in opp-apply-modal-card">
            <h3 className="opp-apply-modal-title">Submit Your Application</h3>
            <p className="opp-apply-modal-sub">
              Your profile details and verified skills will be automatically shared with {orgName}.
            </p>

            <div className="opp-apply-summary-box">
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

            <div className="opp-modal-btn-row">
              <button onClick={() => setShowApplyModal(false)} className="btn-secondary">
                Cancel
              </button>
              <button
                disabled={isApplying}
                onClick={handleConfirmApply}
                className="btn-primary"
              >
                <Send size={16} /> {isApplying ? 'Submitting...' : 'Confirm Application'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* APPLICATION SUCCESS MODAL */}
      {showSuccessModal && (
        <div className="opp-modal-overlay">
          <div className="card card-featured animate-fade-in opp-success-modal-card">
            <div className="opp-success-icon-wrap">
              <CheckCircle2 size={36} />
            </div>

            <h3 className="opp-success-title">
              Application Submitted!
            </h3>
            <p className="opp-success-body">
              Your application for <strong className="var-primary-text">{opp.title}</strong> has been logged with ID{' '}
              <code className="opp-success-code">
                #OP-{submittedAppId ? submittedAppId.slice(-6).toUpperCase() : 'CONFIRMED'}
              </code>. The employer has been notified.
            </p>

            <div className="opp-success-btn-row">
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