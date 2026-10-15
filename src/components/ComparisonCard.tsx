"use client";

import React, { useState } from "react";
import {
  Check,
  X,
  MessageSquare,
  HelpCircle,
  Mail,
  ShieldAlert,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { ComparisonResult, DecisionAction, ScopeItem } from "@/types";

interface ComparisonCardProps {
  requestText: string;
  result: ComparisonResult;
  baselineItems: ScopeItem[];
  onRecordDecision: (action: DecisionAction, note: string) => void;
  onClear: () => void;
  onOpenClientReplyModal: () => void;
}

const PRESET_NOTES: Record<DecisionAction, string[]> = {
  ACCEPT: [
    "Approved within existing project baseline.",
    "Accepted as zero-cost minor clarification.",
    "Included in current milestone release.",
  ],
  REJECT: [
    "Logged as Change Order #1 (requires separate estimate).",
    "Deferred to Phase 2 launch backlog.",
    "Out of project scope and agreed budget.",
  ],
  CLARIFY: [
    "Awaiting client specification on exact user flow.",
    "Requested API documentation and credentials.",
    "Need confirmation on third-party service fees.",
  ],
};

export function ComparisonCard({
  requestText,
  result,
  baselineItems,
  onRecordDecision,
  onClear,
  onOpenClientReplyModal,
}: ComparisonCardProps) {
  const [developerNote, setDeveloperNote] = useState("");
  const [selectedAction, setSelectedAction] = useState<DecisionAction | null>(null);

  const matchedItems = baselineItems.filter((item) =>
    result.matchedItemIds.includes(item.id)
  );

  const handleActionClick = (action: DecisionAction) => {
    setSelectedAction(action);
    if (!developerNote && PRESET_NOTES[action]?.[0]) {
      setDeveloperNote(PRESET_NOTES[action][0]);
    }
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
          icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />,
          title: "IN_SCOPE",
          badgeClass: "bg-emerald-50 border-emerald-200 text-emerald-800",
          cardBorder: "border-emerald-200",
          headline: "Aligned with Approved Baseline",
          description: "This request matches verified scope deliverables in the locked baseline.",
        };
      case "POSSIBLE_CHANGE":
        return {
          icon: <ShieldAlert className="w-4 h-4 text-orange-600" />,
          title: "POSSIBLE_CHANGE",
          badgeClass: "bg-orange-50 border-orange-200 text-orange-800",
          cardBorder: "border-orange-200",
          headline: "Scope Creep Detected",
          description: "Introduces external capabilities, vendors, or platforms not in the baseline.",
        };
      case "NEEDS_REVIEW":
        return {
          icon: <HelpCircle className="w-4 h-4 text-amber-600" />,
          title: "NEEDS_REVIEW",
          badgeClass: "bg-amber-50 border-amber-200 text-amber-800",
          cardBorder: "border-amber-200",
          headline: "Ambiguous Evidence — Review Needed",
          description: "Evidence is subjective or incomplete. Human developer clarification needed.",
        };
    }
  };

  const statusConfig = getStatusDisplay();

  return (
    <div
      className={`rounded-3xl bg-white border ${statusConfig.cardBorder} p-4 sm:p-6 shadow-floating space-y-4 animate-in fade-in slide-in-from-top-3 duration-200`}
    >
      {/* Top Status Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
        <div className="flex items-start sm:items-center gap-3">
          <div
            className={`px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full border text-xs font-extrabold flex items-center gap-1.5 sm:gap-2 flex-shrink-0 ${statusConfig.badgeClass}`}
          >
            {statusConfig.icon}
            <span>{statusConfig.title}</span>
          </div>

          <div>
            <h3 className="text-sm font-extrabold text-slate-950 tracking-tight">
              {statusConfig.headline}
            </h3>
            <p className="text-xs text-slate-500">
              {statusConfig.description}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
          {/* Client response generator button */}
          <button
            onClick={onOpenClientReplyModal}
            className="flex items-center justify-center gap-1.5 flex-1 sm:flex-initial px-4 py-2 sm:py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-900 text-xs font-bold transition-all hover:scale-102"
            title="Draft an email/message to the client"
          >
            <Mail className="w-3.5 h-3.5 text-brand" />
            <span>Draft Client Reply</span>
          </button>

          <button
            onClick={onClear}
            className="text-xs text-slate-400 hover:text-slate-700 p-2 sm:p-1.5 transition-colors rounded-full"
            title="Dismiss evaluation"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Evaluated Request */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
          Evaluated Request:
        </span>
        <p className="text-sm text-slate-900 italic font-sans leading-relaxed">
          &ldquo;{requestText}&rdquo;
        </p>
      </div>

      {/* Matched Scope Items */}
      <div>
        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-2">
          Matched Scope Deliverables:
        </span>
        {matchedItems.length > 0 ? (
          <div className="flex items-center gap-2 flex-wrap">
            {matchedItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs text-slate-800 font-bold"
              >
                <span className="text-brand font-bold text-[11px]">
                  #{item.id.replace("item-", "")}
                </span>
                <span>{item.title}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 inline-block">
            No matching deliverables in the approved baseline.
          </p>
        )}
      </div>

      {/* Plain-Language Rationale */}
      <div className="space-y-1">
        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
          Deterministic Evidence & Rationale:
        </span>
        <div className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
          {result.rationale}
        </div>
      </div>

      {/* Uncertainty Disclosure if any */}
      {result.uncertaintyWarning && (
        <div className="px-4 py-2.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
          <HelpCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <span className="leading-relaxed">{result.uncertaintyWarning}</span>
        </div>
      )}

      {/* Decision Action Bar */}
      <div className="pt-3 border-t border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase font-extrabold text-slate-900 tracking-wider">
            Record Human Decision:
          </span>
          <span className="text-xs text-slate-500 font-medium">
            Developer retains 100% final authority
          </span>
        </div>

        {/* 3 tactile pill decision buttons */}
        <div className="grid grid-cols-3 gap-2.5">
          <button
            type="button"
            onClick={() => handleActionClick("ACCEPT")}
            className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-full border text-xs font-extrabold transition-all ${
              selectedAction === "ACCEPT"
                ? "bg-emerald-600 text-white border-emerald-600 shadow-sm scale-102"
                : "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200"
            }`}
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>Accept</span>
          </button>

          <button
            type="button"
            onClick={() => handleActionClick("REJECT")}
            className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-full border text-xs font-extrabold transition-all ${
              selectedAction === "REJECT"
                ? "bg-orange-600 text-white border-orange-600 shadow-sm scale-102"
                : "bg-orange-50 hover:bg-orange-100 text-orange-800 border-orange-200"
            }`}
          >
            <X className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Reject / Change Order</span>
            <span className="sm:hidden">Reject</span>
          </button>

          <button
            type="button"
            onClick={() => handleActionClick("CLARIFY")}
            className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-full border text-xs font-extrabold transition-all ${
              selectedAction === "CLARIFY"
                ? "bg-amber-600 text-white border-amber-600 shadow-sm scale-102"
                : "bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Clarify</span>
          </button>
        </div>

        {/* Note input, presets, and commit CTA */}
        {selectedAction && (
          <div className="space-y-3 animate-in fade-in duration-200 pt-1.5">
            {/* Preset Note Chips */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-slate-500 font-bold">
                Presets:
              </span>
              {PRESET_NOTES[selectedAction].map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setDeveloperNote(preset)}
                  className="text-xs px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 hover:text-slate-900 transition-all font-semibold"
                >
                  + {preset.slice(0, 32)}...
                </button>
              ))}
            </div>

            <input
              type="text"
              value={developerNote}
              onChange={(e) => setDeveloperNote(e.target.value)}
              placeholder={`Note explaining why you decided to ${selectedAction}...`}
              className="w-full px-4 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand focus:bg-white transition-colors"
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedAction(null)}
                className="px-4 py-2 text-xs text-slate-500 hover:text-slate-800 rounded-full font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveDecision}
                className="flex items-center gap-1.5 px-6 py-2 rounded-full bg-slate-950 hover:bg-slate-800 text-white text-xs font-extrabold transition-all shadow-sm hover:scale-102 active:scale-98"
              >
                <span>Commit to History</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
