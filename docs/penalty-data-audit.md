# Penalty Data Audit

Version: `penalty-data-audit-20260705c`  
Status: Batch 1, Batch 2, and Batch 3 worksheets only. Not live scoring.  
Live app impact: None.

## Active 37 Scope

This audit should only cover the fighters currently active in the app source.

Current active source is:

- 35 fighter packet extensions loaded by `assets/data/ranking-data-patches.js`
- plus Jon Jones and Georges St-Pierre from `assets/data/fighter-packets.js`

That equals 37 active fighters.

Do not add non-active candidate names to this worksheet unless they are first added to the app source.

## Goal

Penalty answers one question:

> How much should UFC losses damage the UFC-only GOAT case?

This category is not a second Opponent Quality score and not a punishment for simply fighting tough opponents. It should separate clean elite resumes from messy elite resumes using timing, opponent quality, finish context, and division context.

## Locked Penalty Rules

| Loss type | Penalty |
| --- | ---: |
| Pre-prime loss to champion/top-5 | -0.75 |
| Pre-prime loss to non-elite | -1.25 |
| Prime loss to champion/top-5 | -1.50 |
| Prime loss to non-elite | -4.00 |
| Finished in counted loss | extra -0.75 |
| Post-prime loss | 0.00 |
| Prime upward-division loss to champion/top-5 | -0.75 |
| Finished upward-division vs champion/top-5 | extra -0.50 |

## Cap Rule

Penalty is capped at `-10.00` so late-career damage cannot completely swamp the whole scoring model.

Use the raw sum first, then cap at `-10.00` if needed.

## How to Read the Worksheet

Each fighter should be scored in this order:

1. List the counted UFC losses.
2. Mark each counted loss as pre-prime, prime, upward-division, or post-prime.
3. Decide whether the opponent was champion/top-5 or non-elite for penalty purposes.
4. Add the finished-loss extra only when the counted loss was a finish.
5. Exclude post-prime losses from penalty value, while still mentioning them as context.
6. Add the penalties and cap at `-10.00`.

Do not start with a desired final score.

## Guardrails

- UFC-only.
- No contests are excluded from scoring.
- Jon Jones' Matt Hamill DQ is not treated like a real competitive loss.
- WEC, Pride, Strikeforce, ONE, Bellator, and regional achievements do not affect the penalty score.
- Post-prime losses can be mentioned as resume context, but they do not add penalty points.
- Weird/technical results need context.
- Current table/app timeline can be used as the source of truth if it intentionally extends beyond real-world current records.

## Batch 1: High-Impact Penalty Cases

These are the first fighters audited because Penalty is most likely to affect their overall rank or explain why a long/elite resume should not climb too high.

