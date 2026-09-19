import React from 'react';
import { ShieldCheck, Award, Factory, Users, Globe, Cpu, Leaf, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function AboutUsPage({ onOpenQuoteModal }) {
  const { t } = useLanguage();

  return (
    <div className="text-black min-h-screen bg-white">
      
      {/* SECTION 1: HERO HEADER (ODD: WHITE) */}
      <section className="w-full section-odd py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-bold text-[#123B92] uppercase tracking-widest bg-[#F0F4FD] border border-[#123B92]/30 px-3 py-1 rounded-full">
            {t('aboutBadge')}
          </span>
          <h1 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-black text-[#123B92]">
            {t('aboutTitle1')} <br />
            <span className="text-[#002DC2]">
              {t('aboutTitle2')}
            </span>
          </h1>
          <p className="text-xs sm:text-base text-black max-w-3xl mx-auto leading-relaxed font-medium">
            {t('aboutSubtitle')}
          </p>
        </div>
      </section>

      {/* SECTION 2: ROOTS & JOURNEY (EVEN: SOFT LIGHT TINT) */}
      <section className="w-full section-even py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-white p-5 sm:p-8 lg:p-12 rounded-3xl border border-[#123B92]/20 shadow-sm">
            
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-bold text-[#002DC2] uppercase tracking-wider">{t('aboutHub')}</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#123B92]">{t('aboutInnovation')}</h2>
              <p className="text-xs sm:text-sm text-black leading-relaxed">
                {t('aboutP1')}
              </p>
              <p className="text-xs sm:text-sm text-black leading-relaxed">
                {t('aboutP2')}
              </p>
              <div className="pt-2 flex items-center space-x-6 text-xs text-[#002DC2] font-bold">
                <span>{t('aboutF1')}</span>
                <span>{t('aboutF2')}</span>
              </div>
            </div>

            <div className="lg:col-span-6 relative">
              <img
                src="/real-photos/zenitek_photo_19.jpeg"
                alt="ZeniTEK Solar Polyhouse Facility"
                className="w-full h-80 object-cover rounded-2xl border border-[#123B92]/20 shadow-md"
              />
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 3: TECHNOLOGY PILLARS (ODD: WHITE) */}
      <section className="w-full section-odd py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#123B92]">{t('aboutPillarsTitle')}</h2>
            <p className="text-xs text-black/70">{t('aboutPillarsSubtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="p-6 bg-[#F0F4FD] rounded-2xl border border-[#123B92]/20 space-y-3 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-[#002DC2] text-white flex items-center justify-center font-bold">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#123B92]">{t('pillar1Title')}</h3>
              <p className="text-xs text-black leading-relaxed">{t('pillar1Desc')}</p>
            </div>

            <div className="p-6 bg-[#F0F4FD] rounded-2xl border border-[#123B92]/20 space-y-3 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-[#123B92] text-white flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#123B92]">{t('pillar2Title')}</h3>
              <p className="text-xs text-black leading-relaxed">{t('pillar2Desc')}</p>
            </div>

            <div className="p-6 bg-[#F0F4FD] rounded-2xl border border-[#123B92]/20 space-y-3 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-[#002DC2] text-white flex items-center justify-center font-bold">
                <Leaf className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#123B92]">{t('pillar3Title')}</h3>
              <p className="text-xs text-black leading-relaxed">{t('pillar3Desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: IMPACT METRICS PANEL (EVEN SECTION - SOFT LIGHT TINT) */}
      <section className="w-full section-even py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-5 bg-white rounded-2xl border border-[#123B92]/20 shadow-sm">
              <div className="text-3xl sm:text-4xl font-black text-[#123B92]">1,200+</div>
              <div className="text-xs text-black font-semibold mt-1">{t('impact1')}</div>
            </div>
            <div className="p-5 bg-white rounded-2xl border border-[#123B92]/20 shadow-sm">
              <div className="text-3xl sm:text-4xl font-black text-[#002DC2]">500+ Tons</div>
              <div className="text-xs text-black font-semibold mt-1">{t('impact2')}</div>
            </div>
            <div className="p-5 bg-white rounded-2xl border border-[#123B92]/20 shadow-sm">
              <div className="text-3xl sm:text-4xl font-black text-[#123B92]">45% Avg</div>
              <div className="text-xs text-black font-semibold mt-1">{t('impact3')}</div>
            </div>
            <div className="p-5 bg-white rounded-2xl border border-[#123B92]/20 shadow-sm">
              <div className="text-3xl sm:text-4xl font-black text-[#002DC2]">100%</div>
              <div className="text-xs text-black font-semibold mt-1">{t('impact4')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: SUBSIDY GRID & CONSULTATION (ODD SECTION - CRISP WHITE) */}
      <section className="w-full section-odd py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#123B92]">{t('govtBadgesTitle')}</h2>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <span className="px-4 py-2 bg-white border border-[#123B92]/30 rounded-xl text-xs font-bold text-black shadow-sm flex items-center">
              <ShieldCheck className="w-4 h-4 mr-2 text-[#002DC2]" /> {t('mnreApproved')}
            </span>
            <span className="px-4 py-2 bg-white border border-[#123B92]/30 rounded-xl text-xs font-bold text-black shadow-sm flex items-center">
              <Award className="w-4 h-4 mr-2 text-[#002DC2]" /> {t('isoSystem')}
            </span>
            <span className="px-4 py-2 bg-white border border-[#123B92]/30 rounded-xl text-xs font-bold text-black shadow-sm flex items-center">
              <Factory className="w-4 h-4 mr-2 text-[#002DC2]" /> {t('ceMarked')}
            </span>
          </div>

          <div className="pt-4">
            <button
              onClick={() => onOpenQuoteModal()}
              className="px-8 py-3.5 bg-[#00FB00] hover:bg-[#002DC2] text-black hover:text-white font-extrabold text-xs uppercase tracking-wider rounded-xl hover:scale-105 transition-all shadow-md inline-flex items-center space-x-2 cursor-pointer"
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
