# Open Issues

## Critical

### 1. Multiple modules still write `totalScore`

Status: In Progress

A canonical final score engine now exists and all 62 settled totals reconcile with the locked formula. Prime Dominance has been converted to a category-only writer.

Still remaining:

- Championship Resume promoter writes totals and ranks
- Quality Wins promoter writes totals and ranks
- Longevity promoter writes totals and ranks
- Apex Peak promoter writes totals and ranks
- general legacy weighting code can still write totals

Target: Only `final-score-engine.js` owns totals, ranks, weighted breakdowns, and score-derived OVR.

### 2. Prime Dominance promoter uses incorrect overall math

Status: Resolved on safety branch

The Prime promoter no longer writes totals, ranks, OVRs, or category-rank overrides. The second settled runtime audit reported 0 formula mismatches across all 62 fighters.

Production status: Not merged.

### 3. Loss Context ledger is not live

Status: Open

The current live promoter remains disabled. Existing `penalty` values remain live while the Era Ledger adapter is QA-only.

Target: Complete full UFC loss coverage and promote reviewed penalties.

### 4. Score-changing timers

Status: Open

Prime, Longevity, Apex, category tiers, and refresh paths are still reapplied after page load.

The final score engine now repairs the final settled state, but the loader is not yet deterministic.

Target: One ordered initialization chain with no score-changing timers.

## High Priority

### 5. Full-roster six-category coverage gate

Status: In Progress

The read-only auditor and headless Chromium workflow now run successfully.

Current coverage:

| Category | Pass | Warn | Fail |
|---|---:|---:|---:|
| Championship Resume | 62 | 0 | 0 |
| Quality Wins | 57 | 0 | 5 |
| Prime Dominance | 53 | 0 | 9 |
| Longevity | 62 | 0 | 0 |
| Apex Peak | 61 | 1 | 0 |
| Loss Context | 0 | 61 | 1 |

Target: Make this audit a hard release gate with 62/62 coverage and 0 formula mismatches.

### 6. Score-derived display overrides

Status: Controlled on safety branch

The final score engine strips numerical rank/OVR fields from runtime display overrides and calculates scores, ranks, and OVR from current fighter rows.

The settled audit reports 0 forbidden score-derived overrides.

Remaining: Remove obsolete writers from the remaining category promoters and legacy modules.

### 7. Category promoters omit Apex or use competing formulas

Status: In Progress

The final score engine now repairs the settled total after category passes, and Prime has been cleaned.

Remaining: Convert Championship, Quality Wins, Longevity, and Apex into category-only writers.

### 8. Legacy source values remain mixed with live values

Status: Open

`ranking-data.js` still contains older values that may appear before live category layers apply.

Target: Preserve legacy values explicitly but prohibit silent use after initialization.

## Missing Audit Coverage

### 9. Quality Wins missing five live audits

Status: Open

- Chuck Liddell
- Tito Ortiz
- Dricus du Plessis
- Sean O'Malley
- Julianna Peña

### 10. Prime Dominance missing nine merged audits

Status: Open

- Frankie Edgar
- T.J. Dillashaw
- Tyron Woodley
- Dricus du Plessis
- Aljamain Sterling
- Robert Whittaker
- Sean O'Malley
- Sean Strickland
- Dan Henderson

### 11. Apex Peak incomplete row

Status: Open

Dricus du Plessis remains explicitly pending.

### 12. Loss Context incomplete row

Status: Open

Sean O'Malley has no usable adapter entry. The other 61 adapter totals still require review before live promotion.

## Review Items

### 13. Apex naming consistency

Status: Open

Both “Apex Peak” and “Peak Apex” still appear. Standardize on “Apex Peak.”

### 14. Compare Mode source consistency

Status: Not yet audited

Target: Confirm Compare Mode reads canonical final rows and maintains no separate numerical score source.

### 15. Division board source consistency

Status: Not yet audited

Target: Confirm division rankings read canonical final rows after the unified score engine runs.
