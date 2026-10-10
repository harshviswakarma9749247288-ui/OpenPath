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
    <div onClick={onClose} className="admin-modal-overlay">
      <div onClick={(e) => e.stopPropagation()} className="card anim-float-subtle admin-action-center-modal modal-width-680 admin-modal-scrollable">
        {/* Close Button */}
        <button onClick={onClose} className="admin-modal-close-btn" title="Close details">
          <X size={20} />
        </button>

        {/* 1. Header Identity Profile */}
        <div className="admin-details-header">
          <img
            src={
              user.avatar ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120'
            }
            alt={user.name}
            className="admin-avatar-lg"
          />

          <div className="admin-details-info">
            <div className="admin-details-name-row">
              <h2 className="admin-details-name">
                {user.name}
              </h2>

              <span className={`auth-portal-badge role-${user.role}`}>
                {user.role}
              </span>

              <span className={`admin-status-pill ${isSuspended ? 'suspended' : 'active'}`}>
                {isSuspended ? <UserX size={11} /> : <UserCheck size={11} />}
                {user.status?.toUpperCase() || 'ACTIVE'}
              </span>
            </div>

            <div className="admin-details-meta-row">
              <span className="admin-details-meta-item">
                <Mail size={13} /> {user.email}
              </span>
              <button
                type="button"
                onClick={handleCopyId}
                className={`admin-modal-copy-btn ${copiedId ? 'copied' : ''}`}
              >
                {copiedId ? <Check size={12} /> : <Copy size={12} />} #{user._id}
              </button>
            </div>
          </div>
        </div>

        {/* Ban Details Alert (if suspended/banned) */}
        {isSuspended && (
          <div className="admin-warning-callout admin-warning-callout-col">
            <div className="admin-warning-header-row">
              <ShieldAlert size={16} /> Account Restricted
            </div>
            {user.banReason && (
              <p className="admin-warning-reason">
                <strong>Reason:</strong> {user.banReason}
              </p>
            )}
            {user.bannedAt && (
              <p className="admin-warning-timestamp">
                Recorded on {new Date(user.bannedAt).toLocaleString()}
              </p>
            )}
          </div>
        )}

        {/* 2. Platform Telemetry Metrics */}
        <div className="admin-details-kpis-grid">
          <div className="admin-details-kpi-box">
            <span className="admin-details-kpi-label">APPLICATIONS</span>
            <p className="admin-details-kpi-value">
              {user.submittedApplicationsCount ?? 0}
            </p>
          </div>
          <div className="admin-details-kpi-box">
            <span className="admin-details-kpi-label">LISTINGS POSTED</span>
            <p className="admin-details-kpi-value">
              {user.postedOpportunitiesCount ?? 0}
            </p>
          </div>
          <div className="admin-details-kpi-box">
            <span className="admin-details-kpi-label">MEMBER SINCE</span>
            <p className="admin-details-kpi-subval">
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="admin-details-kpi-box">
            <span className="admin-details-kpi-label">PROFILE STATUS</span>
            <p className={`admin-details-kpi-subval ${user.profileCompleted ? 'complete' : 'incomplete'}`}>
              {user.profileCompleted ? 'Complete' : 'Incomplete'}
            </p>
          </div>
        </div>

        {/* 3. Detailed Profile Sections */}
        <div className="admin-details-sections-list">
          {/* Bio */}
          {user.bio && (
            <div className="admin-details-section-card">
              <span className="admin-details-subhead">
                ABOUT / BIO
              </span>
              <p className="admin-details-body-text">
                {user.bio}
              </p>
            </div>
          )}

          {/* Education Details */}
          {user.education?.degree && (
            <div className="admin-details-section-card">
              <div className="admin-details-section-header admin-text-purple">
                <GraduationCap size={16} /> ACADEMIC BACKGROUND
              </div>
              <p className="admin-details-item-title">
                {user.education.degree} in {user.education.fieldOfStudy}
              </p>
              <p className="admin-details-item-sub">
                {user.education.institution} • {user.education.startYear} – {user.education.endYear || 'Present'} {user.education.grade ? `(${user.education.grade})` : ''}
              </p>
            </div>
          )}

          {/* Skills Taxonomy */}
          {user.skills && user.skills.length > 0 && (
            <div className="admin-details-section-card">
              <div className="admin-details-section-header admin-text-green admin-mb-10">
                <Layers size={16} /> VERIFIED SKILLS ({user.skills.length})
              </div>
              <div className="admin-wrap-gap-6">
                {user.skills.map((skill, idx) => {
                  const name = typeof skill === 'string' ? skill : skill.name;
                  return (
                    <span key={idx} className="admin-skill-chip-green">
                      {name}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Experience Details */}
          {user.experience?.role && (
            <div className="admin-details-section-card">
              <div className="admin-details-section-header admin-text-blue">
                <Briefcase size={16} /> WORK EXPERIENCE
              </div>
              <p className="admin-details-item-title">
                {user.experience.role} @ {user.experience.organization}
              </p>
              <p className="admin-details-item-sub">
                {user.experience.duration}
              </p>
              {user.experience.description && (
                <p className="admin-details-body-text">
                  {user.experience.description}
                </p>
              )}
            </div>
          )}

          {/* Company Details (Employer) */}
          {user.companyDetails?.companyName && (
            <div className="admin-details-section-card">
              <div className="admin-details-section-header admin-text-pink">
                <Building size={16} /> COMPANY INFORMATION
              </div>
              <p className="admin-details-item-title">
                {user.companyDetails.companyName}
              </p>
              <p className="admin-details-item-sub">
                {user.companyDetails.industry} • {user.companyDetails.website}
              </p>
            </div>
          )}

          {/* Location & Remote Pref */}
          {user.location && (user.location.city || user.location.country) && (
            <div className="admin-location-pill-row">
              <MapPin size={14} />
              <span>
                {[user.location.city, user.location.state, user.location.country].filter(Boolean).join(', ')} • Remote Preference: {user.location.remotePreference || 'Any'}
              </span>
            </div>
          )}
        </div>

        {/* 4. Action Footer */}
        <div className="admin-details-footer">
          <div className="admin-footer-btn-group">
            {/* Change Role Trigger */}
            <button
              onClick={() => {
                onClose();
                onRequestRoleChange(user);
              }}
              className="btn-secondary admin-btn-action-sm"
            >
              <Award size={14} color="#A78BFA" /> Change Role
            </button>

            {/* Ban/Suspend or Reactivate Trigger */}
            <button
              onClick={() => {
                onClose();
                onRequestBanToggle(user);
              }}
              className={`admin-btn-ban-trigger ${isSuspended ? 'suspended' : 'active'}`}
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
              className="admin-btn-delete-trigger"
              title="Delete account"
            >
              <Trash2 size={14} />
            </button>
          </div>

          <button onClick={onClose} className="btn-secondary admin-btn-close-sm">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
