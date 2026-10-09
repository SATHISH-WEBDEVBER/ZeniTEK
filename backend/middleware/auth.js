/**
 * ZeniTEK authentication & role-based access control
 *
 * Accounts are defined only in environment variables (backend/.env):
 *   CLIENT_ADMIN_USERNAME / CLIENT_ADMIN_PASSWORD   -> role "client"   (website CMS)
 *   DEVELOPER_USERS = "user1:pass1,user2:pass2"      -> role "developer" (bug triage)
 *   TESTER_USERS    = "user1:pass1,user2:pass2"      -> role "tester"    (bug reporting)
 *   JWT_SECRET                                        -> signs session tokens
 *
 * A password value may be plain text or a bcrypt hash (starts with "$2").
 */
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const ROLES = ['client', 'developer', 'tester'];
export const TOKEN_TTL = '8h';

export function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET is missing or too short (min 32 chars). Set it in backend/.env.');
  }
  return secret;
}

// Parse "user:pass,user2:pass2" (password may itself contain ':')
function parseUserList(value) {
  if (!value) return [];
  return value
    .split(',')
    .map(entry => entry.trim())
    .filter(Boolean)
    .map(entry => {
      const idx = entry.indexOf(':');
      if (idx <= 0) return null;
      return { username: entry.slice(0, idx).trim(), password: entry.slice(idx + 1).trim() };
    })
    .filter(u => u && u.username && u.password);
}

export function getAccounts(role) {
  if (role === 'client') {
    const username = process.env.CLIENT_ADMIN_USERNAME?.trim();
    const password = process.env.CLIENT_ADMIN_PASSWORD?.trim();
    return username && password ? [{ username, password }] : [];
  }
  if (role === 'developer') return parseUserList(process.env.DEVELOPER_USERS);
  if (role === 'tester') return parseUserList(process.env.TESTER_USERS);
  return [];
}

/** Startup check: returns a list of configuration problems (empty = OK). */
export function validateAuthConfig() {
  const problems = [];
  try { getJwtSecret(); } catch (e) { problems.push(e.message); }
  for (const role of ROLES) {
    if (getAccounts(role).length === 0) problems.push(`No ${role} accounts configured in .env`);
  }
  return problems;
}

function safeEqual(a, b) {
  const ha = crypto.createHash('sha256').update(String(a)).digest();
  const hb = crypto.createHash('sha256').update(String(b)).digest();
  // Hash first so both buffers are equal length; then compare in constant time
  return crypto.timingSafeEqual(ha, hb) && String(a).length === String(b).length;
}

async function passwordMatches(input, stored) {
  if (stored.startsWith('$2')) return bcrypt.compare(input, stored);
  return safeEqual(input, stored);
}

/** Returns the username on success, or null. */
export async function verifyCredentials(role, username, password) {
  if (!ROLES.includes(role) || typeof username !== 'string' || typeof password !== 'string') return null;
  const account = getAccounts(role).find(a => a.username === username.trim());
  if (!account) {
    // Burn comparable time so unknown usernames are not distinguishable by timing
    safeEqual(password, crypto.randomBytes(16).toString('hex'));
    return null;
  }
  return (await passwordMatches(password, account.password)) ? account.username : null;
}

export function signToken(username, role) {
  return jwt.sign({ sub: username, role }, getJwtSecret(), { expiresIn: TOKEN_TTL });
}

/** requireAuth: validates "Authorization: Bearer <jwt>" and sets req.user = { username, role } */
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }
  try {
    const decoded = jwt.verify(header.slice(7), getJwtSecret());
    if (!ROLES.includes(decoded.role) || !decoded.sub) throw new Error('bad claims');
    // Make sure the account still exists in .env (removed users lose access immediately)
    if (!getAccounts(decoded.role).some(a => a.username === decoded.sub)) throw new Error('account removed');
    req.user = { username: decoded.sub, role: decoded.role };
    return next();
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid or expired session. Please sign in again.' });
  }
}

/** requireRole('developer', ...) — must be used after requireAuth */
export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ success: false, message: 'Authentication required' });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'You do not have permission to access this resource' });
    }
    return next();
  };
}

/** Website CMS routes: client admin only */
export const requireAdmin = [requireAuth, requireRole('client')];
