import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  gsap, ScrollTrigger, DURATION, EASE, STAGGER,
  prefersReducedMotion, richMotion, isDesktop, whenSiteReady
} from './core';

// Scroll reveals for every public page, applied automatically to the existing markup (no per-page code):
//
//   section headings  - the heading block (badge, title, subtitle) fades up line by line
//   grids             - each grid's items rise in one after another (cards also get hover lift + tilt)
//   images            - large photos unmask from the bottom; on desktop they drift slightly on scroll
//   other blocks      - forms, banners, tables and text blocks fade up
//
// Content is only hidden once JavaScript has registered it, and it is revealed when it scrolls into view
// (or gets keyboard focus), so nothing stays hidden. Opt out with data-reveal="off" on an element (it and
// everything inside it), or data-reveal="block" to reveal an element as one piece (e.g. a carousel).
// Everything is skipped when the visitor prefers reduced motion.

const ROOTS = 'main, footer';
// Elements (and their contents) the engine never touches
const SKIP_SELF = '[data-hero], [data-reveal="off"], [role="dialog"], .leaflet-container, .client-marquee-container, [class*="animate-marquee"]';
// Content inside these is left alone (horizontal scrollers, already-animated or one-piece areas)
const SKIP_INSIDE = `${SKIP_SELF}, [data-reveal="block"], [class*="overflow-x-auto"], [class*="snap-x"]`;

const CARD_ROUNDED = /\brounded-(?:xl|2xl|3xl|\[[^\]]+\])(?:\s|$)/;
const CARD_EDGE = /(?:^|\s)(?:border|shadow|bg-white)(?:[\s-]|$)/;

const skipped = (el) => !!el.closest(SKIP_SELF) || !!el.parentElement?.closest(SKIP_INSIDE);
const className = (el) => (typeof el.className === 'string' ? el.className : '');
const domOrder = (a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1);

function shown(el, style = getComputedStyle(el)) {
  if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) return false;
  const r = el.getBoundingClientRect();
  return r.width > 0 && r.height > 0;
}

// A grid item that looks like a card: rounded with a border/shadow/white panel, or an <article>
function isCardLike(el) {
  if (!el || el.matches('form, fieldset, section') || el.querySelector('input, select, textarea, iframe, video')) return false;
  const r = el.getBoundingClientRect();
  if (r.width < 120 || r.width > 720 || r.height > 900) return false;
  if (el.tagName === 'ARTICLE') return true;
  const c = className(el);
  return CARD_ROUNDED.test(c) && CARD_EDGE.test(c);
}

