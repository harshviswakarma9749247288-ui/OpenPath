import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import OTP from '../models/OTP.js';
import { sendTokenCookie } from '../utils/jwt.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { ENV } from '../config/env.js';
import { sendOtpEmail } from '../utils/emailService.js';

// @desc    Register a new user (student or employer)
// @route   POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword, role } = req.body;

    if (!name || !email || !password) {
      return errorResponse(res, 'Please provide name, email, and password.', 400);
    }

    if (password.length < 6) {
      return errorResponse(res, 'Password must be at least 6 characters long.', 400);
    }

    if (confirmPassword && password !== confirmPassword) {
      return errorResponse(res, 'Passwords do not match.', 400);
    }

    const emailNorm = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email: emailNorm });
    if (existingUser) {
      return errorResponse(res, 'An account with this email address already exists.', 400);
    }

    const assignedRole = role === 'employer' ? 'employer' : 'student';

    const user = await User.create({
      name,
      email: emailNorm,
      password,
      role: assignedRole,
      profileCompleted: false,
    });

    // Delete verified OTP record after successful registration
    await OTP.deleteMany({ email: emailNorm });

    const token = sendTokenCookie(res, user);

    const safeUser = user.toObject();
    delete safeUser.password;

    return successResponse(
      res,
      { user: safeUser, token },
      'Registration successful! Welcome to OpenPath.',
      201
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 'Please provide both email and password.', 400);
    }

    const user = await User.findOne({ email: email.toLowerCase() })
      .select('+password')
      .populate('skills');

    if (!user) {
      return errorResponse(res, 'Invalid email or password.', 401);
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return errorResponse(res, 'Invalid email or password.', 401);
    }

    const token = sendTokenCookie(res, user);

    const safeUser = user.toObject();
    delete safeUser.password;

    return successResponse(res, { user: safeUser, token }, 'Logged in successfully.');
  } catch (error) {
    next(error);
  }
};

// @desc    Log user out / clear cookie
// @route   POST /api/auth/logout
export const logout = (req, res) => {
  res.cookie(ENV.COOKIE_NAME, 'none', {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
  });
  return successResponse(res, {}, 'Successfully logged out.');
};

// @desc    Send OTP to email
// @route   POST /api/auth/otp/send
export const sendOtp = async (req, res, next) => {
  try {
    const { email, purpose = 'Registration' } = req.body;
    if (!email) {
      return errorResponse(res, 'Email is required for OTP verification.', 400);
    }

    const emailNorm = email.toLowerCase().trim();

    // If purpose is Registration, check if user already exists
    if (purpose === 'Registration') {
      const existingUser = await User.findOne({ email: emailNorm });
      if (existingUser) {
        return errorResponse(res, 'An account with this email address already exists. Please sign in.', 400);
      }
    }

    // If purpose is Login, check if user exists
    if (purpose === 'Login') {
      const existingUser = await User.findOne({ email: emailNorm });
      if (!existingUser) {
        return errorResponse(res, 'No account found with this email. Please register first.', 404);
      }
    }

    // Generate 6 digit code
    const rawOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const salt = await bcrypt.genSalt(10);
    const otpHash = await bcrypt.hash(rawOtp, salt);

    // Save with 10-minute expiry
    await OTP.deleteMany({ email: emailNorm });
    await OTP.create({
      email: emailNorm,
      otpHash,
      purpose,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      attempts: 0,
      verified: false,
    });

    // Send email using emailService (live SMTP delivery or fallback console preview)
    const { delivered, previewOtp } = await sendOtpEmail({
      to: emailNorm,
      code: rawOtp,
      purpose,
    });

    return successResponse(
      res,
      {
        email: emailNorm,
        delivered,
        previewOtp,
        expiresIn: '10 minutes',
      },
      delivered
        ? `Verification code dispatched to ${emailNorm}. Please check your inbox.`
        : `Verification code sent to ${emailNorm} (Code: ${previewOtp})`
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Verify OTP
// @route   POST /api/auth/otp/verify
export const verifyOtp = async (req, res, next) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return errorResponse(res, 'Email and OTP code are required.', 400);
    }

    const emailNorm = email.toLowerCase().trim();
    const record = await OTP.findOne({ email: emailNorm });
    if (!record) {
      return errorResponse(res, 'No OTP request found or code expired. Please request a new code.', 400);
    }

    if (record.attempts >= 5) {
      await OTP.deleteOne({ _id: record._id });
      return errorResponse(res, 'Maximum verification attempts exceeded. Please request a new code.', 429);
    }

    const isValid = await bcrypt.compare(String(code).trim(), record.otpHash);
    if (!isValid) {
      record.attempts += 1;
      await record.save();
      return errorResponse(res, 'Invalid verification code. Please check and try again.', 400);
    }

    record.verified = true;
    await record.save();

    return successResponse(res, { verified: true }, 'Email successfully verified.');
  } catch (error) {
    next(error);
  }
};

