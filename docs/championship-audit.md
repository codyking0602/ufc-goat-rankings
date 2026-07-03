# Championship Audit Pass

Last updated: 2026-07-03

Purpose: make the Championship category formula-based, fluid, and reviewable. This document is the audit trail for title-fight value decisions before scoring-table edits are made.

## Core rule

Championship score is fluid, not permanently anchored to one fighter.

```text
Championship Score = 30 × Fighter Championship Index ÷ Current Best Championship Index
```

If a future fighter passes Jon Jones in Championship Index, that fighter becomes the new 30-point championship standard and everyone else scales down.

Current standard: Jon Jones, Championship Index 15.80, Championship Score 30.00.

## Locked title weights

Cody locked these on 2026-07-03.

| Title result type | Locked value |
|---|---:|
| Normal undisputed UFC title win or defense | 1.00 |
| Interim UFC title win | 0.75 |
| Vacant undisputed UFC title win | 0.90 |
| Second-division undisputed UFC title win over sitting champion | 1.25 |
| Vacant second-division UFC title win | 1.15 |
| DQ title win | Case-by-case |
| Injury-compromised title win/defense | Case-by-case |
| PED/vacated belt context | Case-by-case |

## Locked category principles

| Principle | Decision |
|---|---|
| Championship is division-neutral | Division strength belongs in Opponent Quality and Prime Dominance, not raw title-fight value. |
| Close/controversial official title wins | Count official title wins normally in Championship; handle round/control concerns in Prime Dominance. |
| Title losses | No Championship credit. Title losses belong in Penalty / Prime Dominance context. |
| No contests | Excluded from Championship title-win count unless Cody later creates a special context rule. |

## Fighter-specific locks

| Fighter / scenario | Locked decision |
|---|---|
| Jon Jones DC 2 no contest | Excluded from Championship title-win count. |
| Aljamain Sterling Yan DQ title win | 0.50 Championship Index. |
| Aljamain Sterling T.J. Dillashaw injury-compromised defense | Full 1.00 Championship Index. |
| T.J. Dillashaw EPO/vacated-belt context | No Championship haircut; title wins count full, PED context handled outside Championship. |
| Randy Couture old-era title treatment | Normal Championship treatment. |
| Matt Hughes old-era title treatment | Normal Championship treatment. |
| B.J. Penn two-division bonus chronology | Yes, Hughes WW title win gets 1.25 even though it came before the later LW reign. |
| Charles Oliveira stripped-title-fight win vs Gaethje | 0.50 Championship Index. |

---

## Batch 1 — top standards

| Fighter | Official UFC title-fight wins | Championship Index | Championship Score | Status |
|---|---:|---:|---:|---|
| Jon Jones | 16 | 15.80 | 30.00 | Locked |
| Georges St-Pierre | 13 | 13.00 | 24.68 | Locked |
| Demetrious Johnson | 12 | 11.90 | 22.59 | Locked |
| Anderson Silva | 11 | 11.00 | 20.89 | Locked |
| Islam Makhachev | 6 | 6.15 | 11.68 | Locked |
| Khabib Nurmagomedov | 4 | 3.90 | 7.41 | Locked |
| Alexander Volkanovski | 8 | 7.90 | 15.00 | Locked |

Notes:

- GSP: 11 normal + Hughes interim 0.75 + Bisping second-division sitting-champ title 1.25 = 13.00.
- DJ: inaugural/vacant flyweight title 0.90 + 11 normal = 11.90.
- Islam: Oliveira vacant 0.90 + 4 normal + JDM second-division sitting-champ title 1.25 = 6.15.
- Khabib: Iaquinta vacant 0.90 + 3 normal = 3.90.
- Volk: 7 normal + Lopes vacant 0.90 = 7.90.

---

## Batch 2 — messy / important cases

| Fighter | Championship Index | Formula Championship Score | Status |
|---|---:|---:|---|
| Randy Couture | 9.00 | 17.09 | Locked |
| Matt Hughes | 9.00 | 17.09 | Score edit applied by correction module |
| Jose Aldo | 7.75 | 14.72 | Locked |
| Daniel Cormier | 6.15 | 11.68 | Locked |
| Stipe Miocic | 6.00 | 11.39 | Locked |
| Israel Adesanya | 7.75 | 14.72 | Locked |
| Aljamain Sterling | 3.50 | 6.65 | Score edit applied by correction module |
| T.J. Dillashaw | 5.00 | 9.49 | Score edit applied by correction module |

Key title breakdowns:

- Aldo: 7 normal UFC FW title wins/defenses + Edgar interim 0.75 = 7.75. WEC excluded.
- DC: vacant LHW 0.90 + 3 normal LHW defenses + Stipe second-division 1.25 + Lewis HW defense 1.00 = 6.15.
- Stipe: 6 normal UFC HW title wins/defenses = 6.00.
- Izzy: Gastelum interim 0.75 + 7 normal MW title wins/defenses = 7.75.
- Aljo: Yan DQ 0.50 + Yan rematch 1.00 + TJ defense 1.00 + Cejudo defense 1.00 = 3.50.
- TJ: five UFC BW title-fight wins = 5.00.

