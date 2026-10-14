import React from "react";
import { LogoIcon } from "@/components/Logo";
import { ShieldCheck, Lock, ExternalLink, Github, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white/70 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <LogoIcon size={26} />
              <span className="text-base font-extrabold text-ink tracking-tight">
                ScopeLock
              </span>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-mono text-slate-600 border border-slate-200">
                v1.0 Local-First
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              Deterministic scope creep protection for freelance developers and software teams. Turn client briefs into approved baselines and evaluate new requests with mathematical evidence.
            </p>
            <div className="pt-2 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Client-Side Privacy</span>
              </span>
            </div>
          </div>

          {/* Product links */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Architecture
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li className="hover:text-slate-900 transition-colors">
                • Scope Anchor & Versioning
              </li>
              <li className="hover:text-slate-900 transition-colors">
                • Deterministic Comparator
              </li>
              <li className="hover:text-slate-900 transition-colors">
                • Human Decision Authority
              </li>
              <li className="hover:text-slate-900 transition-colors">
                • Client Reply Drafter
              </li>
            </ul>
          </div>

          {/* Hackathon & Resources */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Hackathon & Code
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li>
                <a
                  href="https://devpost.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-slate-900 transition-colors inline-flex items-center gap-1"
                >
                  <span>Devpost Submission</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-slate-900 transition-colors inline-flex items-center gap-1"
                >
                  <Github className="w-3 h-3 text-slate-600" />
                  <span>GitHub Repository</span>
                </a>
              </li>
              <li className="text-slate-500">
                • MIT Open Source License
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>© 2026 ScopeLock. Built for Devpost Build With AI: Basics.</p>
          <p className="flex items-center gap-1 text-slate-500">
            <span>Crafted for developers protecting their time & sanity</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
