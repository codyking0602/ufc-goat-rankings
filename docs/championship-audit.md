# Championship Audit Pass

Last updated: 2026-07-03

Purpose: make the Championship category formula-based, fluid, and reviewable. This document is the audit trail for title-fight value decisions before scoring-table edits are made.

## Core rule

Championship score should be fluid, not permanently anchored to one fighter.

```text
Championship Score = 30 × Fighter Championship Index ÷ Current Best Championship Index
```

If a future fighter passes Jon Jones in Championship Index, that fighter becomes the new 30-point championship standard and everyone else scales down.

## Current default title weights from existing model

These are the existing defaults already implied in the ranking data. They are not final until Cody locks them.

| Title result type | Current default | Status |
|---|---:|---|
| Normal undisputed UFC title win or defense | 1.00 | Proposed lock |
| Interim UFC title win | 0.75 | Proposed lock |
| Vacant undisputed UFC title win | 0.90 | Needs Cody lock |
| Second-division undisputed UFC title win | 1.25 | Needs Cody lock |
| Vacant second-division UFC title win | 1.15 | Needs Cody lock |
| DQ title win | TBD | Always ask Cody |
| Injury-compromised title win/defense | TBD | Always ask Cody |
| PED/vacated belt context | TBD | Always ask Cody whether to discount Championship or handle elsewhere |

## Audit status legend

| Status | Meaning |
|---|---|
| Locked | No obvious subjective call remaining under current rules |
| Needs Cody call | A weird/contextual title item needs Cody to lock the discount/value |
| Needs fact audit | We need to verify exact title count/history before changing scores |

---

## Batch 1 — top modern standards

### 1. Jon Jones

Current app values:

| Item | Value |
|---|---:|
| Current Championship Score | 30.00 |
| Official UFC title-fight wins shown in model | 16 |
| Adjusted title wins / Championship Index | 15.80 |

Current title breakdown from model:

| Component | Count | Weight | Value |
|---|---:|---:|---:|
| Normal title wins/defenses | 13 | 1.00 | 13.00 |
| Interim title win | 1 | 0.75 | 0.75 |
| Vacant undisputed title win | 1 | 0.90 | 0.90 |
| Vacant second-division title win | 1 | 1.15 | 1.15 |
| Total | 16 official | — | 15.80 |

Concerns / Cody calls:

1. Is vacant second-division heavyweight title value at 1.15 correct, or should it be 1.00 because there was no sitting champion?
2. Should Jon's no contest/DC 2 title result stay excluded from Championship? Recommendation: yes, exclude from title-win count, mention only as context.
3. Should Jon remain the current Championship standard at 30? Recommendation: yes unless the audit finds the adjusted index is wrong.

Recommended action: keep current Championship score for now. Needs Cody call only on vacant second-division weight.

Status: Needs Cody call.

---

### 2. Georges St-Pierre

Current app values:

| Item | Value |
|---|---:|
| Current Championship Score | 24.68 |
| Official UFC title-fight wins shown in model | 13 |
| Adjusted title wins / Championship Index | 13.00 |

Current title breakdown from model:

| Component | Count | Weight | Value |
|---|---:|---:|---:|
| Normal title wins/defenses | 11 | 1.00 | 11.00 |
| Interim title win vs Hughes 3 | 1 | 0.75 | 0.75 |
| Second-division undisputed title win vs Bisping | 1 | 1.25 | 1.25 |
| Total | 13 official | — | 13.00 |

Concerns / Cody calls:

1. Does Bisping second-division title win deserve full 1.25 even though Bisping is not viewed like an elite long-reign champion? Recommendation: yes, because he was the sitting UFC middleweight champion and GSP moved up.
2. Does interim Hughes 3 at 0.75 feel right? Recommendation: yes.

Recommended action: keep current Championship score.

Status: Proposed locked.

---

### 3. Demetrious Johnson

Current app values:

| Item | Value |
|---|---:|
| Current Championship Score | 22.59 |
| Official UFC title-fight wins shown in model | 12 |
| Adjusted title wins / Championship Index | 11.90 |

Current title breakdown from model:

| Component | Count | Weight | Value |
|---|---:|---:|---:|
| Inaugural/vacant flyweight title win vs Benavidez | 1 | 0.90 | 0.90 |
| Normal title defenses/wins | 11 | 1.00 | 11.00 |
| Total | 12 official | — | 11.90 |

Concerns / Cody calls:

1. Should flyweight division strength discount Championship directly, or only affect Opponent Quality / Prime Dominance? Recommendation: do not discount Championship directly. Title wins are title wins; division strength belongs in Opponent Quality and maybe Prime Dominance.
2. Is inaugural/vacant title value at 0.90 right? Recommendation: yes unless Cody wants all vacant titles at 0.85.

Recommended action: keep current Championship score if vacant title weight stays 0.90.

Status: Needs Cody call on whether Championship is division-neutral.

---

### 4. Anderson Silva

Current app values:

| Item | Value |
|---|---:|
| Current Championship Score | 20.89 |
| Official UFC title-fight wins shown in model | 11 |
| Adjusted title wins / Championship Index | 11.00 |

