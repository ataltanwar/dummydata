import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000); // 4 seconds before auto-dismiss
  }, [removeToast]);

  const success = useCallback((msg: string) => addToast(msg, 'success'), [addToast]);
  const error = useCallback((msg: string) => addToast(msg, 'error'), [addToast]);
  const info = useCallback((msg: string) => addToast(msg, 'info'), [addToast]);

  // Reverse toasts so the newest toast is at index 0
  const visibleToasts = [...toasts].reverse().slice(0, 5);

  return (
    <ToastContext.Provider value={{ toast: addToast, success, error, info }}>
      {children}
      
      {/* Toast Overlay */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 sm:bottom-6 sm:right-6 sm:left-auto sm:translate-x-0 z-50 pointer-events-none w-full max-w-[calc(100vw-24px)] sm:max-w-sm h-[200px] flex items-end justify-center sm:justify-end select-none box-border">
        <div className="relative w-full h-full flex items-end justify-center sm:justify-end">
          <AnimatePresence mode="popLayout">
            {visibleToasts.map((t, index) => {
              let icon = <Info className="w-4 h-4 text-[#1973FC]" />;
              if (t.type === 'success') {
                icon = <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
              } else if (t.type === 'error') {
                icon = <XCircle className="w-4 h-4 text-rose-500" />;
              }
   
              return (
                <motion.div
                  key={t.id}
                  layout
                  initial={{ opacity: 0, y: 40, scale: 0.9, filter: 'blur(4px)' }}
                  animate={{
                    y: -index * 12,
                    scale: 1 - index * 0.02,
                    opacity: Math.max(0, 1 - index * 0.25),
                    filter: `blur(${index * 1.5}px)`,
                    zIndex: 100 - index,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    y: 15,
                    filter: 'blur(4px)',
                    transition: { duration: 0.2 }
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 280,
                    damping: 24,
                    layout: { type: 'spring', stiffness: 280, damping: 24 }
                  }}
                  className="absolute right-0 bottom-0 w-full flex items-center gap-3 p-4 rounded-2xl border pointer-events-auto bg-bg-surface/85 border-border-primary text-text-primary backdrop-blur-md shadow-md box-border"
                  style={{
                    transformOrigin: 'bottom center',
                  }}
                >
                  <div className="shrink-0">{icon}</div>
                  <div className="flex-1 text-xs font-semibold leading-normal pr-2 text-text-primary">{t.message}</div>
                  <button
                    onClick={() => removeToast(t.id)}
                    className="shrink-0 p-1 rounded-lg hover:bg-bg-neutral text-text-slate-500 hover:text-text-primary transition-colors cursor-pointer"
                    aria-label="Dismiss toast"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </ToastContext.Provider>
  );
}
