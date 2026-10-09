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
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(3, 7, 18, 0.78)',
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
          maxWidth: '520px',
          width: '100%',
          padding: '30px 28px',
          backgroundColor: 'var(--card-bg)',
          borderRadius: '22px',
          border: '1px solid var(--border-color)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.55), 0 0 35px rgba(168, 85, 247, 0.18)',
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

        {/* Glowing Role Badge */}
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            margin: '0 auto 16px auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.25) 0%, rgba(124, 58, 237, 0.08) 70%)',
            border: '1px solid rgba(168, 85, 247, 0.4)',
            boxShadow: '0 0 24px rgba(168, 85, 247, 0.3)',
            color: '#C084FC',
          }}
        >
          <ShieldCheck size={30} />
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
          Change User Account Role
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
          Modify permissions and interface access for this user on OpenPath.
        </p>

        {/* Target User Banner */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            borderRadius: '12px',
            backgroundColor: 'var(--chip-bg)',
            border: '1px solid var(--border-color)',
            marginBottom: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img
              src={
                user.avatar ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=80'
              }
              alt={user.name}
              style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
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

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--secondary-text)', display: 'block', marginBottom: '2px' }}>
              Current Role
            </span>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '3px 10px',
                borderRadius: '9999px',
                textTransform: 'capitalize',
                backgroundColor:
                  currentRole === 'admin'
                    ? 'rgba(239, 68, 68, 0.2)'
                    : currentRole === 'employer'
                    ? 'rgba(236, 72, 153, 0.2)'
                    : 'rgba(124, 58, 237, 0.2)',
                color:
                  currentRole === 'admin' ? '#F87171' : currentRole === 'employer' ? '#F472B6' : '#C084FC',
                border: '1px solid var(--border-color)',
              }}
            >
              {currentRole}
            </span>
          </div>
        </div>

        {/* Role Options */}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
            {roles.map((r) => {
              const Icon = r.icon;
              const isSelected = selectedRole === r.id;
              const isCurrent = currentRole === r.id;

              return (
                <div
                  key={r.id}
                  onClick={() => setSelectedRole(r.id)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: isSelected ? `2px solid ${r.color}` : '1px solid var(--border-color)',
                    backgroundColor: isSelected ? r.bg : 'var(--card-bg)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    boxShadow: isSelected ? `0 0 16px ${r.color}25` : 'none',
                  }}
                >
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      backgroundColor: isSelected ? r.color : 'rgba(255, 255, 255, 0.06)',
                      color: isSelected ? '#FFFFFF' : r.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <Icon size={18} />
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px' }}>
                      <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--primary-text)' }}>
                        {r.title}
                      </span>
                      {isCurrent && (
                        <span style={{ fontSize: '0.7rem', color: 'var(--secondary-text)', fontStyle: 'italic' }}>
                          Current
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--secondary-text)', margin: 0, lineHeight: '1.4' }}>
                      {r.desc}
                    </p>
                  </div>

                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      border: isSelected ? `2px solid ${r.color}` : '2px solid var(--border-color)',
                      backgroundColor: isSelected ? r.color : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: '4px',
                    }}
                  >
                    {isSelected && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Admin Elevation Warning */}
          {selectedRole === 'admin' && currentRole !== 'admin' && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                borderRadius: '10px',
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                marginBottom: '20px',
              }}
            >
              <AlertTriangle size={18} color="#F87171" style={{ flexShrink: 0 }} />
              <p style={{ fontSize: '0.78rem', color: '#FCA5A5', margin: 0, lineHeight: '1.4' }}>
                <strong>High Privilege Warning:</strong> Granting Admin role gives this user full administrative control, including user banning and database operations.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
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
