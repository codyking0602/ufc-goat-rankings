# Second Settled Runtime Audit — Final Score Engine Checkpoint

Generated: July 9, 2026
Workflow: `Six-Category Runtime Audit`
Runtime: Headless Chromium after all current delayed scoring timers completed
Mutation mode: Read-only audit of the safety branch

## Changes Tested

- Added `assets/js/final-score-engine.js` as the canonical owner of:
  - `rawScore`
  - `totalScore`
  - `weightedScoreBreakdown`
  - overall board rank
  - score-derived OVR
- Converted `prime-dominance-live-promoter.js` into a Prime-category-only writer.
- Removed Prime promoter mutations of totals, ranks, OVRs, and category rank/OVR overrides.
- Updated `module-versions.js` so every current category refresh finishes through the final score engine.

No fighter category input, ledger entry, audit value, Apex value, or Loss Context value was changed.

## Executive Result

- Roster fighters: 62
- Locked-formula mismatches before this checkpoint: 53
- Locked-formula mismatches after this checkpoint: 0
- Forbidden score-derived display overrides: 0
- Duplicate leaderboard/profile names: 0
- Profile-to-leaderboard mismatches: 0

The formula repair passed for all 62 fighters.

## Formula Now Reconciles

Every settled fighter total now matches:

```text
Championship Resume / 30 × 35
+ Quality Wins / 30 × 27.5
+ Prime Dominance / 30 × 27.5
+ Longevity / 30 × 10
+ Apex Peak
+ Loss Context
= Raw Score
```

Jon Jones checkpoint:

```text
30/30×35
+ 30/30×27.5
+ 25.86/30×27.5
+ 30/30×10
+ 6
+ 0
= 102.21
```

Settled runtime total: `102.21`

## Category Coverage Unchanged

| Category | Pass | Warn | Fail |
|---|---:|---:|---:|
| Championship Resume | 62 | 0 | 0 |
| Quality Wins | 57 | 0 | 5 |
| Prime Dominance | 53 | 0 | 9 |
| Longevity | 62 | 0 | 0 |
| Apex Peak | 61 | 1 | 0 |
| Loss Context | 0 | 61 | 1 |

This is the desired checkpoint result: formula wiring changed, fighter inputs did not.

## Current Top Ten Men from the Locked Formula

| Rank | Fighter | Raw Score |
|---:|---|---:|
| 1 | Jon Jones | 102.21 |
| 2 | Georges St-Pierre | 88.01 |
| 3 | Demetrious Johnson | 77.54 |
| 4 | Anderson Silva | 77.17 |
| 5 | Islam Makhachev | 70.19 |
| 6 | Alexander Volkanovski | 67.07 |
| 7 | Khabib Nurmagomedov | 65.19 |
| 8 | Jose Aldo | 64.14 |
| 9 | Matt Hughes | 63.51 |
| 10 | Kamaru Usman | 61.10 |

These rankings are provisional because five Quality Wins audits, nine Prime audits, one Apex audit, and the complete live Loss Context layer still need resolution.

## What This Proves

- The 53 prior formula failures came from the Prime promoter, not lost fighter work.
- The central engine can recalculate all 62 rows without changing category coverage.
- Profiles remain synchronized with leaderboard rows.
- Scores now decide overall ranks and OVRs at the settled-runtime checkpoint.
- The safety-branch repair can proceed promoter by promoter with the same audit gate after every batch.

## Next Repair

Convert the remaining category promoters into category-only writers:

1. Championship Resume
2. Quality Wins
3. Longevity
4. Apex Peak

After each small batch, rerun this same settled runtime audit. Category coverage and final totals must remain unchanged.
