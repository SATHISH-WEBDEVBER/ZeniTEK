// Client Admin portal: /admin (inside the shared admin shell)
//   /admin                    overview: counts, recent enquiries, quick links
//   /admin/enquiries          enquiries (leads): search, sort, CSV, delete
//   /admin/enquiries/:id      one enquiry
//   /admin/products           products CMS
//   /admin/sections           product sections CMS
//   /admin/gallery            gallery CMS
//   /admin/reviews            customer reviews: approve / hide / delete
//   /admin/bugs               bug status (read-only)
//   /admin/bugs/:id           one bug (read-only)
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Routes, Route, Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  LayoutDashboard, Inbox, Package, Layers, Image, Star, Bug as BugIcon, RefreshCw, Search, Download,
  Trash2, Phone, MapPin, Sprout, Gauge, Building2, MessageCircle, Calendar, ArrowUpDown, ChevronRight,
  CheckCircle2, EyeOff, AlertTriangle, ListChecks, CircleDot, Timer, ExternalLink, X
} from 'lucide-react';
import {
  adminFetchOverview, adminFetchLeads, adminFetchLead, adminDeleteLead,
  adminFetchReviews, adminApproveReview, adminDeleteReview,
  adminFetchBugs, adminFetchBug, adminFetchBugSummary
} from '../../utils/api';
import { useRoleSession } from '../../utils/bugApi';
import { AdminPage, AdminShellContext, AdminLoginCard, StatCard, adminCard } from '../../components/admin/AdminLayout';
import { ProductsManager, SectionsManager, GalleryManager } from './cms/CmsPages';
import {
  BugList, BugBadges, DeadlineText, ScreenshotGallery, HistoryList, Field, ErrorNote, Loading,
  SeverityBadge, PriorityBadge, useNow, formatDateTime, bugCode, isOverdueAt, inputCls, btnGhost, btnPrimary, btnDanger
} from '../bugs/BugUi';

const BASE = '/admin';

