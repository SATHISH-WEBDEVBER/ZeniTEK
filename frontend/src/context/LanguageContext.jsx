import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { LANGS } from '../i18n/langs';
import { EN, dictionaryFor, loadLanguage } from '../i18n/load';

// The site text lives in src/i18n (one file per page area, every language in each file). The i18n
// build step turns it into one dictionary per language: English ships with the page, the others
// are fetched when chosen (src/i18n/load.js).
const LanguageContext = createContext();

const STORAGE_KEY = 'zenitek-lang';

// The visitor's saved choice; storage can be unavailable (private mode, blocked site data)
export const readSavedLang = () => {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return LANGS.includes(saved) ? saved : 'en';
  } catch {
    return 'en';
  }
};

// main.jsx calls this before the first render, so a returning Tamil (etc.) visitor sees their
// language straight away rather than English first. Falls back to English if it cannot load.
export const prepareSavedLanguage = async () => {
  const lang = readSavedLang();
  if (lang !== 'en') await loadLanguage(lang);
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLangState] = useState(() => {
    const saved = readSavedLang();
    return dictionaryFor(saved) ? saved : 'en';
  });

  // Switching language: fetch its dictionary first, then show it (the page keeps the current
  // language for the moment that takes, instead of flashing English)
  const setLang = useCallback(async (next) => {
    if (!LANGS.includes(next)) return;
    try { window.localStorage.setItem(STORAGE_KEY, next); } catch { /* not persisted */ }
    if (await loadLanguage(next)) setLangState(next);
  }, []);

  // Keeps <html lang> in sync so browsers, screen readers and fonts use the right language
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo(() => {
    const dict = dictionaryFor(lang) || EN;
    // t('key') or t('key', { count: 3 }) — values fill {count}-style placeholders.
    // Looks in the selected language, then English, then returns the key itself.
    const t = (key, vars) => {
      let text = dict[key] ?? EN[key] ?? key;
      if (vars) {
        Object.entries(vars).forEach(([name, val]) => {
          text = text.split(`{${name}}`).join(String(val));
        });
      }
      return text;
    };
    // Like t(), but returns `fallback` when no translation exists (e.g. admin-added content)
    const tf = (key, fallback, vars) => {
      const text = t(key, vars);
      return text === key ? fallback : text;
    };
    return { lang, setLang, t, tf };
  }, [lang, setLang]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
