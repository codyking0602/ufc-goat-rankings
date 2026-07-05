# Prime Dominance Batches 1-4 — No Sample Confidence

Last updated: 2026-07-04

Purpose: redo completed Prime Dominance batches after Cody decided to remove the sample-confidence component.

No live app score changes are approved from this worksheet.

Related docs:

- `docs/prime-dominance-data-audit.md`
- `docs/prime-dominance-batch-1-round-row-finalized.md`
- `docs/prime-dominance-batch-2-full-elite-prime-worksheet.md`
- `docs/prime-dominance-batch-3-full-elite-prime-worksheet.md`
- `docs/prime-dominance-batch-4-full-elite-prime-worksheet.md` — superseded for scoring by this no-sample sheet
- `docs/prime-dominance-sample-confidence-locks.md` — deprecated for scoring after sample confidence was removed

---

# Cody decision

Remove sample confidence from Prime Dominance.

Reason: sample confidence was starting to blur Prime Dominance with Longevity and subjective career cleanliness.

Prime Dominance should answer:

```text
When this fighter was elite, how dominant were they?
```

Longevity should answer:

```text
How long did this fighter keep proving elite UFC relevance?
```

---

# New locked Prime Dominance formula

```text
Prime Dominance / 30 =
Prime record / 7
+ Prime rounds won / 7
+ Consecutive title-defense dominance / 5
+ Prime finish/stoppage / 5
+ Prime loss safety / 4
+ Division strength / 2
```

| Component | Max | What it measures |
|---|---:|---|
| Prime record | 7 | Winning during full elite-prime window. |
| Prime rounds won | 7 | Actual control during full elite-prime fights. |
| Consecutive title-defense dominance | 5 | Repeatedly staying champion once at the top. |
| Prime finish/stoppage | 5 | Separation, damage, and danger. |
| Prime loss safety | 4 | Avoiding damaging prime losses / finished losses. |
| Division strength / prime difficulty | 2 | Structural difficulty of the prime environment. |
| **Total** | **30** | Clean Prime Dominance score. |

---

# Important data-source clarification

Some fighters have detailed per-fight `rounds` rows in the repo. Other newer added fighters have audited snapshot fields instead, including:

- `primeRecord`
- `roundsWonPct`
- `finishRatePct`
- `activeEliteYears`
- `timesFinishedPrime`

Those audited snapshots are valid scoring inputs.

They should not be described as missing data. They are simply less transparent than detailed fight-by-fight rows.

Current snapshot-audited fighters in this pass include:

- Justin Gaethje
- Frankie Edgar
- Dustin Poirier
- Aljamain Sterling
- T.J. Dillashaw
- Dan Henderson
- Petr Yan for the current batch pass

Future detailed `rounds` rows would be a transparency upgrade, not a requirement to trust the existing audited snapshot numbers.

---

# Conversion method used here

For completed Batches 1-4, the old 6-point Prime Record and Prime Rounds components were converted as:

```text
New 7-point component = Old 6-point component × 7 / 6
```

All other components stayed the same:

- Title-defense dominance / 5
- Finish/stoppage / 5
- Loss safety / 4
- Division strength / 2

Sample confidence was removed entirely.

---

# Batch 1 redo

| Fighter | Prior worksheet Prime | No-sample Prime | Change |
|---|---:|---:|---:|
| Jon Jones | 27.95 | 28.05 | +0.10 |
| Khabib Nurmagomedov | 27.50 | 27.50 | 0.00 |
| Demetrious Johnson | 26.00 | 26.11 | +0.11 |
| Amanda Nunes | 25.50 | 25.22 | -0.28 |
| Georges St-Pierre | 24.40 | 24.29 | -0.11 |
| Anderson Silva | 24.00 | 23.70 | -0.30 |
| Alexander Volkanovski | 22.50 | 22.25 | -0.25 |
| Max Holloway | 20.10 | 19.48 | -0.62 |

## Batch 1 component table

