import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  GraduationCap,
  Briefcase,
  AlertTriangle,
  X,
  Check,
  User,
} from 'lucide-react';

export default function RoleChangeModal({ isOpen, onClose, user, onConfirm, isLoading }) {
  const [selectedRole, setSelectedRole] = useState('student');

  useEffect(() => {
    if (user?.role) {
      setSelectedRole(user.role);
    }
  }, [user]);

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

  const currentRole = user.role || 'student';
  const hasChanged = selectedRole !== currentRole;

  const roles = [
    {
      id: 'student',
      title: 'Student / Candidate',
      icon: GraduationCap,
      color: '#A855F7',
      bg: 'rgba(168, 85, 247, 0.12)',
      border: 'rgba(168, 85, 247, 0.4)',
      badge: 'Student',
      desc: 'Browse internships & jobs, receive AI match scores, explore learning roadmaps, and submit applications.',
    },
    {
      id: 'employer',
      title: 'Employer / Recruiter',
      icon: Briefcase,
      color: '#EC4899',
      bg: 'rgba(236, 72, 153, 0.12)',
      border: 'rgba(236, 72, 153, 0.4)',
      badge: 'Employer',
      desc: 'Publish opportunity listings, review ranked candidates, manage applications, and conduct hiring pipelines.',
    },
    {
      id: 'admin',
      title: 'System Administrator',
      icon: ShieldCheck,
      color: '#EF4444',
      bg: 'rgba(239, 68, 68, 0.12)',
      border: 'rgba(239, 68, 68, 0.4)',
      badge: 'Admin',
      desc: 'Platform governance, audit user accounts, ban/suspend IDs, moderate listings, and manage system telemetry.',
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!hasChanged || isLoading) return;
    onConfirm(user._id, selectedRole);
  };

  return (
    <div onClick={onClose} className="admin-modal-overlay">
      <div onClick={(e) => e.stopPropagation()} className="card anim-float-subtle admin-action-center-modal">
        {/* Close Button */}
        <button onClick={onClose} className="admin-modal-close-btn" title="Cancel and close">
          <X size={18} />
        </button>

        {/* Glowing Role Badge */}
        <div className="admin-modal-icon-badge badge-purple">
          <ShieldCheck size={30} />
        </div>

        <h3 className="admin-modal-title">Change User Account Role</h3>
        <p className="admin-modal-subtitle">
          Modify permissions and interface access for this user on OpenPath.
        </p>

        {/* Target User Banner */}
        <div className="admin-modal-user-card">
          <div className="admin-modal-card-left">
            <img
              src={
                user.avatar ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=80'
              }
              alt={user.name}
              className="admin-modal-user-avatar"
            />
            <div>
              <p className="admin-modal-user-name">{user.name}</p>
              <p className="admin-modal-user-email">{user.email}</p>
            </div>
          </div>

          <div className="admin-modal-card-right">
            <span className="admin-modal-label-sub">
              Current Role
            </span>
            <span className={`auth-portal-badge role-${currentRole}`}>
              {currentRole}
            </span>
          </div>
        </div>

        {/* Role Options */}
        <form onSubmit={handleSubmit}>
          <div className="admin-modal-options-column">
            {roles.map((r) => {
              const Icon = r.icon;
              const isSelected = selectedRole === r.id;
              const isCurrent = currentRole === r.id;

              return (
                <div
                  key={r.id}
                  onClick={() => setSelectedRole(r.id)}
                  className={`modal-option-card ${isSelected ? 'selected' : ''}`}
                >
                  <div className="admin-modal-option-box">
                    <Icon size={18} color={r.color} />
                  </div>

                  <div className="admin-modal-option-body">
                    <div className="admin-modal-option-header">
                      <span className="admin-modal-option-title">
                        {r.title}
                      </span>
                      {isCurrent && (
                        <span className="admin-modal-option-badge-current">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="admin-modal-option-desc">
                      {r.desc}
                    </p>
                  </div>

                  <div className={`admin-modal-radio-check ${isSelected ? 'checked' : ''}`}>
                    {isSelected && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Admin Elevation Warning */}
          {selectedRole === 'admin' && currentRole !== 'admin' && (
            <div className="admin-warning-callout">
              <AlertTriangle size={18} color="#F87171" className="admin-icon-shrink0" />
              <p className="admin-warning-text">
                <strong>High Privilege Warning:</strong> Granting Admin role gives this user full administrative control, including user banning and database operations.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="modal-action-buttons">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="btn-secondary admin-modal-btn-cancel"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!hasChanged || isLoading}
              className="btn-primary admin-modal-btn-confirm confirm-primary"
            >
              {isLoading ? (
                <>Updating Role...</>
              ) : (
                <>
                  <Check size={16} /> Confirm Role Change
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
