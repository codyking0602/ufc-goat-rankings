# Current State

Updated: July 9, 2026

## Current Goal

Finish full-roster six-category audit coverage now that scoring ownership and initialization are deterministic.

## Safety Branch

```text
fix/unified-six-category-pipeline
```

Production `main` remains untouched. Draft PR #7 is a test harness only and must not be merged yet.

## Architecture Status

Completed and runtime-validated:

- permanent architecture, state, roadmap, issues, changelog, and audit records
- read-only six-category integrity auditor
- branch-only headless Chromium audit workflow
- one canonical final score engine
- Championship Resume category-only writer
- Quality Wins category-only writer
- Prime Dominance category-only writer
- Longevity category-only writer
- Apex Peak category-only writer
- compatibility-only legacy weighting API
- strict overall-score ownership gate
- one deterministic scoring initialization chain
- strict deterministic-initialization gate

## Locked Formula

```text
Championship Resume / 30 × 35
+ Quality Wins / 30 × 27.5
+ Prime Dominance / 30 × 27.5
+ Longevity / 30 × 10
+ Apex Peak
+ Loss Context
= Raw Score
```

## Final Score Ownership

Only `assets/js/final-score-engine.js` may write:

- `rawScore`
- `totalScore`
- `weightedScoreBreakdown`
- board rank
- score-derived overall OVR
- synchronized profile totals and ranks

Current engine:

```text
final-score-engine-20260710b-deterministic
```

Current runtime proof:

- engine apply count: 1
- all 62 leaderboard rows owned by the final engine
- 0 rows with the wrong owner
- 0 formula mismatches
- 0 profile/leaderboard mismatches
- 0 forbidden numerical display overrides

## Deterministic Initialization

Current pipeline:

```text
deterministic-scoring-pipeline-20260710a
```

Ordered sequence:

1. prerequisite/data loader completes
2. Prime audit and category promoter load once
3. Longevity audit and category promoter load once
4. Apex audit and category promoter load once
5. final score engine loads and applies once
6. category percentile presentation installs once
7. UI refreshes once

Validated runtime properties:

- scoring timers: 0
- repeated scoring loads: 0
- duplicate scoring scripts: 0
- final score applies: 1
- refresh wrapper: disabled
- category tiers mutate scores: false
- category tiers reapply Prime: false

Permanent report:

- `docs/audits/SEVENTH_RUNTIME_AUDIT_DETERMINISTIC_INITIALIZATION.md`

## Current Category Coverage

| Category | Pass | Warn | Fail |
|---|---:|---:|---:|
| Championship Resume | 62 | 0 | 0 |
| Quality Wins | 57 | 0 | 5 |
| Prime Dominance | 53 | 0 | 9 |
| Longevity | 62 | 0 | 0 |
| Apex Peak | 61 | 1 | 0 |
| Loss Context | 0 | 61 | 1 |

No fighter category values changed during the ownership or initialization repairs.

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
- the other 61 ledger totals remain QA-only
- existing legacy `penalty` values remain live until the full review is complete

## Rankings Preserved

The men's top ten remains:

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

## Production Cache Note

The static `index.html` query strings for `module-versions.js` and `ranking-data-patches.js` still need final cache-bust alignment before merge. Fresh branch runtime testing uses the correct files and passes.

## Immediate Next Phase

Complete missing audited category coverage in this order:

1. five Quality Wins rows
2. nine Prime Dominance rows
3. Dricus du Plessis Apex Peak review
4. all 62 Loss Context rows, including Sean O'Malley

After each small batch, rerun the deterministic Chromium audit.

## Definition of Success

- 62/62 fighters covered by all six categories
- zero silent legacy fallbacks
- 62/62 totals match the locked formula within 0.01
- one final score owner
- zero category promoters writing totals or ranks
- zero score-changing timers
- one deterministic initialization sequence
- scores, ranks, OVRs, profiles, category boards, division boards, and Compare Mode all read the same final rows
