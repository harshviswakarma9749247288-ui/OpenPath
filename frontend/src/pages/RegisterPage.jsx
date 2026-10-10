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
    <div className="split-auth-layout">
      {/* Floating Theme Toggle in Auth Screen */}
      <div className="auth-theme-toggle-floating">
        <ThemeToggle showLabel={true} size="sm" />
      </div>

      {/* Left Branding Pane */}
      <div className="auth-branding-pane">
        <div className="auth-brand-ambient-glow" />

        <div className="auth-brand-content">
          <div onClick={() => navigate('landing')} className="auth-brand-logo-row">
            <AnimatedLogo size="md" />
            <span className="auth-brand-logo-text">
              Open<span className="gradient-text">Path</span>
            </span>
          </div>

          <h2 className="auth-brand-heading">
            Start Your Journey with <br />
            <span className="gradient-text">Clarity & Purpose</span>
          </h2>
          <p className="auth-brand-desc">
            Join thousands of college students, freshers, and progressive hiring teams connecting through
            transparent skill matching.
          </p>
        </div>

        <div className="auth-policy-card">
          <strong className="auth-policy-card-title">Transparent Match Policy:</strong>
          <p className="auth-policy-card-desc">
            OpenPath never hides candidate qualifications behind black boxes. Every applicant sees their
            mathematical 5-factor breakdown and specific missing skills.
          </p>
        </div>

        <div className="auth-brand-footer">
          Brand Promise: Your Path. Your Opportunity.
        </div>
      </div>

      {/* Right Form Pane */}
      <div className="auth-form-pane">
        <BackButton
          label={step === 'form' ? 'Back to Home' : 'Back to Registration Form'}
          onClick={step === 'otp' ? () => setStep('form') : undefined}
          fallbackPage="landing"
          className="auth-back-btn"
        />

        {step === 'form' ? (
          <div>
            <div className="auth-form-header">
              <h2 className="auth-form-title">
                Create Your Account
              </h2>
              <p className="auth-form-subtitle">
                Select your role to configure your OpenPath environment.
              </p>
            </div>

            {/* Role Switcher with 3D Tilt */}
            <Tilt3DCard maxTilt={6} className="auth-role-switcher-2col">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`auth-role-btn ${role === 'student' ? 'active-student' : ''}`}
              >
                <GraduationCap size={18} color={role === 'student' ? '#C084FC' : 'currentColor'} /> Student / Fresher
              </button>

              <button
                type="button"
                onClick={() => setRole('employer')}
                className={`auth-role-btn ${role === 'employer' ? 'active-employer' : ''}`}
              >
                <Briefcase size={18} color={role === 'employer' ? '#F472B6' : 'currentColor'} /> Employer / Hiring
              </button>
            </Tilt3DCard>

            {error && (
              <div className="auth-error-banner">
                {error}
              </div>
            )}

            <form onSubmit={handleInitialSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div className="auth-input-wrapper">
                  <User size={18} className="auth-input-icon" />
                  <input
                    type="text"
                    required
                    className="form-input auth-input-field"
                    placeholder="e.g. Alex Rivera"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="auth-input-wrapper">
                  <Mail size={18} className="auth-input-icon" />
                  <input
                    type="email"
                    required
                    className="form-input auth-input-field"
                    placeholder={role === 'student' ? 'alex.rivera@university.edu' : 'recruiter@company.io'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="auth-input-wrapper">
                  <Lock size={18} className="auth-input-icon" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    className="form-input auth-input-field"
                    placeholder="Min 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <div className="auth-input-wrapper">
                  <Lock size={18} className="auth-input-icon" />
                  <input
                    type="password"
                    required
                    className="form-input auth-input-field"
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || isSendingOtp}
                className="btn-primary auth-submit-btn"
              >
                {isSendingOtp ? 'Sending Code...' : 'Continue to Verification'} <ArrowRight size={18} />
              </button>
            </form>

            <p className="auth-footer-prompt">
              Already registered?{' '}
              <button onClick={() => navigate('login')} className="auth-footer-link">
                Sign In
              </button>
            </p>
          </div>
        ) : (
          /* STEP 2: OTP VERIFICATION */
          <div className="animate-fade-in">
            <div className="auth-center-header-lg">
              <div className="auth-otp-shield-box">
                <ShieldCheck size={28} />
              </div>
              <h2 className="auth-form-title">Enter Verification Code</h2>
              <p className="auth-form-subtitle">
                We sent a 6-digit OTP code to <strong>{email}</strong>
              </p>
            </div>

            {deliveredViaSmtp ? (
              <div className="auth-otp-status-banner success auth-mb-18">
                <CheckCircle2 size={16} /> Delivered to your inbox via SMTP
              </div>
            ) : demoCode ? (
              <div className="auth-otp-preview-card auth-mb-18">
                <span>Demo / Test OTP Code: </span>
                <strong className="auth-otp-preview-code">{demoCode}</strong>
                <div className="auth-instruction-caption">
                  (Auto-filled for rapid testing & evaluation)
                </div>
              </div>
            ) : null}

            <form onSubmit={handleVerifyOtp}>
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
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || isVerifyingOtp || otpCode.length < 6}
                className="btn-primary auth-submit-btn"
              >
                {isLoading || isVerifyingOtp ? 'Verifying...' : 'Verify & Launch Profile'} <ArrowRight size={18} />
              </button>
            </form>

            <div className="auth-otp-footer-row">
              <button
                type="button"
                onClick={() => setStep('form')}
                className="auth-switch-back-btn"
              >
                ← Edit details
              </button>

              <button
                type="button"
                disabled={cooldown > 0 || isSendingOtp}
                onClick={handleResendOtp}
                className="auth-resend-btn"
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
