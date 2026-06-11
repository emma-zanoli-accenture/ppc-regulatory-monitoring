import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '../lib/cn';

/** Lock body scroll while any overlay is open + close on Escape. */
function useOverlayBehavior(open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);
}

interface OverlayHeaderProps {
  title?: ReactNode;
  description?: ReactNode;
  onClose: () => void;
}

function OverlayHeader({ title, description, onClose }: OverlayHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-4">
      <div className="min-w-0">
        {title && (
          <h2 className="text-base font-semibold tracking-tight text-slate-900">{title}</h2>
        )}
        {description && <p className="mt-0.5 text-sm text-slate-500">{description}</p>}
      </div>
      <button
        onClick={onClose}
        aria-label="Close"
        className="-mr-2 -mt-1 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
      >
        <X size={18} />
      </button>
    </div>
  );
}

export type ModalSize = 'sm' | 'md' | 'lg';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  size?: ModalSize;
}

const MODAL_SIZES: Record<ModalSize, string> = {
  sm: 'max-w-md',
  md: 'max-w-xl',
  lg: 'max-w-3xl',
};

/** Centered dialog. */
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
}: ModalProps) {
  useOverlayBehavior(open, onClose);

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-200',
        open ? 'opacity-100' : 'pointer-events-none opacity-0',
      )}
      aria-hidden={!open}
    >
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'relative z-10 w-full overflow-hidden rounded-2xl bg-white shadow-overlay',
          'transition-all duration-200',
          open ? 'translate-y-0 scale-100' : 'translate-y-2 scale-[0.98]',
          MODAL_SIZES[size],
        )}
      >
        <OverlayHeader title={title} description={description} onClose={onClose} />
        <div className="max-h-[70vh] overflow-y-auto scrollbar-slim px-6 py-5">{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50/60 px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export type SlideOverWidth = 'md' | 'lg' | 'xl';

export interface SlideOverProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  width?: SlideOverWidth;
}

const SLIDEOVER_WIDTHS: Record<SlideOverWidth, string> = {
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
};

/** Right-side drawer — for the AI chatbot panel and detail views. */
export function SlideOver({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  width = 'lg',
}: SlideOverProps) {
  useOverlayBehavior(open, onClose);

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 transition-opacity duration-300',
        open ? 'opacity-100' : 'pointer-events-none opacity-0',
      )}
      aria-hidden={!open}
    >
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'absolute right-0 top-0 flex h-full w-full flex-col bg-white shadow-overlay',
          'transition-transform duration-300 ease-out',
          open ? 'translate-x-0' : 'translate-x-full',
          SLIDEOVER_WIDTHS[width],
        )}
      >
        <OverlayHeader title={title} description={description} onClose={onClose} />
        <div className="flex-1 overflow-y-auto scrollbar-slim px-6 py-5">{children}</div>
        {footer && (
          <div className="border-t border-slate-100 bg-slate-50/60 px-6 py-4">{footer}</div>
        )}
      </div>
    </div>
  );
}
