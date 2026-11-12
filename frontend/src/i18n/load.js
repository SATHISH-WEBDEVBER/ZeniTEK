// Translation dictionaries, one per language, built from the files in src/i18n by the i18n build
// step in vite.config.js. English is part of the main bundle (it is the fallback for every key);
// the other languages are separate files fetched only when a visitor uses them.
import en from 'virtual:i18n/en';

const LOADERS = {
  ta: () => import('virtual:i18n/ta'),
  hi: () => import('virtual:i18n/hi'),
  ml: () => import('virtual:i18n/ml'),
  te: () => import('virtual:i18n/te'),
  kn: () => import('virtual:i18n/kn'),
};

const loaded = { en };

export const EN = en;

// The dictionary of a language if it is already here (English always is)
export const dictionaryFor = (lang) => loaded[lang] || null;

// Fetches a language's dictionary (once); resolves to null if it cannot be loaded (e.g. offline)
export async function loadLanguage(lang) {
  if (loaded[lang]) return loaded[lang];
  if (!LOADERS[lang]) return null;
  try {
    loaded[lang] = (await LOADERS[lang]()).default;
    return loaded[lang];
  } catch {
    return null;
  }
}
