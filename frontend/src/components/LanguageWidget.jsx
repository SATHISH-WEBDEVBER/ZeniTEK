import React, { useState } from 'react';
import { Globe, Check, ChevronUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function LanguageWidget() {
  const { lang, setLang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
    { code: 'hi', label: 'Hindi', native: 'हिंदी' },
    { code: 'ml', label: 'Malayalam', native: 'മലയാളം' },
    { code: 'te', label: 'Telugu', native: 'తెలుగు' },
    { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' }
  ];

  const currentLang = languages.find(l => l.code === lang) || languages[0];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Dropdown Popup */}
      {isOpen && (
        <div className="mb-2 w-56 bg-white rounded-2xl border-2 border-[#123B92] shadow-2xl p-2 animate-fade-in space-y-1">
          <div className="text-[11px] font-bold text-[#123B92] uppercase tracking-wider px-3 py-1.5 border-b border-[#123B92]/20 flex items-center justify-between">
            <span>Select Language</span>
            <Globe className="w-3.5 h-3.5 text-[#002DC2]" />
          </div>
          {languages.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                setLang(l.code);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between font-medium transition-colors cursor-pointer ${lang === l.code ? 'bg-[#F0F4FD] text-[#002DC2] font-bold' : 'text-black hover:bg-[#F0F4FD]'}`}
            >
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-black">{l.native}</span>
                <span className="text-[10px] text-black/60 font-normal">({l.label})</span>
              </div>
              {lang === l.code && <Check className="w-4 h-4 text-[#002DC2]" />}
            </button>
          ))}
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-[#123B92] hover:bg-[#002DC2] text-white px-4 py-2.5 rounded-full shadow-lg hover:shadow-xl border-2 border-[#00FB00] hover:scale-105 transition-all text-xs font-bold cursor-pointer"
      >
        <Globe className="w-4 h-4 text-[#00FB00] animate-spin-slow" />
        <span>{currentLang.native}</span>
        <ChevronUp className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
    </div>
  );
}
