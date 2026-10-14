"use client";

import React, { useState } from "react";
import { ArrowRight, Sparkles, SendHorizontal, X } from "lucide-react";

interface RequestInputProps {
  onCompare: (requestText: string) => void;
  disabled?: boolean;
}

const SAMPLE_REQUESTS = [
  {
    label: "Stripe Flow",
    type: "in_scope",
    dot: "bg-emerald-400",
    text: "We need a checkout page for Stripe credit card payments.",
  },
  {
    label: "Twilio SMS",
    type: "change",
    dot: "bg-terracotta",
    text: "Can we also send SMS receipts via Twilio when someone buys?",
  },
  {
    label: "Mobile Apps",
    type: "change",
    dot: "bg-rose-400",
    text: "We'd like to build an iOS and Android mobile app version.",
  },
  {
    label: "Multi-Currency",
    type: "change",
    dot: "bg-terracotta",
    text: "Please add multi-currency conversion with live forex rates.",
  },
  {
    label: "Social Login",
    type: "review",
    dot: "bg-lavender",
    text: "Add social login via Google and GitHub.",
  },
  {
    label: "Order History",
    type: "in_scope",
    dot: "bg-emerald-400",
    text: "Can users view their past order history and invoices?",
  },
];

export function RequestInput({ onCompare, disabled }: RequestInputProps) {
  const [requestText, setRequestText] = useState("");

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = requestText.trim();
    if (!clean || disabled) return;
    onCompare(clean);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="contribo-card p-5 space-y-3.5 shadow-soft">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <SendHorizontal className="w-3.5 h-3.5 text-brand" />
          <span>Incoming Request Evaluation</span>
        </label>
        <span className="text-[10px] text-slate-400 hidden sm:flex items-center gap-1 font-mono">
          <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10">Ctrl + Enter</span>
          <span>to compare</span>
        </span>
      </div>

      <div className="relative">
        <textarea
          rows={3}
          value={requestText}
          onChange={(e) => setRequestText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Paste client brief excerpt, email, or feature request..."
          disabled={disabled}
          className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-slate-100 text-sm focus:outline-none focus:border-brand/60 transition-all disabled:opacity-50 leading-relaxed resize-none pr-8 placeholder-slate-500"
        />
        {requestText && (
          <button
            onClick={() => setRequestText("")}
            className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white transition-colors"
            title="Clear text"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Quick Test Chips & Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-0.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] text-slate-400 mr-1 flex items-center gap-1 font-semibold">
            <Sparkles className="w-3 h-3 text-brand" />
            Quick Test:
          </span>
          {SAMPLE_REQUESTS.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setRequestText(sample.text)}
              disabled={disabled}
              className="text-[10px] px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all disabled:opacity-40 flex items-center gap-1.5 font-medium hover:scale-102"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${sample.dot}`}></span>
              <span>{sample.label}</span>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => handleSubmit()}
          disabled={!requestText.trim() || disabled}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-white text-slate-950 font-extrabold text-xs hover:bg-slate-100 disabled:opacity-40 shadow-soft transition-all hover:scale-102 active:scale-98 flex-shrink-0"
        >
          <span>Compare Scope</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
