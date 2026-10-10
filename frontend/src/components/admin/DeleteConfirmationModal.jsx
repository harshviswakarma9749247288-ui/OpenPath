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
    <div onClick={onClose} className="admin-modal-overlay">
      <div onClick={(e) => e.stopPropagation()} className="card anim-float-subtle admin-action-center-modal modal-width-480">
        {/* Close Button */}
        <button onClick={onClose} className="admin-modal-close-btn" title="Cancel">
          <X size={18} />
        </button>

        {/* Glowing Trash Badge */}
        <div className="admin-modal-icon-badge badge-red">
          <Trash2 size={30} />
        </div>

        <h3 className="admin-modal-title">
          {cfg.title}
        </h3>

        <p className="admin-modal-subtitle">
          Are you sure you want to proceed? This destructive operation cannot be recovered.
        </p>

        {/* Item Target Card */}
        <div className="admin-delete-target-card">
          <span className="admin-delete-target-label">
            {cfg.label} TARGET
          </span>
          <p className="admin-delete-target-title">
            {item.title}
          </p>
          {item.subtitle && (
            <p className="admin-delete-target-sub">
              {item.subtitle}
            </p>
          )}
        </div>

        {/* Warning Callout */}
        <div className="admin-warning-callout">
          <AlertTriangle size={18} color="#F87171" className="admin-icon-shrink0" />
          <p className="admin-warning-text">
            {cfg.warning}
          </p>
        </div>

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
            type="button"
            onClick={() => onConfirm(item.id)}
            disabled={isLoading}
            className="admin-modal-btn-confirm confirm-danger"
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
