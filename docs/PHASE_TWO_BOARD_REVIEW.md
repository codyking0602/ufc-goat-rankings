# Phase 2 Full-Board Review

_Last reviewed: 2026-07-14_

## Scope

The complete calculated shadow board was reviewed across:

- 73 UFC-only fighters
- 1,366 canonical UFC fight rows
- five scoring categories and Apex treatment
- locked loss-event rules and hybrid loss aggregation
- division strength and hidden Division-Era Depth
- calculated totals, ranks, OVRs, profile stats, and Compare Mode stats

The review remains shadow-only. It does not mutate the published leaderboard, profiles, OVRs, snapshots, or Compare Mode.

## Review corrections

### 1. Short UFC primes were receiving too much Peak credit

Open primes previously received full confidence regardless of sample size. That overvalued a three-fight UFC run such as Kayla Harrison’s and did not sufficiently distinguish Frank Shamrock’s five-fight UFC tenure from longer elite runs.

Prime and Apex confidence now use both:

- prime fight sample, reaching full strength at eight scored prime fights;
- active elite tenure, reaching full strength at four active elite years.

Fight sample carries 65% of the confidence calculation and elite tenure carries 35%. Open primes retain a higher floor so active fighters are not punished simply because their careers are unfinished.

Resulting corrections include:

- Kayla Harrison: women’s #5 to #7;
- Frank Shamrock: men’s #26 to #29;
- Royce Gracie: men’s #45 to #51;
- developing active resumes such as Ilia Topuria, Dricus du Plessis, and Sean O’Malley receive modest sample adjustments without being buried.

### 2. Apex confidence could be bypassed by the six-point cap

A raw Apex result above six could still return a full 6.00 after confidence was applied. The engine now caps the raw Apex case first and then applies sample confidence.

This preserves full 6.00 Apex only for sufficiently established cases. Kayla Harrison, Frank Shamrock, Royce Gracie, and Francis Ngannou no longer receive an automatic full-cap result from a short sample.

### 3. OVR presentation was slightly too compressed

The OVR curve changed from 0.85 to 0.80. Jon Jones remains the 99 benchmark, while elite fighters immediately below the GOAT tier read more naturally in the app.

- Islam Makhachev: 93 OVR
- Khabib Nurmagomedov: 92 OVR
- Alexander Volkanovski: 92 OVR
- Matt Hughes: 92 OVR
- Max Holloway: 92 OVR

## Accepted review flags

### Category caps

The following are intentional rather than model errors:

- Jon Jones reaches the Championship, Opponent Quality, Longevity, and Apex ceilings.
- Georges St-Pierre reaches the Opponent Quality ceiling.
- Islam Makhachev and Khabib Nurmagomedov reach the Apex ceiling.
- Max Holloway reaches the Longevity ceiling.

### Hybrid loss compression

Large raw loss-event totals remain compressed by the approved hybrid model, which accounts for severity, frequency, fight exposure, prime-loss volume, and division strength. The review did not find a fighter being carried into an indefensible tier by this compression.

Examples after all other calculations:

- Charles Oliveira: #24
- Robert Whittaker: #31
- Sean Strickland: #40
- Dustin Poirier: #41
- Vitor Belfort: #44
- Michael Bisping: #52

No additional manual penalty was added.

### Division-Era Depth

The pinned evidence covers 72 of 73 fighters. Leon Edwards keeps the disclosed neutral 0.00 fallback rather than receiving an invented adjustment. He ranks #28, so the fallback is not driving a top-tier result.

## Reviewed men’s board

1. Jon Jones — 99 OVR
2. Georges St-Pierre — 96 OVR
3. Demetrious Johnson — 94 OVR
4. Anderson Silva — 94 OVR
5. Islam Makhachev — 93 OVR
6. Khabib Nurmagomedov — 92 OVR
7. Alexander Volkanovski — 92 OVR
8. Matt Hughes — 92 OVR
9. Max Holloway — 92 OVR
10. Kamaru Usman — 91 OVR
11. Jose Aldo — 91 OVR
12. Randy Couture — 91 OVR
13. Chuck Liddell — 90 OVR
14. Stipe Miocic — 90 OVR
15. Israel Adesanya — 90 OVR
16. Aljamain Sterling — 90 OVR
17. Frankie Edgar — 90 OVR
18. Merab Dvalishvili — 90 OVR
19. T.J. Dillashaw — 90 OVR
20. Daniel Cormier — 90 OVR
21. Alex Pereira — 89 OVR
22. Francis Ngannou — 89 OVR
23. Cain Velasquez — 89 OVR
24. Charles Oliveira — 89 OVR
25. Benson Henderson — 88 OVR
26. Tito Ortiz — 88 OVR
27. Tony Ferguson — 88 OVR
28. Leon Edwards — 88 OVR
29. Frank Shamrock — 88 OVR
30. Junior dos Santos — 88 OVR
31. Robert Whittaker — 88 OVR
32. B.J. Penn — 88 OVR
33. Henry Cejudo — 88 OVR
34. Glover Teixeira — 88 OVR
35. Petr Yan — 88 OVR
36. Fabricio Werdum — 88 OVR
37. Justin Gaethje — 88 OVR
38. Tyron Woodley — 87 OVR
39. Dominick Cruz — 87 OVR
40. Sean Strickland — 87 OVR
41. Dustin Poirier — 87 OVR
42. Robbie Lawler — 87 OVR
43. Rashad Evans — 87 OVR
44. Vitor Belfort — 87 OVR
45. Lyoto Machida — 87 OVR
46. Ilia Topuria — 87 OVR
47. Khamzat Chimaev — 87 OVR
48. Deiveson Figueiredo — 87 OVR
49. Conor McGregor — 87 OVR
50. Dricus du Plessis — 86 OVR
51. Royce Gracie — 86 OVR
52. Michael Bisping — 86 OVR
53. Sean O’Malley — 85 OVR
54. Dan Henderson — 84 OVR
55. Chael Sonnen — 83 OVR
56. Forrest Griffin — 83 OVR
57. Brock Lesnar — 83 OVR
58. Mauricio “Shogun” Rua — 82 OVR

## Reviewed women’s board

1. Amanda Nunes — 96 OVR
2. Valentina Shevchenko — 96 OVR
3. Zhang Weili — 91 OVR
4. Joanna Jedrzejczyk — 90 OVR
5. Rose Namajunas — 89 OVR
6. Ronda Rousey — 89 OVR
7. Kayla Harrison — 88 OVR
8. Jessica Andrade — 87 OVR
9. Carla Esparza — 87 OVR
10. Alexa Grasso — 87 OVR
11. Julianna Peña — 87 OVR
12. Cris Cyborg — 87 OVR
13. Mackenzie Dern — 86 OVR
14. Holly Holm — 84 OVR
15. Miesha Tate — 82 OVR

## Review conclusion

The calculated board is debate-ready enough for live-promotion work. The model now handles short elite runs more responsibly, preserves the locked top-level ranking shape, and keeps front-end OVRs intuitive.

The next phase is implementation, not further shadow calibration: promote this calculated source into the live leaderboard, profiles, snapshots, and Compare Mode, then run browser regression testing before merge.
