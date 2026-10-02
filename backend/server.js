import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import leadsRouter from './routes/leads.js';
import projectsRouter from './routes/projects.js';
import reviewsRouter from './routes/reviews.js';
import seedRouter from './routes/seed.js';
import productsRouter, { publicProductsRouter } from './routes/products.js';
import galleryRouter, { publicGalleryRouter } from './routes/gallery.js';
import sectionsRouter, { publicSectionsRouter } from './routes/sections.js';
import adminRouter from './routes/admin.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/zenitek';

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Existing Routes ────────────────────────────────────────────────────────
app.use('/api/leads', leadsRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/seed', seedRouter);

// ─── Admin Auth Route ────────────────────────────────────────────────────────
app.use('/api/admin', adminRouter);

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
      { path: '/api/admin/login', methods: ['POST'], description: 'Admin Authentication' },
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
    console.log('✅ Connected to MongoDB database [zenitek]');
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
