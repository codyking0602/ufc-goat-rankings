# Phase 2 Duplicate-Ownership Progress — 2026-07-21

This file records the current Phase 2 production sequence after the older status documentation fell behind the runtime work.

## Current production position

- Production `main`: `cc75ef4371196ea89a79aa7ff14f759a252a4dd4`.
- Entire startup cleanup: approximately 86% complete.
- Phase 2: approximately 92% complete.
- Phase 0 and Phase 1: complete.
- Visible product change: none intended or approved.

## Completed Phase 2 sequence

| PR | Narrow responsibility | Result |
|---:|---|---|
| #125 | Document primary route ownership before runtime removal | Audit merged |
| #127 | Record failed proof that rejected unsafe listener removal | Stop condition documented |
| #128 | Queue recovery-window navigation in the canonical shell | Merged and physically verified |
| #129 | Remove legacy `app.js` primary-tab activation | Merged and physically verified |
| #130 | Document identity/profile ownership | Audit merged |
| #131 | Delegate Picks returning-member login to `UFC_PLAY_PROFILE` | Merged |
| #132 | Remove Community-owned shared Picks access and route synchronization | Merged |
| #133 | Remove Product-owned canonical profile access persistence | Merged |
| #134 | Remove notification-owned canonical storage and editor resolution | Merged |
| #135 | Prevent duplicate Product startup profile handoff | Merged |
| #136 | Make App Profile the single full group-snapshot owner | Merged |
| #137 | Make profile-challenge inbox a passive identity consumer | Merged |
| #138 | Make Community Profiles a passive identity consumer | Merged |
| #139 | Make Home daily synchronization a passive identity consumer | Merged |
| #140 | Make notification settings fully passive during startup | Merged |
| #141 | Make Picks social profile/reminders a passive identity consumer | Merged |
| #143 | Make Picks season loading a passive identity consumer | Merged |
| #144 | Repair a stale Home static-proof boundary | Test-only merge |
| #145 | Make War Room message board a passive identity consumer | Merged as `52aef7a0b24d9cc06a891b3e4f23a457bd4b6b02` |
| #146 | Make War Room access panel a passive identity consumer and coalesce access checks | Merged as `cc75ef4371196ea89a79aa7ff14f759a252a4dd4` |

## Current canonical identity boundary

`assets/js/play-profile-identity.js` owns:

- current and legacy shared login RPC selection;
- credential verification;
- resolved identity cache;
- group/member/admin/room access persistence;
- active-group/display-name persistence;
- canonical readiness publication;
- explicit `require()` behavior.

Passive consumers use cached identity and readiness/update events. They do not independently resolve identity, read canonical access storage, publish readiness, or trigger the visible profile editor merely to obtain identity.

## Permanent ownership proofs added during Phase 2

Startup Architecture Gate now protects:

- canonical shell recovery and sole route activation;
- canonical login delegation;
- Community access and identity ownership;
- Product access persistence and one startup handoff;
- App Profile single group snapshot;
- Home daily passive identity;
- profile-challenge passive inbox loading;
- notification passive identity;
- Picks social passive identity;
- Picks season passive identity;
- War Room board passive identity;
- War Room access passive identity and one access-status request owner;
- iOS route stability;
- profile sign-in stability;
- delayed Home/community stability.

## PR #146 validation record

- Fully tested runtime/test head: `f5429e69e13643f2af9275a7813cf0842f2fc89d`.
- Final PR head: `8b16e6cca8dd49e280fe065c1a00206cb03445bc`.
- Final-head delta: generated timestamp only in `octagon-verdict-knowledge.md`.
- Startup Architecture Gate #125: passed completely on unchanged rerun.
- Production merge: `cc75ef4371196ea89a79aa7ff14f759a252a4dd4`.
- Physical iPhone checkpoint: not required; targeted mobile proof and full gate left no unresolved physical-only uncertainty.

The first access-proof attempt found a selector mistake in the proof: the document-level version marker was counted as a second panel. The runtime behavior was correct. The selector was narrowed to the actual panel `<section>`, and the complete unchanged gate passed. A separate unchanged run briefly hit the existing shell-recovery navigation flake; the unchanged rerun passed.

## CI-first physical-test rule

After more than 25 consecutive Normal installed-iPhone results, routine physical checkpoints were retired.

The default merge evidence is now:

1. focused static ownership contract;
2. focused Playwright/mobile-browser ownership proof;
3. complete Startup Architecture Gate;
4. exact base/head verification;
5. inspection of unrelated red workflows;
6. proof that any later automated `main` movement does not overlap the isolated change.

Request a physical test only when a named uncertainty remains that automation cannot resolve.

## Known unrelated reds

The following established failures are not startup-owner blockers unless they directly reference the isolated changed files:

- fighter-photo path/render auditing in Production Ranking Browser Smoke;
- stale roster/rank or calculated-runtime certification in Pipeline/Snapshot;
- existing permanent source/runtime diagnostics in Scoring Architecture Guardrails;
- historical hard-pinned architecture expectations in Validate Phase 4B Preview;
- existing Picks UI/static-product contract findings.

## Remaining Phase 2 work

The strongest next production-loaded candidate is `assets/js/octagon-notifications.js`, but it must be audited rather than presumed incorrect.

Trace:

- canonical/editor resolver calls;
- canonical token storage reads or writes;
- readiness/update listeners;
- startup timers;
- visibility and online handling;
- notification RPC ownership;
- duplicate or unguarded refresh paths;
- explicit user-action boundaries.

After that audit, inspect remaining refresh/lifecycle candidates one narrow responsibility at a time. Do not begin broad Phase 3 repair-loop retirement until Phase 2 has no unproved competing owner.
