"use client";

import React, { useState } from "react";
import { Copy, Check, X, Mail, Sparkles } from "lucide-react";
import { ComparisonResult, BaselineVersion } from "@/types";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white border border-slate-200 rounded-3xl shadow-floating overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-700 flex-shrink-0">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-950 tracking-tight">
                Client Response Drafter
              </h3>
              <p className="text-xs text-slate-500">
                Diplomatic scope boundary copy ready to paste into Slack or Email
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Template Selector Pills */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Style:
            </span>
            <div className="flex flex-wrap sm:grid sm:grid-cols-3 gap-1.5 flex-1">
              <button
                type="button"
                onClick={() => setTemplateType("change_order")}
                className={`text-xs py-1.5 px-3 rounded-full border font-bold transition-all ${
                  templateType === "change_order"
                    ? "bg-slate-950 text-white border-slate-950 shadow-sm"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900"
                }`}
              >
                Change Order
              </button>
              <button
                type="button"
                onClick={() => setTemplateType("deferral")}
                className={`text-xs py-1.5 px-3 rounded-full border font-bold transition-all ${
                  templateType === "deferral"
                    ? "bg-slate-950 text-white border-slate-950 shadow-sm"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900"
                }`}
              >
                Defer to Phase 2
              </button>
              <button
                type="button"
                onClick={() => setTemplateType("clarification")}
                className={`text-xs py-1.5 px-3 rounded-full border font-bold transition-all ${
                  templateType === "clarification"
                    ? "bg-slate-950 text-white border-slate-950 shadow-sm"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900"
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
              className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-xs font-sans leading-relaxed resize-none focus:outline-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-brand" />
              Tailored to {baseline.versionNumber} evidence
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-full text-slate-500 hover:text-slate-900 text-xs font-bold transition-colors"
              >
                Close
              </button>

              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-6 py-2 rounded-full bg-slate-950 hover:bg-slate-800 text-white font-extrabold text-xs shadow-sm transition-all active:scale-98"
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
