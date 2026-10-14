---
doc: spec
status: approved
---

# ScopeLock — Technical Specification

A local-first, zero-backend scope protection web application built with Next.js, TypeScript, and Zod. ScopeLock isolates a deterministic comparison engine tested against synthetic kill-test cases before connecting to a split-view workspace backed by versioned browser local storage.

---

## 1. How This Works, In Plain Language

*Source:* `prd.md > 1. The Core Journey`, `prd.md > 2. Screens and Layout`.

ScopeLock operates entirely inside the developer's browser. It has three core subsystems:

1. **Storage Layer (`src/lib/storage`):** Reads and writes strongly validated JSON structures to browser `localStorage` using Zod schemas. It manages project metadata, immutable baseline versions (`v1.0`, `v2.0`), and chronological decision logs.
2. **Comparison Engine (`src/lib/comparator`):** A pure, deterministic TypeScript module isolated from React and storage. Given a client request and an approved list of scope items, it tokenizes, normalizes, detects key actions/entities, and returns an evaluation containing exactly one status (`IN_SCOPE`, `POSSIBLE_CHANGE`, or `NEEDS_REVIEW`), matched item IDs, and a plain-language rationale.
3. **Workspace UI (`src/components`):** A single-page, split-view interface built with React and Tailwind CSS. The left column locks and displays the active baseline items. The right column handles request input, displays the comparison card, captures developer decisions (`Accept`, `Reject`, `Clarify`), and streams decisions into an audit history.

No data ever leaves the user's computer. There are no external API calls, tracking scripts, or server-side databases.

---

## 2. The Core Journey Through the System

*Source:* `prd.md > 1. The Core Journey`.

1. **User loads app:** `page.tsx` mounts → calls `StorageRepository.loadProject()`.
   * *If no project exists:* Renders empty state with "Create Project" or "Load Realistic Demo Brief".
   * *If corrupted data is found:* Zod safe-parsing triggers recovery banner without crashing.
2. **Brief Ingestion:** Developer inputs text → `briefParser.ts` converts bullet points/numbers into draft `ScopeItem[]`.
3. **Baseline Approval:** Developer clicks "Approve Baseline v1.0" → `StorageRepository.commitBaseline({ version: "v1.0", items })` is called. The baseline is marked immutable and active.
4. **Request Comparison:** Developer enters request and clicks "Compare" → `ScopeComparator.evaluate(requestText, activeBaseline.items)` executes synchronously.
5. **Evaluation Displayed:** The UI renders the result card displaying the status pill, matched tags, rationale, and uncertainty warnings.
6. **Decision Logged:** Developer clicks `Accept`, `Reject`, or `Clarify` with an optional note → `StorageRepository.recordDecision(decisionRecord)` appends the entry to `localStorage`, prepends it to the History feed, and resets the request textarea.
7. **Baseline Evolution:** Developer clicks "Edit Baseline" → creates a draft workspace. Approving the draft commits `v2.0`. All prior decisions remain permanently tied to `v1.0`.
8. **Export / Wipe:** Developer clicks "Export JSON" → generates a client-side JSON blob download. Clicking "Reset Project" prompts for confirmation before purging `localStorage`.

---

## 3. Technology Stack

*Source:* `prd.md > 6. Product Decisions`, `learner-profile.md > Demonstrated Technical and Agent Experience`.

