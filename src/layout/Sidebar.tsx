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
    <aside className="flex w-60 shrink-0 flex-col border-r border-slate-200 bg-white">
      {/* Active role marker */}
      <div className="border-b border-slate-200 px-3 py-3">
        <div className="flex items-center gap-2.5 px-1">
          <span className="flex h-8 w-8 items-center justify-center rounded border border-brand-800 bg-brand-700 text-white">
            <RoleIcon size={15} />
          </span>
          <div className="leading-tight">
            <p className="label-eyebrow">Active role</p>
            <p className="text-sm font-semibold text-slate-800">{meta.label}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-2 py-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'group relative flex items-center gap-2.5 rounded px-2.5 py-2 text-[13px] font-medium transition-colors',
                  isActive
                    ? 'bg-brand-50 text-brand-800'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                )
              }
            >
              {({ isActive }) => (
                <>
                  {/* Active left marker */}
                  <span
                    className={cn(
                      'absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-r bg-accent-500 transition-opacity',
                      isActive ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  <Icon
                    size={16}
                    className={
                      isActive ? 'text-brand-700' : 'text-slate-400 group-hover:text-slate-600'
                    }
                  />
                  {item.label}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-slate-200 px-3 py-3">
        <p className="label-eyebrow">Demo environment</p>
        <p className="mt-0.5 text-xs text-slate-400">Scripted data · no backend</p>
      </div>
    </aside>
  );
}
