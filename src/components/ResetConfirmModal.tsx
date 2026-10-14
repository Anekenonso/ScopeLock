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
  const [typedConfirm, setTypedConfirm] = useState("");

  if (!isOpen) return null;

  const isConfirmed = typedConfirm.trim().toUpperCase() === "RESET";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-surface border border-rose-500/30 rounded-xl shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-surface-border flex items-center justify-between bg-rose-500/5">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
            <h2 className="text-base font-semibold text-white">
              Reset Project Data
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-300 leading-relaxed">
            This will <strong className="text-rose-400">permanently delete</strong> all baseline versions, scope items, and historical decisions stored in this browser.
          </p>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5">
              Type <strong className="text-white font-mono">RESET</strong> to confirm:
            </label>
            <input
              type="text"
              value={typedConfirm}
              onChange={(e) => setTypedConfirm(e.target.value)}
              placeholder="RESET"
              className="w-full px-3 py-2 rounded-lg bg-canvas border border-surface-border text-white text-sm font-mono focus:outline-none focus:border-rose-500 transition-colors"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-surface-border">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-slate-400 hover:text-white text-xs font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              disabled={!isConfirmed}
              onClick={() => {
                onConfirmReset();
                onClose();
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-rose-500 hover:bg-rose-600 disabled:opacity-40 text-white text-xs font-semibold shadow-lg shadow-rose-500/20 transition-all"
            >
              <Trash2 className="w-4 h-4" />
              <span>Confirm Wipe</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
