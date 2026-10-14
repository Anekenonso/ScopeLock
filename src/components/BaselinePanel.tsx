"use client";

import React, { useState } from "react";
import {
  Lock,
  Unlock,
  Plus,
  Trash2,
  CheckCircle2,
  History,
  FileEdit,
} from "lucide-react";
import { ScopeItem, BaselineVersion } from "@/types";

interface BaselinePanelProps {
  activeBaseline: BaselineVersion | null;
  baselines: BaselineVersion[];
  draftItems: ScopeItem[];
  isDraftMode: boolean;
  onSaveDraftItem: (item: ScopeItem) => void;
  onDeleteDraftItem: (id: string) => void;
  onAddDraftItem: () => void;
  onApproveBaseline: (items: ScopeItem[]) => void;
  onStartEditingDraft: () => void;
  onSelectVersion: (baselineId: string) => void;
}

export function BaselinePanel({
  activeBaseline,
  baselines,
  draftItems,
  isDraftMode,
  onSaveDraftItem,
  onDeleteDraftItem,
  onAddDraftItem,
  onApproveBaseline,
  onStartEditingDraft,
  onSelectVersion,
}: BaselinePanelProps) {
  const [selectedBaselineId, setSelectedBaselineId] = useState<string>(
    activeBaseline?.id || ""
  );

  const displayedBaseline =
    baselines.find((b) => b.id === selectedBaselineId) || activeBaseline;

  const currentItems = isDraftMode
    ? draftItems
    : displayedBaseline?.items || [];

  return (
    <div className="flex flex-col h-full bg-surface border-r border-surface-border">
      {/* Panel Header */}
      <div className="p-4 border-b border-surface-border flex items-center justify-between bg-surface/50">
        <div className="flex items-center gap-2">
          {isDraftMode ? (
            <div className="w-6 h-6 rounded-md bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Unlock className="w-3.5 h-3.5" />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-md bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Lock className="w-3.5 h-3.5" />
            </div>
          )}
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Scope Anchor
            </span>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-white">
                {isDraftMode
                  ? "Drafting Baseline"
                  : displayedBaseline
                  ? `Baseline ${displayedBaseline.versionNumber}`
                  : "No Baseline"}
              </h2>
            </div>
          </div>
        </div>

        {/* Version Switcher if multiple versions */}
        {!isDraftMode && baselines.length > 1 && (
          <div className="flex items-center gap-1.5">
            <History className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={displayedBaseline?.id || ""}
              onChange={(e) => {
                setSelectedBaselineId(e.target.value);
                onSelectVersion(e.target.value);
              }}
              className="bg-canvas border border-surface-border text-slate-300 text-xs font-mono rounded px-2 py-1 focus:outline-none focus:border-brand"
            >
              {baselines.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.versionNumber} {b.id === activeBaseline?.id ? "(Active)" : ""}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Items Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {currentItems.length === 0 ? (
          <div className="text-center py-12 px-4 border border-dashed border-surface-border rounded-xl">
            <p className="text-sm text-slate-400">No scope items in this baseline.</p>
            {isDraftMode && (
              <button
                onClick={onAddDraftItem}
                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-elevated hover:bg-slate-700 text-xs text-brand font-mono transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add First Item</span>
              </button>
            )}
          </div>
        ) : (
          currentItems.map((item, index) => (
            <div
              key={item.id}
              className={`p-3.5 rounded-xl border transition-all ${
                isDraftMode
                  ? "bg-canvas border-surface-border hover:border-slate-600"
                  : "bg-surface-elevated/40 border-surface-border hover:border-slate-700"
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 flex-1">
                  <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-slate-800 text-brand font-semibold border border-surface-border">
                    #{index + 1}
                  </span>
                  {isDraftMode ? (
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) =>
                        onSaveDraftItem({ ...item, title: e.target.value })
                      }
                      placeholder="Item Title..."
                      className="w-full bg-transparent border-b border-transparent hover:border-slate-600 focus:border-brand text-sm font-semibold text-white px-1 py-0.5 focus:outline-none transition-colors"
                    />
                  ) : (
                    <span className="text-sm font-semibold text-slate-100">
                      {item.title}
                    </span>
                  )}
                </div>

                {isDraftMode && (
                  <button
                    onClick={() => onDeleteDraftItem(item.id)}
                    className="text-slate-500 hover:text-rose-400 p-1 rounded transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {isDraftMode ? (
                <textarea
                  rows={2}
                  value={item.description}
                  onChange={(e) =>
                    onSaveDraftItem({ ...item, description: e.target.value })
                  }
                  placeholder="Scope details and boundaries..."
                  className="w-full text-xs text-slate-300 bg-canvas/60 rounded p-2 border border-surface-border focus:outline-none focus:border-brand transition-colors"
                />
              ) : (
                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.description || (
                    <span className="text-slate-500 italic">No description provided</span>
                  )}
                </p>
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer Controls */}
      <div className="p-4 border-t border-surface-border bg-surface/50">
        {isDraftMode ? (
          <div className="space-y-2">
            <button
              onClick={onAddDraftItem}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-surface-elevated hover:bg-slate-700 border border-surface-border text-xs text-slate-300 font-medium transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-brand" />
              <span>Add Scope Item</span>
            </button>

            <button
              onClick={() => onApproveBaseline(draftItems)}
              disabled={draftItems.length === 0}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-semibold text-xs shadow-lg shadow-emerald-500/20 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                Approve Baseline {`v${baselines.length + 1}.0`}
              </span>
            </button>
          </div>
        ) : (
          <button
            onClick={onStartEditingDraft}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-surface-elevated hover:bg-slate-700 border border-surface-border text-xs text-slate-300 font-medium transition-colors"
          >
            <FileEdit className="w-3.5 h-3.5 text-brand" />
            <span>Edit Baseline (Draft v{baselines.length + 1}.0)</span>
          </button>
        )}
      </div>
    </div>
  );
}
