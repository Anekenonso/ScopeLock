---
doc: prd
status: approved
---

# ScopeLock — Product Requirements Document

A local-first scope protection engine that turns client briefs into approved, versioned baselines and compares new requests against them to make scope creep visible before work begins.
*Source:* `scope.md > Who It's For`, `scope.md > The Unique Kernel`.

---

## 1. The Core Journey

*Source:* `scope.md > The Core Loop`, `scope.md > What "Working" Looks Like`.

1. **Project Creation & Setup:** The developer lands on ScopeLock and names their local project.
2. **Brief Ingestion:** The developer pastes a client brief. ScopeLock parses bullet points/numbers into editable scope cards (or provides a fallback single item if unstructured).
3. **Baseline Review & Approval:** The developer adds, edits, or deletes items. They explicitly click **"Approve Baseline v1.0"**, locking the baseline into an immutable version.
4. **Request Ingestion & Comparison:** The developer pastes a follow-up client request and clicks **"Compare"**.
5. **Evaluation Display:** ScopeLock displays the matched scope items, assigns exactly one status (`IN_SCOPE`, `POSSIBLE_CHANGE`, or `NEEDS_REVIEW`), shows a plain-language rationale, and flags any uncertainty.
6. **Human Decision Logging:** The developer selects `Accept`, `Reject`, or `Clarify`, adds an optional note, and saves the decision.
7. **Audit Trail & Refresh:** The decision is logged to the History feed alongside the request, rationale, timestamp, and active baseline version ID. The state survives browser refreshes.
8. **Export / Reset:** The developer can export the complete project as JSON or perform a hard reset with a confirmation modal.

---

## 2. Screens and Layout

*Source:* `scope.md > The Core Loop`.

ScopeLock is organized as a **focused, single-page split-view workspace** so developers never lose sight of their agreed scope while evaluating requests:

* **Header Bar:** Project Name, Active Baseline Version badge (e.g. `Baseline v1.0 • Approved`), "Export JSON" button, and "Reset Project" button.
* **Left Panel (The Scope Anchor):**
  * Displays the active approved baseline scope items with IDs and descriptions.
  * An "Edit Baseline" action that puts items into draft mode for a subsequent version bump (e.g., `v2.0`).
  * Shows version selector if earlier baseline versions exist for historical audit.
* **Right Panel (The Request & Evaluation Surface):**
  * **Top Section — Request Input:** Textarea to paste incoming client requests and a primary "Compare" button.
  * **Middle Section — Comparison Result Card:** Rendered immediately upon comparison. Displays:
    * Status pill (`IN_SCOPE`, `POSSIBLE_CHANGE`, or `NEEDS_REVIEW`).
    * Clickable/readable matched baseline item tags.
    * Plain-language rationale explaining what matched or what is missing.
    * Explicit uncertainty note if evidence is insufficient.
    * Action bar: `Accept`, `Reject`, `Clarify` buttons and an optional note input field.
  * **Bottom Section / Tab — Decision History Feed:** Chronological audit log of all recorded decisions, showing request text, assigned status, human action, rationale, timestamp, and linked baseline version.

---

## 3. Look and Feel

*Source:* `scope.md > Inspiration & Identity`.

- **Visual Theme:** Dark-mode-first developer tool aesthetic inspired by Linear and Raycast.
- **Color Palette:**
  - Base Background: Deep charcoal / obsidian (`#0B0F19`, `#111827`).
  - Card Surfaces: Subtle slate with refined borders (`#1E293B`, border `rgba(255,255,255,0.08)`).
  - Accent / Primary: Clean sky blue / electric cyan (`#38BDF8`).
  - Status Emerald: `IN_SCOPE` (`#10B981`, badge background `rgba(16,185,129,0.15)`).
  - Status Amber: `NEEDS_REVIEW` (`#F59E0B`, badge background `rgba(245,158,11,0.15)`).
  - Status Rose/Violet: `POSSIBLE_CHANGE` (`#F43F5E` / `#8B5CF6`).
- **Typography:** High-contrast sans-serif (`Inter`) paired with clean monospace accents (`JetBrains Mono`) for version tags, IDs, and status pills.
- **Tone:** Professional, precise, evidence-grounded. Zero playful chatbot gimmicks.

---

## 4. Features and Behavior

### 4.1 Brief Ingestion & Baseline Establishment
* When the developer pastes a brief, ScopeLock deterministically parses list structures (bullets `-`, `*`, numbered lists `1.`, `2.`) into individual scope cards.
* If plain unstructured text is pasted, it populates a single editable card with an inline helper allowing the developer to split or manually add items.
* Developers can edit item titles, add acceptance notes, or delete items.
* Explicit click on **"Approve Baseline v1.0"** seals the baseline. It cannot be edited in place.

