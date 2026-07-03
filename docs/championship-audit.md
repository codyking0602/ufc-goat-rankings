# Championship Audit Pass

Last updated: 2026-07-03

Purpose: make the Championship category formula-based, fluid, and reviewable. This document is the audit trail for title-fight value decisions before scoring-table edits are made.

## Core rule

Championship score is fluid, not permanently anchored to one fighter.

```text
Championship Score = 30 × Fighter Championship Index ÷ Current Best Championship Index
```

If a future fighter passes Jon Jones in Championship Index, that fighter becomes the new 30-point championship standard and everyone else scales down.

## Locked title weights

Cody locked these on 2026-07-03.

| Title result type | Locked value | Status |
|---|---:|---|
| Normal undisputed UFC title win or defense | 1.00 | Locked |
| Interim UFC title win | 0.75 | Locked |
| Vacant undisputed UFC title win | 0.90 | Locked |
| Second-division undisputed UFC title win over sitting champion | 1.25 | Locked |
| Vacant second-division UFC title win | 1.15 | Locked |
| DQ title win | Case-by-case | Ask Cody unless already locked for that fighter |
| Injury-compromised title win/defense | Case-by-case | Ask Cody unless already locked for that fighter |
| PED/vacated belt context | Case-by-case | Ask Cody whether to discount Championship or handle elsewhere |

## Locked category principles

| Principle | Decision |
|---|---|
| Championship is division-neutral | Locked. Division strength belongs in Opponent Quality and Prime Dominance, not raw title-fight value. |
| Close/controversial official title wins | Locked. Count official title wins normally in Championship; handle round/control concerns in Prime Dominance. |
| Title losses | No Championship credit. Title losses belong in Penalty / Prime Dominance context. |
| No contests | Excluded from Championship title-win count unless Cody later creates a special context rule. |

## Audit status legend

| Status | Meaning |
|---|---|
| Locked | No obvious subjective call remaining under current rules |
| Needs Cody call | A weird/contextual title item needs Cody to lock the discount/value |
| Needs fact audit | We need to verify exact title count/history before changing scores |
| Needs score edit | The title index and stored Championship score do not match the locked formula |

---

## Batch 1 — top modern standards

### 1. Jon Jones

| Item | Value |
|---|---:|
| Current Championship Score | 30.00 |
| Official UFC title-fight wins shown in model | 16 |
| Adjusted title wins / Championship Index | 15.80 |

| Component | Count | Weight | Value |
|---|---:|---:|---:|
| Normal title wins/defenses | 13 | 1.00 | 13.00 |
| Interim title win | 1 | 0.75 | 0.75 |
| Vacant undisputed title win | 1 | 0.90 | 0.90 |
| Vacant second-division title win | 1 | 1.15 | 1.15 |
| Total | 16 official | — | 15.80 |

Locked calls:

- Vacant second-division heavyweight title value stays 1.15.
- Jon's no contest/DC 2 title result stays excluded from Championship title-win count.
- Jon remains current Championship standard at 30 unless a future fighter passes his 15.80 index.

Recommended action: keep current Championship score.

Status: Locked.

---

### 2. Georges St-Pierre

| Item | Value |
|---|---:|
| Current Championship Score | 24.68 |
| Official UFC title-fight wins shown in model | 13 |
| Adjusted title wins / Championship Index | 13.00 |

| Component | Count | Weight | Value |
|---|---:|---:|---:|
| Normal title wins/defenses | 11 | 1.00 | 11.00 |
| Interim title win vs Hughes 3 | 1 | 0.75 | 0.75 |
| Second-division undisputed title win vs Bisping | 1 | 1.25 | 1.25 |
| Total | 13 official | — | 13.00 |

Status: Locked.

---

### 3. Demetrious Johnson

| Item | Value |
|---|---:|
| Current Championship Score | 22.59 |
| Official UFC title-fight wins shown in model | 12 |
| Adjusted title wins / Championship Index | 11.90 |

| Component | Count | Weight | Value |
|---|---:|---:|---:|
| Inaugural/vacant flyweight title win vs Benavidez | 1 | 0.90 | 0.90 |
| Normal title defenses/wins | 11 | 1.00 | 11.00 |
| Total | 12 official | — | 11.90 |

