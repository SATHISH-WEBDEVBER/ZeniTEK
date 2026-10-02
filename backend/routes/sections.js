/**
 * Sections API Routes
 * The 7 Products dropdown categories (Solar Dryer Models, Solar Thermal, etc.)
 *
 * ADMIN Routes (protected):
 *   GET    /api/sections                    - All sections (admin, includes drafts)
 *   GET    /api/sections/:slug              - Single section by slug (admin)
 *   POST   /api/sections                   - Create / seed section
 *   PUT    /api/sections/:slug             - Update section (content + optional thumbnail)
 *   POST   /api/sections/:slug/images      - Add image(s) to section body
 *   DELETE /api/sections/:slug/images/:id  - Remove a single body image
 *   PATCH  /api/sections/:slug/status      - Toggle published
 *   DELETE /api/sections/:slug             - Delete section + all Cloudinary images
 *
 * PUBLIC Routes:
 *   GET    /api/public/sections            - All published sections (for navbar)
 *   GET    /api/public/sections/:slug      - Single published section (for page content)
 */

import express from 'express';
import Section from '../models/Section.js';
import { requireAdmin } from '../middleware/auth.js';
import { uploadGalleryImage, deleteCloudinaryImage } from '../config/cloudinary.js';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const router = express.Router();
const publicRouter = express.Router();

// Cloudinary storage for section thumbnails and body images
const sectionStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'zenitek/sections',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1600, height: 1000, crop: 'limit', quality: 'auto:good' }]
  }
});

const uploadSectionImage = multer({
  storage: sectionStorage,
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'), false);
  }
});

// ─── ADMIN ROUTES ─────────────────────────────────────────────────────────────

