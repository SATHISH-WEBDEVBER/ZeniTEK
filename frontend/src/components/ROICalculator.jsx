import React, { useState, useEffect } from 'react';
import { cropCalculations } from '../data/sampleData';
import { 
  Calculator, CheckCircle2, ArrowRight, ChevronLeft, ChevronRight, Sparkles 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function ROICalculator({ onSelectModelQuote }) {
  const { t } = useLanguage();

  // Product Showcase Slides (Auto-swapping every 5 seconds)
  const productSlides = [
    {
      id: 'p1',
      image: '/real-photos/zenitek_photo_04.jpeg',
      title: 'SOLDRY 1210 Polyhouse Tunnel Dryer',
      subtitle: 'Commercial Agricultural Installation • 150–500 kg / batch',
      tag: 'Commercial Tunnel',
      cropFit: 'Copra, Chillies, Spices & Fruits',
      features: ['Food-Grade SS304 Trays', 'UV Double Polycarbonate', 'Zero Power Bills']
    },
    {
      id: 'p2',
      image: '/real-photos/zenitek_photo_18.jpeg',
      title: 'SOLDRY 1709 Parabolic Arch Tunnel',
      subtitle: 'Continuous Aerodynamic Airflow • 400–1,200 kg / batch',
      tag: 'Industrial Scale',
      cropFit: 'Turmeric, Ginger, Copra & Herbs',
      features: ['Inverted Parabolic Arch', 'All-Weather Galvanized Frame', '15+ Years Lifespan']
    },
    {
      id: 'p3',
      image: '/real-photos/zenitek_photo_01.jpeg',
      title: 'SUNDRY 50 Commercial Box Dryer',
      subtitle: '8-Tray Food-Grade Multi-Tier System • 20–100 kg / batch',
      tag: 'Portable Box Dryer',
      cropFit: 'Herbs, Moringa, Flowers & Mushroom Slices',
      features: ['Integrated Solar PV', 'Heavy-Duty Casters', 'Food-Grade SS304 Trays']
    },
    {
      id: 'p4',
      image: '/real-photos/zenitek_photo_24.jpeg',
      title: 'Precision Red Chilli Dehydration',
      subtitle: 'Uniform Solar Moisture Extraction • Grade-1 Quality',
      tag: 'Quality Processing',
      cropFit: 'Retains Vibrant Color & Natural Oleoresin',
      features: ['Aflatoxin-Free Sealed Protection', 'Zero Dust Contamination', '+22% Price Premium']
    },
    {
      id: 'p5',
      image: '/real-photos/zenitek_photo_02.jpeg',
      title: 'Walk-In Polyhouse Tunnel Interior',
      subtitle: 'Multi-Tier Ergonomic Trolley Architecture',
      tag: 'Walk-In Trolley Track',
      cropFit: 'Continuous Air Circulation Across Trays',
      features: ['Rapid Loading & Unloading', 'Active Circulation Blowers', 'Sanitized Operation']
    }
  ];

  const [currentProductSlide, setCurrentProductSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-swap sample photo every 5 seconds
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentProductSlide((prev) => (prev + 1) % productSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, productSlides.length]);

  const handlePrevSlide = () => {
    setCurrentProductSlide((prev) => (prev - 1 + productSlides.length) % productSlides.length);
  };

  const handleNextSlide = () => {
    setCurrentProductSlide((prev) => (prev + 1) % productSlides.length);
  };

  // Calculator State & Calculations
  const [selectedCrop, setSelectedCrop] = useState('Copra/Coconut');
  const [harvestKg, setHarvestKg] = useState(300);

  const cropData = cropCalculations[selectedCrop] || cropCalculations['Copra/Coconut'];

  const safeKg = Math.max(10, Number(harvestKg) || 10);
  const savingsPerKg = Number(cropData.savingsPerKg) || 18;
  const totalSavingsPerBatch = Math.round(safeKg * savingsPerKg);
  const totalAnnualValueGain = Math.round(totalSavingsPerBatch * 45); // 45 annual batches average

  // Model Recommendations matching ZeniTEK catalog & LeadModal options
  let recommendedModel = 'SOLDRY 1210 Polyhouse Tunnel';
  let leadModalCapacityKey = '100 to 500 kg (Commercial)';

  if (safeKg <= 75) {
    recommendedModel = 'SUNDRY 50 Solar Box Dryer';
    leadModalCapacityKey = 'Under 50 kg (Portable)';
  } else if (safeKg > 600) {
    recommendedModel = 'SOLDRY Multi-Tunnel Industrial Plant';
    leadModalCapacityKey = '1 Ton+ (Industrial)';
  }

  const handleQuoteClick = () => {
    if (onSelectModelQuote) {
      onSelectModelQuote(leadModalCapacityKey, safeKg, selectedCrop, recommendedModel);
    }
  };

  const activeSlide = productSlides[currentProductSlide];

  return (
    <div id="roi-calculator" className="w-full">
      
      {/* 2-Column Grid: Left (60% / 7-cols) = Product Showcase | Right (40% / 5-cols) = Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
        
        {/* ================= LEFT SIDE (60%): PRODUCT SHOWCASE (AUTO-SWAPPING EVERY 5S) ================= */}
        <div 
          className="lg:col-span-7 bg-slate-900 rounded-2xl border border-slate-200/80 shadow-lg overflow-hidden flex flex-col justify-between relative group select-none h-[380px] sm:h-[420px] lg:h-[440px]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Top Bar with 5s Timer Progress */}
          <div className="relative z-20 px-4 py-3 bg-gradient-to-b from-black/70 via-black/30 to-transparent text-white flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-white/90">
                Product Showcase • 5s Auto-Swap
              </span>
            </div>
            <div className="text-[11px] font-bold bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/30 text-white">
              {currentProductSlide + 1} / {productSlides.length}
            </div>
          </div>

          {/* Active 5-second Progress Bar */}
          <div className="absolute top-0 inset-x-0 h-1 bg-white/20 z-30 overflow-hidden">
            <div 
              key={currentProductSlide}
              className={`h-full bg-gradient-to-r from-blue-400 to-[#23AC39] ${
                isPaused ? '' : 'animate-progress-5s'
              }`}
              style={{ animationDuration: '5000ms' }}
            />
          </div>

          {/* Background Images with Cross-Fade */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            {productSlides.map((slide, idx) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  idx === currentProductSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover object-center"
                />
                {/* Gradient overlay for text legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent" />
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={handlePrevSlide}
            aria-label="Previous Product"
            className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/85 hover:bg-white text-slate-800 shadow-md flex items-center justify-center transition-all active:scale-90 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={handleNextSlide}
            aria-label="Next Product"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/85 hover:bg-white text-slate-800 shadow-md flex items-center justify-center transition-all active:scale-90 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Bottom Overlay Content */}
          <div className="relative z-20 p-4 sm:p-5 text-white space-y-2 mt-auto">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-black uppercase bg-[#23AC39] text-white px-2 py-0.5 rounded shadow-xs">
                {activeSlide.tag}
              </span>
              <span className="text-[10px] text-green-300 font-semibold truncate">
                {activeSlide.cropFit}
              </span>
            </div>

            <div>
              <h3 className="text-lg sm:text-xl font-black text-white leading-tight drop-shadow-sm">
                {activeSlide.title}
              </h3>
              <p className="text-[11px] sm:text-xs text-white/80 font-medium">
                {activeSlide.subtitle}
              </p>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-white/20">
              {activeSlide.features.map((feat, i) => (
                <span key={i} className="text-[10px] text-white/90 bg-white/10 backdrop-blur-xs px-2 py-0.5 rounded flex items-center">
                  <CheckCircle2 className="w-2.5 h-2.5 text-green-400 mr-1 shrink-0" />
                  {feat}
                </span>
              ))}
            </div>

            {/* Dots */}
            <div className="pt-1 flex items-center justify-center space-x-1.5">
              {productSlides.map((slide, idx) => (
                <button
                  key={slide.id}
                  onClick={() => setCurrentProductSlide(idx)}
                  aria-label={`Go to product slide ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    currentProductSlide === idx
                      ? 'w-6 bg-white shadow-xs'
                      : 'w-1.5 bg-white/40 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>


        {/* ================= RIGHT SIDE (40%): CLEAN, ESSENTIALS-ONLY CALCULATOR ================= */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-lg flex flex-col justify-between space-y-3.5 h-auto lg:h-[440px]">
          
          {/* Header - Title Only */}
          <div className="flex items-center space-x-2.5 pb-2.5 border-b border-slate-100">
            <Calculator className="w-5 h-5 text-[#123B92] shrink-0" />
            <h3 className="text-base sm:text-lg font-black text-[#123B92] tracking-tight">
              {t('roiTitle')}
            </h3>
          </div>

          {/* 1. Crop Selection */}
          <div>
            <label className="block text-[11px] font-bold text-[#123B92] uppercase tracking-wider mb-1">
              {t('selectCrop')}
            </label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full bg-[#F0F4FD] border border-[#123B92]/30 focus:border-[#123B92] focus:ring-1 focus:ring-[#123B92] rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 font-bold cursor-pointer transition-colors"
            >
              <option value="Copra/Coconut">Copra / Coconut Kernel (Drying to 6% moisture)</option>
              <option value="Spices/Chillies">Red Chillies, Pepper & Turmeric (Zero aflatoxin)</option>
              <option value="Moringa/Herbs">Moringa Leaves & Herbs (Chlorophyll green)</option>
              <option value="Fruits/Veggies">Banana, Mango & Vegetable Slices</option>
              <option value="Fish/Seafood">Salted Fish, Shrimp & Marine</option>
              <option value="Other">Seeds, Grains & Other Biomass</option>
            </select>
          </div>

          {/* 2. Batch Quantity Input & Slider */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[11px] font-bold text-[#123B92] uppercase tracking-wider">
                {t('batchQty')}
              </label>
              <div className="flex items-center space-x-1 bg-[#F0F4FD] border border-[#123B92]/30 px-2.5 py-0.5 rounded-lg">
                <input
                  type="number"
                  min="10"
                  max="10000"
                  step="10"
                  value={harvestKg}
                  onChange={(e) => setHarvestKg(Math.max(1, Number(e.target.value)))}
                  className="w-16 text-right bg-transparent text-sm font-black text-[#123B92] focus:outline-none"
                />
                <span className="text-[11px] font-bold text-slate-600">kg</span>
              </div>
            </div>

            <input
              type="range"
              min="20"
              max="5000"
              step="10"
              value={safeKg}
              onChange={(e) => setHarvestKg(Number(e.target.value))}
              className="w-full h-2 bg-[#F0F4FD] rounded-lg appearance-none cursor-pointer accent-[#123B92]"
            />
            <div className="flex justify-between text-[9px] text-slate-400 font-mono mt-0.5">
              <span>20 kg</span>
              <span>500 kg</span>
              <span>2,500 kg</span>
              <span>5,000 kg</span>
            </div>
          </div>

          {/* 3. Fast Comparison Row */}
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] font-bold text-slate-500 uppercase">{t('sunDrying')}</div>
              <div className="text-sm sm:text-base font-black text-slate-800">{cropData.sunDryingDays} Days</div>
            </div>
            <div className="p-2 rounded-xl bg-[#F0F4FD] border border-[#23AC39]">
              <div className="text-[10px] font-black text-[#123B92] uppercase">{t('solarDrying')}</div>
              <div className="text-sm sm:text-base font-black text-[#002DC2]">{cropData.solarDryingDays} Days</div>
            </div>
          </div>

          {/* 4. Compact Financial ROI & Recommended Setup Card */}
          <div className="bg-gradient-to-br from-[#123B92] via-[#0D2E73] to-[#0A225C] text-white p-3.5 rounded-xl shadow-md border border-blue-400/30 space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] text-blue-200 font-semibold">{t('profitPerBatch')}</div>
                <div className="text-xl sm:text-2xl font-black text-white">
                  ₹{totalSavingsPerBatch.toLocaleString('en-IN')}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-blue-200 font-semibold">{t('priceIncrease')}</div>
                <div className="text-base sm:text-lg font-black text-green-300">
                  +{cropData.premiumPercent}%
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-white/20 flex items-center justify-between text-[11px]">
              <span className="text-blue-200 truncate">
                {recommendedModel}
              </span>
              <span className="text-green-300 font-bold whitespace-nowrap">
                ₹{totalAnnualValueGain.toLocaleString('en-IN')}/yr
              </span>
            </div>

            <button
              onClick={handleQuoteClick}
              className="w-full py-2.5 px-4 bg-[#23AC39] hover:bg-[#1f9632] text-white font-black text-xs uppercase tracking-wider rounded-lg shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer active:scale-98"
            >
              <span>{t('getQuoteSetup')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
