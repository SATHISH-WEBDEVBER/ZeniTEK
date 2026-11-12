import React, { useState } from 'react';
import {
  ArrowRight, MessageCircle, Phone, Users, User, Calculator, MessageSquareQuote, Minus, Plus, Check,
  Layers, Rows3, Boxes, Flame, ScrollText, FileText, MapPinned, Contact, BookOpen, FileCheck2, BadgeCheck,
  Info, ClipboardList, Landmark, Wrench
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import PageHero from '../components/PageHero';
import IconTile from '../components/IconTile';
import { smoothScrollTo } from '../motion/core';
import { SUBSIDY_CATEGORIES, TUNNEL_MODELS, PRICES, estimate, inr, num } from '../data/subsidyData';

// Subsidies: the government subsidy for ZeniTEK solar tunnel dryers, from ZeniTEK's subsidy sheets
// (A.E.D. rates). This is the only page of the site that talks about subsidies.
//   1. hero  2. the two subsidy limits  3. calculator  4. cost tables of the five sizes
//   5. optional items  6. documents and notes  7. how ZeniTEK helps  8. call to action

const HERO_IMAGE = '/images/products/solar-dryer/tunnel-h2008-1000/tunnel-h2008-1000-01.webp';
const PROCESS_IMAGE = '/images/gallery/photo-41.webp';
const CTA_IMAGE = '/images/gallery/photo-02.webp';
const WHATSAPP = `https://wa.me/918098613422?text=${encodeURIComponent('Hello ZeniTEK team, I would like help with the government subsidy for a solar tunnel dryer.')}`;

const CATEGORY_ICONS = { priority: Users, other: User };
const STEP_ICONS = [FileText, ClipboardList, Landmark, Wrench, BadgeCheck];

const ITEMS = [
  { key: 'sub_itemTray', Icon: Layers, spec: '20″ × 28″ × 1.75″ · 3.8 sq.ft', price: PRICES.tray, unitKey: 'sub_each' },
  { key: 'sub_itemTrolley', Icon: Rows3, spec: '60″ × 28″ × 36″', specKey: 'sub_holds6', price: PRICES.trolley, unitKey: 'sub_each' },
  { key: 'sub_itemCombo', Icon: Boxes, specKey: 'sub_combo', price: PRICES.combo },
  { key: 'sub_itemHeater', Icon: Flame, spec: '1 kW', price: PRICES.heater, unitKey: 'sub_perKw' },
];

const DOCUMENTS = [
  { key: 'sub_doc1', hint: 'sub_doc1h', Icon: ScrollText },
  { key: 'sub_doc2', hint: 'sub_doc2h', Icon: FileText },
  { key: 'sub_doc3', hint: 'sub_doc3h', Icon: MapPinned },
  { key: 'sub_doc4', Icon: Contact },
  { key: 'sub_doc5', Icon: BookOpen },
  { key: 'sub_doc6', Icon: FileCheck2 },
  { key: 'sub_doc7', Icon: BadgeCheck },
];

const scrollTo = (id) => (e) => {
  const el = document.getElementById(id);
  if (el) { e.preventDefault(); smoothScrollTo(el); }
};

function SectionTitle({ title, subtitle }) {
  return (
    <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 space-y-3">
      <h2 className="text-3xl sm:text-4xl font-black text-[#123B92] tracking-tight">{title}</h2>
      {subtitle && <p className="text-base sm:text-lg text-slate-600">{subtitle}</p>}
    </div>
  );
}

function Question({ n, label, children }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2.5">
        <span className="w-7 h-7 rounded-full bg-[#002DC2] text-white text-sm font-black flex items-center justify-center shrink-0">{n}</span>
        <h3 className="text-lg font-bold text-[#123B92]">{label}</h3>
      </div>
      {children}
    </div>
  );
}

