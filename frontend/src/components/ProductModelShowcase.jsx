import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const teslaDryerProducts = [
  {
    id: "soldry-1210",
    modelCode: "SOLDRY 1210",
    name: "SOLDRY 1210",
    category: "Commercial Polyhouse Tunnel",
    capacity: "Capacity: 150 – 500 kg / batch",
    leaseInfo: "Govt Subsidy Assistance 40% – 60%",
    quoteCategory: "100 to 500 kg (Commercial)",
    images: [
      "/hero-carousel/slide-1.jpg",
      "/real-photos/zenitek_photo_04.jpeg",
      "/real-photos/zenitek_photo_02.jpeg",
      "/real-photos/zenitek_photo_11.jpeg",
      "/real-photos/zenitek_photo_12.jpeg",
      "/real-photos/zenitek_photo_13.jpeg",
      "/real-photos/zenitek_photo_24.jpeg",
      "/pdf-products/brochure_p1.png"
    ]
  },
  {
    id: "soldry-1709",
    modelCode: "SOLDRY 1709",
    name: "SOLDRY 1709",
    category: "Inverted Parabolic Tunnel",
    capacity: "Capacity: 400 – 1,200 kg / batch",
    leaseInfo: "Govt Subsidy Assistance 50%",
    quoteCategory: "100 to 500 kg (Commercial)",
    images: [
      "/hero-carousel/slide-2.jpg",
      "/real-photos/zenitek_photo_18.jpeg",
      "/real-photos/zenitek_photo_19.jpeg",
      "/real-photos/zenitek_photo_20.jpeg",
      "/real-photos/zenitek_photo_22.jpeg",
      "/real-photos/zenitek_photo_28.jpeg",
      "/pdf-products/brochure_p2.png",
      "/pdf-products/brochure_p3.png"
    ]
  },
  {
    id: "sundry-50",
    modelCode: "SUNDRY 50",
    name: "SUNDRY 50",
    category: "Commercial Box Dryer",
    capacity: "Capacity: 20 – 100 kg / batch",
    leaseInfo: "Govt Subsidy Assistance 40% – 50%",
    quoteCategory: "100 to 500 kg (Commercial)",
    images: [
      "/real-photos/zenitek_photo_27.jpeg",
      "/real-photos/zenitek_photo_01.jpeg",
      "/real-photos/zenitek_photo_26.jpeg",
      "/real-photos/zenitek_photo_03.jpeg",
      "/real-photos/zenitek_photo_07.jpeg",
      "/real-photos/zenitek_photo_08.jpeg",
      "/real-photos/zenitek_photo_17.jpeg",
      "/pdf-products/brochure_p6.png"
    ]
  },
  {
    id: "soldry-300",
    modelCode: "SOLDRY 1210 - 300",
    name: "SOLDRY 300",
    category: "Industrial Polyhouse Tunnel",
    capacity: "Capacity: 300 – 1,000 kg / batch",
    leaseInfo: "Govt Subsidy Assistance 50% – 60%",
    quoteCategory: "1 Ton+ (Industrial)",
    images: [
      "/hero-carousel/slide-3.jpg",
      "/real-photos/zenitek_photo_12.jpeg",
      "/real-photos/zenitek_photo_02.jpeg",
      "/real-photos/zenitek_photo_03.jpeg",
      "/real-photos/zenitek_photo_11.jpeg",
      "/real-photos/zenitek_photo_21.jpeg",
      "/real-photos/zenitek_photo_24.jpeg",
      "/pdf-products/brochure_p9.png"
    ]
  },
  {
    id: "sundry-12",
    modelCode: "SUNDRY 12",
    name: "SUNDRY 12",
    category: "Compact Dual-Tier Box Dryer",
    capacity: "Capacity: 5 – 25 kg / batch",
    leaseInfo: "Micro-Enterprise Grant Eligible",
    quoteCategory: "Under 50 kg (Portable)",
    images: [
      "/real-photos/zenitek_photo_25.jpeg",
      "/real-photos/zenitek_photo_05.jpeg",
      "/real-photos/zenitek_photo_10.jpeg",
      "/real-photos/zenitek_photo_14.jpeg",
      "/real-photos/zenitek_photo_15.jpeg",
      "/real-photos/zenitek_photo_16.jpeg",
      "/real-photos/zenitek_photo_17.jpeg",
      "/pdf-products/brochure_p5.png"
    ]
  },
  {
    id: "sundry-6",
    modelCode: "SUNDRY 6",
    name: "SUNDRY 6",
    category: "Household Solar Box Dryer",
    capacity: "Capacity: 2.5 – 12.5 kg / batch",
    leaseInfo: "Home & Kitchen Enterprise",
    quoteCategory: "Under 50 kg (Portable)",
    images: [
      "/real-photos/zenitek_photo_23.jpeg",
      "/real-photos/zenitek_photo_01.jpeg",
      "/real-photos/zenitek_photo_05.jpeg",
      "/real-photos/zenitek_photo_06.jpeg",
      "/real-photos/zenitek_photo_10.jpeg",
      "/real-photos/zenitek_photo_14.jpeg",
      "/real-photos/zenitek_photo_16.jpeg",
      "/pdf-products/brochure_p4.png"
    ]
  }
];

