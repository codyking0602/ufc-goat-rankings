# Open Issues

## Critical

### 1. Overall score ownership

Status: Resolved on safety branch

`assets/js/final-score-engine.js` is now the only overall-score owner.

The five positive category promoters are category-only:

- Championship Resume
- Quality Wins
- Prime Dominance
- Longevity
- Apex Peak

The legacy weighting layer is now compatibility-only and reports:

- `mutatesScores: false`
- `mode: compatibility-only`
- `overallOwner: final-score-engine.js`
- duplicate Prime Windows loader: false
- duplicate Prime Dominance loader: false

The strict settled-runtime ownership gate checked all 62 leaderboard rows and found 0 rows with the wrong owner.

Production status: Not merged.

### 2. Loss Context ledger is not live

Status: Open

The live promoter remains disabled. Existing `penalty` values remain live while the Fighter Era Ledger adapter is QA-only.

Target: Complete full UFC loss coverage, review all 62 totals, and promote the audited penalties.

### 3. Score-changing timers and repeated loaders

Status: Open

Longevity, Apex, category tiers, and refresh paths are still loaded or reapplied on delayed timers. The category writers no longer own overall scoring, but repeated initialization remains unnecessary technical debt and can cause visible startup movement.

Target: One deterministic ordered initialization chain with no score-changing timers.

## High Priority

### 4. Full-roster six-category coverage gate

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

Current infrastructure gates:

- locked formula mismatches must remain 0
- final-score ownership must pass
- every leaderboard row must carry the final-engine owner version

Target: 62/62 audited coverage and zero silent fallback.

### 5. Score-derived display overrides

Status: Controlled on safety branch

The final score engine strips numerical rank/OVR fields from runtime display overrides. Category promoters and the legacy weighting layer no longer write numerical rank, OVR, total, or category score fields there.

Current settled audit result: 0 forbidden score-derived overrides.

### 6. Legacy source values remain mixed with live values

Status: Open

`ranking-data.js` still contains older values that may temporarily appear before audited category layers apply.

Target: Preserve legacy values under explicit legacy fields and prohibit silent fallback after initialization.

### 7. Production cache-bust references

Status: Open before merge

`ranking-data-patches.js` still contains older query-string versions for some now-clean modules, including Championship Resume and the compatibility-only weighting layer.

Target: align all final cache versions during deterministic-loader cleanup before production merge.

## Missing Audit Coverage

### 8. Quality Wins missing five live audits

Status: Open

- Chuck Liddell
- Tito Ortiz
- Dricus du Plessis
- Sean O'Malley
- Julianna Peña

### 9. Prime Dominance missing nine merged audits

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

### 10. Apex Peak incomplete row

Status: Open

Dricus du Plessis remains explicitly pending. The other 61 Apex audits pass the settled runtime gate.

### 11. Loss Context incomplete row

Status: Open

Sean O'Malley has no usable adapter entry. The other 61 adapter totals still require fighter-by-fighter review before live promotion.

## Review Items

### 12. Apex naming consistency

Status: Partially resolved

The category-only Apex promoter now uses “Apex Peak” and preserves the old global alias only for compatibility. Remaining files should be standardized during loader cleanup.

### 13. Compare Mode source consistency

Status: Not yet audited

Target: Confirm Compare Mode reads canonical final rows and maintains no separate numerical score source.

### 14. Division board source consistency

Status: Not yet audited

Target: Confirm division rankings read canonical final rows after the unified final score engine runs.
