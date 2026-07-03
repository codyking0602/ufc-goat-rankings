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
| DQ title win | TBD | Always ask Cody |
| Injury-compromised title win/defense | TBD | Always ask Cody |
| PED/vacated belt context | TBD | Always ask Cody whether to discount Championship or handle elsewhere |

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

Locked calls:

- Bisping second-division title win stays 1.25 because Bisping was the sitting UFC middleweight champion and GSP moved up.
- Interim Hughes 3 stays 0.75.

Recommended action: keep current Championship score.

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

Locked calls:

- Championship is division-neutral. Flyweight depth does not discount title-fight wins here.
- Inaugural/vacant title value stays 0.90.

Recommended action: keep current Championship score.

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

Locked calls:

- Middleweight era strength does not discount Championship directly.
- Weidman losses do not affect Championship score.

Recommended action: keep current Championship score.

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

Locked calls:

- Oliveira vacant-title win stays 0.90 in Championship; Oliveira quality is rewarded in Opponent Quality.
- JDM second-division undisputed title win stays 1.25.
- No short-notice/replacement discount in Championship unless opponent was visibly compromised.

Recommended action: keep current Championship score.

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

Locked calls:

- Iaquinta vacant-title win stays 0.90 because the belt was official.
- Iaquinta opponent weakness belongs in Opponent Quality, not Championship.

Recommended action: keep current Championship score.

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

Locked calls:

- Holloway 2 is an official title win and counts as normal 1.00 in Championship.
- Vacant title vs Lopes 1 stays 0.90.
- Up-division Islam title losses do not add Championship credit.

Recommended action: keep current Championship score.

Status: Locked.

---

## Batch 2 — messy / important championship cases

### 8. Randy Couture

| Item | Value |
|---|---:|
| Current Championship Score | 17.09 |
| Implied Championship Index from score | 9.00 |

Working audit view:

| Component | Proposed treatment |
|---|---|
| Normal UFC title wins/defenses | Count at 1.00 each |
| Interim title win, if applicable | Count at 0.75 |
| Old-era tournament/title structure | Needs fact audit before final lock |
| Heavyweight and light heavyweight title value | Championship is division-neutral; both count by title type |

Concerns / Cody calls:

1. Randy's title history spans older UFC structures. Before editing score, verify exact official title-fight wins and whether any tournament-style title result is being included.
2. Current score implies a 9.00 Championship Index, which may be correct but needs fact audit because old-era title lineage is not as clean as modern reigns.
3. Do not discount him for jumping divisions inside Championship; that belongs elsewhere.

Recommended action: do not change score yet. Fact-audit exact title wins first.

Status: Needs fact audit.

---

### 9. Matt Hughes

| Item | Value |
|---|---:|
| Current Championship Score | 16.90 |
| Implied Championship Index from score | 8.90 |

Working audit view:

| Component | Proposed treatment |
|---|---|
| Normal UFC welterweight title wins/defenses | Count at 1.00 each |
| Vacant/lineage oddities, if any | Use locked 0.90 if vacant |
| Interim title loss/win context | No Championship credit for losses |

Concerns / Cody calls:

1. Current score implies 8.90 adjusted title wins, which likely means one title item is discounted or classified as vacant/old-lineage.
2. Hughes' official UFC title-fight wins need a clean count before score edits.
3. His losses to Penn/GSP do not hurt Championship; they belong in Penalty and Prime Dominance.

Recommended action: do not change score yet. Fact-audit exact title wins first.

Status: Needs fact audit.

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

Concerns / Cody calls:

1. WEC title reign remains excluded from Championship. It can be mentioned as history/context only.
2. UFC absorbed Aldo as champion, but this model counts UFC title-fight wins, not WEC defenses or pre-UFC belt value.
3. Interim title over Edgar stays 0.75 under locked rule.

Recommended action: keep current Championship score.

Status: Locked.

---

### 11. Daniel Cormier

| Item | Value |
|---|---:|
| Current Championship Score | 11.68 |
| Implied / expected Championship Index | 6.15 |

Working title breakdown:

| Component | Count | Weight | Value |
|---|---:|---:|---:|
| Vacant undisputed LHW title vs Anthony Johnson | 1 | 0.90 | 0.90 |
| Normal LHW defenses | 3 | 1.00 | 3.00 |
| Second-division undisputed HW title vs Stipe | 1 | 1.25 | 1.25 |
| Normal HW title defense vs Derrick Lewis | 1 | 1.00 | 1.00 |
| Total | 6 official | — | 6.15 |

Concerns / Cody calls:

1. Jon Jones no-contest/title context does not add a title win for DC.
2. Vacant LHW title stays 0.90 under locked rule.
3. Stipe second-division sitting-champ win stays 1.25.

Recommended action: keep current Championship score.

Status: Locked.

---

### 12. Stipe Miocic

| Item | Value |
|---|---:|
| Current Championship Score | 11.39 |
| Implied / expected Championship Index | 6.00 |

Working title breakdown:

| Component | Count | Weight | Value |
|---|---:|---:|---:|
| Normal UFC heavyweight title wins/defenses | 6 | 1.00 | 6.00 |
| Total | 6 official | — | 6.00 |

Concerns / Cody calls:

