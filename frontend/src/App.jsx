import React, { useEffect } from 'react';
import { useAuthStore } from './store/useAuthStore';
import { useUIStore, PROTECTED_PAGES } from './store/useUIStore';

// Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ThemeToggle from './components/ThemeToggle';
import FloatingParticles3D from './components/FloatingParticles3D';
import AiAssistantDrawer from './components/AiAssistantDrawer';
import SignOutModal from './components/SignOutModal';

// Pages (All 16 Approved Screens)
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfileSetupPage from './pages/ProfileSetupPage';
import StudentDashboard from './pages/StudentDashboard';
import OpportunitiesPage from './pages/OpportunitiesPage';
import OpportunityDetailsPage from './pages/OpportunityDetailsPage';
import MatchExplanationPage from './pages/MatchExplanationPage';
import SkillGapPage from './pages/SkillGapPage';
import LearningRecommendationsPage from './pages/LearningRecommendationsPage';
import ApplicationsPage from './pages/ApplicationsPage';
import ProfilePage from './pages/ProfilePage';
import EmployerDashboard from './pages/EmployerDashboard';
import CreateOpportunityPage from './pages/CreateOpportunityPage';
import ManageOpportunitiesPage from './pages/ManageOpportunitiesPage';
import CandidateReviewPage from './pages/CandidateReviewPage';
import AdminPage from './pages/AdminPage';

import { X, CheckCircle2, AlertCircle, Info, Lock, LogOut, ArrowRight, ShieldCheck } from 'lucide-react';

