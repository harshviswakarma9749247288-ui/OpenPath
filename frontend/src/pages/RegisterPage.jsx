import React, { useState } from 'react';
import { Mail, Lock, User, Briefcase, GraduationCap, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useUIStore } from '../store/useUIStore';

export default function RegisterPage() {
  const { register, isLoading, error } = useAuthStore();
  const { navigate, showToast } = useUIStore();

  const [step, setStep] = useState('form'); // 'form' or 'otp'
  const [role, setRole] = useState('student'); // 'student' or 'employer'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [demoCode, setDemoCode] = useState('834920');

  const handleInitialSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Move to simulated OTP verification per spec
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setDemoCode(generatedOtp);
    setStep('otp');
    showToast(`Verification code sent to ${email}! (Demo: ${generatedOtp})`, 'info');
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    // Complete registration
    const res = await register({
      name,
      email,
      password,
      confirmPassword,
      role,
    });

    if (res.success) {
      showToast('Account created successfully! Let\'s setup your profile.', 'success');
      if (role === 'student') {
        navigate('profile-setup');
      } else {
        navigate('employer-dashboard');
      }
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
        }}
      >
        <div>
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

          <h2 style={{ fontSize: '2.4rem', fontWeight: 700, lineHeight: '1.2', marginBottom: '16px' }}>
            Start Your Journey with Clarity & Purpose
          </h2>
          <p style={{ color: '#DBEAFE', fontSize: '1.05rem', lineHeight: '1.6' }}>
            Join thousands of college students, freshers, and progressive hiring teams connecting through
            transparent skill matching.
          </p>
        </div>

        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '20px', borderRadius: '12px' }}>
          <strong style={{ display: 'block', marginBottom: '6px' }}>Transparent Match Policy:</strong>
          <p style={{ fontSize: '0.85rem', color: '#DBEAFE', lineHeight: '1.5' }}>
            OpenPath never hides candidate qualifications behind algorithms. Every applicant sees their
            mathematical 5-factor breakdown and specific missing skills.
          </p>
        </div>

        <div style={{ fontSize: '0.8rem', color: '#93C5FD' }}>
          Brand Promise: Your Path. Your Opportunity.
        </div>
      </div>

      {/* Right Form Pane */}
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
        {step === 'form' ? (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--primary-text)' }}>
                Create Your Account
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--secondary-text)', marginTop: '4px' }}>
                Select your role to configure your OpenPath environment.
              </p>
            </div>

            {/* Role Switcher */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                marginBottom: '24px',
                padding: '4px',
                backgroundColor: '#F1F5F9',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <button
                type="button"
                onClick={() => setRole('student')}
                style={{
                  padding: '10px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: role === 'student' ? '#FFFFFF' : 'transparent',
                  color: role === 'student' ? 'var(--primary-blue)' : 'var(--secondary-text)',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: role === 'student' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                <GraduationCap size={18} /> Student / Fresher
              </button>

              <button
                type="button"
                onClick={() => setRole('employer')}
                style={{
                  padding: '10px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: role === 'employer' ? '#FFFFFF' : 'transparent',
                  color: role === 'employer' ? '#7C3AED' : 'var(--secondary-text)',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: role === 'employer' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                <Briefcase size={18} /> Employer / Hiring
              </button>
            </div>

            {error && (
              <div
                style={{
                  padding: '12px',
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FECACA',
                  borderRadius: 'var(--radius-md)',
                  color: '#DC2626',
                  fontSize: '0.85rem',
                  marginBottom: '16px',
                }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleInitialSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User
                    size={18}
                    color="#94A3B8"
                    style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
                  />
                  <input
                    type="text"
                    required
                    className="form-input"
                    style={{ paddingLeft: '40px' }}
                    placeholder="e.g. Alex Rivera"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

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
                    placeholder={role === 'student' ? 'alex.rivera@university.edu' : 'recruiter@company.io'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock
                    size={18}
                    color="#94A3B8"
                    style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
                  />
                  <input
                    type="password"
                    required
                    minLength={6}
                    className="form-input"
                    style={{ paddingLeft: '40px' }}
                    placeholder="Min 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock
                    size={18}
                    color="#94A3B8"
                    style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
                  />
                  <input
                    type="password"
                    required
                    className="form-input"
                    style={{ paddingLeft: '40px' }}
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary"
                style={{ width: '100%', padding: '12px', marginTop: '6px' }}
              >
                Continue to Verification <ArrowRight size={18} />
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.875rem', color: 'var(--secondary-text)' }}>
              Already registered?{' '}
              <button onClick={() => navigate('login')} style={{ color: 'var(--primary-blue)', fontWeight: 600 }}>
                Sign In
              </button>
            </p>
          </div>
        ) : (
          /* STEP 2: OTP VERIFICATION */
          <div className="animate-fade-in">
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  backgroundColor: '#EFF6FF',
                  color: 'var(--primary-blue)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto',
                }}
              >
                <ShieldCheck size={28} />
              </div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 700 }}>Enter Verification Code</h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--secondary-text)', marginTop: '4px' }}>
                We sent a 6-digit OTP code to <strong>{email}</strong>
              </p>
            </div>

            <div
              style={{
                padding: '12px',
                backgroundColor: '#EFF6FF',
                borderRadius: '8px',
                border: '1px solid #BFDBFE',
                textAlign: 'center',
                marginBottom: '20px',
                fontSize: '0.85rem',
              }}
            >
              Demo Auto-Filled Code: <strong>{demoCode}</strong>
            </div>

            <form onSubmit={handleVerifyOtp}>
              <div className="form-group">
                <input
                  type="text"
                  maxLength={6}
                  required
                  className="form-input"
                  style={{
                    fontSize: '1.8rem',
                    textAlign: 'center',
                    letterSpacing: '8px',
                    fontWeight: 700,
                  }}
                  value={otpCode || demoCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary"
                style={{ width: '100%', padding: '12px' }}
              >
                {isLoading ? 'Verifying...' : 'Verify & Launch Profile'} <ArrowRight size={18} />
              </button>
            </form>

            <button
              onClick={() => setStep('form')}
              style={{
                width: '100%',
                textAlign: 'center',
                marginTop: '16px',
                fontSize: '0.85rem',
                color: 'var(--secondary-text)',
              }}
            >
              ← Edit details / Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
