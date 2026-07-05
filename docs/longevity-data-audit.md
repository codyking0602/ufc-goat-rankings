# Longevity Data Audit

Version: `longevity-data-audit-20260705k`  
Status: Batch 1, Batch 2, Batch 3, and sourced Batch 4 revised with UFC Career Staying Power. Not live scoring.  
Live app impact: None.

## Goal

Longevity answers one question:

> How long did this fighter keep proving value inside the UFC?

The main weight still goes to elite relevance, but Cody is right: a long UFC career should get a small amount of credit even when every year was not elite.

This category should not become Prime Dominance again. It should also not ignore the professionalism and durability required to stay in the UFC for a long time.

## Revised Working Formula

`Longevity / 15 = Active Elite Years / 9 + Elite Relevance Spread / 3 + Late Elite Continuity / 2 + UFC Career Staying Power / 1`

## What Changed

Old formula:

`Active Elite Years /10 + Elite Relevance Spread /3 + Late Elite Continuity /2 = 15`

New formula:

`Active Elite Years /9 + Elite Relevance Spread /3 + Late Elite Continuity /2 + UFC Career Staying Power /1 = 15`

The same active-years curve is still used, but the result is scaled from `/10` to `/9`. That opens one point for a career-length bonus.

## UFC Career Staying Power /1

This rewards long UFC careers slightly, even if every fight was not elite.

Use UFC fight count as the primary input because this rewards actually fighting in the UFC, not just calendar gaps.

| UFC career profile | Bonus |
| --- | ---: |
| Huge UFC career: 25+ UFC fights | 1.00 |
| Long UFC career: 20-24 UFC fights | 0.75 |
| Solid UFC career: 15-19 UFC fights | 0.50 |
| Normal UFC run: 10-14 UFC fights | 0.25 |
| Short UFC run: fewer than 10 UFC fights | 0.00 |

Calendar span can be used as context, but long layoffs, retirements, suspensions, or inactive gaps should not create free staying-power credit by themselves.

## What Spread Means

`Elite Relevance Spread /3` means: how widely the fighter's elite proof is spread across UFC seasons.

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
3. Convert active elite years into the `/9` score using the curve scaled from the old `/10` score.
4. Score elite relevance spread `/3` from the proof years/events.
5. Score late elite continuity `/2` from actual post-checkpoint elite proof.
6. Add UFC Career Staying Power `/1` from UFC fight count.
7. Add the four sub-scores.

Do not start with a desired final score.

## Formula Rules

### 1. Active Elite Years / 9

Measures gap-capped time as a UFC title/top-five/title-level contender.

Use the current `activeEliteYears` field as the first source input when it exists, apply the active-years curve, then scale the result to `/9`.

| Gap-capped active elite years | Old /10 score | New /9 score |
| ---: | ---: | ---: |
| 10.0+ | 10.00 | 9.00 |
| 9.0 | 9.25 | 8.33 |
| 8.0 | 8.50 | 7.65 |
| 7.0 | 7.75 | 6.98 |
| 6.0 | 7.00 | 6.30 |
| 5.0 | 6.00 | 5.40 |
| 4.0 | 5.00 | 4.50 |
| 3.0 | 3.75 | 3.38 |
| 2.0 | 2.50 | 2.25 |
| 1.0 | 1.25 | 1.13 |
| 0.0 | 0.00 | 0.00 |

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
- Long UFC careers get staying-power credit, but late losing streaks do not become fake elite relevance.
- Current table/app timeline can be used as the source of truth if it intentionally extends beyond real-world current records.

## Batch 1 Revised Evidence Worksheet

