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
          
          {/* Logo (New Official ZeniTEK Logo) */}
          <Link to="/" className="flex items-center shrink-0">
            <img
              src="/logo.png"
              alt="ZeniTEK - Towards Sustainable Future"
              className="h-10 sm:h-12 w-auto object-contain py-0.5"
            />
          </Link>

          {/* Center Info (Desktop Only) */}
          <div className="hidden md:flex items-center space-x-6 text-xs text-slate-600 font-medium">
            <span className="flex items-center text-blue-900 font-semibold">
              <ShieldCheck className="w-4 h-4 mr-1 text-green-600" /> MNRE & ISO Certified
            </span>
            <a href="tel:+918098613422" className="flex items-center text-slate-800 hover:text-blue-700 font-bold transition-colors">
              <PhoneCall className="w-3.5 h-3.5 mr-1 text-blue-700" /> +91 80986 13422 (Balakrishnan)
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
          <div className="flex items-center justify-between py-2 w-full">
            
            <Link to="/" className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${location.pathname === '/' ? 'text-white bg-blue-800 shadow border border-blue-700' : 'text-blue-100 hover:text-white hover:bg-blue-900/80'}`}>
              {t('navHome')}
            </Link>

            <Link to="/about" className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${location.pathname.startsWith('/about') ? 'text-white bg-blue-800 shadow border border-blue-700' : 'text-blue-100 hover:text-white hover:bg-blue-900/80'}`}>
              {t('navAbout')}
            </Link>

            <Link to="/dryers" className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${location.pathname.startsWith('/dryers') ? 'text-white bg-blue-800 shadow border border-blue-700' : 'text-blue-100 hover:text-white hover:bg-blue-900/80'}`}>
              {t('navDryers')}
            </Link>

            <Link to="/applications" className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${location.pathname.startsWith('/applications') ? 'text-white bg-blue-800 shadow border border-blue-700' : 'text-blue-100 hover:text-white hover:bg-blue-900/80'}`}>
              {t('navApplications')}
            </Link>

            <Link to="/gallery" className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${location.pathname.startsWith('/gallery') ? 'text-white bg-blue-800 shadow border border-blue-700' : 'text-blue-100 hover:text-white hover:bg-blue-900/80'}`}>
              {t('navGallery')}
            </Link>

            <Link to="/contact" className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${location.pathname === '/contact' ? 'text-white bg-blue-800 shadow border border-blue-700' : 'text-blue-100 hover:text-white hover:bg-blue-900/80'}`}>
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
