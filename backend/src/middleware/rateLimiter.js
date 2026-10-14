// In-memory sliding-window rate limiter for sensitive authentication & OTP endpoints
// Zero external dependencies, automatic garbage collection, IP + identifier support

class MemoryRateLimiter {
  constructor({ windowMs = 60 * 1000, max = 30, message = 'Too many requests. Please slow down.' }) {
    this.windowMs = windowMs;
    this.max = max;
    this.message = message;
    this.hits = new Map(); // key -> [timestamp, timestamp, ...]

    // Periodic cleanup of expired records every 2 minutes
    this.cleanupTimer = setInterval(() => {
      const now = Date.now();
      for (const [key, timestamps] of this.hits.entries()) {
        const valid = timestamps.filter((t) => now - t < this.windowMs);
        if (valid.length === 0) {
          this.hits.delete(key);
        } else {
          this.hits.set(key, valid);
        }
      }
    }, 2 * 60 * 1000);

    if (this.cleanupTimer.unref) {
      this.cleanupTimer.unref();
    }
  }

  middleware(keyExtractor) {
    return (req, res, next) => {
      const now = Date.now();
      const ip =
        req.ip ||
        req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
        req.connection?.remoteAddress ||
        'unknown';
      const customKey = keyExtractor ? keyExtractor(req) : null;
      const key = customKey ? `${ip}:${customKey}` : ip;

      const timestamps = this.hits.get(key) || [];
      const windowStart = now - this.windowMs;
      const validTimestamps = timestamps.filter((t) => t > windowStart);

      if (validTimestamps.length >= this.max) {
        const oldest = validTimestamps[0];
        const retryAfterSec = Math.ceil((this.windowMs - (now - oldest)) / 1000);

        res.setHeader('Retry-After', retryAfterSec);
        return res.status(429).json({
          success: false,
          error: this.message,
          retryAfter: `${retryAfterSec} seconds`,
        });
      }

      validTimestamps.push(now);
      this.hits.set(key, validTimestamps);
      next();
    };
  }
}

// 1. OTP Dispatch Rate Limiter: Max 20 OTP requests per 2 minutes per email/IP
export const otpRateLimiter = new MemoryRateLimiter({
  windowMs: 2 * 60 * 1000, // 2 minutes
  max: 20,
  message: 'Verification code rate limit reached. Too many requests. Please wait a minute before trying again.',
}).middleware((req) => (req.body?.email ? String(req.body.email).toLowerCase().trim() : ''));

// 2. Auth Login Limiter: Max 30 attempts per 5 minutes per IP
export const authRateLimiter = new MemoryRateLimiter({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 30,
  message: 'Too many authentication attempts. Please wait a few moments before trying again.',
}).middleware();

// 3. Password Reset Limiter: Max 4 reset requests per 15 minutes per IP/email
export const passwordResetRateLimiter = new MemoryRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 4,
  message: 'Too many password reset requests. Please check your inbox or wait 15 minutes before requesting again.',
}).middleware((req) => (req.body?.email ? String(req.body.email).toLowerCase().trim() : ''));

// 4. General Public API Limiter: Max 200 requests per minute per IP
export const generalApiLimiter = new MemoryRateLimiter({
  windowMs: 60 * 1000,
  max: 200,
  message: 'High traffic detected. Please slow down your requests.',
}).middleware();
