/**
 * Deterministic formatting helpers. All inputs are fixed ISO strings
 * (YYYY-MM-DD) from the seed data — no `Date.now()` / live clock.
 */

/** ISO date (YYYY-MM-DD) → DD/MM/YYYY for display. */
export function formatDate(iso?: string | null): string {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

/** ISO datetime → "DD/MM/YYYY HH:mm". */
export function formatDateTime(iso?: string | null): string {
  if (!iso) return '—';
  const [date, time = ''] = iso.split('T');
  return `${formatDate(date)} ${time.slice(0, 5)}`.trim();
}

/** Shift a fixed ISO date by `n` days, returning a new ISO date string. */
export function addDays(iso: string, n: number): string {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + n);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Whole days from `fromIso` to `toIso` (negative if `toIso` is in the past). */
export function daysBetween(fromIso: string, toIso: string): number {
  const from = new Date(`${fromIso}T00:00:00`).getTime();
  const to = new Date(`${toIso}T00:00:00`).getTime();
  return Math.round((to - from) / 86_400_000);
}

/** Human label for a day delta relative to "today", e.g. "in 112 days" / "5 days overdue". */
export function relativeDueLabel(days: number): string {
  if (days === 0) return 'due today';
  if (days > 0) return `in ${days} day${days === 1 ? '' : 's'}`;
  const abs = Math.abs(days);
  return `${abs} day${abs === 1 ? '' : 's'} overdue`;
}
