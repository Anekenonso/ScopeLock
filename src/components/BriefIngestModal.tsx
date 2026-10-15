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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white border border-slate-200 rounded-3xl shadow-2xl p-5 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200 text-slate-900">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700 shadow-sm">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-950 tracking-tight">
                Initialize Project & Scope
              </h2>
              <p className="text-xs text-slate-500">
                Extract numbered deliverables from client briefs or emails
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

        <form onSubmit={handleFormSubmit} className="space-y-4">
          {error && (
            <div className="px-4 py-2.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs uppercase font-extrabold text-slate-700 tracking-wider mb-1.5">
              Project Name
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="e.g. Acme SaaS Redesign"
              className="w-full px-4 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-brand focus:bg-white transition-colors"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs uppercase font-extrabold text-slate-700 tracking-wider">
                Client Brief / Statement of Work
              </label>
              <button
                type="button"
                onClick={handleLoadDemo}
                className="flex items-center gap-1 text-xs text-brand hover:text-sky-700 font-bold transition-colors"
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
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-sans focus:outline-none focus:border-brand focus:bg-white transition-colors leading-relaxed"
            />
            <p className="mt-1 text-[11px] text-slate-500">
              Bullet points and numbered items will automatically convert into editable deliverable cards.
            </p>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-slate-500 hover:text-slate-800 text-xs font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-slate-950 hover:bg-slate-800 text-white text-xs font-extrabold shadow-sm transition-all hover:scale-102 active:scale-98"
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
