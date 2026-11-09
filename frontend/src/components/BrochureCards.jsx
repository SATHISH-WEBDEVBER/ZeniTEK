import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Download, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

// The PDF brochures as cards: a real product photo as the cover, the brochure's name and size,
// "Open PDF" (opens the PDF in a new tab) and a download button. Used on the Gallery page,
// the Solar Dryer Models page and each brochure's own page.
export default function BrochureCards({ brochures }) {
  const { t, tf } = useLanguage();
  const cols = brochures.length === 1 ? 'max-w-md mx-auto' : brochures.length === 2 ? 'sm:grid-cols-2 max-w-4xl mx-auto' : 'sm:grid-cols-2 lg:grid-cols-3';
  return (
    <div className={`grid grid-cols-1 ${cols} gap-6 sm:gap-7`}>
      {brochures.map((b) => (
        <article
          key={b.id}
          className="group bg-white rounded-3xl overflow-hidden border border-[#123B92]/20 shadow-sm hover:shadow-xl hover:border-[#002DC2] transition-all duration-300 flex flex-col"
        >
          <Link to={`/brochures/${b.id}`} className="relative block aspect-[4/3] overflow-hidden bg-slate-100">
            <img
              src={b.cover}
              alt={b.coverAlt || b.title}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <span className="absolute top-3 left-3 inline-flex items-center gap-1 bg-[#123B92]/90 text-white text-2xs font-black px-2.5 py-1 rounded-lg shadow-sm">
              <FileText className="w-3.5 h-3.5" /> PDF
            </span>
          </Link>
          <div className="p-5 flex flex-col gap-3 flex-1">
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className={`font-bold px-2 py-0.5 rounded-md border ${b.badgeColor}`}>{tf(`gallery_brochureBadge_${b.id}`, b.badge)}</span>
              <span className="text-slate-500 font-semibold">{t('gallery_pagesCount', { count: b.pageCount })} · {b.size}</span>
            </div>
            <h3 className="text-lg font-black text-[#123B92] leading-snug">
              <Link to={`/brochures/${b.id}`} className="hover:text-[#002DC2] transition-colors">{b.title}</Link>
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">{b.subtitle}</p>
            <div className="mt-auto pt-3 border-t border-slate-100 flex items-center gap-2">
              <a
                href={b.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold text-white bg-[#002DC2] hover:bg-[#123B92] rounded-xl transition-colors"
              >
                <ExternalLink className="w-4 h-4" /> {t('media_openPdf')}
              </a>
              <a
                href={b.url}
                download={b.downloadName}
                title={t('gallery_downloadPdf')}
                aria-label={t('gallery_downloadPdf')}
                className="p-2.5 text-[#1A822B] bg-[#23AC39]/10 hover:bg-[#23AC39] hover:text-white rounded-xl transition-colors"
              >
                <Download className="w-4 h-4" />
              </a>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
