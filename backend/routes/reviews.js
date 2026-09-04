import express from 'express';
import Review from '../models/Review.js';
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
router.get('/all', async (req, res) => {
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

// PUT /api/reviews/:id/approve - Approve review
router.put('/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    let updated = null;
    try {
      updated = await Review.findByIdAndUpdate(id, { approved: true }, { new: true });
    } catch (dbErr) {
      const idx = memoryReviews.findIndex(r => r._id === id);
      if (idx !== -1) {
        memoryReviews[idx].approved = true;
        updated = memoryReviews[idx];
      }
    }

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    return res.json({ success: true, message: 'Review approved successfully', review: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error approving review' });
  }
});

// DELETE /api/reviews/:id - Delete review
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    try {
      await Review.findByIdAndDelete(id);
    } catch (dbErr) {
      memoryReviews = memoryReviews.filter(r => r._id !== id);
    }
    return res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error deleting review' });
  }
});

export default router;

