# Startup Architecture Changelog

This is the historical record of completed or formally started startup-architecture work. Current state belongs in `STATUS.md`.

## 2026-07-19 — Phase 0 foundation

Added the zero-visible-change startup architecture contract, identified the six cleanup phases and intended owners, and locked the rule that current `main` is the production source of truth.

Commit: `2e70d6b6ceb6c697c46dedadfeaf75ad40b70517`

## 2026-07-19 — Automated startup gate

Added:

- `scripts/test-startup-contract.mjs`;
- `.github/workflows/startup-architecture-gate.yml`.

The gate checks startup syntax, ownership expectations, critical load order, iOS startup routing, profile sign-in startup, and delayed Home/community stability without changing runtime behavior.

## 2026-07-19 — Permanent continuity system

Created master tracker Issue #102 and the repository handoff system:

- `docs/startup/README.md`;
- `docs/startup/STATUS.md`;
- `docs/startup/OWNERS.md`;
- `docs/startup/DECISIONS.md`;
- `docs/startup/TEST_PLAN.md`;
- `docs/startup/KNOWN_ISSUES.md`;
- `docs/startup/CHANGELOG.md`.

Future sessions start from repository documentation rather than chat memory.

## 2026-07-19 — Major Phase 1 owner audit

Added `docs/startup/PHASE-1-OWNER-AUDIT.md` and classified startup owners into four technical groups:

1. simple global-guard candidates;
2. prerequisite-aware guard candidates;
3. structural manifest singletons;
4. retry-sensitive launchers requiring an explicit lifecycle.

The audit established the one-owner-per-batch sequence and prohibited a universal marker pattern.

## 2026-07-19 — Preview and rollout policy

The separate-origin static preview used during the earliest batches did not faithfully reproduce the production installed app. It was rejected for approval use.

Physical iPhone verification became the required merge gate for mobile-sensitive owners, with the exact immutable PR head recorded before approval.

## 2026-07-19 — Phase 1 Batch 1 merged and verified

PR #100 protected `fresh-home-route-bootstrap.js` and `fresh-home-launch.js`.

- Final runtime diff: 8 additions, 0 deletions, 3 files.
- Startup and Phase 4B mobile checks passed.
- Cody verified the installed app was normal.
- Squash merge: `5e733cc4568100e96080ce27ad601b7022daba33`.

## 2026-07-19 — Phase 1 Batch 2 merged and verified

PR #105 protected `octagon-hq-shell.js` and added one startup-contract assertion.

- Final runtime diff: 4 additions, 0 deletions, 2 files.
- Navigation, ranking subviews, Picks lifecycle, profile sign-in, delayed Home/community, and installed-iPhone behavior passed.
- Squash merge: `d7b47d6fb9ad45b101f67d5658b3e2a874a746c8`.

## 2026-07-19 — Phase 1 Batch 3 merged and verified

PR #106 protected `octagon-hq-nav-grid.js` while preserving its cleanup timers, resize listener, public API, and navigation presentation.

- Final runtime diff: 6 additions, 0 deletions, 2 files.
- Cody verified cold launch, bottom-navigation sizing/order, active state, resize/rotation, and tap behavior.
- Squash merge: `f4e3ada330fb841ade0333c580376dacaf58ec88`.

## 2026-07-19 — Phase 1 Batch 4 merged and verified

PR #107 protected `home-dashboard.js` while preserving Home markup, card order, copy, styles, timers, listeners, daily challenge, Picks, War Room, fighter spotlight, and public APIs.

- Final runtime diff: 6 additions, 0 deletions, 2 files.
- Cody verified Home cold launch, cards, Games, Picks, War Room, profile opening, background/resume, and return-to-Home behavior.
- Squash merge: `7fd6ede029cc307932cb38bc2c9274484b18f403`.

## 2026-07-19 — Phase 1 Batch 5 merged and verified

