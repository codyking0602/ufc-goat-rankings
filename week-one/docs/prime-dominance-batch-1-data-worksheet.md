# Prime Dominance Batch 1 Data Worksheet

Last updated: 2026-07-04

Purpose: first Prime Dominance data audit batch. This worksheet does not approve live score changes. It establishes the checkable prime-window data needed before calculating Prime Dominance.

This supersedes the earlier rough `prime-dominance-batch-1-goat-core-worksheet.md` scoring pass. That earlier pass was too opinion-based. This file is the data-first version.

Batch 1 fighters:

- Jon Jones
- Georges St-Pierre
- Demetrious Johnson
- Anderson Silva
- Khabib Nurmagomedov
- Alexander Volkanovski
- Max Holloway
- Amanda Nunes

## Formula being prepared

Prime Dominance / 30:

| Component | Max |
|---|---:|
| Prime record score | 6 |
| Prime rounds-won score | 6 |
| Consecutive title-defense dominance | 7 |
| Prime finish/stoppage score | 5 |
| Prime loss safety | 4 |
| Prime sample confidence | 2 |
| **Total** | **30** |

Required audited fields:

```js
primeSnapshot: {
  start,
  end,
  record,
  wins,
  losses,
  draws,
  noContests,
  fightCount,
  finishWins,
  finishRatePct,
  roundsWon,
  roundsCounted,
  roundsWonPct,
  bestConsecutiveTitleDefenseStreak,
  primeLosses,
  primeFinishedLosses,
  timesFinishedPrime,
  notes
}
```

---

# Batch 1 data audit summary

| Fighter | Prime window status | Prime record status | Rounds status | Finish status | Title-defense streak status | Loss/finish status | Data confidence |
|---|---|---|---|---|---|---|---|
| Jon Jones | Needs final start/end lock | Mostly known | Fight rows exist in base data; prime-only calc needed | UFC snapshot exists; prime-only calc needed | Known-ish: best streak 8 | Hamill DQ no real loss; no prime finished losses | High after prime-window lock |
| GSP | Needs final start/end lock | Known-ish, but exact inclusion of Bisping needs call | Needs prime-only calc | Needs prime-only calc | Known: best WW defense streak 9 | Serra prime finish loss; Hughes 2004 early elite loss | Medium-high |
| Demetrious Johnson | Needs final start/end lock | Known from FLW title run | Needs prime-only calc | Needs prime-only calc | Known: 11 defenses | Cejudo 2 close loss if included; no prime finished losses | Medium-high |
| Anderson Silva | Needs final end lock because Weidman treatment matters | Known-ish: 16-0 run then Weidman losses | Needs prime-only calc | Needs prime-only calc | Known: 10 defenses | Weidman losses count as in-prime/prime-context; one finished loss minimum | Medium |
| Khabib | Clean window | Known: 13-0 UFC / 7-0 elite-prime depending start | Can calculate from fight list; snapshot needed | Known full-UFC finish rate 8/13 = 61.5%; prime-only needs lock | Known: 3 defenses | No UFC losses, no prime finishes | High |
| Volkanovski | Needs same-division vs upward-division window decision | Known-ish FW prime, but Islam/Topuria inclusion needs call | Needs prime-only calc | Needs prime-only calc | Known: 5 FW defenses | Islam losses upward-division; Topuria loss likely prime/late-prime end | Medium |
| Max Holloway | Needs prime-start and prime-end lock | Known-ish, but Volk losses and later wins need window call | Needs prime-only calc | Needs prime-only calc | Known: 3 defenses | Volk losses cap; no prime finished losses | Medium |
| Amanda Nunes | Needs title-defense streak definition call | Known-ish | Needs prime-only calc | Needs prime-only calc | 5 BW defenses or 7 total successful defenses across belts; needs rule | Pena loss is major prime/late-prime blemish | Medium |

---

# Fighter audits

## Jon Jones

### Prime window proposal

| Field | Working value |
|---|---|
| Prime start | Ryan Bader / Shogun Rua 2011 |
| Prime end | Dominick Reyes 2020 for LHW prime; Ciryl Gane 2023 as HW extension |
| Window type | Long UFC title prime with late HW extension |

### Prime fight list to include

Working prime list:

1. Ryan Bader
2. Shogun Rua
3. Rampage Jackson
4. Lyoto Machida
5. Rashad Evans
6. Vitor Belfort
7. Chael Sonnen
8. Alexander Gustafsson 1
9. Glover Teixeira
10. Daniel Cormier 1
11. Ovince Saint Preux
12. Alexander Gustafsson 2
13. Anthony Smith
14. Thiago Santos
15. Dominick Reyes
16. Ciryl Gane

