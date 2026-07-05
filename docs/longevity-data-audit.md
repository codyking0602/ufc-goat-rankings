# Longevity Data Audit

Version: `longevity-data-audit-20260705h`  
Status: Batch 1, Batch 2, and Batch 3 evidence-first formula worksheets. Not live scoring.  
Live app impact: None.

## Goal

Longevity answers one question:

> How long did this fighter keep proving elite UFC relevance?

This category should not become Prime Dominance again.

Prime Dominance already scores how dominant a fighter was while elite. Longevity should score the length and repeatability of elite UFC relevance over time.

## Working Formula

`Longevity / 15 = Active Elite Years / 10 + Elite Relevance Spread / 3 + Late Elite Continuity / 2`

## What Spread Means

`Elite Relevance Spread / 3` means: how widely the fighter's elite proof is spread across UFC seasons.

It is not asking whether the wins were better. That is Opponent Quality.

It is asking whether the fighter kept showing title/top-five/title-level relevance across time.

Simple examples:

- A fighter with elite proof from 2015, 2016, 2017, 2018, 2021, 2023, and 2024 has strong spread.
- A fighter with an amazing 2-3 year title peak has weaker spread, even if the peak was dominant.
- A late title fight after a huge layoff can show relevance, but it should not automatically create max spread.

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

## Cody Late-Fight Rulings

These are locked judgment calls from Cody:

| Fighter / late fight | Count for Longevity? | Treatment |
| --- | --- | --- |
| Georges St-Pierre vs Michael Bisping | Yes | Counts as a real late elite/title proof point and supports partial late-continuity credit. |
| Jon Jones heavyweight title chapter | Yes | Counts as real heavyweight title relevance, but not enough for a full second long chapter. |
| Stipe Miocic vs Jon Jones | No | Does not count as Stipe longevity proof because the layoff/back-end title shot should not add value. |

Going forward, borderline late fights should be checked with Cody before scoring.

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
- `assets/data/ranking-data-additions.js`
- `assets/data/fighter-packets.js`
- `assets/data/fighter-packets/*.js`

Fields used:

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
| Jon Jones | `assets/data/fighter-packets.js` | 22-1, 1 NC | 16 / 15.8 adjusted | TBD in central packet | 10.82 | LHW/HW, no true competitive UFC loss; HW title relevance counts per Cody, but it is not a long second chapter. |
| Georges St-Pierre | `assets/data/fighter-packets.js` | 20-2 | 13 | 14 | 9.15 | Long WW title window; Bisping MW title return counts per Cody, but retirement gap is not active elite time. |
| Demetrious Johnson | `assets/data/fighter-packets/demetrious-johnson.js` | 15-2-1 | 12 | 8 | 6.84 | UFC flyweight reign only; ONE is historical context and not scored. |
| Anderson Silva | `assets/data/fighter-packets/anderson-silva.js` | 17-7, 1 NC | 11 | 7 | 7.21 | Long MW title-era spread; Weidman losses matter elsewhere; later losses are mostly post-prime context. |
| Jose Aldo | `assets/data/fighter-packets/jose-aldo.js` | 14-9 | 5 / 8 adjusted | 8 | 9.43 | WEC excluded; UFC FW title relevance plus late BW contender chapter count. |
| Max Holloway | `assets/data/fighter-packets/max-holloway.js` | 23-9 | 4 | 9 | 10.90 | Elite relevance before, during, and after title reign; Gaethje-level LW relevance supports late continuity. |
| Kamaru Usman | `assets/data/fighter-packets/kamaru-usman.js` | 16-3 | 6 | 8 | 6.04 | Focused modern WW title window; post-title period is mostly elite matchmaking, not positive late proof. |
| Stipe Miocic | `assets/data/fighter-packets/stipe-miocic.js` | 15-5 | 6 | 9 | 7.62 | UFC HW standard; Cormier trilogy/title reclaim supports late continuity. Jones late fight is excluded per Cody. |
| Daniel Cormier | `assets/data/fighter-packets/daniel-cormier.js` | 15-3, 1 NC | 6 | 9 | 7.05 | Compact UFC window; LHW/HW title relevance counts, Strikeforce does not. |
| Alexander Volkanovski | `assets/data/fighter-packets/alexander-volkanovski.js` | 15-3 | 6 | 9 | 6.70 | Modern FW title run; Islam LW losses show relevance but are not wins and should not become major Longevity value. |

