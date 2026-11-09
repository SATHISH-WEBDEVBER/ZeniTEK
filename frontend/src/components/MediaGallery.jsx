import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { X, ChevronLeft, ChevronRight, Play, MapPin, ArrowRight } from 'lucide-react';
import useScrollLock, { useEscapeKey } from '../hooks/useScrollLock';
import { useLanguage } from '../context/LanguageContext';
import { productPhotos, productVideos, nodeTitle, CATALOG_ENTRIES } from '../data/productCatalog';

// Product photos and videos (src/data/productMedia.js): photo grids, video cards and the
// full-screen viewer used by the Gallery page and the product pages.

// Viewer items for a product's photos
export const photoItems = (node, t) => productPhotos(node).map(p => ({
  kind: 'photo',
  src: p.src,
  thumb: p.thumb,
  title: nodeTitle(node, t),
  caption: p.noteKey ? t(p.noteKey) : '',
  place: p.place || '',
  link: node.path,
}));

// Viewer item for a video (subtitle/link: the product it shows)
export const videoItem = (video, t) => {
  const node = CATALOG_ENTRIES.find(e => e.node.id === video.product)?.node;
  return {
    kind: 'video',
    src: video.src,
    poster: video.poster,
    duration: video.duration,
    title: t(video.titleKey),
    subtitle: node ? nodeTitle(node, t) : '',
    link: node?.path,
  };
};

const formatDuration = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

// Full-screen photo / video viewer: arrows, swipe and the keyboard move between items; Esc closes.
export function MediaViewer({ items, index, onIndex, onClose }) {
  const { t } = useLanguage();
  const open = index !== null && index !== undefined && index >= 0 && index < items.length;
  const count = items.length;
  useScrollLock(open);
  useEscapeKey(open, onClose);
  const go = useCallback((step) => onIndex((index + step + count) % count), [index, count, onIndex]);
  useEffect(() => {
    if (!open || count < 2) return undefined;
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, count, go]);
  const touchX = useRef(null);
  const closeRef = useRef(null);
  useEffect(() => { if (open) closeRef.current?.focus(); }, [open]);

  if (!open) return null;
  const item = items[index];
  const stop = (e) => e.stopPropagation();
  const details = [item.caption, item.place].filter(Boolean);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      className="fixed inset-0 z-[100] bg-neutral-950 flex flex-col animate-fade-in"
      onClick={onClose}
      onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (touchX.current === null || count < 2) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) > 50) go(dx > 0 ? -1 : 1);
      }}
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3 text-white shrink-0">
        <span className="text-sm font-bold text-white/70 tabular-nums">{count > 1 ? `${index + 1} / ${count}` : ''}</span>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label={t('media_close')}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="relative flex-1 min-h-0 flex items-center justify-center px-2 sm:px-20">
        {item.kind === 'video' ? (
          <video
            key={item.src}
            ref={(el) => { if (el && el.paused && !el.dataset.started) { el.dataset.started = '1'; el.play().catch(() => {}); } }}
            src={item.src}
            poster={item.poster}
            controls
            autoPlay
            playsInline
            onClick={stop}
            className="max-w-full max-h-full rounded-lg bg-black"
          />
        ) : (
          <img
            key={item.src}
            src={item.src}
            alt={item.title}
            onClick={stop}
            className="max-w-full max-h-full object-contain rounded-lg select-none"
          />
        )}
        {count > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => { stop(e); go(-1); }}
              aria-label={t('media_prev')}
              className="absolute left-2 sm:left-5 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/15 hover:bg-white/30 text-white transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>
            <button
              type="button"
              onClick={(e) => { stop(e); go(1); }}
              aria-label={t('media_next')}
              className="absolute right-2 sm:right-5 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/15 hover:bg-white/30 text-white transition-colors cursor-pointer"
            >
              <ChevronRight className="w-7 h-7" />
            </button>
          </>
        )}
      </div>

      <div className="shrink-0 px-4 py-4 sm:py-5 text-center text-white space-y-1" onClick={stop}>
        <p className="text-base sm:text-lg font-bold">{item.title}</p>
        {(item.subtitle || details.length > 0) && (
          <p className="text-sm text-white/70 flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
            {item.subtitle && <span>{item.subtitle}</span>}
            {item.caption && <span>{item.caption}</span>}
            {item.place && <span className="inline-flex items-center gap-1"><MapPin className="w-4 h-4 text-[#23AC39]" />{item.place}</span>}
          </p>
        )}
        {item.link && (
          <Link to={item.link} onClick={onClose} className="inline-flex items-center gap-1.5 pt-1 text-sm font-bold text-[#7FA2FF] hover:text-white transition-colors">
            {t('cat_viewProduct')} <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>,
    document.body
  );
}

