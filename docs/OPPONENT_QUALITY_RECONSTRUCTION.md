# Canonical Opponent Quality Reconstruction — Approved Review Complete

_Last updated: 2026-07-14_

## Status

- Fighters in Opponent Quality audit: **72**
- Excluded from this audit: **Leon Edwards**
- Canonical official UFC wins scored: **934**
- One-to-one fight input coverage: **934/934**
- Exact frozen-control parity: **16/72**
- Approved complete-ledger recalculation deltas: **56**
- Removed noncanonical legacy rows: **27**
- Remaining Opponent Quality conflicts: **0**
- Hidden fighter-level adjustments: **0**
- Live ranking payload changed: **No**
- PR status: **draft-only**

## Approved formula

1. Begin with official UFC wins only.
2. Assign each win a standard opponent-quality base tier:
   - Champion-level: 1.25
   - True Top-5: 1.00
   - Strong Top-10: 0.85
   - Ranked / quality: 0.65
   - Solid resume: 0.45
   - Name-value / faded / unproven: 0.25
   - Minimal UFC quality: 0.10
   - None: 0.00
3. Store any timing, division, repeat, or result-legitimacy adjustment explicitly rather than hiding it in a final score.
4. Sort final win credits from highest to lowest.
5. Apply diminishing returns:
   - Wins 1–6: 100%
   - Wins 7–12: 75%
   - Wins 13–18: 50%
   - Wins 19+: 25%
6. Calculate:

`Opponent Quality = diminished credit / 14.10 × 30`

The score is capped at 30 and rounded to two decimals.

## Locked doctrine

- UFC-only.
- No contests do not score.
- Front-end terminology is **Top-5 Wins**.
- Opponent quality is judged at the time of the fight.
- Future success can support context but cannot independently promote a win.
- There is no automatic repeat-opponent discount.
- There is no blanket division multiplier inside Opponent Quality.
- Fight performance does not add a bonus here; Prime Dominance and Apex own performance quality.
- Result-legitimacy situations may receive explicit adjustments.
- No fighter-level hidden haircut is allowed.
- Division-Era Depth remains a separate category and must not be double-counted.

## Former hidden-score fighters

| Fighter | Old control | Reconstructed | Delta | UFC wins scored | Hidden adjustment |
|---|---:|---:|---:|---:|---:|
| Benson Henderson | 18.40 | 21.38 | +2.98 | 11 | 0.00 |
| Fabricio Werdum | 20.20 | 20.37 | +0.17 | 12 | 0.00 |
| Glover Teixeira | 19.20 | 24.55 | +5.35 | 16 | 0.00 |
| Frank Shamrock | 11.20 | 10.64 | -0.56 | 5 | 0.00 |
| Rashad Evans | 19.00 | 21.41 | +2.41 | 14 | 0.00 |
| Vitor Belfort | 21.00 | 18.72 | -2.28 | 15 | 0.00 |
| Mauricio "Shogun" Rua | 16.00 | 15.29 | -0.71 | 11 | 0.00 |
| Forrest Griffin | 17.50 | 13.78 | -3.72 | 10 | 0.00 |
| Royce Gracie | 8.75 | 16.36 | +7.61 | 11 | 0.00 |

Royce’s old extra early-era compression is removed. His individual opponent credits remain discounted, and the separate Division-Era Depth category still owns the broader early-era penalty.

## All approved category-score deltas

