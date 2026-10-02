/**
 * ZeniTEK Admin Authentication Middleware
 * Supports two methods:
 *  1. X-Admin-Key header (API key for admin panel calls)
 *  2. Authorization: Bearer <JWT> (future-proof token auth)
 */
import jwt from 'jsonwebtoken';

const ADMIN_API_KEY = process.env.ADMIN_API_KEY || 'zenitek_admin_2025_secret';
const JWT_SECRET = process.env.JWT_SECRET || 'zenitek_jwt_secret_key_2025';

/**
 * requireAdmin middleware
 * Accepts either:
 *   - X-Admin-Key header matching ADMIN_API_KEY
 *   - Authorization: Bearer <valid_jwt>
 */
export function requireAdmin(req, res, next) {
  // Method 1: API Key via header
  const apiKey = req.headers['x-admin-key'];
  if (apiKey && apiKey === ADMIN_API_KEY) {
    req.admin = { method: 'api_key' };
    return next();
  }

  // Method 2: JWT Bearer token
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.admin = decoded;
      return next();
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
  }

  return res.status(401).json({
    success: false,
    message: 'Admin authentication required. Provide X-Admin-Key header or Bearer token.'
  });
}

/**
 * POST /api/admin/login - Issue a JWT for admin sessions
 */
export { JWT_SECRET, ADMIN_API_KEY };
