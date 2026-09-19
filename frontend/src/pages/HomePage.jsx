import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ROICalculator from '../components/ROICalculator';
import MapComponent from '../components/MapComponent';
import { sampleReviews, dryerModelsData, cropMatrixData } from '../data/sampleData';
import { workingPrincipleSteps } from '../data/zenitekBrochureData';
import { useLanguage } from '../context/LanguageContext';
import {
  Sun, ShieldCheck, Award, ArrowRight, Play, CheckCircle2, TrendingUp, Zap, ChevronRight, MapPin, Search, SlidersHorizontal, Sprout, Wind, Droplets, Cpu, Shield, Sparkles
} from 'lucide-react';

export default function HomePage({ onOpenQuoteModal, onOpenDetailModal }) {
  const { t } = useLanguage();
  const [quickForm, setQuickForm] = useState({
    name: '',
    phone: '',
    district: '',
    capacityNeeded: 'Commercial Polyhouse Tunnel Dryer (100-500 kg)',
    cropType: 'Copra/Coconut',
    message: ''
  });
  const [matrixSearch, setMatrixSearch] = useState('');

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
      
      {/* SECTION 1: HERO SECTION (ODD SECTION - CRISP WHITE) */}
      <section className="relative pt-8 pb-12 lg:pt-14 lg:pb-16 section-odd w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#F0F4FD] border border-[#123B92]/30 text-[#123B92] text-xs font-bold max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                <Sun className="w-4 h-4 text-[#002DC2] animate-spin-slow shrink-0" />
                <span className="truncate">{t('heroBadge')}</span>
              </div>

              <h1 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#123B92] leading-tight">
                {t('heroTitle1')} <br />
                <span className="text-[#002DC2]">
                  {t('heroTitle2')}
                </span>
              </h1>

              <p className="text-xs sm:text-base text-black leading-relaxed font-medium max-w-2xl">
                {t('heroSubtitle')}
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2.5 sm:space-y-0 sm:space-x-4 pt-2">
                <a
                  href="#roi-calculator"
                  className="px-5 py-3.5 sm:px-6 sm:py-3.5 bg-[#00FB00] hover:bg-[#002DC2] text-black hover:text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow transition-all text-center flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>{t('calcSavings')}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <Link
                  to="/dryers"
                  className="px-5 py-3.5 sm:px-6 sm:py-3.5 bg-white border-2 border-[#123B92] text-[#123B92] hover:bg-[#002DC2] hover:text-white hover:border-[#002DC2] font-black text-xs rounded-2xl transition-all text-center flex items-center justify-center space-x-2 shadow-sm"
                >
                  <span>{t('exploreModels')}</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="pt-5 border-t border-[#123B92]/20 grid grid-cols-3 gap-2 sm:gap-4">
                <div>
                  <div className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-black text-[#123B92]">1,200+</div>
                  <div className="text-[10px] xs:text-[11px] sm:text-xs text-black/70 font-semibold mt-0.5">{t('dryersInstalled')}</div>
                </div>
                <div>
                  <div className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-black text-[#002DC2]">500+ MT</div>
                  <div className="text-[10px] xs:text-[11px] sm:text-xs text-black/70 font-semibold mt-0.5">{t('foodSaved')}</div>
                </div>
                <div>
                  <div className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-black text-black">40-60%</div>
                  <div className="text-[10px] xs:text-[11px] sm:text-xs text-black/70 font-semibold mt-0.5">{t('subsidyHelp')}</div>
                </div>
              </div>

            </div>

            {/* Right Visual Image (Unobstructed full image, zero text on image) */}
            <div className="lg:col-span-5 space-y-3">
              <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-xl group bg-slate-100">
                <img
                  src="/real-photos/zenitek_photo_18.jpeg"
                  alt="ZeniTEK Commercial Solar Polyhouse Dryer"
                  className="w-full h-[280px] xs:h-[340px] sm:h-[380px] object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Informational Details Card (Neatly below image, NOT covering the image) */}
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 font-bold shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Commercial Solar Polyhouse Tunnel</div>
                    <div className="text-[11px] text-green-700 font-semibold">ZeniTEK Manufacturing & Field Site</div>
                  </div>
                </div>
                <span className="text-[10px] bg-green-700 text-white font-bold px-2.5 py-1 rounded uppercase shrink-0">
                  MNRE Enlisted
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* SECTION 2: TRUST BAR (EVEN SECTION - SOFT OFF-WHITE WITH BREAK LINES) */}
      <section className="w-full section-even py-10 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 text-center">
            <div className="flex items-center justify-center space-x-3 p-4 bg-white rounded-2xl border border-[#123B92]/20 shadow-sm">
              <ShieldCheck className="w-6 h-6 text-[#002DC2] shrink-0" />
              <div className="text-left">
                <div className="text-sm font-bold text-[#123B92]">{t('mnreBadge')}</div>
                <div className="text-xs text-black/70">Government Ministry Approved</div>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-3 p-4 bg-white rounded-2xl border border-[#123B92]/20 shadow-sm">
              <Award className="w-6 h-6 text-[#002DC2] shrink-0" />
              <div className="text-left">
                <div className="text-sm font-bold text-[#123B92]">{t('isoBadge')}</div>
                <div className="text-xs text-black/70">Precision Engineering Standard</div>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-3 p-4 bg-white rounded-2xl border border-[#123B92]/20 shadow-sm">
              <Zap className="w-6 h-6 text-[#002DC2] shrink-0" />
              <div className="text-left">
                <div className="text-sm font-bold text-[#123B92]">{t('subsidyBadge2')}</div>
                <div className="text-xs text-black/70">Agri & NABARD Subsidies</div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* SECTION 3: INTERACTIVE ROI CALCULATOR (ODD SECTION - CRISP WHITE) */}
      <section className="w-full section-odd py-14 sm:py-20" id="roi-calculator">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ROICalculator onSelectModelQuote={(modelKey, kg, crop) => onOpenQuoteModal({ capacityNeeded: modelKey, cropType: crop })} />
        </div>
      </section>


      {/* SECTION 4: DRYER MODELS GRID (EVEN SECTION - SOFT OFF-WHITE) */}
      <section className="w-full section-even py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold text-[#123B92] uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-[#123B92]/30">
              SOLAR DRYER MODELS
            </span>
            <h2 className="text-2xl xs:text-3xl sm:text-4xl font-black text-[#123B92]">
              {t('modelsHeading')}
            </h2>
            <p className="text-xs sm:text-sm text-black/70">
              {t('modelsSubtitle')} (Click any model for complete specifications & photos)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {dryerModelsData.slice(0, 6).map(model => (
              <div key={model.id} className="bg-white rounded-3xl overflow-hidden border border-[#123B92]/20 hover:border-[#002DC2] transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-lg group">
                <div className="cursor-pointer" onClick={() => onOpenDetailModal && onOpenDetailModal(model)}>
                  {/* Clean Image Container (Zero text overlay on the image) */}
                  <div className="h-52 overflow-hidden bg-[#F0F4FD] border-b border-[#123B92]/20 flex items-center justify-center p-3">
                    <img src={model.imageUrl} alt={model.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  
                  <div className="p-5 sm:p-6 space-y-3.5">
                    {/* Badge and specs placed cleanly below the image */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="text-[10px] font-bold text-black/60 uppercase tracking-wider">{model.category}</span>
                      <div className="flex items-center gap-1.5">
                        {model.floorArea && (
                          <span className="bg-[#F0F4FD] text-[#123B92] font-bold text-[10px] px-2 py-0.5 rounded border border-[#123B92]/20">
                            {model.floorArea}
                          </span>
                        )}
                        <span className="bg-[#123B92] text-white font-bold text-[10px] uppercase px-2 py-0.5 rounded shadow-xs">
                          {model.badge}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-black group-hover:text-[#002DC2] transition-colors mt-0.5">{model.name}</h3>
                      <p className="text-xs font-black text-[#002DC2] mt-0.5">{model.capacityRange}</p>
                    </div>
                    <p className="text-xs text-black/70 leading-relaxed line-clamp-2">{model.description}</p>
                    
                    <div className="space-y-2 pt-2 border-t border-[#123B92]/10 text-xs">
                      {(model.keyFeatures || model.features || []).slice(0, 3).map((feat, idx) => (
                        <div key={idx} className="flex items-start text-black font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#002DC2] mr-2 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-5 sm:p-6 pt-0 space-y-2">
                  <button
                    onClick={() => onOpenDetailModal && onOpenDetailModal(model)}
                    className="w-full py-2.5 bg-white border-2 border-[#002DC2] text-[#002DC2] hover:bg-[#002DC2] hover:text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                  >
                    View Details & Brochure
                  </button>

                  <button
                    onClick={() => onOpenQuoteModal({ capacityNeeded: model.name })}
                    className="w-full py-2.5 sm:py-3 bg-[#00FB00] hover:bg-[#002DC2] text-black hover:text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <span>{t('reqQuote')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
            <Link
              to="/dryers"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-[#123B92] hover:bg-[#002DC2] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow transition-all hover:scale-105"
            >
              <span>Explore All Models & Profile Comparisons</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
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

              <div className="flex items-center space-x-2 text-xs font-black text-black bg-[#00FB00] px-4 py-2 rounded-2xl border border-[#00FB00] shrink-0">
                <Sparkles className="w-4 h-4 text-black" />
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
                      ? 'bg-white border-2 border-[#00FB00] shadow-sm md:col-span-2 lg:col-span-2'
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
                className="px-5 py-2.5 bg-[#00FB00] hover:bg-[#002DC2] text-black hover:text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow shrink-0 cursor-pointer"
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
