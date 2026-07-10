# Fourth Settled Runtime Audit — Longevity Category-Only Checkpoint

Generated: July 9, 2026
Workflow: `Six-Category Runtime Audit`
Runtime: Headless Chromium after all current delayed scoring timers completed
Mutation mode: Read-only audit of the safety branch

## Changes Tested

- Converted `assets/data/longevity-live-promoter.js` into a Longevity-category-only writer.
- Preserved the native `/30` Longevity score, Fighter Era Ledger source fields, and full `longevityAudit` metadata.
- Removed Longevity mutations of:
  - `totalScore`
  - `weightedScoreBreakdown`
  - board sorting and rank assignment
  - profile overall scores and ranks
  - numerical display overrides
- Longevity now requests recalculation from `final-score-engine.js` after updating category values.
- Updated the Longevity cache-bust version in `module-versions.js`.

No fighter category input, Fighter Era Ledger row, audit value, Apex value, or Loss Context value was changed.

## Executive Result

- Roster fighters: 62
- Locked-formula mismatches: 0
- Forbidden score-derived display overrides: 0
- Duplicate leaderboard/profile names: 0
- Profile-to-leaderboard mismatches: 0

The checkpoint passed without regression.

## Category Coverage Unchanged

| Category | Pass | Warn | Fail |
|---|---:|---:|---:|
| Championship Resume | 62 | 0 | 0 |
| Quality Wins | 57 | 0 | 5 |
| Prime Dominance | 53 | 0 | 9 |
| Longevity | 62 | 0 | 0 |
| Apex Peak | 61 | 1 | 0 |
| Loss Context | 0 | 61 | 1 |

All 62 Fighter Era Ledger Longevity audits still reach their live rows.

## Formula and Ranking Validation

All 62 settled totals still match:

```text
Championship Resume / 30 × 35
+ Quality Wins / 30 × 27.5
+ Prime Dominance / 30 × 27.5
+ Longevity / 30 × 10
+ Apex Peak
+ Loss Context
= Raw Score
```

Jon Jones remained at `102.21`.

The settled men's top ten remained:

1. Jon Jones — 102.21
2. Georges St-Pierre — 88.01
3. Demetrious Johnson — 77.54
4. Anderson Silva — 77.17
5. Islam Makhachev — 70.19
6. Alexander Volkanovski — 67.07
7. Khabib Nurmagomedov — 65.19
8. Jose Aldo — 64.14
9. Matt Hughes — 63.51
10. Kamaru Usman — 61.10

## Ownership Status After This Checkpoint

Category-only and validated:

- Championship Resume
- Quality Wins
- Prime Dominance
- Longevity

Still able to mutate overall totals or ranks:

- Apex Peak
- legacy general weighting layer

## Next Repair

Convert Apex Peak into a category-only writer, then rerun the same settled runtime audit. Required result:

- 0 formula mismatches
- unchanged category coverage
- unchanged fighter totals and rankings
- no profile or display-override regressions
