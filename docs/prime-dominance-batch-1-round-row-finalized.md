# Prime Dominance Batch 1 Round-Row Finalized Pass

Last updated: 2026-07-04

Purpose: finish the Batch 1 round-control pass using stored `rounds` rows instead of placeholder round-control judgments.

No live app score changes are approved from this worksheet.

Related docs:

- `docs/prime-dominance-data-audit.md`
- `docs/prime-dominance-batch-1-data-worksheet.md`
- `docs/prime-dominance-batch-1-locked-calls.md`
- `docs/prime-dominance-batch-1-calculation-v2-worksheet.md`

---

# Rule locked by Cody review

The Prime rounds-won component should be discernible from stored fight rows.

```text
Prime rounds-won % = primeRoundsWon / primeRoundsCounted
```

Use only fights inside the locked prime window.

If a fighter does not yet have stored round rows, do not pretend the score is final. Keep the snapshot placeholder and flag that fighter for row completion.

---

# Round score conversion used in this pass

| Prime rounds-won % | Round score / 6 |
|---:|---:|
| 85.0%+ | 6.00 |
| 80.0% - 84.9% | 5.50 - 5.99 |
| 70.0% - 79.9% | 4.75 - 5.49 |
| 60.0% - 69.9% | 3.75 - 4.74 |
| 50.0% - 59.9% | 2.50 - 3.74 |
| Under 50.0% | below 2.50 |

Working scores are rounded to clean app-model numbers, but the percentage is data-derived.

---

# Finalized Batch 1 round-row summary

| Fighter | Prime rounds won | Prime rounds counted | Prime rounds-won % | Old round score | Final round score | Prime score impact |
|---|---:|---:|---:|---:|---:|---:|
| Jon Jones | 53 | 60 | 88.3% | 5.25 | 6.00 | +0.75 |
| Georges St-Pierre | 57 | 66 | 86.4% | 5.75 | 6.00 | +0.25 |
| Demetrious Johnson | 43 | 52 | 82.7% | 5.20 | 5.75 | +0.55 |
| Anderson Silva | 27 | 39 | 69.2% | 4.35 | 4.65 | +0.30 |
| Khabib Nurmagomedov | 23 | 25 | 92.0% | 6.00 | 6.00 | 0.00 |
| Alexander Volkanovski | 37 | 48 | 77.1% | 5.05 | 5.25 | +0.20 |
| Max Holloway | 50 | 84 | 59.5% | 4.65 | 3.70 | -0.95 |
| Amanda Nunes | Not stored | Not stored | Not stored | 4.90 | 4.90 placeholder | 0.00 placeholder |

Important: Amanda is not fully finalized because the base data does not currently include an Amanda profile with stored round rows. Her round score stays as the existing snapshot placeholder until those rows are added.

---

# Updated Batch 1 V2 Prime scores after exact round pass

| Fighter | Prior V2 Prime | Final round-row V2 Prime | Change |
|---|---:|---:|---:|
| Jon Jones | 27.20 | 27.95 | +0.75 |
| Khabib Nurmagomedov | 27.50 | 27.50 | 0.00 |
| Demetrious Johnson | 25.45 | 26.00 | +0.55 |
| Amanda Nunes | 25.35 | 25.35 placeholder | 0.00 placeholder |
| Georges St-Pierre | 24.15 | 24.40 | +0.25 |
| Anderson Silva | 23.70 | 24.00 | +0.30 |
| Alexander Volkanovski | 22.30 | 22.50 | +0.20 |
| Max Holloway | 21.05 | 20.10 | -0.95 |

---

# Fighter detail

## Jon Jones

Locked prime window:

```text
Ryan Bader / Shogun Rua 2011 through Dominick Reyes 2020, with Ciryl Gane as HW extension.
```

Round rows included:

| Fight | Rounds won | Rounds counted |
|---|---:|---:|
| Ryan Bader | 2 | 2 |
| Mauricio Rua | 3 | 3 |
| Rampage Jackson | 4 | 4 |
| Lyoto Machida | 1 | 2 |
| Rashad Evans | 4 | 5 |
| Vitor Belfort | 4 | 4 |
| Chael Sonnen | 1 | 1 |
| Alexander Gustafsson 1 | 4 | 5 |
| Glover Teixeira | 5 | 5 |
| Daniel Cormier 1 | 4 | 5 |
| Ovince Saint Preux | 5 | 5 |
| Alexander Gustafsson 2 | 3 | 3 |
| Anthony Smith | 5 | 5 |
| Thiago Santos | 3 | 5 |
| Dominick Reyes | 4 | 5 |
| Ciryl Gane | 1 | 1 |
| **Total** | **53** | **60** |

```text
53 / 60 = 88.3%
Round-control score = 6.00 / 6
```

Updated Prime Dominance:

```text
27.20 + 0.75 = 27.95
```

