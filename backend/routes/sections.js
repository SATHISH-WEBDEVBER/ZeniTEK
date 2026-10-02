/**
 * Sections API Routes
 * The 7 Products dropdown categories (Solar Dryer Models, Solar Thermal, etc.)
 *
 * ADMIN Routes (protected):
 *   GET    /api/sections                    - All sections (admin, includes drafts)
 *   GET    /api/sections/:slug              - Single section by slug (admin)
 *   POST   /api/sections                    - Create section
 *   PUT    /api/sections/:slug              - Update section (content + optional thumbnail)
 *   POST   /api/sections/:slug/images       - Add image(s) to section body
 *   DELETE /api/sections/:slug/images/:id   - Remove a single body image
 *   PATCH  /api/sections/:slug/status       - Toggle published
 *   DELETE /api/sections/:slug              - Delete section
 *   POST   /api/sections/seed               - Seed / reset default 7 sections
 *
 * PUBLIC Routes:
 *   GET    /api/public/sections             - All published sections (for navbar)
 *   GET    /api/public/sections/:slug       - Single published section (for page content)
 */

import express from 'express';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import Section from '../models/Section.js';
import { requireAdmin } from '../middleware/auth.js';
import { deleteCloudinaryImage } from '../config/cloudinary.js';

const router = express.Router();
const publicRouter = express.Router();

// Ensure local uploads directory exists as fallback
const uploadDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Check if Cloudinary is configured with actual credentials
const isCloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET &&
  !process.env.CLOUDINARY_CLOUD_NAME.includes('your_cloud_name')
);