Optional/excluded context:

- Matt Hamill DQ: exclude as competitive prime loss.
- Stipe Miocic 2024: probably outside prime dominance window / late-career context.
- Daniel Cormier 2 NC: no contest excluded from scoring as a win, but performance context may be noted only.

### Prime snapshot working data

| Field | Working value | Confidence | Notes |
|---|---:|---|---|
| `record` | 16-0 plus 1 NC context if DC 2 noted | Medium | Depends whether Gane is included and DC 2 NC is just context. Hamill DQ excluded from competitive prime record. |
| `wins` | 16 | Medium | Needs exact prime fight inclusion lock. |
| `losses` | 0 | High | Hamill DQ not treated as real competitive loss. |
| `noContests` | 1 optional context | High | DC 2 NC not OQ/record win credit. |
| `fightCount` | 16 scored wins | Medium | Could be 15 if Gane excluded from LHW prime. |
| `bestConsecutiveTitleDefenseStreak` | 8 | High | Rampage through Cormier 1 during first LHW reign. |
| `timesFinishedPrime` | 0 | High | Never finished. |
| `primeFinishedLosses` | 0 | High | No competitive prime loss. |
| `finishWins` | TBD from included fights | Medium | Need prime-only method/finish count. |
| `finishRatePct` | TBD | Medium | Do not use full-career blindly. |
| `roundsWonPct` | TBD from base `rounds` rows | Medium-high | Base profile has detailed round rows; calculate prime-only after window lock. |

### Cody calls needed

| Call | My lean | Why asking |
|---|---|---|
| Prime start | Bader/Shogun 2011 | Bader is elite contender win; Shogun is title win. Either is defensible. This affects prime record/fight count. |
| Prime end | Reyes 2020 + Gane as HW extension | Keeps late Stipe out while still giving Gane dominance context. |
| Title-defense streak | 8 | Clean first-reign defense streak. |
| Hamill DQ | Exclude from prime losses | Already locked philosophically. Needs reflected in `primeSnapshot`. |

---

## Georges St-Pierre

### Prime window proposal

| Field | Working value |
|---|---|
| Prime start | After first Matt Hughes loss: Frank Trigg / Sean Sherk 2005 |
| Prime end | Johny Hendricks 2013 for WW prime |
| Optional extension | Michael Bisping 2017 as late title win, likely not part of prime dominance window |

### Prime fight list to include

Working WW prime list:

1. Frank Trigg
2. Sean Sherk
3. B.J. Penn 1
4. Matt Hughes 2
5. Matt Serra 1 loss
6. Josh Koscheck 1
7. Matt Hughes 3
8. Matt Serra 2
9. Jon Fitch
10. B.J. Penn 2
11. Thiago Alves
12. Dan Hardy
13. Josh Koscheck 2
14. Jake Shields
15. Carlos Condit
16. Nick Diaz
17. Johny Hendricks

Optional/excluded context:

- Matt Hughes 1: early elite/pre-prime loss, not full prime dominance window unless Cody wants a wider prime.
- Michael Bisping: championship/longevity context, but likely not prime dominance.

### Prime snapshot working data

| Field | Working value | Confidence | Notes |
|---|---:|---|---|
| `record` | 16-1 in proposed WW prime | Medium | Count depends on Trigg/Sherk start and Bisping exclusion. Existing app text says 18-1 after first Hughes loss, so this needs reconciliation. |
| `wins` | 16 | Medium | Needs exact fight inclusion reconciliation with existing snapshot. |
| `losses` | 1 | High | Serra is counted prime finish loss. |
| `fightCount` | 17 | Medium | Without Bisping. |
| `bestConsecutiveTitleDefenseStreak` | 9 | High | Fitch through Hendricks after Serra title regain. |
| `timesFinishedPrime` | 1 | High | Serra TKO. |
| `primeFinishedLosses` | 1 | High | Serra. |
| `finishWins` | TBD | Medium | Need prime-only finish count. |
| `finishRatePct` | TBD | Medium | Full UFC finish rate is not enough. |
| `roundsWonPct` | TBD | Medium | Need prime-only round calc. |

### Cody calls needed

