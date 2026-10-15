"use client";

import React, { useState } from "react";
import {
  Download,
  RotateCcw,
  Plus,
  Sparkles,
  ChevronDown,
  Lock,
  Github,
  LogOut,
  User,
  ShieldAlert,
} from "lucide-react";
import { Project, BaselineVersion } from "@/types";
import { KILL_TEST_CASES, KillTestCase } from "@/lib/fixtures/killTestCases";
import { LogoIcon } from "@/components/Logo";
import { GithubUser } from "@/components/GithubAuthModal";

interface HeaderProps {
  project: Project | null;
  activeBaseline: BaselineVersion | null;
  currentUser: GithubUser | null;
  onOpenGithubAuth: () => void;
  onSignOutGithub: () => void;
  onExport: () => void;
  onResetPrompt: () => void;
  onNewProjectPrompt: () => void;
  onSelectTestScenario?: (scenario: KillTestCase) => void;
  onLoadDemoPrompt: () => void;
}

export function Header({
  project,
  activeBaseline,
  currentUser,
  onOpenGithubAuth,
  onSignOutGithub,
  onExport,
  onResetPrompt,
  onNewProjectPrompt,
  onSelectTestScenario,
  onLoadDemoPrompt,
}: HeaderProps) {
  const [isScenariosOpen, setIsScenariosOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const totalBaselineItems = activeBaseline?.items.length || 0;
  const creepCount =
    project?.decisions.filter((d) => d.status === "POSSIBLE_CHANGE").length || 0;

  return (
    <header className="sticky top-3 z-30 px-4 sm:px-6 py-1 pointer-events-none transition-all">
      <div className="max-w-7xl mx-auto floating-header rounded-full px-5 py-2.5 flex items-center justify-between pointer-events-auto border border-slate-200/90 shadow-soft">
        {/* Brand & Wordmark */}
        <div className="flex items-center gap-3">
          <LogoIcon size={30} />
          <div className="flex items-center gap-2">
            <span className="text-sm font-extrabold text-slate-950 tracking-tight">
              ScopeLock
            </span>
            {project && (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-xs text-slate-700 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-brand"></span>
                {project.name}
              </span>
            )}
          </div>
        </div>

        {/* Center Indicators / Badges */}
        {project && activeBaseline ? (
          <div className="hidden md:flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium">
              <Lock className="w-3 h-3 text-emerald-600" />
              <span className="font-bold text-emerald-950">{activeBaseline.versionNumber}</span>
              <span className="text-emerald-700">Locked ({totalBaselineItems} deliverables)</span>
            </div>

            {creepCount > 0 && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-800 text-xs font-medium">
                <ShieldAlert className="w-3 h-3 text-orange-600" />
                <span>{creepCount} scope creep flagged</span>
              </div>
            )}
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-xs text-slate-600 font-medium">
            <span>Deterministic Scope Protection</span>
          </div>
        )}

        {/* Right Actions: Test Scenarios, Auth, Project Controls */}
        <div className="flex items-center gap-2">
          {/* Test Scenarios Dropdown (Crisp, high-contrast, fully opaque) */}
          {project && activeBaseline && onSelectTestScenario && (
            <div className="relative">
              <button
                onClick={() => setIsScenariosOpen(!isScenariosOpen)}
                className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-xs text-slate-800 font-bold transition-all hover:scale-102 border border-slate-200"
              >
                <Sparkles className="w-3.5 h-3.5 text-brand" />
                <span className="hidden sm:inline">Test Scenarios</span>
                <span className="sm:hidden">Tests</span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {isScenariosOpen && (
                <div
                  className="fixed sm:absolute left-4 right-4 sm:left-auto sm:right-0 top-16 sm:top-full mt-2 w-auto sm:w-96 max-w-sm max-h-[80vh] overflow-y-auto bg-white border border-slate-200 rounded-2xl shadow-floating p-2 z-50 animate-in fade-in zoom-in-95"
                  onMouseLeave={() => setIsScenariosOpen(false)}
                >
                  <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 mb-1 flex items-center justify-between">
                    <span>12 Synthetic Kill-Test Cases</span>
                    <span className="text-[10px] text-slate-400 font-normal">Click to evaluate</span>
                  </div>
                  <div className="space-y-1">
                    {KILL_TEST_CASES.map((tc) => (
                      <button
                        key={tc.id}
                        onClick={() => {
                          onSelectTestScenario(tc);
                          setIsScenariosOpen(false);
                        }}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 transition-colors text-xs space-y-1 group border border-transparent hover:border-slate-100"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 group-hover:text-brand transition-colors text-xs">
                            Case #{tc.id}: {tc.description.slice(0, 30)}...
                          </span>
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                              tc.expectedStatus === "IN_SCOPE"
                                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                                : tc.expectedStatus === "POSSIBLE_CHANGE"
                                ? "bg-orange-50 border-orange-200 text-orange-700"
                                : "bg-amber-50 border-amber-200 text-amber-700"
                            }`}
                          >
                            {tc.expectedStatus}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 line-clamp-1 italic font-sans">
                          &ldquo;{tc.request}&rdquo;
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* GitHub Auth Pill */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs text-slate-800 font-bold transition-all"
              >
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.username}
                  className="w-6 h-6 rounded-full bg-slate-200"
                />
                <span className="hidden sm:inline">@{currentUser.username}</span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {isUserMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-2xl shadow-floating p-2 z-50 animate-in fade-in zoom-in-95"
                  onMouseLeave={() => setIsUserMenuOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-slate-100 text-xs">
                    <p className="font-bold text-slate-900">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      onSignOutGithub();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-rose-50 text-rose-600 font-semibold text-xs flex items-center gap-2 mt-1 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenGithubAuth}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all hover:scale-102 shadow-sm"
              title="Sign in with GitHub"
            >
              <Github className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign in</span>
            </button>
          )}

          {/* Project Actions */}
          {project ? (
            <>
              <button
                onClick={onExport}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs text-slate-800 font-semibold transition-all"
                title="Download project JSON"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Export</span>
              </button>

              <button
                onClick={onResetPrompt}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-semibold transition-all"
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
                className="hidden sm:inline-flex px-4 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs text-slate-800 font-bold transition-all"
              >
                Load Demo
              </button>
              <button
                onClick={onNewProjectPrompt}
                className="px-4 sm:px-5 py-1.5 rounded-full bg-slate-950 text-white hover:bg-slate-800 text-xs font-extrabold shadow-sm transition-all hover:scale-102"
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
