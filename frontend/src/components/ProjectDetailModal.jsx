import React, { useState } from 'react';
import { X, MapPin, Tag, CheckCircle2, ShieldCheck, ArrowRight, Sun, Award, Play, Video, Image as ImageIcon } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function ProjectDetailModal({ isOpen, onClose, project, onEnquire }) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPhoto, setSelectedPhoto] = useState(0);

  if (!isOpen || !project) return null;

  const photos = project.photos && project.photos.length > 0 ? project.photos : [project.imageUrl || "https://images.unsplash.com/photo-1546554137-f86b9593a222?auto=format&fit=crop&w=800&q=80"];
  const stats = project.dryingStats || {
    originalDays: "7 Days Open Sun",
    solarDays: "2.5 Days Solar",
    moistureStart: "52%",
    moistureEnd: "6%",
    qualityGrade: "100% Grade-1 White",
    priceAdd: "+28% Value Addition"
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-950 via-blue-900 to-green-900 text-white shrink-0">
          <div>
            <span className="text-[10px] font-bold text-green-300 bg-blue-950 px-2 py-0.5 rounded uppercase tracking-wider border border-green-400/30">
              INSTALLATION CASE STUDY
            </span>
            <h3 className="text-lg sm:text-xl font-black mt-0.5 text-white">{project.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-2 space-x-2 shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center space-x-1.5 ${activeTab === 'overview' ? 'border-blue-700 text-blue-700 bg-white rounded-t-xl' : 'border-transparent text-slate-600 hover:text-blue-700'}`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Site Overview & Photos</span>
          </button>

          {project.videoUrl && (
            <button
              onClick={() => setActiveTab('video')}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center space-x-1.5 ${activeTab === 'video' ? 'border-blue-700 text-blue-700 bg-white rounded-t-xl' : 'border-transparent text-slate-600 hover:text-blue-700'}`}
            >
              <Video className="w-4 h-4 text-rose-600" />
              <span>Video Demonstration</span>
            </button>
          )}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {activeTab === 'overview' ? (
            <>
              {/* Image & Key Info */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                
                <div className="md:col-span-6 space-y-3">
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md h-60 bg-slate-100">
                    <img
                      src={photos[selectedPhoto] || project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 bg-blue-700 text-white font-bold text-[10px] uppercase px-2.5 py-1 rounded shadow">
                      {project.dryerType}
                    </span>
                  </div>

                  {photos.length > 1 && (
                    <div className="flex items-center space-x-2">
                      {photos.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedPhoto(idx)}
                          className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${selectedPhoto === idx ? 'border-blue-600 scale-105 shadow' : 'border-slate-200 opacity-70 hover:opacity-100'}`}
                        >
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="md:col-span-6 space-y-4">
                  <div>
                    <div className="text-xs font-bold text-blue-700 flex items-center">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-green-600 shrink-0" /> {project.locationName}
                    </div>
                    <h4 className="text-xl font-extrabold text-slate-900 mt-1">{project.title}</h4>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-100">
                      <div className="text-[10px] font-bold text-slate-500 uppercase">Target Produce</div>
                      <div className="font-extrabold text-blue-900 mt-0.5 text-sm">{project.cropDrying}</div>
                    </div>
                    <div className="p-3 bg-green-50/80 rounded-xl border border-green-100">
                      <div className="text-[10px] font-bold text-slate-500 uppercase">Batch Capacity</div>
                      <div className="font-extrabold text-green-800 mt-0.5 text-sm">{project.capacity}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 bg-slate-100 p-2.5 rounded-xl border border-slate-200">
                    <ShieldCheck className="w-4 h-4 text-green-600 shrink-0" />
                    <span>MNRE Certified Installation & NABARD Subsidy Direct Clearance</span>
                  </div>
                </div>

              </div>

              {/* Description & Case Narrative */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
                <h5 className="text-xs font-bold text-blue-950 uppercase tracking-wider">Installation Description & Case Metrics</h5>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {project.description}
                </p>
              </div>

              {/* Moisture Parameter Card */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm text-center">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Drying Time Speedup</div>
                  <div className="text-base font-black text-blue-700 mt-1">{stats.solarDays}</div>
                  <div className="text-[10px] text-slate-400 font-medium">vs {stats.originalDays}</div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm text-center">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Moisture Target</div>
                  <div className="text-base font-black text-green-700 mt-1">{stats.moistureStart} → {stats.moistureEnd}</div>
                  <div className="text-[10px] text-slate-400 font-medium">{stats.qualityGrade}</div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm text-center">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Market Price Premium</div>
                  <div className="text-base font-black text-blue-900 mt-1">{stats.priceAdd}</div>
                  <div className="text-[10px] text-slate-400 font-medium">Direct Mill & Export Linkage</div>
                </div>
              </div>
            </>
          ) : (
            /* Video Tab */
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-lg aspect-video bg-black">
                <iframe
                  src={project.videoUrl}
                  title={project.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <p className="text-xs text-slate-600 text-center font-medium">
                Live field demonstration video of {project.title} in operation.
              </p>
            </div>
          )}

        </div>

        {/* Footer CTAs */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition-colors"
          >
            {t('close')}
          </button>

          <button
            onClick={() => {
              onClose();
              if (onEnquire) onEnquire(project);
            }}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-700 via-blue-600 to-green-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow hover:scale-105 transition-all flex items-center space-x-1.5"
          >
            <span>{t('enquireSetup')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}

