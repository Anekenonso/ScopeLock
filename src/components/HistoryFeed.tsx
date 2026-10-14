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
          <span className="flex items-center gap-1 px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold">
            <Check className="w-3 h-3 stroke-[2.5]" />
            <span>ACCEPTED</span>
          </span>
        );
      case "REJECT":
        return (
          <span className="flex items-center gap-1 px-3 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200 text-xs font-bold">
            <X className="w-3 h-3 stroke-[2.5]" />
            <span>REJECTED</span>
          </span>
        );
      case "CLARIFY":
        return (
          <span className="flex items-center gap-1 px-3 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold">
            <MessageSquare className="w-3 h-3" />
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
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-semibold">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            <span>In Scope</span>
          </span>
        );
      case "POSSIBLE_CHANGE":
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-semibold">
            <ShieldAlert className="w-3 h-3 text-orange-600" />
            <span>Scope Creep</span>
          </span>
        );
      case "NEEDS_REVIEW":
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-semibold">
            <HelpCircle className="w-3 h-3 text-amber-600" />
            <span>Needs Review</span>
          </span>
        );
    }
  };

  return (
    <div className="contribo-card p-6 space-y-4 shadow-card">
      {/* Top Header Row */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-brand" />
          <h3 className="text-xs uppercase tracking-wider text-slate-900 font-extrabold">
            Decision Audit Timeline
          </h3>
          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
            {decisions.length}
          </span>
        </div>

        {decisions.length > 3 && (
          <div className="relative w-48">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter decisions..."
              className="w-full pl-8 pr-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand"
            />
          </div>
        )}
      </div>

      {/* Symmetrical, perfectly aligned filter grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button
          type="button"
          onClick={() => setFilter("ALL")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            filter === "ALL"
              ? "bg-slate-950 text-white shadow-sm"
              : "bg-slate-100 text-slate-600 hover:text-slate-950 hover:bg-slate-200 border border-slate-200/80"
          }`}
        >
          <span>All</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${filter === "ALL" ? "bg-slate-800 text-white" : "bg-slate-200 text-slate-700"}`}>
            {countByStatus.ALL}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setFilter("IN_SCOPE")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            filter === "IN_SCOPE"
              ? "bg-emerald-600 text-white shadow-sm"
              : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/80"
          }`}
        >
          <span>In Scope</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${filter === "IN_SCOPE" ? "bg-emerald-800 text-white" : "bg-emerald-100 text-emerald-900"}`}>
            {countByStatus.IN_SCOPE}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setFilter("POSSIBLE_CHANGE")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            filter === "POSSIBLE_CHANGE"
              ? "bg-orange-600 text-white shadow-sm"
              : "bg-orange-50 text-orange-800 hover:bg-orange-100 border border-orange-200/80"
          }`}
        >
          <span>Scope Creep</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${filter === "POSSIBLE_CHANGE" ? "bg-orange-800 text-white" : "bg-orange-100 text-orange-900"}`}>
            {countByStatus.POSSIBLE_CHANGE}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setFilter("NEEDS_REVIEW")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            filter === "NEEDS_REVIEW"
              ? "bg-amber-600 text-white shadow-sm"
              : "bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200/80"
          }`}
        >
          <span>Needs Review</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${filter === "NEEDS_REVIEW" ? "bg-amber-800 text-white" : "bg-amber-100 text-amber-900"}`}>
            {countByStatus.NEEDS_REVIEW}
          </span>
        </button>
      </div>

      {/* Decision List */}
      <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
        {filteredDecisions.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
            {decisions.length === 0
              ? "No decisions recorded yet. Compare a request above to log your first decision."
              : "No decisions match the selected filter."}
          </div>
        ) : (
          filteredDecisions.map((decision) => (
            <div
              key={decision.id}
              className="p-4 rounded-2xl bg-white border border-slate-200/80 space-y-2.5 hover:border-slate-300 shadow-sm transition-all group"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {getActionBadge(decision.action)}
                  {getStatusPill(decision.status)}
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-bold">
                    {decision.baselineVersionNumber}
                  </span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-3 h-3" />
                    {new Date(decision.decidedAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>

                  <button
                    onClick={() => handleCopySummary(decision)}
                    className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                    title="Copy audit record summary"
                  >
                    {copiedId === decision.id ? (
                      <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-900 font-bold leading-relaxed font-sans">
                &ldquo;{decision.requestText}&rdquo;
              </p>

              <div className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                <span className="uppercase text-[9px] block mb-0.5 font-bold text-slate-500">
                  Evidence Rationale:
                </span>
                {decision.rationale}
              </div>

              {decision.note && (
                <div className="text-xs text-brand bg-sky-50 p-2.5 rounded-xl border border-sky-100 flex items-start gap-1.5 font-mono">
                  <span className="text-[10px] text-slate-500 uppercase font-bold flex-shrink-0">
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