Status: Locked.

---

### 4. Anderson Silva

| Item | Value |
|---|---:|
| Current Championship Score | 20.89 |
| Official UFC title-fight wins shown in model | 11 |
| Adjusted title wins / Championship Index | 11.00 |

| Component | Count | Weight | Value |
|---|---:|---:|---:|
| Normal UFC middleweight title wins/defenses | 11 | 1.00 | 11.00 |
| Total | 11 official | — | 11.00 |

Status: Locked.

---

### 5. Islam Makhachev

| Item | Value |
|---|---:|
| Current Championship Score | 11.68 |
| Official UFC title-fight wins shown in model | 6 |
| Adjusted title wins / Championship Index | 6.15 |

| Component | Count | Weight | Value |
|---|---:|---:|---:|
| Vacant undisputed lightweight title vs Oliveira | 1 | 0.90 | 0.90 |
| Normal lightweight defenses/title wins | 4 | 1.00 | 4.00 |
| Second-division undisputed welterweight title vs JDM | 1 | 1.25 | 1.25 |
| Total | 6 official | — | 6.15 |

Status: Locked.

---

### 6. Khabib Nurmagomedov

| Item | Value |
|---|---:|
| Current Championship Score | 7.41 |
| Official UFC title-fight wins shown in model | 4 |
| Adjusted title wins / Championship Index | 3.90 |

| Component | Count | Weight | Value |
|---|---:|---:|---:|
| Vacant undisputed lightweight title vs Iaquinta | 1 | 0.90 | 0.90 |
| Normal title defenses/unifications | 3 | 1.00 | 3.00 |
| Total | 4 official | — | 3.90 |

Status: Locked.

---

### 7. Alexander Volkanovski

| Item | Value |
|---|---:|
| Current Championship Score | 15.00 |
| Official UFC title-fight wins shown in model | 8 |
| Adjusted title wins / Championship Index | 7.90 |

| Component | Count | Weight | Value |
|---|---:|---:|---:|
| Normal featherweight title wins/defenses | 7 | 1.00 | 7.00 |
| Vacant featherweight title win vs Lopes 1 | 1 | 0.90 | 0.90 |
| Total | 8 official | — | 7.90 |

Status: Locked.

---

## Batch 2 — messy / important championship cases

### 8. Randy Couture

| Item | Value |
|---|---:|
| Current Championship Score | 17.09 |
| Locked Championship Index | 9.00 |

Locked calls:

- Cody locked Randy's old-era title treatment as normal for Championship.
- Heavyweight and light heavyweight title wins are division-neutral and count by title type.
- No old-era penalty/discount is applied inside Championship.

Recommended action: keep current Championship score.

Status: Locked.

---

### 9. Matt Hughes

| Item | Value |
|---|---:|
| Current Championship Score | 16.90 |
| Current implied Championship Index | 8.90 |
| Locked Championship Index after Cody normal call | 9.00 |
| Formula score from 9.00 index | 17.09 |

Locked calls:

- Cody locked Hughes' old-era title treatment as normal for Championship.
- No old-era title discount is applied inside Championship.
- His losses to Penn/GSP do not hurt Championship; they belong in Penalty and Prime Dominance.

Recommended action: update Championship score from 16.90 to 17.09 if the exact title count is 9 normal UFC title-fight wins.

Status: Needs score edit.

---

### 10. Jose Aldo

| Item | Value |
|---|---:|
| Current Championship Score | 14.72 |
| Official UFC title-fight wins shown in model | 8 |
| Adjusted title wins / Championship Index | 7.75 |

| Component | Count | Weight | Value |
|---|---:|---:|---:|
| Normal UFC featherweight title wins/defenses | 7 | 1.00 | 7.00 |
| Interim UFC featherweight title win vs Edgar | 1 | 0.75 | 0.75 |
| Total | 8 official | — | 7.75 |

Status: Locked.

---

### 11. Daniel Cormier

| Item | Value |
|---|---:|
| Current Championship Score | 11.68 |
| Championship Index | 6.15 |