| Fighter | Counted UFC losses | Raw penalty | Capped penalty | Current live penalty | Change vs current | Notes |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| Jose Aldo | McGregor 2015: prime champ/top-5 finish = -2.25; Holloway 1: prime champ/top-5 finish = -2.25; Holloway 2: prime champ/top-5 finish = -2.25; Volkanovski 2019: prime/late-prime champ-top-5 decision = -1.50. Yan/Merab late BW losses treated post-prime for Penalty. | -8.25 | -8.25 | -6.75 | -1.50 | This is the first real correction candidate. Aldo's UFC-only case should carry the Volk loss as late-prime/elite-window damage, while late BW losses stay post-prime. |
| B.J. Penn | Pulver 2002: pre-prime champ/top-5 decision = -0.75; GSP 2006: prime champ/top-5 decision = -1.50; Hughes 2006: prime champ/top-5 finish = -2.25; GSP 2009: prime champ/top-5 finish = -2.25; Edgar 1 and Edgar 2: prime champ/top-5 decisions = -3.00 total. Later collapse treated post-prime. | -9.75 | -9.75 | -8.50 | -1.25 | B.J. should probably be harsher than current but not automatically maxed if the worst late-career losses are excluded. |
| Chuck Liddell | Couture 2003: prime champ/top-5 finish = -2.25; Rampage 2007: prime champ/top-5 finish = -2.25; Jardine 2007: prime non-elite decision = -4.00; Evans 2008: prime champ/top-5 finish = -2.25. Later Shogun/Franklin losses treated post-prime. | -10.75 | -10.00 | -10.00 | 0.00 | Existing cap still makes sense. Jardine is the harsh loss because it is a prime non-elite decision loss. |
| Max Holloway | McGregor/Bermudez/Poirier early losses plus Poirier 2019, Volk trilogy, and later elite losses push raw penalty beyond cap. | Below -10 | -10.00 | -10.00 | 0.00 | Max remains capped. His overall case survives because Championship/OQ/Longevity carry him, but Penalty should stay harsh. |
| Dustin Poirier | McGregor early finish, Michael Johnson finish, Khabib/Charles/Gaethje/Islam title-level finish losses push raw penalty beyond cap. | Below -10 | -10.00 | -10.00 | 0.00 | Dustin remains capped. This is correct: great resume, but many elite/title losses. |
| Justin Gaethje | Alvarez/Poirier/Khabib/Oliveira/Holloway and current-table elite/title-loss context push raw penalty beyond cap. | Below -10 | -10.00 | -10.00 | 0.00 | Justin remains capped. Penalty is why his violence/quality/longevity cannot over-climb. |
| Israel Adesanya | Jan 2021: prime upward-division champ/top-5 decision = -0.75; Pereira 2022: prime champ/top-5 finish = -2.25; Strickland 2023: prime top-5/title-level decision = -1.50; DDP 2024: prime champ/top-5 finish = -2.25. | -6.75 | -6.75 | -6.75 | 0.00 | Current live penalty already fits the locked rules if Strickland is treated as top-five/title-level instead of non-elite. |
| Dan Henderson | Rampage 2007: prime champ/top-5 decision = -1.50; Anderson 2008: prime champ/top-5 finish = -2.25; Machida 2013: late-prime top-5 decision = -1.50. Later Evans/Vitor/Cormier/Mousasi/Bisping losses treated post-prime/context-heavy. | -5.25 | -5.25 | -5.50 | +0.25 | Slightly less harsh than current. Hendo's UFC-only ceiling is already capped elsewhere by Championship/record/OQ, so do not over-punish late veteran losses. |
| Anderson Silva | Weidman 1: prime champ/top-5 finish = -2.25; Weidman 2: prime/in-prime champ/top-5 finish = -2.25. Bisping/DC/Adesanya/Cannonier/Hall treated post-prime/context-heavy. | -4.50 | -4.50 | -4.50 | 0.00 | Current live penalty already fits the locked rule that Weidman losses count as in-prime while later losses are post-prime. |
| Alexander Volkanovski | Islam 1: prime upward-division champ/top-5 decision = -0.75; Islam 2: prime upward-division champ/top-5 finish = -1.25; Topuria: prime champ/top-5 finish = -2.25. | -4.25 | -4.25 | -4.25 | 0.00 | Current live penalty already matches the locked upward-division Islam rule. |

## Batch 2: Clean GOAT / Champion Core

