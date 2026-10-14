"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Download,
  RotateCcw,
  Plus,
  Sparkles,
  ChevronDown,
  Layers,
  AlertTriangle,
  History,
  Lock,
} from "lucide-react";
import { Project, BaselineVersion } from "@/types";
import { KILL_TEST_CASES, KillTestCase } from "@/lib/fixtures/killTestCases";

interface HeaderProps {
  project: Project | null;
  activeBaseline: BaselineVersion | null;
  onExport: () => void;
  onResetPrompt: () => void;
  onNewProjectPrompt: () => void;
  onSelectTestScenario?: (scenario: KillTestCase) => void;
  onLoadDemoPrompt: () => void;
}

export function Header({
  project,
  activeBaseline,
  onExport,
  onResetPrompt,
  onNewProjectPrompt,
  onSelectTestScenario,
  onLoadDemoPrompt,
}: HeaderProps) {
  const [isScenariosOpen, setIsScenariosOpen] = useState(false);

  const totalBaselineItems = activeBaseline?.items.length || 0;
  const decisionsCount = project?.decisions.length || 0;
  const creepCount =
    project?.decisions.filter((d) => d.status === "POSSIBLE_CHANGE").length || 0;

  return (
    <header className="sticky top-3 z-30 px-4 sm:px-6 py-1 pointer-events-none transition-all">
      <div className="max-w-7xl mx-auto floating-header rounded-full px-5 py-2.5 flex items-center justify-between pointer-events-auto">
        {/* Brand & Wordmark */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand to-sky-400 flex items-center justify-center text-slate-950 shadow-sm">
            <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-extrabold text-white tracking-tight">
              ScopeLock
            </span>
            {project && (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-brand"></span>
                {project.name}
              </span>
            )}
          </div>
        </div>

        {/* Center Indicators / Badges */}
        {project && activeBaseline ? (
          <div className="hidden md:flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span className="font-semibold text-white">{activeBaseline.versionNumber}</span>
              <span className="text-slate-400">Locked ({totalBaselineItems} items)</span>
            </div>

            {creepCount > 0 && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                <AlertTriangle className="w-3 h-3 text-rose-400" />
                <span>{creepCount} scope creep flagged</span>
              </div>
            )}
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-slate-400">
            <span>Deterministic Scope Engine</span>
          </div>
        )}

        {/* Right Actions: Clean Pill Buttons */}
        <div className="flex items-center gap-2">
          {project && activeBaseline && onSelectTestScenario && (
            <div className="relative">
              <button
                onClick={() => setIsScenariosOpen(!isScenariosOpen)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-200 font-semibold transition-all hover:scale-102"
              >
                <Sparkles className="w-3.5 h-3.5 text-brand" />
                <span>Test Scenarios</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isScenariosOpen && (
                <div
                  className="absolute right-0 mt-2 w-80 max-h-80 overflow-y-auto bg-ink-surface/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-floating p-2 z-50 animate-in fade-in zoom-in-95"
                  onMouseLeave={() => setIsScenariosOpen(false)}
                >
                  <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400 border-b border-white/5 mb-1 font-semibold">
                    12 Kill-Test Scenarios
                  </div>
                  {KILL_TEST_CASES.map((tc) => (
                    <button
                      key={tc.id}
                      onClick={() => {
                        onSelectTestScenario(tc);
                        setIsScenariosOpen(false);
                      }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-white/5 transition-colors text-xs space-y-1 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-200 group-hover:text-brand transition-colors text-[11px]">
                          Case #{tc.id}
                        </span>
                        <span
                          className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${
                            tc.expectedStatus === "IN_SCOPE"
                              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                              : tc.expectedStatus === "POSSIBLE_CHANGE"
                              ? "bg-rose-500/10 border-rose-500/30 text-rose-400"
                              : "bg-amber-500/10 border-amber-500/30 text-amber-400"
                          }`}
                        >
                          {tc.expectedStatus}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">
                        &ldquo;{tc.request}&rdquo;
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {project ? (
            <>
              <button
                onClick={onExport}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-200 font-medium transition-all"
                title="Download project JSON"
              >
                <Download className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline">Export</span>
              </button>

              <button
                onClick={onResetPrompt}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 text-xs font-medium transition-all"
                title="Reset workspace"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onLoadDemoPrompt}
                className="px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-200 font-semibold transition-all"
              >
                Load Demo
              </button>
              <button
                onClick={onNewProjectPrompt}
                className="px-5 py-1.5 rounded-full bg-white text-slate-950 hover:bg-slate-100 text-xs font-bold shadow-sm transition-all hover:scale-102"
              >
                Get Started
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
