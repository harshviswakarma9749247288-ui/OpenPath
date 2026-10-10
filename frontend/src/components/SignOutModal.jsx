import React, { useEffect } from 'react';
import { LogOut, X, ShieldAlert } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useUIStore } from '../store/useUIStore';

export default function SignOutModal() {
  const { logout, user } = useAuthStore();
  const { isSignOutModalOpen, closeSignOutModal, navigate, showToast } = useUIStore();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isSignOutModalOpen) {
        closeSignOutModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSignOutModalOpen, closeSignOutModal]);

  if (!isSignOutModalOpen) return null;

  const handleConfirmSignOut = async () => {
    closeSignOutModal();
    try {
      await logout();
      // Replace history state so browser Back button will not navigate back to protected dashboard
      if (typeof window !== 'undefined') {
        window.history.replaceState({ page: 'login', params: {} }, '', '/login');
      }
      showToast('You have been signed out safely.', 'success');
      navigate('login', {}, { replace: true });
    } catch (err) {
      showToast('Signed out', 'info');
      navigate('login', {}, { replace: true });
    }
  };

  return (
    <div
      onClick={closeSignOutModal}
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
        className="card anim-float-subtle admin-action-center-modal logout-confirm-box"
        style={{
          maxWidth: '440px',
          width: '100%',
          padding: '32px 28px',
          backgroundColor: 'var(--card-bg)',
          borderRadius: '20px',
          border: '1px solid var(--border-color)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.5), 0 0 30px rgba(239, 68, 68, 0.15)',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        {/* Close Button */}
        <button
          onClick={closeSignOutModal}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
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

        {/* Glowing SignOut Icon Badge */}
        <div
          style={{
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            margin: '0 auto 20px auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle, rgba(239, 68, 68, 0.22) 0%, rgba(225, 29, 72, 0.08) 70%)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            boxShadow: '0 0 25px rgba(239, 68, 68, 0.3)',
            color: '#F43F5E',
          }}
        >
          <LogOut size={30} style={{ transform: 'translateX(2px)' }} />
        </div>

        {/* Modal Title & Subtitle */}
        <h3
          style={{
            fontSize: '1.4rem',
            fontWeight: 800,
            color: 'var(--primary-text)',
            marginBottom: '10px',
            letterSpacing: '-0.3px',
          }}
        >
          Sign Out of OpenPath?
        </h3>

        <p
          style={{
            fontSize: '0.9rem',
            color: 'var(--secondary-text)',
            lineHeight: '1.6',
            marginBottom: '26px',
          }}
        >
          {user?.name ? (
            <>
              Signing out will end the session for <strong style={{ color: 'var(--primary-text)' }}>{user.name}</strong>.
              <br />
            </>
          ) : null}
          You will need to sign in again to view your dashboard, saved opportunities, and applications.
        </p>

        {/* Action Buttons */}
        <div className="modal-action-buttons" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <button
            type="button"
            onClick={closeSignOutModal}
            className="btn-secondary"
            style={{
              padding: '12px 18px',
              fontSize: '0.925rem',
              fontWeight: 600,
              borderRadius: '12px',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirmSignOut}
            style={{
              padding: '12px 18px',
              fontSize: '0.925rem',
              fontWeight: 700,
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
              color: '#FFFFFF',
              boxShadow: '0 4px 18px rgba(239, 68, 68, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            <LogOut size={16} /> Yes, Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
