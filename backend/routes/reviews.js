import express from 'express';
import Review from '../models/Review.js';

const router = express.Router();

// GET /api/reviews - Get approved testimonials
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find({ approved: true });
    res.json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching reviews' });
  }
});

// POST /api/reviews - Submit new review
router.post('/', async (req, res) => {
  try {
    const review = await Review.create(req.body);
    res.status(201).json({ success: true, message: 'Review submitted for approval', review });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;
