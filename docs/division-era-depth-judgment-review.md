# Division-Era Depth Judgment Review

**Version:** division-era-depth-judgment-review-20260712b-live-approved  
**Shadow source:** division-era-depth-shadow-20260712d-current-wfw-safe  
**Dataset end:** 2026-06-27  
**Live scores changed by this audit:** No

## Decision

The empirical Division-Era Depth Index and curved point translation are **approved for live implementation**. The original linear translation remains rejected.

The two prior blockers are resolved:

1. **Women’s featherweight:** WFW samples are excluded. Mixed careers use their other divisional samples; pure WFW careers receive a neutral 0.00 era adjustment.
2. **Source freshness:** the verified historical base is refreshed directly from completed UFCStats events through 2026-06-27.

## Major Movers

| Fighter | Current | Curved | Move | Depth | Adj. | Decision |
|---|---:|---:|---:|---:|---:|---|
| Tito Ortiz | #25 | #30 | -5 | 0.7500 | -3.00 | approved-major-mover |
| Junior dos Santos | #24 | #28 | -4 | 0.8102 | -1.98 | approved-major-mover |
| Charles Oliveira | #21 | #18 | +3 | 0.9840 | -0.05 | approved-major-mover |
| Tyron Woodley | #29 | #26 | +3 | 1.0107 | +0.21 | approved-major-mover |

All major movers pass judgment. Their movement comes from measured field depth, not manually targeted ranks.

## Heavyweight Review

| Fighter | Current | Curved | Move | Depth | Adj. | Decision |
|---|---:|---:|---:|---:|---:|---|
| Jon Jones | #1 | #1 | 0 | 0.9668 | -0.15 | approved-heavyweight |
| Stipe Miocic | #11 | #11 | 0 | 0.9631 | -0.17 | approved-heavyweight |
| Randy Couture | #13 | #14 | -1 | 0.7500 | -3.00 | approved-heavyweight |
| Daniel Cormier | #16 | #16 | 0 | 0.9559 | -0.22 | approved-heavyweight |
| Alex Pereira | #17 | #15 | +2 | 1.0080 | +0.16 | approved-heavyweight |
| Cain Velasquez | #22 | #22 | 0 | 0.8390 | -1.55 | approved-heavyweight |
| Junior dos Santos | #24 | #28 | -4 | 0.8102 | -1.98 | approved-major-mover |
| Francis Ngannou | #26 | #24 | +2 | 0.9755 | -0.09 | approved-heavyweight |
| Brock Lesnar | #45 | #46 | -1 | 0.7930 | -2.26 | approved-heavyweight |

Heavyweight passes because every era is normalized against modern heavyweight rather than against naturally deeper lighter divisions.

## Women’s Featherweight Review

| Fighter | Current | Curved | Move | Depth | Adj. | Decision |
|---|---:|---:|---:|---:|---:|---|
| Amanda Nunes | #1 | #1 | 0 | 0.8828 | -0.96 | approved-wfw-safe |
| Cris Cyborg | #8 | #8 | 0 | 1.0000 | 0.00 | approved-wfw-safe |
| Holly Holm | #12 | #14 | -2 | 0.8095 | -2.00 | approved-wfw-safe |

All three WFW-influenced rows now follow the locked exclusion rule and are live-eligible.

## Full 63-Fighter Review

