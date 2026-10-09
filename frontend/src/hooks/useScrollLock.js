import { useEffect } from 'react';

// Shared lock count so nested overlays (e.g. a lightbox opened from the mobile menu)
// only release the page scroll when the last one closes.
let lockCount = 0;
let savedStyles = null;

// Freezes background page scrolling while `active` is true (for lightboxes, menus, admin dialogs).
// Pads the body by the scrollbar width so the page doesn't shift when the scrollbar disappears.
export default function useScrollLock(active) {
  useEffect(() => {
    if (!active) return undefined;

    if (lockCount === 0) {
      const { body } = document;
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      savedStyles = { overflow: body.style.overflow, paddingRight: body.style.paddingRight };
      body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;
    }
    lockCount += 1;

    return () => {
      lockCount -= 1;
      if (lockCount === 0 && savedStyles) {
        document.body.style.overflow = savedStyles.overflow;
        document.body.style.paddingRight = savedStyles.paddingRight;
        savedStyles = null;
      }
    };
  }, [active]);
}

// Calls onClose when Escape is pressed while `active` is true.
export function useEscapeKey(active, onClose) {
  useEffect(() => {
    if (!active) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, onClose]);
}
