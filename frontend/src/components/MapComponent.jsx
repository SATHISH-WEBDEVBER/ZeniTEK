import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, AttributionControl, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import {
  MapPin, ArrowRight, SlidersHorizontal, Plus, Minus, Maximize2, Search, List, Wheat, Eye,
  Satellite, Mountain, Map as MapIcon, Gauge, CalendarDays, MousePointerClick
} from 'lucide-react';
import { activeLocationsData } from '../data/mapLocationsData';
import { useLanguage } from '../context/LanguageContext';
import { API_BASE } from '../utils/api';
import { Link } from 'react-router-dom';

// Official India Geographic Bounding Box (Southwest to Northeast)
const INDIA_BOUNDS = [
  [7.0, 68.0],   // Southwest corner (Kanyakumari / Lakshadweep)
  [36.5, 97.5]   // Northeast corner (Kashmir / Ladakh to Arunachal Pradesh)
];

// Loose panning limit around India: wide enough that a details card can always be
// auto-panned into view (even at the minimum zoom on phones)
const PAN_BOUNDS = [[-25.0, 30.0], [60.0, 130.0]];

const MAP_MAX_ZOOM = 18;

// Free base layers (no API key). Satellite is the default.
const BASE_LAYERS = {
  satellite: {
    labelKey: 'common_map_modeSatellite',
    Icon: Satellite,
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Imagery &copy; <a href="https://www.esri.com" target="_blank" rel="noopener noreferrer">Esri</a>, Maxar, Earthstar Geographics',
    maxNativeZoom: 18,
    // Place-name labels on top of the imagery
    overlay: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
      maxNativeZoom: 18
    }
  },
  terrain: {
    labelKey: 'common_map_modeTerrain',
    Icon: Mountain,
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    subdomains: ['a', 'b', 'c'],
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors, SRTM | Style &copy; <a href="https://opentopomap.org" target="_blank" rel="noopener noreferrer">OpenTopoMap</a> (CC-BY-SA)',
    maxNativeZoom: 17
  },
  standard: {
    labelKey: 'common_map_modeMap',
    Icon: MapIcon,
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    subdomains: ['a', 'b', 'c'],
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
    maxNativeZoom: 19
  }
};
const LAYER_ORDER = ['satellite', 'terrain', 'standard'];

// Extra padding so markers never sit under the floating overlays
// (top-left: layer switcher; right: zoom controls; bottom: sites badge / attribution)
const MARKER_FIT_PADDING = {
  paddingTopLeft: [28, 72],
  paddingBottomRight: [64, 44]
};

const projectKey = (p) => p._id || p.title;

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

// Custom ZeniTEK Map Pin Marker (teardrop badge with ZeniTEK emblem).
// Built once per state so markers are not re-created on every render.
const buildPinIcon = (isSelected) => L.divIcon({
  className: 'zenitek-custom-marker',
  html: `
    <div class="zenitek-map-pin-root ${isSelected ? 'is-selected' : ''}">
      <div class="zenitek-pin-pulse"></div>
      <div class="zenitek-pin-body">
        <div class="zenitek-pin-emblem-wrap">
          <img src="/emblem.png" alt="" class="zenitek-pin-emblem-img" draggable="false" />
        </div>
      </div>
      <div class="zenitek-pin-tip"></div>
    </div>
  `,
  iconSize: [44, 54],
  iconAnchor: [22, 54],
  popupAnchor: [0, -54],
  tooltipAnchor: [0, -54]
});
const PIN_ICON = buildPinIcon(false);
const PIN_ICON_SELECTED = buildPinIcon(true);

// True on devices with a real hover-capable pointer (mouse / trackpad)
function useCanHover() {
  const query = '(hover: hover) and (pointer: fine)';
  const [canHover, setCanHover] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(query).matches : true
  );
  useEffect(() => {
    if (!window.matchMedia) return undefined;
    const mq = window.matchMedia(query);
    const onChange = (e) => setCanHover(e.matches);
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else mq.addListener(onChange);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', onChange);
      else mq.removeListener(onChange);
    };
  }, []);
  return canHover;
}