| Fighter | Record / 7 | Rounds / 7 | Title / 5 | Finish / 5 | Safety / 4 | Division / 2 | New Prime |
|---|---:|---:|---:|---:|---:|---:|---:|
| Jon Jones | 7.00 | 7.00 | 4.75 | 3.65 | 4.00 | 1.65 | 28.05 |
| Khabib Nurmagomedov | 7.00 | 7.00 | 3.40 | 4.10 | 4.00 | 2.00 | 27.50 |
| Demetrious Johnson | 6.30 | 6.71 | 5.00 | 3.75 | 3.25 | 1.10 | 26.11 |
| Amanda Nunes | 6.12 | 5.89 | 4.65 | 4.85 | 2.25 | 1.45 | 25.22 |
| Georges St-Pierre | 6.24 | 7.00 | 4.80 | 2.35 | 2.00 | 1.90 | 24.29 |
| Anderson Silva | 5.43 | 5.43 | 5.00 | 4.85 | 1.55 | 1.45 | 23.70 |
| Alexander Volkanovski | 5.78 | 6.12 | 4.10 | 2.55 | 1.85 | 1.85 | 22.25 |
| Max Holloway | 4.96 | 4.32 | 3.20 | 3.35 | 1.80 | 1.85 | 19.48 |

---

# Batch 2 redo

| Fighter | Prior worksheet Prime | No-sample Prime | Change |
|---|---:|---:|---:|
| Islam Makhachev | 28.25 | 28.45 | +0.20 |
| Cain Velasquez | 21.40 | 21.42 | +0.02 |
| Kamaru Usman | 21.50 | 21.18 | -0.32 |
| Matt Hughes | 19.65 | 19.05 | -0.60 |
| Jose Aldo | 19.35 | 18.78 | -0.57 |
| Stipe Miocic | 19.25 | 18.73 | -0.52 |
| Daniel Cormier | 19.20 | 18.62 | -0.58 |
| Charles Oliveira | 18.35 | 17.96 | -0.39 |
| Israel Adesanya | 16.65 | 15.95 | -0.70 |

## Batch 2 component table

| Fighter | Record / 7 | Rounds / 7 | Title / 5 | Finish / 5 | Safety / 4 | Division / 2 | New Prime |
|---|---:|---:|---:|---:|---:|---:|---:|
| Islam Makhachev | 7.00 | 7.00 | 3.85 | 4.60 | 4.00 | 2.00 | 28.45 |
| Cain Velasquez | 5.31 | 6.01 | 3.00 | 4.75 | 1.00 | 1.35 | 21.42 |
| Kamaru Usman | 4.96 | 5.78 | 4.10 | 3.05 | 1.50 | 1.80 | 21.18 |
| Matt Hughes | 4.26 | 5.19 | 4.10 | 4.15 | 0.00 | 1.35 | 19.05 |
| Jose Aldo | 4.32 | 5.37 | 4.65 | 2.70 | 0.00 | 1.75 | 18.78 |
| Stipe Miocic | 4.08 | 5.25 | 3.40 | 4.40 | 0.25 | 1.35 | 18.73 |
| Daniel Cormier | 4.20 | 4.32 | 3.40 | 4.25 | 1.00 | 1.45 | 18.62 |
| Charles Oliveira | 4.08 | 5.43 | 2.00 | 4.20 | 0.25 | 2.00 | 17.96 |
| Israel Adesanya | 3.68 | 4.38 | 4.10 | 2.35 | 0.00 | 1.45 | 15.95 |

---

# Batch 3 redo

| Fighter | Prior worksheet Prime | No-sample Prime | Change |
|---|---:|---:|---:|
| Merab Dvalishvili | 21.85 | 22.02 | +0.17 |
| Chuck Liddell | 21.45 | 21.20 | -0.25 |
| Francis Ngannou | 19.70 | 19.45 | -0.25 |
| Alex Pereira | 18.50 | 18.12 | -0.38 |
| Dominick Cruz | 18.15 | 17.62 | -0.53 |
| Conor McGregor | 18.05 | 17.40 | -0.65 |
| B.J. Penn | 18.00 | 17.12 | -0.88 |
| Henry Cejudo | 16.75 | 16.23 | -0.52 |
| Petr Yan | 16.15 | 15.82 | -0.33 |
| Randy Couture | 16.50 | 15.65 | -0.85 |

