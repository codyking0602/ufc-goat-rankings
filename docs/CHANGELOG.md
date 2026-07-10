# Changelog

## 2026-07-09 — Canonical Final Score Engine Checkpoint

### Added

- `assets/js/final-score-engine.js`
- `docs/audits/SECOND_RUNTIME_AUDIT_FINAL_ENGINE.md`

### Changed

- Prime Dominance promoter now writes only Prime-related values and audit metadata.
- Prime Dominance no longer writes totals, ranks, overall OVR, category OVR, or category rank.
- Module bootstrap now routes current category passes through the final score engine.
- Runtime numerical display overrides are stripped so current scores determine ranks and OVRs.

### Locked formula

```text
Championship Resume / 30 × 35
+ Quality Wins / 30 × 27.5
+ Prime Dominance / 30 × 27.5
+ Longevity / 30 × 10
+ Apex Peak
+ Loss Context
= Raw Score
```

### Validation

Second settled headless Chromium audit:

- 62 roster fighters
- formula mismatches reduced from 53 to 0
- 0 profile/leaderboard mismatches
- 0 duplicate fighter names
- 0 forbidden score-derived display overrides
- category coverage unchanged

No fighter category input or audit value changed during this repair.

### Next

Convert Championship Resume and Quality Wins promoters into category-only writers, then rerun the same settled audit.

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
