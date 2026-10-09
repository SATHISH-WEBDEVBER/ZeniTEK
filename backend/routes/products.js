/**
 * Products API Routes
 * Admin routes: Protected by requireAdmin middleware
 * Public routes: /api/public/products (published only)
 *
 * ADMIN Routes:
 *   GET    /api/products              - List all products (admin)
 *   GET    /api/products/:id          - Get single product by ID (admin)
 *   POST   /api/products              - Create product (with image upload)
 *   PUT    /api/products/:id          - Update product (with optional new images)
 *   DELETE /api/products/:id          - Delete product + Cloudinary images
 *   PATCH  /api/products/:id/status   - Toggle published status
 *   DELETE /api/products/:id/images/:imageId - Remove a single image
 *
 * PUBLIC Routes (mounted at /api/public/products in server.js):
 *   GET    /                          - All published products
 *   GET    /:slug                     - Single published product by slug
 */

import express from 'express';
import { body, param, validationResult } from 'express-validator';
import Product from '../models/Product.js';
import { requireAdmin } from '../middleware/auth.js';
import { uploadProductImages, deleteCloudinaryImage } from '../config/cloudinary.js';

const router = express.Router();
const publicRouter = express.Router();

// ─── Validation helpers ─────────────────────────────────────────────────────
const productValidation = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('category')
    .notEmpty()
    .isIn(['Tunnel Type', 'Box Type', 'Solar Thermal', 'Accessories', 'Other'])
    .withMessage('Invalid category'),
  body('slug')
    .optional()
    .trim()
    .matches(/^[a-z0-9-]+$/)
    .withMessage('Slug must contain only lowercase letters, numbers, and hyphens')
];

function handleValidation(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errors.array();
  }
  return null;
}

// ─── ADMIN ROUTES ────────────────────────────────────────────────────────────

// GET /api/products - List all products (admin - includes unpublished)
router.get('/', requireAdmin, async (req, res) => {
  try {
    const { category, published } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (published !== undefined) filter.published = published === 'true';

    const products = await Product.find(filter).sort({ displayOrder: 1, createdAt: -1 });
    return res.json({ success: true, count: products.length, products });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message || 'Error fetching products' });
  }
});

