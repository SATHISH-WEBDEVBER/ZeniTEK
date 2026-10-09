/**
 * Authentication routes
 *   POST /api/auth/login  { username, password, role }  -> { token, user }
 *   GET  /api/auth/me     (any signed-in role)          -> { user }
 */
import express from 'express';
import { ROLES, verifyCredentials, signToken, requireAuth, TOKEN_TTL } from '../middleware/auth.js';

const router = express.Router();

// Simple in-memory rate limiter: 10 attempts / 15 min / IP (successful logins don't count)
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 10;
const attempts = new Map(); // ip -> { count, resetAt }

setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of attempts) if (entry.resetAt <= now) attempts.delete(ip);
}, WINDOW_MS).unref();

function loginRateLimit(req, res, next) {
  const ip = req.ip || req.socket?.remoteAddress || 'unknown';
  const now = Date.now();
  let entry = attempts.get(ip);
  if (!entry || entry.resetAt <= now) {
    entry = { count: 0, resetAt: now + WINDOW_MS };
    attempts.set(ip, entry);
  }
  if (entry.count >= MAX_ATTEMPTS) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    res.set('Retry-After', String(retryAfter));
    return res.status(429).json({
      success: false,
      message: `Too many login attempts. Try again in ${Math.ceil(retryAfter / 60)} minute(s).`
    });
  }
  req.rateEntry = entry;
  return next();
}

router.post('/login', loginRateLimit, async (req, res, next) => {
  try {
    const { username, password, role } = req.body || {};
    if (!username || !password || !role) {
      return res.status(400).json({ success: false, message: 'username, password and role are required' });
    }
    if (!ROLES.includes(role)) {
      return res.status(400).json({ success: false, message: `role must be one of: ${ROLES.join(', ')}` });
    }
    const user = await verifyCredentials(role, String(username), String(password));
    if (!user) {
      req.rateEntry.count += 1;
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }
    const token = signToken(user, role);
    return res.json({ success: true, token, expiresIn: TOKEN_TTL, user: { username: user, role } });
  } catch (err) {
    return next(err);
  }
});

router.get('/me', requireAuth, (req, res) => res.json({ success: true, user: req.user }));

export default router;
