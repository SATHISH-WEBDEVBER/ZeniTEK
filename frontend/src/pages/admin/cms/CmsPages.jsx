// Client Admin CMS pages: Products, Product Sections, Gallery.
// Same features as the old single-page AdminPanel (create, edit, delete, publish toggle,
// image upload / removal, seed default sections), now one page per sidebar item.
import React, { useCallback, useEffect, useState } from 'react';
import {
  Package, Image, Plus, Edit2, Trash2, Eye, EyeOff, X, Loader, RefreshCw, Layers, ExternalLink, DatabaseZap
} from 'lucide-react';
import {
  adminFetchProducts, adminToggleProduct, adminDeleteProduct,
  adminFetchGallery, adminToggleGallery, adminDeleteGalleryItem,
  adminFetchSections, adminToggleSection, adminDeleteSection, adminSeedSections
} from '../../../utils/api';
import useScrollLock, { useEscapeKey } from '../../../hooks/useScrollLock';
import { AdminPage, adminCard } from '../../../components/admin/AdminLayout';
import { Toast, ConfirmDialog, ProductForm, GalleryForm, SectionForm } from './CmsForms';

const btnPrimary = 'inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#002DC2] hover:bg-[#123B92] text-white text-sm font-bold cursor-pointer transition-colors disabled:opacity-60';
const btnGhost = 'inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-bold cursor-pointer transition-colors disabled:opacity-60';
const iconBtn = 'p-2 rounded-xl cursor-pointer transition-colors';

/** Toast + confirm state shared by each CMS page */
function useCmsFeedback() {
  const [toast, setToast] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const showToast = useCallback((message, type = 'success') => setToast({ message, type }), []);
  const feedback = (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {confirm && <ConfirmDialog message={confirm.message} onConfirm={confirm.onConfirm} onCancel={() => setConfirm(null)} />}
    </>
  );
  const ask = (message, action) => setConfirm({
    message,
    onConfirm: async () => { setConfirm(null); await action(); }
  });
  return { showToast, ask, feedback, confirmOpen: !!confirm, closeConfirm: () => setConfirm(null) };
}

function Modal({ title, onClose, children }) {
  useEscapeKey(true, onClose);
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-start justify-center p-4 overflow-y-auto" role="dialog" aria-modal="true" aria-label={title}>
      <div className="bg-white rounded-2xl w-full max-w-2xl my-6 shadow-2xl min-w-0">
        <div className="flex items-center justify-between gap-3 p-5 sm:p-6 border-b border-slate-100">
          <h2 className="text-base font-black text-[#123B92] break-words min-w-0">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 sm:p-6">{children}</div>
      </div>
    </div>
  );
}

function Spinner() {
  return <div className="flex items-center justify-center py-20"><Loader className="w-6 h-6 text-[#002DC2] animate-spin" /></div>;
}