| Fighter | UFC elite proof years/events used | Active /9 | Spread /3 | Late /2 | Career /1 | Revised formula output | Notes |
| --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| Max Holloway | 2015 Swanson/Oliveira; 2016 Lamas/Pettis; 2017 Aldo title wins; 2018 Ortega; 2019 Poirier/Edgar; 2020 Volk rematch; 2021 Kattar/Yair; 2022 Volk trilogy; 2023 Allen/Korean Zombie; 2024 Gaethje/Topuria relevance | 9.00 | 3.00 | 2.00 | 1.00 | 15.00 | Huge UFC fight count plus long elite/post-title relevance. |
| Jose Aldo | 2011 UFC title run; 2012 Mendes; 2013 Edgar/Korean Zombie; 2014 Lamas/Mendes; 2015 McGregor; 2016 Edgar interim; 2018 Stephens; 2019 Moicano; 2020 Yan/Vera; 2021 Munhoz/Font; 2022 Merab | 8.61 | 3.00 | 2.00 | 0.75 | 14.36 | WEC excluded, but UFC-only FW/BW relevance stays long. |
| Jon Jones | 2011 Bader/Rua; 2012 Evans/Belfort; 2013 Sonnen/Gustafsson; 2014 Glover; 2015 Cormier; 2018 Gustafsson II; 2019 Smith/Santos; 2020 Reyes; 2023 Gane; 2024 Stipe HW relevance | 9.00 | 3.00 | 1.50 | 0.75 | 14.25 | HW relevance counts per Cody, but not as a full second chapter. |
| Georges St-Pierre | 2004 Hughes; 2006 Penn/Hughes; 2007 Serra/Hughes; 2008 Serra/Fitch; 2009 Penn/Alves; 2010 Hardy/Koscheck; 2011 Shields; 2012 Condit; 2013 Diaz/Hendricks; 2017 Bisping | 8.42 | 3.00 | 1.50 | 0.75 | 13.67 | Bisping counts, but retirement gap is not active elite time. |
| Stipe Miocic | 2015 Hunt/Arlovski; 2016 Werdum/Overeem; 2017 dos Santos; 2018 Ngannou/Cormier; 2019 Cormier rematch; 2020 Cormier trilogy; 2021 Ngannou title fight | 7.40 | 2.50 | 1.50 | 0.75 | 12.15 | Jones late fight excluded per Cody. Career bonus rewards 20 UFC fights. |
| Demetrious Johnson | 2011 Cruz; 2012 McCall/Benavidez; 2013 Dodson/Moraga/Benavidez; 2014 Bagautinov/Cariaso; 2015 Horiguchi/Dodson; 2016 Cejudo/Elliott; 2017 Reis/Borg; 2018 Cejudo rematch | 6.87 | 3.00 | 1.50 | 0.50 | 11.87 | UFC-only; ONE does not extend score. |
| Daniel Cormier | 2013 Mir/Nelson; 2014 Hendo/Jones; 2015 Rumble/Gustafsson; 2016 Anderson short-notice; 2017 Rumble/Jones NC; 2018 Oezdemir/Stipe/Lewis; 2019-2020 Stipe trilogy | 7.01 | 2.50 | 1.50 | 0.50 | 11.51 | Compact UFC window, but strong two-division title relevance. |
| Anderson Silva | 2006 Leben/Franklin; 2007 Lutter/Marquardt/Franklin; 2008 Henderson/Irvin/Cote; 2009 Leites/Griffin; 2010 Maia/Sonnen; 2011 Belfort/Okami; 2012 Sonnen/Bonnar; 2013 Weidman | 7.12 | 3.00 | 0.50 | 1.00 | 11.62 | Huge UFC fight count gets career credit, but post-title proof remains limited. |
| Alexander Volkanovski | 2019 Aldo/Max; 2020 Max rematch; 2021 Ortega; 2022 Korean Zombie/Max trilogy; 2023 Islam/Yair/Islam; 2024 Topuria | 6.78 | 2.50 | 0.50 | 0.50 | 10.28 | Strong FW title window, but not a long post-title winning chapter. |
| Kamaru Usman | 2018 Maia/RDA; 2019 Woodley/Covington; 2020 Masvidal; 2021 Burns/Masvidal/Covington; 2022 Edwards; 2023 Edwards/Khamzat | 6.33 | 2.50 | 0.50 | 0.50 | 9.83 | Strong compact WW title window; post-title proof limited. |

## Batch 2 Revised Evidence Worksheet

