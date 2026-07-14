# UFC Fighter Data Refactor Handoff

_Last updated: 2026-07-13_

## Branch and pull request

- Repository: `codyking0602/ufc-goat-rankings`
- Working branch: `agent/fighter-data-phase-1`
- Draft PR: #39, `Start canonical fighter data ownership refactor`
- Do not merge the draft until Cody explicitly approves the calculated live pipeline.

## Permanent ownership architecture

The intended permanent flow is:

`canonical UFC fight ledger + reviewed classifications → calculated categories → modifiers → calculated total → calculated sort → calculated rank → calculated OVR → generated snapshot/profile`

Live results must never be controlled by:

- `expectedRank`
- `expectedTotalScore`
- `expectedOverallOvr`
- hand-written aggregate snapshot values
- measurable fighter facts stored in presentation files
- hand-written category scores stored in fighter packets or display overrides

Phase 1 remains evidence-only. Canonical records must not mutate any live score, total, rank, OVR, profile, snapshot, or Compare Mode value.

## Phase 1 coverage complete

Batch nine completes the canonical registry at:

- **73 of 73 audited UFC-only fighter ledgers**
- **1,366 complete UFC fight rows**
- **100% of the current roster identities**
- **zero deliberate live ranking or presentation mutations**

Completed fighters:

1. Charles Oliveira
2. Benson Henderson
3. Vitor Belfort
4. Deiveson Figueiredo
5. Frankie Edgar
6. Dominick Cruz
7. Fabricio Werdum
8. Glover Teixeira
9. Rashad Evans
10. Mauricio “Shogun” Rua
11. Forrest Griffin
12. Jon Jones
13. Georges St-Pierre
14. Demetrious Johnson
15. Anderson Silva
16. Islam Makhachev
17. Khabib Nurmagomedov
18. Alexander Volkanovski
19. Randy Couture
20. Max Holloway
21. Kamaru Usman
22. Jose Aldo
23. Matt Hughes
24. Daniel Cormier
25. Stipe Miocic
26. Ilia Topuria
27. Israel Adesanya
28. Cain Velasquez
29. Petr Yan
30. Merab Dvalishvili
31. B.J. Penn
32. Alex Pereira
33. Chuck Liddell
34. Francis Ngannou
35. Henry Cejudo
36. Conor McGregor
37. Justin Gaethje
38. Dustin Poirier
39. Tony Ferguson
40. T.J. Dillashaw
41. Tito Ortiz
42. Junior dos Santos
43. Brock Lesnar
44. Dricus du Plessis
45. Tyron Woodley
46. Aljamain Sterling
47. Robert Whittaker
48. Lyoto Machida
49. Khamzat Chimaev
50. Leon Edwards
51. Sean O'Malley
52. Sean Strickland
53. Michael Bisping
54. Dan Henderson
55. Chael Sonnen
56. Robbie Lawler
57. Frank Shamrock
58. Royce Gracie
59. Amanda Nunes
60. Valentina Shevchenko
61. Zhang Weili
62. Rose Namajunas
63. Miesha Tate
64. Mackenzie Dern
65. Kayla Harrison
66. Jessica Andrade
67. Alexa Grasso
68. Julianna Peña
69. Carla Esparza
70. Holly Holm
71. Joanna Jedrzejczyk
72. Ronda Rousey
73. Cris Cyborg

## Final Batch 9

Logical batch files:

- `assets/data/canonical-fighter-facts-batch-nine-data-a.js`
- `assets/data/canonical-fighter-facts-batch-nine-data-b.js`
- `assets/data/canonical-fighter-facts-batch-nine-data-c.js`
- `assets/data/canonical-fighter-facts-batch-nine.js`

The batch contains **220 complete UFC fight rows**:

