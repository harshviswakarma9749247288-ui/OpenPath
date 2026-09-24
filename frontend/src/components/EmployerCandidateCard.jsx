import React, { useState } from 'react';
import { Mail, GraduationCap, Briefcase, MapPin, FileText } from 'lucide-react';
import MatchScoreBadge from './MatchScoreBadge';
import ApplicationStatusBadge from './ApplicationStatusBadge';

export default function EmployerCandidateCard({ candidate, onStatusChange }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(candidate.status);

  const statuses = ['Applied', 'Reviewing', 'Shortlisted', 'Interview', 'Selected', 'Rejected'];

  const handleUpdate = async (newStatus) => {
    setIsUpdating(true);
    setSelectedStatus(newStatus);
    await onStatusChange(candidate.applicationId, newStatus);
    setIsUpdating(false);
  };

  const user = candidate.user;

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
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF' }}>
                {user.name}
              </h3>
              <ApplicationStatusBadge status={selectedStatus} />
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--secondary-text)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Mail size={14} /> {user.email}
              {user.location?.city && (
                <>
                  <span>•</span>
                  <MapPin size={14} /> {user.location.city}, {user.location.state}
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
          <MatchScoreBadge score={candidate.matchScore} size={50} showLabel={false} />
        </div>
      </div>

      {/* Candidate Background: Education & Experience */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '12px',
          padding: '14px',
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.85rem',
        }}
      >
        <div style={{ display: 'flex', gap: '8px' }}>
          <GraduationCap size={16} color="#A78BFA" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong style={{ color: '#F8FAFC' }}>
              {user.education?.degree || 'Undergraduate Degree'}
            </strong>
            <p style={{ color: 'var(--secondary-text)', fontSize: '0.8rem' }}>
              {user.education?.institution || 'Academic Institution'} • Class of {user.education?.endYear || '2026'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <Briefcase size={16} color="#EC4899" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong style={{ color: '#F8FAFC' }}>
              {user.experience?.role || 'Fresher / Project Contributor'}
            </strong>
            <p style={{ color: 'var(--secondary-text)', fontSize: '0.8rem' }}>
              {user.experience?.organization || 'Personal Portfolio & Coursework'}
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
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: '14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        <button
          onClick={() => {
            alert(`Opening candidate digital resume portfolio for ${user.name}`);
          }}
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
                border: selectedStatus === st ? '1.5px solid #C026D3' : '1px solid rgba(255, 255, 255, 0.12)',
                backgroundColor: selectedStatus === st ? 'rgba(192, 38, 211, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                color: selectedStatus === st ? '#F0ABFC' : '#94A3B8',
                boxShadow: selectedStatus === st ? '0 0 12px rgba(192, 38, 211, 0.35)' : 'none',
                cursor: selectedStatus === st ? 'default' : 'pointer',
              }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
