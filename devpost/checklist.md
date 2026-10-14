---
doc: checklist
status: approved
---

# Build Checklist

Build mode: fast

## Slices

- [x] **1. Bootstrap project and verify comparison engine with 12 kill-tests**
  Becomes usable: A running Next.js/TypeScript/Tailwind project with an automated Vitest test suite executing all 12 synthetic kill-test cases against the pure deterministic `ScopeComparator` engine.
  Why now: Proves the unique kernel and riskiest assumption first before building any UI scaffolding, ensuring the classification logic is bulletproof.
  PRD ref: `prd.md > 4.2 Comparison Engine`, `prd.md > 7. What We're Building`
  Spec ref: `spec.md > 3. Technology Stack`, `spec.md > 6. Comparison Engine Specification`, `spec.md > 9. Gate 1: The 12 Synthetic Kill-Test Cases`
  Build: Scaffold Next.js App Router with TypeScript and Tailwind CSS, install Vitest and Zod, implement `src/lib/comparator/deterministic.ts` with tokenizer, stopwords, n-grams, and novel entity detection, and codify all 12 kill-test cases in `tests/unit/comparator.test.ts`.
  Verify (mechanical): Run `npx vitest run tests/unit/comparator.test.ts` and confirm all 12 synthetic test cases pass with zero failures.
  Learner check: Inspect the test report and verify that in-scope requests, out-of-scope additions (Twilio SMS, mobile app), and ambiguous cases evaluate exactly as specified.
  Commit: `Bootstrap project and verify comparison engine with 12 kill tests`

- [x] **2. Brief ingestion, parsing, and baseline approval**
  Becomes usable: A running web workspace where a developer can enter a project name, paste a client brief (or load realistic demo data), see it parsed into editable cards, add/edit/delete items, and click "Approve Baseline v1.0" to lock it into immutable storage.
  Why now: The approved baseline is the anchor for all downstream comparisons; without an approved baseline, incoming requests cannot be evaluated.
  PRD ref: `prd.md > 1. The Core Journey` (steps 1-3), `prd.md > 4.1 Brief Ingestion & Baseline Establishment`
  Spec ref: `spec.md > 1. How This Works, In Plain Language`, `spec.md > 7. Data Model and Storage Schema (Zod)`
  Build: Implement `briefParser.ts`, Zod storage repository in `repository.ts`, `BriefIngestModal.tsx`, and the left `BaselinePanel.tsx` inside the single-page split-view layout with Linear dark styling.
  Verify (mechanical): Run `npx vitest run tests/unit/parser.test.ts tests/unit/storage.test.ts`; start dev server and confirm the baseline displays with approved status in the browser.
  Learner check: Open `http://localhost:3000`, paste a brief with bullet points, edit an item, click "Approve Baseline v1.0", and confirm the items lock with the `Baseline v1.0 • Approved` badge.
  Commit: `Add brief parsing and baseline approval flow`

- [x] **3. Request comparison and decision logging (Vertical Slice Complete)**
  Becomes usable: The right panel is fully operational: the developer pastes a client request, clicks "Compare", sees the assigned status pill (`IN_SCOPE`, `POSSIBLE_CHANGE`, `NEEDS_REVIEW`), matched item tags, plain-language rationale, and uncertainty note, and records `Accept`, `Reject`, or `Clarify` with an optional note, immediately streaming it into the History feed.
  Why now: Completes the full end-to-end core loop of ScopeLock—from baseline to request comparison to recorded human decision.
  PRD ref: `prd.md > 1. The Core Journey` (steps 4-6), `prd.md > 4.2 Comparison Engine`, `prd.md > 4.3 Human Decision Logging`
  Spec ref: `spec.md > 2. The Core Journey Through the System`, `spec.md > 6. Comparison Engine Specification`
  Build: Implement `RequestInput.tsx`, `ComparisonCard.tsx`, and `HistoryFeed.tsx`, wiring them to `ScopeComparator` and `repository.ts`.
  Verify (mechanical): Run Vitest tests verifying request evaluation and decision record persistence; run dev server and verify UI interaction without console errors.
  Learner check: Paste an in-scope request ("Stripe payment") and an out-of-scope request ("SMS receipts via Twilio"), check the badges and rationales, record a decision with a note, and see it appear in the History list.
  Commit: `Complete request comparison and decision logging slice`

- [x] **4. Baseline versioning, refresh persistence, and export/reset**
  Becomes usable: Full audit integrity and data portability: editing the baseline creates a draft and bumps to `v2.0` upon approval while preserving past decisions tied to `v1.0`; the workspace survives browser refresh; "Export JSON" downloads project data; "Reset Project" safely purges data after modal confirmation.
  Why now: Fulfills the audit durability guarantee, handles browser reloads, and ensures data safety without risk of silent corruption.
  PRD ref: `prd.md > 1. The Core Journey` (steps 7-8), `prd.md > 4.4 Baseline Evolution & Versioning`, `prd.md > 5. States and Boundaries`
  Spec ref: `spec.md > 2. The Core Journey Through the System`, `spec.md > 10. Important Failure Modes and Fallbacks`
  Build: Implement baseline version draft/bump flow in `BaselinePanel.tsx`, export/reset handlers in `Header.tsx` and `ResetConfirmModal.tsx`, and defensive corrupt-storage recovery in `repository.ts`.
  Verify (mechanical): Run unit tests for version bumping and storage recovery; simulate page reload and verify all data persists intact.
  Learner check: Edit the baseline to bump to v2.0, verify historical decisions still display "v1.0", refresh the browser, export the JSON file, and test the reset confirmation modal.
  Commit: `Add baseline versioning, refresh persistence, export, and reset controls`

## Hands-on Checkpoints

- [x] Early usable behavior explored — Slice 2 (Brief Ingestion & Baseline Approval verified in browser)
- [x] Final kick-the-tires exploration and feedback completed — Slice 4 (Complete end-to-end testing of baseline bump, comparison, decision history, and export)

## Final Review

- [x] Final review complete — feedback resolved and learner confirms ready to ship

## Code Tour and App Map

- [x] Learning activity complete — guided route, focused alternative, prior practice connected, or brief recap
- [x] Optional edit and transfer reflection addressed — offered/declined/already covered/not applicable as appropriate
- [x] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence: Focused alternative connecting the learner's goal (directing and verifying an agent) to the Gate 1 Kill-Test execution in `tests/unit/comparator.test.ts`. Automated tests revealed initial tokenization gaps, which were fixed and verified with 100% passing results before UI integration.
Route and stops: 1. `src/components/RequestInput.tsx` → 2. `src/lib/comparator/deterministic.ts` → 3. `src/lib/storage/repository.ts`.
Edit outcome: Removed and disabled Next.js dev overlay indicators via `next.config.mjs` and `src/app/globals.css`.
Reflection: Addressed through the practice of defining executable verification contracts (Vitest suites) before UI scaffolding.
Activity mode: Live app and generated standalone companion map (`devpost/app-map.html`).

## Revisions
