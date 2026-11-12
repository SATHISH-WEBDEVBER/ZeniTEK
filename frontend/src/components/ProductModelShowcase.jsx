import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, MessageSquareQuote } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import pageTranslations from '../i18n';
import {
  DRYER_GROUPS, dryerModels, nodeTitle, showcasePhotos, dryerRecord, shortCapacity
} from '../data/productCatalog';
import useAutoplay from '../motion/useAutoplay';

// Home: "Choose the perfect solar thermal dryer for your need" - every dryer model in the catalogue
// (the box dryers by size, then the tunnel dryers), one large card at a time, laid out like the page
// hero: the model's photo behind, its type, name and summary, three facts and two buttons. The previous
// and next models peek in at the sides. Moves on every 6 s while on screen (paused on hover / focus).
const MODELS = DRYER_GROUPS.flatMap(group => dryerModels(group.id).map(node => ({
  node,
  group,
  photo: showcasePhotos(node)[0],
  spec: dryerRecord(node),
})));
const INTERVAL = 6000;
const en = (key) => pageTranslations.en[key] ?? key;

export default function ProductModelShowcase({ onOpenQuoteModal, onOpenDetailModal }) {
  const { t } = useLanguage();
  const total = MODELS.length;
  const [active, setActive] = useState(0);
  const go = (i) => setActive((i + total) % total);
  const { ref, running, pauseProps } = useAutoplay(active, () => setActive(i => (i + 1) % total), { interval: INTERVAL });

  const prevIndex = (active - 1 + total) % total;
  const nextIndex = (active + 1) % total;
  const current = MODELS[active];
  const name = nodeTitle(current.node, t);
  const GroupIcon = current.node.icon;
  const facts = [
    { value: shortCapacity(current.spec?.capacityRange), label: t('hero_perBatch') },
    { value: current.spec?.floorArea || '—', label: t('hero_floorArea') },
    { value: current.spec?.paybackPeriod || '—', label: t('sections_payback') },
  ];

  // The cards beside the active one (tablet and up): photo, type and short name; a click brings it forward
  const peek = (index, side) => {
    const m = MODELS[index];
    const Arrow = side === 'prev' ? ChevronLeft : ChevronRight;
    return (
      <div
        onClick={() => go(index)}
        className="hidden md:block relative w-[13%] lg:w-[15%] xl:w-[16%] h-[400px] lg:h-[500px] rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer group shrink-0 opacity-90 hover:opacity-100 shadow-xl transition-[opacity,transform] duration-500 hover:scale-[1.02] bg-slate-800"
      >
        <img
          src={m.photo.src}
          alt=""
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          style={{ objectPosition: m.photo.position || '50% 50%' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 pointer-events-none" />
        <div className="absolute top-5 inset-x-4 text-xs font-bold text-white drop-shadow leading-snug">
          {t(m.group.titleKey)}
        </div>
        <div className="absolute bottom-6 inset-x-4 text-lg lg:text-xl font-black text-white drop-shadow leading-tight">
          {m.node.code || m.node.size}
        </div>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); go(index); }}
          aria-label={side === 'prev' ? t('common_prevProduct') : t('common_nextProduct')}
          className={`absolute ${side === 'prev' ? 'right-4 lg:right-5' : 'left-4 lg:left-5'} top-1/2 -translate-y-1/2 z-30 w-11 h-11 lg:w-12 lg:h-12 rounded-xl bg-white hover:bg-slate-100 text-slate-900 shadow-2xl flex items-center justify-center transition-transform active:scale-90 cursor-pointer`}
        >
          <Arrow className="w-6 h-6" />
        </button>
      </div>
    );
  };

  return (
    <div className="w-full select-none px-0 mx-0 overflow-x-hidden">

      <div className="text-center px-4 mb-6 sm:mb-8">
        <h2 className="text-3xl sm:text-4xl font-black text-[#123B92] tracking-tight leading-tight break-words text-balance">
          {t('modelsHeading')}
        </h2>
      </div>

      <div ref={ref} {...pauseProps} data-reveal="block" className="relative w-full overflow-hidden px-3 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center justify-center gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-14 w-full">

          {peek(prevIndex, 'prev')}

          {/* The active model */}
          <div
            className="relative w-full md:w-[64%] lg:w-[60%] xl:w-[58%] max-w-[1040px] h-[560px] sm:h-[520px] lg:h-[560px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl shrink-0 ring-1 ring-black/5 bg-slate-900"
            role="group"
            aria-roledescription="slide"
            aria-label={t('common_showcase_counter', { n: active + 1, total })}
          >
            {/* the active model's photo; its neighbours' photos wait underneath, so a change is a cross-fade */}
            {MODELS.map((m, i) => (i === active || i === prevIndex || i === nextIndex) && (
              <img
                key={m.node.id}
                src={m.photo.src}
                alt={i === active ? name : ''}
                aria-hidden={i === active ? undefined : true}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${i === active ? 'opacity-100' : 'opacity-0'}`}
                style={{ objectPosition: m.photo.position || '50% 50%' }}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 pointer-events-none" />

            {/* top: the model's type and its place in the line-up */}
            <div className="absolute top-5 inset-x-5 sm:top-7 sm:inset-x-8 z-10 flex items-start justify-between gap-3 pointer-events-none">
              <span key={`type-${active}`} className="animate-calm-fade inline-flex items-center gap-2 rounded-full bg-white/15 ring-1 ring-white/30 px-3 py-1 text-xs sm:text-sm font-bold uppercase tracking-wider text-white">
                <GroupIcon className="w-4 h-4 text-[#5ED16F] shrink-0" />
                {t(current.group.titleKey)}
              </span>
              <span className="shrink-0 text-xs font-bold text-white bg-black/60 px-3 py-1 rounded-full border border-white/30 whitespace-nowrap">
                <span className="sm:hidden">{active + 1} / {total}</span>
                <span className="hidden sm:inline">{t('common_showcase_counter', { n: active + 1, total })}</span>
              </span>
            </div>

            {/* bottom: name, summary, facts and buttons */}
            <div key={active} className="animate-calm-fade absolute bottom-6 inset-x-5 sm:bottom-8 sm:inset-x-9 z-10 max-w-2xl flex flex-col gap-3 sm:gap-4 text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.35)]">
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight !text-white leading-tight">{name}</h3>
              <p className="text-sm sm:text-base text-white/90 font-medium leading-relaxed">{t(current.node.shortKey)}</p>
              <dl className="grid grid-cols-3 divide-x divide-white/25 border-t border-white/25 pt-3 sm:pt-4">
                {facts.map((f, j) => (
                  <div key={j} className="min-w-0 flex flex-col px-2.5 sm:px-4 first:pl-0 last:pr-0">
                    <dt className="order-2 mt-0.5 text-2xs sm:text-xs font-semibold text-white/80 leading-snug">{f.label}</dt>
                    <dd className="order-1 text-sm sm:text-xl font-black text-white leading-tight [overflow-wrap:anywhere]">{f.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-3 pt-1 [text-shadow:none]">
                <button
                  type="button"
                  onClick={() => onOpenQuoteModal && onOpenQuoteModal({ capacityNeeded: nodeTitle(current.node, en) })}
                  className="btn-fx inline-flex items-center justify-center gap-2 px-3 py-3 sm:px-7 sm:py-3.5 bg-[#002DC2] hover:bg-[#123B92] text-white font-bold text-sm leading-snug text-center rounded-xl shadow-xl cursor-pointer"
                >
                  <MessageSquareQuote className="hidden sm:block w-5 h-5 shrink-0" />
                  {t('common_showcase_getQuote')}
                </button>
                <button
                  type="button"
                  onClick={() => onOpenDetailModal && onOpenDetailModal({ id: current.node.modelId })}
                  className="btn-fx inline-flex items-center justify-center gap-2 px-3 py-3 sm:px-7 sm:py-3.5 bg-white hover:bg-slate-100 text-[#123B92] font-bold text-sm leading-snug text-center rounded-xl shadow-xl cursor-pointer"
                >
                  {t('common_showcase_learnMore')}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* time left on this model */}
            {running && (
              <div className="absolute bottom-0 inset-x-0 h-1.5 bg-white/20 z-20 overflow-hidden">
                <div
                  key={active}
                  className="hero-progress h-full bg-gradient-to-r from-blue-400 to-[#23AC39]"
                  style={{ '--hero-interval': `${INTERVAL}ms` }}
                />
              </div>
            )}
          </div>

          {peek(nextIndex, 'next')}

        </div>

        {/* one dot per model; on phones (no side cards) with the arrows beside them */}
        <div className="flex items-center justify-center gap-2 pt-5">
          <button
            type="button"
            onClick={() => go(active - 1)}
            aria-label={t('common_prevProduct')}
            className="md:hidden mr-2 w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-900 shadow-md flex items-center justify-center cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          {MODELS.map((m, idx) => (
            <button
              key={m.node.id}
              type="button"
              onClick={() => go(idx)}
              aria-label={t('common_goTo', { name: nodeTitle(m.node, t) })}
              aria-current={active === idx ? 'true' : undefined}
              className={`h-2 rounded-full transition-colors duration-300 cursor-pointer ${
                active === idx ? 'w-8 bg-slate-900' : 'w-2 bg-slate-300 hover:bg-slate-500'
              }`}
            />
          ))}
          <button
            type="button"
            onClick={() => go(active + 1)}
            aria-label={t('common_nextProduct')}
            className="md:hidden ml-2 w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-900 shadow-md flex items-center justify-center cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
