/**
 * ZeniTEK API Utility
 * Centralised API base URL and authenticated request helper
 */

export const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// ─── Client Admin Auth Helpers ───────────────────────────────────────────────
// The Client Admin (website CMS) signs in with username/password (role "client").
// The JWT lives in sessionStorage, so closing the browser tab signs out.

const CLIENT_SESSION_KEY = 'zenitek_session_client';
export const CLIENT_UNAUTHORIZED_EVENT = 'zenitek:client-unauthorized';

// Remove the token left behind by the old API-key login
try { localStorage.removeItem('zenitek_admin_token'); } catch { /* storage unavailable */ }

function readClientSession() {
  try { return JSON.parse(sessionStorage.getItem(CLIENT_SESSION_KEY) || 'null'); } catch { return null; }
}

export function getAdminToken() {
  return readClientSession()?.token || null;
}

export function getAdminUsername() {
  return readClientSession()?.username || '';
}

export function setAdminToken(token, username = '') {
  try { sessionStorage.setItem(CLIENT_SESSION_KEY, JSON.stringify({ token, username })); } catch { /* storage unavailable */ }
}

export function clearAdminToken() {
  try { sessionStorage.removeItem(CLIENT_SESSION_KEY); } catch { /* storage unavailable */ }
}

export function isAdminLoggedIn() {
  return Boolean(getAdminToken());
}

/** Authenticated headers for Client Admin API calls (Bearer JWT). */
export function adminHeaders(extraHeaders = {}) {
  const token = getAdminToken();
  return { ...(token ? { Authorization: `Bearer ${token}` } : {}), ...extraHeaders };
}

// ─── Generic fetch wrapper ───────────────────────────────────────────────────

/**
 * apiFetch - wraps fetch with base URL, JSON parsing, and error extraction.
 * A 401 on a Client Admin request clears the session and notifies the admin panel.
 * @param {string} path - relative path e.g. '/products'
 * @param {RequestInit} options
 * @returns {Promise<any>} parsed JSON
 */
export async function apiFetch(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const response = await fetch(url, options);

  let data;
  try {
    data = await response.json();
  } catch {
    data = { success: false, message: `HTTP ${response.status}: ${response.statusText}` };
  }

  if (!response.ok) {
    const sentClientToken = Boolean(options.headers?.Authorization) && options.headers.Authorization === adminHeaders().Authorization;
    if (response.status === 401 && sentClientToken) {
      clearAdminToken();
      window.dispatchEvent(new Event(CLIENT_UNAUTHORIZED_EVENT));
    }
    const message = data?.message || `Request failed (${response.status})`;
    throw new Error(message);
  }

  return data;
}

// ─── Products API ────────────────────────────────────────────────────────────

/** Public: fetch all published products */
export async function fetchPublicProducts(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return apiFetch(`/public/products${qs ? `?${qs}` : ''}`);
}

/** Public: fetch single published product by slug */
export async function fetchPublicProduct(slug) {
  return apiFetch(`/public/products/${slug}`);
}

/** Admin: fetch all products */
export async function adminFetchProducts(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return apiFetch(`/products${qs ? `?${qs}` : ''}`, {
    headers: adminHeaders()
  });
}

/** Admin: fetch single product by ID */
export async function adminFetchProduct(id) {
  return apiFetch(`/products/${id}`, { headers: adminHeaders() });
}

/** Admin: create product (with image files) */
export async function adminCreateProduct(formData) {
  return apiFetch('/products', {
    method: 'POST',
    headers: adminHeaders(), // No Content-Type — browser sets multipart/form-data
    body: formData
  });
}

/** Admin: update product (with optional image files) */
export async function adminUpdateProduct(id, formData) {
  return apiFetch(`/products/${id}`, {
    method: 'PUT',
    headers: adminHeaders(),
    body: formData
  });
}

/** Admin: toggle product published status */
export async function adminToggleProduct(id, published) {
  return apiFetch(`/products/${id}/status`, {
    method: 'PATCH',
    headers: adminHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ published })
  });
}

/** Admin: delete product */
export async function adminDeleteProduct(id) {
  return apiFetch(`/products/${id}`, {
    method: 'DELETE',
    headers: adminHeaders()
  });
}

