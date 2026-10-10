import React, { useState, useEffect } from 'react';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  RefreshCw,
  KeyRound,
  GraduationCap,
  Briefcase,
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useUIStore } from '../store/useUIStore';
import api from '../utils/api';
import ThemeToggle from '../components/ThemeToggle';
import AnimatedLogo from '../components/AnimatedLogo';
import Tilt3DCard from '../components/Tilt3DCard';
import BackButton from '../components/BackButton';

export default function LoginPage() {
  const { login, loginWithOtp, isLoading, error } = useAuthStore();
  const { navigate, showToast } = useUIStore();

  // Role Portal: 'student' | 'employer'
  const [portalRole, setPortalRole] = useState('student');

  // Mode: 'password' | 'otp'
  const [loginMode, setLoginMode] = useState('password');

  // Password Login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // OTP Login state
  const [otpStep, setOtpStep] = useState('email'); // 'email' | 'code'
  const [otpEmail, setOtpEmail] = useState('');
  const [otpLoginCode, setOtpLoginCode] = useState('');
  const [otpPreviewCode, setOtpPreviewCode] = useState('');
  const [otpDeliveredViaSmtp, setOtpDeliveredViaSmtp] = useState(false);
  const [otpCooldown, setOtpCooldown] = useState(0);
  const [isSendingLoginOtp, setIsSendingLoginOtp] = useState(false);
  const [isLoggingInOtp, setIsLoggingInOtp] = useState(false);

  // Forgot Password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStep, setForgotStep] = useState('email'); // 'email' | 'reset'
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [resetOtpPreview, setResetOtpPreview] = useState('');
  const [forgotCooldown, setForgotCooldown] = useState(0);
  const [forgotDeliveredViaSmtp, setForgotDeliveredViaSmtp] = useState(false);

  // Countdown timers
  useEffect(() => {
    if (otpCooldown <= 0) return;
    const timer = setInterval(() => {
      setOtpCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [otpCooldown]);

  useEffect(() => {
    if (forgotCooldown <= 0) return;
    const timer = setInterval(() => {
      setForgotCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [forgotCooldown]);

  // Standard Password Login
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    const res = await login(email, password);
    if (res.success) {
      showToast('Logged in successfully!', 'success');
      navigate(
        res.user.role === 'admin'
          ? 'admin'
          : res.user.role === 'employer'
          ? 'employer-dashboard'
          : 'dashboard'
      );
    }
  };

  // OTP Login - Send Code
  const handleSendLoginOtp = async (e) => {
    if (e) e.preventDefault();
    const targetEmail = (otpEmail || email).trim();
    if (!targetEmail) {
      showToast('Please enter your email address', 'error');
      return;
    }

    setIsSendingLoginOtp(true);
    try {
      const res = await api.post('/auth/otp/send', { email: targetEmail, purpose: 'Login' });
      const preview = res?.data?.previewOtp || res?.data?.data?.previewOtp;
      const delivered = res?.data?.delivered ?? res?.data?.data?.delivered;
      setOtpDeliveredViaSmtp(!!delivered);
      setOtpLoginCode(''); // Require manual input
      if (preview) {
        setOtpPreviewCode(preview);
        showToast(`Login OTP code: ${preview}`, 'info');
      } else {
        setOtpPreviewCode('');
        showToast(`Login OTP code dispatched to ${targetEmail}`, 'success');
      }
      setOtpCooldown(60);
      setOtpStep('code');
    } catch (err) {
      showToast(err.message || 'Failed to send login code', 'error');
    } finally {
      setIsSendingLoginOtp(false);
    }
  };

  // OTP Login - Resend Code
  const handleResendLoginOtp = async () => {
    if (otpCooldown > 0 || isSendingLoginOtp) return;
    const targetEmail = (otpEmail || email).trim();
    setIsSendingLoginOtp(true);
    try {
      const res = await api.post('/auth/otp/send', { email: targetEmail, purpose: 'Login' });
      const preview = res?.data?.previewOtp || res?.data?.data?.previewOtp;
      const delivered = res?.data?.delivered ?? res?.data?.data?.delivered;
      setOtpDeliveredViaSmtp(!!delivered);
      setOtpLoginCode(''); // Require manual input
      if (preview) {
        setOtpPreviewCode(preview);
        showToast(`New login code: ${preview}`, 'info');
      } else {
        setOtpPreviewCode('');
        showToast(`A new login code was sent to ${targetEmail}`, 'success');
      }
      setOtpCooldown(60);
    } catch (err) {
      showToast(err.message || 'Failed to resend code', 'error');
    } finally {
      setIsSendingLoginOtp(false);
    }
  };

  // OTP Login - Submit & Sign In
  const handleLoginWithOtpSubmit = async (e) => {
    e.preventDefault();
    const targetEmail = (otpEmail || email).trim();
    if (!targetEmail || !otpLoginCode) return;

    setIsLoggingInOtp(true);
    try {
      const res = await loginWithOtp(targetEmail, otpLoginCode);
      if (res.success) {
        showToast('Logged in successfully via OTP verification!', 'success');
        navigate(
          res.user.role === 'admin'
            ? 'admin'
            : res.user.role === 'employer'
            ? 'employer-dashboard'
            : 'dashboard'
        );
      } else {
        showToast(res.error || 'Invalid OTP code', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Verification failed', 'error');
    } finally {
      setIsLoggingInOtp(false);
    }
  };

  // Forgot Password - Send Code
  const handleSendResetCode = async (e) => {
    if (e) e.preventDefault();
    if (!forgotEmail) return;
    setForgotLoading(true);
    try {
      const res = await api.post('/auth/password/forgot', { email: forgotEmail });
      const preview = res?.data?.previewOtp || res?.data?.data?.previewOtp;
      const delivered = res?.data?.delivered ?? res?.data?.data?.delivered;
      setForgotDeliveredViaSmtp(!!delivered);
      if (preview) {
        setResetOtpPreview(preview);
        setResetCode(preview);
      }
      showToast(res?.message || 'Reset code sent to your email.', 'info');
      setForgotCooldown(60);
      setForgotStep('reset');
    } catch (err) {
      showToast(err.message || 'Failed to send reset code', 'error');
    } finally {
      setForgotLoading(false);
    }
  };

  // Forgot Password - Resend Code
  const handleResendResetCode = async () => {
    if (forgotCooldown > 0 || forgotLoading) return;
    setForgotLoading(true);
    try {
      const res = await api.post('/auth/password/forgot', { email: forgotEmail });
      const preview = res?.data?.previewOtp || res?.data?.data?.previewOtp;
      const delivered = res?.data?.delivered ?? res?.data?.data?.delivered;
      setForgotDeliveredViaSmtp(!!delivered);
      if (preview) {
        setResetOtpPreview(preview);
        setResetCode(preview);
      }
      showToast('A new reset code has been sent.', 'info');
      setForgotCooldown(60);
    } catch (err) {
      showToast(err.message || 'Failed to resend reset code', 'error');
    } finally {
      setForgotLoading(false);
    }
  };

  // Forgot Password - Set New Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!resetCode || !newPassword) return;
    setForgotLoading(true);
    try {
      await api.post('/auth/password/reset', {
        email: forgotEmail,
        code: resetCode,
        newPassword,
      });
      showToast('Password reset successfully! Please sign in with your new password.', 'success');
      setEmail(forgotEmail);
      setShowForgotModal(false);
      setForgotStep('email');
      setResetCode('');
      setNewPassword('');
    } catch (err) {
      showToast(err.message || 'Failed to reset password', 'error');
    } finally {
      setForgotLoading(false);
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
          {/* Logo */}
          <div
            onClick={() => navigate('landing')}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', marginBottom: '48px' }}
          >
            <AnimatedLogo size="md" />
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
            <span>50% Skills, 15% Qualifications, 15% Experience factor scoring</span>
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
        <BackButton label="Back to Home" fallbackPage="landing" style={{ alignSelf: 'flex-start', marginBottom: '20px' }} />

        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span
              style={{
                fontSize: '0.725rem',
                fontWeight: 800,
                padding: '3px 10px',
                borderRadius: '9999px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                background:
                  portalRole === 'admin'
                    ? 'rgba(239, 68, 68, 0.2)'
                    : portalRole === 'employer'
                    ? 'rgba(236, 72, 153, 0.2)'
                    : 'rgba(124, 58, 237, 0.2)',
                color:
                  portalRole === 'admin'
                    ? '#F87171'
                    : portalRole === 'employer'
                    ? '#F472B6'
                    : '#C084FC',
                border:
                  portalRole === 'admin'
                    ? '1px solid rgba(239, 68, 68, 0.4)'
                    : portalRole === 'employer'
                    ? '1px solid rgba(236, 72, 153, 0.4)'
                    : '1px solid rgba(124, 58, 237, 0.4)',
              }}
            >
              {portalRole === 'admin'
                ? '🛡️ Admin Command Portal'
                : portalRole === 'employer'
                ? '💼 Employer Portal'
                : '🎓 Student Portal'}
            </span>
          </div>
          <h2 style={{ fontSize: '1.95rem', fontWeight: 800, color: 'var(--primary-text)' }}>
            {portalRole === 'admin'
              ? 'Administrator Sign In'
              : portalRole === 'employer'
              ? 'Employer Sign In'
              : 'Student Sign In'}
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--secondary-text)', marginTop: '4px', lineHeight: '1.5' }}>
            {portalRole === 'admin'
              ? 'Sign in to access platform governance, user directory, listing moderation, and system telemetry.'
              : portalRole === 'employer'
              ? 'Sign in to manage opportunity listings, inspect match telemetry, and review applicants.'
              : 'Sign in to access verified opportunities, 3D skill roadmaps, and AI career matching.'}
          </p>
        </div>

        {/* Role Portal Switcher */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '6px',
            padding: '4px',
            backgroundColor: 'var(--chip-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '14px',
          }}
        >
          <button
            type="button"
            onClick={() => {
              setPortalRole('student');
              if (email === 'recruiter@techcorp.io' || email === 'admin@openpath.io') {
                setEmail('');
                setPassword('');
              }
            }}
            style={{
              padding: '8px 10px',
              borderRadius: 'var(--radius-sm)',
              border: portalRole === 'student' ? '1px solid #A855F7' : '1px solid transparent',
              backgroundColor: portalRole === 'student' ? 'rgba(124, 58, 237, 0.22)' : 'transparent',
              color: portalRole === 'student' ? 'var(--primary-text)' : 'var(--secondary-text)',
              fontWeight: 700,
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <GraduationCap size={15} color={portalRole === 'student' ? '#C084FC' : 'currentColor'} />
            <span>Student</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setPortalRole('employer');
              if (email === 'alex@example.com' || email === 'admin@openpath.io') {
                setEmail('');
                setPassword('');
              }
            }}
            style={{
              padding: '8px 10px',
              borderRadius: 'var(--radius-sm)',
              border: portalRole === 'employer' ? '1px solid #EC4899' : '1px solid transparent',
              backgroundColor: portalRole === 'employer' ? 'rgba(236, 72, 153, 0.22)' : 'transparent',
              color: portalRole === 'employer' ? 'var(--primary-text)' : 'var(--secondary-text)',
              fontWeight: 700,
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <Briefcase size={15} color={portalRole === 'employer' ? '#F472B6' : 'currentColor'} />
            <span>Employer</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setPortalRole('admin');
              if (email === 'alex@example.com' || email === 'recruiter@techcorp.io') {
                setEmail('');
                setPassword('');
              }
            }}
            style={{
              padding: '8px 10px',
              borderRadius: 'var(--radius-sm)',
              border: portalRole === 'admin' ? '1px solid #EF4444' : '1px solid transparent',
              backgroundColor: portalRole === 'admin' ? 'rgba(239, 68, 68, 0.22)' : 'transparent',
              color: portalRole === 'admin' ? 'var(--primary-text)' : 'var(--secondary-text)',
              fontWeight: 700,
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <ShieldCheck size={15} color={portalRole === 'admin' ? '#F87171' : 'currentColor'} />
            <span>Admin</span>
          </button>
        </div>

        {/* Login Method Tabs */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
            padding: '4px',
            backgroundColor: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '20px',
          }}
        >
          <button
            type="button"
            onClick={() => setLoginMode('password')}
            style={{
              padding: '9px 12px',
              borderRadius: 'var(--radius-sm)',
              border: loginMode === 'password' ? '1px solid #A855F7' : '1px solid transparent',
              backgroundColor: loginMode === 'password' ? 'rgba(124, 58, 237, 0.2)' : 'transparent',
              color: loginMode === 'password' ? 'var(--primary-text)' : 'var(--secondary-text)',
              fontWeight: 700,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <KeyRound size={16} /> Password Sign In
          </button>

          <button
            type="button"
            onClick={() => {
              setLoginMode('otp');
              if (!otpEmail && email) setOtpEmail(email);
            }}
            style={{
              padding: '9px 12px',
              borderRadius: 'var(--radius-sm)',
              border: loginMode === 'otp' ? '1px solid #EC4899' : '1px solid transparent',
              backgroundColor: loginMode === 'otp' ? 'rgba(236, 72, 153, 0.2)' : 'transparent',
              color: loginMode === 'otp' ? 'var(--primary-text)' : 'var(--secondary-text)',
              fontWeight: 700,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <Mail size={16} /> Email OTP Sign In
          </button>
        </div>

        {error && (
          <div
            style={{
              padding: '12px 14px',
              backgroundColor: 'var(--status-red-bg)',
              border: '1px solid var(--status-red-border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--status-red-text)',
              fontSize: '0.85rem',
              marginBottom: '18px',
            }}
          >
            {error}
          </div>
        )}

        {/* 1. PASSWORD LOGIN FORM */}
        {loginMode === 'password' ? (
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
                  placeholder={
                    portalRole === 'admin'
                      ? 'admin@openpath.io or administrator email'
                      : portalRole === 'student'
                      ? 'alex@example.com or university email'
                      : 'recruiter@techcorp.io or company email'
                  }
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
                  onClick={() => {
                    setForgotEmail(email);
                    setShowForgotModal(true);
                  }}
                  style={{ fontSize: '0.8rem', color: '#A78BFA', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
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
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
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
              style={{ width: '100%', padding: '12px', marginTop: '6px' }}
            >
              {isLoading ? 'Signing In...' : 'Sign In'} <ArrowRight size={18} />
            </button>

            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <button
                type="button"
                onClick={() => {
                  setLoginMode('otp');
                  if (!otpEmail && email) setOtpEmail(email);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#A78BFA',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Mail size={15} /> Sign in using Email OTP Code instead
              </button>
            </div>
          </form>
        ) : (
          /* 2. PASSWORDLESS OTP LOGIN FLOW */
          <div className="animate-fade-in">
            {otpStep === 'email' ? (
              <form onSubmit={handleSendLoginOtp}>
                <div className="form-group">
                  <label className="form-label">Account Email Address</label>
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
                      placeholder="Enter your registered email"
                      value={otpEmail || email}
                      onChange={(e) => {
                        setOtpEmail(e.target.value);
                        setEmail(e.target.value);
                      }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSendingLoginOtp}
                  className="btn-primary"
                  style={{ width: '100%', padding: '12px', marginTop: '6px' }}
                >
                  {isSendingLoginOtp ? 'Generating Code...' : 'Get Login OTP Code'} <ArrowRight size={18} />
                </button>

                <div style={{ textAlign: 'center', marginTop: '16px' }}>
                  <button
                    type="button"
                    onClick={() => setLoginMode('password')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--secondary-text)',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <KeyRound size={15} /> Sign in with Password instead
                  </button>
                </div>
              </form>
            ) : (
              /* OTP Code Input Step */
              <div>
                <div style={{ textAlign: 'center', marginBottom: '18px' }}>
                  <p style={{ fontSize: '0.875rem', color: 'var(--secondary-text)' }}>
                    Enter the 6-digit code sent to <strong>{otpEmail || email}</strong>
                  </p>
                </div>

                {otpDeliveredViaSmtp ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '10px 14px',
                      backgroundColor: 'rgba(16, 185, 129, 0.12)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid rgba(168, 85, 129, 0.3)',
                      color: '#10B981',
                      fontSize: '0.85rem',
                      marginBottom: '16px',
                    }}
                  >
                    <CheckCircle2 size={16} /> Verification code delivered to your email inbox!
                  </div>
                ) : otpPreviewCode ? (
                  <div
                    style={{
                      padding: '12px 14px',
                      backgroundColor: 'rgba(124, 58, 237, 0.15)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid rgba(168, 85, 247, 0.35)',
                      textAlign: 'center',
                      marginBottom: '16px',
                      fontSize: '0.85rem',
                      color: 'var(--primary-text)',
                    }}
                  >
                    <span style={{ color: 'var(--secondary-text)' }}>Email Verification Code: </span>
                    <strong style={{ color: '#F472B6', letterSpacing: '4px', fontSize: '1.25rem', display: 'block', margin: '4px 0' }}>
                      {otpPreviewCode}
                    </strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--secondary-text)' }}>
                      (Enter this 6-digit code below to authenticate)
                    </div>
                  </div>
                ) : null}

                <form onSubmit={handleLoginWithOtpSubmit}>
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
                      value={otpLoginCode}
                      onChange={(e) => setOtpLoginCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoggingInOtp || otpLoginCode.length < 6}
                    className="btn-primary"
                    style={{ width: '100%', padding: '12px' }}
                  >
                    {isLoggingInOtp ? 'Verifying...' : 'Verify & Sign In'} <ArrowRight size={18} />
                  </button>
                </form>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '16px',
                    paddingTop: '12px',
                    borderTop: '1px solid var(--border-color)',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setOtpStep('email')}
                    style={{
                      fontSize: '0.825rem',
                      color: 'var(--secondary-text)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    ← Change Email
                  </button>

                  <button
                    type="button"
                    disabled={otpCooldown > 0 || isSendingLoginOtp}
                    onClick={handleResendLoginOtp}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.825rem',
                      fontWeight: 600,
                      color: otpCooldown > 0 ? 'var(--secondary-text)' : '#A78BFA',
                      background: 'none',
                      border: 'none',
                      cursor: otpCooldown > 0 ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <RefreshCw size={13} className={isSendingLoginOtp ? 'spin' : ''} />
                    {otpCooldown > 0 ? `Resend Code (${otpCooldown}s)` : 'Resend Code'}
                  </button>
                </div>

                <div style={{ textAlign: 'center', marginTop: '14px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginMode('password');
                      setOtpStep('email');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--secondary-text)',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    <KeyRound size={13} /> Switch back to Password Sign In
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: 'var(--secondary-text)' }}>
          Don't have an OpenPath account?{' '}
          <button
            onClick={() => navigate('register')}
            style={{ color: '#F472B6', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}
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
          <div className="card" style={{ maxWidth: '440px', width: '100%', padding: '28px', backgroundColor: 'var(--card-bg)' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', color: 'var(--primary-text)' }}>
              {forgotStep === 'email' ? 'Reset Your Password' : 'Enter Verification Code'}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--secondary-text)', marginBottom: '18px' }}>
              {forgotStep === 'email'
                ? 'Enter your registered email address to receive an OTP verification code.'
                : `Enter the verification code sent to ${forgotEmail} and choose a new password.`}
            </p>

            {forgotStep === 'email' ? (
              <form onSubmit={handleSendResetCode}>
                <input
                  type="email"
                  required
                  className="form-input"
                  placeholder="user@example.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  style={{ marginBottom: '18px' }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button type="button" onClick={() => setShowForgotModal(false)} className="btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" disabled={forgotLoading} className="btn-primary">
                    {forgotLoading ? 'Sending...' : 'Send Reset Code'}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleResetPassword}>
                {forgotDeliveredViaSmtp ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '8px 12px',
                      backgroundColor: 'rgba(16, 185, 129, 0.12)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      color: '#10B981',
                      fontSize: '0.825rem',
                      marginBottom: '14px',
                    }}
                  >
                    <CheckCircle2 size={15} /> Code delivered to inbox!
                  </div>
                ) : resetOtpPreview ? (
                  <div
                    style={{
                      padding: '10px',
                      backgroundColor: 'rgba(124, 58, 237, 0.15)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid rgba(168, 85, 247, 0.35)',
                      textAlign: 'center',
                      marginBottom: '16px',
                      fontSize: '0.85rem',
                      color: 'var(--primary-text)',
                    }}
                  >
                    Demo OTP Code: <strong style={{ color: '#F472B6' }}>{resetOtpPreview}</strong>
                  </div>
                ) : null}

                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>6-Digit OTP</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    required
                    maxLength={6}
                    placeholder="Enter code"
                    className="form-input"
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '18px' }}>
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>New Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="Enter new password (min 6 chars)"
                    className="form-input"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button
                    type="button"
                    onClick={() => setForgotStep('email')}
                    className="btn-ghost"
                    style={{ fontSize: '0.825rem' }}
                  >
                    ← Back
                  </button>

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button
                      type="button"
                      disabled={forgotCooldown > 0 || forgotLoading}
                      onClick={handleResendResetCode}
                      className="btn-outline"
                      style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                    >
                      {forgotCooldown > 0 ? `Resend (${forgotCooldown}s)` : 'Resend'}
                    </button>
                    <button type="submit" disabled={forgotLoading} className="btn-primary" style={{ padding: '8px 16px' }}>
                      {forgotLoading ? 'Resetting...' : 'Reset Password'}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
