import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Must match the divider selector in index.css
const SECTION_SELECTOR = 'main section:not(section section):not([class*="rounded"]):not(.no-divider)';

// Adds .divider-in to each page section once its bottom edge scrolls into view,
// which draws the section-end divider line (styles live in index.css).
export default function SectionDividers() {
  const { pathname } = useLocation();

  useEffect(() => {
    const reveal = (section) => section.classList.add('divider-in');

    // Old browsers: just show the lines
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll(SECTION_SELECTOR).forEach(reveal);
      return undefined;
    }

    // The root is shrunk by 8% at the bottom, so a section only counts once its end
    // (where the line sits) is comfortably on screen.
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const rootBottom = entry.rootBounds ? entry.rootBounds.bottom : window.innerHeight;
        if (entry.boundingClientRect.bottom <= rootBottom + 1) {
          reveal(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: Array.from({ length: 101 }, (_, i) => i / 100) });

    const observeAll = () => {
      document.querySelectorAll(SECTION_SELECTOR).forEach((section) => {
        if (section.dataset.dividerObserved) return;
        section.dataset.dividerObserved = 'true';
        io.observe(section);
      });
    };

    observeAll();

    // Sections rendered later (CMS content, lazy data) get observed too
    const main = document.querySelector('main');
    const mo = main ? new MutationObserver(observeAll) : null;
    if (mo) mo.observe(main, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      if (mo) mo.disconnect();
      document.querySelectorAll('[data-divider-observed]').forEach((el) => {
        delete el.dataset.dividerObserved;
      });
    };
  }, [pathname]);

  return null;
}
