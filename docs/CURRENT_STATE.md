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
- Championship Resume promoter converted to a category-only writer
- Quality Wins promoter converted to a category-only writer
- Longevity promoter converted to a category-only writer
- module bootstrap updated to finish current category passes through the final score engine

## Consolidation Checkpoints

### Final Score Engine Checkpoint

The second settled Chromium audit reduced formula mismatches from 53 to 0 across all 62 fighters.

Permanent report:

- `docs/audits/SECOND_RUNTIME_AUDIT_FINAL_ENGINE.md`

### Championship and Quality Checkpoint

The third settled Chromium audit validated the category-only conversions for Championship Resume and Quality Wins.

Permanent report:

- `docs/audits/THIRD_RUNTIME_AUDIT_CHAMPIONSHIP_QUALITY.md`

### Longevity Checkpoint

The fourth settled Chromium audit validated the Longevity category-only conversion.

Results:

- 62 roster fighters
- 0 formula mismatches
- 62/62 Longevity audits live
- 0 forbidden score-derived display overrides
- 0 duplicate leaderboard/profile names
- 0 profile-to-leaderboard mismatches
- category coverage unchanged
- fighter totals, rankings, and top ten unchanged

Permanent report:

- `docs/audits/FOURTH_RUNTIME_AUDIT_LONGEVITY.md`

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

Still able to write overall totals or ranks:

- Apex Peak
- legacy general weighting layer

Championship no longer writes Prime category rank/OVR or runs delayed Prime override timers. Longevity no longer sorts boards, copies overall totals into profiles, or writes rank/audit data into display overrides.

## Current Category Coverage

| Category | Pass | Warn | Fail |
|---|---:|---:|---:|
| Championship Resume | 62 | 0 | 0 |
| Quality Wins | 57 | 0 | 5 |
| Prime Dominance | 53 | 0 | 9 |
| Longevity | 62 | 0 | 0 |
| Apex Peak | 61 | 1 | 0 |
| Loss Context | 0 | 61 | 1 |

The coverage counts remained unchanged during all consolidation checkpoints. This confirms no fighter inputs were altered.

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

Convert Apex Peak into a category-only writer and rerun the settled Chromium audit.

Required checkpoint result:

- 0 formula mismatches
- unchanged category values and coverage
- unchanged expected totals and rankings
- no profile or display-override regressions

After Apex Peak, address the legacy general weighting layer. Missing category audits and Loss Context coverage come after category ownership is clean.

## Definition of Success

- 62/62 fighters covered by all six categories
- zero silent legacy fallbacks
- 62/62 totals match the locked formula within 0.01
- one final score engine
- zero category promoters writing totals or ranks
- zero score-changing timers
- scores, ranks, OVRs, profiles, category boards, division boards, and Compare Mode all read the same final rows
