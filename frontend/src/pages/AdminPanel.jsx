import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  adminLogin, adminFetchProducts, adminCreateProduct, adminUpdateProduct,
  adminToggleProduct, adminDeleteProduct, adminDeleteProductImage,
  adminFetchGallery, adminCreateGalleryItem, adminUpdateGalleryItem,
  adminToggleGallery, adminDeleteGalleryItem,
  adminFetchSections, adminCreateSection, adminUpdateSection,
  adminAddSectionImages, adminDeleteSectionImage, adminToggleSection,
  adminDeleteSection, adminSeedSections,
  isAdminLoggedIn, clearAdminToken
} from '../utils/api';
import {
  Package, Image, LogIn, LogOut, Plus, Edit2, Trash2, Eye, EyeOff,
  X, Upload, CheckCircle, AlertCircle, Loader, ChevronDown, ChevronUp,
  RefreshCw, Tag, Star, Layers, ExternalLink
} from 'lucide-react';

/* ─── Toast notification ──────────────────────────────────────────────────── */
function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[99999] flex items-center space-x-3 px-5 py-3 rounded-2xl shadow-2xl text-sm font-bold animate-fade-in ${
      type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
    }`}>
      {type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 opacity-80 hover:opacity-100 cursor-pointer"><X className="w-4 h-4" /></button>
    </div>
  );
}

/* ─── Confirm dialog ──────────────────────────────────────────────────────── */
function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-[99998] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4">
        <p className="text-slate-800 font-semibold text-sm">{message}</p>
        <div className="flex space-x-3">
          <button onClick={onConfirm} className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm cursor-pointer transition-colors">Delete</button>
          <button onClick={onCancel} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm cursor-pointer transition-colors">Cancel</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Product Form ────────────────────────────────────────────────────────── */
function ProductForm({ product, onSave, onCancel, toast }) {
  const [form, setForm] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    category: product?.category || 'Tunnel Type',
    shortDescription: product?.shortDescription || '',
    description: product?.description || '',
    features: (product?.features || []).join('\n'),
    specifications: product?.specifications || [],
    displayOrder: product?.displayOrder ?? 0,
    published: product?.published || false
  });
  const [newSpec, setNewSpec] = useState({ label: '', value: '' });
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [existingImages, setExistingImages] = useState(product?.images || []);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef();

  const CATEGORIES = ['Tunnel Type', 'Box Type', 'Solar Thermal', 'Accessories', 'Other'];

  const handleFiles = (e) => {
    const selected = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selected]);
    const newPreviews = selected.map(f => URL.createObjectURL(f));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeNewFile = (idx) => {
    setFiles(prev => prev.filter((_, i) => i !== idx));
    setPreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const removeExistingImage = async (imgId) => {
    if (!product?._id) return;
    try {
      await adminDeleteProductImage(product._id, imgId);
      setExistingImages(prev => prev.filter(i => i._id !== imgId));
      toast('Image removed', 'success');
    } catch (err) {
      toast(err.message, 'error');
    }
  };

  const addSpec = () => {
    if (!newSpec.label || !newSpec.value) return;
    setForm(f => ({ ...f, specifications: [...f.specifications, { ...newSpec }] }));
    setNewSpec({ label: '', value: '' });
  };

  const removeSpec = (idx) => {
    setForm(f => ({ ...f, specifications: f.specifications.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.category) {
      toast('Name and category are required', 'error');
      return;
    }

    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('slug', form.slug || form.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-'));
      fd.append('category', form.category);
      fd.append('shortDescription', form.shortDescription);
      fd.append('description', form.description);
      fd.append('features', JSON.stringify(form.features.split('\n').map(s => s.trim()).filter(Boolean)));
      fd.append('specifications', JSON.stringify(form.specifications));
      fd.append('displayOrder', form.displayOrder);
      fd.append('published', form.published);

      // For updates, send which existing images to keep
      if (product?._id) {
        fd.append('keepImageIds', JSON.stringify(existingImages.map(i => i._id)));
      }

      for (const file of files) fd.append('images', file);

      const result = product?._id
        ? await adminUpdateProduct(product._id, fd)
        : await adminCreateProduct(fd);

      toast(result.message, 'success');
      onSave();
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Basic Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Product Name *</label>
          <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#002DC2]/30 focus:border-[#002DC2]"
            placeholder="e.g. SOLDRY 1210 - 300" required />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Slug (URL identifier)</label>
          <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }))}
            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#002DC2]/30"
            placeholder="auto-generated if blank" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
          <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#002DC2]/30">
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Display Order</label>
          <input type="number" value={form.displayOrder} onChange={e => setForm(f => ({ ...f, displayOrder: Number(e.target.value) }))}
            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#002DC2]/30" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">Short Description</label>
        <input value={form.shortDescription} onChange={e => setForm(f => ({ ...f, shortDescription: e.target.value }))}
          className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#002DC2]/30"
          placeholder="One-line product summary" maxLength={500} />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">Full Description</label>
        <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          rows={4} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#002DC2]/30 resize-none"
          placeholder="Detailed product description..." />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">Features (one per line)</label>
        <textarea value={form.features} onChange={e => setForm(f => ({ ...f, features: e.target.value }))}
          rows={4} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#002DC2]/30 resize-none"
          placeholder="40% Faster Drying&#10;SS304 Food-Grade Trays&#10;PLC Auto Control" />
      </div>

      {/* Specifications */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-2">Specifications</label>
        <div className="space-y-2 mb-3">
          {form.specifications.map((spec, i) => (
            <div key={i} className="flex items-center space-x-2 bg-slate-50 rounded-xl px-3 py-2">
              <span className="text-xs font-bold text-slate-700 flex-1">{spec.label}: <span className="font-normal">{spec.value}</span></span>
              <button type="button" onClick={() => removeSpec(i)} className="text-red-400 hover:text-red-600 cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
        <div className="flex space-x-2">
          <input value={newSpec.label} onChange={e => setNewSpec(s => ({ ...s, label: e.target.value }))}
            className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#002DC2]/30"
            placeholder="Label (e.g. Floor Area)" />
          <input value={newSpec.value} onChange={e => setNewSpec(s => ({ ...s, value: e.target.value }))}
            className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#002DC2]/30"
            placeholder="Value (e.g. 150 sq.ft)" />
          <button type="button" onClick={addSpec}
            className="px-4 py-2 bg-[#002DC2] text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-[#001fa0]">Add</button>
        </div>
      </div>

      {/* Existing images */}
      {existingImages.length > 0 && (
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">Existing Images</label>
          <div className="flex flex-wrap gap-3">
            {existingImages.map(img => (
              <div key={img._id} className="relative group">
                <img src={img.url} alt={img.alt} className="w-20 h-20 object-cover rounded-xl border border-slate-200" />
                {img.isPrimary && <span className="absolute top-1 left-1 bg-amber-500 text-white text-[9px] font-black px-1.5 rounded">PRIMARY</span>}
                <button type="button" onClick={() => removeExistingImage(img._id)}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New image upload */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-2">Add Images (up to 10)</label>
        <div className="flex flex-wrap gap-3">
          {previews.map((src, i) => (
            <div key={i} className="relative group">
              <img src={src} className="w-20 h-20 object-cover rounded-xl border border-slate-200" alt="preview" />
              <button type="button" onClick={() => removeNewFile(i)}
                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center cursor-pointer">
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          <button type="button" onClick={() => fileRef.current.click()}
            className="w-20 h-20 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:border-[#002DC2] hover:text-[#002DC2] cursor-pointer transition-colors">
            <Upload className="w-5 h-5" />
            <span className="text-[9px] mt-1">Upload</span>
          </button>
          <input ref={fileRef} type="file" multiple accept="image/*" onChange={handleFiles} className="hidden" />
        </div>
      </div>

      {/* Published toggle */}
      <label className="flex items-center space-x-3 cursor-pointer">
        <div className={`w-11 h-6 rounded-full transition-colors relative ${form.published ? 'bg-emerald-500' : 'bg-slate-300'}`}
          onClick={() => setForm(f => ({ ...f, published: !f.published }))}>
          <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.published ? 'translate-x-5' : 'translate-x-0.5'}`} />
        </div>
        <span className="text-sm font-bold text-slate-700">{form.published ? 'Published (Live on website)' : 'Draft (Not visible publicly)'}</span>
      </label>

      {/* Actions */}
      <div className="flex space-x-3 pt-2">
        <button type="submit" disabled={saving}
          className="flex-1 py-3 bg-[#002DC2] hover:bg-[#001fa0] text-white font-bold rounded-xl text-sm cursor-pointer disabled:opacity-60 flex items-center justify-center space-x-2 transition-colors">
          {saving && <Loader className="w-4 h-4 animate-spin" />}
          <span>{saving ? 'Saving...' : (product?._id ? 'Update Product' : 'Create Product')}</span>
        </button>
        <button type="button" onClick={onCancel}
          className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm cursor-pointer transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}