| Layer | Technology | Version / Docs | Rationale & Tradeoffs |
|---|---|---|---|
| **Framework** | Next.js (App Router) | [Next.js Docs](https://nextjs.org/docs) | Production-standard, type-safe React framework. Client-only in V1; provides instant migration to server routes in V2/V3. |
| **Language** | TypeScript | [TypeScript Docs](https://www.typescriptlang.org/docs/) | Strict typing prevents state corruption and enforces schema contracts across storage and comparison. |
| **Validation** | Zod | [Zod Docs](https://zod.dev/) | Runtime defensive schema validation for all `localStorage` reads/writes and export/import operations. |
| **Styling** | Tailwind CSS | [Tailwind Docs](https://tailwindcss.com/docs) | Rapid, predictable utility styling implementing the Linear/Raycast dark theme without runtime CSS overhead. |
| **Icons** | Lucide React | [Lucide Docs](https://lucide.dev/) | Lightweight, accessible, consistent icons for status badges and actions. |
| **Unit Testing** | Vitest | [Vitest Docs](https://vitest.dev/) | Ultra-fast unit testing framework for verifying the 12 synthetic kill-test cases in pure Node/browser environments. |
| **E2E Testing** | Playwright | [Playwright Docs](https://playwright.dev/) | Verifies the complete browser journey (brief paste → baseline approval → compare → decision save → refresh). |

---

## 4. Where It Runs and How Someone Tries It

* **Runtime:** Local Node.js environment (Node 18+ or 20+).
* **Environment Variables:** None required (`.env` free).
* **Start Command:**
  ```bash
  npm install
  npm run dev
  ```
* **Local URL:** Open `http://localhost:3000` in any modern web browser (Chrome, Firefox, Safari, Edge).
* **Demo Recording Scenario:**
  1. Open app (starts clean or with demo brief).
  2. Paste a 3-bullet client brief and approve as `Baseline v1.0`.
  3. Enter an in-scope request (e.g. "Stripe checkout") → verify `IN_SCOPE`.
  4. Enter an out-of-scope request (e.g. "Send SMS receipt via Twilio") → verify `POSSIBLE_CHANGE` with rationale.
  5. Log `Reject` decision with note → verify it appears in History feed.
  6. Refresh browser → verify all data persists intact.
  7. Click "Export JSON" to show data portability.

---

## 5. Look and Feel Implementation

*Source:* `prd.md > 3. Look and Feel`.

* **Color Palette:**
  * Background Canvas: `#0B0F19` (Obsidian)
  * Card Surfaces: `#161E31` with `1px solid rgba(255, 255, 255, 0.08)` borders.
  * Primary Accent: `#38BDF8` (Sky blue)
  * Status In-Scope: `#10B981` (Emerald)
  * Status Needs-Review: `#F59E0B` (Amber)
  * Status Possible-Change: `#F43F5E` (Rose)
* **Typography:** `Inter` for UI body copy; `JetBrains Mono` for version pills, item IDs (`#1`, `#2`), and status badges.
* **Density:** High-density, compact developer tool layout. Clear visual hierarchy with zero conversational chat bubbles.

---

## 6. Comparison Engine Specification (`ScopeComparator`)

*Source:* `prd.md > 4.2 Comparison Engine`.

The comparator implements a pure, isolated interface:

```typescript
export interface ComparisonResult {
  status: "IN_SCOPE" | "POSSIBLE_CHANGE" | "NEEDS_REVIEW";
  matchedItemIds: string[];
  rationale: string;
  uncertaintyWarning?: string;
  confidenceScore: number; // internal heuristic score 0-1
}

export interface ScopeComparator {
  evaluate(request: string, baselineItems: ScopeItem[]): ComparisonResult;
}
```

### Matching Algorithm (Pure Deterministic Heuristic):
1. **Normalization:** Lowercase, strip punctuation, remove common conversational filler ("can we also", "could you please add", "is it possible to").
2. **Tokenization & N-Grams:** Extract unigrams and bigrams from both the request and each baseline item (`title` + `description` + `acceptanceNotes`).
3. **Keyword Overlap Scoring:** Calculate Jaccard similarity and token intersection for each baseline item.
4. **Action & Vendor Extraction:** Identify novel external services, vendors, or capabilities not found in any approved baseline item (e.g., `["twilio", "sms", "export", "pdf", "mobile app", "multi-language", "dark mode"]`).
5. **Classification Rules:**
   * If novel vendor/action detected AND no direct baseline item match → `POSSIBLE_CHANGE`.
   * If significant token overlap (score >= 0.45) with approved item and zero conflicting novel actions → `IN_SCOPE`.
   * If partial overlap (0.20 <= score < 0.45) OR conflicting terms (matches an item but introduces new entities) → `NEEDS_REVIEW` with an explicit uncertainty warning.
   * If minimal/zero overlap (score < 0.20) → `POSSIBLE_CHANGE`.

---

## 7. Data Model and Storage Schema (Zod)

*Source:* `prd.md > 1. The Core Journey`, `prd.md > 4.4 Baseline Evolution`.

```typescript
import { z } from "zod";

export const ScopeItemSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  description: z.string().default(""),
  acceptanceNotes: z.string().optional(),
  userConfirmed: z.boolean().default(true),
});

export const BaselineVersionSchema = z.object({
  id: z.string(),
  versionNumber: z.string(), // e.g., "v1.0", "v2.0"
  items: z.array(ScopeItemSchema),
  sourceBrief: z.string(),
  approvedAt: z.string(), // ISO date
});

export const DecisionRecordSchema = z.object({
  id: z.string(),
  requestId: z.string(),
  requestText: z.string(),
  status: z.enum(["IN_SCOPE", "POSSIBLE_CHANGE", "NEEDS_REVIEW"]),
  matchedItemIds: z.array(z.string()),
  rationale: z.string(),
  uncertaintyWarning: z.string().optional(),
  action: z.enum(["ACCEPT", "REJECT", "CLARIFY"]),
  note: z.string().optional(),
  baselineVersionId: z.string(),
  baselineVersionNumber: z.string(),
  decidedAt: z.string(), // ISO date
});

export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  activeBaselineId: z.string().nullable(),
  baselines: z.array(BaselineVersionSchema),
  draftItems: z.array(ScopeItemSchema).default([]),
  decisions: z.array(DecisionRecordSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type ScopeItem = z.infer<typeof ScopeItemSchema>;
export type BaselineVersion = z.infer<typeof BaselineVersionSchema>;
export type DecisionRecord = z.infer<typeof DecisionRecordSchema>;
export type Project = z.infer<typeof ProjectSchema>;
```

---

## 8. Planned File Structure

```
ScopeLock/
├── .gitignore
├── package.json
├── tsconfig.json
├── next.config.mjs
├── tailwind.config.ts
├── vitest.config.ts
├── playwright.config.ts
├── devpost/                         # Devpost learning artifacts
│   ├── learner-profile.md
│   ├── scope.md
│   ├── scope.html
│   ├── prd.md
│   ├── prd.html
│   ├── spec.md
│   └── spec.html
├── src/
│   ├── app/
│   │   ├── layout.tsx               # Root layout & Inter/JetBrains fonts
│   │   ├── page.tsx                 # Main single-page split-view workspace
│   │   └── globals.css              # Obsidian dark theme & utility classes
│   ├── components/
│   │   ├── Header.tsx               # Project title, active version pill, Export/Reset
│   │   ├── BaselinePanel.tsx        # Left panel: active baseline items, draft editor
│   │   ├── RequestInput.tsx         # Textarea & Compare button
│   │   ├── ComparisonCard.tsx       # Status pill, matched tags, rationale, Accept/Reject/Clarify
│   │   ├── HistoryFeed.tsx          # Chronological audit feed with baseline badges
│   │   ├── BriefIngestModal.tsx     # Initial brief paste & parse modal
│   │   └── ResetConfirmModal.tsx    # Safe wipe confirmation dialog
│   ├── lib/
│   │   ├── comparator/
│   │   │   ├── index.ts             # ScopeComparator interface & factory
│   │   │   ├── deterministic.ts     # Heuristic tokenizer, keyword & rule engine
│   │   │   └── rules.ts             # Vendor list, action verbs, stop words
│   │   ├── storage/
│   │   │   ├── schema.ts            # Zod schemas & TypeScript types
│   │   │   └── repository.ts        # Safe localStorage wrapper with migration & export
│   │   ├── parser/
│   │   │   └── briefParser.ts       # Bullet point & list extraction logic
│   │   └── fixtures/
│   │       ├── demoProject.ts       # Realistic demo brief and items
│   │       └── killTestCases.ts     # 12 synthetic cases with expected outcomes
│   └── types/
│       └── index.ts
└── tests/
    ├── unit/
    │   ├── comparator.test.ts       # Automated execution of 12 synthetic kill-tests
    │   ├── storage.test.ts          # Zod validation & corrupt storage recovery
    │   └── parser.test.ts           # List parsing and fallback card extraction
    └── e2e/
        └── critical-journey.spec.ts # Full Playwright browser walkthrough
```

---

## 9. Gate 1: The 12 Synthetic Kill-Test Cases

*Source:* `ScopeLock_Agent_Build_Plan.md > Gate 1`, `prd.md > 4.2 Comparison Engine`.

The test suite in `tests/unit/comparator.test.ts` will strictly enforce these 12 cases against `deterministic.ts`:

| # | Request Text | Approved Baseline Context | Expected Status | Expected Matched Item |
|---|---|---|---|---|
| **1** | "Can you implement user login with email and password?" | `#1: User Auth (email/password)` | `IN_SCOPE` | `#1` |
| **2** | "We need a checkout page for Stripe credit card payments." | `#2: Stripe checkout integration` | `IN_SCOPE` | `#2` |
| **3** | "Can users view their past order history and invoices?" | `#3: Order history & invoice downloads` | `IN_SCOPE` | `#3` |
| **4** | "Can we also send SMS receipts via Twilio when someone buys?" | `#2: Stripe checkout integration` | `POSSIBLE_CHANGE` | `#2` (flagged novel vendor: Twilio/SMS) |
| **5** | "We'd like to build an iOS and Android mobile app version." | Web app baseline only | `POSSIBLE_CHANGE` | None (novel platform: mobile) |
| **6** | "Please add multi-currency conversion with live forex rates." | `#2: Stripe checkout in USD` | `POSSIBLE_CHANGE` | `#2` (novel feature: multi-currency) |
| **7** | "Could we export monthly reports to Excel or PDF format?" | `#3: Order history table on screen` | `POSSIBLE_CHANGE` | `#3` (novel export format: PDF/Excel) |
| **8** | "Make sure the buttons look good." | General styling | `NEEDS_REVIEW` | Ambiguous / insufficient evidence |
| **9** | "Is the checkout fast?" | `#2: Stripe checkout integration` | `NEEDS_REVIEW` | Performance inquiry / non-feature request |
| **10** | "Add social login via Google and GitHub." | `#1: User Auth (email/password)` | `NEEDS_REVIEW` | Partial match with auth, but novel OAuth providers |
| **11** | "Include dark mode support across all screens." | Visual styling baseline | `POSSIBLE_CHANGE` | Novel theme capability |
| **12** | "" (Empty / whitespace text) | Any baseline | `NEEDS_REVIEW` | Empty input validation |

---

## 10. Important Failure Modes and Fallbacks

1. **Storage Quota Exceeded or Private Browsing Block:**
   * *Fallback:* Display a graceful notification alerting the user that local storage is unavailable or full; provide inline manual JSON export so data is not lost.
2. **Corrupted / Outdated Local Storage Data:**
   * *Fallback:* Zod `safeParse` fails gracefully → shows a "Data Recovery" banner allowing user to download raw data or initialize fresh state without unhandled JavaScript exceptions.
3. **Ambiguous or Adversarial Prompt Text:**
   * *Fallback:* All unclassifiable, highly conflicting, or unparseable text defaults safely to `NEEDS_REVIEW`.

---

## 11. Decisions and Open Issues

* **Next.js App Router Chosen:** Selected for production-standard structure and future V2/V3 expansion while remaining 100% client-side in V1.
* **Deterministic Comparator Before UI:** Selected to ensure the core value proposition is verified with 12 unit tests before spending effort on layout.
* **One Identified Uncertainty & Investigation:** The user's primary learning goal is mastering agent direction and verification. We will establish a strict protocol in `5-build`: the agent must run the Vitest test suite against `killTestCases.ts`, provide the raw test output, and await human sign-off before proceeding to the UI.
