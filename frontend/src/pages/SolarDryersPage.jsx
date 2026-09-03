import React, { useState } from 'react';
import { dryerModelsData, cropMatrixData } from '../data/sampleData';
import { CheckCircle2, ArrowRight, ShieldCheck, Filter, Download, Zap, Sun } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function SolarDryersPage({ onOpenQuoteModal }) {
  const [filterMode, setFilterMode] = useState('capacity');
  const { t } = useLanguage();

  return (
    <div className="space-y-16 pb-16 pt-6 bg-slate-50 text-slate-900">
      
      {/* Hero Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="text-xs font-bold text-green-700 uppercase tracking-widest bg-green-50 border border-green-200 px-3 py-1 rounded-full">
          SOLAR DRYER CATALOGUE
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-blue-950">
          100% Solar-Powered Dehydration. <br />
          <span className="text-green-700">
            5x Faster. Zero Operating Costs.
          </span>
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto">
          Explore our range of UV-stabilized polycarbonate polyhouse solar thermal dryers engineered for maximum thermal heat retention.
        </p>

        <div className="flex items-center justify-center space-x-3 pt-4">
          <button
            onClick={() => setFilterMode('capacity')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center ${filterMode === 'capacity' ? 'bg-blue-700 text-white shadow' : 'bg-white text-slate-700 hover:text-blue-700 border border-slate-300'}`}
          >
            <Filter className="w-3.5 h-3.5 mr-1.5" /> Browse by Daily Capacity
          </button>
          <button
            onClick={() => setFilterMode('crop')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center ${filterMode === 'crop' ? 'bg-blue-700 text-white shadow' : 'bg-white text-slate-700 hover:text-blue-700 border border-slate-300'}`}
          >
            <Filter className="w-3.5 h-3.5 mr-1.5" /> Browse by Crop Type
          </button>
        </div>
      </section>

      {/* Product Specifications Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {dryerModelsData.map((model, index) => (
          <div
            key={model.id}
            className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
          >
            <div className={`lg:col-span-5 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 h-72">
                <img src={model.imageUrl} alt={model.name} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 bg-blue-700 text-white font-bold text-[10px] uppercase px-3 py-1 rounded-md shadow">
                  {model.badge}
                </span>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900">{model.name}</h2>
                <span className="text-xs font-bold text-green-800 bg-green-50 border border-green-200 px-3 py-1 rounded-lg">
                  {model.capacityRange}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{model.description}</p>

              <div className="grid grid-cols-2 gap-3 text-xs pt-2">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Target Audience</div>
                  <div className="font-bold text-slate-900 mt-0.5">{model.targetAudience}</div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Build Material</div>
                  <div className="font-bold text-slate-900 mt-0.5">{model.buildMaterial}</div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Temp Range</div>
                  <div className="font-bold text-blue-700 mt-0.5">{model.tempRange}</div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Subsidy Eligibility</div>
                  <div className="font-bold text-green-700 mt-0.5">{model.subsidyEligibility}</div>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-4 items-center">
                <button
                  onClick={() => onOpenQuoteModal({ capacityNeeded: model.name })}
                  className="py-3 px-6 bg-gradient-to-r from-blue-700 to-green-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow hover:scale-105 transition-all flex items-center space-x-1.5"
                >
                  <span>Check Subsidy & Pricing</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Comparison Matrix Table */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950">Model Technical Comparison Matrix</h2>
          <p className="text-xs text-slate-500">Side-by-side specifications of ZeniTEK solar thermal dryer models.</p>
        </div>

        <div className="bg-white rounded-3xl overflow-x-auto border border-slate-200 shadow-md">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-900 text-white text-xs uppercase font-bold tracking-wider">
                <th className="p-4">Specification Parameter</th>
                <th className="p-4">Portable DIY Dryer</th>
                <th className="p-4 text-green-300">Commercial Polyhouse</th>
                <th className="p-4">Multi-Tunnel Industrial</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs text-slate-700 font-medium">
              <tr>
                <td className="p-4 font-bold text-slate-900">Daily Batch Capacity</td>
                <td className="p-4">10 – 50 kg</td>
                <td className="p-4 font-bold text-blue-700">100 – 500 kg</td>
                <td className="p-4 font-bold text-green-700">1 Ton to 10 Tons+</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-slate-900">Drying Temperature Range</td>
                <td className="p-4">40°C – 65°C</td>
                <td className="p-4">45°C – 70°C</td>
                <td className="p-4">50°C – 85°C (Hybrid)</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-slate-900">Polycarbonate Sheet Thickness</td>
                <td className="p-4">4 mm Twin-Wall UV</td>
                <td className="p-4">6 mm Twin-Wall UV</td>
                <td className="p-4">8-10 mm Multi-Wall UV</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-slate-900">Heat Retention Rating</td>
                <td className="p-4">Standard Solar Fan</td>
                <td className="p-4">Thermal Storage Bed</td>
                <td className="p-4 font-bold text-green-700">24/7 Thermal Mass Bed</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-slate-900">Government Subsidy %</td>
                <td className="p-4">Up to 40%</td>
                <td className="p-4 font-bold text-green-700">Up to 50% State Agri</td>
                <td className="p-4 font-bold text-blue-700">Up to 60% MNRE Grants</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Subsidy Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-green-800 text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[10px] font-bold text-green-300 bg-blue-950 px-2.5 py-0.5 rounded uppercase">
              STATE GOVERNMENT ASSISTANCE
            </span>
            <h3 className="text-xl sm:text-2xl font-bold">Claim Up to 60% Government Subsidy on Your Solar Dryer</h3>
            <p className="text-xs text-blue-100 max-w-xl">
              We handle end-to-end documentation, NABARD application filing, and state agritech subsidy clearance.
            </p>
          </div>

          <button
            onClick={() => onOpenQuoteModal()}
            className="py-3.5 px-6 bg-green-600 hover:bg-green-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow transition-all shrink-0"
          >
            Check Subsidy Eligibility
          </button>
        </div>
      </section>

    </div>
  );
}
