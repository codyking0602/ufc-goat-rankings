# Eighteenth Audit — Championship Fixed Benchmark

Generated: July 10, 2026

Mode: Live architecture hardening plus deterministic browser validation. The fixed benchmark preserves all current Championship scores and rankings.

## Problem

Championship Resume was normalized against the current roster leader. Under that design, a future fighter exceeding the current leader's adjusted title credit would lower every existing fighter's Championship score.

Example under the retired dynamic approach:

| Future leader credit | Existing score of 20/30 would become |
|---:|---:|
| 16.00 | 18.17 |
| 18.00 | 16.16 |
| 20.00 | 14.54 |

That behavior conflicts with the requirement that adding fighter #150 or #200 must not change the accomplishment score of an existing fighter.

## Implemented Decision

Championship Resume now uses a locked constant benchmark:

- Locked adjusted-title-credit benchmark: 14.54
- Formula: `min(30, adjusted title credit / 14.54 × 30)`
- Benchmark mode: `locked-constant`
- Future-roster stable: true

The 14.54 constant matches the prior live benchmark exactly. Therefore:

- every current Championship score is unchanged;
- every current total score is unchanged;
- every current rank is unchanged; and
- a future fighter exceeding 14.54 credits can score 30/30 without rescaling existing fighters.

## Diminishing-Return Simulation

Two fixed diminishing-return curves were tested and rejected.

| Scenario | Championship effective share, all 62 | Championship effective share, top 30 | Mean score change | Maximum score change | Fighters changing board rank |
|---|---:|---:|---:|---:|---:|
| Current/fixed linear | 43.52% | 48.47% | 0.00 | 0.00 | 0 |
| Moderate diminishing returns | 45.79% | 47.37% | 2.95 | 4.45 | 25 |
| Stronger diminishing returns | 46.62% | 46.44% | 4.43 | 6.51 | 29 |

The diminishing-return curves lifted the middle of the Championship distribution, increased full-roster Championship separation, and created substantial fighter movement. They did not solve the effective-weight concern cleanly.

## Prime Calibration Decision

The preceding fixed-anchor Prime simulation also rejected both proposed Prime component rewrites:

- Conservative option raised Prime's all-roster effective share only from 17.99% to 18.61%.
- Stronger option raised it only to 19.67%.
- The alternatives moved 26–30 fighters and made Elite Stakes roughly 39% of Prime separation in the directional 200-fighter panel.

Prime remains unchanged.

## Runtime Validation

- Roster fighters checked: 62
- Championship Resume: 62 pass
- Quality Wins: 62 pass
- Prime Dominance: 62 pass
- Longevity: 62 pass
- Apex Peak: 62 pass
- Formula mismatches: 0
- Profile-to-leaderboard mismatches: 0
- Forbidden score-derived overrides: 0
- Overall-score ownership gate: PASS
- Deterministic-initialization gate: PASS
- Final score engine applies: 1

## Calibration Conclusion

Do not force the current elite-selected roster into mathematically equal category dispersion.

The accepted model behavior is:

- category scores use fixed accomplishment rules;
- adding future fighters does not rescale existing fighters;
- Prime remains compressed among elite names rather than being artificially stretched;
- Championship retains its linear adjusted-title-credit formula, but its benchmark is now permanent; and
- effective-weight audits remain a monitoring tool rather than an automatic score-normalization command.

The next scoring phase is Loss Context validation and promotion.
