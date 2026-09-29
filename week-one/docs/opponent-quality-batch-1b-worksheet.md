# Opponent Quality Batch 1B Worksheet

Last updated: 2026-07-03

Purpose: redo Batch 1 with formula math only. No live app score changes are approved from this worksheet until the correction module is created.

Status: Batch 1B assumptions locked by Cody on 2026-07-03.

## Locked formula

```text
Opponent Quality Score = 25 × Fighter Adjusted Opponent Quality Index ÷ Current Best Adjusted Opponent Quality Index
```

## Locked base credit table with middle tier

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

## Locked diminishing returns rule

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

## Locked Batch 1B calls

| Fight / rule | Locked call |
|---|---:|
| Max Holloway over Charles Oliveira injury stoppage | 0.25 |
| Dustin Poirier over Conor McGregor 3 injury finish | 0.25 |
| Charles Oliveira over Justin Gaethje stripped-title fight | 1.00 |
| Aljamain Sterling over Petr Yan by DQ | 0.25 |
| Aljamain Sterling over injured T.J. Dillashaw | 1.00 |
| Jon Jones over Anthony Smith | 0.75 |
| Jon Jones over Thiago Santos | 1.00 |
| Jon Jones over Dominick Reyes | 1.00 |
| Kamaru Usman over Jorge Masvidal 1 | 1.00 |
| Kamaru Usman over Jorge Masvidal 2 | 1.00, based on FightMatrix #4 |
| Kamaru Usman over Joaquin Buckley | 1.00, included in current app timeline |

## Locked 0.75 middle-tier placements

| Fighter | 0.75 wins locked for this batch |
|---|---|
| GSP | B.J. Penn 2 |
| Jon Jones | Lyoto Machida, Glover Teixeira, Alexander Gustafsson 2, Anthony Smith |
| Volkanovski | Chad Mendes |
| Kamaru Usman | Demian Maia |
| Max Holloway | Anthony Pettis, Frankie Edgar |
| Dustin Poirier | Anthony Pettis, Eddie Alvarez, Dan Hooker, Conor McGregor 2 |
| Charles Oliveira | Tony Ferguson |
| Aljamain Sterling | Jimmie Rivera, Pedro Munhoz, Brian Ortega |

Kevin Lee remains 0.50 for Charles in this batch.

## Locked division / era adjustments

| Fighter | Adjustment |
|---|---:|
| Georges St-Pierre | 1.05 |
| Jon Jones | 1.00 |
| Alexander Volkanovski | 1.05 |
| Kamaru Usman | 1.00 |
| Max Holloway | 1.05 |
| Dustin Poirier | 1.10 |
| Charles Oliveira | 1.10 |
| Aljamain Sterling | 1.00 |

## Locked Batch 1B computed worksheet

These are formula outputs using the locked calls above. They are locked for the audit trail, but not yet applied live.

| Fighter | Current OQ | Quality wins count | Discounted quality index | Raw support | Support after 2.50 cap | Base OQ index | Div/era adj. | Adjusted OQ index | Formula OQ score |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Georges St-Pierre | 25.00 | 15 | 13.13 | 1.75 | 1.75 | 14.88 | 1.05 | 15.62 | 25.00 |
| Jon Jones | 16.92 | 13 | 11.06 | 2.00 | 2.00 | 13.06 | 1.00 | 13.06 | 20.90 |
| Alexander Volkanovski | 14.45 | 9 | 8.81 | 1.00 | 1.00 | 9.81 | 1.05 | 10.30 | 16.48 |
| Kamaru Usman | 13.63 | 9 | 8.81 | 0.50 | 0.50 | 9.31 | 1.00 | 9.31 | 14.90 |
| Max Holloway | 19.64 | 11 | 10.13 | 2.00 | 2.00 | 12.13 | 1.05 | 12.73 | 20.37 |
| Dustin Poirier | 18.85 | 7 | 6.00 | 2.75 | 2.50 | 8.50 | 1.10 | 9.35 | 14.96 |
| Charles Oliveira | 17.85 | 5 | 4.75 | 3.50 | 2.50 | 7.25 | 1.10 | 7.98 | 12.76 |
| Aljamain Sterling | 13.90 | 7 | 6.25 | 2.50 | 2.50 | 8.75 | 1.00 | 8.75 | 14.00 |

## Notes before live implementation

- Batch 1B is locked as an audit result.
- No live app score changes have been made yet.
- Live implementation should happen through an `opponent-quality-score-corrections.js` module, then re-sort by raw total.