## Batch 1 Evidence Worksheet

| Fighter | UFC elite proof years/events used | ActiveEliteYears -> score /10 | Spread score /3 | Late continuity score /2 | Formula output | Notes |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| Max Holloway | 2015 Cub Swanson/Charles Oliveira ascent; 2016 Lamas/Pettis interim title; 2017 Aldo title wins; 2018 Ortega title defense; 2019 Poirier LW interim title fight/Edgar; 2020 Volkanovski title rematch; 2021 Kattar/Yair; 2022 Volkanovski trilogy; 2023 Allen/Korean Zombie; 2024 Gaethje/Topuria relevance | 10.90 -> 10.00 | 3.00 | 2.00 | 10.00 + 3.00 + 2.00 = 15.00 | Max gets max Longevity because the evidence shows pre-title, title-era, and long post-title elite relevance. |
| Jose Aldo | 2011 Hominick/Florian UFC title run; 2012 Mendes; 2013 Edgar/Korean Zombie; 2014 Lamas/Mendes; 2015 McGregor title fight; 2016 Edgar interim title; 2018 Stephens; 2019 Moicano; 2020 Yan title fight/Vera; 2021 Munhoz/Font; 2022 Merab contender relevance | 9.43 -> 9.57 | 3.00 | 2.00 | 9.57 + 3.00 + 2.00 = 14.57 | WEC is excluded, but the UFC evidence still shows long FW title relevance plus a real BW contender chapter. |
| Jon Jones | 2011 Bader/Rua title breakthrough; 2012 Evans/Belfort; 2013 Sonnen/Gustafsson; 2014 Glover; 2015 Cormier; 2018 Gustafsson II; 2019 Smith/Santos; 2020 Reyes; 2023 Gane HW title; 2024 Stipe HW title relevance in current table | 10.82 -> 10.00 | 3.00 | 1.50 | 10.00 + 3.00 + 1.50 = 14.50 | Active years and spread max out. HW title relevance counts per Cody, but it is too short for full late-continuity credit. |
| Georges St-Pierre | 2004 Hughes title fight; 2006 Penn/Hughes title win; 2007 Serra/Hughes; 2008 Serra/Fitch; 2009 Penn/Alves; 2010 Hardy/Koscheck; 2011 Shields; 2012 Condit; 2013 Diaz/Hendricks; 2017 Bisping MW title return | 9.15 -> 9.36 | 3.00 | 1.50 | 9.36 + 3.00 + 1.50 = 13.86 | Long WW proof plus MW return. Bisping counts per Cody; retirement gap is not counted as active elite time. |
| Stipe Miocic | 2015 Hunt/Arlovski title climb; 2016 Werdum/Overeem title wins; 2017 dos Santos title defense; 2018 Ngannou/Cormier; 2019 Cormier rematch; 2020 Cormier trilogy win; 2021 Ngannou title fight | 7.62 -> 8.22 | 2.50 | 1.50 | 8.22 + 2.50 + 1.50 = 12.22 | Cormier title reclaim is real late continuity. Jones late fight is excluded per Cody, so it does not add spread or late-continuity value. |
| Demetrious Johnson | 2011 Cruz BW title fight; 2012 McCall/Benavidez flyweight title; 2013 Dodson/Moraga/Benavidez; 2014 Bagautinov/Cariaso; 2015 Horiguchi/Dodson; 2016 Cejudo/Elliott; 2017 Reis/Borg; 2018 Cejudo rematch | 6.84 -> 7.63 | 3.00 | 1.50 | 7.63 + 3.00 + 1.50 = 12.13 | UFC title-era spread maxes out. ONE does not extend the score. BW-to-FLW reset supports continuity. |
| Daniel Cormier | 2013 Mir/Nelson UFC arrival; 2014 Hendo/Jones title relevance; 2015 Rumble/Gustafsson title wins; 2016 Anderson Silva short-notice elite context; 2017 Rumble/Jones NC title relevance; 2018 Oezdemir/Stipe/Lewis; 2019 Stipe rematch; 2020 Stipe trilogy | 7.05 -> 7.79 | 2.50 | 1.50 | 7.79 + 2.50 + 1.50 = 11.79 | Compact but dense UFC window. HW title chapter matters, but Strikeforce is not scored. |
| Anderson Silva | 2006 Leben/Franklin title win; 2007 Lutter/Marquardt/Franklin; 2008 Henderson/Irvin/Cote; 2009 Leites/Griffin; 2010 Maia/Sonnen; 2011 Belfort/Okami; 2012 Sonnen/Bonnar; 2013 Weidman title fights | 7.21 -> 7.91 | 3.00 | 0.50 | 7.91 + 3.00 + 0.50 = 11.41 | Title-era spread maxes out. Late post-title UFC proof is limited, so late continuity stays low. |
| Alexander Volkanovski | 2019 Aldo/Max title win; 2020 Max rematch; 2021 Ortega defense; 2022 Korean Zombie/Max trilogy; 2023 Islam LW title fight/Yair defense/Islam rematch; 2024 Topuria title relevance | 6.70 -> 7.53 | 2.50 | 0.50 | 7.53 + 2.50 + 0.50 = 10.53 | Strong FW title window. Islam losses show elite relevance but are not wins, so late continuity is limited. |
| Kamaru Usman | 2018 Maia/RDA title climb; 2019 Woodley title win/Covington defense; 2020 Masvidal defense; 2021 Burns/Masvidal/Covington; 2022 Edwards title fights; 2023 Edwards/Khamzat back-end relevance | 6.04 -> 7.03 | 2.50 | 0.50 | 7.03 + 2.50 + 0.50 = 10.03 | Strong compact title window. Post-title period is elite matchmaking, but not enough positive proof for a bigger continuity score. |