export default function ProductModelShowcase({ onOpenQuoteModal, onOpenDetailModal }) {
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const totalProducts = teslaDryerProducts.length;
  const currentProduct = teslaDryerProducts[activeIndex];
  const prevIndex = (activeIndex - 1 + totalProducts) % totalProducts;
  const nextIndex = (activeIndex + 1) % totalProducts;

  const prevProduct = teslaDryerProducts[prevIndex];
  const nextProduct = teslaDryerProducts[nextIndex];

  // Auto-swap active product images every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % currentProduct.images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [currentProduct.images.length, activeIndex]);

  const handlePrev = () => {
    setActiveIndex(prevIndex);
    setActiveImageIndex(0);
  };

  const handleNext = () => {
    setActiveIndex(nextIndex);
    setActiveImageIndex(0);
  };

  const currentImage = currentProduct.images[activeImageIndex % currentProduct.images.length];

  return (
    <div className="w-full select-none px-0 mx-0 overflow-x-hidden">
      
      {/* SECTION HEADING: CLEAN TITLE */}
      <div className="text-center px-4 mb-6 sm:mb-8">
        <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-[42px] font-black text-[#123B92] tracking-tight leading-tight">
          Choose the Perfect Solar Thermal Dryer for Your Farm
        </h2>
      </div>

      {/* FULL-BLEED ZERO-PADDING TESLA STAGE */}
      <div className="relative w-full overflow-hidden px-0 mx-0 py-1">
        <div className="flex items-center justify-center gap-3 sm:gap-4 w-full px-0 mx-0">
          
          {/* ================= LEFT PEEK CARD (PREVIOUS PRODUCT) - 100% OPACITY, ZERO BLUR ================= */}
          <div 
            onClick={handlePrev}
            className="hidden md:block relative w-[16%] lg:w-[18%] h-[420px] sm:h-[480px] lg:h-[540px] rounded-r-2xl lg:rounded-r-3xl overflow-hidden cursor-pointer group shrink-0 opacity-100 shadow-xl transition-transform duration-500"
          >
            <img 
              src={prevProduct.images[0]} 
              alt={prevProduct.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            />
            {/* Subtle Gradient for Text Contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

            {/* Top Tag */}
            <div className="absolute top-5 left-5 text-xs font-bold text-white drop-shadow">
              {prevProduct.category}
            </div>

            {/* Bottom Title Preview */}
            <div className="absolute bottom-6 left-5 text-white">
              <div className="text-xl lg:text-2xl font-black drop-shadow">
                {prevProduct.name}
              </div>
            </div>

            {/* Left Arrow Button centered vertically on the left peek card */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              aria-label="Previous Product"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-11 h-11 lg:w-12 lg:h-12 rounded-xl bg-white hover:bg-slate-100 text-slate-900 shadow-2xl flex items-center justify-center transition-all active:scale-90 cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          </div>


          {/* ================= CENTER ACTIVE CARD (MAIN TESLA CAROUSEL FORMAT) - EXPANDED HEIGHT ================= */}
          <div className="relative w-[96%] md:w-[68%] lg:w-[64%] h-[460px] sm:h-[520px] lg:h-[570px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl shrink-0 group opacity-100">
            
            {/* Active Image with 5-Second Smooth Cross-Fade - Full HD, Zero Blur */}
            <img
              key={currentImage}
              src={currentImage}
              alt={currentProduct.name}
              className="w-full h-full object-cover object-center transform group-hover:scale-102 transition-transform duration-700 animate-fade-in"
            />

            {/* Dark Bottom Gradient for Clean Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10 pointer-events-none" />

            {/* TOP-LEFT CATEGORY */}
            <div className="absolute top-5 left-5 sm:top-7 sm:left-8 z-10">
              <span className="text-white text-xs sm:text-sm font-bold tracking-wide drop-shadow-md">
                {currentProduct.category}
              </span>
            </div>

            {/* TOP-RIGHT IMAGE COUNTER & AUTO-TIMER INDICATOR */}
            <div className="absolute top-5 right-5 sm:top-7 sm:right-8 z-10 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[11px] font-bold text-white bg-black/60 px-3 py-1 rounded-full border border-white/30">
                Photo {activeImageIndex + 1} of {currentProduct.images.length}
              </span>
            </div>

            {/* MOBILE ONLY: IN-CARD LEFT & RIGHT ARROWS */}
            <button
              onClick={handlePrev}
              aria-label="Previous Product"
              className="md:hidden absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-xl bg-white text-slate-900 shadow-xl flex items-center justify-center cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next Product"
              className="md:hidden absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-xl bg-white text-slate-900 shadow-xl flex items-center justify-center cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* BOTTOM-LEFT CONTENT (Tesla Style: Title, Subtitle, Order Now & Learn More) */}
            <div className="absolute bottom-7 left-5 sm:bottom-9 sm:left-9 z-10 max-w-xl text-white space-y-2.5">
              
              {/* Product Title */}
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight drop-shadow-lg">
                {currentProduct.name}
              </h3>

              {/* Subheading / Capacity */}
              <div className="text-xs sm:text-sm lg:text-base text-white font-medium pb-2 drop-shadow-md">
                <span className="underline underline-offset-4 font-bold">
                  {currentProduct.capacity}
                </span>
                <span className="mx-2">•</span>
                <span className="text-green-300 font-bold">
                  {currentProduct.leaseInfo}
                </span>
              </div>

              {/* Two Tesla-Style Action Buttons */}
              <div className="flex items-center space-x-3 sm:space-x-4 pt-1">
                
                {/* Primary Button: Get Quote */}
                <button
                  type="button"
                  onClick={() => onOpenQuoteModal && onOpenQuoteModal({ 
                    capacityNeeded: currentProduct.quoteCategory,
                    message: `Inquiry for ${currentProduct.name} (${currentProduct.capacity})`
                  })}
                  className="px-7 py-3 sm:px-9 sm:py-3.5 bg-[#002DC2] hover:bg-[#123B92] text-white font-bold text-xs sm:text-sm rounded-xl shadow-xl transition-all active:scale-95 cursor-pointer flex items-center justify-center"
                >
                  Get Quote
                </button>

                {/* Secondary Button: Learn More */}
                <button
                  type="button"
                  onClick={() => onOpenDetailModal && onOpenDetailModal(currentProduct)}
                  className="px-7 py-3 sm:px-9 sm:py-3.5 bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs sm:text-sm rounded-xl shadow-xl transition-all active:scale-95 cursor-pointer flex items-center justify-center"
                >
                  Learn More
                </button>

              </div>

            </div>

            {/* Bottom 5-second Progress Bar inside Active Card */}
            <div className="absolute bottom-0 inset-x-0 h-1.5 bg-white/20 z-20 overflow-hidden">
              <div 
                key={`${activeIndex}-${activeImageIndex}`}
                className="h-full bg-gradient-to-r from-blue-400 to-[#23AC39] animate-progress-5s"
                style={{ animationDuration: '5000ms' }}
              />
            </div>

          </div>


          {/* ================= RIGHT PEEK CARD (NEXT PRODUCT) - 100% OPACITY, ZERO BLUR ================= */}
          <div 
            onClick={handleNext}
            className="hidden md:block relative w-[16%] lg:w-[18%] h-[420px] sm:h-[480px] lg:h-[540px] rounded-l-2xl lg:rounded-l-3xl overflow-hidden cursor-pointer group shrink-0 opacity-100 shadow-xl transition-transform duration-500"
          >
            <img 
              src={nextProduct.images[0]} 
              alt={nextProduct.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            />
            {/* Subtle Gradient for Text Contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

            {/* Top Tag */}
            <div className="absolute top-5 left-5 text-xs font-bold text-white drop-shadow">
              {nextProduct.category}
            </div>

            {/* Bottom Title Preview */}
            <div className="absolute bottom-6 left-5 text-white">
              <div className="text-xl lg:text-2xl font-black drop-shadow">
                {nextProduct.name}
              </div>
            </div>

            {/* Right Arrow Button centered vertically on the right peek card */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              aria-label="Next Product"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-11 h-11 lg:w-12 lg:h-12 rounded-xl bg-white hover:bg-slate-100 text-slate-900 shadow-2xl flex items-center justify-center transition-all active:scale-90 cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

        </div>

        {/* BOTTOM PAGINATION DOTS (Tesla Style) */}
        <div className="flex items-center justify-center space-x-2 pt-5">
          {teslaDryerProducts.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => {
                setActiveIndex(idx);
                setActiveImageIndex(0);
              }}
              aria-label={`Go to ${p.name}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                activeIndex === idx
                  ? 'w-8 bg-slate-900 shadow-xs'
                  : 'w-2 bg-slate-300 hover:bg-slate-500'
              }`}
            />
          ))}
        </div>

      </div>

    </div>
  );
}
