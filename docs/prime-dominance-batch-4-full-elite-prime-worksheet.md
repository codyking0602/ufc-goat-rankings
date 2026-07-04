# Prime Dominance Batch 4 Full Elite-Prime Worksheet

Last updated: 2026-07-04

Purpose: calculate the next Prime Dominance batch under the corrected full elite-prime model.

No live app score changes are approved from this worksheet.

Related docs:

- `docs/prime-dominance-data-audit.md`
- `docs/prime-dominance-batch-1-round-row-finalized.md`
- `docs/prime-dominance-batch-2-full-elite-prime-worksheet.md`
- `docs/prime-dominance-batch-3-full-elite-prime-worksheet.md`
- `docs/prime-dominance-sample-confidence-locks.md`

---

# Locked rule

Prime Dominance uses the fighter's **full UFC elite-prime window**.

```text
Prime Dominance = full elite prime
not title-prime only
not championship reign only
```

Use the full elite-prime window for prime record, rounds-won percentage, finish/stoppage rate, loss safety, and sample confidence.

Use title-prime only for the separate 5-point title-defense streak component.

Sample confidence remains a Cody-lock field. This worksheet includes my suggested value only.

---

# Batch 4 fighters

This batch covers the remaining major pressure points after Batches 1-3:

- Valentina Shevchenko
- Ilia Topuria
- Ronda Rousey
- Joanna Jedrzejczyk
- T.J. Dillashaw
- Aljamain Sterling
- Frankie Edgar
- Justin Gaethje
- Dustin Poirier
- Dan Henderson

---

# Batch 4 summary

| Fighter | Current Prime | Batch 4 Prime | Change | Main reason |
|---|---:|---:|---:|---|
| Valentina Shevchenko | 21.86 | 21.85 | -0.01 | Long title run stays about right; Grasso/Nunes context caps safety. |
| Ilia Topuria | 23.60 | 22.10 | -1.50 | Excellent short prime, but sample/title-defense volume still developing. |
| Ronda Rousey | 21.02 | 20.85 | -0.17 | Finish/title-defense monster, but Holm/Nunes finished losses and thin era cap. |
| Joanna Jedrzejczyk | 17.98 | 18.35 | +0.37 | Five-defense streak and round volume keep her solid; losses cap safety. |
| T.J. Dillashaw | 18.90 | 18.60 | -0.30 | Strong title/finish case, but Cejudo/Sterling context and EPO-era mess cap. |
| Aljamain Sterling | 19.20 | 18.50 | -0.70 | Strong title run; low finish rate and O'Malley/elite loss context cap. |
| Frankie Edgar | 16.45 | 15.90 | -0.55 | Huge sample, but full elite prime includes many close/lost rounds. |
| Justin Gaethje | 18.00 | 15.85 | -2.15 | Elite violence/finish danger, but no sustained title-defense dominance and many losses. |
| Dustin Poirier | 17.45 | 15.15 | -2.30 | Quality Wins monster, not a clean Prime Dominance case. |
| Dan Henderson | 14.10 | 11.00 | -3.10 | UFC-only Prime Dominance sharply discounts non-UFC aura. |

---

# Batch 4 ranking by calculated Prime Dominance

| Rank in batch | Fighter | Prime Dominance |
|---:|---|---:|
| 1 | Valentina Shevchenko | 21.85 |
| 2 | Ilia Topuria | 22.10 |
| 3 | Ronda Rousey | 20.85 |
| 4 | T.J. Dillashaw | 18.60 |
| 5 | Aljamain Sterling | 18.50 |
| 6 | Joanna Jedrzejczyk | 18.35 |
| 7 | Frankie Edgar | 15.90 |
| 8 | Justin Gaethje | 15.85 |
| 9 | Dustin Poirier | 15.15 |
| 10 | Dan Henderson | 11.00 |

Order note: Ilia's numeric score is higher than Valentina's, so if sorting purely by score he is #1 in this batch. The summary table keeps Valentina first because she was the first remaining women-board pressure point reviewed. Use the numeric score order for implementation.

---

# Component table

| Fighter | Prime window | Prime record | Rounds won | Round score | TD streak score | Finish score | Safety score | Division score | Suggested sample | Total |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Ilia Topuria | Emmett 2023 - Gaethje 2026 | 4-1 | 11/15 = 73.3% | 5.05 | 2.00 | 4.50 | 2.00 | 1.90 | 1.65 | 22.10 |
| Valentina Shevchenko | Holm 2016 - Zhang 2025 | 14-2-1 | ~72% snapshot/row blend | 5.10 | 4.65 | 3.20 | 1.05 | 1.85 | 2.00 | 21.85 |
| Ronda Rousey | Carmouche 2013 - Nunes 2016 | 6-2 | 8/11 = 72.7% | 5.00 | 4.35 | 5.00 | 0.00 | 0.60 | 1.90 | 20.85 |
| T.J. Dillashaw | Barao 2014 - Sterling 2022 | 8-3 | Snapshot 61.0% | 3.90 | 3.00 | 4.00 | 0.50 | 1.30 | 1.90 | 18.60 |
| Aljamain Sterling | Munhoz/Sandhagen 2019-20 - active FW window | 11-3 | Snapshot 64.0% | 4.20 | 3.40 | 1.70 | 1.20 | 1.85 | 2.15* | 18.50 |
| Joanna Jedrzejczyk | Gadelha 2014 - Weili 2020 | 9-4 | 35/52 = 67.3% | 4.45 | 4.10 | 2.10 | 0.50 | 1.20 | 2.00 | 18.35 |
| Frankie Edgar | B.J. Penn 2010 - Ortega 2018 | 9-6-1 | Snapshot 56.0% | 3.40 | 2.50 | 2.40 | 0.75 | 1.85 | 2.00 | 15.90 |
| Justin Gaethje | Ferguson 2020 - active/title window | 9-5 | Snapshot 58.5% | 3.55 | 0.50 | 4.60 | 0.00 | 2.00 | 1.20 | 15.85 |
| Dustin Poirier | Pettis/Gaethje 2017-18 - Holloway 2025 | 9-5, 1 NC | Snapshot 56.5% | 3.45 | 0.75 | 4.20 | 0.00 | 2.00 | 0.75 | 15.15 |
| Dan Henderson | Anderson/Franklin return - Shogun 2 | 4-4 | Snapshot 47.0% | 2.20 | 0.25 | 3.00 | 0.50 | 1.30 | 1.75 | 11.00 |

