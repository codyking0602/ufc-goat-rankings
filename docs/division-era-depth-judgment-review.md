# Division-Era Depth Judgment Review

**Version:** division-era-depth-judgment-review-20260712a  
**Shadow source:** division-era-depth-shadow-20260712c-curved-candidate  
**Live scores changed:** No

## Decision

The empirical Division-Era Depth Index and the curved point translation pass the broad 63-fighter judgment review. The original linear translation remains rejected because it pushed too many moderately older fighters to the same -3 cap.

The model is **not ready for live promotion**. Two blockers remain:

1. **Women’s featherweight:** the division never maintained a viable ranks-6–15 field. Pure WFW output should receive no era adjustment, and mixed-division fighters should be recalculated without WFW samples.
2. **Source freshness:** the fight dataset ends 2025-04-12, while the live scoring model includes 2026 results. Open-prime terminal snapshots are acceptable for shadow analysis but not final production.

## Major Movers

| Fighter | Current | Curved | Move | Depth | Adj. | Decision |
|---|---:|---:|---:|---:|---:|---|
| Tito Ortiz | #25 | #30 | -5 | 0.7500 | -3.00 | approved-major-mover |
| Junior dos Santos | #24 | #28 | -4 | 0.8242 | -1.77 | approved-major-mover |
| Matt Hughes | #8 | #11 | -3 | 0.7500 | -3.00 | approved-major-mover |

All major movers pass judgment. Hughes, JDS, and Tito move because the empirical field-depth gap is substantial, not because their rankings were manually targeted.

## Heavyweight Review

| Fighter | Current | Curved | Move | Depth | Adj. | Decision |
|---|---:|---:|---:|---:|---:|---|
| Jon Jones | #1 | #1 | 0 | 0.9645 | -0.16 | approved-heavyweight |
| Stipe Miocic | #11 | #10 | +1 | 0.9803 | -0.07 | approved-heavyweight |
| Randy Couture | #13 | #14 | -1 | 0.7504 | -2.99 | approved-heavyweight |
| Daniel Cormier | #16 | #16 | 0 | 0.9603 | -0.19 | approved-heavyweight |
| Cain Velasquez | #22 | #22 | 0 | 0.8556 | -1.32 | approved-heavyweight |
| Junior dos Santos | #24 | #28 | -4 | 0.8242 | -1.77 | approved-major-mover |
| Francis Ngannou | #26 | #24 | +2 | 0.9872 | -0.03 | approved-heavyweight |
| Brock Lesnar | #45 | #46 | -1 | 0.8044 | -2.08 | approved-heavyweight |

Heavyweight passes as a model class. Every heavyweight era is normalized against modern heavyweight, so the model does not punish heavyweight for being naturally shallower than lightweight.

## Women’s Featherweight Review

| Fighter | Current | Curved | Move | Depth | Adj. | Decision |
|---|---:|---:|---:|---:|---:|---|
| Amanda Nunes | #1 | #1 | 0 | 0.8819 | -0.97 | hold-wfw-treatment |
| Cris Cyborg | #8 | #9 | -1 | 0.7500 | -3.00 | hold-wfw-treatment |
| Holly Holm | #12 | #14 | -2 | 0.7965 | -2.20 | hold-wfw-treatment |

These rows remain on hold until WFW samples are excluded or replaced with a zero era adjustment for pure WFW careers.

## Full 63-Fighter Review

