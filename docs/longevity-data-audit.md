# Longevity Data Audit

Version: `longevity-data-audit-20260705e`  
Status: Batch 1 evidence-first formula worksheet. Not live scoring.  
Live app impact: None.

## Goal

Longevity answers one question:

> How long did this fighter keep proving elite UFC relevance?

This category should not become Prime Dominance again.

Prime Dominance already scores how dominant a fighter was while elite. Longevity should score the length and repeatability of elite UFC relevance over time.

## Working Formula

`Longevity / 15 = Active Elite Years / 10 + Elite Relevance Spread / 3 + Late Elite Continuity / 2`

## How to Read the Worksheet

Each fighter should be scored in this order:

1. List the actual UFC elite proof years/events.
2. Pull `activeEliteYears` from the current repo packet/source row.
3. Convert active elite years into the `/10` score using the curve.
4. Score elite relevance spread `/3` from the proof years/events.
5. Score late elite continuity `/2` from actual post-checkpoint elite proof.
6. Add the three sub-scores.

Do not start with a desired final score.

## Formula Rules

### 1. Active Elite Years / 10

Measures gap-capped time as a UFC title/top-five/title-level contender.

Use the current `activeEliteYears` field as the first source input when it exists, then apply the active-years scoring curve.

Default gap rule:

- Count active elite UFC time only.
- Cap inactive gaps between elite UFC proof points at 18 months unless Cody changes the rule.
- Long layoffs do not get free full-year credit.
- Still fighting does not count unless the fighter is still proving title/top-five/elite contender relevance.

Active-years scoring curve:

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

Long inactive gaps cannot create max spread by themselves. A late title fight after a major layoff can show relevance, but it should not automatically turn a shorter active elite window into an 8+ year max spread.

Scoring curve:

| Spread profile | Score |
| --- | ---: |
| Elite/title-level proof across 8+ UFC seasons with gap discipline | 3.00 |
| Across 6-7 UFC seasons | 2.50 |
| Across 4-5 UFC seasons | 2.00 |
| Across 3 UFC seasons | 1.50 |
| Across 2 UFC seasons | 1.00 |
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

Scoring curve:

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

## Source Fields Used

Primary source files:

- `assets/data/ranking-data.js`
- `assets/data/fighter-packets.js`
- `assets/data/fighter-packets/*.js`

Fields used for Batch 1:

- `ufcRecord`
- `titleFightWins`
- `adjustedTitleWins` where present
- `eliteWins`
- `activeEliteYears`
- `legacyStats.activeEliteYearsLabel`
- packet notes explaining division changes, late relevance, scope limits, and loss context
- current legacy `longevity` value, for comparison only

Important: the current `activeEliteYears` field is treated as the source input for the active-years component. The proof years/events explain the spread and late-continuity components.

## Batch 1 Source Data Snapshot

