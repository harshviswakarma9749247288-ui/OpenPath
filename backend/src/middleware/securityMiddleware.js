// Security Middleware for OpenPath: NoSQL Injection Prevention & HTTP Security Headers

/**
 * Recursively strips keys starting with '$' or containing '.' to eliminate NoSQL operator injections
 */
const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') {
    if (typeof obj === 'string') {
      // Basic XSS mitigation: strip potential executable script tags from text inputs
      return obj.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    }
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item));
  }

  const sanitized = {};
  for (const key of Object.keys(obj)) {
    // Block Mongo operators ($gt, $ne, $where, etc.) and dot notation
    if (key.startsWith('$') || key.includes('.')) {
      continue;
    }
    sanitized[key] = sanitizeObject(obj[key]);
  }
  return sanitized;
};

/**
 * Middleware that cleans req.body, req.query, and req.params against NoSQL injection
 */
export const mongoSanitize = (req, res, next) => {
  try {
    if (req.body) {
      req.body = sanitizeObject(req.body);
    }
    if (req.query) {
      req.query = sanitizeObject(req.query);
    }
    if (req.params) {
      req.params = sanitizeObject(req.params);
    }
  } catch (err) {
    // Continue cleanly if sanitization encounters any malformed object
  }
  next();
};

/**
 * Middleware setting essential HTTP Security Headers (Helmet equivalent with zero external overhead)
 */
export const securityHeaders = (req, res, next) => {
  // Prevent MIME-sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Clickjacking protection: only allow same origin frames
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');

  // Cross-site scripting (XSS) filter
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Strict Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Modern browser permissions policy
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // Disable cache for sensitive API responses
  if (req.path.startsWith('/api/auth') || req.path.startsWith('/api/admin')) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }

  next();
};