| Call | My lean | Why asking |
|---|---|---|
| Prime start | Trigg/Sherk after Hughes 1 | This treats Hughes 1 as early elite loss, consistent with current notes. |
| Prime end | Hendricks 2013 | Bisping is huge championship/longevity context but not GSP's true WW prime. |
| Existing `18-1` text | Reconcile to structured record | The app text likely includes different fights than the proposed dominance window. We need one structured version. |
| Title-defense streak | 9 | This should be a huge Prime Dominance marker for GSP. |

---

## Demetrious Johnson

### Prime window proposal

| Field | Working value |
|---|---|
| Prime start | Joseph Benavidez 1 / UFC flyweight title win 2012 |
| Prime end | Henry Cejudo 2 loss 2018, or Ray Borg 2017 if excluding the loss from prime window |
| Window type | UFC flyweight title prime |

### Prime fight list to include

Working prime list:

1. Joseph Benavidez 1
2. John Dodson 1
3. John Moraga
4. Joseph Benavidez 2
5. Ali Bagautinov
6. Chris Cariaso
7. Kyoji Horiguchi
8. John Dodson 2
9. Henry Cejudo 1
10. Tim Elliott
11. Wilson Reis
12. Ray Borg
13. Henry Cejudo 2 loss

Optional/excluded context:

- Ian McCall draw/win can be pre-title flyweight setup, not necessarily prime dominance.
- ONE career excluded entirely.

### Prime snapshot working data

| Field | Working value | Confidence | Notes |
|---|---:|---|---|
| `record` | 12-1 if Cejudo 2 included; 12-0 if ending at Borg | High | Need decide whether close Cejudo loss is inside prime window. |
| `wins` | 12 | High | UFC title win + 11 defenses. |
| `losses` | 1 or 0 | Medium | Depends Cejudo 2 inclusion. |
| `fightCount` | 13 or 12 | Medium | Depends Cejudo 2 inclusion. |
| `bestConsecutiveTitleDefenseStreak` | 11 | High | UFC record flyweight defense streak. |
| `timesFinishedPrime` | 0 | High | No UFC prime finish loss. |
| `primeFinishedLosses` | 0 | High | Cejudo 2 was split decision. |
| `finishWins` | TBD | Medium | Need prime-only count. |
| `finishRatePct` | TBD | Medium | Known strong finishing stretch, but calculate. |
| `roundsWonPct` | TBD | Medium | Need prime-only round calc. |

### Cody calls needed

| Call | My lean | Why asking |
|---|---|---|
| Include Cejudo 2 in prime window | yes | It was a close loss at the end of the title prime, so Prime Dominance should acknowledge the streak was finally broken. |
| Prime start | Benavidez 1 | Clean title-prime start. |
| Title-defense streak | 11 | This should heavily drive DJ's Prime Dominance. |

---

## Anderson Silva

### Prime window proposal

| Field | Working value |
|---|---|
| Prime start | Chris Leben / Rich Franklin 1 2006 |
| Prime end | Chris Weidman 2 2013 for in-prime loss context |
| Window type | UFC middleweight title/finishing-aura prime |

### Prime fight list to include

Working prime list:

1. Chris Leben
2. Rich Franklin 1
3. Travis Lutter
4. Nate Marquardt
5. Rich Franklin 2
6. Dan Henderson
7. James Irvin
8. Patrick Cote
9. Thales Leites
10. Forrest Griffin
11. Demian Maia
12. Chael Sonnen 1
13. Vitor Belfort
14. Yushin Okami
15. Chael Sonnen 2
16. Stephan Bonnar
17. Chris Weidman 1 loss
18. Chris Weidman 2 loss

Optional/excluded context:

- Post-Weidman losses are post-prime and should not affect Prime Dominance.
- Lutter was non-title due to missed weight, but still part of prime fight list.

### Prime snapshot working data

| Field | Working value | Confidence | Notes |
|---|---:|---|---|
| `record` | 16-2 | High | Includes Weidman losses as prime/prime-context blemishes. |
| `wins` | 16 | High | UFC record win streak. |
| `losses` | 2 | High | Weidman 1 and 2. |
| `fightCount` | 18 | High | If Leben through Weidman 2. |
| `bestConsecutiveTitleDefenseStreak` | 10 | High | UFC MW defense streak. |
| `timesFinishedPrime` | 2 | Medium-high | Weidman KO and leg-injury TKO. Need whether Weidman 2 injury TKO is treated as normal finish or weird finish context. |
| `primeFinishedLosses` | 1 or 2 | Medium | Weidman 1 clear KO; Weidman 2 technical injury finish context needs call. |
| `finishWins` | TBD | Medium | Historic finish rate, but calculate from prime wins. |
| `finishRatePct` | TBD | Medium | Need prime-only finish percentage. |
| `roundsWonPct` | TBD | Medium | Anderson was not always round-dominant; calculate carefully. |

