# Penalty Data Audit

Version: `penalty-data-audit-20260705a`  
Status: Batch 1 worksheet only. Not live scoring.  
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

## Batch 1 Shape Read

- The biggest immediate correction is Jose Aldo: `-6.75 -> -8.25`.
- B.J. Penn also likely needs a harsher but not fully maxed penalty: `-8.50 -> -9.75`.
- Dan Henderson may be slightly too harsh right now: `-5.50 -> -5.25`.
- Anderson, Volk, Izzy, Max, Dustin, Justin, and Chuck already fit the current locked structure.

## Next Batch Candidates

Audit these next:

- Jon Jones
- Georges St-Pierre
- Demetrious Johnson
- Khabib Nurmagomedov
- Islam Makhachev
- Randy Couture
- Matt Hughes
- Daniel Cormier
- Stipe Miocic
- Cain Velasquez

## Approval Gate

Do not create `assets/data/penalty-score-corrections.js` until Cody approves the active-37 Penalty score shape.

After approval:

1. Create `assets/data/penalty-score-corrections.js`.
2. Load it in `assets/data/ranking-data-patches.js` after Longevity and before `score-derived-ovr.js`.
3. Recalculate totals and ranks after Penalty patches.
4. Expose status in `window.UFC_PHASE2_DATA_STATUS.penaltyScoreCorrections`.
