# Opponent Quality Batch 2 Worksheet

Last updated: 2026-07-03

Purpose: start the next formula-only Opponent Quality pass after Batch 1B. No live app score changes are approved from this worksheet.

Batch 2 focuses on fighters with usable current UFC win ledgers in the repo:

- Khabib Nurmagomedov
- Islam Makhachev
- Demetrious Johnson
- Jose Aldo
- Alex Pereira

Matt Hughes and Randy Couture are intentionally pushed to an old-era batch because their UFC-only opponent ledgers need more reconstruction before formula scoring.

## Locked formula carried forward

```text
Opponent Quality Score = 25 × Fighter Adjusted Opponent Quality Index ÷ Current Best Adjusted Opponent Quality Index
```

Current benchmark from locked Batch 1B: Georges St-Pierre adjusted OQ index = 15.62, score = 25.00.

## Locked rules carried forward

| Win type | Credit |
|---|---:|
| Beat sitting UFC champion | 1.25 |
| Beat elite top-5 / title-level contender | 1.00 |
| Beat championship-level former champ / very strong ranked contender | 0.75 |
| Beat strong ranked contender / former champ still good | 0.50 |
| Beat name-value guy past prime / future elite before prime | 0.25 |
| Weird / injury / fluky win | Cody call, usually 0.00-0.50 |
| Loss / no contest / draw | 0.00 |

Diminishing returns:

| Credit bucket | Treatment |
|---|---|
| First 8 quality wins, sorted by credit | 100% value |
| Quality wins 9-12 | 75% value |
| Quality wins after 12 | 50% value |
| Support wins under 0.75 credit | Add normally, capped at 2.50 index points |

Quality win = 0.75, 1.00, or 1.25.  
Support win = 0.50 or 0.25.

---

# Cody calls recorded so far

| Call | Status |
|---|---|
| Khabib over Conor | Cody says 1.00. Locked unless revisited. |
| Islam over Volkanovski 2 | Cody says yes, keep 1.25 despite short notice. Locked unless revisited. |
| Islam over Dustin | Cody asked why 0.75. Not locked yet. |
| Islam/Pereira future/current app timeline wins | Cody asked what this means. Not locked yet. |
| DJ over Benavidez 1 | Cody says 1.00. Locked unless revisited. |
| DJ flyweight adjustment | Cody says 0.85. Locked unless revisited. |
| Aldo division adjustment | Cody says 1.00. Locked unless revisited. |
| Pereira division adjustment | Cody says 0.98. Locked unless revisited. |

---

# Batch 2 working ledgers

## Khabib Nurmagomedov

Current OQ: 8.99.

| UFC win | Working credit | Reason |
|---|---:|---|
| Kamal Shalorus | 0.00 | UFC win, no quality tier |
| Gleison Tibau | 0.25 | tough veteran/context win, but not clean ranked credit |
| Thiago Tavares | 0.25 | name/supporting early win |
| Abel Trujillo | 0.00 | UFC win, no quality tier |
| Pat Healy | 0.50 | strong ranked/supporting lightweight win |
| Rafael dos Anjos | 1.00 | elite/top-5 lightweight at time |
| Darrell Horcher | 0.00 | short-notice stay-busy win |
| Michael Johnson | 0.50 | top-ten/support win |
| Edson Barboza | 1.00 | elite/top-5 lightweight win |
| Al Iaquinta | 0.50 | vacant title opponent but short-notice/non-top-five context |
| Conor McGregor | 1.00 | Cody call: full elite title-level/former two-division champion opponent |
| Dustin Poirier | 1.00 | interim champion/top-5 lightweight |
| Justin Gaethje | 1.00 | interim champion/top-5 lightweight |

Working math:

| Metric | Value |
|---|---:|
| Quality wins count | 5 |
| Discounted quality index | 5.00 |
| Raw support | 2.00 |
| Support after 2.50 cap | 2.00 |
| Base OQ index | 7.00 |
| Division/era adjustment | 1.10 |
| Adjusted OQ index | 7.70 |
| Formula OQ score | 12.32 |

Remaining Cody calls needed:

- Iaquinta vacant-title short-notice win: 0.50 okay?
- Tibau/Tavares small support credit: keep 0.25 each or make 0.00?

## Islam Makhachev

Current OQ: 9.80.