function createEngine() {
  const mobile = !isDesktop();
  const distance = mobile ? 0.6 : 1;
  const FROM = {
    card: { opacity: 0, y: 40 * distance, scale: 0.97 },
    item: { opacity: 0, y: 34 * distance },
    head: { opacity: 0, y: 26 * distance },
    block: { opacity: 0, y: 30 * distance },
  };

  const registered = new Set();
  const triggers = [];
  // What the observer watches for each element: a masked photo reports no visible area while it is
  // masked, so photos are watched through their frame (parent) instead
  const watched = new Map();
  const queue = [];
  let started = false;
  let flushScheduled = false;

  const done = (el) => {
    el.dataset.rv = 'done';
    gsap.set(el, { clearProps: el.dataset.rvKind === 'img' ? 'clipPath,willChange' : 'transform,opacity,transition,willChange' });
  };

  const reveal = (items) => {
    const sorted = items.filter(el => el.isConnected && el.dataset.rv === 'pending').sort(domOrder);
    const step = Math.min(STAGGER, 0.6 / Math.max(1, sorted.length));
    sorted.forEach((el, i) => {
      el.dataset.rv = 'running';
      const delay = i * step;
      if (el.dataset.rvKind === 'img') {
        gsap.to(el, {
          clipPath: el.dataset.rvClipEnd, duration: DURATION.slow, delay, ease: 'power3.inOut', willChange: 'clip-path',
          onComplete: () => done(el)
        });
        if (el.dataset.rvZoom) gsap.to(el, { scale: 1, duration: DURATION.slow + 0.4, delay, ease: 'power2.out' });
      } else {
        gsap.to(el, {
          opacity: 1, y: 0, scale: 1, duration: DURATION.base, delay, ease: EASE, willChange: 'transform, opacity',
          onComplete: () => done(el)
        });
      }
    });
  };

  const flush = () => {
    flushScheduled = false;
    reveal(queue.splice(0));
  };

  const schedule = () => {
    if (queue.length && !flushScheduled) {
      flushScheduled = true;
      requestAnimationFrame(flush);
    }
  };

  // Content the visitor has already scrolled past (fast scrolling, slow loading) is shown at once
  const showNow = (els) => els.forEach((el) => {
    if (el.dataset.rv !== 'pending') return;
    gsap.killTweensOf(el);
    if (el.dataset.rvZoom) gsap.set(el, { scale: 1 });
    done(el);
  });

  const take = (target) => {
    io.unobserve(target);
    const els = watched.get(target) || [];
    watched.delete(target);
    return els;
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) queue.push(...take(entry.target));
      else if (entry.boundingClientRect.bottom <= 0) showNow(take(entry.target));
    });
    schedule();
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0 });

  const watch = (el) => {
    const target = el.dataset.rvKind === 'img' ? el.parentElement : el;
    if (!watched.has(target)) {
      watched.set(target, []);
      io.observe(target);
    }
    watched.get(target).push(el);
  };

  // Safety net, checked while scrolling: anything on screen that the observer has not reported
  // (the very end of the page, items moved sideways in carousels) is revealed too
  let sweepTimer = 0;
  const sweep = () => {
    sweepTimer = 0;
    const vh = window.innerHeight;
    [...watched.keys()].forEach((target) => {
      const r = target.getBoundingClientRect();
      if (r.bottom <= 0) showNow(take(target));
      else if (r.top < vh) queue.push(...take(target));
    });
    schedule();
  };
  const onScroll = () => { if (!sweepTimer) sweepTimer = setTimeout(sweep, 250); };

  // Hidden until revealed: keyboard users reach the content straight away
  const onFocus = (e) => {
    const target = e.target?.closest?.('[data-rv="pending"]');
    if (!target) return;
    const chain = [];
    for (let el = target; el; el = el.parentElement?.closest('[data-rv="pending"]')) chain.push(el);
    reveal(chain);
  };
  const onPrint = () => reveal([...registered]);

  const register = (el, kind) => {
    // React-controlled inline transforms/opacity are left alone
    if (el.dataset.rv || el.style.transform || el.style.opacity) return;
    el.dataset.rv = 'pending';
    el.dataset.rvKind = kind;
    gsap.set(el, { ...FROM[kind], transition: 'none' });
    registered.add(el);
    if (started) watch(el);
  };

  // Inside something that is still waiting to be revealed (cards reveal as a whole)
  const insidePending = (el) => {
    const owner = el.parentElement?.closest('[data-rv]');
    return !!owner && (owner.dataset.rv === 'pending' || owner.dataset.rv === 'running' || owner.dataset.rvKind === 'card');
  };

  const markCard = (el) => {
    if (el.hasAttribute('data-card') || el.hasAttribute('data-no-card')) return;
    el.setAttribute('data-card', '');
  };

  function scanGrids(root) {
    root.querySelectorAll('[class*="grid"]').forEach((grid) => {
      if (grid.dataset.rvGrid || skipped(grid)) return;
      const style = getComputedStyle(grid);
      if (!style.display.includes('grid')) return;
      const items = [...grid.children].filter(el => shown(el));
      if (items.length < 2) return;
      grid.dataset.rvGrid = '1';
      const pending = insidePending(grid);
      items.forEach((item) => {
        const card = isCardLike(item) ? item
          : (item.children.length === 1 && isCardLike(item.firstElementChild) ? item.firstElementChild : null);
        if (card && !card.closest('[data-reveal="block"]')) markCard(card);
        if (!pending) register(item, card === item ? 'card' : 'item');
      });
    });
    root.querySelectorAll('article').forEach((el) => { if (!skipped(el) && isCardLike(el)) markCard(el); });
  }

  function scanHeadings(root) {
    root.querySelectorAll('h2').forEach((h2) => {
      if (h2.dataset.rv || skipped(h2) || insidePending(h2) || h2.closest('[data-card]') || !shown(h2)) return;
      const parent = h2.parentElement;
      const siblings = [...parent.children];
      const compact = siblings.length <= 4 && parent.tagName !== 'SECTION' && !getComputedStyle(parent).display.includes('grid')
        && siblings.every(el => el.getBoundingClientRect().height < 320);
      const group = compact ? siblings : [h2, h2.nextElementSibling?.tagName === 'P' ? h2.nextElementSibling : null];
      group.filter(Boolean).forEach(el => { if (shown(el)) register(el, 'head'); });
    });
  }

  function scanImages(root) {
    const rich = richMotion();
    root.querySelectorAll('img').forEach((img) => {
      if (img.dataset.rv || skipped(img) || img.closest('[data-card], a, button')) return;
      const r = img.getBoundingClientRect();
      if (r.width < 260 || r.height < 160) return;
      const parent = img.parentElement;
      const parentStyle = getComputedStyle(parent);
      const clipped = parentStyle.overflow === 'hidden' || parentStyle.overflowY === 'hidden' || parentStyle.overflow === 'clip';
      const style = getComputedStyle(img);
      if (style.display === 'none' || Number(style.opacity) === 0 || img.style.transform) return;
      const cover = style.objectFit === 'cover';
      const radius = parseFloat(style.borderTopLeftRadius) || 0;
      const zoomable = !/(?:^|\s|:)scale-/.test(className(img));
      img.dataset.rv = 'pending';
      img.dataset.rvKind = 'img';
      img.dataset.rvClipEnd = `inset(0% 0% 0% 0% round ${radius}px)`;
      const from = { clipPath: `inset(100% 0% 0% 0% round ${radius}px)` };
      // desktop drift: the photo moves a little slower than the page inside its frame
      const parallax = rich && clipped && cover && zoomable && r.width >= 360;
      if (parallax) {
        const tween = gsap.fromTo(img, { yPercent: -5, scale: 1.12 }, {
          yPercent: 5, scale: 1.12, ease: 'none',
          scrollTrigger: { trigger: parent, start: 'top bottom', end: 'bottom top', scrub: 0.6 }
        });
        triggers.push(tween);
      } else if (clipped && zoomable) {
        img.dataset.rvZoom = '1';
        from.scale = 1.12;
      }
      gsap.set(img, from);
      registered.add(img);
      if (started) watch(img);
    });
  }

  // Remaining content blocks of each page section (and the footer): fade up as one piece each
  function scanBlocks(root) {
    const sections = root.tagName === 'FOOTER' ? [root]
      : [...root.querySelectorAll('section')].filter(s => !s.parentElement.closest('section'));
    const walk = (container, depth) => {
      [...container.children].forEach((child) => {
        if (child.dataset.rv || skipped(child)) return;
        if (child.dataset.reveal === 'block') { if (shown(child)) register(child, 'block'); return; }
        if (child.querySelector('[data-rv], [data-reveal="block"]')) {
          if (depth < 5) walk(child, depth + 1);
          return;
        }
        const style = getComputedStyle(child);
        if (!shown(child, style) || ['absolute', 'fixed', 'sticky'].includes(style.position)) return;
        if (!/block|flex|grid|table|list-item/.test(style.display)) return;
        if (child.getBoundingClientRect().height < 16 || insidePending(child)) return;
        register(child, 'block');
      });
    };
    sections.forEach((section) => {
      if (section.matches(SKIP_SELF) || section.closest(SKIP_SELF)) return;
      walk(section, 0);
    });
  }

  const scan = () => {
    document.querySelectorAll(ROOTS).forEach((root) => {
      if (root.closest('[role="dialog"]')) return;
      scanGrids(root);
      scanHeadings(root);
      scanImages(root);
      scanBlocks(root);
    });
  };

  // New content (tabs, filters, data from the server) is picked up before it is painted
  let rescanScheduled = false;
  const mo = new MutationObserver((records) => {
    if (rescanScheduled || !records.some(r => r.addedNodes.length)) return;
    rescanScheduled = true;
    requestAnimationFrame(() => {
      rescanScheduled = false;
      scan();
    });
  });

  // Parallax positions follow the page height (images, data and fonts load late)
  let refreshTimer = null;
  const ro = new ResizeObserver(() => {
    clearTimeout(refreshTimer);
    refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 200);
  });

  return {
    scan,
    start() {
      started = true;
      registered.forEach(el => { if (el.dataset.rv === 'pending') watch(el); });
      window.addEventListener('scroll', onScroll, { passive: true });
      sweepTimer = setTimeout(sweep, 400);
      document.querySelectorAll(ROOTS).forEach(root => mo.observe(root, { childList: true, subtree: true }));
      ro.observe(document.body);
      document.addEventListener('focusin', onFocus);
      window.addEventListener('beforeprint', onPrint);
    },
    destroy() {
      io.disconnect();
      watched.clear();
      clearTimeout(sweepTimer);
      window.removeEventListener('scroll', onScroll);
      mo.disconnect();
      ro.disconnect();
      clearTimeout(refreshTimer);
      document.removeEventListener('focusin', onFocus);
      window.removeEventListener('beforeprint', onPrint);
      triggers.forEach(t => { t.scrollTrigger?.kill(); t.kill(); });
      registered.forEach((el) => {
        gsap.killTweensOf(el);
        // only the properties the engine set: React keeps its own inline styles
        gsap.set(el, { clearProps: 'transform,opacity,transition,clipPath,willChange' });
        delete el.dataset.rv;
        delete el.dataset.rvKind;
        delete el.dataset.rvClipEnd;
        delete el.dataset.rvZoom;
      });
      document.querySelectorAll('[data-rv-grid]').forEach(el => delete el.dataset.rvGrid);
    },
  };
}