### Cody calls needed

| Call | My lean | Why asking |
|---|---|---|
| Prime end | Weidman 2 | Weidman losses are locked as in-prime/prime-context, so include both as cap events. |
| Weidman 2 finish context | count as finished but note weird injury | It was officially a TKO, but the leg break is weird context. It should hurt safety, but maybe not as much as a normal KO/sub. |
| Title-defense streak | 10 | Huge Prime Dominance marker. |

---

## Khabib Nurmagomedov

### Prime window proposal

| Field | Working value |
|---|---|
| Prime start | Rafael dos Anjos 2014 |
| Prime end | Justin Gaethje 2020 |
| Window type | Elite UFC lightweight prime |

### Prime fight list to include

Working prime list:

1. Rafael dos Anjos
2. Darrell Horcher
3. Michael Johnson
4. Edson Barboza
5. Al Iaquinta
6. Conor McGregor
7. Dustin Poirier
8. Justin Gaethje

Optional/excluded context:

- Earlier UFC wins before RDA can support full UFC record but not elite-prime window.
- No non-UFC fights included.

### Prime snapshot working data

| Field | Working value | Confidence | Notes |
|---|---:|---|---|
| `record` | 8-0 elite-prime window | High | If prime starts at RDA as locked context. Full UFC record is 13-0. |
| `wins` | 8 | High | RDA through Gaethje. |
| `losses` | 0 | High | No UFC losses. |
| `fightCount` | 8 | High | Elite-prime sample. |
| `bestConsecutiveTitleDefenseStreak` | 3 | High | Conor, Dustin, Gaethje after vacant title win over Iaquinta. |
| `timesFinishedPrime` | 0 | High | Never finished. |
| `primeFinishedLosses` | 0 | High | No losses. |
| `finishWins` | 4 | High | Johnson, McGregor, Poirier, Gaethje in proposed elite-prime window. |
| `finishRatePct` | 50.0 | High | 4 finishes / 8 prime wins using RDA start. Full UFC finish rate is higher if using all UFC wins. |
| `roundsWonPct` | TBD | Medium | Need round-by-round calculation. |

### Cody calls needed

| Call | My lean | Why asking |
|---|---|---|
| Prime start | RDA 2014 | This is already locked context and keeps the prime elite-focused. |
| Prime record | 8-0 elite-prime, 13-0 UFC context | Need decide which number shows on card if public snapshot uses prime window. |
| Finish rate | Use prime-window 50.0% or full UFC 61.5%? | For formula, prime-window finish rate should be used. For public card, full UFC finish rate may still be shown separately. |
| Title-defense streak | 3 | Shorter than DJ/GSP/Anderson but balanced by undefeated control/dominance. |

---

## Alexander Volkanovski

### Prime window proposal

| Field | Working value |
|---|---|
| Prime start | Jose Aldo 2019 |
| Prime end | Yair Rodriguez 2023 for featherweight prime; Topuria 2024 as prime-ending loss context |
| Window type | Modern featherweight title prime with upward-division Islam context |

### Prime fight list to include

Working same-division prime list:

1. Jose Aldo
2. Max Holloway 1
3. Max Holloway 2
4. Brian Ortega
5. Korean Zombie
6. Max Holloway 3
7. Yair Rodriguez
8. Ilia Topuria loss

Upward-division elite context:

- Islam Makhachev 1 loss
- Islam Makhachev 2 loss

Optional/excluded context:

- Chad Mendes could be included if prime starts before Aldo, but current locked context says prime starts around Aldo.
- Later post-Topuria fights should be treated separately if any are added.

### Prime snapshot working data

