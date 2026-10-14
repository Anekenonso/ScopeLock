"use client";

import React, { useState } from "react";
import {
  History,
  Check,
  X,
  MessageSquare,
  Search,
  Copy,
  CheckCheck,
  Clock,
  ShieldCheck,
  ShieldAlert,
  HelpCircle,
} from "lucide-react";
import { DecisionRecord, ComparisonStatus } from "@/types";

interface HistoryFeedProps {
  decisions: DecisionRecord[];
  onDraftReplyForRecord?: (decision: DecisionRecord) => void;
}

export function HistoryFeed({ decisions }: HistoryFeedProps) {
  const [filter, setFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredDecisions = decisions.filter((d) => {
    const matchesFilter = filter === "ALL" || d.status === filter;
    if (!matchesFilter) return false;
    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase();
    return (
      d.requestText.toLowerCase().includes(q) ||
      d.rationale.toLowerCase().includes(q) ||
      (d.note && d.note.toLowerCase().includes(q))
    );
  });

  const countByStatus = {
    ALL: decisions.length,
    IN_SCOPE: decisions.filter((d) => d.status === "IN_SCOPE").length,
    POSSIBLE_CHANGE: decisions.filter((d) => d.status === "POSSIBLE_CHANGE").length,
    NEEDS_REVIEW: decisions.filter((d) => d.status === "NEEDS_REVIEW").length,
  };

  const handleCopySummary = async (decision: DecisionRecord) => {
    const summary = `[ScopeLock Audit] Baseline ${decision.baselineVersionNumber}\nRequest: "${decision.requestText}"\nStatus: ${decision.status}\nDecision: ${decision.action}\nRationale: ${decision.rationale}${decision.note ? `\nNote: ${decision.note}` : ""}`;
    try {
      await navigator.clipboard.writeText(summary);
      setCopiedId(decision.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback
    }
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case "ACCEPT":
        return (
          <span className="flex items-center gap-1 px-3 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
            <Check className="w-3 h-3 stroke-[2.5]" />
            <span>ACCEPTED</span>
          </span>
        );
      case "REJECT":
        return (
          <span className="flex items-center gap-1 px-3 py-0.5 rounded-full bg-terracotta-soft text-terracotta-light border border-terracotta/30 text-[10px] font-bold">
            <X className="w-3 h-3 stroke-[2.5]" />
            <span>REJECTED</span>
          </span>
        );
      case "CLARIFY":
        return (
          <span className="flex items-center gap-1 px-3 py-0.5 rounded-full bg-lavender-soft text-lavender-light border border-lavender/30 text-[10px] font-bold">
            <MessageSquare className="w-3 h-3 stroke-[2.5]" />
            <span>CLARIFY</span>
          </span>
        );
      default:
        return null;
    }
  };

  const getStatusPill = (status: ComparisonStatus) => {
    switch (status) {
      case "IN_SCOPE":
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/10 text-[10px] font-medium">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>In Scope</span>
          </span>
        );
      case "POSSIBLE_CHANGE":
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/10 text-[10px] font-medium">
            <ShieldAlert className="w-3 h-3 text-terracotta" />
            <span>Scope Creep</span>
          </span>
        );
      case "NEEDS_REVIEW":
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/10 text-[10px] font-medium">
            <HelpCircle className="w-3 h-3 text-amber-400" />
            <span>Needs Review</span>
          </span>
        );
    }
  };

  return (
    <div className="contribo-card p-5 space-y-4 shadow-soft">
      {/* Feed Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/5 gap-2.5">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-brand" />
          <h3 className="text-xs uppercase tracking-wider text-white font-extrabold">
            Decision Audit Timeline ({decisions.length})
          </h3>
        </div>

        {/* Filter buttons as Contribo rounded-full pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {(["ALL", "IN_SCOPE", "POSSIBLE_CHANGE", "NEEDS_REVIEW"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-[10px] px-3 py-1 rounded-full transition-all flex items-center gap-1.5 font-bold ${
                filter === f
                  ? "bg-white text-slate-950 shadow-sm scale-102"
                  : "bg-white/5 text-slate-400 hover:text-white border border-white/5"
              }`}
            >
              <span>{f === "ALL" ? "All" : f.replace("_", " ")}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[9px] ${
                  filter === f ? "bg-slate-200 text-slate-900" : "bg-white/10 text-slate-400"
                }`}
              >
                {countByStatus[f]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Pill Search if more than 3 decisions */}
      {decisions.length > 3 && (
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search decisions by request, rationale, or notes..."
            className="w-full pl-9 pr-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand transition-colors"
          />
        </div>
      )}

      {/* Decision List */}
      <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
        {filteredDecisions.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs border border-dashed border-white/10 rounded-2xl">
            {decisions.length === 0
              ? "No decisions recorded yet. Compare a request above to log your first decision."
              : "No decisions match the selected filter."}
          </div>
        ) : (
          filteredDecisions.map((decision) => (
            <div
              key={decision.id}
              className="p-4 rounded-2xl bg-ink-surface/50 border border-white/5 space-y-2.5 hover:border-white/15 transition-all group"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {getActionBadge(decision.action)}
                  {getStatusPill(decision.status)}
                </div>

                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                  <span className="px-2 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/10 font-bold">
                    {decision.baselineVersionNumber}
                  </span>
                  <span className="flex items-center gap-1 text-slate-500">
                    <Clock className="w-3 h-3" />
                    {new Date(decision.decidedAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>

                  <button
                    onClick={() => handleCopySummary(decision)}
                    className="p-1 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                    title="Copy audit record summary"
                  >
                    {copiedId === decision.id ? (
                      <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <p className="text-xs text-white font-medium leading-relaxed font-sans">
                &ldquo;{decision.requestText}&rdquo;
              </p>

              <div className="text-[11px] text-slate-300 leading-relaxed bg-black/30 p-3 rounded-xl border border-white/5">
                <span className="uppercase text-[9px] block mb-0.5 font-bold text-slate-400">
                  Evidence Rationale:
                </span>
                {decision.rationale}
              </div>

              {decision.note && (
                <div className="text-[11px] text-brand bg-brand/5 p-2 rounded-xl border border-brand/20 flex items-start gap-1.5 font-mono">
                  <span className="text-[10px] text-slate-400 uppercase font-bold flex-shrink-0">
                    Note:
                  </span>
                  <span>{decision.note}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
