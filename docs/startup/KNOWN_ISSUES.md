# Startup Architecture Known Issues

This file separates active startup concerns from unrelated repository failures discovered during validation.

## Active startup concern

### PR #100 live installed-app verification is pending

**Status:** Merged to `main` as `5e733cc4568100e96080ce27ad601b7022daba33`; real installed-iPhone verification pending  
**Impact:** The next Phase 1 runtime owner remains blocked.

The merged change contains only two three-line duplicate-start guards and two contract assertions. Relevant startup, iOS, profile, Home/community, and Phase 4B mobile/Picks checks passed before merge.

The real GitHub Pages installation must now confirm:

- current mobile presentation loads rather than the desktop fallback;
- cold launch and non-Home relaunch are stable;
- background/resume is stable;
- one bottom navigation is present;
- no route bounce, blank state, duplicate reminder, or double-handled tap occurs.

Immediate rollback target: merge commit `5e733cc4568100e96080ce27ad601b7022daba33`.

## Rejected test environment

### Third-party immutable static preview

The separate-origin preview was rejected because it did not load the full production mobile/native shell. It visibly showed desktop navigation tabs, incorrect current ordering, and an incomplete product presentation.

This was not treated as a PR regression. Source comparison confirmed the previewed commit and current production runtime differed only by the exact eight-line guard/test change. The preview URL must not be used for further sign-in or product verification.

## Ongoing architectural concerns

Startup ownership remains distributed across some compatibility layers:

- canonical notification center plus notification surface compatibility;
- canonical native shell plus native shell stability repairs;
- profile/identity handoffs across multiple startup files;
- calculated ranking runtime split across base and production bootstrap files.

These are documented Phase 2 and Phase 3 targets, not automatic bugs and not permission to consolidate them during Phase 1.

The major Phase 1 owner inventory is complete. The next isolated candidate is `assets/js/octagon-hq-shell.js`, but no new runtime batch begins until PR #100 passes live installed-app verification.

## Resolved during current work

### PR #100 branch divergence

- The branch was rebuilt directly from current `main`.
- The final comparison was 0 commits behind.
- The merged diff remained exactly 8 additions across 3 files.
- Relevant CI passed before merge.

## Unrelated repository failures

### Stale scoring roster-count contract

- `docs/scoring-architecture-contract.json` expects 73 fighters.
- Current production roster contains 80 fighters.
- This was not caused by PR #100.
- Fix separately from startup runtime work.

### Fighter-photo path audit failure

- Production Ranking Browser Smoke stops during fighter-photo path auditing.
- It stops before rendered ranking/startup certification begins.
- This was not caused by PR #100.
- Fix separately from startup runtime work.

## Documentation/process note

Two accidental placeholder issues, #103 and #104, were created during tracker setup and immediately closed as `not planned`. They contain no work. Issue #102 is the only startup architecture master tracker.

## Rules for this file

- Do not mark the live verification complete until Cody tests the real installed app.
- Link resolving PRs or commits.
- Move completed items to `CHANGELOG.md` after merge or explicit closure.
- Keep unrelated failures visible without expanding startup PR scope.