// @desc    Passwordless Login with OTP
// @route   POST /api/auth/otp/login
export const loginWithOtp = async (req, res, next) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return errorResponse(res, 'Email and OTP code are required.', 400);
    }

    const emailNorm = email.toLowerCase().trim();
    const record = await OTP.findOne({ email: emailNorm });
    if (!record) {
      return errorResponse(res, 'No OTP request found or code expired. Please request a new code.', 400);
    }

    const isValid = await bcrypt.compare(String(code).trim(), record.otpHash);
    if (!isValid) {
      record.attempts += 1;
      await record.save();
      return errorResponse(res, 'Invalid verification code. Please check and try again.', 400);
    }

    const user = await User.findOne({ email: emailNorm }).populate('skills');
    if (!user) {
      return errorResponse(res, 'No account found with this email. Please register first.', 404);
    }

    await OTP.deleteOne({ _id: record._id });

    const token = sendTokenCookie(res, user);
    const safeUser = user.toObject();
    delete safeUser.password;

    return successResponse(res, { user: safeUser, token }, 'Logged in successfully with OTP verification.');
  } catch (error) {
    next(error);
  }
};

// @desc    Google OAuth mock/exchange
// @route   POST /api/auth/google
export const googleAuth = async (req, res, next) => {
  try {
    const { email, name, googleId } = req.body;
    if (!email) {
      return errorResponse(res, 'Email is required for Google sign-in.', 400);
    }

    let user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      user = await User.create({
        name: name || 'Google User',
        email: email.toLowerCase(),
        authProvider: 'google',
        googleId: googleId || `goog_${Date.now()}`,
        role: 'student',
        profileCompleted: false,
      });
    }

    const token = sendTokenCookie(res, user);
    const safeUser = user.toObject();
    delete safeUser.password;

    return successResponse(res, { user: safeUser, token }, 'Google sign-in successful.');
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot Password
// @route   POST /api/auth/password/forgot
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return errorResponse(res, 'Please provide your account email.', 400);
    }

    const emailNorm = email.toLowerCase().trim();
    const user = await User.findOne({ email: emailNorm });
    if (!user) {
      // Don't leak if account exists or not
      return successResponse(res, {}, 'If an account exists, a password reset code has been sent.');
    }

    // Call sendOtp logic
    const rawOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const salt = await bcrypt.genSalt(10);
    const otpHash = await bcrypt.hash(rawOtp, salt);

    await OTP.deleteMany({ email: emailNorm });
    await OTP.create({
      user: user._id,
      email: emailNorm,
      otpHash,
      purpose: 'Password Reset',
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      attempts: 0,
      verified: false,
    });

    const { delivered, previewOtp } = await sendOtpEmail({
      to: emailNorm,
      code: rawOtp,
      purpose: 'Password Reset',
    });

    return successResponse(
      res,
      { email: emailNorm, delivered, previewOtp },
      delivered
        ? `Password reset code sent to ${emailNorm}. Please check your inbox.`
        : `Reset code generated for ${emailNorm} (Demo Code: ${previewOtp})`
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Reset Password with OTP
// @route   POST /api/auth/password/reset
export const resetPassword = async (req, res, next) => {
  try {
    const { email, code, newPassword } = req.body;
    if (!email || !code || !newPassword) {
      return errorResponse(res, 'Email, code, and new password are required.', 400);
    }

    const record = await OTP.findOne({ email: email.toLowerCase(), purpose: 'Password Reset' });
    if (!record) {
      return errorResponse(res, 'Invalid or expired reset code.', 400);
    }

    const isMatch = await bcrypt.compare(code, record.otpHash);
    if (!isMatch) {
      return errorResponse(res, 'Invalid verification code.', 400);
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return errorResponse(res, 'User not found.', 404);
    }

    user.password = newPassword;
    await user.save();
    await OTP.deleteOne({ _id: record._id });

    return successResponse(res, {}, 'Password successfully reset! You can now log in.');
  } catch (error) {
    next(error);
  }
};
