import React from 'react';
import { ShieldCheck, Award, Factory, Users, Globe, Cpu, Leaf, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function AboutUsPage({ onOpenQuoteModal }) {
  const { t } = useLanguage();

  return (
    <div className="text-slate-900 min-h-screen bg-slate-50">
      
      {/* SECTION 1: HERO HEADER (ODD: WHITE) */}
      <section className="w-full section-odd py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
            {t('aboutBadge')}
          </span>
          <h1 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-black text-blue-950">
            {t('aboutTitle1')} <br />
            <span className="text-green-700">
              {t('aboutTitle2')}
            </span>
          </h1>
          <p className="text-xs sm:text-base text-slate-600 max-w-3xl mx-auto leading-relaxed font-medium">
            {t('aboutSubtitle')}
          </p>
        </div>
      </section>

      {/* SECTION 2: ROOTS & JOURNEY (EVEN: SLATE-100/75) */}
      <section className="w-full section-even py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-white p-5 sm:p-8 lg:p-12 rounded-3xl border border-slate-200 shadow-sm">
            
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-bold text-green-700 uppercase tracking-wider">{t('aboutHub')}</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950">{t('aboutInnovation')}</h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t('aboutP1')}
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t('aboutP2')}
              </p>
              <div className="pt-2 flex items-center space-x-6 text-xs text-blue-800 font-bold">
                <span>{t('aboutF1')}</span>
                <span>{t('aboutF2')}</span>
              </div>
            </div>

            <div className="lg:col-span-6 relative">
              <img
                src="/real-photos/zenitek_photo_19.jpeg"
                alt="ZeniTEK Solar Polyhouse Facility"
                className="w-full h-80 object-cover rounded-2xl border border-slate-200 shadow-md"
              />
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 3: TECHNOLOGY PILLARS (ODD: WHITE) */}
      <section className="w-full section-odd py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950">{t('aboutPillarsTitle')}</h2>
            <p className="text-xs text-slate-500">{t('aboutPillarsSubtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">{t('pillar1Title')}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{t('pillar1Desc')}</p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-green-100 text-green-800 flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">{t('pillar2Title')}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{t('pillar2Desc')}</p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                <Leaf className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">{t('pillar3Title')}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{t('pillar3Desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: IMPACT METRICS PANEL (EVEN SECTION - SOFT OFF-WHITE) */}
      <section className="w-full section-even py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-3xl sm:text-4xl font-black text-blue-950">1,200+</div>
              <div className="text-xs text-slate-600 font-semibold mt-1">{t('impact1')}</div>
            </div>
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-3xl sm:text-4xl font-black text-green-700">500+ Tons</div>
              <div className="text-xs text-slate-600 font-semibold mt-1">{t('impact2')}</div>
            </div>
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-3xl sm:text-4xl font-black text-blue-950">45% Avg</div>
              <div className="text-xs text-slate-600 font-semibold mt-1">{t('impact3')}</div>
            </div>
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-3xl sm:text-4xl font-black text-green-700">100%</div>
              <div className="text-xs text-slate-600 font-semibold mt-1">{t('impact4')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: SUBSIDY GRID & CONSULTATION (ODD SECTION - CRISP WHITE) */}
      <section className="w-full section-odd py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950">{t('govtBadgesTitle')}</h2>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <span className="px-4 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-blue-800 shadow-sm flex items-center">
              <ShieldCheck className="w-4 h-4 mr-2 text-green-600" /> {t('mnreApproved')}
            </span>
            <span className="px-4 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-green-800 shadow-sm flex items-center">
              <Award className="w-4 h-4 mr-2 text-blue-600" /> {t('isoSystem')}
            </span>
            <span className="px-4 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 shadow-sm flex items-center">
              <Factory className="w-4 h-4 mr-2 text-blue-700" /> {t('ceMarked')}
            </span>
          </div>

          <div className="pt-4">
            <button
              onClick={() => onOpenQuoteModal()}
              className="px-8 py-3.5 bg-gradient-to-r from-blue-700 to-green-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:scale-105 transition-all shadow-md inline-flex items-center space-x-2 cursor-pointer"
            >
              <span>{t('consultEngineers')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
