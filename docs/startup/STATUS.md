# Startup Architecture Status

_Last updated: 2026-07-19_

## Overall status

- **Current phase:** Phase 1 — Make startup owners idempotent
- **Phase 0:** Functionally complete; permanent documentation is being finalized
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

Draft PR #100 currently proposes:

- one singleton guard in `assets/js/fresh-home-route-bootstrap.js`;
- one singleton guard in `assets/js/fresh-home-launch.js`;
- two startup-contract assertions.

The intended first execution remains identical. An accidental second execution exits before repeating route work or attaching duplicate behavior.

## Validation already observed for PR #100

Passed:

- startup JavaScript syntax;
- startup ownership and load-order contract;
- iOS standalone cold-start and lifecycle stability;
- profile sign-in startup stability;
- delayed Home/community stability;
- Phase 4B mobile/profile/Picks stability.

## Current caution

GitHub currently reports PR #100 as **not mergeable**. Do not merge it until the cause is identified and the branch is reconciled safely with current `main`.

## Existing unrelated red checks

These are tracked separately and must not be silently mixed into the startup runtime diff:

1. **Scoring Architecture Guardrails**
   - The scoring contract expects 73 fighters while production contains 80.
   - This is a stale scoring test contract, not a startup regression.

2. **Production Ranking Browser Smoke**
   - The run stops at the fighter-photo path audit before rendered ranking/startup certification.
   - This is outside the Phase 1 route-guard diff.

## Exact next action

1. Compare PR #100 with current `main` and determine why GitHub reports it as non-mergeable.
2. Reconcile the branch without expanding the runtime diff.
3. Re-run the startup-specific and mobile/profile checks.
4. Inventory the next startup owner only after this first batch is clean.

## Stop conditions

Stop and leave the PR draft if any of the following occurs:

- visible behavior changes;
- route timing changes;
- a new reload, polling, observer, or listener is introduced;
- the diff starts absorbing scoring, fighter-data, photo, or product work;
- installed-app behavior cannot be confidently verified.
