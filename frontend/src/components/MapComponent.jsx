import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, ArrowRight, Tag, SlidersHorizontal, Info } from 'lucide-react';
import { sampleProjects } from '../data/sampleData';
import { useLanguage } from '../context/LanguageContext';
import ProjectDetailModal from './ProjectDetailModal';

const createCustomIcon = () => {
  return L.divIcon({
    className: 'custom-map-marker',
    html: `
      <div class="relative flex items-center justify-center w-8 h-8 rounded-full bg-blue-700 border-2 border-white shadow-xl text-white font-bold transform hover:scale-125 transition-transform duration-300">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun text-green-300"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
};

function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom, { duration: 1.5 });
    }
  }, [center, zoom, map]);
  return null;
}

export default function MapComponent({ onSelectProjectQuote }) {
  const { t } = useLanguage();
  const [projects, setProjects] = useState(sampleProjects);
  const [activeCenter, setActiveCenter] = useState([11.6854, 76.1320]);
  const [activeZoom, setActiveZoom] = useState(7);
  const [selectedState, setSelectedState] = useState('All');
  const [mobileTab, setMobileTab] = useState('map');
  const [selectedDetailProject, setSelectedDetailProject] = useState(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch('/api/projects');
        const data = await res.json();
        if (data.success && data.projects.length > 0) {
          setProjects(data.projects);
        }
      } catch (err) {
        console.log('Using sample project map data fallback:', err);
      }
    }
    fetchProjects();
  }, []);

  const statesList = ['All', 'Tamil Nadu', 'Kerala', 'Andhra Pradesh', 'Karnataka'];

  const filteredProjects = selectedState === 'All'
    ? projects
    : projects.filter(p => p.locationName.toLowerCase().includes(selectedState.toLowerCase()));

  const handleCenterProject = (project) => {
    setActiveCenter([project.latitude, project.longitude]);
    setActiveZoom(10);
    setMobileTab('map');
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-3 sm:p-5 space-y-4 w-full max-w-full overflow-hidden">
      
      {/* Top Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
        
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto">
          <span className="text-[11px] font-bold text-slate-500 mr-1 flex items-center shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5 mr-1" /> Filter State:
          </span>
          {statesList.map(st => (
            <button
              key={st}
              onClick={() => setSelectedState(st)}
              className={`text-[11px] px-3 py-1 rounded-xl font-bold transition-all shrink-0 ${selectedState === st ? 'bg-blue-700 text-white shadow' : 'bg-white text-slate-700 hover:text-blue-900 border border-slate-200'}`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Mobile View Toggle */}
        <div className="flex lg:hidden items-center justify-center p-1 bg-slate-200 rounded-xl">
          <button
            onClick={() => setMobileTab('map')}
            className={`flex-1 py-1.5 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center space-x-1 ${mobileTab === 'map' ? 'bg-blue-700 text-white shadow' : 'text-slate-700'}`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Interactive Map</span>
          </button>
          <button
            onClick={() => setMobileTab('list')}
            className={`flex-1 py-1.5 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center space-x-1 ${mobileTab === 'list' ? 'bg-blue-700 text-white shadow' : 'text-slate-700'}`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Locations ({filteredProjects.length})</span>
          </button>
        </div>

      </div>

      {/* Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[500px] sm:h-[600px] w-full">
        
        {/* Sidebar */}
        <div className={`lg:col-span-4 flex-col h-full bg-slate-50 rounded-2xl p-3 border border-slate-200 overflow-hidden ${mobileTab === 'list' ? 'flex' : 'hidden lg:flex'}`}>
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
            <h3 className="text-xs font-bold text-blue-950 flex items-center">
              <MapPin className="w-4 h-4 text-green-700 mr-1.5" /> Installed Dryer Locations
            </h3>
            <span className="text-[10px] font-mono font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded border border-blue-200">
              {filteredProjects.length} Sites
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {filteredProjects.map(proj => (
              <div
                key={proj._id || proj.title}
                onClick={() => handleCenterProject(proj)}
                className="p-3 bg-white hover:bg-blue-50/50 rounded-xl border border-slate-200 hover:border-blue-500 cursor-pointer transition-all group shadow-sm"
              >
                <div className="flex justify-between items-start">
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                    {proj.title}
                  </h4>
                  <span className="text-[9px] font-bold text-green-800 bg-green-50 px-1.5 py-0.5 rounded border border-green-200 shrink-0">
                    {proj.capacity}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1 flex items-center">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 mr-1 shrink-0" /> {proj.locationName}
                </p>
                <div className="mt-2 flex items-center justify-between text-[10px]">
                  <span className="text-blue-700 font-semibold flex items-center">
                    <Tag className="w-3 h-3 mr-1" /> {proj.cropDrying}
                  </span>
                  <span className="text-slate-500 group-hover:text-blue-700 flex items-center font-bold">
                    Target Map <ArrowRight className="w-2.5 h-2.5 ml-1" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Map Viewport */}
        <div className={`lg:col-span-8 h-full rounded-2xl overflow-hidden relative border border-slate-200 ${mobileTab === 'map' ? 'block' : 'hidden lg:block'}`}>
          <MapContainer
            center={activeCenter}
            zoom={activeZoom}
            scrollWheelZoom={false}
            style={{ width: '100%', height: '100%' }}
          >
            <ChangeView center={activeCenter} zoom={activeZoom} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {filteredProjects.map(p => (
              <Marker
                key={p._id || p.title}
                position={[p.latitude, p.longitude]}
                icon={createCustomIcon()}
              >
                <Popup className="custom-leaflet-popup">
                  <div className="p-1 max-w-xs space-y-2">
                    {p.imageUrl && (
                      <img
                        src={p.imageUrl}
                        alt={p.title}
                        className="w-full h-28 object-cover rounded-lg border border-slate-200"
                      />
                    )}
                    <div>
                      <div className="text-[10px] uppercase font-bold text-blue-700">{p.dryerType}</div>
                      <h4 className="text-sm font-bold text-slate-900">{p.title}</h4>
                      <p className="text-[11px] text-slate-600 flex items-center mt-0.5">
                        <MapPin className="w-3 h-3 text-green-600 mr-1" /> {p.locationName}
                      </p>
                    </div>
                    <p className="text-[10px] text-slate-500 italic line-clamp-2">{p.description}</p>
                    
                    {/* Popup Actions */}
                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-1.5">
                      <button
                        onClick={() => setSelectedDetailProject(p)}
                        className="flex-1 text-[10px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2 py-1 rounded shadow-sm text-center flex items-center justify-center space-x-1"
                      >
                        <Info className="w-3 h-3" />
                        <span>{t('seeMoreDetails')}</span>
                      </button>

                      {onSelectProjectQuote && (
                        <button
                          onClick={() => onSelectProjectQuote(p)}
                          className="flex-1 text-[10px] font-bold text-white bg-blue-700 hover:bg-blue-600 px-2 py-1 rounded shadow-sm text-center"
                        >
                          {t('enquireSetup')}
                        </button>
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

      </div>

      {/* Project Detail Modal */}
      <ProjectDetailModal
        isOpen={!!selectedDetailProject}
        onClose={() => setSelectedDetailProject(null)}
        project={selectedDetailProject}
        onEnquire={(proj) => {
          if (onSelectProjectQuote) onSelectProjectQuote(proj);
        }}
      />

    </div>
  );
}
