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

Batch seven brings the canonical registry to:

- **48 audited UFC-only fighter ledgers**
- **970 complete UFC fight rows**
- **65.75% of the 73 current identities**
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

## Batch seven

Logical batch files:

- `assets/data/canonical-fighter-facts-batch-seven-data-a.js`
- `assets/data/canonical-fighter-facts-batch-seven-data-b.js`
- `assets/data/canonical-fighter-facts-batch-seven.js`

The batch contains **199 complete UFC fight rows**:

- Tony Ferguson: 24 UFC bouts, 15-9. Prime runs from Gleison Tibau through the Justin Gaethje interim-title loss.
- T.J. Dillashaw: 18 UFC bouts, 13-5. Five official UFC title-fight wins; Cejudo is a downward-division elite loss and Sterling closes the prime.
- Tito Ortiz: 27 UFC bouts, 15-11-1. Six official title-fight wins and 5.20 adjusted title wins; non-UFC fights excluded.
- Junior dos Santos: 23 UFC bouts, 15-8. Werdum starts the prime and Overeem closes it; later heavyweight skid is post-prime.
- Brock Lesnar: 8 UFC bouts, 4-3 with 1 NC. Couture through Cain is the complete title-prime; Mark Hunt remains a no contest.
- Dricus du Plessis: 10 UFC bouts, 9-1 through Khamzat Chimaev. The scheduled July 18, 2026 Kamaru Usman fight is excluded.
- Tyron Woodley: 16 UFC bouts, 9-6-1. Lawler through Gilbert Burns is the locked prime window.
- Aljamain Sterling: 24 UFC bouts, 19-5 through Youssef Zalal. The prime remains open after Ortega and Zalal featherweight wins.
- Robert Whittaker: 25 UFC bouts, 18-7 through the UFC 329 win over Nikita Krylov. Krylov is a post-prime light-heavyweight win.
- Lyoto Machida: 24 UFC bouts, 16-8. Thiago Silva through C.B. Dollaway is the locked UFC prime; Bellator and other non-UFC fights are excluded.

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

## Exact next ten-fighter batch

1. Khamzat Chimaev
2. Leon Edwards
3. Sean O'Malley
4. Sean Strickland
5. Michael Bisping
6. Dan Henderson
7. Chael Sonnen
8. Robbie Lawler
9. Frank Shamrock
10. Royce Gracie

After that batch, the remaining canonical migrations are the fifteen women’s identities.

## Known unrelated CI debt

- Picks UI Smoke: `Underdog Lock no-odds state is missing`
- Scoring Architecture Guardrails: committed exact-runtime snapshot parity can drift when generated report timestamps/build output change

These are not canonical fighter-ledger failures. The canonical and runtime scoring checks must still remain green.