| Component | Count | Weight | Value |
|---|---:|---:|---:|
| Vacant undisputed LHW title vs Anthony Johnson | 1 | 0.90 | 0.90 |
| Normal LHW defenses | 3 | 1.00 | 3.00 |
| Second-division undisputed HW title vs Stipe | 1 | 1.25 | 1.25 |
| Normal HW title defense vs Derrick Lewis | 1 | 1.00 | 1.00 |
| Total | 6 official | — | 6.15 |

Status: Locked.

---

### 12. Stipe Miocic

| Item | Value |
|---|---:|
| Current Championship Score | 11.39 |
| Championship Index | 6.00 |

| Component | Count | Weight | Value |
|---|---:|---:|---:|
| Normal UFC heavyweight title wins/defenses | 6 | 1.00 | 6.00 |
| Total | 6 official | — | 6.00 |

Status: Locked.

---

### 13. Israel Adesanya

| Item | Value |
|---|---:|
| Current Championship Score | 14.72 |
| Championship Index | 7.75 |

| Component | Count | Weight | Value |
|---|---:|---:|---:|
| Interim UFC middleweight title win vs Gastelum | 1 | 0.75 | 0.75 |
| Normal UFC middleweight title wins/defenses | 7 | 1.00 | 7.00 |
| Total | 8 official | — | 7.75 |

Status: Locked.

---

### 14. Aljamain Sterling

| Item | Value |
|---|---:|
| Current Championship Score | 9.10 |
| Locked Championship Index | 3.50 |
| Formula score from 3.50 index | 6.65 |

Locked title breakdown:

| Component | Count | Weight | Value |
|---|---:|---:|---:|
| Yan DQ title win | 1 | 0.50 | 0.50 |
| Yan rematch title win/defense | 1 | 1.00 | 1.00 |
| T.J. Dillashaw title defense | 1 | 1.00 | 1.00 |
| Henry Cejudo title defense | 1 | 1.00 | 1.00 |
| Total | 4 official | — | 3.50 |

Locked calls:

- Cody locked Yan DQ title win at 0.50.
- Cody locked TJ injury-compromised defense as full 1.00.
- Cody locked Cejudo defense as normal 1.00.

Recommended action: update Championship score from 9.10 to 6.65.

Status: Needs score edit.

---

### 15. T.J. Dillashaw

| Item | Value |
|---|---:|
| Current Championship Score | 10.25 |
| Locked Championship Index | 5.00 |
| Formula score from 5.00 index | 9.49 |

| Component | Count | Weight | Value |
|---|---:|---:|---:|
| UFC bantamweight title-fight wins | 5 | 1.00 | 5.00 |
| Total | 5 official | — | 5.00 |

Locked calls:

- Cody locked TJ's five title-fight wins as full Championship credit.
- EPO/vacated-belt context does not create a Championship haircut. It stays visible in context/penalty discussion instead.

Recommended action: update Championship score from 10.25 to 9.49.

Status: Needs score edit.

---

## Batch 3 — remaining title-volume / two-division / interim cases

### 16. Alex Pereira

| Item | Value |
|---|---:|
| Current Championship Score | 11.68 |
| Current implied Championship Index | 6.15 |

Working title breakdown:

| Component | Count | Weight | Value |
|---|---:|---:|---:|
| Normal UFC middleweight title win | 1 | 1.00 | 1.00 |
| Vacant second-division LHW title win | 1 | 1.15 | 1.15 |
| Normal LHW title defenses/wins | 4 | 1.00 | 4.00 |
| Total | 6 official | — | 6.15 |

Concerns:

- Two-division structure is already covered by locked rules.
- No extra bonus for speed of becoming champion inside Championship; that belongs in app copy/prime context.

Recommended action: keep current Championship score if title count verifies as 6 official title-fight wins.

Status: Proposed locked / verify exact count.

---

### 17. B.J. Penn

| Item | Value |
|---|---:|
| Current Championship Score | 9.78 |
| Current implied Championship Index | 5.15 |

Working title breakdown implied by score:

| Component | Count | Weight | Value |
|---|---:|---:|---:|
| Second-division/title jump win over Matt Hughes | 1 | 1.25 | 1.25 |
| Vacant lightweight title win | 1 | 0.90 | 0.90 |
| Normal lightweight defenses | 3 | 1.00 | 3.00 |
| Total | 5 official | — | 5.15 |