| Fighter | Current | Curved | Move | Depth | Adj. | Decision |
|---|---:|---:|---:|---:|---:|---|
| Jon Jones | #1 | #1 | 0 | 0.9668 | -0.15 | approved-heavyweight |
| Georges St-Pierre | #2 | #2 | 0 | 0.8266 | -1.73 | approved |
| Anderson Silva | #3 | #4 | -1 | 0.8311 | -1.67 | approved |
| Demetrious Johnson | #4 | #3 | +1 | 0.8622 | -1.23 | approved |
| Islam Makhachev | #5 | #5 | 0 | 0.9773 | -0.08 | approved-with-current-source |
| Alexander Volkanovski | #6 | #6 | 0 | 0.9909 | -0.02 | approved-with-current-source |
| Jose Aldo | #7 | #7 | 0 | 0.8769 | -1.04 | approved |
| Matt Hughes | #8 | #10 | -2 | 0.7500 | -3.00 | approved |
| Khabib Nurmagomedov | #9 | #8 | +1 | 1.0045 | +0.09 | approved |
| Kamaru Usman | #10 | #9 | +1 | 1.0135 | +0.27 | approved |
| Stipe Miocic | #11 | #11 | 0 | 0.9631 | -0.17 | approved-heavyweight |
| Max Holloway | #12 | #12 | 0 | 0.9574 | -0.21 | approved-with-current-source |
| Randy Couture | #13 | #14 | -1 | 0.7500 | -3.00 | approved-heavyweight |
| Israel Adesanya | #14 | #13 | +1 | 0.9843 | -0.05 | approved |
| Chuck Liddell | #15 | #17 | -2 | 0.7535 | -2.94 | approved |
| Daniel Cormier | #16 | #16 | 0 | 0.9559 | -0.22 | approved-heavyweight |
| Alex Pereira | #17 | #15 | +2 | 1.0080 | +0.16 | approved-heavyweight |
| B.J. Penn | #18 | #20 | -2 | 0.7666 | -2.71 | approved |
| T.J. Dillashaw | #19 | #19 | 0 | 0.8547 | -1.33 | approved |
| Frankie Edgar | #20 | #21 | -1 | 0.8491 | -1.41 | approved |
| Charles Oliveira | #21 | #18 | +3 | 0.9840 | -0.05 | approved-major-mover |
| Cain Velasquez | #22 | #22 | 0 | 0.8390 | -1.55 | approved-heavyweight |
| Henry Cejudo | #23 | #23 | 0 | 0.9372 | -0.38 | approved |
| Junior dos Santos | #24 | #28 | -4 | 0.8102 | -1.98 | approved-major-mover |
| Tito Ortiz | #25 | #30 | -5 | 0.7500 | -3.00 | approved-major-mover |
| Francis Ngannou | #26 | #24 | +2 | 0.9755 | -0.09 | approved-heavyweight |
| Aljamain Sterling | #27 | #25 | +2 | 0.9843 | -0.05 | approved-with-current-source |
| Conor McGregor | #28 | #27 | +1 | 0.9290 | -0.45 | approved |
| Tyron Woodley | #29 | #26 | +3 | 1.0107 | +0.21 | approved-major-mover |
| Merab Dvalishvili | #30 | #29 | +1 | 0.9925 | -0.02 | approved-with-current-source |
| Dustin Poirier | #31 | #31 | 0 | 0.9908 | -0.02 | approved |
| Justin Gaethje | #32 | #32 | 0 | 0.9812 | -0.06 | approved |
| Ilia Topuria | #33 | #33 | 0 | 0.9945 | -0.01 | approved-with-current-source |
| Robbie Lawler | #34 | #34 | 0 | 0.9681 | -0.14 | approved |
| Robert Whittaker | #35 | #35 | 0 | 0.9848 | -0.04 | approved |
| Dricus du Plessis | #36 | #36 | 0 | 1.0133 | +0.27 | approved-with-current-source |
| Petr Yan | #37 | #37 | 0 | 0.9855 | -0.04 | approved-with-current-source |
| Tony Ferguson | #38 | #38 | 0 | 1.0128 | +0.26 | approved |
| Deiveson Figueiredo | #39 | #39 | 0 | 0.9384 | -0.37 | approved |
| Lyoto Machida | #40 | #40 | 0 | 0.9485 | -0.28 | approved |
| Dominick Cruz | #41 | #43 | -2 | 0.8347 | -1.61 | approved |
| Khamzat Chimaev | #42 | #41 | +1 | 1.0211 | +0.42 | approved-with-current-source |
| Sean Strickland | #43 | #42 | +1 | 1.0133 | +0.27 | approved-with-current-source |
| Sean O'Malley | #44 | #45 | -1 | 0.9748 | -0.10 | approved-with-current-source |
| Brock Lesnar | #45 | #46 | -1 | 0.7930 | -2.26 | approved-heavyweight |
| Michael Bisping | #46 | #44 | +2 | 1.0054 | +0.11 | approved |
| Dan Henderson | #47 | #47 | 0 | 0.9178 | -0.57 | approved |
| Chael Sonnen | #48 | #48 | 0 | 0.8711 | -1.11 | approved |
| Amanda Nunes | #1 | #1 | 0 | 0.8828 | -0.96 | approved-wfw-safe |
| Valentina Shevchenko | #2 | #2 | 0 | 0.9209 | -0.53 | approved-with-current-source |
| Zhang Weili | #3 | #3 | 0 | 0.9688 | -0.13 | approved-with-current-source |
| Joanna Jedrzejczyk | #4 | #4 | 0 | 0.8095 | -2.00 | approved |
| Rose Namajunas | #5 | #5 | 0 | 0.9021 | -0.74 | approved |
| Ronda Rousey | #6 | #6 | 0 | 0.7746 | -2.57 | approved |
| Jessica Andrade | #7 | #7 | 0 | 0.9398 | -0.35 | approved |
| Cris Cyborg | #8 | #8 | 0 | 1.0000 | 0.00 | approved-wfw-safe |
| Alexa Grasso | #9 | #9 | 0 | 1.0090 | +0.18 | approved-with-current-source |
| Julianna Peña | #10 | #10 | 0 | 1.0165 | +0.33 | approved-with-current-source |
| Carla Esparza | #11 | #11 | 0 | 0.8626 | -1.22 | approved |
| Holly Holm | #12 | #14 | -2 | 0.8095 | -2.00 | approved-wfw-safe |
| Mackenzie Dern | #13 | #13 | 0 | 0.9971 | 0.00 | approved-with-current-source |
| Kayla Harrison | #14 | #12 | +2 | 1.0245 | +0.49 | approved-with-current-source |
| Miesha Tate | #15 | #15 | 0 | 0.7808 | -2.46 | approved |
