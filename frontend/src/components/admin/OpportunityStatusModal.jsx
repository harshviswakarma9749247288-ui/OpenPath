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
          maxWidth: '500px',
          width: '100%',
          padding: '28px',
          backgroundColor: 'var(--card-bg)',
          borderRadius: '22px',
          border: '1px solid var(--border-color)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.55), 0 0 30px rgba(236, 72, 153, 0.18)',
          position: 'relative',
        }}
      >
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

        {/* Header Icon */}
        <div
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            margin: '0 auto 16px auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.25) 0%, rgba(219, 39, 119, 0.08) 70%)',
            border: '1px solid rgba(236, 72, 153, 0.4)',
            boxShadow: '0 0 24px rgba(236, 72, 153, 0.3)',
            color: '#EC4899',
          }}
        >
          <Briefcase size={28} />
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
          Moderate Listing Status
        </h3>

        <p
          style={{
            fontSize: '0.86rem',
            color: 'var(--secondary-text)',
            textAlign: 'center',
            lineHeight: '1.5',
            marginBottom: '18px',
          }}
        >
          Set publication status for this opportunity listing.
        </p>

        {/* Opportunity Summary */}
        <div
          style={{
            padding: '12px 14px',
            borderRadius: '12px',
            backgroundColor: 'var(--chip-bg)',
            border: '1px solid var(--border-color)',
            marginBottom: '18px',
          }}
        >
          <p style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--primary-text)', margin: '0 0 2px 0' }}>
            {opportunity.title}
          </p>
          <p style={{ fontSize: '0.78rem', color: 'var(--secondary-text)', margin: 0 }}>
            {opportunity.organization} • {opportunity.type}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '22px' }}>
            {statuses.map((s) => {
              const Icon = s.icon;
              const isSelected = selectedStatus === s.id;
              const isCurrent = currentStatus === s.id;

              return (
                <div
                  key={s.id}
                  onClick={() => setSelectedStatus(s.id)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: isSelected ? `2px solid ${s.color}` : '1px solid var(--border-color)',
                    backgroundColor: isSelected ? s.bg : 'var(--card-bg)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      backgroundColor: isSelected ? s.color : 'rgba(255, 255, 255, 0.06)',
                      color: isSelected ? '#FFFFFF' : s.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={16} />
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                      <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--primary-text)' }}>
                        {s.title}
                      </span>
                      {isCurrent && (
                        <span style={{ fontSize: '0.7rem', color: 'var(--secondary-text)', fontStyle: 'italic' }}>
                          Current
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--secondary-text)', margin: 0, lineHeight: '1.4' }}>
                      {s.desc}
                    </p>
                  </div>

                  <div
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      border: isSelected ? `2px solid ${s.color}` : '2px solid var(--border-color)',
                      backgroundColor: isSelected ? s.color : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: '3px',
                    }}
                  >
                    {isSelected && <Check size={11} color="#FFFFFF" strokeWidth={3} />}
                  </div>
                </div>
              );
            })}
          </div>

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
              type="submit"
              disabled={!hasChanged || isLoading}
              className="btn-primary"
              style={{
                padding: '11px 18px',
                fontSize: '0.9rem',
                fontWeight: 700,
                borderRadius: '12px',
                border: 'none',
                cursor: !hasChanged || isLoading ? 'not-allowed' : 'pointer',
                opacity: !hasChanged ? 0.6 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
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