| Field | Working value | Confidence | Notes |
|---|---:|---|---|
| `record` | 7-1 FW prime; 7-3 including Islam upward losses | Medium | Need decide formula treatment for upward-division losses. |
| `wins` | 7 FW prime wins | High | Aldo through Yair. |
| `losses` | 1 FW loss or 3 total prime-context losses | Medium | Topuria same-division loss; Islam losses upward-division elite context. |
| `fightCount` | 8 FW fights; 10 including Islam | Medium | Need rule. |
| `bestConsecutiveTitleDefenseStreak` | 5 | High | Holloway 2, Ortega, Korean Zombie, Holloway 3, Yair after winning title. |
| `timesFinishedPrime` | 1 or 2 | Medium | Topuria KO and Islam 2 KO if upward-division finish included. |
| `primeFinishedLosses` | 1 FW, plus 1 upward-division | Medium | Need formula handling. |
| `finishWins` | 2 in proposed FW prime | Medium-high | Korean Zombie and Yair; verify if using Aldo start. |
| `finishRatePct` | 28.6% FW prime | Medium | 2 finishes / 7 FW prime wins. |
| `roundsWonPct` | TBD | Medium | Need prime-only round calc; likely strong. |

### Cody calls needed

| Call | My lean | Why asking |
|---|---|---|
| Prime start | Aldo 2019 | Already locked context. |
| Include Islam losses in prime record? | separate upward-division context, not normal prime losses | They should lightly cap Prime Dominance but not crater FW dominance. |
| Include Topuria loss | yes, as prime-ending same-division loss | It broke the FW prime and should hit loss safety more than Islam. |
| Title-defense streak | 5 | Major marker and a reason current Prime score probably undersells him. |

---

## Max Holloway

### Prime window proposal

| Field | Working value |
|---|---|
| Prime start | Cub Swanson 2015 / Anthony Pettis 2016 |
| Prime end | Current scoring-table late elite window, or Volkanovski 3 as end of title-prime |
| Window type | Featherweight title/elite volume-durability prime with later lightweight/current context |

### Prime fight list to include

Working title/elite prime list:

1. Cub Swanson
2. Charles Oliveira
3. Jeremy Stephens
4. Ricardo Lamas
5. Anthony Pettis
6. Jose Aldo 1
7. Jose Aldo 2
8. Brian Ortega
9. Dustin Poirier 2 loss at lightweight
10. Frankie Edgar
11. Alexander Volkanovski 1 loss
12. Alexander Volkanovski 2 loss
13. Calvin Kattar
14. Yair Rodriguez
15. Arnold Allen
16. Korean Zombie
17. Justin Gaethje
18. Ilia Topuria loss

Optional/excluded context:

- If strict featherweight prime only, exclude Dustin LW and Gaethje BMF/LW-ish context.
- If app current timeline includes extra title results, need separate current-table notes.

### Prime snapshot working data

| Field | Working value | Confidence | Notes |
|---|---:|---|---|
| `record` | TBD | Low-medium | Needs a clear prime-end rule. Max has a long elite window with losses but also late elite wins. |
| `wins` | TBD | Low-medium | Depends inclusion of Gaethje/current-table fights. |
| `losses` | TBD | Low-medium | Volk losses, Dustin LW loss, Ilia loss need context. |
| `fightCount` | TBD | Low-medium | Needs locked window. |
| `bestConsecutiveTitleDefenseStreak` | 3 | High | Aldo 2, Ortega, Edgar after undisputed title win. |
| `timesFinishedPrime` | 0 or 1 | Medium | Historically not finished; if Topuria current-table finish exists, need exact app timeline treatment. |
| `primeFinishedLosses` | 0 unless current-table finish loss exists | Medium | Need current-table timeline check. |
| `finishWins` | TBD | Medium | Need prime window and finish count. |
| `finishRatePct` | TBD | Medium | Full UFC finish rate is not enough. |
| `roundsWonPct` | TBD | Medium | Snapshot may exist elsewhere; needs prime-only calc. |

### Cody calls needed

| Call | My lean | Why asking |
|---|---|---|
| Prime start | Cub 2015 or Pettis 2016 | Cub starts the elite FW run; Pettis starts title-level run. This changes sample size. |
| Prime end | Keep long elite window but tag Volk as title-prime cap | Max stayed elite after Volk, so ending prime at Volk 3 may be too harsh. But the Volk rivalry should cap title-prime dominance. |
| Include LW losses/wins | include as context, not same as FW title-prime | Dustin/Gaethje are elite but not the clean FW dominance lane. |
| Title-defense streak | 3 | Clean undisputed FW defense streak. |

---

## Amanda Nunes

### Prime window proposal

| Field | Working value |
|---|---|
| Prime start | Sara McMann / Valentina 1 / Miesha Tate 2015-2016 |
| Prime end | Julianna Pena 2 / Irene Aldana 2023 |
| Window type | Two-division UFC title prime with Pena loss/rematch context |

### Prime fight list to include

Working prime list:

