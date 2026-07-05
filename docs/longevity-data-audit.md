# Longevity Data Audit

Version: `longevity-data-audit-20260705a`  
Status: Worksheet only. Not live scoring.  
Live app impact: None.

## Goal

Longevity answers one question:

> How long did this fighter keep proving elite UFC relevance?

This category should not become Prime Dominance again.

Prime Dominance already scores how dominant a fighter was while elite. Longevity should score the length and repeatability of elite UFC relevance over time.

## Working Formula

`Longevity / 15 = Active Elite Years / 10 + Elite Relevance Spread / 3 + Late Elite Continuity / 2`

### 1. Active Elite Years / 10

Measures gap-capped time as a UFC title/top-five/title-level contender.

Use the current `activeEliteYears` field as a starting input when it exists, but re-audit it before locking final corrections.

Default gap rule:

- Count active elite UFC time only.
- Cap inactive gaps between elite UFC proof points at 18 months unless Cody changes the rule.
- Long layoffs do not get free full-year credit.
- Still fighting does not count unless the fighter is still proving title/top-five/elite contender relevance.

Suggested scoring curve:

| Gap-capped active elite years | Score |
| ---: | ---: |
| 10.0+ | 10.00 |
| 9.0 | 9.25 |
| 8.0 | 8.50 |
| 7.0 | 7.75 |
| 6.0 | 7.00 |
| 5.0 | 6.00 |
| 4.0 | 5.00 |
| 3.0 | 3.75 |
| 2.0 | 2.50 |
| 1.0 | 1.25 |
| 0.0 | 0.00 |

Use interpolation between anchors when needed.

### 2. Elite Relevance Spread / 3

Measures whether elite relevance was repeatedly proven across multiple UFC seasons/eras.

This is not Opponent Quality. Do not give extra points because the wins were better. Give points because the fighter had elite proof points spread across time.

Eligible proof points include:

- UFC title fights
- UFC title wins or defenses
- UFC interim title wins when contextually title-level
- Wins over UFC top-five opponents
- Clear title eliminator or title-level contender wins
- Meaningful second-division elite relevance

Suggested scoring curve:

| Spread profile | Score |
| --- | ---: |
| Elite/title-level proof across 8+ UFC calendar years | 3.00 |
| Across 6-7 UFC calendar years | 2.50 |
| Across 4-5 UFC calendar years | 2.00 |
| Across 3 UFC calendar years | 1.50 |
| Across 2 UFC calendar years | 1.00 |
| One-year burst | 0.50 |
| No real elite spread | 0.00 |

### 3. Late Elite Continuity / 2

Rewards fighters who still proved elite relevance after a major career checkpoint.

Eligible checkpoints:

- Losing the belt
- Changing divisions
- Returning from a major layoff
- Absorbing the first major prime setback
- Aging out of original peak but still beating elite UFC opponents

Suggested scoring curve:

| Late elite continuity profile | Score |
| --- | ---: |
| Strong late elite chapter with real top-five/title relevance | 2.00 |
| Clear late elite proof, but not a full second chapter | 1.50 |
| Some meaningful post-title/post-setback elite relevance | 1.00 |
| Minor relevance only | 0.50 |
| No meaningful late continuity | 0.00 |

## Hard Guardrails

- UFC-only.
- WEC, Pride, Strikeforce, ONE, Bellator, and regional achievements do not score.
- Non-UFC accomplishments may be mentioned only as context.
- Do not reward finish rate here.
- Do not reward rounds-won percentage here.
- Do not reward title-defense dominance here.
- Do not reward clean loss safety here.
- Post-prime losses do not add value and should not heavily drag Longevity down.
- Late-career wins count only if they prove title/top-five/elite contender relevance.
- Current table/app timeline can be used as the source of truth if it intentionally extends beyond real-world current records.

## Source Fields to Check

Primary source files:

- `assets/data/ranking-data.js`
- `assets/data/fighter-packets/*.js`
- `assets/data/ranking-data-additions.js`
- Existing live score modules for comparison only:
  - `assets/data/championship-score-corrections.js`
  - `assets/data/opponent-quality-score-corrections.js`
  - `assets/data/prime-dominance-score-corrections.js`

Useful fields:

- `fighter`
- `ufcRecord`
- `activeEliteYears`
- `primeStart`
- `primeEnd`
- `title.adjustedTitleWins`
- title fight wins / title-level notes
- top-five / elite opponent entries
- audited snapshot fields in fighter packets
- current legacy `longevity` value, for comparison only

Important: audited snapshot fields are valid scoring inputs. Do not treat `rounds: []` as missing audit work if a fighter has audited snapshot fields.

## Audit Row Template

| Fighter | Elite start | Elite end / current endpoint | Gap-capped active elite years | Active years score /10 | Elite relevance spread /3 | Late elite continuity /2 | Proposed Longevity /15 | Current legacy longevity | Notes / judgment calls |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD |

## Batch 1: Longevity Anchors

These fighters define the scoring shape before any live correction file exists.

