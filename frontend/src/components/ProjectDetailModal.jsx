import React from 'react';
import { X, MapPin, Tag, CheckCircle2, ShieldCheck, ArrowRight, Sun, Award } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function ProjectDetailModal({ isOpen, onClose, project, onEnquire }) {
  const { t } = useLanguage();

  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-900 via-blue-800 to-green-800 text-white">
          <div>
            <span className="text-[10px] font-bold text-green-300 bg-blue-950 px-2 py-0.5 rounded uppercase tracking-wider">
              {t('projectDetails')}
            </span>
            <h3 className="text-lg sm:text-xl font-bold mt-0.5">{project.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Image & Key Info */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            <div className="md:col-span-6 relative rounded-2xl overflow-hidden border border-slate-200 shadow-md h-56">
              <img
                src={project.imageUrl || "https://images.unsplash.com/photo-1546554137-f86b9593a222?auto=format&fit=crop&w=800&q=80"}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 bg-blue-700 text-white font-bold text-[10px] uppercase px-2.5 py-1 rounded shadow">
                {project.dryerType}
              </span>
            </div>

            <div className="md:col-span-6 space-y-3">
              <div>
                <div className="text-xs font-bold text-blue-700 flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-green-600 shrink-0" /> {project.locationName}
                </div>
                <h4 className="text-xl font-extrabold text-slate-900 mt-1">{project.title}</h4>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Target Produce</div>
                  <div className="font-extrabold text-blue-900 mt-0.5">{project.cropDrying}</div>
                </div>
                <div className="p-2.5 bg-green-50 rounded-xl border border-green-100">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Batch Capacity</div>
                  <div className="font-extrabold text-green-800 mt-0.5">{project.capacity}</div>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-[11px] font-bold text-slate-700 bg-slate-100 p-2 rounded-xl">
                <ShieldCheck className="w-4 h-4 text-green-600 shrink-0" />
                <span>100% MNRE Approved & State Subsidy Installed</span>
              </div>
            </div>

          </div>

          {/* Description & Case Narrative */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
            <h5 className="text-xs font-bold text-blue-950 uppercase tracking-wider">Installation Description & Case Metrics</h5>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {project.description}
            </p>
          </div>

          {/* Moisture Parameter Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm text-center">
              <div className="text-[10px] text-slate-500 font-bold uppercase">Drying Time Reduction</div>
              <div className="text-base font-extrabold text-blue-700 mt-1">2.5 Days Solar</div>
              <div className="text-[10px] text-slate-400">vs 7 Days Open Sun</div>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm text-center">
              <div className="text-[10px] text-slate-500 font-bold uppercase">Quality Grade Impact</div>
              <div className="text-base font-extrabold text-green-700 mt-1">100% Grade-1 White</div>
              <div className="text-[10px] text-slate-400">Zero Dust / Rain Stains</div>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm text-center">
              <div className="text-[10px] text-slate-500 font-bold uppercase">Price Premium</div>
              <div className="text-base font-extrabold text-blue-900 mt-1">+28% Value Addition</div>
              <div className="text-[10px] text-slate-400">Direct Oil Mill Sale</div>
            </div>
          </div>

        </div>

        {/* Footer CTAs */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50">
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
