# Twenty-First Audit — Prime Dominance Anchor Review

Generated: July 10, 2026

Mode: Read-only Prime Dominance semantic-anchor review. No live Prime score, component rule, total, rank, or OVR was changed.

## Existing Prime Dominance Inputs

Prime Dominance is already a direct fixed-accomplishment sum:

- Prime Record: maximum 9 points;
- Round Control: maximum 8 points;
- Finish Pressure: maximum 5 points;
- Elite Stakes: maximum 8 points.

Formula:

`Prime Dominance = Prime Record + Round Control + Finish Pressure + Elite Stakes`

The score is not normalized to the current roster average, percentile, spread, or category leader. Adding fighters cannot rescale an existing fighter's Prime score.

## Accepted Score Meanings

| Score | Meaning |
|---:|---|
| 0 | No meaningful elite UFC prime |
| 5 | Brief ranked-level prime |
| 10 | Solid contender-level prime |
| 15 | Established elite contender prime |
| 20 | Championship-level prime |
| 25 | Historically dominant champion prime |
| 30 | Benchmark-level dominance |

## Current Component Balance

| Component | Maximum | Effective share inside Prime |
|---|---:|---:|
| Prime Record | 9 | 25.99% |
| Round Control | 8 | 21.77% |
| Finish Pressure | 5 | 28.95% |
| Elite Stakes | 8 | 23.29% |

The component shares are not identical, but no component currently overwhelms the category. The existing four-part split remains more balanced than the previously tested component recalibrations.

## Current Real-Fighter Alignment

The existing direct sum aligns well with the intended accomplishment meanings:

| Score level | Representative current fighters |
|---:|---|
| Around 15 | Holly Holm, Chael Sonnen, Mackenzie Dern, Carla Esparza |
| Around 20 | Dominick Cruz, Rose Namajunas, Michael Bisping, Tyron Woodley, Dricus du Plessis, Joanna Jedrzejczyk |
| Around 25 | Anderson Silva, Chuck Liddell, Cain Velasquez, Matt Hughes, Stipe Miocic, Georges St-Pierre, Francis Ngannou |
| Near benchmark | Ronda Rousey, Khabib Nurmagomedov, Amanda Nunes |

The current roster has no fighter below 13.40 because it is intentionally selected for historically relevant UFC careers. That does not mean the 0–10 range is invalid. A future lower-tier calibration sample should validate that range without rescaling the current elite anchors.

## Candidate Results

| Candidate | All-62 Prime influence | Top-30 Prime influence | Mean Prime change | Maximum change | Fighters changing board rank |
|---|---:|---:|---:|---:|---:|
| Current direct component sum | 17.99% | 13.59% | 0.00 | 0.00 | 0 |
| Stricter lower/middle ladder | 20.83% | 14.22% | 0.42 | 2.90 | 14 |
| Benchmark-level top lift | 18.93% | 15.62% | 0.12 | 1.76 | 9 |
| Full elite-roster spread | 23.60% | 18.01% | 1.40 | 4.15 | 35 |

## Why the Alternatives Were Rejected

### Stricter lower/middle ladder

This option mostly reduced lower Prime scores. It moved fighters without materially improving separation among the top-30 GOAT tier.

Examples:

- Dan Henderson: 13.40 to 10.50;
- Mackenzie Dern: 13.80 to 11.00;
- Chael Sonnen: 14.04 to 11.30;
- Holly Holm: 15.45 to 13.06;
- Robert Whittaker: 17.52 to 15.87.

The top-30 Prime influence rose only from 13.59% to 14.22%.

### Benchmark-level top lift

This option raised the highest Prime scores toward 30 but did not solve the category's broader compression.

Examples:

- Ronda Rousey: 28.24 to 30.00;
- Khabib Nurmagomedov: 28.12 to 29.81;
- Amanda Nunes: 27.60 to 29.01;
- Islam Makhachev: 26.54 to 27.38.

It created ranking movement and gave extra value to the current top of the Prime board without a strong accomplishment reason for adding a second conversion layer.

### Full elite-roster spread

This option came closest to Prime's nominal 27.5% weight, reaching 23.60% across all 62 fighters. However, it moved 35 board positions and reduced many legitimate elite primes by roughly three to four points.

Examples:

- Dan Henderson: 13.40 to 9.25;
- Mackenzie Dern: 13.80 to 9.75;
- Chael Sonnen: 14.04 to 10.05;
- Holly Holm: 15.45 to 11.81;
- Robert Whittaker: 17.52 to 14.40;
- Sean O'Malley: 18.15 to 15.25.

Even after that movement, Prime's top-30 influence reached only 18.01%. The option manufactured more spread but did not make the elite GOAT tier behave like a true 27.5% category.

## Relationship to the Earlier Component Simulation

The earlier Prime calibration simulation changed component formulas rather than applying a second conversion to the total. Those candidates were also rejected because they:

- created significant movement;
- produced only small influence gains;
- over-concentrated future-roster Prime separation in Elite Stakes; and
- reduced Finish Pressure too heavily.

Together, the two reviews show that neither component recalibration nor a top-level remapping provides a clean standalone solution to Prime's low measured influence.

## Decision

1. Accept the current direct four-component sum as the Prime Dominance semantic anchor scale.
2. Keep the live Prime formula unchanged.
3. Do not add a second conversion curve over the component total.
4. Keep the existing component maximums of 9, 8, 5, and 8.
5. Treat the current 15, 20, and 25 score levels as meaningful accomplishment anchors.
6. Use a later lower-tier calibration sample to validate the 0–10 range without redefining elite scores.
7. Treat Prime's 17.99% current practical influence as a full-system balance issue, not proof that the category's accomplishment scale is wrong.
8. Review Longevity semantic anchors next.
9. After Longevity, run the complete four-category balance simulation using:
   - Championship's provisional champion-forward anchors;
   - Quality Wins' accepted fixed linear anchors;
   - Prime Dominance's accepted direct component sum; and
   - Longevity's accepted or provisional anchors.

Loss Context remains deferred until the positive scoring model is finalized.
