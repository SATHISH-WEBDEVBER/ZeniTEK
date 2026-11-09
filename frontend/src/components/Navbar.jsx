import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu, X, ArrowRight, ChevronDown, ChevronRight, FileText, Images, PlayCircle, MapPin, LayoutGrid, CheckCircle2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import useScrollLock, { useEscapeKey } from '../hooks/useScrollLock';
import LanguageWidget from './LanguageWidget';
import { PRODUCTS } from '../data/siteMap';
import { nodeTitle, nodeShortTitle, productImage, productThumb, DRYER_GROUPS, dryerModels } from '../data/productCatalog';

// Sub-products of a product area for the menus: its products and their own sub-products, in order
const menuChildren = (product) => (product.children || []).flatMap(c => [{ node: c, depth: 0 }, ...(c.children || []).map(g => ({ node: g, depth: 1 }))]);

// One product in the Products menu: its photo, and its name below it in blue (green on hover)
function MenuTile({ node, label, large = false, compact = false, onNavigate }) {
  return (
    <Link to={node.path} onClick={onNavigate} className="group min-h-0 min-w-0 flex flex-col gap-1.5">
      <span className="relative flex-1 min-h-0 rounded-xl overflow-hidden bg-slate-100 ring-1 ring-slate-200 group-hover:ring-2 group-hover:ring-[#23AC39] transition-shadow">
        <img
          src={large ? productImage(node) : productThumb(node)}
          alt=""
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </span>
      <span
        className={`shrink-0 font-bold text-[#002DC2] group-hover:text-[#1A822B] transition-colors ${
          compact ? 'text-xs xl:text-sm text-center whitespace-nowrap'
            : large ? 'text-sm xl:text-base leading-6'
            : 'text-xs leading-5 h-10 xl:text-sm xl:leading-6 xl:h-12 line-clamp-2'
        }`}
      >
        {label}
      </span>
    </Link>
  );
}

