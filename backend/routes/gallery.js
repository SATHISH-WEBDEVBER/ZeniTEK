/**
 * Gallery API Routes
 *
 * ADMIN Routes (protected):
 *   GET    /api/gallery               - All gallery items (admin)
 *   GET    /api/gallery/:id           - Single item
 *   POST   /api/gallery               - Create item with image upload
 *   PUT    /api/gallery/:id           - Update item (with optional new image)
 *   DELETE /api/gallery/:id           - Delete item + Cloudinary image
 *   PATCH  /api/gallery/:id/status    - Toggle published status
 *
 * PUBLIC Routes:
 *   GET    /api/public/gallery        - All published gallery items
 */

import express from 'express';
import { body, validationResult } from 'express-validator';
import Gallery from '../models/Gallery.js';
import { requireAdmin } from '../middleware/auth.js';
import { uploadGalleryImage, deleteCloudinaryImage } from '../config/cloudinary.js';

const router = express.Router();
const publicRouter = express.Router();

const galleryValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('category')
    .notEmpty()
    .isIn(['box_dryers', 'tunnel_external', 'tunnel_internal', 'trays_produce', 'engineering', 'Other'])
    .withMessage('Invalid category')
];

function handleValidation(req) {
  const errors = validationResult(req);
  return errors.isEmpty() ? null : errors.array();
}

// ─── ADMIN ROUTES ─────────────────────────────────────────────────────────────

// GET /api/gallery - All gallery items (admin)
router.get('/', requireAdmin, async (req, res) => {
  try {
    const { category, published } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (published !== undefined) filter.published = published === 'true';

    const items = await Gallery.find(filter).sort({ displayOrder: 1, createdAt: -1 });
    return res.json({ success: true, count: items.length, items });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/gallery/:id - Single gallery item (admin)
router.get('/:id', requireAdmin, async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Gallery item not found' });
    return res.json({ success: true, item });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/gallery - Create gallery item with image upload
router.post(
  '/',
  requireAdmin,
  uploadGalleryImage.single('image'),
  galleryValidation,
  async (req, res) => {
    const errs = handleValidation(req);
    if (errs) return res.status(400).json({ success: false, message: errs.map(e => e.msg).join('; '), errors: errs });

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Gallery image is required' });
    }

    try {
      const {
        title, description, category,
        location, state, productModel, capacity,
        lat, lng, displayOrder, published
      } = req.body;

      const item = await Gallery.create({
        title,
        description: description || '',
        category,
        image: {
          url: req.file.path,          // Cloudinary secure_url
          publicId: req.file.filename, // Cloudinary public_id
          alt: title
        },
        location: location || '',
        state: state || '',
        productModel: productModel || '',
        capacity: capacity || '',
        lat: lat ? Number(lat) : undefined,
        lng: lng ? Number(lng) : undefined,
        displayOrder: Number(displayOrder) || 0,
        published: published === 'true' || published === true
      });

      return res.status(201).json({ success: true, message: 'Gallery item created successfully', item });
    } catch (err) {
      await deleteCloudinaryImage(req.file?.filename);
      return res.status(500).json({ success: false, message: err.message });
    }
  }
);

// PUT /api/gallery/:id - Update gallery item
router.put(
  '/:id',
  requireAdmin,
  uploadGalleryImage.single('image'),
  async (req, res) => {
    try {
      const existing = await Gallery.findById(req.params.id);
      if (!existing) {
        if (req.file) await deleteCloudinaryImage(req.file.filename);
        return res.status(404).json({ success: false, message: 'Gallery item not found' });
      }

      const {
        title, description, category,
        location, state, productModel, capacity,
        lat, lng, displayOrder, published
      } = req.body;

      // Replace image if a new one was uploaded
      if (req.file) {
        await deleteCloudinaryImage(existing.image.publicId);
        existing.image = {
          url: req.file.path,
          publicId: req.file.filename,
          alt: title || existing.title
        };
      } else if (title) {
        existing.image.alt = title;
      }

      if (title !== undefined) existing.title = title;
      if (description !== undefined) existing.description = description;
      if (category !== undefined) existing.category = category;
      if (location !== undefined) existing.location = location;
      if (state !== undefined) existing.state = state;
      if (productModel !== undefined) existing.productModel = productModel;
      if (capacity !== undefined) existing.capacity = capacity;
      if (lat !== undefined) existing.lat = Number(lat);
      if (lng !== undefined) existing.lng = Number(lng);
      if (displayOrder !== undefined) existing.displayOrder = Number(displayOrder);
      if (published !== undefined) existing.published = published === 'true' || published === true;

      await existing.save();
      return res.json({ success: true, message: 'Gallery item updated successfully', item: existing });
    } catch (err) {
      if (req.file) await deleteCloudinaryImage(req.file.filename);
      return res.status(500).json({ success: false, message: err.message });
    }
  }
);

// PATCH /api/gallery/:id/status - Toggle published/unpublished
router.patch('/:id/status', requireAdmin, async (req, res) => {
  try {
    const { published } = req.body;
    if (published === undefined) {
      return res.status(400).json({ success: false, message: 'published field is required' });
    }
    const item = await Gallery.findByIdAndUpdate(
      req.params.id,
      { published: Boolean(published) },
      { new: true }
    );
    if (!item) return res.status(404).json({ success: false, message: 'Gallery item not found' });
    return res.json({
      success: true,
      message: `Gallery item ${item.published ? 'published' : 'unpublished'} successfully`,
      item
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/gallery/:id - Delete gallery item + Cloudinary image
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Gallery item not found' });

    await deleteCloudinaryImage(item.image.publicId);
    await Gallery.findByIdAndDelete(req.params.id);

    return res.json({ success: true, message: 'Gallery item deleted successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// ─── PUBLIC ROUTES ─────────────────────────────────────────────────────────────

// GET /api/public/gallery - All published gallery items
publicRouter.get('/', async (req, res) => {
  try {
    const { category, limit } = req.query;
    const filter = { published: true };
    if (category) filter.category = category;

    let query = Gallery.find(filter).sort({ displayOrder: 1, createdAt: -1 });
    if (limit) query = query.limit(Number(limit));

    const items = await query;
    return res.json({ success: true, count: items.length, items });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

export { publicRouter as publicGalleryRouter };
export default router;
