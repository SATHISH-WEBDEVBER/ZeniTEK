import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { zenitekRealGallery } from '../data/zenitekRealGalleryData';
import { fetchPublicGallery } from '../utils/api';
import { 
  Camera, Filter, MapPin, X, ArrowRight, Sun, ZoomIn, ShieldCheck, 
  Layers, Sparkles, CheckCircle2, SlidersHorizontal, Info, Tag, ExternalLink, Loader
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import PageHero from '../components/PageHero';

const CATEGORY_IDS = ['all', 'tunnel_external', 'tunnel_internal', 'box_dryers', 'trays_produce', 'engineering'];
// Navbar / legacy aliases -> closest gallery filter. There is no dedicated brochure category,
// so brochure & spec-sheet links open the engineering & fabrication photos.
const CATEGORY_ALIASES = { brochure: 'engineering', brochures: 'engineering', specs: 'engineering' };

const resolveCategory = (cat) => {
  if (!cat) return 'all';
  const id = CATEGORY_ALIASES[cat] || cat;
  return CATEGORY_IDS.includes(id) ? id : 'all';
};

export default function GalleryPage({ onOpenQuoteModal }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const catParam = searchParams.get('cat');
  const [activeCategory, setActiveCategory] = useState(() => resolveCategory(catParam));

  // Follow navbar links (/gallery?cat=...) while already on the page
  useEffect(() => {
    setActiveCategory(resolveCategory(catParam));
  }, [catParam]);

  const changeCategory = (id) => {
    setActiveCategory(id);
    const next = new URLSearchParams(searchParams);
    if (id === 'all') next.delete('cat'); else next.set('cat', id);
    setSearchParams(next, { replace: true });
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [apiItems, setApiItems] = useState([]);
  const [apiLoading, setApiLoading] = useState(true);
  const { t } = useLanguage();

  // Try fetching from API; fall back to static data
  useEffect(() => {
    fetchPublicGallery()
      .then(data => {
        if (data.items && data.items.length > 0) {
          setApiItems(data.items);
        }
      })
      .catch(() => {})
      .finally(() => setApiLoading(false));
  }, []);

  // Merge: if API has items, use them exclusively; otherwise use static data
  const rawItems = apiItems.length > 0 ? apiItems : zenitekRealGallery;

  // Normalise so both sources share the same field shape for rendering
  const masterGalleryItems = rawItems.map(item => {
    if (item._id) {
      // API item shape
      return {
        id: item._id,
        title: item.title,
        category: item.category,
        categoryLabel: item.category,
        image: item.image?.url || '',
        thumbnail: item.image?.url || '',
        location: item.location || '',
        state: item.state || '',
        productModel: item.productModel || '',
        capacity: item.capacity || '',
        lat: item.lat || 0,
        lng: item.lng || 0,
        description: item.description || '',
        isApiItem: true
      };
    }
    return { ...item, isApiItem: false };
  });

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
      
      {/* SECTION 1: HERO (background photo, left-aligned heading) */}
      <PageHero
        images="/real-photos/zenitek_photo_43.jpeg"
        badge={<><Camera className="w-3.5 h-3.5 text-[#002DC2]" /><span>Authentic Field & Manufacturing Gallery</span></>}
        title={<>ZeniTEK Solar Drying Systems <br /><span className="text-[#002DC2]">Real Installation & Product Photographs</span></>}
        subtitle="Explore authentic photographs of our commercial walk-in solar polyhouses, SS304 food-grade trolley trays, portable box dryers, and manufacturing craftsmanship across India. Click any card to view detailed specifications, multi-angle photos, and exact GPS installation coordinates."
      >
        {/* Quick Search Bar */}
        <div className="max-w-md pt-1">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by crop, model, location, or state..."
              aria-label="Search gallery"
              className="w-full bg-white/95 border border-[#123B92]/30 rounded-2xl px-4 py-3 text-sm text-black placeholder-black/40 focus:outline-none focus:border-[#002DC2] focus:ring-2 focus:ring-[#002DC2]/20 shadow-md"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-3 text-xs font-bold text-black/50 hover:text-black cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </PageHero>

      {/* SECTION 2: GALLERY GRID (EVEN: LIGHT TINT, FULLY RESPONSIVE CARDS) */}
      <section className="w-full section-even py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
            <h2 className="text-3xl sm:text-4xl font-black text-[#123B92] tracking-tight">
              Installation & Product Photos
            </h2>
            <p className="text-base sm:text-lg text-slate-600">
              Browse field installations and product photos. Open any card for full details and location map.
            </p>
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mb-8 sm:mb-10">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => changeCategory(cat.id)}
                aria-pressed={activeCategory === cat.id}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-[#002DC2] text-white shadow-md ring-2 ring-[#23AC39]'
                    : 'bg-white text-black hover:text-[#002DC2] hover:bg-[#F0F4FD] border border-[#123B92]/20'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-2xs px-1.5 py-0.5 rounded-full font-bold ${
                  activeCategory === cat.id ? 'bg-[#123B92] text-white' : 'bg-[#F0F4FD] text-[#123B92]'
                }`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          {apiLoading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Loader className="w-10 h-10 text-[#002DC2] animate-spin" />
              <p className="text-sm text-black/50 font-medium">Loading gallery...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-[#123B92]/20 text-black/60 text-xs">
              No photographs match your current filter. Try selecting &quot;All Photographs&quot; or clearing search.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="group relative bg-white rounded-3xl overflow-hidden border border-[#123B92]/20 shadow-sm hover:shadow-xl hover:border-[#002DC2] transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Zoom button in corner -> opens the photo's own page */}
                  <Link
                    to={`/gallery/${item.id}`}
                    title="View full photo"
                    aria-label={`View full photo: ${item.title}`}
                    data-zoom-link
                    className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white p-2 rounded-xl text-xs transition-all shadow-md z-10"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Link>

                  <Link to={`/gallery/${item.id}`} className="block flex-1">
                    {/* Clean, Visible Unobstructed Photo Container */}
                    <div className="relative h-56 sm:h-64 overflow-hidden bg-slate-950 border-b border-[#123B92]/20">
                      <img
                        src={item.thumbnail || item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />

                      {/* Map Coordinate Badge */}
                      <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-2xs font-mono flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-[#23AC39]" />
                        <span>{item.lat.toFixed(2)}°N, {item.lng.toFixed(2)}°E</span>
                      </div>
                    </div>

                    {/* Photo Details & Metadata */}
                    <div className="p-4 sm:p-5 space-y-2.5">
                      {/* Category & Model Tag Row */}
                      <div className="flex flex-wrap items-center content-start justify-between gap-1.5 border-b border-[#123B92]/10 pb-2 sm:min-h-14">
                        <span className="bg-[#123B92] text-white font-bold text-2xs uppercase px-2.5 py-0.5 rounded-md shadow-sm inline-block whitespace-nowrap">
                          {item.categoryLabel || item.category}
                        </span>
                        {item.productModel && (
                          <span className="bg-[#002DC2] text-white font-bold text-2xs px-2 py-0.5 rounded shadow-sm whitespace-nowrap">
                            {item.productModel}
                          </span>
                        )}
                      </div>

                      <div className="space-y-1.5 text-xs font-bold text-[#002DC2]">
                        <div
                          className="flex items-start min-w-0 min-h-10"
                          title={`${item.location}${item.state ? `, ${item.state}` : ''}`}
                        >
                          <MapPin className="w-3.5 h-3.5 mr-1 mt-[3px] text-[#002DC2] shrink-0" />
                          <span className="line-clamp-2">{item.location}{item.state ? `, ${item.state}` : ''}</span>
                        </div>
                        <div className="flex min-h-[20px]">
                          {item.capacity && (
                            <span
                              title={item.capacity}
                              className="max-w-full truncate text-2xs text-white bg-[#1E8A30] px-2 py-0.5 rounded border border-[#1E8A30] font-bold"
                            >
                              {item.capacity}
                            </span>
                          )}
                        </div>
                      </div>

                      <h4 className="font-extrabold text-[#123B92] text-lg leading-6 group-hover:text-[#002DC2] transition-colors line-clamp-2 min-h-12">
                        {item.title}
                      </h4>

                      <p className="text-sm text-slate-600 line-clamp-2 leading-6 font-medium min-h-12">
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
          <div className="bg-[#123B92] text-white rounded-3xl p-6 sm:p-10 shadow-xl flex flex-col items-center gap-6 border-2 border-[#23AC39]">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="inline-block max-w-full text-2xs leading-snug font-bold text-[#9BF0A8] bg-white/10 px-3 py-1 rounded-2xl uppercase tracking-wider border border-[#9BF0A8]/60">
                Turnkey Manufacturing & Field Commissioning
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Looking for a Complete Commercial Polyhouse Dryer Installation?
              </h2>
              <p className="text-base sm:text-lg text-white/90">
                ZeniTEK handles structural engineering, CNC fabrication, food-grade SS304 tray carts, and government subsidy paperwork end-to-end.
              </p>
            </div>

            <div className="flex items-center justify-center">
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

    </div>
  );
}
