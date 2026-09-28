import React, { useState } from 'react';
import { Mail, GraduationCap, Briefcase, MapPin, FileText, X } from 'lucide-react';
import MatchScoreBadge from './MatchScoreBadge';
import ApplicationStatusBadge from './ApplicationStatusBadge';

export default function EmployerCandidateCard({ candidate, onStatusChange }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(candidate.status);
  const [showResumeModal, setShowResumeModal] = useState(false);

  const statuses = ['Applied', 'Reviewing', 'Shortlisted', 'Interview', 'Selected', 'Rejected'];

  const handleUpdate = async (newStatus) => {
    setIsUpdating(true);
    setSelectedStatus(newStatus);
    await onStatusChange(candidate.applicationId, newStatus);
    setIsUpdating(false);
  };

  const user = candidate.user || {};

  return (
    <div
      className="card"
      style={{
        padding: '24px',
        marginBottom: '18px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        border: '1px solid var(--border-color)',
      }}
    >
      {/* Top row: Avatar, Info, Match Score & Current Status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
          <img
            src={
              user.avatar ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'
            }
            alt={user.name}
            style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid rgba(255, 255, 255, 0.2)' }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary-text)' }}>
                {user.name || 'Candidate'}
              </h3>
              <ApplicationStatusBadge status={selectedStatus} />
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--secondary-text)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Mail size={14} /> {user.email || 'No email provided'}
              {user.location?.city && (
                <>
                  <span>•</span>
                  <MapPin size={14} /> {user.location.city}{user.location.state ? `, ${user.location.state}` : ''}
                </>
              )}
            </p>
          </div>
        </div>

        {/* Match Score Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#C084FC' }}>
              COMPUTED MATCH
            </span>
          </div>
          <MatchScoreBadge score={candidate.matchScore ?? 0} size={50} showLabel={false} />
        </div>
      </div>

      {/* Candidate Background: Education & Experience */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '12px',
          padding: '14px',
          backgroundColor: 'var(--box-subtle)',
          border: '1px solid var(--box-subtle-border)',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.85rem',
        }}
      >
        <div style={{ display: 'flex', gap: '8px' }}>
          <GraduationCap size={16} color="#7C3AED" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong style={{ color: 'var(--primary-text)' }}>
              {user.education?.degree || 'Education not specified'}
            </strong>
            <p style={{ color: 'var(--secondary-text)', fontSize: '0.8rem' }}>
              {user.education?.institution || 'Self-directed learning'}{user.education?.endYear ? ` • Class of ${user.education.endYear}` : ''}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <Briefcase size={16} color="#EC4899" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong style={{ color: 'var(--primary-text)' }}>
              {user.experience?.role || 'Projects / Fresher'}
            </strong>
            <p style={{ color: 'var(--secondary-text)', fontSize: '0.8rem' }}>
              {user.experience?.organization || 'Portfolio & Coursework'}
            </p>
          </div>
        </div>
      </div>

      {/* Matched vs Missing Skills */}
      <div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#34D399', alignSelf: 'center', marginRight: '4px' }}>
            Matched:
          </span>
          {(candidate.matchedSkills || []).map((s, idx) => (
            <span key={idx} className="skill-chip skill-chip-matched">
              {s.name || s}
            </span>
          ))}
          {(candidate.matchedSkills || []).length === 0 && (
            <span style={{ fontSize: '0.75rem', color: '#64748B' }}>None</span>
          )}
        </div>

        {(candidate.missingSkills || []).length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#F472B6', alignSelf: 'center', marginRight: '4px' }}>
              Missing:
            </span>
            {candidate.missingSkills.map((s, idx) => (
              <span key={idx} className="skill-chip skill-chip-missing">
                {s.name || s}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Action Bar: Resume + Status Change Pipeline */}
      <div
        style={{
          borderTop: '1px solid var(--border-color)',
          paddingTop: '14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        <button
          onClick={() => setShowResumeModal(true)}
          className="btn-secondary"
          style={{ padding: '6px 14px', fontSize: '0.8rem' }}
        >
          <FileText size={14} /> View Digital Resume
        </button>

        {/* Status Pipeline Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--secondary-text)', marginRight: '4px' }}>
            Move Stage:
          </span>
          {statuses.map((st) => (
            <button
              key={st}
              disabled={isUpdating || selectedStatus === st}
              onClick={() => handleUpdate(st)}
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: '8px',
                border: selectedStatus === st ? '1.5px solid #C026D3' : '1px solid var(--border-color)',
                backgroundColor: selectedStatus === st ? 'rgba(192, 38, 211, 0.2)' : 'var(--box-subtle)',
                color: selectedStatus === st ? '#C026D3' : 'var(--secondary-text)',
                boxShadow: selectedStatus === st ? '0 0 12px rgba(192, 38, 211, 0.25)' : 'none',
                cursor: selectedStatus === st ? 'default' : 'pointer',
              }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Candidate Digital Resume Modal */}
      {showResumeModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(3, 7, 18, 0.75)',
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
              maxWidth: '560px',
              width: '100%',
              padding: '28px',
              maxHeight: '90vh',
              overflowY: 'auto',
              backgroundColor: 'var(--card-bg)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={20} color="#C084FC" /> Digital Resume Profile
              </h3>
              <button
                type="button"
                onClick={() => setShowResumeModal(false)}
                className="btn-ghost"
                style={{ padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
              <img
                src={
                  user.avatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'
                }
                alt={user.name}
                style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary-text)' }}>{user.name || 'Candidate'}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--secondary-text)' }}>{user.email || 'N/A'}</p>
                <p style={{ fontSize: '0.825rem', color: 'var(--secondary-text)', marginTop: '2px' }}>
                  {user.location?.city ? `${user.location.city}${user.location.country ? `, ${user.location.country}` : ''}` : 'Location not specified'} • {user.location?.remotePreference || 'Remote'}
                </p>
              </div>
            </div>

            {user.bio && (
              <div style={{ marginBottom: '16px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--secondary-text)', textTransform: 'uppercase' }}>Professional Bio</span>
                <p style={{ fontSize: '0.875rem', color: 'var(--primary-text)', marginTop: '4px', lineHeight: '1.5' }}>{user.bio}</p>
              </div>
            )}

            <div style={{ marginBottom: '16px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--secondary-text)', textTransform: 'uppercase' }}>Academic Education</span>
              <div style={{ padding: '12px', backgroundColor: 'var(--box-subtle)', borderRadius: '8px', marginTop: '6px' }}>
                <strong style={{ fontSize: '0.9rem', color: 'var(--primary-text)' }}>
                  {user.education?.degree || 'Degree not specified'}
                </strong>
                <p style={{ fontSize: '0.825rem', color: 'var(--secondary-text)', marginTop: '2px' }}>
                  {user.education?.institution || 'Institution not specified'} {user.education?.fieldOfStudy ? `• ${user.education.fieldOfStudy}` : ''}
                </p>
                {user.education?.endYear && (
                  <p style={{ fontSize: '0.8rem', color: 'var(--secondary-text)', marginTop: '2px' }}>
                    Graduation Year: {user.education.endYear}
                  </p>
                )}
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--secondary-text)', textTransform: 'uppercase' }}>Experience & Projects</span>
              <div style={{ padding: '12px', backgroundColor: 'var(--box-subtle)', borderRadius: '8px', marginTop: '6px' }}>
                <strong style={{ fontSize: '0.9rem', color: 'var(--primary-text)' }}>
                  {user.experience?.role || 'No specific role listed'}
                </strong>
                <p style={{ fontSize: '0.825rem', color: 'var(--secondary-text)', marginTop: '2px' }}>
                  {user.experience?.organization || 'Independent Projects'} {user.experience?.duration ? `(${user.experience.duration})` : ''}
                </p>
                {user.experience?.description && (
                  <p style={{ fontSize: '0.8rem', color: 'var(--primary-text)', marginTop: '4px' }}>
                    {user.experience.description}
                  </p>
                )}
              </div>
            </div>

            {candidate.notes && (
              <div style={{ marginBottom: '16px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--secondary-text)', textTransform: 'uppercase' }}>Cover Note From Applicant</span>
                <p style={{ fontSize: '0.85rem', color: 'var(--primary-text)', marginTop: '4px', fontStyle: 'italic', padding: '10px', backgroundColor: 'var(--box-subtle)', borderRadius: '6px' }}>
                  &ldquo;{candidate.notes}&rdquo;
                </p>
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--secondary-text)', textTransform: 'uppercase' }}>Candidate Skills</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                {(user.skills || []).map((s, idx) => (
                  <span key={idx} className="skill-chip skill-chip-matched">
                    {s.name || s}
                  </span>
                ))}
                {(!user.skills || user.skills.length === 0) && (
                  <span style={{ fontSize: '0.8rem', color: 'var(--secondary-text)' }}>No skills listed</span>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setShowResumeModal(false)}
                className="btn-primary"
              >
                Close Resume
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
