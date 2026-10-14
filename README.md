# ScopeLock

> **Deterministic scope creep protection for freelance developers and software teams.**  
> Turn unstructured client briefs into versioned baselines, evaluate new requests with mathematical evidence, and protect project boundaries before work expands.

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js 15](https://img.shields.io/badge/Next.js-15.2-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Vitest](https://img.shields.io/badge/Tests-24%20Passing-emerald.svg)](tests/)
[![Local-First](https://img.shields.io/badge/Privacy-100%25%20Client--Side-green.svg)](#privacy-security--data-handling)

---

## 1. Problem & User

* **Primary User:** Freelance software developers, independent technical contractors, and small development studios managing client projects through email, Slack, or chat.
* **The Problem:** The original project agreement is often scattered across brief emails, meeting notes, and message threads. As development proceeds, clients casually request "small additions" (e.g. *"Can we also send SMS receipts via Twilio?"* or *"Can we build a mobile companion app?"*). Without an explicit, shared baseline, it is difficult to determine whether a request fits the agreed fee or represents unbilled scope creep.
* **The Thesis:** A human-approved, versioned scope baseline combined with a transparent, deterministic comparison engine and audit log makes scope boundaries visible, evidence-backed, and easy to discuss with clients before unbilled work begins.
* **Non-Goal:** ScopeLock is an operational project management tool, **not** legal advice. It does not interpret statutory law, replace a formal Statement of Work (SOW), or adjudicate contractual disputes.

---

## 2. Status Semantics & Decision Flow

Incoming feature requests are compared against approved baseline deliverables using deterministic tokenization, n-gram matching, and novel vendor/platform detection. ScopeLock assigns exactly one of three transparent statuses:

| Status | Meaning | System Behavior & Action Required |
|:---|:---|:---|
| <span style="color:#059669; font-weight:bold;">IN_SCOPE</span> | Clear token and concept overlap with an approved deliverable. | Highlights matching baseline deliverable(s); provides supporting rationale; developer may accept or override. |
| <span style="color:#ea580c; font-weight:bold;">POSSIBLE_CHANGE</span> | Novel vendor (e.g., Twilio), platform (e.g., iOS/Android), or unagreed capability detected. | Explains what appears outside baseline bounds; flags need for a Change Order or Phase 2 deferral. |
| <span style="color:#d97706; font-weight:bold;">NEEDS_REVIEW</span> | Ambiguous, contradictory, or insufficient evidence in request. | Prevents false certainty; explicitly surfaces ambiguity; suggests seeking written clarification from the client. |

---

## 3. Core Capabilities

1. **Scope Anchor & Baseline Versioning:**
   * Ingest client briefs, parse deliverables into editable cards, and lock them into an immutable baseline (`v1.0`).
   * When requirements evolve, editing creates a new baseline revision (`v2.0`) upon approval, preserving all previous decision records tied to earlier versions.
2. **Deterministic Comparison Engine:**
   * Evaluates text using tokenization, stopword removal, bi-gram/tri-gram overlap, and novel vendor detection (telephony, payment gateways, mobile platforms).
   * Generates transparent, human-readable rationales and explicit uncertainty notes without black-box LLM hallucinations.
3. **Human Decision Authority & Audit Timeline:**
   * Developer retains absolute authority to `ACCEPT`, `REJECT`, or `CLARIFY` each request with optional notes.
   * Decisions stream into a persistent, filterable audit log.
4. **Diplomatic Client Reply Drafter:**
   * 1-click generates polite, professional client responses (Change Order proposal, Phase 2 deferral, or technical clarification) ready to paste into Slack or email.
5. **Account-Gated Workspace Security:**
   * The workspace portal is strictly protected by session authentication.
   * Signing out immediately closes the active workspace portal and clears transient evaluations, protecting client deliverables from unauthorized viewers.
6. **100% Local-First Portability:**
   * Zero external API calls, zero server telemetry, and zero credentials required.
   * 1-click JSON backup export and safe workspace reset with confirmation modal.

---

## 4. Technology Stack

* **Framework:** [Next.js 15.2](https://nextjs.org/) (App Router, React 19)
* **Language:** [TypeScript 5.7](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS 3.4](https://tailwindcss.com/) (Contribo-inspired light palette, Plus Jakarta Sans typography, soft shadows)
* **Schema Validation:** [Zod 3.24](https://zod.dev/) (defensive runtime parsing of local storage)
* **Icons:** [Lucide React](https://lucide.dev/)
* **Test Runner:** [Vitest 3.0](https://vitest.dev/)

---

## 5. Local Setup & Quickstart

ScopeLock is completely self-contained and requires **no external API keys, database setup, or environment variables**.

### Prerequisites
* [Node.js](https://nodejs.org/) v18.17+ or v20+
* npm v9+

### Installation

```bash
# Clone the repository
git clone https://github.com/Anekenonso/ScopeLock.git
cd ScopeLock

# Install dependencies
npm install

# Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 6. Verification & Automated Tests

ScopeLock adheres to the **Prove-It build principle**: verifying the deterministic kernel with automated tests before UI scaffolding.

### Run Unit Tests

```bash
npm test
```

### Test Suite Coverage (24 Tests Across 5 Suites)

* **Comparator Kill-Tests (`tests/unit/comparator.test.ts`):**
  * 12 synthetic kill-test cases covering clear in-scope, clear out-of-scope (novel telephony, mobile platforms), mixed requests, and ambiguous statements.
* **Storage & Corruption Recovery (`tests/unit/storage.test.ts`):**
  * Local persistence, version recovery, and safe fallback when corrupted JSON is encountered.
* **Baseline Evolution (`tests/unit/versioningAndPortability.test.ts`):**
  * Verifies baseline version bumping (`v1.0` → `v2.0`) while immutably preserving previous decisions tied to `v1.0`.
* **Brief Parser (`tests/unit/parser.test.ts`):**
  * Bullet, numbered, and paragraph deliverable extraction.
* **Decision Flow (`tests/unit/decisionFlow.test.ts`):**
  * Validates human authority override and audit record serialization.

---

## 7. Privacy, Security & Data Handling

* **Zero Cloud Leak Guarantee:** Client briefs, deliverables, and scope comparison records are processed entirely in the browser and stored in `localStorage`. No text is ever transmitted over the network or sent to third-party AI APIs.
* **Immediate Logout Protection:** Logging out instantly closes the active workspace portal and purges on-screen evaluation state, preventing confidential scope details from remaining visible on shared workstations.
* **Data Sovereignty:** Full JSON export allows developers to download their audit trail at any time. A dedicated "Reset Workspace" modal cleanly wipes all local data.

---

## 8. Hackathon Planning Artifacts

In accordance with the **Devpost Build With AI: Basics** curriculum, the project planning artifacts are preserved in [`devpost/`](devpost/):

* [`devpost/scope.md`](devpost/scope.md) — Scope definition, target user, and proof-of-concept boundary.
* [`devpost/prd.md`](devpost/prd.md) — Product Requirements Document detailing the core journey and edge cases.
* [`devpost/spec.md`](devpost/spec.md) — Technical blueprint, data models, and comparison algorithm rules.
* [`devpost/checklist.md`](devpost/checklist.md) — Executed build slices and verification records.
* [`devpost/app-map.html`](devpost/app-map.html) — Interactive architectural code tour and application map.

---

## 9. License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