PR #108 protected `native-app-shell-stability.js` while preserving its public `schedule()` retry API, readiness events, MutationObserver, listeners, and delayed repair passes.

- Final runtime diff: 4 additions, 0 deletions, 2 files.
- Removal remains deferred to Phase 3 after regression coverage exists.
- Squash merge: `6b0c9442b5a4df46e481296bb8d5cbd3befe1ab7`.

## 2026-07-19 — Phase 1 Batch 6 merged and verified

PR #110 protected `app-notification-center.js` while preserving notification rendering, service-worker behavior, profile/activity surfaces, settings retries, observers, event APIs, permission ownership, and user-gesture-only enabling.

- Final runtime diff: 4 additions, 0 deletions, 2 files.
- Cody verified installed-iPhone notification surfaces, permission behavior, controls, navigation, touch, and background/resume.
- Squash merge: `865527b15902e7b61fff429e4faf9ce2a0bc811c`.

## 2026-07-19 — Phase 1 Batch 7 merged and verified

PR #112 protected `native-app-shell.js` while preserving bottom navigation, badge synchronization, transitions, pull-to-refresh, touch handling, public APIs, events, MutationObserver, delayed passes, resize/orientation, visibility resume, and the 10-second badge interval.

- Final runtime diff: 4 additions, 0 deletions, 2 files.
- Exact tested head: `47812a65cfda297e5a64ea1fb51d186fce7d50a4`.
- Cody reported the installed app was normal.
- Squash merge: `5b82c3a47b64a4955c4fd4eb041fafe46473e8ac`.

## 2026-07-19 — Phase 1 Batch 8 merged and verified

PR #113 protected `picks.js` while preserving the original `DOMContentLoaded` retry, saved Picks and Underdog Lock restoration, tokens, room resume, routes, control bindings, backend event load, render ownership, support-owner handoffs, and 30-second polling.

- Final runtime diff: 5 additions, 0 deletions, 2 files.
- Focused duplicate-evaluation and first-run equivalence proof passed.
- Startup Architecture Gate, iOS route, profile sign-in, delayed Home/community, and Picks syntax validation passed.
- Unrelated Picks static-contract, scoring guardrail, and fighter-photo failures remained separate.
- Exact tested head: `1ea7bdf46f09f18279ac4f21a2bbfd492f1d44ba`.
- Cody reported the installed app was normal.
- Squash merge: `0c488a449d413636228aafd1e45ee8197d5078ba`.

## 2026-07-19 — Phase 1 Batch 9 merged and verified

PR #114 protected `community-profiles.js` with a top-level global duplicate-file-execution guard and one matching startup-contract assertion.

Inspection established that duplicate file evaluation was not an intentional prerequisite retry. Existing public APIs, `DOMContentLoaded`, Home/profile/Picks events, delayed challenge wrapping, Top 10 restoration, profile return behavior, identity storage handoff, and surrounding lifecycle owners remain unchanged.

Final state:

- starting `main`: `bdacf8f10b913f5afad4ec6819921fd6f761e572`;
- exact physically tested head: `1915c0ff314b7911688574f279eba889d4967a42`;
- 4 additions, 0 deletions, 2 changed files;
- runtime blobs: `f88c3f95caf720b273e9d5a82341f8f5d3110342` → `e087c82c48bd0e51765779ab4faa3df524673d7e`;
- startup-contract blobs: `b2d3f041288390ca24775868e73e3afe735da36d` → `af9d23224988be205becc284bcb0f0a70433edea`.

Focused proof, Startup Architecture Gate #24, Phase 4B profile/community/Picks coverage, and installed-iPhone verification passed. Existing ranking, thumbnail, Pantoja, and local-preview diagnostics remained separate.

Cody reported **“Normal.”** Squash merge: `4a811201bd6c2ac620d829d9701a187e468142b0`.

## 2026-07-19 — Phase 1 Batch 10A merged and verified

PR #115 protected `play.js` with a prerequisite-aware duplicate-file-execution guard and one matching startup-contract assertion.

