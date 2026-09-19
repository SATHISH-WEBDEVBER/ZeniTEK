import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, ArrowRight, Sun, Zap, Award, Layers, Thermometer, Wind, Grid } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function DryerDetailModal({ isOpen, onClose, model, onOpenQuoteModal }) {
  const { t } = useLanguage();
  const [selectedImg, setSelectedImg] = useState(0);

  if (!isOpen || !model) return null;

  const images = model.gallery && model.gallery.length > 0 ? model.gallery : [model.imageUrl];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl sm:rounded-3xl border-2 border-[#123B92] shadow-2xl overflow-hidden max-h-[94vh] flex flex-col my-auto">
        
        {/* Modal Header */}
        <div className="px-4 py-3 sm:px-6 sm:py-4 border-b-2 border-[#23AC39] flex items-center justify-between bg-[#123B92] text-white shrink-0">
          <div className="flex items-center space-x-2">
            <span className="text-[9px] sm:text-[10px] font-extrabold text-[#23AC39] bg-black/40 border border-[#23AC39]/50 px-2 sm:px-2.5 py-0.5 rounded uppercase tracking-wider">
              {model.badge}
            </span>
            <h3 className="text-sm sm:text-base lg:text-xl font-black text-white line-clamp-1">{model.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors shrink-0 cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-3.5 sm:p-6 overflow-y-auto space-y-4 sm:space-y-6 flex-1 bg-white">
          
          {/* Main Visual & Key Highlights */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left: Product Images / Gallery Switcher */}
            <div className="lg:col-span-6 space-y-3">
              <div className="relative rounded-2xl overflow-hidden border border-[#123B92]/20 shadow-md h-64 bg-[#F0F4FD]">
                <img
                  src={images[selectedImg] || model.imageUrl}
                  alt={model.name}
                  className="w-full h-full object-cover transition-all duration-300"
                />
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex items-center space-x-2 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImg(idx)}
                      className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${selectedImg === idx ? 'border-[#002DC2] shadow-md scale-105 ring-2 ring-[#23AC39]' : 'border-[#123B92]/20 opacity-70 hover:opacity-100'}`}
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
                <div className="flex items-center space-x-2">
                  <span className="bg-[#002DC2] text-white font-bold text-[10px] px-2.5 py-0.5 rounded shadow-2xs">
                    {model.capacityRange}
                  </span>
                  <span className="text-[10px] font-bold text-black/60 uppercase tracking-widest">PRODUCT SPECIFICATION</span>
                </div>
                <h4 className="text-xl font-black text-[#123B92] mt-1">{model.name}</h4>
                <p className="text-xs text-black leading-relaxed mt-2 font-medium">{model.description}</p>
              </div>

              <div className="p-3 bg-[#F0F4FD] rounded-2xl border border-[#123B92]/20 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-black/60 uppercase">Target Audience:</span>
                  <span className="font-extrabold text-[#123B92]">{model.targetAudience}</span>
                </div>
                <div className="flex items-center justify-between border-t border-[#123B92]/10 pt-1.5">
                  <span className="text-[10px] font-bold text-black/60 uppercase">Subsidy Eligibility:</span>
                  <span className="font-extrabold text-[#002DC2]">{model.subsidyEligibility}</span>
                </div>
                {model.paybackPeriod && (
                  <div className="flex items-center justify-between border-t border-[#123B92]/10 pt-1.5">
                    <span className="text-[10px] font-bold text-black/60 uppercase">Est. Payback Period:</span>
                    <span className="font-extrabold text-[#123B92]">{model.paybackPeriod}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2 text-xs font-bold text-black bg-[#F0F4FD] p-2.5 rounded-xl border border-[#123B92]/20">
                <ShieldCheck className="w-4 h-4 text-[#002DC2] shrink-0" />
                <span>MNRE Approved & 100% Weather Protection Guaranteed</span>
              </div>
            </div>

          </div>

          {/* Detailed Technical Specifications Grid (Direct from PDF Brochure) */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-[#123B92] uppercase tracking-wider flex items-center">
              <Layers className="w-4 h-4 mr-1.5 text-[#002DC2]" /> Technical Specifications Breakdown
            </h5>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-[#123B92]/20 shadow-sm">
                <div className="text-[10px] text-black/60 font-bold uppercase flex items-center">
                  <Grid className="w-3.5 h-3.5 text-[#002DC2] mr-1" /> Floor & Tray Area
                </div>
                <div className="font-black text-[#123B92] mt-1 text-xs">Floor: {model.floorArea || 'Custom'}</div>
                <div className="text-[11px] text-[#002DC2] font-bold">Tray Area: {model.totalTrayArea || model.trays || 'Food-grade Trays'}</div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-[#123B92]/20 shadow-sm">
                <div className="text-[10px] text-black/60 font-bold uppercase flex items-center">
                  <Layers className="w-3.5 h-3.5 text-[#002DC2] mr-1" /> Trays & Trolleys
                </div>
                <div className="font-bold text-black mt-1 text-xs">{model.trayCount || 'SS304 Trays'}</div>
                {model.trayTrolleys && <div className="text-[10.5px] text-black/60 font-medium">Trolleys: {model.trayTrolleys}</div>}
              </div>

              <div className="p-3 bg-white rounded-xl border border-[#123B92]/20 shadow-sm">
                <div className="text-[10px] text-black/60 font-bold uppercase flex items-center">
                  <Sun className="w-3.5 h-3.5 text-[#002DC2] mr-1" /> Solar Power & Battery
                </div>
                <div className="font-bold text-black mt-1 text-xs">{model.solarPower || 'Solar DC System'}</div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-[#123B92]/20 shadow-sm">
                <div className="text-[10px] text-black/60 font-bold uppercase flex items-center">
                  <Wind className="w-3.5 h-3.5 text-[#002DC2] mr-1" /> Airflow & Fans
                </div>
                <div className="font-bold text-black mt-1 text-xs">Exhaust: {model.exhaustFans || 'Automated'}</div>
                <div className="text-[10.5px] text-black/60">Circulation: {model.circulationFans || 'Convection'}</div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-[#123B92]/20 shadow-sm">
                <div className="text-[10px] text-black/60 font-bold uppercase flex items-center">
                  <Zap className="w-3.5 h-3.5 text-[#002DC2] mr-1" /> Heater & Grid Backup
                </div>
                <div className="font-bold text-black mt-1 text-xs">{model.electricalHeater || 'Thermostat Heater'}</div>
                <div className="text-[10.5px] text-black/60">Grid: {model.gridBackup || '24V DC SMPS'}</div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-[#123B92]/20 shadow-sm">
                <div className="text-[10px] text-black/60 font-bold uppercase">Dimensions & Structure</div>
                <div className="font-bold text-black mt-1 text-xs">{model.dimensions || 'Modular Standard'}</div>
                <div className="text-[10px] text-black/60 leading-tight mt-0.5">{model.structure || model.buildMaterial || 'GI Steel & UV Polycarbonate'}</div>
              </div>
            </div>
          </div>

          {/* Key Features List */}
          <div className="space-y-2 bg-[#F0F4FD] p-4 rounded-2xl border border-[#123B92]/20">
            <h5 className="text-xs font-bold text-[#123B92] uppercase tracking-wider">Key Engineering Advantages (Official Brochure)</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {(model.keyFeatures || model.features || []).map((feat, idx) => (
                <div key={idx} className="flex items-start text-black font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#002DC2] mr-2 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Suitable Crops */}
          {model.compatibleCrops && (
            <div className="space-y-2">
              <h5 className="text-xs font-bold text-[#123B92] uppercase tracking-wider">Optimized Produce Applications</h5>
              <div className="flex flex-wrap gap-2">
                {model.compatibleCrops.map((crop, idx) => (
                  <span key={idx} className="px-3 py-1 bg-white text-[#002DC2] border border-[#123B92]/30 font-bold text-xs rounded-full">
                    ✓ {crop}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer CTAs */}
        <div className="px-6 py-4 border-t border-[#123B92]/20 flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#F0F4FD] shrink-0">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 bg-white hover:bg-[#F0F4FD] text-black border border-[#123B92]/30 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            {t('close')}
          </button>

          <button
            onClick={() => {
              onClose();
              if (onOpenQuoteModal) onOpenQuoteModal({ capacityNeeded: model.name });
            }}
            className="w-full sm:w-auto px-6 py-3 bg-[#23AC39] hover:bg-[#002DC2] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>Request Price Quote for {model.name}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
