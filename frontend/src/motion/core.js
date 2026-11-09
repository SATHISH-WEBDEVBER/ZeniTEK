// Motion system: shared helpers for the site's animations.
//
// Everything that moves is done with CSS transitions/animations of opacity and transform-type
// properties (translate / scale), which the browser runs on its compositor - they stay smooth even
// while the page is busy loading images or data. JavaScript only decides *when* something starts
// (an IntersectionObserver adds a class); it never animates frame by frame, and scrolling is the
// browser's own native scrolling.
//
//   src/motion/RevealEngine.jsx : scroll reveals (headings, grids, cards, blocks) for every page
//   src/components/PageHero.jsx : hero entrance (title words, subtitle, buttons, facts)
//   src/index.css (MOTION SYSTEM): the animations themselves, hover effects, reduced-motion rules
//   Navbar.jsx                  : menu highlight and menus (Framer Motion, user-triggered only)

const media = (query) => typeof window !== 'undefined' && !!window.matchMedia?.(query).matches;

export const prefersReducedMotion = () => media('(prefers-reduced-motion: reduce)');

// Scroll to the top of the page (instant on page change, smooth on request)
export const scrollToTop = ({ smooth = false } = {}) => {
  window.scrollTo({ top: 0, behavior: smooth && !prefersReducedMotion() ? 'smooth' : 'auto' });
};

// Smooth scroll to an element (respects its scroll-margin-top)
export const smoothScrollTo = (el, { block = 'start' } = {}) => {
  if (!el) return;
  el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block });
};
