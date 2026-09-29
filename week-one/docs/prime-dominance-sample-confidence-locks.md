# Prime Dominance Sample Confidence Locks

Last updated: 2026-07-04

Purpose: record Cody's sample-confidence decisions for Prime Dominance Batches 1-3.

No live app score changes are approved from this doc.

---

# Rule

Sample confidence answers only:

```text
Do we trust this UFC elite-prime sample enough to score it confidently?
```

It should not double-punish losses, weak title-defense streaks, low finish rates, or division strength. Those are handled by the other Prime Dominance components.

Sample confidence is a Cody-lock field. Suggested values can be shown in worksheets, but the locked value below is the source of truth.

---

# Batch 1 locked sample confidence

Cody call:

- Demetrious Johnson = 1.85
- Max Holloway = keep existing 1.95
- Everyone else = 2.00

| Fighter | Locked sample confidence | Prior worksheet sample | Prime score after lock |
|---|---:|---:|---:|
| Jon Jones | 2.00 | 1.90 | 28.05 |
| Khabib Nurmagomedov | 2.00 | 2.00 | 27.50 |
| Demetrious Johnson | 1.85 | 1.75 | 26.10 |
| Amanda Nunes | 2.00 | 2.00 | 25.50 |
| Georges St-Pierre | 2.00 | 2.00 | 24.40 |
| Anderson Silva | 2.00 | 1.85 | 24.15 |
| Alexander Volkanovski | 2.00 | 1.95 | 22.55 |
| Max Holloway | 1.95 | 1.95 | 20.10 |

---

# Batch 2 locked sample confidence

Cody call:

- Keep Aldo at existing 1.95
- Keep Charles at existing 1.75
- Agree with suggested locks for everyone else

| Fighter | Locked sample confidence | Prior worksheet sample | Prime score after lock |
|---|---:|---:|---:|
| Islam Makhachev | 2.00 | 1.80 | 28.45 |
| Kamaru Usman | 2.00 | 1.85 | 21.65 |
| Cain Velasquez | 1.75 | 1.60 | 21.55 |
| Matt Hughes | 2.00 | 1.95 | 19.70 |
| Stipe Miocic | 2.00 | 1.85 | 19.40 |
| Jose Aldo | 1.95 | 1.95 | 19.35 |
| Daniel Cormier | 1.90 | 1.80 | 19.30 |
| Charles Oliveira | 1.75 | 1.75 | 18.35 |
| Israel Adesanya | 2.00 | 1.85 | 16.80 |

---

# Batch 3 locked sample confidence

Cody call:

- Keep Cruz at existing 1.95
- Keep Yan at existing 1.65
- Randy Couture = 1.90
- Alex Pereira = 1.90
- Francis Ngannou = 1.90
- Agree with suggested locks for everyone else

| Fighter | Locked sample confidence | Prior worksheet sample | Prime score after lock |
|---|---:|---:|---:|
| Merab Dvalishvili | 1.85 | 1.55 | 22.15 |
| Chuck Liddell | 2.00 | 1.80 | 21.65 |
| Francis Ngannou | 1.90 | 1.55 | 20.05 |
| Alex Pereira | 1.90 | 1.50 | 18.90 |
| Dominick Cruz | 1.95 | 1.95 | 18.15 |
| Conor McGregor | 2.00 | 2.00 | 18.05 |
| B.J. Penn | 2.00 | 2.00 | 18.00 |
| Henry Cejudo | 1.90 | 1.70 | 16.95 |
| Randy Couture | 1.90 | 2.00 | 16.40 |
| Petr Yan | 1.65 | 1.65 | 16.15 |

---

# Combined Batch 1-3 Prime scores after sample locks

| Rank by Prime score in completed sample | Fighter | Prime Dominance |
|---:|---|---:|
| 1 | Islam Makhachev | 28.45 |
| 2 | Jon Jones | 28.05 |
| 3 | Khabib Nurmagomedov | 27.50 |
| 4 | Demetrious Johnson | 26.10 |
| 5 | Amanda Nunes | 25.50 |
| 6 | Georges St-Pierre | 24.40 |
| 7 | Anderson Silva | 24.15 |
| 8 | Alexander Volkanovski | 22.55 |
| 9 | Merab Dvalishvili | 22.15 |
| 10 | Chuck Liddell | 21.65 |
| 11 | Kamaru Usman | 21.65 |
| 12 | Cain Velasquez | 21.55 |
| 13 | Max Holloway | 20.10 |
| 14 | Francis Ngannou | 20.05 |
| 15 | Matt Hughes | 19.70 |
| 16 | Stipe Miocic | 19.40 |
| 17 | Jose Aldo | 19.35 |
| 18 | Daniel Cormier | 19.30 |
| 19 | Alex Pereira | 18.90 |
| 20 | Charles Oliveira | 18.35 |
| 21 | Dominick Cruz | 18.15 |
| 22 | Conor McGregor | 18.05 |
| 23 | B.J. Penn | 18.00 |
| 24 | Henry Cejudo | 16.95 |
| 25 | Israel Adesanya | 16.80 |
| 26 | Randy Couture | 16.40 |
| 27 | Petr Yan | 16.15 |

Tie note: Chuck Liddell and Kamaru Usman both land at 21.65 after sample locks. Keep exact component totals available for tie-breaking when the live module is built.

---

# Implementation note

When building the Prime Dominance live correction module, use these locked sample-confidence values instead of the provisional worksheet values.