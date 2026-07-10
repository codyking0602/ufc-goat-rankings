# Sixth Settled Runtime Audit — Final Score Ownership Checkpoint

Generated: July 9, 2026
Workflow: `Six-Category Runtime Audit`
Runtime: Headless Chromium after all current delayed scoring timers completed
Mutation mode: Read-only audit of the safety branch

## Changes Tested

- Converted `assets/data/score-weighting.js` into a compatibility-only layer.
- Preserved:
  - locked category weights
  - base maximums
  - Longevity legacy-conversion helper
  - pure score-breakdown helper
  - overall formula metadata
  - Rules-page weighting explanation
- Removed legacy weighting mutations of:
  - `totalScore`
  - `weightedScoreBreakdown`
  - board sorting and rank assignment
  - profile overall scores and ranks
  - numerical display overrides
- Removed the legacy weighting layer's duplicate Prime Windows and Prime Dominance loaders.
- Added a strict CI ownership gate to the settled browser audit.

No fighter category input, ledger row, audit value, Apex value, or Loss Context value was changed.

## Executive Result

- Roster fighters checked: 62
- Locked-formula mismatches: 0
- Forbidden score-derived display overrides: 0
- Duplicate leaderboard/profile names: 0
- Profile-to-leaderboard mismatches: 0
- Overall score ownership gate: PASS

## Ownership Proof

```text
Final score engine present: true
Final score engine version: final-score-engine-20260710a
Declared overall owner: final-score-engine.js
Legacy weighting version: score-weighting-20260710a-compatibility-only
Legacy weighting mode: compatibility-only
Legacy weighting mutates scores: false
Legacy Prime Windows loader: false
Legacy Prime Dominance loader: false
Fighter rows checked: 62
Rows with wrong owner: 0
```

Every settled leaderboard row carries:

```text
finalScoreEngineVersion = final-score-engine-20260710a
```

The workflow now fails automatically if:

- the legacy weighting layer reports score mutation authority
- the legacy layer reloads Prime Windows or Prime Dominance
- any fighter row is not owned by the final score engine
- any locked-formula mismatch appears

## Category Coverage Unchanged

| Category | Pass | Warn | Fail |
|---|---:|---:|---:|
| Championship Resume | 62 | 0 | 0 |
| Quality Wins | 57 | 0 | 5 |
| Prime Dominance | 53 | 0 | 9 |
| Longevity | 62 | 0 | 0 |
| Apex Peak | 61 | 1 | 0 |
| Loss Context | 0 | 61 | 1 |

This is the desired result: overall-score ownership changed, fighter values did not.

## Ownership Status After This Checkpoint

Category-only and validated:

- Championship Resume
- Quality Wins
- Prime Dominance
- Longevity
- Apex Peak

Overall-score owner:

- `assets/js/final-score-engine.js`

Compatibility-only, non-mutating:

- `assets/data/score-weighting.js`

## Remaining Work

Overall-score ownership is now clean. The next phase is not another scoring-engine rewrite.

Remaining priorities:

1. replace delayed/repeated module loading with one deterministic initialization chain
2. complete five missing Quality Wins audits
3. complete nine missing Prime Dominance audits
4. complete Dricus du Plessis' Apex Peak review
5. complete and review all Loss Context rows, including Sean O'Malley's missing adapter entry
6. audit Compare Mode and division-board source consistency
7. align all production cache-bust references before merge
