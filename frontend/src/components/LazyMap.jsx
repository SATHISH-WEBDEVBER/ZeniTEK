import React, { Suspense } from 'react';

// The installation map (Leaflet) loads in its own file, so pages don't wait for the map library.
// The placeholder keeps the map's space while it loads.
const MapComponent = React.lazy(() => import('./MapComponent'));

export default function LazyMap(props) {
  return (
    <Suspense fallback={<div className="w-full h-[560px] sm:h-[600px] lg:h-[640px] rounded-3xl bg-slate-100 border border-slate-200" aria-busy="true" />}>
      <MapComponent {...props} />
    </Suspense>
  );
}