// GET /api/sections - All sections (admin)
router.get('/', requireAdmin, async (req, res) => {
  try {
    const sections = await Section.find().sort({ displayOrder: 1 });
    return res.json({ success: true, count: sections.length, sections });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/sections/:slug - Single section (admin)
router.get('/:slug', requireAdmin, async (req, res) => {
  try {
    const section = await Section.findOne({ slug: req.params.slug });
    if (!section) return res.status(404).json({ success: false, message: 'Section not found' });
    return res.json({ success: true, section });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/sections - Create section (admin)
router.post(
  '/',
  requireAdmin,
  uploadSectionImage.single('thumbnail'),
  async (req, res) => {
    try {
      const {
        slug, title, subtitle, content, highlights, displayOrder, published
      } = req.body;

      if (!slug || !title) {
        if (req.file) await deleteCloudinaryImage(req.file.filename);
        return res.status(400).json({ success: false, message: 'slug and title are required' });
      }

      let parsedHighlights = [];
      try { parsedHighlights = highlights ? JSON.parse(highlights) : []; } catch { parsedHighlights = []; }

      const thumbnail = req.file
        ? { url: req.file.path, publicId: req.file.filename, alt: title }
        : { url: '', publicId: '', alt: '' };

      const section = await Section.create({
        slug,
        title,
        subtitle: subtitle || '',
        thumbnail,
        content: content || '',
        highlights: parsedHighlights,
        displayOrder: Number(displayOrder) || 0,
        published: published === 'true' || published === true
      });

      return res.status(201).json({ success: true, message: 'Section created successfully', section });
    } catch (err) {
      if (req.file) await deleteCloudinaryImage(req.file.filename);
      if (err.code === 11000) {
        return res.status(409).json({ success: false, message: 'A section with this slug already exists' });
      }
      return res.status(500).json({ success: false, message: err.message });
    }
  }
);

// PUT /api/sections/:slug - Update section (admin)
router.put(
  '/:slug',
  requireAdmin,
  uploadSectionImage.single('thumbnail'),
  async (req, res) => {
    try {
      const section = await Section.findOne({ slug: req.params.slug });
      if (!section) {
        if (req.file) await deleteCloudinaryImage(req.file.filename);
        return res.status(404).json({ success: false, message: 'Section not found' });
      }

      const {
        title, subtitle, content, highlights, displayOrder, published
      } = req.body;

      // Replace thumbnail if a new one was uploaded
      if (req.file) {
        if (section.thumbnail?.publicId) {
          await deleteCloudinaryImage(section.thumbnail.publicId);
        }
        section.thumbnail = {
          url: req.file.path,
          publicId: req.file.filename,
          alt: title || section.title
        };
      }

      let parsedHighlights = section.highlights;
      try { if (highlights !== undefined) parsedHighlights = JSON.parse(highlights); } catch {}

      if (title !== undefined) section.title = title;
      if (subtitle !== undefined) section.subtitle = subtitle;
      if (content !== undefined) section.content = content;
      if (highlights !== undefined) section.highlights = parsedHighlights;
      if (displayOrder !== undefined) section.displayOrder = Number(displayOrder);
      if (published !== undefined) section.published = published === 'true' || published === true;

      await section.save();
      return res.json({ success: true, message: 'Section updated successfully', section });
    } catch (err) {
      if (req.file) await deleteCloudinaryImage(req.file.filename);
      return res.status(500).json({ success: false, message: err.message });
    }
  }
);

// POST /api/sections/:slug/images - Add body images (admin)
router.post(
  '/:slug/images',
  requireAdmin,
  uploadSectionImage.array('images', 20),
  async (req, res) => {
    try {
      const section = await Section.findOne({ slug: req.params.slug });
      if (!section) {
        for (const f of req.files || []) await deleteCloudinaryImage(f.filename);
        return res.status(404).json({ success: false, message: 'Section not found' });
      }

      const newImages = (req.files || []).map(file => ({
        url: file.path,
        publicId: file.filename,
        alt: section.title,
        caption: ''
      }));

      section.images.push(...newImages);
      await section.save();

      return res.json({ success: true, message: `${newImages.length} image(s) added`, section });
    } catch (err) {
      for (const f of req.files || []) await deleteCloudinaryImage(f.filename);
      return res.status(500).json({ success: false, message: err.message });
    }
  }
);

// DELETE /api/sections/:slug/images/:imageId - Remove a body image (admin)
router.delete('/:slug/images/:imageId', requireAdmin, async (req, res) => {
  try {
    const section = await Section.findOne({ slug: req.params.slug });
    if (!section) return res.status(404).json({ success: false, message: 'Section not found' });

    const imgIdx = section.images.findIndex(i => i._id.toString() === req.params.imageId);
    if (imgIdx === -1) return res.status(404).json({ success: false, message: 'Image not found' });

    const [removed] = section.images.splice(imgIdx, 1);
    await deleteCloudinaryImage(removed.publicId);
    await section.save();

    return res.json({ success: true, message: 'Image removed', section });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/sections/:slug/status - Toggle published
router.patch('/:slug/status', requireAdmin, async (req, res) => {
  try {
    const { published } = req.body;
    if (published === undefined) {
      return res.status(400).json({ success: false, message: 'published field is required' });
    }
    const section = await Section.findOneAndUpdate(
      { slug: req.params.slug },
      { published: Boolean(published) },
      { new: true }
    );
    if (!section) return res.status(404).json({ success: false, message: 'Section not found' });
    return res.json({
      success: true,
      message: `Section ${section.published ? 'published' : 'unpublished'} successfully`,
      section
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/sections/:slug - Delete section + all Cloudinary images
router.delete('/:slug', requireAdmin, async (req, res) => {
  try {
    const section = await Section.findOne({ slug: req.params.slug });
    if (!section) return res.status(404).json({ success: false, message: 'Section not found' });

    if (section.thumbnail?.publicId) await deleteCloudinaryImage(section.thumbnail.publicId);
    for (const img of section.images) await deleteCloudinaryImage(img.publicId);

    await Section.findOneAndDelete({ slug: req.params.slug });
    return res.json({ success: true, message: 'Section deleted successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// ─── PUBLIC ROUTES ─────────────────────────────────────────────────────────────

// GET /api/public/sections - All published sections (for navbar dropdown)
publicRouter.get('/', async (req, res) => {
  try {
    const sections = await Section.find({ published: true })
      .sort({ displayOrder: 1 })
      .select('slug title subtitle thumbnail displayOrder');
    return res.json({ success: true, count: sections.length, sections });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/public/sections/:slug - Single published section (for page content)
publicRouter.get('/:slug', async (req, res) => {
  try {
    const section = await Section.findOne({ slug: req.params.slug, published: true });
    if (!section) return res.status(404).json({ success: false, message: 'Section not found or not published' });
    return res.json({ success: true, section });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

export { publicRouter as publicSectionsRouter };
export default router;
