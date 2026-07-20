# Startup Architecture Status

_Last updated: 2026-07-20_

## Overall status

- **Current phase:** Phase 2 route ownership is physically complete; the identity/profile audit is complete and its first isolated runtime candidate is authorized for proof.
- **Phase 0:** Complete.
- **Phase 1:** Complete.
- **Phase 1 runtime batches merged and physically verified:** 13.
- **Latest verified runtime commit:** `fa47a51513c28bc3ba6173f1c95c47ca97ab85aa`.
- **Exact Batch 12 iPhone-tested head:** `a9f50c846c5f3b266b444f0f1a6ffc2e2c9bf9e0`.
- **Phase 2 route-audit starting `main`:** `7d9dc2ce668d5a4eac9dd9c31fe7e9865abc4dfe`.
- **Phase 2 route audit:** [`PHASE-2-ROUTE-OWNERSHIP-AUDIT.md`](./PHASE-2-ROUTE-OWNERSHIP-AUDIT.md).
- **Estimated entire cleanup progress:** approximately 58%.
- **Master tracker:** [#102 — Zero-change startup architecture cleanup](https://github.com/codyking0602/ufc-goat-rankings/issues/102).
- **Visible product changes approved:** none.
- **Documentation PR / merge:** [#125](https://github.com/codyking0602/ufc-goat-rankings/pull/125), squash merge `0ded9ae67d415bb1cf5125eb6c0b429ce1dc5863`.
- **Recommended session state:** continue with one fresh identity/profile runtime branch. Stop at the exact installed-iPhone gate before merge.

## Phase 2 route and identity/profile status

Route ownership is now physically complete:

1. PR #128 added the canonical shell recovery-window queue and was merged as `63c00d5f16859bca54b9d68e665d55f852d0b93e` after exact head `71a73a4e7e6f9c6ca9486aa21c5e168f834d17da` passed installed-iPhone verification.
2. PR #129 removed the legacy `app.js` primary-tab listener and was merged as `fa47a51513c28bc3ba6173f1c95c47ca97ab85aa` after exact head `bd8065bbe1433575cf3ff042e6f630266dd1da1f` passed installed-iPhone verification.
3. `octagon-hq-shell.js` is the sole primary route-activation owner, and the permanent startup contract rejects reintroduction of the `app.js` listener.

The identity/profile audit is complete: [`PHASE-2-IDENTITY-PROFILE-OWNERSHIP-AUDIT.md`](./PHASE-2-IDENTITY-PROFILE-OWNERSHIP-AUDIT.md).

Its first isolated candidate is the returning-member Picks sign-in path. `play-profile-identity.js` is the canonical credential, fallback, identity-cache, readiness, and access-persistence owner. `picks-member-pin.js` must delegate authentication while retaining its Picks-specific card, validation/status copy, route continuation, member PIN settings, commissioner PIN management, observer, and status refresh.

No other identity/profile consolidation is authorized in that batch.

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
| 2A | Canonical shell recovery queue | #128 | `63c00d5f16859bca54b9d68e665d55f852d0b93e` | Exact tested head normal |
| 2B | Legacy `app.js` primary-tab listener removal | #129 | `fa47a51513c28bc3ba6173f1c95c47ca97ab85aa` | Exact tested head normal |

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

1. Start a fresh runtime branch from current `main` after this documentation audit merges.
2. Add a focused browser proof for the returning-member Picks login transaction before or with the runtime edit.
3. Extend `UFC_PLAY_PROFILE.login()` only as needed to return existing group/active-room continuation context and optionally suppress a redundant pre-navigation readiness event.
4. Change only the Picks returning-member login path to call the canonical owner; preserve its UI and route continuation.
5. Keep canonical-group migration, profile editing, community, activity, avatar, notification, product compatibility, PIN settings, commissioner PIN, routing, and sharing unchanged.
6. Run the complete Startup Architecture Gate and inspect unrelated red workflows without repairing them.
7. Freeze an immutable draft-PR head and stop for installed-iPhone verification before merge.

## Stop conditions for the next session

Stop or redesign before runtime merge if:

- the Picks module still calls a login RPC or writes access tokens after delegation;
- the canonical owner cannot preserve active-room/event continuation;
- delayed owner availability is not retryable;
- one accepted submit produces zero or multiple credential checks;
- shared profile modal login behavior changes;
- PIN status/change or commissioner PIN ownership moves;
- the change requires canonical-group, app-profile, community, activity, avatar, notification, product-architecture, native-shell, route-shell, sharing, scoring, data, UI, or product-copy edits;
- wrong-PIN recovery, stored access, profile readiness, cold-launch normalization, or installed-app behavior changes.
