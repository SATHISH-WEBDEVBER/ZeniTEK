import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { projectGalleryData } from '../data/projectGalleryData';
import { 
  officialDryerModels, 
  profileComparisonData, 
  workingPrincipleSteps, 
  brochurePages, 
  brochureKeyBenefits 
} from '../data/zenitekBrochureData';
import { zenitekRealGallery } from '../data/zenitekRealGalleryData';
import { fetchPublicProducts } from '../utils/api';
import { useLanguage } from '../context/LanguageContext';
import MapComponent from '../components/MapComponent';
import PageHero from '../components/PageHero';
import useScrollLock, { useEscapeKey } from '../hooks/useScrollLock';
import {
  MapPin, Calendar, Search, Filter, Sparkles, ArrowRight, ShieldCheck,
  CheckCircle2, X, PhoneCall, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  SlidersHorizontal, Eye, LayoutGrid, Sun, Wind, Droplets, Cpu, Shield, Zap, Maximize2, Download, Layers, Grid, FileText,
  Camera, Image as ImageIcon, ChevronDown, ChevronUp, Loader, Package
} from 'lucide-react';

export default function SolarDryersPage({ onOpenQuoteModal }) {
  const { t, tf } = useLanguage();
  const navigate = useNavigate();

  // Fills a translated template whose {placeholders} must render as React nodes (e.g. bold numbers),
  // so each language can put them wherever its word order needs.
  const richT = (key, nodes) =>
    t(key).split(/(\{\w+\})/).map((part, i) => {
      const m = part.match(/^\{(\w+)\}$/);
      return m && nodes[m[1]] !== undefined ? <React.Fragment key={i}>{nodes[m[1]]}</React.Fragment> : part;
    });

  // Brochure page categories (data labels) -> translation keys; unknown categories stay as entered
  const brochureCategoryKeys = {
    'Tunnel Dryer': 'dryers_bcat_tunnel',
    'Box Type Dryer': 'dryers_bcat_box',
    'Engineering Analysis': 'dryers_bcat_engineering',
    'Product Solutions': 'dryers_bcat_solutions',
    'Technology': 'dryers_bcat_technology'
  };
  const brochureCategoryLabel = (cat) => (brochureCategoryKeys[cat] ? t(brochureCategoryKeys[cat]) : cat);

  const boxModelCount = officialDryerModels.filter(m => m.category.includes('Box Type')).length;
  const tunnelModelCount = officialDryerModels.filter(m => m.category.includes('Tunnel')).length;

  // Dynamic CMS products from backend
  const [cmsProducts, setCmsProducts] = useState([]);
  const [cmsProductsLoading, setCmsProductsLoading] = useState(true);

  useEffect(() => {
    fetchPublicProducts()
      .then(data => { if (data.products) setCmsProducts(data.products); })
      .catch(() => {})
      .finally(() => setCmsProductsLoading(false));
  }, []);

  // State for active top tab / section filter
  const [modelCategoryFilter, setModelCategoryFilter] = useState('All');
  const [selectedBrochureModalPage, setSelectedBrochureModalPage] = useState(null);

  // Brochure page viewer: freeze background scrolling and close with Esc
  useScrollLock(!!selectedBrochureModalPage);
  useEscapeKey(!!selectedBrochureModalPage, () => setSelectedBrochureModalPage(null));

  // In-Card Expandable Details State (Image-Priority Mode)
  const [expandedModels, setExpandedModels] = useState({});
  const [expandedBrochures, setExpandedBrochures] = useState({});
  const [expandedProjects, setExpandedProjects] = useState({});

  const toggleModelExpand = (id) => {
    setExpandedModels(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleBrochureExpand = (page) => {
    setExpandedBrochures(prev => ({ ...prev, [page]: !prev[page] }));
  };

  const toggleProjectExpand = (id) => {
    setExpandedProjects(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Project Gallery Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  const stateOptions = [
    { labelKey: 'dryers_allStates', value: 'All', count: 25 },
    { labelKey: 'dryers_state_tn', value: 'Tamil Nadu', count: 11 },
    { labelKey: 'dryers_state_ka', value: 'Karnataka', count: 8 },
    { labelKey: 'dryers_state_mz', value: 'Mizoram', count: 2 },
    { labelKey: 'dryers_state_as', value: 'Assam', count: 1 },
    { labelKey: 'dryers_state_mh', value: 'Maharashtra', count: 1 },
    { labelKey: 'dryers_state_cg', value: 'Chhattisgarh', count: 1 }
  ];

  const yearOptions = ['All', '2026', '2025', '2024', '2023'];

  // Filter official models by category
  const filteredModels = useMemo(() => {
    if (modelCategoryFilter === 'Box Type') {
      return officialDryerModels.filter(m => m.category.includes('Box Type'));
    }
    if (modelCategoryFilter === 'Tunnel Type') {
      return officialDryerModels.filter(m => m.category.includes('Tunnel'));
    }
    return officialDryerModels;
  }, [modelCategoryFilter]);

  // Filter project gallery items
  const filteredProjects = useMemo(() => {
    return projectGalleryData.filter(proj => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        proj.title.toLowerCase().includes(q) ||
        proj.locality.toLowerCase().includes(q) ||
        proj.state.toLowerCase().includes(q) ||
        proj.dryerCode.toLowerCase().includes(q) ||
        proj.application.toLowerCase().includes(q) ||
        proj.id.includes(q);

      const matchesState = selectedState === 'All' || proj.state.toLowerCase() === selectedState.toLowerCase();
      const matchesYear = selectedYear === 'All' || proj.year.toString() === selectedYear;

      return matchesSearch && matchesState && matchesYear;
    });
  }, [searchQuery, selectedState, selectedYear]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedState, selectedYear]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProjects = filteredProjects.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      const gridElem = document.getElementById('dryers-grid');
      if (gridElem) {
        gridElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Build "Locality • State" without repeating the state (locality strings often already end in "| State")
  const formatProjectLocation = (proj) => {
    const state = String(proj.state || '').trim();
    const parts = String(proj.locality || '').split('|').map(p => p.trim()).filter(Boolean);
    const place = parts.filter(p => p.toLowerCase() !== state.toLowerCase()).join(', ');
    return place ? (state ? `${place} • ${state}` : place) : state;
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen w-full max-w-full overflow-x-hidden">
      
      {/* SECTION 1: HERO HEADER (background photo, left-aligned heading) */}
      <PageHero
        images="/real-photos/zenitek_photo_44.jpeg"
        top={
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/95 border border-[#23AC39]/30 text-[#1A822B] text-xs font-extrabold uppercase tracking-wider shadow-sm">
              <Sun className="w-3.5 h-3.5 text-[#23AC39] animate-spin-slow" />
              <span>{t('dryers_heroBadge')}</span>
            </span>
            <span className="text-xs text-[#002DC2] font-bold bg-white/95 px-3 py-1 rounded-full border border-[#002DC2]/20 shadow-sm">
              {t('dryers_heroTagline')}
            </span>
          </div>
        }
        title={<>{t('dryers_heroTitle1')} <span className="text-[#1A822B]">{t('dryers_heroTitle2')}</span></>}
        subtitle={<>{richT('dryers_heroSubtitle', { pct: <strong className="text-slate-900">40%</strong> })}</>}
        actions={<>
          <button
            type="button"
            onClick={() => onOpenQuoteModal && onOpenQuoteModal({ capacityNeeded: 'Commercial Solar Dryer Lineup' })}
            className="w-full sm:w-auto py-3.5 px-6 bg-gradient-to-r from-blue-700 via-blue-600 to-green-700 hover:from-blue-600 hover:to-green-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-md transition-all hover:scale-105 flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>{t('dryers_ctaPricing')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => scrollToSection('pdf-catalog-section')}
            className="w-full sm:w-auto py-3 px-5 bg-white hover:bg-slate-50 border border-slate-300 text-[#123B92] font-bold text-xs rounded-2xl transition-all flex items-center justify-center space-x-2 shadow-sm cursor-pointer"
          >
            <FileText className="w-4 h-4 text-[#1A822B]" />
            <span>{t('dryers_ctaCatalog', { count: brochurePages.length })}</span>
          </button>

          <a
            href="tel:+918903852623"
            className="w-full sm:w-auto py-3 px-5 bg-[#F0F4FD] hover:bg-[#F0F4FD] border border-[#002DC2]/20 text-[#123B92] font-semibold text-xs rounded-2xl transition-all flex items-center justify-center space-x-2 shadow-sm"
          >
            <PhoneCall className="w-3.5 h-3.5 text-[#1A822B]" />
            <span>{t('dryers_ctaCall', { phone: '+91 89038 52623' })}</span>
          </a>
        </>}
      >
        {/* Direct Brochure Value Props */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-w-xl">
          {[
            { value: '40%', labelKey: 'dryers_tileFaster', color: 'text-[#1A822B]' },
            { value: 'SS304', labelKey: 'dryers_tileTrays', color: 'text-[#002DC2]' },
            { value: 'PLC + HMI', labelKey: 'dryers_tileMoisture', color: 'text-[#002DC2]' },
            { value: '40%-60%', labelKey: 'dryers_tileSubsidy', color: 'text-[#1A822B]' },
          ].map((tile) => (
            <div key={tile.labelKey} className="px-2.5 py-2 bg-white/90 rounded-2xl border border-slate-200 text-center shadow-sm">
              <div className={`text-base font-black ${tile.color}`}>{tile.value}</div>
              <div className="text-2xs text-slate-600 font-bold mt-0.5 leading-tight">{t(tile.labelKey)}</div>
            </div>
          ))}
        </div>
      </PageHero>

      {/* Quick Jump navigation (compact strip right below the hero) */}
      <nav aria-label={t('dryers_jumpAria')} className="w-full bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="w-full sm:w-auto text-center text-xs font-bold text-slate-500 uppercase shrink-0 mr-1">{t('dryers_jumpLabel')}</span>
          <button
            type="button"
            onClick={() => scrollToSection('models-section')}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-[#F0F4FD] border border-slate-200 text-slate-700 hover:text-[#123B92] font-bold shrink-0 transition-colors cursor-pointer"
          >
            ⚡ {t('dryers_jumpModels', { count: officialDryerModels.length })}
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('profile-section')}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-[#F0F4FD] border border-slate-200 text-slate-700 hover:text-[#123B92] font-bold shrink-0 transition-colors cursor-pointer"
          >
            📐 {t('dryers_jumpProfile')}
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('working-principle-section')}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-[#F0F4FD] border border-slate-200 text-slate-700 hover:text-[#123B92] font-bold shrink-0 transition-colors cursor-pointer"
          >
            ☀️ {t('dryers_jumpPrinciple')}
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('pdf-catalog-section')}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-[#F0F4FD] border border-slate-200 text-slate-700 hover:text-[#123B92] font-bold shrink-0 transition-colors cursor-pointer"
          >
            📑 {t('dryers_jumpCatalog')}
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('real-photos-section')}
            className="px-3 py-1.5 rounded-xl bg-[#F0F4FD] hover:bg-[#F0F4FD] border border-[#002DC2]/20 text-[#002DC2] font-bold shrink-0 transition-colors cursor-pointer"
          >
            📷 {t('dryers_jumpPhotos', { count: zenitekRealGallery.length })}
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('map-section')}
            className="px-3 py-1.5 rounded-xl bg-[#23AC39]/10 hover:bg-[#23AC39]/10 border border-[#23AC39]/30 text-[#1A822B] font-bold shrink-0 transition-colors cursor-pointer"
          >
            📍 {t('dryers_jumpMap', { count: 35 })}
          </button>
        </div>
      </nav>

      {/* DYNAMIC CMS PRODUCTS SECTION — renders only when admin has published products */}
      {(cmsProductsLoading || cmsProducts.length > 0) && (
        <section className="w-full section-odd py-12 sm:py-16" id="cms-products-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
              <span className="text-xs font-bold text-[#1A822B] uppercase tracking-wide sm:tracking-widest text-balance bg-[#23AC39]/10 px-3 py-1 rounded-full border border-[#23AC39]/30 inline-block">
                {t('dryers_cmsBadge')}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#123B92] tracking-tight">{t('dryers_cmsTitle')}</h2>
            </div>

            {cmsProductsLoading ? (
              <div className="flex items-center justify-center py-16 space-x-3">
                <Loader className="w-6 h-6 text-[#002DC2] animate-spin" />
                <span className="text-sm text-slate-500 font-medium">{t('dryers_cmsLoading')}</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {cmsProducts.map(product => {
                  const primaryImg = product.images?.find(i => i.isPrimary) || product.images?.[0];
                  return (
                    <div key={product._id} className="bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-xl group flex flex-col">
                      {/* Product Image */}
                      <div className="relative h-56 bg-slate-50 overflow-hidden">
                        {primaryImg ? (
                          <img src={primaryImg.url} alt={primaryImg.alt || product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#F0F4FD] via-white to-emerald-50 px-6 text-center">
                            <span className="w-14 h-14 rounded-2xl bg-white border border-[#123B92]/15 shadow-sm flex items-center justify-center">
                              <Package className="w-7 h-7 text-[#123B92]/60" />
                            </span>
                            <span className="text-sm font-black text-[#123B92] line-clamp-1">{product.name}</span>
                            <span className="text-2xs font-bold uppercase tracking-wider text-slate-400">{t('dryers_cmsNoPhoto')}</span>
                          </div>
                        )}
                        <div className="absolute top-3 left-3">
                          <span className="bg-slate-900/80 backdrop-blur-sm text-white text-2xs font-bold px-2.5 py-1 rounded-lg">{product.category}</span>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="p-5 flex-1 flex flex-col space-y-3">
                        <h3 className="text-xl font-black text-[#123B92] leading-snug">{product.name}</h3>
                        {product.shortDescription && (
                          <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">{product.shortDescription}</p>
                        )}

                        {/* Features */}
                        {product.features?.length > 0 && (
                          <ul className="space-y-1">
                            {product.features.slice(0, 4).map((f, i) => (
                              <li key={i} className="flex items-start space-x-2 text-xs text-slate-700">
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#1A822B] shrink-0 mt-0.5" />
                                <span>{f}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        <div className="flex-1" />
                        <button
                          onClick={() => onOpenQuoteModal && onOpenQuoteModal({ capacityNeeded: product.name })}
                          className="w-full py-2.5 bg-[#002DC2] hover:bg-[#001fa0] text-white font-bold text-xs rounded-xl cursor-pointer transition-colors mt-auto"
                        >
                          {t('requestQuoteForModel')}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* SECTION 2: OFFICIAL PRODUCT MODELS LINEUP (EVEN SECTION - SOFT OFF-WHITE) */}
      <section className="w-full section-even py-14 sm:py-20" id="models-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
            <span className="text-xs font-bold text-[#002DC2] uppercase tracking-wide sm:tracking-widest text-balance bg-[#F0F4FD] px-3 py-1 rounded-full border border-[#002DC2]/20 inline-block">
              {t('dryers_modelsBadge')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#123B92] tracking-tight">
              {t('dryers_modelsTitle')}
            </h2>
            <p className="text-base sm:text-lg text-slate-600">
              {t('dryers_modelsSubtitle')}
            </p>

          {/* Model Category Switcher */}
          <div className="flex justify-center pt-2">
          <div role="group" aria-label={t('dryers_filterAria')} className="inline-flex flex-wrap items-center justify-center gap-1.5 bg-[#F0F4FD] border border-[#123B92]/20 p-1 rounded-2xl">
            {['All', 'Box Type', 'Tunnel Type'].map((cat) => (
              <button
                key={cat}
                type="button"
                aria-pressed={modelCategoryFilter === cat}
                onClick={() => setModelCategoryFilter(cat)}
                className={`px-3 sm:px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                  modelCategoryFilter === cat 
                    ? 'bg-[#002DC2] text-white shadow' 
                    : 'text-black hover:text-[#002DC2]'
                }`}
              >
                {cat === 'All'
                  ? t('dryers_filterAll', { count: officialDryerModels.length })
                  : cat === 'Box Type'
                    ? t('dryers_filterBox', { count: boxModelCount })
                    : t('dryers_filterTunnel', { count: tunnelModelCount })}
              </button>
            ))}
          </div>
          </div>
        </div>

        {/* Models Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModels.map((model) => {
            const isExpanded = !!expandedModels[model.id];
            return (
              <div
                key={model.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-blue-500 transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-xl group"
              >
                <div>
                  {/* Product Brochure Image Container (Priority to Image: Full visual height) */}
                  <Link
                    to={`/solar-dryer-models/${model.id}`}
                    aria-label={t('dryers_modelDetailsAria', { name: model.name })}
                    className="relative h-64 sm:h-72 overflow-hidden bg-gradient-to-b from-slate-100 to-slate-50 border-b border-slate-200 cursor-pointer p-4 flex items-center justify-center"
                  >
                    <img
                      src={model.imageUrl}
                      alt={model.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </Link>

                  {/* Clean Model Header & Image-First Action Button */}
                  <div className="p-4 sm:p-5 space-y-3">
                    {/* Model Badges (kept below the image so they never cover the brochure artwork) */}
                    <div className="flex flex-wrap items-center content-start gap-1.5 md:min-h-14">
                      <span className="bg-slate-900 text-white text-2xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg whitespace-nowrap inline-block">
                        {model.tier}
                      </span>
                      <span className="bg-[#002DC2] text-white font-extrabold text-2xs uppercase px-2.5 py-1 rounded-lg shadow-sm whitespace-nowrap inline-block">
                        {model.badge}
                      </span>
                      {model.floorArea && (
                        <span className="bg-white text-[#123B92] font-extrabold text-2xs px-2.5 py-1 rounded-lg border border-slate-200 shadow-sm whitespace-nowrap">
                          {model.floorArea}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-[#123B92] group-hover:text-[#002DC2] transition-colors leading-6 md:min-h-12">
                        <Link to={`/solar-dryer-models/${model.id}`} className="hover:underline">
                          {model.name}
                        </Link>
                      </h3>
                      <p className="text-sm font-bold text-[#1A822B] mt-1 md:min-h-12">{model.capacityRange}</p>
                    </div>

                    {/* Button to toggle content - Image Priority Requirement */}
                    <button
                      type="button"
                      onClick={() => toggleModelExpand(model.id)}
                      className={`w-full py-2.5 px-4 rounded-xl border font-bold text-xs flex items-center justify-between transition-all cursor-pointer ${
                        isExpanded 
                          ? 'bg-blue-50 border-blue-400 text-[#123B92] shadow-sm' 
                          : 'bg-slate-50 hover:bg-[#F0F4FD] border-slate-300 hover:border-blue-500 text-slate-800'
                      }`}
                    >
                      <span className="flex items-center space-x-1.5">
                        <Eye className="w-3.5 h-3.5 text-[#002DC2]" />
                        <span>{isExpanded ? t('dryers_hideSpecs') : t('dryers_viewSpecs')}</span>
                      </span>
                      <ChevronDown className={`w-4 h-4 text-[#002DC2] transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>

                    {/* In-Card Expandable / Slide-Up Panel */}
                    {isExpanded && (
                      <div className="pt-3 space-y-3 border-t border-slate-100 animate-fade-in text-left">
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {model.description}
                        </p>

                        {/* 4-Item Key Spec Metric Chips */}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="p-2 bg-slate-50 rounded-xl border border-slate-200/80">
                            <span className="text-2xs text-slate-400 font-bold uppercase block">{t('dryers_specTrayArea')}</span>
                            <span className="font-extrabold text-[#123B92]">{model.totalTrayArea}</span>
                          </div>
                          <div className="p-2 bg-slate-50 rounded-xl border border-slate-200/80">
                            <span className="text-2xs text-slate-400 font-bold uppercase block">{t('dryers_specTrays')}</span>
                            <span className="font-extrabold text-[#123B92] line-clamp-1">{model.trayCount}</span>
                          </div>
                          <div className="p-2 bg-slate-50 rounded-xl border border-slate-200/80">
                            <span className="text-2xs text-slate-400 font-bold uppercase block">{t('dryers_specSolar')}</span>
                            <span className="font-extrabold text-[#123B92] line-clamp-1">{model.solarPower}</span>
                          </div>
                          <div className="p-2 bg-slate-50 rounded-xl border border-slate-200/80">
                            <span className="text-2xs text-slate-400 font-bold uppercase block">{t('dryers_specNight')}</span>
                            <span className="font-extrabold text-[#123B92] line-clamp-1">{model.electricalHeater}</span>
                          </div>
                        </div>

                        <div className="pt-1 space-y-2">
                          <Link
                            to={`/solar-dryer-models/${model.id}`}
                            className="w-full py-2 bg-white hover:bg-[#002DC2] border border-[#002DC2] text-[#002DC2] hover:text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>{t('dryers_fullSpecs')}</span>
                          </Link>

                          <button
                            type="button"
                            onClick={() => onOpenQuoteModal && onOpenQuoteModal({ capacityNeeded: model.name })}
                            className="w-full py-2.5 bg-[#23AC39] hover:bg-[#002DC2] text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow hover:scale-[1.02] flex items-center justify-center space-x-1.5 cursor-pointer"
                          >
                            <span>{t('reqQuote')}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        </div>

      </section>


      {/* SECTION 3: SOLDRY PROFILE COMPARISON (ODD SECTION - CRISP WHITE) */}
      <section className="w-full section-odd py-14 sm:py-20" id="profile-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-xl space-y-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
              <span className="text-xs font-bold text-[#1A822B] uppercase tracking-wide sm:tracking-widest text-balance bg-[#23AC39]/10 px-3 py-1 rounded-full border border-[#23AC39]/30 inline-flex items-center">
                <SlidersHorizontal className="w-3.5 h-3.5 mr-1 text-[#1A822B]" /> {t('dryers_profileBadge')}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#123B92] tracking-tight">
                {t('dryers_profileTitle')}
              </h2>
              <p className="text-base sm:text-lg text-slate-600">
                {t('dryers_profileSubtitle')}
              </p>

            <div className="flex justify-center pt-1">
              <div className="bg-[#F0F4FD] px-4 py-2 rounded-2xl border border-[#002DC2]/20 text-xs font-bold text-[#123B92]">
                {t('dryers_profileModular')}
              </div>
            </div>
          </div>

          {/* 3 Profile Architectural Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {profileComparisonData.map((item, idx) => {
              // Keyed by floor area (150 / 200 / 250) so translations follow the data, not its order
              const pk = `dryers_profile${String(item.floorArea).replace(/\D/g, '')}`;
              return (
              <div
                key={idx}
                className="p-6 bg-slate-50 rounded-2xl border border-slate-200 hover:border-blue-500 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xs font-black uppercase text-[#002DC2] bg-[#F0F4FD] px-2.5 py-0.5 rounded inline-block">
                      {tf(`${pk}_badge`, item.profileBadge)}
                    </span>
                    <span className="text-xs font-extrabold text-[#1A822B]">{item.floorArea}</span>
                  </div>

                  <h3 className="text-xl font-black text-[#123B92] leading-snug">
                    {item.model}
                  </h3>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-white p-3 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-2xs text-slate-400 font-bold block">{t('dryers_frontWidth')}</span>
                      <span className="font-extrabold text-[#123B92]">{item.frontWidth}</span>
                    </div>
                    <div>
                      <span className="text-2xs text-slate-400 font-bold block">{t('dryers_centreHeight')}</span>
                      <span className="font-extrabold text-[#123B92]">{item.centreHeight}</span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-[#23AC39]/10 rounded-xl border border-[#23AC39]/30 text-xs">
                    <span className="text-2xs uppercase font-bold text-[#1A822B] block">{t('dryers_recommendedFor')}</span>
                    <span className="font-extrabold text-[#1A822B]">{tf(`${pk}_recommended`, item.recommendedFor)}</span>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    {tf(`${pk}_desc`, item.profileDescription)}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200 text-xs font-semibold text-slate-700">
                  <span className="text-2xs font-bold text-slate-400 block uppercase">{t('dryers_arrangement')}</span>
                  {tf(`${pk}_arrangement`, item.suitableArrangement)}
                </div>
              </div>
              );
            })}
          </div>

          {/* Modular Extension Banner */}
          <div className="bg-gradient-to-r from-blue-900 to-green-900 text-white p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="text-sm font-bold flex items-center justify-center sm:justify-start space-x-1.5 text-[#23AC39]">
                <CheckCircle2 className="w-4 h-4" />
                <span>{t('dryers_modularTitle')}</span>
              </div>
              <p className="text-sm text-white/85 max-w-2xl">
                {t('dryers_modularDesc')}
              </p>
            </div>

            <button
              onClick={() => onOpenQuoteModal && onOpenQuoteModal({ capacityNeeded: 'Modular Scalable Tunnel Sizing' })}
              className="px-5 py-2.5 bg-white text-[#123B92] hover:bg-slate-100 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow shrink-0 cursor-pointer"
            >
              {t('dryers_consultSizing')}
            </button>
          </div>

        </div>
        </div>
      </section>


      {/* SECTION 4: 7-STEP SOLAR DRYER WORKING PRINCIPLE (EVEN SECTION - SOFT OFF-WHITE) */}
      <section className="w-full section-even py-14 sm:py-20" id="working-principle-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="bg-white text-slate-900 p-6 sm:p-10 rounded-3xl shadow-xl space-y-8 border border-slate-200">
          
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
              <span className="text-xs font-bold text-[#1A822B] uppercase tracking-wide sm:tracking-widest text-balance bg-[#23AC39]/10 border border-[#23AC39]/30 px-3 py-1 rounded-full inline-flex items-center">
                <Sun className="w-3.5 h-3.5 mr-1.5 text-[#23AC39] animate-spin-slow" /> {t('dryers_principleBadge')}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#123B92] tracking-tight">
                {t('dryers_principleTitle')}
              </h2>
              <p className="text-base sm:text-lg text-slate-600">
                {t('dryers_principleSubtitle')}
              </p>

            <div className="flex justify-center pt-1">
              <div className="inline-flex items-center space-x-2 text-xs font-extrabold text-[#1A822B] bg-[#23AC39]/10 px-4 py-2 rounded-2xl border border-[#23AC39]/30">
                <Sparkles className="w-4 h-4 text-[#1A822B]" />
                <span>{t('dryers_principleFaster')}</span>
              </div>
            </div>
          </div>

          {/* 7 Process Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {workingPrincipleSteps.map((stepItem) => (
              <div
                key={stepItem.step}
                className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                  stepItem.step === 7
                    ? 'bg-[#23AC39]/10 border-[#23AC39]/30 shadow-sm md:col-span-2 lg:col-span-2'
                    : 'bg-slate-50 hover:bg-[#F0F4FD] border-slate-200 hover:border-blue-300'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3 min-h-8">
                    <span className="w-8 h-8 shrink-0 rounded-xl bg-[#002DC2] text-white font-black text-xs flex items-center justify-center shadow">
                      {stepItem.step}
                    </span>
                    <span className="flex-1 min-w-0 text-2xs uppercase font-bold text-[#002DC2] tracking-normal leading-4">
                      {tf(`dryers_step${stepItem.step}_subtitle`, stepItem.subtitle)}
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-[#123B92] leading-snug lg:min-h-11">
                    {tf(`dryers_step${stepItem.step}_title`, stepItem.title)}
                  </h4>

                  <p className="text-sm text-slate-600 leading-relaxed font-normal">
                    {tf(`dryers_step${stepItem.step}_desc`, stepItem.description)}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-200 flex items-center text-2xs text-[#1A822B] font-semibold">
                  <CheckCircle2 className="w-3 h-3 mr-1 text-[#1A822B]" /> {t('dryers_stepOf', { step: stepItem.step, total: workingPrincipleSteps.length })}
                </div>
              </div>
            ))}
          </div>

          {/* Technical Airflow Callout */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
              <span className="text-base font-bold text-[#1A822B] block mb-1">{t('dryers_air1Title')}</span>
              <p className="text-sm text-slate-600 leading-relaxed">{t('dryers_air1Desc')}</p>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
              <span className="text-base font-bold text-[#002DC2] block mb-1">{t('dryers_air2Title')}</span>
              <p className="text-sm text-slate-600 leading-relaxed">{t('dryers_air2Desc')}</p>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
              <span className="text-base font-bold text-[#002DC2] block mb-1">{t('dryers_air3Title')}</span>
              <p className="text-sm text-slate-600 leading-relaxed">{t('dryers_air3Desc')}</p>
            </div>
          </div>

        </div>
        </div>
      </section>


      {/* SECTION 5: OFFICIAL PDF CATALOG BROCHURE PAGES (ODD SECTION - CRISP WHITE) */}
      <section className="w-full section-odd py-14 sm:py-20" id="pdf-catalog-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
            <span className="text-xs font-bold text-[#002DC2] uppercase tracking-wide sm:tracking-widest text-balance bg-[#F0F4FD] px-3 py-1 rounded-full border border-[#002DC2]/20 inline-flex items-center">
              <FileText className="w-3.5 h-3.5 mr-1 text-[#002DC2]" /> {t('dryers_catalogBadge')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#123B92] tracking-tight">
              {t('dryers_catalogTitle')}
            </h2>
            <p className="text-base sm:text-lg text-slate-600">
              {t('dryers_catalogSubtitle')}
            </p>

          <div className="flex items-center justify-center text-xs font-bold text-slate-600">
            <span>{t('dryers_catalogCount', { count: brochurePages.length })}</span>
          </div>
        </div>

        {/* Brochure Pages Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {brochurePages.map((bPage) => {
            const isExpanded = !!expandedBrochures[bPage.page];
            return (
              <div
                key={bPage.page}
                className="bg-white rounded-3xl overflow-hidden border border-[#123B92]/20 hover:border-[#002DC2] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Priority to Image: Full visual height */}
                  <div 
                    onClick={() => setSelectedBrochureModalPage(bPage)}
                    className="relative h-80 sm:h-96 overflow-hidden bg-[#F0F4FD] border-b border-[#123B92]/20 flex items-center justify-center cursor-pointer"
                  >
                    <img
                      src={bPage.image}
                      alt={bPage.title}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />

                    {/* Floating Badges */}
                    <div className="absolute top-3 left-3">
                      <span className="bg-[#123B92]/90 backdrop-blur-sm text-white font-black text-2xs px-2.5 py-1 rounded-lg shadow-sm whitespace-nowrap">
                        {t('dryers_pageBadge', { page: bPage.page })}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="bg-[#23AC39]/95 backdrop-blur-sm text-white font-black text-2xs px-2.5 py-1 rounded-lg shadow-sm whitespace-nowrap">
                        {brochureCategoryLabel(bPage.category)}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 space-y-3">
                    <h4 
                      onClick={() => setSelectedBrochureModalPage(bPage)}
                      className="text-base font-black text-[#123B92] group-hover:text-[#002DC2] transition-colors line-clamp-2 leading-6 sm:min-h-12 cursor-pointer"
                    >
                      {bPage.title}
                    </h4>

                    {/* Button to toggle content - Image Priority Requirement */}
                    <button
                      type="button"
                      onClick={() => toggleBrochureExpand(bPage.page)}
                      className={`w-full py-2.5 px-4 rounded-xl border font-bold text-xs flex items-center justify-between transition-all cursor-pointer ${
                        isExpanded 
                          ? 'bg-blue-50 border-blue-400 text-[#123B92] shadow-sm' 
                          : 'bg-slate-50 hover:bg-[#F0F4FD] border-slate-300 hover:border-blue-500 text-slate-800'
                      }`}
                    >
                      <span className="flex items-center space-x-1.5">
                        <FileText className="w-3.5 h-3.5 text-[#002DC2]" />
                        <span>{isExpanded ? t('dryers_hideBrochure') : t('dryers_viewBrochure')}</span>
                      </span>
                      <ChevronDown className={`w-4 h-4 text-[#002DC2] transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>

                    {/* In-Card Expandable / Slide-Up Panel */}
                    {isExpanded && (
                      <div className="pt-3 space-y-3 border-t border-slate-100 animate-fade-in text-left">
                        <p className="text-sm text-black/80 leading-relaxed font-normal">
                          {bPage.summary}
                        </p>

                        <button
                          type="button"
                          onClick={() => setSelectedBrochureModalPage(bPage)}
                          className="w-full py-2.5 bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-600 hover:to-blue-700 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center space-x-1.5 shadow-sm cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{t('dryers_viewHiRes')}</span>
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        </div>
      </section>


      {/* SECTION 6: REAL PHOTOS GALLERY (EVEN SECTION - SOFT OFF-WHITE) */}
      <section className="w-full section-even py-14 sm:py-20" id="real-photos-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
            <span className="text-xs font-bold text-[#002DC2] uppercase tracking-wide sm:tracking-widest text-balance bg-[#F0F4FD] px-3 py-1 rounded-full border border-[#002DC2]/20 inline-flex items-center">
              <Camera className="w-3.5 h-3.5 mr-1 text-[#002DC2]" /> {t('dryers_photosBadge')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#123B92] tracking-tight">
              {t('dryers_photosTitle')}
            </h2>
            <p className="text-base sm:text-lg text-slate-600">
              {t('dryers_photosSubtitle')}
            </p>

          <div className="flex justify-center pt-2">
          <Link
            to="/gallery"
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white font-bold text-xs rounded-2xl shadow-md hover:shadow-lg transition-all shrink-0 group"
          >
            <ImageIcon className="w-4 h-4 text-[#23AC39] group-hover:scale-110 transition-transform" />
            <span>{t('dryers_photosOpenAll', { count: zenitekRealGallery.length })}</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
          </Link>
          </div>
        </div>

        {/* Highlighted Real Photo Grid (8 Distinct Shots) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 4k:grid-cols-4 gap-4 sm:gap-5">
          {zenitekRealGallery.slice(0, 8).map((photo) => (
            <div
              key={photo.id}
              onClick={() => navigate(`/gallery/${photo.id}`)}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-blue-500 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col justify-between"
            >
              <div>
                {/* Photo container without text on top */}
                <div className="h-48 bg-slate-900 overflow-hidden">
                  <img
                    src={photo.image}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>

                <div className="p-3.5 space-y-1.5">
                  <div className="flex flex-col items-start gap-1">
                    <span className="bg-[#123B92] text-white font-bold text-2xs px-2 py-0.5 rounded whitespace-nowrap">
                      {tf(`dryers_pcat_${photo.category}`, photo.category.replace('_', ' ').toUpperCase())}
                    </span>
                    {photo.crop && (
                      <span className="bg-[#1A822B] text-white font-bold text-2xs px-2 py-0.5 rounded whitespace-nowrap">
                        {photo.crop}
                      </span>
                    )}
                  </div>
                  <h4 className="text-lg font-black text-[#123B92] group-hover:text-[#002DC2] transition-colors line-clamp-2 leading-6 sm:min-h-12">
                    {photo.title}
                  </h4>
                  <p className="text-sm text-slate-500 line-clamp-2 leading-6 sm:min-h-12">
                    {photo.description}
                  </p>
                </div>
              </div>

              <div className="p-3.5 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between text-2xs text-slate-500 font-semibold">
                <span>{photo.productModel}</span>
                <span className="text-[#002DC2] font-bold group-hover:underline flex items-center">
                  {t('dryers_fullView')} <ArrowRight className="w-2.5 h-2.5 ml-0.5" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Gallery CTA Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 rounded-3xl border border-blue-800/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-xl font-black text-white flex items-center justify-center sm:justify-start gap-2">
              <Sparkles className="w-5 h-5 text-[#23AC39]" />
              {t('dryers_galleryCtaTitle')}
            </h3>
            <p className="text-sm text-white/85">
              {t('dryers_galleryCtaDesc')}
            </p>
          </div>
          <Link
            to="/gallery"
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-black text-xs rounded-2xl shadow-lg hover:shadow-xl transition-all shrink-0 flex items-center space-x-2"
          >
            <span>{t('dryers_galleryCtaBtn')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        </div>
      </section>


      {/* SECTION 7: 35 OPERATIONAL PROJECT INSTALLATIONS (ODD SECTION - CRISP WHITE) */}
      <section className="w-full section-odd py-14 sm:py-20" id="installations-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
            <span className="text-xs font-bold text-[#1A822B] uppercase tracking-wide sm:tracking-widest text-balance bg-[#23AC39]/10 px-3 py-1 rounded-full border border-[#23AC39]/30 inline-flex items-center">
              <Sparkles className="w-3.5 h-3.5 mr-1 text-[#1A822B]" /> {t('dryers_instBadge')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#123B92] tracking-tight">
              {t('dryers_instTitle')}
            </h2>
            <p className="text-base sm:text-lg text-slate-600">
              {t('dryers_instSubtitle')}
            </p>

          <div className="flex justify-center pt-1">
            <div className="inline-flex items-center text-xs font-bold text-[#123B92] bg-[#F0F4FD] px-4 py-2 rounded-2xl border border-[#002DC2]/20">
              <span>{t('dryers_instShowing', { count: filteredProjects.length, total: projectGalleryData.length })}</span>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-4" id="dryers-grid">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('dryers_searchPh')}
                aria-label={t('dryers_searchPh')}
                className="w-full bg-slate-50 border border-slate-300 rounded-2xl pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-medium"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label={t('dryers_clearSearch')}
                  title={t('dryers_clearSearch')}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Year Filters */}
            <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto pb-1 sm:pb-0">
              <span className="text-2xs uppercase font-bold text-slate-400 mr-1 flex items-center">
                <Calendar className="w-3 h-3 mr-1" /> {t('dryers_yearLabel')}
              </span>
              {yearOptions.map(yr => (
                <button
                  key={yr}
                  onClick={() => setSelectedYear(yr)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${selectedYear === yr ? 'bg-blue-800 text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  {yr === 'All' ? t('dryers_yearAll') : yr}
                </button>
              ))}
            </div>
          </div>

          {/* State Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 pb-1 text-xs font-bold pt-1 border-t border-slate-100">
            <span className="text-2xs uppercase font-bold text-slate-400 shrink-0 mr-1 flex items-center">
              <MapPin className="w-3 h-3 mr-1" /> {t('dryers_stateLabel')}
            </span>
            {stateOptions.map(st => (
              <button
                key={st.value}
                onClick={() => setSelectedState(st.value)}
                className={`px-3 py-1 rounded-xl transition-all whitespace-nowrap shrink-0 flex items-center space-x-1.5 cursor-pointer ${selectedState === st.value ? 'bg-blue-800 text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                <span>{t(st.labelKey)}</span>
                <span className={`text-2xs px-1.5 py-0.5 rounded-full ${selectedState === st.value ? 'bg-blue-900 text-white/85' : 'bg-slate-200 text-slate-600'}`}>
                  {st.count}
                </span>
              </button>
            ))}

            {(selectedState !== 'All' || selectedYear !== 'All' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedState('All');
                  setSelectedYear('All');
                  setSearchQuery('');
                }}
                className="ml-auto text-xs font-bold text-[#002DC2] hover:underline shrink-0 pl-2 cursor-pointer"
              >
                {t('dryers_clearFilters')}
              </button>
            )}
          </div>
        </div>

        {/* 25 Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedProjects.map((proj) => {
            const isExpanded = !!expandedProjects[proj.id];
            return (
              <div
                key={proj.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-blue-500 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Clean installation photo container (Priority to Image: Full visual height) */}
                  <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-100 border-b border-slate-200">
                    <img
                      src={proj.image}
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />

                    {/* Floating Badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="bg-blue-950/90 backdrop-blur-sm text-white font-mono font-bold text-2xs px-2.5 py-1 rounded-lg border border-blue-800/60 shadow-sm">
                        #{proj.id}
                      </span>
                      <span className="bg-slate-900/90 backdrop-blur-sm text-[#23AC39] font-mono font-bold text-2xs px-2.5 py-1 rounded-lg shadow-sm">
                        {proj.dryerCode}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="bg-[#1A822B]/95 backdrop-blur-sm text-white font-bold text-2xs px-2.5 py-1 rounded-lg shadow-sm">
                        {proj.year}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 space-y-3">
                    <div>
                      <h3 className="text-xl font-black text-[#123B92] group-hover:text-[#002DC2] transition-colors leading-snug">
                        {proj.title}
                      </h3>
                      <p className="text-sm text-slate-500 flex items-center font-medium mt-1">
                        <MapPin className="w-3.5 h-3.5 text-[#1A822B] mr-1 shrink-0" />
                        <span>{formatProjectLocation(proj)}</span>
                      </p>
                    </div>

                    {/* Button to toggle content - Image Priority Requirement */}
                    <button
                      type="button"
                      onClick={() => toggleProjectExpand(proj.id)}
                      className={`w-full py-2.5 px-4 rounded-xl border font-bold text-xs flex items-center justify-between transition-all cursor-pointer ${
                        isExpanded 
                          ? 'bg-blue-50 border-blue-400 text-[#123B92] shadow-sm' 
                          : 'bg-slate-50 hover:bg-[#F0F4FD] border-slate-300 hover:border-blue-500 text-slate-800'
                      }`}
                    >
                      <span className="flex items-center space-x-1.5">
                        <Eye className="w-3.5 h-3.5 text-[#002DC2]" />
                        <span>{isExpanded ? t('dryers_hideDetails') : t('dryers_viewInstDetails')}</span>
                      </span>
                      <ChevronDown className={`w-4 h-4 text-[#002DC2] transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>

                    {/* In-Card Expandable / Slide-Up Panel */}
                    {isExpanded && (
                      <div className="pt-3 space-y-3 border-t border-slate-100 animate-fade-in text-left">
                        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1 text-xs">
                          <div className="text-2xs font-bold text-slate-400 uppercase">{t('dryers_dryingApp')}</div>
                          <div className="font-extrabold text-[#123B92]">{proj.application}</div>
                          <div className="text-2xs font-semibold text-[#1A822B]">{proj.sector} • {proj.pinPrecision}</div>
                        </div>

                        <Link
                          to={`/dryers/${proj.id}`}
                          className="w-full py-2.5 bg-[#002DC2] hover:bg-[#123B92] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow flex items-center justify-center space-x-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{t('dryers_viewSiteDetails')}</span>
                          <ArrowRight className="w-3.5 h-3.5 ml-1" />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty state when search / filters match nothing */}
        {filteredProjects.length === 0 && (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center space-y-3">
            <Search className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-base font-bold text-[#123B92]">{t('dryers_emptyTitle')}</p>
            <p className="text-sm text-slate-600">{t('dryers_emptyDesc')}</p>
            <button
              type="button"
              onClick={() => {
                setSelectedState('All');
                setSelectedYear('All');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-[#002DC2] hover:bg-[#123B92] text-white text-xs font-bold transition-colors cursor-pointer"
            >
              {t('dryers_clearFilters')}
            </button>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-600 font-medium">
              {richT('dryers_pageRange', {
                from: <span className="font-bold text-[#123B92]">{startIndex + 1}</span>,
                to: <span className="font-bold text-[#123B92]">{Math.min(startIndex + itemsPerPage, filteredProjects.length)}</span>,
                total: <span className="font-bold text-[#123B92]">{filteredProjects.length}</span>
              })}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
                title={t('dryers_firstPage')}
                aria-label={t('dryers_firstPage')}
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
                title={t('dryers_prevPage')}
                aria-label={t('dryers_prevPage')}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="text-xs font-bold text-[#123B92] px-3">
                {t('dryers_pageOf', { page: currentPage, total: totalPages })}
              </span>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
                title={t('dryers_nextPage')}
                aria-label={t('dryers_nextPage')}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
                title={t('dryers_lastPage')}
                aria-label={t('dryers_lastPage')}
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        </div>
      </section>


      {/* SECTION 8: 35 OPERATIONAL LOCATIONS MAP (EVEN SECTION - SOFT OFF-WHITE) */}
      <section className="w-full section-even py-14 sm:py-20" id="map-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
              <span className="text-xs font-bold text-[#1A822B] uppercase tracking-wider bg-[#23AC39]/10 px-2.5 py-1 rounded-full border border-[#23AC39]/30 inline-flex items-center">
                <Sparkles className="w-3 h-3 mr-1 text-[#1A822B]" /> {t('dryers_mapBadge')}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#123B92] tracking-tight">
                {t('dryers_mapTitle')}
              </h2>
              <p className="text-base sm:text-lg text-slate-600">
                {t('dryers_mapSubtitle')}
              </p>
            <div className="flex justify-center pt-1">
              <div className="inline-flex items-center space-x-2 text-xs font-bold text-[#123B92] bg-[#F0F4FD] px-3 py-1.5 rounded-xl border border-[#002DC2]/20">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#23AC39] animate-pulse"></span>
                <span>{t('dryers_mapActive')}</span>
              </div>
            </div>
          </div>

          <MapComponent onSelectProjectQuote={(project) => onOpenQuoteModal && onOpenQuoteModal({ cropType: project.cropDrying, capacityNeeded: project.capacity, district: project.locationName })} />
        </div>
      </section>


      {/* SECTION 9: BOTTOM CALL TO ACTION (ODD SECTION - CRISP WHITE) */}
      <section className="w-full section-odd py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 text-slate-900 p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-md flex flex-col items-center gap-6">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-2xs font-extrabold text-[#1A822B] bg-[#23AC39]/10 border border-[#23AC39]/30 px-3 py-1 rounded-full uppercase tracking-wider inline-block">
              {t('dryers_ctaBadge')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#123B92] tracking-tight">
              {t('dryers_ctaTitle')}
            </h2>
            <p className="text-base sm:text-lg text-slate-600">
              {t('dryers_ctaDesc')}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <button
              onClick={() => onOpenQuoteModal && onOpenQuoteModal({ capacityNeeded: 'Custom Solar Dryer Project' })}
              className="whitespace-nowrap px-5 sm:px-6 py-3.5 bg-[#23AC39] hover:bg-[#23AC39] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all hover:scale-105 flex items-center space-x-2 cursor-pointer"
            >
              <span>{t('getQuote')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="tel:+918903852623"
              className="whitespace-nowrap px-5 py-3.5 bg-white hover:bg-slate-100 border border-slate-300 text-[#123B92] font-bold text-xs rounded-xl transition-all flex items-center space-x-1.5 shadow-sm"
            >
              <PhoneCall className="w-4 h-4 text-[#1A822B]" />
              <span>{t('dryers_callSupport')}</span>
            </a>
          </div>
        </div>
        </div>
      </section>


      {/* LIGHTBOX MODAL: FULL HIGH-RES PDF BROCHURE PAGE ZOOM */}
      {selectedBrochureModalPage && (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedBrochureModalPage(null)}
          role="dialog"
          aria-modal="true"
          aria-label={t('dryers_modalAria', { page: selectedBrochureModalPage.page })}
        >
          <div 
            className="relative bg-white rounded-3xl max-w-5xl w-full max-h-[95vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
              <div className="flex items-center space-x-2">
                <span className="text-2xs font-black uppercase bg-[#23AC39] text-white px-2 py-0.5 rounded inline-block">
                  {t('dryers_pageBadge', { page: selectedBrochureModalPage.page })}
                </span>
                <h3 className="text-xl font-bold text-white line-clamp-1">
                  {selectedBrochureModalPage.title}
                </h3>
              </div>

              <div className="flex items-center space-x-2">
                <a
                  href={selectedBrochureModalPage.image}
                  download={`ZeniTEK_Brochure_Page_${selectedBrochureModalPage.page}.png`}
                  className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold text-white flex items-center space-x-1 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t('dryers_saveImage')}</span>
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedBrochureModalPage(null)}
                  aria-label={t('close')}
                  title={t('close')}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* High-Res Image Viewport */}
            <div className="p-2 sm:p-4 overflow-auto flex-1 bg-slate-100 flex items-center justify-center">
              <img
                src={selectedBrochureModalPage.image}
                alt={selectedBrochureModalPage.title}
                className="max-w-full max-h-[75vh] object-contain rounded-xl shadow border border-slate-300"
              />
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 text-xs">
              <p className="text-slate-600 font-medium text-center sm:text-left">
                {selectedBrochureModalPage.subtitle}
              </p>
              
              <button
                onClick={() => {
                  const title = selectedBrochureModalPage.title;
                  setSelectedBrochureModalPage(null);
                  if (onOpenQuoteModal) onOpenQuoteModal({ capacityNeeded: title });
                }}
                className="px-5 py-2 bg-[#002DC2] hover:bg-[#123B92] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow cursor-pointer shrink-0"
              >
                {t('dryers_enquireModel')}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
