// Motion system: one place for the animation libraries, timings and device checks used across the site.
//
//   GSAP + ScrollTrigger : scroll reveals, hero timelines, parallax (src/motion/RevealEngine.jsx, PageHero)
//   Lenis                : smooth wheel scrolling (src/motion/SmoothScroll.jsx)
//   Framer Motion        : navbar indicator and menu open/close (Navbar.jsx)
//   CSS (index.css)      : hover and press micro-interactions on cards, buttons, icons and images
//
// Every animation is skipped when the visitor has asked for reduced motion; tilt and parallax are also
// skipped on touch screens and low-powered devices.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
gsap.config({ nullTargetWarn: false });

export { gsap, ScrollTrigger };

// Timings shared by every animation, so the whole site moves the same way
export const DURATION = { fast: 0.35, base: 0.75, slow: 1.1 };
export const EASE = 'power3.out';
export const STAGGER = 0.07;

const media = (query) => typeof window !== 'undefined' && !!window.matchMedia?.(query).matches;

export const prefersReducedMotion = () => media('(prefers-reduced-motion: reduce)');
export const canHover = () => media('(hover: hover) and (pointer: fine)');
export const isDesktop = () => media('(min-width: 1024px)');

// Few cores and little memory, or the data-saver setting: keep to simple fades
export const isLowPower = () => {
  if (typeof navigator === 'undefined') return false;
  const cores = navigator.hardwareConcurrency || 8;
  const memory = navigator.deviceMemory || 8;
  return (cores <= 4 && memory <= 4) || !!navigator.connection?.saveData;
};

// Rich effects (tilt, parallax): a mouse, a capable device, motion allowed
export const richMotion = () => !prefersReducedMotion() && canHover() && !isLowPower();

// ── Smooth-scroll instance (set by SmoothScroll.jsx) ────────────────────────
let lenisInstance = null;
export const setLenis = (lenis) => { lenisInstance = lenis; };
export const getLenis = () => lenisInstance;

// Scroll to the top of the page, through Lenis when it is running
export const scrollToTop = ({ smooth = false } = {}) => {
  if (lenisInstance) lenisInstance.scrollTo(0, { immediate: !smooth, force: true });
  else window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' });
};

// ── "Site ready": the opening sequence has finished and the page is visible ──
let siteReady = false;
const readyListeners = new Set();
export const markSiteReady = () => {
  if (siteReady) return;
  siteReady = true;
  readyListeners.forEach(fn => fn());
  readyListeners.clear();
};
// Runs fn once the page is visible (immediately after the first page); returns a cancel function
export const whenSiteReady = (fn) => {
  if (siteReady) { fn(); return () => {}; }
  readyListeners.add(fn);
  return () => readyListeners.delete(fn);
};

// Smooth scroll to an element (respects its scroll-margin), through Lenis when it is running
export const smoothScrollTo = (el, { block = 'start' } = {}) => {
  if (!el) return;
  if (lenisInstance) {
    const offset = block === 'center' ? -Math.max(0, (window.innerHeight - el.getBoundingClientRect().height) / 2) : 0;
    lenisInstance.scrollTo(el, { offset, duration: 1.1 });
  } else {
    el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block });
  }
};
