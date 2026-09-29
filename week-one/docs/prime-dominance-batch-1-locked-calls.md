# Prime Dominance Batch 1 Locked Calls

Last updated: 2026-07-04

Purpose: record Cody's locked calls for the first Prime Dominance data batch before calculating formula scores.

This document supplements `docs/prime-dominance-batch-1-data-worksheet.md`.

No live score changes are approved from this file.

---

# Locked calls

| # | Fighter | Call | Locked answer | Notes |
|---:|---|---|---|---|
| 1 | Jon Jones | Prime window | Bader/Shogun 2011 through Reyes 2020, with Gane as HW extension | Stipe stays outside prime dominance / late-career context. |
| 2 | Georges St-Pierre | Prime window | Bisping is still prime / late-prime and should be included | Replaces earlier lean that Bisping was outside prime dominance. Need reconcile structured record around post-Hughes run. |
| 3 | Demetrious Johnson | Include Cejudo 2 | Yes | Count as close prime-ending loss. No finish-loss hit. |
| 4 | Anderson Silva | Weidman treatment | Include both Weidman losses as prime-context cap events | Weidman 2 remains weird injury-finish context, but still a prime/late-prime safety hit. |
| 5 | Khabib Nurmagomedov | Prime window | Rafael dos Anjos 2014 through Justin Gaethje 2020 | Elite-prime record = 8-0; full UFC context remains 13-0. |
| 6 | Alexander Volkanovski | Islam losses | Separate upward-division context, not normal FW prime losses | They can lightly cap Prime Dominance but should not crater same-division FW prime. |
| 7 | Alexander Volkanovski | Topuria loss | Include as FW prime loss, but Volk is still in prime after Topuria | Topuria is not a hard prime end. Treat it as a major same-division prime blemish, not post-prime cutoff. |
| 8 | Max Holloway | Title prime vs elite prime | Split the concepts | Title prime = championship-reign/title-defense window. Elite prime = broader elite window that continues after losing the belt. |
| 9 | Amanda Nunes | Title-defense streak | Use 7 total successful UFC title defenses across belts, with BW-only 5 noted | This better captures two-division dominance than a single-belt-only streak. |
| 10 | Amanda Nunes | Prime start | Valentina 1 / Tate title-level range accepted | True title-level prime starts around Valentina 1/Tate, not earlier prelim setup wins. |

---

# Important clarification: Max Holloway

Cody questioned the phrase "title prime." Lock this distinction:

```text
Title prime = Max's championship-reign / title-defense dominance window.
Elite prime = Max's broader high-level UFC prime, which continues after the belt because he stayed elite.
```

Working treatment:

| Window | Proposed scope | Why |
|---|---|---|
| Title prime | Pettis 2016 through Volkanovski trilogy | Captures interim belt, Aldo wins, defenses, and the Volk rivalry that ended his title-control run. |
| Elite prime | Cub/Pettis through current late-elite window | Kattar, Yair, Allen, Zombie, Gaethje, and later elite fights show Max remained prime/elite after losing the belt. |

Prime Dominance formula should not treat the Volk losses as the end of Max being elite. They should cap his title-dominance/separation, but the broader prime window remains alive longer.

---

# Updated fighter-specific implications

## Jon Jones

Locked prime window:

```text
Ryan Bader / Shogun Rua 2011 through Dominick Reyes 2020
+ Ciryl Gane 2023 as heavyweight prime extension
```

Key locked context:

- Hamill DQ is not a real competitive prime loss.
- DC 2 NC remains no-contest context only.
- Stipe 2024 should not be part of Prime Dominance.
- Best consecutive title-defense streak: 8.

## Georges St-Pierre

Updated locked treatment:

```text
Post-Hughes-loss prime includes the Bisping title win as late-prime / prime-extension context.
```

Need to reconcile record:

- If prime starts immediately after Hughes 1 and includes Jason Miller + Bisping, the existing app note of `18-1 after first Hughes loss` may be right.
- If prime starts at Trigg/Sherk, it is a narrower window.

Working lean after Cody call:

```text
Use the existing broader post-Hughes prime framing and include Bisping.
```

Key locked context:

- Hughes 2004 stays pre-prime/early elite loss.
- Serra 2007 is the counted prime finished loss.
- Best consecutive WW title-defense streak: 9.
- Bisping is included as late-prime extension, but the strongest round-control sample is still the WW title run.

## Demetrious Johnson

Locked treatment:

```text
Benavidez 1 through Cejudo 2
```

Key locked context:

- Cejudo 2 is included as close prime-ending loss.
- No prime finished losses.
- Best consecutive title-defense streak: 11.
- ONE excluded.

## Anderson Silva

Locked treatment:

```text
Leben / Franklin 1 through Weidman 2
```

Key locked context:

- Both Weidman losses are prime/late-prime cap events.
- Weidman 1 = clear KO finish loss.
- Weidman 2 = official TKO/finished loss with weird leg-injury context.
- Later losses after Weidman are post-prime for this category.
- Best consecutive title-defense streak: 10.

## Khabib Nurmagomedov

Locked treatment:

```text
Rafael dos Anjos 2014 through Justin Gaethje 2020
```

Key locked context:

- Elite-prime record: 8-0.
- Full UFC context: 13-0.
- No prime losses.
- No prime finished losses.
- Best consecutive title-defense streak: 3.

## Alexander Volkanovski

Updated locked treatment:

```text
Prime starts around Jose Aldo 2019.
Topuria is a prime loss, but not necessarily the end of Volk being prime.
Islam losses are upward-division context, not normal FW losses.
```

Key locked context:

- Islam 1/2 should lightly cap Prime Dominance only because they are upward-division elite losses.
- Topuria is a major same-division prime blemish.
- Volk can still be considered in prime after Topuria unless later results prove clear decline.
- Best consecutive FW title-defense streak: 5.

## Max Holloway

Locked treatment:

```text
Use separate title-prime and elite-prime concepts.
```

Key locked context:

- Volk rivalry caps title-prime dominance.
- Max remains elite after the belt because of Kattar/Yair/Allen/Zombie/Gaethje-type results.
- Best consecutive title-defense streak: 3.
- Do not treat losing the title as automatic prime end.

## Amanda Nunes

Locked treatment:

```text
True title-level prime starts around Valentina 1 / Tate.
Use 7 total successful UFC title defenses across belts for title-defense streak scoring, with BW-only 5 noted.
```

Key locked context:

- Pena 1 is a real prime/late-prime finished loss and should cap Prime Dominance.
- Pena rematch and Aldana remain inside the prime/late-prime window.
- Two-division title-defense dominance should not be undersold by single-belt-only streak counting.

---

# Next step

Calculate the actual Prime Dominance components for Batch 1 using these locked data rules:

1. prime record score / 6
2. prime rounds-won score / 6
3. consecutive title-defense dominance / 7
4. prime finish/stoppage score / 5
5. prime loss safety / 4
6. prime sample confidence / 2

Then update the Batch 1 data worksheet with calculated scores before any live correction module is considered.