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

  const handleEmployerPortalClick = () => {
    if (isAuthenticated && user?.role === 'employer') {
      navigate('employer-dashboard');
    } else if (isAuthenticated) {
      navigate('dashboard');
    } else {
      navigate('register');
    }
  };

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Decorative Aurora gradient halos */}
      <div className="bg-subtle-glow animate-pulse-glow" />
      <div className="bg-subtle-wave animate-pulse-glow" />

      {/* Top Header Navigation Bar */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backgroundColor: 'var(--nav-bg)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border-color)',
          padding: '12px 24px',
        }}
      >
        <div
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          {/* Logo */}
          <div
            onClick={() => navigate('landing')}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          >
            <AnimatedLogo size="sm" />
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.35rem',
                fontWeight: 800,
                color: 'var(--primary-text)',
                letterSpacing: '-0.4px',
              }}
            >
              Open<span className="gradient-text">Path</span>
            </span>
          </div>

          {/* Quick Nav Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button
              onClick={() => navigate('opportunities')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--secondary-text)',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
              }}
            >
              Browse Roles
            </button>
            <a
              href="#features"
              style={{
                fontSize: '0.9rem',
                fontWeight: 600,
                color: 'var(--secondary-text)',
                textDecoration: 'none',
              }}
            >
              Features
            </a>
            <a
              href="#how-it-works"
              style={{
                fontSize: '0.9rem',
                fontWeight: 600,
                color: 'var(--secondary-text)',
                textDecoration: 'none',
              }}
            >
              How It Works
            </a>
          </nav>

          {/* Actions & Theme Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ThemeToggle showLabel={true} size="default" />

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {isAuthenticated ? (
                <button
                  onClick={() => navigate(user?.role === 'employer' ? 'employer-dashboard' : 'dashboard')}
                  className="btn-liquid-glass"
                  style={{ padding: '8px 18px', fontSize: '0.875rem' }}
                >
                  Dashboard <ArrowRight size={14} />
                </button>
              ) : (
                <button
                  onClick={() => navigate('login')}
                  className="btn-liquid-glass"
                  style={{ padding: '8px 18px', fontSize: '0.875rem' }}
                >
                  Sign In
                </button>
              )}

              <button
                onClick={() => navigate('register')}
                className="btn-glow-ring"
                style={{ padding: '8px 22px', fontSize: '0.875rem', fontWeight: 700 }}
              >
                Get Started Free <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 1. HERO SECTION (3D Animated & Cinematic Scrolltide Experience) */}
      <section
        style={{
          padding: '60px 24px 80px 24px',
          maxWidth: '1240px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div
          className="hero-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1.1fr 0.9fr',
            gap: '48px',
            alignItems: 'center',
          }}
        >
          {/* Left Column: Headline & Scrolltide CTAs */}
          <div>
            {/* Scrolltide-Style Animated Announcement Pill */}
            <div
              onClick={() => navigate('register')}
              className="announcement-pill"
              style={{ marginBottom: '22px' }}
            >
              <span className="pill-pulse-dot" />
              <Sparkles size={15} />
              <span>
                {(platformContent?.heroAnnouncement?.text ||
                  'Next-Gen 3D Career Intelligence')
                  .replace(/•?\s*Live Database Connected/gi, '')
                  .trim()}
              </span>
              <ArrowRight size={14} />
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.6rem, 5vw, 4.1rem)',
                fontWeight: 800,
                color: 'var(--primary-text)',
                letterSpacing: '-1.5px',
                marginBottom: '20px',
                lineHeight: '1.15',
              }}
            >
              Your Path.{' '}
              <span className="gradient-text">
                Your Opportunity.
              </span>
            </h1>

            <p
              style={{
                fontSize: '1.15rem',
                color: 'var(--secondary-text)',
                marginBottom: '34px',
                lineHeight: '1.65',
                maxWidth: '540px',
              }}
            >
              Build Skills. Find Opportunities. Grow Your Future. Connect directly to internships,
              apprenticeships, and entry-level roles with explainable matching and guided skill roadmaps.
            </p>

            {/* Scrolltide Animated CTAs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
              <button
                onClick={() => navigate('register')}
                className="btn-glow-ring"
                style={{ padding: '15px 36px', fontSize: '1.05rem', fontWeight: 700 }}
              >
                Get Started Free <ArrowRight size={18} />
              </button>
              <button
                onClick={() => navigate('opportunities')}
                className="btn-liquid-glass"
                style={{ padding: '14px 34px', fontSize: '1.025rem' }}
              >
                Explore Opportunities <ArrowRight size={18} />
              </button>
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
                    <div style={{ height: '6px', backgroundColor: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: '100%', height: '100%', background: 'linear-gradient(90deg, #10B981, #34D399)', boxShadow: '0 0 10px #10B981' }} />
                    </div>
                  </div>

                  {/* Matched Skills Chips */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '18px' }}>
                    {heroSkills.map((s, idx) => (
                      <span key={idx} className="skill-chip skill-chip-matched">
                        {s.name || s}
                      </span>
                    ))}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.12)', paddingTop: '14px' }}>
                    <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-text)' }}>
                      {heroOpp.salary?.amount ? `${heroOpp.salary.amount} / ${heroOpp.salary.period}` : 'Competitive'}
                    </span>
                    <button
                      onClick={() => heroOpp._id ? navigate('details', { id: heroOpp._id }) : navigate('opportunities')}
                      className="btn-glow-ring"
                      style={{ padding: '8px 18px', fontSize: '0.825rem' }}
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
      <section
        id="how-it-works"
        style={{
          padding: '80px 24px',
          backgroundColor: 'rgba(124, 58, 237, 0.04)',
          borderTop: '1px solid var(--border-color)',
        }}
      >
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#C084FC', textTransform: 'uppercase', letterSpacing: '1px' }}>
              HOW IT WORKS
            </span>
            <h2 style={{ fontSize: '2.4rem', marginTop: '8px', color: 'var(--primary-text)' }}>A Visual Journey to Your Career</h2>
            <p style={{ fontSize: '1rem', color: 'var(--secondary-text)', marginTop: '8px' }}>
              From initial registration to landing interviews with guided skill enhancement.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
              gap: '20px',
            }}
          >
            {howItWorksSteps.map((step, idx) => (
              <div
                key={idx}
                className="card"
                style={{
                  padding: '26px',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  borderTop: '3px solid #A855F7',
                }}
              >
                <span
                  style={{
                    fontSize: '1.8rem',
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontFamily: 'var(--font-heading)',
                    marginBottom: '10px',
                  }}
                >
                  {step.step}
                </span>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '8px', color: 'var(--primary-text)' }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--secondary-text)', lineHeight: '1.6' }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CORE FEATURES SECTION */}
      <section id="features" style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#C084FC', textTransform: 'uppercase', letterSpacing: '1px' }}>
              CORE CAPABILITIES
            </span>
            <h2 style={{ fontSize: '2.4rem', marginTop: '8px', color: 'var(--primary-text)' }}>Built Exclusively for Early Career Success</h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '24px',
            }}
          >
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <Tilt3DCard key={idx} className="card" style={{ padding: '28px' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '14px',
                      backgroundColor: `${feat.color}22`,
                      border: `1px solid ${feat.color}55`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: feat.color,
                      marginBottom: '18px',
                      boxShadow: `0 0 15px ${feat.color}33`,
                    }}
                  >
                    <Icon size={24} />
                  </div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '10px', color: 'var(--primary-text)' }}>{feat.title}</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--secondary-text)', lineHeight: '1.6' }}>
                    {feat.desc}
                  </p>
                </Tilt3DCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. FOR STUDENTS & FOR EMPLOYERS SPLIT */}
      <section style={{ padding: '80px 24px', backgroundColor: 'rgba(124, 58, 237, 0.03)', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
            {/* For Students */}
            <Tilt3DCard
              className="card"
              style={{
                padding: '36px',
                background: 'var(--card-bg)',
                border: '1.5px solid rgba(124, 58, 237, 0.35)',
              }}
            >
              <span className="badge badge-internship" style={{ marginBottom: '14px' }}>
                {studentHighlight?.badge || 'FOR STUDENTS & FRESHERS'}
              </span>
              <h3 style={{ fontSize: '1.6rem', marginBottom: '12px', color: 'var(--primary-text)' }}>
                {studentHighlight?.title || 'Discover Roles That Fit Your True Potential'}
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                {(studentHighlight?.bullets || []).map((bullet, idx) => (
                  <li key={idx} style={{ display: 'flex', gap: '10px', fontSize: '0.9rem', color: 'var(--secondary-text)' }}>
                    <CheckCircle size={18} color="#7C3AED" style={{ flexShrink: 0 }} />
                    {bullet}
                  </li>
                ))}
              </ul>
              <button onClick={() => navigate('register')} className="btn-primary" style={{ width: '100%' }}>
                {studentHighlight?.ctaText || 'Create Student Profile'} <ArrowRight size={16} />
              </button>
            </Tilt3DCard>

            {/* For Employers */}
            <Tilt3DCard
              className="card"
              style={{
                padding: '36px',
                background: 'var(--card-bg)',
                border: '1.5px solid rgba(236, 72, 153, 0.35)',
              }}
            >
              <span className="badge badge-entry" style={{ marginBottom: '14px' }}>
                {employerHighlight?.badge || 'FOR EMPLOYERS & STARTUPS'}
              </span>
              <h3 style={{ fontSize: '1.6rem', marginBottom: '12px', color: 'var(--primary-text)' }}>
                {employerHighlight?.title || 'Find Early-Career Talent With Proven Skills'}
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                {(employerHighlight?.bullets || []).map((bullet, idx) => (
                  <li key={idx} style={{ display: 'flex', gap: '10px', fontSize: '0.9rem', color: 'var(--secondary-text)' }}>
                    <CheckCircle size={18} color="#EC4899" style={{ flexShrink: 0 }} />
                    {bullet}
                  </li>
                ))}
              </ul>
              <button
                onClick={handleEmployerPortalClick}
                className="btn-secondary"
                style={{ width: '100%', borderColor: 'rgba(236, 72, 153, 0.4)', color: '#EC4899' }}
              >
                {employerHighlight?.ctaText || 'Register as Employer'} <ArrowRight size={16} />
              </button>
            </Tilt3DCard>
          </div>
        </div>
      </section>

      {/* 5. OPPORTUNITIES PREVIEW SECTION */}
      {featuredOpps.length > 0 && (
        <section style={{ padding: '80px 24px' }}>
          <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '36px' }}>
              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#C084FC', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  LIVE PREVIEW
                </span>
                <h2 style={{ fontSize: '2.2rem', marginTop: '6px', color: 'var(--primary-text)' }}>Featured Open Opportunities</h2>
              </div>
              <button onClick={() => navigate('opportunities')} className="btn-secondary">
                View All Opportunities <ArrowRight size={16} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              {featuredOpps.map((opp) => (
                <OpportunityCard key={opp._id} opportunity={opp} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. TRUST & STATISTICS SECTION */}
      <section style={{ padding: '60px 24px', backgroundColor: 'rgba(124, 58, 237, 0.03)', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '24px',
              marginBottom: '16px',
            }}
          >
            <div>
              <h2 style={{ fontSize: '2.8rem', fontWeight: 800, color: '#C084FC' }}>
                {stats ? `${stats.totalOpportunities}` : '—'}
              </h2>
              <p style={{ fontSize: '0.95rem', color: 'var(--secondary-text)', fontWeight: 500 }}>Active Opportunities Listed</p>
            </div>
            <div>
              <h2 style={{ fontSize: '2.8rem', fontWeight: 800, color: '#F472B6' }}>
                {stats ? `${stats.totalEmployers}` : '—'}
              </h2>
              <p style={{ fontSize: '0.95rem', color: 'var(--secondary-text)', fontWeight: 500 }}>Verified Employers</p>
            </div>
            <div>
              <h2 style={{ fontSize: '2.8rem', fontWeight: 800, color: '#38BDF8' }}>
                {stats ? `${stats.totalStudents}` : '—'}
              </h2>
              <p style={{ fontSize: '0.95rem', color: 'var(--secondary-text)', fontWeight: 500 }}>Registered Candidates</p>
            </div>
            <div>
              <h2 style={{ fontSize: '2.8rem', fontWeight: 800, color: '#34D399' }}>
                {stats ? `${stats.totalSkills}` : '—'}
              </h2>
              <p style={{ fontSize: '0.95rem', color: 'var(--secondary-text)', fontWeight: 500 }}>Verified Technical Skills</p>
            </div>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#64748B' }}>
            *Live platform counts synced directly from the OpenPath database.
          </p>
        </div>
      </section>

      {/* 7. FINAL CTA BANNER */}
      <section style={{ padding: '80px 24px' }}>
        <div
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.8) 0%, rgba(217, 70, 239, 0.8) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '56px 40px',
            color: '#FFFFFF',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '24px',
            boxShadow: 'var(--shadow-neon)',
          }}
        >
          <div>
            <h2 style={{ color: '#FFFFFF', fontSize: '2.4rem', fontWeight: 800, marginBottom: '10px' }}>
              Ready to Discover Your Path?
            </h2>
            <p style={{ color: '#FDF4FF', fontSize: '1.05rem', maxWidth: '580px' }}>
              Connect with top companies hiring students, explore explainable match criteria, and upgrade your skills today.
            </p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            <button
              onClick={() => navigate('register')}
              className="btn-glow-ring"
              style={{
                padding: '14px 34px',
                fontSize: '1.025rem',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4)',
              }}
            >
              Get Started Free <ArrowRight size={18} />
            </button>
            <button
              onClick={() => navigate('opportunities')}
              className="btn-liquid-glass"
              style={{
                padding: '14px 34px',
                fontSize: '1.025rem',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
              }}
            >
              Browse Roles <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer
        style={{
          backgroundColor: 'var(--card-bg)',
          color: 'var(--secondary-text)',
          padding: '60px 24px 30px 24px',
          borderTop: '1px solid var(--border-color)',
        }}
      >
        <div
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '40px',
            marginBottom: '40px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary-text)', marginBottom: '14px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  color: '#FFFFFF',
                }}
              >
                OP
              </div>
              <strong style={{ fontSize: '1.15rem' }}>OpenPath</strong>
            </div>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>
              Connecting students and freshers with careers through explainable matching and guided learning.
            </p>
          </div>

          <div>
            <h4 style={{ color: 'var(--primary-text)', fontSize: '0.95rem', marginBottom: '14px' }}>For Candidates</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
              <a onClick={() => navigate('opportunities')} style={{ cursor: 'pointer', color: 'var(--secondary-text)' }}>
                Browse Internships
              </a>
              <a onClick={() => navigate('learning')} style={{ cursor: 'pointer', color: 'var(--secondary-text)' }}>
                Skill Roadmaps
              </a>
              <a onClick={() => navigate('register')} style={{ cursor: 'pointer', color: 'var(--secondary-text)' }}>
                Student Registration
              </a>
            </div>
          </div>

          <div>
            <h4 style={{ color: 'var(--primary-text)', fontSize: '0.95rem', marginBottom: '14px' }}>For Employers</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
              <a
                onClick={handleEmployerPortalClick}
                style={{ cursor: 'pointer', color: 'var(--secondary-text)' }}
              >
                Post an Opportunity
              </a>
              <a
                onClick={handleEmployerPortalClick}
                style={{ cursor: 'pointer', color: 'var(--secondary-text)' }}
              >
                Candidate Match Review
              </a>
            </div>
          </div>

          <div>
            <h4 style={{ color: 'var(--primary-text)', fontSize: '0.95rem', marginBottom: '14px' }}>Product Principles</h4>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>
              Explainable AI • Accessibility • Actionable Guidance • Privacy-First Data Protection.
            </p>
          </div>
        </div>

        <div
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            borderTop: '1px solid var(--border-color)',
            paddingTop: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.8rem',
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          <span>© 2026 OpenPath Platform. Built for Next-Gen Career Discovery.</span>
          <span>Brand Promise: Your Path. Your Opportunity.</span>
        </div>
      </footer>
    </div>
  );
}
