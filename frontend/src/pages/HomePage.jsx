import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ROICalculator from '../components/ROICalculator';
import ProductModelShowcase from '../components/ProductModelShowcase';
import MapComponent from '../components/MapComponent';
import { sampleReviews } from '../data/sampleData';
import { useLanguage } from '../context/LanguageContext';
import {
  Sun, ShieldCheck, Award, ArrowRight, Zap, ChevronRight, ChevronLeft, MapPin, Sprout, Cpu, Sparkles
} from 'lucide-react';

// Real ZeniTEK installation photos (no AI renders, no baked-in text)
const heroSlides = [
  { image: '/real-photos/zenitek_photo_34.jpeg', alt: 'ZeniTEK solar tunnel dryer with PV canopy in paddy fields' },
  { image: '/real-photos/zenitek_photo_45.jpeg', alt: 'Long ZeniTEK solar tunnel dryer in an open field' },
  { image: '/real-photos/zenitek_photo_12.jpeg', alt: 'ZeniTEK solar tunnel dryer on a stone plinth' },
];

const crops = [
  { titleKey: 'cropSpices', descKey: 'homeSpicesDesc', image: '/real-photos/zenitek_photo_23.jpeg', alt: 'Red chillies drying on trays inside a ZeniTEK tunnel dryer' },
  { titleKey: 'homeHerbsTitle', descKey: 'homeHerbsDesc', image: '/real-photos/zenitek_photo_35.jpeg', alt: 'Butterfly-pea flowers on trays of a ZeniTEK cabinet dryer' },
  { titleKey: 'cropFish', descKey: 'homeFishDesc', image: '/real-photos/zenitek_photo_27.jpeg', alt: 'Dried shrimp on trays of a ZeniTEK cabinet dryer' },
];

const pillars = [
  { key: 'homePillarThermal', Icon: Zap },
  { key: 'homePillarAgri', Icon: Sprout },
  { key: 'homePillarPV', Icon: Cpu },
  { key: 'homePillarRnd', Icon: Sparkles },
];

const clientPartners = [
  { name: 'IIT Bhubaneswar', logo: '/client-logos/academic_iit_bhubaneswar.png' },
  { name: 'Anna University', logo: '/client-logos/academic_anna_univ.jpeg' },
  { name: 'SRM University', logo: '/client-logos/industry_srm.png' },
  { name: 'Mitsui Chemicals', logo: '/client-logos/industry_mitsui.jpeg' },
  { name: 'Indo-MIM', logo: '/client-logos/industry_indomim.jpeg' },
  { name: 'SELCO Foundation', logo: '/client-logos/industry_selco.png' },
  { name: 'TNJFU Fisheries Univ', logo: '/client-logos/academic_fisheries.png' },
  { name: 'Gandhigram Rural Inst.', logo: '/client-logos/academic_gandhigram.jpeg' },
];

