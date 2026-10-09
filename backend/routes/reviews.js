import express from 'express';
import mongoose from 'mongoose';
import Review from '../models/Review.js';
import { requireAdmin } from '../middleware/auth.js';
import { initialReviews } from './seed.js';

const router = express.Router();

let memoryReviews = [...initialReviews.map((r, idx) => ({ ...r, _id: `rev_${idx + 1}` }))];

// GET /api/reviews - Get approved testimonials
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find({ approved: true });
    if (reviews.length > 0) {
      return res.json({ success: true, count: reviews.length, reviews });
    }
    const approvedMem = memoryReviews.filter(r => r.approved);
    return res.json({ success: true, count: approvedMem.length, reviews: approvedMem, source: 'initial' });
  } catch (error) {
    const approvedMem = memoryReviews.filter(r => r.approved);
    return res.json({ success: true, count: approvedMem.length, reviews: approvedMem, fallback: true });
  }
});

// GET /api/reviews/all - Admin route for all reviews
router.get('/all', requireAdmin, async (req, res) => {
  try {
    const reviews = await Review.find();
    if (reviews.length > 0) {
      return res.json({ success: true, count: reviews.length, reviews });
    }
    return res.json({ success: true, count: memoryReviews.length, reviews: memoryReviews, source: 'initial' });
  } catch (error) {
    return res.json({ success: true, count: memoryReviews.length, reviews: memoryReviews, fallback: true });
  }
});

// GET /api/reviews/:id - Single review
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let review = null;
    try {
      review = await Review.findById(id);
    } catch (dbErr) {
      review = memoryReviews.find(r => r._id === id);
    }

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    return res.json({ success: true, review });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error fetching review' });
  }
});

// POST /api/reviews - Submit new review
router.post('/', async (req, res) => {
  try {
    const { name, role, location, rating = 5, comment, videoUrl } = req.body;

    if (!name || !location || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields (name, location, comment)'
      });
    }

    let review = null;
    try {
      review = await Review.create({ name, role, location, rating: Number(rating), comment, videoUrl, approved: false });
    } catch (dbErr) {
      review = {
        _id: 'rev_' + Date.now(),
        name,
        role: role || 'Client',
        location,
        rating: Number(rating),
        comment,
        videoUrl: videoUrl || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        approved: false
      };
      memoryReviews.unshift(review);
    }

    return res.status(201).json({
      success: true,
      message: 'Review submitted for approval! Thank you for sharing your prosperity story.',
      review
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Error submitting review' });
  }
});

const isMemId = id => typeof id === 'string' && id.startsWith('rev_');

// PUT /api/reviews/:id/approve - Approve review (body { approved: false } hides it again)
router.put('/:id/approve', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const approved = req.body?.approved === undefined ? true : req.body.approved;
    if (typeof approved !== 'boolean') {
      return res.status(400).json({ success: false, message: 'approved must be true or false' });
    }
    let updated = null;
    if (isMemId(id)) {
      const idx = memoryReviews.findIndex(r => r._id === id);
      if (idx !== -1) {
        memoryReviews[idx].approved = approved;
        updated = memoryReviews[idx];
      }
    } else if (mongoose.isValidObjectId(id)) {
      updated = await Review.findByIdAndUpdate(id, { approved }, { new: true });
    }

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    return res.json({ success: true, message: approved ? 'Review approved successfully' : 'Review hidden from the website', review: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error approving review' });
  }
});

// DELETE /api/reviews/:id - Delete review
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    let deleted = null;
    if (isMemId(id)) {
      deleted = memoryReviews.find(r => r._id === id) || null;
      memoryReviews = memoryReviews.filter(r => r._id !== id);
    } else if (mongoose.isValidObjectId(id)) {
      deleted = await Review.findByIdAndDelete(id);
    }
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    return res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error deleting review' });
  }
});

export default router;

