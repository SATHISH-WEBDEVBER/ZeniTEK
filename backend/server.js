import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import leadsRouter from './routes/leads.js';
import projectsRouter from './routes/projects.js';
import reviewsRouter from './routes/reviews.js';
import seedRouter from './routes/seed.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/zenitek';

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/leads', leadsRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/seed', seedRouter);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'ZeniTEK Solar Thermal API',
    mongoStatus: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected/Standby',
    timestamp: new Date()
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

app.listen(PORT, () => {
  console.log(`🚀 ZeniTEK Backend Server running on port ${PORT}`);
});
