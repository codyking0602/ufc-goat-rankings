# Open Issues

## Critical

### 1. Multiple modules own `totalScore`

Status: Open

Championship, Quality Wins, Prime Dominance, Longevity, Apex Peak, and the general weighting layer can each recalculate totals. They do not all use the same formula.

Target: One final score engine owns totals, ranks, and OVR.

### 2. Prime Dominance promoter uses incorrect overall math

Status: Open

The promoter writes the audited Prime category value correctly, then recalculates the overall as a raw sum of category fields. This bypasses category weights, Longevity conversion, and Apex Peak.

Target: Prime promoter writes Prime only.

### 3. Loss Context ledger is not live

Status: Open

The current live promoter is intentionally disabled. Existing `penalty` values remain live while the Era Ledger adapter is QA-only.

Target: Complete full UFC loss coverage and promote reviewed penalties.

### 4. Score-changing timers

Status: Open

Prime, Longevity, Apex, category tiers, and refresh wrappers run repeatedly after page load. The board can move through several temporary scoring states.

Target: One deterministic initialization chain.

## High Priority

### 5. No full-roster six-category coverage gate

Status: Open

A missing audit entry can silently leave a fighter on a legacy value.

Target: Non-mutating integrity audit that identifies every missing or mismatched fighter/category pair.

### 6. Score-derived display overrides

Status: Open

Some modules write overall OVR, overall rank, category OVR, or category rank into `DISPLAY_OVERRIDES`.

Target: Presentation-only override contract and automated forbidden-field check.

### 7. Category promoters omit Apex in intermediate totals

Status: Open

Championship, Quality Wins, and Longevity calculate weighted totals without adding Apex Peak. Apex later repairs the total.

Target: Category promoters stop calculating totals entirely.

### 8. Legacy source values remain mixed with live values

Status: Open

`ranking-data.js` contains older values that may exist before live category layers apply.

Target: Preserve legacy values explicitly but prohibit silent use after initialization.

## Review Items

### 9. Apex naming consistency

Status: Open

Both “Apex Peak” and “Peak Apex” appear in current files.

Target: Standardize on “Apex Peak.”

### 10. Apex incomplete rows

Status: Open

At least Dricus du Plessis is explicitly marked pending in the current locked Apex layer.

Target: Complete and lock every fighter audit before production gate passes.

### 11. Compare Mode source consistency

Status: Not yet audited

Target: Confirm Compare Mode reads final canonical live rows and does not maintain separate score values.

### 12. Division board source consistency

Status: Not yet audited

Target: Confirm division rankings read final canonical live rows after the unified score engine runs.
