"use client";

import React, { useState } from "react";
import { AlertTriangle, X, Trash2 } from "lucide-react";

interface ResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmReset: () => void;
}

export function ResetConfirmModal({
  isOpen,
  onClose,
  onConfirmReset,
}: ResetConfirmModalProps) {
  const [typedConfirmation, setTypedConfirmation] = useState("");

  if (!isOpen) return null;

  const isConfirmed = typedConfirmation.trim().toLowerCase() === "reset";

  const handleConfirm = () => {
    if (!isConfirmed) return;
    onConfirmReset();
    setTypedConfirmation("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-ink-surface border border-rose-500/20 rounded-3xl shadow-floating overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-white tracking-tight">
                Reset Workspace Data
              </h2>
              <p className="text-[11px] text-slate-400">
                Permanent local storage clearance
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-300 leading-relaxed">
            This will permanently erase all baselines, scope items, and decision audit records from your browser&apos;s local storage. This action cannot be undone.
          </p>

          <div className="space-y-1.5">
            <label className="block text-[11px] uppercase font-bold text-slate-400">
              Type <span className="text-rose-400 font-mono">reset</span> to confirm:
            </label>
            <input
              type="text"
              value={typedConfirmation}
              onChange={(e) => setTypedConfirmation(e.target.value)}
              placeholder="reset"
              className="w-full px-4 py-2 rounded-full bg-black/40 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-rose-500 transition-colors"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-slate-400 hover:text-white text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!isConfirmed}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white text-xs font-bold transition-all shadow-glow-rose"
            >
              <Trash2 className="w-4 h-4" />
              <span>Confirm Reset</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
