# Prime Dominance Batch 4 Full Elite-Prime Worksheet

Last updated: 2026-07-04

Status: **superseded for scoring** by `docs/prime-dominance-batches-1-4-no-sample-confidence.md`.

Purpose: preserve the original Batch 4 review pass for historical context.

No live app score changes are approved from this worksheet.

---

# Superseded rule

This worksheet used the older Prime Dominance model that still included sample confidence.

Cody later decided to remove sample confidence entirely because it blurred Prime Dominance with Longevity.

The scoring source of truth is now:

```text
Prime Dominance / 30 =
Prime record / 7
+ Prime rounds won / 7
+ Consecutive title-defense dominance / 5
+ Prime finish/stoppage / 5
+ Prime loss safety / 4
+ Division strength / 2
```

Use:

```text
docs/prime-dominance-batches-1-4-no-sample-confidence.md
```

for current Batch 4 scores.

---

# Data-source clarification

This original Batch 4 worksheet included language about needing detailed round rows for several added fighters.

Corrected interpretation:

- Justin Gaethje, Frankie Edgar, Dustin Poirier, Aljamain Sterling, T.J. Dillashaw, and Dan Henderson already have audited snapshot fields in `assets/data/ranking-data-additions.js`.
- Those audited snapshot fields include prime record, rounds-won percentage, finish rate, active elite years, and finished-in-prime context.
- Those values are valid scoring inputs.
- Detailed per-fight `rounds` rows would be a transparency upgrade, not proof that the audit was missing.

Do not treat `rounds: []` for those additions as missing audit work.

---

# Current no-sample Batch 4 scores

| Fighter | Current Prime | No-sample Prime | Change |
|---|---:|---:|---:|
| Ilia Topuria | 23.60 | 22.12 | -1.48 |
| Valentina Shevchenko | 21.86 | 21.37 | -0.49 |
| Ronda Rousey | 21.02 | 20.45 | -0.57 |
| T.J. Dillashaw | 18.90 | 18.02 | -0.88 |
| Joanna Jedrzejczyk | 17.98 | 17.76 | -0.22 |
| Aljamain Sterling | 19.20 | 17.72 | -1.48 |
| Justin Gaethje | 18.00 | 15.91 | -2.09 |
| Dustin Poirier | 17.45 | 15.64 | -1.81 |
| Frankie Edgar | 16.45 | 14.97 | -1.48 |
| Dan Henderson | 14.10 | 9.95 | -4.15 |

---

# Current no-sample Batch 4 component table

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

# Remaining real cleanup

The only hard cleanup flag from this batch is to fix or verify the malformed Ilia/Gaethje round row before building a live automated Prime module.

Everything else can use the audited snapshot inputs unless Cody reopens a fighter-specific audit.