/** Admin: delete a single product image */
export async function adminDeleteProductImage(productId, imageId) {
  return apiFetch(`/products/${productId}/images/${imageId}`, {
    method: 'DELETE',
    headers: adminHeaders()
  });
}

// ─── Gallery API ─────────────────────────────────────────────────────────────

/** Public: fetch all published gallery items */
export async function fetchPublicGallery(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return apiFetch(`/public/gallery${qs ? `?${qs}` : ''}`);
}

/** Admin: fetch all gallery items */
export async function adminFetchGallery(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return apiFetch(`/gallery${qs ? `?${qs}` : ''}`, {
    headers: adminHeaders()
  });
}

/** Admin: fetch single gallery item by ID */
export async function adminFetchGalleryItem(id) {
  return apiFetch(`/gallery/${id}`, { headers: adminHeaders() });
}

/** Admin: create gallery item with image */
export async function adminCreateGalleryItem(formData) {
  return apiFetch('/gallery', {
    method: 'POST',
    headers: adminHeaders(),
    body: formData
  });
}

/** Admin: update gallery item */
export async function adminUpdateGalleryItem(id, formData) {
  return apiFetch(`/gallery/${id}`, {
    method: 'PUT',
    headers: adminHeaders(),
    body: formData
  });
}

/** Admin: toggle gallery published status */
export async function adminToggleGallery(id, published) {
  return apiFetch(`/gallery/${id}/status`, {
    method: 'PATCH',
    headers: adminHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ published })
  });
}

/** Admin: delete gallery item */
export async function adminDeleteGalleryItem(id) {
  return apiFetch(`/gallery/${id}`, {
    method: 'DELETE',
    headers: adminHeaders()
  });
}

// ─── Admin Auth ──────────────────────────────────────────────────────────────

/** Authenticate the Client Admin (username + password from backend .env) and store the JWT */
export async function adminLogin(username, password) {
  const data = await apiFetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, role: 'client' })
  });
  if (data.token) setAdminToken(data.token, data.user?.username || username);
  return data;
}

// ─── Sections API ─────────────────────────────────────────────────────────────

/** Public: fetch all published sections (for navbar) */
export async function fetchPublicSections() {
  return apiFetch('/public/sections');
}

/** Public: fetch single published section by slug */
export async function fetchPublicSection(slug) {
  return apiFetch(`/public/sections/${slug}`);
}

/** Admin: fetch all sections */
export async function adminFetchSections() {
  return apiFetch('/sections', { headers: adminHeaders() });
}

/** Admin: fetch single section by slug */
export async function adminFetchSection(slug) {
  return apiFetch(`/sections/${slug}`, { headers: adminHeaders() });
}

/** Admin: create section (with optional thumbnail) */
export async function adminCreateSection(formData) {
  return apiFetch('/sections', {
    method: 'POST',
    headers: adminHeaders(),
    body: formData
  });
}

/** Admin: update section */
export async function adminUpdateSection(slug, formData) {
  return apiFetch(`/sections/${slug}`, {
    method: 'PUT',
    headers: adminHeaders(),
    body: formData
  });
}

/** Admin: add body images to section */
export async function adminAddSectionImages(slug, formData) {
  return apiFetch(`/sections/${slug}/images`, {
    method: 'POST',
    headers: adminHeaders(),
    body: formData
  });
}

/** Admin: delete a section body image */
export async function adminDeleteSectionImage(slug, imageId) {
  return apiFetch(`/sections/${slug}/images/${imageId}`, {
    method: 'DELETE',
    headers: adminHeaders()
  });
}

/** Admin: toggle section published status */
export async function adminToggleSection(slug, published) {
  return apiFetch(`/sections/${slug}/status`, {
    method: 'PATCH',
    headers: adminHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ published })
  });
}

/** Admin: delete section */
export async function adminDeleteSection(slug) {
  return apiFetch(`/sections/${slug}`, {
    method: 'DELETE',
    headers: adminHeaders()
  });
}

/** Admin: seed / verify default 7 sections */
export async function adminSeedSections() {
  return apiFetch('/sections/seed', {
    method: 'POST',
    headers: adminHeaders()
  });
}