/* ─── Gallery Form ────────────────────────────────────────────────────────── */
function GalleryForm({ item, onSave, onCancel, toast }) {
  const [form, setForm] = useState({
    title: item?.title || '',
    description: item?.description || '',
    category: item?.category || 'box_dryers',
    location: item?.location || '',
    state: item?.state || '',
    productModel: item?.productModel || '',
    capacity: item?.capacity || '',
    lat: item?.lat || '',
    lng: item?.lng || '',
    displayOrder: item?.displayOrder ?? 0,
    published: item?.published || false
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(item?.image?.url || null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef();

  const GALLERY_CATS = [
    { id: 'box_dryers', label: 'Box Type Dryers' },
    { id: 'tunnel_external', label: 'Polyhouse Tunnels' },
    { id: 'tunnel_internal', label: 'Tunnel Interior & Trays' },
    { id: 'trays_produce', label: 'Produce & SS304 Trays' },
    { id: 'engineering', label: 'Engineering & Packaging' },
    { id: 'Other', label: 'Other' }
  ];

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.category) {
      toast('Title and category are required', 'error');
      return;
    }
    if (!item?._id && !file) {
      toast('Please upload an image', 'error');
      return;
    }

    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (file) fd.append('image', file);

      const result = item?._id
        ? await adminUpdateGalleryItem(item._id, fd)
        : await adminCreateGalleryItem(fd);

      toast(result.message, 'success');
      onSave();
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Image upload */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-2">Gallery Image {!item?._id && '*'}</label>
        <div className="flex items-center space-x-4">
          {preview ? (
            <div className="relative group">
              <img src={preview} className="w-32 h-24 object-cover rounded-xl border border-slate-200" alt="preview" />
              <button type="button" onClick={() => { setFile(null); setPreview(item?.image?.url || null); }}
                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full items-center justify-center cursor-pointer hidden group-hover:flex">
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => fileRef.current.click()}
              className="w-32 h-24 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:border-[#002DC2] cursor-pointer transition-colors">
              <Upload className="w-6 h-6" />
              <span className="text-[10px] mt-1">Choose Image</span>
            </button>
          )}
          {preview && (
            <button type="button" onClick={() => fileRef.current.click()}
              className="text-xs text-[#002DC2] font-bold hover:underline cursor-pointer">Change image</button>
          )}
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Title *</label>
          <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#002DC2]/30"
            placeholder="e.g. SUNDRY 50 at Erode" required />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
          <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#002DC2]/30">
            {GALLERY_CATS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">Description / Caption</label>
        <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          rows={2} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#002DC2]/30 resize-none"
          placeholder="Short caption for the image..." />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { key: 'location', label: 'Location', ph: 'e.g. Erode Works' },
          { key: 'state', label: 'State', ph: 'e.g. Tamil Nadu' },
          { key: 'productModel', label: 'Product Model', ph: 'e.g. SUNDRY 50' },
          { key: 'capacity', label: 'Capacity', ph: 'e.g. 100 kg' },
          { key: 'lat', label: 'Latitude', ph: '11.3410' },
          { key: 'lng', label: 'Longitude', ph: '77.7172' }
        ].map(({ key, label, ph }) => (
          <div key={key}>
            <label className="block text-xs font-bold text-slate-700 mb-1">{label}</label>
            <input value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#002DC2]/30"
              placeholder={ph} />
          </div>
        ))}
      </div>

      <div className="flex items-center space-x-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Display Order</label>
          <input type="number" value={form.displayOrder} onChange={e => setForm(f => ({ ...f, displayOrder: Number(e.target.value) }))}
            className="w-28 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#002DC2]/30" />
        </div>
      </div>

      <label className="flex items-center space-x-3 cursor-pointer">
        <div className={`w-11 h-6 rounded-full transition-colors relative ${form.published ? 'bg-emerald-500' : 'bg-slate-300'}`}
          onClick={() => setForm(f => ({ ...f, published: !f.published }))}>
          <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.published ? 'translate-x-5' : 'translate-x-0.5'}`} />
        </div>
        <span className="text-sm font-bold text-slate-700">{form.published ? 'Published' : 'Draft'}</span>
      </label>

      <div className="flex space-x-3 pt-2">
        <button type="submit" disabled={saving}
          className="flex-1 py-3 bg-[#002DC2] hover:bg-[#001fa0] text-white font-bold rounded-xl text-sm cursor-pointer disabled:opacity-60 flex items-center justify-center space-x-2 transition-colors">
          {saving && <Loader className="w-4 h-4 animate-spin" />}
          <span>{saving ? 'Saving...' : (item?._id ? 'Update Item' : 'Upload to Gallery')}</span>
        </button>
        <button type="button" onClick={onCancel}
          className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm cursor-pointer transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}

/* ─── Section Form ────────────────────────────────────────────────────────── */
function SectionForm({ section, onSave, onCancel, toast }) {
  const [form, setForm] = useState({
    title: section?.title || '',
    subtitle: section?.subtitle || '',
    slug: section?.slug || '',
    content: section?.content || '',
    displayOrder: section?.displayOrder ?? 0,
    published: section?.published ?? true,
    thumbnailUrl: section?.thumbnail?.url || ''
  });
  const [highlights, setHighlights] = useState(section?.highlights || []);
  const [newHighlight, setNewHighlight] = useState('');
  
  // Thumbnail
  const [thumbFile, setThumbFile] = useState(null);
  const [thumbPreview, setThumbPreview] = useState(section?.thumbnail?.url || null);
  const thumbRef = useRef();

  // Body images
  const [existingImages, setExistingImages] = useState(section?.images || []);
  const [bodyFiles, setBodyFiles] = useState([]);
  const [bodyPreviews, setBodyPreviews] = useState([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const bodyRef = useRef();

  const [saving, setSaving] = useState(false);

  const handleThumbFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setThumbFile(f);
    setThumbPreview(URL.createObjectURL(f));
  };

  const handleBodyFiles = (e) => {
    const selected = Array.from(e.target.files);
    setBodyFiles(prev => [...prev, ...selected]);
    const previews = selected.map(f => URL.createObjectURL(f));
    setBodyPreviews(prev => [...prev, ...previews]);
  };

  const removeBodyFile = (idx) => {
    setBodyFiles(prev => prev.filter((_, i) => i !== idx));
    setBodyPreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const removeExistingBodyImage = async (imgId) => {
    if (!section?.slug) return;
    try {
      await adminDeleteSectionImage(section.slug, imgId);
      setExistingImages(prev => prev.filter(i => i._id !== imgId));
      toast('Body image removed', 'success');
    } catch (err) {
      toast(err.message, 'error');
    }
  };

  const addHighlight = () => {
    if (!newHighlight.trim()) return;
    setHighlights(prev => [...prev, newHighlight.trim()]);
    setNewHighlight('');
  };

  const removeHighlight = (idx) => {
    setHighlights(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.slug) {
      toast('Title and slug are required', 'error');
      return;
    }

    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('subtitle', form.subtitle);
      fd.append('slug', form.slug.toLowerCase().trim());
      fd.append('content', form.content);
      fd.append('highlights', JSON.stringify(highlights));
      fd.append('displayOrder', form.displayOrder);
      fd.append('published', form.published);
      if (form.thumbnailUrl) fd.append('thumbnailUrl', form.thumbnailUrl);
      if (thumbFile) fd.append('thumbnail', thumbFile);

      let result;
      if (section?.slug) {
        result = await adminUpdateSection(section.slug, fd);
      } else {
        result = await adminCreateSection(fd);
      }

      // If new body files or new image URL added
      if (bodyFiles.length > 0 || newImageUrl.trim()) {
        const bodyFd = new FormData();
        bodyFiles.forEach(f => bodyFd.append('images', f));
        if (newImageUrl.trim()) bodyFd.append('imageUrl', newImageUrl.trim());
        await adminAddSectionImages(form.slug, bodyFd);
      }

      toast(result?.message || 'Section saved successfully', 'success');
      onSave();
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-h-[75vh] overflow-y-auto pr-1">
      {/* Title & Slug */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Title *</label>
          <input
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#002DC2]/30"
            placeholder="e.g. Solar Thermal System"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            URL Slug * <span className="text-slate-400 font-normal">(/slug)</span>
          </label>
          <input
            value={form.slug}
            onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#002DC2]/30 font-mono text-xs"
            placeholder="e.g. solar-thermal-system"
            required
          />
        </div>
      </div>

      {/* Subtitle */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">Subtitle / Short Summary</label>
        <input
          value={form.subtitle}
          onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))}
          className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#002DC2]/30"
          placeholder="Brief 1-2 sentence description shown in dropdown and hero"
        />
      </div>

      {/* Thumbnail Image */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-2">Category Thumbnail Image</label>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {thumbPreview ? (
            <div className="relative group w-36 h-24 rounded-xl overflow-hidden border border-slate-200 shrink-0 bg-slate-50">
              <img src={thumbPreview} className="w-full h-full object-cover" alt="thumbnail preview" />
              <button
                type="button"
                onClick={() => {
                  setThumbFile(null);
                  setThumbPreview(null);
                  setForm(f => ({ ...f, thumbnailUrl: '' }));
                }}
                className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center cursor-pointer shadow hover:bg-red-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => thumbRef.current?.click()}
              className="w-36 h-24 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:border-[#002DC2] cursor-pointer transition-colors shrink-0"
            >
              <Upload className="w-6 h-6" />
              <span className="text-[10px] mt-1 font-bold">Upload Image</span>
            </button>
          )}

          <div className="flex-1 space-y-2">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => thumbRef.current?.click()}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg cursor-pointer transition-colors"
              >
                Choose File
              </button>
              <input ref={thumbRef} type="file" accept="image/*" onChange={handleThumbFile} className="hidden" />
              <span className="text-xs text-slate-400">or enter image path / URL:</span>
            </div>
            <input
              type="text"
              value={form.thumbnailUrl}
              onChange={e => {
                setForm(f => ({ ...f, thumbnailUrl: e.target.value }));
                if (e.target.value) setThumbPreview(e.target.value);
              }}
              className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#002DC2]"
              placeholder="e.g. /real-photos/zenitek_photo_21.jpeg"
            />
          </div>
        </div>
      </div>

      {/* Highlights (Bullet Points) */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">Key Highlights & Capabilities</label>
        <div className="space-y-2">
          {highlights.map((h, i) => (
            <div key={i} className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs text-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className="flex-1 leading-snug">{h}</span>
              <button
                type="button"
                onClick={() => removeHighlight(i)}
                className="text-slate-400 hover:text-red-500 cursor-pointer p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          <div className="flex items-center space-x-2 pt-1">
            <input
              value={newHighlight}
              onChange={e => setNewHighlight(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addHighlight(); } }}
              placeholder="Add key highlight feature (e.g. MNRE Enlisted, Zero electricity bills)..."
              className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#002DC2]/30"
            />
            <button
              type="button"
              onClick={addHighlight}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Rich Content Textarea */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">
          Detailed Page Content <span className="text-slate-400 font-normal">(paragraphs, specifications, overview)</span>
        </label>
        <textarea
          rows={5}
          value={form.content}
          onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
          className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#002DC2]/30 leading-relaxed"
          placeholder="Write comprehensive technical and promotional information for this page..."
        />
      </div>

      {/* Additional Body Images Gallery */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-2">Additional Page Photos & Field Images</label>
        
        {/* Existing images */}
        {existingImages.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
            {existingImages.map(img => (
              <div key={img._id} className="relative group rounded-lg overflow-hidden border border-slate-200 aspect-video bg-slate-50">
                <img src={img.url} className="w-full h-full object-cover" alt="body" />
                <button
                  type="button"
                  onClick={() => removeExistingBodyImage(img._id)}
                  className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center cursor-pointer shadow hover:bg-red-600"
                  title="Remove image"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* New upload previews */}
        {bodyPreviews.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
            {bodyPreviews.map((p, idx) => (
              <div key={idx} className="relative group rounded-lg overflow-hidden border border-blue-300 aspect-video bg-blue-50">
                <img src={p} className="w-full h-full object-cover" alt="new preview" />
                <button
                  type="button"
                  onClick={() => removeBodyFile(idx)}
                  className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center cursor-pointer shadow hover:bg-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => bodyRef.current?.click()}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg cursor-pointer flex items-center space-x-1.5 transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Body Images</span>
          </button>
          <input
            ref={bodyRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleBodyFiles}
            className="hidden"
          />
          <input
            type="text"
            value={newImageUrl}
            onChange={e => setNewImageUrl(e.target.value)}
            placeholder="or add image URL (e.g. /real-photos/...)"
            className="flex-1 min-w-[200px] border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#002DC2]"
          />
        </div>
      </div>

      {/* Display Order & Published Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100">
        <div className="flex items-center space-x-2">
          <label className="text-xs font-bold text-slate-700">Display Order:</label>
          <input
            type="number"
            min="0"
            value={form.displayOrder}
            onChange={e => setForm(f => ({ ...f, displayOrder: Number(e.target.value) }))}
            className="w-20 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#002DC2]/30"
          />
        </div>

        <label className="flex items-center space-x-3 cursor-pointer">
          <div
            className={`w-11 h-6 rounded-full transition-colors relative ${form.published ? 'bg-emerald-500' : 'bg-slate-300'}`}
            onClick={() => setForm(f => ({ ...f, published: !f.published }))}
          >
            <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.published ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </div>
          <span className="text-sm font-bold text-slate-700">{form.published ? 'Published (Live)' : 'Draft (Hidden)'}</span>
        </label>
      </div>

      {/* Actions */}
      <div className="flex space-x-3 pt-4 border-t border-slate-100">
        <button
          type="submit"
          disabled={saving}
          className="flex-1 py-3 bg-[#002DC2] hover:bg-[#001fa0] text-white font-bold rounded-xl text-sm cursor-pointer disabled:opacity-60 flex items-center justify-center space-x-2 transition-colors shadow-md"
        >
          {saving && <Loader className="w-4 h-4 animate-spin" />}
          <span>{saving ? 'Saving Section...' : (section?.slug ? 'Update Section' : 'Create Section')}</span>
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm cursor-pointer transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

/* ─── Main Admin Panel ────────────────────────────────────────────────────── */
export default function AdminPanel() {
  const [loggedIn, setLoggedIn] = useState(isAdminLoggedIn());
  const [loginKey, setLoginKey] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState('products');
  const [toast, setToast] = useState(null);
  const [confirm, setConfirm] = useState(null);

  // Products state
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productModal, setProductModal] = useState(null); // null | 'new' | product_object

  // Gallery state
  const [galleryItems, setGalleryItems] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [galleryModal, setGalleryModal] = useState(null);

  // Sections state (7 Categories)
  const [sections, setSections] = useState([]);
  const [sectionsLoading, setSectionsLoading] = useState(false);
  const [sectionModal, setSectionModal] = useState(null); // null | 'new' | section_object

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  // Load products
  const loadProducts = useCallback(async () => {
    setProductsLoading(true);
    try {
      const data = await adminFetchProducts();
      setProducts(data.products || []);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setProductsLoading(false);
    }
  }, [showToast]);

  // Load gallery
  const loadGallery = useCallback(async () => {
    setGalleryLoading(true);
    try {
      const data = await adminFetchGallery();
      setGalleryItems(data.items || []);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setGalleryLoading(false);
    }
  }, [showToast]);

  // Load sections
  const loadSections = useCallback(async () => {
    setSectionsLoading(true);
    try {
      const data = await adminFetchSections();
      setSections(data.sections || []);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSectionsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (loggedIn) {
      loadProducts();
      loadGallery();
      loadSections();
    }
  }, [loggedIn, loadProducts, loadGallery, loadSections]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    try {
      await adminLogin(loginKey);
      setLoggedIn(true);
    } catch (err) {
      setLoginError(err.message);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    clearAdminToken();
    setLoggedIn(false);
  };

  // Product actions
  const toggleProductStatus = async (product) => {
    try {
      const data = await adminToggleProduct(product._id, !product.published);
      setProducts(prev => prev.map(p => p._id === product._id ? data.product : p));
      showToast(data.message);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const deleteProduct = (product) => {
    setConfirm({
      message: `Delete "${product.name}"? This will permanently remove all its images from Cloudinary.`,
      onConfirm: async () => {
        setConfirm(null);
        try {
          await adminDeleteProduct(product._id);
          setProducts(prev => prev.filter(p => p._id !== product._id));
          showToast('Product deleted successfully');
        } catch (err) {
          showToast(err.message, 'error');
        }
      },
      onCancel: () => setConfirm(null)
    });
  };

  // Gallery actions
  const toggleGalleryStatus = async (item) => {
    try {
      const data = await adminToggleGallery(item._id, !item.published);
      setGalleryItems(prev => prev.map(i => i._id === item._id ? data.item : i));
      showToast(data.message);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const deleteGalleryItem = (item) => {
    setConfirm({
      message: `Delete gallery item "${item.title}"? The Cloudinary image will also be permanently removed.`,
      onConfirm: async () => {
        setConfirm(null);
        try {
          await adminDeleteGalleryItem(item._id);
          setGalleryItems(prev => prev.filter(i => i._id !== item._id));
          showToast('Gallery item deleted');
        } catch (err) {
          showToast(err.message, 'error');
        }
      },
      onCancel: () => setConfirm(null)
    });
  };

  // Section actions
  const toggleSectionStatus = async (sec) => {
    try {
      const data = await adminToggleSection(sec.slug, !sec.published);
      setSections(prev => prev.map(s => s.slug === sec.slug ? data.section : s));
      showToast(data.message);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const deleteSection = (sec) => {
    setConfirm({
      message: `Delete "${sec.title}" (/${sec.slug})? All its page content and images will be permanently removed.`,
      onConfirm: async () => {
        setConfirm(null);
        try {
          await adminDeleteSection(sec.slug);
          setSections(prev => prev.filter(s => s.slug !== sec.slug));
          showToast('Section deleted successfully');
        } catch (err) {
          showToast(err.message, 'error');
        }
      },
      onCancel: () => setConfirm(null)
    });
  };

  const handleSeedSections = async () => {
    try {
      setSectionsLoading(true);
      const data = await adminSeedSections();
      setSections(data.sections || []);
      showToast('7 Default Sections verified & restored');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSectionsLoading(false);
    }
  };

  // ─── Login Screen ────────────────────────────────────────────────────────
  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#001562] to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <img src="/logo.png" alt="ZeniTEK" className="h-12 mx-auto object-contain" />
            <h1 className="text-xl font-black text-slate-900">Admin Panel</h1>
            <p className="text-xs text-slate-500">ZeniTEK CMS — Products & Gallery Management</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Admin API Key</label>
              <input
                type="password"
                value={loginKey}
                onChange={e => setLoginKey(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#002DC2]/30 focus:border-[#002DC2]"
                placeholder="Enter admin API key"
                required
              />
            </div>
            {loginError && (
              <div className="flex items-center space-x-2 text-red-600 text-xs bg-red-50 rounded-xl px-3 py-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}
            <button type="submit" disabled={loginLoading}
              className="w-full py-3.5 bg-[#002DC2] hover:bg-[#001fa0] text-white font-bold rounded-xl text-sm flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-60 transition-colors">
              {loginLoading ? <Loader className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
              <span>{loginLoading ? 'Authenticating...' : 'Sign In'}</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ─── Main Admin Panel ────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src="/logo.png" alt="ZeniTEK" className="h-8 object-contain" />
            <span className="text-sm font-black text-slate-700">Admin CMS</span>
          </div>
          <button onClick={handleLogout}
            className="flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-red-600 cursor-pointer transition-colors">
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Tabs */}
        <div className="flex space-x-1 bg-white rounded-2xl border border-slate-200 p-1 shadow-xs w-fit">
          {[
            { id: 'products', label: 'Products', Icon: Package },
            { id: 'sections', label: 'Product Sections (7)', Icon: Layers },
            { id: 'gallery', label: 'Gallery', Icon: Image }
          ].map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === id
                  ? 'bg-[#002DC2] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* ── PRODUCTS TAB ── */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            {/* Products header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900">Products</h2>
                <p className="text-xs text-slate-500 mt-0.5">{products.length} total · {products.filter(p => p.published).length} published</p>
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={loadProducts} className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-slate-700 cursor-pointer shadow-xs transition-colors" title="Refresh">
                  <RefreshCw className={`w-4 h-4 ${productsLoading ? 'animate-spin' : ''}`} />
                </button>
                <button onClick={() => setProductModal('new')}
                  className="flex items-center space-x-2 px-4 py-2.5 bg-[#002DC2] hover:bg-[#001fa0] text-white font-bold rounded-xl text-sm cursor-pointer shadow-sm transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>Add Product</span>
                </button>
              </div>
            </div>

            {/* Product list */}
            {productsLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader className="w-8 h-8 text-[#002DC2] animate-spin" />
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
                <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-semibold text-sm">No products yet</p>
                <button onClick={() => setProductModal('new')}
                  className="mt-4 px-5 py-2 bg-[#002DC2] text-white font-bold rounded-xl text-xs cursor-pointer hover:bg-[#001fa0] transition-colors">
                  Add Your First Product
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {products.map(product => {
                  const primaryImg = product.images?.find(i => i.isPrimary) || product.images?.[0];
                  return (
                    <div key={product._id} className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow p-4 flex items-center space-x-4">
                      {/* Thumbnail */}
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                        {primaryImg
                          ? <img src={primaryImg.url} alt={product.name} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center text-slate-300"><Package className="w-8 h-8" /></div>
                        }
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold text-slate-900 text-sm truncate">{product.name}</h3>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            product.published ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {product.published ? '● Live' : '○ Draft'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3 mt-1">
                          <span className="text-[11px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded-lg font-medium">{product.category}</span>
                          <span className="text-[11px] text-slate-400">/{product.slug}</span>
                          {product.images?.length > 0 && (
                            <span className="text-[11px] text-slate-400">{product.images.length} image{product.images.length !== 1 ? 's' : ''}</span>
                          )}
                        </div>
                        {product.shortDescription && (
                          <p className="text-[11px] text-slate-500 mt-1 truncate">{product.shortDescription}</p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-1.5 shrink-0">
                        <button onClick={() => toggleProductStatus(product)}
                          title={product.published ? 'Unpublish' : 'Publish'}
                          className={`p-2 rounded-xl cursor-pointer transition-colors ${
                            product.published ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100' : 'text-slate-400 bg-slate-50 hover:bg-slate-100'
                          }`}>
                          {product.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        <button onClick={() => setProductModal(product)}
                          title="Edit"
                          className="p-2 rounded-xl text-blue-600 bg-blue-50 hover:bg-blue-100 cursor-pointer transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteProduct(product)}
                          title="Delete"
                          className="p-2 rounded-xl text-red-500 bg-red-50 hover:bg-red-100 cursor-pointer transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── SECTIONS TAB ── */}
        {activeTab === 'sections' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-slate-900">Product Sections & Solutions (7 Categories)</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {sections.length} total · {sections.filter(s => s.published).length} published (live on navbar & pages)
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleSeedSections}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer transition-colors"
                  title="Verify and seed 7 default categories if missing"
                >
                  Verify/Seed 7 Defaults
                </button>
                <button
                  onClick={loadSections}
                  className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-slate-700 cursor-pointer shadow-xs transition-colors"
                  title="Refresh"
                >
                  <RefreshCw className={`w-4 h-4 ${sectionsLoading ? 'animate-spin' : ''}`} />
                </button>
                <button
                  onClick={() => setSectionModal('new')}
                  className="flex items-center space-x-2 px-4 py-2.5 bg-[#002DC2] hover:bg-[#001fa0] text-white font-bold rounded-xl text-sm cursor-pointer shadow-sm transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Section</span>
                </button>
              </div>
            </div>

            {/* Section list */}
            {sectionsLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader className="w-8 h-8 text-[#002DC2] animate-spin" />
              </div>
            ) : sections.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
                <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-semibold text-sm">No sections found</p>
                <button
                  onClick={handleSeedSections}
                  className="mt-4 px-5 py-2 bg-[#002DC2] text-white font-bold rounded-xl text-xs cursor-pointer hover:bg-[#001fa0] transition-colors"
                >
                  Seed 7 Default Categories
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {sections.map(sec => (
                  <div
                    key={sec._id || sec.slug}
                    className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow p-4 flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4"
                  >
                    {/* Thumbnail */}
                    <div className="w-20 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                      {sec.thumbnail?.url ? (
                        <img src={sec.thumbnail.url} alt={sec.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <Layers className="w-8 h-8" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-sm truncate">{sec.title}</h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          sec.published ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {sec.published ? '● Live on Navbar' : '○ Draft (Hidden)'}
                        </span>
                        <span className="text-[10px] font-bold bg-blue-50 text-[#002DC2] px-2 py-0.5 rounded-full">
                          Order: {sec.displayOrder ?? 0}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[11px] text-slate-500">
                        <span className="font-mono text-slate-400">/{sec.slug}</span>
                        {sec.highlights?.length > 0 && (
                          <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                            {sec.highlights.length} highlights
                          </span>
                        )}
                        {sec.images?.length > 0 && (
                          <span className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded font-medium">
                            {sec.images.length} images
                          </span>
                        )}
                      </div>

                      {sec.subtitle && (
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{sec.subtitle}</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-1.5 shrink-0 self-end sm:self-center">
                      <a
                        href={`/${sec.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="View Public Page"
                        className="p-2 rounded-xl text-slate-600 bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => toggleSectionStatus(sec)}
                        title={sec.published ? 'Unpublish (hide from navbar)' : 'Publish (show on navbar)'}
                        className={`p-2 rounded-xl cursor-pointer transition-colors ${
                          sec.published ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100' : 'text-slate-400 bg-slate-50 hover:bg-slate-100'
                        }`}
                      >
                        {sec.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => setSectionModal(sec)}
                        title="Edit Section"
                        className="p-2 rounded-xl text-blue-600 bg-blue-50 hover:bg-blue-100 cursor-pointer transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteSection(sec)}
                        title="Delete Section"
                        className="p-2 rounded-xl text-red-500 bg-red-50 hover:bg-red-100 cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── GALLERY TAB ── */}
        {activeTab === 'gallery' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900">Gallery</h2>
                <p className="text-xs text-slate-500 mt-0.5">{galleryItems.length} total · {galleryItems.filter(i => i.published).length} published</p>
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={loadGallery} className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-slate-700 cursor-pointer shadow-xs transition-colors" title="Refresh">
                  <RefreshCw className={`w-4 h-4 ${galleryLoading ? 'animate-spin' : ''}`} />
                </button>
                <button onClick={() => setGalleryModal('new')}
                  className="flex items-center space-x-2 px-4 py-2.5 bg-[#002DC2] hover:bg-[#001fa0] text-white font-bold rounded-xl text-sm cursor-pointer shadow-sm transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>Upload Photo</span>
                </button>
              </div>
            </div>

            {galleryLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader className="w-8 h-8 text-[#002DC2] animate-spin" />
              </div>
            ) : galleryItems.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
                <Image className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-semibold text-sm">No gallery items yet</p>
                <button onClick={() => setGalleryModal('new')}
                  className="mt-4 px-5 py-2 bg-[#002DC2] text-white font-bold rounded-xl text-xs cursor-pointer hover:bg-[#001fa0] transition-colors">
                  Upload First Photo
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {galleryItems.map(item => (
                  <div key={item._id} className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow overflow-hidden">
                    <div className="relative h-40">
                      <img src={item.image?.url} alt={item.title} className="w-full h-full object-cover" />
                      <div className="absolute top-2 left-2 flex space-x-1.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.published ? 'bg-emerald-500 text-white' : 'bg-slate-900/70 text-slate-200'
                        }`}>
                          {item.published ? '● Live' : '○ Draft'}
                        </span>
                      </div>
                    </div>
                    <div className="p-3 space-y-2">
                      <h3 className="font-bold text-slate-900 text-xs leading-snug line-clamp-2">{item.title}</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded-lg font-medium">{item.category}</span>
                        <div className="flex items-center space-x-1">
                          <button onClick={() => toggleGalleryStatus(item)}
                            title={item.published ? 'Unpublish' : 'Publish'}
                            className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                              item.published ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100' : 'text-slate-400 bg-slate-50 hover:bg-slate-100'
                            }`}>
                            {item.published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          </button>
                          <button onClick={() => setGalleryModal(item)}
                            title="Edit"
                            className="p-1.5 rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100 cursor-pointer transition-colors">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => deleteGalleryItem(item)}
                            title="Delete"
                            className="p-1.5 rounded-lg text-red-500 bg-red-50 hover:bg-red-100 cursor-pointer transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Product Modal */}
      {productModal !== null && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl my-6 shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-base font-black text-slate-900">
                {productModal === 'new' ? 'Add New Product' : `Edit: ${productModal.name}`}
              </h2>
              <button onClick={() => setProductModal(null)} className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <ProductForm
                product={productModal === 'new' ? null : productModal}
                onSave={() => { setProductModal(null); loadProducts(); }}
                onCancel={() => setProductModal(null)}
                toast={showToast}
              />
            </div>
          </div>
        </div>
      )}

      {/* Gallery Modal */}
      {galleryModal !== null && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl my-6 shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-base font-black text-slate-900">
                {galleryModal === 'new' ? 'Upload Gallery Photo' : `Edit: ${galleryModal.title}`}
              </h2>
              <button onClick={() => setGalleryModal(null)} className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <GalleryForm
                item={galleryModal === 'new' ? null : galleryModal}
                onSave={() => { setGalleryModal(null); loadGallery(); }}
                onCancel={() => setGalleryModal(null)}
                toast={showToast}
              />
            </div>
          </div>
        </div>
      )}

      {/* Section Modal */}
      {sectionModal !== null && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl my-6 shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-base font-black text-slate-900">
                {sectionModal === 'new' ? 'Add New Solution Category' : `Edit Category: ${sectionModal.title}`}
              </h2>
              <button onClick={() => setSectionModal(null)} className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <SectionForm
                section={sectionModal === 'new' ? null : sectionModal}
                onSave={() => { setSectionModal(null); loadSections(); }}
                onCancel={() => setSectionModal(null)}
                toast={showToast}
              />
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Confirm dialog */}
      {confirm && <ConfirmDialog message={confirm.message} onConfirm={confirm.onConfirm} onCancel={confirm.onCancel} />}
    </div>
  );
}
