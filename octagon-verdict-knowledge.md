# Octagon Verdict — Official UFC-Only Knowledge Pack

Generated: **2026-07-19T15:00:09.101Z**  
Canonical model-as-of date: **2026-07-13**  
Latest fighter-ledger verification date: **2026-07-17**  
Fighters: **80**

> Generated from the live browser scoring runtime. This file is authoritative for Octagon Verdict explanations. Do not replace calculated values with legacy score patches, visible category percentiles, memory, or non-UFC achievements.

## 1. Purpose and scope

Octagon Verdict explains and debates the same UFC-only rankings shown by the app. Every answer should distinguish **model fact**, **documented judgment call**, and **opinion/inference**. Model facts come from the calculated pipeline and the receipts below. Judgment calls come from approved canonical classifications. Anything else must be labeled as opinion.

## 2. Source architecture

1. `canonical-fighter-facts*.js` and canonical roster batches own complete UFC fight ledgers, quality tiers, title contexts, prime windows, round audits and loss classifications.
2. `fighter-era-ledgers.js` plus approved resolutions own shared prime/longevity windows and loss endpoints.
3. `canonical-scoring-judgments.js` plus approved Opponent Quality and Championship adjustments own fight-level judgment inputs—not final totals.
4. `category-calculators.js` reconstructs Championship, Opponent Quality, Prime Dominance, Longevity, Loss Penalty, Apex and Division-Era Depth.
5. `ranking-pipeline.js` applies weights, modifiers, ranks, visible stats and fixed-anchor OVRs.
6. `display-overrides.js` supplies human-facing explanations but does not own scores.
7. `octagon-verdict-knowledge.md` is the required Octagon Verdict knowledge artifact. Machine-readable JSON is optional and does not block fighter additions.

**Legacy warning:** compare coverage packs may contain old frozen score patches. They may supply narrative context, but the calculated runtime remains score authority.

| Layer | Version |
| --- | --- |
| scoringPipeline | production-ranking-bootstrap-20260717c-anthony-pettis-80 |
| rankingPipeline | ranking-pipeline-20260714b-direct-category-total-rank-ovr |
| categoryCalculators | category-calculators-20260714c-seven-direct-calculators |
| canonicalFacts | canonical-fighter-facts-20260713c-audited-rounds |
| fighterEraLedgers | fighter-era-ledgers-20260714h-full-72-coverage |
| scoringJudgments | canonical-scoring-judgments-20260714b-generated-approved-inputs |
| opponentQualityAdjustments | canonical-opponent-quality-audit-adjustments-20260716c-gaethje-johnson |
| championshipAdjustments | canonical-championship-audit-adjustments-20260716d-division-title-credit-alignment |
| divisionDepthResolutions | canonical-division-era-depth-approved-resolutions-20260715c-woodley-neutral |
| woodleyAudit | canonical-woodley-audit-adjustments-20260715a |

## 3. UFC-only rules

- Score official UFC achievements only. Pride, Strikeforce, WEC, ONE, Bellator, Cage Warriors, regional titles and TUF exhibitions may be mentioned only as context.
- Official no contests are excluded from scored wins/losses.
- Weird technical results keep official record status but may receive a non-competitive or technical-exception classification. Jon Jones’s Matt Hamill DQ is not a real competitive loss.
- Prime windows are fighter-specific and controlled by canonical facts plus fighter-era ledgers.
- Long inactivity gaps are capped at 18 months.
- Correct a false premise before debating it.

## 4. Scoring model

| Category | Raw range | Final weight | What it rewards |
| --- | --- | --- | --- |
| Championship | 0–30 | 35 | Adjusted UFC title-fight wins and title-opponent context |
| Opponent Quality | 0–30 | 25 | Quality of UFC wins with diminishing returns and fighter adjustments |
| Prime Dominance | 0–30 | 30 | Prime record, round control, finish pressure, elite validation and sample strength |
| Longevity | 0–30 | 10 | Gap-adjusted active elite months with status/division multipliers |
| Apex | 0–6 | Direct modifier | Two approved peak performances, proof, best-fighter claim and aura |
| Loss Penalty | 0 to -6 | Direct modifier | Contextual loss burden after event rules and aggregate compression |
| Division-Era Depth | Approved adjustment | Direct modifier | Approved division/era depth context |

`Total = Championship/30×35 + OpponentQuality/30×25 + PrimeDominance/30×30 + Longevity/30×10 + Apex + LossPenalty + DivisionEraDepth`

## 5. OVR versus raw score

Raw score decides rank. OVR is presentation: floor **82**, ceiling **99**, curve exponent **0.85**, fixed board anchors and a leader-only 99 rule. Men use 18.68–101.92 anchors; women use 25.78–80.79. OVR is not added back into the model.

## 6. Loss-penalty rules

| Situation | Raw event rule |
| --- | --- |
| Pre-prime loss to champion/top-five | -0.75 |
| Pre-prime loss to non-elite | -1.25 |
| Prime loss to champion/top-five | -1.50 |
| Prime loss to non-elite | -4.00 |
| Finished in counted loss | extra -0.75 |
| Post-prime loss | 0 |
| Prime upward-division loss to champion/top-five | -0.75 |
| Finished upward-division vs champion/top-five | extra -0.50 |

The current calculator does not simply sum every raw event. It compresses the ledger through worst-loss severity, loss frequency relative to exposure and a prime-loss volume floor; the final magnitude is capped at 6 and can receive a limited division-strength discount.

## 7. Division-strength framework

Division strength is implemented through fighter-specific canonical keys, era-ledger multipliers and approved Division-Era Depth adjustments. Defaults are guidance, not blind constants. Use the fighter’s own receipts below.

## 8. Current all-time leaderboard

### Men

| Rank | Fighter | OVR | Raw | Champ | OQ | Prime | Long | Apex | Penalty | Era |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Jon Jones | 99 | 101.47 | 30 | 29.47 | 26.35 | 29.13 | +6 | 0 | -0.15 |
| 2 | Georges St-Pierre | 96 | 87.15 | 25.11 | 30 | 24.47 | 25 | +5.56 | -3.78 | -1.73 |
| 3 | Anderson Silva | 95 | 77.98 | 21.05 | 24.39 | 25.1 | 20.58 | +5.8 | -3 | -1.67 |
| 4 | Demetrious Johnson | 95 | 77.22 | 21.87 | 22.34 | 25.06 | 16.82 | +5.15 | -1.51 | -1.23 |
| 5 | Islam Makhachev | 93 | 69.2 | 11.74 | 22.93 | 27.38 | 16.18 | +5.68 | -1.98 | -0.08 |
| 6 | Alexander Volkanovski | 93 | 67.15 | 15.39 | 23.24 | 20.21 | 20.69 | +5.34 | -2.61 | -0.02 |
| 7 | Khabib Nurmagomedov | 92 | 63.87 | 7.49 | 19.47 | 27.13 | 17.08 | +6 | 0 | +0.09 |
| 8 | Matt Hughes | 92 | 63.7 | 17.33 | 18.51 | 24.51 | 17.59 | +4.2 | -3.52 | -3 |
| 9 | Kamaru Usman | 92 | 63.25 | 11.45 | 24.02 | 21.82 | 14.08 | +5.48 | -2.39 | +0.27 |
| 10 | Max Holloway | 92 | 63.08 | 8.95 | 27.87 | 19.1 | 30 | +4.89 | -4.37 | -0.21 |
| 11 | Stipe Miocic | 92 | 62.92 | 11.97 | 21.86 | 24.17 | 15.53 | +5.01 | -3.46 | -0.17 |
| 12 | Jose Aldo | 92 | 62.69 | 14.88 | 23.06 | 17.44 | 29.7 | +4.96 | -5.15 | -1.04 |
| 13 | Randy Couture | 92 | 60.99 | 15.85 | 19.79 | 21.15 | 26.07 | +4.42 | -5.25 | -3 |
| 14 | Israel Adesanya | 91 | 59.24 | 14.98 | 22.05 | 17.44 | 13.12 | +5.12 | -3.5 | -0.05 |
| 15 | Daniel Cormier | 91 | 58.06 | 11.86 | 19.12 | 20.65 | 17.43 | +5.06 | -3.01 | -0.22 |
| 16 | Alex Pereira | 91 | 57.19 | 12.05 | 18.43 | 21.32 | 11.11 | +5.53 | -2.94 | +0.16 |
| 17 | Chuck Liddell | 91 | 56.42 | 9.28 | 19.84 | 26.94 | 8.64 | +5.27 | -3.09 | -2.94 |
| 18 | Charles Oliveira | 91 | 55.65 | 3.63 | 26.22 | 21.69 | 18.46 | +4.84 | -3.06 | -0.05 |
| 19 | T.J. Dillashaw | 90 | 55.08 | 9.59 | 19.2 | 23.53 | 12.58 | +4.85 | -3.35 | -1.33 |
| 20 | Merab Dvalishvili | 90 | 53.66 | 7.94 | 19.6 | 22.06 | 12.96 | +4.3 | -2.59 | -0.02 |
| 21 | Frankie Edgar | 90 | 53.52 | 5.88 | 23.83 | 19.51 | 26.99 | +4.21 | -4.51 | -1.41 |
| 22 | Francis Ngannou | 90 | 51.59 | 3.92 | 17.26 | 25.42 | 8.19 | +5.65 | -1.07 | -0.09 |
| 23 | Cain Velasquez | 90 | 50.52 | 7.84 | 17.26 | 22.43 | 11.86 | +5.45 | -3.29 | -1.55 |
| 24 | Benson Henderson | 90 | 50.49 | 7.55 | 21.38 | 19.38 | 11.83 | +4.58 | -3.26 | -0.78 |
| 25 | Aljamain Sterling | 89 | 50.21 | 6.5 | 24.02 | 18.16 | 8.64 | +4.36 | -2.74 | -0.05 |
| 26 | Junior dos Santos | 89 | 50.06 | 3.82 | 22.34 | 22.5 | 12.92 | +4.97 | -2.82 | -1.98 |
| 27 | B.J. Penn | 89 | 49.37 | 9.86 | 19.36 | 18.37 | 16.65 | +4.44 | -3.91 | -2.71 |
| 28 | Justin Gaethje | 89 | 49.04 | 5.08 | 20.51 | 18.83 | 17.32 | +4.95 | -3.47 | -0.06 |
| 29 | Glover Teixeira | 89 | 48.47 | 2.05 | 24.55 | 19.07 | 23 | +4.25 | -5.25 | -0.12 |
| 30 | Dustin Poirier | 89 | 48.37 | 1.46 | 25.05 | 18.81 | 16.39 | +4.94 | -3.4 | -0.02 |
| 31 | Alexandre Pantoja | 89 | 48.28 | 9.08 | 10.55 | 23.19 | 12.42 | +4.4 | -2.08 | -0.75 |
| 32 | Leon Edwards | 89 | 47.77 | 5.98 | 21.01 | 16.4 | 15.95 | +4.11 | -2.61 | +0.06 |
| 33 | Tito Ortiz | 89 | 47.75 | 10.54 | 14.44 | 18.95 | 21.89 | +3.99 | -3.82 | -3 |
| 34 | Ilia Topuria | 89 | 47.63 | 6.27 | 14.71 | 21.5 | 10.09 | +5.95 | -2.75 | -0.01 |
| 35 | Tyron Woodley | 89 | 47.49 | 7.53 | 14.81 | 19.57 | 13.41 | +4.69 | -2.37 | 0 |
| 36 | Fabricio Werdum | 89 | 47.38 | 3.4 | 20.37 | 20.8 | 15.27 | +5.17 | -3.8 | -0.83 |
| 37 | Robbie Lawler | 89 | 47.29 | 5.78 | 20.16 | 20.08 | 9.28 | +4.46 | -3.74 | -0.14 |
| 38 | Robert Whittaker | 89 | 47.28 | 3.01 | 23.46 | 17.39 | 19.56 | +4.1 | -3.75 | -0.04 |
| 39 | Tony Ferguson | 89 | 46.96 | 1.32 | 18.83 | 22.46 | 12.36 | +4.9 | -2.01 | +0.26 |
| 40 | Henry Cejudo | 89 | 46.85 | 7.51 | 14.04 | 22.52 | 4.77 | +4.35 | -1.69 | -0.38 |
| 41 | Chris Weidman | 89 | 46.31 | 7.63 | 13.33 | 19.73 | 16.71 | +5.68 | -4.18 | -0.5 |
| 42 | Frank Shamrock | 89 | 46.01 | 6.2 | 10.64 | 25.99 | 4.59 | +5.39 | 0 | -3 |
| 43 | Petr Yan | 89 | 45.93 | 5.39 | 17.18 | 17.91 | 16.93 | +4.15 | -2.34 | -0.04 |
| 44 | Sean Strickland | 89 | 45.89 | 4.13 | 21.97 | 17.82 | 12.73 | +3.85 | -3.42 | +0.27 |
| 45 | Deiveson Figueiredo | 89 | 45.88 | 5.57 | 20.11 | 17.97 | 12.06 | +4.38 | -3.38 | -0.37 |
| 46 | Conor McGregor | 89 | 45.84 | 6.19 | 16.06 | 21.21 | 10.47 | +5.8 | -4.81 | -0.45 |
| 47 | Brandon Moreno | 88 | 45.3 | 5.47 | 17.31 | 18.36 | 14.33 | +4.97 | -3.25 | -0.37 |
| 48 | Vitor Belfort | 88 | 45.22 | 2.3 | 18.72 | 20.97 | 15.24 | +5.26 | -3.71 | -0.66 |
| 49 | Lyoto Machida | 88 | 45.18 | 4.02 | 21.44 | 17.86 | 13.96 | +4.64 | -4.25 | -0.28 |
| 50 | Rashad Evans | 88 | 44.95 | 1.85 | 21.41 | 19.7 | 15.6 | +4.99 | -4.42 | -0.52 |
| 51 | Tom Aspinall | 88 | 44.48 | 3.09 | 10.45 | 23.59 | 11.19 | +5.09 | 0 | -0.25 |
| 52 | Dricus du Plessis | 88 | 44.32 | 5.88 | 14.92 | 19.14 | 9.05 | +4.55 | -1.95 | +0.27 |
| 53 | Dominick Cruz | 88 | 42.34 | 7.63 | 13.7 | 18.19 | 14.05 | +4.25 | -3.49 | -1.61 |
| 54 | Royce Gracie | 88 | 42.17 | 4.85 | 9.55 | 25.12 | 3.4 | +5.3 | 0 | -3 |
| 55 | Khamzat Chimaev | 88 | 40.84 | 1.96 | 13.86 | 19.61 | 11.08 | +5.17 | -1.89 | +0.42 |
| 56 | Michael Bisping | 87 | 37.9 | 3.61 | 19.36 | 15.19 | 4.24 | +3.77 | -2.92 | +0.11 |
| 57 | Anthony Pettis | 87 | 37.5 | 4.13 | 15.76 | 14.31 | 16.52 | +5.28 | -6 | +0.45 |
| 58 | Sean O'Malley | 87 | 36.15 | 3.82 | 13.3 | 16.67 | 9.78 | +4.06 | -3.28 | -0.1 |
| 59 | Quinton Jackson | 86 | 35.91 | 4.13 | 11.37 | 16.41 | 10.83 | +5.06 | -3.46 | 0 |
| 60 | Mauricio "Shogun" Rua | 86 | 33 | 1.95 | 15.29 | 15.44 | 6.85 | +4.81 | -4.38 | -0.17 |
| 61 | Forrest Griffin | 86 | 32.85 | 1.95 | 13.78 | 15.59 | 10.3 | +4.98 | -4.29 | -0.62 |
| 62 | Brock Lesnar | 86 | 31.86 | 5.67 | 8.3 | 18.57 | 4.78 | +4.18 | -3.76 | -2.26 |
| 63 | Dan Henderson | 84 | 27.2 | 0 | 13.64 | 13.22 | 9.63 | +4.47 | -4.5 | -0.57 |
| 64 | Chael Sonnen | 84 | 23.58 | 0 | 9.87 | 15.2 | 7.72 | +3.44 | -4.75 | -1.11 |
| 65 | Paddy Pimblett | 84 | 23.49 | 0 | 3.4 | 16.6 | 5.55 | +3.16 | -1.7 | +0.75 |

### Women

| Rank | Fighter | OVR | Raw | Champ | OQ | Prime | Long | Apex | Penalty | Era |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Amanda Nunes | 99 | 80.47 | 20.74 | 25.85 | 25.7 | 19.49 | +6 | -2.51 | -0.96 |
| 2 | Valentina Shevchenko | 98 | 79.33 | 20.74 | 25.4 | 22.97 | 26.77 | +5.19 | -2.59 | -0.53 |
| 3 | Zhang Weili | 92 | 56.64 | 11.66 | 17.98 | 19.85 | 19.23 | +4.85 | -2.92 | -0.13 |
| 4 | Joanna Jedrzejczyk | 91 | 50.15 | 11.24 | 17.34 | 18.27 | 13.58 | +5.04 | -3.25 | -2 |
| 5 | Rose Namajunas | 90 | 49.13 | 8.05 | 20.27 | 17.84 | 12.15 | +5.08 | -3.38 | -0.74 |
| 6 | Ronda Rousey | 89 | 45.49 | 10.83 | 11.06 | 22.2 | 8.22 | +5.2 | -3.94 | -2.57 |
| 7 | Jessica Andrade | 89 | 43.78 | 1.96 | 22.45 | 18.56 | 13.65 | +4.1 | -4.08 | -0.35 |
| 8 | Cris Cyborg | 87 | 39.03 | 4.8 | 9.04 | 22.39 | 6.86 | +4.6 | -3.38 | 0 |
| 9 | Carla Esparza | 87 | 37.64 | 3.43 | 15.85 | 16.58 | 20.19 | +3.92 | -5.58 | -1.22 |
| 10 | Alexa Grasso | 86 | 36.98 | 2.06 | 13.32 | 16.89 | 14.13 | +4.5 | -2.8 | +0.18 |
| 11 | Kayla Harrison | 86 | 35 | 2.06 | 6.28 | 21.57 | 5.5 | +3.48 | 0 | +0.49 |
| 12 | Mackenzie Dern | 85 | 34.33 | 1.77 | 14.87 | 14.42 | 14.2 | +4.1 | -3.38 | 0 |
| 13 | Julianna Peña | 83 | 27.76 | 3.73 | 10.56 | 10.02 | 9.54 | +4.65 | -3.57 | +0.33 |
| 14 | Miesha Tate | 82 | 26.18 | 1.96 | 11.04 | 15.95 | 6.2 | +3.63 | -4.5 | -2.46 |
| 15 | Holly Holm | 82 | 25.12 | 2.06 | 12.29 | 11.97 | 9.18 | +4.2 | -4.75 | -2 |

## 9. Query indexes

- **Highest-ranked men’s fighter with no derived undisputed UFC title win:** #30 Dustin Poirier (89 OVR). Separate résumé rank from subjective ability.
- **Best Prime Dominance score outside the men’s top 10:** #17 Chuck Liddell, 26.94.
- **Islam-to-GSP current raw-score gap:** 17.95 points. Passing GSP requires a full scenario rerun.
- **Cain vs Ngannou current ordering:** Ngannou is ahead (#22 vs #23). Correct any conflicting premise.
- **“Most hurt by UFC-only scoring” is an opinion question.** Use excluded-achievement context, label the inference and never invent a counterfactual score.

## 10. Fighter-by-fighter data cards

### 1. Jon Jones — 99 OVR

The benchmark UFC resume: unmatched title-fight success, elite quality wins, long-term dominance, and no true competitive loss.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 101.47 | 22-1, 1 NC | Light Heavyweight / Heavyweight | 16 | 14.54 | 12 | 16-0, 1 NC | 86.7% | 10.51 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 30 | 35 | 35 |
| Opponent Quality | 29.47 | 25 | 24.56 |
| Prime Dominance | 26.35 | 30 | 26.35 |
| Longevity | 29.13 | 10 | 9.71 |

Base score: **95.62**. Modifiers: Apex **+6**, Loss Penalty **0**, Division-Era Depth **-0.15**. Final raw score: **101.47**.

OVR conversion: 18.68–101.92 board anchors, normalized score **0.994594**, curved score **0.995403**, resulting in **99 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 30 | #1 | 14.54 adjusted credit / 14.54 benchmark |
| Opponent Quality | 29.47 | #2 | 13.85 diminished credit / 14.1 benchmark |
| Prime Dominance | 26.35 | #4 | 26.35 raw × 100.0% sample |
| Longevity | 29.13 | #3 | 139.82 counted elite months |
| Apex | +6 | Modifier | Youngest champ, instant best-in-the-world aura. |
| Loss Penalty | 0 | Modifier | 1 official/technical loss events reviewed |
| Division-Era Depth | -0.15 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **16**. Adjusted title wins: **14.54**. Derived undisputed-title win count: **15**. Interim-title win count: **1**.

| Date | Opponent | Title type | Base | Opponent strength | Final credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 2011-03-19 | Mauricio Rua | normal | 1 | 1 | 1 | locked |
| 2011-09-24 | Quinton Jackson | normal | 1 | 0.95 | 0.95 | locked |
| 2011-12-10 | Lyoto Machida | normal | 1 | 0.95 | 0.95 | locked |
| 2012-04-21 | Rashad Evans | normal | 1 | 1 | 1 | locked |
| 2012-09-22 | Vitor Belfort | normal | 1 | 0.9 | 0.9 | locked |
| 2013-04-27 | Chael Sonnen | normal | 1 | 0.75 | 0.75 | Weak/weird LHW title context. |
| 2013-09-21 | Alexander Gustafsson | normal | 1 | 1 | 1 | locked |
| 2014-04-26 | Glover Teixeira | normal | 1 | 1 | 1 | locked |
| 2015-01-03 | Daniel Cormier | normal | 1 | 1 | 1 | locked |
| 2016-04-23 | Ovince Saint Preux | interim | 0.75 | 0.8 | 0.6 | Interim title win over softer short-notice opponent. |
| 2018-12-29 | Alexander Gustafsson | vacant-undisputed | 0.9 | 1 | 0.9 | Elite vacant-title opponent; full opponent strength. |
| 2019-03-02 | Anthony Smith | normal | 1 | 0.85 | 0.85 | locked |
| 2019-07-06 | Thiago Santos | normal | 1 | 0.9 | 0.9 | locked |
| 2020-02-08 | Dominick Reyes | normal | 1 | 0.95 | 0.95 | Very strong challenger; controversial result context. |
| 2023-03-04 | Ciryl Gane | vacant-second-division | 1.15 | 0.9 | 1.04 | Vacant second-division title opponent discount. |
| 2024-11-16 | Stipe Miocic | normal | 1 | 0.75 | 0.75 | Aged/long-layoff opponent discount. |

#### Opponent Quality receipts

Raw win credit: **18.05**. Diminishing-return credit before fighter adjustment: **13.85**. Fighter adjustment: **0**. Final diminished credit: **13.85**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2011-03-19 | Mauricio Rua | champion-level | 1.25 | 1 | 1.25 | UFC light heavyweight champion and elite title-level opponent. |
| 2 | 2011-12-10 | Lyoto Machida | champion-level | 1.25 | 1 | 1.25 | Former UFC champion and elite light heavyweight. |
| 3 | 2012-04-21 | Rashad Evans | champion-level | 1.25 | 1 | 1.25 | Former UFC champion and still elite. |
| 4 | 2013-09-21 | Alexander Gustafsson | champion-level | 1.25 | 1 | 1.25 | Peak champion-type title challenger. |
| 5 | 2015-01-03 | Daniel Cormier | champion-level | 1.25 | 1 | 1.25 | Prime elite champion-level opponent and all-time great. |
| 6 | 2011-09-24 | Quinton Jackson | top-five | 1 | 1 | 1 | Former UFC champion and real top contender. |
| 7 | 2014-04-26 | Glover Teixeira | top-five | 1 | 0.75 | 0.75 | Elite top contender and future UFC champion. |
| 8 | 2018-12-29 | Alexander Gustafsson | top-five | 1 | 0.75 | 0.75 | Elite rematch title defense. |
| 9 | 2019-07-06 | Thiago Santos | top-five | 1 | 0.75 | 0.75 | Top title challenger; injury/weird fight context. |
| 10 | 2020-02-08 | Dominick Reyes | top-five | 1 | 0.75 | 0.75 | Prime top title challenger; close decision flagged. |
| 11 | 2023-03-04 | Ciryl Gane | top-five | 1 | 0.75 | 0.75 | Elite heavyweight contender and recent interim champion. |
| 12 | 2011-02-05 | Ryan Bader | top-ten | 0.85 | 0.75 | 0.64 | Undefeated strong contender. |
| 13 | 2012-09-22 | Vitor Belfort | top-ten | 0.85 | 0.5 | 0.42 | Dangerous former champion name, undersized context. |
| 14 | 2019-03-02 | Anthony Smith | top-ten | 0.85 | 0.5 | 0.42 | Ranked title challenger, softer than Jones’ best. |
| 15 | 2016-04-23 | Ovince Saint Preux | ranked | 0.65 | 0.5 | 0.33 | Ranked short-notice/interim-title context. |
| 16 | 2024-11-16 | Stipe Miocic | ranked | 0.65 | 0.5 | 0.33 | All-time heavyweight name, aged/long-layoff timing. |
| 17 | 2009-01-31 | Stephan Bonnar | solid | 0.45 | 0.5 | 0.23 | Good early UFC win. |
| 18 | 2010-03-21 | Brandon Vera | solid | 0.45 | 0.5 | 0.23 | Useful name before title run. |
| 19 | 2010-08-01 | Vladimir Matyushenko | solid | 0.45 | 0.25 | 0.11 | Solid veteran UFC win. |
| 20 | 2009-07-11 | Jake O'Brien | name-value | 0.25 | 0.25 | 0.06 | Low-end early UFC value. |
| 21 | 2013-04-27 | Chael Sonnen | name-value | 0.25 | 0.25 | 0.06 | Big name, weak/undersized LHW title context. |
| 22 | 2008-08-09 | Andre Gusmao | minimal | 0.1 | 0.25 | 0.03 | Minimal opponent-quality value. |

#### Prime Dominance receipts

Prime window: **Ryan Bader → Ciryl Gane**. Prime record: **16-0, 1 NC**. Effective samples: **16**. Sample multiplier: **100.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 9 | 16-0; 100.0% |
| Round control | 7.8 | 86.7%; rounds 52-8 |
| Finish pressure | 3 | 8 finishes; 50.0% |
| Elite-level validation | 6.55 | 16 elite-stage fights; 6.55 points |
| Raw prime score | 26.35 | Before sample multiplier |
| Final Prime Dominance | 26.35 | 26.35 × 1 |

#### Longevity receipts

Active elite years: **10.51**. Raw calendar months: **144.9**. Gap-adjusted months: **126.1**. Status multiplier: **1.12**. Division multiplier: **0.99**. Counted elite months: **139.82**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 2011-02-05 | 2011-03-19 | 1.38 | 1.38 | No |
| 2011-03-19 | 2011-09-24 | 6.21 | 6.21 | No |
| 2011-09-24 | 2011-12-10 | 2.53 | 2.53 | No |
| 2011-12-10 | 2012-04-21 | 4.37 | 4.37 | No |
| 2012-04-21 | 2012-09-22 | 5.06 | 5.06 | No |
| 2012-09-22 | 2013-04-27 | 7.13 | 7.13 | No |
| 2013-04-27 | 2013-09-21 | 4.83 | 4.83 | No |
| 2013-09-21 | 2014-04-26 | 7.13 | 7.13 | No |
| 2014-04-26 | 2015-01-03 | 8.28 | 8.28 | No |
| 2015-01-03 | 2016-04-23 | 15.64 | 15.64 | No |
| 2016-04-23 | 2017-07-29 | 15.18 | 15.18 | No |
| 2017-07-29 | 2018-12-29 | 17.02 | 17.02 | No |
| 2018-12-29 | 2019-03-02 | 2.07 | 2.07 | No |
| 2019-03-02 | 2019-07-06 | 4.14 | 4.14 | No |
| 2019-07-06 | 2020-02-08 | 7.13 | 7.13 | No |
| 2020-02-08 | 2023-03-04 | 36.8 | 18 | Yes |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **22** fights. Severity: **0**. Frequency: **0**. Prime-volume floor: **0**. Pre-division magnitude: **0**. Division discount: **0.0%**. Final penalty: **0**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Base | Finish extra | Raw event | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2009-12-05 | Matt Hamill | pre-prime | solid | home | No | No | 0 | 0 | 0 | technical exception / no penalty |

#### Division-strength context

Default division key: **jon-jones-mixed-lhw-hw-0.99**. Era-ledger division multiplier: **0.99**. Division-era modifier: **-0.15**.

Bader through Gane with long gaps capped.

#### Key judgment calls

- **Matt Hamill DQ:** not treated as a true competitive loss.
- **Daniel Cormier NC:** not counted as a win, but the broader Cormier rivalry still matters in context.
- **Heavyweight run:** boosts the resume, but does not carry the case by itself.
- **Close fights:** Santos/Reyes slightly affect dominance, but not enough to move him from #1.
- **Controversy:** acknowledged in context, while the profile stays focused on the UFC resume.

#### Why ranked here

Jones ranks #1 because he has the strongest UFC championship resume ever, the best title-fight win total, elite wins across multiple eras, and one of the longest elite runs in UFC history. His resume combines championship success, quality wins, prime dominance, and longevity better than anyone else.

#### Why not ranked lower?

The main arguments against Jones are close fights, inactivity gaps, late-career sample size at heavyweight, and outside-the-cage controversy. But as a UFC resume, his in-cage case still has the strongest overall combination of title success, elite opponents, dominance, and longevity.

#### Compare-mode guidance

- **Best counterargument:** The case against Jon is cleanliness: late-career performances were less dominant, Gustafsson and Reyes created real debate, the heavyweight sample is thin, and some fans will always hold the official Hamill DQ, no contest, or outside-the-cage issues against the resume.
- **Why this résumé can still win:** Jon's edge is championship volume plus opponent depth. Other fighters may have cleaner stories, prettier peaks, or fewer caveats, but Jon's UFC-only resume has the most total weight.

#### Final takeaway

Jones is the UFC benchmark: the deepest championship resume, elite quality wins, rare longevity, and no true competitive loss. He is the 99 OVR standard every other fighter is measured against.

_Ledger verified through 2026-07-13. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

### 2. Georges St-Pierre — 96 OVR

The complete UFC resume: a legendary welterweight reign, elite quality wins, and one of the cleanest prime runs in the sport.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 87.15 | 20-2 | Welterweight / Middleweight | 13 | 12.17 | 15 | 14-1 | 86.0% | 8.44 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 25.11 | 35 | 29.29 |
| Opponent Quality | 30 | 25 | 25 |
| Prime Dominance | 24.47 | 30 | 24.47 |
| Longevity | 25 | 10 | 8.33 |

Base score: **87.09**. Modifiers: Apex **+5.56**, Loss Penalty **-3.78**, Division-Era Depth **-1.73**. Final raw score: **87.15**.

OVR conversion: 18.68–101.92 board anchors, normalized score **0.822561**, curved score **0.847019**, resulting in **96 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 25.11 | #2 | 12.17 adjusted credit / 14.54 benchmark |
| Opponent Quality | 30 | #1 | 14.32 diminished credit / 14.1 benchmark |
| Prime Dominance | 24.47 | #11 | 24.47 raw × 100.0% sample |
| Longevity | 25 | #6 | 119.99 counted elite months |
| Apex | +5.56 | Modifier | Elite complete-fighter apex built on surgical control. |
| Loss Penalty | -3.78 | Modifier | 2 official/technical loss events reviewed |
| Division-Era Depth | -1.73 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **13**. Adjusted title wins: **12.17**. Derived undisputed-title win count: **12**. Interim-title win count: **1**.

| Date | Opponent | Title type | Base | Opponent strength | Final credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 2006-11-18 | Matt Hughes | normal | 1 | 1 | 1 | locked |
| 2007-12-29 | Matt Hughes | interim | 0.75 | 0.95 | 0.71 | Interim title value plus strong Hughes discount. |
| 2008-04-19 | Matt Serra | normal | 1 | 0.9 | 0.9 | locked |
| 2008-08-09 | Jon Fitch | normal | 1 | 1 | 1 | locked |
| 2009-01-31 | B.J. Penn | normal | 1 | 1 | 1 | locked |
| 2009-07-11 | Thiago Alves | normal | 1 | 0.95 | 0.95 | locked |
| 2010-03-27 | Dan Hardy | normal | 1 | 0.85 | 0.85 | locked |
| 2010-12-11 | Josh Koscheck | normal | 1 | 0.9 | 0.9 | locked |
| 2011-04-30 | Jake Shields | normal | 1 | 0.95 | 0.95 | locked |
| 2012-11-17 | Carlos Condit | normal | 1 | 0.95 | 0.95 | locked |
| 2013-03-16 | Nick Diaz | normal | 1 | 0.9 | 0.9 | locked |
| 2013-11-16 | Johny Hendricks | normal | 1 | 1 | 1 | locked |
| 2017-11-04 | Michael Bisping | second-division-undisputed | 1.25 | 0.85 | 1.06 | Second-division title opponent discount. |

#### Opponent Quality receipts

Raw win credit: **18.85**. Diminishing-return credit before fighter adjustment: **14.32**. Fighter adjustment: **0**. Final diminished credit: **14.32**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2006-03-04 | B.J. Penn | champion-level | 1.25 | 1 | 1.25 | Prime elite UFC champion; smaller-fighter context noted. |
| 2 | 2006-11-18 | Matt Hughes | champion-level | 1.25 | 1 | 1.25 | All-time welterweight champion while still elite. |
| 3 | 2008-08-09 | Jon Fitch | champion-level | 1.25 | 1 | 1.25 | Long-streak elite welterweight title challenger. |
| 4 | 2012-11-17 | Carlos Condit | champion-level | 1.25 | 1 | 1.25 | Interim UFC welterweight champion and elite prime contender. |
| 5 | 2013-11-16 | Johny Hendricks | champion-level | 1.25 | 1 | 1.25 | Peak title-caliber welterweight; controversial decision flagged. |
| 6 | 2007-08-25 | Josh Koscheck | top-five | 1 | 1 | 1 | Top welterweight contender and proven elite wrestler. |
| 7 | 2007-12-29 | Matt Hughes | top-five | 1 | 0.75 | 0.75 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 8 | 2009-01-31 | B.J. Penn | top-five | 1 | 0.75 | 0.75 | Elite champion-level fighter, size context keeps it below max. |
| 9 | 2009-07-11 | Thiago Alves | top-five | 1 | 0.75 | 0.75 | Prime top welterweight contender. |
| 10 | 2010-12-11 | Josh Koscheck | top-five | 1 | 0.75 | 0.75 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 11 | 2011-04-30 | Jake Shields | top-five | 1 | 0.75 | 0.75 | Elite grappler and top welterweight contender. |
| 12 | 2017-11-04 | Michael Bisping | top-five | 1 | 0.75 | 0.75 | Current middleweight champion, older/softer champion context. |
| 13 | 2005-08-20 | Frank Trigg | top-ten | 0.85 | 0.5 | 0.42 | Relevant ranked welterweight contender. |
| 14 | 2005-11-19 | Sean Sherk | top-ten | 0.85 | 0.5 | 0.42 | Strong ranked-quality win over future UFC champion. |
| 15 | 2008-04-19 | Matt Serra | top-ten | 0.85 | 0.5 | 0.42 | Official champion rematch, not champion-level opponent quality. |
| 16 | 2013-03-16 | Nick Diaz | top-ten | 0.85 | 0.5 | 0.42 | Big-name elite veteran with timing/activity context. |
| 17 | 2004-01-31 | Karo Parisyan | ranked | 0.65 | 0.5 | 0.33 | Early meaningful quality welterweight win. |
| 18 | 2010-03-27 | Dan Hardy | ranked | 0.65 | 0.5 | 0.33 | Title challenger, weaker than GSP’s best contenders. |
| 19 | 2004-06-19 | Jay Hieron | solid | 0.45 | 0.25 | 0.11 | Solid early UFC win. |
| 20 | 2005-04-16 | Jason Miller | solid | 0.45 | 0.25 | 0.11 | Useful UFC win. |

#### Prime Dominance receipts

Prime window: **Matt Hughes II → Michael Bisping**. Prime record: **14-1**. Effective samples: **15**. Sample multiplier: **100.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 8.4 | 14-1; 93.3% |
| Round control | 7.74 | 86.0%; rounds 49-8 |
| Finish pressure | 2 | 5 finishes; 33.3% |
| Elite-level validation | 6.33 | 15 elite-stage fights; 6.33 points |
| Raw prime score | 24.47 | Before sample multiplier |
| Final Prime Dominance | 24.47 | 24.47 × 1 |

#### Longevity receipts

Active elite years: **8.44**. Raw calendar months: **131.5**. Gap-adjusted months: **101.3**. Status multiplier: **1.15**. Division multiplier: **1.03**. Counted elite months: **119.99**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 2006-11-18 | 2007-04-07 | 4.6 | 4.6 | No |
| 2007-04-07 | 2007-08-25 | 4.6 | 4.6 | No |
| 2007-08-25 | 2007-12-29 | 4.14 | 4.14 | No |
| 2007-12-29 | 2008-04-19 | 3.68 | 3.68 | No |
| 2008-04-19 | 2008-08-09 | 3.68 | 3.68 | No |
| 2008-08-09 | 2009-01-31 | 5.75 | 5.75 | No |
| 2009-01-31 | 2009-07-11 | 5.29 | 5.29 | No |
| 2009-07-11 | 2010-03-27 | 8.51 | 8.51 | No |
| 2010-03-27 | 2010-12-11 | 8.51 | 8.51 | No |
| 2010-12-11 | 2011-04-30 | 4.6 | 4.6 | No |
| 2011-04-30 | 2012-11-17 | 18.63 | 18 | Yes |
| 2012-11-17 | 2013-03-16 | 3.91 | 3.91 | No |
| 2013-03-16 | 2013-11-16 | 8.05 | 8.05 | No |
| 2013-11-16 | 2017-11-04 | 47.61 | 18 | Yes |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **22** fights. Severity: **3.13**. Frequency: **0.85**. Prime-volume floor: **1**. Pre-division magnitude: **3.98**. Division discount: **5.0%**. Final penalty: **-3.78**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Base | Finish extra | Raw event | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2004-10-22 | Matt Hughes | pre-prime | champion-level | home | Yes | Yes | -0.75 | -0.75 | -1.5 | standard rule |
| 2007-04-07 | Matt Serra | prime | solid | home | Yes | Yes | -4 | -0.75 | -4.75 | standard rule |

#### Division-strength context

Default division key: **gsp-welterweight-1.05**. Era-ledger division multiplier: **1.03**. Division-era modifier: **-1.73**.

Hughes II through Bisping with retirement gap capped.

#### Key judgment calls

- **Matt Hughes 2004:** counts as a real early-career elite loss, but it was avenged twice.
- **Matt Serra 2007:** counts as a meaningful upset loss, but the rematch and title reclaim are central to his case.
- **Middleweight title win:** adds value, but his resume is built primarily on the welterweight reign.
- **Opponent quality wins:** is the clearest strength of the GSP case and the best in this ranking.
- **Late-career sample:** is small, so the profile stays focused on the established welterweight prime.

#### Why ranked here

St-Pierre ranks #2 because he combines an all-time welterweight title reign with the strongest quality-wins case in the UFC, elite consistency across his prime, and decisive revenge wins over the losses that matter most. His resume is one of the deepest, cleanest, and easiest to defend in the sport.

#### Why not ranked higher?

Jon Jones still has the edge in championship volume and total time at the very top. St-Pierre's case is elite across the board, but the Serra upset and slightly lower title-fight total keep him just behind #1.

#### Compare-mode guidance

- **Best counterargument:** GSP's argument against anyone is cleanliness. He avenged the losses, controlled elite opponents, and has fewer awkward resume questions than Jones.
- **Why this résumé can still win:** GSP wins comparisons when opponent quality, resume polish, and clean championship control matter more than raw title-fight volume.

#### Final takeaway

St-Pierre is the complete champion case: elite title success, the best quality-wins score in this ranking, long-term consistency, and decisive answers to the biggest questions on his resume.

_Ledger verified through 2026-07-13. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

### 3. Anderson Silva — 95 OVR

The peak-aura case: historic middleweight title control, terrifying finishing dominance, and one of the most iconic prime runs in UFC history.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 77.98 | 17-7, 1 NC | Middleweight / Light Heavyweight | 11 | 10.2 | 10 | 16-2 | 71.8% | 7.5 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 21.05 | 35 | 24.56 |
| Opponent Quality | 24.39 | 25 | 20.33 |
| Prime Dominance | 25.1 | 30 | 25.1 |
| Longevity | 20.58 | 10 | 6.86 |

Base score: **76.85**. Modifiers: Apex **+5.8**, Loss Penalty **-3**, Division-Era Depth **-1.67**. Final raw score: **77.98**.

OVR conversion: 18.68–101.92 board anchors, normalized score **0.712398**, curved score **0.749574**, resulting in **95 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 21.05 | #4 | 10.2 adjusted credit / 14.54 benchmark |
| Opponent Quality | 24.39 | #7 | 11.46 diminished credit / 14.1 benchmark |
| Prime Dominance | 25.1 | #8 | 25.1 raw × 100.0% sample |
| Longevity | 20.58 | #10 | 98.78 counted elite months |
| Apex | +5.8 | Modifier | Untouchable highlight-reel magic. |
| Loss Penalty | -3 | Modifier | 7 official/technical loss events reviewed |
| Division-Era Depth | -1.67 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **11**. Adjusted title wins: **10.2**. Derived undisputed-title win count: **11**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 2006-10-14 | Rich Franklin | normal | 1 | 1 | 1 | locked |
| 2007-07-07 | Nate Marquardt | normal | 1 | 0.95 | 0.95 | locked |
| 2007-10-20 | Rich Franklin | normal | 1 | 0.95 | 0.95 | locked |
| 2008-03-01 | Dan Henderson | normal | 1 | 1 | 1 | locked |
| 2008-10-25 | Patrick Cote | normal | 1 | 0.8 | 0.8 | Injury-stoppage/weaker title context. |
| 2009-04-18 | Thales Leites | normal | 1 | 0.75 | 0.75 | Weak/weird title context. |
| 2010-04-10 | Demian Maia | normal | 1 | 0.9 | 0.9 | locked |
| 2010-08-07 | Chael Sonnen | normal | 1 | 1 | 1 | locked |
| 2011-02-05 | Vitor Belfort | normal | 1 | 0.95 | 0.95 | locked |
| 2011-08-27 | Yushin Okami | normal | 1 | 0.9 | 0.9 | locked |
| 2012-07-07 | Chael Sonnen | normal | 1 | 1 | 1 | locked |

#### Opponent Quality receipts

Raw win credit: **13.8**. Diminishing-return credit before fighter adjustment: **11.46**. Fighter adjustment: **0**. Final diminished credit: **11.46**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2006-10-14 | Rich Franklin | champion-level | 1.25 | 1 | 1.25 | UFC middleweight champion and elite title-level opponent. |
| 2 | 2008-03-01 | Dan Henderson | champion-level | 1.25 | 1 | 1.25 | Elite champion-level opponent and all-time great. |
| 3 | 2007-02-03 | Travis Lutter | top-five | 1 | 1 | 1 | Top-five title-level opponent; missed-weight context does not erase opponent quality. |
| 4 | 2007-10-20 | Rich Franklin | top-five | 1 | 1 | 1 | Repeat win over former champion, still elite but repeat/age context. |
| 5 | 2010-08-07 | Chael Sonnen | top-five | 1 | 1 | 1 | Elite middleweight title challenger and real threat in rematch. |
| 6 | 2011-02-05 | Vitor Belfort | top-five | 1 | 1 | 1 | Explosive former champion and top middleweight title challenger. |
| 7 | 2012-07-07 | Chael Sonnen | top-five | 1 | 0.75 | 0.75 | Elite title challenger; difficult fight context but no performance modifier. |
| 8 | 2007-07-07 | Nate Marquardt | top-ten | 0.85 | 0.75 | 0.64 | Strong ranked middleweight contender. |
| 9 | 2009-08-08 | Forrest Griffin | top-ten | 0.85 | 0.75 | 0.64 | Former light heavyweight champion, timing/decline context. |
| 10 | 2010-04-10 | Demian Maia | top-ten | 0.85 | 0.75 | 0.64 | Elite grappler and ranked middleweight challenger. |
| 11 | 2011-08-27 | Yushin Okami | top-ten | 0.85 | 0.75 | 0.64 | Strong ranked middleweight contender. |
| 12 | 2017-02-11 | Derek Brunson | top-ten | 0.85 | 0.75 | 0.64 | Strong ranked middleweight contender. |
| 13 | 2006-06-28 | Chris Leben | solid | 0.45 | 0.5 | 0.23 | Good UFC debut win, not elite quality. |
| 14 | 2008-10-25 | Patrick Cote | solid | 0.45 | 0.5 | 0.23 | Title challenger but weaker opponent-quality case. |
| 15 | 2009-04-18 | Thales Leites | solid | 0.45 | 0.5 | 0.23 | Title challenger but softer contender context. |
| 16 | 2012-10-13 | Stephan Bonnar | solid | 0.45 | 0.5 | 0.23 | Name win at light heavyweight, limited quality value. |
| 17 | 2008-07-19 | James Irvin | name-value | 0.25 | 0.5 | 0.13 | Limited opponent-quality value. |

#### Prime Dominance receipts

Prime window: **Chris Leben → Chris Weidman II**. Prime record: **16-2**. Effective samples: **18**. Sample multiplier: **100.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 8 | 16-2; 88.9% |
| Round control | 6.46 | 71.8%; rounds 28-11 |
| Finish pressure | 4.5 | 14 finishes; 77.8% |
| Elite-level validation | 6.14 | 15 elite-stage fights; 6.14 points |
| Raw prime score | 25.1 | Before sample multiplier |
| Final Prime Dominance | 25.1 | 25.1 × 1 |

#### Longevity receipts

Active elite years: **7.5**. Raw calendar months: **90**. Gap-adjusted months: **90**. Status multiplier: **1.12**. Division multiplier: **0.98**. Counted elite months: **98.78**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 2006-06-28 | 2006-10-14 | 3.55 | 3.55 | No |
| 2006-10-14 | 2007-02-03 | 3.68 | 3.68 | No |
| 2007-02-03 | 2007-07-07 | 5.06 | 5.06 | No |
| 2007-07-07 | 2007-10-20 | 3.45 | 3.45 | No |
| 2007-10-20 | 2008-03-01 | 4.37 | 4.37 | No |
| 2008-03-01 | 2008-07-19 | 4.6 | 4.6 | No |
| 2008-07-19 | 2008-10-25 | 3.22 | 3.22 | No |
| 2008-10-25 | 2009-04-18 | 5.75 | 5.75 | No |
| 2009-04-18 | 2009-08-08 | 3.68 | 3.68 | No |
| 2009-08-08 | 2010-04-10 | 8.05 | 8.05 | No |
| 2010-04-10 | 2010-08-07 | 3.91 | 3.91 | No |
| 2010-08-07 | 2011-02-05 | 5.98 | 5.98 | No |
| 2011-02-05 | 2011-08-27 | 6.67 | 6.67 | No |
| 2011-08-27 | 2012-07-07 | 10.35 | 10.35 | No |
| 2012-07-07 | 2012-10-13 | 3.22 | 3.22 | No |
| 2012-10-13 | 2013-07-06 | 8.74 | 8.74 | No |
| 2013-07-06 | 2013-12-28 | 5.75 | 5.75 | No |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **18** fights. Severity: **2.25**. Frequency: **0.75**. Prime-volume floor: **2**. Pre-division magnitude: **3**. Division discount: **0.0%**. Final penalty: **-3**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Base | Finish extra | Raw event | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2013-07-06 | Chris Weidman | prime | champion-level | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2013-12-28 | Chris Weidman | prime | champion-level | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2016-02-27 | Michael Bisping | post-prime | top-five | home | No | Yes | 0 | 0 | 0 | standard rule |
| 2016-07-09 | Daniel Cormier | post-prime | champion-level | upward | No | Yes | 0 | 0 | 0 | standard rule |
| 2019-02-10 | Israel Adesanya | post-prime | top-five | home | No | Yes | 0 | 0 | 0 | standard rule |
| 2019-05-11 | Jared Cannonier | post-prime | top-five | home | Yes | Yes | 0 | 0 | 0 | standard rule |
| 2020-10-31 | Uriah Hall | post-prime | top-ten | home | Yes | Yes | 0 | 0 | 0 | standard rule |

#### Division-strength context

Default division key: **anderson-silva-middleweight-0.95**. Era-ledger division multiplier: **0.98**. Division-era modifier: **-1.67**.

Leben through Weidman II.

#### Key judgment calls

- **Peak aura:** central to the Silva case and heavily reflected in the prime-dominance score.
- **Weidman losses:** count as in-prime losses and are real resume drag.
- **Later losses:** treated mostly as post-prime context rather than the core Silva case.
- **Middleweight context:** the division-strength adjustment keeps the quality-wins category below the top tier.
- **Finishing threat:** a major reason his prime still feels more dominant than a normal title reign.

#### Why ranked here

Silva ranks #4 because his peak remains one of the most dominant and iconic runs in UFC history. He paired a historic middleweight title reign with rare finishing threat, long-term aura, and a level of separation that still defines elite prime dominance.

#### Why not ranked higher?

Silva does not pass the top three because the current scoring model gives Jones, St-Pierre, and Johnson stronger overall combinations of championship volume, opponent-quality wins, clean prime record, and loss context. The Weidman losses matter, and the middleweight division-strength adjustment keeps his quality-wins score below the very top tier.

#### Compare-mode guidance

- **Best counterargument:** Anderson’s argument is aura and peak fear factor. If someone values the most terrifying prime, he has one of the strongest cases ever.
- **Why this résumé can still win:** Anderson wins comparisons when peak impact, finishing danger, and iconic championship dominance outweigh cleaner but less explosive resumes.

#### Final takeaway

Silva is the UFC peak-aura legend: a historic champion, terrifying finisher, and one of the most influential dominant runs ever, with enough loss and opponent-strength context to keep him just behind the top three.

_Ledger verified through 2026-07-13. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

### 4. Demetrious Johnson — 95 OVR

The defining UFC flyweight champion: historic title control, elite technical dominance, and one of the cleanest prime skill sets in the sport.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 77.22 | 15-2-1 | Flyweight / Bantamweight | 12 | 10.6 | 8 | 13-1 | 81.8% | 6.15 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 21.87 | 35 | 25.52 |
| Opponent Quality | 22.34 | 25 | 18.62 |
| Prime Dominance | 25.06 | 30 | 25.06 |
| Longevity | 16.82 | 10 | 5.61 |

Base score: **74.81**. Modifiers: Apex **+5.15**, Loss Penalty **-1.51**, Division-Era Depth **-1.23**. Final raw score: **77.22**.

OVR conversion: 18.68–101.92 board anchors, normalized score **0.703268**, curved score **0.741400**, resulting in **95 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 21.87 | #3 | 10.6 adjusted credit / 14.54 benchmark |
| Opponent Quality | 22.34 | #15 | 10.5 diminished credit / 14.1 benchmark |
| Prime Dominance | 25.06 | #9 | 25.06 raw × 100.0% sample |
| Longevity | 16.82 | #18 | 80.74 counted elite months |
| Apex | +5.15 | Modifier | Legendary skill and separation, with flyweight proof context. |
| Loss Penalty | -1.51 | Modifier | 2 official/technical loss events reviewed |
| Division-Era Depth | -1.23 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **12**. Adjusted title wins: **10.6**. Derived undisputed-title win count: **12**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 2012-09-22 | Joseph Benavidez | vacant-undisputed | 0.9 | 1 | 0.9 | Inaugural/vacant flyweight title context. |
| 2013-01-26 | John Dodson | normal | 1 | 0.95 | 0.95 | locked |
| 2013-07-27 | John Moraga | normal | 1 | 0.85 | 0.85 | locked |
| 2013-12-14 | Joseph Benavidez | normal | 1 | 1 | 1 | locked |
| 2014-06-14 | Ali Bagautinov | normal | 1 | 0.85 | 0.85 | locked |
| 2014-09-27 | Chris Cariaso | normal | 1 | 0.75 | 0.75 | Clearly soft title opponent floor. |
| 2015-04-25 | Kyoji Horiguchi | normal | 1 | 0.95 | 0.95 | locked |
| 2015-09-05 | John Dodson | normal | 1 | 0.9 | 0.9 | locked |
| 2016-04-23 | Henry Cejudo | normal | 1 | 1 | 1 | locked |
| 2016-12-03 | Tim Elliott | normal | 1 | 0.75 | 0.75 | TUF/weird challenger context; soft/weird floor. |
| 2017-04-15 | Wilson Reis | normal | 1 | 0.85 | 0.85 | locked |
| 2017-10-07 | Ray Borg | normal | 1 | 0.85 | 0.85 | locked |

#### Opponent Quality receipts

Raw win credit: **12.45**. Diminishing-return credit before fighter adjustment: **10.5**. Fighter adjustment: **0**. Final diminished credit: **10.5**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2012-09-22 | Joseph Benavidez | champion-level | 1.25 | 1 | 1.25 | Elite flyweight title challenger and divisional great. |
| 2 | 2013-12-14 | Joseph Benavidez | champion-level | 1.15 | 1 | 1.15 | Elite divisional great; transparent adjacent-tier timing/depth adjustment. |
| 3 | 2013-01-26 | John Dodson | top-five | 1 | 1 | 1 | Elite flyweight contender and repeat title challenger. |
| 4 | 2015-04-25 | Kyoji Horiguchi | top-five | 1 | 1 | 1 | Elite young flyweight contender, future non-UFC greatness context. |
| 5 | 2015-09-05 | John Dodson | top-five | 1 | 1 | 1 | Prime dangerous flyweight title challenger. |
| 6 | 2016-04-23 | Henry Cejudo | top-five | 1 | 1 | 1 | Earlier/pre-title Cejudo; no future-title back-credit. |
| 7 | 2012-06-08 | Ian McCall | top-ten | 0.85 | 0.75 | 0.64 | Strong flyweight contender rematch win. |
| 8 | 2014-06-14 | Ali Bagautinov | top-ten | 0.85 | 0.75 | 0.64 | Ranked flyweight title challenger. |
| 9 | 2011-05-28 | Miguel Torres | ranked | 0.65 | 0.75 | 0.49 | Former elite bantamweight name, UFC timing context. |
| 10 | 2013-07-27 | John Moraga | ranked | 0.65 | 0.75 | 0.49 | Ranked challenger; softer opponent-quality proof. |
| 11 | 2014-09-27 | Chris Cariaso | ranked | 0.65 | 0.75 | 0.49 | Title challenger but softer division-context value. |
| 12 | 2016-12-03 | Tim Elliott | ranked | 0.65 | 0.75 | 0.49 | Ranked challenger; softer opponent-quality proof. |
| 13 | 2017-04-15 | Wilson Reis | ranked | 0.65 | 0.5 | 0.33 | Ranked flyweight contender. |
| 14 | 2017-10-07 | Ray Borg | ranked | 0.65 | 0.5 | 0.33 | Ranked challenger; not strong Top-10 quality after timing/depth review. |
| 15 | 2011-02-05 | Norifumi Yamamoto | solid | 0.45 | 0.5 | 0.23 | Legend name, but UFC/timing value limited. |

#### Prime Dominance receipts

Prime window: **Ian McCall II / Joseph Benavidez title run → Henry Cejudo II**. Prime record: **13-1**. Effective samples: **14**. Sample multiplier: **100.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 8.36 | 13-1; 92.9% |
| Round control | 7.36 | 81.8%; rounds 45-10 |
| Finish pressure | 3 | 7 finishes; 50.0% |
| Elite-level validation | 6.34 | 14 elite-stage fights; 6.34 points |
| Raw prime score | 25.06 | Before sample multiplier |
| Final Prime Dominance | 25.06 | 25.06 × 1 |

#### Longevity receipts

Active elite years: **6.15**. Raw calendar months: **73.9**. Gap-adjusted months: **73.9**. Status multiplier: **1.15**. Division multiplier: **0.95**. Counted elite months: **80.74**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 2012-06-08 | 2012-09-22 | 3.48 | 3.48 | No |
| 2012-09-22 | 2013-01-26 | 4.14 | 4.14 | No |
| 2013-01-26 | 2013-07-27 | 5.98 | 5.98 | No |
| 2013-07-27 | 2013-12-14 | 4.6 | 4.6 | No |
| 2013-12-14 | 2014-06-14 | 5.98 | 5.98 | No |
| 2014-06-14 | 2014-09-27 | 3.45 | 3.45 | No |
| 2014-09-27 | 2015-04-25 | 6.9 | 6.9 | No |
| 2015-04-25 | 2015-09-05 | 4.37 | 4.37 | No |
| 2015-09-05 | 2016-04-23 | 7.59 | 7.59 | No |
| 2016-04-23 | 2016-12-03 | 7.36 | 7.36 | No |
| 2016-12-03 | 2017-04-15 | 4.37 | 4.37 | No |
| 2017-04-15 | 2017-10-07 | 5.75 | 5.75 | No |
| 2017-10-07 | 2018-08-04 | 9.89 | 9.89 | No |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **18** fights. Severity: **1.13**. Frequency: **0.38**. Prime-volume floor: **0.75**. Pre-division magnitude: **1.51**. Division discount: **0.0%**. Final penalty: **-1.51**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Base | Finish extra | Raw event | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2011-10-01 | Dominick Cruz | pre-prime | champion-level | home | No | Yes | -0.75 | 0 | -0.75 | standard rule |
| 2018-08-04 | Henry Cejudo | prime | top-five | home | No | Yes | -1.5 | 0 | -1.5 | standard rule |

#### Division-strength context

Default division key: **demetrious-johnson-flyweight-0.85**. Era-ledger division multiplier: **0.95**. Division-era modifier: **-1.23**.

McCall/Benavidez title run through Cejudo II.

#### Key judgment calls

- **Flyweight context:** his dominance is respected, while the division-strength adjustment keeps the quality-wins score below the very top tier.
- **Dominick Cruz loss:** a real UFC loss at bantamweight, but not the core of his flyweight prime.
- **Henry Cejudo loss:** matters because it ended the UFC reign, but it was close enough that it does not erase the championship run.
- **Non-UFC success:** can be mentioned historically, but it is not scored in this ranking.
- **Skill vs resume:** his skill case may be even higher than his UFC resume score.

#### Why ranked here

Johnson ranks #3 because he built the UFC flyweight standard: a long title reign, elite technical control, strong prime dominance, and one of the best championship resumes in this ranking. His case is especially strong in title success and prime skill separation.

#### Why not ranked higher?

Johnson trails Jones and St-Pierre because his quality-wins score and flyweight division-strength context are lower in the current scoring model. His later non-UFC success adds historical context, but this ranking is based on the UFC resume.

#### Compare-mode guidance

- **Best counterargument:** DJ’s best counterargument is skill and cleanliness. He may not have the biggest names, but his technical control and consistency are almost impossible to ignore.
- **Why this résumé can still win:** DJ wins when the debate rewards complete dominance, clean title control, and fewer resume holes over bigger-name but messier cases.

#### Final takeaway

Johnson is the UFC flyweight benchmark: historic title success, elite prime dominance, and a clean technical style that still grades near the top of the all-time list.

_Ledger verified through 2026-07-13. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

### 5. Islam Makhachev — 93 OVR

The modern lightweight control case: elite finishing efficiency, high-end prime dominance, and a title run that keeps getting stronger.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 69.2 | 17-1 | Lightweight / Welterweight | 6 | 5.69 | 4 | 10-0 | 89.3% | 5.35 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 11.74 | 35 | 13.7 |
| Opponent Quality | 22.93 | 25 | 19.11 |
| Prime Dominance | 27.38 | 30 | 27.38 |
| Longevity | 16.18 | 10 | 5.39 |

Base score: **65.58**. Modifiers: Apex **+5.68**, Loss Penalty **-1.98**, Division-Era Depth **-0.08**. Final raw score: **69.2**.

OVR conversion: 18.68–101.92 board anchors, normalized score **0.606920**, curved score **0.654126**, resulting in **93 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 11.74 | #13 | 5.69 adjusted credit / 14.54 benchmark |
| Opponent Quality | 22.93 | #14 | 10.78 diminished credit / 14.1 benchmark |
| Prime Dominance | 27.38 | #1 | 27.38 raw × 100.0% sample |
| Longevity | 16.18 | #23 | 77.68 counted elite months |
| Apex | +5.68 | Modifier | Modern lightweight title proof at an elite level. |
| Loss Penalty | -1.98 | Modifier | 1 official/technical loss events reviewed |
| Division-Era Depth | -0.08 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **6**. Adjusted title wins: **5.69**. Derived undisputed-title win count: **6**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 2022-10-22 | Charles Oliveira | vacant-undisputed | 0.9 | 1 | 0.9 | Elite vacant-title opponent; full opponent strength. |
| 2023-02-11 | Alexander Volkanovski | normal | 1 | 0.95 | 0.95 | P4P champ moving up; slight size/division discount. |
| 2023-10-21 | Alexander Volkanovski | normal | 1 | 0.9 | 0.9 | Short-notice moving-up rematch discount. |
| 2024-06-01 | Dustin Poirier | normal | 1 | 0.95 | 0.95 | locked |
| 2025-01-18 | Renato Moicano | normal | 1 | 0.8 | 0.8 | Short-notice softer title defense. |
| 2025-11-15 | Jack Della Maddalena | second-division-undisputed | 1.25 | 0.95 | 1.19 | Current-table second-division title opponent discount. |

#### Opponent Quality receipts

Raw win credit: **12.65**. Diminishing-return credit before fighter adjustment: **10.78**. Fighter adjustment: **0**. Final diminished credit: **10.78**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2022-10-22 | Charles Oliveira | champion-level | 1.25 | 1 | 1.25 | Elite lightweight champion-level opponent. |
| 2 | 2023-02-11 | Alexander Volkanovski | champion-level | 1.25 | 1 | 1.25 | P4P elite champion moving up; still champion-level quality. |
| 3 | 2024-06-01 | Dustin Poirier | champion-level | 1.25 | 1 | 1.25 | Elite lightweight title challenger and former interim champion. |
| 4 | 2025-11-15 | Jack Della Maddalena | champion-level | 1.25 | 1 | 1.25 | UFC welterweight champion/title-level win in second division. |
| 5 | 2023-10-21 | Alexander Volkanovski | top-five | 1 | 1 | 1 | Elite opponent, but short-notice/up-division context keeps below max. |
| 6 | 2019-04-20 | Arman Tsarukyan | top-ten | 0.85 | 1 | 0.85 | Early version of future elite lightweight, high-skill win. |
| 7 | 2021-10-30 | Dan Hooker | top-ten | 0.85 | 0.75 | 0.64 | Ranked lightweight contender, short-notice context noted. |
| 8 | 2022-02-26 | King Green | top-ten | 0.85 | 0.75 | 0.64 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 9 | 2021-03-06 | Drew Dober | ranked | 0.65 | 0.75 | 0.49 | Quality lightweight win in prime-start window. |
| 10 | 2021-07-17 | Thiago Moises | ranked | 0.65 | 0.75 | 0.49 | Useful ranked/near-ranked lightweight win. |
| 11 | 2025-01-18 | Renato Moicano | ranked | 0.65 | 0.75 | 0.49 | Late-replacement ranked-quality title defense context. |
| 12 | 2016-09-17 | Chris Wade | solid | 0.45 | 0.75 | 0.34 | Solid early UFC win. |
| 13 | 2017-02-11 | Nik Lentz | solid | 0.45 | 0.5 | 0.23 | Solid veteran lightweight win. |
| 14 | 2018-01-20 | Gleison Tibau | solid | 0.45 | 0.5 | 0.23 | Veteran win after Tibau’s best years. |
| 15 | 2019-09-07 | Davi Ramos | solid | 0.45 | 0.5 | 0.23 | Solid specialist win. |
| 16 | 2018-07-28 | Kajan Johnson | name-value | 0.25 | 0.5 | 0.13 | Limited opponent-quality value. |
| 17 | 2015-05-23 | Leo Kuntz | minimal | 0.1 | 0.5 | 0.05 | Minimal opponent-quality value. |

#### Prime Dominance receipts

Prime window: **Drew Dober → Current title-level form**. Prime record: **10-0**. Effective samples: **10**. Sample multiplier: **100.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 9 | 10-0; 100.0% |
| Round control | 8.04 | 89.3%; rounds 25-3 |
| Finish pressure | 4.5 | 8 finishes; 80.0% |
| Elite-level validation | 5.84 | 6 elite-stage fights; 5.84 points |
| Raw prime score | 27.38 | Before sample multiplier |
| Final Prime Dominance | 27.38 | 27.38 × 1 |

#### Longevity receipts

Active elite years: **5.35**. Raw calendar months: **64.2**. Gap-adjusted months: **64.2**. Status multiplier: **1.1**. Division multiplier: **1.1**. Counted elite months: **77.68**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 2021-03-06 | 2021-07-17 | 4.37 | 4.37 | No |
| 2021-07-17 | 2021-10-30 | 3.45 | 3.45 | No |
| 2021-10-30 | 2022-02-26 | 3.91 | 3.91 | No |
| 2022-02-26 | 2022-10-22 | 7.82 | 7.82 | No |
| 2022-10-22 | 2023-02-11 | 3.68 | 3.68 | No |
| 2023-02-11 | 2023-10-21 | 8.28 | 8.28 | No |
| 2023-10-21 | 2024-06-01 | 7.36 | 7.36 | No |
| 2024-06-01 | 2025-01-18 | 7.59 | 7.59 | No |
| 2025-01-18 | 2025-11-15 | 9.89 | 9.89 | No |
| 2025-11-15 | 2026-07-13 | 7.89 | 7.89 | No |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **18** fights. Severity: **2**. Frequency: **0.33**. Prime-volume floor: **0**. Pre-division magnitude: **2.33**. Division discount: **15.0%**. Final penalty: **-1.98**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Base | Finish extra | Raw event | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2015-10-03 | Adriano Martins | pre-prime | solid | home | Yes | Yes | -1.25 | -0.75 | -2 | standard rule |

#### Division-strength context

Default division key: **islam-modern-elite-lightweight-1.10**. Era-ledger division multiplier: **1.1**. Division-era modifier: **-0.08**.

Drew Dober through current title-level form.

#### Key judgment calls

- **Prime start:** the main scoring window begins with Drew Dober in 2021.
- **Volkanovski wins:** receive top-level quality-wins credit in this ranking.
- **Pre-prime loss:** the Martins loss counts, but only lightly because it came before his prime.
- **Prime dominance:** is second-best in this ranking and the strongest part of his case outside the belt run.
- **Second division:** the welterweight piece helps the profile, but lightweight remains the center of his resume.

#### Why ranked here

Islam ranks #5 because the current scoring model sees a rare combination of elite prime dominance and a rapidly growing championship resume. His skill, control, and finishing threat already put him near the very top tier.

#### Why not ranked higher?

He is still chasing the total volume of the fighters above him. The current scoring model also carries his pre-prime Martins loss and gives him fewer total elite-year reps than the older all-time resumes above him.

#### Compare-mode guidance

- **Best counterargument:** The counterargument against Islam is that he still does not feel as untouchable as Khabib. The resume may be bigger, but the aura is not quite as clean.
- **Why this résumé can still win:** Islam wins when the debate rewards total resume over pure peak. His championship volume and elite-win depth have become too much to ignore.

#### Final takeaway

Islam is the modern lightweight benchmark: elite control, elite finishing, and a championship case that is already strong enough to sit in the all-time top five.

_Ledger verified through 2026-07-13. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

### 6. Alexander Volkanovski — 93 OVR

The complete featherweight champion case: title consistency, strong quality wins, and one of the deepest modern resumes in the sport.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 67.15 | 15-3 | Featherweight / Lightweight | 8 | 7.46 | 8 | 9-3 | 75.0% | 7.17 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 15.39 | 35 | 17.96 |
| Opponent Quality | 23.24 | 25 | 19.37 |
| Prime Dominance | 20.21 | 30 | 20.21 |
| Longevity | 20.69 | 10 | 6.9 |

Base score: **64.44**. Modifiers: Apex **+5.34**, Loss Penalty **-2.61**, Division-Era Depth **-0.02**. Final raw score: **67.15**.

OVR conversion: 18.68–101.92 board anchors, normalized score **0.582292**, curved score **0.631495**, resulting in **93 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 15.39 | #7 | 7.46 adjusted credit / 14.54 benchmark |
| Opponent Quality | 23.24 | #12 | 10.93 diminished credit / 14.1 benchmark |
| Prime Dominance | 20.21 | #30 | 20.21 raw × 100.0% sample |
| Longevity | 20.69 | #9 | 99.32 counted elite months |
| Apex | +5.34 | Modifier | High-end modern featherweight apex. |
| Loss Penalty | -2.61 | Modifier | 3 official/technical loss events reviewed |
| Division-Era Depth | -0.02 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **8**. Adjusted title wins: **7.46**. Derived undisputed-title win count: **8**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 2019-12-14 | Max Holloway | normal | 1 | 1 | 1 | locked |
| 2020-07-11 | Max Holloway | normal | 1 | 1 | 1 | locked |
| 2021-09-25 | Brian Ortega | normal | 1 | 0.9 | 0.9 | locked |
| 2022-04-09 | Chan Sung Jung | normal | 1 | 0.85 | 0.85 | locked |
| 2022-07-02 | Max Holloway | normal | 1 | 1 | 1 | locked |
| 2023-07-08 | Yair Rodriguez | normal | 1 | 0.95 | 0.95 | locked |
| 2025-04-12 | Diego Lopes | vacant-undisputed | 0.9 | 0.9 | 0.81 | Current-table vacant title context. |
| 2026-01-31 | Diego Lopes | normal | 1 | 0.95 | 0.95 | Current-table title defense context. |

#### Opponent Quality receipts

Raw win credit: **12.55**. Diminishing-return credit before fighter adjustment: **10.93**. Fighter adjustment: **0**. Final diminished credit: **10.93**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2019-05-11 | Jose Aldo | champion-level | 1.25 | 1 | 1.25 | Former long-time champion still elite at featherweight. |
| 2 | 2019-12-14 | Max Holloway | champion-level | 1.25 | 1 | 1.25 | Prime featherweight champion and all-time great. |
| 3 | 2020-07-11 | Max Holloway | champion-level | 1.25 | 1 | 1.25 | Prime elite champion-level opponent; close-decision context flagged. |
| 4 | 2022-07-02 | Max Holloway | champion-level | 1.25 | 1 | 1.25 | Elite champion-level opponent and legacy-defining trilogy win. |
| 5 | 2021-09-25 | Brian Ortega | top-five | 1 | 1 | 1 | Elite top featherweight title challenger. |
| 6 | 2023-07-08 | Yair Rodriguez | top-five | 1 | 1 | 1 | Interim featherweight champion and elite contender. |
| 7 | 2025-04-12 | Diego Lopes | top-five | 1 | 0.75 | 0.75 | Modern top featherweight title-level contender. |
| 8 | 2026-01-31 | Diego Lopes | top-five | 1 | 0.75 | 0.75 | Repeated modern title-level featherweight win. |
| 9 | 2018-12-29 | Chad Mendes | top-ten | 0.85 | 0.75 | 0.64 | Dangerous veteran contender with layoff/context discount. |
| 10 | 2018-07-14 | Darren Elkins | ranked | 0.65 | 0.75 | 0.49 | Durable ranked-quality featherweight win. |
| 11 | 2022-04-09 | Chan Sung Jung | ranked | 0.65 | 0.75 | 0.49 | Big-name title challenger but late-career timing. |
| 12 | 2017-06-11 | Mizuto Hirota | solid | 0.45 | 0.75 | 0.34 | Useful UFC win. |
| 13 | 2018-02-11 | Jeremy Kennedy | solid | 0.45 | 0.5 | 0.23 | Solid UFC featherweight win. |
| 14 | 2016-11-26 | Yusuke Kasuya | name-value | 0.25 | 0.5 | 0.13 | Limited quality value. |
| 15 | 2017-11-19 | Shane Young | name-value | 0.25 | 0.5 | 0.13 | Limited quality value. |

#### Prime Dominance receipts

Prime window: **Jose Aldo → Current championship form**. Prime record: **9-3**. Effective samples: **12**. Sample multiplier: **100.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 6.75 | 9-3; 75.0% |
| Round control | 6.75 | 75.0%; rounds 36-12 |
| Finish pressure | 1 | 2 finishes; 16.7% |
| Elite-level validation | 5.71 | 12 elite-stage fights; 5.71 points |
| Raw prime score | 20.21 | Before sample multiplier |
| Final Prime Dominance | 20.21 | 20.21 × 1 |

#### Longevity receipts

Active elite years: **7.17**. Raw calendar months: **86.1**. Gap-adjusted months: **86.1**. Status multiplier: **1.12**. Division multiplier: **1.03**. Counted elite months: **99.32**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 2019-05-11 | 2019-12-14 | 7.13 | 7.13 | No |
| 2019-12-14 | 2020-07-11 | 6.9 | 6.9 | No |
| 2020-07-11 | 2021-09-25 | 14.49 | 14.49 | No |
| 2021-09-25 | 2022-04-09 | 6.44 | 6.44 | No |
| 2022-04-09 | 2022-07-02 | 2.76 | 2.76 | No |
| 2022-07-02 | 2023-02-11 | 7.36 | 7.36 | No |
| 2023-02-11 | 2023-07-08 | 4.83 | 4.83 | No |
| 2023-07-08 | 2023-10-21 | 3.45 | 3.45 | No |
| 2023-10-21 | 2024-02-17 | 3.91 | 3.91 | No |
| 2024-02-17 | 2025-04-12 | 13.8 | 13.8 | No |
| 2025-04-12 | 2026-01-31 | 9.66 | 9.66 | No |
| 2026-01-31 | 2026-07-13 | 5.36 | 5.36 | No |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **18** fights. Severity: **1.75**. Frequency: **0.71**. Prime-volume floor: **2.75**. Pre-division magnitude: **2.75**. Division discount: **5.0%**. Final penalty: **-2.61**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Base | Finish extra | Raw event | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2023-02-11 | Islam Makhachev | prime | champion-level | upward | No | Yes | -0.75 | 0 | -0.75 | prime-upward-elite |
| 2023-10-21 | Islam Makhachev | prime | champion-level | upward | Yes | Yes | -0.75 | -0.5 | -1.25 | prime-upward-elite |
| 2024-02-17 | Ilia Topuria | prime | champion-level | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |

#### Division-strength context

Default division key: **volkanovski-modern-featherweight-1.05**. Era-ledger division multiplier: **1.03**. Division-era modifier: **-0.02**.

Aldo through current championship form.

#### Key judgment calls

- **Jose Aldo win:** marks the beginning of the prime scoring window.
- **Islam losses:** receive reduced penalties because they were elite up-division title fights.
- **Topuria loss:** counts as a meaningful main-division prime finished loss.
- **Quality wins:** are a major strength of the Volk case and grade near the top of this ranking.
- **Balanced resume:** is the core reason he stays near the top seven even without a #1 category score.

#### Why ranked here

Volkanovski ranks #7 because he checks every important box well: championship success, quality wins, consistency, and a long elite stretch at featherweight. He may not have the single highest peak score, but his overall balance is extremely strong.

#### Why not ranked higher?

The current scoring model hits him for the Topuria loss and keeps his prime-dominance score below the names with more overwhelming peaks. The up-division Islam losses are handled more lightly, but they still do not boost the resume the way a win would have.

#### Compare-mode guidance

- **Best counterargument:** Volk’s best argument is direct separation. He did not just share an era with Max; he beat him three times and became the defining featherweight champion.
- **Why this résumé can still win:** Volk wins when head-to-head separation, championship control, and modern featherweight strength matter more than raw career volume.

#### Final takeaway

Volkanovski is the all-around featherweight standard: deep title work, strong quality wins, and a balanced resume with very few weak points.

_Ledger verified through 2026-07-13. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

### 7. Khabib Nurmagomedov — 92 OVR

The cleanest prime run at lightweight: unbeaten in the UFC, overwhelming round control, and the strongest dominance case in this ranking.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 63.87 | 13-0 | Lightweight / Catchweight | 4 | 3.63 | 5 | 8-0 | 92.0% | 6.02 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 7.49 | 35 | 8.74 |
| Opponent Quality | 19.47 | 25 | 16.22 |
| Prime Dominance | 27.13 | 30 | 27.13 |
| Longevity | 17.08 | 10 | 5.69 |

Base score: **57.78**. Modifiers: Apex **+6**, Loss Penalty **0**, Division-Era Depth **+0.09**. Final raw score: **63.87**.

OVR conversion: 18.68–101.92 board anchors, normalized score **0.542888**, curved score **0.594982**, resulting in **92 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 7.49 | #28 | 3.63 adjusted credit / 14.54 benchmark |
| Opponent Quality | 19.47 | #31 | 9.15 diminished credit / 14.1 benchmark |
| Prime Dominance | 27.13 | #2 | 27.13 raw × 100.0% sample |
| Longevity | 17.08 | #16 | 81.99 counted elite months |
| Apex | +6 | Modifier | Complete lightweight inevitability. |
| Loss Penalty | 0 | Modifier | 0 official/technical loss events reviewed |
| Division-Era Depth | +0.09 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **4**. Adjusted title wins: **3.63**. Derived undisputed-title win count: **4**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 2018-04-07 | Al Iaquinta | vacant-undisputed | 0.9 | 0.75 | 0.68 | Vacant title with short-notice/questionable opponent. |
| 2018-10-06 | Conor McGregor | normal | 1 | 0.95 | 0.95 | locked |
| 2019-09-07 | Dustin Poirier | normal | 1 | 1 | 1 | locked |
| 2020-10-24 | Justin Gaethje | normal | 1 | 1 | 1 | locked |

#### Opponent Quality receipts

Raw win credit: **10**. Diminishing-return credit before fighter adjustment: **9.15**. Fighter adjustment: **0**. Final diminished credit: **9.15**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2014-04-19 | Rafael dos Anjos | champion-level | 1.25 | 1 | 1.25 | Prime elite lightweight and future UFC champion. |
| 2 | 2018-10-06 | Conor McGregor | champion-level | 1.25 | 1 | 1.25 | UFC two-division champion and elite lightweight title opponent. |
| 3 | 2019-09-07 | Dustin Poirier | champion-level | 1.25 | 1 | 1.25 | Elite prime lightweight interim champion. |
| 4 | 2020-10-24 | Justin Gaethje | champion-level | 1.25 | 1 | 1.25 | Elite prime lightweight interim champion. |
| 5 | 2017-12-30 | Edson Barboza | top-five | 1 | 1 | 1 | Dangerous top lightweight contender in a deep division. |
| 6 | 2016-11-12 | Michael Johnson | top-ten | 0.85 | 1 | 0.85 | Strong ranked lightweight win with prime-speed danger. |
| 7 | 2012-07-07 | Gleison Tibau | ranked | 0.65 | 0.75 | 0.49 | Physically difficult early UFC win; close-fight context flagged. |
| 8 | 2018-04-07 | Al Iaquinta | ranked | 0.65 | 0.75 | 0.49 | Short-notice vacant-title opponent, useful but not elite. |
| 9 | 2013-01-19 | Thiago Tavares | solid | 0.45 | 0.75 | 0.34 | Useful UFC lightweight win. |
| 10 | 2013-05-25 | Abel Trujillo | solid | 0.45 | 0.75 | 0.34 | Solid athletic lightweight win. |
| 11 | 2013-09-21 | Pat Healy | solid | 0.45 | 0.75 | 0.34 | Solid UFC lightweight win. |
| 12 | 2012-01-20 | Kamal Shalorus | name-value | 0.25 | 0.75 | 0.19 | Early UFC win with limited quality value. |
| 13 | 2016-04-16 | Darrell Horcher | name-value | 0.25 | 0.5 | 0.13 | Late replacement/low opponent-quality value. |

#### Prime Dominance receipts

Prime window: **Rafael dos Anjos → Justin Gaethje**. Prime record: **8-0**. Effective samples: **8**. Sample multiplier: **100.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 9 | 8-0; 100.0% |
| Round control | 8.28 | 92.0%; rounds 23-2 |
| Finish pressure | 4 | 5 finishes; 62.5% |
| Elite-level validation | 5.85 | 6 elite-stage fights; 5.85 points |
| Raw prime score | 27.13 | Before sample multiplier |
| Final Prime Dominance | 27.13 | 27.13 × 1 |

#### Longevity receipts

Active elite years: **6.02**. Raw calendar months: **78.2**. Gap-adjusted months: **72.3**. Status multiplier: **1.08**. Division multiplier: **1.05**. Counted elite months: **81.99**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 2014-04-19 | 2016-04-16 | 23.92 | 18 | Yes |
| 2016-04-16 | 2016-11-12 | 6.9 | 6.9 | No |
| 2016-11-12 | 2017-12-30 | 13.57 | 13.57 | No |
| 2017-12-30 | 2018-04-07 | 3.22 | 3.22 | No |
| 2018-04-07 | 2018-10-06 | 5.98 | 5.98 | No |
| 2018-10-06 | 2019-09-07 | 11.04 | 11.04 | No |
| 2019-09-07 | 2020-10-24 | 13.57 | 13.57 | No |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **13** fights. Severity: **0**. Frequency: **0**. Prime-volume floor: **0**. Pre-division magnitude: **0**. Division discount: **8.0%**. Final penalty: **0**.

_No rows._

#### Division-strength context

Default division key: **lightweight-murderers-row-1.10**. Era-ledger division multiplier: **1.05**. Division-era modifier: **+0.09**.

RDA through Gaethje.

#### Key judgment calls

- **Prime dominance:** the clearest strength of the Khabib case and the best score in this ranking.
- **No UFC losses:** helps keep the resume unusually clean.
- **Lightweight strength:** matters positively because his best work came in an elite division.
- **Short title run:** keeps the championship category lower than the all-time leaders.
- **Pre-prime wins:** still matter for record and context, but the core scoring window starts around Rafael dos Anjos.

#### Why ranked here

Khabib ranks #6 because his prime-dominance score is the strongest in the current scoring model. He combined elite control, round winning, and a perfect UFC record, giving him one of the hardest peaks to challenge in this ranking.

#### Why not ranked higher?

He does not climb higher because the current scoring model gives him less championship volume and fewer quality-wins layers than the fighters above him. His peak is elite enough to compete with anyone, but his total UFC resume is shorter.

#### Compare-mode guidance

- **Best counterargument:** Khabib’s argument against almost anyone is purity. No losses, no real collapse, no post-prime damage, and one of the clearest primes ever.
- **Why this résumé can still win:** Khabib wins when the debate rewards dominance, perfection, and how unbeatable a fighter looked at his best.

#### Final takeaway

Khabib is the lightweight prime-dominance benchmark: unbeatable at his best, extremely efficient, and held back only by shorter championship volume than the names above him.

_Ledger verified through 2026-07-13. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

### 8. Matt Hughes — 92 OVR

The early welterweight title-control case: real championship volume, physical dominance, and one of the defining reigns before the GSP era.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 63.7 | 18-7 | Welterweight | 9 | 8.4 | 9 | 13-3 | 80.0% | 6.15 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 17.33 | 35 | 20.22 |
| Opponent Quality | 18.51 | 25 | 15.43 |
| Prime Dominance | 24.51 | 30 | 24.51 |
| Longevity | 17.59 | 10 | 5.86 |

Base score: **66.02**. Modifiers: Apex **+4.2**, Loss Penalty **-3.52**, Division-Era Depth **-3**. Final raw score: **63.7**.

OVR conversion: 18.68–101.92 board anchors, normalized score **0.540846**, curved score **0.593079**, resulting in **92 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 17.33 | #5 | 8.4 adjusted credit / 14.54 benchmark |
| Opponent Quality | 18.51 | #38 | 8.7 diminished credit / 14.1 benchmark |
| Prime Dominance | 24.51 | #10 | 24.51 raw × 100.0% sample |
| Longevity | 17.59 | #13 | 84.42 counted elite months |
| Apex | +4.2 | Modifier | The GSP submission and Trigg comeback form a great championship stretch, but Trigg nearly finishing Hughes lowers performance strength, and early-version GSP limits Proof and the best-fighter claim. |
| Loss Penalty | -3.52 | Modifier | 7 official/technical loss events reviewed |
| Division-Era Depth | -3 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **9**. Adjusted title wins: **8.4**. Derived undisputed-title win count: **9**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 2001-11-02 | Carlos Newton | normal | 1 | 0.95 | 0.95 | Old-era/weird finish title context. |
| 2002-03-22 | Hayato Sakurai | normal | 1 | 0.95 | 0.95 | Old-era title defense context. |
| 2002-07-13 | Carlos Newton | normal | 1 | 0.9 | 0.9 | Old-era rematch/title context. |
| 2002-11-22 | Gil Castillo | normal | 1 | 0.9 | 0.9 | locked |
| 2003-04-25 | Sean Sherk | normal | 1 | 0.95 | 0.95 | locked |
| 2003-11-21 | Frank Trigg | normal | 1 | 0.95 | 0.95 | locked |
| 2004-10-22 | Georges St-Pierre | vacant-undisputed | 0.9 | 1 | 0.9 | Vacant title vs early GSP; old-era context but full elite opponent strength. |
| 2005-04-16 | Frank Trigg | normal | 1 | 0.95 | 0.95 | locked |
| 2006-09-23 | B.J. Penn | normal | 1 | 0.95 | 0.95 | locked |

#### Opponent Quality receipts

Raw win credit: **10.1**. Diminishing-return credit before fighter adjustment: **8.7**. Fighter adjustment: **0**. Final diminished credit: **8.7**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2006-09-23 | B.J. Penn | champion-level | 1.25 | 1 | 1.25 | Elite champion-level opponent and former UFC champion. |
| 2 | 2003-04-25 | Sean Sherk | top-five | 1 | 1 | 1 | Elite contender and future UFC champion. |
| 3 | 2003-11-21 | Frank Trigg | top-five | 1 | 1 | 1 | Prime elite welterweight contender. |
| 4 | 2004-10-22 | Georges St-Pierre | top-five | 1 | 1 | 1 | Elite young contender, but not yet a champion-level version of GSP. |
| 5 | 2005-04-16 | Frank Trigg | top-ten | 0.85 | 1 | 0.85 | Elite repeat challenger, discounted slightly on the second win because the first Trigg victory already carries the primary Top-5 proof. |
| 6 | 2001-11-02 | Carlos Newton | ranked | 0.65 | 1 | 0.65 | Former champion rematch win with old-era depth and repeat context. |
| 7 | 2002-07-13 | Carlos Newton | ranked | 0.65 | 0.75 | 0.49 | Title win with weird finish context. |
| 8 | 2004-06-19 | Renato Verissimo | ranked | 0.65 | 0.75 | 0.49 | Ranked-quality welterweight contender, but a brief UFC run does not support Top-10 credit. |
| 9 | 2002-03-22 | Hayato Sakurai | solid | 0.45 | 0.75 | 0.34 | Strong name historically, UFC timing limits value. |
| 10 | 2005-11-19 | Joe Riggs | solid | 0.45 | 0.75 | 0.34 | Late-replacement title opponent who missed weight; useful win but not ranked-quality proof. |
| 11 | 2007-03-03 | Chris Lytle | solid | 0.45 | 0.75 | 0.34 | Durable veteran welterweight win. |
| 12 | 2009-05-23 | Matt Serra | solid | 0.45 | 0.75 | 0.34 | Former champion name, but age, timing, and a limited post-title run keep the 2009 win below ranked-quality credit. |
| 13 | 2010-08-07 | Ricardo Almeida | solid | 0.45 | 0.5 | 0.23 | Useful late-career welterweight win, but age and division timing keep it below ranked-quality credit. |
| 14 | 1999-09-24 | Valeri Ignatov | name-value | 0.25 | 0.5 | 0.13 | Early UFC tournament win with limited established opponent-quality value. |
| 15 | 2000-06-09 | Marcelo Aguiar | name-value | 0.25 | 0.5 | 0.13 | Early UFC win with limited established opponent-quality value. |
| 16 | 2002-11-22 | Gil Castillo | minimal | 0.1 | 0.5 | 0.05 | Low-end UFC quality win with limited contender relevance. |
| 17 | 2006-05-27 | Royce Gracie | minimal | 0.1 | 0.5 | 0.05 | Historic name, but age and an eleven-year layoff leave minimal opponent-quality value in 2006. |
| 18 | 2010-04-10 | Renzo Gracie | minimal | 0.1 | 0.5 | 0.05 | Legendary name, but age, inactivity, and UFC timing leave minimal opponent-quality value. |

#### Prime Dominance receipts

Prime window: **Carlos Newton II → Georges St-Pierre III**. Prime record: **13-3**. Effective samples: **16**. Sample multiplier: **100.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 7.31 | 13-3; 81.3% |
| Round control | 7.2 | 80.0%; rounds 28-7 |
| Finish pressure | 4 | 10 finishes; 62.5% |
| Elite-level validation | 6 | 12 elite-stage fights; 6 points |
| Raw prime score | 24.51 | Before sample multiplier |
| Final Prime Dominance | 24.51 | 24.51 × 1 |

#### Longevity receipts

Active elite years: **6.15**. Raw calendar months: **73.9**. Gap-adjusted months: **73.9**. Status multiplier: **1.12**. Division multiplier: **1.02**. Counted elite months: **84.42**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 2001-11-02 | 2002-03-22 | 4.6 | 4.6 | No |
| 2002-03-22 | 2002-07-13 | 3.71 | 3.71 | No |
| 2002-07-13 | 2002-11-22 | 4.34 | 4.34 | No |
| 2002-11-22 | 2003-04-25 | 5.06 | 5.06 | No |
| 2003-04-25 | 2003-11-21 | 6.9 | 6.9 | No |
| 2003-11-21 | 2004-01-31 | 2.33 | 2.33 | No |
| 2004-01-31 | 2004-06-19 | 4.6 | 4.6 | No |
| 2004-06-19 | 2004-10-22 | 4.11 | 4.11 | No |
| 2004-10-22 | 2005-04-16 | 5.78 | 5.78 | No |
| 2005-04-16 | 2005-11-19 | 7.13 | 7.13 | No |
| 2005-11-19 | 2006-05-27 | 6.21 | 6.21 | No |
| 2006-05-27 | 2006-09-23 | 3.91 | 3.91 | No |
| 2006-09-23 | 2006-11-18 | 1.84 | 1.84 | No |
| 2006-11-18 | 2007-03-03 | 3.45 | 3.45 | No |
| 2007-03-03 | 2007-12-29 | 9.89 | 9.89 | No |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **19** fights. Severity: **2.25**. Frequency: **1.38**. Prime-volume floor: **3**. Pre-division magnitude: **3.63**. Division discount: **3.0%**. Final penalty: **-3.52**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Base | Finish extra | Raw event | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2000-12-16 | Dennis Hallman | pre-prime | solid | home | Yes | Yes | -1.25 | -0.75 | -2 | standard rule |
| 2004-01-31 | B.J. Penn | prime | top-five | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2006-11-18 | Georges St-Pierre | prime | top-five | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2007-12-29 | Georges St-Pierre | prime | top-five | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2008-06-07 | Thiago Alves | post-prime | top-five | home | Yes | Yes | 0 | 0 | 0 | standard rule |
| 2010-11-20 | B.J. Penn | post-prime | top-five | home | Yes | Yes | 0 | 0 | 0 | standard rule |
| 2011-09-24 | Josh Koscheck | post-prime | top-five | home | Yes | Yes | 0 | 0 | 0 | standard rule |

#### Division-strength context

Default division key: **hughes-welterweight-1.0**. Era-ledger division multiplier: **1.02**. Division-era modifier: **-3**.

Newton II through GSP III.

#### Key judgment calls

- **Early era context:** his run was historically huge, but the division was not as deep as later welterweight eras.
- **GSP rivalry:** a win over young GSP matters, but GSP ultimately took the all-time welterweight separation.
- **Title volume:** is the center of the Hughes case and the reason he remains high.
- **Loss penalty:** keeps him below cleaner champions with fewer damaging losses.
- **UFC-only fit:** his main value is already inside the UFC scoring boundary.

#### Why ranked here

Hughes ranks #12 because his UFC welterweight title volume is still meaningful. He spent years as the division standard, stacked title wins, and has enough important victories to remain a serious UFC-only GOAT case.

#### Why not ranked higher?

He does not rank higher because era strength, loss volume, and later separation by GSP cap the case. His championship weight is real, but the modern top-tier resumes are cleaner and deeper.

#### Compare-mode guidance

- **Best counterargument:** The knock on Hughes is era context. His welterweight run was historically huge, but the division was not as deep or modernized as later welterweight eras.
- **Why this résumé can still win:** Hughes wins when the debate becomes total title weight and sustained divisional control rather than pure peak efficiency.

#### Final takeaway

Hughes is the early welterweight standard: title-heavy, physically dominant, historically important, and held back by era context and loss drag.

_Ledger verified through 2026-07-13. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

### 9. Kamaru Usman — 92 OVR

The post-GSP welterweight champion case: dominant title control, elite round winning, and a focused but powerful championship peak.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 63.25 | 16-3 | Welterweight / Middleweight | 6 | 5.55 | 8 | 8-3 | 70.8% | 7.47 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 11.45 | 35 | 13.36 |
| Opponent Quality | 24.02 | 25 | 20.02 |
| Prime Dominance | 21.82 | 30 | 21.82 |
| Longevity | 14.08 | 10 | 4.69 |

Base score: **59.89**. Modifiers: Apex **+5.48**, Loss Penalty **-2.39**, Division-Era Depth **+0.27**. Final raw score: **63.25**.

OVR conversion: 18.68–101.92 board anchors, normalized score **0.535440**, curved score **0.588036**, resulting in **92 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 11.45 | #14 | 5.55 adjusted credit / 14.54 benchmark |
| Opponent Quality | 24.02 | #8 | 11.29 diminished credit / 14.1 benchmark |
| Prime Dominance | 21.82 | #21 | 21.82 raw × 100.0% sample |
| Longevity | 14.08 | #30 | 67.56 counted elite months |
| Apex | +5.48 | Modifier | Elite welterweight king proof. |
| Loss Penalty | -2.39 | Modifier | 3 official/technical loss events reviewed |
| Division-Era Depth | +0.27 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **6**. Adjusted title wins: **5.55**. Derived undisputed-title win count: **6**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 2019-03-02 | Tyron Woodley | normal | 1 | 1 | 1 | locked |
| 2019-12-14 | Colby Covington | normal | 1 | 0.95 | 0.95 | locked |
| 2020-07-11 | Jorge Masvidal | normal | 1 | 0.85 | 0.85 | locked |
| 2021-02-13 | Gilbert Burns | normal | 1 | 0.95 | 0.95 | locked |
| 2021-04-24 | Jorge Masvidal | normal | 1 | 0.85 | 0.85 | locked |
| 2021-11-06 | Colby Covington | normal | 1 | 0.95 | 0.95 | locked |

#### Opponent Quality receipts

Raw win credit: **13.4**. Diminishing-return credit before fighter adjustment: **11.29**. Fighter adjustment: **0**. Final diminished credit: **11.29**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2019-03-02 | Tyron Woodley | champion-level | 1.25 | 1 | 1.25 | UFC welterweight champion and elite title-level opponent. |
| 2 | 2019-12-14 | Colby Covington | champion-level | 1.25 | 1 | 1.25 | Prime elite welterweight title challenger. |
| 3 | 2021-11-06 | Colby Covington | champion-level | 1.25 | 1 | 1.25 | Repeat win over elite welterweight title challenger. |
| 4 | 2015-12-19 | Leon Edwards | top-five | 1 | 1 | 1 | Early win over future elite champion; not prime Leon yet. |
| 5 | 2018-11-30 | Rafael dos Anjos | top-five | 1 | 1 | 1 | Former lightweight champion and strong welterweight contender. |
| 6 | 2021-02-13 | Gilbert Burns | top-five | 1 | 1 | 1 | Elite welterweight contender and title challenger. |
| 7 | 2025-06-14 | Joaquin Buckley | top-five | 1 | 0.75 | 0.75 | Modern top-five welterweight win. |
| 8 | 2018-05-19 | Demian Maia | top-ten | 0.85 | 0.75 | 0.64 | Elite grappler and ranked welterweight veteran. |
| 9 | 2020-07-11 | Jorge Masvidal | top-ten | 0.85 | 0.75 | 0.64 | High-profile ranked contender, title-opponent context. |
| 10 | 2021-04-24 | Jorge Masvidal | top-ten | 0.85 | 0.75 | 0.64 | Repeat ranked contender win, less fresh than first. |
| 11 | 2016-11-19 | Warlley Alves | ranked | 0.65 | 0.75 | 0.49 | Strong prospect/contender-climb win. |
| 12 | 2017-04-08 | Sean Strickland | ranked | 0.65 | 0.75 | 0.49 | Early Strickland welterweight win before later middleweight peak. |
| 13 | 2017-09-16 | Sergio Moraes | ranked | 0.65 | 0.5 | 0.33 | Useful welterweight win on contender climb. |
| 14 | 2016-07-23 | Alexander Yakovlev | solid | 0.45 | 0.5 | 0.23 | Useful UFC win. |
| 15 | 2018-01-14 | Emil Meek | solid | 0.45 | 0.5 | 0.23 | Solid UFC welterweight win. |
| 16 | 2015-07-12 | Hayder Hassan | name-value | 0.25 | 0.5 | 0.13 | Low-end UFC quality value. |

#### Prime Dominance receipts

Prime window: **Demian Maia → Leon Edwards III**. Prime record: **8-3**. Effective samples: **10**. Sample multiplier: **100.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 7.2 | 8-2; 80.0% |
| Round control | 6.8 | 75.6%; rounds 34-11 |
| Finish pressure | 2 | 3 finishes; 30.0% |
| Elite-level validation | 5.82 | 9 elite-stage fights; 5.82 points |
| Raw prime score | 21.82 | Before sample multiplier |
| Final Prime Dominance | 21.82 | 21.82 × 1 |

#### Longevity receipts

Active elite years: **7.47**. Raw calendar months: **58**. Gap-adjusted months: **58**. Status multiplier: **1.12**. Division multiplier: **1.04**. Counted elite months: **67.56**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 2018-05-19 | 2018-11-30 | 6.41 | 6.41 | No |
| 2018-11-30 | 2019-03-02 | 3.02 | 3.02 | No |
| 2019-03-02 | 2019-12-14 | 9.43 | 9.43 | No |
| 2019-12-14 | 2020-07-11 | 6.9 | 6.9 | No |
| 2020-07-11 | 2021-02-13 | 7.13 | 7.13 | No |
| 2021-02-13 | 2021-04-24 | 2.3 | 2.3 | No |
| 2021-04-24 | 2021-11-06 | 6.44 | 6.44 | No |
| 2021-11-06 | 2022-08-20 | 9.43 | 9.43 | No |
| 2022-08-20 | 2023-03-18 | 6.9 | 6.9 | No |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **17** fights. Severity: **1.88**. Frequency: **0.66**. Prime-volume floor: **1.75**. Pre-division magnitude: **2.54**. Division discount: **6.0%**. Final penalty: **-2.39**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Base | Finish extra | Raw event | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2022-08-20 | Leon Edwards | prime | top-five | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2023-03-18 | Leon Edwards | prime | champion-level | home | No | Yes | -1.5 | 0 | -1.5 | standard rule |
| 2023-10-21 | Khamzat Chimaev | post-prime | top-five | upward | No | Yes | 0 | 0 | 0 | prime-upward-elite |

#### Division-strength context

Default division key: **usman-welterweight-1.05**. Era-ledger division multiplier: **1.04**. Division-era modifier: **+0.27**.

Maia through Edwards III. Khamzat is post-prime/up-division.

#### Key judgment calls

- **Championship peak:** the title run is the center of his case.
- **Round control:** his prime round-winning profile is one of his biggest strengths.
- **Edwards losses:** the finish loss creates real drag even though Edwards is elite.
- **Modern welterweight context:** Woodley, Covington, Burns, Masvidal, Edwards, and RDA give the resume quality.
- **Middleweight fight:** adds context, but welterweight carries the ranking.

#### Why ranked here

Usman ranks #10 because his welterweight title run had real champion authority. He paired elite round control with strong defenses and quality wins over the best contenders of his era.

#### Why not ranked higher?

He does not rank higher because his elite window is more compact than the long-volume cases, and the Edwards losses damaged the clean ending. His peak was elite, but the total UFC resume is not as broad as the names above him.

#### Compare-mode guidance

- **Best counterargument:** Usman’s argument is champion peak. If the debate is who looked more in control at the top, Usman has a real lane.
- **Why this résumé can still win:** Usman wins when championship peak, round control, and title-defense authority outweigh longer but less dominant resumes.

#### Final takeaway

Usman is the focused modern welterweight champion case: high-end title control, strong elite wins, and a peak that was better than the total volume of his resume.

_Ledger verified through 2026-07-13. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

### 10. Max Holloway — 92 OVR

The volume case: relentless pace, elite quality wins, and one of the longest useful elite windows in the featherweight era.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 63.08 | 24-9 | Featherweight / Lightweight | 5 | 4.34 | 11 | 16-6 | 58.8% | 11.24 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 8.95 | 35 | 10.44 |
| Opponent Quality | 27.87 | 25 | 23.23 |
| Prime Dominance | 19.1 | 30 | 19.1 |
| Longevity | 30 | 10 | 10 |

Base score: **62.77**. Modifiers: Apex **+4.89**, Loss Penalty **-4.37**, Division-Era Depth **-0.21**. Final raw score: **63.08**.

OVR conversion: 18.68–101.92 board anchors, normalized score **0.533397**, curved score **0.586129**, resulting in **92 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 8.95 | #20 | 4.34 adjusted credit / 14.54 benchmark |
| Opponent Quality | 27.87 | #3 | 13.1 diminished credit / 14.1 benchmark |
| Prime Dominance | 19.1 | #39 | 19.1 raw × 100.0% sample |
| Longevity | 30 | #1 | 150.03 counted elite months |
| Apex | +4.89 | Modifier | The consecutive elite stoppages merit more Aura while the existing Proof and best-fighter Claim remain appropriately calibrated. |
| Loss Penalty | -4.37 | Modifier | 9 official/technical loss events reviewed |
| Division-Era Depth | -0.21 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **5**. Adjusted title wins: **4.34**. Derived undisputed-title win count: **4**. Interim-title win count: **1**.

| Date | Opponent | Title type | Base | Opponent strength | Final credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 2016-12-10 | Anthony Pettis | interim | 0.75 | 0.85 | 0.64 | Interim title and Pettis at featherweight discount. |
| 2017-06-03 | Jose Aldo | normal | 1 | 0.95 | 0.95 | locked |
| 2017-12-02 | Jose Aldo | normal | 1 | 0.95 | 0.95 | locked |
| 2018-12-08 | Brian Ortega | normal | 1 | 0.9 | 0.9 | locked |
| 2019-07-27 | Frankie Edgar | normal | 1 | 0.9 | 0.9 | Cody-approved undisputed title defense over an older but still elite former champion. |

#### Opponent Quality receipts

Raw win credit: **17.55**. Diminishing-return credit before fighter adjustment: **13.1**. Fighter adjustment: **0**. Final diminished credit: **13.1**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2017-06-03 | Jose Aldo | champion-level | 1.25 | 1 | 1.25 | Prime/near-prime featherweight champion and all-time great. |
| 2 | 2017-12-02 | Jose Aldo | champion-level | 1.25 | 1 | 1.25 | Immediate repeat over elite champion-level Aldo. |
| 3 | 2024-04-13 | Justin Gaethje | champion-level | 1.25 | 1 | 1.25 | Elite lightweight win while moving up. |
| 4 | 2018-12-08 | Brian Ortega | top-five | 1 | 1 | 1 | Undefeated elite featherweight title challenger. |
| 5 | 2019-07-27 | Frankie Edgar | top-five | 1 | 1 | 1 | Former UFC champion and top featherweight contender, aged context noted. |
| 6 | 2021-01-16 | Calvin Kattar | top-five | 1 | 1 | 1 | Prime top featherweight contender. |
| 7 | 2021-11-13 | Yair Rodriguez | top-five | 1 | 0.75 | 0.75 | Elite featherweight contender and future interim champion. |
| 8 | 2023-04-15 | Arnold Allen | top-five | 1 | 0.75 | 0.75 | Prime top featherweight contender. |
| 9 | 2025-07-19 | Dustin Poirier | top-five | 1 | 0.75 | 0.75 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 10 | 2015-04-18 | Cub Swanson | top-ten | 0.85 | 0.75 | 0.64 | Strong veteran featherweight contender. |
| 11 | 2016-06-04 | Ricardo Lamas | top-ten | 0.85 | 0.75 | 0.64 | Former title challenger and ranked featherweight. |
| 12 | 2016-12-10 | Anthony Pettis | top-ten | 0.85 | 0.75 | 0.64 | Former UFC champion, featherweight/timing context. |
| 13 | 2023-08-26 | Chan Sung Jung | top-ten | 0.85 | 0.5 | 0.42 | Strong ranked featherweight name with late-career timing. |
| 14 | 2015-08-23 | Charles Oliveira | ranked | 0.65 | 0.5 | 0.33 | Early Oliveira featherweight win with injury/weird ending context. |
| 15 | 2015-12-12 | Jeremy Stephens | ranked | 0.65 | 0.5 | 0.33 | Dangerous ranked featherweight win. |
| 16 | 2012-12-29 | Leonard Garcia | solid | 0.45 | 0.5 | 0.23 | Useful early UFC win. |
| 17 | 2014-04-26 | Andre Fili | solid | 0.45 | 0.5 | 0.23 | Solid UFC featherweight win. |
| 18 | 2014-08-23 | Clay Collard | solid | 0.45 | 0.5 | 0.23 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 19 | 2014-10-04 | Akira Corassani | solid | 0.45 | 0.25 | 0.11 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 20 | 2015-02-14 | Cole Miller | solid | 0.45 | 0.25 | 0.11 | Solid UFC win. |
| 21 | 2012-08-11 | Justin Lawrence | name-value | 0.25 | 0.25 | 0.06 | Limited quality value. |
| 22 | 2014-01-04 | Will Chope | name-value | 0.25 | 0.25 | 0.06 | Low-end early UFC quality value. |
| 23 | 2026-07-11 | Conor McGregor | name-value | 0.25 | 0.25 | 0.06 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 24 | 2012-06-01 | Pat Schilling | minimal | 0.1 | 0.25 | 0.03 | Minimal opponent-quality value. |

#### Prime Dominance receipts

Prime window: **Cub Swanson → Current title-level form**. Prime record: **16-6**. Effective samples: **22**. Sample multiplier: **100.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 6.55 | 16-6; 72.7% |
| Round control | 5.29 | 58.8%; rounds 50-35 |
| Finish pressure | 2 | 9 finishes; 40.9% |
| Elite-level validation | 5.26 | 17 elite-stage fights; 5.26 points |
| Raw prime score | 19.1 | Before sample multiplier |
| Final Prime Dominance | 19.1 | 19.1 × 1 |

#### Longevity receipts

Active elite years: **11.24**. Raw calendar months: **134.8**. Gap-adjusted months: **134.8**. Status multiplier: **1.06**. Division multiplier: **1.05**. Counted elite months: **150.03**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 2015-04-18 | 2015-08-23 | 4.17 | 4.17 | No |
| 2015-08-23 | 2015-12-12 | 3.65 | 3.65 | No |
| 2015-12-12 | 2016-06-04 | 5.75 | 5.75 | No |
| 2016-06-04 | 2016-12-10 | 6.21 | 6.21 | No |
| 2016-12-10 | 2017-06-03 | 5.75 | 5.75 | No |
| 2017-06-03 | 2017-12-02 | 5.98 | 5.98 | No |
| 2017-12-02 | 2018-12-08 | 12.19 | 12.19 | No |
| 2018-12-08 | 2019-04-13 | 4.14 | 4.14 | No |
| 2019-04-13 | 2019-07-27 | 3.45 | 3.45 | No |
| 2019-07-27 | 2019-12-14 | 4.6 | 4.6 | No |
| 2019-12-14 | 2020-07-11 | 6.9 | 6.9 | No |
| 2020-07-11 | 2021-01-16 | 6.21 | 6.21 | No |
| 2021-01-16 | 2021-11-13 | 9.89 | 9.89 | No |
| 2021-11-13 | 2022-07-02 | 7.59 | 7.59 | No |
| 2022-07-02 | 2023-04-15 | 9.43 | 9.43 | No |
| 2023-04-15 | 2023-08-26 | 4.37 | 4.37 | No |
| 2023-08-26 | 2024-04-13 | 7.59 | 7.59 | No |
| 2024-04-13 | 2024-10-26 | 6.44 | 6.44 | No |
| 2024-10-26 | 2025-07-19 | 8.74 | 8.74 | No |
| 2025-07-19 | 2026-03-07 | 7.59 | 7.59 | No |
| 2026-03-07 | 2026-07-11 | 4.14 | 4.14 | No |
| 2026-07-11 | 2026-07-13 | 0.07 | 0.07 | No |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **33** fights. Severity: **2.13**. Frequency: **1.23**. Prime-volume floor: **4.75**. Pre-division magnitude: **4.75**. Division discount: **8.0%**. Final penalty: **-4.37**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Base | Finish extra | Raw event | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2012-02-04 | Dustin Poirier | pre-prime | top-ten | home | Yes | Yes | -1.25 | -0.75 | -2 | standard rule |
| 2013-05-25 | Dennis Bermudez | pre-prime | top-ten | home | No | Yes | -1.25 | 0 | -1.25 | standard rule |
| 2013-08-17 | Conor McGregor | pre-prime | top-ten | home | No | Yes | -1.25 | 0 | -1.25 | standard rule |
| 2019-04-13 | Dustin Poirier | prime | top-five | upward | No | Yes | -0.75 | 0 | -0.75 | prime-upward-elite |
| 2019-12-14 | Alexander Volkanovski | prime | top-five | home | No | Yes | -1.5 | 0 | -1.5 | standard rule |
| 2020-07-11 | Alexander Volkanovski | prime | champion-level | home | No | Yes | -1.5 | 0 | -1.5 | standard rule |
| 2022-07-02 | Alexander Volkanovski | prime | champion-level | home | No | Yes | -1.5 | 0 | -1.5 | standard rule |
| 2024-10-26 | Ilia Topuria | prime | champion-level | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2026-03-07 | Charles Oliveira | prime | top-five | home | No | Yes | -1.5 | 0 | -1.5 | standard rule |

#### Division-strength context

Default division key: **holloway-featherweight-lightweight-1.05**. Era-ledger division multiplier: **1.05**. Division-era modifier: **-0.21**.

Cub Swanson through current title-level form.

#### Key judgment calls

- **Quality wins:** are the clearest strength of the Holloway case and rank #2 in this scoring model.
- **Longevity:** is another major positive because he stayed elite for such a long period.
- **BMF belt:** is not counted as UFC championship credit here.
- **Loss volume:** matters, but much of it came against elite competition, which softens the drag.
- **Featherweight run:** is the core of the profile even though important lightweight fights add context.

#### Why ranked here

Holloway ranks #9 because his quality-wins score and longevity score are both elite. Few fighters in this ranking have stacked as many meaningful UFC wins over as long a stretch.

#### Why not ranked higher?

He sits below the very top names because the current scoring model gives him less championship control and more resume drag from total losses. The volume is impressive, but the belt dominance is not on the level of the names above him.

#### Compare-mode guidance

- **Best counterargument:** Max’s argument is total body of work. Even when someone peaked higher, Max often has more elite volume and more proof over time.
- **Why this résumé can still win:** Holloway wins when the debate rewards longevity, opponent volume, durability, and sustained elite relevance.

#### Final takeaway

Holloway is the volume-and-quality-wins monster of this ranking: one of the deepest win ledgers in the UFC, backed by real longevity, even without a top-tier championship score.

_Ledger verified through 2026-07-13. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

### 11. Stipe Miocic — 92 OVR

The strongest UFC heavyweight resume case: title defenses, champion wins, Ngannou value, and trilogy separation over Cormier.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 62.92 | 14-5 | Heavyweight | 6 | 5.8 | 8 | 8-3 | 71.0% | 6.29 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 11.97 | 35 | 13.96 |
| Opponent Quality | 21.86 | 25 | 18.22 |
| Prime Dominance | 24.17 | 30 | 24.17 |
| Longevity | 15.53 | 10 | 5.18 |

Base score: **61.53**. Modifiers: Apex **+5.01**, Loss Penalty **-3.46**, Division-Era Depth **-0.17**. Final raw score: **62.92**.

OVR conversion: 18.68–101.92 board anchors, normalized score **0.531475**, curved score **0.584333**, resulting in **92 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 11.97 | #11 | 5.8 adjusted credit / 14.54 benchmark |
| Opponent Quality | 21.86 | #19 | 10.28 diminished credit / 14.1 benchmark |
| Prime Dominance | 24.17 | #12 | 24.17 raw × 100.0% sample |
| Longevity | 15.53 | #26 | 74.55 counted elite months |
| Apex | +5.01 | Modifier | Winning the title from Werdum and shutting out Ngannou support a 5.00-level heavyweight Apex. |
| Loss Penalty | -3.46 | Modifier | 5 official/technical loss events reviewed |
| Division-Era Depth | -0.17 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **6**. Adjusted title wins: **5.8**. Derived undisputed-title win count: **6**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 2016-05-14 | Fabricio Werdum | normal | 1 | 1 | 1 | locked |
| 2016-09-10 | Alistair Overeem | normal | 1 | 0.95 | 0.95 | locked |
| 2017-05-13 | Junior dos Santos | normal | 1 | 0.95 | 0.95 | locked |
| 2018-01-20 | Francis Ngannou | normal | 1 | 0.95 | 0.95 | locked |
| 2019-08-17 | Daniel Cormier | normal | 1 | 1 | 1 | locked |
| 2020-08-15 | Daniel Cormier | normal | 1 | 0.95 | 0.95 | locked |

#### Opponent Quality receipts

Raw win credit: **11.6**. Diminishing-return credit before fighter adjustment: **10.28**. Fighter adjustment: **0**. Final diminished credit: **10.28**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2016-05-14 | Fabricio Werdum | champion-level | 1.25 | 1 | 1.25 | UFC heavyweight champion and elite title-level opponent. |
| 2 | 2018-01-20 | Francis Ngannou | champion-level | 1.25 | 1 | 1.25 | Elite heavyweight title challenger and future champion. |
| 3 | 2019-08-17 | Daniel Cormier | champion-level | 1.25 | 1 | 1.25 | Elite champion-level heavyweight/light heavyweight great. |
| 4 | 2020-08-15 | Daniel Cormier | champion-level | 1.25 | 1 | 1.25 | Repeat win over elite champion-level opponent. |
| 5 | 2016-09-10 | Alistair Overeem | top-five | 1 | 1 | 1 | Elite heavyweight title challenger. |
| 6 | 2017-05-13 | Junior dos Santos | top-five | 1 | 1 | 1 | Former UFC champion and top heavyweight contender. |
| 7 | 2015-05-10 | Mark Hunt | top-ten | 0.85 | 0.75 | 0.64 | Dangerous ranked heavyweight veteran. |
| 8 | 2016-01-02 | Andrei Arlovski | top-ten | 0.85 | 0.75 | 0.64 | Former champion on relevant win streak. |
| 9 | 2013-06-15 | Roy Nelson | ranked | 0.65 | 0.75 | 0.49 | Ranked heavyweight veteran. |
| 10 | 2014-01-25 | Gabriel Gonzaga | ranked | 0.65 | 0.75 | 0.49 | Ranked heavyweight veteran. |
| 11 | 2012-02-15 | Phil De Fries | solid | 0.45 | 0.75 | 0.34 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 12 | 2012-05-26 | Shane del Rosario | solid | 0.45 | 0.75 | 0.34 | Solid early UFC heavyweight win. |
| 13 | 2014-05-31 | Fabio Maldonado | solid | 0.45 | 0.5 | 0.23 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 14 | 2011-10-08 | Joey Beltran | name-value | 0.25 | 0.5 | 0.13 | Low-end UFC quality value. |

#### Prime Dominance receipts

Prime window: **Mark Hunt → Francis Ngannou II**. Prime record: **8-3**. Effective samples: **10**. Sample multiplier: **100.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 7.2 | 8-2; 80.0% |
| Round control | 6.92 | 76.9%; rounds 20-6 |
| Finish pressure | 4 | 6 finishes; 60.0% |
| Elite-level validation | 6.05 | 10 elite-stage fights; 6.05 points |
| Raw prime score | 24.17 | Before sample multiplier |
| Final Prime Dominance | 24.17 | 24.17 × 1 |

#### Longevity receipts

Active elite years: **6.29**. Raw calendar months: **70.6**. Gap-adjusted months: **70.6**. Status multiplier: **1.1**. Division multiplier: **0.96**. Counted elite months: **74.55**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 2015-05-10 | 2016-01-02 | 7.79 | 7.79 | No |
| 2016-01-02 | 2016-05-14 | 4.37 | 4.37 | No |
| 2016-05-14 | 2016-09-10 | 3.91 | 3.91 | No |
| 2016-09-10 | 2017-05-13 | 8.05 | 8.05 | No |
| 2017-05-13 | 2018-01-20 | 8.28 | 8.28 | No |
| 2018-01-20 | 2018-07-07 | 5.52 | 5.52 | No |
| 2018-07-07 | 2019-08-17 | 13.34 | 13.34 | No |
| 2019-08-17 | 2020-08-15 | 11.96 | 11.96 | No |
| 2020-08-15 | 2021-03-27 | 7.36 | 7.36 | No |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **18** fights. Severity: **2.25**. Frequency: **1.21**. Prime-volume floor: **2**. Pre-division magnitude: **3.46**. Division discount: **0.0%**. Final penalty: **-3.46**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Base | Finish extra | Raw event | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2012-09-29 | Stefan Struve | pre-prime | top-ten | home | Yes | Yes | -1.25 | -0.75 | -2 | standard rule |
| 2014-12-13 | Junior dos Santos | pre-prime | top-five | home | No | Yes | -0.75 | 0 | -0.75 | standard rule |
| 2018-07-07 | Daniel Cormier | prime | top-five | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2021-03-27 | Francis Ngannou | prime | top-five | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2024-11-16 | Jon Jones | post-prime | champion-level | home | Yes | Yes | 0 | 0 | 0 | standard rule |

#### Division-strength context

Default division key: **stipe-heavyweight-1.0**. Era-ledger division multiplier: **0.96**. Division-era modifier: **-0.17**.

Mark Hunt through Ngannou II.

#### Key judgment calls

- **Heavyweight value:** he is treated as the UFC heavyweight standard, but heavyweight depth is still different from lightweight or welterweight.
- **Cormier trilogy:** the 2-1 edge over DC is central to his ranking.
- **Ngannou split:** the first win matters a lot, but the knockout loss also matters.
- **Finish rate:** his heavyweight finishing profile helps the eye test and dominance case.
- **Late Jones loss:** counts as late-career context and keeps the ending from being spotless.

#### Why ranked here

Stipe ranks #14 because he has the strongest UFC heavyweight resume: heavyweight title wins, major defenses, champion-level opponent quality, and the Cormier trilogy edge.

#### Why not ranked higher?

He does not rank higher because heavyweight depth and volatility cap the score compared with lighter divisions, and the loss column is real. The Jones loss also keeps the back end from feeling clean.

#### Compare-mode guidance

- **Best counterargument:** The counterargument is division ceiling. Heavyweight is chaotic and thinner than lightweight or welterweight, so Stipe needs championship weight to carry the case.
- **Why this résumé can still win:** Stipe wins comparisons when heavyweight title value, champion wins, and the Cormier trilogy matter more than lighter-division depth.

#### Final takeaway

Stipe is the UFC heavyweight benchmark: the best heavyweight title resume, elite champion wins, and direct trilogy separation over Cormier, with heavyweight volatility holding him outside the top ten.

_Ledger verified through 2026-07-13. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

### 12. Jose Aldo — 92 OVR

A UFC-only legend with real title value and longevity, but not a clean top-10 case once WEC is excluded and the McGregor/Holloway/Volk damage is counted.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 62.69 | 14-9 | Featherweight / Bantamweight | 8 | 7.21 | 7 | 8-3 | 69.0% | 6.59 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 14.88 | 35 | 17.36 |
| Opponent Quality | 23.06 | 25 | 19.22 |
| Prime Dominance | 17.44 | 30 | 17.44 |
| Longevity | 29.7 | 10 | 9.9 |

Base score: **63.92**. Modifiers: Apex **+4.96**, Loss Penalty **-5.15**, Division-Era Depth **-1.04**. Final raw score: **62.69**.

OVR conversion: 18.68–101.92 board anchors, normalized score **0.528712**, curved score **0.581750**, resulting in **92 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 14.88 | #9 | 7.21 adjusted credit / 14.54 benchmark |
| Opponent Quality | 23.06 | #13 | 10.84 diminished credit / 14.1 benchmark |
| Prime Dominance | 17.44 | #53 | 17.44 raw × 100.0% sample |
| Longevity | 29.7 | #2 | 142.54 counted elite months |
| Apex | +4.96 | Modifier | Two elite UFC title wins establish excellent Proof and a real best-fighter claim, while the Aura score stays conservative and WEC remains excluded. |
| Loss Penalty | -5.15 | Modifier | 9 official/technical loss events reviewed |
| Division-Era Depth | -1.04 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **8**. Adjusted title wins: **7.21**. Derived undisputed-title win count: **7**. Interim-title win count: **1**.

| Date | Opponent | Title type | Base | Opponent strength | Final credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 2011-04-30 | Mark Hominick | normal | 1 | 0.85 | 0.85 | UFC-only reign starts as WEC transfer; softer first UFC defense. |
| 2011-10-08 | Kenny Florian | normal | 1 | 0.9 | 0.9 | locked |
| 2012-01-14 | Chad Mendes | normal | 1 | 0.95 | 0.95 | locked |
| 2013-02-02 | Frankie Edgar | normal | 1 | 1 | 1 | locked |
| 2013-08-03 | Chan Sung Jung | normal | 1 | 0.9 | 0.9 | locked |
| 2014-02-01 | Ricardo Lamas | normal | 1 | 0.9 | 0.9 | locked |
| 2014-10-25 | Chad Mendes | normal | 1 | 1 | 1 | locked |
| 2016-07-09 | Frankie Edgar | interim | 0.75 | 0.95 | 0.71 | Interim title value over elite opponent. |

#### Opponent Quality receipts

Raw win credit: **12.8**. Diminishing-return credit before fighter adjustment: **10.84**. Fighter adjustment: **0**. Final diminished credit: **10.84**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2013-02-02 | Frankie Edgar | champion-level | 1.25 | 1 | 1.25 | Former UFC champion moving down while still elite and title-caliber. |
| 2 | 2011-10-08 | Kenny Florian | top-five | 1 | 1 | 1 | Former title challenger and elite contender moving down. |
| 3 | 2012-01-14 | Chad Mendes | top-five | 1 | 1 | 1 | Prime top-five featherweight title challenger. |
| 4 | 2013-08-03 | Chan Sung Jung | top-five | 1 | 1 | 1 | Elite featherweight title challenger. |
| 5 | 2014-02-01 | Ricardo Lamas | top-five | 1 | 1 | 1 | Prime top featherweight title challenger. |
| 6 | 2014-10-25 | Chad Mendes | top-five | 1 | 1 | 1 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 7 | 2016-07-09 | Frankie Edgar | top-five | 1 | 0.75 | 0.75 | Elite featherweight rematch win, with aging/repeat context below max. |
| 8 | 2011-04-30 | Mark Hominick | top-ten | 0.85 | 0.75 | 0.64 | Legit title challenger but softer than Aldo’s best UFC wins. |
| 9 | 2018-07-28 | Jeremy Stephens | top-ten | 0.85 | 0.75 | 0.64 | Dangerous ranked featherweight win. |
| 10 | 2019-02-02 | Renato Moicano | top-ten | 0.85 | 0.75 | 0.64 | Strong ranked featherweight contender. |
| 11 | 2021-08-07 | Pedro Munhoz | top-ten | 0.85 | 0.75 | 0.64 | Strong ranked bantamweight win. |
| 12 | 2021-12-04 | Rob Font | top-ten | 0.85 | 0.75 | 0.64 | Strong ranked bantamweight win late in Aldo’s UFC run. |
| 13 | 2020-12-19 | Marlon Vera | ranked | 0.65 | 0.5 | 0.33 | Ranked bantamweight win with contender relevance. |
| 14 | 2024-05-04 | Jonathan Martinez | ranked | 0.65 | 0.5 | 0.33 | Late-career ranked bantamweight win. |

#### Prime Dominance receipts

Prime window: **Mark Hominick → Merab Dvalishvili**. Prime record: **8-3**. Effective samples: **20**. Sample multiplier: **100.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 5.85 | 13-7; 65.0% |
| Round control | 5.53 | 61.4%; rounds 43-27 |
| Finish pressure | 1 | 4 finishes; 20.0% |
| Elite-level validation | 5.06 | 16 elite-stage fights; 5.06 points |
| Raw prime score | 17.44 | Before sample multiplier |
| Final Prime Dominance | 17.44 | 17.44 × 1 |

#### Longevity receipts

Active elite years: **6.59**. Raw calendar months: **135.7**. Gap-adjusted months: **135.7**. Status multiplier: **1.04**. Division multiplier: **1.01**. Counted elite months: **142.54**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 2011-04-30 | 2011-10-08 | 5.29 | 5.29 | No |
| 2011-10-08 | 2012-01-14 | 3.22 | 3.22 | No |
| 2012-01-14 | 2013-02-02 | 12.65 | 12.65 | No |
| 2013-02-02 | 2013-08-03 | 5.98 | 5.98 | No |
| 2013-08-03 | 2014-02-01 | 5.98 | 5.98 | No |
| 2014-02-01 | 2014-10-25 | 8.74 | 8.74 | No |
| 2014-10-25 | 2015-12-12 | 13.57 | 13.57 | No |
| 2015-12-12 | 2016-07-09 | 6.9 | 6.9 | No |
| 2016-07-09 | 2017-06-03 | 10.81 | 10.81 | No |
| 2017-06-03 | 2017-12-02 | 5.98 | 5.98 | No |
| 2017-12-02 | 2018-07-28 | 7.82 | 7.82 | No |
| 2018-07-28 | 2019-02-02 | 6.21 | 6.21 | No |
| 2019-02-02 | 2019-05-11 | 3.22 | 3.22 | No |
| 2019-05-11 | 2019-12-14 | 7.13 | 7.13 | No |
| 2019-12-14 | 2020-07-11 | 6.9 | 6.9 | No |
| 2020-07-11 | 2020-12-19 | 5.29 | 5.29 | No |
| 2020-12-19 | 2021-08-07 | 7.59 | 7.59 | No |
| 2021-08-07 | 2021-12-04 | 3.91 | 3.91 | No |
| 2021-12-04 | 2022-08-20 | 8.51 | 8.51 | No |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **20** fights. Severity: **2.25**. Frequency: **2.03**. Prime-volume floor: **5.25**. Pre-division magnitude: **5.25**. Division discount: **2.0%**. Final penalty: **-5.15**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Base | Finish extra | Raw event | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2015-12-12 | Conor McGregor | prime | champion-level | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2017-06-03 | Max Holloway | prime | top-five | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2017-12-02 | Max Holloway | prime | champion-level | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2019-05-11 | Alexander Volkanovski | prime | top-five | home | No | Yes | -1.5 | 0 | -1.5 | standard rule |
| 2019-12-14 | Marlon Moraes | prime | top-five | downward | No | Yes | -1.5 | 0 | -1.5 | standard rule |
| 2020-07-11 | Petr Yan | prime | top-five | downward | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2022-08-20 | Merab Dvalishvili | prime | top-five | downward | No | Yes | -1.5 | 0 | -1.5 | standard rule |
| 2024-10-05 | Mario Bautista | post-prime | top-ten | downward | No | Yes | 0 | 0 | 0 | standard rule |
| 2025-05-10 | Aiemann Zahabi | post-prime | top-ten | downward | No | Yes | 0 | 0 | 0 | standard rule |

#### Division-strength context

Default division key: **aldo-ufc-featherweight-1.0**. Era-ledger division multiplier: **1.01**. Division-era modifier: **-1.04**.

Hominick through Merab.

#### Key judgment calls

- **UFC-only scope:** means the all-time WEC case is context only, not scored directly.
- **Title value:** his UFC title defenses still matter, but inheriting the belt from the WEC transition is treated with some context.
- **Loss context:** McGregor and both Holloway losses are counted as finished losses in the prime/late-prime window; Volkanovski is counted as elite decision damage.
- **Longevity:** the bantamweight resurgence helps, but it no longer gets max-style elite continuity credit.
- **Prime dominance:** is strong historically, but the UFC-only version is not clean enough for top-10 treatment.

#### Why ranked here

Aldo ranks in the top-15 range because the UFC-only model still respects his title work, quality wins, and ability to stay relevant across featherweight and bantamweight. He is a real legend, but the app no longer treats him like a clean top-10 UFC-only résumé.

#### Why not ranked higher?

The UFC-only boundary hurts him because his full historical peak includes WEC. Inside the UFC-only scoring window, the McGregor KO, Holloway TKO losses, Volkanovski loss, and uneven back half make him too damaged for the top ten.

#### Compare-mode guidance

- **Best counterargument:** Aldo’s argument is historical greatness plus longevity. If WEC is included, his case jumps. In this UFC-only ranking, that context is respected but not scored directly.
- **Why this résumé can still win:** Aldo wins debates when the opponent has weaker championship proof or less sustained elite relevance. He loses more often when the opponent has a cleaner UFC-only prime or stronger modern quality wins.

#### Final takeaway

Aldo is a scope-affected legend: historically massive, still very strong in UFC-only scoring, but more believable around the top-14/top-15 range than as a top-10 UFC-only GOAT.

_Ledger verified through 2026-07-13. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

### 13. Randy Couture — 92 OVR

The old-school championship chaos case: heavyweight gold, light heavyweight gold, huge title moments, and a messy record built from constant risk.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 60.99 | 16-8 | Heavyweight / Light Heavyweight | 9 | 7.68 | 9 | 6-3 | 80.8% | 4.22 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 15.85 | 35 | 18.49 |
| Opponent Quality | 19.79 | 25 | 16.49 |
| Prime Dominance | 21.15 | 30 | 21.15 |
| Longevity | 26.07 | 10 | 8.69 |

Base score: **64.82**. Modifiers: Apex **+4.42**, Loss Penalty **-5.25**, Division-Era Depth **-3**. Final raw score: **60.99**.

OVR conversion: 18.68–101.92 board anchors, normalized score **0.508289**, curved score **0.562593**, resulting in **92 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 15.85 | #6 | 7.68 adjusted credit / 14.54 benchmark |
| Opponent Quality | 19.79 | #29 | 9.3 diminished credit / 14.1 benchmark |
| Prime Dominance | 21.15 | #26 | 21.15 raw × 100.0% sample |
| Longevity | 26.07 | #5 | 125.14 counted elite months |
| Apex | +4.42 | Modifier | Returning from retirement to dominate Sylvia and stop Gonzaga creates a clear championship Apex despite lower raw performance ratings. |
| Loss Penalty | -5.25 | Modifier | 8 official/technical loss events reviewed |
| Division-Era Depth | -3 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **9**. Adjusted title wins: **7.68**. Derived undisputed-title win count: **8**. Interim-title win count: **1**.

| Date | Opponent | Title type | Base | Opponent strength | Final credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1997-12-21 | Maurice Smith | normal | 1 | 0.75 | 0.75 | Historic title win, but shallow early-era title field receives a material opponent-strength discount. |
| 2000-11-17 | Kevin Randleman | normal | 1 | 0.85 | 0.85 | Legitimate champion win with old-era heavyweight depth calibration. |
| 2001-05-04 | Pedro Rizzo | normal | 1 | 0.85 | 0.85 | Strong title challenger, but below full modern elite-title value. |
| 2001-11-02 | Pedro Rizzo | normal | 1 | 0.8 | 0.8 | Repeat title win with old-era and repeat-opponent calibration. |
| 2003-06-06 | Chuck Liddell | interim | 0.75 | 1 | 0.75 | Interim title value. |
| 2003-09-26 | Tito Ortiz | second-division-undisputed | 1.25 | 0.9 | 1.13 | Cody-approved classification: second-division undisputed title win, with old-era depth calibration preserved. |
| 2004-08-21 | Vitor Belfort | normal | 1 | 0.8 | 0.8 | Weird cut-loss rematch and old-era title context reduce the credit. |
| 2007-03-03 | Tim Sylvia | normal | 1 | 0.85 | 0.85 | Heavyweight title win remains strong, with softer-era opponent calibration. |
| 2007-08-25 | Gabriel Gonzaga | normal | 1 | 0.9 | 0.9 | Strong heavyweight title defense over a dangerous contender. |

#### Opponent Quality receipts

Raw win credit: **10.85**. Diminishing-return credit before fighter adjustment: **9.3**. Fighter adjustment: **0**. Final diminished credit: **9.3**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2003-06-06 | Chuck Liddell | champion-level | 1.25 | 1 | 1.25 | Elite light heavyweight champion-level opponent. |
| 2 | 2003-09-26 | Tito Ortiz | champion-level | 1.25 | 1 | 1.25 | UFC light heavyweight champion and elite rival. |
| 3 | 1997-10-17 | Vitor Belfort | top-ten | 0.85 | 1 | 0.85 | Elite young talent, but not a modern proven top-five UFC résumé at the time. |
| 4 | 2000-11-17 | Kevin Randleman | top-ten | 0.85 | 1 | 0.85 | UFC heavyweight champion with old-era depth calibration. |
| 5 | 2001-05-04 | Pedro Rizzo | top-ten | 0.85 | 1 | 0.85 | High-level heavyweight title challenger with old-era depth calibration. |
| 6 | 2001-11-02 | Pedro Rizzo | top-ten | 0.85 | 1 | 0.85 | Elite contender, close first fight context. |
| 7 | 2007-03-03 | Tim Sylvia | top-ten | 0.85 | 0.75 | 0.64 | UFC heavyweight champion, discounted for softer heavyweight-era depth. |
| 8 | 2007-08-25 | Gabriel Gonzaga | top-ten | 0.85 | 0.75 | 0.64 | Dangerous heavyweight contender after Cro Cop upset. |
| 9 | 1997-12-21 | Maurice Smith | ranked | 0.65 | 0.75 | 0.49 | Historic UFC champion win, but shallow early-era field limits opponent-quality value. |
| 10 | 1997-05-30 | Steven Graham | solid | 0.45 | 0.75 | 0.34 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 11 | 1997-05-30 | Tony Halme | solid | 0.45 | 0.75 | 0.34 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 12 | 2004-08-21 | Vitor Belfort | solid | 0.45 | 0.75 | 0.34 | Rubber match win with injury/cut rivalry and repeat context. |
| 13 | 2005-08-20 | Mike van Arsdale | solid | 0.45 | 0.5 | 0.23 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 14 | 2009-11-14 | Brandon Vera | solid | 0.45 | 0.5 | 0.23 | Relevant heavyweight/light-heavyweight name, but limited proven elite standing. |
| 15 | 2010-02-06 | Mark Coleman | name-value | 0.25 | 0.5 | 0.13 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 16 | 2010-08-28 | James Toney | minimal | 0.1 | 0.5 | 0.05 | Celebrity/specialist fight with minimal opponent-quality value. |

#### Prime Dominance receipts

Prime window: **Vitor Belfort I → Brock Lesnar**. Prime record: **6-3**. Effective samples: **18**. Sample multiplier: **100.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 6.16 | 13-6; 68.4% |
| Round control | 6.48 | 72.0%; rounds 36-14 |
| Finish pressure | 3 | 9 finishes; 47.4% |
| Elite-level validation | 5.51 | 17 elite-stage fights; 5.51 points |
| Raw prime score | 21.15 | Before sample multiplier |
| Final Prime Dominance | 21.15 | 21.15 × 1 |

#### Longevity receipts

Active elite years: **4.22**. Raw calendar months: **137.6**. Gap-adjusted months: **120.7**. Status multiplier: **1.08**. Division multiplier: **0.96**. Counted elite months: **125.14**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 1997-05-30 | 1997-05-30 | 0 | 0 | No |
| 1997-05-30 | 1997-10-17 | 4.6 | 4.6 | No |
| 1997-10-17 | 1997-12-21 | 2.14 | 2.14 | No |
| 1997-12-21 | 2000-11-17 | 34.89 | 18 | Yes |
| 2000-11-17 | 2001-05-04 | 5.52 | 5.52 | No |
| 2001-05-04 | 2001-11-02 | 5.98 | 5.98 | No |
| 2001-11-02 | 2002-03-22 | 4.6 | 4.6 | No |
| 2002-03-22 | 2002-09-27 | 6.21 | 6.21 | No |
| 2002-09-27 | 2003-06-06 | 8.28 | 8.28 | No |
| 2003-06-06 | 2003-09-26 | 3.68 | 3.68 | No |
| 2003-09-26 | 2004-01-31 | 4.17 | 4.17 | No |
| 2004-01-31 | 2004-08-21 | 6.67 | 6.67 | No |
| 2004-08-21 | 2005-04-16 | 7.82 | 7.82 | No |
| 2005-04-16 | 2005-08-20 | 4.14 | 4.14 | No |
| 2005-08-20 | 2006-02-04 | 5.52 | 5.52 | No |
| 2006-02-04 | 2007-03-03 | 12.88 | 12.88 | No |
| 2007-03-03 | 2007-08-25 | 5.75 | 5.75 | No |
| 2007-08-25 | 2008-11-15 | 14.72 | 14.72 | No |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **19** fights. Severity: **2.25**. Frequency: **2.13**. Prime-volume floor: **5.25**. Pre-division magnitude: **5.25**. Division discount: **0.0%**. Final penalty: **-5.25**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Base | Finish extra | Raw event | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2002-03-22 | Josh Barnett | prime | top-five | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2002-09-27 | Ricco Rodriguez | prime | top-five | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2004-01-31 | Vitor Belfort | prime | top-five | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2005-04-16 | Chuck Liddell | prime | top-five | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2006-02-04 | Chuck Liddell | prime | champion-level | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2008-11-15 | Brock Lesnar | prime | top-five | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2009-08-29 | Antonio Rodrigo Nogueira | post-prime | top-five | home | No | Yes | 0 | 0 | 0 | standard rule |
| 2011-04-30 | Lyoto Machida | post-prime | top-five | home | Yes | Yes | 0 | 0 | 0 | standard rule |

#### Division-strength context

Default division key: **couture-heavyweight-lhw-0.95**. Era-ledger division multiplier: **0.96**. Division-era modifier: **-3**.

Vitor II through Brock.

#### Key judgment calls

- **Two-division value:** heavyweight and light heavyweight gold are central to his ranking.
- **Era context:** old-school volatility matters because he kept taking dangerous title fights.
- **Loss volume:** keeps him below cleaner resumes even with strong championship credit.
- **Prime shape:** his case is multiple veteran surges rather than one smooth prime.
- **UFC-only fit:** his biggest value is already inside the UFC scoring boundary.

#### Why ranked here

Couture ranks #8 because his UFC-only case is loaded with championship moments across heavyweight and light heavyweight. The record is messy, but his title wins, two-division relevance, and era-spanning opponent list carry real all-time weight.

#### Why not ranked higher?

He does not climb higher because the loss penalty and prime-dominance profile are much messier than the cleaner GOAT cases. His greatness is championship value and risk-taking, not spotless dominance.

#### Compare-mode guidance

- **Best counterargument:** The case against Couture is the record. He has more losses than the cleaner GOAT candidates, so his ranking depends on how much credit you give for title risk and era context.
- **Why this résumé can still win:** Couture wins comparisons when championship moments, two-division relevance, and title-fight difficulty matter more than clean record aesthetics.

#### Final takeaway

Couture is the championship-chaos legend: not clean, not smooth, but too decorated across UFC title history to rank like a normal flawed contender.

_Ledger verified through 2026-07-13. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

### 14. Israel Adesanya — 91 OVR

The modern middleweight title-volume case: elite striking, repeated defenses, a title regain, and one of the deepest active title windows of his era.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 59.24 | 13-6 | Middleweight / Light Heavyweight | 8 | 7.26 | 9 | 8-4 | 60.0% | 5.35 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 14.98 | 35 | 17.48 |
| Opponent Quality | 22.05 | 25 | 18.38 |
| Prime Dominance | 17.44 | 30 | 17.44 |
| Longevity | 13.12 | 10 | 4.37 |

Base score: **57.67**. Modifiers: Apex **+5.12**, Loss Penalty **-3.5**, Division-Era Depth **-0.05**. Final raw score: **59.24**.

OVR conversion: 18.68–101.92 board anchors, normalized score **0.487266**, curved score **0.542751**, resulting in **91 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 14.98 | #8 | 7.26 adjusted credit / 14.54 benchmark |
| Opponent Quality | 22.05 | #17 | 10.36 diminished credit / 14.1 benchmark |
| Prime Dominance | 17.44 | #53 | 17.44 raw × 100.0% sample |
| Longevity | 13.12 | #34 | 62.96 counted elite months |
| Apex | +5.12 | Modifier | Stopping Whittaker and dominating unbeaten Costa support stronger Proof and Aura, but not a maximum Apex tier. |
| Loss Penalty | -3.5 | Modifier | 6 official/technical loss events reviewed |
| Division-Era Depth | -0.05 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **8**. Adjusted title wins: **7.26**. Derived undisputed-title win count: **7**. Interim-title win count: **1**.

| Date | Opponent | Title type | Base | Opponent strength | Final credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 2019-10-05 | Robert Whittaker | normal | 1 | 1 | 1 | Cody-approved factual correction: Whittaker was the reigning undisputed champion. Normal title win at full elite-opponent strength. |
| 2020-03-07 | Yoel Romero | normal | 1 | 0.85 | 0.85 | Weak/weird low-output title fight context. |
| 2020-09-26 | Paulo Costa | normal | 1 | 0.95 | 0.95 | locked |
| 2021-06-12 | Marvin Vettori | normal | 1 | 0.9 | 0.9 | locked |
| 2022-02-12 | Robert Whittaker | normal | 1 | 0.95 | 0.95 | locked |
| 2022-07-02 | Jared Cannonier | normal | 1 | 0.9 | 0.9 | locked |
| 2023-04-08 | Alex Pereira | normal | 1 | 1 | 1 | locked |
| 2019-04-13 | Kelvin Gastelum | interim | 0.75 | 0.95 | 0.71 | Cody-approved interim-title win: 0.75 base × 0.95 opponent strength = 0.71 credit. |

#### Opponent Quality receipts

Raw win credit: **11.65**. Diminishing-return credit before fighter adjustment: **10.36**. Fighter adjustment: **0**. Final diminished credit: **10.36**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2019-10-05 | Robert Whittaker | champion-level | 1.25 | 1 | 1.25 | Elite UFC middleweight champion. |
| 2 | 2022-02-12 | Robert Whittaker | champion-level | 1.25 | 1 | 1.25 | Repeat win over elite champion-level middleweight. |
| 3 | 2023-04-08 | Alex Pereira | champion-level | 1.25 | 1 | 1.25 | Defeated the reigning UFC champion in the rematch. |
| 4 | 2018-04-14 | Marvin Vettori | top-five | 1 | 1 | 1 | Top middleweight title challenger. |
| 5 | 2019-04-13 | Kelvin Gastelum | top-five | 1 | 1 | 1 | Elite interim-title war opponent at middleweight. |
| 6 | 2020-03-07 | Yoel Romero | top-five | 1 | 1 | 1 | Elite middleweight title challenger, age/activity context. |
| 7 | 2020-09-26 | Paulo Costa | top-five | 1 | 0.75 | 0.75 | Undefeated top middleweight contender. |
| 8 | 2018-11-03 | Derek Brunson | top-ten | 0.85 | 0.75 | 0.64 | Strong ranked middleweight contender. |
| 9 | 2022-07-02 | Jared Cannonier | top-ten | 0.85 | 0.75 | 0.64 | Strong ranked middleweight contender. |
| 10 | 2018-07-06 | Brad Tavares | ranked | 0.65 | 0.75 | 0.49 | Quality middleweight win on contender climb. |
| 11 | 2019-02-10 | Anderson Silva | ranked | 0.65 | 0.75 | 0.49 | All-time name, but late-career timing heavily discounted. |
| 12 | 2021-06-12 | Marvin Vettori | ranked | 0.65 | 0.75 | 0.49 | Early quality UFC win. |
| 13 | 2018-02-10 | Rob Wilkinson | name-value | 0.25 | 0.5 | 0.13 | Low-end UFC quality value. |

#### Prime Dominance receipts

Prime window: **Robert Whittaker I → Dricus du Plessis**. Prime record: **8-4**. Effective samples: **11**. Sample multiplier: **100.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 5.73 | 7-4; 63.6% |
| Round control | 5.4 | 60.0%; rounds 27-18 |
| Finish pressure | 1 | 3 finishes; 27.3% |
| Elite-level validation | 5.31 | 11 elite-stage fights; 5.31 points |
| Raw prime score | 17.44 | Before sample multiplier |
| Final Prime Dominance | 17.44 | 17.44 × 1 |

#### Longevity receipts

Active elite years: **5.35**. Raw calendar months: **58.4**. Gap-adjusted months: **58.4**. Status multiplier: **1.1**. Division multiplier: **0.98**. Counted elite months: **62.96**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 2019-10-05 | 2020-03-07 | 5.06 | 5.06 | No |
| 2020-03-07 | 2020-09-26 | 6.67 | 6.67 | No |
| 2020-09-26 | 2021-03-06 | 5.29 | 5.29 | No |
| 2021-03-06 | 2021-06-12 | 3.22 | 3.22 | No |
| 2021-06-12 | 2022-02-12 | 8.05 | 8.05 | No |
| 2022-02-12 | 2022-07-02 | 4.6 | 4.6 | No |
| 2022-07-02 | 2022-11-12 | 4.37 | 4.37 | No |
| 2022-11-12 | 2023-04-08 | 4.83 | 4.83 | No |
| 2023-04-08 | 2023-09-09 | 5.06 | 5.06 | No |
| 2023-09-09 | 2024-08-18 | 11.3 | 11.3 | No |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **17** fights. Severity: **2.25**. Frequency: **1.19**. Prime-volume floor: **3.5**. Pre-division magnitude: **3.5**. Division discount: **0.0%**. Final penalty: **-3.5**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Base | Finish extra | Raw event | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2021-03-06 | Jan Blachowicz | prime | champion-level | upward | No | Yes | -0.75 | 0 | -0.75 | prime-upward-elite |
| 2022-11-12 | Alex Pereira | prime | top-five | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2023-09-09 | Sean Strickland | prime | top-five | home | No | Yes | -1.5 | 0 | -1.5 | standard rule |
| 2024-08-18 | Dricus du Plessis | prime | champion-level | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2025-02-01 | Nassourdine Imavov | post-prime | top-five | home | Yes | Yes | 0 | 0 | 0 | standard rule |
| 2026-03-28 | Joe Pyfer | post-prime | top-ten | home | Yes | Yes | 0 | 0 | 0 | standard rule |

#### Division-strength context

Default division key: **adesanya-modern-middleweight-1.0**. Era-ledger division multiplier: **0.98**. Division-era modifier: **-0.05**.

Whittaker I through DDP.

#### Key judgment calls

- **Middleweight title volume:** the repeated defenses and title regain are the core of the case.
- **Pereira rivalry:** adds both a major blemish and a major redemption win.
- **Whittaker wins:** carry high-end middleweight value.
- **Later losses:** create real drag and keep the profile outside the top ten.
- **Light heavyweight attempt:** adds context, but middleweight remains the scoring center.

#### Why ranked here

Adesanya ranks here because his middleweight championship volume is real: title win, repeated defenses, a title regain, and a deep list of modern contenders.

#### Why not ranked higher?

He does not rank higher because the later losses make the case less clean, and the Pereira/Strickland/DDP stretch creates prime-dominance drag. The title volume is excellent, but the resume is not as clean as the names above him.

#### Compare-mode guidance

- **Best counterargument:** The counterargument is that the later losses and Pereira rivalry make the case less clean than the longest-reigning champions above him.
- **Why this résumé can still win:** Adesanya wins comparisons when modern middleweight title volume, striking dominance, and repeated elite wins outweigh messy rivalry context.

#### Final takeaway

Adesanya is the modern middleweight title-volume standard: deep, active, and important, but less clean than the longest-reign GOAT cases above him.

_Ledger verified through 2026-07-13. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

### 15. Daniel Cormier — 91 OVR

The compact two-division champion case: heavyweight gold, light heavyweight gold, elite wins, and rivalry ceilings against Jones and Stipe.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 58.06 | 11-3, 1 NC | Light Heavyweight / Heavyweight | 6 | 5.75 | 6 | 7-3, 1 NC | 59.4% | 5.62 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 11.86 | 35 | 13.84 |
| Opponent Quality | 19.12 | 25 | 15.93 |
| Prime Dominance | 20.65 | 30 | 20.65 |
| Longevity | 17.43 | 10 | 5.81 |

Base score: **56.23**. Modifiers: Apex **+5.06**, Loss Penalty **-3.01**, Division-Era Depth **-0.22**. Final raw score: **58.06**.

OVR conversion: 18.68–101.92 board anchors, normalized score **0.473090**, curved score **0.529300**, resulting in **91 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 11.86 | #12 | 5.75 adjusted credit / 14.54 benchmark |
| Opponent Quality | 19.12 | #35 | 8.99 diminished credit / 14.1 benchmark |
| Prime Dominance | 20.65 | #29 | 20.65 raw × 100.0% sample |
| Longevity | 17.43 | #14 | 83.66 counted elite months |
| Apex | +5.06 | Modifier | A dominant light-heavyweight defense followed by becoming heavyweight champion captures Cormier’s cleanest UFC-only six-month Apex. |
| Loss Penalty | -3.01 | Modifier | 3 official/technical loss events reviewed |
| Division-Era Depth | -0.22 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **6**. Adjusted title wins: **5.75**. Derived undisputed-title win count: **6**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 2015-05-23 | Anthony Johnson | vacant-undisputed | 0.9 | 1 | 0.9 | Elite vacant-title opponent; full opponent strength. |
| 2015-10-03 | Alexander Gustafsson | normal | 1 | 0.95 | 0.95 | locked |
| 2017-04-08 | Anthony Johnson | normal | 1 | 0.95 | 0.95 | locked |
| 2018-07-07 | Stipe Miocic | second-division-undisputed | 1.25 | 1 | 1.25 | review |
| 2018-01-20 | Volkan Oezdemir | normal | 1 | 0.85 | 0.85 | locked |
| 2018-11-03 | Derrick Lewis | normal | 1 | 0.85 | 0.85 | locked |

#### Opponent Quality receipts

Raw win credit: **9.65**. Diminishing-return credit before fighter adjustment: **8.99**. Fighter adjustment: **0**. Final diminished credit: **8.99**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2015-05-23 | Anthony Johnson | champion-level | 1.25 | 1 | 1.25 | Elite light heavyweight title challenger. |
| 2 | 2015-10-03 | Alexander Gustafsson | champion-level | 1.25 | 1 | 1.25 | Elite champion-level light heavyweight title challenger. |
| 3 | 2017-04-08 | Anthony Johnson | champion-level | 1.25 | 1 | 1.25 | Repeat win over elite light heavyweight title challenger. |
| 4 | 2018-07-07 | Stipe Miocic | champion-level | 1.25 | 1 | 1.25 | Elite UFC heavyweight champion. |
| 5 | 2018-01-20 | Volkan Oezdemir | top-five | 1 | 1 | 1 | Top-five light-heavyweight title challenger. |
| 6 | 2018-11-03 | Derrick Lewis | top-five | 1 | 1 | 1 | Heavyweight title challenger and dangerous top contender. |
| 7 | 2013-04-20 | Frank Mir | ranked | 0.65 | 0.75 | 0.49 | Former heavyweight champion, later-career timing. |
| 8 | 2013-10-19 | Roy Nelson | ranked | 0.65 | 0.75 | 0.49 | Ranked heavyweight veteran. |
| 9 | 2016-07-09 | Anderson Silva | ranked | 0.65 | 0.75 | 0.49 | All-time name, short-notice/late-career context. |
| 10 | 2014-05-24 | Dan Henderson | solid | 0.45 | 0.75 | 0.34 | All-time name, but aged/undersized timing. |
| 11 | 2014-02-22 | Patrick Cummins | name-value | 0.25 | 0.75 | 0.19 | Short-notice low opponent-quality value. |

#### Prime Dominance receipts

Prime window: **Dan Henderson → Stipe Miocic III**. Prime record: **7-3, 1 NC**. Effective samples: **11**. Sample multiplier: **100.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 6.55 | 8-3; 72.7% |
| Round control | 5.66 | 62.9%; rounds 22-13 |
| Finish pressure | 3 | 6 finishes; 54.5% |
| Elite-level validation | 5.44 | 9 elite-stage fights; 5.44 points |
| Raw prime score | 20.65 | Before sample multiplier |
| Final Prime Dominance | 20.65 | 20.65 × 1 |

#### Longevity receipts

Active elite years: **5.62**. Raw calendar months: **74.7**. Gap-adjusted months: **74.7**. Status multiplier: **1.12**. Division multiplier: **1**. Counted elite months: **83.66**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 2014-05-24 | 2015-01-03 | 7.36 | 7.36 | No |
| 2015-01-03 | 2015-05-23 | 4.6 | 4.6 | No |
| 2015-05-23 | 2015-10-03 | 4.37 | 4.37 | No |
| 2015-10-03 | 2016-07-09 | 9.2 | 9.2 | No |
| 2016-07-09 | 2017-04-08 | 8.97 | 8.97 | No |
| 2017-04-08 | 2017-07-29 | 3.68 | 3.68 | No |
| 2017-07-29 | 2018-01-20 | 5.75 | 5.75 | No |
| 2018-01-20 | 2018-07-07 | 5.52 | 5.52 | No |
| 2018-07-07 | 2018-11-03 | 3.91 | 3.91 | No |
| 2018-11-03 | 2019-08-17 | 9.43 | 9.43 | No |
| 2019-08-17 | 2020-08-15 | 11.96 | 11.96 | No |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **14** fights. Severity: **1.88**. Frequency: **1.13**. Prime-volume floor: **2.5**. Pre-division magnitude: **3.01**. Division discount: **0.0%**. Final penalty: **-3.01**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Base | Finish extra | Raw event | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2015-01-03 | Jon Jones | prime | champion-level | home | No | Yes | -1.5 | 0 | -1.5 | standard rule |
| 2019-08-17 | Stipe Miocic | prime | top-five | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2020-08-15 | Stipe Miocic | prime | champion-level | home | No | Yes | -1.5 | 0 | -1.5 | standard rule |

#### Division-strength context

Default division key: **cormier-lhw-heavyweight-1.0**. Era-ledger division multiplier: **1**. Division-era modifier: **-0.22**.

Dan Henderson through Stipe III.

#### Key judgment calls

- **Two-division value:** UFC light heavyweight and heavyweight gold are central to the case.
- **Jones rivalry:** keeps him out of the top-tier GOAT range even though DC was elite.
- **Stipe trilogy:** gives DC huge value but also a direct-rivalry ceiling.
- **Strikeforce context:** can be mentioned historically, but it is not scored here.
- **Compact UFC window:** dense title value matters more than long calendar volume.

#### Why ranked here

Cormier ranks #13 because his UFC resume is compact but elite: two-division champion, strong title-fight wins, and high-level wins at both light heavyweight and heavyweight.

#### Why not ranked higher?

He does not rank higher because direct rivalry separation blocks him. Jones clearly caps the light heavyweight case, Stipe won the heavyweight trilogy, and the UFC window is not as long as the deeper resumes above him.

#### Compare-mode guidance

- **Best counterargument:** The counterargument is direct separation. Jones beat him, and Stipe won the trilogy, so Cormier has two major rivalry ceilings in the all-time debate.
- **Why this résumé can still win:** Cormier wins comparisons when two-division title value and elite opponent quality outweigh rivalry losses to other all-time greats.

#### Final takeaway

Cormier is a dense elite-resume case: two UFC belts, major title wins, and all-time skill, held back by direct rivalry ceilings against Jones and Stipe.

_Ledger verified through 2026-07-13. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

### 16. Alex Pereira — 91 OVR

The fast-climb knockout case: middleweight gold, light heavyweight gold, huge title moments, and a heavyweight swing that added risk to a short UFC prime.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 57.19 | 10-3 | Light Heavyweight / Middleweight / Heavyweight | 6 | 5.84 | 8 | 8-3 | 57.1% | 4.03 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 12.05 | 35 | 14.06 |
| Opponent Quality | 18.43 | 25 | 15.36 |
| Prime Dominance | 21.32 | 30 | 21.32 |
| Longevity | 11.11 | 10 | 3.7 |

Base score: **54.44**. Modifiers: Apex **+5.53**, Loss Penalty **-2.94**, Division-Era Depth **+0.16**. Final raw score: **57.19**.

OVR conversion: 18.68–101.92 board anchors, normalized score **0.462638**, curved score **0.519344**, resulting in **91 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 12.05 | #10 | 5.84 adjusted credit / 14.54 benchmark |
| Opponent Quality | 18.43 | #39 | 8.66 diminished credit / 14.1 benchmark |
| Prime Dominance | 21.32 | #24 | 21.32 raw × 100.0% sample |
| Longevity | 11.11 | #45 | 53.32 counted elite months |
| Apex | +5.53 | Modifier | Terrifying title-fight finisher aura. |
| Loss Penalty | -2.94 | Modifier | 3 official/technical loss events reviewed |
| Division-Era Depth | +0.16 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **6**. Adjusted title wins: **5.84**. Derived undisputed-title win count: **6**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 2022-11-12 | Israel Adesanya | normal | 1 | 1 | 1 | locked |
| 2023-11-11 | Jiri Prochazka | vacant-second-division | 1.15 | 0.95 | 1.09 | Vacant second-division title context. |
| 2024-04-13 | Jamahal Hill | normal | 1 | 0.95 | 0.95 | locked |
| 2024-06-29 | Jiri Prochazka | normal | 1 | 0.95 | 0.95 | locked |
| 2024-10-05 | Khalil Rountree Jr. | normal | 1 | 0.9 | 0.9 | locked |
| 2025-10-04 | Magomed Ankalaev | normal | 1 | 0.95 | 0.95 | Current-table elite LHW title defense. |

#### Opponent Quality receipts

Raw win credit: **9.3**. Diminishing-return credit before fighter adjustment: **8.66**. Fighter adjustment: **0**. Final diminished credit: **8.66**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2022-11-12 | Israel Adesanya | champion-level | 1.25 | 1 | 1.25 | Elite UFC middleweight champion. |
| 2 | 2023-11-11 | Jiri Prochazka | champion-level | 1.25 | 1 | 1.25 | Elite former light heavyweight champion. |
| 3 | 2024-06-29 | Jiri Prochazka | champion-level | 1.25 | 1 | 1.25 | Repeat win over elite light heavyweight champion-level opponent. |
| 4 | 2023-07-29 | Jan Blachowicz | top-five | 1 | 1 | 1 | Former light heavyweight champion and top contender. |
| 5 | 2024-04-13 | Jamahal Hill | top-five | 1 | 1 | 1 | Former light heavyweight champion returning from injury. |
| 6 | 2024-10-05 | Khalil Rountree Jr. | top-five | 1 | 1 | 1 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 7 | 2025-10-04 | Magomed Ankalaev | top-five | 1 | 0.75 | 0.75 | Elite light heavyweight contender/title-level opponent. |
| 8 | 2022-07-02 | Sean Strickland | top-ten | 0.85 | 0.75 | 0.64 | Strong ranked middleweight win before Strickland title peak. |
| 9 | 2022-03-12 | Bruno Silva | solid | 0.45 | 0.75 | 0.34 | Solid UFC middleweight win. |
| 10 | 2021-11-06 | Andreas Michailidis | name-value | 0.25 | 0.75 | 0.19 | Low UFC opponent-quality value. |

#### Prime Dominance receipts

Prime window: **Sean Strickland → Current title-level form**. Prime record: **8-3**. Effective samples: **11**. Sample multiplier: **100.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 6.55 | 8-3; 72.7% |
| Round control | 5.14 | 57.1%; rounds 16-12 |
| Finish pressure | 4 | 7 finishes; 63.6% |
| Elite-level validation | 5.63 | 11 elite-stage fights; 5.63 points |
| Raw prime score | 21.32 | Before sample multiplier |
| Final Prime Dominance | 21.32 | 21.32 × 1 |

#### Longevity receipts

Active elite years: **4.03**. Raw calendar months: **48.4**. Gap-adjusted months: **48.4**. Status multiplier: **1.08**. Division multiplier: **1.02**. Counted elite months: **53.32**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 2022-07-02 | 2022-11-12 | 4.37 | 4.37 | No |
| 2022-11-12 | 2023-04-08 | 4.83 | 4.83 | No |
| 2023-04-08 | 2023-07-29 | 3.68 | 3.68 | No |
| 2023-07-29 | 2023-11-11 | 3.45 | 3.45 | No |
| 2023-11-11 | 2024-04-13 | 5.06 | 5.06 | No |
| 2024-04-13 | 2024-06-29 | 2.53 | 2.53 | No |
| 2024-06-29 | 2024-10-05 | 3.22 | 3.22 | No |
| 2024-10-05 | 2025-03-08 | 5.06 | 5.06 | No |
| 2025-03-08 | 2025-10-04 | 6.9 | 6.9 | No |
| 2025-10-04 | 2026-06-14 | 8.31 | 8.31 | No |
| 2026-06-14 | 2026-07-13 | 0.95 | 0.95 | No |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **13** fights. Severity: **1.88**. Frequency: **1.15**. Prime-volume floor: **2.75**. Pre-division magnitude: **3.03**. Division discount: **3.0%**. Final penalty: **-2.94**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Base | Finish extra | Raw event | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2023-04-08 | Israel Adesanya | prime | top-five | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2025-03-08 | Magomed Ankalaev | prime | top-five | home | No | Yes | -1.5 | 0 | -1.5 | standard rule |
| 2026-06-14 | Ciryl Gane | prime | top-five | upward | Yes | Yes | -0.75 | -0.5 | -1.25 | prime-upward-elite |

#### Division-strength context

Default division key: **pereira-multi-division-1.01**. Era-ledger division multiplier: **1.02**. Division-era modifier: **+0.16**.

Strickland through current title-level form.

#### Key judgment calls

- **Two-division value:** middleweight and light heavyweight gold carry major front-end value.
- **Knockout impact:** a huge part of the profile and why the resume feels louder than the raw volume.
- **Gane loss:** counts as a reduced upward-division elite loss, but being finished still matters.
- **Adesanya rivalry:** adds both a major title win and a major knockout loss.
- **Short sample:** keeps longevity and total resume score capped.

#### Why ranked here

Pereira ranks here because his UFC case is short but extremely loud: two-division champion value, major knockout moments, and high-end wins packed into a very small window.

#### Why not ranked higher?

He does not rank higher because the active elite window is still short compared with the long-reign resumes, and the Adesanya and Gane finish losses now give the profile more prime-loss drag. The peak impact is massive, but the total UFC sample is not deep or clean enough yet.

#### Compare-mode guidance

- **Best counterargument:** The argument against Pereira is volume and loss context. The peak is huge, but the UFC sample is still shorter and now messier than the deepest all-time cases.
- **Why this résumé can still win:** Pereira wins comparisons when two-division title value, knockout danger, and high-impact championship moments outweigh longer but less explosive resumes.

#### Final takeaway

Pereira remains the loudest short-run case in the ranking: massive title impact and knockout danger, with the Gane heavyweight finish loss adding real drag to an already compact resume.

_Ledger verified through 2026-07-13. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

### 17. Chuck Liddell — 91 OVR

The classic light heavyweight star case: knockout aura, title defenses, Tito/Couture rivalry value, and a rough late-career ending.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 56.42 | 16-7 | Light Heavyweight | 5 | 4.5 | 11 | 7-1 | 93.3% | 3.15 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 9.28 | 35 | 10.83 |
| Opponent Quality | 19.84 | 25 | 16.53 |
| Prime Dominance | 26.94 | 30 | 26.94 |
| Longevity | 8.64 | 10 | 2.88 |

Base score: **57.18**. Modifiers: Apex **+5.27**, Loss Penalty **-3.09**, Division-Era Depth **-2.94**. Final raw score: **56.42**.

OVR conversion: 18.68–101.92 board anchors, normalized score **0.453388**, curved score **0.510504**, resulting in **91 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 9.28 | #18 | 4.5 adjusted credit / 14.54 benchmark |
| Opponent Quality | 19.84 | #28 | 9.32 diminished credit / 14.1 benchmark |
| Prime Dominance | 26.94 | #3 | 26.94 raw × 100.0% sample |
| Longevity | 8.64 | #55 | 41.47 counted elite months |
| Apex | +5.27 | Modifier | Two defining championship knockouts justify substantially stronger Proof while preserving the existing Claim and Aura. |
| Loss Penalty | -3.09 | Modifier | 7 official/technical loss events reviewed |
| Division-Era Depth | -2.94 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **5**. Adjusted title wins: **4.5**. Derived undisputed-title win count: **5**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 2005-04-16 | Randy Couture | normal | 1 | 1 | 1 | locked |
| 2005-08-20 | Jeremy Horn | normal | 1 | 0.8 | 0.8 | locked |
| 2006-02-04 | Randy Couture | normal | 1 | 0.95 | 0.95 | locked |
| 2006-08-26 | Renato Sobral | normal | 1 | 0.85 | 0.85 | locked |
| 2006-12-30 | Tito Ortiz | normal | 1 | 0.9 | 0.9 | locked |

#### Opponent Quality receipts

Raw win credit: **10.6**. Diminishing-return credit before fighter adjustment: **9.32**. Fighter adjustment: **0**. Final diminished credit: **9.32**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2005-04-16 | Randy Couture | champion-level | 1.25 | 1 | 1.25 | Won the UFC light heavyweight title from an elite champion and defining rival. |
| 2 | 2006-02-04 | Randy Couture | champion-level | 1.25 | 1 | 1.25 | Immediate trilogy win over an elite former champion and title challenger. |
| 3 | 2004-04-02 | Tito Ortiz | top-five | 1 | 1 | 1 | Former long-reigning UFC champion and elite light heavyweight contender. |
| 4 | 2006-12-30 | Tito Ortiz | top-five | 1 | 1 | 1 | Repeat title-defense win over an elite rival; repeat and timing context keep it below max. |
| 5 | 2002-06-22 | Vitor Belfort | top-ten | 0.85 | 1 | 0.85 | Dangerous elite UFC name, but not a clean champion-level or true top-five win in this timing context. |
| 6 | 2002-11-22 | Renato Sobral | top-ten | 0.85 | 1 | 0.85 | Ranked title challenger; strong defense with early-era depth context. |
| 7 | 2001-05-04 | Kevin Randleman | ranked | 0.65 | 0.75 | 0.49 | Former UFC heavyweight champion and dangerous athlete, with timing and division context. |
| 8 | 2001-09-28 | Murilo Bustamante | ranked | 0.65 | 0.75 | 0.49 | High-level future UFC champion, but earlier-career timing caps the credit. |
| 9 | 2005-08-20 | Jeremy Horn | ranked | 0.65 | 0.75 | 0.49 | Experienced title challenger on a major unbeaten run; revenge and era context cap the credit. |
| 10 | 2006-08-26 | Renato Sobral | ranked | 0.65 | 0.75 | 0.49 | Meaningful contender win before the title reign, below the later title-defense version. |
| 11 | 2007-12-29 | Wanderlei Silva | ranked | 0.65 | 0.75 | 0.49 | Major elite name, but the UFC win came after his clearest non-UFC peak. |
| 12 | 2000-12-16 | Jeff Monson | solid | 0.45 | 0.75 | 0.34 | Solid UFC heavyweight win before Monson’s later contender run. |
| 13 | 2002-01-11 | Amar Suloev | name-value | 0.25 | 0.5 | 0.13 | Useful early win, but limited proven UFC contender value. |
| 14 | 2004-08-21 | Vernon White | name-value | 0.25 | 0.5 | 0.13 | Supporting UFC light heavyweight win with limited ranked value. |
| 15 | 1998-05-15 | Noe Hernandez | minimal | 0.1 | 0.5 | 0.05 | UFC debut win with minimal opponent-quality value. |
| 16 | 1999-09-24 | Paul Jones | minimal | 0.1 | 0.5 | 0.05 | Early UFC win with minimal opponent-quality value. |

#### Prime Dominance receipts

Prime window: **Tito Ortiz I → Quinton Jackson II**. Prime record: **7-1**. Effective samples: **8**. Sample multiplier: **100.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 7.88 | 7-1; 87.5% |
| Round control | 8.4 | 93.3%; rounds 14-1 |
| Finish pressure | 4.5 | 7 finishes; 87.5% |
| Elite-level validation | 6.16 | 7 elite-stage fights; 6.16 points |
| Raw prime score | 26.94 | Before sample multiplier |
| Final Prime Dominance | 26.94 | 26.94 × 1 |

#### Longevity receipts

Active elite years: **3.15**. Raw calendar months: **37.7**. Gap-adjusted months: **37.7**. Status multiplier: **1.1**. Division multiplier: **1**. Counted elite months: **41.47**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 2004-04-02 | 2004-08-21 | 4.63 | 4.63 | No |
| 2004-08-21 | 2005-04-16 | 7.82 | 7.82 | No |
| 2005-04-16 | 2005-08-20 | 4.14 | 4.14 | No |
| 2005-08-20 | 2006-02-04 | 5.52 | 5.52 | No |
| 2006-02-04 | 2006-08-26 | 6.67 | 6.67 | No |
| 2006-08-26 | 2006-12-30 | 4.14 | 4.14 | No |
| 2006-12-30 | 2007-05-26 | 4.83 | 4.83 | No |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **18** fights. Severity: **2.13**. Frequency: **0.96**. Prime-volume floor: **1**. Pre-division magnitude: **3.09**. Division discount: **0.0%**. Final penalty: **-3.09**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Base | Finish extra | Raw event | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1999-03-05 | Jeremy Horn | pre-prime | solid | home | Yes | Yes | -1.25 | -0.75 | -2 | standard rule |
| 2003-06-06 | Randy Couture | pre-prime | top-five | home | Yes | Yes | -0.75 | -0.75 | -1.5 | standard rule |
| 2007-05-26 | Quinton Jackson | prime | top-five | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2007-09-22 | Keith Jardine | post-prime | top-ten | home | No | Yes | 0 | 0 | 0 | standard rule |
| 2008-09-06 | Rashad Evans | post-prime | top-five | home | Yes | Yes | 0 | 0 | 0 | standard rule |
| 2009-04-18 | Mauricio Rua | post-prime | top-five | home | Yes | Yes | 0 | 0 | 0 | standard rule |
| 2010-06-12 | Rich Franklin | post-prime | top-five | home | Yes | Yes | 0 | 0 | 0 | standard rule |

#### Division-strength context

Default division key: **early-modern-light-heavyweight-1.00**. Era-ledger division multiplier: **1**. Division-era modifier: **-2.94**.

Tito I through Rampage II.

#### Key judgment calls

- **Era impact:** matters as context, but the ranking still scores UFC resume value.
- **Rivalry wins:** Tito and Couture wins carry a large part of the case.
- **Title defenses:** give real championship value for his era.
- **Late losses:** hurt the record and durability perception.
- **Opponent depth:** is solid but not top-tier compared with Jones or modern deep divisions.

#### Why ranked here

Liddell ranks here because his light heavyweight title run and rivalry wins were central to the UFC’s breakout era. He had real championship volume, major star power, and a dangerous peak built around knockout threat.

#### Why not ranked higher?

He does not rank higher because later light heavyweight resumes are deeper and cleaner, and the late knockout losses drag the UFC-only profile hard.

#### Compare-mode guidance

- **Best counterargument:** Chuck’s argument is peak aura and era impact. The knock is that the resume is not as deep or clean as later light heavyweight and pound-for-pound cases.
- **Why this résumé can still win:** Chuck wins comparisons when title-reign value, knockout aura, and era-defining star power matter more than clean longevity.

#### Final takeaway

Chuck is the classic UFC light heavyweight star: real title value and huge knockout aura, held back by a rough ending and deeper later-era resumes.

_Ledger verified through 2026-07-13. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

### 18. Charles Oliveira — 91 OVR

The late-blooming lightweight chaos case: elite finishing value, huge quality wins, and a messy record that keeps the score volatile.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 55.65 | 25-11, 1 NC | Lightweight / Featherweight | 2 | 1.76 | 6 | 9-3 | 71.0% | 6.33 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 3.63 | 35 | 4.23 |
| Opponent Quality | 26.22 | 25 | 21.85 |
| Prime Dominance | 21.69 | 30 | 21.69 |
| Longevity | 18.46 | 10 | 6.15 |

Base score: **53.92**. Modifiers: Apex **+4.84**, Loss Penalty **-3.06**, Division-Era Depth **-0.05**. Final raw score: **55.65**.

OVR conversion: 18.68–101.92 board anchors, normalized score **0.444137**, curved score **0.501637**, resulting in **91 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 3.63 | #50 | 1.76 adjusted credit / 14.54 benchmark |
| Opponent Quality | 26.22 | #4 | 12.32 diminished credit / 14.1 benchmark |
| Prime Dominance | 21.69 | #22 | 21.69 raw × 100.0% sample |
| Longevity | 18.46 | #12 | 88.62 counted elite months |
| Apex | +4.84 | Modifier | Back-to-back elite finishes support greater Claim and Aura, with the later Islam loss still limiting the ceiling. |
| Loss Penalty | -3.06 | Modifier | 11 official/technical loss events reviewed |
| Division-Era Depth | -0.05 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **2**. Adjusted title wins: **1.76**. Derived undisputed-title win count: **2**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 2021-05-15 | Michael Chandler | vacant-undisputed | 0.9 | 0.9 | 0.81 | locked |
| 2021-12-11 | Dustin Poirier | normal | 1 | 0.95 | 0.95 | locked |

#### Opponent Quality receipts

Raw win credit: **16.75**. Diminishing-return credit before fighter adjustment: **12.32**. Fighter adjustment: **0**. Final diminished credit: **12.32**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2021-12-11 | Dustin Poirier | champion-level | 1.25 | 1 | 1.25 | Elite prime lightweight interim champion and title-caliber opponent. |
| 2 | 2022-05-07 | Justin Gaethje | champion-level | 1.25 | 1 | 1.25 | Elite prime lightweight title challenger and former interim champion. |
| 3 | 2026-03-07 | Max Holloway | champion-level | 1.25 | 1 | 1.25 | Champion-level opponent in the approved app timeline. |
| 4 | 2020-12-12 | Tony Ferguson | top-five | 1 | 1 | 1 | Top lightweight name, post-Gaethje timing keeps it under review. |
| 5 | 2021-05-15 | Michael Chandler | top-five | 1 | 1 | 1 | Vacant-title opponent and elite lightweight contender. |
| 6 | 2023-06-10 | Beneil Dariush | top-five | 1 | 1 | 1 | Long-streak elite lightweight contender. |
| 7 | 2019-05-18 | Nik Lentz | top-ten | 0.85 | 0.75 | 0.64 | Ranked featherweight rivalry win during Oliveira’s climb. |
| 8 | 2020-03-14 | Kevin Lee | top-ten | 0.85 | 0.75 | 0.64 | Strong ranked lightweight contender. |
| 9 | 2024-11-16 | Michael Chandler | top-ten | 0.85 | 0.75 | 0.64 | Dangerous veteran rematch win, later-career context. |
| 10 | 2025-10-11 | Mateusz Gamrot | top-ten | 0.85 | 0.75 | 0.64 | Strong ranked lightweight win in the approved app timeline. |
| 11 | 2014-06-28 | Hatsu Hioki | ranked | 0.65 | 0.75 | 0.49 | Quality featherweight submission win. |
| 12 | 2014-12-12 | Jeremy Stephens | ranked | 0.65 | 0.75 | 0.49 | Dangerous featherweight contender win. |
| 13 | 2019-02-02 | David Teymur | ranked | 0.65 | 0.5 | 0.33 | Quality lightweight win during Charles’ prime climb. |
| 14 | 2010-08-01 | Darren Elkins | solid | 0.45 | 0.5 | 0.23 | Solid early featherweight win. |
| 15 | 2012-06-01 | Jonathan Brookins | solid | 0.45 | 0.5 | 0.23 | TUF winner and useful UFC featherweight win. |
| 16 | 2015-05-30 | Nik Lentz | solid | 0.45 | 0.5 | 0.23 | Useful veteran rivalry win. |
| 17 | 2015-12-19 | Myles Jury | solid | 0.45 | 0.5 | 0.23 | Solid UFC win. |
| 18 | 2017-04-08 | Will Brooks | solid | 0.45 | 0.5 | 0.23 | Former non-UFC champion name, UFC value limited. |
| 19 | 2018-06-09 | Clay Guida | solid | 0.45 | 0.25 | 0.11 | Solid veteran UFC win. |
| 20 | 2018-09-22 | Christos Giagos | solid | 0.45 | 0.25 | 0.11 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 21 | 2018-12-15 | Jim Miller | solid | 0.45 | 0.25 | 0.11 | Veteran rematch win after Miller’s higher peak. |
| 22 | 2019-11-16 | Jared Gordon | solid | 0.45 | 0.25 | 0.11 | Solid UFC lightweight win. |
| 23 | 2010-09-15 | Efrain Escudero | name-value | 0.25 | 0.25 | 0.06 | Limited opponent-quality value. |
| 24 | 2014-02-15 | Andy Ogle | name-value | 0.25 | 0.25 | 0.06 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 25 | 2012-01-28 | Eric Wisely | minimal | 0.1 | 0.25 | 0.03 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |

#### Prime Dominance receipts

Prime window: **Kevin Lee → Current elite-prime form**. Prime record: **9-3**. Effective samples: **12**. Sample multiplier: **100.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 6.75 | 9-3; 75.0% |
| Round control | 6.39 | 71.0%; rounds 22-9 |
| Finish pressure | 3 | 6 finishes; 50.0% |
| Elite-level validation | 5.55 | 9 elite-stage fights; 5.55 points |
| Raw prime score | 21.69 | Before sample multiplier |
| Final Prime Dominance | 21.69 | 21.69 × 1 |

#### Longevity receipts

Active elite years: **6.33**. Raw calendar months: **76**. Gap-adjusted months: **76**. Status multiplier: **1.06**. Division multiplier: **1.1**. Counted elite months: **88.62**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 2020-03-14 | 2020-12-12 | 8.97 | 8.97 | No |
| 2020-12-12 | 2021-05-15 | 5.06 | 5.06 | No |
| 2021-05-15 | 2021-12-11 | 6.9 | 6.9 | No |
| 2021-12-11 | 2022-05-07 | 4.83 | 4.83 | No |
| 2022-05-07 | 2022-10-22 | 5.52 | 5.52 | No |
| 2022-10-22 | 2023-06-10 | 7.59 | 7.59 | No |
| 2023-06-10 | 2024-04-13 | 10.12 | 10.12 | No |
| 2024-04-13 | 2024-11-16 | 7.13 | 7.13 | No |
| 2024-11-16 | 2025-06-28 | 7.36 | 7.36 | No |
| 2025-06-28 | 2025-10-11 | 3.45 | 3.45 | No |
| 2025-10-11 | 2026-03-07 | 4.83 | 4.83 | No |
| 2026-03-07 | 2026-07-13 | 4.21 | 4.21 | No |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **36** fights. Severity: **2.25**. Frequency: **1.35**. Prime-volume floor: **2.75**. Pre-division magnitude: **3.6**. Division discount: **15.0%**. Final penalty: **-3.06**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Base | Finish extra | Raw event | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2010-12-11 | Jim Miller | pre-prime | top-five | home | Yes | Yes | -0.75 | -0.75 | -1.5 | standard rule |
| 2011-08-14 | Donald Cerrone | pre-prime | top-five | home | Yes | Yes | -0.75 | -0.75 | -1.5 | standard rule |
| 2012-09-22 | Cub Swanson | pre-prime | top-five | catchweight | Yes | Yes | -0.75 | -0.75 | -1.5 | standard rule |
| 2013-07-06 | Frankie Edgar | pre-prime | champion-level | home | No | Yes | -0.75 | 0 | -0.75 | standard rule |
| 2015-08-23 | Max Holloway | pre-prime | top-five | home | Yes | No | 0 | 0 | 0 | technical-injury-context |
| 2016-08-27 | Anthony Pettis | pre-prime | champion-level | home | Yes | Yes | -0.75 | -0.75 | -1.5 | standard rule |
| 2016-11-05 | Ricardo Lamas | pre-prime | top-five | catchweight | Yes | Yes | -0.75 | -0.75 | -1.5 | standard rule |
| 2017-12-02 | Paul Felder | pre-prime | top-ten | home | Yes | Yes | -1.25 | -0.75 | -2 | standard rule |
| 2022-10-22 | Islam Makhachev | prime | champion-level | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2024-04-13 | Arman Tsarukyan | prime | top-five | home | No | Yes | -1.5 | 0 | -1.5 | standard rule |
| 2025-06-28 | Ilia Topuria | prime | champion-level | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |

#### Division-strength context

Default division key: **modern-elite-lightweight-1.10**. Era-ledger division multiplier: **1.1**. Division-era modifier: **-0.05**.

Modern lightweight receives the locked 1.10 division-strength treatment.

#### Key judgment calls

- **Quality wins:** the biggest strength of the Charles case.
- **Finish threat:** central to his prime and why the resume feels so dangerous.
- **Late-blooming prime:** the scoring window protects the best lightweight run but cannot erase earlier damage.
- **Islam and Topuria losses:** real elite title losses that cap the lightweight supremacy case.
- **Title volume:** short reign keeps him below longer champions even with strong wins.

#### Why ranked here

Oliveira ranks here because his high-end lightweight run is impossible to ignore. Chandler, Poirier, Gaethje, Dariush, Ferguson, and Lee give him one of the most dangerous quality-win ledgers in the ranking.

#### Why not ranked higher?

He does not rank higher because the loss penalty is heavy and the title reign was short. The highs are elite, but the full UFC resume is messier than the cleaner champion cases.

#### Compare-mode guidance

- **Best counterargument:** Oliveira’s argument is quality and danger. He beat elite lightweights in violent fashion and was never a normal champion to prepare for.
- **Why this résumé can still win:** Oliveira wins comparisons when lightweight quality wins, finishing value, and prime chaos outweigh record cleanliness.

#### Final takeaway

Charles is the lightweight chaos-finishing legend: dangerous, accomplished, and loaded with quality wins, but too messy to rank with the clean long-reign champions.

_Ledger verified through 2026-07-13. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

### 19. T.J. Dillashaw — 90 OVR

A real bantamweight title monster with five UFC title-fight wins, huge finishes over Barao and Garbrandt, and an EPO suspension that keeps the legacy from feeling clean.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 55.08 | 13-5 | Bantamweight / Flyweight | 5 | 4.65 | 7 | 8-3 | 75.0% | 7.4 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 9.59 | 35 | 11.19 |
| Opponent Quality | 19.2 | 25 | 16 |
| Prime Dominance | 23.53 | 30 | 23.53 |
| Longevity | 12.58 | 10 | 4.19 |

Base score: **54.91**. Modifiers: Apex **+4.85**, Loss Penalty **-3.35**, Division-Era Depth **-1.33**. Final raw score: **55.08**.

OVR conversion: 18.68–101.92 board anchors, normalized score **0.437290**, curved score **0.495056**, resulting in **90 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 9.59 | #17 | 4.65 adjusted credit / 14.54 benchmark |
| Opponent Quality | 19.2 | #34 | 9.03 diminished credit / 14.1 benchmark |
| Prime Dominance | 23.53 | #14 | 23.53 raw × 100.0% sample |
| Longevity | 12.58 | #38 | 60.37 counted elite months |
| Apex | +4.85 | Modifier | Two championship knockouts form a clean peak; the Cejudo loss and PED context constrain Claim and Aura. |
| Loss Penalty | -3.35 | Modifier | 5 official/technical loss events reviewed |
| Division-Era Depth | -1.33 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **5**. Adjusted title wins: **4.65**. Derived undisputed-title win count: **5**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 2014-05-24 | Renan Barao | normal | 1 | 1 | 1 | locked |
| 2014-08-30 | Joe Soto | normal | 1 | 0.75 | 0.75 | Short-notice replacement title defense. |
| 2015-07-25 | Renan Barao | normal | 1 | 0.95 | 0.95 | locked |
| 2017-11-04 | Cody Garbrandt | normal | 1 | 1 | 1 | locked |
| 2018-08-04 | Cody Garbrandt | normal | 1 | 0.95 | 0.95 | locked |

#### Opponent Quality receipts

Raw win credit: **9.95**. Diminishing-return credit before fighter adjustment: **9.03**. Fighter adjustment: **0**. Final diminished credit: **9.03**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2014-05-24 | Renan Barao | champion-level | 1.25 | 1 | 1.25 | Elite bantamweight champion-level opponent. |
| 2 | 2017-11-04 | Cody Garbrandt | champion-level | 1.25 | 1 | 1.25 | UFC bantamweight champion and elite title opponent. |
| 3 | 2015-07-25 | Renan Barao | top-five | 1 | 1 | 1 | Repeat win over former champion, with decline/repeat context. |
| 4 | 2018-08-04 | Cody Garbrandt | top-five | 1 | 1 | 1 | Repeat win over former champion, less fresh but still elite quality. |
| 5 | 2021-07-24 | Cory Sandhagen | top-five | 1 | 1 | 1 | Elite bantamweight contender; close decision context. |
| 6 | 2014-08-30 | Joe Soto | top-ten | 0.85 | 1 | 0.85 | Late-replacement title challenger; strong Top-10 quality. |
| 7 | 2016-07-09 | Raphael Assuncao | top-ten | 0.85 | 0.75 | 0.64 | Strong ranked bantamweight contender. |
| 8 | 2016-12-30 | John Lineker | top-ten | 0.85 | 0.75 | 0.64 | Dangerous ranked bantamweight contender. |
| 9 | 2013-04-20 | Hugo Viana | ranked | 0.65 | 0.75 | 0.49 | Ranked-quality bantamweight win. |
| 10 | 2013-03-16 | Issei Tamura | solid | 0.45 | 0.75 | 0.34 | Approved supporting UFC win treatment. |
| 11 | 2014-01-15 | Mike Easton | solid | 0.45 | 0.75 | 0.34 | Solid bantamweight win. |
| 12 | 2012-07-11 | Vaughan Lee | name-value | 0.25 | 0.75 | 0.19 | Low-end UFC quality value. |
| 13 | 2012-02-15 | Walel Watson | minimal | 0.1 | 0.5 | 0.05 | Minimal UFC quality value. |

#### Prime Dominance receipts

Prime window: **Renan Barao I → Henry Cejudo**. Prime record: **8-3**. Effective samples: **9**. Sample multiplier: **100.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 7 | 7-2; 77.8% |
| Round control | 7.45 | 82.8%; rounds 24-5 |
| Finish pressure | 3 | 5 finishes; 55.6% |
| Elite-level validation | 6.08 | 9 elite-stage fights; 6.08 points |
| Raw prime score | 23.53 | Before sample multiplier |
| Final Prime Dominance | 23.53 | 23.53 × 1 |

#### Longevity receipts

Active elite years: **7.4**. Raw calendar months: **55.9**. Gap-adjusted months: **55.9**. Status multiplier: **1.08**. Division multiplier: **1**. Counted elite months: **60.37**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 2014-05-24 | 2014-08-30 | 3.22 | 3.22 | No |
| 2014-08-30 | 2015-07-25 | 10.81 | 10.81 | No |
| 2015-07-25 | 2016-01-17 | 5.78 | 5.78 | No |
| 2016-01-17 | 2016-07-09 | 5.72 | 5.72 | No |
| 2016-07-09 | 2016-12-30 | 5.72 | 5.72 | No |
| 2016-12-30 | 2017-11-04 | 10.15 | 10.15 | No |
| 2017-11-04 | 2018-08-04 | 8.97 | 8.97 | No |
| 2018-08-04 | 2019-01-19 | 5.52 | 5.52 | No |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **16** fights. Severity: **2.13**. Frequency: **1.22**. Prime-volume floor: **1.75**. Pre-division magnitude: **3.35**. Division discount: **0.0%**. Final penalty: **-3.35**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Base | Finish extra | Raw event | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2011-12-03 | John Dodson | pre-prime | top-ten | home | Yes | Yes | -1.25 | -0.75 | -2 | standard rule |
| 2013-10-09 | Raphael Assuncao | pre-prime | top-five | home | No | Yes | -0.75 | 0 | -0.75 | standard rule |
| 2016-01-17 | Dominick Cruz | prime | champion-level | home | No | Yes | -1.5 | 0 | -1.5 | standard rule |
| 2019-01-19 | Henry Cejudo | prime | champion-level | downward | Yes | Yes | -1.5 | -0.75 | -2.25 | prime-downward-elite |
| 2022-10-22 | Aljamain Sterling | post-prime | champion-level | home | Yes | Yes | 0 | 0 | 0 | standard rule |

#### Division-strength context

Default division key: **modern-bantamweight-1.00**. Era-ledger division multiplier: **1**. Division-era modifier: **-1.33**.

Barao I through Cejudo.

#### Key judgment calls

- **Barao upset:** The first Barao win is the championship anchor and one of the great UFC title upsets.
- **Garbrandt rivalry:** Two knockout title wins over Cody are huge for the championship case.
- **Cruz loss:** A close title loss, but it blocks a cleaner all-time bantamweight reign argument.
- **Sandhagen win:** Counts as a major longevity/quality win, with disputed-scorecard context.
- **EPO:** The title résumé is real, but the legacy ceiling is capped by the suspension.

#### Why ranked here

Dillashaw ranks here because the UFC-only résumé has serious championship weight: two bantamweight title reigns, five UFC title-fight wins, title finishes over Renan Barao, Joe Soto, and Cody Garbrandt, plus elite wins over Cory Sandhagen, Raphael Assuncao, and John Lineker.

#### Why not ranked higher?

He does not rank higher because the résumé is permanently clouded by the EPO suspension and vacated belt, the Dominick Cruz loss cost him a cleaner reign, the Cejudo flyweight loss was ugly, and the Sterling fight ended with major shoulder-injury context.

#### Compare-mode guidance

- **Best counterargument:** Dillashaw’s counterargument is that his best title performances are more dominant and more violent than many cleaner champions in this range.
- **Why this résumé can still win:** Dillashaw wins comparisons when title-fight wins, peak performance, and bantamweight finishing dominance matter more than clean legacy optics.

#### Final takeaway

Dillashaw is a top-20-ish UFC-only case because five title-fight wins are hard to ignore. The problem is not talent or peak; it is the EPO cloud and the way the ending keeps the résumé from feeling clean.

_Ledger verified through 2026-07-13. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

### 20. Merab Dvalishvili — 90 OVR

The modern bantamweight pace engine: relentless pressure, elite contender depth, and a title case built in one of the sport’s toughest divisions.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 53.66 | 14-3 | Bantamweight | 4 | 3.85 | 8 | 8-1 | 77.8% | 4.8 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 7.94 | 35 | 9.26 |
| Opponent Quality | 19.6 | 25 | 16.33 |
| Prime Dominance | 22.06 | 30 | 22.06 |
| Longevity | 12.96 | 10 | 4.32 |

Base score: **51.97**. Modifiers: Apex **+4.3**, Loss Penalty **-2.59**, Division-Era Depth **-0.02**. Final raw score: **53.66**.

OVR conversion: 18.68–101.92 board anchors, normalized score **0.420231**, curved score **0.478591**, resulting in **90 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 7.94 | #21 | 3.85 adjusted credit / 14.54 benchmark |
| Opponent Quality | 19.6 | #30 | 9.21 diminished credit / 14.1 benchmark |
| Prime Dominance | 22.06 | #20 | 22.06 raw × 100.0% sample |
| Longevity | 12.96 | #35 | 62.21 counted elite months |
| Apex | +4.3 | Modifier | Consecutive elite championship wins deserve stronger Proof and a modestly higher Claim and Aura, while the later Petr Yan loss prevents a higher tier. |
| Loss Penalty | -2.59 | Modifier | 3 official/technical loss events reviewed |
| Division-Era Depth | -0.02 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **4**. Adjusted title wins: **3.85**. Derived undisputed-title win count: **4**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 2024-09-14 | Sean O'Malley | normal | 1 | 1 | 1 | locked |
| 2025-01-18 | Umar Nurmagomedov | normal | 1 | 0.95 | 0.95 | Current-table elite defense. |
| 2025-06-07 | Sean O'Malley | normal | 1 | 0.95 | 0.95 | Current-table rematch defense. |
| 2025-10-04 | Cory Sandhagen | normal | 1 | 0.95 | 0.95 | Current-table title defense. |

#### Opponent Quality receipts

Raw win credit: **10.4**. Diminishing-return credit before fighter adjustment: **9.21**. Fighter adjustment: **0**. Final diminished credit: **9.21**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2024-09-14 | Sean O'Malley | champion-level | 1.25 | 1 | 1.25 | UFC bantamweight champion and elite title opponent. |
| 2 | 2022-08-20 | Jose Aldo | top-five | 1 | 1 | 1 | All-time great and ranked bantamweight contender. |
| 3 | 2023-03-11 | Petr Yan | top-five | 1 | 1 | 1 | Elite former bantamweight champion. |
| 4 | 2025-01-18 | Umar Nurmagomedov | top-five | 1 | 1 | 1 | Elite top-five bantamweight contender. |
| 5 | 2025-10-04 | Cory Sandhagen | top-five | 1 | 1 | 1 | Elite top-five bantamweight contender. |
| 6 | 2025-06-07 | Sean O'Malley | top-five | 0.9 | 1 | 0.9 | Elite championship rematch win with a modest repeat-opponent discount. |
| 7 | 2024-02-17 | Henry Cejudo | top-five | 0.85 | 0.75 | 0.64 | Elite former two-division champion, discounted for age, long layoff, and comeback timing. |
| 8 | 2021-09-25 | Marlon Moraes | top-ten | 0.7 | 0.75 | 0.53 | Former title challenger, discounted for the clear late-career decline entering the fight. |
| 9 | 2020-08-15 | John Dodson | ranked | 0.65 | 0.75 | 0.49 | Quality bantamweight/flyweight contender name. |
| 10 | 2021-05-01 | Cody Stamann | ranked | 0.65 | 0.75 | 0.49 | Ranked-quality bantamweight win. |
| 11 | 2019-05-04 | Brad Katona | solid | 0.45 | 0.75 | 0.34 | Approved supporting UFC win treatment. |
| 12 | 2020-02-15 | Casey Kenney | solid | 0.45 | 0.75 | 0.34 | Solid bantamweight win. |
| 13 | 2018-09-15 | Terrion Ware | name-value | 0.25 | 0.5 | 0.13 | Low-end UFC quality value. |
| 14 | 2020-06-13 | Gustavo Lopez | name-value | 0.25 | 0.5 | 0.13 | Low-end UFC quality value. |

#### Prime Dominance receipts

Prime window: **Marlon Moraes → Current title-level form**. Prime record: **8-1**. Effective samples: **9**. Sample multiplier: **100.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 8 | 8-1; 88.9% |
| Round control | 7 | 77.8%; rounds 28-8 |
| Finish pressure | 1 | 2 finishes; 22.2% |
| Elite-level validation | 6.06 | 9 elite-stage fights; 6.06 points |
| Raw prime score | 22.06 | Before sample multiplier |
| Final Prime Dominance | 22.06 | 22.06 × 1 |

#### Longevity receipts

Active elite years: **4.8**. Raw calendar months: **57.6**. Gap-adjusted months: **57.6**. Status multiplier: **1.08**. Division multiplier: **1**. Counted elite months: **62.21**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 2021-09-25 | 2022-08-20 | 10.81 | 10.81 | No |
| 2022-08-20 | 2023-03-11 | 6.67 | 6.67 | No |
| 2023-03-11 | 2024-02-17 | 11.27 | 11.27 | No |
| 2024-02-17 | 2024-09-14 | 6.9 | 6.9 | No |
| 2024-09-14 | 2025-01-18 | 4.14 | 4.14 | No |
| 2025-01-18 | 2025-06-07 | 4.6 | 4.6 | No |
| 2025-06-07 | 2025-10-04 | 3.91 | 3.91 | No |
| 2025-10-04 | 2025-12-06 | 2.07 | 2.07 | No |
| 2025-12-06 | 2026-07-13 | 7.2 | 7.2 | No |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **17** fights. Severity: **1.75**. Frequency: **0.84**. Prime-volume floor: **0.75**. Pre-division magnitude: **2.59**. Division discount: **0.0%**. Final penalty: **-2.59**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Base | Finish extra | Raw event | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2017-12-09 | Frankie Saenz | pre-prime | solid | home | No | Yes | -1.25 | 0 | -1.25 | standard rule |
| 2018-04-21 | Ricky Simon | pre-prime | solid | home | Yes | Yes | -1.25 | -0.75 | -2 | standard rule |
| 2025-12-06 | Petr Yan | prime | top-five | home | No | Yes | -1.5 | 0 | -1.5 | standard rule |

#### Division-strength context

Default division key: **modern-bantamweight-1.00**. Era-ledger division multiplier: **1**. Division-era modifier: **-0.02**.

Moraes through current title-level form.

#### Key judgment calls

- **Modern bantamweight strength:** raises the value of the opponent-quality case.
- **Pace dominance:** is the core of the prime-dominance argument.
- **Yan rivalry:** needs split-series context rather than a simple one-way read.
- **Championship volume:** is still building compared with older champions.
- **Finish rate:** is not the point of the case; control and schedule strength are.

#### Why ranked here

Merab ranks here because his modern bantamweight run has serious depth. The pace, wrestling volume, and quality wins in a strong division give him one of the best active-era cases outside the top tier.

#### Why not ranked higher?

He does not rank higher because the title run is still newer than the long-reign champions, and the Yan rematch/split rivalry keeps the case from being cleanly separated.

#### Compare-mode guidance

- **Best counterargument:** Merab’s argument is depth and pace. Even with Yan context, the broader modern bantamweight schedule makes his case stronger than a simple title-loss read suggests.
- **Why this résumé can still win:** Merab wins comparisons when modern division depth, pace, wrestling control, and active elite consistency matter most.

#### Final takeaway

Merab is the modern bantamweight pace case: deep, exhausting, and elite, with the ceiling tied to how much more title volume he adds.

_Ledger verified through 2026-07-13. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

### 21. Frankie Edgar — 90 OVR

The toughness-and-longevity case: UFC lightweight gold, legendary title fights, elite featherweight wins, and enough late-career losses to keep the ceiling capped.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 53.52 | 18-11-1 | Lightweight / Featherweight / Bantamweight | 3 | 2.85 | 9 | 13-6-1 | 68.0% | 10.18 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 5.88 | 35 | 6.86 |
| Opponent Quality | 23.83 | 25 | 19.86 |
| Prime Dominance | 19.51 | 30 | 19.51 |
| Longevity | 26.99 | 10 | 9 |

Base score: **55.23**. Modifiers: Apex **+4.21**, Loss Penalty **-4.51**, Division-Era Depth **-1.41**. Final raw score: **53.52**.

OVR conversion: 18.68–101.92 board anchors, normalized score **0.418549**, curved score **0.476962**, resulting in **90 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 5.88 | #34 | 2.85 adjusted credit / 14.54 benchmark |
| Opponent Quality | 23.83 | #10 | 11.2 diminished credit / 14.1 benchmark |
| Prime Dominance | 19.51 | #36 | 19.51 raw × 100.0% sample |
| Longevity | 26.99 | #4 | 129.54 counted elite months |
| Apex | +4.21 | Modifier | Lightweight title apex with Penn/Maynard proof. |
| Loss Penalty | -4.51 | Modifier | 11 official/technical loss events reviewed |
| Division-Era Depth | -1.41 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **3**. Adjusted title wins: **2.85**. Derived undisputed-title win count: **3**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 2010-04-10 | B.J. Penn | normal | 1 | 0.95 | 0.95 | locked |
| 2010-08-28 | B.J. Penn | normal | 1 | 0.95 | 0.95 | locked |
| 2011-10-08 | Gray Maynard | normal | 1 | 0.95 | 0.95 | locked |

#### Opponent Quality receipts

Raw win credit: **13.65**. Diminishing-return credit before fighter adjustment: **11.2**. Fighter adjustment: **0**. Final diminished credit: **11.2**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2010-04-10 | B.J. Penn | champion-level | 1.25 | 1 | 1.25 | Won the UFC lightweight title from an elite reigning champion. |
| 2 | 2010-08-28 | B.J. Penn | champion-level | 1.15 | 1 | 1.15 | Immediate dominant confirmation over the same champion-level opponent; slight repeat discount. |
| 3 | 2011-10-08 | Gray Maynard | top-five | 1 | 1 | 1 | Elite lightweight rival and title challenger. |
| 4 | 2014-07-06 | B.J. Penn | top-five | 1 | 1 | 1 | Third UFC win over an elite former champion, timing-adjusted. |
| 5 | 2014-11-22 | Cub Swanson | top-five | 1 | 1 | 1 | High-end featherweight contender in a title-eliminator-level matchup. |
| 6 | 2015-12-11 | Chad Mendes | top-five | 1 | 1 | 1 | Elite featherweight contender stopped in the first round. |
| 7 | 2007-11-17 | Spencer Fisher | top-ten | 0.85 | 0.75 | 0.64 | Strong ranked lightweight win. |
| 8 | 2009-05-23 | Sean Sherk | top-ten | 0.85 | 0.75 | 0.64 | Former UFC lightweight champion and still a strong ranked opponent. |
| 9 | 2017-05-13 | Yair Rodriguez | top-ten | 0.85 | 0.75 | 0.64 | Rising ranked featherweight contender at the time of the win. |
| 10 | 2020-08-22 | Pedro Munhoz | top-ten | 0.85 | 0.75 | 0.64 | Highly ranked bantamweight win late in Edgar’s career; close split-decision context noted. |
| 11 | 2007-02-03 | Tyson Griffin | ranked | 0.65 | 0.75 | 0.49 | Excellent early lightweight win, but before either fighter had established title-level standing. |
| 12 | 2015-05-16 | Urijah Faber | ranked | 0.65 | 0.75 | 0.49 | Elite lighter-weight name, discounted for one-off featherweight timing. |
| 13 | 2016-11-12 | Jeremy Stephens | ranked | 0.65 | 0.5 | 0.33 | Dangerous ranked featherweight contender. |
| 14 | 2007-07-07 | Mark Bocek | solid | 0.45 | 0.5 | 0.23 | Approved supporting UFC win treatment. |
| 15 | 2008-07-19 | Hermes França | solid | 0.45 | 0.5 | 0.23 | Former title challenger name, but timing and layoff context limit the credit. |
| 16 | 2013-07-06 | Charles Oliveira | solid | 0.45 | 0.5 | 0.23 | Quality 2013 featherweight win; future championship success is not back-credited. |
| 17 | 2018-04-21 | Cub Swanson | solid | 0.45 | 0.5 | 0.23 | Useful rematch win with later-career timing and less contender value than the first meeting. |
| 18 | 2009-12-05 | Matt Veach | minimal | 0.1 | 0.5 | 0.05 | Comeback finish over a lightly proven UFC opponent. |

#### Prime Dominance receipts

Prime window: **Sean Sherk → Max Holloway**. Prime record: **13-6-1**. Effective samples: **20**. Sample multiplier: **100.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 6.08 | 13-6-1; 67.5% |
| Round control | 6.12 | 68.0%; rounds 51-24 |
| Finish pressure | 2 | 6 finishes; 30.0% |
| Elite-level validation | 5.31 | 16 elite-stage fights; 5.31 points |
| Raw prime score | 19.51 | Before sample multiplier |
| Final Prime Dominance | 19.51 | 19.51 × 1 |

#### Longevity receipts

Active elite years: **10.18**. Raw calendar months: **122.1**. Gap-adjusted months: **122.1**. Status multiplier: **1.03**. Division multiplier: **1.03**. Counted elite months: **129.54**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 2009-05-23 | 2009-12-05 | 6.44 | 6.44 | No |
| 2009-12-05 | 2010-04-10 | 4.14 | 4.14 | No |
| 2010-04-10 | 2010-08-28 | 4.6 | 4.6 | No |
| 2010-08-28 | 2011-01-01 | 4.14 | 4.14 | No |
| 2011-01-01 | 2011-10-08 | 9.2 | 9.2 | No |
| 2011-10-08 | 2012-02-26 | 4.63 | 4.63 | No |
| 2012-02-26 | 2012-08-11 | 5.49 | 5.49 | No |
| 2012-08-11 | 2013-02-02 | 5.75 | 5.75 | No |
| 2013-02-02 | 2013-07-06 | 5.06 | 5.06 | No |
| 2013-07-06 | 2014-07-06 | 11.99 | 11.99 | No |
| 2014-07-06 | 2014-11-22 | 4.57 | 4.57 | No |
| 2014-11-22 | 2015-05-16 | 5.75 | 5.75 | No |
| 2015-05-16 | 2015-12-11 | 6.87 | 6.87 | No |
| 2015-12-11 | 2016-07-09 | 6.93 | 6.93 | No |
| 2016-07-09 | 2016-11-12 | 4.14 | 4.14 | No |
| 2016-11-12 | 2017-05-13 | 5.98 | 5.98 | No |
| 2017-05-13 | 2018-03-03 | 9.66 | 9.66 | No |
| 2018-03-03 | 2018-04-21 | 1.61 | 1.61 | No |
| 2018-04-21 | 2019-07-27 | 15.18 | 15.18 | No |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **25** fights. Severity: **1.88**. Frequency: **1.26**. Prime-volume floor: **4.75**. Pre-division magnitude: **4.75**. Division discount: **5.0%**. Final penalty: **-4.51**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Base | Finish extra | Raw event | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2008-04-02 | Gray Maynard | pre-prime | top-five | home | No | Yes | -0.75 | 0 | -0.75 | standard rule |
| 2012-02-26 | Benson Henderson | prime | champion-level | home | No | Yes | -1.5 | 0 | -1.5 | standard rule |
| 2012-08-11 | Benson Henderson | prime | champion-level | home | No | Yes | -1.5 | 0 | -1.5 | standard rule |
| 2013-02-02 | Jose Aldo | prime | champion-level | downward | No | Yes | -1.5 | 0 | -1.5 | standard rule |
| 2016-07-09 | Jose Aldo | prime | champion-level | home | No | Yes | -1.5 | 0 | -1.5 | standard rule |
| 2018-03-03 | Brian Ortega | prime | top-five | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2019-07-27 | Max Holloway | prime | champion-level | home | No | Yes | -1.5 | 0 | -1.5 | standard rule |
| 2019-12-21 | Chan Sung Jung | post-prime | top-five | home | Yes | Yes | 0 | 0 | 0 | standard rule |
| 2021-02-06 | Cory Sandhagen | post-prime | top-five | home | Yes | Yes | 0 | 0 | 0 | standard rule |
| 2021-11-06 | Marlon Vera | post-prime | top-ten | home | Yes | Yes | 0 | 0 | 0 | standard rule |
| 2022-11-12 | Chris Gutiérrez | post-prime | top-ten | home | Yes | Yes | 0 | 0 | 0 | standard rule |

#### Division-strength context

Default division key: **edgar-lightweight-featherweight-1.03**. Era-ledger division multiplier: **1.03**. Division-era modifier: **-1.41**.

Sherk through Holloway.

#### Key judgment calls

- **B.J. Penn rivalry:** Penn wins are the championship anchor, even with debate around the first decision.
- **Maynard trilogy:** draw plus comeback title defense adds real title-reign context, but the draw is not scored as a win.
- **Featherweight run:** Aldo losses hurt, but Mendes, Cub, and Faber keep the second-act case strong.
- **Durability:** Edgar’s not-finished aura matters, but Ortega and Yair still count in the prime window.
- **Late losses:** Sandhagen, Vera, Gutierrez, Zombie-type late results are mostly post-prime drag, not the core case.

#### Why ranked here

Edgar ranks here because his UFC-only résumé has real championship value, rare three-division relevance, and a deep quality-win ledger built around B.J. Penn, Gray Maynard, Chad Mendes, Cub Swanson, Charles Oliveira, Urijah Faber, Sean Sherk, Jeremy Stephens, and Tyson Griffin.

#### Why not ranked higher?

He does not rank higher because the official loss column is heavy, his title reign was not long enough to match the top champions, and his prime dominance is more about grit, pace, and durability than overwhelming separation.

#### Compare-mode guidance

- **Best counterargument:** Edgar’s counterargument is simple: his record looks worse than his actual career because he spent years fighting elite and larger opponents across divisions.
- **Why this résumé can still win:** Edgar wins comparisons when title grit, schedule depth, three-division relevance, and elite longevity matter more than clean dominance.

#### Final takeaway

Edgar is a classic UFC-only résumé fighter: not a top-tier GOAT case, but a former lightweight champion with elite longevity, real quality wins, and one of the most respected toughness profiles in UFC history.

_Ledger verified through 2026-07-13. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

### 22. Francis Ngannou — 90 OVR

The heavyweight terror case: historic power, Stipe title value, Gane defense value, and a UFC run capped before long-reign volume.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 51.59 | 12-2 | Heavyweight | 2 | 1.9 | 7 | 6-0 | 81.8% | 3.16 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 3.92 | 35 | 4.57 |
| Opponent Quality | 17.26 | 25 | 14.38 |
| Prime Dominance | 25.42 | 30 | 25.42 |
| Longevity | 8.19 | 10 | 2.73 |

Base score: **47.1**. Modifiers: Apex **+5.65**, Loss Penalty **-1.07**, Division-Era Depth **-0.09**. Final raw score: **51.59**.

OVR conversion: 18.68–101.92 board anchors, normalized score **0.395363**, curved score **0.454408**, resulting in **90 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 3.92 | #47 | 1.9 adjusted credit / 14.54 benchmark |
| Opponent Quality | 17.26 | #41 | 8.11 diminished credit / 14.1 benchmark |
| Prime Dominance | 25.42 | #6 | 26.76 raw × 95.0% sample |
| Longevity | 8.19 | #57 | 39.29 counted elite months |
| Apex | +5.65 | Modifier | Terrifying heavyweight apex with evolved title-fight proof. |
| Loss Penalty | -1.07 | Modifier | 2 official/technical loss events reviewed |
| Division-Era Depth | -0.09 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **2**. Adjusted title wins: **1.9**. Derived undisputed-title win count: **2**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 2021-03-27 | Stipe Miocic | normal | 1 | 0.95 | 0.95 | locked |
| 2022-01-22 | Ciryl Gane | normal | 1 | 0.95 | 0.95 | locked |

#### Opponent Quality receipts

Raw win credit: **8.85**. Diminishing-return credit before fighter adjustment: **8.11**. Fighter adjustment: **0**. Final diminished credit: **8.11**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2021-03-27 | Stipe Miocic | champion-level | 1.25 | 1 | 1.25 | Elite UFC heavyweight champion. |
| 2 | 2022-01-22 | Ciryl Gane | champion-level | 1.25 | 1 | 1.25 | Undefeated interim champion and elite heavyweight title opponent. |
| 3 | 2016-04-10 | Curtis Blaydes | top-ten | 0.85 | 1 | 0.85 | Strong ranked heavyweight contender. |
| 4 | 2017-12-02 | Alistair Overeem | top-ten | 0.85 | 1 | 0.85 | Elite heavyweight name, timing adjusted. |
| 5 | 2019-06-29 | Junior dos Santos | top-ten | 0.85 | 1 | 0.85 | Former UFC champion, later-career timing. |
| 6 | 2020-05-09 | Jairzinho Rozenstruik | top-ten | 0.85 | 1 | 0.85 | Undefeated ranked heavyweight contender. |
| 7 | 2017-01-28 | Andrei Arlovski | ranked | 0.65 | 0.75 | 0.49 | Former champion name, late-career value. |
| 8 | 2018-11-24 | Curtis Blaydes | ranked | 0.65 | 0.75 | 0.49 | Early win over future ranked contender. |
| 9 | 2019-02-17 | Cain Velasquez | ranked | 0.65 | 0.75 | 0.49 | All-time heavyweight name, but late-career timing. |
| 10 | 2015-12-19 | Luis Henrique | solid | 0.45 | 0.75 | 0.34 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 11 | 2016-12-09 | Anthony Hamilton | solid | 0.45 | 0.75 | 0.34 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 12 | 2016-07-23 | Bojan Mihajlovic | minimal | 0.1 | 0.75 | 0.07 | Minimal UFC quality value. |

#### Prime Dominance receipts

Prime window: **Curtis Blaydes II → Ciryl Gane**. Prime record: **6-0**. Effective samples: **6**. Sample multiplier: **95.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 9 | 6-0; 100.0% |
| Round control | 7.36 | 81.8%; rounds 9-2 |
| Finish pressure | 4.5 | 5 finishes; 83.3% |
| Elite-level validation | 5.9 | 6 elite-stage fights; 5.9 points |
| Raw prime score | 26.76 | Before sample multiplier |
| Final Prime Dominance | 25.42 | 26.76 × 0.95 |

#### Longevity receipts

Active elite years: **3.16**. Raw calendar months: **37.9**. Gap-adjusted months: **37.9**. Status multiplier: **1.08**. Division multiplier: **0.96**. Counted elite months: **39.29**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 2018-11-24 | 2019-02-17 | 2.79 | 2.79 | No |
| 2019-02-17 | 2019-06-29 | 4.34 | 4.34 | No |
| 2019-06-29 | 2020-05-09 | 10.35 | 10.35 | No |
| 2020-05-09 | 2021-03-27 | 10.58 | 10.58 | No |
| 2021-03-27 | 2022-01-22 | 9.89 | 9.89 | No |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **14** fights. Severity: **0.75**. Frequency: **0.32**. Prime-volume floor: **0**. Pre-division magnitude: **1.07**. Division discount: **0.0%**. Final penalty: **-1.07**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Base | Finish extra | Raw event | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2018-01-20 | Stipe Miocic | pre-prime | champion-level | home | No | Yes | -0.75 | 0 | -0.75 | standard rule |
| 2018-07-07 | Derrick Lewis | pre-prime | top-five | home | No | Yes | -0.75 | 0 | -0.75 | standard rule |

#### Division-strength context

Default division key: **modern-heavyweight-0.96**. Era-ledger division multiplier: **0.96**. Division-era modifier: **-0.09**.

Blaydes II through Gane.

#### Key judgment calls

- **Stipe split:** Ngannou gets huge credit for the title knockout, but Stipe has the deeper full heavyweight case.
- **Gane defense:** important because it showed a more complete championship skill set.
- **Power aura:** central to the prime-dominance argument.
- **UFC exit:** caps longevity and championship volume in this ranking.
- **Heavyweight context:** volatility is acknowledged while still rewarding the title peak.

#### Why ranked here

Ngannou ranks here because his peak danger and heavyweight title wins are massive. The Stipe knockout and Gane defense give him real championship value, while his finishing threat makes the prime-dominance case unusually strong.

#### Why not ranked higher?

He does not rank higher because the UFC title volume is short. The exit from the UFC capped the long-reign case, and Stipe still has the stronger full UFC heavyweight resume.

#### Compare-mode guidance

- **Best counterargument:** The argument against Ngannou is title volume. His peak danger is obvious, but he does not have the long UFC championship run of the top heavyweight resume case.
- **Why this résumé can still win:** Ngannou wins comparisons when peak danger, heavyweight finishing power, and the Stipe title win matter more than long reign volume.

#### Final takeaway

Ngannou is the heavyweight power-aura champion: terrifying, historically dangerous, and title-proven, but short on the UFC volume needed to climb higher.

_Ledger verified through 2026-07-13. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

### 23. Cain Velasquez — 90 OVR

The heavyweight pressure machine: elite pace, wrestling, cardio, and one of the best primes in UFC heavyweight history.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 50.52 | 12-3 | Heavyweight | 4 | 3.8 | 6 | 6-2 | 83.3% | 5.16 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 7.84 | 35 | 9.15 |
| Opponent Quality | 17.26 | 25 | 14.38 |
| Prime Dominance | 22.43 | 30 | 22.43 |
| Longevity | 11.86 | 10 | 3.95 |

Base score: **49.91**. Modifiers: Apex **+5.45**, Loss Penalty **-3.29**, Division-Era Depth **-1.55**. Final raw score: **50.52**.

OVR conversion: 18.68–101.92 board anchors, normalized score **0.382508**, curved score **0.441819**, resulting in **90 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 7.84 | #22 | 3.8 adjusted credit / 14.54 benchmark |
| Opponent Quality | 17.26 | #41 | 8.11 diminished credit / 14.1 benchmark |
| Prime Dominance | 22.43 | #19 | 22.43 raw × 100.0% sample |
| Longevity | 11.86 | #42 | 56.92 counted elite months |
| Apex | +5.45 | Modifier | Two prolonged dominant wins over a prime elite champion represent a genuine all-time heavyweight Apex. |
| Loss Penalty | -3.29 | Modifier | 3 official/technical loss events reviewed |
| Division-Era Depth | -1.55 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **4**. Adjusted title wins: **3.8**. Derived undisputed-title win count: **4**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 2010-10-23 | Brock Lesnar | normal | 1 | 1 | 1 | locked |
| 2012-12-29 | Junior dos Santos | normal | 1 | 1 | 1 | locked |
| 2013-05-25 | Antonio Silva | normal | 1 | 0.85 | 0.85 | locked |
| 2013-10-19 | Junior dos Santos | normal | 1 | 0.95 | 0.95 | locked |

#### Opponent Quality receipts

Raw win credit: **8.8**. Diminishing-return credit before fighter adjustment: **8.11**. Fighter adjustment: **0**. Final diminished credit: **8.11**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2012-12-29 | Junior dos Santos | champion-level | 1.25 | 1 | 1.25 | Elite UFC heavyweight champion-level opponent. |
| 2 | 2013-10-19 | Junior dos Santos | champion-level | 1.25 | 1 | 1.25 | Repeat win over elite champion-level heavyweight. |
| 3 | 2010-10-23 | Brock Lesnar | top-five | 1 | 1 | 1 | UFC heavyweight champion, high-profile but limited-depth champion context. |
| 4 | 2010-02-20 | Antonio Rodrigo Nogueira | top-ten | 0.85 | 1 | 0.85 | All-time name, UFC/timing context keeps below max. |
| 5 | 2012-05-26 | Antonio Silva | top-ten | 0.85 | 1 | 0.85 | Relevant heavyweight contender. |
| 6 | 2013-05-25 | Antonio Silva | top-ten | 0.85 | 1 | 0.85 | Repeat contender win, slightly inflated by matchup dominance but no bonus. |
| 7 | 2016-07-09 | Travis Browne | top-ten | 0.85 | 0.75 | 0.64 | Strong ranked heavyweight contender. |
| 8 | 2009-06-13 | Cheick Kongo | ranked | 0.65 | 0.75 | 0.49 | Quality heavyweight contender win. |
| 9 | 2009-10-24 | Ben Rothwell | ranked | 0.65 | 0.75 | 0.49 | Quality heavyweight veteran win. |
| 10 | 2008-07-19 | Jake O'Brien | name-value | 0.25 | 0.75 | 0.19 | Low UFC quality value. |
| 11 | 2009-02-07 | Denis Stojnic | name-value | 0.25 | 0.75 | 0.19 | Low UFC quality value. |
| 12 | 2008-04-19 | Brad Morris | minimal | 0.1 | 0.75 | 0.07 | Minimal UFC quality value. |

#### Prime Dominance receipts

Prime window: **Brock Lesnar → Fabricio Werdum**. Prime record: **6-2**. Effective samples: **7**. Sample multiplier: **100.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 6.43 | 5-2; 71.4% |
| Round control | 7.41 | 82.3%; rounds 14-3 |
| Finish pressure | 3 | 4 finishes; 57.1% |
| Elite-level validation | 5.59 | 7 elite-stage fights; 5.59 points |
| Raw prime score | 22.43 | Before sample multiplier |
| Final Prime Dominance | 22.43 | 22.43 × 1 |

#### Longevity receipts

Active elite years: **5.16**. Raw calendar months: **55.7**. Gap-adjusted months: **53.9**. Status multiplier: **1.1**. Division multiplier: **0.96**. Counted elite months: **56.92**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 2010-10-23 | 2011-11-12 | 12.65 | 12.65 | No |
| 2011-11-12 | 2012-05-26 | 6.44 | 6.44 | No |
| 2012-05-26 | 2012-12-29 | 7.13 | 7.13 | No |
| 2012-12-29 | 2013-05-25 | 4.83 | 4.83 | No |
| 2013-05-25 | 2013-10-19 | 4.83 | 4.83 | No |
| 2013-10-19 | 2015-06-13 | 19.78 | 18 | Yes |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **13** fights. Severity: **2.25**. Frequency: **1.04**. Prime-volume floor: **2**. Pre-division magnitude: **3.29**. Division discount: **0.0%**. Final penalty: **-3.29**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Base | Finish extra | Raw event | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2011-11-12 | Junior dos Santos | prime | top-five | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2015-06-13 | Fabricio Werdum | prime | top-five | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2019-02-17 | Francis Ngannou | post-prime | top-five | home | Yes | Yes | 0 | 0 | 0 | standard rule |

#### Division-strength context

Default division key: **cain-heavyweight-1.0**. Era-ledger division multiplier: **0.96**. Division-era modifier: **-1.55**.

Brock through Werdum.

#### Key judgment calls

- **Prime dominance:** the main reason Cain stays this high despite a shorter resume.
- **Heavyweight context:** volatility matters, but his peak was genuinely elite.
- **JDS rivalry:** Cain won the trilogy and that carries major heavyweight value.
- **Injuries:** limit longevity and title-volume credit.
- **Werdum loss:** is real prime/back-end drag and keeps the ending from feeling clean.

#### Why ranked here

Cain ranks here because his prime dominance at heavyweight was exceptional. His pace, wrestling pressure, and cardio made him one of the most overwhelming heavyweights ever during his best window.

#### Why not ranked higher?

He does not rank higher because the UFC resume is thin compared with the deeper champions. Injuries, limited title volume, and key losses to dos Santos and Werdum keep his all-time case below Stipe and the broader top tier.

#### Compare-mode guidance

- **Best counterargument:** Cain’s argument is peak. If the debate is who looked like the most overwhelming heavyweight at his best, Cain has one of the strongest lanes.
- **Why this résumé can still win:** Cain wins comparisons when peak pressure, heavyweight dominance, and the JDS trilogy matter more than title-volume depth.

#### Final takeaway

Cain is the heavyweight peak-pressure case: outstanding at his best, but held back by injuries, shorter title volume, and a thinner total UFC resume than Stipe.

_Ledger verified through 2026-07-13. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

### 24. Benson Henderson — 90 OVR

A decision-heavy lightweight champion whose four UFC title-fight wins and seven Top-5 victories give him one of the division’s deepest UFC-only ledgers.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 50.49 | 11-3 | Lightweight / Welterweight | 4 | 3.66 | 7 | 10-3 | 67.3% | 4.29 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 7.55 | 35 | 8.81 |
| Opponent Quality | 21.38 | 25 | 17.82 |
| Prime Dominance | 19.38 | 30 | 19.38 |
| Longevity | 11.83 | 10 | 3.94 |

Base score: **49.95**. Modifiers: Apex **+4.58**, Loss Penalty **-3.26**, Division-Era Depth **-0.78**. Final raw score: **50.49**.

OVR conversion: 18.68–101.92 board anchors, normalized score **0.382148**, curved score **0.441466**, resulting in **90 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 7.55 | #25 | 3.66 adjusted credit / 14.54 benchmark |
| Opponent Quality | 21.38 | #22 | 10.05 diminished credit / 14.1 benchmark |
| Prime Dominance | 19.38 | #37 | 19.38 raw × 100.0% sample |
| Longevity | 11.83 | #43 | 56.78 counted elite months |
| Apex | +4.58 | Modifier | A championship-winning peak with strong proof and separation, but below the highest all-time best-fighter and aura tier. |
| Loss Penalty | -3.26 | Modifier | 3 official/technical loss events reviewed |
| Division-Era Depth | -0.78 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **4**. Adjusted title wins: **3.66**. Derived undisputed-title win count: **4**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 2012-02-26 | Frankie Edgar | normal | 1 | 1 | 1 | Approved aggregate Championship score recovered from the live control; exact historical per-fight split was not stored. |
| 2012-08-11 | Frankie Edgar | normal | 1 | 0.95 | 0.95 | Approved aggregate Championship score recovered from the live control; exact historical per-fight split was not stored. |
| 2012-12-08 | Nate Diaz | normal | 1 | 0.85 | 0.85 | Approved aggregate Championship score recovered from the live control; exact historical per-fight split was not stored. |
| 2013-04-20 | Gilbert Melendez | normal | 1 | 0.85 | 0.85 | Approved aggregate Championship score recovered from the live control; exact historical per-fight split was not stored. |

#### Opponent Quality receipts

Raw win credit: **11.15**. Diminishing-return credit before fighter adjustment: **10.05**. Fighter adjustment: **0**. Final diminished credit: **10.05**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2012-02-26 | Frankie Edgar | champion-level | 1.25 | 1 | 1.25 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 2 | 2012-08-11 | Frankie Edgar | champion-level | 1.25 | 1 | 1.25 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 3 | 2013-04-20 | Gilbert Melendez | champion-level | 1.25 | 1 | 1.25 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 4 | 2011-08-14 | Jim Miller | top-five | 1 | 1 | 1 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 5 | 2011-11-12 | Clay Guida | top-five | 1 | 1 | 1 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 6 | 2012-12-08 | Nate Diaz | top-five | 1 | 1 | 1 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 7 | 2014-01-25 | Josh Thomson | top-five | 1 | 0.75 | 0.75 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 8 | 2011-04-30 | Mark Bocek | top-ten | 0.85 | 0.75 | 0.64 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 9 | 2014-06-07 | Rustam Khabilov | top-ten | 0.85 | 0.75 | 0.64 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 10 | 2015-02-14 | Brandon Thatch | top-ten | 0.85 | 0.75 | 0.64 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 11 | 2015-11-28 | Jorge Masvidal | top-ten | 0.85 | 0.75 | 0.64 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |

#### Prime Dominance receipts

Prime window: **Jim Miller → Jorge Masvidal**. Prime record: **10-3**. Effective samples: **13**. Sample multiplier: **100.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 6.92 | 10-3; 76.9% |
| Round control | 6.06 | 67.3%; rounds 33-16 |
| Finish pressure | 1 | 2 finishes; 15.4% |
| Elite-level validation | 5.4 | 10 elite-stage fights; 5.4 points |
| Raw prime score | 19.38 | Before sample multiplier |
| Final Prime Dominance | 19.38 | 19.38 × 1 |

#### Longevity receipts

Active elite years: **4.29**. Raw calendar months: **51.5**. Gap-adjusted months: **51.5**. Status multiplier: **1.05**. Division multiplier: **1.05**. Counted elite months: **56.78**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 2011-08-14 | 2011-11-12 | 2.96 | 2.96 | No |
| 2011-11-12 | 2012-02-26 | 3.48 | 3.48 | No |
| 2012-02-26 | 2012-08-11 | 5.49 | 5.49 | No |
| 2012-08-11 | 2012-12-08 | 3.91 | 3.91 | No |
| 2012-12-08 | 2013-04-20 | 4.37 | 4.37 | No |
| 2013-04-20 | 2013-08-31 | 4.37 | 4.37 | No |
| 2013-08-31 | 2014-01-25 | 4.83 | 4.83 | No |
| 2014-01-25 | 2014-06-07 | 4.37 | 4.37 | No |
| 2014-06-07 | 2014-08-23 | 2.53 | 2.53 | No |
| 2014-08-23 | 2015-01-18 | 4.86 | 4.86 | No |
| 2015-01-18 | 2015-02-14 | 0.89 | 0.89 | No |
| 2015-02-14 | 2015-11-28 | 9.43 | 9.43 | No |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **14** fights. Severity: **2.25**. Frequency: **1.29**. Prime-volume floor: **2.75**. Pre-division magnitude: **3.54**. Division discount: **8.0%**. Final penalty: **-3.26**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Base | Finish extra | Raw event | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2013-08-31 | Anthony Pettis | prime | champion-level | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2014-08-23 | Rafael dos Anjos | prime | champion-level | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2015-01-18 | Donald Cerrone | prime | top-five | home | No | Yes | -1.5 | 0 | -1.5 | standard rule |

#### Division-strength context

Default division key: **lightweight-murderers-row-1.10**. Era-ledger division multiplier: **1.05**. Division-era modifier: **-0.78**.

Miller through Masvidal.

#### Key judgment calls

- **Prime window:** Jim Miller → Jorge Masvidal.
- **Coverage:** Complete UFC-only ledger.
- **Prime endpoint:** Masvidal closes Benson’s UFC elite window on his final UFC win.

#### Why ranked here

Henderson ranks here because his lightweight run combined real championship volume with elite opponent depth. He beat Frankie Edgar twice, defended against Nate Diaz and Gilbert Melendez, and added strong contender wins over Jim Miller and Clay Guida while winning roughly two-thirds of his tracked rounds.

#### Why not ranked higher?

He does not rank higher because the title reign was strong rather than historically dominant, his 18% UFC finish rate limits the separation case, and prime stoppage losses to Anthony Pettis and Rafael dos Anjos damaged the résumé. Several signature decisions were close enough that his dominance case trails the cleaner lightweight peaks above him.

#### Final takeaway

Henderson ranks here because his lightweight run combined real championship volume with elite opponent depth. He beat Frankie Edgar twice, defended against Nate Diaz and Gilbert Melendez, and added strong contender wins over Jim Miller and Clay Guida while winning roughly two-thirds of his tracked rounds.

_Ledger verified through 2026-07-13. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

### 25. Aljamain Sterling — 89 OVR

The awkward-but-real bantamweight résumé case: four UFC title-fight wins, wins over Yan, Cejudo, Sandhagen, and late featherweight relevance, with DQ/injury context keeping the debate spicy.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 50.21 | 19-5 | Bantamweight / Featherweight | 4 | 3.15 | 9 | 9-2 | 71.0% | 7.1 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 6.5 | 35 | 7.58 |
| Opponent Quality | 24.02 | 25 | 20.02 |
| Prime Dominance | 18.16 | 30 | 18.16 |
| Longevity | 8.64 | 10 | 2.88 |

Base score: **48.64**. Modifiers: Apex **+4.36**, Loss Penalty **-2.74**, Division-Era Depth **-0.05**. Final raw score: **50.21**.

OVR conversion: 18.68–101.92 board anchors, normalized score **0.378784**, curved score **0.438160**, resulting in **89 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 6.5 | #29 | 3.15 adjusted credit / 14.54 benchmark |
| Opponent Quality | 24.02 | #8 | 11.29 diminished credit / 14.1 benchmark |
| Prime Dominance | 18.16 | #48 | 19.12 raw × 95.0% sample |
| Longevity | 8.64 | #55 | 41.47 counted elite months |
| Apex | +4.36 | Modifier | Modern bantamweight title apex with Yan/Cejudo proof. |
| Loss Penalty | -2.74 | Modifier | 5 official/technical loss events reviewed |
| Division-Era Depth | -0.05 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **4**. Adjusted title wins: **3.15**. Derived undisputed-title win count: **4**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 2021-03-06 | Petr Yan | normal | 1 | 0.5 | 0.5 | DQ title win/weird title context; Cody locked DQ rule at 0.50. |
| 2022-04-09 | Petr Yan | normal | 1 | 0.95 | 0.95 | locked |
| 2022-10-22 | T.J. Dillashaw | normal | 1 | 0.75 | 0.75 | Injured/compromised opponent. |
| 2023-05-06 | Henry Cejudo | normal | 1 | 0.95 | 0.95 | locked |

#### Opponent Quality receipts

Raw win credit: **14**. Diminishing-return credit before fighter adjustment: **11.29**. Fighter adjustment: **0**. Final diminished credit: **11.29**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2022-04-09 | Petr Yan | champion-level | 1.25 | 1 | 1.25 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 2 | 2023-05-06 | Henry Cejudo | champion-level | 1.25 | 1 | 1.25 | Former two-division UFC champion returning, still elite. |
| 3 | 2020-06-06 | Cory Sandhagen | top-five | 1 | 1 | 1 | Elite bantamweight contender. |
| 4 | 2025-08-23 | Brian Ortega | top-five | 1 | 1 | 1 | Top-five featherweight contender. |
| 5 | 2026-04-25 | Youssef Zalal | top-five | 1 | 1 | 1 | Top-five featherweight contender in the approved app timeline. |
| 6 | 2014-09-20 | Takeya Mizugaki | top-ten | 0.85 | 1 | 0.85 | Strong ranked bantamweight win. |
| 7 | 2019-02-17 | Jimmie Rivera | top-ten | 0.85 | 0.75 | 0.64 | Strong ranked bantamweight contender. |
| 8 | 2019-06-08 | Pedro Munhoz | top-ten | 0.85 | 0.75 | 0.64 | Strong ranked bantamweight contender. |
| 9 | 2022-10-22 | T.J. Dillashaw | top-ten | 0.85 | 0.75 | 0.64 | Former champion, but injury context heavily noted. |
| 10 | 2024-04-13 | Calvin Kattar | top-ten | 0.85 | 0.75 | 0.64 | Strong ranked featherweight win. |
| 11 | 2018-04-21 | Brett Johns | ranked | 0.65 | 0.75 | 0.49 | Quality bantamweight win. |
| 12 | 2021-03-06 | Petr Yan | ranked | 0.65 | 0.75 | 0.49 | Official DQ win over an elite opponent; quality credit is capped because the result did not establish a normal competitive victory. |
| 13 | 2014-02-22 | Cody Gibson | solid | 0.45 | 0.5 | 0.23 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 14 | 2014-07-16 | Hugo Viana | solid | 0.45 | 0.5 | 0.23 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 15 | 2015-04-18 | Manny Gamburyan | solid | 0.45 | 0.5 | 0.23 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 16 | 2017-04-15 | Augusto Mendes | solid | 0.45 | 0.5 | 0.23 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 17 | 2017-07-29 | Renan Barao | solid | 0.45 | 0.5 | 0.23 | Former champion name, but late-career timing. |
| 18 | 2018-09-08 | Cody Stamann | solid | 0.45 | 0.5 | 0.23 | Solid bantamweight win. |
| 19 | 2015-12-10 | Johnny Eduardo | name-value | 0.25 | 0.25 | 0.06 | Low-end UFC quality value. |

#### Prime Dominance receipts

Prime window: **Cory Sandhagen → Sean O’Malley**. Prime record: **9-2**. Effective samples: **6**. Sample multiplier: **95.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 7.5 | 5-1; 83.3% |
| Round control | 4.74 | 52.6%; rounds 10-9 |
| Finish pressure | 2 | 2 finishes; 33.3% |
| Elite-level validation | 4.88 | 6 elite-stage fights; 4.88 points |
| Raw prime score | 19.12 | Before sample multiplier |
| Final Prime Dominance | 18.16 | 19.12 × 0.95 |

#### Longevity receipts

Active elite years: **7.1**. Raw calendar months: **38.4**. Gap-adjusted months: **38.4**. Status multiplier: **1.08**. Division multiplier: **1**. Counted elite months: **41.47**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 2020-06-06 | 2021-03-06 | 8.97 | 8.97 | No |
| 2021-03-06 | 2022-04-09 | 13.11 | 13.11 | No |
| 2022-04-09 | 2022-10-22 | 6.44 | 6.44 | No |
| 2022-10-22 | 2023-05-06 | 6.44 | 6.44 | No |
| 2023-05-06 | 2023-08-19 | 3.45 | 3.45 | No |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **20** fights. Severity: **1.88**. Frequency: **0.86**. Prime-volume floor: **1**. Pre-division magnitude: **2.74**. Division discount: **0.0%**. Final penalty: **-2.74**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Base | Finish extra | Raw event | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2016-05-29 | Bryan Caraway | pre-prime | top-ten | home | No | Yes | -1.25 | 0 | -1.25 | standard rule |
| 2017-01-28 | Raphael Assuncao | pre-prime | top-five | home | No | Yes | -0.75 | 0 | -0.75 | standard rule |
| 2017-12-09 | Marlon Moraes | pre-prime | top-five | home | Yes | Yes | -0.75 | -0.75 | -1.5 | standard rule |
| 2023-08-19 | Sean O'Malley | prime | top-five | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2024-12-07 | Movsar Evloev | post-prime | top-five | home | No | Yes | 0 | 0 | 0 | standard rule |

#### Division-strength context

Default division key: **modern-bantamweight-featherweight-1.02**. Era-ledger division multiplier: **1**. Division-era modifier: **-0.05**.

Sandhagen through O’Malley.

#### Key judgment calls

- **Yan rivalry:** Sterling owns the official UFC series and the rematch is the cleanest title anchor.
- **Cejudo defense:** A split decision over a returning Cejudo still counts as a real title defense over a former two-division champion.
- **O’Malley loss:** The title-losing finish is the biggest prime-damage item.
- **Featherweight run:** Adds relevance and longevity without becoming a new championship tier yet.
- **Style translation:** Control grappling and backpack dominance score well, even if the fan perception is polarizing.

#### Why ranked here

Sterling ranks here because the UFC-only case is bigger than the jokes around the DQ title win. He has four bantamweight title-fight wins, a real rematch win over Petr Yan, a title defense over Henry Cejudo, an elite Sandhagen submission, and useful featherweight extension wins over Calvin Kattar, Brian Ortega, and Youssef Zalal.

#### Why not ranked higher?

He does not rank higher because the championship résumé needs context. The first Yan title win came by DQ, the Dillashaw defense had major shoulder-injury context, and the Sean O’Malley finish plus Movsar Evloev loss keep him below cleaner all-time champions.

#### Compare-mode guidance

- **Best counterargument:** The counterargument against Sterling is that the résumé needs footnotes: DQ title win, injured Dillashaw, split Cejudo, and an abrupt O’Malley finish.
- **Why this résumé can still win:** Sterling wins comparisons when official title-fight wins, direct Yan series edge, modern bantamweight depth, and elite longevity matter more than clean aura.

#### Final takeaway

Sterling is not the cleanest-looking champion, but the UFC-only résumé is legitimately strong. The title context is messy, yet the wins and longevity are too good to keep him out of the top-15 range.

_Ledger verified through 2026-07-13. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

### 26. Junior dos Santos — 89 OVR

A UFC heavyweight champion with a historic nine-fight rise, elite Cain/Werdum/Stipe wins, and a ceiling capped by the Cain rematches.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 50.06 | 15-8 | Heavyweight | 2 | 1.85 | 7 | 11-3 | 61.1% | 7.15 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 3.82 | 35 | 4.46 |
| Opponent Quality | 22.34 | 25 | 18.62 |
| Prime Dominance | 22.5 | 30 | 22.5 |
| Longevity | 12.92 | 10 | 4.31 |

Base score: **49.89**. Modifiers: Apex **+4.97**, Loss Penalty **-2.82**, Division-Era Depth **-1.98**. Final raw score: **50.06**.

OVR conversion: 18.68–101.92 board anchors, normalized score **0.376982**, curved score **0.436388**, resulting in **89 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 3.82 | #48 | 1.85 adjusted credit / 14.54 benchmark |
| Opponent Quality | 22.34 | #15 | 10.5 diminished credit / 14.1 benchmark |
| Prime Dominance | 22.5 | #17 | 22.5 raw × 100.0% sample |
| Longevity | 12.92 | #36 | 62 counted elite months |
| Apex | +4.97 | Modifier | A shutout over an elite challenger followed by a championship knockout captures JDS’s sharpest UFC peak. |
| Loss Penalty | -2.82 | Modifier | 8 official/technical loss events reviewed |
| Division-Era Depth | -1.98 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **2**. Adjusted title wins: **1.85**. Derived undisputed-title win count: **2**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 2011-11-12 | Cain Velasquez | normal | 1 | 0.95 | 0.95 | locked |
| 2012-05-26 | Frank Mir | normal | 1 | 0.9 | 0.9 | locked |

#### Opponent Quality receipts

Raw win credit: **12.4**. Diminishing-return credit before fighter adjustment: **10.5**. Fighter adjustment: **0**. Final diminished credit: **10.5**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2011-11-12 | Cain Velasquez | champion-level | 1.25 | 1 | 1.25 | Elite heavyweight champion-level opponent. |
| 2 | 2014-12-13 | Stipe Miocic | champion-level | 1.25 | 1 | 1.25 | Elite future UFC heavyweight champion. |
| 3 | 2008-10-25 | Fabricio Werdum | top-five | 1 | 1 | 1 | Elite heavyweight and future UFC champion. |
| 4 | 2011-06-11 | Shane Carwin | top-five | 1 | 1 | 1 | Elite heavyweight contender and interim champion. |
| 5 | 2012-05-26 | Frank Mir | top-five | 1 | 1 | 1 | Former UFC heavyweight champion. |
| 6 | 2010-08-07 | Roy Nelson | top-ten | 0.85 | 1 | 0.85 | Strong ranked heavyweight contender. |
| 7 | 2013-05-25 | Mark Hunt | top-ten | 0.85 | 0.75 | 0.64 | Dangerous ranked heavyweight contender. |
| 8 | 2016-04-10 | Ben Rothwell | top-ten | 0.85 | 0.75 | 0.64 | Ranked heavyweight contender. |
| 9 | 2019-03-09 | Derrick Lewis | top-ten | 0.85 | 0.75 | 0.64 | Dangerous ranked heavyweight contender. |
| 10 | 2009-09-19 | Mirko Cro Cop | ranked | 0.65 | 0.75 | 0.49 | Legend name with UFC/timing context. |
| 11 | 2010-03-21 | Gabriel Gonzaga | ranked | 0.65 | 0.75 | 0.49 | Ranked heavyweight veteran. |
| 12 | 2018-07-14 | Blagoy Ivanov | ranked | 0.65 | 0.75 | 0.49 | Ranked-quality heavyweight win. |
| 13 | 2018-12-02 | Tai Tuivasa | ranked | 0.65 | 0.5 | 0.33 | Quality heavyweight win late in JDS run. |
| 14 | 2009-02-21 | Stefan Struve | solid | 0.45 | 0.5 | 0.23 | Solid early UFC heavyweight win. |
| 15 | 2010-01-02 | Gilbert Yvel | solid | 0.45 | 0.5 | 0.23 | Approved supporting UFC win treatment. |

#### Prime Dominance receipts

Prime window: **Fabricio Werdum → Cain Velasquez III**. Prime record: **11-3**. Effective samples: **12**. Sample multiplier: **100.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 7.5 | 10-2; 83.3% |
| Round control | 5.9 | 65.5%; rounds 19-10 |
| Finish pressure | 4 | 8 finishes; 66.7% |
| Elite-level validation | 5.1 | 7 elite-stage fights; 5.1 points |
| Raw prime score | 22.5 | Before sample multiplier |
| Final Prime Dominance | 22.5 | 22.5 × 1 |

#### Longevity receipts

Active elite years: **7.15**. Raw calendar months: **59.8**. Gap-adjusted months: **59.8**. Status multiplier: **1.08**. Division multiplier: **0.96**. Counted elite months: **62**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 2008-10-25 | 2009-02-21 | 3.91 | 3.91 | No |
| 2009-02-21 | 2009-09-19 | 6.9 | 6.9 | No |
| 2009-09-19 | 2010-01-02 | 3.45 | 3.45 | No |
| 2010-01-02 | 2010-03-21 | 2.56 | 2.56 | No |
| 2010-03-21 | 2010-08-07 | 4.57 | 4.57 | No |
| 2010-08-07 | 2011-06-11 | 10.12 | 10.12 | No |
| 2011-06-11 | 2011-11-12 | 5.06 | 5.06 | No |
| 2011-11-12 | 2012-05-26 | 6.44 | 6.44 | No |
| 2012-05-26 | 2012-12-29 | 7.13 | 7.13 | No |
| 2012-12-29 | 2013-05-25 | 4.83 | 4.83 | No |
| 2013-05-25 | 2013-10-19 | 4.83 | 4.83 | No |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **12** fights. Severity: **1.88**. Frequency: **0.94**. Prime-volume floor: **1.75**. Pre-division magnitude: **2.82**. Division discount: **0.0%**. Final penalty: **-2.82**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Base | Finish extra | Raw event | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2012-12-29 | Cain Velasquez | prime | champion-level | home | No | Yes | -1.5 | 0 | -1.5 | standard rule |
| 2013-10-19 | Cain Velasquez | prime | champion-level | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2015-12-19 | Alistair Overeem | post-prime | top-five | home | Yes | Yes | 0 | 0 | 0 | standard rule |
| 2017-05-13 | Stipe Miocic | post-prime | champion-level | home | Yes | Yes | 0 | 0 | 0 | standard rule |
| 2019-06-29 | Francis Ngannou | post-prime | top-five | home | Yes | Yes | 0 | 0 | 0 | standard rule |
| 2020-01-25 | Curtis Blaydes | post-prime | top-five | home | Yes | Yes | 0 | 0 | 0 | standard rule |
| 2020-08-15 | Jairzinho Rozenstruik | post-prime | top-ten | home | Yes | Yes | 0 | 0 | 0 | standard rule |
| 2020-12-12 | Ciryl Gane | post-prime | top-ten | home | Yes | Yes | 0 | 0 | 0 | standard rule |

#### Division-strength context

Default division key: **ufc-heavyweight-0.96**. Era-ledger division multiplier: **0.96**. Division-era modifier: **-1.98**.

Werdum through Cain III.

#### Key judgment calls

- **Cain rivalry:** JDS owns the explosive title win, but Cain owns the rivalry and caps the all-time case.
- **Werdum win:** Full 1.00 quality credit because it aged into elite heavyweight proof.
- **Mir defense:** Real title defense, but 0.85 adjusted credit rather than max-defense value.
- **Heavyweight context:** Heavyweight volatility gives danger credit but not lightweight-style division-depth credit.

#### Why ranked here

Dos Santos ranks here because the heavyweight win ledger is excellent: Cain, Werdum, Stipe, Mir, Carwin, Hunt, Lewis, Rothwell, Nelson, and more. He has enough championship value and peak danger to clear most thin-title cases.

#### Why not ranked higher?

He does not rank higher because the reign was short, he only has one defense, and Cain clearly won the rivalry with two damaging title-fight losses. The late-career losses are mostly post-prime, but they do not add value either.

#### Compare-mode guidance

- **Best counterargument:** The counterargument is championship volume: only one defense, and Cain took the belt back decisively.
- **Why this résumé can still win:** Dos Santos wins comparisons when heavyweight opponent quality and KO peak matter more than long title-control volume.

#### Final takeaway

Dos Santos is a high-quality heavyweight champion case. He belongs around the Tito/Deiveson tier, with stronger opponent quality than many short-reign champions but less title volume than the bigger reign cases.

_Ledger verified through 2026-07-13. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

### 27. B.J. Penn — 89 OVR

The brilliant-but-messy skill case: lightweight gold, the Hughes welterweight upset, elite talent, and a late record collapse that drags the resume down.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 49.37 | 13-13-2 | Lightweight / Welterweight | 5 | 4.78 | 7 | 6-5 | 59.5% | 5.98 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 9.86 | 35 | 11.5 |
| Opponent Quality | 19.36 | 25 | 16.13 |
| Prime Dominance | 18.37 | 30 | 18.37 |
| Longevity | 16.65 | 10 | 5.55 |

Base score: **51.55**. Modifiers: Apex **+4.44**, Loss Penalty **-3.91**, Division-Era Depth **-2.71**. Final raw score: **49.37**.

OVR conversion: 18.68–101.92 board anchors, normalized score **0.368693**, curved score **0.428218**, resulting in **89 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 9.86 | #16 | 4.78 adjusted credit / 14.54 benchmark |
| Opponent Quality | 19.36 | #32 | 9.1 diminished credit / 14.1 benchmark |
| Prime Dominance | 18.37 | #45 | 18.37 raw × 100.0% sample |
| Longevity | 16.65 | #20 | 79.91 counted elite months |
| Apex | +4.44 | Modifier | Prime lightweight title aura and best-fighter argument. |
| Loss Penalty | -3.91 | Modifier | 13 official/technical loss events reviewed |
| Division-Era Depth | -2.71 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **5**. Adjusted title wins: **4.78**. Derived undisputed-title win count: **5**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 2004-01-31 | Matt Hughes | normal | 1 | 0.95 | 0.95 | locked |
| 2008-01-19 | Joe Stevenson | vacant-second-division | 1.15 | 0.85 | 0.98 | Vacant second-division title vs softer opponent. |
| 2008-05-24 | Sean Sherk | normal | 1 | 0.95 | 0.95 | locked |
| 2009-08-08 | Kenny Florian | normal | 1 | 0.95 | 0.95 | locked |
| 2009-12-12 | Diego Sanchez | normal | 1 | 0.95 | 0.95 | locked |

#### Opponent Quality receipts

Raw win credit: **10.25**. Diminishing-return credit before fighter adjustment: **9.1**. Fighter adjustment: **0**. Final diminished credit: **9.1**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2004-01-31 | Matt Hughes | champion-level | 1.25 | 1 | 1.25 | Elite UFC welterweight champion and all-time great. |
| 2 | 2008-05-24 | Sean Sherk | top-five | 1 | 1 | 1 | Former UFC lightweight champion and top contender. |
| 3 | 2009-08-08 | Kenny Florian | top-five | 1 | 1 | 1 | Elite lightweight title challenger. |
| 4 | 2009-12-12 | Diego Sanchez | top-five | 1 | 1 | 1 | Top lightweight contender at the time. |
| 5 | 2010-11-20 | Matt Hughes | top-five | 1 | 1 | 1 | Elite former champion rematch win. |
| 6 | 2001-11-02 | Caol Uno | top-ten | 0.85 | 1 | 0.85 | Elite early lightweight contender. |
| 7 | 2007-06-23 | Jens Pulver | top-ten | 0.85 | 0.75 | 0.64 | Former UFC lightweight champion, timing-adjusted. |
| 8 | 2008-01-19 | Joe Stevenson | top-ten | 0.85 | 0.75 | 0.64 | Lightweight title opponent and ranked contender. |
| 9 | 2002-09-27 | Matt Serra | ranked | 0.65 | 0.75 | 0.49 | Quality lightweight/welterweight name and future champion. |
| 10 | 2001-05-04 | Joey Gilbert | solid | 0.45 | 0.75 | 0.34 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 11 | 2001-06-29 | Din Thomas | solid | 0.45 | 0.75 | 0.34 | Useful early UFC lightweight win. |
| 12 | 2002-05-10 | Paul Creighton | solid | 0.45 | 0.75 | 0.34 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 13 | 2003-04-25 | Duane Ludwig | solid | 0.45 | 0.5 | 0.23 | Official UFC 42 win; useful but not ranked-quality proof. |

#### Prime Dominance receipts

Prime window: **Matt Hughes I → Frankie Edgar II**. Prime record: **6-5**. Effective samples: **11**. Sample multiplier: **100.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 4.91 | 6-5; 54.5% |
| Round control | 5.35 | 59.5%; rounds 22-15 |
| Finish pressure | 3 | 6 finishes; 54.5% |
| Elite-level validation | 5.11 | 10 elite-stage fights; 5.11 points |
| Raw prime score | 18.37 | Before sample multiplier |
| Final Prime Dominance | 18.37 | 18.37 × 1 |

#### Longevity receipts

Active elite years: **5.98**. Raw calendar months: **78.9**. Gap-adjusted months: **71.8**. Status multiplier: **1.06**. Division multiplier: **1.05**. Counted elite months: **79.91**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 2004-01-31 | 2006-03-04 | 25.07 | 18 | Yes |
| 2006-03-04 | 2006-09-23 | 6.67 | 6.67 | No |
| 2006-09-23 | 2007-06-23 | 8.97 | 8.97 | No |
| 2007-06-23 | 2008-01-19 | 6.9 | 6.9 | No |
| 2008-01-19 | 2008-05-24 | 4.14 | 4.14 | No |
| 2008-05-24 | 2009-01-31 | 8.28 | 8.28 | No |
| 2009-01-31 | 2009-08-08 | 6.21 | 6.21 | No |
| 2009-08-08 | 2009-12-12 | 4.14 | 4.14 | No |
| 2009-12-12 | 2010-04-10 | 3.91 | 3.91 | No |
| 2010-04-10 | 2010-08-28 | 4.6 | 4.6 | No |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **19** fights. Severity: **1.88**. Frequency: **1.38**. Prime-volume floor: **4.25**. Pre-division magnitude: **4.25**. Division discount: **8.0%**. Final penalty: **-3.91**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Base | Finish extra | Raw event | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2002-01-11 | Jens Pulver | pre-prime | champion-level | home | No | Yes | -0.75 | 0 | -0.75 | standard rule |
| 2006-03-04 | Georges St-Pierre | prime | top-five | home | No | Yes | -1.5 | 0 | -1.5 | standard rule |
| 2006-09-23 | Matt Hughes | prime | champion-level | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2009-01-31 | Georges St-Pierre | prime | champion-level | upward | Yes | Yes | -0.75 | -0.5 | -1.25 | prime-upward-elite |
| 2010-04-10 | Frankie Edgar | prime | top-five | home | No | Yes | -1.5 | 0 | -1.5 | standard rule |
| 2010-08-28 | Frankie Edgar | prime | champion-level | home | No | Yes | -1.5 | 0 | -1.5 | standard rule |
| 2011-10-29 | Nick Diaz | post-prime | top-five | home | No | Yes | 0 | 0 | 0 | standard rule |
| 2012-12-08 | Rory MacDonald | post-prime | top-five | home | No | Yes | 0 | 0 | 0 | standard rule |
| 2014-07-06 | Frankie Edgar | post-prime | top-five | home | Yes | Yes | 0 | 0 | 0 | standard rule |
| 2017-01-15 | Yair Rodriguez | post-prime | top-ten | home | Yes | Yes | 0 | 0 | 0 | standard rule |
| 2017-06-25 | Dennis Siver | post-prime | ranked | home | No | Yes | 0 | 0 | 0 | standard rule |
| 2018-12-29 | Ryan Hall | post-prime | solid | home | Yes | Yes | 0 | 0 | 0 | standard rule |
| 2019-05-11 | Clay Guida | post-prime | name-value | home | No | Yes | 0 | 0 | 0 | standard rule |

#### Division-strength context

Default division key: **penn-lightweight-welterweight-1.03**. Era-ledger division multiplier: **1.05**. Division-era modifier: **-2.71**.

Hughes I through Edgar II.

#### Key judgment calls

- **Two-division value:** lightweight and welterweight gold are central to the case.
- **Hughes upset:** one of the biggest high-end wins in the profile.
- **Late losses:** do not erase the peak, but they drag the UFC-only resume hard.
- **Non-UFC context:** historical context only; the ranking is UFC-only.
- **Skill vs resume:** his skill reputation is higher than the clean résumé score.

#### Why ranked here

Penn ranks here because the high-end UFC case is still real: lightweight champion, welterweight champion, the Hughes upset, and a peak skill set that was ahead of its time.

#### Why not ranked higher?

He does not rank higher because the late-career record collapse is too damaging, and the active elite window is not deep enough to offset the loss drag against cleaner champions.

#### Compare-mode guidance

- **Best counterargument:** Penn’s argument is peak skill and two-division greatness. The argument against him is the record collapse and too many damaging losses after the best years.
- **Why this résumé can still win:** Penn wins comparisons when peak skill, lightweight title value, and the Hughes upset outweigh a messy career arc.

#### Final takeaway

Penn is a real two-division skill legend, but the UFC-only score has to balance the brilliant peak against one of the messiest late-career records in the ranking.

_Ledger verified through 2026-07-13. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

### 28. Justin Gaethje — 89 OVR

The lightweight chaos case: undisputed UFC gold, two interim-title wins, elite action wins, and enough finish-loss damage to keep the GOAT case capped.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 49.04 | 11-5 | Lightweight | 3 | 2.46 | 6 | 7-3 | 57.6% | 6.18 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 5.08 | 35 | 5.93 |
| Opponent Quality | 20.51 | 25 | 17.09 |
| Prime Dominance | 18.83 | 30 | 18.83 |
| Longevity | 17.32 | 10 | 5.77 |

Base score: **47.62**. Modifiers: Apex **+4.95**, Loss Penalty **-3.47**, Division-Era Depth **-0.06**. Final raw score: **49.04**.

OVR conversion: 18.68–101.92 board anchors, normalized score **0.364728**, curved score **0.424301**, resulting in **89 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 5.08 | #41 | 2.46 adjusted credit / 14.54 benchmark |
| Opponent Quality | 20.51 | #24 | 9.64 diminished credit / 14.1 benchmark |
| Prime Dominance | 18.83 | #42 | 18.83 raw × 100.0% sample |
| Longevity | 17.32 | #15 | 83.14 counted elite months |
| Apex | +4.95 | Modifier | Topuria is a maximum-level Apex win: an undefeated two-division champion and pound-for-pound benchmark broken in a title unification fight. Paddy adds legitimate interim-title proof, but his lower opponent standing and Gaethje’s historically hittable style keep this below the mythic six-point tier. |
| Loss Penalty | -3.47 | Modifier | 5 official/technical loss events reviewed |
| Division-Era Depth | -0.06 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **3**. Adjusted title wins: **2.46**. Derived undisputed-title win count: **1**. Interim-title win count: **2**.

| Date | Opponent | Title type | Base | Opponent strength | Final credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 2020-05-09 | Tony Ferguson | interim | 0.75 | 0.95 | 0.71 | Interim title over elite lightweight. |
| 2026-01-24 | Paddy Pimblett | interim | 0.75 | 1 | 0.75 | Cody-approved fighter audit: Paddy Pimblett receives full 1.00 opponent-strength treatment within Gaethje’s 0.75 interim-title base credit. |
| 2026-06-14 | Ilia Topuria | normal | 1 | 1 | 1 | Recent-event add: UFC Freedom 250 undisputed lightweight title win over elite two-division champion. |

#### Opponent Quality receipts

Raw win credit: **10.65**. Diminishing-return credit before fighter adjustment: **9.64**. Fighter adjustment: **0**. Final diminished credit: **9.64**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2020-05-09 | Tony Ferguson | champion-level | 1.25 | 1 | 1.25 | Elite top lightweight/interim-title opponent at the time. |
| 2 | 2023-07-29 | Dustin Poirier | champion-level | 1.25 | 1 | 1.25 | Elite lightweight rematch win. |
| 3 | 2026-06-14 | Ilia Topuria | champion-level | 1.25 | 1 | 1.25 | Elite two-division champion-level opponent and undisputed lightweight title win. |
| 4 | 2021-11-06 | Michael Chandler | top-five | 1 | 1 | 1 | Elite action-contender and former title challenger. |
| 5 | 2023-03-18 | Rafael Fiziev | top-five | 1 | 1 | 1 | Prime top lightweight contender. |
| 6 | 2017-07-07 | Michael Johnson | top-ten | 0.85 | 1 | 0.85 | Cody-approved fighter audit: Michael Johnson receives full 0.85 top-ten win credit based on his ranking context at the time. |
| 7 | 2019-03-30 | Edson Barboza | top-ten | 0.85 | 0.75 | 0.64 | Dangerous ranked lightweight striker. |
| 8 | 2019-09-14 | Donald Cerrone | top-ten | 0.85 | 0.75 | 0.64 | Big-name ranked veteran with timing/fade context. |
| 9 | 2025-03-08 | Rafael Fiziev | top-ten | 0.85 | 0.75 | 0.64 | Strong ranked lightweight rematch win. |
| 10 | 2026-01-24 | Paddy Pimblett | top-ten | 0.85 | 0.75 | 0.64 | Interim-title win, but opponent quality still under review. |
| 11 | 2018-08-25 | James Vick | ranked | 0.65 | 0.75 | 0.49 | Ranked lightweight win with limited elite value. |

#### Prime Dominance receipts

Prime window: **Tony Ferguson → Current championship form**. Prime record: **7-3**. Effective samples: **10**. Sample multiplier: **100.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 6.3 | 7-3; 70.0% |
| Round control | 5.18 | 57.6%; rounds 19-14 |
| Finish pressure | 2 | 3 finishes; 30.0% |
| Elite-level validation | 5.35 | 9 elite-stage fights; 5.35 points |
| Raw prime score | 18.83 | Before sample multiplier |
| Final Prime Dominance | 18.83 | 18.83 × 1 |

#### Longevity receipts

Active elite years: **6.18**. Raw calendar months: **74.1**. Gap-adjusted months: **74.1**. Status multiplier: **1.02**. Division multiplier: **1.1**. Counted elite months: **83.14**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 2020-05-09 | 2020-10-24 | 5.52 | 5.52 | No |
| 2020-10-24 | 2021-11-06 | 12.42 | 12.42 | No |
| 2021-11-06 | 2022-05-07 | 5.98 | 5.98 | No |
| 2022-05-07 | 2023-03-18 | 10.35 | 10.35 | No |
| 2023-03-18 | 2023-07-29 | 4.37 | 4.37 | No |
| 2023-07-29 | 2024-04-13 | 8.51 | 8.51 | No |
| 2024-04-13 | 2025-03-08 | 10.81 | 10.81 | No |
| 2025-03-08 | 2026-01-24 | 10.58 | 10.58 | No |
| 2026-01-24 | 2026-06-14 | 4.63 | 4.63 | No |
| 2026-06-14 | 2026-07-13 | 0.95 | 0.95 | No |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **16** fights. Severity: **2.25**. Frequency: **1.83**. Prime-volume floor: **3**. Pre-division magnitude: **4.08**. Division discount: **15.0%**. Final penalty: **-3.47**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Base | Finish extra | Raw event | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2017-12-02 | Eddie Alvarez | pre-prime | top-five | home | Yes | Yes | -0.75 | -0.75 | -1.5 | standard rule |
| 2018-04-14 | Dustin Poirier | pre-prime | top-five | home | Yes | Yes | -0.75 | -0.75 | -1.5 | standard rule |
| 2020-10-24 | Khabib Nurmagomedov | prime | champion-level | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2022-05-07 | Charles Oliveira | prime | top-five | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2024-04-13 | Max Holloway | prime | top-five | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |

#### Division-strength context

Default division key: **modern-lightweight-1.10**. Era-ledger division multiplier: **1.1**. Division-era modifier: **-0.06**.

Tony Ferguson through current championship form; every inactivity gap remains capped at 18 months.

#### Key judgment calls

- **Undisputed title update:** the Topuria win gives Gaethje real UFC champion value, not just action-fighter value.
- **Loss cap:** his raw loss damage would go past -10, but the model caps the visible penalty at -10.
- **Modern lightweight depth:** boosts the quality-wins case because this division is treated as one of the hardest UFC environments.
- **Action style:** makes the resume feel huge, but style points do not erase finish losses.
- **Non-UFC résumé:** WSOF context is historical only and is not scored.

#### Why ranked here

Gaethje ranks here because the UFC-only case now has real championship weight: undisputed lightweight gold, two interim/title-level wins, and a modern lightweight win list built around Topuria, Ferguson, Poirier, Chandler, Fiziev, Barboza, Cerrone, and Johnson.

#### Why not ranked higher?

He does not rank higher because the loss context is still heavy even with the -10 cap. Gaethje has been finished in major prime fights, and one undisputed title win does not erase the Khabib, Oliveira, Max, Poirier, and Alvarez damage against cleaner all-time cases.

#### Compare-mode guidance

- **Best counterargument:** Gaethje’s counterargument in debates is that his schedule was brutal and his best wins are better than some cleaner records. The Topuria win strengthens that argument a lot.
- **Why this résumé can still win:** Gaethje wins comparisons when modern lightweight strength, action-fight résumé, high-end win quality, and undisputed title value matter more than clean title reign length.

#### Final takeaway

Gaethje is now more than the great action-resume test case: the undisputed title win gives him real UFC champion weight, but the loss cap is doing work because the finish-loss pile still keeps him outside the deeper GOAT tier.

_Ledger verified through 2026-07-13. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

### 29. Glover Teixeira — 89 OVR

The late-career title miracle: sixteen UFC wins, thirteen ranked victories, relentless finishing, and a championship breakthrough after nearly a decade among the elite.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 48.47 | 16-7 | Light Heavyweight | 1 | 0.99 | 7 | 12-6 | 55.1% | 8.77 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 2.05 | 35 | 2.39 |
| Opponent Quality | 24.55 | 25 | 20.46 |
| Prime Dominance | 19.07 | 30 | 19.07 |
| Longevity | 23 | 10 | 7.67 |

Base score: **49.59**. Modifiers: Apex **+4.25**, Loss Penalty **-5.25**, Division-Era Depth **-0.12**. Final raw score: **48.47**.

OVR conversion: 18.68–101.92 board anchors, normalized score **0.357881**, curved score **0.417520**, resulting in **89 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 2.05 | #56 | 0.99 adjusted credit / 14.54 benchmark |
| Opponent Quality | 24.55 | #6 | 11.54 diminished credit / 14.1 benchmark |
| Prime Dominance | 19.07 | #40 | 19.07 raw × 100.0% sample |
| Longevity | 23 | #7 | 110.4 counted elite months |
| Apex | +4.25 | Modifier | Elite late-career title run with strong proof, but not a serious best-fighter-alive claim and only moderate Apex aura. |
| Loss Penalty | -5.25 | Modifier | 7 official/technical loss events reviewed |
| Division-Era Depth | -0.12 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **1**. Adjusted title wins: **0.99**. Derived undisputed-title win count: **1**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 2021-10-30 | Jan Błachowicz | normal | 1 | 1 | 0.99 | Approved aggregate Championship score recovered from the live control; exact historical per-fight split was not stored. |

#### Opponent Quality receipts

Raw win credit: **13.95**. Diminishing-return credit before fighter adjustment: **11.54**. Fighter adjustment: **0**. Final diminished credit: **11.54**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2016-04-16 | Rashad Evans | champion-level | 1.25 | 1 | 1.25 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 2 | 2021-10-30 | Jan Błachowicz | champion-level | 1.25 | 1 | 1.25 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 3 | 2013-01-26 | Quinton Jackson | top-five | 1 | 1 | 1 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 4 | 2013-09-04 | Ryan Bader | top-five | 1 | 1 | 1 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 5 | 2015-08-08 | Ovince Saint Preux | top-five | 1 | 1 | 1 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 6 | 2020-05-13 | Anthony Smith | top-five | 1 | 1 | 1 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 7 | 2020-11-07 | Thiago Santos | top-five | 1 | 0.75 | 0.75 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 8 | 2013-05-25 | James Te Huna | top-ten | 0.85 | 0.75 | 0.64 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 9 | 2015-11-07 | Patrick Cummins | top-ten | 0.85 | 0.75 | 0.64 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 10 | 2017-02-11 | Jared Cannonier | top-ten | 0.85 | 0.75 | 0.64 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 11 | 2017-12-16 | Misha Cirkunov | top-ten | 0.85 | 0.75 | 0.64 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 12 | 2019-04-27 | Ion Cuțelaba | top-ten | 0.85 | 0.75 | 0.64 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 13 | 2019-09-14 | Nikita Krylov | top-ten | 0.85 | 0.5 | 0.42 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 14 | 2012-05-26 | Kyle Kingsbury | solid | 0.45 | 0.5 | 0.23 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 15 | 2012-10-13 | Fábio Maldonado | solid | 0.45 | 0.5 | 0.23 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 16 | 2019-01-19 | Karl Roberson | solid | 0.45 | 0.5 | 0.23 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |

#### Prime Dominance receipts

Prime window: **Ryan Bader → Jiri Prochazka**. Prime record: **12-6**. Effective samples: **18**. Sample multiplier: **100.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 6 | 12-6; 66.7% |
| Round control | 4.96 | 55.1%; rounds 27-22 |
| Finish pressure | 3 | 10 finishes; 55.6% |
| Elite-level validation | 5.11 | 11 elite-stage fights; 5.11 points |
| Raw prime score | 19.07 | Before sample multiplier |
| Final Prime Dominance | 19.07 | 19.07 × 1 |

#### Longevity receipts

Active elite years: **8.77**. Raw calendar months: **105.2**. Gap-adjusted months: **105.2**. Status multiplier: **1.06**. Division multiplier: **0.99**. Counted elite months: **110.4**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 2013-09-04 | 2014-04-26 | 7.69 | 7.69 | No |
| 2014-04-26 | 2014-10-25 | 5.98 | 5.98 | No |
| 2014-10-25 | 2015-08-08 | 9.43 | 9.43 | No |
| 2015-08-08 | 2015-11-07 | 2.99 | 2.99 | No |
| 2015-11-07 | 2016-04-16 | 5.29 | 5.29 | No |
| 2016-04-16 | 2016-08-20 | 4.14 | 4.14 | No |
| 2016-08-20 | 2017-02-11 | 5.75 | 5.75 | No |
| 2017-02-11 | 2017-05-28 | 3.48 | 3.48 | No |
| 2017-05-28 | 2017-12-16 | 6.64 | 6.64 | No |
| 2017-12-16 | 2018-07-22 | 7.16 | 7.16 | No |
| 2018-07-22 | 2019-01-19 | 5.95 | 5.95 | No |
| 2019-01-19 | 2019-04-27 | 3.22 | 3.22 | No |
| 2019-04-27 | 2019-09-14 | 4.6 | 4.6 | No |
| 2019-09-14 | 2020-05-13 | 7.95 | 7.95 | No |
| 2020-05-13 | 2020-11-07 | 5.85 | 5.85 | No |
| 2020-11-07 | 2021-10-30 | 11.73 | 11.73 | No |
| 2021-10-30 | 2022-06-11 | 7.36 | 7.36 | No |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **22** fights. Severity: **3.13**. Frequency: **1.88**. Prime-volume floor: **5.25**. Pre-division magnitude: **5.25**. Division discount: **0.0%**. Final penalty: **-5.25**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Base | Finish extra | Raw event | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2014-04-26 | Jon Jones | prime | champion-level | home | No | Yes | -1.5 | 0 | -1.5 | standard rule |
| 2014-10-25 | Phil Davis | prime | top-five | home | No | Yes | -1.5 | 0 | -1.5 | standard rule |
| 2016-08-20 | Anthony Johnson | prime | top-five | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2017-05-28 | Alexander Gustafsson | prime | champion-level | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2018-07-22 | Corey Anderson | prime | top-ten | home | No | Yes | -4 | 0 | -4 | standard rule |
| 2022-06-11 | Jiří Procházka | prime | champion-level | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2023-01-21 | Jamahal Hill | post-prime | top-five | home | No | Yes | 0 | 0 | 0 | standard rule |

#### Division-strength context

Default division key: **light-heavyweight-1.00**. Era-ledger division multiplier: **0.99**. Division-era modifier: **-0.12**.

Bader through Jiri with long gaps capped.

#### Key judgment calls

- **Prime window:** Ryan Bader → Jiri Prochazka.
- **Coverage:** Complete UFC-only ledger.
- **Prime endpoint:** Jiri closes the late championship-prime window after Glover’s title-winning resurgence.

#### Why ranked here

Teixeira ranks here because his light-heavyweight résumé combines extraordinary longevity with real opponent depth and an improbable championship finish. He beat Rampage Jackson, Ryan Bader, Rashad Evans, Anthony Smith, Thiago Santos, and Jan Błachowicz, collected seven Top-5 wins, and finally won the belt during an elite run in his forties.

#### Why not ranked higher?

He does not rank higher because the championship chapter produced only one title-fight win and no successful defense. His 12-6 prime contains several meaningful defeats, including finish losses to Anthony Johnson, Alexander Gustafsson, and Jiří Procházka, while the Corey Anderson decision is a damaging non-elite prime loss in the model.

#### Final takeaway

Teixeira ranks here because his light-heavyweight résumé combines extraordinary longevity with real opponent depth and an improbable championship finish. He beat Rampage Jackson, Ryan Bader, Rashad Evans, Anthony Smith, Thiago Santos, and Jan Błachowicz, collected seven Top-5 wins, and finally won the belt during an elite run in his forties.

_Ledger verified through 2026-07-13. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

### 30. Dustin Poirier — 89 OVR

The best non-undisputed lightweight résumé in this range: elite wins everywhere, an interim belt, three undisputed title misses, and a capped loss profile keeping him out of the higher GOAT tier.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 48.37 | 22-9, 1 NC | Lightweight / Featherweight | 1 | 0.71 | 8 | 7-4 | 54.5% | 5.85 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 1.46 | 35 | 1.7 |
| Opponent Quality | 25.05 | 25 | 20.88 |
| Prime Dominance | 18.81 | 30 | 18.81 |
| Longevity | 16.39 | 10 | 5.46 |

Base score: **46.85**. Modifiers: Apex **+4.94**, Loss Penalty **-3.4**, Division-Era Depth **-0.02**. Final raw score: **48.37**.

OVR conversion: 18.68–101.92 board anchors, normalized score **0.356679**, curved score **0.416329**, resulting in **89 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 1.46 | #61 | 0.71 adjusted credit / 14.54 benchmark |
| Opponent Quality | 25.05 | #5 | 11.78 diminished credit / 14.1 benchmark |
| Prime Dominance | 18.81 | #43 | 18.81 raw × 100.0% sample |
| Longevity | 16.39 | #22 | 78.65 counted elite months |
| Apex | +4.94 | Modifier | Two elite wins inside one year, capped by the interim lightweight title, provide exceptional Proof without a sustained best-fighter claim. |
| Loss Penalty | -3.4 | Modifier | 9 official/technical loss events reviewed |
| Division-Era Depth | -0.02 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **1**. Adjusted title wins: **0.71**. Derived undisputed-title win count: **0**. Interim-title win count: **1**.

| Date | Opponent | Title type | Base | Opponent strength | Final credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 2019-04-13 | Max Holloway | interim | 0.75 | 0.95 | 0.71 | Interim lightweight title over elite former champ. |

#### Opponent Quality receipts

Raw win credit: **15.55**. Diminishing-return credit before fighter adjustment: **11.78**. Fighter adjustment: **0**. Final diminished credit: **11.78**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2012-02-04 | Max Holloway | champion-level | 1.25 | 1 | 1.25 | Elite champion-level opponent moving up for interim lightweight title. |
| 2 | 2018-04-14 | Justin Gaethje | champion-level | 1.25 | 1 | 1.25 | Prime elite lightweight contender. |
| 3 | 2018-07-28 | Eddie Alvarez | top-five | 1 | 1 | 1 | Former UFC champion and elite lightweight contender. |
| 4 | 2021-01-24 | Conor McGregor | top-five | 1 | 1 | 1 | Former two-division champion name with activity/timing context. |
| 5 | 2022-11-12 | Michael Chandler | top-five | 1 | 1 | 1 | Elite lightweight contender and former title challenger. |
| 6 | 2011-01-01 | Josh Grispi | top-ten | 0.85 | 1 | 0.85 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 7 | 2017-11-11 | Anthony Pettis | top-ten | 0.85 | 0.75 | 0.64 | Former UFC champion, later-career lightweight context. |
| 8 | 2020-06-27 | Dan Hooker | top-ten | 0.85 | 0.75 | 0.64 | Strong ranked lightweight contender. |
| 9 | 2021-07-10 | Conor McGregor | top-ten | 0.85 | 0.75 | 0.64 | High-level name, but injury/weird ending context. |
| 10 | 2024-03-09 | Benoit Saint Denis | top-ten | 0.85 | 0.75 | 0.64 | Dangerous rising lightweight contender. |
| 11 | 2015-04-04 | Carlos Diego Ferreira | ranked | 0.65 | 0.75 | 0.49 | Solid ranked-quality lightweight win. |
| 12 | 2016-01-02 | Joseph Duffy | ranked | 0.65 | 0.75 | 0.49 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 13 | 2016-06-04 | Bobby Green | ranked | 0.65 | 0.5 | 0.33 | Quality lightweight win. |
| 14 | 2017-02-11 | Jim Miller | ranked | 0.65 | 0.5 | 0.33 | Quality veteran lightweight win. |
| 15 | 2011-06-11 | Jason Young | solid | 0.45 | 0.5 | 0.23 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 16 | 2011-11-12 | Pablo Garza | solid | 0.45 | 0.5 | 0.23 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 17 | 2013-08-31 | Erik Koch | solid | 0.45 | 0.5 | 0.23 | Solid UFC featherweight win. |
| 18 | 2013-12-28 | Diego Brandao | solid | 0.45 | 0.5 | 0.23 | Solid featherweight win. |
| 19 | 2015-06-06 | Yancy Medeiros | solid | 0.45 | 0.25 | 0.11 | Useful UFC win. |
| 20 | 2019-04-13 | Max Holloway | solid | 0.45 | 0.25 | 0.11 | Early Holloway win before Max became elite. |
| 21 | 2012-12-15 | Jonathan Brookins | name-value | 0.25 | 0.25 | 0.06 | Low-end UFC quality value. |
| 22 | 2014-04-16 | Akira Corassani | name-value | 0.25 | 0.25 | 0.06 | Low-end UFC quality value. |

#### Prime Dominance receipts

Prime window: **Eddie Alvarez II → Islam Makhachev**. Prime record: **7-4**. Effective samples: **11**. Sample multiplier: **100.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 5.73 | 7-4; 63.6% |
| Round control | 4.91 | 54.5%; rounds 18-15 |
| Finish pressure | 3 | 5 finishes; 45.5% |
| Elite-level validation | 5.17 | 10 elite-stage fights; 5.17 points |
| Raw prime score | 18.81 | Before sample multiplier |
| Final Prime Dominance | 18.81 | 18.81 × 1 |

#### Longevity receipts

Active elite years: **5.85**. Raw calendar months: **70.1**. Gap-adjusted months: **70.1**. Status multiplier: **1.02**. Division multiplier: **1.1**. Counted elite months: **78.65**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 2018-07-28 | 2019-04-13 | 8.51 | 8.51 | No |
| 2019-04-13 | 2019-09-07 | 4.83 | 4.83 | No |
| 2019-09-07 | 2020-06-27 | 9.66 | 9.66 | No |
| 2020-06-27 | 2021-01-24 | 6.93 | 6.93 | No |
| 2021-01-24 | 2021-07-10 | 5.49 | 5.49 | No |
| 2021-07-10 | 2021-12-11 | 5.06 | 5.06 | No |
| 2021-12-11 | 2022-11-12 | 11.04 | 11.04 | No |
| 2022-11-12 | 2023-07-29 | 8.51 | 8.51 | No |
| 2023-07-29 | 2024-03-09 | 7.36 | 7.36 | No |
| 2024-03-09 | 2024-06-01 | 2.76 | 2.76 | No |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **30** fights. Severity: **2.25**. Frequency: **1.48**. Prime-volume floor: **4**. Pre-division magnitude: **4**. Division discount: **15.0%**. Final penalty: **-3.4**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Base | Finish extra | Raw event | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2012-05-15 | Chan Sung Jung | pre-prime | top-five | home | Yes | Yes | -0.75 | -0.75 | -1.5 | standard rule |
| 2013-02-16 | Cub Swanson | pre-prime | top-five | home | No | Yes | -0.75 | 0 | -0.75 | standard rule |
| 2014-09-27 | Conor McGregor | pre-prime | top-five | home | Yes | Yes | -0.75 | -0.75 | -1.5 | standard rule |
| 2016-09-17 | Michael Johnson | pre-prime | top-ten | home | Yes | Yes | -1.25 | -0.75 | -2 | standard rule |
| 2019-09-07 | Khabib Nurmagomedov | prime | champion-level | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2021-12-11 | Charles Oliveira | prime | champion-level | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2023-07-29 | Justin Gaethje | prime | top-five | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2024-06-01 | Islam Makhachev | prime | champion-level | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2025-07-19 | Max Holloway | post-prime | top-five | home | No | Yes | 0 | 0 | 0 | standard rule |

#### Division-strength context

Default division key: **modern-lightweight-1.10**. Era-ledger division multiplier: **1.1**. Division-era modifier: **-0.02**.

Alvarez II through Islam.

#### Key judgment calls

- **Interim title:** the Holloway 2019 win is the championship anchor, but one interim belt cannot match undisputed champions with defenses.
- **Holloway trilogy:** Poirier owns two UFC wins over Max, while Max owns the final BMF/retirement-fight result and the stronger total GOAT case.
- **McGregor series:** Poirier’s 2-1 UFC series edge over Conor matters, but the third fight has injury-finish context.
- **Lightweight schedule:** his opponent-quality score is elite because he spent years fighting the hardest lightweight names available.
- **Ceiling:** three failed undisputed title shots are the cleanest reason he stays below the higher championship cases.

#### Why ranked here

Poirier ranks here because the UFC-only résumé is loaded: 22 UFC wins, an interim lightweight title, two UFC wins over Max Holloway, two over Conor McGregor, and major lightweight wins over Justin Gaethje, Eddie Alvarez, Michael Chandler, Anthony Pettis, Dan Hooker, Benoit Saint Denis, and Jim Miller.

#### Why not ranked higher?

He does not rank higher because he never won the undisputed UFC title, lost three undisputed lightweight title fights, and the Gaethje rematch plus Islam finish stack enough late elite damage that the -10 loss cap is doing real work.

#### Compare-mode guidance

- **Best counterargument:** Poirier’s counterargument in debates is that he beat more great fighters than some actual champions and kept taking the hardest available lightweight fights.
- **Why this résumé can still win:** Poirier wins comparisons when deep win quality, modern lightweight strength, and repeated elite relevance matter more than undisputed title reign length.

#### Final takeaway

Poirier is the elite résumé-over-belt case: he has enough UFC wins and opponent quality to sit around the top 20, but the missing undisputed title and capped loss context keep him below the true champion-reign tier.

_Ledger verified through 2026-07-13. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

### 31. Alexandre Pantoja — 89 OVR

A relentless four-defense flyweight champion who built the strongest UFC resume in the division outside Demetrious Johnson.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 48.28 | 14-4 | Flyweight | 5 | 4.4 | 5 | 8-1 | 77.8% | 4.84 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 9.08 | 35 | 10.59 |
| Opponent Quality | 10.55 | 25 | 8.79 |
| Prime Dominance | 23.19 | 30 | 23.19 |
| Longevity | 12.42 | 10 | 4.14 |

Base score: **46.71**. Modifiers: Apex **+4.4**, Loss Penalty **-2.08**, Division-Era Depth **-0.75**. Final raw score: **48.28**.

OVR conversion: 18.68–101.92 board anchors, normalized score **0.355598**, curved score **0.415256**, resulting in **89 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 9.08 | #19 | 4.4 adjusted credit / 14.54 benchmark |
| Opponent Quality | 10.55 | #60 | 5.11 diminished credit / 14.54 benchmark |
| Prime Dominance | 23.19 | #15 | 23.19 raw × 100.0% sample |
| Longevity | 12.42 | #39 | 59.51 counted elite months |
| Apex | +4.4 | Modifier | Elite modern flyweight apex below the mythic cross-divisional peaks. |
| Loss Penalty | -2.08 | Modifier | 4 official/technical loss events reviewed |
| Division-Era Depth | -0.75 | Modifier | Apply a modest modern-flyweight depth discount. |

#### Championship receipts

UFC title-fight wins: **5**. Adjusted title wins: **4.4**. Derived undisputed-title win count: **5**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| — | Brandon Moreno | — | — | — | 1 | locked |
| — | Brandon Royval | — | — | — | 0.95 | locked |
| — | Steve Erceg | — | — | — | 0.8 | locked |
| — | Kai Asakura | — | — | — | 0.75 | locked |
| — | Kai Kara-France | — | — | — | 0.9 | locked |

#### Opponent Quality receipts

Raw win credit: **5.45**. Diminishing-return credit before fighter adjustment: **5.11**. Fighter adjustment: **0**. Final diminished credit: **5.11**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | — | Brandon Moreno | — | 1 | 1 | 1 | locked |
| 2 | — | Brandon Royval | — | 0.7 | 1 | 0.7 | locked |
| 3 | — | Brandon Royval | — | 0.7 | 1 | 0.7 | locked |
| 4 | — | Alex Perez | — | 0.65 | 1 | 0.65 | locked |
| 5 | — | Kai Kara-France | — | 0.65 | 1 | 0.65 | locked |
| 6 | — | Brandon Moreno | — | 0.4 | 1 | 0.4 | locked |
| 7 | — | Manel Kape | — | 0.35 | 0.75 | 0.26 | locked |
| 8 | — | Wilson Reis | — | 0.3 | 0.75 | 0.23 | locked |
| 9 | — | Matt Schnell | — | 0.25 | 0.75 | 0.19 | locked |
| 10 | — | Steve Erceg | — | 0.25 | 0.75 | 0.19 | locked |
| 11 | — | Kai Asakura | — | 0.2 | 0.75 | 0.15 | locked |

#### Prime Dominance receipts

Prime window: **Manel Kape → Joshua Van**. Prime record: **8-1**. Effective samples: **9**. Sample multiplier: **100.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 8 | 8-1; 88.9% |
| Round control | 7 | 77.8%; rounds 21-6 |
| Finish pressure | 2 | 4 finishes; 44.4% |
| Elite-level validation | 6.19 | 8 elite-stage fights; 6.19 points |
| Raw prime score | 23.19 | Before sample multiplier |
| Final Prime Dominance | 23.19 | 23.19 × 1 |

#### Longevity receipts

Active elite years: **4.84**. Raw calendar months: **58**. Gap-adjusted months: **58**. Status multiplier: **1.08**. Division multiplier: **0.95**. Counted elite months: **59.51**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 2021-02-06 | 2021-08-21 | 6.44 | 6.44 | No |
| 2021-08-21 | 2022-07-30 | 11.27 | 11.27 | No |
| 2022-07-30 | 2023-07-08 | 11.27 | 11.27 | No |
| 2023-07-08 | 2023-12-16 | 5.29 | 5.29 | No |
| 2023-12-16 | 2024-05-04 | 4.6 | 4.6 | No |
| 2024-05-04 | 2024-12-07 | 7.13 | 7.13 | No |
| 2024-12-07 | 2025-06-28 | 6.67 | 6.67 | No |
| 2025-06-28 | 2025-12-06 | 5.29 | 5.29 | No |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **18** fights. Severity: **1.38**. Frequency: **0.71**. Prime-volume floor: **0.75**. Pre-division magnitude: **2.09**. Division discount: **0.0%**. Final penalty: **-2.08**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Base | Finish extra | Raw event | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2018-01-20 | Dustin Ortiz | pre-prime | top-ten | home | No | Yes | -1.25 | 0 | -1.25 | standard rule |
| 2019-07-27 | Deiveson Figueiredo | pre-prime | top-five | home | No | Yes | -0.75 | 0 | -0.75 | standard rule |
| 2020-07-19 | Askar Askarov | pre-prime | top-five | home | No | Yes | -0.75 | 0 | -0.75 | standard rule |
| 2025-12-06 | Joshua Van | prime | top-five | home | No | Yes | -1.5 | 0 | -1.5 | standard rule |

#### Division-strength context

Default division key: **modern-flyweight-0.90**. Era-ledger division multiplier: **0.95**. Division-era modifier: **-0.75**.

Modern flyweight receives a modest depth discount.

#### Key judgment calls

- **Prime window:** Manel Kape → Joshua Van.
- **Coverage:** Complete official UFC ledger through Joshua Van. TUF exhibitions excluded.
- **Prime endpoint:** Van is the current endpoint.

#### Why ranked here

Four successful defenses turn Pantoja from a strong champion into a real all-time case. He won the belt from Brandon Moreno, beat Brandon Royval twice, and finished Kai Asakura and Kai Kara-France during an eight-fight UFC winning streak.

#### Why not ranked higher?

His championship run is excellent but still far shorter than Demetrious Johnson’s historic reign. Modern flyweight also receives a modest depth discount, while four UFC losses leave less separation than the very top GOAT resumes.

#### Compare-mode guidance

- **Best counterargument:** His strongest argument is direct modern flyweight proof: he repeatedly beat the contenders who defined the post-DJ division.
- **Why this résumé can still win:** Pantoja beats shorter or thinner champion cases because four defenses are backed by repeated elite wins, not one isolated title moment.

#### Final takeaway

Pantoja owns the strongest UFC flyweight championship case after Demetrious Johnson: five title-fight wins, four defenses, and an eight-fight winning streak through the modern division.

_Ledger verified through 2026-07-15. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

### 32. Leon Edwards — 89 OVR

A patient welterweight champion whose two victories over Kamaru Usman, three title-fight wins, and long ranked ledger created a serious modern résumé.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 47.77 | 14-5, 1 NC | Welterweight | 3 | 2.9 | 4 | 5-1, 1 NC | 64.5% | 4.87 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 5.98 | 35 | 6.98 |
| Opponent Quality | 21.01 | 25 | 17.51 |
| Prime Dominance | 16.4 | 30 | 16.4 |
| Longevity | 15.95 | 10 | 5.32 |

Base score: **46.21**. Modifiers: Apex **+4.11**, Loss Penalty **-2.61**, Division-Era Depth **+0.06**. Final raw score: **47.77**.

OVR conversion: 18.68–101.92 board anchors, normalized score **0.349471**, curved score **0.409166**, resulting in **89 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 5.98 | #33 | 2.9 adjusted credit / 14.54 benchmark |
| Opponent Quality | 21.01 | #23 | 9.88 diminished credit / 14.1 benchmark |
| Prime Dominance | 16.4 | #59 | 16.4 raw × 100.0% sample |
| Longevity | 15.95 | #24 | 76.58 counted elite months |
| Apex | +4.11 | Modifier | The title-winning knockout carries enormous Proof, but losing most of the first fight sharply reduces its performance rating; Claim and Aura remain deliberately conservative. |
| Loss Penalty | -2.61 | Modifier | 5 official/technical loss events reviewed |
| Division-Era Depth | +0.06 | Modifier | Add the missing empirical welterweight row using the pinned source, approved quarterly mechanics, and the Cody-approved shared Fighter Era Ledger window from Rafael dos Anjos through Sean Brady. |

#### Championship receipts

UFC title-fight wins: **3**. Adjusted title wins: **2.9**. Derived undisputed-title win count: **3**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 2022-08-20 | Kamaru Usman | normal | 1 | 1 | 1 | Full Championship credit for dethroning the reigning welterweight champion. |
| 2023-03-18 | Kamaru Usman | normal | 1 | 1 | 0.95 | Cody-approved modest five-percent repeat-opponent and immediate-trilogy context discount. |
| 2023-12-16 | Colby Covington | normal | 1 | 1 | 0.95 | Cody-approved modest five-percent challenger and fight-context discount while preserving full title-defense significance. |

#### Opponent Quality receipts

Raw win credit: **11.4**. Diminishing-return credit before fighter adjustment: **9.88**. Fighter adjustment: **0**. Final diminished credit: **9.88**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2022-08-20 | Kamaru Usman | champion-level | 1.25 | 1 | 1.25 | Canonical reviewed opponent-quality tier. |
| 2 | 2023-03-18 | Kamaru Usman | champion-level | 1.25 | 1 | 1.25 | Canonical reviewed opponent-quality tier. |
| 3 | 2019-07-20 | Rafael dos Anjos | top-five | 1 | 1 | 1 | Canonical reviewed opponent-quality tier. |
| 4 | 2023-12-16 | Colby Covington | top-five | 1 | 1 | 1 | Canonical reviewed opponent-quality tier. |
| 5 | 2016-10-08 | Albert Tumenov | top-ten | 0.85 | 1 | 0.85 | Canonical reviewed opponent-quality tier. |
| 6 | 2017-03-18 | Vicente Luque | top-ten | 0.85 | 1 | 0.85 | Canonical reviewed opponent-quality tier. |
| 7 | 2018-06-23 | Donald Cerrone | top-ten | 0.85 | 0.75 | 0.64 | Canonical reviewed opponent-quality tier. |
| 8 | 2019-03-16 | Gunnar Nelson | top-ten | 0.85 | 0.75 | 0.64 | Canonical reviewed opponent-quality tier. |
| 9 | 2021-06-12 | Nate Diaz | top-ten | 0.85 | 0.75 | 0.64 | Canonical reviewed opponent-quality tier. |
| 10 | 2017-09-02 | Bryan Barberena | ranked | 0.65 | 0.75 | 0.49 | Canonical reviewed opponent-quality tier. |
| 11 | 2018-03-17 | Peter Sobotta | ranked | 0.65 | 0.75 | 0.49 | Canonical reviewed opponent-quality tier. |
| 12 | 2015-04-11 | Seth Baczynski | solid | 0.45 | 0.75 | 0.34 | Canonical reviewed opponent-quality tier. |
| 13 | 2015-07-18 | Pawel Pawlak | solid | 0.45 | 0.5 | 0.23 | Canonical reviewed opponent-quality tier. |
| 14 | 2016-05-08 | Dominic Waters | solid | 0.45 | 0.5 | 0.23 | Canonical reviewed opponent-quality tier. |

#### Prime Dominance receipts

Prime window: **Rafael dos Anjos → Sean Brady**. Prime record: **5-1, 1 NC**. Effective samples: **7**. Sample multiplier: **100.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 6.43 | 5-2; 71.4% |
| Round control | 5.03 | 55.9%; rounds 19-15 |
| Finish pressure | 0.5 | 1 finishes; 14.3% |
| Elite-level validation | 4.44 | 6 elite-stage fights; 4.44 points |
| Raw prime score | 16.4 | Before sample multiplier |
| Final Prime Dominance | 16.4 | 16.4 × 1 |

#### Longevity receipts

Active elite years: **4.87**. Raw calendar months: **68.1**. Gap-adjusted months: **66.3**. Status multiplier: **1.1**. Division multiplier: **1.05**. Counted elite months: **76.58**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 2019-07-20 | 2021-03-13 | 19.78 | 18 | Yes |
| 2021-03-13 | 2021-06-12 | 2.99 | 2.99 | No |
| 2021-06-12 | 2022-08-20 | 14.26 | 14.26 | No |
| 2022-08-20 | 2023-03-18 | 6.9 | 6.9 | No |
| 2023-03-18 | 2023-12-16 | 8.97 | 8.97 | No |
| 2023-12-16 | 2024-07-27 | 7.36 | 7.36 | No |
| 2024-07-27 | 2025-03-22 | 7.82 | 7.82 | No |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **18** fights. Severity: **1.88**. Frequency: **0.96**. Prime-volume floor: **1.75**. Pre-division magnitude: **2.84**. Division discount: **8.0%**. Final penalty: **-2.61**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Base | Finish extra | Raw event | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2014-11-08 | Claudio Silva | pre-prime | ranked | home | No | Yes | -1.25 | 0 | -1.25 | standard rule |
| 2015-12-19 | Kamaru Usman | pre-prime | top-five | home | No | Yes | -0.75 | 0 | -0.75 | standard rule |
| 2024-07-27 | Belal Muhammad | prime | champion-level | home | No | Yes | -1.5 | 0 | -1.5 | standard rule |
| 2025-03-22 | Sean Brady | prime | top-five | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2025-11-15 | Carlos Prates | post-prime | top-five | home | Yes | Yes | 0 | 0 | 0 | standard rule |

#### Division-strength context

Default division key: **modern-welterweight-1.02**. Era-ledger division multiplier: **1.05**. Division-era modifier: **+0.06**.

Rafael dos Anjos through Sean Brady with all gaps capped at 18 months.

#### Key judgment calls

- **Prime window:** Rafael dos Anjos → Sean Brady.
- **Coverage:** Complete UFC-only ledger through UFC 322 on 2025-11-15. No later completed UFC bout found; non-UFC fights excluded.
- **Prime endpoint:** Rafael dos Anjos begins the connected UFC elite run. Muhammad did not close it because Edwards remained elite and fought Brady; Brady is the unrecovered endpoint.

#### Why ranked here

Edwards ranks here because he paired a long climb through the welterweight rankings with championship proof at the very top. He dethroned Kamaru Usman with one of the sport’s greatest late knockouts, beat him again over five rounds, defended against Colby Covington, and accumulated eleven ranked UFC wins across a durable elite run.

#### Why not ranked higher?

He does not rank higher because the reign stopped at three title-fight wins, his finishing rate is modest, and the Belal Muhammad title loss followed by the Sean Brady submission weakened the back end of the prime. His résumé is deep, but it lacks the title volume and sustained control of the welterweight legends above him.

#### Final takeaway

Edwards ranks here because he paired a long climb through the welterweight rankings with championship proof at the very top. He dethroned Kamaru Usman with one of the sport’s greatest late knockouts, beat him again over five rounds, defended against Colby Covington, and accumulated eleven ranked UFC wins across a durable elite run.

_Ledger verified through 2026-07-13. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

### 33. Tito Ortiz — 89 OVR

A five-defense early UFC light heavyweight king with real title volume, huge star aura, and a ceiling capped by era strength plus Randy/Chuck losses.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 47.75 | 15-11-1 | Light Heavyweight / Heavyweight | 6 | 5.11 | 4 | 11-3 | 62.2% | 6.71 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 10.54 | 35 | 12.3 |
| Opponent Quality | 14.44 | 25 | 12.03 |
| Prime Dominance | 18.95 | 30 | 18.95 |
| Longevity | 21.89 | 10 | 7.3 |

Base score: **50.58**. Modifiers: Apex **+3.99**, Loss Penalty **-3.82**, Division-Era Depth **-3**. Final raw score: **47.75**.

OVR conversion: 18.68–101.92 board anchors, normalized score **0.349231**, curved score **0.408927**, resulting in **89 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 10.54 | #15 | 5.11 adjusted credit / 14.54 benchmark |
| Opponent Quality | 14.44 | #50 | 6.79 diminished credit / 14.1 benchmark |
| Prime Dominance | 18.95 | #41 | 18.95 raw × 100.0% sample |
| Longevity | 21.89 | #8 | 105.08 counted elite months |
| Apex | +3.99 | Modifier | Early UFC LHW title apex. |
| Loss Penalty | -3.82 | Modifier | 11 official/technical loss events reviewed |
| Division-Era Depth | -3 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **6**. Adjusted title wins: **5.11**. Derived undisputed-title win count: **6**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 2000-04-14 | Wanderlei Silva | vacant-undisputed | 0.9 | 0.95 | 0.86 | Old-era vacant title context. |
| 2000-12-16 | Yuki Kondo | normal | 1 | 0.85 | 0.85 | Old-era/softer title challenger. |
| 2001-02-23 | Evan Tanner | normal | 1 | 0.9 | 0.9 | locked |
| 2001-06-29 | Elvis Sinosic | normal | 1 | 0.75 | 0.75 | Clearly softer title challenger floor. |
| 2001-09-28 | Vladimir Matyushenko | normal | 1 | 0.9 | 0.9 | locked |
| 2002-11-22 | Ken Shamrock | normal | 1 | 0.85 | 0.85 | Name value, timing/age discount. |

#### Opponent Quality receipts

Raw win credit: **7.7**. Diminishing-return credit before fighter adjustment: **6.79**. Fighter adjustment: **0**. Final diminished credit: **6.79**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2005-02-05 | Vitor Belfort | top-ten | 0.9 | 1 | 0.9 | Elite UFC light heavyweight name and dangerous opponent; close decision context keeps it below true top-five credit. |
| 2 | 2000-04-14 | Wanderlei Silva | top-ten | 0.85 | 1 | 0.85 | Major early UFC title win over a dangerous opponent before his later non-UFC peak. |
| 3 | 2006-04-15 | Forrest Griffin | top-ten | 0.8 | 1 | 0.8 | Strong UFC win that aged well; close decision context trims the credit. |
| 4 | 2002-11-22 | Ken Shamrock | top-ten | 0.75 | 1 | 0.75 | Major-name UFC title defense, meaningfully discounted for age and timing. |
| 5 | 2001-02-23 | Evan Tanner | ranked | 0.7 | 1 | 0.7 | Meaningful title defense over a high-level opponent and future UFC champion, with early-era timing context. |
| 6 | 2001-09-28 | Vladimir Matyushenko | ranked | 0.65 | 1 | 0.65 | Solid ranked title challenger and credible early-era contender. |
| 7 | 2011-07-02 | Ryan Bader | ranked | 0.65 | 0.75 | 0.49 | Late-career upset over a strong contender; valuable but does not restart Tito’s prime. |
| 8 | 2004-10-22 | Patrick Cote | solid | 0.45 | 0.75 | 0.34 | Useful supporting UFC light heavyweight win. |
| 9 | 1999-03-05 | Guy Mezger | solid | 0.4 | 0.75 | 0.3 | Early UFC rivalry win; only the UFC result is scored. |
| 10 | 2000-12-16 | Yuki Kondo | solid | 0.4 | 0.75 | 0.3 | Title defense with substantial early-era opponent-strength discount. |
| 11 | 2006-07-08 | Ken Shamrock | name-value | 0.3 | 0.75 | 0.23 | Repeat rivalry win with a heavy age and timing discount. |
| 12 | 1998-03-13 | Jerry Bohlander | name-value | 0.25 | 0.75 | 0.19 | Supporting early UFC win with limited quality value. |
| 13 | 2001-06-29 | Elvis Sinosic | name-value | 0.25 | 0.5 | 0.13 | Weak title-defense opponent with limited quality value. |
| 14 | 2006-10-10 | Ken Shamrock | name-value | 0.25 | 0.5 | 0.13 | Third rivalry bout; repeat and timing context cap the credit. |
| 15 | 1997-05-30 | Wes Albritton | minimal | 0.1 | 0.5 | 0.05 | Early UFC tournament win with minimal opponent-quality value. |

#### Prime Dominance receipts

Prime window: **Wanderlei Silva → Lyoto Machida**. Prime record: **11-3**. Effective samples: **16**. Sample multiplier: **100.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 6.47 | 11-4-1; 71.9% |
| Round control | 5.23 | 58.1%; rounds 25-18 |
| Finish pressure | 2 | 6 finishes; 37.5% |
| Elite-level validation | 5.25 | 13 elite-stage fights; 5.25 points |
| Raw prime score | 18.95 | Before sample multiplier |
| Final Prime Dominance | 18.95 | 18.95 × 1 |

#### Longevity receipts

Active elite years: **6.71**. Raw calendar months: **97.3**. Gap-adjusted months: **97.3**. Status multiplier: **1.08**. Division multiplier: **1**. Counted elite months: **105.08**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 2000-04-14 | 2000-12-16 | 8.08 | 8.08 | No |
| 2000-12-16 | 2001-02-23 | 2.27 | 2.27 | No |
| 2001-02-23 | 2001-06-29 | 4.14 | 4.14 | No |
| 2001-06-29 | 2001-09-28 | 2.99 | 2.99 | No |
| 2001-09-28 | 2002-11-22 | 13.8 | 13.8 | No |
| 2002-11-22 | 2003-09-26 | 10.12 | 10.12 | No |
| 2003-09-26 | 2004-04-02 | 6.21 | 6.21 | No |
| 2004-04-02 | 2004-10-22 | 6.67 | 6.67 | No |
| 2004-10-22 | 2005-02-05 | 3.48 | 3.48 | No |
| 2005-02-05 | 2006-04-15 | 14.26 | 14.26 | No |
| 2006-04-15 | 2006-07-08 | 2.76 | 2.76 | No |
| 2006-07-08 | 2006-10-10 | 3.09 | 3.09 | No |
| 2006-10-10 | 2006-12-30 | 2.66 | 2.66 | No |
| 2006-12-30 | 2007-07-07 | 6.21 | 6.21 | No |
| 2007-07-07 | 2008-05-24 | 10.58 | 10.58 | No |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **21** fights. Severity: **2.25**. Frequency: **1.57**. Prime-volume floor: **3.5**. Pre-division magnitude: **3.82**. Division discount: **0.0%**. Final penalty: **-3.82**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Base | Finish extra | Raw event | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1997-05-30 | Guy Mezger | pre-prime | solid | home | Yes | Yes | -1.25 | -0.75 | -2 | standard rule |
| 1999-09-24 | Frank Shamrock | pre-prime | champion-level | home | Yes | Yes | -0.75 | -0.75 | -1.5 | standard rule |
| 2003-09-26 | Randy Couture | prime | champion-level | home | No | Yes | -1.5 | 0 | -1.5 | standard rule |
| 2004-04-02 | Chuck Liddell | prime | top-five | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2006-12-30 | Chuck Liddell | prime | champion-level | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2008-05-24 | Lyoto Machida | prime | top-five | home | No | Yes | -1.5 | 0 | -1.5 | standard rule |
| 2009-11-21 | Forrest Griffin | post-prime | top-five | home | No | Yes | 0 | 0 | 0 | standard rule |
| 2010-10-23 | Matt Hamill | post-prime | top-ten | home | No | Yes | 0 | 0 | 0 | standard rule |
| 2011-08-06 | Rashad Evans | post-prime | top-five | home | Yes | Yes | 0 | 0 | 0 | standard rule |
| 2011-12-10 | Antonio Rogerio Nogueira | post-prime | top-ten | home | Yes | Yes | 0 | 0 | 0 | standard rule |
| 2012-07-07 | Forrest Griffin | post-prime | top-ten | home | No | Yes | 0 | 0 | 0 | standard rule |

#### Division-strength context

Default division key: **early-light-heavyweight-0.92**. Era-ledger division multiplier: **1**. Division-era modifier: **-3**.

Wanderlei Silva through Lyoto Machida with every inactivity gap capped at 18 months.

#### Key judgment calls

- **Five defenses:** Real UFC championship volume, discounted for early-era depth rather than ignored.
- **Chuck rivalry:** The rivalry is historically huge, but two prime/late-prime finish losses are major scoring damage.
- **Randy loss:** A clean title loss to a champion/top-5 level opponent cuts the reign off clearly.
- **Opponent quality:** Famous names are useful, but timing and early-era strength keep Quality Wins controlled.

#### Why ranked here

Ortiz ranks here because five UFC title defenses are too much championship volume to bury. Even after early-era discounts, his title reign gives him more championship meat than most short-window champions.

#### Why not ranked higher?

He does not rank higher because the defense slate is not as strong as later elite reigns, the early light heavyweight division gets a depth discount, and the prime losses to Randy Couture and Chuck Liddell clearly cap the best-light-heavyweight claim.

#### Compare-mode guidance

- **Best counterargument:** The counterargument is era depth: the defense count is big, but the opponent slate and Chuck/Randy losses cap the all-time ceiling.
- **Why this résumé can still win:** Ortiz wins comparisons when championship volume matters more than modern depth or cleaner prime loss profiles.

#### Final takeaway

Ortiz is a real UFC-only title-volume case. He belongs above many short-title and contender-heavy resumes, but below deeper modern champion resumes with better opponent quality and cleaner prime dominance.

_Ledger verified through 2026-07-13. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

### 34. Ilia Topuria — 89 OVR

The new-era takeover case: massive featherweight legend wins, elite finishing threat, and one current-table Gaethje loss adding the first real blemish.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 47.63 | 9-1 | Featherweight / Lightweight | 3 | 3.04 | 4 | 4-1 | 66.7% | 3.05 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 6.27 | 35 | 7.31 |
| Opponent Quality | 14.71 | 25 | 12.26 |
| Prime Dominance | 21.5 | 30 | 21.5 |
| Longevity | 10.09 | 10 | 3.36 |

Base score: **44.43**. Modifiers: Apex **+5.95**, Loss Penalty **-2.75**, Division-Era Depth **-0.01**. Final raw score: **47.63**.

OVR conversion: 18.68–101.92 board anchors, normalized score **0.347790**, curved score **0.407492**, resulting in **89 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 6.27 | #30 | 3.04 adjusted credit / 14.54 benchmark |
| Opponent Quality | 14.71 | #49 | 6.91 diminished credit / 14.1 benchmark |
| Prime Dominance | 21.5 | #23 | 22.63 raw × 95.0% sample |
| Longevity | 10.09 | #50 | 48.41 counted elite months |
| Apex | +5.95 | Modifier | Volkanovski plus Oliveira is monster UFC peak proof. |
| Loss Penalty | -2.75 | Modifier | 1 official/technical loss events reviewed |
| Division-Era Depth | -0.01 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **3**. Adjusted title wins: **3.04**. Derived undisputed-title win count: **3**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 2024-02-17 | Alexander Volkanovski | normal | 1 | 1 | 1 | locked |
| 2024-10-26 | Max Holloway | normal | 1 | 0.95 | 0.95 | locked |
| 2025-06-28 | Charles Oliveira | vacant-second-division | 1.15 | 0.95 | 1.09 | Current-table vacant second-division title context. |

#### Opponent Quality receipts

Raw win credit: **7.2**. Diminishing-return credit before fighter adjustment: **6.91**. Fighter adjustment: **0**. Final diminished credit: **6.91**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2024-02-17 | Alexander Volkanovski | champion-level | 1.25 | 1 | 1.25 | Stopped the reigning UFC featherweight champion and all-time great. |
| 2 | 2024-10-26 | Max Holloway | champion-level | 1.25 | 1 | 1.25 | Elite former UFC featherweight champion and divisional great. |
| 3 | 2025-06-28 | Charles Oliveira | champion-level | 1.25 | 1 | 1.25 | Elite former lightweight champion defeated in a five-round UFC title fight. |
| 4 | 2023-06-24 | Josh Emmett | top-five | 1 | 1 | 1 | Five-round win over a prime top featherweight contender. |
| 5 | 2022-12-10 | Bryce Mitchell | top-ten | 0.85 | 1 | 0.85 | Undefeated ranked featherweight contender submitted during Topuria’s rise. |
| 6 | 2020-12-05 | Damon Jackson | solid | 0.45 | 1 | 0.45 | Solid UFC featherweight win. |
| 7 | 2021-07-10 | Ryan Hall | solid | 0.45 | 0.75 | 0.34 | Dangerous specialist and credible UFC featherweight win. |
| 8 | 2022-03-19 | Jai Herbert | solid | 0.45 | 0.75 | 0.34 | Useful upward-division UFC lightweight win. |
| 9 | 2020-10-10 | Youssef Zalal | name-value | 0.25 | 0.75 | 0.19 | Early UFC win before either fighter reached ranked contention. |

#### Prime Dominance receipts

Prime window: **Bryce Mitchell → Current title-level form**. Prime record: **4-1**. Effective samples: **6**. Sample multiplier: **95.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 7.5 | 5-1; 83.3% |
| Round control | 6.35 | 70.6%; rounds 12-5 |
| Finish pressure | 4 | 4 finishes; 66.7% |
| Elite-level validation | 4.78 | 5 elite-stage fights; 4.78 points |
| Raw prime score | 22.63 | Before sample multiplier |
| Final Prime Dominance | 21.5 | 22.63 × 0.95 |

#### Longevity receipts

Active elite years: **3.05**. Raw calendar months: **43.1**. Gap-adjusted months: **43.1**. Status multiplier: **1.08**. Division multiplier: **1.04**. Counted elite months: **48.41**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 2022-12-10 | 2023-06-24 | 6.44 | 6.44 | No |
| 2023-06-24 | 2024-02-17 | 7.82 | 7.82 | No |
| 2024-02-17 | 2024-10-26 | 8.28 | 8.28 | No |
| 2024-10-26 | 2025-06-28 | 8.05 | 8.05 | No |
| 2025-06-28 | 2026-06-14 | 11.53 | 11.53 | No |
| 2026-06-14 | 2026-07-13 | 0.95 | 0.95 | No |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **10** fights. Severity: **2.25**. Frequency: **0.68**. Prime-volume floor: **1**. Pre-division magnitude: **2.93**. Division discount: **6.0%**. Final penalty: **-2.75**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Base | Finish extra | Raw event | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2026-06-14 | Justin Gaethje | prime | champion-level | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |

#### Division-strength context

Default division key: **topuria-modern-fw-lw-1.075**. Era-ledger division multiplier: **1.04**. Division-era modifier: **-0.01**.

Bryce Mitchell through current title-level form.

#### Key judgment calls

- **Volkanovski and Holloway wins:** carry huge featherweight historical value.
- **Gaethje loss:** counts as the first UFC blemish and is handled as prime elite-loss context.
- **Short sample:** keeps longevity and championship volume below the long-reign champions.
- **Current trajectory:** his ceiling is very high, but the ranking still scores what has happened.
- **Division context:** modern featherweight strength helps the quality-win case.

#### Why ranked here

Topuria ranks #15 because the high end is already enormous. Beating Volkanovski and Holloway gives him direct value against featherweight history, and his fast title rise gives the profile a real peak-dominance lane.

#### Why not ranked higher?

He does not rank higher yet because the championship volume and active elite years are still early, and the current-table Gaethje loss adds the first real blemish. The resume is loud, but it has not had time to become a long reign or deep all-time body of work.

#### Compare-mode guidance

- **Best counterargument:** The argument against Topuria is that he is still early. The top wins are huge, but he has not had time to build a long title reign, and the Gaethje loss makes the case less clean.
- **Why this résumé can still win:** Topuria wins comparisons when current peak value and direct wins over featherweight legends outweigh older fighters’ longer volume.

#### Final takeaway

Topuria is the fast-rising new-era case: huge high-end wins and elite peak signals already, with the Gaethje loss and short title volume keeping him below the long-reign greats for now.

_Ledger verified through 2026-07-13. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

### 35. Tyron Woodley — 89 OVR

A real UFC welterweight champion case: Lawler, Wonderboy, Maia, and Till title value, with Burns included as the end of the prime window.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 47.49 | 9-6-1 | Welterweight | 4 | 3.65 | 6 | 7-2-1 | 59.4% | 4.96 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 7.53 | 35 | 8.79 |
| Opponent Quality | 14.81 | 25 | 12.34 |
| Prime Dominance | 19.57 | 30 | 19.57 |
| Longevity | 13.41 | 10 | 4.47 |

Base score: **45.17**. Modifiers: Apex **+4.69**, Loss Penalty **-2.37**, Division-Era Depth **0**. Final raw score: **47.49**.

OVR conversion: 18.68–101.92 board anchors, normalized score **0.346108**, curved score **0.405816**, resulting in **89 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 7.53 | #26 | 3.65 adjusted credit / 14.54 benchmark |
| Opponent Quality | 14.81 | #48 | 6.96 diminished credit / 14.1 benchmark |
| Prime Dominance | 19.57 | #35 | 19.57 raw × 100.0% sample |
| Longevity | 13.41 | #33 | 64.37 counted elite months |
| Apex | +4.69 | Modifier | The Lawler knockout is elite, while the low-output Thompson rematch keeps separation, Claim, and Aura contained. |
| Loss Penalty | -2.37 | Modifier | 6 official/technical loss events reviewed |
| Division-Era Depth | 0 | Modifier | Treat Woodley-era welterweight as neutral. The measured +0.21 is too small and too sensitive to justify an affirmative GOAT bonus. |

#### Championship receipts

UFC title-fight wins: **4**. Adjusted title wins: **3.65**. Derived undisputed-title win count: **4**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 2016-07-30 | Robbie Lawler | normal | 1 | 1 | 1 | locked |
| 2017-03-04 | Stephen Thompson | normal | 1 | 0.9 | 0.9 | locked |
| 2017-07-29 | Demian Maia | normal | 1 | 0.9 | 0.9 | locked |
| 2018-09-08 | Darren Till | normal | 1 | 0.85 | 0.85 | locked |

#### Opponent Quality receipts

Raw win credit: **7.35**. Diminishing-return credit before fighter adjustment: **6.96**. Fighter adjustment: **0**. Final diminished credit: **6.96**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2016-07-30 | Robbie Lawler | champion-level | 1.25 | 1 | 1.25 | UFC welterweight champion and elite title opponent. |
| 2 | 2017-03-04 | Stephen Thompson | top-five | 1 | 1 | 1 | Elite welterweight title challenger. |
| 3 | 2018-09-08 | Darren Till | top-five | 1 | 1 | 1 | Undefeated top welterweight title challenger. |
| 4 | 2014-03-15 | Carlos Condit | top-five | 0.85 | 1 | 0.85 | Top-five welterweight win discounted because the finish came through Condit’s knee injury. |
| 5 | 2015-01-31 | Kelvin Gastelum | top-five | 0.85 | 1 | 0.85 | Top-five contender base tier retained; final credit remains discounted for catchweight and razor-thin split-decision context. |
| 6 | 2017-07-29 | Demian Maia | top-five | 0.85 | 1 | 0.85 | Top-five title challenger base tier retained; final credit remains discounted for late-career and short-turnaround context. |
| 7 | 2014-08-23 | Dong Hyun Kim | ranked | 0.65 | 0.75 | 0.49 | Quality ranked welterweight win. |
| 8 | 2013-02-02 | Jay Hieron | solid | 0.45 | 0.75 | 0.34 | Solid UFC welterweight win. |
| 9 | 2013-11-16 | Josh Koscheck | ranked | 0.45 | 0.75 | 0.34 | Former top contender discounted to supporting-win value because of clear late-career timing. |

#### Prime Dominance receipts

Prime window: **Carlos Condit → Kamaru Usman**. Prime record: **7-2-1**. Effective samples: **10**. Sample multiplier: **100.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 6.75 | 7-2-1; 75.0% |
| Round control | 5.34 | 59.4%; rounds 19-13 |
| Finish pressure | 2 | 4 finishes; 40.0% |
| Elite-level validation | 5.48 | 9 elite-stage fights; 5.48 points |
| Raw prime score | 19.57 | Before sample multiplier |
| Final Prime Dominance | 19.57 | 19.57 × 1 |

#### Longevity receipts

Active elite years: **4.96**. Raw calendar months: **59.6**. Gap-adjusted months: **59.6**. Status multiplier: **1.08**. Division multiplier: **1**. Counted elite months: **64.37**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 2014-03-15 | 2014-06-14 | 2.99 | 2.99 | No |
| 2014-06-14 | 2014-08-23 | 2.3 | 2.3 | No |
| 2014-08-23 | 2015-01-31 | 5.29 | 5.29 | No |
| 2015-01-31 | 2016-07-30 | 17.94 | 17.94 | No |
| 2016-07-30 | 2016-11-12 | 3.45 | 3.45 | No |
| 2016-11-12 | 2017-03-04 | 3.68 | 3.68 | No |
| 2017-03-04 | 2017-07-29 | 4.83 | 4.83 | No |
| 2017-07-29 | 2018-09-08 | 13.34 | 13.34 | No |
| 2018-09-08 | 2019-03-02 | 5.75 | 5.75 | No |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **13** fights. Severity: **1.5**. Frequency: **0.87**. Prime-volume floor: **1.5**. Pre-division magnitude: **2.37**. Division discount: **0.0%**. Final penalty: **-2.37**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Base | Finish extra | Raw event | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2013-06-15 | Jake Shields | pre-prime | top-five | home | No | Yes | -0.75 | 0 | -0.75 | standard rule |
| 2014-06-14 | Rory MacDonald | prime | top-five | home | No | Yes | -1.5 | 0 | -1.5 | standard rule |
| 2019-03-02 | Kamaru Usman | prime | champion-level | home | No | Yes | -1.5 | 0 | -1.5 | standard rule |
| 2020-05-30 | Gilbert Burns | post-prime | top-five | home | No | Yes | 0 | 0 | 0 | standard rule |
| 2020-09-19 | Colby Covington | post-prime | top-five | home | Yes | Yes | 0 | 0 | 0 | standard rule |
| 2021-03-27 | Vicente Luque | post-prime | top-five | home | Yes | Yes | 0 | 0 | 0 | standard rule |

#### Division-strength context

Default division key: **woodley-welterweight-neutral-1.00**. Era-ledger division multiplier: **1**. Division-era modifier: **0**.

Cody-approved Woodley audit: treat his welterweight era as neutral rather than bonus-strength context.

#### Key judgment calls

- **Lawler title win:** Big championship and apex proof.
- **Wonderboy rematch:** Full title-defense credit, but close-fight context keeps dominance down.
- **Maia defense:** Strong title defense value, lower dominance/aesthetic credit.
- **Burns loss:** Now counted as an end-of-prime elite decision loss.

#### Why ranked here

Woodley ranks here because his UFC-only title resume is stronger than casual memory usually gives it credit for: he won the welterweight belt and added multiple title-level results before Usman ended the prime window and Burns confirmed the decline.

#### Why not ranked higher?

He does not rank higher because the resume depth falls off after the title names, the round-control profile was inconsistent, and Usman clearly ended the prime window, while Burns confirmed the decline.

#### Compare-mode guidance

- **Best counterargument:** The counterargument is that his reign had too many low-output stretches and Usman ended the prime window and Burns confirmed the decline.
- **Why this résumé can still win:** Woodley wins comparisons when title-fight wins and champion durability matter more than pace/aesthetics.

#### Final takeaway

Woodley is not an inner-circle GOAT, but he belongs above most short-reign champion cases because the UFC title resume is too strong to bury.

_Ledger verified through 2026-07-13. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

### 36. Fabricio Werdum — 89 OVR

A complete heavyweight champion whose submission of Cain Velasquez crowned a deep six-year run of elite wins, finishes, and high-level round control.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 47.38 | 12-6 | Heavyweight | 2 | 1.65 | 5 | 9-3 | 78.8% | 6.11 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 3.4 | 35 | 3.97 |
| Opponent Quality | 20.37 | 25 | 16.98 |
| Prime Dominance | 20.8 | 30 | 20.8 |
| Longevity | 15.27 | 10 | 5.09 |

Base score: **46.84**. Modifiers: Apex **+5.17**, Loss Penalty **-3.8**, Division-Era Depth **-0.83**. Final raw score: **47.38**.

OVR conversion: 18.68–101.92 board anchors, normalized score **0.344786**, curved score **0.404499**, resulting in **89 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 3.4 | #52 | 1.65 adjusted credit / 14.54 benchmark |
| Opponent Quality | 20.37 | #25 | 9.57 diminished credit / 14.1 benchmark |
| Prime Dominance | 20.8 | #28 | 20.8 raw × 100.0% sample |
| Longevity | 15.27 | #27 | 73.28 counted elite months |
| Apex | +5.17 | Modifier | The Cain upset supplies elite proof and a real best-heavyweight claim, supported by the interim-title Hunt finish. |
| Loss Penalty | -3.8 | Modifier | 6 official/technical loss events reviewed |
| Division-Era Depth | -0.83 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **2**. Adjusted title wins: **1.65**. Derived undisputed-title win count: **1**. Interim-title win count: **1**.

| Date | Opponent | Title type | Base | Opponent strength | Final credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 2014-11-15 | Mark Hunt | interim | 0.75 | 1 | 0.75 | Approved aggregate Championship score recovered from the live control; exact historical per-fight split was not stored. |
| 2015-06-13 | Cain Velasquez | normal | 1 | 0.9 | 0.9 | Approved aggregate Championship score recovered from the live control; exact historical per-fight split was not stored. |

#### Opponent Quality receipts

Raw win credit: **10.65**. Diminishing-return credit before fighter adjustment: **9.57**. Fighter adjustment: **0**. Final diminished credit: **9.57**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2013-06-08 | Antônio Rodrigo Nogueira | champion-level | 1.25 | 1 | 1.25 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 2 | 2015-06-13 | Cain Velasquez | champion-level | 1.25 | 1 | 1.25 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 3 | 2008-01-19 | Gabriel Gonzaga | top-five | 1 | 1 | 1 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 4 | 2014-04-19 | Travis Browne | top-five | 1 | 1 | 1 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 5 | 2014-11-15 | Mark Hunt | top-five | 1 | 1 | 1 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 6 | 2008-06-07 | Brandon Vera | top-ten | 0.85 | 1 | 0.85 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 7 | 2012-02-04 | Roy Nelson | top-ten | 0.85 | 0.75 | 0.64 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 8 | 2016-09-10 | Travis Browne | top-ten | 0.85 | 0.75 | 0.64 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 9 | 2017-11-19 | Marcin Tybura | top-ten | 0.85 | 0.75 | 0.64 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 10 | 2020-07-26 | Alexander Gustafsson | top-ten | 0.85 | 0.75 | 0.64 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 11 | 2012-06-23 | Mike Russow | solid | 0.45 | 0.75 | 0.34 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 12 | 2017-10-07 | Walt Harris | solid | 0.45 | 0.75 | 0.34 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |

#### Prime Dominance receipts

Prime window: **Roy Nelson → Alexander Volkov**. Prime record: **9-3**. Effective samples: **12**. Sample multiplier: **100.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 6.75 | 9-3; 75.0% |
| Round control | 7.09 | 78.8%; rounds 26-7 |
| Finish pressure | 2 | 5 finishes; 41.7% |
| Elite-level validation | 4.96 | 7 elite-stage fights; 4.96 points |
| Raw prime score | 20.8 | Before sample multiplier |
| Final Prime Dominance | 20.8 | 20.8 × 1 |

#### Longevity receipts

Active elite years: **6.11**. Raw calendar months: **73.4**. Gap-adjusted months: **73.4**. Status multiplier: **1.04**. Division multiplier: **0.96**. Counted elite months: **73.28**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 2012-02-04 | 2012-06-23 | 4.6 | 4.6 | No |
| 2012-06-23 | 2013-06-08 | 11.5 | 11.5 | No |
| 2013-06-08 | 2014-04-19 | 10.35 | 10.35 | No |
| 2014-04-19 | 2014-11-15 | 6.9 | 6.9 | No |
| 2014-11-15 | 2015-06-13 | 6.9 | 6.9 | No |
| 2015-06-13 | 2016-05-14 | 11.04 | 11.04 | No |
| 2016-05-14 | 2016-09-10 | 3.91 | 3.91 | No |
| 2016-09-10 | 2017-07-08 | 9.89 | 9.89 | No |
| 2017-07-08 | 2017-10-07 | 2.99 | 2.99 | No |
| 2017-10-07 | 2017-11-19 | 1.41 | 1.41 | No |
| 2017-11-19 | 2018-03-17 | 3.88 | 3.88 | No |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **16** fights. Severity: **2.25**. Frequency: **1.55**. Prime-volume floor: **2.75**. Pre-division magnitude: **3.8**. Division discount: **0.0%**. Final penalty: **-3.8**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Base | Finish extra | Raw event | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2007-04-21 | Andrei Arlovski | pre-prime | champion-level | home | No | Yes | -0.75 | 0 | -0.75 | standard rule |
| 2008-10-25 | Junior dos Santos | pre-prime | champion-level | home | Yes | Yes | -0.75 | -0.75 | -1.5 | standard rule |
| 2016-05-14 | Stipe Miocic | prime | champion-level | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2017-07-08 | Alistair Overeem | prime | champion-level | home | No | Yes | -1.5 | 0 | -1.5 | standard rule |
| 2018-03-17 | Alexander Volkov | prime | top-five | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2020-05-09 | Aleksei Oleinik | post-prime | top-ten | home | No | Yes | 0 | 0 | 0 | standard rule |

#### Division-strength context

Default division key: **heavyweight-0.98**. Era-ledger division multiplier: **0.96**. Division-era modifier: **-0.83**.

Nelson through Volkov.

#### Key judgment calls

- **Prime window:** Roy Nelson → Alexander Volkov.
- **Coverage:** Complete UFC-only ledger.
- **Prime endpoint:** Volkov closes the sustained late UFC heavyweight elite window.

#### Why ranked here

Werdum ranks here because his UFC résumé is much deeper than a one-night title upset. He stopped Mark Hunt for the interim belt, submitted Cain Velasquez for the undisputed championship, beat Antônio Rodrigo Nogueira and Travis Browne, collected ten ranked wins, and maintained a 9-3 prime with strong finishing and round-winning numbers.

#### Why not ranked higher?

He does not rank higher because he recorded only two UFC title-fight wins and never completed an undisputed defense. The Stipe Miocic knockout ended the reign immediately, and later prime losses to Alistair Overeem and Alexander Volkov added further damage. His contender résumé is excellent, but the championship control is too brief for the heavyweight GOAT tier.

#### Final takeaway

Werdum ranks here because his UFC résumé is much deeper than a one-night title upset. He stopped Mark Hunt for the interim belt, submitted Cain Velasquez for the undisputed championship, beat Antônio Rodrigo Nogueira and Travis Browne, collected ten ranked wins, and maintained a 9-3 prime with strong finishing and round-winning numbers.

_Ledger verified through 2026-07-13. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

### 37. Robbie Lawler — 89 OVR

A Hall of Fame welterweight champion whose comeback title run delivered all-time violence and real defenses, capped by close decisions and a short reign.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 47.29 | 14-11, 1 NC | Welterweight / Middleweight | 3 | 2.8 | 6 | 8-2 | 60.0% | 3.43 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 5.78 | 35 | 6.74 |
| Opponent Quality | 20.16 | 25 | 16.8 |
| Prime Dominance | 20.08 | 30 | 20.08 |
| Longevity | 9.28 | 10 | 3.09 |

Base score: **46.71**. Modifiers: Apex **+4.46**, Loss Penalty **-3.74**, Division-Era Depth **-0.14**. Final raw score: **47.29**.

OVR conversion: 18.68–101.92 board anchors, normalized score **0.343705**, curved score **0.403420**, resulting in **89 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 5.78 | #36 | 2.8 adjusted credit / 14.54 benchmark |
| Opponent Quality | 20.16 | #26 | 9.47 diminished credit / 14.1 benchmark |
| Prime Dominance | 20.08 | #31 | 20.08 raw × 100.0% sample |
| Longevity | 9.28 | #53 | 44.55 counted elite months |
| Apex | +4.46 | Modifier | Championship-level Lawler apex with Hendricks II and Rory II proof. |
| Loss Penalty | -3.74 | Modifier | 11 official/technical loss events reviewed |
| Division-Era Depth | -0.14 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **3**. Adjusted title wins: **2.8**. Derived undisputed-title win count: **3**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 2014-12-06 | Johny Hendricks | normal | 1 | 1 | 0.9 | Cody-approved factual correction: Hendricks was the reigning champion. Normal title win with a separate 0.90 close split-decision context adjustment. |
| 2015-07-11 | Rory MacDonald | normal | 1 | 0.95 | 0.95 | locked |
| 2016-01-02 | Carlos Condit | normal | 1 | 0.95 | 0.95 | Close/controversial title defense. |

#### Opponent Quality receipts

Raw win credit: **10.8**. Diminishing-return credit before fighter adjustment: **9.47**. Fighter adjustment: **0**. Final diminished credit: **9.47**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2013-11-16 | Rory MacDonald | champion-level | 1.25 | 1 | 1.25 | Elite welterweight title challenger in an all-time title fight. |
| 2 | 2014-12-06 | Johny Hendricks | champion-level | 1.25 | 1 | 1.25 | Elite welterweight champion-level opponent. |
| 3 | 2014-07-26 | Matt Brown | top-five | 1 | 1 | 1 | Prime top welterweight contender. |
| 4 | 2016-01-02 | Carlos Condit | top-five | 1 | 1 | 1 | Elite welterweight title challenger; close decision context. |
| 5 | 2014-05-24 | Jake Ellenberger | top-ten | 0.85 | 1 | 0.85 | Strong ranked welterweight contender. |
| 6 | 2015-07-11 | Rory MacDonald | top-ten | 0.85 | 1 | 0.85 | Young elite welterweight contender. |
| 7 | 2002-05-10 | Aaron Riley | ranked | 0.65 | 0.75 | 0.49 | Ranked-quality early UFC win. |
| 8 | 2003-11-21 | Chris Lytle | ranked | 0.65 | 0.75 | 0.49 | Ranked-quality welterweight win. |
| 9 | 2013-02-23 | Josh Koscheck | ranked | 0.65 | 0.75 | 0.49 | Former top contender, later-career timing. |
| 10 | 2017-07-29 | Donald Cerrone | ranked | 0.65 | 0.75 | 0.49 | Big-name ranked veteran with timing context. |
| 11 | 2021-09-25 | Nick Diaz | ranked | 0.65 | 0.75 | 0.49 | Early UFC rivalry win over future elite name. |
| 12 | 2023-07-08 | Niko Price | ranked | 0.65 | 0.75 | 0.49 | Ranked-quality late-career welterweight win. |
| 13 | 2013-07-27 | Bobby Voelker | solid | 0.45 | 0.5 | 0.23 | Solid UFC welterweight win. |
| 14 | 2002-11-22 | Tiki Ghosn | name-value | 0.25 | 0.5 | 0.13 | Low-end UFC quality value. |

#### Prime Dominance receipts

Prime window: **Josh Koscheck → Tyron Woodley**. Prime record: **8-2**. Effective samples: **10**. Sample multiplier: **100.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 7.2 | 8-2; 80.0% |
| Round control | 5.4 | 60.0%; rounds 21-14 |
| Finish pressure | 2 | 4 finishes; 40.0% |
| Elite-level validation | 5.48 | 8 elite-stage fights; 5.48 points |
| Raw prime score | 20.08 | Before sample multiplier |
| Final Prime Dominance | 20.08 | 20.08 × 1 |

#### Longevity receipts

Active elite years: **3.43**. Raw calendar months: **41.2**. Gap-adjusted months: **41.2**. Status multiplier: **1.06**. Division multiplier: **1.02**. Counted elite months: **44.55**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 2013-02-23 | 2013-07-27 | 5.06 | 5.06 | No |
| 2013-07-27 | 2013-11-16 | 3.68 | 3.68 | No |
| 2013-11-16 | 2014-03-15 | 3.91 | 3.91 | No |
| 2014-03-15 | 2014-05-24 | 2.3 | 2.3 | No |
| 2014-05-24 | 2014-07-26 | 2.07 | 2.07 | No |
| 2014-07-26 | 2014-12-06 | 4.37 | 4.37 | No |
| 2014-12-06 | 2015-07-11 | 7.13 | 7.13 | No |
| 2015-07-11 | 2016-01-02 | 5.75 | 5.75 | No |
| 2016-01-02 | 2016-07-30 | 6.9 | 6.9 | No |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **16** fights. Severity: **2.13**. Frequency: **1.73**. Prime-volume floor: **1.75**. Pre-division magnitude: **3.86**. Division discount: **3.0%**. Final penalty: **-3.74**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Base | Finish extra | Raw event | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2003-04-25 | Pete Spratt | pre-prime | ranked | home | Yes | Yes | -1.25 | -0.75 | -2 | standard rule |
| 2004-04-02 | Nick Diaz | pre-prime | top-ten | home | Yes | Yes | -1.25 | -0.75 | -2 | standard rule |
| 2004-10-22 | Evan Tanner | pre-prime | top-five | home | Yes | Yes | -0.75 | -0.75 | -1.5 | standard rule |
| 2014-03-15 | Johny Hendricks | prime | champion-level | home | No | Yes | -1.5 | 0 | -1.5 | standard rule |
| 2016-07-30 | Tyron Woodley | prime | champion-level | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2017-12-16 | Rafael dos Anjos | post-prime | top-five | home | No | Yes | 0 | 0 | 0 | standard rule |
| 2019-03-02 | Ben Askren | post-prime | top-five | home | Yes | Yes | 0 | 0 | 0 | standard rule |
| 2019-08-03 | Colby Covington | post-prime | top-five | home | No | Yes | 0 | 0 | 0 | standard rule |
| 2020-08-29 | Neil Magny | post-prime | top-ten | home | No | Yes | 0 | 0 | 0 | standard rule |
| 2022-07-02 | Bryan Barberena | post-prime | ranked | home | Yes | Yes | 0 | 0 | 0 | standard rule |
| 2022-12-10 | Santiago Ponzinibbio | post-prime | ranked | home | Yes | Yes | 0 | 0 | 0 | standard rule |

#### Division-strength context

Default division key: **modern-welterweight-1.00**. Era-ledger division multiplier: **1.02**. Division-era modifier: **-0.14**.

Koscheck through Woodley.

#### Key judgment calls

- **Violence vs dominance:** Lawler’s title run was legendary, but he was not a clean round-to-round controller.
- **Condit defense:** The Condit win stays on the résumé, but with controversy context.
- **Woodley loss:** The Woodley KO is the hard cap on the reign.
- **UFC-only lens:** Strikeforce and Pride context can explain the legend, but the ranking here is built on UFC results.

#### Why ranked here

Lawler lands here because his UFC comeback title run was real: he beat Hendricks for the belt, finished Rory in an all-time defense, and officially defended again against Condit.

#### Why not ranked higher?

He does not rank higher because the reign was short, several title fights were razor-close, and Woodley ended the champion run quickly and violently.

#### Compare-mode guidance

- **Best counterargument:** The counter is cleanliness: close title fights, Woodley KO, and too many losses to climb into cleaner champion tiers.
- **Why this résumé can still win:** Robbie wins comparisons when title-war value, violence, and real defenses matter more than clean control.

#### Final takeaway

Robbie is a real UFC champion and Hall of Fame action legend, but his GOAT case is a title-war case, not a long-dominance case.

_Ledger verified through 2026-07-13. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

### 38. Robert Whittaker — 89 OVR

A former middleweight champion with elite résumé depth, Romero-war proof, and long contender relevance — capped by no defense streak and several elite finish losses.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 47.28 | 18-7 | Middleweight / Welterweight / Light Heavyweight | 1 | 1.46 | 7 | 10-4 | 58.1% | 7.91 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 3.01 | 35 | 3.51 |
| Opponent Quality | 23.46 | 25 | 19.55 |
| Prime Dominance | 17.39 | 30 | 17.39 |
| Longevity | 19.56 | 10 | 6.52 |

Base score: **46.97**. Modifiers: Apex **+4.1**, Loss Penalty **-3.75**, Division-Era Depth **-0.04**. Final raw score: **47.28**.

OVR conversion: 18.68–101.92 board anchors, normalized score **0.343585**, curved score **0.403301**, resulting in **89 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 3.01 | #54 | 1.46 adjusted credit / 14.54 benchmark |
| Opponent Quality | 23.46 | #11 | 11.03 diminished credit / 14.1 benchmark |
| Prime Dominance | 17.39 | #55 | 17.39 raw × 100.0% sample |
| Longevity | 19.56 | #11 | 93.91 counted elite months |
| Apex | +4.1 | Modifier | Legit middleweight apex with Jacare/Romero proof. |
| Loss Penalty | -3.75 | Modifier | 7 official/technical loss events reviewed |
| Division-Era Depth | -0.04 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **1**. Adjusted title wins: **1.46**. Derived undisputed-title win count: **0**. Interim-title win count: **1**.

| Date | Opponent | Title type | Base | Opponent strength | Final credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 2017-07-08 | Yoel Romero | interim | 0.75 | 0.95 | 0.71 | locked |
| 2018-06-09 | Yoel Romero | missed-weight-championship-context | 1 | 1 | 0.75 | Cody-approved special context: Romero missed weight. Championship accomplishment receives 0.75 credit but is not an official UFC title-fight win. |

#### Opponent Quality receipts

Raw win credit: **13.6**. Diminishing-return credit before fighter adjustment: **11.03**. Fighter adjustment: **0**. Final diminished credit: **11.03**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2017-07-08 | Yoel Romero | champion-level | 1.25 | 1 | 1.25 | Elite middleweight title-level opponent. |
| 2 | 2018-06-09 | Yoel Romero | champion-level | 1.25 | 1 | 1.25 | Repeat win over elite middleweight title-level opponent. |
| 3 | 2020-10-24 | Jared Cannonier | top-five | 1 | 1 | 1 | Prime top middleweight contender. |
| 4 | 2022-09-03 | Marvin Vettori | top-five | 1 | 1 | 1 | Top middleweight contender. |
| 5 | 2016-11-27 | Derek Brunson | top-ten | 0.85 | 1 | 0.85 | Strong ranked middleweight contender. |
| 6 | 2017-04-15 | Ronaldo Souza | top-ten | 0.85 | 1 | 0.85 | Elite grappler and ranked middleweight contender. |
| 7 | 2021-04-17 | Kelvin Gastelum | top-ten | 0.85 | 0.75 | 0.64 | Strong ranked middleweight contender. |
| 8 | 2024-02-17 | Paulo Costa | top-ten | 0.85 | 0.75 | 0.64 | Former challenger and strong contender, but not a true Top-5 win in this timing context. |
| 9 | 2026-07-11 | Nikita Krylov | top-ten | 0.85 | 0.75 | 0.64 | Strong ranked opponent in the approved app timeline. |
| 10 | 2015-05-10 | Brad Tavares | ranked | 0.65 | 0.75 | 0.49 | Quality middleweight win. |
| 11 | 2015-11-15 | Uriah Hall | ranked | 0.65 | 0.75 | 0.49 | Quality middleweight win. |
| 12 | 2016-04-23 | Rafael Natal | ranked | 0.65 | 0.75 | 0.49 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 13 | 2020-07-25 | Darren Till | ranked | 0.65 | 0.5 | 0.33 | Ranked contender; close tactical win and timing context. |
| 14 | 2024-06-22 | Ikram Aliskerov | ranked | 0.65 | 0.5 | 0.33 | Ranked-quality short-notice middleweight win. |
| 15 | 2012-12-15 | Brad Scott | solid | 0.45 | 0.5 | 0.23 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 16 | 2013-05-25 | Colton Smith | solid | 0.45 | 0.5 | 0.23 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 17 | 2014-11-08 | Clint Hester | solid | 0.45 | 0.5 | 0.23 | Solid UFC middleweight win. |
| 18 | 2014-06-28 | Mike Rhodes | name-value | 0.25 | 0.5 | 0.13 | Low-end UFC quality value. |

#### Prime Dominance receipts

Prime window: **Ronaldo Souza → Khamzat Chimaev**. Prime record: **10-4**. Effective samples: **13**. Sample multiplier: **100.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 6.23 | 9-4; 69.2% |
| Round control | 5.14 | 57.1%; rounds 24-18 |
| Finish pressure | 1 | 2 finishes; 15.4% |
| Elite-level validation | 5.02 | 10 elite-stage fights; 5.02 points |
| Raw prime score | 17.39 | Before sample multiplier |
| Final Prime Dominance | 17.39 | 17.39 × 1 |

#### Longevity receipts

Active elite years: **7.91**. Raw calendar months: **90.4**. Gap-adjusted months: **90.4**. Status multiplier: **1.06**. Division multiplier: **0.98**. Counted elite months: **93.91**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 2017-04-15 | 2017-07-08 | 2.76 | 2.76 | No |
| 2017-07-08 | 2018-06-09 | 11.04 | 11.04 | No |
| 2018-06-09 | 2019-10-06 | 15.9 | 15.9 | No |
| 2019-10-06 | 2020-07-25 | 9.63 | 9.63 | No |
| 2020-07-25 | 2020-10-24 | 2.99 | 2.99 | No |
| 2020-10-24 | 2021-04-17 | 5.75 | 5.75 | No |
| 2021-04-17 | 2022-02-12 | 9.89 | 9.89 | No |
| 2022-02-12 | 2022-09-03 | 6.67 | 6.67 | No |
| 2022-09-03 | 2023-07-08 | 10.12 | 10.12 | No |
| 2023-07-08 | 2024-02-17 | 7.36 | 7.36 | No |
| 2024-02-17 | 2024-06-22 | 4.14 | 4.14 | No |
| 2024-06-22 | 2024-10-26 | 4.14 | 4.14 | No |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **23** fights. Severity: **2.25**. Frequency: **1.43**. Prime-volume floor: **3.75**. Pre-division magnitude: **3.75**. Division discount: **0.0%**. Final penalty: **-3.75**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Base | Finish extra | Raw event | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2013-08-28 | Court McGee | pre-prime | solid | home | No | Yes | -1.25 | 0 | -1.25 | standard rule |
| 2014-02-22 | Stephen Thompson | pre-prime | top-five | home | Yes | Yes | -0.75 | -0.75 | -1.5 | standard rule |
| 2019-10-06 | Israel Adesanya | prime | champion-level | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2022-02-12 | Israel Adesanya | prime | champion-level | home | No | Yes | -1.5 | 0 | -1.5 | standard rule |
| 2023-07-08 | Dricus du Plessis | prime | top-five | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2024-10-26 | Khamzat Chimaev | prime | top-five | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2025-07-26 | Reinier de Ridder | post-prime | top-five | home | No | Yes | 0 | 0 | 0 | standard rule |

#### Division-strength context

Default division key: **modern-middleweight-1.00**. Era-ledger division multiplier: **0.98**. Division-era modifier: **-0.04**.

Jacare through Khamzat.

#### Key judgment calls

- **Romero 1:** Full elite/title credit as the interim title win.
- **Romero 2:** High credit as an elite rematch win, but slightly discounted for non-title/missed-weight/close-war context.
- **Jacare finish:** One of the cleanest elite wins on his résumé.
- **Loss context:** Adesanya, Dricus, and Khamzat losses keep him from a higher GOAT tier.

#### Why ranked here

Whittaker ranks here because his UFC-only résumé has rare middleweight depth: Romero twice, Jacare, Cannonier, Costa, Vettori, Brunson, Till, Gastelum, and years of elite relevance after winning UFC gold.

#### Why not ranked higher?

He does not rank higher because his championship case is light for an all-time champion: no official defense streak, Adesanya clearly capped the title era, and later Dricus/Khamzat finish losses hurt the prime-dominance and loss-context side.

#### Compare-mode guidance

- **Best counterargument:** The counterargument against Whittaker is that his belt résumé is thin and the elite finish losses are loud.
- **Why this résumé can still win:** Whittaker wins comparisons when résumé depth and elite longevity matter more than title defenses.

#### Final takeaway

Whittaker is a better UFC-only résumé case than his belt stats make him look. He is not a long-reign champion, but he is one of the strongest non-inner-circle middleweight legacy résumés.

_Ledger verified through 2026-07-13. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

### 39. Tony Ferguson — 89 OVR

A 12-fight-streak lightweight nightmare with interim-title value and elite prime dominance, capped by no undisputed belt and a brutal late-career collapse.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 46.96 | 15-9 | Lightweight / Welterweight | 1 | 0.64 | 4 | 8-1 | 72.0% | 5.19 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 1.32 | 35 | 1.54 |
| Opponent Quality | 18.83 | 25 | 15.69 |
| Prime Dominance | 22.46 | 30 | 22.46 |
| Longevity | 12.36 | 10 | 4.12 |

Base score: **43.81**. Modifiers: Apex **+4.9**, Loss Penalty **-2.01**, Division-Era Depth **+0.26**. Final raw score: **46.96**.

OVR conversion: 18.68–101.92 board anchors, normalized score **0.339741**, curved score **0.399462**, resulting in **89 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 1.32 | #62 | 0.64 adjusted credit / 14.54 benchmark |
| Opponent Quality | 18.83 | #36 | 8.85 diminished credit / 14.1 benchmark |
| Prime Dominance | 22.46 | #18 | 22.46 raw × 100.0% sample |
| Longevity | 12.36 | #40 | 59.35 counted elite months |
| Apex | +4.9 | Modifier | The RDA win and interim-title victory best capture Ferguson’s elite proof, streak energy, and chaos-driven Aura. |
| Loss Penalty | -2.01 | Modifier | 9 official/technical loss events reviewed |
| Division-Era Depth | +0.26 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **1**. Adjusted title wins: **0.64**. Derived undisputed-title win count: **0**. Interim-title win count: **1**.

| Date | Opponent | Title type | Base | Opponent strength | Final credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 2017-10-07 | Kevin Lee | interim | 0.75 | 0.85 | 0.64 | Interim title value and opponent discount. |

#### Opponent Quality receipts

Raw win credit: **10.2**. Diminishing-return credit before fighter adjustment: **8.85**. Fighter adjustment: **0**. Final diminished credit: **8.85**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2016-11-05 | Rafael dos Anjos | champion-level | 1.25 | 1 | 1.25 | Former UFC lightweight champion still elite. |
| 2 | 2015-12-11 | Edson Barboza | top-five | 1 | 1 | 1 | Elite lightweight contender in a deep division. |
| 3 | 2017-10-07 | Kevin Lee | top-five | 1 | 1 | 1 | Interim-title opponent and top lightweight contender. |
| 4 | 2018-10-06 | Anthony Pettis | top-five | 1 | 1 | 1 | Former UFC champion and dangerous lightweight name. |
| 5 | 2015-07-15 | Josh Thomson | top-ten | 0.85 | 1 | 0.85 | Strong veteran lightweight contender. |
| 6 | 2019-06-08 | Donald Cerrone | top-ten | 0.85 | 1 | 0.85 | Ranked veteran contender, timing context. |
| 7 | 2015-02-28 | Gleison Tibau | ranked | 0.65 | 0.75 | 0.49 | Quality lightweight veteran. |
| 8 | 2016-07-13 | Lando Vannata | ranked | 0.65 | 0.75 | 0.49 | Short-notice dangerous win, prospect context. |
| 9 | 2011-09-24 | Aaron Riley | solid | 0.45 | 0.75 | 0.34 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 10 | 2011-12-03 | Yves Edwards | solid | 0.45 | 0.75 | 0.34 | Veteran lightweight name, timing adjusted. |
| 11 | 2013-10-19 | Mike Rio | solid | 0.45 | 0.75 | 0.34 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 12 | 2014-05-24 | Katsunori Kikuno | solid | 0.45 | 0.75 | 0.34 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 13 | 2014-08-30 | Danny Castillo | solid | 0.45 | 0.5 | 0.23 | Solid lightweight win; close-decision context. |
| 14 | 2014-12-06 | Abel Trujillo | solid | 0.45 | 0.5 | 0.23 | Solid athletic lightweight win. |
| 15 | 2011-06-04 | Ramsey Nijem | name-value | 0.25 | 0.5 | 0.13 | Low-end UFC quality value. |

#### Prime Dominance receipts

Prime window: **Edson Barboza → Justin Gaethje**. Prime record: **8-1**. Effective samples: **7**. Sample multiplier: **100.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 7.71 | 6-1; 85.7% |
| Round control | 6 | 66.7%; rounds 14-7 |
| Finish pressure | 4 | 5 finishes; 71.4% |
| Elite-level validation | 4.75 | 5 elite-stage fights; 4.75 points |
| Raw prime score | 22.46 | Before sample multiplier |
| Final Prime Dominance | 22.46 | 22.46 × 1 |

#### Longevity receipts

Active elite years: **5.19**. Raw calendar months: **52.9**. Gap-adjusted months: **52.9**. Status multiplier: **1.02**. Division multiplier: **1.1**. Counted elite months: **59.35**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 2015-12-11 | 2016-07-13 | 7.06 | 7.06 | No |
| 2016-07-13 | 2016-11-05 | 3.78 | 3.78 | No |
| 2016-11-05 | 2017-10-07 | 11.04 | 11.04 | No |
| 2017-10-07 | 2018-10-06 | 11.96 | 11.96 | No |
| 2018-10-06 | 2019-06-08 | 8.05 | 8.05 | No |
| 2019-06-08 | 2020-05-09 | 11.04 | 11.04 | No |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **17** fights. Severity: **1.75**. Frequency: **0.62**. Prime-volume floor: **1**. Pre-division magnitude: **2.37**. Division discount: **15.0%**. Final penalty: **-2.01**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Base | Finish extra | Raw event | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2012-05-05 | Michael Johnson | pre-prime | top-ten | home | No | Yes | -1.25 | 0 | -1.25 | standard rule |
| 2020-05-09 | Justin Gaethje | prime | top-five | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2020-12-12 | Charles Oliveira | post-prime | top-five | home | No | Yes | 0 | 0 | 0 | standard rule |
| 2021-05-15 | Beneil Dariush | post-prime | top-five | home | No | Yes | 0 | 0 | 0 | standard rule |
| 2022-05-07 | Michael Chandler | post-prime | top-five | home | Yes | Yes | 0 | 0 | 0 | standard rule |
| 2022-09-10 | Nate Diaz | post-prime | top-ten | home | Yes | Yes | 0 | 0 | 0 | standard rule |
| 2023-07-29 | Bobby Green | post-prime | top-ten | home | Yes | Yes | 0 | 0 | 0 | standard rule |
| 2023-12-16 | Paddy Pimblett | post-prime | ranked | home | No | Yes | 0 | 0 | 0 | standard rule |
| 2024-08-03 | Michael Chiesa | post-prime | top-ten | home | Yes | Yes | 0 | 0 | 0 | standard rule |

#### Division-strength context

Default division key: **lightweight-murderers-row-1.10**. Era-ledger division multiplier: **1.1**. Division-era modifier: **+0.26**.

Barboza through Gaethje.

#### Key judgment calls

- **Title ceiling:** The interim belt matters, but the missing undisputed title keeps his championship résumé capped.
- **Gaethje fight:** The Gaethje loss counts because it happened at the end of Tony’s real title push.
- **Late skid:** The losing streak hurts the story, but it is not treated like peak Tony losing eight straight.
- **Peak danger:** At his best, Tony’s pace, elbows, scrambles, cardio, and submission threat made him one of lightweight’s scariest matchups.

#### Why ranked here

Ferguson lands here because the 12-fight UFC win streak, interim title, and brutal lightweight schedule make his prime impossible to ignore.

#### Why not ranked higher?

He does not rank higher because he never won the undisputed UFC lightweight title, never defended a UFC belt, and the Gaethje fight ended his run toward the top of the division.

#### Compare-mode guidance

- **Best counterargument:** The counter is official hardware: no undisputed title, no defenses, and Gaethje broke the title case.
- **Why this résumé can still win:** Tony wins comparisons when prime danger, streak value, and lightweight division strength matter more than official title volume.

#### Final takeaway

Tony is the classic uncrowned-champion case: terrifying prime, elite lightweight streak, real interim-title value, but thin official championship hardware.

_Ledger verified through 2026-07-13. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

### 40. Henry Cejudo — 89 OVR

The compact achievement burst: flyweight gold, bantamweight gold, huge name wins, and a short window that limits total volume.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 46.85 | 10-6 | Flyweight / Bantamweight | 4 | 3.64 | 5 | 4-1 | 62.5% | 3.26 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 7.51 | 35 | 8.76 |
| Opponent Quality | 14.04 | 25 | 11.7 |
| Prime Dominance | 22.52 | 30 | 22.52 |
| Longevity | 4.77 | 10 | 1.59 |

Base score: **44.57**. Modifiers: Apex **+4.35**, Loss Penalty **-1.69**, Division-Era Depth **-0.38**. Final raw score: **46.85**.

OVR conversion: 18.68–101.92 board anchors, normalized score **0.338419**, curved score **0.398141**, resulting in **89 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 7.51 | #27 | 3.64 adjusted credit / 14.54 benchmark |
| Opponent Quality | 14.04 | #51 | 6.6 diminished credit / 14.1 benchmark |
| Prime Dominance | 22.52 | #16 | 25.02 raw × 90.0% sample |
| Longevity | 4.77 | #62 | 22.9 counted elite months |
| Apex | +4.35 | Modifier | Champ-champ peak proof in a compact run. |
| Loss Penalty | -1.69 | Modifier | 6 official/technical loss events reviewed |
| Division-Era Depth | -0.38 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **4**. Adjusted title wins: **3.64**. Derived undisputed-title win count: **4**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 2018-08-04 | Demetrious Johnson | normal | 1 | 1 | 1 | locked |
| 2019-01-19 | T.J. Dillashaw | normal | 1 | 0.85 | 0.85 | Reigning BW champ moving down/weight-cut context. |
| 2019-06-08 | Marlon Moraes | vacant-second-division | 1.15 | 0.9 | 1.04 | locked |
| 2020-05-09 | Dominick Cruz | normal | 1 | 0.75 | 0.75 | Long-layoff former champ/opponent timing discount. |

#### Opponent Quality receipts

Raw win credit: **7.05**. Diminishing-return credit before fighter adjustment: **6.6**. Fighter adjustment: **0**. Final diminished credit: **6.6**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2018-08-04 | Demetrious Johnson | champion-level | 1.25 | 1 | 1.25 | All-time flyweight champion; close decision flagged but max opponent quality. |
| 2 | 2019-06-08 | Marlon Moraes | top-five | 1 | 1 | 1 | Elite bantamweight contender for vacant title. |
| 3 | 2017-12-02 | Sergio Pettis | top-ten | 0.85 | 1 | 0.85 | Strong flyweight contender. |
| 4 | 2019-01-19 | T.J. Dillashaw | top-ten | 0.85 | 1 | 0.85 | Champion moving down with severe weight-cut context. |
| 5 | 2015-11-21 | Jussier Formiga | ranked | 0.65 | 1 | 0.65 | Quality flyweight contender. |
| 6 | 2017-09-09 | Wilson Reis | ranked | 0.65 | 1 | 0.65 | Ranked flyweight contender. |
| 7 | 2020-05-09 | Dominick Cruz | ranked | 0.65 | 0.75 | 0.49 | All-time name, but long-layoff and timing context. |
| 8 | 2015-03-14 | Chris Cariaso | solid | 0.45 | 0.75 | 0.34 | Former title challenger but limited timing value. |
| 9 | 2015-06-13 | Chico Camus | solid | 0.45 | 0.75 | 0.34 | Solid UFC flyweight win. |
| 10 | 2014-12-13 | Dustin Kimura | name-value | 0.25 | 0.75 | 0.19 | Low UFC quality value. |

#### Prime Dominance receipts

Prime window: **Demetrious Johnson II → Dominick Cruz**. Prime record: **4-1**. Effective samples: **4**. Sample multiplier: **90.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 9 | 4-0; 100.0% |
| Round control | 6.55 | 72.7%; rounds 8-3 |
| Finish pressure | 4.5 | 3 finishes; 75.0% |
| Elite-level validation | 4.97 | 4 elite-stage fights; 4.97 points |
| Raw prime score | 25.02 | Before sample multiplier |
| Final Prime Dominance | 22.52 | 25.02 × 0.9 |

#### Longevity receipts

Active elite years: **3.26**. Raw calendar months: **21.2**. Gap-adjusted months: **21.2**. Status multiplier: **1.08**. Division multiplier: **1**. Counted elite months: **22.9**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 2018-08-04 | 2019-01-19 | 5.52 | 5.52 | No |
| 2019-01-19 | 2019-06-08 | 4.6 | 4.6 | No |
| 2019-06-08 | 2020-05-09 | 11.04 | 11.04 | No |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **12** fights. Severity: **1.13**. Frequency: **0.56**. Prime-volume floor: **0**. Pre-division magnitude: **1.69**. Division discount: **0.0%**. Final penalty: **-1.69**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Base | Finish extra | Raw event | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2016-04-23 | Demetrious Johnson | pre-prime | champion-level | home | Yes | Yes | -0.75 | -0.75 | -1.5 | standard rule |
| 2016-12-03 | Joseph Benavidez | pre-prime | top-five | home | No | Yes | -0.75 | 0 | -0.75 | standard rule |
| 2023-05-06 | Aljamain Sterling | post-prime | champion-level | home | No | Yes | 0 | 0 | 0 | standard rule |
| 2024-02-17 | Merab Dvalishvili | post-prime | top-five | home | No | Yes | 0 | 0 | 0 | standard rule |
| 2025-02-22 | Song Yadong | post-prime | top-five | home | No | Yes | 0 | 0 | 0 | standard rule |
| 2025-12-06 | Payton Talbott | post-prime | ranked | home | No | Yes | 0 | 0 | 0 | standard rule |

#### Division-strength context

Default division key: **cejudo-flyweight-bantamweight-0.98**. Era-ledger division multiplier: **1**. Division-era modifier: **-0.38**.

Demetrious Johnson II through Dominick Cruz; no retirement-gap credit.

#### Key judgment calls

- **Double-champ value:** a major part of the case.
- **DJ win:** huge high-end flyweight value, even with close-fight context.
- **Dillashaw and Moraes wins:** make the title burst feel historically loud.
- **Retirement gap:** limits active elite longevity.
- **Return losses:** add record drag, but post-prime losses do not reduce the locked Loss Context score.

#### Why ranked here

Cejudo ranks here because he packed major value into a short UFC window: flyweight title, bantamweight title, the Demetrious Johnson win, and a fast run through elite names.

#### Why not ranked higher?

He does not rank higher because the title window is short and the total UFC volume is limited. The achievements are loud, but the long-reign proof is not there.

#### Compare-mode guidance

- **Best counterargument:** Cejudo’s argument is peak efficiency. He did a lot in a small window, and his best wins are loud enough to make him dangerous in almost any comparison.
- **Why this résumé can still win:** Cejudo wins when compact championship achievement and two-division value matter more than long-term title volume.

#### Final takeaway

Cejudo is the compact double-champ case: one of the most efficient achievement bursts in UFC history, but too short to outrank deeper long-reign resumes.

_Ledger verified through 2026-07-13. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

### 41. Chris Weidman — 89 OVR

A compact elite middleweight peak built on ending Anderson Silva's reign, three successful title defenses, and real contender depth before a brutal loss-heavy back half.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 46.31 | 12-8 | Middleweight / Light Heavyweight | 4 | 3.7 | 5 | 6-4 | 66.7% | 6.31 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 7.63 | 35 | 8.9 |
| Opponent Quality | 13.33 | 25 | 11.11 |
| Prime Dominance | 19.73 | 30 | 19.73 |
| Longevity | 16.71 | 10 | 5.57 |

Base score: **45.31**. Modifiers: Apex **+5.68**, Loss Penalty **-4.18**, Division-Era Depth **-0.5**. Final raw score: **46.31**.

OVR conversion: 18.68–101.92 board anchors, normalized score **0.331932**, curved score **0.391644**, resulting in **89 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 7.63 | #23 | 3.7 adjusted credit / 14.54 benchmark |
| Opponent Quality | 13.33 | #56 | 6.46 diminished credit / 14.54 benchmark |
| Prime Dominance | 19.73 | #32 | 19.73 raw × 100.0% sample |
| Longevity | 16.71 | #19 | 80.23 counted elite months |
| Apex | +5.68 | Modifier | The Silva knockout establishes world-best proof; the five-round Machida defense confirms championship-level separation. |
| Loss Penalty | -4.18 | Modifier | 8 official/technical loss events reviewed |
| Division-Era Depth | -0.5 | Modifier | Apply a light discount for the Weidman-era middleweight field: elite top-end title opponents, but less full-roster depth than the strongest lightweight and welterweight eras. |

#### Championship receipts

UFC title-fight wins: **4**. Adjusted title wins: **3.7**. Derived undisputed-title win count: **4**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| — | Anderson Silva | — | — | — | 1 | locked |
| — | Anderson Silva II | — | — | — | 0.9 | locked |
| — | Lyoto Machida | — | — | — | 0.95 | locked |
| — | Vitor Belfort | — | — | — | 0.85 | locked |

#### Opponent Quality receipts

Raw win credit: **6.75**. Diminishing-return credit before fighter adjustment: **6.46**. Fighter adjustment: **0**. Final diminished credit: **6.46**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | — | Anderson Silva | — | 1.2 | 1 | 1.2 | locked |
| 2 | — | Lyoto Machida | — | 0.95 | 1 | 0.95 | locked |
| 3 | — | Anderson Silva II | — | 0.9 | 1 | 0.9 | locked |
| 4 | — | Mark Munoz | — | 0.9 | 1 | 0.9 | locked |
| 5 | — | Vitor Belfort | — | 0.85 | 1 | 0.85 | locked |
| 6 | — | Kelvin Gastelum | — | 0.8 | 1 | 0.8 | locked |
| 7 | — | Demian Maia | — | 0.65 | 0.75 | 0.49 | locked |
| 8 | — | Omari Akhmedov | — | 0.4 | 0.75 | 0.3 | locked |
| 9 | — | Bruno Silva | — | 0.1 | 0.75 | 0.07 | locked |

#### Prime Dominance receipts

Prime window: **Mark Munoz → Ronaldo Souza**. Prime record: **6-4**. Effective samples: **10**. Sample multiplier: **100.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 5.4 | 6-4; 60.0% |
| Round control | 6 | 66.7%; rounds 18-9 |
| Finish pressure | 3 | 5 finishes; 50.0% |
| Elite-level validation | 5.33 | 9 elite-stage fights; 5.33 points |
| Raw prime score | 19.73 | Before sample multiplier |
| Final Prime Dominance | 19.73 | 19.73 × 1 |

#### Longevity receipts

Active elite years: **6.31**. Raw calendar months: **75.8**. Gap-adjusted months: **75.8**. Status multiplier: **1.08**. Division multiplier: **0.98**. Counted elite months: **80.23**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 2012-07-11 | 2013-07-06 | 11.83 | 11.83 | No |
| 2013-07-06 | 2013-12-28 | 5.75 | 5.75 | No |
| 2013-12-28 | 2014-07-05 | 6.21 | 6.21 | No |
| 2014-07-05 | 2015-05-23 | 10.58 | 10.58 | No |
| 2015-05-23 | 2015-12-12 | 6.67 | 6.67 | No |
| 2015-12-12 | 2016-11-12 | 11.04 | 11.04 | No |
| 2016-11-12 | 2017-04-08 | 4.83 | 4.83 | No |
| 2017-04-08 | 2017-07-22 | 3.45 | 3.45 | No |
| 2017-07-22 | 2018-11-03 | 15.41 | 15.41 | No |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **14** fights. Severity: **2.25**. Frequency: **1.93**. Prime-volume floor: **4**. Pre-division magnitude: **4.18**. Division discount: **0.0%**. Final penalty: **-4.18**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Base | Finish extra | Raw event | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2015-12-12 | Luke Rockhold | prime | champion-level | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2016-11-12 | Yoel Romero | prime | top-five | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2017-04-08 | Gegard Mousasi | prime | top-five | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2018-11-03 | Ronaldo Souza | prime | top-five | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2019-10-18 | Dominick Reyes | post-prime | top-five | upward | Yes | Yes | 0 | 0 | 0 | standard rule |
| 2021-04-24 | Uriah Hall | post-prime | ranked | home | No | No | 0 | 0 | 0 | freak-injury-technical-result |
| 2023-08-19 | Brad Tavares | post-prime | solid | home | No | Yes | 0 | 0 | 0 | standard rule |
| 2024-12-07 | Eryk Anders | post-prime | solid | home | Yes | Yes | 0 | 0 | 0 | standard rule |

#### Division-strength context

Default division key: **weidman-middleweight-0.98**. Era-ledger division multiplier: **0.98**. Division-era modifier: **-0.5**.

A strong top-end middleweight era receives only a light depth discount.

#### Key judgment calls

- **Prime start:** Mark Munoz begins the connected elite and title-level window; the earlier unbeaten UFC run builds the record but not the GOAT-level prime.
- **Anderson Silva rematch:** remains an official title-defense win, but the checked-kick leg injury receives reduced Championship and Opponent Quality credit.
- **Gegard Mousasi:** counts as a competitive prime finish loss despite the confusing legal-knee and replay sequence.
- **Uriah Hall leg break:** remains an official UFC loss but is treated as a freak technical result, not a normal knockout or competitive finish loss.
- **Post-prime losses:** Reyes, Tavares, and Anders sit outside the reviewed prime window; Ring of Combat achievements are excluded entirely.

#### Why ranked here

Weidman ranks here because his best UFC run delivered championship proof that most contenders never reach: nine straight UFC wins, two official victories over Anderson Silva, and defenses against Silva, Lyoto Machida, and Vitor Belfort. The model also credits the Munoz breakthrough, the Gastelum rebound, and more than six active elite years.

#### Why not ranked higher?

He does not rank with the long-reign champions because the title run ended after three defenses and the reviewed prime includes four consecutive finished losses around one Gastelum rebound. His peak was elite, but the total UFC resume is much less stable than the names above him.

#### Compare-mode guidance

- **Best counterargument:** His best counterargument against deeper resumes is peak proof: he beat Anderson Silva twice and defended against two former champions before his first loss.
- **Why this résumé can still win:** Weidman wins comparisons against fighters without championship proof because his peak produced four UFC title-fight wins and a direct overthrow of an all-time great.

#### Final takeaway

Weidman is a serious UFC-only champion case with one of the sport's most important title wins and a genuinely elite compact peak. Three defenses and strong names get him into the debate; the short reign and four damaging prime finishes keep him below the long-term greats.

_Ledger verified through 2026-07-15. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

### 42. Frank Shamrock — 89 OVR

A perfect early-UFC champion who went 5-0 with five title-fight wins, five finishes, and a defining victory over Tito Ortiz.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 46.01 | 5-0 | Light Heavyweight / Middleweight | 5 | 3 | 3 | 5-0 | 100.0% | 1.76 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 6.2 | 35 | 7.23 |
| Opponent Quality | 10.64 | 25 | 8.87 |
| Prime Dominance | 25.99 | 30 | 25.99 |
| Longevity | 4.59 | 10 | 1.53 |

Base score: **43.62**. Modifiers: Apex **+5.39**, Loss Penalty **0**, Division-Era Depth **-3**. Final raw score: **46.01**.

OVR conversion: 18.68–101.92 board anchors, normalized score **0.328328**, curved score **0.388027**, resulting in **89 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 6.2 | #31 | 3 adjusted credit / 14.54 benchmark |
| Opponent Quality | 10.64 | #59 | 5 diminished credit / 14.1 benchmark |
| Prime Dominance | 25.99 | #5 | 28.88 raw × 90.0% sample |
| Longevity | 4.59 | #63 | 22.05 counted elite months |
| Apex | +5.39 | Modifier | The inaugural title win and dominant Tito defense create an elite early-era Apex with explicit, formula-reconciling components. |
| Loss Penalty | 0 | Modifier | 0 official/technical loss events reviewed |
| Division-Era Depth | -3 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **5**. Adjusted title wins: **3**. Derived undisputed-title win count: **5**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1997-12-21 | Kevin Jackson | normal | 1 | 0.7 | 0.7 | Approved aggregate Championship score recovered from the live control; exact historical per-fight split was not stored. |
| 1998-03-13 | Igor Zinoviev | normal | 1 | 0.6 | 0.6 | Approved aggregate Championship score recovered from the live control; exact historical per-fight split was not stored. |
| 1998-05-15 | Jeremy Horn | normal | 1 | 0.6 | 0.6 | Approved aggregate Championship score recovered from the live control; exact historical per-fight split was not stored. |
| 1998-10-16 | John Lober | normal | 1 | 0.55 | 0.55 | Approved aggregate Championship score recovered from the live control; exact historical per-fight split was not stored. |
| 1999-09-24 | Tito Ortiz | normal | 1 | 0.55 | 0.55 | Approved aggregate Championship score recovered from the live control; exact historical per-fight split was not stored. |

#### Opponent Quality receipts

Raw win credit: **5**. Diminishing-return credit before fighter adjustment: **5**. Fighter adjustment: **0**. Final diminished credit: **5**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 1997-12-21 | Kevin Jackson | champion-level | 1.25 | 1 | 1.25 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 2 | 1999-09-24 | Tito Ortiz | champion-level | 1.25 | 1 | 1.25 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 3 | 1998-05-15 | Jeremy Horn | top-five | 1 | 1 | 1 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 4 | 1998-03-13 | Igor Zinoviev | top-ten | 0.85 | 1 | 0.85 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 5 | 1998-10-16 | John Lober | ranked | 0.65 | 1 | 0.65 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |

#### Prime Dominance receipts

Prime window: **Kevin Jackson → Tito Ortiz**. Prime record: **5-0**. Effective samples: **5**. Sample multiplier: **90.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 9 | 5-0; 100.0% |
| Round control | 9 | 100.0%; rounds 8-0 |
| Finish pressure | 5 | 5 finishes; 100.0% |
| Elite-level validation | 5.88 | 5 elite-stage fights; 5.88 points |
| Raw prime score | 28.88 | Before sample multiplier |
| Final Prime Dominance | 25.99 | 28.88 × 0.9 |

#### Longevity receipts

Active elite years: **1.76**. Raw calendar months: **21.1**. Gap-adjusted months: **21.1**. Status multiplier: **1.1**. Division multiplier: **0.95**. Counted elite months: **22.05**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 1997-12-21 | 1998-03-13 | 2.69 | 2.69 | No |
| 1998-03-13 | 1998-05-15 | 2.07 | 2.07 | No |
| 1998-05-15 | 1998-10-16 | 5.06 | 5.06 | No |
| 1998-10-16 | 1999-09-24 | 11.27 | 11.27 | No |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **5** fights. Severity: **0**. Frequency: **0**. Prime-volume floor: **0**. Pre-division magnitude: **0**. Division discount: **0.0%**. Final penalty: **0**.

_No rows._

#### Division-strength context

Default division key: **early-light-heavyweight-0.90**. Era-ledger division multiplier: **0.95**. Division-era modifier: **-3**.

Jackson through Ortiz.

#### Key judgment calls

- **Prime window:** Kevin Jackson → Tito Ortiz.
- **Coverage:** Complete UFC-only ledger through 1999-09-24. Pancrase, Strikeforce, WEC, K-1, Rings, and other non-UFC fights excluded.
- **Prime endpoint:** Retired from the UFC title on the Ortiz win; later non-UFC achievements are excluded.

#### Why ranked here

Shamrock ranks here because his short UFC run was flawless at championship level. He won all five appearances, finished every opponent, controlled every tracked round, and closed the run by stopping Tito Ortiz in the strongest performance of his UFC résumé.

#### Why not ranked higher?

He does not rank higher because the entire UFC case spans only five fights and roughly 1.8 active elite years. The early light-heavyweight field was much thinner than later eras, only three wins reach Top-5 quality in the current model, and the limited sample cannot match champions who proved themselves across multiple generations.

#### Final takeaway

Shamrock ranks here because his short UFC run was flawless at championship level. He won all five appearances, finished every opponent, controlled every tracked round, and closed the run by stopping Tito Ortiz in the strongest performance of his UFC résumé.

_Ledger verified through 2026-07-13. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

### 43. Petr Yan — 89 OVR

A modern bantamweight title case with elite skill, strong round control, and unusual DQ context that needs more nuance than a normal loss.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 45.93 | 12-4 | Bantamweight | 3 | 2.61 | 6 | 6-4 | 65.1% | 6 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 5.39 | 35 | 6.29 |
| Opponent Quality | 17.18 | 25 | 14.32 |
| Prime Dominance | 17.91 | 30 | 17.91 |
| Longevity | 16.93 | 10 | 5.64 |

Base score: **44.16**. Modifiers: Apex **+4.15**, Loss Penalty **-2.34**, Division-Era Depth **-0.04**. Final raw score: **45.93**.

OVR conversion: 18.68–101.92 board anchors, normalized score **0.327367**, curved score **0.387061**, resulting in **89 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 5.39 | #40 | 2.61 adjusted credit / 14.54 benchmark |
| Opponent Quality | 17.18 | #43 | 8.07 diminished credit / 14.1 benchmark |
| Prime Dominance | 17.91 | #50 | 17.91 raw × 100.0% sample |
| Longevity | 16.93 | #17 | 81.27 counted elite months |
| Apex | +4.15 | Modifier | High-skill bantamweight apex. |
| Loss Penalty | -2.34 | Modifier | 4 official/technical loss events reviewed |
| Division-Era Depth | -0.04 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **3**. Adjusted title wins: **2.61**. Derived undisputed-title win count: **2**. Interim-title win count: **1**.

| Date | Opponent | Title type | Base | Opponent strength | Final credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 2020-07-12 | Jose Aldo | vacant-undisputed | 0.9 | 1 | 0.9 | Elite vacant-title opponent; full opponent strength. |
| 2021-10-30 | Cory Sandhagen | interim | 0.75 | 0.95 | 0.71 | Interim title value over strong contender. |
| 2025-12-06 | Merab Dvalishvili | normal | 1 | 1 | 1 | Recent-event add: UFC 323 bantamweight title reclaim over elite champion. |

#### Opponent Quality receipts

Raw win credit: **8.85**. Diminishing-return credit before fighter adjustment: **8.07**. Fighter adjustment: **0**. Final diminished credit: **8.07**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2025-12-06 | Merab Dvalishvili | champion-level | 1.25 | 1 | 1.25 | Elite bantamweight champion/title-level opponent in app timeline. |
| 2 | 2020-07-12 | Jose Aldo | top-five | 1 | 1 | 1 | All-time featherweight great and elite bantamweight title opponent. |
| 3 | 2021-10-30 | Cory Sandhagen | top-five | 1 | 1 | 1 | Elite bantamweight contender and interim-title opponent. |
| 4 | 2024-11-23 | Deiveson Figueiredo | top-five | 1 | 1 | 1 | Former flyweight champion and strong bantamweight contender. |
| 5 | 2024-03-09 | Song Yadong | top-ten | 0.85 | 1 | 0.85 | Strong ranked bantamweight contender. |
| 6 | 2019-02-23 | John Dodson | ranked | 0.65 | 1 | 0.65 | Former flyweight title challenger and quality bantamweight. |
| 7 | 2019-06-08 | Jimmie Rivera | ranked | 0.65 | 0.75 | 0.49 | Quality ranked bantamweight win. |
| 8 | 2019-12-14 | Urijah Faber | ranked | 0.65 | 0.75 | 0.49 | Legend name, late-career timing. |
| 9 | 2025-07-26 | Marcus McGhee | ranked | 0.65 | 0.75 | 0.49 | Ranked-quality bantamweight win. |
| 10 | 2018-09-15 | Jin Soo Son | solid | 0.45 | 0.75 | 0.34 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 11 | 2018-12-29 | Douglas Silva de Andrade | solid | 0.45 | 0.75 | 0.34 | Solid UFC bantamweight win. |
| 12 | 2018-06-23 | Teruto Ishihara | name-value | 0.25 | 0.75 | 0.19 | Low-end UFC quality value. |

#### Prime Dominance receipts

Prime window: **Urijah Faber → Current elite form**. Prime record: **6-4**. Effective samples: **11**. Sample multiplier: **100.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 5.73 | 7-4; 63.6% |
| Round control | 6.07 | 67.4%; rounds 31-15 |
| Finish pressure | 1 | 2 finishes; 18.2% |
| Elite-level validation | 5.11 | 9 elite-stage fights; 5.11 points |
| Raw prime score | 17.91 | Before sample multiplier |
| Final Prime Dominance | 17.91 | 17.91 × 1 |

#### Longevity receipts

Active elite years: **6**. Raw calendar months: **78.9**. Gap-adjusted months: **78.9**. Status multiplier: **1.03**. Division multiplier: **1**. Counted elite months: **81.27**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 2019-12-14 | 2020-07-12 | 6.93 | 6.93 | No |
| 2020-07-12 | 2021-03-06 | 7.79 | 7.79 | No |
| 2021-03-06 | 2021-10-30 | 7.82 | 7.82 | No |
| 2021-10-30 | 2022-04-09 | 5.29 | 5.29 | No |
| 2022-04-09 | 2022-10-22 | 6.44 | 6.44 | No |
| 2022-10-22 | 2023-03-11 | 4.6 | 4.6 | No |
| 2023-03-11 | 2024-03-09 | 11.96 | 11.96 | No |
| 2024-03-09 | 2024-11-23 | 8.51 | 8.51 | No |
| 2024-11-23 | 2025-07-26 | 8.05 | 8.05 | No |
| 2025-07-26 | 2025-12-06 | 4.37 | 4.37 | No |
| 2025-12-06 | 2026-07-13 | 7.2 | 7.2 | No |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **16** fights. Severity: **1.5**. Frequency: **0.84**. Prime-volume floor: **2.25**. Pre-division magnitude: **2.34**. Division discount: **0.0%**. Final penalty: **-2.34**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Base | Finish extra | Raw event | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2021-03-06 | Aljamain Sterling | prime | top-five | home | No | Yes | 0 | 0 | 0 | technical-dq-context |
| 2022-04-09 | Aljamain Sterling | prime | champion-level | home | No | Yes | -1.5 | 0 | -1.5 | standard rule |
| 2022-10-22 | Sean O'Malley | prime | top-five | home | No | Yes | -1.5 | 0 | -1.5 | standard rule |
| 2023-03-11 | Merab Dvalishvili | prime | top-five | home | No | Yes | -1.5 | 0 | -1.5 | standard rule |

#### Division-strength context

Default division key: **modern-bantamweight-1.00**. Era-ledger division multiplier: **1**. Division-era modifier: **-0.04**.

Faber through current elite form.

#### Key judgment calls

- **Sterling DQ:** treated with special context instead of like a normal competitive title loss.
- **Sandhagen win:** important interim-title and elite contender value.
- **Aldo win:** vacant title win over an elite former champion, but not prime Aldo at featherweight.
- **Later losses:** count against the resume, but without finish add-ons where appropriate.
- **Bantamweight depth:** modern bantamweight is treated as a strong division context.

#### Why ranked here

Yan ranks here because his UFC-only case has real bantamweight title value, strong elite-round control, and enough quality-win/context credit to belong in the all-time conversation rather than being hidden by the messy Sterling rivalry.

#### Why not ranked higher?

He does not climb higher because the championship volume is limited and the official loss column is heavy for an all-time case, even when several losses have strong context.

#### Compare-mode guidance

- **Best counterargument:** Yan’s best counterargument is context. The Sterling DQ should not be treated like a normal competitive title loss, the Sterling rematch was close, and the Merab series is split rather than one-way.
- **Why this résumé can still win:** Yan wins comparisons when clean skill, round control, title-rematch context, and DQ/loss-context nuance matter more than raw title-defense volume.

#### Final takeaway

Yan is a legit modern bantamweight title case: not a top-tier GOAT resume, but clearly strong enough that he should appear in the ranking and compare mode.

_Ledger verified through 2026-07-13. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

### 44. Sean Strickland — 89 OVR

A pace-and-defense middleweight champion with a legendary Adesanya upset, current-table Khamzat proof, and a resume capped by Dricus/Pereira loss context.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 45.89 | 18-7 | Middleweight / Welterweight | 2 | 2 | 6 | 8-4 | 62.8% | 4.95 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 4.13 | 35 | 4.82 |
| Opponent Quality | 21.97 | 25 | 18.31 |
| Prime Dominance | 17.82 | 30 | 17.82 |
| Longevity | 12.73 | 10 | 4.24 |

Base score: **45.19**. Modifiers: Apex **+3.85**, Loss Penalty **-3.42**, Division-Era Depth **+0.27**. Final raw score: **45.89**.

OVR conversion: 18.68–101.92 board anchors, normalized score **0.326886**, curved score **0.386578**, resulting in **89 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 4.13 | #43 | 2 adjusted credit / 14.54 benchmark |
| Opponent Quality | 21.97 | #18 | 10.32 diminished credit / 14.1 benchmark |
| Prime Dominance | 17.82 | #52 | 17.82 raw × 100.0% sample |
| Longevity | 12.73 | #37 | 61.12 counted elite months |
| Apex | +3.85 | Modifier | Izzy win gives real apex proof. |
| Loss Penalty | -3.42 | Modifier | 7 official/technical loss events reviewed |
| Division-Era Depth | +0.27 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **2**. Adjusted title wins: **2**. Derived undisputed-title win count: **2**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 2023-09-09 | Israel Adesanya | normal | 1 | 1 | 1 | Current-era upset over elite champion. |
| 2026-05-09 | Khamzat Chimaev | normal | 1 | 1 | 1 | Recent-event add: UFC 328 middleweight title win by split decision. |

#### Opponent Quality receipts

Raw win credit: **12.65**. Diminishing-return credit before fighter adjustment: **10.32**. Fighter adjustment: **0**. Final diminished credit: **10.32**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2023-09-09 | Israel Adesanya | champion-level | 1.25 | 1 | 1.25 | Elite UFC middleweight champion. |
| 2 | 2026-05-09 | Khamzat Chimaev | champion-level | 1.25 | 1 | 1.25 | Elite title-level opponent in app timeline. |
| 3 | 2026-02-21 | Anthony Hernandez | top-five | 1 | 1 | 1 | Top-five middleweight win. |
| 4 | 2022-02-05 | Jack Hermansson | top-ten | 0.85 | 1 | 0.85 | Ranked middleweight contender. |
| 5 | 2023-01-14 | Nassourdine Imavov | top-ten | 0.85 | 1 | 0.85 | Strong ranked middleweight contender. |
| 6 | 2024-06-01 | Paulo Costa | top-ten | 0.85 | 1 | 0.85 | Strong ranked middleweight contender. |
| 7 | 2014-05-31 | Luke Barnatt | ranked | 0.65 | 0.75 | 0.49 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 8 | 2016-02-21 | Alex Garcia | ranked | 0.65 | 0.75 | 0.49 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 9 | 2018-10-27 | Nordine Taleb | ranked | 0.65 | 0.75 | 0.49 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 10 | 2020-11-14 | Brendan Allen | ranked | 0.65 | 0.75 | 0.49 | Quality middleweight win before Allen peak. |
| 11 | 2021-07-31 | Uriah Hall | ranked | 0.65 | 0.75 | 0.49 | Quality middleweight win. |
| 12 | 2023-07-01 | Abus Magomedov | ranked | 0.65 | 0.75 | 0.49 | Ranked-quality middleweight win. |
| 13 | 2014-03-15 | Bubba McDaniel | solid | 0.45 | 0.5 | 0.23 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 14 | 2015-07-15 | Igor Araujo | solid | 0.45 | 0.5 | 0.23 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 15 | 2016-06-04 | Tom Breese | solid | 0.45 | 0.5 | 0.23 | Solid UFC win. |
| 16 | 2017-11-11 | Court McGee | solid | 0.45 | 0.5 | 0.23 | Solid UFC win. |
| 17 | 2020-10-31 | Jack Marshman | solid | 0.45 | 0.5 | 0.23 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 18 | 2021-05-01 | Krzysztof Jotko | solid | 0.45 | 0.5 | 0.23 | Solid UFC middleweight win. |

#### Prime Dominance receipts

Prime window: **Uriah Hall → Current elite form**. Prime record: **8-4**. Effective samples: **12**. Sample multiplier: **100.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 6 | 8-4; 66.7% |
| Round control | 5.65 | 62.8%; rounds 32-19 |
| Finish pressure | 1 | 2 finishes; 16.7% |
| Elite-level validation | 5.17 | 10 elite-stage fights; 5.17 points |
| Raw prime score | 17.82 | Before sample multiplier |
| Final Prime Dominance | 17.82 | 17.82 × 1 |

#### Longevity receipts

Active elite years: **4.95**. Raw calendar months: **59.4**. Gap-adjusted months: **59.4**. Status multiplier: **1.05**. Division multiplier: **0.98**. Counted elite months: **61.12**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 2021-07-31 | 2022-02-05 | 6.21 | 6.21 | No |
| 2022-02-05 | 2022-07-02 | 4.83 | 4.83 | No |
| 2022-07-02 | 2022-12-17 | 5.52 | 5.52 | No |
| 2022-12-17 | 2023-01-14 | 0.92 | 0.92 | No |
| 2023-01-14 | 2023-07-01 | 5.52 | 5.52 | No |
| 2023-07-01 | 2023-09-09 | 2.3 | 2.3 | No |
| 2023-09-09 | 2024-01-20 | 4.37 | 4.37 | No |
| 2024-01-20 | 2024-06-01 | 4.37 | 4.37 | No |
| 2024-06-01 | 2025-02-08 | 8.28 | 8.28 | No |
| 2025-02-08 | 2026-02-21 | 12.42 | 12.42 | No |
| 2026-02-21 | 2026-05-09 | 2.53 | 2.53 | No |
| 2026-05-09 | 2026-07-13 | 2.14 | 2.14 | No |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **25** fights. Severity: **2.13**. Frequency: **1.29**. Prime-volume floor: **3.25**. Pre-division magnitude: **3.42**. Division discount: **0.0%**. Final penalty: **-3.42**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Base | Finish extra | Raw event | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2015-02-22 | Santiago Ponzinibbio | pre-prime | top-ten | home | No | Yes | -1.25 | 0 | -1.25 | standard rule |
| 2017-04-08 | Kamaru Usman | pre-prime | top-five | home | No | Yes | -0.75 | 0 | -0.75 | standard rule |
| 2018-05-12 | Elizeu Zaleski dos Santos | pre-prime | top-ten | home | Yes | Yes | -1.25 | -0.75 | -2 | standard rule |
| 2022-07-02 | Alex Pereira | prime | champion-level | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2022-12-17 | Jared Cannonier | prime | top-five | home | No | Yes | -1.5 | 0 | -1.5 | standard rule |
| 2024-01-20 | Dricus du Plessis | prime | champion-level | home | No | Yes | -1.5 | 0 | -1.5 | standard rule |
| 2025-02-08 | Dricus du Plessis | prime | champion-level | home | No | Yes | -1.5 | 0 | -1.5 | standard rule |

#### Division-strength context

Default division key: **modern-middleweight-1.00**. Era-ledger division multiplier: **0.98**. Division-era modifier: **+0.27**.

Adesanya through current elite form.

#### Key judgment calls

- **Adesanya win:** Massive title and apex proof because it was a clean five-round title upset.
- **Khamzat win:** Counts as current-table title-level elite proof.
- **Dricus rivalry:** Dricus has the direct edge twice, so Strickland cannot climb into the higher champion tier yet.
- **Pereira loss:** Counts as a prime finished loss to a champion/top-five level opponent.

#### Why ranked here

Strickland ranks here because the top of the UFC middleweight resume is loud: the Adesanya title upset is one of the best middleweight wins ever, the current-table Khamzat win adds elite title-level proof, and his pressure/defense style gives him real round-control value.

#### Why not ranked higher?

He does not rank higher because there is no long defense streak, the finishing profile is low, Dricus has direct title-fight separation twice, and the loss ledger reaches the cap.

#### Compare-mode guidance

- **Best counterargument:** The counterargument against Strickland is easy: not enough defenses, not enough finishes, and too many losses.
- **Why this résumé can still win:** Strickland wins comparisons when title upset value and round-control style outweigh cleaner records or longer but less explosive resumes.

#### Final takeaway

Strickland is a weird but legit UFC-only champion case: better than the belt-count summary looks, but capped hard by direct rivalry losses and the -10 loss penalty.

_Ledger verified through 2026-07-13. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

### 45. Deiveson Figueiredo — 89 OVR

A violent two-time UFC flyweight champion with real Moreno-rivalry title value, elite Pantoja/Benavidez wins, and useful bantamweight depth.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 45.88 | 14-7-1 | Flyweight / Bantamweight | 3 | 2.7 | 6 | 7-3-1 | 53.0% | 4.73 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 5.57 | 35 | 6.5 |
| Opponent Quality | 20.11 | 25 | 16.76 |
| Prime Dominance | 17.97 | 30 | 17.97 |
| Longevity | 12.06 | 10 | 4.02 |

Base score: **45.25**. Modifiers: Apex **+4.38**, Loss Penalty **-3.38**, Division-Era Depth **-0.37**. Final raw score: **45.88**.

OVR conversion: 18.68–101.92 board anchors, normalized score **0.326766**, curved score **0.386457**, resulting in **89 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 5.57 | #38 | 2.7 adjusted credit / 14.54 benchmark |
| Opponent Quality | 20.11 | #27 | 9.45 diminished credit / 14.1 benchmark |
| Prime Dominance | 17.97 | #49 | 17.97 raw × 100.0% sample |
| Longevity | 12.06 | #41 | 57.89 counted elite months |
| Apex | +4.38 | Modifier | A compliant two-win championship peak replaces the non-winning Moreno selection with no final score change. |
| Loss Penalty | -3.38 | Modifier | 7 official/technical loss events reviewed |
| Division-Era Depth | -0.37 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **3**. Adjusted title wins: **2.7**. Derived undisputed-title win count: **3**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 2020-07-19 | Joseph Benavidez | vacant-undisputed | 0.9 | 1 | 0.9 | Elite vacant-title opponent at full strength; missed-weight first fight context remains high-risk. |
| 2020-11-21 | Alex Perez | normal | 1 | 0.85 | 0.85 | locked |
| 2022-01-22 | Brandon Moreno | normal | 1 | 0.95 | 0.95 | locked |

#### Opponent Quality receipts

Raw win credit: **10.7**. Diminishing-return credit before fighter adjustment: **9.45**. Fighter adjustment: **0**. Final diminished credit: **9.45**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2022-01-22 | Brandon Moreno | champion-level | 1.25 | 1 | 1.25 | Elite flyweight champion and defining rival. |
| 2 | 2020-02-29 | Joseph Benavidez | champion-level | 1.15 | 1 | 1.15 | Elite flyweight great, division-calibrated below max. |
| 3 | 2019-07-27 | Alexandre Pantoja | top-five | 1 | 1 | 1 | Future UFC flyweight champion. |
| 4 | 2020-07-19 | Joseph Benavidez | top-five | 1 | 1 | 1 | Elite flyweight title contender. |
| 5 | 2024-08-03 | Marlon Vera | top-five | 1 | 1 | 1 | Top-five bantamweight win. |
| 6 | 2020-11-21 | Alex Perez | top-ten | 0.85 | 1 | 0.85 | Ranked flyweight title challenger. |
| 7 | 2025-10-11 | Montel Jackson | top-ten | 0.85 | 0.75 | 0.64 | Strong ranked bantamweight win. |
| 8 | 2018-08-25 | John Moraga | ranked | 0.65 | 0.75 | 0.49 | Ranked flyweight contender. |
| 9 | 2019-10-12 | Tim Elliott | ranked | 0.65 | 0.75 | 0.49 | Ranked flyweight contender. |
| 10 | 2023-12-02 | Rob Font | ranked | 0.65 | 0.75 | 0.49 | Ranked bantamweight veteran win. |
| 11 | 2024-04-13 | Cody Garbrandt | ranked | 0.65 | 0.75 | 0.49 | Former champion name, late-career timing. |
| 12 | 2017-10-28 | Jarred Brooks | solid | 0.45 | 0.75 | 0.34 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 13 | 2018-02-03 | Joseph Morales | solid | 0.45 | 0.5 | 0.23 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 14 | 2017-06-03 | Marco Beltrán | minimal | 0.1 | 0.5 | 0.05 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |

#### Prime Dominance receipts

Prime window: **Joseph Benavidez I → Petr Yan**. Prime record: **7-3-1**. Effective samples: **11**. Sample multiplier: **100.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 6.14 | 7-3-1; 68.2% |
| Round control | 4.77 | 53.0%; rounds 17-15 |
| Finish pressure | 2 | 4 finishes; 36.4% |
| Elite-level validation | 5.06 | 9 elite-stage fights; 5.06 points |
| Raw prime score | 17.97 | Before sample multiplier |
| Final Prime Dominance | 17.97 | 17.97 × 1 |

#### Longevity receipts

Active elite years: **4.73**. Raw calendar months: **56.8**. Gap-adjusted months: **56.8**. Status multiplier: **1.04**. Division multiplier: **0.98**. Counted elite months: **57.89**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 2020-02-29 | 2020-07-19 | 4.63 | 4.63 | No |
| 2020-07-19 | 2020-11-21 | 4.11 | 4.11 | No |
| 2020-11-21 | 2020-12-12 | 0.69 | 0.69 | No |
| 2020-12-12 | 2021-06-12 | 5.98 | 5.98 | No |
| 2021-06-12 | 2022-01-22 | 7.36 | 7.36 | No |
| 2022-01-22 | 2023-01-21 | 11.96 | 11.96 | No |
| 2023-01-21 | 2023-12-02 | 10.35 | 10.35 | No |
| 2023-12-02 | 2024-04-13 | 4.37 | 4.37 | No |
| 2024-04-13 | 2024-08-03 | 3.68 | 3.68 | No |
| 2024-08-03 | 2024-11-23 | 3.68 | 3.68 | No |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **18** fights. Severity: **2.25**. Frequency: **1.13**. Prime-volume floor: **2.75**. Pre-division magnitude: **3.38**. Division discount: **0.0%**. Final penalty: **-3.38**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Base | Finish extra | Raw event | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2019-03-23 | Jussier Formiga | pre-prime | top-five | home | No | Yes | -0.75 | 0 | -0.75 | standard rule |
| 2021-06-12 | Brandon Moreno | prime | champion-level | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2023-01-21 | Brandon Moreno | prime | champion-level | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2024-11-23 | Petr Yan | prime | champion-level | home | No | Yes | -1.5 | 0 | -1.5 | standard rule |
| 2025-05-03 | Cory Sandhagen | post-prime | top-five | home | Yes | No | 0 | 0 | 0 | technical-injury-context |
| 2026-01-24 | Umar Nurmagomedov | post-prime | top-five | catchweight | No | Yes | 0 | 0 | 0 | standard rule |
| 2026-05-30 | Song Yadong | post-prime | top-ten | home | Yes | Yes | 0 | 0 | 0 | standard rule |

#### Division-strength context

Default division key: **figueiredo-flyweight-bantamweight-0.98**. Era-ledger division multiplier: **0.98**. Division-era modifier: **-0.37**.

Benavidez I through Yan. Moreno IV was followed by BW elite relevance; Yan is endpoint.

#### Key judgment calls

- **Moreno rivalry:** The rivalry boosts the championship story, but Moreno II and IV put a real ceiling on the prime.
- **Benavidez I:** No double punishment: no title credit, but the win still supports quality and apex.
- **Pantoja win:** A full 1.00 quality win because it aged into elite flyweight proof.
- **BW run:** Font, Garbrandt, Vera, and Montel help the resume; Yan/Sandhagen/Umar/Song are mostly post-prime upward-division losses.

#### Why ranked here

Figueiredo ranks here because he has real championship meat: three UFC flyweight title-fight wins, a draw-retainment credit, a violent title peak, and enough quality wins to separate him from thin-title cases.

#### Why not ranked higher?

He does not rank higher because the reign was short, flyweight gets a division-strength discount, the Moreno rivalry includes two damaging title losses, and the late bantamweight run adds respect without becoming prime GOAT longevity.

#### Compare-mode guidance

- **Best counterargument:** The counterargument is that the clean reign was short and Moreno clearly capped the prime.
- **Why this résumé can still win:** Figueiredo wins comparisons when title-fight value and violent peak matter more than long clean dominance.

#### Final takeaway

Figueiredo is a real champion case with more title value than the thin-title group, but not enough clean reign length or division-strength leverage to jump the deeper UFC-only champion resumes.

_Ledger verified through 2026-07-13. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

### 46. Conor McGregor — 89 OVR

The iconic-moment case: Aldo in 13 seconds, Alvarez double-champ masterclass, unmatched UFC star power, and a short prime window.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 45.84 | 10-5 | Featherweight / Lightweight / Welterweight | 3 | 3 | 4 | 6-2 | 63.2% | 3.63 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 6.19 | 35 | 7.22 |
| Opponent Quality | 16.06 | 25 | 13.38 |
| Prime Dominance | 21.21 | 30 | 21.21 |
| Longevity | 10.47 | 10 | 3.49 |

Base score: **45.3**. Modifiers: Apex **+5.8**, Loss Penalty **-4.81**, Division-Era Depth **-0.45**. Final raw score: **45.84**.

OVR conversion: 18.68–101.92 board anchors, normalized score **0.326285**, curved score **0.385974**, resulting in **89 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 6.19 | #32 | 3 adjusted credit / 14.54 benchmark |
| Opponent Quality | 16.06 | #44 | 7.55 diminished credit / 14.1 benchmark |
| Prime Dominance | 21.21 | #25 | 21.21 raw × 100.0% sample |
| Longevity | 10.47 | #48 | 50.27 counted elite months |
| Apex | +5.8 | Modifier | Two-division superstar apex. |
| Loss Penalty | -4.81 | Modifier | 5 official/technical loss events reviewed |
| Division-Era Depth | -0.45 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **3**. Adjusted title wins: **3**. Derived undisputed-title win count: **2**. Interim-title win count: **1**.

| Date | Opponent | Title type | Base | Opponent strength | Final credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 2015-07-11 | Chad Mendes | interim | 0.75 | 1 | 0.75 | Cody-approved fighter audit: full 0.75 interim-title credit for the Chad Mendes win. |
| 2015-12-12 | Jose Aldo | normal | 1 | 1 | 1 | locked |
| 2016-11-12 | Eddie Alvarez | second-division-undisputed | 1.25 | 1 | 1.25 | Second-division undisputed title value. |

#### Opponent Quality receipts

Raw win credit: **8**. Diminishing-return credit before fighter adjustment: **7.55**. Fighter adjustment: **0**. Final diminished credit: **7.55**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2015-12-12 | Jose Aldo | champion-level | 1.25 | 1 | 1.25 | Prime featherweight champion and all-time great. |
| 2 | 2016-11-12 | Eddie Alvarez | champion-level | 1.25 | 1 | 1.25 | UFC lightweight champion. |
| 3 | 2013-08-17 | Max Holloway | top-five | 1 | 1 | 1 | Early win over future all-time featherweight great. |
| 4 | 2015-07-11 | Chad Mendes | top-five | 1 | 1 | 1 | Elite featherweight contender on short notice. |
| 5 | 2014-09-27 | Dustin Poirier | top-ten | 0.85 | 1 | 0.85 | Strong featherweight contender before later lightweight peak. |
| 6 | 2016-08-20 | Nate Diaz | top-ten | 0.85 | 1 | 0.85 | High-level rivalry win at welterweight; not title-contender context. |
| 7 | 2020-01-18 | Donald Cerrone | ranked | 0.65 | 0.75 | 0.49 | Big-name veteran with timing/fade context. |
| 8 | 2014-07-19 | Diego Brandao | solid | 0.45 | 0.75 | 0.34 | Solid featherweight win. |
| 9 | 2015-01-18 | Dennis Siver | solid | 0.45 | 0.75 | 0.34 | Solid featherweight win. |
| 10 | 2013-04-06 | Marcus Brimage | name-value | 0.25 | 0.75 | 0.19 | Early UFC win with limited quality value. |

#### Prime Dominance receipts

Prime window: **Dustin Poirier I → Khabib Nurmagomedov**. Prime record: **6-2**. Effective samples: **8**. Sample multiplier: **100.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 6.75 | 6-2; 75.0% |
| Round control | 5.68 | 63.2%; rounds 12-7 |
| Finish pressure | 4 | 5 finishes; 62.5% |
| Elite-level validation | 4.78 | 5 elite-stage fights; 4.78 points |
| Raw prime score | 21.21 | Before sample multiplier |
| Final Prime Dominance | 21.21 | 21.21 × 1 |

#### Longevity receipts

Active elite years: **3.63**. Raw calendar months: **48.3**. Gap-adjusted months: **43.5**. Status multiplier: **1.08**. Division multiplier: **1.07**. Counted elite months: **50.27**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 2014-09-27 | 2015-01-18 | 3.71 | 3.71 | No |
| 2015-01-18 | 2015-07-11 | 5.72 | 5.72 | No |
| 2015-07-11 | 2015-12-12 | 5.06 | 5.06 | No |
| 2015-12-12 | 2016-03-05 | 2.76 | 2.76 | No |
| 2016-03-05 | 2016-08-20 | 5.52 | 5.52 | No |
| 2016-08-20 | 2016-11-12 | 2.76 | 2.76 | No |
| 2016-11-12 | 2018-10-06 | 22.77 | 18 | Yes |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **11** fights. Severity: **3.5**. Frequency: **1.91**. Prime-volume floor: **2**. Pre-division magnitude: **5.41**. Division discount: **11.0%**. Final penalty: **-4.81**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Base | Finish extra | Raw event | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2016-03-05 | Nate Diaz | prime | top-ten | home | Yes | Yes | -4 | -0.75 | -4.75 | standard rule |
| 2018-10-06 | Khabib Nurmagomedov | prime | champion-level | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2021-01-24 | Dustin Poirier | post-prime | top-five | home | Yes | Yes | 0 | 0 | 0 | standard rule |
| 2021-07-10 | Dustin Poirier | post-prime | top-five | home | Yes | Yes | 0 | 0 | 0 | standard rule |
| 2026-07-11 | Max Holloway | post-prime | top-five | home | Yes | Yes | 0 | 0 | 0 | standard rule |

#### Division-strength context

Default division key: **mcgregor-featherweight-lightweight-1.06**. Era-ledger division multiplier: **1.07**. Division-era modifier: **-0.45**.

Poirier I through Khabib.

#### Key judgment calls

- **Star power:** respected in the profile but not allowed to replace championship volume.
- **Aldo knockout:** one of the biggest single wins in UFC history.
- **Alvarez win:** historic double-champ value and one of the cleanest title performances ever.
- **No title defenses:** major reason the championship score stays capped.
- **Later losses:** drag the resume but do not erase the short prime.

#### Why ranked here

McGregor ranks here because his best UFC moments are enormous. The Aldo knockout, Alvarez masterclass, Mendes win, Holloway win, and Poirier early win make his peak impact impossible to ignore.

#### Why not ranked higher?

He does not rank higher because the long-term UFC body of work is short. No title defenses, inactivity, and later losses keep the scoring honest even though the cultural impact is unmatched.

#### Compare-mode guidance

- **Best counterargument:** Conor’s argument is impact. If the debate is iconic moments, star power, and changing the business, he is in a class almost by himself.
- **Why this résumé can still win:** Conor wins comparisons when peak fame, historic moments, and two-division star power outweigh deeper but less spectacular resumes.

#### Final takeaway

Conor is the UFC iconic-moment king: massive peak impact and history-changing star power, but a shorter and less defended resume than the deeper GOAT cases.

_Ledger verified through 2026-07-13. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

### 47. Brandon Moreno — 88 OVR

The resilient two-reign flyweight champion: three UFC title-fight wins, a 2-1-1 Figueiredo rivalry edge, and nearly six active elite years.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 45.3 | 11-7-2 | Flyweight | 3 | 2.65 | 5 | 7-4-1 | 62.2% | 5.73 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 5.47 | 35 | 6.38 |
| Opponent Quality | 17.31 | 25 | 14.42 |
| Prime Dominance | 18.36 | 30 | 18.36 |
| Longevity | 14.33 | 10 | 4.78 |

Base score: **43.94**. Modifiers: Apex **+4.97**, Loss Penalty **-3.25**, Division-Era Depth **-0.37**. Final raw score: **45.3**.

OVR conversion: 18.68–101.92 board anchors, normalized score **0.319798**, curved score **0.379441**, resulting in **88 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 5.47 | #39 | 2.65 adjusted credit / 14.54 benchmark |
| Opponent Quality | 17.31 | #40 | 8.39 diminished credit / 14.54 benchmark |
| Prime Dominance | 18.36 | #46 | 18.36 raw × 100.0% sample |
| Longevity | 14.33 | #29 | 68.8 counted elite months |
| Apex | +4.97 | Modifier | The UFC 263 submission and UFC 283 title reclaim are two championship-proven performances that define Moreno’s four-fight rivalry and flyweight peak. |
| Loss Penalty | -3.25 | Modifier | 7 official/technical loss events reviewed |
| Division-Era Depth | -0.37 | Modifier | Use a modest modern-flyweight discount. The division is deeper than its launch era, but still below the strongest lightweight and welterweight periods. |

#### Championship receipts

UFC title-fight wins: **3**. Adjusted title wins: **2.65**. Derived undisputed-title win count: **2**. Interim-title win count: **1**.

| Date | Opponent | Title type | Base | Opponent strength | Final credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| — | Deiveson Figueiredo | — | — | — | 1 | locked |
| — | Kai Kara-France | — | — | — | 0.65 | locked |
| — | Deiveson Figueiredo | — | — | — | 1 | locked |

#### Opponent Quality receipts

Raw win credit: **9.15**. Diminishing-return credit before fighter adjustment: **8.39**. Fighter adjustment: **0**. Final diminished credit: **8.39**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | — | Deiveson Figueiredo | — | 1.25 | 1 | 1.25 | Reigning champion submitted for the undisputed title. |
| 2 | — | Deiveson Figueiredo | — | 1.15 | 1 | 1.15 | Reigning champion and defining rival; doctor-stoppage context slightly discounts the maximum. |
| 3 | — | Jussier Formiga | — | 1 | 1 | 1 | Top-five breakthrough win. |
| 4 | — | Kai Kara-France | — | 1 | 1 | 1 | Top-five interim-title win. |
| 5 | — | Amir Albazi | — | 0.85 | 1 | 0.85 | Top-five win discounted for Albazi’s long inactivity. |
| 6 | — | Brandon Royval | — | 0.85 | 1 | 0.85 | Ranked future title challenger. |
| 7 | — | Dustin Ortiz | — | 0.65 | 0.75 | 0.49 | Ranked flyweight contender. |
| 8 | — | Kai Kara-France | — | 0.65 | 0.75 | 0.49 | Ranked flyweight contender. |
| 9 | — | Louis Smolka | — | 0.65 | 0.75 | 0.49 | Ranked debut win. |
| 10 | — | Steve Erceg | — | 0.65 | 0.75 | 0.49 | Ranked former title challenger coming off losses. |
| 11 | — | Ryan Benoit | — | 0.45 | 0.75 | 0.34 | Solid UFC win without elite ranking value. |

#### Prime Dominance receipts

Prime window: **Jussier Formiga → Tatsuro Taira**. Prime record: **7-4-1**. Effective samples: **12**. Sample multiplier: **100.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 5.63 | 7-4-1; 62.5% |
| Round control | 5.6 | 62.2%; rounds 28-17 |
| Finish pressure | 2 | 4 finishes; 33.3% |
| Elite-level validation | 5.13 | 10 elite-stage fights; 5.13 points |
| Raw prime score | 18.36 | Before sample multiplier |
| Final Prime Dominance | 18.36 | 18.36 × 1 |

#### Longevity receipts

Active elite years: **5.73**. Raw calendar months: **68.8**. Gap-adjusted months: **68.8**. Status multiplier: **1**. Division multiplier: **1**. Counted elite months: **68.8**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 2020-03-14 | 2020-11-21 | 8.28 | 8.28 | No |
| 2020-11-21 | 2020-12-12 | 0.69 | 0.69 | No |
| 2020-12-12 | 2021-06-12 | 5.98 | 5.98 | No |
| 2021-06-12 | 2022-01-22 | 7.36 | 7.36 | No |
| 2022-01-22 | 2022-07-30 | 6.21 | 6.21 | No |
| 2022-07-30 | 2023-01-21 | 5.75 | 5.75 | No |
| 2023-01-21 | 2023-07-08 | 5.52 | 5.52 | No |
| 2023-07-08 | 2024-02-24 | 7.59 | 7.59 | No |
| 2024-02-24 | 2024-11-02 | 8.28 | 8.28 | No |
| 2024-11-02 | 2025-03-29 | 4.83 | 4.83 | No |
| 2025-03-29 | 2025-12-06 | 8.28 | 8.28 | No |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **19** fights. Severity: **1.88**. Frequency: **1.3**. Prime-volume floor: **3.25**. Pre-division magnitude: **3.25**. Division discount: **0.0%**. Final penalty: **-3.25**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Base | Finish extra | Raw event | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2017-08-05 | Sergio Pettis | pre-prime | top-five | home | No | Yes | -0.75 | 0 | -0.75 | standard rule |
| 2018-05-19 | Alexandre Pantoja | pre-prime | top-five | home | No | Yes | -0.75 | 0 | -0.75 | standard rule |
| 2022-01-22 | Deiveson Figueiredo | prime | champion-level | home | No | Yes | -1.5 | 0 | -1.5 | standard rule |
| 2023-07-08 | Alexandre Pantoja | prime | top-five | home | No | Yes | -1.5 | 0 | -1.5 | standard rule |
| 2024-02-24 | Brandon Royval | prime | top-five | home | No | Yes | -1.5 | 0 | -1.5 | standard rule |
| 2025-12-06 | Tatsuro Taira | prime | top-five | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2026-02-28 | Lone’er Kavanagh | post-prime | top-ten | home | No | Yes | 0 | 0 | 0 | standard rule |

#### Division-strength context

Default division key: **modern-flyweight-0.95**. Era-ledger division multiplier: **1**. Division-era modifier: **-0.37**.

Modern flyweight is deeper than the division’s launch era but remains below the strongest lightweight and welterweight periods.

#### Key judgment calls

- **Nickname:** The app-facing profile name is Brandon “The Assassin Baby” Moreno.
- **UFC-only scope:** The Ultimate Fighter exhibition loss to Alexandre Pantoja and all regional fights are excluded.
- **Prime start:** Jussier Formiga begins the connected elite run.
- **Prime end:** Tatsuro Taira is the unrecovered prime finish loss; Lone’er Kavanagh is post-prime decline confirmation.
- **Figueiredo rivalry:** The official UFC series is 2-1-1 for Moreno and anchors his championship case.
- **Pantoja rivalry:** Pantoja leads the official UFC series 2-0; the TUF exhibition is not part of the UFC record.
- **Division depth:** Modern flyweight receives a modest discount rather than the heavier launch-era flyweight penalty.

#### Why ranked here

Moreno earns his place through three UFC title-fight wins, five top-five victories, two undisputed title reigns, an interim-title finish, and a deep modern flyweight prime. His UFC 263 submission and UFC 283 title reclaim give the resume championship proof and historical identity.

#### Why not ranked higher?

He does not rank higher because he never completed a successful undisputed defense, lost both official UFC fights to Alexandre Pantoja, and accumulated four counted prime losses. Modern flyweight also receives a modest division-depth discount compared with the strongest all-time divisions.

#### Compare-mode guidance

- **Best counterargument:** The best counterargument against Moreno is title control: he never completed a successful undisputed defense, lost both official UFC fights to Pantoja, and carries four counted prime losses.
- **Why this résumé can still win:** Moreno wins appropriate comparisons through championship resilience, rivalry proof, and a deeper elite window than most two-reign champions. He repeatedly recovered from losses and returned to title level.

#### Final takeaway

Moreno is the resilience champion of the flyweight GOAT conversation: two undisputed reigns, three title-fight wins, rivalry history, and real longevity. The absence of a completed undisputed defense and the Pantoja losses keep him below the division’s deepest UFC-only resumes.

_Ledger verified through 2026-07-17. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

### 48. Vitor Belfort — 88 OVR

A three-era knockout threat whose explosive finishing, five Top-5 wins, and violent 2013 contender run created a dangerous but uneven UFC legacy.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 45.22 | 15-10, 1 NC | Middleweight / Light Heavyweight / Heavyweight / Catchweight | 1 | 1.11 | 5 | 7-3 | 64.3% | 6.1 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 2.3 | 35 | 2.68 |
| Opponent Quality | 18.72 | 25 | 15.6 |
| Prime Dominance | 20.97 | 30 | 20.97 |
| Longevity | 15.24 | 10 | 5.08 |

Base score: **44.33**. Modifiers: Apex **+5.26**, Loss Penalty **-3.71**, Division-Era Depth **-0.66**. Final raw score: **45.22**.

OVR conversion: 18.68–101.92 board anchors, normalized score **0.318837**, curved score **0.378472**, resulting in **88 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 2.3 | #55 | 1.11 adjusted credit / 14.54 benchmark |
| Opponent Quality | 18.72 | #37 | 8.8 diminished credit / 14.1 benchmark |
| Prime Dominance | 20.97 | #27 | 20.97 raw × 100.0% sample |
| Longevity | 15.24 | #28 | 73.17 counted elite months |
| Apex | +5.26 | Modifier | Back-to-back elite head-kick finishes create maximum Aura, strong Proof, and a real but not maximum best-fighter claim. |
| Loss Penalty | -3.71 | Modifier | 10 official/technical loss events reviewed |
| Division-Era Depth | -0.66 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **1**. Adjusted title wins: **1.11**. Derived undisputed-title win count: **1**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1997-02-07 | Scott Ferrozzo | tournament | 0.85 | 0.29 | 0.25 | Approved aggregate Championship score recovered from the live control; exact historical per-fight split was not stored. |
| 2004-01-31 | Randy Couture | normal | 1 | 0.85 | 0.86 | Approved aggregate Championship score recovered from the live control; exact historical per-fight split was not stored. |

#### Opponent Quality receipts

Raw win credit: **9.85**. Diminishing-return credit before fighter adjustment: **8.8**. Fighter adjustment: **0**. Final diminished credit: **8.8**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2009-09-19 | Rich Franklin | champion-level | 1.25 | 1 | 1.25 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 2 | 2004-01-31 | Randy Couture | top-five | 1 | 1 | 1 | Official champion win with unusual cut stoppage. |
| 3 | 2013-01-19 | Michael Bisping | top-five | 1 | 1 | 1 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 4 | 2013-05-18 | Luke Rockhold | top-five | 1 | 1 | 1 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 5 | 2013-11-09 | Dan Henderson | top-five | 1 | 1 | 1 | Only this UFC bout is scored; PRIDE meeting is excluded. |
| 6 | 1998-10-16 | Wanderlei Silva | top-ten | 0.85 | 1 | 0.85 | UFC-only credit; later PRIDE career is context only. |
| 7 | 2012-01-14 | Anthony Johnson | top-ten | 0.85 | 0.75 | 0.64 | Johnson missed weight. |
| 8 | 2015-11-07 | Dan Henderson | top-ten | 0.85 | 0.75 | 0.64 | Late-career opponent; UFC-only bout. |
| 9 | 1997-02-07 | Scott Ferrozzo | solid | 0.45 | 0.75 | 0.34 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 10 | 2003-06-06 | Marvin Eastman | solid | 0.45 | 0.75 | 0.34 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 11 | 2011-08-06 | Yoshihiro Akiyama | solid | 0.45 | 0.75 | 0.34 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 12 | 1997-05-30 | Tank Abbott | name-value | 0.25 | 0.75 | 0.19 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 13 | 2017-06-03 | Nate Marquardt | name-value | 0.25 | 0.5 | 0.13 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 14 | 1997-02-07 | Tra Telligman | minimal | 0.1 | 0.5 | 0.05 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 15 | 1997-12-21 | Joe Charles | minimal | 0.1 | 0.5 | 0.05 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |

#### Prime Dominance receipts

Prime window: **Rich Franklin → Dan Henderson III**. Prime record: **7-3**. Effective samples: **10**. Sample multiplier: **100.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 6.3 | 7-3; 70.0% |
| Round control | 5.79 | 64.3%; rounds 9-5 |
| Finish pressure | 4 | 7 finishes; 70.0% |
| Elite-level validation | 4.88 | 7 elite-stage fights; 4.88 points |
| Raw prime score | 20.97 | Before sample multiplier |
| Final Prime Dominance | 20.97 | 20.97 × 1 |

#### Longevity receipts

Active elite years: **6.1**. Raw calendar months: **73.6**. Gap-adjusted months: **73.2**. Status multiplier: **1.02**. Division multiplier: **0.98**. Counted elite months: **73.17**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 2009-09-19 | 2011-02-05 | 16.56 | 16.56 | No |
| 2011-02-05 | 2011-08-06 | 5.98 | 5.98 | No |
| 2011-08-06 | 2012-01-14 | 5.29 | 5.29 | No |
| 2012-01-14 | 2012-09-22 | 8.28 | 8.28 | No |
| 2012-09-22 | 2013-01-19 | 3.91 | 3.91 | No |
| 2013-01-19 | 2013-05-18 | 3.91 | 3.91 | No |
| 2013-05-18 | 2013-11-09 | 5.75 | 5.75 | No |
| 2013-11-09 | 2015-05-23 | 18.4 | 18 | Yes |
| 2015-05-23 | 2015-11-07 | 5.52 | 5.52 | No |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **21** fights. Severity: **2.25**. Frequency: **1.46**. Prime-volume floor: **3**. Pre-division magnitude: **3.71**. Division discount: **0.0%**. Final penalty: **-3.71**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Base | Finish extra | Raw event | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1997-10-17 | Randy Couture | pre-prime | champion-level | home | Yes | Yes | -0.75 | -0.75 | -1.5 | standard rule |
| 2002-06-22 | Chuck Liddell | pre-prime | champion-level | home | No | Yes | -0.75 | 0 | -0.75 | standard rule |
| 2004-08-21 | Randy Couture | pre-prime | champion-level | home | Yes | Yes | -0.75 | -0.75 | -1.5 | standard rule |
| 2005-02-05 | Tito Ortiz | pre-prime | champion-level | home | No | Yes | -0.75 | 0 | -0.75 | standard rule |
| 2011-02-05 | Anderson Silva | prime | champion-level | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2012-09-22 | Jon Jones | prime | champion-level | upward | Yes | Yes | -0.75 | -0.5 | -1.25 | standard rule |
| 2015-05-23 | Chris Weidman | prime | champion-level | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2016-05-14 | Ronaldo Souza | post-prime | top-five | home | Yes | Yes | 0 | 0 | 0 | standard rule |
| 2016-10-08 | Gegard Mousasi | post-prime | top-five | home | Yes | Yes | 0 | 0 | 0 | standard rule |
| 2018-05-12 | Lyoto Machida | post-prime | top-ten | home | Yes | Yes | 0 | 0 | 0 | standard rule |

#### Division-strength context

Default division key: **vitor-multi-era-0.97**. Era-ledger division multiplier: **0.98**. Division-era modifier: **-0.66**.

Mixed heavyweight, light-heavyweight and middleweight UFC eras.

#### Key judgment calls

- **Prime window:** Rich Franklin → Dan Henderson III.
- **Coverage:** Complete UFC-only ledger.
- **Prime endpoint:** Henderson III closes the last sustained UFC elite phase before the late decline.

#### Why ranked here

Belfort ranks here because he produced elite UFC wins across an extraordinary span. His ledger includes Rich Franklin, Randy Couture, Michael Bisping, Luke Rockhold, Dan Henderson, Wanderlei Silva, and Anthony Johnson, while fifteen UFC wins and a 93% finishing rate give the résumé rare offensive force and longevity.

#### Why not ranked higher?

He does not rank higher because the championship case is thin and unusual: his only undisputed title win came through an early cut stoppage over Randy Couture, and he never defended the belt. Prime finish losses to Anderson Silva, Jon Jones, and Chris Weidman create major drag, while ten official UFC losses make the total résumé far less stable than the champions above him.

#### Final takeaway

Belfort ranks here because he produced elite UFC wins across an extraordinary span. His ledger includes Rich Franklin, Randy Couture, Michael Bisping, Luke Rockhold, Dan Henderson, Wanderlei Silva, and Anthony Johnson, while fifteen UFC wins and a 93% finishing rate give the résumé rare offensive force and longevity.

_Ledger verified through 2026-07-13. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

### 49. Lyoto Machida — 88 OVR

The Machida Era was short, but real: UFC light heavyweight gold, a scary apex, and elite wins across LHW and MW — capped by a short reign and loud prime losses.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 45.18 | 16-8 | Light Heavyweight / Middleweight | 2 | 1.95 | 7 | 9-5 | 58.3% | 5.88 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 4.02 | 35 | 4.69 |
| Opponent Quality | 21.44 | 25 | 17.87 |
| Prime Dominance | 17.86 | 30 | 17.86 |
| Longevity | 13.96 | 10 | 4.65 |

Base score: **45.07**. Modifiers: Apex **+4.64**, Loss Penalty **-4.25**, Division-Era Depth **-0.28**. Final raw score: **45.18**.

OVR conversion: 18.68–101.92 board anchors, normalized score **0.318357**, curved score **0.377987**, resulting in **88 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 4.02 | #46 | 1.95 adjusted credit / 14.54 benchmark |
| Opponent Quality | 21.44 | #20 | 10.07 diminished credit / 14.1 benchmark |
| Prime Dominance | 17.86 | #51 | 17.86 raw × 100.0% sample |
| Longevity | 13.96 | #32 | 67.03 counted elite months |
| Apex | +4.64 | Modifier | Machida-era style aura with title-level proof. |
| Loss Penalty | -4.25 | Modifier | 8 official/technical loss events reviewed |
| Division-Era Depth | -0.28 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **2**. Adjusted title wins: **1.95**. Derived undisputed-title win count: **2**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 2009-05-23 | Rashad Evans | normal | 1 | 1 | 1 | locked |
| 2009-10-24 | Mauricio Rua | normal | 1 | 0.95 | 0.95 | Controversial first Shogun decision/title defense. |

#### Opponent Quality receipts

Raw win credit: **11.9**. Diminishing-return credit before fighter adjustment: **10.07**. Fighter adjustment: **0**. Final diminished credit: **10.07**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2009-05-23 | Rashad Evans | champion-level | 1.25 | 1 | 1.25 | UFC light heavyweight champion. |
| 2 | 2009-10-24 | Mauricio Rua | champion-level | 1.25 | 1 | 1.25 | Elite champion-level light heavyweight; controversial decision context. |
| 3 | 2012-08-04 | Ryan Bader | top-five | 1 | 1 | 1 | Top-five light-heavyweight contender. |
| 4 | 2014-02-15 | Gegard Mousasi | top-five | 1 | 1 | 1 | Elite middleweight/light-heavyweight contender. |
| 5 | 2007-12-29 | Rameau Thierry Sokoudjou | top-ten | 0.85 | 1 | 0.85 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 6 | 2008-05-24 | Tito Ortiz | top-ten | 0.85 | 1 | 0.85 | Former UFC champion, later-career but still relevant. |
| 7 | 2009-01-31 | Thiago Silva | top-ten | 0.85 | 0.75 | 0.64 | Undefeated ranked light heavyweight contender. |
| 8 | 2013-02-23 | Dan Henderson | top-ten | 0.85 | 0.75 | 0.64 | All-time name and ranked light heavyweight, timing context. |
| 9 | 2011-04-30 | Randy Couture | ranked | 0.65 | 0.75 | 0.49 | Legend name, late-career timing. |
| 10 | 2013-10-26 | Mark Munoz | ranked | 0.65 | 0.75 | 0.49 | Ranked middleweight win. |
| 11 | 2018-02-03 | Eryk Anders | ranked | 0.65 | 0.75 | 0.49 | Ranked-quality middleweight win. |
| 12 | 2007-02-03 | Sam Hoger | solid | 0.45 | 0.75 | 0.34 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 13 | 2007-05-26 | David Heath | solid | 0.45 | 0.5 | 0.23 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 14 | 2007-09-22 | Kazuhiro Nakamura | solid | 0.45 | 0.5 | 0.23 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 15 | 2014-12-20 | C.B. Dollaway | solid | 0.45 | 0.5 | 0.23 | Solid UFC middleweight win. |
| 16 | 2018-05-12 | Vitor Belfort | name-value | 0.25 | 0.5 | 0.13 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |

#### Prime Dominance receipts

Prime window: **Thiago Silva → Chris Weidman**. Prime record: **9-5**. Effective samples: **13**. Sample multiplier: **100.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 5.54 | 8-5; 61.5% |
| Round control | 5.14 | 57.1%; rounds 20-15 |
| Finish pressure | 2 | 5 finishes; 38.5% |
| Elite-level validation | 5.18 | 12 elite-stage fights; 5.18 points |
| Raw prime score | 17.86 | Before sample multiplier |
| Final Prime Dominance | 17.86 | 17.86 × 1 |

#### Longevity receipts

Active elite years: **5.88**. Raw calendar months: **65.1**. Gap-adjusted months: **65.1**. Status multiplier: **1.04**. Division multiplier: **0.99**. Counted elite months: **67.03**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 2009-01-31 | 2009-05-23 | 3.68 | 3.68 | No |
| 2009-05-23 | 2009-10-24 | 5.06 | 5.06 | No |
| 2009-10-24 | 2010-05-08 | 6.44 | 6.44 | No |
| 2010-05-08 | 2010-11-20 | 6.44 | 6.44 | No |
| 2010-11-20 | 2011-04-30 | 5.29 | 5.29 | No |
| 2011-04-30 | 2011-12-10 | 7.36 | 7.36 | No |
| 2011-12-10 | 2012-08-04 | 7.82 | 7.82 | No |
| 2012-08-04 | 2013-02-23 | 6.67 | 6.67 | No |
| 2013-02-23 | 2013-08-03 | 5.29 | 5.29 | No |
| 2013-08-03 | 2013-10-26 | 2.76 | 2.76 | No |
| 2013-10-26 | 2014-02-15 | 3.68 | 3.68 | No |
| 2014-02-15 | 2014-07-05 | 4.6 | 4.6 | No |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **18** fights. Severity: **2.25**. Frequency: **1.5**. Prime-volume floor: **4.25**. Pre-division magnitude: **4.25**. Division discount: **0.0%**. Final penalty: **-4.25**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Base | Finish extra | Raw event | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2010-05-08 | Mauricio Rua | prime | champion-level | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2010-11-20 | Quinton Jackson | prime | top-five | home | No | Yes | -1.5 | 0 | -1.5 | standard rule |
| 2011-12-10 | Jon Jones | prime | champion-level | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2013-08-03 | Phil Davis | prime | top-five | home | No | Yes | -1.5 | 0 | -1.5 | standard rule |
| 2014-07-05 | Chris Weidman | prime | champion-level | home | No | Yes | -1.5 | 0 | -1.5 | standard rule |
| 2015-04-18 | Luke Rockhold | post-prime | top-five | home | Yes | Yes | 0 | 0 | 0 | standard rule |
| 2015-06-27 | Yoel Romero | post-prime | top-five | home | Yes | Yes | 0 | 0 | 0 | standard rule |
| 2017-10-28 | Derek Brunson | post-prime | top-ten | home | Yes | Yes | 0 | 0 | 0 | standard rule |

#### Division-strength context

Default division key: **mixed-lhw-middleweight-0.99**. Era-ledger division multiplier: **0.99**. Division-era modifier: **-0.28**.

Thiago Silva through Weidman.

#### Key judgment calls

- **Rashad title win:** Max quality-win credit plus major championship and apex proof.
- **Short title reign:** Two official title-fight wins, but only about 1.65 adjusted title-win credit after the Shogun I discount.
- **Mousasi win:** Strong five-round middleweight win that helps the non-title resume.
- **Loss context:** Prime elite losses are understandable, but the volume is too heavy for a higher GOAT tier.

#### Why ranked here

Machida ranks here because his UFC-only case has real championship value, a memorable best-in-the-world window, and enough elite wins to sit above most non-champion or thin-title cases.

#### Why not ranked higher?

He does not rank higher because the title reign was short, the Shogun defense is discounted for controversy, and Shogun, Rampage, Jones, Davis, and Weidman create a heavy prime-loss profile.

#### Compare-mode guidance

- **Best counterargument:** The counterargument is that the Machida Era was short, Shogun solved him quickly, and the prime loss column is too loud.
- **Why this résumé can still win:** Machida wins comparisons when apex aura, defensive skill, and undisputed title value matter more than long-reign volume.

#### Final takeaway

Machida belongs in the respected former-champion tier: higher than most one-window contenders, below the deeper title-reign and cleaner-resume GOAT cases.

_Ledger verified through 2026-07-13. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

### 50. Rashad Evans — 88 OVR

A deep one-reign light-heavyweight champion whose seven Top-5 wins, iconic Chuck Liddell knockout, and Forrest Griffin title victory built a stronger résumé than the brief reign suggests.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 44.95 | 14-8-1 | Light Heavyweight / Heavyweight / Middleweight | 1 | 0.9 | 7 | 9-3 | 60.0% | 6 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 1.85 | 35 | 2.16 |
| Opponent Quality | 21.41 | 25 | 17.84 |
| Prime Dominance | 19.7 | 30 | 19.7 |
| Longevity | 15.6 | 10 | 5.2 |

Base score: **44.9**. Modifiers: Apex **+4.99**, Loss Penalty **-4.42**, Division-Era Depth **-0.52**. Final raw score: **44.95**.

OVR conversion: 18.68–101.92 board anchors, normalized score **0.315593**, curved score **0.375197**, resulting in **88 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 1.85 | #60 | 0.9 adjusted credit / 14.54 benchmark |
| Opponent Quality | 21.41 | #21 | 10.06 diminished credit / 14.1 benchmark |
| Prime Dominance | 19.7 | #33 | 19.7 raw × 100.0% sample |
| Longevity | 15.6 | #25 | 74.88 counted elite months |
| Apex | +4.99 | Modifier | An iconic knockout followed by a title-winning finish creates a near-5.00 Apex without a sustained best-fighter claim. |
| Loss Penalty | -4.42 | Modifier | 8 official/technical loss events reviewed |
| Division-Era Depth | -0.52 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **1**. Adjusted title wins: **0.9**. Derived undisputed-title win count: **1**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 2008-12-27 | Forrest Griffin | normal | 1 | 0.9 | 0.9 | Approved aggregate Championship score recovered from the live control; exact historical per-fight split was not stored. |

#### Opponent Quality receipts

Raw win credit: **11.35**. Diminishing-return credit before fighter adjustment: **10.06**. Fighter adjustment: **0**. Final diminished credit: **10.06**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2008-09-06 | Chuck Liddell | champion-level | 1.25 | 1 | 1.25 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 2 | 2008-12-27 | Forrest Griffin | champion-level | 1.25 | 1 | 1.25 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 3 | 2010-05-29 | Quinton Jackson | champion-level | 1.25 | 1 | 1.25 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 4 | 2007-11-17 | Michael Bisping | top-five | 1 | 1 | 1 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 5 | 2010-01-02 | Thiago Silva | top-five | 1 | 1 | 1 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 6 | 2012-01-28 | Phil Davis | top-five | 1 | 1 | 1 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 7 | 2013-06-15 | Dan Henderson | top-five | 1 | 0.75 | 0.75 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 8 | 2011-08-06 | Tito Ortiz | top-ten | 0.85 | 0.75 | 0.64 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 9 | 2013-11-16 | Chael Sonnen | top-ten | 0.85 | 0.75 | 0.64 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 10 | 2005-11-05 | Brad Imes | solid | 0.45 | 0.75 | 0.34 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 11 | 2006-04-06 | Sam Hoger | solid | 0.45 | 0.75 | 0.34 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 12 | 2006-06-28 | Stephan Bonnar | solid | 0.45 | 0.75 | 0.34 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 13 | 2006-09-23 | Jason Lambert | solid | 0.45 | 0.5 | 0.23 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 14 | 2007-01-25 | Sean Salmon | minimal | 0.1 | 0.5 | 0.05 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |

#### Prime Dominance receipts

Prime window: **Michael Bisping → Chael Sonnen**. Prime record: **9-3**. Effective samples: **12**. Sample multiplier: **100.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 6.75 | 9-3; 75.0% |
| Round control | 5.4 | 60.0%; rounds 21-14 |
| Finish pressure | 2 | 4 finishes; 33.3% |
| Elite-level validation | 5.55 | 9 elite-stage fights; 5.55 points |
| Raw prime score | 19.7 | Before sample multiplier |
| Final Prime Dominance | 19.7 | 19.7 × 1 |

#### Longevity receipts

Active elite years: **6**. Raw calendar months: **72**. Gap-adjusted months: **72**. Status multiplier: **1.04**. Division multiplier: **1**. Counted elite months: **74.88**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 2007-11-17 | 2008-09-06 | 9.66 | 9.66 | No |
| 2008-09-06 | 2008-12-27 | 3.68 | 3.68 | No |
| 2008-12-27 | 2009-05-23 | 4.83 | 4.83 | No |
| 2009-05-23 | 2010-01-02 | 7.36 | 7.36 | No |
| 2010-01-02 | 2010-05-29 | 4.83 | 4.83 | No |
| 2010-05-29 | 2011-08-06 | 14.26 | 14.26 | No |
| 2011-08-06 | 2012-01-28 | 5.75 | 5.75 | No |
| 2012-01-28 | 2012-04-21 | 2.76 | 2.76 | No |
| 2012-04-21 | 2013-02-02 | 9.43 | 9.43 | No |
| 2013-02-02 | 2013-06-15 | 4.37 | 4.37 | No |
| 2013-06-15 | 2013-11-16 | 5.06 | 5.06 | No |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **18** fights. Severity: **3.13**. Frequency: **1.29**. Prime-volume floor: **2.5**. Pre-division magnitude: **4.42**. Division discount: **0.0%**. Final penalty: **-4.42**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Base | Finish extra | Raw event | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2009-05-23 | Lyoto Machida | prime | champion-level | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2012-04-21 | Jon Jones | prime | champion-level | home | No | Yes | -1.5 | 0 | -1.5 | standard rule |
| 2013-02-02 | Antônio Rogério Nogueira | prime | ranked | home | No | Yes | -4 | 0 | -4 | standard rule |
| 2015-10-03 | Ryan Bader | post-prime | top-five | home | No | Yes | 0 | 0 | 0 | standard rule |
| 2016-04-16 | Glover Teixeira | post-prime | top-five | home | Yes | Yes | 0 | 0 | 0 | standard rule |
| 2017-03-04 | Daniel Kelly | post-prime | solid | home | No | Yes | 0 | 0 | 0 | standard rule |
| 2017-08-05 | Sam Alvey | post-prime | solid | home | No | Yes | 0 | 0 | 0 | standard rule |
| 2018-06-09 | Anthony Smith | post-prime | top-ten | home | Yes | Yes | 0 | 0 | 0 | standard rule |

#### Division-strength context

Default division key: **light-heavyweight-1.00**. Era-ledger division multiplier: **1**. Division-era modifier: **-0.52**.

Bisping through Sonnen.

#### Key judgment calls

- **Prime window:** Michael Bisping → Chael Sonnen.
- **Coverage:** Complete UFC-only ledger.
- **Prime endpoint:** Sonnen closes the sustained UFC light-heavyweight elite window.

#### Why ranked here

Evans ranks here because his UFC light-heavyweight ledger is loaded with meaningful wins. He knocked out Chuck Liddell, stopped Forrest Griffin to win the title, beat Rampage Jackson, Michael Bisping, Phil Davis, Thiago Silva, and Dan Henderson, and produced a 9-3 prime across six active elite years.

#### Why not ranked higher?

He does not rank higher because the championship reign lasted only one title-fight win and ended immediately against Lyoto Machida. The Jon Jones loss is understandable elite damage, but the Antônio Rogério Nogueira upset is a costly non-elite prime loss. With no successful defense and only a 60% rounds-won rate, his résumé trails the longer and cleaner light-heavyweight champions above him.

#### Final takeaway

Evans ranks here because his UFC light-heavyweight ledger is loaded with meaningful wins. He knocked out Chuck Liddell, stopped Forrest Griffin to win the title, beat Rampage Jackson, Michael Bisping, Phil Davis, Thiago Silva, and Dan Henderson, and produced a 9-3 prime across six active elite years.

_Ledger verified through 2026-07-13. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

### 51. Tom Aspinall — 88 OVR

The heavyweight speed-and-finishing case: eight UFC wins, eight finishes, two interim-title wins, and a freak-injury loss that does not represent a competitive defeat.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 44.48 | 8-1, 1 NC | Heavyweight | 2 | 1.5 | 2 | 4-0, 1 NC | 100.0% | 4.32 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 3.09 | 35 | 3.6 |
| Opponent Quality | 10.45 | 25 | 8.71 |
| Prime Dominance | 23.59 | 30 | 23.59 |
| Longevity | 11.19 | 10 | 3.73 |

Base score: **39.63**. Modifiers: Apex **+5.09**, Loss Penalty **0**, Division-Era Depth **-0.25**. Final raw score: **44.48**.

OVR conversion: 18.68–101.92 board anchors, normalized score **0.309947**, curved score **0.369483**, resulting in **88 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 3.09 | #53 | 1.5 adjusted credit / 14.54 benchmark |
| Opponent Quality | 10.45 | #61 | 5.06 diminished credit / 14.54 benchmark |
| Prime Dominance | 23.59 | #13 | 27.75 raw × 85.0% sample |
| Longevity | 11.19 | #44 | 53.71 counted elite months |
| Apex | +5.09 | Modifier | Back-to-back first-round interim-title knockouts establish an elite heavyweight apex; undisputed title proof remains incomplete because the Gane defense ended in a no contest. |
| Loss Penalty | 0 | Modifier | 1 official/technical loss events reviewed |
| Division-Era Depth | -0.25 | Modifier | Apply a modest modern-heavyweight depth discount: dangerous elite contenders, but less full-roster depth than the strongest lightweight and welterweight eras. |

#### Championship receipts

UFC title-fight wins: **2**. Adjusted title wins: **1.5**. Derived undisputed-title win count: **0**. Interim-title win count: **2**.

| Date | Opponent | Title type | Base | Opponent strength | Final credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| — | Sergei Pavlovich | — | — | — | 0.75 | locked |
| — | Curtis Blaydes II | — | — | — | 0.75 | locked |

#### Opponent Quality receipts

Raw win credit: **5.15**. Diminishing-return credit before fighter adjustment: **5.06**. Fighter adjustment: **0**. Final diminished credit: **5.06**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | — | Curtis Blaydes | — | 1 | 1 | 1 | locked |
| 2 | — | Sergei Pavlovich | — | 1 | 1 | 1 | locked |
| 3 | — | Alexander Volkov | — | 0.85 | 1 | 0.85 | locked |
| 4 | — | Marcin Tybura | — | 0.85 | 1 | 0.85 | locked |
| 5 | — | Serghei Spivac | — | 0.65 | 1 | 0.65 | locked |
| 6 | — | Andrei Arlovski | — | 0.45 | 1 | 0.45 | locked |
| 7 | — | Jake Collier | — | 0.25 | 0.75 | 0.19 | locked |
| 8 | — | Alan Baudot | — | 0.1 | 0.75 | 0.07 | locked |

#### Prime Dominance receipts

Prime window: **Alexander Volkov → Current heavyweight championship form**. Prime record: **4-0, 1 NC**. Effective samples: **4**. Sample multiplier: **85.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 9 | 4-0; 100.0% |
| Round control | 9 | 100.0%; rounds 4-0 |
| Finish pressure | 5 | 4 finishes; 100.0% |
| Elite-level validation | 4.75 | 2 elite-stage fights; 4.75 points |
| Raw prime score | 27.75 | Before sample multiplier |
| Final Prime Dominance | 23.59 | 27.75 × 0.85 |

#### Longevity receipts

Active elite years: **4.32**. Raw calendar months: **51.8**. Gap-adjusted months: **51.8**. Status multiplier: **1.08**. Division multiplier: **0.96**. Counted elite months: **53.71**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 2022-03-19 | 2022-07-23 | 4.14 | 4.14 | No |
| 2022-07-23 | 2023-07-22 | 11.96 | 11.96 | No |
| 2023-07-22 | 2023-11-11 | 3.68 | 3.68 | No |
| 2023-11-11 | 2024-07-27 | 8.51 | 8.51 | No |
| 2024-07-27 | 2025-10-25 | 14.95 | 14.95 | No |
| 2025-10-25 | 2026-07-13 | 8.57 | 8.57 | No |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **9** fights. Severity: **0**. Frequency: **0**. Prime-volume floor: **0**. Pre-division magnitude: **0**. Division discount: **0.0%**. Final penalty: **0**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Base | Finish extra | Raw event | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2022-07-23 | Curtis Blaydes | prime | top-five | home | No | No | 0 | 0 | 0 | freak-injury-technical-result |

#### Division-strength context

Default division key: **modern-heavyweight-0.96**. Era-ledger division multiplier: **0.96**. Division-era modifier: **-0.25**.

Modern heavyweight has elite top-end danger but less full-roster depth than the strongest lightweight and welterweight eras.

#### Key judgment calls

- **Prime start:** Alexander Volkov begins the connected elite heavyweight window.
- **Curtis Blaydes I:** the 15-second knee injury remains an official loss but is treated as a freak technical result with no normal loss penalty.
- **Interim title wins:** Pavlovich and the Blaydes rematch receive partial interim-title credit under the shared Championship rules.
- **Ciryl Gane no contest:** excluded from scoring and title-win credit; Aspinall retained the undisputed title.
- **Heavyweight depth:** receives a modest era-depth discount because the top end is dangerous but the full division is thinner than elite lightweight and welterweight eras.

#### Why ranked here

Aspinall earns his place through perfect UFC finishing efficiency, elite first-round wins over Sergei Pavlovich and Curtis Blaydes, an Alexander Volkov submission, and two interim-title victories. The shared model also recognizes that his only official UFC loss was a 15-second knee injury rather than a normal competitive defeat.

#### Why not ranked higher?

He does not rank higher because the championship volume and active elite window are still short. He has two UFC title-fight wins, no completed undisputed title defense, and fewer top-five wins than Stipe Miocic, Francis Ngannou, and the deepest heavyweight resumes.

#### Compare-mode guidance

- **Best counterargument:** The strongest counterargument is ceiling: his speed, skill, and finishing rate may make him the better fighter than several heavyweights ranked above him.
- **Why this résumé can still win:** He wins comparisons against thinner contender cases through perfect finishing efficiency, title-level proof, and the absence of a real competitive prime loss.

#### Final takeaway

Aspinall is already a serious UFC heavyweight peak case: fast, technically complete, title-proven, and perfect as a finisher. He needs completed undisputed defenses and more elite wins to become a top-tier all-time heavyweight resume.

_Ledger verified through 2026-07-16. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

### 52. Dricus du Plessis — 88 OVR

The modern middleweight chaos champion: Whittaker, Adesanya, and Strickland wins, strong finishing threat, and only one elite decision loss in the UFC.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 44.32 | 9-1 | Middleweight | 3 | 2.85 | 5 | 4-1 | 52.4% | 2.11 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 5.88 | 35 | 6.86 |
| Opponent Quality | 14.92 | 25 | 12.43 |
| Prime Dominance | 19.14 | 30 | 19.14 |
| Longevity | 9.05 | 10 | 3.02 |

Base score: **41.45**. Modifiers: Apex **+4.55**, Loss Penalty **-1.95**, Division-Era Depth **+0.27**. Final raw score: **44.32**.

OVR conversion: 18.68–101.92 board anchors, normalized score **0.308025**, curved score **0.367534**, resulting in **88 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 5.88 | #34 | 2.85 adjusted credit / 14.54 benchmark |
| Opponent Quality | 14.92 | #47 | 7.01 diminished credit / 14.1 benchmark |
| Prime Dominance | 19.14 | #38 | 20.15 raw × 95.0% sample |
| Longevity | 9.05 | #54 | 43.44 counted elite months |
| Apex | +4.55 | Modifier | Whittaker and Adesanya provide elite two-night proof. Close Strickland fights, a short reign, chaotic separation, and the Khamzat ceiling cap the best-fighter claim and aura. |
| Loss Penalty | -1.95 | Modifier | 1 official/technical loss events reviewed |
| Division-Era Depth | +0.27 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **3**. Adjusted title wins: **2.85**. Derived undisputed-title win count: **3**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 2024-01-20 | Sean Strickland | normal | 1 | 0.95 | 0.95 | Close/current-table title win. |
| 2024-08-18 | Israel Adesanya | normal | 1 | 0.95 | 0.95 | locked |
| 2025-02-09 | Sean Strickland | normal | 1 | 0.95 | 0.95 | Current-table rematch defense. |

#### Opponent Quality receipts

Raw win credit: **7.35**. Diminishing-return credit before fighter adjustment: **7.01**. Fighter adjustment: **0**. Final diminished credit: **7.01**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2024-01-20 | Sean Strickland | champion-level | 1.25 | 1 | 1.25 | Beat the reigning UFC middleweight champion to win the title. |
| 2 | 2024-08-18 | Israel Adesanya | champion-level | 1.25 | 1 | 1.25 | Elite UFC middleweight champion-level opponent. |
| 3 | 2023-07-08 | Robert Whittaker | top-five | 1 | 1 | 1 | Elite former champion and prime contender; Cody-approved at true top-five credit rather than max champion-level credit. |
| 4 | 2025-02-09 | Sean Strickland | top-five | 1 | 1 | 1 | Clear title-defense rematch win over an elite former champion, with repeat-opponent context. |
| 5 | 2023-03-04 | Derek Brunson | top-ten | 0.85 | 1 | 0.85 | Strong ranked middleweight contender. |
| 6 | 2022-07-02 | Brad Tavares | ranked | 0.65 | 1 | 0.65 | Quality middleweight veteran. |
| 7 | 2022-12-10 | Darren Till | ranked | 0.65 | 0.75 | 0.49 | Ranked middleweight name with timing context. |
| 8 | 2021-07-10 | Trevin Giles | solid | 0.45 | 0.75 | 0.34 | Solid UFC middleweight win. |
| 9 | 2020-10-11 | Markus Perez | name-value | 0.25 | 0.75 | 0.19 | Low-end UFC quality value. |

#### Prime Dominance receipts

Prime window: **Derek Brunson → Current championship form**. Prime record: **4-1**. Effective samples: **6**. Sample multiplier: **95.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 7.5 | 5-1; 83.3% |
| Round control | 4.7 | 52.2%; rounds 12-11 |
| Finish pressure | 3 | 3 finishes; 50.0% |
| Elite-level validation | 4.95 | 6 elite-stage fights; 4.95 points |
| Raw prime score | 20.15 | Before sample multiplier |
| Final Prime Dominance | 19.14 | 20.15 × 0.95 |

#### Longevity receipts

Active elite years: **2.11**. Raw calendar months: **40.3**. Gap-adjusted months: **40.3**. Status multiplier: **1.1**. Division multiplier: **0.98**. Counted elite months: **43.44**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 2023-03-04 | 2023-07-08 | 4.14 | 4.14 | No |
| 2023-07-08 | 2024-01-20 | 6.44 | 6.44 | No |
| 2024-01-20 | 2024-08-18 | 6.93 | 6.93 | No |
| 2024-08-18 | 2025-02-09 | 5.75 | 5.75 | No |
| 2025-02-09 | 2025-08-16 | 6.18 | 6.18 | No |
| 2025-08-16 | 2026-07-13 | 10.87 | 10.87 | No |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **10** fights. Severity: **1.5**. Frequency: **0.45**. Prime-volume floor: **0.75**. Pre-division magnitude: **1.95**. Division discount: **0.0%**. Final penalty: **-1.95**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Base | Finish extra | Raw event | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2025-08-16 | Khamzat Chimaev | prime | champion-level | home | No | Yes | -1.5 | 0 | -1.5 | standard rule |

#### Division-strength context

Default division key: **modern-middleweight-1.00**. Era-ledger division multiplier: **0.98**. Division-era modifier: **+0.27**.

Brunson through current championship form.

#### Key judgment calls

- **Non-UFC titles:** KSW and EFC accomplishments are historical context only, not scored.
- **Whittaker win:** Starts the true elite window and anchors one of the two Apex performances.
- **Adesanya win:** Carries major champion-value credit and is the second locked Apex performance.
- **Strickland rivalry:** The two UFC title-fight wins strengthen the run but the close scorecards cap clean separation.
- **Khamzat loss:** Counts as a prime elite decision loss, with no finish add-on, and caps the Apex claim/aura.

#### Why ranked here

Du Plessis ranks here because his UFC middleweight run got loud fast: Whittaker, Strickland, Adesanya, and Strickland again is a serious modern title-level win stack. The record is clean, the finishing threat is real, and the only UFC loss came to an elite champion-level opponent by decision.

#### Why not ranked higher?

He does not rank higher yet because the elite window is still short. He has strong championship value, but not the long title-fight volume, clean round-control dominance, active elite years, clean apex aura, or multi-era proof of the all-time names above him.

#### Compare-mode guidance

- **Best counterargument:** Dricus keeps debates interesting because the high-end wins are stronger than his total UFC time would suggest.
- **Why this résumé can still win:** Dricus wins comparisons when modern title wins and high-end middleweight names matter more than long-term volume.

#### Final takeaway

Du Plessis is already a real UFC-only middleweight legacy case: not long enough or clean enough for the inner GOAT circle, but strong enough to sit with the modern champion tier because the high-end wins are loud.

_Ledger verified through 2026-07-13. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

### 53. Dominick Cruz — 88 OVR

The movement genius case: brilliant bantamweight skill, a legendary comeback, and a UFC-only resume capped by injuries and long gaps.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 42.34 | 7-3 | Bantamweight | 4 | 3.7 | 5 | 5-2 | 67.9% | 5.51 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 7.63 | 35 | 8.9 |
| Opponent Quality | 13.7 | 25 | 11.42 |
| Prime Dominance | 18.19 | 30 | 18.19 |
| Longevity | 14.05 | 10 | 4.68 |

Base score: **43.19**. Modifiers: Apex **+4.25**, Loss Penalty **-3.49**, Division-Era Depth **-1.61**. Final raw score: **42.34**.

OVR conversion: 18.68–101.92 board anchors, normalized score **0.284238**, curved score **0.343266**, resulting in **88 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 7.63 | #23 | 3.7 adjusted credit / 14.54 benchmark |
| Opponent Quality | 13.7 | #54 | 6.44 diminished credit / 14.1 benchmark |
| Prime Dominance | 18.19 | #47 | 18.19 raw × 100.0% sample |
| Longevity | 14.05 | #31 | 67.42 counted elite months |
| Apex | +4.25 | Modifier | UFC-only comeback/technical-control apex. |
| Loss Penalty | -3.49 | Modifier | 3 official/technical loss events reviewed |
| Division-Era Depth | -1.61 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **4**. Adjusted title wins: **3.7**. Derived undisputed-title win count: **4**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 2011-07-02 | Urijah Faber | normal | 1 | 0.95 | 0.95 | locked |
| 2011-10-01 | Demetrious Johnson | normal | 1 | 0.9 | 0.9 | locked |
| 2016-01-17 | T.J. Dillashaw | normal | 1 | 0.95 | 0.95 | locked |
| 2016-06-04 | Urijah Faber | normal | 1 | 0.9 | 0.9 | locked |

#### Opponent Quality receipts

Raw win credit: **6.6**. Diminishing-return credit before fighter adjustment: **6.44**. Fighter adjustment: **0**. Final diminished credit: **6.44**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2016-01-17 | T.J. Dillashaw | champion-level | 1.25 | 1 | 1.25 | Beat the reigning UFC bantamweight champion after a long injury layoff. |
| 2 | 2011-07-02 | Urijah Faber | top-five | 1 | 1 | 1 | Elite UFC bantamweight title challenger in Cruz’s first UFC championship fight. |
| 3 | 2011-10-01 | Demetrious Johnson | top-five | 1 | 1 | 1 | Elite UFC bantamweight title challenger; later flyweight greatness is context, not back-credit. |
| 4 | 2014-09-27 | Takeya Mizugaki | top-five | 1 | 1 | 1 | Top-five bantamweight contender stopped immediately in Cruz’s return. |
| 5 | 2016-06-04 | Urijah Faber | top-ten | 0.85 | 1 | 0.85 | Veteran elite challenger, discounted for age and repeat context. |
| 6 | 2021-12-11 | Pedro Munhoz | top-ten | 0.85 | 1 | 0.85 | Ranked bantamweight contender win late in Cruz’s UFC career. |
| 7 | 2021-03-06 | Casey Kenney | ranked | 0.65 | 0.75 | 0.49 | Ranked-quality bantamweight comeback win. |

#### Prime Dominance receipts

Prime window: **Urijah Faber II → Henry Cejudo**. Prime record: **5-2**. Effective samples: **7**. Sample multiplier: **100.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 6.43 | 5-2; 71.4% |
| Round control | 6.11 | 67.9%; rounds 19-9 |
| Finish pressure | 0.5 | 1 finishes; 14.3% |
| Elite-level validation | 5.15 | 7 elite-stage fights; 5.15 points |
| Raw prime score | 18.19 | Before sample multiplier |
| Final Prime Dominance | 18.19 | 18.19 × 1 |

#### Longevity receipts

Active elite years: **5.51**. Raw calendar months: **106.3**. Gap-adjusted months: **66.1**. Status multiplier: **1.02**. Division multiplier: **1**. Counted elite months: **67.42**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 2011-07-02 | 2011-10-01 | 2.99 | 2.99 | No |
| 2011-10-01 | 2014-09-27 | 35.88 | 18 | Yes |
| 2014-09-27 | 2016-01-17 | 15.67 | 15.67 | No |
| 2016-01-17 | 2016-06-04 | 4.57 | 4.57 | No |
| 2016-06-04 | 2016-12-30 | 6.87 | 6.87 | No |
| 2016-12-30 | 2020-05-09 | 40.28 | 18 | Yes |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **7** fights. Severity: **1.88**. Frequency: **1.61**. Prime-volume floor: **1.75**. Pre-division magnitude: **3.49**. Division discount: **0.0%**. Final penalty: **-3.49**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Base | Finish extra | Raw event | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2016-12-30 | Cody Garbrandt | prime | champion-level | home | No | Yes | -1.5 | 0 | -1.5 | standard rule |
| 2020-05-09 | Henry Cejudo | prime | champion-level | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2022-08-13 | Marlon Vera | post-prime | top-five | home | Yes | Yes | 0 | 0 | 0 | standard rule |

#### Division-strength context

Default division key: **modern-bantamweight-1.00**. Era-ledger division multiplier: **1**. Division-era modifier: **-1.61**.

Urijah Faber II through Henry Cejudo. Both injury gaps use the universal 18-month cap; no special 24-month injury allowance.

#### Key judgment calls

- **WEC reign:** historical context only, not main scoring credit.
- **Dillashaw comeback:** a huge UFC legacy win and the center of his title case.
- **Injury gaps:** cap active elite years even though the calendar span is long.
- **Late losses:** create drag but do not erase the prime skill case.
- **Skill vs resume:** his tactical genius grades higher than the raw UFC-only resume volume.

#### Why ranked here

Cruz ranks here because his best UFC work is brilliant. The Demetrious Johnson win, the Dillashaw comeback, and his unique championship style give him a real all-time bantamweight case inside the UFC scoring boundary.

#### Why not ranked higher?

He does not rank higher because this is UFC-only and active elite years matter more than calendar legacy. The WEC reign is historical context only, and the injuries created too many gaps to score like a long uninterrupted UFC reign.

#### Compare-mode guidance

- **Best counterargument:** Cruz’s argument is uniqueness and comeback value. Few fighters ever returned from that much time away and beat a champion like Dillashaw.
- **Why this résumé can still win:** Cruz wins when the debate values tactical brilliance, comeback legacy, and peak skill over raw fight volume.

#### Final takeaway

Cruz is the injury-fragmented genius: one of the smartest and most unique champions ever, but UFC-only scoring keeps the total resume below the deeper title-volume cases.

_Ledger verified through 2026-07-13. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

### 54. Royce Gracie — 88 OVR

The foundational tournament legend: an 11-0-1 opening run, complete finishing dominance, and the résumé that made Brazilian jiu-jitsu impossible to ignore.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 42.17 | 11-1-1 | Openweight / Welterweight | 0 | 2.35 | 2 | 11-0-1 | 95.8% | 1.4 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 4.85 | 35 | 5.66 |
| Opponent Quality | 9.55 | 25 | 7.96 |
| Prime Dominance | 25.12 | 30 | 25.12 |
| Longevity | 3.4 | 10 | 1.13 |

Base score: **39.87**. Modifiers: Apex **+5.3**, Loss Penalty **0**, Division-Era Depth **-3**. Final raw score: **42.17**.

OVR conversion: 18.68–101.92 board anchors, normalized score **0.282196**, curved score **0.341168**, resulting in **88 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 4.85 | #42 | 2.35 adjusted credit / 14.54 benchmark |
| Opponent Quality | 9.55 | #63 | 4.49 diminished credit / 14.1 benchmark |
| Prime Dominance | 25.12 | #7 | 27.91 raw × 90.0% sample |
| Longevity | 3.4 | #65 | 16.33 counted elite months |
| Apex | +5.3 | Modifier | The two real wins support a maximum Best-Fighter Claim and maximum Aura without using an aggregate tournament result. |
| Loss Penalty | 0 | Modifier | 1 official/technical loss events reviewed |
| Division-Era Depth | -3 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **0**. Adjusted title wins: **2.35**. Derived undisputed-title win count: **0**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1993-11-12 | Art Jimmerson | tournament | 0.85 | 0 | 0 | Tournament bout is canonical context but not a tournament-clinching Championship accomplishment; recovered credit is zero. |
| 1993-11-12 | Ken Shamrock | tournament | 0.85 | 0 | 0 | Tournament bout is canonical context but not a tournament-clinching Championship accomplishment; recovered credit is zero. |
| 1993-11-12 | Gerard Gordeau | tournament | 0.85 | 1 | 0.85 | Approved aggregate Championship score recovered from the live control; exact historical per-fight split was not stored. |
| 1994-03-11 | Minoki Ichihara | tournament | 0.85 | 0 | 0 | Tournament bout is canonical context but not a tournament-clinching Championship accomplishment; recovered credit is zero. |
| 1994-03-11 | Jason DeLucia | tournament | 0.85 | 0 | 0 | Tournament bout is canonical context but not a tournament-clinching Championship accomplishment; recovered credit is zero. |
| 1994-03-11 | Remco Pardoel | tournament | 0.85 | 0 | 0 | Tournament bout is canonical context but not a tournament-clinching Championship accomplishment; recovered credit is zero. |
| 1994-03-11 | Patrick Smith | tournament | 0.85 | 0.94 | 0.8 | Approved aggregate Championship score recovered from the live control; exact historical per-fight split was not stored. |
| 1994-09-09 | Kimo Leopoldo | tournament | 0.85 | 0 | 0 | Tournament bout is canonical context but not a tournament-clinching Championship accomplishment; recovered credit is zero. |
| 1994-12-16 | Ron van Clief | tournament | 0.85 | 0 | 0 | Tournament bout is canonical context but not a tournament-clinching Championship accomplishment; recovered credit is zero. |
| 1994-12-16 | Keith Hackney | tournament | 0.85 | 0 | 0 | Tournament bout is canonical context but not a tournament-clinching Championship accomplishment; recovered credit is zero. |
| 1994-12-16 | Dan Severn | tournament | 0.85 | 0.82 | 0.7 | Approved aggregate Championship score recovered from the live control; exact historical per-fight split was not stored. |

#### Opponent Quality receipts

Raw win credit: **4.65**. Diminishing-return credit before fighter adjustment: **4.49**. Fighter adjustment: **0**. Final diminished credit: **4.49**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 1993-11-12 | Ken Shamrock | top-five | 1 | 1 | 1 | Elite UFC 1 tournament opponent, but not yet an established UFC champion; no later-career back-credit. |
| 2 | 1994-12-16 | Dan Severn | top-five | 1 | 1 | 1 | Elite UFC 4 tournament finalist with real championship-level danger, held below champion-level because the UFC hierarchy was not yet established. |
| 3 | 1993-11-12 | Gerard Gordeau | ranked | 0.65 | 1 | 0.65 | Credible UFC 1 finalist and combat-sport veteran, but not a modern Top-10-equivalent win. |
| 4 | 1994-03-11 | Jason DeLucia | solid | 0.45 | 1 | 0.45 | Experienced early tournament opponent with useful but non-ranked UFC value. |
| 5 | 1994-03-11 | Patrick Smith | solid | 0.45 | 1 | 0.45 | UFC 2 finalist and dangerous specialist, but limited established UFC quality at the time. |
| 6 | 1994-03-11 | Remco Pardoel | solid | 0.45 | 1 | 0.45 | Legitimate tournament semifinalist with useful early-UFC value, not ranked-equivalent depth. |
| 7 | 1994-09-09 | Kimo Leopoldo | name-value | 0.25 | 0.75 | 0.19 | Dangerous and physically imposing, but essentially unproven in UFC terms entering the fight. |
| 8 | 1993-11-12 | Art Jimmerson | minimal | 0.1 | 0.75 | 0.07 | UFC debutant with essentially no established mixed-rules opponent-quality proof. |
| 9 | 1994-03-11 | Minoki Ichihara | minimal | 0.1 | 0.75 | 0.07 | UFC debutant with minimal established UFC opponent-quality proof. |
| 10 | 1994-12-16 | Keith Hackney | minimal | 0.1 | 0.75 | 0.07 | Memorable early-UFC name, but one novelty-style UFC win did not establish meaningful opponent-quality proof. |
| 11 | 1994-12-16 | Ron van Clief | minimal | 0.1 | 0.75 | 0.07 | Historic martial-arts name, but age and lack of established UFC value sharply limit credit. |

#### Prime Dominance receipts

Prime window: **Art Jimmerson → Ken Shamrock**. Prime record: **11-0-1**. Effective samples: **5**. Sample multiplier: **90.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 8.63 | 11-0-1; 95.8% |
| Round control | 8.63 | 95.8%; rounds 11-0 |
| Finish pressure | 5 | 11 finishes; 91.7% |
| Elite-level validation | 5.65 | 7 elite-stage fights; 5.65 points |
| Raw prime score | 27.91 | Before sample multiplier |
| Final Prime Dominance | 25.12 | 27.91 × 0.9 |

#### Longevity receipts

Active elite years: **1.4**. Raw calendar months: **16.8**. Gap-adjusted months: **16.8**. Status multiplier: **1.08**. Division multiplier: **0.9**. Counted elite months: **16.33**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 1993-11-12 | 1993-11-12 | 0 | 0 | No |
| 1993-11-12 | 1993-11-12 | 0 | 0 | No |
| 1993-11-12 | 1994-03-11 | 3.91 | 3.91 | No |
| 1994-03-11 | 1994-03-11 | 0 | 0 | No |
| 1994-03-11 | 1994-03-11 | 0 | 0 | No |
| 1994-03-11 | 1994-03-11 | 0 | 0 | No |
| 1994-03-11 | 1994-09-09 | 5.98 | 5.98 | No |
| 1994-09-09 | 1994-12-16 | 3.22 | 3.22 | No |
| 1994-12-16 | 1994-12-16 | 0 | 0 | No |
| 1994-12-16 | 1994-12-16 | 0 | 0 | No |
| 1994-12-16 | 1995-04-07 | 3.68 | 3.68 | No |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **12** fights. Severity: **0**. Frequency: **0**. Prime-volume floor: **0**. Pre-division magnitude: **0**. Division discount: **0.0%**. Final penalty: **0**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Base | Finish extra | Raw event | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2006-05-27 | Matt Hughes | post-prime | champion-level | home | Yes | Yes | 0 | 0 | 0 | standard rule |

#### Division-strength context

Default division key: **early-openweight-0.80**. Era-ledger division multiplier: **0.9**. Division-era modifier: **-3**.

Jimmerson through Shamrock II.

#### Key judgment calls

- **Prime window:** Art Jimmerson → Ken Shamrock.
- **Coverage:** Complete UFC-only ledger through 2006-05-27. Tournament wins count as UFC wins but not official title-fight wins; Pride and other non-UFC fights excluded.
- **Prime endpoint:** The Shamrock draw closes Royce’s original UFC tournament-era dominance window.

#### Why ranked here

Gracie ranks here because his early UFC run was historically dominant inside the format that existed. He won three tournaments, opened 11-0-1, finished every UFC victory, and defeated the two strongest established opponents on the ledger in Ken Shamrock and Dan Severn.

#### Why not ranked higher?

He does not rank higher because early tournaments were not the same as a modern UFC title reign, the opponent pool was undeveloped, only two victories receive Top-5-level credit, and his counted elite window lasted roughly 1.4 years. The model respects the dominance without pretending the competitive depth matched later divisions.

#### Final takeaway

Gracie ranks here because his early UFC run was historically dominant inside the format that existed. He won three tournaments, opened 11-0-1, finished every UFC victory, and defeated the two strongest established opponents on the ledger in Ken Shamrock and Dan Severn.

_Ledger verified through 2026-07-13. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

### 55. Khamzat Chimaev — 88 OVR

A short but explosive UFC-only case: DDP title value, Whittaker/Burns elite proof, scary dominance, and one Strickland title-loss cap.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 40.84 | 9-1 | Middleweight / Welterweight | 1 | 0.95 | 4 | 5-1 | 72.2% | 4.08 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 1.96 | 35 | 2.29 |
| Opponent Quality | 13.86 | 25 | 11.55 |
| Prime Dominance | 19.61 | 30 | 19.61 |
| Longevity | 11.08 | 10 | 3.69 |

Base score: **37.14**. Modifiers: Apex **+5.17**, Loss Penalty **-1.89**, Division-Era Depth **+0.42**. Final raw score: **40.84**.

OVR conversion: 18.68–101.92 board anchors, normalized score **0.266218**, curved score **0.324677**, resulting in **88 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 1.96 | #57 | 0.95 adjusted credit / 14.54 benchmark |
| Opponent Quality | 13.86 | #52 | 6.51 diminished credit / 14.1 benchmark |
| Prime Dominance | 19.61 | #34 | 20.64 raw × 95.0% sample |
| Longevity | 11.08 | #46 | 53.16 counted elite months |
| Apex | +5.17 | Modifier | First-round destruction of Whittaker followed by a dominant title win; the later Strickland loss prevents maximum Claim or Aura. |
| Loss Penalty | -1.89 | Modifier | 1 official/technical loss events reviewed |
| Division-Era Depth | +0.42 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **1**. Adjusted title wins: **0.95**. Derived undisputed-title win count: **1**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 2025-08-16 | Dricus du Plessis | normal | 1 | 0.95 | 0.95 | Current-table title win; subjective/current-era context. |

#### Opponent Quality receipts

Raw win credit: **6.75**. Diminishing-return credit before fighter adjustment: **6.51**. Fighter adjustment: **0**. Final diminished credit: **6.51**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2024-10-26 | Robert Whittaker | champion-level | 1.25 | 1 | 1.25 | Elite champion-level middleweight contender. |
| 2 | 2025-08-16 | Dricus du Plessis | champion-level | 1.25 | 1 | 1.25 | Elite UFC middleweight champion-level opponent in app timeline. |
| 3 | 2022-04-09 | Gilbert Burns | top-five | 1 | 1 | 1 | Elite welterweight contender. |
| 4 | 2023-10-21 | Kamaru Usman | top-five | 1 | 1 | 1 | All-time welterweight great moving up on short notice. |
| 5 | 2021-10-30 | Li Jingliang | ranked | 0.65 | 1 | 0.65 | Ranked welterweight veteran. |
| 6 | 2022-09-10 | Kevin Holland | ranked | 0.65 | 1 | 0.65 | Quality welterweight/middleweight name, short-notice context. |
| 7 | 2020-09-19 | Gerald Meerschaert | solid | 0.45 | 0.75 | 0.34 | Solid UFC middleweight win. |
| 8 | 2020-07-15 | John Phillips | name-value | 0.25 | 0.75 | 0.19 | Low-end UFC quality value. |
| 9 | 2020-07-25 | Rhys McKee | name-value | 0.25 | 0.75 | 0.19 | Low-end UFC quality value. |

#### Prime Dominance receipts

Prime window: **Gilbert Burns → Current elite form**. Prime record: **5-1**. Effective samples: **6**. Sample multiplier: **95.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 7.5 | 5-1; 83.3% |
| Round control | 6.5 | 72.2%; rounds 13-5 |
| Finish pressure | 2 | 2 finishes; 33.3% |
| Elite-level validation | 4.64 | 5 elite-stage fights; 4.64 points |
| Raw prime score | 20.64 | Before sample multiplier |
| Final Prime Dominance | 19.61 | 20.64 × 0.95 |

#### Longevity receipts

Active elite years: **4.08**. Raw calendar months: **51.1**. Gap-adjusted months: **51.1**. Status multiplier: **1.02**. Division multiplier: **1.02**. Counted elite months: **53.16**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 2022-04-09 | 2022-09-10 | 5.06 | 5.06 | No |
| 2022-09-10 | 2023-10-21 | 13.34 | 13.34 | No |
| 2023-10-21 | 2024-10-26 | 12.19 | 12.19 | No |
| 2024-10-26 | 2025-08-16 | 9.66 | 9.66 | No |
| 2025-08-16 | 2026-05-09 | 8.74 | 8.74 | No |
| 2026-05-09 | 2026-07-13 | 2.14 | 2.14 | No |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **10** fights. Severity: **1.5**. Frequency: **0.45**. Prime-volume floor: **0.75**. Pre-division magnitude: **1.95**. Division discount: **3.0%**. Final penalty: **-1.89**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Base | Finish extra | Raw event | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2026-05-09 | Sean Strickland | prime | champion-level | home | No | Yes | -1.5 | 0 | -1.5 | standard rule |

#### Division-strength context

Default division key: **modern-middleweight-1.00**. Era-ledger division multiplier: **1.02**. Division-era modifier: **+0.42**.

Burns through current elite form.

#### Key judgment calls

- **DDP title win:** Championship value is real, but adjusted title wins stay at 1.00 because it is one title win.
- **Whittaker and Burns:** Both are elite/top-5 wins, but they do not go above 1.00 in Quality Wins.
- **Usman win:** Strong name and skill proof, discounted for short-notice/up-weight/timing context.
- **Strickland loss:** Clean loss-context profile because it is a decision title loss, not a finish.

#### Why ranked here

Chimaev ranks here because the peak is loud: a current-table UFC title win, elite wins over Whittaker and Burns, a strong Usman result, and one of the most dominant grappling profiles in this tier.

#### Why not ranked higher?

He does not rank higher because the UFC-only resume is still short: one title-fight win, no defenses, a short elite clock, and the Strickland title loss breaks the clean undefeated-aura version of the case.

#### Compare-mode guidance

- **Best counterargument:** The counterargument is short resume: not enough title fights, not enough elite years, and not enough volume yet.
- **Why this résumé can still win:** Chimaev wins comparisons when dominance and best-version danger matter more than long resume volume.

#### Final takeaway

Chimaev is a peak-and-dominance case more than a deep-resume case. He belongs above most short-window contenders, but below fighters with more title-fight volume and longer elite UFC resumes.

_Ledger verified through 2026-07-13. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

### 56. Michael Bisping — 87 OVR

A grit-and-volume UFC legend whose Rockhold upset and long middleweight résumé make him a real champion case, even without a dominant reign.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 37.9 | 20-9 | Middleweight / Light Heavyweight | 2 | 1.75 | 2 | 8-4 | 53.7% | 5.12 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 3.61 | 35 | 4.21 |
| Opponent Quality | 19.36 | 25 | 16.13 |
| Prime Dominance | 15.19 | 30 | 15.19 |
| Longevity | 4.24 | 10 | 1.41 |

Base score: **36.94**. Modifiers: Apex **+3.77**, Loss Penalty **-2.92**, Division-Era Depth **+0.11**. Final raw score: **37.9**.

OVR conversion: 18.68–101.92 board anchors, normalized score **0.230899**, curved score **0.287679**, resulting in **87 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 3.61 | #51 | 1.75 adjusted credit / 14.54 benchmark |
| Opponent Quality | 19.36 | #32 | 9.1 diminished credit / 14.1 benchmark |
| Prime Dominance | 15.19 | #63 | 16.88 raw × 90.0% sample |
| Longevity | 4.24 | #64 | 20.36 counted elite months |
| Apex | +3.77 | Modifier | Late-career title apex with Anderson/Rockhold proof. |
| Loss Penalty | -2.92 | Modifier | 9 official/technical loss events reviewed |
| Division-Era Depth | +0.11 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **2**. Adjusted title wins: **1.75**. Derived undisputed-title win count: **2**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 2016-06-04 | Luke Rockhold | normal | 1 | 1 | 1 | locked |
| 2016-10-08 | Dan Henderson | normal | 1 | 0.75 | 0.75 | Aged/late-career opponent title defense. |

#### Opponent Quality receipts

Raw win credit: **12**. Diminishing-return credit before fighter adjustment: **9.1**. Fighter adjustment: **0**. Final diminished credit: **9.1**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2016-06-04 | Luke Rockhold | champion-level | 1.25 | 1 | 1.25 | UFC middleweight champion and elite title opponent. |
| 2 | 2007-09-08 | Matt Hamill | top-ten | 0.85 | 1 | 0.85 | Strong ranked light-heavyweight win. |
| 3 | 2016-02-27 | Anderson Silva | top-ten | 0.85 | 1 | 0.85 | All-time great name, late-career timing. |
| 4 | 2010-05-29 | Dan Miller | ranked | 0.65 | 1 | 0.65 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 5 | 2011-02-27 | Jorge Rivera | ranked | 0.65 | 1 | 0.65 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 6 | 2012-09-22 | Brian Stann | ranked | 0.65 | 1 | 0.65 | Quality middleweight win. |
| 7 | 2013-04-27 | Alan Belcher | ranked | 0.65 | 0.75 | 0.49 | Quality middleweight win. |
| 8 | 2015-04-25 | C.B. Dollaway | ranked | 0.65 | 0.75 | 0.49 | Ranked-quality middleweight win. |
| 9 | 2015-07-18 | Thales Leites | ranked | 0.65 | 0.75 | 0.49 | Ranked middleweight contender. |
| 10 | 2016-10-08 | Dan Henderson | ranked | 0.65 | 0.75 | 0.49 | Legend name, but aged timing. |
| 11 | 2006-06-24 | Josh Haynes | solid | 0.45 | 0.75 | 0.34 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 12 | 2006-12-30 | Eric Schafer | solid | 0.45 | 0.75 | 0.34 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 13 | 2007-04-21 | Elvis Sinosic | solid | 0.45 | 0.5 | 0.23 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 14 | 2008-04-19 | Charles McCarthy | solid | 0.45 | 0.5 | 0.23 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 15 | 2008-06-07 | Jason Day | solid | 0.45 | 0.5 | 0.23 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 16 | 2008-10-18 | Chris Leben | solid | 0.45 | 0.5 | 0.23 | Solid UFC middleweight win. |
| 17 | 2009-11-14 | Denis Kang | solid | 0.45 | 0.5 | 0.23 | Solid UFC win. |
| 18 | 2010-10-16 | Yoshihiro Akiyama | solid | 0.45 | 0.5 | 0.23 | Solid UFC middleweight win. |
| 19 | 2011-12-03 | Jason Miller | solid | 0.45 | 0.25 | 0.11 | Solid UFC win. |
| 20 | 2014-08-23 | Cung Le | solid | 0.45 | 0.25 | 0.11 | Name win with timing/context discount. |

#### Prime Dominance receipts

Prime window: **Anderson Silva → Georges St-Pierre**. Prime record: **8-4**. Effective samples: **4**. Sample multiplier: **90.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 6.75 | 3-1; 75.0% |
| Round control | 5.14 | 57.1%; rounds 8-6 |
| Finish pressure | 1 | 1 finishes; 25.0% |
| Elite-level validation | 3.99 | 4 elite-stage fights; 3.99 points |
| Raw prime score | 16.88 | Before sample multiplier |
| Final Prime Dominance | 15.19 | 16.88 × 0.9 |

#### Longevity receipts

Active elite years: **5.12**. Raw calendar months: **20.2**. Gap-adjusted months: **20.2**. Status multiplier: **1.05**. Division multiplier: **0.96**. Counted elite months: **20.36**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 2016-02-27 | 2016-06-04 | 3.22 | 3.22 | No |
| 2016-06-04 | 2016-10-08 | 4.14 | 4.14 | No |
| 2016-10-08 | 2017-11-04 | 12.88 | 12.88 | No |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **28** fights. Severity: **1.88**. Frequency: **1.04**. Prime-volume floor: **1**. Pre-division magnitude: **2.92**. Division discount: **0.0%**. Final penalty: **-2.92**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Base | Finish extra | Raw event | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2007-11-17 | Rashad Evans | pre-prime | top-five | home | No | Yes | -0.75 | 0 | -0.75 | standard rule |
| 2009-07-11 | Dan Henderson | pre-prime | champion-level | home | Yes | Yes | -0.75 | -0.75 | -1.5 | standard rule |
| 2010-02-21 | Wanderlei Silva | pre-prime | top-five | home | No | Yes | -0.75 | 0 | -0.75 | standard rule |
| 2012-01-28 | Chael Sonnen | pre-prime | top-five | home | No | Yes | -0.75 | 0 | -0.75 | standard rule |
| 2013-01-19 | Vitor Belfort | pre-prime | champion-level | home | Yes | Yes | -0.75 | -0.75 | -1.5 | standard rule |
| 2014-04-16 | Tim Kennedy | pre-prime | top-five | home | No | Yes | -0.75 | 0 | -0.75 | standard rule |
| 2014-11-08 | Luke Rockhold | pre-prime | champion-level | home | Yes | Yes | -0.75 | -0.75 | -1.5 | standard rule |
| 2017-11-04 | Georges St-Pierre | prime | champion-level | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2017-11-25 | Kelvin Gastelum | post-prime | top-five | home | Yes | Yes | 0 | 0 | 0 | standard rule |

#### Division-strength context

Default division key: **middleweight-0.95**. Era-ledger division multiplier: **0.96**. Division-era modifier: **+0.11**.

Anderson through GSP.

#### Key judgment calls

- **Rockhold upset:** Huge title win, but not enough to imply he was clearly best middleweight alive.
- **GSP treatment:** Because it was a literal title fight, it stays inside prime and gets counted.
- **Henderson defense:** Official defense, but discounted because of challenger context and fight difficulty.
- **Longevity:** His best category is UFC middleweight volume and relevance.

#### Why ranked here

Bisping scores as a real UFC champion case because he beat Rockhold for the belt, defended once, beat Anderson, and stacked one of the longest relevant middleweight runs in UFC history.

#### Why not ranked higher?

He does not rank higher because the reign was short, the Henderson defense is discounted, he did not clear the Yoel/Jacare/Whittaker contender line, and the GSP title loss counts as a prime finish loss.

#### Compare-mode guidance

- **Best counterargument:** The counter is that he was never a dominant champion and did not clear the strongest post-title contender line.
- **Why this résumé can still win:** Bisping wins comparisons when UFC volume, title-upset value, and historical middleweight relevance matter more than clean dominance.

#### Final takeaway

Bisping is a necessary UFC-only add: huge volume, one legendary title moment, and real champion status, but not a dominant-reign GOAT case.

_Ledger verified through 2026-07-13. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

### 57. Anthony Pettis — 87 OVR

The Showtime champion case: two UFC title-fight wins, three top-five victories, and signature finishes across three divisions.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 37.5 | 11-9 | Lightweight / Featherweight / Welterweight | 2 | 2 | 3 | 7-6 | 34.4% | 6.61 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 4.13 | 35 | 4.82 |
| Opponent Quality | 15.76 | 25 | 13.13 |
| Prime Dominance | 14.31 | 30 | 14.31 |
| Longevity | 16.52 | 10 | 5.51 |

Base score: **37.77**. Modifiers: Apex **+5.28**, Loss Penalty **-6**, Division-Era Depth **+0.45**. Final raw score: **37.5**.

OVR conversion: 18.68–101.92 board anchors, normalized score **0.226093**, curved score **0.282582**, resulting in **87 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 4.13 | #43 | 2 adjusted credit / 14.54 benchmark |
| Opponent Quality | 15.76 | #45 | 7.64 diminished credit / 14.54 benchmark |
| Prime Dominance | 14.31 | #64 | 14.31 raw × 100.0% sample |
| Longevity | 16.52 | #21 | 79.3 counted elite months |
| Apex | +5.28 | Modifier | The UFC 164 title-winning armbar and UFC 181 guillotine defense are championship-proven Showtime performances with elite opponent strength and major historical identity. |
| Loss Penalty | -6 | Modifier | 9 official/technical loss events reviewed |
| Division-Era Depth | +0.45 | Modifier | Apply a positive era-depth adjustment for a prime centered in the lightweight murderers’ row, with a brief strong featherweight segment. |

#### Championship receipts

UFC title-fight wins: **2**. Adjusted title wins: **2**. Derived undisputed-title win count: **2**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| — | Benson Henderson | — | — | — | 1 | locked |
| — | Gilbert Melendez | — | — | — | 1 | locked |

#### Opponent Quality receipts

Raw win credit: **8.25**. Diminishing-return credit before fighter adjustment: **7.64**. Fighter adjustment: **0**. Final diminished credit: **7.64**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | — | Benson Henderson | — | 1.25 | 1 | 1.25 | Submitted the reigning lightweight champion for the undisputed title. |
| 2 | — | Gilbert Melendez | — | 1 | 1 | 1 | Elite title challenger and first career finish loss. |
| 3 | — | Stephen Thompson | — | 1 | 1 | 1 | Top-five welterweight knocked out in an upward-division fight. |
| 4 | — | Charles Oliveira | — | 0.85 | 1 | 0.85 | Ranked featherweight submission; later greatness is context, not retroactive maximum credit. |
| 5 | — | Donald Cerrone | — | 0.85 | 1 | 0.85 | High-value top-ten lightweight finished in the first round. |
| 6 | — | Michael Chiesa | — | 0.85 | 1 | 0.85 | Ranked lightweight submission win. |
| 7 | — | Jim Miller | — | 0.65 | 0.75 | 0.49 | Ranked veteran win during the late prime. |
| 8 | — | Joe Lauzon | — | 0.65 | 0.75 | 0.49 | Ranked lightweight head-kick knockout. |
| 9 | — | Alex Morono | — | 0.45 | 0.75 | 0.34 | Solid welterweight win without elite ranking value. |
| 10 | — | Jeremy Stephens | — | 0.45 | 0.75 | 0.34 | Solid UFC win before the elite run. |
| 11 | — | Donald Cerrone | — | 0.25 | 0.75 | 0.19 | Famous rematch win heavily discounted for late-career decline. |

#### Prime Dominance receipts

Prime window: **Joe Lauzon → Tony Ferguson**. Prime record: **7-6**. Effective samples: **13**. Sample multiplier: **100.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 4.85 | 7-6; 53.9% |
| Round control | 3.09 | 34.4%; rounds 11-21 |
| Finish pressure | 3 | 6 finishes; 46.1% |
| Elite-level validation | 3.37 | 6 elite-stage fights; 3.37 points |
| Raw prime score | 14.31 | Before sample multiplier |
| Final Prime Dominance | 14.31 | 14.31 × 1 |

#### Longevity receipts

Active elite years: **6.61**. Raw calendar months: **79.3**. Gap-adjusted months: **79.3**. Status multiplier: **1**. Division multiplier: **1**. Counted elite months: **79.3**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 2012-02-25 | 2013-01-26 | 11.04 | 11.04 | No |
| 2013-01-26 | 2013-08-31 | 7.13 | 7.13 | No |
| 2013-08-31 | 2014-12-06 | 15.18 | 15.18 | No |
| 2014-12-06 | 2015-03-14 | 3.22 | 3.22 | No |
| 2015-03-14 | 2016-01-17 | 10.15 | 10.15 | No |
| 2016-01-17 | 2016-04-23 | 3.19 | 3.19 | No |
| 2016-04-23 | 2016-08-27 | 4.14 | 4.14 | No |
| 2016-08-27 | 2016-12-10 | 3.45 | 3.45 | No |
| 2016-12-10 | 2017-07-08 | 6.9 | 6.9 | No |
| 2017-07-08 | 2017-11-11 | 4.14 | 4.14 | No |
| 2017-11-11 | 2018-07-07 | 7.82 | 7.82 | No |
| 2018-07-07 | 2018-10-06 | 2.99 | 2.99 | No |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **15** fights. Severity: **3.5**. Frequency: **2.5**. Prime-volume floor: **5.25**. Pre-division magnitude: **6**. Division discount: **0.0%**. Final penalty: **-6**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Base | Finish extra | Raw event | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2011-06-04 | Clay Guida | pre-prime | top-ten | home | No | Yes | -1.25 | 0 | -1.25 | standard rule |
| 2015-03-14 | Rafael dos Anjos | prime | champion-level | home | No | Yes | -1.5 | 0 | -1.5 | standard rule |
| 2016-01-17 | Eddie Alvarez | prime | top-five | home | No | Yes | -1.5 | 0 | -1.5 | standard rule |
| 2016-04-23 | Edson Barboza | prime | top-ten | home | No | Yes | -4 | 0 | -4 | standard rule |
| 2016-12-10 | Max Holloway | prime | top-five | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2017-11-11 | Dustin Poirier | prime | top-ten | home | Yes | Yes | -4 | -0.75 | -4.75 | standard rule |
| 2018-10-06 | Tony Ferguson | prime | top-five | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2019-08-17 | Nate Diaz | post-prime | top-ten | upward | No | Yes | 0 | 0 | 0 | standard rule |
| 2020-01-18 | Carlos Diego Ferreira | post-prime | top-ten | home | Yes | Yes | 0 | 0 | 0 | standard rule |

#### Division-strength context

Default division key: **lightweight-murderers-row-1.10**. Era-ledger division multiplier: **1**. Division-era modifier: **+0.45**.

Pettis’s prime is centered in the deep lightweight murderers’ row, with a brief elite featherweight segment.

#### Key judgment calls

- **Nickname:** The app-facing profile name is Anthony “Showtime” Pettis.
- **UFC-only scope:** The WEC title, Showtime Kick, PFL run, and all non-UFC fights are context only.
- **Prime start:** The Joe Lauzon head-kick knockout begins the connected ranked and title-level run.
- **Prime end:** Tony Ferguson closes the connected prime after Pettis’s final Chiesa rebound; the later Thompson knockout is an isolated post-prime elite win.
- **Max Holloway:** The loss counts as a prime elite finish, but Pettis receives no title participation credit because he missed weight and was ineligible for the interim belt.
- **Stephen Thompson:** The post-prime upward-division knockout still receives full Opponent Quality win credit.
- **Division depth:** The lightweight murderers’ row earns a separate positive era-depth adjustment without double-counting the same strength in longevity.
- **Signature fight:** Benson Henderson II at UFC 164.
- **Alternate fight:** Gilbert Melendez at UFC 181.

#### Why ranked here

Pettis earns his place through an undisputed lightweight title win, a successful defense, three top-five victories, and one of the most memorable two-fight championship peaks of his era. The Henderson armbar and Melendez guillotine give the UFC-only resume real title proof beyond the highlight reel.

#### Why not ranked higher?

He does not rank higher because the title reign ended after one defense, the reviewed prime finished 7-6, and six counted prime losses—including three finishes—drag down the consistency and round-control case. The WEC title and Showtime Kick are excluded from the score.

#### Compare-mode guidance

- **Best counterargument:** The best counterargument against Pettis is consistency: the title reign produced only one defense, the prime finished 7-6, and losses to dos Anjos, Alvarez, Barboza, Holloway, Poirier, and Ferguson prevent a cleaner all-time case.
- **Why this résumé can still win:** Pettis wins appropriate comparisons through championship proof, an elite two-performance apex, finishing versatility, and meaningful wins at lightweight, featherweight, and welterweight. His peak can beat deeper but title-less resumes.

#### Final takeaway

Pettis is a real UFC champion case with a spectacular peak, not merely a highlight-reel celebrity. Two title-fight wins and elite finishes secure his ranking; the 7-6 prime and loss-heavy post-title stretch keep Showtime below the deeper long-reign champions.

_Ledger verified through 2026-07-17. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

### 58. Sean O'Malley — 87 OVR

A precision-striking bantamweight champion with a huge Aljo title KO, a Vera title defense, and a résumé capped hard by Merab.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 36.15 | 12-3, 1 NC | Bantamweight | 2 | 1.85 | 5 | 5-2 | 48.0% | 3.72 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 3.82 | 35 | 4.46 |
| Opponent Quality | 13.3 | 25 | 11.08 |
| Prime Dominance | 16.67 | 30 | 16.67 |
| Longevity | 9.78 | 10 | 3.26 |

Base score: **35.47**. Modifiers: Apex **+4.06**, Loss Penalty **-3.28**, Division-Era Depth **-0.1**. Final raw score: **36.15**.

OVR conversion: 18.68–101.92 board anchors, normalized score **0.209875**, curved score **0.265257**, resulting in **87 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 3.82 | #48 | 1.85 adjusted credit / 14.54 benchmark |
| Opponent Quality | 13.3 | #57 | 6.25 diminished credit / 14.1 benchmark |
| Prime Dominance | 16.67 | #56 | 16.67 raw × 100.0% sample |
| Longevity | 9.78 | #51 | 46.94 counted elite months |
| Apex | +4.06 | Modifier | Explosive bantamweight title apex. |
| Loss Penalty | -3.28 | Modifier | 3 official/technical loss events reviewed |
| Division-Era Depth | -0.1 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **2**. Adjusted title wins: **1.85**. Derived undisputed-title win count: **2**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 2023-08-19 | Aljamain Sterling | normal | 1 | 1 | 1 | locked |
| 2024-03-09 | Marlon Vera | normal | 1 | 0.85 | 0.85 | locked |

#### Opponent Quality receipts

Raw win credit: **6.55**. Diminishing-return credit before fighter adjustment: **6.25**. Fighter adjustment: **0**. Final diminished credit: **6.25**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2023-08-19 | Aljamain Sterling | champion-level | 1.25 | 1 | 1.25 | Knocked out the reigning UFC bantamweight champion to win the title. |
| 2 | 2022-10-22 | Petr Yan | champion-level | 1.15 | 1 | 1.15 | Elite former champion; Cody-approved above standard top-five credit despite close decision context. |
| 3 | 2024-03-09 | Marlon Vera | top-five | 1 | 1 | 1 | Dominant UFC title defense over a ranked rival. |
| 4 | 2026-01-24 | Song Yadong | top-ten | 0.85 | 1 | 0.85 | Strong ranked bantamweight rebound win, with close-decision context. |
| 5 | 2026-06-14 | Aiemann Zahabi | ranked | 0.65 | 1 | 0.65 | Ranked-quality rebound finish in the current app timeline. |
| 6 | 2021-12-11 | Raulian Paiva | solid | 0.45 | 1 | 0.45 | Solid UFC bantamweight win. |
| 7 | 2018-03-03 | Andre Soukhamthath | name-value | 0.25 | 0.75 | 0.19 | Low-end UFC quality value. |
| 8 | 2020-03-07 | Jose Alberto Quinonez | name-value | 0.25 | 0.75 | 0.19 | Supporting UFC bantamweight win. |
| 9 | 2020-06-06 | Eddie Wineland | name-value | 0.25 | 0.75 | 0.19 | Veteran name with a heavy timing discount. |
| 10 | 2021-03-27 | Thomas Almeida | name-value | 0.25 | 0.75 | 0.19 | Former prospect name with faded timing. |
| 11 | 2017-12-01 | Terrion Ware | minimal | 0.1 | 0.75 | 0.07 | UFC debut win with minimal opponent-quality value. |
| 12 | 2021-07-10 | Kris Moutinho | minimal | 0.1 | 0.75 | 0.07 | Minimal UFC quality value. |

#### Prime Dominance receipts

Prime window: **2022-10-22 → active**. Prime record: **5-2**. Effective samples: **7**. Sample multiplier: **100.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 6.43 | 5-2; 71.4% |
| Round control | 4.32 | 48.0%; rounds 12-13 |
| Finish pressure | 1 | 2 finishes; 28.6% |
| Elite-level validation | 4.92 | 7 elite-stage fights; 4.92 points |
| Raw prime score | 16.67 | Before sample multiplier |
| Final Prime Dominance | 16.67 | 16.67 × 1 |

#### Longevity receipts

Active elite years: **3.72**. Raw calendar months: **44.7**. Gap-adjusted months: **44.7**. Status multiplier: **1.05**. Division multiplier: **1**. Counted elite months: **46.94**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 2022-10-22 | 2023-08-19 | 9.89 | 9.89 | No |
| 2023-08-19 | 2024-03-09 | 6.67 | 6.67 | No |
| 2024-03-09 | 2024-09-14 | 6.21 | 6.21 | No |
| 2024-09-14 | 2025-06-07 | 8.74 | 8.74 | No |
| 2025-06-07 | 2026-01-24 | 7.59 | 7.59 | No |
| 2026-01-24 | 2026-06-14 | 4.63 | 4.63 | No |
| 2026-06-14 | 2026-07-13 | 0.95 | 0.95 | No |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **15** fights. Severity: **2.13**. Frequency: **1.15**. Prime-volume floor: **1.75**. Pre-division magnitude: **3.28**. Division discount: **0.0%**. Final penalty: **-3.28**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Base | Finish extra | Raw event | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2020-08-15 | Marlon Vera | pre-prime | top-ten | home | Yes | Yes | -1.25 | -0.75 | -2 | standard rule |
| 2024-09-14 | Merab Dvalishvili | prime | champion-level | home | No | Yes | -1.5 | 0 | -1.5 | standard rule |
| 2025-06-07 | Merab Dvalishvili | prime | champion-level | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |

#### Division-strength context

Default division key: **modern-bantamweight-1.00**. Era-ledger division multiplier: **—**. Division-era modifier: **-0.1**.

No additional division note.

#### Key judgment calls

- **Aljo title KO:** Receives a slight champion/title bump at 1.10 quality-win credit.
- **Vera 1 loss:** Counts, but with injury/TKO context rather than a clean skill-gap loss.
- **Modern bantamweight:** Gets solid division-strength respect, but not lightweight-level multiplier.
- **Apex window:** Aljamain Sterling 2023 through Marlon Vera 2 2024 is treated as his best short UFC window.

#### Why ranked here

O'Malley ranks here because the top of the UFC résumé is real: he knocked out Aljamain Sterling to win the bantamweight title, defended against Marlon Vera, beat Petr Yan in a close elite fight, and added Song/Zahabi current-table rebound value.

#### Why not ranked higher?

He does not rank higher yet because the reign was short, the elite-win list is not deep, and the two Merab losses sharply cap the title-prime and GOAT case.

#### Compare-mode guidance

- **Best counterargument:** O'Malley can win debates against longer but less explosive résumés because the Aljo KO and Vera defense are loud title moments.
- **Why this résumé can still win:** O'Malley wins comparisons when title-shot peak and high-end striking danger matter more than longevity.

#### Final takeaway

O'Malley is a real UFC-only champion case, not just a star case. But right now he belongs in the lower modern-champion tier, not near the long-reign bantamweight greats.

_Ledger verified through 2026-07-13. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

### 59. Quinton Jackson — 86 OVR

The high-impact UFC light heavyweight case: knocked out Chuck Liddell for the belt, defended against Dan Henderson, and stayed in the elite title mix through the Jon Jones era.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 35.91 | 8-5 | Light Heavyweight | 2 | 2 | 4 | 6-3 | 53.6% | 4.33 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 4.13 | 35 | 4.82 |
| Opponent Quality | 11.37 | 25 | 9.47 |
| Prime Dominance | 16.41 | 30 | 16.41 |
| Longevity | 10.83 | 10 | 3.61 |

Base score: **34.31**. Modifiers: Apex **+5.06**, Loss Penalty **-3.46**, Division-Era Depth **0**. Final raw score: **35.91**.

OVR conversion: 18.68–101.92 board anchors, normalized score **0.206992**, curved score **0.262156**, resulting in **86 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 4.13 | #43 | 2 adjusted credit / 14.54 benchmark |
| Opponent Quality | 11.37 | #58 | 5.51 diminished credit / 14.54 benchmark |
| Prime Dominance | 16.41 | #58 | 16.41 raw × 100.0% sample |
| Longevity | 10.83 | #47 | 52 counted elite months |
| Apex | +5.06 | Modifier | The Liddell knockout and Henderson title defense give Rampage a championship-proven apex with major historical impact, though the UFC-only reign was brief. |
| Loss Penalty | -3.46 | Modifier | 5 official/technical loss events reviewed |
| Division-Era Depth | 0 | Modifier | Use the neutral 1.00 late-2000s light-heavyweight baseline: genuine champion and top-five depth without an additional era bonus or discount. |

#### Championship receipts

UFC title-fight wins: **2**. Adjusted title wins: **2**. Derived undisputed-title win count: **2**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| — | Chuck Liddell | — | — | — | 1 | locked |
| — | Dan Henderson | — | — | — | 1 | locked |

#### Opponent Quality receipts

Raw win credit: **5.6**. Diminishing-return credit before fighter adjustment: **5.51**. Fighter adjustment: **0**. Final diminished credit: **5.51**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | — | Chuck Liddell | — | 1.25 | 1 | 1.25 | locked |
| 2 | — | Dan Henderson | — | 1 | 1 | 1 | locked |
| 3 | — | Lyoto Machida | — | 0.85 | 1 | 0.85 | locked |
| 4 | — | Wanderlei Silva | — | 0.85 | 1 | 0.85 | locked |
| 5 | — | Keith Jardine | — | 0.65 | 1 | 0.65 | locked |
| 6 | — | Matt Hamill | — | 0.65 | 1 | 0.65 | locked |
| 7 | — | Marvin Eastman | — | 0.25 | 0.75 | 0.19 | locked |
| 8 | — | Fabio Maldonado | — | 0.1 | 0.75 | 0.07 | locked |

#### Prime Dominance receipts

Prime window: **Chuck Liddell → Jon Jones**. Prime record: **6-3**. Effective samples: **9**. Sample multiplier: **100.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 6 | 6-3; 66.7% |
| Round control | 4.82 | 53.6%; rounds 15-13 |
| Finish pressure | 1 | 2 finishes; 22.2% |
| Elite-level validation | 4.59 | 7 elite-stage fights; 4.59 points |
| Raw prime score | 16.41 | Before sample multiplier |
| Final Prime Dominance | 16.41 | 16.41 × 1 |

#### Longevity receipts

Active elite years: **4.33**. Raw calendar months: **52**. Gap-adjusted months: **52**. Status multiplier: **1**. Division multiplier: **1**. Counted elite months: **52**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 2007-05-26 | 2007-09-08 | 3.45 | 3.45 | No |
| 2007-09-08 | 2008-07-05 | 9.89 | 9.89 | No |
| 2008-07-05 | 2008-12-27 | 5.75 | 5.75 | No |
| 2008-12-27 | 2009-03-07 | 2.3 | 2.3 | No |
| 2009-03-07 | 2010-05-29 | 14.72 | 14.72 | No |
| 2010-05-29 | 2010-11-20 | 5.75 | 5.75 | No |
| 2010-11-20 | 2011-05-28 | 6.21 | 6.21 | No |
| 2011-05-28 | 2011-09-24 | 3.91 | 3.91 | No |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **10** fights. Severity: **1.88**. Frequency: **1.58**. Prime-volume floor: **2.5**. Pre-division magnitude: **3.46**. Division discount: **0.0%**. Final penalty: **-3.46**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Base | Finish extra | Raw event | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2008-07-05 | Forrest Griffin | prime | top-five | home | No | Yes | -1.5 | 0 | -1.5 | standard rule |
| 2010-05-29 | Rashad Evans | prime | top-five | home | No | Yes | -1.5 | 0 | -1.5 | standard rule |
| 2011-09-24 | Jon Jones | prime | champion-level | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2012-02-25 | Ryan Bader | post-prime | top-ten | home | No | Yes | 0 | 0 | 0 | standard rule |
| 2013-01-26 | Glover Teixeira | post-prime | top-five | home | No | Yes | 0 | 0 | 0 | standard rule |

#### Division-strength context

Default division key: **tuf-boom-light-heavyweight-1.00**. Era-ledger division multiplier: **1**. Division-era modifier: **0**.

Late-2000s light heavyweight receives the neutral 1.00 baseline because the division had genuine champion and top-five depth.

#### Key judgment calls

- **Nickname:** The app-facing name is Quinton “Rampage” Jackson.
- **UFC-only scope:** PRIDE, Bellator, WFA, and regional results are excluded from scoring.
- **Prime start:** The Chuck Liddell title knockout begins the connected elite UFC run.
- **Prime end:** The Jon Jones title loss closes the prime; Bader and Teixeira are post-prime losses.
- **Lyoto Machida:** The official split-decision win counts, but receives discounted Opponent Quality credit because the performance was disputed.
- **Division depth:** Late-2000s light heavyweight uses the neutral 1.00 depth baseline.

#### Why ranked here

Rampage earns his place through two UFC title-fight wins, four top-five victories, championship-level wins over Chuck Liddell and Dan Henderson, and a strong late-2000s light heavyweight prime. His PRIDE résumé is excluded, so this ranking stands on UFC work alone.

#### Why not ranked higher?

He does not rank higher because the UFC title reign was short, the reviewed prime includes losses to Forrest Griffin, Rashad Evans, and Jon Jones, and his thirteen-fight UFC sample cannot match the championship volume of the division’s longest-reigning greats.

#### Compare-mode guidance

- **Best counterargument:** The best counterargument against Rampage is UFC volume: two title-fight wins, three prime losses, and only thirteen UFC appearances leave less room for sustained dominance than the division’s longest championship resumes.
- **Why this résumé can still win:** Rampage wins appropriate comparisons through championship proof and elite peak wins. He was not merely popular—he beat the reigning champion, defended against an elite challenger, and remained in the top-title mix for years.

#### Final takeaway

Rampage has a real UFC champion’s résumé, not just star power: a title knockout, a defense over an elite challenger, and multiple ranked wins in a deep division. The ceiling is held down by short championship volume and three prime losses.

_Ledger verified through 2026-07-16. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

### 60. Mauricio "Shogun" Rua — 86 OVR

A violent light-heavyweight champion whose knockout of Lyoto Machida created an elite UFC peak, even though the broader UFC résumé was far less consistent than his legend suggests.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 33 | 11-12-1 | Light Heavyweight | 1 | 0.95 | 3 | 3-3 | 50.0% | 2.59 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 1.95 | 35 | 2.27 |
| Opponent Quality | 15.29 | 25 | 12.74 |
| Prime Dominance | 15.44 | 30 | 15.44 |
| Longevity | 6.85 | 10 | 2.28 |

Base score: **32.73**. Modifiers: Apex **+4.81**, Loss Penalty **-4.38**, Division-Era Depth **-0.17**. Final raw score: **33**.

OVR conversion: 18.68–101.92 board anchors, normalized score **0.172033**, curved score **0.224011**, resulting in **86 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 1.95 | #58 | 0.95 adjusted credit / 14.54 benchmark |
| Opponent Quality | 15.29 | #46 | 7.19 diminished credit / 14.1 benchmark |
| Prime Dominance | 15.44 | #61 | 16.25 raw × 95.0% sample |
| Longevity | 6.85 | #59 | 32.86 counted elite months |
| Apex | +4.81 | Modifier | The Machida knockout carries the UFC-only peak; PRIDE accomplishments remain excluded. |
| Loss Penalty | -4.38 | Modifier | 12 official/technical loss events reviewed |
| Division-Era Depth | -0.17 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **1**. Adjusted title wins: **0.95**. Derived undisputed-title win count: **1**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 2010-05-08 | Lyoto Machida | normal | 1 | 0.95 | 0.95 | Approved aggregate Championship score recovered from the live control; exact historical per-fight split was not stored. |

#### Opponent Quality receipts

Raw win credit: **7.7**. Diminishing-return credit before fighter adjustment: **7.19**. Fighter adjustment: **0**. Final diminished credit: **7.19**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2009-04-18 | Chuck Liddell | champion-level | 1.25 | 1 | 1.25 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 2 | 2010-05-08 | Lyoto Machida | champion-level | 1.25 | 1 | 1.25 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 3 | 2011-08-27 | Forrest Griffin | top-five | 1 | 1 | 1 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 4 | 2015-08-01 | Antônio Rogério Nogueira | top-ten | 0.85 | 1 | 0.85 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 5 | 2016-05-14 | Corey Anderson | top-ten | 0.85 | 1 | 0.85 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 6 | 2012-08-04 | Brandon Vera | solid | 0.45 | 1 | 0.45 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 7 | 2013-12-07 | James Te Huna | solid | 0.45 | 0.75 | 0.34 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 8 | 2017-03-11 | Gian Villante | solid | 0.45 | 0.75 | 0.34 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 9 | 2018-12-02 | Tyson Pedro | solid | 0.45 | 0.75 | 0.34 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 10 | 2020-07-26 | Antônio Rogério Nogueira | solid | 0.45 | 0.75 | 0.34 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 11 | 2009-01-17 | Mark Coleman | name-value | 0.25 | 0.75 | 0.19 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |

#### Prime Dominance receipts

Prime window: **Chuck Liddell → Dan Henderson**. Prime record: **3-3**. Effective samples: **6**. Sample multiplier: **95.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 4.5 | 3-3; 50.0% |
| Round control | 4.5 | 50.0%; rounds 8-8 |
| Finish pressure | 3 | 3 finishes; 50.0% |
| Elite-level validation | 4.25 | 6 elite-stage fights; 4.25 points |
| Raw prime score | 16.25 | Before sample multiplier |
| Final Prime Dominance | 15.44 | 16.25 × 0.95 |

#### Longevity receipts

Active elite years: **2.59**. Raw calendar months: **31**. Gap-adjusted months: **31**. Status multiplier: **1.06**. Division multiplier: **1**. Counted elite months: **32.86**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 2009-04-18 | 2009-10-24 | 6.21 | 6.21 | No |
| 2009-10-24 | 2010-05-08 | 6.44 | 6.44 | No |
| 2010-05-08 | 2011-03-19 | 10.35 | 10.35 | No |
| 2011-03-19 | 2011-08-27 | 5.29 | 5.29 | No |
| 2011-08-27 | 2011-11-19 | 2.76 | 2.76 | No |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **8** fights. Severity: **1.88**. Frequency: **2.5**. Prime-volume floor: **2.5**. Pre-division magnitude: **4.38**. Division discount: **0.0%**. Final penalty: **-4.38**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Base | Finish extra | Raw event | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2007-09-22 | Forrest Griffin | pre-prime | top-five | home | Yes | Yes | -0.75 | -0.75 | -1.5 | standard rule |
| 2009-10-24 | Lyoto Machida | prime | champion-level | home | No | Yes | -1.5 | 0 | -1.5 | standard rule |
| 2011-03-19 | Jon Jones | prime | champion-level | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2011-11-19 | Dan Henderson | prime | champion-level | home | No | Yes | -1.5 | 0 | -1.5 | standard rule |
| 2012-12-08 | Alexander Gustafsson | post-prime | top-five | home | No | Yes | 0 | 0 | 0 | standard rule |
| 2013-08-17 | Chael Sonnen | post-prime | top-ten | home | Yes | Yes | 0 | 0 | 0 | standard rule |
| 2014-03-23 | Dan Henderson | post-prime | top-five | home | Yes | Yes | 0 | 0 | 0 | standard rule |
| 2014-11-08 | Ovince Saint Preux | post-prime | top-ten | home | Yes | Yes | 0 | 0 | 0 | standard rule |
| 2018-07-22 | Anthony Smith | post-prime | top-ten | home | Yes | Yes | 0 | 0 | 0 | standard rule |
| 2020-11-21 | Paul Craig | post-prime | top-ten | home | Yes | Yes | 0 | 0 | 0 | standard rule |
| 2022-05-07 | Ovince Saint Preux | post-prime | solid | home | No | Yes | 0 | 0 | 0 | standard rule |
| 2023-01-21 | Ihor Potieria | post-prime | minimal | home | Yes | Yes | 0 | 0 | 0 | standard rule |

#### Division-strength context

Default division key: **light-heavyweight-1.00**. Era-ledger division multiplier: **1**. Division-era modifier: **-0.17**.

Liddell through Henderson I.

#### Key judgment calls

- **Prime window:** Chuck Liddell → Dan Henderson.
- **Coverage:** Complete UFC-only ledger.
- **Prime endpoint:** Henderson closes Shogun’s concentrated UFC title-prime window.

#### Why ranked here

Rua ranks here because his best UFC stretch delivered real championship proof. He stopped Chuck Liddell, pushed Lyoto Machida to a disputed decision, knocked Machida out in the rematch to win the belt, and later avenged the Forrest Griffin loss. Those performances create a legitimate Apex and quality-win case despite the uneven total record.

#### Why not ranked higher?

He does not rank higher because this ranking is UFC-only, so his celebrated PRIDE run is excluded. His UFC record is 11-12-1, he won only one title fight, and his counted prime finished 3-3 with damaging losses to Jon Jones and Dan Henderson. The late-career win volume adds context, but it cannot overcome the short championship window and losing overall record.

#### Final takeaway

Rua ranks here because his best UFC stretch delivered real championship proof. He stopped Chuck Liddell, pushed Lyoto Machida to a disputed decision, knocked Machida out in the rematch to win the belt, and later avenged the Forrest Griffin loss. Those performances create a legitimate Apex and quality-win case despite the uneven total record.

_Ledger verified through 2026-07-13. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

### 61. Forrest Griffin — 86 OVR

An upset-driven light-heavyweight champion whose wins over Shogun Rua and Rampage Jackson created a legitimate but short-lived elite peak.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 32.85 | 10-5 | Light Heavyweight | 1 | 0.95 | 3 | 4-3 | 63.2% | 3.93 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 1.95 | 35 | 2.27 |
| Opponent Quality | 13.78 | 25 | 11.48 |
| Prime Dominance | 15.59 | 30 | 15.59 |
| Longevity | 10.3 | 10 | 3.43 |

Base score: **32.77**. Modifiers: Apex **+4.98**, Loss Penalty **-4.29**, Division-Era Depth **-0.62**. Final raw score: **32.85**.

OVR conversion: 18.68–101.92 board anchors, normalized score **0.170231**, curved score **0.222015**, resulting in **86 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 1.95 | #58 | 0.95 adjusted credit / 14.54 benchmark |
| Opponent Quality | 13.78 | #53 | 6.47 diminished credit / 14.1 benchmark |
| Prime Dominance | 15.59 | #60 | 15.59 raw × 100.0% sample |
| Longevity | 10.3 | #49 | 49.46 counted elite months |
| Apex | +4.98 | Modifier | Historic upset and championship win, with the close Jackson decision keeping the Apex below the highest tier. |
| Loss Penalty | -4.29 | Modifier | 5 official/technical loss events reviewed |
| Division-Era Depth | -0.62 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **1**. Adjusted title wins: **0.95**. Derived undisputed-title win count: **1**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 2008-07-05 | Quinton Jackson | normal | 1 | 0.95 | 0.95 | Approved aggregate Championship score recovered from the live control; exact historical per-fight split was not stored. |

#### Opponent Quality receipts

Raw win credit: **6.75**. Diminishing-return credit before fighter adjustment: **6.47**. Fighter adjustment: **0**. Final diminished credit: **6.47**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2007-09-22 | Mauricio Rua | champion-level | 1.25 | 1 | 1.25 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 2 | 2008-07-05 | Quinton Jackson | champion-level | 1.25 | 1 | 1.25 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 3 | 2011-02-05 | Rich Franklin | top-five | 1 | 1 | 1 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 4 | 2009-11-21 | Tito Ortiz | top-ten | 0.85 | 1 | 0.85 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 5 | 2012-07-07 | Tito Ortiz | top-ten | 0.85 | 1 | 0.85 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 6 | 2005-04-09 | Stephan Bonnar | solid | 0.45 | 1 | 0.45 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 7 | 2005-10-07 | Elvis Sinosic | solid | 0.45 | 0.75 | 0.34 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 8 | 2006-08-26 | Stephan Bonnar | solid | 0.45 | 0.75 | 0.34 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 9 | 2005-06-04 | Bill Mahood | minimal | 0.1 | 0.75 | 0.07 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 10 | 2007-06-16 | Hector Ramirez | minimal | 0.1 | 0.75 | 0.07 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |

#### Prime Dominance receipts

Prime window: **Mauricio Rua I → Mauricio Rua II**. Prime record: **4-3**. Effective samples: **7**. Sample multiplier: **100.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 5.14 | 4-3; 57.1% |
| Round control | 5.68 | 63.2%; rounds 12-7 |
| Finish pressure | 0.5 | 1 finishes; 14.3% |
| Elite-level validation | 4.27 | 6 elite-stage fights; 4.27 points |
| Raw prime score | 15.59 | Before sample multiplier |
| Final Prime Dominance | 15.59 | 15.59 × 1 |

#### Longevity receipts

Active elite years: **3.93**. Raw calendar months: **47.1**. Gap-adjusted months: **47.1**. Status multiplier: **1.05**. Division multiplier: **1**. Counted elite months: **49.46**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 2007-09-22 | 2008-07-05 | 9.43 | 9.43 | No |
| 2008-07-05 | 2008-12-27 | 5.75 | 5.75 | No |
| 2008-12-27 | 2009-08-08 | 7.36 | 7.36 | No |
| 2009-08-08 | 2009-11-21 | 3.45 | 3.45 | No |
| 2009-11-21 | 2011-02-05 | 14.49 | 14.49 | No |
| 2011-02-05 | 2011-08-27 | 6.67 | 6.67 | No |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **14** fights. Severity: **2.25**. Frequency: **2.04**. Prime-volume floor: **3**. Pre-division magnitude: **4.29**. Division discount: **0.0%**. Final penalty: **-4.29**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Base | Finish extra | Raw event | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2006-04-15 | Tito Ortiz | pre-prime | champion-level | home | No | Yes | -0.75 | 0 | -0.75 | standard rule |
| 2006-12-30 | Keith Jardine | pre-prime | top-ten | home | Yes | Yes | -1.25 | -0.75 | -2 | standard rule |
| 2008-12-27 | Rashad Evans | prime | champion-level | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2009-08-08 | Anderson Silva | prime | champion-level | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2011-08-27 | Mauricio Rua | prime | champion-level | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |

#### Division-strength context

Default division key: **light-heavyweight-1.00**. Era-ledger division multiplier: **1**. Division-era modifier: **-0.62**.

Shogun I through Shogun II.

#### Key judgment calls

- **Prime window:** Mauricio Rua I → Mauricio Rua II.
- **Coverage:** Complete UFC-only ledger.
- **Prime endpoint:** The Shogun rematch closes Forrest’s UFC elite/title-level window.

#### Why ranked here

Griffin ranks here because his best two-fight stretch carried real historical weight. He submitted Mauricio Rua in a major upset, then beat Quinton Jackson to win the UFC light-heavyweight title. Wins over Rich Franklin and Tito Ortiz add useful depth, while the Stephan Bonnar fight remains important context even though it is not an elite quality win.

#### Why not ranked higher?

He does not rank higher because the championship run ended in his first defense, the counted prime finished only 4-3, and Rashad Evans, Anderson Silva, and Rua all stopped him during that window. With one title-fight win, three Top-5 victories, and a 30% UFC finish rate, the résumé lacks the sustained dominance of the champions above him.

#### Final takeaway

Griffin ranks here because his best two-fight stretch carried real historical weight. He submitted Mauricio Rua in a major upset, then beat Quinton Jackson to win the UFC light-heavyweight title. Wins over Rich Franklin and Tito Ortiz add useful depth, while the Stephan Bonnar fight remains important context even though it is not an elite quality win.

_Ledger verified through 2026-07-13. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

### 62. Brock Lesnar — 86 OVR

A massive short-window UFC heavyweight champion whose title run was real, explosive, and historically important, but capped by tiny sample size and a brief elite window.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 31.86 | 4-3, 1 NC | Heavyweight | 3 | 2.75 | 3 | 3-1 | 57.1% | 1.94 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 5.67 | 35 | 6.62 |
| Opponent Quality | 8.3 | 25 | 6.92 |
| Prime Dominance | 18.57 | 30 | 18.57 |
| Longevity | 4.78 | 10 | 1.59 |

Base score: **33.7**. Modifiers: Apex **+4.18**, Loss Penalty **-3.76**, Division-Era Depth **-2.26**. Final raw score: **31.86**.

OVR conversion: 18.68–101.92 board anchors, normalized score **0.158337**, curved score **0.208759**, resulting in **86 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 5.67 | #37 | 2.75 adjusted credit / 14.54 benchmark |
| Opponent Quality | 8.3 | #64 | 3.9 diminished credit / 14.1 benchmark |
| Prime Dominance | 18.57 | #44 | 20.63 raw × 90.0% sample |
| Longevity | 4.78 | #61 | 22.92 counted elite months |
| Apex | +4.18 | Modifier | Short heavyweight title apex with huge star aura. |
| Loss Penalty | -3.76 | Modifier | 3 official/technical loss events reviewed |
| Division-Era Depth | -2.26 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **3**. Adjusted title wins: **2.75**. Derived undisputed-title win count: **3**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 2008-11-15 | Randy Couture | normal | 1 | 0.85 | 0.85 | Aged smaller champion/opponent context. |
| 2009-07-11 | Frank Mir | normal | 1 | 0.95 | 0.95 | locked |
| 2010-07-03 | Shane Carwin | normal | 1 | 0.95 | 0.95 | locked |

#### Opponent Quality receipts

Raw win credit: **3.9**. Diminishing-return credit before fighter adjustment: **3.9**. Fighter adjustment: **0**. Final diminished credit: **3.9**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2008-11-15 | Randy Couture | champion-level | 1.25 | 1 | 1.25 | UFC heavyweight champion and all-time name, age context noted. |
| 2 | 2009-07-11 | Frank Mir | top-five | 1 | 1 | 1 | Former UFC champion/interim champion rival. |
| 3 | 2010-07-03 | Shane Carwin | top-five | 1 | 1 | 1 | Undefeated interim champion and elite heavyweight contender. |
| 4 | 2008-08-09 | Heath Herring | ranked | 0.65 | 1 | 0.65 | Quality heavyweight veteran. |

#### Prime Dominance receipts

Prime window: **Randy Couture → Cain Velasquez**. Prime record: **3-1**. Effective samples: **4**. Sample multiplier: **90.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 6.75 | 3-1; 75.0% |
| Round control | 5.14 | 57.1%; rounds 4-3 |
| Finish pressure | 4.5 | 3 finishes; 75.0% |
| Elite-level validation | 4.24 | 4 elite-stage fights; 4.24 points |
| Raw prime score | 20.63 | Before sample multiplier |
| Final Prime Dominance | 18.57 | 20.63 × 0.9 |

#### Longevity receipts

Active elite years: **1.94**. Raw calendar months: **23.2**. Gap-adjusted months: **23.2**. Status multiplier: **1.04**. Division multiplier: **0.95**. Counted elite months: **22.92**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 2008-11-15 | 2009-07-11 | 7.82 | 7.82 | No |
| 2009-07-11 | 2010-07-03 | 11.73 | 11.73 | No |
| 2010-07-03 | 2010-10-23 | 3.68 | 3.68 | No |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **6** fights. Severity: **1.88**. Frequency: **1.88**. Prime-volume floor: **1**. Pre-division magnitude: **3.76**. Division discount: **0.0%**. Final penalty: **-3.76**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Base | Finish extra | Raw event | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2008-02-02 | Frank Mir | pre-prime | top-five | home | Yes | Yes | -0.75 | -0.75 | -1.5 | standard rule |
| 2010-10-23 | Cain Velasquez | prime | champion-level | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2011-12-30 | Alistair Overeem | post-prime | top-five | home | Yes | Yes | 0 | 0 | 0 | standard rule |

#### Division-strength context

Default division key: **ufc-heavyweight-0.96**. Era-ledger division multiplier: **0.95**. Division-era modifier: **-2.26**.

Couture through Cain.

#### Key judgment calls

- **Short peak, real peak:** Brock was not around long, but he absolutely reached a real UFC champion level.
- **Title value:** Three UFC title-fight wins keep him from being treated like a novelty case.
- **Sample-size cap:** The résumé cannot climb much higher with only a handful of UFC results.
- **Skill profile:** His wrestling, size, and athleticism were overwhelming, but the Cain/Overeem fights showed the danger when he was forced backward.

#### Why ranked here

Lesnar lands here because his UFC heavyweight title run was real: he beat Couture, smashed Mir in the rematch, and survived Carwin to defend the belt.

#### Why not ranked higher?

He does not rank higher because the elite UFC sample is tiny, the title reign was short, Cain ended the run quickly, and the later Overeem/Hunt chapter does not add résumé depth.

#### Compare-mode guidance

- **Best counterargument:** The counter is obvious: tiny sample, Cain, Overeem, no long reign, and no broad contender run.
- **Why this résumé can still win:** Brock wins comparisons when heavyweight title results and short-window peak impact matter more than career depth.

#### Final takeaway

Brock is a real UFC heavyweight champion case, not just a star-power case — but the résumé is too short to push higher.

_Ledger verified through 2026-07-13. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

### 63. Dan Henderson — 84 OVR

A true all-time MMA legend whose UFC-only score is much harsher: great Shogun/Bisping/Franklin moments, no UFC title wins, and most of the historic aura living outside this scoring scope.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 27.2 | 9-9 | Middleweight / Light Heavyweight | 0 | 0 | 4 | 4-3 | 55.0% | 4.32 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 0 | 35 | 0 |
| Opponent Quality | 13.64 | 25 | 11.37 |
| Prime Dominance | 13.22 | 30 | 13.22 |
| Longevity | 9.63 | 10 | 3.21 |

Base score: **27.8**. Modifiers: Apex **+4.47**, Loss Penalty **-4.5**, Division-Era Depth **-0.57**. Final raw score: **27.2**.

OVR conversion: 18.68–101.92 board anchors, normalized score **0.102355**, curved score **0.144076**, resulting in **84 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 0 | #63 | 0 adjusted credit / 14.54 benchmark |
| Opponent Quality | 13.64 | #55 | 6.41 diminished credit / 14.1 benchmark |
| Prime Dominance | 13.22 | #65 | 13.22 raw × 100.0% sample |
| Longevity | 9.63 | #52 | 46.2 counted elite months |
| Apex | +4.47 | Modifier | The Bisping knockout creates elite Aura, but the UFC-only run never established Henderson as the clear best fighter in a division. |
| Loss Penalty | -4.5 | Modifier | 9 official/technical loss events reviewed |
| Division-Era Depth | -0.57 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **0**. Adjusted title wins: **0**. Derived undisputed-title win count: **0**. Interim-title win count: **0**.

_No rows._

#### Opponent Quality receipts

Raw win credit: **6.8**. Diminishing-return credit before fighter adjustment: **6.41**. Fighter adjustment: **0**. Final diminished credit: **6.41**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2011-11-19 | Mauricio Rua | top-five | 1 | 1 | 1 | Elite former UFC champion in classic contender fight. |
| 2 | 1998-05-15 | Allan Goes | top-ten | 0.85 | 1 | 0.85 | Strong early UFC tournament-era opponent. |
| 3 | 1998-05-15 | Carlos Newton | top-ten | 0.85 | 1 | 0.85 | Strong early UFC tournament-era opponent. |
| 4 | 2009-01-17 | Rich Franklin | top-ten | 0.85 | 1 | 0.85 | Former UFC champion and strong contender. |
| 5 | 2009-07-11 | Michael Bisping | top-ten | 0.85 | 1 | 0.85 | Strong ranked middleweight contender. |
| 6 | 2014-03-23 | Mauricio Rua | top-ten | 0.85 | 1 | 0.85 | Repeat win over elite name, later-career context. |
| 7 | 2008-09-06 | Rousimar Palhares | ranked | 0.65 | 0.75 | 0.49 | Quality middleweight win. |
| 8 | 2015-06-06 | Tim Boetsch | solid | 0.45 | 0.75 | 0.34 | Solid UFC middleweight win. |
| 9 | 2016-06-04 | Hector Lombard | solid | 0.45 | 0.75 | 0.34 | Name win with timing/context discount. |

#### Prime Dominance receipts

Prime window: **Michael Bisping → Daniel Cormier**. Prime record: **4-3**. Effective samples: **7**. Sample multiplier: **100.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 3.86 | 3-4; 42.9% |
| Round control | 4.05 | 45.0%; rounds 9-11 |
| Finish pressure | 1 | 2 finishes; 28.6% |
| Elite-level validation | 4.31 | 7 elite-stage fights; 4.31 points |
| Raw prime score | 13.22 | Before sample multiplier |
| Final Prime Dominance | 13.22 | 13.22 × 1 |

#### Longevity receipts

Active elite years: **4.32**. Raw calendar months: **58.4**. Gap-adjusted months: **48.1**. Status multiplier: **0.98**. Division multiplier: **0.98**. Counted elite months: **46.2**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 2009-07-11 | 2011-11-19 | 28.29 | 18 | Yes |
| 2011-11-19 | 2013-02-23 | 15.18 | 15.18 | No |
| 2013-02-23 | 2013-06-15 | 3.68 | 3.68 | No |
| 2013-06-15 | 2013-11-09 | 4.83 | 4.83 | No |
| 2013-11-09 | 2014-03-23 | 4.4 | 4.4 | No |
| 2014-03-23 | 2014-05-24 | 2.04 | 2.04 | No |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **13** fights. Severity: **2.25**. Frequency: **2.25**. Prime-volume floor: **3.5**. Pre-division magnitude: **4.5**. Division discount: **0.0%**. Final penalty: **-4.5**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Base | Finish extra | Raw event | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2007-09-08 | Quinton Jackson | pre-prime | champion-level | home | No | Yes | -0.75 | 0 | -0.75 | standard rule |
| 2008-03-01 | Anderson Silva | pre-prime | champion-level | home | Yes | Yes | -0.75 | -0.75 | -1.5 | standard rule |
| 2013-02-23 | Lyoto Machida | prime | top-five | home | No | Yes | -1.5 | 0 | -1.5 | standard rule |
| 2013-06-15 | Rashad Evans | prime | top-five | home | No | Yes | -1.5 | 0 | -1.5 | standard rule |
| 2013-11-09 | Vitor Belfort | prime | champion-level | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2014-05-24 | Daniel Cormier | prime | champion-level | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2015-01-24 | Gegard Mousasi | post-prime | top-five | home | Yes | Yes | 0 | 0 | 0 | standard rule |
| 2015-11-07 | Vitor Belfort | post-prime | top-five | home | Yes | Yes | 0 | 0 | 0 | standard rule |
| 2016-10-08 | Michael Bisping | post-prime | champion-level | home | No | Yes | 0 | 0 | 0 | standard rule |

#### Division-strength context

Default division key: **mixed-middleweight-light-heavyweight-0.96**. Era-ledger division multiplier: **0.98**. Division-era modifier: **-0.57**.

Bisping through Cormier.

#### Key judgment calls

- **Shogun fight:** The first Rua fight is the UFC-only résumé anchor.
- **Bisping split:** Hendo owns the iconic knockout, but lost the later UFC title fight.
- **No UFC belt:** No undisputed UFC title win is the main ceiling.
- **Outside résumé:** Pride/Strikeforce greatness can be mentioned as context but not scored.
- **Late-career volatility:** The record looks rough because much of the UFC sample came around or after his broader career peak.

#### Why ranked here

Henderson ranks here because UFC-only still gives him real value: the Shogun classic, the Bisping knockout, the Franklin win, the Lombard knockout, old-era UFC 17 tournament context, and a long stretch of elite-name fights across middleweight and light heavyweight.

#### Why not ranked higher?

He does not rank higher because this ranking does not score Pride, Strikeforce, Rings, or the broader all-time MMA résumé. In the UFC alone, Hendo went 8-9, never won an undisputed UFC title, and lost UFC title-level fights to Anderson Silva, Quinton Jackson, Daniel Cormier, and Michael Bisping.

#### Compare-mode guidance

- **Best counterargument:** Hendo’s counterargument is that UFC-only underrates him by design because it excludes the exact promotions where much of his greatness happened.
- **Why this résumé can still win:** Henderson wins comparisons only when the debate allows broader MMA legacy. In strict UFC-only scoring, he loses to fighters with cleaner UFC title résumés.

#### Final takeaway

Henderson is exactly why the app needs UFC-only discipline. Historically, he is much greater than this slot. In this scoring system, the missing UFC title win and 8-9 UFC record keep him below cleaner UFC résumé fighters.

_Ledger verified through 2026-07-13. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

### 64. Chael Sonnen — 84 OVR

A relentless UFC title challenger whose wrestling pressure and Anderson Silva rivalry made him unforgettable, but zero title wins cap the résumé hard.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 23.58 | 7-7 | Middleweight / Light Heavyweight | 0 | 0 | 4 | 5-2 | 85.7% | 3.12 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 0 | 35 | 0 |
| Opponent Quality | 9.87 | 25 | 8.22 |
| Prime Dominance | 15.2 | 30 | 15.2 |
| Longevity | 7.72 | 10 | 2.57 |

Base score: **25.99**. Modifiers: Apex **+3.44**, Loss Penalty **-4.75**, Division-Era Depth **-1.11**. Final raw score: **23.58**.

OVR conversion: 18.68–101.92 board anchors, normalized score **0.058866**, curved score **0.090029**, resulting in **84 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 0 | #63 | 0 adjusted credit / 14.54 benchmark |
| Opponent Quality | 9.87 | #62 | 4.64 diminished credit / 14.1 benchmark |
| Prime Dominance | 15.2 | #62 | 16 raw × 95.0% sample |
| Longevity | 7.72 | #58 | 37.06 counted elite months |
| Apex | +3.44 | Modifier | Elite middleweight challenger apex. |
| Loss Penalty | -4.75 | Modifier | 7 official/technical loss events reviewed |
| Division-Era Depth | -1.11 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **0**. Adjusted title wins: **0**. Derived undisputed-title win count: **0**. Interim-title win count: **0**.

_No rows._

#### Opponent Quality receipts

Raw win credit: **4.75**. Diminishing-return credit before fighter adjustment: **4.64**. Fighter adjustment: **0**. Final diminished credit: **4.64**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2009-10-24 | Yushin Okami | top-ten | 0.85 | 1 | 0.85 | Strong ranked middleweight contender. |
| 2 | 2010-02-06 | Nate Marquardt | top-ten | 0.85 | 1 | 0.85 | Strong ranked middleweight contender. |
| 3 | 2012-01-28 | Michael Bisping | top-ten | 0.85 | 1 | 0.85 | Strong middleweight contender, close fight context. |
| 4 | 2011-10-08 | Brian Stann | ranked | 0.65 | 1 | 0.65 | Quality middleweight win. |
| 5 | 2013-08-17 | Mauricio Rua | ranked | 0.65 | 1 | 0.65 | Former UFC champion name, late-career/light-heavyweight context. |
| 6 | 2006-04-06 | Trevor Prangley | solid | 0.45 | 1 | 0.45 | Solid UFC win. |
| 7 | 2009-05-23 | Dan Miller | solid | 0.45 | 0.75 | 0.34 | Solid UFC middleweight win. |

#### Prime Dominance receipts

Prime window: **Nate Marquardt → Jon Jones**. Prime record: **5-2**. Effective samples: **6**. Sample multiplier: **95.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 4.5 | 3-3; 50.0% |
| Round control | 6.75 | 75.0%; rounds 12-4 |
| Finish pressure | 1 | 1 finishes; 16.7% |
| Elite-level validation | 3.75 | 5 elite-stage fights; 3.75 points |
| Raw prime score | 16 | Before sample multiplier |
| Final Prime Dominance | 15.2 | 16 × 0.95 |

#### Longevity receipts

Active elite years: **3.12**. Raw calendar months: **38.6**. Gap-adjusted months: **38.6**. Status multiplier: **1**. Division multiplier: **0.96**. Counted elite months: **37.06**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 2010-02-06 | 2010-08-07 | 5.98 | 5.98 | No |
| 2010-08-07 | 2011-10-08 | 14.03 | 14.03 | No |
| 2011-10-08 | 2012-01-28 | 3.68 | 3.68 | No |
| 2012-01-28 | 2012-07-07 | 5.29 | 5.29 | No |
| 2012-07-07 | 2013-04-27 | 9.66 | 9.66 | No |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **12** fights. Severity: **2.25**. Frequency: **2.5**. Prime-volume floor: **3**. Pre-division magnitude: **4.75**. Division discount: **0.0%**. Final penalty: **-4.75**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Base | Finish extra | Raw event | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2005-10-07 | Renato Sobral | pre-prime | top-ten | home | Yes | Yes | -1.25 | -0.75 | -2 | standard rule |
| 2006-05-27 | Jeremy Horn | pre-prime | top-ten | home | Yes | Yes | -1.25 | -0.75 | -2 | standard rule |
| 2009-02-21 | Demian Maia | pre-prime | top-five | home | Yes | Yes | -0.75 | -0.75 | -1.5 | standard rule |
| 2010-08-07 | Anderson Silva | prime | champion-level | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2012-07-07 | Anderson Silva | prime | champion-level | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2013-04-27 | Jon Jones | prime | champion-level | upward | Yes | Yes | -0.75 | -0.5 | -1.25 | prime-upward-elite |
| 2013-11-16 | Rashad Evans | post-prime | top-five | home | Yes | Yes | 0 | 0 | 0 | standard rule |

#### Division-strength context

Default division key: **middleweight-0.95**. Era-ledger division multiplier: **0.96**. Division-era modifier: **-1.11**.

Marquardt through Jones.

#### Key judgment calls

- **Almost champion:** Chael gets real respect for how close he came, but almost-title moments cannot replace title wins.
- **Round control:** The Anderson I performance keeps his Prime Dominance respectable because he controlled most of an all-time champion fight.
- **Quality wins:** Bisping, Marquardt, Okami, and Stann are the real résumé anchors.
- **Losses:** The loss column is not ignored. Finished title losses are why he stays capped.

#### Why ranked here

Sonnen lands here because his middleweight contender run was real: Okami, Marquardt, Stann, and Bisping gave him one of the strongest no-belt cases in this tier.

#### Why not ranked higher?

He does not rank higher because he never won a UFC title, lost all three UFC title fights, and the biggest moments of his UFC career still ended as losses.

#### Compare-mode guidance

- **Best counterargument:** The counter is simple: the biggest fights ended as losses.
- **Why this résumé can still win:** Chael wins comparisons when contender strength, rivalry impact, and round-control pressure matter more than title hardware.

#### Final takeaway

Chael is one of the strongest UFC no-belt personality/resume cases: memorable, dangerous, and elite — but clearly below true champion résumés.

_Ledger verified through 2026-07-13. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

### 65. Paddy Pimblett — 84 OVR

A fearless modern lightweight contender with a 7-0 UFC start, dangerous submission offense, and a rebound win that proved he belongs against ranked opposition.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 23.49 | 8-1 | Lightweight | 0 | 0 | 1 | 3-1 | 63.3% | 1.96 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 0 | 35 | 0 |
| Opponent Quality | 3.4 | 25 | 2.83 |
| Prime Dominance | 16.6 | 30 | 16.6 |
| Longevity | 5.55 | 10 | 1.85 |

Base score: **21.28**. Modifiers: Apex **+3.16**, Loss Penalty **-1.7**, Division-Era Depth **+0.75**. Final raw score: **23.49**.

OVR conversion: 18.68–101.92 board anchors, normalized score **0.057785**, curved score **0.088622**, resulting in **84 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 0 | #63 | 0 adjusted credit / 14.54 benchmark |
| Opponent Quality | 3.4 | #65 | 1.65 diminished credit / 14.54 benchmark |
| Prime Dominance | 16.6 | #57 | 19.53 raw × 85.0% sample |
| Longevity | 5.55 | #60 | 26.63 counted elite months |
| Apex | +3.16 | Modifier | Explosive modern-lightweight finishing peak, but without championship proof. |
| Loss Penalty | -1.7 | Modifier | 1 official/technical loss events reviewed |
| Division-Era Depth | +0.75 | Modifier | Apply the positive modern-lightweight depth adjustment. |

#### Championship receipts

UFC title-fight wins: **0**. Adjusted title wins: **0**. Derived undisputed-title win count: **0**. Interim-title win count: **0**.

_No rows._

#### Opponent Quality receipts

Raw win credit: **1.65**. Diminishing-return credit before fighter adjustment: **1.65**. Fighter adjustment: **0**. Final diminished credit: **1.65**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | — | Benoit Saint Denis | — | 0.85 | 1 | 0.85 | locked |
| 2 | — | Michael Chandler | — | 0.45 | 1 | 0.45 | locked |
| 3 | — | King Green | — | 0.35 | 1 | 0.35 | locked |

#### Prime Dominance receipts

Prime window: **King Green → Current ranked lightweight form**. Prime record: **3-1**. Effective samples: **4**. Sample multiplier: **85.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 6.75 | 3-1; 75.0% |
| Round control | 5.7 | 63.3%; rounds 6.33-3.67 |
| Finish pressure | 4.5 | 3 finishes; 75.0% |
| Elite-level validation | 2.58 | 2 elite-stage fights; 2.58 points |
| Raw prime score | 19.53 | Before sample multiplier |
| Final Prime Dominance | 16.6 | 19.53 × 0.85 |

#### Longevity receipts

Active elite years: **1.96**. Raw calendar months: **23.5**. Gap-adjusted months: **23.5**. Status multiplier: **1.03**. Division multiplier: **1.1**. Counted elite months: **26.63**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 2024-07-27 | 2025-04-12 | 8.51 | 8.51 | No |
| 2025-04-12 | 2026-01-24 | 9.43 | 9.43 | No |
| 2026-01-24 | 2026-07-11 | 5.52 | 5.52 | No |
| 2026-07-11 | 2026-07-13 | 0.07 | 0.07 | No |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **9** fights. Severity: **1.5**. Frequency: **0.5**. Prime-volume floor: **0.75**. Pre-division magnitude: **2**. Division discount: **15.0%**. Final penalty: **-1.7**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Base | Finish extra | Raw event | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2026-01-24 | Justin Gaethje | prime | champion-level | home | No | Yes | -1.5 | 0 | -1.5 | standard rule |

#### Division-strength context

Default division key: **modern-lightweight-1.10**. Era-ledger division multiplier: **1.1**. Division-era modifier: **+0.75**.

Modern lightweight receives the model’s strongest standard division context.

#### Key judgment calls

- **Prime start:** King Green begins the counted elite window; the earlier unbeaten run builds the record but not the GOAT-level prime.
- **Jared Gordon:** the official win remains in the UFC record, but the disputed decision receives no meaningful opponent-quality boost.
- **Tony Ferguson:** counts as a UFC win but receives minimal quality credit because Ferguson was deep into his decline.
- **Michael Chandler:** a ranked finish with real value, discounted for Chandler's age, inactivity, and recent form.
- **Justin Gaethje:** counts as a prime elite decision loss without a finish add-on.

#### Why ranked here

Pimblett earns a place in the UFC-only ranking through eight UFC wins, six finishes, and a current elite stretch highlighted by King Green, Michael Chandler, and Benoit Saint Denis. The Saint Denis submission is the clearest proof that his contender run is more than popularity.

#### Why not ranked higher?

He has not won a UFC championship fight, owns only one clear top-five win, and his elite window is still short. The Justin Gaethje interim-title loss also keeps him below established champions and long-term contenders.

#### Compare-mode guidance

- **Best counterargument:** The strongest counterargument is momentum: his current form is better than the thin historical resume suggests.
- **Why this résumé can still win:** He beats lower-level cases through UFC win volume, finishing rate, and modern lightweight strength—not championship achievement.

#### Final takeaway

Pimblett is now a legitimate UFC lightweight contender with real finishing proof. His resume has entered the all-time database, but title success and a deeper elite win ledger are still required before he can challenge established greats.

_Ledger verified through 2026-07-15. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

### 1. Amanda Nunes — 99 OVR

The women’s UFC GOAT case: two-division champion, huge title-fight volume, legendary finishes, and the deepest women’s win list in this ranking.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| women | 80.47 | 16-2 | Bantamweight / Featherweight | 11 | 10.05 | 11 | 12-1 | 87.5% | 7.26 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 20.74 | 35 | 24.2 |
| Opponent Quality | 25.85 | 25 | 21.54 |
| Prime Dominance | 25.7 | 30 | 25.7 |
| Longevity | 19.49 | 10 | 6.5 |

Base score: **77.94**. Modifiers: Apex **+6**, Loss Penalty **-2.51**, Division-Era Depth **-0.96**. Final raw score: **80.47**.

OVR conversion: 25.78–80.79 board anchors, normalized score **0.994183**, curved score **0.995053**, resulting in **99 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 20.74 | #1 | 10.05 adjusted credit / 14.54 benchmark |
| Opponent Quality | 25.85 | #1 | 12.15 diminished credit / 14.1 benchmark |
| Prime Dominance | 25.7 | #1 | 25.7 raw × 100.0% sample |
| Longevity | 19.49 | #3 | 93.54 counted elite months |
| Apex | +6 | Modifier | Women’s UFC apex benchmark: violent, historic, unmistakable. |
| Loss Penalty | -2.51 | Modifier | 2 official/technical loss events reviewed |
| Division-Era Depth | -0.96 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **11**. Adjusted title wins: **10.05**. Derived undisputed-title win count: **11**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 2016-07-09 | Miesha Tate | normal | 1 | 0.95 | 0.95 | locked |
| 2016-12-30 | Ronda Rousey | normal | 1 | 0.95 | 0.95 | locked |
| 2017-09-09 | Valentina Shevchenko | normal | 1 | 0.95 | 0.95 | locked |
| 2018-05-12 | Raquel Pennington | normal | 1 | 0.85 | 0.85 | locked |
| 2018-12-29 | Cris Cyborg | second-division-undisputed | 1.25 | 1 | 1.25 | Second-division title win over elite champ. |
| 2019-07-06 | Holly Holm | normal | 1 | 0.9 | 0.9 | locked |
| 2019-12-14 | Germaine de Randamie | normal | 1 | 0.9 | 0.9 | locked |
| 2020-06-06 | Felicia Spencer | normal | 1 | 0.75 | 0.75 | Very thin featherweight title context. |
| 2021-03-06 | Megan Anderson | normal | 1 | 0.75 | 0.75 | Very thin featherweight title context. |
| 2022-07-30 | Julianna Peña | normal | 1 | 0.95 | 0.95 | locked |
| 2023-06-10 | Irene Aldana | normal | 1 | 0.85 | 0.85 | locked |

#### Opponent Quality receipts

Raw win credit: **14.55**. Diminishing-return credit before fighter adjustment: **12.15**. Fighter adjustment: **0**. Final diminished credit: **12.15**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2016-03-05 | Valentina Shevchenko | champion-level | 1.25 | 1 | 1.25 | Elite champion-level opponent and future flyweight great. |
| 2 | 2016-07-09 | Miesha Tate | champion-level | 1.25 | 1 | 1.25 | UFC bantamweight champion. |
| 3 | 2016-12-30 | Ronda Rousey | champion-level | 1.25 | 1 | 1.25 | Former dominant UFC bantamweight champion. |
| 4 | 2018-12-29 | Cris Cyborg | champion-level | 1.25 | 1 | 1.25 | Elite UFC featherweight champion and all-time great. |
| 5 | 2019-07-06 | Holly Holm | champion-level | 1.15 | 1 | 1.15 | Former UFC bantamweight champion, slightly timing-adjusted. |
| 6 | 2017-09-09 | Valentina Shevchenko | top-five | 1 | 1 | 1 | Elite future champion, earlier UFC version. |
| 7 | 2022-07-30 | Julianna Peña | top-five | 1 | 0.75 | 0.75 | Current champion rematch win. |
| 8 | 2023-06-10 | Irene Aldana | top-five | 1 | 0.75 | 0.75 | Top-five bantamweight title challenger. |
| 9 | 2013-11-06 | Germaine de Randamie | top-ten | 0.85 | 0.75 | 0.64 | Strong ranked bantamweight contender. |
| 10 | 2015-08-08 | Sara McMann | top-ten | 0.85 | 0.75 | 0.64 | Olympic medalist and ranked contender. |
| 11 | 2018-05-12 | Raquel Pennington | top-ten | 0.85 | 0.75 | 0.64 | Ranked bantamweight title challenger. |
| 12 | 2019-12-14 | Germaine de Randamie | ranked | 0.65 | 0.75 | 0.49 | Early UFC win over future elite contender. |
| 13 | 2020-06-06 | Felicia Spencer | ranked | 0.65 | 0.5 | 0.33 | Ranked featherweight challenger. |
| 14 | 2021-03-06 | Megan Anderson | ranked | 0.65 | 0.5 | 0.33 | Featherweight challenger in thin division context. |
| 15 | 2013-08-03 | Sheila Gaff | solid | 0.45 | 0.5 | 0.23 | Approved supporting UFC win treatment. |
| 16 | 2015-03-21 | Shayna Baszler | solid | 0.45 | 0.5 | 0.23 | Name-value UFC win. |

#### Prime Dominance receipts

Prime window: **Miesha Tate → Irene Aldana**. Prime record: **12-1**. Effective samples: **12**. Sample multiplier: **100.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 8.25 | 11-1; 91.7% |
| Round control | 8.03 | 89.2%; rounds 33-4 |
| Finish pressure | 3 | 6 finishes; 50.0% |
| Elite-level validation | 6.42 | 12 elite-stage fights; 6.42 points |
| Raw prime score | 25.7 | Before sample multiplier |
| Final Prime Dominance | 25.7 | 25.7 × 1 |

#### Longevity receipts

Active elite years: **7.26**. Raw calendar months: **83**. Gap-adjusted months: **83**. Status multiplier: **1.15**. Division multiplier: **0.98**. Counted elite months: **93.54**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 2016-07-09 | 2016-12-30 | 5.72 | 5.72 | No |
| 2016-12-30 | 2017-09-09 | 8.31 | 8.31 | No |
| 2017-09-09 | 2018-05-12 | 8.05 | 8.05 | No |
| 2018-05-12 | 2018-12-29 | 7.59 | 7.59 | No |
| 2018-12-29 | 2019-07-06 | 6.21 | 6.21 | No |
| 2019-07-06 | 2019-12-14 | 5.29 | 5.29 | No |
| 2019-12-14 | 2020-06-06 | 5.75 | 5.75 | No |
| 2020-06-06 | 2021-03-06 | 8.97 | 8.97 | No |
| 2021-03-06 | 2021-12-11 | 9.2 | 9.2 | No |
| 2021-12-11 | 2022-07-30 | 7.59 | 7.59 | No |
| 2022-07-30 | 2023-06-10 | 10.35 | 10.35 | No |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **18** fights. Severity: **1.88**. Frequency: **0.63**. Prime-volume floor: **1**. Pre-division magnitude: **2.51**. Division discount: **0.0%**. Final penalty: **-2.51**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Base | Finish extra | Raw event | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2014-09-27 | Cat Zingano | pre-prime | top-five | home | Yes | Yes | -0.75 | -0.75 | -1.5 | standard rule |
| 2021-12-11 | Julianna Peña | prime | top-five | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |

#### Division-strength context

Default division key: **women-bantamweight-featherweight-0.90**. Era-ledger division multiplier: **0.98**. Division-era modifier: **-0.96**.

Tate through Aldana.

#### Key judgment calls

- **Two-division value:** bantamweight and featherweight gold drive the championship case.
- **Cyborg knockout:** one of the biggest single wins in women’s MMA history and a major UFC legacy moment.
- **Shevchenko rivalry:** direct edge over Valentina is central to the women’s GOAT separation.
- **Pena upset:** a real blemish, but the rematch win restores a lot of the damage.
- **Featherweight depth:** thin division context matters, but it does not erase the two-division value.

#### Why ranked here

Nunes ranks as the women’s #1 because her UFC resume has the cleanest separation: bantamweight title control, featherweight title value, the Cyborg knockout, the Rousey finish, Shevchenko rivalry value, and years of elite wins.

#### Why not ranked lower?

On the full app board, she does not pass the top men because this ranking keeps the men’s and women’s boards separate and does not pretend division depth is identical. Within the women’s board, she is the clear benchmark.

#### Compare-mode guidance

- **Best counterargument:** The only real argument against Nunes is the Pena upset and the fact that women’s featherweight depth was thin. It matters, but it does not erase the whole case.
- **Why this résumé can still win:** Nunes wins women’s comparisons when total title weight, two-division value, and elite-name wins are the deciding factors.

#### Final takeaway

Nunes is the women’s UFC GOAT standard: two belts, deep elite wins, violent title dominance, and direct separation over every major rival from her era.

_Ledger verified through 2026-07-13. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

### 2. Valentina Shevchenko — 98 OVR

The clean technical champion case: long flyweight reign, elite skill, strong opponent quality, and direct rivalry context behind Nunes.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| women | 79.33 | 15-3-1 | Flyweight / Bantamweight | 11 | 10.05 | 10 | 14-2-1 | 80.4% | 9.97 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 20.74 | 35 | 24.2 |
| Opponent Quality | 25.4 | 25 | 21.17 |
| Prime Dominance | 22.97 | 30 | 22.97 |
| Longevity | 26.77 | 10 | 8.92 |

Base score: **77.26**. Modifiers: Apex **+5.19**, Loss Penalty **-2.59**, Division-Era Depth **-0.53**. Final raw score: **79.33**.

OVR conversion: 25.78–80.79 board anchors, normalized score **0.973459**, curved score **0.977395**, resulting in **98 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 20.74 | #1 | 10.05 adjusted credit / 14.54 benchmark |
| Opponent Quality | 25.4 | #2 | 11.94 diminished credit / 14.1 benchmark |
| Prime Dominance | 22.97 | #2 | 22.97 raw × 100.0% sample |
| Longevity | 26.77 | #1 | 128.5 counted elite months |
| Apex | +5.19 | Modifier | Two dominant defenses inside the locked window support a stronger Best-Fighter Claim while keeping Aura below the maximum tier. |
| Loss Penalty | -2.59 | Modifier | 3 official/technical loss events reviewed |
| Division-Era Depth | -0.53 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **11**. Adjusted title wins: **10.05**. Derived undisputed-title win count: **11**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 2018-12-08 | Joanna Jedrzejczyk | vacant-undisputed | 0.9 | 1 | 0.9 | Elite vacant-title opponent; full opponent strength. |
| 2019-06-08 | Jessica Eye | normal | 1 | 0.85 | 0.85 | locked |
| 2019-08-10 | Liz Carmouche | normal | 1 | 0.85 | 0.85 | locked |
| 2020-02-08 | Katlyn Chookagian | normal | 1 | 0.9 | 0.9 | locked |
| 2020-11-21 | Jennifer Maia | normal | 1 | 0.9 | 0.9 | locked |
| 2021-04-24 | Jessica Andrade | normal | 1 | 0.95 | 0.95 | locked |
| 2021-09-25 | Lauren Murphy | normal | 1 | 0.85 | 0.85 | locked |
| 2022-06-11 | Taila Santos | normal | 1 | 0.95 | 0.95 | locked |
| 2024-09-14 | Alexa Grasso | normal | 1 | 1 | 1 | Title regain over sitting champion. |
| 2025-05-10 | Manon Fiorot | normal | 1 | 0.95 | 0.95 | locked |
| 2025-11-15 | Zhang Weili | normal | 1 | 0.95 | 0.95 | Current-table P4P champ moving up. |

#### Opponent Quality receipts

Raw win credit: **14.2**. Diminishing-return credit before fighter adjustment: **11.94**. Fighter adjustment: **0**. Final diminished credit: **11.94**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2018-12-08 | Joanna Jedrzejczyk | champion-level | 1.25 | 1 | 1.25 | Elite UFC strawweight champion moving up. |
| 2 | 2024-09-14 | Alexa Grasso | champion-level | 1.25 | 1 | 1.25 | Elite UFC flyweight champion rematch/trilogy win. |
| 3 | 2025-11-15 | Zhang Weili | champion-level | 1.25 | 1 | 1.25 | Elite reigning strawweight champion moving up. |
| 4 | 2021-04-24 | Jessica Andrade | champion-level | 1.15 | 1 | 1.15 | Former UFC strawweight champion and elite contender moving up. |
| 5 | 2016-07-23 | Holly Holm | top-five | 1 | 1 | 1 | Former UFC bantamweight champion. |
| 6 | 2019-06-08 | Jessica Eye | top-five | 1 | 1 | 1 | Top-five flyweight title challenger. |
| 7 | 2020-02-08 | Katlyn Chookagian | top-five | 1 | 0.75 | 0.75 | Top flyweight title challenger. |
| 8 | 2022-06-11 | Taila Santos | top-five | 1 | 0.75 | 0.75 | Elite flyweight title challenger; close fight context. |
| 9 | 2025-05-10 | Manon Fiorot | top-five | 1 | 0.75 | 0.75 | Top-five flyweight title challenger. |
| 10 | 2019-08-10 | Liz Carmouche | top-ten | 0.85 | 0.75 | 0.64 | Ranked flyweight title challenger and rivalry context. |
| 11 | 2020-11-21 | Jennifer Maia | top-ten | 0.85 | 0.75 | 0.64 | Ranked flyweight title challenger. |
| 12 | 2021-09-25 | Lauren Murphy | top-ten | 0.85 | 0.75 | 0.64 | Ranked flyweight title challenger. |
| 13 | 2015-12-19 | Sarah Kaufman | ranked | 0.65 | 0.5 | 0.33 | Former champion name in UFC debut context. |
| 14 | 2017-01-28 | Julianna Peña | ranked | 0.65 | 0.5 | 0.33 | Future UFC champion, earlier bantamweight version. |
| 15 | 2018-02-03 | Priscila Cachoeira | solid | 0.45 | 0.5 | 0.23 | Solid UFC flyweight win. |

#### Prime Dominance receipts

Prime window: **Holly Holm → Current title-level form**. Prime record: **14-2-1**. Effective samples: **17**. Sample multiplier: **100.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 7.68 | 14-2-1; 85.3% |
| Round control | 7.24 | 80.4%; rounds 55-13 |
| Finish pressure | 2 | 6 finishes; 35.3% |
| Elite-level validation | 6.05 | 16 elite-stage fights; 6.05 points |
| Raw prime score | 22.97 | Before sample multiplier |
| Final Prime Dominance | 22.97 | 22.97 × 1 |

#### Longevity receipts

Active elite years: **9.97**. Raw calendar months: **119.7**. Gap-adjusted months: **119.7**. Status multiplier: **1.13**. Division multiplier: **0.95**. Counted elite months: **128.5**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 2016-07-23 | 2017-01-28 | 6.21 | 6.21 | No |
| 2017-01-28 | 2017-09-09 | 7.36 | 7.36 | No |
| 2017-09-09 | 2018-02-03 | 4.83 | 4.83 | No |
| 2018-02-03 | 2018-12-08 | 10.12 | 10.12 | No |
| 2018-12-08 | 2019-06-08 | 5.98 | 5.98 | No |
| 2019-06-08 | 2019-08-10 | 2.07 | 2.07 | No |
| 2019-08-10 | 2020-02-08 | 5.98 | 5.98 | No |
| 2020-02-08 | 2020-11-21 | 9.43 | 9.43 | No |
| 2020-11-21 | 2021-04-24 | 5.06 | 5.06 | No |
| 2021-04-24 | 2021-09-25 | 5.06 | 5.06 | No |
| 2021-09-25 | 2022-06-11 | 8.51 | 8.51 | No |
| 2022-06-11 | 2023-03-04 | 8.74 | 8.74 | No |
| 2023-03-04 | 2023-09-16 | 6.44 | 6.44 | No |
| 2023-09-16 | 2024-09-14 | 11.96 | 11.96 | No |
| 2024-09-14 | 2025-05-10 | 7.82 | 7.82 | No |
| 2025-05-10 | 2025-11-15 | 6.21 | 6.21 | No |
| 2025-11-15 | 2026-07-13 | 7.89 | 7.89 | No |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **19** fights. Severity: **1.88**. Frequency: **0.71**. Prime-volume floor: **1.75**. Pre-division magnitude: **2.59**. Division discount: **0.0%**. Final penalty: **-2.59**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Base | Finish extra | Raw event | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2016-03-05 | Amanda Nunes | pre-prime | champion-level | home | No | Yes | -0.75 | 0 | -0.75 | standard rule |
| 2017-09-09 | Amanda Nunes | prime | champion-level | home | No | Yes | -1.5 | 0 | -1.5 | standard rule |
| 2023-03-04 | Alexa Grasso | prime | top-five | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |

#### Division-strength context

Default division key: **women-flyweight-0.90**. Era-ledger division multiplier: **0.95**. Division-era modifier: **-0.53**.

Holm through current title-level form.

#### Key judgment calls

- **Nunes rivalry:** central reason she trails Amanda even with elite technical dominance.
- **Flyweight reign:** the backbone of her ranking and the best women’s flyweight title case.
- **Grasso rivalry:** adds both damage and title-regain context.
- **Bantamweight context:** helps opponent quality but does not replace flyweight title value.
- **Technical dominance:** a major reason her OVR stays close to Nunes.

#### Why ranked here

Valentina ranks women’s #2 because her UFC flyweight reign was long, technical, and consistent. She also has meaningful bantamweight context, strong opponent quality, and years of title-level control.

#### Why not ranked higher?

She does not pass Nunes because Nunes owns the direct rivalry edge and the stronger two-division title case. Valentina’s flyweight reign is excellent, but Nunes has the cleaner women’s GOAT separation.

#### Compare-mode guidance

- **Best counterargument:** The argument against Valentina is Nunes. She came close, but Nunes owns the direct edge and the stronger two-division championship case.
- **Why this résumé can still win:** Valentina wins comparisons when technical dominance, long flyweight control, and active elite years outweigh bigger but shorter peak cases.

#### Final takeaway

Valentina is the women’s technical standard: long-reigning, complete, and consistent, but direct rivalry and two-division value keep Nunes ahead.

_Ledger verified through 2026-07-13. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

### 3. Zhang Weili — 92 OVR

A two-time UFC strawweight champion with six title-fight wins, a dominant second reign, elite Joanna/Andrade/Suarez proof, and Rose as the clear ceiling on the case.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| women | 56.64 | 10-3 | Strawweight / Flyweight | 6 | 5.65 | 7 | 7-3 | 66.7% | 6.87 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 11.66 | 35 | 13.6 |
| Opponent Quality | 17.98 | 25 | 14.98 |
| Prime Dominance | 19.85 | 30 | 19.85 |
| Longevity | 19.23 | 10 | 6.41 |

Base score: **54.84**. Modifiers: Apex **+4.85**, Loss Penalty **-2.92**, Division-Era Depth **-0.13**. Final raw score: **56.64**.

OVR conversion: 25.78–80.79 board anchors, normalized score **0.560989**, curved score **0.611802**, resulting in **92 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 11.66 | #3 | 5.65 adjusted credit / 14.54 benchmark |
| Opponent Quality | 17.98 | #5 | 8.45 diminished credit / 14.1 benchmark |
| Prime Dominance | 19.85 | #6 | 19.85 raw × 100.0% sample |
| Longevity | 19.23 | #4 | 92.29 counted elite months |
| Apex | +4.85 | Modifier | Lemos and Suarez capture the complete second-reign version of Zhang. The Rose losses and failed upward-division title challenge cap the clean best-fighter claim and aura. |
| Loss Penalty | -2.92 | Modifier | 3 official/technical loss events reviewed |
| Division-Era Depth | -0.13 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **6**. Adjusted title wins: **5.65**. Derived undisputed-title win count: **6**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 2019-08-31 | Jessica Andrade | normal | 1 | 1 | 1 | locked |
| 2020-03-07 | Joanna Jedrzejczyk | normal | 1 | 0.95 | 0.95 | locked |
| 2022-11-12 | Carla Esparza | normal | 1 | 0.95 | 0.95 | locked |
| 2023-08-19 | Amanda Lemos | normal | 1 | 0.9 | 0.9 | locked |
| 2024-04-13 | Yan Xiaonan | normal | 1 | 0.9 | 0.9 | locked |
| 2025-02-09 | Tatiana Suarez | normal | 1 | 0.95 | 0.95 | Cody-approved undisputed title defense over an elite challenger. |

#### Opponent Quality receipts

Raw win credit: **9.05**. Diminishing-return credit before fighter adjustment: **8.45**. Fighter adjustment: **0**. Final diminished credit: **8.45**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2019-08-31 | Jessica Andrade | champion-level | 1.25 | 1 | 1.25 | UFC strawweight champion. |
| 2 | 2020-03-07 | Joanna Jedrzejczyk | champion-level | 1.25 | 1 | 1.25 | Elite former strawweight champion in all-time title fight. |
| 3 | 2022-06-11 | Joanna Jedrzejczyk | champion-level | 1.15 | 1 | 1.15 | Repeat win over elite former champion, timing-adjusted. |
| 4 | 2023-08-19 | Amanda Lemos | top-five | 1 | 1 | 1 | Ranked strawweight title challenger. |
| 5 | 2024-04-13 | Yan Xiaonan | top-five | 1 | 1 | 1 | Top strawweight title challenger. |
| 6 | 2025-02-09 | Tatiana Suarez | top-five | 1 | 1 | 1 | Top-five strawweight title challenger. |
| 7 | 2019-03-02 | Tecia Torres | top-ten | 0.85 | 0.75 | 0.64 | Strong ranked strawweight contender. |
| 8 | 2022-11-12 | Carla Esparza | top-ten | 0.85 | 0.75 | 0.64 | Former UFC strawweight champion. |
| 9 | 2018-11-24 | Jessica Aguilar | solid | 0.45 | 0.75 | 0.34 | Veteran strawweight name, timing-adjusted. |
| 10 | 2018-08-04 | Danielle Taylor | name-value | 0.25 | 0.75 | 0.19 | Low-end UFC quality value. |

#### Prime Dominance receipts

Prime window: **Jessica Andrade → Current championship form**. Prime record: **7-3**. Effective samples: **10**. Sample multiplier: **100.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 6.3 | 7-3; 70.0% |
| Round control | 6 | 66.7%; rounds 24-12 |
| Finish pressure | 2 | 3 finishes; 30.0% |
| Elite-level validation | 5.55 | 10 elite-stage fights; 5.55 points |
| Raw prime score | 19.85 | Before sample multiplier |
| Final Prime Dominance | 19.85 | 19.85 × 1 |

#### Longevity receipts

Active elite years: **6.87**. Raw calendar months: **82.4**. Gap-adjusted months: **82.4**. Status multiplier: **1.12**. Division multiplier: **1**. Counted elite months: **92.29**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 2019-08-31 | 2020-03-07 | 6.21 | 6.21 | No |
| 2020-03-07 | 2021-04-24 | 13.57 | 13.57 | No |
| 2021-04-24 | 2021-11-06 | 6.44 | 6.44 | No |
| 2021-11-06 | 2022-06-11 | 7.13 | 7.13 | No |
| 2022-06-11 | 2022-11-12 | 5.06 | 5.06 | No |
| 2022-11-12 | 2023-08-19 | 9.2 | 9.2 | No |
| 2023-08-19 | 2024-04-13 | 7.82 | 7.82 | No |
| 2024-04-13 | 2025-02-09 | 9.92 | 9.92 | No |
| 2025-02-09 | 2025-11-15 | 9.17 | 9.17 | No |
| 2025-11-15 | 2026-07-13 | 7.89 | 7.89 | No |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **13** fights. Severity: **1.88**. Frequency: **1.04**. Prime-volume floor: **2.5**. Pre-division magnitude: **2.92**. Division discount: **0.0%**. Final penalty: **-2.92**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Base | Finish extra | Raw event | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2021-04-24 | Rose Namajunas | prime | champion-level | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2021-11-06 | Rose Namajunas | prime | champion-level | home | No | Yes | -1.5 | 0 | -1.5 | standard rule |
| 2025-11-15 | Valentina Shevchenko | prime | champion-level | upward | No | Yes | -0.75 | 0 | -0.75 | prime-upward-elite |

#### Division-strength context

Default division key: **modern-women-strawweight-0.95**. Era-ledger division multiplier: **1**. Division-era modifier: **-0.13**.

Andrade through current championship form.

#### Key judgment calls

- **Second reign:** The Esparza/Lemos/Yan/Suarez stretch is the core of her high-end ranking.
- **Joanna rivalry:** Zhang owns the UFC series 2-0, with one classic defense and one violent rematch finish.
- **Rose ceiling:** Two in-prime title losses to Rose prevent a clean top-women claim.
- **Valentina context:** The flyweight title loss hurts lightly, not like a same-division title loss.
- **Strawweight context:** Strong women’s division context, especially compared with thinner women’s title divisions.

#### Why ranked here

Zhang belongs in the elite women’s UFC tier because the title resume is serious: two strawweight reigns, six title-fight wins, four defenses, a dominant second reign, and direct wins over Joanna.

#### Why not ranked higher?

She does not pass the top women’s benchmarks because Rose beat her twice in the heart of her title years, and the Valentina challenge did not create a two-division UFC title case. The second reign is elite, but the loss column keeps the ceiling clear.

#### Compare-mode guidance

- **Best counterargument:** The counterargument is Rose. Losing the belt and the rematch in-prime prevents Zhang from claiming the cleanest women’s UFC case.
- **Why this résumé can still win:** Zhang wins comparisons when two-reign title value, strawweight dominance, and direct Joanna separation matter more than longer but less explosive resumes.

#### Final takeaway

Zhang is a high-end women’s UFC GOAT candidate: two reigns, six title-fight wins, real strawweight dominance, and enough loss context to sit below the Nunes/Valentina benchmark tier.

_Ledger verified through 2026-07-13. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

### 4. Joanna Jedrzejczyk — 91 OVR

The strawweight standard: long title control, elite striking volume, and one of the cleanest technical champion runs in women’s UFC history.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| women | 50.15 | 10-5 | Strawweight / Flyweight | 6 | 5.45 | 5 | 9-4 | 67.3% | 5.23 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 11.24 | 35 | 13.11 |
| Opponent Quality | 17.34 | 25 | 14.45 |
| Prime Dominance | 18.27 | 30 | 18.27 |
| Longevity | 13.58 | 10 | 4.53 |

Base score: **50.36**. Modifiers: Apex **+5.04**, Loss Penalty **-3.25**, Division-Era Depth **-2**. Final raw score: **50.15**.

OVR conversion: 25.78–80.79 board anchors, normalized score **0.443010**, curved score **0.500555**, resulting in **91 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 11.24 | #4 | 5.45 adjusted credit / 14.54 benchmark |
| Opponent Quality | 17.34 | #6 | 8.15 diminished credit / 14.1 benchmark |
| Prime Dominance | 18.27 | #8 | 18.27 raw × 100.0% sample |
| Longevity | 13.58 | #8 | 65.18 counted elite months |
| Apex | +5.04 | Modifier | A dominant title win and elite adversity performance establish strong Proof and a legitimate best-fighter claim. |
| Loss Penalty | -3.25 | Modifier | 5 official/technical loss events reviewed |
| Division-Era Depth | -2 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **6**. Adjusted title wins: **5.45**. Derived undisputed-title win count: **6**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 2015-03-14 | Carla Esparza | normal | 1 | 0.95 | 0.95 | locked |
| 2015-06-20 | Jessica Penne | normal | 1 | 0.85 | 0.85 | locked |
| 2015-11-14 | Valerie Letourneau | normal | 1 | 0.85 | 0.85 | locked |
| 2016-07-08 | Claudia Gadelha | normal | 1 | 0.95 | 0.95 | locked |
| 2016-11-12 | Karolina Kowalkiewicz | normal | 1 | 0.9 | 0.9 | locked |
| 2017-05-13 | Jessica Andrade | normal | 1 | 0.95 | 0.95 | locked |

#### Opponent Quality receipts

Raw win credit: **8.8**. Diminishing-return credit before fighter adjustment: **8.15**. Fighter adjustment: **0**. Final diminished credit: **8.15**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2014-12-13 | Claudia Gadelha | champion-level | 1.25 | 1 | 1.25 | Elite strawweight title challenger and defining rival. |
| 2 | 2015-03-14 | Carla Esparza | champion-level | 1.25 | 1 | 1.25 | UFC strawweight champion. |
| 3 | 2016-07-08 | Claudia Gadelha | top-five | 1 | 1 | 1 | Elite strawweight contender, close first fight context. |
| 4 | 2017-05-13 | Jessica Andrade | top-five | 1 | 1 | 1 | Elite strawweight title challenger and future champion. |
| 5 | 2016-11-12 | Karolina Kowalkiewicz | top-ten | 0.85 | 1 | 0.85 | Strong strawweight title challenger. |
| 6 | 2018-07-28 | Tecia Torres | top-ten | 0.85 | 1 | 0.85 | Strong ranked strawweight contender. |
| 7 | 2019-10-12 | Michelle Waterson | top-ten | 0.85 | 0.75 | 0.64 | Ranked strawweight contender. |
| 8 | 2015-06-20 | Jessica Penne | ranked | 0.65 | 0.75 | 0.49 | Ranked title challenger in early strawweight era. |
| 9 | 2015-11-14 | Valerie Letourneau | ranked | 0.65 | 0.75 | 0.49 | Ranked title challenger. |
| 10 | 2014-07-26 | Juliana Lima | solid | 0.45 | 0.75 | 0.34 | Approved supporting UFC win treatment. |

#### Prime Dominance receipts

Prime window: **Carla Esparza → Zhang Weili I**. Prime record: **9-4**. Effective samples: **12**. Sample multiplier: **100.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 6 | 8-4; 66.7% |
| Round control | 6.06 | 67.3%; rounds 33-16 |
| Finish pressure | 1 | 2 finishes; 16.7% |
| Elite-level validation | 5.21 | 10 elite-stage fights; 5.21 points |
| Raw prime score | 18.27 | Before sample multiplier |
| Final Prime Dominance | 18.27 | 18.27 × 1 |

#### Longevity receipts

Active elite years: **5.23**. Raw calendar months: **59.8**. Gap-adjusted months: **59.8**. Status multiplier: **1.09**. Division multiplier: **1**. Counted elite months: **65.18**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 2015-03-14 | 2015-06-20 | 3.22 | 3.22 | No |
| 2015-06-20 | 2015-11-14 | 4.83 | 4.83 | No |
| 2015-11-14 | 2016-07-08 | 7.79 | 7.79 | No |
| 2016-07-08 | 2016-11-12 | 4.17 | 4.17 | No |
| 2016-11-12 | 2017-05-13 | 5.98 | 5.98 | No |
| 2017-05-13 | 2017-11-04 | 5.75 | 5.75 | No |
| 2017-11-04 | 2018-04-07 | 5.06 | 5.06 | No |
| 2018-04-07 | 2018-07-28 | 3.68 | 3.68 | No |
| 2018-07-28 | 2018-12-08 | 4.37 | 4.37 | No |
| 2018-12-08 | 2019-10-12 | 10.12 | 10.12 | No |
| 2019-10-12 | 2020-03-07 | 4.83 | 4.83 | No |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **14** fights. Severity: **1.88**. Frequency: **1.29**. Prime-volume floor: **3.25**. Pre-division magnitude: **3.25**. Division discount: **0.0%**. Final penalty: **-3.25**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Base | Finish extra | Raw event | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2017-11-04 | Rose Namajunas | prime | champion-level | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2018-04-07 | Rose Namajunas | prime | champion-level | home | No | Yes | -1.5 | 0 | -1.5 | standard rule |
| 2018-12-08 | Valentina Shevchenko | prime | champion-level | upward | No | Yes | -0.75 | 0 | -0.75 | prime-upward-elite |
| 2020-03-07 | Zhang Weili | prime | champion-level | home | No | Yes | -1.5 | 0 | -1.5 | standard rule |
| 2022-06-11 | Zhang Weili | post-prime | champion-level | home | Yes | Yes | 0 | 0 | 0 | standard rule |

#### Division-strength context

Default division key: **women-strawweight-0.92**. Era-ledger division multiplier: **1**. Division-era modifier: **-2**.

Esparza through Zhang I.

#### Key judgment calls

- **Strawweight title reign:** the center of her all-time case.
- **Technical striking:** a major part of the prime-dominance score.
- **Rose losses:** real championship drag and the turning point of the reign.
- **Zhang fights:** add high-level context but also back-end damage.
- **Division impact:** she helped define what elite UFC strawweight looked like.

#### Why ranked here

Joanna ranks women’s #3 because her strawweight reign was historically important and technically dominant. Her title defenses, pace, takedown defense, and striking output made her the early standard for the division.

#### Why not ranked higher?

She does not pass Nunes or Valentina because she has less two-division value, less total title-fight separation, and the Rose/Zhang stretch damaged the back end of the case.

#### Compare-mode guidance

- **Best counterargument:** Joanna’s argument is divisional standard-setting. She may not have two-division value, but she built the strawweight benchmark.
- **Why this résumé can still win:** Joanna wins comparisons when strawweight title control, technical dominance, and division-defining impact matter most.

#### Final takeaway

Joanna is the strawweight title standard: technically brilliant, historically important, and clearly women’s top-three in this ranking, but capped below the two deeper GOAT cases.

_Ledger verified through 2026-07-13. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

### 5. Rose Namajunas — 90 OVR

A volatile but elite UFC-only case: two strawweight reigns, four title-fight wins, Joanna twice, Zhang twice, and a 6-2 prime capped by Andrade and Esparza damage.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| women | 49.13 | 12-7 | Strawweight / Flyweight | 4 | 3.9 | 5 | 5-2 | 59.1% | 4.5 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 8.05 | 35 | 9.39 |
| Opponent Quality | 20.27 | 25 | 16.89 |
| Prime Dominance | 17.84 | 30 | 17.84 |
| Longevity | 12.15 | 10 | 4.05 |

Base score: **48.17**. Modifiers: Apex **+5.08**, Loss Penalty **-3.38**, Division-Era Depth **-0.74**. Final raw score: **49.13**.

OVR conversion: 25.78–80.79 board anchors, normalized score **0.424468**, curved score **0.482690**, resulting in **90 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 8.05 | #6 | 3.9 adjusted credit / 14.54 benchmark |
| Opponent Quality | 20.27 | #4 | 9.53 diminished credit / 14.1 benchmark |
| Prime Dominance | 17.84 | #9 | 17.84 raw × 100.0% sample |
| Longevity | 12.15 | #9 | 58.32 counted elite months |
| Apex | +5.08 | Modifier | Back-to-back wins over an all-time champion provide exceptional Proof; later inconsistency limits Claim and Aura. |
| Loss Penalty | -3.38 | Modifier | 7 official/technical loss events reviewed |
| Division-Era Depth | -0.74 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **4**. Adjusted title wins: **3.9**. Derived undisputed-title win count: **4**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 2017-11-04 | Joanna Jedrzejczyk | normal | 1 | 1 | 1 | locked |
| 2018-04-07 | Joanna Jedrzejczyk | normal | 1 | 0.95 | 0.95 | locked |
| 2021-04-24 | Zhang Weili | normal | 1 | 1 | 1 | locked |
| 2021-11-06 | Zhang Weili | normal | 1 | 0.95 | 0.95 | locked |

#### Opponent Quality receipts

Raw win credit: **10.5**. Diminishing-return credit before fighter adjustment: **9.53**. Fighter adjustment: **0**. Final diminished credit: **9.53**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2017-11-04 | Joanna Jedrzejczyk | champion-level | 1.25 | 1 | 1.25 | Elite UFC strawweight champion. |
| 2 | 2018-04-07 | Joanna Jedrzejczyk | champion-level | 1.25 | 1 | 1.25 | Immediate repeat over elite champion-level opponent. |
| 3 | 2021-04-24 | Zhang Weili | champion-level | 1.25 | 1 | 1.25 | Elite UFC strawweight champion. |
| 4 | 2020-07-12 | Jessica Andrade | top-five | 1 | 1 | 1 | Former UFC strawweight champion rematch win. |
| 5 | 2021-11-06 | Zhang Weili | top-five | 1 | 1 | 1 | Elite champion-level rematch win, close-fight context. |
| 6 | 2015-12-10 | Paige VanZant | top-ten | 0.85 | 1 | 0.85 | Ranked strawweight contender at the time. |
| 7 | 2024-07-13 | Tracy Cortez | top-ten | 0.85 | 0.75 | 0.64 | Strong ranked flyweight win. |
| 8 | 2025-06-14 | Miranda Maverick | top-ten | 0.85 | 0.75 | 0.64 | Strong ranked flyweight win. |
| 9 | 2016-04-16 | Tecia Torres | ranked | 0.65 | 0.75 | 0.49 | Quality strawweight contender. |
| 10 | 2017-04-15 | Michelle Waterson | ranked | 0.65 | 0.75 | 0.49 | Quality strawweight contender. |
| 11 | 2015-10-03 | Angela Hill | solid | 0.45 | 0.75 | 0.34 | Solid UFC strawweight win. |
| 12 | 2024-03-23 | Amanda Ribas | solid | 0.45 | 0.75 | 0.34 | Solid flyweight/strawweight name, timing context. |

#### Prime Dominance receipts

Prime window: **Joanna Jedrzejczyk I → Carla Esparza II**. Prime record: **5-2**. Effective samples: **7**. Sample multiplier: **100.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 6.43 | 5-2; 71.4% |
| Round control | 5.32 | 59.1%; rounds 13-9 |
| Finish pressure | 1 | 2 finishes; 28.6% |
| Elite-level validation | 5.09 | 7 elite-stage fights; 5.09 points |
| Raw prime score | 17.84 | Before sample multiplier |
| Final Prime Dominance | 17.84 | 17.84 × 1 |

#### Longevity receipts

Active elite years: **4.5**. Raw calendar months: **54**. Gap-adjusted months: **54**. Status multiplier: **1.08**. Division multiplier: **1**. Counted elite months: **58.32**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 2017-11-04 | 2018-04-07 | 5.06 | 5.06 | No |
| 2018-04-07 | 2019-05-11 | 13.11 | 13.11 | No |
| 2019-05-11 | 2020-07-12 | 14.06 | 14.06 | No |
| 2020-07-12 | 2021-04-24 | 9.4 | 9.4 | No |
| 2021-04-24 | 2021-11-06 | 6.44 | 6.44 | No |
| 2021-11-06 | 2022-05-07 | 5.98 | 5.98 | No |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **13** fights. Severity: **1.88**. Frequency: **1.5**. Prime-volume floor: **1.75**. Pre-division magnitude: **3.38**. Division discount: **0.0%**. Final penalty: **-3.38**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Base | Finish extra | Raw event | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2014-12-12 | Carla Esparza | pre-prime | top-five | home | Yes | Yes | -0.75 | -0.75 | -1.5 | standard rule |
| 2016-07-30 | Karolina Kowalkiewicz | pre-prime | top-ten | home | No | Yes | -1.25 | 0 | -1.25 | standard rule |
| 2019-05-11 | Jessica Andrade | prime | top-five | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2022-05-07 | Carla Esparza | prime | top-five | home | No | Yes | -1.5 | 0 | -1.5 | standard rule |
| 2023-09-02 | Manon Fiorot | post-prime | top-five | home | No | Yes | 0 | 0 | 0 | standard rule |
| 2024-11-02 | Erin Blanchfield | post-prime | top-five | home | No | Yes | 0 | 0 | 0 | standard rule |
| 2026-01-24 | Natalia Silva | post-prime | top-five | home | No | Yes | 0 | 0 | 0 | standard rule |

#### Division-strength context

Default division key: **women-strawweight-0.95**. Era-ledger division multiplier: **1**. Division-era modifier: **-0.74**.

Joanna I through Carla II. Andrade was recovered; Carla closes window.

#### Key judgment calls

- **Prime cutoff:** Esparza II ends the prime-loss window.
- **Flyweight phase:** Counts for longevity/relevance, not prime-loss damage.
- **Head-to-head value:** Wins over Joanna and Zhang carry major Quality Wins and Apex value.
- **Volatility:** Rose gets huge peak value, but short reigns and bad-looking title losses matter.
- **Strawweight context:** Modern strawweight is treated as a strong women’s UFC division.

#### Why ranked here

Rose belongs in the high-end women’s UFC champion tier because the quality wins are enormous: Joanna twice, Zhang twice, Andrade, and two separate strawweight title wins.

#### Why not ranked higher?

The case is capped by short title reigns and volatility. Four title-fight wins is strong, but not Amanda, Valentina, or Zhang title volume, and the Andrade finish plus Esparza rematch loss keep the prime from looking clean.

#### Compare-mode guidance

- **Best counterargument:** The counterargument is consistency: short reigns, the Andrade finish, the Esparza rematch, and several post-prime flyweight losses.
- **Why this résumé can still win:** Rose wins comparisons when elite-win quality and head-to-head strawweight proof matter more than clean long-reign control.

#### Final takeaway

Rose is one of the highest-variance women’s UFC GOAT cases: legendary quality wins and real title moments, balanced by short reigns and meaningful prime losses.

_Ledger verified through 2026-07-13. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

### 6. Ronda Rousey — 89 OVR

The original women’s UFC superstar case: historic bantamweight title dominance, instant finishes, mainstream impact, and a sharp ending that caps the score.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| women | 45.49 | 6-2 | Bantamweight | 6 | 5.25 | 4 | 6-2 | 72.7% | 3.85 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 10.83 | 35 | 12.63 |
| Opponent Quality | 11.06 | 25 | 9.22 |
| Prime Dominance | 22.2 | 30 | 22.2 |
| Longevity | 8.22 | 10 | 2.74 |

Base score: **46.79**. Modifiers: Apex **+5.2**, Loss Penalty **-3.94**, Division-Era Depth **-2.57**. Final raw score: **45.49**.

OVR conversion: 25.78–80.79 board anchors, normalized score **0.358298**, curved score **0.417935**, resulting in **89 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 10.83 | #5 | 5.25 adjusted credit / 14.54 benchmark |
| Opponent Quality | 11.06 | #11 | 5.2 diminished credit / 14.1 benchmark |
| Prime Dominance | 22.2 | #4 | 22.2 raw × 100.0% sample |
| Longevity | 8.22 | #12 | 39.44 counted elite months |
| Apex | +5.2 | Modifier | Historic women’s bantamweight aura apex. |
| Loss Penalty | -3.94 | Modifier | 2 official/technical loss events reviewed |
| Division-Era Depth | -2.57 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **6**. Adjusted title wins: **5.25**. Derived undisputed-title win count: **6**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 2013-02-23 | Liz Carmouche | normal | 1 | 0.85 | 0.85 | locked |
| 2013-12-28 | Miesha Tate | normal | 1 | 0.9 | 0.9 | locked |
| 2014-02-22 | Sara McMann | normal | 1 | 0.9 | 0.9 | locked |
| 2014-07-05 | Alexis Davis | normal | 1 | 0.9 | 0.9 | locked |
| 2015-02-28 | Cat Zingano | normal | 1 | 0.95 | 0.95 | locked |
| 2015-08-01 | Bethe Correia | normal | 1 | 0.75 | 0.75 | Clearly soft title opponent floor. |

#### Opponent Quality receipts

Raw win credit: **5.2**. Diminishing-return credit before fighter adjustment: **5.2**. Fighter adjustment: **0**. Final diminished credit: **5.2**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2013-12-28 | Miesha Tate | top-five | 1 | 1 | 1 | Elite bantamweight rival and future UFC champion. |
| 2 | 2014-02-22 | Sara McMann | top-five | 1 | 1 | 1 | Olympic medalist and top bantamweight title challenger. |
| 3 | 2013-02-23 | Liz Carmouche | top-ten | 0.85 | 1 | 0.85 | Ranked inaugural UFC bantamweight title challenger. |
| 4 | 2014-07-05 | Alexis Davis | top-ten | 0.85 | 1 | 0.85 | Ranked bantamweight title challenger. |
| 5 | 2015-02-28 | Cat Zingano | top-ten | 0.85 | 1 | 0.85 | Undefeated top bantamweight contender. |
| 6 | 2015-08-01 | Bethe Correia | ranked | 0.65 | 1 | 0.65 | Undefeated title challenger, softer contender context. |

#### Prime Dominance receipts

Prime window: **Miesha Tate II → Amanda Nunes**. Prime record: **6-2**. Effective samples: **7**. Sample multiplier: **100.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 6.43 | 5-2; 71.4% |
| Round control | 6.3 | 70.0%; rounds 7-3 |
| Finish pressure | 4 | 5 finishes; 71.4% |
| Elite-level validation | 5.47 | 7 elite-stage fights; 5.47 points |
| Raw prime score | 22.2 | Before sample multiplier |
| Final Prime Dominance | 22.2 | 22.2 × 1 |

#### Longevity receipts

Active elite years: **3.85**. Raw calendar months: **36.1**. Gap-adjusted months: **36.1**. Status multiplier: **1.15**. Division multiplier: **0.95**. Counted elite months: **39.44**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 2013-12-28 | 2014-02-22 | 1.84 | 1.84 | No |
| 2014-02-22 | 2014-07-05 | 4.37 | 4.37 | No |
| 2014-07-05 | 2015-02-28 | 7.82 | 7.82 | No |
| 2015-02-28 | 2015-08-01 | 5.06 | 5.06 | No |
| 2015-08-01 | 2015-11-15 | 3.48 | 3.48 | No |
| 2015-11-15 | 2016-12-30 | 13.5 | 13.5 | No |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **8** fights. Severity: **2.25**. Frequency: **1.69**. Prime-volume floor: **2**. Pre-division magnitude: **3.94**. Division discount: **0.0%**. Final penalty: **-3.94**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Base | Finish extra | Raw event | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2015-11-15 | Holly Holm | prime | champion-level | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2016-12-30 | Amanda Nunes | prime | champion-level | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |

#### Division-strength context

Default division key: **early-women-bantamweight-0.80**. Era-ledger division multiplier: **0.95**. Division-era modifier: **-2.57**.

Tate II through Nunes.

#### Key judgment calls

- **Era impact:** huge context, but the scoring still stays UFC-resume based.
- **Title-fight volume:** strong for a short UFC run.
- **Finish dominance:** central to the prime-dominance score.
- **Holm/Nunes losses:** major drag because they ended the reign and aura decisively.
- **Short window:** keeps longevity below Nunes, Valentina, and Joanna.

#### Why ranked here

Rousey ranks women’s #4 because her UFC peak mattered enormously. She was the original women’s UFC champion, defended repeatedly, and finished fights in a way that made her feel almost inevitable during the early run.

#### Why not ranked higher?

She does not rank higher because the run was short and the ending was severe. The Holm and Nunes losses damaged the aura, and the later women’s champions built deeper UFC resumes.

#### Compare-mode guidance

- **Best counterargument:** Rousey’s argument is impact and dominance. Nobody on the women’s board changed the UFC faster, but the resume depth is not Nunes or Valentina level.
- **Why this résumé can still win:** Rousey wins comparisons when historic impact, title-finishing dominance, and short-peak aura outweigh long-term resume depth.

#### Final takeaway

Rousey is the original women’s UFC force: historically massive, brutally dominant for a short window, and held back by a short run with a rough finish.

_Ledger verified through 2026-07-13. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

### 7. Jessica Andrade — 89 OVR

A former UFC strawweight champion with elite volume, real cross-division wins, and a messy but undeniable UFC-only résumé.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| women | 43.78 | 17-13 | Strawweight / Flyweight | 1 | 0.95 | 7 | 6-4 | 52.9% | 4.45 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 1.96 | 35 | 2.29 |
| Opponent Quality | 22.45 | 25 | 18.71 |
| Prime Dominance | 18.56 | 30 | 18.56 |
| Longevity | 13.65 | 10 | 4.55 |

Base score: **44.11**. Modifiers: Apex **+4.1**, Loss Penalty **-4.08**, Division-Era Depth **-0.35**. Final raw score: **43.78**.

OVR conversion: 25.78–80.79 board anchors, normalized score **0.327213**, curved score **0.386907**, resulting in **89 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 1.96 | #13 | 0.95 adjusted credit / 14.54 benchmark |
| Opponent Quality | 22.45 | #3 | 10.55 diminished credit / 14.1 benchmark |
| Prime Dominance | 18.56 | #7 | 18.56 raw × 100.0% sample |
| Longevity | 13.65 | #7 | 65.54 counted elite months |
| Apex | +4.1 | Modifier | Multi-division power apex with Claudia/Rose proof. |
| Loss Penalty | -4.08 | Modifier | 13 official/technical loss events reviewed |
| Division-Era Depth | -0.35 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **1**. Adjusted title wins: **0.95**. Derived undisputed-title win count: **1**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 2019-05-11 | Rose Namajunas | normal | 1 | 0.95 | 0.95 | locked |

#### Opponent Quality receipts

Raw win credit: **12.95**. Diminishing-return credit before fighter adjustment: **10.55**. Fighter adjustment: **0**. Final diminished credit: **10.55**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2019-05-11 | Rose Namajunas | champion-level | 1.25 | 1 | 1.25 | UFC strawweight champion and elite title opponent. |
| 2 | 2017-09-23 | Claudia Gadelha | top-five | 1 | 1 | 1 | Elite strawweight contender. |
| 3 | 2022-04-23 | Amanda Lemos | top-five | 1 | 1 | 1 | Elite strawweight contender. |
| 4 | 2014-03-15 | Raquel Pennington | top-ten | 0.85 | 1 | 0.85 | Strong ranked bantamweight win. |
| 5 | 2016-09-10 | Joanne Calderwood | top-ten | 0.85 | 1 | 0.85 | Strong ranked flyweight win. |
| 6 | 2018-09-08 | Karolina Kowalkiewicz | top-ten | 0.85 | 1 | 0.85 | Former strawweight title challenger. |
| 7 | 2020-10-18 | Katlyn Chookagian | top-ten | 0.85 | 0.75 | 0.64 | Ranked flyweight contender. |
| 8 | 2021-09-25 | Cynthia Calvillo | top-ten | 0.85 | 0.75 | 0.64 | Strong ranked flyweight win. |
| 9 | 2023-11-11 | Mackenzie Dern | top-ten | 0.85 | 0.75 | 0.64 | Strong ranked strawweight contender. |
| 10 | 2024-04-13 | Marina Rodriguez | top-ten | 0.85 | 0.75 | 0.64 | Strong ranked strawweight contender. |
| 11 | 2017-02-04 | Angela Hill | ranked | 0.65 | 0.75 | 0.49 | Quality strawweight veteran. |
| 12 | 2018-02-24 | Tecia Torres | ranked | 0.65 | 0.75 | 0.49 | Quality strawweight contender. |
| 13 | 2023-01-21 | Lauren Murphy | ranked | 0.65 | 0.5 | 0.33 | Ranked flyweight veteran. |
| 14 | 2013-10-26 | Rosi Sexton | solid | 0.45 | 0.5 | 0.23 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 15 | 2014-09-13 | Larissa Pacheco | solid | 0.45 | 0.5 | 0.23 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 16 | 2015-07-15 | Sarah Moras | solid | 0.45 | 0.5 | 0.23 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 17 | 2016-06-04 | Jessica Penne | solid | 0.45 | 0.5 | 0.23 | Former title challenger, timing-adjusted. |

#### Prime Dominance receipts

Prime window: **Claudia Gadelha → Erin Blanchfield**. Prime record: **6-4**. Effective samples: **12**. Sample multiplier: **100.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 6 | 8-4; 66.7% |
| Round control | 5.48 | 60.9%; rounds 14-9 |
| Finish pressure | 2 | 5 finishes; 41.7% |
| Elite-level validation | 5.08 | 9 elite-stage fights; 5.08 points |
| Raw prime score | 18.56 | Before sample multiplier |
| Final Prime Dominance | 18.56 | 18.56 × 1 |

#### Longevity receipts

Active elite years: **4.45**. Raw calendar months: **64.9**. Gap-adjusted months: **64.9**. Status multiplier: **1.02**. Division multiplier: **0.99**. Counted elite months: **65.54**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 2017-09-23 | 2018-02-24 | 5.06 | 5.06 | No |
| 2018-02-24 | 2018-09-08 | 6.44 | 6.44 | No |
| 2018-09-08 | 2019-05-11 | 8.05 | 8.05 | No |
| 2019-05-11 | 2019-08-31 | 3.68 | 3.68 | No |
| 2019-08-31 | 2020-07-12 | 10.38 | 10.38 | No |
| 2020-07-12 | 2020-10-18 | 3.22 | 3.22 | No |
| 2020-10-18 | 2021-04-24 | 6.18 | 6.18 | No |
| 2021-04-24 | 2021-09-25 | 5.06 | 5.06 | No |
| 2021-09-25 | 2022-04-23 | 6.9 | 6.9 | No |
| 2022-04-23 | 2023-01-21 | 8.97 | 8.97 | No |
| 2023-01-21 | 2023-02-18 | 0.92 | 0.92 | No |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **23** fights. Severity: **2.25**. Frequency: **1.83**. Prime-volume floor: **3.75**. Pre-division magnitude: **4.08**. Division discount: **0.0%**. Final penalty: **-4.08**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Base | Finish extra | Raw event | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2013-07-27 | Liz Carmouche | pre-prime | top-ten | home | Yes | Yes | -1.25 | -0.75 | -2 | standard rule |
| 2015-02-22 | Marion Reneau | pre-prime | top-ten | home | Yes | Yes | -1.25 | -0.75 | -2 | standard rule |
| 2015-09-05 | Raquel Pennington | pre-prime | top-ten | home | Yes | Yes | -1.25 | -0.75 | -2 | standard rule |
| 2017-05-13 | Joanna Jedrzejczyk | pre-prime | champion-level | home | No | Yes | -0.75 | 0 | -0.75 | standard rule |
| 2019-08-31 | Zhang Weili | prime | champion-level | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2020-07-12 | Rose Namajunas | prime | champion-level | home | No | Yes | -1.5 | 0 | -1.5 | standard rule |
| 2021-04-24 | Valentina Shevchenko | prime | champion-level | upward | Yes | Yes | -0.75 | -0.5 | -1.25 | prime-upward-elite |
| 2023-02-18 | Erin Blanchfield | prime | top-five | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2023-05-06 | Yan Xiaonan | post-prime | top-five | home | Yes | Yes | 0 | 0 | 0 | standard rule |
| 2023-08-05 | Tatiana Suarez | post-prime | top-five | home | Yes | Yes | 0 | 0 | 0 | standard rule |
| 2024-09-07 | Natalia Silva | post-prime | top-five | home | No | Yes | 0 | 0 | 0 | standard rule |
| 2025-05-10 | Jasmine Jasudavicius | post-prime | top-ten | home | Yes | Yes | 0 | 0 | 0 | standard rule |
| 2025-08-16 | Loopy Godinez | post-prime | top-ten | home | No | Yes | 0 | 0 | 0 | standard rule |

#### Division-strength context

Default division key: **women-three-division-0.92**. Era-ledger division multiplier: **0.99**. Division-era modifier: **-0.35**.

Claudia through Blanchfield.

#### Key judgment calls

- **Volume vs cleanliness:** The app rewards the huge UFC win ledger without pretending the record is clean.
- **No defenses:** This keeps Championship from climbing higher.
- **Late losses:** Some late chaos is softened as decline, not full-prime collapse.

#### Why ranked here

Andrade belongs high in this women’s champion tier because she has real UFC title value, the strongest win volume in this batch, and quality names across 115 and 125.

#### Why not ranked higher?

She does not rank higher because she never defended the belt, lost several title/elite fights, and the late record is messy.

#### Compare-mode guidance

- **Best counterargument:** The counter is no defenses and too many losses.
- **Why this résumé can still win:** Andrade wins comparisons when volume, finish danger, and cross-division résumé matter.

#### Final takeaway

Andrade is not a clean champion case, but she is absolutely a needed women’s UFC GOAT-board add.

_Ledger verified through 2026-07-13. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

### 8. Cris Cyborg — 87 OVR

A terrifying short-run featherweight champion who went 5-1 in the UFC, won three title fights, and finished four opponents before Amanda Nunes ended the reign.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| women | 39.03 | 5-1 | Featherweight / Catchweight | 3 | 2.33 | 1 | 5-1 | 84.6% | 2.63 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 4.8 | 35 | 5.6 |
| Opponent Quality | 9.04 | 25 | 7.53 |
| Prime Dominance | 22.39 | 30 | 22.39 |
| Longevity | 6.86 | 10 | 2.29 |

Base score: **37.81**. Modifiers: Apex **+4.6**, Loss Penalty **-3.38**, Division-Era Depth **0**. Final raw score: **39.03**.

OVR conversion: 25.78–80.79 board anchors, normalized score **0.240865**, curved score **0.298200**, resulting in **87 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 4.8 | #7 | 2.33 adjusted credit / 14.54 benchmark |
| Opponent Quality | 9.04 | #14 | 4.25 diminished credit / 14.1 benchmark |
| Prime Dominance | 22.39 | #3 | 23.57 raw × 95.0% sample |
| Longevity | 6.86 | #13 | 32.92 counted elite months |
| Apex | +4.6 | Modifier | Champion aura and proof, capped by division depth and only one elite UFC opponent. |
| Loss Penalty | -3.38 | Modifier | 1 official/technical loss events reviewed |
| Division-Era Depth | 0 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **3**. Adjusted title wins: **2.33**. Derived undisputed-title win count: **3**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 2017-07-29 | Tonya Evinger | vacant-undisputed | 0.9 | 0.83 | 0.75 | Approved aggregate Championship score recovered from the live control; exact historical per-fight split was not stored. |
| 2017-12-30 | Holly Holm | normal | 1 | 0.9 | 0.9 | Approved aggregate Championship score recovered from the live control; exact historical per-fight split was not stored. |
| 2018-03-03 | Yana Kunitskaya | normal | 1 | 0.68 | 0.68 | Approved aggregate Championship score recovered from the live control; exact historical per-fight split was not stored. |

#### Opponent Quality receipts

Raw win credit: **4.25**. Diminishing-return credit before fighter adjustment: **4.25**. Fighter adjustment: **0**. Final diminished credit: **4.25**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2017-12-30 | Holly Holm | champion-level | 1.25 | 1 | 1.25 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 2 | 2016-05-14 | Leslie Smith | top-ten | 0.85 | 1 | 0.85 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 3 | 2017-07-29 | Tonya Evinger | top-ten | 0.85 | 1 | 0.85 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 4 | 2018-03-03 | Yana Kunitskaya | top-ten | 0.85 | 1 | 0.85 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 5 | 2016-09-24 | Lina Lansberg | solid | 0.45 | 1 | 0.45 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |

#### Prime Dominance receipts

Prime window: **Leslie Smith → Amanda Nunes**. Prime record: **5-1**. Effective samples: **6**. Sample multiplier: **95.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 7.5 | 5-1; 83.3% |
| Round control | 7.62 | 84.6%; rounds 11-2 |
| Finish pressure | 4 | 4 finishes; 66.7% |
| Elite-level validation | 4.45 | 4 elite-stage fights; 4.45 points |
| Raw prime score | 23.57 | Before sample multiplier |
| Final Prime Dominance | 22.39 | 23.57 × 0.95 |

#### Longevity receipts

Active elite years: **2.63**. Raw calendar months: **31.5**. Gap-adjusted months: **31.5**. Status multiplier: **1.1**. Division multiplier: **0.95**. Counted elite months: **32.92**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 2016-05-14 | 2016-09-24 | 4.37 | 4.37 | No |
| 2016-09-24 | 2017-07-29 | 10.12 | 10.12 | No |
| 2017-07-29 | 2017-12-30 | 5.06 | 5.06 | No |
| 2017-12-30 | 2018-03-03 | 2.07 | 2.07 | No |
| 2018-03-03 | 2018-12-29 | 9.89 | 9.89 | No |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **6** fights. Severity: **2.25**. Frequency: **1.13**. Prime-volume floor: **1**. Pre-division magnitude: **3.38**. Division discount: **0.0%**. Final penalty: **-3.38**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Base | Finish extra | Raw event | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2018-12-29 | Amanda Nunes | prime | champion-level | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |

#### Division-strength context

Default division key: **women-featherweight-0.80**. Era-ledger division multiplier: **0.95**. Division-era modifier: **0**.

Smith through Nunes.

#### Key judgment calls

- **Prime window:** Leslie Smith → Amanda Nunes.
- **Coverage:** Complete UFC-only ledger through 2018-12-29. Strikeforce, Invicta, Bellator, PFL, and other non-UFC fights excluded.
- **Prime endpoint:** Nunes is the unrecovered UFC prime-ending title loss.

#### Why ranked here

Cyborg ranks here because her UFC sample was brief but clearly championship-level. She won the featherweight belt, defeated Holly Holm over five rounds, defended again against Yana Kunitskaya, finished four of her five UFC victories, and won nearly 85% of her tracked rounds during the run.

#### Why not ranked higher?

She does not rank higher because this is a UFC-only list, so the long Strikeforce and Invicta portions of her legacy are excluded. Her UFC résumé contains only six fights, roughly 2.6 active elite years, and one Top-5 win. The Amanda Nunes knockout is also a decisive prime title-loss finish that sharply limits an otherwise dominant sample.

#### Final takeaway

Cyborg ranks here because her UFC sample was brief but clearly championship-level. She won the featherweight belt, defeated Holly Holm over five rounds, defended again against Yana Kunitskaya, finished four of her five UFC victories, and won nearly 85% of her tracked rounds during the run.

_Ledger verified through 2026-07-13. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

### 9. Carla Esparza — 87 OVR

A two-time UFC strawweight champion whose résumé is stronger than the eye test, built around beating Rose twice and a strong second title climb.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| women | 37.64 | 10-6 | Strawweight | 2 | 1.66 | 5 | 6-1 | 61.9% | 3.55 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 3.43 | 35 | 4 |
| Opponent Quality | 15.85 | 25 | 13.21 |
| Prime Dominance | 16.58 | 30 | 16.58 |
| Longevity | 20.19 | 10 | 6.73 |

Base score: **40.52**. Modifiers: Apex **+3.92**, Loss Penalty **-5.58**, Division-Era Depth **-1.22**. Final raw score: **37.64**.

OVR conversion: 25.78–80.79 board anchors, normalized score **0.215597**, curved score **0.271392**, resulting in **87 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 3.43 | #9 | 1.66 adjusted credit / 14.54 benchmark |
| Opponent Quality | 15.85 | #7 | 7.45 diminished credit / 14.1 benchmark |
| Prime Dominance | 16.58 | #11 | 16.58 raw × 100.0% sample |
| Longevity | 20.19 | #2 | 96.9 counted elite months |
| Apex | +3.92 | Modifier | A late-career elite finish and championship upset form a compliant Apex, with the low-action title win limiting performance strength and Aura. |
| Loss Penalty | -5.58 | Modifier | 6 official/technical loss events reviewed |
| Division-Era Depth | -1.22 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **2**. Adjusted title wins: **1.66**. Derived undisputed-title win count: **2**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 2014-12-12 | Rose Namajunas | vacant-undisputed | 0.9 | 0.9 | 0.81 | locked |
| 2022-05-07 | Rose Namajunas | normal | 1 | 0.85 | 0.85 | Low-output/weird title win context. |

#### Opponent Quality receipts

Raw win credit: **8**. Diminishing-return credit before fighter adjustment: **7.45**. Fighter adjustment: **0**. Final diminished credit: **7.45**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2014-12-12 | Rose Namajunas | champion-level | 1.25 | 1 | 1.25 | Elite UFC strawweight champion. |
| 2 | 2020-07-26 | Marina Rodriguez | top-five | 1 | 1 | 1 | Top-five strawweight contender. |
| 3 | 2022-05-07 | Rose Namajunas | top-five | 1 | 1 | 1 | Future champion in inaugural title context. |
| 4 | 2017-12-30 | Cynthia Calvillo | top-ten | 0.85 | 1 | 0.85 | Strong ranked strawweight win. |
| 5 | 2020-05-09 | Michelle Waterson | top-ten | 0.85 | 1 | 0.85 | Strong ranked strawweight contender. |
| 6 | 2021-05-22 | Yan Xiaonan | top-ten | 0.85 | 1 | 0.85 | Strong ranked strawweight contender. |
| 7 | 2019-04-27 | Virna Jandiroba | ranked | 0.65 | 0.75 | 0.49 | Quality strawweight contender. |
| 8 | 2019-09-21 | Alexa Grasso | ranked | 0.65 | 0.75 | 0.49 | Early win over future champion. |
| 9 | 2016-04-23 | Juliana Lima | solid | 0.45 | 0.75 | 0.34 | Approved supporting UFC win treatment. |
| 10 | 2017-06-25 | Maryna Moroz | solid | 0.45 | 0.75 | 0.34 | Approved supporting UFC win treatment. |

#### Prime Dominance receipts

Prime window: **Rose Namajunas I → Zhang Weili**. Prime record: **6-1**. Effective samples: **15**. Sample multiplier: **100.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 6 | 10-5; 66.7% |
| Round control | 5.11 | 56.8%; rounds 25-19 |
| Finish pressure | 0.5 | 2 finishes; 13.3% |
| Elite-level validation | 4.97 | 9 elite-stage fights; 4.97 points |
| Raw prime score | 16.58 | Before sample multiplier |
| Final Prime Dominance | 16.58 | 16.58 × 1 |

#### Longevity receipts

Active elite years: **3.55**. Raw calendar months: **95**. Gap-adjusted months: **95**. Status multiplier: **1.02**. Division multiplier: **1**. Counted elite months: **96.9**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 2014-12-12 | 2015-03-14 | 3.02 | 3.02 | No |
| 2015-03-14 | 2016-04-23 | 13.34 | 13.34 | No |
| 2016-04-23 | 2017-02-19 | 9.92 | 9.92 | No |
| 2017-02-19 | 2017-06-25 | 4.14 | 4.14 | No |
| 2017-06-25 | 2017-12-30 | 6.18 | 6.18 | No |
| 2017-12-30 | 2018-06-09 | 5.29 | 5.29 | No |
| 2018-06-09 | 2018-09-08 | 2.99 | 2.99 | No |
| 2018-09-08 | 2019-04-27 | 7.59 | 7.59 | No |
| 2019-04-27 | 2019-09-21 | 4.83 | 4.83 | No |
| 2019-09-21 | 2020-05-09 | 7.59 | 7.59 | No |
| 2020-05-09 | 2020-07-26 | 2.56 | 2.56 | No |
| 2020-07-26 | 2021-05-22 | 9.86 | 9.86 | No |
| 2021-05-22 | 2022-05-07 | 11.5 | 11.5 | No |
| 2022-05-07 | 2022-11-12 | 6.21 | 6.21 | No |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **15** fights. Severity: **3.13**. Frequency: **2.45**. Prime-volume floor: **4.5**. Pre-division magnitude: **5.58**. Division discount: **0.0%**. Final penalty: **-5.58**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Base | Finish extra | Raw event | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2015-03-14 | Joanna Jedrzejczyk | prime | champion-level | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2017-02-19 | Randa Markos | prime | solid | home | No | Yes | -4 | 0 | -4 | standard rule |
| 2018-06-09 | Claudia Gadelha | prime | top-five | home | No | Yes | -1.5 | 0 | -1.5 | standard rule |
| 2018-09-08 | Tatiana Suarez | prime | top-five | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2022-11-12 | Zhang Weili | prime | champion-level | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2024-10-05 | Tecia Pennington | post-prime | top-ten | home | No | Yes | 0 | 0 | 0 | standard rule |

#### Division-strength context

Default division key: **women-strawweight-0.90**. Era-ledger division multiplier: **1**. Division-era modifier: **-1.22**.

Rose I through Zhang with long gaps capped.

#### Key judgment calls

- **Eye test vs résumé:** The app should score the title results even if the style is ugly.
- **No defenses:** This is the ceiling cap.
- **Zhang/Joanna losses:** Both are real finish-loss title damage.

#### Why ranked here

Esparza scores as a real UFC champion because two UFC title wins matter and the second-title climb had real ranked names.

#### Why not ranked higher?

She does not rank higher because she never defended either belt, had two damaging title losses, and rarely separated from elite opponents in a dominant way.

#### Compare-mode guidance

- **Best counterargument:** The counter is dominance: no defenses and ugly title losses.
- **Why this résumé can still win:** Esparza wins comparisons when official title results and head-to-head Rose value matter.

#### Final takeaway

Esparza is not fun to rank, but she is a required UFC-only women’s champion add.

_Ledger verified through 2026-07-13. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

### 10. Alexa Grasso — 86 OVR

A former UFC flyweight champion whose case is built on the Valentina upset, draw retention, and strong flyweight contender work.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| women | 36.98 | 9-5-1 | Flyweight / Strawweight | 1 | 1 | 3 | 5-2-1 | 50.0% | 5.41 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 2.06 | 35 | 2.4 |
| Opponent Quality | 13.32 | 25 | 11.1 |
| Prime Dominance | 16.89 | 30 | 16.89 |
| Longevity | 14.13 | 10 | 4.71 |

Base score: **35.1**. Modifiers: Apex **+4.5**, Loss Penalty **-2.8**, Division-Era Depth **+0.18**. Final raw score: **36.98**.

OVR conversion: 25.78–80.79 board anchors, normalized score **0.203599**, curved score **0.258500**, resulting in **86 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 2.06 | #10 | 1 adjusted credit / 14.54 benchmark |
| Opponent Quality | 13.32 | #9 | 6.26 diminished credit / 14.1 benchmark |
| Prime Dominance | 16.89 | #10 | 16.89 raw × 100.0% sample |
| Longevity | 14.13 | #6 | 67.82 counted elite months |
| Apex | +4.5 | Modifier | A strong five-round contender win followed by the championship submission creates a compliant, title-winning Apex. |
| Loss Penalty | -2.8 | Modifier | 5 official/technical loss events reviewed |
| Division-Era Depth | +0.18 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **1**. Adjusted title wins: **1**. Derived undisputed-title win count: **1**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 2023-03-04 | Valentina Shevchenko | normal | 1 | 1 | 1 | locked |

#### Opponent Quality receipts

Raw win credit: **6.6**. Diminishing-return credit before fighter adjustment: **6.26**. Fighter adjustment: **0**. Final diminished credit: **6.26**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2023-03-04 | Valentina Shevchenko | champion-level | 1.25 | 1 | 1.25 | Elite UFC flyweight champion. |
| 2 | 2026-03-28 | Maycee Barber | top-five | 1 | 1 | 1 | Top-five flyweight rematch win. |
| 3 | 2021-02-13 | Maycee Barber | top-ten | 0.85 | 1 | 0.85 | Strong ranked flyweight contender. |
| 4 | 2022-10-15 | Viviane Araujo | top-ten | 0.85 | 1 | 0.85 | Ranked flyweight contender. |
| 5 | 2019-06-08 | Karolina Kowalkiewicz | ranked | 0.65 | 1 | 0.65 | Former title challenger, later-career timing. |
| 6 | 2022-03-26 | Joanne Wood | ranked | 0.65 | 1 | 0.65 | Ranked flyweight/strawweight veteran. |
| 7 | 2016-11-05 | Heather Jo Clark | solid | 0.45 | 0.75 | 0.34 | Approved supporting UFC win treatment. |
| 8 | 2017-08-05 | Randa Markos | solid | 0.45 | 0.75 | 0.34 | Solid strawweight veteran. |
| 9 | 2020-08-29 | Ji Yeon Kim | solid | 0.45 | 0.75 | 0.34 | Solid UFC win. |

#### Prime Dominance receipts

Prime window: **Maycee Barber → Current title-level form**. Prime record: **5-2-1**. Effective samples: **8**. Sample multiplier: **100.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 6.19 | 5-2-1; 68.8% |
| Round control | 4.5 | 50.0%; rounds 13-13 |
| Finish pressure | 2 | 3 finishes; 37.5% |
| Elite-level validation | 4.2 | 6 elite-stage fights; 4.2 points |
| Raw prime score | 16.89 | Before sample multiplier |
| Final Prime Dominance | 16.89 | 16.89 × 1 |

#### Longevity receipts

Active elite years: **5.41**. Raw calendar months: **64.9**. Gap-adjusted months: **64.9**. Status multiplier: **1.1**. Division multiplier: **0.95**. Counted elite months: **67.82**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 2021-02-13 | 2022-03-26 | 13.34 | 13.34 | No |
| 2022-03-26 | 2022-10-15 | 6.67 | 6.67 | No |
| 2022-10-15 | 2023-03-04 | 4.6 | 4.6 | No |
| 2023-03-04 | 2023-09-16 | 6.44 | 6.44 | No |
| 2023-09-16 | 2024-09-14 | 11.96 | 11.96 | No |
| 2024-09-14 | 2025-05-10 | 7.82 | 7.82 | No |
| 2025-05-10 | 2026-03-28 | 10.58 | 10.58 | No |
| 2026-03-28 | 2026-07-13 | 3.52 | 3.52 | No |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **15** fights. Severity: **1.5**. Frequency: **1.3**. Prime-volume floor: **1.5**. Pre-division magnitude: **2.8**. Division discount: **0.0%**. Final penalty: **-2.8**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Base | Finish extra | Raw event | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2017-02-04 | Felice Herrig | pre-prime | top-ten | home | No | Yes | -1.25 | 0 | -1.25 | standard rule |
| 2018-05-19 | Tatiana Suarez | pre-prime | top-five | home | Yes | Yes | -0.75 | -0.75 | -1.5 | standard rule |
| 2019-09-21 | Carla Esparza | pre-prime | champion-level | home | No | Yes | -0.75 | 0 | -0.75 | standard rule |
| 2024-09-14 | Valentina Shevchenko | prime | champion-level | home | No | Yes | -1.5 | 0 | -1.5 | standard rule |
| 2025-05-10 | Natalia Silva | prime | top-five | home | No | Yes | -1.5 | 0 | -1.5 | standard rule |

#### Division-strength context

Default division key: **modern-women-flyweight-0.92**. Era-ledger division multiplier: **0.95**. Division-era modifier: **+0.18**.

Barber through current title-level form.

#### Key judgment calls

- **Title case:** Huge single win plus draw retainment, not long-reign control.
- **Losses:** Valentina III and Natália Silva are meaningful prime/post-title elite losses.
- **Flyweight strength:** Modern women’s flyweight gets solid but not max division credit.

#### Why ranked here

Grasso scores well because beating Valentina for the belt is one of the best women’s UFC wins ever, and the draw retention adds real championship value.

#### Why not ranked higher?

She does not rank higher because the reign was short, she never logged a clean defense win, and Valentina/Natália losses cap the case.

#### Compare-mode guidance

- **Best counterargument:** The counter is short reign and no clean title defense win.
- **Why this résumé can still win:** Grasso wins comparisons when signature title-win value matters.

#### Final takeaway

Grasso is a real women’s UFC champion case with one signature win carrying a lot of weight.

_Ledger verified through 2026-07-13. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

### 11. Kayla Harrison — 86 OVR

A current UFC bantamweight champion with dominant grappling control and a perfect UFC record, but only three UFC fights keep the score capped.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| women | 35 | 3-0 | Bantamweight | 1 | 1 | 3 | 3-0 | 100.0% | 2.25 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 2.06 | 35 | 2.4 |
| Opponent Quality | 6.28 | 25 | 5.23 |
| Prime Dominance | 21.57 | 30 | 21.57 |
| Longevity | 5.5 | 10 | 1.83 |

Base score: **31.03**. Modifiers: Apex **+3.48**, Loss Penalty **0**, Division-Era Depth **+0.49**. Final raw score: **35**.

OVR conversion: 25.78–80.79 board anchors, normalized score **0.167606**, curved score **0.219102**, resulting in **86 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 2.06 | #10 | 1 adjusted credit / 14.54 benchmark |
| Opponent Quality | 6.28 | #15 | 2.95 diminished credit / 14.1 benchmark |
| Prime Dominance | 21.57 | #5 | 26.96 raw × 80.0% sample |
| Longevity | 5.5 | #15 | 26.42 counted elite months |
| Apex | +3.48 | Modifier | Short UFC-only apex with grappling danger and combat-sports aura. |
| Loss Penalty | 0 | Modifier | 0 official/technical loss events reviewed |
| Division-Era Depth | +0.49 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **1**. Adjusted title wins: **1**. Derived undisputed-title win count: **1**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 2025-06-07 | Julianna Peña | normal | 1 | 1 | 1 | Current-table clean title win over sitting champion. |

#### Opponent Quality receipts

Raw win credit: **2.95**. Diminishing-return credit before fighter adjustment: **2.95**. Fighter adjustment: **0**. Final diminished credit: **2.95**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2025-06-07 | Julianna Peña | champion-level | 1.25 | 1 | 1.25 | Defeated the reigning UFC bantamweight champion. |
| 2 | 2024-04-13 | Holly Holm | top-ten | 0.85 | 1 | 0.85 | Former UFC champion name, late-career timing. |
| 3 | 2024-10-05 | Ketlen Vieira | top-ten | 0.85 | 1 | 0.85 | Strong ranked bantamweight contender. |

#### Prime Dominance receipts

Prime window: **Holly Holm → Current UFC elite form**. Prime record: **3-0**. Effective samples: **3**. Sample multiplier: **80.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 9 | 3-0; 100.0% |
| Round control | 9 | 100.0%; rounds 7-0 |
| Finish pressure | 4 | 2 finishes; 66.7% |
| Elite-level validation | 4.96 | 3 elite-stage fights; 4.96 points |
| Raw prime score | 26.96 | Before sample multiplier |
| Final Prime Dominance | 21.57 | 26.96 × 0.8 |

#### Longevity receipts

Active elite years: **2.25**. Raw calendar months: **27**. Gap-adjusted months: **27**. Status multiplier: **1.03**. Division multiplier: **0.95**. Counted elite months: **26.42**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 2024-04-13 | 2024-10-05 | 5.75 | 5.75 | No |
| 2024-10-05 | 2025-06-07 | 8.05 | 8.05 | No |
| 2025-06-07 | 2026-07-13 | 13.17 | 13.17 | No |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **3** fights. Severity: **0**. Frequency: **0**. Prime-volume floor: **0**. Pre-division magnitude: **0**. Division discount: **0.0%**. Final penalty: **0**.

_No rows._

#### Division-strength context

Default division key: **modern-women-bantamweight-0.90**. Era-ledger division multiplier: **0.95**. Division-era modifier: **+0.49**.

Holm through current UFC elite form.

#### Key judgment calls

- **Tiny UFC sample:** Dominance is real, but Quality Wins and Longevity stay low because the UFC résumé is only three fights.
- **Current WBW strength:** Women’s bantamweight is historically important but not max-depth in this current window.
- **Clean loss context:** No UFC losses means no penalty.
- **Dominance vs volume:** She gets strong Prime Dominance, but the total score stays capped by UFC-only volume.

#### Why ranked here

Harrison scores as a real UFC champion because she beat Peña for the belt, dominated Holm, beat Vieira, and has no UFC loss penalty.

#### Why not ranked higher?

The cap is pure UFC volume. She has only three UFC fights, one title-fight win, and zero defenses. PFL and Olympic greatness are context only and cannot carry the UFC-only score.

#### Compare-mode guidance

- **Best counterargument:** The counterargument is simple: three UFC fights is not enough volume to compete with long-reign UFC champions yet.
- **Why this résumé can still win:** Harrison wins comparisons when clean dominance, no UFC losses, and current-title value outweigh résumé volume.

#### Final takeaway

Kayla is a dangerous current-champion UFC-only case: dominant and clean, but still waiting on the title-defense volume that would push her higher.

_Ledger verified through 2026-07-13. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

### 12. Mackenzie Dern — 85 OVR

A current UFC strawweight champion with elite submission danger and real title value, but a volatile contender ledger keeps the UFC-only score grounded.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| women | 34.33 | 11-5 | Strawweight | 1 | 0.86 | 1 | 7-4 | 57.9% | 5.58 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 1.77 | 35 | 2.06 |
| Opponent Quality | 14.87 | 25 | 12.39 |
| Prime Dominance | 14.42 | 30 | 14.42 |
| Longevity | 14.2 | 10 | 4.73 |

Base score: **33.6**. Modifiers: Apex **+4.1**, Loss Penalty **-3.38**, Division-Era Depth **0**. Final raw score: **34.33**.

OVR conversion: 25.78–80.79 board anchors, normalized score **0.155426**, curved score **0.205492**, resulting in **85 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 1.77 | #15 | 0.86 adjusted credit / 14.54 benchmark |
| Opponent Quality | 14.87 | #8 | 6.99 diminished credit / 14.1 benchmark |
| Prime Dominance | 14.42 | #13 | 14.42 raw × 100.0% sample |
| Longevity | 14.2 | #5 | 68.15 counted elite months |
| Apex | +4.1 | Modifier | A submission rebound and five-round contender win create a clean modern strawweight Apex without a championship-level claim. |
| Loss Penalty | -3.38 | Modifier | 5 official/technical loss events reviewed |
| Division-Era Depth | 0 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **1**. Adjusted title wins: **0.86**. Derived undisputed-title win count: **1**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 2025-10-25 | Virna Jandiroba | vacant-undisputed | 0.9 | 0.95 | 0.86 | Recent-event add: UFC 321 vacant strawweight title win over strong contender. |

#### Opponent Quality receipts

Raw win credit: **7.65**. Diminishing-return credit before fighter adjustment: **6.99**. Fighter adjustment: **0**. Final diminished credit: **6.99**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2020-12-12 | Virna Jandiroba | top-five | 1 | 1 | 1 | Vacant-title opponent and elite strawweight contender in app timeline. |
| 2 | 2025-10-25 | Virna Jandiroba | top-five | 1 | 1 | 1 | Elite strawweight title-level contender in the approved rematch. |
| 3 | 2023-05-20 | Angela Hill | top-ten | 0.85 | 1 | 0.85 | Strong veteran strawweight contender. |
| 4 | 2025-01-11 | Amanda Ribas | top-ten | 0.85 | 1 | 0.85 | Strong ranked strawweight win. |
| 5 | 2020-09-19 | Randa Markos | ranked | 0.65 | 1 | 0.65 | Quality strawweight veteran. |
| 6 | 2021-04-10 | Nina Nunes | ranked | 0.65 | 1 | 0.65 | Quality strawweight/bantamweight name. |
| 7 | 2022-04-09 | Tecia Torres | ranked | 0.65 | 0.75 | 0.49 | Quality strawweight contender. |
| 8 | 2024-08-03 | Loopy Godinez | ranked | 0.65 | 0.75 | 0.49 | Quality ranked strawweight win. |
| 9 | 2018-03-03 | Ashley Yoder | solid | 0.45 | 0.75 | 0.34 | Solid UFC win. |
| 10 | 2018-05-12 | Amanda Cooper | solid | 0.45 | 0.75 | 0.34 | Solid UFC win. |
| 11 | 2020-05-30 | Hannah Cifers | solid | 0.45 | 0.75 | 0.34 | Solid UFC strawweight win. |

#### Prime Dominance receipts

Prime window: **Nina Nunes → Current championship form**. Prime record: **7-4**. Effective samples: **10**. Sample multiplier: **100.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 5.4 | 6-4; 60.0% |
| Round control | 5.14 | 57.1%; rounds 20-15 |
| Finish pressure | 1 | 2 finishes; 20.0% |
| Elite-level validation | 2.88 | 5 elite-stage fights; 2.88 points |
| Raw prime score | 14.42 | Before sample multiplier |
| Final Prime Dominance | 14.42 | 14.42 × 1 |

#### Longevity receipts

Active elite years: **5.58**. Raw calendar months: **63.1**. Gap-adjusted months: **63.1**. Status multiplier: **1.08**. Division multiplier: **1**. Counted elite months: **68.15**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 2021-04-10 | 2021-10-09 | 5.98 | 5.98 | No |
| 2021-10-09 | 2022-04-09 | 5.98 | 5.98 | No |
| 2022-04-09 | 2022-10-01 | 5.75 | 5.75 | No |
| 2022-10-01 | 2023-05-20 | 7.59 | 7.59 | No |
| 2023-05-20 | 2023-11-11 | 5.75 | 5.75 | No |
| 2023-11-11 | 2024-02-17 | 3.22 | 3.22 | No |
| 2024-02-17 | 2024-08-03 | 5.52 | 5.52 | No |
| 2024-08-03 | 2025-01-11 | 5.29 | 5.29 | No |
| 2025-01-11 | 2025-10-25 | 9.43 | 9.43 | No |
| 2025-10-25 | 2026-07-13 | 8.57 | 8.57 | No |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **16** fights. Severity: **1.88**. Frequency: **1.5**. Prime-volume floor: **3.25**. Pre-division magnitude: **3.38**. Division discount: **0.0%**. Final penalty: **-3.38**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Base | Finish extra | Raw event | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2019-10-12 | Amanda Ribas | pre-prime | top-ten | home | No | Yes | -1.25 | 0 | -1.25 | standard rule |
| 2021-10-09 | Marina Rodriguez | prime | top-five | home | No | Yes | -1.5 | 0 | -1.5 | standard rule |
| 2022-10-01 | Yan Xiaonan | prime | top-five | home | No | Yes | -1.5 | 0 | -1.5 | standard rule |
| 2023-11-11 | Jessica Andrade | prime | champion-level | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2024-02-17 | Amanda Lemos | prime | top-five | home | No | Yes | -1.5 | 0 | -1.5 | standard rule |

#### Division-strength context

Default division key: **modern-women-strawweight-0.95**. Era-ledger division multiplier: **1**. Division-era modifier: **0**.

Nina Nunes through current championship form.

#### Key judgment calls

- **Vacant title credit:** The belt is real, but adjusted title credit is below a reigning-champion title win.
- **Losses stay live:** No post-prime cutoff yet, so the Marina/Yan/Andrade/Lemos losses still matter.
- **Submission dominance:** Finish/stoppage dominance is the strongest Prime Dominance input.
- **Strawweight context:** Women’s strawweight is treated as a strong women’s UFC division.

#### Why ranked here

Dern scores as a legitimate UFC champion because the Jandiroba title win, submission threat, and long strawweight relevance give her a real UFC-only case.

#### Why not ranked higher?

The score is capped by a vacant-title path, no defenses yet, no reigning-champion win, and repeated prime contender losses to Marina Rodriguez, Yan Xiaonan, Jessica Andrade, and Amanda Lemos.

#### Compare-mode guidance

- **Best counterargument:** The counterargument is volatility: five UFC losses, no defenses, and no reigning-champion win yet.
- **Why this résumé can still win:** Dern wins comparisons when current-title value, submission threat, and long strawweight activity matter more than clean championship control.

#### Final takeaway

Dern is a real UFC champion add, but the model should treat her as a volatile current-title case, not a settled long-reign GOAT case.

_Ledger verified through 2026-07-13. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

### 13. Julianna Peña — 83 OVR

A two-time UFC bantamweight champion with one of the biggest title upsets ever, balanced by no defenses and rough elite losses.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| women | 27.76 | 8-4 | Bantamweight / Flyweight | 2 | 1.81 | 3 | 5-4 | 50.0% | 8.37 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 3.73 | 35 | 4.35 |
| Opponent Quality | 10.56 | 25 | 8.8 |
| Prime Dominance | 10.02 | 30 | 10.02 |
| Longevity | 9.54 | 10 | 3.18 |

Base score: **26.35**. Modifiers: Apex **+4.65**, Loss Penalty **-3.57**, Division-Era Depth **+0.33**. Final raw score: **27.76**.

OVR conversion: 25.78–80.79 board anchors, normalized score **0.035993**, curved score **0.059264**, resulting in **83 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 3.73 | #8 | 1.81 adjusted credit / 14.54 benchmark |
| Opponent Quality | 10.56 | #13 | 4.96 diminished credit / 14.1 benchmark |
| Prime Dominance | 10.02 | #15 | 11.13 raw × 90.0% sample |
| Longevity | 9.54 | #10 | 45.79 counted elite months |
| Apex | +4.65 | Modifier | The all-time upset supplies major Proof and Aura, while the immediate one-sided rematch loss limits Claim. |
| Loss Penalty | -3.57 | Modifier | 4 official/technical loss events reviewed |
| Division-Era Depth | +0.33 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **2**. Adjusted title wins: **1.81**. Derived undisputed-title win count: **2**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 2021-12-11 | Amanda Nunes | normal | 1 | 1 | 1 | locked |
| 2024-10-05 | Raquel Pennington | vacant-undisputed | 0.9 | 0.9 | 0.81 | Vacant title over credible but softer opponent. |

#### Opponent Quality receipts

Raw win credit: **5.05**. Diminishing-return credit before fighter adjustment: **4.96**. Fighter adjustment: **0**. Final diminished credit: **4.96**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2021-12-11 | Amanda Nunes | champion-level | 1.25 | 1 | 1.25 | Submitted the dominant reigning UFC two-division champion to win the bantamweight title. |
| 2 | 2016-07-09 | Cat Zingano | top-ten | 0.85 | 1 | 0.85 | Strong contender win over a former UFC title challenger. |
| 3 | 2024-10-05 | Raquel Pennington | top-ten | 0.85 | 1 | 0.85 | Won the UFC bantamweight title by disputed split decision; title value is respected but capped below full top-five credit. |
| 4 | 2015-10-03 | Jessica Eye | ranked | 0.65 | 1 | 0.65 | Ranked bantamweight/flyweight contender and useful early UFC win. |
| 5 | 2021-01-24 | Sara McMann | ranked | 0.65 | 1 | 0.65 | Olympic medalist and ranked bantamweight veteran in Peña’s title climb. |
| 6 | 2019-07-13 | Nicco Montano | solid | 0.45 | 1 | 0.45 | Former UFC flyweight champion name, capped for inactivity, division movement, and limited sustained elite proof. |
| 7 | 2015-04-04 | Milana Dudieva | name-value | 0.25 | 0.75 | 0.19 | Supporting UFC finish with limited opponent-quality value. |
| 8 | 2013-11-30 | Jessica Rakoczy | minimal | 0.1 | 0.75 | 0.07 | TUF finale support win with minimal long-term opponent-quality value. |

#### Prime Dominance receipts

Prime window: **Amanda Nunes I → Current title-level form**. Prime record: **5-4**. Effective samples: **4**. Sample multiplier: **90.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 4.5 | 2-2; 50.0% |
| Round control | 2.57 | 28.6%; rounds 4-10 |
| Finish pressure | 1 | 1 finishes; 25.0% |
| Elite-level validation | 3.06 | 4 elite-stage fights; 3.06 points |
| Raw prime score | 11.13 | Before sample multiplier |
| Final Prime Dominance | 10.02 | 11.13 × 0.9 |

#### Longevity receipts

Active elite years: **8.37**. Raw calendar months: **55**. Gap-adjusted months: **46.8**. Status multiplier: **1.03**. Division multiplier: **0.95**. Counted elite months: **45.79**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 2021-12-11 | 2022-07-30 | 7.59 | 7.59 | No |
| 2022-07-30 | 2024-10-05 | 26.22 | 18 | Yes |
| 2024-10-05 | 2025-06-07 | 8.05 | 8.05 | No |
| 2025-06-07 | 2026-07-13 | 13.17 | 13.17 | No |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **12** fights. Severity: **1.88**. Frequency: **1.69**. Prime-volume floor: **1.75**. Pre-division magnitude: **3.57**. Division discount: **0.0%**. Final penalty: **-3.57**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Base | Finish extra | Raw event | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2017-01-28 | Valentina Shevchenko | pre-prime | champion-level | home | Yes | Yes | -0.75 | -0.75 | -1.5 | standard rule |
| 2020-10-04 | Germaine de Randamie | pre-prime | top-five | home | Yes | Yes | -0.75 | -0.75 | -1.5 | standard rule |
| 2022-07-30 | Amanda Nunes | prime | champion-level | home | No | Yes | -1.5 | 0 | -1.5 | standard rule |
| 2025-06-07 | Kayla Harrison | prime | champion-level | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |

#### Division-strength context

Default division key: **modern-women-bantamweight-0.90**. Era-ledger division multiplier: **0.95**. Division-era modifier: **+0.33**.

Tate through current title-level form.

#### Key judgment calls

- **Title-result value:** Championship score is strong despite low dominance.
- **Disputed Pennington win:** Counts as a title win but discounted.
- **No defenses:** Capped below sustained champion cases.

#### Why ranked here

Peña scores this high because beating Amanda Nunes for the belt is a gigantic UFC-only title result, and the Pennington title win gives her a second championship point.

#### Why not ranked higher?

She does not rank higher because she has zero defenses, the Nunes rematch was decisive, and the Kayla/Valentina/GDR losses keep the dominance case low.

#### Compare-mode guidance

- **Best counterargument:** The counter is dominance: no defenses, decisive rematch loss, and Kayla loss.
- **Why this résumé can still win:** Peña wins comparisons when title-result shock value matters more than clean dominance.

#### Final takeaway

Peña is weird but necessary: a huge UFC championship résumé without a clean dominance résumé.

_Ledger verified through 2026-07-13. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

### 14. Miesha Tate — 82 OVR

A former UFC bantamweight champion whose UFC-only case is built on the legendary Holm comeback, a solid contender climb, and a short reign with no defenses.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| women | 26.18 | 7-7 | Bantamweight / Flyweight | 1 | 0.95 | 3 | 3-1 | 58.3% | 1.44 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 1.96 | 35 | 2.29 |
| Opponent Quality | 11.04 | 25 | 9.2 |
| Prime Dominance | 15.95 | 30 | 15.95 |
| Longevity | 6.2 | 10 | 2.07 |

Base score: **29.51**. Modifiers: Apex **+3.63**, Loss Penalty **-4.5**, Division-Era Depth **-2.46**. Final raw score: **26.18**.

OVR conversion: 25.78–80.79 board anchors, normalized score **0.007271**, curved score **0.015219**, resulting in **82 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 1.96 | #13 | 0.95 adjusted credit / 14.54 benchmark |
| Opponent Quality | 11.04 | #12 | 5.19 diminished credit / 14.1 benchmark |
| Prime Dominance | 15.95 | #12 | 15.95 raw × 100.0% sample |
| Longevity | 6.2 | #14 | 29.75 counted elite months |
| Apex | +3.63 | Modifier | Short UFC title apex with the Holm comeback win. |
| Loss Penalty | -4.5 | Modifier | 7 official/technical loss events reviewed |
| Division-Era Depth | -2.46 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **1**. Adjusted title wins: **0.95**. Derived undisputed-title win count: **1**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 2016-03-05 | Holly Holm | normal | 1 | 0.95 | 0.95 | locked |

#### Opponent Quality receipts

Raw win credit: **5.3**. Diminishing-return credit before fighter adjustment: **5.19**. Fighter adjustment: **0**. Final diminished credit: **5.19**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2016-03-05 | Holly Holm | champion-level | 1.25 | 1 | 1.25 | UFC bantamweight champion. |
| 2 | 2015-01-31 | Sara McMann | top-five | 1 | 1 | 1 | Olympic medalist and top bantamweight contender. |
| 3 | 2015-07-25 | Jessica Eye | top-ten | 0.85 | 1 | 0.85 | Ranked bantamweight contender. |
| 4 | 2014-04-19 | Liz Carmouche | ranked | 0.65 | 1 | 0.65 | Quality bantamweight contender. |
| 5 | 2021-07-17 | Marion Reneau | ranked | 0.65 | 1 | 0.65 | Quality veteran bantamweight win. |
| 6 | 2014-09-20 | Rin Nakai | solid | 0.45 | 1 | 0.45 | Solid UFC bantamweight win. |
| 7 | 2023-12-02 | Julia Avila | solid | 0.45 | 0.75 | 0.34 | Solid late-career UFC win. |

#### Prime Dominance receipts

Prime window: **Ronda Rousey II → Amanda Nunes**. Prime record: **3-1**. Effective samples: **7**. Sample multiplier: **100.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 6.43 | 5-2; 71.4% |
| Round control | 5.14 | 57.1%; rounds 12-9 |
| Finish pressure | 0.5 | 1 finishes; 14.3% |
| Elite-level validation | 3.88 | 5 elite-stage fights; 3.88 points |
| Raw prime score | 15.95 | Before sample multiplier |
| Final Prime Dominance | 15.95 | 15.95 × 1 |

#### Longevity receipts

Active elite years: **1.44**. Raw calendar months: **30.4**. Gap-adjusted months: **30.4**. Status multiplier: **1.03**. Division multiplier: **0.95**. Counted elite months: **29.75**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 2013-12-28 | 2014-04-19 | 3.68 | 3.68 | No |
| 2014-04-19 | 2014-09-20 | 5.06 | 5.06 | No |
| 2014-09-20 | 2015-01-31 | 4.37 | 4.37 | No |
| 2015-01-31 | 2015-07-25 | 5.75 | 5.75 | No |
| 2015-07-25 | 2016-03-05 | 7.36 | 7.36 | No |
| 2016-03-05 | 2016-07-09 | 4.14 | 4.14 | No |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **8** fights. Severity: **2.25**. Frequency: **2.25**. Prime-volume floor: **2**. Pre-division magnitude: **4.5**. Division discount: **0.0%**. Final penalty: **-4.5**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Base | Finish extra | Raw event | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2013-04-13 | Cat Zingano | pre-prime | top-five | home | Yes | Yes | -0.75 | -0.75 | -1.5 | standard rule |
| 2013-12-28 | Ronda Rousey | prime | champion-level | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2016-07-09 | Amanda Nunes | prime | champion-level | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2016-11-12 | Raquel Pennington | post-prime | top-five | home | No | Yes | 0 | 0 | 0 | standard rule |
| 2021-11-20 | Ketlen Vieira | post-prime | top-five | home | No | Yes | 0 | 0 | 0 | standard rule |
| 2022-07-16 | Lauren Murphy | post-prime | top-ten | home | No | Yes | 0 | 0 | 0 | standard rule |
| 2025-05-03 | Yana Santos | post-prime | top-ten | home | No | Yes | 0 | 0 | 0 | standard rule |

#### Division-strength context

Default division key: **women-bantamweight-0.85**. Era-ledger division multiplier: **0.95**. Division-era modifier: **-2.46**.

Ronda Rousey II through Amanda Nunes.

#### Key judgment calls

- **Holm win:** The Holm comeback carries the case and gets the rare 1.25 Quality Win credit.
- **Pennington cutoff:** Pennington is treated as post-prime/retirement-exit, not a full prime non-elite loss.
- **Comeback phase:** Reneau and Avila help record volume, but Vieira, Murphy, and Santos are post-prime losses with 0 penalty.
- **Women’s bantamweight context:** Historically important division, but uneven depth compared with later women’s strawweight/flyweight peaks.

#### Why ranked here

Tate scores as a legitimate UFC champion because the Holm win was a real title-winning peak moment, and the Carmouche/McMann/Eye run gives the title climb enough support.

#### Why not ranked higher?

The UFC-only case is thin after the Holm win. She has one title-fight win, zero defenses, limited elite UFC win depth, and three counted finish losses before the post-prime cutoff.

#### Compare-mode guidance

- **Best counterargument:** The counterargument is thin UFC-only depth: one title-fight win, no defenses, a 7-7 UFC record, and limited elite wins outside Holm.
- **Why this résumé can still win:** Tate wins comparisons when a real undisputed title win and signature championship comeback matter more than clean record volume.

#### Final takeaway

Tate is a historically important women’s MMA figure, but in UFC-only scoring she is a one-great-title-win champion case rather than a deep-reign GOAT case.

_Ledger verified through 2026-07-13. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

### 15. Holly Holm — 82 OVR

A former UFC bantamweight champion with one immortal title upset, but no defenses and too many failed elite/title spots to climb higher.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| women | 25.12 | 8-7, 1 NC | Bantamweight / Featherweight | 1 | 1 | 3 | 5-5 | 56.8% | 4.89 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 2.06 | 35 | 2.4 |
| Opponent Quality | 12.29 | 25 | 10.24 |
| Prime Dominance | 11.97 | 30 | 11.97 |
| Longevity | 9.18 | 10 | 3.06 |

Base score: **27.67**. Modifiers: Apex **+4.2**, Loss Penalty **-4.75**, Division-Era Depth **-2**. Final raw score: **25.12**.

OVR conversion: 25.78–80.79 board anchors, normalized score **0.000000**, curved score **0.000000**, resulting in **82 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 2.06 | #10 | 1 adjusted credit / 14.54 benchmark |
| Opponent Quality | 12.29 | #10 | 5.78 diminished credit / 14.1 benchmark |
| Prime Dominance | 11.97 | #14 | 11.97 raw × 100.0% sample |
| Longevity | 9.18 | #11 | 44.08 counted elite months |
| Apex | +4.2 | Modifier | Huge one-night apex against Ronda. |
| Loss Penalty | -4.75 | Modifier | 7 official/technical loss events reviewed |
| Division-Era Depth | -2 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **1**. Adjusted title wins: **1**. Derived undisputed-title win count: **1**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 2015-11-15 | Ronda Rousey | normal | 1 | 1 | 1 | locked |

#### Opponent Quality receipts

Raw win credit: **6**. Diminishing-return credit before fighter adjustment: **5.78**. Fighter adjustment: **0**. Final diminished credit: **5.78**.

| Slot | Date | Opponent | Tier | Final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2015-11-15 | Ronda Rousey | champion-level | 1.25 | 1 | 1.25 | Dominant UFC bantamweight champion and all-time star. |
| 2 | 2015-02-28 | Raquel Pennington | top-ten | 0.85 | 1 | 0.85 | Strong ranked bantamweight contender. |
| 3 | 2020-10-04 | Irene Aldana | top-ten | 0.85 | 1 | 0.85 | Strong ranked bantamweight contender. |
| 4 | 2023-03-25 | Yana Santos | top-ten | 0.85 | 1 | 0.85 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 5 | 2017-06-17 | Bethe Correia | ranked | 0.65 | 1 | 0.65 | Former title challenger, timing-adjusted. |
| 6 | 2018-06-09 | Megan Anderson | ranked | 0.65 | 1 | 0.65 | Ranked featherweight win in thin division. |
| 7 | 2015-07-15 | Marion Reneau | solid | 0.45 | 0.75 | 0.34 | Solid bantamweight veteran. |
| 8 | 2020-01-18 | Raquel Pennington | solid | 0.45 | 0.75 | 0.34 | Early UFC win over future contender. |

#### Prime Dominance receipts

Prime window: **Ronda Rousey → Amanda Nunes**. Prime record: **5-5**. Effective samples: **8**. Sample multiplier: **100.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 3.38 | 3-5; 37.5% |
| Round control | 4.34 | 48.3%; rounds 14-15 |
| Finish pressure | 1 | 2 finishes; 25.0% |
| Elite-level validation | 3.25 | 6 elite-stage fights; 3.25 points |
| Raw prime score | 11.97 | Before sample multiplier |
| Final Prime Dominance | 11.97 | 11.97 × 1 |

#### Longevity receipts

Active elite years: **4.89**. Raw calendar months: **43.7**. Gap-adjusted months: **43.7**. Status multiplier: **1.04**. Division multiplier: **0.97**. Counted elite months: **44.08**.

| From | To | Raw months | Counted months | Capped? |
| --- | --- | --- | --- | --- |
| 2015-11-15 | 2016-03-05 | 3.65 | 3.65 | No |
| 2016-03-05 | 2016-07-23 | 4.6 | 4.6 | No |
| 2016-07-23 | 2017-02-11 | 6.67 | 6.67 | No |
| 2017-02-11 | 2017-06-17 | 4.14 | 4.14 | No |
| 2017-06-17 | 2017-12-30 | 6.44 | 6.44 | No |
| 2017-12-30 | 2018-06-09 | 5.29 | 5.29 | No |
| 2018-06-09 | 2019-07-06 | 12.88 | 12.88 | No |

#### Loss-penalty receipts

The raw fight events are compressed through severity, frequency and a prime-loss volume floor. Exposure: **10** fights. Severity: **2.25**. Frequency: **2.5**. Prime-volume floor: **4.25**. Pre-division magnitude: **4.75**. Division discount: **0.0%**. Final penalty: **-4.75**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Base | Finish extra | Raw event | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2016-03-05 | Miesha Tate | prime | champion-level | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2016-07-23 | Valentina Shevchenko | prime | champion-level | home | No | Yes | -1.5 | 0 | -1.5 | standard rule |
| 2017-02-11 | Germaine de Randamie | prime | top-five | home | No | Yes | -1.5 | 0 | -1.5 | standard rule |
| 2017-12-30 | Cris Cyborg | prime | champion-level | home | No | Yes | -1.5 | 0 | -1.5 | standard rule |
| 2019-07-06 | Amanda Nunes | prime | champion-level | home | Yes | Yes | -1.5 | -0.75 | -2.25 | standard rule |
| 2022-05-21 | Ketlen Vieira | post-prime | top-five | home | No | Yes | 0 | 0 | 0 | standard rule |
| 2024-04-13 | Kayla Harrison | post-prime | champion-level | home | Yes | Yes | 0 | 0 | 0 | standard rule |

#### Division-strength context

Default division key: **women-bantamweight-featherweight-0.88**. Era-ledger division multiplier: **0.97**. Division-era modifier: **-2**.

Ronda through Nunes. Tate was followed by continued title relevance; Nunes is endpoint.

#### Key judgment calls

- **Signature moment:** Ronda win drives both Quality Wins and Apex Peak.
- **No defenses:** Hard cap on Championship.
- **Loss context:** The score charges repeated failed elite/title spots.

#### Why ranked here

Holm scores because the Ronda knockout is one of the biggest UFC championship moments ever and she stayed relevant in title/elite fights for years.

#### Why not ranked higher?

She does not rank higher because she had no successful defenses, lost the belt immediately, and came up short in several title/elite fights.

#### Compare-mode guidance

- **Best counterargument:** The counter is everything after Ronda: no defenses, immediate Miesha loss, and repeated title-fight failures.
- **Why this résumé can still win:** Holm wins comparisons when signature moment and historical shock value matter.

#### Final takeaway

Holm belongs on the board, but she lands lower than historical reputation because UFC-only depth after Ronda is thin.

_Ledger verified through 2026-07-13. Scores come from category-calculators-20260714c-seven-direct-calculators and ranking-pipeline-20260714b-direct-category-total-rank-ovr._

## 11. Comparison guidance

1. Start with the verdict.
2. Say whether the verdict is about **better fighter/ability** or **better UFC-only GOAT résumé**.
3. Cite actual category values and decisive receipts.
4. Give the losing fighter’s strongest real counterargument.
5. Explain why the winner still wins.
6. Use fight-ledger history only when the fighters actually fought or had a real rivalry.
7. Lead with the decisive two or three differences, not a spreadsheet recital.

## 12. Scenario-analysis guidance

- Start with the current raw-score and OVR gap.
- Define the hypothetical UFC fight: opponent tier, champion status, title type, division, result, method, rounds and date.
- Update the canonical fight ledger, Championship/Opponent Quality judgments, prime sample, longevity, loss exposure, Apex and division context as applicable.
- Rerun all seven categories, weighted totals, ranks and OVRs.
- Do not promise a pass from one win unless the full rerun produces it.
- Separate deterministic model output from judgment-dependent estimates.

## 13. Validation and regression readiness

Automated validation passed for **80 fighters** and specifically checked Jon Jones, Georges St-Pierre, Demetrious Johnson, Anderson Silva, Khabib Nurmagomedov, Alexander Volkanovski, Islam Makhachev, Jose Aldo, Alexandre Pantoja, Cain Velasquez, Francis Ngannou, Brandon Moreno, Anthony Pettis.

| Regression question | Status | Required answer behavior |
| --- | --- | --- |
| Show me exactly how Jon Jones got 99 OVR. | Ready | Use exact weighted raw total, OVR anchors, curve and leader-only 99 rule. |
| Why is Pantoja’s quality-wins score low? | Ready | Use final-credit inputs, diminishing-return slots, benchmark and flyweight context. |
| Who is the best UFC fighter never to win undisputed gold? | Ready with definition | Current derived résumé leader: Dustin Poirier. Separate ability from résumé. |
| Compare Khabib and Volkanovski. | Ready | Verdict first; give the loser’s best case and separate ability from résumé. |
| What would Islam need to do to pass GSP? | Scenario-ready | State current gap, define assumptions and require a full rerun. |
| Why is Cain behind Ngannou overall? | Premise check required | Current data has Ngannou ahead; explain the category/modifier gaps. |
| How was Anderson Silva’s loss penalty calculated? | Ready | Show each event and the severity/frequency/volume compression. |
| Who has the best prime outside the top 10? | Ready | Current answer: Chuck Liddell by Prime Dominance score. |
| Which fighter is hurt most by UFC-only scoring? | Opinion only | Use excluded-achievement context and never invent a non-UFC score. |
| Who has the strongest UFC résumé without becoming undisputed champion? | Ready with definition | Current derived leader: Dustin Poirier. |

## 14. Known limitations and data gaps

- **Bespoke ranking copy:** 0 fighters lack custom “Why ranked here” copy; 0 lack custom “Why not ranked higher?” copy. Calculated fallbacks are supplied.
- **Compare-profile coverage:** 11 fighters lack a full current compare narrative.
- **Round audit coverage:** 0 fighters have at least one prime fight without audited round allocation.
- **Freshness metadata:** model-as-of is 2026-07-13; latest fighter ledger is verified through 2026-07-17.
- **Non-UFC counterfactuals:** the model intentionally does not calculate what excluded achievements would add.
- **Future scenarios:** rankings, title context and round allocations require explicit assumptions.

## 15. Update workflow

1. Update canonical fighter facts and approved judgments.
2. The `Build Octagon Verdict Markdown` action loads the full app in Chromium.
3. It rebuilds and validates `octagon-verdict-knowledge.md` from the live calculated runtime.
4. The action commits the refreshed Markdown file to `main` only after validation passes.
5. Upload the refreshed Markdown file to the Octagon Verdict Custom GPT and run the regression questions above.
6. JSON exports are optional, run only when explicitly requested, and never block a fighter addition.