// Products menu, right-hand side: the hovered product area's products as large photo tiles that
// share the menu's height. Solar Dryer Models: the three sq.ft box dryers in the first row, the
// five tunnel dryers in the second.
function ProductMenuPanel({ product, onNavigate }) {
  const { t } = useLanguage();
  let content;
  if (product.id === 'solar-dryer') {
    content = DRYER_GROUPS.map(group => {
      const models = dryerModels(group.id);
      return (
        <div key={group.id} className="flex-1 min-h-0 flex flex-col gap-1.5">
          <p className="text-2xs xl:text-xs font-black uppercase tracking-wider text-[#1A822B]">{t(group.titleKey)}</p>
          <div className={`flex-1 min-h-0 grid grid-rows-1 gap-3 ${models.length > 3 ? 'grid-cols-5' : 'grid-cols-3'}`}>
            {models.map(model => <MenuTile key={model.id} node={model} label={nodeShortTitle(model, t)} compact onNavigate={onNavigate} />)}
          </div>
        </div>
      );
    });
  } else if (product.children) {
    // every product and sub-product of the area, plus a tile for the area's own page
    const nodes = menuChildren(product).map(({ node }) => node);
    const rows = nodes.length > 3 ? 2 : 1;
    const cols = rows === 2 ? 'grid-cols-3' : nodes.length === 3 ? 'grid-cols-3' : 'grid-cols-2';
    const ProductIcon = product.icon;
    content = (
      <div className={`flex-1 min-h-0 grid gap-3 ${cols} ${rows === 2 ? 'grid-rows-2' : 'grid-rows-1'}`}>
        {nodes.map(node => <MenuTile key={node.id} node={node} label={nodeTitle(node, t)} large={rows === 1} onNavigate={onNavigate} />)}
        {rows === 2 && nodes.length % 3 !== 0 && (
          <Link
            to={product.path}
            onClick={onNavigate}
            className="group min-h-0 rounded-xl border-2 border-dashed border-[#002DC2]/25 bg-[#F0F4FD] hover:bg-[#E3EAFC] flex flex-col items-center justify-center gap-2 p-3 text-center transition-colors"
          >
            <span className="w-11 h-11 rounded-xl bg-[#002DC2] text-white flex items-center justify-center"><ProductIcon className="w-6 h-6" /></span>
            <span className="text-sm font-extrabold text-[#123B92]">{t(product.key)}</span>
            <span className="inline-flex items-center gap-1.5 text-sm font-bold text-[#002DC2]">
              {t('prod_explore')} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        )}
      </div>
    );
  } else {
    // a product without sub-products (Solar Water Heater): its photo and its key facts
    content = (
      <div className="flex-1 min-h-0 grid grid-cols-2 grid-rows-1 gap-6">
        <MenuTile node={product} label={t(product.key)} large onNavigate={onNavigate} />
        <div className="flex flex-col justify-center gap-3">
          <p className="text-base text-slate-600 leading-relaxed">{t(product.shortKey)}</p>
          {product.points && (
            <ul className="space-y-2">
              {product.points.map(key => (
                <li key={key} className="flex items-start gap-2.5 text-sm font-bold text-[#123B92]">
                  <CheckCircle2 className="w-5 h-5 text-[#23AC39] shrink-0" />
                  <span>{t(key)}</span>
                </li>
              ))}
            </ul>
          )}
          <Link
            to={product.path}
            onClick={onNavigate}
            className="self-start inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#002DC2] hover:bg-[#123B92] text-white text-sm font-extrabold transition-colors"
          >
            {t('cat_viewProduct')} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="h-full flex flex-col gap-3">
      <Link
        to={product.path}
        onClick={onNavigate}
        className="group self-start inline-flex items-center gap-2 text-lg xl:text-xl font-black text-[#123B92] hover:text-[#002DC2] transition-colors"
      >
        {t(product.key)}
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </Link>
      {content}
    </div>
  );
}

export default function Navbar({ onOpenQuoteModal, animStage = 3 }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);
  const [galleryDropdownOpen, setGalleryDropdownOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [mobileGalleryOpen, setMobileGalleryOpen] = useState(false);
  // Product area shown in the right-hand panel of the Products menu (follows the hovered area)
  const [menuProductId, setMenuProductId] = useState(PRODUCTS[0].id);
  const menuProduct = PRODUCTS.find(p => p.id === menuProductId) || PRODUCTS[0];

  const navigate = useNavigate();
  const productsRef = useRef(null);
  const galleryRef = useRef(null);
  const timeoutRef = useRef(null);
  const productsPanelRef = useRef(null);
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
  useEscapeKey(productsDropdownOpen || galleryDropdownOpen, () => { setProductsDropdownOpen(false); setGalleryDropdownOpen(false); });

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
      const inProducts = [productsRef.current, productsPanelRef.current].some(el => el && el.contains(e.target));
      if (!inProducts) {
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

  // Gallery menu: one entry per Gallery tab
  const galleryDropdownItems = [
    { nameKey: 'media_tabProducts', path: '/gallery?tab=products', icon: Images },
    { nameKey: 'media_tabVideos', path: '/gallery?tab=videos', icon: PlayCircle },
    { nameKey: 'media_tabSites', path: '/gallery?tab=sites', icon: MapPin },
    { nameKey: 'media_tabBrochures', path: '/gallery?tab=brochures', icon: FileText },
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
              src="/images/brand/logo.webp"
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
                  className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-2 z-50 animate-fade-in space-y-0.5"
                  onMouseEnter={handleGalleryEnter}
                  onMouseLeave={handleGalleryLeave}
                >
                  {galleryDropdownItems.map((item) => {
                    const ItemIcon = item.icon;
                    return (
                      <Link
                        key={item.nameKey}
                        to={item.path}
                        onClick={() => setGalleryDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:text-[#002DC2] hover:bg-[#F0F4FD] transition-colors"
                      >
                        <ItemIcon className="w-5 h-5 text-[#002DC2] shrink-0" />
                        <span>{t(item.nameKey)}</span>
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

      {/* Dimmed backdrop below the navbar while a menu is open (positioned against the header, so it
          starts under it even when the menu wraps onto a second row and never covers the menu buttons) */}
      {(productsDropdownOpen || galleryDropdownOpen) && (
        <div
          className="hidden lg:block absolute inset-x-0 top-full h-screen bg-black/40 backdrop-blur-[1px] z-30"
          onClick={() => {
            setProductsDropdownOpen(false);
            setGalleryDropdownOpen(false);
          }}
        />
      )}

      {/* PRODUCTS MENU: centred under the navbar, 80% of the screen width and 60% of its height. The four
          product areas on the left; the hovered area's products as photo tiles, each named below. */}
      {productsDropdownOpen && (
        <div
          ref={productsPanelRef}
          className="hidden lg:block absolute inset-x-0 top-full mx-auto mt-2 w-[80vw] h-[60vh] min-h-[400px] bg-white rounded-3xl border border-slate-200 shadow-2xl z-50 overflow-hidden"
          onMouseEnter={handleProductsEnter}
          onMouseLeave={handleProductsLeave}
        >
          <div className="h-full px-5 xl:px-7 py-5 flex gap-5 xl:gap-7">
            <div className="w-52 xl:w-60 shrink-0 flex flex-col gap-2">
              <ul className="space-y-1">
                {PRODUCTS.map((product) => {
                  const active = product.id === menuProduct.id;
                  const Icon = product.icon;
                  return (
                    <li key={product.id}>
                      <Link
                        to={product.path}
                        onMouseEnter={() => setMenuProductId(product.id)}
                        onFocus={() => setMenuProductId(product.id)}
                        onClick={() => setProductsDropdownOpen(false)}
                        className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-sm xl:text-base font-bold transition-colors ${
                          active ? 'bg-[#F0F4FD] text-[#002DC2] ring-1 ring-[#002DC2]/20' : 'text-slate-700 hover:bg-slate-50 hover:text-[#002DC2]'
                        }`}
                      >
                        <span className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${active ? 'bg-[#002DC2] text-white' : 'bg-slate-100 text-[#002DC2]'}`}>
                          <Icon className="w-5 h-5" />
                        </span>
                        <span className="flex-1 leading-snug">{t(product.key)}</span>
                        <ChevronRight className={`w-5 h-5 shrink-0 ${active ? 'text-[#002DC2]' : 'text-slate-300'}`} />
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <Link
                to="/products"
                onClick={() => setProductsDropdownOpen(false)}
                className="mt-auto flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-[#002DC2]/25 text-sm font-bold text-[#002DC2] hover:bg-[#F0F4FD] transition-colors"
              >
                <LayoutGrid className="w-4 h-4" /> {t('site_viewAllProducts')}
              </Link>
            </div>
            <div className="flex-1 min-w-0 border-l border-slate-100 pl-5 xl:pl-7">
              <ProductMenuPanel product={menuProduct} onNavigate={() => setProductsDropdownOpen(false)} />
            </div>
          </div>
        </div>
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
                {PRODUCTS.map((product) => {
                  const Icon = product.icon;
                  const chip = 'px-2.5 py-1.5 rounded-md bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 hover:border-[#002DC2] hover:text-[#002DC2] transition-colors';
                  return (
                    <div key={product.path} className="rounded-lg bg-white border border-slate-200/60">
                      <Link
                        to={product.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-bold text-[#123B92] hover:text-[#002DC2] transition-colors"
                      >
                        <Icon className="w-5 h-5 text-[#002DC2] shrink-0" />
                        <span className="flex-1">{t(product.key)}</span>
                        <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                      </Link>
                      {product.id === 'solar-dryer' ? (
                        <div className="px-3 pb-3 space-y-2">
                          {DRYER_GROUPS.map(group => (
                            <div key={group.id}>
                              <p className="text-2xs font-black uppercase tracking-wider text-slate-400 mb-1">{t(group.titleKey)}</p>
                              <div className="flex flex-wrap gap-1.5">
                                {dryerModels(group.id).map(model => (
                                  <Link key={model.id} to={model.path} onClick={() => setMobileMenuOpen(false)} className={chip}>
                                    {nodeShortTitle(model, t)}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : product.children && (
                        <div className="flex flex-wrap gap-1.5 px-3 pb-3">
                          {menuChildren(product).map(({ node }) => (
                            <Link key={node.id} to={node.path} onClick={() => setMobileMenuOpen(false)} className={chip}>
                              {nodeTitle(node, t)}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
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
                    key={item.nameKey}
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