export default function ClientAdminApp() {
  const session = useRoleSession('client');
  if (!session.session) {
    return (
      <AdminLoginCard roleTitle="Client Admin" subtitle="Manage the ZeniTEK website, enquiries and reviews" Icon={LayoutDashboard}
        onLogin={session.login} notice={session.expired ? 'Your session has expired. Please sign in again.' : ''} />
    );
  }
  const shell = {
    roleTitle: 'Client Admin',
    RoleIcon: LayoutDashboard,
    homeTo: BASE,
    username: session.session.username,
    onLogout: session.logout,
    nav: [
      { to: BASE, end: true, label: 'Overview', Icon: LayoutDashboard },
      { to: `${BASE}/enquiries`, label: 'Enquiries', Icon: Inbox },
      { to: `${BASE}/products`, label: 'Products', Icon: Package },
      { to: `${BASE}/sections`, label: 'Product Sections', Icon: Layers },
      { to: `${BASE}/gallery`, label: 'Gallery', Icon: Image },
      { to: `${BASE}/reviews`, label: 'Reviews', Icon: Star },
      { to: `${BASE}/bugs`, label: 'Bug Status', Icon: BugIcon }
    ]
  };
  return (
    <AdminShellContext.Provider value={shell}>
      <Routes>
        <Route index element={<Overview />} />
        <Route path="enquiries" element={<Enquiries />} />
        <Route path="enquiries/:id" element={<EnquiryDetail />} />
        <Route path="products" element={<ProductsManager />} />
        <Route path="sections" element={<SectionsManager />} />
        <Route path="gallery" element={<GalleryManager />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="bugs" element={<BugStatus />} />
        <Route path="bugs/:id" element={<BugStatusDetail />} />
        <Route path="*" element={<Navigate to={BASE} replace />} />
      </Routes>
    </AdminShellContext.Provider>
  );
}

const formatDate = value => (value ? new Date(value).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—');
const waLink = phone => {
  const digits = String(phone || '').replace(/\D/g, '');
  if (!digits) return null;
  return `https://wa.me/${digits.length === 10 ? `91${digits}` : digits}`;
};

/* ─── Overview ────────────────────────────────────────────────────────────── */
function Overview() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminFetchOverview();
      setData(res.data);
    } catch (err) { setError(err.message); }
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const actions = (
    <button type="button" onClick={load} className={btnGhost} disabled={loading}>
      <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
    </button>
  );

  const quickLinks = [
    { to: `${BASE}/products`, label: 'Add or edit a product', Icon: Package },
    { to: `${BASE}/gallery`, label: 'Upload gallery photos', Icon: Image },
    { to: `${BASE}/sections`, label: 'Edit product sections', Icon: Layers },
    { to: `${BASE}/reviews`, label: 'Approve customer reviews', Icon: Star },
    { to: `${BASE}/bugs`, label: 'Follow bug-fix progress', Icon: BugIcon }
  ];

  return (
    <AdminPage title="Overview" subtitle={data ? `Updated ${formatDateTime(data.generatedAt)}` : 'Your website at a glance'} actions={actions}>
      <div className="space-y-6">
        <ErrorNote>{error}</ErrorNote>
        {!data ? (!error && <Loading />) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
              <StatCard label="Enquiries" value={data.leads.total} Icon={Inbox} tone="blue" to={`${BASE}/enquiries`}
                sub={`${data.leads.last7Days} new in the last 7 days`} />
              <StatCard label="Products" value={data.products.total} Icon={Package} tone="navy" to={`${BASE}/products`}
                sub={`${data.products.published} published`} />
              <StatCard label="Product sections" value={data.sections.total} Icon={Layers} tone="navy" to={`${BASE}/sections`}
                sub={`${data.sections.published} published`} />
              <StatCard label="Gallery items" value={data.gallery.total} Icon={Image} tone="green" to={`${BASE}/gallery`}
                sub={`${data.gallery.published} published`} />
              <StatCard label="Reviews pending" value={data.reviews.pending} Icon={Star} tone="amber" to={`${BASE}/reviews?filter=pending`}
                sub={`${data.reviews.approved} approved`} />
              <StatCard label="Open bugs" value={data.bugs.notCompleted} Icon={BugIcon} tone={data.bugs.overdue ? 'red' : 'slate'} to={`${BASE}/bugs`}
                sub={`${data.bugs.overdue} overdue · ${data.bugs.completed} fixed`} danger={data.bugs.overdue > 0} />
            </div>

            <div className="grid lg:grid-cols-[1fr_320px] gap-4 items-start">
              <section className={`${adminCard} p-5 space-y-3 min-w-0`}>
                <div className="flex items-center justify-between gap-2">
                  <h2 className="font-black text-[#123B92]">Recent enquiries</h2>
                  <Link to={`${BASE}/enquiries`} className="text-xs font-bold text-[#002DC2] hover:underline">View all</Link>
                </div>
                {data.recentLeads.length ? (
                  <ul className="divide-y divide-slate-100">
                    {data.recentLeads.map(lead => (
                      <li key={lead._id}>
                        <Link to={`${BASE}/enquiries/${lead._id}`} className="flex items-center gap-3 py-3 group">
                          <span className="w-10 h-10 rounded-full bg-blue-50 text-[#002DC2] flex items-center justify-center font-black shrink-0">
                            {(lead.name || '?').trim().charAt(0).toUpperCase()}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block font-bold text-slate-900 group-hover:text-[#002DC2] truncate">{lead.name}</span>
                            <span className="block text-xs text-slate-500 truncate">{lead.district}, {lead.state} · {lead.cropType} · {lead.capacityNeeded}</span>
                          </span>
                          <span className="text-xs text-slate-500 shrink-0 hidden sm:block">{formatDate(lead.submittedAt)}</span>
                          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : <p className="text-sm text-slate-500 py-4">No enquiries yet. They appear here when visitors submit the quote form.</p>}
              </section>
              <section className={`${adminCard} p-5 space-y-3`}>
                <h2 className="font-black text-[#123B92]">Quick links</h2>
                <ul className="space-y-1">
                  {quickLinks.map(({ to, label, Icon }) => (
                    <li key={to}>
                      <Link to={to} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#002DC2]">
                        <Icon className="w-5 h-5 shrink-0 text-slate-400" /> <span className="flex-1">{label}</span> <ChevronRight className="w-4 h-4 text-slate-300" />
                      </Link>
                    </li>
                  ))}
                  <li>
                    <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#002DC2]">
                      <ExternalLink className="w-5 h-5 shrink-0 text-slate-400" /> <span className="flex-1">Open the website</span>
                    </a>
                  </li>
                </ul>
              </section>
            </div>
          </>
        )}
      </div>
    </AdminPage>
  );
}

/* ─── Enquiries ───────────────────────────────────────────────────────────── */
const CSV_COLUMNS = [
  ['submittedAt', 'Date'], ['name', 'Name'], ['phone', 'Phone'], ['whatsappPreference', 'WhatsApp OK'],
  ['district', 'District'], ['state', 'State'], ['clientType', 'Client type'], ['cropType', 'Crop'],
  ['capacityNeeded', 'Capacity'], ['message', 'Message']
];

function downloadCsv(leads) {
  const esc = v => {
    let s = v === undefined || v === null ? '' : String(v);
    if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`; // stop spreadsheet formula injection
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const rows = leads.map(l => CSV_COLUMNS.map(([k]) => {
    if (k === 'submittedAt') return esc(l.submittedAt ? new Date(l.submittedAt).toISOString().replace('T', ' ').slice(0, 16) : '');
    if (k === 'whatsappPreference') return esc(l.whatsappPreference === false ? 'No' : 'Yes');
    return esc(l[k]);
  }).join(','));
  const csv = `﻿${[CSV_COLUMNS.map(([, h]) => h).join(','), ...rows].join('\r\n')}`;
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = `zenitek-enquiries-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function Enquiries() {
  const [leads, setLeads] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [confirmId, setConfirmId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminFetchLeads();
      setLeads(data.leads || []);
    } catch (err) { setError(err.message); setLeads(l => l || []); }
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const shown = useMemo(() => {
    const term = search.trim().toLowerCase();
    const list = (leads || []).filter(l => !term || [l.name, l.phone, l.district, l.state, l.cropType, l.clientType, l.capacityNeeded, l.message]
      .some(v => String(v || '').toLowerCase().includes(term)));
    return [...list].sort((a, b) => {
      const d = new Date(a.submittedAt) - new Date(b.submittedAt);
      return sort === 'oldest' ? d : -d;
    });
  }, [leads, search, sort]);

  const remove = async id => {
    setDeleting(true);
    setError('');
    try {
      await adminDeleteLead(id);
      setLeads(prev => prev.filter(l => l._id !== id));
      setConfirmId(null);
    } catch (err) { setError(err.message); }
    setDeleting(false);
  };

  const actions = (
    <>
      <button type="button" onClick={load} className={btnGhost} disabled={loading}><RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh</button>
      <button type="button" onClick={() => downloadCsv(shown)} className={btnPrimary} disabled={!shown.length}><Download className="w-4 h-4" /> Download CSV</button>
    </>
  );

  const ConfirmRow = ({ lead }) => (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3">
      <p className="text-sm font-bold text-red-800 flex-1 min-w-[12rem]">Delete the enquiry from {lead.name}? This cannot be undone.</p>
      <button type="button" onClick={() => remove(lead._id)} disabled={deleting} className={btnDanger}><Trash2 className="w-4 h-4" /> {deleting ? 'Deleting…' : 'Yes, delete'}</button>
      <button type="button" onClick={() => setConfirmId(null)} className={btnGhost}>Cancel</button>
    </div>
  );

  return (
    <AdminPage title="Enquiries" subtitle={leads ? `${leads.length} quote and subsidy enquiries from the website` : 'Quote and subsidy enquiries from the website'} actions={actions}>
      <div className="space-y-4">
        <div className={`${adminCard} p-3 sm:p-4 flex flex-col sm:flex-row gap-2`}>
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input className={`${inputCls} pl-9`} placeholder="Search name, phone, place, crop…" value={search} onChange={e => setSearch(e.target.value)} aria-label="Search enquiries" />
          </div>
          <button type="button" onClick={() => setSort(s => (s === 'newest' ? 'oldest' : 'newest'))} className={btnGhost} aria-label={`Sort by date, currently ${sort} first`}>
            <ArrowUpDown className="w-4 h-4" /> {sort === 'newest' ? 'Newest first' : 'Oldest first'}
          </button>
        </div>

        <ErrorNote>{error}</ErrorNote>
        {leads === null ? <Loading /> : shown.length === 0 ? (
          <div className={`${adminCard} p-10 text-center space-y-2`}>
            <Inbox className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-sm text-slate-500">{leads.length ? 'No enquiries match your search.' : 'No enquiries yet.'}</p>
          </div>
        ) : (
          <>
            <p className="text-xs font-bold text-slate-500">{shown.length} enquir{shown.length === 1 ? 'y' : 'ies'}</p>
            {/* Desktop table */}
            <div className={`${adminCard} hidden lg:block overflow-hidden`}>
              <table className="w-full text-sm table-fixed">
                <thead className="bg-slate-50 text-left text-[11px] uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-bold w-[18%]">Name / phone</th>
                    <th className="px-3 py-3 font-bold w-[14%]">Location</th>
                    <th className="px-3 py-3 font-bold w-[18%]">Crop / capacity</th>
                    <th className="px-3 py-3 font-bold w-[14%]">Client type</th>
                    <th className="px-3 py-3 font-bold">Message</th>
                    <th className="px-3 py-3 font-bold w-[10%]">Date</th>
                    <th className="px-3 py-3 font-bold w-[56px]"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {shown.map(lead => (
                    <React.Fragment key={lead._id}>
                      <tr className="hover:bg-slate-50 align-top">
                        <td className="px-4 py-3">
                          <Link to={`${BASE}/enquiries/${lead._id}`} className="font-bold text-slate-900 hover:text-[#002DC2] break-words">{lead.name}</Link>
                          <a href={`tel:${lead.phone}`} className="block text-xs text-slate-500 hover:text-[#002DC2]">{lead.phone}</a>
                        </td>
                        <td className="px-3 py-3 text-slate-700 break-words">{lead.district}<span className="block text-xs text-slate-500">{lead.state}</span></td>
                        <td className="px-3 py-3 text-slate-700 break-words">{lead.cropType}<span className="block text-xs text-slate-500">{lead.capacityNeeded}</span></td>
                        <td className="px-3 py-3 text-slate-700 break-words">{lead.clientType}</td>
                        <td className="px-3 py-3 text-slate-600"><p className="line-clamp-2 break-words">{lead.message || <span className="text-slate-400">—</span>}</p></td>
                        <td className="px-3 py-3 text-slate-600 whitespace-nowrap">{formatDate(lead.submittedAt)}</td>
                        <td className="px-3 py-3">
                          <button type="button" onClick={() => setConfirmId(lead._id)} title="Delete enquiry" aria-label={`Delete enquiry from ${lead.name}`}
                            className="p-2 rounded-xl text-red-600 bg-red-50 hover:bg-red-100 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                        </td>
                      </tr>
                      {confirmId === lead._id && (
                        <tr><td colSpan={7} className="px-4 pb-3"><ConfirmRow lead={lead} /></td></tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Mobile cards */}
            <ul className="lg:hidden space-y-3">
              {shown.map(lead => (
                <li key={lead._id} className={`${adminCard} p-4 space-y-3`}>
                  <Link to={`${BASE}/enquiries/${lead._id}`} className="block space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-bold text-slate-900 break-words min-w-0">{lead.name}</p>
                      <span className="text-xs text-slate-500 shrink-0">{formatDate(lead.submittedAt)}</span>
                    </div>
                    <p className="text-xs text-slate-600 break-words">{lead.district}, {lead.state}</p>
                    <p className="text-xs text-slate-600 break-words">{lead.cropType} · {lead.capacityNeeded}</p>
                    <p className="text-xs text-slate-500 break-words">{lead.clientType}</p>
                    {lead.message && <p className="text-sm text-slate-600 line-clamp-2 break-words">{lead.message}</p>}
                  </Link>
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                    <a href={`tel:${lead.phone}`} className="inline-flex items-center gap-1.5 text-sm font-bold text-[#002DC2]"><Phone className="w-4 h-4" /> {lead.phone}</a>
                    <button type="button" onClick={() => setConfirmId(lead._id)} aria-label={`Delete enquiry from ${lead.name}`}
                      className="ml-auto p-2 rounded-xl text-red-600 bg-red-50 hover:bg-red-100 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  {confirmId === lead._id && <ConfirmRow lead={lead} />}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </AdminPage>
  );
}

function EnquiryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [error, setError] = useState('');
  const [confirm, setConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    adminFetchLead(id).then(d => { if (!cancelled) setLead(d.lead); }).catch(err => { if (!cancelled) setError(err.message); });
    return () => { cancelled = true; };
  }, [id]);

  const remove = async () => {
    setDeleting(true);
    try {
      await adminDeleteLead(id);
      navigate(`${BASE}/enquiries`, { replace: true });
    } catch (err) { setError(err.message); setDeleting(false); setConfirm(false); }
  };

  const back = { to: `${BASE}/enquiries`, label: 'All enquiries' };
  if (!lead) return <AdminPage title="Enquiry" back={back}>{error ? <ErrorNote>{error}</ErrorNote> : <Loading />}</AdminPage>;

  const wa = lead.whatsappPreference !== false ? waLink(lead.phone) : null;
  const actions = (
    <>
      <a href={`tel:${lead.phone}`} className={btnGhost}><Phone className="w-4 h-4" /> Call</a>
      {wa && <a href={wa} target="_blank" rel="noopener noreferrer" className={btnGhost}><MessageCircle className="w-4 h-4" /> WhatsApp</a>}
      {!confirm && <button type="button" onClick={() => setConfirm(true)} className={`${btnGhost} text-red-600 hover:bg-red-50`}><Trash2 className="w-4 h-4" /> Delete</button>}
    </>
  );
  const items = [
    ['Phone', lead.phone, Phone],
    ['Location', `${lead.district}, ${lead.state}`, MapPin],
    ['Crop', lead.cropType, Sprout],
    ['Capacity needed', lead.capacityNeeded, Gauge],
    ['Client type', lead.clientType, Building2],
    ['Submitted', formatDateTime(lead.submittedAt), Calendar]
  ];

  return (
    <AdminPage title={lead.name} subtitle="Enquiry details" back={back} actions={actions}>
      <div className="space-y-4 max-w-4xl">
        {confirm && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 space-y-3">
            <p className="text-sm font-bold text-red-800">Delete this enquiry from {lead.name}? This cannot be undone.</p>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={remove} disabled={deleting} className={btnDanger}><Trash2 className="w-4 h-4" /> {deleting ? 'Deleting…' : 'Yes, delete'}</button>
              <button type="button" onClick={() => setConfirm(false)} className={btnGhost}>Cancel</button>
            </div>
          </div>
        )}
        <ErrorNote>{error}</ErrorNote>
        <div className={`${adminCard} p-5 sm:p-6 space-y-5`}>
          <dl className="grid sm:grid-cols-2 gap-4">
            {items.map(([label, value, Icon]) => (
              <div key={label} className="flex items-start gap-3 min-w-0">
                <span className="w-9 h-9 rounded-xl bg-slate-50 text-slate-500 flex items-center justify-center shrink-0"><Icon className="w-4 h-4" /></span>
                <div className="min-w-0">
                  <dt className="text-[11px] font-bold uppercase tracking-wide text-slate-500">{label}</dt>
                  <dd className="text-sm font-semibold text-slate-800 break-words">{value || '—'}</dd>
                </div>
              </div>
            ))}
          </dl>
          <div className="pt-4 border-t border-slate-100">
            <Field label="Message">{lead.message}</Field>
          </div>
          <p className="text-xs text-slate-500">WhatsApp contact: {lead.whatsappPreference === false ? 'not preferred' : 'preferred'}</p>
        </div>
      </div>
    </AdminPage>
  );
}

/* ─── Reviews ─────────────────────────────────────────────────────────────── */
function Reviews() {
  const [reviews, setReviews] = useState(null);
  const [source, setSource] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState('');
  const [confirmId, setConfirmId] = useState(null);
  const [params, setParams] = useSearchParams();
  const filter = ['pending', 'approved'].includes(params.get('filter')) ? params.get('filter') : 'all';

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminFetchReviews();
      setReviews(data.reviews || []);
      setSource(data.source || (data.fallback ? 'fallback' : ''));
    } catch (err) { setError(err.message); setReviews(r => r || []); }
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const counts = useMemo(() => {
    const list = reviews || [];
    return { all: list.length, pending: list.filter(r => !r.approved).length, approved: list.filter(r => r.approved).length };
  }, [reviews]);
  const shown = (reviews || []).filter(r => filter === 'all' || (filter === 'pending' ? !r.approved : r.approved));

  const setApproved = async (review, approved) => {
    setBusy(review._id);
    setError('');
    try {
      const data = await adminApproveReview(review._id, approved);
      setReviews(prev => prev.map(r => (r._id === review._id ? { ...r, ...data.review } : r)));
    } catch (err) { setError(err.message); }
    setBusy('');
  };

  const remove = async review => {
    setBusy(review._id);
    setError('');
    try {
      await adminDeleteReview(review._id);
      setReviews(prev => prev.filter(r => r._id !== review._id));
      setConfirmId(null);
    } catch (err) { setError(err.message); }
    setBusy('');
  };

  const actions = (
    <button type="button" onClick={load} className={btnGhost} disabled={loading}><RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh</button>
  );

  return (
    <AdminPage title="Reviews" subtitle="Customer stories submitted on the website. Only approved reviews are shown publicly." actions={actions}>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-1.5">
          {[['all', 'All'], ['pending', 'Pending approval'], ['approved', 'Approved']].map(([id, label]) => (
            <button key={id} type="button" onClick={() => setParams(id === 'all' ? {} : { filter: id }, { replace: true })}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer ${filter === id ? 'bg-[#002DC2] border-[#002DC2] text-white' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}>
              {label} <span className="opacity-75">({counts[id]})</span>
            </button>
          ))}
        </div>
        {source && (
          <p className="text-xs text-amber-800 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
            No reviews are stored in the database yet, so the website's built-in sample reviews are listed. Changes to these samples are not saved permanently.
          </p>
        )}
        <ErrorNote>{error}</ErrorNote>
        {reviews === null ? <Loading /> : shown.length === 0 ? (
          <div className={`${adminCard} p-10 text-center space-y-2`}>
            <Star className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-sm text-slate-500">{filter === 'pending' ? 'No reviews are waiting for approval.' : 'No reviews yet.'}</p>
          </div>
        ) : (
          <ul className="grid md:grid-cols-2 gap-3">
            {shown.map(r => (
              <li key={r._id} className={`${adminCard} p-4 space-y-3 min-w-0`} data-testid="review-card">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 break-words">{r.name}</p>
                    <p className="text-xs text-slate-500 break-words">{[r.role, r.location].filter(Boolean).join(' · ')}</p>
                  </div>
                  <span className={`shrink-0 text-[11px] font-bold px-2 py-0.5 rounded-full ${r.approved ? 'bg-green-50 text-[#1A822B] ring-1 ring-green-200' : 'bg-amber-50 text-amber-800 ring-1 ring-amber-200'}`}>
                    {r.approved ? 'Approved' : 'Pending'}
                  </span>
                </div>
                <div className="flex items-center gap-0.5" aria-label={`${r.rating || 5} out of 5 stars`}>
                  {[1, 2, 3, 4, 5].map(n => <Star key={n} className={`w-4 h-4 ${n <= (r.rating || 5) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />)}
                </div>
                <p className="text-sm text-slate-700 whitespace-pre-wrap break-words">{r.comment}</p>
                {r.videoUrl && <a href={r.videoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-[#002DC2] hover:underline break-all"><ExternalLink className="w-4 h-4 shrink-0" /> Video</a>}
                <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-100">
                  {r.approved ? (
                    <button type="button" onClick={() => setApproved(r, false)} disabled={busy === r._id} className={btnGhost}><EyeOff className="w-4 h-4" /> Hide</button>
                  ) : (
                    <button type="button" onClick={() => setApproved(r, true)} disabled={busy === r._id} className={btnPrimary}><CheckCircle2 className="w-4 h-4" /> Approve</button>
                  )}
                  {confirmId !== r._id && (
                    <button type="button" onClick={() => setConfirmId(r._id)} className={`${btnGhost} text-red-600 hover:bg-red-50`}><Trash2 className="w-4 h-4" /> Delete</button>
                  )}
                </div>
                {confirmId === r._id && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-3 space-y-2">
                    <p className="text-sm font-bold text-red-800">Delete this review permanently?</p>
                    <div className="flex flex-wrap gap-2">
                      <button type="button" onClick={() => remove(r)} disabled={busy === r._id} className={btnDanger}><Trash2 className="w-4 h-4" /> Yes, delete</button>
                      <button type="button" onClick={() => setConfirmId(null)} className={btnGhost}><X className="w-4 h-4" /> Cancel</button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </AdminPage>
  );
}

/* ─── Bug status (read-only) ──────────────────────────────────────────────── */
function BugStatus() {
  const now = useNow();
  const [params, setParams] = useSearchParams();
  const view = ['open', 'in-progress', 'completed', 'overdue'].includes(params.get('view')) ? params.get('view') : '';
  const [summary, setSummary] = useState(null);
  const [bugs, setBugs] = useState(null);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const query = view === 'overdue' ? { overdue: 'true' } : view ? { status: view } : {};
      const [s, l] = await Promise.all([adminFetchBugSummary(), adminFetchBugs(query)]);
      setSummary(s.summary);
      setBugs(l.bugs || []);
    } catch (err) { setError(err.message); setBugs(b => b || []); }
    setLoading(false);
  }, [view]);
  useEffect(() => { load(); }, [load]);

  const shown = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (bugs || []).filter(b => !term || [b.title, b.affectedPage, bugCode(b)].some(v => String(v || '').toLowerCase().includes(term)));
  }, [bugs, search]);

  const setView = v => setParams(v ? { view: v } : {}, { replace: true });
  const actions = (
    <button type="button" onClick={load} className={btnGhost} disabled={loading}><RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh</button>
  );

  return (
    <AdminPage title="Bug Status" subtitle="Follow the progress of bugs reported by the testers. Each bug has a 7-day fix deadline." actions={actions}>
      <div className="space-y-5">
        <ErrorNote>{error}</ErrorNote>
        {summary && (
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3">
            <StatCard label="Total reported" value={summary.total} Icon={ListChecks} tone="navy" onClick={() => setView('')} active={view === ''} />
            <StatCard label="Open" value={summary.open} Icon={CircleDot} tone="blue" onClick={() => setView('open')} active={view === 'open'} />
            <StatCard label="In progress" value={summary.inProgress} Icon={Timer} tone="amber" onClick={() => setView('in-progress')} active={view === 'in-progress'} />
            <StatCard label="Fixed" value={summary.completed} Icon={CheckCircle2} tone="green" onClick={() => setView('completed')} active={view === 'completed'}
              sub={summary.completed ? `${summary.completedOnTime} on time · ${summary.completedLate} late` : ''} />
            <StatCard label="Overdue" value={summary.overdue} Icon={AlertTriangle} tone="red" onClick={() => setView('overdue')} active={view === 'overdue'} danger={summary.overdue > 0} />
          </div>
        )}
        <div className={`${adminCard} p-3 sm:p-4 flex flex-col sm:flex-row gap-2`}>
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input className={`${inputCls} pl-9`} placeholder="Search title, page or #number" value={search} onChange={e => setSearch(e.target.value)} aria-label="Search bugs" />
          </div>
          <select className={`${inputCls} sm:w-56`} value={view} onChange={e => setView(e.target.value)} aria-label="Show">
            <option value="">All bugs</option>
            <option value="open">Open</option>
            <option value="in-progress">In progress</option>
            <option value="completed">Fixed</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
        {bugs === null ? <Loading /> : shown.length === 0 ? (
          <div className={`${adminCard} p-10 text-center space-y-2`}>
            <BugIcon className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-sm text-slate-500">{bugs.length ? 'No bugs match your search.' : view ? 'No bugs in this view.' : 'No bugs have been reported yet.'}</p>
          </div>
        ) : (
          <>
            <p className="text-xs font-bold text-slate-500">{shown.length} bug{shown.length === 1 ? '' : 's'}</p>
            <BugList bugs={shown} now={now} linkFor={b => `${BASE}/bugs/${b._id}`} />
          </>
        )}
      </div>
    </AdminPage>
  );
}

function BugStatusDetail() {
  const { id } = useParams();
  const now = useNow();
  const [bug, setBug] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    adminFetchBug(id).then(d => { if (!cancelled) setBug(d.bug); }).catch(err => { if (!cancelled) setError(err.message); });
    return () => { cancelled = true; };
  }, [id]);

  const back = { to: `${BASE}/bugs`, label: 'Bug status' };
  if (!bug) return <AdminPage title="Bug" back={back}>{error ? <ErrorNote>{error}</ErrorNote> : <Loading />}</AdminPage>;
  const overdue = isOverdueAt(bug, now);

  return (
    <AdminPage title={bugCode(bug)} subtitle={bug.title} back={back}>
      <div className="space-y-5 max-w-5xl">
        {overdue && (
          <div className="flex items-start gap-3 rounded-2xl bg-red-50 border border-red-200 text-red-800 p-4" role="alert">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm"><b>Overdue.</b> The 7-day deadline passed on {formatDateTime(bug.deadline)}. The developers have been alerted on their dashboard.</p>
          </div>
        )}
        <div className={`${adminCard} p-5 sm:p-6 space-y-4`}>
          <div className="space-y-2">
            <h2 className="text-xl font-black text-[#123B92] break-words">{bug.title}</h2>
            <div className="flex flex-wrap gap-1.5"><BugBadges bug={bug} now={now} showPriority={false} /><PriorityBadge priority={bug.priority} /><SeverityBadge severity={bug.severity} /></div>
          </div>
          <dl className="grid sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
            <Field label="Affected page">{bug.affectedPage}</Field>
            <Field label="Reported by">{bug.reportedBy}</Field>
            <Field label="Submitted">{formatDateTime(bug.submittedAt)}</Field>
            <Field label="Deadline (7 days)"><span className="block">{formatDateTime(bug.deadline)}</span><DeadlineText bug={bug} now={now} /></Field>
            {bug.assignedTo && <Field label="Assigned developer">{bug.assignedTo}</Field>}
            {bug.completedAt && <Field label="Fixed">{formatDateTime(bug.completedAt)} by {bug.completedBy}{bug.completedLate ? ' (after the deadline)' : ''}</Field>}
            <Field label="Description" wide>{bug.description}</Field>
            {bug.developerNotes && <Field label="Developer notes" wide>{bug.developerNotes}</Field>}
          </dl>
        </div>
        <section className={`${adminCard} p-5 sm:p-6 space-y-3`}>
          <h2 className="font-black text-[#123B92]">Screenshots ({bug.screenshots.length})</h2>
          <ScreenshotGallery screenshots={bug.screenshots} />
        </section>
        <section className={`${adminCard} p-5 sm:p-6 space-y-3`}>
          <h2 className="font-black text-[#123B92]">Progress</h2>
          <HistoryList history={bug.history} />
        </section>
      </div>
    </AdminPage>
  );
}