| Fighter | Old control | Reconstructed | Delta |
|---|---:|---:|---:|
| Aljamain Sterling | 15.74 | 24.02 | +8.28 |
| Royce Gracie | 8.75 | 16.36 | +7.61 |
| Sean Strickland | 15.32 | 21.97 | +6.65 |
| Michael Bisping | 13.60 | 19.36 | +5.76 |
| Glover Teixeira | 19.20 | 24.55 | +5.35 |
| Merab Dvalishvili | 15.21 | 20.29 | +5.08 |
| Lyoto Machida | 16.38 | 21.44 | +5.06 |
| Jessica Andrade | 18.23 | 22.45 | +4.22 |
| Charles Oliveira | 22.06 | 26.22 | +4.16 |
| Deiveson Figueiredo | 16.38 | 20.11 | +3.73 |
| Forrest Griffin | 17.50 | 13.78 | -3.72 |
| Valentina Shevchenko | 21.81 | 25.40 | +3.59 |
| Robert Whittaker | 20.00 | 23.46 | +3.46 |
| Matt Hughes | 18.47 | 21.76 | +3.29 |
| Mackenzie Dern | 11.62 | 14.87 | +3.25 |
| T.J. Dillashaw | 16.15 | 19.20 | +3.05 |
| Dan Henderson | 10.62 | 13.64 | +3.02 |
| Benson Henderson | 18.40 | 21.38 | +2.98 |
| B.J. Penn | 16.49 | 19.36 | +2.87 |
| Robbie Lawler | 17.43 | 20.16 | +2.73 |
| Rose Namajunas | 17.55 | 20.27 | +2.72 |
| Frankie Edgar | 21.17 | 23.83 | +2.66 |
| Max Holloway | 25.36 | 27.87 | +2.51 |
| Anderson Silva | 21.91 | 24.39 | +2.48 |
| Rashad Evans | 19.00 | 21.41 | +2.41 |
| Daniel Cormier | 16.81 | 19.12 | +2.31 |
| Junior dos Santos | 20.06 | 22.34 | +2.28 |
| Vitor Belfort | 21.00 | 18.72 | -2.28 |
| Kamaru Usman | 21.81 | 24.02 | +2.21 |
| Carla Esparza | 13.96 | 15.85 | +1.89 |
| Alexa Grasso | 11.45 | 13.32 | +1.87 |
| Petr Yan | 15.43 | 17.18 | +1.75 |
| Dustin Poirier | 23.49 | 25.05 | +1.56 |
| Tony Ferguson | 17.30 | 18.83 | +1.53 |
| Francis Ngannou | 15.83 | 17.26 | +1.43 |
| Cain Velasquez | 15.89 | 17.26 | +1.37 |
| Justin Gaethje | 18.83 | 20.19 | +1.36 |
| Georges St-Pierre | 28.66 | 30.00 | +1.34 |
| Stipe Miocic | 20.53 | 21.86 | +1.33 |
| Amanda Nunes | 24.60 | 25.85 | +1.25 |
| Randy Couture | 18.57 | 19.79 | +1.22 |
| Islam Makhachev | 24.04 | 22.93 | -1.11 |
| Miesha Tate | 10.30 | 11.04 | +0.74 |
| Joanna Jedrzejczyk | 16.62 | 17.34 | +0.72 |
| Jose Aldo | 22.34 | 23.06 | +0.72 |
| Mauricio "Shogun" Rua | 16.00 | 15.29 | -0.71 |
| Frank Shamrock | 11.20 | 10.64 | -0.56 |
| Demetrious Johnson | 21.81 | 22.34 | +0.53 |
| Jon Jones | 30.00 | 29.47 | -0.53 |
| Zhang Weili | 18.51 | 17.98 | -0.53 |
| Cris Cyborg | 8.62 | 9.04 | +0.42 |
| Holly Holm | 12.57 | 12.29 | -0.28 |
| Alex Pereira | 18.19 | 18.43 | +0.24 |
| Brock Lesnar | 8.51 | 8.30 | -0.21 |
| Fabricio Werdum | 20.20 | 20.37 | +0.17 |
| Alexander Volkanovski | 23.26 | 23.24 | -0.02 |

Sixteen fighters reproduce the frozen control exactly. Fifty-six move because the approved review adds omitted official UFC wins, removes invalid or non-UFC legacy rows, resolves explicit tier judgments, and eliminates hidden aggregate compression.

## Important factual resolutions

- B.J. Penn vs. Duane Ludwig was added to the canonical UFC facts.
- Jon Jones vs. Daniel Cormier II remains a no contest and does not score.
- Nonexistent, exhibition, duplicate, and non-UFC legacy rows were removed.
- Aljamain Sterling vs. Petr Yan I remains an official UFC win but receives special 0.65 result-legitimacy credit.
- Nunes–Evinger, Shevchenko–Alexis Davis, and Holm–Iasmin Lucindo were confirmed as false legacy rows and were removed rather than added as canonical fights.

## Safety

This reconstruction is shadow-only. It does not write Opponent Quality scores into the live scoring records and does not mutate totals, ranks, OVRs, profiles, Compare Mode, or the published app. PR #39 remains draft. Prime Dominance has not been started.
