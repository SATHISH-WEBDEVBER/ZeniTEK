import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { prefersReducedMotion } from './core';

// Scroll reveals for every public page, applied to the existing markup (no per-page code):
// section headings, grid items (cards), and the remaining content blocks of each section fade and
// rise into place as they come into view, items of a group one after another.
//
// Performance: the page is read once per section (one layout pass), then elements only get a
// data-rv attribute. An IntersectionObserver adds .rv-in when an element comes into view and the
// CSS transition (opacity + translate, run by the compositor) does the rest; the attribute is removed
// when it has finished. Nothing animates frame by frame; the only scroll work is one check after
// scrolling stops.
//
// Opt out with data-reveal="off" (an element and everything in it), or data-reveal="block" to reveal
// an element as one piece (carousels). Skipped entirely for prefers-reduced-motion.

const ROOTS = 'main, footer';
const SKIP_SELF = '[data-hero], [data-reveal="off"], [role="dialog"], .leaflet-container, .client-marquee-container, [class*="animate-marquee"]';
const SKIP_INSIDE = `${SKIP_SELF}, [data-reveal="block"], .overflow-x-auto, [class*="snap-x"]`;
const OUT_OF_FLOW = /(?:^|\s)(?:absolute|fixed|sticky)(?:\s|$)/;
const CARD_ROUNDED = /(?:^|\s)rounded-(?:xl|2xl|3xl|\[[^\]]+\])(?:\s|$)/;
const CARD_EDGE = /(?:^|\s)(?:border|shadow|bg-white)(?:[\s-]|$)/;
const DURATION_MS = 650;   // longest reveal transition in index.css
const STAGGER_MS = 55;
const MAX_DELAY_MS = 330;

const classOf = (el) => (typeof el.className === 'string' ? el.className : '');
const skipped = (el) => !!el.closest(SKIP_SELF) || !!el.parentElement?.closest(SKIP_INSIDE);
const visible = (el) => el.offsetParent !== null && el.offsetHeight > 0;

function isCardLike(el) {
  if (!el || el.tagName === 'SECTION' || el.tagName === 'FORM' || el.querySelector('input, select, textarea, iframe, video')) return false;
  const w = el.offsetWidth;
  if (w < 120 || w > 720 || el.offsetHeight > 900) return false;
  if (el.tagName === 'ARTICLE') return true;
  const c = classOf(el);
  return CARD_ROUNDED.test(c) && CARD_EDGE.test(c);
}