- Amanda Nunes: 18 UFC bouts, 16-2. The Valentina Shevchenko breakthrough starts a 12-1 prime; Strikeforce and every other non-UFC result are excluded.
- Valentina Shevchenko: 19 UFC bouts, 15-3-1. The open prime runs from Holly Holm through the Manon Fiorot and Zhang Weili title defenses.
- Zhang Weili: 13 UFC bouts, 10-3. Jessica Andrade starts the title-level prime; the Valentina loss is reduced upward-division champion context.
- Rose Namajunas: 19 UFC bouts, 12-7. Joanna 1 starts the prime, Carla 2 closes it, and later flyweight results remain post-prime context.
- Miesha Tate: 14 UFC bouts, 7-7. The McMann-to-Nunes title window is the locked prime; Strikeforce is fully excluded.
- Mackenzie Dern: 16 UFC bouts, 11-5. Virna Jandiroba starts the open prime and the UFC 321 rematch is the vacant-title win.
- Kayla Harrison: 3 UFC bouts, 3-0. Only the Holm, Vieira, and Peña UFC fights count; all PFL and other non-UFC work is excluded.
- Jessica Andrade: 30 UFC bouts, 17-13. Her three-division UFC ledger is complete; the Karolina-to-Blanchfield window is the locked prime.
- Alexa Grasso: 15 UFC bouts, 9-5-1. Maycee Barber starts the open flyweight prime and the March 2026 Barber rematch is included.
- Julianna Peña: 12 UFC bouts, 8-4. Cat Zingano starts the open prime; both Nunes title fights, the Pennington vacant-title win, and the Kayla loss are included.
- Carla Esparza: 16 UFC bouts, 10-6. Virna starts the late-career prime, Rose 2 is the title reclaim, and Zhang closes the prime.
- Holly Holm: 16 UFC bouts, 8-7 with 1 NC. The Mayra Bueno Silva result is preserved as a no contest; boxing and non-UFC MMA are excluded.
- Joanna Jedrzejczyk: 15 UFC bouts, 10-5. Gadelha starts the prime, Zhang 1 closes it, and the Zhang rematch is post-prime retirement-fight context.
- Ronda Rousey: 8 UFC bouts, 6-2. All six UFC wins are title-fight wins; Strikeforce is excluded from the UFC-only ledger.
- Cris Cyborg: 6 UFC bouts, 5-1. Only her six UFC fights count; Strikeforce, Invicta, Bellator, PFL, and every other non-UFC achievement are excluded.

## Required validation

Every future correction must:

1. Preserve complete UFC-only histories through the latest completed fight.
2. Exclude scheduled future fights.
3. Exclude Pride, WEC, Strikeforce, Bellator, ONE, PFL, boxing, and regional results.
4. Preserve no contests as excluded results.
5. Explicitly classify prime windows, odd results, division context, title context, and loss context.
6. Audit every round row inside the locked prime window.
7. Validate every record before registration.
8. Maintain exact per-fighter bout-count and derivation assertions.
9. Assert that live ranking/profile/OVR/snapshot data is unchanged.
10. Run the dedicated canonical workflow plus the browser ownership and runtime scoring audits.

## Phase 2 entry point

Phase 1 is the complete evidence layer. The next stage is to calculate app outputs from canonical facts without expected-rank locks or hand-written aggregate ownership:

1. calculate the five scoring categories from the 73 canonical ledgers;
2. apply locked loss penalties, division strength, and approved peak/apex treatment;
3. generate totals, sort order, ranks, and OVRs;
4. generate profile and Compare Mode statistics from the same calculated source;
5. compare the calculated board against the current live snapshot before any merge or live activation.

## Validation status

The Batch 9 files pass local JavaScript syntax checks and isolated canonical validation for all **15 fighters and 220 rows**. The dedicated GitHub workflow and the updated Fighter Data Ownership Baseline run the full 73-fighter chain on the pull-request head.

Known unrelated existing failure:

- Picks UI Smoke: `Underdog Lock no-odds state is missing`

This is not a canonical fighter-ledger failure. The canonical and runtime scoring checks must remain green.
