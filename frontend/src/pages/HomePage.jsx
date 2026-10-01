import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ROICalculator from '../components/ROICalculator';
import ProductModelShowcase from '../components/ProductModelShowcase';
import MapComponent from '../components/MapComponent';
import { sampleReviews, dryerModelsData, cropMatrixData } from '../data/sampleData';
import { workingPrincipleSteps } from '../data/zenitekBrochureData';
import { useLanguage } from '../context/LanguageContext';
import {
  Sun, ShieldCheck, Award, ArrowRight, Play, CheckCircle2, TrendingUp, Zap, ChevronRight, ChevronLeft, MapPin, Search, SlidersHorizontal, Sprout, Wind, Droplets, Cpu, Shield, Sparkles,
  ChevronDown, ChevronUp, Eye
} from 'lucide-react';

export default function HomePage({ onOpenQuoteModal, onOpenDetailModal }) {
  const { t } = useLanguage();
  const [expandedModels, setExpandedModels] = useState({});

  const toggleModelExpand = (id) => {
    setExpandedModels(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const [quickForm, setQuickForm] = useState({
    name: '',
    phone: '',
    district: '',
    capacityNeeded: 'Commercial Polyhouse Tunnel Dryer (100-500 kg)',
    cropType: 'Copra/Coconut',
    message: ''
  });
  const [matrixSearch, setMatrixSearch] = useState('');
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);

  const heroSlides = [
    {
      image: '/hero-carousel/slide-1.jpg',
      title: 'Commercial Solar Polyhouse Tunnel',
      subtitle: 'ZeniTEK Agricultural Field Installation',
      badge: 'MNRE Enlisted',
      objectPos: 'object-cover object-center',
    },
    {
      image: '/hero-carousel/slide-2.jpg',
      title: 'SOLDRY Inverted Parabolic Arch Dryer',
      subtitle: 'Continuous Aerodynamic Airflow Architecture',
      badge: 'ISO 9001:2015 Quality',
      objectPos: 'object-cover object-center',
    },
    {
      image: '/hero-carousel/slide-3.jpg',
      title: 'Solar PV Apex & Concrete Foundation',
      subtitle: 'Heavy-Duty All-Weather Construction',
      badge: 'Govt Subsidy Eligible',
      objectPos: 'object-cover object-center',
    },
  ];

  // Auto-swap every 5 seconds in continuous loop (Tesla style)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const handlePrevSlide = () => {
    setCurrentHeroSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const handleNextSlide = () => {
    setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const filteredCropMatrix = cropMatrixData.filter(item =>
    item.crop.toLowerCase().includes(matrixSearch.toLowerCase()) ||
    item.benefit.toLowerCase().includes(matrixSearch.toLowerCase())
  );

  const handleQuickSubmit = (e) => {
    e.preventDefault();
    onOpenQuoteModal(quickForm);
  };

  return (
    <div className="bg-slate-50 text-slate-900 w-full max-w-full overflow-x-hidden">
      
      {/* SECTION 1: HERO SECTION WITH 4-IMAGE TESLA-STYLE AUTO-CAROUSEL (5S LOOP) */}
      <section className="relative pt-12 pb-16 lg:pt-20 lg:pb-24 section-odd w-full overflow-hidden min-h-[600px] lg:min-h-[680px] flex items-center select-none">
        
        {/* Carousel Background Images (Smooth Cross-fade, 100% HD View) */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {heroSlides.map((slide, idx) => (
            <div
              key={slide.image}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                idx === currentHeroSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className={`w-full h-full ${slide.objectPos} select-none`}
              />
            </div>
          ))}

          {/* Minimal Soft Left-Gradient on Mobile only, Transparent on Large Desktop where Left is Open Sky */}
          <div className="absolute inset-0 z-15 bg-gradient-to-r from-white/95 via-white/80 to-transparent sm:from-white/70 sm:via-white/30 sm:to-transparent lg:from-transparent pointer-events-none" />
        </div>

        {/* Tesla-Style Left & Right Navigation Controls with Dedicated Clearance */}
        <button
          onClick={handlePrevSlide}
          aria-label="Previous Slide"
          className="absolute left-2 sm:left-4 lg:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/90 hover:bg-white text-slate-800 hover:text-[#123B92] border border-slate-200/90 shadow-xl flex items-center justify-center transition-all active:scale-90 cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <button
          onClick={handleNextSlide}
          aria-label="Next Slide"
          className="absolute right-2 sm:right-4 lg:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/90 hover:bg-white text-slate-800 hover:text-[#123B92] border border-slate-200/90 shadow-xl flex items-center justify-center transition-all active:scale-90 cursor-pointer"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Foreground Content (Left-Aligned with Dedicated Padding to Clear Arrow Buttons) */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-12 sm:px-16 lg:px-20">
          <div className="max-w-xl lg:max-w-2xl xl:max-w-3xl space-y-6">
            
            {/* Top Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/95 border border-[#123B92]/30 text-[#123B92] text-xs font-bold shadow-md max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
              <Sun className="w-4 h-4 text-[#002DC2] animate-spin-slow shrink-0" />
              <span className="truncate">{t('heroBadge')}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#123B92] leading-tight drop-shadow-sm">
              {t('heroTitle1')} <br />
              <span className="text-[#002DC2]">
                {t('heroTitle2')}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base lg:text-lg text-slate-800 leading-relaxed font-bold max-w-xl drop-shadow-2xs">
              {t('heroSubtitle')}
            </p>

            {/* CTA Buttons - Tesla-Style High-Impact Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2.5 sm:space-y-0 sm:space-x-4 pt-2">
              <a
                href="#roi-calculator"
                className="px-6 py-3.5 sm:px-8 sm:py-4 bg-[#23AC39] hover:bg-[#1f9632] text-white font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-lg transition-all text-center flex items-center justify-center space-x-2 cursor-pointer hover:shadow-xl active:scale-95"
              >
                <span>{t('calcSavings')}</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <Link
                to="/dryers"
                className="px-6 py-3.5 sm:px-8 sm:py-4 bg-white hover:bg-slate-50 border-2 border-[#123B92] text-[#123B92] font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all text-center flex items-center justify-center space-x-2 shadow-md active:scale-95"
              >
                <span>{t('exploreModels')}</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Stat Highlights Row - Clean Frosted Glass Card with Dividers */}
            <div className="pt-2">
              <div className="bg-white/90 backdrop-blur-md border border-slate-200/90 shadow-xl rounded-2xl p-4 sm:p-5 max-w-lg grid grid-cols-3 gap-3 sm:gap-4 divide-x divide-slate-200">
                <div className="pr-2">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-black text-[#123B92] tracking-tight whitespace-nowrap">1,200+</div>
                  <div className="text-[11px] sm:text-xs text-slate-700 font-bold mt-1 leading-snug">{t('dryersInstalled')}</div>
                </div>
                <div className="px-2 sm:px-3">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-black text-[#002DC2] tracking-tight whitespace-nowrap">500+ MT</div>
                  <div className="text-[11px] sm:text-xs text-slate-700 font-bold mt-1 leading-snug">{t('foodSaved')}</div>
                </div>
                <div className="pl-2 sm:pl-3">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-black text-[#23AC39] tracking-tight whitespace-nowrap">40-60%</div>
                  <div className="text-[11px] sm:text-xs text-slate-700 font-bold mt-1 leading-snug">{t('subsidyHelp')}</div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Dynamic Verified Site Badge in Bottom Right */}
        <div className="absolute bottom-6 right-6 lg:right-16 z-20 hidden sm:flex items-center space-x-3 bg-white/95 px-4 py-2.5 rounded-2xl border border-slate-200/90 shadow-xl transition-all">
          <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 font-bold shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">{heroSlides[currentHeroSlide].title}</div>
            <div className="text-[10px] text-green-700 font-bold">{heroSlides[currentHeroSlide].subtitle}</div>
          </div>
          <span className="text-[10px] bg-green-700 text-white font-bold px-2 py-0.5 rounded uppercase shrink-0">
            {heroSlides[currentHeroSlide].badge}
          </span>
        </div>

        {/* Tesla-Style Bottom Center Pagination Dots */}
        <div className="absolute bottom-6 inset-x-0 z-20 flex items-center justify-center space-x-2">
          {heroSlides.map((slide, idx) => (
            <button
              key={slide.image}
              onClick={() => setCurrentHeroSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                currentHeroSlide === idx
                  ? 'w-8 bg-slate-900 shadow-md'
                  : 'w-2.5 bg-slate-400 hover:bg-slate-600'
              }`}
            />
          ))}
        </div>
      </section>


      {/* SECTION 2: TRUST BAR (EVEN SECTION - SOFT OFF-WHITE WITH BREAK LINES) */}
      <section className="w-full section-even py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            
            {/* Card 1: MNRE Approved & Enlisted */}
            <div className="flex items-center space-x-4 px-6 py-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all">
              <ShieldCheck className="w-7 h-7 text-[#123B92] stroke-[1.8] shrink-0" />
              <div className="text-left">
                <div className="text-sm sm:text-[15px] font-bold text-[#123B92] tracking-tight leading-snug">
                  {t('mnreBadge')}
                </div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">
                  Government Ministry Approved
                </div>
              </div>
            </div>

            {/* Card 2: ISO 9001:2015 Certified Quality */}
            <div className="flex items-center space-x-4 px-6 py-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all">
              <Award className="w-7 h-7 text-[#123B92] stroke-[1.8] shrink-0" />
              <div className="text-left">
                <div className="text-sm sm:text-[15px] font-bold text-[#123B92] tracking-tight leading-snug">
                  {t('isoBadge')}
                </div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">
                  Precision Engineering Standard
                </div>
              </div>
            </div>

            {/* Card 3: 100% Eligible for State Subsidies */}
            <div className="flex items-center space-x-4 px-6 py-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all">
              <Zap className="w-7 h-7 text-[#123B92] stroke-[1.8] shrink-0" />
              <div className="text-left">
                <div className="text-sm sm:text-[15px] font-bold text-[#123B92] tracking-tight leading-snug">
                  {t('subsidyBadge2')}
                </div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">
                  Agri & NABARD Subsidies
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* SECTION 3: INTERACTIVE ROI CALCULATOR (ODD SECTION - CRISP WHITE) */}
      <section className="w-full section-odd py-8 sm:py-10" id="roi-calculator">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ROICalculator onSelectModelQuote={(modelKey, kg, crop, fullModel) => onOpenQuoteModal({ 
            capacityNeeded: modelKey, 
            cropType: crop,
            message: `Inquiry for ${fullModel || modelKey} (${kg} kg/batch of ${crop})`
          })} />
        </div>
      </section>


      {/* SECTION 4: PRODUCT MODEL SHOWCASE (TESLA HORIZONTAL CAROUSEL - ZERO MARGIN/PADDING FULL BLEED) */}
      <section className="w-full section-even py-8 sm:py-12 px-0 mx-0 overflow-x-hidden">
        <ProductModelShowcase 
          onOpenQuoteModal={onOpenQuoteModal}
          onOpenDetailModal={onOpenDetailModal}
        />
      </section>


      {/* SECTION 4.25 & 4.5: WORKING PRINCIPLE & SPECIFICATION MATRIX (ODD SECTION - CRISP WHITE) */}
      <section className="w-full section-odd py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Working Principle */}
          <div className="bg-white text-black p-6 sm:p-10 rounded-3xl shadow-md space-y-8 border border-[#123B92]/20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#123B92]/20 pb-6">
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-[#123B92] uppercase tracking-widest bg-[#F0F4FD] border border-[#123B92]/30 px-3 py-1 rounded-full inline-flex items-center">
                  <Sun className="w-3.5 h-3.5 mr-1.5 text-[#002DC2] animate-spin-slow" /> PDF Technical Guide • Page 8
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#123B92]">
                  Solar Dryer Working Principle
                </h2>
                <p className="text-xs sm:text-sm text-black/70 font-medium max-w-2xl">
                  Smart, Efficient, Sustainable — 7-step thermodynamic cycle engineered by ZeniTEK for 40% faster moisture reduction with zero contamination.
                </p>
              </div>

              <div className="flex items-center space-x-2 text-xs font-bold text-white bg-[#23AC39] px-4 py-2 rounded-2xl border border-[#23AC39] shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
                <span>40% Faster Than Open-Sun</span>
              </div>
            </div>

            {/* 7 Process Steps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {workingPrincipleSteps.map((stepItem) => (
                <div
                  key={stepItem.step}
                  className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                    stepItem.step === 7
                      ? 'bg-white border-2 border-[#23AC39] shadow-sm md:col-span-2 lg:col-span-2'
                      : 'bg-[#F0F4FD] hover:bg-white border-[#123B92]/20 hover:border-[#002DC2]'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="w-8 h-8 rounded-xl bg-[#123B92] text-white font-black text-xs flex items-center justify-center shadow">
                        {stepItem.step}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-[#123B92] tracking-wider">
                        {stepItem.subtitle}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-black leading-snug">
                      {stepItem.title}
                    </h4>

                    <p className="text-xs text-black/70 leading-relaxed font-normal">
                      {stepItem.description}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-[#123B92]/10 flex items-center text-[10px] text-[#002DC2] font-bold">
                    <CheckCircle2 className="w-3 h-3 mr-1 text-[#002DC2]" /> Step {stepItem.step} of 7
                  </div>
                </div>
              ))}
            </div>

            {/* Diagram Preview Banner */}
            <div className="bg-[#F0F4FD] p-4 rounded-2xl border border-[#123B92]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-white border border-[#123B92]/20 flex items-center justify-center text-xl shrink-0">
                  ☀️
                </div>
                <div className="text-xs">
                  <div className="font-bold text-[#123B92]">Need Engineering Consultation for Your Farm Crop?</div>
                  <div className="text-black/70">Our engineers custom-calculate airflow CFM, tray loading, and solar panel arrays for your exact daily tonnage.</div>
                </div>
              </div>

              <button
                onClick={() => onOpenQuoteModal({ capacityNeeded: 'Technical Engineering Sizing' })}
                className="px-5 py-2.5 bg-[#23AC39] hover:bg-[#002DC2] text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow shrink-0 cursor-pointer"
              >
                Get Free Sizing Report
              </button>
            </div>
          </div>

          {/* Model Lineup Comparison Table */}
          <div className="space-y-6">
            <div className="text-center max-w-3xl mx-auto space-y-2">
              <span className="text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200 inline-flex items-center shadow-sm">
                <SlidersHorizontal className="w-3.5 h-3.5 mr-1.5 text-blue-600" /> Official Specification Matrix
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-blue-950">
                ZeniTEK Model Lineup Comparison
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                Side-by-side engineering specifications from our official technical product brochures
              </p>
            </div>

            <div className="bg-white rounded-3xl overflow-x-auto border border-slate-200 shadow-md">
              <table className="w-full text-left border-collapse min-w-[760px]">
                <thead>
                  <tr className="bg-[#1e3a8a] text-white text-xs uppercase font-bold tracking-wider">
                    <th className="p-4 rounded-tl-3xl">SPECIFICATION PARAMETER</th>
                    <th className="p-4 text-blue-100">SUNDRY 50 (BOX TYPE)</th>
                    <th className="p-4 text-green-300">SOLDRY 1210 - 150 (TUNNEL)</th>
                    <th className="p-4 rounded-tr-3xl text-amber-300">SOLDRY 1210 - 300 (COMMERCIAL)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs text-slate-700 font-medium">
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold text-slate-900">Floor Footprint Area</td>
                    <td className="p-4 font-semibold text-slate-800">16 sq.ft (4x4 ft)</td>
                    <td className="p-4 font-bold text-blue-700">150 sq.ft (12.5x12.5 ft)</td>
                    <td className="p-4 font-bold text-green-700">300 sq.ft (12.5x24.5 ft)</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold text-slate-900">Food-Grade Tray Drying Area</td>
                    <td className="p-4 font-semibold text-slate-800">50 sq.ft (8 SS304 Trays)</td>
                    <td className="p-4 font-bold text-blue-700">225 sq.ft (36 Trays)</td>
                    <td className="p-4 font-bold text-green-700">450 sq.ft (72 Trays)</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold text-slate-900">Batch Loading Capacity</td>
                    <td className="p-4">20 kg – 100 kg</td>
                    <td className="p-4 font-bold text-blue-700">60 kg – 300 kg</td>
                    <td className="p-4 font-bold text-green-700">180 kg – 900 kg</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold text-slate-900">Trolley & Material Handling</td>
                    <td className="p-4">Fixed Tray Racks with 4" Casters</td>
                    <td className="p-4">9 Trolleys (4 trays each, 2" casters)</td>
                    <td className="p-4">18 Trolleys (4 trays each, 2" casters)</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold text-slate-900">Solar Power System</td>
                    <td className="p-4">20W 24V DC + Battery</td>
                    <td className="p-4">110W 24V DC + Victron MPPT</td>
                    <td className="p-4">220W 24V DC + Victron MPPT</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold text-slate-900">Airflow & Ventilation</td>
                    <td className="p-4">4 Circulation + 2 Exhaust Fans</td>
                    <td className="p-4">4 Circulation + 2 Exhaust Fans</td>
                    <td className="p-4">4 Circulation + 3 Exhaust Fans</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold text-slate-900">Auxiliary Heating Backup</td>
                    <td className="p-4">750W Heater with Thermostat</td>
                    <td className="p-4">1 kW to 6 kW with Fan & Thermostat</td>
                    <td className="p-4">1 kW to 6 kW with Fan & Thermostat</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold text-slate-900">Automation & Control</td>
                    <td className="p-4">Temp & Timer Control</td>
                    <td className="p-4 font-bold text-blue-700">PLC with 4" Touchscreen HMI</td>
                    <td className="p-4 font-bold text-green-700">PLC with 4" Touchscreen HMI</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold text-slate-900">Government Subsidy Eligibility</td>
                    <td className="p-4">40% Micro-Enterprise Subsidy</td>
                    <td className="p-4 font-bold text-green-700">50% - 60% State Agri/Horti</td>
                    <td className="p-4 font-bold text-blue-700">50% - 60% State Agri/Horti</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </section>


      {/* SECTION 4.6: CROP MOISTURE PARAMETER MATRIX (EVEN SECTION - SOFT OFF-WHITE) */}
      <section className="w-full section-even py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="space-y-2">
                <span className="text-xs font-bold text-green-700 uppercase tracking-widest bg-green-50 px-3.5 py-1.5 rounded-full border border-green-200 inline-flex items-center shadow-sm">
                  <Sprout className="w-3.5 h-3.5 mr-1.5 text-green-600" /> {t('matrixCropBadge')}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950">
                  {t('matrixCropTitle')}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 font-medium">
                  {t('matrixCropSubtitle')}
                </p>
              </div>

              <div className="relative w-full md:w-80 shrink-0">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  value={matrixSearch}
                  onChange={(e) => setMatrixSearch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-inner"
                />
              </div>
            </div>

            <div className="rounded-2xl overflow-x-auto border border-slate-200">
              <table className="w-full text-left border-collapse min-w-[750px]">
                <thead>
                  <tr className="bg-[#1e3a8a] text-white text-xs uppercase font-bold tracking-wider">
                    <th className="p-4">TARGET PRODUCE</th>
                    <th className="p-4">FRESH MOISTURE %</th>
                    <th className="p-4 text-green-300">DRIED MOISTURE %</th>
                    <th className="p-4">ZENITEK SOLAR TIME</th>
                    <th className="p-4">OPEN SUN TIME</th>
                    <th className="p-4">KEY PROFIT BENEFIT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs text-slate-700 font-medium">
                  {filteredCropMatrix.map((item, idx) => (
                    <tr key={idx} className="hover:bg-blue-50/50 transition-colors">
                      <td className="p-4 font-bold text-slate-900">{item.crop}</td>
                      <td className="p-4 text-rose-600 font-mono font-semibold">{item.freshMoisture}</td>
                      <td className="p-4 text-green-700 font-mono font-bold">{item.targetMoisture}</td>
                      <td className="p-4 font-bold text-blue-700">{item.solarDays}</td>
                      <td className="p-4 text-slate-500">{item.openSunDays}</td>
                      <td className="p-4 text-slate-800">{item.benefit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>


      {/* SECTION 5: INTERACTIVE INSTALLATION MAP (ODD SECTION - CRISP WHITE) */}
      <section className="w-full section-odd py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold text-green-700 uppercase tracking-widest bg-green-50 px-3.5 py-1 rounded-full border border-green-200 inline-flex items-center">
              <MapPin className="w-3.5 h-3.5 mr-1.5 text-green-600" /> GEOGRAPHICAL FOOTPRINT & FIELD SITES
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-blue-950">
              Active Solar Dryer Installations Map
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Explore live operational sites across Tamil Nadu, Kerala, Andhra Pradesh & Karnataka. Hover over any marker for instant site preview or click to open full installation metrics and video.
            </p>
          </div>

          <MapComponent onSelectProjectQuote={(project) => onOpenQuoteModal({ cropType: project.cropDrying, capacityNeeded: project.capacity, district: project.locationName })} />
        </div>
      </section>


      {/* SECTION 6: APPLICATIONS SHOWCASE (EVEN SECTION - SOFT OFF-WHITE) */}
      <section className="w-full section-even py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-200 pb-6">
            <div>
              <span className="text-xs font-bold text-green-700 uppercase tracking-widest">VERSATILE PERFORMANCE</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950 mt-1">{t('whatCanYouDry')}</h2>
            </div>
            <Link to="/applications" className="mt-4 md:mt-0 text-xs font-bold text-blue-700 hover:underline flex items-center">
              {t('viewAllCrops')} <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-white rounded-2xl space-y-3 border border-slate-200 shadow-sm hover:border-blue-500 transition-all">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xl">🥥</div>
              <h3 className="text-base font-bold text-slate-900">Copra & Coconut</h3>
              <p className="text-xs text-slate-600">Dries fresh coconut moisture from 52% down to 6% in 2.5 days. Retains white kernel grade.</p>
            </div>

            <div className="p-6 bg-white rounded-2xl space-y-3 border border-slate-200 shadow-sm hover:border-blue-500 transition-all">
              <div className="w-10 h-10 rounded-xl bg-green-50 text-green-700 flex items-center justify-center font-bold text-xl">🌿</div>
              <h3 className="text-base font-bold text-slate-900">Moringa & Herbs</h3>
              <p className="text-xs text-slate-600">100% dust-free green color retention. Preserves chlorophyll for export powders.</p>
            </div>

            <div className="p-6 bg-white rounded-2xl space-y-3 border border-slate-200 shadow-sm hover:border-blue-500 transition-all">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold text-xl">🌶️</div>
              <h3 className="text-base font-bold text-slate-900">Chillies & Spices</h3>
              <p className="text-xs text-slate-600">Eliminates rain mold and aflatoxins. Locks natural volatile oils in pepper & chillies.</p>
            </div>

            <div className="p-6 bg-white rounded-2xl space-y-3 border border-slate-200 shadow-sm hover:border-blue-500 transition-all">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center font-bold text-xl">🐟</div>
              <h3 className="text-base font-bold text-slate-900">Marine & Seafood</h3>
              <p className="text-xs text-slate-600">Hygienic enclosed drying prevents fly infestation and preserves omega oils.</p>
            </div>
          </div>
        </div>
      </section>


      {/* SECTION 6.5: ABOUT ZENITEK (TOWARDS A SUSTAINABLE FUTURE) */}
      <section className="w-full section-odd py-16 sm:py-24 bg-gradient-to-b from-white via-[#F0F4FD]/40 to-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left 6 cols: About Info */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <span className="text-sm font-black text-[#002DC2] uppercase tracking-wider bg-white border border-[#002DC2]/25 px-4 py-2 rounded-full inline-flex items-center shadow-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-[#23AC39] animate-pulse mr-2" />
                About ZeniTEK • Erode, Tamil Nadu
              </span>
              
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight leading-tight">
                Towards a <span className="text-[#002DC2]">Sustainable Future</span>
              </h2>

              <p className="text-base sm:text-lg text-slate-700 font-medium leading-relaxed">
                Established in 2021 in Erode, Tamil Nadu, ZeniTEK is a renewable-energy engineering pioneer. We design, manufacture, and erect high-efficiency systems combining thermal engineering, solar power, automation, and applied research.
              </p>

              {/* 4 Core Pillars Pills */}
              <div className="grid grid-cols-2 gap-3.5 pt-1">
                <div className="p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-xs flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F0F4FD] text-[#002DC2] flex items-center justify-center font-bold shrink-0">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-black text-slate-900">Solar Thermal</div>
                    <div className="text-xs text-slate-500 font-semibold">PTC & Scheffler</div>
                  </div>
                </div>

                <div className="p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-xs flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#23AC39] flex items-center justify-center font-bold shrink-0">
                    <Sprout className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-black text-slate-900">Agri-Solar</div>
                    <div className="text-xs text-slate-500 font-semibold">Dryers & Storage</div>
                  </div>
                </div>

                <div className="p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-xs flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold shrink-0">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-black text-slate-900">Photovoltaics</div>
                    <div className="text-xs text-slate-500 font-semibold">Lab Test Rigs</div>
                  </div>
                </div>

                <div className="p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-xs flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-black text-slate-900">Applied R&D</div>
                    <div className="text-xs text-slate-500 font-semibold">IIT / Anna Univ</div>
                  </div>
                </div>
              </div>

              {/* Action Link to /about */}
              <div className="pt-2">
                <Link
                  to="/about"
                  className="inline-flex items-center space-x-2.5 px-7 py-3.5 bg-[#002DC2] hover:bg-[#123B92] text-white font-extrabold text-sm uppercase tracking-wider rounded-2xl shadow-md transition-all hover:scale-102"
                >
                  <span>Explore Our History & Landmark Installations</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right 6 cols: Dual Photo Collage with floating client badge */}
            <div className="lg:col-span-6 relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="rounded-2xl overflow-hidden shadow-md border border-slate-200 group">
                    <img
                      src="/real-photos/zenitek_photo_18.jpeg"
                      alt="Parabolic Solar Thermal Installation"
                      className="w-full h-44 sm:h-52 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="p-3 bg-white text-center">
                      <div className="text-sm font-black text-slate-900">37.5 Sq.m Parabolic Trough</div>
                      <div className="text-xs text-slate-500 font-semibold mt-0.5">Anna Univ & DST Funded</div>
                    </div>
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-md border border-slate-200 group">
                    <img
                      src="/real-photos/zenitek_photo_27.jpeg"
                      alt="SUNDRY 50 Clean Box Dryer"
                      className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="p-3 bg-white text-center">
                      <div className="text-sm font-black text-slate-900">SUNDRY 50 Box Dryer</div>
                      <div className="text-xs text-slate-500 font-semibold mt-0.5">Commercial Food Drying</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-6">
                  <div className="rounded-2xl overflow-hidden shadow-md border border-slate-200 group">
                    <img
                      src="/real-photos/zenitek_photo_04.jpeg"
                      alt="SOLDRY 1210 Polyhouse Tunnel"
                      className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="p-3 bg-white text-center">
                      <div className="text-sm font-black text-slate-900">192 Sq.m Solar Dryer</div>
                      <div className="text-xs text-slate-500 font-semibold mt-0.5">SELCO Foundation Partner</div>
                    </div>
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-md border border-slate-200 group">
                    <img
                      src="/real-photos/zenitek_photo_23.jpeg"
                      alt="Active Dehydration Trays"
                      className="w-full h-44 sm:h-52 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="p-3 bg-white text-center">
                      <div className="text-sm font-black text-slate-900">Internal Solar Polyhouse</div>
                      <div className="text-xs text-slate-500 font-semibold mt-0.5">Zero Contamination</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Verified Client Pill */}
              <div className="absolute -bottom-4 right-4 bg-white/95 backdrop-blur-md px-5 py-3 rounded-2xl shadow-xl border border-slate-200 flex items-center space-x-3">
                <Award className="w-6 h-6 text-[#002DC2] shrink-0" />
                <div className="text-left">
                  <div className="text-sm font-black text-slate-900">Trusted By Premier Institutes</div>
                  <div className="text-xs font-bold text-[#23AC39]">IIT Bhubaneswar • Anna University • Mitsui</div>
                </div>
              </div>
            </div>

          </div>

          {/* Institutional Partner Logos Banner */}
          <div className="pt-6 border-t border-slate-200">
            <div className="text-center text-sm font-black text-slate-500 uppercase tracking-wider pb-4">
              Collaborative Deployments & Key Industry Clients
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-slate-900 text-sm sm:text-base font-black">
              <span className="px-5 py-2.5 bg-white rounded-2xl border border-slate-200 shadow-xs">IIT Bhubaneswar</span>
              <span className="px-5 py-2.5 bg-white rounded-2xl border border-slate-200 shadow-xs">Anna University</span>
              <span className="px-5 py-2.5 bg-white rounded-2xl border border-slate-200 shadow-xs">SRM University</span>
              <span className="px-5 py-2.5 bg-white rounded-2xl border border-slate-200 shadow-xs">Mitsui Chemicals</span>
              <span className="px-5 py-2.5 bg-white rounded-2xl border border-slate-200 shadow-xs">Indo-MIM</span>
              <span className="px-5 py-2.5 bg-white rounded-2xl border border-slate-200 shadow-xs">SELCO Foundation</span>
            </div>
          </div>

        </div>
      </section>


      {/* SECTION 7: FARMER STORIES & TESTIMONIALS (ODD SECTION - CRISP WHITE) */}
      <section className="w-full section-odd py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold text-green-700 uppercase tracking-widest bg-green-50 px-3.5 py-1 rounded-full border border-green-200">
              FARMER SUCCESS STORIES
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-blue-950">
              {t('trustedBy')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Real feedback from coconut growers, spice exporters, and food entrepreneurs across South India.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sampleReviews.map(rev => (
              <div key={rev._id} className="bg-slate-50/80 rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-amber-400">
                      {'★'.repeat(rev.rating || 5)}
                    </div>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                      Verified User
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium italic">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900">{rev.name}</h4>
                    <div className="text-[11px] font-semibold text-green-700">{rev.role}</div>
                    <div className="text-[10px] text-slate-400 flex items-center mt-0.5">
                      <MapPin className="w-3 h-3 mr-0.5 text-slate-400" /> {rev.location}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* SECTION 8: LEAD CAPTURE ENQUIRY FORM (EVEN SECTION - SOFT OFF-WHITE) */}
      <section className="w-full section-even py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-[#123B92] shadow-xl text-black">
            <div className="max-w-4xl mx-auto text-center space-y-3 mb-8">
              <h2 className="text-2xl sm:text-3xl font-black text-[#123B92]">{t('quickFormTitle')}</h2>
              <p className="text-xs text-black/70">{t('quickFormDesc')}</p>
            </div>

            <form onSubmit={handleQuickSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#123B92] mb-1">{t('yourName')} *</label>
                  <input
                    type="text"
                    required
                    placeholder={`${t('yourName')} *`}
                    value={quickForm.name}
                    onChange={(e) => setQuickForm({ ...quickForm, name: e.target.value })}
                    className="w-full bg-[#F0F4FD] border border-[#123B92]/30 text-black rounded-xl px-4 py-3 text-xs placeholder-black/50 font-medium focus:border-[#002DC2] focus:ring-1 focus:ring-[#002DC2]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#123B92] mb-1">{t('whatsappNum')} *</label>
                  <input
                    type="tel"
                    required
                    placeholder={`${t('whatsappNum')} *`}
                    value={quickForm.phone}
                    onChange={(e) => setQuickForm({ ...quickForm, phone: e.target.value })}
                    className="w-full bg-[#F0F4FD] border border-[#123B92]/30 text-black rounded-xl px-4 py-3 text-xs placeholder-black/50 font-medium focus:border-[#002DC2] focus:ring-1 focus:ring-[#002DC2]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#123B92] mb-1">{t('districtCity')} *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tamil Nadu / Coimbatore *"
                    value={quickForm.district}
                    onChange={(e) => setQuickForm({ ...quickForm, district: e.target.value })}
                    className="w-full bg-[#F0F4FD] border border-[#123B92]/30 text-black rounded-xl px-4 py-3 text-xs placeholder-black/50 font-medium focus:border-[#002DC2] focus:ring-1 focus:ring-[#002DC2]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-blue-200 mb-1">{t('dryerModel')} *</label>
                  <select
                    value={quickForm.capacityNeeded}
                    onChange={(e) => setQuickForm({ ...quickForm, capacityNeeded: e.target.value })}
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl px-4 py-3 text-xs font-medium cursor-pointer"
                  >
                    <option value="Portable DIY Solar Dryer (10-50 kg)">Portable DIY Solar Dryer (10-50 kg)</option>
                    <option value="Commercial Polyhouse Tunnel Dryer (100-500 kg)">Commercial Polyhouse Tunnel Dryer (100-500 kg)</option>
                    <option value="Multi-Tunnel Industrial Hybrid Dryer (1 Ton+)">Multi-Tunnel Industrial Hybrid Dryer (1 Ton+)</option>
                    <option value="Custom Dryer Sizing Consult">Custom Dryer Sizing Consult</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-blue-200 mb-1">{t('targetCrop')} *</label>
                  <select
                    value={quickForm.cropType}
                    onChange={(e) => setQuickForm({ ...quickForm, cropType: e.target.value })}
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl px-4 py-3 text-xs font-medium cursor-pointer"
                  >
                    <option value="Copra/Coconut">Copra / Coconut</option>
                    <option value="Moringa/Herbs">Moringa / Herbs</option>
                    <option value="Spices/Chillies">Spices / Chillies</option>
                    <option value="Fruits/Veggies">Fruits / Veggies</option>
                    <option value="Fish/Seafood">Fish / Marine</option>
                    <option value="Other">Other Agricultural / Industrial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-blue-200 mb-1">{t('descriptionReqs')}</label>
                  <input
                    type="text"
                    placeholder="Mention target moisture, location details or questions..."
                    value={quickForm.message}
                    onChange={(e) => setQuickForm({ ...quickForm, message: e.target.value })}
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl px-4 py-3 text-xs placeholder-slate-400 font-medium"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-center">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 bg-green-600 hover:bg-green-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 hover:scale-105"
                >
                  <span>{t('getPricingSubsidyQuote')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

    </div>
  );
}
