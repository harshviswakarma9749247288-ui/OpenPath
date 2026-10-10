import React, { useEffect } from 'react';
import { LogOut, X } from 'lucide-react';
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
    <div onClick={closeSignOutModal} className="modal-overlay">
      <div
        onClick={(e) => e.stopPropagation()}
        className="card anim-float-subtle admin-action-center-modal logout-confirm-box text-center"
      >
        {/* Close Button */}
        <button
          onClick={closeSignOutModal}
          className="modal-close-btn"
          title="Cancel and close"
        >
          <X size={18} />
        </button>

        {/* Glowing SignOut Icon Badge */}
        <div className="modal-icon-badge danger">
          <LogOut size={30} className="icon-offset-x" />
        </div>

        {/* Modal Title & Subtitle */}
        <h3 className="modal-title">
          Sign Out of OpenPath?
        </h3>

        <p className="modal-subtitle">
          {user?.name ? (
            <>
              Signing out will end the session for <strong>{user.name}</strong>.
              <br />
            </>
          ) : null}
          You will need to sign in again to view your dashboard, saved opportunities, and applications.
        </p>

        {/* Action Buttons */}
        <div className="modal-action-buttons">
          <button
            type="button"
            onClick={closeSignOutModal}
            className="btn-secondary modal-btn"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirmSignOut}
            className="btn-primary modal-btn-danger"
          >
            <LogOut size={16} /> Yes, Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