| Fighter | UFC elite proof years/events used | Active /9 | Spread /3 | Late /2 | Career /1 | Revised formula output | Notes |
| --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| Frankie Edgar | 2010 Penn; 2011 Maynard; 2012 Henderson; 2013 Aldo/Oliveira; 2014 Penn/Cub; 2015 Faber/Mendes; 2016 Aldo interim; 2017 Yair; 2018 Ortega; 2019 Holloway | 9.00 | 3.00 | 2.00 | 1.00 | 15.00 | Maxed because he has elite proof plus huge UFC fight count. |
| Randy Couture | 1997 early title relevance; 2000 Randleman/Rizzo; 2001 Rizzo; 2003 Liddell/Ortiz; 2004 Belfort/Liddell; 2007 Sylvia/Gonzaga; 2008 Lesnar; 2010 Coleman | 8.02 | 3.00 | 2.00 | 0.75 | 13.77 | Era-spanning UFC title relevance and long career. |
| Dustin Poirier | 2017 Pettis; 2018 Gaethje/Alvarez; 2019 Holloway/Khabib; 2020 Hooker; 2021 McGregor/Charles; 2022 Chandler; 2023 Gaethje; 2024 Saint Denis/Islam; 2025 Holloway context | 7.99 | 3.00 | 2.00 | 1.00 | 13.99 | Staying-power tweak helps Dustin exactly as intended. |
| Valentina Shevchenko | 2015 Kaufman; 2016 Holm/Nunes; 2018 Joanna; 2019 Eye/Carmouche; 2020 Chookagian/Maia; 2021 Andrade/Murphy; 2022 Santos; 2023-2024 Grasso rivalry/title-regain context | 7.65 | 3.00 | 2.00 | 0.50 | 13.15 | Long elite women's UFC title relevance with solid career length. |
| Amanda Nunes | 2013 de Randamie/Davis; 2015 McMann; 2016 Tate/Rousey; 2017 Shevchenko; 2018 Pennington/Cyborg; 2019 Holm/GDR; 2020 Spencer; 2021 Anderson/Pena; 2022 Pena revenge; 2023 Aldana | 6.98 | 3.00 | 2.00 | 0.50 | 12.48 | Pena revenge keeps late continuity high; career count is solid, not huge. |
| B.J. Penn | 2001 Uno; 2002 Pulver; 2004 Hughes; 2006 GSP/Hughes; 2008 Stevenson/Sherk; 2009 Florian/Sanchez; 2010 Edgar | 6.30 | 2.50 | 1.00 | 1.00 | 10.80 | Long UFC career gets credit, but late collapse is not elite relevance. |
| Khabib Nurmagomedov | 2014 RDA; 2017 Barboza; 2018 Iaquinta/McGregor; 2019 Poirier; 2020 Gaethje | 6.32 | 2.00 | 0.00 | 0.25 | 8.57 | Normal UFC run bonus, but still not a Longevity case. |
| Dominick Cruz | 2011 Faber/DJ; 2014 Mizugaki; 2016 Dillashaw/Faber; 2020 Cejudo; 2021 Kenney; 2022 Vera | 5.40 | 2.00 | 1.50 | 0.25 | 9.15 | Dillashaw comeback matters, but low UFC fight count and WEC exclusion cap it. |
| Islam Makhachev | 2021 Dober/Hooker; 2022 Oliveira; 2023 Volkanovski defenses; 2024 Poirier; later second-division current-table value | 5.13 | 2.00 | 1.00 | 0.50 | 8.63 | Solid UFC career bonus, but elite window is still building. |
| Charles Oliveira | 2020 Lee/Ferguson; 2021 Chandler/Poirier; 2022 Gaethje/Islam; 2023 Dariush; later Arman/contender context | 4.50 | 2.00 | 1.00 | 1.00 | 8.50 | This is the main winner from the tweak: long UFC career gets respect without overstating elite years. |

## Batch 3 Revised Evidence Worksheet

