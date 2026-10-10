import React, { useEffect, useState } from 'react';
import { Briefcase, CheckCircle2, XCircle, FileText, X, Check } from 'lucide-react';

export default function OpportunityStatusModal({ isOpen, onClose, opportunity, onConfirm, isLoading }) {
  const [selectedStatus, setSelectedStatus] = useState('Active');

  useEffect(() => {
    if (opportunity) {
      setSelectedStatus(opportunity.status || 'Active');
    }
  }, [opportunity]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !opportunity) return null;

  const currentStatus = opportunity.status || 'Active';
  const hasChanged = selectedStatus !== currentStatus;

  const statuses = [
    {
      id: 'Active',
      title: 'Active & Open',
      icon: CheckCircle2,
      color: '#10B981',
      bg: 'rgba(16, 185, 129, 0.12)',
      border: 'rgba(16, 185, 129, 0.4)',
      desc: 'Visible in Explore feed. Candidates can view details, calculate AI match score, and submit applications.',
    },
    {
      id: 'Closed',
      title: 'Closed / Inactive',
      icon: XCircle,
      color: '#F59E0B',
      bg: 'rgba(245, 158, 11, 0.12)',
      border: 'rgba(245, 158, 11, 0.4)',
      desc: 'Listing remains visible in archives, but candidate applications are halted and disabled.',
    },
    {
      id: 'Draft',
      title: 'Draft / Hidden',
      icon: FileText,
      color: '#94A3B8',
      bg: 'rgba(148, 163, 184, 0.12)',
      border: 'rgba(148, 163, 184, 0.4)',
      desc: 'Hidden from public feed and discovery. Only recruiters and administrators can inspect this draft.',
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!hasChanged || isLoading) return;
    onConfirm(opportunity._id, selectedStatus);
  };

  return (
    <div onClick={onClose} className="admin-modal-overlay">
      <div onClick={(e) => e.stopPropagation()} className="card anim-float-subtle admin-action-center-modal modal-width-500">
        <button onClick={onClose} className="admin-modal-close-btn" title="Cancel">
          <X size={18} />
        </button>

        {/* Header Icon */}
        <div className="admin-modal-icon-badge badge-pink">
          <Briefcase size={28} />
        </div>

        <h3 className="admin-modal-title">
          Moderate Listing Status
        </h3>

        <p className="admin-modal-subtitle">
          Set publication status for this opportunity listing.
        </p>

        {/* Opportunity Summary */}
        <div className="admin-modal-summary-card">
          <p className="admin-modal-summary-title">
            {opportunity.title}
          </p>
          <p className="admin-modal-summary-sub">
            {opportunity.organization} • {opportunity.type}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="admin-modal-options-column admin-mb-22">
            {statuses.map((s) => {
              const Icon = s.icon;
              const isSelected = selectedStatus === s.id;
              const isCurrent = currentStatus === s.id;

              return (
                <div
                  key={s.id}
                  onClick={() => setSelectedStatus(s.id)}
                  className={`modal-option-card ${isSelected ? 'selected' : ''}`}
                >
                  <div className="admin-modal-option-box">
                    <Icon size={16} color={s.color} />
                  </div>

                  <div className="admin-modal-option-body">
                    <div className="admin-modal-option-header">
                      <span className="admin-modal-option-title">
                        {s.title}
                      </span>
                      {isCurrent && (
                        <span className="admin-modal-option-badge-current">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="admin-modal-option-desc">
                      {s.desc}
                    </p>
                  </div>

                  <div className={`admin-modal-radio-check ${isSelected ? 'checked' : ''}`}>
                    {isSelected && <Check size={11} color="#FFFFFF" strokeWidth={3} />}
                  </div>
                </div>
              );
            })}
          </div>

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
              {isLoading ? 'Updating...' : (
                <>
                  <Check size={16} /> Update Status
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
