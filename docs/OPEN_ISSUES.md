# Open Issues

## Critical

### 1. Multiple modules still write `totalScore`

Status: In Progress

A canonical final score engine now exists and all 62 settled totals reconcile with the locked formula.

Converted to category-only writers:

- Championship Resume
- Quality Wins
- Prime Dominance

Still remaining:

- Longevity promoter writes totals and ranks
- Apex Peak promoter writes totals and ranks
- general legacy weighting code can still write totals

Target: Only `final-score-engine.js` owns totals, ranks, weighted breakdowns, and score-derived OVR.

### 2. Prime Dominance promoter uses incorrect overall math

Status: Resolved on safety branch

The Prime promoter no longer writes totals, ranks, OVRs, or category-rank overrides. Settled runtime audits report 0 formula mismatches across all 62 fighters.

Production status: Not merged.

### 3. Championship and Quality promoters owned overall state

Status: Resolved on safety branch

Championship Resume and Quality Wins now write only their category values, audit metadata, and presentation evidence. They no longer write totals, ranks, weighted breakdowns, or numerical display overrides.

Championship also no longer force-writes Prime category rank/OVR or runs delayed Prime rewrite timers.

Production status: Not merged.

### 4. Loss Context ledger is not live

Status: Open

The current live promoter remains disabled. Existing `penalty` values remain live while the Era Ledger adapter is QA-only.

Target: Complete full UFC loss coverage and promote reviewed penalties.

### 5. Score-changing timers

Status: Open

Longevity, Apex, category tiers, and refresh paths are still reapplied after page load.

The final score engine repairs the final settled state, but the loader is not yet deterministic.

Target: One ordered initialization chain with no score-changing timers.

## High Priority

### 6. Full-roster six-category coverage gate

Status: In Progress

The read-only auditor and headless Chromium workflow run successfully.

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

### 7. Score-derived display overrides

Status: Controlled on safety branch

The final score engine strips numerical rank/OVR fields from runtime display overrides and calculates scores, ranks, and OVR from current fighter rows.

The settled audit reports 0 forbidden score-derived overrides.

Remaining: Remove obsolete writers from Longevity, Apex, and legacy modules.

### 8. Category promoters omit Apex or use competing formulas

Status: In Progress

Championship, Quality Wins, and Prime are clean. Remaining:

- Longevity
- Apex Peak
- legacy general weighting layer

### 9. Legacy source values remain mixed with live values

Status: Open

`ranking-data.js` still contains older values that may appear before live category layers apply.

Target: Preserve legacy values explicitly but prohibit silent use after initialization.

### 10. Production cache-bust references

Status: Open before merge

`ranking-data-patches.js` still references the older Championship query-string version. Branch testing is correct, but the cache-bust reference must be updated before production merge.

## Missing Audit Coverage

### 11. Quality Wins missing five live audits

Status: Open

- Chuck Liddell
- Tito Ortiz
- Dricus du Plessis
- Sean O'Malley
- Julianna Peña

### 12. Prime Dominance missing nine merged audits

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

### 13. Apex Peak incomplete row

Status: Open

Dricus du Plessis remains explicitly pending.

### 14. Loss Context incomplete row

Status: Open

Sean O'Malley has no usable adapter entry. The other 61 adapter totals still require review before live promotion.

## Review Items

### 15. Apex naming consistency

Status: Open

Both “Apex Peak” and “Peak Apex” still appear. Standardize on “Apex Peak.”

### 16. Compare Mode source consistency

Status: Not yet audited

Target: Confirm Compare Mode reads canonical final rows and maintains no separate numerical score source.

### 17. Division board source consistency

Status: Not yet audited

Target: Confirm division rankings read canonical final rows after the unified score engine runs.
