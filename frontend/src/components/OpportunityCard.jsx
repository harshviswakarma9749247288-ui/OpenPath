import React from 'react';
import { Bookmark, MapPin, IndianRupee, Calendar, Briefcase, ChevronRight, Check } from 'lucide-react';
import MatchScoreBadge from './MatchScoreBadge';
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
    <div
      className="card"
      style={{
        padding: '22px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        height: '100%',
      }}
    >
      <div>
        {/* Top Header: Logo, Company/Title, Match Badge & Bookmark */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: 'rgba(124, 58, 237, 0.15)',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                color: '#C084FC',
                overflow: 'hidden',
                flexShrink: 0,
                boxShadow: '0 0 12px rgba(124, 58, 237, 0.2)',
              }}
            >
              {opportunity.organizationLogo ? (
                <img
                  src={opportunity.organizationLogo}
                  alt={opportunity.organization}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                opportunity.organization.substring(0, 2).toUpperCase()
              )}
            </div>
            <div>
              <h3
                style={{
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  color: 'var(--primary-text)',
                  cursor: 'pointer',
                  lineHeight: '1.3',
                }}
                onClick={() => navigate('details', { id: opportunity._id })}
              >
                {opportunity.title}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--secondary-text)', fontWeight: 500 }}>
                {opportunity.organization}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {opportunity.matchScore !== null && opportunity.matchScore !== undefined && (
              <MatchScoreBadge score={opportunity.matchScore} size={42} showLabel={false} />
            )}
            <button
              onClick={() => toggleSaveOpportunity(opportunity._id)}
              title={isSaved ? 'Remove Bookmark' : 'Save Opportunity'}
              style={{
                color: isSaved ? '#EC4899' : 'var(--secondary-text)',
                padding: '6px',
                borderRadius: '8px',
                transition: 'var(--transition-normal)',
              }}
            >
              <Bookmark size={20} fill={isSaved ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>

        {/* Badges: Type & Location */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
          <span className={`badge ${typeClass}`}>
            <Briefcase size={12} /> {opportunity.type}
          </span>
          <span className={`badge ${locClass}`}>
            <MapPin size={12} /> {opportunity.location?.type} {opportunity.location?.city ? `• ${opportunity.location.city}` : ''}
          </span>
          {opportunity.salary && (
            <span
              style={{
                backgroundColor: 'var(--chip-bg)',
                border: '1px solid var(--chip-border)',
                padding: '3px 10px',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                color: 'var(--primary-text)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontWeight: 600,
              }}
            >
              <IndianRupee size={12} /> {opportunity.salary.amount} / {opportunity.salary.period}
            </span>
          )}
        </div>

        {/* Description brief */}
        <p
          style={{
            fontSize: '0.85rem',
            color: 'var(--secondary-text)',
            marginBottom: '14px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {opportunity.description}
        </p>

        {/* Skills required tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
          {(opportunity.requiredSkills || []).slice(0, 4).map((skill, idx) => (
            <span
              key={idx}
              style={{
                fontSize: '0.75rem',
                padding: '3px 9px',
                backgroundColor: 'var(--chip-bg)',
                border: '1px solid var(--chip-border)',
                borderRadius: '9999px',
                color: 'var(--chip-text)',
                fontWeight: 500,
              }}
            >
              {skill.name || skill}
            </span>
          ))}
          {(opportunity.requiredSkills || []).length > 4 && (
            <span style={{ fontSize: '0.75rem', color: 'var(--secondary-text)', alignSelf: 'center' }}>
              +{opportunity.requiredSkills.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Card Footer: Deadline & Action Buttons */}
      <div
        style={{
          borderTop: '1px solid var(--border-color)',
          paddingTop: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ fontSize: '0.775rem', color: 'var(--secondary-text)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Calendar size={13} /> {deadlineText}
        </span>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => navigate('details', { id: opportunity._id })}
            className="btn-secondary"
            style={{ padding: '6px 14px', fontSize: '0.8rem' }}
          >
            Details <ChevronRight size={14} />
          </button>
          {isApplied ? (
            <button
              disabled
              style={{
                backgroundColor: 'var(--status-green-bg)',
                color: 'var(--status-green)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                padding: '6px 14px',
                borderRadius: '9999px',
                fontSize: '0.8rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Check size={14} /> Applied
            </button>
          ) : (
            <button
              onClick={() => onApply ? onApply(opportunity) : navigate('details', { id: opportunity._id })}
              className="btn-primary"
              style={{ padding: '6px 16px', fontSize: '0.8rem' }}
            >
              Apply
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
