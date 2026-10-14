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
          icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
          title: "IN_SCOPE",
          badgeClass: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
          cardBorder: "border-emerald-500/30",
          headline: "Aligned with Approved Baseline",
          description: "This request matches verified scope deliverables in the locked baseline.",
        };
      case "POSSIBLE_CHANGE":
        return {
          icon: <ShieldAlert className="w-4 h-4 text-terracotta" />,
          title: "POSSIBLE_CHANGE",
          badgeClass: "bg-terracotta-soft border-terracotta/30 text-terracotta-light",
          cardBorder: "border-terracotta/30",
          headline: "Scope Creep Detected",
          description: "Introduces external capabilities, vendors, or platforms not in the baseline.",
        };
      case "NEEDS_REVIEW":
        return {
          icon: <HelpCircle className="w-4 h-4 text-amber-400" />,
          title: "NEEDS_REVIEW",
          badgeClass: "bg-amber-500/15 border-amber-500/30 text-amber-400",
          cardBorder: "border-amber-500/30",
          headline: "Ambiguous Evidence — Review Needed",
          description: "Evidence is subjective or incomplete. Human developer clarification needed.",
        };
    }
  };

  const statusConfig = getStatusDisplay();

  return (
    <div
      className={`rounded-3xl contribo-card border ${statusConfig.cardBorder} p-6 shadow-floating space-y-4 animate-in fade-in slide-in-from-top-3 duration-200`}
    >
      {/* Top Status Header */}
      <div className="flex items-start justify-between border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div
            className={`px-3.5 py-1.5 rounded-full border text-xs font-bold flex items-center gap-2 ${statusConfig.badgeClass}`}
          >
            {statusConfig.icon}
            <span>{statusConfig.title}</span>
          </div>

          <div>
            <h3 className="text-sm font-extrabold text-white tracking-tight">
              {statusConfig.headline}
            </h3>
            <p className="text-[11px] text-slate-400">
              {statusConfig.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Client response generator button */}
          <button
            onClick={onOpenClientReplyModal}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-brand text-xs font-bold transition-all hover:scale-102"
            title="Draft an email/message to the client"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Draft Client Reply</span>
          </button>

          <button
            onClick={onClear}
            className="text-xs text-slate-400 hover:text-white p-1.5 transition-colors rounded-full"
            title="Dismiss evaluation"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Evaluated Request */}
      <div className="inner-pill-card p-4">
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
          Evaluated Request:
        </span>
        <p className="text-sm text-slate-100 italic font-sans leading-relaxed">
          &ldquo;{requestText}&rdquo;
        </p>
      </div>

      {/* Matched Scope Items */}
      <div>
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-2">
          Matched Scope Deliverables:
        </span>
        {matchedItems.length > 0 ? (
          <div className="flex items-center gap-2 flex-wrap">
            {matchedItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-slate-200 font-semibold"
              >
                <span className="text-brand font-bold text-[11px]">
                  #{item.id.replace("item-", "")}
                </span>
                <span>{item.title}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic px-3 py-1.5 rounded-full bg-white/5 border border-white/5 inline-block">
            No matching items found in the approved baseline.
          </p>
        )}
      </div>

      {/* Plain-Language Rationale */}
      <div className="space-y-1">
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
          Evidence & Rationale:
        </span>
        <div className="text-xs text-slate-200 leading-relaxed bg-black/30 p-3.5 rounded-2xl border border-white/5">
          {result.rationale}
        </div>
      </div>

      {/* Uncertainty Disclosure if any */}
      {result.uncertaintyWarning && (
        <div className="px-4 py-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start gap-2.5">
          <HelpCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <span className="leading-relaxed">{result.uncertaintyWarning}</span>
        </div>
      )}

      {/* Decision Action Bar */}
      <div className="pt-3 border-t border-white/5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase font-extrabold text-white tracking-wider">
            Record Human Decision:
          </span>
          <span className="text-[11px] text-slate-400 font-medium">
            Developer retains 100% final authority
          </span>
        </div>

        {/* 3 tactile pill decision buttons */}
        <div className="grid grid-cols-3 gap-2.5">
          <button
            type="button"
            onClick={() => handleActionClick("ACCEPT")}
            className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-full border text-xs font-bold transition-all ${
              selectedAction === "ACCEPT"
                ? "bg-emerald-500 text-slate-950 border-emerald-400 shadow-glow-emerald scale-[1.02]"
                : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
            }`}
          >
            <Check className="w-4 h-4" />
            <span>Accept</span>
          </button>

          <button
            type="button"
            onClick={() => handleActionClick("REJECT")}
            className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-full border text-xs font-bold transition-all ${
              selectedAction === "REJECT"
                ? "bg-terracotta text-white border-terracotta-light shadow-glow-terracotta scale-[1.02]"
                : "bg-terracotta-soft hover:bg-terracotta/20 text-terracotta-light border-terracotta/30"
            }`}
          >
            <X className="w-4 h-4" />
            <span>Reject / Change Order</span>
          </button>

          <button
            type="button"
            onClick={() => handleActionClick("CLARIFY")}
            className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-full border text-xs font-bold transition-all ${
              selectedAction === "CLARIFY"
                ? "bg-amber-500 text-slate-950 border-amber-400 shadow-sm scale-[1.02]"
                : "bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border-amber-500/30"
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
              <span className="text-[10px] text-slate-400 font-semibold">
                Presets:
              </span>
              {PRESET_NOTES[selectedAction].map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setDeveloperNote(preset)}
                  className="text-[10px] px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all font-medium"
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
              className="w-full px-4 py-2.5 rounded-full bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand transition-colors"
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedAction(null)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white rounded-full font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveDecision}
                className="flex items-center gap-1.5 px-6 py-2 rounded-full bg-white hover:bg-slate-100 text-slate-950 text-xs font-extrabold transition-all shadow-soft hover:scale-102 active:scale-98"
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
