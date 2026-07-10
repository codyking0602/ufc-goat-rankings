# Twenty-Third Audit — Four-Category Balance Simulation

Generated: July 10, 2026

Mode: Read-only full-system simulation. No live category score, formula weight, total, rank, OVR, Apex Peak bonus, or Loss Context value was changed.

## Purpose

Test the three possible balancing strategies after all four base categories received semantic-anchor review:

1. category-scale changes;
2. headline-weight changes;
3. a hybrid of scale and weight changes.

The simulation evaluated the current 62 fighters, the current top-30 positive-score debate tier, and a directional 200-fighter panel containing the 62 real fighters plus 138 deterministic lower-tier profiles.

## Baseline

Declared formula weights:

- Championship Resume: 35%;
- Quality Wins: 27.5%;
- Prime Dominance: 27.5%;
- Longevity: 10%.

Current measured practical influence among the 62:

- Championship: 43.52%;
- Quality Wins: 26.13%;
- Prime Dominance: 17.99%;
- Longevity: 12.37%.

Monitoring guardrails used for the simulation:

- Championship: 30–42%;
- Quality Wins: 22–33%;
- Prime Dominance: 22–33%;
- Longevity: 7–15%.

## Scenario Results

| Scenario | Weights C/Q/P/L | All-62 influence C/Q/P/L | Top-30 influence C/Q/P/L | Positive board movers |
|---|---|---|---|---:|
| Current live | 35 / 27.5 / 27.5 / 10 | 43.52 / 26.13 / 17.99 / 12.37 | 48.47 / 24.26 / 13.59 / 13.68 | 0 |
| Champion-forward Championship only | 35 / 27.5 / 27.5 / 10 | 46.15 / 24.91 / 17.15 / 11.79 | 47.33 / 24.79 / 13.89 / 13.98 | 28 |
| Moderate weight-only shift | 30 / 27.5 / 32.5 / 10 | 38.43 / 26.93 / 21.90 / 12.74 | 43.48 / 25.39 / 16.81 / 14.32 | 22 |
| Minimum guardrail weight-only | 29.75 / 27.5 / 32.75 / 10 | 38.17 / 26.97 / 22.10 / 12.76 | 43.22 / 25.45 / 16.98 / 14.35 | 25 |
| Minimum champion-forward hybrid | 28.75 / 27.5 / 33.75 / 10 | 39.63 / 26.04 / 22.00 / 12.32 | 41.05 / 26.18 / 18.00 / 14.76 | 29 |
| Exact current-roster variance match | 26.26 / 26.99 / 39.21 / 7.54 | 35.01 / 27.50 / 27.50 / 10.00 | 40.47 / 26.49 / 21.56 / 11.48 | 36 |
| Exact champion-forward variance match | 24.25 / 27.73 / 40.28 / 7.75 | 35.00 / 27.50 / 27.49 / 10.00 | 36.86 / 28.10 / 22.87 / 12.18 | 34 |

## Main Finding

The apparent imbalance is heavily affected by the current roster being selected for historically relevant UFC careers.

On the directional 200-fighter panel, the unchanged current formula produced:

- Championship: 31.00%;
- Quality Wins: 29.96%;
- Prime Dominance: 28.41%;
- Longevity: 10.62%.

That is already very close to the declared 35 / 27.5 / 27.5 / 10 philosophy without changing any fighter score or formula weight.

This means the current 62-fighter effective shares should not be treated as proof that the headline weights are wrong. The current roster contains many fighters with similarly strong primes, while Championship accomplishment varies much more widely between champions, contenders, and non-champions.

## Why Exact Matching Is Rejected

Exact current-roster matching would require weights near:

- 26.26 Championship;
- 26.99 Quality;
- 39.21 Prime;
- 7.54 Longevity.

With the champion-forward Championship scale, exact matching would require Prime at 40.28% and Championship at 24.25%.

Those formulas are not credible permanent UFC accomplishment weights. They are fitted to the current 62-fighter distribution and would overcorrect as lower-tier fighters are added.

On the directional 200-fighter panel, the exact current-roster match would behave as:

- Championship: 22.99%;
- Quality Wins: 29.07%;
- Prime Dominance: 40.03%;
- Longevity: 7.91%.

That demonstrates why forcing today's practical percentages is not future-proof.

## Weight-Only Option

The smallest Championship-to-Prime transfer that put all four all-roster shares inside the monitoring guardrails was:

- Championship: 29.75%;
- Quality Wins: 27.5%;
- Prime Dominance: 32.75%;
- Longevity: 10%.

It moved 25 positive-score board positions and 23 board positions with the current penalties held fixed.

It also overcorrected on the directional 200-fighter panel:

- Championship: 26.15%;
- Quality Wins: 29.74%;
- Prime Dominance: 33.57%;
- Longevity: 10.54%.

The option is mathematically cleaner for today's 62, but less faithful to the intended long-term formula.

## Champion-Forward Hybrid Option

The smallest tested hybrid that combined the provisional champion-forward Championship scale with all-roster guardrail compliance used:

- Championship: 28.75%;
- Quality Wins: 27.5%;
- Prime Dominance: 33.75%;
- Longevity: 10%.

It produced:

- all-62 influence: 39.63 / 26.04 / 22.00 / 12.32;
- top-30 influence: 41.05 / 26.18 / 18.00 / 14.76;
- directional 200-fighter influence: 30.21 / 27.71 / 32.25 / 9.82.

This is the strongest fallback candidate if the app ultimately adopts the champion-forward Championship meanings. It preserves the main top-of-board shape but creates substantial raw-score movement:

- mean positive-score change: 6.15 points;
- maximum change: 8.58 points;
- 29 positive-score board movers;
- 19 board movers with current penalties held fixed.

Notable positive-score movements include:

- Khabib Nurmagomedov: +8.31 and three positions upward;
- Islam Makhachev: +8.29 and two positions upward;
- Jose Aldo: +6.64 and one position downward;
- Alexander Volkanovski: +6.33 with no rank change;
- Jon Jones: -0.86 with no rank change;
- Georges St-Pierre: +2.04 with no rank change.

The hybrid is directionally coherent, but the movement is too large to promote without validating the lower and middle portions of the scale with real careers.

## Decision

1. Do not change the live 35 / 27.5 / 27.5 / 10 weights based only on the current 62-fighter effective shares.
2. Reject exact variance matching as roster-dependent overfitting.
3. Keep Quality Wins, Prime Dominance, and Longevity on their accepted fixed semantic scales.
4. Keep the champion-forward Championship curve provisional and shadow-only.
5. Treat the 28.75 / 27.5 / 33.75 / 10 champion-forward hybrid as the leading fallback candidate, not an approved live formula.
6. Build a small real lower/middle-tier calibration sample before making a permanent formula decision.
7. The sample should validate the underpopulated lower portions of all four scales and replace synthetic future-roster assumptions with real UFC careers.
8. Rerun the full-system simulation after that sample is scored.
9. Finalize Loss Context only after the positive scoring formula is approved.

## Recommended Calibration Sample Shape

Approximately 12–15 real UFC careers should cover:

- ranked veteran with no title challenge;
- durable gatekeeper with many UFC fights;
- short-lived contender;
- one-time title challenger;
- isolated champion with no defense;
- interim champion with limited undisputed success;
- fighter with one elite upset but limited sustained proof;
- long UFC tenure with little elite longevity;
- strong prime with almost no Championship score;
- title success with a competitive rather than dominant prime.

The sample is not meant to join the live app immediately. Its purpose is to validate the 0–15 ranges and determine whether the current formula naturally balances once the roster is less elite-selected.
