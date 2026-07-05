# Longevity Data Audit

Version: `longevity-data-audit-20260705b`  
Status: Batch 1 worksheet filled. Not live scoring.  
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
| Max Holloway | Cub Swanson / Charles Oliveira ascent, 2015 | Gaethje elite LW relevance in current table | 10.90 | 10.00 | 3.00 | 2.00 | 15.00 | 12.63 | Max is the cleanest Longevity max candidate: elite relevance before, during, and after the belt. BMF is not championship credit, but Gaethje-level relevance matters for continuity. |
| Jose Aldo | UFC featherweight title run, 2011 | Rob Font / BW contender chapter, 2021 | 9.43 | 9.57 | 3.00 | 2.00 | 14.57 | 12.00 | UFC-only still gives Aldo a huge longevity case because the bantamweight contender run is real late elite continuity. WEC stays context only. |
| Jon Jones | Bader / Rua title breakthrough, 2011 | Stipe heavyweight title relevance in current table | 10.82 | 10.00 | 3.00 | 1.50 | 14.50 | 14.57 | Near-max but not full 15 because the heavyweight chapter is real elite relevance, not a long second chapter. Long inactive gaps should not get free full credit. |
| Georges St-Pierre | Hughes/Penn/Serra title-level rise, 2004-2007 | Bisping middleweight title return, 2017 | 9.15 | 9.36 | 3.00 | 1.50 | 13.86 | 13.09 | Bisping return earns clear continuity, but the retirement gap does not count as active elite time. Strong bump from legacy, not a Max/Aldo-style late chapter. |
| Stipe Miocic | Hunt / Arlovski title climb, 2015-2016 | Jones title relevance in current table | 7.62 | 8.22 | 2.50 | 1.50 | 12.22 | 8.56 | Reclaiming the title after the Cormier loss is exactly the kind of late continuity this category should catch. Heavyweight volatility keeps him below the decade cases. |
| Demetrious Johnson | Cruz/McCall-to-flyweight title level, 2011-2012 | Cejudo rematch, 2018 | 6.84 | 7.63 | 3.00 | 1.50 | 12.13 | 10.05 | ONE is excluded. The bump comes from UFC title relevance spread and the Cruz/BW-to-FLW reset, not from post-UFC greatness. This is lower than a fake decade score but still meaningfully above legacy. |
| Daniel Cormier | UFC debut / LHW title rise, 2013-2015 | Stipe trilogy, 2020 | 7.05 | 7.79 | 2.50 | 1.50 | 11.79 | 7.97 | The legacy score looks too low. DC's UFC window is compact, but two-division title relevance and the heavyweight chapter deserve real continuity credit. |
| Anderson Silva | Franklin title win, 2006 | Weidman title rematch, 2013 | 7.21 | 7.91 | 3.00 | 0.50 | 11.41 | 10.37 | Long title-era spread earns the bump. No major post-title UFC elite win, so late continuity stays low; later losses should not drag this category much. |
| Alexander Volkanovski | Jose Aldo title-eliminator, 2019 | Topuria / Islam LW relevance in current table | 6.70 | 7.53 | 2.50 | 0.50 | 10.53 | 8.95 | Strong modern FW window. Islam losses show elite relevance but are not wins, so they do not become major longevity value. Topuria keeps the back end from feeling clean. |
| Kamaru Usman | Rafael dos Anjos / Woodley title rise, 2018-2019 | Edwards/Khamzat back-end relevance in current table | 6.04 | 7.03 | 2.50 | 0.50 | 10.03 | 8.65 | Strong champion window, but compact. The post-title period shows continued elite matchmaking more than positive late elite proof. |

## Batch 1 Proposed Order

| Longevity rank in Batch 1 | Fighter | Proposed Longevity /15 |
| ---: | --- | ---: |
| 1 | Max Holloway | 15.00 |
| 2 | Jose Aldo | 14.57 |
| 3 | Jon Jones | 14.50 |
| 4 | Georges St-Pierre | 13.86 |
| 5 | Stipe Miocic | 12.22 |
| 6 | Demetrious Johnson | 12.13 |
| 7 | Daniel Cormier | 11.79 |
| 8 | Anderson Silva | 11.41 |
| 9 | Alexander Volkanovski | 10.53 |
| 10 | Kamaru Usman | 10.03 |

## Batch 1 Shape Notes

- Max at 15.00 is intentional. If anyone maxes Longevity, it should be the guy with elite value before the belt, during the belt, and long after losing the belt.
- Aldo jumping to 14.57 is also intentional. UFC-only excludes WEC, but his UFC featherweight title relevance plus bantamweight contender chapter is exactly what this category is for.
- Jones stays near-max, but not perfect, because the heavyweight return is real title relevance without being a long second active chapter.
- GSP gets strong credit for the Bisping return, but not free active years during retirement.
- DJ moves up, but the strict UFC-only window keeps him below the fake 13.5-14.0 range unless we add a title-reign-duration bonus. I do not recommend that because Championship already captures title-defense volume.
- Stipe and DC rise the most versus legacy because the old values undercounted heavyweight/title continuity and two-division title relevance.
- Volk and Usman rise modestly. They have strong elite windows, but not Max/Aldo/Jones/GSP-level longevity.

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

## Current Opinionated Targets

These are not final live scores. They are shape checks.

- Khabib should not score high in Longevity. His greatness is carried by Championship, Opponent Quality, and Prime Dominance, not a long UFC elite timeline.
- Jon Jones, GSP, Aldo, and Max should define the top Longevity band.
- DJ should be strong, but not artificially forced into the very top if we are strict about UFC-only active years and avoid double-counting title-defense dominance.
- Max and Aldo should be protected because late elite relevance is exactly what this category is supposed to recognize.
- Cormier and Stipe should rise from the current legacy values if the audit properly credits UFC-only cross-division/title continuity.
- Current short-sample monsters like Ilia, Pereira, and Islam should be capped unless the app timeline intentionally extends their elite windows.

## Approval Gate

Do not create `assets/data/longevity-score-corrections.js` until Cody approves the Batch 1 score shape.

After approval:

1. Create `assets/data/longevity-score-corrections.js`.
2. Load it in `assets/data/ranking-data-patches.js` after Prime Dominance and before `score-derived-ovr.js`.
3. Recalculate totals and ranks after Longevity patches.
4. Expose status in `window.UFC_PHASE2_DATA_STATUS.longevityScoreCorrections`.
