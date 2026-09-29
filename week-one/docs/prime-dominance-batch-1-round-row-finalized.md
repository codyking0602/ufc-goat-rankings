# Prime Dominance Batch 1 Full Elite-Prime Round Pass

Last updated: 2026-07-04

Purpose: redo Batch 1 using one consistent rule: **full UFC elite prime for everyone**.

No live app score changes are approved from this worksheet.

Related docs:

- `docs/prime-dominance-data-audit.md`
- `docs/prime-dominance-batch-1-data-worksheet.md`
- `docs/prime-dominance-batch-1-locked-calls.md`
- `docs/prime-dominance-batch-1-calculation-v2-worksheet.md`

---

# Locked rule after Cody review

Prime Dominance uses the fighter's **full UFC elite-prime window**.

```text
Prime Dominance = full elite prime
not title-prime only
not championship reign only
```

Use full elite-prime fights for:

- prime record
- prime rounds-won percentage
- prime finish rate
- prime losses / finished losses
- sample confidence

Use title-prime only for the separate title-defense streak component:

```text
Best consecutive UFC title-defense streak = its own 5-point component
```

This means Max does **not** get a title-prime-only round score, and Volk does **not** get Islam fights removed from the round denominator just because they were upward-division attempts. Those fights still happened inside their elite-prime windows. The special context belongs in the loss-safety component, not by hiding the rounds.

---

# Round-control scoring rule

The Prime rounds-won component should be pulled from stored fight rows when detailed rows exist.

```text
Prime rounds-won % = primeRoundsWon / primeRoundsCounted
```

If detailed round rows do not exist but the profile snapshot already stores a rounds-won percentage, use the stored snapshot value as the current audited input and flag the missing detailed rows for later transparency.

This matters for Amanda Nunes: the profile snapshot shows **74.0% rounds won**, so Amanda is **not missing a round number**. She is missing only the underlying detailed per-fight round rows.

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

Working scores are rounded to clean app-model numbers, but the percentage is data-derived or snapshot-derived.

---

# Finalized Batch 1 round summary

| Fighter | Rounds source | Prime rounds won | Prime rounds counted | Prime rounds-won % | Old round score | Final round score | Prime score impact |
|---|---|---:|---:|---:|---:|---:|---:|
| Jon Jones | Detailed rows | 53 | 60 | 88.3% | 5.25 | 6.00 | +0.75 |
| Georges St-Pierre | Detailed rows | 57 | 66 | 86.4% | 5.75 | 6.00 | +0.25 |
| Demetrious Johnson | Detailed rows | 43 | 52 | 82.7% | 5.20 | 5.75 | +0.55 |
| Anderson Silva | Detailed rows | 27 | 39 | 69.2% | 4.35 | 4.65 | +0.30 |
| Khabib Nurmagomedov | Detailed rows | 23 | 25 | 92.0% | 6.00 | 6.00 | 0.00 |
| Alexander Volkanovski | Detailed rows | 37 | 48 | 77.1% | 5.05 | 5.25 | +0.20 |
| Max Holloway | Detailed rows | 50 | 84 | 59.5% | 4.65 | 3.70 | -0.95 |
| Amanda Nunes | Snapshot value | Not stored | Not stored | 74.0% | 4.90 | 5.05 | +0.15 |

Amanda note: the live/profile snapshot shows `Rounds Won: 74.0%`. That is enough for this batch's current calculation. Add detailed Amanda round rows later so the number is transparent fight-by-fight like the men.

---

# Updated Batch 1 V2 Prime scores after full elite-prime round pass

| Fighter | Prior V2 Prime | Full elite-prime V2 Prime | Change |
|---|---:|---:|---:|
| Jon Jones | 27.20 | 27.95 | +0.75 |
| Khabib Nurmagomedov | 27.50 | 27.50 | 0.00 |
| Demetrious Johnson | 25.45 | 26.00 | +0.55 |
| Amanda Nunes | 25.35 | 25.50 | +0.15 |
| Georges St-Pierre | 24.15 | 24.40 | +0.25 |
| Anderson Silva | 23.70 | 24.00 | +0.30 |
| Alexander Volkanovski | 22.30 | 22.50 | +0.20 |
| Max Holloway | 21.05 | 20.10 | -0.95 |

---

# Batch 1 ranking by updated Prime Dominance

| Rank in batch | Fighter | Prime Dominance |
|---:|---|---:|
| 1 | Jon Jones | 27.95 |
| 2 | Khabib Nurmagomedov | 27.50 |
| 3 | Demetrious Johnson | 26.00 |
| 4 | Amanda Nunes | 25.50 |
| 5 | Georges St-Pierre | 24.40 |
| 6 | Anderson Silva | 24.00 |
| 7 | Alexander Volkanovski | 22.50 |
| 8 | Max Holloway | 20.10 |

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
27.95
```

Note: this uses stored official-scorecard logic for controversial decisions, including Santos/Reyes.

---

## Georges St-Pierre

Locked prime window:

```text
Post-Hughes-loss elite prime through Bisping late-prime extension.
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
24.40
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
26.00
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
24.00
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
27.50
```

---

## Alexander Volkanovski

Locked prime window:

```text
Prime starts around Jose Aldo 2019.
Islam losses are upward-division context, but they remain inside full elite-prime round-control math.
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
22.50
```

---

## Max Holloway

Locked prime treatment:

```text
Full elite prime is used.
Title-prime is only explanatory context for the title-defense streak component.
The Volk rivalry caps title-defense dominance, but Max's elite prime continues after the belt.
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
20.10
```

Important read: Max gets credit for a very long full elite-prime sample, but the same long window also includes the fights that drag down his round-control percentage. That is consistent with how we are treating everyone.

---

## Amanda Nunes

Locked prime treatment:

```text
True title-level/full elite prime starts around Valentina 1 / Tate and runs through Aldana.
Use 7 total successful UFC title defenses across belts for title-defense streak scoring, with BW-only 5 noted.
Pena 1 is a real prime/late-prime finished loss.
```

Current snapshot input:

| Field | Value |
|---|---:|
| Prime rounds-won percentage | 74.0% |
| Round-control score | 5.05 / 6 |
| Source status | Stored profile snapshot; detailed per-fight rows still need to be added |

```text
74.0% rounds won
Round-control score = 5.05 / 6
```

Updated Prime Dominance:

```text
25.35 + 0.15 = 25.50
```

Important read: Amanda is not missing a rounds-won value. The missing piece is only the fight-by-fight detail behind the already displayed 74.0% snapshot.

---

# Final Batch 1 status

| Fighter | Round source status | Prime score status |
|---|---|---:|
| Jon Jones | Detailed rows finalized | 27.95 |
| Khabib Nurmagomedov | Detailed rows finalized | 27.50 |
| Demetrious Johnson | Detailed rows finalized | 26.00 |
| Amanda Nunes | Snapshot finalized, detailed rows pending | 25.50 |
| Georges St-Pierre | Detailed rows finalized | 24.40 |
| Anderson Silva | Detailed rows finalized | 24.00 |
| Alexander Volkanovski | Detailed rows finalized | 22.50 |
| Max Holloway | Detailed rows finalized | 20.10 |

# Recommendation

Do not make Prime Dominance live yet.

Before live implementation:

1. Add Amanda Nunes detailed prime round rows for transparency.
2. Run Batch 2 under the same full elite-prime rule.
3. Then build the Prime Dominance correction module only after the top board has enough coverage.