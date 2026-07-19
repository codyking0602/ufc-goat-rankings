# Startup Architecture Known Issues

This file separates active startup concerns from unrelated repository failures discovered during validation.

## Active startup concerns

### Remaining Phase 1 owners are not yet globally idempotent

The major owner inventory is complete in `PHASE-1-OWNER-AUDIT.md`, but most owners have not yet received their approved duplicate-file-execution protection.

The current next candidate is `assets/js/octagon-hq-shell.js`. It protects repeated API calls with closure-scoped `started` and `eventsBound` state, but a duplicated script evaluation would create a second closure with separate listeners and observers.

### No trusted pre-merge installed-PWA preview environment exists

The third-party immutable repository preview used during PR #100 testing failed to load the full production mobile/native shell and showed the desktop fallback. It was rejected before sign-in.

Do not reuse that preview method. Mobile-sensitive batches must remain draft until a faithful controlled deployment path is available or an explicitly documented tiny-diff live verification with immediate rollback is approved.

### Startup ownership remains distributed across compatibility layers

Known examples:

- canonical notification center plus notification surface compatibility;
- canonical native shell plus native shell stability repairs;
- profile/identity handoffs across multiple startup files;
- calculated ranking runtime split across base and production bootstrap files.

These are Phase 2 and Phase 3 investigation targets, not automatic bugs and not permission to consolidate them during Phase 1.

## Resolved during current work

### PR #100 route-startup guard batch

- Rebuilt directly from current `main`.
- Limited to 8 additions across 3 files.
- Startup Architecture Gate passed.
- iOS Home Startup Stability passed.
- Phase 4B mobile/profile/Picks validation passed.
- Merged as `5e733cc4568100e96080ce27ad601b7022daba33`.
- Real installed iPhone app looked normal after deployment.

### PR #100 branch divergence

- The original branch became stale after documentation landed.
- It was rebuilt from current `main` while preserving the exact runtime diff.
- The rebuilt branch was 0 commits behind and mergeable before merge.

## Unrelated repository failures

### Stale scoring roster-count contract

- `docs/scoring-architecture-contract.json` expects 73 fighters.
- Current production roster contains 80 fighters.
- This was not caused by startup work.
- Fix separately from startup runtime work.

### Fighter-photo path audit failure

- Production Ranking Browser Smoke stops during fighter-photo path auditing.
- It stops before rendered ranking/startup certification begins.
- This was not caused by startup work.
- Fix separately from startup runtime work.

## Documentation/process note

Two accidental placeholder issues, #103 and #104, were created during tracker setup and immediately closed as `not planned`. They contain no work. Issue #102 is the only startup architecture master tracker.

## Rules for this file

- Link resolving PRs or commits.
- Move completed items to `CHANGELOG.md` after merge or explicit closure.
- Keep unrelated failures visible without expanding startup PR scope.