// Grid of photo thumbnails; `limit` shows the first photos with a "+N more" tile that opens the rest
export function PhotoGrid({ items, limit, onOpen, cols = 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' }) {
  const { t } = useLanguage();
  const shown = limit && items.length > limit ? items.slice(0, limit) : items;
  const moreCount = items.length - shown.length + 1;
  return (
    <div className={`grid ${cols} gap-2 sm:gap-3`}>
      {shown.map((item, i) => {
        const more = shown.length < items.length && i === shown.length - 1;
        return (
          <button
            key={item.src}
            type="button"
            onClick={() => onOpen(i)}
            aria-label={more ? t('media_more', { count: moreCount }) : t('media_open', { n: i + 1 })}
            className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-slate-100 border border-slate-200 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#002DC2]/40"
          >
            <img
              src={item.thumb || item.src}
              alt={item.place ? `${item.title} – ${item.place}` : item.title}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {item.place && !more && (
              <span className="absolute left-2 right-2 bottom-2 inline-flex items-center gap-1 bg-black/65 text-white text-2xs sm:text-xs font-semibold px-2 py-1 rounded-md text-left">
                <MapPin className="w-3.5 h-3.5 text-[#23AC39] shrink-0" />
                <span className="truncate">{item.place}</span>
              </span>
            )}
            {more && (
              <span className="absolute inset-0 bg-black/55 group-hover:bg-black/45 transition-colors flex items-center justify-center text-white text-lg sm:text-xl font-black">
                {t('media_more', { count: moreCount })}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// One video: poster frame with a play button, duration, title and the product it shows
export function VideoCard({ item, onPlay }) {
  const { t } = useLanguage();
  return (
    <button
      type="button"
      onClick={onPlay}
      aria-label={t('media_play', { title: item.title })}
      className="group text-left flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-lg hover:border-[#002DC2]/40 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#002DC2]/40"
    >
      <span className="relative block aspect-video bg-slate-900 overflow-hidden">
        <img src={item.poster} alt="" loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="w-16 h-16 rounded-full bg-white/90 text-[#002DC2] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Play className="w-8 h-8 ml-1" fill="currentColor" />
          </span>
        </span>
        <span className="absolute right-2 bottom-2 bg-black/70 text-white text-xs font-bold px-2 py-0.5 rounded-md tabular-nums">
          {formatDuration(item.duration)}
        </span>
      </span>
      <span className="block p-4 space-y-1">
        <span className="block text-base font-bold text-[#123B92] leading-snug">{item.title}</span>
        {item.subtitle && <span className="block text-sm text-slate-500">{item.subtitle}</span>}
      </span>
    </button>
  );
}

// Grid of video cards with its own viewer
export function VideoGrid({ videos }) {
  const { t } = useLanguage();
  const [index, setIndex] = useState(null);
  const items = videos.map(v => videoItem(v, t));
  const cols = items.length === 1 ? 'max-w-xl mx-auto' : items.length === 2 ? 'md:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3';
  return (
    <>
      <div className={`grid grid-cols-1 ${cols} gap-6`}>
        {items.map((item, i) => <VideoCard key={item.src} item={item} onPlay={() => setIndex(i)} />)}
      </div>
      <MediaViewer items={items} index={index} onIndex={setIndex} onClose={() => setIndex(null)} />
    </>
  );
}

// Photo gallery + videos section for a product page (renders nothing when the product has neither)
export function ProductMediaSection({ node, photos = true, className = '' }) {
  const { t } = useLanguage();
  const [index, setIndex] = useState(null);
  const items = photos ? photoItems(node, t) : [];
  const videos = productVideos(node);
  if (items.length < 2 && videos.length === 0) return null;
  const cols = items.length <= 3 ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4';
  return (
    <section className={`w-full py-12 sm:py-16 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {items.length > 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl font-black text-[#123B92] tracking-tight">{t('media_photoGallery')}</h2>
              <p className="text-base text-slate-500 mt-2">{t('media_photos', { count: items.length })}</p>
            </div>
            <PhotoGrid items={items} onOpen={setIndex} cols={cols} />
            <MediaViewer items={items.map(i => ({ ...i, link: null }))} index={index} onIndex={setIndex} onClose={() => setIndex(null)} />
          </div>
        )}
        {videos.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-4xl font-black text-[#123B92] tracking-tight text-center">{t('media_tabVideos')}</h2>
            <VideoGrid videos={videos} />
          </div>
        )}
      </div>
    </section>
  );
}
