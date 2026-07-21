# Phase 4 Startup-Work Progress — 2026-07-21

## Objective

Reduce measured startup and off-screen work without changing canonical ownership, visible behavior, routes, rankings, scoring, fighter data, or the production script manifest.

Phase 4 changes one narrow runtime responsibility at a time. Every runtime batch requires:

1. a current production measurement or demonstrated avoidable call path;
2. owner tracing before editing;
3. static and mobile-browser proof;
4. the complete Startup Architecture Gate;
5. the dedicated iOS Home Startup Stability suite;
6. exact-head verification before merge.

Broad script deletion, bundling, or manifest consolidation remains Phase 5 work.

## Baseline inventory — PR #169

PR #169 added `scripts/audit-phase-4-startup-work.mjs` and the read-only **Phase 4 Startup Work Inventory** workflow.

The inventory reads the production `index.html` manifest and records, per loaded JavaScript file:

- production order and byte size;
- timer and scheduling signals;
- lifecycle/readiness listeners;
- potential network-operation references;
- profile resolution and full group-snapshot references.

The report is a candidate generator, not proof that every matched call executes at startup. Runtime edits still require direct tracing and focused proof.

- Inventory head: `f8831fc2060f4a591b477d0c7329fcec0e520c77`.
- Production merge: `f1de569d022bf8fd6bb41a1710d8617957312d0e`.
- Phase 4 Startup Work Inventory #1: passed.

## Batch 1 — Picks commissioner snapshot activation

### Measured avoidable work

`assets/js/picks-commissioner.js` previously called `refresh()` unconditionally during startup. When one saved Picks group and commissioner/member token existed, this could issue a commissioner RPC while Home was the active destination.

The same module also:

- observed the hidden Picks subtree and scheduled `refresh()` after ordinary mutations;
- ran a 45-second commissioner freshness poll even while Picks was off-screen.

Those requests were not required for Home startup and did not change ownership. The commissioner module remains the correct owner of commissioner snapshot data and actions.

### Production boundary after PR #171

Commissioner data work is now activation-bound:

- startup installs the local commissioner card shell without requesting network state while Home is active;
- direct Picks startup requests commissioner state only after the local card exists;
- canonical `octagon-hq:view-change` entry to Picks installs the card before requesting state;
- a late Picks shell/card mount receives one bounded refresh handoff;
- ordinary hidden or visible Picks subtree mutations do not request commissioner state;
- the existing 45-second freshness poll runs only while Picks is active;
- leaving Picks stops off-screen polling;
- explicit commissioner actions retain their existing forced refreshes.

### Permanent proof

The static contract verifies:

- the canonical shell loads before the commissioner module;
- one active-destination predicate prefers `window.UFC_APP_SHELL.currentDestination`;
- Home startup contains no unconditional commissioner refresh;
- direct and route-entry refreshes wait for the mounted card;
- late card creation retains one bounded handoff;
- polling is active-Picks-only;
- ordinary mutation observation cannot schedule network work.

The 390×844 mobile proof covers:

- Home startup with saved tokens: zero commissioner RPCs;
- hidden Picks mutation: zero RPCs;
- hidden 45-second poll callback: zero RPCs;
- route entry to Picks: one RPC and visible commissioner card;
- ordinary active mutation: no duplicate RPC;
- active poll callback: one freshness RPC;
- route exit followed by poll callback: no off-screen RPC;
- direct Picks startup: one RPC;
- late Picks shell insertion: no premature RPC and one post-mount RPC.

The proof is imported by the existing iOS startup suite.

- Exact tested head: `de893fa4927e22a7968522c69fd429c17e46c965`.
- Startup Architecture Gate #177: passed.
- Dedicated iOS Home Startup Stability #44: passed.
- Production merge: `2eea1a03e169e3ba3289b4c0b6198a87ea4233ab`.

## Known unrelated red workflows for Batch 1

The inspected failures do not reference the isolated commissioner responsibility:

- Picks UI Smoke #840 passed Picks JavaScript syntax, then failed the existing checks for mobile top-tab auto-centering, a daily odds refresh schedule, and setup-guide documentation.
- Production Ranking Browser Smoke #589 stopped at the existing **Audit every fighter photo path** step before ranking and mobile-profile certification.
- Scoring Architecture Guardrails #1415 passed syntax, profile-copy coverage, and physical source ownership, then stopped at its established permanent runtime contract step.

## Next audit order

Use the current production inventory and continue one measured responsibility at a time. The leading next candidate is the five unconditional startup resynchronization passes in `assets/js/native-app-shell.js` at 80, 260, 800, 1800, and 4200 milliseconds.

Before editing that candidate:

1. separate static component creation from badge and active-route synchronization;
2. prove which late prerequisites, if any, still require each delayed pass;
3. preserve the 10-second live badge poll as a separate responsibility unless independently proven avoidable;
4. preserve route events, relevant mutation observation, resize/orientation handling, visibility recovery, and pull-to-refresh behavior unless their own audit proves redundancy.
