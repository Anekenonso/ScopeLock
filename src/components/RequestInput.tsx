"use client";

import React, { useState } from "react";
import { ArrowRight, Sparkles, SendHorizontal } from "lucide-react";

interface RequestInputProps {
  onCompare: (requestText: string) => void;
  disabled?: boolean;
}

const SAMPLE_REQUESTS = [
  {
    label: "Twilio SMS (Change)",
    text: "Can we also send SMS receipts via Twilio when someone buys?",
  },
  {
    label: "Stripe Flow (In Scope)",
    text: "We need a checkout page for Stripe credit card payments.",
  },
  {
    label: "Mobile App (Change)",
    text: "We'd like to build an iOS and Android mobile app version.",
  },
  {
    label: "Social Login (Review)",
    text: "Add social login via Google and GitHub.",
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
    <div className="bg-surface rounded-xl border border-surface-border p-4 shadow-lg space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <SendHorizontal className="w-3.5 h-3.5 text-brand" />
          <span>Incoming Client Request</span>
        </label>
        <span className="text-[11px] font-mono text-slate-500">
          Press Ctrl + Enter to compare
        </span>
      </div>

      <textarea
        rows={3}
        value={requestText}
        onChange={(e) => setRequestText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Paste a client email, message, or feature request (e.g. 'Can we also send SMS receipts via Twilio?')..."
        disabled={disabled}
        className="w-full px-3.5 py-2.5 rounded-lg bg-canvas border border-surface-border text-slate-100 text-sm focus:outline-none focus:border-brand transition-colors disabled:opacity-50 leading-relaxed resize-none"
      />

      {/* Quick sample pills */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-mono text-slate-500 mr-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-brand" />
            Quick Test:
          </span>
          {SAMPLE_REQUESTS.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setRequestText(sample.text)}
              disabled={disabled}
              className="text-[11px] font-mono px-2 py-1 rounded bg-canvas hover:bg-slate-800 border border-surface-border text-slate-400 hover:text-brand transition-all disabled:opacity-40"
            >
              {sample.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => handleSubmit()}
          disabled={!requestText.trim() || disabled}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand hover:bg-sky-400 disabled:opacity-40 text-slate-950 font-semibold text-xs shadow-lg shadow-brand/20 transition-all flex-shrink-0"
        >
          <span>Compare</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