| Fighter | Source path | UFC record | Title-fight wins / adjusted title wins | Elite wins | Source activeEliteYears | Source late/scope notes used |
| --- | --- | --- | --- | ---: | ---: | --- |
| Jon Jones | `assets/data/fighter-packets.js` | 22-1, 1 NC | 16 / 15.8 adjusted | TBD in central packet | 10.82 | LHW/HW, no true competitive UFC loss; HW title relevance is real but not a long second chapter. |
| Georges St-Pierre | `assets/data/fighter-packets.js` | 20-2 | 13 | 14 | 9.15 | Long WW title window; Bisping MW title return adds continuity, but retirement gap is not active elite time. |
| Demetrious Johnson | `assets/data/fighter-packets/demetrious-johnson.js` | 15-2-1 | 12 | 8 | 6.84 | UFC flyweight reign only; ONE is historical context and not scored. |
| Anderson Silva | `assets/data/fighter-packets/anderson-silva.js` | 17-7, 1 NC | 11 | 7 | 7.21 | Long MW title-era spread; Weidman losses matter elsewhere; later losses are mostly post-prime context. |
| Jose Aldo | `assets/data/fighter-packets/jose-aldo.js` | 14-9 | 5 / 8 adjusted | 8 | 9.43 | WEC excluded; UFC FW title relevance plus late BW contender chapter count. |
| Max Holloway | `assets/data/fighter-packets/max-holloway.js` | 23-9 | 4 | 9 | 10.90 | Elite relevance before, during, and after title reign; Gaethje-level LW relevance supports late continuity. |
| Kamaru Usman | `assets/data/fighter-packets/kamaru-usman.js` | 16-3 | 6 | 8 | 6.04 | Focused modern WW title window; post-title period is mostly elite matchmaking, not positive late proof. |
| Stipe Miocic | `assets/data/fighter-packets/stipe-miocic.js` | 15-5 | 6 | 9 | 7.62 | UFC HW standard; Cormier trilogy/title reclaim supports late continuity. |
| Daniel Cormier | `assets/data/fighter-packets/daniel-cormier.js` | 15-3, 1 NC | 6 | 9 | 7.05 | Compact UFC window; LHW/HW title relevance counts, Strikeforce does not. |
| Alexander Volkanovski | `assets/data/fighter-packets/alexander-volkanovski.js` | 15-3 | 6 | 9 | 6.70 | Modern FW title run; Islam LW losses show relevance but are not wins and should not become major Longevity value. |

## Batch 1 Evidence Worksheet

