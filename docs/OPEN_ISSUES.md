# Open Issues

## Critical

### 1. Legacy weighting layer still writes overall state

Status: In Progress

A canonical final score engine exists and all 62 settled totals reconcile with the locked formula.

Validated category-only writers:

- Championship Resume
- Quality Wins
- Prime Dominance
- Longevity
- Apex Peak

Still remaining:

- the legacy general weighting layer can write `totalScore`, weighted breakdowns, ranks, and display rank fields

Target: Only `final-score-engine.js` owns totals, ranks, weighted breakdowns, and score-derived OVR.

### 2. Category promoter ownership

Status: Resolved on safety branch

The five positive category promoters now write only their category values, audit metadata, and necessary presentation evidence. Settled Chromium audits report:

- 0 formula mismatches
- unchanged category coverage
- unchanged fighter totals and rankings
- 0 profile/leaderboard mismatches
- 0 forbidden numerical display overrides

Production status: Not merged.

### 3. Loss Context ledger is not live

Status: Open

The live promoter remains disabled. Existing `penalty` values remain live while the Fighter Era Ledger adapter is QA-only.

Target: Complete full UFC loss coverage, review all 62 totals, and promote the audited penalties.

### 4. Score-changing timers and repeated loaders

Status: Open

Longevity, Apex, category tiers, and refresh paths are still loaded or reapplied on delayed timers. The category writers no longer own overall scoring, but the repeated initialization remains unnecessary technical debt and can cause visible startup movement.

Target: One deterministic ordered initialization chain with no score-changing timers.

## High Priority

### 5. Full-roster six-category coverage gate

Status: In Progress

Current settled coverage:

| Category | Pass | Warn | Fail |
|---|---:|---:|---:|
| Championship Resume | 62 | 0 | 0 |
| Quality Wins | 57 | 0 | 5 |
| Prime Dominance | 53 | 0 | 9 |
| Longevity | 62 | 0 | 0 |
| Apex Peak | 61 | 1 | 0 |
| Loss Context | 0 | 61 | 1 |

Target: 62/62 audited coverage and 0 formula mismatches as a hard release gate.

### 6. Score-derived display overrides

Status: Controlled on safety branch

The final score engine strips numerical rank/OVR fields from runtime display overrides. Apex no longer copies its numerical audit into display overrides.

Current settled audit result: 0 forbidden score-derived overrides.

Remaining: remove numerical writes from the legacy weighting layer and any other compatibility code found during final ownership review.

### 7. Legacy source values remain mixed with live values

Status: Open

`ranking-data.js` still contains older values that may temporarily appear before audited category layers apply.

Target: Preserve legacy values under explicit legacy fields and prohibit silent fallback after initialization.

### 8. Production cache-bust references

Status: Open before merge

`ranking-data-patches.js` still references the older Championship query-string version. All final cache versions must be aligned before production merge.

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

Dricus du Plessis remains explicitly pending. The other 61 Apex audits pass the settled runtime gate.

### 12. Loss Context incomplete row

Status: Open

Sean O'Malley has no usable adapter entry. The other 61 adapter totals still require fighter-by-fighter review before live promotion.

## Review Items

### 13. Apex naming consistency

Status: Partially resolved

The category-only Apex promoter now uses “Apex Peak” and preserves the old global alias only for compatibility. Remaining files should be standardized during loader cleanup.

### 14. Compare Mode source consistency

Status: Not yet audited

Target: Confirm Compare Mode reads canonical final rows and maintains no separate numerical score source.

### 15. Division board source consistency

Status: Not yet audited

Target: Confirm division rankings read canonical final rows after the unified final score engine runs.