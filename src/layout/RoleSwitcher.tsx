import { useNavigate } from 'react-router-dom';
import { useRole } from '../context/RoleContext';
import type { Role } from '../context/RoleContext';
import { ROLES, ROLE_META } from '../config/navigation';
import { cn } from '../lib/cn';

/**
 * Segmented control used live to switch roles. Selecting a role updates the
 * shared role context and routes to that role's default dashboard.
 */
export function RoleSwitcher() {
  const { role, setRole } = useRole();
  const navigate = useNavigate();

  const select = (next: Role) => {
    if (next === role) return;
    setRole(next);
    navigate(ROLE_META[next].defaultPath);
  };

  return (
    <div
      role="tablist"
      aria-label="Active role"
      className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-100 p-1"
    >
      {ROLES.map((r) => {
        const meta = ROLE_META[r];
        const Icon = meta.icon;
        const active = r === role;
        return (
          <button
            key={r}
            role="tab"
            aria-selected={active}
            onClick={() => select(r)}
            className={cn(
              'inline-flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-sm font-semibold transition-all duration-150',
              active
                ? 'bg-white text-brand-700 shadow-sm ring-1 ring-slate-200'
                : 'text-slate-500 hover:text-slate-700',
            )}
          >
            <Icon size={16} className={active ? 'text-accent-600' : 'text-slate-400'} />
            {meta.label}
          </button>
        );
      })}
    </div>
  );
}