| Fighter | UFC elite proof years/events used | ActiveEliteYears -> score /10 | Spread score /3 | Late continuity score /2 | Formula output | Notes |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| Max Holloway | 2015 Cub Swanson/Charles Oliveira ascent; 2016 Lamas/Pettis interim title; 2017 Aldo title wins; 2018 Ortega title defense; 2019 Poirier LW interim title fight/Edgar; 2020 Volkanovski title rematch; 2021 Kattar/Yair; 2022 Volkanovski trilogy; 2023 Allen/Korean Zombie; 2024 Gaethje/Topuria relevance | 10.90 -> 10.00 | 3.00 | 2.00 | 10.00 + 3.00 + 2.00 = 15.00 | Max gets max Longevity because the evidence shows pre-title, title-era, and long post-title elite relevance. |
| Jose Aldo | 2011 Hominick/Florian UFC title run; 2012 Mendes; 2013 Edgar/Korean Zombie; 2014 Lamas/Mendes; 2015 McGregor title fight; 2016 Edgar interim title; 2018 Stephens; 2019 Moicano; 2020 Yan title fight/Vera; 2021 Munhoz/Font; 2022 Merab contender relevance | 9.43 -> 9.57 | 3.00 | 2.00 | 9.57 + 3.00 + 2.00 = 14.57 | WEC is excluded, but the UFC evidence still shows long FW title relevance plus a real BW contender chapter. |
| Jon Jones | 2011 Bader/Rua title breakthrough; 2012 Evans/Belfort; 2013 Sonnen/Gustafsson; 2014 Glover; 2015 Cormier; 2018 Gustafsson II; 2019 Smith/Santos; 2020 Reyes; 2023 Gane HW title; 2024 Stipe title relevance in current table | 10.82 -> 10.00 | 3.00 | 1.50 | 10.00 + 3.00 + 1.50 = 14.50 | Active years and spread max out. HW chapter is meaningful, but too short for full late-continuity credit. |
| Georges St-Pierre | 2004 Hughes title fight; 2006 Penn/Hughes title win; 2007 Serra/Hughes; 2008 Serra/Fitch; 2009 Penn/Alves; 2010 Hardy/Koscheck; 2011 Shields; 2012 Condit; 2013 Diaz/Hendricks; 2017 Bisping MW title return | 9.15 -> 9.36 | 3.00 | 1.50 | 9.36 + 3.00 + 1.50 = 13.86 | Long WW proof plus MW return. Retirement gap is not counted as active elite time. |
| Stipe Miocic | 2015 Hunt/Arlovski title climb; 2016 Werdum/Overeem title wins; 2017 dos Santos title defense; 2018 Ngannou/Cormier; 2019 Cormier rematch; 2020 Cormier trilogy win; 2021 Ngannou title fight; 2024 Jones title relevance in current table | 7.62 -> 8.22 | 2.50 | 1.50 | 8.22 + 2.50 + 1.50 = 12.22 | The Cormier title reclaim is real late continuity. Long layoff before Jones does not create max spread by itself. |
| Demetrious Johnson | 2011 Cruz BW title fight; 2012 McCall/Benavidez flyweight title; 2013 Dodson/Moraga/Benavidez; 2014 Bagautinov/Cariaso; 2015 Horiguchi/Dodson; 2016 Cejudo/Elliott; 2017 Reis/Borg; 2018 Cejudo rematch | 6.84 -> 7.63 | 3.00 | 1.50 | 7.63 + 3.00 + 1.50 = 12.13 | UFC title-era spread maxes out. ONE does not extend the score. BW-to-FLW reset supports continuity. |
| Daniel Cormier | 2013 Mir/Nelson UFC arrival; 2014 Hendo/Jones title relevance; 2015 Rumble/Gustafsson title wins; 2016 Anderson Silva short-notice elite context; 2017 Rumble/Jones NC title relevance; 2018 Oezdemir/Stipe/Lewis; 2019 Stipe rematch; 2020 Stipe trilogy | 7.05 -> 7.79 | 2.50 | 1.50 | 7.79 + 2.50 + 1.50 = 11.79 | Compact but dense UFC window. HW title chapter matters, but Strikeforce is not scored. |
| Anderson Silva | 2006 Leben/Franklin title win; 2007 Lutter/Marquardt/Franklin; 2008 Henderson/Irvin/Cote; 2009 Leites/Griffin; 2010 Maia/Sonnen; 2011 Belfort/Okami; 2012 Sonnen/Bonnar; 2013 Weidman title fights | 7.21 -> 7.91 | 3.00 | 0.50 | 7.91 + 3.00 + 0.50 = 11.41 | Title-era spread maxes out. Late post-title UFC proof is limited, so late continuity stays low. |
| Alexander Volkanovski | 2019 Aldo/Max title win; 2020 Max rematch; 2021 Ortega defense; 2022 Korean Zombie/Max trilogy; 2023 Islam LW title fight/Yair defense/Islam rematch; 2024 Topuria title relevance | 6.70 -> 7.53 | 2.50 | 0.50 | 7.53 + 2.50 + 0.50 = 10.53 | Strong FW title window. Islam losses show elite relevance but are not wins, so late continuity is limited. |
| Kamaru Usman | 2018 Maia/RDA title climb; 2019 Woodley title win/Covington defense; 2020 Masvidal defense; 2021 Burns/Masvidal/Covington; 2022 Edwards title fights; 2023 Edwards/Khamzat back-end relevance | 6.04 -> 7.03 | 2.50 | 0.50 | 7.03 + 2.50 + 0.50 = 10.03 | Strong compact title window. Post-title period is elite matchmaking, but not enough positive proof for a bigger continuity score. |

## Batch 1 Formula Output Order

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

## Why These Scores Now Make Sense

- The visible formula is doing the work: `active-years score + spread score + late-continuity score`.
- The proof years/events explain why the spread score is 3.00, 2.50, etc.
- The late-continuity score is no longer hidden. It is tied to a concrete checkpoint: post-title run, division move, title reclaim, or return from layoff.
- Max and Aldo are protected because this category is specifically built to reward long elite relevance across phases.
- DJ is strong but not artificially stretched by ONE or by double-counting title-defense volume.
- Stipe and DC rise because the old legacy values undercounted their UFC title-level continuity.

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

## Current Formula Interpretation Notes

These are qualitative rules for applying the formula, not expected values.

- Khabib should not score high in Longevity. His greatness is carried by Championship, Opponent Quality, and Prime Dominance, not a long UFC elite timeline.
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
