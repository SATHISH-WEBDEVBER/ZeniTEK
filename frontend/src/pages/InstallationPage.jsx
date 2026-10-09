import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, ShieldCheck, ArrowRight, Video, Image as ImageIcon, BadgeCheck } from 'lucide-react';
import { activeLocationsData } from '../data/mapLocationsData';
import { usePageTitle } from '../components/SiteHeader';
import { buildQuoteUrl } from './QuotePage';
import { useLanguage } from '../context/LanguageContext';
import { API_BASE } from '../utils/api';

// Detail page for one map installation site: /installations/:id
// Looks the site up in the bundled map data first, then asks the API (GET /api/projects/:id).
export default function InstallationPage() {
  const { id } = useParams();
  const { t } = useLanguage();
  const local = activeLocationsData.find(p => p._id === id || p.title === id) || null;
  const [project, setProject] = useState(local);
  const [loading, setLoading] = useState(!local);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPhoto, setSelectedPhoto] = useState(0);

  useEffect(() => {
    setSelectedPhoto(0);
    setActiveTab('overview');
    if (local) { setProject(local); setLoading(false); return; }
    let cancelled = false;
    setLoading(true);
    fetch(`${API_BASE}/projects/${encodeURIComponent(id)}`)
      .then(r => (r.ok ? r.json() : null))
      .then(data => { if (!cancelled) setProject(data?.project || data?.data || null); })
      .catch(() => { if (!cancelled) setProject(null); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  usePageTitle(project?.title);

  if (loading) {
    return <section className="w-full py-24 text-center text-slate-500 font-semibold">{t('gallery_instLoading')}</section>;
  }

  if (!project) {
    return (
      <section className="w-full py-20">
        <div className="max-w-xl mx-auto px-4 text-center space-y-5">
          <h1 className="text-3xl font-black text-[#123B92]">{t('gallery_instNotFound')}</h1>
          <p className="text-slate-600">{t('gallery_instNotFoundDesc')}</p>
          <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-[#23AC39] text-white font-black text-sm uppercase tracking-wider rounded-xl">
            {t('notFoundHome')} <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    );
  }

  const photos = project.photos && project.photos.length > 0 ? project.photos : [project.imageUrl || '/real-photos/zenitek_photo_12.jpeg'];
  const stats = project.dryingStats || null;
  const quoteUrl = buildQuoteUrl({ cropType: project.cropDrying, capacityNeeded: project.capacity, district: project.locationName });

  return (
    <div className="bg-white">
      <section className="w-full py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h1 className="text-3xl sm:text-4xl font-black text-[#123B92] tracking-tight">{project.title}</h1>
            <p className="text-base sm:text-lg font-semibold text-slate-600 inline-flex items-center justify-center gap-1.5">
              <MapPin className="w-5 h-5 text-[#002DC2] shrink-0" /> {project.locationName}
            </p>
          </div>

          {project.videoUrl && (
            <div className="flex justify-center gap-2">
              {[['overview', ImageIcon, t('gallery_tabOverview')], ['video', Video, t('gallery_tabVideo')]].map(([key, Icon, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveTab(key)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all inline-flex items-center gap-1.5 cursor-pointer ${activeTab === key ? 'bg-[#002DC2] text-white border-[#002DC2]' : 'bg-white text-[#123B92] border-[#123B92]/25 hover:border-[#002DC2]'}`}
                >
                  <Icon className="w-5 h-5" /> {label}
                </button>
              ))}
            </div>
          )}

          {activeTab === 'video' && project.videoUrl ? (
            <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden border border-[#123B92]/20 shadow-lg aspect-video bg-black">
              <iframe
                src={project.videoUrl}
                title={project.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div className="space-y-3">
                <div className="rounded-2xl overflow-hidden border border-[#123B92]/30 shadow-md aspect-[4/3] bg-[#F0F4FD]">
                  <img src={photos[selectedPhoto]} alt={project.title} className="w-full h-full object-cover" />
                </div>
                {photos.length > 1 && (
                  <div className="flex flex-wrap gap-2">
                    {photos.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedPhoto(idx)}
                        aria-label={t('gallery_showPhoto', { n: idx + 1 })}
                        className={`w-20 h-16 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${selectedPhoto === idx ? 'border-[#002DC2] ring-2 ring-[#23AC39]' : 'border-[#123B92]/20 opacity-70 hover:opacity-100'}`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-4 bg-[#F0F4FD] rounded-xl border border-[#123B92]/20">
                    <div className="text-xs font-bold text-black/60 uppercase">{t('gallery_dryerType')}</div>
                    <div className="font-extrabold text-[#123B92] mt-1">{project.dryerType}</div>
                  </div>
                  <div className="p-4 bg-[#F0F4FD] rounded-xl border border-[#123B92]/20">
                    <div className="text-xs font-bold text-black/60 uppercase">{t('gallery_specCapacity')}</div>
                    <div className="font-extrabold text-[#002DC2] mt-1">{project.capacity}</div>
                  </div>
                  <div className="p-4 bg-[#F0F4FD] rounded-xl border border-[#123B92]/20 col-span-2">
                    <div className="text-xs font-bold text-black/60 uppercase">{t('gallery_targetProduce')}</div>
                    <div className="font-extrabold text-[#123B92] mt-1">{project.cropDrying}</div>
                  </div>
                </div>

                {project.description && (
                  <p className="text-base text-slate-700 leading-relaxed">{project.description}</p>
                )}

                <div className="flex items-center gap-2 text-sm font-bold text-[#123B92] bg-[#F0F4FD] p-3 rounded-xl border border-[#123B92]/20">
                  <BadgeCheck className="w-5 h-5 text-[#002DC2] shrink-0" />
                  <span>{t('gallery_mnreCertified')}</span>
                </div>

                <Link
                  to={quoteUrl}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#23AC39] hover:bg-[#002DC2] text-white font-extrabold text-sm uppercase tracking-wider rounded-xl shadow-md transition-all text-center"
                >
                  <span>{t('enquireSetup')}</span>
                  <ArrowRight className="w-5 h-5 shrink-0" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {stats && (
        <section className="w-full py-10 sm:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <h2 className="text-3xl sm:text-4xl font-black text-[#123B92] tracking-tight">{t('gallery_resultsTitle')}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-5xl mx-auto">
              <div className="p-5 bg-white rounded-2xl border border-[#123B92]/20 shadow-sm text-center">
                <div className="text-xs text-black/60 font-bold uppercase">{t('gallery_specDryingTime')}</div>
                <div className="text-2xl font-black text-[#002DC2] mt-1">{stats.solarDays}</div>
                <div className="text-sm text-slate-500">{t('gallery_vs', { value: stats.originalDays })}</div>
              </div>
              <div className="p-5 bg-white rounded-2xl border border-[#123B92]/20 shadow-sm text-center">
                <div className="text-xs text-black/60 font-bold uppercase">{t('gallery_moisture')}</div>
                <div className="text-2xl font-black text-[#002DC2] mt-1">{stats.moistureStart} → {stats.moistureEnd}</div>
                <div className="text-sm text-slate-500">{stats.qualityGrade}</div>
              </div>
              <div className="p-5 bg-white rounded-2xl border border-[#123B92]/20 shadow-sm text-center">
                <div className="text-xs text-black/60 font-bold uppercase">{t('gallery_valueAddition')}</div>
                <div className="text-2xl font-black text-[#123B92] mt-1">{stats.priceAdd}</div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
