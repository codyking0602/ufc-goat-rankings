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

The 0.75 tier must be useful, so it is treated as a quality win, not as capped support.

| Credit bucket | Treatment |
|---|---|
| First 8 quality wins, sorted by credit | 100% value |
| Quality wins 9-12 | 75% value |
| Quality wins after 12 | 50% value |
| Support wins under 0.75 credit | Add normally, but support total is capped at 2.00 index points |

Quality win = 0.75, 1.00, or 1.25 before diminishing returns.  
Support win = 0.50 or 0.25.

## Required Cody calls before final scores

### A. Weird-fight / edge-credit calls

| Fight | Working credit | Cody call needed |
|---|---:|---|
| Max Holloway over Charles Oliveira injury stoppage | 0.25 | Keep small credit, or make 0.00? |
| Dustin Poirier over Conor McGregor 3 injury finish | 0.25 | Keep small credit, or make 0.00? |
| Charles Oliveira over Justin Gaethje stripped-title fight | 1.00 | Keep as full elite OQ win because Gaethje was elite? |
| Aljamain Sterling over Petr Yan by DQ | 0.25 | Keep small weird-win credit, or make 0.00? |
| Aljamain Sterling over injured T.J. Dillashaw | 0.25 | Keep small weird-win credit, or make 0.00/0.50? |
| Jon Jones over Anthony Smith | 1.00 | Keep full title-level/top-5 credit, or lower to 0.75/0.50? |
| Jon Jones over Thiago Santos | 1.00 | Keep full title-level/top-5 credit, or lower to 0.75/0.50? |
| Jon Jones over Dominick Reyes | 1.00 | Keep full title-level/top-5 credit despite controversy, or lower? |
| Kamaru Usman over Jorge Masvidal 1 | 1.00 | Keep full top-5/title-challenger credit, or lower to 0.75/0.50? |
| Kamaru Usman over Jorge Masvidal 2 | 1.00 | Keep repeat full credit, or lower to 0.75/0.50? |
| Kamaru Usman over Joaquin Buckley | 1.00 | Include current app timeline top-5 win, or exclude/discount? |

### B. Middle-tier placement calls

These are the key 0.75 placements used in the working math. Cody should approve or change them.

| Fighter | 0.75 working-credit wins | Cody call needed |
|---|---|---|
| GSP | B.J. Penn 2 | Cross-division champion rematch at WW: 0.75 okay? |
| Jon Jones | Lyoto Machida, Glover Teixeira, Alexander Gustafsson 2 | Keep at 0.75 instead of 0.50/1.00? |
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

| Fighter | Current OQ | Quality wins count | Discounted quality index | Raw support | Support after 2.00 cap | Base OQ index | Working div/era adj. | Adjusted OQ index | Formula OQ score |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Georges St-Pierre | 25.00 | 15 | 13.13 | 1.75 | 1.75 | 14.88 | 1.05 | 15.62 | 25.00 |
| Jon Jones | 16.92 | 13 | 11.25 | 2.00 | 2.00 | 13.25 | 1.00 | 13.25 | 21.21 |
| Alexander Volkanovski | 14.45 | 9 | 8.81 | 1.00 | 1.00 | 9.81 | 1.05 | 10.30 | 16.49 |
| Kamaru Usman | 13.63 | 9 | 8.81 | 0.50 | 0.50 | 9.31 | 1.00 | 9.31 | 14.91 |
| Max Holloway | 19.64 | 11 | 10.13 | 2.00 | 2.00 | 12.13 | 1.05 | 12.73 | 20.38 |
| Dustin Poirier | 18.85 | 7 | 6.00 | 2.75 | 2.00 | 8.00 | 1.10 | 8.80 | 14.09 |
| Charles Oliveira | 17.85 | 5 | 4.75 | 3.50 | 2.00 | 6.75 | 1.10 | 7.43 | 11.88 |
| Aljamain Sterling | 13.90 | 6 | 5.25 | 2.75 | 2.00 | 7.25 | 1.00 | 7.25 | 11.60 |

## What this exposes after adding 0.75

The middle tier helps, but it does not fully solve the Dustin/Charles problem under the current support cap.

- GSP stays the benchmark.
- Jon jumps because many title challengers still grade as 1.00 and several former champs now become 0.75.
- Max remains very high, which makes sense because he has both elite wins and volume.
- Volk rises to a more reasonable Quality Wins range.
- Kamaru rises modestly.
- Dustin improves from the strict version but is still far below his current score.
- Charles still drops hard because most of his non-title-run wins remain support wins and get capped.
- Aljo drops, which may be correct if Yan DQ/TJ injury stay small.

## Decision point before rerun/live changes

Before the next rerun, Cody needs to choose these broad rules:

### 1. Is support cap 2.00 too harsh?

Current support cap: 2.00.

Potential alternatives:

| Support cap | Effect |
|---:|---|
| 2.00 | Very strict; prevents volume but hurts Dustin/Charles. |
| 3.00 | Balanced; gives deep schedules more respect without letting support wins dominate. |
| 4.00 | More volume-friendly; likely helps Max/Dustin/Charles a lot. |

My current recommendation: move support cap from 2.00 to 3.00.

### 2. Should 0.75 wins count as quality wins for diminishing returns?

Working answer in this worksheet: yes.

If no, the 0.75 tier gets capped too quickly and does not solve much.

### 3. Should modern lightweight stay 1.10?

Working answer: yes.

Do not use division adjustment as a band-aid for every lightweight. Fix the base credit/cap first.

## Next rerun after Cody calls

After Cody confirms:

1. weird-fight credits,
2. 0.75 middle-tier placements,
3. support cap,
4. division/era adjustments,

then rerun Batch 1B and produce final computed OQ scores. Only after that should a live correction module be created.