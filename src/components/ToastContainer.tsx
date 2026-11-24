import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { ToastMessage } from '../types/task';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2 pl-4 sm:bottom-6 sm:right-6"
    >
      {toasts.map((toast) => {
        const isError = toast.variant === 'error';
        const isInfo = toast.variant === 'info';

        return (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto flex items-center justify-between gap-3 rounded-lg border px-4 py-3 shadow-lg transition-all duration-150 ${
              isError
                ? 'border-red-200 bg-white text-red-700'
                : isInfo
                  ? 'border-slate-200 bg-white text-slate-800'
                  : 'border-emerald-200 bg-white text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {isError ? (
                <AlertCircle
                  className="h-4 w-4 shrink-0 text-red-600"
                  aria-hidden="true"
                />
              ) : isInfo ? (
                <Info
                  className="h-4 w-4 shrink-0 text-blue-600"
                  aria-hidden="true"
                />
              ) : (
                <CheckCircle2
                  className="h-4 w-4 shrink-0 text-emerald-600"
                  aria-hidden="true"
                />
              )}
              <p className="text-sm font-medium truncate">{toast.message}</p>
            </div>

            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              aria-label="Dismiss notification"
              className="rounded p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 shrink-0"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
