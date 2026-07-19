# Startup Architecture Known Issues

This file separates active startup concerns from unrelated repository failures discovered during validation.

## Active startup concerns

### PR #100 is currently reported as non-mergeable

**Status:** Investigating  
**Impact:** The first Phase 1 runtime batch must remain draft.

Required action:

1. Compare the PR head with current `main`.
2. Determine whether the report represents a true conflict, stale branch state, or incomplete GitHub computation.
3. Reconcile without adding unrelated runtime changes.
4. Re-run relevant startup checks.

### Startup ownership is still distributed across compatibility layers

Known examples:

- canonical notification center plus notification surface compatibility;
- canonical native shell plus native shell stability repairs;
- profile/identity handoffs across multiple startup files;
- calculated ranking runtime split across base and production bootstrap files.

These are not automatic bugs. They are Phase 2 and Phase 3 investigation targets.

### Phase 1 owner inventory is incomplete

The current ownership map identifies major owners but has not yet catalogued every listener, observer, timeout, interval, dynamic script loader, lifecycle event, or initialized marker.

## Unrelated repository failures observed during startup validation

### Stale scoring roster-count contract

- `docs/scoring-architecture-contract.json` expects 73 fighters.
- Current production roster is 80 fighters.
- This failure is not caused by the Phase 1 route-guard changes.
- Fix separately from startup runtime work.

### Fighter-photo path audit failure

- Production Ranking Browser Smoke stops during fighter-photo path auditing.
- It stops before rendered ranking/startup certification begins.
- This failure is not caused by the Phase 1 route-guard changes.
- Fix separately from startup runtime work.

## Documentation/process issue

Two accidental placeholder issues, #103 and #104, were created during tracker setup and immediately closed as `not planned`. They contain no work. Issue #102 is the only startup architecture master tracker.

## Rules for this file

- Do not mark an issue resolved merely because a later test passed once.
- Link the resolving PR or commit.
- Move completed items to `CHANGELOG.md` after merge or explicit closure.
- Keep unrelated failures visible without expanding startup PR scope.
