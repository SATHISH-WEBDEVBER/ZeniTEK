/**
 * Client Admin dashboard API (role "client")
 *   GET /api/admin/overview   counts for the dashboard cards + the 5 latest enquiries
 */
import express from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Section from '../models/Section.js';
import Gallery from '../models/Gallery.js';
import Lead from '../models/Lead.js';
import Review from '../models/Review.js';
import Bug from '../models/Bug.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();
const DAY_MS = 24 * 60 * 60 * 1000;

router.get('/overview', requireAdmin, async (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ success: false, message: 'Database is not connected. Please try again shortly.' });
  }
  try {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * DAY_MS);
    const openBug = { status: { $ne: 'completed' } };

    const [
      productsTotal, productsPublished,
      sectionsTotal, sectionsPublished,
      galleryTotal, galleryPublished,
      leadsTotal, leadsLast7Days, recentLeads,
      reviewsTotal, reviewsPending,
      bugsTotal, bugsOpen, bugsInProgress, bugsCompleted, bugsOverdue
    ] = await Promise.all([
      Product.countDocuments(), Product.countDocuments({ published: true }),
      Section.countDocuments(), Section.countDocuments({ published: true }),
      Gallery.countDocuments(), Gallery.countDocuments({ published: true }),
      Lead.countDocuments(), Lead.countDocuments({ submittedAt: { $gte: weekAgo } }),
      Lead.find().sort({ submittedAt: -1 }).limit(5).select('-__v').lean(),
      Review.countDocuments(), Review.countDocuments({ approved: { $ne: true } }),
      Bug.countDocuments(),
      Bug.countDocuments({ status: 'open' }),
      Bug.countDocuments({ status: 'in-progress' }),
      Bug.countDocuments({ status: 'completed' }),
      Bug.countDocuments({ ...openBug, deadline: { $lt: now } })
    ]);

    return res.json({
      success: true,
      data: {
        generatedAt: now,
        products: { total: productsTotal, published: productsPublished },
        sections: { total: sectionsTotal, published: sectionsPublished },
        gallery: { total: galleryTotal, published: galleryPublished },
        leads: { total: leadsTotal, last7Days: leadsLast7Days },
        reviews: { total: reviewsTotal, pending: reviewsPending, approved: reviewsTotal - reviewsPending },
        bugs: {
          total: bugsTotal,
          open: bugsOpen,
          inProgress: bugsInProgress,
          completed: bugsCompleted,
          notCompleted: bugsOpen + bugsInProgress,
          overdue: bugsOverdue
        },
        recentLeads
      }
    });
  } catch (err) {
    return next(err);
  }
});

export default router;
