# Startup Architecture Status

_Last updated: 2026-07-19_

## Overall status

- **Current phase:** Phase 1 — Make startup owners idempotent
- **Phase 0:** Complete
- **Runtime merged to `main`:** none from Phase 1
- **Current runtime PR:** [#100 — Add zero-change singleton guards to route startup](https://github.com/codyking0602/ufc-goat-rankings/pull/100)
- **Master tracker:** [#102 — Zero-change startup architecture cleanup](https://github.com/codyking0602/ufc-goat-rankings/issues/102)
- **Visible product changes approved:** none
- **Major Phase 1 owner audit:** complete and documented in [`PHASE-1-OWNER-AUDIT.md`](./PHASE-1-OWNER-AUDIT.md)

## What is already on `main`

- `docs/startup-architecture.md`
- `scripts/test-startup-contract.mjs`
- `.github/workflows/startup-architecture-gate.yml`
- permanent startup project handoff documentation in this directory
- complete major-owner classification and runtime sequence
- PR #100 installed-iPhone test procedure

These changes document and test startup architecture. They do not change production runtime behavior.

## Current Phase 1 runtime batch

Draft PR #100 proposes:

- one singleton guard in `assets/js/fresh-home-route-bootstrap.js`;
- one singleton guard in `assets/js/fresh-home-launch.js`;
- two startup-contract assertions.

The intended first execution remains identical. An accidental second execution exits before repeating route work or attaching duplicate behavior.

## Tested snapshot and branch state

- Frozen phone-test commit: `8136c728f5794229273b8a2c5ce9f291eeaf30db`.
- The runtime comparison remains exactly 8 additions across 3 files.
- PR #100 is open, draft, and currently mergeable.
- `main` has ten newer documentation-only startup commits.
- The PR head will remain frozen until the physical test is complete so the tested snapshot does not change.

After a physical pass, reconcile current `main` into the branch, confirm the comparison still contains only the same three runtime files and eight additions, rerun CI, and only then merge.

## Refreshed validation for PR #100

Passed:

- startup JavaScript syntax;
- startup ownership and load-order contract;
- iOS standalone cold-start and lifecycle browser simulation;
- profile sign-in startup stability;
- delayed Home/community stability;
- Phase 4B mobile/profile/Picks stability.

Retained CI proof additionally reports:

- one product architecture script;
- one native shell script;
- one notification surface script;
- one bottom navigation;
- one community directory with no delayed replacement;
- successful Top 10 save;
- correct Home cold launch;
- correct Picks resume route.

## Remaining merge gate — Cody required

The project rules require a physical installed-iPhone check before merging routing or lifecycle-sensitive startup changes. Existing CI produces localhost browser proof and downloadable reports, not an installable branch deployment.

The immutable commit snapshot and exact procedure are documented in [`PR-100-IPHONE-TEST.md`](./PR-100-IPHONE-TEST.md).

Preview link:

[Open immutable PR #100 preview](https://rawcdn.githack.com/codyking0602/ufc-goat-rankings/8136c728f5794229273b8a2c5ce9f291eeaf30db/index.html)

The preview uses a separate origin and separate browser storage. It must be added to the Home Screen under a temporary name such as **Octagon Test**. If it fails to load, install, or retain assets correctly, the result is inconclusive and PR #100 stays draft.

Manual verification must confirm:

- cold launch from fully closed;
- launch after previously leaving the test app on Picks or another non-Home destination;
- background and resume;
- one active view and one bottom navigation;
- no route bounce, blank screen, duplicate reminder, duplicate tap handling, or navigation flicker.

## Completed Phase 1 owner audit

The major owners are now separated into four classes:

1. simple global-guard candidates;
2. prerequisite-dependent owners whose marker must be set only after required DOM/data exists;
3. `app.js`, which must remain a structural manifest singleton because of global lexical declarations and public APIs;
4. `production-ranking-bootstrap.js`, which needs intentional retry semantics before duplicate execution can be blocked.

The next runtime owner after PR #100 is `assets/js/octagon-hq-shell.js`. That future batch must add only one global marker and one startup-contract assertion.

## Existing unrelated red checks

These remain separate from the startup runtime diff:

1. **Scoring Architecture Guardrails**
   - The scoring contract expects 73 fighters while production contains 80.
   - This is a stale scoring test contract, not a startup regression.

2. **Production Ranking Browser Smoke**
   - The run stops at the fighter-photo path audit before rendered ranking/startup certification.
   - This is outside the Phase 1 route-guard diff.

## Exact next action

1. Cody performs the installed-iPhone test in [`PR-100-IPHONE-TEST.md`](./PR-100-IPHONE-TEST.md).
2. Record pass or failure on PR #100.
3. On a pass, reconcile the documentation-only `main` commits into the branch.
4. Confirm the runtime diff remains exactly 8 additions across the same 3 files and rerun startup/mobile CI.
5. Merge only if the reconciled branch is clean and visible behavior remains unchanged.
6. Open the isolated `octagon-hq-shell.js` singleton-guard batch from the resulting current `main`.

## Stop conditions

Stop and leave PR #100 draft if any of the following occurs:

- the preview cannot be installed or does not load correctly;
- visible behavior changes;
- route timing changes;
- a blank screen, route bounce, duplicate reminder, duplicated navigation shell, or double tap occurs;
- the diff starts absorbing scoring, fighter-data, photo, or product work;
- installed-app behavior cannot be confidently verified.