## Batch 2 Source Data Snapshot

| Fighter | Source path | UFC record | Title-fight wins | Elite wins | Source activeEliteYears | Source late/scope notes used |
| --- | --- | --- | ---: | ---: | ---: | --- |
| Frankie Edgar | `assets/data/fighter-packets/frankie-edgar.js` | 18-11-1 | 3 | 9 | 10.00 | Lightweight title prime plus featherweight second act; late bantamweight losses mostly post-prime context. |
| Randy Couture | `assets/data/fighter-packets/randy-couture.js` | 16-8 | 8 | 8 | 8.54 | Multiple veteran surges across heavyweight and light heavyweight; messy record but repeated title-level risk. |
| Dustin Poirier | `assets/data/fighter-packets/dustin-poirier.js` | 22-9 (1 NC) | 1 | 11 | 8.50 | Long modern lightweight elite relevance; interim title, major wins, and late title-shot ceiling. |
| Valentina Shevchenko | `assets/data/fighter-packets/valentina-shevchenko.js` | 14-4-1 | 9 | 10 | 8.00 | Long flyweight title reign plus bantamweight context and title-regain value. |
| Amanda Nunes | `assets/data/fighter-packets/amanda-nunes.js` | 16-3 | 11 | 11 | 7.00 | Two-division women’s GOAT standard; Pena revenge protects late continuity. |
| B.J. Penn | `assets/data/fighter-packets/bj-penn.js` | 12-13-2 | 5 | 7 | 6.00 | Two-division UFC champion; late-career collapse should not inflate longevity. |
| Khabib Nurmagomedov | `assets/data/fighter-packets/khabib-nurmagomedov.js` | 13-0 | 4 | 5 | 6.02 | Unbeaten lightweight prime; elite window is compact and has no late second chapter. |
| Dominick Cruz | `assets/data/fighter-packets/dominick-cruz.js` | 7-4 | 3 | 4 | 5.00 | WEC reign excluded; UFC case is brilliant but injury-fragmented. Dillashaw comeback matters. |
| Islam Makhachev | `assets/data/fighter-packets/islam-makhachev.js` | 17-1 | 6 | 7 | 4.70 | Modern lightweight title run with later second-division value in current table; still building. |
| Charles Oliveira | `assets/data/fighter-packets/charles-oliveira.js` | 22-10, 1 NC | 3 | 8 | 4.00 | Late-blooming lightweight title peak; long UFC career, shorter true elite-title window. |

