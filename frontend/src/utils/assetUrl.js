// Image paths saved in the database before the images were reorganised into /public/images
// (e.g. installation records with "/projects/project-12.webp") are translated to the new
// locations, so old records keep showing their photos. New paths pass through unchanged.
const LEGACY_PATHS = [
  [/^\/real-photos\/zenitek_photo_/, '/images/gallery/photo-'],
  [/^\/projects\/(project-)/, '/images/projects/$1'],
  [/^\/client-logos\//, '/images/clients/'],
  [/^\/home-hero\//, '/images/home-hero/'],
  [/^\/products\/placeholder\.svg$/, '/images/products/placeholder.svg'],
  [/^\/(logo|emblem)\.webp$/, '/images/brand/$1.webp'],
];

export function assetUrl(url) {
  if (typeof url !== 'string' || !url.startsWith('/')) return url;
  for (const [from, to] of LEGACY_PATHS) {
    if (from.test(url)) return url.replace(from, to);
  }
  return url;
}

// Applies assetUrl to every string in an API response (objects and arrays, any depth)
export function withCurrentAssetPaths(data) {
  if (typeof data === 'string') return assetUrl(data);
  if (Array.isArray(data)) return data.map(withCurrentAssetPaths);
  if (data && typeof data === 'object') {
    return Object.fromEntries(Object.entries(data).map(([k, v]) => [k, withCurrentAssetPaths(v)]));
  }
  return data;
}
