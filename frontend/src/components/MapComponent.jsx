import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, useMap } from 'react-leaflet';
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
  Play,
  Layers,
  Compass
} from 'lucide-react';
import { sampleProjects } from '../data/sampleData';
import { activeLocationsData } from '../data/mapLocationsData';
import indiaGeoJson from '../data/india_states.json';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

// Official India Geographic Bounding Box (Southwest to Northeast)
const INDIA_BOUNDS = [
  [7.0, 68.0],   // Southwest corner (Kanyakumari / Lakshadweep)
  [36.5, 97.5]   // Northeast corner (Kashmir / Ladakh to Arunachal Pradesh)
];

// Extra padding so markers never sit under the floating overlays
// (top: 54px-tall pins + mode switcher; right: zoom controls; bottom: Survey of India badge)
const MARKER_FIT_PADDING = {
  paddingTopLeft: [28, 66],
  paddingBottomRight: [56, 52]
};

// Fit the map to every visible marker (falls back to the whole of India when there are none)
const fitMapToProjects = (map, projects, animate = false) => {
  const points = (projects || [])
    .filter(p => Number.isFinite(p.latitude) && Number.isFinite(p.longitude))
    .map(p => [p.latitude, p.longitude]);

  if (points.length === 0) {
    map.fitBounds(INDIA_BOUNDS, { padding: [20, 20], maxZoom: 6 });
    return;
  }
  if (points.length === 1) {
    if (animate) map.flyTo(points[0], 11, { duration: 1.2 });
    else map.setView(points[0], 11);
    return;
  }
  const bounds = L.latLngBounds(points);
  if (!bounds.isValid()) return;
  if (animate) map.flyToBounds(bounds, { ...MARKER_FIT_PADDING, maxZoom: 11, duration: 1.2 });
  else map.fitBounds(bounds, { ...MARKER_FIT_PADDING, maxZoom: 11 });
};

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
  const latestProjectsRef = useRef(filteredProjects);
  latestProjectsRef.current = filteredProjects;

  // On mount (and when the mobile map tab becomes visible again) fit the view to all markers
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
      const list = latestProjectsRef.current || [];
      prevFilterKeyRef.current = list.map(p => p._id || p.title).sort().join(',');
      fitMapToProjects(map, list, false);
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
      // First render: the mount effect above performs the initial (non-animated) fit
      const isInitial = prevFilterKeyRef.current === '';
      prevFilterKeyRef.current = filterKey;
      if (isInitial) return;

      fitMapToProjects(map, filteredProjects, true);
    }
  }, [filteredProjects, map]);

  // Manual trigger to fit all visible markers
  useEffect(() => {
    if (triggerFitAll && filteredProjects.length > 0) {
      fitMapToProjects(map, filteredProjects, true);
      onResetFitTrigger();
    }
  }, [triggerFitAll, filteredProjects, map, onResetFitTrigger]);

  return null;
}

