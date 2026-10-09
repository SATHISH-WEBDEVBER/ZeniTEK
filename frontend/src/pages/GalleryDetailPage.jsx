import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { zenitekRealGallery } from '../data/zenitekRealGalleryData';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { 
  ArrowLeft, MapPin, CheckCircle2, ShieldCheck, Sun, Zap, 
  Layers, Maximize2, Share2, PhoneCall, MessageCircle, 
  ChevronRight, Calendar, Sparkles, SlidersHorizontal, Info, Award
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

// Keep short parenthetical notes like "(with casters)" from splitting across lines
const keepParens = (s) => String(s ?? '').replace(/\(([^)]{1,16})\)/g, (m) => m.replace(/ /g, ' '));

// Custom ZeniTEK Map Pin Marker
const createCustomIcon = () => {
  return L.divIcon({
    className: 'zenitek-custom-marker',
    html: `
      <div class="zenitek-map-pin-root is-selected">
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

export default function GalleryDetailPage({ onOpenQuoteModal }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const item = zenitekRealGallery.find((p) => p.id === id) || zenitekRealGallery[0];
  const [activeImage, setActiveImage] = useState(item.image);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setActiveImage(item.image);
    window.scrollTo(0, 0);
  }, [id, item.image]);

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
        <div className="text-center space-y-4 max-w-md bg-white p-8 rounded-3xl border border-slate-200 shadow-md">
          <h2 className="text-2xl font-bold text-slate-900">Installation Not Found</h2>
          <p className="text-sm text-slate-600">The requested installation photo detail could not be found.</p>
          <Link
            to="/gallery"
            className="inline-flex items-center space-x-2 px-6 py-2.5 bg-[#002DC2] text-white rounded-xl font-bold text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Gallery</span>
          </Link>
        </div>
      </div>
    );
  }

  // Related photos from same category (excluding current)
  const relatedItems = zenitekRealGallery
    .filter((p) => p.category === item.category && p.id !== item.id)
    .slice(0, 3);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello ZeniTEK Team, I am interested in learning more about the ${item.title} (${item.productModel}) installed at ${item.location}, ${item.state}. Please share pricing and subsidy details.`
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      
      {/* SECTION 1: BREADCRUMBS & TOP NAV */}
      <section className="bg-white border-b border-slate-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center min-w-0 space-x-2 text-xs font-semibold text-slate-500 py-1">
              <Link to="/" className="hover:text-blue-700 whitespace-nowrap shrink-0">Home</Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <Link to="/gallery" className="hover:text-blue-700 whitespace-nowrap shrink-0">Authentic Gallery</Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-[#002DC2] font-bold truncate min-w-0 max-w-xs" title={item.title}>{item.title}</span>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              <button
                onClick={handleShare}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center space-x-1.5 transition-all shadow-sm"
              >
                <Share2 className="w-3.5 h-3.5 text-slate-600" />
                <span>{copied ? 'Link Copied!' : 'Share Site'}</span>
              </button>
              <Link
                to="/gallery"
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 flex items-center space-x-1.5 transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>All Installations</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: SHOWCASE & SPECIFICATIONS */}
      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start lg:items-stretch">
            
            {/* Left 7 cols: Photo Showcase with angle thumbnails */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white p-3 sm:p-4 rounded-3xl border border-slate-200 shadow-md">
                {/* Main High-Res Image View */}
                <div 
                  className="relative aspect-4/3 sm:aspect-16/10 rounded-2xl overflow-hidden bg-slate-950 cursor-pointer group"
                  onClick={() => setLightboxOpen(true)}
                >
                  <img
                    src={activeImage}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                  <div className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white p-2 rounded-xl text-xs flex items-center space-x-1.5 transition-all">
                    <Maximize2 className="w-4 h-4" />
                    <span className="font-bold text-xs hidden sm:inline">Zoom Photo</span>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-xs flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-[#23AC39]" />
                    <span className="font-bold text-xs">Authentic ZeniTEK Field Site</span>
                  </div>
                </div>

                {/* Angle Thumbnails */}
                {item.relatedImages && item.relatedImages.length > 0 && (
                  <div className="pt-3 flex items-center space-x-3 overflow-x-auto pb-1">
                    <button
                      onClick={() => setActiveImage(item.image)}
                      className={`relative w-20 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                        activeImage === item.image ? 'border-[#002DC2] ring-2 ring-[#002DC2]/30 scale-[1.02]' : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={item.image} alt="Primary" className="w-full h-full object-cover" />
                    </button>
                    {item.relatedImages.map((imgSrc, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImage(imgSrc)}
                        className={`relative w-20 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                          activeImage === imgSrc ? 'border-[#002DC2] ring-2 ring-[#002DC2]/30 scale-[1.02]' : 'border-slate-200 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={imgSrc} alt={`Angle ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Verified Field Site Summary Box */}
              <div className="bg-[#F0F4FD] p-5 rounded-3xl border border-[#123B92]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-[#002DC2] uppercase tracking-wider flex items-center">
                    <Award className="w-4 h-4 mr-1.5 text-[#002DC2]" />
                    Commissioned Installation Details
                  </div>
                  <div className="text-base font-extrabold text-[#123B92] leading-snug">
                    Operational in {item.location}, {item.state}
                  </div>
                  <div className="text-sm text-slate-600">
                    MNRE enlisted model eligible for 40% – 60% agricultural capital subsidies.
                  </div>
                </div>

                <button
                  onClick={() => onOpenQuoteModal && onOpenQuoteModal({
                    capacityNeeded: item.capacity,
                    cropType: item.crop,
                    district: `${item.location}, ${item.state}`
                  })}
                  className="px-5 py-2.5 bg-[#23AC39] hover:bg-[#1f9632] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shrink-0 cursor-pointer whitespace-nowrap"
                >
                  Request Sizing Quote
                </button>
              </div>
            </div>

            {/* Right 5 cols: Technical Specs & Metadata */}
            <div className="lg:col-span-5 flex flex-col">
              
              <div className="flex-1 flex flex-col bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-md space-y-5">
                
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-[#123B92] text-white font-black text-xs uppercase px-3 py-1 rounded-full shadow-sm inline-block">
                    {item.categoryLabel}
                  </span>
                  <span className="bg-green-100 text-green-800 font-extrabold text-xs px-3 py-1 rounded-full border border-green-200">
                    {item.productModel}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-xl sm:text-2xl font-black text-slate-950 leading-tight">
                  {item.title}
                </h1>

                {/* Location Pill */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-bold text-[#002DC2] bg-blue-50/80 px-3.5 py-2 rounded-2xl border border-blue-100">
                  <span className="flex items-start min-w-0">
                    <MapPin className="w-4 h-4 mr-1.5 mt-0.5 text-[#002DC2] shrink-0" />
                    <span className="text-balance">{item.location}, {item.state}</span>
                  </span>
                  <span className="pl-[1.375rem] sm:pl-0 sm:ml-auto text-2xs text-slate-500 font-mono whitespace-nowrap">
                    {item.lat.toFixed(4)}°N, {item.lng.toFixed(4)}°E
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-700 leading-relaxed font-medium">
                  {item.description}
                </p>

                {/* Specifications Grid */}
                <div className="border-t border-slate-100 pt-5 space-y-3">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    Engineering Specifications
                  </h3>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                      <div className="text-2xs font-bold text-slate-400 uppercase">Model Series</div>
                      <div className="font-extrabold text-slate-900 mt-0.5">{item.productModel}</div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                      <div className="text-2xs font-bold text-slate-400 uppercase">Batch Capacity</div>
                      <div className="font-extrabold text-blue-700 mt-0.5">{keepParens(item.capacity)}</div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                      <div className="text-2xs font-bold text-slate-400 uppercase">Footprint / Size</div>
                      <div className="font-extrabold text-slate-900 mt-0.5">{keepParens(item.dimensions)}</div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                      <div className="text-2xs font-bold text-slate-400 uppercase">Primary Crops</div>
                      <div className="font-extrabold text-green-700 mt-0.5 break-words">{item.crop}</div>
                    </div>

                    {item.dryingTime && (
                      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                        <div className="text-2xs font-bold text-slate-400 uppercase">Drying Time</div>
                        <div className="font-extrabold text-slate-900 mt-0.5">{item.dryingTime}</div>
                      </div>
                    )}

                    {item.solarPV && (
                      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                        <div className="text-2xs font-bold text-slate-400 uppercase">Solar Power</div>
                        <div className="font-extrabold text-slate-900 mt-0.5 break-words">{keepParens(item.solarPV)}</div>
                      </div>
                    )}

                    {item.temperatureRange && (
                      <div className="col-span-2 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                        <div className="text-2xs font-bold text-slate-400 uppercase">Operating Temperature</div>
                        <div className="font-extrabold text-slate-900 mt-0.5">{item.temperatureRange}</div>
                      </div>
                    )}

                    {item.traySpecs && (
                      <div className="col-span-2 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                        <div className="text-2xs font-bold text-slate-400 uppercase">Food-Grade Tray Details</div>
                        <div className="font-semibold text-slate-800 mt-0.5">{keepParens(item.traySpecs)}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Spacer keeps CTAs pinned to the card bottom when the column stretches */}
                <div className="hidden lg:block flex-1" aria-hidden="true" />

                {/* Primary CTA Buttons */}
                <div className="pt-2 space-y-2.5">
                  <button
                    onClick={() => onOpenQuoteModal && onOpenQuoteModal({
                      capacityNeeded: item.capacity,
                      cropType: item.crop,
                      district: `${item.location}, ${item.state}`
                    })}
                    className="w-full py-3.5 bg-[#002DC2] hover:bg-[#123B92] text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-lg transition-all hover:scale-101 flex items-center justify-center gap-2 px-4 text-center cursor-pointer"
                  >
                    <SlidersHorizontal className="w-4 h-4 shrink-0" />
                    <span className="text-balance">Get Pricing & Subsidy Quote for this Model</span>
                  </button>

                  <a
                    href={`https://wa.me/919443729576?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 bg-[#23AC39] hover:bg-[#1f9632] text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-sm transition-all flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Chat on WhatsApp Directly</span>
                  </a>
                </div>

              </div>

            </div>

          </div>

          {/* SECTION 3: INTERACTIVE GPS LOCATION MAP (LEAFLET EMBED) */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
              <div className="space-y-1">
                <span className="text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-200 inline-flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-blue-600" /> Site Coordinates & Geolocation
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  Installation Site Map: {item.location}, {item.state}
                </h3>
                <p className="text-sm text-slate-600">
                  Interactive field coordinate preview. Zoom and pan to inspect the geographical agricultural cluster.
                </p>
              </div>

              <div className="flex items-center space-x-2 shrink-0 text-xs font-bold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                <span>GPS:</span>
                <span className="font-mono text-blue-700">{item.lat.toFixed(4)}, {item.lng.toFixed(4)}</span>
              </div>
            </div>

            {/* Leaflet Map Container */}
            <div className="relative h-[360px] sm:h-[420px] w-full rounded-2xl overflow-hidden border border-slate-200 shadow-inner z-0">
              <MapContainer
                center={[item.lat, item.lng]}
                zoom={11}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
                className="z-0"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[item.lat, item.lng]} icon={createCustomIcon()}>
                  <Popup>
                    <div className="p-1 space-y-1 text-xs">
                      <div className="font-bold text-slate-900">{item.title}</div>
                      <div className="text-xs text-blue-700 font-semibold">{item.productModel}</div>
                      <div className="text-2xs text-slate-500">{item.location}, {item.state}</div>
                      <div className="text-2xs text-green-700 font-bold">Crop: {item.crop}</div>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>

          {/* SECTION 4: RELATED REAL INSTALLATIONS */}
          {relatedItems.length > 0 && (
            <div className="space-y-4 pt-4">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 sm:gap-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">Related Real Installations</h3>
                  <p className="text-sm text-slate-600">Explore other commissioned projects in this category</p>
                </div>
                <Link
                  to="/gallery"
                  className="self-start sm:self-auto shrink-0 whitespace-nowrap text-sm font-bold text-[#002DC2] hover:underline flex items-center gap-1"
                >
                  <span>View All 30 Sites</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedItems.map((rel) => (
                  <Link
                    key={rel.id}
                    to={`/gallery/${rel.id}`}
                    className="group bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:border-[#002DC2] transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-48 overflow-hidden bg-black">
                        <img
                          src={rel.thumbnail || rel.image}
                          alt={rel.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm text-white text-2xs font-bold px-2 py-0.5 rounded">
                          {rel.productModel}
                        </div>
                      </div>

                      <div className="p-4 space-y-2">
                        <div className="flex items-start text-xs text-[#002DC2] font-bold leading-snug">
                          <MapPin className="w-3.5 h-3.5 mr-1 mt-px shrink-0" />
                          <span>{rel.location}, {rel.state}</span>
                        </div>
                        <h4 className="font-extrabold text-slate-900 text-base sm:text-base group-hover:text-[#002DC2] transition-colors line-clamp-2">
                          {rel.title}
                        </h4>
                      </div>
                    </div>

                    <div className="p-4 pt-0 text-xs text-[#002DC2] font-bold flex items-center justify-between border-t border-slate-100">
                      <span>View Specifications</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </section>

      {/* LIGHTBOX FULLSCREEN PREVIEW */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[999999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <div className="relative max-w-5xl max-h-[90vh] flex flex-col items-center">
            <img
              src={activeImage}
              alt={item.title}
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
            />
            <div className="mt-3 text-center text-white text-xs font-semibold">
              {item.title} • {item.location}, {item.state}
            </div>
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute -top-10 right-0 text-white font-bold text-sm bg-white/20 hover:bg-white/40 px-3 py-1 rounded-full cursor-pointer"
            >
              ✕ Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
