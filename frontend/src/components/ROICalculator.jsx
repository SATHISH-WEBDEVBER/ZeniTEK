import React, { useState } from 'react';
import { cropCalculations } from '../data/sampleData';
import { Calculator, TrendingUp, Clock, ShieldAlert, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function ROICalculator({ onSelectModelQuote }) {
  const [selectedCrop, setSelectedCrop] = useState('Copra/Coconut');
  const [harvestKg, setHarvestKg] = useState(300);
  const { t } = useLanguage();

  const cropData = cropCalculations[selectedCrop] || cropCalculations['Copra/Coconut'];

  const timeSavedDays = (cropData.sunDryingDays - cropData.solarDryingDays).toFixed(1);
  const totalSavingsPerBatch = Math.round(harvestKg * cropData.savingsPerKg);
  const totalAnnualValueGain = Math.round(totalSavingsPerBatch * 45);

  let recommendedModel = 'Commercial Polyhouse Tunnel Dryer (100-500 kg)';
  let modelKey = 'polyhouse';
  if (harvestKg <= 75) {
    recommendedModel = 'Portable DIY Solar Dryer (10-50 kg)';
    modelKey = 'portable';
  } else if (harvestKg > 600) {
    recommendedModel = 'Multi-Tunnel Industrial Hybrid Dryer (1 Ton+)';
    modelKey = 'industrial';
  }

  return (
    <div id="roi-calculator" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl relative overflow-hidden">
      
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl font-extrabold text-blue-950">{t('roiTitle')}</h3>
          <p className="text-xs text-slate-500">{t('roiSubtitle')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Inputs (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              {t('selectCrop')}
            </label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xl px-4 py-3 text-sm text-slate-900 font-semibold cursor-pointer"
            >
              <option value="Copra/Coconut">Copra / Coconut Kernel (Drying to 6% moisture)</option>
              <option value="Moringa/Herbs">Moringa Leaves & Culinary Herbs</option>
              <option value="Spices/Chillies">Red Chillies, Pepper & Turmeric</option>
              <option value="Fruits/Veggies">Banana, Mango & Vegetable Slices</option>
              <option value="Fish/Seafood">Salted Fish, Shrimp & Marine</option>
              <option value="Other">Seeds, Grains & Other Biomass</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                {t('batchQty')}
              </label>
              <span className="text-lg font-extrabold text-blue-800 bg-blue-50 border border-blue-200 px-3 py-1 rounded-lg">
                {harvestKg.toLocaleString()} kg / batch
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="5000"
              step="20"
              value={harvestKg}
              onChange={(e) => setHarvestKg(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-700"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>20 kg</span>
              <span>500 kg</span>
              <span>2,500 kg</span>
              <span>5,000 kg</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200">
              <div className="text-[11px] font-bold text-rose-700 uppercase tracking-wider mb-1 flex items-center">
                <ShieldAlert className="w-3.5 h-3.5 mr-1" /> {t('sunDrying')}
              </div>
              <div className="text-xl font-bold text-slate-800">{cropData.sunDryingDays} Days</div>
              <div className="text-[11px] text-rose-600 font-medium mt-1">High rain & mold risk</div>
            </div>

            <div className="p-4 rounded-2xl bg-green-50 border border-green-300">
              <div className="text-[11px] font-extrabold text-green-800 uppercase tracking-wider mb-1 flex items-center">
                <Sparkles className="w-3.5 h-3.5 text-green-700 mr-1" /> {t('solarDrying')}
              </div>
              <div className="text-xl font-extrabold text-green-900">{cropData.solarDryingDays} Days</div>
              <div className="text-[11px] text-green-700 font-bold mt-1">⚡ {timeSavedDays} {t('daysFaster')}</div>
            </div>
          </div>

        </div>

        {/* Right Output ROI Card (5 Cols) */}
        <div className="lg:col-span-5 bg-gradient-to-b from-blue-900 to-blue-800 text-white p-6 rounded-2xl border border-blue-700 shadow-lg flex flex-col justify-between space-y-6">
          
          <div>
            <span className="text-[10px] font-bold tracking-widest text-green-300 bg-blue-950 px-2.5 py-1 rounded-full border border-blue-700 uppercase">
              ESTIMATED RETURN ON INVESTMENT
            </span>
            
            <div className="mt-4 space-y-4">
              <div>
                <div className="text-xs text-blue-200">{t('priceIncrease')}</div>
                <div className="text-2xl font-black text-green-300">+{cropData.premiumPercent}% Price Premium</div>
              </div>

              <div className="pt-2 border-t border-blue-700">
                <div className="text-xs text-blue-200">{t('profitPerBatch')}</div>
                <div className="text-3xl font-black text-white">
                  ₹{totalSavingsPerBatch.toLocaleString('en-IN')}
                </div>
              </div>

              <div>
                <div className="text-[11px] text-blue-200">Est. Annual Value Addition (45 batches)</div>
                <div className="text-lg font-bold text-green-300">₹{totalAnnualValueGain.toLocaleString('en-IN')} / year</div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-blue-950/60 rounded-xl border border-blue-700">
            <div className="text-[10px] font-bold uppercase text-blue-200 tracking-wider">{t('recSetup')}</div>
            <div className="text-xs font-bold text-white mt-0.5 flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-400 mr-1 shrink-0" /> {recommendedModel}
            </div>
          </div>

          <button
            onClick={() => onSelectModelQuote(modelKey, harvestKg, selectedCrop)}
            className="w-full py-3 px-4 bg-green-600 hover:bg-green-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5"
          >
            <span>{t('getQuoteSetup')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </div>

      </div>
    </div>
  );
}
