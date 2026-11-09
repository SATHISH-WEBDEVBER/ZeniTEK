import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Download, ExternalLink, Share2, FileText, ArrowRight } from 'lucide-react';
import { brochures } from '../data/brochuresData';
import { usePageTitle } from '../components/SiteHeader';
import PageHero from '../components/PageHero';
import BrochureCards from '../components/BrochureCards';
import NotFoundPage from './NotFoundPage';
import { useLanguage } from '../context/LanguageContext';

// One PDF brochure: /brochures/:brochureId - its cover photo, what it covers, and buttons to open,
// download or share the PDF, followed by the other brochures.
export default function BrochurePage() {
  const { brochureId } = useParams();
  const { t, tf } = useLanguage();
  const brochure = brochures.find(b => b.id === brochureId);
  usePageTitle(brochure?.title);

  if (!brochure) {
    return <NotFoundPage title={t('gallery_brochureNotFound')} />;
  }

  const shareUrl = `https://wa.me/?text=${encodeURIComponent(`Check out the official ZeniTEK ${brochure.title}: ${window.location.origin}${brochure.url}`)}`;
  const others = brochures.filter(b => b.id !== brochure.id);

  return (
    <div className="bg-white">
      <PageHero
        images={brochure.cover}
        title={brochure.title}
        subtitle={brochure.subtitle}
        actions={[
          { label: t('media_openPdf'), href: brochure.url, external: true, icon: ExternalLink },
          { label: t('gallery_downloadPdf'), href: brochure.url, download: brochure.downloadName, icon: Download },
        ]}
        stats={[
          { value: String(brochure.pageCount), label: t('hero_pages') },
          { value: brochure.size, label: t('hero_fileSize') },
          { value: tf(`gallery_brochureBadge_${brochure.id}`, brochure.badge), label: t('hero_brochureType') },
        ]}
      />

      {/* The brochure: cover photo, details and the PDF buttons */}
      <section className="w-full py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <a href={brochure.url} target="_blank" rel="noopener noreferrer" className="group relative block rounded-3xl overflow-hidden shadow-lg aspect-[4/3] bg-slate-100">
            <img src={brochure.cover} alt={brochure.coverAlt || brochure.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-[#123B92]/90 text-white text-xs font-black px-3 py-1.5 rounded-lg shadow">
              <FileText className="w-4 h-4" /> PDF
            </span>
          </a>
          <div className="space-y-5">
            <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-md border ${brochure.badgeColor}`}>
              {tf(`gallery_brochureBadge_${brochure.id}`, brochure.badge)}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#123B92] tracking-tight">{brochure.title}</h2>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">{brochure.subtitle}</p>
            <p className="text-sm font-bold text-slate-500">{t('gallery_pagesCount', { count: brochure.pageCount })} · {brochure.size}</p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 pt-1">
              <a href={brochure.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#002DC2] hover:bg-[#123B92] text-white text-sm font-extrabold transition-colors">
                <ExternalLink className="w-5 h-5" /> {t('media_openPdf')}
              </a>
              <a href={brochure.url} download={brochure.downloadName} className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#23AC39] hover:bg-[#1A822B] text-white text-sm font-extrabold transition-colors">
                <Download className="w-5 h-5" /> {t('gallery_downloadPdf')}
              </a>
              <a href={shareUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-[#23AC39]/40 text-[#1A822B] hover:bg-[#23AC39]/10 text-sm font-bold transition-colors">
                <Share2 className="w-5 h-5" /> {t('gallery_shareWhatsapp')}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* The other brochures */}
      {others.length > 0 && (
        <section className="w-full py-12 sm:py-16 bg-slate-50 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <h2 className="text-3xl sm:text-4xl font-black text-[#123B92] tracking-tight text-center">{t('media_moreBrochures')}</h2>
            <BrochureCards brochures={others} />
            <div className="text-center pt-2">
              <Link to="/quote" className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#23AC39] hover:bg-[#002DC2] text-white font-extrabold text-sm uppercase tracking-wider rounded-xl shadow-md">
                {t('gallery_requestTechQuote')} <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
