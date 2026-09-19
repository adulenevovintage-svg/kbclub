import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'info';
  title: string;
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`pointer-events-auto p-4 rounded-2xl border shadow-2xl flex items-start gap-3 text-xs animate-in slide-in-from-bottom-5 duration-200 ${
            toast.type === 'success'
              ? 'bg-[#121814] border-emerald-500/40 text-emerald-300'
              : toast.type === 'warning'
              ? 'bg-[#1a1711] border-amber-500/40 text-amber-300'
              : 'bg-[#14161f] border-[#c5832b]/40 text-zinc-200'
          }`}
        >
          {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
          {toast.type === 'warning' && <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />}
          {toast.type === 'info' && <Info className="w-4 h-4 text-[#c5832b] shrink-0 mt-0.5" />}

          <div className="flex-1">
            <div className="font-bold text-white">{toast.title}</div>
            <div className="text-[11px] text-zinc-300 mt-0.5 leading-relaxed">{toast.message}</div>
          </div>

          <button
            onClick={() => onDismiss(toast.id)}
            className="text-zinc-400 hover:text-white shrink-0 p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
