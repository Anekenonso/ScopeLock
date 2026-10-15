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
  Search,
  X,
  ShieldCheck,
} from "lucide-react";
import { ScopeItem, BaselineVersion } from "@/types";

interface BaselinePanelProps {
  activeBaseline: BaselineVersion | null;
  baselines: BaselineVersion[];
  draftItems: ScopeItem[];
  isDraftMode: boolean;
  highlightedItemIds?: string[];
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
  highlightedItemIds = [],
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
  const [searchQuery, setSearchQuery] = useState("");

  const displayedBaseline =
    baselines.find((b) => b.id === selectedBaselineId) || activeBaseline;

  const rawItems = isDraftMode
    ? draftItems
    : displayedBaseline?.items || [];

  const filteredItems = rawItems.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      {/* Panel Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 space-y-3 bg-slate-50/50 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isDraftMode
                  ? "bg-amber-100 text-amber-700"
                  : "bg-emerald-100 text-emerald-700"
              }`}
            >
              {isDraftMode ? (
                <Unlock className="w-4 h-4" />
              ) : (
                <Lock className="w-4 h-4" />
              )}
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">
                Scope Anchor
              </span>
              <h2 className="text-sm font-extrabold text-slate-950 tracking-tight">
                {isDraftMode
                  ? `Drafting Baseline (v${baselines.length + 1}.0)`
                  : displayedBaseline
                  ? `Approved Baseline ${displayedBaseline.versionNumber}`
                  : "No Baseline"}
              </h2>
            </div>
          </div>

          {/* Version Switcher */}
          {!isDraftMode && baselines.length > 1 && (
            <div className="flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={displayedBaseline?.id || ""}
                onChange={(e) => {
                  setSelectedBaselineId(e.target.value);
                  onSelectVersion(e.target.value);
                }}
                className="bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-full px-3 py-1 focus:outline-none focus:border-brand"
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

        {/* Clean Pill Search Bar */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${rawItems.length} baseline deliverables...`}
            className="w-full pl-9 pr-8 py-1.5 rounded-full bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Items List */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 bg-slate-50/20">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 px-4 border border-dashed border-slate-200 rounded-2xl bg-white">
            <p className="text-xs text-slate-500">
              {rawItems.length === 0
                ? "No deliverables in this baseline."
                : "No deliverables match your search."}
            </p>
            {isDraftMode && rawItems.length === 0 && (
              <button
                onClick={onAddDraftItem}
                className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-xs text-slate-900 font-bold transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add First Deliverable</span>
              </button>
            )}
          </div>
        ) : (
          filteredItems.map((item, index) => {
            const isHighlighted = highlightedItemIds.includes(item.id);

            return (
              <div
                key={item.id}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 ${
                  isHighlighted
                    ? "bg-sky-50/80 border-sky-400 shadow-sm ring-2 ring-sky-200"
                    : isDraftMode
                    ? "bg-white border-slate-200 hover:border-slate-300 shadow-sm"
                    : "bg-white border-slate-200/80 hover:border-slate-300 shadow-sm hover:shadow-md"
                }`}
              >
                {/* Item header with Contribo-style pill badges */}
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2 flex-1 flex-wrap">
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold border border-slate-200">
                      #{index + 1}
                    </span>

                    {isDraftMode ? (
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) =>
                          onSaveDraftItem({ ...item, title: e.target.value })
                        }
                        placeholder="Deliverable title..."
                        className="w-full bg-transparent border-b border-slate-200 hover:border-brand focus:border-brand text-xs font-bold text-slate-950 px-1 py-0.5 focus:outline-none transition-colors mt-1"
                      />
                    ) : (
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-extrabold text-slate-950 tracking-tight">
                          {item.title}
                        </span>
                        {isHighlighted ? (
                          <span className="text-[10px] font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full border border-sky-200">
                            ✓ Matched Deliverable
                          </span>
                        ) : (
                          <span className="text-[9px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                            Locked
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {isDraftMode && (
                    <button
                      onClick={() => onDeleteDraftItem(item.id)}
                      className="text-slate-400 hover:text-rose-600 p-1.5 rounded-full transition-colors"
                      title="Remove deliverable"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Description */}
                {isDraftMode ? (
                  <textarea
                    rows={2}
                    value={item.description}
                    onChange={(e) =>
                      onSaveDraftItem({ ...item, description: e.target.value })
                    }
                    placeholder="Deliverable scope, bounds, and acceptance criteria..."
                    className="w-full text-xs text-slate-700 bg-slate-50 rounded-xl p-2.5 border border-slate-200 focus:outline-none focus:border-brand transition-colors leading-relaxed"
                  />
                ) : (
                  <p className="text-xs text-slate-600 leading-relaxed font-sans">
                    {item.description || (
                      <span className="text-slate-400 italic">No description provided</span>
                    )}
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer Pill Action */}
      <div className="p-3.5 sm:p-4 border-t border-slate-100 bg-white flex-shrink-0">
        {isDraftMode ? (
          <div className="space-y-2">
            <button
              onClick={onAddDraftItem}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-xs text-slate-900 font-bold transition-all"
            >
              <Plus className="w-3.5 h-3.5 text-slate-700" />
              <span>Add Deliverable</span>
            </button>

            <button
              onClick={() => onApproveBaseline(draftItems)}
              disabled={draftItems.length === 0}
              className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-extrabold text-xs shadow-sm transition-all hover:scale-101"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                Lock Baseline v{baselines.length + 1}.0
              </span>
            </button>
          </div>
        ) : (
          <button
            onClick={onStartEditingDraft}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-xs text-slate-800 font-bold transition-all hover:scale-101 border border-slate-200"
          >
            <FileEdit className="w-3.5 h-3.5 text-slate-600" />
            <span>Draft Revision (v{baselines.length + 1}.0)</span>
          </button>
        )}
      </div>
    </div>
  );
}
