// /admin/login — pick which admin area to sign in to
import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Wrench, Bug, ChevronRight } from 'lucide-react';

const PORTALS = [
  { to: '/admin', title: 'Client Admin', text: 'Manage website products, sections and gallery.', Icon: LayoutDashboard },
  { to: '/admin/developer', title: 'Developer Admin', text: 'Review, prioritise and fix reported bugs. Download reports.', Icon: Wrench },
  { to: '/admin/tester', title: 'Tester', text: 'Report bugs with screenshots and track their progress.', Icon: Bug }
];

export default function AdminLoginChooser() {
  return (
    <div className="min-h-[70vh] bg-slate-50 px-4 py-12">
      <div className="max-w-lg mx-auto space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-black text-[#123B92]">ZeniTEK Admin</h1>
          <p className="text-sm text-slate-500">Choose where you want to sign in.</p>
        </div>
        <ul className="space-y-3">
          {PORTALS.map(({ to, title, text, Icon }) => (
            <li key={to}>
              <Link to={to} className="flex items-center gap-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 hover:border-[#002DC2]/50 hover:shadow-md transition-all">
                <span className="w-11 h-11 rounded-xl bg-[#002DC2]/10 text-[#002DC2] flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-black text-slate-900">{title}</span>
                  <span className="block text-sm text-slate-500">{text}</span>
                </span>
                <ChevronRight className="w-5 h-5 text-slate-400 shrink-0" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