| UFC win | Working credit | Reason |
|---|---:|---|
| Leo Kuntz | 0.00 | UFC win, no quality tier |
| Chris Wade | 0.00 | UFC win, no quality tier |
| Nik Lentz | 0.25 | veteran/support win |
| Gleison Tibau | 0.25 | veteran/support win |
| Kajan Johnson | 0.00 | UFC win, no quality tier |
| Arman Tsarukyan | 0.25 | future elite before prime/ranking status |
| Davi Ramos | 0.00 | UFC win, no quality tier |
| Drew Dober | 0.50 | strong supporting lightweight win |
| Thiago Moises | 0.25 | support win |
| Dan Hooker | 0.50 | top-ten short-notice/support win |
| Bobby Green | 0.25 | short-notice name/support win |
| Charles Oliveira | 1.00 | elite former champion/vacant title opponent |
| Alexander Volkanovski 1 | 1.25 | reigning champion/P4P elite moving up; already treated max in repo |
| Alexander Volkanovski 2 | 1.25 | Cody call: keep max champion/P4P credit despite short notice |
| Dustin Poirier | 0.75 | Cody asked why. Working reason: former interim/title challenger but not clean top-five by some sources at the time. |
| Renato Moicano | 0.50 | short-notice top-ten title challenger |
| Jack Della Maddalena | 1.25 | current app timeline includes this future/current sitting champion win; Cody asked what this means |

Working math with Dustin at 0.75 and JDM included:

| Metric | Value |
|---|---:|
| Quality wins count | 5 |
| Discounted quality index | 5.50 |
| Raw support | 2.50 |
| Support after 2.50 cap | 2.50 |
| Base OQ index | 8.00 |
| Division/era adjustment | 1.10 |
| Adjusted OQ index | 8.80 |
| Formula OQ score | 14.08 |

Remaining Cody calls needed:

- Dustin 2024: 0.75 middle-tier or full 1.00 title-level challenger?
- JDM current app timeline: include as sitting champ 1.25, or hold until live timeline is finalized?
- Moicano short-notice title defense: 0.50 or 0.25?

## Demetrious Johnson

Current OQ: 12.88.

| UFC win | Working credit | Reason |
|---|---:|---|
| Kid Yamamoto | 0.00 | rank unclear; repo currently removed from scoring |
| Miguel Torres | 0.75 | former WEC champion/top bantamweight name; not sitting UFC champ |
| Ian McCall 2 | 1.00 | elite/top-5 flyweight rematch |
| Joseph Benavidez 1 | 1.00 | Cody call: normal elite contender credit, not special 1.25 |
| John Dodson 1 | 1.00 | elite/top-5 flyweight title challenger |
| John Moraga | 0.50 | title challenger/support, not full elite by current table |
| Joseph Benavidez 2 | 1.00 | elite/top-5 flyweight rematch |
| Ali Bagautinov | 0.50 | title challenger/support, not full elite by current table |
| Chris Cariaso | 0.25 | lower-ranked title challenger support |
| Kyoji Horiguchi | 0.50 | top-ten/future elite support unless Cody upgrades |
| John Dodson 2 | 1.00 | elite/top-5 flyweight rematch |
| Henry Cejudo 1 | 1.00 | elite/top-5 flyweight contender |
| Tim Elliott | 0.50 | TUF title challenger support |
| Wilson Reis | 0.50 | title challenger/top-ten support |
| Ray Borg | 1.00 | top-five/title challenger by repo logic |

Working math with 0.85 flyweight adjustment:

| Metric | Value |
|---|---:|
| Quality wins count | 8 |
| Discounted quality index | 7.75 |
| Raw support | 2.75 |
| Support after 2.50 cap | 2.50 |
| Base OQ index | 10.25 |
| Division/era adjustment | 0.85 |
| Adjusted OQ index | 8.71 |
| Formula OQ score | 13.94 |

Remaining Cody calls needed:

- Horiguchi: keep 0.50 or upgrade to 0.75 for future elite/championship-level quality?

## Jose Aldo

Current OQ: 13.42.

