"use client";

import React, { useState } from "react";
import { Github, X, Check, Lock, ShieldCheck, ArrowRight } from "lucide-react";

export interface GithubUser {
  name: string;
  username: string;
  avatarUrl: string;
  email: string;
}

interface GithubAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: GithubUser) => void;
  actionReason?: string;
}

export function GithubAuthModal({
  isOpen,
  onClose,
  onSuccess,
  actionReason,
}: GithubAuthModalProps) {
  const [customUsername, setCustomUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSimulateOAuth = (username: string = "alexchen") => {
    setIsLoading(true);
    setTimeout(() => {
      const user: GithubUser = {
        name: username === "alexchen" ? "Alex Chen" : username,
        username: username.replace("@", "").trim() || "alexchen",
        avatarUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=${username}`,
        email: `${username.toLowerCase().replace(/\s+/g, "")}@users.noreply.github.com`,
      };
      setIsLoading(false);
      onSuccess(user);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-floating p-6 sm:p-8 space-y-5 animate-in slide-in-from-bottom-6 sm:slide-in-from-top-6 duration-300 ease-out text-slate-900 relative">
        {/* Action Reason Banner if triggered by a protected feature */}
        {actionReason && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-light/80 border border-brand/20 text-brand text-xs font-bold">
            <Lock className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">Sign in to unlock &ldquo;{actionReason}&rdquo;</span>
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-950 text-white flex items-center justify-center shadow-sm">
              <Github className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-950 tracking-tight">
                Sign in with GitHub
              </h3>
              <p className="text-xs text-slate-500">
                Connect your developer profile to continue
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Local-first Privacy Notice */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-xs text-slate-600">
          <div className="flex items-center gap-1.5 text-slate-900 font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Local-First & Zero Cloud Leak Guarantee</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-500">
            ScopeLock connects with GitHub to personalize your project workspace. All client briefs, baselines, and scope comparison records stay securely in your browser.
          </p>
        </div>

        {/* 1-Click GitHub Connect Button */}
        <div className="space-y-3">
          <button
            onClick={() => handleSimulateOAuth(customUsername || "alexchen")}
            disabled={isLoading}
            className="w-full py-3 px-5 rounded-full bg-slate-950 hover:bg-slate-800 text-white font-extrabold text-xs shadow-soft transition-all hover:scale-101 flex items-center justify-center gap-2.5 active:scale-98"
          >
            <Github className="w-4 h-4" />
            <span>
              {isLoading ? "Connecting to GitHub..." : "Continue with GitHub Account"}
            </span>
          </button>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-3 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Or specify username
            </span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={customUsername}
              onChange={(e) => setCustomUsername(e.target.value)}
              placeholder="e.g. your-github-handle"
              className="flex-1 px-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-brand transition-colors"
            />
            <button
              onClick={() => handleSimulateOAuth(customUsername || "developer")}
              disabled={isLoading || !customUsername.trim()}
              className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-900 font-bold text-xs transition-colors"
            >
              Connect
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
