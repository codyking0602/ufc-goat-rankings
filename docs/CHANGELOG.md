# Changelog

## 2026-07-09 — Read-Only Six-Category Integrity Audit

### Added

- `assets/data/six-category-integrity-audit.js`
- `audit.html`

### Audit coverage

The read-only auditor checks every leaderboard fighter for:

- live Championship Resume source and audit-to-row match
- live Quality Wins source and audit-to-row match
- merged Prime Dominance source and audit-to-row match
- native `/30` Longevity source and audit-to-row match
- completed Apex Peak source and audit-to-row match
- Loss Context ledger and live/legacy status
- exact locked-formula reconciliation
- leaderboard/profile mismatches
- duplicate fighter rows
- score-derived fields inside display overrides

### Safety

- No fighter inputs were changed.
- No scores, ranks, OVRs, or category values were changed.
- The auditor reports only and declares `mutatesScores: false`.
- The dashboard is isolated from normal app loading on the safety branch.

### Next

Capture the first settled full-roster report and use it to define the exact integration fixes before adding the central score engine.

## 2026-07-09 — Six-Category Pipeline Consolidation Begins

### Added

- `docs/ARCHITECTURE.md`
- `docs/CURRENT_STATE.md`
- `docs/ROADMAP.md`
- `docs/OPEN_ISSUES.md`
- protected working branch: `fix/unified-six-category-pipeline`

### Purpose

Preserve Cody's fighter-by-fighter audit work while replacing the tangled scoring orchestration with a deterministic six-category pipeline.

### Live behavior

No production scoring behavior changed in this documentation phase.

### Next

Build a non-mutating full-roster integrity auditor before changing any category promoter or overall calculation.
