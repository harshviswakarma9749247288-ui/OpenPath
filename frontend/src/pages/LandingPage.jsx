import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Target,
  Compass,
  CheckCircle,
  Briefcase,
  TrendingUp,
  Award,
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

export default function LandingPage() {
  const { navigate } = useUIStore();
  const { isAuthenticated, demoLogin } = useAuthStore();
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
    { step: '01', title: 'Register Account', desc: 'Sign up as a Student or Employer in seconds with role-tailored onboarding.' },
    { step: '02', title: 'Build Profile', desc: 'List your skills, coursework, degree, and career interests with our instant completeness score.' },
    { step: '03', title: 'Discover & Match', desc: 'See weighted 5-factor match scores explaining exactly why an internship fits your profile.' },
    { step: '04', title: 'Bridge Skill Gaps', desc: 'Identify missing competencies and explore direct learning roadmaps before applying.' },
    { step: '05', title: 'Apply & Track', desc: 'Submit one-click profile applications and track interview progression in real time.' },
  ];

  const features = [
    {
      icon: Target,
      title: '5-Factor Explainable Matching',
      desc: 'No black-box rejection. We transparently compute matches across Skills (40%), Qualifications (20%), Location (20%), Interests (10%), and Experience (10%).',
    },
    {
      icon: TrendingUp,
      title: 'Actionable Skill-Gap Insights',
      desc: 'Instantly see matched vs missing skills for any role, paired directly with curated roadmaps so you can learn what matters.',
    },
    {
      icon: Compass,
      title: 'Fresher-First Discovery',
      desc: 'Browse internships, apprenticeships, and entry-level positions verified for zero-to-low experience candidates.',
    },
    {
      icon: Layers,
      title: 'Unified Application Pipeline',
      desc: 'Track every stage from Reviewing and Shortlisting to Interview schedules with calendar links.',
    },
  ];

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Decorative gradient blobs */}
      <div className="bg-subtle-glow" />
      <div className="bg-subtle-wave" />

      {/* 1. HERO SECTION */}
      <section
        style={{
          padding: '80px 24px 70px 24px',
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
                padding: '6px 14px',
                borderRadius: '9999px',
                backgroundColor: '#EFF6FF',
                color: 'var(--primary-blue)',
                fontSize: '0.85rem',
                fontWeight: 600,
                marginBottom: '20px',
                border: '1px solid #BFDBFE',
              }}
            >
              <Sparkles size={16} /> Intelligent Opportunity & Skill Platform
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.4rem, 4.5vw, 3.6rem)',
                fontWeight: 800,
                color: 'var(--secondary-navy)',
                letterSpacing: '-1px',
                marginBottom: '18px',
                lineHeight: '1.15',
              }}
            >
              Your Path.{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
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
                style={{ padding: '14px 28px', fontSize: '1rem' }}
              >
                Get Started <ArrowRight size={18} />
              </button>
              <button
                onClick={() => navigate('opportunities')}
                className="btn-secondary"
                style={{ padding: '14px 28px', fontSize: '1rem' }}
              >
                Explore Opportunities
              </button>
            </div>

            {/* Quick Demo Login Bar for Evaluators */}
            <div
              style={{
                padding: '12px 18px',
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-subtle)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                flexWrap: 'wrap',
              }}
            >
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--secondary-text)' }}>
                ⚡ Instant Demo:
              </span>
              <button
                onClick={async () => {
                  await demoLogin('student');
                  navigate('dashboard');
                }}
                className="btn-outline"
                style={{ padding: '5px 12px', fontSize: '0.775rem' }}
              >
                Student Demo
              </button>
              <button
                onClick={async () => {
                  await demoLogin('employer');
                  navigate('employer-dashboard');
                }}
                className="btn-outline"
                style={{ padding: '5px 12px', fontSize: '0.775rem' }}
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
                padding: '24px',
                position: 'relative',
                zIndex: 2,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span className="badge badge-internship">Featured Match</span>
                <MatchScoreBadge score={94} size={48} showLabel={true} />
              </div>

              <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>Frontend Engineering Intern</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--secondary-text)', marginBottom: '14px' }}>
                TechCorp Labs • Bengaluru (Remote)
              </p>

              {/* Match Factors Snapshot */}
              <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem' }}>
                  <span>Skill Match (40%)</span>
                  <strong style={{ color: 'var(--primary-blue)' }}>100% matched</strong>
                </div>
                <div style={{ height: '6px', backgroundColor: '#E2E8F0', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: '100%', height: '100%', backgroundColor: '#10B981' }} />
                </div>
              </div>

              {/* Matched Skills Chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '18px' }}>
                <span className="skill-chip skill-chip-matched">React</span>
                <span className="skill-chip skill-chip-matched">JavaScript</span>
                <span className="skill-chip skill-chip-matched">REST APIs</span>
                <span className="skill-chip skill-chip-matched">Git</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E2E8F0', paddingTop: '14px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-text)' }}>
                  ₹35,000 / month
                </span>
                <button
                  onClick={() => navigate('opportunities')}
                  className="btn-primary"
                  style={{ padding: '6px 14px', fontSize: '0.8rem' }}
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
                padding: '16px',
                width: '260px',
                zIndex: 3,
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid #DBEAFE',
                backgroundColor: '#FFFFFF',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#C2410C', marginBottom: '8px' }}>
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
      <section style={{ padding: '80px 24px', backgroundColor: '#FFFFFF', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-blue)', textTransform: 'uppercase' }}>
              HOW IT WORKS
            </span>
            <h2 style={{ fontSize: '2.2rem', marginTop: '6px' }}>A Five-Step Visual Journey to Your Career</h2>
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
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  borderTop: '4px solid var(--primary-blue)',
                }}
              >
                <span
                  style={{
                    fontSize: '1.6rem',
                    fontWeight: 800,
                    color: '#DBEAFE',
                    fontFamily: 'var(--font-heading)',
                    marginBottom: '10px',
                  }}
                >
                  {step.step}
                </span>
                <h3 style={{ fontSize: '1.05rem', marginBottom: '8px', color: 'var(--primary-text)' }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--secondary-text)', lineHeight: '1.5' }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CORE FEATURES SECTION */}
      <section style={{ padding: '80px 24px', backgroundColor: 'var(--background)' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-blue)', textTransform: 'uppercase' }}>
              CORE CAPABILITIES
            </span>
            <h2 style={{ fontSize: '2.2rem', marginTop: '6px' }}>Built Exclusively for Early Career Success</h2>
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
                      borderRadius: '12px',
                      backgroundColor: '#EFF6FF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--primary-blue)',
                      marginBottom: '18px',
                    }}
                  >
                    <Icon size={24} />
                  </div>
                  <h3 style={{ fontSize: '1.15rem', marginBottom: '10px' }}>{feat.title}</h3>
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
      <section style={{ padding: '80px 24px', backgroundColor: '#FFFFFF', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
            {/* For Students */}
            <div
              className="card"
              style={{
                padding: '36px',
                background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
                border: '1.5px solid #DBEAFE',
              }}
            >
              <span className="badge badge-internship" style={{ marginBottom: '14px' }}>
                FOR STUDENTS & FRESHERS
              </span>
              <h3 style={{ fontSize: '1.6rem', marginBottom: '12px' }}>Discover Roles That Fit Your True Potential</h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                <li style={{ display: 'flex', gap: '10px', fontSize: '0.9rem', color: 'var(--secondary-text)' }}>
                  <CheckCircle size={18} color="var(--primary-blue)" style={{ flexShrink: 0 }} />
                  Understand why an opportunity matches you with 5 distinct factor scores.
                </li>
                <li style={{ display: 'flex', gap: '10px', fontSize: '0.9rem', color: 'var(--secondary-text)' }}>
                  <CheckCircle size={18} color="var(--primary-blue)" style={{ flexShrink: 0 }} />
                  Access 5-stage learning roadmaps to conquer missing skills.
                </li>
                <li style={{ display: 'flex', gap: '10px', fontSize: '0.9rem', color: 'var(--primary-blue)' }}>
                  <CheckCircle size={18} color="var(--primary-blue)" style={{ flexShrink: 0 }} />
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
                background: 'linear-gradient(180deg, #FFFFFF 0%, #F5F3FF 100%)',
                border: '1.5px solid #DDD6FE',
              }}
            >
              <span className="badge badge-entry" style={{ marginBottom: '14px' }}>
                FOR EMPLOYERS & STARTUPS
              </span>
              <h3 style={{ fontSize: '1.6rem', marginBottom: '12px' }}>Find Early-Career Talent With Proven Skills</h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                <li style={{ display: 'flex', gap: '10px', fontSize: '0.9rem', color: 'var(--secondary-text)' }}>
                  <CheckCircle size={18} color="#7C3AED" style={{ flexShrink: 0 }} />
                  Post internships & entry jobs using our 5-step structured wizard.
                </li>
                <li style={{ display: 'flex', gap: '10px', fontSize: '0.9rem', color: 'var(--secondary-text)' }}>
                  <CheckCircle size={18} color="#7C3AED" style={{ flexShrink: 0 }} />
                  Review candidates ranked by algorithmic skill compatibility scores.
                </li>
                <li style={{ display: 'flex', gap: '10px', fontSize: '0.9rem', color: 'var(--secondary-text)' }}>
                  <CheckCircle size={18} color="#7C3AED" style={{ flexShrink: 0 }} />
                  Manage applications from review to shortlist and interview scheduling.
                </li>
              </ul>
              <button
                onClick={() => {
                  demoLogin('employer');
                  navigate('employer-dashboard');
                }}
                className="btn-secondary"
                style={{ width: '100%', borderColor: '#7C3AED', color: '#7C3AED' }}
              >
                Employer Portal <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. OPPORTUNITIES PREVIEW SECTION */}
      {featuredOpps.length > 0 && (
        <section style={{ padding: '80px 24px', backgroundColor: 'var(--background)' }}>
          <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '36px' }}>
              <div>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-blue)', textTransform: 'uppercase' }}>
                  LIVE PREVIEW
                </span>
                <h2 style={{ fontSize: '2rem', marginTop: '6px' }}>Featured Open Opportunities</h2>
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
      <section style={{ padding: '60px 24px', backgroundColor: '#FFFFFF', borderTop: '1px solid var(--border-color)' }}>
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
              <h2 style={{ fontSize: '2.8rem', fontWeight: 800, color: 'var(--primary-blue)' }}>1,000+</h2>
              <p style={{ fontSize: '0.95rem', color: 'var(--secondary-text)', fontWeight: 500 }}>Opportunities Listed</p>
            </div>
            <div>
              <h2 style={{ fontSize: '2.8rem', fontWeight: 800, color: 'var(--secondary-navy)' }}>500+</h2>
              <p style={{ fontSize: '0.95rem', color: 'var(--secondary-text)', fontWeight: 500 }}>Active Employers</p>
            </div>
            <div>
              <h2 style={{ fontSize: '2.8rem', fontWeight: 800, color: 'var(--primary-blue)' }}>5,000+</h2>
              <p style={{ fontSize: '0.95rem', color: 'var(--secondary-text)', fontWeight: 500 }}>Students & Freshers</p>
            </div>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
            *Figures labeled as illustrative platform projections for hackathon presentation.
          </p>
        </div>
      </section>

      {/* 7. FINAL CTA BANNER */}
      <section style={{ padding: '80px 24px', backgroundColor: 'var(--background)' }}>
        <div
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, #1E40AF 0%, #2563EB 100%)',
            padding: '56px 40px',
            color: '#FFFFFF',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '24px',
            boxShadow: 'var(--shadow-blue)',
          }}
        >
          <div>
            <h2 style={{ color: '#FFFFFF', fontSize: '2.2rem', fontWeight: 700, marginBottom: '10px' }}>
              Ready to Discover Your Path?
            </h2>
            <p style={{ color: '#DBEAFE', fontSize: '1.05rem', maxWidth: '580px' }}>
              Connect with top companies hiring students, explore explainable match criteria, and upgrade your skills today.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '14px' }}>
            <button
              onClick={() => navigate('register')}
              style={{
                backgroundColor: '#FFFFFF',
                color: 'var(--primary-blue)',
                padding: '14px 28px',
                borderRadius: 'var(--radius-md)',
                fontWeight: 600,
                fontSize: '1rem',
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
          backgroundColor: '#0F172A',
          color: '#94A3B8',
          padding: '60px 24px 30px 24px',
          borderTop: '1px solid #1E293B',
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FFFFFF', marginBottom: '14px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--primary-blue)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                }}
              >
                OP
              </div>
              <strong style={{ fontSize: '1.1rem' }}>OpenPath</strong>
            </div>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>
              Connecting students and freshers with careers through explainable matching and guided learning.
            </p>
          </div>

          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '0.95rem', marginBottom: '14px' }}>For Candidates</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
              <a onClick={() => navigate('opportunities')} style={{ cursor: 'pointer', color: '#94A3B8' }}>
                Browse Internships
              </a>
              <a onClick={() => navigate('learning')} style={{ cursor: 'pointer', color: '#94A3B8' }}>
                Skill Roadmaps
              </a>
              <a onClick={() => navigate('register')} style={{ cursor: 'pointer', color: '#94A3B8' }}>
                Student Registration
              </a>
            </div>
          </div>

          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '0.95rem', marginBottom: '14px' }}>For Employers</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
              <a
                onClick={() => {
                  demoLogin('employer');
                  navigate('employer-dashboard');
                }}
                style={{ cursor: 'pointer', color: '#94A3B8' }}
              >
                Post an Opportunity
              </a>
              <a
                onClick={() => {
                  demoLogin('employer');
                  navigate('candidate-review');
                }}
                style={{ cursor: 'pointer', color: '#94A3B8' }}
              >
                Candidate Match Review
              </a>
            </div>
          </div>

          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '0.95rem', marginBottom: '14px' }}>Product Principles</h4>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>
              Explainable AI • Accessibility • Actionable Guidance • Privacy-First Data Protection.
            </p>
          </div>
        </div>

        <div
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            borderTop: '1px solid #1E293B',
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
