# ScopeLock — Agent-Ready Build Plan

**Purpose:** A practical, evidence-driven implementation plan for the Build With AI: Basics hackathon.

**Product thesis:** ScopeLock helps freelance developers and small studios turn a client brief into an explicit, human-approved scope baseline, then review later requests against that baseline so potential scope changes are visible before work expands.

**Core build principle:** Prove the riskiest assumption before polishing the product. Build one complete vertical slice, test it with realistic examples, and report only evidence-backed results.

---

# 0. FIRST STEP — CRITICAL INSTRUCTIONS FOR THE CODING AGENT

**Read and follow this section before writing any application code. These instructions take priority over shortcuts or assumptions.**

1. **Use the official Devpost Learn Skill Pack first.** In a new, empty project folder, run:
   ```bash
   npx skills add challengepost/learn-ai-basics --all -y
   ```
   Inspect the installed skill files and follow their prescribed sequence: `1-start → 2-scope → 3-prd → 4-spec → 5-build → 6-ship`. Do not claim a skill was used if it was not.

2. **Create the required planning artifacts before implementation.** Use the skill workflow to create and review `scope.md`, `prd.md`, and `spec.md`, preferably under `devpost/`. Keep these documents consistent with one another and with this plan. Resolve contradictions before coding.

3. **Treat the human as product owner.** Do not silently make high-impact product decisions. Surface trade-offs, assumptions, scope cuts, data-handling choices, and blocking questions for human approval. For non-blocking decisions, record a conservative assumption and continue.

4. **Follow the Prove-It sequence; do not jump straight to UI.** Use:
   `PROBLEM → THESIS → KILL-TEST → PROOF DESIGN → VERTICAL SLICE → BREAK → PROVE → EXPLAIN → MARKET`
   Test the core classification experience before expanding features. If the statuses or explanations are confusing or unreliable, revise or stop before adding polish.

5. **Keep the MVP deliberately small.** Do not add authentication, payments, team workspaces, external LLM/API calls, contract generation, legal advice, or a backend database unless the human approves a justified change.

6. **Never make unsupported claims.** Do not claim tests passed, users validated the idea, security is guaranteed, or the app is production-ready without evidence. Label checks `VERIFIED`, `FAILED`, `NOT TESTED`, or `ASSUMED`. Never turn a planned test into a claimed result.

7. **Protect user data.** Treat client briefs and follow-up requests as potentially confidential. For the MVP, process data in the browser and store it locally only. Do not transmit or log brief contents. Include a clear delete/reset action. ScopeLock is not legal advice and does not determine contractual rights.

8. **Use disciplined engineering.** Inspect the existing environment before installing packages. Prefer TypeScript, small components, schema validation, deterministic rules, and tests. Avoid unnecessary dependencies. The MVP should require no API keys or environment secrets.

9. **Make the project judgeable from a clean start.** It must work without login, paid services, or private credentials. Provide public source, setup instructions, an open-source license, planning artifacts, and a public demo video under three minutes showing the real working app.

10. **Document limitations honestly.** Mark incomplete features as incomplete. Record known browser, persistence, accessibility, and edge-case limitations. Prefer a smaller reliable vertical slice over a broad, broken feature set.

11. **The participant owns the final Devpost submission text.** The coding agent may help prepare technical notes, but the participant must personally write the final project name, description, and submission answers; the skill pack guidance permits AI only to correct spelling and grammar in those fields.

---

# 1. Problem, User, and Thesis

- **Primary user:** Freelance software developers and small development studios handling client requests through chat, email, or documents.
- **Problem:** The original agreement is often vague or scattered. Follow-up requests arrive casually, making it difficult to see whether they fit the agreed work or add scope.
- **Thesis:** A scope baseline plus transparent comparison and a decision log can make scope changes easier to discuss before work expands.
- **Non-goal:** ScopeLock does not interpret law, determine contractual rights, or replace a signed statement of work.

# 2. Prove-It Build Plan

Each phase should produce evidence before the next phase expands the build.

## PROBLEM
Write a one-paragraph problem statement. Name the first user, when the pain occurs, and what they do today instead.

## THESIS
State the testable claim: users can compare a new request with an approved baseline and understand why it may represent a scope change.

## KILL-TEST
Before building the full app, create at least 12 synthetic cases:
- Clearly in-scope requests
- Clearly out-of-scope requests
- Ambiguous requests
- Mixed requests that combine in-scope and new work

Label each case with its expected status and rationale. If 3–5 target users are available, ask them to classify the cases and explain uncertainty. Never invent participants or outcomes. If no users are available, label this an **internal heuristic test**, not user validation.

## PROOF DESIGN
Define success before testing. For each case:
- The app must show a rationale tied to the baseline.
- Ambiguous cases must route to `NEEDS_REVIEW`.
- The user must be able to override every suggestion.
- No result may be framed as a legal conclusion.
- Actual misses and confusing explanations must be recorded.