The required prerequisites are the static `#play` panel and `window.RANKING_DATA.men` array. The successful marker was placed after those checks and before state construction, where `loadTop10()` begins storage ownership. Missing-prerequisite attempts remain unmarked and can recover through later file execution.

Final state:

- starting `main`: `67b3cc9d94ca28641f4ba1ce4378b19fa08f985c`;
- exact physically tested head: `6eac38e575dd778a5b4e42fe5b83283723df1847`;
- squash merge: `2040f604892c067ee288fe88df15594a570ac396`;
- 4 additions, 0 deletions, 2 changed files;
- runtime blobs: `f7aff84b33c847d825f5fa0207549572582c5096` → `dd3cb93abeecd92897c4fe2beb734e4a6148acfc`;
- startup-contract blobs: `af9d23224988be205becc284bcb0f0a70433edea` → `95e77fcb7e66e982ad5dc7bbabdaaf1a4938261d`.

Exact-source reproduction, missing-prerequisite recovery, first-run equivalence, duplicate-action proof, Startup Architecture Gate, iOS route, profile/Picks continuation, delayed Home/community, and installed-iPhone verification passed. Existing ranking, scoring/Pantoja, and women’s-thumbnail reds remained separate.

Cody reported **“Normal.”**

## 2026-07-19 — Phase 1 Batch 10B merged and verified

PR #119 protected `play-hub.js` with a prerequisite-aware duplicate-file-execution guard and one matching startup-contract assertion.

The required prerequisites are the five static Play DOM elements: `#play`, `.play-shell`, `.section-title`, the Top 10 mode button, and the Blind Resume mode button. The marker was placed after the existing prerequisite return and before native-random capture and private hub state.

This preserves the intentional recovery boundary:

- missing-DOM attempts leave the successful marker unset;
- failed attempts create no listener, timer, interval, observer, storage, DOM, API, rendering, or script-loading ownership;
- a later execution may initialize normally after the missing DOM appears;
- only a later execution after one successful initialization is blocked.

Final state:

- starting `main`: `e48a36c464a25f9f6d336435e2ba876f10177a85`;
- exact physically tested head: `35bc9a750cdbdfb2cec69b2e17d954b95b1ca8fc`;
- squash merge: `b1a7a3c92c2f7c13b64b4d68df3d26e4e9afbec8`;
- 4 additions, 0 deletions, 2 changed files;
- runtime blobs: `84f7a556efef0f9964ffc459009c166673216218` → `0831bd2d58c04dd683a72c3178596ea43aca0f2b`;
- startup-contract blobs: `95e77fcb7e66e982ad5dc7bbabdaaf1a4938261d` → `dd426780dfdacdf1a9aa7848bcc0fc627ea5b627`.

The exact original and guarded first-run traces were equivalent. Daily-game choice/restoration, seeded Blind Resume randomness, current Play mode, hub/game rendering, navigation, routing, listeners, observer, zero-delay timers, APIs, events, and all Top 10, Blind Resume, Better Than, Find the Leader, Games, profile, Picks, sharing, shell, and native handoffs remained unchanged. Deliberate duplicate evaluation added zero ownership and important actions still fired once.

Startup Architecture Gate #30 passed syntax, startup contract, iOS route stability, profile sign-in stability, and delayed Home/community stability on the exact head. Existing scoring/Pantoja and women’s-thumbnail reds were inspected through retained artifacts and remained unrelated.

Cody physically tested exact immutable head `35bc9a750cdbdfb2cec69b2e17d954b95b1ca8fc` and reported **“Normal.”** No blank state, flicker, route bounce, stale/lost state, duplicate UI, double action, duplicate game choice, duplicate route, duplicate save, duplicate ownership, or failed prerequisite recovery was observed.

The next isolated Phase 1 owner is `assets/js/share-deep-links.js`. It must begin from fresh current `main` and remain separate from every other owner.