| Fighter | UFC elite proof years/events used | Active /9 | Spread /3 | Late /2 | Career /1 | Revised formula output | Notes |
| --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| Aljamain Sterling | 2019 Munhoz; 2020 Sandhagen; 2021 Yan; 2022 Yan/Dillashaw; 2023 Cejudo/O'Malley; 2024 Kattar; 2025 Ortega/Zalal; 2026 Evloev cap | 6.98 | 2.50 | 1.50 | 0.75 | 11.73 | BW title run plus FW extension and long UFC fight count. |
| Justin Gaethje | 2018 Poirier/Alvarez; 2019 Cerrone/Barboza; 2020 Ferguson/Khabib; 2021 Chandler; 2022 Oliveira; 2023 Fiziev/Poirier; 2024 Holloway; current-table Topuria title value | 6.98 | 2.50 | 2.00 | 0.50 | 11.98 | Current-table title value keeps late score high; career count is solid. |
| Cain Velasquez | 2010 Nogueira/Lesnar; 2011 JDS; 2012 Bigfoot/JDS; 2013 Bigfoot/JDS; 2015 Werdum; 2016 Browne; 2019 Ngannou context | 7.29 | 2.50 | 0.50 | 0.50 | 10.79 | Strong active elite span, but injuries and back-end losses limit late continuity. |
| T.J. Dillashaw | 2014 Barao/Soto; 2015 Barao/Cruz; 2016 Assuncao/Lineker; 2017 Garbrandt; 2018 Garbrandt; 2019 Cejudo; 2021 Sandhagen; 2022 Sterling injury context | 6.64 | 2.50 | 1.00 | 0.50 | 10.64 | Sandhagen helps late continuity; EPO/suspension gap caps it. |
| Petr Yan | 2019 Faber; 2020 Aldo; 2021 Sterling/Sandhagen; 2022 Sterling/O'Malley; 2023 Merab; later BW rebound/current-table context | 6.28 | 2.50 | 1.00 | 0.50 | 10.28 | Solid but compact modern BW window. |
| Joanna Jedrzejczyk | 2015 Esparza/Penne/Letourneau; 2016 Gadelha/Kowalkiewicz; 2017 Andrade/Rose; 2018 Rose/Tecia; 2019 Waterson; 2020 Zhang; 2022 Zhang rematch | 5.85 | 2.50 | 1.00 | 0.50 | 9.85 | Title relevance after belt loss, but no full late winning chapter. |
| Chuck Liddell | 2002 Belfort; 2003 Couture/Ortiz path; 2004 Ortiz/White; 2005 Couture/Horn; 2006 Couture/Babalu/Ortiz; 2007 Rampage/Jardine; 2008 Evans | 5.85 | 2.50 | 0.50 | 0.75 | 9.60 | Career bonus helps Chuck's long UFC presence, but late KO losses are not elite value. |
| Henry Cejudo | 2016 Formiga/DJ; 2017 Pettis/Reis; 2018 DJ; 2019 Dillashaw/Moraes; 2020 Cruz; 2023 Sterling; 2024 Merab | 4.50 | 2.00 | 0.50 | 0.25 | 7.25 | Loud achievements, compact active elite window. |
| Conor McGregor | 2014 Poirier; 2015 Mendes/Aldo; 2016 Diaz/Alvarez; 2018 Khabib; 2021 Poirier losses as context only | 3.38 | 1.50 | 0.00 | 0.25 | 5.13 | Star power is profile context, not Longevity. Normal UFC run bonus only. |
| Ronda Rousey | 2013 Carmouche/Tate; 2014 McMann/Davis; 2015 Zingano/Correia/Holm; 2016 Nunes | 3.38 | 1.50 | 0.00 | 0.00 | 4.88 | Massive UFC impact, but short UFC fight count and short elite window. |

## Batch 4 Source Status

Sourced in current repo packets:

- Ilia Topuria
- Alex Pereira
- Francis Ngannou
- Matt Hughes
- Merab Dvalishvili

Not found in current repo source during this audit, so not scored yet:

- Sean O'Malley
- Leon Edwards
- Belal Muhammad
- Robert Whittaker
- Tony Ferguson

These unsourced fighters should get fighter packets or source rows before Longevity audit scoring.

## Batch 4 Revised Evidence Worksheet

