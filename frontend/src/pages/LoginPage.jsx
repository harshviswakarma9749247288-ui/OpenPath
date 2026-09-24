import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useUIStore } from '../store/useUIStore';

export default function LoginPage() {
  const { login, demoLogin, isLoading, error } = useAuthStore();
  const { navigate, showToast } = useUIStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    const res = await login(email, password);
    if (res.success) {
      showToast('Logged in successfully!', 'success');
      navigate(res.user.role === 'employer' ? 'employer-dashboard' : 'dashboard');
    }
  };

  const handleDemoLogin = async (role) => {
    const res = await demoLogin(role);
    if (res.success) {
      showToast(`Signed in as Demo ${role}!`, 'success');
      navigate(role === 'employer' ? 'employer-dashboard' : 'dashboard');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        backgroundColor: '#070A13',
      }}
      className="split-auth-layout"
    >
      {/* Left Branding Pane */}
      <div
        className="auth-branding-pane"
        style={{
          background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
          padding: '60px 48px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          color: '#FFFFFF',
          position: 'relative',
          overflow: 'hidden',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div className="bg-subtle-glow" style={{ opacity: 0.8 }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Logo */}
          <div
            onClick={() => navigate('landing')}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', marginBottom: '48px' }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.25rem',
                boxShadow: '0 0 15px rgba(236, 72, 153, 0.45)',
              }}
            >
              OP
            </div>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
              Open<span className="gradient-text">Path</span>
            </span>
          </div>

          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#FFFFFF', lineHeight: '1.2', marginBottom: '16px' }}>
            Find Your Path. <br />
            <span className="gradient-text">Build Your Future.</span>
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '1.05rem', lineHeight: '1.6', maxWidth: '440px' }}>
            The career platform engineered for students, freshers, and early talent with transparent,
            explainable matching and customized skill roadmaps.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#E2E8F0', fontSize: '0.9rem' }}>
            <CheckCircle2 size={20} color="#A78BFA" />
            <span>40% Skills, 20% Qualifications, 20% Location factor scoring</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#E2E8F0', fontSize: '0.9rem' }}>
            <CheckCircle2 size={20} color="#F472B6" />
            <span>Actionable skill gap detection and curated learning paths</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#E2E8F0', fontSize: '0.9rem' }}>
            <CheckCircle2 size={20} color="#38BDF8" />
            <span>Direct employer review portal with instant candidate rankings</span>
          </div>
        </div>

        <div style={{ fontSize: '0.8rem', color: '#64748B', position: 'relative', zIndex: 1 }}>
          © 2026 OpenPath • Connecting talent with verified opportunities.
        </div>
      </div>

      {/* Right Login Form Pane */}
      <div
        style={{
          padding: '60px 48px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          maxWidth: '520px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#FFFFFF' }}>
            Welcome Back
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--secondary-text)', marginTop: '6px' }}>
            Please enter your credentials to access your OpenPath account.
          </p>
        </div>

        {/* 1-Click Demo Evaluation Bar */}
        <div
          style={{
            padding: '16px',
            backgroundColor: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(16px)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            marginBottom: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
            <Sparkles size={16} color="#C084FC" />
            <strong style={{ fontSize: '0.825rem', color: '#F8FAFC' }}>
              Hackathon Quick Access:
            </strong>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button
              type="button"
              onClick={() => handleDemoLogin('student')}
              className="btn-outline"
              style={{ padding: '8px', fontSize: '0.8rem', justifyContent: 'center' }}
            >
              Sign In as Student
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('employer')}
              className="btn-outline"
              style={{
                padding: '8px',
                fontSize: '0.8rem',
                justifyContent: 'center',
                borderColor: 'rgba(236, 72, 153, 0.5)',
                color: '#F472B6',
                backgroundColor: 'rgba(236, 72, 153, 0.1)',
              }}
            >
              Sign In as Employer
            </button>
          </div>
        </div>

        {error && (
          <div
            style={{
              padding: '12px 14px',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              borderRadius: 'var(--radius-md)',
              color: '#FCA5A5',
              fontSize: '0.85rem',
              marginBottom: '18px',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={18}
                color="#64748B"
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="email"
                required
                className="form-input"
                style={{ paddingLeft: '40px' }}
                placeholder="name@university.edu or company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label">Password</label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                style={{ fontSize: '0.8rem', color: '#A78BFA', fontWeight: 600 }}
              >
                Forgot Password?
              </button>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock
                size={18}
                color="#64748B"
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                className="form-input"
                style={{ paddingLeft: '40px', paddingRight: '40px' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#64748B',
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary"
            style={{ width: '100%', padding: '12px', marginTop: '10px' }}
          >
            {isLoading ? 'Signing In...' : 'Sign In'} <ArrowRight size={18} />
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: 'var(--secondary-text)' }}>
          Don't have an OpenPath account?{' '}
          <button
            onClick={() => navigate('register')}
            style={{ color: '#F472B6', fontWeight: 700 }}
          >
            Create an Account
          </button>
        </p>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(3, 7, 18, 0.75)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px',
          }}
        >
          <div className="card" style={{ maxWidth: '420px', width: '100%', padding: '28px', backgroundColor: 'rgba(15, 23, 42, 0.95)' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', color: '#FFFFFF' }}>Reset Your Password</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--secondary-text)', marginBottom: '18px' }}>
              Enter your registered email address to receive an OTP verification code.
            </p>
            <input
              type="email"
              className="form-input"
              placeholder="user@example.com"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              style={{ marginBottom: '18px' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setShowForgotModal(false)} className="btn-secondary">
                Cancel
              </button>
              <button
                onClick={() => {
                  showToast(`Verification code sent! (Demo OTP: 582104)`, 'success');
                  setShowForgotModal(false);
                }}
                className="btn-primary"
              >
                Send Code
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