Current title breakdown from model:

| Component | Count | Weight | Value |
|---|---:|---:|---:|
| Normal UFC middleweight title wins/defenses | 11 | 1.00 | 11.00 |
| Total | 11 official | — | 11.00 |

Concerns / Cody calls:

1. Should Anderson's middleweight division strength discount Championship directly? Recommendation: no; if middleweight era strength is discounted, do it in Opponent Quality, not title-fight-win count.
2. Weidman losses do not affect Championship score. They belong in Penalty / Prime Dominance.

Recommended action: keep current Championship score.

Status: Proposed locked.

---

### 5. Islam Makhachev

Current app values:

| Item | Value |
|---|---:|
| Current Championship Score | 11.68 |
| Official UFC title-fight wins shown in model | 6 |
| Adjusted title wins / Championship Index | 6.15 |

Current title breakdown from model:

| Component | Count | Weight | Value |
|---|---:|---:|---:|
| Vacant undisputed lightweight title vs Oliveira | 1 | 0.90 | 0.90 |
| Normal lightweight defenses/title wins | 4 | 1.00 | 4.00 |
| Second-division undisputed welterweight title vs JDM | 1 | 1.25 | 1.25 |
| Total | 6 official | — | 6.15 |

Concerns / Cody calls:

1. Is Oliveira vacant-title win at 0.90 correct, or should elite vacant opponents like Oliveira receive 1.00? Recommendation: keep vacant title value at 0.90 in Championship and reward Oliveira strength in Opponent Quality.
2. Is JDM second-division undisputed title win worth 1.25? Recommendation: yes if he was sitting champion; no if Cody wants second-division titles to be only 1.15.
3. Are any short-notice or replacement title defenses inside the 4 normal defenses that should be discounted? Recommendation: do not discount Championship unless the opponent was visibly compromised; handle opponent strength elsewhere.

Recommended action: keep current Championship score pending Cody's second-division/vacant-title locks.

Status: Needs Cody call.

---

### 6. Khabib Nurmagomedov

Current app values:

| Item | Value |
|---|---:|
| Current Championship Score | 7.41 |
| Official UFC title-fight wins shown in model | 4 |
| Adjusted title wins / Championship Index | 3.90 |

Current title breakdown from model:

| Component | Count | Weight | Value |
|---|---:|---:|---:|
| Vacant undisputed lightweight title vs Iaquinta | 1 | 0.90 | 0.90 |
| Normal title defenses/unifications | 3 | 1.00 | 3.00 |
| Total | 4 official | — | 3.90 |

Concerns / Cody calls:

1. Iaquinta was not a clean elite title opponent, but the title was official. Should the vacant title win remain 0.90? Recommendation: yes for Championship, with opponent weakness handled in Opponent Quality.
2. Khabib's lack of title volume is the whole Championship ceiling; no adjustment needed beyond vacant title value.

Recommended action: keep current Championship score if vacant titles stay 0.90.

Status: Needs Cody call on vacant title value.

---

### 7. Alexander Volkanovski

Current app values:

| Item | Value |
|---|---:|
| Current Championship Score | 15.00 |
| Official UFC title-fight wins shown in model | 8 |
| Adjusted title wins / Championship Index | 7.90 |

Current title breakdown from model:

| Component | Count | Weight | Value |
|---|---:|---:|---:|
| Normal featherweight title wins/defenses | 7 | 1.00 | 7.00 |
| Vacant featherweight title win vs Lopes 1 | 1 | 0.90 | 0.90 |
| Total | 8 official | — | 7.90 |

Concerns / Cody calls:

1. Holloway 2 was close/controversial, but official result should count as a normal title win. Recommendation: no Championship discount.
2. Vacant title vs Lopes 1 at 0.90 depends on the global vacant-title rule. Recommendation: keep 0.90.
3. Up-division Islam title losses should not add Championship credit. They belong only as context in Opponent Quality/Penalty.

Recommended action: keep current Championship score if vacant titles stay 0.90.

Status: Needs Cody call on vacant title value.

---

## Batch 1 decisions needed from Cody

Please lock these before scoring edits:

1. Vacant undisputed UFC title win value: keep 0.90, move to 0.85, or case-by-case?
2. Vacant second-division UFC title win value: keep 1.15 or move to 1.00?
3. Second-division undisputed title over a sitting champ: keep 1.25?
4. Should Championship be division-neutral? Recommendation: yes. Division strength should affect Opponent Quality and Prime Dominance, not raw title-fight-win value.
5. Should official close/controversial title wins get any Championship discount? Recommendation: no. Use official result in Championship; handle dominance in Prime Dominance.

## Next batch

Batch 2 should cover the messy/important Championship cases:

- Randy Couture
- Matt Hughes
- Jose Aldo
- Daniel Cormier
- Stipe Miocic
- Israel Adesanya
- Aljamain Sterling
- T.J. Dillashaw

Reasons: old-era title structures, second-division/vacant title questions, UFC-only Aldo treatment, DQ/injury title context, and PED/vacated-belt context.
