import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { m, AnimatePresence, LazyMotion } from 'framer-motion';
import {
  Menu, X, ArrowRight, ChevronDown, ChevronRight, FileText, Images, PlayCircle, Play, MapPin, LayoutGrid, CheckCircle2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import useScrollLock, { useEscapeKey } from '../hooks/useScrollLock';
import LanguageWidget from './LanguageWidget';
import { PRODUCTS } from '../data/siteMap';
import { nodeTitle, nodeShortTitle, productImage, productThumb, DRYER_GROUPS, dryerModels } from '../data/productCatalog';
import { PRODUCT_PHOTOS, PRODUCT_VIDEOS } from '../data/productMedia';
import { zenitekRealGallery } from '../data/zenitekRealGalleryData';
import { brochures } from '../data/brochuresData';
import { scrollToTop } from '../motion/core';

// Framer Motion's animation code loads in its own small file after the first paint
const loadMotionFeatures = () => import('../motion/framerFeatures').then(mod => mod.default);

const PRODUCT_PHOTO_COUNT = Object.values(PRODUCT_PHOTOS).reduce((n, list) => n + list.length, 0);

// Gallery menu, right-hand side: a large preview of the hovered Gallery section
function GalleryMenuPreview({ item, onNavigate }) {
  const { t } = useLanguage();
  return (
    <Link to={item.path} onClick={onNavigate} className="menu-in group flex-1 min-w-0 flex flex-col gap-2">
      {item.id === 'brochures' ? (
        // the brochures as three PDF covers (real product photos), fanned out
        <span className="relative flex-1 min-h-[250px] rounded-2xl overflow-hidden bg-gradient-to-br from-[#F0F4FD] to-[#EAF7EC] ring-1 ring-slate-200 group-hover:ring-2 group-hover:ring-[#23AC39] transition-shadow">
          {brochures.slice(0, 3).map((b, i) => (
            <span
              key={b.id}
              style={{ transform: `translate(-50%, -50%) rotate(${(i - 1) * 10}deg)`, left: `${28 + i * 22}%`, zIndex: i === 1 ? 2 : 1 }}
              className="absolute top-1/2 w-[38%] aspect-[3/4] bg-white rounded-lg shadow-xl p-1.5 flex flex-col group-hover:scale-105 transition-transform duration-500"
            >
              <img src={b.cover} alt="" className="flex-1 min-h-0 w-full object-cover rounded" />
              <span className={`mt-1 items-center justify-center gap-1 text-2xs font-black text-[#123B92] ${i === 1 ? 'inline-flex' : 'invisible inline-flex'}`}>
                <FileText className="w-3 h-3" /> PDF
              </span>
            </span>
          ))}
        </span>
      ) : (
        <span className="relative flex-1 min-h-[250px] rounded-2xl overflow-hidden bg-slate-100 ring-1 ring-slate-200 group-hover:ring-2 group-hover:ring-[#23AC39] transition-shadow">
          <img src={item.image} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          {item.id === 'videos' && (
            <span className="absolute inset-0 flex items-center justify-center bg-black/15">
              <span className="w-16 h-16 rounded-full bg-white/90 text-[#002DC2] flex items-center justify-center shadow-lg">
                <Play className="w-8 h-8 ml-1" fill="currentColor" />
              </span>
            </span>
          )}
        </span>
      )}
      <span className="inline-flex items-center gap-1.5 text-sm font-bold text-[#002DC2] group-hover:text-[#1A822B] transition-colors">
        {t(item.nameKey)} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </span>
    </Link>
  );
}

const MENU_EASE = [0.22, 1, 0.36, 1];
// Menus open with a short fade + lift and close a little faster
const menuMotion = {
  initial: { opacity: 0, y: -8, scale: 0.985 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.28, ease: MENU_EASE } },
  exit: { opacity: 0, y: -6, scale: 0.985, transition: { duration: 0.16, ease: 'easeIn' } },
};
// Mobile menu and its sections fold open and closed
const foldMotion = {
  initial: { height: 0, opacity: 0 },
  animate: { height: 'auto', opacity: 1, transition: { duration: 0.32, ease: MENU_EASE } },
  exit: { height: 0, opacity: 0, transition: { duration: 0.22, ease: 'easeInOut' } },
};

