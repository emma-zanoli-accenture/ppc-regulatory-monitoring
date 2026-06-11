import type { ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface Column<T> {
  /** Stable key for the column. */
  key: string;
  header: ReactNode;
  /** Cell renderer. Defaults to rendering row[key] if it is a primitive. */
  render?: (row: T, index: number) => ReactNode;
  align?: 'left' | 'center' | 'right';
  /** Optional fixed width (e.g. "40%", "12rem"). */
  width?: string;
  /** Extra classes applied to both header and cells in this column. */
  className?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  getRowId: (row: T) => string;
  /** Show a leading checkbox column. */
  selectable?: boolean;
  selectedIds?: string[];
  onToggleRow?: (id: string) => void;
  onToggleAll?: () => void;
  onRowClick?: (row: T) => void;
  /** Highlight selected rows. */
  emptyMessage?: ReactNode;
  className?: string;
  /** Compact row height. */
  dense?: boolean;
}

const ALIGN = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
} as const;

export function DataTable<T>({
  columns,
  data,
  getRowId,
  selectable = false,
  selectedIds = [],
  onToggleRow,
  onToggleAll,
  onRowClick,
  emptyMessage = 'No records to display.',
  className,
  dense = false,
}: DataTableProps<T>) {
  const selected = new Set(selectedIds);
  const allSelected = data.length > 0 && data.every((r) => selected.has(getRowId(r)));
  const someSelected = data.some((r) => selected.has(getRowId(r))) && !allSelected;
  const cellPad = dense ? 'px-4 py-2.5' : 'px-4 py-3.5';

  return (
    <div className={cn('w-full overflow-x-auto scrollbar-slim', className)}>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/60">
            {selectable && (
              <th className={cn('w-10', cellPad)}>
                <input
                  type="checkbox"
                  aria-label="Select all rows"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected;
                  }}
                  onChange={() => onToggleAll?.()}
                  className="h-4 w-4 cursor-pointer rounded border-slate-300 text-brand-700 focus:ring-brand-500"
                />
              </th>
            )}
            {columns.map((col) => (
              <th
                key={col.key}
                style={col.width ? { width: col.width } : undefined}
                className={cn(
                  cellPad,
                  'text-[11px] font-semibold uppercase tracking-wider text-slate-500',
                  ALIGN[col.align ?? 'left'],
                  col.className,
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (selectable ? 1 : 0)}
                className="px-4 py-10 text-center text-sm text-slate-400"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, index) => {
              const id = getRowId(row);
              const isSelected = selected.has(id);
              return (
                <tr
                  key={id}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn(
                    'transition-colors',
                    onRowClick && 'cursor-pointer',
                    isSelected ? 'bg-brand-50/50' : 'hover:bg-slate-50',
                  )}
                >
                  {selectable && (
                    <td className={cellPad} onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        aria-label={`Select row ${id}`}
                        checked={isSelected}
                        onChange={() => onToggleRow?.(id)}
                        className="h-4 w-4 cursor-pointer rounded border-slate-300 text-brand-700 focus:ring-brand-500"
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        cellPad,
                        'text-slate-700 align-middle',
                        ALIGN[col.align ?? 'left'],
                        col.className,
                      )}
                    >
                      {col.render
                        ? col.render(row, index)
                        : ((row as Record<string, unknown>)[col.key] as ReactNode)}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
