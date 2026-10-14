import React from 'react';
import { Bookmark, MapPin, IndianRupee, Calendar, Briefcase, ChevronRight, Check } from 'lucide-react';
import MatchScoreBadge from './MatchScoreBadge';
import Tilt3DCard from './Tilt3DCard';
import { useOpportunityStore } from '../store/useOpportunityStore';
import { useUIStore } from '../store/useUIStore';

export default function OpportunityCard({ opportunity, onApply, isApplied = false }) {
  const { savedIds, toggleSaveOpportunity } = useOpportunityStore();
  const { navigate } = useUIStore();

  const isSaved = savedIds.includes(opportunity._id);

  // Remaining days calculation
  const deadlineDate = new Date(opportunity.deadline);
  const diffDays = Math.ceil((deadlineDate - new Date()) / (1000 * 60 * 60 * 24));
  const deadlineText = diffDays > 0 ? `${diffDays} days left` : 'Closes today';

  const typeClass =
    opportunity.type === 'Internship'
      ? 'badge-internship'
      : opportunity.type === 'Apprenticeship'
      ? 'badge-apprenticeship'
      : 'badge-entry';

  const locClass =
    opportunity.location?.type === 'Remote'
      ? 'badge-remote'
      : opportunity.location?.type === 'Hybrid'
      ? 'badge-hybrid'
      : 'badge-onsite';

  return (
    <Tilt3DCard
      className="card card-opp-tilt"
      maxTilt={6}
      scale={1.015}
    >
      <div>
        {/* Top Header: Logo, Company/Title, Match Badge & Bookmark */}
        <div className="card-opp-header">
          <div className="profile-header-user">
            <div className="card-opp-company-logo">
              {opportunity.organizationLogo ? (
                <img
                  src={opportunity.organizationLogo}
                  alt={opportunity.organization}
                  className="card-opp-logo-img"
                />
              ) : (
                (opportunity.organization || 'OP').substring(0, 2).toUpperCase()
              )}
            </div>
            <div>
              <h3
                className="card-opp-title"
                onClick={() => navigate('details', { id: opportunity._id })}
              >
                {opportunity.title}
              </h3>
              <p className="card-opp-org">
                {opportunity.organization}
              </p>
            </div>
          </div>

          <div className="card-opp-header-right">
            {opportunity.matchScore !== null && opportunity.matchScore !== undefined && (
              <MatchScoreBadge score={opportunity.matchScore} size={42} showLabel={false} />
            )}
            <button
              onClick={() => toggleSaveOpportunity(opportunity._id)}
              title={isSaved ? 'Remove Bookmark' : 'Save Opportunity'}
              className={`card-opp-bookmark-btn ${isSaved ? 'saved' : ''}`}
            >
              <Bookmark size={20} fill={isSaved ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>

        {/* Badges: Type & Location */}
        <div className="card-opp-badges-row">
          <span className={`badge ${typeClass}`}>
            <Briefcase size={12} /> {opportunity.type}
          </span>
          <span className={`badge ${locClass}`}>
            <MapPin size={12} /> {opportunity.location?.type} {opportunity.location?.city ? `• ${opportunity.location.city}` : ''}
          </span>
          {opportunity.salary && (
            <span className="card-opp-salary-badge">
              <IndianRupee size={12} /> {opportunity.salary.amount} / {opportunity.salary.period}
            </span>
          )}
        </div>

        {/* Description brief */}
        <p className="card-opp-desc">
          {opportunity.description}
        </p>

        {/* Skills required tags */}
        <div className="card-opp-skills-row">
          {(opportunity.requiredSkills || []).slice(0, 4).map((skill, idx) => (
            <span
              key={idx}
              className="card-opp-skill-chip"
            >
              {skill.name || skill}
            </span>
          ))}
          {(opportunity.requiredSkills || []).length > 4 && (
            <span className="card-opp-more-skills">
              +{opportunity.requiredSkills.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Card Footer: Deadline & Action Buttons */}
      <div className="card-opp-footer">
        <span className="card-opp-deadline">
          <Calendar size={13} /> {deadlineText}
        </span>

        <div className="card-opp-btn-group">
          <button
            onClick={() => navigate('details', { id: opportunity._id })}
            className="btn-secondary card-opp-btn-details"
          >
            Details <ChevronRight size={14} />
          </button>
          {isApplied ? (
            <button
              disabled
              className="card-opp-applied-btn"
            >
              <Check size={14} /> Applied
            </button>
          ) : (
            <button
              onClick={() => onApply ? onApply(opportunity) : navigate('details', { id: opportunity._id })}
              className="btn-primary card-opp-btn-apply"
            >
              Apply <ChevronRight size={14} />
            </button>
          )}
        </div>
      </div>
    </Tilt3DCard>
  );
}
