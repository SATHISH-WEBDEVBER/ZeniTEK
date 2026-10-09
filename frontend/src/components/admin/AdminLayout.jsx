// Shared dashboard shell for every admin role (Client Admin, Developer Admin, Tester).
// Renders without the public website chrome (navbar, footer, WhatsApp widget, reveal animation).
//
//   <AdminLayout roleTitle="Client Admin" RoleIcon={LayoutDashboard} nav={[...]} username="..."
//                onLogout={fn} title="Overview" actions={<button/>}> page </AdminLayout>
//
// nav items: { to, label, Icon, end?, badge? }  -> links (active state highlighted)
//            { label, Icon, onClick, busy? }     -> action buttons (e.g. "Download Excel Report")
import React, { useCallback, useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  Menu, X, LogOut, ExternalLink, User, Lock, Eye, EyeOff, LogIn, Loader, AlertCircle, ArrowLeft
} from 'lucide-react';
import useScrollLock, { useEscapeKey } from '../../hooks/useScrollLock';

/* ─── Shared admin style tokens ──────────────────────────────────────────── */
export const adminCard = 'bg-white rounded-2xl border border-slate-200 shadow-sm';

function NavItems({ nav, onNavigate }) {
  return (
    <ul className="space-y-1">
      {nav.map(item => {
        const { Icon } = item;
        const inner = (
          <>
            {item.busy ? <Loader className="w-5 h-5 shrink-0 animate-spin" /> : <Icon className="w-5 h-5 shrink-0" />}
            <span className="truncate flex-1 text-left">{item.label}</span>
            {item.badge ? (
              <span className={`ml-auto min-w-[1.5rem] text-center rounded-full px-1.5 py-0.5 text-[11px] font-bold ${item.badgeTone === 'danger' ? 'bg-red-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
                {item.badge}
              </span>
            ) : null}
          </>
        );
        const base = 'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer';
        if (item.onClick) {
          return (
            <li key={item.label}>
              <button type="button" disabled={item.busy} onClick={() => { item.onClick(); onNavigate?.(); }}
                className={`${base} text-[#1A822B] hover:bg-green-50 disabled:opacity-60`}>
                {inner}
              </button>
            </li>
          );
        }
        return (
          <li key={item.to}>
            <NavLink to={item.to} end={item.end} onClick={onNavigate}
              className={({ isActive }) => `${base} ${isActive ? 'bg-[#002DC2] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>
              {inner}
            </NavLink>
          </li>
        );
      })}
    </ul>
  );
}

function SidebarContent({ roleTitle, RoleIcon, nav, username, onLogout, homeTo, onNavigate }) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-5 pb-4 border-b border-slate-100">
        <Link to={homeTo} onClick={onNavigate} className="block">
          <img src="/logo.png" alt="ZeniTEK" className="h-9 w-auto object-contain" />
        </Link>
        <p className="mt-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#123B92]">
          <RoleIcon className="w-4 h-4" /> {roleTitle}
        </p>
      </div>
      <nav aria-label={`${roleTitle} navigation`} className="flex-1 overflow-y-auto px-3 py-4">
        <NavItems nav={nav} onNavigate={onNavigate} />
      </nav>
      <div className="border-t border-slate-100 px-3 py-4 space-y-1">
        {/* rel="opener" keeps this tab's session in the new tab (the tester's "Report a bug" button needs it) */}
        <a href="/" target="_blank" rel="opener"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
          <ExternalLink className="w-5 h-5 shrink-0" /> View website
        </a>
        <div className="flex items-center gap-3 px-3 py-2.5">
          <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0"><User className="w-4 h-4" /></span>
          <span className="min-w-0">
            <span className="block text-[11px] text-slate-500">Signed in as</span>
            <span className="block text-sm font-bold text-slate-800 truncate" data-testid="admin-username">{username}</span>
          </span>
        </div>
        <button type="button" onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer">
          <LogOut className="w-5 h-5 shrink-0" /> Sign out
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout({
  roleTitle, RoleIcon, nav, username, onLogout, homeTo = '/admin',
  title, subtitle, actions, back, children
}) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const { pathname } = useLocation();

  useScrollLock(open);
  useEscapeKey(open, close);
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  useEffect(() => {
    document.title = `${title ? `${title} · ` : ''}${roleTitle} · ZeniTEK`;
  }, [title, roleTitle]);

  const sidebarProps = { roleTitle, RoleIcon, nav, username, onLogout, homeTo };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-200 z-30">
        <SidebarContent {...sidebarProps} />
      </aside>

      {/* Mobile top bar */}
      <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-slate-200">
        <div className="flex items-center gap-3 px-4 h-14">
          <button type="button" onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open}
            className="w-10 h-10 -ml-2 rounded-xl flex items-center justify-center text-slate-700 hover:bg-slate-100 cursor-pointer">
            <Menu className="w-6 h-6" />
          </button>
          <Link to={homeTo} className="flex items-center gap-2 min-w-0">
            <img src="/logo.png" alt="ZeniTEK" className="h-7 w-auto object-contain shrink-0" />
            <span className="text-sm font-bold text-[#123B92] truncate">{roleTitle}</span>
          </Link>
        </div>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={`${roleTitle} menu`}>
          <div className="absolute inset-0 bg-slate-900/50" onClick={close} />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-white shadow-xl">
            <button type="button" onClick={close} aria-label="Close menu"
              className="absolute right-3 top-4 w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <SidebarContent {...sidebarProps} onNavigate={close} />
          </div>
        </div>
      )}

      {/* Main area */}
      <div className="lg:pl-64 min-w-0">
        <div className="lg:sticky lg:top-0 z-20 bg-slate-50/95 lg:backdrop-blur border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="min-w-0">
              {back && (
                <Link to={back.to} className="inline-flex items-center gap-1 text-xs font-bold text-[#002DC2] hover:underline mb-1">
                  <ArrowLeft className="w-4 h-4" /> {back.label}
                </Link>
              )}
              <h1 className="text-xl sm:text-2xl font-black text-[#123B92] break-words">{title}</h1>
              {subtitle && <p className="text-sm text-slate-500 break-words">{subtitle}</p>}
            </div>
            {actions && <div className="flex flex-wrap items-center gap-2 shrink-0">{actions}</div>}
          </div>
        </div>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">{children}</main>
      </div>
    </div>
  );
}

/* ─── Stat card ──────────────────────────────────────────────────────────── */
const TONES = {
  navy: 'text-[#123B92] bg-blue-50',
  blue: 'text-[#002DC2] bg-blue-50',
  green: 'text-[#1A822B] bg-green-50',
  amber: 'text-amber-700 bg-amber-50',
  red: 'text-red-600 bg-red-50',
  slate: 'text-slate-600 bg-slate-100'
};

export function StatCard({ label, value, sub, Icon, tone = 'navy', to, onClick, danger = false, active = false }) {
  const body = (
    <>
      <span className={`inline-flex w-10 h-10 rounded-xl items-center justify-center ${TONES[tone] || TONES.navy}`}><Icon className="w-5 h-5" /></span>
      <p className={`mt-3 text-2xl font-black ${danger ? 'text-red-600' : 'text-slate-900'}`}>{value ?? '—'}</p>
      <p className="text-sm font-bold text-slate-600">{label}</p>
      {sub && <p className="text-xs text-slate-500 mt-0.5 break-words">{sub}</p>}
    </>
  );
  const cls = `${adminCard} block p-4 text-left min-w-0 transition-shadow ${danger ? 'ring-2 ring-red-500 border-red-200' : ''} ${active ? 'ring-2 ring-[#002DC2]' : ''}`;
  if (to) return <Link to={to} className={`${cls} hover:shadow-md`}>{body}</Link>;
  if (onClick) return <button type="button" onClick={onClick} className={`${cls} hover:shadow-md cursor-pointer w-full`}>{body}</button>;
  return <div className={cls}>{body}</div>;
}

/* ─── Login card (shared by all three roles) ─────────────────────────────── */
export function AdminLoginCard({ roleTitle, subtitle, Icon, onLogin, notice }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { document.title = `${roleTitle} sign in · ZeniTEK`; }, [roleTitle]);

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await onLogin(username.trim(), password);
    } catch (err) {
      setError(err.message || 'Sign-in failed');
      setLoading(false);
    }
  };

  const input = 'w-full border border-slate-200 rounded-xl py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#002DC2]/30 focus:border-[#002DC2]';

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className={`${adminCard} p-6 sm:p-8 space-y-6`}>
          <div className="text-center space-y-3">
            <img src="/logo.png" alt="ZeniTEK" className="h-10 mx-auto object-contain" />
            <div className="space-y-1">
              <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-[#002DC2]">
                <Icon className="w-4 h-4" /> {roleTitle}
              </p>
              <h1 className="text-xl font-black text-[#123B92]">Sign in</h1>
              {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
            </div>
          </div>
          {notice && (
            <div className="flex items-start gap-2 text-amber-800 text-sm bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5" role="status">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /> <span>{notice}</span>
            </div>
          )}
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label htmlFor="admin-login-user" className="block text-xs font-bold text-slate-700 mb-1">Username</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input id="admin-login-user" className={`${input} pl-10 pr-3`} autoComplete="username" value={username}
                  onChange={e => setUsername(e.target.value)} required autoFocus />
              </div>
            </div>
            <div>
              <label htmlFor="admin-login-pass" className="block text-xs font-bold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input id="admin-login-pass" type={show ? 'text' : 'password'} className={`${input} pl-10 pr-11`} autoComplete="current-password"
                  value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="button" onClick={() => setShow(s => !s)} aria-label={show ? 'Hide password' : 'Show password'} aria-pressed={show}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer">
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {error && (
              <div className="flex items-start gap-2 text-red-700 text-sm bg-red-50 border border-red-100 rounded-xl px-3 py-2.5" role="alert">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /> <span className="break-words">{error}</span>
              </div>
            )}
            <button type="submit" disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-[#002DC2] hover:bg-[#123B92] text-white text-sm font-bold disabled:opacity-60 transition-colors cursor-pointer">
              {loading ? <Loader className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
        <p className="mt-4 text-center text-xs text-slate-500">
          Wrong portal? <Link to="/admin/login" className="font-bold text-[#002DC2] hover:underline">Choose another sign-in</Link>
          <span className="mx-1.5">·</span>
          <Link to="/" className="font-bold text-slate-600 hover:underline">Back to website</Link>
        </p>
      </div>
    </div>
  );
}

/* ─── Per-role shell context: each page renders <AdminPage title actions> ─── */
export const AdminShellContext = React.createContext(null);

export function AdminPage(props) {
  const shell = React.useContext(AdminShellContext);
  return <AdminLayout {...shell} {...props} />;
}
