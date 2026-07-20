# Startup Architecture Status

_Last updated: 2026-07-19_

## Overall status

- **Current phase:** Phase 1 — Make startup owners idempotent
- **Phase 0:** Complete
- **Phase 1 runtime batches merged and physically verified:** 11
- **Latest verified runtime commit:** `b1a7a3c92c2f7c13b64b4d68df3d26e4e9afbec8`
- **Exact Batch 10B iPhone-tested head:** `35bc9a750cdbdfb2cec69b2e17d954b95b1ca8fc`
- **Estimated entire cleanup progress:** approximately 42%
- **Master tracker:** [#102 — Zero-change startup architecture cleanup](https://github.com/codyking0602/ufc-goat-rankings/issues/102)
- **Visible product changes approved:** none
- **Major Phase 1 owner audit:** complete in [`PHASE-1-OWNER-AUDIT.md`](./PHASE-1-OWNER-AUDIT.md)
- **Recommended session state:** start a fresh chat before the `share-deep-links.js` batch; this file is the handoff source of truth

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

## Batch 10B closeout — Play Hub startup ownership

PR #119 added a prerequisite-aware duplicate-file-execution guard to `assets/js/play-hub.js` and one matching assertion to `scripts/test-startup-contract.mjs`.

Final runtime record:

- starting `main`: `e48a36c464a25f9f6d336435e2ba876f10177a85`;
- exact physically tested PR head: `35bc9a750cdbdfb2cec69b2e17d954b95b1ca8fc`;
- squash merge: `b1a7a3c92c2f7c13b64b4d68df3d26e4e9afbec8`;
- 4 additions;
- 0 deletions;
- 2 changed files;
- original `play-hub.js` blob: `84f7a556efef0f9964ffc459009c166673216218`;
- guarded `play-hub.js` blob: `0831bd2d58c04dd683a72c3178596ea43aca0f2b`;
- original startup-contract blob: `95e77fcb7e66e982ad5dc7bbabdaaf1a4938261d`;
- guarded startup-contract blob: `dd426780dfdacdf1a9aa7848bcc0fc627ea5b627`.

The required startup prerequisites are the five static Play DOM elements:

1. `#play`;
2. `.play-shell`;
3. `.section-title`;
4. `[data-play-mode="top10"]`;
5. `[data-play-mode="blind"]`.

The marker remains immediately after the existing prerequisite return and before native-random capture and private hub state. Missing-prerequisite execution leaves the marker unset and creates no listeners, timers, intervals, observers, storage activity, DOM ownership, API publication, rendering, or script loading. A later file evaluation can initialize normally after the missing DOM appears. Only later evaluation after one successful initialization is blocked.

The exact first-run owner remains unchanged:

- private hub, daily and opening state;
- native-random capture, daily seeded-random activation, and native-random restoration;
- creation and insertion of `#playHub` and `#playGameNav`;
- initial Hub rendering, shell visibility, subtitle and screen state;
- current six-tab listener footprint;
- optional Blind Resume era observer and zero-delay sync;
- current daily-context restoration or once-only shared-ready recovery;
- zero intervals, direct storage operations, and dynamic script loads;
- Top 10, Blind Resume, Better Than, Find the Leader, daily challenge, Games, profile, Picks, sharing, shell, and native-navigation handoffs;
- unchanged `window.UFC_PLAY_HUB` API and custom events.

Focused proof established:

- all five missing-DOM cases leave zero ownership and recover on a later execution;
- optional APIs and datasets are not incorrectly promoted to startup prerequisites;
- removing only the two marker lines reproduces the original runtime byte-for-byte;
- guarded and original first-run ownership traces are equivalent;
- daily game choice, restoration, seeded randomness, initial mode, navigation, routes, rendering, listeners, timers, observer, APIs, and handoffs are unchanged;
- deliberate duplicate execution adds zero listeners, timers, intervals, observers, storage restoration, API replacement, rendering, game selection, route handling, tap handling, saves, or state transitions;
- important Play actions still fire once.

Validation passed on the exact tested head:

- JavaScript syntax;
- startup ownership contract;
- focused prerequisite and duplicate-execution harness;
- Startup Architecture Gate #30;
- iOS startup route stability;
- profile sign-in startup stability;
- delayed Home/community stability;
- installed-iPhone cold launch, Home/top/bottom Play entry, leave and return, rapid Play activation, signed-out and signed-in behavior, daily restoration and selection, game cards, Top 10, Blind Resume, profile/Picks/sharing handoffs, navigation, notifications, badges, background/resume, relaunch, rotation/resize, rapid taps, and delayed stability.

Cody physically tested exact immutable head `35bc9a750cdbdfb2cec69b2e17d954b95b1ca8fc` and reported **“Normal.”** No visible regression, blank state, flicker, route bounce, stale or lost state, duplicate UI, double action, duplicate game choice, duplicate route, duplicate save, duplicate ownership, or failed prerequisite recovery was observed.

## Next Phase 1 batch

**Next isolated owner: `assets/js/share-deep-links.js` only.**

Start from fresh current `main`. Do not combine sharing/deep-link ownership with another owner or begin Phase 2/3 cleanup.

The next batch must inspect and preserve:

- `DOMContentLoaded` versus immediate startup behavior;
- profile and War Room observers;
- delayed patch/decorate passes and incoming route timer;
- public `window.UFC_SHARE_LINKS` API;
- profile, Find the Leader, Play challenge, Picks event, and War Room link routing;
- native share, clipboard fallback, share-card generation, and toast ownership;
- ranking-ready and `popstate` retry paths;
- current route de-duplication state;
- signed-in/signed-out, installed-app, background/resume, rotation/resize, and delayed stability boundaries;
- whether duplicate file evaluation is or is not an intentional prerequisite recovery mechanism.

## Existing unrelated red checks

1. **Scoring Architecture Guardrails**
   - Existing stale roster/rank expectations and Alexandre Pantoja diagnostics remain outside startup work.

2. **Production Ranking Browser Smoke**
   - Existing women’s fighter-thumbnail rendering failures remain separate from startup ownership.

3. **Picks UI and production certification diagnostics**
   - Existing static-contract and ranking expectation findings remain separate.

Do not repair these in a startup-owner PR unless a failure directly references the isolated changed lines.

## Exact next action

1. Start a fresh chat from current `main` and reread `STATUS.md`, `DECISIONS.md`, `OWNERS.md`, `PHASE-1-OWNER-AUDIT.md`, `TEST_PLAN.md`, and current Issue #102 comments.
2. Verify and record the exact starting `main` SHA.
3. Inspect `assets/js/share-deep-links.js` and only its directly relevant profile, Play, Picks, War Room, route, sharing, and native-shell handoffs.
4. Create a fresh isolated branch directly from current `main`.
5. Document every top-level path and prove whether duplicate evaluation currently provides prerequisite recovery.
6. Add a guard only at a proven safe ownership boundary and one matching startup-contract assertion.
7. Open a draft PR and require exact-head automated and installed-iPhone verification before merge.
8. Do not begin another startup owner or unrelated cleanup.

## Stop conditions

Stop and leave the next owner unchanged or draft-only if:

- duplicate evaluation appears necessary for legitimate prerequisite recovery and no narrow marker placement preserves it;
- profile, Find the Leader, Play challenge, Picks event, or War Room incoming routing changes;
- native sharing, clipboard fallback, generated cards, toasts, observers, delayed passes, ranking-ready retries, or `popstate` behavior changes;
- duplicate listeners, observers, timers, APIs, rendering, route handling, shares, or decorations occur;
- blank state, flicker, route bounce, stale state, or delayed instability appears;
- the runtime diff expands beyond the isolated share owner and one matching startup-contract assertion;
- unrelated product, scoring, fighter-data, photo, presentation, or red-check work begins.
