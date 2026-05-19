import React, { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheckCircle, FiXCircle, FiInfo, FiAlertCircle, FiX } from "react-icons/fi";

export type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  description?: string;
}

interface ToastContextType {
  toast: (options: Omit<Toast, "id">) => void;
  success: (message: string, description?: string) => void;
  error: (message: string, description?: string) => void;
  info: (message: string, description?: string) => void;
  warning: (message: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

const iconMap = {
  success: <FiCheckCircle className="text-green-500 w-5 h-5 mt-0.5 flex-shrink-0" />,
  error: <FiXCircle className="text-red-500 w-5 h-5 mt-0.5 flex-shrink-0" />,
  info: <FiInfo className="text-blue-500 w-5 h-5 mt-0.5 flex-shrink-0" />,
  warning: <FiAlertCircle className="text-yellow-500 w-5 h-5 mt-0.5 flex-shrink-0" />
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((options: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...options, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  const success = useCallback((message: string, description?: string) => toast({ type: "success", message, description }), [toast]);
  const error = useCallback((message: string, description?: string) => toast({ type: "error", message, description }), [toast]);
  const info = useCallback((message: string, description?: string) => toast({ type: "info", message, description }), [toast]);
  const warning = useCallback((message: string, description?: string) => toast({ type: "warning", message, description }), [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error, info, warning }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className="bg-surface border border-border/20 shadow-xl rounded-xl p-4 flex gap-3 pointer-events-auto"
              layout
            >
              {iconMap[t.type]}
              <div className="flex-1">
                <p className="font-semibold text-foreground text-sm">{t.message}</p>
                {t.description && <p className="text-muted text-xs mt-1">{t.description}</p>}
              </div>
              <button onClick={() => removeToast(t.id)} className="text-muted hover:text-foreground transition-colors self-start">
                <FiX className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
