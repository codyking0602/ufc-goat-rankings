# Current State

Updated: July 9, 2026

## Current Goal

Consolidate the six audited categories into one deterministic scoring pipeline without losing or redoing fighter inputs.

## Safety Branch

Protected branch:

```text
fix/unified-six-category-pipeline
```

Production `main` remains untouched. Draft PR #7 is a test harness only and must not be merged yet.

## Completed Foundation

- architecture, roadmap, current state, open issues, and changelog documented
- read-only six-category integrity auditor added
- standalone audit dashboard added
- branch-only headless Chromium audit workflow added
- first settled full-roster audit captured
- canonical final score engine added at `assets/js/final-score-engine.js`
- Championship Resume converted to a category-only writer
- Quality Wins converted to a category-only writer
- Prime Dominance converted to a category-only writer
- Longevity converted to a category-only writer
- Apex Peak converted to a category-only writer
- module bootstrap currently finishes category passes through the final score engine

## Consolidation Checkpoints

### Final Score Engine

The second settled Chromium audit reduced formula mismatches from 53 to 0 across all 62 fighters.

Report:

- `docs/audits/SECOND_RUNTIME_AUDIT_FINAL_ENGINE.md`

### Championship Resume and Quality Wins

The third settled audit confirmed both categories could be separated from overall scoring without changing category values, totals, or ranks.

Report:

- `docs/audits/THIRD_RUNTIME_AUDIT_CHAMPIONSHIP_QUALITY.md`

### Longevity

The fourth settled audit confirmed all 62 Fighter Era Ledger Longevity audits remained live after removing Longevity's overall-score ownership.

Report:

- `docs/audits/FOURTH_RUNTIME_AUDIT_LONGEVITY.md`

### Apex Peak

The fifth settled audit confirmed:

- 62 roster fighters
- 61 completed Apex Peak audits still live
- Dricus du Plessis remains the single pending Apex review
- 0 formula mismatches
- 0 forbidden score-derived display overrides
- 0 duplicate leaderboard/profile names
- 0 profile-to-leaderboard mismatches
- fighter totals, rankings, and men's top ten unchanged

Report:

- `docs/audits/FIFTH_RUNTIME_AUDIT_APEX.md`

## Final Score Ownership

`final-score-engine.js` calculates:

```text
Championship Resume / 30 × 35
+ Quality Wins / 30 × 27.5
+ Prime Dominance / 30 × 27.5
+ Longevity / 30 × 10
+ Apex Peak
+ Loss Context
= Raw Score
```

It owns:

- `rawScore`
- `totalScore`
- `weightedScoreBreakdown`
- board rank
- score-derived overall OVR
- synchronized profile totals and ranks

## Category Writer Status

Category-only and validated:

- Championship Resume
- Quality Wins
- Prime Dominance
- Longevity
- Apex Peak

Still able to write overall totals or ranks:

- legacy general weighting layer

Apex Peak now preserves the locked Apex table and fighter audits while no longer recalculating totals, sorting boards, copying overall values into profiles, or writing numerical display overrides.

## Current Category Coverage

| Category | Pass | Warn | Fail |
|---|---:|---:|---:|
| Championship Resume | 62 | 0 | 0 |
| Quality Wins | 57 | 0 | 5 |
| Prime Dominance | 53 | 0 | 9 |
| Longevity | 62 | 0 | 0 |
| Apex Peak | 61 | 1 | 0 |
| Loss Context | 0 | 61 | 1 |

The coverage counts remained unchanged throughout all consolidation checkpoints. No fighter category inputs were altered.

## Missing Coverage

Quality Wins live audits missing:

- Chuck Liddell
- Tito Ortiz
- Dricus du Plessis
- Sean O'Malley
- Julianna Peña

Merged Prime Dominance audits missing:

- Frankie Edgar
- T.J. Dillashaw
- Tyron Woodley
- Dricus du Plessis
- Aljamain Sterling
- Robert Whittaker
- Sean O'Malley
- Sean Strickland
- Dan Henderson

Apex Peak pending:

- Dricus du Plessis

Loss Context:

- Sean O'Malley has no usable adapter entry
- all current live penalties remain legacy-backed pending fighter-by-fighter review and promotion

## Deployment Cache Note

`ranking-data-patches.js` still references the older Championship query-string version. The branch runtime is correct, but this cache-bust reference must be updated before production merge.

## Immediate Next Step

Neutralize the legacy general weighting layer as an overall-score owner while preserving any rules-copy and compatibility APIs still needed by the app.

Then rerun the settled Chromium audit. Required result:

- 0 formula mismatches
- unchanged category coverage
- unchanged fighter totals and rankings
- no profile or display-override regressions
- `final-score-engine.js` as the only overall-score owner

After ownership is clean, complete missing category audits and Loss Context coverage before replacing the timer-based loader.

## Definition of Success

- 62/62 fighters covered by all six categories
- zero silent legacy fallbacks
- 62/62 totals match the locked formula within 0.01
- one final score engine
- zero category promoters writing totals or ranks
- zero score-changing timers
- scores, ranks, OVRs, profiles, category boards, division boards, and Compare Mode all read the same final rows