# Startup Architecture Status

_Last updated: 2026-07-19_

## Overall status

- **Current phase:** Phase 1 — Make startup owners idempotent
- **Phase 0:** Complete
- **Phase 1 runtime batches merged and physically verified:** 10
- **Latest verified runtime commit:** `2040f604892c067ee288fe88df15594a570ac396`
- **Exact Batch 10A iPhone-tested head:** `6eac38e575dd778a5b4e42fe5b83283723df1847`
- **Estimated entire cleanup progress:** approximately 40%
- **Master tracker:** [#102 — Zero-change startup architecture cleanup](https://github.com/codyking0602/ufc-goat-rankings/issues/102)
- **Visible product changes approved:** none
- **Major Phase 1 owner audit:** complete in [`PHASE-1-OWNER-AUDIT.md`](./PHASE-1-OWNER-AUDIT.md)
- **Recommended session state:** start a fresh chat before the separate `play-hub.js` batch; this file is the handoff source of truth

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

## Batch 10A closeout — Play base runtime

PR #115 added a prerequisite-aware duplicate-file-execution guard to `assets/js/play.js` and one matching assertion to `scripts/test-startup-contract.mjs`.

Final runtime record:

- starting `main`: `67b3cc9d94ca28641f4ba1ce4378b19fa08f985c`;
- exact physically tested PR head: `6eac38e575dd778a5b4e42fe5b83283723df1847`;
- squash merge: `2040f604892c067ee288fe88df15594a570ac396`;
- 4 additions;
- 0 deletions;
- 2 changed files;
- original `play.js` blob: `f7aff84b33c847d825f5fa0207549572582c5096`;
- guarded `play.js` blob: `dd3cb93abeecd92897c4fe2beb734e4a6148acfc`;
- original startup-contract blob: `af9d23224988be205becc284bcb0f0a70433edea`;
- guarded startup-contract blob: `95e77fcb7e66e982ad5dc7bbabdaaf1a4938261d`.

The required prerequisites are the static `#play` panel and `window.RANKING_DATA.men` as an array. The marker remains after the existing prerequisite return and before `const state`, whose `loadTop10()` call is the first storage and successful-owner work.

This preserves the legitimate recovery path:

- a failed execution caused by missing Play DOM or ranking data does not set the marker;
- a later file execution after prerequisites appear may initialize normally;
- only a second execution after one successful initialization is blocked.

Successful first-run ownership remains unchanged:

- 14 element listeners;
- two ranking-ready window listeners;
- one 1400 ms refresh timeout;
- zero observers;
- zero intervals;
- zero dynamic script loads;
- base Top 10 restoration, editing, reordering, saving, comparison, and sharing;
- base blind-resume pairing, selection, reveal, score, and next-round behavior.

Validation passed on the exact tested head:

- JavaScript syntax;
- startup ownership contract;
- exact-source missing-prerequisite and duplicate-execution harness;
- byte-for-byte first-run equivalence after removing only the marker lines;
- complete Startup Architecture Gate;
- iOS route and lifecycle stability;
- profile sign-in and Picks continuation;
- delayed Home/community stability;
- physical installed-iPhone cold launch, Play entry/exit, signed-in and signed-out behavior, Top 10 persistence, blind resume, navigation, handoffs, sharing, notifications, badges, background/resume, relaunch, rapid taps, and rotation/resize.

Cody reported the exact tested head was **normal**. No blank screen, flicker, route bounce, lost Top 10 state, stale game state, duplicate game UI, duplicated taps, double saves, failed prerequisite recovery, or duplicate listener/timer/render ownership was observed.

## Next Phase 1 batch

**Next isolated owner: `assets/js/play-hub.js` only.**

`play-hub.js` remains a separate prerequisite-aware batch. Do not combine it with another owner or revisit `play.js` unless a direct regression is found.

The next batch must inspect and preserve:

- Play DOM prerequisites and load order;
- daily-random and saved daily-state restoration;
- hub and game-card rendering ownership;
- Games navigation and route handoffs;
- Home, Play, profile, Picks, Rankings, Intelligence, War Room, sharing, notification, and native-shell handoffs;
- all listeners, observers, timers, storage, dynamic loading, public APIs, and retry paths;
- recovery after an unsuccessful prerequisite attempt.

## Existing unrelated red checks

1. **Scoring Architecture Guardrails**
   - Existing stale roster/rank expectations and Alexandre Pantoja diagnostics remain outside startup work.

2. **Production Ranking Pipeline**
   - Existing certification expectation mismatch remains separate from startup ownership.

3. **Production Ranking Browser Smoke**
   - The run stops at existing women’s fighter-thumbnail rendering failures before later ranking checks.

4. **Picks UI Smoke**
   - Existing static-contract findings remain separate from startup singleton work.

Do not repair these in a startup-owner PR unless a failure directly references the isolated changed lines.

## Exact next action

1. Start a fresh chat from current `main` and reread `STATUS.md`, `DECISIONS.md`, `OWNERS.md`, `PHASE-1-OWNER-AUDIT.md`, `TEST_PLAN.md`, and current Issue #102 comments.
2. Verify and record the exact starting `main` SHA.
3. Inspect `assets/js/play-hub.js` and only its directly relevant Play/game/navigation prerequisites and handoffs.
4. Create a fresh isolated branch directly from current `main`.
5. Proceed only if a prerequisite-aware guard preserves failed-attempt recovery and exact first-run behavior.
6. Keep the runtime diff to `assets/js/play-hub.js` and one matching startup-contract assertion.
7. Open a draft PR and require exact-head automated and installed-iPhone verification before merge.
8. Do not begin any later owner or unrelated cleanup.

## Stop conditions

Stop and leave the next batch unmodified or draft-only if:

- duplicate evaluation appears to serve an intentional prerequisite retry;
- a failed prerequisite attempt would set the successful marker;
- a later execution cannot recover after prerequisites appear;
- daily randomness, saved game state, game presentation, navigation, routes, handoffs, or first-run behavior changes;
- duplicate listeners, observers, timers, intervals, storage, APIs, rendering, taps, or saves occur;
- the diff expands beyond `play-hub.js` and its one matching startup-contract assertion;
- unrelated product, scoring, fighter-data, photo, presentation, or red-check work begins.