// Custom Floating Map Controls UI (Google Maps Style Selector, Zoom In, Zoom Out, Fit All)
function MapOverlayControls({ onFitAll, mapMode, setMapMode }) {
  const map = useMap();
  const { t } = useLanguage();

  return (
    <>
      {/* Top Left: Google Maps India Badge */}
      <div className="leaflet-top leaflet-left hidden sm:block" style={{ pointerEvents: 'auto', margin: '12px', zIndex: 1000 }}>
        <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-md border border-slate-200 px-3 py-1.5 flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#23AC39] animate-pulse" />
          <span className="text-xs font-black text-[#123B92] tracking-wide whitespace-nowrap">
            Google Maps • India
          </span>
        </div>
      </div>

      {/* Top Right: Layer Switcher & Zoom Controls */}
      <div className="leaflet-top leaflet-right" style={{ pointerEvents: 'auto', margin: '12px', zIndex: 1000 }}>
        <div className="flex flex-col items-end gap-2">
          {/* Mode Switcher Pills (Google Style) */}
          <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-slate-200 p-1 flex items-center space-x-1">
            <button
              type="button"
              onClick={() => setMapMode('streets')}
              className={`px-3 py-1 text-xs font-black rounded-lg transition-all cursor-pointer ${
                mapMode === 'streets'
                  ? 'bg-[#002DC2] text-white shadow-sm'
                  : 'text-slate-700 hover:text-[#002DC2] hover:bg-slate-100'
              }`}
            >
              {t('common_map_modeMap')}
            </button>
            <button
              type="button"
              onClick={() => setMapMode('satellite')}
              className={`px-3 py-1 text-xs font-black rounded-lg transition-all cursor-pointer ${
                mapMode === 'satellite'
                  ? 'bg-[#002DC2] text-white shadow-sm'
                  : 'text-slate-700 hover:text-[#002DC2] hover:bg-slate-100'
              }`}
            >
              {t('common_map_modeSatellite')}
            </button>
            <button
              type="button"
              onClick={() => setMapMode('terrain')}
              className={`px-3 py-1 text-xs font-black rounded-lg transition-all cursor-pointer ${
                mapMode === 'terrain'
                  ? 'bg-[#002DC2] text-white shadow-sm'
                  : 'text-slate-700 hover:text-[#002DC2] hover:bg-slate-100'
              }`}
            >
              {t('common_map_modeTerrain')}
            </button>
          </div>

          {/* Zoom & Fit Controls */}
          <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-slate-200 p-1 flex flex-col gap-1">
            <button
              type="button"
              title={t('common_map_zoomIn')}
              onClick={() => map.zoomIn()}
              className="w-8 h-8 rounded-lg bg-white hover:bg-[#F0F4FD] text-[#123B92] hover:text-[#002DC2] flex items-center justify-center transition-all border border-slate-200 active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              type="button"
              title={t('common_map_zoomOut')}
              onClick={() => map.zoomOut()}
              className="w-8 h-8 rounded-lg bg-white hover:bg-[#F0F4FD] text-[#123B92] hover:text-[#002DC2] flex items-center justify-center transition-all border border-slate-200 active:scale-95 cursor-pointer"
            >
              <Minus className="w-4 h-4" />
            </button>
            <button
              type="button"
              title={t('common_map_fitAll')}
              onClick={onFitAll}
              className="w-8 h-8 rounded-lg bg-white hover:bg-[#F0F4FD] text-[#123B92] hover:text-[#002DC2] flex items-center justify-center transition-all border border-slate-200 active:scale-95 cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default function MapComponent({ onSelectProjectQuote }) {
  const { t, lang } = useLanguage();
  const [projects, setProjects] = useState(activeLocationsData);
  const [selectedState, setSelectedState] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileTab, setMobileTab] = useState('map');
  const [selectedProject, setSelectedProject] = useState(null);
  const navigate = useNavigate();
  // Clicking a site opens its own page (/installations/:id) instead of a popup
  const openInstallation = (p) => navigate(`/installations/${encodeURIComponent(p._id || p.title)}`);
  const [triggerFitAll, setTriggerFitAll] = useState(false);
  const [mapMode, setMapMode] = useState('streets'); // 'streets' | 'satellite' | 'terrain'

  // References and timers for robust hover-card interactivity
  const markerRefs = useRef({});
  const hoverTimerRef = useRef(null);

  // Get count of installations for a state name
  const getStateCount = useCallback((stName) => {
    if (!stName) return 0;
    return projects.filter(p => {
      if (p.state && p.state.toLowerCase() === stName.toLowerCase()) return true;
      if (p.locationName && p.locationName.toLowerCase().includes(stName.toLowerCase())) return true;
      return false;
    }).length;
  }, [projects]);

  // Dynamic GeoJSON styling for India States on Google Maps
  const getStateStyle = useCallback((feature) => {
    const stName = feature.properties.ST_NM;
    const isSelected = selectedState !== 'All' && stName.toLowerCase() === selectedState.toLowerCase();
    const count = getStateCount(stName);

    if (mapMode === 'satellite') {
      return {
        fillColor: isSelected ? '#002DC2' : (count > 0 ? '#38BDF8' : 'transparent'),
        fillOpacity: isSelected ? 0.35 : (count > 0 ? 0.12 : 0),
        weight: isSelected ? 3 : (count > 0 ? 1.8 : 1),
        color: isSelected ? '#23AC39' : (count > 0 ? '#38BDF8' : 'rgba(255, 255, 255, 0.4)'),
        opacity: 0.85,
        dashArray: isSelected ? '' : (count > 0 ? '' : '3, 4')
      };
    }

    // Google Maps Roadmap & Terrain: Keep Google Maps 100% visible, highlight active state boundaries
    return {
      fillColor: isSelected 
        ? '#002DC2' 
        : count > 0 
          ? '#002DC2' 
          : 'transparent',
      fillOpacity: isSelected ? 0.20 : (count > 0 ? 0.05 : 0),
      weight: isSelected ? 2.5 : (count > 0 ? 1.8 : 1.2),
      color: isSelected ? '#002DC2' : (count > 0 ? '#123B92' : 'rgba(100, 116, 139, 0.4)'),
      opacity: 0.85,
      dashArray: isSelected ? '' : (count > 0 ? '' : '2, 3')
    };
  }, [selectedState, mapMode, getStateCount]);

  // On Each Feature for tooltips and state click
  const onEachStateFeature = useCallback((feature, layer) => {
    const stName = feature.properties.ST_NM;
    const count = getStateCount(stName);

    layer.bindTooltip(
      `<div class="text-center font-sans py-0.5">
         <div class="font-black text-xs text-white">${stName}</div>
         <div class="text-xs font-bold ${count > 0 ? 'text-[#38BDF8]' : 'text-slate-300'}">
           ${count > 0 ? (count > 1 ? t('common_map_activeMany', { count }) : t('common_map_activeOne')) : t('common_map_territory')}
         </div>
       </div>`,
      { sticky: true, className: 'zenitek-state-tooltip', direction: 'auto' }
    );

    layer.on({
      click: () => {
        if (count > 0) {
          setSelectedState(stName);
          setSelectedProject(null);
        }
      }
    });
  }, [getStateCount, setSelectedState, lang]); // eslint-disable-line react-hooks/exhaustive-deps

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
    <div className="bg-white rounded-3xl border-2 border-[#123B92]/30 shadow-xl p-3 sm:p-5 space-y-4 w-full max-w-full overflow-hidden">
      
      {/* Top Filter & Control Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[#F0F4FD] p-3.5 rounded-2xl border border-[#123B92]/20">
        
        {/* State Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 overflow-x-auto pb-1 md:pb-0">
          <span className="text-sm sm:text-base font-black text-[#123B92] mr-1 flex items-center shrink-0">
            <SlidersHorizontal className="w-[18px] h-[18px] mr-1.5 text-[#002DC2]" /> {t('filterStateLabel')}
          </span>
          {statesList.map(st => (
            <button
              key={st.name}
              type="button"
              onClick={() => {
                setSelectedState(st.name);
                setSelectedProject(null);
              }}
              className={`text-sm sm:text-base px-4 py-2 rounded-xl font-bold transition-all shrink-0 flex items-center space-x-2 cursor-pointer ${
                selectedState === st.name 
                  ? 'bg-[#002DC2] text-white shadow-sm ring-2 ring-[#23AC39]' 
                  : 'bg-white text-[#123B92] hover:text-[#002DC2] hover:bg-[#F0F4FD] border border-[#123B92]/20'
              }`}
            >
              <span>{st.name === 'All' ? t('common_map_all') : st.name}</span>
              <span className={`text-xs sm:text-sm px-2.5 py-0.5 rounded-full font-black ${
                selectedState === st.name ? 'bg-[#123B92] text-white' : 'bg-[#F0F4FD] text-[#123B92]'
              }`}>
                {st.count}
              </span>
            </button>
          ))}
        </div>

        {/* Mobile View Toggle */}
        <div className="flex lg:hidden items-center p-1 bg-[#123B92]/10 rounded-xl w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setMobileTab('map')}
            className={`flex-1 sm:flex-initial py-2.5 px-2 sm:px-4 text-sm sm:text-base font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap ${
              mobileTab === 'map' ? 'bg-[#002DC2] text-white shadow' : 'text-slate-800'
            }`}
          >
            <MapPin className="hidden min-[400px]:block w-4 h-4 shrink-0" />
            <span>{t('interactiveMapTab')}</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('list')}
            className={`flex-1 sm:flex-initial py-2.5 px-2 sm:px-4 text-sm sm:text-base font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap ${
              mobileTab === 'list' ? 'bg-[#002DC2] text-white shadow' : 'text-slate-800'
            }`}
          >
            <Tag className="hidden min-[400px]:block w-4 h-4 shrink-0" />
            <span>{t('projectListTab')} ({filteredProjects.length})</span>
          </button>
        </div>

      </div>

      {/* Main Workspace Layout - Full Width on Laptop, Mobile Switchable */}
      <div className="w-full h-[460px] sm:h-[500px] lg:h-[540px] relative">
        
        {/* Mobile-Only Sites Directory (Shows only when mobileTab is 'list' on mobile screens) */}
        <div className={`w-full flex-col h-full bg-[#F0F4FD] rounded-2xl p-3.5 sm:p-[18px] border border-[#123B92]/20 overflow-hidden lg:hidden ${mobileTab === 'list' ? 'flex' : 'hidden'}`}>
          
          {/* Sidebar Header & Search */}
          <div className="mb-3.5 space-y-3 pb-3 border-b border-[#123B92]/20 shrink-0">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-[#123B92] flex items-center">
                <MapPin className="w-5 h-5 text-[#002DC2] mr-1.5 shrink-0" /> {t('common_map_directory')}
              </h3>
              <span className="text-xs sm:text-sm font-mono font-black text-white bg-[#123B92] px-3 py-1 rounded-lg border border-[#123B92]">
                {t('common_map_sites', { count: filteredProjects.length })}
              </span>
            </div>

            {/* Instant Search Bar */}
            <div className="relative">
              <Search className="w-[18px] h-[18px] text-black/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('common_map_searchPh')}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#123B92]/30 rounded-xl text-sm sm:text-base text-black placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-[#002DC2] focus:border-transparent transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs sm:text-sm font-bold text-black/60 hover:text-black cursor-pointer"
                >
                  {t('common_map_clear')}
                </button>
              )}
            </div>
          </div>

          {/* Scrollable Project Cards */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {filteredProjects.length === 0 ? (
              <div className="p-6 text-center text-black/60 text-sm sm:text-base font-medium">
                {t('common_map_empty')}
              </div>
            ) : (
              filteredProjects.map(proj => {
                const isSelected = (selectedProject?._id && selectedProject._id === proj._id) || selectedProject?.title === proj.title;
                return (
                  <div
                    key={proj._id || proj.title}
                    onClick={() => handleSelectProjectFromList(proj)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all group shadow-sm ${
                      isSelected
                        ? 'bg-white border-[#002DC2] ring-2 ring-[#23AC39]'
                        : 'bg-white hover:bg-white border-[#123B92]/20 hover:border-[#002DC2]'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <h4 className={`text-lg font-black transition-colors line-clamp-1 leading-snug ${ isSelected ? 'text-[#002DC2]' : 'text-[#123B92] group-hover:text-[#002DC2]' }`}>
                        {proj.title}
                      </h4>
                      <span className="text-xs sm:text-sm font-black text-white bg-[#23AC39] px-2.5 py-1 rounded-md border border-[#23AC39] shrink-0">
                        {proj.capacity}
                      </span>
                    </div>

                    <p className="text-sm sm:text-base text-slate-700 font-semibold mt-2 flex items-center">
                      <MapPin className="w-4 h-4 text-[#002DC2] mr-1.5 shrink-0" /> {proj.locationName}
                    </p>

                    <div className="mt-3 flex items-center justify-between text-sm sm:text-base">
                      <span className="text-[#002DC2] font-bold flex items-center line-clamp-1">
                        <Tag className="w-4 h-4 mr-1.5 shrink-0" /> {proj.cropDrying}
                      </span>
                      
                      <span className={`font-black flex items-center text-xs sm:text-sm shrink-0 ml-2 ${
                        isSelected ? 'text-[#002DC2]' : 'text-slate-600 group-hover:text-[#002DC2]'
                      }`}>
                        {t('common_map_focus')} <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Map Viewport - New Dedicated India Map (Full Width on Laptop, Toggleable on Mobile) */}
        <div 
          className={`w-full h-full rounded-2xl overflow-hidden relative border-2 border-[#123B92]/30 ${
            mobileTab === 'map' ? 'block' : 'hidden lg:block'
          }`}
        >
          <MapContainer
            center={[22.5, 80.0]}
            zoom={4.8}
            minZoom={3.5}
            zoomSnap={0.25}
            zoomDelta={0.5}
            maxZoom={18}
            maxBounds={[[6.0, 68.0], [37.5, 97.5]]}
            maxBoundsViscosity={1.0}
            scrollWheelZoom={true}
            zoomControl={false}
            className="india-google-map-viewport"
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

            {/* Custom Floating Zoom, Fit & Google Map Controls */}
            <MapOverlayControls 
              onFitAll={handleFitAllClick}
              mapMode={mapMode}
              setMapMode={setMapMode}
            />

            {/* Official Google Maps Tile Layer */}
            <TileLayer
              key={mapMode}
              attribution='&copy; <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer">Google Maps</a>'
              url={
                mapMode === 'satellite'
                  ? 'https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}'
                  : mapMode === 'terrain'
                    ? 'https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}'
                    : 'https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}'
              }
              subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
              maxZoom={19}
            />

            {/* Dedicated Official India States Vector Boundary Layer */}
            <GeoJSON
              key={`${selectedState}-${mapMode}-${lang}`}
              data={indiaGeoJson}
              style={getStateStyle}
              onEachFeature={onEachStateFeature}
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
                      openInstallation(p);
                    }
                  }}
                >
                  {/* Interactive Details Card: Displays on hover, Clean & Focused */}
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
                      className="p-3 w-72 space-y-2.5 text-slate-900 cursor-default bg-white rounded-xl shadow-lg"
                    >
                      {/* Compact Thumbnail Image */}
                      {p.imageUrl && (
                        <div 
                          onClick={() => openInstallation(p)}
                          className="relative rounded-lg overflow-hidden h-28 bg-slate-900 border border-slate-200 cursor-pointer group shrink-0"
                        >
                          <img
                            src={p.imageUrl}
                            alt={p.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            loading="lazy"
                          />
                        </div>
                      )}
                      
                      {/* Details: Model Name, Title, Place */}
                      <div onClick={() => openInstallation(p)} className="cursor-pointer space-y-1.5 min-w-0">
                        {/* Model Name */}
                        <div className="text-xs sm:text-sm font-black uppercase text-[#002DC2] tracking-wider truncate">
                          {p.dryerType}
                        </div>

                        {/* Project Title (e.g. Kusumdhara Floral Solar Dryer) */}
                        <h4 className="text-lg font-black text-[#123B92] leading-snug line-clamp-2 hover:text-[#002DC2] transition-colors">
                          {p.title}
                        </h4>

                        {/* Place */}
                        <p className="text-sm font-bold text-slate-700 flex items-center truncate">
                          <MapPin className="w-3.5 h-3.5 text-[#002DC2] mr-1 shrink-0" />
                          <span className="truncate">{p.locationName || `${p.town}, ${p.state}`}</span>
                        </p>
                      </div>

                      {/* Action Button: View More Details */}
                      <div className="pt-2 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            openInstallation(p);
                          }}
                          className="w-full text-xs sm:text-sm font-black text-white bg-[#23AC39] hover:bg-[#002DC2] py-2.5 px-3 rounded-lg shadow-sm text-center flex items-center justify-center space-x-1.5 transition-colors cursor-pointer active:scale-[0.98]"
                        >
                          <Info className="w-4 h-4" />
                          <span>{t('common_map_viewDetails')}</span>
                        </button>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>

          {/* Ocean Watermarks */}
          {mapMode === 'vector' && (
            <>
              <div className="absolute left-6 bottom-28 pointer-events-none select-none text-xs sm:text-sm font-black tracking-widest text-[#123B92]/25 uppercase z-[400]">
                Arabian Sea
              </div>
              <div className="absolute right-6 bottom-32 pointer-events-none select-none text-xs sm:text-sm font-black tracking-widest text-[#123B92]/25 uppercase z-[400]">
                Bay of Bengal
              </div>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none select-none text-xs sm:text-sm font-black tracking-widest text-[#123B92]/25 uppercase z-[400]">
                Indian Ocean
              </div>
            </>
          )}

          {/* Official Survey of India Badge */}
          <div className="absolute bottom-3 left-3 z-[500] pointer-events-none select-none bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-[#123B92]/25 shadow-md flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#23AC39] animate-pulse" />
            <span className="text-xs sm:text-xs font-black text-[#123B92] tracking-wide">
              <span className="hidden sm:inline">{t('common_map_surveyBadge')} • </span>{t('common_map_activeSites', { count: 35 })}
            </span>
          </div>
        </div>

      </div>


    </div>
  );
}