---

## Batch 3 — remaining title-volume / two-division / interim cases

| Fighter | Championship Index | Formula Championship Score | Status |
|---|---:|---:|---|
| Alex Pereira | 6.15 | 11.68 | Verify exact count, likely locked |
| B.J. Penn | 5.15 | 9.78 | Locked |
| Charles Oliveira | 2.40 | 4.56 | Score edit applied by correction module |
| Henry Cejudo | 4.15 | 7.88 | Locked |
| Conor McGregor | 3.00 | 5.70 | Locked |
| Dominick Cruz | 4.00 | 7.59 | Locked |
| Francis Ngannou | 2.00 | 3.80 | Locked |
| Chuck Liddell | 5.00 | 9.49 | Locked |
| Frankie Edgar | 3.00 | 5.70 | Score edit applied by correction module |
| Dustin Poirier | 0.75 | 1.42 | Score edit applied by correction module |
| Justin Gaethje | 2.50 | 4.75 | Score edit applied by correction module, verify exact count |

Key title breakdowns:

- B.J. Penn: Hughes WW title 1.25 + vacant LW title 0.90 + 3 normal LW defenses/wins = 5.15.
- Charles Oliveira: Chandler vacant title 0.90 + Poirier defense 1.00 + Gaethje stripped-title context 0.50 = 2.40.
- Henry Cejudo: DJ title win 1.00 + TJ defense 1.00 + Moraes vacant second-division BW title 1.15 + Cruz defense 1.00 = 4.15.
- Conor McGregor: Mendes interim 0.75 + Aldo title win 1.00 + Alvarez second-division title 1.25 = 3.00.
- Dustin Poirier: Max Holloway interim LW title = 0.75. BMF bouts and title losses do not add Championship credit.

---

## Batch 4 — remaining men’s board / title-light cases

| Fighter | Current / working Championship Index | Formula Championship Score | Status |
|---|---:|---:|---|
| Kamaru Usman | 6.00 | 11.39 | Locked |
| Max Holloway | 4.75 | 9.02 | Locked |
| Ilia Topuria | 3.15 | 5.98 | Verify exact count, likely locked |
| Petr Yan | 2.65 current implied | 5.03 | Needs title-count audit |
| Cain Velasquez | 4.00 | 7.59 | Locked |
| Merab Dvalishvili | 4.00 current implied | 7.59 | Verify exact count |
| Dan Henderson | 0.00 title index / 2.10 current score | 0.00 by strict title-win model | Needs Cody call |

Batch 4 notes:

- Kamaru: Woodley title capture + Colby 1 + Masvidal 1 + Burns + Masvidal 2 + Colby 2 = 6 normal UFC title-fight wins.
- Max: Pettis interim 0.75 + Aldo undisputed + Aldo defense + Ortega defense + Edgar defense = 4.75.
- Ilia: current score implies 3.15, likely Volk title win 1.00 + Holloway defense 1.00 + vacant second-division/title value 1.15. Needs exact verification.
- Petr Yan: current score implies 2.65. Needs audit because the Sterling DQ loss should not create Championship credit; likely includes vacant/normal/interim treatment that needs confirmation.
- Cain: 4 normal heavyweight title wins/defenses.
- Merab: current score implies 4 normal title wins/defenses; verify exact count.
- Dan Henderson: current data gives Championship score 2.10 while title notes say no UFC undisputed title wins. UFC 17 tournament context is probably historical/context only under the strict title-win model. Cody needs to decide whether UFC tournament championship gets any Championship Index.

---

## Score edits applied by championship-score-corrections.js

| Fighter | Prior Championship | Corrected Championship | Total score impact |
|---|---:|---:|---:|
| Matt Hughes | 16.90 | 17.09 | +0.19 |
| Charles Oliveira | 5.32 | 4.56 | -0.76 |
| Aljamain Sterling | 9.10 | 6.65 | -2.45 |
| T.J. Dillashaw | 10.25 | 9.49 | -0.76 |
| Frankie Edgar | 6.80 | 5.70 | -1.10 |
| Dustin Poirier | 4.75 | 1.42 | -3.33 |
| Justin Gaethje | 7.00 | 4.75 | -2.25 |

The correction module also re-sorts the men’s board by total raw score after applying Championship corrections.

## Open Championship decisions

1. Dan Henderson UFC 17 tournament value: strict 0.00, or small old-era tournament credit?
2. Petr Yan exact title-count/index audit.
3. Merab Dvalishvili exact title-count/index audit.
4. Ilia Topuria exact title-count/index audit.
5. Alex Pereira exact title-count/index audit.
6. Justin Gaethje exact title-count/index audit.
7. Whether to run the same audit for the women’s board now or after the men’s board is fully cleaned.