// Stop clicks / double-clicks / wheel on floating controls from reaching the map
function useLeafletControlGuard() {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) {
      L.DomEvent.disableClickPropagation(ref.current);
      L.DomEvent.disableScrollPropagation(ref.current);
    }
  }, []);
  return ref;
}

// Location details shared by the desktop hover tooltip and the click / tap popup
function SiteDetails({ p, t, compact = false, closeGap = false }) {
  const year = p.year || p.installedYear || p.installationYear;
  return (
    <div className="space-y-1.5 min-w-0">
      {p.dryerType && (
        <div className={`text-xs font-black uppercase text-[#002DC2] tracking-wider truncate ${closeGap ? 'pr-9' : ''}`}>
          {p.dryerType}
        </div>
      )}
      <h4 className={`${compact ? 'text-base' : 'text-lg'} font-black text-[#123B92] leading-snug line-clamp-2 break-words`}>
        {p.title}
      </h4>
      <p className="text-sm font-bold text-slate-700 flex items-start gap-1.5 min-w-0">
        <MapPin className="w-4 h-4 text-[#002DC2] mt-0.5 shrink-0" />
        <span className="break-words min-w-0">{p.locationName || [p.town, p.state].filter(Boolean).join(', ')}</span>
      </p>
      {p.cropDrying && (
        <p className="text-sm text-slate-700 flex items-start gap-1.5 min-w-0">
          <Wheat className="w-4 h-4 text-[#1A822B] mt-0.5 shrink-0" />
          <span className="min-w-0 break-words">
            <span className="font-bold text-slate-900">{t('common_map_crop')}:</span> {p.cropDrying}
          </span>
        </p>
      )}
      {p.capacity && (
        <p className="text-sm text-slate-700 flex items-start gap-1.5 min-w-0">
          <Gauge className="w-4 h-4 text-[#1A822B] mt-0.5 shrink-0" />
          <span className="min-w-0 break-words">
            <span className="font-bold text-slate-900">{t('common_map_capacity')}:</span> {p.capacity}
          </span>
        </p>
      )}
      {year && (
        <p className="text-sm text-slate-700 flex items-start gap-1.5 min-w-0">
          <CalendarDays className="w-4 h-4 text-[#1A822B] mt-0.5 shrink-0" />
          <span><span className="font-bold text-slate-900">{t('common_map_year')}:</span> {year}</span>
        </p>
      )}
    </div>
  );
}

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
  const selectedRef = useRef(selectedProject);
  selectedRef.current = selectedProject;

  // On mount (and when the mobile map tab becomes visible again) fit the view to all
  // markers - unless a site was just picked from the list, which the effect below handles
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
      const list = latestProjectsRef.current || [];
      prevFilterKeyRef.current = list.map(projectKey).sort().join(',');
      if (!selectedRef.current) fitMapToProjects(map, list, false);
    }, 150);
    return () => clearTimeout(timer);
  }, [map, mobileTab]);

  // Keep tiles sized correctly when the container is resized (rotation, breakpoints)
  useEffect(() => {
    const el = map.getContainer();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(() => map.invalidateSize({ pan: false }));
    ro.observe(el);
    return () => ro.disconnect();
  }, [map]);

  // Smoothly center ONLY when user explicitly picks a site from the list, then open its card.
  // Runs after a short delay so the (previously hidden) mobile map has its real size.
  useEffect(() => {
    if (!selectedProject) return undefined;
    let openIt = null;
    const timer = setTimeout(() => {
      map.invalidateSize();
      openIt = () => {
        const marker = markerRefs.current[projectKey(selectedProject)];
        if (marker) marker.openPopup();
      };
      map.once('moveend', openIt);
      map.flyTo([selectedProject.latitude, selectedProject.longitude], Math.max(map.getZoom(), 11), { duration: 1.2 });
    }, 200);
    return () => {
      clearTimeout(timer);
      if (openIt) map.off('moveend', openIt);
    };
  }, [selectedProject, map, markerRefs]);

  // Auto-fit bounds when state filter changes
  useEffect(() => {
    if (filteredProjects && filteredProjects.length > 0) {
      const filterKey = filteredProjects.map(projectKey).sort().join(',');
      if (filterKey === prevFilterKeyRef.current) return;
      // First render: the mount effect above performs the initial (non-animated) fit
      const isInitial = prevFilterKeyRef.current === '';
      prevFilterKeyRef.current = filterKey;
      if (isInitial) return;
      map.closePopup();
      fitMapToProjects(map, filteredProjects, true);
    }
  }, [filteredProjects, map]);

  // Manual trigger to fit all visible markers
  useEffect(() => {
    if (triggerFitAll && filteredProjects.length > 0) {
      map.closePopup();
      fitMapToProjects(map, filteredProjects, true);
      onResetFitTrigger();
    }
  }, [triggerFitAll, filteredProjects, map, onResetFitTrigger]);

  return null;
}

