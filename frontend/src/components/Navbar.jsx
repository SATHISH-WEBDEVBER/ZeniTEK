import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Menu, X, PhoneCall, ShieldCheck, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar({ onOpenQuoteModal }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm w-full max-w-full overflow-x-hidden">
      
      {/* 1. MAIN NAVBAR (TOP HEADER): LOGO, INFO & GET FREE QUOTE CTA */}
      <div className="border-b border-slate-200 py-2.5 bg-white w-full">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo (Compact on mobile to prevent overflow) */}
          <Link to="/" className="flex items-center space-x-2 shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-700 to-green-700 p-0.5 shadow-sm">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <Sun className="w-5 h-5 sm:w-6 sm:h-6 text-blue-700" />
              </div>
            </div>
            <div>
              <div className="flex items-center">
                <span className="text-lg sm:text-xl font-extrabold tracking-tight text-blue-950">
                  ZeniTEK
                </span>
                <span className="ml-1 text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-green-800 bg-green-50 px-1 py-0.5 rounded border border-green-200">
                  Solar
                </span>
              </div>
              <p className="hidden sm:block text-[10px] font-medium text-slate-500 tracking-wider uppercase">Solar Thermal Solutions</p>
            </div>
          </Link>

          {/* Center Info (Desktop Only) */}
          <div className="hidden md:flex items-center space-x-6 text-xs text-slate-600 font-medium">
            <span className="flex items-center text-blue-900 font-semibold">
              <ShieldCheck className="w-4 h-4 mr-1 text-green-600" /> MNRE & ISO Certified
            </span>
            <a href="tel:+919442589000" className="flex items-center text-slate-800 hover:text-blue-700 font-bold transition-colors">
              <PhoneCall className="w-3.5 h-3.5 mr-1 text-blue-700" /> +91 94425 89000
            </a>
          </div>

          {/* Right Action & Mobile Toggle (Strict flex shrink-0 so hamburger NEVER overflows) */}
          <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
            
            {/* Quote CTA Button */}
            <button
              onClick={onOpenQuoteModal}
              className="px-2.5 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-blue-700 via-blue-600 to-green-700 rounded-lg sm:rounded-xl shadow hover:shadow-md transition-all flex items-center shrink-0 max-w-[140px] sm:max-w-none text-ellipsis overflow-hidden whitespace-nowrap"
            >
              <span className="truncate">{t('getQuote')}</span>
              <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 ml-1 shrink-0 hidden sm:inline" />
            </button>

            {/* Mobile Hamburger Toggle - ALWAYS VISIBLE ON MOBILE */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 sm:p-2 rounded-lg text-blue-950 hover:bg-slate-100 border border-slate-300 shrink-0"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* 2. SUB-NAVBAR (BELOW MAIN NAVBAR): DEDICATED NAV ITEMS */}
      <nav className="hidden lg:block bg-blue-950 border-b border-blue-900 text-white w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-1 py-1.5 overflow-x-auto">
            
            <Link to="/" className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors leading-normal whitespace-nowrap ${location.pathname === '/' ? 'text-white bg-blue-800 font-bold shadow-sm' : 'text-blue-100 hover:text-white hover:bg-blue-900'}`}>
              {t('navHome')}
            </Link>

            <Link to="/about" className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors leading-normal whitespace-nowrap ${location.pathname.startsWith('/about') ? 'text-white bg-blue-800 font-bold shadow-sm' : 'text-blue-100 hover:text-white hover:bg-blue-900'}`}>
              {t('navAbout')}
            </Link>

            <Link to="/dryers" className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors leading-normal whitespace-nowrap ${location.pathname.startsWith('/dryers') ? 'text-white bg-blue-800 font-bold shadow-sm' : 'text-blue-100 hover:text-white hover:bg-blue-900'}`}>
              {t('navDryers')}
            </Link>

            <Link to="/applications" className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors leading-normal whitespace-nowrap ${location.pathname.startsWith('/applications') ? 'text-white bg-blue-800 font-bold shadow-sm' : 'text-blue-100 hover:text-white hover:bg-blue-900'}`}>
              {t('navApplications')}
            </Link>

            <Link to="/gallery" className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors leading-normal whitespace-nowrap ${location.pathname.startsWith('/gallery') ? 'text-white bg-blue-800 font-bold shadow-sm' : 'text-blue-100 hover:text-white hover:bg-blue-900'}`}>
              {t('navGallery')}
            </Link>

            <Link to="/contact" className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors leading-normal whitespace-nowrap ${location.pathname === '/contact' ? 'text-white bg-blue-800 font-bold shadow-sm' : 'text-blue-100 hover:text-white hover:bg-blue-900'}`}>
              {t('navContact')}
            </Link>

          </div>
        </div>
      </nav>

      {/* 3. MOBILE MENU DRAWER (CLEAN MOBILE STYLING) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-blue-950 text-white border-b border-blue-900 p-4 space-y-2 shadow-2xl max-h-[85vh] overflow-y-auto animate-fade-in w-full">
          <Link to="/" className="block px-4 py-3 rounded-xl text-sm font-semibold text-blue-100 hover:bg-blue-900 border-b border-blue-900/50">{t('navHome')}</Link>
          <Link to="/about" className="block px-4 py-3 rounded-xl text-sm font-semibold text-blue-100 hover:bg-blue-900 border-b border-blue-900/50">{t('navAbout')}</Link>
          <Link to="/dryers" className="block px-4 py-3 rounded-xl text-sm font-semibold text-blue-100 hover:bg-blue-900 border-b border-blue-900/50">{t('navDryers')}</Link>
          <Link to="/applications" className="block px-4 py-3 rounded-xl text-sm font-semibold text-blue-100 hover:bg-blue-900 border-b border-blue-900/50">{t('navApplications')}</Link>
          <Link to="/gallery" className="block px-4 py-3 rounded-xl text-sm font-semibold text-blue-100 hover:bg-blue-900 border-b border-blue-900/50">{t('navGallery')}</Link>
          <Link to="/contact" className="block px-4 py-3 rounded-xl text-sm font-semibold text-blue-100 hover:bg-blue-900 border-b border-blue-900/50">{t('navContact')}</Link>
          
          <div className="pt-3">
            <button
              onClick={onOpenQuoteModal}
              className="w-full py-3 text-center text-xs font-bold uppercase tracking-wider text-white bg-green-600 hover:bg-green-500 rounded-xl shadow"
            >
              {t('getQuote')}
            </button>
          </div>
        </div>
      )}

    </header>
  );
}
