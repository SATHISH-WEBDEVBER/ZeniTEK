import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu, X, ArrowRight, ChevronDown, Sun, FileText, Image as ImageIcon, LayoutGrid
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import useScrollLock, { useEscapeKey } from '../hooks/useScrollLock';
import LanguageWidget from './LanguageWidget';
import { fetchPublicSections } from '../utils/api';
import { defaultSectionsData } from '../data/defaultSectionsData';
import { SOLUTION_ICONS } from '../data/siteMap';

// Fallback icon per solution page, shown when a section has no thumbnail photo
const SectionIcon = ({ slug, className }) => {
  const Icon = SOLUTION_ICONS[slug] || Sun;
  return <Icon className={className} />;
};

export default function Navbar({ onOpenQuoteModal, animStage = 3 }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);
  const [galleryDropdownOpen, setGalleryDropdownOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [mobileGalleryOpen, setMobileGalleryOpen] = useState(false);

  // Dynamic published sections for the 7 major categories
  const [sections, setSections] = useState(defaultSectionsData);

  const productsRef = useRef(null);
  const galleryRef = useRef(null);
  const timeoutRef = useRef(null);
  const location = useLocation();
  const { t, tf, lang } = useLanguage();

  // The full desktop menu is shown only when it actually fits on one row for the current
  // language and width (Tamil/Malayalam labels are much longer); otherwise the menu button is used.
  const rowRef = useRef(null);
  const [collapsed, setCollapsed] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(() => window.innerWidth);
  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  // Re-measure once web fonts finish loading: fallback fonts are wider and would force the menu button
  const [fontTick, setFontTick] = useState(0);
  useEffect(() => {
    if (!document.fonts) return undefined;
    const bump = () => setFontTick(n => n + 1);
    document.fonts.ready.then(bump);
    document.fonts.addEventListener('loadingdone', bump);
    return () => document.fonts.removeEventListener('loadingdone', bump);
  }, []);
  useLayoutEffect(() => { setCollapsed(false); }, [lang, viewportWidth, fontTick]);
  useLayoutEffect(() => {
    const row = rowRef.current;
    if (!collapsed && row && row.scrollWidth > row.clientWidth + 1) setCollapsed(true);
  }, [collapsed, lang, viewportWidth, fontTick]);
  // Freeze the page behind the open mobile menu; Esc closes it
  useScrollLock(mobileMenuOpen);
  useEscapeKey(mobileMenuOpen, () => setMobileMenuOpen(false));

  // Fetch published sections dynamically from API
  useEffect(() => {
    fetchPublicSections()
      .then(data => {
        if (data?.sections && Array.isArray(data.sections) && data.sections.length > 0) {
          setSections(data.sections);
        }
      })
      .catch(() => {
        // Retain default sections on network hiccup
      });
  }, [location.pathname]);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProductsDropdownOpen(false);
    setGalleryDropdownOpen(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, [location]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (productsRef.current && !productsRef.current.contains(e.target)) {
        setProductsDropdownOpen(false);
      }
      if (galleryRef.current && !galleryRef.current.contains(e.target)) {
        setGalleryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleProductsEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setGalleryDropdownOpen(false);
    setProductsDropdownOpen(true);
  };

  const handleProductsLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setProductsDropdownOpen(false);
    }, 180);
  };

  const handleGalleryEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setProductsDropdownOpen(false);
    setGalleryDropdownOpen(true);
  };

  const handleGalleryLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setGalleryDropdownOpen(false);
    }, 180);
  };

  const galleryDropdownItems = [
    {
      name: "Brochure",
      nameKey: "navbar_brochure",
      descKey: "navbar_brochureDesc",
      path: "/gallery?cat=brochure",
      icon: FileText,
      desc: "Official Technical PDF Pages"
    },
    {
      name: "Images",
      nameKey: "navbar_images",
      descKey: "navbar_imagesDesc",
      path: "/gallery?cat=all",
      icon: ImageIcon,
      desc: "Authentic Real Field Photos"
    }
  ];

  const productRoutes = [
    '/products',
    '/solar-dryer-models',
    '/solar-thermal-system',
    '/agri-solar-innovation',
    '/photovoltaic-solutions',
    '/government-subsidies',
    '/crop-preservation-guide',
    '/technical-spec-sheets',
    '/dryers',
    '/applications'
  ];

  const isSubsidiesActive = location.pathname === '/subsidies' || location.pathname === '/government-subsidies';
  const isProductsActive = !isSubsidiesActive && productRoutes.some(p => location.pathname === p || location.pathname.startsWith(p + '/'));
  const isGalleryActive = location.pathname.startsWith('/gallery');
  const isRnDActive = location.pathname === '/about' && location.hash === '#rnd';
  const isAboutActive = location.pathname === '/about' && location.hash !== '#rnd';
  const isContactActive = location.pathname === '/contact';

  return (
    <header className="sticky top-0 z-40 relative bg-white/95 backdrop-blur-md shadow-sm w-full transition-colors duration-500 border-b border-slate-100">
      
      {/* MAIN NAVBAR CONTAINER */}
      <div className="w-full px-5 sm:px-8 md:px-[60px]">
        <div ref={rowRef} className="flex items-center justify-between h-14 sm:h-16 lg:h-[68px] w-full">
          
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
              className="h-9 xs:h-10 sm:h-11 md:h-12 lg:h-[52px] xl:h-14 w-auto object-contain py-0.5"
            />
          </Link>

          {/* Desktop Nav Items - Stage 2 Animation */}
          <nav
            className={`${collapsed ? 'hidden' : 'hidden lg:flex'} items-center space-x-1 xl:space-x-2 2xl:space-x-3 transition-all duration-700 ease-out transform ${
              animStage >= 2
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 -translate-y-4 scale-95 pointer-events-none'
            }`}
          >
            {/* 1. HOME */}
            <Link
              to="/"
              className={`px-3 py-1.5 rounded-xl text-sm xl:text-base font-bold transition-all duration-200 whitespace-nowrap ${
                location.pathname === '/'
                  ? 'text-[#002DC2] bg-[#F0F4FD] border border-[#002DC2]/20 shadow-sm'
                  : 'text-slate-700 hover:text-[#002DC2] hover:bg-slate-100'
              }`}
            >
              {t('navHome')}
            </Link>

            {/* 2. PRODUCTS (STRUCTURED 7 CATEGORIES DROPDOWN) */}
            <div 
              ref={productsRef}
              className="relative"
              onMouseEnter={handleProductsEnter}
              onMouseLeave={handleProductsLeave}
            >
              <button
                type="button"
                onClick={() => {
                  setGalleryDropdownOpen(false);
                  setProductsDropdownOpen(!productsDropdownOpen);
                }}
                className={`px-3 py-1.5 rounded-xl text-sm xl:text-base font-bold transition-all duration-200 whitespace-nowrap flex items-center space-x-1.5 cursor-pointer ${
                  isProductsActive || productsDropdownOpen
                    ? 'text-[#002DC2] bg-[#F0F4FD] border border-[#002DC2]/20 shadow-sm'
                    : 'text-slate-700 hover:text-[#002DC2] hover:bg-slate-100'
                }`}
              >
                <span>{t('navbar_products')}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${productsDropdownOpen ? 'rotate-180 text-[#002DC2]' : 'text-slate-500'}`} />
              </button>

              {/* PRODUCTS 7 CATEGORIES DROPDOWN MENU */}
              {productsDropdownOpen && (
                <div 
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[760px] xl:w-[820px] bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-4 z-50 animate-fade-in space-y-3"
                  onMouseEnter={handleProductsEnter}
                  onMouseLeave={handleProductsLeave}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 px-2">
                    <div>
                      <span className="text-xs font-black uppercase tracking-wider text-[#002DC2]">
                        {t('site_productsBadge')}
                      </span>
                      <p className="text-sm text-slate-500 font-medium">
                        {t('navbar_productsCount', { count: sections.length })}
                      </p>
                    </div>
                    <Link
                      to="/products"
                      onClick={() => setProductsDropdownOpen(false)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#002DC2]/25 text-sm font-bold text-[#002DC2] hover:bg-[#F0F4FD] transition-colors shrink-0"
                    >
                      <LayoutGrid className="w-4 h-4" /> {t('site_viewAllProducts')}
                    </Link>
                  </div>

                  {/* 2-Column Structured Grid of the 7 Solution Categories */}
                  <div className="grid grid-cols-2 gap-2.5">
                    {sections.map((item) => (
                      <Link
                        key={item.slug}
                        to={`/${item.slug}`}
                        onClick={() => setProductsDropdownOpen(false)}
                        className="flex items-center space-x-3.5 p-2.5 rounded-xl hover:bg-[#F0F4FD] transition-all duration-200 border border-transparent hover:border-[#002DC2]/20 group cursor-pointer"
                      >
                        <div className="w-16 h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200 shadow-sm group-hover:scale-105 transition-transform duration-300">
                          {item.thumbnail?.url ? (
                            <img
                              src={item.thumbnail.url}
                              alt={tf(`section_${item.slug}_title`, item.title)}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                              <SectionIcon slug={item.slug} className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm xl:text-sm font-bold text-[#123B92] group-hover:text-[#002DC2] transition-colors leading-snug flex items-center justify-between">
                            <span className="truncate">{tf(`section_${item.slug}_title`, item.title)}</span>
                            <ArrowRight className="w-4 h-4 text-[#002DC2] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all shrink-0 ml-1" />
                          </div>
                          {item.subtitle && (
                            <div className="text-xs text-slate-500 font-medium truncate mt-0.5 leading-tight">
                              {tf(`section_${item.slug}_subtitle`, item.subtitle)}
                            </div>
                          )}
                        </div>
                      </Link>
                    ))}

                    {/* 8th Slot: Fast Quote Assistant */}
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 border border-[#23AC39]/30">
                      <div className="min-w-0 pr-2">
                        <div className="text-xs font-black text-[#1A822B]">{t('navbar_customDpr')}</div>
                        <div className="text-xs text-[#1A822B] font-medium truncate">{t('navbar_customDprDesc')}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setProductsDropdownOpen(false);
                          if (onOpenQuoteModal) onOpenQuoteModal();
                        }}
                        className="px-3 py-1.5 bg-[#23AC39] hover:bg-[#1f9632] text-white text-xs font-extrabold rounded-lg shadow-sm cursor-pointer shrink-0 transition-transform active:scale-95"
                      >
                        {t('getQuote')}
                      </button>
                    </div>
                  </div>

                </div>
              )}
            </div>

            {/* 3. GALLERY (DROPDOWN MENU) */}
            <div 
              ref={galleryRef}
              className="relative"
              onMouseEnter={handleGalleryEnter}
              onMouseLeave={handleGalleryLeave}
            >
              <button
                type="button"
                onClick={() => {
                  setProductsDropdownOpen(false);
                  setGalleryDropdownOpen(!galleryDropdownOpen);
                }}
                className={`px-3 py-1.5 rounded-xl text-sm xl:text-base font-bold transition-all duration-200 whitespace-nowrap flex items-center space-x-1.5 cursor-pointer ${
                  isGalleryActive || galleryDropdownOpen
                    ? 'text-[#002DC2] bg-[#F0F4FD] border border-[#002DC2]/20 shadow-sm'
                    : 'text-slate-700 hover:text-[#002DC2] hover:bg-slate-100'
                }`}
              >
                <span>{t('navGallery')}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${galleryDropdownOpen ? 'rotate-180 text-[#002DC2]' : 'text-slate-500'}`} />
              </button>

              {/* Gallery Dropdown Card */}
              {galleryDropdownOpen && (
                <div 
                  className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-2 z-50 animate-fade-in space-y-1"
                  onMouseEnter={handleGalleryEnter}
                  onMouseLeave={handleGalleryLeave}
                >
                  {galleryDropdownItems.map((item) => {
                    const ItemIcon = item.icon;
                    return (
                      <Link
                        key={t(item.nameKey)}
                        to={item.path}
                        onClick={() => setGalleryDropdownOpen(false)}
                        className="flex items-start space-x-3 p-2.5 rounded-xl hover:bg-[#F0F4FD] transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-[#F0F4FD] group-hover:bg-[#002DC2] text-[#002DC2] group-hover:text-white flex items-center justify-center shrink-0 transition-colors mt-0.5">
                          <ItemIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-[#123B92] group-hover:text-[#002DC2] transition-colors">
                            {t(item.nameKey)}
                          </div>
                          <div className="text-xs text-slate-500 font-medium leading-tight">
                            {t(item.descKey)}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 4. SUBSIDIES */}
            <Link
              to="/subsidies"
              className={`px-3 py-1.5 rounded-xl text-sm xl:text-base font-bold transition-all duration-200 whitespace-nowrap flex items-center space-x-1 ${
                isSubsidiesActive
                  ? 'text-[#002DC2] bg-[#F0F4FD] border border-[#002DC2]/20 shadow-sm'
                  : 'text-slate-700 hover:text-[#002DC2] hover:bg-slate-100'
              }`}
            >
              <span>{t('navbar_subsidies')}</span>
            </Link>

            {/* 5. R&D (RESEARCH & DEVELOPMENT SHORT FORM) */}
            <Link
              to="/about#rnd"
              className={`px-3 py-1.5 rounded-xl text-sm xl:text-base font-bold transition-all duration-200 whitespace-nowrap flex items-center space-x-1 ${
                isRnDActive
                  ? 'text-[#002DC2] bg-[#F0F4FD] border border-[#002DC2]/20 shadow-sm'
                  : 'text-slate-700 hover:text-[#002DC2] hover:bg-slate-100'
              }`}
            >
              <span>{t('navbar_rnd')}</span>
            </Link>

            {/* 6. ABOUT US */}
            <Link
              to="/about"
              className={`px-3 py-1.5 rounded-xl text-sm xl:text-base font-bold transition-all duration-200 whitespace-nowrap ${
                isAboutActive
                  ? 'text-[#002DC2] bg-[#F0F4FD] border border-[#002DC2]/20 shadow-sm'
                  : 'text-slate-700 hover:text-[#002DC2] hover:bg-slate-100'
              }`}
            >
              {t('navAbout')}
            </Link>

            {/* 7. CONTACT US */}
            <Link
              to="/contact"
              className={`px-3 py-1.5 rounded-xl text-sm xl:text-base font-bold transition-all duration-200 whitespace-nowrap ${
                isContactActive
                  ? 'text-[#002DC2] bg-[#F0F4FD] border border-[#002DC2]/20 shadow-sm'
                  : 'text-slate-700 hover:text-[#002DC2] hover:bg-slate-100'
              }`}
            >
              {t('navContact')}
            </Link>

          </nav>

          {/* Right Action & Mobile Toggle - Stage 2 Animation */}
          <div
            className={`flex items-center space-x-2 sm:space-x-3 shrink-0 transition-all duration-700 ease-out transform ${
              animStage >= 2
                ? 'opacity-100 scale-100 translate-x-0'
                : 'opacity-0 scale-90 translate-x-6 pointer-events-none'
            }`}
          >
            {/* Language switcher (desktop; mobile has it inside the menu) */}
            <div className={collapsed ? 'hidden' : 'hidden lg:block'}>
              <LanguageWidget />
            </div>

            {/* Quote CTA Button */}
            <button
              onClick={onOpenQuoteModal}
              className="px-3.5 py-1.5 sm:px-4 sm:py-2 lg:px-[18px] lg:py-2 text-xs sm:text-sm font-extrabold uppercase tracking-wide text-white bg-[#23AC39] hover:bg-[#1f9632] rounded-xl shadow-md shadow-[#23AC39]/20 transition-all flex items-center shrink-0 cursor-pointer hover:shadow-lg active:scale-95"
            >
              <span>{t('getQuote')}</span>
              <ArrowRight className="w-4 h-4 ml-1.5 shrink-0" />
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`${collapsed ? '' : 'lg:hidden'} p-2 rounded-xl text-[#123B92] hover:bg-[#F0F4FD] border border-[#123B92]/20 shrink-0 transition-colors cursor-pointer`}
              aria-label={t('navbar_toggleMenu')}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Dimmed backdrop overlay when dropdown is open */}
      {(productsDropdownOpen || galleryDropdownOpen) && (
        <div 
          className="hidden lg:block fixed inset-0 top-[56px] sm:top-[64px] lg:top-[68px] bg-black/35 backdrop-blur-[1px] z-30 transition-opacity duration-300"
          onClick={() => {
            setProductsDropdownOpen(false);
            setGalleryDropdownOpen(false);
          }}
        />
      )}

      {/* MOBILE MENU ACCORDION DRAWER */}
      {mobileMenuOpen && (
        <div className={`${collapsed ? '' : 'lg:hidden'} bg-white border-t border-slate-200 p-4 space-y-1 shadow-2xl max-h-[85vh] overflow-y-auto animate-fade-in w-full`}>
          
          {/* Mobile: 1. Home */}
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-4 py-2.5 rounded-xl text-base font-bold transition-colors ${
              location.pathname === '/'
                ? 'text-[#002DC2] bg-[#F0F4FD]'
                : 'text-slate-800 hover:bg-slate-50'
            }`}
          >
            {t('navHome')}
          </Link>

          {/* Mobile: 2. Products Accordion (7 Categories) */}
          <div>
            <button
              type="button"
              onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-base font-bold text-[#123B92] hover:bg-slate-50 transition-colors"
            >
              <span>{t('navbar_productsCount', { count: sections.length })}</span>
              <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${mobileProductsOpen ? 'rotate-180 text-[#002DC2]' : 'text-slate-500'}`} />
            </button>

            {mobileProductsOpen && (
              <div className="pl-2 pr-2 py-2 space-y-1.5 bg-slate-50/80 rounded-xl mb-1 border border-slate-100">
                <Link
                  to="/products"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 p-2.5 rounded-lg bg-[#F0F4FD] border border-[#002DC2]/20 text-sm font-bold text-[#002DC2]"
                >
                  <LayoutGrid className="w-5 h-5" /> {t('site_viewAllProducts')}
                </Link>
                {sections.map((item) => (
                  <Link
                    key={item.slug}
                    to={`/${item.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-3 p-2 rounded-lg bg-white border border-slate-200/60 hover:border-[#002DC2]/30 text-slate-800 hover:text-[#002DC2] transition-colors"
                  >
                    <div className="w-10 h-10 rounded-md overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                      {item.thumbnail?.url ? (
                        <img
                          src={item.thumbnail.url}
                          alt={tf(`section_${item.slug}_title`, item.title)}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <SectionIcon slug={item.slug} className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-[#123B92] leading-tight truncate">
                        {tf(`section_${item.slug}_title`, item.title)}
                      </div>
                      {item.subtitle && (
                        <div className="text-2xs text-slate-500 font-medium truncate mt-0.5">
                          {tf(`section_${item.slug}_subtitle`, item.subtitle)}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Mobile: 3. Gallery Accordion */}
          <div>
            <button
              type="button"
              onClick={() => setMobileGalleryOpen(!mobileGalleryOpen)}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-base font-bold text-[#123B92] hover:bg-slate-50 transition-colors"
            >
              <span>{t('navGallery')}</span>
              <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${mobileGalleryOpen ? 'rotate-180 text-[#002DC2]' : 'text-slate-500'}`} />
            </button>

            {mobileGalleryOpen && (
              <div className="pl-4 pr-2 py-1 space-y-1 bg-slate-50 rounded-xl mb-1">
                {galleryDropdownItems.map((item) => (
                  <Link
                    key={t(item.nameKey)}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-[#002DC2] hover:bg-white"
                  >
                    {t(item.nameKey)}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Mobile: 4. Subsidies */}
          <Link
            to="/subsidies"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-4 py-2.5 rounded-xl text-base font-bold transition-colors ${
              isSubsidiesActive
                ? 'text-[#002DC2] bg-[#F0F4FD]'
                : 'text-slate-800 hover:bg-slate-50'
            }`}
          >
            Subsidies
          </Link>

          {/* Mobile: 5. R&D (Research & Development Short Form) */}
          <Link
            to="/about#rnd"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-base font-bold transition-colors ${
              isRnDActive
                ? 'text-[#002DC2] bg-[#F0F4FD]'
                : 'text-slate-800 hover:bg-slate-50'
            }`}
          >
            <span>{t('navbar_rnd')}</span>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
              Research & Dev
            </span>
          </Link>

          {/* Mobile: 6. About Us */}
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-4 py-2.5 rounded-xl text-base font-bold transition-colors ${
              isAboutActive
                ? 'text-[#002DC2] bg-[#F0F4FD]'
                : 'text-slate-800 hover:bg-slate-50'
            }`}
          >
            {t('navAbout')}
          </Link>

          {/* Mobile: 7. Contact Us */}
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-4 py-2.5 rounded-xl text-base font-bold transition-colors ${
              isContactActive
                ? 'text-[#002DC2] bg-[#F0F4FD]'
                : 'text-slate-800 hover:bg-slate-50'
            }`}
          >
            {t('navContact')}
          </Link>
          
          {/* Mobile: Language */}
          <div className="pt-3 border-t border-[#123B92]/10">
            <LanguageWidget variant="list" onSelect={() => setMobileMenuOpen(false)} />
          </div>

          {/* Mobile CTA */}
          <div className="pt-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenQuoteModal();
              }}
              className="w-full py-3.5 text-center text-xs font-black uppercase tracking-wider text-white bg-[#23AC39] hover:bg-[#1f9632] rounded-xl shadow cursor-pointer transition-all flex items-center justify-center space-x-2"
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