## Batch 2 Evidence Worksheet

| Fighter | UFC elite proof years/events used | ActiveEliteYears -> score /10 | Spread score /3 | Late continuity score /2 | Formula output | Notes |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| Frankie Edgar | 2010 Penn title win/defense; 2011 Maynard trilogy; 2012 Henderson title fights; 2013 Aldo title fight/Oliveira; 2014 Penn/Cub; 2015 Faber/Mendes; 2016 Aldo interim title fight; 2017 Yair; 2018 Ortega title eliminator; 2019 Holloway title fight | 10.00 -> 10.00 | 3.00 | 2.00 | 10.00 + 3.00 + 2.00 = 15.00 | Frankie is a pure Longevity monster: LW champ, FW contender chapter, and years of elite proof. Late BW losses should not inflate or erase the scored elite window. |
| Randy Couture | 1997 early UFC title relevance; 2000 Randleman/Rizzo title run; 2001 Rizzo rematch; 2003 Liddell/Ortiz LHW title run; 2004 Belfort/Liddell title relevance; 2007 Sylvia/Gonzaga HW comeback; 2008 Lesnar title fight; 2010 Coleman late relevance context | 8.54 -> 8.91 | 3.00 | 2.00 | 8.91 + 3.00 + 2.00 = 13.91 | Randy gets huge Longevity credit because the proof is spread across eras and divisions. The record is messy, but that belongs more in penalty/prime than Longevity. |
| Dustin Poirier | 2017 Pettis title-level LW climb; 2018 Gaethje/Alvarez; 2019 Holloway interim title/Khabib title fight; 2020 Hooker; 2021 McGregor wins/Charles title fight; 2022 Chandler; 2023 Gaethje BMF rematch; 2024 Saint Denis/Islam title fight; 2025 Holloway late elite context in current table | 8.50 -> 8.88 | 3.00 | 2.00 | 8.88 + 3.00 + 2.00 = 13.88 | Poirier has one of the best non-undisputed Longevity cases: long top lightweight relevance, elite wins, and repeated title-shot level proof. Missing undisputed gold is Championship, not Longevity. |
| Valentina Shevchenko | 2015 Kaufman UFC arrival; 2016 Holm/Nunes title-level BW context; 2018 Joanna flyweight title win; 2019 Eye/Carmouche; 2020 Chookagian/Maia; 2021 Andrade/Murphy; 2022 Santos; 2023 Grasso title rivalry; 2024 Grasso title-regain context in current table | 8.00 -> 8.50 | 3.00 | 2.00 | 8.50 + 3.00 + 2.00 = 13.50 | Valentina scores high because she has long title relevance, cross-division context, and late title-regain proof after the Grasso setback. |
| Amanda Nunes | 2013 de Randamie/Davis rise; 2015 McMann; 2016 Tate/Rousey title takeover; 2017 Shevchenko title defense; 2018 Pennington/Cyborg two-division proof; 2019 Holm/de Randamie; 2020 Spencer; 2021 Anderson/Pena; 2022 Pena revenge; 2023 Aldana | 7.00 -> 7.75 | 3.00 | 2.00 | 7.75 + 3.00 + 2.00 = 12.75 | Nunes gets max spread and continuity because the Pena revenge and two-division value keep the late chapter strong. Active years keep her below the longest longevity-only cases. |
| B.J. Penn | 2001 Uno title tournament context; 2002 Pulver title fight; 2004 Hughes WW title upset; 2006 GSP/Hughes rivalry context; 2008 Stevenson/Sherk LW title wins; 2009 Florian/Sanchez title defenses; 2010 Edgar title fights | 6.00 -> 7.00 | 2.50 | 1.00 | 7.00 + 2.50 + 1.00 = 10.50 | BJ has real spread and two-division value, but the true elite window is not long enough to score like the top longevity cases. Late-career collapse adds no value. |
| Khabib Nurmagomedov | 2014 Rafael dos Anjos elite breakthrough; 2017 Barboza contender proof; 2018 Iaquinta title win/McGregor title defense; 2019 Poirier title defense; 2020 Gaethje title defense | 6.02 -> 7.02 | 2.00 | 0.00 | 7.02 + 2.00 + 0.00 = 9.02 | Khabib is not a Longevity case. He has a clean unbeaten elite window, but it is compact and has no late second chapter. His ranking should be carried by Prime Dominance, not Longevity. |
| Dominick Cruz | 2011 Faber/Demetrious Johnson UFC title wins; 2014 Mizugaki comeback; 2016 Dillashaw title comeback/Faber; 2020 Cejudo title fight; 2021 Kenney; 2022 Vera contender relevance | 5.00 -> 6.00 | 2.00 | 1.50 | 6.00 + 2.00 + 1.50 = 9.50 | Cruz gets real late-continuity credit for the Dillashaw comeback, but WEC is excluded and the injury gaps prevent a bigger active-years/spread score. |
| Islam Makhachev | 2021 Dober/Hooker prime start; 2022 Oliveira title win; 2023 Volkanovski title defenses; 2024 Poirier title defense; later second-division title value in current table | 4.70 -> 5.70 | 2.00 | 1.00 | 5.70 + 2.00 + 1.00 = 8.70 | Islam is still building. The current table gives him strong title value and some second-division relevance, but the active elite window is not long yet. |
| Charles Oliveira | 2020 Kevin Lee/Tony Ferguson title-level rise; 2021 Chandler title win/Poirier defense; 2022 Gaethje/Islam title-level run; 2023 Dariush post-title elite win; later Arman/contender relevance context | 4.00 -> 5.00 | 2.00 | 1.00 | 5.00 + 2.00 + 1.00 = 8.00 | Charles has a long UFC career, but Longevity only counts true elite-title relevance. Dariush gives meaningful post-title continuity, but the elite window is still shorter than the long-relevance cases. |