Note: this uses official scorecard logic for controversial decisions, including Santos/Reyes. The controversy is still visible in notes, but the round calculation follows the stored rows.

---

## Georges St-Pierre

Locked prime window:

```text
Post-Hughes-loss prime through Bisping late-prime extension.
Hughes 2004 remains pre-prime/early elite.
Serra 2007 is the counted prime finished loss.
```

Round rows included:

| Fight | Rounds won | Rounds counted |
|---|---:|---:|
| Jason Miller | 3 | 3 |
| Frank Trigg | 1 | 1 |
| Sean Sherk | 2 | 2 |
| B.J. Penn 1 | 2 | 3 |
| Matt Hughes 2 | 2 | 2 |
| Matt Serra 1 | 0 | 1 |
| Josh Koscheck 1 | 2 | 3 |
| Matt Hughes 3 | 2 | 2 |
| Matt Serra 2 | 2 | 2 |
| Jon Fitch | 5 | 5 |
| B.J. Penn 2 | 4 | 4 |
| Thiago Alves | 5 | 5 |
| Dan Hardy | 5 | 5 |
| Josh Koscheck 2 | 5 | 5 |
| Jake Shields | 3 | 5 |
| Carlos Condit | 4 | 5 |
| Nick Diaz | 5 | 5 |
| Johny Hendricks | 3 | 5 |
| Michael Bisping | 2 | 3 |
| **Total** | **57** | **66** |

```text
57 / 66 = 86.4%
Round-control score = 6.00 / 6
```

Updated Prime Dominance:

```text
24.15 + 0.25 = 24.40
```

---

## Demetrious Johnson

Locked prime window:

```text
Joseph Benavidez 1 through Henry Cejudo 2.
Cejudo 2 included as close prime-ending loss.
ONE excluded.
```

Round rows included:

| Fight | Rounds won | Rounds counted |
|---|---:|---:|
| Joseph Benavidez 1 | 3 | 5 |
| John Dodson 1 | 3 | 5 |
| John Moraga | 5 | 5 |
| Joseph Benavidez 2 | 1 | 1 |
| Ali Bagautinov | 5 | 5 |
| Chris Cariaso | 2 | 2 |
| Kyoji Horiguchi | 5 | 5 |
| John Dodson 2 | 4 | 5 |
| Henry Cejudo 1 | 1 | 1 |
| Tim Elliott | 4 | 5 |
| Wilson Reis | 3 | 3 |
| Ray Borg | 5 | 5 |
| Henry Cejudo 2 | 2 | 5 |
| **Total** | **43** | **52** |

```text
43 / 52 = 82.7%
Round-control score = 5.75 / 6
```

Updated Prime Dominance:

```text
25.45 + 0.55 = 26.00
```

---

## Anderson Silva

Locked prime window:

```text
Chris Leben / Rich Franklin 1 through Chris Weidman 2.
Both Weidman losses are prime/late-prime cap events.
```

Round rows included:

| Fight | Rounds won | Rounds counted |
|---|---:|---:|
| Chris Leben | 1 | 1 |
| Rich Franklin 1 | 1 | 1 |
| Travis Lutter | 1 | 2 |
| Nate Marquardt | 1 | 1 |
| Rich Franklin 2 | 2 | 2 |
| Dan Henderson | 1 | 2 |
| James Irvin | 1 | 1 |
| Patrick Cote | 3 | 3 |
| Thales Leites | 4 | 5 |
| Forrest Griffin | 1 | 1 |
| Demian Maia | 5 | 5 |
| Chael Sonnen 1 | 1 | 5 |
| Vitor Belfort | 1 | 1 |
| Yushin Okami | 2 | 2 |
| Chael Sonnen 2 | 1 | 2 |
| Stephan Bonnar | 1 | 1 |
| Chris Weidman 1 | 0 | 2 |
| Chris Weidman 2 | 0 | 2 |
| **Total** | **27** | **39** |

```text
27 / 39 = 69.2%
Round-control score = 4.65 / 6
```

Updated Prime Dominance:

```text
23.70 + 0.30 = 24.00
```

---

## Khabib Nurmagomedov

Locked prime window:

```text
Rafael dos Anjos 2014 through Justin Gaethje 2020.
```

Round rows included:

| Fight | Rounds won | Rounds counted |
|---|---:|---:|
| Rafael dos Anjos | 3 | 3 |
| Darrell Horcher | 2 | 2 |
| Michael Johnson | 3 | 3 |
| Edson Barboza | 3 | 3 |
| Al Iaquinta | 5 | 5 |
| Conor McGregor | 3 | 4 |
| Dustin Poirier | 3 | 3 |
| Justin Gaethje | 1 | 2 |
| **Total** | **23** | **25** |

```text
23 / 25 = 92.0%
Round-control score = 6.00 / 6
```