function createEngine() {
  const seen = new WeakSet();      // registered once per page, never again (no re-hiding)
  const pending = new Set();
  const timers = new Set();

  const finish = (els) => {
    const timer = setTimeout(() => {
      timers.delete(timer);
      els.forEach((el) => {
        el.removeAttribute('data-rv');
        el.classList.remove('rv-in');
        el.style.removeProperty('--rv-delay');
      });
    }, DURATION_MS + MAX_DELAY_MS + 80);
    timers.add(timer);
  };

  // Reveal a group that came into view together, in reading order
  const reveal = (els) => {
    const list = els.filter(el => pending.has(el)).sort((a, b) =>
      (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
    if (!list.length) return;
    list.forEach((el, i) => {
      pending.delete(el);
      io.unobserve(el);
      if (i) el.style.setProperty('--rv-delay', `${Math.min(i * STAGGER_MS, MAX_DELAY_MS)}ms`);
      el.classList.add('rv-in');
    });
    finish(list);
  };

  // Already scrolled past (fast scrolling, links to the middle of a page): show at once
  const showNow = (els) => els.forEach((el) => {
    pending.delete(el);
    io.unobserve(el);
    el.removeAttribute('data-rv');
  });

  const io = new IntersectionObserver((entries) => {
    const entering = [];
    const passed = [];
    entries.forEach((entry) => {
      if (entry.isIntersecting) entering.push(entry.target);
      else if (entry.boundingClientRect.bottom <= 0) passed.push(entry.target);
    });
    if (passed.length) showNow(passed);
    if (entering.length) reveal(entering);
  }, { threshold: 0 });   // starts as soon as it enters, so even the last line of a page reveals

  // When scrolling stops, one check of what is still waiting: a very fast scroll on a busy page can
  // carry an element past the screen between two frames, and the observer never reports it.
  let idleTimer = 0;
  const settle = () => {
    idleTimer = 0;
    const vh = window.innerHeight;
    const passed = [];
    const onScreen = [];
    pending.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.bottom <= 0) passed.push(el);
      else if (r.top < vh) onScreen.push(el);
    });
    if (passed.length) showNow(passed);
    if (onScreen.length) reveal(onScreen);
  };
  const onScroll = () => {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(settle, 180);
  };

  // Read the section first (one layout pass), then mark what should reveal
  function collect(section) {
    const found = new Map();            // element -> kind
    const holders = new Set();          // ancestors of found elements
    const insideFound = (el) => {
      for (let p = el.parentElement; p && p !== section; p = p.parentElement) if (found.has(p)) return true;
      return false;
    };
    const add = (el, kind) => {
      if (seen.has(el) || found.has(el) || insideFound(el)) return;
      found.set(el, kind);
      for (let p = el.parentElement; p && p !== section && !holders.has(p); p = p.parentElement) holders.add(p);
    };
    const cards = [];

    // grids of cards: the cards rise one after another (and get the hover lift);
    // other grids (layout columns, facts, form fields) reveal as one piece
    section.querySelectorAll('.grid, [class*="grid-cols-"]').forEach((grid) => {
      if (skipped(grid) || seen.has(grid) || insideFound(grid)) return;
      const items = [...grid.children].filter(visible);
      if (items.length < 2) return;
      const cardOf = (item) => (isCardLike(item) ? item
        : (item.children.length === 1 && isCardLike(item.firstElementChild) ? item.firstElementChild : null));
      const itemCards = items.map(cardOf);
      if (itemCards.some(Boolean)) {
        items.forEach((item, i) => {
          if (itemCards[i]) cards.push(itemCards[i]);
          add(item, 'card');
        });
      } else if (grid.offsetHeight < window.innerHeight * 1.2) {
        add(grid, 'block');
      }
    });
    section.querySelectorAll('article').forEach((el) => { if (!skipped(el) && isCardLike(el)) cards.push(el); });

    // headings: the heading with its subtitle (or its small heading group)
    section.querySelectorAll('h2').forEach((h2) => {
      if (skipped(h2) || !visible(h2) || insideFound(h2)) return;
      const parent = h2.parentElement;
      const siblings = [...parent.children];
      const compact = parent !== section && siblings.length <= 4 && !/(?:^|\s)grid(?:\s|$)/.test(classOf(parent))
        && siblings.every(el => el.offsetHeight < 320);
      const group = compact ? siblings : [h2, h2.nextElementSibling?.tagName === 'P' ? h2.nextElementSibling : null];
      group.forEach(el => { if (el && visible(el)) add(el, 'head'); });
    });

    // everything else: the section's remaining blocks, each as one piece
    const walk = (container, depth) => {
      [...container.children].forEach((child) => {
        if (found.has(child) || seen.has(child) || skipped(child)) return;
        if (child.dataset.reveal === 'block') { if (visible(child)) add(child, 'block'); return; }
        if (holders.has(child)) { if (depth < 4) walk(child, depth + 1); return; }
        if (!visible(child) || OUT_OF_FLOW.test(classOf(child)) || child.offsetHeight < 16) return;
        if (child.tagName === 'SCRIPT' || child.tagName === 'STYLE') return;
        add(child, 'block');
      });
    };
    walk(section, 0);
    return { found, cards };
  }

  function mark({ found, cards }) {
    cards.forEach(el => el.setAttribute('data-card', ''));
    found.forEach((kind, el) => {
      seen.add(el);
      // React-controlled inline transforms/opacity (carousels, sliders) are left alone
      if (el.style.transform || el.style.opacity) return;
      el.setAttribute('data-rv', kind);
      pending.add(el);
      io.observe(el);
    });
  }

  const sectionsOf = (root) => (root.tagName === 'FOOTER' ? [root]
    : [...root.querySelectorAll('section')].filter(s => !s.parentElement.closest('section') && !s.matches(SKIP_SELF)));

  const scanSections = (sections) => {
    const results = sections.map(collect);   // all reads first...
    results.forEach(mark);                  // ...then all writes
  };

  // Content added later (tabs, filters, data from the server): only its own section is read again,
  // before it is painted
  let changed = new Set();
  let frame = 0;
  const topSection = (section) => {
    let top = section;
    while (top.parentElement?.closest('section')) top = top.parentElement.closest('section');
    return top;
  };
  const mo = new MutationObserver((records) => {
    records.forEach((r) => {
      if (!r.addedNodes.length || !(r.target instanceof Element) || r.target.closest(SKIP_INSIDE)) return;
      r.addedNodes.forEach((node) => {
        if (node.nodeType !== 1 || !node.isConnected) return;
        const host = node.closest('footer') || node.closest('main section');
        if (host) { changed.add(host.tagName === 'FOOTER' ? host : topSection(host)); return; }
        // a newly loaded page: its sections
        node.querySelectorAll('section').forEach((sec) => {
          if (!sec.parentElement.closest('section') && !sec.matches(SKIP_SELF)) changed.add(sec);
        });
      });
    });
    if (changed.size && !frame) {
      frame = requestAnimationFrame(() => {
        frame = 0;
        const list = [...changed].filter(s => s.isConnected);
        changed = new Set();
        scanSections(list);
      });
    }
  });

  // Keyboard users reach hidden content straight away
  const onFocus = (e) => {
    const el = e.target?.closest?.('[data-rv]');
    if (el && pending.has(el)) showNow([el]);
  };
  const onPrint = () => showNow([...pending]);

  return {
    start() {
      scanSections([...document.querySelectorAll(ROOTS)].flatMap(sectionsOf));
      document.querySelectorAll(ROOTS).forEach(root => mo.observe(root, { childList: true, subtree: true }));
      document.addEventListener('focusin', onFocus);
      window.addEventListener('beforeprint', onPrint);
      window.addEventListener('scroll', onScroll, { passive: true });
    },
    destroy() {
      io.disconnect();
      mo.disconnect();
      cancelAnimationFrame(frame);
      timers.forEach(clearTimeout);
      clearTimeout(idleTimer);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('focusin', onFocus);
      window.removeEventListener('beforeprint', onPrint);
      document.querySelectorAll('[data-rv]').forEach((el) => {
        el.removeAttribute('data-rv');
        el.classList.remove('rv-in');
        el.style.removeProperty('--rv-delay');
      });
    },
  };
}

export default function RevealEngine() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) return undefined;
    const engine = createEngine();
    engine.start();
    return () => engine.destroy();
  }, [pathname]);

  return null;
}
