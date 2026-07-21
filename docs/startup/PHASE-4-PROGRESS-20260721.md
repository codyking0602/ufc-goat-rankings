# Phase 4 Startup-Work Progress — 2026-07-21

## Objective

Reduce measured startup and off-screen work without changing canonical ownership, visible behavior, routes, rankings, scoring, fighter data, or the production script manifest.

Phase 4 changed one narrow runtime responsibility at a time. Every runtime batch required:

1. a current production measurement or demonstrated avoidable call path;
2. owner tracing before editing;
3. static and 390×844 mobile-browser proof;
4. the complete Startup Architecture Gate;
5. the dedicated iOS Home Startup Stability suite;
6. the Phase 4 Startup Work Inventory;
7. exact-head verification before merge.

Broad script deletion, bundling, or manifest consolidation remained out of scope and is now the Phase 5 boundary.

## Baseline inventory — PR #169

PR #169 added `scripts/audit-phase-4-startup-work.mjs` and the read-only **Phase 4 Startup Work Inventory** workflow.

The inventory reads the production `index.html` manifest and records production order, byte size, timers, scheduling signals, lifecycle/readiness listeners, potential network references, and profile/group-snapshot references. It generates audit candidates; it does not prove that every matched operation executes at startup.

- Inventory head: `f8831fc2060f4a591b477d0c7329fcec0e520c77`
- Production merge: `f1de569d022bf8fd6bb41a1710d8617957312d0e`
- Phase 4 Startup Work Inventory #1: passed

## Batch 1 — Picks commissioner snapshot activation

`assets/js/picks-commissioner.js` previously requested commissioner state during Home startup when saved Picks access existed, reacted to hidden Picks mutations, and continued its 45-second poll off-screen.

PR #171 retained commissioner ownership while binding automatic network work to active Picks and a mounted commissioner card. Explicit commissioner actions retained forced refreshes.

- Home startup, hidden mutation, and hidden polling: zero commissioner RPCs
- Direct active startup and route entry: one bounded request after card mount
- Late active card mount: one bounded handoff
- Active polling: preserved
- Exact tested head: `de893fa4927e22a7968522c69fd429c17e46c965`
- Startup Architecture Gate #177: passed
- Dedicated iOS #44: passed
- Production merge: `2eea1a03e169e3ba3289b4c0b6198a87ea4233ab`

## Batch 2 — Native-shell delayed startup resynchronization

`assets/js/native-app-shell.js` performed one complete initial component, route, and badge synchronization, then repeated Ask-action, active-route, and badge synchronization at 80, 260, 800, 1800, and 4200 milliseconds.

PR #174 removed only those five unconditional passes. Canonical route/update events, targeted observation, resize/orientation recovery, visibility recovery, pull-to-refresh, and the separate 10-second badge poll remain.

- Exact tested head: `a625b9a1f2dd13de342d0103e004884dcc71a437`
- Startup Architecture Gate #180: passed
- Dedicated iOS #46: passed
- Inventory #12: passed
- Production merge: `f03ef47aab32ee67816d7ba86206af3a8c208093`

## Batch 3 — War Room notification startup status retries

`assets/js/octagon-notifications.js` performed shell setup and `refreshStatus()` at 0, 180, 700, 1800, and 4200 milliseconds.

PR #177 preserved one immediate local shell/status attempt. Cached identity produces one startup request; uncached startup produces zero RPCs and waits for published readiness. Direct-link opening, realtime, visibility/online recovery, explicit refresh, mark-seen, push, the 30-second status poll, and 3-second local DOM maintenance remain.

- Exact tested head: `7d307fb4af9647748b552867390fb9498fe146c0`
- Startup Architecture Gate #184: passed
- Dedicated iOS #49: passed
- Inventory #15: passed
- Production merge: `8df258a6dc7e20560783f30d6e974476e62ac5d6`

## Batch 4 — War Room access startup status retries

`assets/js/octagon-access-panel.js` performed `ensurePanel()` and `checkCurrentAccess()` at 0, 250, 900, 2600, and 5000 milliseconds.

PR #179 preserved one immediate shell/status attempt. The board owner is already synchronously mounted before access startup. Cached identity produces one request; uncached startup produces zero RPCs and waits for readiness. Realtime, visibility/online recovery, the 60-second verification poll, Cody roster/toggles, access rules, and tab state remain.

- Exact tested head: `5458ba3545476846d16bbaf58ed279a344dddbdc`
- Startup Architecture Gate #188: passed
- Dedicated iOS #52: passed on unchanged rerun after an initial cancellation
- Inventory #18: passed
- Production merge: `002b31f5ccad3db185b5a6053cb620925482c426`

## Batch 5 — War Room message-board mount and bind retries

`assets/js/octagon-message-board.js` performed a synchronous startup `mount()` and `bindTab()`, then repeated both at 50, 220, 850, and 2200 milliseconds.

The audit proved the static `#octagon` root and beta tab exist before the board starts, and the synchronous startup mount/bind already establishes the local board shell. Identity readiness, active-route loading, visibility/online recovery, realtime behavior, and explicit board actions own later work.