## VERTICAL SLICE
Build one complete end-to-end path:
1. Enter a client brief.
2. Create and edit scope items.
3. Explicitly approve the baseline.
4. Enter a follow-up request.
5. View the comparison status and rationale.
6. Accept, reject, or request clarification.
7. Review the decision history.
8. Refresh the page and confirm local persistence.

## BREAK
Test missing baseline, empty input, very long text, repeated requests, contradictory language, HTML/script-like text, browser refresh, corrupted local storage, delete/reset, and narrow/mobile layouts.

## PROVE
Run unit, integration, and browser-level tests. Manually test the critical journey in a clean browser profile. Record actual evidence, failures, skipped tests, and limitations.

## EXPLAIN
Explain the problem, statuses, deterministic logic, where human judgment is required, and known limits. The demo should show the working app rather than slides alone.

## MARKET
If target users are available, test whether they would use ScopeLock on a real brief and what they would trust. Record actual feedback separately from builder assumptions.

---

# 3. MVP Functional Specification

## Required workflow

1. Create a local project/workspace with a user-supplied project name.
2. Paste a client brief. Offer editable scope items using transparent deterministic heuristics and manual add/edit/delete. If extraction is uncertain, ask the user to define or confirm items rather than pretending extraction is authoritative.
3. Show a review screen where the user edits the scope baseline and explicitly approves it. Store a version number and approval time locally.
4. Paste a follow-up request and compare it with the approved baseline.
5. Assign exactly one visible status:
   - `IN_SCOPE`
   - `POSSIBLE_CHANGE`
   - `NEEDS_REVIEW`
6. Show the matched baseline item(s), a plain-language rationale, and an uncertainty note. Do not imply statistically calibrated confidence.
7. Let the human record `ACCEPT`, `REJECT`, or `CLARIFY`, with an optional note.
8. Record the request, status, action, timestamp, and baseline version in local history.
9. Keep history. Editing an approved baseline must create a new version; it must not silently rewrite old decisions.
10. Provide user-initiated JSON and/or CSV export plus clear delete/reset controls. Do not transmit data.

## Status semantics

| Status | Meaning | Required behavior |
|---|---|---|
| `IN_SCOPE` | A clear match to an approved scope item. | Show the matched item; allow confirmation or override. |
| `POSSIBLE_CHANGE` | A plausible request for work not represented in the baseline. | Explain what appears new and require human review. |
| `NEEDS_REVIEW` | Evidence is ambiguous, contradictory, or insufficient. | Do not force a decision; explain uncertainty and request clarification. |

---

# 4. Technical Plan

- **Recommended stack:** Next.js App Router, React, TypeScript, Tailwind CSS (or the existing styling system), Zod for validation, Vitest for unit/integration tests, and Playwright for the main browser journey if setup remains lightweight.
- **Storage:** Versioned browser `localStorage` with defensive parsing. No secrets. Include export and clear-all. Handle unavailable or corrupted storage without crashing.
- **Decision logic:** Deterministic phrase/token matching with explicit, testable rules. Ambiguous cases must route to `NEEDS_REVIEW`. Do not add an LLM by default.
- **External services:** None required. No API keys, wallet, external database, analytics, or network transmission in the MVP. Any proposed external service needs a human-approved explanation of value, data flow, cost, and privacy trade-offs.
- **Environment variables:** None required for the proposed MVP. Never invent credentials or commit secrets.

# 5. Proposed Data Model

This is a proposed local schema, not an immutable requirement. Keep it simple and validate every read/write.

- **Project:** `id`, `name`, `createdAt`, `updatedAt`
- **BaselineVersion:** `id`, `projectId`, `versionNumber`, `sourceBrief`, `scopeItems[]`, `approvedAt`, `createdAt`
- **ScopeItem:** `id`, `title`, `description`, `acceptanceNotes`, `sourceText`, `userConfirmed`
- **Request:** `id`, `projectId`, `baselineVersionId`, `requestText`, `status`, `matchedScopeItemIds[]`, `rationale`, `uncertaintyNote`, `createdAt`
- **Decision:** `id`, `requestId`, `action` (`ACCEPT`/`REJECT`/`CLARIFY`), `note`, `decidedAt`

# 6. Acceptance Criteria

- A first-time user can complete the core workflow without signing in or supplying credentials.
- The approved baseline is visible and versioned; later baseline edits do not silently rewrite old decisions.
- Every comparison has a visible status, matched item(s) or a missing-match explanation, and rationale.
- Ambiguous cases route to `NEEDS_REVIEW`; users can override suggestions and record a decision.
- Decision history survives refresh in the same browser; export and clear/reset work.
- No brief/request content is sent to an external service in the MVP.
- Empty, long, malformed, and script-like input do not crash the app or execute as HTML.
- The app has a usable narrow-screen layout, keyboard-accessible controls, visible focus states, and status text not conveyed by color alone.
- Only tests actually run may be reported as passing; failures and skips must be disclosed.