1. Sara McMann
2. Valentina Shevchenko 1
3. Miesha Tate
4. Ronda Rousey
5. Valentina Shevchenko 2
6. Raquel Pennington 1
7. Cris Cyborg
8. Holly Holm
9. Germaine de Randamie 2
10. Felicia Spencer
11. Megan Anderson
12. Julianna Pena 1 loss
13. Julianna Pena 2
14. Irene Aldana

Optional/excluded context:

- Earlier UFC wins Gaff/GDR 1/Baszler are pre-title setup/support, not necessarily prime dominance.
- Need decide whether to count featherweight defenses in same title-defense streak field.

### Prime snapshot working data

| Field | Working value | Confidence | Notes |
|---|---:|---|---|
| `record` | 13-1 in proposed prime window | Medium | If start at McMann and include Aldana. |
| `wins` | 13 | Medium | Needs exact start decision. |
| `losses` | 1 | High | Pena 1. |
| `fightCount` | 14 | Medium | Proposed McMann through Aldana. |
| `bestConsecutiveTitleDefenseStreak` | 5 BW-only or 7 all-title defenses | Medium | Needs Cody rule: per-belt streak vs all successful UFC title defenses across belts. |
| `timesFinishedPrime` | 1 | High | Pena submission. |
| `primeFinishedLosses` | 1 | High | Pena 1. |
| `finishWins` | TBD | Medium | Need prime-only finish count. |
| `finishRatePct` | TBD | Medium | Likely very high, but calculate from window. |
| `roundsWonPct` | TBD | Medium | Needs prime-only round calc. |

### Cody calls needed

| Call | My lean | Why asking |
|---|---|---|
| Prime start | McMann or Valentina 1 | McMann is elite contender setup; Valentina/Tate is true title-level start. |
| Prime end | Aldana 2023 | Keeps Pena loss/rematch and final defense inside prime/late-prime window. |
| Title-defense streak definition | use 7 all successful defenses, with note that BW-only is 5 | Amanda's two-division reign makes a per-belt-only streak undersell her dominance. But we need this rule locked before formula. |
| Pena loss | full prime/late-prime safety hit | It was real and finished. It should cap Prime Dominance. |

---

# Batch 1 fields needing calculation from data

These should be calculated next, not guessed:

| Fighter | Need `roundsWonPct` calc | Need `finishRatePct` calc | Need title-defense streak lock | Need prime record lock |
|---|---|---|---|---|
| Jon | yes, from base rounds | yes, from prime fight list | mostly locked at 8 | yes |
| GSP | yes | yes | locked at 9 | yes, reconcile existing 18-1 text |
| DJ | yes | yes | locked at 11 | yes, Cejudo 2 inclusion |
| Anderson | yes | yes | locked at 10 | yes, Weidman 2 finish context |
| Khabib | yes | mostly yes, 50.0% elite-prime working | locked at 3 | mostly locked 8-0 elite-prime |
| Volk | yes | yes, 28.6% FW-prime working | locked at 5 | needs Islam/Topuria rule |
| Max | yes | yes | locked at 3 | needs prime window/end rule |
| Amanda | yes | yes | needs 5 vs 7 rule | needs prime start rule |

---

# Suggested next step

Before assigning Prime Dominance scores, lock these calls:

| # | Fighter | Call | My lean |
|---:|---|---|---|
| 1 | Jon | Prime window | Bader/Shogun 2011 through Reyes 2020, Gane as HW extension |
| 2 | GSP | Prime window | Trigg/Sherk 2005 through Hendricks 2013; Bisping outside prime dominance |
| 3 | DJ | Include Cejudo 2? | Yes, as close prime-ending loss |
| 4 | Anderson | Include both Weidman losses? | Yes, both prime-context cap events; Weidman 2 noted as weird injury finish |
| 5 | Khabib | Prime window | RDA 2014 through Gaethje 2020; 8-0 elite-prime record |
| 6 | Volk | Islam losses | Separate upward-division context, not normal FW prime losses |
| 7 | Volk | Topuria loss | Include as FW prime-ending same-division loss |
| 8 | Max | Prime end | Keep long elite window but cap title-prime due to Volk rivalry |
| 9 | Amanda | Title-defense streak | Use 7 all successful UFC title defenses across belts, with BW-only 5 noted |
| 10 | Amanda | Prime start | McMann/Valentina 1/Tate range; lean Valentina 1 for true title-level prime |

After those are locked, calculate the actual formula components from the snapshot/fight rows and update this worksheet with scores.