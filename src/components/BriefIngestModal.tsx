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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-ink-surface border border-white/10 rounded-3xl shadow-floating overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white tracking-tight">
                Initialize Project & Scope
              </h2>
              <p className="text-[11px] text-slate-400">
                Extract numbered deliverables from client briefs or emails
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

        <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
          {error && (
            <div className="px-4 py-2.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs uppercase font-bold text-slate-300 tracking-wider mb-1.5">
              Project Name
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="e.g. Acme SaaS Redesign"
              className="w-full px-4 py-2.5 rounded-full bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-brand transition-colors"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs uppercase font-bold text-slate-300 tracking-wider">
                Client Brief / Statement of Work
              </label>
              <button
                type="button"
                onClick={handleLoadDemo}
                className="flex items-center gap-1 text-xs text-brand hover:text-sky-300 font-semibold transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Fill Sample Brief</span>
              </button>
            </div>
            <textarea
              rows={7}
              value={briefText}
              onChange={(e) => setBriefText(e.target.value)}
              placeholder="Paste email, scope agreement, or numbered requirements..."
              className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-slate-200 text-xs font-sans focus:outline-none focus:border-brand transition-colors leading-relaxed"
            />
            <p className="mt-1 text-[11px] text-slate-400">
              Bullet points and numbered items will automatically convert into editable deliverable cards.
            </p>
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
              type="submit"
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-white hover:bg-slate-100 text-slate-950 text-xs font-extrabold shadow-soft transition-all hover:scale-102 active:scale-98"
            >
              <Plus className="w-4 h-4" />
              <span>Parse & Lock Baseline</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
