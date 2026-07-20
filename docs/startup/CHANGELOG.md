# Startup Architecture Changelog

This is the historical record of completed or formally started startup-architecture work. Current state and the exact next action belong in `STATUS.md`.

## Foundation and policy — 2026-07-19

The project established:

- the zero-visible-change startup architecture contract;
- six cleanup phases;
- current `main` as the production source of truth;
- `scripts/test-startup-contract.mjs`;
- `.github/workflows/startup-architecture-gate.yml`;
- permanent repository handoff documentation;
- master tracker Issue #102;
- the major Phase 1 owner audit and four guard classes;
- one owner problem per runtime batch;
- exact immutable-head physical iPhone verification for mobile-sensitive owners;
- separation of unrelated stale scoring, roster, Pantoja, and fighter-thumbnail failures.

The Phase 1 audit classified owners as simple guards, prerequisite-aware guards, structural manifest singletons, or retry-sensitive launchers requiring an explicit lifecycle.

## Phase 1 runtime history

| Batch | Owner | PR | Squash merge | Result |
|---|---|---:|---|---|
| 1 | `fresh-home-route-bootstrap.js` and `fresh-home-launch.js` | #100 | `5e733cc4568100e96080ce27ad601b7022daba33` | Physically verified normal |
| 2 | `octagon-hq-shell.js` | #105 | `d7b47d6fb9ad45b101f67d5658b3e2a874a746c8` | Physically verified normal |
| 3 | `octagon-hq-nav-grid.js` | #106 | `f4e3ada330fb841ade0333c580376dacaf58ec88` | Physically verified normal |
| 4 | `home-dashboard.js` | #107 | `7fd6ede029cc307932cb38bc2c9274484b18f403` | Physically verified normal |
| 5 | `native-app-shell-stability.js` | #108 | `6b0c9442b5a4df46e481296bb8d5cbd3befe1ab7` | Physically verified normal |
| 6 | `app-notification-center.js` | #110 | `865527b15902e7b61fff429e4faf9ce2a0bc811c` | Physically verified normal |
| 7 | `native-app-shell.js` | #112 | `5b82c3a47b64a4955c4fd4eb041fafe46473e8ac` | Exact tested head normal |
| 8 | `picks.js` | #113 | `0c488a449d413636228aafd1e45ee8197d5078ba` | Exact tested head normal |
| 9 | `community-profiles.js` | #114 | `4a811201bd6c2ac620d829d9701a187e468142b0` | Exact tested head normal |
| 10A | `play.js` | #115 | `2040f604892c067ee288fe88df15594a570ac396` | Exact tested head normal |
| 10B | `play-hub.js` | #119 | `b1a7a3c92c2f7c13b64b4d68df3d26e4e9afbec8` | Exact tested head normal |
| 11 | `share-deep-links.js` | #121 | `e332f46ec63c6698fdebd8ecc843c3f0df4eaabd` | Exact tested head normal |
| 12 | `production-ranking-bootstrap.js` | #123 | `44684936bce748572a3497ec161500011a9623b9` | Exact tested head normal |

## Batch classification results

### Simple complete-owner guards

The route bootstrap, app shell, navigation cleanup, Home dashboard, native repair layer, notification center, native shell, Picks, community profiles, and share/deep-link owners received global duplicate-file protection only after proof that duplicate evaluation was not a legitimate retry mechanism.

Each batch preserved its original first execution and left intentional later work inside existing public APIs, events, observers, timers, intervals, route wait loops, service-worker handoffs, saved-state restoration, or lifecycle callbacks.

### Prerequisite-aware owners

`play.js` and `play-hub.js` intentionally return when required static DOM or ranking data is missing. Their markers remain after prerequisite checks and before successful-owner state, storage, listener, timer, API, rendering, or randomness ownership. A failed prerequisite attempt claims no ownership and a later file execution remains the recovery path until successful initialization.

### Structural singleton

`app.js` remains an exact-one manifest load. Phase 1 did not add a standard IIFE marker because lexical declarations and global rendering APIs make it a structural singleton rather than a normal duplicate-file guard candidate.

