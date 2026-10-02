import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { zenitekRealGallery } from '../data/zenitekRealGalleryData';
import { 
  Camera, Filter, MapPin, X, ArrowRight, Sun, ZoomIn, ShieldCheck, 
  Layers, Sparkles, CheckCircle2, SlidersHorizontal, Info, Tag, ExternalLink
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function GalleryPage({ onOpenQuoteModal }) {
  const [searchParams] = useSearchParams();
  const catParam = searchParams.get('cat');
  const [activeCategory, setActiveCategory] = useState(catParam || 'all');

  useEffect(() => {
    if (catParam) {
      setActiveCategory(catParam);
    }
  }, [catParam]);

  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useLanguage();

  // Exactly the 30 authentic master photographs (Items 31+ brochure pages removed)
  const masterGalleryItems = zenitekRealGallery;

  // Filter items by category and search query
  const filteredItems = useMemo(() => {
    return masterGalleryItems.filter((item) => {
      const matchesCat = activeCategory === 'all' || item.category === activeCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch = !q ||
        item.title.toLowerCase().includes(q) ||
        (item.location && item.location.toLowerCase().includes(q)) ||
        (item.state && item.state.toLowerCase().includes(q)) ||
        (item.productModel && item.productModel.toLowerCase().includes(q)) ||
        (item.crop && item.crop.toLowerCase().includes(q));

      return matchesCat && matchesSearch;
    });
  }, [masterGalleryItems, activeCategory, searchQuery]);

  const categories = [
    { id: 'all', label: 'All Photographs', count: masterGalleryItems.length },
    { id: 'tunnel_external', label: 'Polyhouse Tunnels', count: masterGalleryItems.filter(i => i.category === 'tunnel_external').length },
    { id: 'tunnel_internal', label: 'Tunnel Interior & Trays', count: masterGalleryItems.filter(i => i.category === 'tunnel_internal').length },
    { id: 'box_dryers', label: 'Box Type Dryers', count: masterGalleryItems.filter(i => i.category === 'box_dryers').length },
    { id: 'trays_produce', label: 'Produce & SS304 Trays', count: masterGalleryItems.filter(i => i.category === 'trays_produce').length },
    { id: 'engineering', label: 'Engineering & Packaging', count: masterGalleryItems.filter(i => i.category === 'engineering').length },
  ];

  return (
    <div className="text-black min-h-screen bg-white">
      
      {/* SECTION 1: HERO BANNER (ODD: WHITE) */}
      <section className="w-full section-odd py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-[#F0F4FD] border border-[#123B92]/30 text-[#123B92] text-xs font-bold uppercase tracking-widest shadow-xs">
            <Camera className="w-3.5 h-3.5 text-[#002DC2]" />
            <span>Authentic Field & Manufacturing Gallery</span>
          </div>

          <h1 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-black text-[#123B92] tracking-tight leading-tight">
            ZeniTEK Solar Drying Systems <br />
            <span className="text-[#002DC2]">
              Real Installation & Product Photographs
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-black max-w-2xl mx-auto font-medium leading-relaxed">
            Explore authentic photographs of our commercial walk-in solar polyhouses, SS304 food-grade trolley trays, portable box dryers, and manufacturing craftsmanship across India. Click any card to view detailed specifications, multi-angle photos, and exact GPS installation coordinates.
          </p>

          {/* Quick Search Bar */}
          <div className="max-w-md mx-auto pt-2">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by crop, model, location, or state..."
                className="w-full bg-[#F0F4FD] border border-[#123B92]/30 rounded-2xl px-4 py-2.5 text-xs text-black placeholder-black/40 focus:outline-none focus:border-[#002DC2] focus:ring-2 focus:ring-[#002DC2]/20 shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-2.5 text-xs font-bold text-black/50 hover:text-black cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 pt-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-[#002DC2] text-white shadow-md ring-2 ring-[#23AC39]'
                    : 'bg-white text-black hover:text-[#002DC2] hover:bg-[#F0F4FD] border border-[#123B92]/20'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeCategory === cat.id ? 'bg-[#123B92] text-white' : 'bg-[#F0F4FD] text-[#123B92]'
                }`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2: GALLERY GRID (EVEN: LIGHT TINT, FULLY RESPONSIVE CARDS) */}
      <section className="w-full section-even py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredItems.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-[#123B92]/20 text-black/60 text-xs">
              No photographs match your current filter. Try selecting "All Photographs" or clearing search.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="group bg-white rounded-3xl overflow-hidden border border-[#123B92]/20 shadow-xs hover:shadow-xl hover:border-[#002DC2] transition-all duration-300 flex flex-col justify-between"
                >
                  <Link to={`/gallery/${item.id}`} className="block flex-1">
                    {/* Clean, Visible Unobstructed Photo Container */}
                    <div className="relative h-56 sm:h-64 overflow-hidden bg-slate-950 border-b border-[#123B92]/20">
                      <img
                        src={item.thumbnail || item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      
                      {/* Zoom Button in Corner */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedPhoto(item);
                        }}
                        title="Quick View Photo"
                        className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white p-2 rounded-xl text-xs transition-all shadow-md cursor-pointer z-10"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </button>

                      {/* Map Coordinate Badge */}
                      <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-[10px] font-mono flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-[#23AC39]" />
                        <span>{item.lat.toFixed(2)}°N, {item.lng.toFixed(2)}°E</span>
                      </div>
                    </div>

                    {/* Photo Details & Metadata */}
                    <div className="p-4 sm:p-5 space-y-2.5">
                      {/* Category & Model Tag Row */}
                      <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-[#123B92]/10 pb-2">
                        <span className="bg-[#123B92] text-white font-bold text-[10px] uppercase px-2.5 py-0.5 rounded-md shadow-2xs">
                          {item.categoryLabel || item.category}
                        </span>
                        {item.productModel && (
                          <span className="bg-[#002DC2] text-white font-bold text-[10px] px-2 py-0.5 rounded shadow-2xs">
                            {item.productModel}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[11px] font-bold text-[#002DC2]">
                        <div className="flex items-center line-clamp-1">
                          <MapPin className="w-3.5 h-3.5 mr-1 text-[#002DC2] shrink-0" />
                          <span>{item.location}{item.state ? `, ${item.state}` : ''}</span>
                        </div>
                        {item.capacity && (
                          <span className="text-[10px] text-white bg-[#23AC39] px-2 py-0.5 rounded border border-[#23AC39] font-bold shrink-0">
                            {item.capacity}
                          </span>
                        )}
                      </div>

                      <h4 className="font-extrabold text-[#123B92] text-xs sm:text-sm leading-snug group-hover:text-[#002DC2] transition-colors line-clamp-2">
                        {item.title}
                      </h4>

                      <p className="text-[11.5px] text-slate-600 line-clamp-2 leading-relaxed font-medium">
                        {item.description}
                      </p>
                    </div>
                  </Link>

                  {/* Card Footer: Navigate to Detailed Page with Map */}
                  <Link
                    to={`/gallery/${item.id}`}
                    className="px-4 sm:px-5 py-3.5 bg-slate-50 hover:bg-[#F0F4FD] flex items-center justify-between text-xs text-[#002DC2] font-black border-t border-[#123B92]/10 transition-colors"
                  >
                    <span className="flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#002DC2]" />
                      <span>View Details & Interactive Map</span>
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1.5 transition-transform" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* SECTION 3: SUBSIDY ASSISTANCE CTA BANNER (ODD: WHITE) */}
      <section className="w-full section-odd py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#123B92] text-white rounded-3xl p-6 sm:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border-2 border-[#23AC39]">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-[10px] font-bold text-[#23AC39] bg-black/40 px-3 py-1 rounded-full uppercase tracking-wider border border-[#23AC39]/50">
                Turnkey Manufacturing & Field Commissioning
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Looking for a Complete Commercial Polyhouse Dryer Installation?
              </h3>
              <p className="text-xs sm:text-sm text-white/90 max-w-xl">
                ZeniTEK handles structural engineering, CNC fabrication, food-grade SS304 tray carts, and government subsidy paperwork end-to-end.
              </p>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              <button
                onClick={() => onOpenQuoteModal && onOpenQuoteModal({ capacityNeeded: 'Complete Turnkey Dryer Project' })}
                className="py-3.5 px-6 bg-[#23AC39] hover:bg-[#002DC2] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all hover:scale-105 cursor-pointer"
              >
                Get Turnkey Quote
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* LIGHTBOX QUICK ZOOM MODAL */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 z-[99999] flex items-center justify-center p-2.5 sm:p-4 lg:p-6 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedPhoto(null)}
        >
          <div 
            className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 bg-[#123B92] text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="bg-[#23AC39] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  {selectedPhoto.productModel}
                </span>
                <span className="text-xs font-bold truncate max-w-xs sm:max-w-md">
                  {selectedPhoto.title}
                </span>
              </div>
              <button 
                onClick={() => setSelectedPhoto(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Photo View */}
            <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[300px]">
              <img 
                src={selectedPhoto.image} 
                alt={selectedPhoto.title}
                className="max-h-[60vh] max-w-full object-contain"
              />
            </div>

            {/* Footer with Link to Full Detail Page */}
            <div className="p-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-700">
                <span className="font-bold text-slate-900">{selectedPhoto.location}, {selectedPhoto.state}</span>
                {selectedPhoto.capacity && <span> • Capacity: {selectedPhoto.capacity}</span>}
              </div>

              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <Link
                  to={`/gallery/${selectedPhoto.id}`}
                  onClick={() => setSelectedPhoto(null)}
                  className="flex-1 sm:flex-none px-5 py-2.5 bg-[#002DC2] hover:bg-[#123B92] text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition-all"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Open Full Page & Map</span>
                </Link>
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
