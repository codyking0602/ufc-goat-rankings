# Startup Architecture Status

_Last updated: 2026-07-19_

## Overall status

- **Current phase:** Phase 1 — Make startup owners idempotent
- **Phase 0:** Complete
- **Phase 1 runtime batches merged and verified:** 1
- **Latest verified runtime commit:** `5e733cc4568100e96080ce27ad601b7022daba33`
- **Current runtime PR:** [#105 — Guard the canonical app shell against duplicate execution](https://github.com/codyking0602/ufc-goat-rankings/pull/105)
- **Current PR head:** `cf4b580aa6c0be6c15772d8818cabb772fa448e1`
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

The third-party immutable preview was rejected before sign-in because it failed to load the full production mobile/native shell. It is not an approved preview method for future startup batches.

## Phase 1 batch 2 — Ready for physical gate

Draft PR #105 changes only:

- `assets/js/octagon-hq-shell.js`: top-level global duplicate-file-execution guard;
- `scripts/test-startup-contract.mjs`: one matching assertion.

Exact diff:

- 4 additions;
- 0 deletions;
- 2 files;
- no route rules, timing, navigation labels, views, styles, product data, or feature behavior changed.

Why it is needed:

The shell's existing `started` and `eventsBound` flags protect repeated calls inside one evaluation. They do not protect against the entire file being evaluated again, which would create a second closure with separate listeners and observers.

## Batch 2 automated validation

Passed on head `cf4b580aa6c0be6c15772d8818cabb772fa448e1`:

- JavaScript syntax;
- startup ownership contract;
- iOS startup route stability;
- profile sign-in startup stability;
- delayed Home/community stability.

The older Phase 4B preview workflow does not apply to this PR because it explicitly assumes `octagon-hq-shell.js` is unchanged. Its mobile, profile, Picks, and Home scenarios are already represented inside the Startup Architecture Gate for this batch.

## Existing unrelated red checks

1. **Scoring Architecture Guardrails**
   - The scoring contract expects 73 fighters while production contains 80.
   - This is a stale scoring test contract, not a startup regression.

2. **Production Ranking Browser Smoke**
   - The run stops at the fighter-photo path audit before rendered ranking/startup certification.
   - This is outside the startup singleton-guard diff.

## Exact next action — Cody's iPhone required

PR #105 remains draft and unmerged.

A faithful isolated installed-PWA preview is not available. Do not reuse the rejected third-party static preview.

Before merge, verify through an approved controlled deployment path that the real installed app preserves:

- current mobile presentation and one bottom navigation;
- Home, Rankings, Play, Picks, War Room, and Intelligence ordering;
- Overall, Women, Divisions, and Categories ranking subviews;
- Picks background/resume and relaunch behavior;
- War Room access/disabled state and label;
- one-tap navigation with no route bounce, blank screen, or duplicated handling.

Only after that physical result is recorded may PR #105 be merged.

## Stop conditions

Stop and leave PR #105 draft if any of the following occurs:

- visible behavior changes;
- route timing or active-view behavior changes;
- rankings subview state changes;
- War Room access or label state changes;
- a blank screen, route bounce, duplicate listener effect, duplicated navigation shell, or double tap occurs;
- the diff starts absorbing scoring, fighter-data, photo, or product work;
- installed-app behavior cannot be confidently verified.
