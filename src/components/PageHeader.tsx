import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { cn } from '../lib/cn';

export interface Crumb {
  label: string;
  to?: string;
}

export interface PageHeaderProps {
  /** Breadcrumb trail giving the page context (last item is the current page). */
  crumbs: Crumb[];
  title: string;
  description?: ReactNode;
  /** Right-aligned actions (buttons). */
  actions?: ReactNode;
  /** Optional status/meta node shown next to the title. */
  meta?: ReactNode;
  className?: string;
}

/** Structured page header: breadcrumb context + a measured title (not oversized). */
export function PageHeader({ crumbs, title, description, actions, meta, className }: PageHeaderProps) {
  return (
    <div className={cn('border-b border-slate-200 pb-4', className)}>
      <nav className="flex items-center gap-1 text-2xs font-medium text-slate-400">
        {crumbs.map((c, i) => {
          const last = i === crumbs.length - 1;
          return (
            <span key={`${c.label}-${i}`} className="flex items-center gap-1">
              {i > 0 && <ChevronRight size={11} className="text-slate-300" />}
              {c.to && !last ? (
                <Link to={c.to} className="uppercase tracking-[0.06em] transition-colors hover:text-slate-700">
                  {c.label}
                </Link>
              ) : (
                <span className={cn('uppercase tracking-[0.06em]', last && 'text-slate-600')}>
                  {c.label}
                </span>
              )}
            </span>
          );
        })}
      </nav>

      <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">{title}</h1>
            {meta}
          </div>
          {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
