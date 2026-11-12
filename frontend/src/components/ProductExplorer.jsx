import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, CheckCircle2, MessageSquareQuote, ArrowRight, MapPin, Weight, Grid, Sun, Landmark
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import pageTranslations from '../i18n';
import {
  CATALOG, CATALOG_ENTRIES, nodeTitle, nodeShortTitle, showcasePhotos, dryerRecord, shortCapacity
} from '../data/productCatalog';
import { buildQuoteUrl } from '../pages/QuotePage';
import useAutoplay from '../motion/useAutoplay';

// Products page: every product, one at a time. A large photo (the product's other photos as thumbnails)
// beside a card with what it is, its key specifications (dryer models, from the brochure data) or key
// points (other products, from the catalogue) and buttons for a quote and its own page. Tabs choose the
// product area, the buttons below them a product in it. It moves on by itself every 6 s while on screen,
// until the visitor picks something (and never for reduced motion).

const INTERVAL = 6000;
const en = (key) => pageTranslations.en[key] ?? key;

// The products of an area: its models / products, with the PV Laboratory's three setups listed
// instead of the laboratory itself
const leaves = (nodes) => nodes.flatMap(n => (n.children ? leaves(n.children) : [n]));
const AREAS = CATALOG.map(area => ({ area, items: area.children ? leaves(area.children) : [area] }));

// Short names for the product buttons (dryer models use their size / model code)
const CHIP_KEYS = {
  'pv-bending-test': 'prod_chipBend',
  'pv-visual-inspection': 'prod_chipVisual',
  'shadow-dial': 'prod_chipShadow',
  'log-splitter': 'prod_chipLog',
};
// Overview text where the product page's paragraph has markup in it
const DESC_KEYS = { 'solar-water-heater': 'cat_swhDesc' };
// The line above the name: the dryer type, the family the product belongs to, or (water heater, an
// area of its own) the kind of system it is
const eyebrowKey = (node) => {
  if (node.group) return node.group === 'box' ? 'cat_boxGroup' : 'cat_tunnel';
  const parent = CATALOG_ENTRIES.find(e => e.node === node)?.parent;
  return parent ? parent.titleKey : 'prod_thermalTitle';
};

const ITEMS = AREAS.flatMap((a, areaIndex) => a.items.map(node => ({
  node,
  areaIndex,
  photos: showcasePhotos(node),
  spec: dryerRecord(node),
  eyebrowKey: eyebrowKey(node),
})));