| UFC win | Working credit | Reason |
|---|---:|---|
| Mark Hominick | 0.50 | title challenger/top-ten support |
| Kenny Florian | 1.00 | elite/top-5 title challenger |
| Chad Mendes 1 | 1.00 | elite/top-5 title challenger |
| Frankie Edgar 1 | 1.00 | elite former LW champion moving down; title-level opponent |
| Chan Sung Jung | 0.50 | title challenger/support, not full top-five by current table |
| Ricardo Lamas | 1.00 | elite/top-5 title challenger |
| Chad Mendes 2 | 1.00 | elite/top-5 rematch |
| Frankie Edgar 2 | 1.00 | elite/top-5 interim title opponent |
| Jeremy Stephens | 1.00 | top-five post-title-run win by repo context |
| Renato Moicano | 0.50 | top-ten support |
| Pedro Munhoz | 0.50 | ranked bantamweight support |
| Rob Font | 0.50 | ranked bantamweight support |
| Marlon Vera | 0.25 | future contender/name support |
| Jonathan Martinez | 0.25 | ranked-ish late-career support |

Working math with Cody-called 1.00 division adjustment:

| Metric | Value |
|---|---:|
| Quality wins count | 7 |
| Discounted quality index | 7.00 |
| Raw support | 3.00 |
| Support after 2.50 cap | 2.50 |
| Base OQ index | 9.50 |
| Division/era adjustment | 1.00 |
| Adjusted OQ index | 9.50 |
| Formula OQ score | 15.21 |

Remaining Cody calls needed:

- Frankie Edgar 1: full 1.00 or middle-tier 0.75 because he was moving down from LW?
- Jeremy Stephens: keep full 1.00 by FightMatrix #5, or lower to 0.75?

## Alex Pereira

Current OQ: 10.06.

| UFC win | Working credit | Reason |
|---|---:|---|
| Andreas Michailidis | 0.00 | UFC win, no quality tier |
| Bruno Silva | 0.00 | UFC win, no quality tier |
| Sean Strickland | 0.50 | top-ten support at the time; future champ before champ status |
| Israel Adesanya | 1.25 | sitting UFC middleweight champion |
| Jan Blachowicz | 1.00 | elite/top-5 former champion at LHW |
| Jiri Prochazka 1 | 1.00 | vacant title/former champion context |
| Jamahal Hill | 1.00 | top-five former champion/title defense |
| Jiri Prochazka 2 | 1.00 | top-five rematch/title defense |
| Khalil Rountree Jr. | 0.50 | top-ten title challenger support |
| Magomed Ankalaev 2 | 1.25 | current app timeline includes this sitting champion win; Cody asked what this means |

Working math with Cody-called 0.98 blended MW/LHW adjustment:

| Metric | Value |
|---|---:|
| Quality wins count | 6 |
| Discounted quality index | 6.50 |
| Raw support | 1.00 |
| Support after 2.50 cap | 1.00 |
| Base OQ index | 7.50 |
| Division/era adjustment | 0.98 |
| Adjusted OQ index | 7.35 |
| Formula OQ score | 11.77 |

Remaining Cody calls needed:

- Jiri 1 vacant title/former champ: 1.00 or 0.75?
- Jan: full 1.00 or 0.75 because it was split/older? Closeness should normally be Prime Dominance, not OQ.
- Ankalaev 2 current app timeline: include as 1.25 sitting champ or hold until live timeline is finalized?

---

# Batch 2 working formula summary

These are not live edits.

| Fighter | Current OQ | Working formula OQ | Direction |
|---|---:|---:|---|
| Khabib Nurmagomedov | 8.99 | 12.32 | Raise |
| Islam Makhachev | 9.80 | 14.08 | Raise |
| Demetrious Johnson | 12.88 | 13.94 | Slight raise |
| Jose Aldo | 13.42 | 15.21 | Raise |
| Alex Pereira | 10.06 | 11.77 | Raise |

# Next Cody calls to lock Batch 2

Remaining important calls:

1. Islam: Dustin 0.75 or 1.00?
2. Islam/Pereira: include future/current app timeline wins like JDM and Ankalaev 2?
3. DJ: Horiguchi 0.50 or 0.75?
4. Aldo: Frankie Edgar 1 stays 1.00?
5. Aldo: Jeremy Stephens 1.00 or 0.75?
6. Pereira: Jiri 1 1.00 or 0.75?
7. Pereira: Jan 1.00 or 0.75?
8. Pereira: include Ankalaev 2 as 1.25?

After those are locked, rerun Batch 2 and then continue to old-era Batch 3: Matt Hughes, Randy Couture, B.J. Penn, Chuck Liddell, Dan Henderson.