## Batch 3 Source Data Snapshot

| Fighter | Source path | UFC record | Title-fight wins | Elite wins | Source activeEliteYears | Source late/scope notes used |
| --- | --- | --- | ---: | ---: | ---: | --- |
| Aljamain Sterling | `assets/data/fighter-packets/aljamain-sterling.js` | 17-5 | 4 | 10 | 7.00 | Modern BW title run plus FW extension; Evloev caps the second-division case. |
| Justin Gaethje | `assets/data/fighter-packets/justin-gaethje.js` | 12-5 | 3 | 9 | 7.00 | Modern LW chaos résumé with current-table undisputed title value; heavy loss context belongs elsewhere. |
| Cain Velasquez | `assets/data/fighter-packets/cain-velasquez.js` | 12-3 | 4 | 5 | 7.47 | Heavyweight peak-pressure case; injuries limit the long-active timeline. |
| T.J. Dillashaw | `assets/data/fighter-packets/tj-dillashaw.js` | 13-5 | 5 | 7 | 6.50 | Two-reign BW title prime; EPO/suspension gap and injury ending cap late continuity. |
| Petr Yan | `assets/data/fighter-packets/petr-yan.js` | 12-4 | 3 | 6 | 5.98 | Modern BW title window with DQ/loss context; solid but not massive elite window. |
| Joanna Jedrzejczyk | `assets/data/fighter-packets/joanna-jedrzejczyk.js` | 10-5 | 6 | 6 | 5.50 | Strawweight title standard; Rose/Zhang back end caps late continuity. |
| Chuck Liddell | `assets/data/fighter-packets/chuck-liddell.js` | 16-7 | 5 | 7 | 5.50 | Classic LHW title reign; rough late KO losses do not add value. |
| Henry Cejudo | `assets/data/fighter-packets/henry-cejudo.js` | 10-4 | 4 | 5 | 4.00 | Compact double-champ burst; retirement gap and return losses cap longevity. |
| Conor McGregor | `assets/data/fighter-packets/conor-mcgregor.js` | 10-4 | 3 | 6 | 3.00 | Iconic short double-champ prime; star power does not replace active elite years. |
| Ronda Rousey | `assets/data/fighter-packets/ronda-rousey.js` | 6-2 | 6 | 4 | 3.00 | Original women’s UFC title run; short window and sharp ending cap longevity. |

