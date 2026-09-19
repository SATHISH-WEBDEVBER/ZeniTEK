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
      <div className="border-b border-[#123B92]/20 py-2 sm:py-2.5 bg-white w-full">
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo (New Official ZeniTEK Logo) */}
          <Link to="/" className="flex items-center shrink-0">
            <img
              src="/logo.png"
              alt="ZeniTEK - Towards Sustainable Future"
              className="h-8 xs:h-9 sm:h-11 md:h-12 w-auto object-contain py-0.5"
            />
          </Link>

          {/* Center Info (Desktop Only) */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6 text-xs text-black font-medium">
            <span className="flex items-center text-[#123B92] font-bold">
              <ShieldCheck className="w-4 h-4 mr-1 text-[#002DC2]" /> MNRE & ISO Certified
            </span>
            <a href="tel:+918098613422" className="flex items-center text-black hover:text-[#002DC2] font-bold transition-colors">
              <PhoneCall className="w-3.5 h-3.5 mr-1 text-[#002DC2]" /> +91 80986 13422 (Balakrishnan)
            </a>
          </div>

          {/* Right Action & Mobile Toggle (Strict flex shrink-0 so hamburger NEVER overflows) */}
          <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
            
            {/* Quote CTA Button */}
            <button
              onClick={onOpenQuoteModal}
              className="px-2 py-1.5 xs:px-2.5 xs:py-1.5 sm:px-4 sm:py-2 text-[10px] xs:text-[11px] sm:text-xs font-black uppercase tracking-wider text-black bg-[#00FB00] hover:bg-[#002DC2] hover:text-white rounded-lg sm:rounded-xl shadow transition-all flex items-center shrink-0 max-w-[125px] xs:max-w-[140px] sm:max-w-none text-ellipsis overflow-hidden whitespace-nowrap cursor-pointer"
            >
              <span className="truncate">{t('getQuote')}</span>
              <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 ml-1 shrink-0 hidden sm:inline" />
            </button>

            {/* Mobile Hamburger Toggle - ALWAYS VISIBLE ON MOBILE */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 sm:p-2 rounded-lg text-[#123B92] hover:bg-[#F0F4FD] border border-[#123B92]/30 shrink-0"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* 2. SUB-NAVBAR (BELOW MAIN NAVBAR): DEDICATED NAV ITEMS */}
      <nav className="hidden lg:block bg-[#123B92] border-b border-[#002DC2] text-white w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-1.5 lg:py-2 w-full">
            
            <Link to="/" className={`px-3 lg:px-4 xl:px-6 py-1.5 lg:py-2 rounded-xl text-xs xl:text-sm font-bold transition-all whitespace-nowrap ${location.pathname === '/' ? 'text-white bg-[#002DC2] shadow border border-[#00FB00]' : 'text-white/90 hover:text-white hover:bg-[#002DC2]/60'}`}>
              {t('navHome')}
            </Link>

            <Link to="/about" className={`px-3 lg:px-4 xl:px-6 py-1.5 lg:py-2 rounded-xl text-xs xl:text-sm font-bold transition-all whitespace-nowrap ${location.pathname.startsWith('/about') ? 'text-white bg-[#002DC2] shadow border border-[#00FB00]' : 'text-white/90 hover:text-white hover:bg-[#002DC2]/60'}`}>
              {t('navAbout')}
            </Link>

            <Link to="/dryers" className={`px-3 lg:px-4 xl:px-6 py-1.5 lg:py-2 rounded-xl text-xs xl:text-sm font-bold transition-all whitespace-nowrap ${location.pathname.startsWith('/dryers') ? 'text-white bg-[#002DC2] shadow border border-[#00FB00]' : 'text-white/90 hover:text-white hover:bg-[#002DC2]/60'}`}>
              {t('navDryers')}
            </Link>

            <Link to="/applications" className={`px-3 lg:px-4 xl:px-6 py-1.5 lg:py-2 rounded-xl text-xs xl:text-sm font-bold transition-all whitespace-nowrap ${location.pathname.startsWith('/applications') ? 'text-white bg-[#002DC2] shadow border border-[#00FB00]' : 'text-white/90 hover:text-white hover:bg-[#002DC2]/60'}`}>
              {t('navApplications')}
            </Link>

            <Link to="/gallery" className={`px-3 lg:px-4 xl:px-6 py-1.5 lg:py-2 rounded-xl text-xs xl:text-sm font-bold transition-all whitespace-nowrap ${location.pathname.startsWith('/gallery') ? 'text-white bg-[#002DC2] shadow border border-[#00FB00]' : 'text-white/90 hover:text-white hover:bg-[#002DC2]/60'}`}>
              {t('navGallery')}
            </Link>

            <Link to="/contact" className={`px-3 lg:px-4 xl:px-6 py-1.5 lg:py-2 rounded-xl text-xs xl:text-sm font-bold transition-all whitespace-nowrap ${location.pathname === '/contact' ? 'text-white bg-[#002DC2] shadow border border-[#00FB00]' : 'text-white/90 hover:text-white hover:bg-[#002DC2]/60'}`}>
              {t('navContact')}
            </Link>

          </div>
        </div>
      </nav>

      {/* 3. MOBILE MENU DRAWER (CLEAN MOBILE STYLING) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#123B92] text-white border-b border-[#002DC2] p-4 space-y-2 shadow-2xl max-h-[85vh] overflow-y-auto animate-fade-in w-full">
          <Link to="/" className="block px-4 py-3 rounded-xl text-sm font-semibold text-white hover:bg-[#002DC2] border-b border-[#002DC2]/50">{t('navHome')}</Link>
          <Link to="/about" className="block px-4 py-3 rounded-xl text-sm font-semibold text-white hover:bg-[#002DC2] border-b border-[#002DC2]/50">{t('navAbout')}</Link>
          <Link to="/dryers" className="block px-4 py-3 rounded-xl text-sm font-semibold text-white hover:bg-[#002DC2] border-b border-[#002DC2]/50">{t('navDryers')}</Link>
          <Link to="/applications" className="block px-4 py-3 rounded-xl text-sm font-semibold text-white hover:bg-[#002DC2] border-b border-[#002DC2]/50">{t('navApplications')}</Link>
          <Link to="/gallery" className="block px-4 py-3 rounded-xl text-sm font-semibold text-white hover:bg-[#002DC2] border-b border-[#002DC2]/50">{t('navGallery')}</Link>
          <Link to="/contact" className="block px-4 py-3 rounded-xl text-sm font-semibold text-white hover:bg-[#002DC2] border-b border-[#002DC2]/50">{t('navContact')}</Link>
          
          <div className="pt-3">
            <button
              onClick={onOpenQuoteModal}
              className="w-full py-3 text-center text-xs font-black uppercase tracking-wider text-black bg-[#00FB00] hover:bg-[#002DC2] hover:text-white rounded-xl shadow cursor-pointer transition-all"
            >
              {t('getQuote')}
            </button>
          </div>
        </div>
      )}

    </header>
  );
}
