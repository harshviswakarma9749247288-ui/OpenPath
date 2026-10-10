import express from 'express';
import {
  register,
  login,
  logout,
  sendOtp,
  verifyOtp,
  loginWithOtp,
  googleAuth,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js';
import {
  otpRateLimiter,
  authRateLimiter,
  passwordResetRateLimiter,
} from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/register', authRateLimiter, register);
router.post('/login', authRateLimiter, login);
router.post('/logout', logout);
router.post('/otp/send', otpRateLimiter, sendOtp);
router.post('/otp/verify', verifyOtp);
router.post('/otp/login', authRateLimiter, loginWithOtp);
router.post('/google', authRateLimiter, googleAuth);
router.post('/password/forgot', passwordResetRateLimiter, forgotPassword);
router.post('/password/reset', authRateLimiter, resetPassword);

export default router;
