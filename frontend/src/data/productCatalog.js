// The ZeniTEK product catalogue: every product, sub-product and model in one tree.
// It drives the navbar Products menu, the /products overview, each product's own page,
// breadcrumbs and the Site Map, so a product only has to be added here once.
//
// Text: keys from src/i18n (cat_ keys are in src/i18n/catalog.js).
// Model pages (6/12/50 sq.ft box dryers and the tunnel models) are the existing
// /solar-dryer-models/:modelId pages; `modelId` links a node to its record in zenitekBrochureData.js.
import {
  Sun, Box, Warehouse, ThermometerSun, SatelliteDish, ShowerHead, Microscope, FlaskConical,
  Spline, ScanSearch, Compass, Axe
} from 'lucide-react';

// Temporary image used until a product's real photo is added.
export const PLACEHOLDER_IMAGE = '/products/placeholder.svg';

// ONE IMAGE PER PRODUCT. To show a real photo, put the file in /public/products and replace
// PLACEHOLDER_IMAGE on that product's line, e.g. 'dryer-6': '/products/dryer-6.webp'.
export const PRODUCT_IMAGES = {
  // Solar Dryer
  'solar-dryer': '/real-photos/zenitek_photo_04.webp',
  'dryer-6': PLACEHOLDER_IMAGE,
  'dryer-12': PLACEHOLDER_IMAGE,
  'dryer-50': PLACEHOLDER_IMAGE,
  'tunnel-dryers': PLACEHOLDER_IMAGE,
  'tunnel-d1210-150': PLACEHOLDER_IMAGE,
  'tunnel-d1210-300': PLACEHOLDER_IMAGE,
  'tunnel-h2008-250': PLACEHOLDER_IMAGE,
  'tunnel-h2008-1000': PLACEHOLDER_IMAGE,
  'tunnel-p1709-200': PLACEHOLDER_IMAGE,
  // Solar Thermal
  'solar-thermal': PLACEHOLDER_IMAGE,
  'parabolic-trough': PLACEHOLDER_IMAGE,
  'scheffler-dish': PLACEHOLDER_IMAGE,
  // Solar Water Heater
  'solar-water-heater': PLACEHOLDER_IMAGE,
  // Research & Development
  'research-and-development': '/projects/project-24.webp',
  'pv-laboratory': PLACEHOLDER_IMAGE,
  'pv-bending-test': PLACEHOLDER_IMAGE,
  'pv-visual-inspection': PLACEHOLDER_IMAGE,
  'shadow-dial': PLACEHOLDER_IMAGE,
  'log-splitter': PLACEHOLDER_IMAGE,
};

export const isPlaceholder = (src) => !src || src === PLACEHOLDER_IMAGE;

// Node fields:
//   id, path, icon, titleKey, shortKey (one line), descKey (card paragraph)
//   code      : model code shown as the title (tunnel dryers), with titleKey as its type label
//   modelId   : record in zenitekBrochureData.js (dryer model pages)
//   bodyKey   : overview paragraph on the product's own page; points: three key facts
//   children  : sub-products
//   page      : 'catalog' = uses the shared product page (CatalogPage); otherwise an existing page
const tunnel = (id, code, modelId, shortKey) => ({
  id, code, modelId, shortKey, titleKey: 'cat_tunnelModel', icon: Warehouse, path: `/solar-dryer-models/${modelId}`
});

export const CATALOG = [
  {
    id: 'solar-dryer', path: '/solar-dryer-models', icon: Sun,
    titleKey: 'prod_dryersTitle', shortKey: 'prod_dryersShort', descKey: 'prod_dryersDesc',
    points: ['prod_dryersPoint1', 'prod_dryersPoint2', 'prod_dryersPoint3'],
    children: [
      { id: 'dryer-6', path: '/solar-dryer-models/sundry-6', modelId: 'sundry-6', icon: Box, titleKey: 'cat_dryer6', shortKey: 'cat_dryer6Short' },
      { id: 'dryer-12', path: '/solar-dryer-models/sundry-12', modelId: 'sundry-12', icon: Box, titleKey: 'cat_dryer12', shortKey: 'cat_dryer12Short' },
      { id: 'dryer-50', path: '/solar-dryer-models/sundry-50', modelId: 'sundry-50', icon: Box, titleKey: 'cat_dryer50', shortKey: 'cat_dryer50Short' },
      {
        id: 'tunnel-dryers', path: '/solar-dryer-models/tunnel-dryers', page: 'catalog', icon: Warehouse,
        titleKey: 'cat_tunnel', shortKey: 'cat_tunnelShort', bodyKey: 'cat_tunnelBody',
        points: ['cat_tunnelPoint1', 'cat_tunnelPoint2', 'cat_tunnelPoint3'],
        children: [
          tunnel('tunnel-d1210-150', 'D1210 – 150', 'soldry-1210-150', 'cat_d1210_150Short'),
          tunnel('tunnel-d1210-300', 'D1210 – 300', 'soldry-1210-300', 'cat_d1210_300Short'),
          tunnel('tunnel-h2008-250', 'H2008 – 250', 'soldry-2008-250', 'cat_h2008_250Short'),
          tunnel('tunnel-h2008-1000', 'H2008 – 1000', 'soldry-modular-1000', 'cat_h2008_1000Short'),
          tunnel('tunnel-p1709-200', 'P1709 – 200', 'soldry-1709-200', 'cat_p1709_200Short'),
        ]
      }
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

export const productImage = (node) => (node && PRODUCT_IMAGES[node.id]) || PLACEHOLDER_IMAGE;

export const findNodeByPath = (path) => CATALOG_ENTRIES.find(e => e.node.path === path) || null;

export const findNodeByModelId = (modelId) => CATALOG_ENTRIES.find(e => e.node.modelId === modelId) || null;

// Display name for a node: tunnel models show their code ("D1210 – 150 Tunnel Solar Dryer")
export const nodeTitle = (node, t) => (node.code ? `${node.code} ${t(node.titleKey)}` : t(node.titleKey));

// Pages rendered by the shared CatalogPage (one route each)
export const CATALOG_PAGES = CATALOG_ENTRIES.filter(e => e.node.page === 'catalog').map(e => e.node.path);
