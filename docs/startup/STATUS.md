# Startup Architecture Status

_Last updated: 2026-07-19_

## Overall status

- **Current phase:** Phase 1 — Make startup owners idempotent
- **Phase 0:** Complete
- **Phase 1 runtime batches merged and physically verified:** 9
- **Latest verified runtime commit:** `4a811201bd6c2ac620d829d9701a187e468142b0`
- **Exact Batch 9 iPhone-tested head:** `1915c0ff314b7911688574f279eba889d4967a42`
- **Estimated entire cleanup progress:** approximately 38%
- **Master tracker:** [#102 — Zero-change startup architecture cleanup](https://github.com/codyking0602/ufc-goat-rankings/issues/102)
- **Visible product changes approved:** none
- **Major Phase 1 owner audit:** complete in [`PHASE-1-OWNER-AUDIT.md`](./PHASE-1-OWNER-AUDIT.md)
- **Recommended session state:** start a fresh chat before Batch 10; this file is the handoff source of truth

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

## Batch 9 closeout — Community profiles

PR #114 added a top-level global duplicate-file-execution guard to `assets/js/community-profiles.js` and one matching assertion to `scripts/test-startup-contract.mjs`.

The final runtime diff was:

- 4 additions;
- 0 deletions;
- 2 changed files;
- starting `main`: `bdacf8f10b913f5afad4ec6819921fd6f761e572`;
- exact physically tested PR head: `1915c0ff314b7911688574f279eba889d4967a42`;
- squash merge: `4a811201bd6c2ac620d829d9701a187e468142b0`.

Inspection proved that duplicate file evaluation was not an intentional prerequisite retry. The file has no top-level missing-DOM, missing-profile, or missing-identity return before publishing its API and binding its preserved lifecycle paths. The marker therefore remains immediately after `'use strict'`, before private state, listeners, storage, DOM, API, and rendering ownership.

The following legitimate paths remain callable through the original closure:

- one-time `DOMContentLoaded` startup;
- public `load()`, `refresh()`, `renderDirectory()`, `openMember()`, `openTop10()`, and `publishTop10()` APIs;
- `octagon-hq:view-change` and `octagon-hq:soft-refresh`;
- `ufc-play-profile-ready` and `ufc-app-profile-updated`;
- `ufc-picks-season-updated` and delayed Picks refresh;
- profile setup reminder callbacks;
- delayed challenge-picker wrapping;
- profile opening, closing, and reopening;
- Top 10 load, edit, save, local restoration, and return-to-profile behavior;
- Picks identity/token handoff and challenge-target cleanup.

Validation passed on the exact tested head:

- JavaScript syntax;
- startup ownership contract;
- focused duplicate-evaluation harness;
- exact first-run equivalence proof;
- full Startup Architecture Gate;
- iOS startup and route stability;
- profile sign-in stability;
- delayed Home/community stability;
- Phase 4B fresh-launch, directory, profile, Top 10, Picks PIN, and cold-launch browser validation;
- physical installed-iPhone cold launch, signed-in behavior, community/profile surfaces, saved Top 10, challenges, Picks handoff, notifications, badges, sharing, navigation, rapid taps, background/resume, relaunch, and rotation/resize.

Cody reported the exact tested head was **normal**. No duplicate directory/profile UI, reminders, listeners, observers, timers, saves, taps, route handling, blank state, flicker, stale state, or delayed instability was observed.

## Next Phase 1 batch

**Batch 10 owner: `assets/js/play.js` only.**

`play.js` is a prerequisite-aware owner. The current audit says it can intentionally exit when the Play panel or ranking data is absent, so Batch 10 must not place a marker before proving and preserving those prerequisites. Inspect whether the marker belongs after prerequisites pass, whether the existing `DOMContentLoaded` or other explicit lifecycle paths perform the legitimate retry, and whether duplicate file evaluation currently contributes any recovery behavior.

Batch 10 runtime scope is limited to:

- `assets/js/play.js`;
- one matching assertion in `scripts/test-startup-contract.mjs`, only if inspection proves a guard is safe.

Do not combine `play.js` with `play-hub.js`. The Play hub is the following separate prerequisite-aware batch.

## Existing unrelated red checks

1. **Scoring Architecture Guardrails**
   - The permanent source/runtime contract remains stale against current production scoring/data state.
   - The existing Alexandre Pantoja generic-fallback profile-copy warning remains outside startup work.

2. **Production Ranking Browser Smoke**
   - The run stops at existing women’s fighter-thumbnail rendering failures before its later ranking checks.
   - Batch 9 did not touch fighter photos, display overrides, rankings, or scoring.

3. **Picks UI Smoke**
   - Picks JavaScript syntax passes.
   - Existing static-contract findings remain separate from startup singleton work.

Do not repair these in a startup-owner PR unless a failure directly references the isolated changed lines.

## Exact next action

1. Start a fresh chat from current `main` and reread this file, `DECISIONS.md`, `OWNERS.md`, `PHASE-1-OWNER-AUDIT.md`, `TEST_PLAN.md`, and all current Issue #102 comments.
2. Verify and record the exact starting `main` SHA.
3. Inspect `assets/js/play.js` first-run and repeated-execution behavior, especially its prerequisite return, ranking-data readiness, DOM readiness, saved Top 10 state, blind-resume state, listeners, public APIs, sharing handoffs, Play hub handoffs, routes, lifecycle events, timers, and whether duplicate evaluation serves a retry.
4. Create a fresh Batch 10 branch directly from that verified `main`.
5. Keep the runtime diff to `assets/js/play.js` and one startup-contract assertion only if safe.
6. Open a draft PR and keep it draft until the exact head passes automated and physical iPhone verification.
7. Do not begin the Play hub batch during Batch 10.

## Stop conditions

Stop and leave Batch 10 unmodified or draft-only if:

- `play.js` duplicate evaluation appears to serve a legitimate prerequisite retry;
- a narrow marker cannot preserve missing-DOM or missing-ranking-data recovery;
- Top 10, blind resume, Games, saved state, Play navigation, sharing, routes, profile/Picks handoffs, mobile lifecycle, or surrounding product behavior changes;
- duplicate listeners, rendering, timers, APIs, saves, taps, routes, blank states, flicker, stale state, or delayed instability occurs;
- the diff expands beyond `assets/js/play.js` and its one startup-contract assertion;
- work begins on `play-hub.js`, scoring, fighter data, photos, presentation, or unrelated red checks.