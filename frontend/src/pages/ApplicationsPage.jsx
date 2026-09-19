import React, { useState } from 'react';
import { cropMatrixData } from '../data/sampleData';
import { Layers, ArrowRight, ShieldCheck, Search, Users, Building, Sprout } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function ApplicationsPage({ onOpenQuoteModal }) {
  const [activeTab, setActiveTab] = useState('agri');
  const [searchTerm, setSearchTerm] = useState('');
  const { t } = useLanguage();

  const filteredMatrix = cropMatrixData.filter(item =>
    item.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.benefit.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="text-black min-h-screen bg-white">
      
      {/* SECTION 1: HERO HEADER & SEGMENT FILTER (ODD: WHITE) */}
      <section className="w-full section-odd py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-bold text-[#123B92] uppercase tracking-widest bg-[#F0F4FD] border border-[#123B92]/30 px-3 py-1 rounded-full">
            {t('appMatrixBadge')}
          </span>
          <h1 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-black text-[#123B92]">
            {t('appMatrixTitle1')} <br />
            <span className="text-[#002DC2]">
              {t('appMatrixTitle2')}
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-black max-w-2xl mx-auto font-medium leading-relaxed">
            {t('appMatrixSubtitle')}
          </p>

          {/* Segment Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={() => setActiveTab('agri')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'agri' ? 'bg-[#002DC2] text-white shadow ring-2 ring-[#23AC39]' : 'bg-white text-black hover:text-[#002DC2] hover:bg-[#F0F4FD] border border-[#123B92]/30'}`}
            >
              {t('tabAgri')}
            </button>
            <button
              onClick={() => setActiveTab('marine')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'marine' ? 'bg-[#002DC2] text-white shadow ring-2 ring-[#23AC39]' : 'bg-white text-black hover:text-[#002DC2] hover:bg-[#F0F4FD] border border-[#123B92]/30'}`}
            >
              {t('tabMarine')}
            </button>
            <button
              onClick={() => setActiveTab('industrial')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'industrial' ? 'bg-[#002DC2] text-white shadow ring-2 ring-[#23AC39]' : 'bg-white text-black hover:text-[#002DC2] hover:bg-[#F0F4FD] border border-[#123B92]/30'}`}
            >
              {t('tabIndustrial')}
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 2: CARD GRID ACTIVE VIEWS (EVEN: SOFT LIGHT TINT) */}
      <section className="w-full section-even py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {activeTab === 'agri' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-[#123B92]/20 shadow-sm space-y-3">
                <div className="text-3xl">🥥</div>
                <h3 className="text-lg font-bold text-[#123B92]">{t('cropCopra')}</h3>
                <p className="text-xs text-black leading-relaxed">Moisture drop from 52% to &lt;6% in 2.5 days. Produces Grade-1 White Copra for oil extraction.</p>
                <button onClick={() => onOpenQuoteModal({ cropType: 'Copra/Coconut' })} className="text-xs font-bold text-[#002DC2] hover:underline flex items-center pt-2 cursor-pointer">
                  {t('enquireSetup')} <ArrowRight className="w-3 h-3 ml-1" />
                </button>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#123B92]/20 shadow-sm space-y-3">
                <div className="text-3xl">🌿</div>
                <h3 className="text-lg font-bold text-[#123B92]">{t('cropMoringa')}</h3>
                <p className="text-xs text-black leading-relaxed">100% dust-free green retention. Preserves chlorophyll for export powders.</p>
                <button onClick={() => onOpenQuoteModal({ cropType: 'Moringa/Herbs' })} className="text-xs font-bold text-[#002DC2] hover:underline flex items-center pt-2 cursor-pointer">
                  {t('enquireSetup')} <ArrowRight className="w-3 h-3 ml-1" />
                </button>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#123B92]/20 shadow-sm space-y-3">
                <div className="text-3xl">🌶️</div>
                <h3 className="text-lg font-bold text-[#123B92]">{t('cropSpices')}</h3>
                <p className="text-xs text-black leading-relaxed">Zero rain damage or aflatoxin mold. Locks bright glossy red skin color.</p>
                <button onClick={() => onOpenQuoteModal({ cropType: 'Spices/Chillies' })} className="text-xs font-bold text-[#002DC2] hover:underline flex items-center pt-2 cursor-pointer">
                  {t('enquireSetup')} <ArrowRight className="w-3 h-3 ml-1" />
                </button>
              </div>
            </div>
          )}

          {activeTab === 'marine' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-[#123B92]/20 shadow-sm space-y-3">
                <div className="text-3xl">🐟</div>
                <h3 className="text-lg font-bold text-[#123B92]">{t('cropFish')}</h3>
                <p className="text-xs text-black leading-relaxed">Completely closed polyhouse enclosure ensuring 100% fly-free, insect-free sanitation.</p>
                <button onClick={() => onOpenQuoteModal({ cropType: 'Fish/Seafood' })} className="text-xs font-bold text-[#002DC2] hover:underline flex items-center pt-2 cursor-pointer">
                  {t('enquireSetup')} <ArrowRight className="w-3 h-3 ml-1" />
                </button>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#123B92]/20 shadow-sm space-y-3">
                <div className="text-3xl">🦐</div>
                <h3 className="text-lg font-bold text-[#123B92]">{t('cropFish')}</h3>
                <p className="text-xs text-black leading-relaxed">Hygienic moisture reduction to under 12% for seafood processing plants.</p>
                <button onClick={() => onOpenQuoteModal({ cropType: 'Fish/Seafood' })} className="text-xs font-bold text-[#002DC2] hover:underline flex items-center pt-2 cursor-pointer">
                  {t('enquireSetup')} <ArrowRight className="w-3 h-3 ml-1" />
                </button>
              </div>
            </div>
          )}

          {activeTab === 'industrial' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-[#123B92]/20 shadow-sm space-y-3">
                <div className="text-3xl">🏭</div>
                <h3 className="text-lg font-bold text-[#123B92]">{t('cropOther')}</h3>
                <p className="text-xs text-black leading-relaxed">Reduces industrial sludge volume by up to 80%, slashing waste transport costs.</p>
                <button onClick={() => onOpenQuoteModal({ clientType: 'Industrial/Sludge Processor' })} className="text-xs font-bold text-[#002DC2] hover:underline flex items-center pt-2 cursor-pointer">
                  {t('enquireSetup')} <ArrowRight className="w-3 h-3 ml-1" />
                </button>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#123B92]/20 shadow-sm space-y-3">
                <div className="text-3xl">🪵</div>
                <h3 className="text-lg font-bold text-[#123B92]">{t('cropOther')}</h3>
                <p className="text-xs text-black leading-relaxed">Controlled humidity extraction preventing wood warping and curing natural rubber sheets.</p>
                <button onClick={() => onOpenQuoteModal({ clientType: 'Industrial/Sludge Processor' })} className="text-xs font-bold text-[#002DC2] hover:underline flex items-center pt-2 cursor-pointer">
                  {t('enquireSetup')} <ArrowRight className="w-3 h-3 ml-1" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 3: PARAMETER MATRIX TABLE (ODD: WHITE) */}
      <section className="w-full section-odd py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-extrabold text-[#123B92]">{t('matrixCropTitle')}</h2>
              <p className="text-xs text-black/60">{t('matrixCropSubtitle')}</p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-black/40 absolute left-3 top-3" />
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#F0F4FD] border border-[#123B92]/30 rounded-xl pl-9 pr-3 py-2 text-xs text-black placeholder-black/40 focus:outline-none focus:border-[#002DC2]"
              />
            </div>
          </div>

          <div className="bg-white rounded-3xl overflow-x-auto border border-[#123B92]/20 shadow-md">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#123B92] text-white text-xs uppercase font-bold tracking-wider">
                  <th className="p-4">{t('thTargetProduce')}</th>
                  <th className="p-4">{t('thFreshMoisture')}</th>
                  <th className="p-4 text-[#23AC39]">{t('thDriedMoisture')}</th>
                  <th className="p-4">{t('thSolarTime')}</th>
                  <th className="p-4">{t('thSunTime')}</th>
                  <th className="p-4">{t('thProfitBenefit')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#123B92]/10 text-xs text-black font-medium">
                {filteredMatrix.map((item, idx) => (
                  <tr key={idx} className="hover:bg-[#F0F4FD] transition-colors">
                    <td className="p-4 font-bold text-[#123B92]">{item.crop}</td>
                    <td className="p-4 text-black font-mono">{item.freshMoisture}</td>
                    <td className="p-4 text-[#002DC2] font-mono font-bold">{item.targetMoisture}</td>
                    <td className="p-4 font-bold text-[#002DC2]">{item.solarDays}</td>
                    <td className="p-4 text-black/60">{item.openSunDays}</td>
                    <td className="p-4 text-black">{item.benefit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SECTION 4: PERSONA SOLUTIONS (EVEN: SOFT LIGHT TINT) */}
      <section className="w-full section-even py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#123B92]">{t('tailoredSolutions')}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white p-6 rounded-2xl border border-[#123B92]/20 shadow-sm space-y-3">
              <Users className="w-8 h-8 text-[#002DC2]" />
              <h3 className="text-lg font-bold text-[#123B92]">{t('personaFpoTitle')}</h3>
              <p className="text-xs text-black leading-relaxed">{t('personaFpoDesc')}</p>
              <button onClick={() => onOpenQuoteModal({ clientType: 'FPO / Cooperative Group' })} className="text-xs font-bold text-[#002DC2] hover:underline cursor-pointer">
                {t('personaFpoBtn')}
              </button>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#123B92]/20 shadow-sm space-y-3">
              <Building className="w-8 h-8 text-[#123B92]" />
              <h3 className="text-lg font-bold text-[#123B92]">{t('personaExpTitle')}</h3>
              <p className="text-xs text-black leading-relaxed">{t('personaExpDesc')}</p>
              <button onClick={() => onOpenQuoteModal({ clientType: 'Food Processor & Exporter' })} className="text-xs font-bold text-[#002DC2] hover:underline cursor-pointer">
                {t('personaExpBtn')}
              </button>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#123B92]/20 shadow-sm space-y-3">
              <Sprout className="w-8 h-8 text-[#002DC2]" />
              <h3 className="text-lg font-bold text-[#123B92]">{t('personaFarmerTitle')}</h3>
              <p className="text-xs text-black leading-relaxed">{t('personaFarmerDesc')}</p>
              <button onClick={() => onOpenQuoteModal({ clientType: 'Individual Farmer' })} className="text-xs font-bold text-[#002DC2] hover:underline cursor-pointer">
                {t('personaFarmerBtn')}
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