PR #182 removed only the four delayed local retries.

Preserved behavior:

- one synchronous startup mount and tab/navigation bind;
- active and inactive loading boundaries;
- cached and uncached identity readiness;
- route, visibility, online, and realtime behavior;
- direct board actions and the explicit sign-in boundary.

- Exact tested head: `b7ee8b933fecfb51883bc443f99f54541726ed87`
- Startup Architecture Gate #193: passed
- Dedicated iOS #56: passed
- Inventory #22: passed
- Production merge: `e2c0ec89f518ab14c00151a1998b9c8b724fcd25`

## Batch 6 — Persistent Picks groups activation

`assets/js/picks-persistent-groups.js` could refresh group state while Picks was inactive, including Home startup and hidden polling/mutation paths.

PR #184 retained the module as the persistent-group owner but bound automatic refreshes to active Picks.

Production boundary:

- hidden Home startup: zero persistent-group RPCs;
- hidden mutation and hidden polling: zero RPCs;
- route entry to Picks: refresh preserved;
- active polling and active late-card behavior: preserved;
- route exit: automatic work becomes silent;
- direct group and room actions: preserved;
- late shell support: preserved.

- Exact tested head: `c8eee4570584c0124093771510472a3446e96b5c`
- Startup Architecture Gate #196: passed
- Dedicated iOS #58: passed
- Inventory #24: passed
- Production merge: `fdf96f533e4a32ba260d0dc22f6796b3507bdbcb`

## Batch 7 — Picks social/profile-reminder activation

`assets/js/picks-social-retention.js` previously performed automatic social snapshot/profile work while Picks was inactive:

- cached Home startup could request `picks_social_snapshot`;
- hidden identity/profile/data readiness events could request state;
- hidden mutation handling could wake profile work;
- the 30-second poll continued off-screen.

PR #185 introduced `picksActive()` using `window.UFC_APP_SHELL.currentDestination` with an active-view fallback and bound automatic snapshot/profile synchronization to active Picks.

Production boundary:

- Home with cached identity: local shell only, zero snapshot RPCs;
- hidden readiness/profile/data events: cached identity may update, but zero RPC, resolver, editor, or sign-in work;
- route entry to Picks: one snapshot and visible **Profile & Reminders** UI;
- ordinary active mutation: row decoration only, zero duplicate RPC;
- active 30-second poll: one refresh;
- route exit followed by poll: zero refresh;
- direct cached active startup: one refresh;
- direct uncached active startup: zero until canonical readiness, then one refresh;
- late active shell: zero before mount, one bounded refresh after mount;
- explicit externally invoked `window.UFC_PICKS_SHARED_PROFILE.refresh()` remains usable while inactive;
- profile editor, reminder RPC, browser notification, and calendar-reminder behavior remain unchanged.

The final PR contains exactly:

1. `assets/js/picks-social-retention.js`
2. `scripts/test-ios-standalone-resume-home.mjs`
3. `scripts/test-picks-social-active-contract.mjs`
4. `scripts/test-picks-social-active-owner.mjs`
5. `scripts/test-picks-social-identity-owner.mjs`

The temporary diagnostic wrapper was removed before certification.

- Runtime version: `picks-social-retention-20260721h-active-picks-only`
- Exact tested head: `41eedc4d562873d32768d302e75be9e139bc823c`
- Startup Architecture Gate #202: passed
- Dedicated iOS #63: passed
- Inventory #29: passed
- Production merge: `bdd09daaa8c4218b4c3c03138d457ca4197f2025`

## Known unrelated red workflows

The final exact-head run retained the established unrelated failures:

- Picks UI Smoke #849 passed Picks JavaScript syntax, then reported mobile top-tab auto-centering, daily odds refresh scheduling, and setup-guide documentation.
- Production Ranking Browser Smoke #614 stopped in the established fighter-photo audit path.
- Scoring Architecture Guardrails #1440 remained in the established permanent source/runtime contract path.

None references the isolated Picks social activation change.

## Phase 4 completion

Phase 4 is complete.

The final production inventory and runtime proofs do not demonstrate another duplicate startup owner or another unnecessary inactive-destination network path that should be changed under the Phase 4 standard.

Phase 4 established these permanent boundaries:

- destination-specific owners may install local shells at startup but do not perform automatic network work while inactive;
- passive consumers use cached canonical identity and readiness/update events;
- delayed retry arrays require a unique late prerequisite, not speculation;
- recurring polls are destination-bound unless an app-wide requirement is proved;
- explicit public APIs and user actions remain available even when automatic inactive work is silent.

## Phase 5 handoff — script manifest and loading order

The next phase is **Phase 5: startup script-manifest and loading-order simplification**.

Audit narrowly from the production `index.html` load order. Remove or move only wiring that is proven obsolete after the completed ownership cleanup. Preserve runtime behavior, public APIs, prerequisite order, installed-app behavior, and all Phase 1–4 ownership contracts.

Do not begin broad bundling, arbitrary script deletion, or unrelated code cleanup. The first Phase 5 batch should establish a deterministic manifest inventory and prove one obsolete wiring edge before editing.