| Fighter | Current | Curved | Move | Depth | Adj. | Decision |
|---|---:|---:|---:|---:|---:|---|
| Jon Jones | #1 | #1 | 0 | 0.9645 | -0.16 | approved-heavyweight |
| Georges St-Pierre | #2 | #2 | 0 | 0.8288 | -1.70 | approved |
| Anderson Silva | #3 | #4 | -1 | 0.8348 | -1.61 | approved |
| Demetrious Johnson | #4 | #3 | +1 | 0.8929 | -0.84 | approved |
| Islam Makhachev | #5 | #5 | 0 | 0.9768 | -0.08 | approved-with-caution |
| Alexander Volkanovski | #6 | #6 | 0 | 0.9927 | -0.01 | approved-with-caution |
| Jose Aldo | #7 | #7 | 0 | 0.8889 | -0.89 | approved |
| Matt Hughes | #8 | #11 | -3 | 0.7500 | -3.00 | approved-major-mover |
| Khabib Nurmagomedov | #9 | #8 | +1 | 1.0040 | +0.08 | approved |
| Kamaru Usman | #10 | #9 | +1 | 1.0126 | +0.25 | approved |
| Stipe Miocic | #11 | #10 | +1 | 0.9803 | -0.07 | approved-heavyweight |
| Max Holloway | #12 | #12 | 0 | 0.9647 | -0.16 | approved-with-caution |
| Randy Couture | #13 | #14 | -1 | 0.7504 | -2.99 | approved-heavyweight |
| Israel Adesanya | #14 | #13 | +1 | 0.9905 | -0.02 | approved |
| Chuck Liddell | #15 | #17 | -2 | 0.7532 | -2.94 | approved |
| Daniel Cormier | #16 | #16 | 0 | 0.9603 | -0.19 | approved-heavyweight |
| Alex Pereira | #17 | #15 | +2 | 1.0080 | +0.16 | approved-with-caution |
| B.J. Penn | #18 | #20 | -2 | 0.7676 | -2.69 | approved |
| T.J. Dillashaw | #19 | #18 | +1 | 0.8670 | -1.16 | approved |
| Frankie Edgar | #20 | #21 | -1 | 0.8576 | -1.29 | approved |
| Charles Oliveira | #21 | #19 | +2 | 0.9789 | -0.07 | approved-with-caution |
| Cain Velasquez | #22 | #22 | 0 | 0.8556 | -1.32 | approved-heavyweight |
| Henry Cejudo | #23 | #23 | 0 | 0.9631 | -0.17 | approved |
| Junior dos Santos | #24 | #28 | -4 | 0.8242 | -1.77 | approved-major-mover |
| Tito Ortiz | #25 | #30 | -5 | 0.7500 | -3.00 | approved-major-mover |
| Francis Ngannou | #26 | #24 | +2 | 0.9872 | -0.03 | approved-heavyweight |
| Aljamain Sterling | #27 | #25 | +2 | 0.9895 | -0.03 | approved-with-caution |
| Conor McGregor | #28 | #26 | +2 | 0.9369 | -0.38 | approved |
| Tyron Woodley | #29 | #27 | +2 | 1.0107 | +0.21 | approved |
| Merab Dvalishvili | #30 | #29 | +1 | 1.0039 | +0.08 | approved-with-caution |
| Dustin Poirier | #31 | #31 | 0 | 0.9896 | -0.03 | approved |
| Justin Gaethje | #32 | #32 | 0 | 0.9801 | -0.07 | approved |
| Ilia Topuria | #33 | #33 | 0 | 0.9986 | 0.00 | approved-with-caution |
| Robbie Lawler | #34 | #34 | 0 | 0.9676 | -0.14 | approved |
| Robert Whittaker | #35 | #35 | 0 | 0.9928 | -0.01 | approved |
| Dricus du Plessis | #36 | #36 | 0 | 1.0157 | +0.31 | approved-with-caution |
| Petr Yan | #37 | #37 | 0 | 0.9943 | -0.01 | approved-with-caution |
| Tony Ferguson | #38 | #38 | 0 | 1.0131 | +0.26 | approved |
| Deiveson Figueiredo | #39 | #39 | 0 | 0.9735 | -0.10 | approved |
| Lyoto Machida | #40 | #40 | 0 | 0.9475 | -0.29 | approved |
| Dominick Cruz | #41 | #43 | -2 | 0.8415 | -1.51 | approved |
| Khamzat Chimaev | #42 | #41 | +1 | 1.0140 | +0.28 | approved-with-caution |
| Sean Strickland | #43 | #42 | +1 | 1.0104 | +0.21 | approved-with-caution |
| Sean O'Malley | #44 | #45 | -1 | 0.9792 | -0.07 | approved-with-caution |
| Brock Lesnar | #45 | #46 | -1 | 0.8044 | -2.08 | approved-heavyweight |
| Michael Bisping | #46 | #44 | +2 | 1.0130 | +0.26 | approved |
| Dan Henderson | #47 | #47 | 0 | 0.9155 | -0.59 | approved |
| Chael Sonnen | #48 | #48 | 0 | 0.8751 | -1.06 | approved |
| Amanda Nunes | #1 | #1 | 0 | 0.8819 | -0.97 | hold-wfw-treatment |
| Valentina Shevchenko | #2 | #2 | 0 | 0.9269 | -0.47 | approved-with-caution |
| Zhang Weili | #3 | #3 | 0 | 0.9965 | 0.00 | approved-with-caution |
| Joanna Jedrzejczyk | #4 | #4 | 0 | 0.8259 | -1.74 | approved |
| Rose Namajunas | #5 | #5 | 0 | 0.9376 | -0.37 | approved |
| Ronda Rousey | #6 | #6 | 0 | 0.7838 | -2.41 | approved |
| Jessica Andrade | #7 | #7 | 0 | 0.9667 | -0.15 | approved |
| Cris Cyborg | #8 | #9 | -1 | 0.7500 | -3.00 | hold-wfw-treatment |
| Alexa Grasso | #9 | #8 | +1 | 1.0305 | +0.61 | approved-with-caution |
| Julianna Peña | #10 | #10 | 0 | 1.0335 | +0.67 | approved-with-caution |
| Carla Esparza | #11 | #11 | 0 | 0.8894 | -0.88 | approved |
| Holly Holm | #12 | #14 | -2 | 0.7965 | -2.20 | hold-wfw-treatment |
| Mackenzie Dern | #13 | #13 | 0 | 1.0126 | +0.25 | approved-with-caution |
| Kayla Harrison | #14 | #12 | +2 | 1.0361 | +0.72 | approved-with-caution |
| Miesha Tate | #15 | #15 | 0 | 0.7946 | -2.23 | approved |
