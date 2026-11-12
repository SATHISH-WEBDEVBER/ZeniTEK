// The ZeniTEK product catalogue: every product, sub-product and model in one tree.
// It drives the navbar Products menu, the /products overview, each product's own page,
// breadcrumbs and the Site Map, so a product only has to be added here once.
//
// Text: keys from src/i18n (cat_ keys are in src/i18n/catalog.js).
// Model pages (6/12/50 sq.ft box dryers and the five tunnel models) are the existing
// /solar-dryer-models/:modelId pages; `modelId` links a node to its record in zenitekBrochureData.js.
import {
  Sun, Box, Warehouse, ThermometerSun, SatelliteDish, ShowerHead, Microscope, FlaskConical,
  Spline, ScanSearch, Compass, Axe
} from 'lucide-react';
import { PRODUCT_PHOTOS, PRODUCT_VIDEOS } from './productMedia';
import { officialDryerModels } from './zenitekBrochureData';

// Shown for a product that has no photo yet.
export const PLACEHOLDER_IMAGE = '/images/products/placeholder.svg';

// A product's main image is the first of its photos in productMedia.js. These product areas use
// a chosen photo instead (their own products' photos are shown on their pages).
const COVER_IMAGES = {
  'solar-dryer': '/images/gallery/photo-04.webp',
  'solar-thermal': '/images/products/solar-thermal/parabolic-trough/parabolic-trough-01.webp',
  'research-and-development': '/images/projects/project-24.webp',
  'pv-laboratory': '/images/products/research-and-development/pv-bending-test/pv-bending-test-02.webp',
};

export const isPlaceholder = (src) => !src || src === PLACEHOLDER_IMAGE;

// Node fields:
//   id, path, icon, titleKey, shortKey (one line), descKey (card paragraph)
//   code      : model code shown as the title (tunnel dryers), with titleKey as its type label
//   size      : short name of a box dryer model in menus ("6 sq.ft")
//   group     : 'box' | 'tunnel' - which row of the Solar Dryer Models list a dryer model is in
//   modelId   : record in zenitekBrochureData.js (dryer model pages)
//   bodyKey   : overview paragraph on the product's own page; points: three key facts
//   children  : sub-products
//   page      : 'catalog' = uses the shared product page (CatalogPage); otherwise an existing page
const box = (id, size, modelId, titleKey) => ({
  id, size, modelId, titleKey, shortKey: `${titleKey}Short`, group: 'box', icon: Box, path: `/solar-dryer-models/${modelId}`
});
const tunnel = (id, code, modelId, shortKey) => ({
  id, code, modelId, shortKey, titleKey: 'cat_tunnelModel', group: 'tunnel', icon: Warehouse, path: `/solar-dryer-models/${modelId}`
});

// Groups of dryer models, in the order they are listed (menus, Solar Dryer Models page)
export const DRYER_GROUPS = [
  { id: 'box', titleKey: 'cat_boxGroup' },
  { id: 'tunnel', titleKey: 'cat_tunnel' },
];

