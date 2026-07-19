# Startup Architecture Test Plan

This plan defines the minimum evidence required before a startup cleanup batch can merge.

## Core principle

A passing cleanup demonstrates both:

1. the approved first-run behavior still works; and
2. duplicate or repeated startup work is prevented or reduced.

A syntax check alone is not enough.

## Automated contract checks

Required for every startup runtime PR:

- startup JavaScript syntax;
- startup script ownership assertions;
- expected script load order;
- no duplicate critical script loading;
- required singleton markers when a file is designated idempotent;
- no new full-page reload loop;
- no unapproved polling or interval loop.

Primary files:

- `scripts/test-startup-contract.mjs`
- `.github/workflows/startup-architecture-gate.yml`

## Browser startup scenarios

Run the relevant existing browser tests for:

- normal browser cold start;
- iOS standalone cold start;
- warm start;
- background and resume;
- delayed data/profile readiness;
- signed-out startup;
- signed-in profile startup;
- Home and community rendering stability;
- Picks and profile compatibility;
- navigation after startup settles.

## Product-surface regression coverage

The full certification phase must cover:

- Home;
- men's and women's rankings;
- division views;
- fighter profiles;
- Compare;
- Picks;
- Games/Play;
- Intelligence;
- War Room;
- community profiles;
- notifications;
- sharing;
- profile setup reminders;
- deep links and installed-app route recovery.

A small Phase 1 PR may rely on the closest relevant subset, but no known failure may be hidden or mislabeled.

## Physical installed-app verification

Required before merging a change that affects routing, lifecycle events, cache behavior, native navigation, profile sign-in, or background resume:

- open from a fully closed state;
- open while previously left on a non-Home destination;
- move app to background and resume;
- verify one active destination and one mobile navigation shell;
- verify no visible flicker, blank screen, route bounce, or repeated reminder;
- verify taps are handled once.

Record the outcome in the PR and `STATUS.md`.

## Merge decision categories

### Green

- Relevant automated checks pass.
- First-run behavior is unchanged.
- Duplicate execution protection is proven.
- Branch is mergeable with current `main`.
- Any unrelated red checks are clearly documented and were not introduced by the diff.

### Hold as draft

- GitHub reports the branch as non-mergeable or stale in an unresolved way.
- Installed-app behavior has not been verified for a lifecycle-sensitive change.
- A relevant test is flaky or inconclusive.
- The diff has started absorbing unrelated work.

### Reject or revert

- Visible product behavior changes without approval.
- Route timing or active-view behavior changes unexpectedly.
- Startup adds another listener, observer, timer, loader, or repair loop.
- The change requires multiple follow-up patches to restore unrelated surfaces.

## Current Phase 1 baseline

For draft PR #100, the following have already been observed as passing:

- startup syntax;
- ownership/load-order contract;
- iOS startup/lifecycle stability;
- profile sign-in startup stability;
- delayed Home/community stability;
- Phase 4B mobile/profile/Picks stability.

The PR remains held because its mergeability state must be reconciled with current `main`.
