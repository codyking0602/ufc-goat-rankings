# Opponent Quality Batch 1B Worksheet

Last updated: 2026-07-03

Purpose: redo Batch 1 with formula math only. No live app score changes are approved from this worksheet.

## Locked formula

```text
Opponent Quality Score = 25 × Fighter Adjusted Opponent Quality Index ÷ Current Best Adjusted Opponent Quality Index
```

## Locked base credit table

| Win type | Credit |
|---|---:|
| Beat sitting UFC champion | 1.25 |
| Beat elite top-5 / title-level contender | 1.00 |
| Beat strong ranked contender / former champ still good | 0.50 |
| Beat name-value guy past prime / future elite before prime | 0.25 |
| Weird / injury / fluky win | Cody call, usually 0.25-0.50 |
| Loss / no contest / draw | 0.00 |

## Locked diminishing returns rule

| Credit bucket | Treatment |
|---|---|
| First 8 elite wins, sorted by credit | 100% value |
| Elite wins 9-12 | 75% value |
| Elite wins after 12 | 50% value |
| Support wins under 1.00 credit | Add normally, but support total is capped at 2.00 index points |

Elite win = 1.00 or 1.25 before diminishing returns.  
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
| Jon Jones over Anthony Smith | 1.00 | Keep full title-level/top-5 credit, or lower to 0.50? |
| Jon Jones over Thiago Santos | 1.00 | Keep full title-level/top-5 credit, or lower to 0.50? |
| Jon Jones over Dominick Reyes | 1.00 | Keep full title-level/top-5 credit despite controversy, or lower? |
| Kamaru Usman over Jorge Masvidal 1 | 1.00 | Keep full top-5/title-challenger credit, or lower to 0.50? |
| Kamaru Usman over Jorge Masvidal 2 | 1.00 | Keep repeat full credit, or lower to 0.50? |
| Kamaru Usman over Joaquin Buckley | 1.00 | Include current app timeline top-5 win, or exclude/discount? |

### B. Division / era adjustment calls

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

| Fighter | Current OQ | Elite wins count | Discounted elite index | Raw support | Support after 2.00 cap | Base OQ index | Working div/era adj. | Adjusted OQ index | Formula OQ score |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Georges St-Pierre | 25.00 | 14 | 12.75 | 2.25 | 2.00 | 14.75 | 1.05 | 15.49 | 25.00 |
| Jon Jones | 16.92 | 10 | 9.75 | 3.50 | 2.00 | 11.75 | 1.00 | 11.75 | 18.97 |
| Alexander Volkanovski | 14.45 | 8 | 8.25 | 1.50 | 1.50 | 9.75 | 1.05 | 10.24 | 16.53 |
| Kamaru Usman | 13.63 | 8 | 8.25 | 1.00 | 1.00 | 9.25 | 1.00 | 9.25 | 14.93 |
| Max Holloway | 19.64 | 9 | 9.00 | 3.00 | 2.00 | 11.00 | 1.05 | 11.55 | 18.64 |
| Dustin Poirier | 18.85 | 4 | 4.00 | 4.25 | 2.00 | 6.00 | 1.10 | 6.60 | 10.65 |
| Charles Oliveira | 17.85 | 4 | 4.00 | 4.00 | 2.00 | 6.00 | 1.10 | 6.60 | 10.65 |
| Aljamain Sterling | 13.90 | 3 | 3.00 | 4.25 | 2.00 | 5.00 | 1.00 | 5.00 | 8.07 |

## What this exposes

This worksheet proves Cody's concern was right: we cannot just pick final Opponent Quality numbers.

The current formula is strict and transparent, but it creates one major issue:

- Dustin Poirier and Charles Oliveira collapse because their résumés contain fewer 1.00/1.25 wins under the current tier table and a lot of support wins capped at 2.00.
- Aljamain Sterling also drops hard because Yan DQ and injured TJ get small credit only.
- Jon Jones rises because his title-defense opponents include many 1.00-level challengers.
- Volkanovski rises because his Max/Aldo/Ortega/Yair/Lopes ledger grades cleanly under the elite-win rule.

So before live changes, Cody needs to choose one of these approaches:

### Option 1 — keep this strict formula

Pros:
- Very clean.
- Strongly rewards true elite/top-5 wins.
- Stops volume from taking over.

Cons:
- Dustin and Charles likely become too low in Quality Wins for how people intuitively view modern lightweight.
- Support-win cap may be too harsh.

### Option 2 — loosen support cap

Change support cap from 2.00 to 3.00 or 4.00.

Pros:
- Better respects Dustin/Charles/Max-style deep schedules.
- Still has diminishing returns.

Cons:
- Volume starts to matter more.

### Option 3 — make modern lightweight adjustment stronger

Keep the support cap but let modern lightweight use a larger final adjustment, like 1.20 instead of 1.10.

Pros:
- Rewards the murderers' row without changing every fighter.

Cons:
- Division adjustment starts doing too much work.

### Option 4 — add a “championship-level non-champion win” tier

Add a 0.75 tier between support and full elite:

| Win type | Credit |
|---|---:|
| Championship-level contender / elite former champ not clean top-5 | 0.75 |

Pros:
- Helps cases like Dustin, Charles, Max, Conor/Pettis/Hooker-style wins without making everything 1.00.
- Still simple.

Cons:
- Adds one more tier.

## My recommended Cody decision point

Do not apply live score changes yet.

First decide whether the support cap stays at 2.00 or whether we add the 0.75 middle tier.

My honest recommendation: add the 0.75 middle tier. It keeps the system simple but prevents Dustin/Charles from getting crushed by a binary elite-vs-support split.

Possible revised table:

| Win type | Credit |
|---|---:|
| Beat sitting UFC champion | 1.25 |
| Beat elite top-5 / title-level contender | 1.00 |
| Beat championship-level former champ / very strong ranked contender | 0.75 |
| Beat strong ranked contender / former champ still good | 0.50 |
| Beat name-value guy past prime / future elite before prime | 0.25 |
| Loss / no contest / draw | 0.00 |

Then rerun Batch 1B again with Cody-approved calls.