# Startup Architecture Status

_Last updated: 2026-07-19_

## Overall status

- **Current phase:** Phase 1 — Make startup owners idempotent
- **Phase 0:** Complete
- **Phase 1 runtime batches merged:** 1
- **Latest merged runtime PR:** [#100 — Add zero-change singleton guards to route startup](https://github.com/codyking0602/ufc-goat-rankings/pull/100)
- **Latest verified runtime commit:** `5e733cc4568100e96080ce27ad601b7022daba33`
- **Master tracker:** [#102 — Zero-change startup architecture cleanup](https://github.com/codyking0602/ufc-goat-rankings/issues/102)
- **Visible product changes approved:** none
- **Major Phase 1 owner audit:** complete in [`PHASE-1-OWNER-AUDIT.md`](./PHASE-1-OWNER-AUDIT.md)

## Phase 1 batch 1 — Complete

PR #100 added only:

- one singleton guard in `assets/js/fresh-home-route-bootstrap.js`;
- one singleton guard in `assets/js/fresh-home-launch.js`;
- two startup-contract assertions.

Final diff:

- 8 additions;
- 0 deletions;
- 3 files;
- no HTML, CSS, data, scoring, navigation-rule, timing, product, or visual changes.

## Batch 1 validation

Passed before merge:

- startup JavaScript syntax;
- startup ownership and load-order contract;
- iOS Home startup and lifecycle browser simulation;
- profile sign-in startup stability;
- delayed Home/community stability;
- Phase 4B mobile/profile/Picks stability.

Passed after deployment on Cody's real installed iPhone app:

- current mobile presentation loaded normally;
- no desktop-tab fallback;
- no duplicate bottom navigation;
- cold launch looked normal;
- no visible regression reported.

The third-party immutable preview was rejected before sign-in because it failed to load the full production mobile/native shell and visibly showed the desktop fallback. It is not an approved preview method for future startup batches.

## Current Phase 1 batch

The next isolated runtime owner is `assets/js/octagon-hq-shell.js`.

Allowed diff for this batch:

- one global duplicate-file-execution marker near the top of `octagon-hq-shell.js`;
- one matching assertion in `scripts/test-startup-contract.mjs`;
- no other runtime owner;
- no visible behavior change.

The shell already protects repeated API calls through closure-scoped `started` and `eventsBound` state. The new marker protects against the entire script file being evaluated a second time, which would otherwise create a second closure, listeners, and observers.

## Existing unrelated red checks

These remain separate from startup work:

1. **Scoring Architecture Guardrails**
   - The scoring contract expects 73 fighters while production contains 80.
   - This is a stale scoring test contract, not a startup regression.

2. **Production Ranking Browser Smoke**
   - The run stops at the fighter-photo path audit before rendered ranking/startup certification.
   - This is outside the startup singleton-guard diffs.

## Exact next action

1. Create a fresh branch from current `main`.
2. Add only the `octagon-hq-shell.js` global marker and its contract assertion.
3. Confirm the diff is limited to those two files.
4. Run Startup Architecture Gate, iOS startup stability, and Phase 4B mobile/profile/Picks validation.
5. Keep the PR draft until Cody physically verifies the real installed app through a controlled deployment path.
6. Merge only if navigation, rankings subviews, Picks resume, War Room access state, and installed-app presentation remain unchanged.

## Stop conditions

Stop and leave the new PR draft if any of the following occurs:

- visible behavior changes;
- route timing or active-view behavior changes;
- rankings subview state changes;
- War Room access or label state changes;
- a blank screen, route bounce, duplicate listener effect, duplicated navigation shell, or double tap occurs;
- the diff starts absorbing scoring, fighter-data, photo, or product work;
- installed-app behavior cannot be confidently verified.
