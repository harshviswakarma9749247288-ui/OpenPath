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

export default function LandingPage() {
  const { navigate } = useUIStore();
  const { isAuthenticated, user, demoLogin } = useAuthStore();
  const [featuredOpps, setFeaturedOpps] = useState([]);

  useEffect(() => {
    api
      .get('/opportunities?limit=3')
      .then((res) => {
        setFeaturedOpps(res.data.opportunities?.slice(0, 3) || []);
      })
      .catch(() => {});
  }, []);

  const howItWorksSteps = [
    { step: '01', title: 'Register Account', desc: 'Sign up as a Student or Employer with role-tailored onboarding.' },
    { step: '02', title: 'Build Profile', desc: 'List your skills, coursework, degree, and career interests with instant completeness scoring.' },
    { step: '03', title: 'Discover & Match', desc: 'See weighted 5-factor match scores explaining exactly why an internship fits your profile.' },
    { step: '04', title: 'Bridge Skill Gaps', desc: 'Identify missing competencies and explore direct learning roadmaps before applying.' },
    { step: '05', title: 'Apply & Track', desc: 'Submit one-click profile applications and track interview progression in real time.' },
  ];

  const features = [
    {
      icon: Target,
      title: '5-Factor Explainable Matching',
      desc: 'No black-box rejection. Transparently computes matches across Skills (40%), Qualifications (20%), Location (20%), Interests (10%), and Experience (10%).',
      color: '#A855F7',
    },
    {
      icon: TrendingUp,
      title: 'Actionable Skill-Gap Insights',
      desc: 'Instantly view matched vs missing skills for any role, paired directly with curated roadmaps so you learn what matters.',
      color: '#EC4899',
    },
    {
      icon: Compass,
      title: 'Fresher-First Discovery',
      desc: 'Browse internships, apprenticeships, and entry-level positions verified for zero-to-low experience candidates.',
      color: '#06B6D4',
    },
    {
      icon: Layers,
      title: 'Unified Application Pipeline',
      desc: 'Track every stage from Reviewing and Shortlisting to Interview schedules with calendar links.',
      color: '#10B981',
    },
  ];

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
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #7C3AED 0%, #C026D3 50%, #EC4899 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '1.15rem',
                boxShadow: '0 0 15px rgba(236, 72, 153, 0.45)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
              }}
            >
              OP
            </div>
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

            {isAuthenticated ? (
              <button
                onClick={() => navigate(user?.role === 'employer' ? 'employer-dashboard' : 'dashboard')}
                className="btn-primary"
                style={{ padding: '8px 18px', fontSize: '0.875rem' }}
              >
                Dashboard <ArrowRight size={15} />
              </button>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => navigate('login')}
                  className="btn-secondary"
                  style={{ padding: '8px 18px', fontSize: '0.875rem' }}
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('register')}
                  className="btn-primary"
                  style={{ padding: '8px 18px', fontSize: '0.875rem' }}
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 1. HERO SECTION */}
      <section
        style={{
          padding: '60px 24px 70px 24px',
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
          {/* Left Column: Headline & CTAs */}
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 16px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(124, 58, 237, 0.15)',
                color: '#C084FC',
                fontSize: '0.85rem',
                fontWeight: 700,
                marginBottom: '20px',
                border: '1px solid rgba(168, 85, 247, 0.4)',
                boxShadow: '0 0 15px rgba(124, 58, 237, 0.2)',
              }}
            >
              <Sparkles size={16} /> Intelligent Opportunity & Skill Platform
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.6rem, 5vw, 4rem)',
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
                marginBottom: '32px',
                lineHeight: '1.6',
                maxWidth: '540px',
              }}
            >
              Build Skills. Find Opportunities. Grow Your Future. Connect directly to internships,
              apprenticeships, and entry-level roles with explainable matching and guided skill roadmaps.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginBottom: '32px' }}>
              <button
                onClick={() => navigate(isAuthenticated ? 'dashboard' : 'register')}
                className="btn-primary"
                style={{ padding: '14px 32px', fontSize: '1rem' }}
              >
                Get Started <ArrowRight size={18} />
              </button>
              <button
                onClick={() => navigate('opportunities')}
                className="btn-secondary"
                style={{ padding: '14px 32px', fontSize: '1rem' }}
              >
                Explore Opportunities
              </button>
            </div>

            {/* Quick Demo Login Bar for Evaluators */}
            <div
              style={{
                padding: '14px 20px',
                backgroundColor: 'var(--card-bg)',
                backdropFilter: 'blur(16px)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-md)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                flexWrap: 'wrap',
              }}
            >
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#7C3AED' }}>
                ⚡ Instant Demo:
              </span>
              <button
                onClick={async () => {
                  await demoLogin('student');
                  navigate('dashboard');
                }}
                className="btn-outline"
                style={{ padding: '6px 14px', fontSize: '0.775rem' }}
              >
                Student Demo
              </button>
              <button
                onClick={async () => {
                  await demoLogin('employer');
                  navigate('employer-dashboard');
                }}
                className="btn-outline"
                style={{
                  padding: '6px 14px',
                  fontSize: '0.775rem',
                  borderColor: 'rgba(236, 72, 153, 0.5)',
                  color: '#F472B6',
                  backgroundColor: 'rgba(236, 72, 153, 0.08)',
                }}
              >
                Employer Demo
              </button>
            </div>
          </div>

          {/* Right Column: Real OpenPath UI Preview Cards */}
          <div style={{ position: 'relative' }}>
            {/* Featured Match Card Preview */}
            <div
              className="card card-featured animate-fade-in"
              style={{
                padding: '28px',
                position: 'relative',
                zIndex: 2,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span className="badge badge-internship">Featured Match</span>
                <MatchScoreBadge score={94} size={48} showLabel={true} />
              </div>

              <h3 style={{ fontSize: '1.25rem', marginBottom: '4px', color: 'var(--primary-text)' }}>
                Frontend Engineering Intern
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--secondary-text)', marginBottom: '16px' }}>
                TechCorp Labs • Bengaluru (Remote)
              </p>

              {/* Match Factors Snapshot */}
              <div
                style={{
                  marginBottom: '16px',
                  padding: '12px',
                  backgroundColor: 'var(--box-subtle)',
                  borderRadius: '10px',
                  border: '1px solid var(--box-subtle-border)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem' }}>
                  <span style={{ color: 'var(--primary-text)' }}>Skill Match (40%)</span>
                  <strong style={{ color: '#10B981' }}>100% matched</strong>
                </div>
                <div style={{ height: '6px', backgroundColor: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: '100%', height: '100%', background: 'linear-gradient(90deg, #10B981, #34D399)', boxShadow: '0 0 10px #10B981' }} />
                </div>
              </div>

              {/* Matched Skills Chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                <span className="skill-chip skill-chip-matched">React</span>
                <span className="skill-chip skill-chip-matched">JavaScript</span>
                <span className="skill-chip skill-chip-matched">REST APIs</span>
                <span className="skill-chip skill-chip-matched">Git</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-text)' }}>
                  ₹35,000 / month
                </span>
                <button
                  onClick={() => navigate('opportunities')}
                  className="btn-primary"
                  style={{ padding: '7px 18px', fontSize: '0.8rem' }}
                >
                  View Live Match
                </button>
              </div>
            </div>

            {/* Overlapping Skill Gap Preview Card */}
            <div
              className="card"
              style={{
                position: 'absolute',
                bottom: '-25px',
                right: '-15px',
                padding: '18px',
                width: '270px',
                zIndex: 3,
                boxShadow: 'var(--shadow-lg), 0 0 20px rgba(236, 72, 153, 0.15)',
                border: '1px solid rgba(236, 72, 153, 0.35)',
                backgroundColor: 'var(--card-bg)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#EC4899', marginBottom: '8px' }}>
                <TrendingUp size={16} />
                <strong style={{ fontSize: '0.8rem' }}>Skill Gap Guidance</strong>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--secondary-text)', marginBottom: '8px' }}>
                Missing Docker for Full-Stack role?
              </p>
              <span className="skill-chip skill-chip-missing" style={{ fontSize: '0.7rem' }}>
                Docker Hands-on (3.5h)
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS SECTION (5-Step Visual Journey) */}
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
            <h2 style={{ fontSize: '2.4rem', marginTop: '8px', color: 'var(--primary-text)' }}>A Five-Step Visual Journey to Your Career</h2>
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
                <div key={idx} className="card" style={{ padding: '28px' }}>
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
                </div>
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
            <div
              className="card"
              style={{
                padding: '36px',
                background: 'var(--card-bg)',
                border: '1.5px solid rgba(124, 58, 237, 0.35)',
              }}
            >
              <span className="badge badge-internship" style={{ marginBottom: '14px' }}>
                FOR STUDENTS & FRESHERS
              </span>
              <h3 style={{ fontSize: '1.6rem', marginBottom: '12px', color: 'var(--primary-text)' }}>Discover Roles That Fit Your True Potential</h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                <li style={{ display: 'flex', gap: '10px', fontSize: '0.9rem', color: 'var(--secondary-text)' }}>
                  <CheckCircle size={18} color="#7C3AED" style={{ flexShrink: 0 }} />
                  Understand why an opportunity matches you with 5 distinct factor scores.
                </li>
                <li style={{ display: 'flex', gap: '10px', fontSize: '0.9rem', color: 'var(--secondary-text)' }}>
                  <CheckCircle size={18} color="#7C3AED" style={{ flexShrink: 0 }} />
                  Access 5-stage learning roadmaps to conquer missing skills.
                </li>
                <li style={{ display: 'flex', gap: '10px', fontSize: '0.9rem', color: 'var(--secondary-text)' }}>
                  <CheckCircle size={18} color="#7C3AED" style={{ flexShrink: 0 }} />
                  Track applications in a real-time status progression pipeline.
                </li>
              </ul>
              <button onClick={() => navigate('register')} className="btn-primary" style={{ width: '100%' }}>
                Create Student Profile <ArrowRight size={16} />
              </button>
            </div>

            {/* For Employers */}
            <div
              className="card"
              style={{
                padding: '36px',
                background: 'var(--card-bg)',
                border: '1.5px solid rgba(236, 72, 153, 0.35)',
              }}
            >
              <span className="badge badge-entry" style={{ marginBottom: '14px' }}>
                FOR EMPLOYERS & STARTUPS
              </span>
              <h3 style={{ fontSize: '1.6rem', marginBottom: '12px', color: 'var(--primary-text)' }}>Find Early-Career Talent With Proven Skills</h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                <li style={{ display: 'flex', gap: '10px', fontSize: '0.9rem', color: 'var(--secondary-text)' }}>
                  <CheckCircle size={18} color="#EC4899" style={{ flexShrink: 0 }} />
                  Post internships & entry jobs using our 5-step structured wizard.
                </li>
                <li style={{ display: 'flex', gap: '10px', fontSize: '0.9rem', color: 'var(--secondary-text)' }}>
                  <CheckCircle size={18} color="#EC4899" style={{ flexShrink: 0 }} />
                  Review candidates ranked by algorithmic skill compatibility scores.
                </li>
                <li style={{ display: 'flex', gap: '10px', fontSize: '0.9rem', color: 'var(--secondary-text)' }}>
                  <CheckCircle size={18} color="#EC4899" style={{ flexShrink: 0 }} />
                  Manage applications from review to shortlist and interview scheduling.
                </li>
              </ul>
              <button
                onClick={() => {
                  demoLogin('employer');
                  navigate('employer-dashboard');
                }}
                className="btn-secondary"
                style={{ width: '100%', borderColor: 'rgba(236, 72, 153, 0.4)', color: '#EC4899' }}
              >
                Employer Portal <ArrowRight size={16} />
              </button>
            </div>
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
              <h2 style={{ fontSize: '2.8rem', fontWeight: 800, color: '#C084FC' }}>1,000+</h2>
              <p style={{ fontSize: '0.95rem', color: 'var(--secondary-text)', fontWeight: 500 }}>Opportunities Listed</p>
            </div>
            <div>
              <h2 style={{ fontSize: '2.8rem', fontWeight: 800, color: '#F472B6' }}>500+</h2>
              <p style={{ fontSize: '0.95rem', color: 'var(--secondary-text)', fontWeight: 500 }}>Active Employers</p>
            </div>
            <div>
              <h2 style={{ fontSize: '2.8rem', fontWeight: 800, color: '#38BDF8' }}>5,000+</h2>
              <p style={{ fontSize: '0.95rem', color: 'var(--secondary-text)', fontWeight: 500 }}>Students & Freshers</p>
            </div>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#64748B' }}>
            *Figures labeled as illustrative platform projections for hackathon presentation.
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
          <div style={{ display: 'flex', gap: '14px' }}>
            <button
              onClick={() => navigate('register')}
              style={{
                backgroundColor: '#FFFFFF',
                color: '#7C3AED',
                padding: '14px 32px',
                borderRadius: '9999px',
                fontWeight: 700,
                fontSize: '1rem',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
              }}
            >
              Get Started Free
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
                onClick={() => {
                  demoLogin('employer');
                  navigate('employer-dashboard');
                }}
                style={{ cursor: 'pointer', color: 'var(--secondary-text)' }}
              >
                Post an Opportunity
              </a>
              <a
                onClick={() => {
                  demoLogin('employer');
                  navigate('candidate-review');
                }}
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