## Batch 3 component table

| Fighter | Record / 7 | Rounds / 7 | Title / 5 | Finish / 5 | Safety / 4 | Division / 2 | New Prime |
|---|---:|---:|---:|---:|---:|---:|---:|
| Merab Dvalishvili | 6.07 | 5.95 | 3.40 | 1.70 | 3.25 | 1.65 | 22.02 |
| Chuck Liddell | 4.43 | 6.42 | 3.85 | 4.50 | 0.50 | 1.50 | 21.20 |
| Francis Ngannou | 5.19 | 3.91 | 1.75 | 4.75 | 2.50 | 1.35 | 19.45 |
| Alex Pereira | 4.32 | 3.50 | 3.40 | 4.50 | 1.00 | 1.40 | 18.12 |
| Dominick Cruz | 4.67 | 5.25 | 3.00 | 1.50 | 1.75 | 1.45 | 17.62 |
| Conor McGregor | 4.67 | 4.78 | 0.50 | 4.60 | 1.00 | 1.85 | 17.40 |
| B.J. Penn | 3.62 | 4.26 | 3.40 | 4.20 | 0.00 | 1.65 | 17.12 |
| Henry Cejudo | 3.73 | 4.55 | 2.25 | 3.10 | 1.25 | 1.35 | 16.23 |
| Petr Yan | 4.20 | 5.02 | 0.75 | 1.70 | 2.50 | 1.65 | 15.82 |
| Randy Couture | 2.92 | 5.13 | 2.80 | 3.55 | 0.00 | 1.25 | 15.65 |

---

# Batch 4 redo

Batch 4 uses audited snapshot inputs where detailed fight-by-fight round rows are not yet stored. These values were already audited when those fighters were added.

| Fighter | Prior worksheet Prime | No-sample Prime | Change |
|---|---:|---:|---:|
| Ilia Topuria | 22.10 | 22.12 | +0.02 |
| Valentina Shevchenko | 21.85 | 21.37 | -0.48 |
| Ronda Rousey | 20.85 | 20.45 | -0.40 |
| T.J. Dillashaw | 18.60 | 18.02 | -0.58 |
| Joanna Jedrzejczyk | 18.35 | 17.76 | -0.59 |
| Aljamain Sterling | 18.50 | 17.72 | -0.78 |
| Justin Gaethje | 15.85 | 15.91 | +0.06 |
| Dustin Poirier | 15.15 | 15.64 | +0.49 |
| Frankie Edgar | 15.90 | 14.97 | -0.93 |
| Dan Henderson | 11.00 | 9.95 | -1.05 |

## Batch 4 component table

| Fighter | Record / 7 | Rounds / 7 | Title / 5 | Finish / 5 | Safety / 4 | Division / 2 | New Prime |
|---|---:|---:|---:|---:|---:|---:|---:|
| Ilia Topuria | 5.83 | 5.89 | 2.00 | 4.50 | 2.00 | 1.90 | 22.12 |
| Valentina Shevchenko | 4.67 | 5.95 | 4.65 | 3.20 | 1.05 | 1.85 | 21.37 |
| Ronda Rousey | 4.67 | 5.83 | 4.35 | 5.00 | 0.00 | 0.60 | 20.45 |
| T.J. Dillashaw | 4.67 | 4.55 | 3.00 | 4.00 | 0.50 | 1.30 | 18.02 |
| Joanna Jedrzejczyk | 4.67 | 5.19 | 4.10 | 2.10 | 0.50 | 1.20 | 17.76 |
| Aljamain Sterling | 4.67 | 4.90 | 3.40 | 1.70 | 1.20 | 1.85 | 17.72 |
| Justin Gaethje | 4.67 | 4.14 | 0.50 | 4.60 | 0.00 | 2.00 | 15.91 |
| Dustin Poirier | 4.67 | 4.03 | 0.75 | 4.20 | 0.00 | 2.00 | 15.64 |
| Frankie Edgar | 3.50 | 3.97 | 2.50 | 2.40 | 0.75 | 1.85 | 14.97 |
| Dan Henderson | 2.33 | 2.57 | 0.25 | 3.00 | 0.50 | 1.30 | 9.95 |

