import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, X, ArrowRight, ChevronDown, Sun, Zap, Sprout, Cpu, 
  Sparkles, FileText, Image as ImageIcon, Landmark, Info, PhoneCall 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar({ onOpenQuoteModal, animStage = 3 }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);
  const [galleryDropdownOpen, setGalleryDropdownOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [mobileGalleryOpen, setMobileGalleryOpen] = useState(false);

  const productsRef = useRef(null);
  const galleryRef = useRef(null);
  const timeoutRef = useRef(null);
  const location = useLocation();
  const { t } = useLanguage();

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

  // Tesla-style Mega Menu Product Grid Items (4 columns x 2 rows)
  const megaMenuProducts = [
    {
      name: "SOLDRY 1210",
      image: "/real-photos/zenitek_photo_04.jpeg",
      learnPath: "/dryers",
      modelCode: "SOLDRY 1210",
      learnText: "Learn",
      orderText: "Order"
    },
    {
      name: "SOLDRY 1709",
      image: "/real-photos/zenitek_photo_18.jpeg",
      learnPath: "/dryers",
      modelCode: "SOLDRY 1709",
      learnText: "Learn",
      orderText: "Order"
    },
    {
      name: "SOLDRY 300",
      image: "/real-photos/zenitek_photo_21.jpeg",
      learnPath: "/dryers",
      modelCode: "SOLDRY 1210 - 300",
      learnText: "Learn",
      orderText: "Order"
    },
    {
      name: "Full Automation",
      subtitle: "(PLC / HMI)",
      image: "/real-photos/zenitek_photo_23.jpeg",
      learnPath: "/dryers#thermal",
      modelCode: "Full Automation PLC/HMI System",
      learnText: "Learn",
      orderText: "Experience"
    },
    {
      name: "Inventory Fleet",
      image: "/real-photos/zenitek_photo_26.jpeg",
      learnPath: "/dryers",
      modelCode: "Commercial Multi-Unit Plant",
      learnText: "New",
      orderText: "Certified"
    },
    {
      name: "SUNDRY 50",
      image: "/real-photos/zenitek_photo_27.jpeg",
      learnPath: "/dryers",
      modelCode: "SUNDRY 50",
      learnText: "Learn",
      orderText: "Order"
    },
    {
      name: "SUNDRY 12",
      image: "/real-photos/zenitek_photo_25.jpeg",
      learnPath: "/dryers",
      modelCode: "SUNDRY 12",
      learnText: "Learn",
      orderText: "Order"
    },
    {
      name: "SUNDRY 6",
      image: "/real-photos/zenitek_photo_01.jpeg",
      learnPath: "/dryers",
      modelCode: "SUNDRY 6",
      learnText: "Learn",
      orderText: "Order"
    }
  ];

  // Tesla-style right side quick navigation links
  const megaMenuSideLinks = [
    { name: "Solar Dryers Overview", path: "/dryers" },
    { name: "Solar Thermal System", path: "/dryers#thermal" },
    { name: "Agri-Solar Innovation", path: "/applications" },
    { name: "Photovoltaic Solutions", path: "/dryers#pv-solutions" },
    { name: "Research & Development", path: "/about#rnd" },
    { name: "Government Subsidies (40% - 60%)", path: "/subsidies" },
    { name: "Compare Dryer Models", path: "/dryers" },
    { name: "Commercial ROI Calculator", path: "/#calculator" },
    { name: "Crop Preservation Guide", path: "/applications" },
    { name: "Technical Spec Sheets", path: "/gallery?cat=brochure" },
    { name: "Schedule Farm Demo", path: "/contact" }
  ];

  const productDropdownItems = [
    {
      name: "Solar Dryers",
      path: "/dryers",
      icon: Sun,
      desc: "Walk-In Tunnels & Box Dryers"
    },
    {
      name: "Solar Thermal System",
      path: "/dryers#thermal",
      icon: Zap,
      desc: "High-Efficiency Thermal Collectors"
    },
    {
      name: "Agri-Solar Innovation",
      path: "/applications",
      icon: Sprout,
      desc: "Post-Harvest Crop Preservation"
    },
    {
      name: "Photovoltaic Solutions",
      path: "/dryers#pv-solutions",
      icon: Cpu,
      desc: "Solar PV Hybrid & Off-Grid Kits"
    },
    {
      name: "Research & Development",
      path: "/about#rnd",
      icon: Sparkles,
      desc: "Patented Aerodynamic Engineering"
    }
  ];

  const galleryDropdownItems = [
    {
      name: "Brochure",
      path: "/gallery?cat=brochure",
      icon: FileText,
      desc: "Official Technical PDF Pages"
    },
    {
      name: "Images",
      path: "/gallery?cat=all",
      icon: ImageIcon,
      desc: "Authentic Real Field Photos"
    }
  ];

  const isProductsActive = location.pathname.startsWith('/dryers') || location.pathname.startsWith('/applications');
  const isGalleryActive = location.pathname.startsWith('/gallery');
  const isSubsidiesActive = location.pathname === '/subsidies';
  const isAboutActive = location.pathname === '/about';
  const isContactActive = location.pathname === '/contact';

  return (
    <header className="sticky top-0 z-40 relative bg-white/95 backdrop-blur-md shadow-xs w-full transition-colors duration-500">
      
      {/* MAIN NAVBAR CONTAINER */}
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
            className={`hidden lg:flex items-center space-x-1 xl:space-x-2 2xl:space-x-3 transition-all duration-700 ease-out transform ${
              animStage >= 2
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 -translate-y-4 scale-95 pointer-events-none'
            }`}
          >
            {/* 1. HOME */}
            <Link
              to="/"
              className={`px-3 py-2 rounded-xl text-[14px] xl:text-[15px] font-bold transition-all duration-200 whitespace-nowrap ${
                location.pathname === '/'
                  ? 'text-[#002DC2] bg-[#F0F4FD] border border-[#002DC2]/20 shadow-xs'
                  : 'text-slate-700 hover:text-[#002DC2] hover:bg-slate-100'
              }`}
            >
              {t('navHome')}
            </Link>

            {/* 2. PRODUCTS (DROPDOWN MENU) */}
            {/* 2. PRODUCTS (TESLA MEGA MENU) */}
            <div 
              ref={productsRef}
              className="static"
              onMouseEnter={handleProductsEnter}
              onMouseLeave={handleProductsLeave}
            >
              <button
                type="button"
                onClick={() => {
                  setGalleryDropdownOpen(false);
                  setProductsDropdownOpen(!productsDropdownOpen);
                }}
                className={`px-3 py-2 rounded-xl text-[14px] xl:text-[15px] font-bold transition-all duration-200 whitespace-nowrap flex items-center space-x-1.5 cursor-pointer ${
                  isProductsActive || productsDropdownOpen
                    ? 'text-[#002DC2] bg-[#F0F4FD] border border-[#002DC2]/20 shadow-xs'
                    : 'text-slate-700 hover:text-[#002DC2] hover:bg-slate-100'
                }`}
              >
                <span>Products</span>
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
                onClick={() => {
                  setProductsDropdownOpen(false);
                  setGalleryDropdownOpen(!galleryDropdownOpen);
                }}
                className={`px-3 py-2 rounded-xl text-[14px] xl:text-[15px] font-bold transition-all duration-200 whitespace-nowrap flex items-center space-x-1.5 cursor-pointer ${
                  isGalleryActive || galleryDropdownOpen
                    ? 'text-[#002DC2] bg-[#F0F4FD] border border-[#002DC2]/20 shadow-xs'
                    : 'text-slate-700 hover:text-[#002DC2] hover:bg-slate-100'
                }`}
              >
                <span>Gallery</span>
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
                        key={item.name}
                        to={item.path}
                        onClick={() => setGalleryDropdownOpen(false)}
                        className="flex items-start space-x-3 p-2.5 rounded-xl hover:bg-[#F0F4FD] transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-[#F0F4FD] group-hover:bg-[#002DC2] text-[#002DC2] group-hover:text-white flex items-center justify-center shrink-0 transition-colors mt-0.5">
                          <ItemIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900 group-hover:text-[#002DC2] transition-colors">
                            {item.name}
                          </div>
                          <div className="text-[11px] text-slate-500 font-medium leading-tight">
                            {item.desc}
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
              className={`px-3 py-2 rounded-xl text-[14px] xl:text-[15px] font-bold transition-all duration-200 whitespace-nowrap flex items-center space-x-1 ${
                isSubsidiesActive
                  ? 'text-[#002DC2] bg-[#F0F4FD] border border-[#002DC2]/20 shadow-xs'
                  : 'text-slate-700 hover:text-[#002DC2] hover:bg-slate-100'
              }`}
            >
              <span>Subsidies</span>
            </Link>

            {/* 5. ABOUT US */}
            <Link
              to="/about"
              className={`px-3 py-2 rounded-xl text-[14px] xl:text-[15px] font-bold transition-all duration-200 whitespace-nowrap ${
                isAboutActive
                  ? 'text-[#002DC2] bg-[#F0F4FD] border border-[#002DC2]/20 shadow-xs'
                  : 'text-slate-700 hover:text-[#002DC2] hover:bg-slate-100'
              }`}
            >
              {t('navAbout')}
            </Link>

            {/* 6. CONTACT US */}
            <Link
              to="/contact"
              className={`px-3 py-2 rounded-xl text-[14px] xl:text-[15px] font-bold transition-all duration-200 whitespace-nowrap ${
                isContactActive
                  ? 'text-[#002DC2] bg-[#F0F4FD] border border-[#002DC2]/20 shadow-xs'
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
              className="lg:hidden p-2 rounded-xl text-[#123B92] hover:bg-[#F0F4FD] border border-[#123B92]/20 shrink-0 transition-colors cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* TESLA-STYLE FULL-WIDTH PRODUCTS MEGA MENU */}
      {productsDropdownOpen && (
        <div 
          className="hidden lg:block absolute top-full left-0 right-0 w-full bg-white border-b border-slate-200 shadow-2xl z-50 animate-fade-in"
          onMouseEnter={handleProductsEnter}
          onMouseLeave={handleProductsLeave}
        >
          <div className="max-w-7xl mx-auto px-8 xl:px-12 py-8 xl:py-10">
            <div className="grid grid-cols-12 gap-8 xl:gap-12 items-start">
              
              {/* Left 4-column product grid (4 columns x 2 rows) */}
              <div className="col-span-9 xl:col-span-10">
                <div className="grid grid-cols-4 gap-x-6 gap-y-7">
                  {megaMenuProducts.map((prod) => (
                    <div key={prod.name} className="flex flex-col items-center text-center group">
                      <Link
                        to={prod.learnPath}
                        onClick={() => setProductsDropdownOpen(false)}
                        className="w-full h-24 xl:h-28 flex items-center justify-center p-1 rounded-xl transition-all duration-300 group-hover:scale-105"
                      >
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="max-h-full max-w-full object-contain drop-shadow-sm group-hover:drop-shadow-md transition-all"
                        />
                      </Link>

                      <Link
                        to={prod.learnPath}
                        onClick={() => setProductsDropdownOpen(false)}
                        className="text-[14px] xl:text-[15px] font-bold text-slate-900 group-hover:text-[#002DC2] transition-colors mt-2"
                      >
                        {prod.name}
                      </Link>
                      {prod.subtitle && (
                        <div className="text-[11px] font-medium text-slate-400 -mt-0.5">
                          {prod.subtitle}
                        </div>
                      )}

                      <div className="flex items-center space-x-3 mt-1.5 text-[11px] xl:text-[12px] font-medium text-slate-500">
                        <Link
                          to={prod.learnPath}
                          onClick={() => setProductsDropdownOpen(false)}
                          className="underline underline-offset-4 decoration-slate-300 hover:decoration-slate-900 hover:text-slate-900 transition-colors"
                        >
                          {prod.learnText || 'Learn'}
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            setProductsDropdownOpen(false);
                            if (onOpenQuoteModal) onOpenQuoteModal({ capacityNeeded: prod.modelCode || prod.name });
                          }}
                          className="underline underline-offset-4 decoration-slate-300 hover:decoration-[#23AC39] hover:text-[#23AC39] transition-colors cursor-pointer"
                        >
                          {prod.orderText || 'Order'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Vertical Divider & Tesla-style Quick Links */}
              <div className="col-span-3 xl:col-span-2 border-l border-slate-200/90 pl-6 xl:pl-8 space-y-2">
                {megaMenuSideLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => {
                      setProductsDropdownOpen(false);
                      if (link.onClick) link.onClick();
                    }}
                    className="block text-[13px] xl:text-[13.5px] font-semibold text-slate-700 hover:text-[#002DC2] transition-colors py-0.5 leading-snug"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Dimmed backdrop overlay when mega menu or gallery is open */}
      {(productsDropdownOpen || galleryDropdownOpen) && (
        <div 
          className="hidden lg:block fixed inset-0 top-[72px] sm:top-[80px] lg:top-[96px] bg-black/35 backdrop-blur-[1px] z-30 transition-opacity duration-300"
          onClick={() => {
            setProductsDropdownOpen(false);
            setGalleryDropdownOpen(false);
          }}
        />
      )}

      {/* MOBILE MENU ACCORDION DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 p-4 space-y-1 shadow-2xl max-h-[85vh] overflow-y-auto animate-fade-in w-full">
          
          {/* Mobile: 1. Home */}
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-4 py-3 rounded-xl text-base font-bold transition-colors ${
              location.pathname === '/'
                ? 'text-[#002DC2] bg-[#F0F4FD]'
                : 'text-slate-800 hover:bg-slate-50'
            }`}
          >
            {t('navHome')}
          </Link>

          {/* Mobile: 2. Products Accordion */}
          <div>
            <button
              type="button"
              onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-bold text-slate-800 hover:bg-slate-50 transition-colors"
            >
              <span>Products</span>
              <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${mobileProductsOpen ? 'rotate-180 text-[#002DC2]' : 'text-slate-500'}`} />
            </button>

            {mobileProductsOpen && (
              <div className="pl-4 pr-2 py-1 space-y-1 bg-slate-50 rounded-xl mb-1">
                {productDropdownItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-[#002DC2] hover:bg-white"
                  >
                    {item.name}
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
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-bold text-slate-800 hover:bg-slate-50 transition-colors"
            >
              <span>Gallery</span>
              <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${mobileGalleryOpen ? 'rotate-180 text-[#002DC2]' : 'text-slate-500'}`} />
            </button>

            {mobileGalleryOpen && (
              <div className="pl-4 pr-2 py-1 space-y-1 bg-slate-50 rounded-xl mb-1">
                {galleryDropdownItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-[#002DC2] hover:bg-white"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Mobile: 4. Subsidies */}
          <Link
            to="/subsidies"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-4 py-3 rounded-xl text-base font-bold transition-colors ${
              isSubsidiesActive
                ? 'text-[#002DC2] bg-[#F0F4FD]'
                : 'text-slate-800 hover:bg-slate-50'
            }`}
          >
            Subsidies
          </Link>

          {/* Mobile: 5. About Us */}
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-4 py-3 rounded-xl text-base font-bold transition-colors ${
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
            className={`block px-4 py-3 rounded-xl text-base font-bold transition-colors ${
              isContactActive
                ? 'text-[#002DC2] bg-[#F0F4FD]'
                : 'text-slate-800 hover:bg-slate-50'
            }`}
          >
            {t('navContact')}
          </Link>
          
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
