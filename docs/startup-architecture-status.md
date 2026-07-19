# Startup Architecture Status

**Last updated:** July 19, 2026  
**Project:** Octagon HQ startup reliability cleanup  
**Master tracker:** [GitHub issue #101](https://github.com/codyking0602/ufc-goat-rankings/issues/101)  
**Primary contract:** [`docs/startup-architecture.md`](./startup-architecture.md)

## How to resume this project in any new chat

Use this instruction:

> Continue the Octagon HQ startup architecture project. Read `docs/startup-architecture-status.md`, `docs/startup-architecture.md`, `docs/startup-architecture-plan.md`, `docs/startup-architecture-inventory.md`, `docs/startup-architecture-decisions.md`, and GitHub issue #101 before changing anything. Preserve the exact current app experience and continue from the documented next action.

This file is the source of truth for current phase, completed work, blockers, and the exact next action. Update it at the end of every meaningful work session.

## Current state

- **Phase 0 — Freeze and measure:** Complete.
- **Phase 1 — Make every startup owner idempotent:** In progress.
- **Phase 1 inventory:** Complete for Tier 1 and Tier 2 startup owners.
- **Live production runtime:** Unchanged by Phase 1 work so far.
- **Active runtime draft:** PR #100, `agent/startup-singleton-guards-v2`.
- **Master tracker:** Issue #101.
- **Superseded draft:** PR #99, closed without merge.

## Durable documentation now on `main`

- `docs/startup-architecture.md` — contract and phase outline.
- `docs/startup-architecture-plan.md` — detailed execution plan and exit criteria.
- `docs/startup-architecture-status.md` — current state and exact next action.
- `docs/startup-architecture-inventory.md` — owner-by-owner Phase 1 audit.
- `docs/startup-architecture-decisions.md` — locked decisions.
- `docs/startup-architecture-handoff.md` — cross-chat continuation procedure.
- GitHub issue #101 — permanent checklist and dated session log.

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
- Audited all Tier 1 critical startup owners.
- Audited all Tier 2 support modules loaded by `product-architecture.js`.

## Phase 1 inventory conclusion

Already globally idempotent:

- `assets/js/product-architecture.js`
- `assets/js/app-notification-surface-fix.js`

Batch 1 pending on PR #100:

- `assets/js/fresh-home-route-bootstrap.js`
- `assets/js/fresh-home-launch.js`

Remaining Tier 1 files need isolated Phase 1 guard work:

- `assets/js/octagon-hq-shell.js`
- `assets/js/octagon-hq-nav-grid.js`
- `assets/js/home-dashboard.js`
- `assets/js/community-profiles.js`
- `assets/js/app-notification-center.js`
- `assets/js/native-app-shell.js`
- `assets/js/native-app-shell-stability.js`
- `assets/js/share-deep-links.js`

All six Tier 2 support modules need file-level guards in later Phase 1 batches:

- `assets/js/product-connectivity.js`
- `assets/js/product-polish.js`
- `assets/js/profile-avatar-sync.js`
- `assets/js/profile-activity.js`
- `assets/js/find-leader-retention.js`
- `assets/js/picks-season-loop.js`

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

### Cody physical iPhone verification for PR #100

Before Batch 1 is merged, verify the currently installed app still behaves normally on the existing live build, then verify the PR preview if a preview URL is available. Required checks:

1. Cold-open the installed app from a stale Picks screen or after force-closing it. It should open Home without flashing Picks.
2. Open Rankings, background the app, return several times, and confirm it stays on Rankings without refreshing or jumping Home.
3. Open Picks through the normal app navigation and confirm it remains on Picks.
4. Use a Picks room or PIN handoff and confirm that intentional Picks continuation still works.
5. Open the profile chip and confirm no startup flicker, duplicate overlay, or repeated sign-in prompt.

Report each item as pass or fail. Do not merge PR #100 until the physical verification is recorded on issue #101.

### After Batch 1

Begin Phase 1 Batch 2 with a test-first branch for `octagon-hq-shell.js`. Do not overlap additional runtime changes with PR #100.

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
- Added persistent plan, status, inventory, decision, and cross-chat handoff files to `main`.
- Created master tracker issue #101.
- Completed Tier 1 and Tier 2 startup-owner inventory.
- Paused runtime changes at the correct boundary pending physical iPhone verification for Batch 1.
