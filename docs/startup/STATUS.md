# Startup Architecture Status

_Last updated: 2026-07-20_

## Overall status

- **Current phase:** Phase 2 route-ownership audit complete; no Phase 2 runtime removal is authorized yet.
- **Phase 0:** Complete.
- **Phase 1:** Complete.
- **Phase 1 runtime batches merged and physically verified:** 13.
- **Latest verified runtime commit:** `44684936bce748572a3497ec161500011a9623b9`.
- **Exact Batch 12 iPhone-tested head:** `a9f50c846c5f3b266b444f0f1a6ffc2e2c9bf9e0`.
- **Phase 2 route-audit starting `main`:** `7d9dc2ce668d5a4eac9dd9c31fe7e9865abc4dfe`.
- **Phase 2 route audit:** [`PHASE-2-ROUTE-OWNERSHIP-AUDIT.md`](./PHASE-2-ROUTE-OWNERSHIP-AUDIT.md).
- **Estimated entire cleanup progress:** approximately 52%.
- **Master tracker:** [#102 — Zero-change startup architecture cleanup](https://github.com/codyking0602/ufc-goat-rankings/issues/102).
- **Visible product changes approved:** none.
- **Documentation PR / merge:** to be recorded after the audit PR is squash-merged.
- **Recommended session state:** start a fresh chat for the focused missing/delayed-shell proof. Do not begin the runtime removal until that proof passes.

## Phase 2 route-audit conclusion

Route ownership is genuinely duplicated, but the duplicate-looking paths are not equally removable.

Confirmed duplication:

1. `assets/js/app.js` attaches a legacy primary-tab view switcher after `assets/js/octagon-hq-shell.js` has already claimed canonical navigation.
2. `assets/js/fresh-home-route-bootstrap.js` and `assets/js/fresh-home-launch.js` independently classify startup Home/Picks/deep-link intent and can activate the same route twice.

The cleanest first candidate is the legacy `.tab` activation block in `assets/js/app.js`. It is shadowed during normal clicks by the shell's earlier document-capture handler, but it may still be a partial fallback during a failed first shell load and later `product-architecture.js` recovery. Current tests do not prove that failure window.

Therefore:

- no runtime PR should be opened yet;
- the next task is a focused route-owner harness only;
- the harness must prove that delayed/missing shell recovery does not depend on the legacy `app.js` listener;
- if that proof fails, the runtime candidate is rejected and the audit must be updated before another responsibility is selected.

The startup-classifier duplication is a later batch. `fresh-home-launch.js` still closes a required query-only Picks route gap and owns the short-lived Picks resume marker.

## Completed runtime batches

| Batch | Owner | PR | Squash merge | Physical result |
|---|---|---:|---|---|
| 1 | `fresh-home-route-bootstrap.js` and `fresh-home-launch.js` | #100 | `5e733cc4568100e96080ce27ad601b7022daba33` | Installed app normal |
| 2 | `octagon-hq-shell.js` | #105 | `d7b47d6fb9ad45b101f67d5658b3e2a874a746c8` | Installed app normal |
| 3 | `octagon-hq-nav-grid.js` | #106 | `f4e3ada330fb841ade0333c580376dacaf58ec88` | Installed app normal |
| 4 | `home-dashboard.js` | #107 | `7fd6ede029cc307932cb38bc2c9274484b18f403` | Installed app normal |
| 5 | `native-app-shell-stability.js` | #108 | `6b0c9442b5a4df46e481296bb8d5cbd3befe1ab7` | Installed app normal |
| 6 | `app-notification-center.js` | #110 | `865527b15902e7b61fff429e4faf9ce2a0bc811c` | Installed app normal |
| 7 | `native-app-shell.js` | #112 | `5b82c3a47b64a4955c4fd4eb041fafe46473e8ac` | Exact tested head normal |
| 8 | `picks.js` | #113 | `0c488a449d413636228aafd1e45ee8197d5078ba` | Exact tested head normal |
| 9 | `community-profiles.js` | #114 | `4a811201bd6c2ac620d829d9701a187e468142b0` | Exact tested head normal |
| 10A | `play.js` | #115 | `2040f604892c067ee288fe88df15594a570ac396` | Exact tested head normal |
| 10B | `play-hub.js` | #119 | `b1a7a3c92c2f7c13b64b4d68df3d26e4e9afbec8` | Exact tested head normal |
| 11 | `share-deep-links.js` | #121 | `e332f46ec63c6698fdebd8ecc843c3f0df4eaabd` | Exact tested head normal |
| 12 | `production-ranking-bootstrap.js` | #123 | `44684936bce748572a3497ec161500011a9623b9` | Exact tested head normal |

## Batch 12 closeout — Calculated production ranking bootstrap

PR #123 replaced whole-file re-evaluation as the scoring bootstrap's accidental retry mechanism with a stable explicit lifecycle and then blocked only a second owner closure.

Final runtime record:

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

The owner now separates:

1. **File ownership initialization**
   - one private lifecycle state;
   - one stable owner object;
   - publication of `window.UFC_PRODUCTION_RANKING_BOOTSTRAP_LIFECYCLE`;
   - no owner timers, intervals, observers, polling, or persistent listeners.
2. **Bootstrap/application attempts**
   - `start()` and `retry()` recover idle/error attempts and are no-ops after ready;
   - `apply()` and `refresh()` intentionally force one recalculation after ready;
   - concurrent calls share one in-flight Promise;
   - failed dependency tags are removed so a later explicit retry can reload them;
   - the legacy `window.UFC_PRODUCTION_RANKING_BOOTSTRAP` result still appears only at the original success/error boundary.

The duplicate guard remains immediately after `'use strict'` and exits only when the complete lifecycle owner already exists. The owner marker is not published until private state and all lifecycle methods exist, and it is published before the automatic first `start()` attempt.

Preserved first-success behavior includes:

- `UFC_RANKING_DATA_PATCHES_READY`;
- all 40 ordered canonical calculation dependencies;
- approved-input validation;
- `UFC_RANKING_PIPELINE.apply()` and in-place `RANKING_DATA` replacement;
- presentation score cleanup and Compare synchronization;
- final fighter-photo synchronization;
- division ranking rebuild and validation;
- `UFC_SCORING_PIPELINE` and readiness attributes;
- app refresh, category rendering, and division rendering;
- `ufc-ranking-pipeline-applied`, `ufc-scoring-pipeline-ready`, and `ufc-production-ranking-ready`;
- Octagon Verdict data build and Compare launcher rendering;
- unchanged ranking, profile, division, category, Games, Compare, Intelligence, and audit consumers.

Focused proof established:

- original and modified first-success observable behavior is equivalent;
- missing prerequisites create no partial calculation or publication;
- missing prerequisites recover through `retry()` without file re-evaluation;
- failed calculation/application attempts remain retryable;
- repeated duplicate evaluation adds zero script loaders, listeners, timers, intervals, observers, calculations, publications, readiness events, refreshes, or render passes;
- repeated `start()` and `retry()` calls after ready are stable no-ops;
- concurrent forced calls share one attempt;
- later explicit `apply()` and `refresh()` each produce one intentional complete recalculation;
- no rank, score, category, OVR, visible statistic, profile projection, or fighter order changes.

Measured original duplicate-evaluation footprint included 40 extra dependency-load listeners and two complete ranking calculation/publication chains. The protected owner retains the exact successful first-run footprint: one calculation, one app refresh, one category render, one scoring-ready event, and one production-ready event, with the existing downstream double rebuild/build effects caused by their preserved readiness listeners.

Validation:

- JavaScript syntax passed;
- startup ownership contract passed;
- focused lifecycle, prerequisite, retry, first-run-equivalence, explicit-apply, and duplicate-execution harness passed;
- Startup Architecture Gate passed on the exact runtime/test parent, including iOS startup route stability, profile sign-in startup stability, and delayed Home/community stability;
- required Octagon Verdict Markdown build passed;
- the generated timestamp-only child changed no runtime or test blob.

Unrelated red checks were inspected but not repaired:

- stale 73-versus-80 roster and old-rank expectations;
- stale Henry Cejudo rank certification;
- existing Alexandre Pantoja category-audit and display-ownership diagnostics;
- existing 14 women’s leaderboard-thumbnail rendering failures.

Cody physically tested exact immutable head `a9f50c846c5f3b266b444f0f1a6ffc2e2c9bf9e0` on the installed iPhone and reported **“Normal.”** No blank state, flicker, route bounce, stale or missing ranking data, repeated ranking refresh, duplicate readiness event, duplicate rendering, changed rank, changed score, changed category, changed OVR, or changed fighter order was reported.

## Phase 1 conclusion

Every owner listed in the major Phase 1 audit has now been handled according to its audited class:

- simple IIFE owners use complete-owner guards;
- prerequisite-aware owners claim ownership only after prerequisites pass;
- `app.js` remains an exact-one manifest structural singleton;
- the retry-sensitive production ranking launcher now owns an explicit callable lifecycle before duplicate evaluation is blocked.

There is **no next isolated Phase 1 owner in the current audit**. Do not invent one or add a standard guard to `app.js`.

## Existing unrelated red checks

1. **Production ranking and scoring contracts**
   - Stale roster-count and rank expectations plus Alexandre Pantoja diagnostics remain outside startup work.
2. **Production Ranking Browser Smoke**
   - Existing women's fighter-thumbnail rendering failures remain separate from startup ownership.
3. **Picks and other product certification diagnostics**
   - Existing static-contract or product-data findings remain separate.

Do not repair these inside startup architecture work unless a failure directly references the isolated changed lines.

## Exact next action

1. Start a fresh chat from current `main` after the documentation audit is merged.
2. Reread the governing startup docs, the Phase 2 route audit, and every current Issue #102 comment.
3. Build a focused harness for the single candidate responsibility: legacy primary top-tab activation in `assets/js/app.js`.
4. Simulate normal shell ownership, delayed shell start, failed first shell load, product-architecture dynamic recovery, and a user activation during the recovery window.
5. Do not remove the listener unless the harness proves it is not a required fallback.
6. If the proof passes, open one isolated runtime batch touching only `app.js`, the startup contract, the focused harness, and the workflow entry.
7. Do not begin startup-classifier consolidation, Phase 3 repair retirement, Phase 4 startup deferral, Phase 5 manifest simplification, or Phase 6 certification.

## Stop conditions for the next session

Stop before runtime editing if:

- the legacy `app.js` listener performs a required action while the shell is delayed or recovering;
- the proposed change requires edits to shell, fresh launch, product architecture, native shell, share, Picks, Play, profile, War Room, Intelligence, or `index.html`;
- rankings, data, formulas, UI, navigation behavior, saved state, sharing payloads, or product copy would change;
- one tap would produce zero or multiple route activations;
- a repair, retry, or fallback would be removed without focused regression proof;
- the work expands into identity/profile, notification, general refresh/lifecycle, or Phase 3 consolidation;
- the work treats `app.js` as a normal IIFE guard candidate.
