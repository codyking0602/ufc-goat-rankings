# Startup Architecture Status

_Last updated: 2026-07-19_

## Overall status

- **Current phase:** Phase 1 — Make startup owners idempotent
- **Phase 0:** Complete
- **Phase 1 runtime merged to `main`:** PR #100, commit `5e733cc4568100e96080ce27ad601b7022daba33`
- **Master tracker:** [#102 — Zero-change startup architecture cleanup](https://github.com/codyking0602/ufc-goat-rankings/issues/102)
- **Visible product changes approved:** none
- **Major Phase 1 owner audit:** complete in [`PHASE-1-OWNER-AUDIT.md`](./PHASE-1-OWNER-AUDIT.md)

## Completed Phase 1 batch 1

PR #100 added:

- one global duplicate-start guard to `assets/js/fresh-home-route-bootstrap.js`;
- one global duplicate-start guard to `assets/js/fresh-home-launch.js`;
- two startup-contract assertions.

The first execution path is unchanged. Only an accidental second execution exits early.

Final merged diff:

- 8 additions;
- 0 deletions;
- 3 files;
- directly based on current `main` before merge.

## Validation completed before merge

Passed on head `86c2cba7ce83ce6ef4a824cf79634e006dd53f5c`:

- startup JavaScript syntax;
- startup ownership and load-order contract;
- iOS standalone cold-start and lifecycle browser simulation;
- profile sign-in startup stability;
- delayed Home/community stability;
- Phase 4B mobile/profile/Picks stability.

Retained CI proof recorded:

- one product architecture script;
- one native shell script;
- one notification surface script;
- one bottom navigation;
- one stable community directory;
- successful Top 10 save;
- correct Home cold launch;
- correct Picks resume route.

## Preview failure and rollout decision

The separate-origin static preview was rejected as a physical-test environment. It did not load the full mobile/native shell and visibly showed the desktop navigation fallback, incorrect current ordering, and an incomplete production presentation.

That preview failure was not treated as an app regression. Source comparison proved the PR differed from current `main` only by the exact eight-line guard/test diff.

Because the change was guard-only, first-run-identical, current with `main`, fully green in the relevant automated suites, and immediately reversible, it was merged for controlled verification on the real GitHub Pages installation.

## Current required action — live installed-iPhone verification

Do not use or sign into the rejected preview.

After GitHub Pages serves commit `5e733cc`, verify the real installed Octagon HQ app:

1. Fully close and reopen it.
2. Confirm the current mobile presentation appears, with no desktop tab fallback or duplicated navigation.
3. Open Picks, background the app, resume it, then fully close and reopen it.
4. Navigate through Home, Rankings, Play, Picks, Intelligence, and War Room.
5. Confirm no blank screen, flicker, route bounce, duplicate reminder, duplicated bottom navigation, or double-handled tap.
6. Sign in only in the real live app after the shell looks correct, then confirm profile and War Room behavior.

If any relevant regression appears, revert merge commit `5e733cc4568100e96080ce27ad601b7022daba33` immediately and leave the next runtime batch unopened.

## Next runtime owner

`assets/js/octagon-hq-shell.js` is the next isolated candidate.

That batch must contain only:

- one global duplicate-start marker;
- one startup-contract assertion;
- no visible behavior change;
- no other startup owner.

It remains blocked until the live installed-iPhone verification of PR #100 passes.

## Existing unrelated red checks

These remain outside startup cleanup:

1. **Scoring Architecture Guardrails** — stale contract expects 73 fighters while production contains 80.
2. **Production Ranking Browser Smoke** — stops at the fighter-photo path audit before rendered startup certification.

## Exact continuation rule

After Cody reports the real installed app is stable:

1. record the live verification result here and on issue #102;
2. mark Phase 1 batch 1 fully complete;
3. open the isolated `octagon-hq-shell.js` guard batch;
4. keep one owner per PR and preserve the zero-change contract.