## Batch 3 Evidence Worksheet

| Fighter | UFC elite proof years/events used | ActiveEliteYears -> score /10 | Spread score /3 | Late continuity score /2 | Formula output | Notes |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| Aljamain Sterling | 2019 Munhoz elite BW rise; 2020 Sandhagen title eliminator; 2021 Yan title win; 2022 Yan rematch/Dillashaw defense; 2023 Cejudo defense/O'Malley title loss; 2024 Kattar FW extension; 2025 Ortega/Zalal FW relevance; 2026 Evloev cap in current table | 7.00 -> 7.75 | 2.50 | 1.50 | 7.75 + 2.50 + 1.50 = 11.75 | Aljo has real longevity because he stayed relevant from BW contender to champion to FW extension. Evloev keeps the second-division chapter from becoming max late continuity. |
| Justin Gaethje | 2018 Poirier/Alvarez elite LW context; 2019 Cerrone/Barboza; 2020 Ferguson interim title/Khabib title fight; 2021 Chandler; 2022 Oliveira title-level fight; 2023 Fiziev/Poirier rematch; 2024 Holloway title-level/BMF context; current-table Topuria undisputed LW title value | 7.00 -> 7.75 | 2.50 | 2.00 | 7.75 + 2.50 + 2.00 = 12.25 | Gaethje gets strong Longevity because the current table gives him late undisputed title proof after years of elite LW relevance. Loss damage belongs in Penalty/Prime, not here. |
| Cain Velasquez | 2010 Nogueira/Lesnar HW title breakthrough; 2011 JDS title fight; 2012 Bigfoot/JDS title regain; 2013 Bigfoot/JDS trilogy; 2015 Werdum title fight; 2016 Browne contender rebound; 2019 Ngannou late HW relevance context | 7.47 -> 8.10 | 2.50 | 0.50 | 8.10 + 2.50 + 0.50 = 11.10 | Cain has a meaningful HW elite span, but injuries and the Werdum/Ngannou back end keep late continuity low. |
| T.J. Dillashaw | 2014 Barao title upset/Soto defense; 2015 Barao rematch/Cruz title fight; 2016 Assuncao/Lineker; 2017 Garbrandt title win; 2018 Garbrandt defense; 2019 Cejudo cross-division title fight; 2021 Sandhagen return win; 2022 Sterling title fight with injury context | 6.50 -> 7.38 | 2.50 | 1.00 | 7.38 + 2.50 + 1.00 = 10.88 | TJ has real title-level staying power, and Sandhagen helps late continuity. EPO/suspension gap and Sterling injury ending prevent a bigger late score. |
| Petr Yan | 2019 Faber/title rise; 2020 Aldo title win; 2021 Sterling DQ/Sandhagen interim title-level win; 2022 Sterling rematch/O'Malley elite fight; 2023 Merab title-level loss; later elite BW rebound/current-table context | 5.98 -> 6.98 | 2.50 | 1.00 | 6.98 + 2.50 + 1.00 = 10.48 | Yan's elite window is solid, but compact. DQ context protects the evaluation, but Longevity still cannot treat him like a long-reign case. |
| Joanna Jedrzejczyk | 2015 Esparza/Penne/Letourneau title run; 2016 Gadelha/Kowalkiewicz; 2017 Andrade/Rose title fights; 2018 Rose rematch/Tecia; 2019 Waterson; 2020 Zhang title fight; 2022 Zhang rematch elite context | 5.50 -> 6.50 | 2.50 | 1.00 | 6.50 + 2.50 + 1.00 = 10.00 | Joanna stayed title-relevant after losing the belt, but the Rose/Zhang back end is more elite context than a full late winning chapter. |
| Chuck Liddell | 2002 Belfort/title relevance; 2003 Couture title fight/Ortiz path; 2004 Ortiz/Vernon White; 2005 Couture title win/Horn; 2006 Couture/Babalu/Ortiz defenses; 2007 Rampage/Jardine title-level end; 2008 Evans elite context | 5.50 -> 6.50 | 2.50 | 0.50 | 6.50 + 2.50 + 0.50 = 9.50 | Chuck has strong era spread and title relevance, but the late KO losses are not late continuity value. |
| Henry Cejudo | 2016 Formiga/DJ title relevance; 2017 Pettis/Reis rebuild; 2018 DJ title win; 2019 Dillashaw/Moraes double-champ burst; 2020 Cruz defense/retirement; 2023 Sterling return title fight; 2024 Merab contender loss | 4.00 -> 5.00 | 2.00 | 0.50 | 5.00 + 2.00 + 0.50 = 7.50 | Cejudo's achievements are loud, but the active elite window is compact. Return title relevance gets minor credit, but return losses do not create a second chapter. |
| Conor McGregor | 2014 Poirier featherweight rise; 2015 Mendes interim title/Aldo title win; 2016 Diaz rivalry/Alvarez double-champ win; 2018 Khabib title fight; 2021 Poirier losses as late context only | 3.00 -> 3.75 | 1.50 | 0.00 | 3.75 + 1.50 + 0.00 = 5.25 | Conor's moments are enormous, but Longevity is the weakness: short prime, no defenses, inactivity, and no late elite winning chapter. |
| Ronda Rousey | 2013 Carmouche/Tate UFC title wins; 2014 McMann/Davis; 2015 Zingano/Correia/Holm; 2016 Nunes title return/loss | 3.00 -> 3.75 | 1.50 | 0.00 | 3.75 + 1.50 + 0.00 = 5.25 | Ronda's peak/title impact is massive, but the UFC elite window is short and ends sharply. This is not a Longevity case. |