Updated Prime Dominance:

```text
27.50 unchanged
```

---

## Alexander Volkanovski

Locked prime window:

```text
Prime starts around Jose Aldo 2019.
Islam losses are upward-division context.
Topuria is a prime loss, but not a hard prime end.
Volk remains prime after Topuria unless later results prove decline.
```

Round rows included:

| Fight | Rounds won | Rounds counted |
|---|---:|---:|
| Jose Aldo | 3 | 3 |
| Max Holloway 1 | 3 | 5 |
| Max Holloway 2 | 3 | 5 |
| Brian Ortega | 5 | 5 |
| Korean Zombie | 4 | 4 |
| Max Holloway 3 | 5 | 5 |
| Islam Makhachev 1 | 2 | 5 |
| Yair Rodriguez | 3 | 3 |
| Islam Makhachev 2 | 0 | 1 |
| Ilia Topuria | 1 | 2 |
| Diego Lopes 1 | 4 | 5 |
| Diego Lopes 2 | 4 | 5 |
| **Total** | **37** | **48** |

```text
37 / 48 = 77.1%
Round-control score = 5.25 / 6
```

Updated Prime Dominance:

```text
22.30 + 0.20 = 22.50
```

Note: if Islam upward-division fights are excluded from the round-control denominator, Volk's round-control score would be higher. This version includes them as prime context but does not treat them as normal FW loss context.

---

## Max Holloway

Locked prime treatment:

```text
Title prime and elite prime are separate.
Volk rivalry caps title-prime dominance.
Elite prime continues after losing the belt.
```

Round rows included:

| Fight | Rounds won | Rounds counted |
|---|---:|---:|
| Cub Swanson | 3 | 3 |
| Charles Oliveira 1 | 1 | 1 |
| Jeremy Stephens | 3 | 3 |
| Ricardo Lamas | 3 | 3 |
| Anthony Pettis | 2 | 3 |
| Jose Aldo 1 | 1 | 3 |
| Jose Aldo 2 | 2 | 3 |
| Brian Ortega | 4 | 4 |
| Frankie Edgar | 4 | 5 |
| Dustin Poirier 2 | 1 | 5 |
| Alexander Volkanovski 1 | 1 | 5 |
| Alexander Volkanovski 2 | 2 | 5 |
| Calvin Kattar | 5 | 5 |
| Yair Rodriguez | 3 | 5 |
| Alexander Volkanovski 3 | 0 | 5 |
| Arnold Allen | 4 | 5 |
| Korean Zombie | 2 | 3 |
| Justin Gaethje | 5 | 5 |
| Ilia Topuria | 1 | 3 |
| Dustin Poirier 3 | 3 | 5 |
| Charles Oliveira 2 | 0 | 5 |
| **Total** | **50** | **84** |

```text
50 / 84 = 59.5%
Round-control score = 3.70 / 6
```

Updated Prime Dominance:

```text
21.05 - 0.95 = 20.10
```

Important note: Max is the fighter most affected by using the full long elite-prime window. If we score only his title-prime window, the round-control number is cleaner. If we score the full elite-prime window, the later Volk/Topuria/Oliveira-type losses drag the round-control component down.

---

## Amanda Nunes

Status:

```text
No stored Amanda profile/round rows found in the current base ranking data.
```

Current treatment:

| Field | Value |
|---|---:|
| Round-control score | 4.90 placeholder |
| Prime score | 25.35 placeholder |
| Status | Not finalized until Amanda round rows are added |

Action needed:

- Add Amanda prime round rows before calling her Prime Dominance score fully finalized.
- Until then, her Batch 1 Prime score is directionally useful but not data-final.

---

# Final Batch 1 status

| Fighter | Round-row status | Prime score status |
|---|---|---|
| Jon Jones | Finalized from stored rows | Finalized worksheet value: 27.95 |
| Georges St-Pierre | Finalized from stored rows | Finalized worksheet value: 24.40 |
| Demetrious Johnson | Finalized from stored rows | Finalized worksheet value: 26.00 |
| Anderson Silva | Finalized from stored rows | Finalized worksheet value: 24.00 |
| Khabib Nurmagomedov | Finalized from stored rows | Finalized worksheet value: 27.50 |
| Alexander Volkanovski | Finalized from stored rows | Finalized worksheet value: 22.50 |
| Max Holloway | Finalized from stored rows | Finalized worksheet value: 20.10 |
| Amanda Nunes | Missing stored round rows | Placeholder value: 25.35 |

# Recommendation

Do not make Prime Dominance live yet.

Before live implementation:

1. Add Amanda Nunes prime round rows.
2. Decide whether Max's round-control component should use full elite-prime or title-prime only.
3. Decide whether Volk's upward-division Islam fights should stay inside the round-control denominator or be shown separately.
4. Then run Batch 2 under the same exact round-row rule.