import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Layers, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function ROICalculator({ onSelectModelQuote }) {
  const { t } = useLanguage();

  // Curated Showcase Slides with Synchronized Technical & Quality Metrics
  const productSlides = [
    {
      id: 'p1',
      image: '/real-photos/zenitek_photo_04.jpeg',
      title: 'SOLDRY 1210 Polyhouse Tunnel Dryer',
      subtitle: 'Commercial Agricultural Installation • 150–500 kg / batch',
      tag: 'Commercial Tunnel',
      cropFit: 'Copra, Coconut Kernels & Grains',
      features: ['Food-Grade SS304 Trays', 'UV-Stabilized Polycarbonate', 'Zero Power Bills'],
      specs: {
        loadingRatio: {
          label: 'Specific Drying & Loading Density',
          value: '1 sq.m : 400 kg Loading → 200 kg Dry',
          desc: 'High-density multi-tier SS304 tray layout engineered for maximum dry produce output per square meter.'
        },
        dryingSpeed: {
          label: 'Drying Speed & UV Guard',
          value: '40% Faster Drying • Zero UV Degradation',
          desc: 'Reduces drying duration from 7 days down to 2.5 days while blocking destructive solar ultraviolet wavelengths.'
        },
        hygiene: {
          label: 'Hygienic Enclosed Processing',
          value: '100% Sealed Sanitary Chamber',
          desc: 'Hermetically protected against rainfall, road dust, insects, bird droppings, and mold/aflatoxins.'
        },
        retention: {
          label: 'Aroma, Taste & Structure Retention',
          value: 'Locks Original Aroma, Taste, Smell & Structure',
          desc: 'Retains pure Grade-1 white copra, natural aromatic coconut oils, and uncompromised cellular firmness.'
        }
      }
    },
    {
      id: 'p2',
      image: '/real-photos/zenitek_photo_18.jpeg',
      title: 'SOLDRY 1709 Parabolic Arch Tunnel',
      subtitle: 'Continuous Aerodynamic Airflow • 400–1,200 kg / batch',
      tag: 'Industrial Scale',
      cropFit: 'Turmeric, Ginger, Herbs & Biomass',
      features: ['Inverted Parabolic Arch', 'All-Weather Galvanized Frame', '15+ Years Lifespan'],
      specs: {
        loadingRatio: {
          label: 'Specific Drying & Loading Density',
          value: '1 sq.m : 350 kg Loading → 175 kg Dry',
          desc: 'Aerodynamic deep-bed drying geometry facilitating high-velocity heated cross-draft moisture evacuation.'
        },
        dryingSpeed: {
          label: 'Drying Speed & UV Guard',
          value: '45% Faster Extraction • Multi-Layer UV Shielding',
          desc: 'Accelerated thermal dehumidification preventing solar bleaching, case hardening, and scorched skins.'
        },
        hygiene: {
          label: 'Hygienic Enclosed Processing',
          value: 'Sanitary Hermetic Enclosure',
          desc: 'Fully enclosed clean-air envelope ensuring zero fungal growth and export-certified phytosanitary grade.'
        },
        retention: {
          label: 'Aroma, Taste & Structure Retention',
          value: 'Locks Original Aroma, Taste, Color & Curcumin Matrix',
          desc: 'Maintains deep golden-yellow curcumin content, sharp pungent notes, and natural root cell integrity.'
        }
      }
    },
    {
      id: 'p3',
      image: '/real-photos/zenitek_photo_24.jpeg',
      title: 'Precision Red Chilli Dehydration Unit',
      subtitle: 'Uniform Solar Moisture Extraction • Grade-1 Quality',
      tag: 'Quality Spices',
      cropFit: 'Red Chillies, Black Pepper & Cardamom',
      features: ['Aflatoxin-Free Sealed Protection', 'Zero Dust Contamination', '+28% Price Premium'],
      specs: {
        loadingRatio: {
          label: 'Specific Drying & Loading Density',
          value: '1 sq.m : 300 kg Loading → 150 kg Dry',
          desc: 'Even spice bed distribution ensuring uniform dehydration from surface peel to inner seed cavity.'
        },
        dryingSpeed: {
          label: 'Drying Speed & UV Guard',
          value: '40% Faster Dehydration • Zero UV Degradation',
          desc: 'Rapidly lowers moisture below 8% threshold without sunlight pigment bleaching or heat stress.'
        },
        hygiene: {
          label: 'Hygienic Enclosed Processing',
          value: 'Zero Insect, Fly or Rodent Exposure',
          desc: 'Protected from outdoor dirt, vehicle soot, and bird drop contamination, eliminating mold toxins.'
        },
        retention: {
          label: 'Aroma, Taste & Structure Retention',
          value: 'Locks Original Aroma, Taste, Pungency & Gloss',
          desc: 'Preserves fiery natural capsaicin oils, glossy red exterior skin, and intact seed pore structure.'
        }
      }
    },
    {
      id: 'p4',
      image: '/real-photos/zenitek_photo_27.jpeg',
      title: 'SUNDRY 50 Clean Multi-Tier Box Dryer',
      subtitle: '8-Tray Food-Grade Multi-Tier System • 20–100 kg / batch',
      tag: 'Pharma & Superfood',
      cropFit: 'Moringa Leaves, Herbs & Medicinal Flora',
      features: ['Integrated Solar PV', 'Heavy-Duty Casters', 'Food-Grade SS304 Trays'],
      specs: {
        loadingRatio: {
          label: 'Specific Drying & Loading Density',
          value: '1 sq.m : 250 kg Loading → 125 kg Dry',
          desc: 'Delicate multi-tier stainless wire racks designed for uniform air circulation across leafy greens.'
        },
        dryingSpeed: {
          label: 'Drying Speed & UV Guard',
          value: '50% Faster Gentle Drying • Complete UV Protection',
          desc: 'Controlled low-temperature indirect solar convection preventing heat-induced chlorophyll breakdown.'
        },
        hygiene: {
          label: 'Hygienic Enclosed Processing',
          value: 'Micro-Filtered Sanitary Air Induction',
          desc: 'Sealed cabinet and dust-mesh air induction maintaining cleanroom purity for superfoods.'
        },
        retention: {
          label: 'Aroma, Taste & Structure Retention',
          value: 'Locks Original Aroma, Taste, Smell & Leaf Chlorophyll',
          desc: 'Preserves 100% natural emerald green hue, fragile botanical aromatics, and heat-labile vitamins.'
        }
      }
    },
    {
      id: 'p5',
      image: '/real-photos/zenitek_photo_02.jpeg',
      title: 'Walk-In Polyhouse Tunnel Interior',
      subtitle: 'Multi-Tier Ergonomic Trolley Architecture',
      tag: 'Coastal & Multi-Crop',
      cropFit: 'Fish, Seafood, Grains & Specialty Slices',
      features: ['Rapid Loading & Unloading', 'Active Circulation Blowers', 'Sanitized Operation'],
      specs: {
        loadingRatio: {
          label: 'Specific Drying & Loading Density',
          value: '1 sq.m : 400 kg Loading → 200 kg Dry',
          desc: 'Heavy-duty trolley roll-in system allowing rapid batch loading and continuous industrial rotation.'
        },
        dryingSpeed: {
          label: 'Drying Speed & UV Guard',
          value: '40% Faster Moisture Extraction • UV Shielded Airflow',
          desc: 'Forced-draft airflow channels strip moisture evenly without surface encrustation or soggy layers.'
        },
        hygiene: {
          label: 'Hygienic Enclosed Processing',
          value: '100% Sealed from Flies & Sand Infestation',
          desc: 'Eliminates open-ground fish drying contamination, maggot breeding, and airborne sand particles.'
        },
        retention: {
          label: 'Aroma, Taste & Structure Retention',
          value: 'Locks Original Aroma, Taste, Texture & Healthy Oils',
          desc: 'Guarantees food-grade hygienic dried marine products with locked-in natural proteins and omega-3.'
        }
      }
    }
  ];

  const [currentProductSlide, setCurrentProductSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-swap every 5 seconds in continuous loop
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

  const activeSlide = productSlides[currentProductSlide];

  const handleQuoteClick = () => {
    if (onSelectModelQuote) {
      onSelectModelQuote(activeSlide.tag, 400, activeSlide.cropFit, activeSlide.title);
    }
  };

  return (
    <div id="roi-calculator" className="w-full">
      
      {/* 2-Column Synchronized Grid: Left (60% / 7-cols) = Product Showcase | Right (40% / 5-cols) = Technical & Quality Advantages */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
        
        {/* ================= LEFT SIDE (60%): PRODUCT SHOWCASE (AUTO-SWAPPING EVERY 5S) ================= */}
        <div 
          className="lg:col-span-7 bg-slate-900 rounded-2xl border border-slate-200/80 shadow-lg overflow-hidden flex flex-col justify-between relative group select-none h-[420px] sm:h-[460px] lg:h-[500px]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Top Bar with 5s Timer Progress */}
          <div className="relative z-20 px-4 py-3 bg-gradient-to-b from-black/70 via-black/30 to-transparent text-white flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-white/90">
                Operational Installation • 5s Auto-Swap
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

          {/* Background Images with Calm Cross-Fade */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            {productSlides.map((slide, idx) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
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


        {/* ================= RIGHT SIDE (40%): SYNCHRONIZED TECHNICAL ADVANTAGES & QUALITY METRICS ================= */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-4.5 sm:p-5.5 border border-slate-200/90 shadow-lg flex flex-col justify-between h-auto lg:h-[500px]">
          
          {/* Header */}
          <div className="pb-2.5 border-b border-slate-100">
            <span className="text-[10.5px] font-black text-[#002DC2] uppercase tracking-wider bg-[#F0F4FD] border border-[#002DC2]/20 px-3 py-1 rounded-full inline-flex items-center">
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-[#002DC2]" /> DEHYDRATION PERFORMANCE METRICS
            </span>
            <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug mt-1.5">
              Operational Advantages & Quality Safeguards
            </h3>
            <p className="text-xs text-slate-500 font-semibold truncate mt-0.5">
              Engineering specifications for {activeSlide.title}
            </p>
          </div>

          {/* Core Synchronized Metric Cards with Calm Transition */}
          <div 
            key={currentProductSlide}
            className="animate-calm-fade space-y-2.5 flex-1 my-2.5 flex flex-col justify-between"
          >
            {/* 1. Loading & Dry Ratio */}
            <div className="p-2.5 sm:p-3 bg-[#F0F4FD] rounded-xl border border-[#123B92]/20 shadow-2xs hover:border-[#002DC2]/50 transition-colors">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-lg bg-blue-100 text-[#002DC2] flex items-center justify-center shrink-0">
                  <Layers className="w-3.5 h-3.5" />
                </div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                  {activeSlide.specs.loadingRatio.label}
                </div>
              </div>
              <div className="text-sm font-black text-[#123B92] mt-1 pl-8">
                {activeSlide.specs.loadingRatio.value}
              </div>
              <p className="text-[11px] text-slate-600 font-medium pl-8 mt-0.5 line-clamp-1">
                {activeSlide.specs.loadingRatio.desc}
              </p>
            </div>

            {/* 2. Drying Speed & UV Protection */}
            <div className="p-2.5 sm:p-3 bg-white rounded-xl border border-slate-200/90 shadow-2xs hover:border-[#23AC39]/60 transition-colors">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-lg bg-emerald-100 text-[#23AC39] flex items-center justify-center shrink-0">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                  {activeSlide.specs.dryingSpeed.label}
                </div>
              </div>
              <div className="text-sm font-black text-[#23AC39] mt-1 pl-8">
                {activeSlide.specs.dryingSpeed.value}
              </div>
              <p className="text-[11px] text-slate-600 font-medium pl-8 mt-0.5 line-clamp-1">
                {activeSlide.specs.dryingSpeed.desc}
              </p>
            </div>

            {/* 3. 100% Hygienic Enclosed Processing */}
            <div className="p-2.5 sm:p-3 bg-[#F0F4FD] rounded-xl border border-[#123B92]/20 shadow-2xs hover:border-[#002DC2]/50 transition-colors">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-lg bg-blue-100 text-[#002DC2] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                  {activeSlide.specs.hygiene.label}
                </div>
              </div>
              <div className="text-sm font-black text-slate-900 mt-1 pl-8">
                {activeSlide.specs.hygiene.value}
              </div>
              <p className="text-[11px] text-slate-600 font-medium pl-8 mt-0.5 line-clamp-1">
                {activeSlide.specs.hygiene.desc}
              </p>
            </div>

            {/* 4. Locks Original Aroma, Taste, Smell & Structure */}
            <div className="p-2.5 sm:p-3 bg-white rounded-xl border border-slate-200/90 shadow-2xs hover:border-amber-400 transition-colors">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                  {activeSlide.specs.retention.label}
                </div>
              </div>
              <div className="text-sm font-black text-[#002DC2] mt-1 pl-8">
                {activeSlide.specs.retention.value}
              </div>
              <p className="text-[11px] text-slate-600 font-medium pl-8 mt-0.5 line-clamp-1">
                {activeSlide.specs.retention.desc}
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={handleQuoteClick}
              className="w-full py-2.5 px-4 bg-[#23AC39] hover:bg-[#002DC2] text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
            >
              <span>Get Sizing & Pricing for This Model</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
