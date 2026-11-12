// The site's translation files, in merge order: when two page files define the same key, the later
// one wins; base.js (site-wide text) wins over all of them.
//
// The browser never loads this file. The i18n build step in vite.config.js reads these files and
// serves one dictionary per language ("virtual:i18n/<lang>"), so a visitor downloads only English
// (the fallback) and the language they chose - see src/i18n/load.js.
export const MODULE_FILES = [
  'about', 'dryers', 'gallery', 'sections', 'common', 'navbar', 'site', 'products', 'subsidies', 'hero', 'catalog', 'media',
  'base',
];

export { LANGS } from './langs.js';
