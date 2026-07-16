# Octagon Verdict — Official UFC-Only Knowledge Pack

Generated: **2026-07-16T12:12:03.127Z**  
Canonical model-as-of date: **2026-07-13**  
Latest fighter-ledger verification date: **2026-07-15**  
Fighters: **76**

> This file is generated from the live repository’s calculated scoring pipeline. It is the knowledge source for Octagon Verdict. Do not replace calculated values with legacy score patches, visible UI percentiles, memory, or non-UFC achievements.

## 1. Purpose and scope

Octagon Verdict explains and debates the same UFC-only rankings shown by the live app. It must distinguish three things: **model fact**, **documented judgment call**, and **opinion/inference**. Model facts come from the calculated pipeline and its fight-level receipts. Judgment calls come from approved canonical classifications and presentation notes. Anything else must be labeled as opinion.

## 2. Source architecture

### Authoritative score path

1. `canonical-fighter-facts*.js` owns official UFC fight ledgers, quality tiers, title contexts, prime windows, round audits, and loss classifications.
2. `fighter-era-ledgers.js` plus approved resolutions owns shared prime/longevity windows and loss endpoints.
3. `canonical-scoring-judgments.js` plus approved Opponent Quality and Championship adjustments owns judgment inputs—not final category totals.
4. `category-calculators.js` reconstructs Championship, Opponent Quality, Prime Dominance, Longevity, Loss Penalty, Apex, and Division-Era Depth.
5. `ranking-pipeline.js` applies weights, modifiers, board ranks, visible stats, and fixed-anchor OVRs.
6. `display-overrides.js` supplies human-facing explanations and judgment copy, but does not own scores.
7. `octagon-verdict-data.js` is a thin runtime JSON projection. This Markdown generator expands it with the underlying receipts.

### Legacy compare warning

`assets/data/compare-profiles.js` still points to legacy compare packs. Some of those packs contain old `RANKING_DATA` score patches. They are narrative history, not score authority, and this generator intentionally does **not** execute them. Current comparisons must use calculated pipeline values plus canonical evidence.

| Layer | Version |
| --- | --- |
| Canonical fighter facts | canonical-fighter-facts-20260713c-audited-rounds |
| Fighter-era ledgers | fighter-era-ledgers-20260714h-full-72-coverage |
| Scoring judgments | canonical-scoring-judgments-20260714b-generated-approved-inputs |
| Opponent Quality adjustments | canonical-opponent-quality-audit-adjustments-20260715b-merab |
| Championship adjustments | canonical-championship-audit-adjustments-20260715a-conor-mendes |
| Category calculators | category-calculators-20260714c-seven-direct-calculators |
| Ranking pipeline | ranking-pipeline-20260714b-direct-category-total-rank-ovr |
| Octagon Verdict JSON view | octagon-verdict-data-20260715b-live-pipeline |
| Woodley audit | canonical-woodley-audit-adjustments-20260715a |

## 3. UFC-only rules

- Score official UFC achievements only. Pride, Strikeforce, WEC, ONE, Bellator, Cage Warriors, regional titles, and TUF exhibitions may be mentioned only as context.
- Official no contests are excluded from scored wins/losses.
- Technical and weird results keep their official record status but may be classified as non-competitive or technical exceptions. Jon Jones’s Matt Hamill DQ is not a real competitive loss.
- Prime windows are fighter-specific and controlled by canonical facts plus shared era ledgers.
- Long inactivity gaps are capped at 18 months, so calendar time away does not inflate longevity.
- When a question’s premise conflicts with the current data, correct the premise before debating it.

## 4. Scoring model

| Category | Raw range | Final weight | What it rewards |
| --- | --- | --- | --- |
| Championship | 0–30 | 35 | Adjusted UFC title-fight wins and title-opponent context |
| Opponent Quality | 0–30 | 25 | Quality of UFC wins with diminishing returns and fighter-specific adjustments |
| Prime Dominance | 0–30 | 30 | Prime record, round control, finish pressure, elite-stage validation, and sample strength |
| Longevity | 0–30 | 10 | Gap-adjusted active elite months with status and division multipliers |
| Apex | 0–6 | Direct modifier | Two best approved UFC performances, proof, best-fighter claim, and aura |
| Loss Penalty | 0 to -6 | Direct modifier | Contextual loss burden after event rules and aggregate compression |
| Division-Era Depth | Approved adjustment | Direct modifier | Approved division/era depth context |

**Raw total formula**

`Total = Championship/30×35 + OpponentQuality/30×25 + PrimeDominance/30×30 + Longevity/30×10 + Apex + LossPenalty + DivisionEraDepth`

## 5. OVR versus raw score

Raw score decides rank. OVR is a front-end presentation conversion with a floor of **82**, a ceiling of **99**, a curve exponent of **0.85**, fixed board anchors, and a leader-only 99 rule. Men use 18.68–101.92 anchors; women use 25.78–80.79. OVR is not an extra scoring category and must never be added back into the raw total.

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

Important: the current calculator does not simply add every raw event forever. It converts the event ledger into a final penalty using the worst-loss severity, loss frequency relative to exposure, and a prime-loss volume floor; the final magnitude is capped at 6 and can receive a limited division-strength discount. Fighter cards below show both the raw events and the final aggregate calculation.

## 7. Division-strength framework

Division strength is implemented through fighter-specific canonical keys, era-ledger multipliers, and approved Division-Era Depth adjustments. Defaults are guidance, not blind universal constants. Modern lightweight usually receives the strongest positive context; GSP-era welterweight and modern featherweight are positive; modern bantamweight is around neutral; Anderson-era middleweight and late Jones LHW/HW are modestly discounted; Demetrious Johnson-era flyweight receives a larger discount. Use each fighter’s receipts below instead of substituting a generic multiplier.

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
| 28 | Glover Teixeira | 89 | 48.47 | 2.05 | 24.55 | 19.07 | 23 | +4.25 | -5.25 | -0.12 |
| 29 | Dustin Poirier | 89 | 48.37 | 1.46 | 25.05 | 18.81 | 16.39 | +4.94 | -3.4 | -0.02 |
| 30 | Alexandre Pantoja | 89 | 48.26 | 9.08 | 10.55 | 23.19 | 12.4 | +4.4 | -2.09 | -0.75 |
| 31 | Leon Edwards | 89 | 47.77 | 5.98 | 21.01 | 16.4 | 15.95 | +4.11 | -2.61 | +0.06 |
| 32 | Tito Ortiz | 89 | 47.75 | 10.54 | 14.44 | 18.95 | 21.89 | +3.99 | -3.82 | -3 |
| 33 | Ilia Topuria | 89 | 47.63 | 6.27 | 14.71 | 21.5 | 10.09 | +5.95 | -2.75 | -0.01 |
| 34 | Tyron Woodley | 89 | 47.49 | 7.53 | 14.81 | 19.57 | 13.41 | +4.69 | -2.37 | 0 |
| 35 | Fabricio Werdum | 89 | 47.38 | 3.4 | 20.37 | 20.8 | 15.27 | +5.17 | -3.8 | -0.83 |
| 36 | Robbie Lawler | 89 | 47.29 | 5.78 | 20.16 | 20.08 | 9.28 | +4.46 | -3.74 | -0.14 |
| 37 | Robert Whittaker | 89 | 47.28 | 3.01 | 23.46 | 17.39 | 19.56 | +4.1 | -3.75 | -0.04 |
| 38 | Tony Ferguson | 89 | 46.96 | 1.32 | 18.83 | 22.46 | 12.36 | +4.9 | -2.01 | +0.26 |
| 39 | Henry Cejudo | 89 | 46.85 | 7.51 | 14.04 | 22.52 | 4.77 | +4.35 | -1.69 | -0.38 |
| 40 | Chris Weidman | 89 | 46.31 | 7.63 | 13.33 | 19.73 | 16.71 | +5.68 | -4.18 | -0.5 |
| 41 | Frank Shamrock | 89 | 46.01 | 6.2 | 10.64 | 25.99 | 4.59 | +5.39 | 0 | -3 |
| 42 | Petr Yan | 89 | 45.93 | 5.39 | 17.18 | 17.91 | 16.93 | +4.15 | -2.34 | -0.04 |
| 43 | Sean Strickland | 89 | 45.89 | 4.13 | 21.97 | 17.82 | 12.73 | +3.85 | -3.42 | +0.27 |
| 44 | Deiveson Figueiredo | 89 | 45.88 | 5.57 | 20.11 | 17.97 | 12.06 | +4.38 | -3.38 | -0.37 |
| 45 | Conor McGregor | 89 | 45.84 | 6.19 | 16.06 | 21.21 | 10.47 | +5.8 | -4.81 | -0.45 |
| 46 | Vitor Belfort | 88 | 45.22 | 2.3 | 18.72 | 20.97 | 15.24 | +5.26 | -3.71 | -0.66 |
| 47 | Lyoto Machida | 88 | 45.18 | 4.02 | 21.44 | 17.86 | 13.96 | +4.64 | -4.25 | -0.28 |
| 48 | Rashad Evans | 88 | 44.95 | 1.85 | 21.41 | 19.7 | 15.6 | +4.99 | -4.42 | -0.52 |
| 49 | Dricus du Plessis | 88 | 44.32 | 5.88 | 14.92 | 19.14 | 9.05 | +4.55 | -1.95 | +0.27 |
| 50 | Justin Gaethje | 88 | 42.77 | 4.85 | 20.19 | 15.55 | 11.01 | +4.95 | -3.83 | -0.06 |
| 51 | Dominick Cruz | 88 | 42.34 | 7.63 | 13.7 | 18.19 | 14.05 | +4.25 | -3.49 | -1.61 |
| 52 | Royce Gracie | 88 | 42.17 | 4.85 | 9.55 | 25.12 | 3.4 | +5.3 | 0 | -3 |
| 53 | Khamzat Chimaev | 88 | 40.84 | 1.96 | 13.86 | 19.61 | 11.08 | +5.17 | -1.89 | +0.42 |
| 54 | Michael Bisping | 87 | 37.9 | 3.61 | 19.36 | 15.19 | 4.24 | +3.77 | -2.92 | +0.11 |
| 55 | Sean O'Malley | 87 | 36.15 | 3.82 | 13.3 | 16.67 | 9.78 | +4.06 | -3.28 | -0.1 |
| 56 | Mauricio "Shogun" Rua | 86 | 33 | 1.95 | 15.29 | 15.44 | 6.85 | +4.81 | -4.38 | -0.17 |
| 57 | Forrest Griffin | 86 | 32.85 | 1.95 | 13.78 | 15.59 | 10.3 | +4.98 | -4.29 | -0.62 |
| 58 | Brock Lesnar | 86 | 31.86 | 5.67 | 8.3 | 18.57 | 4.78 | +4.18 | -3.76 | -2.26 |
| 59 | Dan Henderson | 84 | 27.2 | 0 | 13.64 | 13.22 | 9.63 | +4.47 | -4.5 | -0.57 |
| 60 | Chael Sonnen | 84 | 23.58 | 0 | 9.87 | 15.2 | 7.72 | +3.44 | -4.75 | -1.11 |
| 61 | Paddy Pimblett | 84 | 23.49 | 0 | 3.4 | 16.6 | 5.55 | +3.16 | -1.7 | +0.75 |

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

- **Highest-ranked men’s fighter with no derived undisputed UFC title win:** #29 Dustin Poirier (89 OVR). Treat “better fighter” as a separate opinion question.
- **Best Prime Dominance score outside the men’s top 10:** #17 Chuck Liddell, 26.94.
- **Islam-to-GSP current raw-score gap:** 17.95 points. Passing GSP requires a full scenario rerun, not merely adding that number to one category.
- **Cain vs Ngannou current ordering:** Ngannou is currently ahead (#22 vs #23). Any answer must correct a false premise.
- **“Most hurt by UFC-only scoring” is not a direct model field.** It requires an explicitly labeled opinion using excluded WEC/ONE/Pride/Strikeforce context; do not invent a counterfactual score.

## 10. Fighter-by-fighter data cards

### 1. Jon Jones — 99 OVR

The benchmark UFC resume: unmatched title-fight success, elite quality wins, long-term dominance, and no true competitive loss.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 101.47 | 22-1, 1 NC | Light Heavyweight / Heavyweight | 16 | 15.8 | 12 | 16-0, 1 NC | 86.7% | 10.51 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 30 | 35 | 35 |
| Opponent Quality | 29.47 | 25 | 24.56 |
| Prime Dominance | 26.35 | 30 | 26.35 |
| Longevity | 29.13 | 10 | 9.71 |

Base score: **95.62**. Modifiers: Apex **+6**, Loss Penalty **0**, Division-Era Depth **-0.15**. Final raw score: **101.47**.

OVR conversion: board anchors **18.68–101.92**, normalized score **0.9946**, curved score **0.9954**, resulting in **99 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 30 | #1 | 14.54 adjusted credit / 14.54 benchmark |
| Opponent Quality | 29.47 | #2 | 13.85 diminished credit / 14.1 benchmark |
| Prime Dominance | 26.35 | #4 | 26.35 raw × 100.0% sample |
| Longevity | 29.13 | #3 | 139.82 counted elite months |
| Apex modifier | +6 | Modifier | Youngest champ, instant best-in-the-world aura. |
| Loss penalty | 0 | Modifier | 1 official/technical loss events reviewed |
| Division-era depth | -0.15 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **16**. Adjusted title wins: **15.8**. Derived undisputed-title win count: **15**. Interim-title win count: **1**.

| Date | Opponent | Title type | Base | Opponent strength | Final adjusted credit | Review note |
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

| Slot | Date | Opponent | Base/final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 2011-03-19 | Mauricio Rua | 1.25 | 1 | 1.25 | UFC light heavyweight champion and elite title-level opponent. |
| 2 | 2011-12-10 | Lyoto Machida | 1.25 | 1 | 1.25 | Former UFC champion and elite light heavyweight. |
| 3 | 2012-04-21 | Rashad Evans | 1.25 | 1 | 1.25 | Former UFC champion and still elite. |
| 4 | 2013-09-21 | Alexander Gustafsson | 1.25 | 1 | 1.25 | Peak champion-type title challenger. |
| 5 | 2015-01-03 | Daniel Cormier | 1.25 | 1 | 1.25 | Prime elite champion-level opponent and all-time great. |
| 6 | 2011-09-24 | Quinton Jackson | 1 | 1 | 1 | Former UFC champion and real top contender. |
| 7 | 2014-04-26 | Glover Teixeira | 1 | 0.75 | 0.75 | Elite top contender and future UFC champion. |
| 8 | 2018-12-29 | Alexander Gustafsson | 1 | 0.75 | 0.75 | Elite rematch title defense. |
| 9 | 2019-07-06 | Thiago Santos | 1 | 0.75 | 0.75 | Top title challenger; injury/weird fight context. |
| 10 | 2020-02-08 | Dominick Reyes | 1 | 0.75 | 0.75 | Prime top title challenger; close decision flagged. |
| 11 | 2023-03-04 | Ciryl Gane | 1 | 0.75 | 0.75 | Elite heavyweight contender and recent interim champion. |
| 12 | 2011-02-05 | Ryan Bader | 0.85 | 0.75 | 0.64 | Undefeated strong contender. |
| 13 | 2012-09-22 | Vitor Belfort | 0.85 | 0.5 | 0.42 | Dangerous former champion name, undersized context. |
| 14 | 2019-03-02 | Anthony Smith | 0.85 | 0.5 | 0.42 | Ranked title challenger, softer than Jones’ best. |
| 15 | 2016-04-23 | Ovince Saint Preux | 0.65 | 0.5 | 0.33 | Ranked short-notice/interim-title context. |
| 16 | 2024-11-16 | Stipe Miocic | 0.65 | 0.5 | 0.33 | All-time heavyweight name, aged/long-layoff timing. |
| 17 | 2009-01-31 | Stephan Bonnar | 0.45 | 0.5 | 0.23 | Good early UFC win. |
| 18 | 2010-03-21 | Brandon Vera | 0.45 | 0.5 | 0.23 | Useful name before title run. |
| 19 | 2010-08-01 | Vladimir Matyushenko | 0.45 | 0.25 | 0.11 | Solid veteran UFC win. |
| 20 | 2009-07-11 | Jake O'Brien | 0.25 | 0.25 | 0.06 | Low-end early UFC value. |
| 21 | 2013-04-27 | Chael Sonnen | 0.25 | 0.25 | 0.06 | Big name, weak/undersized LHW title context. |
| 22 | 2008-08-09 | Andre Gusmao | 0.1 | 0.25 | 0.03 | Minimal opponent-quality value. |

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

| From | To | Raw months | Counted months | Reason |
| --- | --- | --- | --- | --- |
| 2020-02-08 | 2023-03-04 | 36.8 | 18 | Between-fight gap capped at 18 months |

#### Loss-penalty receipts

The fight-level rules create raw loss events. The final category then compresses those events through severity, frequency, and a prime-loss volume floor. Exposure: **22** fights. Severity: **0**. Frequency: **0**. Prime-volume floor: **0**. Pre-division magnitude: **0**. Final penalty: **0**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Raw event penalty | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2009-12-05 | Matt Hamill | pre-prime | solid | home | No | No | 0 | technical exception / no penalty |

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

Jones ranks here because he has the strongest UFC championship resume ever, the best title-fight win total, elite wins across multiple eras, and one of the longest elite runs in UFC history. His resume combines championship success, quality wins, prime dominance, and longevity better than anyone else.

#### Why not ranked lower?

The main arguments against Jones are close fights, inactivity gaps, late-career sample size at heavyweight, and outside-the-cage controversy. But as a UFC resume, his in-cage case still has the strongest overall combination of title success, elite opponents, dominance, and longevity.

#### Final takeaway

Jones is the UFC benchmark: the deepest championship resume, elite quality wins, rare longevity, and no true competitive loss. He is the 99 OVR standard every other fighter is measured against.

_Source IDs: fighter ledger verified through 2026-07-13; score owner ranking-pipeline.js; category owner category-calculators.js._

### 2. Georges St-Pierre — 96 OVR

The complete UFC resume: a legendary welterweight reign, elite quality wins, and one of the cleanest prime runs in the sport.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 87.15 | 20-2 | Welterweight / Middleweight | 13 | 13 | 15 | 14-1 | 86.0% | 8.44 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 25.11 | 35 | 29.3 |
| Opponent Quality | 30 | 25 | 25 |
| Prime Dominance | 24.47 | 30 | 24.47 |
| Longevity | 25 | 10 | 8.33 |

Base score: **87.1**. Modifiers: Apex **+5.56**, Loss Penalty **-3.78**, Division-Era Depth **-1.73**. Final raw score: **87.15**.

OVR conversion: board anchors **18.68–101.92**, normalized score **0.8226**, curved score **0.8470**, resulting in **96 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 25.11 | #2 | 12.17 adjusted credit / 14.54 benchmark |
| Opponent Quality | 30 | #1 | 14.32 diminished credit / 14.1 benchmark |
| Prime Dominance | 24.47 | #11 | 24.47 raw × 100.0% sample |
| Longevity | 25 | #6 | 119.99 counted elite months |
| Apex modifier | +5.56 | Modifier | Elite complete-fighter apex built on surgical control. |
| Loss penalty | -3.78 | Modifier | 2 official/technical loss events reviewed |
| Division-era depth | -1.73 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **13**. Adjusted title wins: **13**. Derived undisputed-title win count: **12**. Interim-title win count: **1**.

| Date | Opponent | Title type | Base | Opponent strength | Final adjusted credit | Review note |
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

| Slot | Date | Opponent | Base/final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 2006-03-04 | B.J. Penn | 1.25 | 1 | 1.25 | Prime elite UFC champion; smaller-fighter context noted. |
| 2 | 2006-11-18 | Matt Hughes | 1.25 | 1 | 1.25 | All-time welterweight champion while still elite. |
| 3 | 2008-08-09 | Jon Fitch | 1.25 | 1 | 1.25 | Long-streak elite welterweight title challenger. |
| 4 | 2012-11-17 | Carlos Condit | 1.25 | 1 | 1.25 | Interim UFC welterweight champion and elite prime contender. |
| 5 | 2013-11-16 | Johny Hendricks | 1.25 | 1 | 1.25 | Peak title-caliber welterweight; controversial decision flagged. |
| 6 | 2007-08-25 | Josh Koscheck | 1 | 1 | 1 | Top welterweight contender and proven elite wrestler. |
| 7 | 2007-12-29 | Matt Hughes | 1 | 0.75 | 0.75 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 8 | 2009-01-31 | B.J. Penn | 1 | 0.75 | 0.75 | Elite champion-level fighter, size context keeps it below max. |
| 9 | 2009-07-11 | Thiago Alves | 1 | 0.75 | 0.75 | Prime top welterweight contender. |
| 10 | 2010-12-11 | Josh Koscheck | 1 | 0.75 | 0.75 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 11 | 2011-04-30 | Jake Shields | 1 | 0.75 | 0.75 | Elite grappler and top welterweight contender. |
| 12 | 2017-11-04 | Michael Bisping | 1 | 0.75 | 0.75 | Current middleweight champion, older/softer champion context. |
| 13 | 2005-08-20 | Frank Trigg | 0.85 | 0.5 | 0.42 | Relevant ranked welterweight contender. |
| 14 | 2005-11-19 | Sean Sherk | 0.85 | 0.5 | 0.42 | Strong ranked-quality win over future UFC champion. |
| 15 | 2008-04-19 | Matt Serra | 0.85 | 0.5 | 0.42 | Official champion rematch, not champion-level opponent quality. |
| 16 | 2013-03-16 | Nick Diaz | 0.85 | 0.5 | 0.42 | Big-name elite veteran with timing/activity context. |
| 17 | 2004-01-31 | Karo Parisyan | 0.65 | 0.5 | 0.33 | Early meaningful quality welterweight win. |
| 18 | 2010-03-27 | Dan Hardy | 0.65 | 0.5 | 0.33 | Title challenger, weaker than GSP’s best contenders. |
| 19 | 2004-06-19 | Jay Hieron | 0.45 | 0.25 | 0.11 | Solid early UFC win. |
| 20 | 2005-04-16 | Jason Miller | 0.45 | 0.25 | 0.11 | Useful UFC win. |

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

| From | To | Raw months | Counted months | Reason |
| --- | --- | --- | --- | --- |
| 2011-04-30 | 2012-11-17 | 18.63 | 18 | Between-fight gap capped at 18 months |
| 2013-11-16 | 2017-11-04 | 47.61 | 18 | Between-fight gap capped at 18 months |

#### Loss-penalty receipts

The fight-level rules create raw loss events. The final category then compresses those events through severity, frequency, and a prime-loss volume floor. Exposure: **22** fights. Severity: **3.13**. Frequency: **0.85**. Prime-volume floor: **1**. Pre-division magnitude: **3.98**. Final penalty: **-3.78**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Raw event penalty | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2004-10-22 | Matt Hughes | pre-prime | champion-level | home | Yes | Yes | -1.5 | standard rule |
| 2007-04-07 | Matt Serra | prime | solid | home | Yes | Yes | -4.75 | standard rule |

#### Division-strength context

Default division key: **gsp-welterweight-1.05**. Era-ledger division multiplier: **1.03**. Division-era modifier: **-1.73**.

Hughes II through Bisping with retirement gap capped.

#### Key judgment calls

- **Matt Hughes 2004:** counts as a real early-career elite loss, but it was avenged twice.
- **Matt Serra 2007:** counts as a meaningful upset loss, but the rematch and title reclaim are central to his case.
- **Middleweight title win:** adds value, but his resume is built primarily on the welterweight reign.
- **Opponent quality wins:** is the clearest strength of the GSP case and the best in this ranking's current data.
- **Late-career sample:** is small, so the profile stays focused on the established welterweight prime.

#### Why ranked here

St-Pierre ranks here because he combines an all-time welterweight title reign with the strongest quality-wins case in the UFC, elite consistency across his prime, and decisive revenge wins over the losses that matter most. His resume is one of the deepest, cleanest, and easiest to defend in the sport.

#### Why not ranked higher?

Jon Jones still has the edge in championship volume and total time at the very top. St-Pierre's case is elite across the board, but the Serra upset and slightly lower title-fight total keep him just behind #1.

#### Final takeaway

St-Pierre is the complete champion case: elite title success, the best quality-wins score in this ranking, long-term consistency, and decisive answers to the biggest questions on his resume.

_Source IDs: fighter ledger verified through 2026-07-13; score owner ranking-pipeline.js; category owner category-calculators.js._

### 3. Anderson Silva — 95 OVR

The peak-aura case: historic middleweight title control, terrifying finishing dominance, and one of the most iconic prime runs in UFC history.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 77.98 | 17-7, 1 NC | Middleweight / Light Heavyweight | 11 | 11 | 10 | 16-2 | 71.8% | 7.5 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 21.05 | 35 | 24.56 |
| Opponent Quality | 24.39 | 25 | 20.33 |
| Prime Dominance | 25.1 | 30 | 25.1 |
| Longevity | 20.58 | 10 | 6.86 |

Base score: **76.85**. Modifiers: Apex **+5.8**, Loss Penalty **-3**, Division-Era Depth **-1.67**. Final raw score: **77.98**.

OVR conversion: board anchors **18.68–101.92**, normalized score **0.7124**, curved score **0.7496**, resulting in **95 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 21.05 | #4 | 10.2 adjusted credit / 14.54 benchmark |
| Opponent Quality | 24.39 | #7 | 11.46 diminished credit / 14.1 benchmark |
| Prime Dominance | 25.1 | #8 | 25.1 raw × 100.0% sample |
| Longevity | 20.58 | #10 | 98.78 counted elite months |
| Apex modifier | +5.8 | Modifier | Untouchable highlight-reel magic. |
| Loss penalty | -3 | Modifier | 7 official/technical loss events reviewed |
| Division-era depth | -1.67 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **11**. Adjusted title wins: **11**. Derived undisputed-title win count: **11**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final adjusted credit | Review note |
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

| Slot | Date | Opponent | Base/final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 2006-10-14 | Rich Franklin | 1.25 | 1 | 1.25 | UFC middleweight champion and elite title-level opponent. |
| 2 | 2008-03-01 | Dan Henderson | 1.25 | 1 | 1.25 | Elite champion-level opponent and all-time great. |
| 3 | 2007-02-03 | Travis Lutter | 1 | 1 | 1 | Top-five title-level opponent; missed-weight context does not erase opponent quality. |
| 4 | 2007-10-20 | Rich Franklin | 1 | 1 | 1 | Repeat win over former champion, still elite but repeat/age context. |
| 5 | 2010-08-07 | Chael Sonnen | 1 | 1 | 1 | Elite middleweight title challenger and real threat in rematch. |
| 6 | 2011-02-05 | Vitor Belfort | 1 | 1 | 1 | Explosive former champion and top middleweight title challenger. |
| 7 | 2012-07-07 | Chael Sonnen | 1 | 0.75 | 0.75 | Elite title challenger; difficult fight context but no performance modifier. |
| 8 | 2007-07-07 | Nate Marquardt | 0.85 | 0.75 | 0.64 | Strong ranked middleweight contender. |
| 9 | 2009-08-08 | Forrest Griffin | 0.85 | 0.75 | 0.64 | Former light heavyweight champion, timing/decline context. |
| 10 | 2010-04-10 | Demian Maia | 0.85 | 0.75 | 0.64 | Elite grappler and ranked middleweight challenger. |
| 11 | 2011-08-27 | Yushin Okami | 0.85 | 0.75 | 0.64 | Strong ranked middleweight contender. |
| 12 | 2017-02-11 | Derek Brunson | 0.85 | 0.75 | 0.64 | Strong ranked middleweight contender. |
| 13 | 2006-06-28 | Chris Leben | 0.45 | 0.5 | 0.23 | Good UFC debut win, not elite quality. |
| 14 | 2008-10-25 | Patrick Cote | 0.45 | 0.5 | 0.23 | Title challenger but weaker opponent-quality case. |
| 15 | 2009-04-18 | Thales Leites | 0.45 | 0.5 | 0.23 | Title challenger but softer contender context. |
| 16 | 2012-10-13 | Stephan Bonnar | 0.45 | 0.5 | 0.23 | Name win at light heavyweight, limited quality value. |
| 17 | 2008-07-19 | James Irvin | 0.25 | 0.5 | 0.13 | Limited opponent-quality value. |

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

#### Loss-penalty receipts

The fight-level rules create raw loss events. The final category then compresses those events through severity, frequency, and a prime-loss volume floor. Exposure: **18** fights. Severity: **2.25**. Frequency: **0.75**. Prime-volume floor: **2**. Pre-division magnitude: **3**. Final penalty: **-3**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Raw event penalty | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2013-07-06 | Chris Weidman | prime | champion-level | home | Yes | Yes | -2.25 | standard rule |
| 2013-12-28 | Chris Weidman | prime | champion-level | home | Yes | Yes | -2.25 | standard rule |
| 2016-02-27 | Michael Bisping | post-prime | top-five | home | No | Yes | 0 | standard rule |
| 2016-07-09 | Daniel Cormier | post-prime | champion-level | upward | No | Yes | 0 | standard rule |
| 2019-02-10 | Israel Adesanya | post-prime | top-five | home | No | Yes | 0 | standard rule |
| 2019-05-11 | Jared Cannonier | post-prime | top-five | home | Yes | Yes | 0 | standard rule |
| 2020-10-31 | Uriah Hall | post-prime | top-ten | home | Yes | Yes | 0 | standard rule |

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

Silva ranks here because his peak remains one of the most dominant and iconic runs in UFC history. He paired a historic middleweight title reign with rare finishing threat, long-term aura, and a level of separation that still defines elite prime dominance.

#### Why not ranked higher?

Silva does not pass the top three because the current scoring model gives Jones, St-Pierre, and Johnson stronger overall combinations of championship volume, opponent-quality wins, clean prime record, and loss context. The Weidman losses matter, and the middleweight division-strength adjustment keeps his quality-wins score below the very top tier.

#### Final takeaway

Silva is the UFC peak-aura legend: a historic champion, terrifying finisher, and one of the most influential dominant runs ever, with enough loss and opponent-strength context to keep him just behind the top three.

_Source IDs: fighter ledger verified through 2026-07-13; score owner ranking-pipeline.js; category owner category-calculators.js._

### 4. Demetrious Johnson — 95 OVR

The defining UFC flyweight champion: historic title control, elite technical dominance, and one of the cleanest prime skill sets in the sport.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 77.22 | 15-2-1 | Flyweight / Bantamweight | 12 | 11.9 | 8 | 13-1 | 81.8% | 6.15 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 21.87 | 35 | 25.52 |
| Opponent Quality | 22.34 | 25 | 18.62 |
| Prime Dominance | 25.06 | 30 | 25.06 |
| Longevity | 16.82 | 10 | 5.61 |

Base score: **74.81**. Modifiers: Apex **+5.15**, Loss Penalty **-1.51**, Division-Era Depth **-1.23**. Final raw score: **77.22**.

OVR conversion: board anchors **18.68–101.92**, normalized score **0.7033**, curved score **0.7414**, resulting in **95 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 21.87 | #3 | 10.6 adjusted credit / 14.54 benchmark |
| Opponent Quality | 22.34 | #15 | 10.5 diminished credit / 14.1 benchmark |
| Prime Dominance | 25.06 | #9 | 25.06 raw × 100.0% sample |
| Longevity | 16.82 | #17 | 80.74 counted elite months |
| Apex modifier | +5.15 | Modifier | Legendary skill and separation, with flyweight proof context. |
| Loss penalty | -1.51 | Modifier | 2 official/technical loss events reviewed |
| Division-era depth | -1.23 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **12**. Adjusted title wins: **11.9**. Derived undisputed-title win count: **12**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final adjusted credit | Review note |
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

| Slot | Date | Opponent | Base/final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 2012-09-22 | Joseph Benavidez | 1.25 | 1 | 1.25 | Elite flyweight title challenger and divisional great. |
| 2 | 2013-12-14 | Joseph Benavidez | 1.15 | 1 | 1.15 | Elite divisional great; transparent adjacent-tier timing/depth adjustment. |
| 3 | 2013-01-26 | John Dodson | 1 | 1 | 1 | Elite flyweight contender and repeat title challenger. |
| 4 | 2015-04-25 | Kyoji Horiguchi | 1 | 1 | 1 | Elite young flyweight contender, future non-UFC greatness context. |
| 5 | 2015-09-05 | John Dodson | 1 | 1 | 1 | Prime dangerous flyweight title challenger. |
| 6 | 2016-04-23 | Henry Cejudo | 1 | 1 | 1 | Earlier/pre-title Cejudo; no future-title back-credit. |
| 7 | 2012-06-08 | Ian McCall | 0.85 | 0.75 | 0.64 | Strong flyweight contender rematch win. |
| 8 | 2014-06-14 | Ali Bagautinov | 0.85 | 0.75 | 0.64 | Ranked flyweight title challenger. |
| 9 | 2011-05-28 | Miguel Torres | 0.65 | 0.75 | 0.49 | Former elite bantamweight name, UFC timing context. |
| 10 | 2013-07-27 | John Moraga | 0.65 | 0.75 | 0.49 | Ranked challenger; softer opponent-quality proof. |
| 11 | 2014-09-27 | Chris Cariaso | 0.65 | 0.75 | 0.49 | Title challenger but softer division-context value. |
| 12 | 2016-12-03 | Tim Elliott | 0.65 | 0.75 | 0.49 | Ranked challenger; softer opponent-quality proof. |
| 13 | 2017-04-15 | Wilson Reis | 0.65 | 0.5 | 0.33 | Ranked flyweight contender. |
| 14 | 2017-10-07 | Ray Borg | 0.65 | 0.5 | 0.33 | Ranked challenger; not strong Top-10 quality after timing/depth review. |
| 15 | 2011-02-05 | Norifumi Yamamoto | 0.45 | 0.5 | 0.23 | Legend name, but UFC/timing value limited. |

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

#### Loss-penalty receipts

The fight-level rules create raw loss events. The final category then compresses those events through severity, frequency, and a prime-loss volume floor. Exposure: **18** fights. Severity: **1.13**. Frequency: **0.38**. Prime-volume floor: **0.75**. Pre-division magnitude: **1.51**. Final penalty: **-1.51**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Raw event penalty | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2011-10-01 | Dominick Cruz | pre-prime | champion-level | home | No | Yes | -0.75 | standard rule |
| 2018-08-04 | Henry Cejudo | prime | top-five | home | No | Yes | -1.5 | standard rule |

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

Johnson ranks here because he built the UFC flyweight standard: a long title reign, elite technical control, strong prime dominance, and one of the best championship resumes in this ranking. His case is especially strong in title success and prime skill separation.

#### Why not ranked higher?

Johnson trails Jones and St-Pierre because his quality-wins score and flyweight division-strength context are lower in the current scoring model. His later non-UFC success adds historical context, but this ranking is based on the UFC resume.

#### Final takeaway

Johnson is the UFC flyweight benchmark: historic title success, elite prime dominance, and a clean technical style that still grades near the top of the all-time list.

_Source IDs: fighter ledger verified through 2026-07-13; score owner ranking-pipeline.js; category owner category-calculators.js._

### 5. Islam Makhachev — 93 OVR

The modern lightweight control case: elite finishing efficiency, high-end prime dominance, and a title run that keeps getting stronger.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 69.2 | 17-1 | Lightweight / Welterweight | 6 | 6.15 | 4 | 10-0 | 89.3% | 5.35 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 11.74 | 35 | 13.7 |
| Opponent Quality | 22.93 | 25 | 19.11 |
| Prime Dominance | 27.38 | 30 | 27.38 |
| Longevity | 16.18 | 10 | 5.39 |

Base score: **65.58**. Modifiers: Apex **+5.68**, Loss Penalty **-1.98**, Division-Era Depth **-0.08**. Final raw score: **69.2**.

OVR conversion: board anchors **18.68–101.92**, normalized score **0.6069**, curved score **0.6541**, resulting in **93 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 11.74 | #13 | 5.69 adjusted credit / 14.54 benchmark |
| Opponent Quality | 22.93 | #14 | 10.78 diminished credit / 14.1 benchmark |
| Prime Dominance | 27.38 | #1 | 27.38 raw × 100.0% sample |
| Longevity | 16.18 | #21 | 77.68 counted elite months |
| Apex modifier | +5.68 | Modifier | Modern lightweight title proof at an elite level. |
| Loss penalty | -1.98 | Modifier | 1 official/technical loss events reviewed |
| Division-era depth | -0.08 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **6**. Adjusted title wins: **6.15**. Derived undisputed-title win count: **6**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final adjusted credit | Review note |
| --- | --- | --- | --- | --- | --- | --- |
| 2022-10-22 | Charles Oliveira | vacant-undisputed | 0.9 | 1 | 0.9 | Elite vacant-title opponent; full opponent strength. |
| 2023-02-11 | Alexander Volkanovski | normal | 1 | 0.95 | 0.95 | P4P champ moving up; slight size/division discount. |
| 2023-10-21 | Alexander Volkanovski | normal | 1 | 0.9 | 0.9 | Short-notice moving-up rematch discount. |
| 2024-06-01 | Dustin Poirier | normal | 1 | 0.95 | 0.95 | locked |
| 2025-01-18 | Renato Moicano | normal | 1 | 0.8 | 0.8 | Short-notice softer title defense. |
| 2025-11-15 | Jack Della Maddalena | second-division-undisputed | 1.25 | 0.95 | 1.19 | Current-table second-division title opponent discount. |

#### Opponent Quality receipts

Raw win credit: **12.65**. Diminishing-return credit before fighter adjustment: **10.78**. Fighter adjustment: **0**. Final diminished credit: **10.78**.

| Slot | Date | Opponent | Base/final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 2022-10-22 | Charles Oliveira | 1.25 | 1 | 1.25 | Elite lightweight champion-level opponent. |
| 2 | 2023-02-11 | Alexander Volkanovski | 1.25 | 1 | 1.25 | P4P elite champion moving up; still champion-level quality. |
| 3 | 2024-06-01 | Dustin Poirier | 1.25 | 1 | 1.25 | Elite lightweight title challenger and former interim champion. |
| 4 | 2025-11-15 | Jack Della Maddalena | 1.25 | 1 | 1.25 | UFC welterweight champion/title-level win in second division. |
| 5 | 2023-10-21 | Alexander Volkanovski | 1 | 1 | 1 | Elite opponent, but short-notice/up-division context keeps below max. |
| 6 | 2019-04-20 | Arman Tsarukyan | 0.85 | 1 | 0.85 | Early version of future elite lightweight, high-skill win. |
| 7 | 2021-10-30 | Dan Hooker | 0.85 | 0.75 | 0.64 | Ranked lightweight contender, short-notice context noted. |
| 8 | 2022-02-26 | King Green | 0.85 | 0.75 | 0.64 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 9 | 2021-03-06 | Drew Dober | 0.65 | 0.75 | 0.49 | Quality lightweight win in prime-start window. |
| 10 | 2021-07-17 | Thiago Moises | 0.65 | 0.75 | 0.49 | Useful ranked/near-ranked lightweight win. |
| 11 | 2025-01-18 | Renato Moicano | 0.65 | 0.75 | 0.49 | Late-replacement ranked-quality title defense context. |
| 12 | 2016-09-17 | Chris Wade | 0.45 | 0.75 | 0.34 | Solid early UFC win. |
| 13 | 2017-02-11 | Nik Lentz | 0.45 | 0.5 | 0.23 | Solid veteran lightweight win. |
| 14 | 2018-01-20 | Gleison Tibau | 0.45 | 0.5 | 0.23 | Veteran win after Tibau’s best years. |
| 15 | 2019-09-07 | Davi Ramos | 0.45 | 0.5 | 0.23 | Solid specialist win. |
| 16 | 2018-07-28 | Kajan Johnson | 0.25 | 0.5 | 0.13 | Limited opponent-quality value. |
| 17 | 2015-05-23 | Leo Kuntz | 0.1 | 0.5 | 0.05 | Minimal opponent-quality value. |

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

#### Loss-penalty receipts

The fight-level rules create raw loss events. The final category then compresses those events through severity, frequency, and a prime-loss volume floor. Exposure: **18** fights. Severity: **2**. Frequency: **0.33**. Prime-volume floor: **0**. Pre-division magnitude: **2.33**. Final penalty: **-1.98**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Raw event penalty | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2015-10-03 | Adriano Martins | pre-prime | solid | home | Yes | Yes | -2 | standard rule |

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

Islam ranks here because the current scoring model sees a rare combination of elite prime dominance and a rapidly growing championship resume. His skill, control, and finishing threat already put him near the very top tier.

#### Why not ranked higher?

He is still chasing the total volume of the fighters above him. The current scoring model also carries his pre-prime Martins loss and gives him fewer total elite-year reps than the older all-time resumes above him.

#### Final takeaway

Islam is the modern lightweight benchmark: elite control, elite finishing, and a championship case that is already strong enough to sit in the all-time top five.

_Source IDs: fighter ledger verified through 2026-07-13; score owner ranking-pipeline.js; category owner category-calculators.js._

### 6. Alexander Volkanovski — 93 OVR

The complete featherweight champion case: title consistency, strong quality wins, and one of the deepest modern resumes in the sport.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 67.15 | 15-3 | Featherweight / Lightweight | 8 | 7.9 | 8 | 9-3 | 75.0% | 7.17 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 15.39 | 35 | 17.96 |
| Opponent Quality | 23.24 | 25 | 19.37 |
| Prime Dominance | 20.21 | 30 | 20.21 |
| Longevity | 20.69 | 10 | 6.9 |

Base score: **64.44**. Modifiers: Apex **+5.34**, Loss Penalty **-2.61**, Division-Era Depth **-0.02**. Final raw score: **67.15**.

OVR conversion: board anchors **18.68–101.92**, normalized score **0.5823**, curved score **0.6315**, resulting in **93 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 15.39 | #7 | 7.46 adjusted credit / 14.54 benchmark |
| Opponent Quality | 23.24 | #12 | 10.93 diminished credit / 14.1 benchmark |
| Prime Dominance | 20.21 | #29 | 20.21 raw × 100.0% sample |
| Longevity | 20.69 | #9 | 99.32 counted elite months |
| Apex modifier | +5.34 | Modifier | High-end modern featherweight apex. |
| Loss penalty | -2.61 | Modifier | 3 official/technical loss events reviewed |
| Division-era depth | -0.02 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **8**. Adjusted title wins: **7.9**. Derived undisputed-title win count: **8**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final adjusted credit | Review note |
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

| Slot | Date | Opponent | Base/final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 2019-05-11 | Jose Aldo | 1.25 | 1 | 1.25 | Former long-time champion still elite at featherweight. |
| 2 | 2019-12-14 | Max Holloway | 1.25 | 1 | 1.25 | Prime featherweight champion and all-time great. |
| 3 | 2020-07-11 | Max Holloway | 1.25 | 1 | 1.25 | Prime elite champion-level opponent; close-decision context flagged. |
| 4 | 2022-07-02 | Max Holloway | 1.25 | 1 | 1.25 | Elite champion-level opponent and legacy-defining trilogy win. |
| 5 | 2021-09-25 | Brian Ortega | 1 | 1 | 1 | Elite top featherweight title challenger. |
| 6 | 2023-07-08 | Yair Rodriguez | 1 | 1 | 1 | Interim featherweight champion and elite contender. |
| 7 | 2025-04-12 | Diego Lopes | 1 | 0.75 | 0.75 | Modern top featherweight title-level contender. |
| 8 | 2026-01-31 | Diego Lopes | 1 | 0.75 | 0.75 | Repeated modern title-level featherweight win. |
| 9 | 2018-12-29 | Chad Mendes | 0.85 | 0.75 | 0.64 | Dangerous veteran contender with layoff/context discount. |
| 10 | 2018-07-14 | Darren Elkins | 0.65 | 0.75 | 0.49 | Durable ranked-quality featherweight win. |
| 11 | 2022-04-09 | Chan Sung Jung | 0.65 | 0.75 | 0.49 | Big-name title challenger but late-career timing. |
| 12 | 2017-06-11 | Mizuto Hirota | 0.45 | 0.75 | 0.34 | Useful UFC win. |
| 13 | 2018-02-11 | Jeremy Kennedy | 0.45 | 0.5 | 0.23 | Solid UFC featherweight win. |
| 14 | 2016-11-26 | Yusuke Kasuya | 0.25 | 0.5 | 0.13 | Limited quality value. |
| 15 | 2017-11-19 | Shane Young | 0.25 | 0.5 | 0.13 | Limited quality value. |

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

#### Loss-penalty receipts

The fight-level rules create raw loss events. The final category then compresses those events through severity, frequency, and a prime-loss volume floor. Exposure: **18** fights. Severity: **1.75**. Frequency: **0.71**. Prime-volume floor: **2.75**. Pre-division magnitude: **2.75**. Final penalty: **-2.61**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Raw event penalty | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2023-02-11 | Islam Makhachev | prime | champion-level | upward | No | Yes | -0.75 | prime-upward-elite |
| 2023-10-21 | Islam Makhachev | prime | champion-level | upward | Yes | Yes | -1.25 | prime-upward-elite |
| 2024-02-17 | Ilia Topuria | prime | champion-level | home | Yes | Yes | -2.25 | standard rule |

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

Volkanovski ranks here because he checks every important box well: championship success, quality wins, consistency, and a long elite stretch at featherweight. He may not have the single highest peak score, but his overall balance is extremely strong.

#### Why not ranked higher?

The current scoring model hits him for the Topuria loss and keeps his prime-dominance score below the names with more overwhelming peaks. The up-division Islam losses are handled more lightly, but they still do not boost the resume the way a win would have.

#### Final takeaway

Volkanovski is the all-around featherweight standard: deep title work, strong quality wins, and a balanced resume with very few weak points.

_Source IDs: fighter ledger verified through 2026-07-13; score owner ranking-pipeline.js; category owner category-calculators.js._

### 7. Khabib Nurmagomedov — 92 OVR

The cleanest prime run at lightweight: unbeaten in the UFC, overwhelming round control, and the strongest dominance case in this ranking.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 63.87 | 13-0 | Lightweight / Catchweight | 4 | 3.9 | 5 | 8-0 | 92.0% | 6.02 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 7.49 | 35 | 8.74 |
| Opponent Quality | 19.47 | 25 | 16.22 |
| Prime Dominance | 27.13 | 30 | 27.13 |
| Longevity | 17.08 | 10 | 5.69 |

Base score: **57.78**. Modifiers: Apex **+6**, Loss Penalty **0**, Division-Era Depth **+0.09**. Final raw score: **63.87**.

OVR conversion: board anchors **18.68–101.92**, normalized score **0.5429**, curved score **0.5950**, resulting in **92 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 7.49 | #28 | 3.63 adjusted credit / 14.54 benchmark |
| Opponent Quality | 19.47 | #31 | 9.15 diminished credit / 14.1 benchmark |
| Prime Dominance | 27.13 | #2 | 27.13 raw × 100.0% sample |
| Longevity | 17.08 | #15 | 81.99 counted elite months |
| Apex modifier | +6 | Modifier | Complete lightweight inevitability. |
| Loss penalty | 0 | Modifier | 0 official/technical loss events reviewed |
| Division-era depth | +0.09 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **4**. Adjusted title wins: **3.9**. Derived undisputed-title win count: **4**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final adjusted credit | Review note |
| --- | --- | --- | --- | --- | --- | --- |
| 2018-04-07 | Al Iaquinta | vacant-undisputed | 0.9 | 0.75 | 0.68 | Vacant title with short-notice/questionable opponent. |
| 2018-10-06 | Conor McGregor | normal | 1 | 0.95 | 0.95 | locked |
| 2019-09-07 | Dustin Poirier | normal | 1 | 1 | 1 | locked |
| 2020-10-24 | Justin Gaethje | normal | 1 | 1 | 1 | locked |

#### Opponent Quality receipts

Raw win credit: **10**. Diminishing-return credit before fighter adjustment: **9.15**. Fighter adjustment: **0**. Final diminished credit: **9.15**.

| Slot | Date | Opponent | Base/final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 2014-04-19 | Rafael dos Anjos | 1.25 | 1 | 1.25 | Prime elite lightweight and future UFC champion. |
| 2 | 2018-10-06 | Conor McGregor | 1.25 | 1 | 1.25 | UFC two-division champion and elite lightweight title opponent. |
| 3 | 2019-09-07 | Dustin Poirier | 1.25 | 1 | 1.25 | Elite prime lightweight interim champion. |
| 4 | 2020-10-24 | Justin Gaethje | 1.25 | 1 | 1.25 | Elite prime lightweight interim champion. |
| 5 | 2017-12-30 | Edson Barboza | 1 | 1 | 1 | Dangerous top lightweight contender in a deep division. |
| 6 | 2016-11-12 | Michael Johnson | 0.85 | 1 | 0.85 | Strong ranked lightweight win with prime-speed danger. |
| 7 | 2012-07-07 | Gleison Tibau | 0.65 | 0.75 | 0.49 | Physically difficult early UFC win; close-fight context flagged. |
| 8 | 2018-04-07 | Al Iaquinta | 0.65 | 0.75 | 0.49 | Short-notice vacant-title opponent, useful but not elite. |
| 9 | 2013-01-19 | Thiago Tavares | 0.45 | 0.75 | 0.34 | Useful UFC lightweight win. |
| 10 | 2013-05-25 | Abel Trujillo | 0.45 | 0.75 | 0.34 | Solid athletic lightweight win. |
| 11 | 2013-09-21 | Pat Healy | 0.45 | 0.75 | 0.34 | Solid UFC lightweight win. |
| 12 | 2012-01-20 | Kamal Shalorus | 0.25 | 0.75 | 0.19 | Early UFC win with limited quality value. |
| 13 | 2016-04-16 | Darrell Horcher | 0.25 | 0.5 | 0.13 | Late replacement/low opponent-quality value. |

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

| From | To | Raw months | Counted months | Reason |
| --- | --- | --- | --- | --- |
| 2014-04-19 | 2016-04-16 | 23.92 | 18 | Between-fight gap capped at 18 months |

#### Loss-penalty receipts

The fight-level rules create raw loss events. The final category then compresses those events through severity, frequency, and a prime-loss volume floor. Exposure: **13** fights. Severity: **0**. Frequency: **0**. Prime-volume floor: **0**. Pre-division magnitude: **0**. Final penalty: **0**.

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

Khabib ranks here because his prime-dominance score is the strongest in the current scoring model. He combined suffocating control, elite round winning, and a perfect UFC record, giving him one of the hardest peaks to challenge in this ranking.

#### Why not ranked higher?

He does not climb higher because the current scoring model gives him less championship volume and fewer quality-wins layers than the fighters above him. His peak is elite enough to compete with anyone, but his total UFC resume is shorter.

#### Final takeaway

Khabib is the lightweight prime-dominance benchmark: unbeatable at his best, brutally efficient, and held back only by shorter championship volume than the names above him.

_Source IDs: fighter ledger verified through 2026-07-13; score owner ranking-pipeline.js; category owner category-calculators.js._

### 8. Matt Hughes — 92 OVR

Matt Hughes is ranked from the current UFC-only calculated pipeline.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 63.7 | 18-7 | Welterweight | 9 | 8.9 | 9 | 13-3 | 80.0% | 6.15 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 17.33 | 35 | 20.22 |
| Opponent Quality | 18.51 | 25 | 15.43 |
| Prime Dominance | 24.51 | 30 | 24.51 |
| Longevity | 17.59 | 10 | 5.86 |

Base score: **66.02**. Modifiers: Apex **+4.2**, Loss Penalty **-3.52**, Division-Era Depth **-3**. Final raw score: **63.7**.

OVR conversion: board anchors **18.68–101.92**, normalized score **0.5408**, curved score **0.5931**, resulting in **92 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 17.33 | #5 | 8.4 adjusted credit / 14.54 benchmark |
| Opponent Quality | 18.51 | #38 | 8.7 diminished credit / 14.1 benchmark |
| Prime Dominance | 24.51 | #10 | 24.51 raw × 100.0% sample |
| Longevity | 17.59 | #13 | 84.42 counted elite months |
| Apex modifier | +4.2 | Modifier | The GSP submission and Trigg comeback form a great championship stretch, but Trigg nearly finishing Hughes lowers performance strength, and early-version GSP limits Proof and the best-fighter claim. |
| Loss penalty | -3.52 | Modifier | 7 official/technical loss events reviewed |
| Division-era depth | -3 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **9**. Adjusted title wins: **8.9**. Derived undisputed-title win count: **9**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final adjusted credit | Review note |
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

| Slot | Date | Opponent | Base/final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 2006-09-23 | B.J. Penn | 1.25 | 1 | 1.25 | Elite champion-level opponent and former UFC champion. |
| 2 | 2003-04-25 | Sean Sherk | 1 | 1 | 1 | Elite contender and future UFC champion. |
| 3 | 2003-11-21 | Frank Trigg | 1 | 1 | 1 | Prime elite welterweight contender. |
| 4 | 2004-10-22 | Georges St-Pierre | 1 | 1 | 1 | Elite young contender, but not yet a champion-level version of GSP. |
| 5 | 2005-04-16 | Frank Trigg | 0.85 | 1 | 0.85 | Elite repeat challenger, discounted slightly on the second win because the first Trigg victory already carries the primary Top-5 proof. |
| 6 | 2001-11-02 | Carlos Newton | 0.65 | 1 | 0.65 | Former champion rematch win with old-era depth and repeat context. |
| 7 | 2002-07-13 | Carlos Newton | 0.65 | 0.75 | 0.49 | Title win with weird finish context. |
| 8 | 2004-06-19 | Renato Verissimo | 0.65 | 0.75 | 0.49 | Ranked-quality welterweight contender, but a brief UFC run does not support Top-10 credit. |
| 9 | 2002-03-22 | Hayato Sakurai | 0.45 | 0.75 | 0.34 | Strong name historically, UFC timing limits value. |
| 10 | 2005-11-19 | Joe Riggs | 0.45 | 0.75 | 0.34 | Late-replacement title opponent who missed weight; useful win but not ranked-quality proof. |
| 11 | 2007-03-03 | Chris Lytle | 0.45 | 0.75 | 0.34 | Durable veteran welterweight win. |
| 12 | 2009-05-23 | Matt Serra | 0.45 | 0.75 | 0.34 | Former champion name, but age, timing, and a limited post-title run keep the 2009 win below ranked-quality credit. |
| 13 | 2010-08-07 | Ricardo Almeida | 0.45 | 0.5 | 0.23 | Useful late-career welterweight win, but age and division timing keep it below ranked-quality credit. |
| 14 | 1999-09-24 | Valeri Ignatov | 0.25 | 0.5 | 0.13 | Early UFC tournament win with limited established opponent-quality value. |
| 15 | 2000-06-09 | Marcelo Aguiar | 0.25 | 0.5 | 0.13 | Early UFC win with limited established opponent-quality value. |
| 16 | 2002-11-22 | Gil Castillo | 0.1 | 0.5 | 0.05 | Low-end UFC quality win with limited contender relevance. |
| 17 | 2006-05-27 | Royce Gracie | 0.1 | 0.5 | 0.05 | Historic name, but age and an eleven-year layoff leave minimal opponent-quality value in 2006. |
| 18 | 2010-04-10 | Renzo Gracie | 0.1 | 0.5 | 0.05 | Legendary name, but age, inactivity, and UFC timing leave minimal opponent-quality value. |

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

#### Loss-penalty receipts

The fight-level rules create raw loss events. The final category then compresses those events through severity, frequency, and a prime-loss volume floor. Exposure: **19** fights. Severity: **2.25**. Frequency: **1.38**. Prime-volume floor: **3**. Pre-division magnitude: **3.63**. Final penalty: **-3.52**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Raw event penalty | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2000-12-16 | Dennis Hallman | pre-prime | solid | home | Yes | Yes | -2 | standard rule |
| 2004-01-31 | B.J. Penn | prime | top-five | home | Yes | Yes | -2.25 | standard rule |
| 2006-11-18 | Georges St-Pierre | prime | top-five | home | Yes | Yes | -2.25 | standard rule |
| 2007-12-29 | Georges St-Pierre | prime | top-five | home | Yes | Yes | -2.25 | standard rule |
| 2008-06-07 | Thiago Alves | post-prime | top-five | home | Yes | Yes | 0 | standard rule |
| 2010-11-20 | B.J. Penn | post-prime | top-five | home | Yes | Yes | 0 | standard rule |
| 2011-09-24 | Josh Koscheck | post-prime | top-five | home | Yes | Yes | 0 | standard rule |

#### Division-strength context

Default division key: **hughes-welterweight-1.0**. Era-ledger division multiplier: **1.02**. Division-era modifier: **-3**.

Newton II through GSP III.

#### Key judgment calls

- **Prime window:** Carlos Newton II → Georges St-Pierre III.
- **Coverage:** Complete UFC ledger. Early non-UFC career is excluded.
- **Loss endpoint:** Penn I and GSP II did not end it because Hughes stayed title-level. GSP III closes window.

#### Why ranked here

Matt Hughes ranks #8 because Prime Dominance and Championship provide the largest weighted parts of a 63.7 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

#### Why not ranked higher?

Matt Hughes is 0.17 raw points behind #7 Khabib Nurmagomedov. The largest category separation versus that next target is currently Prime Dominance; future movement must be earned through new UFC evidence and a full pipeline rerun.

#### Final takeaway

Matt Hughes ranks #8 because Prime Dominance and Championship provide the largest weighted parts of a 63.7 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

_Source IDs: fighter ledger verified through 2026-07-13; score owner ranking-pipeline.js; category owner category-calculators.js._

### 9. Kamaru Usman — 92 OVR

Kamaru Usman is ranked from the current UFC-only calculated pipeline.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 63.25 | 16-3 | Welterweight / Middleweight | 6 | 6 | 8 | 8-3 | 70.8% | 7.47 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 11.45 | 35 | 13.36 |
| Opponent Quality | 24.02 | 25 | 20.02 |
| Prime Dominance | 21.82 | 30 | 21.82 |
| Longevity | 14.08 | 10 | 4.69 |

Base score: **59.89**. Modifiers: Apex **+5.48**, Loss Penalty **-2.39**, Division-Era Depth **+0.27**. Final raw score: **63.25**.

OVR conversion: board anchors **18.68–101.92**, normalized score **0.5354**, curved score **0.5880**, resulting in **92 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 11.45 | #14 | 5.55 adjusted credit / 14.54 benchmark |
| Opponent Quality | 24.02 | #8 | 11.29 diminished credit / 14.1 benchmark |
| Prime Dominance | 21.82 | #20 | 21.82 raw × 100.0% sample |
| Longevity | 14.08 | #27 | 67.56 counted elite months |
| Apex modifier | +5.48 | Modifier | Elite welterweight king proof. |
| Loss penalty | -2.39 | Modifier | 3 official/technical loss events reviewed |
| Division-era depth | +0.27 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **6**. Adjusted title wins: **6**. Derived undisputed-title win count: **6**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final adjusted credit | Review note |
| --- | --- | --- | --- | --- | --- | --- |
| 2019-03-02 | Tyron Woodley | normal | 1 | 1 | 1 | locked |
| 2019-12-14 | Colby Covington | normal | 1 | 0.95 | 0.95 | locked |
| 2020-07-11 | Jorge Masvidal | normal | 1 | 0.85 | 0.85 | locked |
| 2021-02-13 | Gilbert Burns | normal | 1 | 0.95 | 0.95 | locked |
| 2021-04-24 | Jorge Masvidal | normal | 1 | 0.85 | 0.85 | locked |
| 2021-11-06 | Colby Covington | normal | 1 | 0.95 | 0.95 | locked |

#### Opponent Quality receipts

Raw win credit: **13.4**. Diminishing-return credit before fighter adjustment: **11.29**. Fighter adjustment: **0**. Final diminished credit: **11.29**.

| Slot | Date | Opponent | Base/final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 2019-03-02 | Tyron Woodley | 1.25 | 1 | 1.25 | UFC welterweight champion and elite title-level opponent. |
| 2 | 2019-12-14 | Colby Covington | 1.25 | 1 | 1.25 | Prime elite welterweight title challenger. |
| 3 | 2021-11-06 | Colby Covington | 1.25 | 1 | 1.25 | Repeat win over elite welterweight title challenger. |
| 4 | 2015-12-19 | Leon Edwards | 1 | 1 | 1 | Early win over future elite champion; not prime Leon yet. |
| 5 | 2018-11-30 | Rafael dos Anjos | 1 | 1 | 1 | Former lightweight champion and strong welterweight contender. |
| 6 | 2021-02-13 | Gilbert Burns | 1 | 1 | 1 | Elite welterweight contender and title challenger. |
| 7 | 2025-06-14 | Joaquin Buckley | 1 | 0.75 | 0.75 | Modern top-five welterweight win. |
| 8 | 2018-05-19 | Demian Maia | 0.85 | 0.75 | 0.64 | Elite grappler and ranked welterweight veteran. |
| 9 | 2020-07-11 | Jorge Masvidal | 0.85 | 0.75 | 0.64 | High-profile ranked contender, title-opponent context. |
| 10 | 2021-04-24 | Jorge Masvidal | 0.85 | 0.75 | 0.64 | Repeat ranked contender win, less fresh than first. |
| 11 | 2016-11-19 | Warlley Alves | 0.65 | 0.75 | 0.49 | Strong prospect/contender-climb win. |
| 12 | 2017-04-08 | Sean Strickland | 0.65 | 0.75 | 0.49 | Early Strickland welterweight win before later middleweight peak. |
| 13 | 2017-09-16 | Sergio Moraes | 0.65 | 0.5 | 0.33 | Useful welterweight win on contender climb. |
| 14 | 2016-07-23 | Alexander Yakovlev | 0.45 | 0.5 | 0.23 | Useful UFC win. |
| 15 | 2018-01-14 | Emil Meek | 0.45 | 0.5 | 0.23 | Solid UFC welterweight win. |
| 16 | 2015-07-12 | Hayder Hassan | 0.25 | 0.5 | 0.13 | Low-end UFC quality value. |

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

#### Loss-penalty receipts

The fight-level rules create raw loss events. The final category then compresses those events through severity, frequency, and a prime-loss volume floor. Exposure: **17** fights. Severity: **1.88**. Frequency: **0.66**. Prime-volume floor: **1.75**. Pre-division magnitude: **2.54**. Final penalty: **-2.39**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Raw event penalty | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2022-08-20 | Leon Edwards | prime | top-five | home | Yes | Yes | -2.25 | standard rule |
| 2023-03-18 | Leon Edwards | prime | champion-level | home | No | Yes | -1.5 | standard rule |
| 2023-10-21 | Khamzat Chimaev | post-prime | top-five | upward | No | Yes | 0 | prime-upward-elite |

#### Division-strength context

Default division key: **usman-welterweight-1.05**. Era-ledger division multiplier: **1.04**. Division-era modifier: **+0.27**.

Maia through Edwards III. Khamzat is post-prime/up-division.

#### Key judgment calls

- **Prime window:** Demian Maia → Leon Edwards III.
- **Coverage:** Complete UFC ledger through Buckley. Scheduled Dricus du Plessis fight is future and excluded.
- **Loss endpoint:** Edwards II did not end it because of immediate title rematch. Edwards III is the unrecovered endpoint.

#### Why ranked here

Kamaru Usman ranks #9 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 63.25 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

#### Why not ranked higher?

Kamaru Usman is 0.45 raw points behind #8 Matt Hughes. The largest category separation versus that next target is currently Championship; future movement must be earned through new UFC evidence and a full pipeline rerun.

#### Final takeaway

Kamaru Usman ranks #9 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 63.25 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

_Source IDs: fighter ledger verified through 2026-07-13; score owner ranking-pipeline.js; category owner category-calculators.js._

### 10. Max Holloway — 92 OVR

The volume case: relentless pace, elite quality wins, and one of the longest useful elite windows in the featherweight era.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 63.08 | 24-9 | Featherweight / Lightweight | 5 | 4.75 | 11 | 16-6 | 58.8% | 11.24 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 8.95 | 35 | 10.44 |
| Opponent Quality | 27.87 | 25 | 23.23 |
| Prime Dominance | 19.1 | 30 | 19.1 |
| Longevity | 30 | 10 | 10 |

Base score: **62.77**. Modifiers: Apex **+4.89**, Loss Penalty **-4.37**, Division-Era Depth **-0.21**. Final raw score: **63.08**.

OVR conversion: board anchors **18.68–101.92**, normalized score **0.5334**, curved score **0.5861**, resulting in **92 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 8.95 | #20 | 4.34 adjusted credit / 14.54 benchmark |
| Opponent Quality | 27.87 | #3 | 13.1 diminished credit / 14.1 benchmark |
| Prime Dominance | 19.1 | #38 | 19.1 raw × 100.0% sample |
| Longevity | 30 | #1 | 150.03 counted elite months |
| Apex modifier | +4.89 | Modifier | The consecutive elite stoppages merit more Aura while the existing Proof and best-fighter Claim remain appropriately calibrated. |
| Loss penalty | -4.37 | Modifier | 9 official/technical loss events reviewed |
| Division-era depth | -0.21 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **5**. Adjusted title wins: **4.75**. Derived undisputed-title win count: **4**. Interim-title win count: **1**.

| Date | Opponent | Title type | Base | Opponent strength | Final adjusted credit | Review note |
| --- | --- | --- | --- | --- | --- | --- |
| 2016-12-10 | Anthony Pettis | interim | 0.75 | 0.85 | 0.64 | Interim title and Pettis at featherweight discount. |
| 2017-06-03 | Jose Aldo | normal | 1 | 0.95 | 0.95 | locked |
| 2017-12-02 | Jose Aldo | normal | 1 | 0.95 | 0.95 | locked |
| 2018-12-08 | Brian Ortega | normal | 1 | 0.9 | 0.9 | locked |
| 2019-07-27 | Frankie Edgar | normal | 1 | 0.9 | 0.9 | Cody-approved undisputed title defense over an older but still elite former champion. |

#### Opponent Quality receipts

Raw win credit: **17.55**. Diminishing-return credit before fighter adjustment: **13.1**. Fighter adjustment: **0**. Final diminished credit: **13.1**.

| Slot | Date | Opponent | Base/final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 2017-06-03 | Jose Aldo | 1.25 | 1 | 1.25 | Prime/near-prime featherweight champion and all-time great. |
| 2 | 2017-12-02 | Jose Aldo | 1.25 | 1 | 1.25 | Immediate repeat over elite champion-level Aldo. |
| 3 | 2024-04-13 | Justin Gaethje | 1.25 | 1 | 1.25 | Elite lightweight win while moving up. |
| 4 | 2018-12-08 | Brian Ortega | 1 | 1 | 1 | Undefeated elite featherweight title challenger. |
| 5 | 2019-07-27 | Frankie Edgar | 1 | 1 | 1 | Former UFC champion and top featherweight contender, aged context noted. |
| 6 | 2021-01-16 | Calvin Kattar | 1 | 1 | 1 | Prime top featherweight contender. |
| 7 | 2021-11-13 | Yair Rodriguez | 1 | 0.75 | 0.75 | Elite featherweight contender and future interim champion. |
| 8 | 2023-04-15 | Arnold Allen | 1 | 0.75 | 0.75 | Prime top featherweight contender. |
| 9 | 2025-07-19 | Dustin Poirier | 1 | 0.75 | 0.75 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 10 | 2015-04-18 | Cub Swanson | 0.85 | 0.75 | 0.64 | Strong veteran featherweight contender. |
| 11 | 2016-06-04 | Ricardo Lamas | 0.85 | 0.75 | 0.64 | Former title challenger and ranked featherweight. |
| 12 | 2016-12-10 | Anthony Pettis | 0.85 | 0.75 | 0.64 | Former UFC champion, featherweight/timing context. |
| 13 | 2023-08-26 | Chan Sung Jung | 0.85 | 0.5 | 0.42 | Strong ranked featherweight name with late-career timing. |
| 14 | 2015-08-23 | Charles Oliveira | 0.65 | 0.5 | 0.33 | Early Oliveira featherweight win with injury/weird ending context. |
| 15 | 2015-12-12 | Jeremy Stephens | 0.65 | 0.5 | 0.33 | Dangerous ranked featherweight win. |
| 16 | 2012-12-29 | Leonard Garcia | 0.45 | 0.5 | 0.23 | Useful early UFC win. |
| 17 | 2014-04-26 | Andre Fili | 0.45 | 0.5 | 0.23 | Solid UFC featherweight win. |
| 18 | 2014-08-23 | Clay Collard | 0.45 | 0.5 | 0.23 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 19 | 2014-10-04 | Akira Corassani | 0.45 | 0.25 | 0.11 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 20 | 2015-02-14 | Cole Miller | 0.45 | 0.25 | 0.11 | Solid UFC win. |
| 21 | 2012-08-11 | Justin Lawrence | 0.25 | 0.25 | 0.06 | Limited quality value. |
| 22 | 2014-01-04 | Will Chope | 0.25 | 0.25 | 0.06 | Low-end early UFC quality value. |
| 23 | 2026-07-11 | Conor McGregor | 0.25 | 0.25 | 0.06 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 24 | 2012-06-01 | Pat Schilling | 0.1 | 0.25 | 0.03 | Minimal opponent-quality value. |

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

#### Loss-penalty receipts

The fight-level rules create raw loss events. The final category then compresses those events through severity, frequency, and a prime-loss volume floor. Exposure: **33** fights. Severity: **2.13**. Frequency: **1.23**. Prime-volume floor: **4.75**. Pre-division magnitude: **4.75**. Final penalty: **-4.37**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Raw event penalty | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2012-02-04 | Dustin Poirier | pre-prime | top-ten | home | Yes | Yes | -2 | standard rule |
| 2013-05-25 | Dennis Bermudez | pre-prime | top-ten | home | No | Yes | -1.25 | standard rule |
| 2013-08-17 | Conor McGregor | pre-prime | top-ten | home | No | Yes | -1.25 | standard rule |
| 2019-04-13 | Dustin Poirier | prime | top-five | upward | No | Yes | -0.75 | prime-upward-elite |
| 2019-12-14 | Alexander Volkanovski | prime | top-five | home | No | Yes | -1.5 | standard rule |
| 2020-07-11 | Alexander Volkanovski | prime | champion-level | home | No | Yes | -1.5 | standard rule |
| 2022-07-02 | Alexander Volkanovski | prime | champion-level | home | No | Yes | -1.5 | standard rule |
| 2024-10-26 | Ilia Topuria | prime | champion-level | home | Yes | Yes | -2.25 | standard rule |
| 2026-03-07 | Charles Oliveira | prime | top-five | home | No | Yes | -1.5 | standard rule |

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

Holloway ranks here because his quality-wins score and longevity score are both elite. Few fighters in this ranking have stacked as many meaningful UFC wins over as long a stretch.

#### Why not ranked higher?

He sits below the very top names because the current scoring model gives him less championship control and more resume drag from total losses. The volume is impressive, but the belt dominance is not on the level of the names above him.

#### Final takeaway

Holloway is the volume-and-quality-wins monster of this ranking: one of the deepest win ledgers in the UFC, backed by real longevity, even without a top-tier championship score.

_Source IDs: fighter ledger verified through 2026-07-13; score owner ranking-pipeline.js; category owner category-calculators.js._

### 11. Stipe Miocic — 92 OVR

Stipe Miocic is ranked from the current UFC-only calculated pipeline.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 62.92 | 14-5 | Heavyweight | 6 | 6 | 8 | 8-3 | 71.0% | 6.29 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 11.97 | 35 | 13.97 |
| Opponent Quality | 21.86 | 25 | 18.22 |
| Prime Dominance | 24.17 | 30 | 24.17 |
| Longevity | 15.53 | 10 | 5.18 |

Base score: **61.54**. Modifiers: Apex **+5.01**, Loss Penalty **-3.46**, Division-Era Depth **-0.17**. Final raw score: **62.92**.

OVR conversion: board anchors **18.68–101.92**, normalized score **0.5315**, curved score **0.5843**, resulting in **92 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 11.97 | #11 | 5.8 adjusted credit / 14.54 benchmark |
| Opponent Quality | 21.86 | #19 | 10.28 diminished credit / 14.1 benchmark |
| Prime Dominance | 24.17 | #12 | 24.17 raw × 100.0% sample |
| Longevity | 15.53 | #24 | 74.55 counted elite months |
| Apex modifier | +5.01 | Modifier | Winning the title from Werdum and shutting out Ngannou support a 5.00-level heavyweight Apex. |
| Loss penalty | -3.46 | Modifier | 5 official/technical loss events reviewed |
| Division-era depth | -0.17 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **6**. Adjusted title wins: **6**. Derived undisputed-title win count: **6**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final adjusted credit | Review note |
| --- | --- | --- | --- | --- | --- | --- |
| 2016-05-14 | Fabricio Werdum | normal | 1 | 1 | 1 | locked |
| 2016-09-10 | Alistair Overeem | normal | 1 | 0.95 | 0.95 | locked |
| 2017-05-13 | Junior dos Santos | normal | 1 | 0.95 | 0.95 | locked |
| 2018-01-20 | Francis Ngannou | normal | 1 | 0.95 | 0.95 | locked |
| 2019-08-17 | Daniel Cormier | normal | 1 | 1 | 1 | locked |
| 2020-08-15 | Daniel Cormier | normal | 1 | 0.95 | 0.95 | locked |

#### Opponent Quality receipts

Raw win credit: **11.6**. Diminishing-return credit before fighter adjustment: **10.28**. Fighter adjustment: **0**. Final diminished credit: **10.28**.

| Slot | Date | Opponent | Base/final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 2016-05-14 | Fabricio Werdum | 1.25 | 1 | 1.25 | UFC heavyweight champion and elite title-level opponent. |
| 2 | 2018-01-20 | Francis Ngannou | 1.25 | 1 | 1.25 | Elite heavyweight title challenger and future champion. |
| 3 | 2019-08-17 | Daniel Cormier | 1.25 | 1 | 1.25 | Elite champion-level heavyweight/light heavyweight great. |
| 4 | 2020-08-15 | Daniel Cormier | 1.25 | 1 | 1.25 | Repeat win over elite champion-level opponent. |
| 5 | 2016-09-10 | Alistair Overeem | 1 | 1 | 1 | Elite heavyweight title challenger. |
| 6 | 2017-05-13 | Junior dos Santos | 1 | 1 | 1 | Former UFC champion and top heavyweight contender. |
| 7 | 2015-05-10 | Mark Hunt | 0.85 | 0.75 | 0.64 | Dangerous ranked heavyweight veteran. |
| 8 | 2016-01-02 | Andrei Arlovski | 0.85 | 0.75 | 0.64 | Former champion on relevant win streak. |
| 9 | 2013-06-15 | Roy Nelson | 0.65 | 0.75 | 0.49 | Ranked heavyweight veteran. |
| 10 | 2014-01-25 | Gabriel Gonzaga | 0.65 | 0.75 | 0.49 | Ranked heavyweight veteran. |
| 11 | 2012-02-15 | Phil De Fries | 0.45 | 0.75 | 0.34 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 12 | 2012-05-26 | Shane del Rosario | 0.45 | 0.75 | 0.34 | Solid early UFC heavyweight win. |
| 13 | 2014-05-31 | Fabio Maldonado | 0.45 | 0.5 | 0.23 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 14 | 2011-10-08 | Joey Beltran | 0.25 | 0.5 | 0.13 | Low-end UFC quality value. |

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

#### Loss-penalty receipts

The fight-level rules create raw loss events. The final category then compresses those events through severity, frequency, and a prime-loss volume floor. Exposure: **18** fights. Severity: **2.25**. Frequency: **1.21**. Prime-volume floor: **2**. Pre-division magnitude: **3.46**. Final penalty: **-3.46**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Raw event penalty | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2012-09-29 | Stefan Struve | pre-prime | top-ten | home | Yes | Yes | -2 | standard rule |
| 2014-12-13 | Junior dos Santos | pre-prime | top-five | home | No | Yes | -0.75 | standard rule |
| 2018-07-07 | Daniel Cormier | prime | top-five | home | Yes | Yes | -2.25 | standard rule |
| 2021-03-27 | Francis Ngannou | prime | top-five | home | Yes | Yes | -2.25 | standard rule |
| 2024-11-16 | Jon Jones | post-prime | champion-level | home | Yes | Yes | 0 | standard rule |

#### Division-strength context

Default division key: **stipe-heavyweight-1.0**. Era-ledger division multiplier: **0.96**. Division-era modifier: **-0.17**.

Mark Hunt through Ngannou II.

#### Key judgment calls

- **Prime window:** Mark Hunt → Francis Ngannou II.
- **Coverage:** Complete UFC ledger. Prime ends with the second Ngannou fight; Jones is post-prime.
- **Loss endpoint:** Cormier I did not end it because Stipe recovered and won the trilogy. Ngannou II is endpoint. Jones late fight is post-prime.

#### Why ranked here

Stipe Miocic ranks #11 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 62.92 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

#### Why not ranked higher?

Stipe Miocic is 0.16 raw points behind #10 Max Holloway. The largest category separation versus that next target is currently Longevity; future movement must be earned through new UFC evidence and a full pipeline rerun.

#### Final takeaway

Stipe Miocic ranks #11 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 62.92 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

_Source IDs: fighter ledger verified through 2026-07-13; score owner ranking-pipeline.js; category owner category-calculators.js._

### 12. Jose Aldo — 92 OVR

The longevity legend: an elite featherweight reign plus a late-career bantamweight resurgence that keeps his UFC case alive across eras.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 62.69 | 14-9 | Featherweight / Bantamweight | 8 | 7.75 | 7 | 8-3 | 69.0% | 6.59 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 14.88 | 35 | 17.36 |
| Opponent Quality | 23.06 | 25 | 19.22 |
| Prime Dominance | 17.44 | 30 | 17.44 |
| Longevity | 29.7 | 10 | 9.9 |

Base score: **63.92**. Modifiers: Apex **+4.96**, Loss Penalty **-5.15**, Division-Era Depth **-1.04**. Final raw score: **62.69**.

OVR conversion: board anchors **18.68–101.92**, normalized score **0.5287**, curved score **0.5818**, resulting in **92 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 14.88 | #9 | 7.21 adjusted credit / 14.54 benchmark |
| Opponent Quality | 23.06 | #13 | 10.84 diminished credit / 14.1 benchmark |
| Prime Dominance | 17.44 | #50 | 17.44 raw × 100.0% sample |
| Longevity | 29.7 | #2 | 142.54 counted elite months |
| Apex modifier | +4.96 | Modifier | Two elite UFC title wins establish excellent Proof and a real best-fighter claim, while the Aura score stays conservative and WEC remains excluded. |
| Loss penalty | -5.15 | Modifier | 9 official/technical loss events reviewed |
| Division-era depth | -1.04 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **8**. Adjusted title wins: **7.75**. Derived undisputed-title win count: **7**. Interim-title win count: **1**.

| Date | Opponent | Title type | Base | Opponent strength | Final adjusted credit | Review note |
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

| Slot | Date | Opponent | Base/final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 2013-02-02 | Frankie Edgar | 1.25 | 1 | 1.25 | Former UFC champion moving down while still elite and title-caliber. |
| 2 | 2011-10-08 | Kenny Florian | 1 | 1 | 1 | Former title challenger and elite contender moving down. |
| 3 | 2012-01-14 | Chad Mendes | 1 | 1 | 1 | Prime top-five featherweight title challenger. |
| 4 | 2013-08-03 | Chan Sung Jung | 1 | 1 | 1 | Elite featherweight title challenger. |
| 5 | 2014-02-01 | Ricardo Lamas | 1 | 1 | 1 | Prime top featherweight title challenger. |
| 6 | 2014-10-25 | Chad Mendes | 1 | 1 | 1 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 7 | 2016-07-09 | Frankie Edgar | 1 | 0.75 | 0.75 | Elite featherweight rematch win, with aging/repeat context below max. |
| 8 | 2011-04-30 | Mark Hominick | 0.85 | 0.75 | 0.64 | Legit title challenger but softer than Aldo’s best UFC wins. |
| 9 | 2018-07-28 | Jeremy Stephens | 0.85 | 0.75 | 0.64 | Dangerous ranked featherweight win. |
| 10 | 2019-02-02 | Renato Moicano | 0.85 | 0.75 | 0.64 | Strong ranked featherweight contender. |
| 11 | 2021-08-07 | Pedro Munhoz | 0.85 | 0.75 | 0.64 | Strong ranked bantamweight win. |
| 12 | 2021-12-04 | Rob Font | 0.85 | 0.75 | 0.64 | Strong ranked bantamweight win late in Aldo’s UFC run. |
| 13 | 2020-12-19 | Marlon Vera | 0.65 | 0.5 | 0.33 | Ranked bantamweight win with contender relevance. |
| 14 | 2024-05-04 | Jonathan Martinez | 0.65 | 0.5 | 0.33 | Late-career ranked bantamweight win. |

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

#### Loss-penalty receipts

The fight-level rules create raw loss events. The final category then compresses those events through severity, frequency, and a prime-loss volume floor. Exposure: **20** fights. Severity: **2.25**. Frequency: **2.03**. Prime-volume floor: **5.25**. Pre-division magnitude: **5.25**. Final penalty: **-5.15**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Raw event penalty | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2015-12-12 | Conor McGregor | prime | champion-level | home | Yes | Yes | -2.25 | standard rule |
| 2017-06-03 | Max Holloway | prime | top-five | home | Yes | Yes | -2.25 | standard rule |
| 2017-12-02 | Max Holloway | prime | champion-level | home | Yes | Yes | -2.25 | standard rule |
| 2019-05-11 | Alexander Volkanovski | prime | top-five | home | No | Yes | -1.5 | standard rule |
| 2019-12-14 | Marlon Moraes | prime | top-five | downward | No | Yes | -1.5 | standard rule |
| 2020-07-11 | Petr Yan | prime | top-five | downward | Yes | Yes | -2.25 | standard rule |
| 2022-08-20 | Merab Dvalishvili | prime | top-five | downward | No | Yes | -1.5 | standard rule |
| 2024-10-05 | Mario Bautista | post-prime | top-ten | downward | No | Yes | 0 | standard rule |
| 2025-05-10 | Aiemann Zahabi | post-prime | top-ten | downward | No | Yes | 0 | standard rule |

#### Division-strength context

Default division key: **aldo-ufc-featherweight-1.0**. Era-ledger division multiplier: **1.01**. Division-era modifier: **-1.04**.

Hominick through Merab.

#### Key judgment calls

- **UFC-only scope:** means the all-time WEC case is context only, not scored directly.
- **Longevity:** is the clear strength of the Aldo profile and one of the best scores in this ranking.
- **Interim title:** the UFC 200 interim win adds partial championship credit.
- **Post-prime stretch:** the bantamweight resurgence helps longevity even though late losses are less damaging.
- **Prime dominance:** sits lower than fans may expect, which is why his total rank lands outside the top ten here.

#### Why ranked here

Aldo ranks here because the current scoring model rewards his long elite shelf life, strong title work, and years of quality wins. His resume stays relevant because he held up across multiple generations of contenders.

#### Why not ranked higher?

The current scoring model is UFC-only, so his WEC era is not carrying him here. His later UFC losses and a lower prime-dominance score than the names above him keep him just outside the top ten.

#### Final takeaway

Aldo is the longevity legend of this ranking: a great champion with a long shelf life, strong quality wins, and a UFC-only profile that still holds up near the top ten.

_Source IDs: fighter ledger verified through 2026-07-13; score owner ranking-pipeline.js; category owner category-calculators.js._

### 13. Randy Couture — 92 OVR

Randy Couture is ranked from the current UFC-only calculated pipeline.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 60.99 | 16-8 | Heavyweight / Light Heavyweight | 9 | 8.75 | 9 | 6-3 | 80.8% | 4.22 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 15.85 | 35 | 18.49 |
| Opponent Quality | 19.79 | 25 | 16.49 |
| Prime Dominance | 21.15 | 30 | 21.15 |
| Longevity | 26.07 | 10 | 8.69 |

Base score: **64.82**. Modifiers: Apex **+4.42**, Loss Penalty **-5.25**, Division-Era Depth **-3**. Final raw score: **60.99**.

OVR conversion: board anchors **18.68–101.92**, normalized score **0.5083**, curved score **0.5626**, resulting in **92 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 15.85 | #6 | 7.68 adjusted credit / 14.54 benchmark |
| Opponent Quality | 19.79 | #29 | 9.3 diminished credit / 14.1 benchmark |
| Prime Dominance | 21.15 | #25 | 21.15 raw × 100.0% sample |
| Longevity | 26.07 | #5 | 125.14 counted elite months |
| Apex modifier | +4.42 | Modifier | Returning from retirement to dominate Sylvia and stop Gonzaga creates a clear championship Apex despite lower raw performance ratings. |
| Loss penalty | -5.25 | Modifier | 8 official/technical loss events reviewed |
| Division-era depth | -3 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **9**. Adjusted title wins: **8.75**. Derived undisputed-title win count: **8**. Interim-title win count: **1**.

| Date | Opponent | Title type | Base | Opponent strength | Final adjusted credit | Review note |
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

| Slot | Date | Opponent | Base/final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 2003-06-06 | Chuck Liddell | 1.25 | 1 | 1.25 | Elite light heavyweight champion-level opponent. |
| 2 | 2003-09-26 | Tito Ortiz | 1.25 | 1 | 1.25 | UFC light heavyweight champion and elite rival. |
| 3 | 1997-10-17 | Vitor Belfort | 0.85 | 1 | 0.85 | Elite young talent, but not a modern proven top-five UFC résumé at the time. |
| 4 | 2000-11-17 | Kevin Randleman | 0.85 | 1 | 0.85 | UFC heavyweight champion with old-era depth calibration. |
| 5 | 2001-05-04 | Pedro Rizzo | 0.85 | 1 | 0.85 | High-level heavyweight title challenger with old-era depth calibration. |
| 6 | 2001-11-02 | Pedro Rizzo | 0.85 | 1 | 0.85 | Elite contender, close first fight context. |
| 7 | 2007-03-03 | Tim Sylvia | 0.85 | 0.75 | 0.64 | UFC heavyweight champion, discounted for softer heavyweight-era depth. |
| 8 | 2007-08-25 | Gabriel Gonzaga | 0.85 | 0.75 | 0.64 | Dangerous heavyweight contender after Cro Cop upset. |
| 9 | 1997-12-21 | Maurice Smith | 0.65 | 0.75 | 0.49 | Historic UFC champion win, but shallow early-era field limits opponent-quality value. |
| 10 | 1997-05-30 | Steven Graham | 0.45 | 0.75 | 0.34 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 11 | 1997-05-30 | Tony Halme | 0.45 | 0.75 | 0.34 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 12 | 2004-08-21 | Vitor Belfort | 0.45 | 0.75 | 0.34 | Rubber match win with injury/cut rivalry and repeat context. |
| 13 | 2005-08-20 | Mike van Arsdale | 0.45 | 0.5 | 0.23 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 14 | 2009-11-14 | Brandon Vera | 0.45 | 0.5 | 0.23 | Relevant heavyweight/light-heavyweight name, but limited proven elite standing. |
| 15 | 2010-02-06 | Mark Coleman | 0.25 | 0.5 | 0.13 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 16 | 2010-08-28 | James Toney | 0.1 | 0.5 | 0.05 | Celebrity/specialist fight with minimal opponent-quality value. |

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

| From | To | Raw months | Counted months | Reason |
| --- | --- | --- | --- | --- |
| 1997-12-21 | 2000-11-17 | 34.89 | 18 | Between-fight gap capped at 18 months |

#### Loss-penalty receipts

The fight-level rules create raw loss events. The final category then compresses those events through severity, frequency, and a prime-loss volume floor. Exposure: **19** fights. Severity: **2.25**. Frequency: **2.13**. Prime-volume floor: **5.25**. Pre-division magnitude: **5.25**. Final penalty: **-5.25**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Raw event penalty | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2002-03-22 | Josh Barnett | prime | top-five | home | Yes | Yes | -2.25 | standard rule |
| 2002-09-27 | Ricco Rodriguez | prime | top-five | home | Yes | Yes | -2.25 | standard rule |
| 2004-01-31 | Vitor Belfort | prime | top-five | home | Yes | Yes | -2.25 | standard rule |
| 2005-04-16 | Chuck Liddell | prime | top-five | home | Yes | Yes | -2.25 | standard rule |
| 2006-02-04 | Chuck Liddell | prime | champion-level | home | Yes | Yes | -2.25 | standard rule |
| 2008-11-15 | Brock Lesnar | prime | top-five | home | Yes | Yes | -2.25 | standard rule |
| 2009-08-29 | Antonio Rodrigo Nogueira | post-prime | top-five | home | No | Yes | 0 | standard rule |
| 2011-04-30 | Lyoto Machida | post-prime | top-five | home | Yes | Yes | 0 | standard rule |

#### Division-strength context

Default division key: **couture-heavyweight-lhw-0.95**. Era-ledger division multiplier: **0.96**. Division-era modifier: **-3**.

Vitor II through Brock.

#### Key judgment calls

- **Prime window:** Vitor Belfort I → Brock Lesnar.
- **Coverage:** Complete UFC-only ledger. Tournament wins count as UFC wins but not official title-fight wins.
- **Loss endpoint:** Liddell losses were recovered by heavyweight title comeback. Brock closes late UFC elite-prime window.

#### Why ranked here

Randy Couture ranks #13 because Prime Dominance and Championship provide the largest weighted parts of a 60.99 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

#### Why not ranked higher?

Randy Couture is 1.7 raw points behind #12 Jose Aldo. The largest category separation versus that next target is currently Longevity; future movement must be earned through new UFC evidence and a full pipeline rerun.

#### Final takeaway

Randy Couture ranks #13 because Prime Dominance and Championship provide the largest weighted parts of a 60.99 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

_Source IDs: fighter ledger verified through 2026-07-13; score owner ranking-pipeline.js; category owner category-calculators.js._

### 14. Israel Adesanya — 91 OVR

Israel Adesanya is ranked from the current UFC-only calculated pipeline.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 59.24 | 13-6 | Middleweight / Light Heavyweight | 8 | 7.75 | 9 | 8-4 | 60.0% | 5.35 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 14.98 | 35 | 17.48 |
| Opponent Quality | 22.05 | 25 | 18.38 |
| Prime Dominance | 17.44 | 30 | 17.44 |
| Longevity | 13.12 | 10 | 4.37 |

Base score: **57.67**. Modifiers: Apex **+5.12**, Loss Penalty **-3.5**, Division-Era Depth **-0.05**. Final raw score: **59.24**.

OVR conversion: board anchors **18.68–101.92**, normalized score **0.4873**, curved score **0.5428**, resulting in **91 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 14.98 | #8 | 7.26 adjusted credit / 14.54 benchmark |
| Opponent Quality | 22.05 | #17 | 10.36 diminished credit / 14.1 benchmark |
| Prime Dominance | 17.44 | #50 | 17.44 raw × 100.0% sample |
| Longevity | 13.12 | #31 | 62.96 counted elite months |
| Apex modifier | +5.12 | Modifier | Stopping Whittaker and dominating unbeaten Costa support stronger Proof and Aura, but not a maximum Apex tier. |
| Loss penalty | -3.5 | Modifier | 6 official/technical loss events reviewed |
| Division-era depth | -0.05 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **8**. Adjusted title wins: **7.75**. Derived undisputed-title win count: **7**. Interim-title win count: **1**.

| Date | Opponent | Title type | Base | Opponent strength | Final adjusted credit | Review note |
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

| Slot | Date | Opponent | Base/final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 2019-10-05 | Robert Whittaker | 1.25 | 1 | 1.25 | Elite UFC middleweight champion. |
| 2 | 2022-02-12 | Robert Whittaker | 1.25 | 1 | 1.25 | Repeat win over elite champion-level middleweight. |
| 3 | 2023-04-08 | Alex Pereira | 1.25 | 1 | 1.25 | Defeated the reigning UFC champion in the rematch. |
| 4 | 2018-04-14 | Marvin Vettori | 1 | 1 | 1 | Top middleweight title challenger. |
| 5 | 2019-04-13 | Kelvin Gastelum | 1 | 1 | 1 | Elite interim-title war opponent at middleweight. |
| 6 | 2020-03-07 | Yoel Romero | 1 | 1 | 1 | Elite middleweight title challenger, age/activity context. |
| 7 | 2020-09-26 | Paulo Costa | 1 | 0.75 | 0.75 | Undefeated top middleweight contender. |
| 8 | 2018-11-03 | Derek Brunson | 0.85 | 0.75 | 0.64 | Strong ranked middleweight contender. |
| 9 | 2022-07-02 | Jared Cannonier | 0.85 | 0.75 | 0.64 | Strong ranked middleweight contender. |
| 10 | 2018-07-06 | Brad Tavares | 0.65 | 0.75 | 0.49 | Quality middleweight win on contender climb. |
| 11 | 2019-02-10 | Anderson Silva | 0.65 | 0.75 | 0.49 | All-time name, but late-career timing heavily discounted. |
| 12 | 2021-06-12 | Marvin Vettori | 0.65 | 0.75 | 0.49 | Early quality UFC win. |
| 13 | 2018-02-10 | Rob Wilkinson | 0.25 | 0.5 | 0.13 | Low-end UFC quality value. |

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

#### Loss-penalty receipts

The fight-level rules create raw loss events. The final category then compresses those events through severity, frequency, and a prime-loss volume floor. Exposure: **17** fights. Severity: **2.25**. Frequency: **1.19**. Prime-volume floor: **3.5**. Pre-division magnitude: **3.5**. Final penalty: **-3.5**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Raw event penalty | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2021-03-06 | Jan Blachowicz | prime | champion-level | upward | No | Yes | -0.75 | prime-upward-elite |
| 2022-11-12 | Alex Pereira | prime | top-five | home | Yes | Yes | -2.25 | standard rule |
| 2023-09-09 | Sean Strickland | prime | top-five | home | No | Yes | -1.5 | standard rule |
| 2024-08-18 | Dricus du Plessis | prime | champion-level | home | Yes | Yes | -2.25 | standard rule |
| 2025-02-01 | Nassourdine Imavov | post-prime | top-five | home | Yes | Yes | 0 | standard rule |
| 2026-03-28 | Joe Pyfer | post-prime | top-ten | home | Yes | Yes | 0 | standard rule |

#### Division-strength context

Default division key: **adesanya-modern-middleweight-1.0**. Era-ledger division multiplier: **0.98**. Division-era modifier: **-0.05**.

Whittaker I through DDP.

#### Key judgment calls

- **Prime window:** Robert Whittaker I → Dricus du Plessis.
- **Coverage:** Complete UFC ledger through Joe Pyfer. Prime closes with the Dricus title loss; later losses are post-prime.
- **Loss endpoint:** Correct the shared endpoint to the canonical UFC 305 fight date. The Dricus du Plessis loss remains inside the prime window.

#### Why ranked here

Israel Adesanya ranks #14 because Opponent Quality and Championship provide the largest weighted parts of a 59.24 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

#### Why not ranked higher?

Israel Adesanya is 1.75 raw points behind #13 Randy Couture. The largest category separation versus that next target is currently Longevity; future movement must be earned through new UFC evidence and a full pipeline rerun.

#### Final takeaway

Israel Adesanya ranks #14 because Opponent Quality and Championship provide the largest weighted parts of a 59.24 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

_Source IDs: fighter ledger verified through 2026-07-13; score owner ranking-pipeline.js; category owner category-calculators.js._

### 15. Daniel Cormier — 91 OVR

Daniel Cormier is ranked from the current UFC-only calculated pipeline.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 58.06 | 11-3, 1 NC | Light Heavyweight / Heavyweight | 6 | 6.15 | 6 | 7-3, 1 NC | 59.4% | 5.62 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 11.86 | 35 | 13.84 |
| Opponent Quality | 19.12 | 25 | 15.93 |
| Prime Dominance | 20.65 | 30 | 20.65 |
| Longevity | 17.43 | 10 | 5.81 |

Base score: **56.23**. Modifiers: Apex **+5.06**, Loss Penalty **-3.01**, Division-Era Depth **-0.22**. Final raw score: **58.06**.

OVR conversion: board anchors **18.68–101.92**, normalized score **0.4731**, curved score **0.5293**, resulting in **91 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 11.86 | #12 | 5.75 adjusted credit / 14.54 benchmark |
| Opponent Quality | 19.12 | #35 | 8.99 diminished credit / 14.1 benchmark |
| Prime Dominance | 20.65 | #28 | 20.65 raw × 100.0% sample |
| Longevity | 17.43 | #14 | 83.66 counted elite months |
| Apex modifier | +5.06 | Modifier | A dominant light-heavyweight defense followed by becoming heavyweight champion captures Cormier’s cleanest UFC-only six-month Apex. |
| Loss penalty | -3.01 | Modifier | 3 official/technical loss events reviewed |
| Division-era depth | -0.22 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **6**. Adjusted title wins: **6.15**. Derived undisputed-title win count: **6**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final adjusted credit | Review note |
| --- | --- | --- | --- | --- | --- | --- |
| 2015-05-23 | Anthony Johnson | vacant-undisputed | 0.9 | 1 | 0.9 | Elite vacant-title opponent; full opponent strength. |
| 2015-10-03 | Alexander Gustafsson | normal | 1 | 0.95 | 0.95 | locked |
| 2017-04-08 | Anthony Johnson | normal | 1 | 0.95 | 0.95 | locked |
| 2018-07-07 | Stipe Miocic | second-division-undisputed | 1.25 | 1 | 1.25 | review |
| 2018-01-20 | Volkan Oezdemir | normal | 1 | 0.85 | 0.85 | locked |
| 2018-11-03 | Derrick Lewis | normal | 1 | 0.85 | 0.85 | locked |

#### Opponent Quality receipts

Raw win credit: **9.65**. Diminishing-return credit before fighter adjustment: **8.99**. Fighter adjustment: **0**. Final diminished credit: **8.99**.

| Slot | Date | Opponent | Base/final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 2015-05-23 | Anthony Johnson | 1.25 | 1 | 1.25 | Elite light heavyweight title challenger. |
| 2 | 2015-10-03 | Alexander Gustafsson | 1.25 | 1 | 1.25 | Elite champion-level light heavyweight title challenger. |
| 3 | 2017-04-08 | Anthony Johnson | 1.25 | 1 | 1.25 | Repeat win over elite light heavyweight title challenger. |
| 4 | 2018-07-07 | Stipe Miocic | 1.25 | 1 | 1.25 | Elite UFC heavyweight champion. |
| 5 | 2018-01-20 | Volkan Oezdemir | 1 | 1 | 1 | Top-five light-heavyweight title challenger. |
| 6 | 2018-11-03 | Derrick Lewis | 1 | 1 | 1 | Heavyweight title challenger and dangerous top contender. |
| 7 | 2013-04-20 | Frank Mir | 0.65 | 0.75 | 0.49 | Former heavyweight champion, later-career timing. |
| 8 | 2013-10-19 | Roy Nelson | 0.65 | 0.75 | 0.49 | Ranked heavyweight veteran. |
| 9 | 2016-07-09 | Anderson Silva | 0.65 | 0.75 | 0.49 | All-time name, short-notice/late-career context. |
| 10 | 2014-05-24 | Dan Henderson | 0.45 | 0.75 | 0.34 | All-time name, but aged/undersized timing. |
| 11 | 2014-02-22 | Patrick Cummins | 0.25 | 0.75 | 0.19 | Short-notice low opponent-quality value. |

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

#### Loss-penalty receipts

The fight-level rules create raw loss events. The final category then compresses those events through severity, frequency, and a prime-loss volume floor. Exposure: **14** fights. Severity: **1.88**. Frequency: **1.13**. Prime-volume floor: **2.5**. Pre-division magnitude: **3.01**. Final penalty: **-3.01**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Raw event penalty | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2015-01-03 | Jon Jones | prime | champion-level | home | No | Yes | -1.5 | standard rule |
| 2019-08-17 | Stipe Miocic | prime | top-five | home | Yes | Yes | -2.25 | standard rule |
| 2020-08-15 | Stipe Miocic | prime | champion-level | home | No | Yes | -1.5 | standard rule |

#### Division-strength context

Default division key: **cormier-lhw-heavyweight-1.0**. Era-ledger division multiplier: **1**. Division-era modifier: **-0.22**.

Dan Henderson through Stipe III.

#### Key judgment calls

- **Prime window:** Dan Henderson → Stipe Miocic III.
- **Coverage:** Complete UFC-only ledger. Strikeforce achievements and fights are excluded.
- **Loss endpoint:** Jones I and Stipe II did not end it because DC recovered to championship/two-division title form. Stipe III ends it.

#### Why ranked here

Daniel Cormier ranks #15 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 58.06 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

#### Why not ranked higher?

Daniel Cormier is 1.18 raw points behind #14 Israel Adesanya. The largest category separation versus that next target is currently Championship; future movement must be earned through new UFC evidence and a full pipeline rerun.

#### Final takeaway

Daniel Cormier ranks #15 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 58.06 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

_Source IDs: fighter ledger verified through 2026-07-13; score owner ranking-pipeline.js; category owner category-calculators.js._

### 16. Alex Pereira — 91 OVR

Alex Pereira is ranked from the current UFC-only calculated pipeline.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 57.19 | 10-3 | Light Heavyweight / Middleweight / Heavyweight | 6 | 6.15 | 8 | 8-3 | 57.1% | 4.03 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 12.05 | 35 | 14.06 |
| Opponent Quality | 18.43 | 25 | 15.36 |
| Prime Dominance | 21.32 | 30 | 21.32 |
| Longevity | 11.11 | 10 | 3.7 |

Base score: **54.44**. Modifiers: Apex **+5.53**, Loss Penalty **-2.94**, Division-Era Depth **+0.16**. Final raw score: **57.19**.

OVR conversion: board anchors **18.68–101.92**, normalized score **0.4626**, curved score **0.5193**, resulting in **91 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 12.05 | #10 | 5.84 adjusted credit / 14.54 benchmark |
| Opponent Quality | 18.43 | #39 | 8.66 diminished credit / 14.1 benchmark |
| Prime Dominance | 21.32 | #23 | 21.32 raw × 100.0% sample |
| Longevity | 11.11 | #41 | 53.32 counted elite months |
| Apex modifier | +5.53 | Modifier | Terrifying title-fight finisher aura. |
| Loss penalty | -2.94 | Modifier | 3 official/technical loss events reviewed |
| Division-era depth | +0.16 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **6**. Adjusted title wins: **6.15**. Derived undisputed-title win count: **6**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final adjusted credit | Review note |
| --- | --- | --- | --- | --- | --- | --- |
| 2022-11-12 | Israel Adesanya | normal | 1 | 1 | 1 | locked |
| 2023-11-11 | Jiri Prochazka | vacant-second-division | 1.15 | 0.95 | 1.09 | Vacant second-division title context. |
| 2024-04-13 | Jamahal Hill | normal | 1 | 0.95 | 0.95 | locked |
| 2024-06-29 | Jiri Prochazka | normal | 1 | 0.95 | 0.95 | locked |
| 2024-10-05 | Khalil Rountree Jr. | normal | 1 | 0.9 | 0.9 | locked |
| 2025-10-04 | Magomed Ankalaev | normal | 1 | 0.95 | 0.95 | Current-table elite LHW title defense. |

#### Opponent Quality receipts

Raw win credit: **9.3**. Diminishing-return credit before fighter adjustment: **8.66**. Fighter adjustment: **0**. Final diminished credit: **8.66**.

| Slot | Date | Opponent | Base/final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 2022-11-12 | Israel Adesanya | 1.25 | 1 | 1.25 | Elite UFC middleweight champion. |
| 2 | 2023-11-11 | Jiri Prochazka | 1.25 | 1 | 1.25 | Elite former light heavyweight champion. |
| 3 | 2024-06-29 | Jiri Prochazka | 1.25 | 1 | 1.25 | Repeat win over elite light heavyweight champion-level opponent. |
| 4 | 2023-07-29 | Jan Blachowicz | 1 | 1 | 1 | Former light heavyweight champion and top contender. |
| 5 | 2024-04-13 | Jamahal Hill | 1 | 1 | 1 | Former light heavyweight champion returning from injury. |
| 6 | 2024-10-05 | Khalil Rountree Jr. | 1 | 1 | 1 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 7 | 2025-10-04 | Magomed Ankalaev | 1 | 0.75 | 0.75 | Elite light heavyweight contender/title-level opponent. |
| 8 | 2022-07-02 | Sean Strickland | 0.85 | 0.75 | 0.64 | Strong ranked middleweight win before Strickland title peak. |
| 9 | 2022-03-12 | Bruno Silva | 0.45 | 0.75 | 0.34 | Solid UFC middleweight win. |
| 10 | 2021-11-06 | Andreas Michailidis | 0.25 | 0.75 | 0.19 | Low UFC opponent-quality value. |

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

#### Loss-penalty receipts

The fight-level rules create raw loss events. The final category then compresses those events through severity, frequency, and a prime-loss volume floor. Exposure: **13** fights. Severity: **1.88**. Frequency: **1.15**. Prime-volume floor: **2.75**. Pre-division magnitude: **3.03**. Final penalty: **-2.94**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Raw event penalty | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2023-04-08 | Israel Adesanya | prime | top-five | home | Yes | Yes | -2.25 | standard rule |
| 2025-03-08 | Magomed Ankalaev | prime | top-five | home | No | Yes | -1.5 | standard rule |
| 2026-06-14 | Ciryl Gane | prime | top-five | upward | Yes | Yes | -1.25 | prime-upward-elite |

#### Division-strength context

Default division key: **pereira-multi-division-1.01**. Era-ledger division multiplier: **1.02**. Division-era modifier: **+0.16**.

Strickland through current title-level form.

#### Key judgment calls

- **Prime window:** Sean Strickland → Current title-level form.
- **Coverage:** Complete UFC-only ledger through 2026-06-14. Non-UFC results excluded.
- **Loss endpoint:** Adesanya finish loss was recovered immediately; current title-level form keeps window open.

#### Why ranked here

Alex Pereira ranks #16 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 57.19 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

#### Why not ranked higher?

Alex Pereira is 0.87 raw points behind #15 Daniel Cormier. The largest category separation versus that next target is currently Longevity; future movement must be earned through new UFC evidence and a full pipeline rerun.

#### Final takeaway

Alex Pereira ranks #16 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 57.19 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

_Source IDs: fighter ledger verified through 2026-07-13; score owner ranking-pipeline.js; category owner category-calculators.js._

### 17. Chuck Liddell — 91 OVR

Chuck Liddell is ranked from the current UFC-only calculated pipeline.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 56.42 | 16-7 | Light Heavyweight | 5 | 5 | 11 | 7-1 | 93.3% | 3.15 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 9.28 | 35 | 10.83 |
| Opponent Quality | 19.84 | 25 | 16.53 |
| Prime Dominance | 26.94 | 30 | 26.94 |
| Longevity | 8.64 | 10 | 2.88 |

Base score: **57.18**. Modifiers: Apex **+5.27**, Loss Penalty **-3.09**, Division-Era Depth **-2.94**. Final raw score: **56.42**.

OVR conversion: board anchors **18.68–101.92**, normalized score **0.4534**, curved score **0.5105**, resulting in **91 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 9.28 | #18 | 4.5 adjusted credit / 14.54 benchmark |
| Opponent Quality | 19.84 | #28 | 9.32 diminished credit / 14.1 benchmark |
| Prime Dominance | 26.94 | #3 | 26.94 raw × 100.0% sample |
| Longevity | 8.64 | #51 | 41.47 counted elite months |
| Apex modifier | +5.27 | Modifier | Two defining championship knockouts justify substantially stronger Proof while preserving the existing Claim and Aura. |
| Loss penalty | -3.09 | Modifier | 7 official/technical loss events reviewed |
| Division-era depth | -2.94 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **5**. Adjusted title wins: **5**. Derived undisputed-title win count: **5**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final adjusted credit | Review note |
| --- | --- | --- | --- | --- | --- | --- |
| 2005-04-16 | Randy Couture | normal | 1 | 1 | 1 | locked |
| 2005-08-20 | Jeremy Horn | normal | 1 | 0.8 | 0.8 | locked |
| 2006-02-04 | Randy Couture | normal | 1 | 0.95 | 0.95 | locked |
| 2006-08-26 | Renato Sobral | normal | 1 | 0.85 | 0.85 | locked |
| 2006-12-30 | Tito Ortiz | normal | 1 | 0.9 | 0.9 | locked |

#### Opponent Quality receipts

Raw win credit: **10.6**. Diminishing-return credit before fighter adjustment: **9.32**. Fighter adjustment: **0**. Final diminished credit: **9.32**.

| Slot | Date | Opponent | Base/final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 2005-04-16 | Randy Couture | 1.25 | 1 | 1.25 | Won the UFC light heavyweight title from an elite champion and defining rival. |
| 2 | 2006-02-04 | Randy Couture | 1.25 | 1 | 1.25 | Immediate trilogy win over an elite former champion and title challenger. |
| 3 | 2004-04-02 | Tito Ortiz | 1 | 1 | 1 | Former long-reigning UFC champion and elite light heavyweight contender. |
| 4 | 2006-12-30 | Tito Ortiz | 1 | 1 | 1 | Repeat title-defense win over an elite rival; repeat and timing context keep it below max. |
| 5 | 2002-06-22 | Vitor Belfort | 0.85 | 1 | 0.85 | Dangerous elite UFC name, but not a clean champion-level or true top-five win in this timing context. |
| 6 | 2002-11-22 | Renato Sobral | 0.85 | 1 | 0.85 | Ranked title challenger; strong defense with early-era depth context. |
| 7 | 2001-05-04 | Kevin Randleman | 0.65 | 0.75 | 0.49 | Former UFC heavyweight champion and dangerous athlete, with timing and division context. |
| 8 | 2001-09-28 | Murilo Bustamante | 0.65 | 0.75 | 0.49 | High-level future UFC champion, but earlier-career timing caps the credit. |
| 9 | 2005-08-20 | Jeremy Horn | 0.65 | 0.75 | 0.49 | Experienced title challenger on a major unbeaten run; revenge and era context cap the credit. |
| 10 | 2006-08-26 | Renato Sobral | 0.65 | 0.75 | 0.49 | Meaningful contender win before the title reign, below the later title-defense version. |
| 11 | 2007-12-29 | Wanderlei Silva | 0.65 | 0.75 | 0.49 | Major elite name, but the UFC win came after his clearest non-UFC peak. |
| 12 | 2000-12-16 | Jeff Monson | 0.45 | 0.75 | 0.34 | Solid UFC heavyweight win before Monson’s later contender run. |
| 13 | 2002-01-11 | Amar Suloev | 0.25 | 0.5 | 0.13 | Useful early win, but limited proven UFC contender value. |
| 14 | 2004-08-21 | Vernon White | 0.25 | 0.5 | 0.13 | Supporting UFC light heavyweight win with limited ranked value. |
| 15 | 1998-05-15 | Noe Hernandez | 0.1 | 0.5 | 0.05 | UFC debut win with minimal opponent-quality value. |
| 16 | 1999-09-24 | Paul Jones | 0.1 | 0.5 | 0.05 | Early UFC win with minimal opponent-quality value. |

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

#### Loss-penalty receipts

The fight-level rules create raw loss events. The final category then compresses those events through severity, frequency, and a prime-loss volume floor. Exposure: **18** fights. Severity: **2.13**. Frequency: **0.96**. Prime-volume floor: **1**. Pre-division magnitude: **3.09**. Final penalty: **-3.09**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Raw event penalty | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1999-03-05 | Jeremy Horn | pre-prime | solid | home | Yes | Yes | -2 | standard rule |
| 2003-06-06 | Randy Couture | pre-prime | top-five | home | Yes | Yes | -1.5 | standard rule |
| 2007-05-26 | Quinton Jackson | prime | top-five | home | Yes | Yes | -2.25 | standard rule |
| 2007-09-22 | Keith Jardine | post-prime | top-ten | home | No | Yes | 0 | standard rule |
| 2008-09-06 | Rashad Evans | post-prime | top-five | home | Yes | Yes | 0 | standard rule |
| 2009-04-18 | Mauricio Rua | post-prime | top-five | home | Yes | Yes | 0 | standard rule |
| 2010-06-12 | Rich Franklin | post-prime | top-five | home | Yes | Yes | 0 | standard rule |

#### Division-strength context

Default division key: **early-modern-light-heavyweight-1.00**. Era-ledger division multiplier: **1**. Division-era modifier: **-2.94**.

Tito I through Rampage II.

#### Key judgment calls

- **Prime window:** Tito Ortiz I → Quinton Jackson II.
- **Coverage:** Complete UFC-only ledger through 2010-06-12. Non-UFC results excluded.
- **Loss endpoint:** Couture loss was recovered. Rampage II closes window; Jardine/Evans are decline context.

#### Why ranked here

Chuck Liddell ranks #17 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 56.42 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

#### Why not ranked higher?

Chuck Liddell is 0.77 raw points behind #16 Alex Pereira. The largest category separation versus that next target is currently Championship; future movement must be earned through new UFC evidence and a full pipeline rerun.

#### Final takeaway

Chuck Liddell ranks #17 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 56.42 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

_Source IDs: fighter ledger verified through 2026-07-13; score owner ranking-pipeline.js; category owner category-calculators.js._

### 18. Charles Oliveira — 91 OVR

Charles Oliveira is ranked from the current UFC-only calculated pipeline.

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

OVR conversion: board anchors **18.68–101.92**, normalized score **0.4441**, curved score **0.5016**, resulting in **91 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 3.63 | #47 | 1.76 adjusted credit / 14.54 benchmark |
| Opponent Quality | 26.22 | #4 | 12.32 diminished credit / 14.1 benchmark |
| Prime Dominance | 21.69 | #21 | 21.69 raw × 100.0% sample |
| Longevity | 18.46 | #12 | 88.62 counted elite months |
| Apex modifier | +4.84 | Modifier | Back-to-back elite finishes support greater Claim and Aura, with the later Islam loss still limiting the ceiling. |
| Loss penalty | -3.06 | Modifier | 11 official/technical loss events reviewed |
| Division-era depth | -0.05 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **2**. Adjusted title wins: **1.76**. Derived undisputed-title win count: **2**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final adjusted credit | Review note |
| --- | --- | --- | --- | --- | --- | --- |
| 2021-05-15 | Michael Chandler | vacant-undisputed | 0.9 | 0.9 | 0.81 | locked |
| 2021-12-11 | Dustin Poirier | normal | 1 | 0.95 | 0.95 | locked |

#### Opponent Quality receipts

Raw win credit: **16.75**. Diminishing-return credit before fighter adjustment: **12.32**. Fighter adjustment: **0**. Final diminished credit: **12.32**.

| Slot | Date | Opponent | Base/final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 2021-12-11 | Dustin Poirier | 1.25 | 1 | 1.25 | Elite prime lightweight interim champion and title-caliber opponent. |
| 2 | 2022-05-07 | Justin Gaethje | 1.25 | 1 | 1.25 | Elite prime lightweight title challenger and former interim champion. |
| 3 | 2026-03-07 | Max Holloway | 1.25 | 1 | 1.25 | Champion-level opponent in the approved app timeline. |
| 4 | 2020-12-12 | Tony Ferguson | 1 | 1 | 1 | Top lightweight name, post-Gaethje timing keeps it under review. |
| 5 | 2021-05-15 | Michael Chandler | 1 | 1 | 1 | Vacant-title opponent and elite lightweight contender. |
| 6 | 2023-06-10 | Beneil Dariush | 1 | 1 | 1 | Long-streak elite lightweight contender. |
| 7 | 2019-05-18 | Nik Lentz | 0.85 | 0.75 | 0.64 | Ranked featherweight rivalry win during Oliveira’s climb. |
| 8 | 2020-03-14 | Kevin Lee | 0.85 | 0.75 | 0.64 | Strong ranked lightweight contender. |
| 9 | 2024-11-16 | Michael Chandler | 0.85 | 0.75 | 0.64 | Dangerous veteran rematch win, later-career context. |
| 10 | 2025-10-11 | Mateusz Gamrot | 0.85 | 0.75 | 0.64 | Strong ranked lightweight win in the approved app timeline. |
| 11 | 2014-06-28 | Hatsu Hioki | 0.65 | 0.75 | 0.49 | Quality featherweight submission win. |
| 12 | 2014-12-12 | Jeremy Stephens | 0.65 | 0.75 | 0.49 | Dangerous featherweight contender win. |
| 13 | 2019-02-02 | David Teymur | 0.65 | 0.5 | 0.33 | Quality lightweight win during Charles’ prime climb. |
| 14 | 2010-08-01 | Darren Elkins | 0.45 | 0.5 | 0.23 | Solid early featherweight win. |
| 15 | 2012-06-01 | Jonathan Brookins | 0.45 | 0.5 | 0.23 | TUF winner and useful UFC featherweight win. |
| 16 | 2015-05-30 | Nik Lentz | 0.45 | 0.5 | 0.23 | Useful veteran rivalry win. |
| 17 | 2015-12-19 | Myles Jury | 0.45 | 0.5 | 0.23 | Solid UFC win. |
| 18 | 2017-04-08 | Will Brooks | 0.45 | 0.5 | 0.23 | Former non-UFC champion name, UFC value limited. |
| 19 | 2018-06-09 | Clay Guida | 0.45 | 0.25 | 0.11 | Solid veteran UFC win. |
| 20 | 2018-09-22 | Christos Giagos | 0.45 | 0.25 | 0.11 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 21 | 2018-12-15 | Jim Miller | 0.45 | 0.25 | 0.11 | Veteran rematch win after Miller’s higher peak. |
| 22 | 2019-11-16 | Jared Gordon | 0.45 | 0.25 | 0.11 | Solid UFC lightweight win. |
| 23 | 2010-09-15 | Efrain Escudero | 0.25 | 0.25 | 0.06 | Limited opponent-quality value. |
| 24 | 2014-02-15 | Andy Ogle | 0.25 | 0.25 | 0.06 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 25 | 2012-01-28 | Eric Wisely | 0.1 | 0.25 | 0.03 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |

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

#### Loss-penalty receipts

The fight-level rules create raw loss events. The final category then compresses those events through severity, frequency, and a prime-loss volume floor. Exposure: **36** fights. Severity: **2.25**. Frequency: **1.35**. Prime-volume floor: **2.75**. Pre-division magnitude: **3.6**. Final penalty: **-3.06**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Raw event penalty | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2010-12-11 | Jim Miller | pre-prime | top-five | home | Yes | Yes | -1.5 | standard rule |
| 2011-08-14 | Donald Cerrone | pre-prime | top-five | home | Yes | Yes | -1.5 | standard rule |
| 2012-09-22 | Cub Swanson | pre-prime | top-five | catchweight | Yes | Yes | -1.5 | standard rule |
| 2013-07-06 | Frankie Edgar | pre-prime | champion-level | home | No | Yes | -0.75 | standard rule |
| 2015-08-23 | Max Holloway | pre-prime | top-five | home | Yes | No | 0 | technical-injury-context |
| 2016-08-27 | Anthony Pettis | pre-prime | champion-level | home | Yes | Yes | -1.5 | standard rule |
| 2016-11-05 | Ricardo Lamas | pre-prime | top-five | catchweight | Yes | Yes | -1.5 | standard rule |
| 2017-12-02 | Paul Felder | pre-prime | top-ten | home | Yes | Yes | -2 | standard rule |
| 2022-10-22 | Islam Makhachev | prime | champion-level | home | Yes | Yes | -2.25 | standard rule |
| 2024-04-13 | Arman Tsarukyan | prime | top-five | home | No | Yes | -1.5 | standard rule |
| 2025-06-28 | Ilia Topuria | prime | champion-level | home | Yes | Yes | -2.25 | standard rule |

#### Division-strength context

Default division key: **modern-elite-lightweight-1.10**. Era-ledger division multiplier: **1.1**. Division-era modifier: **-0.05**.

Modern lightweight receives the locked 1.10 division-strength treatment.

#### Key judgment calls

- **Prime window:** Kevin Lee → Current elite-prime form.
- **Coverage:** Complete UFC-only ledger.
- **Loss endpoint:** Islam and Arman do not close the window under Cody call; Charles remains prime/current.

#### Why ranked here

Charles Oliveira ranks #18 because Opponent Quality and Prime Dominance provide the largest weighted parts of a 55.65 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

#### Why not ranked higher?

Charles Oliveira is 0.77 raw points behind #17 Chuck Liddell. The largest category separation versus that next target is currently Championship; future movement must be earned through new UFC evidence and a full pipeline rerun.

#### Final takeaway

Charles Oliveira ranks #18 because Opponent Quality and Prime Dominance provide the largest weighted parts of a 55.65 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

_Source IDs: fighter ledger verified through 2026-07-13; score owner ranking-pipeline.js; category owner category-calculators.js._

### 19. T.J. Dillashaw — 90 OVR

T.J. Dillashaw is ranked from the current UFC-only calculated pipeline.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 55.08 | 13-5 | Bantamweight / Flyweight | 5 | 5 | 7 | 8-3 | 75.0% | 7.4 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 9.59 | 35 | 11.19 |
| Opponent Quality | 19.2 | 25 | 16 |
| Prime Dominance | 23.53 | 30 | 23.53 |
| Longevity | 12.58 | 10 | 4.19 |

Base score: **54.91**. Modifiers: Apex **+4.85**, Loss Penalty **-3.35**, Division-Era Depth **-1.33**. Final raw score: **55.08**.

OVR conversion: board anchors **18.68–101.92**, normalized score **0.4373**, curved score **0.4951**, resulting in **90 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 9.59 | #17 | 4.65 adjusted credit / 14.54 benchmark |
| Opponent Quality | 19.2 | #34 | 9.03 diminished credit / 14.1 benchmark |
| Prime Dominance | 23.53 | #13 | 23.53 raw × 100.0% sample |
| Longevity | 12.58 | #35 | 60.37 counted elite months |
| Apex modifier | +4.85 | Modifier | Two championship knockouts form a clean peak; the Cejudo loss and PED context constrain Claim and Aura. |
| Loss penalty | -3.35 | Modifier | 5 official/technical loss events reviewed |
| Division-era depth | -1.33 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **5**. Adjusted title wins: **5**. Derived undisputed-title win count: **5**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final adjusted credit | Review note |
| --- | --- | --- | --- | --- | --- | --- |
| 2014-05-24 | Renan Barao | normal | 1 | 1 | 1 | locked |
| 2014-08-30 | Joe Soto | normal | 1 | 0.75 | 0.75 | Short-notice replacement title defense. |
| 2015-07-25 | Renan Barao | normal | 1 | 0.95 | 0.95 | locked |
| 2017-11-04 | Cody Garbrandt | normal | 1 | 1 | 1 | locked |
| 2018-08-04 | Cody Garbrandt | normal | 1 | 0.95 | 0.95 | locked |

#### Opponent Quality receipts

Raw win credit: **9.95**. Diminishing-return credit before fighter adjustment: **9.03**. Fighter adjustment: **0**. Final diminished credit: **9.03**.

| Slot | Date | Opponent | Base/final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 2014-05-24 | Renan Barao | 1.25 | 1 | 1.25 | Elite bantamweight champion-level opponent. |
| 2 | 2017-11-04 | Cody Garbrandt | 1.25 | 1 | 1.25 | UFC bantamweight champion and elite title opponent. |
| 3 | 2015-07-25 | Renan Barao | 1 | 1 | 1 | Repeat win over former champion, with decline/repeat context. |
| 4 | 2018-08-04 | Cody Garbrandt | 1 | 1 | 1 | Repeat win over former champion, less fresh but still elite quality. |
| 5 | 2021-07-24 | Cory Sandhagen | 1 | 1 | 1 | Elite bantamweight contender; close decision context. |
| 6 | 2014-08-30 | Joe Soto | 0.85 | 1 | 0.85 | Late-replacement title challenger; strong Top-10 quality. |
| 7 | 2016-07-09 | Raphael Assuncao | 0.85 | 0.75 | 0.64 | Strong ranked bantamweight contender. |
| 8 | 2016-12-30 | John Lineker | 0.85 | 0.75 | 0.64 | Dangerous ranked bantamweight contender. |
| 9 | 2013-04-20 | Hugo Viana | 0.65 | 0.75 | 0.49 | Ranked-quality bantamweight win. |
| 10 | 2013-03-16 | Issei Tamura | 0.45 | 0.75 | 0.34 | Approved supporting UFC win treatment. |
| 11 | 2014-01-15 | Mike Easton | 0.45 | 0.75 | 0.34 | Solid bantamweight win. |
| 12 | 2012-07-11 | Vaughan Lee | 0.25 | 0.75 | 0.19 | Low-end UFC quality value. |
| 13 | 2012-02-15 | Walel Watson | 0.1 | 0.5 | 0.05 | Minimal UFC quality value. |

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

#### Loss-penalty receipts

The fight-level rules create raw loss events. The final category then compresses those events through severity, frequency, and a prime-loss volume floor. Exposure: **16** fights. Severity: **2.13**. Frequency: **1.22**. Prime-volume floor: **1.75**. Pre-division magnitude: **3.35**. Final penalty: **-3.35**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Raw event penalty | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2011-12-03 | John Dodson | pre-prime | top-ten | home | Yes | Yes | -2 | standard rule |
| 2013-10-09 | Raphael Assuncao | pre-prime | top-five | home | No | Yes | -0.75 | standard rule |
| 2016-01-17 | Dominick Cruz | prime | champion-level | home | No | Yes | -1.5 | standard rule |
| 2019-01-19 | Henry Cejudo | prime | champion-level | downward | Yes | Yes | -2.25 | prime-downward-elite |
| 2022-10-22 | Aljamain Sterling | post-prime | champion-level | home | Yes | Yes | 0 | standard rule |

#### Division-strength context

Default division key: **modern-bantamweight-1.00**. Era-ledger division multiplier: **1**. Division-era modifier: **-1.33**.

Barao I through Cejudo.

#### Key judgment calls

- **Prime window:** Renan Barao I → Henry Cejudo.
- **Coverage:** Complete UFC-only ledger through 2022-10-22. TUF exhibition and non-UFC fights excluded.
- **Loss endpoint:** Cruz loss does not end it because Dillashaw recovered with title wins. Cejudo closes it.

#### Why ranked here

T.J. Dillashaw ranks #19 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 55.08 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

#### Why not ranked higher?

T.J. Dillashaw is 0.57 raw points behind #18 Charles Oliveira. The largest category separation versus that next target is currently Opponent Quality; future movement must be earned through new UFC evidence and a full pipeline rerun.

#### Final takeaway

T.J. Dillashaw ranks #19 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 55.08 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

_Source IDs: fighter ledger verified through 2026-07-13; score owner ranking-pipeline.js; category owner category-calculators.js._

### 20. Merab Dvalishvili — 90 OVR

Merab Dvalishvili is ranked from the current UFC-only calculated pipeline.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 53.66 | 14-3 | Bantamweight | 4 | 4 | 8 | 8-1 | 77.8% | 4.8 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 7.94 | 35 | 9.26 |
| Opponent Quality | 19.6 | 25 | 16.33 |
| Prime Dominance | 22.06 | 30 | 22.06 |
| Longevity | 12.96 | 10 | 4.32 |

Base score: **51.97**. Modifiers: Apex **+4.3**, Loss Penalty **-2.59**, Division-Era Depth **-0.02**. Final raw score: **53.66**.

OVR conversion: board anchors **18.68–101.92**, normalized score **0.4202**, curved score **0.4786**, resulting in **90 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 7.94 | #21 | 3.85 adjusted credit / 14.54 benchmark |
| Opponent Quality | 19.6 | #30 | 9.21 diminished credit / 14.1 benchmark |
| Prime Dominance | 22.06 | #19 | 22.06 raw × 100.0% sample |
| Longevity | 12.96 | #32 | 62.21 counted elite months |
| Apex modifier | +4.3 | Modifier | Consecutive elite championship wins deserve stronger Proof and a modestly higher Claim and Aura, while the later Petr Yan loss prevents a higher tier. |
| Loss penalty | -2.59 | Modifier | 3 official/technical loss events reviewed |
| Division-era depth | -0.02 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **4**. Adjusted title wins: **4**. Derived undisputed-title win count: **4**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final adjusted credit | Review note |
| --- | --- | --- | --- | --- | --- | --- |
| 2024-09-14 | Sean O'Malley | normal | 1 | 1 | 1 | locked |
| 2025-01-18 | Umar Nurmagomedov | normal | 1 | 0.95 | 0.95 | Current-table elite defense. |
| 2025-06-07 | Sean O'Malley | normal | 1 | 0.95 | 0.95 | Current-table rematch defense. |
| 2025-10-04 | Cory Sandhagen | normal | 1 | 0.95 | 0.95 | Current-table title defense. |

#### Opponent Quality receipts

Raw win credit: **10.4**. Diminishing-return credit before fighter adjustment: **9.21**. Fighter adjustment: **0**. Final diminished credit: **9.21**.

| Slot | Date | Opponent | Base/final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 2024-09-14 | Sean O'Malley | 1.25 | 1 | 1.25 | UFC bantamweight champion and elite title opponent. |
| 2 | 2022-08-20 | Jose Aldo | 1 | 1 | 1 | All-time great and ranked bantamweight contender. |
| 3 | 2023-03-11 | Petr Yan | 1 | 1 | 1 | Elite former bantamweight champion. |
| 4 | 2025-01-18 | Umar Nurmagomedov | 1 | 1 | 1 | Elite top-five bantamweight contender. |
| 5 | 2025-10-04 | Cory Sandhagen | 1 | 1 | 1 | Elite top-five bantamweight contender. |
| 6 | 2025-06-07 | Sean O'Malley | 0.9 | 1 | 0.9 | Elite championship rematch win with a modest repeat-opponent discount. |
| 7 | 2024-02-17 | Henry Cejudo | 0.85 | 0.75 | 0.64 | Elite former two-division champion, discounted for age, long layoff, and comeback timing. |
| 8 | 2021-09-25 | Marlon Moraes | 0.7 | 0.75 | 0.53 | Former title challenger, discounted for the clear late-career decline entering the fight. |
| 9 | 2020-08-15 | John Dodson | 0.65 | 0.75 | 0.49 | Quality bantamweight/flyweight contender name. |
| 10 | 2021-05-01 | Cody Stamann | 0.65 | 0.75 | 0.49 | Ranked-quality bantamweight win. |
| 11 | 2019-05-04 | Brad Katona | 0.45 | 0.75 | 0.34 | Approved supporting UFC win treatment. |
| 12 | 2020-02-15 | Casey Kenney | 0.45 | 0.75 | 0.34 | Solid bantamweight win. |
| 13 | 2018-09-15 | Terrion Ware | 0.25 | 0.5 | 0.13 | Low-end UFC quality value. |
| 14 | 2020-06-13 | Gustavo Lopez | 0.25 | 0.5 | 0.13 | Low-end UFC quality value. |

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

#### Loss-penalty receipts

The fight-level rules create raw loss events. The final category then compresses those events through severity, frequency, and a prime-loss volume floor. Exposure: **17** fights. Severity: **1.75**. Frequency: **0.84**. Prime-volume floor: **0.75**. Pre-division magnitude: **2.59**. Final penalty: **-2.59**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Raw event penalty | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2017-12-09 | Frankie Saenz | pre-prime | solid | home | No | Yes | -1.25 | standard rule |
| 2018-04-21 | Ricky Simon | pre-prime | solid | home | Yes | Yes | -2 | standard rule |
| 2025-12-06 | Petr Yan | prime | top-five | home | No | Yes | -1.5 | standard rule |

#### Division-strength context

Default division key: **modern-bantamweight-1.00**. Era-ledger division multiplier: **1**. Division-era modifier: **-0.02**.

Moraes through current title-level form.

#### Key judgment calls

- **Prime window:** Marlon Moraes → Current title-level form.
- **Coverage:** Complete UFC-only ledger through 2025-12-06. Non-UFC results excluded.
- **Loss endpoint:** Current title-level/champion form. No unrecovered prime-ending loss.

#### Why ranked here

Merab Dvalishvili ranks #20 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 53.66 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

#### Why not ranked higher?

Merab Dvalishvili is 1.42 raw points behind #19 T.J. Dillashaw. The largest category separation versus that next target is currently Championship; future movement must be earned through new UFC evidence and a full pipeline rerun.

#### Final takeaway

Merab Dvalishvili ranks #20 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 53.66 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

_Source IDs: fighter ledger verified through 2026-07-13; score owner ranking-pipeline.js; category owner category-calculators.js._

### 21. Frankie Edgar — 90 OVR

Frankie Edgar is ranked from the current UFC-only calculated pipeline.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 53.52 | 18-11-1 | Lightweight / Featherweight / Bantamweight | 3 | 2.8 | 9 | 13-6-1 | 68.0% | 10.18 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 5.88 | 35 | 6.86 |
| Opponent Quality | 23.83 | 25 | 19.86 |
| Prime Dominance | 19.51 | 30 | 19.51 |
| Longevity | 26.99 | 10 | 9 |

Base score: **55.23**. Modifiers: Apex **+4.21**, Loss Penalty **-4.51**, Division-Era Depth **-1.41**. Final raw score: **53.52**.

OVR conversion: board anchors **18.68–101.92**, normalized score **0.4185**, curved score **0.4770**, resulting in **90 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 5.88 | #34 | 2.85 adjusted credit / 14.54 benchmark |
| Opponent Quality | 23.83 | #10 | 11.2 diminished credit / 14.1 benchmark |
| Prime Dominance | 19.51 | #35 | 19.51 raw × 100.0% sample |
| Longevity | 26.99 | #4 | 129.54 counted elite months |
| Apex modifier | +4.21 | Modifier | Lightweight title apex with Penn/Maynard proof. |
| Loss penalty | -4.51 | Modifier | 11 official/technical loss events reviewed |
| Division-era depth | -1.41 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **3**. Adjusted title wins: **2.8**. Derived undisputed-title win count: **3**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final adjusted credit | Review note |
| --- | --- | --- | --- | --- | --- | --- |
| 2010-04-10 | B.J. Penn | normal | 1 | 0.95 | 0.95 | locked |
| 2010-08-28 | B.J. Penn | normal | 1 | 0.95 | 0.95 | locked |
| 2011-10-08 | Gray Maynard | normal | 1 | 0.95 | 0.95 | locked |

#### Opponent Quality receipts

Raw win credit: **13.65**. Diminishing-return credit before fighter adjustment: **11.2**. Fighter adjustment: **0**. Final diminished credit: **11.2**.

| Slot | Date | Opponent | Base/final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 2010-04-10 | B.J. Penn | 1.25 | 1 | 1.25 | Won the UFC lightweight title from an elite reigning champion. |
| 2 | 2010-08-28 | B.J. Penn | 1.15 | 1 | 1.15 | Immediate dominant confirmation over the same champion-level opponent; slight repeat discount. |
| 3 | 2011-10-08 | Gray Maynard | 1 | 1 | 1 | Elite lightweight rival and title challenger. |
| 4 | 2014-07-06 | B.J. Penn | 1 | 1 | 1 | Third UFC win over an elite former champion, timing-adjusted. |
| 5 | 2014-11-22 | Cub Swanson | 1 | 1 | 1 | High-end featherweight contender in a title-eliminator-level matchup. |
| 6 | 2015-12-11 | Chad Mendes | 1 | 1 | 1 | Elite featherweight contender stopped in the first round. |
| 7 | 2007-11-17 | Spencer Fisher | 0.85 | 0.75 | 0.64 | Strong ranked lightweight win. |
| 8 | 2009-05-23 | Sean Sherk | 0.85 | 0.75 | 0.64 | Former UFC lightweight champion and still a strong ranked opponent. |
| 9 | 2017-05-13 | Yair Rodriguez | 0.85 | 0.75 | 0.64 | Rising ranked featherweight contender at the time of the win. |
| 10 | 2020-08-22 | Pedro Munhoz | 0.85 | 0.75 | 0.64 | Highly ranked bantamweight win late in Edgar’s career; close split-decision context noted. |
| 11 | 2007-02-03 | Tyson Griffin | 0.65 | 0.75 | 0.49 | Excellent early lightweight win, but before either fighter had established title-level standing. |
| 12 | 2015-05-16 | Urijah Faber | 0.65 | 0.75 | 0.49 | Elite lighter-weight name, discounted for one-off featherweight timing. |
| 13 | 2016-11-12 | Jeremy Stephens | 0.65 | 0.5 | 0.33 | Dangerous ranked featherweight contender. |
| 14 | 2007-07-07 | Mark Bocek | 0.45 | 0.5 | 0.23 | Approved supporting UFC win treatment. |
| 15 | 2008-07-19 | Hermes França | 0.45 | 0.5 | 0.23 | Former title challenger name, but timing and layoff context limit the credit. |
| 16 | 2013-07-06 | Charles Oliveira | 0.45 | 0.5 | 0.23 | Quality 2013 featherweight win; future championship success is not back-credited. |
| 17 | 2018-04-21 | Cub Swanson | 0.45 | 0.5 | 0.23 | Useful rematch win with later-career timing and less contender value than the first meeting. |
| 18 | 2009-12-05 | Matt Veach | 0.1 | 0.5 | 0.05 | Comeback finish over a lightly proven UFC opponent. |

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

#### Loss-penalty receipts

The fight-level rules create raw loss events. The final category then compresses those events through severity, frequency, and a prime-loss volume floor. Exposure: **25** fights. Severity: **1.88**. Frequency: **1.26**. Prime-volume floor: **4.75**. Pre-division magnitude: **4.75**. Final penalty: **-4.51**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Raw event penalty | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2008-04-02 | Gray Maynard | pre-prime | top-five | home | No | Yes | -0.75 | standard rule |
| 2012-02-26 | Benson Henderson | prime | champion-level | home | No | Yes | -1.5 | standard rule |
| 2012-08-11 | Benson Henderson | prime | champion-level | home | No | Yes | -1.5 | standard rule |
| 2013-02-02 | Jose Aldo | prime | champion-level | downward | No | Yes | -1.5 | standard rule |
| 2016-07-09 | Jose Aldo | prime | champion-level | home | No | Yes | -1.5 | standard rule |
| 2018-03-03 | Brian Ortega | prime | top-five | home | Yes | Yes | -2.25 | standard rule |
| 2019-07-27 | Max Holloway | prime | champion-level | home | No | Yes | -1.5 | standard rule |
| 2019-12-21 | Chan Sung Jung | post-prime | top-five | home | Yes | Yes | 0 | standard rule |
| 2021-02-06 | Cory Sandhagen | post-prime | top-five | home | Yes | Yes | 0 | standard rule |
| 2021-11-06 | Marlon Vera | post-prime | top-ten | home | Yes | Yes | 0 | standard rule |
| 2022-11-12 | Chris Gutiérrez | post-prime | top-ten | home | Yes | Yes | 0 | standard rule |

#### Division-strength context

Default division key: **edgar-lightweight-featherweight-1.03**. Era-ledger division multiplier: **1.03**. Division-era modifier: **-1.41**.

Sherk through Holloway.

#### Key judgment calls

- **Prime window:** Sean Sherk → Max Holloway.
- **Coverage:** Complete UFC-only ledger.
- **Loss endpoint:** Benson, Aldo, and Ortega losses did not end it because Edgar kept re-entering title-level fights. Holloway closes it.

#### Why ranked here

Frankie Edgar ranks #21 because Opponent Quality and Prime Dominance provide the largest weighted parts of a 53.52 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

#### Why not ranked higher?

Frankie Edgar is 0.14 raw points behind #20 Merab Dvalishvili. The largest category separation versus that next target is currently Prime Dominance; future movement must be earned through new UFC evidence and a full pipeline rerun.

#### Final takeaway

Frankie Edgar ranks #21 because Opponent Quality and Prime Dominance provide the largest weighted parts of a 53.52 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

_Source IDs: fighter ledger verified through 2026-07-13; score owner ranking-pipeline.js; category owner category-calculators.js._

### 22. Francis Ngannou — 90 OVR

Francis Ngannou is ranked from the current UFC-only calculated pipeline.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 51.59 | 12-2 | Heavyweight | 2 | 2 | 7 | 6-0 | 81.8% | 3.16 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 3.92 | 35 | 4.57 |
| Opponent Quality | 17.26 | 25 | 14.38 |
| Prime Dominance | 25.42 | 30 | 25.42 |
| Longevity | 8.19 | 10 | 2.73 |

Base score: **47.1**. Modifiers: Apex **+5.65**, Loss Penalty **-1.07**, Division-Era Depth **-0.09**. Final raw score: **51.59**.

OVR conversion: board anchors **18.68–101.92**, normalized score **0.3954**, curved score **0.4544**, resulting in **90 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 3.92 | #44 | 1.9 adjusted credit / 14.54 benchmark |
| Opponent Quality | 17.26 | #40 | 8.11 diminished credit / 14.1 benchmark |
| Prime Dominance | 25.42 | #6 | 26.76 raw × 95.0% sample |
| Longevity | 8.19 | #53 | 39.29 counted elite months |
| Apex modifier | +5.65 | Modifier | Terrifying heavyweight apex with evolved title-fight proof. |
| Loss penalty | -1.07 | Modifier | 2 official/technical loss events reviewed |
| Division-era depth | -0.09 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **2**. Adjusted title wins: **2**. Derived undisputed-title win count: **2**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final adjusted credit | Review note |
| --- | --- | --- | --- | --- | --- | --- |
| 2021-03-27 | Stipe Miocic | normal | 1 | 0.95 | 0.95 | locked |
| 2022-01-22 | Ciryl Gane | normal | 1 | 0.95 | 0.95 | locked |

#### Opponent Quality receipts

Raw win credit: **8.85**. Diminishing-return credit before fighter adjustment: **8.11**. Fighter adjustment: **0**. Final diminished credit: **8.11**.

| Slot | Date | Opponent | Base/final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 2021-03-27 | Stipe Miocic | 1.25 | 1 | 1.25 | Elite UFC heavyweight champion. |
| 2 | 2022-01-22 | Ciryl Gane | 1.25 | 1 | 1.25 | Undefeated interim champion and elite heavyweight title opponent. |
| 3 | 2016-04-10 | Curtis Blaydes | 0.85 | 1 | 0.85 | Strong ranked heavyweight contender. |
| 4 | 2017-12-02 | Alistair Overeem | 0.85 | 1 | 0.85 | Elite heavyweight name, timing adjusted. |
| 5 | 2019-06-29 | Junior dos Santos | 0.85 | 1 | 0.85 | Former UFC champion, later-career timing. |
| 6 | 2020-05-09 | Jairzinho Rozenstruik | 0.85 | 1 | 0.85 | Undefeated ranked heavyweight contender. |
| 7 | 2017-01-28 | Andrei Arlovski | 0.65 | 0.75 | 0.49 | Former champion name, late-career value. |
| 8 | 2018-11-24 | Curtis Blaydes | 0.65 | 0.75 | 0.49 | Early win over future ranked contender. |
| 9 | 2019-02-17 | Cain Velasquez | 0.65 | 0.75 | 0.49 | All-time heavyweight name, but late-career timing. |
| 10 | 2015-12-19 | Luis Henrique | 0.45 | 0.75 | 0.34 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 11 | 2016-12-09 | Anthony Hamilton | 0.45 | 0.75 | 0.34 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 12 | 2016-07-23 | Bojan Mihajlovic | 0.1 | 0.75 | 0.07 | Minimal UFC quality value. |

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

#### Loss-penalty receipts

The fight-level rules create raw loss events. The final category then compresses those events through severity, frequency, and a prime-loss volume floor. Exposure: **14** fights. Severity: **0.75**. Frequency: **0.32**. Prime-volume floor: **0**. Pre-division magnitude: **1.07**. Final penalty: **-1.07**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Raw event penalty | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2018-01-20 | Stipe Miocic | pre-prime | champion-level | home | No | Yes | -0.75 | standard rule |
| 2018-07-07 | Derrick Lewis | pre-prime | top-five | home | No | Yes | -0.75 | standard rule |

#### Division-strength context

Default division key: **modern-heavyweight-0.96**. Era-ledger division multiplier: **0.96**. Division-era modifier: **-0.09**.

Blaydes II through Gane.

#### Key judgment calls

- **Prime window:** Curtis Blaydes II → Ciryl Gane.
- **Coverage:** Complete UFC-only ledger through 2022-01-22. Non-UFC results excluded.
- **Loss endpoint:** Stipe I/Lewis are before true apex window. Gane closes UFC elite-prime window on win/exit.

#### Why ranked here

Francis Ngannou ranks #22 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 51.59 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

#### Why not ranked higher?

Francis Ngannou is 1.93 raw points behind #21 Frankie Edgar. The largest category separation versus that next target is currently Longevity; future movement must be earned through new UFC evidence and a full pipeline rerun.

#### Final takeaway

Francis Ngannou ranks #22 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 51.59 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

_Source IDs: fighter ledger verified through 2026-07-13; score owner ranking-pipeline.js; category owner category-calculators.js._

### 23. Cain Velasquez — 90 OVR

Cain Velasquez is ranked from the current UFC-only calculated pipeline.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 50.52 | 12-3 | Heavyweight | 4 | 4 | 6 | 6-2 | 83.3% | 5.16 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 7.84 | 35 | 9.15 |
| Opponent Quality | 17.26 | 25 | 14.38 |
| Prime Dominance | 22.43 | 30 | 22.43 |
| Longevity | 11.86 | 10 | 3.95 |

Base score: **49.91**. Modifiers: Apex **+5.45**, Loss Penalty **-3.29**, Division-Era Depth **-1.55**. Final raw score: **50.52**.

OVR conversion: board anchors **18.68–101.92**, normalized score **0.3825**, curved score **0.4418**, resulting in **90 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 7.84 | #22 | 3.8 adjusted credit / 14.54 benchmark |
| Opponent Quality | 17.26 | #40 | 8.11 diminished credit / 14.1 benchmark |
| Prime Dominance | 22.43 | #18 | 22.43 raw × 100.0% sample |
| Longevity | 11.86 | #39 | 56.92 counted elite months |
| Apex modifier | +5.45 | Modifier | Two prolonged dominant wins over a prime elite champion represent a genuine all-time heavyweight Apex. |
| Loss penalty | -3.29 | Modifier | 3 official/technical loss events reviewed |
| Division-era depth | -1.55 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **4**. Adjusted title wins: **4**. Derived undisputed-title win count: **4**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final adjusted credit | Review note |
| --- | --- | --- | --- | --- | --- | --- |
| 2010-10-23 | Brock Lesnar | normal | 1 | 1 | 1 | locked |
| 2012-12-29 | Junior dos Santos | normal | 1 | 1 | 1 | locked |
| 2013-05-25 | Antonio Silva | normal | 1 | 0.85 | 0.85 | locked |
| 2013-10-19 | Junior dos Santos | normal | 1 | 0.95 | 0.95 | locked |

#### Opponent Quality receipts

Raw win credit: **8.8**. Diminishing-return credit before fighter adjustment: **8.11**. Fighter adjustment: **0**. Final diminished credit: **8.11**.

| Slot | Date | Opponent | Base/final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 2012-12-29 | Junior dos Santos | 1.25 | 1 | 1.25 | Elite UFC heavyweight champion-level opponent. |
| 2 | 2013-10-19 | Junior dos Santos | 1.25 | 1 | 1.25 | Repeat win over elite champion-level heavyweight. |
| 3 | 2010-10-23 | Brock Lesnar | 1 | 1 | 1 | UFC heavyweight champion, high-profile but limited-depth champion context. |
| 4 | 2010-02-20 | Antonio Rodrigo Nogueira | 0.85 | 1 | 0.85 | All-time name, UFC/timing context keeps below max. |
| 5 | 2012-05-26 | Antonio Silva | 0.85 | 1 | 0.85 | Relevant heavyweight contender. |
| 6 | 2013-05-25 | Antonio Silva | 0.85 | 1 | 0.85 | Repeat contender win, slightly inflated by matchup dominance but no bonus. |
| 7 | 2016-07-09 | Travis Browne | 0.85 | 0.75 | 0.64 | Strong ranked heavyweight contender. |
| 8 | 2009-06-13 | Cheick Kongo | 0.65 | 0.75 | 0.49 | Quality heavyweight contender win. |
| 9 | 2009-10-24 | Ben Rothwell | 0.65 | 0.75 | 0.49 | Quality heavyweight veteran win. |
| 10 | 2008-07-19 | Jake O'Brien | 0.25 | 0.75 | 0.19 | Low UFC quality value. |
| 11 | 2009-02-07 | Denis Stojnic | 0.25 | 0.75 | 0.19 | Low UFC quality value. |
| 12 | 2008-04-19 | Brad Morris | 0.1 | 0.75 | 0.07 | Minimal UFC quality value. |

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

| From | To | Raw months | Counted months | Reason |
| --- | --- | --- | --- | --- |
| 2013-10-19 | 2015-06-13 | 19.78 | 18 | Between-fight gap capped at 18 months |

#### Loss-penalty receipts

The fight-level rules create raw loss events. The final category then compresses those events through severity, frequency, and a prime-loss volume floor. Exposure: **13** fights. Severity: **2.25**. Frequency: **1.04**. Prime-volume floor: **2**. Pre-division magnitude: **3.29**. Final penalty: **-3.29**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Raw event penalty | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2011-11-12 | Junior dos Santos | prime | top-five | home | Yes | Yes | -2.25 | standard rule |
| 2015-06-13 | Fabricio Werdum | prime | top-five | home | Yes | Yes | -2.25 | standard rule |
| 2019-02-17 | Francis Ngannou | post-prime | top-five | home | Yes | Yes | 0 | standard rule |

#### Division-strength context

Default division key: **cain-heavyweight-1.0**. Era-ledger division multiplier: **0.96**. Division-era modifier: **-1.55**.

Brock through Werdum.

#### Key judgment calls

- **Prime window:** Brock Lesnar → Fabricio Werdum.
- **Coverage:** Complete UFC ledger. Prime runs from Nogueira through Werdum.
- **Loss endpoint:** JDS I did not end it because Cain recovered and dominated rematches. Werdum closes it.

#### Why ranked here

Cain Velasquez ranks #23 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 50.52 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

#### Why not ranked higher?

Cain Velasquez is 1.07 raw points behind #22 Francis Ngannou. The largest category separation versus that next target is currently Prime Dominance; future movement must be earned through new UFC evidence and a full pipeline rerun.

#### Final takeaway

Cain Velasquez ranks #23 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 50.52 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

_Source IDs: fighter ledger verified through 2026-07-13; score owner ranking-pipeline.js; category owner category-calculators.js._

### 24. Benson Henderson — 90 OVR

Benson Henderson is ranked from the current UFC-only calculated pipeline.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 50.49 | 11-3 | Lightweight / Welterweight | 4 | 3.65 | 7 | 10-3 | 67.3% | 4.29 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 7.55 | 35 | 8.81 |
| Opponent Quality | 21.38 | 25 | 17.82 |
| Prime Dominance | 19.38 | 30 | 19.38 |
| Longevity | 11.83 | 10 | 3.94 |

Base score: **49.95**. Modifiers: Apex **+4.58**, Loss Penalty **-3.26**, Division-Era Depth **-0.78**. Final raw score: **50.49**.

OVR conversion: board anchors **18.68–101.92**, normalized score **0.3821**, curved score **0.4415**, resulting in **90 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 7.55 | #25 | 3.66 adjusted credit / 14.54 benchmark |
| Opponent Quality | 21.38 | #22 | 10.05 diminished credit / 14.1 benchmark |
| Prime Dominance | 19.38 | #36 | 19.38 raw × 100.0% sample |
| Longevity | 11.83 | #40 | 56.78 counted elite months |
| Apex modifier | +4.58 | Modifier | A championship-winning peak with strong proof and separation, but below the highest all-time best-fighter and aura tier. |
| Loss penalty | -3.26 | Modifier | 3 official/technical loss events reviewed |
| Division-era depth | -0.78 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **4**. Adjusted title wins: **3.65**. Derived undisputed-title win count: **4**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final adjusted credit | Review note |
| --- | --- | --- | --- | --- | --- | --- |
| 2012-02-26 | Frankie Edgar | normal | 1 | 1 | 1 | Approved aggregate Championship score recovered from the live control; exact historical per-fight split was not stored. |
| 2012-08-11 | Frankie Edgar | normal | 1 | 0.95 | 0.95 | Approved aggregate Championship score recovered from the live control; exact historical per-fight split was not stored. |
| 2012-12-08 | Nate Diaz | normal | 1 | 0.85 | 0.85 | Approved aggregate Championship score recovered from the live control; exact historical per-fight split was not stored. |
| 2013-04-20 | Gilbert Melendez | normal | 1 | 0.85 | 0.85 | Approved aggregate Championship score recovered from the live control; exact historical per-fight split was not stored. |

#### Opponent Quality receipts

Raw win credit: **11.15**. Diminishing-return credit before fighter adjustment: **10.05**. Fighter adjustment: **0**. Final diminished credit: **10.05**.

| Slot | Date | Opponent | Base/final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 2012-02-26 | Frankie Edgar | 1.25 | 1 | 1.25 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 2 | 2012-08-11 | Frankie Edgar | 1.25 | 1 | 1.25 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 3 | 2013-04-20 | Gilbert Melendez | 1.25 | 1 | 1.25 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 4 | 2011-08-14 | Jim Miller | 1 | 1 | 1 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 5 | 2011-11-12 | Clay Guida | 1 | 1 | 1 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 6 | 2012-12-08 | Nate Diaz | 1 | 1 | 1 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 7 | 2014-01-25 | Josh Thomson | 1 | 0.75 | 0.75 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 8 | 2011-04-30 | Mark Bocek | 0.85 | 0.75 | 0.64 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 9 | 2014-06-07 | Rustam Khabilov | 0.85 | 0.75 | 0.64 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 10 | 2015-02-14 | Brandon Thatch | 0.85 | 0.75 | 0.64 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 11 | 2015-11-28 | Jorge Masvidal | 0.85 | 0.75 | 0.64 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |

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

#### Loss-penalty receipts

The fight-level rules create raw loss events. The final category then compresses those events through severity, frequency, and a prime-loss volume floor. Exposure: **14** fights. Severity: **2.25**. Frequency: **1.29**. Prime-volume floor: **2.75**. Pre-division magnitude: **3.54**. Final penalty: **-3.26**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Raw event penalty | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2013-08-31 | Anthony Pettis | prime | champion-level | home | Yes | Yes | -2.25 | standard rule |
| 2014-08-23 | Rafael dos Anjos | prime | champion-level | home | Yes | Yes | -2.25 | standard rule |
| 2015-01-18 | Donald Cerrone | prime | top-five | home | No | Yes | -1.5 | standard rule |

#### Division-strength context

Default division key: **lightweight-murderers-row-1.10**. Era-ledger division multiplier: **1.05**. Division-era modifier: **-0.78**.

Miller through Masvidal.

#### Key judgment calls

- **Prime window:** Jim Miller → Jorge Masvidal.
- **Coverage:** Complete UFC-only ledger.
- **Loss endpoint:** Masvidal closes Benson’s UFC elite window on his final UFC win.

#### Why ranked here

Benson Henderson ranks #24 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 50.49 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

#### Why not ranked higher?

Benson Henderson is 0.03 raw points behind #23 Cain Velasquez. The largest category separation versus that next target is currently Prime Dominance; future movement must be earned through new UFC evidence and a full pipeline rerun.

#### Final takeaway

Benson Henderson ranks #24 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 50.49 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

_Source IDs: fighter ledger verified through 2026-07-13; score owner ranking-pipeline.js; category owner category-calculators.js._

### 25. Aljamain Sterling — 89 OVR

Aljamain Sterling is ranked from the current UFC-only calculated pipeline.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 50.21 | 19-5 | Bantamweight / Featherweight | 4 | 3.25 | 9 | 9-2 | 71.0% | 7.1 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 6.5 | 35 | 7.58 |
| Opponent Quality | 24.02 | 25 | 20.02 |
| Prime Dominance | 18.16 | 30 | 18.16 |
| Longevity | 8.64 | 10 | 2.88 |

Base score: **48.64**. Modifiers: Apex **+4.36**, Loss Penalty **-2.74**, Division-Era Depth **-0.05**. Final raw score: **50.21**.

OVR conversion: board anchors **18.68–101.92**, normalized score **0.3788**, curved score **0.4382**, resulting in **89 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 6.5 | #29 | 3.15 adjusted credit / 14.54 benchmark |
| Opponent Quality | 24.02 | #8 | 11.29 diminished credit / 14.1 benchmark |
| Prime Dominance | 18.16 | #45 | 19.12 raw × 95.0% sample |
| Longevity | 8.64 | #51 | 41.47 counted elite months |
| Apex modifier | +4.36 | Modifier | Modern bantamweight title apex with Yan/Cejudo proof. |
| Loss penalty | -2.74 | Modifier | 5 official/technical loss events reviewed |
| Division-era depth | -0.05 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **4**. Adjusted title wins: **3.25**. Derived undisputed-title win count: **4**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final adjusted credit | Review note |
| --- | --- | --- | --- | --- | --- | --- |
| 2021-03-06 | Petr Yan | normal | 1 | 0.5 | 0.5 | DQ title win/weird title context; Cody locked DQ rule at 0.50. |
| 2022-04-09 | Petr Yan | normal | 1 | 0.95 | 0.95 | locked |
| 2022-10-22 | T.J. Dillashaw | normal | 1 | 0.75 | 0.75 | Injured/compromised opponent. |
| 2023-05-06 | Henry Cejudo | normal | 1 | 0.95 | 0.95 | locked |

#### Opponent Quality receipts

Raw win credit: **14**. Diminishing-return credit before fighter adjustment: **11.29**. Fighter adjustment: **0**. Final diminished credit: **11.29**.

| Slot | Date | Opponent | Base/final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 2022-04-09 | Petr Yan | 1.25 | 1 | 1.25 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 2 | 2023-05-06 | Henry Cejudo | 1.25 | 1 | 1.25 | Former two-division UFC champion returning, still elite. |
| 3 | 2020-06-06 | Cory Sandhagen | 1 | 1 | 1 | Elite bantamweight contender. |
| 4 | 2025-08-23 | Brian Ortega | 1 | 1 | 1 | Top-five featherweight contender. |
| 5 | 2026-04-25 | Youssef Zalal | 1 | 1 | 1 | Top-five featherweight contender in the approved app timeline. |
| 6 | 2014-09-20 | Takeya Mizugaki | 0.85 | 1 | 0.85 | Strong ranked bantamweight win. |
| 7 | 2019-02-17 | Jimmie Rivera | 0.85 | 0.75 | 0.64 | Strong ranked bantamweight contender. |
| 8 | 2019-06-08 | Pedro Munhoz | 0.85 | 0.75 | 0.64 | Strong ranked bantamweight contender. |
| 9 | 2022-10-22 | T.J. Dillashaw | 0.85 | 0.75 | 0.64 | Former champion, but injury context heavily noted. |
| 10 | 2024-04-13 | Calvin Kattar | 0.85 | 0.75 | 0.64 | Strong ranked featherweight win. |
| 11 | 2018-04-21 | Brett Johns | 0.65 | 0.75 | 0.49 | Quality bantamweight win. |
| 12 | 2021-03-06 | Petr Yan | 0.65 | 0.75 | 0.49 | Official DQ win over an elite opponent; quality credit is capped because the result did not establish a normal competitive victory. |
| 13 | 2014-02-22 | Cody Gibson | 0.45 | 0.5 | 0.23 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 14 | 2014-07-16 | Hugo Viana | 0.45 | 0.5 | 0.23 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 15 | 2015-04-18 | Manny Gamburyan | 0.45 | 0.5 | 0.23 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 16 | 2017-04-15 | Augusto Mendes | 0.45 | 0.5 | 0.23 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 17 | 2017-07-29 | Renan Barao | 0.45 | 0.5 | 0.23 | Former champion name, but late-career timing. |
| 18 | 2018-09-08 | Cody Stamann | 0.45 | 0.5 | 0.23 | Solid bantamweight win. |
| 19 | 2015-12-10 | Johnny Eduardo | 0.25 | 0.25 | 0.06 | Low-end UFC quality value. |

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

#### Loss-penalty receipts

The fight-level rules create raw loss events. The final category then compresses those events through severity, frequency, and a prime-loss volume floor. Exposure: **20** fights. Severity: **1.88**. Frequency: **0.86**. Prime-volume floor: **1**. Pre-division magnitude: **2.74**. Final penalty: **-2.74**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Raw event penalty | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2016-05-29 | Bryan Caraway | pre-prime | top-ten | home | No | Yes | -1.25 | standard rule |
| 2017-01-28 | Raphael Assuncao | pre-prime | top-five | home | No | Yes | -0.75 | standard rule |
| 2017-12-09 | Marlon Moraes | pre-prime | top-five | home | Yes | Yes | -1.5 | standard rule |
| 2023-08-19 | Sean O'Malley | prime | top-five | home | Yes | Yes | -2.25 | standard rule |
| 2024-12-07 | Movsar Evloev | post-prime | top-five | home | No | Yes | 0 | standard rule |

#### Division-strength context

Default division key: **modern-bantamweight-featherweight-1.02**. Era-ledger division multiplier: **1**. Division-era modifier: **-0.05**.

Sandhagen through O’Malley.

#### Key judgment calls

- **Prime window:** Cory Sandhagen → Sean O’Malley.
- **Coverage:** Complete UFC-only ledger through 2026-04-25. Regional fights excluded; Ortega catchweight bout retained as a UFC win.
- **Loss endpoint:** O’Malley closes bantamweight title-prime unless later featherweight elite recovery is scored.

#### Why ranked here

Aljamain Sterling ranks #25 because Opponent Quality and Prime Dominance provide the largest weighted parts of a 50.21 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

#### Why not ranked higher?

Aljamain Sterling is 0.28 raw points behind #24 Benson Henderson. The largest category separation versus that next target is currently Longevity; future movement must be earned through new UFC evidence and a full pipeline rerun.

#### Final takeaway

Aljamain Sterling ranks #25 because Opponent Quality and Prime Dominance provide the largest weighted parts of a 50.21 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

_Source IDs: fighter ledger verified through 2026-07-13; score owner ranking-pipeline.js; category owner category-calculators.js._

### 26. Junior dos Santos — 89 OVR

Junior dos Santos is ranked from the current UFC-only calculated pipeline.

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

OVR conversion: board anchors **18.68–101.92**, normalized score **0.3770**, curved score **0.4364**, resulting in **89 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 3.82 | #45 | 1.85 adjusted credit / 14.54 benchmark |
| Opponent Quality | 22.34 | #15 | 10.5 diminished credit / 14.1 benchmark |
| Prime Dominance | 22.5 | #16 | 22.5 raw × 100.0% sample |
| Longevity | 12.92 | #33 | 62 counted elite months |
| Apex modifier | +4.97 | Modifier | A shutout over an elite challenger followed by a championship knockout captures JDS’s sharpest UFC peak. |
| Loss penalty | -2.82 | Modifier | 8 official/technical loss events reviewed |
| Division-era depth | -1.98 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **2**. Adjusted title wins: **1.85**. Derived undisputed-title win count: **2**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final adjusted credit | Review note |
| --- | --- | --- | --- | --- | --- | --- |
| 2011-11-12 | Cain Velasquez | normal | 1 | 0.95 | 0.95 | locked |
| 2012-05-26 | Frank Mir | normal | 1 | 0.9 | 0.9 | locked |

#### Opponent Quality receipts

Raw win credit: **12.4**. Diminishing-return credit before fighter adjustment: **10.5**. Fighter adjustment: **0**. Final diminished credit: **10.5**.

| Slot | Date | Opponent | Base/final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 2011-11-12 | Cain Velasquez | 1.25 | 1 | 1.25 | Elite heavyweight champion-level opponent. |
| 2 | 2014-12-13 | Stipe Miocic | 1.25 | 1 | 1.25 | Elite future UFC heavyweight champion. |
| 3 | 2008-10-25 | Fabricio Werdum | 1 | 1 | 1 | Elite heavyweight and future UFC champion. |
| 4 | 2011-06-11 | Shane Carwin | 1 | 1 | 1 | Elite heavyweight contender and interim champion. |
| 5 | 2012-05-26 | Frank Mir | 1 | 1 | 1 | Former UFC heavyweight champion. |
| 6 | 2010-08-07 | Roy Nelson | 0.85 | 1 | 0.85 | Strong ranked heavyweight contender. |
| 7 | 2013-05-25 | Mark Hunt | 0.85 | 0.75 | 0.64 | Dangerous ranked heavyweight contender. |
| 8 | 2016-04-10 | Ben Rothwell | 0.85 | 0.75 | 0.64 | Ranked heavyweight contender. |
| 9 | 2019-03-09 | Derrick Lewis | 0.85 | 0.75 | 0.64 | Dangerous ranked heavyweight contender. |
| 10 | 2009-09-19 | Mirko Cro Cop | 0.65 | 0.75 | 0.49 | Legend name with UFC/timing context. |
| 11 | 2010-03-21 | Gabriel Gonzaga | 0.65 | 0.75 | 0.49 | Ranked heavyweight veteran. |
| 12 | 2018-07-14 | Blagoy Ivanov | 0.65 | 0.75 | 0.49 | Ranked-quality heavyweight win. |
| 13 | 2018-12-02 | Tai Tuivasa | 0.65 | 0.5 | 0.33 | Quality heavyweight win late in JDS run. |
| 14 | 2009-02-21 | Stefan Struve | 0.45 | 0.5 | 0.23 | Solid early UFC heavyweight win. |
| 15 | 2010-01-02 | Gilbert Yvel | 0.45 | 0.5 | 0.23 | Approved supporting UFC win treatment. |

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

#### Loss-penalty receipts

The fight-level rules create raw loss events. The final category then compresses those events through severity, frequency, and a prime-loss volume floor. Exposure: **12** fights. Severity: **1.88**. Frequency: **0.94**. Prime-volume floor: **1.75**. Pre-division magnitude: **2.82**. Final penalty: **-2.82**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Raw event penalty | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2012-12-29 | Cain Velasquez | prime | champion-level | home | No | Yes | -1.5 | standard rule |
| 2013-10-19 | Cain Velasquez | prime | champion-level | home | Yes | Yes | -2.25 | standard rule |
| 2015-12-19 | Alistair Overeem | post-prime | top-five | home | Yes | Yes | 0 | standard rule |
| 2017-05-13 | Stipe Miocic | post-prime | champion-level | home | Yes | Yes | 0 | standard rule |
| 2019-06-29 | Francis Ngannou | post-prime | top-five | home | Yes | Yes | 0 | standard rule |
| 2020-01-25 | Curtis Blaydes | post-prime | top-five | home | Yes | Yes | 0 | standard rule |
| 2020-08-15 | Jairzinho Rozenstruik | post-prime | top-ten | home | Yes | Yes | 0 | standard rule |
| 2020-12-12 | Ciryl Gane | post-prime | top-ten | home | Yes | Yes | 0 | standard rule |

#### Division-strength context

Default division key: **ufc-heavyweight-0.96**. Era-ledger division multiplier: **0.96**. Division-era modifier: **-1.98**.

Werdum through Cain III.

#### Key judgment calls

- **Prime window:** Fabricio Werdum → Cain Velasquez III.
- **Coverage:** Complete UFC-only ledger through 2020-12-12. Non-UFC fights excluded.
- **Loss endpoint:** Cain II does not end it alone because trilogy title fight follows. Cain III closes window.

#### Why ranked here

Junior dos Santos ranks #26 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 50.06 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

#### Why not ranked higher?

Junior dos Santos is 0.15 raw points behind #25 Aljamain Sterling. The largest category separation versus that next target is currently Championship; future movement must be earned through new UFC evidence and a full pipeline rerun.

#### Final takeaway

Junior dos Santos ranks #26 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 50.06 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

_Source IDs: fighter ledger verified through 2026-07-13; score owner ranking-pipeline.js; category owner category-calculators.js._

### 27. B.J. Penn — 89 OVR

B.J. Penn is ranked from the current UFC-only calculated pipeline.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 49.37 | 13-13-2 | Lightweight / Welterweight | 5 | 4.9 | 7 | 6-5 | 59.5% | 5.98 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 9.86 | 35 | 11.5 |
| Opponent Quality | 19.36 | 25 | 16.13 |
| Prime Dominance | 18.37 | 30 | 18.37 |
| Longevity | 16.65 | 10 | 5.55 |

Base score: **51.55**. Modifiers: Apex **+4.44**, Loss Penalty **-3.91**, Division-Era Depth **-2.71**. Final raw score: **49.37**.

OVR conversion: board anchors **18.68–101.92**, normalized score **0.3687**, curved score **0.4282**, resulting in **89 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 9.86 | #16 | 4.78 adjusted credit / 14.54 benchmark |
| Opponent Quality | 19.36 | #32 | 9.1 diminished credit / 14.1 benchmark |
| Prime Dominance | 18.37 | #43 | 18.37 raw × 100.0% sample |
| Longevity | 16.65 | #19 | 79.91 counted elite months |
| Apex modifier | +4.44 | Modifier | Prime lightweight title aura and best-fighter argument. |
| Loss penalty | -3.91 | Modifier | 13 official/technical loss events reviewed |
| Division-era depth | -2.71 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **5**. Adjusted title wins: **4.9**. Derived undisputed-title win count: **5**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final adjusted credit | Review note |
| --- | --- | --- | --- | --- | --- | --- |
| 2004-01-31 | Matt Hughes | normal | 1 | 0.95 | 0.95 | locked |
| 2008-01-19 | Joe Stevenson | vacant-second-division | 1.15 | 0.85 | 0.98 | Vacant second-division title vs softer opponent. |
| 2008-05-24 | Sean Sherk | normal | 1 | 0.95 | 0.95 | locked |
| 2009-08-08 | Kenny Florian | normal | 1 | 0.95 | 0.95 | locked |
| 2009-12-12 | Diego Sanchez | normal | 1 | 0.95 | 0.95 | locked |

#### Opponent Quality receipts

Raw win credit: **10.25**. Diminishing-return credit before fighter adjustment: **9.1**. Fighter adjustment: **0**. Final diminished credit: **9.1**.

| Slot | Date | Opponent | Base/final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 2004-01-31 | Matt Hughes | 1.25 | 1 | 1.25 | Elite UFC welterweight champion and all-time great. |
| 2 | 2008-05-24 | Sean Sherk | 1 | 1 | 1 | Former UFC lightweight champion and top contender. |
| 3 | 2009-08-08 | Kenny Florian | 1 | 1 | 1 | Elite lightweight title challenger. |
| 4 | 2009-12-12 | Diego Sanchez | 1 | 1 | 1 | Top lightweight contender at the time. |
| 5 | 2010-11-20 | Matt Hughes | 1 | 1 | 1 | Elite former champion rematch win. |
| 6 | 2001-11-02 | Caol Uno | 0.85 | 1 | 0.85 | Elite early lightweight contender. |
| 7 | 2007-06-23 | Jens Pulver | 0.85 | 0.75 | 0.64 | Former UFC lightweight champion, timing-adjusted. |
| 8 | 2008-01-19 | Joe Stevenson | 0.85 | 0.75 | 0.64 | Lightweight title opponent and ranked contender. |
| 9 | 2002-09-27 | Matt Serra | 0.65 | 0.75 | 0.49 | Quality lightweight/welterweight name and future champion. |
| 10 | 2001-05-04 | Joey Gilbert | 0.45 | 0.75 | 0.34 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 11 | 2001-06-29 | Din Thomas | 0.45 | 0.75 | 0.34 | Useful early UFC lightweight win. |
| 12 | 2002-05-10 | Paul Creighton | 0.45 | 0.75 | 0.34 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 13 | 2003-04-25 | Duane Ludwig | 0.45 | 0.5 | 0.23 | Official UFC 42 win; useful but not ranked-quality proof. |

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

| From | To | Raw months | Counted months | Reason |
| --- | --- | --- | --- | --- |
| 2004-01-31 | 2006-03-04 | 25.07 | 18 | Between-fight gap capped at 18 months |

#### Loss-penalty receipts

The fight-level rules create raw loss events. The final category then compresses those events through severity, frequency, and a prime-loss volume floor. Exposure: **19** fights. Severity: **1.88**. Frequency: **1.38**. Prime-volume floor: **4.25**. Pre-division magnitude: **4.25**. Final penalty: **-3.91**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Raw event penalty | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2002-01-11 | Jens Pulver | pre-prime | champion-level | home | No | Yes | -0.75 | standard rule |
| 2006-03-04 | Georges St-Pierre | prime | top-five | home | No | Yes | -1.5 | standard rule |
| 2006-09-23 | Matt Hughes | prime | champion-level | home | Yes | Yes | -2.25 | standard rule |
| 2009-01-31 | Georges St-Pierre | prime | champion-level | upward | Yes | Yes | -1.25 | prime-upward-elite |
| 2010-04-10 | Frankie Edgar | prime | top-five | home | No | Yes | -1.5 | standard rule |
| 2010-08-28 | Frankie Edgar | prime | champion-level | home | No | Yes | -1.5 | standard rule |
| 2011-10-29 | Nick Diaz | post-prime | top-five | home | No | Yes | 0 | standard rule |
| 2012-12-08 | Rory MacDonald | post-prime | top-five | home | No | Yes | 0 | standard rule |
| 2014-07-06 | Frankie Edgar | post-prime | top-five | home | Yes | Yes | 0 | standard rule |
| 2017-01-15 | Yair Rodriguez | post-prime | top-ten | home | Yes | Yes | 0 | standard rule |
| 2017-06-25 | Dennis Siver | post-prime | ranked | home | No | Yes | 0 | standard rule |
| 2018-12-29 | Ryan Hall | post-prime | solid | home | Yes | Yes | 0 | standard rule |
| 2019-05-11 | Clay Guida | post-prime | name-value | home | No | Yes | 0 | standard rule |

#### Division-strength context

Default division key: **penn-lightweight-welterweight-1.03**. Era-ledger division multiplier: **1.05**. Division-era modifier: **-2.71**.

Hughes I through Edgar II.

#### Key judgment calls

- **Prime window:** Matt Hughes I → Frankie Edgar II.
- **Coverage:** Complete UFC-only ledger through 2019-05-11. Non-UFC results excluded. Opponent Quality audit added the omitted official UFC 42 win over Duane Ludwig.
- **Loss endpoint:** GSP II did not end lightweight prime. Edgar II closes window; late collapse post-prime.

#### Why ranked here

B.J. Penn ranks #27 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 49.37 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

#### Why not ranked higher?

B.J. Penn is 0.69 raw points behind #26 Junior dos Santos. The largest category separation versus that next target is currently Prime Dominance; future movement must be earned through new UFC evidence and a full pipeline rerun.

#### Final takeaway

B.J. Penn ranks #27 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 49.37 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

_Source IDs: fighter ledger verified through 2026-07-13; score owner ranking-pipeline.js; category owner category-calculators.js._

### 28. Glover Teixeira — 89 OVR

Glover Teixeira is ranked from the current UFC-only calculated pipeline.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 48.47 | 16-7 | Light Heavyweight | 1 | 1 | 7 | 12-6 | 55.1% | 8.77 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 2.05 | 35 | 2.39 |
| Opponent Quality | 24.55 | 25 | 20.46 |
| Prime Dominance | 19.07 | 30 | 19.07 |
| Longevity | 23 | 10 | 7.67 |

Base score: **49.59**. Modifiers: Apex **+4.25**, Loss Penalty **-5.25**, Division-Era Depth **-0.12**. Final raw score: **48.47**.

OVR conversion: board anchors **18.68–101.92**, normalized score **0.3579**, curved score **0.4175**, resulting in **89 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 2.05 | #52 | 0.99 adjusted credit / 14.54 benchmark |
| Opponent Quality | 24.55 | #6 | 11.54 diminished credit / 14.1 benchmark |
| Prime Dominance | 19.07 | #39 | 19.07 raw × 100.0% sample |
| Longevity | 23 | #7 | 110.4 counted elite months |
| Apex modifier | +4.25 | Modifier | Elite late-career title run with strong proof, but not a serious best-fighter-alive claim and only moderate Apex aura. |
| Loss penalty | -5.25 | Modifier | 7 official/technical loss events reviewed |
| Division-era depth | -0.12 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **1**. Adjusted title wins: **1**. Derived undisputed-title win count: **1**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final adjusted credit | Review note |
| --- | --- | --- | --- | --- | --- | --- |
| 2021-10-30 | Jan Błachowicz | normal | 1 | 1 | 0.99 | Approved aggregate Championship score recovered from the live control; exact historical per-fight split was not stored. |

#### Opponent Quality receipts

Raw win credit: **13.95**. Diminishing-return credit before fighter adjustment: **11.54**. Fighter adjustment: **0**. Final diminished credit: **11.54**.

| Slot | Date | Opponent | Base/final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 2016-04-16 | Rashad Evans | 1.25 | 1 | 1.25 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 2 | 2021-10-30 | Jan Błachowicz | 1.25 | 1 | 1.25 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 3 | 2013-01-26 | Quinton Jackson | 1 | 1 | 1 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 4 | 2013-09-04 | Ryan Bader | 1 | 1 | 1 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 5 | 2015-08-08 | Ovince Saint Preux | 1 | 1 | 1 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 6 | 2020-05-13 | Anthony Smith | 1 | 1 | 1 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 7 | 2020-11-07 | Thiago Santos | 1 | 0.75 | 0.75 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 8 | 2013-05-25 | James Te Huna | 0.85 | 0.75 | 0.64 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 9 | 2015-11-07 | Patrick Cummins | 0.85 | 0.75 | 0.64 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 10 | 2017-02-11 | Jared Cannonier | 0.85 | 0.75 | 0.64 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 11 | 2017-12-16 | Misha Cirkunov | 0.85 | 0.75 | 0.64 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 12 | 2019-04-27 | Ion Cuțelaba | 0.85 | 0.75 | 0.64 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 13 | 2019-09-14 | Nikita Krylov | 0.85 | 0.5 | 0.42 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 14 | 2012-05-26 | Kyle Kingsbury | 0.45 | 0.5 | 0.23 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 15 | 2012-10-13 | Fábio Maldonado | 0.45 | 0.5 | 0.23 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 16 | 2019-01-19 | Karl Roberson | 0.45 | 0.5 | 0.23 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |

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

#### Loss-penalty receipts

The fight-level rules create raw loss events. The final category then compresses those events through severity, frequency, and a prime-loss volume floor. Exposure: **22** fights. Severity: **3.13**. Frequency: **1.88**. Prime-volume floor: **5.25**. Pre-division magnitude: **5.25**. Final penalty: **-5.25**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Raw event penalty | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2014-04-26 | Jon Jones | prime | champion-level | home | No | Yes | -1.5 | standard rule |
| 2014-10-25 | Phil Davis | prime | top-five | home | No | Yes | -1.5 | standard rule |
| 2016-08-20 | Anthony Johnson | prime | top-five | home | Yes | Yes | -2.25 | standard rule |
| 2017-05-28 | Alexander Gustafsson | prime | champion-level | home | Yes | Yes | -2.25 | standard rule |
| 2018-07-22 | Corey Anderson | prime | top-ten | home | No | Yes | -4 | standard rule |
| 2022-06-11 | Jiří Procházka | prime | champion-level | home | Yes | Yes | -2.25 | standard rule |
| 2023-01-21 | Jamahal Hill | post-prime | top-five | home | No | Yes | 0 | standard rule |

#### Division-strength context

Default division key: **light-heavyweight-1.00**. Era-ledger division multiplier: **0.99**. Division-era modifier: **-0.12**.

Bader through Jiri with long gaps capped.

#### Key judgment calls

- **Prime window:** Ryan Bader → Jiri Prochazka.
- **Coverage:** Complete UFC-only ledger.
- **Loss endpoint:** Jiri closes the late championship-prime window after Glover’s title-winning resurgence.

#### Why ranked here

Glover Teixeira ranks #28 because Opponent Quality and Prime Dominance provide the largest weighted parts of a 48.47 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

#### Why not ranked higher?

Glover Teixeira is 0.9 raw points behind #27 B.J. Penn. The largest category separation versus that next target is currently Championship; future movement must be earned through new UFC evidence and a full pipeline rerun.

#### Final takeaway

Glover Teixeira ranks #28 because Opponent Quality and Prime Dominance provide the largest weighted parts of a 48.47 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

_Source IDs: fighter ledger verified through 2026-07-13; score owner ranking-pipeline.js; category owner category-calculators.js._

### 29. Dustin Poirier — 89 OVR

Dustin Poirier is ranked from the current UFC-only calculated pipeline.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 48.37 | 22-9, 1 NC | Lightweight / Featherweight | 1 | 0.75 | 8 | 7-4 | 54.5% | 5.85 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 1.46 | 35 | 1.7 |
| Opponent Quality | 25.05 | 25 | 20.88 |
| Prime Dominance | 18.81 | 30 | 18.81 |
| Longevity | 16.39 | 10 | 5.46 |

Base score: **46.85**. Modifiers: Apex **+4.94**, Loss Penalty **-3.4**, Division-Era Depth **-0.02**. Final raw score: **48.37**.

OVR conversion: board anchors **18.68–101.92**, normalized score **0.3567**, curved score **0.4163**, resulting in **89 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 1.46 | #57 | 0.71 adjusted credit / 14.54 benchmark |
| Opponent Quality | 25.05 | #5 | 11.78 diminished credit / 14.1 benchmark |
| Prime Dominance | 18.81 | #41 | 18.81 raw × 100.0% sample |
| Longevity | 16.39 | #20 | 78.65 counted elite months |
| Apex modifier | +4.94 | Modifier | Two elite wins inside one year, capped by the interim lightweight title, provide exceptional Proof without a sustained best-fighter claim. |
| Loss penalty | -3.4 | Modifier | 9 official/technical loss events reviewed |
| Division-era depth | -0.02 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **1**. Adjusted title wins: **0.75**. Derived undisputed-title win count: **0**. Interim-title win count: **1**.

| Date | Opponent | Title type | Base | Opponent strength | Final adjusted credit | Review note |
| --- | --- | --- | --- | --- | --- | --- |
| 2019-04-13 | Max Holloway | interim | 0.75 | 0.95 | 0.71 | Interim lightweight title over elite former champ. |

#### Opponent Quality receipts

Raw win credit: **15.55**. Diminishing-return credit before fighter adjustment: **11.78**. Fighter adjustment: **0**. Final diminished credit: **11.78**.

| Slot | Date | Opponent | Base/final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 2012-02-04 | Max Holloway | 1.25 | 1 | 1.25 | Elite champion-level opponent moving up for interim lightweight title. |
| 2 | 2018-04-14 | Justin Gaethje | 1.25 | 1 | 1.25 | Prime elite lightweight contender. |
| 3 | 2018-07-28 | Eddie Alvarez | 1 | 1 | 1 | Former UFC champion and elite lightweight contender. |
| 4 | 2021-01-24 | Conor McGregor | 1 | 1 | 1 | Former two-division champion name with activity/timing context. |
| 5 | 2022-11-12 | Michael Chandler | 1 | 1 | 1 | Elite lightweight contender and former title challenger. |
| 6 | 2011-01-01 | Josh Grispi | 0.85 | 1 | 0.85 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 7 | 2017-11-11 | Anthony Pettis | 0.85 | 0.75 | 0.64 | Former UFC champion, later-career lightweight context. |
| 8 | 2020-06-27 | Dan Hooker | 0.85 | 0.75 | 0.64 | Strong ranked lightweight contender. |
| 9 | 2021-07-10 | Conor McGregor | 0.85 | 0.75 | 0.64 | High-level name, but injury/weird ending context. |
| 10 | 2024-03-09 | Benoit Saint Denis | 0.85 | 0.75 | 0.64 | Dangerous rising lightweight contender. |
| 11 | 2015-04-04 | Carlos Diego Ferreira | 0.65 | 0.75 | 0.49 | Solid ranked-quality lightweight win. |
| 12 | 2016-01-02 | Joseph Duffy | 0.65 | 0.75 | 0.49 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 13 | 2016-06-04 | Bobby Green | 0.65 | 0.5 | 0.33 | Quality lightweight win. |
| 14 | 2017-02-11 | Jim Miller | 0.65 | 0.5 | 0.33 | Quality veteran lightweight win. |
| 15 | 2011-06-11 | Jason Young | 0.45 | 0.5 | 0.23 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 16 | 2011-11-12 | Pablo Garza | 0.45 | 0.5 | 0.23 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 17 | 2013-08-31 | Erik Koch | 0.45 | 0.5 | 0.23 | Solid UFC featherweight win. |
| 18 | 2013-12-28 | Diego Brandao | 0.45 | 0.5 | 0.23 | Solid featherweight win. |
| 19 | 2015-06-06 | Yancy Medeiros | 0.45 | 0.25 | 0.11 | Useful UFC win. |
| 20 | 2019-04-13 | Max Holloway | 0.45 | 0.25 | 0.11 | Early Holloway win before Max became elite. |
| 21 | 2012-12-15 | Jonathan Brookins | 0.25 | 0.25 | 0.06 | Low-end UFC quality value. |
| 22 | 2014-04-16 | Akira Corassani | 0.25 | 0.25 | 0.06 | Low-end UFC quality value. |

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

#### Loss-penalty receipts

The fight-level rules create raw loss events. The final category then compresses those events through severity, frequency, and a prime-loss volume floor. Exposure: **30** fights. Severity: **2.25**. Frequency: **1.48**. Prime-volume floor: **4**. Pre-division magnitude: **4**. Final penalty: **-3.4**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Raw event penalty | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2012-05-15 | Chan Sung Jung | pre-prime | top-five | home | Yes | Yes | -1.5 | standard rule |
| 2013-02-16 | Cub Swanson | pre-prime | top-five | home | No | Yes | -0.75 | standard rule |
| 2014-09-27 | Conor McGregor | pre-prime | top-five | home | Yes | Yes | -1.5 | standard rule |
| 2016-09-17 | Michael Johnson | pre-prime | top-ten | home | Yes | Yes | -2 | standard rule |
| 2019-09-07 | Khabib Nurmagomedov | prime | champion-level | home | Yes | Yes | -2.25 | standard rule |
| 2021-12-11 | Charles Oliveira | prime | champion-level | home | Yes | Yes | -2.25 | standard rule |
| 2023-07-29 | Justin Gaethje | prime | top-five | home | Yes | Yes | -2.25 | standard rule |
| 2024-06-01 | Islam Makhachev | prime | champion-level | home | Yes | Yes | -2.25 | standard rule |
| 2025-07-19 | Max Holloway | post-prime | top-five | home | No | Yes | 0 | standard rule |

#### Division-strength context

Default division key: **modern-lightweight-1.10**. Era-ledger division multiplier: **1.1**. Division-era modifier: **-0.02**.

Alvarez II through Islam.

#### Key judgment calls

- **Prime window:** Eddie Alvarez II → Islam Makhachev.
- **Coverage:** Complete UFC-only ledger through 2025-07-19. Non-UFC results excluded.
- **Loss endpoint:** Khabib and Oliveira did not end it because Poirier recovered with more elite wins/title fights. Islam is endpoint.

#### Why ranked here

Dustin Poirier ranks #29 because Opponent Quality and Prime Dominance provide the largest weighted parts of a 48.37 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

#### Why not ranked higher?

Dustin Poirier is 0.1 raw points behind #28 Glover Teixeira. The largest category separation versus that next target is currently Longevity; future movement must be earned through new UFC evidence and a full pipeline rerun.

#### Final takeaway

Dustin Poirier ranks #29 because Opponent Quality and Prime Dominance provide the largest weighted parts of a 48.37 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

_Source IDs: fighter ledger verified through 2026-07-13; score owner ranking-pipeline.js; category owner category-calculators.js._

### 30. Alexandre Pantoja — 89 OVR

Alexandre Pantoja is ranked from the current UFC-only calculated pipeline.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 48.26 | 14-4 | Flyweight | 5 | 4.4 | 5 | 8-1 | 77.8% | 4.83 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 9.08 | 35 | 10.59 |
| Opponent Quality | 10.55 | 25 | 8.79 |
| Prime Dominance | 23.19 | 30 | 23.19 |
| Longevity | 12.4 | 10 | 4.13 |

Base score: **46.7**. Modifiers: Apex **+4.4**, Loss Penalty **-2.09**, Division-Era Depth **-0.75**. Final raw score: **48.26**.

OVR conversion: board anchors **18.68–101.92**, normalized score **0.3554**, curved score **0.4150**, resulting in **89 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 9.08 | #19 | 4.4 adjusted credit / 14.54 benchmark |
| Opponent Quality | 10.55 | #57 | 5.11 diminished credit / 14.54 benchmark |
| Prime Dominance | 23.19 | #14 | 23.19 raw × 100.0% sample |
| Longevity | 12.4 | #36 | 59.51 counted elite months |
| Apex modifier | +4.4 | Modifier | Elite modern flyweight apex below the mythic cross-divisional peaks. |
| Loss penalty | -2.09 | Modifier | 4 official/technical loss events reviewed |
| Division-era depth | -0.75 | Modifier | Apply a modest modern-flyweight depth discount. |

#### Championship receipts

UFC title-fight wins: **5**. Adjusted title wins: **4.4**. Derived undisputed-title win count: **5**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final adjusted credit | Review note |
| --- | --- | --- | --- | --- | --- | --- |
| — | Brandon Moreno | — | — | — | 1 | locked |
| — | Brandon Royval | — | — | — | 0.95 | locked |
| — | Steve Erceg | — | — | — | 0.8 | locked |
| — | Kai Asakura | — | — | — | 0.75 | locked |
| — | Kai Kara-France | — | — | — | 0.9 | locked |

#### Opponent Quality receipts

Raw win credit: **5.45**. Diminishing-return credit before fighter adjustment: **5.11**. Fighter adjustment: **0**. Final diminished credit: **5.11**.

| Slot | Date | Opponent | Base/final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | — | Brandon Moreno | 1 | 1 | 1 | locked |
| 2 | — | Brandon Royval | 0.7 | 1 | 0.7 | locked |
| 3 | — | Brandon Royval | 0.7 | 1 | 0.7 | locked |
| 4 | — | Alex Perez | 0.65 | 1 | 0.65 | locked |
| 5 | — | Kai Kara-France | 0.65 | 1 | 0.65 | locked |
| 6 | — | Brandon Moreno | 0.4 | 1 | 0.4 | locked |
| 7 | — | Manel Kape | 0.35 | 0.75 | 0.26 | locked |
| 8 | — | Wilson Reis | 0.3 | 0.75 | 0.23 | locked |
| 9 | — | Matt Schnell | 0.25 | 0.75 | 0.19 | locked |
| 10 | — | Steve Erceg | 0.25 | 0.75 | 0.19 | locked |
| 11 | — | Kai Asakura | 0.2 | 0.75 | 0.15 | locked |

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

Active elite years: **4.83**. Raw calendar months: **58**. Gap-adjusted months: **58**. Status multiplier: **1.08**. Division multiplier: **0.95**. Counted elite months: **59.51**.

#### Loss-penalty receipts

The fight-level rules create raw loss events. The final category then compresses those events through severity, frequency, and a prime-loss volume floor. Exposure: **18** fights. Severity: **1.38**. Frequency: **0.71**. Prime-volume floor: **0.75**. Pre-division magnitude: **2.09**. Final penalty: **-2.09**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Raw event penalty | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2018-01-20 | Dustin Ortiz | pre-prime | top-ten | home | No | Yes | -1.25 | standard rule |
| 2019-07-27 | Deiveson Figueiredo | pre-prime | top-five | home | No | Yes | -0.75 | standard rule |
| 2020-07-19 | Askar Askarov | pre-prime | top-five | home | No | Yes | -0.75 | standard rule |
| 2025-12-06 | Joshua Van | prime | top-five | home | No | Yes | -1.5 | standard rule |

#### Division-strength context

Default division key: **modern-flyweight-0.90**. Era-ledger division multiplier: **0.95**. Division-era modifier: **-0.75**.

Modern flyweight receives a modest depth discount.

#### Key judgment calls

- **Prime window:** Manel Kape → Joshua Van.
- **Coverage:** Complete official UFC ledger through Joshua Van. TUF exhibitions excluded.
- **Loss endpoint:** Van is the current endpoint.

#### Why ranked here

Alexandre Pantoja ranks #30 because Prime Dominance and Championship provide the largest weighted parts of a 48.26 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

#### Why not ranked higher?

Alexandre Pantoja is 0.11 raw points behind #29 Dustin Poirier. The largest category separation versus that next target is currently Opponent Quality; future movement must be earned through new UFC evidence and a full pipeline rerun.

#### Final takeaway

Alexandre Pantoja ranks #30 because Prime Dominance and Championship provide the largest weighted parts of a 48.26 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

_Source IDs: fighter ledger verified through 2026-07-15; score owner ranking-pipeline.js; category owner category-calculators.js._

### 31. Leon Edwards — 89 OVR

Leon Edwards is ranked from the current UFC-only calculated pipeline.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 47.77 | 14-5, 1 NC | Welterweight | 3 | 3 | 4 | 5-1, 1 NC | 64.5% | 4.87 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 5.98 | 35 | 6.98 |
| Opponent Quality | 21.01 | 25 | 17.51 |
| Prime Dominance | 16.4 | 30 | 16.4 |
| Longevity | 15.95 | 10 | 5.32 |

Base score: **46.21**. Modifiers: Apex **+4.11**, Loss Penalty **-2.61**, Division-Era Depth **+0.06**. Final raw score: **47.77**.

OVR conversion: board anchors **18.68–101.92**, normalized score **0.3495**, curved score **0.4092**, resulting in **89 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 5.98 | #33 | 2.9 adjusted credit / 14.54 benchmark |
| Opponent Quality | 21.01 | #23 | 9.88 diminished credit / 14.1 benchmark |
| Prime Dominance | 16.4 | #55 | 16.4 raw × 100.0% sample |
| Longevity | 15.95 | #22 | 76.58 counted elite months |
| Apex modifier | +4.11 | Modifier | The title-winning knockout carries enormous Proof, but losing most of the first fight sharply reduces its performance rating; Claim and Aura remain deliberately conservative. |
| Loss penalty | -2.61 | Modifier | 5 official/technical loss events reviewed |
| Division-era depth | +0.06 | Modifier | Add the missing empirical welterweight row using the pinned source, approved quarterly mechanics, and the Cody-approved shared Fighter Era Ledger window from Rafael dos Anjos through Sean Brady. |

#### Championship receipts

UFC title-fight wins: **3**. Adjusted title wins: **3**. Derived undisputed-title win count: **3**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final adjusted credit | Review note |
| --- | --- | --- | --- | --- | --- | --- |
| 2022-08-20 | Kamaru Usman | normal | 1 | 1 | 1 | Full Championship credit for dethroning the reigning welterweight champion. |
| 2023-03-18 | Kamaru Usman | normal | 1 | 1 | 0.95 | Cody-approved modest five-percent repeat-opponent and immediate-trilogy context discount. |
| 2023-12-16 | Colby Covington | normal | 1 | 1 | 0.95 | Cody-approved modest five-percent challenger and fight-context discount while preserving full title-defense significance. |

#### Opponent Quality receipts

Raw win credit: **11.4**. Diminishing-return credit before fighter adjustment: **9.88**. Fighter adjustment: **0**. Final diminished credit: **9.88**.

| Slot | Date | Opponent | Base/final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 2022-08-20 | Kamaru Usman | 1.25 | 1 | 1.25 | Canonical reviewed opponent-quality tier. |
| 2 | 2023-03-18 | Kamaru Usman | 1.25 | 1 | 1.25 | Canonical reviewed opponent-quality tier. |
| 3 | 2019-07-20 | Rafael dos Anjos | 1 | 1 | 1 | Canonical reviewed opponent-quality tier. |
| 4 | 2023-12-16 | Colby Covington | 1 | 1 | 1 | Canonical reviewed opponent-quality tier. |
| 5 | 2016-10-08 | Albert Tumenov | 0.85 | 1 | 0.85 | Canonical reviewed opponent-quality tier. |
| 6 | 2017-03-18 | Vicente Luque | 0.85 | 1 | 0.85 | Canonical reviewed opponent-quality tier. |
| 7 | 2018-06-23 | Donald Cerrone | 0.85 | 0.75 | 0.64 | Canonical reviewed opponent-quality tier. |
| 8 | 2019-03-16 | Gunnar Nelson | 0.85 | 0.75 | 0.64 | Canonical reviewed opponent-quality tier. |
| 9 | 2021-06-12 | Nate Diaz | 0.85 | 0.75 | 0.64 | Canonical reviewed opponent-quality tier. |
| 10 | 2017-09-02 | Bryan Barberena | 0.65 | 0.75 | 0.49 | Canonical reviewed opponent-quality tier. |
| 11 | 2018-03-17 | Peter Sobotta | 0.65 | 0.75 | 0.49 | Canonical reviewed opponent-quality tier. |
| 12 | 2015-04-11 | Seth Baczynski | 0.45 | 0.75 | 0.34 | Canonical reviewed opponent-quality tier. |
| 13 | 2015-07-18 | Pawel Pawlak | 0.45 | 0.5 | 0.23 | Canonical reviewed opponent-quality tier. |
| 14 | 2016-05-08 | Dominic Waters | 0.45 | 0.5 | 0.23 | Canonical reviewed opponent-quality tier. |

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

| From | To | Raw months | Counted months | Reason |
| --- | --- | --- | --- | --- |
| 2019-07-20 | 2021-03-13 | 19.78 | 18 | Between-fight gap capped at 18 months |

#### Loss-penalty receipts

The fight-level rules create raw loss events. The final category then compresses those events through severity, frequency, and a prime-loss volume floor. Exposure: **18** fights. Severity: **1.88**. Frequency: **0.96**. Prime-volume floor: **1.75**. Pre-division magnitude: **2.84**. Final penalty: **-2.61**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Raw event penalty | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2014-11-08 | Claudio Silva | pre-prime | ranked | home | No | Yes | -1.25 | standard rule |
| 2015-12-19 | Kamaru Usman | pre-prime | top-five | home | No | Yes | -0.75 | standard rule |
| 2024-07-27 | Belal Muhammad | prime | champion-level | home | No | Yes | -1.5 | standard rule |
| 2025-03-22 | Sean Brady | prime | top-five | home | Yes | Yes | -2.25 | standard rule |
| 2025-11-15 | Carlos Prates | post-prime | top-five | home | Yes | Yes | 0 | standard rule |

#### Division-strength context

Default division key: **modern-welterweight-1.02**. Era-ledger division multiplier: **1.05**. Division-era modifier: **+0.06**.

Rafael dos Anjos through Sean Brady with all gaps capped at 18 months.

#### Key judgment calls

- **Prime window:** Rafael dos Anjos → Sean Brady.
- **Coverage:** Complete UFC-only ledger through UFC 322 on 2025-11-15. No later completed UFC bout found; non-UFC fights excluded.
- **Loss endpoint:** Rafael dos Anjos begins the connected UFC elite run. Muhammad did not close it because Edwards remained elite and fought Brady; Brady is the unrecovered endpoint.

#### Why ranked here

Leon Edwards ranks #31 because Opponent Quality and Prime Dominance provide the largest weighted parts of a 47.77 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

#### Why not ranked higher?

Leon Edwards is 0.49 raw points behind #30 Alexandre Pantoja. The largest category separation versus that next target is currently Prime Dominance; future movement must be earned through new UFC evidence and a full pipeline rerun.

#### Final takeaway

Leon Edwards ranks #31 because Opponent Quality and Prime Dominance provide the largest weighted parts of a 47.77 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

_Source IDs: fighter ledger verified through 2026-07-13; score owner ranking-pipeline.js; category owner category-calculators.js._

### 32. Tito Ortiz — 89 OVR

Tito Ortiz is ranked from the current UFC-only calculated pipeline.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 47.75 | 15-11-1 | Light Heavyweight / Heavyweight | 6 | 5.2 | 4 | 11-3 | 62.2% | 6.71 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 10.54 | 35 | 12.3 |
| Opponent Quality | 14.44 | 25 | 12.03 |
| Prime Dominance | 18.95 | 30 | 18.95 |
| Longevity | 21.89 | 10 | 7.3 |

Base score: **50.58**. Modifiers: Apex **+3.99**, Loss Penalty **-3.82**, Division-Era Depth **-3**. Final raw score: **47.75**.

OVR conversion: board anchors **18.68–101.92**, normalized score **0.3492**, curved score **0.4089**, resulting in **89 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 10.54 | #15 | 5.11 adjusted credit / 14.54 benchmark |
| Opponent Quality | 14.44 | #48 | 6.79 diminished credit / 14.1 benchmark |
| Prime Dominance | 18.95 | #40 | 18.95 raw × 100.0% sample |
| Longevity | 21.89 | #8 | 105.08 counted elite months |
| Apex modifier | +3.99 | Modifier | Early UFC LHW title apex. |
| Loss penalty | -3.82 | Modifier | 11 official/technical loss events reviewed |
| Division-era depth | -3 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **6**. Adjusted title wins: **5.2**. Derived undisputed-title win count: **6**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final adjusted credit | Review note |
| --- | --- | --- | --- | --- | --- | --- |
| 2000-04-14 | Wanderlei Silva | vacant-undisputed | 0.9 | 0.95 | 0.86 | Old-era vacant title context. |
| 2000-12-16 | Yuki Kondo | normal | 1 | 0.85 | 0.85 | Old-era/softer title challenger. |
| 2001-02-23 | Evan Tanner | normal | 1 | 0.9 | 0.9 | locked |
| 2001-06-29 | Elvis Sinosic | normal | 1 | 0.75 | 0.75 | Clearly softer title challenger floor. |
| 2001-09-28 | Vladimir Matyushenko | normal | 1 | 0.9 | 0.9 | locked |
| 2002-11-22 | Ken Shamrock | normal | 1 | 0.85 | 0.85 | Name value, timing/age discount. |

#### Opponent Quality receipts

Raw win credit: **7.7**. Diminishing-return credit before fighter adjustment: **6.79**. Fighter adjustment: **0**. Final diminished credit: **6.79**.

| Slot | Date | Opponent | Base/final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 2005-02-05 | Vitor Belfort | 0.9 | 1 | 0.9 | Elite UFC light heavyweight name and dangerous opponent; close decision context keeps it below true top-five credit. |
| 2 | 2000-04-14 | Wanderlei Silva | 0.85 | 1 | 0.85 | Major early UFC title win over a dangerous opponent before his later non-UFC peak. |
| 3 | 2006-04-15 | Forrest Griffin | 0.8 | 1 | 0.8 | Strong UFC win that aged well; close decision context trims the credit. |
| 4 | 2002-11-22 | Ken Shamrock | 0.75 | 1 | 0.75 | Major-name UFC title defense, meaningfully discounted for age and timing. |
| 5 | 2001-02-23 | Evan Tanner | 0.7 | 1 | 0.7 | Meaningful title defense over a high-level opponent and future UFC champion, with early-era timing context. |
| 6 | 2001-09-28 | Vladimir Matyushenko | 0.65 | 1 | 0.65 | Solid ranked title challenger and credible early-era contender. |
| 7 | 2011-07-02 | Ryan Bader | 0.65 | 0.75 | 0.49 | Late-career upset over a strong contender; valuable but does not restart Tito’s prime. |
| 8 | 2004-10-22 | Patrick Cote | 0.45 | 0.75 | 0.34 | Useful supporting UFC light heavyweight win. |
| 9 | 1999-03-05 | Guy Mezger | 0.4 | 0.75 | 0.3 | Early UFC rivalry win; only the UFC result is scored. |
| 10 | 2000-12-16 | Yuki Kondo | 0.4 | 0.75 | 0.3 | Title defense with substantial early-era opponent-strength discount. |
| 11 | 2006-07-08 | Ken Shamrock | 0.3 | 0.75 | 0.23 | Repeat rivalry win with a heavy age and timing discount. |
| 12 | 1998-03-13 | Jerry Bohlander | 0.25 | 0.75 | 0.19 | Supporting early UFC win with limited quality value. |
| 13 | 2001-06-29 | Elvis Sinosic | 0.25 | 0.5 | 0.13 | Weak title-defense opponent with limited quality value. |
| 14 | 2006-10-10 | Ken Shamrock | 0.25 | 0.5 | 0.13 | Third rivalry bout; repeat and timing context cap the credit. |
| 15 | 1997-05-30 | Wes Albritton | 0.1 | 0.5 | 0.05 | Early UFC tournament win with minimal opponent-quality value. |

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

#### Loss-penalty receipts

The fight-level rules create raw loss events. The final category then compresses those events through severity, frequency, and a prime-loss volume floor. Exposure: **21** fights. Severity: **2.25**. Frequency: **1.57**. Prime-volume floor: **3.5**. Pre-division magnitude: **3.82**. Final penalty: **-3.82**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Raw event penalty | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1997-05-30 | Guy Mezger | pre-prime | solid | home | Yes | Yes | -2 | standard rule |
| 1999-09-24 | Frank Shamrock | pre-prime | champion-level | home | Yes | Yes | -1.5 | standard rule |
| 2003-09-26 | Randy Couture | prime | champion-level | home | No | Yes | -1.5 | standard rule |
| 2004-04-02 | Chuck Liddell | prime | top-five | home | Yes | Yes | -2.25 | standard rule |
| 2006-12-30 | Chuck Liddell | prime | champion-level | home | Yes | Yes | -2.25 | standard rule |
| 2008-05-24 | Lyoto Machida | prime | top-five | home | No | Yes | -1.5 | standard rule |
| 2009-11-21 | Forrest Griffin | post-prime | top-five | home | No | Yes | 0 | standard rule |
| 2010-10-23 | Matt Hamill | post-prime | top-ten | home | No | Yes | 0 | standard rule |
| 2011-08-06 | Rashad Evans | post-prime | top-five | home | Yes | Yes | 0 | standard rule |
| 2011-12-10 | Antonio Rogerio Nogueira | post-prime | top-ten | home | Yes | Yes | 0 | standard rule |
| 2012-07-07 | Forrest Griffin | post-prime | top-ten | home | No | Yes | 0 | standard rule |

#### Division-strength context

Default division key: **early-light-heavyweight-0.92**. Era-ledger division multiplier: **1**. Division-era modifier: **-3**.

Wanderlei Silva through Lyoto Machida with every inactivity gap capped at 18 months.

#### Key judgment calls

- **Prime window:** Wanderlei Silva → Lyoto Machida.
- **Coverage:** Complete UFC-only ledger through 2012-07-07. Non-UFC fights excluded.
- **Loss endpoint:** Chuck I did not close the window because Tito later beat Vitor Belfort and Forrest Griffin, drew with Rashad Evans, and remained elite-relevant through the Machida fight. Machida is the unrecovered endpoint.

#### Why ranked here

Tito Ortiz ranks #32 because Prime Dominance and Championship provide the largest weighted parts of a 47.75 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

#### Why not ranked higher?

Tito Ortiz is 0.02 raw points behind #31 Leon Edwards. The largest category separation versus that next target is currently Opponent Quality; future movement must be earned through new UFC evidence and a full pipeline rerun.

#### Final takeaway

Tito Ortiz ranks #32 because Prime Dominance and Championship provide the largest weighted parts of a 47.75 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

_Source IDs: fighter ledger verified through 2026-07-13; score owner ranking-pipeline.js; category owner category-calculators.js._

### 33. Ilia Topuria — 89 OVR

Ilia Topuria is ranked from the current UFC-only calculated pipeline.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 47.63 | 9-1 | Featherweight / Lightweight | 3 | 3.15 | 4 | 4-1 | 66.7% | 3.05 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 6.27 | 35 | 7.32 |
| Opponent Quality | 14.71 | 25 | 12.26 |
| Prime Dominance | 21.5 | 30 | 21.5 |
| Longevity | 10.09 | 10 | 3.36 |

Base score: **44.44**. Modifiers: Apex **+5.95**, Loss Penalty **-2.75**, Division-Era Depth **-0.01**. Final raw score: **47.63**.

OVR conversion: board anchors **18.68–101.92**, normalized score **0.3478**, curved score **0.4075**, resulting in **89 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 6.27 | #30 | 3.04 adjusted credit / 14.54 benchmark |
| Opponent Quality | 14.71 | #47 | 6.91 diminished credit / 14.1 benchmark |
| Prime Dominance | 21.5 | #22 | 22.63 raw × 95.0% sample |
| Longevity | 10.09 | #46 | 48.41 counted elite months |
| Apex modifier | +5.95 | Modifier | Volkanovski plus Oliveira is monster UFC peak proof. |
| Loss penalty | -2.75 | Modifier | 1 official/technical loss events reviewed |
| Division-era depth | -0.01 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **3**. Adjusted title wins: **3.15**. Derived undisputed-title win count: **3**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final adjusted credit | Review note |
| --- | --- | --- | --- | --- | --- | --- |
| 2024-02-17 | Alexander Volkanovski | normal | 1 | 1 | 1 | locked |
| 2024-10-26 | Max Holloway | normal | 1 | 0.95 | 0.95 | locked |
| 2025-06-28 | Charles Oliveira | vacant-second-division | 1.15 | 0.95 | 1.09 | Current-table vacant second-division title context. |

#### Opponent Quality receipts

Raw win credit: **7.2**. Diminishing-return credit before fighter adjustment: **6.91**. Fighter adjustment: **0**. Final diminished credit: **6.91**.

| Slot | Date | Opponent | Base/final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 2024-02-17 | Alexander Volkanovski | 1.25 | 1 | 1.25 | Stopped the reigning UFC featherweight champion and all-time great. |
| 2 | 2024-10-26 | Max Holloway | 1.25 | 1 | 1.25 | Elite former UFC featherweight champion and divisional great. |
| 3 | 2025-06-28 | Charles Oliveira | 1.25 | 1 | 1.25 | Elite former lightweight champion defeated in a five-round UFC title fight. |
| 4 | 2023-06-24 | Josh Emmett | 1 | 1 | 1 | Five-round win over a prime top featherweight contender. |
| 5 | 2022-12-10 | Bryce Mitchell | 0.85 | 1 | 0.85 | Undefeated ranked featherweight contender submitted during Topuria’s rise. |
| 6 | 2020-12-05 | Damon Jackson | 0.45 | 1 | 0.45 | Solid UFC featherweight win. |
| 7 | 2021-07-10 | Ryan Hall | 0.45 | 0.75 | 0.34 | Dangerous specialist and credible UFC featherweight win. |
| 8 | 2022-03-19 | Jai Herbert | 0.45 | 0.75 | 0.34 | Useful upward-division UFC lightweight win. |
| 9 | 2020-10-10 | Youssef Zalal | 0.25 | 0.75 | 0.19 | Early UFC win before either fighter reached ranked contention. |

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

#### Loss-penalty receipts

The fight-level rules create raw loss events. The final category then compresses those events through severity, frequency, and a prime-loss volume floor. Exposure: **10** fights. Severity: **2.25**. Frequency: **0.68**. Prime-volume floor: **1**. Pre-division magnitude: **2.93**. Final penalty: **-2.75**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Raw event penalty | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2026-06-14 | Justin Gaethje | prime | champion-level | home | Yes | Yes | -2.25 | standard rule |

#### Division-strength context

Default division key: **topuria-modern-fw-lw-1.075**. Era-ledger division multiplier: **1.04**. Division-era modifier: **-0.01**.

Bryce Mitchell through current title-level form.

#### Key judgment calls

- **Prime window:** Bryce Mitchell → Current title-level form.
- **Coverage:** Complete UFC ledger through UFC Freedom 250. Prime begins with Emmett and remains open.
- **Loss endpoint:** Current title-level form. No unrecovered UFC elite-prime loss.

#### Why ranked here

Ilia Topuria ranks #33 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 47.63 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

#### Why not ranked higher?

Ilia Topuria is 0.12 raw points behind #32 Tito Ortiz. The largest category separation versus that next target is currently Longevity; future movement must be earned through new UFC evidence and a full pipeline rerun.

#### Final takeaway

Ilia Topuria ranks #33 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 47.63 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

_Source IDs: fighter ledger verified through 2026-07-13; score owner ranking-pipeline.js; category owner category-calculators.js._

### 34. Tyron Woodley — 89 OVR

Tyron Woodley is ranked from the current UFC-only calculated pipeline.

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

OVR conversion: board anchors **18.68–101.92**, normalized score **0.3461**, curved score **0.4058**, resulting in **89 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 7.53 | #26 | 3.65 adjusted credit / 14.54 benchmark |
| Opponent Quality | 14.81 | #46 | 6.96 diminished credit / 14.1 benchmark |
| Prime Dominance | 19.57 | #34 | 19.57 raw × 100.0% sample |
| Longevity | 13.41 | #30 | 64.37 counted elite months |
| Apex modifier | +4.69 | Modifier | The Lawler knockout is elite, while the low-output Thompson rematch keeps separation, Claim, and Aura contained. |
| Loss penalty | -2.37 | Modifier | 6 official/technical loss events reviewed |
| Division-era depth | 0 | Modifier | Treat Woodley-era welterweight as neutral. The measured +0.21 is too small and too sensitive to justify an affirmative GOAT bonus. |

#### Championship receipts

UFC title-fight wins: **4**. Adjusted title wins: **3.65**. Derived undisputed-title win count: **4**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final adjusted credit | Review note |
| --- | --- | --- | --- | --- | --- | --- |
| 2016-07-30 | Robbie Lawler | normal | 1 | 1 | 1 | locked |
| 2017-03-04 | Stephen Thompson | normal | 1 | 0.9 | 0.9 | locked |
| 2017-07-29 | Demian Maia | normal | 1 | 0.9 | 0.9 | locked |
| 2018-09-08 | Darren Till | normal | 1 | 0.85 | 0.85 | locked |

#### Opponent Quality receipts

Raw win credit: **7.35**. Diminishing-return credit before fighter adjustment: **6.96**. Fighter adjustment: **0**. Final diminished credit: **6.96**.

| Slot | Date | Opponent | Base/final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 2016-07-30 | Robbie Lawler | 1.25 | 1 | 1.25 | UFC welterweight champion and elite title opponent. |
| 2 | 2017-03-04 | Stephen Thompson | 1 | 1 | 1 | Elite welterweight title challenger. |
| 3 | 2018-09-08 | Darren Till | 1 | 1 | 1 | Undefeated top welterweight title challenger. |
| 4 | 2014-03-15 | Carlos Condit | 0.85 | 1 | 0.85 | Top-five welterweight win discounted because the finish came through Condit’s knee injury. |
| 5 | 2015-01-31 | Kelvin Gastelum | 0.85 | 1 | 0.85 | Top-five contender base tier retained; final credit remains discounted for catchweight and razor-thin split-decision context. |
| 6 | 2017-07-29 | Demian Maia | 0.85 | 1 | 0.85 | Top-five title challenger base tier retained; final credit remains discounted for late-career and short-turnaround context. |
| 7 | 2014-08-23 | Dong Hyun Kim | 0.65 | 0.75 | 0.49 | Quality ranked welterweight win. |
| 8 | 2013-02-02 | Jay Hieron | 0.45 | 0.75 | 0.34 | Solid UFC welterweight win. |
| 9 | 2013-11-16 | Josh Koscheck | 0.45 | 0.75 | 0.34 | Former top contender discounted to supporting-win value because of clear late-career timing. |

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

#### Loss-penalty receipts

The fight-level rules create raw loss events. The final category then compresses those events through severity, frequency, and a prime-loss volume floor. Exposure: **13** fights. Severity: **1.5**. Frequency: **0.87**. Prime-volume floor: **1.5**. Pre-division magnitude: **2.37**. Final penalty: **-2.37**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Raw event penalty | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2013-06-15 | Jake Shields | pre-prime | top-five | home | No | Yes | -0.75 | standard rule |
| 2014-06-14 | Rory MacDonald | prime | top-five | home | No | Yes | -1.5 | standard rule |
| 2019-03-02 | Kamaru Usman | prime | champion-level | home | No | Yes | -1.5 | standard rule |
| 2020-05-30 | Gilbert Burns | post-prime | top-five | home | No | Yes | 0 | standard rule |
| 2020-09-19 | Colby Covington | post-prime | top-five | home | Yes | Yes | 0 | standard rule |
| 2021-03-27 | Vicente Luque | post-prime | top-five | home | Yes | Yes | 0 | standard rule |

#### Division-strength context

Default division key: **woodley-welterweight-neutral-1.00**. Era-ledger division multiplier: **1**. Division-era modifier: **0**.

Cody-approved Woodley audit: treat his welterweight era as neutral rather than bonus-strength context.

#### Key judgment calls

- **Prime window:** Carlos Condit → Kamaru Usman.
- **Coverage:** Complete UFC-only ledger through 2021-03-27. Strikeforce and non-UFC fights excluded.
- **Loss endpoint:** Rory MacDonald was recovered from by becoming champion. Kamaru Usman is the unrecovered endpoint; Burns, Covington, and Luque are post-prime decline context.

#### Why ranked here

Tyron Woodley ranks #34 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 47.49 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

#### Why not ranked higher?

Tyron Woodley is 0.14 raw points behind #33 Ilia Topuria. The largest category separation versus that next target is currently Prime Dominance; future movement must be earned through new UFC evidence and a full pipeline rerun.

#### Final takeaway

Tyron Woodley ranks #34 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 47.49 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

_Source IDs: fighter ledger verified through 2026-07-13; score owner ranking-pipeline.js; category owner category-calculators.js._

### 35. Fabricio Werdum — 89 OVR

Fabricio Werdum is ranked from the current UFC-only calculated pipeline.

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

OVR conversion: board anchors **18.68–101.92**, normalized score **0.3448**, curved score **0.4045**, resulting in **89 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 3.4 | #49 | 1.65 adjusted credit / 14.54 benchmark |
| Opponent Quality | 20.37 | #24 | 9.57 diminished credit / 14.1 benchmark |
| Prime Dominance | 20.8 | #27 | 20.8 raw × 100.0% sample |
| Longevity | 15.27 | #25 | 73.28 counted elite months |
| Apex modifier | +5.17 | Modifier | The Cain upset supplies elite proof and a real best-heavyweight claim, supported by the interim-title Hunt finish. |
| Loss penalty | -3.8 | Modifier | 6 official/technical loss events reviewed |
| Division-era depth | -0.83 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **2**. Adjusted title wins: **1.65**. Derived undisputed-title win count: **1**. Interim-title win count: **1**.

| Date | Opponent | Title type | Base | Opponent strength | Final adjusted credit | Review note |
| --- | --- | --- | --- | --- | --- | --- |
| 2014-11-15 | Mark Hunt | interim | 0.75 | 1 | 0.75 | Approved aggregate Championship score recovered from the live control; exact historical per-fight split was not stored. |
| 2015-06-13 | Cain Velasquez | normal | 1 | 0.9 | 0.9 | Approved aggregate Championship score recovered from the live control; exact historical per-fight split was not stored. |

#### Opponent Quality receipts

Raw win credit: **10.65**. Diminishing-return credit before fighter adjustment: **9.57**. Fighter adjustment: **0**. Final diminished credit: **9.57**.

| Slot | Date | Opponent | Base/final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 2013-06-08 | Antônio Rodrigo Nogueira | 1.25 | 1 | 1.25 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 2 | 2015-06-13 | Cain Velasquez | 1.25 | 1 | 1.25 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 3 | 2008-01-19 | Gabriel Gonzaga | 1 | 1 | 1 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 4 | 2014-04-19 | Travis Browne | 1 | 1 | 1 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 5 | 2014-11-15 | Mark Hunt | 1 | 1 | 1 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 6 | 2008-06-07 | Brandon Vera | 0.85 | 1 | 0.85 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 7 | 2012-02-04 | Roy Nelson | 0.85 | 0.75 | 0.64 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 8 | 2016-09-10 | Travis Browne | 0.85 | 0.75 | 0.64 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 9 | 2017-11-19 | Marcin Tybura | 0.85 | 0.75 | 0.64 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 10 | 2020-07-26 | Alexander Gustafsson | 0.85 | 0.75 | 0.64 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 11 | 2012-06-23 | Mike Russow | 0.45 | 0.75 | 0.34 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 12 | 2017-10-07 | Walt Harris | 0.45 | 0.75 | 0.34 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |

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

#### Loss-penalty receipts

The fight-level rules create raw loss events. The final category then compresses those events through severity, frequency, and a prime-loss volume floor. Exposure: **16** fights. Severity: **2.25**. Frequency: **1.55**. Prime-volume floor: **2.75**. Pre-division magnitude: **3.8**. Final penalty: **-3.8**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Raw event penalty | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2007-04-21 | Andrei Arlovski | pre-prime | champion-level | home | No | Yes | -0.75 | standard rule |
| 2008-10-25 | Junior dos Santos | pre-prime | champion-level | home | Yes | Yes | -1.5 | standard rule |
| 2016-05-14 | Stipe Miocic | prime | champion-level | home | Yes | Yes | -2.25 | standard rule |
| 2017-07-08 | Alistair Overeem | prime | champion-level | home | No | Yes | -1.5 | standard rule |
| 2018-03-17 | Alexander Volkov | prime | top-five | home | Yes | Yes | -2.25 | standard rule |
| 2020-05-09 | Aleksei Oleinik | post-prime | top-ten | home | No | Yes | 0 | standard rule |

#### Division-strength context

Default division key: **heavyweight-0.98**. Era-ledger division multiplier: **0.96**. Division-era modifier: **-0.83**.

Nelson through Volkov.

#### Key judgment calls

- **Prime window:** Roy Nelson → Alexander Volkov.
- **Coverage:** Complete UFC-only ledger.
- **Loss endpoint:** Volkov closes the sustained late UFC heavyweight elite window.

#### Why ranked here

Fabricio Werdum ranks #35 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 47.38 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

#### Why not ranked higher?

Fabricio Werdum is 0.11 raw points behind #34 Tyron Woodley. The largest category separation versus that next target is currently Championship; future movement must be earned through new UFC evidence and a full pipeline rerun.

#### Final takeaway

Fabricio Werdum ranks #35 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 47.38 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

_Source IDs: fighter ledger verified through 2026-07-13; score owner ranking-pipeline.js; category owner category-calculators.js._

### 36. Robbie Lawler — 89 OVR

Robbie Lawler is ranked from the current UFC-only calculated pipeline.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 47.29 | 14-11, 1 NC | Welterweight / Middleweight | 3 | 2.55 | 6 | 8-2 | 60.0% | 3.43 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 5.78 | 35 | 6.74 |
| Opponent Quality | 20.16 | 25 | 16.8 |
| Prime Dominance | 20.08 | 30 | 20.08 |
| Longevity | 9.28 | 10 | 3.09 |

Base score: **46.71**. Modifiers: Apex **+4.46**, Loss Penalty **-3.74**, Division-Era Depth **-0.14**. Final raw score: **47.29**.

OVR conversion: board anchors **18.68–101.92**, normalized score **0.3437**, curved score **0.4034**, resulting in **89 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 5.78 | #36 | 2.8 adjusted credit / 14.54 benchmark |
| Opponent Quality | 20.16 | #26 | 9.47 diminished credit / 14.1 benchmark |
| Prime Dominance | 20.08 | #30 | 20.08 raw × 100.0% sample |
| Longevity | 9.28 | #49 | 44.55 counted elite months |
| Apex modifier | +4.46 | Modifier | Championship-level Lawler apex with Hendricks II and Rory II proof. |
| Loss penalty | -3.74 | Modifier | 11 official/technical loss events reviewed |
| Division-era depth | -0.14 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **3**. Adjusted title wins: **2.55**. Derived undisputed-title win count: **3**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final adjusted credit | Review note |
| --- | --- | --- | --- | --- | --- | --- |
| 2014-12-06 | Johny Hendricks | normal | 1 | 1 | 0.9 | Cody-approved factual correction: Hendricks was the reigning champion. Normal title win with a separate 0.90 close split-decision context adjustment. |
| 2015-07-11 | Rory MacDonald | normal | 1 | 0.95 | 0.95 | locked |
| 2016-01-02 | Carlos Condit | normal | 1 | 0.95 | 0.95 | Close/controversial title defense. |

#### Opponent Quality receipts

Raw win credit: **10.8**. Diminishing-return credit before fighter adjustment: **9.47**. Fighter adjustment: **0**. Final diminished credit: **9.47**.

| Slot | Date | Opponent | Base/final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 2013-11-16 | Rory MacDonald | 1.25 | 1 | 1.25 | Elite welterweight title challenger in an all-time title fight. |
| 2 | 2014-12-06 | Johny Hendricks | 1.25 | 1 | 1.25 | Elite welterweight champion-level opponent. |
| 3 | 2014-07-26 | Matt Brown | 1 | 1 | 1 | Prime top welterweight contender. |
| 4 | 2016-01-02 | Carlos Condit | 1 | 1 | 1 | Elite welterweight title challenger; close decision context. |
| 5 | 2014-05-24 | Jake Ellenberger | 0.85 | 1 | 0.85 | Strong ranked welterweight contender. |
| 6 | 2015-07-11 | Rory MacDonald | 0.85 | 1 | 0.85 | Young elite welterweight contender. |
| 7 | 2002-05-10 | Aaron Riley | 0.65 | 0.75 | 0.49 | Ranked-quality early UFC win. |
| 8 | 2003-11-21 | Chris Lytle | 0.65 | 0.75 | 0.49 | Ranked-quality welterweight win. |
| 9 | 2013-02-23 | Josh Koscheck | 0.65 | 0.75 | 0.49 | Former top contender, later-career timing. |
| 10 | 2017-07-29 | Donald Cerrone | 0.65 | 0.75 | 0.49 | Big-name ranked veteran with timing context. |
| 11 | 2021-09-25 | Nick Diaz | 0.65 | 0.75 | 0.49 | Early UFC rivalry win over future elite name. |
| 12 | 2023-07-08 | Niko Price | 0.65 | 0.75 | 0.49 | Ranked-quality late-career welterweight win. |
| 13 | 2013-07-27 | Bobby Voelker | 0.45 | 0.5 | 0.23 | Solid UFC welterweight win. |
| 14 | 2002-11-22 | Tiki Ghosn | 0.25 | 0.5 | 0.13 | Low-end UFC quality value. |

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

#### Loss-penalty receipts

The fight-level rules create raw loss events. The final category then compresses those events through severity, frequency, and a prime-loss volume floor. Exposure: **16** fights. Severity: **2.13**. Frequency: **1.73**. Prime-volume floor: **1.75**. Pre-division magnitude: **3.86**. Final penalty: **-3.74**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Raw event penalty | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2003-04-25 | Pete Spratt | pre-prime | ranked | home | Yes | Yes | -2 | standard rule |
| 2004-04-02 | Nick Diaz | pre-prime | top-ten | home | Yes | Yes | -2 | standard rule |
| 2004-10-22 | Evan Tanner | pre-prime | top-five | home | Yes | Yes | -1.5 | standard rule |
| 2014-03-15 | Johny Hendricks | prime | champion-level | home | No | Yes | -1.5 | standard rule |
| 2016-07-30 | Tyron Woodley | prime | champion-level | home | Yes | Yes | -2.25 | standard rule |
| 2017-12-16 | Rafael dos Anjos | post-prime | top-five | home | No | Yes | 0 | standard rule |
| 2019-03-02 | Ben Askren | post-prime | top-five | home | Yes | Yes | 0 | standard rule |
| 2019-08-03 | Colby Covington | post-prime | top-five | home | No | Yes | 0 | standard rule |
| 2020-08-29 | Neil Magny | post-prime | top-ten | home | No | Yes | 0 | standard rule |
| 2022-07-02 | Bryan Barberena | post-prime | ranked | home | Yes | Yes | 0 | standard rule |
| 2022-12-10 | Santiago Ponzinibbio | post-prime | ranked | home | Yes | Yes | 0 | standard rule |

#### Division-strength context

Default division key: **modern-welterweight-1.00**. Era-ledger division multiplier: **1.02**. Division-era modifier: **-0.14**.

Koscheck through Woodley.

#### Key judgment calls

- **Prime window:** Josh Koscheck → Tyron Woodley.
- **Coverage:** Complete UFC-only ledger through 2023-07-08. Steve Berger result preserved as a no contest; non-UFC fights excluded.
- **Loss endpoint:** Condit war does not end it. Woodley closes championship-prime window.

#### Why ranked here

Robbie Lawler ranks #36 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 47.29 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

#### Why not ranked higher?

Robbie Lawler is 0.09 raw points behind #35 Fabricio Werdum. The largest category separation versus that next target is currently Longevity; future movement must be earned through new UFC evidence and a full pipeline rerun.

#### Final takeaway

Robbie Lawler ranks #36 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 47.29 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

_Source IDs: fighter ledger verified through 2026-07-13; score owner ranking-pipeline.js; category owner category-calculators.js._

### 37. Robert Whittaker — 89 OVR

Robert Whittaker is ranked from the current UFC-only calculated pipeline.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 47.28 | 18-7 | Middleweight / Welterweight / Light Heavyweight | 1 | 1.5 | 7 | 10-4 | 58.1% | 7.91 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 3.01 | 35 | 3.51 |
| Opponent Quality | 23.46 | 25 | 19.55 |
| Prime Dominance | 17.39 | 30 | 17.39 |
| Longevity | 19.56 | 10 | 6.52 |

Base score: **46.97**. Modifiers: Apex **+4.1**, Loss Penalty **-3.75**, Division-Era Depth **-0.04**. Final raw score: **47.28**.

OVR conversion: board anchors **18.68–101.92**, normalized score **0.3436**, curved score **0.4033**, resulting in **89 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 3.01 | #50 | 1.46 adjusted credit / 14.54 benchmark |
| Opponent Quality | 23.46 | #11 | 11.03 diminished credit / 14.1 benchmark |
| Prime Dominance | 17.39 | #52 | 17.39 raw × 100.0% sample |
| Longevity | 19.56 | #11 | 93.91 counted elite months |
| Apex modifier | +4.1 | Modifier | Legit middleweight apex with Jacare/Romero proof. |
| Loss penalty | -3.75 | Modifier | 7 official/technical loss events reviewed |
| Division-era depth | -0.04 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **1**. Adjusted title wins: **1.5**. Derived undisputed-title win count: **0**. Interim-title win count: **1**.

| Date | Opponent | Title type | Base | Opponent strength | Final adjusted credit | Review note |
| --- | --- | --- | --- | --- | --- | --- |
| 2017-07-08 | Yoel Romero | interim | 0.75 | 0.95 | 0.71 | locked |
| 2018-06-09 | Yoel Romero | missed-weight-championship-context | 1 | 1 | 0.75 | Cody-approved special context: Romero missed weight. Championship accomplishment receives 0.75 credit but is not an official UFC title-fight win. |

#### Opponent Quality receipts

Raw win credit: **13.6**. Diminishing-return credit before fighter adjustment: **11.03**. Fighter adjustment: **0**. Final diminished credit: **11.03**.

| Slot | Date | Opponent | Base/final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 2017-07-08 | Yoel Romero | 1.25 | 1 | 1.25 | Elite middleweight title-level opponent. |
| 2 | 2018-06-09 | Yoel Romero | 1.25 | 1 | 1.25 | Repeat win over elite middleweight title-level opponent. |
| 3 | 2020-10-24 | Jared Cannonier | 1 | 1 | 1 | Prime top middleweight contender. |
| 4 | 2022-09-03 | Marvin Vettori | 1 | 1 | 1 | Top middleweight contender. |
| 5 | 2016-11-27 | Derek Brunson | 0.85 | 1 | 0.85 | Strong ranked middleweight contender. |
| 6 | 2017-04-15 | Ronaldo Souza | 0.85 | 1 | 0.85 | Elite grappler and ranked middleweight contender. |
| 7 | 2021-04-17 | Kelvin Gastelum | 0.85 | 0.75 | 0.64 | Strong ranked middleweight contender. |
| 8 | 2024-02-17 | Paulo Costa | 0.85 | 0.75 | 0.64 | Former challenger and strong contender, but not a true Top-5 win in this timing context. |
| 9 | 2026-07-11 | Nikita Krylov | 0.85 | 0.75 | 0.64 | Strong ranked opponent in the approved app timeline. |
| 10 | 2015-05-10 | Brad Tavares | 0.65 | 0.75 | 0.49 | Quality middleweight win. |
| 11 | 2015-11-15 | Uriah Hall | 0.65 | 0.75 | 0.49 | Quality middleweight win. |
| 12 | 2016-04-23 | Rafael Natal | 0.65 | 0.75 | 0.49 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 13 | 2020-07-25 | Darren Till | 0.65 | 0.5 | 0.33 | Ranked contender; close tactical win and timing context. |
| 14 | 2024-06-22 | Ikram Aliskerov | 0.65 | 0.5 | 0.33 | Ranked-quality short-notice middleweight win. |
| 15 | 2012-12-15 | Brad Scott | 0.45 | 0.5 | 0.23 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 16 | 2013-05-25 | Colton Smith | 0.45 | 0.5 | 0.23 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 17 | 2014-11-08 | Clint Hester | 0.45 | 0.5 | 0.23 | Solid UFC middleweight win. |
| 18 | 2014-06-28 | Mike Rhodes | 0.25 | 0.5 | 0.13 | Low-end UFC quality value. |

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

#### Loss-penalty receipts

The fight-level rules create raw loss events. The final category then compresses those events through severity, frequency, and a prime-loss volume floor. Exposure: **23** fights. Severity: **2.25**. Frequency: **1.43**. Prime-volume floor: **3.75**. Pre-division magnitude: **3.75**. Final penalty: **-3.75**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Raw event penalty | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2013-08-28 | Court McGee | pre-prime | solid | home | No | Yes | -1.25 | standard rule |
| 2014-02-22 | Stephen Thompson | pre-prime | top-five | home | Yes | Yes | -1.5 | standard rule |
| 2019-10-06 | Israel Adesanya | prime | champion-level | home | Yes | Yes | -2.25 | standard rule |
| 2022-02-12 | Israel Adesanya | prime | champion-level | home | No | Yes | -1.5 | standard rule |
| 2023-07-08 | Dricus du Plessis | prime | top-five | home | Yes | Yes | -2.25 | standard rule |
| 2024-10-26 | Khamzat Chimaev | prime | top-five | home | Yes | Yes | -2.25 | standard rule |
| 2025-07-26 | Reinier de Ridder | post-prime | top-five | home | No | Yes | 0 | standard rule |

#### Division-strength context

Default division key: **modern-middleweight-1.00**. Era-ledger division multiplier: **0.98**. Division-era modifier: **-0.04**.

Jacare through Khamzat.

#### Key judgment calls

- **Prime window:** Ronaldo Souza → Khamzat Chimaev.
- **Coverage:** Complete UFC-only ledger through UFC 329 on 2026-07-11. TUF exhibition and non-UFC fights excluded; Nikita Krylov is a post-prime light-heavyweight win.
- **Loss endpoint:** Adesanya and DDP losses did not end window because Whittaker kept proving elite MW relevance. Khamzat closes it.

#### Why ranked here

Robert Whittaker ranks #37 because Opponent Quality and Prime Dominance provide the largest weighted parts of a 47.28 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

#### Why not ranked higher?

Robert Whittaker is 0.01 raw points behind #36 Robbie Lawler. The largest category separation versus that next target is currently Championship; future movement must be earned through new UFC evidence and a full pipeline rerun.

#### Final takeaway

Robert Whittaker ranks #37 because Opponent Quality and Prime Dominance provide the largest weighted parts of a 47.28 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

_Source IDs: fighter ledger verified through 2026-07-13; score owner ranking-pipeline.js; category owner category-calculators.js._

### 38. Tony Ferguson — 89 OVR

Tony Ferguson is ranked from the current UFC-only calculated pipeline.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 46.96 | 15-9 | Lightweight / Welterweight | 1 | 0.75 | 4 | 8-1 | 72.0% | 5.19 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 1.32 | 35 | 1.54 |
| Opponent Quality | 18.83 | 25 | 15.69 |
| Prime Dominance | 22.46 | 30 | 22.46 |
| Longevity | 12.36 | 10 | 4.12 |

Base score: **43.81**. Modifiers: Apex **+4.9**, Loss Penalty **-2.01**, Division-Era Depth **+0.26**. Final raw score: **46.96**.

OVR conversion: board anchors **18.68–101.92**, normalized score **0.3397**, curved score **0.3995**, resulting in **89 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 1.32 | #58 | 0.64 adjusted credit / 14.54 benchmark |
| Opponent Quality | 18.83 | #36 | 8.85 diminished credit / 14.1 benchmark |
| Prime Dominance | 22.46 | #17 | 22.46 raw × 100.0% sample |
| Longevity | 12.36 | #37 | 59.35 counted elite months |
| Apex modifier | +4.9 | Modifier | The RDA win and interim-title victory best capture Ferguson’s elite proof, streak energy, and chaos-driven Aura. |
| Loss penalty | -2.01 | Modifier | 9 official/technical loss events reviewed |
| Division-era depth | +0.26 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **1**. Adjusted title wins: **0.75**. Derived undisputed-title win count: **0**. Interim-title win count: **1**.

| Date | Opponent | Title type | Base | Opponent strength | Final adjusted credit | Review note |
| --- | --- | --- | --- | --- | --- | --- |
| 2017-10-07 | Kevin Lee | interim | 0.75 | 0.85 | 0.64 | Interim title value and opponent discount. |

#### Opponent Quality receipts

Raw win credit: **10.2**. Diminishing-return credit before fighter adjustment: **8.85**. Fighter adjustment: **0**. Final diminished credit: **8.85**.

| Slot | Date | Opponent | Base/final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 2016-11-05 | Rafael dos Anjos | 1.25 | 1 | 1.25 | Former UFC lightweight champion still elite. |
| 2 | 2015-12-11 | Edson Barboza | 1 | 1 | 1 | Elite lightweight contender in a deep division. |
| 3 | 2017-10-07 | Kevin Lee | 1 | 1 | 1 | Interim-title opponent and top lightweight contender. |
| 4 | 2018-10-06 | Anthony Pettis | 1 | 1 | 1 | Former UFC champion and dangerous lightweight name. |
| 5 | 2015-07-15 | Josh Thomson | 0.85 | 1 | 0.85 | Strong veteran lightweight contender. |
| 6 | 2019-06-08 | Donald Cerrone | 0.85 | 1 | 0.85 | Ranked veteran contender, timing context. |
| 7 | 2015-02-28 | Gleison Tibau | 0.65 | 0.75 | 0.49 | Quality lightweight veteran. |
| 8 | 2016-07-13 | Lando Vannata | 0.65 | 0.75 | 0.49 | Short-notice dangerous win, prospect context. |
| 9 | 2011-09-24 | Aaron Riley | 0.45 | 0.75 | 0.34 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 10 | 2011-12-03 | Yves Edwards | 0.45 | 0.75 | 0.34 | Veteran lightweight name, timing adjusted. |
| 11 | 2013-10-19 | Mike Rio | 0.45 | 0.75 | 0.34 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 12 | 2014-05-24 | Katsunori Kikuno | 0.45 | 0.75 | 0.34 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 13 | 2014-08-30 | Danny Castillo | 0.45 | 0.5 | 0.23 | Solid lightweight win; close-decision context. |
| 14 | 2014-12-06 | Abel Trujillo | 0.45 | 0.5 | 0.23 | Solid athletic lightweight win. |
| 15 | 2011-06-04 | Ramsey Nijem | 0.25 | 0.5 | 0.13 | Low-end UFC quality value. |

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

#### Loss-penalty receipts

The fight-level rules create raw loss events. The final category then compresses those events through severity, frequency, and a prime-loss volume floor. Exposure: **17** fights. Severity: **1.75**. Frequency: **0.62**. Prime-volume floor: **1**. Pre-division magnitude: **2.37**. Final penalty: **-2.01**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Raw event penalty | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2012-05-05 | Michael Johnson | pre-prime | top-ten | home | No | Yes | -1.25 | standard rule |
| 2020-05-09 | Justin Gaethje | prime | top-five | home | Yes | Yes | -2.25 | standard rule |
| 2020-12-12 | Charles Oliveira | post-prime | top-five | home | No | Yes | 0 | standard rule |
| 2021-05-15 | Beneil Dariush | post-prime | top-five | home | No | Yes | 0 | standard rule |
| 2022-05-07 | Michael Chandler | post-prime | top-five | home | Yes | Yes | 0 | standard rule |
| 2022-09-10 | Nate Diaz | post-prime | top-ten | home | Yes | Yes | 0 | standard rule |
| 2023-07-29 | Bobby Green | post-prime | top-ten | home | Yes | Yes | 0 | standard rule |
| 2023-12-16 | Paddy Pimblett | post-prime | ranked | home | No | Yes | 0 | standard rule |
| 2024-08-03 | Michael Chiesa | post-prime | top-ten | home | Yes | Yes | 0 | standard rule |

#### Division-strength context

Default division key: **lightweight-murderers-row-1.10**. Era-ledger division multiplier: **1.1**. Division-era modifier: **+0.26**.

Barboza through Gaethje.

#### Key judgment calls

- **Prime window:** Edson Barboza → Justin Gaethje.
- **Coverage:** Complete UFC-only ledger through 2024-08-03. TUF exhibition and non-UFC fights excluded.
- **Loss endpoint:** Gaethje closes it. Everything after is post-prime collapse.

#### Why ranked here

Tony Ferguson ranks #38 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 46.96 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

#### Why not ranked higher?

Tony Ferguson is 0.32 raw points behind #37 Robert Whittaker. The largest category separation versus that next target is currently Longevity; future movement must be earned through new UFC evidence and a full pipeline rerun.

#### Final takeaway

Tony Ferguson ranks #38 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 46.96 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

_Source IDs: fighter ledger verified through 2026-07-13; score owner ranking-pipeline.js; category owner category-calculators.js._

### 39. Henry Cejudo — 89 OVR

Henry Cejudo is ranked from the current UFC-only calculated pipeline.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 46.85 | 10-6 | Flyweight / Bantamweight | 4 | 4.15 | 5 | 4-1 | 62.5% | 3.26 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 7.51 | 35 | 8.76 |
| Opponent Quality | 14.04 | 25 | 11.7 |
| Prime Dominance | 22.52 | 30 | 22.52 |
| Longevity | 4.77 | 10 | 1.59 |

Base score: **44.57**. Modifiers: Apex **+4.35**, Loss Penalty **-1.69**, Division-Era Depth **-0.38**. Final raw score: **46.85**.

OVR conversion: board anchors **18.68–101.92**, normalized score **0.3384**, curved score **0.3981**, resulting in **89 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 7.51 | #27 | 3.64 adjusted credit / 14.54 benchmark |
| Opponent Quality | 14.04 | #49 | 6.6 diminished credit / 14.1 benchmark |
| Prime Dominance | 22.52 | #15 | 25.02 raw × 90.0% sample |
| Longevity | 4.77 | #58 | 22.9 counted elite months |
| Apex modifier | +4.35 | Modifier | Champ-champ peak proof in a compact run. |
| Loss penalty | -1.69 | Modifier | 6 official/technical loss events reviewed |
| Division-era depth | -0.38 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **4**. Adjusted title wins: **4.15**. Derived undisputed-title win count: **4**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final adjusted credit | Review note |
| --- | --- | --- | --- | --- | --- | --- |
| 2018-08-04 | Demetrious Johnson | normal | 1 | 1 | 1 | locked |
| 2019-01-19 | T.J. Dillashaw | normal | 1 | 0.85 | 0.85 | Reigning BW champ moving down/weight-cut context. |
| 2019-06-08 | Marlon Moraes | vacant-second-division | 1.15 | 0.9 | 1.04 | locked |
| 2020-05-09 | Dominick Cruz | normal | 1 | 0.75 | 0.75 | Long-layoff former champ/opponent timing discount. |

#### Opponent Quality receipts

Raw win credit: **7.05**. Diminishing-return credit before fighter adjustment: **6.6**. Fighter adjustment: **0**. Final diminished credit: **6.6**.

| Slot | Date | Opponent | Base/final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 2018-08-04 | Demetrious Johnson | 1.25 | 1 | 1.25 | All-time flyweight champion; close decision flagged but max opponent quality. |
| 2 | 2019-06-08 | Marlon Moraes | 1 | 1 | 1 | Elite bantamweight contender for vacant title. |
| 3 | 2017-12-02 | Sergio Pettis | 0.85 | 1 | 0.85 | Strong flyweight contender. |
| 4 | 2019-01-19 | T.J. Dillashaw | 0.85 | 1 | 0.85 | Champion moving down with severe weight-cut context. |
| 5 | 2015-11-21 | Jussier Formiga | 0.65 | 1 | 0.65 | Quality flyweight contender. |
| 6 | 2017-09-09 | Wilson Reis | 0.65 | 1 | 0.65 | Ranked flyweight contender. |
| 7 | 2020-05-09 | Dominick Cruz | 0.65 | 0.75 | 0.49 | All-time name, but long-layoff and timing context. |
| 8 | 2015-03-14 | Chris Cariaso | 0.45 | 0.75 | 0.34 | Former title challenger but limited timing value. |
| 9 | 2015-06-13 | Chico Camus | 0.45 | 0.75 | 0.34 | Solid UFC flyweight win. |
| 10 | 2014-12-13 | Dustin Kimura | 0.25 | 0.75 | 0.19 | Low UFC quality value. |

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

#### Loss-penalty receipts

The fight-level rules create raw loss events. The final category then compresses those events through severity, frequency, and a prime-loss volume floor. Exposure: **12** fights. Severity: **1.13**. Frequency: **0.56**. Prime-volume floor: **0**. Pre-division magnitude: **1.69**. Final penalty: **-1.69**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Raw event penalty | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2016-04-23 | Demetrious Johnson | pre-prime | champion-level | home | Yes | Yes | -1.5 | standard rule |
| 2016-12-03 | Joseph Benavidez | pre-prime | top-five | home | No | Yes | -0.75 | standard rule |
| 2023-05-06 | Aljamain Sterling | post-prime | champion-level | home | No | Yes | 0 | standard rule |
| 2024-02-17 | Merab Dvalishvili | post-prime | top-five | home | No | Yes | 0 | standard rule |
| 2025-02-22 | Song Yadong | post-prime | top-five | home | No | Yes | 0 | standard rule |
| 2025-12-06 | Payton Talbott | post-prime | ranked | home | No | Yes | 0 | standard rule |

#### Division-strength context

Default division key: **cejudo-flyweight-bantamweight-0.98**. Era-ledger division multiplier: **1**. Division-era modifier: **-0.38**.

Demetrious Johnson II through Dominick Cruz; no retirement-gap credit.

#### Key judgment calls

- **Prime window:** Demetrious Johnson II → Dominick Cruz.
- **Coverage:** Complete UFC-only ledger through 2025-12-06. Non-UFC results excluded.
- **Loss endpoint:** Cejudo retired after the Cruz title-defense win. The three-year retirement creates a clean phase break before the Sterling comeback.

#### Why ranked here

Henry Cejudo ranks #39 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 46.85 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

#### Why not ranked higher?

Henry Cejudo is 0.11 raw points behind #38 Tony Ferguson. The largest category separation versus that next target is currently Longevity; future movement must be earned through new UFC evidence and a full pipeline rerun.

#### Final takeaway

Henry Cejudo ranks #39 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 46.85 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

_Source IDs: fighter ledger verified through 2026-07-13; score owner ranking-pipeline.js; category owner category-calculators.js._

### 40. Chris Weidman — 89 OVR

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

OVR conversion: board anchors **18.68–101.92**, normalized score **0.3319**, curved score **0.3916**, resulting in **89 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 7.63 | #23 | 3.7 adjusted credit / 14.54 benchmark |
| Opponent Quality | 13.33 | #54 | 6.46 diminished credit / 14.54 benchmark |
| Prime Dominance | 19.73 | #31 | 19.73 raw × 100.0% sample |
| Longevity | 16.71 | #18 | 80.23 counted elite months |
| Apex modifier | +5.68 | Modifier | The Silva knockout establishes world-best proof; the five-round Machida defense confirms championship-level separation. |
| Loss penalty | -4.18 | Modifier | 8 official/technical loss events reviewed |
| Division-era depth | -0.5 | Modifier | Apply a light discount for the Weidman-era middleweight field: elite top-end title opponents, but less full-roster depth than the strongest lightweight and welterweight eras. |

#### Championship receipts

UFC title-fight wins: **4**. Adjusted title wins: **3.7**. Derived undisputed-title win count: **4**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final adjusted credit | Review note |
| --- | --- | --- | --- | --- | --- | --- |
| — | Anderson Silva | — | — | — | 1 | locked |
| — | Anderson Silva II | — | — | — | 0.9 | locked |
| — | Lyoto Machida | — | — | — | 0.95 | locked |
| — | Vitor Belfort | — | — | — | 0.85 | locked |

#### Opponent Quality receipts

Raw win credit: **6.75**. Diminishing-return credit before fighter adjustment: **6.46**. Fighter adjustment: **0**. Final diminished credit: **6.46**.

| Slot | Date | Opponent | Base/final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | — | Anderson Silva | 1.2 | 1 | 1.2 | locked |
| 2 | — | Lyoto Machida | 0.95 | 1 | 0.95 | locked |
| 3 | — | Anderson Silva II | 0.9 | 1 | 0.9 | locked |
| 4 | — | Mark Munoz | 0.9 | 1 | 0.9 | locked |
| 5 | — | Vitor Belfort | 0.85 | 1 | 0.85 | locked |
| 6 | — | Kelvin Gastelum | 0.8 | 1 | 0.8 | locked |
| 7 | — | Demian Maia | 0.65 | 0.75 | 0.49 | locked |
| 8 | — | Omari Akhmedov | 0.4 | 0.75 | 0.3 | locked |
| 9 | — | Bruno Silva | 0.1 | 0.75 | 0.07 | locked |

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

#### Loss-penalty receipts

The fight-level rules create raw loss events. The final category then compresses those events through severity, frequency, and a prime-loss volume floor. Exposure: **14** fights. Severity: **2.25**. Frequency: **1.93**. Prime-volume floor: **4**. Pre-division magnitude: **4.18**. Final penalty: **-4.18**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Raw event penalty | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2015-12-12 | Luke Rockhold | prime | champion-level | home | Yes | Yes | -2.25 | standard rule |
| 2016-11-12 | Yoel Romero | prime | top-five | home | Yes | Yes | -2.25 | standard rule |
| 2017-04-08 | Gegard Mousasi | prime | top-five | home | Yes | Yes | -2.25 | standard rule |
| 2018-11-03 | Ronaldo Souza | prime | top-five | home | Yes | Yes | -2.25 | standard rule |
| 2019-10-18 | Dominick Reyes | post-prime | top-five | upward | Yes | Yes | 0 | standard rule |
| 2021-04-24 | Uriah Hall | post-prime | ranked | home | No | No | 0 | freak-injury-technical-result |
| 2023-08-19 | Brad Tavares | post-prime | solid | home | No | Yes | 0 | standard rule |
| 2024-12-07 | Eryk Anders | post-prime | solid | home | Yes | Yes | 0 | standard rule |

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

_Source IDs: fighter ledger verified through 2026-07-15; score owner ranking-pipeline.js; category owner category-calculators.js._

### 41. Frank Shamrock — 89 OVR

Frank Shamrock is ranked from the current UFC-only calculated pipeline.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 46.01 | 5-0 | Light Heavyweight / Middleweight | 5 | 4.25 | 3 | 5-0 | 100.0% | 1.76 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 6.2 | 35 | 7.23 |
| Opponent Quality | 10.64 | 25 | 8.87 |
| Prime Dominance | 25.99 | 30 | 25.99 |
| Longevity | 4.59 | 10 | 1.53 |

Base score: **43.62**. Modifiers: Apex **+5.39**, Loss Penalty **0**, Division-Era Depth **-3**. Final raw score: **46.01**.

OVR conversion: board anchors **18.68–101.92**, normalized score **0.3283**, curved score **0.3880**, resulting in **89 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 6.2 | #31 | 3 adjusted credit / 14.54 benchmark |
| Opponent Quality | 10.64 | #56 | 5 diminished credit / 14.1 benchmark |
| Prime Dominance | 25.99 | #5 | 28.88 raw × 90.0% sample |
| Longevity | 4.59 | #59 | 22.05 counted elite months |
| Apex modifier | +5.39 | Modifier | The inaugural title win and dominant Tito defense create an elite early-era Apex with explicit, formula-reconciling components. |
| Loss penalty | 0 | Modifier | 0 official/technical loss events reviewed |
| Division-era depth | -3 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **5**. Adjusted title wins: **4.25**. Derived undisputed-title win count: **5**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final adjusted credit | Review note |
| --- | --- | --- | --- | --- | --- | --- |
| 1997-12-21 | Kevin Jackson | normal | 1 | 0.7 | 0.7 | Approved aggregate Championship score recovered from the live control; exact historical per-fight split was not stored. |
| 1998-03-13 | Igor Zinoviev | normal | 1 | 0.6 | 0.6 | Approved aggregate Championship score recovered from the live control; exact historical per-fight split was not stored. |
| 1998-05-15 | Jeremy Horn | normal | 1 | 0.6 | 0.6 | Approved aggregate Championship score recovered from the live control; exact historical per-fight split was not stored. |
| 1998-10-16 | John Lober | normal | 1 | 0.55 | 0.55 | Approved aggregate Championship score recovered from the live control; exact historical per-fight split was not stored. |
| 1999-09-24 | Tito Ortiz | normal | 1 | 0.55 | 0.55 | Approved aggregate Championship score recovered from the live control; exact historical per-fight split was not stored. |

#### Opponent Quality receipts

Raw win credit: **5**. Diminishing-return credit before fighter adjustment: **5**. Fighter adjustment: **0**. Final diminished credit: **5**.

| Slot | Date | Opponent | Base/final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 1997-12-21 | Kevin Jackson | 1.25 | 1 | 1.25 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 2 | 1999-09-24 | Tito Ortiz | 1.25 | 1 | 1.25 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 3 | 1998-05-15 | Jeremy Horn | 1 | 1 | 1 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 4 | 1998-03-13 | Igor Zinoviev | 0.85 | 1 | 0.85 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 5 | 1998-10-16 | John Lober | 0.65 | 1 | 0.65 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |

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

#### Loss-penalty receipts

The fight-level rules create raw loss events. The final category then compresses those events through severity, frequency, and a prime-loss volume floor. Exposure: **5** fights. Severity: **0**. Frequency: **0**. Prime-volume floor: **0**. Pre-division magnitude: **0**. Final penalty: **0**.

_No rows._

#### Division-strength context

Default division key: **early-light-heavyweight-0.90**. Era-ledger division multiplier: **0.95**. Division-era modifier: **-3**.

Jackson through Ortiz.

#### Key judgment calls

- **Prime window:** Kevin Jackson → Tito Ortiz.
- **Coverage:** Complete UFC-only ledger through 1999-09-24. Pancrase, Strikeforce, WEC, K-1, Rings, and other non-UFC fights excluded.
- **Loss endpoint:** Retired from the UFC title on the Ortiz win; later non-UFC achievements are excluded.

#### Why ranked here

Frank Shamrock ranks #41 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 46.01 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

#### Why not ranked higher?

Frank Shamrock is 0.3 raw points behind #40 Chris Weidman. The largest category separation versus that next target is currently Longevity; future movement must be earned through new UFC evidence and a full pipeline rerun.

#### Final takeaway

Frank Shamrock ranks #41 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 46.01 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

_Source IDs: fighter ledger verified through 2026-07-13; score owner ranking-pipeline.js; category owner category-calculators.js._

### 42. Petr Yan — 89 OVR

A modern bantamweight title case with elite skill, strong round control, and unusual DQ context that needs more nuance than a normal loss.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 45.93 | 12-4 | Bantamweight | 3 | 2.65 | 6 | 6-4 | 65.1% | 6 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 5.39 | 35 | 6.29 |
| Opponent Quality | 17.18 | 25 | 14.32 |
| Prime Dominance | 17.91 | 30 | 17.91 |
| Longevity | 16.93 | 10 | 5.64 |

Base score: **44.16**. Modifiers: Apex **+4.15**, Loss Penalty **-2.34**, Division-Era Depth **-0.04**. Final raw score: **45.93**.

OVR conversion: board anchors **18.68–101.92**, normalized score **0.3274**, curved score **0.3871**, resulting in **89 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 5.39 | #39 | 2.61 adjusted credit / 14.54 benchmark |
| Opponent Quality | 17.18 | #42 | 8.07 diminished credit / 14.1 benchmark |
| Prime Dominance | 17.91 | #47 | 17.91 raw × 100.0% sample |
| Longevity | 16.93 | #16 | 81.27 counted elite months |
| Apex modifier | +4.15 | Modifier | High-skill bantamweight apex. |
| Loss penalty | -2.34 | Modifier | 4 official/technical loss events reviewed |
| Division-era depth | -0.04 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **3**. Adjusted title wins: **2.65**. Derived undisputed-title win count: **2**. Interim-title win count: **1**.

| Date | Opponent | Title type | Base | Opponent strength | Final adjusted credit | Review note |
| --- | --- | --- | --- | --- | --- | --- |
| 2020-07-12 | Jose Aldo | vacant-undisputed | 0.9 | 1 | 0.9 | Elite vacant-title opponent; full opponent strength. |
| 2021-10-30 | Cory Sandhagen | interim | 0.75 | 0.95 | 0.71 | Interim title value over strong contender. |
| 2025-12-06 | Merab Dvalishvili | normal | 1 | 1 | 1 | Recent-event add: UFC 323 bantamweight title reclaim over elite champion. |

#### Opponent Quality receipts

Raw win credit: **8.85**. Diminishing-return credit before fighter adjustment: **8.07**. Fighter adjustment: **0**. Final diminished credit: **8.07**.

| Slot | Date | Opponent | Base/final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 2025-12-06 | Merab Dvalishvili | 1.25 | 1 | 1.25 | Elite bantamweight champion/title-level opponent in app timeline. |
| 2 | 2020-07-12 | Jose Aldo | 1 | 1 | 1 | All-time featherweight great and elite bantamweight title opponent. |
| 3 | 2021-10-30 | Cory Sandhagen | 1 | 1 | 1 | Elite bantamweight contender and interim-title opponent. |
| 4 | 2024-11-23 | Deiveson Figueiredo | 1 | 1 | 1 | Former flyweight champion and strong bantamweight contender. |
| 5 | 2024-03-09 | Song Yadong | 0.85 | 1 | 0.85 | Strong ranked bantamweight contender. |
| 6 | 2019-02-23 | John Dodson | 0.65 | 1 | 0.65 | Former flyweight title challenger and quality bantamweight. |
| 7 | 2019-06-08 | Jimmie Rivera | 0.65 | 0.75 | 0.49 | Quality ranked bantamweight win. |
| 8 | 2019-12-14 | Urijah Faber | 0.65 | 0.75 | 0.49 | Legend name, late-career timing. |
| 9 | 2025-07-26 | Marcus McGhee | 0.65 | 0.75 | 0.49 | Ranked-quality bantamweight win. |
| 10 | 2018-09-15 | Jin Soo Son | 0.45 | 0.75 | 0.34 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 11 | 2018-12-29 | Douglas Silva de Andrade | 0.45 | 0.75 | 0.34 | Solid UFC bantamweight win. |
| 12 | 2018-06-23 | Teruto Ishihara | 0.25 | 0.75 | 0.19 | Low-end UFC quality value. |

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

#### Loss-penalty receipts

The fight-level rules create raw loss events. The final category then compresses those events through severity, frequency, and a prime-loss volume floor. Exposure: **16** fights. Severity: **1.5**. Frequency: **0.84**. Prime-volume floor: **2.25**. Pre-division magnitude: **2.34**. Final penalty: **-2.34**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Raw event penalty | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2021-03-06 | Aljamain Sterling | prime | top-five | home | No | Yes | 0 | technical-dq-context |
| 2022-04-09 | Aljamain Sterling | prime | champion-level | home | No | Yes | -1.5 | standard rule |
| 2022-10-22 | Sean O'Malley | prime | top-five | home | No | Yes | -1.5 | standard rule |
| 2023-03-11 | Merab Dvalishvili | prime | top-five | home | No | Yes | -1.5 | standard rule |

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

#### Final takeaway

Yan is a legit modern bantamweight title case: not a top-tier GOAT resume, but clearly strong enough that he should appear in the ranking and compare mode.

_Source IDs: fighter ledger verified through 2026-07-13; score owner ranking-pipeline.js; category owner category-calculators.js._

### 43. Sean Strickland — 89 OVR

Sean Strickland is ranked from the current UFC-only calculated pipeline.

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

OVR conversion: board anchors **18.68–101.92**, normalized score **0.3269**, curved score **0.3866**, resulting in **89 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 4.13 | #42 | 2 adjusted credit / 14.54 benchmark |
| Opponent Quality | 21.97 | #18 | 10.32 diminished credit / 14.1 benchmark |
| Prime Dominance | 17.82 | #49 | 17.82 raw × 100.0% sample |
| Longevity | 12.73 | #34 | 61.12 counted elite months |
| Apex modifier | +3.85 | Modifier | Izzy win gives real apex proof. |
| Loss penalty | -3.42 | Modifier | 7 official/technical loss events reviewed |
| Division-era depth | +0.27 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **2**. Adjusted title wins: **2**. Derived undisputed-title win count: **2**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final adjusted credit | Review note |
| --- | --- | --- | --- | --- | --- | --- |
| 2023-09-09 | Israel Adesanya | normal | 1 | 1 | 1 | Current-era upset over elite champion. |
| 2026-05-09 | Khamzat Chimaev | normal | 1 | 1 | 1 | Recent-event add: UFC 328 middleweight title win by split decision. |

#### Opponent Quality receipts

Raw win credit: **12.65**. Diminishing-return credit before fighter adjustment: **10.32**. Fighter adjustment: **0**. Final diminished credit: **10.32**.

| Slot | Date | Opponent | Base/final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 2023-09-09 | Israel Adesanya | 1.25 | 1 | 1.25 | Elite UFC middleweight champion. |
| 2 | 2026-05-09 | Khamzat Chimaev | 1.25 | 1 | 1.25 | Elite title-level opponent in app timeline. |
| 3 | 2026-02-21 | Anthony Hernandez | 1 | 1 | 1 | Top-five middleweight win. |
| 4 | 2022-02-05 | Jack Hermansson | 0.85 | 1 | 0.85 | Ranked middleweight contender. |
| 5 | 2023-01-14 | Nassourdine Imavov | 0.85 | 1 | 0.85 | Strong ranked middleweight contender. |
| 6 | 2024-06-01 | Paulo Costa | 0.85 | 1 | 0.85 | Strong ranked middleweight contender. |
| 7 | 2014-05-31 | Luke Barnatt | 0.65 | 0.75 | 0.49 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 8 | 2016-02-21 | Alex Garcia | 0.65 | 0.75 | 0.49 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 9 | 2018-10-27 | Nordine Taleb | 0.65 | 0.75 | 0.49 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 10 | 2020-11-14 | Brendan Allen | 0.65 | 0.75 | 0.49 | Quality middleweight win before Allen peak. |
| 11 | 2021-07-31 | Uriah Hall | 0.65 | 0.75 | 0.49 | Quality middleweight win. |
| 12 | 2023-07-01 | Abus Magomedov | 0.65 | 0.75 | 0.49 | Ranked-quality middleweight win. |
| 13 | 2014-03-15 | Bubba McDaniel | 0.45 | 0.5 | 0.23 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 14 | 2015-07-15 | Igor Araujo | 0.45 | 0.5 | 0.23 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 15 | 2016-06-04 | Tom Breese | 0.45 | 0.5 | 0.23 | Solid UFC win. |
| 16 | 2017-11-11 | Court McGee | 0.45 | 0.5 | 0.23 | Solid UFC win. |
| 17 | 2020-10-31 | Jack Marshman | 0.45 | 0.5 | 0.23 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 18 | 2021-05-01 | Krzysztof Jotko | 0.45 | 0.5 | 0.23 | Solid UFC middleweight win. |

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

#### Loss-penalty receipts

The fight-level rules create raw loss events. The final category then compresses those events through severity, frequency, and a prime-loss volume floor. Exposure: **25** fights. Severity: **2.13**. Frequency: **1.29**. Prime-volume floor: **3.25**. Pre-division magnitude: **3.42**. Final penalty: **-3.42**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Raw event penalty | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2015-02-22 | Santiago Ponzinibbio | pre-prime | top-ten | home | No | Yes | -1.25 | standard rule |
| 2017-04-08 | Kamaru Usman | pre-prime | top-five | home | No | Yes | -0.75 | standard rule |
| 2018-05-12 | Elizeu Zaleski dos Santos | pre-prime | top-ten | home | Yes | Yes | -2 | standard rule |
| 2022-07-02 | Alex Pereira | prime | champion-level | home | Yes | Yes | -2.25 | standard rule |
| 2022-12-17 | Jared Cannonier | prime | top-five | home | No | Yes | -1.5 | standard rule |
| 2024-01-20 | Dricus du Plessis | prime | champion-level | home | No | Yes | -1.5 | standard rule |
| 2025-02-08 | Dricus du Plessis | prime | champion-level | home | No | Yes | -1.5 | standard rule |

#### Division-strength context

Default division key: **modern-middleweight-1.00**. Era-ledger division multiplier: **0.98**. Division-era modifier: **+0.27**.

Adesanya through current elite form.

#### Key judgment calls

- **Prime window:** Uriah Hall → Current elite form.
- **Coverage:** Complete UFC-only ledger through UFC 328 on 2026-05-09. Non-UFC fights excluded.
- **Loss endpoint:** Adesanya win starts elite/title-level window. DDP does not close it because Strickland remained elite-relevant.

#### Why ranked here

Sean Strickland ranks #43 because Opponent Quality and Prime Dominance provide the largest weighted parts of a 45.89 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

#### Why not ranked higher?

Sean Strickland is 0.04 raw points behind #42 Petr Yan. The largest category separation versus that next target is currently Longevity; future movement must be earned through new UFC evidence and a full pipeline rerun.

#### Final takeaway

Sean Strickland ranks #43 because Opponent Quality and Prime Dominance provide the largest weighted parts of a 45.89 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

_Source IDs: fighter ledger verified through 2026-07-13; score owner ranking-pipeline.js; category owner category-calculators.js._

### 44. Deiveson Figueiredo — 89 OVR

Deiveson Figueiredo is ranked from the current UFC-only calculated pipeline.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 45.88 | 14-7-1 | Flyweight / Bantamweight / Catchweight | 3 | 2.75 | 6 | 7-3-1 | 53.0% | 4.73 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 5.57 | 35 | 6.5 |
| Opponent Quality | 20.11 | 25 | 16.76 |
| Prime Dominance | 17.97 | 30 | 17.97 |
| Longevity | 12.06 | 10 | 4.02 |

Base score: **45.25**. Modifiers: Apex **+4.38**, Loss Penalty **-3.38**, Division-Era Depth **-0.37**. Final raw score: **45.88**.

OVR conversion: board anchors **18.68–101.92**, normalized score **0.3268**, curved score **0.3865**, resulting in **89 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 5.57 | #38 | 2.7 adjusted credit / 14.54 benchmark |
| Opponent Quality | 20.11 | #27 | 9.45 diminished credit / 14.1 benchmark |
| Prime Dominance | 17.97 | #46 | 17.97 raw × 100.0% sample |
| Longevity | 12.06 | #38 | 57.89 counted elite months |
| Apex modifier | +4.38 | Modifier | A compliant two-win championship peak replaces the non-winning Moreno selection with no final score change. |
| Loss penalty | -3.38 | Modifier | 7 official/technical loss events reviewed |
| Division-era depth | -0.37 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **3**. Adjusted title wins: **2.75**. Derived undisputed-title win count: **3**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final adjusted credit | Review note |
| --- | --- | --- | --- | --- | --- | --- |
| 2020-07-19 | Joseph Benavidez | vacant-undisputed | 0.9 | 1 | 0.9 | Elite vacant-title opponent at full strength; missed-weight first fight context remains high-risk. |
| 2020-11-21 | Alex Perez | normal | 1 | 0.85 | 0.85 | locked |
| 2022-01-22 | Brandon Moreno | normal | 1 | 0.95 | 0.95 | locked |

#### Opponent Quality receipts

Raw win credit: **10.7**. Diminishing-return credit before fighter adjustment: **9.45**. Fighter adjustment: **0**. Final diminished credit: **9.45**.

| Slot | Date | Opponent | Base/final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 2022-01-22 | Brandon Moreno | 1.25 | 1 | 1.25 | Elite flyweight champion and defining rival. |
| 2 | 2020-02-29 | Joseph Benavidez | 1.15 | 1 | 1.15 | Elite flyweight great, division-calibrated below max. |
| 3 | 2019-07-27 | Alexandre Pantoja | 1 | 1 | 1 | Future UFC flyweight champion. |
| 4 | 2020-07-19 | Joseph Benavidez | 1 | 1 | 1 | Elite flyweight title contender. |
| 5 | 2024-08-03 | Marlon Vera | 1 | 1 | 1 | Top-five bantamweight win. |
| 6 | 2020-11-21 | Alex Perez | 0.85 | 1 | 0.85 | Ranked flyweight title challenger. |
| 7 | 2025-10-11 | Montel Jackson | 0.85 | 0.75 | 0.64 | Strong ranked bantamweight win. |
| 8 | 2018-08-25 | John Moraga | 0.65 | 0.75 | 0.49 | Ranked flyweight contender. |
| 9 | 2019-10-12 | Tim Elliott | 0.65 | 0.75 | 0.49 | Ranked flyweight contender. |
| 10 | 2023-12-02 | Rob Font | 0.65 | 0.75 | 0.49 | Ranked bantamweight veteran win. |
| 11 | 2024-04-13 | Cody Garbrandt | 0.65 | 0.75 | 0.49 | Former champion name, late-career timing. |
| 12 | 2017-10-28 | Jarred Brooks | 0.45 | 0.75 | 0.34 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 13 | 2018-02-03 | Joseph Morales | 0.45 | 0.5 | 0.23 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 14 | 2017-06-03 | Marco Beltrán | 0.1 | 0.5 | 0.05 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |

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

#### Loss-penalty receipts

The fight-level rules create raw loss events. The final category then compresses those events through severity, frequency, and a prime-loss volume floor. Exposure: **18** fights. Severity: **2.25**. Frequency: **1.13**. Prime-volume floor: **2.75**. Pre-division magnitude: **3.38**. Final penalty: **-3.38**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Raw event penalty | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2019-03-23 | Jussier Formiga | pre-prime | top-five | home | No | Yes | -0.75 | standard rule |
| 2021-06-12 | Brandon Moreno | prime | champion-level | home | Yes | Yes | -2.25 | standard rule |
| 2023-01-21 | Brandon Moreno | prime | champion-level | home | Yes | Yes | -2.25 | standard rule |
| 2024-11-23 | Petr Yan | prime | champion-level | home | No | Yes | -1.5 | standard rule |
| 2025-05-03 | Cory Sandhagen | post-prime | top-five | home | Yes | No | 0 | technical-injury-context |
| 2026-01-24 | Umar Nurmagomedov | post-prime | top-five | catchweight | No | Yes | 0 | standard rule |
| 2026-05-30 | Song Yadong | post-prime | top-ten | home | Yes | Yes | 0 | standard rule |

#### Division-strength context

Default division key: **figueiredo-flyweight-bantamweight-0.98**. Era-ledger division multiplier: **0.98**. Division-era modifier: **-0.37**.

Benavidez I through Yan. Moreno IV was followed by BW elite relevance; Yan is endpoint.

#### Key judgment calls

- **Prime window:** Joseph Benavidez I → Petr Yan.
- **Coverage:** Complete UFC-only ledger.
- **Loss endpoint:** Moreno rivalry stayed title-level and bantamweight move re-proved elite relevance. Yan closes the window per Cody call.

#### Why ranked here

Deiveson Figueiredo ranks #44 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 45.88 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

#### Why not ranked higher?

Deiveson Figueiredo is 0.01 raw points behind #43 Sean Strickland. The largest category separation versus that next target is currently Opponent Quality; future movement must be earned through new UFC evidence and a full pipeline rerun.

#### Final takeaway

Deiveson Figueiredo ranks #44 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 45.88 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

_Source IDs: fighter ledger verified through 2026-07-13; score owner ranking-pipeline.js; category owner category-calculators.js._

### 45. Conor McGregor — 89 OVR

Conor McGregor is ranked from the current UFC-only calculated pipeline.

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

OVR conversion: board anchors **18.68–101.92**, normalized score **0.3263**, curved score **0.3860**, resulting in **89 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 6.19 | #32 | 3 adjusted credit / 14.54 benchmark |
| Opponent Quality | 16.06 | #43 | 7.55 diminished credit / 14.1 benchmark |
| Prime Dominance | 21.21 | #24 | 21.21 raw × 100.0% sample |
| Longevity | 10.47 | #44 | 50.27 counted elite months |
| Apex modifier | +5.8 | Modifier | Two-division superstar apex. |
| Loss penalty | -4.81 | Modifier | 5 official/technical loss events reviewed |
| Division-era depth | -0.45 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **3**. Adjusted title wins: **3**. Derived undisputed-title win count: **2**. Interim-title win count: **1**.

| Date | Opponent | Title type | Base | Opponent strength | Final adjusted credit | Review note |
| --- | --- | --- | --- | --- | --- | --- |
| 2015-07-11 | Chad Mendes | interim | 0.75 | 1 | 0.75 | Cody-approved fighter audit: full 0.75 interim-title credit for the Chad Mendes win. |
| 2015-12-12 | Jose Aldo | normal | 1 | 1 | 1 | locked |
| 2016-11-12 | Eddie Alvarez | second-division-undisputed | 1.25 | 1 | 1.25 | Second-division undisputed title value. |

#### Opponent Quality receipts

Raw win credit: **8**. Diminishing-return credit before fighter adjustment: **7.55**. Fighter adjustment: **0**. Final diminished credit: **7.55**.

| Slot | Date | Opponent | Base/final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 2015-12-12 | Jose Aldo | 1.25 | 1 | 1.25 | Prime featherweight champion and all-time great. |
| 2 | 2016-11-12 | Eddie Alvarez | 1.25 | 1 | 1.25 | UFC lightweight champion. |
| 3 | 2013-08-17 | Max Holloway | 1 | 1 | 1 | Early win over future all-time featherweight great. |
| 4 | 2015-07-11 | Chad Mendes | 1 | 1 | 1 | Elite featherweight contender on short notice. |
| 5 | 2014-09-27 | Dustin Poirier | 0.85 | 1 | 0.85 | Strong featherweight contender before later lightweight peak. |
| 6 | 2016-08-20 | Nate Diaz | 0.85 | 1 | 0.85 | High-level rivalry win at welterweight; not title-contender context. |
| 7 | 2020-01-18 | Donald Cerrone | 0.65 | 0.75 | 0.49 | Big-name veteran with timing/fade context. |
| 8 | 2014-07-19 | Diego Brandao | 0.45 | 0.75 | 0.34 | Solid featherweight win. |
| 9 | 2015-01-18 | Dennis Siver | 0.45 | 0.75 | 0.34 | Solid featherweight win. |
| 10 | 2013-04-06 | Marcus Brimage | 0.25 | 0.75 | 0.19 | Early UFC win with limited quality value. |

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

| From | To | Raw months | Counted months | Reason |
| --- | --- | --- | --- | --- |
| 2016-11-12 | 2018-10-06 | 22.77 | 18 | Between-fight gap capped at 18 months |

#### Loss-penalty receipts

The fight-level rules create raw loss events. The final category then compresses those events through severity, frequency, and a prime-loss volume floor. Exposure: **11** fights. Severity: **3.5**. Frequency: **1.91**. Prime-volume floor: **2**. Pre-division magnitude: **5.41**. Final penalty: **-4.81**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Raw event penalty | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2016-03-05 | Nate Diaz | prime | top-ten | home | Yes | Yes | -4.75 | standard rule |
| 2018-10-06 | Khabib Nurmagomedov | prime | champion-level | home | Yes | Yes | -2.25 | standard rule |
| 2021-01-24 | Dustin Poirier | post-prime | top-five | home | Yes | Yes | 0 | standard rule |
| 2021-07-10 | Dustin Poirier | post-prime | top-five | home | Yes | Yes | 0 | standard rule |
| 2026-07-11 | Max Holloway | post-prime | top-five | home | Yes | Yes | 0 | standard rule |

#### Division-strength context

Default division key: **mcgregor-featherweight-lightweight-1.06**. Era-ledger division multiplier: **1.07**. Division-era modifier: **-0.45**.

Poirier I through Khabib.

#### Key judgment calls

- **Prime window:** Dustin Poirier I → Khabib Nurmagomedov.
- **Coverage:** Complete UFC-only ledger through 2026-07-11. Non-UFC results excluded.
- **Loss endpoint:** Nate I did not end it because Conor recovered with Nate II and Eddie. Khabib is endpoint.

#### Why ranked here

Conor McGregor ranks #45 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 45.84 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

#### Why not ranked higher?

Conor McGregor is 0.04 raw points behind #44 Deiveson Figueiredo. The largest category separation versus that next target is currently Opponent Quality; future movement must be earned through new UFC evidence and a full pipeline rerun.

#### Final takeaway

Conor McGregor ranks #45 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 45.84 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

_Source IDs: fighter ledger verified through 2026-07-13; score owner ranking-pipeline.js; category owner category-calculators.js._

### 46. Vitor Belfort — 88 OVR

Vitor Belfort is ranked from the current UFC-only calculated pipeline.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 45.22 | 15-10, 1 NC | Middleweight / Light Heavyweight / Heavyweight / Catchweight | 1 | 1.1 | 5 | 7-3 | 64.3% | 6.1 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 2.3 | 35 | 2.68 |
| Opponent Quality | 18.72 | 25 | 15.6 |
| Prime Dominance | 20.97 | 30 | 20.97 |
| Longevity | 15.24 | 10 | 5.08 |

Base score: **44.33**. Modifiers: Apex **+5.26**, Loss Penalty **-3.71**, Division-Era Depth **-0.66**. Final raw score: **45.22**.

OVR conversion: board anchors **18.68–101.92**, normalized score **0.3188**, curved score **0.3785**, resulting in **88 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 2.3 | #51 | 1.11 adjusted credit / 14.54 benchmark |
| Opponent Quality | 18.72 | #37 | 8.8 diminished credit / 14.1 benchmark |
| Prime Dominance | 20.97 | #26 | 20.97 raw × 100.0% sample |
| Longevity | 15.24 | #26 | 73.17 counted elite months |
| Apex modifier | +5.26 | Modifier | Back-to-back elite head-kick finishes create maximum Aura, strong Proof, and a real but not maximum best-fighter claim. |
| Loss penalty | -3.71 | Modifier | 10 official/technical loss events reviewed |
| Division-era depth | -0.66 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **1**. Adjusted title wins: **1.1**. Derived undisputed-title win count: **1**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final adjusted credit | Review note |
| --- | --- | --- | --- | --- | --- | --- |
| 1997-02-07 | Scott Ferrozzo | tournament | 0.85 | 0.29 | 0.25 | Approved aggregate Championship score recovered from the live control; exact historical per-fight split was not stored. |
| 2004-01-31 | Randy Couture | normal | 1 | 0.85 | 0.86 | Approved aggregate Championship score recovered from the live control; exact historical per-fight split was not stored. |

#### Opponent Quality receipts

Raw win credit: **9.85**. Diminishing-return credit before fighter adjustment: **8.8**. Fighter adjustment: **0**. Final diminished credit: **8.8**.

| Slot | Date | Opponent | Base/final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 2009-09-19 | Rich Franklin | 1.25 | 1 | 1.25 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 2 | 2004-01-31 | Randy Couture | 1 | 1 | 1 | Official champion win with unusual cut stoppage. |
| 3 | 2013-01-19 | Michael Bisping | 1 | 1 | 1 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 4 | 2013-05-18 | Luke Rockhold | 1 | 1 | 1 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 5 | 2013-11-09 | Dan Henderson | 1 | 1 | 1 | Only this UFC bout is scored; PRIDE meeting is excluded. |
| 6 | 1998-10-16 | Wanderlei Silva | 0.85 | 1 | 0.85 | UFC-only credit; later PRIDE career is context only. |
| 7 | 2012-01-14 | Anthony Johnson | 0.85 | 0.75 | 0.64 | Johnson missed weight. |
| 8 | 2015-11-07 | Dan Henderson | 0.85 | 0.75 | 0.64 | Late-career opponent; UFC-only bout. |
| 9 | 1997-02-07 | Scott Ferrozzo | 0.45 | 0.75 | 0.34 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 10 | 2003-06-06 | Marvin Eastman | 0.45 | 0.75 | 0.34 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 11 | 2011-08-06 | Yoshihiro Akiyama | 0.45 | 0.75 | 0.34 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 12 | 1997-05-30 | Tank Abbott | 0.25 | 0.75 | 0.19 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 13 | 2017-06-03 | Nate Marquardt | 0.25 | 0.5 | 0.13 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 14 | 1997-02-07 | Tra Telligman | 0.1 | 0.5 | 0.05 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 15 | 1997-12-21 | Joe Charles | 0.1 | 0.5 | 0.05 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |

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

| From | To | Raw months | Counted months | Reason |
| --- | --- | --- | --- | --- |
| 2013-11-09 | 2015-05-23 | 18.4 | 18 | Between-fight gap capped at 18 months |

#### Loss-penalty receipts

The fight-level rules create raw loss events. The final category then compresses those events through severity, frequency, and a prime-loss volume floor. Exposure: **21** fights. Severity: **2.25**. Frequency: **1.46**. Prime-volume floor: **3**. Pre-division magnitude: **3.71**. Final penalty: **-3.71**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Raw event penalty | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1997-10-17 | Randy Couture | pre-prime | champion-level | home | Yes | Yes | -1.5 | standard rule |
| 2002-06-22 | Chuck Liddell | pre-prime | champion-level | home | No | Yes | -0.75 | standard rule |
| 2004-08-21 | Randy Couture | pre-prime | champion-level | home | Yes | Yes | -1.5 | standard rule |
| 2005-02-05 | Tito Ortiz | pre-prime | champion-level | home | No | Yes | -0.75 | standard rule |
| 2011-02-05 | Anderson Silva | prime | champion-level | home | Yes | Yes | -2.25 | standard rule |
| 2012-09-22 | Jon Jones | prime | champion-level | upward | Yes | Yes | -1.25 | standard rule |
| 2015-05-23 | Chris Weidman | prime | champion-level | home | Yes | Yes | -2.25 | standard rule |
| 2016-05-14 | Ronaldo Souza | post-prime | top-five | home | Yes | Yes | 0 | standard rule |
| 2016-10-08 | Gegard Mousasi | post-prime | top-five | home | Yes | Yes | 0 | standard rule |
| 2018-05-12 | Lyoto Machida | post-prime | top-ten | home | Yes | Yes | 0 | standard rule |

#### Division-strength context

Default division key: **vitor-multi-era-0.97**. Era-ledger division multiplier: **0.98**. Division-era modifier: **-0.66**.

Mixed heavyweight, light-heavyweight and middleweight UFC eras.

#### Key judgment calls

- **Prime window:** Rich Franklin → Dan Henderson III.
- **Coverage:** Complete UFC-only ledger.
- **Loss endpoint:** Henderson III closes the last sustained UFC elite phase before the late decline.

#### Why ranked here

Vitor Belfort ranks #46 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 45.22 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

#### Why not ranked higher?

Vitor Belfort is 0.62 raw points behind #45 Conor McGregor. The largest category separation versus that next target is currently Championship; future movement must be earned through new UFC evidence and a full pipeline rerun.

#### Final takeaway

Vitor Belfort ranks #46 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 45.22 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

_Source IDs: fighter ledger verified through 2026-07-13; score owner ranking-pipeline.js; category owner category-calculators.js._

### 47. Lyoto Machida — 88 OVR

Lyoto Machida is ranked from the current UFC-only calculated pipeline.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 45.18 | 16-8 | Light Heavyweight / Middleweight | 2 | 1.65 | 7 | 9-5 | 58.3% | 5.88 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 4.02 | 35 | 4.69 |
| Opponent Quality | 21.44 | 25 | 17.87 |
| Prime Dominance | 17.86 | 30 | 17.86 |
| Longevity | 13.96 | 10 | 4.65 |

Base score: **45.07**. Modifiers: Apex **+4.64**, Loss Penalty **-4.25**, Division-Era Depth **-0.28**. Final raw score: **45.18**.

OVR conversion: board anchors **18.68–101.92**, normalized score **0.3184**, curved score **0.3780**, resulting in **88 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 4.02 | #43 | 1.95 adjusted credit / 14.54 benchmark |
| Opponent Quality | 21.44 | #20 | 10.07 diminished credit / 14.1 benchmark |
| Prime Dominance | 17.86 | #48 | 17.86 raw × 100.0% sample |
| Longevity | 13.96 | #29 | 67.03 counted elite months |
| Apex modifier | +4.64 | Modifier | Machida-era style aura with title-level proof. |
| Loss penalty | -4.25 | Modifier | 8 official/technical loss events reviewed |
| Division-era depth | -0.28 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **2**. Adjusted title wins: **1.65**. Derived undisputed-title win count: **2**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final adjusted credit | Review note |
| --- | --- | --- | --- | --- | --- | --- |
| 2009-05-23 | Rashad Evans | normal | 1 | 1 | 1 | locked |
| 2009-10-24 | Mauricio Rua | normal | 1 | 0.95 | 0.95 | Controversial first Shogun decision/title defense. |

#### Opponent Quality receipts

Raw win credit: **11.9**. Diminishing-return credit before fighter adjustment: **10.07**. Fighter adjustment: **0**. Final diminished credit: **10.07**.

| Slot | Date | Opponent | Base/final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 2009-05-23 | Rashad Evans | 1.25 | 1 | 1.25 | UFC light heavyweight champion. |
| 2 | 2009-10-24 | Mauricio Rua | 1.25 | 1 | 1.25 | Elite champion-level light heavyweight; controversial decision context. |
| 3 | 2012-08-04 | Ryan Bader | 1 | 1 | 1 | Top-five light-heavyweight contender. |
| 4 | 2014-02-15 | Gegard Mousasi | 1 | 1 | 1 | Elite middleweight/light-heavyweight contender. |
| 5 | 2007-12-29 | Rameau Thierry Sokoudjou | 0.85 | 1 | 0.85 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 6 | 2008-05-24 | Tito Ortiz | 0.85 | 1 | 0.85 | Former UFC champion, later-career but still relevant. |
| 7 | 2009-01-31 | Thiago Silva | 0.85 | 0.75 | 0.64 | Undefeated ranked light heavyweight contender. |
| 8 | 2013-02-23 | Dan Henderson | 0.85 | 0.75 | 0.64 | All-time name and ranked light heavyweight, timing context. |
| 9 | 2011-04-30 | Randy Couture | 0.65 | 0.75 | 0.49 | Legend name, late-career timing. |
| 10 | 2013-10-26 | Mark Munoz | 0.65 | 0.75 | 0.49 | Ranked middleweight win. |
| 11 | 2018-02-03 | Eryk Anders | 0.65 | 0.75 | 0.49 | Ranked-quality middleweight win. |
| 12 | 2007-02-03 | Sam Hoger | 0.45 | 0.75 | 0.34 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 13 | 2007-05-26 | David Heath | 0.45 | 0.5 | 0.23 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 14 | 2007-09-22 | Kazuhiro Nakamura | 0.45 | 0.5 | 0.23 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 15 | 2014-12-20 | C.B. Dollaway | 0.45 | 0.5 | 0.23 | Solid UFC middleweight win. |
| 16 | 2018-05-12 | Vitor Belfort | 0.25 | 0.5 | 0.13 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |

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

#### Loss-penalty receipts

The fight-level rules create raw loss events. The final category then compresses those events through severity, frequency, and a prime-loss volume floor. Exposure: **18** fights. Severity: **2.25**. Frequency: **1.5**. Prime-volume floor: **4.25**. Pre-division magnitude: **4.25**. Final penalty: **-4.25**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Raw event penalty | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2010-05-08 | Mauricio Rua | prime | champion-level | home | Yes | Yes | -2.25 | standard rule |
| 2010-11-20 | Quinton Jackson | prime | top-five | home | No | Yes | -1.5 | standard rule |
| 2011-12-10 | Jon Jones | prime | champion-level | home | Yes | Yes | -2.25 | standard rule |
| 2013-08-03 | Phil Davis | prime | top-five | home | No | Yes | -1.5 | standard rule |
| 2014-07-05 | Chris Weidman | prime | champion-level | home | No | Yes | -1.5 | standard rule |
| 2015-04-18 | Luke Rockhold | post-prime | top-five | home | Yes | Yes | 0 | standard rule |
| 2015-06-27 | Yoel Romero | post-prime | top-five | home | Yes | Yes | 0 | standard rule |
| 2017-10-28 | Derek Brunson | post-prime | top-ten | home | Yes | Yes | 0 | standard rule |

#### Division-strength context

Default division key: **mixed-lhw-middleweight-0.99**. Era-ledger division multiplier: **0.99**. Division-era modifier: **-0.28**.

Thiago Silva through Weidman.

#### Key judgment calls

- **Prime window:** Thiago Silva → Chris Weidman.
- **Coverage:** Complete UFC-only ledger through 2018-05-12. Non-UFC fights excluded.
- **Loss endpoint:** Shogun and Jones losses did not fully end elite relevance. Weidman closes window.

#### Why ranked here

Lyoto Machida ranks #47 because Opponent Quality and Prime Dominance provide the largest weighted parts of a 45.18 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

#### Why not ranked higher?

Lyoto Machida is 0.04 raw points behind #46 Vitor Belfort. The largest category separation versus that next target is currently Prime Dominance; future movement must be earned through new UFC evidence and a full pipeline rerun.

#### Final takeaway

Lyoto Machida ranks #47 because Opponent Quality and Prime Dominance provide the largest weighted parts of a 45.18 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

_Source IDs: fighter ledger verified through 2026-07-13; score owner ranking-pipeline.js; category owner category-calculators.js._

### 48. Rashad Evans — 88 OVR

Rashad Evans is ranked from the current UFC-only calculated pipeline.

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

OVR conversion: board anchors **18.68–101.92**, normalized score **0.3156**, curved score **0.3752**, resulting in **88 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 1.85 | #56 | 0.9 adjusted credit / 14.54 benchmark |
| Opponent Quality | 21.41 | #21 | 10.06 diminished credit / 14.1 benchmark |
| Prime Dominance | 19.7 | #32 | 19.7 raw × 100.0% sample |
| Longevity | 15.6 | #23 | 74.88 counted elite months |
| Apex modifier | +4.99 | Modifier | An iconic knockout followed by a title-winning finish creates a near-5.00 Apex without a sustained best-fighter claim. |
| Loss penalty | -4.42 | Modifier | 8 official/technical loss events reviewed |
| Division-era depth | -0.52 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **1**. Adjusted title wins: **0.9**. Derived undisputed-title win count: **1**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final adjusted credit | Review note |
| --- | --- | --- | --- | --- | --- | --- |
| 2008-12-27 | Forrest Griffin | normal | 1 | 0.9 | 0.9 | Approved aggregate Championship score recovered from the live control; exact historical per-fight split was not stored. |

#### Opponent Quality receipts

Raw win credit: **11.35**. Diminishing-return credit before fighter adjustment: **10.06**. Fighter adjustment: **0**. Final diminished credit: **10.06**.

| Slot | Date | Opponent | Base/final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 2008-09-06 | Chuck Liddell | 1.25 | 1 | 1.25 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 2 | 2008-12-27 | Forrest Griffin | 1.25 | 1 | 1.25 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 3 | 2010-05-29 | Quinton Jackson | 1.25 | 1 | 1.25 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 4 | 2007-11-17 | Michael Bisping | 1 | 1 | 1 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 5 | 2010-01-02 | Thiago Silva | 1 | 1 | 1 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 6 | 2012-01-28 | Phil Davis | 1 | 1 | 1 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 7 | 2013-06-15 | Dan Henderson | 1 | 0.75 | 0.75 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 8 | 2011-08-06 | Tito Ortiz | 0.85 | 0.75 | 0.64 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 9 | 2013-11-16 | Chael Sonnen | 0.85 | 0.75 | 0.64 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 10 | 2005-11-05 | Brad Imes | 0.45 | 0.75 | 0.34 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 11 | 2006-04-06 | Sam Hoger | 0.45 | 0.75 | 0.34 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 12 | 2006-06-28 | Stephan Bonnar | 0.45 | 0.75 | 0.34 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 13 | 2006-09-23 | Jason Lambert | 0.45 | 0.5 | 0.23 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 14 | 2007-01-25 | Sean Salmon | 0.1 | 0.5 | 0.05 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |

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

#### Loss-penalty receipts

The fight-level rules create raw loss events. The final category then compresses those events through severity, frequency, and a prime-loss volume floor. Exposure: **18** fights. Severity: **3.13**. Frequency: **1.29**. Prime-volume floor: **2.5**. Pre-division magnitude: **4.42**. Final penalty: **-4.42**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Raw event penalty | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2009-05-23 | Lyoto Machida | prime | champion-level | home | Yes | Yes | -2.25 | standard rule |
| 2012-04-21 | Jon Jones | prime | champion-level | home | No | Yes | -1.5 | standard rule |
| 2013-02-02 | Antônio Rogério Nogueira | prime | ranked | home | No | Yes | -4 | standard rule |
| 2015-10-03 | Ryan Bader | post-prime | top-five | home | No | Yes | 0 | standard rule |
| 2016-04-16 | Glover Teixeira | post-prime | top-five | home | Yes | Yes | 0 | standard rule |
| 2017-03-04 | Daniel Kelly | post-prime | solid | home | No | Yes | 0 | standard rule |
| 2017-08-05 | Sam Alvey | post-prime | solid | home | No | Yes | 0 | standard rule |
| 2018-06-09 | Anthony Smith | post-prime | top-ten | home | Yes | Yes | 0 | standard rule |

#### Division-strength context

Default division key: **light-heavyweight-1.00**. Era-ledger division multiplier: **1**. Division-era modifier: **-0.52**.

Bisping through Sonnen.

#### Key judgment calls

- **Prime window:** Michael Bisping → Chael Sonnen.
- **Coverage:** Complete UFC-only ledger.
- **Loss endpoint:** Sonnen closes the sustained UFC light-heavyweight elite window.

#### Why ranked here

Rashad Evans ranks #48 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 44.95 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

#### Why not ranked higher?

Rashad Evans is 0.23 raw points behind #47 Lyoto Machida. The largest category separation versus that next target is currently Championship; future movement must be earned through new UFC evidence and a full pipeline rerun.

#### Final takeaway

Rashad Evans ranks #48 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 44.95 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

_Source IDs: fighter ledger verified through 2026-07-13; score owner ranking-pipeline.js; category owner category-calculators.js._

### 49. Dricus du Plessis — 88 OVR

Dricus du Plessis is ranked from the current UFC-only calculated pipeline.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 44.32 | 9-1 | Middleweight | 3 | 3 | 5 | 4-1 | 52.4% | 2.11 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 5.88 | 35 | 6.86 |
| Opponent Quality | 14.92 | 25 | 12.43 |
| Prime Dominance | 19.14 | 30 | 19.14 |
| Longevity | 9.05 | 10 | 3.02 |

Base score: **41.45**. Modifiers: Apex **+4.55**, Loss Penalty **-1.95**, Division-Era Depth **+0.27**. Final raw score: **44.32**.

OVR conversion: board anchors **18.68–101.92**, normalized score **0.3080**, curved score **0.3675**, resulting in **88 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 5.88 | #34 | 2.85 adjusted credit / 14.54 benchmark |
| Opponent Quality | 14.92 | #45 | 7.01 diminished credit / 14.1 benchmark |
| Prime Dominance | 19.14 | #37 | 20.15 raw × 95.0% sample |
| Longevity | 9.05 | #50 | 43.44 counted elite months |
| Apex modifier | +4.55 | Modifier | Whittaker and Adesanya provide elite two-night proof. Close Strickland fights, a short reign, chaotic separation, and the Khamzat ceiling cap the best-fighter claim and aura. |
| Loss penalty | -1.95 | Modifier | 1 official/technical loss events reviewed |
| Division-era depth | +0.27 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **3**. Adjusted title wins: **3**. Derived undisputed-title win count: **3**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final adjusted credit | Review note |
| --- | --- | --- | --- | --- | --- | --- |
| 2024-01-20 | Sean Strickland | normal | 1 | 0.95 | 0.95 | Close/current-table title win. |
| 2024-08-18 | Israel Adesanya | normal | 1 | 0.95 | 0.95 | locked |
| 2025-02-09 | Sean Strickland | normal | 1 | 0.95 | 0.95 | Current-table rematch defense. |

#### Opponent Quality receipts

Raw win credit: **7.35**. Diminishing-return credit before fighter adjustment: **7.01**. Fighter adjustment: **0**. Final diminished credit: **7.01**.

| Slot | Date | Opponent | Base/final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 2024-01-20 | Sean Strickland | 1.25 | 1 | 1.25 | Beat the reigning UFC middleweight champion to win the title. |
| 2 | 2024-08-18 | Israel Adesanya | 1.25 | 1 | 1.25 | Elite UFC middleweight champion-level opponent. |
| 3 | 2023-07-08 | Robert Whittaker | 1 | 1 | 1 | Elite former champion and prime contender; Cody-approved at true top-five credit rather than max champion-level credit. |
| 4 | 2025-02-09 | Sean Strickland | 1 | 1 | 1 | Clear title-defense rematch win over an elite former champion, with repeat-opponent context. |
| 5 | 2023-03-04 | Derek Brunson | 0.85 | 1 | 0.85 | Strong ranked middleweight contender. |
| 6 | 2022-07-02 | Brad Tavares | 0.65 | 1 | 0.65 | Quality middleweight veteran. |
| 7 | 2022-12-10 | Darren Till | 0.65 | 0.75 | 0.49 | Ranked middleweight name with timing context. |
| 8 | 2021-07-10 | Trevin Giles | 0.45 | 0.75 | 0.34 | Solid UFC middleweight win. |
| 9 | 2020-10-11 | Markus Perez | 0.25 | 0.75 | 0.19 | Low-end UFC quality value. |

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

#### Loss-penalty receipts

The fight-level rules create raw loss events. The final category then compresses those events through severity, frequency, and a prime-loss volume floor. Exposure: **10** fights. Severity: **1.5**. Frequency: **0.45**. Prime-volume floor: **0.75**. Pre-division magnitude: **1.95**. Final penalty: **-1.95**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Raw event penalty | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2025-08-16 | Khamzat Chimaev | prime | champion-level | home | No | Yes | -1.5 | standard rule |

#### Division-strength context

Default division key: **modern-middleweight-1.00**. Era-ledger division multiplier: **0.98**. Division-era modifier: **+0.27**.

Brunson through current championship form.

#### Key judgment calls

- **Prime window:** Derek Brunson → Current championship form.
- **Coverage:** Complete UFC-only ledger through 2025-08-16. The scheduled 2026 Kamaru Usman fight is excluded.
- **Loss endpoint:** Current champion/title-level form. No unrecovered UFC elite-prime loss.

#### Why ranked here

Dricus du Plessis ranks #49 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 44.32 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

#### Why not ranked higher?

Dricus du Plessis is 0.63 raw points behind #48 Rashad Evans. The largest category separation versus that next target is currently Longevity; future movement must be earned through new UFC evidence and a full pipeline rerun.

#### Final takeaway

Dricus du Plessis ranks #49 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 44.32 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

_Source IDs: fighter ledger verified through 2026-07-13; score owner ranking-pipeline.js; category owner category-calculators.js._

### 50. Justin Gaethje — 88 OVR

Justin Gaethje is ranked from the current UFC-only calculated pipeline.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 42.77 | 11-5 | Lightweight | 3 | 2.5 | 6 | 7-3 | 57.6% | 6.18 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 4.85 | 35 | 5.66 |
| Opponent Quality | 20.19 | 25 | 16.83 |
| Prime Dominance | 15.55 | 30 | 15.55 |
| Longevity | 11.01 | 10 | 3.67 |

Base score: **41.71**. Modifiers: Apex **+4.95**, Loss Penalty **-3.83**, Division-Era Depth **-0.06**. Final raw score: **42.77**.

OVR conversion: board anchors **18.68–101.92**, normalized score **0.2894**, curved score **0.3486**, resulting in **88 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 4.85 | #40 | 2.35 adjusted credit / 14.54 benchmark |
| Opponent Quality | 20.19 | #25 | 9.49 diminished credit / 14.1 benchmark |
| Prime Dominance | 15.55 | #57 | 15.55 raw × 100.0% sample |
| Longevity | 11.01 | #43 | 52.85 counted elite months |
| Apex modifier | +4.95 | Modifier | Topuria is a maximum-level Apex win: an undefeated two-division champion and pound-for-pound benchmark broken in a title unification fight. Paddy adds legitimate interim-title proof, but his lower opponent standing and Gaethje’s historically hittable style keep this below the mythic six-point tier. |
| Loss penalty | -3.83 | Modifier | 5 official/technical loss events reviewed |
| Division-era depth | -0.06 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **3**. Adjusted title wins: **2.5**. Derived undisputed-title win count: **1**. Interim-title win count: **2**.

| Date | Opponent | Title type | Base | Opponent strength | Final adjusted credit | Review note |
| --- | --- | --- | --- | --- | --- | --- |
| 2020-05-09 | Tony Ferguson | interim | 0.75 | 0.95 | 0.71 | Interim title over elite lightweight. |
| 2026-01-24 | Paddy Pimblett | interim | 0.75 | 0.85 | 0.64 | Recent-event add: UFC 324 interim lightweight title win. Counts as interim title credit only. |
| 2026-06-14 | Ilia Topuria | normal | 1 | 1 | 1 | Recent-event add: UFC Freedom 250 undisputed lightweight title win over elite two-division champion. |

#### Opponent Quality receipts

Raw win credit: **10.45**. Diminishing-return credit before fighter adjustment: **9.49**. Fighter adjustment: **0**. Final diminished credit: **9.49**.

| Slot | Date | Opponent | Base/final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 2020-05-09 | Tony Ferguson | 1.25 | 1 | 1.25 | Elite top lightweight/interim-title opponent at the time. |
| 2 | 2023-07-29 | Dustin Poirier | 1.25 | 1 | 1.25 | Elite lightweight rematch win. |
| 3 | 2026-06-14 | Ilia Topuria | 1.25 | 1 | 1.25 | Elite two-division champion-level opponent and undisputed lightweight title win. |
| 4 | 2021-11-06 | Michael Chandler | 1 | 1 | 1 | Elite action-contender and former title challenger. |
| 5 | 2023-03-18 | Rafael Fiziev | 1 | 1 | 1 | Prime top lightweight contender. |
| 6 | 2019-03-30 | Edson Barboza | 0.85 | 1 | 0.85 | Dangerous ranked lightweight striker. |
| 7 | 2019-09-14 | Donald Cerrone | 0.85 | 0.75 | 0.64 | Big-name ranked veteran with timing/fade context. |
| 8 | 2025-03-08 | Rafael Fiziev | 0.85 | 0.75 | 0.64 | Strong ranked lightweight rematch win. |
| 9 | 2026-01-24 | Paddy Pimblett | 0.85 | 0.75 | 0.64 | Interim-title win, but opponent quality still under review. |
| 10 | 2017-07-07 | Michael Johnson | 0.65 | 0.75 | 0.49 | Dangerous veteran lightweight win. |
| 11 | 2018-08-25 | James Vick | 0.65 | 0.75 | 0.49 | Ranked lightweight win with limited elite value. |

#### Prime Dominance receipts

Prime window: **Tony Ferguson → Max Holloway**. Prime record: **7-3**. Effective samples: **7**. Sample multiplier: **100.0%**.

| Prime component | Score | Evidence |
| --- | --- | --- |
| Prime record | 5.14 | 4-3; 57.1% |
| Round control | 4.71 | 52.4%; rounds 11-10 |
| Finish pressure | 1 | 2 finishes; 28.6% |
| Elite-level validation | 4.7 | 7 elite-stage fights; 4.7 points |
| Raw prime score | 15.55 | Before sample multiplier |
| Final Prime Dominance | 15.55 | 15.55 × 1 |

#### Longevity receipts

Active elite years: **6.18**. Raw calendar months: **47.1**. Gap-adjusted months: **47.1**. Status multiplier: **1.02**. Division multiplier: **1.1**. Counted elite months: **52.85**.

#### Loss-penalty receipts

The fight-level rules create raw loss events. The final category then compresses those events through severity, frequency, and a prime-loss volume floor. Exposure: **13** fights. Severity: **2.25**. Frequency: **2.25**. Prime-volume floor: **3**. Pre-division magnitude: **4.5**. Final penalty: **-3.83**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Raw event penalty | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2017-12-02 | Eddie Alvarez | pre-prime | top-five | home | Yes | Yes | -1.5 | standard rule |
| 2018-04-14 | Dustin Poirier | pre-prime | top-five | home | Yes | Yes | -1.5 | standard rule |
| 2020-10-24 | Khabib Nurmagomedov | prime | champion-level | home | Yes | Yes | -2.25 | standard rule |
| 2022-05-07 | Charles Oliveira | prime | top-five | home | Yes | Yes | -2.25 | standard rule |
| 2024-04-13 | Max Holloway | prime | top-five | home | Yes | Yes | -2.25 | standard rule |

#### Division-strength context

Default division key: **modern-lightweight-1.10**. Era-ledger division multiplier: **1.1**. Division-era modifier: **-0.06**.

Tony Ferguson through Holloway.

#### Key judgment calls

- **Prime window:** Tony Ferguson → Max Holloway.
- **Coverage:** Complete UFC-only ledger through 2026-06-14. Non-UFC results excluded.
- **Loss endpoint:** Khabib and Oliveira did not end it because Gaethje recovered with elite wins. Holloway is endpoint.

#### Why ranked here

Justin Gaethje ranks #50 because Opponent Quality and Prime Dominance provide the largest weighted parts of a 42.77 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

#### Why not ranked higher?

Justin Gaethje is 1.55 raw points behind #49 Dricus du Plessis. The largest category separation versus that next target is currently Prime Dominance; future movement must be earned through new UFC evidence and a full pipeline rerun.

#### Final takeaway

Justin Gaethje ranks #50 because Opponent Quality and Prime Dominance provide the largest weighted parts of a 42.77 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

_Source IDs: fighter ledger verified through 2026-07-13; score owner ranking-pipeline.js; category owner category-calculators.js._

### 51. Dominick Cruz — 88 OVR

Dominick Cruz is ranked from the current UFC-only calculated pipeline.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 42.34 | 7-3 | Bantamweight | 4 | 3.8 | 5 | 5-2 | 67.9% | 5.51 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 7.63 | 35 | 8.9 |
| Opponent Quality | 13.7 | 25 | 11.42 |
| Prime Dominance | 18.19 | 30 | 18.19 |
| Longevity | 14.05 | 10 | 4.68 |

Base score: **43.19**. Modifiers: Apex **+4.25**, Loss Penalty **-3.49**, Division-Era Depth **-1.61**. Final raw score: **42.34**.

OVR conversion: board anchors **18.68–101.92**, normalized score **0.2842**, curved score **0.3433**, resulting in **88 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 7.63 | #23 | 3.7 adjusted credit / 14.54 benchmark |
| Opponent Quality | 13.7 | #52 | 6.44 diminished credit / 14.1 benchmark |
| Prime Dominance | 18.19 | #44 | 18.19 raw × 100.0% sample |
| Longevity | 14.05 | #28 | 67.42 counted elite months |
| Apex modifier | +4.25 | Modifier | UFC-only comeback/technical-control apex. |
| Loss penalty | -3.49 | Modifier | 3 official/technical loss events reviewed |
| Division-era depth | -1.61 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **4**. Adjusted title wins: **3.8**. Derived undisputed-title win count: **4**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final adjusted credit | Review note |
| --- | --- | --- | --- | --- | --- | --- |
| 2011-07-02 | Urijah Faber | normal | 1 | 0.95 | 0.95 | locked |
| 2011-10-01 | Demetrious Johnson | normal | 1 | 0.9 | 0.9 | locked |
| 2016-01-17 | T.J. Dillashaw | normal | 1 | 0.95 | 0.95 | locked |
| 2016-06-04 | Urijah Faber | normal | 1 | 0.9 | 0.9 | locked |

#### Opponent Quality receipts

Raw win credit: **6.6**. Diminishing-return credit before fighter adjustment: **6.44**. Fighter adjustment: **0**. Final diminished credit: **6.44**.

| Slot | Date | Opponent | Base/final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 2016-01-17 | T.J. Dillashaw | 1.25 | 1 | 1.25 | Beat the reigning UFC bantamweight champion after a long injury layoff. |
| 2 | 2011-07-02 | Urijah Faber | 1 | 1 | 1 | Elite UFC bantamweight title challenger in Cruz’s first UFC championship fight. |
| 3 | 2011-10-01 | Demetrious Johnson | 1 | 1 | 1 | Elite UFC bantamweight title challenger; later flyweight greatness is context, not back-credit. |
| 4 | 2014-09-27 | Takeya Mizugaki | 1 | 1 | 1 | Top-five bantamweight contender stopped immediately in Cruz’s return. |
| 5 | 2016-06-04 | Urijah Faber | 0.85 | 1 | 0.85 | Veteran elite challenger, discounted for age and repeat context. |
| 6 | 2021-12-11 | Pedro Munhoz | 0.85 | 1 | 0.85 | Ranked bantamweight contender win late in Cruz’s UFC career. |
| 7 | 2021-03-06 | Casey Kenney | 0.65 | 0.75 | 0.49 | Ranked-quality bantamweight comeback win. |

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

| From | To | Raw months | Counted months | Reason |
| --- | --- | --- | --- | --- |
| 2011-10-01 | 2014-09-27 | 35.88 | 18 | Between-fight gap capped at 18 months |
| 2016-12-30 | 2020-05-09 | 40.28 | 18 | Between-fight gap capped at 18 months |

#### Loss-penalty receipts

The fight-level rules create raw loss events. The final category then compresses those events through severity, frequency, and a prime-loss volume floor. Exposure: **7** fights. Severity: **1.88**. Frequency: **1.61**. Prime-volume floor: **1.75**. Pre-division magnitude: **3.49**. Final penalty: **-3.49**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Raw event penalty | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2016-12-30 | Cody Garbrandt | prime | champion-level | home | No | Yes | -1.5 | standard rule |
| 2020-05-09 | Henry Cejudo | prime | champion-level | home | Yes | Yes | -2.25 | standard rule |
| 2022-08-13 | Marlon Vera | post-prime | top-five | home | Yes | Yes | 0 | standard rule |

#### Division-strength context

Default division key: **modern-bantamweight-1.00**. Era-ledger division multiplier: **1**. Division-era modifier: **-1.61**.

Urijah Faber II through Henry Cejudo. Both injury gaps use the universal 18-month cap; no special 24-month injury allowance.

#### Key judgment calls

- **Prime window:** Urijah Faber II → Henry Cejudo.
- **Coverage:** Complete UFC-only ledger.
- **Loss endpoint:** Garbrandt did not automatically end it; Cejudo title loss is the endpoint. Vera is post-prime.

#### Why ranked here

Dominick Cruz ranks #51 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 42.34 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

#### Why not ranked higher?

Dominick Cruz is 0.43 raw points behind #50 Justin Gaethje. The largest category separation versus that next target is currently Opponent Quality; future movement must be earned through new UFC evidence and a full pipeline rerun.

#### Final takeaway

Dominick Cruz ranks #51 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 42.34 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

_Source IDs: fighter ledger verified through 2026-07-13; score owner ranking-pipeline.js; category owner category-calculators.js._

### 52. Royce Gracie — 88 OVR

Royce Gracie is ranked from the current UFC-only calculated pipeline.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 42.17 | 11-1-1 | Openweight / Welterweight | 0 | 0 | 2 | 11-0-1 | 95.8% | 1.4 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 4.85 | 35 | 5.66 |
| Opponent Quality | 9.55 | 25 | 7.96 |
| Prime Dominance | 25.12 | 30 | 25.12 |
| Longevity | 3.4 | 10 | 1.13 |

Base score: **39.87**. Modifiers: Apex **+5.3**, Loss Penalty **0**, Division-Era Depth **-3**. Final raw score: **42.17**.

OVR conversion: board anchors **18.68–101.92**, normalized score **0.2822**, curved score **0.3412**, resulting in **88 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 4.85 | #40 | 2.35 adjusted credit / 14.54 benchmark |
| Opponent Quality | 9.55 | #59 | 4.49 diminished credit / 14.1 benchmark |
| Prime Dominance | 25.12 | #7 | 27.91 raw × 90.0% sample |
| Longevity | 3.4 | #61 | 16.33 counted elite months |
| Apex modifier | +5.3 | Modifier | The two real wins support a maximum Best-Fighter Claim and maximum Aura without using an aggregate tournament result. |
| Loss penalty | 0 | Modifier | 1 official/technical loss events reviewed |
| Division-era depth | -3 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **0**. Adjusted title wins: **0**. Derived undisputed-title win count: **0**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final adjusted credit | Review note |
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

| Slot | Date | Opponent | Base/final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 1993-11-12 | Ken Shamrock | 1 | 1 | 1 | Elite UFC 1 tournament opponent, but not yet an established UFC champion; no later-career back-credit. |
| 2 | 1994-12-16 | Dan Severn | 1 | 1 | 1 | Elite UFC 4 tournament finalist with real championship-level danger, held below champion-level because the UFC hierarchy was not yet established. |
| 3 | 1993-11-12 | Gerard Gordeau | 0.65 | 1 | 0.65 | Credible UFC 1 finalist and combat-sport veteran, but not a modern Top-10-equivalent win. |
| 4 | 1994-03-11 | Jason DeLucia | 0.45 | 1 | 0.45 | Experienced early tournament opponent with useful but non-ranked UFC value. |
| 5 | 1994-03-11 | Patrick Smith | 0.45 | 1 | 0.45 | UFC 2 finalist and dangerous specialist, but limited established UFC quality at the time. |
| 6 | 1994-03-11 | Remco Pardoel | 0.45 | 1 | 0.45 | Legitimate tournament semifinalist with useful early-UFC value, not ranked-equivalent depth. |
| 7 | 1994-09-09 | Kimo Leopoldo | 0.25 | 0.75 | 0.19 | Dangerous and physically imposing, but essentially unproven in UFC terms entering the fight. |
| 8 | 1993-11-12 | Art Jimmerson | 0.1 | 0.75 | 0.07 | UFC debutant with essentially no established mixed-rules opponent-quality proof. |
| 9 | 1994-03-11 | Minoki Ichihara | 0.1 | 0.75 | 0.07 | UFC debutant with minimal established UFC opponent-quality proof. |
| 10 | 1994-12-16 | Keith Hackney | 0.1 | 0.75 | 0.07 | Memorable early-UFC name, but one novelty-style UFC win did not establish meaningful opponent-quality proof. |
| 11 | 1994-12-16 | Ron van Clief | 0.1 | 0.75 | 0.07 | Historic martial-arts name, but age and lack of established UFC value sharply limit credit. |

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

#### Loss-penalty receipts

The fight-level rules create raw loss events. The final category then compresses those events through severity, frequency, and a prime-loss volume floor. Exposure: **12** fights. Severity: **0**. Frequency: **0**. Prime-volume floor: **0**. Pre-division magnitude: **0**. Final penalty: **0**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Raw event penalty | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2006-05-27 | Matt Hughes | post-prime | champion-level | home | Yes | Yes | 0 | standard rule |

#### Division-strength context

Default division key: **early-openweight-0.80**. Era-ledger division multiplier: **0.9**. Division-era modifier: **-3**.

Jimmerson through Shamrock II.

#### Key judgment calls

- **Prime window:** Art Jimmerson → Ken Shamrock.
- **Coverage:** Complete UFC-only ledger through 2006-05-27. Tournament wins count as UFC wins but not official title-fight wins; Pride and other non-UFC fights excluded.
- **Loss endpoint:** The Shamrock draw closes Royce’s original UFC tournament-era dominance window.

#### Why ranked here

Royce Gracie ranks #52 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 42.17 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

#### Why not ranked higher?

Royce Gracie is 0.17 raw points behind #51 Dominick Cruz. The largest category separation versus that next target is currently Longevity; future movement must be earned through new UFC evidence and a full pipeline rerun.

#### Final takeaway

Royce Gracie ranks #52 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 42.17 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

_Source IDs: fighter ledger verified through 2026-07-13; score owner ranking-pipeline.js; category owner category-calculators.js._

### 53. Khamzat Chimaev — 88 OVR

Khamzat Chimaev is ranked from the current UFC-only calculated pipeline.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 40.84 | 9-1 | Middleweight / Welterweight | 1 | 1 | 4 | 5-1 | 72.2% | 4.08 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 1.96 | 35 | 2.29 |
| Opponent Quality | 13.86 | 25 | 11.55 |
| Prime Dominance | 19.61 | 30 | 19.61 |
| Longevity | 11.08 | 10 | 3.69 |

Base score: **37.14**. Modifiers: Apex **+5.17**, Loss Penalty **-1.89**, Division-Era Depth **+0.42**. Final raw score: **40.84**.

OVR conversion: board anchors **18.68–101.92**, normalized score **0.2662**, curved score **0.3247**, resulting in **88 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 1.96 | #53 | 0.95 adjusted credit / 14.54 benchmark |
| Opponent Quality | 13.86 | #50 | 6.51 diminished credit / 14.1 benchmark |
| Prime Dominance | 19.61 | #33 | 20.64 raw × 95.0% sample |
| Longevity | 11.08 | #42 | 53.16 counted elite months |
| Apex modifier | +5.17 | Modifier | First-round destruction of Whittaker followed by a dominant title win; the later Strickland loss prevents maximum Claim or Aura. |
| Loss penalty | -1.89 | Modifier | 1 official/technical loss events reviewed |
| Division-era depth | +0.42 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **1**. Adjusted title wins: **1**. Derived undisputed-title win count: **1**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final adjusted credit | Review note |
| --- | --- | --- | --- | --- | --- | --- |
| 2025-08-16 | Dricus du Plessis | normal | 1 | 0.95 | 0.95 | Current-table title win; subjective/current-era context. |

#### Opponent Quality receipts

Raw win credit: **6.75**. Diminishing-return credit before fighter adjustment: **6.51**. Fighter adjustment: **0**. Final diminished credit: **6.51**.

| Slot | Date | Opponent | Base/final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 2024-10-26 | Robert Whittaker | 1.25 | 1 | 1.25 | Elite champion-level middleweight contender. |
| 2 | 2025-08-16 | Dricus du Plessis | 1.25 | 1 | 1.25 | Elite UFC middleweight champion-level opponent in app timeline. |
| 3 | 2022-04-09 | Gilbert Burns | 1 | 1 | 1 | Elite welterweight contender. |
| 4 | 2023-10-21 | Kamaru Usman | 1 | 1 | 1 | All-time welterweight great moving up on short notice. |
| 5 | 2021-10-30 | Li Jingliang | 0.65 | 1 | 0.65 | Ranked welterweight veteran. |
| 6 | 2022-09-10 | Kevin Holland | 0.65 | 1 | 0.65 | Quality welterweight/middleweight name, short-notice context. |
| 7 | 2020-09-19 | Gerald Meerschaert | 0.45 | 0.75 | 0.34 | Solid UFC middleweight win. |
| 8 | 2020-07-15 | John Phillips | 0.25 | 0.75 | 0.19 | Low-end UFC quality value. |
| 9 | 2020-07-25 | Rhys McKee | 0.25 | 0.75 | 0.19 | Low-end UFC quality value. |

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

#### Loss-penalty receipts

The fight-level rules create raw loss events. The final category then compresses those events through severity, frequency, and a prime-loss volume floor. Exposure: **10** fights. Severity: **1.5**. Frequency: **0.45**. Prime-volume floor: **0.75**. Pre-division magnitude: **1.95**. Final penalty: **-1.89**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Raw event penalty | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2026-05-09 | Sean Strickland | prime | champion-level | home | No | Yes | -1.5 | standard rule |

#### Division-strength context

Default division key: **modern-middleweight-1.00**. Era-ledger division multiplier: **1.02**. Division-era modifier: **+0.42**.

Burns through current elite form.

#### Key judgment calls

- **Prime window:** Gilbert Burns → Current elite form.
- **Coverage:** Complete UFC-only ledger through UFC 328 on 2026-05-09. Non-UFC fights excluded.
- **Loss endpoint:** Burns proved elite UFC form. No unrecovered UFC elite-prime loss.

#### Why ranked here

Khamzat Chimaev ranks #53 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 40.84 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

#### Why not ranked higher?

Khamzat Chimaev is 1.33 raw points behind #52 Royce Gracie. The largest category separation versus that next target is currently Prime Dominance; future movement must be earned through new UFC evidence and a full pipeline rerun.

#### Final takeaway

Khamzat Chimaev ranks #53 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 40.84 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

_Source IDs: fighter ledger verified through 2026-07-13; score owner ranking-pipeline.js; category owner category-calculators.js._

### 54. Michael Bisping — 87 OVR

Michael Bisping is ranked from the current UFC-only calculated pipeline.

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

OVR conversion: board anchors **18.68–101.92**, normalized score **0.2309**, curved score **0.2877**, resulting in **87 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 3.61 | #48 | 1.75 adjusted credit / 14.54 benchmark |
| Opponent Quality | 19.36 | #32 | 9.1 diminished credit / 14.1 benchmark |
| Prime Dominance | 15.19 | #60 | 16.88 raw × 90.0% sample |
| Longevity | 4.24 | #60 | 20.36 counted elite months |
| Apex modifier | +3.77 | Modifier | Late-career title apex with Anderson/Rockhold proof. |
| Loss penalty | -2.92 | Modifier | 9 official/technical loss events reviewed |
| Division-era depth | +0.11 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **2**. Adjusted title wins: **1.75**. Derived undisputed-title win count: **2**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final adjusted credit | Review note |
| --- | --- | --- | --- | --- | --- | --- |
| 2016-06-04 | Luke Rockhold | normal | 1 | 1 | 1 | locked |
| 2016-10-08 | Dan Henderson | normal | 1 | 0.75 | 0.75 | Aged/late-career opponent title defense. |

#### Opponent Quality receipts

Raw win credit: **12**. Diminishing-return credit before fighter adjustment: **9.1**. Fighter adjustment: **0**. Final diminished credit: **9.1**.

| Slot | Date | Opponent | Base/final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 2016-06-04 | Luke Rockhold | 1.25 | 1 | 1.25 | UFC middleweight champion and elite title opponent. |
| 2 | 2007-09-08 | Matt Hamill | 0.85 | 1 | 0.85 | Strong ranked light-heavyweight win. |
| 3 | 2016-02-27 | Anderson Silva | 0.85 | 1 | 0.85 | All-time great name, late-career timing. |
| 4 | 2010-05-29 | Dan Miller | 0.65 | 1 | 0.65 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 5 | 2011-02-27 | Jorge Rivera | 0.65 | 1 | 0.65 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 6 | 2012-09-22 | Brian Stann | 0.65 | 1 | 0.65 | Quality middleweight win. |
| 7 | 2013-04-27 | Alan Belcher | 0.65 | 0.75 | 0.49 | Quality middleweight win. |
| 8 | 2015-04-25 | C.B. Dollaway | 0.65 | 0.75 | 0.49 | Ranked-quality middleweight win. |
| 9 | 2015-07-18 | Thales Leites | 0.65 | 0.75 | 0.49 | Ranked middleweight contender. |
| 10 | 2016-10-08 | Dan Henderson | 0.65 | 0.75 | 0.49 | Legend name, but aged timing. |
| 11 | 2006-06-24 | Josh Haynes | 0.45 | 0.75 | 0.34 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 12 | 2006-12-30 | Eric Schafer | 0.45 | 0.75 | 0.34 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 13 | 2007-04-21 | Elvis Sinosic | 0.45 | 0.5 | 0.23 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 14 | 2008-04-19 | Charles McCarthy | 0.45 | 0.5 | 0.23 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 15 | 2008-06-07 | Jason Day | 0.45 | 0.5 | 0.23 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 16 | 2008-10-18 | Chris Leben | 0.45 | 0.5 | 0.23 | Solid UFC middleweight win. |
| 17 | 2009-11-14 | Denis Kang | 0.45 | 0.5 | 0.23 | Solid UFC win. |
| 18 | 2010-10-16 | Yoshihiro Akiyama | 0.45 | 0.5 | 0.23 | Solid UFC middleweight win. |
| 19 | 2011-12-03 | Jason Miller | 0.45 | 0.25 | 0.11 | Solid UFC win. |
| 20 | 2014-08-23 | Cung Le | 0.45 | 0.25 | 0.11 | Name win with timing/context discount. |

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

#### Loss-penalty receipts

The fight-level rules create raw loss events. The final category then compresses those events through severity, frequency, and a prime-loss volume floor. Exposure: **28** fights. Severity: **1.88**. Frequency: **1.04**. Prime-volume floor: **1**. Pre-division magnitude: **2.92**. Final penalty: **-2.92**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Raw event penalty | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2007-11-17 | Rashad Evans | pre-prime | top-five | home | No | Yes | -0.75 | standard rule |
| 2009-07-11 | Dan Henderson | pre-prime | champion-level | home | Yes | Yes | -1.5 | standard rule |
| 2010-02-21 | Wanderlei Silva | pre-prime | top-five | home | No | Yes | -0.75 | standard rule |
| 2012-01-28 | Chael Sonnen | pre-prime | top-five | home | No | Yes | -0.75 | standard rule |
| 2013-01-19 | Vitor Belfort | pre-prime | champion-level | home | Yes | Yes | -1.5 | standard rule |
| 2014-04-16 | Tim Kennedy | pre-prime | top-five | home | No | Yes | -0.75 | standard rule |
| 2014-11-08 | Luke Rockhold | pre-prime | champion-level | home | Yes | Yes | -1.5 | standard rule |
| 2017-11-04 | Georges St-Pierre | prime | champion-level | home | Yes | Yes | -2.25 | standard rule |
| 2017-11-25 | Kelvin Gastelum | post-prime | top-five | home | Yes | Yes | 0 | standard rule |

#### Division-strength context

Default division key: **middleweight-0.95**. Era-ledger division multiplier: **0.96**. Division-era modifier: **+0.11**.

Anderson through GSP.

#### Key judgment calls

- **Prime window:** Anderson Silva → Georges St-Pierre.
- **Coverage:** Complete UFC-only ledger through 2017-11-25. TUF exhibition and non-UFC fights excluded.
- **Loss endpoint:** Short late title-prime. GSP closes it; Gastelum is post-prime quick-turnaround damage.

#### Why ranked here

Michael Bisping ranks #54 because Opponent Quality and Prime Dominance provide the largest weighted parts of a 37.9 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

#### Why not ranked higher?

Michael Bisping is 2.94 raw points behind #53 Khamzat Chimaev. The largest category separation versus that next target is currently Longevity; future movement must be earned through new UFC evidence and a full pipeline rerun.

#### Final takeaway

Michael Bisping ranks #54 because Opponent Quality and Prime Dominance provide the largest weighted parts of a 37.9 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

_Source IDs: fighter ledger verified through 2026-07-13; score owner ranking-pipeline.js; category owner category-calculators.js._

### 55. Sean O'Malley — 87 OVR

Sean O'Malley is ranked from the current UFC-only calculated pipeline.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 36.15 | 12-3, 1 NC | Bantamweight | 2 | 2 | 5 | 5-2 | 48.0% | 3.72 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 3.82 | 35 | 4.46 |
| Opponent Quality | 13.3 | 25 | 11.08 |
| Prime Dominance | 16.67 | 30 | 16.67 |
| Longevity | 9.78 | 10 | 3.26 |

Base score: **35.47**. Modifiers: Apex **+4.06**, Loss Penalty **-3.28**, Division-Era Depth **-0.1**. Final raw score: **36.15**.

OVR conversion: board anchors **18.68–101.92**, normalized score **0.2099**, curved score **0.2653**, resulting in **87 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 3.82 | #45 | 1.85 adjusted credit / 14.54 benchmark |
| Opponent Quality | 13.3 | #55 | 6.25 diminished credit / 14.1 benchmark |
| Prime Dominance | 16.67 | #53 | 16.67 raw × 100.0% sample |
| Longevity | 9.78 | #47 | 46.94 counted elite months |
| Apex modifier | +4.06 | Modifier | Explosive bantamweight title apex. |
| Loss penalty | -3.28 | Modifier | 3 official/technical loss events reviewed |
| Division-era depth | -0.1 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **2**. Adjusted title wins: **2**. Derived undisputed-title win count: **2**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final adjusted credit | Review note |
| --- | --- | --- | --- | --- | --- | --- |
| 2023-08-19 | Aljamain Sterling | normal | 1 | 1 | 1 | locked |
| 2024-03-09 | Marlon Vera | normal | 1 | 0.85 | 0.85 | locked |

#### Opponent Quality receipts

Raw win credit: **6.55**. Diminishing-return credit before fighter adjustment: **6.25**. Fighter adjustment: **0**. Final diminished credit: **6.25**.

| Slot | Date | Opponent | Base/final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 2023-08-19 | Aljamain Sterling | 1.25 | 1 | 1.25 | Knocked out the reigning UFC bantamweight champion to win the title. |
| 2 | 2022-10-22 | Petr Yan | 1.15 | 1 | 1.15 | Elite former champion; Cody-approved above standard top-five credit despite close decision context. |
| 3 | 2024-03-09 | Marlon Vera | 1 | 1 | 1 | Dominant UFC title defense over a ranked rival. |
| 4 | 2026-01-24 | Song Yadong | 0.85 | 1 | 0.85 | Strong ranked bantamweight rebound win, with close-decision context. |
| 5 | 2026-06-14 | Aiemann Zahabi | 0.65 | 1 | 0.65 | Ranked-quality rebound finish in the current app timeline. |
| 6 | 2021-12-11 | Raulian Paiva | 0.45 | 1 | 0.45 | Solid UFC bantamweight win. |
| 7 | 2018-03-03 | Andre Soukhamthath | 0.25 | 0.75 | 0.19 | Low-end UFC quality value. |
| 8 | 2020-03-07 | Jose Alberto Quinonez | 0.25 | 0.75 | 0.19 | Supporting UFC bantamweight win. |
| 9 | 2020-06-06 | Eddie Wineland | 0.25 | 0.75 | 0.19 | Veteran name with a heavy timing discount. |
| 10 | 2021-03-27 | Thomas Almeida | 0.25 | 0.75 | 0.19 | Former prospect name with faded timing. |
| 11 | 2017-12-01 | Terrion Ware | 0.1 | 0.75 | 0.07 | UFC debut win with minimal opponent-quality value. |
| 12 | 2021-07-10 | Kris Moutinho | 0.1 | 0.75 | 0.07 | Minimal UFC quality value. |

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

#### Loss-penalty receipts

The fight-level rules create raw loss events. The final category then compresses those events through severity, frequency, and a prime-loss volume floor. Exposure: **15** fights. Severity: **2.13**. Frequency: **1.15**. Prime-volume floor: **1.75**. Pre-division magnitude: **3.28**. Final penalty: **-3.28**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Raw event penalty | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2020-08-15 | Marlon Vera | pre-prime | top-ten | home | Yes | Yes | -2 | standard rule |
| 2024-09-14 | Merab Dvalishvili | prime | champion-level | home | No | Yes | -1.5 | standard rule |
| 2025-06-07 | Merab Dvalishvili | prime | champion-level | home | Yes | Yes | -2.25 | standard rule |

#### Division-strength context

Default division key: **modern-bantamweight-1.00**. Era-ledger division multiplier: **—**. Division-era modifier: **-0.1**.

No additional division note.

#### Key judgment calls

- **Prime window:** 2022-10-22 → active.
- **Coverage:** Complete UFC-only ledger through UFC Freedom 250 on 2026-06-14. Contender Series bout and other non-UFC fights excluded.
- **Loss endpoint:** Defined by the shared fighter-era ledger.

#### Why ranked here

Sean O'Malley ranks #55 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 36.15 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

#### Why not ranked higher?

Sean O'Malley is 1.75 raw points behind #54 Michael Bisping. The largest category separation versus that next target is currently Opponent Quality; future movement must be earned through new UFC evidence and a full pipeline rerun.

#### Final takeaway

Sean O'Malley ranks #55 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 36.15 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

_Source IDs: fighter ledger verified through 2026-07-13; score owner ranking-pipeline.js; category owner category-calculators.js._

### 56. Mauricio "Shogun" Rua — 86 OVR

Mauricio "Shogun" Rua is ranked from the current UFC-only calculated pipeline.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 33 | 11-12-1 | Light Heavyweight | 1 | 0.95 | 3 | 3-3 | 50.0% | 2.59 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 1.95 | 35 | 2.28 |
| Opponent Quality | 15.29 | 25 | 12.74 |
| Prime Dominance | 15.44 | 30 | 15.44 |
| Longevity | 6.85 | 10 | 2.28 |

Base score: **32.74**. Modifiers: Apex **+4.81**, Loss Penalty **-4.38**, Division-Era Depth **-0.17**. Final raw score: **33**.

OVR conversion: board anchors **18.68–101.92**, normalized score **0.1720**, curved score **0.2240**, resulting in **86 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 1.95 | #54 | 0.95 adjusted credit / 14.54 benchmark |
| Opponent Quality | 15.29 | #44 | 7.19 diminished credit / 14.1 benchmark |
| Prime Dominance | 15.44 | #58 | 16.25 raw × 95.0% sample |
| Longevity | 6.85 | #55 | 32.86 counted elite months |
| Apex modifier | +4.81 | Modifier | The Machida knockout carries the UFC-only peak; PRIDE accomplishments remain excluded. |
| Loss penalty | -4.38 | Modifier | 12 official/technical loss events reviewed |
| Division-era depth | -0.17 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **1**. Adjusted title wins: **0.95**. Derived undisputed-title win count: **1**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final adjusted credit | Review note |
| --- | --- | --- | --- | --- | --- | --- |
| 2010-05-08 | Lyoto Machida | normal | 1 | 0.95 | 0.95 | Approved aggregate Championship score recovered from the live control; exact historical per-fight split was not stored. |

#### Opponent Quality receipts

Raw win credit: **7.7**. Diminishing-return credit before fighter adjustment: **7.19**. Fighter adjustment: **0**. Final diminished credit: **7.19**.

| Slot | Date | Opponent | Base/final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 2009-04-18 | Chuck Liddell | 1.25 | 1 | 1.25 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 2 | 2010-05-08 | Lyoto Machida | 1.25 | 1 | 1.25 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 3 | 2011-08-27 | Forrest Griffin | 1 | 1 | 1 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 4 | 2015-08-01 | Antônio Rogério Nogueira | 0.85 | 1 | 0.85 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 5 | 2016-05-14 | Corey Anderson | 0.85 | 1 | 0.85 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 6 | 2012-08-04 | Brandon Vera | 0.45 | 1 | 0.45 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 7 | 2013-12-07 | James Te Huna | 0.45 | 0.75 | 0.34 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 8 | 2017-03-11 | Gian Villante | 0.45 | 0.75 | 0.34 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 9 | 2018-12-02 | Tyson Pedro | 0.45 | 0.75 | 0.34 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 10 | 2020-07-26 | Antônio Rogério Nogueira | 0.45 | 0.75 | 0.34 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 11 | 2009-01-17 | Mark Coleman | 0.25 | 0.75 | 0.19 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |

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

#### Loss-penalty receipts

The fight-level rules create raw loss events. The final category then compresses those events through severity, frequency, and a prime-loss volume floor. Exposure: **8** fights. Severity: **1.88**. Frequency: **2.5**. Prime-volume floor: **2.5**. Pre-division magnitude: **4.38**. Final penalty: **-4.38**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Raw event penalty | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2007-09-22 | Forrest Griffin | pre-prime | top-five | home | Yes | Yes | -1.5 | standard rule |
| 2009-10-24 | Lyoto Machida | prime | champion-level | home | No | Yes | -1.5 | standard rule |
| 2011-03-19 | Jon Jones | prime | champion-level | home | Yes | Yes | -2.25 | standard rule |
| 2011-11-19 | Dan Henderson | prime | champion-level | home | No | Yes | -1.5 | standard rule |
| 2012-12-08 | Alexander Gustafsson | post-prime | top-five | home | No | Yes | 0 | standard rule |
| 2013-08-17 | Chael Sonnen | post-prime | top-ten | home | Yes | Yes | 0 | standard rule |
| 2014-03-23 | Dan Henderson | post-prime | top-five | home | Yes | Yes | 0 | standard rule |
| 2014-11-08 | Ovince Saint Preux | post-prime | top-ten | home | Yes | Yes | 0 | standard rule |
| 2018-07-22 | Anthony Smith | post-prime | top-ten | home | Yes | Yes | 0 | standard rule |
| 2020-11-21 | Paul Craig | post-prime | top-ten | home | Yes | Yes | 0 | standard rule |
| 2022-05-07 | Ovince Saint Preux | post-prime | solid | home | No | Yes | 0 | standard rule |
| 2023-01-21 | Ihor Potieria | post-prime | minimal | home | Yes | Yes | 0 | standard rule |

#### Division-strength context

Default division key: **light-heavyweight-1.00**. Era-ledger division multiplier: **1**. Division-era modifier: **-0.17**.

Liddell through Henderson I.

#### Key judgment calls

- **Prime window:** Chuck Liddell → Dan Henderson.
- **Coverage:** Complete UFC-only ledger.
- **Loss endpoint:** Henderson closes Shogun’s concentrated UFC title-prime window.

#### Why ranked here

Mauricio "Shogun" Rua ranks #56 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 33 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

#### Why not ranked higher?

Mauricio "Shogun" Rua is 3.15 raw points behind #55 Sean O'Malley. The largest category separation versus that next target is currently Longevity; future movement must be earned through new UFC evidence and a full pipeline rerun.

#### Final takeaway

Mauricio "Shogun" Rua ranks #56 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 33 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

_Source IDs: fighter ledger verified through 2026-07-13; score owner ranking-pipeline.js; category owner category-calculators.js._

### 57. Forrest Griffin — 86 OVR

Forrest Griffin is ranked from the current UFC-only calculated pipeline.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 32.85 | 10-5 | Light Heavyweight | 1 | 0.95 | 3 | 4-3 | 63.2% | 3.93 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 1.95 | 35 | 2.28 |
| Opponent Quality | 13.78 | 25 | 11.48 |
| Prime Dominance | 15.59 | 30 | 15.59 |
| Longevity | 10.3 | 10 | 3.43 |

Base score: **32.78**. Modifiers: Apex **+4.98**, Loss Penalty **-4.29**, Division-Era Depth **-0.62**. Final raw score: **32.85**.

OVR conversion: board anchors **18.68–101.92**, normalized score **0.1702**, curved score **0.2220**, resulting in **86 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 1.95 | #54 | 0.95 adjusted credit / 14.54 benchmark |
| Opponent Quality | 13.78 | #51 | 6.47 diminished credit / 14.1 benchmark |
| Prime Dominance | 15.59 | #56 | 15.59 raw × 100.0% sample |
| Longevity | 10.3 | #45 | 49.46 counted elite months |
| Apex modifier | +4.98 | Modifier | Historic upset and championship win, with the close Jackson decision keeping the Apex below the highest tier. |
| Loss penalty | -4.29 | Modifier | 5 official/technical loss events reviewed |
| Division-era depth | -0.62 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **1**. Adjusted title wins: **0.95**. Derived undisputed-title win count: **1**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final adjusted credit | Review note |
| --- | --- | --- | --- | --- | --- | --- |
| 2008-07-05 | Quinton Jackson | normal | 1 | 0.95 | 0.95 | Approved aggregate Championship score recovered from the live control; exact historical per-fight split was not stored. |

#### Opponent Quality receipts

Raw win credit: **6.75**. Diminishing-return credit before fighter adjustment: **6.47**. Fighter adjustment: **0**. Final diminished credit: **6.47**.

| Slot | Date | Opponent | Base/final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 2007-09-22 | Mauricio Rua | 1.25 | 1 | 1.25 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 2 | 2008-07-05 | Quinton Jackson | 1.25 | 1 | 1.25 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 3 | 2011-02-05 | Rich Franklin | 1 | 1 | 1 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 4 | 2009-11-21 | Tito Ortiz | 0.85 | 1 | 0.85 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 5 | 2012-07-07 | Tito Ortiz | 0.85 | 1 | 0.85 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 6 | 2005-04-09 | Stephan Bonnar | 0.45 | 1 | 0.45 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 7 | 2005-10-07 | Elvis Sinosic | 0.45 | 0.75 | 0.34 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 8 | 2006-08-26 | Stephan Bonnar | 0.45 | 0.75 | 0.34 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 9 | 2005-06-04 | Bill Mahood | 0.1 | 0.75 | 0.07 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 10 | 2007-06-16 | Hector Ramirez | 0.1 | 0.75 | 0.07 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |

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

#### Loss-penalty receipts

The fight-level rules create raw loss events. The final category then compresses those events through severity, frequency, and a prime-loss volume floor. Exposure: **14** fights. Severity: **2.25**. Frequency: **2.04**. Prime-volume floor: **3**. Pre-division magnitude: **4.29**. Final penalty: **-4.29**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Raw event penalty | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2006-04-15 | Tito Ortiz | pre-prime | champion-level | home | No | Yes | -0.75 | standard rule |
| 2006-12-30 | Keith Jardine | pre-prime | top-ten | home | Yes | Yes | -2 | standard rule |
| 2008-12-27 | Rashad Evans | prime | champion-level | home | Yes | Yes | -2.25 | standard rule |
| 2009-08-08 | Anderson Silva | prime | champion-level | home | Yes | Yes | -2.25 | standard rule |
| 2011-08-27 | Mauricio Rua | prime | champion-level | home | Yes | Yes | -2.25 | standard rule |

#### Division-strength context

Default division key: **light-heavyweight-1.00**. Era-ledger division multiplier: **1**. Division-era modifier: **-0.62**.

Shogun I through Shogun II.

#### Key judgment calls

- **Prime window:** Mauricio Rua I → Mauricio Rua II.
- **Coverage:** Complete UFC-only ledger.
- **Loss endpoint:** The Shogun rematch closes Forrest’s UFC elite/title-level window.

#### Why ranked here

Forrest Griffin ranks #57 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 32.85 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

#### Why not ranked higher?

Forrest Griffin is 0.15 raw points behind #56 Mauricio "Shogun" Rua. The largest category separation versus that next target is currently Opponent Quality; future movement must be earned through new UFC evidence and a full pipeline rerun.

#### Final takeaway

Forrest Griffin ranks #57 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 32.85 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

_Source IDs: fighter ledger verified through 2026-07-13; score owner ranking-pipeline.js; category owner category-calculators.js._

### 58. Brock Lesnar — 86 OVR

Brock Lesnar is ranked from the current UFC-only calculated pipeline.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 31.86 | 4-3, 1 NC | Heavyweight | 3 | 2.4 | 3 | 3-1 | 57.1% | 1.94 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 5.67 | 35 | 6.62 |
| Opponent Quality | 8.3 | 25 | 6.92 |
| Prime Dominance | 18.57 | 30 | 18.57 |
| Longevity | 4.78 | 10 | 1.59 |

Base score: **33.7**. Modifiers: Apex **+4.18**, Loss Penalty **-3.76**, Division-Era Depth **-2.26**. Final raw score: **31.86**.

OVR conversion: board anchors **18.68–101.92**, normalized score **0.1583**, curved score **0.2088**, resulting in **86 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 5.67 | #37 | 2.75 adjusted credit / 14.54 benchmark |
| Opponent Quality | 8.3 | #60 | 3.9 diminished credit / 14.1 benchmark |
| Prime Dominance | 18.57 | #42 | 20.63 raw × 90.0% sample |
| Longevity | 4.78 | #57 | 22.92 counted elite months |
| Apex modifier | +4.18 | Modifier | Short heavyweight title apex with huge star aura. |
| Loss penalty | -3.76 | Modifier | 3 official/technical loss events reviewed |
| Division-era depth | -2.26 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **3**. Adjusted title wins: **2.4**. Derived undisputed-title win count: **3**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final adjusted credit | Review note |
| --- | --- | --- | --- | --- | --- | --- |
| 2008-11-15 | Randy Couture | normal | 1 | 0.85 | 0.85 | Aged smaller champion/opponent context. |
| 2009-07-11 | Frank Mir | normal | 1 | 0.95 | 0.95 | locked |
| 2010-07-03 | Shane Carwin | normal | 1 | 0.95 | 0.95 | locked |

#### Opponent Quality receipts

Raw win credit: **3.9**. Diminishing-return credit before fighter adjustment: **3.9**. Fighter adjustment: **0**. Final diminished credit: **3.9**.

| Slot | Date | Opponent | Base/final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 2008-11-15 | Randy Couture | 1.25 | 1 | 1.25 | UFC heavyweight champion and all-time name, age context noted. |
| 2 | 2009-07-11 | Frank Mir | 1 | 1 | 1 | Former UFC champion/interim champion rival. |
| 3 | 2010-07-03 | Shane Carwin | 1 | 1 | 1 | Undefeated interim champion and elite heavyweight contender. |
| 4 | 2008-08-09 | Heath Herring | 0.65 | 1 | 0.65 | Quality heavyweight veteran. |

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

#### Loss-penalty receipts

The fight-level rules create raw loss events. The final category then compresses those events through severity, frequency, and a prime-loss volume floor. Exposure: **6** fights. Severity: **1.88**. Frequency: **1.88**. Prime-volume floor: **1**. Pre-division magnitude: **3.76**. Final penalty: **-3.76**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Raw event penalty | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2008-02-02 | Frank Mir | pre-prime | top-five | home | Yes | Yes | -1.5 | standard rule |
| 2010-10-23 | Cain Velasquez | prime | champion-level | home | Yes | Yes | -2.25 | standard rule |
| 2011-12-30 | Alistair Overeem | post-prime | top-five | home | Yes | Yes | 0 | standard rule |

#### Division-strength context

Default division key: **ufc-heavyweight-0.96**. Era-ledger division multiplier: **0.95**. Division-era modifier: **-2.26**.

Couture through Cain.

#### Key judgment calls

- **Prime window:** Randy Couture → Cain Velasquez.
- **Coverage:** Complete UFC-only ledger through 2016-07-09. Mark Hunt result is an excluded no contest; non-UFC fights excluded.
- **Loss endpoint:** Cain closes it. Overeem is post-diverticulitis/post-prime context.

#### Why ranked here

Brock Lesnar ranks #58 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 31.86 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

#### Why not ranked higher?

Brock Lesnar is 0.99 raw points behind #57 Forrest Griffin. The largest category separation versus that next target is currently Longevity; future movement must be earned through new UFC evidence and a full pipeline rerun.

#### Final takeaway

Brock Lesnar ranks #58 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 31.86 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

_Source IDs: fighter ledger verified through 2026-07-13; score owner ranking-pipeline.js; category owner category-calculators.js._

### 59. Dan Henderson — 84 OVR

Dan Henderson is ranked from the current UFC-only calculated pipeline.

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

OVR conversion: board anchors **18.68–101.92**, normalized score **0.1024**, curved score **0.1441**, resulting in **84 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 0 | #59 | 0 adjusted credit / 14.54 benchmark |
| Opponent Quality | 13.64 | #53 | 6.41 diminished credit / 14.1 benchmark |
| Prime Dominance | 13.22 | #61 | 13.22 raw × 100.0% sample |
| Longevity | 9.63 | #48 | 46.2 counted elite months |
| Apex modifier | +4.47 | Modifier | The Bisping knockout creates elite Aura, but the UFC-only run never established Henderson as the clear best fighter in a division. |
| Loss penalty | -4.5 | Modifier | 9 official/technical loss events reviewed |
| Division-era depth | -0.57 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **0**. Adjusted title wins: **0**. Derived undisputed-title win count: **0**. Interim-title win count: **0**.

_No rows._

#### Opponent Quality receipts

Raw win credit: **6.8**. Diminishing-return credit before fighter adjustment: **6.41**. Fighter adjustment: **0**. Final diminished credit: **6.41**.

| Slot | Date | Opponent | Base/final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 2011-11-19 | Mauricio Rua | 1 | 1 | 1 | Elite former UFC champion in classic contender fight. |
| 2 | 1998-05-15 | Allan Goes | 0.85 | 1 | 0.85 | Strong early UFC tournament-era opponent. |
| 3 | 1998-05-15 | Carlos Newton | 0.85 | 1 | 0.85 | Strong early UFC tournament-era opponent. |
| 4 | 2009-01-17 | Rich Franklin | 0.85 | 1 | 0.85 | Former UFC champion and strong contender. |
| 5 | 2009-07-11 | Michael Bisping | 0.85 | 1 | 0.85 | Strong ranked middleweight contender. |
| 6 | 2014-03-23 | Mauricio Rua | 0.85 | 1 | 0.85 | Repeat win over elite name, later-career context. |
| 7 | 2008-09-06 | Rousimar Palhares | 0.65 | 0.75 | 0.49 | Quality middleweight win. |
| 8 | 2015-06-06 | Tim Boetsch | 0.45 | 0.75 | 0.34 | Solid UFC middleweight win. |
| 9 | 2016-06-04 | Hector Lombard | 0.45 | 0.75 | 0.34 | Name win with timing/context discount. |

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

| From | To | Raw months | Counted months | Reason |
| --- | --- | --- | --- | --- |
| 2009-07-11 | 2011-11-19 | 28.29 | 18 | Between-fight gap capped at 18 months |

#### Loss-penalty receipts

The fight-level rules create raw loss events. The final category then compresses those events through severity, frequency, and a prime-loss volume floor. Exposure: **13** fights. Severity: **2.25**. Frequency: **2.25**. Prime-volume floor: **3.5**. Pre-division magnitude: **4.5**. Final penalty: **-4.5**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Raw event penalty | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2007-09-08 | Quinton Jackson | pre-prime | champion-level | home | No | Yes | -0.75 | standard rule |
| 2008-03-01 | Anderson Silva | pre-prime | champion-level | home | Yes | Yes | -1.5 | standard rule |
| 2013-02-23 | Lyoto Machida | prime | top-five | home | No | Yes | -1.5 | standard rule |
| 2013-06-15 | Rashad Evans | prime | top-five | home | No | Yes | -1.5 | standard rule |
| 2013-11-09 | Vitor Belfort | prime | champion-level | home | Yes | Yes | -2.25 | standard rule |
| 2014-05-24 | Daniel Cormier | prime | champion-level | home | Yes | Yes | -2.25 | standard rule |
| 2015-01-24 | Gegard Mousasi | post-prime | top-five | home | Yes | Yes | 0 | standard rule |
| 2015-11-07 | Vitor Belfort | post-prime | top-five | home | Yes | Yes | 0 | standard rule |
| 2016-10-08 | Michael Bisping | post-prime | champion-level | home | No | Yes | 0 | standard rule |

#### Division-strength context

Default division key: **mixed-middleweight-light-heavyweight-0.96**. Era-ledger division multiplier: **0.98**. Division-era modifier: **-0.57**.

Bisping through Cormier.

#### Key judgment calls

- **Prime window:** Michael Bisping → Daniel Cormier.
- **Coverage:** Complete UFC-only ledger through 2016-10-08. Pride, Strikeforce, Rings, and other non-UFC fights excluded.
- **Loss endpoint:** UFC-only excludes Pride. Bisping starts late UFC elite window; Cormier closes it.

#### Why ranked here

Dan Henderson ranks #59 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 27.2 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

#### Why not ranked higher?

Dan Henderson is 4.66 raw points behind #58 Brock Lesnar. The largest category separation versus that next target is currently Championship; future movement must be earned through new UFC evidence and a full pipeline rerun.

#### Final takeaway

Dan Henderson ranks #59 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 27.2 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

_Source IDs: fighter ledger verified through 2026-07-13; score owner ranking-pipeline.js; category owner category-calculators.js._

### 60. Chael Sonnen — 84 OVR

Chael Sonnen is ranked from the current UFC-only calculated pipeline.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| men | 23.58 | 7-7 | Middleweight / Light Heavyweight | 0 | 0 | 4 | 5-2 | 85.7% | 3.12 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 0 | 35 | 0 |
| Opponent Quality | 9.87 | 25 | 8.23 |
| Prime Dominance | 15.2 | 30 | 15.2 |
| Longevity | 7.72 | 10 | 2.57 |

Base score: **26**. Modifiers: Apex **+3.44**, Loss Penalty **-4.75**, Division-Era Depth **-1.11**. Final raw score: **23.58**.

OVR conversion: board anchors **18.68–101.92**, normalized score **0.0589**, curved score **0.0900**, resulting in **84 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 0 | #59 | 0 adjusted credit / 14.54 benchmark |
| Opponent Quality | 9.87 | #58 | 4.64 diminished credit / 14.1 benchmark |
| Prime Dominance | 15.2 | #59 | 16 raw × 95.0% sample |
| Longevity | 7.72 | #54 | 37.06 counted elite months |
| Apex modifier | +3.44 | Modifier | Elite middleweight challenger apex. |
| Loss penalty | -4.75 | Modifier | 7 official/technical loss events reviewed |
| Division-era depth | -1.11 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **0**. Adjusted title wins: **0**. Derived undisputed-title win count: **0**. Interim-title win count: **0**.

_No rows._

#### Opponent Quality receipts

Raw win credit: **4.75**. Diminishing-return credit before fighter adjustment: **4.64**. Fighter adjustment: **0**. Final diminished credit: **4.64**.

| Slot | Date | Opponent | Base/final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 2009-10-24 | Yushin Okami | 0.85 | 1 | 0.85 | Strong ranked middleweight contender. |
| 2 | 2010-02-06 | Nate Marquardt | 0.85 | 1 | 0.85 | Strong ranked middleweight contender. |
| 3 | 2012-01-28 | Michael Bisping | 0.85 | 1 | 0.85 | Strong middleweight contender, close fight context. |
| 4 | 2011-10-08 | Brian Stann | 0.65 | 1 | 0.65 | Quality middleweight win. |
| 5 | 2013-08-17 | Mauricio Rua | 0.65 | 1 | 0.65 | Former UFC champion name, late-career/light-heavyweight context. |
| 6 | 2006-04-06 | Trevor Prangley | 0.45 | 1 | 0.45 | Solid UFC win. |
| 7 | 2009-05-23 | Dan Miller | 0.45 | 0.75 | 0.34 | Solid UFC middleweight win. |

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

#### Loss-penalty receipts

The fight-level rules create raw loss events. The final category then compresses those events through severity, frequency, and a prime-loss volume floor. Exposure: **12** fights. Severity: **2.25**. Frequency: **2.5**. Prime-volume floor: **3**. Pre-division magnitude: **4.75**. Final penalty: **-4.75**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Raw event penalty | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2005-10-07 | Renato Sobral | pre-prime | top-ten | home | Yes | Yes | -2 | standard rule |
| 2006-05-27 | Jeremy Horn | pre-prime | top-ten | home | Yes | Yes | -2 | standard rule |
| 2009-02-21 | Demian Maia | pre-prime | top-five | home | Yes | Yes | -1.5 | standard rule |
| 2010-08-07 | Anderson Silva | prime | champion-level | home | Yes | Yes | -2.25 | standard rule |
| 2012-07-07 | Anderson Silva | prime | champion-level | home | Yes | Yes | -2.25 | standard rule |
| 2013-04-27 | Jon Jones | prime | champion-level | upward | Yes | Yes | -1.25 | prime-upward-elite |
| 2013-11-16 | Rashad Evans | post-prime | top-five | home | Yes | Yes | 0 | standard rule |

#### Division-strength context

Default division key: **middleweight-0.95**. Era-ledger division multiplier: **0.96**. Division-era modifier: **-1.11**.

Marquardt through Jones.

#### Key judgment calls

- **Prime window:** Nate Marquardt → Jon Jones.
- **Coverage:** Complete UFC-only ledger through 2013-11-16. WEC, Bellator, and other non-UFC fights excluded.
- **Loss endpoint:** Anderson I/II do not end it because Sonnen stayed title-level and moved up to Jones. Jones closes it.

#### Why ranked here

Chael Sonnen ranks #60 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 23.58 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

#### Why not ranked higher?

Chael Sonnen is 3.62 raw points behind #59 Dan Henderson. The largest category separation versus that next target is currently Opponent Quality; future movement must be earned through new UFC evidence and a full pipeline rerun.

#### Final takeaway

Chael Sonnen ranks #60 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 23.58 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

_Source IDs: fighter ledger verified through 2026-07-13; score owner ranking-pipeline.js; category owner category-calculators.js._

### 61. Paddy Pimblett — 84 OVR

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

OVR conversion: board anchors **18.68–101.92**, normalized score **0.0578**, curved score **0.0886**, resulting in **84 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 0 | #59 | 0 adjusted credit / 14.54 benchmark |
| Opponent Quality | 3.4 | #61 | 1.65 diminished credit / 14.54 benchmark |
| Prime Dominance | 16.6 | #54 | 19.53 raw × 85.0% sample |
| Longevity | 5.55 | #56 | 26.63 counted elite months |
| Apex modifier | +3.16 | Modifier | Explosive modern-lightweight finishing peak, but without championship proof. |
| Loss penalty | -1.7 | Modifier | 1 official/technical loss events reviewed |
| Division-era depth | +0.75 | Modifier | Apply the positive modern-lightweight depth adjustment. |

#### Championship receipts

UFC title-fight wins: **0**. Adjusted title wins: **0**. Derived undisputed-title win count: **0**. Interim-title win count: **0**.

_No rows._

#### Opponent Quality receipts

Raw win credit: **1.65**. Diminishing-return credit before fighter adjustment: **1.65**. Fighter adjustment: **0**. Final diminished credit: **1.65**.

| Slot | Date | Opponent | Base/final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | — | Benoit Saint Denis | 0.85 | 1 | 0.85 | locked |
| 2 | — | Michael Chandler | 0.45 | 1 | 0.45 | locked |
| 3 | — | King Green | 0.35 | 1 | 0.35 | locked |

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

#### Loss-penalty receipts

The fight-level rules create raw loss events. The final category then compresses those events through severity, frequency, and a prime-loss volume floor. Exposure: **9** fights. Severity: **1.5**. Frequency: **0.5**. Prime-volume floor: **0.75**. Pre-division magnitude: **2**. Final penalty: **-1.7**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Raw event penalty | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2026-01-24 | Justin Gaethje | prime | champion-level | home | No | Yes | -1.5 | standard rule |

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

_Source IDs: fighter ledger verified through 2026-07-15; score owner ranking-pipeline.js; category owner category-calculators.js._

### 1. Amanda Nunes — 99 OVR

Amanda Nunes is ranked from the current UFC-only calculated pipeline.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| women | 80.47 | 16-2 | Bantamweight / Featherweight | 11 | 11.25 | 11 | 12-1 | 87.5% | 7.26 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 20.74 | 35 | 24.2 |
| Opponent Quality | 25.85 | 25 | 21.54 |
| Prime Dominance | 25.7 | 30 | 25.7 |
| Longevity | 19.49 | 10 | 6.5 |

Base score: **77.94**. Modifiers: Apex **+6**, Loss Penalty **-2.51**, Division-Era Depth **-0.96**. Final raw score: **80.47**.

OVR conversion: board anchors **25.78–80.79**, normalized score **0.9942**, curved score **0.9951**, resulting in **99 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 20.74 | #1 | 10.05 adjusted credit / 14.54 benchmark |
| Opponent Quality | 25.85 | #1 | 12.15 diminished credit / 14.1 benchmark |
| Prime Dominance | 25.7 | #1 | 25.7 raw × 100.0% sample |
| Longevity | 19.49 | #3 | 93.54 counted elite months |
| Apex modifier | +6 | Modifier | Women’s UFC apex benchmark: violent, historic, unmistakable. |
| Loss penalty | -2.51 | Modifier | 2 official/technical loss events reviewed |
| Division-era depth | -0.96 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **11**. Adjusted title wins: **11.25**. Derived undisputed-title win count: **11**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final adjusted credit | Review note |
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

| Slot | Date | Opponent | Base/final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 2016-03-05 | Valentina Shevchenko | 1.25 | 1 | 1.25 | Elite champion-level opponent and future flyweight great. |
| 2 | 2016-07-09 | Miesha Tate | 1.25 | 1 | 1.25 | UFC bantamweight champion. |
| 3 | 2016-12-30 | Ronda Rousey | 1.25 | 1 | 1.25 | Former dominant UFC bantamweight champion. |
| 4 | 2018-12-29 | Cris Cyborg | 1.25 | 1 | 1.25 | Elite UFC featherweight champion and all-time great. |
| 5 | 2019-07-06 | Holly Holm | 1.15 | 1 | 1.15 | Former UFC bantamweight champion, slightly timing-adjusted. |
| 6 | 2017-09-09 | Valentina Shevchenko | 1 | 1 | 1 | Elite future champion, earlier UFC version. |
| 7 | 2022-07-30 | Julianna Peña | 1 | 0.75 | 0.75 | Current champion rematch win. |
| 8 | 2023-06-10 | Irene Aldana | 1 | 0.75 | 0.75 | Top-five bantamweight title challenger. |
| 9 | 2013-11-06 | Germaine de Randamie | 0.85 | 0.75 | 0.64 | Strong ranked bantamweight contender. |
| 10 | 2015-08-08 | Sara McMann | 0.85 | 0.75 | 0.64 | Olympic medalist and ranked contender. |
| 11 | 2018-05-12 | Raquel Pennington | 0.85 | 0.75 | 0.64 | Ranked bantamweight title challenger. |
| 12 | 2019-12-14 | Germaine de Randamie | 0.65 | 0.75 | 0.49 | Early UFC win over future elite contender. |
| 13 | 2020-06-06 | Felicia Spencer | 0.65 | 0.5 | 0.33 | Ranked featherweight challenger. |
| 14 | 2021-03-06 | Megan Anderson | 0.65 | 0.5 | 0.33 | Featherweight challenger in thin division context. |
| 15 | 2013-08-03 | Sheila Gaff | 0.45 | 0.5 | 0.23 | Approved supporting UFC win treatment. |
| 16 | 2015-03-21 | Shayna Baszler | 0.45 | 0.5 | 0.23 | Name-value UFC win. |

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

#### Loss-penalty receipts

The fight-level rules create raw loss events. The final category then compresses those events through severity, frequency, and a prime-loss volume floor. Exposure: **18** fights. Severity: **1.88**. Frequency: **0.63**. Prime-volume floor: **1**. Pre-division magnitude: **2.51**. Final penalty: **-2.51**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Raw event penalty | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2014-09-27 | Cat Zingano | pre-prime | top-five | home | Yes | Yes | -1.5 | standard rule |
| 2021-12-11 | Julianna Peña | prime | top-five | home | Yes | Yes | -2.25 | standard rule |

#### Division-strength context

Default division key: **women-bantamweight-featherweight-0.90**. Era-ledger division multiplier: **0.98**. Division-era modifier: **-0.96**.

Tate through Aldana.

#### Key judgment calls

- **Prime window:** Miesha Tate → Irene Aldana.
- **Coverage:** Complete UFC-only ledger through 2023-06-10. Strikeforce and other non-UFC fights excluded.
- **Loss endpoint:** Peña I did not end it because Nunes avenged it. Aldana retirement win closes prime on a win.

#### Why ranked here

Amanda Nunes ranks #1 because Prime Dominance and Championship provide the largest weighted parts of a 80.47 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

#### Why not ranked lower?

Jones is the current benchmark. The main pressure points are close decisions, inactivity, and late-career heavyweight sample size, but no fighter currently passes his total UFC-only model score.

#### Final takeaway

Amanda Nunes ranks #1 because Prime Dominance and Championship provide the largest weighted parts of a 80.47 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

_Source IDs: fighter ledger verified through 2026-07-13; score owner ranking-pipeline.js; category owner category-calculators.js._

### 2. Valentina Shevchenko — 98 OVR

Valentina Shevchenko is ranked from the current UFC-only calculated pipeline.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| women | 79.33 | 15-3-1 | Flyweight / Bantamweight | 11 | 10.9 | 10 | 14-2-1 | 80.4% | 9.97 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 20.74 | 35 | 24.2 |
| Opponent Quality | 25.4 | 25 | 21.17 |
| Prime Dominance | 22.97 | 30 | 22.97 |
| Longevity | 26.77 | 10 | 8.92 |

Base score: **77.26**. Modifiers: Apex **+5.19**, Loss Penalty **-2.59**, Division-Era Depth **-0.53**. Final raw score: **79.33**.

OVR conversion: board anchors **25.78–80.79**, normalized score **0.9735**, curved score **0.9774**, resulting in **98 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 20.74 | #1 | 10.05 adjusted credit / 14.54 benchmark |
| Opponent Quality | 25.4 | #2 | 11.94 diminished credit / 14.1 benchmark |
| Prime Dominance | 22.97 | #2 | 22.97 raw × 100.0% sample |
| Longevity | 26.77 | #1 | 128.5 counted elite months |
| Apex modifier | +5.19 | Modifier | Two dominant defenses inside the locked window support a stronger Best-Fighter Claim while keeping Aura below the maximum tier. |
| Loss penalty | -2.59 | Modifier | 3 official/technical loss events reviewed |
| Division-era depth | -0.53 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **11**. Adjusted title wins: **10.9**. Derived undisputed-title win count: **11**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final adjusted credit | Review note |
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

| Slot | Date | Opponent | Base/final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 2018-12-08 | Joanna Jedrzejczyk | 1.25 | 1 | 1.25 | Elite UFC strawweight champion moving up. |
| 2 | 2024-09-14 | Alexa Grasso | 1.25 | 1 | 1.25 | Elite UFC flyweight champion rematch/trilogy win. |
| 3 | 2025-11-15 | Zhang Weili | 1.25 | 1 | 1.25 | Elite reigning strawweight champion moving up. |
| 4 | 2021-04-24 | Jessica Andrade | 1.15 | 1 | 1.15 | Former UFC strawweight champion and elite contender moving up. |
| 5 | 2016-07-23 | Holly Holm | 1 | 1 | 1 | Former UFC bantamweight champion. |
| 6 | 2019-06-08 | Jessica Eye | 1 | 1 | 1 | Top-five flyweight title challenger. |
| 7 | 2020-02-08 | Katlyn Chookagian | 1 | 0.75 | 0.75 | Top flyweight title challenger. |
| 8 | 2022-06-11 | Taila Santos | 1 | 0.75 | 0.75 | Elite flyweight title challenger; close fight context. |
| 9 | 2025-05-10 | Manon Fiorot | 1 | 0.75 | 0.75 | Top-five flyweight title challenger. |
| 10 | 2019-08-10 | Liz Carmouche | 0.85 | 0.75 | 0.64 | Ranked flyweight title challenger and rivalry context. |
| 11 | 2020-11-21 | Jennifer Maia | 0.85 | 0.75 | 0.64 | Ranked flyweight title challenger. |
| 12 | 2021-09-25 | Lauren Murphy | 0.85 | 0.75 | 0.64 | Ranked flyweight title challenger. |
| 13 | 2015-12-19 | Sarah Kaufman | 0.65 | 0.5 | 0.33 | Former champion name in UFC debut context. |
| 14 | 2017-01-28 | Julianna Peña | 0.65 | 0.5 | 0.33 | Future UFC champion, earlier bantamweight version. |
| 15 | 2018-02-03 | Priscila Cachoeira | 0.45 | 0.5 | 0.23 | Solid UFC flyweight win. |

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

#### Loss-penalty receipts

The fight-level rules create raw loss events. The final category then compresses those events through severity, frequency, and a prime-loss volume floor. Exposure: **19** fights. Severity: **1.88**. Frequency: **0.71**. Prime-volume floor: **1.75**. Pre-division magnitude: **2.59**. Final penalty: **-2.59**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Raw event penalty | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2016-03-05 | Amanda Nunes | pre-prime | champion-level | home | No | Yes | -0.75 | standard rule |
| 2017-09-09 | Amanda Nunes | prime | champion-level | home | No | Yes | -1.5 | standard rule |
| 2023-03-04 | Alexa Grasso | prime | top-five | home | Yes | Yes | -2.25 | standard rule |

#### Division-strength context

Default division key: **women-flyweight-0.90**. Era-ledger division multiplier: **0.95**. Division-era modifier: **-0.53**.

Holm through current title-level form.

#### Key judgment calls

- **Prime window:** Holly Holm → Current title-level form.
- **Coverage:** Complete UFC-only ledger through 2025-11-15. Non-UFC fights excluded.
- **Loss endpoint:** Nunes II did not end it because Shevchenko moved to flyweight and became champion. Grasso did not close it because she stayed title-level.

#### Why ranked here

Valentina Shevchenko ranks #2 because Championship and Prime Dominance provide the largest weighted parts of a 79.33 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

#### Why not ranked higher?

Valentina Shevchenko is 1.14 raw points behind #1 Amanda Nunes. The largest category separation versus that next target is currently Prime Dominance; future movement must be earned through new UFC evidence and a full pipeline rerun.

#### Final takeaway

Valentina Shevchenko ranks #2 because Championship and Prime Dominance provide the largest weighted parts of a 79.33 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

_Source IDs: fighter ledger verified through 2026-07-13; score owner ranking-pipeline.js; category owner category-calculators.js._

### 3. Zhang Weili — 92 OVR

Zhang Weili is ranked from the current UFC-only calculated pipeline.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| women | 56.64 | 10-3 | Strawweight / Flyweight | 6 | 6 | 7 | 7-3 | 66.7% | 6.87 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 11.66 | 35 | 13.6 |
| Opponent Quality | 17.98 | 25 | 14.98 |
| Prime Dominance | 19.85 | 30 | 19.85 |
| Longevity | 19.23 | 10 | 6.41 |

Base score: **54.84**. Modifiers: Apex **+4.85**, Loss Penalty **-2.92**, Division-Era Depth **-0.13**. Final raw score: **56.64**.

OVR conversion: board anchors **25.78–80.79**, normalized score **0.5610**, curved score **0.6118**, resulting in **92 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 11.66 | #3 | 5.65 adjusted credit / 14.54 benchmark |
| Opponent Quality | 17.98 | #5 | 8.45 diminished credit / 14.1 benchmark |
| Prime Dominance | 19.85 | #6 | 19.85 raw × 100.0% sample |
| Longevity | 19.23 | #4 | 92.29 counted elite months |
| Apex modifier | +4.85 | Modifier | Lemos and Suarez capture the complete second-reign version of Zhang. The Rose losses and failed upward-division title challenge cap the clean best-fighter claim and aura. |
| Loss penalty | -2.92 | Modifier | 3 official/technical loss events reviewed |
| Division-era depth | -0.13 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **6**. Adjusted title wins: **6**. Derived undisputed-title win count: **6**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final adjusted credit | Review note |
| --- | --- | --- | --- | --- | --- | --- |
| 2019-08-31 | Jessica Andrade | normal | 1 | 1 | 1 | locked |
| 2020-03-07 | Joanna Jedrzejczyk | normal | 1 | 0.95 | 0.95 | locked |
| 2022-11-12 | Carla Esparza | normal | 1 | 0.95 | 0.95 | locked |
| 2023-08-19 | Amanda Lemos | normal | 1 | 0.9 | 0.9 | locked |
| 2024-04-13 | Yan Xiaonan | normal | 1 | 0.9 | 0.9 | locked |
| 2025-02-09 | Tatiana Suarez | normal | 1 | 0.95 | 0.95 | Cody-approved undisputed title defense over an elite challenger. |

#### Opponent Quality receipts

Raw win credit: **9.05**. Diminishing-return credit before fighter adjustment: **8.45**. Fighter adjustment: **0**. Final diminished credit: **8.45**.

| Slot | Date | Opponent | Base/final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 2019-08-31 | Jessica Andrade | 1.25 | 1 | 1.25 | UFC strawweight champion. |
| 2 | 2020-03-07 | Joanna Jedrzejczyk | 1.25 | 1 | 1.25 | Elite former strawweight champion in all-time title fight. |
| 3 | 2022-06-11 | Joanna Jedrzejczyk | 1.15 | 1 | 1.15 | Repeat win over elite former champion, timing-adjusted. |
| 4 | 2023-08-19 | Amanda Lemos | 1 | 1 | 1 | Ranked strawweight title challenger. |
| 5 | 2024-04-13 | Yan Xiaonan | 1 | 1 | 1 | Top strawweight title challenger. |
| 6 | 2025-02-09 | Tatiana Suarez | 1 | 1 | 1 | Top-five strawweight title challenger. |
| 7 | 2019-03-02 | Tecia Torres | 0.85 | 0.75 | 0.64 | Strong ranked strawweight contender. |
| 8 | 2022-11-12 | Carla Esparza | 0.85 | 0.75 | 0.64 | Former UFC strawweight champion. |
| 9 | 2018-11-24 | Jessica Aguilar | 0.45 | 0.75 | 0.34 | Veteran strawweight name, timing-adjusted. |
| 10 | 2018-08-04 | Danielle Taylor | 0.25 | 0.75 | 0.19 | Low-end UFC quality value. |

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

#### Loss-penalty receipts

The fight-level rules create raw loss events. The final category then compresses those events through severity, frequency, and a prime-loss volume floor. Exposure: **13** fights. Severity: **1.88**. Frequency: **1.04**. Prime-volume floor: **2.5**. Pre-division magnitude: **2.92**. Final penalty: **-2.92**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Raw event penalty | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2021-04-24 | Rose Namajunas | prime | champion-level | home | Yes | Yes | -2.25 | standard rule |
| 2021-11-06 | Rose Namajunas | prime | champion-level | home | No | Yes | -1.5 | standard rule |
| 2025-11-15 | Valentina Shevchenko | prime | champion-level | upward | No | Yes | -0.75 | prime-upward-elite |

#### Division-strength context

Default division key: **modern-women-strawweight-0.95**. Era-ledger division multiplier: **1**. Division-era modifier: **-0.13**.

Andrade through current championship form.

#### Key judgment calls

- **Prime window:** Jessica Andrade → Current championship form.
- **Coverage:** Complete UFC-only ledger through 2025-11-15. Non-UFC fights excluded.
- **Loss endpoint:** Rose losses did not end window because Zhang recovered and rebuilt into championship form.

#### Why ranked here

Zhang Weili ranks #3 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 56.64 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

#### Why not ranked higher?

Zhang Weili is 22.69 raw points behind #2 Valentina Shevchenko. The largest category separation versus that next target is currently Championship; future movement must be earned through new UFC evidence and a full pipeline rerun.

#### Final takeaway

Zhang Weili ranks #3 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 56.64 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

_Source IDs: fighter ledger verified through 2026-07-13; score owner ranking-pipeline.js; category owner category-calculators.js._

### 4. Joanna Jedrzejczyk — 91 OVR

Joanna Jedrzejczyk is ranked from the current UFC-only calculated pipeline.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| women | 50.15 | 10-5 | Strawweight / Flyweight | 6 | 6 | 5 | 9-4 | 67.3% | 5.23 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 11.24 | 35 | 13.11 |
| Opponent Quality | 17.34 | 25 | 14.45 |
| Prime Dominance | 18.27 | 30 | 18.27 |
| Longevity | 13.58 | 10 | 4.53 |

Base score: **50.36**. Modifiers: Apex **+5.04**, Loss Penalty **-3.25**, Division-Era Depth **-2**. Final raw score: **50.15**.

OVR conversion: board anchors **25.78–80.79**, normalized score **0.4430**, curved score **0.5006**, resulting in **91 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 11.24 | #4 | 5.45 adjusted credit / 14.54 benchmark |
| Opponent Quality | 17.34 | #6 | 8.15 diminished credit / 14.1 benchmark |
| Prime Dominance | 18.27 | #8 | 18.27 raw × 100.0% sample |
| Longevity | 13.58 | #8 | 65.18 counted elite months |
| Apex modifier | +5.04 | Modifier | A dominant title win and elite adversity performance establish strong Proof and a legitimate best-fighter claim. |
| Loss penalty | -3.25 | Modifier | 5 official/technical loss events reviewed |
| Division-era depth | -2 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **6**. Adjusted title wins: **6**. Derived undisputed-title win count: **6**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final adjusted credit | Review note |
| --- | --- | --- | --- | --- | --- | --- |
| 2015-03-14 | Carla Esparza | normal | 1 | 0.95 | 0.95 | locked |
| 2015-06-20 | Jessica Penne | normal | 1 | 0.85 | 0.85 | locked |
| 2015-11-14 | Valerie Letourneau | normal | 1 | 0.85 | 0.85 | locked |
| 2016-07-08 | Claudia Gadelha | normal | 1 | 0.95 | 0.95 | locked |
| 2016-11-12 | Karolina Kowalkiewicz | normal | 1 | 0.9 | 0.9 | locked |
| 2017-05-13 | Jessica Andrade | normal | 1 | 0.95 | 0.95 | locked |

#### Opponent Quality receipts

Raw win credit: **8.8**. Diminishing-return credit before fighter adjustment: **8.15**. Fighter adjustment: **0**. Final diminished credit: **8.15**.

| Slot | Date | Opponent | Base/final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 2014-12-13 | Claudia Gadelha | 1.25 | 1 | 1.25 | Elite strawweight title challenger and defining rival. |
| 2 | 2015-03-14 | Carla Esparza | 1.25 | 1 | 1.25 | UFC strawweight champion. |
| 3 | 2016-07-08 | Claudia Gadelha | 1 | 1 | 1 | Elite strawweight contender, close first fight context. |
| 4 | 2017-05-13 | Jessica Andrade | 1 | 1 | 1 | Elite strawweight title challenger and future champion. |
| 5 | 2016-11-12 | Karolina Kowalkiewicz | 0.85 | 1 | 0.85 | Strong strawweight title challenger. |
| 6 | 2018-07-28 | Tecia Torres | 0.85 | 1 | 0.85 | Strong ranked strawweight contender. |
| 7 | 2019-10-12 | Michelle Waterson | 0.85 | 0.75 | 0.64 | Ranked strawweight contender. |
| 8 | 2015-06-20 | Jessica Penne | 0.65 | 0.75 | 0.49 | Ranked title challenger in early strawweight era. |
| 9 | 2015-11-14 | Valerie Letourneau | 0.65 | 0.75 | 0.49 | Ranked title challenger. |
| 10 | 2014-07-26 | Juliana Lima | 0.45 | 0.75 | 0.34 | Approved supporting UFC win treatment. |

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

#### Loss-penalty receipts

The fight-level rules create raw loss events. The final category then compresses those events through severity, frequency, and a prime-loss volume floor. Exposure: **14** fights. Severity: **1.88**. Frequency: **1.29**. Prime-volume floor: **3.25**. Pre-division magnitude: **3.25**. Final penalty: **-3.25**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Raw event penalty | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2017-11-04 | Rose Namajunas | prime | champion-level | home | Yes | Yes | -2.25 | standard rule |
| 2018-04-07 | Rose Namajunas | prime | champion-level | home | No | Yes | -1.5 | standard rule |
| 2018-12-08 | Valentina Shevchenko | prime | champion-level | upward | No | Yes | -0.75 | prime-upward-elite |
| 2020-03-07 | Zhang Weili | prime | champion-level | home | No | Yes | -1.5 | standard rule |
| 2022-06-11 | Zhang Weili | post-prime | champion-level | home | Yes | Yes | 0 | standard rule |

#### Division-strength context

Default division key: **women-strawweight-0.92**. Era-ledger division multiplier: **1**. Division-era modifier: **-2**.

Esparza through Zhang I.

#### Key judgment calls

- **Prime window:** Carla Esparza → Zhang Weili I.
- **Coverage:** Complete UFC-only ledger through retirement fight at UFC 275 on 2022-06-11. Non-UFC fights excluded.
- **Loss endpoint:** Rose losses did not end window because Joanna remained elite and fought Zhang in a title-level war. Zhang I is endpoint.

#### Why ranked here

Joanna Jedrzejczyk ranks #4 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 50.15 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

#### Why not ranked higher?

Joanna Jedrzejczyk is 6.49 raw points behind #3 Zhang Weili. The largest category separation versus that next target is currently Longevity; future movement must be earned through new UFC evidence and a full pipeline rerun.

#### Final takeaway

Joanna Jedrzejczyk ranks #4 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 50.15 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

_Source IDs: fighter ledger verified through 2026-07-13; score owner ranking-pipeline.js; category owner category-calculators.js._

### 5. Rose Namajunas — 90 OVR

Rose Namajunas is ranked from the current UFC-only calculated pipeline.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| women | 49.13 | 12-7 | Strawweight / Flyweight | 4 | 4 | 5 | 5-2 | 59.1% | 4.5 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 8.05 | 35 | 9.39 |
| Opponent Quality | 20.27 | 25 | 16.89 |
| Prime Dominance | 17.84 | 30 | 17.84 |
| Longevity | 12.15 | 10 | 4.05 |

Base score: **48.17**. Modifiers: Apex **+5.08**, Loss Penalty **-3.38**, Division-Era Depth **-0.74**. Final raw score: **49.13**.

OVR conversion: board anchors **25.78–80.79**, normalized score **0.4245**, curved score **0.4827**, resulting in **90 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 8.05 | #6 | 3.9 adjusted credit / 14.54 benchmark |
| Opponent Quality | 20.27 | #4 | 9.53 diminished credit / 14.1 benchmark |
| Prime Dominance | 17.84 | #9 | 17.84 raw × 100.0% sample |
| Longevity | 12.15 | #9 | 58.32 counted elite months |
| Apex modifier | +5.08 | Modifier | Back-to-back wins over an all-time champion provide exceptional Proof; later inconsistency limits Claim and Aura. |
| Loss penalty | -3.38 | Modifier | 7 official/technical loss events reviewed |
| Division-era depth | -0.74 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **4**. Adjusted title wins: **4**. Derived undisputed-title win count: **4**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final adjusted credit | Review note |
| --- | --- | --- | --- | --- | --- | --- |
| 2017-11-04 | Joanna Jedrzejczyk | normal | 1 | 1 | 1 | locked |
| 2018-04-07 | Joanna Jedrzejczyk | normal | 1 | 0.95 | 0.95 | locked |
| 2021-04-24 | Zhang Weili | normal | 1 | 1 | 1 | locked |
| 2021-11-06 | Zhang Weili | normal | 1 | 0.95 | 0.95 | locked |

#### Opponent Quality receipts

Raw win credit: **10.5**. Diminishing-return credit before fighter adjustment: **9.53**. Fighter adjustment: **0**. Final diminished credit: **9.53**.

| Slot | Date | Opponent | Base/final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 2017-11-04 | Joanna Jedrzejczyk | 1.25 | 1 | 1.25 | Elite UFC strawweight champion. |
| 2 | 2018-04-07 | Joanna Jedrzejczyk | 1.25 | 1 | 1.25 | Immediate repeat over elite champion-level opponent. |
| 3 | 2021-04-24 | Zhang Weili | 1.25 | 1 | 1.25 | Elite UFC strawweight champion. |
| 4 | 2020-07-12 | Jessica Andrade | 1 | 1 | 1 | Former UFC strawweight champion rematch win. |
| 5 | 2021-11-06 | Zhang Weili | 1 | 1 | 1 | Elite champion-level rematch win, close-fight context. |
| 6 | 2015-12-10 | Paige VanZant | 0.85 | 1 | 0.85 | Ranked strawweight contender at the time. |
| 7 | 2024-07-13 | Tracy Cortez | 0.85 | 0.75 | 0.64 | Strong ranked flyweight win. |
| 8 | 2025-06-14 | Miranda Maverick | 0.85 | 0.75 | 0.64 | Strong ranked flyweight win. |
| 9 | 2016-04-16 | Tecia Torres | 0.65 | 0.75 | 0.49 | Quality strawweight contender. |
| 10 | 2017-04-15 | Michelle Waterson | 0.65 | 0.75 | 0.49 | Quality strawweight contender. |
| 11 | 2015-10-03 | Angela Hill | 0.45 | 0.75 | 0.34 | Solid UFC strawweight win. |
| 12 | 2024-03-23 | Amanda Ribas | 0.45 | 0.75 | 0.34 | Solid flyweight/strawweight name, timing context. |

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

#### Loss-penalty receipts

The fight-level rules create raw loss events. The final category then compresses those events through severity, frequency, and a prime-loss volume floor. Exposure: **13** fights. Severity: **1.88**. Frequency: **1.5**. Prime-volume floor: **1.75**. Pre-division magnitude: **3.38**. Final penalty: **-3.38**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Raw event penalty | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2014-12-12 | Carla Esparza | pre-prime | top-five | home | Yes | Yes | -1.5 | standard rule |
| 2016-07-30 | Karolina Kowalkiewicz | pre-prime | top-ten | home | No | Yes | -1.25 | standard rule |
| 2019-05-11 | Jessica Andrade | prime | top-five | home | Yes | Yes | -2.25 | standard rule |
| 2022-05-07 | Carla Esparza | prime | top-five | home | No | Yes | -1.5 | standard rule |
| 2023-09-02 | Manon Fiorot | post-prime | top-five | home | No | Yes | 0 | standard rule |
| 2024-11-02 | Erin Blanchfield | post-prime | top-five | home | No | Yes | 0 | standard rule |
| 2026-01-24 | Natalia Silva | post-prime | top-five | home | No | Yes | 0 | standard rule |

#### Division-strength context

Default division key: **women-strawweight-0.95**. Era-ledger division multiplier: **1**. Division-era modifier: **-0.74**.

Joanna I through Carla II. Andrade was recovered; Carla closes window.

#### Key judgment calls

- **Prime window:** Joanna Jedrzejczyk I → Carla Esparza II.
- **Coverage:** Complete UFC-only ledger through UFC 324 on 2026-01-24. Invicta and exhibition fights excluded.
- **Loss endpoint:** Andrade was recovered. Carla ends the elite-prime window per Cody call.

#### Why ranked here

Rose Namajunas ranks #5 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 49.13 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

#### Why not ranked higher?

Rose Namajunas is 1.02 raw points behind #4 Joanna Jedrzejczyk. The largest category separation versus that next target is currently Championship; future movement must be earned through new UFC evidence and a full pipeline rerun.

#### Final takeaway

Rose Namajunas ranks #5 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 49.13 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

_Source IDs: fighter ledger verified through 2026-07-13; score owner ranking-pipeline.js; category owner category-calculators.js._

### 6. Ronda Rousey — 89 OVR

Ronda Rousey is ranked from the current UFC-only calculated pipeline.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| women | 45.49 | 6-2 | Bantamweight | 6 | 6 | 4 | 6-2 | 72.7% | 3.85 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 10.83 | 35 | 12.64 |
| Opponent Quality | 11.06 | 25 | 9.22 |
| Prime Dominance | 22.2 | 30 | 22.2 |
| Longevity | 8.22 | 10 | 2.74 |

Base score: **46.8**. Modifiers: Apex **+5.2**, Loss Penalty **-3.94**, Division-Era Depth **-2.57**. Final raw score: **45.49**.

OVR conversion: board anchors **25.78–80.79**, normalized score **0.3583**, curved score **0.4179**, resulting in **89 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 10.83 | #5 | 5.25 adjusted credit / 14.54 benchmark |
| Opponent Quality | 11.06 | #11 | 5.2 diminished credit / 14.1 benchmark |
| Prime Dominance | 22.2 | #4 | 22.2 raw × 100.0% sample |
| Longevity | 8.22 | #12 | 39.44 counted elite months |
| Apex modifier | +5.2 | Modifier | Historic women’s bantamweight aura apex. |
| Loss penalty | -3.94 | Modifier | 2 official/technical loss events reviewed |
| Division-era depth | -2.57 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **6**. Adjusted title wins: **6**. Derived undisputed-title win count: **6**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final adjusted credit | Review note |
| --- | --- | --- | --- | --- | --- | --- |
| 2013-02-23 | Liz Carmouche | normal | 1 | 0.85 | 0.85 | locked |
| 2013-12-28 | Miesha Tate | normal | 1 | 0.9 | 0.9 | locked |
| 2014-02-22 | Sara McMann | normal | 1 | 0.9 | 0.9 | locked |
| 2014-07-05 | Alexis Davis | normal | 1 | 0.9 | 0.9 | locked |
| 2015-02-28 | Cat Zingano | normal | 1 | 0.95 | 0.95 | locked |
| 2015-08-01 | Bethe Correia | normal | 1 | 0.75 | 0.75 | Clearly soft title opponent floor. |

#### Opponent Quality receipts

Raw win credit: **5.2**. Diminishing-return credit before fighter adjustment: **5.2**. Fighter adjustment: **0**. Final diminished credit: **5.2**.

| Slot | Date | Opponent | Base/final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 2013-12-28 | Miesha Tate | 1 | 1 | 1 | Elite bantamweight rival and future UFC champion. |
| 2 | 2014-02-22 | Sara McMann | 1 | 1 | 1 | Olympic medalist and top bantamweight title challenger. |
| 3 | 2013-02-23 | Liz Carmouche | 0.85 | 1 | 0.85 | Ranked inaugural UFC bantamweight title challenger. |
| 4 | 2014-07-05 | Alexis Davis | 0.85 | 1 | 0.85 | Ranked bantamweight title challenger. |
| 5 | 2015-02-28 | Cat Zingano | 0.85 | 1 | 0.85 | Undefeated top bantamweight contender. |
| 6 | 2015-08-01 | Bethe Correia | 0.65 | 1 | 0.65 | Undefeated title challenger, softer contender context. |

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

#### Loss-penalty receipts

The fight-level rules create raw loss events. The final category then compresses those events through severity, frequency, and a prime-loss volume floor. Exposure: **8** fights. Severity: **2.25**. Frequency: **1.69**. Prime-volume floor: **2**. Pre-division magnitude: **3.94**. Final penalty: **-3.94**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Raw event penalty | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2015-11-15 | Holly Holm | prime | champion-level | home | Yes | Yes | -2.25 | standard rule |
| 2016-12-30 | Amanda Nunes | prime | champion-level | home | Yes | Yes | -2.25 | standard rule |

#### Division-strength context

Default division key: **early-women-bantamweight-0.80**. Era-ledger division multiplier: **0.95**. Division-era modifier: **-2.57**.

Tate II through Nunes.

#### Key judgment calls

- **Prime window:** Miesha Tate II → Amanda Nunes.
- **Coverage:** Complete UFC-only ledger through 2016-12-30. Strikeforce and other non-UFC fights excluded.
- **Loss endpoint:** Holm did not end it alone because Rousey returned directly into another title fight. Nunes is endpoint.

#### Why ranked here

Ronda Rousey ranks #6 because Prime Dominance and Championship provide the largest weighted parts of a 45.49 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

#### Why not ranked higher?

Ronda Rousey is 3.64 raw points behind #5 Rose Namajunas. The largest category separation versus that next target is currently Opponent Quality; future movement must be earned through new UFC evidence and a full pipeline rerun.

#### Final takeaway

Ronda Rousey ranks #6 because Prime Dominance and Championship provide the largest weighted parts of a 45.49 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

_Source IDs: fighter ledger verified through 2026-07-13; score owner ranking-pipeline.js; category owner category-calculators.js._

### 7. Jessica Andrade — 89 OVR

Jessica Andrade is ranked from the current UFC-only calculated pipeline.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| women | 43.78 | 17-13 | Strawweight / Flyweight / Bantamweight | 1 | 1 | 7 | 6-4 | 52.9% | 4.45 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 1.96 | 35 | 2.29 |
| Opponent Quality | 22.45 | 25 | 18.71 |
| Prime Dominance | 18.56 | 30 | 18.56 |
| Longevity | 13.65 | 10 | 4.55 |

Base score: **44.11**. Modifiers: Apex **+4.1**, Loss Penalty **-4.08**, Division-Era Depth **-0.35**. Final raw score: **43.78**.

OVR conversion: board anchors **25.78–80.79**, normalized score **0.3272**, curved score **0.3869**, resulting in **89 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 1.96 | #13 | 0.95 adjusted credit / 14.54 benchmark |
| Opponent Quality | 22.45 | #3 | 10.55 diminished credit / 14.1 benchmark |
| Prime Dominance | 18.56 | #7 | 18.56 raw × 100.0% sample |
| Longevity | 13.65 | #7 | 65.54 counted elite months |
| Apex modifier | +4.1 | Modifier | Multi-division power apex with Claudia/Rose proof. |
| Loss penalty | -4.08 | Modifier | 13 official/technical loss events reviewed |
| Division-era depth | -0.35 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **1**. Adjusted title wins: **1**. Derived undisputed-title win count: **1**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final adjusted credit | Review note |
| --- | --- | --- | --- | --- | --- | --- |
| 2019-05-11 | Rose Namajunas | normal | 1 | 0.95 | 0.95 | locked |

#### Opponent Quality receipts

Raw win credit: **12.95**. Diminishing-return credit before fighter adjustment: **10.55**. Fighter adjustment: **0**. Final diminished credit: **10.55**.

| Slot | Date | Opponent | Base/final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 2019-05-11 | Rose Namajunas | 1.25 | 1 | 1.25 | UFC strawweight champion and elite title opponent. |
| 2 | 2017-09-23 | Claudia Gadelha | 1 | 1 | 1 | Elite strawweight contender. |
| 3 | 2022-04-23 | Amanda Lemos | 1 | 1 | 1 | Elite strawweight contender. |
| 4 | 2014-03-15 | Raquel Pennington | 0.85 | 1 | 0.85 | Strong ranked bantamweight win. |
| 5 | 2016-09-10 | Joanne Calderwood | 0.85 | 1 | 0.85 | Strong ranked flyweight win. |
| 6 | 2018-09-08 | Karolina Kowalkiewicz | 0.85 | 1 | 0.85 | Former strawweight title challenger. |
| 7 | 2020-10-18 | Katlyn Chookagian | 0.85 | 0.75 | 0.64 | Ranked flyweight contender. |
| 8 | 2021-09-25 | Cynthia Calvillo | 0.85 | 0.75 | 0.64 | Strong ranked flyweight win. |
| 9 | 2023-11-11 | Mackenzie Dern | 0.85 | 0.75 | 0.64 | Strong ranked strawweight contender. |
| 10 | 2024-04-13 | Marina Rodriguez | 0.85 | 0.75 | 0.64 | Strong ranked strawweight contender. |
| 11 | 2017-02-04 | Angela Hill | 0.65 | 0.75 | 0.49 | Quality strawweight veteran. |
| 12 | 2018-02-24 | Tecia Torres | 0.65 | 0.75 | 0.49 | Quality strawweight contender. |
| 13 | 2023-01-21 | Lauren Murphy | 0.65 | 0.5 | 0.33 | Ranked flyweight veteran. |
| 14 | 2013-10-26 | Rosi Sexton | 0.45 | 0.5 | 0.23 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 15 | 2014-09-13 | Larissa Pacheco | 0.45 | 0.5 | 0.23 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 16 | 2015-07-15 | Sarah Moras | 0.45 | 0.5 | 0.23 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 17 | 2016-06-04 | Jessica Penne | 0.45 | 0.5 | 0.23 | Former title challenger, timing-adjusted. |

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

#### Loss-penalty receipts

The fight-level rules create raw loss events. The final category then compresses those events through severity, frequency, and a prime-loss volume floor. Exposure: **23** fights. Severity: **2.25**. Frequency: **1.83**. Prime-volume floor: **3.75**. Pre-division magnitude: **4.08**. Final penalty: **-4.08**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Raw event penalty | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2013-07-27 | Liz Carmouche | pre-prime | top-ten | home | Yes | Yes | -2 | standard rule |
| 2015-02-22 | Marion Reneau | pre-prime | top-ten | home | Yes | Yes | -2 | standard rule |
| 2015-09-05 | Raquel Pennington | pre-prime | top-ten | home | Yes | Yes | -2 | standard rule |
| 2017-05-13 | Joanna Jedrzejczyk | pre-prime | champion-level | home | No | Yes | -0.75 | standard rule |
| 2019-08-31 | Zhang Weili | prime | champion-level | home | Yes | Yes | -2.25 | standard rule |
| 2020-07-12 | Rose Namajunas | prime | champion-level | home | No | Yes | -1.5 | standard rule |
| 2021-04-24 | Valentina Shevchenko | prime | champion-level | upward | Yes | Yes | -1.25 | prime-upward-elite |
| 2023-02-18 | Erin Blanchfield | prime | top-five | home | Yes | Yes | -2.25 | standard rule |
| 2023-05-06 | Yan Xiaonan | post-prime | top-five | home | Yes | Yes | 0 | standard rule |
| 2023-08-05 | Tatiana Suarez | post-prime | top-five | home | Yes | Yes | 0 | standard rule |
| 2024-09-07 | Natalia Silva | post-prime | top-five | home | No | Yes | 0 | standard rule |
| 2025-05-10 | Jasmine Jasudavicius | post-prime | top-ten | home | Yes | Yes | 0 | standard rule |
| 2025-08-16 | Loopy Godinez | post-prime | top-ten | home | No | Yes | 0 | standard rule |

#### Division-strength context

Default division key: **women-three-division-0.92**. Era-ledger division multiplier: **0.99**. Division-era modifier: **-0.35**.

Claudia through Blanchfield.

#### Key judgment calls

- **Prime window:** Claudia Gadelha → Erin Blanchfield.
- **Coverage:** Complete UFC-only ledger through UFC 319 on 2025-08-16. Non-UFC fights excluded.
- **Loss endpoint:** Zhang and Valentina losses did not end it because Andrade recovered and stayed elite across divisions. Blanchfield begins decline endpoint.

#### Why ranked here

Jessica Andrade ranks #7 because Opponent Quality and Prime Dominance provide the largest weighted parts of a 43.78 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

#### Why not ranked higher?

Jessica Andrade is 1.71 raw points behind #6 Ronda Rousey. The largest category separation versus that next target is currently Championship; future movement must be earned through new UFC evidence and a full pipeline rerun.

#### Final takeaway

Jessica Andrade ranks #7 because Opponent Quality and Prime Dominance provide the largest weighted parts of a 43.78 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

_Source IDs: fighter ledger verified through 2026-07-13; score owner ranking-pipeline.js; category owner category-calculators.js._

### 8. Cris Cyborg — 87 OVR

Cris Cyborg is ranked from the current UFC-only calculated pipeline.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| women | 39.03 | 5-1 | Featherweight / Catchweight | 3 | 2.9 | 1 | 5-1 | 84.6% | 2.63 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 4.8 | 35 | 5.6 |
| Opponent Quality | 9.04 | 25 | 7.53 |
| Prime Dominance | 22.39 | 30 | 22.39 |
| Longevity | 6.86 | 10 | 2.29 |

Base score: **37.81**. Modifiers: Apex **+4.6**, Loss Penalty **-3.38**, Division-Era Depth **0**. Final raw score: **39.03**.

OVR conversion: board anchors **25.78–80.79**, normalized score **0.2409**, curved score **0.2982**, resulting in **87 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 4.8 | #7 | 2.33 adjusted credit / 14.54 benchmark |
| Opponent Quality | 9.04 | #14 | 4.25 diminished credit / 14.1 benchmark |
| Prime Dominance | 22.39 | #3 | 23.57 raw × 95.0% sample |
| Longevity | 6.86 | #13 | 32.92 counted elite months |
| Apex modifier | +4.6 | Modifier | Champion aura and proof, capped by division depth and only one elite UFC opponent. |
| Loss penalty | -3.38 | Modifier | 1 official/technical loss events reviewed |
| Division-era depth | 0 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **3**. Adjusted title wins: **2.9**. Derived undisputed-title win count: **3**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final adjusted credit | Review note |
| --- | --- | --- | --- | --- | --- | --- |
| 2017-07-29 | Tonya Evinger | vacant-undisputed | 0.9 | 0.83 | 0.75 | Approved aggregate Championship score recovered from the live control; exact historical per-fight split was not stored. |
| 2017-12-30 | Holly Holm | normal | 1 | 0.9 | 0.9 | Approved aggregate Championship score recovered from the live control; exact historical per-fight split was not stored. |
| 2018-03-03 | Yana Kunitskaya | normal | 1 | 0.68 | 0.68 | Approved aggregate Championship score recovered from the live control; exact historical per-fight split was not stored. |

#### Opponent Quality receipts

Raw win credit: **4.25**. Diminishing-return credit before fighter adjustment: **4.25**. Fighter adjustment: **0**. Final diminished credit: **4.25**.

| Slot | Date | Opponent | Base/final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 2017-12-30 | Holly Holm | 1.25 | 1 | 1.25 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 2 | 2016-05-14 | Leslie Smith | 0.85 | 1 | 0.85 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 3 | 2017-07-29 | Tonya Evinger | 0.85 | 1 | 0.85 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 4 | 2018-03-03 | Yana Kunitskaya | 0.85 | 1 | 0.85 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 5 | 2016-09-24 | Lina Lansberg | 0.45 | 1 | 0.45 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |

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

#### Loss-penalty receipts

The fight-level rules create raw loss events. The final category then compresses those events through severity, frequency, and a prime-loss volume floor. Exposure: **6** fights. Severity: **2.25**. Frequency: **1.13**. Prime-volume floor: **1**. Pre-division magnitude: **3.38**. Final penalty: **-3.38**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Raw event penalty | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2018-12-29 | Amanda Nunes | prime | champion-level | home | Yes | Yes | -2.25 | standard rule |

#### Division-strength context

Default division key: **women-featherweight-0.80**. Era-ledger division multiplier: **0.95**. Division-era modifier: **0**.

Smith through Nunes.

#### Key judgment calls

- **Prime window:** Leslie Smith → Amanda Nunes.
- **Coverage:** Complete UFC-only ledger through 2018-12-29. Strikeforce, Invicta, Bellator, PFL, and other non-UFC fights excluded.
- **Loss endpoint:** Nunes is the unrecovered UFC prime-ending title loss.

#### Why ranked here

Cris Cyborg ranks #8 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 39.03 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

#### Why not ranked higher?

Cris Cyborg is 4.75 raw points behind #7 Jessica Andrade. The largest category separation versus that next target is currently Opponent Quality; future movement must be earned through new UFC evidence and a full pipeline rerun.

#### Final takeaway

Cris Cyborg ranks #8 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 39.03 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

_Source IDs: fighter ledger verified through 2026-07-13; score owner ranking-pipeline.js; category owner category-calculators.js._

### 9. Carla Esparza — 87 OVR

Carla Esparza is ranked from the current UFC-only calculated pipeline.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| women | 37.64 | 10-6 | Strawweight | 2 | 1.9 | 5 | 6-1 | 61.9% | 3.55 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 3.43 | 35 | 4 |
| Opponent Quality | 15.85 | 25 | 13.21 |
| Prime Dominance | 16.58 | 30 | 16.58 |
| Longevity | 20.19 | 10 | 6.73 |

Base score: **40.52**. Modifiers: Apex **+3.92**, Loss Penalty **-5.58**, Division-Era Depth **-1.22**. Final raw score: **37.64**.

OVR conversion: board anchors **25.78–80.79**, normalized score **0.2156**, curved score **0.2714**, resulting in **87 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 3.43 | #9 | 1.66 adjusted credit / 14.54 benchmark |
| Opponent Quality | 15.85 | #7 | 7.45 diminished credit / 14.1 benchmark |
| Prime Dominance | 16.58 | #11 | 16.58 raw × 100.0% sample |
| Longevity | 20.19 | #2 | 96.9 counted elite months |
| Apex modifier | +3.92 | Modifier | A late-career elite finish and championship upset form a compliant Apex, with the low-action title win limiting performance strength and Aura. |
| Loss penalty | -5.58 | Modifier | 6 official/technical loss events reviewed |
| Division-era depth | -1.22 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **2**. Adjusted title wins: **1.9**. Derived undisputed-title win count: **2**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final adjusted credit | Review note |
| --- | --- | --- | --- | --- | --- | --- |
| 2014-12-12 | Rose Namajunas | vacant-undisputed | 0.9 | 0.9 | 0.81 | locked |
| 2022-05-07 | Rose Namajunas | normal | 1 | 0.85 | 0.85 | Low-output/weird title win context. |

#### Opponent Quality receipts

Raw win credit: **8**. Diminishing-return credit before fighter adjustment: **7.45**. Fighter adjustment: **0**. Final diminished credit: **7.45**.

| Slot | Date | Opponent | Base/final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 2014-12-12 | Rose Namajunas | 1.25 | 1 | 1.25 | Elite UFC strawweight champion. |
| 2 | 2020-07-26 | Marina Rodriguez | 1 | 1 | 1 | Top-five strawweight contender. |
| 3 | 2022-05-07 | Rose Namajunas | 1 | 1 | 1 | Future champion in inaugural title context. |
| 4 | 2017-12-30 | Cynthia Calvillo | 0.85 | 1 | 0.85 | Strong ranked strawweight win. |
| 5 | 2020-05-09 | Michelle Waterson | 0.85 | 1 | 0.85 | Strong ranked strawweight contender. |
| 6 | 2021-05-22 | Yan Xiaonan | 0.85 | 1 | 0.85 | Strong ranked strawweight contender. |
| 7 | 2019-04-27 | Virna Jandiroba | 0.65 | 0.75 | 0.49 | Quality strawweight contender. |
| 8 | 2019-09-21 | Alexa Grasso | 0.65 | 0.75 | 0.49 | Early win over future champion. |
| 9 | 2016-04-23 | Juliana Lima | 0.45 | 0.75 | 0.34 | Approved supporting UFC win treatment. |
| 10 | 2017-06-25 | Maryna Moroz | 0.45 | 0.75 | 0.34 | Approved supporting UFC win treatment. |

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

#### Loss-penalty receipts

The fight-level rules create raw loss events. The final category then compresses those events through severity, frequency, and a prime-loss volume floor. Exposure: **15** fights. Severity: **3.13**. Frequency: **2.45**. Prime-volume floor: **4.5**. Pre-division magnitude: **5.58**. Final penalty: **-5.58**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Raw event penalty | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2015-03-14 | Joanna Jedrzejczyk | prime | champion-level | home | Yes | Yes | -2.25 | standard rule |
| 2017-02-19 | Randa Markos | prime | solid | home | No | Yes | -4 | standard rule |
| 2018-06-09 | Claudia Gadelha | prime | top-five | home | No | Yes | -1.5 | standard rule |
| 2018-09-08 | Tatiana Suarez | prime | top-five | home | Yes | Yes | -2.25 | standard rule |
| 2022-11-12 | Zhang Weili | prime | champion-level | home | Yes | Yes | -2.25 | standard rule |
| 2024-10-05 | Tecia Pennington | post-prime | top-ten | home | No | Yes | 0 | standard rule |

#### Division-strength context

Default division key: **women-strawweight-0.90**. Era-ledger division multiplier: **1**. Division-era modifier: **-1.22**.

Rose I through Zhang with long gaps capped.

#### Key judgment calls

- **Prime window:** Rose Namajunas I → Zhang Weili.
- **Coverage:** Complete UFC-only ledger through retirement fight at UFC 307 on 2024-10-05. Invicta and other non-UFC fights excluded.
- **Loss endpoint:** Joanna did not permanently close window because Esparza rebuilt to win title again. Zhang closes it.

#### Why ranked here

Carla Esparza ranks #9 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 37.64 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

#### Why not ranked higher?

Carla Esparza is 1.39 raw points behind #8 Cris Cyborg. The largest category separation versus that next target is currently Prime Dominance; future movement must be earned through new UFC evidence and a full pipeline rerun.

#### Final takeaway

Carla Esparza ranks #9 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 37.64 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

_Source IDs: fighter ledger verified through 2026-07-13; score owner ranking-pipeline.js; category owner category-calculators.js._

### 10. Alexa Grasso — 86 OVR

Alexa Grasso is ranked from the current UFC-only calculated pipeline.

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

OVR conversion: board anchors **25.78–80.79**, normalized score **0.2036**, curved score **0.2585**, resulting in **86 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 2.06 | #10 | 1 adjusted credit / 14.54 benchmark |
| Opponent Quality | 13.32 | #9 | 6.26 diminished credit / 14.1 benchmark |
| Prime Dominance | 16.89 | #10 | 16.89 raw × 100.0% sample |
| Longevity | 14.13 | #6 | 67.82 counted elite months |
| Apex modifier | +4.5 | Modifier | A strong five-round contender win followed by the championship submission creates a compliant, title-winning Apex. |
| Loss penalty | -2.8 | Modifier | 5 official/technical loss events reviewed |
| Division-era depth | +0.18 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **1**. Adjusted title wins: **1**. Derived undisputed-title win count: **1**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final adjusted credit | Review note |
| --- | --- | --- | --- | --- | --- | --- |
| 2023-03-04 | Valentina Shevchenko | normal | 1 | 1 | 1 | locked |

#### Opponent Quality receipts

Raw win credit: **6.6**. Diminishing-return credit before fighter adjustment: **6.26**. Fighter adjustment: **0**. Final diminished credit: **6.26**.

| Slot | Date | Opponent | Base/final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 2023-03-04 | Valentina Shevchenko | 1.25 | 1 | 1.25 | Elite UFC flyweight champion. |
| 2 | 2026-03-28 | Maycee Barber | 1 | 1 | 1 | Top-five flyweight rematch win. |
| 3 | 2021-02-13 | Maycee Barber | 0.85 | 1 | 0.85 | Strong ranked flyweight contender. |
| 4 | 2022-10-15 | Viviane Araujo | 0.85 | 1 | 0.85 | Ranked flyweight contender. |
| 5 | 2019-06-08 | Karolina Kowalkiewicz | 0.65 | 1 | 0.65 | Former title challenger, later-career timing. |
| 6 | 2022-03-26 | Joanne Wood | 0.65 | 1 | 0.65 | Ranked flyweight/strawweight veteran. |
| 7 | 2016-11-05 | Heather Jo Clark | 0.45 | 0.75 | 0.34 | Approved supporting UFC win treatment. |
| 8 | 2017-08-05 | Randa Markos | 0.45 | 0.75 | 0.34 | Solid strawweight veteran. |
| 9 | 2020-08-29 | Ji Yeon Kim | 0.45 | 0.75 | 0.34 | Solid UFC win. |

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

#### Loss-penalty receipts

The fight-level rules create raw loss events. The final category then compresses those events through severity, frequency, and a prime-loss volume floor. Exposure: **15** fights. Severity: **1.5**. Frequency: **1.3**. Prime-volume floor: **1.5**. Pre-division magnitude: **2.8**. Final penalty: **-2.8**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Raw event penalty | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2017-02-04 | Felice Herrig | pre-prime | top-ten | home | No | Yes | -1.25 | standard rule |
| 2018-05-19 | Tatiana Suarez | pre-prime | top-five | home | Yes | Yes | -1.5 | standard rule |
| 2019-09-21 | Carla Esparza | pre-prime | champion-level | home | No | Yes | -0.75 | standard rule |
| 2024-09-14 | Valentina Shevchenko | prime | champion-level | home | No | Yes | -1.5 | standard rule |
| 2025-05-10 | Natalia Silva | prime | top-five | home | No | Yes | -1.5 | standard rule |

#### Division-strength context

Default division key: **modern-women-flyweight-0.92**. Era-ledger division multiplier: **0.95**. Division-era modifier: **+0.18**.

Barber through current title-level form.

#### Key judgment calls

- **Prime window:** Maycee Barber → Current title-level form.
- **Coverage:** Complete UFC-only ledger through UFC Fight Night 271 on 2026-03-28. Invicta and other non-UFC fights excluded.
- **Loss endpoint:** Barber begins flyweight contender rise. Valentina rivalry keeps title-level window open.

#### Why ranked here

Alexa Grasso ranks #10 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 36.98 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

#### Why not ranked higher?

Alexa Grasso is 0.66 raw points behind #9 Carla Esparza. The largest category separation versus that next target is currently Longevity; future movement must be earned through new UFC evidence and a full pipeline rerun.

#### Final takeaway

Alexa Grasso ranks #10 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 36.98 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

_Source IDs: fighter ledger verified through 2026-07-13; score owner ranking-pipeline.js; category owner category-calculators.js._

### 11. Kayla Harrison — 86 OVR

Kayla Harrison is ranked from the current UFC-only calculated pipeline.

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

OVR conversion: board anchors **25.78–80.79**, normalized score **0.1676**, curved score **0.2191**, resulting in **86 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 2.06 | #10 | 1 adjusted credit / 14.54 benchmark |
| Opponent Quality | 6.28 | #15 | 2.95 diminished credit / 14.1 benchmark |
| Prime Dominance | 21.57 | #5 | 26.96 raw × 80.0% sample |
| Longevity | 5.5 | #15 | 26.42 counted elite months |
| Apex modifier | +3.48 | Modifier | Short UFC-only apex with grappling danger and combat-sports aura. |
| Loss penalty | 0 | Modifier | 0 official/technical loss events reviewed |
| Division-era depth | +0.49 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **1**. Adjusted title wins: **1**. Derived undisputed-title win count: **1**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final adjusted credit | Review note |
| --- | --- | --- | --- | --- | --- | --- |
| 2025-06-07 | Julianna Peña | normal | 1 | 1 | 1 | Current-table clean title win over sitting champion. |

#### Opponent Quality receipts

Raw win credit: **2.95**. Diminishing-return credit before fighter adjustment: **2.95**. Fighter adjustment: **0**. Final diminished credit: **2.95**.

| Slot | Date | Opponent | Base/final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 2025-06-07 | Julianna Peña | 1.25 | 1 | 1.25 | Defeated the reigning UFC bantamweight champion. |
| 2 | 2024-04-13 | Holly Holm | 0.85 | 1 | 0.85 | Former UFC champion name, late-career timing. |
| 3 | 2024-10-05 | Ketlen Vieira | 0.85 | 1 | 0.85 | Strong ranked bantamweight contender. |

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

#### Loss-penalty receipts

The fight-level rules create raw loss events. The final category then compresses those events through severity, frequency, and a prime-loss volume floor. Exposure: **3** fights. Severity: **0**. Frequency: **0**. Prime-volume floor: **0**. Pre-division magnitude: **0**. Final penalty: **0**.

_No rows._

#### Division-strength context

Default division key: **modern-women-bantamweight-0.90**. Era-ledger division multiplier: **0.95**. Division-era modifier: **+0.49**.

Holm through current UFC elite form.

#### Key judgment calls

- **Prime window:** Holly Holm → Current UFC elite form.
- **Coverage:** Complete UFC-only ledger through UFC 316 on 2025-06-07. PFL, Invicta, and other non-UFC fights excluded.
- **Loss endpoint:** Holm starts UFC elite proof. Non-UFC dominance is context only.

#### Why ranked here

Kayla Harrison ranks #11 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 35 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

#### Why not ranked higher?

Kayla Harrison is 1.98 raw points behind #10 Alexa Grasso. The largest category separation versus that next target is currently Longevity; future movement must be earned through new UFC evidence and a full pipeline rerun.

#### Final takeaway

Kayla Harrison ranks #11 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 35 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

_Source IDs: fighter ledger verified through 2026-07-13; score owner ranking-pipeline.js; category owner category-calculators.js._

### 12. Mackenzie Dern — 85 OVR

Mackenzie Dern is ranked from the current UFC-only calculated pipeline.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| women | 34.33 | 11-5 | Strawweight | 1 | 0.9 | 1 | 7-4 | 57.9% | 5.58 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 1.77 | 35 | 2.07 |
| Opponent Quality | 14.87 | 25 | 12.39 |
| Prime Dominance | 14.42 | 30 | 14.42 |
| Longevity | 14.2 | 10 | 4.73 |

Base score: **33.61**. Modifiers: Apex **+4.1**, Loss Penalty **-3.38**, Division-Era Depth **0**. Final raw score: **34.33**.

OVR conversion: board anchors **25.78–80.79**, normalized score **0.1554**, curved score **0.2055**, resulting in **85 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 1.77 | #15 | 0.86 adjusted credit / 14.54 benchmark |
| Opponent Quality | 14.87 | #8 | 6.99 diminished credit / 14.1 benchmark |
| Prime Dominance | 14.42 | #13 | 14.42 raw × 100.0% sample |
| Longevity | 14.2 | #5 | 68.15 counted elite months |
| Apex modifier | +4.1 | Modifier | A submission rebound and five-round contender win create a clean modern strawweight Apex without a championship-level claim. |
| Loss penalty | -3.38 | Modifier | 5 official/technical loss events reviewed |
| Division-era depth | 0 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **1**. Adjusted title wins: **0.9**. Derived undisputed-title win count: **1**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final adjusted credit | Review note |
| --- | --- | --- | --- | --- | --- | --- |
| 2025-10-25 | Virna Jandiroba | vacant-undisputed | 0.9 | 0.95 | 0.86 | Recent-event add: UFC 321 vacant strawweight title win over strong contender. |

#### Opponent Quality receipts

Raw win credit: **7.65**. Diminishing-return credit before fighter adjustment: **6.99**. Fighter adjustment: **0**. Final diminished credit: **6.99**.

| Slot | Date | Opponent | Base/final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 2020-12-12 | Virna Jandiroba | 1 | 1 | 1 | Vacant-title opponent and elite strawweight contender in app timeline. |
| 2 | 2025-10-25 | Virna Jandiroba | 1 | 1 | 1 | Elite strawweight title-level contender in the approved rematch. |
| 3 | 2023-05-20 | Angela Hill | 0.85 | 1 | 0.85 | Strong veteran strawweight contender. |
| 4 | 2025-01-11 | Amanda Ribas | 0.85 | 1 | 0.85 | Strong ranked strawweight win. |
| 5 | 2020-09-19 | Randa Markos | 0.65 | 1 | 0.65 | Quality strawweight veteran. |
| 6 | 2021-04-10 | Nina Nunes | 0.65 | 1 | 0.65 | Quality strawweight/bantamweight name. |
| 7 | 2022-04-09 | Tecia Torres | 0.65 | 0.75 | 0.49 | Quality strawweight contender. |
| 8 | 2024-08-03 | Loopy Godinez | 0.65 | 0.75 | 0.49 | Quality ranked strawweight win. |
| 9 | 2018-03-03 | Ashley Yoder | 0.45 | 0.75 | 0.34 | Solid UFC win. |
| 10 | 2018-05-12 | Amanda Cooper | 0.45 | 0.75 | 0.34 | Solid UFC win. |
| 11 | 2020-05-30 | Hannah Cifers | 0.45 | 0.75 | 0.34 | Solid UFC strawweight win. |

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

#### Loss-penalty receipts

The fight-level rules create raw loss events. The final category then compresses those events through severity, frequency, and a prime-loss volume floor. Exposure: **16** fights. Severity: **1.88**. Frequency: **1.5**. Prime-volume floor: **3.25**. Pre-division magnitude: **3.38**. Final penalty: **-3.38**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Raw event penalty | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2019-10-12 | Amanda Ribas | pre-prime | top-ten | home | No | Yes | -1.25 | standard rule |
| 2021-10-09 | Marina Rodriguez | prime | top-five | home | No | Yes | -1.5 | standard rule |
| 2022-10-01 | Yan Xiaonan | prime | top-five | home | No | Yes | -1.5 | standard rule |
| 2023-11-11 | Jessica Andrade | prime | champion-level | home | Yes | Yes | -2.25 | standard rule |
| 2024-02-17 | Amanda Lemos | prime | top-five | home | No | Yes | -1.5 | standard rule |

#### Division-strength context

Default division key: **modern-women-strawweight-0.95**. Era-ledger division multiplier: **1**. Division-era modifier: **0**.

Nina Nunes through current championship form.

#### Key judgment calls

- **Prime window:** Nina Nunes → Current championship form.
- **Coverage:** Complete UFC-only ledger through UFC 321 on 2025-10-25. Non-UFC fights excluded.
- **Loss endpoint:** Dern is current champion by Cody call. Contender losses did not close the window because she later re-proved championship form.

#### Why ranked here

Mackenzie Dern ranks #12 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 34.33 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

#### Why not ranked higher?

Mackenzie Dern is 0.67 raw points behind #11 Kayla Harrison. The largest category separation versus that next target is currently Prime Dominance; future movement must be earned through new UFC evidence and a full pipeline rerun.

#### Final takeaway

Mackenzie Dern ranks #12 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 34.33 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

_Source IDs: fighter ledger verified through 2026-07-13; score owner ranking-pipeline.js; category owner category-calculators.js._

### 13. Julianna Peña — 83 OVR

Julianna Peña is ranked from the current UFC-only calculated pipeline.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| women | 27.76 | 8-4 | Bantamweight | 2 | 1.9 | 3 | 5-4 | 50.0% | 8.37 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 3.73 | 35 | 4.35 |
| Opponent Quality | 10.56 | 25 | 8.8 |
| Prime Dominance | 10.02 | 30 | 10.02 |
| Longevity | 9.54 | 10 | 3.18 |

Base score: **26.35**. Modifiers: Apex **+4.65**, Loss Penalty **-3.57**, Division-Era Depth **+0.33**. Final raw score: **27.76**.

OVR conversion: board anchors **25.78–80.79**, normalized score **0.0360**, curved score **0.0593**, resulting in **83 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 3.73 | #8 | 1.81 adjusted credit / 14.54 benchmark |
| Opponent Quality | 10.56 | #13 | 4.96 diminished credit / 14.1 benchmark |
| Prime Dominance | 10.02 | #15 | 11.13 raw × 90.0% sample |
| Longevity | 9.54 | #10 | 45.79 counted elite months |
| Apex modifier | +4.65 | Modifier | The all-time upset supplies major Proof and Aura, while the immediate one-sided rematch loss limits Claim. |
| Loss penalty | -3.57 | Modifier | 4 official/technical loss events reviewed |
| Division-era depth | +0.33 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **2**. Adjusted title wins: **1.9**. Derived undisputed-title win count: **2**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final adjusted credit | Review note |
| --- | --- | --- | --- | --- | --- | --- |
| 2021-12-11 | Amanda Nunes | normal | 1 | 1 | 1 | locked |
| 2024-10-05 | Raquel Pennington | vacant-undisputed | 0.9 | 0.9 | 0.81 | Vacant title over credible but softer opponent. |

#### Opponent Quality receipts

Raw win credit: **5.05**. Diminishing-return credit before fighter adjustment: **4.96**. Fighter adjustment: **0**. Final diminished credit: **4.96**.

| Slot | Date | Opponent | Base/final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 2021-12-11 | Amanda Nunes | 1.25 | 1 | 1.25 | Submitted the dominant reigning UFC two-division champion to win the bantamweight title. |
| 2 | 2016-07-09 | Cat Zingano | 0.85 | 1 | 0.85 | Strong contender win over a former UFC title challenger. |
| 3 | 2024-10-05 | Raquel Pennington | 0.85 | 1 | 0.85 | Won the UFC bantamweight title by disputed split decision; title value is respected but capped below full top-five credit. |
| 4 | 2015-10-03 | Jessica Eye | 0.65 | 1 | 0.65 | Ranked bantamweight/flyweight contender and useful early UFC win. |
| 5 | 2021-01-24 | Sara McMann | 0.65 | 1 | 0.65 | Olympic medalist and ranked bantamweight veteran in Peña’s title climb. |
| 6 | 2019-07-13 | Nicco Montano | 0.45 | 1 | 0.45 | Former UFC flyweight champion name, capped for inactivity, division movement, and limited sustained elite proof. |
| 7 | 2015-04-04 | Milana Dudieva | 0.25 | 0.75 | 0.19 | Supporting UFC finish with limited opponent-quality value. |
| 8 | 2013-11-30 | Jessica Rakoczy | 0.1 | 0.75 | 0.07 | TUF finale support win with minimal long-term opponent-quality value. |

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

| From | To | Raw months | Counted months | Reason |
| --- | --- | --- | --- | --- |
| 2022-07-30 | 2024-10-05 | 26.22 | 18 | Between-fight gap capped at 18 months |

#### Loss-penalty receipts

The fight-level rules create raw loss events. The final category then compresses those events through severity, frequency, and a prime-loss volume floor. Exposure: **12** fights. Severity: **1.88**. Frequency: **1.69**. Prime-volume floor: **1.75**. Pre-division magnitude: **3.57**. Final penalty: **-3.57**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Raw event penalty | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2017-01-28 | Valentina Shevchenko | pre-prime | champion-level | home | Yes | Yes | -1.5 | standard rule |
| 2020-10-04 | Germaine de Randamie | pre-prime | top-five | home | Yes | Yes | -1.5 | standard rule |
| 2022-07-30 | Amanda Nunes | prime | champion-level | home | No | Yes | -1.5 | standard rule |
| 2025-06-07 | Kayla Harrison | prime | champion-level | home | Yes | Yes | -2.25 | standard rule |

#### Division-strength context

Default division key: **modern-women-bantamweight-0.90**. Era-ledger division multiplier: **0.95**. Division-era modifier: **+0.33**.

Tate through current title-level form.

#### Key judgment calls

- **Prime window:** Amanda Nunes I → Current title-level form.
- **Coverage:** Complete UFC-only ledger through UFC 316 on 2025-06-07. Non-UFC fights and TUF exhibitions excluded.
- **Loss endpoint:** The Nunes upset begins the title-level window. Nunes II and later title-level losses do not automatically close it while Peña remains relevant.

#### Why ranked here

Julianna Peña ranks #13 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 27.76 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

#### Why not ranked higher?

Julianna Peña is 6.57 raw points behind #12 Mackenzie Dern. The largest category separation versus that next target is currently Longevity; future movement must be earned through new UFC evidence and a full pipeline rerun.

#### Final takeaway

Julianna Peña ranks #13 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 27.76 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

_Source IDs: fighter ledger verified through 2026-07-13; score owner ranking-pipeline.js; category owner category-calculators.js._

### 14. Miesha Tate — 82 OVR

Miesha Tate is ranked from the current UFC-only calculated pipeline.

| Board | Raw score | UFC record | Division(s) | Title-fight wins | Adjusted title wins | Top-5 wins | Prime record | Rounds won | Elite years |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| women | 26.18 | 7-7 | Bantamweight / Flyweight | 1 | 1 | 3 | 3-1 | 58.3% | 1.44 |

#### Exact model math

| Component | Category value | Weight | Weighted contribution |
| --- | --- | --- | --- |
| Championship | 1.96 | 35 | 2.29 |
| Opponent Quality | 11.04 | 25 | 9.2 |
| Prime Dominance | 15.95 | 30 | 15.95 |
| Longevity | 6.2 | 10 | 2.07 |

Base score: **29.51**. Modifiers: Apex **+3.63**, Loss Penalty **-4.5**, Division-Era Depth **-2.46**. Final raw score: **26.18**.

OVR conversion: board anchors **25.78–80.79**, normalized score **0.0073**, curved score **0.0152**, resulting in **82 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 1.96 | #13 | 0.95 adjusted credit / 14.54 benchmark |
| Opponent Quality | 11.04 | #12 | 5.19 diminished credit / 14.1 benchmark |
| Prime Dominance | 15.95 | #12 | 15.95 raw × 100.0% sample |
| Longevity | 6.2 | #14 | 29.75 counted elite months |
| Apex modifier | +3.63 | Modifier | Short UFC title apex with the Holm comeback win. |
| Loss penalty | -4.5 | Modifier | 7 official/technical loss events reviewed |
| Division-era depth | -2.46 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **1**. Adjusted title wins: **1**. Derived undisputed-title win count: **1**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final adjusted credit | Review note |
| --- | --- | --- | --- | --- | --- | --- |
| 2016-03-05 | Holly Holm | normal | 1 | 0.95 | 0.95 | locked |

#### Opponent Quality receipts

Raw win credit: **5.3**. Diminishing-return credit before fighter adjustment: **5.19**. Fighter adjustment: **0**. Final diminished credit: **5.19**.

| Slot | Date | Opponent | Base/final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 2016-03-05 | Holly Holm | 1.25 | 1 | 1.25 | UFC bantamweight champion. |
| 2 | 2015-01-31 | Sara McMann | 1 | 1 | 1 | Olympic medalist and top bantamweight contender. |
| 3 | 2015-07-25 | Jessica Eye | 0.85 | 1 | 0.85 | Ranked bantamweight contender. |
| 4 | 2014-04-19 | Liz Carmouche | 0.65 | 1 | 0.65 | Quality bantamweight contender. |
| 5 | 2021-07-17 | Marion Reneau | 0.65 | 1 | 0.65 | Quality veteran bantamweight win. |
| 6 | 2014-09-20 | Rin Nakai | 0.45 | 1 | 0.45 | Solid UFC bantamweight win. |
| 7 | 2023-12-02 | Julia Avila | 0.45 | 0.75 | 0.34 | Solid late-career UFC win. |

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

#### Loss-penalty receipts

The fight-level rules create raw loss events. The final category then compresses those events through severity, frequency, and a prime-loss volume floor. Exposure: **8** fights. Severity: **2.25**. Frequency: **2.25**. Prime-volume floor: **2**. Pre-division magnitude: **4.5**. Final penalty: **-4.5**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Raw event penalty | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2013-04-13 | Cat Zingano | pre-prime | top-five | home | Yes | Yes | -1.5 | standard rule |
| 2013-12-28 | Ronda Rousey | prime | champion-level | home | Yes | Yes | -2.25 | standard rule |
| 2016-07-09 | Amanda Nunes | prime | champion-level | home | Yes | Yes | -2.25 | standard rule |
| 2016-11-12 | Raquel Pennington | post-prime | top-five | home | No | Yes | 0 | standard rule |
| 2021-11-20 | Ketlen Vieira | post-prime | top-five | home | No | Yes | 0 | standard rule |
| 2022-07-16 | Lauren Murphy | post-prime | top-ten | home | No | Yes | 0 | standard rule |
| 2025-05-03 | Yana Santos | post-prime | top-ten | home | No | Yes | 0 | standard rule |

#### Division-strength context

Default division key: **women-bantamweight-0.85**. Era-ledger division multiplier: **0.95**. Division-era modifier: **-2.46**.

Ronda Rousey II through Amanda Nunes.

#### Key judgment calls

- **Prime window:** Ronda Rousey II → Amanda Nunes.
- **Coverage:** Complete UFC-only ledger through 2025-05-03. Strikeforce and other non-UFC fights excluded.
- **Loss endpoint:** The first UFC Rousey title fight begins Tate’s UFC title-level window. Nunes is the unrecovered endpoint.

#### Why ranked here

Miesha Tate ranks #14 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 26.18 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

#### Why not ranked higher?

Miesha Tate is 1.58 raw points behind #13 Julianna Peña. The largest category separation versus that next target is currently Longevity; future movement must be earned through new UFC evidence and a full pipeline rerun.

#### Final takeaway

Miesha Tate ranks #14 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 26.18 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

_Source IDs: fighter ledger verified through 2026-07-13; score owner ranking-pipeline.js; category owner category-calculators.js._

### 15. Holly Holm — 82 OVR

Holly Holm is ranked from the current UFC-only calculated pipeline.

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

OVR conversion: board anchors **25.78–80.79**, normalized score **0.0000**, curved score **0.0000**, resulting in **82 OVR**. Only the board leader may receive 99.

#### Category breakdown

| Category | Score | Board rank | Primary receipt |
| --- | --- | --- | --- |
| Championship | 2.06 | #10 | 1 adjusted credit / 14.54 benchmark |
| Opponent Quality | 12.29 | #10 | 5.78 diminished credit / 14.1 benchmark |
| Prime Dominance | 11.97 | #14 | 11.97 raw × 100.0% sample |
| Longevity | 9.18 | #11 | 44.08 counted elite months |
| Apex modifier | +4.2 | Modifier | Huge one-night apex against Ronda. |
| Loss penalty | -4.75 | Modifier | 7 official/technical loss events reviewed |
| Division-era depth | -2 | Modifier | empirical era-depth row + locked curve |

#### Championship receipts

UFC title-fight wins: **1**. Adjusted title wins: **1**. Derived undisputed-title win count: **1**. Interim-title win count: **0**.

| Date | Opponent | Title type | Base | Opponent strength | Final adjusted credit | Review note |
| --- | --- | --- | --- | --- | --- | --- |
| 2015-11-15 | Ronda Rousey | normal | 1 | 1 | 1 | locked |

#### Opponent Quality receipts

Raw win credit: **6**. Diminishing-return credit before fighter adjustment: **5.78**. Fighter adjustment: **0**. Final diminished credit: **5.78**.

| Slot | Date | Opponent | Base/final credit | Slot rate | Counted credit | Context |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 2015-11-15 | Ronda Rousey | 1.25 | 1 | 1.25 | Dominant UFC bantamweight champion and all-time star. |
| 2 | 2015-02-28 | Raquel Pennington | 0.85 | 1 | 0.85 | Strong ranked bantamweight contender. |
| 3 | 2020-10-04 | Irene Aldana | 0.85 | 1 | 0.85 | Strong ranked bantamweight contender. |
| 4 | 2023-03-25 | Yana Santos | 0.85 | 1 | 0.85 | Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win. |
| 5 | 2017-06-17 | Bethe Correia | 0.65 | 1 | 0.65 | Former title challenger, timing-adjusted. |
| 6 | 2018-06-09 | Megan Anderson | 0.65 | 1 | 0.65 | Ranked featherweight win in thin division. |
| 7 | 2015-07-15 | Marion Reneau | 0.45 | 0.75 | 0.34 | Solid bantamweight veteran. |
| 8 | 2020-01-18 | Raquel Pennington | 0.45 | 0.75 | 0.34 | Early UFC win over future contender. |

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

#### Loss-penalty receipts

The fight-level rules create raw loss events. The final category then compresses those events through severity, frequency, and a prime-loss volume floor. Exposure: **10** fights. Severity: **2.25**. Frequency: **2.5**. Prime-volume floor: **4.25**. Pre-division magnitude: **4.75**. Final penalty: **-4.75**.

| Date | Opponent | Phase | Quality | Division | Finished | Competitive | Raw event penalty | Special rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2016-03-05 | Miesha Tate | prime | champion-level | home | Yes | Yes | -2.25 | standard rule |
| 2016-07-23 | Valentina Shevchenko | prime | champion-level | home | No | Yes | -1.5 | standard rule |
| 2017-02-11 | Germaine de Randamie | prime | top-five | home | No | Yes | -1.5 | standard rule |
| 2017-12-30 | Cris Cyborg | prime | champion-level | home | No | Yes | -1.5 | standard rule |
| 2019-07-06 | Amanda Nunes | prime | champion-level | home | Yes | Yes | -2.25 | standard rule |
| 2022-05-21 | Ketlen Vieira | post-prime | top-five | home | No | Yes | 0 | standard rule |
| 2024-04-13 | Kayla Harrison | post-prime | champion-level | home | Yes | Yes | 0 | standard rule |

#### Division-strength context

Default division key: **women-bantamweight-featherweight-0.88**. Era-ledger division multiplier: **0.97**. Division-era modifier: **-2**.

Ronda through Nunes. Tate was followed by continued title relevance; Nunes is endpoint.

#### Key judgment calls

- **Prime window:** Ronda Rousey → Amanda Nunes.
- **Coverage:** Complete UFC-only ledger through UFC 300 on 2024-04-13. Boxing and non-UFC MMA fights excluded.
- **Loss endpoint:** Tate and other title losses did not close it alone. Nunes closes window per Cody call.

#### Why ranked here

Holly Holm ranks #15 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 25.12 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

#### Why not ranked higher?

Holly Holm is 1.06 raw points behind #14 Miesha Tate. The largest category separation versus that next target is currently Prime Dominance; future movement must be earned through new UFC evidence and a full pipeline rerun.

#### Final takeaway

Holly Holm ranks #15 because Prime Dominance and Opponent Quality provide the largest weighted parts of a 25.12 raw model score. The placement is calculated from the full UFC-only board, not manually assigned.

_Source IDs: fighter ledger verified through 2026-07-13; score owner ranking-pipeline.js; category owner category-calculators.js._

## 11. Comparison guidance

1. Start with the verdict.
2. State whether the verdict is about **better fighter/ability** or **better UFC-only GOAT résumé**. Those can differ.
3. Cite actual category values and the most important receipts.
4. Give the losing fighter’s strongest real counterargument.
5. Explain why the winner still wins.
6. Use a direct-fight ledger only when the fighters actually fought or had a real rivalry.
7. Avoid reading every number. Lead with the decisive two or three differences, then support them.

## 12. Scenario-analysis guidance

For “what would it take to pass X?” questions:

- Start with the current raw-score and OVR gap.
- Define the hypothetical UFC fight: opponent tier, champion status, title type, division, result, method, rounds, and date.
- Update the canonical ledger, Championship/Opponent Quality judgment inputs, prime sample, longevity window, loss exposure, Apex case, and division context as applicable.
- Rerun all seven categories, the weighted total, both fighters’ board ranks, and the OVR conversion.
- Do not promise a pass from a single win unless the full rerun actually produces it.
- Clearly separate a deterministic model result from a judgment-dependent estimate.

## 13. Validation and regression readiness

Automated validation passed for **76 fighters** and specifically checked: Jon Jones, Georges St-Pierre, Demetrious Johnson, Anderson Silva, Khabib Nurmagomedov, Alexander Volkanovski, Islam Makhachev, Jose Aldo, Alexandre Pantoja, Cain Velasquez, Francis Ngannou.

| Regression question | Status | Required answer behavior |
| --- | --- | --- |
| Show me exactly how Jon Jones got 99 OVR. | Ready | Use Jones’s exact weighted raw total, anchors, curve, and leader-only 99 rule. |
| Why is Pantoja’s quality-wins score low? | Ready | Use final-credit inputs, diminishing-return slots, benchmark, and modern-flyweight context. |
| Who is the best UFC fighter never to win undisputed gold? | Ready with definition | Use the derived no-undisputed index; separate résumé rank from subjective ability. |
| Compare Khabib and Volkanovski. | Ready | Verdict first; Khabib prime/cleanliness versus Volk title depth/quality/balance. |
| What would Islam need to do to pass GSP? | Scenario-ready | State current gap, define fight assumptions, and require a full rerun. |
| Why is Cain behind Ngannou overall? | Premise check required | Current data has Ngannou ahead; explain the decisive category and modifier gaps. |
| How was Anderson Silva’s loss penalty calculated? | Ready | Show each loss event, phase, finish/upward context, and aggregate severity/frequency/volume calculation. |
| Who has the best prime outside the top 10? | Ready | Current answer: Chuck Liddell by Prime Dominance score. |
| Which fighter is hurt most by UFC-only scoring? | Opinion only | Use excluded-achievement context, label the answer as opinion, and never invent a non-UFC score. |
| Who has the strongest UFC résumé without becoming undisputed champion? | Ready with definition | Current derived leader: Dustin Poirier. |

## 14. Known limitations and data gaps

- **Presentation coverage:** 64 fighters lack a bespoke “Why ranked here” override; 63 lack bespoke “Why not ranked higher?” copy. This file supplies calculated fallbacks, but bespoke copy would improve debate quality.
- **Compare-profile coverage:** 74 fighters lack a current pipeline-safe compare profile. Legacy compare packs are not score-safe because some contain frozen score patches.
- **Round audit coverage:** 0 fighters have at least one prime fight without audited round allocation: none.
- **Freshness metadata:** canonical model-as-of is 2026-07-13, while the latest fighter ledger is verified through 2026-07-15. Keep these dates synchronized in a future cleanup.
- **Non-UFC counterfactuals:** the model intentionally does not calculate what WEC, Pride, Strikeforce, ONE, Bellator, or regional achievements would have added.
- **Scenario uncertainty:** future opponents, rankings, title context, and prime-round allocations require explicit assumptions and may change judgment inputs.
- **Direct-fight ledger:** rivalry copy is useful context, but the score is still owned by the canonical pipeline, not by head-to-head history alone.

## 15. Update workflow

1. Update canonical fighter facts and approved judgments in the repo.
2. Run `node scripts/generate-octagon-verdict-knowledge.mjs`.
3. The generator validates all fighters, reconciles raw totals and OVRs, and writes this Markdown plus the companion JSON.
4. GitHub Pages runs the generator on every relevant main-branch deploy, publishing fresh files at `/octagon-verdict-knowledge.md` and `/octagon-verdict-data.json`.
5. Upload the new Markdown file to the Octagon Verdict Custom GPT and run the regression questions above.
