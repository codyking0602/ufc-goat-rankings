# Fifteenth Audit — Category Distribution and Effective Weight

Generated: July 10, 2026

Mode: Read-only browser analysis. No category score, fighter total, rank, or OVR was changed.

## Main Finding

The declared formula weights and the categories’ current effective separation are not perfectly aligned.

| Base category | Declared weight | Effective standard-deviation share | Effective robust-spread share | Mean rank movement if removed |
|---|---:|---:|---:|---:|
| Championship Resume | 35.00% | 43.51% | 43.15% | 4.39 |
| Quality Wins | 27.50% | 26.13% | 26.81% | 3.06 |
| Prime Dominance | 27.50% | 17.99% | 18.21% | 2.90 |
| Longevity | 10.00% | 12.37% | 11.83% | 1.77 |

Apex Peak remains a separate bonus. Its current standard deviation is 0.72 points, its P10–P90 spread is 1.92 points, and removing it changes the average positive-category rank by 0.55 places.

## Interpretation

- Championship Resume currently separates the roster more strongly than its stated 35% weight suggests.
- Quality Wins is behaving close to its intended influence.
- Prime Dominance is materially compressed relative to its intended 27.5% influence.
- Longevity is slightly more influential than its stated 10% weight.
- Apex Peak is intentionally a smaller bonus and currently has limited effect on the full ranking order.

These are descriptive influence measures, not a recommendation to force every category into a uniform distribution. Category correlations mean the shares are not literal causal percentages, but the Championship/Prime gap is large enough to require a model review.

## Prime Dominance Components

| Component | Nominal share of Prime maximum | Effective standard-deviation share | P10–P90 share | Mean Prime-rank movement if removed |
|---|---:|---:|---:|---:|
| Prime record | 30.00% | 25.99% | 28.24% | 3.52 |
| Round control | 26.67% | 21.77% | 22.59% | 3.58 |
| Finish pressure | 16.67% | 28.96% | 29.44% | 5.35 |
| Elite stakes | 26.67% | 23.28% | 19.73% | 3.77 |

### Prime conclusions

- Prime record has a high average, but it still provides meaningful separation.
- Round control is moderately compressed and under its intended share.
- Finish pressure has a low average but the widest effective spread. It is currently the strongest Prime separator, not the weakest.
- Elite stakes has a high average and is somewhat compressed, especially by the robust P10–P90 measure.
- Prime’s total category compression is real, but it should not be fixed by simply giving finish pressure more weight. Finish pressure is already over-influential relative to its 5/30 allocation.

## Apex Peak Components

| Component | Nominal share of Apex maximum | Effective standard-deviation share | P10–P90 share | Mean Apex-rank movement if removed |
|---|---:|---:|---:|---:|
| Two-performance strength | 33.33% | 10.59% | 8.36% | 0.83 |
| Proof | 29.17% | 32.83% | 34.37% | 4.03 |
| Best-fighter claim | 20.83% | 33.46% | 33.94% | 3.90 |
| Aura | 16.67% | 23.12% | 23.33% | 2.93 |

### Apex conclusions

- Two-performance strength is severely compressed. Its mean is 1.84/2.00 and its P10–P90 spread is only 0.20.
- Proof is close to its intended influence.
- Best-fighter claim and Aura currently carry more of the Apex separation than their nominal maximums suggest.
- The Apex component analysis currently includes 60 of 62 fighters. Merab Dvalishvili and Zhang Weili have complete category scores but still need new-rubric component rows before any Apex recalibration.

## Source-Input Findings

### Championship Resume

- Adjusted title credit P10–P90: 0.95 to 8.40
- Title-fight wins P10–P90: 1.00 to 9.00

The very wide championship-credit distribution is the main reason Championship Resume is more influential than advertised.

### Quality Wins

- Diminished quality credit P10–P90: 5.20 to 10.91
- Elite-plus wins P10–P90: 1.00 to 4.00
- Top-five-plus wins P10–P90: 1.00 to 6.90

Quality Wins has a healthy middle spread and currently behaves close to its intended weight.

### Longevity

- Active elite years P10–P90: 3.15 to 7.50
- Counted elite months P10–P90: 39.30 to 98.26
- Status multiplier P10–P90: 1.02 to 1.12
- Division multiplier P10–P90: 0.95 to 1.05

Longevity is driven primarily by counted elite time. The status and division multipliers are narrow and function as modest adjustments rather than major separators.

## Recommended Order Before Loss Context

1. Add new-rubric Apex component rows for Merab Dvalishvili and Zhang Weili.
2. Review Prime component scaling, with special attention to compressed Round Control and Elite Stakes and over-separating Finish Pressure.
3. Review Championship normalization or diminishing returns rather than immediately changing its declared 35% weight.
4. Rerun this effective-weight audit after any calibration changes.
5. Finalize and promote Loss Context only after the positive-category influence is accepted.

No automatic recalibration was applied in this audit.
