# Startup Architecture Status

**Last updated:** July 19, 2026  
**Project:** Octagon HQ startup reliability cleanup  
**Primary contract:** [`docs/startup-architecture.md`](./startup-architecture.md)

## How to resume this project in any new chat

Use this instruction:

> Continue the Octagon HQ startup architecture project. Read `docs/startup-architecture-status.md`, `docs/startup-architecture.md`, and the master GitHub issue before changing anything. Preserve the exact current app experience and continue from the documented next action.

This file is the source of truth for current phase, completed work, blockers, and the exact next action. Update it at the end of every meaningful work session.

## Current state

- **Phase 0 — Freeze and measure:** Complete.
- **Phase 1 — Make every startup owner idempotent:** In progress.
- **Live production runtime:** Unchanged by Phase 1 work so far.
- **Active runtime draft:** PR #100, `agent/startup-singleton-guards-v2`.
- **Superseded draft:** PR #99, closed without merge.

## Completed protection work

- Added the non-negotiable zero-visible-change startup contract.
- Added the Startup Architecture Gate workflow.
- Added static checks for duplicate local script sources and critical startup load order.
- Added browser checks for:
  - iOS standalone cold startup;
  - stale Picks URL normalization;
  - Picks continuation routing;
  - lifecycle stability after `pagehide` and `pageshow`;
  - profile sign-in startup stability;
  - delayed Home and community stability;
  - duplicate shell and active-view detection.
- Created clean draft PR #100 with only singleton guards and test assertions.

## Phase 1, Batch 1

### Purpose

Make the two route-startup controllers safe if accidentally executed more than once.

### Files

- `assets/js/fresh-home-route-bootstrap.js`
- `assets/js/fresh-home-launch.js`
- `scripts/test-startup-contract.mjs`

### Runtime difference

- Six guard lines total.
- No deletions.
- No version-marker changes.
- No cache, timing, route, visual, data, or product changes.

### Validation results

Passed:

- Startup JavaScript syntax.
- Startup ownership and load-order contract.
- iOS standalone startup and lifecycle test.
- Profile sign-in startup test.
- Delayed Home and community stability test.
- Phase 4B mobile/profile/Picks validation.

Existing unrelated red checks:

- Scoring architecture guardrail contains outdated 73-fighter expectations while production is at 80.
- Production browser smoke currently stops at a fighter-photo-path audit before rendered startup or ranking checks run.

These existing failures were not caused by PR #100 and are not being mixed into its runtime diff.

## Safety rule

No startup runtime PR reaches `main` until:

1. its startup-specific tests pass;
2. its diff is reviewed as one isolated ownership change;
3. existing unrelated red checks are understood and documented;
4. iPhone installed-app behavior is physically checked when routing, caching, lifecycle, sign-in, or native navigation is involved;
5. a rollback commit or branch is clear.

## Exact next action

1. Finish the Phase 1 startup-owner inventory.
2. Classify every startup script as:
   - already idempotent;
   - needs a singleton guard;
   - intentionally repeatable;
   - compatibility-only and scheduled for a later phase.
3. Do not add more runtime changes to PR #100.
4. After the inventory is complete, decide whether Batch 1 is ready for physical iPhone verification and merge, or whether a separate baseline-test maintenance PR is required first.

## Phase progress

| Phase | Status | Goal |
|---|---|---|
| 0. Freeze and measure | Complete | Contract, tests, ownership rules, rollback discipline |
| 1. Idempotent startup owners | In progress | Duplicate execution becomes harmless |
| 2. Remove duplicate ownership | Not started | One owner for route, identity, notifications, and refreshes |
| 3. Retire repair loops | Not started | Fix source renderers and remove compatibility repairs one at a time |
| 4. Reduce startup work | Not started | Lazy-load noncritical route-specific systems without visible change |
| 5. Simplify script manifest | Not started | Remove superseded files and leave one readable ordered manifest |

## Session log

### July 19, 2026

- Audited the startup stack and identified patch-on-patch risk as the main product weakness.
- Corrected scope: Divisions are complete, Rankings stay as designed, and War Room is open.
- Locked the project to startup reliability only.
- Added Phase 0 contract and test gate.
- Opened PR #100 for Phase 1 Batch 1.
- PR #100 startup-specific browser checks passed.
- Left PR #100 unmerged while documenting unrelated baseline check failures.
