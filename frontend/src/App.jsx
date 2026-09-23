import React, { useEffect } from 'react';
import { useAuthStore } from './store/useAuthStore';
import { useUIStore } from './store/useUIStore';

// Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

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

import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';

export default function App() {
  const { initAuth, isAuthenticated, user } = useAuthStore();
  const {
    activePage,
    pageParams,
    navigate,
    isMobileDrawerOpen,
    setMobileDrawerOpen,
    toast,
    clearToast,
  } = useUIStore();

  useEffect(() => {
    initAuth();
  }, []);

  const isPublicPage = ['landing', 'login', 'register'].includes(activePage);

  const renderActiveScreen = () => {
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
        return <StudentDashboard />;
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
        return <ApplicationsPage />;
      case 'profile':
        return <ProfilePage />;
      case 'employer-dashboard':
        return <EmployerDashboard />;
      case 'create-opportunity':
        return <CreateOpportunityPage />;
      case 'manage-opportunities':
        return <ManageOpportunitiesPage />;
      case 'candidate-review':
        return <CandidateReviewPage opportunityId={pageParams.opportunityId} />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="app-container">
      {/* Toast Notification Container */}
      {toast && (
        <div
          className="card animate-fade-in"
          style={{
            position: 'fixed',
            top: '20px',
            right: '24px',
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor:
              toast.type === 'success'
                ? '#ECFDF5'
                : toast.type === 'error'
                ? '#FEF2F2'
                : '#EFF6FF',
            border:
              toast.type === 'success'
                ? '1px solid #A7F3D0'
                : toast.type === 'error'
                ? '1px solid #FECACA'
                : '1px solid #BFDBFE',
            color:
              toast.type === 'success'
                ? '#047857'
                : toast.type === 'error'
                ? '#DC2626'
                : '#1D4ED8',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 9999,
            borderRadius: 'var(--radius-md)',
            fontSize: '0.875rem',
            fontWeight: 500,
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
          <button onClick={clearToast} style={{ color: 'inherit', marginLeft: '6px' }}>
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
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            zIndex: 100,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '280px',
              height: '100%',
              backgroundColor: '#FFFFFF',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <strong style={{ fontSize: '1.2rem', color: 'var(--secondary-navy)' }}>OpenPath</strong>
                <button onClick={() => setMobileDrawerOpen(false)}>
                  <X size={20} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button onClick={() => navigate('dashboard')} className="btn-ghost" style={{ justifyContent: 'flex-start' }}>
                  Student Hub
                </button>
                <button onClick={() => navigate('opportunities')} className="btn-ghost" style={{ justifyContent: 'flex-start' }}>
                  Browse Opportunities
                </button>
                <button onClick={() => navigate('applications')} className="btn-ghost" style={{ justifyContent: 'flex-start' }}>
                  My Applications
                </button>
                <button onClick={() => navigate('learning')} className="btn-ghost" style={{ justifyContent: 'flex-start' }}>
                  Skills & Learning
                </button>
                <button onClick={() => navigate('profile')} className="btn-ghost" style={{ justifyContent: 'flex-start' }}>
                  Digital Resume
                </button>
                <hr style={{ margin: '12px 0', border: 'none', borderTop: '1px solid #E2E8F0' }} />
                <button onClick={() => navigate('employer-dashboard')} className="btn-ghost" style={{ justifyContent: 'flex-start' }}>
                  Employer Hub
                </button>
                <button onClick={() => navigate('create-opportunity')} className="btn-ghost" style={{ justifyContent: 'flex-start' }}>
                  Post Opportunity
                </button>
                <button onClick={() => navigate('manage-opportunities')} className="btn-ghost" style={{ justifyContent: 'flex-start' }}>
                  Manage Listings
                </button>
                <button onClick={() => navigate('candidate-review')} className="btn-ghost" style={{ justifyContent: 'flex-start' }}>
                  Candidate Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Layout Rendering */}
      {isPublicPage ? (
        <div style={{ width: '100%' }}>{renderActiveScreen()}</div>
      ) : (
        <>
          <Sidebar />
          <div className="main-content">
            <Navbar />
            <main style={{ flex: 1 }}>{renderActiveScreen()}</main>
          </div>
        </>
      )}
    </div>
  );
}
