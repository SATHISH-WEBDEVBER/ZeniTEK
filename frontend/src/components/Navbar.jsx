import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu, X, ArrowRight, ChevronDown, FileText, Image as ImageIcon, LayoutGrid
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import useScrollLock, { useEscapeKey } from '../hooks/useScrollLock';
import LanguageWidget from './LanguageWidget';
import SolarThermalArt from './SolarThermalArt';
import { PRODUCTS } from '../data/siteMap';
import { nodeTitle } from '../data/productCatalog';

// Product thumbnail: the product's real photo, or its drawing when there is no photo
const ProductThumb = ({ product, className }) => (
  <div className={`overflow-hidden shrink-0 border border-slate-200 bg-[#F0F4FD] ${className}`}>
    {product.image ? (
      <img src={product.image} alt="" className="w-full h-full object-cover" />
    ) : (
      <SolarThermalArt type={product.art} className="w-full h-full" />
    )}
  </div>
);

export default function Navbar({ onOpenQuoteModal, animStage = 3 }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);
  const [galleryDropdownOpen, setGalleryDropdownOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [mobileGalleryOpen, setMobileGalleryOpen] = useState(false);

  const navigate = useNavigate();
  const productsRef = useRef(null);
  const galleryRef = useRef(null);
  const timeoutRef = useRef(null);
  const location = useLocation();
  const { t, lang } = useLanguage();

  // Desktop (lg+) always gets the desktop menu; the phone menu button is only used below lg.
  // When the labels don't fit on one row (long languages such as Tamil/Malayalam, or narrow laptops)
  // the bar tightens step by step: 0 = normal, 1 = tighter spacing, 2 = compact language + quote
  // buttons, 3 = two rows (logo + buttons on top, the full menu centred on a second row).
  const rowRef = useRef(null);
  const [density, setDensity] = useState(0);
  const twoRow = density >= 3;
  const densityRef = useRef(0);
  densityRef.current = density;
  const [viewportWidth, setViewportWidth] = useState(() => window.innerWidth);
  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  // Re-measure once web fonts and the logo finish loading (both change the bar's width)
  const [fontTick, setFontTick] = useState(0);
  useEffect(() => {
    if (!document.fonts) return undefined;
    const bump = () => setFontTick(n => n + 1);
    document.fonts.ready.then(bump);
    document.fonts.addEventListener('loadingdone', bump);
    return () => document.fonts.removeEventListener('loadingdone', bump);
  }, []);
  useLayoutEffect(() => { setDensity(0); }, [lang, viewportWidth, fontTick]);
  useLayoutEffect(() => {
    const row = rowRef.current;
    if (!row || density >= 3) return;
    // Sum the real widths of logo, menu and buttons (offsetWidth ignores the opening-animation
    // transforms, which made scrollWidth report overflow while the bar was still sliding in)
    const needed = [...row.children].reduce((sum, el) => sum + el.offsetWidth, 0) + 24;
    if (needed > row.clientWidth) setDensity(d => d + 1);
  }, [density, lang, viewportWidth, fontTick]);
  // Anything that widens the bar later (late fonts, images) tightens it again
  useEffect(() => {
    const row = rowRef.current;
    if (!row || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(() => {
      if (densityRef.current >= 3) return;
      const needed = [...row.children].reduce((sum, el) => sum + el.offsetWidth, 0) + 24;
      if (needed > row.clientWidth) setDensity(d => Math.min(3, d + 1));
    });
    [row, ...row.children].forEach(el => ro.observe(el));
    return () => ro.disconnect();
  }, []);
  const navItemCls = density === 0
    ? 'px-3 py-1.5 rounded-xl text-sm xl:text-base'
    : density === 1 || twoRow ? 'px-2 py-1.5 rounded-lg text-sm' : 'px-1.5 py-1.5 rounded-lg text-sm';
  // Freeze the page behind the open mobile menu; Esc closes it
  useScrollLock(mobileMenuOpen);
  useEscapeKey(mobileMenuOpen, () => setMobileMenuOpen(false));

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

  // Products / Gallery: hovering shows the dropdown; clicking opens the section's own page.
  // Touch screens have no hover, so there a tap opens/closes the dropdown instead.
  const canHover = () => typeof window !== 'undefined' && window.matchMedia?.('(hover: hover) and (pointer: fine)').matches;
  const openMenuOrPage = (path, isOpen, setOpen, closeOther) => {
    closeOther(false);
    if (canHover()) {
      setOpen(false);
      navigate(path);
    } else {
      setOpen(!isOpen);
    }
  };

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

  const productRoutes = ['/products', '/dryers', ...PRODUCTS.map(p => p.path)];

  const isSubsidiesActive = location.pathname === '/subsidies';
  const isProductsActive = productRoutes.some(p => location.pathname === p || location.pathname.startsWith(p + '/'));
  const isGalleryActive = location.pathname.startsWith('/gallery');
  const isAboutActive = location.pathname === '/about';
  const isContactActive = location.pathname === '/contact';

  return (
    <header className="sticky top-0 z-40 relative bg-white/95 backdrop-blur-md shadow-sm w-full transition-colors duration-500 border-b border-slate-100">
      
      {/* MAIN NAVBAR CONTAINER */}
      <div className={`w-full px-5 sm:px-8 ${density === 0 ? 'md:px-[60px]' : 'lg:px-6'}`}>
        <div ref={rowRef} className={`flex flex-wrap items-center justify-between w-full h-14 sm:h-16 ${twoRow ? 'lg:h-auto lg:py-2' : 'lg:h-[68px]'}`}>
          
          {/* Logo - Stage 1 Animation */}
          <Link
            to="/"
            aria-label="ZeniTEK - Home"
            onClick={() => {
              // Already on Home: the route doesn't change, so jump back to the top
              setMobileMenuOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex items-center shrink-0 transition-[opacity,transform] duration-700 ease-out transform ${
              animStage >= 1
                ? 'opacity-100 scale-100 translate-x-0'
                : 'opacity-0 scale-90 -translate-x-6 pointer-events-none'
            }`}
          >
            <img
              src="/logo.webp"
              onLoad={() => setFontTick(n => n + 1)}
              alt="ZeniTEK - Towards Sustainable Future"
              className="h-9 xs:h-10 sm:h-11 md:h-12 lg:h-[52px] xl:h-14 w-auto object-contain py-0.5"
            />
          </Link>

          {/* Desktop Nav Items - Stage 2 Animation */}
          <nav
            className={`hidden lg:flex items-center ${twoRow ? 'order-last w-full justify-center flex-wrap gap-y-1 mt-2 pt-2 border-t border-slate-100 space-x-1' : density === 0 ? 'space-x-1 xl:space-x-2 2xl:space-x-3' : 'space-x-0.5'} transition-[opacity,transform] duration-700 ease-out transform ${
              animStage >= 2
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 -translate-y-4 scale-95 pointer-events-none'
            }`}
          >
            {/* 1. HOME */}
            <Link
              to="/"
              className={`${navItemCls} font-bold transition-colors duration-200 whitespace-nowrap ${
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
                onClick={() => openMenuOrPage('/products', productsDropdownOpen, setProductsDropdownOpen, setGalleryDropdownOpen)}
                className={`${navItemCls} font-bold transition-colors duration-200 whitespace-nowrap flex items-center space-x-1.5 cursor-pointer ${
                  isProductsActive || productsDropdownOpen
                    ? 'text-[#002DC2] bg-[#F0F4FD] border border-[#002DC2]/20 shadow-sm'
                    : 'text-slate-700 hover:text-[#002DC2] hover:bg-slate-100'
                }`}
              >
                <span>{t('navbar_products')}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${productsDropdownOpen ? 'rotate-180 text-[#002DC2]' : 'text-slate-500'}`} />
              </button>

              {/* PRODUCTS DROPDOWN: the four product areas, each with links to its sub-products */}
              {productsDropdownOpen && (
                <div
                  className={`absolute top-full ${twoRow ? 'left-0' : 'left-1/2 -translate-x-1/2'} mt-2 w-[540px] bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-3 z-50 animate-fade-in space-y-2`}
                  onMouseEnter={handleProductsEnter}
                  onMouseLeave={handleProductsLeave}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 px-2 pt-1">
                    <span className="text-xs font-black uppercase tracking-wider text-[#002DC2]">
                      {t('site_productsBadge')}
                    </span>
                    <Link
                      to="/products"
                      onClick={() => setProductsDropdownOpen(false)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#002DC2]/25 text-sm font-bold text-[#002DC2] hover:bg-[#F0F4FD] transition-colors shrink-0"
                    >
                      <LayoutGrid className="w-4 h-4" /> {t('site_viewAllProducts')}
                    </Link>
                  </div>

                  {PRODUCTS.map((product) => (
                    <div key={product.path} className="rounded-xl hover:bg-[#F0F4FD] transition-colors border border-transparent hover:border-[#002DC2]/20">
                      <Link
                        to={product.path}
                        onClick={() => setProductsDropdownOpen(false)}
                        className="flex items-center gap-3.5 p-2.5 group"
                      >
                        <ProductThumb product={product} className="w-[72px] h-14 rounded-lg" />
                        <div className="min-w-0 flex-1">
                          <div className="text-base font-bold text-[#123B92] group-hover:text-[#002DC2] transition-colors leading-snug">
                            {t(product.key)}
                          </div>
                          <div className="text-sm text-slate-500 font-medium leading-snug mt-0.5">
                            {t(product.shortKey)}
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-[#002DC2] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all shrink-0" />
                      </Link>
                      {product.children && (
                        <div className="flex flex-wrap gap-1.5 pl-[98px] pr-2.5 pb-2.5 -mt-1">
                          {product.children.map(child => (
                            <Link
                              key={child.id}
                              to={child.path}
                              onClick={() => setProductsDropdownOpen(false)}
                              className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:border-[#002DC2] hover:text-[#002DC2] transition-colors"
                            >
                              {nodeTitle(child, t)}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Quote shortcut */}
                  <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 border border-[#23AC39]/30">
                    <div className="min-w-0">
                      <div className="text-sm font-black text-[#1A822B]">{t('navbar_customDpr')}</div>
                      <div className="text-xs text-[#1A822B] font-medium">{t('navbar_customDprDesc')}</div>
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
                onClick={() => openMenuOrPage('/gallery', galleryDropdownOpen, setGalleryDropdownOpen, setProductsDropdownOpen)}
                className={`${navItemCls} font-bold transition-colors duration-200 whitespace-nowrap flex items-center space-x-1.5 cursor-pointer ${
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
              className={`${navItemCls} font-bold transition-colors duration-200 whitespace-nowrap flex items-center space-x-1 ${
                isSubsidiesActive
                  ? 'text-[#002DC2] bg-[#F0F4FD] border border-[#002DC2]/20 shadow-sm'
                  : 'text-slate-700 hover:text-[#002DC2] hover:bg-slate-100'
              }`}
            >
              <span>{t('navbar_subsidies')}</span>
            </Link>

            {/* 5. ABOUT US */}
            <Link
              to="/about"
              className={`${navItemCls} font-bold transition-colors duration-200 whitespace-nowrap ${
                isAboutActive
                  ? 'text-[#002DC2] bg-[#F0F4FD] border border-[#002DC2]/20 shadow-sm'
                  : 'text-slate-700 hover:text-[#002DC2] hover:bg-slate-100'
              }`}
            >
              {t('navAbout')}
            </Link>

            {/* 6. CONTACT US */}
            <Link
              to="/contact"
              className={`${navItemCls} font-bold transition-colors duration-200 whitespace-nowrap ${
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
            className={`flex items-center space-x-2 sm:space-x-3 shrink-0 transition-[opacity,transform] duration-700 ease-out transform ${
              animStage >= 2
                ? 'opacity-100 scale-100 translate-x-0'
                : 'opacity-0 scale-90 translate-x-6 pointer-events-none'
            }`}
          >
            {/* Language switcher (desktop; mobile has it inside the menu) */}
            <div className="hidden lg:block">
              <LanguageWidget compact={density >= 2} />
            </div>

            {/* Quote CTA Button */}
            <button
              onClick={onOpenQuoteModal}
              className={`px-3.5 py-1.5 sm:px-4 sm:py-2 ${density >= 2 ? 'lg:px-3' : 'lg:px-[18px]'} lg:py-2 text-xs sm:text-sm font-extrabold uppercase tracking-wide text-white bg-[#23AC39] hover:bg-[#1f9632] rounded-xl shadow-md shadow-[#23AC39]/20 transition-[background-color,box-shadow,transform] flex items-center shrink-0 cursor-pointer hover:shadow-lg active:scale-95`}
            >
              <span className="whitespace-nowrap">{t('getQuote')}</span>
              {density < 2 && <ArrowRight className="w-4 h-4 ml-1.5 shrink-0" />}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2 rounded-xl text-[#123B92] hover:bg-[#F0F4FD] border border-[#123B92]/20 shrink-0 transition-colors cursor-pointer`}
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
        <div className={`lg:hidden bg-white border-t border-slate-200 p-4 space-y-1 shadow-2xl max-h-[85vh] overflow-y-auto animate-fade-in w-full`}>
          
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

          {/* Mobile: 2. Products Accordion (the three product pages) */}
          <div>
            <button
              type="button"
              onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-base font-bold text-[#123B92] hover:bg-slate-50 transition-colors"
            >
              <span>{t('navbar_products')}</span>
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
                {PRODUCTS.map((product) => (
                  <div key={product.path} className="rounded-lg bg-white border border-slate-200/60">
                  <Link
                    to={product.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-2 rounded-lg hover:border-[#002DC2]/30 text-slate-800 hover:text-[#002DC2] transition-colors"
                  >
                    <ProductThumb product={product} className="w-12 h-12 rounded-md" />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-bold text-[#123B92] leading-tight">
                        {t(product.key)}
                      </div>
                      <div className="text-xs text-slate-500 font-medium mt-0.5">
                        {t(product.shortKey)}
                      </div>
                    </div>
                  </Link>
                  {product.children && (
                    <div className="flex flex-wrap gap-1.5 px-2 pb-2">
                      {product.children.map(child => (
                        <Link
                          key={child.id}
                          to={child.path}
                          onClick={() => setMobileMenuOpen(false)}
                          className="px-2.5 py-1.5 rounded-md bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 hover:border-[#002DC2] hover:text-[#002DC2] transition-colors"
                        >
                          {nodeTitle(child, t)}
                        </Link>
                      ))}
                    </div>
                  )}
                  </div>
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
            {t('navbar_subsidies')}
          </Link>

          {/* Mobile: 5. About Us */}
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

          {/* Mobile: 6. Contact Us */}
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
