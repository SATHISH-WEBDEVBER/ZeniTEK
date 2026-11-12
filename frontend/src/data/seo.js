// Search and link-preview text for each page (English; search engines index the English site).
// SiteHeader puts it into <meta name="description">, the canonical link and the sharing tags.
import { findNodeByPath, dryerRecord, findNodeByModelId } from './productCatalog';
import { EN } from '../i18n/load';

export const SITE_URL = 'https://www.zenitek.in';
export const DEFAULT_DESCRIPTION = 'ZeniTEK designs and builds solar dryers, solar thermal systems, solar water heaters and research equipment in Erode, Tamil Nadu. MNRE enlisted and ISO 9001:2015 certified.';

const DESCRIPTIONS = {
  '/': DEFAULT_DESCRIPTION,
  '/about': 'About ZeniTEK, a solar thermal engineering company from Erode, Tamil Nadu, building solar dryers, solar thermal systems and research equipment for farmers, industry and universities.',
  '/products': 'Every ZeniTEK product: box and tunnel solar dryers, parabolic trough collectors, Scheffler dishes, solar water heaters, PV laboratory equipment and a wood log splitter.',
  '/solar-dryer-models': 'ZeniTEK solar dryer models: 6, 12 and 50 sq.ft box dryers and walk-in tunnel dryers from 150 to 1,000 sq.ft, with specifications, photos and brochures.',
  '/solar-thermal-system': 'Parabolic trough collectors and Scheffler dishes by ZeniTEK for hot water, steam and process heat in industries, villages and universities.',
  '/research-and-development': 'ZeniTEK research and development: PV laboratory test setups, a wood log splitter for Sikkim tribal communities and custom equipment built with universities.',
  '/installations': 'Map of ZeniTEK solar dryer and solar thermal installations, with photos and details of each site.',
  '/stories': 'What farmers and food businesses say about drying with ZeniTEK solar dryers.',
  '/applications': 'What you can dry in a ZeniTEK solar dryer: spices, fruits, vegetables, herbs, flowers, fish, copra and more.',
  '/gallery': 'Photos and videos of ZeniTEK solar dryers, solar thermal systems and installations.',
  '/subsidies': 'Government subsidy for ZeniTEK solar tunnel dryers at A.E.D. rates: 50% for SC/ST, small, marginal and women farmers (up to ₹4,40,000), 40% for other farmers (up to ₹3,52,000).',
  '/contact': 'Contact ZeniTEK in Erode and Komarapalayam, Tamil Nadu. Phone +91 89038 52623, WhatsApp +91 80986 13422, email zenitek2k@gmail.com.',
  '/quote': 'Ask for a free quote for a ZeniTEK solar dryer or solar thermal system: tell us your crop, the capacity you need and your location.',
  '/sitemap': 'All pages of the ZeniTEK website.',
  '/privacy': 'How ZeniTEK uses the details you send through the website.',
  '/terms': 'Terms of use of the ZeniTEK website and our equipment guarantee.',
};

const plain = (text) => String(text || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

export function pageDescription(pathname) {
  if (DESCRIPTIONS[pathname]) return DESCRIPTIONS[pathname];
  // dryer model pages: the model's own description
  const model = /^\/solar-dryer-models\/([^/]+)$/.exec(pathname);
  if (model) {
    const entry = findNodeByModelId(model[1]);
    const record = entry && dryerRecord(entry.node);
    if (record?.description) return plain(record.description);
  }
  // product pages from the catalogue: their overview text
  const node = findNodeByPath(pathname)?.node;
  const key = node && (node.descKey || node.bodyKey || node.shortKey);
  if (key && EN[key]) return plain(EN[key]);
  return DEFAULT_DESCRIPTION;
}