let sectionStorage;
if (isCloudinaryConfigured) {
  sectionStorage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'zenitek/sections',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [{ width: 1600, height: 1000, crop: 'limit', quality: 'auto:good' }]
    }
  });
} else {
  sectionStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const uniqueName = `section-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      cb(null, uniqueName);
    }
  });
}

const uploadSectionImage = multer({
  storage: sectionStorage,
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'), false);
  }
});

// Helper to extract uploaded file URL
function getFileUrl(req, file) {
  if (!file) return null;
  if (file.path && file.path.startsWith('http')) {
    return { url: file.path, publicId: file.filename || file.public_id || '' };
  }
  // Local fallback
  const filename = file.filename;
  return { url: `/uploads/${filename}`, publicId: filename };
}

// ─── DEFAULT 7 SECTIONS DATA ─────────────────────────────────────────────────
export const defaultSections = [
  {
    slug: 'solar-dryer-models',
    title: 'Solar Dryer Models',
    subtitle: 'Commercial Walk-In Tunnels, Industrial Multi-Unit Plants & Micro Box Dryers',
    thumbnail: {
      url: '/real-photos/zenitek_photo_18.jpeg',
      publicId: '',
      alt: 'Solar Dryer Models'
    },
    displayOrder: 1,
    published: true,
    highlights: [
      'MNRE Enlisted & Subsidy Eligible (40% - 60% Govt Assistance)',
      '100% Zero-Electricity Solar Thermal Operation Mode',
      'Stainless Steel SS304 Food-Grade Trays & Anti-Contamination Design',
      'Automated Microcontroller Humidity & Exhaust Temperature Management',
      'Available in capacities from 12 kg pilot units up to 1000 kg+ commercial plants'
    ],
    content: `ZeniTEK manufactures high-efficiency solar thermal collectors and commercial polyhouse dryers, delivering sustainable clean energy solutions to eliminate post-harvest crop loss for farmers, FPOs, and food processing industries across India.

Our solar dryers utilize proprietary greenhouse polyhouse engineering with multi-layer UV-stabilized polycarbonate glazing. By creating a controlled internal micro-climate, incoming solar energy is absorbed and converted into dry thermal airflow that accelerates moisture removal while shielding valuable produce from dust, insects, bird droppings, mold, and unexpected monsoon rainfall.

Whether you need a compact portable stainless-steel box dryer for micro-scale processing or an expansive walk-in polyhouse tunnel plant for tons of copra, spices, grains, or herbal leaves, ZeniTEK offers standard and customized capacities backed by certified testing reports.`
  },
  {
    slug: 'solar-thermal-system',
    title: 'Solar Thermal System',
    subtitle: 'High-Efficiency Thermal Collectors with Patented Aerodynamic Air Circulation',
    thumbnail: {
      url: '/real-photos/zenitek_photo_23.jpeg',
      publicId: '',
      alt: 'Solar Thermal System'
    },
    displayOrder: 2,
    published: true,
    highlights: [
      'Advanced Selective Solar Absorber Surfaces (>85% Thermal Conversion)',
      'Patented Aerodynamic Forced Convection Ducts for Uniform Batch Heating',
      'Boosts Internal Drying Chamber Temperature up to 65°C Without Fossil Fuels',
      'Secondary Auxiliary Thermal Mass Storage for Extended Evening Drying Runs',
      'Precision Multi-Zone Blower Automation with Digital Calibrated Sensors'
    ],
    content: `ZeniTEK's Solar Thermal Systems represent the vanguard of sustainable agricultural thermodynamic engineering. Unlike conventional electric kilns or polluting biomass furnaces, our solar thermal collectors capture both direct and diffuse solar irradiance to generate high-volume, low-humidity air currents.

The system incorporates specialized multi-layer aerodynamic manifolds that evenly distribute heated air across every tray level, eliminating cold spots and guaranteeing identical residual moisture levels from top to bottom.

Integrated automated dampers vent humid saturated air precisely when threshold humidity points are detected, retaining maximum thermal energy within the chamber and shortening drying cycles by up to 50% compared to traditional sun-drying.`
  },
  {
    slug: 'agri-solar-innovation',
    title: 'Agri-Solar Innovation',
    subtitle: 'Pioneering Decentralized Solar Drying Solutions for Farmers and FPOs',
    thumbnail: {
      url: '/real-photos/zenitek_photo_21.jpeg',
      publicId: '',
      alt: 'Agri-Solar Innovation'
    },
    displayOrder: 3,
    published: true,
    highlights: [
      'Multi-Crop Versatility (Turmeric, Copra, Chillies, Moringa, Banana & Herbs)',
      'Drastically Reduces Moisture from 85% to <8% Within 18-36 Operating Hours',
      'Locks in Original Natural Color, Curcumin, Essential Oils, and Aroma',
      'Zero UV Degradation: Food-grade Polycarbonate Blocks Harmful UV Spectra',
      'Delivers 25% to 45% Higher Selling Price at Mandi & Export Markets'
    ],
    content: `Agri-Solar Innovation at ZeniTEK is built on the philosophy that clean renewable energy should directly empower grassroots agricultural economies. In traditional open-yard drying, farmers routinely lose 20% to 35% of their yield to sudden showers, dust contamination, microbial infections, and rodent exposure.

By transitioning to ZeniTEK's closed-loop Agri-Solar Drying technology, farmers produce premium export-ready commodities. For instance, turmeric dried inside our polyhouse retains deep natural orange curcumin levels (>4.5%), while coconut copra produces 100% Grade-1 sulfur-free white copra prized by premium oil mills.

Our engineering team works closely with agricultural research universities and Farmer Producer Organizations (FPOs) to tailor drying curves for regional cash crops.`
  },
  {
    slug: 'photovoltaic-solutions',
    title: 'Photovoltaic Solutions',
    subtitle: 'Hybrid Solar PV & DC Micro-Grid Systems for 24/7 Uninterrupted Operation',
    thumbnail: {
      url: '/real-photos/zenitek_photo_26.jpeg',
      publicId: '',
      alt: 'Photovoltaic Solutions'
    },
    displayOrder: 4,
    published: true,
    highlights: [
      'High-Efficiency Tier-1 Monocrystalline Solar Photovoltaic Modules',
      'Ultra-Efficient Brushless DC (BLDC) Smart Forced-Air Exhaust Blowers',
      'Safe, Long-Life Lithium Ferro Phosphate (LFP) Battery Energy Storage Options',
      'Dual Hybrid Input: Solar PV Primary with Auto-Grid Failover for Rainy Periods',
      'Integrated IoT Smart Controller for Mobile Telemetry and Remote Alerts'
    ],
    content: `ZeniTEK Photovoltaic Solutions make every solar dryer completely self-sufficient, eliminating dependence on unreliable rural electricity grids. Each solar polyhouse can be outfitted with a matched solar PV array that powers the internal air circulation fans, variable-speed exhaust blowers, and digital PLC controllers.

Equipped with high-torque, low-noise BLDC motors, our exhaust systems operate on direct DC current generated from the roof panels. During peak daytime sun, excess PV power can be stored in compact Lithium Ferro Phosphate (LiFePO4) storage banks to sustain continuous nighttime air circulation.

This hybrid integration guarantees unbroken dehumidification even through cloud covers and monsoon spells.`
  },
  {
    slug: 'government-subsidies',
    title: 'Government Subsidies',
    subtitle: '40% to 60% Capital Subsidy Assistance Under Central & State Agri Schemes',
    thumbnail: {
      url: '/real-photos/zenitek_photo_07.jpeg',
      publicId: '',
      alt: 'Government Subsidies'
    },
    displayOrder: 5,
    published: true,
    highlights: [
      'Mission for Integrated Development of Horticulture (MIDH / SHM): 40% - 50% Subsidy',
      'Ministry of New & Renewable Energy (MNRE): Enlisted Approved Manufacturer',
      'Agriculture Infrastructure Fund (AIF): 3% Interest Subvention on Term Loans',
      'PM Formalisation of Micro Food Processing Enterprises (PM-FME): Up to ₹10 Lakhs Grant',
      'End-to-End Liaison Support: From DPR Preparation to Department Bank Credit'
    ],
    content: `To accelerate clean energy adoption across the agricultural landscape, the Government of India and State Horticulture Departments offer generous capital subsidies covering 40% to 60% of the total installation cost for solar polyhouse dryers.

Because ZeniTEK is an officially enlisted manufacturer compliant with all MNRE and State Agricultural Engineering department standards, our clients enjoy seamless qualification for these subsidy benefits.

Our dedicated liaison desk assists you through every milestone:
1. Detailed Project Report (DPR) preparation with certified engineering layouts.
2. Official quotation and GST invoices formatted to government portal requirements.
3. Online portal registration and documentation filing.
4. Coordination with local Horticulture and Agricultural Engineering officers during mandatory pre- and post-installation inspections.
5. Direct DBT credit of subsidy funds to the beneficiary farmer or FPO bank account.`
  },
  {
    slug: 'crop-preservation-guide',
    title: 'Crop Preservation Guide',
    subtitle: 'Optimal Temperature, Moisture Targets & Drying Protocols for 50+ Agricultural Commodities',
    thumbnail: {
      url: '/real-photos/zenitek_photo_03.jpeg',
      publicId: '',
      alt: 'Crop Preservation Guide'
    },
    displayOrder: 6,
    published: true,
    highlights: [
      'Precise Drying Parameters for Spices: Turmeric (60°C), Pepper (55°C), Cardamom (50°C)',
      'Horticultural Protocols for Fruits: Banana (58°C), Mango (62°C), Amla (55°C)',
      'Herbal & Medicinal Plants: Moringa Leaves (48°C), Stevia (45°C), Tulsi (42°C)',
      'Target Moisture Levels: From 80%+ Fresh Down to Safe 7-10% Storage Thresholds',
      'FSSAI & Global Export Quality Compliance Guidelines Included'
    ],
    content: `Different agricultural commodities possess distinct cellular structures, essential oil vaporization thresholds, and color pigments. Dehydrating high-value produce without scientific temperature control often results in scorched exterior surfaces, loss of volatile flavors, or persistent moisture pockets that invite Aspergillus fungus.

The ZeniTEK Crop Preservation Guide provides validated temperature benchmarks and recommended tray loading densities:

- **Spices & Roots:** Turmeric must be gently dried below 60°C to preserve curcumin. Ginger requires 55°C to preserve gingerol flavor profiles.
- **Leafy Botanicals:** Moringa and herbal leaves are dehydrated at 45°C-48°C away from direct UV exposure, preserving 100% of their vibrant green chlorophyll and vitamin matrix.
- **Horticultural Produce:** Tomato flakes, banana figs, and mango slices are dried to 12% moisture with a soft, pliable texture without chemical preservatives or sulfur dioxide.

Consult this guide to optimize batch turnaround times and maximize product grade.`
  },
  {
    slug: 'technical-spec-sheets',
    title: 'Technical Spec Sheets',
    subtitle: 'Engineering CAD Blueprints, Electrical Ratings & Material Certifications',
    thumbnail: {
      url: '/real-photos/zenitek_photo_12.jpeg',
      publicId: '',
      alt: 'Technical Spec Sheets'
    },
    displayOrder: 7,
    published: true,
    highlights: [
      'High-Grade Hot-Dip Galvanized Iron (GI) Structural Framework (150 GSM Coating)',
      'UV-Protected Multi-Wall Polycarbonate Glazing with 10-Year Warranty',
      'Food-Contact Grade SS304 Wire Mesh Trays with Heavy-Duty Structural Bracing',
      'Wind Load Resistance up to 130 km/h (Cyclone & Storm Resilient)',
      'Comprehensive Electrical & Mechanical Schematic CAD Drawings Available for Download'
    ],
    content: `ZeniTEK polyhouse and box solar dryers are manufactured according to rigorous industrial standards, combining robust civil structural mechanics with aerodynamic thermodynamic design.

**Structural Specifications:**
- Framework: Heavy-gauge tubular Hot-Dip Galvanized Iron with corrosion-resistant polyurethane primer.
- Glazing: Multi-wall UV300 stabilized polycarbonate sheets with high light transmittance (>82%) and anti-condensate internal coating.
- Air Circulation: Dynamically balanced axial DC blowers rated IP55 for moisture and dust protection.
- Trays & Trolleys: 100% food-grade Stainless Steel 304 mesh with smooth rounded edges for simple washdown and zero metal transfer.

**Civil & Foundation Requirements:**
Standard installations require a level concrete or brick masonry plinth. Modular bolt-together assemblies allow rapid on-site commissioning within 3 to 7 working days.`
  }
];

// Auto-seed helper
async function ensureDefaultSections() {
  try {
    const count = await Section.countDocuments();
    if (count === 0) {
      console.log('🌱 Seeding initial 7 Sections in database...');
      await Section.insertMany(defaultSections);
      console.log('✅ Successfully seeded 7 default sections.');
    }
  } catch (err) {
    console.warn('Auto-seed check note:', err.message);
  }
}

// ─── ADMIN ROUTES ─────────────────────────────────────────────────────────────

// GET /api/sections - All sections (admin)
router.get('/', requireAdmin, async (req, res) => {
  try {
    await ensureDefaultSections();
    const sections = await Section.find().sort({ displayOrder: 1, createdAt: 1 });
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

// POST /api/sections/seed - Seed / reset default 7 sections (admin)
router.post('/seed', requireAdmin, async (req, res) => {
  try {
    for (const def of defaultSections) {
      const exists = await Section.findOne({ slug: def.slug });
      if (!exists) {
        await Section.create(def);
      }
    }
    const sections = await Section.find().sort({ displayOrder: 1 });
    return res.json({ success: true, message: '7 default sections verified/seeded', count: sections.length, sections });
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
        slug, title, subtitle, content, highlights, displayOrder, published, thumbnailUrl
      } = req.body;

      if (!slug || !title) {
        return res.status(400).json({ success: false, message: 'slug and title are required' });
      }

      let parsedHighlights = [];
      try {
        if (typeof highlights === 'string') parsedHighlights = JSON.parse(highlights);
        else if (Array.isArray(highlights)) parsedHighlights = highlights;
      } catch {
        parsedHighlights = [];
      }

      let thumbnail = { url: '', publicId: '', alt: title };
      if (req.file) {
        const fileInfo = getFileUrl(req, req.file);
        thumbnail = { url: fileInfo.url, publicId: fileInfo.publicId, alt: title };
      } else if (thumbnailUrl) {
        thumbnail = { url: thumbnailUrl, publicId: '', alt: title };
      }

      const section = await Section.create({
        slug: slug.toLowerCase().trim(),
        title: title.trim(),
        subtitle: subtitle ? subtitle.trim() : '',
        thumbnail,
        content: content || '',
        highlights: parsedHighlights,
        displayOrder: Number(displayOrder) || 0,
        published: published === 'true' || published === true
      });

      return res.status(201).json({ success: true, message: 'Section created successfully', section });
    } catch (err) {
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
        return res.status(404).json({ success: false, message: 'Section not found' });
      }

      const {
        title, subtitle, content, highlights, displayOrder, published, thumbnailUrl
      } = req.body;

      // Handle new thumbnail if uploaded
      if (req.file) {
        if (section.thumbnail?.publicId && isCloudinaryConfigured) {
          await deleteCloudinaryImage(section.thumbnail.publicId).catch(() => {});
        }
        const fileInfo = getFileUrl(req, req.file);
        section.thumbnail = {
          url: fileInfo.url,
          publicId: fileInfo.publicId,
          alt: title || section.title
        };
      } else if (thumbnailUrl !== undefined && thumbnailUrl !== '') {
        section.thumbnail = {
          url: thumbnailUrl,
          publicId: '',
          alt: title || section.title
        };
      }

      if (highlights !== undefined) {
        try {
          if (typeof highlights === 'string') section.highlights = JSON.parse(highlights);
          else if (Array.isArray(highlights)) section.highlights = highlights;
        } catch {
          // ignore parse error
        }
      }

      if (title !== undefined) section.title = title.trim();
      if (subtitle !== undefined) section.subtitle = subtitle.trim();
      if (content !== undefined) section.content = content;
      if (displayOrder !== undefined) section.displayOrder = Number(displayOrder);
      if (published !== undefined) section.published = published === 'true' || published === true;

      await section.save();
      return res.json({ success: true, message: 'Section updated successfully', section });
    } catch (err) {
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
        return res.status(404).json({ success: false, message: 'Section not found' });
      }

      const newImages = (req.files || []).map(file => {
        const fileInfo = getFileUrl(req, file);
        return {
          url: fileInfo.url,
          publicId: fileInfo.publicId,
          alt: section.title,
          caption: ''
        };
      });

      // Also support additional imageUrls passed in body
      if (req.body.imageUrl) {
        const urls = Array.isArray(req.body.imageUrl) ? req.body.imageUrl : [req.body.imageUrl];
        urls.forEach(u => {
          if (u) newImages.push({ url: u, publicId: '', alt: section.title, caption: '' });
        });
      }

      section.images.push(...newImages);
      await section.save();

      return res.json({ success: true, message: `${newImages.length} image(s) added`, section });
    } catch (err) {
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
    if (removed?.publicId && isCloudinaryConfigured) {
      await deleteCloudinaryImage(removed.publicId).catch(() => {});
    }
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

// DELETE /api/sections/:slug - Delete section
router.delete('/:slug', requireAdmin, async (req, res) => {
  try {
    const section = await Section.findOne({ slug: req.params.slug });
    if (!section) return res.status(404).json({ success: false, message: 'Section not found' });

    if (section.thumbnail?.publicId && isCloudinaryConfigured) {
      await deleteCloudinaryImage(section.thumbnail.publicId).catch(() => {});
    }
    for (const img of section.images) {
      if (img.publicId && isCloudinaryConfigured) {
        await deleteCloudinaryImage(img.publicId).catch(() => {});
      }
    }

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
    await ensureDefaultSections();
    const sections = await Section.find({ published: true })
      .sort({ displayOrder: 1, createdAt: 1 })
      .select('slug title subtitle thumbnail displayOrder');
    return res.json({ success: true, count: sections.length, sections });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/public/sections/:slug - Single published section (for page content)
publicRouter.get('/:slug', async (req, res) => {
  try {
    await ensureDefaultSections();
    const section = await Section.findOne({ slug: req.params.slug, published: true });
    if (!section) {
      return res.status(404).json({ success: false, message: 'Section not found or not published' });
    }
    return res.json({ success: true, section });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

export { publicRouter as publicSectionsRouter };
export default router;
