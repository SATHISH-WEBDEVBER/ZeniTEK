import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, ArrowRight, Sun, Zap, Award, Layers, Thermometer, Wind, Grid } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function DryerDetailModal({ isOpen, onClose, model, onOpenQuoteModal }) {
  const { t } = useLanguage();
  const [selectedImg, setSelectedImg] = useState(0);

  if (!isOpen || !model) return null;

  const images = model.gallery && model.gallery.length > 0 ? model.gallery : [model.imageUrl];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/75 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-2xl overflow-hidden max-h-[94vh] flex flex-col my-auto">
        
        {/* Modal Header */}
        <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-950 via-blue-900 to-green-900 text-white shrink-0">
          <div className="flex items-center space-x-2">
            <span className="text-[9px] sm:text-[10px] font-extrabold text-green-300 bg-blue-950 border border-green-400/30 px-2 sm:px-2.5 py-0.5 rounded uppercase tracking-wider">
              {model.badge}
            </span>
            <h3 className="text-sm sm:text-base lg:text-xl font-black text-white line-clamp-1">{model.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors shrink-0"
            aria-label="Close"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-3.5 sm:p-6 overflow-y-auto space-y-4 sm:space-y-6 flex-1">
          
          {/* Main Visual & Key Highlights */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left: Product Images / Gallery Switcher */}
            <div className="lg:col-span-6 space-y-3">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md h-64 bg-slate-100">
                <img
                  src={images[selectedImg] || model.imageUrl}
                  alt={model.name}
                  className="w-full h-full object-cover transition-all duration-300"
                />
                <span className="absolute bottom-3 left-3 bg-blue-900/90 backdrop-blur-md text-white font-bold text-[11px] px-3 py-1 rounded-lg">
                  {model.capacityRange}
                </span>
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex items-center space-x-2 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImg(idx)}
                      className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${selectedImg === idx ? 'border-blue-600 shadow-md scale-105' : 'border-slate-200 opacity-70 hover:opacity-100'}`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Key Specs & Target Audience */}
            <div className="lg:col-span-6 space-y-4">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">PRODUCT DESCRIPTION</span>
                <h4 className="text-xl font-black text-slate-900 mt-0.5">{model.name}</h4>
                <p className="text-xs text-slate-600 leading-relaxed mt-2 font-medium">{model.description}</p>
              </div>

              <div className="p-3 bg-blue-50/80 rounded-2xl border border-blue-100 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Target Audience:</span>
                  <span className="font-extrabold text-blue-950">{model.targetAudience}</span>
                </div>
                <div className="flex items-center justify-between border-t border-blue-100 pt-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Subsidy Eligibility:</span>
                  <span className="font-extrabold text-green-700">{model.subsidyEligibility}</span>
                </div>
                {model.paybackPeriod && (
                  <div className="flex items-center justify-between border-t border-blue-100 pt-1.5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Est. Payback Period:</span>
                    <span className="font-extrabold text-blue-800">{model.paybackPeriod}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 bg-slate-100 p-2.5 rounded-xl border border-slate-200">
                <ShieldCheck className="w-4 h-4 text-green-600 shrink-0" />
                <span>MNRE Approved & 100% Weather Protection Guaranteed</span>
              </div>
            </div>

          </div>

          {/* Detailed Technical Specifications Grid (Direct from PDF Brochure) */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-blue-950 uppercase tracking-wider flex items-center">
              <Layers className="w-4 h-4 mr-1.5 text-blue-700" /> Technical Specifications Breakdown
            </h5>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="text-[10px] text-slate-500 font-bold uppercase flex items-center">
                  <Grid className="w-3.5 h-3.5 text-blue-600 mr-1" /> Floor & Tray Area
                </div>
                <div className="font-black text-slate-900 mt-1 text-xs">Floor: {model.floorArea || 'Custom'}</div>
                <div className="text-[11px] text-blue-700 font-bold">Tray Area: {model.totalTrayArea || model.trays || 'Food-grade Trays'}</div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="text-[10px] text-slate-500 font-bold uppercase flex items-center">
                  <Layers className="w-3.5 h-3.5 text-emerald-600 mr-1" /> Trays & Trolleys
                </div>
                <div className="font-bold text-slate-800 mt-1 text-xs">{model.trayCount || 'SS304 Trays'}</div>
                {model.trayTrolleys && <div className="text-[10.5px] text-slate-500 font-medium">Trolleys: {model.trayTrolleys}</div>}
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="text-[10px] text-slate-500 font-bold uppercase flex items-center">
                  <Sun className="w-3.5 h-3.5 text-amber-500 mr-1" /> Solar Power & Battery
                </div>
                <div className="font-bold text-slate-800 mt-1 text-xs">{model.solarPower || 'Solar DC System'}</div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="text-[10px] text-slate-500 font-bold uppercase flex items-center">
                  <Wind className="w-3.5 h-3.5 text-green-600 mr-1" /> Airflow & Fans
                </div>
                <div className="font-bold text-slate-800 mt-1 text-xs">Exhaust: {model.exhaustFans || 'Automated'}</div>
                <div className="text-[10.5px] text-slate-500">Circulation: {model.circulationFans || 'Convection'}</div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="text-[10px] text-slate-500 font-bold uppercase flex items-center">
                  <Zap className="w-3.5 h-3.5 text-purple-600 mr-1" /> Heater & Grid Backup
                </div>
                <div className="font-bold text-slate-800 mt-1 text-xs">{model.electricalHeater || 'Thermostat Heater'}</div>
                <div className="text-[10.5px] text-slate-500">Grid: {model.gridBackup || '24V DC SMPS'}</div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="text-[10px] text-slate-500 font-bold uppercase">Dimensions & Structure</div>
                <div className="font-bold text-slate-800 mt-1 text-xs">{model.dimensions || 'Modular Standard'}</div>
                <div className="text-[10px] text-slate-500 leading-tight mt-0.5">{model.structure || model.buildMaterial || 'GI Steel & UV Polycarbonate'}</div>
              </div>
            </div>
          </div>

          {/* Key Features List */}
          <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Key Engineering Advantages (Official Brochure)</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {(model.keyFeatures || model.features || []).map((feat, idx) => (
                <div key={idx} className="flex items-start text-slate-800 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mr-2 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Suitable Crops */}
          {model.compatibleCrops && (
            <div className="space-y-2">
              <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Optimized Produce Applications</h5>
              <div className="flex flex-wrap gap-2">
                {model.compatibleCrops.map((crop, idx) => (
                  <span key={idx} className="px-3 py-1 bg-green-50 text-green-800 border border-green-200 font-bold text-xs rounded-full">
                    ✓ {crop}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer CTAs */}
        <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 shrink-0">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition-colors"
          >
            {t('close')}
          </button>

          <button
            onClick={() => {
              onClose();
              if (onOpenQuoteModal) onOpenQuoteModal({ capacityNeeded: model.name });
            }}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-700 via-blue-600 to-green-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg hover:scale-105 transition-all flex items-center justify-center space-x-2"
          >
            <span>Request Price Quote for {model.name}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