| Fighter | Counted UFC losses | Raw penalty | Capped penalty | Current live penalty | Change vs current | Notes |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| Jon Jones | Matt Hamill DQ not treated as a true competitive loss. Daniel Cormier no contest is not a scored loss. | 0.00 | 0.00 | 0.00 | 0.00 | Locked benchmark. No competitive UFC loss penalty. |
| Georges St-Pierre | Hughes 2004: pre-prime champ/top-5 decision = -0.75; Serra 2007: prime non-elite finish = -4.75. | -5.50 | -5.50 | -6.25 | +0.75 | This is a correction candidate. Hughes was elite but pre-prime. Serra should hurt badly, but current score may be slightly too harsh. |
| Demetrious Johnson | Cruz 2011: pre-prime champ/top-5 decision at bantamweight = -0.75; Cejudo 2018: prime champ/top-5 decision = -1.50. | -2.25 | -2.25 | -3.00 | +0.75 | DJ should be slightly cleaner than current. Cruz was before the flyweight title-prime, not a full prime-damage loss. |
| Khabib Nurmagomedov | No UFC losses. | 0.00 | 0.00 | 0.00 | 0.00 | Locked clean UFC penalty case. |
| Islam Makhachev | Adriano Martins 2015: pre-prime non-elite finish = -2.00. | -2.00 | -2.00 | -2.00 | 0.00 | Current live penalty already fits the locked rule. |
| Randy Couture | Multiple prime/title-level finish losses and mixed old-era title losses push raw penalty beyond cap. Barnett/Rodriguez/Liddell/Brock are enough to justify the cap even if later losses are post-prime. | Below -10 | -10.00 | -10.00 | 0.00 | Current cap still makes sense. Randy's career value comes from Championship/Longevity, not clean penalty. |
| Matt Hughes | Hallman 2000: pre-prime non-elite finish = -2.00; B.J. Penn 2004: prime champ/top-5 finish = -2.25; GSP 2006: prime champ/top-5 finish = -2.25; Alves 2008: late-prime top-5 finish = -2.25. Later Penn/Koscheck losses treated post-prime. | -8.75 | -8.75 | -10.00 | +1.25 | This is a correction candidate. Hughes should be punished, but current cap may overcount clearly post-prime late losses. |
| Daniel Cormier | Jones 2015: prime champ/top-5 decision = -1.50; Stipe 2019: prime champ/top-5 finish = -2.25; Stipe 2020: prime/late-prime champ-top-5 decision = -1.50. Jones 2017 NC is not a scored loss. | -5.25 | -5.25 | -5.25 | 0.00 | Current live penalty fits the locked rules. |
| Stipe Miocic | Struve 2012: pre-prime non-elite finish = -2.00; JDS 2014: prime champ/top-5 decision = -1.50; Cormier 2018: prime champ/top-5 finish = -2.25; Ngannou 2021: prime/late-prime champ-top-5 finish = -2.25. Jones late fight excluded per Cody. | -8.00 | -8.00 | -8.00 | 0.00 | Current live penalty fits the locked rules and Cody's Jones exclusion. |
| Cain Velasquez | JDS 2011: prime champ/top-5 finish = -2.25; Werdum 2015: prime champ/top-5 finish = -2.25. Ngannou 2019 treated post-prime/injury-back-end context. | -4.50 | -4.50 | -4.50 | 0.00 | Current live penalty fits. Cain's issue is injuries/longevity more than penalty. |

## Batch 3: Modern Active / Near-Active Core