# 7. Test Plan and Evidence

## Unit tests

- Clear in-scope, likely change, and ambiguous classifications.
- Empty baseline, duplicate items, overlapping terms, and contradictory requests.
- Schema validation, serialization, local-storage versioning, and corrupted-storage recovery.
- Baseline versioning and preservation of historical decisions.

## End-to-end tests

- Create project → paste brief → edit items → approve baseline.
- Add request → inspect status/rationale → override → save `ACCEPT`/`REJECT`/`CLARIFY`.
- Refresh → verify history remains → export → clear data.
- Run a mobile viewport and keyboard-only pass through the critical flow.

## Evidence log template

| Check | Expected | Actual evidence | Status |
|---|---|---|---|
| Baseline approval | Approved version saved | Record actual observation | PASS / FAIL / NOT RUN |
| Ambiguous request | `NEEDS_REVIEW` plus reason | Record actual observation | PASS / FAIL / NOT RUN |
| Refresh/history | Prior decision remains visible | Record actual observation | PASS / FAIL / NOT RUN |
| Privacy | No network transmission of brief/request content | Inspect network/devtools and record result | PASS / FAIL / NOT RUN |

# 8. UX and Presentation

- Use a calm, professional interface that feels like a practical project tool, not an AI-themed landing page.
- Make the primary action and next step obvious; avoid decorative complexity.
- Show the source brief, approved scope items, new request, matched evidence, status, rationale, and decision controls in a clear sequence.
- Explain statuses in plain language; use text/icons as well as color.
- Include synthetic demo data only when clearly labelled and resettable. Never present synthetic examples as customer results.

# 9. Build Order and Gates

1. **Gate 0 — Challenge compliance:** Install/use the official Devpost Learn Skill Pack. Produce `scope.md`, `prd.md`, and `spec.md`. Start from an empty project folder.
2. **Gate 1 — Kill-test:** Prepare 12+ labelled synthetic cases; test whether status definitions and explanations make sense. Record results honestly.
3. **Gate 2 — Foundation:** Set up the app, types, schemas, local persistence wrapper, and test harness. Avoid unnecessary dependencies.
4. **Gate 3 — Vertical slice:** Complete baseline approval through comparison and saved human decision.
5. **Gate 4 — Reliability:** Handle ambiguity, empty input, corrupted persistence, version history, export/reset, and failure states.
6. **Gate 5 — Usability:** Improve keyboard navigation, mobile layout, and copy only after the core slice works.
7. **Gate 6 — Ship:** Run tests; verify the clean-start flow; add README/setup instructions, an open-source license, public source, and a public demo under three minutes.

# 10. Hackathon Submission Checklist

- Recheck the current official Devpost deadline and eligibility.
- Publish a public repository with an OSI-approved license visible in the repository About section.
- Include the skill artifacts `scope.md`, `prd.md`, and `spec.md` (for example, in `/devpost`).
- README covers the problem, intended user, features, stack, local setup, tests, limitations, and privacy/data handling.
- Judges can access the project without paid gates or login; provide clear run instructions.
- Publish a YouTube/Vimeo demo under three minutes showing the real working app and one complete scenario.
- Distinguish implemented/tested features from planned work. Do not invent user feedback or metrics.
- The participant personally writes final Devpost project name, description, and submission answers; the agent may only correct spelling/grammar in those fields.

# 11. Product-Market Fit Questions

- **Initial segment:** Independent developers and small studios managing scope through email/chat without heavyweight project-management software.
- If possible, observe 3–5 target users classifying sanitized or synthetic requests. Do not request confidential client briefs for early tests.
- Test behavior, not compliments: can the user explain a flag, correct a wrong suggestion, and identify when they would use the tool?
- Ask whether they would use it per project, which workflow it must fit, and whether local-only storage is sufficient.
- Do not claim product-market fit from a few interviews. Record sample size and actual feedback with permission.

# 12. Final Handoff Prompt for the Coding Agent

> You are the implementation agent for ScopeLock. Before coding, follow Section 0 and the official Devpost Learn Skill Pack. Work in a new empty project folder. Produce `scope.md`, `prd.md`, and `spec.md` before implementation. Follow the Prove-It sequence and run the kill-test first. Implement only the local-first MVP: human-approved, versioned scope baseline; transparent deterministic comparison; `IN_SCOPE`, `POSSIBLE_CHANGE`, and `NEEDS_REVIEW`; human decision history; export and delete/reset. Use TypeScript and a lightweight Next.js/React stack unless the environment provides a strong reason otherwise. Do not add external APIs, LLM calls, auth, payments, or a backend database without human approval. Test the actual critical journey and maintain an evidence log. Do not claim anything was built, tested, validated, or shipped until it has been done and evidence recorded. Before finishing, report implemented features, commands run, actual test results, manual checks, known issues, privacy/data flow, changed files, and the next highest-risk gap.
