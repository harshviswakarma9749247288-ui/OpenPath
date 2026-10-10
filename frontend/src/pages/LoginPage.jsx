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
    <div className="split-auth-layout">
      {/* Floating Theme Toggle in Auth Screen */}
      <div className="auth-theme-toggle-floating">
        <ThemeToggle showLabel={true} size="sm" />
      </div>

      {/* Left Branding Pane */}
      <div className="auth-branding-pane">
        <div className="auth-brand-ambient-glow" />

        <div className="auth-brand-content">
          {/* Logo */}
          <div onClick={() => navigate('landing')} className="auth-brand-logo-row">
            <AnimatedLogo size="md" />
            <span className="auth-brand-logo-text">
              Open<span className="gradient-text">Path</span>
            </span>
          </div>

          <h2 className="auth-brand-heading">
            Find Your Path. <br />
            <span className="gradient-text">Build Your Future.</span>
          </h2>
          <p className="auth-brand-desc">
            The career platform engineered for students, freshers, and early talent with transparent,
            explainable matching and customized skill roadmaps.
          </p>
        </div>

        <div className="auth-features-list">
          <div className="auth-feature-item">
            <CheckCircle2 size={20} color="#A78BFA" />
            <span>50% Skills, 15% Qualifications, 15% Experience factor scoring</span>
          </div>
          <div className="auth-feature-item">
            <CheckCircle2 size={20} color="#F472B6" />
            <span>Actionable skill gap detection and curated learning paths</span>
          </div>
          <div className="auth-feature-item">
            <CheckCircle2 size={20} color="#38BDF8" />
            <span>Direct employer review portal with instant candidate rankings</span>
          </div>
        </div>

        <div className="auth-brand-footer">
          © 2026 OpenPath • Connecting talent with verified opportunities.
        </div>
      </div>

      {/* Right Login Form Pane */}
      <div className="auth-form-pane">
        <BackButton label="Back to Home" fallbackPage="landing" className="auth-back-btn" />

        <div className="auth-form-header">
          <div className="auth-badge-row">
            <span className={`auth-portal-badge role-${portalRole}`}>
              {portalRole === 'admin'
                ? '🛡️ Admin Command Portal'
                : portalRole === 'employer'
                ? '💼 Employer Portal'
                : '🎓 Student Portal'}
            </span>
          </div>
          <h2 className="auth-form-title">
            {portalRole === 'admin'
              ? 'Administrator Sign In'
              : portalRole === 'employer'
              ? 'Employer Sign In'
              : 'Student Sign In'}
          </h2>
          <p className="auth-form-subtitle">
            {portalRole === 'admin'
              ? 'Sign in to access platform governance, user directory, listing moderation, and system telemetry.'
              : portalRole === 'employer'
              ? 'Sign in to manage opportunity listings, inspect match telemetry, and review applicants.'
              : 'Sign in to access verified opportunities, 3D skill roadmaps, and AI career matching.'}
          </p>
        </div>

        {/* Role Portal Switcher */}
        <div className="auth-role-switcher">
          <button
            type="button"
            onClick={() => {
              setPortalRole('student');
              if (email === 'recruiter@techcorp.io' || email === 'admin@openpath.io') {
                setEmail('');
                setPassword('');
              }
            }}
            className={`auth-role-btn ${portalRole === 'student' ? 'active-student' : ''}`}
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
            className={`auth-role-btn ${portalRole === 'employer' ? 'active-employer' : ''}`}
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
            className={`auth-role-btn ${portalRole === 'admin' ? 'active-admin' : ''}`}
          >
            <ShieldCheck size={15} color={portalRole === 'admin' ? '#F87171' : 'currentColor'} />
            <span>Admin</span>
          </button>
        </div>

        {/* Login Method Tabs */}
        <div className="auth-mode-toggle">
          <button
            type="button"
            onClick={() => setLoginMode('password')}
            className={`auth-mode-btn ${loginMode === 'password' ? 'active-password' : ''}`}
          >
            <KeyRound size={16} /> Password Sign In
          </button>

          <button
            type="button"
            onClick={() => {
              setLoginMode('otp');
              if (!otpEmail && email) setOtpEmail(email);
            }}
            className={`auth-mode-btn ${loginMode === 'otp' ? 'active-otp' : ''}`}
          >
            <Mail size={16} /> Email OTP Sign In
          </button>
        </div>

        {error && (
          <div className="auth-error-banner">
            {error}
          </div>
        )}

        {/* 1. PASSWORD LOGIN FORM */}
        {loginMode === 'password' ? (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="auth-input-wrapper">
                <Mail size={18} className="auth-input-icon" />
                <input
                  type="email"
                  required
                  className="form-input auth-input-field"
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
              <div className="auth-password-header">
                <label className="form-label">Password</label>
                <button
                  type="button"
                  onClick={() => {
                    setForgotEmail(email);
                    setShowForgotModal(true);
                  }}
                  className="auth-forgot-link"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="auth-input-wrapper">
                <Lock size={18} className="auth-input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="form-input auth-input-field-both"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="auth-toggle-pwd-btn"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary auth-submit-btn"
            >
              {isLoading ? 'Signing In...' : 'Sign In'} <ArrowRight size={18} />
            </button>

            <div className="auth-alt-action-box">
              <button
                type="button"
                onClick={() => {
                  setLoginMode('otp');
                  if (!otpEmail && email) setOtpEmail(email);
                }}
                className="auth-alt-btn"
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
                  <div className="auth-input-wrapper">
                    <Mail size={18} className="auth-input-icon" />
                    <input
                      type="email"
                      required
                      className="form-input auth-input-field"
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
                  className="btn-primary auth-submit-btn"
                >
                  {isSendingLoginOtp ? 'Generating Code...' : 'Get Login OTP Code'} <ArrowRight size={18} />
                </button>

                <div className="auth-alt-action-box">
                  <button
                    type="button"
                    onClick={() => setLoginMode('password')}
                    className="auth-alt-btn-muted"
                  >
                    <KeyRound size={15} /> Sign in with Password instead
                  </button>
                </div>
              </form>
            ) : (
              /* OTP Code Input Step */
              <div>
                <div className="auth-center-header">
                  <p className="auth-otp-target-text">
                    Enter the 6-digit code sent to <strong>{otpEmail || email}</strong>
                  </p>
                </div>

                {otpDeliveredViaSmtp ? (
                  <div className="auth-otp-status-banner success">
                    <CheckCircle2 size={16} /> Verification code delivered to your email inbox!
                  </div>
                ) : otpPreviewCode ? (
                  <div className="auth-otp-preview-card">
                    <span className="auth-subdued-text">Email Verification Code: </span>
                    <strong className="auth-otp-preview-code">
                      {otpPreviewCode}
                    </strong>
                    <div className="auth-instruction-caption">
                      (Enter this 6-digit code below to authenticate)
                    </div>
                  </div>
                ) : null}

                <form onSubmit={handleLoginWithOtpSubmit}>
                  <div className="form-group auth-mb-18">
                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      pattern="[0-9]*"
                      maxLength={6}
                      required
                      autoFocus
                      placeholder="000000"
                      className="form-input auth-code-input-lg"
                      value={otpLoginCode}
                      onChange={(e) => setOtpLoginCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoggingInOtp || otpLoginCode.length < 6}
                    className="btn-primary auth-submit-btn"
                  >
                    {isLoggingInOtp ? 'Verifying...' : 'Verify & Sign In'} <ArrowRight size={18} />
                  </button>
                </form>

                <div className="auth-otp-footer-row">
                  <button
                    type="button"
                    onClick={() => setOtpStep('email')}
                    className="auth-switch-back-btn"
                  >
                    ← Change Email
                  </button>

                  <button
                    type="button"
                    disabled={otpCooldown > 0 || isSendingLoginOtp}
                    onClick={handleResendLoginOtp}
                    className="auth-resend-btn"
                  >
                    <RefreshCw size={13} className={isSendingLoginOtp ? 'spin' : ''} />
                    {otpCooldown > 0 ? `Resend Code (${otpCooldown}s)` : 'Resend Code'}
                  </button>
                </div>

                <div className="auth-alt-action-box">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginMode('password');
                      setOtpStep('email');
                    }}
                    className="auth-switch-back-btn"
                  >
                    <KeyRound size={13} /> Switch back to Password Sign In
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <p className="auth-footer-prompt">
          Don't have an OpenPath account?{' '}
          <button
            onClick={() => navigate('register')}
            className="auth-footer-link"
          >
            Create an Account
          </button>
        </p>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="auth-modal-overlay">
          <div className="card auth-modal-card">
            <h3 className="auth-modal-title">
              {forgotStep === 'email' ? 'Reset Your Password' : 'Enter Verification Code'}
            </h3>
            <p className="auth-modal-desc">
              {forgotStep === 'email'
                ? 'Enter your registered email address to receive an OTP verification code.'
                : `Enter the verification code sent to ${forgotEmail} and choose a new password.`}
            </p>

            {forgotStep === 'email' ? (
              <form onSubmit={handleSendResetCode}>
                <input
                  type="email"
                  required
                  className="form-input auth-mb-18"
                  placeholder="user@example.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                />
                <div className="auth-modal-actions">
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
                  <div className="auth-otp-status-banner success auth-mb-14">
                    <CheckCircle2 size={15} /> Code delivered to inbox!
                  </div>
                ) : resetOtpPreview ? (
                  <div className="auth-otp-preview-card auth-mb-16">
                    Demo OTP Code: <strong className="auth-highlight-pink">{resetOtpPreview}</strong>
                  </div>
                ) : null}

                <div className="form-group auth-mb-12">
                  <label className="form-label auth-modal-field-label">6-Digit OTP</label>
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

                <div className="form-group auth-mb-18">
                  <label className="form-label auth-modal-field-label">New Password</label>
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

                <div className="auth-modal-split-actions">
                  <button
                    type="button"
                    onClick={() => setForgotStep('email')}
                    className="btn-ghost auth-btn-ghost-sm"
                  >
                    ← Back
                  </button>

                  <div className="auth-modal-btn-group">
                    <button
                      type="button"
                      disabled={forgotCooldown > 0 || forgotLoading}
                      onClick={handleResendResetCode}
                      className="btn-outline auth-btn-resend-modal"
                    >
                      {forgotCooldown > 0 ? `Resend (${forgotCooldown}s)` : 'Resend'}
                    </button>
                    <button type="submit" disabled={forgotLoading} className="btn-primary auth-btn-submit-modal">
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
