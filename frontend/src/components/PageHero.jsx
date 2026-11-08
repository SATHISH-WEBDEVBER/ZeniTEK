import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Breadcrumb } from './SiteHeader';

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
export default function PageHero({
  images, art, focus = 1.25, position = '50% 50%',
  title, subtitle, actions = [], stats = [], breadcrumb = true
}) {
  const list = (Array.isArray(images) ? images : [images]).filter(Boolean);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (list.length < 2) return undefined;
    const timer = setInterval(() => setActive(i => (i + 1) % list.length), 5000);
    return () => clearInterval(timer);
  }, [list.length]);

  return (
    <section className="no-divider relative w-full overflow-hidden bg-neutral-900 lg:h-[680px]">
      {/* Media: a clear banner on phones/tablets, the whole hero from lg up */}
      <div className={`relative h-64 sm:h-80 lg:absolute lg:inset-0 lg:h-auto overflow-hidden ${list.length > 0 ? 'bg-neutral-200' : 'bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-700'}`} aria-hidden="true">
        {list.map((src, idx) => (
          <img
            key={src}
            src={src}
            alt=""
            fetchpriority={idx === 0 ? 'high' : undefined}
            className={`absolute inset-y-0 left-0 h-full max-w-none object-cover [object-position:var(--pos)] transition-opacity duration-1000 w-full lg:w-[var(--hero-w)] ${idx === active ? 'opacity-100' : 'opacity-0'}`}
            style={{ '--hero-w': `${focus * 100}%`, '--pos': position }}
          />
        ))}
        {list.length === 0 && art && (
          <div className="absolute inset-0 flex items-center justify-end p-4 lg:pr-20 lg:pl-[50%]">
            <div className="w-full h-full max-w-2xl flex items-center">{art}</div>
          </div>
        )}
        {/* Phones/tablets: the banner's bottom edge runs into the navy text area */}
        <div className="lg:hidden absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-neutral-900" />
        {/* Desktop: neutral shade behind the text column only - the right side stays untouched */}
        <div className="hidden lg:block absolute inset-0" style={{ backgroundImage: DESKTOP_SHADE }} />
      </div>

      {list.length > 1 && (
        <div className="absolute right-3 top-3 lg:top-auto lg:right-20 lg:bottom-6 z-20 flex items-center gap-2 bg-white rounded-full px-2 py-1.5 shadow-md">
          <button type="button" aria-label="Previous slide" onClick={() => setActive(i => (i - 1 + list.length) % list.length)} className="w-8 h-8 rounded-full flex items-center justify-center text-[#123B92] hover:bg-[#F0F4FD] cursor-pointer">
            <ChevronLeft className="w-5 h-5" />
          </button>
          {list.map((src, idx) => (
            <button
              key={src}
              type="button"
              aria-label={`Go to slide ${idx + 1}`}
              onClick={() => setActive(idx)}
              className={`h-2.5 rounded-full transition-all cursor-pointer ${idx === active ? 'w-7 bg-[#123B92]' : 'w-2.5 bg-slate-300 hover:bg-slate-400'}`}
            />
          ))}
          <button type="button" aria-label="Next slide" onClick={() => setActive(i => (i + 1) % list.length)} className="w-8 h-8 rounded-full flex items-center justify-center text-[#123B92] hover:bg-[#F0F4FD] cursor-pointer">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Text: white, straight on the photo (desktop) or on a dark panel under the banner (phones/tablets) */}
      <div className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 ${breadcrumb ? 'pb-24' : 'pb-10'} lg:pt-0 lg:pb-16 lg:h-full lg:flex lg:items-center pointer-events-none`}>
        <div className="pointer-events-auto w-full lg:max-w-[600px] flex flex-col gap-5 text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.35)]">
          <h1 className="hero-title text-3xl sm:text-4xl lg:text-[2.6rem] font-black tracking-tight !text-white leading-[1.12] [&_span]:!text-[#5ED16F]">
            {title}
          </h1>
          {subtitle && (
            <p className="hero-sub text-base sm:text-lg text-white/90 font-medium leading-relaxed [&_strong]:text-white">{subtitle}</p>
          )}
          {actions.length > 0 && (
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 [text-shadow:none]">
              {actions.map((a, i) => <HeroButton key={i} action={a} primary={i === 0} />)}
            </div>
          )}
          {stats.length > 0 && (
            // Phones: three rows (value left, label right); from sm up: three columns split by thin lines
            <dl className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/25 border-t border-white/25 pt-1 sm:pt-5">
              {stats.map((s, i) => (
                <div key={i} className="min-w-0 flex items-center gap-3 py-2.5 sm:py-0 sm:block sm:px-5 sm:first:pl-0 sm:last:pr-0">
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="max-w-[55%] sm:max-w-none text-lg sm:text-2xl font-black text-white leading-tight [overflow-wrap:anywhere]">{s.value}</dd>
                  <dd className="ml-auto sm:ml-0 text-right sm:text-left text-xs sm:text-sm text-white/80 font-semibold leading-snug sm:mt-1 [overflow-wrap:anywhere]">{s.label}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>

      {breadcrumb && <Breadcrumb />}
    </section>
  );
}

function HeroButton({ action, primary }) {
  const { label, to, href, onClick, icon: Icon, external, download } = action;
  const cls = `inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-extrabold transition-colors cursor-pointer ${
    primary
      ? 'bg-[#23AC39] hover:bg-[#1f9632] text-white shadow-md shadow-black/20'
      : 'bg-transparent border border-white/80 hover:bg-white text-white hover:text-[#123B92]'
  }`;
  const content = <>{Icon && <Icon className="w-5 h-5 shrink-0" />}<span>{label}</span></>;
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