| Fighter | UFC elite proof years/events used | Active /9 | Spread /3 | Late /2 | Career /1 | Revised formula output | Notes |
| --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| Matt Hughes | 2001 Newton title run; 2002 Sakurai/Newton; 2004 Penn/GSP title relevance; 2005 Trigg/Riggs; 2006 Gracie/Penn/GSP; 2007 Lytle/GSP/Alves title-level back end | 7.89 | 3.00 | 1.50 | 1.00 | 13.39 | Hughes is a major Longevity case: long early-WW title control, many UFC fights, and years as the division standard. Era strength belongs elsewhere, not as a full Longevity wipeout. |
| Francis Ngannou | 2017 Overeem/Arlovski power rise; 2018 Stipe title fight/Lewis setback; 2019 Cain/JDS; 2020 Rozenstruik; 2021 Stipe title win; 2022 Gane defense | 4.95 | 2.50 | 1.50 | 0.25 | 9.20 | Ngannou has strong HW title-era spread and a real late improvement chapter after the Stipe/Lewis setbacks, but the UFC exit caps career staying power. |
| Merab Dvalishvili | 2020 Dodson/Lopez rise; 2021 Moraes; 2022 Aldo; 2023 Yan; 2024 Cejudo/O'Malley; current-table Umar/title-defense context | 5.40 | 2.00 | 1.00 | 0.50 | 8.90 | Merab has useful active elite years and modern BW depth, but the title run is still building and not long enough for max spread. |
| Alex Pereira | 2022 Strickland/Adesanya MW title win; 2023 Adesanya loss/Blachowicz/Jiri LHW title; 2024 Hill/Jiri/Rountree LHW defenses; current-table Gane HW risk context | 4.04 | 2.00 | 1.50 | 0.25 | 7.79 | Pereira gets real two-division late-continuity credit, but the UFC elite window is short and the career count is normal, not long. |
| Ilia Topuria | 2022 Mitchell contender proof; 2023 Emmett; 2024 Volkanovski/Holloway title-level legend wins | 3.58 | 1.50 | 0.00 | 0.00 | 5.08 | Ilia's peak and quality wins are loud, but Longevity is intentionally low because the UFC elite window and fight count are still short. |

## Combined Revised Output Order Through Sourced Batch 4

| Longevity rank in audited batches | Fighter | Revised Longevity /15 |
| ---: | --- | ---: |
| 1 | Max Holloway | 15.00 |
| 1 | Frankie Edgar | 15.00 |
| 3 | Jose Aldo | 14.36 |
| 4 | Jon Jones | 14.25 |
| 5 | Dustin Poirier | 13.99 |
| 6 | Randy Couture | 13.77 |
| 7 | Georges St-Pierre | 13.67 |
| 8 | Matt Hughes | 13.39 |
| 9 | Valentina Shevchenko | 13.15 |
| 10 | Amanda Nunes | 12.48 |
| 11 | Stipe Miocic | 12.15 |
| 12 | Justin Gaethje | 11.98 |
| 13 | Demetrious Johnson | 11.87 |
| 14 | Aljamain Sterling | 11.73 |
| 15 | Anderson Silva | 11.62 |
| 16 | Daniel Cormier | 11.51 |
| 17 | Francis Ngannou | 9.20 |
| 18 | Merab Dvalishvili | 8.90 |
| 19 | Alex Pereira | 7.79 |
| 20 | Ilia Topuria | 5.08 |

Note: the full combined table above shows Batch 4 placements only against the most relevant existing scores. The live correction file should do a full numeric sort across every approved fighter when implemented.

## Main Impact of the Staying-Power Tweak

- Long-career fighters get a small deserved bump without turning non-elite years into elite proof.
- Charles Oliveira improves because his full UFC career is huge, even though his true elite-title window is shorter.
- B.J. Penn and Chuck Liddell get a small correction for being long UFC fixtures, while their late losses still do not become positive elite relevance.
- Matt Hughes scores high because he combines a long UFC title-era run with a huge UFC fight count.
- Khabib, Cejudo, Conor, Ronda, Ilia, and Pereira remain lower in Longevity because their UFC elite windows are compact.
- Max and Frankie still max out because they combine elite relevance and huge UFC staying power.

## Batch 5 Candidates

After Batch 4 shape review, audit these next once source rows/packets are confirmed or added:

- Sean O'Malley
- Leon Edwards
- Belal Muhammad
- Robert Whittaker
- Tony Ferguson
- Benson Henderson
- Renan Barao
- Urijah Faber
- Robbie Lawler
- Holly Holm

## Approval Gate

Do not create `assets/data/longevity-score-corrections.js` until Cody approves the revised Batch 1, Batch 2, Batch 3, and sourced Batch 4 score shape.

After approval:

1. Create `assets/data/longevity-score-corrections.js`.
2. Load it in `assets/data/ranking-data-patches.js` after Prime Dominance and before `score-derived-ovr.js`.
3. Recalculate totals and ranks after Longevity patches.
4. Expose status in `window.UFC_PHASE2_DATA_STATUS.longevityScoreCorrections`.