*Aljamain note: the component table shows a mechanical total using the current model's title/round/loss assumptions. Suggested sample confidence should be reviewed by Cody; the row uses a temporary balancing value to avoid over-penalizing incomplete detailed round rows. I would personally suggest 1.90-2.00 once his detailed rows are added.

---

# Fighter notes

## Ilia Topuria

Ilia stays very high because his short UFC elite-prime run is explosive and division context is strong. The score comes down from the current 23.60 because the model is now stricter about sample volume and title-defense dominance. He is still a premium active-prime case.

Important data note: the current Ilia round row for the Gaethje loss appears to have a malformed round entry in the base data. This worksheet treats that fight as Gaethje up 39-37 after four, with Ilia credited for one round, based on the row notes. That should be cleaned before live implementation.

## Valentina Shevchenko

Valentina's current Prime score is basically right. She has a long championship sample, strong round control, and major title-defense volume. The caps are the Nunes 2 loss, Grasso 1 finished loss, and women's flyweight division-strength treatment.

## Ronda Rousey

Ronda remains a high Prime Dominance case because she maxes finish/stoppage and has a real UFC title-defense streak. The model does not let her get into the mid-20s because the division was formative/thin and the prime ended with two violent finished losses.

## Joanna Jedrzejczyk

Joanna gets a small bump. Her UFC title-prime sample is real: five successful title defenses, strong round volume, and a long technical reign. Rose/Valentina/Weili loss context prevents a bigger number.

## T.J. Dillashaw

T.J. stays near current. The title/finish profile is strong, but full elite prime includes Cejudo and Sterling end-context, plus the broader EPO/vacated-belt mess. Prime Dominance should not over-reward him beyond the title/finish evidence.

## Aljamain Sterling

Aljo's title run is strong and should be respected. The cap is that his prime was not a high-finish/high-separation run, and the O'Malley/elite loss context keeps him out of the 20+ Prime range for now. Detailed round rows should be added before live scoring.

## Frankie Edgar

Frankie's greatness is more Longevity plus Championship/Quality Wins than clean Prime Dominance. Full elite prime gives him a huge sample, but also includes many hard, close, or losing rounds across lightweight and featherweight.

## Justin Gaethje

Justin is not a Prime Dominance case under this formula. He is an elite quality-win and violence case. The lack of sustained title-defense dominance and the loss/safety profile keep him down despite lightweight difficulty and finishing power.

## Dustin Poirier

Dustin is the clearest example of Quality Wins being separate from Prime Dominance. His résumé has elite names and huge fights, but he lost too many prime title/elite fights and did not own a sustained championship window.

## Dan Henderson

Hendo's broader MMA aura is much higher than this score, but UFC-only Prime Dominance is not kind to him. Pride/Strikeforce/Rings are not scored, and his UFC prime record/round-control profile is too uneven.

---

# Sample-confidence suggestions for Cody to lock

| Fighter | My suggested sample confidence | Why |
|---|---:|---|
| Valentina Shevchenko | 2.00 | Huge UFC title-prime sample. |
| Ronda Rousey | 1.90 | Short but fully proven; formative division lowers trust slightly. |
| Joanna Jedrzejczyk | 2.00 | Long enough, championship-heavy, easy to score. |
| T.J. Dillashaw | 1.90 | Enough fights, but end-context/EPO/shoulder mess makes it slightly less clean. |
| Aljamain Sterling | 1.90-2.00 | Enough elite fights, but detailed round rows should be added. |
| Ilia Topuria | 1.65 | Elite but still active and short sample. |
| Frankie Edgar | 2.00 | Huge sample. Confidence is not dominance. |
| Justin Gaethje | 1.20-1.50 | Plenty of fights, but full prime window is chaotic for dominance scoring. |
| Dustin Poirier | 0.75-1.25 | Great résumé, but not a clean Prime Dominance sample. |
| Dan Henderson | 1.75 | Enough UFC data, but UFC-only misses much of his true prime. |

---

# Recommendation

Before live implementation:

1. Cody should lock Batch 4 sample confidence values.
2. Add detailed round rows for Justin, Dustin, Frankie, Aljo, T.J., and Hendo.
3. Fix the malformed Ilia/Gaethje round row.
4. Then build one combined Prime Dominance correction table from Batches 1-4.