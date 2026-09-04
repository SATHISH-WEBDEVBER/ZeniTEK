import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ROICalculator from '../components/ROICalculator';
import MapComponent from '../components/MapComponent';
import { sampleReviews, dryerModelsData } from '../data/sampleData';
import { useLanguage } from '../context/LanguageContext';
import {
  Sun, ShieldCheck, Award, ArrowRight, Play, CheckCircle2, TrendingUp, Zap, ChevronRight, MapPin
} from 'lucide-react';

export default function HomePage({ onOpenQuoteModal, onOpenDetailModal }) {
  const { t } = useLanguage();
  const [quickForm, setQuickForm] = useState({
    name: '',
    phone: '',
    district: '',
    cropType: 'Copra/Coconut'
  });

  const handleQuickSubmit = (e) => {
    e.preventDefault();
    onOpenQuoteModal(quickForm);
  };

  return (
    <div className="space-y-20 pb-16 bg-slate-50 text-slate-900 w-full max-w-full overflow-x-hidden">
      
      {/* SECTION 1: HERO SECTION */}
      <section className="relative pt-8 pb-12 lg:pt-14 lg:pb-16 bg-white border-b border-slate-200 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                <Sun className="w-4 h-4 text-blue-600 animate-spin-slow shrink-0" />
                <span className="truncate">{t('heroBadge')}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-blue-950 leading-tight">
                {t('heroTitle1')} <br />
                <span className="text-green-700">
                  {t('heroTitle2')}
                </span>
              </h1>

              <p className="text-sm sm:text-lg text-slate-600 leading-relaxed font-medium max-w-2xl">
                {t('heroSubtitle')}
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
                <a
                  href="#roi-calculator"
                  className="px-6 py-4 bg-gradient-to-r from-blue-700 via-blue-600 to-green-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all text-center flex items-center justify-center space-x-2"
                >
                  <span>{t('calcSavings')}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <Link
                  to="/dryers"
                  className="px-6 py-4 bg-white border border-slate-300 hover:border-blue-600 text-slate-800 hover:text-blue-700 font-bold text-xs rounded-2xl transition-all text-center flex items-center justify-center space-x-2 shadow-sm"
                >
                  <span>{t('exploreModels')}</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="pt-6 border-t border-slate-200 grid grid-cols-3 gap-4">
                <div>
                  <div className="text-xl sm:text-3xl font-black text-blue-900">1,200+</div>
                  <div className="text-[11px] sm:text-xs text-slate-500 font-semibold mt-0.5">{t('dryersInstalled')}</div>
                </div>
                <div>
                  <div className="text-xl sm:text-3xl font-black text-green-700">500+ MT</div>
                  <div className="text-[11px] sm:text-xs text-slate-500 font-semibold mt-0.5">{t('foodSaved')}</div>
                </div>
                <div>
                  <div className="text-xl sm:text-3xl font-black text-slate-900">40-60%</div>
                  <div className="text-[11px] sm:text-xs text-slate-500 font-semibold mt-0.5">{t('subsidyHelp')}</div>
                </div>
              </div>

            </div>

            {/* Right Visual Image Overlay */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-xl group">
                <img
                  src="https://images.unsplash.com/photo-1546554137-f86b9593a222?auto=format&fit=crop&w=1000&q=80"
                  alt="ZeniTEK Polyhouse Solar Dryer"
                  className="w-full h-[380px] sm:h-[400px] object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>

                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200 shadow-md flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 font-bold shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Polyhouse Green House Dryer</div>
                      <div className="text-[10px] text-green-700 font-semibold">Coimbatore Manufacturing Hub</div>
                    </div>
                  </div>
                  <span className="text-[9px] bg-green-700 text-white font-bold px-2 py-1 rounded uppercase shrink-0">
                    MNRE Enlisted
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* SECTION 2: TRUST BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="flex items-center justify-center space-x-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <ShieldCheck className="w-6 h-6 text-blue-700 shrink-0" />
            <div className="text-left">
              <div className="text-sm font-bold text-slate-900">{t('mnreBadge')}</div>
              <div className="text-xs text-slate-500">Government Ministry Approved</div>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <Award className="w-6 h-6 text-green-700 shrink-0" />
            <div className="text-left">
              <div className="text-sm font-bold text-slate-900">{t('isoBadge')}</div>
              <div className="text-xs text-slate-500">Precision Engineering Standard</div>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <Zap className="w-6 h-6 text-blue-700 shrink-0" />
            <div className="text-left">
              <div className="text-sm font-bold text-slate-900">{t('subsidyBadge2')}</div>
              <div className="text-xs text-slate-500">Agri & NABARD Subsidies</div>
            </div>
          </div>
        </div>
      </section>


      {/* SECTION 3: INTERACTIVE ROI CALCULATOR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="roi-calculator">
        <ROICalculator onSelectModelQuote={(modelKey, kg, crop) => onOpenQuoteModal({ capacityNeeded: modelKey, cropType: crop })} />
      </section>


      {/* SECTION 4: INTERACTIVE INSTALLATION MAP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="border-b border-slate-200 pb-4">
          <span className="text-xs font-bold text-green-700 uppercase tracking-widest bg-green-50 px-3 py-1 rounded-full border border-green-200">
            GEOGRAPHICAL FOOTPRINT
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950 mt-1">
            Active Solar Dryer Installations Map
          </h2>
        </div>

        <MapComponent onSelectProjectQuote={(project) => onOpenQuoteModal({ cropType: project.cropDrying, capacityNeeded: project.capacity, district: project.locationName })} />
      </section>


      {/* SECTION 5: DRYER MODELS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            SOLAR DRYER MODELS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-950">
            {t('modelsHeading')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            {t('modelsSubtitle')} (Click any model for complete specifications & photos)
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {dryerModelsData.map(model => (
            <div key={model.id} className="bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-blue-500 transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-lg group">
              <div className="cursor-pointer" onClick={() => onOpenDetailModal && onOpenDetailModal(model)}>
                <div className="relative h-48 overflow-hidden">
                  <img src={model.imageUrl} alt={model.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-blue-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-3 py-1 bg-white/90 text-blue-950 text-xs font-extrabold rounded-lg shadow">View Full Specs</span>
                  </div>
                  <span className="absolute top-3 right-3 bg-blue-700 text-white font-bold text-[10px] uppercase px-2.5 py-1 rounded-md shadow">
                    {model.badge}
                  </span>
                </div>
                
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{model.name}</h3>
                    <p className="text-xs font-bold text-green-700 mt-0.5">{model.capacityRange}</p>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{model.description}</p>
                  
                  <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                    {model.features.slice(0, 3).map((feat, idx) => (
                      <div key={idx} className="flex items-center text-slate-700 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-600 mr-2 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 space-y-2">
                <button
                  onClick={() => onOpenDetailModal && onOpenDetailModal(model)}
                  className="w-full py-2.5 bg-white border border-blue-600 text-blue-700 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-blue-50 transition-all"
                >
                  View Details & Gallery
                </button>

                <button
                  onClick={() => onOpenQuoteModal({ capacityNeeded: model.name })}
                  className="w-full py-3 bg-blue-50 hover:bg-blue-700 hover:text-white text-blue-900 border border-blue-200 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center space-x-1.5"
                >
                  <span>{t('reqQuote')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* SECTION 6: APPLICATIONS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-200 pb-6">
          <div>
            <span className="text-xs font-bold text-green-700 uppercase tracking-widest">VERSATILE PERFORMANCE</span>
            <h2 className="text-3xl font-extrabold text-blue-950 mt-1">{t('whatCanYouDry')}</h2>
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
            <p className="text-xs text-slate-600">Closed polyhouse setup ensuring 100% fly-free dry fish sanitation for export.</p>
          </div>
        </div>
      </section>


      {/* SECTION 7: LEAD CAPTURE ENQUIRY FORM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-green-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="max-w-4xl mx-auto text-center space-y-3 mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold">{t('quickFormTitle')}</h2>
            <p className="text-xs text-blue-100">{t('quickFormDesc')}</p>
          </div>

          <form onSubmit={handleQuickSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <input
                type="text"
                required
                placeholder={`${t('yourName')} *`}
                value={quickForm.name}
                onChange={(e) => setQuickForm({ ...quickForm, name: e.target.value })}
                className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl px-4 py-3 text-xs placeholder-slate-400 font-medium"
              />
            </div>
            <div>
              <input
                type="tel"
                required
                placeholder={`${t('whatsappNum')} *`}
                value={quickForm.phone}
                onChange={(e) => setQuickForm({ ...quickForm, phone: e.target.value })}
                className="w-full bg-slate-300 border border-slate-300 text-slate-900 rounded-xl px-4 py-3 text-xs placeholder-slate-400 font-medium bg-white"
              />
            </div>
            <div>
              <input
                type="text"
                required
                placeholder={`${t('districtCity')} *`}
                value={quickForm.district}
                onChange={(e) => setQuickForm({ ...quickForm, district: e.target.value })}
                className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl px-4 py-3 text-xs placeholder-slate-400 font-medium"
              />
            </div>
            <div>
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
              </select>
            </div>
            <div>
              <button
                type="submit"
                className="w-full py-3 px-4 bg-green-600 hover:bg-green-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow transition-all flex items-center justify-center space-x-1"
              >
                <span>{t('getSubsidyQuote')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      </section>

    </div>
  );
}