// The highlight behind the hovered (or current) desktop menu item; it glides from item to item
function NavPill() {
  return (
    <m.span
      layoutId="nav-pill"
      aria-hidden="true"
      className="absolute inset-0 -z-10 rounded-[inherit] bg-[#F0F4FD] ring-1 ring-[#002DC2]/20 shadow-sm"
      transition={{ type: 'spring', stiffness: 520, damping: 40, mass: 0.6 }}
    />
  );
}

// Sub-products of a product area for the menus: its products and their own sub-products, in order
const menuChildren = (product) => (product.children || []).flatMap(c => [{ node: c, depth: 0 }, ...(c.children || []).map(g => ({ node: g, depth: 1 }))]);

// One product in the Products menu: its photo, and its name below it in blue (green on hover)
function MenuTile({ node, label, large = false, compact = false, index = 0, onNavigate }) {
  return (
    <Link to={node.path} onClick={onNavigate} style={{ '--i': index }} className="menu-in group min-h-0 min-w-0 flex flex-col gap-1.5">
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
            {models.map((model, i) => <MenuTile key={model.id} node={model} label={nodeShortTitle(model, t)} compact index={i + (group.id === 'tunnel' ? 3 : 0)} onNavigate={onNavigate} />)}
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
        {nodes.map((node, i) => <MenuTile key={node.id} node={node} label={nodeTitle(node, t)} large={rows === 1} index={i} onNavigate={onNavigate} />)}
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
  // Gallery section previewed on the right of the Gallery menu (follows the hovered entry)
  const [galleryItemId, setGalleryItemId] = useState('products');
  // Desktop menu item under the pointer (the highlight follows it)
  const [navHover, setNavHover] = useState(null);

  const navigate = useNavigate();
  const productsRef = useRef(null);
  const galleryRef = useRef(null);
  const timeoutRef = useRef(null);
  const productsPanelRef = useRef(null);
  const headerRef = useRef(null);

  // Once the page scrolls the bar gets a stronger shadow. Only the crossing of the threshold is
  // written to the DOM, so scrolling itself does no work here. (The reading-progress line along the
  // bar's bottom is driven by CSS alone - index.css .scroll-progress.)
  // While the page is scrolling, html gets .is-scrolling (card hover effects wait until it stops).
  useEffect(() => {
    let scrolled = null;
    let scrolling = false;
    let idleTimer = 0;
    const root = document.documentElement;
    const onScroll = () => {
      if (!scrolling) { scrolling = true; root.classList.add('is-scrolling'); }
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => { scrolling = false; root.classList.remove('is-scrolling'); }, 160);
      const now = window.scrollY > 8;
      if (now === scrolled || !headerRef.current) return;
      scrolled = now;
      headerRef.current.dataset.scrolled = now ? 'true' : 'false';
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      clearTimeout(idleTimer);
      root.classList.remove('is-scrolling');
      window.removeEventListener('scroll', onScroll);
    };
  }, []);
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

  // Gallery menu: one entry per Gallery tab - its size and a preview picture for the desktop menu
  const galleryDropdownItems = [
    { id: 'products', nameKey: 'media_tabProducts', path: '/gallery?tab=products', icon: Images, image: '/images/products/solar-dryer/dryer-50/dryer-50-01-sm.webp', count: t('media_photos', { count: PRODUCT_PHOTO_COUNT }) },
    { id: 'videos', nameKey: 'media_tabVideos', path: '/gallery?tab=videos', icon: PlayCircle, image: '/videos/rose-petal-drying.webp', count: t('media_videosCount', { count: PRODUCT_VIDEOS.length }) },
    { id: 'sites', nameKey: 'media_tabSites', path: '/gallery?tab=sites', icon: MapPin, image: '/images/gallery/photo-43.webp', count: t('media_photos', { count: zenitekRealGallery.length }) },
    { id: 'brochures', nameKey: 'media_tabBrochures', path: '/gallery?tab=brochures', icon: FileText, count: t('media_brochuresCount', { count: brochures.length }) },
  ];
  const galleryPreview = galleryDropdownItems.find(item => item.id === galleryItemId) || galleryDropdownItems[0];

  const productRoutes = ['/products', '/dryers', ...PRODUCTS.map(p => p.path)];

  const isSubsidiesActive = location.pathname === '/subsidies';
  const isProductsActive = productRoutes.some(p => location.pathname === p || location.pathname.startsWith(p + '/'));
  const isGalleryActive = location.pathname.startsWith('/gallery');
  const isAboutActive = location.pathname === '/about';
  const isContactActive = location.pathname === '/contact';
  const currentItem = location.pathname === '/' ? 'home' : isProductsActive ? 'products' : isGalleryActive ? 'gallery'
    : isSubsidiesActive ? 'subsidies' : isAboutActive ? 'about' : isContactActive ? 'contact' : null;
  const pillItem = navHover || (productsDropdownOpen ? 'products' : galleryDropdownOpen ? 'gallery' : currentItem);
  const itemCls = (key) => `${navItemCls} relative z-0 font-bold transition-colors duration-200 whitespace-nowrap ${
    pillItem === key ? 'text-[#002DC2]' : 'text-slate-700 hover:text-[#002DC2]'
  }`;
  const hoverProps = (key) => ({
    onMouseEnter: () => setNavHover(key),
    onFocus: () => setNavHover(key),
    onBlur: () => setNavHover(null),
  });

  return (
    <LazyMotion features={loadMotionFeatures}>
    <header ref={headerRef} data-scrolled="false" className="sticky top-0 z-40 relative bg-white shadow-sm w-full border-b border-slate-100">
      
      {/* MAIN NAVBAR CONTAINER */}
      <div className={`w-full px-5 sm:px-8 ${density === 0 ? 'md:px-[60px]' : 'lg:px-6'}`}>
        <div ref={rowRef} className={`nav-intro flex flex-wrap items-center justify-between w-full h-14 sm:h-16 ${twoRow ? 'lg:h-auto lg:py-2' : 'lg:h-[68px]'}`}>
          
          {/* Logo - Stage 1 Animation */}
          <Link
            to="/"
            aria-label="ZeniTEK - Home"
            onClick={() => {
              // Already on Home: the route doesn't change, so jump back to the top
              setMobileMenuOpen(false);
              scrollToTop({ smooth: true });
            }}
            className={`flex items-center shrink-0 transition-[opacity,transform] duration-700 ease-out transform ${
              animStage >= 1
                ? 'opacity-100 scale-100 translate-x-0'
                : 'opacity-0 scale-90 -translate-x-6 pointer-events-none'
            }`}
          >
            <img
              src="/images/brand/logo.webp"
              width={600}
              height={176}
              onLoad={() => setFontTick(n => n + 1)}
              alt="ZeniTEK - Towards Sustainable Future"
              className="h-9 xs:h-10 sm:h-11 md:h-12 lg:h-[52px] xl:h-14 w-auto object-contain py-0.5"
            />
          </Link>

          {/* Desktop Nav Items - Stage 2 Animation */}
          <nav
            onMouseLeave={() => setNavHover(null)}
            className={`hidden lg:flex relative z-40 items-center ${twoRow ? 'order-last w-full justify-center flex-wrap gap-y-1 mt-2 pt-2 border-t border-slate-100 space-x-1' : density === 0 ? 'space-x-1 xl:space-x-2 2xl:space-x-3' : 'space-x-0.5'} transition-[opacity,transform] duration-700 ease-out transform ${
              animStage >= 2
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 -translate-y-4 scale-95 pointer-events-none'
            }`}
          >
            {/* 1. HOME */}
            <Link to="/" {...hoverProps('home')} className={itemCls('home')}>
              {pillItem === 'home' && <NavPill />}
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
                {...hoverProps('products')}
                aria-expanded={productsDropdownOpen}
                className={`${itemCls('products')} flex items-center space-x-1.5 cursor-pointer`}
              >
                {pillItem === 'products' && <NavPill />}
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
                {...hoverProps('gallery')}
                aria-expanded={galleryDropdownOpen}
                className={`${itemCls('gallery')} flex items-center space-x-1.5 cursor-pointer`}
              >
                {pillItem === 'gallery' && <NavPill />}
                <span>{t('navGallery')}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${galleryDropdownOpen ? 'rotate-180 text-[#002DC2]' : 'text-slate-500'}`} />
              </button>

              {/* GALLERY MENU: the four Gallery sections (name + size) on the left; a large preview of the
                  hovered section on the right */}
              <AnimatePresence>
              {galleryDropdownOpen && (
                <m.div
                  key="gallery-menu"
                  {...menuMotion}
                  style={{ transformOrigin: 'top left' }}
                  className="absolute top-full left-0 mt-2 w-[620px] bg-white rounded-3xl shadow-2xl border border-slate-200 p-4 z-50 flex gap-4"
                  onMouseEnter={handleGalleryEnter}
                  onMouseLeave={handleGalleryLeave}
                >
                  <ul className="w-[250px] shrink-0 space-y-1">
                    {galleryDropdownItems.map((item) => {
                      const ItemIcon = item.icon;
                      const active = item.id === galleryPreview.id;
                      return (
                        <li key={item.id}>
                          <Link
                            to={item.path}
                            onMouseEnter={() => setGalleryItemId(item.id)}
                            onFocus={() => setGalleryItemId(item.id)}
                            onClick={() => setGalleryDropdownOpen(false)}
                            className={`flex items-center gap-3 px-3 py-3 rounded-2xl transition-colors ${
                              active ? 'bg-[#F0F4FD] ring-1 ring-[#002DC2]/20' : 'hover:bg-slate-50'
                            }`}
                          >
                            <span className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${active ? 'bg-[#002DC2] text-white' : 'bg-slate-100 text-[#002DC2]'}`}>
                              <ItemIcon className="w-5 h-5" />
                            </span>
                            <span className="flex-1 min-w-0">
                              <span className="block text-sm font-bold text-[#002DC2] leading-snug">{t(item.nameKey)}</span>
                              <span className="block text-xs font-semibold text-[#1A822B]">{item.count}</span>
                            </span>
                            <ChevronRight className={`w-4 h-4 shrink-0 ${active ? 'text-[#002DC2]' : 'text-slate-300'}`} />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                  <GalleryMenuPreview key={galleryPreview.id} item={galleryPreview} onNavigate={() => setGalleryDropdownOpen(false)} />
                </m.div>
              )}
              </AnimatePresence>
            </div>

            {/* 4. SUBSIDIES */}
            <Link to="/subsidies" {...hoverProps('subsidies')} className={`${itemCls('subsidies')} flex items-center space-x-1`}>
              {pillItem === 'subsidies' && <NavPill />}
              <span>{t('navbar_subsidies')}</span>
            </Link>

            {/* 5. ABOUT US */}
            <Link to="/about" {...hoverProps('about')} className={`${itemCls('about')}`}>
              {pillItem === 'about' && <NavPill />}
              {t('navAbout')}
            </Link>

            {/* 6. CONTACT US */}
            <Link to="/contact" {...hoverProps('contact')} className={`${itemCls('contact')}`}>
              {pillItem === 'contact' && <NavPill />}
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
              className={`px-3.5 py-1.5 sm:px-4 sm:py-2 ${density >= 2 ? 'lg:px-3' : 'lg:px-[18px]'} lg:py-2 text-xs sm:text-sm font-extrabold uppercase tracking-wide text-white bg-[#1A822B] hover:bg-[#166A26] rounded-xl shadow-md shadow-[#23AC39]/20 transition-[background-color,box-shadow,transform] flex items-center shrink-0 cursor-pointer hover:shadow-lg active:scale-95`}
            >
              <span className="whitespace-nowrap">{t('getQuote')}</span>
              {density < 2 && <ArrowRight className="w-4 h-4 ml-1.5 shrink-0" />}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              className={`lg:hidden p-2 rounded-xl text-[#123B92] hover:bg-[#F0F4FD] border border-[#123B92]/20 shrink-0 transition-colors cursor-pointer`}
              aria-label={t('navbar_toggleMenu')}
            >
              <AnimatePresence mode="wait" initial={false}>
                <m.span
                  key={mobileMenuOpen ? 'close' : 'open'}
                  className="block"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </m.span>
              </AnimatePresence>
            </button>
          </div>

        </div>
      </div>

      {/* Dimmed backdrop below the navbar while a menu is open (positioned against the header, so it
          starts under it even when the menu wraps onto a second row and never covers the menu buttons) */}
      <AnimatePresence>
      {(productsDropdownOpen || galleryDropdownOpen) && (
        <m.div
          key="menu-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.25 } }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          className="hidden lg:block absolute inset-x-0 top-full h-screen bg-black/40 z-30"
          onClick={() => {
            setProductsDropdownOpen(false);
            setGalleryDropdownOpen(false);
          }}
        />
      )}
      </AnimatePresence>

      {/* PRODUCTS MENU: centred under the navbar, 80% of the screen width and 70% of its height. The four
          product areas on the left; the hovered area's products as photo tiles, each named below. */}
      <AnimatePresence>
      {productsDropdownOpen && (
        <m.div
          key="products-menu"
          ref={productsPanelRef}
          {...menuMotion}
          style={{ transformOrigin: 'top center' }}
          className="hidden lg:block absolute inset-x-0 top-full mx-auto mt-2 w-[80vw] h-[70vh] min-h-[440px] bg-white rounded-3xl border border-slate-200 shadow-2xl z-50 overflow-hidden"
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
              <ProductMenuPanel key={menuProduct.id} product={menuProduct} onNavigate={() => setProductsDropdownOpen(false)} />
            </div>
          </div>
        </m.div>
      )}
      </AnimatePresence>

      {/* MOBILE MENU ACCORDION DRAWER */}
      <AnimatePresence>
      {mobileMenuOpen && (
        <m.div key="mobile-menu" {...foldMotion} className="lg:hidden bg-white border-t border-slate-200 shadow-2xl w-full overflow-hidden">
        <div className="menu-stagger p-4 space-y-1 max-h-[85vh] overflow-y-auto overscroll-contain">
          
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

            <AnimatePresence initial={false}>
            {mobileProductsOpen && (
              <m.div key="m-products" {...foldMotion} className="overflow-hidden">
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
                              <p className="text-2xs font-black uppercase tracking-wider text-slate-500 mb-1">{t(group.titleKey)}</p>
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
              </m.div>
            )}
            </AnimatePresence>
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

            <AnimatePresence initial={false}>
            {mobileGalleryOpen && (
              <m.div key="m-gallery" {...foldMotion} className="overflow-hidden">
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
              </m.div>
            )}
            </AnimatePresence>
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
              className="w-full py-3.5 text-center text-xs font-black uppercase tracking-wider text-white bg-[#1A822B] hover:bg-[#166A26] rounded-xl shadow cursor-pointer transition-all flex items-center justify-center space-x-2"
            >
              <span>{t('getQuote')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
        </m.div>
      )}
      </AnimatePresence>

      {/* Reading progress */}
      <div className="scroll-progress" aria-hidden="true" />
    </header>
    </LazyMotion>
  );
}
