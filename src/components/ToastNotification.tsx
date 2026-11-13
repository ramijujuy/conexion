import React from 'react';
import { CheckCircle2, ShieldAlert, X } from 'lucide-react';

interface ToastNotificationProps {
  message: string | null;
  type?: 'success' | 'alert';
  onClose: () => void;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({
  message,
  type = 'success',
  onClose,
}) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-20 md:bottom-8 right-4 left-4 sm:left-auto sm:right-8 z-50 animate-bounce-short">
      <div className={`p-4 rounded-2xl shadow-xl border flex items-center gap-3 backdrop-blur-md max-w-md ${
        type === 'alert'
          ? 'bg-rose-950/90 text-rose-100 border-rose-800'
          : 'bg-slate-900/90 dark:bg-slate-100/90 text-white dark:text-slate-900 border-slate-700 dark:border-slate-300'
      }`}>
        {type === 'alert' ? (
          <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
        ) : (
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
        )}
        <p className="text-xs font-medium flex-1">{message}</p>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-white/10 dark:hover:bg-black/10 transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
