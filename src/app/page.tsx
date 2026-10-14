"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { BaselinePanel } from "@/components/BaselinePanel";
import { RequestInput } from "@/components/RequestInput";
import { ComparisonCard } from "@/components/ComparisonCard";
import { HistoryFeed } from "@/components/HistoryFeed";
import { BriefIngestModal } from "@/components/BriefIngestModal";
import { ResetConfirmModal } from "@/components/ResetConfirmModal";
import { StorageRepository } from "@/lib/storage/repository";
import { parseBriefIntoScopeItems } from "@/lib/parser/briefParser";
import { createComparator } from "@/lib/comparator";
import {
  Project,
  ScopeItem,
  BaselineVersion,
  ComparisonResult,
  DecisionAction,
  DecisionRecord,
} from "@/types";
import { PlusCircle, Sparkles, AlertCircle } from "lucide-react";

export default function WorkspacePage() {
  const [project, setProject] = useState<Project | null>(null);
  const [isCorrupted, setIsCorrupted] = useState(false);
  const [isBriefModalOpen, setIsBriefModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isDraftMode, setIsDraftMode] = useState(false);
  const [draftItems, setDraftItems] = useState<ScopeItem[]>([]);
  const [activeBaseline, setActiveBaseline] = useState<BaselineVersion | null>(null);

  // Comparison State
  const [currentRequestText, setCurrentRequestText] = useState<string>("");
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);

  // Load project on mount
  useEffect(() => {
    const { project: loaded, isCorrupted: corrupted } = StorageRepository.getProject();
    if (corrupted) {
      setIsCorrupted(true);
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
  };

  const handleStartEditingDraft = () => {
    if (!project || !activeBaseline) return;
    const copied: ScopeItem[] = activeBaseline.items.map((item, idx) => ({
      ...item,
      id: `draft-item-${idx + 1}-${Date.now()}`,
    }));
    setDraftItems(copied);
    setIsDraftMode(true);
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
  };

  const handleAddDraftItem = () => {
    const newItem: ScopeItem = {
      id: `draft-item-${draftItems.length + 1}-${Date.now()}`,
      title: "New Scope Item",
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
  };

  return (
    <div className="flex flex-col min-h-screen bg-canvas">
      <Header
        project={project}
        activeBaseline={activeBaseline}
        onExport={handleExportJson}
        onResetPrompt={() => setIsResetModalOpen(true)}
      />

      {/* Corrupted storage notification */}
      {isCorrupted && (
        <div className="bg-rose-500/10 border-b border-rose-500/20 px-6 py-2.5 flex items-center justify-between text-xs text-rose-300 font-mono">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400" />
            <span>Corrupted local storage detected. Reset recommended to restore clean state.</span>
          </div>
          <button
            onClick={() => setIsResetModalOpen(true)}
            className="px-2.5 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 transition-colors"
          >
            Reset Now
          </button>
        </div>
      )}

      {/* Main Content Area */}
      {!project ? (
        // Empty State
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center space-y-5 p-8 rounded-2xl bg-surface border border-surface-border shadow-2xl backdrop-blur-xl">
            <div className="w-12 h-12 rounded-xl bg-brand/10 border border-brand/30 flex items-center justify-center text-brand mx-auto shadow-lg shadow-brand/10">
              <PlusCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                No Project Loaded
              </h2>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Start by creating a workspace from a client brief, or load our realistic SaaS demo to explore the comparison engine immediately.
              </p>
            </div>
            <div className="space-y-2.5 pt-2">
              <button
                onClick={() => setIsBriefModalOpen(true)}
                className="w-full py-2.5 px-4 rounded-lg bg-brand hover:bg-sky-400 text-slate-950 font-semibold text-xs shadow-lg shadow-brand/20 transition-all flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create New Project</span>
              </button>
              <button
                onClick={() => {
                  const demo = StorageRepository.loadDemoProject();
                  setProject(demo);
                  setActiveBaseline(demo.baselines[0]);
                  setIsDraftMode(false);
                }}
                className="w-full py-2 px-4 rounded-lg bg-surface-elevated hover:bg-slate-700/60 border border-surface-border text-slate-300 font-medium text-xs transition-colors flex items-center justify-center gap-2 font-mono"
              >
                <Sparkles className="w-3.5 h-3.5 text-brand" />
                <span>Load Sample SaaS Demo</span>
              </button>
            </div>
          </div>
        </main>
      ) : (
        // Split-View Workspace
        <main className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden h-[calc(100vh-61px)]">
          {/* Left Panel: Scope Anchor */}
          <section className="md:col-span-5 h-full overflow-hidden">
            <BaselinePanel
              activeBaseline={activeBaseline}
              baselines={project.baselines}
              draftItems={draftItems}
              isDraftMode={isDraftMode}
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
          <section className="md:col-span-7 h-full overflow-y-auto p-6 space-y-5 bg-canvas/40">
            {/* 1. Request Input */}
            <RequestInput
              onCompare={handleCompareRequest}
              disabled={!activeBaseline || isDraftMode}
            />

            {/* In Draft Mode Warning */}
            {isDraftMode && (
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-2 font-mono">
                <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>
                  Baseline is in draft mode. Click &ldquo;Approve Baseline&rdquo; on the left to activate request comparison.
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
    </div>
  );
}
