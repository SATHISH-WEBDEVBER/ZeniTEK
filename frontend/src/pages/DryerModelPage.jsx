import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, ShieldCheck, ArrowRight, Sun, Zap, Layers, Wind, Grid } from 'lucide-react';
import { officialDryerModels } from '../data/zenitekBrochureData';
import PageBackBar from '../components/PageBackBar';
import { buildQuoteUrl } from './QuotePage';

// Home-page showcase ids that differ from the brochure model ids
const MODEL_ALIASES = {
  'soldry-1210': 'soldry-1210-150',
  'soldry-1709': 'soldry-1709-200',
  'soldry-300': 'soldry-1210-300'
};

export const findDryerModel = (id) => {
  if (!id) return null;
  const key = MODEL_ALIASES[id] || id;
  return officialDryerModels.find(m => m.id === key)
    || officialDryerModels.find(m => m.id.startsWith(key))
    || null;
};

// Detail page for one dryer model: /solar-dryer-models/:modelId
export default function DryerModelPage() {
  const { modelId } = useParams();
  const model = findDryerModel(modelId);
  const [selectedImg, setSelectedImg] = useState(0);

  if (!model) {
    return (
      <section className="w-full py-20">
        <div className="max-w-xl mx-auto px-4 text-center space-y-5">
          <h1 className="text-3xl font-black text-[#123B92]">Model not found</h1>
          <p className="text-slate-600">We couldn't find that dryer model. It may have been renamed.</p>
          <Link to="/solar-dryer-models" className="inline-flex items-center gap-2 px-6 py-3 bg-[#23AC39] text-white font-black text-sm uppercase tracking-wider rounded-xl">
            View All Models <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    );
  }

  const images = model.gallery && model.gallery.length > 0 ? model.gallery : [model.imageUrl];
  const quoteUrl = buildQuoteUrl({ capacityNeeded: model.name });

  const specs = [
    { icon: Grid, label: 'Floor & Tray Area', main: `Floor: ${model.floorArea || 'Custom'}`, sub: `Tray Area: ${model.totalTrayArea || model.trays || 'Food-grade Trays'}` },
    { icon: Layers, label: 'Trays & Trolleys', main: model.trayCount || 'SS304 Trays', sub: model.trayTrolleys ? `Trolleys: ${model.trayTrolleys}` : null },
    { icon: Sun, label: 'Solar Power & Battery', main: model.solarPower || 'Solar DC System' },
    { icon: Wind, label: 'Airflow & Fans', main: `Exhaust: ${model.exhaustFans || 'Automated'}`, sub: `Circulation: ${model.circulationFans || 'Convection'}` },
    { icon: Zap, label: 'Heater & Grid Backup', main: model.electricalHeater || 'Thermostat Heater', sub: `Grid: ${model.gridBackup || '24V DC SMPS'}` },
    { icon: Layers, label: 'Dimensions & Structure', main: model.dimensions || 'Modular Standard', sub: model.structure || model.buildMaterial || 'GI Steel & UV Polycarbonate' }
  ];

  return (
    <div className="bg-white">
      <section className="w-full py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <PageBackBar crumbs={[{ label: 'Solar Dryer Models', to: '/solar-dryer-models' }, { label: model.name }]} fallback="/solar-dryer-models" />

          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-black text-[#002DC2] uppercase tracking-wider bg-[#F0F4FD] border border-[#002DC2]/20 px-3.5 py-1.5 rounded-full inline-block">
              {model.badge}
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-[#123B92] tracking-tight">{model.name}</h1>
            {model.capacityRange && (
              <p className="text-base sm:text-lg font-bold text-[#002DC2]">{model.capacityRange}</p>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="space-y-3">
              <div className="rounded-2xl overflow-hidden border border-[#123B92]/20 shadow-md bg-[#F0F4FD] aspect-[4/3]">
                <img src={images[selectedImg] || model.imageUrl} alt={model.name} className="w-full h-full object-contain bg-white" />
              </div>
              {images.length > 1 && (
                <div className="flex flex-wrap gap-2">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImg(idx)}
                      aria-label={`Show image ${idx + 1}`}
                      className={`w-20 h-16 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${selectedImg === idx ? 'border-[#002DC2] ring-2 ring-[#23AC39]' : 'border-[#123B92]/20 opacity-70 hover:opacity-100'}`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-5">
              <p className="text-base text-slate-700 leading-relaxed">{model.description}</p>

              <div className="p-4 bg-[#F0F4FD] rounded-2xl border border-[#123B92]/20 space-y-2 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-bold text-black/60 uppercase">Target Audience</span>
                  <span className="font-extrabold text-[#123B92] text-right">{model.targetAudience}</span>
                </div>
                <div className="flex items-center justify-between gap-3 border-t border-[#123B92]/10 pt-2">
                  <span className="text-xs font-bold text-black/60 uppercase">Subsidy Eligibility</span>
                  <span className="font-extrabold text-[#002DC2] text-right">{model.subsidyEligibility}</span>
                </div>
                {model.paybackPeriod && (
                  <div className="flex items-center justify-between gap-3 border-t border-[#123B92]/10 pt-2">
                    <span className="text-xs font-bold text-black/60 uppercase">Est. Payback Period</span>
                    <span className="font-extrabold text-[#123B92] text-right">{model.paybackPeriod}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 text-sm font-bold text-black bg-[#F0F4FD] p-3 rounded-xl border border-[#123B92]/20">
                <ShieldCheck className="w-4 h-4 text-[#002DC2] shrink-0" />
                <span>MNRE Approved & 100% Weather Protection Guaranteed</span>
              </div>

              <Link
                to={quoteUrl}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#23AC39] hover:bg-[#002DC2] text-white font-extrabold text-sm uppercase tracking-wider rounded-xl shadow-md transition-all text-center"
              >
                <span>Request Price Quote for {model.name}</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black text-[#123B92] tracking-tight">Technical Specifications</h2>
            <p className="text-base sm:text-lg text-slate-600">From the official ZeniTEK product brochure.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {specs.map(({ icon: Icon, label, main, sub }) => (
              <div key={label} className="p-5 bg-white rounded-2xl border border-[#123B92]/20 shadow-sm">
                <div className="text-xs text-black/60 font-bold uppercase flex items-center">
                  <Icon className="w-4 h-4 text-[#002DC2] mr-1.5" /> {label}
                </div>
                <div className="font-black text-[#123B92] mt-2 text-base">{main}</div>
                {sub && <div className="text-sm text-slate-600 mt-0.5">{sub}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {(model.keyFeatures || model.features || model.compatibleCrops) && (
        <section className="w-full py-10 sm:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <h2 className="text-3xl sm:text-4xl font-black text-[#123B92] tracking-tight">Key Advantages & Applications</h2>
            </div>
            {(model.keyFeatures || model.features) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-4xl mx-auto text-base">
                {(model.keyFeatures || model.features).map((feat, idx) => (
                  <div key={idx} className="flex items-start text-slate-800 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-[#002DC2] mr-2 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            )}
            {model.compatibleCrops && (
              <div className="flex flex-wrap justify-center gap-2">
                {model.compatibleCrops.map((crop, idx) => (
                  <span key={idx} className="px-3 py-1.5 bg-white text-[#002DC2] border border-[#123B92]/30 font-bold text-sm rounded-full">
                    ✓ {crop}
                  </span>
                ))}
              </div>
            )}
            <div className="text-center">
              <Link
                to={quoteUrl}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#23AC39] hover:bg-[#002DC2] text-white font-extrabold text-sm uppercase tracking-wider rounded-xl shadow-md transition-all"
              >
                Get a Quote for This Model <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