Concern / Cody call:

- BJ's two-division sequence is unusual because the welterweight title win came before the UFC lightweight title reign. Current score gives the Hughes title win second-division-style 1.25 value. Need Cody to confirm whether two-division bonus applies by achievement, not chronology.

Recommendation: keep 1.25 because he became a two-division UFC champion and beat the sitting welterweight champion.

Status: Needs Cody call.

---

### 18. Charles Oliveira

| Item | Value |
|---|---:|
| Current Championship Score | 5.32 |
| Current implied Championship Index | 2.80 |

Working title breakdown implied by score:

| Component | Count | Weight | Value |
|---|---:|---:|---:|
| Vacant lightweight title win vs Chandler | 1 | 0.90 | 0.90 |
| Normal defense vs Poirier | 1 | 1.00 | 1.00 |
| Gaethje stripped-title-fight context | 1 | 0.90 | 0.90 |
| Total | 3 title-level results | — | 2.80 |

Concern / Cody call:

- Oliveira missed weight before Gaethje and was stripped. Officially, only Gaethje could win the title. Current score appears to give Charles partial/vacant-style Championship credit for the Gaethje win.

Recommendation: ask Cody. A strict official-title model would not count Gaethje as a title-fight win for Charles; a title-level context model can keep 0.90.

Status: Needs Cody call.

---

### 19. Henry Cejudo

| Item | Value |
|---|---:|
| Current Championship Score | 7.88 |
| Current implied Championship Index | 4.15 |

Working title breakdown:

| Component | Count | Weight | Value |
|---|---:|---:|---:|
| Normal flyweight title win vs DJ | 1 | 1.00 | 1.00 |
| Normal flyweight defense vs TJ | 1 | 1.00 | 1.00 |
| Vacant second-division bantamweight title vs Moraes | 1 | 1.15 | 1.15 |
| Normal bantamweight defense vs Cruz | 1 | 1.00 | 1.00 |
| Total | 4 official | — | 4.15 |

Concern:

- Cruz layoff/opponent context does not discount Championship under locked rules; it belongs in Opponent Quality/Prime Dominance.

Recommended action: keep current Championship score.

Status: Locked.

---

### 20. Conor McGregor

| Item | Value |
|---|---:|
| Current Championship Score | 5.70 |
| Current implied Championship Index | 3.00 |

Working title breakdown:

| Component | Count | Weight | Value |
|---|---:|---:|---:|
| Interim featherweight title win vs Mendes | 1 | 0.75 | 0.75 |
| Normal featherweight title win vs Aldo | 1 | 1.00 | 1.00 |
| Second-division undisputed title win vs Alvarez | 1 | 1.25 | 1.25 |
| Total | 3 official | — | 3.00 |

Recommended action: keep current Championship score.

Status: Locked.

---

### 21. Dominick Cruz

| Item | Value |
|---|---:|
| Current Championship Score | 7.59 |
| Current implied Championship Index | 4.00 |

Working title breakdown:

| Component | Count | Weight | Value |
|---|---:|---:|---:|
| Normal UFC bantamweight title wins/defenses | 4 | 1.00 | 4.00 |
| Total | 4 official | — | 4.00 |

Concern:

- WEC reign remains excluded from Championship. It can be mentioned as historical context only.

Recommended action: keep current Championship score.

Status: Locked.

---

### 22. Francis Ngannou

| Item | Value |
|---|---:|
| Current Championship Score | 3.80 |
| Current implied Championship Index | 2.00 |

Working title breakdown:

| Component | Count | Weight | Value |
|---|---:|---:|---:|
| Normal heavyweight title win vs Stipe | 1 | 1.00 | 1.00 |
| Normal heavyweight title defense vs Gane | 1 | 1.00 | 1.00 |
| Total | 2 official | — | 2.00 |

Recommended action: keep current Championship score.

Status: Locked.

---

### 23. Chuck Liddell

| Item | Value |
|---|---:|
| Current Championship Score | 9.49 |
| Current implied Championship Index | 5.00 |

Working title breakdown:

| Component | Count | Weight | Value |
|---|---:|---:|---:|
| Normal UFC light heavyweight title wins/defenses | 5 | 1.00 | 5.00 |
| Total | 5 official | — | 5.00 |

