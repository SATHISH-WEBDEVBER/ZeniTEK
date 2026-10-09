// Collects every page's translation file into one dictionary per language.
import about from './about';
import dryers from './dryers';
import gallery from './gallery';
import sections from './sections';
import common from './common';
import navbar from './navbar';
import site from './site';

const modules = [about, dryers, gallery, sections, common, navbar, site];

export const LANGS = ['en', 'ta', 'hi', 'ml', 'te', 'kn'];

const pageTranslations = LANGS.reduce((acc, lang) => {
  acc[lang] = Object.assign({}, ...modules.map(m => m[lang] || {}));
  return acc;
}, {});

export default pageTranslations;