export default function App() {
  const { initAuth, isAuthenticated, user, isLoading } = useAuthStore();
  const {
    activePage,
    pageParams,
    navigate,
    isMobileDrawerOpen,
    setMobileDrawerOpen,
    openSignOutModal,
    toast,
    clearToast,
    showToast,
  } = useUIStore();

  useEffect(() => {
    initAuth();
  }, []);

  const isProtectedPage = PROTECTED_PAGES.includes(activePage);

  // Security route guard: Redirect unauthenticated visits to protected pages (including browser Back button)
  useEffect(() => {
    if (!isAuthenticated && isProtectedPage && !isLoading) {
      navigate('login', {}, { replace: true });
      showToast('Please sign in to access that page.', 'info');
    }
  }, [isAuthenticated, isProtectedPage, isLoading, navigate, showToast]);

  const isPublicPage = ['landing', 'login', 'register'].includes(activePage);
  const isEmployer = user?.role === 'employer';
  const isAdmin = user?.role === 'admin';

  const renderActiveScreen = () => {
    // If not authenticated and trying to view a protected page, render login requirement prompt
    if (!isAuthenticated && isProtectedPage) {
      return (
        <div style={{ minHeight: '65vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div
            className="card card-featured animate-fade-in"
            style={{
              maxWidth: '450px',
              width: '100%',
              textAlign: 'center',
              padding: '40px 32px',
              backgroundColor: 'var(--card-bg)',
              borderRadius: '20px',
              border: '1px solid var(--border-color)',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(236, 72, 153, 0.15)',
                border: '1px solid rgba(236, 72, 153, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 18px auto',
                color: '#EC4899',
              }}
            >
              <Lock size={28} />
            </div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, marginBottom: '8px', color: 'var(--primary-text)' }}>
              Sign In Required
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--secondary-text)', marginBottom: '24px', lineHeight: '1.6' }}>
              Your session has ended or you signed out. Please sign in to access your dashboard, applications, and profile.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => navigate('login', {}, { replace: true })}
                className="btn-primary"
                style={{ padding: '11px 26px', fontSize: '0.95rem' }}
              >
                Sign In Now <ArrowRight size={16} />
              </button>
              <button
                onClick={() => navigate('landing')}
                className="btn-secondary"
                style={{ padding: '11px 20px', fontSize: '0.95rem' }}
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    switch (activePage) {
      case 'landing':
        return <LandingPage />;
      case 'login':
        return <LoginPage />;
      case 'register':
        return <RegisterPage />;
      case 'profile-setup':
        return <ProfileSetupPage />;
      case 'dashboard':
        return isAdmin ? <AdminPage /> : isEmployer ? <EmployerDashboard /> : <StudentDashboard />;
      case 'admin':
        return <AdminPage />;
      case 'opportunities':
        return <OpportunitiesPage />;
      case 'details':
        return <OpportunityDetailsPage opportunityId={pageParams.id} />;
      case 'match':
        return <MatchExplanationPage opportunityId={pageParams.id} />;
      case 'skill-gap':
        return <SkillGapPage opportunityId={pageParams.id} />;
      case 'learning':
        return (
          <LearningRecommendationsPage
            skillId={pageParams.skillId}
            skillName={pageParams.skillName}
          />
        );
      case 'applications':
        return isAdmin ? <AdminPage initialTab="applications" /> : <ApplicationsPage />;
      case 'profile':
        return <ProfilePage />;
      case 'employer-dashboard':
        return isEmployer ? <EmployerDashboard /> : isAdmin ? <AdminPage /> : <StudentDashboard />;
      case 'create-opportunity':
        return isEmployer ? <CreateOpportunityPage /> : isAdmin ? <CreateOpportunityPage /> : <StudentDashboard />;
      case 'manage-opportunities':
        return isEmployer ? <ManageOpportunitiesPage /> : isAdmin ? <ManageOpportunitiesPage /> : <StudentDashboard />;
      case 'candidate-review':
        return isEmployer ? (
          <CandidateReviewPage opportunityId={pageParams.opportunityId} />
        ) : (
          isAdmin ? <CandidateReviewPage opportunityId={pageParams.opportunityId} /> : <StudentDashboard />
        );
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="app-container" style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Toast Notification Container */}
      {toast && (
        <div
          className="card card-featured animate-fade-in"
          style={{
            position: 'fixed',
            top: '20px',
            right: '24px',
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor:
              toast.type === 'success'
                ? 'var(--status-green-bg)'
                : toast.type === 'error'
                ? 'var(--status-red-bg)'
                : 'var(--status-purple-bg)',
            border:
              toast.type === 'success'
                ? '1px solid var(--status-green-border)'
                : toast.type === 'error'
                ? '1px solid var(--status-red-border)'
                : '1px solid var(--status-purple-border)',
            color:
              toast.type === 'success'
                ? 'var(--status-green-text)'
                : toast.type === 'error'
                ? 'var(--status-red-text)'
                : 'var(--status-purple-text)',
            boxShadow: 'var(--shadow-md)',
            zIndex: 9999,
            borderRadius: 'var(--radius-md)',
            fontSize: '0.875rem',
            fontWeight: 600,
            backdropFilter: 'blur(16px)',
          }}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 size={18} />
          ) : toast.type === 'error' ? (
            <AlertCircle size={18} />
          ) : (
            <Info size={18} />
          )}
          <span>{toast.message}</span>
          <button
            onClick={clearToast}
            style={{ color: 'inherit', marginLeft: '6px', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Mobile Drawer Backdrop & Drawer */}
      {isMobileDrawerOpen && (
        <div
          onClick={() => setMobileDrawerOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(7, 10, 19, 0.8)',
            backdropFilter: 'blur(8px)',
            zIndex: 100,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '280px',
              height: '100%',
              backgroundColor: 'var(--sidebar-bg)',
              borderRight: '1px solid var(--border-color)',
              backdropFilter: 'blur(20px)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <strong style={{ fontSize: '1.2rem', color: 'var(--primary-text)' }}>OpenPath</strong>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  style={{ color: 'var(--secondary-text)', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {isAdmin ? (
                  <>
                    <button
                      onClick={() => {
                        navigate('admin');
                        setMobileDrawerOpen(false);
                      }}
                      className="btn-ghost"
                      style={{ justifyContent: 'flex-start', color: '#EC4899', fontWeight: 700 }}
                    >
                      <ShieldCheck size={16} /> Admin Command Center
                    </button>
                    <button
                      onClick={() => {
                        navigate('opportunities');
                        setMobileDrawerOpen(false);
                      }}
                      className="btn-ghost"
                      style={{ justifyContent: 'flex-start' }}
                    >
                      Browse Opportunities
                    </button>
                    <button
                      onClick={() => {
                        navigate('profile');
                        setMobileDrawerOpen(false);
                      }}
                      className="btn-ghost"
                      style={{ justifyContent: 'flex-start' }}
                    >
                      Admin Profile
                    </button>
                  </>
                ) : isEmployer ? (
                  <>
                    <button
                      onClick={() => {
                        navigate('employer-dashboard');
                        setMobileDrawerOpen(false);
                      }}
                      className="btn-ghost"
                      style={{ justifyContent: 'flex-start' }}
                    >
                      Employer Hub
                    </button>
                    <button
                      onClick={() => {
                        navigate('create-opportunity');
                        setMobileDrawerOpen(false);
                      }}
                      className="btn-ghost"
                      style={{ justifyContent: 'flex-start' }}
                    >
                      Post Opportunity
                    </button>
                    <button
                      onClick={() => {
                        navigate('manage-opportunities');
                        setMobileDrawerOpen(false);
                      }}
                      className="btn-ghost"
                      style={{ justifyContent: 'flex-start' }}
                    >
                      Manage Listings
                    </button>
                    <button
                      onClick={() => {
                        navigate('candidate-review');
                        setMobileDrawerOpen(false);
                      }}
                      className="btn-ghost"
                      style={{ justifyContent: 'flex-start' }}
                    >
                      Candidate Review
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        navigate('dashboard');
                        setMobileDrawerOpen(false);
                      }}
                      className="btn-ghost"
                      style={{ justifyContent: 'flex-start' }}
                    >
                      Student Hub
                    </button>
                    <button
                      onClick={() => {
                        navigate('opportunities');
                        setMobileDrawerOpen(false);
                      }}
                      className="btn-ghost"
                      style={{ justifyContent: 'flex-start' }}
                    >
                      Browse Opportunities
                    </button>
                    <button
                      onClick={() => {
                        navigate('applications');
                        setMobileDrawerOpen(false);
                      }}
                      className="btn-ghost"
                      style={{ justifyContent: 'flex-start' }}
                    >
                      My Applications
                    </button>
                    <button
                      onClick={() => {
                        navigate('learning');
                        setMobileDrawerOpen(false);
                      }}
                      className="btn-ghost"
                      style={{ justifyContent: 'flex-start' }}
                    >
                      Skills & Learning
                    </button>
                    <button
                      onClick={() => {
                        navigate('profile');
                        setMobileDrawerOpen(false);
                      }}
                      className="btn-ghost"
                      style={{ justifyContent: 'flex-start' }}
                    >
                      Digital Resume
                    </button>
                  </>
                )}
                {isAuthenticated && (
                  <button
                    onClick={() => {
                      setMobileDrawerOpen(false);
                      openSignOutModal();
                    }}
                    className="btn-ghost"
                    style={{ justifyContent: 'flex-start', color: '#F43F5E', marginTop: '6px' }}
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                )}
              </div>
            </div>

            <div
              style={{
                paddingTop: '16px',
                borderTop: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--secondary-text)' }}>Appearance</span>
              <ThemeToggle showLabel={true} size="sm" />
            </div>
          </div>
        </div>
      )}

      {/* Floating 3D Depth Particles */}
      <FloatingParticles3D count={28} />

      {/* Main Layout Rendering with 3D Page Transitions */}
      {isPublicPage || (!isAuthenticated && isProtectedPage) ? (
        <div key={activePage} className="page-transition-3d" style={{ width: '100%', position: 'relative', zIndex: 1 }}>
          {renderActiveScreen()}
        </div>
      ) : (
        <>
          <Sidebar />
          <div className="main-content" style={{ position: 'relative', zIndex: 1 }}>
            <Navbar />
            <main key={activePage} className="page-transition-3d" style={{ flex: 1 }}>
              {renderActiveScreen()}
            </main>
          </div>
        </>
      )}

      {/* Privacy-Preserving Local AI Agent Drawer */}
      <AiAssistantDrawer />

      {/* Centered Sign Out Confirmation Modal */}
      <SignOutModal />
    </div>
  );
}