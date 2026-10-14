"use client";

import React, { useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export interface ToastMessage {
  id: string;
  type: "success" | "warning" | "info";
  title: string;
  description?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />;
      case "warning":
        return <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />;
      case "info":
        return <Info className="w-4 h-4 text-brand flex-shrink-0" />;
    }
  };

  const getBorderColor = () => {
    switch (toast.type) {
      case "success":
        return "border-emerald-500/30 bg-surface/90 shadow-glow-emerald";
      case "warning":
        return "border-amber-500/30 bg-surface/90 shadow-glow-amber";
      case "info":
        return "border-brand/30 bg-surface/90 shadow-glow-brand";
    }
  };

  return (
    <div
      className={`pointer-events-auto flex items-start justify-between gap-3 p-3.5 rounded-xl border backdrop-blur-xl shadow-2xl transition-all duration-300 animate-in slide-in-from-bottom-3 ${getBorderColor()}`}
    >
      <div className="flex items-start gap-2.5">
        <div className="mt-0.5">{getIcon()}</div>
        <div>
          <h4 className="text-xs font-semibold text-white tracking-tight">{toast.title}</h4>
          {toast.description && (
            <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{toast.description}</p>
          )}
        </div>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-slate-500 hover:text-slate-300 p-0.5 transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
