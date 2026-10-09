import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Download, ExternalLink, Share2, FileText, ArrowRight } from 'lucide-react';
import { brochures } from '../data/brochuresData';
import PageBackBar from '../components/PageBackBar';

// PDF brochure reader page: /brochures/:brochureId (pages shown as images, works on every device)
export default function BrochurePage() {
  const { brochureId } = useParams();
  const brochure = brochures.find(b => b.id === brochureId);

  if (!brochure) {
    return (
      <section className="w-full py-20">
        <div className="max-w-xl mx-auto px-4 text-center space-y-5">
          <h1 className="text-3xl font-black text-[#123B92]">Brochure not found</h1>
          <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-[#23AC39] text-white font-black text-sm uppercase tracking-wider rounded-xl">
            Back to Home <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    );
  }

  const shareUrl = `https://wa.me/?text=${encodeURIComponent(`Check out the official ZeniTEK ${brochure.title}: ${window.location.origin}${brochure.url}`)}`;

  return (
    <div className="bg-white">
      <section className="w-full py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <PageBackBar crumbs={[{ label: 'Brochures' }, { label: brochure.title }]} fallback="/" />

          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className={`text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full border inline-block ${brochure.badgeColor}`}>
              {brochure.badge} Brochure
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-[#123B92] tracking-tight">{brochure.title}</h1>
            <p className="text-base sm:text-lg text-slate-600">{brochure.subtitle} · {brochure.pageCount} Pages · {brochure.size}</p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <a href={brochure.url} download={brochure.downloadName} className="inline-flex items-center gap-2 px-5 py-3 bg-[#002DC2] hover:bg-[#123B92] text-white rounded-xl text-sm font-bold shadow-sm">
              <Download className="w-4 h-4" /> Download PDF
            </a>
            <a href={brochure.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-3 bg-white border border-[#123B92]/25 hover:border-[#002DC2] text-[#123B92] rounded-xl text-sm font-bold">
              <ExternalLink className="w-4 h-4" /> Open Original PDF
            </a>
            <a href={shareUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-3 bg-[#23AC39] hover:bg-[#1A822B] text-white rounded-xl text-sm font-bold">
              <Share2 className="w-4 h-4" /> Share on WhatsApp
            </a>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {brochures.map(b => (
              <Link
                key={b.id}
                to={`/brochures/${b.id}`}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-bold transition-colors ${b.id === brochure.id ? 'bg-[#002DC2] text-white' : 'bg-white border border-slate-200 text-slate-700 hover:border-[#002DC2]'}`}
              >
                {b.title}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-10 sm:py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black text-[#123B92] tracking-tight">Brochure Pages</h2>
            <div className="flex flex-wrap justify-center gap-1 text-sm font-bold text-slate-600">
              {brochure.pages.map((_, i) => (
                <a key={i} href={`#brochure-page-${i + 1}`} className="w-8 h-8 rounded-lg border border-slate-200 hover:border-[#002DC2] hover:text-[#002DC2] flex items-center justify-center">
                  {i + 1}
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center gap-6">
            {brochure.pages.map((pageImg, idx) => (
              <div key={idx} id={`brochure-page-${idx + 1}`} className="scroll-mt-24 bg-white rounded-2xl shadow-lg overflow-hidden max-w-3xl w-full border border-slate-200">
                <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center gap-2 text-sm font-bold text-slate-600">
                  <FileText className="w-4 h-4 text-[#002DC2]" /> Page {idx + 1} of {brochure.pageCount}
                </div>
                <img src={pageImg} alt={`${brochure.title} - Page ${idx + 1}`} className="w-full h-auto block" loading={idx === 0 ? 'eager' : 'lazy'} />
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/quote" className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#23AC39] hover:bg-[#002DC2] text-white font-extrabold text-sm uppercase tracking-wider rounded-xl shadow-md">
              Request Technical Quotation <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
