# Startup Architecture Status

_Last updated: 2026-07-19_

## Overall status

- **Current phase:** Phase 1 — Make startup owners idempotent
- **Phase 0:** Complete
- **Phase 1 runtime batches merged and physically verified:** 12
- **Latest verified runtime commit:** `e332f46ec63c6698fdebd8ecc843c3f0df4eaabd`
- **Exact Batch 11 iPhone-tested head:** `ad0e84e4069224270db8186aa771216af90343b4`
- **Estimated entire cleanup progress:** approximately 45%
- **Master tracker:** [#102 — Zero-change startup architecture cleanup](https://github.com/codyking0602/ufc-goat-rankings/issues/102)
- **Visible product changes approved:** none
- **Major Phase 1 owner audit:** complete in [`PHASE-1-OWNER-AUDIT.md`](./PHASE-1-OWNER-AUDIT.md)
- **Recommended session state:** start a fresh chat before the production-ranking-bootstrap lifecycle batch; this file is the handoff source of truth

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

## Batch 11 closeout — Sharing and incoming deep-link ownership

PR #121 added a top-level duplicate-file-execution guard to `assets/js/share-deep-links.js` and one matching assertion to `scripts/test-startup-contract.mjs`.

Final runtime record:

- starting `main`: `9743808a9a3200426f26099209c8f8e57ef32851`;
- exact physically tested PR head: `ad0e84e4069224270db8186aa771216af90343b4`;
- squash merge: `e332f46ec63c6698fdebd8ecc843c3f0df4eaabd`;
- 5 additions;
- 0 deletions;
- 2 changed files;
- original `share-deep-links.js` blob: `67979699403b6539d798ca3cf72c37bc42c60e21`;
- guarded `share-deep-links.js` blob: `4716ae05270dd0f6d24c2973af058d4e15f383a3`;
- original startup-contract blob: `dd426780dfdacdf1a9aa7848bcc0fc627ea5b627`;
- guarded startup-contract blob: `b67f87807be533b346e15254dc1041b77bda1a3b`.

The owner has no top-level missing-DOM, missing-data, missing-route-owner, or missing-browser-API return before successful ownership begins. The marker is immediately after `'use strict'` and before `VERSION`, private state, API publication, DOM work, listeners, observers, timers, URL reads, outgoing sharing, or incoming-route handling.

Duplicate file evaluation was proven not to be an intentional prerequisite-recovery path. Legitimate later work remains owned by:

- the existing once-only `DOMContentLoaded` path;
- 40, 180, 700, and 1800 millisecond patch, observer, and decoration passes;
- the 80 millisecond initial incoming-route pass;
- `ufc-production-ranking-ready`;
- `popstate`;
- fighter-profile and War Room MutationObservers;
- public `window.UFC_SHARE_LINKS` APIs;
- route-specific `wait(...)` retry loops.

The exact first-run owner remains unchanged:

- `window.UFC_SHARE_LINKS` publication and `data-share-deep-links` state;
- fighter profile canvas/file sharing;
- Find the Leader result sharing;
- Picks recap sharing;
- War Room message sharing;
- native Web Share success, cancellation, and rejection behavior;
- secure clipboard and hidden-textarea copy fallbacks;
- profile and War Room decoration;
- two document click listeners, including the capture-phase Picks recap owner;
- two MutationObservers when the relevant mounts exist;
- five initial timers;
- production-ranking-ready and `popstate` listeners;
- fighter, Find the Leader, Play challenge, Picks event, and War Room incoming routing;
- existing Rankings, Play, profile-challenge, Picks, War Room, profile, sharing, and native-shell handoffs.

Focused proof established:

- removing only the two marker lines reproduces the original runtime byte-for-byte;
- original and guarded first-run traces are equivalent;
- missing optional DOM and APIs recover through existing delayed, event, observer, public-API, and route-wait paths without file re-evaluation;
- deliberate duplicate evaluation adds zero listeners, timers, intervals, observers, API replacement, URL work, route work, share handling, clipboard writes, or native share sheets;
- original duplicate evaluation created a second private closure, four additional listeners, five timers, two observers when mounts existed, replacement API ownership, and a fresh route key;
- native share success, cancellation, rejection fallback, secure clipboard fallback, and `execCommand` fallback remain unchanged;
- outgoing fighter, Find the Leader, Picks, and War Room payloads remain unchanged;
- all five supported incoming route types activate once;
- malformed and unsupported links do not activate a destination;
- failed incoming routes remain retryable;
- `popstate` handles a newly navigated supported link once;
- no history or location mutation is introduced.

Validation passed on exact head `ad0e84e4069224270db8186aa771216af90343b4`:

- JavaScript syntax;
- startup ownership contract;
- focused exact-original and duplicate-execution harness;
- Startup Architecture Gate #32;
- iOS startup route stability;
- profile sign-in startup stability;
- delayed Home/community stability.

Unrelated red checks were inspected but not repaired:

- Scoring Architecture Guardrails #1265 retained stale 73-versus-80 roster/facts expectations, stale Henry Cejudo and Royce Gracie rank expectations, category-audit baseline diagnostics, and Alexandre Pantoja display diagnostics;
- Production Ranking Browser Smoke #447 retained the existing 14 women’s leaderboard thumbnail render failures.

Cody physically tested exact immutable head `ad0e84e4069224270db8186aa771216af90343b4` and reported **“Normal.”** No visible regression, blank state, flicker, route bounce, stale or lost state, duplicate UI, double action, duplicate share sheet, duplicate clipboard write, repeated incoming route, repeated URL handling, duplicate ownership, or failed prerequisite recovery was observed.

## Next Phase 1 batch

**Next isolated owner: `assets/js/production-ranking-bootstrap.js` only.**

This is not a standard guard batch. The owner remains classified as **retry semantics required**. Do not add a naive top-level marker.

The next batch must first design and prove an intentional apply/retry lifecycle that preserves:

- ordered canonical calculation dependency loading;
- script-attribute and source checks;
- canonical data, scoring calculator, and ranking-pipeline readiness;
- calculated production rebuild and refresh behavior;
- all current success, failure, and delayed-readiness events;
- app refresh and generated production feed handoffs;
- any current accidental second-evaluation recovery that must be replaced by an explicit callable path;
- no duplicate script loading, rebuild, event dispatch, app refresh, or scoring state transition.

`app.js` remains a structural manifest singleton and must not receive a standard IIFE guard.

## Existing unrelated red checks

1. **Scoring Architecture Guardrails**
   - Existing stale roster/rank expectations and Alexandre Pantoja diagnostics remain outside startup work.

2. **Production Ranking Browser Smoke**
   - Existing women’s fighter-thumbnail rendering failures remain separate from startup ownership.

3. **Picks UI and production certification diagnostics**
   - Existing static-contract and ranking expectation findings remain separate.

Do not repair these in a startup-owner PR unless a failure directly references the isolated changed lines.

## Exact next action

1. Start a fresh chat from current `main` and reread `STATUS.md`, `DECISIONS.md`, `OWNERS.md`, `PHASE-1-OWNER-AUDIT.md`, `TEST_PLAN.md`, and every current Issue #102 comment.
2. Verify and record the exact starting `main` SHA.
3. Inspect `assets/js/production-ranking-bootstrap.js`, its dynamic dependency order, its complete current retry behavior, and only directly invoked scoring/bootstrap/app-refresh owners.
4. Prove whether duplicate evaluation currently provides legitimate prerequisite or failure recovery.
5. Design an explicit callable apply/retry lifecycle before blocking any second evaluation.
6. Keep the runtime batch isolated to the production bootstrap and the minimum matching contract/test proof justified by inspection.
7. Open a draft PR and require exact-head automated and physical-device verification if lifecycle, routing, app refresh, or installed behavior can be affected.
8. Do not begin Phase 2, Phase 3, or unrelated scoring/product cleanup.

## Stop conditions

Stop and leave the production bootstrap unchanged or draft-only if:

- a safe explicit retry lifecycle cannot replace necessary second-evaluation recovery;
- dependency loading order or canonical source ownership changes;
- calculated rankings, visible scores, ranks, profiles, or production feeds change;
- app refresh timing, ready events, failure events, or retry behavior changes;
- scripts, rebuilds, events, refreshes, listeners, timers, or state transitions duplicate;
- blank state, flicker, stale ranking data, route bounce, or delayed instability appears;
- the runtime diff expands into `app.js`, scoring formulas, fighter data, presentation, photos, or unrelated checks;
- another startup owner or later cleanup phase begins.