export const CATALOG = [
  {
    id: 'solar-dryer', path: '/solar-dryer-models', icon: Sun,
    titleKey: 'prod_dryersTitle', shortKey: 'prod_dryersShort', descKey: 'prod_dryersDesc',
    points: ['prod_dryersPoint1', 'prod_dryersPoint2', 'prod_dryersPoint3'],
    children: [
      box('dryer-6', '6 sq.ft', 'sundry-6', 'cat_dryer6'),
      box('dryer-12', '12 sq.ft', 'sundry-12', 'cat_dryer12'),
      box('dryer-50', '50 sq.ft', 'sundry-50', 'cat_dryer50'),
      tunnel('tunnel-d1210-150', 'D1210 – 150', 'soldry-1210-150', 'cat_d1210_150Short'),
      tunnel('tunnel-d1210-300', 'D1210 – 300', 'soldry-1210-300', 'cat_d1210_300Short'),
      tunnel('tunnel-h2008-250', 'H2008 – 250', 'soldry-2008-250', 'cat_h2008_250Short'),
      tunnel('tunnel-h2008-1000', 'H2008 – 1000', 'soldry-modular-1000', 'cat_h2008_1000Short'),
      tunnel('tunnel-p1709-200', 'P1709 – 200', 'soldry-1709-200', 'cat_p1709_200Short'),
    ]
  },
  {
    id: 'solar-thermal', path: '/solar-thermal-system', icon: ThermometerSun,
    titleKey: 'prod_thermalTitle', shortKey: 'prod_thermalShort', descKey: 'cat_thermalDesc',
    points: ['cat_thermalPoint1', 'cat_thermalPoint2', 'prod_thermalPoint3'],
    children: [
      {
        id: 'parabolic-trough', path: '/solar-thermal-system/parabolic-trough-collector', page: 'catalog', icon: Sun,
        titleKey: 'cat_ptc', shortKey: 'prod_thPtcUse', bodyKey: 'prod_thPtcBody',
        points: ['cat_ptcPoint1', 'cat_ptcPoint2', 'cat_ptcPoint3']
      },
      {
        id: 'scheffler-dish', path: '/solar-thermal-system/scheffler-dish', page: 'catalog', icon: SatelliteDish,
        titleKey: 'cat_scheffler', shortKey: 'prod_thSchUse', bodyKey: 'prod_thSchBody',
        points: ['cat_schPoint1', 'cat_schPoint2', 'cat_schPoint3']
      }
    ]
  },
  {
    id: 'solar-water-heater', path: '/solar-water-heater', page: 'catalog', icon: ShowerHead,
    titleKey: 'cat_swh', shortKey: 'cat_swhShort', descKey: 'cat_swhDesc', bodyKey: 'cat_swhBody',
    points: ['cat_swhPoint1', 'cat_swhPoint2', 'cat_swhPoint3']
  },
  {
    id: 'research-and-development', path: '/research-and-development', icon: Microscope,
    titleKey: 'prod_rndTitle', shortKey: 'prod_rndShort', descKey: 'prod_rndDesc',
    points: ['cat_rndPoint1', 'cat_rndPoint2', 'prod_rndPoint3'],
    children: [
      {
        id: 'pv-laboratory', path: '/research-and-development/pv-laboratory', page: 'catalog', icon: FlaskConical,
        titleKey: 'cat_pvLab', shortKey: 'cat_pvLabShort', bodyKey: 'cat_pvLabBody',
        points: ['cat_pvLabPoint1', 'cat_pvLabPoint2', 'cat_pvLabPoint3'],
        children: [
          {
            id: 'pv-bending-test', path: '/research-and-development/pv-laboratory/flexible-pv-bending-test-machine', page: 'catalog', icon: Spline,
            titleKey: 'cat_bend', shortKey: 'cat_bendShort', bodyKey: 'cat_bendBody',
            points: ['cat_bendPoint1', 'cat_bendPoint2', 'cat_bendPoint3']
          },
          {
            id: 'pv-visual-inspection', path: '/research-and-development/pv-laboratory/pv-visual-inspection-setup', page: 'catalog', icon: ScanSearch,
            titleKey: 'cat_visual', shortKey: 'cat_visualShort', bodyKey: 'cat_visualBody',
            points: ['cat_visualPoint1', 'cat_visualPoint2', 'cat_visualPoint3']
          },
          {
            id: 'shadow-dial', path: '/research-and-development/pv-laboratory/shadow-dial', page: 'catalog', icon: Compass,
            titleKey: 'cat_shadow', shortKey: 'cat_shadowShort', bodyKey: 'cat_shadowBody',
            points: ['cat_shadowPoint1', 'cat_shadowPoint2', 'cat_shadowPoint3']
          }
        ]
      },
      {
        id: 'log-splitter', path: '/research-and-development/wood-log-splitter', page: 'catalog', icon: Axe,
        titleKey: 'cat_logSplitter', shortKey: 'cat_logSplitterShort', bodyKey: 'cat_logSplitterBody',
        points: ['cat_logPoint1', 'cat_logPoint2', 'cat_logPoint3']
      }
    ]
  }
];

// ── Lookups ──────────────────────────────────────────────────────────────────

