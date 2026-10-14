"use client";

import React, { useState } from "react";
import { History, Check, X, MessageSquare, Filter } from "lucide-react";
import { DecisionRecord, ComparisonStatus } from "@/types";

interface HistoryFeedProps {
  decisions: DecisionRecord[];
}

export function HistoryFeed({ decisions }: HistoryFeedProps) {
  const [filter, setFilter] = useState<string>("ALL");

  const filteredDecisions = decisions.filter((d) => {
    if (filter === "ALL") return true;
    return d.status === filter;
  });

  const getActionBadge = (action: string) => {
    switch (action) {
      case "ACCEPT":
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-mono font-bold">
            <Check className="w-3 h-3" />
            <span>ACCEPTED</span>
          </span>
        );
      case "REJECT":
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[11px] font-mono font-bold">
            <X className="w-3 h-3" />
            <span>REJECTED</span>
          </span>
        );
      case "CLARIFY":
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[11px] font-mono font-bold">
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
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono">
            IN_SCOPE
          </span>
        );
      case "POSSIBLE_CHANGE":
        return (
          <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-mono">
            POSSIBLE_CHANGE
          </span>
        );
      case "NEEDS_REVIEW":
        return (
          <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-mono">
            NEEDS_REVIEW
          </span>
        );
    }
  };

  return (
    <div className="bg-surface rounded-xl border border-surface-border p-4 shadow-lg space-y-3">
      {/* Feed Header */}
      <div className="flex items-center justify-between pb-2 border-b border-surface-border">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-brand" />
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
            Decision Audit History ({decisions.length})
          </h3>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1">
          <Filter className="w-3 h-3 text-slate-500 mr-1" />
          {["ALL", "IN_SCOPE", "POSSIBLE_CHANGE", "NEEDS_REVIEW"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-[10px] font-mono px-2 py-0.5 rounded transition-all ${
                filter === f
                  ? "bg-brand/20 text-brand border border-brand/40 font-bold"
                  : "bg-canvas text-slate-400 hover:text-slate-200 border border-surface-border"
              }`}
            >
              {f === "ALL" ? "All" : f.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Decision List */}
      <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
        {filteredDecisions.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            {decisions.length === 0
              ? "No decisions recorded yet. Compare a request above to log your first decision."
              : "No decisions match the selected filter."}
          </div>
        ) : (
          filteredDecisions.map((decision) => (
            <div
              key={decision.id}
              className="p-3 rounded-lg bg-canvas border border-surface-border space-y-2 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {getActionBadge(decision.action)}
                  {getStatusPill(decision.status)}
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-surface-border">
                    {decision.baselineVersionNumber}
                  </span>
                  <span>
                    {new Date(decision.decidedAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-200 font-medium leading-relaxed">
                &ldquo;{decision.requestText}&rdquo;
              </p>

              <p className="text-[11px] text-slate-400 leading-normal bg-surface/50 p-2 rounded border border-surface-border/50">
                <span className="font-mono text-slate-500 uppercase text-[9px] block mb-0.5">
                  Rationale:
                </span>
                {decision.rationale}
              </p>

              {decision.note && (
                <div className="text-[11px] text-brand/90 font-mono bg-brand/5 p-1.5 rounded border border-brand/20">
                  <span className="text-[10px] text-slate-500 mr-1.5">Note:</span>
                  {decision.note}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
