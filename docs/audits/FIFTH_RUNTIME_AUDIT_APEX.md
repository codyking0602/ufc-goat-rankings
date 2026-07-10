# Fifth Settled Runtime Audit — Apex Peak Category-Only Checkpoint

Generated: July 9, 2026
Workflow: `Six-Category Runtime Audit`
Runtime: Headless Chromium after all current delayed scoring timers completed
Mutation mode: Read-only audit of the safety branch

## Changes Tested

- Converted `assets/data/apex-peak-live-bonus.js` into an Apex-Peak-category-only writer.
- Preserved the complete locked Apex fighter table and component audit formula.
- Preserved 61 completed Apex audits and Dricus du Plessis as the single pending Apex review.
- Removed Apex mutations of:
  - `totalScore`
  - `weightedScoreBreakdown`
  - board sorting and rank assignment
  - profile overall scores and ranks
  - numerical display overrides
- Removed the duplicate numerical Apex audit copy from runtime display overrides; canonical audits remain on fighter rows and profiles.
- Standardized new Apex module wording on “Apex Peak” while preserving the legacy global alias for compatibility.
- Apex now requests recalculation from `final-score-engine.js` after applying category values.
- Updated the Apex cache-bust version in `module-versions.js`.

No fighter Apex input, component value, selected performance, other category value, or Loss Context value was changed.

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

All 61 completed Apex Peak audits still reach their canonical live rows. Dricus du Plessis remains explicitly pending.

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
- Apex Peak

Still able to mutate overall totals or ranks:

- legacy general weighting layer

## Next Repair

Neutralize the legacy general weighting layer as an overall-score owner while preserving any rules-copy or compatibility APIs still needed by the app. Then rerun the same settled runtime audit.

Required result:

- 0 formula mismatches
- unchanged category coverage
- unchanged fighter totals and rankings
- no profile or display-override regressions
- `final-score-engine.js` as the only overall-score owner