// Page-scroll friendly wheel zoom: the wheel zooms the map only after the user
// clicks / taps into it, and is released again when the pointer leaves the map.
function ScrollWheelGuard({ onBlockedWheel }) {
  const map = useMap();
  useEffect(() => {
    const el = map.getContainer();
    map.scrollWheelZoom.disable();
    const enable = () => { if (!map.scrollWheelZoom.enabled()) map.scrollWheelZoom.enable(); };
    const disable = () => { if (map.scrollWheelZoom.enabled()) map.scrollWheelZoom.disable(); };
    const onWheel = () => { if (!map.scrollWheelZoom.enabled()) onBlockedWheel(); };
    map.on('mousedown focus', enable);
    el.addEventListener('mouseleave', disable);
    el.addEventListener('wheel', onWheel, { passive: true });
    return () => {
      map.off('mousedown focus', enable);
      el.removeEventListener('mouseleave', disable);
      el.removeEventListener('wheel', onWheel);
    };
  }, [map, onBlockedWheel]);
  return null;
}

// Floating layer switcher (top-left): Satellite / Terrain / Standard map
function LayerSwitcher({ mapMode, setMapMode }) {
  const { t } = useLanguage();
  const ref = useLeafletControlGuard();
  return (
    <div className="leaflet-top leaflet-left" style={{ pointerEvents: 'auto', margin: '10px', zIndex: 1000 }}>
      <div
        ref={ref}
        role="radiogroup"
        aria-label={t('common_map_layers')}
        className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-slate-200 p-1 flex items-center gap-1"
      >
        {LAYER_ORDER.map(key => {
          const { Icon, labelKey } = BASE_LAYERS[key];
          const active = mapMode === key;
          return (
            <button
              key={key}
              type="button"
              role="radio"
              aria-checked={active}
              aria-label={t(labelKey)}
              title={t(labelKey)}
              onClick={() => setMapMode(key)}
              className={`h-10 min-w-[40px] px-2.5 rounded-lg text-xs sm:text-sm font-black flex items-center justify-center gap-1.5 transition-colors cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#23AC39] ${
                active
                  ? 'bg-[#002DC2] text-white shadow-sm'
                  : 'text-[#123B92] hover:bg-[#F0F4FD] hover:text-[#002DC2]'
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className={active ? 'inline whitespace-nowrap' : 'hidden sm:inline whitespace-nowrap'}>{t(labelKey)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Floating zoom in / zoom out / fit-all controls (top-right)
function ZoomControls({ onFitAll }) {
  const map = useMap();
  const { t } = useLanguage();
  const ref = useLeafletControlGuard();
  const [zoom, setZoom] = useState(() => map.getZoom());
  useMapEvents({ zoomend: () => setZoom(map.getZoom()) });

  const btn = 'w-10 h-10 rounded-lg bg-white text-[#123B92] hover:bg-[#F0F4FD] hover:text-[#002DC2] flex items-center justify-center transition-all active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-[#23AC39]';

  return (
    <div className="leaflet-top leaflet-right" style={{ pointerEvents: 'auto', margin: '10px', zIndex: 1000 }}>
      <div ref={ref} className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-slate-200 p-1 flex flex-col gap-1">
        <button
          type="button"
          title={t('common_map_zoomIn')}
          aria-label={t('common_map_zoomIn')}
          disabled={zoom >= map.getMaxZoom()}
          onClick={() => map.zoomIn(1)}
          className={btn}
        >
          <Plus className="w-6 h-6" />
        </button>
        <button
          type="button"
          title={t('common_map_zoomOut')}
          aria-label={t('common_map_zoomOut')}
          disabled={zoom <= map.getMinZoom()}
          onClick={() => map.zoomOut(1)}
          className={btn}
        >
          <Minus className="w-6 h-6" />
        </button>
        <div className="h-px bg-slate-200 mx-1" />
        <button
          type="button"
          title={t('common_map_fitAll')}
          aria-label={t('common_map_fitAll')}
          onClick={onFitAll}
          className={btn}
        >
          <Maximize2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default function MapComponent({ onSelectProjectQuote }) { // eslint-disable-line no-unused-vars
  const { t } = useLanguage();
  const canHover = useCanHover();
  const [projects, setProjects] = useState(activeLocationsData);
  const [selectedState, setSelectedState] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileTab, setMobileTab] = useState('map');
  const [selectedProject, setSelectedProject] = useState(null);
  const [triggerFitAll, setTriggerFitAll] = useState(false);
  const [mapMode, setMapMode] = useState('satellite'); // 'satellite' | 'terrain' | 'standard'
  const [showScrollHint, setShowScrollHint] = useState(false);
  const scrollHintTimer = useRef(null);
  const markerRefs = useRef({});

  const handleBlockedWheel = useCallback(() => {
    setShowScrollHint(true);
    clearTimeout(scrollHintTimer.current);
    scrollHintTimer.current = setTimeout(() => setShowScrollHint(false), 1600);
  }, []);
  useEffect(() => () => clearTimeout(scrollHintTimer.current), []);

  // Fetch from backend API if available, fallback cleanly to active 35 locations
  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch(`${API_BASE}/projects`);
        const data = await res.json();
        if (data.success && Array.isArray(data.projects) && data.projects.length >= 35) {
          setProjects(data.projects);
        } else {
          setProjects(activeLocationsData);
        }
      } catch (err) {
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
    const query = searchQuery.trim().toLowerCase();
    const has = (v) => (v || '').toLowerCase().includes(query);
    return projects.filter(p => {
      const matchesState = selectedState === 'All' || (p.locationName || '').toLowerCase().includes(selectedState.toLowerCase());
      const matchesSearch = !query || has(p.title) || has(p.cropDrying) || has(p.locationName) || has(p.dryerType) || has(p.capacity);
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

  const layer = BASE_LAYERS[mapMode];

  return (
    <div className="bg-white rounded-3xl border-2 border-[#123B92]/30 shadow-xl p-3 sm:p-5 space-y-4 w-full max-w-full overflow-hidden">
      
      {/* Top Filter & Control Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[#F0F4FD] p-3.5 rounded-2xl border border-[#123B92]/20">
        
        {/* State Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 overflow-x-auto pb-1 md:pb-0">
          <span className="text-sm sm:text-base font-black text-[#123B92] mr-1 flex items-center shrink-0">
            <SlidersHorizontal className="w-5 h-5 mr-1.5 text-[#002DC2]" /> {t('filterStateLabel')}
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
            <MapPin className="w-5 h-5 hidden min-[400px]:block shrink-0" />
            <span>{t('interactiveMapTab')}</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('list')}
            className={`flex-1 sm:flex-initial py-2.5 px-2 sm:px-4 text-sm sm:text-base font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap ${
              mobileTab === 'list' ? 'bg-[#002DC2] text-white shadow' : 'text-slate-800'
            }`}
          >
            <List className="w-5 h-5 hidden min-[400px]:block shrink-0" />
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
              <Search className="w-5 h-5 text-black/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
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
                      <MapPin className="w-5 h-5 text-[#002DC2] mr-1.5 shrink-0" /> {proj.locationName}
                    </p>

                    <div className="mt-3 flex items-center justify-between text-sm sm:text-base">
                      <span className="text-[#002DC2] font-bold flex items-center line-clamp-1">
                        <Wheat className="w-5 h-5 mr-1.5 shrink-0" /> {proj.cropDrying}
                      </span>
                      
                      <span className={`font-black flex items-center text-xs sm:text-sm shrink-0 ml-2 ${
                        isSelected ? 'text-[#002DC2]' : 'text-slate-600 group-hover:text-[#002DC2]'
                      }`}>
                        {t('common_map_focus')} <ArrowRight className="w-4 h-4 ml-1" />
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Map Viewport - Full Width on Laptop, Toggleable on Mobile */}
        <div
          className={`w-full h-full rounded-2xl overflow-hidden relative border-2 border-[#123B92]/30 ${
            mobileTab === 'map' ? 'block' : 'hidden lg:block'
          }`}
        >
          <MapContainer
            center={[22.5, 80.0]}
            zoom={4.75}
            minZoom={3.5}
            maxZoom={MAP_MAX_ZOOM}
            zoomSnap={0.25}
            zoomDelta={0.5}
            wheelPxPerZoomLevel={90}
            wheelDebounceTime={30}
            zoomAnimation
            fadeAnimation
            markerZoomAnimation
            inertia
            dragging
            touchZoom
            doubleClickZoom
            boxZoom
            keyboard
            bounceAtZoomLimits
            scrollWheelZoom={false}
            maxBounds={PAN_BOUNDS}
            maxBoundsViscosity={0.8}
            zoomControl={false}
            attributionControl={false}
            className="zenitek-site-map"
            style={{ width: '100%', height: '100%' }}
          >
            <AttributionControl position="bottomright" prefix='<a href="https://leafletjs.com" target="_blank" rel="noopener noreferrer">Leaflet</a>' />

            {/* Controller for bounds fitting & smooth flyTo on list selection */}
            <MapController
              filteredProjects={filteredProjects}
              selectedProject={selectedProject}
              mobileTab={mobileTab}
              triggerFitAll={triggerFitAll}
              onResetFitTrigger={handleResetFitTrigger}
              markerRefs={markerRefs}
            />

            {/* Wheel zoom activates after clicking into the map (keeps page scrolling smooth) */}
            <ScrollWheelGuard onBlockedWheel={handleBlockedWheel} />

            {/* Floating controls */}
            <LayerSwitcher mapMode={mapMode} setMapMode={setMapMode} />
            <ZoomControls onFitAll={handleFitAllClick} />

            {/* Base layer: Satellite (default) / Terrain / Standard */}
            <TileLayer
              key={mapMode}
              url={layer.url}
              attribution={layer.attribution}
              subdomains={layer.subdomains || 'abc'}
              maxNativeZoom={layer.maxNativeZoom}
              maxZoom={MAP_MAX_ZOOM}
              keepBuffer={4}
            />
            {layer.overlay && (
              <TileLayer
                key={`${mapMode}-labels`}
                url={layer.overlay.url}
                maxNativeZoom={layer.overlay.maxNativeZoom}
                maxZoom={MAP_MAX_ZOOM}
                keepBuffer={4}
                zIndex={2}
              />
            )}

            {/* Location markers: hover (desktop) shows a details tooltip, click / tap opens the details card */}
            {filteredProjects.map(p => {
              const key = projectKey(p);
              const isSelected = selectedProject ? projectKey(selectedProject) === key : false;

              return (
                <Marker
                  key={key}
                  position={[p.latitude, p.longitude]}
                  icon={isSelected ? PIN_ICON_SELECTED : PIN_ICON}
                  riseOnHover
                  ref={(el) => {
                    if (el) markerRefs.current[key] = el;
                    else delete markerRefs.current[key];
                  }}
                  eventHandlers={{
                    popupopen: (e) => {
                      e.target.closeTooltip();
                      const el = e.target.getElement();
                      if (el) el.classList.add('is-open');
                    },
                    popupclose: (e) => {
                      const el = e.target.getElement();
                      if (el) el.classList.remove('is-open');
                    }
                  }}
                >
                  {canHover && (
                    <Tooltip
                      direction="top"
                      offset={[0, -4]}
                      opacity={1}
                      className="custom-leaflet-tooltip"
                    >
                      <div className="p-3 w-64">
                        <SiteDetails p={p} t={t} compact />
                      </div>
                    </Tooltip>
                  )}

                  <Popup
                    autoPan
                    autoPanPaddingTopLeft={[12, 68]}
                    autoPanPaddingBottomRight={[60, 24]}
                    closeButton
                    maxWidth={300}
                    minWidth={240}
                    className="custom-leaflet-popup"
                  >
                    <div className="p-3 w-60 sm:w-72 space-y-2.5 text-slate-900">
                      {p.imageUrl && (
                        <Link
                          to={`/installations/${encodeURIComponent(key)}`}
                          className="hidden sm:block relative rounded-lg overflow-hidden h-28 bg-slate-900 border border-slate-200 group"
                          tabIndex={-1}
                        >
                          <img
                            src={p.imageUrl}
                            alt={p.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            loading="lazy"
                          />
                        </Link>
                      )}

                      <SiteDetails p={p} t={t} closeGap />

                      <div className="pt-2 border-t border-slate-100">
                        <Link
                          to={`/installations/${encodeURIComponent(key)}`}
                          className="zenitek-popup-cta w-full min-h-[44px] text-sm font-black text-white bg-[#23AC39] hover:bg-[#1A822B] py-2.5 px-3 rounded-lg shadow-sm text-center flex items-center justify-center gap-1.5 transition-colors active:scale-[0.98]"
                        >
                          <Eye className="w-4 h-4 shrink-0" />
                          <span>{t('common_map_viewDetails')}</span>
                          <ArrowRight className="w-4 h-4 shrink-0" />
                        </Link>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>

          {/* Hint shown when the wheel is used before clicking into the map */}
          <div
            aria-hidden={!showScrollHint}
            className={`absolute inset-0 z-[650] pointer-events-none flex items-center justify-center transition-opacity duration-300 ${showScrollHint ? 'opacity-100' : 'opacity-0'}`}
          >
            <div className="bg-[#123B92]/90 text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 max-w-[80%] text-center">
              <MousePointerClick className="w-5 h-5 shrink-0" />
              <span>{t('common_map_scrollHint')}</span>
            </div>
          </div>

          {/* Active sites badge + interaction hint (tablet / desktop) */}
          <div className="absolute bottom-3 left-3 z-[500] pointer-events-none select-none bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#123B92]/25 shadow-md hidden sm:flex items-center gap-2 max-w-[45%]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#23AC39] animate-pulse shrink-0" />
            <span className="text-xs font-black text-[#123B92] tracking-wide truncate">
              {t('common_map_activeSites', { count: filteredProjects.length })} • {canHover ? t('common_map_hoverHint') : t('common_map_tapHint')}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
