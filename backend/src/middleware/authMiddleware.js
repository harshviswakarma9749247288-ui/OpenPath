import { verifyToken } from '../utils/jwt.js';
import { ENV } from '../config/env.js';
import User from '../models/User.js';
import { errorResponse } from '../utils/response.js';

export const protect = async (req, res, next) => {
  try {
    let token = req.cookies?.[ENV.COOKIE_NAME];

    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return errorResponse(res, 'Authentication required. Please log in.', 401);
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.id) {
      return errorResponse(res, 'Invalid or expired session. Please log in again.', 401);
    }

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return errorResponse(res, 'User account no longer exists.', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    return errorResponse(res, 'Authentication error: ' + error.message, 401);
  }
};

// Optional auth for public routes that adapt content when user is logged in
export const optionalAuth = async (req, res, next) => {
  try {
    let token = req.cookies?.[ENV.COOKIE_NAME];
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (token) {
      const decoded = verifyToken(token);
      if (decoded && decoded.id) {
        const user = await User.findById(decoded.id).select('-password');
        if (user) {
          req.user = user;
        }
      }
    }
  } catch (err) {
    // Silently continue for optional auth
  }
  next();
};
