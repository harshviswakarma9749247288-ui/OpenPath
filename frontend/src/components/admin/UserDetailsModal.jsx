import React, { useEffect, useState } from 'react';
import {
  X,
  User,
  Mail,
  GraduationCap,
  Briefcase,
  Layers,
  MapPin,
  Calendar,
  Building,
  ExternalLink,
  ShieldAlert,
  UserCheck,
  UserX,
  Trash2,
  Copy,
  Check,
  Award,
} from 'lucide-react';

export default function UserDetailsModal({
  isOpen,
  onClose,
  user,
  onRequestRoleChange,
  onRequestBanToggle,
  onRequestDelete,
}) {
  const [copiedId, setCopiedId] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !user) return null;

  const isSuspended = user.status === 'suspended' || user.status === 'banned';

  const handleCopyId = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(user._id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(3, 7, 18, 0.8)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.2s ease-out',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="card anim-float-subtle"
        style={{
          maxWidth: '680px',
          width: '100%',
          maxHeight: '88vh',
          overflowY: 'auto',
          padding: '28px',
          backgroundColor: 'var(--card-bg)',
          borderRadius: '24px',
          border: '1px solid var(--border-color)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6), 0 0 35px rgba(124, 58, 237, 0.15)',
          position: 'relative',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            color: 'var(--secondary-text)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 0.2s',
          }}
          title="Close details"
        >
          <X size={20} />
        </button>

        {/* 1. Header Identity Profile */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '22px' }}>
          <img
            src={
              user.avatar ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120'
            }
            alt={user.name}
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid var(--border-color)',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
            }}
          />

          <div style={{ flex: 1, paddingRight: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-text)', margin: 0 }}>
                {user.name}
              </h2>

              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '2px 9px',
                  borderRadius: '9999px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  backgroundColor:
                    user.role === 'admin'
                      ? 'rgba(239, 68, 68, 0.18)'
                      : user.role === 'employer'
                      ? 'rgba(236, 72, 153, 0.18)'
                      : 'rgba(124, 58, 237, 0.18)',
                  color:
                    user.role === 'admin' ? '#F87171' : user.role === 'employer' ? '#F472B6' : '#C084FC',
                  border: '1px solid var(--border-color)',
                }}
              >
                {user.role}
              </span>

              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '2px 9px',
                  borderRadius: '9999px',
                  backgroundColor: isSuspended ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                  color: isSuspended ? '#F87171' : '#34D399',
                  border: '1px solid var(--border-color)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                {isSuspended ? <UserX size={11} /> : <UserCheck size={11} />}
                {user.status?.toUpperCase() || 'ACTIVE'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '6px', flexWrap: 'wrap', fontSize: '0.8rem', color: 'var(--secondary-text)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Mail size={13} /> {user.email}
              </span>
              <button
                type="button"
                onClick={handleCopyId}
                style={{
                  background: 'none',
                  border: 'none',
                  color: copiedId ? '#34D399' : 'var(--secondary-text)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.75rem',
                  fontFamily: 'monospace',
                }}
              >
                {copiedId ? <Check size={12} /> : <Copy size={12} />} #{user._id}
              </button>
            </div>
          </div>
        </div>

        {/* Ban Details Alert (if suspended/banned) */}
        {isSuspended && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '12px',
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              marginBottom: '20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#F87171', fontWeight: 700, fontSize: '0.85rem' }}>
              <ShieldAlert size={16} /> Account Restricted
            </div>
            {user.banReason && (
              <p style={{ fontSize: '0.8rem', color: '#FCA5A5', margin: '4px 0 0 0' }}>
                <strong>Reason:</strong> {user.banReason}
              </p>
            )}
            {user.bannedAt && (
              <p style={{ fontSize: '0.72rem', color: '#F87171', margin: '2px 0 0 0', opacity: 0.8 }}>
                Recorded on {new Date(user.bannedAt).toLocaleString()}
              </p>
            )}
          </div>
        )}

        {/* 2. Platform Telemetry Metrics */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '10px',
            marginBottom: '22px',
          }}
        >
          <div style={{ padding: '10px 14px', borderRadius: '10px', backgroundColor: 'var(--chip-bg)', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--secondary-text)', fontWeight: 600 }}>APPLICATIONS</span>
            <p style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-text)', margin: '2px 0 0 0' }}>
              {user.submittedApplicationsCount ?? 0}
            </p>
          </div>
          <div style={{ padding: '10px 14px', borderRadius: '10px', backgroundColor: 'var(--chip-bg)', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--secondary-text)', fontWeight: 600 }}>LISTINGS POSTED</span>
            <p style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-text)', margin: '2px 0 0 0' }}>
              {user.postedOpportunitiesCount ?? 0}
            </p>
          </div>
          <div style={{ padding: '10px 14px', borderRadius: '10px', backgroundColor: 'var(--chip-bg)', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--secondary-text)', fontWeight: 600 }}>MEMBER SINCE</span>
            <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-text)', margin: '4px 0 0 0' }}>
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div style={{ padding: '10px 14px', borderRadius: '10px', backgroundColor: 'var(--chip-bg)', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--secondary-text)', fontWeight: 600 }}>PROFILE STATUS</span>
            <p style={{ fontSize: '0.85rem', fontWeight: 700, color: user.profileCompleted ? '#34D399' : '#FBBF24', margin: '4px 0 0 0' }}>
              {user.profileCompleted ? 'Complete' : 'Incomplete'}
            </p>
          </div>
        </div>

        {/* 3. Detailed Profile Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
          {/* Bio */}
          {user.bio && (
            <div style={{ padding: '12px 16px', borderRadius: '12px', backgroundColor: 'var(--box-subtle)', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--secondary-text)', display: 'block', marginBottom: '4px' }}>
                ABOUT / BIO
              </span>
              <p style={{ fontSize: '0.85rem', color: 'var(--primary-text)', margin: 0, lineHeight: '1.5' }}>
                {user.bio}
              </p>
            </div>
          )}

          {/* Education Details */}
          {user.education?.degree && (
            <div style={{ padding: '14px 16px', borderRadius: '12px', backgroundColor: 'var(--box-subtle)', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', color: '#A855F7', fontWeight: 700, fontSize: '0.8rem' }}>
                <GraduationCap size={16} /> ACADEMIC BACKGROUND
              </div>
              <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary-text)', margin: 0 }}>
                {user.education.degree} in {user.education.fieldOfStudy}
              </p>
              <p style={{ fontSize: '0.82rem', color: 'var(--secondary-text)', margin: '2px 0 0 0' }}>
                {user.education.institution} • {user.education.startYear} – {user.education.endYear || 'Present'} {user.education.grade ? `(${user.education.grade})` : ''}
              </p>
            </div>
          )}

          {/* Skills Taxonomy */}
          {user.skills && user.skills.length > 0 && (
            <div style={{ padding: '14px 16px', borderRadius: '12px', backgroundColor: 'var(--box-subtle)', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px', color: '#10B981', fontWeight: 700, fontSize: '0.8rem' }}>
                <Layers size={16} /> VERIFIED SKILLS ({user.skills.length})
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {user.skills.map((skill, idx) => {
                  const name = typeof skill === 'string' ? skill : skill.name;
                  return (
                    <span
                      key={idx}
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        backgroundColor: 'rgba(16, 185, 129, 0.12)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        color: '#34D399',
                      }}
                    >
                      {name}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Experience Details */}
          {user.experience?.role && (
            <div style={{ padding: '14px 16px', borderRadius: '12px', backgroundColor: 'var(--box-subtle)', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', color: '#38BDF8', fontWeight: 700, fontSize: '0.8rem' }}>
                <Briefcase size={16} /> WORK EXPERIENCE
              </div>
              <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary-text)', margin: 0 }}>
                {user.experience.role} @ {user.experience.organization}
              </p>
              <p style={{ fontSize: '0.78rem', color: 'var(--secondary-text)', margin: '2px 0 4px 0' }}>
                {user.experience.duration}
              </p>
              {user.experience.description && (
                <p style={{ fontSize: '0.82rem', color: 'var(--primary-text)', margin: 0, lineHeight: '1.4' }}>
                  {user.experience.description}
                </p>
              )}
            </div>
          )}

          {/* Company Details (Employer) */}
          {user.companyDetails?.companyName && (
            <div style={{ padding: '14px 16px', borderRadius: '12px', backgroundColor: 'var(--box-subtle)', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', color: '#EC4899', fontWeight: 700, fontSize: '0.8rem' }}>
                <Building size={16} /> COMPANY INFORMATION
              </div>
              <p style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--primary-text)', margin: 0 }}>
                {user.companyDetails.companyName}
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--secondary-text)', margin: '2px 0 0 0' }}>
                {user.companyDetails.industry} • {user.companyDetails.website}
              </p>
            </div>
          )}

          {/* Location & Remote Pref */}
          {user.location && (user.location.city || user.location.country) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--secondary-text)' }}>
              <MapPin size={14} />
              <span>
                {[user.location.city, user.location.state, user.location.country].filter(Boolean).join(', ')} • Remote Preference: {user.location.remotePreference || 'Any'}
              </span>
            </div>
          )}
        </div>

        {/* 4. Action Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid var(--border-color)',
            paddingTop: '18px',
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          <div style={{ display: 'flex', gap: '8px' }}>
            {/* Change Role Trigger */}
            <button
              onClick={() => {
                onClose();
                onRequestRoleChange(user);
              }}
              className="btn-secondary"
              style={{ padding: '8px 14px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Award size={14} color="#A78BFA" /> Change Role
            </button>

            {/* Ban/Suspend or Reactivate Trigger */}
            <button
              onClick={() => {
                onClose();
                onRequestBanToggle(user);
              }}
              style={{
                padding: '8px 14px',
                fontSize: '0.82rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                backgroundColor: isSuspended ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                color: isSuspended ? '#34D399' : '#F87171',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: 600,
              }}
            >
              {isSuspended ? (
                <>
                  <UserCheck size={14} /> Reactivate ID
                </>
              ) : (
                <>
                  <UserX size={14} /> Suspend / Ban ID
                </>
              )}
            </button>

            {/* Delete Trigger */}
            <button
              onClick={() => {
                onClose();
                onRequestDelete(user);
              }}
              style={{
                padding: '8px 12px',
                fontSize: '0.82rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                background: 'none',
                color: '#F43F5E',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
              title="Delete account"
            >
              <Trash2 size={14} />
            </button>
          </div>

          <button onClick={onClose} className="btn-secondary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
