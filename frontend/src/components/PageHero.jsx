import React, { useEffect, useState } from 'react';

// Page hero matching the Home hero: full-bleed background photo (or auto-rotating photos),
// a white fade from the left, and the heading block aligned left.
// `images` may be a single path or an array (cross-fades every 5s). Without images the hero gets a
// light brand background; `art` (e.g. an illustration) is then shown beside the heading on desktop.
export default function PageHero({ images, title, subtitle, actions, children, top, art, objectPosition = 'center' }) {
  const list = (Array.isArray(images) ? images : [images]).filter(Boolean);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (list.length < 2) return undefined;
    const timer = setInterval(() => setActive(i => (i + 1) % list.length), 5000);
    return () => clearInterval(timer);
  }, [list.length]);

  return (
    <section className="no-divider relative w-full overflow-hidden min-h-[440px] lg:min-h-[520px] flex items-center py-14 lg:py-20">
      <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
        {list.length === 0 && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#F0F4FD] via-white to-[#EAF7EC]" />
        )}
        {list.map((src, idx) => (
          <img
            key={src}
            src={src}
            alt=""
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${idx === active ? 'opacity-100' : 'opacity-0'}`}
            style={{ objectPosition }}
          />
        ))}
        {/* Left fade keeps the heading readable while the photo shows on the right */}
        {list.length > 0 && (
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-white/40 sm:via-white/70 sm:to-white/10 lg:via-white/60 lg:to-transparent" />
        )}
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-16 lg:px-20 space-y-6">
        {top}
        <div className="flex items-center gap-10">
        <div className="w-full max-w-2xl space-y-5 text-left">
          <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#123B92] leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-base sm:text-lg text-slate-800 font-semibold leading-relaxed max-w-xl">
              {subtitle}
            </p>
          )}
          {actions && <div className="flex flex-col sm:flex-row flex-wrap gap-3 pt-1">{actions}</div>}
          {children}
        </div>
        {art && <div className="hidden lg:block flex-1 min-w-0 max-w-md ml-auto" aria-hidden="true">{art}</div>}
        </div>
      </div>
    </section>
  );
}
