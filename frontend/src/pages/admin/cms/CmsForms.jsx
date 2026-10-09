// Client Admin CMS building blocks (moved unchanged from the old AdminPanel.jsx):
// toast, confirm dialog, and the product / gallery / section forms.
import React, { useState, useEffect, useRef } from 'react';
import {
  adminCreateProduct, adminUpdateProduct, adminDeleteProductImage,
  adminCreateGalleryItem, adminUpdateGalleryItem,
  adminCreateSection, adminUpdateSection, adminAddSectionImages, adminDeleteSectionImage
} from '../../../utils/api';
import { X, Upload, CheckCircle, CheckCircle2, AlertCircle, Loader } from 'lucide-react';

/* ─── Toast notification ──────────────────────────────────────────────────── */
export function Toast({ message, type = 'success', onClose }) {
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
export function ConfirmDialog({ message, onConfirm, onCancel }) {
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
export function ProductForm({ product, onSave, onCancel, toast }) {
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
                {img.isPrimary && <span className="absolute top-1 left-1 bg-amber-500 text-white text-2xs font-black px-1.5 rounded">PRIMARY</span>}
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
            <span className="text-2xs mt-1">Upload</span>
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
export function GalleryForm({ item, onSave, onCancel, toast }) {
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
              <span className="text-2xs mt-1">Choose Image</span>
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
export function SectionForm({ section, onSave, onCancel, toast }) {
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
              <span className="text-2xs mt-1 font-bold">Upload Image</span>
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
