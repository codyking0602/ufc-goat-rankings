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

## Current Phase 1 coverage

Batch eight brings the canonical registry to:

- **58 audited UFC-only fighter ledgers**
- **1,146 complete UFC fight rows**
- **79.45% of the 73 current identities**
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

## Batch eight

Logical batch files:

- `assets/data/canonical-fighter-facts-batch-eight-data-a.js`
- `assets/data/canonical-fighter-facts-batch-eight-data-b.js`
- `assets/data/canonical-fighter-facts-batch-eight.js`

The batch contains **176 complete UFC fight rows**:

- Khamzat Chimaev: 10 UFC bouts, 9-1. Burns starts the elite prime; the Sean Strickland title loss is counted inside the prime.
- Leon Edwards: 20 UFC bouts, 14-5 with 1 NC. Rafael dos Anjos starts the prime, Belal Muhammad closes it, and the Brady/Prates losses are post-prime.
- Sean O'Malley: 16 UFC bouts, 12-3 with 1 NC. The prime remains open through the Song Yadong and Aiemann Zahabi rebound wins.
- Sean Strickland: 25 UFC bouts, 18-7. The current ledger includes Anthony Hernandez and the Khamzat title win; the prime remains open.
- Michael Bisping: 29 UFC bouts, 20-9. Brian Stann starts the prime, the GSP title loss closes it, and Gastelum is post-prime short-turnaround context.
- Dan Henderson: 18 UFC bouts, 9-9. UFC 17 tournament wins count as UFC wins but not official title-fight wins; every non-UFC result is excluded.
- Chael Sonnen: 14 UFC bouts, 7-7. The Anderson title run is the prime core, Jones is reduced upward-division title-loss context, and later UFC work is post-prime.
- Robbie Lawler: 26 UFC bouts, 14-11 with 1 NC. The Steve Berger result is preserved as a no contest and the Koscheck-to-Woodley comeback title run is the locked prime.
- Frank Shamrock: 5 UFC bouts, 5-0. All five were UFC title-fight wins, deriving 4.25 adjusted title wins after opponent-strength review; non-UFC achievements are excluded.
- Royce Gracie: 13 UFC bouts, 11-1-1. Eleven tournament wins count as UFC wins but not official title-fight wins; the Matt Hughes loss is post-prime.

## Required validation

Every future batch must:

1. Contain complete UFC-only histories through the latest completed fight.
2. Exclude scheduled future fights.
3. Exclude Pride, WEC, Strikeforce, Bellator, ONE, PFL, boxing, and regional results.
4. Preserve no contests as excluded results.
5. Explicitly classify prime windows, odd results, division context, title context, and loss context.
6. Audit every round row inside the locked prime window.
7. Validate every record before registration.
8. Add exact per-fighter bout-count and derivation assertions.
9. Assert that live ranking/profile/OVR/snapshot data is unchanged.
10. Load the batch before `UFC_RANKING_DATA_PATCHES_READY` resolves.
11. Run the dedicated canonical workflow plus the browser ownership and runtime scoring audits.

## Exact remaining fifteen-fighter batch

The remaining canonical migrations are the full women’s roster:

1. Amanda Nunes
2. Valentina Shevchenko
3. Zhang Weili
4. Rose Namajunas
5. Miesha Tate
6. Mackenzie Dern
7. Kayla Harrison
8. Jessica Andrade
9. Alexa Grasso
10. Julianna Peña
11. Carla Esparza
12. Holly Holm
13. Joanna Jedrzejczyk
14. Ronda Rousey
15. Cris Cyborg

Complete these as one final Phase 1 batch or split them into two mechanically identical sub-batches if file size becomes unwieldy. Preserve UFC-only scope, including full exclusion of Cyborg's Strikeforce and other non-UFC achievements.

## Current validation status

Batch eight's dedicated 176-fight derivation workflow, all earlier canonical batches, the Fighter Data Ownership Baseline, Runtime Scoring Snapshot, Runtime Scoring Audit, Six-Category Runtime Audit, and Scoring Architecture Guardrails all passed on the batch-eight code head.

Known unrelated existing failure:

- Picks UI Smoke: `Underdog Lock no-odds state is missing`

This is not a canonical fighter-ledger failure. The canonical and runtime scoring checks must remain green.