---

# Combined no-sample ranking across Batches 1-4

| Rank | Fighter | Prime Dominance |
|---:|---|---:|
| 1 | Islam Makhachev | 28.45 |
| 2 | Jon Jones | 28.05 |
| 3 | Khabib Nurmagomedov | 27.50 |
| 4 | Demetrious Johnson | 26.11 |
| 5 | Amanda Nunes | 25.22 |
| 6 | Georges St-Pierre | 24.29 |
| 7 | Anderson Silva | 23.70 |
| 8 | Alexander Volkanovski | 22.25 |
| 9 | Ilia Topuria | 22.12 |
| 10 | Merab Dvalishvili | 22.02 |
| 11 | Cain Velasquez | 21.42 |
| 12 | Valentina Shevchenko | 21.37 |
| 13 | Chuck Liddell | 21.20 |
| 14 | Kamaru Usman | 21.18 |
| 15 | Ronda Rousey | 20.45 |
| 16 | Max Holloway | 19.48 |
| 17 | Francis Ngannou | 19.45 |
| 18 | Matt Hughes | 19.05 |
| 19 | Jose Aldo | 18.78 |
| 20 | Stipe Miocic | 18.73 |
| 21 | Daniel Cormier | 18.62 |
| 22 | Alex Pereira | 18.12 |
| 23 | T.J. Dillashaw | 18.02 |
| 24 | Charles Oliveira | 17.96 |
| 25 | Joanna Jedrzejczyk | 17.76 |
| 26 | Aljamain Sterling | 17.72 |
| 27 | Dominick Cruz | 17.62 |
| 28 | Conor McGregor | 17.40 |
| 29 | B.J. Penn | 17.12 |
| 30 | Henry Cejudo | 16.23 |
| 31 | Israel Adesanya | 15.95 |
| 32 | Justin Gaethje | 15.91 |
| 33 | Petr Yan | 15.82 |
| 34 | Randy Couture | 15.65 |
| 35 | Dustin Poirier | 15.64 |
| 36 | Frankie Edgar | 14.97 |
| 37 | Dan Henderson | 9.95 |

---

# Key reads after removing sample confidence

## Cleaner separation

This version is cleaner because short or messy samples are no longer punished through a subjective confidence bucket.

- Shortness goes to Longevity.
- Messiness goes to record, rounds, safety, and title-defense streak.
- Division difficulty stays as the only small contextual adjustment inside Prime.

## Storage-format note

The current repo has two valid Prime input styles:

1. **Detailed fight rows** — transparent round-by-round source.
2. **Audited snapshots** — already-reviewed values stored as public/profile fields.

Both are acceptable for scoring. Detailed fight rows are better for transparency and future debugging, but lack of detailed rows does not mean the fighter was not audited.

## Important cleanup flags before live implementation

1. Treat audited snapshot round percentages as valid scoring inputs.
2. Optionally add detailed round rows for snapshot-audited fighters later as a transparency upgrade.
3. Fix or verify the Ilia/Gaethje round row before live implementation because the current row formatting looks malformed.
4. The old sample-confidence lock doc is deprecated for scoring.

---

# Recommendation

Use this no-sample formula going forward.

Next steps:

1. Cody reviews the new combined Prime order.
2. Fix or verify the Ilia/Gaethje row.
3. Build the Prime Dominance correction module after Cody approves the no-sample score shape.

Do **not** require a full re-audit of snapshot-audited fighters before implementation.