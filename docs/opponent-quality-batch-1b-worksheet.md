# Opponent Quality Batch 1B Worksheet

Last updated: 2026-07-03

Purpose: redo Batch 1 with formula math only. No live app score changes are approved from this worksheet.

## Locked formula

```text
Opponent Quality Score = 25 × Fighter Adjusted Opponent Quality Index ÷ Current Best Adjusted Opponent Quality Index
```

## Revised base credit table with middle tier

Cody approved adding the 0.75 middle tier.

| Win type | Credit |
|---|---:|
| Beat sitting UFC champion | 1.25 |
| Beat elite top-5 / title-level contender | 1.00 |
| Beat championship-level former champ / very strong ranked contender | 0.75 |
| Beat strong ranked contender / former champ still good | 0.50 |
| Beat name-value guy past prime / future elite before prime | 0.25 |
| Weird / injury / fluky win | Cody call, usually 0.00-0.50 |
| Loss / no contest / draw | 0.00 |

## Revised diminishing returns rule

The 0.75 tier is treated as a quality win, not as capped support.

| Credit bucket | Treatment |
|---|---|
| First 8 quality wins, sorted by credit | 100% value |
| Quality wins 9-12 | 75% value |
| Quality wins after 12 | 50% value |
| Support wins under 0.75 credit | Add normally, but support total is capped at 2.50 index points |

Quality win = 0.75, 1.00, or 1.25 before diminishing returns.  
Support win = 0.50 or 0.25.  
Cody set the support cap at 2.50 on 2026-07-03.

## Required Cody calls before final scores

### A. Weird-fight / edge-credit calls

| Fight | Working credit | Status / Cody call needed |
|---|---:|---|
| Max Holloway over Charles Oliveira injury stoppage | 0.25 | Needs final lock: small credit or 0.00? |
| Dustin Poirier over Conor McGregor 3 injury finish | 0.25 | Needs final lock: small credit or 0.00? |
| Charles Oliveira over Justin Gaethje stripped-title fight | 1.00 | Needs final lock: keep as full elite OQ win because Gaethje was elite? |
| Aljamain Sterling over Petr Yan by DQ | 0.25 | Needs final lock: small credit or 0.00? |
| Aljamain Sterling over injured T.J. Dillashaw | 1.00 | Cody call: full credit. Injury context belongs outside OQ. |
| Jon Jones over Anthony Smith | 0.75 | Cody call: not reduced for dominance; simply middle-tier title-level opponent. |
| Jon Jones over Thiago Santos | 1.00 | Cody call: keep full OQ; closeness belongs in Prime Dominance. |
| Jon Jones over Dominick Reyes | 1.00 | Cody call: keep full OQ; controversy belongs in Prime Dominance. |
| Kamaru Usman over Jorge Masvidal 1 | 1.00 | Needs final lock: full top-5/title-challenger credit? |
| Kamaru Usman over Jorge Masvidal 2 | 1.00 | Current source says FightMatrix #4. Needs final lock if UFC-official ranking differed. |
| Kamaru Usman over Joaquin Buckley | 1.00 | Include current app timeline top-5 win, or exclude/discount? |

### B. Middle-tier placement calls

These are the key 0.75 placements used in the working math. Cody should approve or change them.

| Fighter | 0.75 working-credit wins | Cody call needed |
|---|---|---|
| GSP | B.J. Penn 2 | Cross-division champion rematch at WW: 0.75 okay? |
| Jon Jones | Lyoto Machida, Glover Teixeira, Alexander Gustafsson 2, Anthony Smith | Smith moved from 1.00 to 0.75 after Cody discussion. |
| Volkanovski | Chad Mendes | Strong former title challenger: 0.75 okay? |
| Kamaru Usman | Demian Maia | Strong former title challenger/top ranked: 0.75 okay? |
| Max Holloway | Anthony Pettis, Frankie Edgar | Former champs still good but context-limited: 0.75 okay? |
| Dustin Poirier | Anthony Pettis, Eddie Alvarez, Dan Hooker, Conor McGregor 2 | These are the big middle-tier calls for Dustin. |
| Charles Oliveira | Tony Ferguson | Should Kevin Lee also be 0.75? Working math keeps Kevin at 0.50. |
| Aljamain Sterling | Jimmie Rivera, Pedro Munhoz, Brian Ortega | Are Rivera/Munhoz/Ortega 0.75 or 0.50? |