### Retry-sensitive launcher

`production-ranking-bootstrap.js` previously relied on whole-file re-evaluation as the only callable recovery path after missing dependencies or failed calculation/application work. PR #123 introduced a stable lifecycle before blocking duplicate owner creation.

## 2026-07-20 — Phase 1 Batch 12 merged and verified

PR #123 added an explicit calculated-production bootstrap lifecycle and one matching startup-contract assertion.

Final record:

- starting `main`: `952683af839547b84576fe2ea3a9c813dc709983`;
- exact physically tested PR head: `a9f50c846c5f3b266b444f0f1a6ffc2e2c9bf9e0`;
- CI-tested runtime/test parent: `087e384446884a8573ac4542504ea808cf343684`;
- squash merge: `44684936bce748572a3497ec161500011a9623b9`;
- 57 additions;
- 8 deletions;
- 3 changed files, including the required timestamp-only Octagon Verdict Markdown regeneration;
- original runtime blob: `7f94b5092319038b8a52a826c60def6c5ada8979`;
- merged runtime blob: `df5136ccd93e69bba924af757e8b0b4abfdf9df7`;
- original startup-contract blob: `b67f87807be533b346e15254dc1041b77bda1a3b`;
- merged startup-contract blob: `0f89092f5bab7e3cf8c77871d90c11cc1ea01728`.

The lifecycle publishes one stable owner through `window.UFC_PRODUCTION_RANKING_BOOTSTRAP_LIFECYCLE`:

- `start()` and `retry()` recover idle/error attempts and do not republish after ready;
- `apply()` and `refresh()` intentionally force one recalculation after ready;
- concurrent lifecycle calls share one in-flight Promise;
- failed dependency tags are removed and can be reloaded on explicit retry;
- failed calculation/application attempts retain the owner and remain retryable without file re-evaluation;
- the legacy `window.UFC_PRODUCTION_RANKING_BOOTSTRAP` result retains its original success/error publication boundary and shape.

The guard is immediately after `'use strict'`, but it checks for the complete lifecycle owner rather than setting a naive early boolean. The complete owner is published only after private lifecycle state and all public methods exist, and before the automatic first `start()` call.

Focused proof established first-success equivalence, missing-prerequisite recovery, failed-calculation recovery, stable repeated retry calls, intentional forced recalculation, shared in-flight attempts, and zero duplicate script loading, listeners, timers, intervals, observers, calculations, publications, ready events, refreshes, or rendering from deliberate second file evaluation.

The original duplicate footprint was measurable: a second in-flight closure added 40 dependency load listeners and produced two full ranking calculation/publication chains. The protected runtime retains one calculation, one app refresh, one scoring-ready event, one production-ready event, and the existing downstream rebuild/build effects caused by preserved readiness listeners.

Validation passed:

- JavaScript syntax;
- startup ownership contract;
- focused lifecycle and equivalence harness;
- missing-prerequisite and failed-attempt retries;
- duplicate-evaluation proof;
- complete Startup Architecture Gate on the runtime/test parent;
- iOS startup route stability;
- profile sign-in startup stability;
- delayed Home/community stability;
- required Octagon Verdict Markdown generation.

Unrelated red checks remained outside scope: stale 73-versus-80 and old-rank expectations, Henry Cejudo certification, Alexandre Pantoja diagnostics, and 14 women’s leaderboard-thumbnail rendering failures.

Cody physically tested exact immutable PR head `a9f50c846c5f3b266b444f0f1a6ffc2e2c9bf9e0` on the installed iPhone and reported **“Normal.”** No visible regression, blank state, flicker, route bounce, stale or missing ranking data, repeated refresh, duplicate readiness event, duplicate rendering, or changed ranks, scores, categories, OVRs, visible statistics, profiles, or fighter ordering was reported.

## Phase 1 completion

Batch 12 completed the final owner in the major Phase 1 audit. All 13 runtime batches are merged and physically verified.

There is no next Phase 1 owner in the current audit. The next project step is a fresh Phase 2 duplicate-ownership audit, beginning with route ownership, before any consolidation or runtime deletion is attempted.