Recommended action: keep current Championship score.

Status: Locked.

---

### 24. Frankie Edgar

| Item | Value |
|---|---:|
| Current Championship Score | 6.80 |
| Current stored adjusted title wins / Championship Index | 3.00 |
| Formula score from 3.00 index | 5.70 |

Working title breakdown:

| Component | Count | Weight | Value |
|---|---:|---:|---:|
| Normal lightweight title win vs B.J. Penn | 1 | 1.00 | 1.00 |
| Normal lightweight defense vs Penn | 1 | 1.00 | 1.00 |
| Normal lightweight defense vs Maynard | 1 | 1.00 | 1.00 |
| Total | 3 official | — | 3.00 |

Recommended action: update Championship score from 6.80 to 5.70.

Status: Needs score edit.

---

### 25. Dustin Poirier

| Item | Value |
|---|---:|
| Current Championship Score | 4.75 |
| Current stored adjusted title wins / Championship Index | 1.00 |
| Formula score from 1.00 index | 1.90 |
| Formula score if interim title is locked at 0.75 | 1.42 |

Working title breakdown:

| Component | Count | Locked weight | Value |
|---|---:|---:|---:|
| Interim lightweight title win vs Max Holloway | 1 | 0.75 | 0.75 |
| BMF bouts | 0 | 0.00 | 0.00 |
| Total | 1 official interim | — | 0.75 |

Concern:

- Current hand-added Championship score is far above the locked formula. BMF and title-challenge losses should not add Championship credit.

Recommended action: update Championship score from 4.75 to 1.42 unless Cody wants interim title wins counted differently for non-champions, which would break the locked 0.75 rule.

Status: Needs score edit.

---

### 26. Justin Gaethje

| Item | Value |
|---|---:|
| Current Championship Score | 7.00 |
| Current stored adjusted title wins / Championship Index | 2.50 |
| Formula score from 2.50 index | 4.75 |

Current stored note says: undisputed lightweight title win plus two interim/title-level wins, total title-fight wins = 3.

Concern:

- Current Championship score is above formula output.
- Need ensure only real UFC title-fight wins count. BMF bouts do not count.

Recommended action: update Championship score from 7.00 to 4.75 if the 2.50 index is correct.

Status: Needs score edit / verify title count.

---

## Current locked decisions

1. Normal undisputed title win/defense = 1.00.
2. Interim title win = 0.75.
3. Vacant undisputed title win = 0.90.
4. Second-division undisputed title over sitting champ = 1.25.
5. Vacant second-division title win = 1.15.
6. Championship is division-neutral.
7. Official close/controversial title wins get no Championship discount.
8. Title losses get no Championship credit and do not reduce Championship score.
9. Aljamain Sterling Yan DQ title win = 0.50.
10. Aljamain Sterling TJ injury-compromised defense = full 1.00.
11. T.J. Dillashaw title wins = full Championship credit; EPO/vacated belt handled outside Championship.
12. Randy Couture old-era title treatment = normal.
13. Matt Hughes old-era title treatment = normal.

## Open Championship decisions

1. B.J. Penn two-division bonus chronology: keep 1.25 for Hughes title win even though WW came before LW reign?
2. Charles Oliveira stripped-title-fight treatment vs Gaethje: count 0.90 title-level credit or strict 0.00 official-title credit?
3. Justin Gaethje exact title count/index verification.
4. Alex Pereira exact title count/index verification.

## Score edits currently indicated by audit

| Fighter | Current Championship | Formula Championship | Change |
|---|---:|---:|---:|
| Matt Hughes | 16.90 | 17.09 | +0.19 |
| Aljamain Sterling | 9.10 | 6.65 | -2.45 |
| T.J. Dillashaw | 10.25 | 9.49 | -0.76 |
| Frankie Edgar | 6.80 | 5.70 | -1.10 |
| Dustin Poirier | 4.75 | 1.42 | -3.33 |
| Justin Gaethje | 7.00 | 4.75 | -2.25 |

## Next batch

Batch 4 should cover remaining lower-title or no-title cases plus women if Cody wants the women's board included in the same audit pass.