| Fighter | Counted UFC losses | Raw penalty | Capped penalty | Current live penalty | Change vs current | Notes |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| Kamaru Usman | Edwards 2022: prime champ/top-5 finish = -2.25; Edwards 2023: prime champ/top-5 decision = -1.50; Khamzat 2023: prime upward-division elite decision = -0.75. | -4.50 | -4.50 | -4.50 | 0.00 | Current live penalty fits. The Khamzat middleweight loss gets reduced upward-division treatment. |
| Aljamain Sterling | Caraway 2016: pre-prime non-elite decision = -1.25; Assuncao 2017: pre-prime top-5 decision = -0.75; Moraes 2017: pre-prime top-5 finish = -1.50; O'Malley 2023: prime champ/top-5 finish = -2.25; Evloev/current-table late FW elite decision = -1.50. | -7.25 | -7.25 | -6.25 | -1.00 | Correction candidate. If current-table Evloev counts as late elite proof, it should also count as a real late elite loss. |
| T.J. Dillashaw | Dodson 2011: pre-prime non-elite finish = -2.00; Assuncao 2013: pre-prime top-5 decision = -0.75; Cruz 2016: prime champ/top-5 decision = -1.50; Cejudo 2019: prime champ/top-5 finish at flyweight = -2.25; Sterling 2022: late-prime/injury title finish context = -0.75. | -7.25 | -7.25 | -7.25 | 0.00 | Current live penalty fits if Sterling is discounted for the shoulder-injury context rather than treated as a normal clean finish loss. |
| Petr Yan | Sterling DQ 2021: technical/non-competitive title loss context = -0.75; Sterling 2022: prime champ/top-5 decision = -1.50; O'Malley 2022: prime top-5 decision = -1.50; Merab 2023: prime champ/top-5 decision = -1.50. | -5.25 | -5.25 | -5.25 | 0.00 | Current live penalty fits. DQ is discounted but not ignored entirely because it officially changed the title/resume path. |
| Merab Dvalishvili | Saenz 2017: pre-prime non-elite decision = -1.25; Simon 2018: pre-prime non-elite technical finish = -2.00; Yan/current-table rivalry loss: prime champ/top-5 decision = -1.50. | -4.75 | -4.75 | -4.75 | 0.00 | Current live penalty fits the packet's Yan split/rivalry context and 13-3 record. |
| Charles Oliveira | Miller/Cerrone/Swanson/Edgar/Pettis/Felder/Islam/Arman/Topuria and other counted elite/non-elite losses push raw penalty beyond cap. | Below -10 | -10.00 | -10.00 | 0.00 | Current cap is correct. Charles is exactly why the cap exists: long career, big wins, but too many losses to leave uncapped. |
| Alex Pereira | Adesanya 2023: prime champ/top-5 finish = -2.25; Ankalaev/current-table elite decision = -1.50; Gane current-table upward-division elite finish = -1.25. | -5.00 | -5.00 | -5.00 | 0.00 | Current live penalty fits the packet's Gane-loss update and reduced upward-division treatment. |
| Henry Cejudo | Demetrious Johnson 2016: pre-prime champ/top-5 finish = -1.50; Benavidez 2016: pre-prime champ/top-5 decision = -0.75; Sterling 2023: return/title-level decision = -1.50; Merab 2024: late elite decision = -1.50. | -5.25 | -5.25 | -6.75 | +1.50 | Correction candidate. The first DJ loss was pre-prime, and the comeback losses should count, but not like a pile of prime collapses. |
| Conor McGregor | Diaz 2016: prime non-elite finish = -4.75; Khabib 2018: prime champ/top-5 finish = -2.25. Poirier 2021 losses treated post-prime/back-end context for Penalty. | -7.00 | -7.00 | -7.00 | 0.00 | Current live penalty fits. Diaz is the harsh loss; Khabib is elite-title finish damage. |
| Ilia Topuria | Source conflict: scoring row currently carries -2.25, but fighter packet says UFC Record 9-0 and Loss Context: No UFC losses. | 0.00 or -2.25 | Needs Cody call | -2.25 | TBD | Needs cleanup before live Penalty correction. If packet is source of truth, Ilia should be 0.00. If current-table Gaethje loss is intended, keep -2.25 and update packet/display copy. |

## Batch 1 + 2 + 3 Shape Read

- Jose Aldo: `-6.75 -> -8.25` is the biggest ranking-relevant downgrade so far.
- B.J. Penn: `-8.50 -> -9.75` also looks right if late collapse is excluded but prime losses are counted properly.
- Georges St-Pierre: `-6.25 -> -5.50` looks cleaner under the locked rule because Hughes 2004 is pre-prime.
- Demetrious Johnson: `-3.00 -> -2.25` looks cleaner because Cruz was pre-flyweight-prime.
- Matt Hughes: `-10.00 -> -8.75` is a meaningful correction if late post-prime losses are excluded.
- Aljamain Sterling: `-6.25 -> -7.25` if current-table late FW elite loss is intended.
- Henry Cejudo: `-6.75 -> -5.25` because early DJ/Benavidez losses were pre-prime and comeback losses should not be stacked like prime collapses.
- Dan Henderson: `-5.50 -> -5.25` is a small cleanup.
- Ilia Topuria has a source conflict: scoring row says `-2.25`, packet says no UFC losses.
- The rest of Batches 1-3 mostly already fit the locked rules.

## Remaining Batch Candidates

Audit these next:

- Frankie Edgar
- Dominick Cruz
- Francis Ngannou
- Amanda Nunes
- Valentina Shevchenko
- Joanna Jedrzejczyk
- Ronda Rousey

## Approval Gate

Do not create `assets/data/penalty-score-corrections.js` until Cody approves the active-37 Penalty score shape.

After approval:

1. Create `assets/data/penalty-score-corrections.js`.
2. Load it in `assets/data/ranking-data-patches.js` after Longevity and before `score-derived-ovr.js`.
3. Recalculate totals and ranks after Penalty patches.
4. Expose status in `window.UFC_PHASE2_DATA_STATUS.penaltyScoreCorrections`.
