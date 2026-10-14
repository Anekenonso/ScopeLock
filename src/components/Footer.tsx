"use client";

import React from "react";
import { LogoIcon } from "@/components/Logo";
import {
  ShieldCheck,
  Lock,
  ExternalLink,
  Github,
  Cpu,
  UserCheck,
  MessageSquare,
  Scale,
  Sparkles,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 mb-10">
          {/* Brand & Mission (5 cols) */}
          <div className="md:col-span-5 space-y-3.5">
            <div className="flex items-center gap-2.5">
              <LogoIcon size={26} />
              <span className="text-base font-extrabold text-slate-950 tracking-tight">
                ScopeLock
              </span>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-mono text-slate-700 border border-slate-200 font-semibold">
                v1.0 Local-First
              </span>
            </div>
            <p className="text-xs text-slate-600 max-w-sm leading-relaxed">
              Deterministic scope creep protection for freelance developers and software teams. Turn client briefs into approved baselines and evaluate new requests with mathematical evidence.
            </p>
            <div className="pt-1 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>100% Client-Side Privacy Guarantee</span>
              </span>
            </div>
          </div>

          {/* Architecture (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-900">
              Core Architecture
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-2 hover:text-slate-900 transition-colors">
                <Lock className="w-3.5 h-3.5 text-brand flex-shrink-0" />
                <span>Scope Anchor & Versioning (v1.0 / v2.0)</span>
              </li>
              <li className="flex items-center gap-2 hover:text-slate-900 transition-colors">
                <Cpu className="w-3.5 h-3.5 text-brand flex-shrink-0" />
                <span>Deterministic Token & N-Gram Comparator</span>
              </li>
              <li className="flex items-center gap-2 hover:text-slate-900 transition-colors">
                <UserCheck className="w-3.5 h-3.5 text-brand flex-shrink-0" />
                <span>Human Decision Authority & Audit Timeline</span>
              </li>
              <li className="flex items-center gap-2 hover:text-slate-900 transition-colors">
                <MessageSquare className="w-3.5 h-3.5 text-brand flex-shrink-0" />
                <span>Diplomatic Client Reply Drafter</span>
              </li>
            </ul>
          </div>

          {/* Resources & Links (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-900">
              Project & Resources
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <a
                  href="https://learn-ai-basics.devpost.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-slate-900 transition-colors inline-flex items-center gap-2"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                  <span>Devpost Submission</span>
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/Anekenonso/ScopeLock"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-slate-900 transition-colors inline-flex items-center gap-2"
                >
                  <Github className="w-3.5 h-3.5 text-slate-800 flex-shrink-0" />
                  <span>GitHub Repository</span>
                </a>
              </li>
              <li className="flex items-center gap-2 hover:text-slate-900 transition-colors">
                <Scale className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                <span>MIT Open Source License</span>
              </li>
              <li className="flex items-center gap-2 hover:text-slate-900 transition-colors">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                <span>12 Synthetic Kill-Test Cases</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© 2026 ScopeLock. All rights reserved</p>
          <div className="flex items-center gap-3 text-slate-500">
            <span>Zero Cloud Leaks</span>
            <span>•</span>
            <span>100% In-Browser Privacy</span>
            <span>•</span>
            <span>Local-First Storage</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