// GET /api/products/:id - Single product by ID (admin)
router.get('/:id', requireAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    return res.json({ success: true, product });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/products - Create product (with optional image uploads)
router.post(
  '/',
  requireAdmin,
  uploadProductImages.array('images', 10),
  productValidation,
  async (req, res) => {
    const errs = handleValidation(req, res);
    if (errs) return res.status(400).json({ success: false, message: errs.map(e => e.msg).join('; '), errors: errs });

    try {
      const {
        name, slug, category, shortDescription, description,
        features, specifications, displayOrder, published
      } = req.body;

      // Parse JSON fields sent as strings from FormData
      let parsedFeatures = [];
      let parsedSpecs = [];
      try { parsedFeatures = features ? JSON.parse(features) : []; } catch { parsedFeatures = []; }
      try { parsedSpecs = specifications ? JSON.parse(specifications) : []; } catch { parsedSpecs = []; }

      // Build image array from Cloudinary uploads
      const images = (req.files || []).map((file, idx) => ({
        url: file.path,          // Cloudinary secure_url
        publicId: file.filename, // Cloudinary public_id
        alt: name,
        isPrimary: idx === 0
      }));

      const product = await Product.create({
        name, slug, category, shortDescription, description,
        features: parsedFeatures,
        specifications: parsedSpecs,
        images,
        displayOrder: Number(displayOrder) || 0,
        published: published === 'true' || published === true
      });

      return res.status(201).json({ success: true, message: 'Product created successfully', product });
    } catch (err) {
      // Cleanup uploaded images on DB failure
      for (const file of req.files || []) {
        await deleteCloudinaryImage(file.filename);
      }
      if (err.code === 11000) {
        return res.status(409).json({ success: false, message: 'A product with this slug already exists' });
      }
      return res.status(500).json({ success: false, message: err.message });
    }
  }
);

// PUT /api/products/:id - Update product (admin)
router.put(
  '/:id',
  requireAdmin,
  uploadProductImages.array('images', 10),
  async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        // Cleanup any uploaded files
        for (const file of req.files || []) await deleteCloudinaryImage(file.filename);
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      const {
        name, slug, category, shortDescription, description,
        features, specifications, displayOrder, published,
        keepImageIds  // JSON array of existing image IDs to keep
      } = req.body;

      // Parse JSON fields
      let parsedFeatures = product.features;
      let parsedSpecs = product.specifications;
      let keepIds = null;
      try { if (features) parsedFeatures = JSON.parse(features); } catch {}
      try { if (specifications) parsedSpecs = JSON.parse(specifications); } catch {}
      try { if (keepImageIds) keepIds = JSON.parse(keepImageIds); } catch {}

      // Determine which existing images to remove
      if (keepIds !== null) {
        const toRemove = product.images.filter(img => !keepIds.includes(img._id.toString()));
        for (const img of toRemove) {
          await deleteCloudinaryImage(img.publicId);
        }
        product.images = product.images.filter(img => keepIds.includes(img._id.toString()));
      }

      // Add newly uploaded images
      const newImages = (req.files || []).map((file, idx) => ({
        url: file.path,
        publicId: file.filename,
        alt: name || product.name,
        isPrimary: product.images.length === 0 && idx === 0
      }));
      product.images.push(...newImages);

      // Ensure at least one isPrimary
      if (product.images.length > 0 && !product.images.some(i => i.isPrimary)) {
        product.images[0].isPrimary = true;
      }

      // Update fields
      if (name !== undefined) product.name = name;
      if (slug !== undefined) product.slug = slug;
      if (category !== undefined) product.category = category;
      if (shortDescription !== undefined) product.shortDescription = shortDescription;
      if (description !== undefined) product.description = description;
      if (features !== undefined) product.features = parsedFeatures;
      if (specifications !== undefined) product.specifications = parsedSpecs;
      if (displayOrder !== undefined) product.displayOrder = Number(displayOrder);
      if (published !== undefined) product.published = published === 'true' || published === true;

      await product.save();
      return res.json({ success: true, message: 'Product updated successfully', product });
    } catch (err) {
      for (const file of req.files || []) await deleteCloudinaryImage(file.filename);
      return res.status(500).json({ success: false, message: err.message });
    }
  }
);

// PATCH /api/products/:id/status - Toggle published/unpublished
router.patch('/:id/status', requireAdmin, async (req, res) => {
  try {
    const { published } = req.body;
    if (published === undefined) {
      return res.status(400).json({ success: false, message: 'published field is required' });
    }
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { published: Boolean(published) },
      { new: true }
    );
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    return res.json({
      success: true,
      message: `Product ${product.published ? 'published' : 'unpublished'} successfully`,
      product
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/products/:id/images/:imageId - Remove a single image from product
router.delete('/:id/images/:imageId', requireAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const imgIdx = product.images.findIndex(i => i._id.toString() === req.params.imageId);
    if (imgIdx === -1) return res.status(404).json({ success: false, message: 'Image not found' });

    const [removed] = product.images.splice(imgIdx, 1);
    await deleteCloudinaryImage(removed.publicId);

    // Re-assign primary if needed
    if (product.images.length > 0 && !product.images.some(i => i.isPrimary)) {
      product.images[0].isPrimary = true;
    }

    await product.save();
    return res.json({ success: true, message: 'Image removed successfully', product });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/products/:id - Delete product and all its Cloudinary images
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    // Delete all Cloudinary images
    for (const img of product.images) {
      await deleteCloudinaryImage(img.publicId);
    }

    await Product.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// ─── PUBLIC ROUTES ────────────────────────────────────────────────────────────

// GET /api/public/products - All published products
publicRouter.get('/', async (req, res) => {
  try {
    const { category, limit } = req.query;
    const filter = { published: true };
    if (category) filter.category = category;

    let query = Product.find(filter).sort({ displayOrder: 1, createdAt: -1 });
    if (limit) query = query.limit(Number(limit));

    const products = await query;
    return res.json({ success: true, count: products.length, products });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/public/products/:slug - Single published product by slug
publicRouter.get('/:slug', async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, published: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    return res.json({ success: true, product });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

export { publicRouter as publicProductsRouter };
export default router;
