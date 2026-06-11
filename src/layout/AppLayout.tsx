import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useRole } from '../context/RoleContext';
import { BRAND } from '../config/brand';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';

/**
 * Application shell: top bar + role-aware sidebar + routed content.
 *
 * Keeps the active role in sync with the URL so the sidebar stays correct even
 * on direct navigation or contextual deep links (e.g. opening a /bu/... route).
 */
export function AppLayout() {
  const { role, setRole } = useRole();
  const location = useLocation();

  useEffect(() => {
    const urlRole = location.pathname.startsWith('/bu')
      ? 'bu'
      : location.pathname.startsWith('/legal')
        ? 'legal'
        : null;
    if (urlRole && urlRole !== role) setRole(urlRole);
  }, [location.pathname, role, setRole]);

  return (
    <div className="flex min-h-screen flex-col">
      <TopBar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex min-w-0 flex-1 flex-col">
          {/* key on the path → subtle fade on every navigation, incl. role switch */}
          <div
            key={location.pathname}
            className="mx-auto w-full max-w-6xl flex-1 px-8 py-8 animate-fade-in"
          >
            <Outlet />
          </div>
          <footer className="border-t border-slate-200/70 px-8 py-4 text-center text-xs text-slate-400">
            {BRAND.name} · Regulatory Change Management — demonstration prototype. Scripted data;
            no live regulatory feeds, backend, or persistence.
          </footer>
        </main>
      </div>
    </div>
  );
}
