# Seventeenth Audit — Prime Fixed-Anchor Calibration Simulation

Generated: July 10, 2026

Mode: Read-only browser simulation. No live fighter score, category formula, rank, or OVR was changed.

## Purpose

Test whether Prime Dominance should be recalibrated using fixed accomplishment anchors rather than stretching the current 62-fighter distribution around its average.

The simulation compared:

1. Current locked model.
2. Conservative fixed-anchor calibration.
3. Stronger fixed-anchor calibration.

Each option was tested on:

- all 62 current fighters;
- the current top-30 GOAT debate tier; and
- a deterministic 200-fighter sensitivity panel containing the 62 real fighters plus 138 lower-tier Prime profiles.

## Top-Level Results

| Scenario | Prime effective share, all 62 | Prime effective share, top 30 | Mean absolute Prime change | Maximum Prime change | Fighters changing board rank |
|---|---:|---:|---:|---:|---:|
| Current | 17.99% | 13.59% | 0.00 | 0.00 | 0 |
| Conservative | 18.61% | 13.34% | 0.59 | 1.50 | 26 |
| Stronger | 19.67% | 13.72% | 1.06 | 2.61 | 30 |

Neither candidate restored Prime anywhere close to its nominal 27.5% influence. The conservative option slightly reduced Prime separation within the top-30 debate tier. The stronger option created larger fighter movement for only a small top-level influence gain.

## Current 62-Fighter Prime Component Shares

| Scenario | Record | Round control | Finish pressure | Elite stakes |
|---|---:|---:|---:|---:|
| Current | 25.99% | 21.77% | 28.95% | 23.29% |
| Conservative | 25.01% | 29.31% | 19.43% | 26.25% |
| Stronger | 23.39% | 34.14% | 16.01% | 26.46% |

The alternatives successfully widened Round Control and reduced Finish Pressure, but did so by redistributing influence inside a category that remained compressed overall.

## Future 200-Fighter Sensitivity

| Scenario | Prime P10–P90 spread | Record | Round control | Finish pressure | Elite stakes |
|---|---:|---:|---:|---:|---:|
| Current | 11.90 | 21.71% | 18.82% | 20.64% | 38.84% |
| Conservative | 12.23 | 21.04% | 25.64% | 13.80% | 39.51% |
| Stronger | 13.09 | 20.34% | 29.89% | 11.21% | 38.56% |

The future-roster panel exposes the main weakness in both candidate calibrations: Elite Stakes becomes roughly 39% of Prime separation while Finish Pressure falls to 11–14%. That is less balanced and less future-proof than the current model.

The 200-fighter panel is directional only and does not represent real future fighter scores. It confirms that fixed formulas keep existing fighter values independent of roster size while the observed distribution naturally changes as lower-tier fighters are added.

## Largest Candidate Movements

The stronger option reduced several fighters by more than two Prime points:

- Justin Gaethje: -2.61
- Dustin Poirier: -2.42
- Alex Pereira: -2.37
- Mackenzie Dern: -2.37
- Dan Henderson: -2.24
- Julianna Peña: -2.20

Georges St-Pierre increased by 1.48 under the stronger option.

These are substantial score changes without a proportional improvement in Prime's effective top-level influence.

## Decision

Reject both candidate Prime recalibrations.

Keep the current Prime Dominance formula live for now because:

- the proposed changes do not solve the top-level compression problem;
- they create unnecessary fighter movement;
- they over-concentrate future-roster influence in Elite Stakes; and
- the current roster is intentionally elite-selected, so some Prime compression among GOAT-level fighters is expected.

The next read-only calibration target should be Championship Resume normalization. Championship currently accounts for about 43.5% of effective base-category separation against a declared 35%, making it the larger and more direct imbalance.
