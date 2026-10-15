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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl p-5 sm:p-7 space-y-5 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200 text-slate-900">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shadow-sm">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-950 tracking-tight">
                Reset Workspace Data
              </h2>
              <p className="text-xs text-slate-500">
                Permanent local storage clearance
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
          This will permanently erase all baselines, scope items, and decision audit records from your browser&apos;s local storage. This action cannot be undone.
        </p>

        {/* Input Confirmation */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700">
            Type <span className="text-rose-600 font-mono font-extrabold">reset</span> to confirm:
          </label>
          <input
            type="text"
            value={typedConfirmation}
            onChange={(e) => setTypedConfirmation(e.target.value)}
            placeholder="Type 'reset' here..."
            className="w-full px-4 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono focus:outline-none focus:border-rose-500 focus:bg-white transition-colors"
          />
        </div>

        {/* Actions */}
        <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-full text-slate-500 hover:text-slate-800 text-xs font-bold transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!isConfirmed}
            className="flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white text-xs font-extrabold transition-all shadow-sm active:scale-98"
          >
            <Trash2 className="w-4 h-4" />
            <span>Confirm Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
}
