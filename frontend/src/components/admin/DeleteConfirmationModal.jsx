import React, { useEffect } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  type, // 'user' | 'opportunity' | 'skill'
  item, // object with { id, title, subtitle, extra }
  onConfirm,
  isLoading,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !item) return null;

  const typeConfig = {
    user: {
      title: 'Delete User Account Permanently',
      label: 'User Account',
      warning:
        'This will irreversibly delete this user account. All submitted applications, saved opportunities, and associated employer listings will be purged from the database.',
    },
    opportunity: {
      title: 'Delete Opportunity Listing',
      label: 'Opportunity Listing',
      warning:
        'This listing will be permanently deleted from the platform. All candidate applications submitted to this listing will be unlinked or archived.',
    },
    skill: {
      title: 'Delete Skill from Taxonomy',
      label: 'Canonical Skill',
      warning:
        'Removing this skill from the canonical taxonomy may affect vector alignment and AI match calculation for listings and profiles referencing this node.',
    },
  };

  const cfg = typeConfig[type] || {
    title: 'Confirm Resource Deletion',
    label: 'Resource',
    warning: 'This action is irreversible and cannot be undone.',
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
          maxWidth: '480px',
          width: '100%',
          padding: '30px 28px',
          backgroundColor: 'var(--card-bg)',
          borderRadius: '22px',
          border: '1px solid rgba(239, 68, 68, 0.45)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6), 0 0 35px rgba(239, 68, 68, 0.25)',
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
            transition: 'color 0.2s',
          }}
          title="Cancel"
        >
          <X size={18} />
        </button>

        {/* Glowing Trash Badge */}
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            margin: '0 auto 16px auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle, rgba(239, 68, 68, 0.25) 0%, rgba(225, 29, 72, 0.08) 70%)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            boxShadow: '0 0 24px rgba(239, 68, 68, 0.35)',
            color: '#F87171',
          }}
        >
          <Trash2 size={30} />
        </div>

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
          {cfg.title}
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
          Are you sure you want to proceed? This destructive operation cannot be recovered.
        </p>

        {/* Item Target Card */}
        <div
          style={{
            padding: '14px 16px',
            borderRadius: '12px',
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            marginBottom: '18px',
          }}
        >
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#F87171', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {cfg.label} TARGET
          </span>
          <p style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--primary-text)', margin: '4px 0 2px 0' }}>
            {item.title}
          </p>
          {item.subtitle && (
            <p style={{ fontSize: '0.78rem', color: 'var(--secondary-text)', margin: 0 }}>
              {item.subtitle}
            </p>
          )}
        </div>

        {/* Warning Callout */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            padding: '12px 14px',
            borderRadius: '10px',
            backgroundColor: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            marginBottom: '22px',
          }}
        >
          <AlertTriangle size={18} color="#F87171" style={{ flexShrink: 0, marginTop: '2px' }} />
          <p style={{ fontSize: '0.78rem', color: '#FCA5A5', margin: 0, lineHeight: '1.4' }}>
            {cfg.warning}
          </p>
        </div>

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

          <button
            type="button"
            onClick={() => onConfirm(item.id)}
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
              boxShadow: '0 4px 18px rgba(239, 68, 68, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            {isLoading ? (
              'Deleting...'
            ) : (
              <>
                <Trash2 size={16} /> Delete Permanently
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