const inputClass = 'w-full bg-[#F0F4FD] border border-[#123B92]/30 text-black rounded-xl px-4 py-3 text-base placeholder-black/50 font-medium focus:border-[#002DC2] focus:ring-1 focus:ring-[#002DC2]';
const labelClass = 'block text-xs font-bold text-[#123B92] mb-1';

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
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);

  // Auto-advance every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handlePrevSlide = () => {
    setCurrentHeroSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const handleNextSlide = () => {
    setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const handleQuickSubmit = (e) => {
    e.preventDefault();
    onOpenQuoteModal(quickForm);
  };

  return (
    <div className="bg-slate-50 text-slate-900 w-full max-w-full overflow-x-hidden">

      {/* SECTION 1: HERO CAROUSEL */}
      <section className="no-divider relative pt-12 pb-16 lg:pt-20 lg:pb-24 section-odd w-full overflow-hidden min-h-[600px] lg:min-h-[680px] flex items-center select-none">

        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {heroSlides.map((slide, idx) => (
            <div
              key={slide.image}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                idx === currentHeroSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <img src={slide.image} alt={slide.alt} className="w-full h-full object-cover object-center select-none" />
            </div>
          ))}
          {/* Left fade keeps the heading readable while the photo shows on the right */}
          <div className="absolute inset-0 z-[15] bg-gradient-to-r from-white/95 via-white/75 to-transparent sm:from-white/85 sm:via-white/50 lg:via-white/40 pointer-events-none" />
        </div>

        <button
          onClick={handlePrevSlide}
          aria-label="Previous Slide"
          className="absolute left-2 sm:left-4 lg:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/90 hover:bg-white text-slate-800 hover:text-[#123B92] border border-slate-200/90 shadow-xl hidden sm:flex items-center justify-center transition-all active:scale-90 cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <button
          onClick={handleNextSlide}
          aria-label="Next Slide"
          className="absolute right-2 sm:right-4 lg:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/90 hover:bg-white text-slate-800 hover:text-[#123B92] border border-slate-200/90 shadow-xl hidden sm:flex items-center justify-center transition-all active:scale-90 cursor-pointer"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-16 lg:px-20">
          <div className="max-w-xl lg:max-w-3xl text-left flex flex-col items-start space-y-6">

            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-2xl sm:rounded-full bg-white/95 border border-[#123B92]/30 text-[#123B92] text-xs font-bold shadow-md max-w-full">
              <Sun className="w-4 h-4 text-[#002DC2] shrink-0" />
              <span>{t('heroBadge')}</span>
            </div>

            <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#123B92] leading-tight">
              {t('heroTitle1')} <br />
              <span className="text-[#002DC2]">{t('heroTitle2')}</span>
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-slate-800 leading-relaxed font-semibold max-w-xl">
              {t('heroSubtitle')}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-3 pt-2 w-full sm:w-auto">
              <a
                href="#roi-calculator"
                className="px-6 py-3.5 sm:px-8 sm:py-4 bg-[#23AC39] hover:bg-[#1f9632] text-white font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 active:scale-95"
              >
                <span>{t('calcSavings')}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <Link
                to="/dryers"
                className="px-6 py-3.5 sm:px-8 sm:py-4 bg-white hover:bg-slate-50 border-2 border-[#123B92] text-[#123B92] font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all flex items-center justify-center space-x-2 shadow-md active:scale-95"
              >
                <span>{t('exploreModels')}</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="bg-white/90 backdrop-blur-md border border-slate-200/90 shadow-xl rounded-2xl p-4 sm:p-5 w-full max-w-lg grid grid-cols-3 gap-3 sm:gap-4 divide-x divide-slate-200">
              <div className="pr-2">
                <div className="text-xl sm:text-2xl lg:text-3xl font-black text-[#123B92] tracking-tight whitespace-nowrap">1,200+</div>
                <div className="text-xs sm:text-xs text-slate-700 font-bold mt-1 leading-snug">{t('dryersInstalled')}</div>
              </div>
              <div className="px-2 sm:px-3">
                <div className="text-xl sm:text-2xl lg:text-3xl font-black text-[#002DC2] tracking-tight whitespace-nowrap">500+ MT</div>
                <div className="text-xs sm:text-xs text-slate-700 font-bold mt-1 leading-snug">{t('foodSaved')}</div>
              </div>
              <div className="pl-2 sm:pl-3">
                <div className="text-xl sm:text-2xl lg:text-3xl font-black text-[#23AC39] tracking-tight whitespace-nowrap">40-60%</div>
                <div className="text-xs sm:text-xs text-slate-700 font-bold mt-1 leading-snug">{t('subsidyHelp')}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 inset-x-0 z-20 flex items-center justify-center space-x-2">
          {heroSlides.map((slide, idx) => (
            <button
              key={slide.image}
              onClick={() => setCurrentHeroSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                currentHeroSlide === idx ? 'w-8 bg-slate-900 shadow-md ring-2 ring-white' : 'w-2.5 bg-white/90 ring-1 ring-slate-500 hover:bg-white'
              }`}
            />
          ))}
        </div>
      </section>


      {/* SECTION 2: TRUST STRIP */}
      <section className="w-full section-even py-10 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-8">
            <h2 className="text-3xl sm:text-4xl font-black text-[#123B92] tracking-tight">{t('homeTrustTitle')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            {[
              { Icon: ShieldCheck, key: 'mnreBadge' },
              { Icon: Award, key: 'isoBadge' },
              { Icon: Zap, key: 'subsidyBadge2' },
            ].map(({ Icon, key }) => (
              <div key={key} className="flex items-center space-x-3 px-5 py-4 bg-white rounded-2xl border border-slate-200/90">
                <Icon className="w-6 h-6 text-[#123B92] stroke-[1.8] shrink-0" />
                <span className="text-sm font-bold text-[#123B92] leading-snug">{t(key)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* SECTION 3: ROI CALCULATOR */}
      <section className="w-full section-odd py-12 sm:py-16" id="roi-calculator">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
            <h2 className="text-3xl sm:text-4xl font-black text-[#123B92] tracking-tight">{t('roiTitle')}</h2>
            <p className="text-base sm:text-lg text-slate-600">{t('roiSubtitle')}</p>
          </div>
          <ROICalculator onSelectModelQuote={(modelKey, kg, crop, fullModel) => onOpenQuoteModal({
            capacityNeeded: modelKey,
            cropType: crop,
            message: `Inquiry for ${fullModel || modelKey} (${kg} kg/batch of ${crop})`
          })} />
        </div>
      </section>


      {/* SECTION 4: PRODUCT MODEL SHOWCASE */}
      <section className="w-full section-even py-8 sm:py-12 px-0 mx-0 overflow-x-hidden">
        <ProductModelShowcase
          onOpenQuoteModal={onOpenQuoteModal}
          onOpenDetailModal={onOpenDetailModal}
        />
      </section>


      {/* SECTION 5: INSTALLATION MAP */}
      <section className="w-full section-odd py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black text-[#123B92] tracking-tight">
              {t('mapTitle1')}
            </h2>
            <p className="text-base sm:text-lg text-slate-600 font-medium">{t('homeMapDesc')}</p>
          </div>

          <MapComponent onSelectProjectQuote={(project) => onOpenQuoteModal({ cropType: project.cropDrying, capacityNeeded: project.capacity, district: project.locationName })} />
        </div>
      </section>


      {/* SECTION 6: WHAT CAN YOU DRY */}
      <section className="w-full section-even py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
            <h2 className="text-3xl sm:text-4xl font-black text-[#123B92] tracking-tight">{t('whatCanYouDry')}</h2>
            <Link to="/applications" className="text-sm font-bold text-[#002DC2] hover:underline inline-flex items-center justify-center">
              {t('viewAllCrops')} <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {crops.map((crop) => (
              <div key={crop.titleKey} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                  <img
                    src={crop.image}
                    alt={crop.alt}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5 space-y-1.5">
                  <h3 className="text-xl font-bold text-[#123B92]">{t(crop.titleKey)}</h3>
                  <p className="text-sm text-slate-600">{t(crop.descKey)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* SECTION 7: ABOUT ZENITEK + PARTNERS */}
      <section className="w-full section-odd py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">

          <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
            <span className="text-xs font-black text-[#002DC2] uppercase tracking-wider bg-[#F0F4FD] border border-[#002DC2]/20 px-3.5 py-1.5 rounded-full inline-block">
              {t('homeAboutBadge')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#123B92] tracking-tight">
              {t('homeAboutTitle1')} <span className="text-[#002DC2]">{t('homeAboutTitle2')}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center !mt-0">
            <div className="space-y-6">
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed">{t('homeAboutDesc')}</p>

              <div className="flex flex-wrap gap-2.5">
                {pillars.map(({ key, Icon }) => (
                  <span key={key} className="inline-flex items-center gap-2 px-3.5 py-2 bg-white rounded-xl border border-slate-200 text-sm font-bold text-[#123B92]">
                    <Icon className="w-4 h-4 text-[#002DC2]" />
                    {t(key)}
                  </span>
                ))}
              </div>

              <Link
                to="/about"
                className="inline-flex items-center space-x-2 px-6 py-3.5 bg-[#002DC2] hover:bg-[#123B92] text-white font-extrabold text-sm uppercase tracking-wider rounded-xl shadow-md transition-all"
              >
                <span>{t('homeAboutCta')}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <img
                src="/real-photos/zenitek_photo_02.jpeg"
                alt="Farmers spreading chillies on racks inside a ZeniTEK tunnel dryer"
                loading="lazy"
                className="w-full h-64 sm:h-80 object-cover rounded-2xl shadow-md"
              />
              <img
                src="/real-photos/zenitek_photo_19.jpeg"
                alt="ZeniTEK solar tunnel dryer among palm trees"
                loading="lazy"
                className="w-full h-64 sm:h-80 object-cover rounded-2xl shadow-md mt-8"
              />
            </div>
          </div>

          <div className="pt-10 border-t border-slate-200/80 space-y-6">
            <h3 className="text-2xl text-center font-black text-[#123B92] tracking-tight">
              {t('homePartnersTitle')}
            </h3>

            <div className="client-marquee-container py-2">
              <div className="client-marquee-track gap-4 sm:gap-6 pr-4 sm:pr-6">
                {[...clientPartners, ...clientPartners].map((client, idx) => (
                  <div
                    key={`${client.name}-${idx}`}
                    className="flex items-center space-x-3 px-4 py-3 bg-white rounded-2xl border border-slate-200/90 shrink-0 select-none"
                  >
                    <img src={client.logo} alt={client.name} className="w-12 h-12 object-contain shrink-0" />
                    <span className="text-sm sm:text-base font-bold text-[#123B92] whitespace-nowrap">{client.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* SECTION 8: FARMER STORIES */}
      <section className="w-full section-even py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#123B92]">{t('trustedBy')}</h2>
            <p className="text-base sm:text-lg text-slate-600">{t('homeStoriesDesc')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sampleReviews.map(rev => (
              <div key={rev._id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between gap-4">
                <div className="space-y-3">
                  <div className="text-[#23AC39]">{'★'.repeat(rev.rating || 5)}</div>
                  <p className="text-sm text-slate-700 leading-relaxed italic">"{rev.comment}"</p>
                </div>
                <div className="pt-3 border-t border-slate-200">
                  <h4 className="text-lg font-extrabold text-[#123B92]">{rev.name}</h4>
                  <div className="text-xs font-semibold text-[#1A822B]">{rev.role}</div>
                  <div className="text-xs text-slate-400 flex items-center mt-0.5">
                    <MapPin className="w-3 h-3 mr-0.5" /> {rev.location}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* SECTION 9: QUICK ENQUIRY FORM */}
      <section className="w-full section-odd py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-[#123B92] shadow-xl text-black">
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-3xl sm:text-4xl font-black text-[#123B92]">{t('quickFormTitle')}</h2>
              <p className="text-base sm:text-lg text-black/70">{t('quickFormDesc')}</p>
            </div>

            <form onSubmit={handleQuickSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>{t('yourName')} *</label>
                  <input
                    type="text"
                    required
                    value={quickForm.name}
                    onChange={(e) => setQuickForm({ ...quickForm, name: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>{t('whatsappNum')} *</label>
                  <input
                    type="tel"
                    required
                    value={quickForm.phone}
                    onChange={(e) => setQuickForm({ ...quickForm, phone: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>{t('districtCity')} *</label>
                  <input
                    type="text"
                    required
                    placeholder={t('homeDistrictPh')}
                    value={quickForm.district}
                    onChange={(e) => setQuickForm({ ...quickForm, district: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>{t('dryerModel')} *</label>
                  <select
                    value={quickForm.capacityNeeded}
                    onChange={(e) => setQuickForm({ ...quickForm, capacityNeeded: e.target.value })}
                    className={`${inputClass} cursor-pointer`}
                  >
                    <option value="Portable DIY Solar Dryer (10-50 kg)">{t('modelPortable')} (10-50 kg)</option>
                    <option value="Commercial Polyhouse Tunnel Dryer (100-500 kg)">{t('modelPolyhouse')} (100-500 kg)</option>
                    <option value="Multi-Tunnel Industrial Hybrid Dryer (1 Ton+)">{t('modelIndustrial')} (1 Ton+)</option>
                    <option value="Custom Dryer Sizing Consult">Custom Dryer Sizing Consult</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>{t('targetCrop')} *</label>
                  <select
                    value={quickForm.cropType}
                    onChange={(e) => setQuickForm({ ...quickForm, cropType: e.target.value })}
                    className={`${inputClass} cursor-pointer`}
                  >
                    <option value="Copra/Coconut">{t('cropCopra')}</option>
                    <option value="Moringa/Herbs">{t('cropMoringa')}</option>
                    <option value="Spices/Chillies">{t('cropSpices')}</option>
                    <option value="Fruits/Veggies">{t('cropFruits')}</option>
                    <option value="Fish/Seafood">{t('cropFish')}</option>
                    <option value="Other">{t('cropOther')}</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>{t('descriptionReqs')}</label>
                  <input
                    type="text"
                    placeholder={t('homeMessagePh')}
                    value={quickForm.message}
                    onChange={(e) => setQuickForm({ ...quickForm, message: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-center">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#23AC39] hover:bg-[#23AC39] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2"
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