## Combined Batch 1 + Batch 2 + Batch 3 Formula Output Order

| Longevity rank in audited batches | Fighter | Proposed Longevity /15 |
| ---: | --- | ---: |
| 1 | Max Holloway | 15.00 |
| 1 | Frankie Edgar | 15.00 |
| 3 | Jose Aldo | 14.57 |
| 4 | Jon Jones | 14.50 |
| 5 | Randy Couture | 13.91 |
| 6 | Dustin Poirier | 13.88 |
| 7 | Georges St-Pierre | 13.86 |
| 8 | Valentina Shevchenko | 13.50 |
| 9 | Amanda Nunes | 12.75 |
| 10 | Justin Gaethje | 12.25 |
| 11 | Stipe Miocic | 12.22 |
| 12 | Demetrious Johnson | 12.13 |
| 13 | Aljamain Sterling | 11.75 |
| 14 | Daniel Cormier | 11.79 |
| 15 | Anderson Silva | 11.41 |
| 16 | Cain Velasquez | 11.10 |
| 17 | Alexander Volkanovski | 10.53 |
| 18 | B.J. Penn | 10.50 |
| 19 | Petr Yan | 10.48 |
| 20 | Kamaru Usman | 10.03 |
| 21 | Joanna Jedrzejczyk | 10.00 |
| 22 | Dominick Cruz | 9.50 |
| 22 | Chuck Liddell | 9.50 |
| 24 | T.J. Dillashaw | 10.88 |
| 25 | Khabib Nurmagomedov | 9.02 |
| 26 | Islam Makhachev | 8.70 |
| 27 | Charles Oliveira | 8.00 |
| 28 | Henry Cejudo | 7.50 |
| 29 | Conor McGregor | 5.25 |
| 29 | Ronda Rousey | 5.25 |