| Fighter | Why included | Expected range before audit | Main judgment call |
| --- | --- | ---: | --- |
| Jon Jones | Longest UFC-only benchmark with LHW plus HW relevance | 13.5-15.0 | How much to cap long layoff before heavyweight return while still rewarding real HW title relevance |
| Georges St-Pierre | Complete title-era longevity case plus MW return | 13.0-14.5 | Bisping return should count, but probably not as a full second long chapter |
| Demetrious Johnson | Historic UFC title run; ONE excluded | 12.5-14.0 | UFC flyweight relevance only; no ONE extension |
| Anderson Silva | Long reign with later decline | 11.5-13.5 | Keep title-era longevity high without rewarding post-prime losses |
| Jose Aldo | UFC-only title relevance plus BW contender chapter | 12.0-14.0 | WEC excluded, but UFC BW late relevance should matter |
| Max Holloway | Massive post-title elite contender relevance | 12.0-14.0 | Reward late elite continuity without letting losses become value |
| Kamaru Usman | Strong title run, shorter overall elite window | 10.0-12.0 | Leon/Khamzat period should not add much unless current-table relevance supports it |
| Stipe Miocic | Reclaimed HW title and stayed title-relevant | 10.5-12.5 | Heavyweight gaps and trilogy timing need gap-cap discipline |
| Daniel Cormier | LHW/HW elite relevance across divisions | 9.5-11.5 | Reward HW title chapter but do not score Strikeforce or pre-UFC run |
| Alexander Volkanovski | Modern FW title run plus LW attempts/current-table context | 9.5-11.5 | Islam losses can show relevance but should not become full longevity value by themselves |

## Batch 1 Worksheet

| Fighter | Elite start | Elite end / current endpoint | Gap-capped active elite years | Active years score /10 | Elite relevance spread /3 | Late elite continuity /2 | Proposed Longevity /15 | Current legacy longevity | Notes / judgment calls |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| Jon Jones | TBD | TBD | TBD | TBD | TBD | TBD | TBD | 14.57 | Source table currently has a very high legacy score. Audit layoff cap before confirming near-max value. |
| Georges St-Pierre | TBD | TBD | TBD | TBD | TBD | TBD | TBD | 13.09 | MW return should add continuity value, but the long retirement gap should not be counted as active elite time. |
| Demetrious Johnson | TBD | TBD | TBD | TBD | TBD | TBD | TBD | 10.05 | Likely needs review upward if UFC title-run spread is undercounted, while keeping ONE excluded. |
| Anderson Silva | TBD | TBD | TBD | TBD | TBD | TBD | TBD | 10.37 | Likely needs review upward for title-era spread, not for late losses. |
| Jose Aldo | TBD | TBD | TBD | TBD | TBD | TBD | TBD | 12.00 | UFC-only excludes WEC, but BW late contender chapter should protect a strong score. |
| Max Holloway | TBD | TBD | TBD | TBD | TBD | TBD | TBD | 12.63 | Post-title elite continuity is one of the cleanest high-value examples. |
| Kamaru Usman | TBD | TBD | TBD | TBD | TBD | TBD | TBD | 8.65 | May be slightly low depending how title run and elite spread are counted. |
| Stipe Miocic | TBD | TBD | TBD | TBD | TBD | TBD | TBD | 8.56 | May be low if reclaiming the HW title and trilogy relevance are fully credited. |
| Daniel Cormier | TBD | TBD | TBD | TBD | TBD | TBD | TBD | 7.97 | Probably low if UFC LHW/HW title relevance is treated properly. |
| Alexander Volkanovski | TBD | TBD | TBD | TBD | TBD | TBD | TBD | 8.95 | Needs current-table treatment decision for continued FW/LW relevance. |

## Batch 2 Candidates

After Batch 1 shape review, audit these next:

- Khabib Nurmagomedov
- Islam Makhachev
- Amanda Nunes
- Valentina Shevchenko
- Charles Oliveira
- Dustin Poirier
- Frankie Edgar
- Randy Couture
- B.J. Penn
- Dominick Cruz

## Pre-Audit Opinionated Targets

These are not final scores. They are shape checks.

- Khabib should not score high in Longevity. His greatness is carried by Championship, Opponent Quality, and Prime Dominance, not a long UFC elite timeline.
- Jon Jones, GSP, DJ, Aldo, Max, and Anderson should define the top Longevity band.
- Max and Aldo should be protected because late elite relevance is exactly what this category is supposed to recognize.
- Cormier and Stipe should probably rise from the current legacy values if the audit properly credits UFC-only cross-division/title continuity.
- Current short-sample monsters like Ilia, Pereira, and Islam should be capped unless the app timeline intentionally extends their elite windows.

## Approval Gate

Do not create `assets/data/longevity-score-corrections.js` until Cody approves the Batch 1 score shape.

After approval:

1. Create `assets/data/longevity-score-corrections.js`.
2. Load it in `assets/data/ranking-data-patches.js` after Prime Dominance and before `score-derived-ovr.js`.
3. Recalculate totals and ranks after Longevity patches.
4. Expose status in `window.UFC_PHASE2_DATA_STATUS.longevityScoreCorrections`.
