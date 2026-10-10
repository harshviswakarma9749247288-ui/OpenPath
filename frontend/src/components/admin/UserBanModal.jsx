import React, { useEffect, useState } from 'react';
import {
  UserX,
  UserCheck,
  ShieldAlert,
  AlertTriangle,
  X,
  Check,
  Copy,
  Clock,
  FileWarning,
} from 'lucide-react';

export default function UserBanModal({ isOpen, onClose, user, onConfirm, isLoading }) {
  const [banType, setBanType] = useState('suspended'); // 'suspended' | 'banned'
  const [banReason, setBanReason] = useState('');
  const [isCopiedId, setIsCopiedId] = useState(false);

  const isAlreadyBanned = user?.status === 'suspended' || user?.status === 'banned';

  useEffect(() => {
    if (user) {
      setBanType(user.status === 'banned' ? 'banned' : 'suspended');
      setBanReason(user.banReason || '');
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

  const presetReasons = [
    'Spam or fraudulent opportunity postings',
    'Terms of Service & Code of Conduct violation',
    'Inappropriate or abusive candidate communication',
    'Fake credentials, misleading resume or impersonation',
    'Multiple suspicious duplicate accounts detected',
    'Security risk or unauthorized automated scraping',
  ];

  const handleCopyId = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(user._id);
      setIsCopiedId(true);
      setTimeout(() => setIsCopiedId(false), 2000);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoading) return;

    if (isAlreadyBanned) {
      // Reactivate user
      onConfirm(user._id, 'active', '');
    } else {
      // Suspend or ban user
      const finalReason = banReason.trim() || 'Suspended by platform administrator';
      onConfirm(user._id, banType, finalReason);
    }
  };

  return (
    <div onClick={onClose} className="admin-modal-overlay">
      <div onClick={(e) => e.stopPropagation()} className="card anim-float-subtle admin-action-center-modal">
        {/* Close Button */}
        <button onClick={onClose} className="admin-modal-close-btn" title="Cancel and close">
          <X size={18} />
        </button>

        {/* Glowing Badge Icon */}
        <div className={`admin-modal-icon-badge ${isAlreadyBanned ? 'badge-green' : 'badge-red'}`}>
          {isAlreadyBanned ? <UserCheck size={30} /> : <UserX size={30} />}
        </div>

        {/* Modal Header */}
        <h3 className="admin-modal-title">
          {isAlreadyBanned ? 'Reactivate User Account' : 'Suspend / Ban User ID'}
        </h3>

        <p className="admin-modal-subtitle">
          {isAlreadyBanned
            ? 'Restore platform access, enable sign-in, and clear account restrictions.'
            : 'Enforce access restriction, revoke active sessions, and prevent future sign-ins.'}
        </p>

        {/* Target User Card with ID Copy */}
        <div className="admin-modal-user-card-col">
          <div className="admin-modal-card-top-row">
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

            <span className={`auth-portal-badge role-${user.role}`}>
              {user.role}
            </span>
          </div>

          <div className="admin-modal-card-bottom-row">
            <span className="admin-mono-id">ID: {user._id}</span>
            <button
              type="button"
              onClick={handleCopyId}
              className={`admin-modal-copy-btn ${isCopiedId ? 'copied' : ''}`}
            >
              {isCopiedId ? <Check size={12} /> : <Copy size={12} />}
              {isCopiedId ? 'Copied ID' : 'Copy ID'}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {isAlreadyBanned ? (
            /* Reactivation Confirmation details */
            <div className="admin-mb-20">
              <div className="admin-reactivate-info-box">
                <div className="admin-reactivate-row">
                  <Clock size={15} color="#34D399" />
                  <span className="admin-status-text-green">
                    Current Restriction Status: {user.status?.toUpperCase()}
                  </span>
                </div>
                {user.banReason && (
                  <p className="admin-reactivate-detail-text">
                    <strong>Ban Reason:</strong> {user.banReason}
                  </p>
                )}
                {user.bannedAt && (
                  <p className="admin-reactivate-date-text">
                    Applied on: {new Date(user.bannedAt).toLocaleString()}
                  </p>
                )}
              </div>

              <p className="admin-reactivate-desc">
                Reactivating this account will clear previous penalty flags and allow this user to sign in immediately.
              </p>
            </div>
          ) : (
            /* Ban / Suspend Configuration */
            <div className="admin-form-col-gap">
              {/* Ban Level Selector */}
              <div>
                <label className="form-label admin-field-label-sm">
                  Restriction Severity
                </label>
                <div className="admin-grid-2col-gap">
                  <button
                    type="button"
                    onClick={() => setBanType('suspended')}
                    className={`admin-severity-btn ${banType === 'suspended' ? 'active-suspended' : ''}`}
                  >
                    Suspension (Soft Lock)
                  </button>

                  <button
                    type="button"
                    onClick={() => setBanType('banned')}
                    className={`admin-severity-btn ${banType === 'banned' ? 'active-banned' : ''}`}
                  >
                    Permanent Ban (Hard Lock)
                  </button>
                </div>
              </div>

              {/* Quick Preset Chips */}
              <div>
                <label className="form-label admin-field-label-sm">
                  Quick Ban Reasons
                </label>
                <div className="admin-wrap-gap-6">
                  {presetReasons.map((reason, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setBanReason(reason)}
                      className={`admin-ban-preset-chip ${banReason === reason ? 'active' : ''}`}
                    >
                      {reason}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Reason Textarea */}
              <div>
                <label className="form-label admin-field-label-sm">
                  Administrative Explanation & Notes
                </label>
                <textarea
                  className="form-input admin-textarea-compact"
                  rows={2}
                  placeholder="State the violation or note internal governance reason..."
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                />
              </div>

              {/* Danger Warning Box */}
              <div className="admin-warning-callout">
                <AlertTriangle size={18} color="#F87171" className="admin-icon-shrink0" />
                <p className="admin-warning-text">
                  <strong>Security Enforcement:</strong> This user ID will be blocked at the API layer. Any ongoing active login token will be denied on next request.
                </p>
              </div>
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

            {isAlreadyBanned ? (
              <button
                type="submit"
                disabled={isLoading}
                className="admin-modal-btn-confirm confirm-success"
              >
                {isLoading ? 'Reactivating...' : (
                  <>
                    <UserCheck size={16} /> Reactivate User ID
                  </>
                )}
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading}
                className="admin-modal-btn-confirm confirm-danger"
              >
                {isLoading ? 'Enforcing...' : (
                  <>
                    <UserX size={16} /> Confirm Ban ID
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
