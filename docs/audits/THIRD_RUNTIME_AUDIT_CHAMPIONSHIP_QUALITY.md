# Third Settled Runtime Audit — Championship and Quality Category-Only Checkpoint

Generated: July 9, 2026
Workflow: `Six-Category Runtime Audit`
Runtime: Headless Chromium after all current delayed scoring timers completed
Mutation mode: Read-only audit of the safety branch

## Changes Tested

- Converted `assets/js/championship-resume-live.js` into a Championship-category-only writer.
- Removed Championship mutations of totals, ranks, weighted breakdowns, and numerical display overrides.
- Removed Championship's unrelated Prime category-rank/OVR writer and its two delayed rewrite timers.
- Converted `assets/js/opponent-quality-live.js` into a Quality-Wins-category-only writer.
- Removed Quality Wins mutations of totals, ranks, weighted breakdowns, and category-rank/OVR overrides.
- Both modules now request recalculation from `final-score-engine.js` after updating their category values.
- Updated Quality Wins cache-bust loading to the category-only version.

No fighter category input, ledger row, audit value, Apex value, or Loss Context value was changed.

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

This is the desired result: category ownership changed, fighter values did not.

## Formula Validation

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

Jon Jones remained at `102.21` under the locked formula.

## Ownership Status After This Checkpoint

Category-only writers:

- Championship Resume
- Quality Wins
- Prime Dominance

Still able to mutate overall totals/ranks:

- Longevity
- Apex Peak
- legacy general weighting layer

## Deployment Note

`ranking-data-patches.js` still references the older Championship query-string version. This does not affect the branch runtime audit because the branch serves the current file contents, but the cache-bust reference must be updated before production merge.

## Next Repair

Convert Longevity into a category-only writer, then rerun the same settled runtime audit. Required result:

- 0 formula mismatches
- unchanged category coverage
- unchanged fighter totals and rankings
- no profile or display-override regressions
