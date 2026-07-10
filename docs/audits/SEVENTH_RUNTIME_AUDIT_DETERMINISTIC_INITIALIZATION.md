# Seventh Runtime Audit — Deterministic Initialization Checkpoint

Generated: July 9, 2026
Workflow: `Six-Category Runtime Audit`
Runtime: Headless Chromium using the explicit scoring-pipeline ready signal
Mutation mode: Read-only audit of the safety branch

## Changes Tested

- Replaced all delayed scoring loads in `assets/data/module-versions.js` with one ordered Promise-based sequence.
- Added an explicit readiness handoff from `assets/data/ranking-data-patches.js`.
- Removed status-hook reapplication of Prime, dynamic ranks, and general refresh during prerequisite loading.
- Removed repeated early/mid/late loads for:
  - Prime percentile tiers
  - Longevity
  - Apex Peak
- Changed `final-score-engine.js` to explicit single-pass mode.
- Removed the final engine's automatic import-time calculation.
- Removed the final engine's refresh wrapper.
- Changed category percentile tiers into a read-only presentation layer.
- Removed category-tier reapplication of Prime during category-rank lookups.
- Removed duplicate category-tier and score-derived-OVR loading from the prerequisite chain.
- Added a deterministic-initialization CI gate.

No fighter category input, ledger row, audit value, Apex value, or Loss Context value was changed.

## Deterministic Sequence

The scoring pipeline now runs once in this order:

1. ranking-data prerequisites complete
2. Prime round-control audit
3. Prime Dominance ledgers
4. Prime shadow model
5. Prime category-only promoter
6. Prime presentation copy
7. Fighter Era Ledgers confirmed ready
8. Longevity shadow scorer
9. Longevity category-only promoter
10. Apex corrections confirmed ready
11. Apex component audit
12. Apex category-only promoter
13. final score engine loaded
14. final score engine applied once
15. category percentile presentation installed
16. UI refreshed once

## Executive Result

- Roster fighters: 62
- Locked-formula mismatches: 0
- Forbidden score-derived display overrides: 0
- Duplicate leaderboard/profile names: 0
- Profile-to-leaderboard mismatches: 0
- Overall score ownership gate: PASS
- Deterministic initialization gate: PASS

## Initialization Proof

```text
Pipeline version: deterministic-scoring-pipeline-20260710a
Pipeline mode: deterministic-single-pass
Pipeline status: ready
Scoring timer count: 0
Repeated load count: 0
Pipeline final-score apply count: 1
Final engine apply count: 1
Refresh wrapped by final engine: false
Category tier mode: read-only-after-scoring
Category tiers mutate scores: false
Category tiers reapply Prime: false
Duplicate scoring scripts: 0
```

Every audited scoring script appeared exactly once in the live document.

## Category Coverage Unchanged

| Category | Pass | Warn | Fail |
|---|---:|---:|---:|
| Championship Resume | 62 | 0 | 0 |
| Quality Wins | 57 | 0 | 5 |
| Prime Dominance | 53 | 0 | 9 |
| Longevity | 62 | 0 | 0 |
| Apex Peak | 61 | 1 | 0 |
| Loss Context | 0 | 61 | 1 |

## Formula and Ranking Validation

All 62 totals still match:

```text
Championship Resume / 30 × 35
+ Quality Wins / 30 × 27.5
+ Prime Dominance / 30 × 27.5
+ Longevity / 30 × 10
+ Apex Peak
+ Loss Context
= Raw Score
```

The men's top ten remained unchanged:

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

## Remaining Work

The delayed/repeated scoring-loader problem is resolved on the safety branch.

Next priorities:

1. align the two static `index.html` cache-bust references before production merge
2. complete five missing Quality Wins audits
3. complete nine missing Prime Dominance audits
4. complete Dricus du Plessis' Apex Peak review
5. complete and review Loss Context for all 62 fighters
6. audit Compare Mode and division-board source consistency
