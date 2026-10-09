import React, { useEffect, useRef, useState } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'hi', label: 'Hindi', native: 'हिंदी' },
  { code: 'ml', label: 'Malayalam', native: 'മലയാളം' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' }
];

// Language switcher.
//  variant="dropdown": compact globe button for the desktop navbar (closes on outside click / Esc)
//  variant="list":     full-width button grid for the mobile menu
export default function LanguageWidget({ variant = 'dropdown', onSelect }) {
  const { lang, setLang, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef(null);
  const current = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];

  useEffect(() => {
    if (!isOpen) return undefined;
    const onDown = (e) => { if (rootRef.current && !rootRef.current.contains(e.target)) setIsOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setIsOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [isOpen]);

  const choose = (code) => {
    setLang(code);
    setIsOpen(false);
    if (onSelect) onSelect(code);
  };

  if (variant === 'list') {
    return (
      <div className="space-y-2">
        <div className="text-xs font-bold text-[#123B92] uppercase tracking-wider flex items-center gap-1.5">
          <Globe className="w-4 h-4 text-[#002DC2]" /> {t('navbar_language')}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {LANGUAGES.map(l => (
            <button
              key={l.code}
              type="button"
              lang={l.code}
              onClick={() => choose(l.code)}
              aria-pressed={lang === l.code}
              className={`px-2 py-2 rounded-xl text-sm font-bold border transition-colors cursor-pointer ${lang === l.code ? 'bg-[#002DC2] text-white border-[#002DC2]' : 'bg-white text-[#123B92] border-[#123B92]/20 hover:border-[#002DC2]'}`}
            >
              {l.native}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setIsOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`${t('navbar_language')}: ${current.label}`}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#123B92]/20 text-[#123B92] hover:border-[#002DC2] hover:bg-[#F0F4FD] text-sm font-bold transition-colors cursor-pointer"
      >
        <Globe className="w-4 h-4 text-[#002DC2]" />
        <span lang={current.code}>{current.native}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <ul
          role="listbox"
          aria-label={t('navbar_language')}
          className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-[#123B92]/20 shadow-2xl p-2 z-[60] space-y-1"
        >
          {LANGUAGES.map(l => (
            <li key={l.code}>
              <button
                type="button"
                role="option"
                aria-selected={lang === l.code}
                onClick={() => choose(l.code)}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm flex items-center justify-between transition-colors cursor-pointer ${lang === l.code ? 'bg-[#F0F4FD] text-[#002DC2] font-bold' : 'text-[#123B92] hover:bg-[#F0F4FD]'}`}
              >
                <span className="flex items-baseline gap-2">
                  <span lang={l.code} className="font-semibold">{l.native}</span>
                  <span className="text-xs text-slate-500 font-normal">{l.label}</span>
                </span>
                {lang === l.code && <Check className="w-4 h-4 text-[#002DC2]" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
