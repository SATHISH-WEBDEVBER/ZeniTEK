// /admin/login — pick which admin area to sign in to
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Wrench, Bug, ChevronRight } from 'lucide-react';

const PORTALS = [
  { to: '/admin', title: 'Client Admin', text: 'Website content, customer enquiries, reviews and bug-fix progress.', Icon: LayoutDashboard },
  { to: '/admin/developer', title: 'Developer Admin', text: 'Review, prioritise and fix reported bugs. Download Excel reports.', Icon: Wrench },
  { to: '/admin/tester', title: 'Tester', text: 'Report bugs with screenshots and track their progress.', Icon: Bug }
];

export default function AdminLoginChooser() {
  useEffect(() => { document.title = 'Admin sign in · ZeniTEK'; }, []);
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl space-y-8">
        <div className="text-center space-y-3">
          <img src="/logo.png" alt="ZeniTEK" className="h-10 mx-auto object-contain" />
          <div>
            <h1 className="text-2xl font-black text-[#123B92]">Admin sign in</h1>
            <p className="text-sm text-slate-500">Choose where you want to sign in.</p>
          </div>
        </div>
        <ul className="grid gap-3 md:grid-cols-3">
          {PORTALS.map(({ to, title, text, Icon }) => (
            <li key={to}>
              <Link to={to} className="group h-full flex md:flex-col items-center md:items-start gap-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:border-[#002DC2]/50 hover:shadow-md transition-all">
                <span className="w-12 h-12 rounded-xl bg-[#002DC2]/10 text-[#002DC2] flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-black text-slate-900">{title}</span>
                  <span className="block text-sm text-slate-500 mt-1">{text}</span>
                </span>
                <span className="shrink-0 inline-flex items-center gap-1 text-sm font-bold text-[#002DC2]">
                  <span className="hidden md:inline">Sign in</span> <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="text-center text-xs text-slate-500">
          <Link to="/" className="font-bold text-slate-600 hover:underline">Back to website</Link>
        </p>
      </div>
    </div>
  );
}
