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
import { useLanguage } from '../context/LanguageContext';
import MapComponent from '../components/MapComponent';
import {
  MapPin, Calendar, Search, Filter, Sparkles, ArrowRight, ShieldCheck,
  CheckCircle2, X, PhoneCall, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  SlidersHorizontal, Eye, LayoutGrid, Sun, Wind, Droplets, Cpu, Shield, Zap, Maximize2, Download, Layers, Grid, FileText,
  Camera, Image as ImageIcon
} from 'lucide-react';

export default function SolarDryersPage({ onOpenQuoteModal, onOpenDetailModal }) {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const isTamil = lang === 'ta';

  // State for active top tab / section filter
  const [modelCategoryFilter, setModelCategoryFilter] = useState('All');
  const [selectedBrochureModalPage, setSelectedBrochureModalPage] = useState(null);

  // Project Gallery Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  const stateOptions = [
    { label: 'All States', value: 'All', count: 25 },
    { label: 'Tamil Nadu', value: 'Tamil Nadu', count: 11 },
    { label: 'Karnataka', value: 'Karnataka', count: 8 },
    { label: 'Mizoram', value: 'Mizoram', count: 2 },
    { label: 'Assam', value: 'Assam', count: 1 },
    { label: 'Maharashtra', value: 'Maharashtra', count: 1 },
    { label: 'Chhattisgarh', value: 'Chhattisgarh', count: 1 }
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

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen w-full max-w-full overflow-x-hidden">
      
      {/* SECTION 1: HERO HEADER (ODD SECTION - CRISP WHITE) */}
      <section className="w-full section-odd py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
          
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-green-50 border border-green-200 text-green-700 text-xs font-extrabold uppercase tracking-wider">
                <Sun className="w-3.5 h-3.5 text-amber-500 animate-spin-slow" />
                <span>Manufacturer of Solar Thermal Systems</span>
              </span>
              <span className="text-xs text-blue-700 font-bold bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                Natural Drying • Smarter • Faster • Better
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <h1 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-blue-950">
                  High-Performance Solar Dryers <br />
                  <span className="text-green-700">
                    Engineered for Agriculture & Food
                  </span>
                </h1>

                <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-2xl">
                  Efficient drying powered by the sun with smart automatic control. Reduces drying time by <strong className="text-slate-900">40%</strong> while 100% preserving natural color, vitamins, and aroma. Certified for FSSAI, export quality, and eligible for 40% – 60% government subsidies.
                </p>

                {/* Direct Brochure Value Props */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center shadow-xs">
                    <div className="text-lg font-black text-green-700">40%</div>
                    <div className="text-[10px] text-slate-600 font-bold mt-0.5">Faster Drying</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center shadow-xs">
                    <div className="text-lg font-black text-blue-700">SS304</div>
                    <div className="text-[10px] text-slate-600 font-bold mt-0.5">Food-Grade Trays</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center shadow-xs">
                    <div className="text-lg font-black text-amber-600">PLC + HMI</div>
                    <div className="text-[10px] text-slate-600 font-bold mt-0.5">Auto Moisture Control</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center shadow-xs">
                    <div className="text-lg font-black text-green-700">40%-60%</div>
                    <div className="text-[10px] text-slate-600 font-bold mt-0.5">Govt Subsidy</div>
                  </div>
                </div>
              </div>

              {/* Right: Quick Action Buttons & PDF Download */}
              <div className="lg:col-span-4 flex flex-col gap-3 justify-center">
                <button
                  onClick={() => onOpenQuoteModal && onOpenQuoteModal({ capacityNeeded: 'Commercial Solar Dryer Lineup' })}
                  className="w-full py-3.5 px-6 bg-gradient-to-r from-blue-700 via-blue-600 to-green-700 hover:from-blue-600 hover:to-green-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-md transition-all hover:scale-105 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>Request Pricing & Sizing</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => scrollToSection('pdf-catalog-section')}
                  className="w-full py-3 px-5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-xs rounded-2xl transition-all flex items-center justify-center space-x-2 shadow-sm cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-green-700" />
                  <span>View Official PDF Catalog (9 Pages)</span>
                </button>

                <a
                  href="tel:+918903852623"
                  className="w-full py-2.5 px-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-900 font-semibold text-xs rounded-2xl transition-all flex items-center justify-center space-x-2"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-green-700" />
                  <span>Call Direct: +91 89038 52623</span>
                </a>
              </div>
            </div>

            {/* Quick Sticky Anchor Navigation Pills */}
            <div className="pt-4 border-t border-slate-200 flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
              <span className="text-[11px] font-bold text-slate-500 uppercase shrink-0 mr-1">Quick Jump:</span>
              <button
                onClick={() => scrollToSection('models-section')}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 border border-slate-200 text-slate-700 hover:text-blue-900 font-bold shrink-0 transition-colors cursor-pointer"
              >
                ⚡ Models Lineup (8 Models)
              </button>
              <button
                onClick={() => scrollToSection('profile-section')}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 border border-slate-200 text-slate-700 hover:text-blue-900 font-bold shrink-0 transition-colors cursor-pointer"
              >
                📐 Profile Comparison (150 · 200 · 250 Sq.Ft)
              </button>
              <button
                onClick={() => scrollToSection('working-principle-section')}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 border border-slate-200 text-slate-700 hover:text-blue-900 font-bold shrink-0 transition-colors cursor-pointer"
              >
                ☀️ 7-Step Working Principle
              </button>
              <button
                onClick={() => scrollToSection('pdf-catalog-section')}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 border border-slate-200 text-slate-700 hover:text-blue-900 font-bold shrink-0 transition-colors cursor-pointer"
              >
                📑 Official PDF Catalog
              </button>
              <button
                onClick={() => scrollToSection('real-photos-section')}
                className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 font-bold shrink-0 transition-colors cursor-pointer"
              >
                📷 Real Photos Gallery (45)
              </button>
              <button
                onClick={() => scrollToSection('map-section')}
                className="px-3 py-1.5 rounded-xl bg-green-50 hover:bg-green-100 border border-green-200 text-green-800 font-bold shrink-0 transition-colors cursor-pointer"
              >
                📍 35 Operational GPS Sites Map
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 2: OFFICIAL PRODUCT MODELS LINEUP (EVEN SECTION - SOFT OFF-WHITE) */}
      <section className="w-full section-even py-14 sm:py-20" id="models-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-blue-700 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Complete Product Engineering Lineup
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-blue-950">
              Solar Dryer Models & Technical Specifications
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              From compact household box dryers to high-capacity walk-in commercial tunnel systems
            </p>
          </div>

          {/* Model Category Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-200 p-1 rounded-2xl shrink-0">
            {['All', 'Box Type', 'Tunnel Type'].map((cat) => (
              <button
                key={cat}
                onClick={() => setModelCategoryFilter(cat)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  modelCategoryFilter === cat 
                    ? 'bg-blue-800 text-white shadow' 
                    : 'text-slate-700 hover:text-blue-900'
                }`}
              >
                {cat === 'All' ? 'All Models (8)' : cat === 'Box Type' ? 'Box Dryers (3)' : 'Tunnel Dryers (5)'}
              </button>
            ))}
          </div>
        </div>

        {/* Models Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModels.map((model) => (
            <div
              key={model.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-blue-500 transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-xl group"
            >
              <div>
                {/* Product Brochure Image Container (Clean, zero text on image) */}
                <div 
                  onClick={() => onOpenDetailModal && onOpenDetailModal(model)}
                  className="h-60 overflow-hidden bg-gradient-to-b from-slate-100 to-slate-50 border-b border-slate-200 cursor-pointer p-3 flex items-center justify-center"
                >
                  <img
                    src={model.imageUrl}
                    alt={model.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>

                {/* Product Content Details */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{model.tier}</span>
                    <div className="flex items-center gap-1.5">
                      {model.floorArea && (
                        <span className="bg-slate-100 text-slate-700 font-bold text-[10px] px-2 py-0.5 rounded border border-slate-200">
                          {model.floorArea}
                        </span>
                      )}
                      <span className="bg-blue-800 text-white font-bold text-[10px] uppercase px-2 py-0.5 rounded">
                        {model.badge}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 
                      onClick={() => onOpenDetailModal && onOpenDetailModal(model)}
                      className="text-base font-black text-slate-900 group-hover:text-blue-700 transition-colors cursor-pointer leading-tight mt-0.5"
                    >
                      {model.name}
                    </h3>
                    <p className="text-xs font-bold text-green-700 mt-1">{model.capacityRange}</p>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {model.description}
                  </p>

                  {/* 4-Item Key Spec Metric Chips */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[11px]">
                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-200/80">
                      <span className="text-[9.5px] text-slate-400 font-bold uppercase block">Tray Area</span>
                      <span className="font-extrabold text-slate-800">{model.totalTrayArea}</span>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-200/80">
                      <span className="text-[9.5px] text-slate-400 font-bold uppercase block">Trays / Trolleys</span>
                      <span className="font-extrabold text-slate-800 line-clamp-1">{model.trayCount}</span>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-200/80">
                      <span className="text-[9.5px] text-slate-400 font-bold uppercase block">Solar Power</span>
                      <span className="font-extrabold text-slate-800 line-clamp-1">{model.solarPower}</span>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-200/80">
                      <span className="text-[9.5px] text-slate-400 font-bold uppercase block">Night Heating</span>
                      <span className="font-extrabold text-slate-800 line-clamp-1">{model.electricalHeater}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 pt-0 space-y-2">
                <button
                  type="button"
                  onClick={() => onOpenDetailModal && onOpenDetailModal(model)}
                  className="w-full py-2.5 bg-slate-50 hover:bg-blue-50 border border-slate-300 hover:border-blue-600 text-blue-900 font-bold text-xs rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-blue-700" />
                  <span>View Engineering Specifications</span>
                </button>

                <button
                  type="button"
                  onClick={() => onOpenQuoteModal && onOpenQuoteModal({ capacityNeeded: model.name })}
                  className="w-full py-3 bg-gradient-to-r from-blue-700 to-green-700 hover:from-blue-800 hover:to-green-800 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow hover:scale-102 flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <span>Request Price Quote</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>
        </div>

      </section>


      {/* SECTION 3: SOLDRY PROFILE COMPARISON (ODD SECTION - CRISP WHITE) */}
      <section className="w-full section-odd py-14 sm:py-20" id="profile-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-xl space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-green-700 uppercase tracking-widest bg-green-50 px-3 py-1 rounded-full border border-green-200 inline-flex items-center">
                <SlidersHorizontal className="w-3.5 h-3.5 mr-1 text-green-600" /> Engineering Profile Architecture • Page 3
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-blue-950">
                SOLDRY Profile Comparison — 150 · 200 · 250 Sq.Ft
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                Same construction technology. Different profiles. More usable floor area.
              </p>
            </div>

            <div className="bg-blue-50 px-4 py-2 rounded-2xl border border-blue-200 text-xs font-bold text-blue-900 shrink-0">
              Modular Scalable up to 1,000 Sq.Ft
            </div>
          </div>

          {/* 3 Profile Architectural Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {profileComparisonData.map((item, idx) => (
              <div
                key={idx}
                className="p-6 bg-slate-50 rounded-2xl border border-slate-200 hover:border-blue-500 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded">
                      {item.profileBadge}
                    </span>
                    <span className="text-xs font-extrabold text-green-700">{item.floorArea}</span>
                  </div>

                  <h3 className="text-lg font-black text-slate-900 leading-snug">
                    {item.model}
                  </h3>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-white p-3 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block">Front Width:</span>
                      <span className="font-extrabold text-blue-950">{item.frontWidth}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block">Centre Height:</span>
                      <span className="font-extrabold text-blue-950">{item.centreHeight}</span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-green-50 rounded-xl border border-green-200 text-xs">
                    <span className="text-[10px] uppercase font-bold text-green-800 block">Recommended For:</span>
                    <span className="font-extrabold text-green-900">{item.recommendedFor}</span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.profileDescription}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200 text-[11px] font-semibold text-slate-700">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Arrangement:</span>
                  {item.suitableArrangement}
                </div>
              </div>
            ))}
          </div>

          {/* Modular Extension Banner */}
          <div className="bg-gradient-to-r from-blue-900 to-green-900 text-white p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="text-sm font-bold flex items-center justify-center sm:justify-start space-x-1.5 text-green-300">
                <CheckCircle2 className="w-4 h-4" />
                <span>MODULAR & SCALABLE DESIGN (UP TO 1,000 SQ.FT)</span>
              </div>
              <p className="text-xs text-blue-100 max-w-2xl">
                Tunnel length can be increased using additional interlocking prefabricated sections up to 53 ft length and 1,000 sq.ft floor area. Tray and trolley quantities can be customized as per your farm throughput requirements.
              </p>
            </div>

            <button
              onClick={() => onOpenQuoteModal && onOpenQuoteModal({ capacityNeeded: 'Modular Scalable Tunnel Sizing' })}
              className="px-5 py-2.5 bg-white text-blue-950 hover:bg-slate-100 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow shrink-0 cursor-pointer"
            >
              Consult On Sizing
            </button>
          </div>

        </div>
        </div>
      </section>


      {/* SECTION 4: 7-STEP SOLAR DRYER WORKING PRINCIPLE (EVEN SECTION - SOFT OFF-WHITE) */}
      <section className="w-full section-even py-14 sm:py-20" id="working-principle-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="bg-white text-slate-900 p-6 sm:p-10 rounded-3xl shadow-xl space-y-8 border border-slate-200">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-green-700 uppercase tracking-widest bg-green-50 border border-green-200 px-3 py-1 rounded-full inline-flex items-center">
                <Sun className="w-3.5 h-3.5 mr-1.5 text-amber-500 animate-spin-slow" /> PDF Technical Guide • Page 8
              </span>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-blue-950">
                Solar Dryer Working Principle
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-2xl">
                Smart, Efficient, Sustainable — 7-step thermodynamic cycle engineered by ZeniTEK for 40% faster moisture reduction with zero contamination.
              </p>
            </div>

            <div className="flex items-center space-x-2 text-xs font-extrabold text-green-800 bg-green-50 px-4 py-2 rounded-2xl border border-green-200 shrink-0">
              <Sparkles className="w-4 h-4 text-green-600" />
              <span>Drying Time Reduced by 40%</span>
            </div>
          </div>

          {/* 7 Process Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {workingPrincipleSteps.map((stepItem) => (
              <div
                key={stepItem.step}
                className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                  stepItem.step === 7
                    ? 'bg-green-50/80 border-green-300 shadow-sm md:col-span-2 lg:col-span-2'
                    : 'bg-slate-50 hover:bg-blue-50/40 border-slate-200 hover:border-blue-300'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-xl bg-blue-700 text-white font-black text-xs flex items-center justify-center shadow">
                      {stepItem.step}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-blue-700 tracking-wider">
                      {stepItem.subtitle}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 leading-snug">
                    {stepItem.title}
                  </h4>

                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {stepItem.description}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-200 flex items-center text-[10px] text-green-700 font-semibold">
                  <CheckCircle2 className="w-3 h-3 mr-1 text-green-600" /> Step {stepItem.step} of 7
                </div>
              </div>
            ))}
          </div>

          {/* Technical Airflow Callout */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
              <span className="font-bold text-green-700 block mb-1">1. Fresh Air Inlet</span>
              <p className="text-slate-600 leading-relaxed">Bottom air inlets on both sides of the front door draw fresh dry ambient air continuously.</p>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
              <span className="font-bold text-amber-700 block mb-1">2. Internal Circulation Fans</span>
              <p className="text-slate-600 leading-relaxed">High-CFM fans force heated air downward through all tray layers to eliminate temperature stratification.</p>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
              <span className="font-bold text-blue-700 block mb-1">3. Moist Air Exhaust</span>
              <p className="text-slate-600 leading-relaxed">Automated top exhaust blowers at the rear expel saturated moisture to prevent reabsorption.</p>
            </div>
          </div>

        </div>
        </div>
      </section>


      {/* SECTION 5: OFFICIAL PDF CATALOG BROCHURE PAGES (ODD SECTION - CRISP WHITE) */}
      <section className="w-full section-odd py-14 sm:py-20" id="pdf-catalog-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200 pb-4">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-blue-700 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-200 inline-flex items-center">
              <FileText className="w-3.5 h-3.5 mr-1 text-blue-600" /> Authentic Manufacturer Documentation
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-blue-950">
              Official ZeniTEK PDF Product Brochure Catalog
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Click any brochure page to view in full crystal-clear high-definition resolution
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs font-bold text-slate-600">
            <span>9 Official Brochure Pages</span>
          </div>
        </div>

        {/* Brochure Pages Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {brochurePages.map((bPage) => (
            <div
              key={bPage.page}
              onClick={() => setSelectedBrochureModalPage(bPage)}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-blue-600 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col justify-between"
            >
              <div>
                {/* Clean Page Thumbnail without text overlays */}
                <div className="h-72 overflow-hidden bg-slate-100 border-b border-slate-200 flex items-center justify-center">
                  <img
                    src={bPage.image}
                    alt={bPage.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="bg-blue-900 text-white font-black text-[10px] px-2.5 py-0.5 rounded shadow-xs">
                      PAGE {bPage.page}
                    </span>
                    <span className="bg-green-700 text-white font-bold text-[10px] px-2.5 py-0.5 rounded shadow-xs">
                      {bPage.category}
                    </span>
                  </div>
                  <h4 className="text-xs font-black text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-1">
                    {bPage.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-snug">
                    {bPage.summary}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0">
                <button
                  type="button"
                  onClick={() => setSelectedBrochureModalPage(bPage)}
                  className="w-full py-2 bg-slate-50 group-hover:bg-blue-50 border border-slate-200 group-hover:border-blue-300 text-slate-700 group-hover:text-blue-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center space-x-1"
                >
                  <span>Click to View Full High-Res Page</span>
                  <ArrowRight className="w-3 h-3 ml-1" />
                </button>
              </div>
            </div>
          ))}
        </div>

        </div>
      </section>


      {/* SECTION 6: REAL PHOTOS GALLERY (EVEN SECTION - SOFT OFF-WHITE) */}
      <section className="w-full section-even py-14 sm:py-20" id="real-photos-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-200 inline-flex items-center">
              <Camera className="w-3.5 h-3.5 mr-1 text-amber-600" /> 100% Authentic Field Photography
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-blue-950">
              Real Operational Solar Dryers in Action
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Real high-resolution photographs of commercial walk-in polyhouse tunnels, compact box dryers, SS304 food-grade trays, and produce drying.
            </p>
          </div>

          <Link
            to="/gallery"
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white font-bold text-xs rounded-2xl shadow-md hover:shadow-lg transition-all shrink-0 group"
          >
            <ImageIcon className="w-4 h-4 text-green-400 group-hover:scale-110 transition-transform" />
            <span>Open All 45 Real Photos Gallery</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Highlighted Real Photo Grid (8 Distinct Shots) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 4k:grid-cols-4 gap-4 sm:gap-5">
          {zenitekRealGallery.slice(0, 8).map((photo) => (
            <div
              key={photo.id}
              onClick={() => navigate('/gallery')}
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
                  <div className="flex items-center justify-between gap-1">
                    <span className="bg-blue-950 text-white font-bold text-[9px] px-2 py-0.5 rounded">
                      {photo.category.replace('_', ' ').toUpperCase()}
                    </span>
                    {photo.crop && (
                      <span className="bg-green-700 text-white font-bold text-[9px] px-2 py-0.5 rounded">
                        {photo.crop}
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-black text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-1">
                    {photo.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    {photo.description}
                  </p>
                </div>
              </div>

              <div className="p-3.5 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between text-[10px] text-slate-500 font-semibold">
                <span>{photo.productModel}</span>
                <span className="text-blue-700 font-bold group-hover:underline flex items-center">
                  Full View <ArrowRight className="w-2.5 h-2.5 ml-0.5" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Gallery CTA Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 rounded-3xl border border-blue-800/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg font-black text-white flex items-center justify-center sm:justify-start gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Looking for More Site Photos & Factory Trays?
            </h3>
            <p className="text-xs text-blue-200">
              Browse all 45 real photographs filtered by Polyhouse Tunnels, Internal Trolleys & Trays, Box Dryers, SS304 Trays, and Packaging.
            </p>
          </div>
          <Link
            to="/gallery"
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-black text-xs rounded-2xl shadow-lg hover:shadow-xl transition-all shrink-0 flex items-center space-x-2"
          >
            <span>Browse Full Gallery (45 Photos)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        </div>
      </section>


      {/* SECTION 7: 35 OPERATIONAL PROJECT INSTALLATIONS (ODD SECTION - CRISP WHITE) */}
      <section className="w-full section-odd py-14 sm:py-20" id="installations-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-green-700 uppercase tracking-widest bg-green-50 px-3 py-1 rounded-full border border-green-200 inline-flex items-center">
              <Sparkles className="w-3.5 h-3.5 mr-1 text-green-600" /> Operational Installations • 2023 - 2026
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-blue-950">
              Verified Project Installation Gallery
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Agricultural solar drying sites operating across 6 Indian states. Click "View Details" to open complete site case study.
            </p>
          </div>

          <div className="flex items-center space-x-3 text-xs font-bold text-blue-900 bg-blue-50 px-4 py-2 rounded-2xl border border-blue-200 shrink-0">
            <span>Showing {filteredProjects.length} of 25 Sites</span>
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
                placeholder="Search district, crop, or dryer code..."
                className="w-full bg-slate-50 border border-slate-300 rounded-2xl pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Year Filters */}
            <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              <span className="text-[10px] uppercase font-bold text-slate-400 mr-1 flex items-center">
                <Calendar className="w-3 h-3 mr-1" /> Year:
              </span>
              {yearOptions.map(yr => (
                <button
                  key={yr}
                  onClick={() => setSelectedYear(yr)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${selectedYear === yr ? 'bg-green-700 text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  {yr}
                </button>
              ))}
            </div>
          </div>

          {/* State Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold pt-1 border-t border-slate-100 no-scrollbar">
            <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0 mr-1 flex items-center">
              <MapPin className="w-3 h-3 mr-1" /> State:
            </span>
            {stateOptions.map(st => (
              <button
                key={st.value}
                onClick={() => setSelectedState(st.value)}
                className={`px-3 py-1 rounded-xl transition-all whitespace-nowrap shrink-0 flex items-center space-x-1.5 cursor-pointer ${selectedState === st.value ? 'bg-blue-800 text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                <span>{st.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${selectedState === st.value ? 'bg-blue-900 text-blue-200' : 'bg-slate-200 text-slate-600'}`}>
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
                className="ml-auto text-xs font-bold text-rose-600 hover:underline shrink-0 pl-2 cursor-pointer"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* 25 Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedProjects.map((proj) => (
            <div
              key={proj.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-blue-500 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Clean installation photo container without text on top */}
                <div className="h-56 w-full overflow-hidden bg-slate-100 border-b border-slate-200">
                  <img
                    src={proj.image}
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="bg-blue-950 text-white font-mono font-bold text-[10px] px-2.5 py-0.5 rounded border border-blue-800/60">
                      #{proj.id}
                    </span>
                    <span className="bg-slate-900 text-amber-300 font-mono font-bold text-[10px] px-2 py-0.5 rounded">
                      {proj.dryerCode}
                    </span>
                    <span className="bg-green-700 text-white font-bold text-[10px] px-2 py-0.5 rounded">
                      {proj.year}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-black text-slate-900 group-hover:text-blue-700 transition-colors leading-snug">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center font-medium mt-1">
                      <MapPin className="w-3.5 h-3.5 text-green-600 mr-1 shrink-0" />
                      <span>{proj.locality} • {proj.state}</span>
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1 text-xs">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">DRYING APPLICATION</div>
                    <div className="font-extrabold text-blue-950 line-clamp-1">{proj.application}</div>
                    <div className="text-[10px] font-semibold text-green-800">{proj.sector} • {proj.pinPrecision}</div>
                  </div>
                </div>
              </div>

              {/* View Details Button */}
              <div className="p-5 pt-0">
                <Link
                  to={`/dryers/${proj.id}`}
                  className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow flex items-center justify-center space-x-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Details & Specifications</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-600 font-medium">
              Showing <span className="font-bold text-slate-900">{startIndex + 1}</span> to{' '}
              <span className="font-bold text-slate-900">
                {Math.min(startIndex + itemsPerPage, filteredProjects.length)}
              </span>{' '}
              of <span className="font-bold text-slate-900">{filteredProjects.length}</span> installations
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
                title="First Page"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
                title="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="text-xs font-bold text-slate-800 px-3">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
                title="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
                title="Last Page"
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
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200 pb-3">
            <div>
              <span className="text-[11px] font-bold text-green-700 uppercase tracking-wider bg-green-50 px-2.5 py-1 rounded-full border border-green-200 inline-flex items-center">
                <Sparkles className="w-3 h-3 mr-1 text-green-600" /> Pan-India GPS Footprint
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-blue-950 mt-1.5">
                Verified Operational Solar Dryers Map (35 Active Sites)
              </h2>
              <p className="text-xs text-slate-500">
                Pinned GPS coordinates of all operational ZeniTEK commercial polyhouse dryer installations across 9 Indian states
              </p>
            </div>
            <div className="flex items-center space-x-2 text-xs font-bold text-blue-800 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200 shrink-0">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>35 Verified Coordinates Active</span>
            </div>
          </div>

          <MapComponent onSelectProjectQuote={(project) => onOpenQuoteModal && onOpenQuoteModal({ cropType: project.cropDrying, capacityNeeded: project.capacity, district: project.locationName })} />
        </div>
      </section>


      {/* SECTION 9: BOTTOM CALL TO ACTION (ODD SECTION - CRISP WHITE) */}
      <section className="w-full section-odd py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 text-slate-900 p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <span className="text-[10px] font-extrabold text-green-800 bg-green-100 border border-green-200 px-3 py-1 rounded-full uppercase tracking-wider">
              Govt Subsidy Assistance 40% – 60%
            </span>
            <h3 className="text-xl sm:text-3xl font-black text-blue-950">
              Need a Custom Solar Dryer Sized for Your Farm?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
              Our engineering team in Erode custom-calculates polyhouse tunnel dryers, airflow blowers, and solar power packs for any crop harvest volume.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={() => onOpenQuoteModal && onOpenQuoteModal({ capacityNeeded: 'Custom Solar Dryer Project' })}
              className="px-6 py-3.5 bg-green-600 hover:bg-green-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all hover:scale-105 flex items-center space-x-2 cursor-pointer"
            >
              <span>{t('getQuote')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="tel:+918903852623"
              className="px-5 py-3.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold text-xs rounded-xl transition-all flex items-center space-x-1.5 shadow-xs"
            >
              <PhoneCall className="w-4 h-4 text-green-600" />
              <span>Call Support</span>
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
        >
          <div 
            className="relative bg-white rounded-3xl max-w-5xl w-full max-h-[95vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-black uppercase bg-green-600 text-white px-2 py-0.5 rounded">
                  PAGE {selectedBrochureModalPage.page}
                </span>
                <h3 className="text-sm font-bold text-white line-clamp-1">
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
                  <span className="hidden sm:inline">Save Image</span>
                </a>
                <button
                  onClick={() => setSelectedBrochureModalPage(null)}
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
                  const targetModel = officialDryerModels.find(m => m.id === selectedBrochureModalPage.id);
                  setSelectedBrochureModalPage(null);
                  if (onOpenQuoteModal) onOpenQuoteModal({ capacityNeeded: selectedBrochureModalPage.title });
                }}
                className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow cursor-pointer shrink-0"
              >
                Enquire About This Model
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
