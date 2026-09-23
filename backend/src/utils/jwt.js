import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';

export const generateToken = (payload) => {
  return jwt.sign(payload, ENV.JWT_SECRET, {
    expiresIn: ENV.JWT_EXPIRES_IN,
  });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, ENV.JWT_SECRET);
  } catch (err) {
    return null;
  }
};

export const sendTokenCookie = (res, user) => {
  const token = generateToken({
    id: user._id,
    role: user.role,
    email: user.email,
  });

  const isProduction = ENV.NODE_ENV === 'production';

  res.cookie(ENV.COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return token;
};
