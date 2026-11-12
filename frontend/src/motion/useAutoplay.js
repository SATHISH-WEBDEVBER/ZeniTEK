import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from './core';

// Moves a slideshow on by itself: calls next() `interval` ms after the slide last changed - but only
// while the slideshow is on screen and not hovered or focused, never for visitors who prefer reduced
// motion, and not once `enabled` is false (e.g. after the visitor picked a slide themselves).
//
//   const { ref, running, pauseProps } = useAutoplay(active, next, { interval: 6000 });
//   <section ref={ref} {...pauseProps}> ... progress bar only while `running` ... </section>
export default function useAutoplay(active, next, { interval = 6000, enabled = true } = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reduced] = useState(prefersReducedMotion);
  const nextRef = useRef(next);
  nextRef.current = next;

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const running = enabled && !reduced && visible && !paused;

  useEffect(() => {
    if (!running) return undefined;
    const timer = setTimeout(() => nextRef.current(), interval);
    return () => clearTimeout(timer);
  }, [running, active, interval]);

  const pauseProps = {
    onMouseEnter: () => setPaused(true),
    onMouseLeave: () => setPaused(false),
    onFocus: () => setPaused(true),
    onBlur: (e) => { if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false); },
  };

  return { ref, running, pauseProps };
}