// "20W 12V DC Solar Panel (powers exhaust fan)" -> ["20W 12V DC Solar Panel", "powers exhaust fan"];
// "110W … Panel, 24V 12Ah Battery, …" -> ["110W … Panel", "24V 12Ah Battery, …"]
const splitSpec = (text = '') => {
  const i = text.search(/,|\s\(/);
  if (i < 0) return [text, null];
  let rest = text.slice(i).replace(/^,\s*|^\s\(/, '');
  if (text[i] !== ',') rest = rest.replace(/\)$/, '');
  return [text.slice(0, i).trim(), rest.trim() || null];
};

// Square and upright photos are shown whole, over a soft blur of themselves
const isTall = (photo) => photo.w && photo.h && photo.w / photo.h < 1.15;

export default function ProductExplorer() {
  const { t } = useLanguage();
  const total = ITEMS.length;
  const [index, setIndex] = useState(0);
  const [photo, setPhoto] = useState(0);
  const [auto, setAuto] = useState(true);
  const tabsRef = useRef(null);
  const chipsRef = useRef(null);

  const show = (i) => { setIndex((i + total) % total); setPhoto(0); };
  const pick = (i) => { setAuto(false); show(i); };
  const { ref, running, pauseProps } = useAutoplay(index, () => show(index + 1), { interval: INTERVAL, enabled: auto });

  const item = ITEMS[index];
  const name = nodeTitle(item.node, t);
  const prevItem = ITEMS[(index - 1 + total) % total];
  const nextItem = ITEMS[(index + 1) % total];
  const current = item.photos[photo] || item.photos[0];

  // Keep the chosen area and product buttons in view in their (horizontally scrolling) rows on small
  // screens - sideways only, so the page itself never jumps
  useEffect(() => {
    [tabsRef.current, chipsRef.current].forEach(row => {
      const on = row?.querySelector('[aria-pressed="true"]');
      if (!row || !on || row.scrollWidth <= row.clientWidth) return;
      const left = on.offsetLeft - (row.clientWidth - on.offsetWidth) / 2;
      row.scrollTo({ left: Math.max(0, left), behavior: 'smooth' });
    });
  }, [index]);

  // Photos in the frame: the current product's, plus the neighbours' first photos waiting underneath
  // (already loaded, so moving on is a cross-fade)
  const layers = [];
  const addLayer = (ph, on) => {
    if (ph && !layers.some(l => l.ph.src === ph.src)) layers.push({ ph, on });
  };
  item.photos.forEach((ph, j) => addLayer(ph, j === photo));
  addLayer(nextItem.photos[0], false);
  addLayer(prevItem.photos[0], false);

  return (
    <div ref={ref} {...pauseProps} className="space-y-4 sm:space-y-5">

      {/* Product areas */}
      <div ref={tabsRef} className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 pb-1 [scrollbar-width:none]">
        <div role="group" aria-label={t('prod_explorerAreas')} className="flex gap-2 w-max mx-auto">
          {AREAS.map((a, ai) => {
            const on = ai === item.areaIndex;
            const Icon = a.area.icon;
            return (
              <button
                key={a.area.id}
                type="button"
                aria-pressed={on}
                onClick={() => pick(ITEMS.findIndex(it => it.areaIndex === ai))}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  on ? 'bg-[#002DC2] border-[#002DC2] text-white shadow-md' : 'bg-white border-slate-200 text-[#123B92] hover:border-[#002DC2]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {t(a.area.titleKey)}
                <span className={`text-xs font-bold rounded-full px-1.5 ${on ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>{a.items.length}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Products in the chosen area */}
      <div ref={chipsRef} className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 pb-1 [scrollbar-width:none]">
        <div role="group" aria-label={t('prod_explorerProducts')} className="flex gap-2 w-max mx-auto">
          {ITEMS.map((it, i) => it.areaIndex === item.areaIndex && (
            <button
              key={it.node.id}
              type="button"
              aria-pressed={i === index}
              onClick={() => pick(i)}
              className={`inline-flex items-center gap-2 pl-1 pr-3.5 py-1 rounded-full border text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                i === index ? 'border-[#23AC39] bg-[#23AC39]/10 text-[#1A822B]' : 'border-slate-200 bg-white text-slate-700 hover:border-[#002DC2] hover:text-[#002DC2]'
              }`}
            >
              <img src={it.photos[0]?.thumb} alt="" loading="lazy" className="w-7 h-7 rounded-full object-cover bg-slate-100" />
              {CHIP_KEYS[it.node.id] ? t(CHIP_KEYS[it.node.id]) : nodeShortTitle(it.node, t)}
            </button>
          ))}
        </div>
      </div>

      <div data-reveal="block" className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">

        {/* Photo */}
        <div className="lg:col-span-7 relative rounded-2xl overflow-hidden bg-slate-900 shadow-lg aspect-[4/3] lg:aspect-auto lg:min-h-[540px]">
          {layers.map(({ ph, on }) => (
            <div
              key={ph.src}
              aria-hidden={on ? undefined : true}
              className={`absolute inset-0 transition-opacity duration-700 ${on ? 'opacity-100' : 'opacity-0'}`}
            >
              {isTall(ph) && (
                <img src={ph.thumb} alt="" className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-60" />
              )}
              <img
                src={ph.src}
                alt={on ? name : ''}
                className={`absolute inset-0 w-full h-full ${isTall(ph) ? 'object-contain' : 'object-cover'}`}
                style={{ objectPosition: ph.position || '50% 50%' }}
              />
            </div>
          ))}
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/55 to-transparent pointer-events-none" />

          {/* time left on this product */}
          {running && (
            <div className="absolute top-0 inset-x-0 h-1 bg-white/20 z-20 overflow-hidden">
              <div key={index} className="hero-progress h-full bg-gradient-to-r from-blue-400 to-[#23AC39]" style={{ '--hero-interval': `${INTERVAL}ms` }} />
            </div>
          )}

          <div className="absolute top-3 inset-x-3 z-20 flex items-start justify-between gap-2 pointer-events-none">
            <span className="text-xs font-bold text-white bg-black/55 px-2.5 py-1 rounded-full border border-white/25 whitespace-nowrap">
              {index + 1} / {total}
            </span>
            {current?.place && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-black/55 px-2.5 py-1 rounded-full border border-white/25 min-w-0">
                <MapPin className="w-4 h-4 shrink-0" />
                <span className="truncate">{current.place}</span>
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => pick(index - 1)}
            aria-label={t('common_prevProduct')}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md flex items-center justify-center cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => pick(index + 1)}
            aria-label={t('common_nextProduct')}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md flex items-center justify-center cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {item.photos.length > 1 && (
            <div role="group" aria-label={t('prod_explorerPhotos', { name })} className="absolute bottom-3 left-3 z-20 flex gap-2">
              {item.photos.map((ph, j) => (
                <button
                  key={ph.src}
                  type="button"
                  onClick={() => { setAuto(false); setPhoto(j); }}
                  aria-label={t('sections_showImage', { n: j + 1 })}
                  aria-current={j === photo ? 'true' : undefined}
                  className={`w-12 h-9 sm:w-16 sm:h-12 rounded-lg overflow-hidden ring-2 transition-opacity cursor-pointer ${
                    j === photo ? 'ring-white' : 'ring-white/40 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={ph.thumb} alt="" loading="lazy" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* What it is. Every product's card sits in the same grid cell, so the card keeps the height of the
            longest one and nothing below moves when the product changes; only the chosen one is visible. */}
        <div className="lg:col-span-5 grid bg-white rounded-2xl border border-slate-200/90 shadow-lg p-5 sm:p-6">
          {ITEMS.map((it, i) => {
            const on = i === index;
            const Icon = it.node.icon;
            const spec = it.spec;
            const [solarMain, solarSub] = spec ? splitSpec(spec.solarPower) : [];
            const rows = spec ? [
              { icon: Weight, label: t('hero_perBatch'), main: shortCapacity(spec.capacityRange), sub: /\(([^)]+)\)/.exec(spec.capacityRange || '')?.[1] },
              { icon: Grid, label: t('sections_specFloorTray'), main: t('sections_floor', { value: spec.floorArea }), sub: t('sections_trayArea', { value: spec.totalTrayArea }) },
              { icon: Sun, label: t('sections_specSolar'), main: solarMain, sub: solarSub },
              { icon: Landmark, label: t('subsidyEligibilityLabel'), main: spec.subsidyEligibility, sub: spec.paybackPeriod && `${t('sections_payback')}: ${spec.paybackPeriod}` },
            ] : null;
            return (
              <div
                key={`${on ? 'on' : 'off'}-${it.node.id}`}
                aria-hidden={on ? undefined : true}
                className={`[grid-area:1/1] flex flex-col gap-4 ${on ? 'animate-calm-fade' : 'invisible'}`}
              >
                <div className="space-y-2">
                  <span className="inline-flex items-center gap-1.5 text-2xs font-black uppercase tracking-wider text-[#002DC2] bg-[#F0F4FD] border border-[#002DC2]/20 px-3 py-1 rounded-full">
                    <Icon className="w-4 h-4 shrink-0" />
                    {t(it.eyebrowKey)}
                  </span>
                  <h3 className="text-2xl font-black text-[#123B92] leading-snug">{nodeTitle(it.node, t)}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {t(spec ? it.node.shortKey : (DESC_KEYS[it.node.id] || it.node.bodyKey || it.node.descKey))}
                  </p>
                </div>

                <div className="flex-1">
                  <div className="text-xs font-black uppercase tracking-wider text-[#1A822B] mb-2.5">
                    {t(spec ? 'prod_explorerSpecs' : 'prod_explorerPoints')}
                  </div>
                  {rows ? (
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {rows.map(r => (
                        <div key={r.label} className="p-3 rounded-xl bg-[#F7F9FE] border border-[#123B92]/10">
                          <dt className="flex items-center gap-1.5 text-2xs font-black uppercase tracking-wider text-slate-500">
                            <r.icon className="w-4 h-4 text-[#002DC2] shrink-0" />
                            {r.label}
                          </dt>
                          <dd className="mt-1 text-sm font-black text-[#123B92] leading-snug">{r.main}</dd>
                          {r.sub && <dd className="mt-0.5 text-xs text-slate-500 leading-snug">{r.sub}</dd>}
                        </div>
                      ))}
                    </dl>
                  ) : (
                    <ul className="space-y-2.5">
                      {it.node.points.map(key => (
                        <li key={key} className="flex items-start gap-2.5 p-3 rounded-xl bg-[#F7F9FE] border border-[#123B92]/10">
                          <CheckCircle2 className="w-5 h-5 text-[#23AC39] shrink-0" />
                          <span className="text-sm font-bold text-[#123B92] leading-snug">{t(key)}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5">
                  <Link
                    to={buildQuoteUrl({ capacityNeeded: nodeTitle(it.node, en) })}
                    className="btn-fx flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#23AC39] hover:bg-[#1f9632] text-white text-sm font-extrabold"
                  >
                    <MessageSquareQuote className="w-5 h-5 shrink-0" />
                    {t('common_showcase_getQuote')}
                  </Link>
                  <Link
                    to={it.node.path}
                    className="btn-fx flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[#002DC2]/30 text-[#002DC2] hover:bg-[#F0F4FD] text-sm font-bold"
                  >
                    {t('common_showcase_learnMore')}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
