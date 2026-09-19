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
    <div id="roi-calculator" className="bg-white rounded-3xl p-6 sm:p-8 border border-[#123B92]/20 shadow-xl relative overflow-hidden">
      
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-[#F0F4FD] border border-[#123B92]/20 flex items-center justify-center text-[#002DC2]">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl font-extrabold text-[#123B92]">{t('roiTitle')}</h3>
          <p className="text-xs text-black/70">{t('roiSubtitle')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Inputs (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          <div>
            <label className="block text-xs font-bold text-[#123B92] uppercase tracking-wider mb-2">
              {t('selectCrop')}
            </label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full bg-white border border-[#123B92]/30 focus:border-[#002DC2] focus:ring-1 focus:ring-[#002DC2] rounded-xl px-4 py-3 text-sm text-black font-semibold cursor-pointer"
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
              <label className="text-xs font-bold text-[#123B92] uppercase tracking-wider">
                {t('batchQty')}
              </label>
              <span className="text-lg font-black text-[#123B92] bg-[#F0F4FD] border border-[#123B92]/30 px-3 py-1 rounded-lg">
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
              className="w-full h-2.5 bg-[#F0F4FD] rounded-lg appearance-none cursor-pointer accent-[#002DC2]"
            />
            <div className="flex justify-between text-[10px] text-black/60 font-mono mt-1">
              <span>20 kg</span>
              <span>500 kg</span>
              <span>2,500 kg</span>
              <span>5,000 kg</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-[#F0F4FD] border border-[#123B92]/20">
              <div className="text-[11px] font-bold text-[#123B92] uppercase tracking-wider mb-1 flex items-center">
                <ShieldAlert className="w-3.5 h-3.5 mr-1 text-[#123B92]" /> {t('sunDrying')}
              </div>
              <div className="text-xl font-black text-black">{cropData.sunDryingDays} Days</div>
              <div className="text-[11px] text-black/70 font-medium mt-1">High rain & mold risk</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F0F4FD] border-2 border-[#00FB00]">
              <div className="text-[11px] font-extrabold text-[#123B92] uppercase tracking-wider mb-1 flex items-center">
                <Sparkles className="w-3.5 h-3.5 text-[#002DC2] mr-1" /> {t('solarDrying')}
              </div>
              <div className="text-xl font-black text-[#002DC2]">{cropData.solarDryingDays} Days</div>
              <div className="text-[11px] text-black font-bold mt-1">⚡ {timeSavedDays} {t('daysFaster')}</div>
            </div>
          </div>

        </div>

        {/* Right Output ROI Card (5 Cols) */}
        <div className="lg:col-span-5 bg-[#123B92] text-white p-6 rounded-2xl border border-[#002DC2] shadow-lg flex flex-col justify-between space-y-6">
          
          <div>
            <span className="text-[10px] font-black tracking-widest text-black bg-[#00FB00] px-2.5 py-1 rounded-full uppercase">
              ESTIMATED RETURN ON INVESTMENT
            </span>
            
            <div className="mt-4 space-y-4">
              <div>
                <div className="text-xs text-white/80">{t('priceIncrease')}</div>
                <div className="text-2xl font-black text-[#00FB00]">+{cropData.premiumPercent}% Price Premium</div>
              </div>

              <div className="pt-2 border-t border-[#002DC2]/50">
                <div className="text-xs text-white/80">{t('profitPerBatch')}</div>
                <div className="text-3xl font-black text-white">
                  ₹{totalSavingsPerBatch.toLocaleString('en-IN')}
                </div>
              </div>

              <div>
                <div className="text-[11px] text-white/80">Est. Annual Value Addition (45 batches)</div>
                <div className="text-lg font-bold text-[#00FB00]">₹{totalAnnualValueGain.toLocaleString('en-IN')} / year</div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-black/40 rounded-xl border border-[#002DC2]">
            <div className="text-[10px] font-bold uppercase text-white/80 tracking-wider">{t('recSetup')}</div>
            <div className="text-xs font-bold text-white mt-0.5 flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00FB00] mr-1 shrink-0" /> {recommendedModel}
            </div>
          </div>

          <button
            onClick={() => onSelectModelQuote(modelKey, harvestKg, selectedCrop)}
            className="w-full py-3 px-4 bg-[#00FB00] hover:bg-[#002DC2] text-black hover:text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <span>{t('getQuoteSetup')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div></div>

      </div>
    </div>
  );
}