### C. Division / era adjustment calls

These are not automatic. Cody should approve or change them.

| Fighter | Working adjustment | Reason |
|---|---:|---|
| Georges St-Pierre | 1.05 | GSP welterweight era default. Benchmark candidate. |
| Jon Jones | 1.00 | Early LHW strong enough; late LHW/HW could argue 0.95 blended. Cody call. |
| Alexander Volkanovski | 1.05 | Modern featherweight strength. |
| Kamaru Usman | 1.00 | Modern WW strong, but not automatically GSP-era 1.05 unless Cody says so. |
| Max Holloway | 1.05 | Modern featherweight/lightweight quality. |
| Dustin Poirier | 1.10 | Modern lightweight murderers' row. |
| Charles Oliveira | 1.10 | Modern lightweight murderers' row. |
| Aljamain Sterling | 1.00 | Modern bantamweight default. |

## Batch 1B computed worksheet under working assumptions

Important: these are formula outputs using the working calls above. They are not final recommendations yet.

| Fighter | Current OQ | Quality wins count | Discounted quality index | Raw support | Support after 2.50 cap | Base OQ index | Working div/era adj. | Adjusted OQ index | Formula OQ score |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Georges St-Pierre | 25.00 | 15 | 13.13 | 1.75 | 1.75 | 14.88 | 1.05 | 15.62 | 25.00 |
| Jon Jones | 16.92 | 13 | 11.06 | 2.00 | 2.00 | 13.06 | 1.00 | 13.06 | 20.90 |
| Alexander Volkanovski | 14.45 | 9 | 8.81 | 1.00 | 1.00 | 9.81 | 1.05 | 10.30 | 16.48 |
| Kamaru Usman | 13.63 | 9 | 8.81 | 0.50 | 0.50 | 9.31 | 1.00 | 9.31 | 14.90 |
| Max Holloway | 19.64 | 11 | 10.13 | 2.00 | 2.00 | 12.13 | 1.05 | 12.73 | 20.37 |
| Dustin Poirier | 18.85 | 7 | 6.00 | 2.75 | 2.50 | 8.50 | 1.10 | 9.35 | 14.96 |
| Charles Oliveira | 17.85 | 5 | 4.75 | 3.50 | 2.50 | 7.25 | 1.10 | 7.98 | 12.76 |
| Aljamain Sterling | 13.90 | 7 | 6.25 | 2.50 | 2.50 | 8.75 | 1.00 | 8.75 | 14.00 |

## What this exposes after adding 0.75 and 2.50 support cap

- GSP stays the benchmark.
- Jon still jumps because many title challengers grade as 1.00 and several former champs now become 0.75, but Smith moving to 0.75 trims him slightly.
- Max remains very high, which makes sense because he has both elite wins and volume.
- Volk rises to a more reasonable Quality Wins range.
- Kamaru rises modestly under the FightMatrix #4 Masvidal 2 assumption.
- Dustin improves compared with the 2.00 support cap, but still lands below current score.
- Charles improves slightly but still drops because his non-title-run wins remain mostly support wins.
- Aljo rises after Cody called the injured T.J. Dillashaw win full OQ credit.

## Remaining decision point before live changes

The support cap is set at 2.50.

Before final scores, Cody still needs to confirm:

1. remaining weird-fight credits,
2. 0.75 middle-tier placements,
3. division/era adjustments,
4. whether Masvidal 2 stays full 1.00 using FightMatrix #4 or should be lowered if Cody wants UFC-official ranking only.

Then rerun Batch 1B and produce final computed OQ scores. Only after that should a live correction module be created.