import express from 'express';
import {
  register,
  login,
  demoLogin,
  logout,
  sendOtp,
  verifyOtp,
  googleAuth,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/demo-login', demoLogin);
router.post('/logout', logout);
router.post('/otp/send', sendOtp);
router.post('/otp/verify', verifyOtp);
router.post('/google', googleAuth);
router.post('/password/forgot', forgotPassword);
router.post('/password/reset', resetPassword);

export default router;
