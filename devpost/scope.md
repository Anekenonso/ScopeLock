---
doc: scope
status: approved
---

# ScopeLock

A local-first scope protection tool that turns client briefs into approved baselines and compares new requests against them to make scope creep visible before work expands.

## The Unique Kernel
Unlike conversational AI that gives ungrounded opinions, ScopeLock anchors every incoming request to an explicit, human-approved baseline version, explains matches and gaps with evidence, and preserves an immutable local decision history.

## Who It's For
Freelance software developers and boutique development studios who manage project communications across email, chats, and calls, and struggle with casual, unpaid scope creep ("quick favor" requests) that dilute project margins.

## The Core Loop
1. Open ScopeLock and select/create a local project.
2. Establish a versioned scope baseline from the initial brief with human review and approval.
3. Paste an incoming client request and trigger comparison.
4. Review the matched baseline items, status (`IN_SCOPE`, `POSSIBLE_CHANGE`, `NEEDS_REVIEW`), and plain-language rationale.
5. Record a human decision (`ACCEPT`, `REJECT`, `CLARIFY`) with an optional rationale note.
6. Check the persistent decision history to track scope changes over time.

## Inspiration & Identity
- **Tone:** Calm, precise, professional, and audit-ready—a dependable developer utility rather than an AI marketing toy.
- **Aesthetic:** Dark mode first, high-contrast typography, clear status indicators (emerald for in-scope, amber for review, violet/rose for changes).
- **Core value:** Evidence over speculation, user in control at every gate.

## Why This Matters to the Learner
Mastering the discipline of directing and verifying an AI coding agent with a rigorous, plan-first methodology, while building a genuinely useful tool that solves a painful recurring problem in software client work.

## What "Working" Looks Like
A developer pastes a new client request into ScopeLock. The system instantly highlights which approved scope items are touched or what is missing from the baseline, flags the request as a potential scope change with a clear plain-language rationale, and lets the developer record a decision. The decision immediately persists into the local audit trail, surviving browser refreshes.

## The POC Boundary
- **Included in V1:**
  - Local project creation (stored in versioned `localStorage`).
  - Brief ingestion and editable scope items.
  - Explicit baseline versioning and timestamped human approval.
  - Transparent deterministic comparison engine assigning exactly one status: `IN_SCOPE`, `POSSIBLE_CHANGE`, or `NEEDS_REVIEW`.
  - Matched scope items, plain-language rationale, and uncertainty disclosure.
  - Decision logger (`ACCEPT`, `REJECT`, `CLARIFY`) with optional notes.
  - Historical audit log tied to baseline version.
  - JSON export and clean wipe/reset controls.
  - Defensive error handling, zero external credentials or network transmission.

## Later
- **ScopeLock V2:** Chrome extension for Gmail/Upwork/Slack inline detection; automated tactful pushback message generator.
- **ScopeLock V3:** Agency change-order signoff portal with Stripe payment deposits and multi-seat team workspaces.

## Explicitly Cut
- **User Accounts / Cloud Auth:** Cut to keep the hackathon PoC friction-free, instantly judgeable, and free of backend setup complexity.
- **Remote Database / Cloud Storage:** Cut to ensure 100% data confidentiality for sensitive client briefs and zero operational costs.
- **Legal Advice / Contract Generation:** Cut because ScopeLock is a project scope management tool, not legal counsel or contract arbitration.
- **Automated Client Messaging:** Cut to ensure the developer always retains full editorial and relationship control before communicating with clients.
