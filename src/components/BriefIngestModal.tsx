"use client";

import React, { useState } from "react";
import { FileText, Sparkles, X, Plus } from "lucide-react";
import { DEMO_CLIENT_BRIEF } from "@/lib/fixtures/demoProject";

interface BriefIngestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (projectName: string, rawBrief: string) => void;
}

export function BriefIngestModal({
  isOpen,
  onClose,
  onSubmit,
}: BriefIngestModalProps) {
  const [projectName, setProjectName] = useState("");
  const [briefText, setBriefText] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleLoadDemo = () => {
    setProjectName("Acme SaaS Portal");
    setBriefText(DEMO_CLIENT_BRIEF);
    setError("");
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = projectName.trim();
    const cleanBrief = briefText.trim();

    if (!cleanName) {
      setError("Please provide a project name.");
      return;
    }
    if (!cleanBrief) {
      setError("Please paste a client brief to extract initial scope items.");
      return;
    }

    onSubmit(cleanName, cleanBrief);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-surface border border-surface-border rounded-xl shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-surface-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand" />
            <h2 className="text-base font-semibold text-white">
              Initialize Project & Client Brief
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
          {error && (
            <div className="px-3 py-2 rounded-md bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
              Project Name
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="e.g. Acme SaaS Redesign"
              className="w-full px-3.5 py-2 rounded-lg bg-canvas border border-surface-border text-white text-sm focus:outline-none focus:border-brand transition-colors"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300">
                Initial Client Brief
              </label>
              <button
                type="button"
                onClick={handleLoadDemo}
                className="flex items-center gap-1 text-xs text-brand hover:text-brand/80 font-mono transition-colors"
              >
                <Sparkles className="w-3 h-3" />
                <span>Load Sample Brief</span>
              </button>
            </div>
            <textarea
              rows={7}
              value={briefText}
              onChange={(e) => setBriefText(e.target.value)}
              placeholder="Paste email, statement of work, or numbered list of requirements..."
              className="w-full px-3.5 py-2.5 rounded-lg bg-canvas border border-surface-border text-slate-200 text-sm font-sans focus:outline-none focus:border-brand transition-colors leading-relaxed"
            />
            <p className="mt-1 text-xs text-slate-500">
              Bullet points or numbered items will automatically be extracted into editable cards.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-surface-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-slate-400 hover:text-white text-xs font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand hover:bg-sky-400 text-slate-950 text-xs font-semibold shadow-lg shadow-brand/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Parse & Create Baseline</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
