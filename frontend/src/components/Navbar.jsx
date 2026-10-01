import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar({ onOpenQuoteModal, animStage = 3 }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: t('navHome'), path: '/', isActive: location.pathname === '/' },
    { name: t('navAbout'), path: '/about', isActive: location.pathname.startsWith('/about') },
    { name: t('navDryers'), path: '/dryers', isActive: location.pathname.startsWith('/dryers') },
    { name: t('navApplications'), path: '/applications', isActive: location.pathname.startsWith('/applications') },
    { name: t('navGallery'), path: '/gallery', isActive: location.pathname.startsWith('/gallery') },
    { name: t('navContact'), path: '/contact', isActive: location.pathname === '/contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-sm w-full border-b border-slate-200/80 transition-colors duration-500">
      
      {/* MAIN NAVBAR */}
      <div className="w-full px-5 sm:px-8 md:px-[60px]">
        <div className="flex items-center justify-between h-18 sm:h-20 lg:h-24 w-full">
          
          {/* Logo - Stage 1 Animation */}
          <Link
            to="/"
            className={`flex items-center shrink-0 transition-all duration-700 ease-out transform ${
              animStage >= 1
                ? 'opacity-100 scale-100 translate-x-0'
                : 'opacity-0 scale-90 -translate-x-6 pointer-events-none'
            }`}
          >
            <img
              src="/logo.png"
              alt="ZeniTEK - Towards Sustainable Future"
              className="h-11 xs:h-12 sm:h-14 md:h-16 lg:h-18 xl:h-20 w-auto object-contain py-0.5"
            />
          </Link>

          {/* Desktop Nav Items - Stage 2 Animation */}
          <nav
            className={`hidden lg:flex items-center space-x-1 xl:space-x-2 2xl:space-x-4 transition-all duration-700 ease-out transform ${
              animStage >= 2
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 -translate-y-4 scale-95 pointer-events-none'
            }`}
          >
            {navLinks.map((link, idx) => (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  transitionDelay: animStage >= 2 ? `${idx * 60}ms` : '0ms',
                }}
                className={`px-3 py-1.5 xl:px-3.5 xl:py-2 rounded-xl text-[14px] xl:text-[15px] font-bold transition-all duration-300 whitespace-nowrap ${
                  link.isActive
                    ? 'text-[#002DC2] bg-[#F0F4FD] border border-[#002DC2]/20 shadow-xs'
                    : 'text-slate-700 hover:text-[#002DC2] hover:bg-slate-100'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Action & Mobile Toggle - Stage 2 Animation */}
          <div
            className={`flex items-center space-x-2 sm:space-x-3 shrink-0 transition-all duration-700 ease-out transform ${
              animStage >= 2
                ? 'opacity-100 scale-100 translate-x-0'
                : 'opacity-0 scale-90 translate-x-6 pointer-events-none'
            }`}
          >
            {/* Quote CTA Button */}
            <button
              onClick={onOpenQuoteModal}
              className="px-3.5 py-2 sm:px-4 sm:py-2 lg:px-5 lg:py-2.5 text-xs sm:text-sm font-extrabold uppercase tracking-wide text-white bg-[#23AC39] hover:bg-[#1f9632] rounded-xl shadow-md shadow-[#23AC39]/20 transition-all flex items-center shrink-0 cursor-pointer hover:shadow-lg active:scale-95"
            >
              <span>{t('getQuote')}</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1.5 shrink-0" />
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-[#123B92] hover:bg-[#F0F4FD] border border-[#123B92]/20 shrink-0 transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* MOBILE MENU DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 p-4 space-y-1 shadow-2xl max-h-[85vh] overflow-y-auto animate-fade-in w-full">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`block px-4 py-3 rounded-xl text-base font-bold transition-colors ${
                link.isActive
                  ? 'text-[#002DC2] bg-[#F0F4FD] border border-[#002DC2]/20'
                  : 'text-slate-700 hover:text-[#002DC2] hover:bg-slate-50'
              }`}
            >
              {link.name}
            </Link>
          ))}
          
          <div className="pt-3">
            <button
              onClick={onOpenQuoteModal}
              className="w-full py-3 text-center text-xs font-black uppercase tracking-wider text-white bg-[#23AC39] hover:bg-[#1f9632] rounded-xl shadow cursor-pointer transition-all flex items-center justify-center space-x-2"
            >
              <span>{t('getQuote')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </header>
  );
}