### 4.2 Comparison Engine
* Triggered deterministically by evaluating the request text against the active approved baseline items.
* Produces exactly one visible status:
  * `IN_SCOPE`: Strong keyword/token overlap with one or more approved items. Highlights matched item IDs.
  * `POSSIBLE_CHANGE`: Request contains actionable verbs/entities absent from the approved baseline. Explains what appears new.
  * `NEEDS_REVIEW`: Request is ambiguous, conflicting, or token evidence is inconclusive. Discloses uncertainty plainly.
* Rationale explicitly cites the baseline evidence (e.g. *"Matches Item #2 ('Stripe checkout') but introduces novel requirement 'SMS receipt via Twilio' not found in Baseline v1.0"*).

### 4.3 Human Decision Logging
* Clicking `Accept`, `Reject`, or `Clarify` captures:
  * `id`, `timestamp`, `requestId`, `requestText`, `status`, `matchedScopeItemIds`, `rationale`, `action`, `developerNote`, and `baselineVersionId`.
* On save: the decision is prepended to the History feed, the request input is cleared, and state is committed to local storage.
* If save fails: an inline error is displayed and the developer's input is preserved.
* Recording a decision does **not** alter the baseline.

### 4.4 Baseline Evolution & Versioning
* Clicking "Edit Baseline" opens a Draft editing state.
* The developer adjusts items and clicks **"Approve Baseline v2.0"**.
* Earlier decisions remain permanently linked to `v1.0`. Future comparisons evaluate against `v2.0`.
* A version filter in the history feed allows auditing decisions by the baseline version that governed them.

---

## 5. States and Boundaries

* **First Use / Empty State:** No project or baseline loaded. Clean empty state with a "Create Project" prompt and a sample "Load Realistic Demo Brief" option for immediate testing.
* **Draft State:** Scope items are editable; comparison is locked until baseline approval is granted.
* **Active State:** Baseline is locked and immutable; comparison input is enabled.
* **Corrupted / Invalid Storage:** If local storage data fails schema validation upon startup, display a non-destructive banner offering recovery or clean reset.
* **Persistence:** All projects, baseline versions, and decision logs persist in browser local storage. No network transmission.
* **Export State:** One-click download of `scopelock-backup-[projectName]-[date].json`.
* **Reset State:** Confirmation modal requiring explicit user confirmation before purging local project data.

---

## 6. Product Decisions

* **Split-View Single Page:** Chosen to eliminate context switching between scope definitions and client request evaluations.
* **Immutable Versioned Baselines:** Chosen over mutable baselines so historical decisions remain legally and chronologically accurate.
* **Deterministic Matching Heuristic:** Selected for MVP to guarantee transparent, predictable, offline-capable results without API keys or token costs.
* **Manual Trigger & Decision:** Chosen so the developer remains 100% in control—ScopeLock assists with evidence; the human makes the call.

---

## 7. What We're Building (POC Acceptance Criteria)

- [ ] Project setup with custom project name.
- [ ] Brief paste with deterministic bullet/number parsing into editable items, plus fallback single card.
- [ ] Explicit timestamped baseline approval as `v1.0`.
- [ ] Comparison engine assigning exactly one status: `IN_SCOPE`, `POSSIBLE_CHANGE`, or `NEEDS_REVIEW`.
- [ ] Result card displaying status badge, matched item pills, plain-language rationale, and uncertainty note.
- [ ] Decision recording (`Accept`, `Reject`, `Clarify`) with optional note, instantly appended to History feed.
- [ ] Baseline versioning (`v1.0` -> `v2.0`) where previous decisions stay anchored to their original version.
- [ ] Complete local persistence across browser reloads.
- [ ] Single-click JSON export and safe project reset modal.
- [ ] Dark-mode Linear/Raycast aesthetic with keyboard accessibility and mobile responsiveness.

---

## 8. Deferred From the POC

* **Browser Extension (V2):** Evaluating requests directly in Gmail or Upwork.
* **Slack / Discord Bot (V2):** Channel listeners for scope mentions.
* **Client Sign-off Portal (V3):** Public web link for clients to approve change orders.
* **Payment Deposits (V3):** Stripe integration for billing extra scope before work starts.

---

## 9. Non-Goals

* **No Automated Client Communication:** ScopeLock does not email or message the client.
* **No Legal Arbitration:** Does not issue legal verdicts or contractual guarantees.
* **No Server-Side Storage / Authentication:** Zero user logins, zero cloud database connections, 100% private on device.
