// Single source of truth for the site's page structure.
// Every route is listed with its label (translation key) and parent page, which drives
// the page header breadcrumb, the browser tab title and the Site Map page.
import {
  Home, Info, Phone, Landmark,
  LayoutGrid, Wheat, Images, MapPin, MessageSquareQuote, FileText, Lock, ScrollText, Map as MapIcon, Package
} from 'lucide-react';
import { CATALOG, CATALOG_ENTRIES, productImage } from './productCatalog';

// The Products section: the four product areas from the product catalogue (navbar menu,
// /products overview, breadcrumbs and Site Map). Each keeps its sub-products in `children`.
export const PRODUCTS = CATALOG.map(node => ({ ...node, key: node.titleKey, image: productImage(node) }));

// path pattern -> { key: label translation key, parent: parent path, icon }
export const PAGES = {
  '/': { key: 'navHome', icon: Home },
  '/products': { key: 'navbar_products', parent: '/', icon: LayoutGrid },
  // every product, sub-product and model page from the catalogue, under its parent
  ...Object.fromEntries(CATALOG_ENTRIES.map(({ node, parent }) => [
    node.path, { key: node.titleKey, code: node.code, parent: parent ? parent.path : '/products', icon: node.icon }
  ])),
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
  { key: 'site_groupProducts', paths: ['/products', ...CATALOG_ENTRIES.map(e => e.node.path)] },
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
