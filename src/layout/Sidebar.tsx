import { NavLink } from 'react-router-dom';
import { useRole } from '../context/RoleContext';
import { NAV_ITEMS, ROLE_META } from '../config/navigation';
import { cn } from '../lib/cn';

/** Left navigation. Items depend on the active role. */
export function Sidebar() {
  const { role } = useRole();
  const items = NAV_ITEMS[role];
  const meta = ROLE_META[role];
  const RoleIcon = meta.icon;

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
      {/* Active role marker */}
      <div className="px-4 py-4">
        <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-700 text-white">
            <RoleIcon size={16} />
          </span>
          <div className="leading-tight">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Active role
            </p>
            <p className="text-sm font-semibold text-slate-800">{meta.label}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={18}
                    className={isActive ? 'text-brand-600' : 'text-slate-400 group-hover:text-slate-600'}
                  />
                  {item.label}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="px-4 py-4 text-[11px] text-slate-300">
        Demo environment · scripted data
      </div>
    </aside>
  );
}
