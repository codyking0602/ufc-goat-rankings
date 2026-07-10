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
- canonical final score engine added at `assets/js/final-score-engine.js`
- Championship Resume converted to a category-only writer
- Quality Wins converted to a category-only writer
- Prime Dominance converted to a category-only writer
- Longevity converted to a category-only writer
- Apex Peak converted to a category-only writer
- legacy general weighting layer converted to compatibility-only
- strict final-score ownership gate added to CI

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

The fifth settled audit preserved all 61 completed Apex audits, Dricus du Plessis' pending review, all totals, and all rankings.

Report:

- `docs/audits/FIFTH_RUNTIME_AUDIT_APEX.md`

### Final Score Ownership

The sixth settled audit proved:

- `final-score-engine-20260710a` is present
- all 62 leaderboard rows carry that final-engine owner version
- the legacy weighting layer is `compatibility-only`
- the legacy weighting layer reports `mutatesScores: false`
- duplicate Prime Windows and Prime Dominance loaders are disabled in the weighting layer
- 0 rows have the wrong overall owner
- 0 formula mismatches
- 0 forbidden numerical display overrides
- 0 profile-to-leaderboard mismatches

Report:

- `docs/audits/SIXTH_RUNTIME_AUDIT_SCORE_OWNERSHIP.md`

## Final Score Ownership

`assets/js/final-score-engine.js` is the only overall-score owner.

It calculates:

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

`assets/data/score-weighting.js` now exposes only:

- locked weights and maximums
- a pure compatibility breakdown helper
- formula metadata
- Rules-page weighting copy

It does not mutate scores, ranks, profiles, OVRs, display overrides, or load Prime modules.

## Category Writer Status

Category-only and validated:

- Championship Resume
- Quality Wins
- Prime Dominance
- Longevity
- Apex Peak

Overall-score owner:

- final score engine only

## Current Category Coverage

| Category | Pass | Warn | Fail |
|---|---:|---:|---:|
| Championship Resume | 62 | 0 | 0 |
| Quality Wins | 57 | 0 | 5 |
| Prime Dominance | 53 | 0 | 9 |
| Longevity | 62 | 0 | 0 |
| Apex Peak | 61 | 1 | 0 |
| Loss Context | 0 | 61 | 1 |

The coverage counts remained unchanged throughout consolidation. No fighter category inputs were altered.

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

`ranking-data-patches.js` still contains older query-string versions for some now-clean modules, including Championship Resume and the legacy weighting layer. The branch runtime is correct in fresh testing, but all cache-bust references must be aligned before production merge.

## Immediate Next Step

Replace the delayed and repeated scoring-module loaders with one deterministic initialization chain.

Required result:

- no score-changing or category-reapply timers
- categories load once in a defined order
- final score engine runs once after the category sources are ready
- 0 formula mismatches
- unchanged category coverage, totals, rankings, profiles, and OVRs
- ownership gate remains PASS

After deterministic loading, complete missing category audits and Loss Context coverage.

## Definition of Success

- 62/62 fighters covered by all six categories
- zero silent legacy fallbacks
- 62/62 totals match the locked formula within 0.01
- one final score engine
- zero category promoters writing totals or ranks
- zero score-changing timers
- scores, ranks, OVRs, profiles, category boards, division boards, and Compare Mode all read the same final rows
