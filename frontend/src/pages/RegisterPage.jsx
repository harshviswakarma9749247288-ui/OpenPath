import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, Briefcase, GraduationCap, ArrowRight, ShieldCheck, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useUIStore } from '../store/useUIStore';
import api from '../utils/api';
import ThemeToggle from '../components/ThemeToggle';
import AnimatedLogo from '../components/AnimatedLogo';
import Tilt3DCard from '../components/Tilt3DCard';
import BackButton from '../components/BackButton';

export default function RegisterPage() {
  const { register, isLoading, error } = useAuthStore();
  const { navigate, showToast } = useUIStore();

  const [step, setStep] = useState('form');
  const [role, setRole] = useState('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [demoCode, setDemoCode] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [deliveredViaSmtp, setDeliveredViaSmtp] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleInitialSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    setIsSendingOtp(true);
    try {
      const res = await api.post('/auth/otp/send', { email, purpose: 'Registration' });
      const preview = res?.data?.previewOtp || res?.data?.data?.previewOtp;
      const delivered = res?.data?.delivered ?? res?.data?.data?.delivered;
      setDeliveredViaSmtp(!!delivered);
      if (preview) {
        setDemoCode(preview);
        setOtpCode(preview);
        showToast(`Verification code: ${preview}`, 'info');
      } else {
        showToast(`Verification code sent to ${email}`, 'success');
      }
      setCooldown(60);
      setStep('otp');
    } catch (err) {
      showToast(err.message || 'Failed to send verification code', 'error');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    if (cooldown > 0 || isSendingOtp) return;
    setIsSendingOtp(true);
    try {
      const res = await api.post('/auth/otp/send', { email, purpose: 'Registration' });
      const preview = res?.data?.previewOtp || res?.data?.data?.previewOtp;
      const delivered = res?.data?.delivered ?? res?.data?.data?.delivered;
      setDeliveredViaSmtp(!!delivered);
      if (preview) {
        setDemoCode(preview);
        setOtpCode(preview);
        showToast(`New verification code: ${preview}`, 'info');
      } else {
        showToast(`A new verification code was sent to ${email}`, 'success');
      }
      setCooldown(60);
    } catch (err) {
      showToast(err.message || 'Failed to resend code', 'error');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsVerifyingOtp(true);
    try {
      await api.post('/auth/otp/verify', { email, code: otpCode });

      const res = await register({
        name,
        email,
        password,
        confirmPassword,
        role,
      });

      if (res.success) {
        showToast('Account created successfully! Welcome to OpenPath.', 'success');
        if (role === 'student') {
          navigate('profile-setup');
        } else {
          navigate('employer-dashboard');
        }
      }
    } catch (err) {
      showToast(err.message || 'OTP verification failed', 'error');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        backgroundColor: 'var(--background)',
        position: 'relative',
      }}
      className="split-auth-layout"
    >
      {/* Floating Theme Toggle in Auth Screen */}
      <div style={{ position: 'fixed', top: '20px', right: '24px', zIndex: 100 }}>
        <ThemeToggle showLabel={true} size="sm" />
      </div>

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
          <div
            onClick={() => navigate('landing')}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', marginBottom: '48px' }}
          >
            <AnimatedLogo size="md" />
            <span style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
              Open<span className="gradient-text">Path</span>
            </span>
          </div>

          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: '1.2', marginBottom: '16px' }}>
            Start Your Journey with <br />
            <span className="gradient-text">Clarity & Purpose</span>
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '1.05rem', lineHeight: '1.6' }}>
            Join thousands of college students, freshers, and progressive hiring teams connecting through
            transparent skill matching.
          </p>
        </div>

        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '22px', borderRadius: '16px', position: 'relative', zIndex: 1 }}>
          <strong style={{ display: 'block', marginBottom: '6px', color: '#F8FAFC' }}>Transparent Match Policy:</strong>
          <p style={{ fontSize: '0.85rem', color: '#94A3B8', lineHeight: '1.5' }}>
            OpenPath never hides candidate qualifications behind black boxes. Every applicant sees their
            mathematical 5-factor breakdown and specific missing skills.
          </p>
        </div>

        <div style={{ fontSize: '0.8rem', color: '#64748B', position: 'relative', zIndex: 1 }}>
          Brand Promise: Your Path. Your Opportunity.
        </div>
      </div>

      {/* Right Form Pane */}
      <div
        className="auth-form-pane"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          maxWidth: '520px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        <BackButton
          label={step === 'form' ? 'Back to Home' : 'Back to Registration Form'}
          onClick={step === 'otp' ? () => setStep('form') : undefined}
          fallbackPage="landing"
          style={{ alignSelf: 'flex-start', marginBottom: '20px' }}
        />

        {step === 'form' ? (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-text)' }}>
                Create Your Account
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--secondary-text)', marginTop: '4px' }}>
                Select your role to configure your OpenPath environment.
              </p>
            </div>

            {/* Role Switcher with 3D Tilt */}
            <Tilt3DCard
              maxTilt={6}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                marginBottom: '24px',
                padding: '6px',
                backgroundColor: 'var(--card-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
              }}
            >
              <button
                type="button"
                onClick={() => setRole('student')}
                style={{
                  padding: '11px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: role === 'student' ? 'rgba(124, 58, 237, 0.2)' : 'transparent',
                  color: role === 'student' ? 'var(--primary-text)' : 'var(--secondary-text)',
                  border: role === 'student' ? '1px solid #A855F7' : '1px solid transparent',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: role === 'student' ? '0 0 15px rgba(124, 58, 237, 0.3)' : 'none',
                }}
              >
                <GraduationCap size={18} color={role === 'student' ? '#C084FC' : 'currentColor'} /> Student / Fresher
              </button>

              <button
                type="button"
                onClick={() => setRole('employer')}
                style={{
                  padding: '11px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: role === 'employer' ? 'rgba(236, 72, 153, 0.2)' : 'transparent',
                  color: role === 'employer' ? 'var(--primary-text)' : 'var(--secondary-text)',
                  border: role === 'employer' ? '1px solid #EC4899' : '1px solid transparent',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: role === 'employer' ? '0 0 15px rgba(236, 72, 153, 0.3)' : 'none',
                }}
              >
                <Briefcase size={18} color={role === 'employer' ? '#F472B6' : 'currentColor'} /> Employer / Hiring
              </button>
            </Tilt3DCard>

            {error && (
              <div
                style={{
                  padding: '12px',
                  backgroundColor: 'var(--status-red-bg)',
                  border: '1px solid var(--status-red-border)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--status-red-text)',
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
                    color="#64748B"
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
                    color="#64748B"
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
                    color="#64748B"
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
                    color="#64748B"
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
                disabled={isLoading || isSendingOtp}
                className="btn-primary"
                style={{ width: '100%', padding: '12px', marginTop: '6px' }}
              >
                {isSendingOtp ? 'Sending Code...' : 'Continue to Verification'} <ArrowRight size={18} />
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.875rem', color: 'var(--secondary-text)' }}>
              Already registered?{' '}
              <button onClick={() => navigate('login')} style={{ color: '#F472B6', fontWeight: 700 }}>
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
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(124, 58, 237, 0.2)',
                  border: '1px solid rgba(168, 85, 247, 0.4)',
                  color: '#C084FC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto',
                  boxShadow: '0 0 20px rgba(124, 58, 237, 0.3)',
                }}
              >
                <ShieldCheck size={28} />
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-text)' }}>Enter Verification Code</h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--secondary-text)', marginTop: '4px' }}>
                We sent a 6-digit OTP code to <strong>{email}</strong>
              </p>
            </div>

            {deliveredViaSmtp ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '10px 14px',
                  backgroundColor: 'rgba(16, 185, 129, 0.12)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  color: '#10B981',
                  fontSize: '0.85rem',
                  marginBottom: '18px',
                }}
              >
                <CheckCircle2 size={16} /> Delivered to your inbox via SMTP
              </div>
            ) : demoCode ? (
              <div
                style={{
                  padding: '12px 14px',
                  backgroundColor: 'rgba(124, 58, 237, 0.15)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(168, 85, 247, 0.35)',
                  textAlign: 'center',
                  marginBottom: '18px',
                  fontSize: '0.85rem',
                  color: 'var(--primary-text)',
                }}
              >
                <span>Demo / Test OTP Code: </span>
                <strong style={{ color: '#F472B6', letterSpacing: '2px', fontSize: '1.05rem' }}>{demoCode}</strong>
                <div style={{ fontSize: '0.75rem', color: 'var(--secondary-text)', marginTop: '4px' }}>
                  (Auto-filled for rapid testing & evaluation)
                </div>
              </div>
            ) : null}

            <form onSubmit={handleVerifyOtp}>
              <div className="form-group" style={{ marginBottom: '18px' }}>
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]*"
                  maxLength={6}
                  required
                  autoFocus
                  placeholder="000000"
                  className="form-input"
                  style={{
                    fontSize: '2rem',
                    textAlign: 'center',
                    letterSpacing: '10px',
                    fontWeight: 800,
                    color: 'var(--primary-text)',
                  }}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || isVerifyingOtp || otpCode.length < 6}
                className="btn-primary"
                style={{ width: '100%', padding: '12px' }}
              >
                {isLoading || isVerifyingOtp ? 'Verifying...' : 'Verify & Launch Profile'} <ArrowRight size={18} />
              </button>
            </form>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '18px',
                paddingTop: '14px',
                borderTop: '1px solid var(--border-color)',
              }}
            >
              <button
                type="button"
                onClick={() => setStep('form')}
                style={{
                  fontSize: '0.825rem',
                  color: 'var(--secondary-text)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px 0',
                }}
              >
                ← Edit details
              </button>

              <button
                type="button"
                disabled={cooldown > 0 || isSendingOtp}
                onClick={handleResendOtp}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  color: cooldown > 0 ? 'var(--secondary-text)' : '#A78BFA',
                  background: 'none',
                  border: 'none',
                  cursor: cooldown > 0 ? 'not-allowed' : 'pointer',
                  padding: '4px 0',
                }}
              >
                <RefreshCw size={13} className={isSendingOtp ? 'spin' : ''} />
                {cooldown > 0 ? `Resend Code (${cooldown}s)` : 'Resend Code'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
