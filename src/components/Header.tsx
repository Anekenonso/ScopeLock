"use client";

import React from "react";
import { ShieldCheck, Download, RotateCcw } from "lucide-react";
import { Project, BaselineVersion } from "@/types";

interface HeaderProps {
  project: Project | null;
  activeBaseline: BaselineVersion | null;
  onExport: () => void;
  onResetPrompt: () => void;
}

export function Header({
  project,
  activeBaseline,
  onExport,
  onResetPrompt,
}: HeaderProps) {
  return (
    <header className="border-b border-surface-border bg-canvas/80 backdrop-blur-md sticky top-0 z-30 px-6 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-brand/10 border border-brand/30 flex items-center justify-center text-brand shadow-[0_0_15px_rgba(56,189,248,0.15)]">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-white tracking-tight">
              ScopeLock
            </h1>
            <span className="text-xs font-mono text-slate-500">•</span>
            <span className="text-sm font-medium text-slate-300">
              {project ? project.name : "No Project"}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Client Brief & Scope Creep Protection Engine
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        {activeBaseline ? (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{activeBaseline.versionNumber} Active</span>
          </div>
        ) : (
          <div className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono">
            Draft Mode
          </div>
        )}

        {project && (
          <>
            <button
              onClick={onExport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-surface-elevated hover:bg-slate-700/60 border border-surface-border text-slate-300 text-xs font-medium transition-all"
              title="Download full project JSON backup"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Export JSON</span>
            </button>

            <button
              onClick={onResetPrompt}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-medium transition-all"
              title="Reset and clear project data"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </>
        )}
      </div>
    </header>
  );
}
