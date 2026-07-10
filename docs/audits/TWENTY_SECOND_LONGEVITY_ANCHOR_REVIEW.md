# Twenty-Second Audit — Longevity Anchor Review

Generated: July 10, 2026

Mode: Read-only Longevity semantic-anchor review. No live Longevity score, ledger input, total, rank, or OVR was changed.

## Existing Longevity Inputs

Longevity is already a fixed, roster-independent accomplishment model:

1. One shared UFC elite-prime window is defined for each fighter.
2. Long inactivity gaps inside the window are capped, normally at 18 months.
3. The ledger produces `gapAdjustedMonths` and `activeEliteYears`.
4. Modest status and division multipliers are applied.
5. The result is `countedEliteMonths`.
6. Counted elite months convert directly to a /30 score.

Formula:

`Longevity = min(30, countedEliteMonths / 120 × 30)`

where:

`countedEliteMonths = gapAdjustedMonths × statusMultiplier × divisionMultiplier`

Adding fighters cannot rescale an existing fighter's Longevity score.

## Accepted Score Meanings

| Score | Meaning |
|---:|---|
| 0 | No meaningful elite UFC longevity |
| 5 | Brief elite window |
| 10 | Established multi-year elite relevance |
| 15 | Strong sustained elite run |
| 20 | Great UFC elite longevity |
| 25 | All-time elite longevity |
| 30 | Historical benchmark longevity |

## Accepted Fixed Anchor Scale

The current linear model already aligns with those meanings:

| Counted elite months | Approximate counted years | Longevity score |
|---:|---:|---:|
| 0 | 0.00 | 0 |
| 20 | 1.67 | 5 |
| 40 | 3.33 | 10 |
| 60 | 5.00 | 15 |
| 80 | 6.67 | 20 |
| 100 | 8.33 | 25 |
| 120 | 10.00 | 30 |

The 120-month ceiling remains permanent. Fighters above 120 counted months cap at 30 without changing anyone else's score.

## Real-Fighter Alignment

The current roster provides clear examples across the scale:

| Score level | Representative current fighters |
|---:|---|
| Around 5 | Michael Bisping, Brock Lesnar, Miesha Tate |
| Around 10 | Ronda Rousey, Francis Ngannou, Aljamain Sterling, Chuck Liddell, Henry Cejudo |
| Around 15 | T.J. Dillashaw, Tony Ferguson, Cain Velasquez, Rose Namajunas, Junior dos Santos, Merab Dvalishvili |
| Around 20 | Dominick Cruz, Petr Yan, Dustin Poirier, Alexander Volkanovski, Khabib Nurmagomedov, Islam Makhachev |
| Around 25 | Anderson Silva, Amanda Nunes, Robert Whittaker, Zhang Weili |
| Near 30 | Max Holloway, Jose Aldo, Jon Jones, Frankie Edgar, Valentina Shevchenko, Georges St-Pierre |

Five fighters currently exceed the 120-month ceiling and receive 30/30. GSP lands essentially exactly at the benchmark with 119.99 counted months.

## Candidate Results

| Candidate | All-62 Longevity influence | Top-30 Longevity influence | Mean Longevity change | Maximum change | Fighters changing board rank |
|---|---:|---:|---:|---:|---:|
| Current 120-month linear | 12.37% | 13.76% | 0.00 | 0.00 | 0 |
| Earlier elite recognition | 11.20% | 12.11% | 1.89 | 2.50 | 9 |
| Compressed middle | 11.57% | 13.31% | 0.56 | 1.62 | 17 |
| Historically gated | 12.61% | 14.99% | 2.12 | 3.00 | 15 |

The declared formula weight is 10%. The current 12.37% all-roster influence and 13.76% top-30 influence are above the nominal weight, but remain inside a reasonable monitoring range for a category with genuine career-length variation.

## Why the Alternatives Were Rejected

### Earlier elite recognition

This option reduced measured influence by lifting short and middle elite windows. It also added approximately 2.5 category points to many three-to-four-year cases.

Examples:

- Ronda Rousey: 9.86 to 12.36;
- Francis Ngannou: 9.82 to 12.32;
- Aljamain Sterling: 10.37 to 12.87;
- Chuck Liddell: 10.40 to 12.90;
- Ilia Topuria: 12.08 to 14.58.

That change moved nine board positions and made brief or moderate elite windows look more established than the accepted score meanings require.

### Compressed middle

This option made only a modest influence improvement while moving 17 board positions. It also reduced several genuine all-time longevity cases without a strong accomplishment reason.

Examples:

- Anderson Silva: 24.70 to 23.08;
- Amanda Nunes: 23.39 to 21.99;
- Robert Whittaker: 23.37 to 21.98;
- Zhang Weili: 23.24 to 21.87;
- Charles Oliveira: 22.16 to 20.96.

### Historically gated

This option increased Longevity's practical influence rather than reducing it and cut many legitimate six-to-seven-year elite runs by about three points.

Examples:

- Alexander Volkanovski: 19.61 to 16.61;
- Khabib Nurmagomedov: 20.47 to 17.47;
- Demetrious Johnson: 21.03 to 18.03;
- Daniel Cormier: 20.92 to 17.92;
- Islam Makhachev: 19.36 to 16.36.

It was both harsher semantically and worse statistically.

## Current-Roster Coverage

The current roster covers approximately 4–30 on the Longevity scale. The 0–4 range remains thin because the roster is selected for historically relevant careers.

A later lower-tier calibration sample should validate careers with very short ranked or elite windows. That sample should not redefine the accepted 5–30 anchors.

## Final Runtime Validation

- roster fighters: 62;
- Championship Resume: 62 pass;
- Quality Wins: 62 pass;
- Prime Dominance: 62 pass;
- Longevity: 62 pass;
- Apex Peak: 62 pass;
- formula mismatches: 0;
- forbidden score-derived overrides: 0;
- duplicate scoring scripts: 0;
- overall-score ownership: PASS;
- deterministic initialization: PASS;
- live Longevity score movement: 0;
- board-rank movement: 0.

Loss Context remains QA-only and is not promoted live.

## Decision

1. Accept the current 120-month linear scale as the Longevity semantic anchor scale.
2. Keep the live Longevity formula unchanged.
3. Keep the 18-month default gap cap and existing status/division adjustments unchanged.
4. Keep 120 counted elite months as the permanent 30/30 benchmark.
5. Reject the earlier-recognition, compressed-middle, and historically gated alternatives.
6. Treat Longevity's 12.37% practical influence as acceptable pending the full-system balance review.
7. All four base categories now have accepted or provisional semantic anchor scales.
8. Run the complete four-category balance simulation next.
9. Finalize Loss Context only after the positive scoring model is approved.
