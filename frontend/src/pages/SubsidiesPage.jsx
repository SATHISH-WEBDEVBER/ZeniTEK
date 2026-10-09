import React, { useState } from 'react';
import { 
  ShieldCheck, Award, ArrowRight, CheckCircle2, FileText, 
  HelpCircle, IndianRupee, Landmark, Sparkles, Building, PhoneCall,
  Download, Calculator, Clock, Users, Check, ChevronDown
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import PageHero from '../components/PageHero';

// Native <select> can't wrap its value, so long option labels got truncated on
// mobile. Show the selected label in a wrapping box and overlay a transparent select.
function WrapSelect({ value, onChange, options, ariaLabel }) {
  const current = options.find(([v]) => v === value);
  return (
    <div className="relative w-full bg-[#F0F4FD] border border-[#123B92]/30 rounded-xl focus-within:border-[#002DC2] focus-within:ring-2 focus-within:ring-[#002DC2]/20">
      <div aria-hidden="true" className="pl-3.5 pr-9 py-2.5 text-sm font-bold text-[#123B92] leading-snug">
        {(current ? current[1] : value).replace(/\(([^)]{1,16})\)/g, (m) => m.replace(/ /g, ' '))}
      </div>
      <ChevronDown className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-[#123B92] pointer-events-none" />
      <select
        value={value}
        onChange={onChange}
        aria-label={ariaLabel}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      >
        {options.map(([v, label]) => (
          <option key={v} value={v}>{label}</option>
        ))}
      </select>
    </div>
  );
}

export default function SubsidiesPage({ onOpenQuoteModal }) {
  const { t } = useLanguage();

  const [calcState, setCalcState] = useState('Tamil Nadu');
  const [calcModel, setCalcModel] = useState('SOLDRY 1210 (Commercial)');
  const [calcFarmerType, setCalcFarmerType] = useState('Small / Marginal Farmer');

  // Subsidy percentage calculation
  let subsidyPercent = 50;
  if (calcFarmerType === 'SC / ST / Women Farmer' || calcFarmerType === 'FPO / SHG Group') {
    subsidyPercent = 60;
  } else if (calcFarmerType === 'General Commercial Exporter') {
    subsidyPercent = 40;
  }

  // Scheme cards and steps: text lives in src/i18n/sections.js (sections_scheme<N>_* / sections_step<N>_*)
  const subsidySchemes = [1, 2, 3, 4].map((n) => ({
    title: t(`sections_scheme${n}_title`),
    coverage: t(`sections_scheme${n}_coverage`),
    target: t(`sections_scheme${n}_target`),
    description: t(`sections_scheme${n}_desc`),
    criteria: [1, 2, 3].map((c) => t(`sections_scheme${n}_c${c}`))
  }));

  const subsidySteps = [1, 2, 3, 4, 5].map((n) => ({
    step: `0${n}`,
    title: t(`sections_step${n}_title`),
    desc: t(`sections_step${n}_desc`)
  }));

  // Display name of the selected state (the select value stays English for the enquiry message)
  const STATE_KEYS = {
    'Tamil Nadu': 'TN', 'Karnataka': 'KA', 'Kerala': 'KL', 'Maharashtra': 'MH',
    'Andhra Pradesh': 'AP', 'All India': 'ALL'
  };
  const stateName = STATE_KEYS[calcState] ? t(`sections_state_${STATE_KEYS[calcState]}`) : calcState;

  return (
    <div className="text-slate-900 min-h-screen bg-white">
      
      {/* SECTION 1: HERO HEADER (background photo, left-aligned heading) */}
      <PageHero
        images="/real-photos/zenitek_photo_33.jpeg"
        title={<>{t('sections_subHeroTitle1')} <br /><span className="text-[#002DC2]">{t('sections_subHeroTitle2')}{' '}<span className="whitespace-nowrap">(40% – 60%)</span></span></>}
        subtitle={<>{t('sections_subHeroSubPre')} <strong>{t('sections_subHeroSubStrong')}</strong> {t('sections_subHeroSubPost')}</>}
        actions={<>
          <button
            type="button"
            onClick={() => onOpenQuoteModal({ capacityNeeded: "Subsidy Assistance", message: "I want subsidy assistance for ZeniTEK Solar Dryer." })}
            className="px-6 py-3.5 bg-[#23AC39] hover:bg-[#1f9632] text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer hover:shadow-xl active:scale-95"
          >
            <span>{t('sections_checkEligibility')}</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>
          <a
            href="#subsidy-schemes"
            onClick={(e) => {
              const el = document.getElementById('subsidy-schemes');
              if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
            }}
            className="px-6 py-3.5 bg-white hover:bg-slate-50 border-2 border-[#123B92] text-[#123B92] font-black text-xs uppercase tracking-wider rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <span>{t('sections_viewSchemes')}</span>
          </a>
        </>}
      />


      {/* SECTION 2: FAST ELIGIBILITY ESTIMATOR */}
      <section className="w-full section-even py-10 sm:py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
            <div className="flex justify-center">
              <div className="w-12 h-12 rounded-xl bg-[#F0F4FD] border border-[#123B92]/20 flex items-center justify-center text-[#123B92]">
                <Calculator className="w-6 h-6" />
              </div>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#123B92] tracking-tight">
              {t('sections_estTitle')}
            </h2>
            <p className="text-base sm:text-lg text-slate-600">
              {t('sections_estSub')}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/90 shadow-xl space-y-6">

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="lg:col-span-2">
                <label className="block text-xs font-bold text-[#123B92] uppercase tracking-wider mb-1.5">
                  {t('sections_stateRegion')}
                </label>
                <WrapSelect
                  ariaLabel={t('sections_stateRegion')}
                  value={calcState}
                  onChange={(e) => setCalcState(e.target.value)}
                  options={[
                    ["Tamil Nadu", t('sections_optTN')],
                    ["Karnataka", t('sections_optKA')],
                    ["Kerala", t('sections_optKL')],
                    ["Maharashtra", t('sections_optMH')],
                    ["Andhra Pradesh", t('sections_state_APTS')],
                    ["All India", t('sections_optOther')],
                  ]}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#123B92] uppercase tracking-wider mb-1.5">
                  {t('sections_capacityNeeded')}
                </label>
                <WrapSelect
                  ariaLabel={t('sections_capacityNeeded')}
                  value={calcModel}
                  onChange={(e) => setCalcModel(e.target.value)}
                  options={[
                    ["SUNDRY 50 (50-100 kg)", t('sections_subModel1')],
                    ["SOLDRY 1210 (Commercial)", t('sections_subModel2')],
                    ["SOLDRY 1709 (Parabolic)", t('sections_subModel3')],
                    ["Industrial Multi-Tunnel (1 Ton+)", t('sections_subModel4')],
                  ]}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#123B92] uppercase tracking-wider mb-1.5">
                  {t('sections_beneficiaryCategory')}
                </label>
                <WrapSelect
                  ariaLabel={t('sections_beneficiaryCategory')}
                  value={calcFarmerType}
                  onChange={(e) => setCalcFarmerType(e.target.value)}
                  options={[
                    ["Small / Marginal Farmer", t('sections_farmerSmall')],
                    ["SC / ST / Women Farmer", t('sections_farmerSc')],
                    ["FPO / SHG Group", t('sections_farmerFpo')],
                    ["General Commercial Exporter", t('sections_farmerGeneral')],
                  ]}
                />
              </div>
            </div>

            {/* Calculated Result Box */}
            <div className="bg-gradient-to-br from-[#123B92] via-[#0D2E73] to-[#0A225C] text-white p-5 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 shadow-lg">
              <div>
                <div className="text-xs text-white/85 uppercase font-bold tracking-wider">
                  {t('sections_estCoverage')}
                </div>
                <div className="text-2xl sm:text-3xl font-black text-[#23AC39] leading-tight text-balance">
                  {t('sections_estPercent', { percent: subsidyPercent })}
                </div>
                <div className="text-sm text-white/80 mt-1">
                  {t('sections_estValid', { state: stateName })}
                </div>
              </div>

              <button
                onClick={() => onOpenQuoteModal({ 
                  capacityNeeded: calcModel,
                  district: calcState,
                  message: `Requesting subsidy DPR and eligibility verification for ${calcModel} in ${calcState} (${calcFarmerType}).`
                })}
                className="w-full sm:w-auto px-6 py-3 bg-[#23AC39] hover:bg-[#1f9632] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all shrink-0 cursor-pointer flex items-center justify-center space-x-1.5"
              >
                <span>{t('sections_applyZenitek')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </section>


      {/* SECTION 3: KEY SUBSIDY SCHEMES */}
      <section id="subsidy-schemes" className="w-full section-odd py-14 sm:py-[72px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <h2 className="text-3xl sm:text-4xl font-black text-[#123B92]">
              {t('sections_schemesTitle')}
            </h2>
            <p className="text-base sm:text-lg text-slate-600 font-medium">
              {t('sections_schemesSub')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {subsidySchemes.map((scheme, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-md hover:shadow-xl transition-all space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs font-black uppercase tracking-normal sm:tracking-wide text-[#1A822B] bg-[#23AC39]/10 border border-[#23AC39]/30 px-2.5 py-1 rounded-md inline-block max-w-full leading-snug text-balance">
                      {scheme.coverage}
                    </span>
                    <h3 className="text-xl font-black text-[#123B92] mt-2">
                      {scheme.title}
                    </h3>
                    <div className="text-sm text-slate-500 font-semibold mt-1">
                      {t('sections_schemeTarget', { target: scheme.target })}
                    </div>
                  </div>
                </div>

                <p className="text-sm text-slate-700 leading-relaxed font-medium">
                  {scheme.description}
                </p>

                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <div className="text-xs font-bold uppercase text-slate-600">{t('sections_keyReq')}</div>
                  {scheme.criteria.map((c, idx) => (
                    <div key={idx} className="flex items-start text-sm text-slate-800 leading-snug">
                      <CheckCircle2 className="w-4 h-4 text-[#23AC39] mr-2 mt-0.5 shrink-0" />
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* SECTION 4: 5-STEP ASSISTANCE PROCESS */}
      <section className="w-full section-even py-14 sm:py-[72px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <h2 className="text-3xl sm:text-4xl font-black text-[#123B92]">
              {t('sections_stepsTitle')}
            </h2>
            <p className="text-base sm:text-lg text-slate-600 font-medium">
              {t('sections_stepsSub')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
            {subsidySteps.map((step) => (
              <div key={step.step} className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-sm relative">
                <div className="text-3xl font-black text-[#002DC2] mb-2">
                  {step.step}
                </div>
                <h4 className="text-lg font-black text-[#123B92] leading-snug mb-2">
                  {step.title}
                </h4>
                <p className="text-sm text-slate-600 font-medium leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Bottom Action Card */}
          <div className="bg-[#123B92] text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <h3 className="text-2xl font-black text-white">
                {t('sections_ctaQ')}
              </h3>
              <p className="text-sm text-white/85">
                {t('sections_ctaQSub')}
              </p>
            </div>
            <button
              onClick={() => onOpenQuoteModal({ capacityNeeded: "Subsidy Consultation", message: "I want a free telephone consultation regarding government subsidy for solar dryer." })}
              className="w-full md:w-auto px-8 py-3.5 bg-[#23AC39] hover:bg-[#1f9632] text-white font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-lg transition-all shrink-0 cursor-pointer text-balance md:whitespace-nowrap"
            >
              {t('sections_freeConsult')}
            </button>
          </div>

        </div>
      </section>

    </div>
  );
}
