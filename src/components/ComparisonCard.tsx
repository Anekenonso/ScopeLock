"use client";

import React, { useState } from "react";
import {
  CheckCircle,
  AlertTriangle,
  HelpCircle,
  Check,
  X,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { ComparisonResult, DecisionAction, ScopeItem } from "@/types";

interface ComparisonCardProps {
  requestText: string;
  result: ComparisonResult;
  baselineItems: ScopeItem[];
  onRecordDecision: (action: DecisionAction, note: string) => void;
  onClear: () => void;
}

export function ComparisonCard({
  requestText,
  result,
  baselineItems,
  onRecordDecision,
  onClear,
}: ComparisonCardProps) {
  const [developerNote, setDeveloperNote] = useState("");
  const [selectedAction, setSelectedAction] = useState<DecisionAction | null>(
    null
  );

  const matchedItems = baselineItems.filter((item) =>
    result.matchedItemIds.includes(item.id)
  );

  const handleActionClick = (action: DecisionAction) => {
    setSelectedAction(action);
  };

  const handleSaveDecision = () => {
    if (!selectedAction) return;
    onRecordDecision(selectedAction, developerNote.trim());
    setSelectedAction(null);
    setDeveloperNote("");
  };

  const getStatusDisplay = () => {
    switch (result.status) {
      case "IN_SCOPE":
        return {
          icon: <CheckCircle className="w-4 h-4 text-emerald-400" />,
          title: "IN_SCOPE",
          badgeClass: "bg-emerald-500/15 border-emerald-500/40 text-emerald-400",
          cardBorder: "border-emerald-500/30",
          description: "Matches items within the approved baseline.",
        };
      case "POSSIBLE_CHANGE":
        return {
          icon: <AlertTriangle className="w-4 h-4 text-rose-400" />,
          title: "POSSIBLE_CHANGE",
          badgeClass: "bg-rose-500/15 border-rose-500/40 text-rose-400",
          cardBorder: "border-rose-500/30",
          description: "Introduces functionality or requirements not in the baseline.",
        };
      case "NEEDS_REVIEW":
        return {
          icon: <HelpCircle className="w-4 h-4 text-amber-400" />,
          title: "NEEDS_REVIEW",
          badgeClass: "bg-amber-500/15 border-amber-500/40 text-amber-400",
          cardBorder: "border-amber-500/30",
          description: "Evidence is ambiguous or requires client clarification.",
        };
    }
  };

  const statusConfig = getStatusDisplay();

  return (
    <div
      className={`rounded-xl bg-surface border ${statusConfig.cardBorder} p-5 shadow-xl space-y-4 animate-in fade-in slide-in-from-top-2 duration-200`}
    >
      {/* Top Status Header */}
      <div className="flex items-center justify-between border-b border-surface-border pb-3">
        <div className="flex items-center gap-2">
          <div
            className={`px-3 py-1 rounded-full border text-xs font-mono font-bold flex items-center gap-1.5 ${statusConfig.badgeClass}`}
          >
            {statusConfig.icon}
            <span>{statusConfig.title}</span>
          </div>
          <span className="text-xs text-slate-400">
            {statusConfig.description}
          </span>
        </div>

        <button
          onClick={onClear}
          className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
        >
          Dismiss
        </button>
      </div>

      {/* Evaluated Request */}
      <div className="bg-canvas/70 rounded-lg p-3 border border-surface-border">
        <span className="text-[11px] font-mono uppercase text-slate-500 block mb-1">
          Evaluated Request:
        </span>
        <p className="text-sm text-slate-200 italic font-sans leading-relaxed">
          &ldquo;{requestText}&rdquo;
        </p>
      </div>

      {/* Matched Scope Items */}
      <div>
        <span className="text-[11px] font-mono uppercase text-slate-400 block mb-1.5">
          Matched Scope Items:
        </span>
        {matchedItems.length > 0 ? (
          <div className="flex items-center gap-2 flex-wrap">
            {matchedItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-canvas border border-surface-border text-xs text-slate-200 font-medium"
              >
                <span className="font-mono text-brand text-[11px]">
                  #{item.id.replace("item-", "")}
                </span>
                <span>{item.title}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic">
            No matching items found in the approved baseline.
          </p>
        )}
      </div>

      {/* Plain-Language Rationale */}
      <div className="space-y-1">
        <span className="text-[11px] font-mono uppercase text-slate-400 block">
          Evidence & Rationale:
        </span>
        <p className="text-xs text-slate-200 leading-relaxed bg-surface-elevated/40 p-3 rounded-lg border border-surface-border">
          {result.rationale}
        </p>
      </div>

      {/* Uncertainty Disclosure if any */}
      {result.uncertaintyWarning && (
        <div className="px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2">
          <HelpCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <span>{result.uncertaintyWarning}</span>
        </div>
      )}

      {/* Decision Action Bar */}
      <div className="pt-2 border-t border-surface-border space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase text-slate-300 font-semibold">
            Record Your Decision:
          </span>
          <span className="text-[11px] text-slate-500">
            Developer retains full decision authority
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleActionClick("ACCEPT")}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border text-xs font-semibold transition-all ${
              selectedAction === "ACCEPT"
                ? "bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/20"
                : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
            }`}
          >
            <Check className="w-3.5 h-3.5" />
            <span>Accept</span>
          </button>

          <button
            type="button"
            onClick={() => handleActionClick("REJECT")}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border text-xs font-semibold transition-all ${
              selectedAction === "REJECT"
                ? "bg-rose-500 text-white border-rose-400 shadow-lg shadow-rose-500/20"
                : "bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/30"
            }`}
          >
            <X className="w-3.5 h-3.5" />
            <span>Reject</span>
          </button>

          <button
            type="button"
            onClick={() => handleActionClick("CLARIFY")}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border text-xs font-semibold transition-all ${
              selectedAction === "CLARIFY"
                ? "bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20"
                : "bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border-amber-500/30"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Clarify</span>
          </button>
        </div>

        {/* Note input and save trigger */}
        {selectedAction && (
          <div className="space-y-2 animate-in fade-in duration-150 pt-1">
            <input
              type="text"
              value={developerNote}
              onChange={(e) => setDeveloperNote(e.target.value)}
              placeholder={`Optional note explaining why you decided to ${selectedAction}...`}
              className="w-full px-3 py-1.5 rounded-lg bg-canvas border border-surface-border text-xs text-white focus:outline-none focus:border-brand transition-colors"
            />
            <div className="flex justify-end">
              <button
                onClick={handleSaveDecision}
                className="px-4 py-1.5 rounded-lg bg-brand hover:bg-sky-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-brand/20"
              >
                Save Decision to History
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
