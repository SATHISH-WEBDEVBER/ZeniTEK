// Load .env before any other module reads process.env
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import leadsRouter from './routes/leads.js';
import projectsRouter from './routes/projects.js';
import reviewsRouter from './routes/reviews.js';
import seedRouter from './routes/seed.js';
import productsRouter, { publicProductsRouter } from './routes/products.js';
import galleryRouter, { publicGalleryRouter } from './routes/gallery.js';
import sectionsRouter, { publicSectionsRouter } from './routes/sections.js';
import authRouter from './routes/auth.js';
import bugsRouter, { syncOverdueFlags } from './routes/bugs.js';
import { validateAuthConfig } from './middleware/auth.js';

import path from 'path';

// Refuse to start without a JWT secret and the role accounts (no insecure defaults)
const authProblems = validateAuthConfig();
if (authProblems.length) {
  console.error('❌ Authentication is not configured correctly in backend/.env:');
  authProblems.forEach(p => console.error(`   - ${p}`));
  console.error('   See backend/.env.example for the required variables.');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/zenitek';

// Middleware
// FRONTEND_URL: the site(s) allowed to call this API, comma-separated
// (e.g. "http://localhost:3000,https://www.zenitek.in"). Unset = allow any origin (development only).
const allowedOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map(url => url.trim().replace(/\/+$/, ''))
  .filter(Boolean);
app.use(cors({
  origin: allowedOrigins.length ? allowedOrigins : '*',
  credentials: true,
  exposedHeaders: ['Content-Disposition'] // lets the dashboard read the Excel report filename
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Bug screenshots: random, never-reused filenames -> safe to cache for a long time
app.use('/uploads/bugs', express.static(path.resolve(process.cwd(), 'uploads', 'bugs'), {
  maxAge: '30d',
  immutable: true,
  setHeaders: res => res.setHeader('X-Content-Type-Options', 'nosniff')
}));

// Static uploads directory
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads'), {
  setHeaders: res => res.setHeader('X-Content-Type-Options', 'nosniff')
}));

// ─── Existing Routes ────────────────────────────────────────────────────────
app.use('/api/leads', leadsRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/seed', seedRouter);

// ─── Authentication (client admin / developer / tester) ─────────────────────
app.use('/api/auth', authRouter);

// ─── Bug Tracker (tester + developer) ────────────────────────────────────────
app.use('/api/bugs', bugsRouter);

// ─── Admin CMS Routes (protected) ───────────────────────────────────────────
app.use('/api/products', productsRouter);
app.use('/api/gallery', galleryRouter);
app.use('/api/sections', sectionsRouter);

// ─── Public API Routes (no auth required) ────────────────────────────────────
app.use('/api/public/products', publicProductsRouter);
app.use('/api/public/gallery', publicGalleryRouter);
app.use('/api/public/sections', publicSectionsRouter);

// API Index Endpoint
app.get('/api', (req, res) => {
  return res.json({
    success: true,
    service: 'ZeniTEK Solar Thermal API Server',
    version: '2.0.0',
    endpoints: [
      { path: '/api/health', methods: ['GET'], description: 'Server and Database Health Status' },
      { path: '/api/auth/login', methods: ['POST'], description: 'Login (role: client | developer | tester)' },
      { path: '/api/bugs', methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], description: 'Bug Tracker (tester / developer)' },
      { path: '/api/bugs/reports/summary', methods: ['GET'], description: 'Bug report summary (developer)' },
      { path: '/api/bugs/reports/excel', methods: ['GET'], description: 'Bug report Excel download (developer)' },
      { path: '/api/products', methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], description: 'Products CMS (Admin)' },
      { path: '/api/gallery', methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], description: 'Gallery CMS (Admin)' },
      { path: '/api/public/products', methods: ['GET'], description: 'Public Products API (published only)' },
      { path: '/api/public/gallery', methods: ['GET'], description: 'Public Gallery API (published only)' },
      { path: '/api/projects', methods: ['GET', 'POST', 'PUT', 'DELETE'], description: 'Solar Thermal Installation Projects (Map)' },
      { path: '/api/reviews', methods: ['GET', 'POST', 'PUT', 'DELETE'], description: 'Client Testimonials & Case Reviews' },
      { path: '/api/leads', methods: ['GET', 'POST', 'DELETE'], description: 'Quote & Subsidy Enquiry Leads' },
      { path: '/api/seed', methods: ['GET', 'POST'], description: 'Database Seeding Endpoint' }
    ],
    mongoStatus: mongoose.connection.readyState === 1 ? 'Connected' : 'Standby / Fallback Mode'
  });
});

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  return res.json({
    status: 'OK',
    service: 'ZeniTEK Solar Thermal API',
    mongoStatus: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected/Standby',
    timestamp: new Date()
  });
});

// Catch-all for non-existent /api routes
app.use('/api/*', (req, res) => {
  return res.status(404).json({
    success: false,
    message: `API endpoint '${req.originalUrl}' not found.`
  });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('💥 Unhandled API Error:', err);
  // Multer errors
  if (err.name === 'MulterError') {
    return res.status(400).json({ success: false, message: `File upload error: ${err.message}` });
  }
  return res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// MongoDB Connection
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    if (process.env.MONGODB_URI) {
      console.log('✅ Connected to MongoDB Atlas (Cloud Database)');
    } else {
      console.log('ℹ️ No MONGODB_URI in .env — Connected to LOCAL MongoDB service on your PC (127.0.0.1:27017/zenitek)');
    }
    // Persist the bug "overdue" flag now and every hour
    const runOverdueJob = () => syncOverdueFlags()
      .then(r => { if (r.markedOverdue || r.cleared) console.log(`🐞 Overdue sync: ${r.markedOverdue} marked overdue, ${r.cleared} cleared`); })
      .catch(err => console.warn('⚠️ Overdue sync failed:', err.message));
    runOverdueJob();
    setInterval(runOverdueJob, 60 * 60 * 1000).unref();
  })
  .catch((err) => {
    console.warn('⚠️ MongoDB connection warning (app running in fallback mode):', err.message);
  });

const server = app.listen(PORT, () => {
  console.log(`🚀 ZeniTEK Backend Server running on port ${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`⚠️ Port ${PORT} is already in use by another process.`);
    process.exit(1);
  } else {
    console.error('💥 Server error:', err);
  }
});
