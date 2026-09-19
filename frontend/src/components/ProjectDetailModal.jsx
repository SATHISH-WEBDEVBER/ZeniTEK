import React, { useState } from 'react';
import { X, MapPin, Tag, CheckCircle2, ShieldCheck, ArrowRight, Sun, Award, Play, Video, Image as ImageIcon } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function ProjectDetailModal({ isOpen, onClose, project, onEnquire }) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPhoto, setSelectedPhoto] = useState(0);

  if (!isOpen || !project) return null;

  const photos = project.photos && project.photos.length > 0 ? project.photos : [project.imageUrl || "/real-photos/zenitek_photo_18.jpeg"];
  const stats = project.dryingStats || {
    originalDays: "7 Days Open Sun",
    solarDays: "2.5 Days Solar",
    moistureStart: "52%",
    moistureEnd: "6%",
    qualityGrade: "100% Grade-1 White",
    priceAdd: "+28% Value Addition"
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl sm:rounded-3xl border-2 border-[#123B92] shadow-2xl overflow-hidden max-h-[94vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="px-4 py-3 sm:px-6 sm:py-4 border-b-2 border-[#00FB00] flex items-center justify-between bg-[#123B92] text-white shrink-0">
          <div>
            <span className="text-[9px] sm:text-[10px] font-bold text-[#00FB00] bg-black/40 px-2 py-0.5 rounded uppercase tracking-wider border border-[#00FB00]/50">
              INSTALLATION CASE STUDY
            </span>
            <h3 className="text-sm sm:text-lg lg:text-xl font-black mt-0.5 text-white line-clamp-1">{project.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-[#123B92]/20 bg-[#F0F4FD] px-3 sm:px-6 pt-2 space-x-2 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 sm:px-4 py-2 sm:py-2.5 text-xs font-bold border-b-2 transition-all flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${activeTab === 'overview' ? 'border-[#002DC2] text-[#002DC2] bg-white rounded-t-xl' : 'border-transparent text-black hover:text-[#002DC2]'}`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Site Overview & Photos</span>
          </button>

          {project.videoUrl && (
            <button
              onClick={() => setActiveTab('video')}
              className={`px-3 sm:px-4 py-2 sm:py-2.5 text-xs font-bold border-b-2 transition-all flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${activeTab === 'video' ? 'border-[#002DC2] text-[#002DC2] bg-white rounded-t-xl' : 'border-transparent text-black hover:text-[#002DC2]'}`}
            >
              <Video className="w-4 h-4 text-[#002DC2]" />
              <span>Video Demonstration</span>
            </button>
          )}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-3.5 sm:p-6 overflow-y-auto space-y-4 sm:space-y-6 flex-1 bg-white">
          
          {activeTab === 'overview' ? (
            <>
              {/* Image & Key Info */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                
                <div className="md:col-span-6 space-y-3">
                  <div className="relative rounded-2xl overflow-hidden border border-[#123B92]/30 shadow-md h-60 bg-[#F0F4FD]">
                    <img
                      src={photos[selectedPhoto] || project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {photos.length > 1 && (
                    <div className="flex items-center space-x-2">
                      {photos.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedPhoto(idx)}
                          className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${selectedPhoto === idx ? 'border-[#002DC2] scale-105 shadow ring-2 ring-[#00FB00]' : 'border-[#123B92]/20 opacity-70 hover:opacity-100'}`}
                        >
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="md:col-span-6 space-y-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="bg-[#002DC2] text-white font-bold text-[10px] uppercase px-2.5 py-0.5 rounded shadow-2xs">
                        {project.dryerType}
                      </span>
                      <span className="text-xs font-bold text-[#002DC2] flex items-center">
                        <MapPin className="w-3.5 h-3.5 mr-1 text-[#002DC2] shrink-0" /> {project.locationName}
                      </span>
                    </div>
                    <h4 className="text-xl font-extrabold text-[#123B92] mt-1">{project.title}</h4>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-3 bg-[#F0F4FD] rounded-xl border border-[#123B92]/20">
                      <div className="text-[10px] font-bold text-black/60 uppercase">Target Produce</div>
                      <div className="font-extrabold text-[#123B92] mt-0.5 text-sm">{project.cropDrying}</div>
                    </div>
                    <div className="p-3 bg-[#F0F4FD] rounded-xl border border-[#123B92]/20">
                      <div className="text-[10px] font-bold text-black/60 uppercase">Batch Capacity</div>
                      <div className="font-extrabold text-[#002DC2] mt-0.5 text-sm">{project.capacity}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-xs font-bold text-black bg-[#F0F4FD] p-2.5 rounded-xl border border-[#123B92]/20">
                    <ShieldCheck className="w-4 h-4 text-[#002DC2] shrink-0" />
                    <span>MNRE Certified Installation & NABARD Subsidy Direct Clearance</span>
                  </div>
                </div>

              </div>

              {/* Description & Case Narrative */}
              <div className="bg-[#F0F4FD] p-5 rounded-2xl border border-[#123B92]/20 space-y-2">
                <h5 className="text-xs font-bold text-[#123B92] uppercase tracking-wider">Installation Description & Case Metrics</h5>
                <p className="text-xs text-black leading-relaxed font-medium">
                  {project.description}
                </p>
              </div>

              {/* Moisture Parameter Card */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-white rounded-xl border border-[#123B92]/20 shadow-sm text-center">
                  <div className="text-[10px] text-black/60 font-bold uppercase">Drying Time Speedup</div>
                  <div className="text-base font-black text-[#002DC2] mt-1">{stats.solarDays}</div>
                  <div className="text-[10px] text-black/50 font-medium">vs {stats.originalDays}</div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#123B92]/20 shadow-sm text-center">
                  <div className="text-[10px] text-black/60 font-bold uppercase">Moisture Target</div>
                  <div className="text-base font-black text-[#002DC2] mt-1">{stats.moistureStart} → {stats.moistureEnd}</div>
                  <div className="text-[10px] text-black/50 font-medium">{stats.qualityGrade}</div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#123B92]/20 shadow-sm text-center">
                  <div className="text-[10px] text-black/60 font-bold uppercase">Market Price Premium</div>
                  <div className="text-base font-black text-[#123B92] mt-1">{stats.priceAdd}</div>
                  <div className="text-[10px] text-black/50 font-medium">Direct Mill & Export Linkage</div>
                </div>
              </div>
            </>
          ) : (
            /* Video Tab */
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden border border-[#123B92]/20 shadow-lg aspect-video bg-black">
                <iframe
                  src={project.videoUrl}
                  title={project.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <p className="text-xs text-black/70 text-center font-medium">
                Live field demonstration video of {project.title} in operation.
              </p>
            </div>
          )}

        </div>

        {/* Footer CTAs */}
        <div className="px-6 py-4 border-t border-[#123B92]/20 flex items-center justify-between bg-[#F0F4FD] shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-[#F0F4FD] text-black border border-[#123B92]/30 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            {t('close')}
          </button>

          <button
            onClick={() => {
              onClose();
              if (onEnquire) onEnquire(project);
            }}
            className="px-6 py-2.5 bg-[#00FB00] hover:bg-[#002DC2] text-black hover:text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <span>{t('enquireSetup')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}

