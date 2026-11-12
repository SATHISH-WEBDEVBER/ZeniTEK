import React, { Suspense, useEffect, useRef, useState } from 'react';

// The installation map (Leaflet) loads in its own file, and only when the visitor scrolls near it,
// so pages don't download or run the map library before it is needed. The placeholder keeps the
// map's space while it loads.
const MapComponent = React.lazy(() => import('./MapComponent'));

const Placeholder = React.forwardRef((props, ref) => (
  <div ref={ref} className="w-full h-[560px] sm:h-[600px] lg:h-[640px] rounded-3xl bg-slate-100 border border-slate-200" aria-busy="true" />
));
Placeholder.displayName = 'MapPlaceholder';

export default function LazyMap(props) {
  const ref = useRef(null);
  const [near, setNear] = useState(() => typeof IntersectionObserver === 'undefined');

  useEffect(() => {
    if (near || !ref.current) return undefined;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setNear(true); io.disconnect(); }
    }, { rootMargin: '800px 0px' });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [near]);

  if (!near) return <Placeholder ref={ref} />;
  return (
    <Suspense fallback={<Placeholder />}>
      <MapComponent {...props} />
    </Suspense>
  );
}
