import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { 
  MapPin, 
  ArrowRight, 
  Tag, 
  SlidersHorizontal, 
  Plus, 
  Minus, 
  Maximize2, 
  Search, 
  Sparkles, 
  Info,
  Play
} from 'lucide-react';
import { sampleProjects } from '../data/sampleData';
import { activeLocationsData } from '../data/mapLocationsData';
import { useLanguage } from '../context/LanguageContext';
import ProjectDetailModal from './ProjectDetailModal';

// Custom ZeniTEK Map Pin Marker (Zomato / Swiggy style teardrop badge with ZeniTEK emblem)
const createCustomIcon = (isSelected = false) => {
  return L.divIcon({
    className: 'zenitek-custom-marker',
    html: `
      <div class="zenitek-map-pin-root ${isSelected ? 'is-selected' : ''}">
        <div class="zenitek-pin-pulse"></div>
        <div class="zenitek-pin-body">
          <div class="zenitek-pin-emblem-wrap">
            <img src="/emblem.png" alt="ZeniTEK" class="zenitek-pin-emblem-img" />
          </div>
        </div>
        <div class="zenitek-pin-tip"></div>
      </div>
    `,
    iconSize: [44, 54],
    iconAnchor: [22, 54],
    popupAnchor: [0, -56]
  });
};

// Map Subcontroller: Handles bounds, manual fit, and smooth flyTo on sidebar click
function MapController({
  filteredProjects,
  selectedProject,
  mobileTab,
  triggerFitAll,
  onResetFitTrigger,
  markerRefs
}) {
  const map = useMap();
  const prevFilterKeyRef = useRef('');

  // Auto-resize tiles when mobile tab changes or on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);
    return () => clearTimeout(timer);
  }, [map, mobileTab]);

  // Smoothly center ONLY when user explicitly clicks a project card in the sidebar list
  useEffect(() => {
    if (selectedProject) {
      const latLng = [selectedProject.latitude, selectedProject.longitude];
      map.flyTo(latLng, Math.max(map.getZoom(), 11), {
        duration: 1.2
      });

      const timer = setTimeout(() => {
        const marker = markerRefs.current[selectedProject._id || selectedProject.title];
        if (marker) {
          marker.openPopup();
        }
      }, 400);

      return () => clearTimeout(timer);
    }
  }, [selectedProject, map, markerRefs]);

  // Auto-fit bounds when state filter changes
  useEffect(() => {
    if (filteredProjects && filteredProjects.length > 0) {
      const filterKey = filteredProjects.map(p => p._id || p.title).sort().join(',');
      
      if (filterKey === prevFilterKeyRef.current) return;
      prevFilterKeyRef.current = filterKey;

      if (filteredProjects.length === 1) {
        map.flyTo([filteredProjects[0].latitude, filteredProjects[0].longitude], 11, {
          duration: 1.2
        });
      } else {
        const bounds = L.latLngBounds(filteredProjects.map(p => [p.latitude, p.longitude]));
        map.flyToBounds(bounds, {
          padding: [50, 50],
          maxZoom: 11,
          duration: 1.2
        });
      }
    }
  }, [filteredProjects, map]);

  // Manual trigger to fit all visible markers
  useEffect(() => {
    if (triggerFitAll && filteredProjects.length > 0) {
      if (filteredProjects.length === 1) {
        map.flyTo([filteredProjects[0].latitude, filteredProjects[0].longitude], 11, { duration: 1.2 });
      } else {
        const bounds = L.latLngBounds(filteredProjects.map(p => [p.latitude, p.longitude]));
        map.flyToBounds(bounds, {
          padding: [50, 50],
          maxZoom: 11,
          duration: 1.2
        });
      }
      onResetFitTrigger();
    }
  }, [triggerFitAll, filteredProjects, map, onResetFitTrigger]);

  return null;
}