## Ranking Cleanup Notes

The combined order needs a numeric sort pass before live implementation. The worksheet scores are the source of truth; rank numbers in the combined display should be regenerated after all batches are approved.

Known sort correction from Batch 3: T.J. Dillashaw at 10.88 should appear above Cain/Volk/BJ/Yan/Usman/Joanna, not at rank 24.

## Why These Scores Now Make Sense

- The visible formula is doing the work: `active-years score + spread score + late-continuity score`.
- Spread means repeated elite proof across UFC seasons, not win quality.
- The late-continuity score is tied to a concrete checkpoint: post-title run, division move, title reclaim, or return from layoff.
- Cody's late-fight rulings are locked into the evidence table: GSP/Bisping yes, Jon HW title relevance yes, Stipe/Jones no.
- Max, Frankie, Aldo, Randy, Poirier, GSP, Valentina, and Aljo are strong Longevity-style cases.
- Khabib, Islam, Charles, Cejudo, Conor, and Ronda are intentionally lower because their greatness is more Prime Dominance, Championship, Opponent Quality, or impact than long active elite relevance.
- These are worksheet scores only. Do not create a live correction file until Cody approves the shape.

## Batch 4 Candidates

After Batch 3 shape review, audit these next:

- Ilia Topuria
- Alex Pereira
- Francis Ngannou
- Matt Hughes
- Merab Dvalishvili
- Sean O'Malley
- Leon Edwards
- Belal Muhammad
- Robert Whittaker
- Tony Ferguson

## Current Formula Interpretation Notes

These are qualitative rules for applying the formula, not expected values.

- Khabib should not score high in Longevity. His greatness is carried by Championship, Opponent Quality, and Prime Dominance, not a long UFC elite timeline.
- DJ should be strong, but not artificially forced into the very top if we are strict about UFC-only active years and avoid double-counting title-defense dominance.
- Max, Frankie, Aldo, and Poirier should be protected because late elite relevance is exactly what this category is supposed to recognize.
- Cormier, Stipe, and Randy should rise from older legacy-style values if the audit properly credits UFC-only cross-division/title continuity.
- Current short-sample monsters like Ilia, Pereira, and Islam should be capped unless the app timeline intentionally extends their elite windows.

## Approval Gate

Do not create `assets/data/longevity-score-corrections.js` until Cody approves the Batch 1, Batch 2, and Batch 3 score shape.

After approval:

1. Create `assets/data/longevity-score-corrections.js`.
2. Load it in `assets/data/ranking-data-patches.js` after Prime Dominance and before `score-derived-ovr.js`.
3. Recalculate totals and ranks after Longevity patches.
4. Expose status in `window.UFC_PHASE2_DATA_STATUS.longevityScoreCorrections`.
