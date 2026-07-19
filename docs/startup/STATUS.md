# Startup Architecture Status

_Last updated: 2026-07-19_

## Overall status

- **Current phase:** Phase 1 — Make startup owners idempotent
- **Phase 0:** Complete
- **Runtime merged to `main`:** none from Phase 1
- **Current runtime PR:** [#100 — Add zero-change singleton guards to route startup](https://github.com/codyking0602/ufc-goat-rankings/pull/100)
- **Master tracker:** [#102 — Zero-change startup architecture cleanup](https://github.com/codyking0602/ufc-goat-rankings/issues/102)
- **Visible product changes approved:** none

## What is already on `main`

- `docs/startup-architecture.md`
- `scripts/test-startup-contract.mjs`
- `.github/workflows/startup-architecture-gate.yml`
- permanent startup project handoff documentation in this directory

These changes document and test startup architecture. They do not change runtime behavior.

## Current Phase 1 batch

Draft PR #100 proposes:

- one singleton guard in `assets/js/fresh-home-route-bootstrap.js`;
- one singleton guard in `assets/js/fresh-home-launch.js`;
- two startup-contract assertions.

The intended first execution remains identical. An accidental second execution exits before repeating route work or attaching duplicate behavior.

## Branch state

- PR #100 is open, draft, and mergeable.
- The branch is based directly on current `main`.
- It is 0 commits behind.
- The diff remains exactly 8 additions across 3 files.

## Refreshed validation for PR #100

Passed:

- startup JavaScript syntax;
- startup ownership and load-order contract;
- iOS standalone cold-start and lifecycle stability;
- profile sign-in startup stability;
- delayed Home/community stability;
- Phase 4B mobile/profile/Picks stability.

## Remaining merge gate

The project rules require installed-iPhone verification before merging routing or lifecycle-sensitive startup changes.

PR #100 therefore remains draft even though the automated startup and mobile checks are green.

Manual verification should confirm:

- cold launch from fully closed;
- launch after previously leaving the app on Picks or another non-Home destination;
- background and resume;
- no route bounce, blank screen, duplicate reminder, duplicate tap handling, or navigation flicker.

## Existing unrelated red checks

These remain separate from the startup runtime diff:

1. **Scoring Architecture Guardrails**
   - The scoring contract expects 73 fighters while production contains 80.
   - This is a stale scoring test contract, not a startup regression.

2. **Production Ranking Browser Smoke**
   - The run stops at the fighter-photo path audit before rendered ranking/startup certification.
   - This is outside the Phase 1 route-guard diff.

## Phase 1 audit finding

`assets/js/octagon-hq-shell.js` already protects repeated calls through its `started` and `eventsBound` state and disconnects/replaces its navigation observers. However, those guards are closure-scoped, so a truly duplicated script execution would create a second closure. This is the leading candidate for the next small Phase 1 audit batch, but no additional runtime change should be opened until PR #100 clears its installed-app gate.

## Exact next action

1. Perform installed-iPhone verification of PR #100 through an appropriate preview/deployment path.
2. Record the result in PR #100 and this file.
3. Merge only if visible behavior is unchanged.
4. Then audit `octagon-hq-shell.js` as the next possible idempotence owner.

## Stop conditions

Stop and leave the PR draft if any of the following occurs:

- visible behavior changes;
- route timing changes;
- a new reload, polling, observer, or listener is introduced;
- the diff starts absorbing scoring, fighter-data, photo, or product work;
- installed-app behavior cannot be confidently verified.
