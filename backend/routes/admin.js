/**
 * Admin Authentication Route
 * POST /api/admin/login  - Validate API key and return JWT
 */
import express from 'express';
import jwt from 'jsonwebtoken';
import { ADMIN_API_KEY, JWT_SECRET } from '../middleware/auth.js';

const router = express.Router();

// POST /api/admin/login
router.post('/login', (req, res) => {
  const { apiKey } = req.body;
  if (!apiKey) {
    return res.status(400).json({ success: false, message: 'apiKey is required' });
  }

  if (apiKey !== ADMIN_API_KEY) {
    return res.status(401).json({ success: false, message: 'Invalid admin API key' });
  }

  const token = jwt.sign(
    { role: 'admin', iat: Date.now() },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  return res.json({
    success: true,
    message: 'Admin authenticated successfully',
    token,
    expiresIn: '24h'
  });
});

export default router;
