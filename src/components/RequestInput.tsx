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
    dot: "bg-emerald-500",
    text: "We need a checkout page for Stripe credit card payments.",
  },
  {
    label: "Twilio SMS",
    type: "change",
    dot: "bg-orange-500",
    text: "Can we also send SMS receipts via Twilio when someone buys?",
  },
  {
    label: "Mobile Apps",
    type: "change",
    dot: "bg-rose-500",
    text: "We'd like to build an iOS and Android mobile app version.",
  },
  {
    label: "Multi-Currency",
    type: "change",
    dot: "bg-orange-500",
    text: "Please add multi-currency conversion with live forex rates.",
  },
  {
    label: "Social Login",
    type: "review",
    dot: "bg-purple-500",
    text: "Add social login via Google and GitHub.",
  },
  {
    label: "Order History",
    type: "in_scope",
    dot: "bg-emerald-500",
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
    <div className="contribo-card p-4 sm:p-6 space-y-4 shadow-card">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <label className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
          <SendHorizontal className="w-4 h-4 text-brand flex-shrink-0" />
          <span>Incoming Request Evaluation</span>
        </label>
        <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
          Type or choose a test below
        </span>
      </div>

      {/* Textarea Input */}
      <div className="relative">
        <textarea
          rows={3}
          value={requestText}
          onChange={(e) => setRequestText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Paste client email excerpt, message, or change request (e.g. 'Can we also send SMS receipts via Twilio?')..."
          disabled={disabled}
          className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-brand focus:bg-white transition-all disabled:opacity-50 leading-relaxed resize-none pr-8 placeholder-slate-400 font-sans"
        />
        {requestText && (
          <button
            onClick={() => setRequestText("")}
            className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-700 transition-colors p-1"
            title="Clear text"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Quick Test Chips Row */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
          <Sparkles className="w-3.5 h-3.5 text-brand" />
          <span>Quick Test Scenarios:</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {SAMPLE_REQUESTS.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setRequestText(sample.text)}
              disabled={disabled}
              className="text-xs px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200/80 text-slate-700 hover:text-slate-950 transition-all disabled:opacity-40 flex items-center gap-1.5 font-semibold hover:scale-102"
            >
              <span className={`w-2 h-2 rounded-full ${sample.dot}`}></span>
              <span>{sample.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Dedicated, perfectly aligned bottom action bar */}
      <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <span className="text-[11px] text-slate-500 hidden sm:flex items-center gap-1 font-mono">
          <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 font-semibold">Ctrl</span>
          <span>+</span>
          <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 font-semibold">Enter</span>
          <span>to compare immediately</span>
        </span>

        <button
          type="button"
          onClick={() => handleSubmit()}
          disabled={!requestText.trim() || disabled}
          className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 sm:py-2.5 rounded-full bg-slate-950 text-white font-extrabold text-xs hover:bg-slate-800 disabled:opacity-40 shadow-sm transition-all hover:scale-102 active:scale-98 flex-shrink-0"
        >
          <span>Compare Scope</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
