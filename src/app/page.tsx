"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { BaselinePanel } from "@/components/BaselinePanel";
import { RequestInput } from "@/components/RequestInput";
import { ComparisonCard } from "@/components/ComparisonCard";
import { HistoryFeed } from "@/components/HistoryFeed";
import { BriefIngestModal } from "@/components/BriefIngestModal";
import { ResetConfirmModal } from "@/components/ResetConfirmModal";
import { ClientResponseModal } from "@/components/ClientResponseModal";
import { GithubAuthModal, GithubUser } from "@/components/GithubAuthModal";
import { ToastContainer, ToastMessage } from "@/components/Toast";
import { Footer } from "@/components/Footer";
import { StorageRepository } from "@/lib/storage/repository";
import { parseBriefIntoScopeItems } from "@/lib/parser/briefParser";
import { createComparator } from "@/lib/comparator";
import { KillTestCase } from "@/lib/fixtures/killTestCases";
import {
  Project,
  ScopeItem,
  BaselineVersion,
  ComparisonResult,
  DecisionAction,
  DecisionRecord,
} from "@/types";
import {
  Plus,
  Sparkles,
  AlertCircle,
  ShieldCheck,
  Lock,
  ShieldAlert,
  MessageSquare,
} from "lucide-react";

export default function WorkspacePage() {
  const [project, setProject] = useState<Project | null>(null);
  const [isCorrupted, setIsCorrupted] = useState(false);
  const [isBriefModalOpen, setIsBriefModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isGithubModalOpen, setIsGithubModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<GithubUser | null>(null);
  const [pendingAction, setPendingAction] = useState<"brief" | "demo" | null>(null);
  const [authTriggerReason, setAuthTriggerReason] = useState<string>("");

  const [isDraftMode, setIsDraftMode] = useState(false);
  const [draftItems, setDraftItems] = useState<ScopeItem[]>([]);
  const [activeBaseline, setActiveBaseline] = useState<BaselineVersion | null>(null);

  // Comparison State
  const [currentRequestText, setCurrentRequestText] = useState<string>("");
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);

  // Toast Notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: "success" | "warning" | "info", title: string, description?: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, description }]);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleLoadDemoProject = () => {
    const demo = StorageRepository.loadDemoProject();
    setProject(demo);
    setActiveBaseline(demo.baselines[0]);
    setIsDraftMode(false);
    setComparisonResult(null);
    setCurrentRequestText("");
    addToast("success", "Loaded SaaS Demo", "Acme SaaS Portal with 8 deliverables ready.");
  };

  const requireAuthFor = (action: "brief" | "demo", actionLabel: string): boolean => {
    if (!currentUser) {
      setPendingAction(action);
      setAuthTriggerReason(actionLabel);
      setIsGithubModalOpen(true);
      return false;
    }
    return true;
  };

  // Load project & user profile on mount - only restore workspace if authenticated
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("scopelock_github_user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUser(parsedUser);

        // Only mount project into active portal if authenticated session exists
        const { project: loaded, isCorrupted: corrupted } = StorageRepository.getProject();
        if (corrupted) {
          setIsCorrupted(true);
          addToast("warning", "Corrupted storage detected", "Reset is recommended to restore a clean state.");
        } else if (loaded) {
          setProject(loaded);
          const active = loaded.baselines.find((b) => b.id === loaded.activeBaselineId) || null;
          setActiveBaseline(active);
          if (loaded.baselines.length === 0) {
            setIsDraftMode(true);
            setDraftItems(loaded.draftItems || []);
          }
        }
      }
    } catch {
      // Ignored
    }
  }, []);

  const handleSignInGithub = (user: GithubUser) => {
    setCurrentUser(user);
    try {
      localStorage.setItem("scopelock_github_user", JSON.stringify(user));
    } catch {
      // Ignored
    }
    addToast("success", "Connected to GitHub", `Signed in as @${user.username}.`);

    // If there is a stored project in storage and not yet loaded into memory, restore it
    let currentProj = project;
    if (!currentProj) {
      const { project: loaded } = StorageRepository.getProject();
      if (loaded) {
        currentProj = loaded;
        setProject(loaded);
        const active = loaded.baselines.find((b) => b.id === loaded.activeBaselineId) || null;
        setActiveBaseline(active);
        if (loaded.baselines.length === 0) {
          setIsDraftMode(true);
          setDraftItems(loaded.draftItems || []);
        }
      }
    }

    // Automatically execute the action that triggered the login modal
    if (pendingAction === "brief") {
      setIsBriefModalOpen(true);
    } else if (pendingAction === "demo") {
      handleLoadDemoProject();
    }
    setPendingAction(null);
    setAuthTriggerReason("");
  };

  const handleCloseGithubModal = () => {
    setIsGithubModalOpen(false);
    setPendingAction(null);
    setAuthTriggerReason("");
  };

  const handleSignOutGithub = () => {
    // Immediately terminate session and lock the portal workspace
    setCurrentUser(null);
    setComparisonResult(null);
    setCurrentRequestText("");
    setIsClientModalOpen(false);
    setIsBriefModalOpen(false);
    try {
      localStorage.removeItem("scopelock_github_user");
    } catch {
      // Ignored
    }
    addToast("info", "Signed Out & Workspace Locked", "Session terminated. Workspace has been secured.");
  };

  const handleCreateProjectWithBrief = (name: string, rawBrief: string) => {
    let proj = StorageRepository.createProject(name);
    const parsed = parseBriefIntoScopeItems(rawBrief);
    proj = StorageRepository.saveDraftItems(proj, parsed);

    setProject(proj);
    setDraftItems(parsed);
    setIsDraftMode(true);
    setActiveBaseline(null);
    setIsBriefModalOpen(false);
    setComparisonResult(null);
    addToast("success", "Project initialized", `Extracted ${parsed.length} deliverables into draft.`);
  };

  const handleApproveBaseline = (items: ScopeItem[]) => {
    if (!project) return;
    const source = items.map((i) => `- ${i.title}: ${i.description}`).join("\n");
    const updated = StorageRepository.commitBaseline(project, source, items);

    setProject(updated);
    const active = updated.baselines.find((b) => b.id === updated.activeBaselineId) || null;
    setActiveBaseline(active);
    setIsDraftMode(false);
    setDraftItems([]);
    addToast("success", `Baseline ${active?.versionNumber} Locked`, `${items.length} deliverables locked as scope anchor.`);
  };

  const handleStartEditingDraft = () => {
    if (!project || !activeBaseline) return;
    const copied: ScopeItem[] = activeBaseline.items.map((item, idx) => ({
      ...item,
      id: `draft-item-${idx + 1}-${Date.now()}`,
    }));
    setDraftItems(copied);
    setIsDraftMode(true);
    addToast("info", "Draft Mode Activated", `Editing draft for baseline revision v${project.baselines.length + 1}.0.`);
  };

  const handleSaveDraftItem = (updatedItem: ScopeItem) => {
    const next = draftItems.map((i) => (i.id === updatedItem.id ? updatedItem : i));
    setDraftItems(next);
    if (project) {
      StorageRepository.saveDraftItems(project, next);
    }
  };

  const handleDeleteDraftItem = (id: string) => {
    const next = draftItems.filter((i) => i.id !== id);
    setDraftItems(next);
    if (project) {
      StorageRepository.saveDraftItems(project, next);
    }
    addToast("info", "Deliverable removed", "Draft baseline item deleted.");
  };

  const handleAddDraftItem = () => {
    const newItem: ScopeItem = {
      id: `draft-item-${draftItems.length + 1}-${Date.now()}`,
      title: "New Deliverable",
      description: "",
      userConfirmed: true,
    };
    const next = [...draftItems, newItem];
    setDraftItems(next);
    if (project) {
      StorageRepository.saveDraftItems(project, next);
    }
  };

  // Compare request against active baseline items
  const handleCompareRequest = (requestText: string) => {
    if (!activeBaseline) return;
    const comparator = createComparator();
    const result = comparator.evaluate(requestText, activeBaseline.items);
    setCurrentRequestText(requestText);
    setComparisonResult(result);
  };

  // Handle selecting a Kill-Test scenario from the header
  const handleSelectTestScenario = (scenario: KillTestCase) => {
    if (!activeBaseline) return;
    setCurrentRequestText(scenario.request);
    const comparator = createComparator();
    const result = comparator.evaluate(scenario.request, activeBaseline.items);
    setComparisonResult(result);
    addToast("info", `Ran Test Case #${scenario.id}`, scenario.description);
  };

  // Record human decision
  const handleRecordDecision = (action: DecisionAction, note: string) => {
    if (!project || !activeBaseline || !comparisonResult) return;

    const record: DecisionRecord = {
      id: `dec-${Date.now()}`,
      requestId: `req-${Date.now()}`,
      requestText: currentRequestText,
      status: comparisonResult.status,
      matchedItemIds: comparisonResult.matchedItemIds,
      rationale: comparisonResult.rationale,
      uncertaintyWarning: comparisonResult.uncertaintyWarning,
      action,
      note: note || undefined,
      baselineVersionId: activeBaseline.id,
      baselineVersionNumber: activeBaseline.versionNumber,
      decidedAt: new Date().toISOString(),
    };

    const updated = StorageRepository.addDecision(project, record);
    setProject(updated);
    setComparisonResult(null);
    setCurrentRequestText("");
    addToast("success", "Decision Saved to Audit Log", `Recorded as ${action} against baseline ${activeBaseline.versionNumber}.`);
  };

  const handleExportJson = () => {
    if (!project) return;
    const jsonStr = StorageRepository.exportJson(project);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `scopelock-${project.name.toLowerCase().replace(/\s+/g, "-")}-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast("success", "Export Complete", "Project backup downloaded successfully.");
  };

  const handleConfirmReset = () => {
    StorageRepository.resetProject();
    setProject(null);
    setActiveBaseline(null);
    setDraftItems([]);
    setIsDraftMode(false);
    setIsCorrupted(false);
    setComparisonResult(null);
    setCurrentRequestText("");
    addToast("info", "Workspace Reset", "All local state has been cleared.");
  };

  // Only grant portal access if user has an authenticated session AND an active project
  const isWorkspaceActive = Boolean(currentUser && project);

  return (
    <div className="flex flex-col min-h-screen relative overflow-x-hidden">
      <Header
        project={isWorkspaceActive ? project : null}
        activeBaseline={isWorkspaceActive ? activeBaseline : null}
        currentUser={currentUser}
        onOpenGithubAuth={() => setIsGithubModalOpen(true)}
        onSignOutGithub={handleSignOutGithub}
        onExport={handleExportJson}
        onResetPrompt={() => setIsResetModalOpen(true)}
        onNewProjectPrompt={() => {
          if (!requireAuthFor("brief", "Get Started")) return;
          setIsBriefModalOpen(true);
        }}
        onSelectTestScenario={handleSelectTestScenario}
        onLoadDemoPrompt={() => {
          if (!requireAuthFor("demo", "Load Demo")) return;
          handleLoadDemoProject();
        }}
      />

      {/* Corrupted storage notification */}
      {isCorrupted && (
        <div className="max-w-4xl mx-auto mt-4 px-6 py-2.5 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-between text-xs text-rose-800 font-mono shadow-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>Corrupted local storage detected. Reset recommended to restore clean state.</span>
          </div>
          <button
            onClick={() => setIsResetModalOpen(true)}
            className="px-3 py-1 rounded-full bg-rose-200 hover:bg-rose-300 text-rose-900 transition-colors font-bold"
          >
            Reset Now
          </button>
        </div>
      )}

      {/* Main Content Area: Only authenticated users with active projects enter workspace */}
      {!currentUser || !project ? (
        // Contribo-Inspired Hero State with Dimmed, Elegant Colors
        <main className="flex-1 flex flex-col items-center justify-center px-6 py-14 relative z-10 max-w-6xl mx-auto w-full text-center space-y-12">
          {/* Eyebrow & Hero Title */}
          <div className="space-y-4 max-w-3xl">
            <span className="text-xs uppercase font-extrabold tracking-widest text-slate-600 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm inline-block">
              Scope protection for software teams
            </span>

            <h2 className="text-4xl sm:text-6xl font-extrabold text-slate-950 tracking-tight leading-[1.08]">
              Agreed scope, <br />
              <span className="text-brand">
                finally locked.
              </span>
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl mx-auto font-normal pt-2">
              Turn unstructured client briefs into versioned baseline deliverables. Compare follow-up feature requests against approved scope to catch creep before work expands.
            </p>
          </div>

          {/* Hero Action Pill Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full max-w-md mx-auto">
            <button
              onClick={() => {
                if (!requireAuthFor("brief", "Initialize from Brief")) return;
                setIsBriefModalOpen(true);
              }}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-slate-950 text-white font-extrabold text-sm hover:bg-slate-800 shadow-soft transition-all hover:scale-103 active:scale-98 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Initialize from Brief</span>
            </button>

            <button
              onClick={() => {
                if (!requireAuthFor("demo", "Try Live Demo")) return;
                handleLoadDemoProject();
              }}
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white hover:bg-slate-50 border border-slate-300 text-slate-900 font-bold text-sm transition-all hover:scale-103 active:scale-98 flex items-center justify-center gap-2 shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-brand" />
              <span>Try Live Demo</span>
            </button>
          </div>

          {/* Soft, Dimmed Pastel Feature Cards - Centered Elements & Text */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center w-full pt-4">
            {/* Card 1: Soft Sky Tint */}
            <div className="p-7 rounded-3xl bg-sky-50/70 border border-sky-100 space-y-4 hover:shadow-floating transition-all hover:-translate-y-1 flex flex-col justify-between items-center text-center">
              <div className="space-y-3 flex flex-col items-center text-center w-full">
                <span className="text-xs uppercase font-extrabold tracking-wider text-sky-800 block text-center">
                  DELIVERABLES
                </span>
                <h3 className="text-2xl font-extrabold text-slate-950 tracking-tight text-center">
                  Scope Anchor
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium text-center max-w-xs mx-auto">
                  Parse client emails into numbered deliverable cards. Lock baseline versions so expectations never shift silently.
                </p>
              </div>

              {/* Inner white card */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-2 mt-4 w-full flex flex-col items-center text-center">
                <div className="flex items-center justify-center gap-2 w-full">
                  <span className="font-mono text-xs font-bold text-slate-900">
                    user-auth / v1.0
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    ✓ Locked
                  </span>
                </div>
                <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500">
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 font-semibold">Policy v1</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 font-semibold">Terms frozen</span>
                </div>
              </div>
            </div>

            {/* Card 2: Soft Terracotta/Amber Tint */}
            <div className="p-7 rounded-3xl bg-amber-50/70 border border-amber-100 space-y-4 hover:shadow-floating transition-all hover:-translate-y-1 flex flex-col justify-between items-center text-center">
              <div className="space-y-3 flex flex-col items-center text-center w-full">
                <span className="text-xs uppercase font-extrabold tracking-wider text-amber-900 block text-center">
                  CREEP RADAR
                </span>
                <h3 className="text-2xl font-extrabold text-slate-950 tracking-tight text-center">
                  Comparison Engine
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium text-center max-w-xs mx-auto">
                  Deterministic token and concept overlap detects novel vendors (Twilio), platforms (Mobile), and third-party APIs without hallucination.
                </p>
              </div>

              {/* Inner white card */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-2 mt-4 w-full flex flex-col items-center text-center">
                <div className="flex items-center justify-center gap-2 w-full">
                  <span className="font-mono text-xs font-bold text-amber-950">
                    Twilio SMS Receipts
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800">
                    ⚠️ Change Order
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 text-center">
                  Novel vendor detected: Telephony / SMS outside v1.0 bounds
                </p>
              </div>
            </div>

            {/* Card 3: Soft Lavender Tint */}
            <div className="p-7 rounded-3xl bg-purple-50/70 border border-purple-100 space-y-4 hover:shadow-floating transition-all hover:-translate-y-1 flex flex-col justify-between items-center text-center">
              <div className="space-y-3 flex flex-col items-center text-center w-full">
                <span className="text-xs uppercase font-extrabold tracking-wider text-purple-900 block text-center">
                  HUMAN AUTHORITY
                </span>
                <h3 className="text-2xl font-extrabold text-slate-950 tracking-tight text-center">
                  Audit & Diplomacy
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium text-center max-w-xs mx-auto">
                  Accept, reject, or clarify with full audit records. 1-click generate diplomatic, professional client replies ready for Slack.
                </p>
              </div>

              {/* Inner white card */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-2 mt-4 w-full flex flex-col items-center text-center">
                <div className="flex items-center justify-center gap-2 w-full">
                  <span className="font-mono text-xs font-bold text-slate-900">
                    Client Reply Drafter
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                    1-Click Copy
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 text-center">
                  Polite Change Order proposal & Phase 2 deferral templates
                </p>
              </div>
            </div>
          </div>
        </main>
      ) : (
        // Split-View Workspace
        <main className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden h-[calc(100vh-68px)] relative z-10 mt-2 bg-slate-50/50">
          {/* Left Panel: Scope Anchor */}
          <section className="md:col-span-5 h-full overflow-hidden">
            <BaselinePanel
              activeBaseline={activeBaseline}
              baselines={project.baselines}
              draftItems={draftItems}
              isDraftMode={isDraftMode}
              highlightedItemIds={comparisonResult?.matchedItemIds || []}
              onSaveDraftItem={handleSaveDraftItem}
              onDeleteDraftItem={handleDeleteDraftItem}
              onAddDraftItem={handleAddDraftItem}
              onApproveBaseline={handleApproveBaseline}
              onStartEditingDraft={handleStartEditingDraft}
              onSelectVersion={(id) => {
                const b = project.baselines.find((item) => item.id === id) || null;
                setActiveBaseline(b);
              }}
            />
          </section>

          {/* Right Panel: Request Evaluation & Decision Audit */}
          <section className="md:col-span-7 h-full overflow-y-auto p-6 space-y-6 bg-slate-100/50">
            {/* 1. Request Input */}
            <RequestInput
              onCompare={handleCompareRequest}
              disabled={!activeBaseline || isDraftMode}
            />

            {/* In Draft Mode Warning */}
            {isDraftMode && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2.5 font-bold shadow-sm">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>
                  Baseline is in draft mode. Click &ldquo;Lock Baseline&rdquo; on the left to activate the comparison engine.
                </span>
              </div>
            )}

            {/* 2. Comparison Result Card */}
            {comparisonResult && activeBaseline && (
              <ComparisonCard
                requestText={currentRequestText}
                result={comparisonResult}
                baselineItems={activeBaseline.items}
                onRecordDecision={handleRecordDecision}
                onClear={() => {
                  setComparisonResult(null);
                  setCurrentRequestText("");
                }}
                onOpenClientReplyModal={() => setIsClientModalOpen(true)}
              />
            )}

            {/* 3. Decision Audit History Feed */}
            <HistoryFeed decisions={project.decisions} />
          </section>
        </main>
      )}

      {/* Footer */}
      {!isWorkspaceActive && <Footer />}

      {/* Modals */}
      <BriefIngestModal
        isOpen={isBriefModalOpen}
        onClose={() => setIsBriefModalOpen(false)}
        onSubmit={handleCreateProjectWithBrief}
      />

      <ResetConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirmReset={handleConfirmReset}
      />

      <GithubAuthModal
        isOpen={isGithubModalOpen}
        onClose={handleCloseGithubModal}
        onSuccess={handleSignInGithub}
        actionReason={authTriggerReason}
      />

      {comparisonResult && activeBaseline && (
        <ClientResponseModal
          isOpen={isClientModalOpen}
          onClose={() => setIsClientModalOpen(false)}
          requestText={currentRequestText}
          result={comparisonResult}
          baseline={activeBaseline}
          onCopied={() => {
            addToast("success", "Copied to Clipboard", "Diplomatic client reply copied. Ready to send.");
            setIsClientModalOpen(false);
          }}
        />
      )}

      {/* Interactive Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
