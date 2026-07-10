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
- Prime Dominance promoter converted to a category-only writer
- module bootstrap updated to finish current category passes through the final score engine

## Final Score Engine Checkpoint

The second settled Chromium audit completed after all current delayed scoring timers ran.

Results:

- 62 roster fighters
- 53 formula mismatches before the repair
- 0 formula mismatches after the repair
- 0 forbidden score-derived display overrides
- 0 duplicate leaderboard/profile names
- 0 profile-to-leaderboard mismatches

Permanent report:

- `docs/audits/SECOND_RUNTIME_AUDIT_FINAL_ENGINE.md`

The final score engine now calculates:

```text
Championship Resume / 30 × 35
+ Quality Wins / 30 × 27.5
+ Prime Dominance / 30 × 27.5
+ Longevity / 30 × 10
+ Apex Peak
+ Loss Context
= Raw Score
```

It writes:

- `rawScore`
- `totalScore`
- `weightedScoreBreakdown`
- board rank
- score-derived overall OVR
- synchronized profile totals and ranks

## Prime Dominance Promoter Status

`prime-dominance-live-promoter.js` now writes only Prime-related values and audit metadata.

It no longer writes:

- `totalScore`
- `rawScore`
- board rank
- overall OVR
- category OVR
- category rank

It requests a recalculation from the final score engine after promoting Prime values.

## Current Category Coverage

| Category | Pass | Warn | Fail |
|---|---:|---:|---:|
| Championship Resume | 62 | 0 | 0 |
| Quality Wins | 57 | 0 | 5 |
| Prime Dominance | 53 | 0 | 9 |
| Longevity | 62 | 0 | 0 |
| Apex Peak | 61 | 1 | 0 |
| Loss Context | 0 | 61 | 1 |

The coverage counts remained unchanged during the final-score repair. This confirms no fighter inputs were altered.

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

## Immediate Next Step

Convert the remaining score-mutating category promoters into category-only writers in small tested batches:

1. Championship Resume and Quality Wins
2. Longevity
3. Apex Peak

After each batch, rerun the settled Chromium audit. Required checkpoint result:

- 0 formula mismatches
- unchanged category values and coverage
- unchanged expected totals and rankings
- no profile or display-override regressions

After the promoters are clean, complete the missing category audits and Loss Context coverage before replacing the timer-based loader.

## Definition of Success

- 62/62 fighters covered by all six categories
- zero silent legacy fallbacks
- 62/62 totals match the locked formula within 0.01
- one final score engine
- zero category promoters writing totals or ranks
- zero score-changing timers
- scores, ranks, OVRs, profiles, category boards, division boards, and Compare Mode all read the same final rows
