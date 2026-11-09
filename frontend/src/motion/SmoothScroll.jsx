import { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { gsap, ScrollTrigger, setLenis, prefersReducedMotion } from './core';

// Smooth wheel scrolling for the public site (Lenis), driven by GSAP's ticker so scroll-linked
// animations stay in step. Touch screens keep their native scrolling. Scrollable panels inside the
// page (menus, dialogs, tables) keep their own scrolling, and a map keeps the wheel while it zooms.
export default function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;

    const lenis = new Lenis({
      lerp: 0.11,
      smoothWheel: true,
      allowNestedScroll: true,
      stopInertiaOnNavigate: true,
      // a map keeps the wheel only while it is zooming with it (the installation map: after a click)
      prevent: (node) => (node.classList?.contains('leaflet-container') && node.dataset.wheelZoom !== 'off')
        || node.getAttribute?.('role') === 'dialog',
    });
    setLenis(lenis);

    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    // GSAP's default lag smoothing stays on, so entrance animations are not skipped after a busy frame
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