function Empty({ Icon, text, action }) {
  return (
    <div className={`${adminCard} p-12 text-center`}>
      <Icon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
      <p className="text-slate-500 font-semibold text-sm">{text}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

function LiveBadge({ published, live = 'Live', draft = 'Draft' }) {
  return (
    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${published ? 'bg-green-50 text-[#1A822B] ring-1 ring-green-200' : 'bg-slate-100 text-slate-500'}`}>
      {published ? live : draft}
    </span>
  );
}

function PublishButton({ published, onClick, small = false }) {
  return (
    <button type="button" onClick={onClick} title={published ? 'Unpublish' : 'Publish'} aria-label={published ? 'Unpublish' : 'Publish'}
      className={`${small ? 'p-1.5 rounded-lg' : iconBtn} cursor-pointer transition-colors ${published ? 'text-[#1A822B] bg-green-50 hover:bg-green-100' : 'text-slate-400 bg-slate-50 hover:bg-slate-100'}`}>
      {published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
    </button>
  );
}

/* ─── Products ────────────────────────────────────────────────────────────── */
export function ProductsManager() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'new' | product
  const { showToast, ask, feedback, confirmOpen } = useCmsFeedback();
  useScrollLock(modal !== null || confirmOpen);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminFetchProducts();
      setProducts(data.products || []);
    } catch (err) { showToast(err.message, 'error'); }
    setLoading(false);
  }, [showToast]);
  useEffect(() => { load(); }, [load]);

  const toggle = async product => {
    try {
      const data = await adminToggleProduct(product._id, !product.published);
      setProducts(prev => prev.map(p => (p._id === product._id ? data.product : p)));
      showToast(data.message);
    } catch (err) { showToast(err.message, 'error'); }
  };

  const remove = product => ask(`Delete "${product.name}"? This will permanently remove all its images from Cloudinary.`, async () => {
    try {
      await adminDeleteProduct(product._id);
      setProducts(prev => prev.filter(p => p._id !== product._id));
      showToast('Product deleted successfully');
    } catch (err) { showToast(err.message, 'error'); }
  });

  const actions = (
    <>
      <button type="button" onClick={load} className={btnGhost} title="Refresh"><RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh</button>
      <button type="button" onClick={() => setModal('new')} className={btnPrimary}><Plus className="w-4 h-4" /> Add Product</button>
    </>
  );

  return (
    <AdminPage title="Products" subtitle={`${products.length} total · ${products.filter(p => p.published).length} published`} actions={actions}>
      {loading && !products.length ? <Spinner /> : products.length === 0 ? (
        <Empty Icon={Package} text="No products yet" action={<button type="button" onClick={() => setModal('new')} className={btnPrimary}><Plus className="w-4 h-4" /> Add your first product</button>} />
      ) : (
        <ul className="grid grid-cols-1 gap-3">
          {products.map(product => {
            const primaryImg = product.images?.find(i => i.isPrimary) || product.images?.[0];
            return (
              <li key={product._id} className={`${adminCard} p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4`} data-testid="product-row">
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                    {primaryImg
                      ? <img src={primaryImg.url} alt={product.name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-slate-300"><Package className="w-6 h-6" /></div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-[#123B92] break-words min-w-0">{product.name}</h3>
                      <LiveBadge published={product.published} />
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-500">
                      <span className="bg-slate-50 px-2 py-0.5 rounded-lg font-medium">{product.category}</span>
                      <span className="text-slate-400 break-all">/{product.slug}</span>
                      {product.images?.length > 0 && <span className="text-slate-400">{product.images.length} image{product.images.length !== 1 ? 's' : ''}</span>}
                    </div>
                    {product.shortDescription && <p className="text-sm text-slate-500 mt-1 truncate">{product.shortDescription}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                  <PublishButton published={product.published} onClick={() => toggle(product)} />
                  <button type="button" onClick={() => setModal(product)} title="Edit" aria-label={`Edit ${product.name}`} className={`${iconBtn} text-[#002DC2] bg-blue-50 hover:bg-blue-100`}><Edit2 className="w-4 h-4" /></button>
                  <button type="button" onClick={() => remove(product)} title="Delete" aria-label={`Delete ${product.name}`} className={`${iconBtn} text-red-600 bg-red-50 hover:bg-red-100`}><Trash2 className="w-4 h-4" /></button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {modal !== null && (
        <Modal title={modal === 'new' ? 'Add New Product' : `Edit: ${modal.name}`} onClose={() => setModal(null)}>
          <ProductForm product={modal === 'new' ? null : modal} onSave={() => { setModal(null); load(); }} onCancel={() => setModal(null)} toast={showToast} />
        </Modal>
      )}
      {feedback}
    </AdminPage>
  );
}

/* ─── Product Sections ────────────────────────────────────────────────────── */
export function SectionsManager() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const { showToast, ask, feedback, confirmOpen } = useCmsFeedback();
  useScrollLock(modal !== null || confirmOpen);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminFetchSections();
      setSections(data.sections || []);
    } catch (err) { showToast(err.message, 'error'); }
    setLoading(false);
  }, [showToast]);
  useEffect(() => { load(); }, [load]);

  const toggle = async sec => {
    try {
      const data = await adminToggleSection(sec.slug, !sec.published);
      setSections(prev => prev.map(s => (s.slug === sec.slug ? data.section : s)));
      showToast(data.message);
    } catch (err) { showToast(err.message, 'error'); }
  };

  const remove = sec => ask(`Delete "${sec.title}" (/${sec.slug})? All its page content and images will be permanently removed.`, async () => {
    try {
      await adminDeleteSection(sec.slug);
      setSections(prev => prev.filter(s => s.slug !== sec.slug));
      showToast('Section deleted successfully');
    } catch (err) { showToast(err.message, 'error'); }
  });

  const seed = async () => {
    setLoading(true);
    try {
      const data = await adminSeedSections();
      setSections(data.sections || []);
      showToast('7 default sections verified & restored');
    } catch (err) { showToast(err.message, 'error'); }
    setLoading(false);
  };

  const actions = (
    <>
      <button type="button" onClick={seed} className={btnGhost} title="Verify and seed the 7 default sections if missing"><DatabaseZap className="w-4 h-4" /> Verify / seed defaults</button>
      <button type="button" onClick={load} className={btnGhost} title="Refresh"><RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh</button>
      <button type="button" onClick={() => setModal('new')} className={btnPrimary}><Plus className="w-4 h-4" /> Add Section</button>
    </>
  );

  return (
    <AdminPage title="Product Sections" subtitle={`${sections.length} total · ${sections.filter(s => s.published).length} published (shown in the navbar and as pages)`} actions={actions}>
      {loading && !sections.length ? <Spinner /> : sections.length === 0 ? (
        <Empty Icon={Layers} text="No sections found" action={<button type="button" onClick={seed} className={btnPrimary}>Seed the 7 default sections</button>} />
      ) : (
        <ul className="grid grid-cols-1 gap-3">
          {sections.map(sec => (
            <li key={sec._id || sec.slug} className={`${adminCard} p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4`} data-testid="section-row">
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <div className="w-20 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                  {sec.thumbnail?.url
                    ? <img src={sec.thumbnail.url} alt={sec.title} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-slate-300"><Layers className="w-6 h-6" /></div>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-[#123B92] break-words min-w-0">{sec.title}</h3>
                    <LiveBadge published={sec.published} live="Live in navbar" draft="Draft (hidden)" />
                    <span className="text-[11px] font-bold bg-blue-50 text-[#002DC2] px-2 py-0.5 rounded-full">Order {sec.displayOrder ?? 0}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-500">
                    <span className="font-mono text-slate-400 break-all">/{sec.slug}</span>
                    {sec.highlights?.length > 0 && <span className="text-[#1A822B] bg-green-50 px-2 py-0.5 rounded font-medium">{sec.highlights.length} highlights</span>}
                    {sec.images?.length > 0 && <span className="bg-slate-100 px-2 py-0.5 rounded font-medium">{sec.images.length} images</span>}
                  </div>
                  {sec.subtitle && <p className="text-sm text-slate-500 mt-1 line-clamp-1">{sec.subtitle}</p>}
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                <a href={`/${sec.slug}`} target="_blank" rel="noopener noreferrer" title="View public page" aria-label={`View ${sec.title} page`} className={`${iconBtn} text-slate-600 bg-slate-50 hover:bg-slate-100`}><ExternalLink className="w-4 h-4" /></a>
                <PublishButton published={sec.published} onClick={() => toggle(sec)} />
                <button type="button" onClick={() => setModal(sec)} title="Edit section" aria-label={`Edit ${sec.title}`} className={`${iconBtn} text-[#002DC2] bg-blue-50 hover:bg-blue-100`}><Edit2 className="w-4 h-4" /></button>
                <button type="button" onClick={() => remove(sec)} title="Delete section" aria-label={`Delete ${sec.title}`} className={`${iconBtn} text-red-600 bg-red-50 hover:bg-red-100`}><Trash2 className="w-4 h-4" /></button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {modal !== null && (
        <Modal title={modal === 'new' ? 'Add New Section' : `Edit Section: ${modal.title}`} onClose={() => setModal(null)}>
          <SectionForm section={modal === 'new' ? null : modal} onSave={() => { setModal(null); load(); }} onCancel={() => setModal(null)} toast={showToast} />
        </Modal>
      )}
      {feedback}
    </AdminPage>
  );
}

/* ─── Gallery ─────────────────────────────────────────────────────────────── */
const GALLERY_LABELS = {
  box_dryers: 'Box Type Dryers',
  tunnel_external: 'Polyhouse Tunnels',
  tunnel_internal: 'Tunnel Interior & Trays',
  trays_produce: 'Produce & SS304 Trays',
  engineering: 'Engineering & Packaging',
  Other: 'Other'
};

export function GalleryManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const { showToast, ask, feedback, confirmOpen } = useCmsFeedback();
  useScrollLock(modal !== null || confirmOpen);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminFetchGallery();
      setItems(data.items || []);
    } catch (err) { showToast(err.message, 'error'); }
    setLoading(false);
  }, [showToast]);
  useEffect(() => { load(); }, [load]);

  const toggle = async item => {
    try {
      const data = await adminToggleGallery(item._id, !item.published);
      setItems(prev => prev.map(i => (i._id === item._id ? data.item : i)));
      showToast(data.message);
    } catch (err) { showToast(err.message, 'error'); }
  };

  const remove = item => ask(`Delete gallery item "${item.title}"? The Cloudinary image will also be permanently removed.`, async () => {
    try {
      await adminDeleteGalleryItem(item._id);
      setItems(prev => prev.filter(i => i._id !== item._id));
      showToast('Gallery item deleted');
    } catch (err) { showToast(err.message, 'error'); }
  });

  const actions = (
    <>
      <button type="button" onClick={load} className={btnGhost} title="Refresh"><RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh</button>
      <button type="button" onClick={() => setModal('new')} className={btnPrimary}><Plus className="w-4 h-4" /> Upload Photo</button>
    </>
  );

  return (
    <AdminPage title="Gallery" subtitle={`${items.length} total · ${items.filter(i => i.published).length} published`} actions={actions}>
      {loading && !items.length ? <Spinner /> : items.length === 0 ? (
        <Empty Icon={Image} text="No gallery items yet" action={<button type="button" onClick={() => setModal('new')} className={btnPrimary}><Plus className="w-4 h-4" /> Upload first photo</button>} />
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map(item => (
            <li key={item._id} className={`${adminCard} overflow-hidden`}>
              <div className="relative h-40 bg-slate-100">
                <img src={item.image?.url} alt={item.title} className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2"><LiveBadge published={item.published} /></span>
              </div>
              <div className="p-3 space-y-2">
                <h3 className="font-bold text-[#123B92] leading-snug line-clamp-2 break-words">{item.title}</h3>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-slate-500 bg-slate-50 px-2 py-0.5 rounded-lg font-medium truncate">{GALLERY_LABELS[item.category] || item.category}</span>
                  <div className="flex items-center gap-1 shrink-0">
                    <PublishButton published={item.published} onClick={() => toggle(item)} small />
                    <button type="button" onClick={() => setModal(item)} title="Edit" aria-label={`Edit ${item.title}`} className="p-1.5 rounded-lg text-[#002DC2] bg-blue-50 hover:bg-blue-100 cursor-pointer"><Edit2 className="w-4 h-4" /></button>
                    <button type="button" onClick={() => remove(item)} title="Delete" aria-label={`Delete ${item.title}`} className="p-1.5 rounded-lg text-red-600 bg-red-50 hover:bg-red-100 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {modal !== null && (
        <Modal title={modal === 'new' ? 'Upload Gallery Photo' : `Edit: ${modal.title}`} onClose={() => setModal(null)}>
          <GalleryForm item={modal === 'new' ? null : modal} onSave={() => { setModal(null); load(); }} onCancel={() => setModal(null)} toast={showToast} />
        </Modal>
      )}
      {feedback}
    </AdminPage>
  );
}
