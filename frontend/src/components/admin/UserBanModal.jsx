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
        className="card anim-float-subtle admin-action-center-modal"
        style={{
          maxWidth: '520px',
          width: '100%',
          padding: '30px 28px',
          backgroundColor: 'var(--card-bg)',
          borderRadius: '22px',
          border: `1px solid ${isAlreadyBanned ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
          boxShadow: isAlreadyBanned
            ? '0 24px 60px rgba(0, 0, 0, 0.55), 0 0 35px rgba(16, 185, 129, 0.2)'
            : '0 24px 60px rgba(0, 0, 0, 0.55), 0 0 35px rgba(239, 68, 68, 0.22)',
          position: 'relative',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            color: 'var(--secondary-text)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 0.2s, background-color 0.2s',
          }}
          title="Cancel and close"
        >
          <X size={18} />
        </button>

        {/* Glowing Badge Icon */}
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            margin: '0 auto 16px auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: isAlreadyBanned
              ? 'radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, rgba(5, 150, 105, 0.08) 70%)'
              : 'radial-gradient(circle, rgba(239, 68, 68, 0.25) 0%, rgba(225, 29, 72, 0.08) 70%)',
            border: `1px solid ${isAlreadyBanned ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
            boxShadow: isAlreadyBanned
              ? '0 0 24px rgba(16, 185, 129, 0.3)'
              : '0 0 24px rgba(239, 68, 68, 0.35)',
            color: isAlreadyBanned ? '#34D399' : '#F87171',
          }}
        >
          {isAlreadyBanned ? <UserCheck size={30} /> : <UserX size={30} />}
        </div>

        {/* Modal Header */}
        <h3
          style={{
            fontSize: '1.35rem',
            fontWeight: 800,
            color: 'var(--primary-text)',
            textAlign: 'center',
            marginBottom: '6px',
            letterSpacing: '-0.3px',
          }}
        >
          {isAlreadyBanned ? 'Reactivate User Account' : 'Suspend / Ban User ID'}
        </h3>

        <p
          style={{
            fontSize: '0.86rem',
            color: 'var(--secondary-text)',
            textAlign: 'center',
            lineHeight: '1.5',
            marginBottom: '20px',
          }}
        >
          {isAlreadyBanned
            ? 'Restore platform access, enable sign-in, and clear account restrictions.'
            : 'Enforce access restriction, revoke active sessions, and prevent future sign-ins.'}
        </p>

        {/* Target User Card with ID Copy */}
        <div
          style={{
            padding: '12px 16px',
            borderRadius: '12px',
            backgroundColor: 'var(--chip-bg)',
            border: '1px solid var(--border-color)',
            marginBottom: '18px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img
                src={
                  user.avatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=80'
                }
                alt={user.name}
                style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div>
                <p style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--primary-text)', margin: 0 }}>
                  {user.name}
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--secondary-text)', margin: 0 }}>
                  {user.email}
                </p>
              </div>
            </div>

            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '9999px',
                textTransform: 'capitalize',
                backgroundColor:
                  user.role === 'admin'
                    ? 'rgba(239, 68, 68, 0.2)'
                    : user.role === 'employer'
                    ? 'rgba(236, 72, 153, 0.2)'
                    : 'rgba(124, 58, 237, 0.2)',
                color:
                  user.role === 'admin' ? '#F87171' : user.role === 'employer' ? '#F472B6' : '#C084FC',
              }}
            >
              {user.role}
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.72rem',
              color: 'var(--secondary-text)',
              paddingTop: '6px',
              borderTop: '1px solid var(--border-color)',
            }}
          >
            <span style={{ fontFamily: 'monospace', letterSpacing: '0.04em' }}>ID: {user._id}</span>
            <button
              type="button"
              onClick={handleCopyId}
              style={{
                background: 'none',
                border: 'none',
                color: isCopiedId ? '#34D399' : '#A78BFA',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontWeight: 600,
                fontSize: '0.72rem',
              }}
            >
              {isCopiedId ? <Check size={12} /> : <Copy size={12} />}
              {isCopiedId ? 'Copied ID' : 'Copy ID'}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {isAlreadyBanned ? (
            /* Reactivation Confirmation details */
            <div style={{ marginBottom: '20px' }}>
              <div
                style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  marginBottom: '14px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <Clock size={15} color="#34D399" />
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#34D399' }}>
                    Current Restriction Status: {user.status?.toUpperCase()}
                  </span>
                </div>
                {user.banReason && (
                  <p style={{ fontSize: '0.78rem', color: 'var(--primary-text)', margin: '0 0 4px 0' }}>
                    <strong>Ban Reason:</strong> {user.banReason}
                  </p>
                )}
                {user.bannedAt && (
                  <p style={{ fontSize: '0.72rem', color: 'var(--secondary-text)', margin: 0 }}>
                    Applied on: {new Date(user.bannedAt).toLocaleString()}
                  </p>
                )}
              </div>

              <p style={{ fontSize: '0.82rem', color: 'var(--secondary-text)', margin: 0, lineHeight: '1.4' }}>
                Reactivating this account will clear previous penalty flags and allow this user to sign in immediately.
              </p>
            </div>
          ) : (
            /* Ban / Suspend Configuration */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
              {/* Ban Level Selector */}
              <div>
                <label className="form-label" style={{ fontSize: '0.78rem', marginBottom: '6px' }}>
                  Restriction Severity
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setBanType('suspended')}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: banType === 'suspended' ? '2px solid #F59E0B' : '1px solid var(--border-color)',
                      backgroundColor: banType === 'suspended' ? 'rgba(245, 158, 11, 0.15)' : 'var(--chip-bg)',
                      color: banType === 'suspended' ? '#FBBF24' : 'var(--secondary-text)',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      textAlign: 'center',
                    }}
                  >
                    Suspension (Soft Lock)
                  </button>

                  <button
                    type="button"
                    onClick={() => setBanType('banned')}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: banType === 'banned' ? '2px solid #EF4444' : '1px solid var(--border-color)',
                      backgroundColor: banType === 'banned' ? 'rgba(239, 68, 68, 0.15)' : 'var(--chip-bg)',
                      color: banType === 'banned' ? '#F87171' : 'var(--secondary-text)',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      textAlign: 'center',
                    }}
                  >
                    Permanent Ban (Hard Lock)
                  </button>
                </div>
              </div>

              {/* Quick Preset Chips */}
              <div>
                <label className="form-label" style={{ fontSize: '0.78rem', marginBottom: '6px' }}>
                  Quick Ban Reasons
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {presetReasons.map((reason, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setBanReason(reason)}
                      style={{
                        padding: '4px 9px',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        border: banReason === reason ? '1px solid #F87171' : '1px solid var(--border-color)',
                        backgroundColor: banReason === reason ? 'rgba(239, 68, 68, 0.2)' : 'var(--chip-bg)',
                        color: banReason === reason ? '#FCA5A5' : 'var(--secondary-text)',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      {reason}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Reason Textarea */}
              <div>
                <label className="form-label" style={{ fontSize: '0.78rem', marginBottom: '6px' }}>
                  Administrative Explanation & Notes
                </label>
                <textarea
                  className="form-input"
                  rows={2}
                  placeholder="State the violation or note internal governance reason..."
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  style={{ fontSize: '0.82rem', padding: '8px 12px' }}
                />
              </div>

              {/* Danger Warning Box */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                }}
              >
                <AlertTriangle size={18} color="#F87171" style={{ flexShrink: 0 }} />
                <p style={{ fontSize: '0.76rem', color: '#FCA5A5', margin: 0, lineHeight: '1.4' }}>
                  <strong>Security Enforcement:</strong> This user ID will be blocked at the API layer. Any ongoing active login token will be denied on next request.
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="modal-action-buttons" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="btn-secondary"
              style={{
                padding: '11px 18px',
                fontSize: '0.9rem',
                fontWeight: 600,
                borderRadius: '12px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>

            {isAlreadyBanned ? (
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  padding: '11px 18px',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  borderRadius: '12px',
                  border: 'none',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  backgroundColor: '#10B981',
                  color: '#FFFFFF',
                  boxShadow: '0 4px 18px rgba(16, 185, 129, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
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
                style={{
                  padding: '11px 18px',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  borderRadius: '12px',
                  border: 'none',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  backgroundColor: '#EF4444',
                  color: '#FFFFFF',
                  boxShadow: '0 4px 18px rgba(239, 68, 68, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
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
