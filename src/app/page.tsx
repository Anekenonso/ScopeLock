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
import { ToastContainer, ToastMessage } from "@/components/Toast";
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
  Zap,
  Lock,
  ArrowRight,
  ShieldAlert,
  MessageSquare,
} from "lucide-react";

export default function WorkspacePage() {
  const [project, setProject] = useState<Project | null>(null);
  const [isCorrupted, setIsCorrupted] = useState(false);
  const [isBriefModalOpen, setIsBriefModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
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

  // Load project on mount
  useEffect(() => {
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
  }, []);

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

  return (
    <div className="flex flex-col min-h-screen relative overflow-x-hidden">
      {/* Background Organic Floating Blobs (Contribo-inspired) */}
      <div className="fixed top-12 left-8 w-80 h-80 rounded-full bg-blob-sky pointer-events-none blur-2xl animate-floatBlob"></div>
      <div className="fixed top-36 right-12 w-72 h-72 rounded-full bg-blob-terracotta pointer-events-none blur-2xl animate-floatBlob" style={{ animationDelay: "-4s" }}></div>
      <div className="fixed bottom-12 left-1/3 w-96 h-96 rounded-full bg-blob-lavender pointer-events-none blur-3xl animate-floatBlob" style={{ animationDelay: "-8s" }}></div>

      <Header
        project={project}
        activeBaseline={activeBaseline}
        onExport={handleExportJson}
        onResetPrompt={() => setIsResetModalOpen(true)}
        onNewProjectPrompt={() => setIsBriefModalOpen(true)}
        onSelectTestScenario={handleSelectTestScenario}
        onLoadDemoPrompt={() => {
          const demo = StorageRepository.loadDemoProject();
          setProject(demo);
          setActiveBaseline(demo.baselines[0]);
          setIsDraftMode(false);
          addToast("success", "Loaded SaaS Demo", "Acme SaaS Portal with 8 deliverables ready.");
        }}
      />

      {/* Corrupted storage notification */}
      {isCorrupted && (
        <div className="max-w-4xl mx-auto mt-4 px-6 py-2.5 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-between text-xs text-rose-300 font-mono">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400" />
            <span>Corrupted local storage detected. Reset recommended to restore clean state.</span>
          </div>
          <button
            onClick={() => setIsResetModalOpen(true)}
            className="px-3 py-1 rounded-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 transition-colors"
          >
            Reset Now
          </button>
        </div>
      )}

      {/* Main Content Area */}
      {!project ? (
        // Contribo-Inspired Hero State
        <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative z-10 max-w-5xl mx-auto w-full text-center space-y-12">
          {/* Eyebrow & Hero Title */}
          <div className="space-y-4 max-w-3xl">
            <span className="text-xs uppercase font-extrabold tracking-widest text-slate-400 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 inline-block">
              Scope protection for software teams
            </span>

            <h2 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.08]">
              Agreed scope, <br />
              <span className="bg-gradient-to-r from-sky-400 via-white to-terracotta-light bg-clip-text text-transparent">
                finally locked.
              </span>
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl mx-auto font-normal pt-2">
              Turn unstructured client briefs into versioned baseline deliverables. Compare follow-up feature requests against approved scope to catch creep instantly.
            </p>
          </div>

          {/* Hero Action Pill Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md mx-auto">
            <button
              onClick={() => setIsBriefModalOpen(true)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white text-slate-950 font-extrabold text-sm hover:bg-slate-100 shadow-soft transition-all hover:scale-103 active:scale-98 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Initialize from Brief</span>
            </button>

            <button
              onClick={() => {
                const demo = StorageRepository.loadDemoProject();
                setProject(demo);
                setActiveBaseline(demo.baselines[0]);
                setIsDraftMode(false);
                addToast("success", "Loaded SaaS Demo", "Acme SaaS Portal loaded with 8 deliverables.");
              }}
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-sm transition-all hover:scale-103 active:scale-98 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-brand" />
              <span>Try Live Demo</span>
            </button>
          </div>

          {/* Contribo-Style 3 Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left w-full pt-4">
            {/* Card 1: Sky Tint */}
            <div className="p-6 rounded-3xl bg-brand/5 border border-brand/20 space-y-4 hover:border-brand/40 transition-all hover:-translate-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-brand block">
                Deliverables
              </span>
              <h3 className="text-xl font-extrabold text-white tracking-tight">
                Scope Anchor
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Parse client emails into numbered deliverable cards. Lock baseline versions so expectations never shift silently.
              </p>
              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-semibold text-slate-200">
                  <Lock className="w-3 h-3 text-emerald-400" />
                  <span>Versioned v1.0, v2.0</span>
                </span>
              </div>
            </div>

            {/* Card 2: Terracotta Tint */}
            <div className="p-6 rounded-3xl bg-terracotta/5 border border-terracotta/20 space-y-4 hover:border-terracotta/40 transition-all hover:-translate-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-terracotta block">
                Creep Radar
              </span>
              <h3 className="text-xl font-extrabold text-white tracking-tight">
                Comparison Engine
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Deterministic token and concept overlap detects novel vendors (Twilio), platforms (Mobile), and third-party APIs without hallucination.
              </p>
              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-semibold text-slate-200">
                  <ShieldAlert className="w-3 h-3 text-terracotta" />
                  <span>Zero Hallucination</span>
                </span>
              </div>
            </div>

            {/* Card 3: Lavender Tint */}
            <div className="p-6 rounded-3xl bg-lavender/5 border border-lavender/20 space-y-4 hover:border-lavender/40 transition-all hover:-translate-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-lavender block">
                Human Authority
              </span>
              <h3 className="text-xl font-extrabold text-white tracking-tight">
                Audit & Diplomacy
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Accept, reject, or clarify with full audit records. 1-click generate diplomatic, professional client replies ready for Slack.
              </p>
              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-semibold text-slate-200">
                  <MessageSquare className="w-3 h-3 text-lavender" />
                  <span>Client Reply Drafter</span>
                </span>
              </div>
            </div>
          </div>
        </main>
      ) : (
        // Split-View Workspace
        <main className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden h-[calc(100vh-68px)] relative z-10 mt-2">
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
          <section className="md:col-span-7 h-full overflow-y-auto p-5 space-y-5 bg-ink/40">
            {/* 1. Request Input */}
            <RequestInput
              onCompare={handleCompareRequest}
              disabled={!activeBaseline || isDraftMode}
            />

            {/* In Draft Mode Warning */}
            {isDraftMode && (
              <div className="p-4 rounded-2xl bg-terracotta-soft border border-terracotta/30 text-terracotta-light text-xs flex items-center gap-2.5 font-medium">
                <AlertCircle className="w-4 h-4 text-terracotta flex-shrink-0" />
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
