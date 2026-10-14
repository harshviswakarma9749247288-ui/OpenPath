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
        <div className="auth-guard-container">
          <div className="card card-featured animate-fade-in auth-guard-card">
            <div className="auth-guard-icon-box">
              <Lock size={28} />
            </div>
            <h2 className="auth-guard-title">
              Sign In Required
            </h2>
            <p className="auth-guard-subtitle">
              Your session has ended or you signed out. Please sign in to access your dashboard, applications, and profile.
            </p>
            <div className="auth-guard-actions">
              <button
                onClick={() => navigate('login', {}, { replace: true })}
                className="btn-primary auth-guard-btn"
              >
                Sign In Now <ArrowRight size={16} />
              </button>
              <button
                onClick={() => navigate('landing')}
                className="btn-secondary auth-guard-btn"
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
        return isAdmin ? <AdminPage /> : isEmployer ? <EmployerDashboard /> : <StudentDashboard />;
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
    <div className="app-container app-root">
      {/* Toast Notification Container */}
      {toast && (
        <div className={`card card-featured animate-fade-in app-toast-banner ${toast.type}`}>
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
            className="app-toast-close-btn"
            aria-label="Dismiss toast"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Mobile Drawer Backdrop & Drawer */}
      {isMobileDrawerOpen && (
        <div
          onClick={() => setMobileDrawerOpen(false)}
          className="mobile-drawer-overlay"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="mobile-drawer-pane"
          >
            <div>
              <div className="mobile-drawer-header">
                <strong className="mobile-drawer-title">OpenPath</strong>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="mobile-drawer-close-btn"
                  aria-label="Close mobile menu"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mobile-drawer-nav-list">
                {isAdmin ? (
                  <>
                    <button
                      onClick={() => {
                        navigate('admin');
                        setMobileDrawerOpen(false);
                      }}
                      className="btn-ghost mobile-nav-btn admin"
                    >
                      <ShieldCheck size={16} /> Admin Command Center
                    </button>
                    <button
                      onClick={() => {
                        navigate('opportunities');
                        setMobileDrawerOpen(false);
                      }}
                      className="btn-ghost mobile-nav-btn"
                    >
                      Browse Opportunities
                    </button>
                    <button
                      onClick={() => {
                        navigate('profile');
                        setMobileDrawerOpen(false);
                      }}
                      className="btn-ghost mobile-nav-btn"
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
                      className="btn-ghost mobile-nav-btn"
                    >
                      Employer Hub
                    </button>
                    <button
                      onClick={() => {
                        navigate('create-opportunity');
                        setMobileDrawerOpen(false);
                      }}
                      className="btn-ghost mobile-nav-btn"
                    >
                      Post Opportunity
                    </button>
                    <button
                      onClick={() => {
                        navigate('manage-opportunities');
                        setMobileDrawerOpen(false);
                      }}
                      className="btn-ghost mobile-nav-btn"
                    >
                      Manage Listings
                    </button>
                    <button
                      onClick={() => {
                        navigate('candidate-review');
                        setMobileDrawerOpen(false);
                      }}
                      className="btn-ghost mobile-nav-btn"
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
                      className="btn-ghost mobile-nav-btn"
                    >
                      Student Hub
                    </button>
                    <button
                      onClick={() => {
                        navigate('opportunities');
                        setMobileDrawerOpen(false);
                      }}
                      className="btn-ghost mobile-nav-btn"
                    >
                      Browse Opportunities
                    </button>
                    <button
                      onClick={() => {
                        navigate('applications');
                        setMobileDrawerOpen(false);
                      }}
                      className="btn-ghost mobile-nav-btn"
                    >
                      My Applications
                    </button>
                    <button
                      onClick={() => {
                        navigate('learning');
                        setMobileDrawerOpen(false);
                      }}
                      className="btn-ghost mobile-nav-btn"
                    >
                      Skills & Learning
                    </button>
                    <button
                      onClick={() => {
                        navigate('profile');
                        setMobileDrawerOpen(false);
                      }}
                      className="btn-ghost mobile-nav-btn"
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
                    className="btn-ghost mobile-nav-btn danger"
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                )}
              </div>
            </div>

            <div className="mobile-drawer-footer">
              <span className="candidate-bg-desc">Appearance</span>
              <ThemeToggle showLabel={true} size="sm" />
            </div>
          </div>
        </div>
      )}

      {/* Floating 3D Depth Particles */}
      <FloatingParticles3D count={28} />

      {/* Main Layout Rendering with 3D Page Transitions */}
      {isPublicPage || (!isAuthenticated && isProtectedPage) ? (
        <div key={activePage} className="page-transition-3d app-public-page">
          {renderActiveScreen()}
        </div>
      ) : (
        <>
          <Sidebar />
          <div className="main-content app-main-content">
            <Navbar />
            <main key={activePage} className="page-transition-3d app-main-view">
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