import { errorResponse } from '../utils/response.js';

export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'Authentication required', 401);
    }
    if (!allowedRoles.includes(req.user.role)) {
      return errorResponse(
        res,
        `Access denied. This action requires one of the following roles: [${allowedRoles.join(', ')}].`,
        403
      );
    }
    next();
  };
};
