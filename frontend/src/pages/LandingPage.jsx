import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Target,
  Compass,
  CheckCircle,
  Briefcase,
  TrendingUp,
  Layers,
  Users,
  Search,
  BookOpen,
} from 'lucide-react';
import { useUIStore } from '../store/useUIStore';
import { useAuthStore } from '../store/useAuthStore';
import api from '../utils/api';
import OpportunityCard from '../components/OpportunityCard';
import MatchScoreBadge from '../components/MatchScoreBadge';
import ThemeToggle from '../components/ThemeToggle';
import ThreeHeroScene from '../components/ThreeHeroScene';
import Tilt3DCard from '../components/Tilt3DCard';
import AnimatedLogo from '../components/AnimatedLogo';

export default function LandingPage() {
  const { navigate } = useUIStore();
  const { isAuthenticated, user } = useAuthStore();
  const [featuredOpps, setFeaturedOpps] = useState([]);
  const [stats, setStats] = useState(null);
  const [platformContent, setPlatformContent] = useState(null);

  useEffect(() => {
    api
      .get('/opportunities?limit=4')
      .then((res) => {
        setFeaturedOpps(res?.data?.opportunities || []);
      })
      .catch(() => {});

    api
      .get('/stats/overview')
      .then((res) => {
        if (res?.data) {
          setStats(res.data);
          if (res.data.platformContent) {
            setPlatformContent(res.data.platformContent);
          }
        }
      })
      .catch(() => {});
  }, []);

  const iconMap = {
    Sparkles,
    Target,
    TrendingUp,
    Compass,
    Layers,
    BookOpen,
    Briefcase,
  };

  const howItWorksSteps = platformContent?.howItWorksSteps || [];
  const features = (platformContent?.features || []).map((f) => ({
    ...f,
    icon: iconMap[f.iconName] || Sparkles,
  }));
  const orbitBadges = platformContent?.heroOrbitBadges || [];
  const studentHighlight = platformContent?.roleHighlights?.student;
  const employerHighlight = platformContent?.roleHighlights?.employer;
  const skillGapPreview = platformContent?.skillGapPreview;

  const isStudent = user?.role === 'student';
  const isEmployer = user?.role === 'employer';
  const isAdmin = user?.role === 'admin';

  const getDashboardRoute = () => {
    if (isAdmin) return 'admin';
    if (isEmployer) return 'employer-dashboard';
    return 'dashboard';
  };

  const handleEmployerPortalClick = () => {
    if (isAuthenticated && user?.role === 'employer') {
      navigate('employer-dashboard');
    } else if (isAuthenticated && user?.role === 'admin') {
      navigate('admin');
    } else if (isAuthenticated) {
      navigate('dashboard');
    } else {
      navigate('register');
    }
  };

  return (
    <div className="landing-page-wrapper">
      {/* Decorative Aurora gradient halos */}
      <div className="bg-subtle-glow animate-pulse-glow" />
      <div className="bg-subtle-wave animate-pulse-glow" />

      {/* Top Header Navigation Bar */}
      <header className="landing-nav-header">
        <div className="landing-nav-container">
          {/* Logo */}
          <div
            onClick={() => navigate('landing')}
            className="landing-nav-logo"
          >
            <AnimatedLogo size="sm" />
            <span className="landing-nav-brand-text">
              Open<span className="gradient-text">Path</span>
            </span>
          </div>

          {/* Quick Nav Links */}
          <nav className="landing-nav-links">
            <button
              onClick={() => navigate('opportunities')}
              className="landing-nav-link-btn"
            >
              Browse Roles
            </button>
            <a
              href="#features"
              className="landing-nav-link-anchor"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="landing-nav-link-anchor"
            >
              How It Works
            </a>
          </nav>

          {/* Actions & Theme Toggle */}
          <div className="landing-nav-actions">
            <ThemeToggle showLabel={true} size="default" />

            {isAuthenticated ? (
              <div className="landing-nav-auth-group">
                <button
                  onClick={() => navigate('profile')}
                  title="View Profile"
                  className="landing-nav-user-chip"
                >
                  <img
                    src={
                      user?.avatar ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'
                    }
                    alt={user?.name}
                    className="landing-nav-user-avatar"
                  />
                  <span>{user?.name?.split(' ')[0] || 'User'}</span>
                  <span
                    className={`landing-nav-user-role-badge role-${user?.role}`}
                  >
                    {user?.role}
                  </span>
                </button>

                <button
                  onClick={() => navigate(getDashboardRoute())}
                  className="btn-glow-ring landing-nav-hub-btn"
                >
                  {isAdmin
                    ? '🛡️ Admin Command'
                    : isEmployer
                    ? '💼 Employer Hub'
                    : '🎓 Student Hub'} <ArrowRight size={14} />
                </button>
              </div>
            ) : (
              <div className="landing-nav-auth-group">
                <button
                  onClick={() => navigate('login')}
                  className="btn-liquid-glass landing-nav-signin-btn"
                >
                  Sign In
                </button>

                <button
                  onClick={() => navigate('register')}
                  className="btn-glow-ring landing-nav-register-btn"
                >
                  Get Started Free <ArrowRight size={15} />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 1. HERO SECTION (3D Animated & Cinematic Scrolltide Experience) */}
      <section className="landing-hero-section">
        <div className="hero-grid">
          {/* Left Column: Headline & Scrolltide CTAs */}
          <div>
            {/* Scrolltide-Style Animated Announcement Pill */}
            <div
              onClick={() => navigate(isAuthenticated ? getDashboardRoute() : 'register')}
              className="announcement-pill landing-hero-announcement-margin"
            >
              <span className="pill-pulse-dot" />
              <Sparkles size={15} />
              <span>
                {isAuthenticated
                  ? (isAdmin
                      ? '🛡️ Administrator Session Active • Manage Platform'
                      : isEmployer
                      ? `💼 ${user?.companyDetails?.companyName || 'Employer'} Portal Active • Review Candidates`
                      : '🎓 Student Portal Active • View AI Matches')
                  : (platformContent?.heroAnnouncement?.text ||
                      'Next-Gen 3D Career Intelligence')
                      .replace(/•?\s*Live Database Connected/gi, '')
                      .trim()}
              </span>
              <ArrowRight size={14} />
            </div>

            <h1 className="landing-hero-title-text">
              Your Path.{' '}
              <span className="gradient-text">
                Your Opportunity.
              </span>
            </h1>

            <p className="landing-hero-desc-text">
              Build Skills. Find Opportunities. Grow Your Future. Connect directly to internships,
              apprenticeships, and entry-level roles with explainable matching and guided skill roadmaps.
            </p>

            {/* Scrolltide Animated CTAs */}
            <div className="hero-cta-group">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => navigate(getDashboardRoute())}
                    className="btn-glow-ring hero-cta-btn-primary-lg"
                  >
                    {isAdmin
                      ? '🛡️ Admin Command Center'
                      : isEmployer
                      ? '💼 Go to Employer Hub'
                      : '🎓 Go to Student Hub'} <ArrowRight size={18} />
                  </button>
                  <button
                    onClick={() => navigate(isEmployer ? 'create-opportunity' : 'opportunities')}
                    className="btn-liquid-glass hero-cta-btn-secondary-lg"
                  >
                    {isEmployer ? 'Post Opportunity' : 'Explore Opportunities'} <ArrowRight size={18} />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate('register')}
                    className="btn-glow-ring hero-cta-btn-primary-lg"
                  >
                    Get Started Free <ArrowRight size={18} />
                  </button>
                  <button
                    onClick={() => navigate('opportunities')}
                    className="btn-liquid-glass hero-cta-btn-secondary-lg"
                  >
                    Explore Opportunities <ArrowRight size={18} />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Right Column: 3D Interactive WebGL Cyber Core + Floating Holographic Orbit Badges */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '560px',
            }}
          >
            {/* Interactive 3D Three.js WebGL Cinematic Core with Gyro & Scroll Momentum */}
            <div
              style={{
                position: 'absolute',
                inset: '-40px',
                zIndex: 1,
                pointerEvents: 'auto',
                opacity: 0.98,
              }}
            >
              <ThreeHeroScene />
            </div>

            {/* Interactive 3D Drag Tip Badge */}
            <div
              className="holo-orbit-badge"
              style={{
                position: 'absolute',
                top: '-20px',
                zIndex: 12,
                fontSize: '0.75rem',
                padding: '5px 14px',
                background: 'rgba(124, 58, 237, 0.25)',
                border: '1px solid rgba(168, 85, 247, 0.5)',
                boxShadow: '0 0 20px rgba(124, 58, 237, 0.35)',
              }}
            >
              <Sparkles size={13} color="#38BDF8" />
              <span>✦ Drag 3D Core to Rotate in 360°</span>
            </div>

            {/* Floating Holographic 3D Orbit Badges (Synced from Database) */}
            {orbitBadges[0] && (
              <div
                className="holo-orbit-badge anim-float-orbit-1"
                style={{ position: 'absolute', top: '35px', left: '-30px', zIndex: 11 }}
              >
                {orbitBadges[0].pulse && <span className="pill-pulse-dot" />}
                <span>🎯 {orbitBadges[0].label}</span>
              </div>
            )}

            {orbitBadges[1] && (
              <div
                className="holo-orbit-badge anim-float-orbit-2"
                style={{ position: 'absolute', top: '45px', right: '-30px', zIndex: 11 }}
              >
                <span>⚡ {orbitBadges[1].label}</span>
              </div>
            )}

            {orbitBadges[2] && (
              <div
                className="holo-orbit-badge anim-float-orbit-3"
                style={{ position: 'absolute', bottom: '110px', left: '-40px', zIndex: 11 }}
              >
                <span>💼 {orbitBadges[2].label}</span>
              </div>
            )}

            {orbitBadges[3] && (
              <div
                className="holo-orbit-badge anim-float-orbit-4"
                style={{ position: 'absolute', bottom: '20px', right: '-25px', zIndex: 11 }}
              >
                <span>🚀 {orbitBadges[3].label}</span>
              </div>
            )}

            {/* Featured Match Card Preview from Database */}
            {featuredOpps[0] && (() => {
              const heroOpp = featuredOpps[0];
              const heroSkills = (heroOpp.requiredSkills || []).slice(0, 4);

              return (
                <Tilt3DCard
                  className="card card-featured animate-fade-in anim-float-3d"
                  style={{
                    padding: '24px 26px',
                    position: 'relative',
                    zIndex: 2,
                    maxWidth: '400px',
                    width: '100%',
                    marginTop: '130px',
                    backgroundColor: 'rgba(15, 23, 42, 0.48)',
                    backdropFilter: 'blur(32px) saturate(200%)',
                    WebkitBackdropFilter: 'blur(32px) saturate(200%)',
                    border: '1px solid rgba(255, 255, 255, 0.22)',
                    boxShadow: '0 24px 50px rgba(0, 0, 0, 0.5), inset 0 1.5px 1px rgba(255, 255, 255, 0.35)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <span className="badge badge-internship">Featured Match</span>
                    <MatchScoreBadge score={heroOpp.matchScore || 94} size={46} showLabel={true} />
                  </div>

                  <h3 style={{ fontSize: '1.2rem', marginBottom: '4px', color: 'var(--primary-text)' }}>
                    {heroOpp.title}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--secondary-text)', marginBottom: '14px' }}>
                    {heroOpp.organization} • {heroOpp.location?.type} {heroOpp.location?.city ? `(${heroOpp.location.city})` : ''}
                  </p>

                  {/* Match Factors Snapshot */}
                  <div
                    style={{
                      marginBottom: '14px',
                      padding: '10px 12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '5px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem' }}>
                      <span style={{ color: 'var(--primary-text)' }}>Skill Match (50%)</span>
                      <strong style={{ color: '#10B981' }}>High Alignment</strong>
                    </div>
                    <div style={{ height: '5px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: '94%',
                          backgroundColor: '#10B981',
                          boxShadow: '0 0 10px #10B981',
                        }}
                      />
                    </div>
                  </div>

                  {/* Matched Skills Chips */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                    {heroSkills.map((s, idx) => (
                      <span key={idx} className="skill-chip skill-chip-matched">
                        {s.name || s}
                      </span>
                    ))}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#38BDF8' }}>
                      {heroOpp.salary?.amount ? `${heroOpp.salary.amount} / ${heroOpp.salary.period}` : 'Competitive'}
                    </span>
                    <button
                      onClick={() => heroOpp._id ? navigate('details', { id: heroOpp._id }) : navigate('opportunities')}
                      className="btn-glow-ring"
                      style={{ fontSize: '0.8rem', padding: '6px 14px' }}
                    >
                      View Live Match <ArrowRight size={14} />
                    </button>
                  </div>
                </Tilt3DCard>
              );
            })()}

            {/* Overlapping Skill Gap Preview Card from Database */}
            {skillGapPreview && (
              <Tilt3DCard
                className="card"
                onClick={() =>
                  navigate('learning', { skillName: skillGapPreview.targetSkill || 'Docker' })
                }
                style={{
                  position: 'absolute',
                  bottom: '-20px',
                  right: '-10px',
                  padding: '18px',
                  width: '270px',
                  zIndex: 3,
                  boxShadow: 'var(--shadow-lg), 0 0 20px rgba(236, 72, 153, 0.25)',
                  border: '1px solid rgba(236, 72, 153, 0.45)',
                  backgroundColor: 'var(--card-bg)',
                  backdropFilter: 'blur(16px)',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#EC4899', marginBottom: '8px' }}>
                  <TrendingUp size={16} />
                  <strong style={{ fontSize: '0.8rem' }}>{skillGapPreview.title}</strong>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--secondary-text)', marginBottom: '8px' }}>
                  {skillGapPreview.question}
                </p>
                <span className="skill-chip skill-chip-missing" style={{ fontSize: '0.7rem' }}>
                  {skillGapPreview.chipLabel}
                </span>
              </Tilt3DCard>
            )}
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="landing-how-section">
        <div className="landing-section-container">
          <div className="landing-section-header-center">
            <span className="landing-section-tag-purple">
              HOW IT WORKS
            </span>
            <h2 className="landing-section-title-lg">A Visual Journey to Your Career</h2>
            <p className="landing-section-desc-sub">
              From initial registration to landing interviews with guided skill enhancement.
            </p>
          </div>

          <div className="landing-how-grid">
            {howItWorksSteps.map((step, idx) => (
              <div key={idx} className="card landing-how-card">
                <span className="landing-how-step-num">
                  {step.step}
                </span>
                <h3 className="landing-how-title-text">
                  {step.title}
                </h3>
                <p className="landing-how-desc-text">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CORE FEATURES SECTION */}
      <section id="features" className="landing-features-section">
        <div className="landing-section-container">
          <div className="landing-section-header-center">
            <span className="landing-section-tag-purple">
              CORE CAPABILITIES
            </span>
            <h2 className="landing-section-title-lg">Built Exclusively for Early Career Success</h2>
          </div>

          <div className="landing-features-grid">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <Tilt3DCard key={idx} className="card landing-feature-card">
                  <div
                    className="landing-feature-icon-box"
                    style={{
                      backgroundColor: `${feat.color}22`,
                      border: `1px solid ${feat.color}55`,
                      color: feat.color,
                      boxShadow: `0 0 15px ${feat.color}33`,
                    }}
                  >
                    <Icon size={24} />
                  </div>
                  <h3 className="landing-feature-title-text">{feat.title}</h3>
                  <p className="landing-feature-desc-text">
                    {feat.desc}
                  </p>
                </Tilt3DCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. FOR STUDENTS & FOR EMPLOYERS SPLIT */}
      <section className="landing-split-section">
        <div className="landing-section-container">
          <div className="landing-split-grid">
            {/* For Students */}
            <Tilt3DCard className="card landing-split-card-student">
              <span className="badge badge-internship landing-split-badge-margin">
                {studentHighlight?.badge || 'FOR STUDENTS & FRESHERS'}
              </span>
              <h3 className="landing-split-title-text">
                {studentHighlight?.title || 'Discover Roles That Fit Your True Potential'}
              </h3>
              <ul className="landing-split-bullets-list">
                {(studentHighlight?.bullets || []).map((bullet, idx) => (
                  <li key={idx} className="landing-split-bullet-item">
                    <CheckCircle size={18} color="#7C3AED" className="landing-split-bullet-icon" />
                    {bullet}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate(isAuthenticated ? (isAdmin ? 'admin' : 'dashboard') : 'register')}
                className="btn-primary landing-split-btn-full"
              >
                {isAuthenticated
                  ? (isStudent
                      ? 'Open Student Hub'
                      : isAdmin
                      ? 'Inspect Student Catalog'
                      : 'Candidate Portal')
                  : (studentHighlight?.ctaText || 'Create Student Profile')} <ArrowRight size={16} />
              </button>
            </Tilt3DCard>

            {/* For Employers */}
            <Tilt3DCard className="card landing-split-card-employer">
              <span className="badge badge-entry landing-split-badge-margin">
                {employerHighlight?.badge || 'FOR EMPLOYERS & STARTUPS'}
              </span>
              <h3 className="landing-split-title-text">
                {employerHighlight?.title || 'Find Early-Career Talent With Proven Skills'}
              </h3>
              <ul className="landing-split-bullets-list">
                {(employerHighlight?.bullets || []).map((bullet, idx) => (
                  <li key={idx} className="landing-split-bullet-item">
                    <CheckCircle size={18} color="#EC4899" className="landing-split-bullet-icon" />
                    {bullet}
                  </li>
                ))}
              </ul>
              <button
                onClick={handleEmployerPortalClick}
                className="btn-secondary landing-split-btn-employer"
              >
                {isAuthenticated
                  ? (isEmployer
                      ? 'Open Employer Hub'
                      : isAdmin
                      ? 'Admin Moderation'
                      : 'Employer Portal')
                  : (employerHighlight?.ctaText || 'Register as Employer')} <ArrowRight size={16} />
              </button>
            </Tilt3DCard>
          </div>
        </div>
      </section>

      {/* 5. OPPORTUNITIES PREVIEW SECTION */}
      {featuredOpps.length > 0 && (
        <section className="landing-opps-preview-section">
          <div className="landing-section-container">
            <div className="landing-opps-header-row">
              <div>
                <span className="landing-section-tag-purple">
                  LIVE PREVIEW
                </span>
                <h2 className="landing-opps-preview-title">Featured Open Opportunities</h2>
              </div>
              <button onClick={() => navigate('opportunities')} className="btn-secondary">
                View All Opportunities <ArrowRight size={16} />
              </button>
            </div>

            <div className="landing-opps-preview-grid">
              {featuredOpps.map((opp) => (
                <OpportunityCard key={opp._id} opportunity={opp} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. TRUST & STATISTICS SECTION */}
      <section className="landing-trust-section">
        <div className="landing-trust-container">
          <div className="landing-trust-grid">
            <div>
              <h2 className="landing-trust-num-purple">
                {stats ? `${stats.totalOpportunities}` : '—'}
              </h2>
              <p className="landing-trust-label">Active Opportunities Listed</p>
            </div>
            <div>
              <h2 className="landing-trust-num-pink">
                {stats ? `${stats.totalEmployers}` : '—'}
              </h2>
              <p className="landing-trust-label">Verified Employers</p>
            </div>
            <div>
              <h2 className="landing-trust-num-cyan">
                {stats ? `${stats.totalStudents}` : '—'}
              </h2>
              <p className="landing-trust-label">Registered Candidates</p>
            </div>
            <div>
              <h2 className="landing-trust-num-green">
                {stats ? `${stats.totalSkills}` : '—'}
              </h2>
              <p className="landing-trust-label">Verified Technical Skills</p>
            </div>
          </div>
          <p className="landing-trust-footnote">
            *Live platform counts synced directly from the OpenPath database.
          </p>
        </div>
      </section>

      {/* 7. FINAL CTA BANNER */}
      <section className="landing-final-cta-section">
        <div className="landing-final-cta-card">
          <div>
            <h2 className="landing-final-cta-title">
              {isAuthenticated
                ? `Welcome back, ${user?.name?.split(' ')[0] || 'User'}!`
                : 'Ready to Discover Your Path?'}
            </h2>
            <p className="landing-final-cta-desc">
              {isAuthenticated
                ? (isAdmin
                    ? 'Supervise user accounts, inspect opportunity listings, and monitor live telemetry.'
                    : isEmployer
                    ? 'Review incoming applicants, manage active postings, and inspect candidate vector matches.'
                    : 'Track your application status, inspect 5-factor compatibility scores, and close skill gaps.')
                : 'Connect with top companies hiring students, explore explainable match criteria, and upgrade your skills today.'}
            </p>
          </div>
          <div className="landing-final-cta-btn-group">
            {isAuthenticated ? (
              <button
                onClick={() => navigate(getDashboardRoute())}
                className="btn-glow-ring landing-final-cta-btn-glow"
              >
                {isAdmin
                  ? '🛡️ Admin Command Center'
                  : isEmployer
                  ? '💼 Go to Employer Hub'
                  : '🎓 Go to Student Hub'} <ArrowRight size={18} />
              </button>
            ) : (
              <button
                onClick={() => navigate('register')}
                className="btn-glow-ring landing-final-cta-btn-glow"
              >
                Get Started Free <ArrowRight size={18} />
              </button>
            )}
            <button
              onClick={() => navigate('opportunities')}
              className="btn-liquid-glass landing-final-cta-btn-glass"
            >
              Browse Roles <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="landing-footer">
        <div className="landing-footer-grid">
          <div>
            <div className="landing-footer-brand-row">
              <div className="landing-footer-brand-badge">
                OP
              </div>
              <strong className="landing-footer-brand-title">OpenPath</strong>
            </div>
            <p className="landing-footer-desc-text">
              Connecting students and freshers with careers through explainable matching and guided learning.
            </p>
          </div>

          <div>
            <h4 className="landing-footer-col-title">For Candidates</h4>
            <div className="landing-footer-links-col">
              <a onClick={() => navigate('opportunities')} className="landing-footer-link-item">
                Browse Internships
              </a>
              <a onClick={() => navigate('learning')} className="landing-footer-link-item">
                Skill Roadmaps
              </a>
              {isAuthenticated ? (
                <a onClick={() => navigate(getDashboardRoute())} className="landing-footer-link-item">
                  {isAdmin ? 'Admin Command' : isEmployer ? 'Employer Hub' : 'Student Hub'}
                </a>
              ) : (
                <a onClick={() => navigate('register')} className="landing-footer-link-item">
                  Student Registration
                </a>
              )}
            </div>
          </div>

          <div>
            <h4 className="landing-footer-col-title">For Employers</h4>
            <div className="landing-footer-links-col">
              <a
                onClick={handleEmployerPortalClick}
                className="landing-footer-link-item"
              >
                Post an Opportunity
              </a>
              <a
                onClick={handleEmployerPortalClick}
                className="landing-footer-link-item"
              >
                Candidate Match Review
              </a>
            </div>
          </div>

          <div>
            <h4 className="landing-footer-col-title">Product Principles</h4>
            <p className="landing-footer-desc-text">
              Explainable AI • Accessibility • Actionable Guidance • Privacy-First Data Protection.
            </p>
            <a
              onClick={() => navigate('login')}
              className="landing-footer-admin-link"
            >
              🛡️ Admin Access Portal →
            </a>
          </div>
        </div>

        <div className="landing-footer-bottom-bar">
          <span>© 2026 OpenPath Platform. Built for Next-Gen Career Discovery.</span>
          <span>Brand Promise: Your Path. Your Opportunity.</span>
        </div>
      </footer>
    </div>
  );
}
