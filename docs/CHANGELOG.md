# Changelog

## 2026-07-09 — Deterministic Initialization Checkpoint

### Changed

- Replaced timer-based scoring startup in `module-versions.js` with one ordered Promise-based sequence.
- Added an explicit readiness handoff from `ranking-data-patches.js`.
- Removed repeated early/mid/late loading for Prime tiers, Longevity, and Apex Peak.
- Removed score/rank reapplication from the prerequisite loader's status hook.
- Changed `final-score-engine.js` to explicit single-pass mode.
- Removed the final engine's automatic import-time calculation.
- Removed the final engine's `refresh` wrapper.
- Changed category percentile tiers into a read-only presentation layer.
- Removed category-tier reapplication of Prime during rank lookups.
- Removed duplicate category-tier and score-derived-OVR loading from the prerequisite chain.
- Added a deterministic-initialization CI gate.

### Validation

Seventh headless Chromium audit:

- 62 roster fighters
- scoring timers: 0
- repeated scoring loads: 0
- duplicate scoring scripts: 0
- final score engine apply count: 1
- UI refresh count: 1
- refresh wrapper: disabled
- category tiers mutate scores: false
- category tiers reapply Prime: false
- deterministic initialization gate: PASS
- ownership gate: PASS
- 0 formula mismatches
- 0 profile/leaderboard mismatches
- 0 forbidden numerical display overrides
- category coverage unchanged
- fighter totals, rankings, and men's top ten unchanged

Permanent report:

- `docs/audits/SEVENTH_RUNTIME_AUDIT_DETERMINISTIC_INITIALIZATION.md`

No fighter category input or audit value changed.

### Next

Complete the five missing Quality Wins audits, followed by the nine missing Prime Dominance audits.

## 2026-07-09 — Final Score Ownership Checkpoint

### Changed

- `score-weighting.js` became compatibility-only.
- Preserved locked weights, formula metadata, pure breakdown helper, Longevity legacy conversion, and Rules-page copy.
- Removed legacy mutations of totals, breakdowns, ranks, profile overall values, and numerical display overrides.
- Removed duplicate Prime Windows and Prime Dominance loading from the legacy weighting layer.
- Added a strict ownership gate to CI.

### Validation

Sixth headless Chromium audit:

- 62/62 leaderboard rows owned by the final score engine
- legacy weighting mode: `compatibility-only`
- legacy weighting `mutatesScores`: false
- duplicate Prime loaders: false
- 0 rows with the wrong owner
- 0 formula mismatches
- category coverage, totals, and rankings unchanged

Permanent report:

- `docs/audits/SIXTH_RUNTIME_AUDIT_SCORE_OWNERSHIP.md`

## 2026-07-09 — Apex Peak Category-Only Checkpoint

### Changed

- `apex-peak-live-bonus.js` now writes only Apex Peak values and audit metadata.
- Preserved all 61 completed audits and Dricus du Plessis as the single pending review.
- Removed Apex mutations of totals, breakdowns, ranks, profile overall values, and numerical display overrides.

### Validation

Fifth headless Chromium audit:

- 61 completed Apex audits pass
- Dricus remains pending
- 0 formula mismatches
- totals and rankings unchanged

Permanent report:

- `docs/audits/FIFTH_RUNTIME_AUDIT_APEX.md`

## 2026-07-09 — Longevity Category-Only Checkpoint

### Changed

- `longevity-live-promoter.js` now writes only native `/30` Longevity values and Fighter Era Ledger audit metadata.
- Removed Longevity mutations of totals, breakdowns, ranks, profile overall values, and numerical display overrides.

### Validation

Fourth headless Chromium audit:

- 62/62 Longevity audits live
- 0 formula mismatches
- totals and rankings unchanged

Permanent report:

- `docs/audits/FOURTH_RUNTIME_AUDIT_LONGEVITY.md`

## 2026-07-09 — Championship and Quality Category-Only Checkpoint

### Changed

- Championship Resume now writes only Championship values, audit metadata, title context, and presentation evidence.
- Quality Wins now writes only Quality values, audit metadata, and presentation evidence.
- Removed total/rank/breakdown/display mutations from both.
- Removed Championship's unrelated Prime rank/OVR rewrite timers.

### Validation

Third headless Chromium audit:

- 62 fighters
- 0 formula mismatches
- category coverage unchanged
- totals and rankings unchanged

Permanent report:

- `docs/audits/THIRD_RUNTIME_AUDIT_CHAMPIONSHIP_QUALITY.md`

## 2026-07-09 — Canonical Final Score Engine Checkpoint

### Added

- `assets/js/final-score-engine.js`
- `docs/audits/SECOND_RUNTIME_AUDIT_FINAL_ENGINE.md`

### Changed

- Prime Dominance became category-only.
- The final engine became the canonical owner of weighted totals, ranks, profile totals, and score-derived OVR.

### Locked Formula

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

Second headless Chromium audit:

- formula mismatches reduced from 53 to 0
- 0 profile/leaderboard mismatches
- 0 forbidden score-derived display overrides
- category coverage unchanged

## 2026-07-09 — Read-Only Six-Category Integrity Audit

### Added

- `assets/data/six-category-integrity-audit.js`
- `audit.html`
- branch-only Chromium workflow

The auditor checks source coverage, formula reconciliation, profile synchronization, duplicate rows, display override contamination, score ownership, and deterministic initialization.

## 2026-07-09 — Six-Category Pipeline Consolidation Begins

### Added

- `docs/ARCHITECTURE.md`
- `docs/CURRENT_STATE.md`
- `docs/ROADMAP.md`
- `docs/OPEN_ISSUES.md`
- protected branch `fix/unified-six-category-pipeline`

Purpose: preserve Cody's fighter-by-fighter audits while replacing tangled runtime scoring with one auditable pipeline.
