"use client";

import React, { useState } from "react";
import { Copy, Check, X, Mail, Sparkles, Send } from "lucide-react";
import { ComparisonResult, ScopeItem, BaselineVersion } from "@/types";

interface ClientResponseModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestText: string;
  result: ComparisonResult;
  baseline: BaselineVersion;
  onCopied: () => void;
}

export function ClientResponseModal({
  isOpen,
  onClose,
  requestText,
  result,
  baseline,
  onCopied,
}: ClientResponseModalProps) {
  const [copied, setCopied] = useState(false);
  const [templateType, setTemplateType] = useState<"change_order" | "deferral" | "clarification">(
    result.status === "POSSIBLE_CHANGE"
      ? "change_order"
      : result.status === "NEEDS_REVIEW"
      ? "clarification"
      : "change_order"
  );

  if (!isOpen) return null;

  const generateResponseText = () => {
    switch (templateType) {
      case "change_order":
        return `Hi there,

Thanks for sharing this request: "${requestText}".

We compared this against our agreed project baseline (${baseline.versionNumber}). Because this introduces functionality outside of our current scope (${result.rationale}), we would love to support it as a formal Change Order.

We can draft an estimate for the additional hours and timeline impact so you can decide if you'd like to include it in this sprint. Let us know if you'd like us to proceed with that estimate!`;

      case "deferral":
        return `Hi there,

Thank you for the note regarding: "${requestText}".

We reviewed this against our locked baseline (${baseline.versionNumber}). To ensure we hit our agreed target launch date without scope expansion, we recommend logging this into our Phase 2 backlog. 

Once we deliver the core baseline milestone, we can prioritize this feature immediately in the next cycle.`;

      case "clarification":
        return `Hi there,

Regarding your request: "${requestText}" — we checked this against baseline (${baseline.versionNumber}).

Before we can confirm whether this fits within the current milestone, we need a bit more detail regarding your exact expectations (${result.rationale}).

Could you clarify the specific user flow or requirements so we can make sure we're fully aligned?`;
    }
  };

  const textToCopy = generateResponseText();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      onCopied();
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = textToCopy;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      onCopied();
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-surface border border-surface-border rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-surface-border flex items-center justify-between bg-surface-elevated/40">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-brand/10 border border-brand/30 flex items-center justify-center text-brand">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Client Response Drafter
              </h3>
              <p className="text-[11px] text-slate-400">
                Professional, diplomatic scope boundary copy ready to send
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Template Selector Pills */}
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              Style:
            </span>
            <div className="grid grid-cols-3 gap-1.5 flex-1">
              <button
                type="button"
                onClick={() => setTemplateType("change_order")}
                className={`text-xs py-1.5 px-2.5 rounded-lg border font-medium transition-all ${
                  templateType === "change_order"
                    ? "bg-brand/15 text-brand border-brand/40 shadow-sm"
                    : "bg-canvas text-slate-400 border-surface-border hover:text-slate-200"
                }`}
              >
                Change Order
              </button>
              <button
                type="button"
                onClick={() => setTemplateType("deferral")}
                className={`text-xs py-1.5 px-2.5 rounded-lg border font-medium transition-all ${
                  templateType === "deferral"
                    ? "bg-brand/15 text-brand border-brand/40 shadow-sm"
                    : "bg-canvas text-slate-400 border-surface-border hover:text-slate-200"
                }`}
              >
                Defer to Phase 2
              </button>
              <button
                type="button"
                onClick={() => setTemplateType("clarification")}
                className={`text-xs py-1.5 px-2.5 rounded-lg border font-medium transition-all ${
                  templateType === "clarification"
                    ? "bg-brand/15 text-brand border-brand/40 shadow-sm"
                    : "bg-canvas text-slate-400 border-surface-border hover:text-slate-200"
                }`}
              >
                Ask Clarification
              </button>
            </div>
          </div>

          {/* Generated Message Preview */}
          <div className="relative">
            <textarea
              readOnly
              rows={9}
              value={textToCopy}
              className="w-full p-4 rounded-xl bg-canvas border border-surface-border text-slate-200 text-xs font-sans leading-relaxed resize-none focus:outline-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-surface-border">
            <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-brand" />
              Tailored to {baseline.versionNumber} evidence
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 text-xs font-medium transition-colors"
              >
                Close
              </button>

              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-glow-brand transition-all active:scale-95"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy to Clipboard</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
