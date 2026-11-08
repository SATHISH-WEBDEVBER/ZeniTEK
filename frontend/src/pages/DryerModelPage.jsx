import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, ShieldCheck, ArrowRight, Sun, Zap, Layers, Wind, Grid, Check, Ruler, MessageSquareQuote, LayoutGrid } from 'lucide-react';
import { officialDryerModels } from '../data/zenitekBrochureData';
import { usePageTitle } from '../components/SiteHeader';
import PageHero from '../components/PageHero';
import NotFoundPage from './NotFoundPage';
import { buildQuoteUrl } from './QuotePage';
import { useLanguage } from '../context/LanguageContext';
import { ProductGrid } from '../components/ProductCards';
import { findNodeByModelId, productImage, isPlaceholder, nodeTitle } from '../data/productCatalog';

// "2.5 kg to 12.5 kg per batch (…)" -> "2.5–12.5 kg" for the hero fact
const shortCapacity = (text = '') => {
  const m = /([\d.,]+\+?)\s*kg\s*to\s*([\d.,]+\+?)\s*kg/i.exec(text);
  return m ? `${m[1]}–${m[2]} kg` : (text || '—');
};

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
  const { t } = useLanguage();
  // The model's place in the product catalogue: its display name ("D1210 – 150 Tunnel Solar Dryer"),
  // its product image and its family (box dryers / tunnel dryers)
  const entry = model ? findNodeByModelId(model.id) : null;
  const name = entry ? nodeTitle(entry.node, t) : model?.name;
  usePageTitle(name);
  const [selectedImg, setSelectedImg] = useState(0);

  if (!model) {
    return <NotFoundPage title={t('sections_modelNotFound')} description={t('sections_modelNotFoundDesc')} />;
  }

  const productPhoto = entry ? productImage(entry.node) : (model.realProductPhoto || model.imageUrl);
  const images = [productPhoto];
  const quoteUrl = buildQuoteUrl({ capacityNeeded: name });
  // other models in the same family (tunnel models list each other; box dryers list each other)
  const family = entry?.parent;
  const siblings = family ? family.children.filter(c => c.id !== entry.node.id) : [];

  const specs = [
    { icon: Grid, label: t('sections_specFloorTray'), main: t('sections_floor', { value: model.floorArea || t('sections_defCustom') }), sub: t('sections_trayArea', { value: model.totalTrayArea || model.trays || t('sections_defFoodTrays') }) },
    { icon: Layers, label: t('sections_specTrays'), main: model.trayCount || t('sections_defSsTrays'), sub: model.trayTrolleys ? t('sections_trolleys', { value: model.trayTrolleys }) : null },
    { icon: Sun, label: t('sections_specSolar'), main: model.solarPower || t('sections_defSolarDc') },
    { icon: Wind, label: t('sections_specAirflow'), main: t('sections_exhaust', { value: model.exhaustFans || t('sections_defAutomated') }), sub: t('sections_circulation', { value: model.circulationFans || t('sections_defConvection') }) },
    { icon: Zap, label: t('sections_specHeater'), main: model.electricalHeater || t('sections_defHeater'), sub: t('sections_grid', { value: model.gridBackup || '24V DC SMPS' }) },
    { icon: Ruler, label: t('sections_specDimensions'), main: model.dimensions || t('sections_defModular'), sub: model.structure || model.buildMaterial || t('sections_defStructure') }
  ];

  return (
    <div className="bg-white">
      <PageHero
        images={productPhoto}
        title={name}
        subtitle={model.tagline}
        actions={[
          { label: t('sections_quoteThisModel'), to: quoteUrl, icon: MessageSquareQuote },
          { label: family ? nodeTitle(family, t) : t('sections_viewAllModels'), to: family ? family.path : '/solar-dryer-models', icon: LayoutGrid },
        ]}
        stats={[
          { value: shortCapacity(model.capacityRange), label: t('hero_perBatch') },
          { value: model.floorArea || '—', label: t('hero_floorArea') },
          { value: model.paybackPeriod || '—', label: t('sections_payback') },
        ]}
      />

      <section className="w-full py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="space-y-3">
              <div className="rounded-2xl overflow-hidden border border-[#123B92]/20 shadow-md bg-[#F0F4FD] aspect-[4/3]">
                <img src={images[selectedImg] || productPhoto} alt={isPlaceholder(images[selectedImg]) ? '' : name} className="w-full h-full object-cover" />
              </div>
              {images.length > 1 && (
                <div className="flex flex-wrap gap-2">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImg(idx)}
                      aria-label={t('sections_showImage', { n: idx + 1 })}
                      className={`w-20 h-16 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${selectedImg === idx ? 'border-[#002DC2] ring-2 ring-[#23AC39]' : 'border-[#123B92]/20 opacity-70 hover:opacity-100'}`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-5">
              {model.capacityRange && (
                <p className="text-base sm:text-lg font-bold text-[#002DC2]">{model.capacityRange}</p>
              )}
              <p className="text-base text-slate-700 leading-relaxed">{model.description}</p>

              <div className="p-4 bg-[#F0F4FD] rounded-2xl border border-[#123B92]/20 space-y-2 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-bold text-black/60 uppercase">{t('targetAudienceLabel')}</span>
                  <span className="font-extrabold text-[#123B92] text-right">{model.targetAudience}</span>
                </div>
                <div className="flex items-center justify-between gap-3 border-t border-[#123B92]/10 pt-2">
                  <span className="text-xs font-bold text-black/60 uppercase">{t('subsidyEligibilityLabel')}</span>
                  <span className="font-extrabold text-[#002DC2] text-right">{model.subsidyEligibility}</span>
                </div>
                {model.paybackPeriod && (
                  <div className="flex items-center justify-between gap-3 border-t border-[#123B92]/10 pt-2">
                    <span className="text-xs font-bold text-black/60 uppercase">{t('sections_payback')}</span>
                    <span className="font-extrabold text-[#123B92] text-right">{model.paybackPeriod}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 text-sm font-bold text-[#123B92] bg-[#F0F4FD] p-3 rounded-xl border border-[#123B92]/20">
                <ShieldCheck className="w-5 h-5 text-[#002DC2] shrink-0" />
                <span>{t('sections_modelGuarantee')}</span>
              </div>

              <Link
                to={quoteUrl}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#23AC39] hover:bg-[#002DC2] text-white font-extrabold text-sm uppercase tracking-wider rounded-xl shadow-md transition-all text-center"
              >
                <span>{t('sections_quoteForModel', { name })}</span>
                <ArrowRight className="w-5 h-5 shrink-0" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black text-[#123B92] tracking-tight">{t('sections_techSpecs')}</h2>
            <p className="text-base sm:text-lg text-slate-600">{t('sections_techSpecsSub')}</p>
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
              <h2 className="text-3xl sm:text-4xl font-black text-[#123B92] tracking-tight">{t('sections_advantages')}</h2>
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
                  <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-[#002DC2] border border-[#123B92]/30 font-bold text-sm rounded-full">
                    <Check className="w-4 h-4" /> {crop}
                  </span>
                ))}
              </div>
            )}
            <div className="text-center">
              <Link
                to={quoteUrl}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#23AC39] hover:bg-[#002DC2] text-white font-extrabold text-sm uppercase tracking-wider rounded-xl shadow-md transition-all"
              >
                {t('sections_quoteThisModel')} <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {siblings.length > 0 && (
        <section className="w-full py-10 sm:py-14 bg-slate-50 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-black text-[#123B92] tracking-tight">{t('cat_moreIn', { name: nodeTitle(family, t) })}</h2>
            </div>
            <ProductGrid nodes={siblings} />
          </div>
        </section>
      )}
    </div>
  );
}