// − [ n ] + for a number of items
function Stepper({ label, note, value, onChange, max }) {
  const { t } = useLanguage();
  const set = (v) => onChange(Math.max(0, Math.min(max, Number.isFinite(v) ? v : 0)));
  const btn = 'w-9 h-9 rounded-lg border border-slate-300 bg-white text-[#123B92] flex items-center justify-center hover:border-[#002DC2] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer';
  return (
    <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white border border-slate-200">
      <div className="min-w-0">
        <div className="text-sm font-bold text-[#123B92] leading-snug">{label}</div>
        <div className="text-xs text-slate-500">{note}</div>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <button type="button" className={btn} onClick={() => set(value - 1)} disabled={value <= 0} aria-label={t('sub_less', { item: label })}>
          <Minus className="w-4 h-4" />
        </button>
        <input
          type="number"
          inputMode="numeric"
          min={0}
          max={max}
          value={value}
          onChange={(e) => set(parseInt(e.target.value, 10))}
          aria-label={label}
          className="w-14 h-9 rounded-lg border border-slate-300 text-center text-sm font-black text-[#123B92] tabular-nums focus:border-[#002DC2] focus:ring-1 focus:ring-[#002DC2] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
        />
        <button type="button" className={btn} onClick={() => set(value + 1)} disabled={value >= max} aria-label={t('sub_more', { item: label })}>
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

const sizeText = (m) => `${m.width} × ${m.length} ft`;

export default function SubsidiesPage({ onOpenQuoteModal }) {
  const { t } = useLanguage();
  const [category, setCategory] = useState(SUBSIDY_CATEGORIES[0]);
  const [model, setModel] = useState(TUNNEL_MODELS[0]);
  const [withItems, setWithItems] = useState(true);
  const [qty, setQty] = useState({ trolleys: TUNNEL_MODELS[0].trolleys, trays: TUNNEL_MODELS[0].trays, heaterKw: 0 });
  const [table, setTable] = useState('basic');

  const chooseModel = (m) => {
    setModel(m);
    setQty(q => ({ ...q, trolleys: m.trolleys, trays: m.trays }));
  };
  const chooseItems = (on) => {
    setWithItems(on);
    if (on && !qty.trolleys && !qty.trays) setQty(q => ({ ...q, trolleys: model.trolleys, trays: model.trays }));
  };

  const items = withItems ? qty : {};
  const result = estimate(model, category, items);
  const lines = [
    { label: t('sub_lineDryer'), detail: `${num(model.area)} sq.ft × ${inr(model.rate)}`, value: result.dryer },
    ...(withItems ? [
      { label: t('sub_trolleys'), detail: `${qty.trolleys} × ${inr(PRICES.trolley)}`, value: qty.trolleys * PRICES.trolley, skip: !qty.trolleys },
      { label: t('sub_trays'), detail: `${qty.trays} × ${inr(PRICES.tray)}`, value: qty.trays * PRICES.tray, skip: !qty.trays },
      { label: t('sub_itemHeater'), detail: `${qty.heaterKw} kW × ${inr(PRICES.heater)}`, value: qty.heaterKw * PRICES.heater, skip: !qty.heaterKw },
    ] : []),
  ].filter(l => !l.skip);
  const subsidyShare = result.total ? Math.round((result.subsidy / result.total) * 100) : 0;

  const quote = () => onOpenQuoteModal({
    capacityNeeded: `Solar Tunnel Dryer – Model ${model.n} (${sizeText(model)}, ${model.area} sq.ft)`,
    message: [
      `Subsidy estimate for Model ${model.n} (${sizeText(model)}, ${model.area} sq.ft)`,
      withItems
        ? `with ${qty.trolleys} trolleys, ${qty.trays} SS trays${qty.heaterKw ? ` and a ${qty.heaterKw} kW heater` : ''}`
        : 'basic structure only',
      `${category.percent}% category: total ${inr(result.total)}, subsidy ${inr(result.subsidy)}, farmer share ${inr(result.share)}.`,
    ].join(', '),
  });

  return (
    <div className="text-slate-900 min-h-screen bg-white">

      {/* 1. HERO */}
      <PageHero
        images={HERO_IMAGE}
        position="70% 50%"
        title={<>{t('sub_heroTitle1')} <span className="text-[#002DC2]">{t('sub_heroTitle2')}</span></>}
        subtitle={t('sub_heroSub')}
        actions={[
          { label: t('sub_heroCalc'), href: '#calculator', onClick: scrollTo('calculator'), icon: Calculator },
          { label: t('getQuote'), onClick: () => onOpenQuoteModal({ capacityNeeded: 'Solar Tunnel Dryer (subsidy)' }), icon: MessageSquareQuote },
        ]}
        stats={[
          { value: '50%', label: t('sub_who50') },
          { value: '40%', label: t('sub_who40') },
          { value: String(TUNNEL_MODELS.length), label: t('sub_statModels') },
        ]}
      />

      {/* 2. THE TWO LIMITS */}
      <section className="w-full py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title={t('sub_limitsTitle')} subtitle={t('sub_limitsSub')} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {SUBSIDY_CATEGORIES.map((c, i) => {
              const Icon = CATEGORY_ICONS[c.id];
              const strong = i === 0;
              return (
                <div
                  key={c.id}
                  className={`flex flex-col gap-4 rounded-3xl p-6 sm:p-8 shadow-lg ${strong ? 'bg-gradient-to-br from-[#001b69] to-[#002DC2] text-white' : 'bg-white border-2 border-[#23AC39]/40'}`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${strong ? 'bg-white/15' : 'bg-[#EAF7EC]'}`}>
                      <Icon className={`w-6 h-6 ${strong ? 'text-white' : 'text-[#1A822B]'}`} />
                    </span>
                    <span className={`font-bold leading-snug ${strong ? 'text-white' : 'text-[#123B92]'}`}>{t(c.whoKey)}</span>
                  </div>
                  <div className={`text-5xl sm:text-6xl font-black tracking-tight ${strong ? '!text-white' : 'text-[#1A822B]'}`}>
                    {t('sub_percentSubsidy', { percent: c.percent })}
                  </div>
                  <div className={`self-start rounded-xl px-4 py-2 text-base sm:text-lg font-black ${strong ? 'bg-white text-[#123B92]' : 'bg-[#EAF7EC] text-[#166A26]'}`}>
                    {t('sub_upTo', { amount: inr(c.max) })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. CALCULATOR */}
      <section id="calculator" className="w-full py-12 sm:py-16 bg-slate-50 border-y border-slate-200 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title={t('sub_calcTitle')} subtitle={t('sub_calcSub')} />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-8">
              <Question n={1} label={t('sub_q1')}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SUBSIDY_CATEGORIES.map(c => {
                    const on = c.id === category.id;
                    const Icon = CATEGORY_ICONS[c.id];
                    return (
                      <button
                        key={c.id}
                        type="button"
                        aria-pressed={on}
                        onClick={() => setCategory(c)}
                        className={`flex items-start gap-3 p-4 rounded-2xl border-2 text-left bg-white transition-colors cursor-pointer ${on ? 'border-[#002DC2] shadow-md' : 'border-slate-200 hover:border-[#002DC2]/40'}`}
                      >
                        <IconTile icon={Icon} size="md" tone={on ? 'solid' : 'blue'} />
                        <span className="flex-1 min-w-0">
                          <span className="block font-bold text-[#123B92] leading-snug">{t(c.whoKey)}</span>
                          <span className="block text-xs text-slate-500 mt-1">{t('sub_upTo', { amount: inr(c.max) })}</span>
                        </span>
                        <span className={`text-sm font-black px-2.5 py-1 rounded-lg ${on ? 'bg-[#1A822B] text-white' : 'bg-[#EAF7EC] text-[#166A26]'}`}>{c.percent}%</span>
                      </button>
                    );
                  })}
                </div>
              </Question>

              <Question n={2} label={t('sub_q2')}>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {TUNNEL_MODELS.map(m => {
                    const on = m.n === model.n;
                    return (
                      <button
                        key={m.n}
                        type="button"
                        aria-pressed={on}
                        onClick={() => chooseModel(m)}
                        className={`relative p-3 rounded-2xl border-2 text-left bg-white transition-colors cursor-pointer ${on ? 'border-[#002DC2] shadow-md' : 'border-slate-200 hover:border-[#002DC2]/40'}`}
                      >
                        {on && (
                          <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#002DC2] text-white flex items-center justify-center">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        )}
                        <span className="block text-xs font-bold uppercase tracking-wider text-[#1A822B]">{t('sub_model', { n: m.n })}</span>
                        <span className="block text-base font-black text-[#123B92] mt-1">{sizeText(m)}</span>
                        <span className="block text-xs font-semibold text-slate-500">{num(m.area)} sq.ft · {inr(m.rate)}/sq.ft</span>
                      </button>
                    );
                  })}
                </div>
              </Question>

              <Question n={3} label={t('sub_q3')}>
                <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-white border border-slate-200">
                  {[[false, 'sub_basicOnly'], [true, 'sub_withItems']].map(([on, key]) => (
                    <button
                      key={key}
                      type="button"
                      aria-pressed={withItems === on}
                      onClick={() => chooseItems(on)}
                      className={`px-3 py-2.5 rounded-xl text-sm font-bold leading-snug transition-colors cursor-pointer ${withItems === on ? 'bg-[#002DC2] text-white shadow' : 'text-[#123B92] hover:bg-[#F0F4FD]'}`}
                    >
                      {t(key)}
                    </button>
                  ))}
                </div>
                {withItems && (
                  <div className="space-y-2.5">
                    <p className="text-xs text-slate-500">{t('sub_withItemsHint')}</p>
                    <Stepper label={t('sub_trolleys')} note={`${inr(PRICES.trolley)} ${t('sub_each')} · ${t('sub_holds6')}`} value={qty.trolleys} max={200} onChange={(v) => setQty(q => ({ ...q, trolleys: v }))} />
                    <Stepper label={t('sub_trays')} note={`${inr(PRICES.tray)} ${t('sub_each')}`} value={qty.trays} max={1200} onChange={(v) => setQty(q => ({ ...q, trays: v }))} />
                    <Stepper label={t('sub_heaterKw')} note={`${inr(PRICES.heater)} ${t('sub_perKw')}`} value={qty.heaterKw} max={20} onChange={(v) => setQty(q => ({ ...q, heaterKw: v }))} />
                  </div>
                )}
              </Question>
            </div>

            {/* Result */}
            <div className="lg:col-span-5 lg:sticky lg:top-24 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
              <div className="bg-gradient-to-br from-[#001b69] to-[#002DC2] px-6 py-4 text-white">
                <div className="text-xs font-bold uppercase tracking-wider text-white/75">{t('sub_resultTitle')}</div>
                <div className="text-lg font-black text-white">
                  {t('sub_model', { n: model.n })} · {sizeText(model)} · {num(model.area)} sq.ft
                </div>
              </div>
              <div className="p-6 space-y-4" aria-live="polite">
                <dl className="space-y-2 text-sm">
                  {lines.map(l => (
                    <div key={l.label} className="flex items-baseline justify-between gap-3">
                      <dt className="min-w-0 text-slate-600">
                        {l.label} <span className="text-xs text-slate-500 whitespace-nowrap">({l.detail})</span>
                      </dt>
                      <dd className="font-bold text-[#123B92] tabular-nums whitespace-nowrap">{inr(l.value)}</dd>
                    </div>
                  ))}
                  <div className="flex items-baseline justify-between gap-3 pt-2 border-t border-slate-200">
                    <dt className="font-bold text-[#123B92]">{t('sub_total')}</dt>
                    <dd className="font-black text-[#123B92] tabular-nums whitespace-nowrap">{inr(result.total)}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-3">
                    <dt className="font-bold text-[#1A822B]">{t('sub_govSubsidy', { percent: category.percent })}</dt>
                    <dd className="font-black text-[#1A822B] tabular-nums whitespace-nowrap">− {inr(result.subsidy)}</dd>
                  </div>
                </dl>

                <div className="rounded-2xl bg-[#F0F4FD] border border-[#002DC2]/15 p-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-600">{t('sub_yourShare')}</div>
                  <div className="text-3xl sm:text-4xl font-black text-[#002DC2] tabular-nums leading-tight">{inr(result.share)}</div>
                  {/* how the total splits: subsidy (green) and your share (blue) */}
                  <div className="mt-3 h-2.5 rounded-full bg-[#002DC2]/80 overflow-hidden flex" aria-hidden="true">
                    <span className="h-full bg-[#23AC39]" style={{ width: `${subsidyShare}%` }} />
                  </div>
                  <div className="mt-1.5 flex justify-between text-xs font-semibold">
                    <span className="text-[#166A26]">{t('sub_govSubsidy', { percent: subsidyShare })}</span>
                    <span className="text-[#002DC2]">{t('sub_yourShare')} {100 - subsidyShare}%</span>
                  </div>
                </div>

                {result.capped && (
                  <p className="flex items-start gap-2 text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-3">
                    <Info className="w-4 h-4 shrink-0 mt-0.5" />
                    {t('sub_capped', { amount: inr(category.max) })}
                  </p>
                )}

                <button type="button" onClick={quote} className="btn-fx w-full py-3.5 bg-[#1A822B] hover:bg-[#166A26] text-white font-extrabold rounded-xl inline-flex items-center justify-center gap-2 cursor-pointer">
                  {t('sub_quoteThese')} <ArrowRight className="w-5 h-5" />
                </button>
                <p className="text-xs text-slate-500 leading-relaxed">{t('sub_note')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. COST TABLES */}
      <section className="w-full py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title={t('sub_tablesTitle')} subtitle={t('sub_tablesSub')} />

          <div className="flex justify-center mb-5">
            <div className="inline-grid grid-cols-2 gap-1 p-1 rounded-2xl bg-slate-100 border border-slate-200">
              {[['basic', 'sub_basicOnly'], ['items', 'sub_withItems']].map(([id, key]) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={table === id}
                  onClick={() => setTable(id)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-bold leading-snug transition-colors cursor-pointer ${table === id ? 'bg-white text-[#002DC2] shadow' : 'text-slate-600 hover:text-[#002DC2]'}`}
                >
                  {t(key)}
                </button>
              ))}
            </div>
          </div>

          <div tabIndex={0} role="region" aria-label={t('sub_tablesTitle')} className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm bg-white focus-visible:ring-2 focus-visible:ring-[#002DC2]">
            <table className={`w-full text-sm ${table === 'items' ? 'min-w-[1080px]' : 'min-w-[820px]'}`}>
              <thead className="text-xs">
                <tr className="bg-[#123B92] text-white">
                  <th rowSpan={2} className="sticky left-0 z-10 bg-[#123B92] px-3 py-3 text-left font-bold">{t('sub_colModel')}</th>
                  <th rowSpan={2} className="px-3 py-3 font-bold">{t('sub_colSize')}</th>
                  <th rowSpan={2} className="px-3 py-3 font-bold">{t('sub_colArea')}</th>
                  <th rowSpan={2} className="px-3 py-3 font-bold">{t('sub_colRate')}</th>
                  {table === 'items' && (
                    <>
                      <th colSpan={2} className="px-3 py-2 font-bold border-l border-white/20">{t('sub_trolleys')} <span className="font-normal opacity-80">({inr(PRICES.trolley)})</span></th>
                      <th colSpan={2} className="px-3 py-2 font-bold border-l border-white/20">{t('sub_trays')} <span className="font-normal opacity-80">({inr(PRICES.tray)})</span></th>
                    </>
                  )}
                  <th rowSpan={2} className="px-3 py-3 font-bold border-l border-white/20">{t('sub_colTotal')}</th>
                  <th colSpan={2} className="px-3 py-2 font-bold bg-[#1A822B] border-l border-white/20">{t('sub_colSubsidy')}</th>
                  <th colSpan={2} className="px-3 py-2 font-bold bg-[#002DC2] border-l border-white/20">{t('sub_colShare')}</th>
                </tr>
                <tr className="bg-[#123B92] text-white">
                  {table === 'items' && [t('sub_colQty'), t('sub_colCost'), t('sub_colQty'), t('sub_colCost')].map((h, i) => (
                    <th key={i} className={`px-3 py-2 font-semibold ${i % 2 === 0 ? 'border-l border-white/20' : ''}`}>{h}</th>
                  ))}
                  {SUBSIDY_CATEGORIES.map(c => <th key={`s${c.id}`} className={`px-3 py-2 font-semibold bg-[#1A822B] ${c.percent === 50 ? 'border-l border-white/20' : ''}`}>{t('sub_colCategory', { percent: c.percent })}</th>)}
                  {SUBSIDY_CATEGORIES.map(c => <th key={`f${c.id}`} className={`px-3 py-2 font-semibold bg-[#002DC2] ${c.percent === 50 ? 'border-l border-white/20' : ''}`}>{t('sub_colCategory', { percent: c.percent })}</th>)}
                </tr>
              </thead>
              <tbody className="tabular-nums">
                {TUNNEL_MODELS.map((m, i) => {
                  const opts = table === 'items' ? { trolleys: m.trolleys, trays: m.trays } : {};
                  const [a, b] = SUBSIDY_CATEGORIES.map(c => estimate(m, c, opts));
                  const zebra = i % 2 ? 'bg-slate-50' : 'bg-white';
                  return (
                    <tr key={m.n} className={`${zebra} border-t border-slate-100`}>
                      <th scope="row" className={`sticky left-0 z-10 ${zebra} px-3 py-3 text-left font-black text-[#123B92] whitespace-nowrap`}>{t('sub_model', { n: m.n })}</th>
                      <td className="px-3 py-3 text-center whitespace-nowrap">{m.width} × {m.length}</td>
                      <td className="px-3 py-3 text-center">{num(m.area)}</td>
                      <td className="px-3 py-3 text-center">{num(m.rate)}</td>
                      {table === 'items' && (
                        <>
                          <td className="px-3 py-3 text-center border-l border-slate-100">{m.trolleys}</td>
                          <td className="px-3 py-3 text-right">{num(m.trolleys * PRICES.trolley)}</td>
                          <td className="px-3 py-3 text-center border-l border-slate-100">{m.trays}</td>
                          <td className="px-3 py-3 text-right">{num(m.trays * PRICES.tray)}</td>
                        </>
                      )}
                      <td className="px-3 py-3 text-right font-black text-[#123B92] border-l border-slate-100">{num(a.total)}</td>
                      <td className="px-3 py-3 text-right font-bold text-[#1A822B] border-l border-slate-100">{num(a.subsidy)}</td>
                      <td className="px-3 py-3 text-right font-bold text-[#1A822B]">{num(b.subsidy)}</td>
                      <td className="px-3 py-3 text-right font-bold text-[#002DC2] border-l border-slate-100">{num(a.share)}</td>
                      <td className="px-3 py-3 text-right font-bold text-[#002DC2]">{num(b.share)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-600">
            {SUBSIDY_CATEGORIES.map(c => (
              <p key={c.id} className="flex items-start gap-2">
                <span className="shrink-0 font-black text-[#1A822B]">{t('sub_colCategory', { percent: c.percent })}:</span>
                <span>{t(c.whoKey)} — {t('sub_upTo', { amount: inr(c.max) })}</span>
              </p>
            ))}
            {table === 'items' && (
              <p className="md:col-span-2 flex items-start gap-2 text-[#123B92] font-semibold">
                <Info className="w-4 h-4 shrink-0 mt-0.5 text-[#002DC2]" />
                {t('sub_tableWithNote')}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 5. OPTIONAL ITEMS */}
      <section className="w-full py-12 sm:py-16 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title={t('sub_itemsTitle')} subtitle={t('sub_itemsSub')} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {ITEMS.map(({ key, Icon, spec, specKey, price, unitKey }) => (
              <div key={key} className="flex flex-col gap-3 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <IconTile icon={Icon} size="md" />
                <div className="flex-1">
                  <h3 className="text-lg font-black text-[#123B92]">{t(key)}</h3>
                  {spec && <div className="text-sm font-semibold text-slate-600">{spec}</div>}
                  {specKey && <div className="text-sm text-slate-500">{t(specKey)}</div>}
                </div>
                <div className="pt-3 border-t border-slate-100">
                  <span className="text-2xl font-black text-[#1A822B] tabular-nums">{inr(price)}</span>
                  {unitKey && <span className="text-sm font-semibold text-slate-500"> {t(unitKey)}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. DOCUMENTS AND NOTES */}
      <section className="w-full py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          <div className="lg:col-span-7">
            <h2 className="text-3xl sm:text-4xl font-black text-[#123B92] tracking-tight">{t('sub_docsTitle')}</h2>
            <p className="text-base sm:text-lg text-slate-600 mt-2 mb-6">{t('sub_docsSub')}</p>
            <ol className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DOCUMENTS.map(({ key, hint, Icon }, i) => (
                <li key={key} className="flex items-center gap-3 p-4 rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <span className="w-7 h-7 rounded-full bg-[#F0F4FD] text-[#002DC2] text-sm font-black flex items-center justify-center shrink-0">{i + 1}</span>
                  <Icon className="w-5 h-5 text-[#1A822B] shrink-0" />
                  <span className="min-w-0">
                    <span className="block text-sm font-bold text-[#123B92] leading-snug">{t(key)}</span>
                    {hint && <span className="block text-xs text-slate-500 leading-snug">{t(hint)}</span>}
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <div className="lg:col-span-5 self-start rounded-3xl bg-[#FFFBEB] border border-amber-200 p-6 sm:p-7">
            <h2 className="flex items-center gap-2 text-2xl font-black text-[#123B92]">
              <Info className="w-6 h-6 text-amber-600" /> {t('sub_notesTitle')}
            </h2>
            <ul className="mt-4 space-y-3">
              {['sub_note1', 'sub_note2', 'sub_note3', 'sub_note4', 'sub_note'].map(key => (
                <li key={key} className="flex items-start gap-2.5 text-sm text-slate-700 leading-relaxed">
                  <Check className="w-4 h-4 text-[#1A822B] shrink-0 mt-1" />
                  <span>{t(key)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 7. HOW ZENITEK HELPS */}
      <section className="w-full py-12 sm:py-16 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <figure className="order-2 lg:order-1">
            <img src={PROCESS_IMAGE} alt="A ZeniTEK tunnel dryer being installed on its concrete foundation" loading="lazy" className="w-full aspect-[4/3] lg:aspect-[4/5] object-cover rounded-3xl shadow-md" />
          </figure>
          <div className="order-1 lg:order-2 space-y-6">
            <div className="space-y-3">
              <h2 className="text-3xl sm:text-4xl font-black text-[#123B92] tracking-tight">{t('sections_stepsTitle')}</h2>
              <p className="text-base sm:text-lg text-slate-600">{t('sections_stepsSub')}</p>
            </div>
            <ol className="relative space-y-5">
              <span className="absolute left-6 top-6 bottom-6 w-0.5 bg-[#002DC2]/20" aria-hidden="true" />
              {STEP_ICONS.map((Icon, i) => (
                <li key={i} className="relative flex gap-4">
                  <span className="relative z-10 w-12 h-12 rounded-full bg-[#002DC2] text-white flex items-center justify-center shrink-0 shadow ring-4 ring-slate-50">
                    <Icon className="w-6 h-6" />
                  </span>
                  <div className="pt-1">
                    <div className="text-xs font-black text-[#1A822B] uppercase tracking-wider">0{i + 1}</div>
                    <h3 className="text-lg font-bold text-[#123B92] leading-snug">{t(`sections_step${i + 1}_title`)}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed mt-1">{t(`sections_step${i + 1}_desc`)}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* 8. CALL TO ACTION */}
      <section className="w-full py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-2 shadow-xl">
            <img src={CTA_IMAGE} alt="Farmers spreading chillies on racks inside a ZeniTEK tunnel dryer" loading="lazy" className="w-full h-60 md:h-full object-cover" />
            <div className="bg-gradient-to-br from-[#001b69] to-[#002DC2] text-white p-6 sm:p-10 flex flex-col justify-center gap-4">
              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">{t('sections_ctaQ')}</h2>
              <p className="text-base text-slate-200 leading-relaxed">{t('sections_ctaQSub')}</p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => onOpenQuoteModal({ capacityNeeded: 'Subsidy Consultation', message: 'I want a free telephone consultation regarding the government subsidy for a solar tunnel dryer.' })}
                  className="px-6 py-3 bg-[#1A822B] hover:bg-[#166A26] text-white font-extrabold rounded-xl transition-colors cursor-pointer"
                >
                  {t('sections_freeConsult')}
                </button>
                <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="px-5 py-3 bg-white/10 hover:bg-white/20 border border-white/25 font-bold rounded-xl transition-colors inline-flex items-center justify-center gap-2">
                  <MessageCircle className="w-5 h-5" /> {t('prod_whatsapp')}
                </a>
                <a href="tel:+918903852623" className="px-5 py-3 bg-white/10 hover:bg-white/20 border border-white/25 font-bold rounded-xl transition-colors inline-flex items-center justify-center gap-2">
                  <Phone className="w-5 h-5" /> {t('about_callDirectly')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
