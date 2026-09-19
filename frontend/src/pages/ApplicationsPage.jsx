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
    <div className="space-y-16 pb-16 pt-6 bg-slate-50 text-slate-900">
      
      {/* Hero Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
          {t('appMatrixBadge')}
        </span>
        <h1 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-black text-blue-950">
          {t('appMatrixTitle1')} <br />
          <span className="text-green-700">
            {t('appMatrixTitle2')}
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto font-medium">
          {t('appMatrixSubtitle')}
        </p>

        {/* Segment Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <button
            onClick={() => setActiveTab('agri')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'agri' ? 'bg-blue-700 text-white shadow' : 'bg-white text-slate-700 hover:text-blue-700 border border-slate-300'}`}
          >
            {t('tabAgri')}
          </button>
          <button
            onClick={() => setActiveTab('marine')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'marine' ? 'bg-blue-700 text-white shadow' : 'bg-white text-slate-700 hover:text-blue-700 border border-slate-300'}`}
          >
            {t('tabMarine')}
          </button>
          <button
            onClick={() => setActiveTab('industrial')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'industrial' ? 'bg-blue-700 text-white shadow' : 'bg-white text-slate-700 hover:text-blue-700 border border-slate-300'}`}
          >
            {t('tabIndustrial')}
          </button>
        </div>
      </section>

      {/* Card Grid Active Views */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {activeTab === 'agri' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="text-3xl">🥥</div>
              <h3 className="text-lg font-bold text-slate-900">{t('cropCopra')}</h3>
              <p className="text-xs text-slate-600">Moisture drop from 52% to &lt;6% in 2.5 days. Produces Grade-1 White Copra for oil extraction.</p>
              <button onClick={() => onOpenQuoteModal({ cropType: 'Copra/Coconut' })} className="text-xs font-bold text-blue-700 hover:underline flex items-center pt-2">
                {t('enquireSetup')} <ArrowRight className="w-3 h-3 ml-1" />
              </button>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="text-3xl">🌿</div>
              <h3 className="text-lg font-bold text-slate-900">{t('cropMoringa')}</h3>
              <p className="text-xs text-slate-600">100% dust-free green retention. Preserves chlorophyll for export powders.</p>
              <button onClick={() => onOpenQuoteModal({ cropType: 'Moringa/Herbs' })} className="text-xs font-bold text-blue-700 hover:underline flex items-center pt-2">
                {t('enquireSetup')} <ArrowRight className="w-3 h-3 ml-1" />
              </button>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="text-3xl">🌶️</div>
              <h3 className="text-lg font-bold text-slate-900">{t('cropSpices')}</h3>
              <p className="text-xs text-slate-600">Zero rain damage or aflatoxin mold. Locks bright glossy red skin color.</p>
              <button onClick={() => onOpenQuoteModal({ cropType: 'Spices/Chillies' })} className="text-xs font-bold text-blue-700 hover:underline flex items-center pt-2">
                {t('enquireSetup')} <ArrowRight className="w-3 h-3 ml-1" />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'marine' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="text-3xl">🐟</div>
              <h3 className="text-lg font-bold text-slate-900">{t('cropFish')}</h3>
              <p className="text-xs text-slate-600">Completely closed polyhouse enclosure ensuring 100% fly-free, insect-free sanitation.</p>
              <button onClick={() => onOpenQuoteModal({ cropType: 'Fish/Seafood' })} className="text-xs font-bold text-blue-700 hover:underline flex items-center pt-2">
                {t('enquireSetup')} <ArrowRight className="w-3 h-3 ml-1" />
              </button>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="text-3xl">🦐</div>
              <h3 className="text-lg font-bold text-slate-900">{t('cropFish')}</h3>
              <p className="text-xs text-slate-600">Hygienic moisture reduction to under 12% for seafood processing plants.</p>
              <button onClick={() => onOpenQuoteModal({ cropType: 'Fish/Seafood' })} className="text-xs font-bold text-blue-700 hover:underline flex items-center pt-2">
                {t('enquireSetup')} <ArrowRight className="w-3 h-3 ml-1" />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'industrial' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="text-3xl">🏭</div>
              <h3 className="text-lg font-bold text-slate-900">{t('cropOther')}</h3>
              <p className="text-xs text-slate-600">Reduces industrial sludge volume by up to 80%, slashing waste transport costs.</p>
              <button onClick={() => onOpenQuoteModal({ clientType: 'Industrial/Sludge Processor' })} className="text-xs font-bold text-blue-700 hover:underline flex items-center pt-2">
                {t('enquireSetup')} <ArrowRight className="w-3 h-3 ml-1" />
              </button>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="text-3xl">🪵</div>
              <h3 className="text-lg font-bold text-slate-900">{t('cropOther')}</h3>
              <p className="text-xs text-slate-600">Controlled humidity extraction preventing wood warping and curing natural rubber sheets.</p>
              <button onClick={() => onOpenQuoteModal({ clientType: 'Industrial/Sludge Processor' })} className="text-xs font-bold text-blue-700 hover:underline flex items-center pt-2">
                {t('enquireSetup')} <ArrowRight className="w-3 h-3 ml-1" />
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Parameter Matrix Table */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-blue-950">{t('matrixCropTitle')}</h2>
            <p className="text-xs text-slate-500">{t('matrixCropSubtitle')}</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400"
            />
          </div>
        </div>

        <div className="bg-white rounded-3xl overflow-x-auto border border-slate-200 shadow-md">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-900 text-white text-xs uppercase font-bold tracking-wider">
                <th className="p-4">{t('thTargetProduce')}</th>
                <th className="p-4">{t('thFreshMoisture')}</th>
                <th className="p-4 text-green-300">{t('thDriedMoisture')}</th>
                <th className="p-4">{t('thSolarTime')}</th>
                <th className="p-4">{t('thSunTime')}</th>
                <th className="p-4">{t('thProfitBenefit')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs text-slate-700 font-medium">
              {filteredMatrix.map((item, idx) => (
                <tr key={idx} className="hover:bg-blue-50/50 transition-colors">
                  <td className="p-4 font-bold text-slate-900">{item.crop}</td>
                  <td className="p-4 text-rose-700 font-mono">{item.freshMoisture}</td>
                  <td className="p-4 text-green-700 font-mono font-bold">{item.targetMoisture}</td>
                  <td className="p-4 font-bold text-blue-700">{item.solarDays}</td>
                  <td className="p-4 text-slate-500">{item.openSunDays}</td>
                  <td className="p-4 text-slate-800">{item.benefit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Persona Solutions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950">{t('tailoredSolutions')}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <Users className="w-8 h-8 text-blue-700" />
            <h3 className="text-lg font-bold text-slate-900">{t('personaFpoTitle')}</h3>
            <p className="text-xs text-slate-600">{t('personaFpoDesc')}</p>
            <button onClick={() => onOpenQuoteModal({ clientType: 'FPO / Cooperative Group' })} className="text-xs font-bold text-blue-700">
              {t('personaFpoBtn')}
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <Building className="w-8 h-8 text-green-700" />
            <h3 className="text-lg font-bold text-slate-900">{t('personaExpTitle')}</h3>
            <p className="text-xs text-slate-600">{t('personaExpDesc')}</p>
            <button onClick={() => onOpenQuoteModal({ clientType: 'Food Processor & Exporter' })} className="text-xs font-bold text-green-700">
              {t('personaExpBtn')}
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <Sprout className="w-8 h-8 text-blue-700" />
            <h3 className="text-lg font-bold text-slate-900">{t('personaFarmerTitle')}</h3>
            <p className="text-xs text-slate-600">{t('personaFarmerDesc')}</p>
            <button onClick={() => onOpenQuoteModal({ clientType: 'Individual Farmer' })} className="text-xs font-bold text-blue-700">
              {t('personaFarmerBtn')}
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