// Every node with its parent chain, depth-first
function walk(nodes, parent = null, out = []) {
  nodes.forEach(node => {
    out.push({ node, parent });
    if (node.children) walk(node.children, node, out);
  });
  return out;
}
export const CATALOG_ENTRIES = walk(CATALOG);

// All photos of a product (empty when there are none yet) and its videos
export const productPhotos = (node) => (node && PRODUCT_PHOTOS[node.id]) || [];
export const productVideos = (node) => (node ? PRODUCT_VIDEOS.filter(v => v.product === node.id) : []);

export const productImage = (node) =>
  (node && (COVER_IMAGES[node.id] || productPhotos(node)[0]?.src)) || PLACEHOLDER_IMAGE;

// The photos shown for a product in the Home dryer carousel and the Products page explorer: its best
// wide photos, by file number in productMedia.js (-01, -02 ...), the first one leading. The water
// heater's only photo is upright, so it uses its wide home-hero copy (heater on the right).
const SHOWCASE_PHOTOS = {
  'dryer-6': [1, 5, 4, 2],
  'dryer-12': [1, 3, 2],
  'dryer-50': [1, 5, 8, 7],
  'tunnel-d1210-150': [1, 6, 3, 7],
  'tunnel-d1210-300': [1, 5, 2, 3],
  'tunnel-h2008-250': [1, 2],
  'tunnel-h2008-1000': [1, 5, 4, 2],
  'tunnel-p1709-200': [1],
  'parabolic-trough': [12, 7, 9, 4],
  'scheffler-dish': [1, 2, 3, 5],
  'solar-water-heater': [{ src: '/images/home-hero/service-water-heater.webp', w: 1600, h: 800, position: '80% 50%' }],
  'pv-bending-test': [1, 2],
  'pv-visual-inspection': [1, 2],
  'shadow-dial': [2, 1],
  'log-splitter': [1, 2, 3],
};
export const showcasePhotos = (node) => {
  const all = productPhotos(node);
  const pick = node && SHOWCASE_PHOTOS[node.id];
  if (!pick) return all.slice(0, 4);
  return pick
    .map(p => (typeof p === 'object' ? { thumb: p.src, ...p } : all.find(ph => ph.src.endsWith(`-${String(p).padStart(2, '0')}.webp`))))
    .filter(Boolean);
};

// A dryer model's record in the brochure data (capacity, areas, power, subsidy ...)
export const dryerRecord = (node) => (node?.modelId ? officialDryerModels.find(m => m.id === node.modelId) || null : null);

// "2.5 kg to 12.5 kg per batch (…)" -> "2.5–12.5 kg"
export const shortCapacity = (text = '') => {
  const m = /([\d.,]+\+?)\s*kg\s*to\s*([\d.,]+\+?)\s*kg/i.exec(text);
  return m ? `${m[1]}–${m[2]} kg` : (text || '—');
};

// Smaller copy of the main image for menus and thumbnails
export const productThumb = (node) => {
  const src = productImage(node);
  return productPhotos(node).find(p => p.src === src)?.thumb || src;
};

export const findNodeByPath = (path) => CATALOG_ENTRIES.find(e => e.node.path === path) || null;

export const findNodeByModelId = (modelId) => CATALOG_ENTRIES.find(e => e.node.modelId === modelId) || null;

// Display name for a node: tunnel models show their code ("D1210 – 150 Tunnel Solar Dryer")
export const nodeTitle = (node, t) => (node.code ? `${node.code} ${t(node.titleKey)}` : t(node.titleKey));

// Short name for menus: the model code or size ("D1210 – 150", "6 sq.ft"), otherwise the full name
export const nodeShortTitle = (node, t) => node.code || node.size || t(node.titleKey);

// The dryer models of one group ('box' | 'tunnel')
export const dryerModels = (group) => CATALOG.find(n => n.id === 'solar-dryer').children.filter(c => c.group === group);

// Pages rendered by the shared CatalogPage (one route each)
export const CATALOG_PAGES = CATALOG_ENTRIES.filter(e => e.node.page === 'catalog').map(e => e.node.path);
