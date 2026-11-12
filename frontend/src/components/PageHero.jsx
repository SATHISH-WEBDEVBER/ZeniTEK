import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Breadcrumb } from './SiteHeader';
import SplitWords from '../motion/SplitWords';
import { prefersReducedMotion } from '../motion/core';

// The site's .max-w-7xl containers are full width with 80px side padding (index.css), so on desktop
// the hero text column always runs from x = 80px to 680px.

// Neutral (not blue) shade behind the text only, so the white text stays readable on any photo:
// strongest under the text column, gone just after it - the rest of the photo is untouched.
const DESKTOP_SHADE = 'linear-gradient(90deg, rgba(0, 0, 0, 0.6) 0, rgba(0, 0, 0, 0.45) 520px, rgba(0, 0, 0, 0) 820px)';

// The one hero used by every page, so all heroes share the same height, layout and text structure:
// a title, a subtitle, two buttons and three facts in white text directly on the full-width photo.
// A soft neutral shade sits behind the text only - no blue, no blur, no white panel. The breadcrumb
// is a white tab at the bottom-left.
//
// Desktop: the photo fills the whole hero. Phones and tablets: the photo is a banner above the text.
//
// images  : a photo path, or an array of paths (cross-fades every 5 s with controls)
// art     : a drawing shown instead of a photo, on a navy background (pages without a suitable photo)
// focus   : desktop photo width relative to the hero; above 1 pushes a centred subject to the right,
//           away from the text (1.25 = subject at ~62%). Use 1 for photos already composed that way.
// position: CSS object-position for the original photo (phones, and the fallback)
// actions : exactly two { label, to | href | onClick, icon?, external?, download? } - the first is the primary button
// stats   : exactly three { value, label }
// slides  : instead of the above, several slides that each bring their own photo and text (Home: one
//           per service) - [{ image, position?, focus?, label, eyebrow?, icon?, title, subtitle,
//           actions, stats? | points? (three short texts) }]. They change every 7 s (paused while the
//           pointer or keyboard focus is in the hero; not at all for reduced motion).
// slidesLabel: accessible name of the slide group (e.g. "Our services")
export default function PageHero({
  images, art, focus = 1.25, position = '50% 50%',
  title, subtitle, actions = [], stats = [], breadcrumb = true, slides, slidesLabel
}) {
  const media = slides
    ? slides.map(sl => ({ src: sl.image, position: sl.position || position, focus: sl.focus || focus, label: sl.label }))
    : (Array.isArray(images) ? images : [images]).filter(Boolean).map(src => ({ src, position, focus }));
  const texts = slides || [{ title, subtitle, actions, stats }];
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const interval = slides ? 7000 : 5000;
  const autoplay = media.length > 1 && !(slides && prefersReducedMotion());
  // Entrance (CSS, index.css "Page hero entrance"): the photo settles from a slight zoom, the title
  // rises word by word with its highlight underlined, then the subtitle, buttons and facts follow.
  // A slide's text replays that entrance each time the slide comes round.
  useEffect(() => {
    if (!autoplay || paused) return undefined;
    const timer = setTimeout(() => setActive(i => (i + 1) % media.length), interval);
    return () => clearTimeout(timer);
  }, [active, paused, autoplay, media.length, interval]);
  const pauseProps = slides ? {
    onMouseEnter: () => setPaused(true),
    onMouseLeave: () => setPaused(false),
    onFocus: () => setPaused(true),
    onBlur: (e) => { if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false); },
  } : {};

  return (
    <section data-hero {...pauseProps} className="no-divider relative w-full overflow-hidden bg-neutral-900 lg:h-[680px]">
      {/* Media: a clear banner on phones/tablets, the whole hero from lg up */}
      <div data-hero-media className={`relative h-64 sm:h-80 lg:absolute lg:inset-0 lg:h-auto overflow-hidden ${media.length > 0 ? 'bg-neutral-200' : 'bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-700'}`} aria-hidden="true">
        {media.map((m, idx) => (
          <img
            key={m.src}
            src={m.src}
            alt=""
            fetchpriority={idx === 0 ? 'high' : undefined}
            className={`hero-slide absolute inset-y-0 left-0 h-full max-w-none object-cover [object-position:var(--pos)] w-full lg:w-[var(--hero-w)] ${idx === active ? 'is-active opacity-100' : 'opacity-0'}`}
            style={{ '--hero-w': `${m.focus * 100}%`, '--pos': m.position }}
          />
        ))}
        {media.length === 0 && art && (
          <div className="absolute inset-0 flex items-center justify-end p-4 lg:pr-20 lg:pl-[50%]">
            <div className="w-full h-full max-w-2xl flex items-center">{art}</div>
          </div>
        )}
        {/* Phones/tablets: the banner's bottom edge runs into the navy text area */}
        <div className="lg:hidden absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-neutral-900" />
        {/* Desktop: neutral shade behind the text column only - the right side stays untouched */}
        <div className="hidden lg:block absolute inset-0" style={{ backgroundImage: DESKTOP_SHADE }} />
      </div>

      {media.length > 1 && (
        // Slide controls on desktop only; on phones and tablets the slides simply change on their own.
        // The current dot fills up over the time the slide is shown.
        <div className="hidden lg:flex absolute right-20 bottom-6 z-20 items-center gap-2 bg-white rounded-full px-2 py-1.5 shadow-md">
          <button type="button" aria-label="Previous slide" onClick={() => setActive(i => (i - 1 + media.length) % media.length)} className="w-8 h-8 rounded-full flex items-center justify-center text-[#123B92] hover:bg-[#F0F4FD] cursor-pointer">
            <ChevronLeft className="w-5 h-5" />
          </button>
          {media.map((m, idx) => (
            <button
              key={m.src}
              type="button"
              aria-label={m.label || `Go to slide ${idx + 1}`}
              title={m.label}
              aria-current={idx === active ? 'true' : undefined}
              onClick={() => setActive(idx)}
              className={`relative h-2.5 rounded-full overflow-hidden transition-all cursor-pointer ${idx === active ? 'w-9 bg-[#123B92]/25' : 'w-2.5 bg-slate-300 hover:bg-slate-400'}`}
            >
              {idx === active && (
                <span
                  key={`${active}-${paused}`}
                  className={`absolute inset-0 rounded-full bg-[#123B92] ${autoplay && !paused ? 'hero-progress' : ''}`}
                  style={{ '--hero-interval': `${interval}ms` }}
                />
              )}
            </button>
          ))}
          <button type="button" aria-label="Next slide" onClick={() => setActive(i => (i + 1) % media.length)} className="w-8 h-8 rounded-full flex items-center justify-center text-[#123B92] hover:bg-[#F0F4FD] cursor-pointer">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Text: white, straight on the photo (desktop) or on a dark panel under the banner (phones/tablets) */}
      <div className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 ${breadcrumb ? 'pb-24' : 'pb-10'} lg:pt-0 lg:pb-16 lg:h-full lg:flex lg:items-center pointer-events-none`}>
        {/* every slide's text sits in the same grid cell, so the hero keeps the height of the longest
            one (nothing below moves when the slide changes); only the current one is visible */}
        <div
          data-hero-text
          className="pointer-events-auto w-full lg:max-w-[600px] grid"
          role={slides ? 'region' : undefined}
          aria-roledescription={slides ? 'carousel' : undefined}
          aria-label={slides ? slidesLabel : undefined}
        >
          {texts.map((item, i) => {
            const on = i === (slides ? active : 0);
            const Heading = i === 0 ? 'h1' : 'h2';
            const Icon = item.icon;
            return (
              <div
                key={`${on ? 'on' : 'off'}-${i}`}
                aria-hidden={on ? undefined : true}
                className={`[grid-area:1/1] self-start lg:self-center flex flex-col gap-5 text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.35)] ${on ? '' : 'invisible'}`}
              >
                {item.eyebrow && (
                  <p className="hero-eyebrow self-start inline-flex items-center gap-2 rounded-full bg-white/15 ring-1 ring-white/30 px-3 py-1 text-xs sm:text-sm font-bold uppercase tracking-wider text-white [text-shadow:none]">
                    {Icon && <Icon className="w-4 h-4 text-[#5ED16F]" />}
                    {item.eyebrow}
                  </p>
                )}
                <Heading className="hero-title text-3xl sm:text-4xl lg:text-[2.6rem] font-black tracking-tight !text-white leading-[1.12] [&_span:not(.hero-word)]:!text-[#5ED16F]">
                  <SplitWords>{item.title}</SplitWords>
                </Heading>
                {item.subtitle && (
                  <p data-hero-fade style={{ '--d': 0 }} className="hero-sub text-base sm:text-lg text-white/90 font-medium leading-relaxed [&_strong]:text-white">{item.subtitle}</p>
                )}
                {item.actions?.length > 0 && (
                  <div data-hero-fade style={{ '--d': 1 }} className="flex flex-col sm:flex-row flex-wrap gap-3 [text-shadow:none]">
                    {item.actions.map((a, j) => <HeroButton key={j} action={a} primary={j === 0} />)}
                  </div>
                )}
                {item.stats?.length > 0 && (
                  // Phones: three rows (value left, label right); from sm up: three columns split by thin lines
                  <dl className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/25 border-t border-white/25 pt-1 sm:pt-5">
                    {item.stats.map((st, j) => (
                      <div key={j} data-hero-fade style={{ '--d': 2 + j }} className="min-w-0 flex items-center gap-3 py-2.5 sm:py-0 sm:block sm:px-5 sm:first:pl-0 sm:last:pr-0">
                        <dt className="sr-only">{st.label}</dt>
                        <StatValue value={st.value} className="shrink-0 max-w-[55%] sm:max-w-none text-lg sm:text-2xl font-black text-white leading-tight [overflow-wrap:anywhere] tabular-nums" />
                        <dd className="ml-auto sm:ml-0 text-right sm:text-left text-xs sm:text-sm text-white/80 font-semibold leading-snug sm:mt-1 [overflow-wrap:anywhere]">{st.label}</dd>
                      </div>
                    ))}
                  </dl>
                )}
                {item.points?.length > 0 && (
                  // Key points of a service, in the place of the facts
                  <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-5 border-t border-white/25 pt-3 sm:pt-5">
                    {item.points.map((pt, j) => (
                      <li key={j} data-hero-fade style={{ '--d': 2 + j }} className="flex items-start gap-2 text-sm font-bold text-white leading-snug">
                        <CheckCircle2 className="w-5 h-5 text-[#5ED16F] shrink-0" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {breadcrumb && <Breadcrumb />}
    </section>
  );
}

// A hero fact; a plain number ("1,200+", "40%", "8") counts up from zero as the facts appear.
// Only the text node's value changes, so React keeps managing the element.
function StatValue({ value, className }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const node = ref.current?.firstChild;
    const text = String(value ?? '');
    const match = /^(\d[\d,]*(?:\.\d+)?)(\D*)$/.exec(text.trim());
    if (!node || node.nodeType !== Node.TEXT_NODE || !match || prefersReducedMotion()) return undefined;
    const [, raw, suffix] = match;
    const target = parseFloat(raw.replace(/,/g, ''));
    if (!target || (/^\d{4}$/.test(raw) && target >= 1900 && target <= 2100)) return undefined; // years stay as they are
    const decimals = (raw.split('.')[1] || '').length;
    const format = (n) => (raw.includes(',')
      ? n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
      : n.toFixed(decimals)) + suffix;
    const DELAY = 650;
    const DURATION = 1400;
    let frame = 0;
    let start = 0;
    node.nodeValue = format(0);
    const tick = (now) => {
      if (!start) start = now + DELAY;
      const t = Math.min(1, Math.max(0, (now - start) / DURATION));
      node.nodeValue = format(target * (1 - Math.pow(1 - t, 3)));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      node.nodeValue = text;
    };
  }, [value]);
  return <dd ref={ref} className={className}>{value}</dd>;
}

function HeroButton({ action, primary }) {
  const { label, to, href, onClick, icon: Icon, external, download } = action;
  const cls = `btn-fx inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-extrabold transition-colors cursor-pointer ${
    primary
      ? 'bg-[#23AC39] hover:bg-[#1f9632] text-white shadow-md shadow-black/20'
      : 'bg-transparent border border-white/80 hover:bg-white text-white hover:text-[#123B92]'
  }`;
  const content = <>{Icon && <Icon className="w-5 h-5 shrink-0" />}<span>{label}</span>{primary && <ArrowRight className="w-4 h-4 shrink-0" />}</>;
  if (to) return <Link to={to} className={cls}>{content}</Link>;
  if (href) {
    return (
      <a href={href} className={cls} download={download} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} onClick={onClick}>
        {content}
      </a>
    );
  }
  return <button type="button" onClick={onClick} className={cls}>{content}</button>;
}