1. Heavyweight division volatility does not discount Championship directly.
2. DC trilogy losses do not reduce Championship; they belong in Penalty/Prime Dominance.
3. No vacant/interim weirdness in current title count.

Recommended action: keep current Championship score.

Status: Locked.

---

### 13. Israel Adesanya

| Item | Value |
|---|---:|
| Current Championship Score | 14.72 |
| Implied / expected Championship Index | 7.75 |

Working title breakdown:

| Component | Count | Weight | Value |
|---|---:|---:|---:|
| Interim UFC middleweight title win vs Gastelum | 1 | 0.75 | 0.75 |
| Normal UFC middleweight title wins/defenses | 7 | 1.00 | 7.00 |
| Total | 8 official | — | 7.75 |

Concerns / Cody calls:

1. Interim Gastelum win stays 0.75 under locked rule.
2. Jan/Blachowicz up-division title loss does not add Championship credit.
3. Pereira/Du Plessis/Strickland losses do not reduce Championship directly.

Recommended action: keep current Championship score.

Status: Locked.

---

### 14. Aljamain Sterling

| Item | Value |
|---|---:|
| Current Championship Score | 9.10 |
| Current stored adjusted title wins / Championship Index | 3.50 |
| Formula score from stored 3.50 index | 6.65 |

Current stored title note:

| Component | Stored treatment |
|---|---|
| Four UFC bantamweight title-fight wins | Official count acknowledged |
| Yan DQ title win | Discounted |
| Yan rematch / TJ / Cejudo | Count heavily |

Concerns / Cody calls:

1. Current Championship score is inconsistent with the stored adjusted title index. A 3.50 index should produce about 6.65, not 9.10, using Jon's 15.80 standard.
2. DQ title win needs a Cody-locked value. Recommendation range: 0.25 to 0.50.
3. TJ injury-compromised defense needs a Cody-locked value. Recommendation range: 0.50 to 0.75.
4. Yan rematch and Cejudo defense should count as normal 1.00 unless Cody wants a returning-Cejudo discount. Recommendation: count both normal.

Possible adjusted index options:

| Rule choice | Formula | Index | Championship Score |
|---|---|---:|---:|
| Conservative | Yan DQ 0.25 + Yan 2 1.00 + TJ 0.50 + Cejudo 1.00 | 2.75 | 5.22 |
| Middle | Yan DQ 0.40 + Yan 2 1.00 + TJ 0.65 + Cejudo 1.00 | 3.05 | 5.79 |
| Generous | Yan DQ 0.50 + Yan 2 1.00 + TJ 0.75 + Cejudo 1.00 | 3.25 | 6.17 |
| Current stored index | Stored adjusted title wins | 3.50 | 6.65 |
| Current stored category score implies | Backsolved from 9.10 score | 4.79 | 9.10 |

Recommended action: ask Cody to lock Aljo DQ and TJ-injury values, then edit Championship score to formula output.

Status: Needs Cody call + Needs score edit.

---

### 15. T.J. Dillashaw

| Item | Value |
|---|---:|
| Current Championship Score | 10.25 |
| Current stored adjusted title wins / Championship Index | 5.00 |
| Formula score from stored 5.00 index | 9.49 |

Current stored title note:

| Component | Count | Weight | Value |
|---|---:|---:|---:|
| UFC bantamweight title-fight wins | 5 | 1.00 | 5.00 |
| Total | 5 official | — | 5.00 |

Concerns / Cody calls:

1. Current Championship score is inconsistent with the stored 5.00 index. A 5.00 index should produce about 9.49, not 10.25, using Jon's 15.80 standard.
2. EPO/vacated belt context needs Cody call: discount Championship directly or count title wins officially and handle PED context elsewhere.
3. Recommendation: count the five official title wins at 1.00 each in Championship, then handle EPO/vacated-belt legacy in Penalty/Context rather than rewriting title history.

Possible adjusted index options:

| Rule choice | Formula | Index | Championship Score |
|---|---|---:|---:|
| Official title wins only | 5 × 1.00 | 5.00 | 9.49 |
| Small PED championship haircut | 5.00 minus 0.25 | 4.75 | 9.02 |
| Larger PED championship haircut | 5.00 minus 0.50 | 4.50 | 8.54 |
| Current stored category score implies | Backsolved from 10.25 score | 5.40 | 10.25 |

Recommended action: ask Cody where PED/vacated-belt context belongs, then edit Championship score to formula output.

Status: Needs Cody call + Needs score edit.

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

## Open Championship decisions

1. Aljamain Sterling Yan DQ title-win value.
2. Aljamain Sterling TJ injury-compromised title-defense value.
3. T.J. Dillashaw PED/vacated-belt treatment: Championship haircut or context/penalty only.
4. Randy Couture exact old-era title count/index.
5. Matt Hughes exact old-era title count/index.

## Next batch

Batch 3 should cover:

- Alex Pereira
- B.J. Penn
- Charles Oliveira
- Henry Cejudo
- Conor McGregor
- Dominick Cruz
- Francis Ngannou
- Chuck Liddell
- Frankie Edgar
- Dustin Poirier
- Justin Gaethje

Reasons: two-division title cases, vacant title cases, interim title cases, UFC-only vs non-UFC context, and title-fight volume checks.
