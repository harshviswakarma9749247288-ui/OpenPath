import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, ArrowRight, Sparkles, CheckCircle2, Shield } from 'lucide-react';
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
        backgroundColor: '#FFFFFF',
      }}
      className="split-auth-layout"
    >
      {/* Left Branding Pane */}
      <div
        className="auth-branding-pane"
        style={{
          background: 'linear-gradient(135deg, #1E40AF 0%, #2563EB 100%)',
          padding: '60px 48px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          color: '#FFFFFF',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div>
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
                backgroundColor: '#FFFFFF',
                color: 'var(--primary-blue)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.25rem',
              }}
            >
              OP
            </div>
            <span style={{ fontSize: '1.4rem', fontWeight: 700, letterSpacing: '-0.5px' }}>
              OpenPath
            </span>
          </div>

          <h2 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#FFFFFF', lineHeight: '1.2', marginBottom: '16px' }}>
            Find Your Path. <br />
            Build Your Future.
          </h2>
          <p style={{ color: '#DBEAFE', fontSize: '1.05rem', lineHeight: '1.6', maxWidth: '440px' }}>
            The career platform engineered for students, freshers, and early talent with transparent,
            explainable matching and customized skill roadmaps.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#EFF6FF', fontSize: '0.9rem' }}>
            <CheckCircle2 size={20} color="#93C5FD" />
            <span>40% Skills, 20% Qualifications, 20% Location factor scoring</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#EFF6FF', fontSize: '0.9rem' }}>
            <CheckCircle2 size={20} color="#93C5FD" />
            <span>Actionable skill gap detection and curated learning paths</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#EFF6FF', fontSize: '0.9rem' }}>
            <CheckCircle2 size={20} color="#93C5FD" />
            <span>Direct employer review portal with instant candidate rankings</span>
          </div>
        </div>

        <div style={{ fontSize: '0.8rem', color: '#93C5FD' }}>
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
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--primary-text)' }}>
            Welcome Back
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--secondary-text)', marginTop: '6px' }}>
            Please enter your credentials to access your OpenPath account.
          </p>
        </div>

        {/* 1-Click Demo Evaluation Bar */}
        <div
          style={{
            padding: '14px 16px',
            backgroundColor: '#F8FAFC',
            borderRadius: 'var(--radius-md)',
            border: '1px solid #E2E8F0',
            marginBottom: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <Sparkles size={16} color="var(--primary-blue)" />
            <strong style={{ fontSize: '0.825rem', color: 'var(--primary-text)' }}>
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
                borderColor: '#7C3AED',
                color: '#7C3AED',
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
              backgroundColor: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: 'var(--radius-md)',
              color: '#DC2626',
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
                color="#94A3B8"
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
                style={{ fontSize: '0.8rem', color: 'var(--primary-blue)', fontWeight: 500 }}
              >
                Forgot Password?
              </button>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock
                size={18}
                color="#94A3B8"
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
                  color: '#94A3B8',
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
            style={{ color: 'var(--primary-blue)', fontWeight: 600 }}
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
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px',
          }}
        >
          <div className="card" style={{ maxWidth: '420px', width: '100%', padding: '28px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Reset Your Password</h3>
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
                  showToast(`Verification reset code sent to ${forgotEmail || 'your email'}! (Demo OTP: 582104)`, 'success');
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