// Card tilt: the hovered card leans slightly towards the pointer (mouse, capable devices only)
function installTilt() {
  let active = null;
  let frame = 0;
  let last = null;
  const reset = (card) => { if (card) card.style.transform = ''; };
  const update = () => {
    frame = 0;
    if (!active || !last || active.dataset.rv === 'pending' || active.dataset.rv === 'running') return;
    const r = active.getBoundingClientRect();
    const x = (last.clientX - r.left) / r.width - 0.5;
    const y = (last.clientY - r.top) / r.height - 0.5;
    const max = r.width > 420 ? 3 : 5;
    active.style.transform = `perspective(1000px) rotateX(${(-y * max).toFixed(2)}deg) rotateY(${(x * max).toFixed(2)}deg)`;
  };
  const onMove = (e) => {
    if (e.pointerType && e.pointerType !== 'mouse') return;
    const card = e.target?.closest?.('[data-card]') || null;
    if (card !== active) {
      reset(active);
      // cards with their own transform classes keep them
      active = card && getComputedStyle(card).transform === 'none' ? card : null;
    }
    last = e;
    if (active && !frame) frame = requestAnimationFrame(update);
  };
  const onLeave = () => { reset(active); active = null; };
  document.addEventListener('pointermove', onMove, { passive: true });
  document.documentElement.addEventListener('mouseleave', onLeave);
  return () => {
    cancelAnimationFrame(frame);
    reset(active);
    document.removeEventListener('pointermove', onMove);
    document.documentElement.removeEventListener('mouseleave', onLeave);
  };
}

export default function RevealEngine() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) return undefined;
    const engine = createEngine();
    engine.scan();
    const cancel = whenSiteReady(() => engine.start());
    return () => {
      cancel();
      engine.destroy();
    };
  }, [pathname]);

  useLayoutEffect(() => (richMotion() ? installTilt() : undefined), []);

  return null;
}