// Custom Floating Map Controls UI (Zoom In, Zoom Out, Fit All)
function MapOverlayControls({ onFitAll }) {
  const map = useMap();

  return (
    <div className="leaflet-top leaflet-right" style={{ pointerEvents: 'auto', margin: '14px', zIndex: 1000 }}>
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/90 p-1.5 flex flex-col gap-1.5">
        <button
          type="button"
          title="Zoom In"
          onClick={() => map.zoomIn()}
          className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-bold flex items-center justify-center transition-all border border-slate-200/70 active:scale-95 shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          type="button"
          title="Zoom Out"
          onClick={() => map.zoomOut()}
          className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-bold flex items-center justify-center transition-all border border-slate-200/70 active:scale-95 shadow-xs cursor-pointer"
        >
          <Minus className="w-4 h-4" />
        </button>
        
        <div className="h-px bg-slate-200 my-0.5" />

        <button
          type="button"
          title="Fit All Sites in View"
          onClick={onFitAll}
          className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 flex items-center justify-center transition-all border border-slate-200/70 active:scale-95 shadow-xs cursor-pointer"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function MapComponent({ onSelectProjectQuote }) {
  const { t } = useLanguage();
  const [projects, setProjects] = useState(activeLocationsData);
  const [selectedState, setSelectedState] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileTab, setMobileTab] = useState('map');
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedDetailProject, setSelectedDetailProject] = useState(null);
  const [triggerFitAll, setTriggerFitAll] = useState(false);

  // References and timers for robust hover-card interactivity
  const markerRefs = useRef({});
  const hoverTimerRef = useRef(null);

  const handleMarkerMouseOver = (markerInstance) => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    // Close other open popups so only the active hovered card shows
    Object.values(markerRefs.current).forEach(m => {
      if (m && m !== markerInstance && m.isPopupOpen && m.isPopupOpen()) {
        m.closePopup();
      }
    });
    if (markerInstance) {
      markerInstance.openPopup();
    }
  };

  const handleMarkerMouseOut = (markerInstance) => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => {
      if (markerInstance) {
        markerInstance.closePopup();
      }
    }, 350);
  };

  const handleCardMouseEnter = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  };

  const handleCardMouseLeave = (markerInstance) => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => {
      if (markerInstance) {
        markerInstance.closePopup();
      }
    }, 350);
  };

  // Fetch from backend API if available, fallback cleanly to active 35 locations
  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch('/api/projects');
        const data = await res.json();
        if (data.success && Array.isArray(data.projects) && data.projects.length >= 35) {
          setProjects(data.projects);
        } else {
          setProjects(activeLocationsData);
        }
      } catch (err) {
        console.log('Using 35 active locations map data fallback:', err);
        setProjects(activeLocationsData);
      }
    }
    fetchProjects();
  }, []);

  // Dynamically compute states list with accurate project counts
  const statesList = useMemo(() => {
    const stateCounts = {};
    projects.forEach(p => {
      if (p.locationName) {
        const parts = p.locationName.split(',').map(s => s.trim());
        const stateName = parts[parts.length - 1];
        if (stateName) {
          stateCounts[stateName] = (stateCounts[stateName] || 0) + 1;
        }
      }
    });

    const preferredOrder = [
      'Tamil Nadu',
      'Karnataka',
      'Mizoram',
      'Assam',
      'Maharashtra',
      'Chhattisgarh',
      'Kerala',
      'Gujarat',
      'Odisha'
    ];
    const sortedDiscovered = Object.keys(stateCounts).sort((a, b) => {
      const idxA = preferredOrder.indexOf(a);
      const idxB = preferredOrder.indexOf(b);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.localeCompare(b);
    });

    const list = [{ name: 'All', count: projects.length }];
    sortedDiscovered.forEach(st => {
      list.push({ name: st, count: stateCounts[st] });
    });

    return list;
  }, [projects]);

  // Filtered projects by selected state and search query
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchesState = selectedState === 'All' || p.locationName.toLowerCase().includes(selectedState.toLowerCase());
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch = !query ||
        p.title.toLowerCase().includes(query) ||
        p.cropDrying.toLowerCase().includes(query) ||
        p.locationName.toLowerCase().includes(query) ||
        p.dryerType.toLowerCase().includes(query);
      return matchesState && matchesSearch;
    });
  }, [projects, selectedState, searchQuery]);

  // Handle user selecting a project from the sidebar list
  const handleSelectProjectFromList = (project) => {
    setSelectedProject(project);
    setMobileTab('map');
  };

  const handleFitAllClick = useCallback(() => {
    setSelectedProject(null);
    setTriggerFitAll(true);
  }, []);

  const handleResetFitTrigger = useCallback(() => {
    setTriggerFitAll(false);
  }, []);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-3 sm:p-5 space-y-4 w-full max-w-full overflow-hidden">
      
      {/* Top Filter & Control Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
        
        {/* State Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <span className="text-[11px] font-bold text-slate-500 mr-1 flex items-center shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5 mr-1 text-blue-700" /> {t('filterStateLabel')}
          </span>
          {statesList.map(st => (
            <button
              key={st.name}
              type="button"
              onClick={() => {
                setSelectedState(st.name);
                setSelectedProject(null);
              }}
              className={`text-[11px] px-3 py-1 rounded-xl font-bold transition-all shrink-0 flex items-center space-x-1.5 cursor-pointer ${
                selectedState === st.name 
                  ? 'bg-blue-700 text-white shadow-sm ring-2 ring-blue-300' 
                  : 'bg-white text-slate-700 hover:text-blue-900 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>{st.name}</span>
              <span className={`text-[9px] px-1.5 py-0.2 rounded-full ${
                selectedState === st.name ? 'bg-blue-900 text-blue-100' : 'bg-slate-100 text-slate-600'
              }`}>
                {st.count}
              </span>
            </button>
          ))}
        </div>

        {/* Mobile View Toggle */}
        <div className="flex lg:hidden items-center p-1 bg-slate-200 rounded-xl w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setMobileTab('map')}
            className={`flex-1 sm:flex-initial py-1.5 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center space-x-1 ${
              mobileTab === 'map' ? 'bg-blue-700 text-white shadow' : 'text-slate-700'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>{t('interactiveMapTab')}</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('list')}
            className={`flex-1 sm:flex-initial py-1.5 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center space-x-1 ${
              mobileTab === 'list' ? 'bg-blue-700 text-white shadow' : 'text-slate-700'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>{t('projectListTab')} ({filteredProjects.length})</span>
          </button>
        </div>

      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[520px] sm:h-[620px] w-full">
        
        {/* Left Sidebar Directory */}
        <div className={`lg:col-span-4 flex-col h-full bg-slate-50 rounded-2xl p-3 border border-slate-200 overflow-hidden ${mobileTab === 'list' ? 'flex' : 'hidden lg:flex'}`}>
          
          {/* Sidebar Header & Search */}
          <div className="mb-3 space-y-2 pb-2 border-b border-slate-200 shrink-0">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-blue-950 flex items-center">
                <MapPin className="w-4 h-4 text-green-700 mr-1.5" /> Installed Sites Directory
              </h3>
              <span className="text-[10px] font-mono font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded border border-blue-200">
                {filteredProjects.length} Sites
              </span>
            </div>

            {/* Instant Search Bar */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search crop, district, or capacity..."
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Scrollable Project Cards */}
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {filteredProjects.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs">
                No solar dryer installations match your search.
              </div>
            ) : (
              filteredProjects.map(proj => {
                const isSelected = (selectedProject?._id && selectedProject._id === proj._id) || selectedProject?.title === proj.title;
                return (
                  <div
                    key={proj._id || proj.title}
                    onClick={() => handleSelectProjectFromList(proj)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all group shadow-xs ${
                      isSelected
                        ? 'bg-blue-50/90 border-blue-500 ring-2 ring-blue-300'
                        : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-blue-400'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <h4 className={`text-xs font-bold transition-colors line-clamp-1 ${
                        isSelected ? 'text-blue-900' : 'text-slate-900 group-hover:text-blue-700'
                      }`}>
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
                      <span className="text-blue-700 font-semibold flex items-center line-clamp-1">
                        <Tag className="w-3 h-3 mr-1 shrink-0" /> {proj.cropDrying}
                      </span>
                      
                      <span className={`font-bold flex items-center text-[10px] ${
                        isSelected ? 'text-blue-800 font-extrabold' : 'text-slate-500 group-hover:text-blue-700'
                      }`}>
                        Focus Map <ArrowRight className="w-2.5 h-2.5 ml-1" />
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Map Viewport - Mouse scroll zoom ENABLED, Zero map movement on hover, Interactive Clickable Card */}
        <div 
          className={`lg:col-span-8 h-full rounded-2xl overflow-hidden relative border border-slate-200 ${
            mobileTab === 'map' ? 'block' : 'hidden lg:block'
          }`}
        >
          <MapContainer
            center={[14.5, 78.5]}
            zoom={6}
            minZoom={4}
            maxZoom={16}
            scrollWheelZoom={true}
            zoomControl={false}
            style={{ width: '100%', height: '100%' }}
          >
            {/* Controller for bounds fitting & smooth flyTo on sidebar click */}
            <MapController
              filteredProjects={filteredProjects}
              selectedProject={selectedProject}
              mobileTab={mobileTab}
              triggerFitAll={triggerFitAll}
              onResetFitTrigger={handleResetFitTrigger}
              markerRefs={markerRefs}
            />

            {/* Custom Floating Zoom & Fit Controls (Top-Right) */}
            <MapOverlayControls onFitAll={handleFitAllClick} />

            {/* Standard Leaflet Tiles */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Location Markers with Interactive Hover & Clickable Card */}
            {filteredProjects.map(p => {
              const isSelected = (selectedProject?._id && selectedProject._id === p._id) || selectedProject?.title === p.title;

              return (
                <Marker
                  key={p._id || p.title}
                  position={[p.latitude, p.longitude]}
                  icon={createCustomIcon(isSelected)}
                  ref={(el) => {
                    if (el) {
                      markerRefs.current[p._id || p.title] = el;
                    }
                  }}
                  eventHandlers={{
                    mouseover: (e) => {
                      handleMarkerMouseOver(e.target);
                    },
                    mouseout: (e) => {
                      handleMarkerMouseOut(e.target);
                    },
                    click: () => {
                      setSelectedDetailProject(p);
                    }
                  }}
                >
                  {/* Interactive Compact Details Card: Displays on hover, DOES NOT MOVE MAP */}
                  <Popup
                    autoPan={false}
                    closeButton={false}
                    closeOnClick={false}
                    offset={[0, -10]}
                    className="custom-leaflet-popup"
                  >
                    <div 
                      onMouseEnter={handleCardMouseEnter}
                      onMouseLeave={() => handleCardMouseLeave(markerRefs.current[p._id || p.title])}
                      className="p-2 w-52 space-y-1.5 text-slate-800 cursor-default"
                    >
                      {/* Compact Thumbnail Image (64px height) */}
                      {p.imageUrl && (
                        <div 
                          onClick={() => setSelectedDetailProject(p)}
                          className="relative rounded-md overflow-hidden h-16 bg-slate-100 border border-slate-200 cursor-pointer group"
                        >
                          <img
                            src={p.imageUrl}
                            alt={p.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            loading="lazy"
                          />
                          <span className="absolute top-1 right-1 text-[8px] font-bold bg-blue-700 text-white px-1.5 py-0.5 rounded shadow-2xs">
                            {p.capacity}
                          </span>
                        </div>
                      )}
                      
                      {/* Title & Location */}
                      <div onClick={() => setSelectedDetailProject(p)} className="cursor-pointer space-y-0.5">
                        <div className="text-[8.5px] uppercase font-extrabold text-blue-700 tracking-wider leading-none">
                          {p.dryerType}
                        </div>
                        <h4 className="text-[11px] font-bold text-slate-900 leading-snug line-clamp-1 hover:text-blue-700 transition-colors">
                          {p.title}
                        </h4>
                        <p className="text-[9.5px] text-slate-500 flex items-center">
                          <MapPin className="w-2.5 h-2.5 text-green-600 mr-1 shrink-0" /> {p.locationName}
                        </p>
                      </div>

                      {/* 1-Line Description */}
                      <p className="text-[9px] text-slate-500 italic line-clamp-1 leading-tight">
                        {p.description}
                      </p>

                      {/* Compact Action Button */}
                      <div className="pt-1 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelectedDetailProject(p);
                          }}
                          className="w-full text-[9.5px] font-bold text-white bg-blue-700 hover:bg-blue-800 py-1 px-2 rounded-md shadow-2xs text-center flex items-center justify-center space-x-1 transition-colors cursor-pointer active:scale-98"
                        >
                          <Info className="w-2.5 h-2.5" />
                          <span>View Case Study & Video</span>
                        </button>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
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
