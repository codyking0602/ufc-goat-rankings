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

## Batch 2 — Native-shell delayed startup resynchronization

### Measured avoidable work

`assets/js/native-app-shell.js` already performed one complete startup pass that:

- created the bottom navigation;
- created the **Ask** action;
- created the pull-to-refresh indicator;
- synchronized the active primary destination;
- synchronized Play, Picks, War Room, and app badge state;
- bound route/lifecycle events and targeted DOM observation.

It then repeated `ensureAskAction()`, `syncActive()`, and `syncBadges()` at 80, 260, 800, 1800, and 4200 milliseconds regardless of whether anything changed.

The audit separated the three responsibilities:

- **Ask action:** the static hero exists before the native shell starts, so the initial creation is sufficient; resize/orientation and relevant observation remain for later recovery.
- **Route state:** the canonical shell exists before the native shell and publishes `octagon-hq:view-change`; visibility recovery and relevant `main.shell` observation remain.
- **Badges:** challenge unread updates publish events, Picks progress changes mutate an observed target, and the War Room notification owner creates/updates the observed unread badge. The separate 10-second live badge poll remains for uncued late state.

No delayed pass had a unique late prerequisite.

### Production boundary after PR #174

PR #174 removed only the five unconditional startup passes.

The native shell now retains:

- one initial component, route, and badge synchronization;
- canonical route-event synchronization;
- challenge/profile/notification update events;
- targeted Picks, profile-challenge, War Room, and active-view observation;
- resize and orientation recovery;
- visibility recovery;
- pull-to-refresh behavior;
- the separate 10-second live badge poll.

### Permanent proof

The static contract verifies production load order, one initial synchronization, absence of the five-delay array, and preservation of owner events, targeted observation, visibility recovery, and the 10-second poll.

The 390×844 mobile proof covers:

- exactly one bottom nav, Ask action, pull indicator, route sync, and initial app-badge write;
- zero additional app-badge writes throughout the complete former 4.2-second retry window;
- challenge unread updates through the owner event;
- Picks missing-pick updates through progress DOM mutation;
- War Room unread updates through the notification owner’s badge DOM mutation;
- canonical route entry through `octagon-hq:view-change`;
- late state recovery through the preserved 10-second poll callback.

The existing native pull-refresh proof was updated only for the runtime version and continues to certify normal, fallback, War Room, and concurrent accepted-action behavior. The new proof is imported by the iOS startup suite.

- Exact tested head: `a625b9a1f2dd13de342d0103e004884dcc71a437`.
- Startup Architecture Gate #180: passed.
- Dedicated iOS Home Startup Stability #46: passed.
- Phase 4 Startup Work Inventory #12: passed.
- Production merge: `f03ef47aab32ee67816d7ba86206af3a8c208093`.

## Known unrelated red workflows

The inspected failures do not reference either isolated Phase 4 responsibility:

- Picks UI Smoke #840 passed Picks JavaScript syntax, then failed the existing checks for mobile top-tab auto-centering, a daily odds refresh schedule, and setup-guide documentation.
- Production Ranking Browser Smoke #589 and #593 stopped at the existing **Audit every fighter photo path** step before ranking and mobile-profile certification.
- Scoring Architecture Guardrails #1415 and #1418 passed syntax, profile-copy coverage, and physical source ownership, then stopped at the established permanent runtime contract step.

## Next audit order

Continue from the current inventory one measured responsibility at a time.

The next leading network candidate is the War Room notification owner’s startup retry schedule in `assets/js/octagon-notifications.js`: 0, 180, 700, 1800, and 4200 milliseconds, each calling `refreshStatus()`.

Before editing that candidate:

1. trace identity readiness and direct-link behavior separately;
2. prove whether the notification owner’s identity events and one initial attempt make later retries redundant;
3. preserve realtime, visibility, online, opening-board, and explicit refresh behavior;
4. preserve the 30-second status poll and 3-second local DOM maintenance as separate responsibilities unless independently proven avoidable;
5. do not combine the audit with notification ownership, push, or board-render changes.
