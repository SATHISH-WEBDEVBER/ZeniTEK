// Single source of truth for the site's page structure.
// Every route is listed with its label (translation key) and parent page, which drives
// the page header breadcrumb, the browser tab title and the Site Map page.
import {
  Home, Info, Phone, Landmark, Sun, ThermometerSun, Microscope,
  LayoutGrid, Wheat, Images, MapPin, MessageSquareQuote, FileText, Lock, ScrollText, Map as MapIcon, Package
} from 'lucide-react';

// The Products section: exactly these three pages, in this order (navbar menu, /products overview,
// breadcrumbs and Site Map). `image` is a real photo of that product; without one, the `art`
// drawing from SolarThermalArt is shown instead.
export const PRODUCTS = [
  {
    path: '/solar-dryer-models', icon: Sun, image: '/real-photos/zenitek_photo_04.webp',
    key: 'prod_dryersTitle', shortKey: 'prod_dryersShort', descKey: 'prod_dryersDesc',
    points: ['prod_dryersPoint1', 'prod_dryersPoint2', 'prod_dryersPoint3']
  },
  {
    path: '/solar-thermal-system', icon: ThermometerSun, image: null, art: 'trough',
    key: 'prod_thermalTitle', shortKey: 'prod_thermalShort', descKey: 'prod_thermalDesc',
    points: ['prod_thermalPoint1', 'prod_thermalPoint2', 'prod_thermalPoint3']
  },
  {
    path: '/research-and-development', icon: Microscope, image: '/projects/project-24.webp',
    key: 'prod_rndTitle', shortKey: 'prod_rndShort', descKey: 'prod_rndDesc',
    points: ['prod_rndPoint1', 'prod_rndPoint2', 'prod_rndPoint3']
  }
];

// path pattern -> { key: label translation key, parent: parent path, icon }
export const PAGES = {
  '/': { key: 'navHome', icon: Home },
  '/products': { key: 'navbar_products', parent: '/', icon: LayoutGrid },
  ...Object.fromEntries(PRODUCTS.map(p => [p.path, { key: p.key, parent: '/products', icon: p.icon }])),
  '/solar-dryer-models/:modelId': { key: 'site_productsDryerModels', parent: '/solar-dryer-models', icon: Package },
  '/applications': { key: 'navApplications', parent: '/', icon: Wheat },
  '/subsidies': { key: 'navbar_subsidies', parent: '/', icon: Landmark },
  '/about': { key: 'navAbout', parent: '/', icon: Info },
  '/contact': { key: 'navContact', parent: '/', icon: Phone },
  '/quote': { key: 'getQuote', parent: '/', icon: MessageSquareQuote },
  '/gallery': { key: 'navGallery', parent: '/', icon: Images },
  '/gallery/:id': { key: 'navbar_images', parent: '/gallery', icon: Images },
  '/brochures/:brochureId': { key: 'navbar_brochure', parent: '/gallery', icon: FileText },
  '/installations': { key: 'site_installations', parent: '/', icon: MapPin },
  '/installations/:id': { key: 'site_installations', parent: '/installations', icon: MapPin },
  '/projects/:id': { key: 'site_installations', parent: '/installations', icon: MapPin },
  '/stories': { key: 'navStories', parent: '/', icon: MessageSquareQuote },
  '/privacy': { key: 'footerPrivacy', parent: '/', icon: Lock },
  '/terms': { key: 'footerTerms', parent: '/', icon: ScrollText },
  '/sitemap': { key: 'site_sitemap', parent: '/', icon: MapIcon }
};

// Groups shown on the Site Map page (static pages only; detail pages are reached from their lists)
export const SITEMAP_GROUPS = [
  { key: 'site_groupMain', paths: ['/', '/about', '/subsidies', '/applications', '/contact', '/quote'] },
  { key: 'site_groupProducts', paths: ['/products', ...PRODUCTS.map(p => p.path)] },
  { key: 'site_groupMedia', paths: ['/gallery', '/installations', '/stories'] },
  { key: 'site_groupSupport', paths: ['/sitemap', '/privacy', '/terms'] }
];

// Returns the PAGES pattern that matches a pathname, or null (404)
export function matchPage(pathname) {
  const clean = pathname.replace(/\/+$/, '') || '/';
  if (PAGES[clean]) return clean;
  const parts = clean.split('/');
  return Object.keys(PAGES).find(pattern => {
    const p = pattern.split('/');
    return p.length === parts.length && p.every((seg, i) => seg.startsWith(':') || seg === parts[i]);
  }) || null;
}
